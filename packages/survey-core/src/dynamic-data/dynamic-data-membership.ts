import { ConditionRunner } from "../conditions/conditionRunner";
import { applyFilter, applySort, createIndexes } from "./dynamic-data-filter";
import { IDynamicDataField, IDynamicDataSort } from "./dynamic-data-interfaces";
import { insertRemap, moveRemap, removeRemap } from "./dynamic-data-record-remap";

// What the membership reads from DynamicDataList. Every member answers from the list's state when it
// is called; nothing is cached on this side.
export interface IDynamicDataMembershipHost {
  // The record count of the window (see DynamicDataList.recordCount): read without reading the records.
  getRecordCount(): number;
  // The records, read only when a filter or a sort has to look at them, and once per decision.
  getRecords(): Array<any>;
  getFields(): Array<IDynamicDataField>;
  // The filter and the sort the list runs over the records it holds: undefined / empty when there is
  // none, or when the source runs it.
  getLocalFilterRunner(): ConditionRunner;
  getLocalSort(): Array<IDynamicDataSort>;
  // The owner materializes an object per record (isViewFrozenOnEdit) and the list has a local view.
  isMembershipFrozen(): boolean;
}

/* Which records of DynamicDataList's window are in the view, in what order, and which ones the
   respondent touched: the owner-hidden flags, the cached views (created, visible, page), the frozen
   membership, the touched records and the memo of the materialized positions. It decides; the list
   acts - it owns the window, the count, the page index and the reads, it clamps the page and raises
   every notification, and it calls one member per write it makes (onRecordInserted, onRecordRemoved,
   onRecordMoved). */
export class DynamicDataMembership {
  private hiddenFlags: Array<boolean> = [];
  // Cached views; undefined means "recompute on the next read".
  private createdIndexes: Array<number> = undefined;
  private visibleIndexes: Array<number> = undefined;
  private pageIndexes: Array<number> = undefined;
  // The record count the cached views were built for: the records can change outside the list
  // (survey.data = ..., a trigger, clearValue, a default value, a rowCount that grows the padding),
  // and a read-through list sees that at once while its views would not.
  private viewsRecordCount: number = -1;
  /* The frozen membership (isViewFrozenOnEdit): which records are in the view, and in what order, is
     decided when filter/sort is assigned and maintained by the list's own writes until the next
     assignment or refreshView(). frozenRecordCount is the record count it describes: a record count
     that changed without the list doing it means the membership no longer fits. */
  private frozenCreatedIndexes: Array<number> = undefined;
  private frozenRecordCount: number = -1;
  /* The records the respondent touched since the view was last decided - added through the owner's
     add (runAddScope) or edited through an input (markRecordTouched) - as sorted record indexes. A
     decision of the view the owner hands a remap of its records to (rebuild) keeps them where they
     were, and so does the refill after a remove (keepTouchedRecords). Every other decision of the
     view, every other committed read and a source swap drop them. The list's own inserts, removes and
     moves renumber them, also while no membership is frozen: the window of a source that pages itself
     has no local view, and its refill keeps them too. Nothing reports whether a given record is
     touched. */
  private touchedIndexes: Array<number> = [];
  private addScopeDepth: number = 0;
  // Set by rebuild for the one decision of the view that keeps the touched records.
  private keptTouched: Array<{ index: number, position: number }> = undefined;
  private materializedPositionsSource: Array<number>;
  private materializedPositions: { [index: number]: number };

  constructor(private host: IDynamicDataMembershipHost) { }

