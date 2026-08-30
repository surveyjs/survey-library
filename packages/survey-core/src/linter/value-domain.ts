import { runBinaryOperator } from "survey-core";
import { ElementRecord, ParsedRef, SurveyIndex } from "./symbols";
import { equalsCI } from "./expression-utils";
import { getSpecialChoiceValues, getStaticChoiceValues } from "./value-types";

// The set of values a reference can hold, when the JSON pins it down completely.
export interface ValueSetDomain {
  kind: "set";
  record: ElementRecord;
  // every value the runtime can produce, special items included
  values: Array<any>;
  // what the author actually listed, for the "Available: ..." part of a message
  listed: Array<any>;
}

export type ValueDomain = ValueSetDomain;

function toDomain(record: ElementRecord, values: Array<any>, listed?: Array<any>): ValueDomain | undefined {
  if (values.length === 0) return undefined;
  return { kind: "set", record: record, values: values, listed: listed || values };
}

// A single-choice matrix answers {m.row} with one of its columns. The row itself is validated
// by reference/unknown, so an unknown one never reaches here with a domain.
function getMatrixRowDomain(ref: ParsedRef, record: ElementRecord): ValueDomain | undefined {
  if (record.type !== "matrix" || ref.segments.length !== 2) return undefined;
  if (ref.segments[0].index !== undefined || ref.segments[1].index !== undefined) return undefined;
  const rows = record.matrixRowValues;
  if (!Array.isArray(rows) || !rows.some(row => equalsCI(String(row), ref.segments[1].name))) {
    return undefined;
  }
  return toDomain(record, getStaticChoiceValues(record.json ? record.json.columns : undefined));
}

// A boolean question with a value of its own has exactly two of them. Left alone otherwise:
// a plain true/false question is what expression/type-mismatch reports on.
function getBooleanDomain(record: ElementRecord): ValueDomain | undefined {
  const json = record.json;
  if (!json || json.valueTrue === undefined && json.valueFalse === undefined) return undefined;
  return toDomain(record, [
    json.valueTrue !== undefined ? json.valueTrue : true,
    json.valueFalse !== undefined ? json.valueFalse : false,
  ]);
}

// Undefined whenever the set is not exhaustive - a value may then come from anywhere and
// nothing can be concluded from a value being absent.
export function getRecordValueDomain(record: ElementRecord, index: SurveyIndex): ValueDomain | undefined {
  if (!record || record.isUnknownType) return undefined;
  const info = record.choicesInfo;
  if (!!info) {
    // no listed choice means they come from somewhere the JSON does not show - code, an API -
    // so the special items alone are not an exhaustive set
    if (info.hasChoicesByUrl || info.lazy || info.carryForwardFrom ||
      info.carryForwardValuesFrom || info.staticValues.length === 0) return undefined;
    return toDomain(record, info.staticValues.concat(getSpecialChoiceValues(info, index.settings)),
      info.staticValues);
  }
  if (record.type === "rating") return toDomain(record, getStaticChoiceValues(record.json ? record.json.rateValues : undefined));
  if (record.type === "boolean") return getBooleanDomain(record);
  return undefined;
}

export function getValueDomain(ref: ParsedRef, index: SurveyIndex): ValueDomain | undefined {
  const record = ref.resolvedTo;
  if (!record) return undefined;
  // a subpath reference compares against the sub-element, and only a matrix row is modelled
  if (ref.status === "resolved" && ref.segments.length > 1) {
    return record.isUnknownType ? undefined : getMatrixRowDomain(ref, record);
  }
  return getRecordValueDomain(record, index);
}

// runBinaryOperator applies the very operator function the expression runtime applies, so this
// IS the runtime equality rather than an approximation of it: the "undefined"-string
// normalization, settings.comparator (caseSensitive, trimStrings, normalizeTextCallback) and the
// numeric conversion all behave as they do at runtime.
export function runtimeEquals(a: any, b: any): boolean {
  return runBinaryOperator("equal", a, b) === true;
}
