import { toFilterTree, settings, Helpers } from "survey-core";
import type { FilterTreeNode, FilterTreeCondition, FilterTreeOperator, ISortCriterion } from "survey-core";

// What every renderer of "survey-core/query" shares: the read request a server receives, the field map
// (the allowlist of what a client may filter and sort by), value coercion by field type, the sort and the range.
// A renderer reads only the checked tree and the prepared conditions below, never the request itself.

export interface IQueryField {
  // the QuestionValueType names, plus "datetime" for a column that stores moments
  type?: "string" | "number" | "boolean" | "date" | "datetime" | "array";
  // SQL: a column expression, MongoDB: a document path, OData: a property path.
  // It is code, never request data, and it is inserted as is.
  column?: string;
  filterable?: boolean;
  sortable?: boolean;
  // Replaces every condition on this field. It gets the condition as the tree holds it (no coercion, no lowering).
  // value(v) adds a parameter and returns its placeholder (SQL), returns a literal (OData) or returns v (MongoDB).
  // The result must be two-valued: it is used as is, only wrapped in brackets.
  render?(condition: FilterTreeCondition, value: (v: any) => string): string | object;
}
export interface IQueryOptions {
  fields: { [name: string]: IQueryField };
  // appended after the request's sort, without the fields the request already sorts by; end it with the key field
  defaultSort?: Array<ISortCriterion>;
  // each key falls back to settings.comparator, read at the call
  comparator?: { caseSensitive?: boolean, trimStrings?: boolean };
}
// The read request of a paging data source (IDynamicDataReadRequest), where filter may also be a tree:
// a server that receives the tree from a client must not trust it, so it is checked as the schema describes it.
export interface IQueryRequest {
  skip?: number;
  take?: number;
  filter?: string | FilterTreeNode | null;
  sort?: Array<ISortCriterion>;
}

export type QueryFieldType = "string" | "number" | "boolean" | "date" | "datetime" | "array";
export interface IQueryFieldInfo {
  name: string;
  type: QueryFieldType;
  field: IQueryField;
}
export interface IQueryComparator {
  caseSensitive: boolean;
  trimStrings: boolean;
}
// A condition after the field lookup and the coercion. A field with render keeps the tree's condition untouched.
export interface IPreparedCondition {
  info: IQueryFieldInfo;
  condition: FilterTreeCondition;
  op: FilterTreeOperator;
  // the coerced scalar of the scalar operators; the text of contains/notcontains
  // (an array field in the "native" mode: the item as the tree holds it)
  value?: any;
  // the coerced items of anyof/noneof; the texts of allof (an array field in the "native" mode: the tree's items)
  values?: Array<any>;
}
export interface IQuerySortItem {
  info: IQueryFieldInfo;
  descending: boolean;
}

export function queryError(text: string): never {
  throw new Error("Cannot build the query: " + text);
}

// Record<FilterTreeOperator, ...> makes the compiler keep this list equal to the type
const operatorKinds: Record<FilterTreeOperator, "scalar" | "list" | "none"> = {
  equal: "scalar", notequal: "scalar", greater: "scalar", less: "scalar", greaterorequal: "scalar", lessorequal: "scalar",
  contains: "scalar", notcontains: "scalar", anyof: "list", noneof: "list", allof: "list", empty: "none", notempty: "none"
};
const fieldTypes: Array<QueryFieldType> = ["string", "number", "boolean", "date", "datetime", "array"];

function isScalar(val: any): boolean {
  return typeof val === "string" || typeof val === "boolean" || (typeof val === "number" && isFinite(val));
}
function isPlainObject(val: any): boolean {
  return !!val && typeof val === "object" && !Array.isArray(val);
}
function badNode(node: any): never {
  let text: string;
  try {
    text = JSON.stringify(node);
  } catch{
    text = String(node);
  }
  return queryError("not a filter tree node: " + text);
}
function hasOnlyKeys(node: any, keys: Array<string>): boolean {
  return Object.keys(node).every(key => keys.indexOf(key) > -1);
}
function checkCondition(node: any): void {
  if (!hasOnlyKeys(node, ["field", "op", "value"])) badNode(node);
  if (typeof node.field !== "string" || !node.field || !Object.prototype.hasOwnProperty.call(operatorKinds, node.op)) badNode(node);
  const kind = operatorKinds[<FilterTreeOperator>node.op];
  const value = node.value;
  if (kind === "none" && value !== undefined) badNode(node);
  if (kind === "scalar" && !isScalar(value)) badNode(node);
  if (kind === "list" && (!Array.isArray(value) || !value.length || !value.every(isScalar))) badNode(node);
}
// Exactly what filter-tree.schema.json accepts, so a tree a non-JS client validated is never refused here.
// The error names the node whose own shape is wrong.
function checkNode(node: any): void {
  if (!isPlainObject(node)) badNode(node);
  if ("and" in node || "or" in node) {
    const key = "and" in node ? "and" : "or";
    const items = node[key];
    if (!hasOnlyKeys(node, [key]) || !Array.isArray(items) || items.length < 2) badNode(node);
    items.forEach(checkNode);
    return;
  }
  if ("not" in node) {
    if (!hasOnlyKeys(node, ["not"])) badNode(node);
    checkNode(node.not);
    return;
  }
  if ("const" in node) {
    if (!hasOnlyKeys(node, ["const"]) || typeof node.const !== "boolean") badNode(node);
    return;
  }
  checkCondition(node);
}

