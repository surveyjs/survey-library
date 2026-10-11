import { ISurveyData } from "../interfaces/data-interfaces";
import { Helpers } from "../helpers";
import { DynamicDataOperation, IDynamicDataSource } from "./dynamic-data-interfaces";
import { createKeyRemap } from "./dynamic-data-record-remap";

/* What an owner adds to the array source.
   isMembershipFixed: the records are the owner's to define; insert, remove and move write nothing.
   getMinCount: the records the owner always has (the Dynamic Matrix's rowCount). A stored array that
   is shorter reads padded up to it with copies of getDefaultRecord(); the padding is virtual and
   reaches the storage only with a write. The stored array is never truncated to it.
   getDefaultRecord: what a padded record reads as; undefined without it. */
export interface IArrayDynamicDataSourceOptions {
  isMembershipFixed?: boolean;
  getMinCount?: () => number;
  getDefaultRecord?: () => any;
}
// An in-memory source over an array the caller owns. It is constructed from a getter/setter pair,
// not from an array reference: the questions expose their records through question.value, which must
// be replaced - never mutated - on every write, so that Question.setNewValue sees a different array
// and onValueChanged.oldValue stays correct. Every write therefore builds a new array.
// The source owns how the storage reads - the padding included -; the owner owns how a write is
// stored (setArray).
export class ArrayDynamicDataSource implements IDynamicDataSource {
  /* setArray gets the writes that made the array, in order - one, or every write of a batch - so that
     an owner whose value has a shape rule per kind of write can apply it. */
  constructor(private getArray: () => Array<any> | undefined,
    private setArray: (arr: Array<any>, operations?: Array<DynamicDataOperation>) => void,
    private options: IArrayDynamicDataSourceOptions = {}) { }
  // A list over this source takes the flag from it (DynamicDataList.createReadThrough).
  public get isMembershipFixed(): boolean {
    return !!this.options.isMembershipFixed;
  }
  /* The length read() would return, without composing the array. Inside a batch the array being built,
     which is not padded again: a removal may leave it below the minimum until the owner stores it. */
  public get count(): number {
    if (this.batchDepth > 0) return this.batchArray.length;
    return Math.max(this.readStored().length, this.getMinCount());
  }
  /* One record of read(), without composing the array; undefined out of range. A padded position reads
     defaultRecord when it is given - shared, not copied: a caller that only reads passes one for every
     index -, else getDefaultRecord(). Inside a batch, the array being built. */
  public readAt(index: number, defaultRecord?: any): any {
    if (this.batchDepth > 0) return this.batchArray[index];
    if (index < 0) return undefined;
    const stored = this.readStored();
    if (index < stored.length) return stored[index];
    if (index >= this.getMinCount()) return undefined;
    return defaultRecord !== undefined ? defaultRecord : this.getDefaultRecord();
  }
  // Appends copies of the default record until records holds the minimum count; records is modified and returned.
  public padRecords(records: Array<any>): Array<any> {
    const minCount = this.getMinCount();
    if (records.length >= minCount) return records;
    const defaultRecord = this.getDefaultRecord();
    for (let i = records.length; i < minCount; i++) {
      records.push(Helpers.getUnbindValue(defaultRecord));
    }
    return records;
  }
  private getMinCount(): number {
    return !!this.options.getMinCount ? this.options.getMinCount() : 0;
  }
  private getDefaultRecord(): any {
    return !!this.options.getDefaultRecord ? this.options.getDefaultRecord() : undefined;
  }
  private batchDepth: number = 0;
  private batchArray: Array<any>;
  private batchOperations: Array<DynamicDataOperation> = [];
  // One record operation of the list is often several source writes: pad the array, then set a
  // field; move a record, then update it. The owner's array has to be replaced once, not once per
  // step, or every intermediate state would reach the owner as a value change of its own. Reads
  // inside the batch answer from the array being built, so a read-through list stays consistent.
  public batch(func: () => void): void {
    if (this.batchDepth > 0) {
      func();
      return;
    }
    this.batchDepth = 1;
    this.batchArray = this.readCore();
    this.batchOperations = [];
    let newArray: Array<any>;
    let operations: Array<DynamicDataOperation>;
    try {
      func();
    } finally {
      this.batchDepth = 0;
      newArray = this.batchArray;
      operations = this.batchOperations;
      this.batchArray = undefined;
      this.batchOperations = [];
    }
    // The writes are counted instead of comparing the result with a fresh read: a read that pads the
    // stored array (getMinCount) or a getter that composes it returns a different instance every time,
    // and an empty batch would write the composed array back into the owner.
    if (operations.length > 0) {
      this.setArray(newArray, operations);
    }
  }
  // Wraps a local variable; the mutations replace it. For tests and standalone use.
  public static fromArray(arr?: Array<any>): ArrayDynamicDataSource {
    let local: Array<any> = Array.isArray(arr) ? arr : [];
    return new ArrayDynamicDataSource(() => local, (newArray: Array<any>): void => { local = newArray; });
  }
  public get array(): Array<any> {
    return this.read();
  }
  /* The source does not page, so the request has nothing to say to it: the list reads it with no
     request at all wherever it reads through (a method with fewer parameters satisfies the
     interface), and the answer is the array itself, never a wrapper. */
  public read(): Array<any> {
    return this.batchDepth > 0 ? this.batchArray : this.readCore();
  }
  // The stored array as read() gives it outside a batch: itself when it holds the minimum count, else a padded copy.
  private readCore(): Array<any> {
    const res = this.readStored();
    return res.length >= this.getMinCount() ? res : this.padRecords(res.slice());
  }
  private readStored(): Array<any> {
    const res = this.getArray();
    return Array.isArray(res) ? res : [];
  }
  private write(arr: Array<any>, operation: DynamicDataOperation): void {
    if (this.batchDepth > 0) {
      this.batchArray = arr;
      this.batchOperations.push(operation);
    } else {
      this.setArray(arr, [operation]);
    }
  }
  // A source without keyField: the key IS the source index, so update/remove/move take a position.
  public insert(record: any, sourceIndex: number): void {
    if (this.isMembershipFixed) return;
    const arr = this.read().slice();
    const index = Math.max(0, Math.min(sourceIndex, arr.length));
    arr.splice(index, 0, record);
    this.write(arr, "insert");
  }
  public update(sourceIndex: number, record: any): void {
    const arr = this.read();
    if (!this.isInRange(sourceIndex, arr.length)) return;
    const newArray = arr.slice();
    newArray[sourceIndex] = record;
    this.write(newArray, "update");
  }
  public remove(sourceIndex: number): void {
    if (this.isMembershipFixed) return;
    const arr = this.read();
    if (!this.isInRange(sourceIndex, arr.length)) return;
    const newArray = arr.slice();
    newArray.splice(sourceIndex, 1);
    this.write(newArray, "remove");
  }
  public move(fromSourceIndex: number, toSourceIndex: number): void {
    if (this.isMembershipFixed) return;
    const arr = this.read();
    if (!this.isInRange(fromSourceIndex, arr.length) || !this.isInRange(toSourceIndex, arr.length)) return;
    if (fromSourceIndex === toSourceIndex) return;
    const newArray = arr.slice();
    const record = newArray[fromSourceIndex];
    newArray.splice(fromSourceIndex, 1);
    newArray.splice(toSourceIndex, 0, record);
    this.write(newArray, "move");
  }
  private isInRange(index: number, length: number): boolean {
    return index >= 0 && index < length;
  }
}

