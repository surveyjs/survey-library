// The data-source contract for DynamicDataList. Capabilities are declared by the presence of the
// optional methods: a source that has "filter" filters itself, a source that has "readRange" pages
// itself, and so on. The list falls back to a local implementation for every absent capability.

export type DynamicDataSortDirection = "asc" | "desc";
export type DynamicDataFieldType = "string" | "number" | "date" | "boolean" | "any";
export type DynamicDataOperation = "read" | "insert" | "update" | "remove" | "move" | "filter" | "sort";

export interface IDynamicDataSort {
  field: string;
  direction: DynamicDataSortDirection;
}
export interface IDynamicDataReadResult {
  records: Array<any>;
  total: number;
}
export interface IDynamicDataSource {
  // Always required: every record, in source order. Synchronous for in-memory sources, a Promise
  // for a remote one.
  read(): Array<any> | Promise<Array<any>>;
  // Present -> the source pages itself: the list reads windows and never calls read();
  // absent -> the list calls read() once and pages locally.
  readRange?(skip: number, take: number): IDynamicDataReadResult | Promise<IDynamicDataReadResult>;
  // Present -> the source applies the filter/sort itself and the following reads honour it;
  // absent -> DynamicDataList filters/sorts the records it has read.
  // The filter is a survey expression over the record fields, e.g. "{country} = 'de' and {age} > 18".
  // A source that speaks another dialect parses it with ConditionsParser and re-renders the operand
  // tree through Operand.toString(callback) - see dynamic-data-filter.ts.
  filter?(expression: string): void | Promise<void>;
  sort?(sort: Array<IDynamicDataSort>): void | Promise<void>;
  // Present -> edits are pushed to the source (write-through); absent -> the source is read-only
  // for that operation and the edit stays in the loaded window.
  insert?(sourceIndex: number, record: any): void | Promise<void>;
  update?(sourceIndex: number, record: any, changedFields: Array<string>): void | Promise<void>;
  remove?(sourceIndex: number): void | Promise<void>;
  move?(fromSourceIndex: number, toSourceIndex: number): void | Promise<void>;
  // Present -> the source collects the writes of func and applies them as one; absent -> the list
  // just runs func. See DynamicDataList.batch.
  batch?(func: () => void): void;
}
export interface IDynamicDataField {
  name: string;
  dataType?: DynamicDataFieldType;
  compare?(a: any, b: any): number;
}
export type IDynamicDataListChange =
  { type: "reset" } |
  { type: "recordChanged", index: number, field: string } |
  { type: "recordAdded", index: number } |
  { type: "recordRemoved", index: number } |
  { type: "recordMoved", from: number, to: number } |
  { type: "loading", isLoading: boolean } |
  { type: "pageChanged" };

export interface IDynamicDataOwner {
  getFields(): Array<IDynamicDataField>;
  onDataListChanged(change: IDynamicDataListChange): void;
}