  // Returns whether the flag changed.
  public setRecordVisible(index: number, visible: boolean): boolean {
    if (index < 0 || index >= this.host.getRecordCount()) return false;
    const isHidden = !visible;
    if (!!this.hiddenFlags[index] === isHidden) return false;
    this.alignHiddenFlags(this.host.getRecordCount());
    this.hiddenFlags[index] = isHidden;
    this.resetViews();
    return true;
  }
  public isRecordVisible(index: number): boolean {
    if (index < 0 || index >= this.host.getRecordCount()) return false;
    return !this.hiddenFlags[index];
  }
  // The owner-visibility of many records at once: one view reset for the whole run. Returns whether a
  // flag changed.
  public setRecordsVisible(isVisible: (index: number) => boolean): boolean {
    const count = this.host.getRecordCount();
    this.alignHiddenFlags(count);
    let isChanged = false;
    for (let i = 0; i < count; i++) {
      const isHidden = !isVisible(i);
      if (!!this.hiddenFlags[i] !== isHidden) {
        this.hiddenFlags[i] = isHidden;
        isChanged = true;
      }
    }
    if (isChanged)this.resetViews();
    return isChanged;
  }
  // The flags are spliced in step with the records, so they must stay a dense array of the same
  // length: a shorter one would shift the wrong entries.
  private alignHiddenFlags(length: number): void {
    if (this.hiddenFlags.length === length) return;
    while(this.hiddenFlags.length < length) {
      this.hiddenFlags.push(false);
    }
    this.hiddenFlags.length = length;
  }

  /* The list's writes. countAfter is the record count the write produces: it is taken before the
     write, because with a read-through source the records only change when the push assigns the
     owner storage, and the membership has to carry the count it will have then. Each one keeps the
     flags, the membership and the touched set in step with the records and drops the cached views. */
  public onRecordInserted(at: number, countAfter: number): void {
    this.alignHiddenFlags(countAfter - 1);
    this.hiddenFlags.splice(at, 0, false);
    this.insertIntoMembership(at, countAfter);
    this.remapTouched(insertRemap(at));
    // Touched before the push, which runs the survey handlers: an assignment one of them makes keeps it.
    if (this.addScopeDepth > 0)this.addTouched(at);
    this.resetViews();
  }
  public onRecordRemoved(index: number, countAfter: number): void {
    this.alignHiddenFlags(countAfter + 1);
    this.hiddenFlags.splice(index, 1);
    this.removeFromMembership(index, countAfter);
    this.remapTouched(removeRemap(index));
    this.resetViews();
  }
  public onRecordMoved(fromIndex: number, toIndex: number, recordCount: number): void {
    this.alignHiddenFlags(recordCount);
    // A visibility flag belongs to a record, not to a slot: it travels with it.
    const flag = this.hiddenFlags[fromIndex];
    this.hiddenFlags.splice(fromIndex, 1);
    this.hiddenFlags.splice(toIndex, 0, flag);
    this.moveInMembership(fromIndex, toIndex, recordCount);
    this.remapTouched(moveRemap(fromIndex, toIndex));
    this.resetViews();
  }

