import { ISurveyData } from "../interfaces/data-interfaces";
import { IDynamicDataSource } from "./dynamic-data-interfaces";

// An in-memory source over an array the caller owns. It is constructed from a getter/setter pair,
// not from an array reference: the questions expose their records through question.value, which must
// be replaced - never mutated - on every write, so that Question.setNewValue sees a different array
// and onValueChanged.oldValue stays correct. Every write therefore builds a new array.
export class ArrayDynamicDataSource implements IDynamicDataSource {
  constructor(private getArray: () => Array<any> | undefined, private setArray: (arr: Array<any>) => void) { }
  // Wraps a local variable; the mutations replace it. For tests and standalone use.
  public static fromArray(arr?: Array<any>): ArrayDynamicDataSource {
    let local: Array<any> = Array.isArray(arr) ? arr : [];
    return new ArrayDynamicDataSource(() => local, (newArray: Array<any>): void => { local = newArray; });
  }
  public get array(): Array<any> {
    return this.read();
  }
  public read(): Array<any> {
    const res = this.getArray();
    return Array.isArray(res) ? res : [];
  }
  public insert(sourceIndex: number, record: any): void {
    const arr = this.read().slice();
    const index = Math.max(0, Math.min(sourceIndex, arr.length));
    arr.splice(index, 0, record);
    this.setArray(arr);
  }
  public update(sourceIndex: number, record: any): void {
    const arr = this.read();
    if (!this.isInRange(sourceIndex, arr.length)) return;
    const newArray = arr.slice();
    newArray[sourceIndex] = record;
    this.setArray(newArray);
  }
  public remove(sourceIndex: number): void {
    const arr = this.read();
    if (!this.isInRange(sourceIndex, arr.length)) return;
    const newArray = arr.slice();
    newArray.splice(sourceIndex, 1);
    this.setArray(newArray);
  }
  public move(fromSourceIndex: number, toSourceIndex: number): void {
    const arr = this.read();
    if (!this.isInRange(fromSourceIndex, arr.length) || !this.isInRange(toSourceIndex, arr.length)) return;
    if (fromSourceIndex === toSourceIndex) return;
    const newArray = arr.slice();
    const record = newArray[fromSourceIndex];
    newArray.splice(fromSourceIndex, 1);
    newArray.splice(toSourceIndex, 0, record);
    this.setArray(newArray);
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
