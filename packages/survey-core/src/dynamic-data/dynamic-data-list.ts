import { ConditionRunner } from "../conditions/conditionRunner";
import { Helpers } from "../helpers";
import { applyFilter, applySort, createFilterRunner, createIndexes } from "./dynamic-data-filter";
import {
  DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner,
  IDynamicDataReadRequest, IDynamicDataSort, IDynamicDataSource
} from "./dynamic-data-interfaces";
import { ArrayDynamicDataSource } from "./dynamic-data-sources";

// Index vocabulary - binding for every method and parameter name in this file:
//
// | name             | meaning                                                          | range                 |
// |------------------|------------------------------------------------------------------|-----------------------|
// | index            | record index: the position in the loaded window. Every method     | 0 ... loadedCount-1   |
// |                  | that takes or returns an unqualified index means this one.        |                       |
// | sourceIndex      | windowOffset + index; what the list passes to the source editing  | 0 ... count-1         |
// |                  | methods. Equals the record index for a source without readRange.  |                       |
// | visibleIndex     | position among the records that pass the filter and are not       | 0 ... visibleCount-1  |
// |                  | owner-hidden, in sort order, UNPAGED.                             |                       |
// | pageLocalIndex   | position on the current page                                      | 0 ... pageRecordCount-1 |
// |                  | (= visibleIndex - pageIndex * pageSize).                          |                       |
//
// The counts follow the same split: "count" is the STORAGE count (total for a paged source, else the
// window length) and a filter never changes it; "filteredCount" is what passes the filter;
// "visibleCount" is filteredCount minus the owner-hidden records; "loadedCount" is the window length.

function isPromiseLike(value: any): boolean {
  // Never instanceof Promise: a source may return any thenable.
  return !!value && typeof value.then === "function";
}
/* What a write tells pushToSource about the record it addresses, beyond the call itself: the key it
   was enqueued with, the position an update was made at (which is what the range check of a read in
   flight compares for a source without a key), and for an insert the window object of the new
   record, which its answer is matched by. */
interface IDynamicDataPushInfo {
  sourceIndex?: number;
  key?: any;
  insertedRecord?: any;
}
function getChangedFields(oldRecord: any, newRecord: any): Array<string> {
  const res: Array<string> = [];
  const add = (key: string): void => {
    if (res.indexOf(key) < 0) res.push(key);
  };
  for (const key in oldRecord || {}) {
    if (!Helpers.isTwoValueEquals((oldRecord || {})[key], (newRecord || {})[key])) add(key);
  }
  for (const key in newRecord || {}) {
    if (!Helpers.isTwoValueEquals((oldRecord || {})[key], (newRecord || {})[key])) add(key);
  }
  return res;
}

export class DynamicDataList {
  private _source: IDynamicDataSource;
  private windowRecords: Array<any> = [];
  private hiddenFlags: Array<boolean> = [];
  private hiddenCount: number = 0;
  private _windowOffset: number = 0;
  private _total: number = undefined;
  /* Committed together with the window (see commitRead). A source that cannot count its records
     cheaply answers without a total: the list then knows only what it has seen, and hasMore is what
     tells it that there is a page behind the one it holds. Both are true/false by default, which is
     what every source that is not a paging one answers: read() returns the whole storage. */
  private _isCountKnown: boolean = true;
  private _hasMore: boolean = false;
  /* The filter a total the list worked out ITSELF belongs to (see commitCount). Such a total
     outlives the read that found it - a walk back to the first page must not send the pager looking
     for the end all over again - but it describes one set of records, and another filter is another
     set. undefined = the total is the source's own answer, or there is none. */
  private discoveredTotalFilter: string = undefined;
  private _isLoading: boolean = false;
  private _filter: string = "";
  private filterRunner: ConditionRunner = undefined;
  private _sort: Array<IDynamicDataSort> = [];
  private _pageSize: number = 0;
  private _pageIndex: number = 0;
  private isLoaded: boolean = false;
  private isDisposed: boolean = false;
  private readRequestId: number = 0;
  // The push chain: one write in flight at a time, the next starts when the previous settles. It
  // always fulfills - a rejected push is reported through onError and the chain continues.
  private pushChain: Promise<void> = undefined;
  private pendingPushes: number = 0;
  /* Keyed source only: one entry per insert that has not answered yet, holding the window object of
     the new record. The object is what the answer is matched by - a key the record does not have yet
     cannot be - and every write replaces that object, so replaceRecord re-points the entry instead
     of the entry holding the object add created, which one keystroke would already have discarded. */
  private pendingInserts: Array<{ record: any }> = [];
  /* The asynchronous read in flight: the range it asked for, and whether a write enqueued since it
     was issued made its answer stale (see startRead). */
  private inFlightRead: {
    skip: number, take: number, useReadRange: boolean, isOvertaken: boolean,
    /* Keyed source only: the keys of the records updated while this read was in flight. There a
       position cannot decide it - another writer may move a record between the pages while the read
       runs - so the answer is checked for those records instead (see isAnswerOvertaken). */
    updatedKeys: Array<any>,
  } = undefined;
  /* A read requested while writes are pending waits for the chain to drain (see startRead). The
     requests coalesce into one: queuedReadUseOffset stays true only while every one of them was a
     refresh of the window - a load() recomputes the offset from pageIndex, which is what a page
     change asked for. */
  private isReadQueued: boolean = false;
  private queuedReadUseOffset: boolean = true;
  private queuedReadWaiter: { promise: Promise<void>, resolve: (value?: any) => void } = undefined;
  // Bumped by every source change. A push carries the epoch it was enqueued in, so that a chain left
  // running against a replaced source cannot report back into the list.
  private sourceEpoch: number = 0;
  // Cached views; undefined means "recompute on the next read".
  private createdIndexes: Array<number> = undefined;
  private visibleIndexes: Array<number> = undefined;
  private pageIndexes: Array<number> = undefined;
  /* The frozen membership (isViewFrozenOnEdit): which records are in the view, and in what order, is
     decided when filter/sort is assigned and maintained by the list's own writes until the next
     assignment or refreshView(). frozenRecordCount is the record count it describes: a record count
     that changed without the list doing it means the membership no longer fits. */
  private frozenCreatedIndexes: Array<number> = undefined;
  private frozenRecordCount: number = -1;
  /* > 0 while the list applies a write of its own. A write-through source assigns the owner's
     storage, and the owner reports that assignment back through invalidateViews(); the membership
     must not be re-evaluated by the very write that maintains it. */
  private writeDepth: number = 0;
  // The record count the cached views were built for: the records can change outside the list
  // (survey.data = ..., a trigger, clearValue, a default value, a rowCount that grows the padding),
  // and a read-through list sees that at once while its views would not.
  private viewsRecordCount: number = -1;

  public onChanged: (change: IDynamicDataListChange) => void;
  public onError: (error: any, operation: DynamicDataOperation) => void;

  constructor(source: IDynamicDataSource, public owner?: IDynamicDataOwner) {
    this._source = source;
  }
  // The exact comparison DynamicItemModelBase.isValueChanged uses, so that the questions can
  // delegate to it instead of keeping their own copy.
  public static isValueChanged(newValue: any, oldValue: any): boolean {
    return !Helpers.isTwoValueEquals(newValue, oldValue, false, true, false);
  }