  // The records that have an object: the ones that pass the filter, in sort order, owner-hidden ones
  // included. With no filter and no sort this is 0 ... count-1.
  public getCreatedIndexes(): Array<number> {
    this.ensureViews();
    return this.createdIndexes;
  }
  public getVisibleIndexes(): Array<number> {
    this.ensureViews();
    return this.visibleIndexes;
  }
  // isPagedBySource: a paging source returns one storage page, so the loaded window IS the page.
  public getPageIndexes(pageSize: number, pageIndex: number, isPagedBySource: boolean): Array<number> {
    // The visible indexes come first: they drop a page cache that an external record change made
    // stale.
    const visible = this.getVisibleIndexes();
    if (!this.pageIndexes) {
      if (pageSize <= 0 || isPagedBySource) {
        this.pageIndexes = visible;
      } else {
        const start = pageIndex * pageSize;
        this.pageIndexes = visible.slice(start, start + pageSize);
      }
    }
    return this.pageIndexes;
  }
  // Another page index: the page is cut again on the next read.
  public resetPage(): void {
    this.pageIndexes = undefined;
  }
  public resetViews(): void {
    this.createdIndexes = undefined;
    this.visibleIndexes = undefined;
    this.pageIndexes = undefined;
    this.viewsRecordCount = -1;
  }
  private ensureViews(): void {
    const recordCount = this.host.getRecordCount();
    if (!!this.visibleIndexes) {
      if (this.viewsRecordCount === recordCount) return;
      // The records changed outside the list: the cached views describe a window that is gone. A
      // content change of the same length cannot be seen here - the owner reports it through
      // invalidateViews().
      this.pageIndexes = undefined;
    }
    this.alignHiddenFlags(recordCount);
    let created = this.getFrozenCreatedIndexes(recordCount);
    if (!created) {
      const filterRunner = this.host.getLocalFilterRunner();
      const sort = this.host.getLocalSort();
      const needFilter = !!filterRunner;
      const needSort = sort.length > 0;
      // Read once, and only when the filter or the sort has to look at the records.
      const records = needFilter || needSort ? this.host.getRecords() : undefined;
      const fields = needFilter || needSort ? this.host.getFields() : undefined;
      created = needFilter ? applyFilter(records, filterRunner, fields) : createIndexes(recordCount);
      if (needSort) {
        created = applySort(records, sort, fields, created);
      }
      if (!!this.keptTouched) {
        created = this.keepTouchedInView(created, this.keptTouched);
      }
      this.freezeCreatedIndexes(created, recordCount);
    }
    // The owner-hidden records keep the order the filter and the sort gave them; dropping them from
    // the created indexes is the only difference between the two views.
    let visible = created;
    // The flags are dense and aligned here (alignHiddenFlags above), so one scan of them answers
    // whether the filter below has anything to drop; when it has not, the two views share the array.
    if (this.hiddenFlags.indexOf(true) > -1) {
      visible = created.filter((index: number): boolean => !this.hiddenFlags[index]);
    }
    this.createdIndexes = created;
    this.visibleIndexes = visible;
    this.viewsRecordCount = recordCount;
  }
  /* record index -> position among the materialized records (the list's getMaterializedIndexes),
     memoized on the identity of that array: the list never changes a view array in place, it replaces
     it, so a new array is the only way the map can go stale. */
  public getMaterializedPositions(indexes: Array<number>): { [index: number]: number } {
    if (this.materializedPositionsSource !== indexes) {
      const res: { [index: number]: number } = {};
      indexes.forEach((index: number, pos: number): void => { res[index] = pos; });
      this.materializedPositionsSource = indexes;
      this.materializedPositions = res;
    }
    return this.materializedPositions;
  }

