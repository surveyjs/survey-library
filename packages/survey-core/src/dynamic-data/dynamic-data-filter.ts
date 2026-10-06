import { ConditionRunner } from "../conditions/conditionRunner";
import { Helpers, createDate } from "../helpers";
import { settings } from "../settings";
import { IDynamicDataField, IDynamicDataSort, DynamicDataSortDirection } from "./dynamic-data-interfaces";

// Local filtering/sorting for DynamicDataList: pure functions over an array of records, so they can
// be unit-tested without a list.
//
// The filter is a survey expression over the record fields - "{country} = 'de' and {age} > 18" - run
// by the ordinary ConditionRunner with the record as the values hash. Every operator, function and
// setting of the expression language therefore applies as it does everywhere else in the library:
// anyof/allof/noneof, contains, empty, iif(), age(), settings.comparator, and whatever is registered
// in FunctionFactory.
//
// A source that filters on its own side receives the expression text and translates it: parse it
// with ConditionsParser into an Operand tree and re-render that tree through
// Operand.toString(callback), where the callback emits the target dialect for the nodes it knows
// (BinaryOperand.operator/leftOperand/rightOperand, Variable.variable, Const.correctValue).
//
// dataType "string" is text order (localeCompare after settings.comparator.normalizeTextCallback), so
// "item10" sorts before "item2". A field that needs natural order supplies IDynamicDataField.compare.

function getFieldValue(record: any, field: string): any {
  return !!record ? record[field] : undefined;
}
function findField(fields: Array<IDynamicDataField>, name: string): IDynamicDataField {
  if (!Array.isArray(fields)) return undefined;
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].name === name) return fields[i];
  }
  return undefined;
}
export function createIndexes(count: number): Array<number> {
  const res = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    res[i] = i;
  }
  return res;
}
function compareStrings(a: any, b: any): number {
  const normalize = settings.comparator.normalizeTextCallback;
  const sA = normalize(String(a), "compare");
  const sB = normalize(String(b), "compare");
  return sA.localeCompare(sB);
}
// createDate returns "now" for a falsy value, so 0, -0 and false (not empty for the sort) stay at the epoch.
function toDate(value: any): Date {
  return value instanceof Date ? value : (!value ? new Date(value) : createDate("sort", value));
}
function compareNumbers(a: any, b: any): number {
  const nA = Helpers.getNumber(a);
  const nB = Helpers.getNumber(b);
  if (isNaN(nA) || isNaN(nB)) return compareStrings(a, b);
  return nA === nB ? 0 : (nA > nB ? 1 : -1);
}
function compareDates(a: any, b: any): number {
  const dA = toDate(a);
  const dB = toDate(b);
  if (isNaN(dA.getTime()) || isNaN(dB.getTime())) return compareStrings(a, b);
  const tA = dA.getTime();
  const tB = dB.getTime();
  return tA === tB ? 0 : (tA > tB ? 1 : -1);
}
function toBoolean(value: any): boolean {
  if (typeof value === "string") return value.toLowerCase() === "true";
  return !!value;
}
function compareBooleans(a: any, b: any): number {
  const bA = toBoolean(a);
  const bB = toBoolean(b);
  return bA === bB ? 0 : (bA ? 1 : -1);
}
function compareByType(a: any, b: any, dataType: string): number {
  if (dataType === "number") return compareNumbers(a, b);
  if (dataType === "date") return compareDates(a, b);
  if (dataType === "boolean") return compareBooleans(a, b);
  if (dataType === "string") return compareStrings(a, b);
  // "any": the values decide.
  if (a instanceof Date || b instanceof Date) return compareDates(a, b);
  if (typeof a === "boolean" && typeof b === "boolean") return compareBooleans(a, b);
  if (Helpers.isNumber(a) && Helpers.isNumber(b)) return compareNumbers(a, b);
  return compareStrings(a, b);
}
function compareFieldValues(a: any, b: any, field: IDynamicDataField, direction: DynamicDataSortDirection): number {
  // A custom comparer owns the whole comparison, the empty rule included.
  if (!!field && !!field.compare) {
    const custom = field.compare(a, b);
    return direction === "desc" ? -custom : custom;
  }
  const aEmpty = Helpers.isValueEmpty(a);
  const bEmpty = Helpers.isValueEmpty(b);
  // Empty values sort last in both directions: the rule is applied before the direction.
  if (aEmpty || bEmpty) return aEmpty && bEmpty ? 0 : (aEmpty ? 1 : -1);
  const res = compareByType(a, b, !!field && !!field.dataType ? field.dataType : "any");
  return direction === "desc" ? -res : res;
}
// Builds the runner for a filter expression once, so that it is parsed once and run per record.
// Returns undefined for an empty expression (= no filter) and throws for one that cannot be run
// locally; DynamicDataList reports that through onError(error, "read") and drops the filter.
export function createFilterRunner(expression: string): ConditionRunner {
  if (!expression) return undefined;
  const runner = new ConditionRunner(expression);
  if (!runner.canRun()) {
    throw new Error("The filter expression cannot be parsed: " + expression);
  }
  if (runner.isAsync) {
    // An async function answers through a callback, so it cannot decide a synchronous view over
    // hundreds of records. Such a filter belongs on the source side.
    throw new Error("A filter expression with an async function is not supported locally: " + expression);
  }
  return runner;
}
function toRunner(filter: string | ConditionRunner): ConditionRunner {
  return typeof filter === "string" ? createFilterRunner(filter) : filter;
}
// The fields that are read and never stored (IDynamicDataField.getValue).
function getVirtualFields(fields: Array<IDynamicDataField>): Array<IDynamicDataField> {
  return Array.isArray(fields) ? fields.filter((field: IDynamicDataField): boolean => typeof field.getValue === "function") : [];
}
/* Returns the indexes of the records the filter expression accepts, in record order. A field that is
   read and never stored is a variable too: each record is then run as a copy with the fields the
   expression names put over its own keys, and the record itself is not modified. */