  // An owner whose source reads and writes its storage directly - the questions, whose
  // ArrayDynamicDataSource is a getter/setter pair over question.value - sets this flag and the list
  // keeps no window: read() IS the storage and every write is synchronous and visible to the next
  // read. A window would be a second source of truth that goes stale on every assignment made
  // outside the list (survey.data = ..., a trigger, clearValue, a default value) and would hand out
  // record objects the owner no longer holds. It stays off by default: a paged or asynchronous
  // source cannot be read on demand.
  public isReadThrough: boolean = false;
  /* Owners that materialize an object per record - the two questions - set this flag: the view of a
     bare list re-evaluates itself on every write, which for them would dispose a row from inside its
     own cell's value-changed event and re-sort the table under the cursor on every keystroke. With
     the flag on, membership is decided when filter/sort is assigned and on refreshView(); between
     those points an edited record keeps its place, an added record is always in the view, a removed
     record leaves it, and only a change made outside the list re-evaluates it. */
  public isViewFrozenOnEdit: boolean = false;
  private get useReadThrough(): boolean {
    return this.isReadThrough && !this.hasReadRange && this._source instanceof ArrayDynamicDataSource;
  }
  private get records(): Array<any> {
    if (!this.useReadThrough) return this.windowRecords;
    const res = (<ArrayDynamicDataSource>this._source).read();
    return Array.isArray(res) ? res : [];
  }
  private set records(val: Array<any>) {
    this.windowRecords = val;
  }
  // The length of records without reading them: a read-through source may compose the array on every
  // read (the matrix pads its value up to rowCount), and most readers want only the count.
  private get recordCount(): number {
    if (this.useReadThrough && typeof this._source.count === "function") return this._source.count();
    return this.records.length;
  }
  public get source(): IDynamicDataSource {
    return this._source;
  }
  public set source(v: IDynamicDataSource) {
    if (this._source === v) return;
    /* A read that is still in flight counts as loaded: the list was asked to fill itself and the
       answer is merely late, so the source that replaces the one being read has to be read too.
       Without the isLoading half a source swapped during the first read would never be read at all. */
    const wasLoaded = this.isLoaded || this._isLoading;
    this._source = v;
    this.sourceEpoch++;
    /* The push chain is detached, not drained: the queued edits belong to the old source and keep
       running against it (they still report their failures through onError), but they must not
       report back into the list - and the new source must not wait for them before its first read.
       The pushes of a replaced source are therefore invisible to hasPendingWrites: a source that is
       no longer the storage of this list no longer gates its reads. */
    this.pushChain = undefined;
    this.pendingPushes = 0;
    // A read queued behind the detached chain dies with it: the new source is read below.
    this.dropQueuedRead();
    // Discards the result of a read that is still in flight against the old source.
    this.readRequestId++;
    this.inFlightRead = undefined;
    // The old read is abandoned, whatever happens next starts from "not loading".
    this.setIsLoading(false);
    this.resetWindow();
    /* The filter and the sort belong to the list, not to the source it happened to have. Which side
       runs them is a capability of the source, so a swap re-decides it: a filter a paging source ran
       on its own side has no local runner yet, and one the list ran locally is handed to a paging
       source inside the very next read request - otherwise the view the owner is showing would
       disappear with the swap. */
    this.updateFilterRunner();
    if (wasLoaded) {
      // One read, with the view inside its request: nothing has to be "applied" to the source first.
      this.load();
    } else {
      this.raiseChanged({ type: "reset" });
    }
  }
  /* One record operation of the owner is often several list operations, and with a source that
     writes through its owner's storage every one of them is an assignment of its own - and with it
     a change notification the owner never asked for. A source that can collect its writes (the
     array source) does so; every other source just runs the function. */
  public batch(func: () => void): void {
    const source: any = this._source;
    this.writeDepth++;
    try {
      if (!!source && typeof source.batch === "function") {
        source.batch(func);
      } else {
        func();
      }
    } finally {
      this.endWrite();
    }
  }
  // True while the list applies a write of its own: the owner uses it to tell an assignment it
  // caused itself from one made outside (survey.data, a trigger, clearValue).
  public get isWriting(): boolean {
    return this.writeDepth > 0;
  }
  private endWrite(): void {
    if (this.writeDepth > 0)this.writeDepth--;
  }
  public load(): void | Promise<void> {
    return this.startRead(false);
  }
  public refresh(): void | Promise<void> {
    return this.startRead(true);
  }
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public get hasPendingWrites(): boolean {
    return this.pendingPushes > 0;
  }
  // True from the moment a read is requested until its window is committed or it is rejected,
  // including the time it waits for pending writes - isLoading only covers the read in flight.
  public get hasPendingRead(): boolean {
    return this.isReadQueued || !!this.inFlightRead;
  }
  public get windowOffset(): number {
    return this._windowOffset;
  }

  /* The storage count. With an unknown total (isCountKnown false) it is the count of the records
     known to exist - the ones that have been seen, a lower bound - and never NaN or -1: a source
     that cannot count its records still has at least the ones it has handed over. */
  public get count(): number {
    return this._total !== undefined ? this._total : this._windowOffset + this.recordCount;
  }
  // False while the source answers without a total: count is a lower bound and pageCount is the
  // number of pages known to exist.
  public get isCountKnown(): boolean {
    return this._isCountKnown;
  }
  // Are there records behind the loaded window? It is what a pager's "next" is built from.
  public get hasMore(): boolean {
    return this._hasMore;
  }
  public get filteredCount(): number {
    if (this.hasReadRange || !this._filter) return this.count;
    return this.getCreatedIndexes().length;
  }
  public get visibleCount(): number {
    return this.getVisibleIndexes().length;
  }
  public get loadedCount(): number {
    return this.recordCount;
  }
  public ensureCount(n: number, createRecord?: (i: number) => any): void {
    this.checkWindowIsWholeStorage("ensureCount");
    this.writeDepth++;
    for (let i = this.loadedCount; i < n; i++) {
      this.add(!!createRecord ? createRecord(i) : {});
    }
    this.endWrite();
  }
  public truncate(n: number): void {
    this.checkWindowIsWholeStorage("truncate");
    this.writeDepth++;
    for (let i = this.loadedCount - 1; i >= n && i >= 0; i--) {
      this.remove(i);
    }
    this.endWrite();
  }

