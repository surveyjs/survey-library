import { CIMultiMap, ElementRecord, getEffectiveType } from "./symbols";
import { equalsCI, stripCommentSuffix } from "./expression-utils";
import { ValueDomain, ValueSetDomain } from "./value-domain";
import { getStaticChoiceValues } from "./value-types";
import { ILintResolvedSettings } from "./lint-settings";

// One defect found inside a composite value: either a key naming nothing the question holds,
// or a cell value the addressed sub-element can never hold.
export type CompositeValueIssue = {
  kind: "unknownRowKey" | "unknownColumnKey" | "unknownQuestionKey",
  key: string,
  candidates: Array<string>,
} | {
  kind: "alienCell",
  values: Array<any>,
  domain: ValueSetDomain,
};

interface CompositeContext {
  recordDomain: (record: ElementRecord) => ValueDomain | undefined;
  settings: ILintResolvedSettings;
  isCheckable: (value: any) => boolean;
  runtimeEquals: (a: any, b: any) => boolean;
  issues: Array<CompositeValueIssue>;
}

function isPlainObject(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asSet(domain: ValueDomain | undefined): ValueSetDomain | undefined {
  return !!domain && domain.kind === "set" ? domain : undefined;
}

function checkCellValue(value: any, domain: ValueSetDomain | undefined, ctx: CompositeContext): void {
  if (!domain) return;
  const items = Array.isArray(value) ? value : [value];
  const alien = items.filter(item => ctx.isCheckable(item) &&
    !domain.values.some(allowed => ctx.runtimeEquals(allowed, item)));
  if (alien.length === 0) return;
  ctx.issues.push({ kind: "alienCell", values: alien, domain: domain });
}

// A key is either a sub-element name (or its valueName) or the comment key living next to it.
function findByKey(map: CIMultiMap<ElementRecord>, key: string,
  settings: ILintResolvedSettings): { record?: ElementRecord, known: boolean } {
  const direct = map.first(key);
  if (!!direct) return { record: direct, known: true };
  const commentBase = stripCommentSuffix(key, settings);
  if (commentBase !== undefined && map.has(commentBase)) {
    // a comment is a plain string next to the value - known, but nothing types it
    return { known: true };
  }
  return { known: false };
}

// The names a row/panel object may key its cells by: sub-element names plus their valueNames.
function buildKeyMap(map: CIMultiMap<ElementRecord>): CIMultiMap<ElementRecord> {
  let extended: CIMultiMap<ElementRecord> | undefined;
  map.forEach(records => records.forEach(record => {
    if (!record.valueName || map.has(record.valueName)) return;
    if (!extended) {
      extended = new CIMultiMap<ElementRecord>();
      map.forEach((values, name) => values.forEach(value => extended.add(name, value)));
    }
    extended.add(record.valueName, record);
  }));
  return extended || map;
}

function checkRowObject(row: any, keys: CIMultiMap<ElementRecord>,
  unknownKind: "unknownColumnKey" | "unknownQuestionKey", ctx: CompositeContext): void {
  if (!isPlainObject(row)) return;
  Object.keys(row).forEach(key => {
    const found = findByKey(keys, key, ctx.settings);
    if (!found.known) {
      ctx.issues.push({ kind: unknownKind, key: key, candidates: keys.names() });
      return;
    }
    // a sub-panel groups questions without holding a value of its own
    if (!found.record || found.record.kind === "panel") return;
    checkCellValue(row[key], asSet(ctx.recordDomain(found.record)), ctx);
  });
}

// The {rowValue: columnValue} object of a single-choice matrix: the matrix itself owns the
// one shared set of columns every row answers with.
function checkMatrixObject(record: ElementRecord, value: any, ctx: CompositeContext): void {
  if (!isPlainObject(value)) return;
  const rows = record.matrixRowValues || [];
  const columnValues = getStaticChoiceValues(record.json ? record.json.columns : undefined);
  const domain: ValueSetDomain | undefined = columnValues.length > 0
    ? { kind: "set", record: record, values: columnValues, listed: columnValues }
    : undefined;
  Object.keys(value).forEach(key => {
    if (!rows.some(row => equalsCI(String(row), key))) {
      ctx.issues.push({ kind: "unknownRowKey", key: key, candidates: rows.map(row => String(row)) });
      return;
    }
    checkCellValue(value[key], domain, ctx);
  });
}

function checkMatrixDropdownObject(record: ElementRecord, value: any, ctx: CompositeContext): void {
  if (!isPlainObject(value) || !record.matrixColumns) return;
  const rows = record.matrixRowValues || [];
  const keys = buildKeyMap(record.matrixColumns);
  Object.keys(value).forEach(key => {
    if (!rows.some(row => equalsCI(String(row), key))) {
      ctx.issues.push({ kind: "unknownRowKey", key: key, candidates: rows.map(row => String(row)) });
      return;
    }
    checkRowObject(value[key], keys, "unknownColumnKey", ctx);
  });
}

function checkRowArray(value: any, keys: CIMultiMap<ElementRecord>,
  unknownKind: "unknownColumnKey" | "unknownQuestionKey", ctx: CompositeContext): void {
  const rows = Array.isArray(value) ? value : [value];
  rows.forEach(row => checkRowObject(row, keys, unknownKind, ctx));
}

// The defects inside a composite value (defaultValue/correctAnswer of a matrix or dynamic
// panel, defaultRowValue, defaultPanelValue). Undefined when the record is not a composite
// the linter models - the caller then falls back to the plain whole-value check.
// Nested composites inside cells are left alone: no domain describes them.
export function findCompositeValueIssues(record: ElementRecord, value: any,
  recordDomain: (record: ElementRecord) => ValueDomain | undefined,
  settings: ILintResolvedSettings,
  isCheckable: (value: any) => boolean,
  runtimeEqualsFn: (a: any, b: any) => boolean,
  // "row" narrows the value to one row/panel object (defaultRowValue/defaultPanelValue)
  shape?: "row"): Array<CompositeValueIssue> | undefined {
  if (!record || record.isUnknownType || record.kind !== "question") return undefined;
  const ctx: CompositeContext = {
    recordDomain: recordDomain,
    settings: settings,
    isCheckable: isCheckable,
    runtimeEquals: runtimeEqualsFn,
    issues: [],
  };
  const type = getEffectiveType(record);
  if (type === "matrix" && Array.isArray(record.matrixRowValues)) {
    if (shape === "row") return undefined;
    checkMatrixObject(record, value, ctx);
  } else if (type === "matrixdropdown" && record.matrixColumns && Array.isArray(record.matrixRowValues)) {
    if (shape === "row") return undefined;
    checkMatrixDropdownObject(record, value, ctx);
  } else if (type === "matrixdynamic" && record.matrixColumns) {
    checkRowArray(value, buildKeyMap(record.matrixColumns), "unknownColumnKey", ctx);
  } else if (type === "paneldynamic" && record.templateNames) {
    checkRowArray(value, buildKeyMap(record.templateNames), "unknownQuestionKey", ctx);
  } else {
    return undefined;
  }
  return ctx.issues;
}
