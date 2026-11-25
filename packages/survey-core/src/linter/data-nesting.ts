import { Serializer } from "survey-core";
import { CIMultiMap, ContainerRecord, DataScopeRecord, ElementRecord, SurveyIndex } from "./symbols";

// Nested data (docs/design-survey-nested-data.md): a panel or a page with a valueName - or every panel
// and/or page in a by-name dataNesting mode - stores its questions' values in an object under its key.

// The kind the key rule looks a container up by: a dynamic panel's template is no container of its own.
export function getContainerNestingKind(container: ContainerRecord): string {
  return container.kind === "panel" || container.kind === "page" ? container.kind : "";
}

// The mode the survey runs in: the JSON's, else the serializer default ("none") - which a host may have set to
// another mode once in code, and which the linter shares through the one module closure.
export function getDataNestingMode(json: any): string {
  if (typeof json.dataNesting === "string") return json.dataNesting;
  const prop = Serializer.findProperty("survey", "dataNesting");
  const def = !!prop ? prop.defaultValue : undefined;
  return typeof def === "string" ? def : "none";
}

// As SurveyModel.generateNewName: the first free <base>N among the pages / panels added before it. A name declared
// further down is not seen yet, so an unnamed first panel and a later "panel1" end up with one name.
export function generateContainerName(base: string, taken: Set<string>): string {
  let index = 1;
  while(taken.has(base + index)) index++;
  return base + index;
}

// The survey data, or with recordOwner a dynamic panel's or a matrix's record, a root of its own. Its paths start
// at the record: a survey path would need the record's index, which a sort, a filter or a page changes.
export function createScope(recordOwner?: ElementRecord): DataScopeRecord {
  const res: DataScopeRecord = {
    kind: !!recordOwner ? "record" : "survey", key: "", path: [], containers: [],
    questions: new CIMultiMap<ElementRecord>(), children: new CIMultiMap<DataScopeRecord>(),
  };
  if (!!recordOwner) res.recordOwner = recordOwner;
  return res;
}

// Whether the object is a record or lies inside one: a panel there nests by its valueName only, so no
// by-name dataNesting mode changes a record's shape.
export function isInsideRecordScope(scope: DataScopeRecord): boolean {
  let current = scope;
  while(!!current && current.kind === "object") current = current.parent;
  return !!current && current.kind === "record";
}

// The object of a nesting container inside parent: shared with every container on the same exact key
// at that level - the runtime stores data keys case-sensitively.
export function getChildScope(parent: DataScopeRecord, key: string, container: ElementRecord): DataScopeRecord {
  let res = parent.children.get(key).filter(child => child.key === key)[0];
  if (!res) {
    res = {
      kind: "object", key: key, path: parent.path.concat([key]), parent: parent, containers: [],
      questions: new CIMultiMap<ElementRecord>(), children: new CIMultiMap<DataScopeRecord>(),
    };
    // the object, not the container: no rule may take it for the panel or the page
    res.valueRecord = {
      name: key, type: container.type, kind: "dataObject", path: container.path, json: container.json,
      scope: [], isUnknownType: false, valueType: { shape: "object" }, dataScope: parent, objectScope: res,
    };
    parent.children.add(key, res);
  }
  res.containers.push(container);
  return res;
}

// A question's conditions run in its container's scope, a panel's or a page's in the scope its own key lives in;
// a column, a template question and a composite field run in the scope of the question that holds them.
export function getOwnerDataScope(owner: ElementRecord | undefined, index: SurveyIndex): DataScopeRecord {
  let current = owner;
  while(!!current) {
    if (!!current.dataScope) return current.dataScope;
    current = current.parent;
  }
  return index.rootScope;
}

// An element that writes inside a nesting container's object rather than a key of the survey data (or
// of a record, which is a root of its own).
export function isInNestedObject(record: ElementRecord): boolean {
  return !!record.dataScope && record.dataScope.kind === "object";
}

// The object a nesting panel's or page's elements write into; undefined for any other element.
export function getNestedScope(record: ElementRecord): DataScopeRecord | undefined {
  return !!record.container ? record.container.nestedScope : undefined;
}

// The property of a container that spells its key: what a finding about the key points at.
export function getContainerKeyPath(record: ElementRecord): string {
  if (!!record.container && !!record.container.keyPath) return record.container.keyPath;
  if (!!record.json && typeof record.json.valueName === "string" && !!record.json.valueName) return record.path + ".valueName";
  return record.name ? record.path + ".name" : record.path;
}

// Every container key, as the object it lives in (scope) and the object it keys (child): in the survey data
// and in each record, outer keys first. A record is a root of its own, never a child.
export function forEachContainerKey(index: SurveyIndex,
  callback: (scope: DataScopeRecord, child: DataScopeRecord) => void): void {
  const visit = (scope: DataScopeRecord): void => scope.children.forEach(children => children.forEach(child => {
    callback(scope, child);
    visit(child);
  }));
  [index.rootScope].concat(index.recordScopes).forEach(visit);
}