  public getRecord(index: number): any {
    // The guard is the count; the element needs the array, read once.
    if (index < 0 || index >= this.recordCount) return undefined;
    return this.records[index];
  }
  public getValue(index: number, field: string): any {
    const record = this.getRecord(index);
    return !!record ? record[field] : undefined;
  }
  public setValue(index: number, field: string, value: any): boolean {
    const record = this.getRecord(index);
    if (!record) return false;
    if (!DynamicDataList.isValueChanged(value, record[field])) return false;
    const newRecord = this.copyRecord(record);
    // Mirrors question_paneldynamic.updateItemValue: an empty value deletes the key.
    if (Helpers.isValueEmpty(value)) {
      delete newRecord[field];
    } else {
      newRecord[field] = value;
    }
    const sourceIndex = this._windowOffset + index;
    // The key of the record that is being replaced, resolved before the replacement: that record is
    // the one the respondent edited, and the copy made on write is not in the window yet.
    const key = this.getRecordKey(index);
    this.writeDepth++;
    this.replaceRecord(index, newRecord);
    // The push comes before the notification: with a read-through source the push IS the local write,
    // so the owner must not be notified of a change it cannot read yet.
    this.pushToSource("update",
      (source: IDynamicDataSource): any => source.update(key, newRecord, [field]),
      { sourceIndex: sourceIndex, key: key });
    this.endWrite();
    this.raiseChanged({ type: "recordChanged", index: index, field: field });
    return true;
  }
  // force: push the record even when it did not change. An owner that composes its window on the
  // fly - the matrix pads question.value up to rowCount on read - uses it when the composed records
  // themselves have to reach the storage: the stored value changes although the record does not.
  public setRecord(index: number, record: any, force: boolean = false): boolean {
    const oldRecord = this.getRecord(index);
    if (index < 0 || index >= this.recordCount) return false;
    if (!force && !DynamicDataList.isValueChanged(record, oldRecord)) return false;
    const changedFields = getChangedFields(oldRecord, record);
    const sourceIndex = this._windowOffset + index;
    // As in setValue: the key belongs to the record being replaced, not to the one replacing it.
    const key = this.getRecordKey(index);
    this.writeDepth++;
    this.replaceRecord(index, record);
    this.pushToSource("update",
      (source: IDynamicDataSource): any => source.update(key, record, changedFields),
      { sourceIndex: sourceIndex, key: key });
    this.endWrite();
    this.raiseChanged({ type: "recordChanged", index: index, field: undefined });
    return true;
  }
  /* createdPosition (internal) is the position the new object takes among the created ones. It is
     omitted for an ordinary add: the record pushed aside keeps its place and the new one takes the
     position in front of it, which for an append is the end. */
  public add(record?: any, index?: number, createdPosition?: number): number {
    const newRecord = record === undefined ? {} : record;
    // The count the write produces. It is taken before the write: with a read-through source the
    // records only change when the push assigns the owner storage, and the membership has to carry
    // the count it will have then, not the one it still has.
    const countAfter = this.recordCount + 1;
    const at = index === undefined || index === null
      ? this.recordCount
      : Math.max(0, Math.min(index, this.recordCount));
    this.alignHiddenFlags();
    this.writeDepth++;
    if (!this.useReadThrough) {
      const newRecords = this.windowRecords.slice();
      newRecords.splice(at, 0, newRecord);
      this.windowRecords = newRecords;
    }
    this.hiddenFlags.splice(at, 0, false);
    if (this._total !== undefined)this._total++;
    this.updateHasMoreFromTotal(countAfter);
    this.insertIntoMembership(at, createdPosition, countAfter);
    this.resetViews();
    const sourceIndex = this._windowOffset + at;
    /* An added record has no key yet: the position says where it goes and the source assigns the
       key, which the answer of insert brings back (applyInsertAnswer). */
    this.pushToSource("insert", (source: IDynamicDataSource): any => source.insert(newRecord, sourceIndex),
      { insertedRecord: newRecord });
    this.endWrite();
    this.raiseChanged({ type: "recordAdded", index: at });
    return at;
  }
  /* Adds a record so that its object takes exactly the given position among the created ones; the
     record itself goes where the object that occupied that position holds its own (at the end when
     the new object is the last one), so that the two arrays cannot disagree. Returns the record
     index. */
  public addAtCreatedIndex(record: any, createdIndex: number): number {
    const created = this.getCreatedIndexes();
    const position = Math.max(0, Math.min(createdIndex, created.length));
    const at = position < created.length ? created[position] : this.recordCount;
    return this.add(record, at, position);
  }
  public remove(index: number): void {
    if (index < 0 || index >= this.recordCount) return;
    /* Before the splice: afterwards this slot holds the record that moved up into it, and the last
       record of the window has no slot at all. */
    const key = this.getRecordKey(index);
    const countAfter = this.recordCount - 1;
    this.alignHiddenFlags();
    this.writeDepth++;
    if (!this.useReadThrough) {
      const newRecords = this.windowRecords.slice();
      newRecords.splice(index, 1);
      this.windowRecords = newRecords;
    }
    if (this.hiddenFlags[index])this.hiddenCount--;
    this.hiddenFlags.splice(index, 1);
    if (this._total !== undefined)this._total--;
    this.updateHasMoreFromTotal(countAfter);
    this.removeFromMembership(index, countAfter);
    this.resetViews();
    this.pushToSource("remove", (source: IDynamicDataSource): any => source.remove(key), { key: key });
    this.endWrite();
    this.raiseChanged({ type: "recordRemoved", index: index });
    // Never two reads for one remove: a clamp to the previous page has already asked for its page.
    if (!this.clampPageIndexAfterChange()) {
      this.refillWindowAfterRemove();
    }
  }
  /* With a source that pages itself the window IS the page, so a remove leaves it one record short
     while the records behind it moved up on the server. The page is read again when it came up short
     and the source still has records behind it; a remove on the last page just leaves it shorter.
     The whole page and not only the one record that moved up (readRange(offset + length, 1)): that
     read would keep the row objects, but it trusts that the server's order did not change between the
     two reads and it leaves the total unverified. The full read is authoritative for both, and it is
     one request either way. refresh() and not load(): the window stays at its own offset, load()
     recomputes it from pageIndex and the two agree only by coincidence. */
  private refillWindowAfterRemove(): void {
    if (!this.hasReadRange || !this.isLoaded || this._pageSize <= 0) return;
    // hasMore and not "windowOffset + length < count": with an unknown total the count is the
    // records seen so far and would never say that the source has more. With a known total the two
    // are the same value - updateHasMoreFromTotal recomputed the flag when the remove decremented it.
    if (this.recordCount >= this._pageSize || !this._hasMore) return;
    this.refresh();
  }
  // The committed hasMore follows a total the list changed itself; with an unknown total the flag
  // stays as the source left it - a record the list removed cannot tell it what is behind the window.
  private updateHasMoreFromTotal(recordCount: number): void {
    if (this._total === undefined) return;
    this._hasMore = this._windowOffset + recordCount < this._total;
  }
  public move(fromIndex: number, toIndex: number): void {
    const length = this.recordCount;
    if (fromIndex < 0 || fromIndex >= length || toIndex < 0 || toIndex >= length) return;
    if (fromIndex === toIndex) return;
    // Before the splice, for the same reason as in remove.
    const key = this.getRecordKey(fromIndex);
    this.alignHiddenFlags();
    this.writeDepth++;
    if (!this.useReadThrough) {
      const newRecords = this.windowRecords.slice();
      const record = newRecords[fromIndex];
      newRecords.splice(fromIndex, 1);
      newRecords.splice(toIndex, 0, record);
      this.windowRecords = newRecords;
    }
    // A visibility flag belongs to a record, not to a slot: it travels with it.
    const flag = this.hiddenFlags[fromIndex];
    this.hiddenFlags.splice(fromIndex, 1);
    this.hiddenFlags.splice(toIndex, 0, flag);
    this.moveInMembership(fromIndex, toIndex);
    this.resetViews();
    const toSourceIndex = this._windowOffset + toIndex;
    this.pushToSource("move", (source: IDynamicDataSource): any => source.move(key, toSourceIndex),
      { key: key });
    this.endWrite();
    this.raiseChanged({ type: "recordMoved", from: fromIndex, to: toIndex });
  }