// The same array source over a value stored in ISurveyData (a survey, a panel item or a matrix row).
// getValue/setValue are all the list needs from ISurveyData: comments are ordinary keys inside the
// records, so getComment/setComment never come into play.
export class SurveyDataDynamicDataSource extends ArrayDynamicDataSource {
  constructor(public data: ISurveyData, public valueName: string) {
    super(() => data.getValue(valueName), (arr: Array<any>): void => { data.setValue(valueName, arr, false); });
  }
}

/* The released rule of a row: a record is empty when it holds no value but undefined or null. One rule
   for an object and for a stored record without one (a cleared cell removes the row's key). */
export function isRecordEmpty(record: any): boolean {
  if (Helpers.isValueEmpty(record)) return true;
  for (const key in record) {
    if (record[key] !== undefined && record[key] !== null) return false;
  }
  return true;
}

// A row of RowsDynamicDataSource: its value is the key of its record in the answer; a row without a value (hasValue) is no record.
export interface IDynamicDataRow {
  value: any;
  hasValue: boolean;
}
/* The records of an owner whose rows define them (the Multi-Select Matrix), over its keyed answer. A
   record is one row with a non-empty value, in rows order - the record index -, and it is the answer's
   object under the row's value itself, value[row.value], never a copy. A row the answer holds no key for
   reads undefined: a virtual empty record that a read never writes. Two rows with one value are two
   records that read one key. A key is compared as a string, the way an object key is.
   The keyed answer is the only stored value. The composed array is derived from it and cached by the
   answer instance and the rows: a list reads through it on every record access, and a write compares
   the records it gets back with the composed ones by instance (writeRecords), so a read must give the
   same instances again.
   The membership is the rows': insert, remove and move write nothing, and a write of an array of
   another length, or of one that moves a record to another position, is refused and stores nothing.
   getRows: the rows, in their order. getValue: the keyed answer. storeValue: the new answer - a copy
   of the stored one with the written records in place - and the indexes of the records written.
   The owner calls rowsChanged() after every change of its rows - an assignment, an array change, a
   reorder, a row value renamed -; the caches go, and onRecordsReplaced is told where each old record
   went. */