  /* A window that was replaced as a whole leaves nothing behind: the flags and the membership of the
     records it held are decided again over the new one. keepTouched: the refill after a remove keeps
     the touched records where keepTouchedRecords put them. */
  public reset(keepTouched: boolean = false): void {
    this.hiddenFlags = [];
    if (!keepTouched)this.clearTouched();
    this.resetMembership();
    this.resetViews();
    this.refreezeMembership();
  }
  // The window is gone (a source swap, dispose): nothing is decided until the next read.
  public clear(): void {
    this.hiddenFlags = [];
    this.clearTouched();
    this.resetMembership();
    this.resetViews();
  }
  /* Re-decides the membership over the records as they are now, and re-freezes it. The touched
     records a remap places are put back where they were in the view: the untouched ones are filtered
     and sorted, and each touched one goes back to its position in the previous view (ensureViews).
     previousCreated: the created indexes before the change, when the owner took them; otherwise the
     frozen membership. */
  public rebuild(remap?: (index: number) => number, previousCreated?: Array<number>): void {
    const kept = this.takeKeptTouched(remap, previousCreated || this.frozenCreatedIndexes);
    this.resetMembership();
    this.resetViews();
    this.keptTouched = kept;
    try {
      this.refreezeMembership();
    } finally {
      this.keptTouched = undefined;
    }
  }
  /* The owner changed how many records its storage holds without writing through the list. The
     records that are new join the view (an added record is always in it) and the ones that are gone
     leave it; the membership of the rest is not re-evaluated. */
  public syncMembershipWithRecordCount(): void {
    this.resetViews();
    const count = this.host.getRecordCount();
    this.remapTouched((index: number): number => index < count ? index : -1);
    this.syncFrozenMembershipWithRecordCount();
  }
  private syncFrozenMembershipWithRecordCount(): void {
    if (!this.frozenCreatedIndexes) {
      this.refreezeMembership();
      return;
    }
    const count = this.host.getRecordCount();
    if (count === this.frozenRecordCount) return;
    let created = this.frozenCreatedIndexes;
    if (count < this.frozenRecordCount) {
      created = created.filter((index: number): boolean => index < count);
    } else {
      created = created.slice();
      for (let i = this.frozenRecordCount; i < count; i++) {
        created.push(i);
        // A record count the owner's add grew: the new record is the one added (see runAddScope).
        if (this.addScopeDepth > 0)this.addTouched(i);
      }
    }
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = count;
  }
  private getFrozenCreatedIndexes(recordCount: number): Array<number> {
    if (!this.host.isMembershipFrozen() || !this.frozenCreatedIndexes) return undefined;
    return this.frozenRecordCount === recordCount ? this.frozenCreatedIndexes : undefined;
  }
  private freezeCreatedIndexes(created: Array<number>, recordCount: number): void {
    if (!this.host.isMembershipFrozen()) {
      this.resetMembership();
      return;
    }
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = recordCount;
  }
  public resetMembership(): void {
    this.frozenCreatedIndexes = undefined;
    this.frozenRecordCount = -1;
  }
  /* The membership is decided when it is reset, not when it is first read: a write made before the
     first read would otherwise be the one that decides it, and an edit may not decide the view. */
  public refreezeMembership(): void {
    if (this.host.isMembershipFrozen()) {
      this.ensureViews();
    }
  }
  private insertIntoMembership(at: number, newRecordCount: number): void {
    if (!this.frozenCreatedIndexes) return;
    const created = this.frozenCreatedIndexes.map(insertRemap(at));
    // The record that was pushed aside keeps its place; the new object takes the position in front
    // of it, which for an append is the end.
    const position = created.indexOf(at + 1);
    created.splice(position < 0 ? created.length : position, 0, at);
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = newRecordCount;
  }
  private removeFromMembership(index: number, newRecordCount: number): void {
    if (!this.frozenCreatedIndexes) return;
    this.frozenCreatedIndexes = this.frozenCreatedIndexes.map(removeRemap(index)).filter((i: number): boolean => i > -1);
    this.frozenRecordCount = newRecordCount;
  }
  private moveInMembership(fromIndex: number, toIndex: number, recordCount: number): void {
    if (!this.frozenCreatedIndexes) return;
    const fromPosition = this.frozenCreatedIndexes.indexOf(fromIndex);
    const toPosition = this.frozenCreatedIndexes.indexOf(toIndex);
    // The records renumber; the objects keep their own order except for the one that moved.
    const created = this.frozenCreatedIndexes.map(moveRemap(fromIndex, toIndex));
    if (fromPosition > -1 && toPosition > -1) {
      const moved = created[fromPosition];
      created.splice(fromPosition, 1);
      created.splice(toPosition, 0, moved);
    }
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = recordCount;
  }

