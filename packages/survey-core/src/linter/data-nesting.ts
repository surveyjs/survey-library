import { Serializer } from "survey-core";
import { CIMultiMap, DataScopeRecord, ElementRecord, SurveyIndex } from "./symbols";

// Nested data (prompts/nested-data/decisions.md): a panel or a page with a valueName - or every panel
// and/or page in a by-name dataNesting mode - stores its questions' values in an object under its key.

const BY_NAME_MODES: { [mode: string]: Array<string> } = {
  panel: ["panel"],
  page: ["page"],
  panelAndPage: ["panel", "page"]
};

// A copy of getDataNestingKey (src/panel-data-scope.ts): the core keeps it internal, and the linter
// imports nothing but the public "survey-core" entry. linter-nested-data.tests.ts compares the two for
// every mode, kind and key. kind is "panel" or "page", "record" for a panel inside a dynamic panel's
// template or a matrix detail panel (no by-name mode lists it: it nests under its valueName only, RN3),
// "" for a container that never nests.
//   "none": never; "auto" (and an unknown mode): under valueName;
//   "panel" / "page" / "panelAndPage": under valueName, else name for the containers of that kind.
export function getLintDataNestingKey(dataNesting: string, kind: string, valueName: string, name: string): string {
  if (dataNesting === "none" || !kind) return "";
  if (!!valueName) return valueName;
  const kinds = BY_NAME_MODES[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1 ? name || "" : "";
}

// Whether the mode nests a container of this kind by its name.
export function isByNameKind(dataNesting: string, kind: string): boolean {
  const kinds = BY_NAME_MODES[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1;
}

// The mode the survey runs in: the JSON's, else the serializer default - which a host may have set to
// "none" once in code (decisions N2), and which the linter shares through the one module closure.
export function getDataNestingMode(json: any): string {
  if (typeof json.dataNesting === "string") return json.dataNesting;
  const prop = Serializer.findProperty("survey", "dataNesting");
  const def = !!prop ? prop.defaultValue : undefined;
  return typeof def === "string" ? def : "auto";
}

// The name the runtime gives an unnamed page or panel: the first free <base>N among the names of the
// pages / panels added before it (SurveyModel.generateNewName). A name declared further down is not
// seen yet, so an unnamed first panel and a later "panel1" end up with one name.
export function generateContainerName(base: string, taken: Set<string>): string {
  let index = 1;
  while(taken.has(base + index)) index++;
  return base + index;
}

export function createRootScope(): DataScopeRecord {
  return { key: "", path: [], containers: [], questions: new CIMultiMap<ElementRecord>(), children: new CIMultiMap<DataScopeRecord>() };
}

// The record one panel of a dynamic panel or one row of a matrix is (records nesting 02, RN1): a root of
// its own, as the survey data is. Its paths start at the record (RN4).
export function createRecordScope(owner: ElementRecord): DataScopeRecord {
  const res = createRootScope();
  res.recordOwner = owner;
  return res;
}

// Whether the object is a record or lies inside one: a panel there nests by its valueName only (RN3).
export function isInsideRecordScope(scope: DataScopeRecord): boolean {
  let current = scope;
  while(!!current && !!current.parent) current = current.parent;
  return !!current && !!current.recordOwner;
}

// The object of a nesting container inside parent: shared with every container on the same exact key
// at that level (D4) - the runtime stores data keys case-sensitively.
export function getChildScope(parent: DataScopeRecord, key: string, container: ElementRecord): DataScopeRecord {
  let res = parent.children.get(key).filter(child => child.key === key)[0];
  if (!res) {
    res = {
      key: key, path: parent.path.concat([key]), parent: parent, containers: [],
      questions: new CIMultiMap<ElementRecord>(), children: new CIMultiMap<DataScopeRecord>(),
    };
    res.valueRecord = {
      name: key, type: container.type, kind: "panel", path: container.path, json: container.json,
      scope: [], isUnknownType: false, valueType: { shape: "object" }, dataScope: parent, isDataObject: true,
      objectScope: res,
    };
    parent.children.add(key, res);
  }
  res.containers.push(container);
  return res;
}

// The object an expression of this element runs over. A question's conditions run in its container's
// scope, a panel's or a page's in the scope its own key lives in, a column's, a template question's
// and a composite field's in the scope of the question that holds them. No owner: the survey data.
export function getOwnerDataScope(owner: ElementRecord | undefined, index: SurveyIndex): DataScopeRecord {
  let current = owner;
  while(!!current) {
    if (!!current.dataScope) return current.dataScope;
    current = current.parent;
  }
  return index.rootScope;
}

// A question that writes inside a nesting container's object rather than a key of the survey data (or
// of a record, which is a root of its own).
export function isInNestedScope(record: ElementRecord, index: SurveyIndex): boolean {
  return isInNestedObject(record);
}
export function isInNestedObject(record: ElementRecord): boolean {
  return !!record.dataScope && !!record.dataScope.parent;
}

// The property of a container that spells its key: what a finding about the key points at.
export function getContainerKeyPath(record: ElementRecord): string {
  if (!!record.keyPath) return record.keyPath;
  if (!!record.json && typeof record.json.valueName === "string" && !!record.json.valueName) return record.path + ".valueName";
  return record.name ? record.path + ".name" : record.path;
}

// Every object below the survey data, outer ones first.
export function getAllNestedScopes(index: SurveyIndex): Array<DataScopeRecord> {
  return getScopesBelow(index.rootScope);
}
function getScopesBelow(root: DataScopeRecord): Array<DataScopeRecord> {
  const res: Array<DataScopeRecord> = [];
  const collect = (scope: DataScopeRecord) => scope.children.forEach(children => children.forEach(child => {
    res.push(child);
    collect(child);
  }));
  collect(root);
  return res;
}
// Every record and every object inside one, each record before its objects: the levels the key rules run
// on inside dynamic panels and matrices. Nothing of the survey data is among them.
export function getAllRecordLevels(index: SurveyIndex): Array<DataScopeRecord> {
  const res: Array<DataScopeRecord> = [];
  index.recordScopes.forEach(record => res.push(record, ...getScopesBelow(record)));
  return res;
}
