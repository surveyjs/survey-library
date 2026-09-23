// The data-source contract for DynamicDataList. Capabilities are declared by the presence of the
// optional methods: a source that has "readRange" pages, filters and sorts itself, a source that
// has "remove" can delete a record, and so on. The list falls back to a local implementation for
// every absent capability.
//
// How to write a source (the short version, for the documentation that follows this series):
//
//   const source = {
//     // Required. Every record, in source order. The list calls it only when readRange is absent,
//     // and then pages, filters and sorts what it returns on its own side.
//     read: () => fetch("/api/orders").then(r => r.json()),
//     // Optional. The number of records read() would return; only for a read() that composes them.
//     count: () => state.rows.length,
//     // Optional. Present -> the source pages, filters AND sorts itself: the list never calls
//     // read() and every read is ONE request carrying the range and the view it wants.
//     //   request.skip   the first record to return, in the source's filtered and sorted order
//     //   request.take   how many; 0 means "everything from skip"
//     //   request.filter the expression text of question.filterExpression, "" for no filter
//     //   request.sort   { field, direction } descriptors, applied in array order, [] for none
//     // The answer is { records, total?, hasMore? }. "total" is the number of records the filter
//     // matches; leave it out when counting them is expensive - the list then learns the end from
//     // "hasMore", or from a window that came back shorter than "take".
//     readRange: (request) =>
//       fetch(`/api/orders?skip=${request.skip}&take=${request.take}&where=${translate(request.filter)}`)
//         .then(r => r.json())
//         .then(r => ({ records: r.items, total: r.total })),
//     // Optional, one capability each. sourceIndex is the position in the WHOLE source, not in the
//     // loaded page: the list has already added the offset of the page the edit was made on.
//     // Missing insert -> no add button; missing remove -> no delete button; missing move -> no
//     // drag reorder; missing update -> the question is read-only.
//     insert: (sourceIndex, record) => post("/api/orders", { at: sourceIndex, record }),
//     update: (sourceIndex, record, changedFields) => put(`/api/orders/${sourceIndex}`, record),
//     remove: (sourceIndex) => del(`/api/orders/${sourceIndex}`),
//     move: (from, to) => post("/api/orders/move", { from, to })
//   };
//   matrixQuestion.dataSource = source;   // or panelQuestion.dataSource = source
//
// The filter is a survey expression over the record fields, e.g. "{country} = 'de' and {age} > 18".
// The list never parses it. A source that speaks another dialect translates it with the library's
// own parser and re-renders the operand tree in its dialect:
//   const operand = new ConditionsParser().parseExpression(request.filter);
//   const where = operand.toString(op => op.getType() === "variable" ? op.variable : undefined);
// The callback answers for the nodes the source knows and returns undefined for the rest.
//
// Paging implies filtering and sorting: a source that pages on its side but leaves the filter to
// the list cannot exist, because the list would filter one page. A source that cannot filter
// server-side returns everything from read() and gets local paging, filtering and sorting for free.
//
// Every method may return a value or a Promise. A rejected promise is reported through
// survey.onDynamicDataError with the operation name; the records the question shows are kept as
// they are. While a source is attached the question is excluded from survey.data - the records are
// the source's, not an answer - and question.isReady is false while a page is being read.

export type DynamicDataSortDirection = "asc" | "desc";
export type DynamicDataFieldType = "string" | "number" | "date" | "boolean" | "any";
export type DynamicDataOperation = "read" | "insert" | "update" | "remove" | "move";

export interface IDynamicDataSort {
  field: string;
  direction: DynamicDataSortDirection;
}
// One read = one request: the range and the view the list wants, so that the source keeps no state
// of its own and two questions can share it.
export interface IDynamicDataReadRequest {
  // The first record to return, in the source's filtered and sorted order.
  skip: number;
  // How many records to return; 0 means "everything from skip".
  take: number;
  // The expression text of the filter, "" for no filter. The list never parses it.
  filter: string;
  // The sort descriptors, applied in array order; [] for the source order.
  sort: Array<IDynamicDataSort>;
}
export interface IDynamicDataReadResult {
  records: Array<any>;
  // Absent -> the source does not know how many records match. The list then learns the end from
  // hasMore, or from a window shorter than the take it asked for.
  total?: number;
  // Optional, read only when total is absent: are there records behind this window? Absent ->
  // inferred: a full window (records.length >= take, take > 0) may have more, a short one is the end.
  hasMore?: boolean;
}
export interface IDynamicDataSource {
  // Always required: every record, in source order. Synchronous for in-memory sources, a Promise
  // for a remote one.
  read(): Array<any> | Promise<Array<any>>;
  // Present -> the number of records read() would return, without composing them. Only a source
  // whose read() builds the array on the fly needs it; the list reads .length otherwise.
  count?(): number;
  // Present -> the source pages, filters AND sorts itself: the list never calls read() and every
  // read is one request carrying the range and the view.
  // Absent -> the list calls read() once and pages, filters and sorts what it returns.
  readRange?(request: IDynamicDataReadRequest): IDynamicDataReadResult | Promise<IDynamicDataReadResult>;
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
