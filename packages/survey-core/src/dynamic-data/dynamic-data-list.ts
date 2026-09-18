import { ConditionRunner } from "../conditions/conditionRunner";
import { Helpers } from "../helpers";
import { applyFilter, applySort, createFilterRunner } from "./dynamic-data-filter";
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
  private records: Array<any> = [];
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
  // Cached views; undefined means "recompute on the next read".
  private filteredIndexes: Array<number> = undefined;
  private visibleIndexes: Array<number> = undefined;
  private pageIndexes: Array<number> = undefined;

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

  public get source(): IDynamicDataSource {
    return this._source;
  }
  public set source(v: IDynamicDataSource) {
    if (this._source === v) return;
    const wasLoaded = this.isLoaded;
    this._source = v;
    // Discards the result of a read that is still in flight against the old source.
    this.readRequestId++;
    this.resetWindow();
    if (wasLoaded) {
      this.load();
    } else {
      this.raiseChanged({ type: "reset" });
    }
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
  public get windowOffset(): number {
    return this._windowOffset;
  }

  public get count(): number {
    return this._total !== undefined ? this._total : this.records.length;
  }
  public get filteredCount(): number {
    if (this.isSourceFiltering || !this._filter) return this.count;
    this.ensureViews();
    return this.filteredIndexes.length;
  }
  public get visibleCount(): number {
    return this.getVisibleIndexes().length;
  }
  public get loadedCount(): number {
    return this.records.length;
  }
  public ensureCount(n: number, createRecord?: (i: number) => any): void {
    this.checkWindowIsWholeStorage("ensureCount");
    for (let i = this.loadedCount; i < n; i++) {
      this.add(!!createRecord ? createRecord(i) : {});
    }
  }
  public truncate(n: number): void {
    this.checkWindowIsWholeStorage("truncate");
    for (let i = this.loadedCount - 1; i >= n && i >= 0; i--) {
      this.remove(i);
    }
  }

  public getRecord(index: number): any {
    if (index < 0 || index >= this.records.length) return undefined;
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
    this.replaceRecord(index, newRecord);
    this.raiseChanged({ type: "recordChanged", index: index, field: field });
    this.pushToSource("update", !!this._source.update,
      (): any => this._source.update(sourceIndex, newRecord, [field]));
    return true;
  }
  public setRecord(index: number, record: any): boolean {
    const oldRecord = this.getRecord(index);
    if (index < 0 || index >= this.records.length) return false;
    if (!DynamicDataList.isValueChanged(record, oldRecord)) return false;
    const changedFields = getChangedFields(oldRecord, record);
    const sourceIndex = this._windowOffset + index;
    this.replaceRecord(index, record);
    this.raiseChanged({ type: "recordChanged", index: index, field: undefined });
    this.pushToSource("update", !!this._source.update,
      (): any => this._source.update(sourceIndex, record, changedFields));
    return true;
  }
  public add(record?: any, index?: number): number {
    const newRecord = record === undefined ? {} : record;
    const at = index === undefined || index === null
      ? this.records.length
      : Math.max(0, Math.min(index, this.records.length));
    const newRecords = this.records.slice();
    newRecords.splice(at, 0, newRecord);
    this.alignHiddenFlags();
    this.records = newRecords;
    this.hiddenFlags.splice(at, 0, false);
    if (this._total !== undefined)this._total++;
    this.resetViews();
    const sourceIndex = this._windowOffset + at;
    this.raiseChanged({ type: "recordAdded", index: at });
    this.pushToSource("insert", !!this._source.insert, (): any => this._source.insert(sourceIndex, newRecord));
    return at;
  }
  public remove(index: number): void {
    if (index < 0 || index >= this.records.length) return;
    const newRecords = this.records.slice();
    newRecords.splice(index, 1);
    this.alignHiddenFlags();
    this.records = newRecords;
    if (this.hiddenFlags[index])this.hiddenCount--;
    this.hiddenFlags.splice(index, 1);
    if (this._total !== undefined)this._total--;
    this.resetViews();
    const sourceIndex = this._windowOffset + index;
    this.raiseChanged({ type: "recordRemoved", index: index });
    this.pushToSource("remove", !!this._source.remove, (): any => this._source.remove(sourceIndex));
  }
  public move(fromIndex: number, toIndex: number): void {
    const length = this.records.length;
    if (fromIndex < 0 || fromIndex >= length || toIndex < 0 || toIndex >= length) return;
    if (fromIndex === toIndex) return;
    const newRecords = this.records.slice();
    const record = newRecords[fromIndex];
    newRecords.splice(fromIndex, 1);
    newRecords.splice(toIndex, 0, record);
    this.alignHiddenFlags();
    this.records = newRecords;
    // A visibility flag belongs to a record, not to a slot: it travels with it.
    const flag = this.hiddenFlags[fromIndex];
    this.hiddenFlags.splice(fromIndex, 1);
    this.hiddenFlags.splice(toIndex, 0, flag);
    this.resetViews();
    const fromSourceIndex = this._windowOffset + fromIndex;
    const toSourceIndex = this._windowOffset + toIndex;
    this.raiseChanged({ type: "recordMoved", from: fromIndex, to: toIndex });
    this.pushToSource("move", !!this._source.move, (): any => this._source.move(fromSourceIndex, toSourceIndex));
  }

  public setRecordVisible(index: number, visible: boolean): void {
    if (index < 0 || index >= this.records.length) return;
    const isHidden = !visible;
    if (!!this.hiddenFlags[index] === isHidden) return;
    this.alignHiddenFlags();
    this.hiddenFlags[index] = isHidden;
    this.hiddenCount += isHidden ? 1 : -1;
    this.resetViews();
  }
  public isRecordVisible(index: number): boolean {
    if (index < 0 || index >= this.records.length) return false;
    return !this.hiddenFlags[index];
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
    if (!this.pageIndexes) {
      const visible = this.getVisibleIndexes();
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
    if (this.isSourceFiltering) {
      this.runSourceView("filter", (): any => this._source.filter(this._filter));
    } else {
      // Parse it now: a filter that cannot be run locally has to be reported when it is set, not on
      // the first read of a view.
      try {
        this.filterRunner = createFilterRunner(this._filter);
      } catch(e) {
        // The list stays unfiltered: showing every record beats showing none.
        this._filter = "";
        this.raiseError(e, "filter");
      }
      this.resetViews();
      this.raiseChanged({ type: "reset" });
    }
  }
  public get sort(): Array<IDynamicDataSort> {
    return this._sort;
  }
  public set sort(v: Array<IDynamicDataSort>) {
    this._sort = Array.isArray(v) ? v : [];
    if (this.isSourceSorting) {
      this.runSourceView("sort", (): any => this._source.sort(this._sort));
    } else {
      this.resetViews();
      this.raiseChanged({ type: "reset" });
    }
  }
  public dispose(): void {
    this.isDisposed = true;
    this.readRequestId++;
    this.onChanged = undefined;
    this.onError = undefined;
    this.owner = undefined;
    this.records = [];
    this.hiddenFlags = [];
    this.hiddenCount = 0;
    this.filterRunner = undefined;
    this.resetViews();
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
    const newRecords = this.records.slice();
    newRecords[index] = record;
    this.records = newRecords;
    // A value change can only reorder or re-filter the view when a local filter/sort is active;
    // keeping the cached identity array otherwise is what lets the questions compare by instance.
    if (this.hasLocalViews) {
      this.resetViews();
    }
  }
  private get hasLocalViews(): boolean {
    return (!!this._filter && !this.isSourceFiltering) || (this._sort.length > 0 && !this.isSourceSorting);
  }
  // The flags are spliced in step with the records, so they must stay a dense array of the same
  // length: a shorter one would shift the wrong entries.
  private alignHiddenFlags(): void {
    while(this.hiddenFlags.length < this.records.length) {
      this.hiddenFlags.push(false);
    }
    this.hiddenFlags.length = this.records.length;
  }
  private createIdentityIndexes(): Array<number> {
    const res = new Array<number>(this.records.length);
    for (let i = 0; i < this.records.length; i++) {
      res[i] = i;
    }
    return res;
  }
  private ensureViews(): void {
    if (!!this.visibleIndexes) return;
    const needFilter = !!this.filterRunner && !this.isSourceFiltering;
    const needSort = this._sort.length > 0 && !this.isSourceSorting;
    const filtered = needFilter ? applyFilter(this.records, this.filterRunner) : this.createIdentityIndexes();
    let visible = filtered;
    if (this.hiddenCount > 0) {
      visible = filtered.filter((index: number): boolean => !this.hiddenFlags[index]);
    }
    if (needSort) {
      visible = applySort(this.records, this._sort, this.getFields(), visible);
    }
    this.filteredIndexes = filtered;
    this.visibleIndexes = visible;
  }
  private resetViews(): void {
    this.filteredIndexes = undefined;
    this.visibleIndexes = undefined;
    this.pageIndexes = undefined;
  }
  private resetWindow(): void {
    this.records = [];
    this.hiddenFlags = [];
    this.hiddenCount = 0;
    this._total = undefined;
    this._windowOffset = 0;
    this.isLoaded = false;
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
  private checkWindowIsWholeStorage(operation: string): void {
    if (this.hasReadRange && this.count > this.records.length) {
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

  private startRead(useWindowOffset: boolean): void | Promise<void> {
    if (this.hasPendingWrites) {
      // A read must never overwrite an edit the source has not acknowledged yet.
      return this.pushChain.then((): any => this.doRead(useWindowOffset));
    }
    return this.doRead(useWindowOffset);
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
      this.raiseError(e, "read");
      return;
    }
    if (isPromiseLike(res)) {
      this.setIsLoading(true);
      return res.then((data: any): void => {
        // A later read supersedes this one: its result is discarded when it arrives.
        if (this.isDisposed || requestId !== this.readRequestId) return;
        this.commitRead(data, skip, useReadRange);
        this.setIsLoading(false);
      }, (error: any): void => {
        if (this.isDisposed || requestId !== this.readRequestId) return;
        this.setIsLoading(false);
        // The previous window stays in force.
        this.raiseError(error, "read");
      });
    }
    this.commitRead(res, skip, useReadRange);
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
    this.resetViews();
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

  private pushToSource(operation: DynamicDataOperation, hasMethod: boolean, action: () => any): void {
    if (!hasMethod || this.isDisposed) return;
    if (!this.pushChain) {
      const res = this.runPush(operation, action);
      if (!res) {
        this.syncWindowAfterSyncPush();
        return;
      }
      this.pendingPushes = 1;
      this.pushChain = res.then((): void => this.onPushSettled(false));
      return;
    }
    this.pendingPushes++;
    this.pushChain = this.pushChain.then((): any => {
      const res = this.runPush(operation, action);
      return !!res ? res.then((): void => this.onPushSettled(false)) : this.onPushSettled(true);
    });
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
  private onPushSettled(wasSync: boolean): void {
    this.pendingPushes--;
    if (this.pendingPushes <= 0) {
      this.pendingPushes = 0;
      this.pushChain = undefined;
      if (wasSync)this.syncWindowAfterSyncPush();
    }
  }
  private syncWindowAfterSyncPush(): void {
    if (this.isDisposed || this.hasReadRange) return;
    // For an ArrayDynamicDataSource the push IS the storage and is synchronous: the window is
    // rebuilt from it so that the list never holds an array the owner does not.
    if (!(this._source instanceof ArrayDynamicDataSource)) return;
    const res = this._source.read();
    this.records = Array.isArray(res) ? res : [];
  }
}