export class RowsDynamicDataSource<T extends IDynamicDataRow = IDynamicDataRow> extends ArrayDynamicDataSource {
  // createRemap: the new index of an old record by its key - two rows of one key by occurrence -, -1 for a key that is gone.
  public onRecordsReplaced: (createRemap: () => ((index: number) => number)) => void;
  constructor(private getRows: () => Array<T>, private getValue: () => any,
    private storeValue: (newValue: any, changedIndexes: Array<number>) => void) {
    super(() => this.getRecords(), (records: Array<any>): void => { this.writeRecords(records); }, { isMembershipFixed: true });
  }
  private rowsCache: { items: Array<T>, keys: Array<string>, hasDuplicates: boolean };
  private recordsCache: { value: any, records: Array<any> };
  private getRowsCache(): { items: Array<T>, keys: Array<string>, hasDuplicates: boolean } {
    if (!!this.rowsCache) return this.rowsCache;
    const items = (this.getRows() || []).filter((item: T): boolean => item.hasValue);
    const keys = items.map((item: T): string => String(item.value));
    const hasDuplicates = keys.some((key: string, index: number): boolean => keys.indexOf(key) !== index);
    this.rowsCache = { items: items, keys: keys, hasDuplicates: hasDuplicates };
    return this.rowsCache;
  }
  // The rows of the records, in record order.
  public get items(): Array<T> {
    return this.getRowsCache().items;
  }
  public get count(): number {
    return this.items.length;
  }
  public get hasDuplicateKeys(): boolean {
    return this.getRowsCache().hasDuplicates;
  }
  public itemAt(index: number): T {
    return this.items[index];
  }
  // The index of the first record of a key; -1 for none.
  public indexOfKey(key: any): number {
    return this.getRowsCache().keys.indexOf(String(key));
  }
  // One stored record, without composing the array. No row pads: defaultRecord is not used.
  public readAt(index: number, defaultRecord?: any): any {
    const item = this.itemAt(index);
    if (!item) return undefined;
    const value = this.getValue();
    return isObject(value) ? value[item.value] : undefined;
  }
  public rowsChanged(): void {
    const oldKeys = this.getRowsCache().keys;
    this.rowsCache = undefined;
    this.recordsCache = undefined;
    const newKeys = this.getRowsCache().keys;
    if (!!this.onRecordsReplaced) {
      this.onRecordsReplaced((): ((index: number) => number) => createKeyRemap(oldKeys, newKeys, String, true));
    }
  }
  // Composed once per answer instance and rows change.
  private getRecords(): Array<any> {
    const value = this.getValue();
    const cache = this.recordsCache;
    if (!!cache && cache.value === value) return cache.records;
    const records = this.composeRecords();
    this.recordsCache = { value: value, records: records };
    return records;
  }
  // The one method that composes the records; everything else reads the cache (getRecords).
  private composeRecords(): Array<any> {
    const value = this.getValue();
    const isValueObject = isObject(value);
    return this.items.map((item: T): any => isValueObject ? value[item.value] : undefined);
  }
  /* The list hands the whole array back, and only the positions whose record instance changed are
     written: a write replaces one element of the array it read and keeps every other one, so the stale
     record of another row on the same key never overwrites it. The answer is copied first, which keeps
     the keys that are not rows - a question sharing the value name, an unknown key -, and an empty
     record deletes its key. */
  private writeRecords(records: Array<any>): void {
    const composed = this.getRecords();
    if (!Array.isArray(records) || records.length !== composed.length) return;
    const changed: Array<number> = [];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record === composed[i]) continue;
      // Only a record with content can be moved: an empty one is what every unanswered row holds.
      if (!isRecordEmpty(record) && composed.indexOf(record) > -1) return;
      changed.push(i);
    }
    if (changed.length === 0) return;
    const items = this.items;
    const value = this.getValue();
    const newValue = isObject(value) ? Object.assign({}, value) : {};
    changed.forEach((index: number): void => {
      const key = items[index].value;
      if (isRecordEmpty(records[index])) {
        delete newValue[key];
      } else {
        newValue[key] = records[index];
      }
    });
    this.storeValue(newValue, changed);
  }
}
function isObject(value: any): boolean {
  return value !== null && typeof value === "object";
}