  // Returns whether the flag changed: the owner syncs its page state only then.
  public setRecordVisible(index: number, visible: boolean): boolean {
    if (index < 0 || index >= this.recordCount) return false;
    const isHidden = !visible;
    if (!!this.hiddenFlags[index] === isHidden) return false;
    this.alignHiddenFlags();
    this.hiddenFlags[index] = isHidden;
    this.hiddenCount += isHidden ? 1 : -1;
    this.resetViews();
    this.clampPageIndexAfterChange();
    return true;
  }
  public isRecordVisible(index: number): boolean {
    if (index < 0 || index >= this.recordCount) return false;
    return !this.hiddenFlags[index];
  }
  /* Drops the cached views. The list detects a record array that changed outside it by its length;
     a content change of the same length - a cell written through survey.setValue - it cannot see,
     and with a local filter or sort active that change reorders or re-filters the view. The owner
     calls this from the one point every value assignment passes through. */
  public invalidateViews(): void {
    // A write of the list's own maintains the membership record by record; re-evaluating it here
    // would undo that from inside the very assignment that made it.
    if (this.writeDepth > 0) return;
    this.resetMembership();
    this.resetViews();
    this.refreezeMembership();
    this.clampPageIndexAfterChange();
  }
  /* The owner changed how many records its storage holds without writing through the list - the
     matrix composes its window by padding question.value up to rowCount. The records that are new
     join the view (an added record is always in it) and the ones that are gone leave it; the
     membership of the rest is not re-evaluated. */
  public syncMembershipWithRecordCount(): void {
    this.resetViews();
    this.clampPageIndexAfterChange();
    if (!this.frozenCreatedIndexes) {
      this.refreezeMembership();
      return;
    }
    const count = this.recordCount;
    if (count === this.frozenRecordCount) return;
    let created = this.frozenCreatedIndexes;
    if (count < this.frozenRecordCount) {
      created = created.filter((index: number): boolean => index < count);
    } else {
      created = created.slice();
      for (let i = this.frozenRecordCount; i < count; i++) {
        created.push(i);
      }
    }
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = count;
  }
  /* Re-evaluates the filter and the sort over the records as they are now and announces the new
     view. With isViewFrozenOnEdit off this is what every write does anyway, so it is only the reset
     notification. */
  public refreshView(): void {
    this.resetMembership();
    this.resetViews();
    this.refreezeMembership();
    this.clampPageIndexAfterChange();
    this.raiseChanged({ type: "reset" });
  }
  // The records that have an object: the ones that pass the filter, in sort order, owner-hidden ones
  // included. With no filter and no sort this is 0 ... count-1.
  public getCreatedIndexes(): Array<number> {
    this.ensureViews();
    return this.createdIndexes;
  }
  public createdIndexToIndex(createdIndex: number): number {
    if (!this.hasView) {
      return createdIndex >= 0 && createdIndex < this.recordCount ? createdIndex : -1;
    }
    const indexes = this.getCreatedIndexes();
    if (createdIndex < 0 || createdIndex >= indexes.length) return -1;
    return indexes[createdIndex];
  }
  public indexToCreatedIndex(index: number): number {
    if (!this.hasView) {
      return index >= 0 && index < this.recordCount ? index : -1;
    }
    return this.getCreatedIndexes().indexOf(index);
  }
  // A filter or a sort is set: without one the created indexes are the record indexes and the owner
  // keeps one object per record, which is the path every question takes until step 04.
  public get hasView(): boolean {
    return !!this._filter || this._sort.length > 0;
  }
  public getVisibleIndexes(): Array<number> {
    this.ensureViews();
    return this.visibleIndexes;
  }
  public visibleIndexToIndex(visibleIndex: number): number {
    const indexes = this.getVisibleIndexes();
    if (visibleIndex < 0 || visibleIndex >= indexes.length) return -1;
    return indexes[visibleIndex];
  }
  public indexToVisibleIndex(index: number): number {
    return this.getVisibleIndexes().indexOf(index);
  }

  public get pageSize(): number {
    return this._pageSize;
  }
  public set pageSize(v: number) {
    const newValue = v > 0 ? v : 0;
    if (this._pageSize === newValue) return;
    this._pageSize = newValue;
    this.clampPageIndex();
    this.resetViews();
    if (this.hasReadRange && this.isLoaded) {
      this.load();
    } else {
      this.raiseChanged({ type: "reset" });
    }
  }
  public get pageIndex(): number {
    return this._pageIndex;
  }
  public set pageIndex(v: number) {
    // Clamping needs a known count, so it only applies once something has been loaded.
    const newValue = this.isLoaded ? this.getClampedPageIndex(v) : Math.max(0, v);
    if (this._pageIndex === newValue) return;
    this._pageIndex = newValue;
    this.pageIndexes = undefined;
    this.raiseChanged({ type: "pageChanged" });
    if (this.hasReadRange) {
      this.load();
    }
  }
  public get pageCount(): number {
    if (this._pageSize <= 0) return 1;
    // A readRange source pages in the storage, so the page count comes from the storage count; a
    // local source pages over the visible records.
    if (!this.hasReadRange) return Math.max(1, Math.ceil(this.visibleCount / this._pageSize));
    /* An unknown total: the pages known to exist - the one that is loaded, the ones before it, and
       one more when the source said there is something behind the window. The pager then offers
       "next" one page at a time, which is exactly what the source has told the list. */
    if (!this._isCountKnown) return this._pageIndex + 1 + (this._hasMore ? 1 : 0);
    return Math.max(1, Math.ceil(this.count / this._pageSize));
  }
  public get pageRecordCount(): number {
    return this.getPageIndexes().length;
  }
  public getPageIndexes(): Array<number> {
    // The visible indexes come first: they drop a page cache that an external record change made
    // stale.
    const visible = this.getVisibleIndexes();
    if (!this.pageIndexes) {
      // A readRange source returns one storage page: the loaded window IS the page.
      if (this._pageSize <= 0 || this.hasReadRange) {
        this.pageIndexes = visible;
      } else {
        const start = this._pageIndex * this._pageSize;
        this.pageIndexes = visible.slice(start, start + this._pageSize);
      }
    }
    return this.pageIndexes;
  }
  public pageLocalIndexToIndex(pageLocalIndex: number): number {
    const indexes = this.getPageIndexes();
    if (pageLocalIndex < 0 || pageLocalIndex >= indexes.length) return -1;
    return indexes[pageLocalIndex];
  }
  public indexToPageLocalIndex(index: number): number {
    return this.getPageIndexes().indexOf(index);
  }

