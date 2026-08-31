import { runBinaryOperator } from "survey-core";
import { ElementRecord, getEffectiveType, ParsedRef, SurveyIndex } from "./symbols";
import { equalsCI, getSubPathRecord } from "./expression-utils";
import { getInputType, getSpecialChoiceValues, getStaticChoiceValues } from "./value-types";

// The set of values a reference can hold, when the JSON pins it down completely.
export interface ValueSetDomain {
  kind: "set";
  record: ElementRecord;
  // every value the runtime can produce, special items included
  values: Array<any>;
  // what the author actually listed, for the "Available: ..." part of a message
  listed: Array<any>;
}

// The bounds a question keeps its value inside. Not a validator: canSetValueToSurvey refuses
// to write a value outside min/max into the survey data, so a condition asking for one never
// holds. Only "never holds" is concluded - an unanswered question makes any comparison false,
// so nothing here can prove that a condition always holds.
export interface ValueRangeDomain {
  kind: "range";
  record: ElementRecord;
  min?: any;
  max?: any;
}

export type ValueDomain = ValueSetDomain | ValueRangeDomain;

// time and week are excluded on purpose: the runtime compares them with its own arithmetic
// (getWeekTimeNumber), which a plain operator call does not reproduce.
const RANGE_INPUT_TYPES: { [inputType: string]: boolean } = {
  number: true, range: true, date: true, "datetime-local": true, month: true,
};

// The defaults of the model, which apply whenever the JSON states nothing: a rating runs 1..5
// with a step of 1, a slider 0..100. They are as real as a written bound - the control offers
// nothing outside them.
const RATING_DEFAULTS = { min: 1, max: 5, step: 1 };
const SLIDER_DEFAULTS = { min: 0, max: 100 };

function toNumber(value: any, fallback: number): number {
  return typeof value === "number" && isFinite(value) ? value : fallback;
}

function getRatingRangeDomain(record: ElementRecord): ValueDomain | undefined {
  const json = record.json || {};
  const min = toNumber(json.rateMin, RATING_DEFAULTS.min);
  if (json.rateMax !== undefined) {
    return { kind: "range", record: record, min: min, max: toNumber(json.rateMax, RATING_DEFAULTS.max) };
  }
  // rateCount and rateMax describe the same upper bound; the model recomputes one from the other
  if (json.rateCount !== undefined) {
    const step = toNumber(json.rateStep, RATING_DEFAULTS.step);
    const count = toNumber(json.rateCount, RATING_DEFAULTS.max);
    return { kind: "range", record: record, min: min, max: min + step * (count - 1) };
  }
  return { kind: "range", record: record, min: min, max: RATING_DEFAULTS.max };
}

function getSliderRangeDomain(record: ElementRecord): ValueDomain | undefined {
  const json = record.json || {};
  // a range slider answers with a pair of values, which no single bound describes
  if (json.sliderType === "range") return undefined;
  return {
    kind: "range",
    record: record,
    min: toNumber(json.min, SLIDER_DEFAULTS.min),
    max: toNumber(json.max, SLIDER_DEFAULTS.max),
  };
}

function getTextRangeDomain(record: ElementRecord): ValueDomain | undefined {
  const json = record.json;
  if (!json || !RANGE_INPUT_TYPES[getInputType(json)]) return undefined;
  // a bound computed at runtime is unknown while linting
  if (json.minValueExpression !== undefined || json.maxValueExpression !== undefined) return undefined;
  const min = json.min;
  const max = json.max;
  if (min === undefined && max === undefined) return undefined;
  return { kind: "range", record: record, min: min, max: max };
}

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
  // by effective type: a matrix column holds the domain of its cell type
  const type = getEffectiveType(record);
  if (type === "rating") {
    const listed = toDomain(record, getStaticChoiceValues(record.json ? record.json.rateValues : undefined));
    return listed || getRatingRangeDomain(record);
  }
  if (type === "boolean") return getBooleanDomain(record);
  if (type === "text") return getTextRangeDomain(record);
  if (type === "slider") return getSliderRangeDomain(record);
  return undefined;
}

// recordDomain lets a caller pass its memoized getRecordValueDomain; without one the
// domain is rebuilt on every call.
export function getValueDomain(ref: ParsedRef, index: SurveyIndex,
  recordDomain?: (record: ElementRecord) => ValueDomain | undefined): ValueDomain | undefined {
  const record = ref.resolvedTo;
  if (!record) return undefined;
  // a subpath reference compares against the sub-element: a matrix cell / dynamic panel
  // question when the path lands on one, a single-choice matrix row otherwise
  if (ref.status === "resolved" && ref.segments.length > 1) {
    if (record.isUnknownType) return undefined;
    const sub = getSubPathRecord(ref);
    if (!!sub) return recordDomain ? recordDomain(sub) : getRecordValueDomain(sub, index);
    return getMatrixRowDomain(ref, record);
  }
  return recordDomain ? recordDomain(record) : getRecordValueDomain(record, index);
}

// runBinaryOperator applies the very operator function the expression runtime applies, so this
// IS the runtime equality rather than an approximation of it: the "undefined"-string
// normalization, settings.comparator (caseSensitive, trimStrings, normalizeTextCallback) and the
// numeric conversion all behave as they do at runtime.
export function runtimeEquals(a: any, b: any): boolean {
  return runBinaryOperator("equal", a, b) === true;
}

export function runtimeGreater(a: any, b: any): boolean {
  return runBinaryOperator("greater", a, b) === true;
}

// An empty value clears the answer and a boolean one is a switch, not a choice: neither says
// anything about which values a question can hold, so neither is checked against a value set.
export function isCheckableValue(value: any): boolean {
  return value !== null && value !== undefined && value !== "" && typeof value !== "boolean";
}