/* An in-memory source without keyField is written by position: the index a list sends is the
   position in the array as that list last read it. Two lists that write one such array would each
   send positions the other one's writes have shifted, and a write would land on another record. So
   such a source has one writer: the list it was assigned to last (DynamicDataList.assignSource) -
   also when it is assigned again to a list that holds it already. A list that holds it while another
   list writes it only reads it: its write capabilities are false, and the question reports each
   refused write. When the writer changes, the earlier writer is told (onChanged), so that its
   question refreshes what it shows. A list that leaves the source or is disposed releases the claim,
   and a list that only reads stays read-only until the source is assigned to it again. A keyed source
   is written by key and stays shared. The question's own default source is never assigned, so it is
   not tracked.
   The claim is a token object the list owns, not the list: the source does not keep an earlier
   writer, or the survey around it, alive. Only the current writer's onChanged is reachable from the
   source, until another list claims it. */
const sourceWriters: WeakMap<IDynamicDataSource, object> = new WeakMap<IDynamicDataSource, object>();
const writerCallbacks: WeakMap<object, () => void> = new WeakMap<object, () => void>();
// The claim a writer that left keeps in place: the lists that only read stay read-only. A source that was never assigned (a standalone list) has no claim.
const releasedClaim: object = {};
function isWrittenByPosition(source: IDynamicDataSource): boolean {
  return !!source && !source.keyField && source instanceof ArrayDynamicDataSource;
}
// The list of token leaves oldSource and is assigned newSource (undefined for none; the same source to claim it again).
export function changeSourceWriter(token: object, oldSource: IDynamicDataSource, newSource: IDynamicDataSource, onChanged: () => void): void {
  if (!!oldSource && oldSource !== newSource && sourceWriters.get(oldSource) === token) sourceWriters.set(oldSource, releasedClaim);
  if (!isWrittenByPosition(newSource)) return;
  const previous = sourceWriters.get(newSource);
  sourceWriters.set(newSource, token);
  writerCallbacks.set(token, onChanged);
  const notify = !!previous && previous !== token ? writerCallbacks.get(previous) : undefined;
  if (!!notify) notify();
}
export function isSourceWrittenByAnother(source: IDynamicDataSource, token: object): boolean {
  const writer = isWrittenByPosition(source) ? sourceWriters.get(source) : undefined;
  return !!writer && writer !== token;
}