  // A survey expression over the record fields, e.g. "{country} = 'de' and {age} > 18". An empty
  // string is no filter.
  public get filter(): string {
    return this._filter;
  }
  public set filter(v: string) {
    this.setView(v, this._sort);
  }
  /* Assigns the filter and the sort together and reads ONCE: with a paging source the view travels
     inside the read request, so two assignments would be two requests, the second superseding the
     first. It is what the two setters are made of - and what a question that has both authored
     hands over on its first sync. */
  public setView(filter: string, sort: Array<IDynamicDataSort>): void {
    const newFilter = !!filter ? filter : "";
    /* The page reset belongs to the filter: a different membership makes the page the respondent is
       on meaningless, while a sort keeps the same records and only reorders them. An assignment of
       the filter it already has changes neither. */
    const isFilterChanged = this._filter !== newFilter;
    this._filter = newFilter;
    this._sort = Array.isArray(sort) ? sort : [];
    if (isFilterChanged) {
      this._pageIndex = 0;
      this.filterRunner = undefined;
      this.updateFilterRunner();
    }
    this.resetMembership();
    if (this.hasReadRange) {
      this.load();
      return;
    }
    this.resetViews();
    this.refreezeMembership();
    this.raiseChanged({ type: "reset" });
  }
  /* The runner exists only while the list itself is the one filtering: a paging source gets the
     expression text inside every read request and the list keeps none. Parsed as soon as the
     filter - or the source - is set, so that a filter which cannot be run locally is reported then
     and not on the first read of a view. */
  private updateFilterRunner(): void {
    this.filterRunner = undefined;
    if (!this._filter || this.hasReadRange) return;
    try {
      this.filterRunner = createFilterRunner(this._filter);
    } catch(e) {
      // The list stays unfiltered: showing every record beats showing none. The operation is "read":
      // it is the read of the view that the filter made impossible.
      this._filter = "";
      this.raiseError(e, "read");
    }
  }
  public get sort(): Array<IDynamicDataSort> {
    return this._sort;
  }
  public set sort(v: Array<IDynamicDataSort>) {
    this.setView(this._filter, v);
  }
  public dispose(): void {
    this.isDisposed = true;
    this.readRequestId++;
    this.inFlightRead = undefined;
    this.dropQueuedRead();
    // No notification: a disposed list raises nothing, and a read in flight will never clear it.
    this._isLoading = false;
    this.onChanged = undefined;
    this.onError = undefined;
    this.owner = undefined;
    this.records = [];
    this.hiddenFlags = [];
    this.hiddenCount = 0;
    this.pendingInserts = [];
    this.filterRunner = undefined;
    this.resetMembership();
    this.resetViews();
  }

