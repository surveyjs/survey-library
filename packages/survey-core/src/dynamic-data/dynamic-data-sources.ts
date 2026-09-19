import { ISurveyData } from "../interfaces/data-interfaces";
import { IDynamicDataSource } from "./dynamic-data-interfaces";

// An in-memory source over an array the caller owns. It is constructed from a getter/setter pair,
// not from an array reference: the questions expose their records through question.value, which must
// be replaced - never mutated - on every write, so that Question.setNewValue sees a different array
// and onValueChanged.oldValue stays correct. Every write therefore builds a new array.
export class ArrayDynamicDataSource implements IDynamicDataSource {
  constructor(private getArray: () => Array<any> | undefined, private setArray: (arr: Array<any>) => void) { }
  private batchDepth: number = 0;
  private batchArray: Array<any>;
  private batchHasWrites: boolean = false;
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
    this.batchHasWrites = false;
    let newArray: Array<any>;
    let hasWrites: boolean;
    try {
      func();
    } finally {
      this.batchDepth = 0;
      newArray = this.batchArray;
      hasWrites = this.batchHasWrites;
      this.batchArray = undefined;
      this.batchHasWrites = false;
    }
    // The writes are counted instead of comparing the result with a fresh read: a getter that
    // composes the array on the fly (the matrix pads its value up to rowCount) returns a different
    // instance every time and an empty batch would write the composed array back into the owner.
    if (hasWrites) {
      this.setArray(newArray);
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
  public read(): Array<any> {
    return this.batchDepth > 0 ? this.batchArray : this.readCore();
  }
  private readCore(): Array<any> {
    const res = this.getArray();
    return Array.isArray(res) ? res : [];
  }
  private write(arr: Array<any>): void {
    if (this.batchDepth > 0) {
      this.batchArray = arr;
      this.batchHasWrites = true;
    } else {
      this.setArray(arr);
    }
  }
  public insert(sourceIndex: number, record: any): void {
    const arr = this.read().slice();
    const index = Math.max(0, Math.min(sourceIndex, arr.length));
    arr.splice(index, 0, record);
    this.write(arr);
  }
  public update(sourceIndex: number, record: any): void {
    const arr = this.read();
    if (!this.isInRange(sourceIndex, arr.length)) return;
    const newArray = arr.slice();
    newArray[sourceIndex] = record;
    this.write(newArray);
  }
  public remove(sourceIndex: number): void {
    const arr = this.read();
    if (!this.isInRange(sourceIndex, arr.length)) return;
    const newArray = arr.slice();
    newArray.splice(sourceIndex, 1);
    this.write(newArray);
  }
  public move(fromSourceIndex: number, toSourceIndex: number): void {
    const arr = this.read();
    if (!this.isInRange(fromSourceIndex, arr.length) || !this.isInRange(toSourceIndex, arr.length)) return;
    if (fromSourceIndex === toSourceIndex) return;
    const newArray = arr.slice();
    const record = newArray[fromSourceIndex];
    newArray.splice(fromSourceIndex, 1);
    newArray.splice(toSourceIndex, 0, record);
    this.write(newArray);
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
