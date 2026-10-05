import { ConditionRunner } from "../conditions/conditionRunner";
import { Helpers } from "../helpers";
import { applyFilter, applySort, createFilterRunner, createIndexes } from "./dynamic-data-filter";
import {
  DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner,
  IDynamicDataReadRequest, IDynamicDataSort, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "./dynamic-data-interfaces";
import {
  DynamicDataSourceChannel, IDynamicDataChannelHost, IPendingInsert, getChangedFields, getOwnedFields, getUpdatePayload,
  mergeInsertAnswer, toReadResult
} from "./dynamic-data-channel";
import { DynamicDataCount } from "./dynamic-data-count";
import { ArrayDynamicDataSource } from "./dynamic-data-sources";
import { insertRemap, moveRemap, removeRemap } from "./dynamic-data-record-remap";
import { DynamicDataRecordVisibility, IDynamicDataRecordCondition, IDynamicDataRecordScope } from "./dynamic-data-record-visibility";

// Index vocabulary - binding for every method and parameter name in this file:
//
// | name             | meaning                                                          | range                 |
// |------------------|------------------------------------------------------------------|-----------------------|
// | index            | record index: the position in the loaded window. Every method     | 0 ... loadedCount-1   |
// |                  | that takes or returns an unqualified index means this one.        |                       |
// | sourceIndex      | windowOffset + index; what the list passes to the source editing  | 0 ... count-1         |
// |                  | methods. Equals the record index for a source without paging.     |                       |
// | visibleIndex     | position among the records that pass the filter and are not       | 0 ... visibleCount-1  |
// |                  | owner-hidden, in sort order, UNPAGED.                             |                       |
// | pageLocalIndex   | position on the current page, i.e. in getPageIndexes()            | 0 ... page length-1   |
// |                  | (= visibleIndex - pageIndex * pageSize).                          |                       |
// | globalVisible-   | the owner's visibleIndex ({visiblePanelIndex}, row.visibleIndex):  | 0 ... visible records |
// | Index            | windowOffset + visibleIndex.                                      | of the whole list - 1 |
//
// The counts follow the same split: "count" is the STORAGE count (total for a paged source, else the
// window length) and a filter never changes it; "visibleCount" is what passes the filter minus the
// owner-hidden records; "loadedCount" is the window length.

export class DynamicDataList {
  private _source: IDynamicDataSource;
  private windowRecords: Array<any> = [];
  private hiddenFlags: Array<boolean> = [];
  private _windowOffset: number = 0;
  // The total, what is known about it and the pending retry of a page past the end: committed
  // together with the window (see commitRead).
  private storageCount: DynamicDataCount = new DynamicDataCount();
  private _isLoading: boolean = false;
  private _filter: string = "";
  private filterRunner: ConditionRunner = undefined;
  private recordVisibility: DynamicDataRecordVisibility;
  private _sort: Array<IDynamicDataSort> = [];
  private _pageSize: number = 0;
  private _pageIndex: number = 0;
  private isLoaded: boolean = false;
  private isDisposed: boolean = false;
  // The reads, the push chain and the pending inserts: everything that orders the requests to the
  // source (see the header of dynamic-data-channel.ts).
  private channel: DynamicDataSourceChannel = new DynamicDataSourceChannel(this.createChannelHost());
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
    this.takeCapabilities();
  }
  // The exact comparison QuestionRecordItem.isValueChanged uses, so that the questions can
  // delegate to it instead of keeping their own copy.
  public static isValueChanged(newValue: any, oldValue: any): boolean {
    return !Helpers.isTwoValueEquals(newValue, oldValue, false, true, false);
  }
  /* The list both questions use: an ArrayDynamicDataSource over the owner's own storage - a
     getter/setter pair, never a captured array, so that every write replaces the array instead of
     mutating the one the owner currently holds - read through on demand, so that a value assigned
     outside the list is seen at once. The list keeps the factory and not the instance: a detach
     builds a fresh source, so that the batch state of the one in use cannot survive a swap.
     isMembershipFixed: see the flag; the default source carries it too.
     getCount: the length getArray() would return, for a getter that composes the array on the fly.
     The list keeps it, not the source, so a default source built again after a detach has it too
     (see recordCount). */
  public static createReadThrough(owner: IDynamicDataOwner, getArray: () => Array<any>,
    setArray: (arr: Array<any>) => void, getCount?: () => number, isMembershipFixed: boolean = false): DynamicDataList {
    const createSource = (): IDynamicDataSource => new ArrayDynamicDataSource(getArray, setArray, isMembershipFixed);
    const list = new DynamicDataList(createSource(), owner);
    list.createDefaultSource = createSource;
    list.getReadThroughCount = getCount;
    list.isMembershipFixed = isMembershipFixed;
    list.isReadThrough = true;
    // The owner materializes one object per record in the view: its membership may not change under
    // an edit that is being made through one of those objects.
    list.isViewFrozenOnEdit = true;
    list.load();
    return list;
  }
  private createDefaultSource: () => IDynamicDataSource;
  private getReadThroughCount: () => number;
  private assignedSourceValue: IDynamicDataSource;
  // The source the developer assigned (question.dataSource); undefined while the default one is used.
  public get assignedSource(): IDynamicDataSource {
    return this.assignedSourceValue;
  }
  // A source is remote because it was assigned, never because of its type or because it pages.
  public get isRemote(): boolean {
    return !!this.assignedSourceValue;
  }
  /* The owner's swap: undefined goes back to the default source. The flag is stored first, then
     onAssigning runs, then the source is swapped: the owner reads isRemote inside onAssigning and
     inside the notifications the swap raises. A list without a default source (a standalone one)
     keeps its source on a detach - there is nothing to go back to - and only the flag changes. */
  public assignSource(source: IDynamicDataSource, onAssigning?: () => void): void {
    const newValue = source || undefined;
    if (this.assignedSourceValue === newValue) return;
    this.assignedSourceValue = newValue;
    if (!!onAssigning) onAssigning();
    if (!!newValue) {
      this.source = newValue;
    } else if (!!this.createDefaultSource) {
      this.source = this.createDefaultSource();
    }
  }

  // An owner whose source reads and writes its storage directly - the questions, whose
  // ArrayDynamicDataSource is a getter/setter pair over question.value - sets this flag and the list
  // keeps no window: read() IS the storage and every write is synchronous and visible to the next
  // read. A window would be a second source of truth that goes stale on every assignment made
  // outside the list (survey.data = ..., a trigger, clearValue, a default value) and would hand out
  // record objects the owner no longer holds. It stays off by default: a paged or asynchronous
  // source cannot be read on demand. The flag is about the owner's OWN storage: it stays set while a
  // source is assigned and the list does not read through that source (useReadThrough).
  public isReadThrough: boolean = false;
  /* Owners that materialize an object per record - the two questions - set this flag: the view of a
     bare list re-evaluates itself on every write, which for them would dispose a row from inside its
     own cell's value-changed event and re-sort the table under the cursor on every keystroke. With
     the flag on, membership is decided when filter/sort is assigned and on refreshView(); between
     those points an edited record keeps its place, an added record is always in the view, a removed
     record leaves it, and only a change made outside the list re-evaluates it. */
  public isViewFrozenOnEdit: boolean = false;
  /* The owner defines which records exist and in what order; the list only reads and updates them.
     add, remove, move, ensureCount and truncate are refused before they touch any state - the hidden
     flags, the storage count, the membership, the views - so a refused call leaves no trace and
     raises nothing, and hasCapability answers false for the three operations. */
  public isMembershipFixed: boolean = false;
  /* Two conditions that are kept apart. Ownership: only the owner's own storage is read through. A
     source the owner assigned is read, not watched, whatever its class: the owner is not told when
     the developer's array changes, so a list that followed it at once would serve records the
     owner's value and objects have never seen. It gets a window, which changes only when the list
     reads or writes. Capability: a read-through source answers read() synchronously with an array.
     The class is checked for that and for nothing else, so a standalone list that sets isReadThrough
     by hand reads through its array source, and never through any other. */
  private get useReadThrough(): boolean {
    return this.isReadThrough && !this.isAssignedSourceInUse && this.isWindowWholeStorage && this._source instanceof ArrayDynamicDataSource;
  }
  // Not isRemote alone: assignSource sets the flag before it swaps, and until the swap the list
  // still holds the default source - the owner's storage - and reads through it.
  private get isAssignedSourceInUse(): boolean {
    return this.isRemote && this._source === this.assignedSourceValue;
  }
  private get records(): Array<any> {
    if (!this.useReadThrough) return this.windowRecords;
    const res = (<ArrayDynamicDataSource>this._source).read();
    return Array.isArray(res) ? res : [];
  }
  private set records(val: Array<any>) {
    this.windowRecords = val;
  }
  /* The window array is never mutated: the source may hand out the very array the owner holds, so
     every structural edit works on a copy that replaces it. With a read-through source there is no
     window at all - the push that follows the edit is the write - and the edit is skipped. */
  private editWindow(edit: (records: Array<any>) => void): void {
    if (this.useReadThrough) return;
    const newRecords = this.windowRecords.slice();
    edit(newRecords);
    this.windowRecords = newRecords;
  }
  /* The length of records without reading them: a read-through source may compose the array on every
     read (the matrix pads its value up to rowCount), and most readers want only the count. Inside a
     batch the owner's storage does not have the writes yet: the source answers records with the
     array the batch is building, and its length is the count. Every batch of the source is opened by
     batch() below, so batchDepth knows it. */
  private get recordCount(): number {
    if (this.useReadThrough && !!this.getReadThroughCount && this.batchDepth === 0) return this.getReadThroughCount();
    return this.records.length;
  }
  public get source(): IDynamicDataSource {
    return this._source;
  }
  // The low-level swap, for a standalone list. It leaves assignedSource alone: an owner swaps
  // through assignSource.
  public set source(v: IDynamicDataSource) {
    if (this._source === v) return;
    /* A list that was asked to fill itself reads the source that replaces the one it had, whatever
       became of that read: an answer that is merely late, and a read that failed or was refused, do
       not make the list a standalone one that was never loaded. Without the in-flight half a source
       swapped during the first read would never be read at all; without the failed half neither
       would a source assigned to replace one whose first read failed. */
    const wasLoaded = this.isLoadRequested;
    this._source = v;
    // Before updateFilterRunner: which side runs the filter is decided from them.
    this.takeCapabilities();
    // The pushes and the reads of the old source: detached, and discarded when they answer.
    this.channel.detach();
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
    let changes: Array<IDynamicDataListChange>;
    try {
      this.runWrite((): void => {
        if (!source || typeof source.batch !== "function") {
          func();
          return;
        }
        const before = this.windowRecords;
        this.batchDepth++;
        try {
          source.batch(func);
        } catch(e) {
          // The outermost one: a batch of the source nested in another neither stores nor drops.
          if (this.batchDepth === 1)this.restoreWindowAfterFailedBatch(source, before);
          throw e;
        } finally {
          this.batchDepth--;
        }
        changes = this.syncWindowAfterBatch(source);
      });
    } finally {
      (changes || []).forEach((change: IDynamicDataListChange): void => this.raiseChanged(change));
      this.raisePendingReset();
    }
  }
  private batchDepth: number = 0;
  /* An array source assigns its array once, when its batch ends, and the setter may store something
     else than it was handed: trimmed strings, a normalized shape. The writes inside the batch synced
     the window with the array that was being built, so the window takes the stored one here. What
     the setter changed is announced - every write inside the batch notified with its record as it
     was written: a record that differs is a recordChanged here, another record count is the reset
     takeStoredArray asks for. */
  private syncWindowAfterBatch(source: IDynamicDataSource): Array<IDynamicDataListChange> {
    // A source swapped inside the batch has been read by the swap.
    if (this._source !== source) return undefined;
    const written = this.windowRecords;
    this.syncWindowAfterSyncPush();
    const stored = this.windowRecords;
    if (stored === written || stored.length !== written.length) return undefined;
    const res: Array<IDynamicDataListChange> = [];
    for (let i = 0; i < stored.length; i++) {
      if (stored[i] !== written[i] && DynamicDataList.isValueChanged(stored[i], written[i])) {
        res.push({ type: "recordChanged", index: i, field: undefined });
      }
    }
    return res;
  }
  /* The batch threw. The array source has dropped the writes it collected - or its setter threw
     after it stored them - so the window, which has every write of the batch, goes back to the
     storage: the array the source holds now, or the window the batch started with when that array
     is not the list's to take (syncWindowAfterSyncPush). Which writes survived is not known, so
     everything derived is decided again as after a read, and the owner, which was notified of every
     write inside the batch, is told to start over. A read-through list has no window to put back. */
  private restoreWindowAfterFailedBatch(source: IDynamicDataSource, before: Array<any>): void {
    if (this._source !== source || !this.isWindowWholeStorage || this.useReadThrough) return;
    if (!(source instanceof ArrayDynamicDataSource)) return;
    const stored = this.isAssignedSourceInUse && !this.isAssignedArrayInSync ? before : source.read();
    this.records = Array.isArray(stored) ? stored : [];
    this.resetWindowState();
    this.isResetPending = true;
  }
  // What a window that was replaced as a whole leaves behind: the flags and the membership of the
  // records it held. They are decided again over the new one, and the page index is clamped to it.
  private resetWindowState(): void {
    this.hiddenFlags = [];
    this.resetMembership();
    this.resetViews();
    this.refreezeMembership();
    this.clampPageIndex();
  }
  /* A reset the list owes its owner for a window it replaced inside a write (takeStoredArray,
     restoreWindowAfterFailedBatch). It is raised once the outermost write has notified: the owner
     follows that notification by record index, and a reset in front of it would have it renumber
     the objects it has just rebuilt. */
  private isResetPending: boolean = false;
  private raisePendingReset(): void {
    if (!this.isResetPending || this.writeDepth > 0) return;
    this.isResetPending = false;
    this.raiseChanged({ type: "reset" });
  }
  // The notification of a write, raised after its scope.
  private notifyWrite(change: IDynamicDataListChange): void {
    this.raiseChanged(change);
    this.raisePendingReset();
  }
  // True while the list applies a write of its own: the owner uses it to tell an assignment it
  // caused itself from one made outside (survey.data, a trigger, clearValue).
  public get isWriting(): boolean {
    return this.writeDepth > 0;
  }
  /* Every write of the list runs here. The code inside runs user code - the owner's createRecord,
     the notifications of a nested write or a clamp, onError, a read-through source's setter and the
     survey handlers behind it - and a write scope that a throw left open would make isWriting true
     for good: invalidateViews would ignore every later assignment and the owners would take every
     assignment from outside for their own. The nesting and the timing of the notifications are
     unchanged: each method notifies after its own scope, so a write nested in ensureCount, truncate
     or batch still notifies with the outer scope open. */
  private runWrite<T>(func: () => T): T {
    // Before the write edits the window: see isAssignedArrayInSync.
    if (this.writeDepth === 0)this.isAssignedArrayInSync = this.getIsAssignedArrayInSync();
    this.writeDepth++;
    try {
      return func();
    } finally {
      this.endWrite();
    }
  }
  private endWrite(): void {
    if (this.writeDepth > 0)this.writeDepth--;
    if (this.writeDepth === 0)this.isAssignedArrayInSync = false;
  }
  /* True for the span of the outermost write to an assigned ArrayDynamicDataSource whose array was,
     when the write started, the window record for record: nothing has replaced it outside the list
     since the list last read or wrote it. Only then does the window take the array the write stores
     (syncWindowAfterSyncPush). */
  private isAssignedArrayInSync: boolean = false;
  private getIsAssignedArrayInSync(): boolean {
    if (!this.isAssignedSourceInUse || !this.isWindowWholeStorage || !(this._source instanceof ArrayDynamicDataSource)) return false;
    const stored = this._source.read();
    const records = this.windowRecords;
    // The common case: the window IS the array, taken by the last read or the last write.
    if (stored === records) return true;
    // A source that hands out a copy on every read (SurveyDataDynamicDataSource) is compared by content.
    if (!Array.isArray(stored) || stored.length !== records.length) return false;
    for (let i = 0; i < records.length; i++) {
      if (stored[i] !== records[i] && DynamicDataList.isValueChanged(stored[i], records[i])) return false;
    }
    return true;
  }
  // Every read asked for from outside the retry supersedes a retry that is pending.
  public load(): void | Promise<void> {
    this.isLoadRequested = true;
    this.storageCount.cancelRetry();
    return this.channel.startRead(false);
  }
  public refresh(): void | Promise<void> {
    this.isLoadRequested = true;
    this.storageCount.cancelRetry();
    return this.channel.startRead(true);
  }
  // Set by the first load() or refresh(), and never cleared: see the source setter.
  private isLoadRequested: boolean = false;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public get hasPendingWrites(): boolean {
    return this.channel.hasPendingWrites;
  }
  // True from the moment a read is requested until its window is committed or it is rejected,
  // including the time it waits for pending writes - isLoading only covers the read in flight.
  public get hasPendingRead(): boolean {
    return this.channel.hasPendingRead;
  }
  public get windowOffset(): number {
    return this._windowOffset;
  }

  // The storage count; with an unknown total, the records known to exist (a lower bound).
  public get count(): number {
    return this.storageCount.getCount(this._windowOffset, this.recordCount);
  }
  // False while the source answers without a total: count is a lower bound and pageCount is the
  // number of pages known to exist.
  public get isCountKnown(): boolean {
    return this.storageCount.isCountKnown;
  }
  // Are there records behind the loaded window? It is what a pager's "next" is built from.
  public get hasMore(): boolean {
    return this.storageCount.hasMore;
  }
  // The most records the list knows to exist. It is what a "Panel N of M" counts against.
  public get knownCount(): number {
    return this.storageCount.getKnownCount(this._windowOffset, this.recordCount);
  }
  public get visibleCount(): number {
    return this.getVisibleIndexes().length;
  }
  public get loadedCount(): number {
    return this.recordCount;
  }
  /* The loaded window as a new array. It is what question.value becomes after every write the list
     makes to an assigned source: a new instance, so that the ordinary "did the value change"
     comparisons of the library see the change, and the records themselves are the ones the list
     holds. */
  public getLoadedRecords(): Array<any> {
    const res = new Array<any>();
    for (let i = 0; i < this.loadedCount; i++) {
      res.push(this.getRecord(i));
    }
    return res;
  }
  public ensureCount(n: number, createRecord?: (i: number) => any): void {
    if (this.isMembershipFixed) return;
    this.checkWindowIsWholeStorage("ensureCount");
    this.runWrite((): void => {
      for (let i = this.loadedCount; i < n; i++) {
        this.add(!!createRecord ? createRecord(i) : {});
      }
    });
    this.raisePendingReset();
  }
  public truncate(n: number): void {
    if (this.isMembershipFixed) return;
    this.checkWindowIsWholeStorage("truncate");
    this.runWrite((): void => {
      for (let i = this.loadedCount - 1; i >= n && i >= 0; i--) {
        this.remove(i);
      }
    });
    this.raisePendingReset();
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
    const pending = this.findPendingInsert(index);
    this.runWrite((): void => {
      this.replaceRecord(index, newRecord);
      const ownedFields = getOwnedFields(pending);
      // The push comes before the notification: with a read-through source the push IS the local
      // write, so the owner must not be notified of a change it cannot read yet.
      this.channel.pushToSource("update",
        (source: IDynamicDataSource, runKey: any): any => source.update(runKey, getUpdatePayload(pending, newRecord, ownedFields), [field]),
        { sourceIndex: sourceIndex, key: key, pendingInsert: pending });
    });
    this.notifyWrite({ type: "recordChanged", index: index, field: field });
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
    const pending = this.findPendingInsert(index);
    this.runWrite((): void => {
      this.replaceRecord(index, record);
      const ownedFields = getOwnedFields(pending);
      this.channel.pushToSource("update",
        (source: IDynamicDataSource, runKey: any): any => source.update(runKey, getUpdatePayload(pending, record, ownedFields), changedFields),
        { sourceIndex: sourceIndex, key: key, pendingInsert: pending });
    });
    this.notifyWrite({ type: "recordChanged", index: index, field: undefined });
    return true;
  }
  /* The source assigns the key: with a keyField, a key the record carries - copied from the last
     entry, or put on a default value - is taken out before anything else sees the record. */
  public add(record?: any, index?: number): number {
    if (this.isMembershipFixed) return -1;
    const newRecord = this.removeKeyField(record === undefined ? {} : record);
    // The count the write produces. It is taken before the write: with a read-through source the
    // records only change when the push assigns the owner storage, and the membership has to carry
    // the count it will have then, not the one it still has.
    const countAfter = this.recordCount + 1;
    const at = index === undefined || index === null
      ? this.recordCount
      : Math.max(0, Math.min(index, this.recordCount));
    this.alignHiddenFlags();
    this.runWrite((): void => {
      this.editWindow((records: Array<any>): void => { records.splice(at, 0, newRecord); });
      this.hiddenFlags.splice(at, 0, false);
      this.storageCount.onRecordInserted(this._windowOffset, countAfter);
      this.insertIntoMembership(at, countAfter);
      this.resetViews();
      const sourceIndex = this._windowOffset + at;
      /* An added record has no key yet: the position says where it goes and the source assigns the
         key, which the answer of insert brings back (applyInsertAnswer). */
      this.channel.pushToSource("insert", (source: IDynamicDataSource): any => source.insert(newRecord, sourceIndex),
        { insertedRecord: newRecord });
    });
    this.notifyWrite({ type: "recordAdded", index: at });
    return at;
  }
  public remove(index: number): void {
    if (this.isMembershipFixed || index < 0 || index >= this.recordCount) return;
    /* Before the splice: afterwards this slot holds the record that moved up into it, and the last
       record of the window has no slot at all. */
    const key = this.getRecordKey(index);
    const pending = this.findPendingInsert(index);
    const countAfter = this.recordCount - 1;
    this.alignHiddenFlags();
    this.runWrite((): void => {
      this.editWindow((records: Array<any>): void => { records.splice(index, 1); });
      this.hiddenFlags.splice(index, 1);
      this.storageCount.onRecordRemoved(this._windowOffset, countAfter);
      this.removeFromMembership(index, countAfter);
      this.resetViews();
      this.channel.pushToSource("remove", (source: IDynamicDataSource, runKey: any): any => source.remove(runKey),
        { key: key, pendingInsert: pending });
    });
    this.notifyWrite({ type: "recordRemoved", index: index });
    // Never two reads for one remove: a clamp to the previous page has already asked for its page.
    if (!this.clampPageIndexAfterChange()) {
      this.refillWindowAfterRemove();
    }
  }
  /* With a source that pages itself the window IS the page, so a remove leaves it one record short
     while the records behind it moved up on the server. The page is read again when it came up short
     and the source still has records behind it; a remove on the last page just leaves it shorter.
     The whole page and not only the one record that moved up (a read of offset + length, take 1): that
     read would keep the row objects, but it trusts that the server's order did not change between the
     two reads and it leaves the total unverified. The full read is authoritative for both, and it is
     one request either way. refresh() and not load(): the window stays at its own offset, load()
     recomputes it from pageIndex and the two agree only by coincidence. */
  private refillWindowAfterRemove(): void {
    if (!this.isPagedBySource || !this.isLoaded || this._pageSize <= 0) return;
    // hasMore and not "windowOffset + length < count": with an unknown total the count is the
    // records seen so far and would never say that the source has more. With a known total the two
    // are the same value - the count recomputed the flag when the remove decremented it.
    if (this.recordCount >= this._pageSize || !this.hasMore) return;
    this.refresh();
  }
  public move(fromIndex: number, toIndex: number): void {
    if (this.isMembershipFixed) return;
    const length = this.recordCount;
    if (fromIndex < 0 || fromIndex >= length || toIndex < 0 || toIndex >= length) return;
    if (fromIndex === toIndex) return;
    // Before the splice, for the same reason as in remove.
    const key = this.getRecordKey(fromIndex);
    const pending = this.findPendingInsert(fromIndex);
    this.alignHiddenFlags();
    this.runWrite((): void => {
      this.editWindow((records: Array<any>): void => {
        const record = records[fromIndex];
        records.splice(fromIndex, 1);
        records.splice(toIndex, 0, record);
      });
      // A visibility flag belongs to a record, not to a slot: it travels with it.
      const flag = this.hiddenFlags[fromIndex];
      this.hiddenFlags.splice(fromIndex, 1);
      this.hiddenFlags.splice(toIndex, 0, flag);
      this.moveInMembership(fromIndex, toIndex);
      this.resetViews();
      const toSourceIndex = this._windowOffset + toIndex;
      this.channel.pushToSource("move", (source: IDynamicDataSource, runKey: any): any => source.move(runKey, toSourceIndex),
        { key: key, pendingInsert: pending });
    });
    this.notifyWrite({ type: "recordMoved", from: fromIndex, to: toIndex });
  }

  // Returns whether the flag changed: the owner syncs its page state only then.
  public setRecordVisible(index: number, visible: boolean): boolean {
    if (index < 0 || index >= this.recordCount) return false;
    const isHidden = !visible;
    if (!!this.hiddenFlags[index] === isHidden) return false;
    this.alignHiddenFlags();
    this.hiddenFlags[index] = isHidden;
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
    // would undo that from inside the very assignment that made it. refreshView() is the owner's
    // explicit request and runs during a write too, so the guard stays here and not in the helper.
    if (this.writeDepth > 0) return;
    this.rebuildMembership();
  }
  // Re-decides the membership over the records as they are now, and re-freezes it.
  private rebuildMembership(): void {
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
    this.rebuildMembership();
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
  // keeps one object per record.
  public get hasView(): boolean {
    return !!this._filter || this._sort.length > 0;
  }
  public getVisibleIndexes(): Array<number> {
    this.ensureViews();
    return this.visibleIndexes;
  }
  /* The owner's side of the index arithmetic matrixdynamic and paneldynamic share. The list answers
     from its own state: the offset is windowOffset, which only a paged read moves - and a question
     reads a paging source only when it was assigned - and paging is a page size above 0, which the
     paging controller sets to 0 in design mode on its next sync. */
  public getPageStartGlobalVisibleIndex(): number {
    // A paging decision, not offset arithmetic: a source without paging has offset 0 on every page.
    if (this.isPagedBySource) return this.windowOffset;
    return this._pageSize > 0 ? this.pageIndex * this._pageSize : 0;
  }
  // Record index + this = the record number the respondent sees ({panelIndex}, {rowIndex}).
  public getRecordNumberOffset(): number {
    return this.windowOffset;
  }
  // -1 when the record is not visible.
  public getGlobalVisibleIndex(index: number): number {
    const pos = this.getVisibleIndexes().indexOf(index);
    return pos < 0 ? -1 : pos + this.getRecordNumberOffset();
  }
  // -1 when there is none: a remote window holds nothing beyond itself.
  public getIndexAtGlobalVisibleIndex(globalVisibleIndex: number): number {
    const at = globalVisibleIndex - this.getRecordNumberOffset();
    const visible = this.getVisibleIndexes();
    return at < 0 || at >= visible.length ? -1 : visible[at];
  }
  /* The records an owner materializes an object for, in object order. The view answers every DATA
     question (which records are in it, their order, the totals, the neighbours); this answers every
     OBJECT question (which record a panel or a row holds). Without paging they are the created
     indexes - owner-hidden records included, the owner keeps an object for them. With paging they
     are the current page, which holds visible records only: an owner that pages builds nothing for a
     record that is not on it. It lives here and not on the owner because it is the page cut of the
     view, and the list owns both. */
  public getMaterializedIndexes(): Array<number> {
    return this._pageSize > 0 ? this.getPageIndexes() : this.getCreatedIndexes();
  }
  public materializedIndexToIndex(position: number): number {
    if (this._pageSize <= 0) return this.createdIndexToIndex(position);
    const indexes = this.getPageIndexes();
    return position >= 0 && position < indexes.length ? indexes[position] : -1;
  }
  public indexToMaterializedIndex(index: number): number {
    if (this._pageSize <= 0) return this.indexToCreatedIndex(index);
    const position = this.getMaterializedPositions()[index];
    return position !== undefined ? position : -1;
  }
  /* record index -> position among the materialized records, for the records that have an object.
     Memoized on the identity of the materialized array: the list never changes a view array in
     place, it replaces it, so a new array is the only way the map can go stale. A content change of
     the same length is seen through invalidateViews(), the limit the arrays themselves have. */
  public getMaterializedPositions(): { [index: number]: number } {
    const indexes = this.getMaterializedIndexes();
    if (this.materializedPositionsSource !== indexes) {
      const res: { [index: number]: number } = {};
      indexes.forEach((index: number, pos: number): void => { res[index] = pos; });
      this.materializedPositionsSource = indexes;
      this.materializedPositions = res;
    }
    return this.materializedPositions;
  }
  private materializedPositionsSource: Array<number>;
  private materializedPositions: { [index: number]: number };
  /* The owner-visibility of many records at once, decided without an object per record. One view
     reset and one page clamp for the whole run instead of one per record: setRecordVisible
     recomputes the views on the clamp, which over every record would be quadratic. Returns whether a
     flag changed. */
  public setRecordsVisible(isVisible: (index: number) => boolean): boolean {
    const count = this.recordCount;
    this.alignHiddenFlags();
    let isChanged = false;
    for (let i = 0; i < count; i++) {
      const isHidden = !isVisible(i);
      if (!!this.hiddenFlags[i] !== isHidden) {
        this.hiddenFlags[i] = isHidden;
        isChanged = true;
      }
    }
    if (!isChanged) return false;
    this.resetViews();
    this.clampPageIndexAfterChange();
    return true;
  }
  /* The owner-visibility decided by an expression over every record - rowsVisibleIf /
     templateVisibleIf of a question that pages (see DynamicDataRecordVisibility). The owner reads
     the expression, the record, the context and the condition a record has of its own; the list keeps
     the runners and whether the flags are the expression's. Returns whether a flag changed. */
  public updateRecordsVisibility(expression: string, readRecord: (index: number) => any, createScope: () => IDynamicDataRecordScope,
    readCondition?: (index: number) => IDynamicDataRecordCondition): boolean {
    if (!this.recordVisibility) {
      this.recordVisibility = new DynamicDataRecordVisibility();
    }
    return this.recordVisibility.update(this, expression, readRecord, createScope, readCondition);
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
    if (this.isPagedBySource && this.isLoaded) {
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
    if (this.isPagedBySource) {
      this.load();
    }
  }
  public get pageCount(): number {
    if (this._pageSize <= 0) return 1;
    // A paging source pages in the storage, so the page count comes from the storage count; the list
    // pages a source without paging over the visible records.
    if (!this.isPagedBySource) return Math.max(1, Math.ceil(this.visibleCount / this._pageSize));
    /* An unknown total: the pages known to exist - the one that is loaded, the ones before it, and
       one more when the source said there is something behind the window. The pager then offers
       "next" one page at a time, which is exactly what the source has told the list. */
    if (!this.isCountKnown) return this._pageIndex + 1 + (this.hasMore ? 1 : 0);
    return Math.max(1, Math.ceil(this.count / this._pageSize));
  }
  public getPageIndexes(): Array<number> {
    // The visible indexes come first: they drop a page cache that an external record change made
    // stale.
    const visible = this.getVisibleIndexes();
    if (!this.pageIndexes) {
      // A paging source returns one storage page: the loaded window IS the page.
      if (this._pageSize <= 0 || this.isPagedBySource) {
        this.pageIndexes = visible;
      } else {
        const start = this._pageIndex * this._pageSize;
        this.pageIndexes = visible.slice(start, start + this._pageSize);
      }
    }
    return this.pageIndexes;
  }
  // The page that holds a visibleIndex (unpaged, see the vocabulary above); 0 while the list does
  // not page.
  public getPageOfVisibleIndex(visibleIndex: number): number {
    if (this._pageSize <= 0 || visibleIndex < 0) return 0;
    return Math.floor(visibleIndex / this._pageSize);
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
      // Another filter is another set of records: what the old one reached says nothing about it.
      this.storageCount.forgetReach();
      this.filterRunner = undefined;
      this.updateFilterRunner();
    }
    this.resetMembership();
    // The view travels in the request: the source answers it with the next read.
    if (this.isPagedBySource) {
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
    if (!this._filter || !this.isFilteredLocally) return;
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
    this.channel.cancelReads();
    // No notification: a disposed list raises nothing, and a read in flight will never clear it.
    this._isLoading = false;
    this.onChanged = undefined;
    this.onError = undefined;
    this.owner = undefined;
    // The factory's closures, and the count callback's, hold the owner.
    this.createDefaultSource = undefined;
    this.getReadThroughCount = undefined;
    this.records = [];
    this.hiddenFlags = [];
    this.channel.clearPendingInserts();
    this.storageCount.cancelRetry();
    this.filterRunner = undefined;
    this.recordVisibility = undefined;
    this.resetMembership();
    this.resetViews();
  }

  /* The source pages itself: the loaded window IS the current page. An owner that materializes one
     object per window record must not slice those objects by pageIndex again - they are the page -
     and "bring this object onto its page" is always already satisfied. */
  public get isPagedBySource(): boolean {
    return this.sourceCapabilities.paging;
  }
  /* The read capabilities of the source, taken when it is assigned (takeCapabilities) and never read
     from the source again: a source that changes them is assigned again. The decisions below are
     separate names for what is still one value: filtering and sorting mean something only together
     with paging, and a source without paging is read whole and filtered and sorted here. A paging
     source that leaves out filtering or sorting is never filtered or sorted locally either: the view
     it has not declared is refused (see createReadRequest). */
  private sourceCapabilities: IDynamicDataSourceCapabilities = { paging: false, filtering: false, sorting: false };
  private takeCapabilities(): void {
    const caps = !!this._source ? this._source.capabilities : undefined;
    this.sourceCapabilities = {
      paging: !!caps && !!caps.paging,
      filtering: !!caps && !!caps.filtering,
      sorting: !!caps && !!caps.sorting
    };
  }
  // The list runs the filter over the records it holds.
  private get isFilteredLocally(): boolean {
    return !this.isPagedBySource;
  }
  // The list sorts the records it holds.
  private get isSortedLocally(): boolean {
    return !this.isPagedBySource;
  }
  // The window holds every record of the source, so a write to it is a write to the whole storage.
  private get isWindowWholeStorage(): boolean {
    return !this.isPagedBySource;
  }
  /* Can the records be sorted at all: the list sorts them, or the paging source declared that it
     does. From the snapshot, so it changes only when a source is assigned. A sort that is not
     available is refused when it is read (createReadRequest); an owner asks this first, so that a
     respondent is never offered one. */
  public get canSort(): boolean {
    return this.isSortedLocally || (this.isPagedBySource && this.sourceCapabilities.sorting);
  }
  // A capability is declared by the presence of the matching method: the operation names are the
  // source method names.
  public hasCapability(operation: DynamicDataOperation): boolean {
    if (this.isMembershipFixed && (operation === "insert" || operation === "remove" || operation === "move")) return false;
    const source: any = this._source;
    return !!source && typeof source[operation] === "function";
  }
  private getFields(): Array<IDynamicDataField> {
    return !!this.owner && !!this.owner.getFields ? this.owner.getFields() : undefined;
  }
  private copyRecord(record: any): any {
    return Object.assign({}, record);
  }
  // A copy without the key field, and the caller's object itself when it has none: an add keeps
  // the identity of the object it was given whenever it can.
  private removeKeyField(record: any): any {
    const field = this.keyField;
    if (!field || !record || typeof record !== "object" || !Object.prototype.hasOwnProperty.call(record, field)) return record;
    const res = this.copyRecord(record);
    delete res[field];
    return res;
  }
  /* The name a write gives the record it addresses. A source that declares keyField is told WHICH
     record changed, a source that does not is told WHERE it is - the source index, exactly as
     before, and for such a source the key and the position are the same number. Every write resolves
     it at enqueue time and before its own splice: the window already reflects every earlier write,
     so the record at index is the record the respondent acted on. The one exception is a record whose
     insert is in flight: it has no key here, and its writes carry the pending entry instead, whose
     key they read when they run (pushToSource). The owner reads it too, to follow its records
     across a read by key. */
  public get keyField(): string {
    return !!this._source ? this._source.keyField : undefined;
  }
  private getRecordKey(index: number): any {
    const field = this.keyField;
    if (!field) return this._windowOffset + index;
    // A record whose insert is in flight has no key of its own, whatever its key field holds: a
    // value a write put there names another record of the source.
    if (!!this.findPendingInsert(index)) return undefined;
    const record = this.getRecord(index);
    return !!record ? record[field] : undefined;
  }
  // The pending insert of the record at index. The list is empty unless an insert is in flight.
  private findPendingInsert(index: number): IPendingInsert {
    if (!this.channel.hasPendingInserts) return undefined;
    return this.channel.findPendingInsert(this.getRecord(index));
  }
  private replaceRecord(index: number, record: any): void {
    if (this.channel.hasPendingInserts)this.channel.repointPendingInsert(this.records[index], record);
    this.editWindow((records: Array<any>): void => { records[index] = record; });
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
    return (!!this._filter && this.isFilteredLocally) || (this._sort.length > 0 && this.isSortedLocally);
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
      const needFilter = !!this.filterRunner && this.isFilteredLocally;
      const needSort = this._sort.length > 0 && this.isSortedLocally;
      // Read once, and only when the filter or the sort has to look at the records.
      const records = needFilter || needSort ? this.records : undefined;
      const fields = needFilter || needSort ? this.getFields() : undefined;
      created = needFilter ? applyFilter(records, this.filterRunner, fields) : createIndexes(recordCount);
      if (needSort) {
        created = applySort(records, this._sort, fields, created);
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
  private moveInMembership(fromIndex: number, toIndex: number): void {
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
    this.frozenRecordCount = this.recordCount;
  }
  private resetWindow(): void {
    this.records = [];
    this.hiddenFlags = [];
    // The inserts of the source that was replaced: their answers belong to a window that is gone.
    this.channel.clearPendingInserts();
    this.storageCount.reset();
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
    if (!this.isPagedBySource) return false;
    // The records of the previous page are not in the window: they have to be fetched.
    this.load();
    return true;
  }
  // The window is the whole storage only when it starts at the first record and the source has
  // nothing behind it. An unknown total makes "count > loadedCount" unusable - the count IS the
  // window then - so the two committed facts answer it instead.
  private checkWindowIsWholeStorage(operation: string): void {
    if (!this.isWindowWholeStorage && (this._windowOffset > 0 || this.hasMore)) {
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

  /* The list side of the request channel. Private members passed as closures: the channel adds
     nothing to the public surface of the list. */
  private createChannelHost(): IDynamicDataChannelHost {
    return {
      getSource: (): IDynamicDataSource => this._source,
      isDisposed: (): boolean => this.isDisposed,
      getKeyField: (): string => this.keyField,
      isPagedBySource: (): boolean => this.isPagedBySource,
      getReadRange: (useWindowOffset: boolean): { skip: number, take: number } => this.getReadRange(useWindowOffset),
      createReadRequest: (skip: number, take: number): IDynamicDataReadRequest => this.createReadRequest(skip, take),
      commitRead: (data: any, skip: number, take: number, isPagedRead: boolean): boolean =>
        this.commitRead(data, skip, take, isPagedRead),
      onReadFailed: (error: any): void => this.onReadFailed(error),
      setIsLoading: (val: boolean): void => this.setIsLoading(val),
      raiseError: (error: any, operation: DynamicDataOperation): void => this.raiseError(error, operation),
      applyInsertAnswer: (entry: IPendingInsert): void => this.applyInsertAnswer(entry),
      syncWindowAfterSyncPush: (): void => this.syncWindowAfterSyncPush()
    };
  }
  // The page of a pending retry, else the window in force (a refresh) or the page (a load); a source
  // without paging is read whole: skip 0, take 0, whatever the page size is.
  private getReadRange(useWindowOffset: boolean): { skip: number, take: number } {
    if (!this.isPagedBySource) return { skip: 0, take: 0 };
    let skip: number;
    const retryPageIndex = this.storageCount.retryPageIndex;
    if (retryPageIndex !== undefined) {
      skip = retryPageIndex * this._pageSize;
    } else {
      skip = useWindowOffset && this.isLoaded ? this._windowOffset : this._pageIndex * this._pageSize;
    }
    return { skip: skip, take: this._pageSize };
  }
  /* One read = one request: the range and the view the list wants. The source keeps no state between
     the calls, so nothing has to be pushed to it before a read and two questions may share it. A
     source without paging is read whole and the list runs the view, so its request carries none. A
     paging source gets the view: a part it has not declared is refused here, before anything is
     sent - the list would otherwise filter or sort one page - so a part that reaches the request
     is either declared or empty. The throw takes the read down the path of a source that throws
     (onReadFailed). */
  private createReadRequest(skip: number, take: number): IDynamicDataReadRequest {
    if (!this.isPagedBySource) return { skip: 0, take: 0, filter: "", sort: [] };
    const caps = this.sourceCapabilities;
    if (!!this._filter && !caps.filtering) throw this.createUndeclaredViewError("filtering");
    if (this._sort.length > 0 && !caps.sorting) throw this.createUndeclaredViewError("sorting");
    return { skip: skip, take: take, filter: this._filter, sort: this._sort.slice() };
  }
  private createUndeclaredViewError(capability: string): Error {
    return new Error("DynamicDataList: the source pages but does not declare the \"" + capability +
      "\" capability, so the view cannot be read. The window in force is kept.");
  }
  // The previous window stays in force, and so does the page it was read for: a retry that failed
  // has changed nothing. The failed read owns the loading state it inherited.
  private onReadFailed(error: any): void {
    this.storageCount.cancelRetry();
    this.setIsLoading(false);
    this.raiseError(error, "read");
  }
  /* The window, its offset, the total and what is known about it are committed together: while a
     read is pending or after it was rejected, the previous window and its own offset stay in force.
     Returns whether the window was committed - an empty page past the end is not. */
  private commitRead(data: any, skip: number, take: number, isPagedRead: boolean): boolean {
    const result = toReadResult(data);
    const records = result.records;
    if (isPagedRead) {
      /* A page past the end is not committed: the count records the retry and the list reads that
         page instead (getReadRange takes its skip from it). No pageChanged here: until the retry commits,
         the question shows the window in force together with the page it was read for. */
      if (this.storageCount.stepBackPastEnd(result, skip, take, records.length, this._pageIndex, this._pageSize, this._filter)) return false;
      const retryPageIndex = this.storageCount.commitWindow(result, skip, take, records.length, this._filter);
      if (retryPageIndex !== undefined) {
        this._pageIndex = retryPageIndex;
        this.pageIndexes = undefined;
      }
      this.records = records;
      this._windowOffset = skip;
    } else {
      // The whole storage, whatever shape it came in: total and hasMore mean nothing here.
      this.storageCount.commitWholeStorage();
      this.records = records;
      this._windowOffset = 0;
    }
    this.isLoaded = true;
    this.resetWindowState();
    // The reset of a read stands for the one a write still owed (raisePendingReset).
    this.isResetPending = false;
    this.raiseChanged({ type: "reset" });
    return true;
  }

  /* The window half of an insert answer: the merged record (mergeInsertAnswer) replaces the one in
     the window, so that every later write finds the key on it. */
  private applyInsertAnswer(entry: IPendingInsert): void {
    // Gone from the window: it was removed, or a read replaced the window - and that read brought
    // the key itself.
    const index = this.records.indexOf(entry.record);
    if (index < 0) return;
    this.runWrite((): void => { this.replaceRecord(index, mergeInsertAnswer(entry, entry.record)); });
    this.raiseChanged({ type: "recordChanged", index: index, field: undefined });
  }
  private syncWindowAfterSyncPush(): void {
    if (!this.isWindowWholeStorage || this.useReadThrough) return;
    /* An assigned source is read, not watched (useReadThrough). The window takes the array a write
       has stored - the setter may have normalized what it was handed, and the list has to answer
       with what is stored - but only while that array was the window when the write started. An
       array replaced outside the list would otherwise enter the window with the next write and
       without a reset: the owner would hold it in its value and not in its objects. The window then
       keeps the list's own writes (editWindow), and the rest arrives with the next read. */
    if (this.isAssignedSourceInUse && !this.isAssignedArrayInSync) return;
    /* For an ArrayDynamicDataSource the push IS the storage and is synchronous: the window is
       rebuilt from it so that the list never holds an array the owner does not. useReadThrough above
       does not already answer this - it is true only when the list reads through as well, and a
       list that does not still has to take the array the push has just written. Inside a batch that
       is the array being built; the stored one is taken when the batch ends (syncWindowAfterBatch).
       Any other source is left alone: read() may answer asynchronously, and an unwrapped promise
       here would empty the window. */
    if (!(this._source instanceof ArrayDynamicDataSource)) return;
    const res = this._source.read();
    this.takeStoredArray(Array.isArray(res) ? res : []);
  }
  /* The array the source stored becomes the window. It is not always the array the list wrote - a
     setter may normalize a record or drop one - and then it is a change of the records like any
     other. Records that were replaced: the cached views are dropped and the page index is clamped,
     exactly as for an edit (replaceRecord), so a frozen membership keeps every record in its place.
     Another record count: which record is which is no longer known, so everything derived is decided
     again as after a read, and the owner is owed a reset (raisePendingReset). */
  private takeStoredArray(stored: Array<any>): void {
    const written = this.windowRecords;
    this.records = stored;
    if (stored === written) return;
    if (stored.length !== written.length) {
      this.resetWindowState();
      this.isResetPending = true;
      return;
    }
    // Nothing is cached over the contents of the records without a local filter or sort.
    if (!this.hasLocalViews) return;
    for (let i = 0; i < stored.length; i++) {
      if (stored[i] !== written[i]) {
        this.resetViews();
        this.clampPageIndexAfterChange();
        return;
      }
    }
  }
}