  /* The source pages itself: the loaded window IS the current page. An owner that materializes one
     object per window record must not slice those objects by pageIndex again - they are the page -
     and "bring this object onto its page" is always already satisfied. */
  public get isPagedBySource(): boolean {
    return this.hasReadRange;
  }
  // One capability: a source that pages also filters and sorts itself. A source that filters on its
  // side but leaves the paging to the list would have the list filter one page.
  private get hasReadRange(): boolean {
    return !!this._source && !!this._source.readRange;
  }
  private getFields(): Array<IDynamicDataField> {
    return !!this.owner && !!this.owner.getFields ? this.owner.getFields() : undefined;
  }
  private copyRecord(record: any): any {
    return Object.assign({}, record);
  }
  /* The name a write gives the record it addresses. A source that declares keyField is told WHICH
     record changed, a source that does not is told WHERE it is - the source index, exactly as
     before, and for such a source the key and the position are the same number. Every write resolves
     it at enqueue time and before its own splice: the window already reflects every earlier write,
     so the record at index is the record the respondent acted on. */
  private get keyField(): string {
    return !!this._source ? this._source.keyField : undefined;
  }
  private getRecordKey(index: number): any {
    const field = this.keyField;
    if (!field) return this._windowOffset + index;
    const record = this.getRecord(index);
    return !!record ? record[field] : undefined;
  }
  private replaceRecord(index: number, record: any): void {
    if (this.pendingInserts.length > 0)this.repointPendingInsert(this.records[index], record);
    // The window array is never mutated: the source may hand out the very array the owner holds.
    // With a read-through source there is no window - the push that follows is the write.
    if (!this.useReadThrough) {
      const newRecords = this.windowRecords.slice();
      newRecords[index] = record;
      this.windowRecords = newRecords;
    }
    /* A value change can only reorder or re-filter the view when a local filter/sort is active;
       keeping the cached identity array otherwise is what lets the questions compare by instance.
       With a frozen membership the edited record keeps its place, so the recomputation that follows
       reads the membership back unchanged. */
    if (this.hasLocalViews) {
      this.resetViews();
      // The edited record may have left the filter: the visible count can shrink.
      this.clampPageIndexAfterChange();
    }
  }
  // An insert that has not answered yet is matched by the window object of its record, and every
  // write replaces that object: the entry follows the record across the replacements.
  private repointPendingInsert(oldRecord: any, newRecord: any): void {
    if (oldRecord === undefined || oldRecord === newRecord) return;
    this.pendingInserts.forEach((entry: { record: any }): void => {
      if (entry.record === oldRecord) entry.record = newRecord;
    });
  }
  private get hasLocalViews(): boolean {
    return this.hasView && !this.hasReadRange;
  }
  // The flags are spliced in step with the records, so they must stay a dense array of the same
  // length: a shorter one would shift the wrong entries.
  private alignHiddenFlags(): void {
    const length = this.recordCount;
    if (this.hiddenFlags.length === length) return;
    while(this.hiddenFlags.length < length) {
      this.hiddenFlags.push(false);
    }
    this.hiddenFlags.length = length;
    // The counter follows the flags: records that disappear take their flags with them, and a
    // counter left inflated by a trimmed flag would outlive the record it belonged to.
    this.hiddenCount = 0;
    for (let i = 0; i < this.hiddenFlags.length; i++) {
      if (this.hiddenFlags[i])this.hiddenCount++;
    }
  }
  private ensureViews(): void {
    const recordCount = this.recordCount;
    if (!!this.visibleIndexes) {
      if (this.viewsRecordCount === recordCount) return;
      // The records changed outside the list: the cached views describe a window that is gone. A
      // content change of the same length cannot be seen here - the owner reports it through
      // invalidateViews().
      this.pageIndexes = undefined;
    }
    this.alignHiddenFlags();
    let created = this.getFrozenCreatedIndexes(recordCount);
    if (!created) {
      const needFilter = !!this.filterRunner && !this.hasReadRange;
      const needSort = this._sort.length > 0 && !this.hasReadRange;
      // Read once, and only when the filter or the sort has to look at the records.
      const records = needFilter || needSort ? this.records : undefined;
      created = needFilter ? applyFilter(records, this.filterRunner) : createIndexes(recordCount);
      if (needSort) {
        created = applySort(records, this._sort, this.getFields(), created);
      }
      this.freezeCreatedIndexes(created, recordCount);
    }
    // The owner-hidden records keep the order the filter and the sort gave them; dropping them from
    // the created indexes is the only difference between the two views.
    let visible = created;
    if (this.hiddenCount > 0) {
      visible = created.filter((index: number): boolean => !this.hiddenFlags[index]);
    }
    this.createdIndexes = created;
    this.visibleIndexes = visible;
    this.viewsRecordCount = recordCount;
  }
  private resetViews(): void {
    this.createdIndexes = undefined;
    this.visibleIndexes = undefined;
    this.pageIndexes = undefined;
    this.viewsRecordCount = -1;
  }
  private get isMembershipFrozen(): boolean {
    return this.isViewFrozenOnEdit && this.hasLocalViews;
  }
  private getFrozenCreatedIndexes(recordCount: number): Array<number> {
    if (!this.isMembershipFrozen || !this.frozenCreatedIndexes) return undefined;
    return this.frozenRecordCount === recordCount ? this.frozenCreatedIndexes : undefined;
  }
  private freezeCreatedIndexes(created: Array<number>, recordCount: number): void {
    if (!this.isMembershipFrozen) {
      this.resetMembership();
      return;
    }
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = recordCount;
  }
  private resetMembership(): void {
    this.frozenCreatedIndexes = undefined;
    this.frozenRecordCount = -1;
  }
  /* The membership is decided when it is reset, not when it is first read: a write made before the
     first read would otherwise be the one that decides it, and an edit may not decide the view. */
  private refreezeMembership(): void {
    if (this.isMembershipFrozen) {
      this.ensureViews();
    }
  }
  private insertIntoMembership(at: number, createdPosition: number, newRecordCount: number): void {
    if (!this.frozenCreatedIndexes) return;
    const created = this.frozenCreatedIndexes.map((index: number): number => index >= at ? index + 1 : index);
    let position = createdPosition;
    if (position === undefined) {
      // The record that was pushed aside keeps its place; the new object takes the position in
      // front of it, which for an append is the end.
      position = created.indexOf(at + 1);
      if (position < 0) position = created.length;
    }
    created.splice(Math.max(0, Math.min(position, created.length)), 0, at);
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = newRecordCount;
  }
  private removeFromMembership(index: number, newRecordCount: number): void {
    if (!this.frozenCreatedIndexes) return;
    const created: Array<number> = [];
    this.frozenCreatedIndexes.forEach((i: number): void => {
      if (i === index) return;
      created.push(i > index ? i - 1 : i);
    });
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = newRecordCount;
  }
  private moveInMembership(fromIndex: number, toIndex: number): void {
    if (!this.frozenCreatedIndexes) return;
    const fromPosition = this.frozenCreatedIndexes.indexOf(fromIndex);
    const toPosition = this.frozenCreatedIndexes.indexOf(toIndex);
    // The records renumber; the objects keep their own order except for the one that moved.
    const created = this.frozenCreatedIndexes.map((index: number): number => {
      if (index === fromIndex) return toIndex;
      if (fromIndex < index && index <= toIndex) return index - 1;
      if (toIndex <= index && index < fromIndex) return index + 1;
      return index;
    });
    if (fromPosition > -1 && toPosition > -1) {
      const moved = created[fromPosition];
      created.splice(fromPosition, 1);
      created.splice(toPosition, 0, moved);
    }
    this.frozenCreatedIndexes = created;
    this.frozenRecordCount = this.recordCount;
  }
  private resetWindow(): void {
    this.records = [];
    this.hiddenFlags = [];
    this.hiddenCount = 0;
    // The inserts of the source that was replaced: their answers belong to a window that is gone.
    this.pendingInserts = [];
    this._total = undefined;
    this._isCountKnown = true;
    this._hasMore = false;
    this.discoveredTotalFilter = undefined;
    this._windowOffset = 0;
    this.isLoaded = false;
    this.resetMembership();
    this.resetViews();
  }
  private getClampedPageIndex(v: number): number {
    return Math.max(0, Math.min(v, this.pageCount - 1));
  }
  private clampPageIndex(): void {
    const newValue = this.getClampedPageIndex(this._pageIndex);
    if (newValue !== this._pageIndex) {
      this._pageIndex = newValue;
      this.pageIndexes = undefined;
    }
  }
  /* Every change that can shrink the visible count ends here: a page index left past the last page
     would show an empty page. Not before the first successful read - there is no count to clamp
     against yet and the pageIndex setter rules. Returns whether it asked the source for a page. */
  private clampPageIndexAfterChange(): boolean {
    if (!this.isLoaded) return false;
    const newValue = this.getClampedPageIndex(this._pageIndex);
    if (newValue === this._pageIndex) return false;
    this._pageIndex = newValue;
    this.pageIndexes = undefined;
    this.raiseChanged({ type: "pageChanged" });
    if (!this.hasReadRange) return false;
    // The records of the previous page are not in the window: they have to be fetched.
    this.load();
    return true;
  }
  // The window is the whole storage only when it starts at the first record and the source has
  // nothing behind it. An unknown total makes "count > loadedCount" unusable - the count IS the
  // window then - so the two committed facts answer it instead.
  private checkWindowIsWholeStorage(operation: string): void {
    if (this.hasReadRange && (this._windowOffset > 0 || this._hasMore)) {
      throw new Error("DynamicDataList." + operation + " requires the whole storage to be loaded.");
    }
  }
  private raiseChanged(change: IDynamicDataListChange): void {
    if (this.isDisposed) return;
    if (!!this.owner && !!this.owner.onDataListChanged)this.owner.onDataListChanged(change);
    if (!!this.onChanged)this.onChanged(change);
  }
  private raiseError(error: any, operation: DynamicDataOperation): void {
    if (!!this.onError)this.onError(error, operation);
  }
  private setIsLoading(val: boolean): void {
    if (this._isLoading === val) return;
    this._isLoading = val;
    this.raiseChanged({ type: "loading", isLoading: val });
  }