export function getFilterTree(request: IQueryRequest): FilterTreeNode | null {
  const filter = request.filter;
  if (filter === undefined || filter === null) return null;
  if (typeof filter === "string") return toFilterTree(filter);
  checkNode(filter);
  return filter;
}

function checkRequest(request: IQueryRequest): void {
  if (!isPlainObject(request)) queryError("the request is not an object");
}
function getInteger(request: IQueryRequest, name: "skip" | "take"): number {
  const val = request[name];
  if (val === undefined || val === null) return 0;
  if (typeof val !== "number" || !isFinite(val) || val < 0 || Math.floor(val) !== val) {
    return queryError(name + " is not a non-negative integer: " + String(val));
  }
  return val;
}
// take 0 means every record from skip on
export function getRange(request: IQueryRequest): { skip: number, take: number } {
  checkRequest(request);
  return { skip: getInteger(request, "skip"), take: getInteger(request, "take") };
}

export function getComparator(options: IQueryOptions): IQueryComparator {
  const own = options.comparator || {};
  const global = settings.comparator;
  return {
    caseSensitive: own.caseSensitive !== undefined ? !!own.caseSensitive : !!global.caseSensitive,
    trimStrings: own.trimStrings !== undefined ? !!own.trimStrings : !!global.trimStrings
  };
}

function lookupField(options: IQueryOptions, name: any): IQueryFieldInfo {
  const fields = options && options.fields;
  if (!fields) return queryError("options.fields is required");
  if (typeof name !== "string" || !Object.prototype.hasOwnProperty.call(fields, name) || !fields[name]) {
    return queryError("the field \"" + String(name) + "\" is not in the field list");
  }
  const field = fields[name];
  const type = field.type || "string";
  if (fieldTypes.indexOf(type) < 0) queryError("the field \"" + name + "\" has an unknown type: " + String(type));
  return { name: name, type: type, field: field };
}
export function getFilterField(options: IQueryOptions, name: string): IQueryFieldInfo {
  const info = lookupField(options, name);
  if (info.field.filterable === false) queryError("the field \"" + name + "\" is not filterable");
  return info;
}
export function getSortField(options: IQueryOptions, name: string): IQueryFieldInfo {
  const info = lookupField(options, name);
  if (info.field.sortable === false) queryError("the field \"" + name + "\" is not sortable");
  return info;
}

// The request's sort, then defaultSort without the fields already named: a field twice in ORDER BY is an error
// in SQL Server (Msg 169), and the tie-breaker keeps paging stable.
export function getSortList(request: IQueryRequest, options: IQueryOptions): Array<IQuerySortItem> {
  checkRequest(request);
  const sort = request.sort === undefined || request.sort === null ? [] : request.sort;
  if (!Array.isArray(sort)) queryError("sort is not an array");
  const res: Array<IQuerySortItem> = [];
  const used: { [name: string]: boolean } = {};
  const add = (item: ISortCriterion): void => {
    if (!isPlainObject(item)) queryError("a sort item is not an object: " + String(item));
    const info = getSortField(options, item.field);
    const direction = item.direction;
    if (direction !== undefined && direction !== null && direction !== "asc" && direction !== "desc") {
      queryError("the sort direction of \"" + item.field + "\" is not \"asc\" or \"desc\": " + String(direction));
    }
    if (used[info.name]) return;
    used[info.name] = true;
    res.push({ info: info, descending: direction === "desc" });
  };
  sort.forEach(add);
  (options.defaultSort || []).forEach(add);
  return res;
}

const dateOnlyRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
const momentRegex = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)$/;
function isCalendarDate(text: string): boolean {
  const parts = dateOnlyRegex.exec(text);
  if (!parts) return false;
  const year = Number(parts[1]), month = Number(parts[2]), day = Number(parts[3]);
  if (month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}
export function isDateOnly(value: any): boolean {
  return typeof value === "string" && isCalendarDate(value);
}
function isMoment(value: string): boolean {
  const parts = momentRegex.exec(value);
  return !!parts && isCalendarDate(parts[1]);
}
// The calendar day after "YYYY-MM-DD", counted on the calendar: never through a Date in local time,
// where a DST change or the time zone could move it.
export function getNextDay(date: string): string {
  const parts = dateOnlyRegex.exec(date);
  const next = new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]) + 1));
  const pad = (num: number, len: number): string => ("000" + num).slice(-len);
  return pad(next.getUTCFullYear(), 4) + "-" + pad(next.getUTCMonth() + 1, 2) + "-" + pad(next.getUTCDate(), 2);
}

function badValue(info: IQueryFieldInfo, what: string, value: any): never {
  return queryError("the value of \"" + info.name + "\" is not " + what + ": " + String(value));
}
// A value of the tree as the field's type: the tree keeps what the expression typed ('10' is a text),
// and our comparator compares "10" and 10 as equal.
function coerceValue(info: IQueryFieldInfo, value: any): any {
  switch(info.type) {
    case "number": {
      if (typeof value === "number") return value;
      const num = typeof value === "string" ? Helpers.getNumber(value) : NaN;
      return isNaN(num) ? badValue(info, "a number", value) : num;
    }
    case "boolean": {
      if (typeof value === "boolean") return value;
      const text = typeof value === "string" ? value.toLowerCase() : "";
      if (text === "true" || text === "false") return text === "true";
      return badValue(info, "a boolean", value);
    }
    case "date":
    case "datetime":
      return typeof value === "string" && (isCalendarDate(value) || isMoment(value)) ? value : badValue(info, "a date", value);
  }
  return String(value);
}

// "render": an array field needs its render (SQL has no array column type of its own).
// "native": the storage reads arrays (MongoDB), see prepareArrayCondition.
export type QueryArrayMode = "render" | "native";

function arrayNeedsRender(res: IPreparedCondition): never {
  return queryError("the field \"" + res.info.name + "\" is an array: it needs render for " + res.op);
}
// Ours on an array: contains/notcontains/anyof/noneof/allof look for an element equal to the item (by our
// comparator, so 1 and "1" are equal), = compares the whole array and ordering means nothing. The items keep the
// tree's types and the scalar folds do not apply: [0] contains 0, [""] allof [''] and ["x"] notcontains '' are true.
function prepareArrayCondition(res: IPreparedCondition): IPreparedCondition | boolean {
  const value = res.condition.value;
  switch(res.op) {
    case "empty":
    case "notempty":
      return res;
    case "equal":
    case "notequal":
      if (value !== "") return arrayNeedsRender(res);
      res.op = res.op === "equal" ? "empty" : "notempty";
      return res;
    case "contains":
      // false, as toFilterTree builds it from the text (ours finds '' in [""]: a documented difference)
      if (value === "") return false;
      res.value = value;
      return res;
    case "notcontains":
      res.value = value;
      return res;
    case "anyof":
    case "noneof":
    case "allof":
      res.values = (<Array<any>>value).slice();
      return res;
  }
  return arrayNeedsRender(res);
}

// The field lookup and the coercion of one condition, with the shapes ours answers alike for every value folded:
// true or false for the whole condition. The tree builder already folds them; a client's tree may hold them too.
export function prepareCondition(options: IQueryOptions, condition: FilterTreeCondition,
  arrays: QueryArrayMode = "render"): IPreparedCondition | boolean {
  const info = getFilterField(options, condition.field);
  const res: IPreparedCondition = { info: info, condition: condition, op: condition.op };
  if (info.field.render) return res;
  if (info.type === "array") {
    return arrays === "native" ? prepareArrayCondition(res) : arrayNeedsRender(res);
  }
  const value = condition.value;
  switch(condition.op) {
    case "empty":
    case "notempty":
      return res;
    case "equal":
    case "notequal":
      // = '' is empty, as toFilterTree builds it
      if (value === "") {
        res.op = condition.op === "equal" ? "empty" : "notempty";
        return res;
      }
      res.value = coerceValue(info, value);
      return res;
    case "contains":
    case "notcontains":
      // ours: contains of an empty or a falsy value is false for every value, notcontains '' for every scalar
      if (value === "" || (condition.op === "contains" && !value)) return false;
      res.value = String(value);
      return res;
    case "allof": {
      // ours on a scalar: every item is a substring (contains); a falsy item matches nothing
      const values = <Array<any>>value;
      if (values.some(item => !item)) return false;
      res.values = values.map(item => String(item));
      return res;
    }
    case "anyof":
    case "noneof":
      res.values = (<Array<any>>value).map(item => coerceValue(info, item));
      return res;
  }
  res.value = coerceValue(info, value);
  return res;
}
