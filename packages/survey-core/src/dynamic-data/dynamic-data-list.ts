import { ConditionRunner } from "../conditions/conditionRunner";
import { Helpers } from "../helpers";
import { applyFilter, applySort, createFilterRunner, createIndexes } from "./dynamic-data-filter";
import {
  DynamicDataOperation, IDynamicDataField, IDynamicDataListChange,
  IDynamicDataOwner, IDynamicDataSort, IDynamicDataSource
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
  /* The asynchronous read in flight: the range it asked for, and whether a write enqueued since it
     was issued made its answer stale (see startRead). */
  private inFlightRead: { skip: number, take: number, useReadRange: boolean, isOvertaken: boolean } = undefined;
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
       runs them is a capability of the source, so a swap re-decides it: a filter the old source ran
       on its own side has no local runner yet, and one the list ran locally has to be handed to a new
       source that owns it - otherwise the view the owner is showing disappears with the swap. */
    this.updateFilterRunner();
    if (wasLoaded) {
      this.applyViewToSourceAndRead();
    } else {
      this.raiseChanged({ type: "reset" });
    }
  }
  /* Tells the new source about the filter and the sort it owns and then reads once. Sequential and
     not two runSourceView() calls: each of those reads on its own, and a swap must cost one read,
     with the filter and the sort already in force when it runs. */
  private applyViewToSourceAndRead(): void {
    const operations: Array<DynamicDataOperation> = [];
    if (!!this._filter && this.isSourceFiltering) operations.push("filter");
    if (this._sort.length > 0 && this.isSourceSorting) operations.push("sort");
    if (operations.length === 0) {
      this.load();
      return;
    }
    const epoch = this.sourceEpoch;
    const source = this._source;
    // The owner is waiting for records from the moment the swap was made, not from the read that
    // follows these calls.
    this.setIsLoading(true);
    const runNext = (index: number): void => {
      // A source replaced again while its own view was being applied: the chain belongs to the
      // source that is gone and the one that replaced it has started its own.
      if (this.isDisposed || epoch !== this.sourceEpoch) return;
      if (index >= operations.length) {
        this.load();
        return;
      }
      const operation = operations[index];
      let res: any;
      try {
        res = operation === "filter" ? source.filter(this._filter) : source.sort(this._sort);
      } catch(e) {
        this.raiseError(e, operation);
        runNext(index + 1);
        return;
      }
      if (isPromiseLike(res)) {
        res.then((): void => { runNext(index + 1); },
          (error: any): void => { this.raiseError(error, operation); runNext(index + 1); });
      } else {
        runNext(index + 1);
      }
    };
    runNext(0);
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

  public get count(): number {
    return this._total !== undefined ? this._total : this.recordCount;
  }
  public get filteredCount(): number {
    if (this.isSourceFiltering || !this._filter) return this.count;
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
    this.writeDepth++;
    this.replaceRecord(index, newRecord);
    // The push comes before the notification: with a read-through source the push IS the local write,
    // so the owner must not be notified of a change it cannot read yet.
    this.pushToSource("update",
      (source: IDynamicDataSource): any => source.update(sourceIndex, newRecord, [field]), sourceIndex);
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
    this.writeDepth++;
    this.replaceRecord(index, record);
    this.pushToSource("update",
      (source: IDynamicDataSource): any => source.update(sourceIndex, record, changedFields), sourceIndex);
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
    this.insertIntoMembership(at, createdPosition, countAfter);
    this.resetViews();
    const sourceIndex = this._windowOffset + at;
    this.pushToSource("insert", (source: IDynamicDataSource): any => source.insert(sourceIndex, newRecord));
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
    this.removeFromMembership(index, countAfter);
    this.resetViews();
    const sourceIndex = this._windowOffset + index;
    this.pushToSource("remove", (source: IDynamicDataSource): any => source.remove(sourceIndex));
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
    const length = this.recordCount;
    if (length >= this._pageSize || this._windowOffset + length >= this.count) return;
    this.refresh();
  }
  public move(fromIndex: number, toIndex: number): void {
    const length = this.recordCount;
    if (fromIndex < 0 || fromIndex >= length || toIndex < 0 || toIndex >= length) return;
    if (fromIndex === toIndex) return;
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
    const fromSourceIndex = this._windowOffset + fromIndex;
    const toSourceIndex = this._windowOffset + toIndex;
    this.pushToSource("move", (source: IDynamicDataSource): any => source.move(fromSourceIndex, toSourceIndex));
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
    const total = this.hasReadRange ? this.count : this.visibleCount;
    return Math.max(1, Math.ceil(total / this._pageSize));
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
    this._filter = !!v ? v : "";
    this._pageIndex = 0;
    this.filterRunner = undefined;
    this.resetMembership();
    if (this.isSourceFiltering) {
      this.runSourceView("filter", (): any => this._source.filter(this._filter));
    } else {
      this.updateFilterRunner();
      this.resetViews();
      this.refreezeMembership();
      this.raiseChanged({ type: "reset" });
    }
  }
  /* The runner exists only while the list itself is the one filtering: a source that filters on its
     own side gets the expression text and the list keeps none. Parsed as soon as the filter - or the
     source - is set, so that a filter which cannot be run locally is reported then and not on the
     first read of a view. */
  private updateFilterRunner(): void {
    this.filterRunner = undefined;
    if (!this._filter || this.isSourceFiltering) return;
    try {
      this.filterRunner = createFilterRunner(this._filter);
    } catch(e) {
      // The list stays unfiltered: showing every record beats showing none.
      this._filter = "";
      this.raiseError(e, "filter");
    }
  }
  public get sort(): Array<IDynamicDataSort> {
    return this._sort;
  }
  public set sort(v: Array<IDynamicDataSort>) {
    this._sort = Array.isArray(v) ? v : [];
    this.resetMembership();
    if (this.isSourceSorting) {
      this.runSourceView("sort", (): any => this._source.sort(this._sort));
    } else {
      this.resetViews();
      this.refreezeMembership();
      this.raiseChanged({ type: "reset" });
    }
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
  private get hasReadRange(): boolean {
    return !!this._source && !!this._source.readRange;
  }
  private get isSourceFiltering(): boolean {
    return !!this._source && !!this._source.filter;
  }
  private get isSourceSorting(): boolean {
    return !!this._source && !!this._source.sort;
  }
  private getFields(): Array<IDynamicDataField> {
    return !!this.owner && !!this.owner.getFields ? this.owner.getFields() : undefined;
  }
  private copyRecord(record: any): any {
    return Object.assign({}, record);
  }
  private replaceRecord(index: number, record: any): void {
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
  private get hasLocalViews(): boolean {
    return (!!this._filter && !this.isSourceFiltering) || (this._sort.length > 0 && !this.isSourceSorting);
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
      const needFilter = !!this.filterRunner && !this.isSourceFiltering;
      const needSort = this._sort.length > 0 && !this.isSourceSorting;
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
    this._total = undefined;
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
  private checkWindowIsWholeStorage(operation: string): void {
    if (this.hasReadRange && this.count > this.recordCount) {
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
    let res: any;
    try {
      res = useReadRange ? this._source.readRange(skip, this._pageSize) : this._source.read();
    } catch(e) {
      // This read superseded whatever was in flight, so it also owns the loading state it inherited.
      this.inFlightRead = undefined;
      this.setIsLoading(false);
      this.raiseError(e, "read");
      return;
    }
    if (isPromiseLike(res)) {
      const inFlight = { skip: skip, take: this._pageSize, useReadRange: useReadRange, isOvertaken: false };
      this.inFlightRead = inFlight;
      this.setIsLoading(true);
      return res.then((data: any): any => {
        // A later read supersedes this one: its result is discarded when it arrives.
        if (this.isDisposed || requestId !== this.readRequestId) return;
        this.inFlightRead = undefined;
        if (inFlight.isOvertaken) {
          // A write overtook this read: the answer describes a server that did not have it yet. The
          // read is issued again - behind the chain while writes are pending - and it inherits the
          // loading state, as a superseding read does.
          return this.startRead(useWindowOffset);
        }
        this.commitRead(data, skip, useReadRange);
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
    this.commitRead(res, skip, useReadRange);
    // A synchronous answer (a source that reads from a cache) can supersede a pending asynchronous
    // read of the same source; the flag that read set is this one's to clear.
    this.setIsLoading(false);
  }
  // The window, its offset and the total are committed together: while a read is pending or after it
  // was rejected, the previous window and its own offset stay in force.
  private commitRead(data: any, skip: number, useReadRange: boolean): void {
    if (useReadRange) {
      const result = data || {};
      this.records = Array.isArray(result.records) ? result.records : [];
      this._total = typeof result.total === "number" ? result.total : this.records.length;
      this._windowOffset = skip;
    } else {
      this.records = Array.isArray(data) ? data : [];
      this._total = undefined;
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
  }
  private runSourceView(operation: DynamicDataOperation, call: () => any): void {
    let res: any;
    try {
      res = call();
    } catch(e) {
      this.raiseError(e, operation);
      return;
    }
    if (isPromiseLike(res)) {
      res.then((): void => { this.load(); }, (error: any): void => { this.raiseError(error, operation); });
    } else {
      this.load();
    }
  }

  /* The source is captured here, when the write is enqueued, and never read again from the field:
     a deferred push belongs to the source the edit was made against, not to whatever the list holds
     when the push finally runs. The capability check follows the same rule - the operation names are
     the source method names. */
  private pushToSource(operation: DynamicDataOperation, method: (source: IDynamicDataSource) => any,
    updatedSourceIndex?: number): void {
    const source = this._source;
    if (this.isDisposed || !source || !(<any>source)[operation]) return;
    this.markInFlightReadOvertaken(operation, updatedSourceIndex);
    const epoch = this.sourceEpoch;
    const action = (): any => method(source);
    if (!this.pushChain) {
      const res = this.runPush(operation, action);
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
      const res = this.runPush(operation, action);
      return !!res ? res.then((): void => this.onPushSettled(epoch, false)) : this.onPushSettled(epoch, true);
    });
  }
  /* Does this write make the answer of the read in flight stale? An insert or a remove shifts the
     records and changes the total, and a move shifts the records between its two ends, so each of
     them does. An update changes one record in place: only a record inside the range that read asked
     for - an edit on page 1 while page 2 is loading leaves the answer for page 2 as it is. */
  private markInFlightReadOvertaken(operation: DynamicDataOperation, updatedSourceIndex: number): void {
    const read = this.inFlightRead;
    if (!read || read.isOvertaken) return;
    if (operation === "update" && read.useReadRange && read.take > 0) {
      if (updatedSourceIndex < read.skip || updatedSourceIndex >= read.skip + read.take) return;
    }
    read.isOvertaken = true;
  }
  // Returns a promise that always fulfills, or undefined when the push stayed synchronous.
  private runPush(operation: DynamicDataOperation, action: () => any): Promise<void> {
    let res: any;
    try {
      res = action();
    } catch(e) {
      this.raiseError(e, operation);
      return undefined;
    }
    if (!isPromiseLike(res)) return undefined;
    // A rejected push keeps the local change and reports the error; the chain continues.
    return res.then((): void => { }, (error: any): void => { this.raiseError(error, operation); });
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
