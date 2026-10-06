// The data-source contract for DynamicDataList. A source has one read, read(request), and declares
// what it does with the request in two ways, on purpose:
// - the read capabilities by flags (capabilities: { paging, filtering, sorting }): every source has
//   a read, so the presence of a method cannot tell what the read does with the range and the view.
//   The list takes the flags when the source is assigned to it; a source that changes them is
//   assigned again;
// - the write capabilities by the presence of the matching method: a source that has "remove" can
//   delete a record, one without it cannot, and so on.
// A missing flag means false. The list falls back to a local implementation for every capability
// the source does not declare, except a sort a paging source leaves out (see below).
//
// How to write a source (the short version, for the documentation that follows this series):
//
//   // A source that does not page: one read of every record, in source order. The list pages,
//   // filters and sorts the answer on its own side. The answer may be a bare array.
//   const allOrders = {
//     read: () => fetch("/api/orders").then(r => r.json())
//   };
//
//   // A source that pages: every read is ONE request carrying the range and the view the list wants.
//   const source = {
//     capabilities: { paging: true, filtering: true, sorting: true },
//     //   request.skip   the first record to return, in the source's filtered and sorted order
//     //   request.take   how many; 0 means "everything from skip"
//     //   request.filter the expression text of question.filterExpression, "" for no filter
//     //   request.sort   { field, direction } descriptors, applied in array order, [] for none
//     // The answer is { records, total?, hasMore? }. "total" is the number of records the filter
//     // matches; leave it out when counting them is expensive - the list then learns the end from
//     // "hasMore", or from a window that came back shorter than "take".
//     read: (request) =>
//       fetch(`/api/orders?skip=${request.skip}&take=${request.take}&where=${translate(request.filter)}`)
//         .then(r => r.json())
//         .then(r => ({ records: r.items, total: r.total })),
//     // The record field that identifies a record: every write below receives record[keyField] as
//     // its key. Required for writing: a source without it is read-only, whatever methods it has.
//     keyField: "id",
//     // Optional, one capability each. Missing insert -> no add button; missing remove -> no
//     // delete button; missing move -> no drag reorder; missing update -> the question is
//     // read-only. The source assigns the key and decides where the record is kept: return the
//     // stored record (or a promise of it) so that the list learns the key.
//     insert: (record, sourceIndex) => post("/api/orders", { at: sourceIndex, record }),
//     update: (key, record, changedFields) => put(`/api/orders/${key}`, record),
//     remove: (key) => del(`/api/orders/${key}`),
//     // The key names the record; the target is still a position, that is what a move is.
//     move: (key, toSourceIndex) => post("/api/orders/move", { id: key, to: toSourceIndex })
//   };
//   matrixQuestion.dataSource = source;   // or panelQuestion.dataSource = source
//
// A source WITHOUT keyField is read-only: the list sends it no insert, update, remove or move, so no
// write ever names a record by its position. It may still page, sort and filter on its side. The
// in-memory sources (ArrayDynamicDataSource and SurveyDataDynamicDataSource) are the exception: the
// list is their only writer and writes them synchronously, so a write names a record by its storage
// index. sourceIndex, where it is passed on its own, is the position in the WHOLE source - the list
// has already added the offset of the page the edit was made on.
//
// Where an added record is kept is the source's to decide: insert receives the position the
// respondent added it at, returns the stored record, and the next read shows the record where the
// source put it. Until the next page, sort or filter change the record stays shown where it was added.
//
// A keyed source and a new record: the list addresses a record by the key the source assigned, so
// return the stored record from insert. The edits, removes and moves made to the new record before
// that answer lands are queued behind the insert and sent, in order, with the key once it arrives;
// an update sent then carries the fields the source filled in as well. What is still lost is a write
// to a record whose insert failed or answered without the key: it stays in the window,
// onDynamicDataError reports it for its own operation, and the next read reconciles.
//
// keyField has nothing to do with question.keyName (the uniqueness validator of the matrix and the
// dynamic panel): one names a record for the source, the other forbids duplicate answers.
//
// The filter is a survey expression over the record fields, e.g. "{country} = 'de' and {age} > 18".
// The list never parses it. A source that speaks another dialect translates it with the library's
// own parser and re-renders the operand tree in its dialect:
//   const operand = new ConditionsParser().parseExpression(request.filter);
//   const where = operand.toString(op => op.getType() === "variable" ? op.variable : undefined);
// The callback answers for the nodes the source knows and returns undefined for the rest.
//
// filtering and sorting mean something only together with paging. A source that does not page
// answers with every record, and the list filters and sorts that answer itself, whatever the two
// flags say; its request is always { skip: 0, take: 0, filter: "", sort: [] }. A paging source
// declares each of the two on its own: a source that pages and sorts but cannot filter declares
// { paging: true, sorting: true }. The list never filters or sorts one page locally. While the list
// has a filter or a sort that a paging source has not declared, the source is read whole: the
// request is the one of a source that does not page, and the list filters, sorts and pages the
// answer itself. Once no undeclared part is set, the source is paged again. Declare filtering and
// sorting to keep a filter or a sort from reading every record. A paged read therefore carries the
// view as it is: "" for no filter, [] for no sort. One case is refused: a source that filters but
// cannot sort, with a filter the list cannot run itself (an async function) - a sort would need the
// list to run it, so the read is not sent, the window in force stays, and survey.onDynamicDataError
// reports the operation "read".
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
// What the source does on its own side with a read request. A missing flag means false. See the
// header for what each flag means with and without paging.
export interface IDynamicDataSourceCapabilities {
  paging?: boolean;
  filtering?: boolean;
  sorting?: boolean;
}
export interface IDynamicDataSource {
  // Taken by the list when the source is assigned to it. Absent -> the source does not page, and
  // the list pages, filters and sorts the complete answer.
  capabilities?: IDynamicDataSourceCapabilities;
  // Always required. A source that does not page answers with every record, in source order; a
  // paging one with the range and the view the request asks for. A bare array is taken as
  // { records: array }. Synchronous for in-memory sources, a Promise for a remote one.
  read(request: IDynamicDataReadRequest):
    Array<any> | IDynamicDataReadResult | Promise<Array<any> | IDynamicDataReadResult>;
  // Present -> the record field that identifies a record in the source, and every write below
  // receives record[keyField] as its key. Absent -> the source is read-only (see the header), except
  // for the in-memory sources, which are written by storage index.
  keyField?: string;
  // Present, with keyField -> edits are pushed to the source (write-through); absent -> the source is
  // read-only for that operation.
  // sourceIndex is where the respondent added the record; the source assigns the key and decides where
  // the record is kept. Return the stored record (or a promise of it) so that the list learns the key: the writes made to the new record meanwhile
  // wait for it, and without it they cannot be delivered. The record never carries the key field -
  // the list takes out a key copied from another record or put on a default value - and the key of
  // the answer is the one the list keeps. A source that wants client-generated keys generates them
  // here, where it sees the record.
  insert?(record: any, sourceIndex: number): any | Promise<any>;
  update?(key: any, record: any, changedFields: Array<string>): void | Promise<void>;
  remove?(key: any): void | Promise<void>;
  // The key names the record; the target is still a position, that is what a move is.
  move?(key: any, toSourceIndex: number): void | Promise<void>;
  // Present -> the source collects the writes of func and applies them as one; absent -> the list
  // just runs func. See DynamicDataList.batch.
  batch?(func: () => void): void;
}
export interface IDynamicDataField {
  name: string;
  dataType?: DynamicDataFieldType;
  compare?(a: any, b: any): number;
  // Present -> the field is read, never stored: its value comes from the record index, the record or
  // both, and a key of the same name in the record is ignored for it. The sort reads it, and the
  // filter expression gets it as a variable beside the record's own keys.
  getValue?(record: any, index: number): any;
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