  /* The invariant of the read scheduling: a read is issued only when no write is pending, and its
     result is committed only when no write that could change it was enqueued since it was issued -
     every insert, remove and move, and an update of a record inside the range it asked for
     (markInFlightReadOvertaken). A write addresses the source as windowOffset + index, so a window
     read from a server that has not applied every write of the list shows records the respondent
     has removed (or values they have overwritten), and the next write made against that window
     lands on the wrong record. It is enforced in two places: here, a read requested while writes are
     pending is not issued until the chain has drained (onPushSettled) - chaining it on the chain as
     it is now would let a later write overtake it - and in doRead, where the answer to a read that a
     write overtook while it was in flight is discarded and the read is issued again. */
  private startRead(useWindowOffset: boolean): void | Promise<void> {
    if (this.hasPendingWrites) return this.queueRead(useWindowOffset);
    return this.doRead(useWindowOffset);
  }
  private queueRead(useWindowOffset: boolean): Promise<void> {
    this.queuedReadUseOffset = this.isReadQueued ? this.queuedReadUseOffset && useWindowOffset : useWindowOffset;
    this.isReadQueued = true;
    if (!this.queuedReadWaiter) {
      let resolve: (value?: any) => void;
      const promise = new Promise<void>((res: (value?: any) => void): void => { resolve = res; });
      this.queuedReadWaiter = { promise: promise, resolve: resolve };
    }
    return this.queuedReadWaiter.promise;
  }
  private startQueuedRead(): void {
    if (!this.isReadQueued) return;
    const useWindowOffset = this.queuedReadUseOffset;
    const waiter = this.queuedReadWaiter;
    this.isReadQueued = false;
    this.queuedReadWaiter = undefined;
    const res = this.doRead(useWindowOffset);
    if (!!waiter) waiter.resolve(res);
  }
  private dropQueuedRead(): void {
    const waiter = this.queuedReadWaiter;
    this.isReadQueued = false;
    this.queuedReadWaiter = undefined;
    if (!!waiter) waiter.resolve();
  }
  private doRead(useWindowOffset: boolean): void | Promise<void> {
    if (this.isDisposed || !this._source) return;
    const requestId = ++this.readRequestId;
    const useReadRange = this.hasReadRange;
    const skip = useReadRange
      ? (useWindowOffset && this.isLoaded ? this._windowOffset : this._pageIndex * this._pageSize)
      : 0;
    const take = this._pageSize;
    let res: any;
    try {
      res = useReadRange ? this._source.readRange(this.createReadRequest(skip, take)) : this._source.read();
    } catch(e) {
      // This read superseded whatever was in flight, so it also owns the loading state it inherited.
      this.inFlightRead = undefined;
      this.setIsLoading(false);
      this.raiseError(e, "read");
      return;
    }
    if (isPromiseLike(res)) {
      const inFlight = {
        skip: skip, take: take, useReadRange: useReadRange, isOvertaken: false, updatedKeys: <Array<any>>[]
      };
      this.inFlightRead = inFlight;
      this.setIsLoading(true);
      return res.then((data: any): any => {
        // A later read supersedes this one: its result is discarded when it arrives.
        if (this.isDisposed || requestId !== this.readRequestId) return;
        this.inFlightRead = undefined;
        if (inFlight.isOvertaken || this.isAnswerOvertaken(inFlight, data)) {
          // A write overtook this read: the answer describes a server that did not have it yet. The
          // read is issued again - behind the chain while writes are pending - and it inherits the
          // loading state, as a superseding read does.
          return this.startRead(useWindowOffset);
        }
        /* A page past the end: the read of the page it stepped back to takes this one's place, and
           it is returned, so that a caller awaiting load()/refresh() waits for the window that is
           committed and not for the answer that was discarded. It inherits the loading state, as a
           superseding read does. */
        if (!this.commitRead(data, skip, take, useReadRange)) return this.load();
        this.setIsLoading(false);
      }, (error: any): void => {
        if (this.isDisposed || requestId !== this.readRequestId) return;
        this.inFlightRead = undefined;
        this.setIsLoading(false);
        // The previous window stays in force.
        this.raiseError(error, "read");
      });
    }
    this.inFlightRead = undefined;
    if (!this.commitRead(res, skip, take, useReadRange)) return this.load();
    // A synchronous answer (a source that reads from a cache) can supersede a pending asynchronous
    // read of the same source; the flag that read set is this one's to clear.
    this.setIsLoading(false);
  }
  // One read = one request: the range and the view the list wants. The source keeps no state between
  // the calls, so nothing has to be pushed to it before a read and two questions may share it.
  private createReadRequest(skip: number, take: number): IDynamicDataReadRequest {
    return { skip: skip, take: take, filter: this._filter, sort: this._sort.slice() };
  }
  /* The window, its offset, the total and what is known about it are committed together: while a
     read is pending or after it was rejected, the previous window and its own offset stay in force.
     Returns whether the window was committed - an empty page past the end is not. */
  private commitRead(data: any, skip: number, take: number, useReadRange: boolean): boolean {
    if (useReadRange) {
      const result = data || {};
      const records = Array.isArray(result.records) ? result.records : [];
      /* A page past the end. With an unknown total nothing stops a pageIndex the source has no
         records for, and an empty answer at an offset is what says so: the page does not exist. It
         is not announced - the owner would see a table that is empty for a moment - the list steps
         one page back and reads that one, and again if it is empty too (bounded by pageIndex).
         The empty answer is not thrown away: nothing exists at skip or behind it, so the storage
         holds at most that many records. The window the step back commits then confirms that bound
         or lowers it, and the pager stops offering the page that answered empty. */
      if (records.length === 0 && skip > 0 && take > 0 && typeof result.total !== "number" && this._pageIndex > 0) {
        this._total = skip;
        this._isCountKnown = true;
        this.discoveredTotalFilter = this._filter;
        this._pageIndex--;
        this.pageIndexes = undefined;
        return false;
      }
      this.records = records;
      this.commitCount(result, skip, take, records.length);
      this._windowOffset = skip;
    } else {
      this.records = Array.isArray(data) ? data : [];
      this._total = undefined;
      // read() answers with the whole storage, so its length IS the count.
      this._isCountKnown = true;
      this._hasMore = false;
      this._windowOffset = 0;
    }
    this.isLoaded = true;
    this.hiddenFlags = [];
    this.hiddenCount = 0;
    this.resetMembership();
    this.resetViews();
    this.refreezeMembership();
    this.clampPageIndex();
    this.raiseChanged({ type: "reset" });
    return true;
  }
  /* Does this answer reach the end of the storage? The source says so with hasMore; otherwise a
     window shorter than the take it asked for is the end, and so is any window answering a take of
     0 - that request was for everything from skip. */
  private isEndOfStorage(result: any, take: number, length: number): boolean {
    if (typeof result.hasMore === "boolean") return !result.hasMore;
    return take <= 0 || length < take;
  }
  private commitCount(result: any, skip: number, take: number, length: number): void {
    if (typeof result.total === "number") {
      this._total = result.total;
      this._isCountKnown = true;
      this.discoveredTotalFilter = undefined;
      this._hasMore = skip + length < this._total;
      return;
    }
    /* An answer that reaches the end settles the count as well: there is nothing behind the last
       record, so the storage holds exactly the records up to it. A source that cannot count in
       advance is therefore counted once, by walking to its end. */
    if (this.isEndOfStorage(result, take, length)) {
      this._total = skip + length;
      this._isCountKnown = true;
      this.discoveredTotalFilter = this._filter;
      this._hasMore = false;
      return;
    }
    /* A total the list worked out itself is kept while the window fits inside it: this is a page in
       front of an end that has already been found, and forgetting it would offer a page behind the
       end again and cost two reads to discover the same end. A window that reaches past it is a
       storage that has grown, and the end has to be found again. */
    if (this._total !== undefined && this.discoveredTotalFilter === this._filter && skip + length <= this._total) {
      this._isCountKnown = true;
      this._hasMore = skip + length < this._total;
      return;
    }
    this._total = undefined;
    this._isCountKnown = false;
    this.discoveredTotalFilter = undefined;
    // Not the end, so there is at least one record behind this window.
    this._hasMore = true;
  }

