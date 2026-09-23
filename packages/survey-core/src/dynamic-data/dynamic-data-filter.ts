import { ConditionRunner } from "../conditions/conditionRunner";
import { Helpers } from "../helpers";
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
  return String(a).localeCompare(String(b));
}
function compareNumbers(a: any, b: any): number {
  const nA = Helpers.getNumber(a);
  const nB = Helpers.getNumber(b);
  if (isNaN(nA) || isNaN(nB)) return compareStrings(a, b);
  return nA === nB ? 0 : (nA > nB ? 1 : -1);
}
function compareDates(a: any, b: any): number {
  const dA = a instanceof Date ? a : new Date(a);
  const dB = b instanceof Date ? b : new Date(b);
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
// Returns the indexes of the records the filter expression accepts, in record order.
export function applyFilter(records: Array<any>, filter: string | ConditionRunner): Array<number> {
  const runner = toRunner(filter);
  if (!runner) return createIndexes(records.length);
  const res: Array<number> = [];
  for (let i = 0; i < records.length; i++) {
    if (runner.runValues(records[i] || {})) res.push(i);
  }
  return res;
}
// Returns the record indexes in sort order. "indexes" limits the sort to a subset (the filtered and
// owner-visible records); when it is omitted every record takes part. The input is never modified.
export function applySort(records: Array<any>, sort: Array<IDynamicDataSort>,
  fields?: Array<IDynamicDataField>, indexes?: Array<number>): Array<number> {
  const source = !!indexes ? indexes : createIndexes(records.length);
  if (!Array.isArray(sort) || sort.length === 0) return source;
  const order = source.map((recordIndex: number, position: number) => ({ recordIndex: recordIndex, position: position }));
  order.sort((a, b) => {
    for (let i = 0; i < sort.length; i++) {
      const item = sort[i];
      const field = findField(fields, item.field);
      const res = compareFieldValues(getFieldValue(records[a.recordIndex], item.field),
        getFieldValue(records[b.recordIndex], item.field), field, item.direction);
      if (res !== 0) return res;
    }
    // Explicit stability: the original position breaks every tie, so the result does not depend on
    // the runtime sort being stable.
    return a.position - b.position;
  });
  return order.map(item => item.recordIndex);
}
