import { ISurveyData } from "../interfaces/data-interfaces";
import { DynamicDataOperation, IDynamicDataSource } from "./dynamic-data-interfaces";

// An in-memory source over an array the caller owns. It is constructed from a getter/setter pair,
// not from an array reference: the questions expose their records through question.value, which must
// be replaced - never mutated - on every write, so that Question.setNewValue sees a different array
// and onValueChanged.oldValue stays correct. Every write therefore builds a new array.
export class ArrayDynamicDataSource implements IDynamicDataSource {
  /* isMembershipFixed: the records are the owner's to define; insert, remove and move write nothing.
     setArray gets the writes that made the array, in order - one, or every write of a batch - so that
     an owner whose value has a shape rule per kind of write can apply it. */
  constructor(private getArray: () => Array<any> | undefined,
    private setArray: (arr: Array<any>, operations?: Array<DynamicDataOperation>) => void,
    private isMembershipFixed: boolean = false) { }
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
    // The writes are counted instead of comparing the result with a fresh read: a getter that
    // composes the array on the fly (the matrix pads its value up to rowCount) returns a different
    // instance every time and an empty batch would write the composed array back into the owner.
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
  private readCore(): Array<any> {
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

/* An in-memory source without keyField is written by position: the index a list sends is the
   position in the array as that list last read it. Two lists that write one such array would each
   send positions the other one's writes have shifted, and a write would land on another record. So
   such a source has one writer: the first list it is assigned to (DynamicDataList.assignSource). A
   list assigned it while another list writes it only reads it - its write capabilities are false,
   and the question reports each refused write. Assigning another source, or none, and disposing the
   list release the claim; a list that only reads does not take it over until the source is assigned
   to it again. A keyed source is written by key and stays shared. The question's own default source
   is never assigned, so it is not tracked. */
const sourceWriters: WeakMap<IDynamicDataSource, object> = new WeakMap<IDynamicDataSource, object>();
function isWrittenByPosition(source: IDynamicDataSource): boolean {
  return !!source && !source.keyField && source instanceof ArrayDynamicDataSource;
}
// The list leaves oldSource and is assigned newSource (undefined for none).
export function changeSourceWriter(writer: object, oldSource: IDynamicDataSource, newSource: IDynamicDataSource): void {
  if (!!oldSource && sourceWriters.get(oldSource) === writer) sourceWriters.delete(oldSource);
  if (isWrittenByPosition(newSource) && !sourceWriters.has(newSource)) sourceWriters.set(newSource, writer);
}
export function isSourceWrittenByAnother(source: IDynamicDataSource, list: object): boolean {
  if (!isWrittenByPosition(source)) return false;
  const writer = sourceWriters.get(source);
  return !!writer && writer !== list;
}