  // The owner's add. Every record the list inserts or appends inside it - also by a record count that
  // grows (syncMembershipWithRecordCount) - is touched as it enters the list.
  public runAddScope<T>(func: () => T): T {
    this.addScopeDepth++;
    try {
      return func();
    } finally {
      this.addScopeDepth--;
    }
  }
  // A record the respondent edited through an input.
  public markRecordTouched(index: number): void {
    if (index < 0 || index >= this.host.getRecordCount()) return;
    this.addTouched(index);
  }
  public get hasTouchedRecords(): boolean {
    return this.touchedIndexes.length > 0;
  }
  public clearTouched(): void {
    this.touchedIndexes = [];
  }
  private addTouched(index: number): void {
    const indexes = this.touchedIndexes;
    let at = 0;
    while(at < indexes.length && indexes[at] < index) at++;
    if (indexes[at] === index) return;
    indexes.splice(at, 0, index);
  }
  // Removed records (-1) and records the remap cannot place (undefined) leave the set.
  private remapTouched(remap: (index: number) => number): void {
    if (this.touchedIndexes.length === 0) return;
    const old = this.touchedIndexes;
    this.touchedIndexes = [];
    old.forEach((index: number): void => {
      const to = remap(index);
      if (to !== undefined && to > -1)this.addTouched(to);
    });
  }
  /* The touched records that follow a remap, with their positions in the view that is about to be
     decided again - in ascending order of position. The set follows the remap; without one it is
     dropped. */
  private takeKeptTouched(remap: (index: number) => number, oldCreated: Array<number>): Array<{ index: number, position: number }> {
    if (this.touchedIndexes.length === 0) return undefined;
    if (!remap) {
      this.clearTouched();
      return undefined;
    }
    const res: Array<{ index: number, position: number }> = [];
    this.touchedIndexes.forEach((index: number): void => {
      const to = remap(index);
      const position = !!oldCreated ? oldCreated.indexOf(index) : -1;
      if (to === undefined || to < 0 || position < 0) return;
      res.push({ index: to, position: position });
    });
    this.touchedIndexes = [];
    res.forEach((item: { index: number, position: number }): void => this.addTouched(item.index));
    return res.sort((a, b): number => a.position - b.position);
  }
  /* The view decided over every record, with the touched records put back: taken out of it, then
     each one inserted at its old position, clamped to the end. */
  private keepTouchedInView(created: Array<number>, kept: Array<{ index: number, position: number }>): Array<number> {
    const indexes = kept.map((item: { index: number, position: number }): number => item.index);
    const res = created.filter((index: number): boolean => indexes.indexOf(index) < 0);
    kept.forEach((item: { index: number, position: number }): void => {
      res.splice(Math.min(item.position, res.length), 0, item.index);
    });
    return res;
  }
  /* The refill after a remove (DynamicDataList.refillWindowAfterRemove) keeps the records the
     respondent touched on the page. Every record of the answer that has the key of a touched record is
     taken out of it, and each touched record goes back to its old index in the window, in ascending
     order, clamped to the end - whether or not the server returned it, and wherever it did. The shown
     record is the answer's when the answer holds the key: every write was acknowledged before the read
     started, so the answer has the client's fields and what the server computed. A record without a
     key (an insert the source refused) is not on the server and is kept as it is. The window may hold
     more records than the page size then. Returns the window; the touched set names the kept records
     in it. */
  public keepTouchedRecords(answer: Array<any>, windowRecords: Array<any>, getKey: (record: any) => any): Array<any> {
    const touched = this.touchedIndexes;
    if (touched.length === 0) return answer;
    const answerByKey = new Map<any, any>();
    answer.forEach((record: any): void => {
      const key = getKey(record);
      if (key !== undefined && key !== null && !answerByKey.has(key)) answerByKey.set(key, record);
    });
    const kept = touched.map((index: number): { index: number, key: any, record: any } => {
      const record = windowRecords[index];
      const key = getKey(record);
      const hasKey = key !== undefined && key !== null;
      return { index: index, key: hasKey ? key : undefined, record: hasKey && answerByKey.has(key) ? answerByKey.get(key) : record };
    }).filter((item: { index: number, key: any, record: any }): boolean => item.record !== undefined);
    const keptKeys = kept.filter((item: { key: any }): boolean => item.key !== undefined).map((item: { key: any }): any => item.key);
    const res = answer.filter((record: any): boolean => {
      const key = getKey(record);
      return key === undefined || key === null || keptKeys.indexOf(key) < 0;
    });
    this.touchedIndexes = [];
    kept.forEach((item: { index: number, record: any }): void => {
      const at = Math.min(item.index, res.length);
      res.splice(at, 0, item.record);
      this.addTouched(at);
    });
    return res;
  }
}