  /* The source is captured here, when the write is enqueued, and never read again from the field:
     a deferred push belongs to the source the edit was made against, not to whatever the list holds
     when the push finally runs. The capability check follows the same rule - the operation names are
     the source method names. */
  private pushToSource(operation: DynamicDataOperation, method: (source: IDynamicDataSource) => any,
    info?: IDynamicDataPushInfo): void {
    const source = this._source;
    if (this.isDisposed || !source || !(<any>source)[operation]) return;
    const push = info || {};
    /* A keyed source cannot be told about a record it has not named yet - the insert of a record
       added a moment ago is still in flight. The write is kept: it is in the window, so the
       respondent sees it, the error says why it was not delivered, and the next read reconciles. */
    if (operation !== "insert" && !!this.keyField && push.key === undefined) {
      this.raiseError(new Error("DynamicDataList: the record has no key yet"), operation);
      return;
    }
    this.markInFlightReadOvertaken(operation, push);
    const epoch = this.sourceEpoch;
    const entry = this.registerPendingInsert(operation, push);
    const onAnswer = !!entry ? (answer: any): void => this.applyInsertAnswer(entry, answer, epoch) : undefined;
    const action = (): any => method(source);
    if (!this.pushChain) {
      const res = this.runPush(operation, action, onAnswer);
      if (!res) {
        this.syncWindowAfterSyncPush(epoch);
        return;
      }
      this.pendingPushes = 1;
      this.pushChain = res.then((): void => this.onPushSettled(epoch, false));
      return;
    }
    this.pendingPushes++;
    this.pushChain = this.pushChain.then((): any => {
      const res = this.runPush(operation, action, onAnswer);
      return !!res ? res.then((): void => this.onPushSettled(epoch, false)) : this.onPushSettled(epoch, true);
    });
  }
  private registerPendingInsert(operation: DynamicDataOperation, push: IDynamicDataPushInfo): { record: any } {
    if (operation !== "insert" || !this.keyField || push.insertedRecord === undefined) return undefined;
    const entry = { record: push.insertedRecord };
    this.pendingInserts.push(entry);
    return entry;
  }
  /* The answer of an insert is the stored record: it carries the key the source assigned, and
     whatever else the source filled in. The client fields win over it - a value typed while the
     insert was in flight is the newer one - and the merged record replaces the one in the window, so
     that every later write finds the key on it. The record is found through the pending entry and
     never by indexOf of the object add created: a write copies the record, and that lookup would
     miss it. */
  private applyInsertAnswer(entry: { record: any }, answer: any, epoch: number): void {
    const at = this.pendingInserts.indexOf(entry);
    if (at > -1)this.pendingInserts.splice(at, 1);
    const field = this.keyField;
    if (this.isDisposed || epoch !== this.sourceEpoch || !field) return;
    if (!answer || typeof answer !== "object" || Helpers.isValueEmpty(answer[field])) return;
    // Gone from the window: it was removed, or a read replaced the window - and that read brought
    // the key itself.
    const index = this.records.indexOf(entry.record);
    if (index < 0) return;
    this.writeDepth++;
    this.replaceRecord(index, Object.assign({}, answer, entry.record));
    this.endWrite();
    this.raiseChanged({ type: "recordChanged", index: index, field: undefined });
  }
  /* Does this write make the answer of the read in flight stale? An insert or a remove shifts the
     records and changes the total, and a move shifts the records between its two ends, so each of
     them does. An update changes one record in place: only a record inside the range that read asked
     for - an edit on page 1 while page 2 is loading leaves the answer for page 2 as it is. */
  private markInFlightReadOvertaken(operation: DynamicDataOperation, push: IDynamicDataPushInfo): void {
    const read = this.inFlightRead;
    if (!read || read.isOvertaken) return;
    if (operation === "update" && read.useReadRange && read.take > 0) {
      /* A keyed source: where the record is by now is not the position it was edited at - another
         writer may have moved it between the pages while the read was running - so the answer is
         checked for that record when it arrives instead of the range being compared. */
      if (!!this.keyField) {
        read.updatedKeys.push(push.key);
        return;
      }
      if (push.sourceIndex < read.skip || push.sourceIndex >= read.skip + read.take) return;
    }
    read.isOvertaken = true;
  }
  /* The other half of the rule above: the answer of a read an update overtook is stale only when it
     carries one of the updated records, because it then describes the value the respondent has just
     replaced. An edit of a record the answer does not contain leaves it as it is, which is what the
     positional check decides by range. */
  private isAnswerOvertaken(read: { updatedKeys: Array<any> }, data: any): boolean {
    const field = this.keyField;
    if (!field || read.updatedKeys.length === 0) return false;
    const records = Array.isArray(data) ? data : (!!data && Array.isArray(data.records) ? data.records : []);
    return records.some((record: any): boolean => !!record && read.updatedKeys.indexOf(record[field]) > -1);
  }
  // Returns a promise that always fulfills, or undefined when the push stayed synchronous. onAnswer
  // is what the source answered - only an insert has an answer - and it runs for a failed push too,
  // with undefined, so that the pending entry never outlives its push.
  private runPush(operation: DynamicDataOperation, action: () => any,
    onAnswer?: (answer: any) => void): Promise<void> {
    let res: any;
    try {
      res = action();
    } catch(e) {
      this.raiseError(e, operation);
      if (!!onAnswer) onAnswer(undefined);
      return undefined;
    }
    if (!isPromiseLike(res)) {
      if (!!onAnswer) onAnswer(res);
      return undefined;
    }
    // A rejected push keeps the local change and reports the error; the chain continues.
    return res.then((answer: any): void => { if (!!onAnswer) onAnswer(answer); },
      (error: any): void => {
        this.raiseError(error, operation);
        if (!!onAnswer) onAnswer(undefined);
      });
  }
  private onPushSettled(epoch: number, wasSync: boolean): void {
    // A chain detached by a source change runs to its end against its own source, but the counters
    // and the window it would touch belong to the source that replaced it.
    if (epoch !== this.sourceEpoch) return;
    this.pendingPushes--;
    if (this.pendingPushes <= 0) {
      this.pendingPushes = 0;
      this.pushChain = undefined;
      if (wasSync)this.syncWindowAfterSyncPush(epoch);
      this.startQueuedRead();
    }
  }
  private syncWindowAfterSyncPush(epoch: number): void {
    if (this.isDisposed || epoch !== this.sourceEpoch || this.hasReadRange || this.useReadThrough) return;
    // For an ArrayDynamicDataSource the push IS the storage and is synchronous: the window is
    // rebuilt from it so that the list never holds an array the owner does not.
    if (!(this._source instanceof ArrayDynamicDataSource)) return;
    const res = this._source.read();
    this.records = Array.isArray(res) ? res : [];
  }
}

/* The list both questions use: an ArrayDynamicDataSource over the owner's own storage - a
   getter/setter pair, never a captured array, so that every write replaces the array instead of
   mutating the one the owner currently holds - read through on demand, so that a value assigned
   outside the list is seen at once. */
export function createReadThroughDataList(owner: IDynamicDataOwner, getArray: () => Array<any>,
  setArray: (arr: Array<any>) => void, getCount?: () => number): DynamicDataList {
  const list = new DynamicDataList(new ArrayDynamicDataSource(getArray, setArray, getCount), owner);
  list.isReadThrough = true;
  // The owner materializes one object per record in the view: its membership may not change under
  // an edit that is being made through one of those objects.
  list.isViewFrozenOnEdit = true;
  list.load();
  return list;
}