export function applyFilter(records: Array<any>, filter: string | ConditionRunner, fields?: Array<IDynamicDataField>): Array<number> {
  const runner = toRunner(filter);
  if (!runner) return createIndexes(records.length);
  const used = runner.getVariables().map((name: string): string => name.split(/[.[]/)[0].toLowerCase());
  const virtualFields = getVirtualFields(fields).filter((field: IDynamicDataField): boolean => used.indexOf(field.name.toLowerCase()) > -1);
  const res: Array<number> = [];
  for (let i = 0; i < records.length; i++) {
    let values = records[i] || {};
    if (virtualFields.length > 0) {
      values = Object.assign({}, values);
      for (let j = 0; j < virtualFields.length; j++) {
        values[virtualFields[j].name] = virtualFields[j].getValue(records[i], i);
      }
    }
    if (runner.runValues(values)) res.push(i);
  }
  return res;
}
/* The slots of a list are ANDed: a record is created only if every runner accepts it. Each runner
   was parsed on its own, so this never concatenates the expressions - and therefore never has to
   bracket them. A field that is read and never stored is put over the record's own keys when any
   of the expressions names it, as applyFilter does. */
export function applyFilters(records: Array<any>, runners: Array<ConditionRunner>, fields?: Array<IDynamicDataField>): Array<number> {
  const used = (runners || []).filter((runner: ConditionRunner): boolean => !!runner);
  if (used.length === 0) return createIndexes(records.length);
  const names: Array<string> = [];
  used.forEach((runner: ConditionRunner): void => {
    runner.getVariables().forEach((name: string): void => { names.push(name.split(/[.[]/)[0].toLowerCase()); });
  });
  const virtualFields = getVirtualFields(fields).filter((field: IDynamicDataField): boolean => names.indexOf(field.name.toLowerCase()) > -1);
  const res: Array<number> = [];
  for (let i = 0; i < records.length; i++) {
    let values = records[i] || {};
    if (virtualFields.length > 0) {
      values = Object.assign({}, values);
      for (let j = 0; j < virtualFields.length; j++) {
        values[virtualFields[j].name] = virtualFields[j].getValue(records[i], i);
      }
    }
    let passes = true;
    for (let j = 0; j < used.length && passes; j++) {
      passes = used[j].runValues(values);
    }
    if (passes) res.push(i);
  }
  return res;
}
// Returns the record indexes in sort order. "indexes" limits the sort to a subset (the filtered and
// owner-visible records); when it is omitted every record takes part. The input is never modified.
export function applySort(records: Array<any>, sort: Array<IDynamicDataSort>,
  fields?: Array<IDynamicDataField>, indexes?: Array<number>): Array<number> {
  const source = !!indexes ? indexes : createIndexes(records.length);
  if (!Array.isArray(sort) || sort.length === 0) return source;
  const sortFields = sort.map((item: IDynamicDataSort): IDynamicDataField => findField(fields, item.field));
  // Every sort key of a record is read once, before the comparisons: a field that is read and never
  // stored may cost more than a key lookup.
  const order = source.map((recordIndex: number, position: number) => ({
    recordIndex: recordIndex, position: position,
    values: sort.map((item: IDynamicDataSort, i: number): any => {
      const field = sortFields[i];
      return !!field && !!field.getValue ? field.getValue(records[recordIndex], recordIndex) : getFieldValue(records[recordIndex], item.field);
    })
  }));
  order.sort((a, b) => {
    for (let i = 0; i < sort.length; i++) {
      const res = compareFieldValues(a.values[i], b.values[i], sortFields[i], sort[i].direction);
      if (res !== 0) return res;
    }
    // Explicit stability: the original position breaks every tie, so the result does not depend on
    // the runtime sort being stable.
    return a.position - b.position;
  });
  return order.map(item => item.recordIndex);
}
// Both operands are parenthesized as soon as there are two of them. "or" binds looser than "and"
// (grammar.pegjs: Expression -> LogicOr -> LogicAnd), so "{a} = 1 or {b} = 2" combined with
// "{c} = 3" would otherwise read as "{a} = 1 or ({b} = 2 and {c} = 3)".
export function combineFilterExpressions(first: string, second: string, conjunction: string = "and"): string {
  const a = (first || "").trim();
  const b = (second || "").trim();
  if (!a) return b;
  if (!b) return a;
  return "(" + a + ") " + conjunction + " (" + b + ")";
}
