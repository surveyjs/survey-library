import { CIMultiMap, DataScopeRecord, ElementRecord, SurveyIndex } from "./symbols";

// Scoped names (docs/design-survey-nested-data.md; the runtime's rule is src/name-scope.ts). In a nesting mode of
// dataNesting a name is unique where its value lives, and a bare name resolves in its own scope, then in each scope
// around it. The linter's name scope is the data scope (DataScopeRecord): the survey data, a nesting container's
// object, a dynamic panel's or a matrix's record (its template, its detail panel). Where the runtime differs, the
// linter follows the data:
// - two containers on one key share one object, so they share one name scope: their questions write one value;
// - a choice panel's questions write keys of the survey data, so they are the survey's.
// In "none" the survey is the only scope, as before.

const NO_NAMES = new CIMultiMap<ElementRecord>();

export function isNameScopeMode(index: { dataNesting: string }): boolean {
  return index.dataNesting !== "none";
}

// The name scope a record's name lives in: its data scope. A panel's or a page's is the scope its own key lives in.
export function getRecordNameScope(record: ElementRecord, index: SurveyIndex): DataScopeRecord {
  return record.dataScope || index.rootScope;
}

// The elements of one name scope, by name. The survey's are elementNames.
export function getNameScopeNames(scope: DataScopeRecord, index: SurveyIndex): CIMultiMap<ElementRecord> {
  if (scope === index.rootScope) return index.elementNames;
  return index.nameScopes.get(scope) || NO_NAMES;
}

// The scope an element opens: a nesting panel's or page's object, a dynamic panel's or a matrix's record.
function getOwnedScope(record: ElementRecord): DataScopeRecord | undefined {
  if (!!record.container && !!record.container.nestedScope) return record.container.nestedScope;
  return record.kind === "question" ? record.recordScope : undefined;
}

// The element whose name opens the record's name scope; undefined for the survey's own. Of the containers sharing
// an object, the one around the record.
function getNameScopeOwner(record: ElementRecord, index: SurveyIndex): ElementRecord | undefined {
  const scope = getRecordNameScope(record, index);
  if (scope.kind === "survey") return undefined;
  if (scope.kind === "record") return scope.recordOwner;
  let current = record.parent;
  while(!!current && getOwnedScope(current) !== scope) current = current.parent;
  return current || scope.containers[0];
}

// An unnamed page or panel goes by the name the runtime generates for it, which is its key in a by-name mode.
function getOwnerName(owner: ElementRecord): string {
  return owner.name || (!!owner.container && owner.container.dataKey) || "";
}

// The path of names the survey finds an element by (O2, O8): each scope owner's name, then the element's.
export function getRecordNamePath(record: ElementRecord, index: SurveyIndex): string {
  const names: Array<string> = [record.name];
  let owner = getNameScopeOwner(record, index);
  while(!!owner) {
    names.unshift(getOwnerName(owner));
    owner = getNameScopeOwner(owner, index);
  }
  return names.join(".");
}

// The label a name/duplicate finding gives a name scope, in the form the matrix columns' namespace has.
export function getNameScopeLabel(scope: DataScopeRecord): string {
  if (scope.kind === "record") {
    const owner = scope.recordOwner;
    return (owner.type === "paneldynamic" ? "dynamic panel" : "matrix") + " \"" + (owner.name || owner.path) + "\"";
  }
  const container = scope.containers[0];
  return container.kind + " \"" + (getOwnerName(container) || container.path) + "\"";
}

// An element by a bare name or a path of names, in one name scope (findElementInNameScope): a whole-string match
// wins, a name may hold a dot; otherwise the string is split at its dots, left to right, each head a scope owner.
function findInNameScope(scope: DataScopeRecord, name: string, index: SurveyIndex,
  accepts: (record: ElementRecord) => boolean): ElementRecord | undefined {
  if (!name) return undefined;
  const names = getNameScopeNames(scope, index);
  const generated = index.generatedNames.get(scope) || NO_NAMES;
  const own = names.get(name).filter(accepts)[0] || generated.get(name).filter(accepts)[0];
  if (!!own) return own;
  let pos = name.indexOf(".");
  while(pos > 0) {
    const rest = name.substring(pos + 1);
    const head = name.substring(0, pos);
    const scopes = names.get(head).concat(generated.get(head)).map(getOwnedScope).filter(inner => !!inner);
    for (let i = 0; i < scopes.length; i++) {
      const found = findInNameScope(scopes[i], rest, index, accepts);
      if (!!found) return found;
    }
    pos = name.indexOf(".", pos + 1);
  }
  return undefined;
}

// From a scope outwards, as ISurveyData.findQuestionByName answers in a nesting mode: the scope's own elements,
// then each scope around it. A record goes on to the scopes around its dynamic panel or matrix; the survey ends it.
export function findFromNameScope(scope: DataScopeRecord, name: string, index: SurveyIndex,
  accepts: (record: ElementRecord) => boolean): ElementRecord | undefined {
  let current = scope;
  while(!!current) {
    const res = findInNameScope(current, name, index, accepts);
    if (!!res) return res;
    current = current.kind === "record" ? getRecordNameScope(current.recordOwner, index) : current.parent;
  }
  return undefined;
}

// The name scope an owner's name properties start from: a matrix column's is the row, the record it writes into.
export function getOwnerNameScope(owner: ElementRecord | undefined, index: SurveyIndex): DataScopeRecord {
  let current = owner;
  while(!!current) {
    if (current.kind === "column" && !!current.parent && !!current.parent.recordScope) return current.parent.recordScope;
    if (!!current.dataScope) return current.dataScope;
    current = current.parent;
  }
  return index.rootScope;
}

// The shortest path of names that finds record from scope outwards (getQuestionVariableName's rule, for names):
// the record's path after the path of an owner around scope, else its path from the survey.
export function getNamePathFrom(record: ElementRecord, scope: DataScopeRecord, index: SurveyIndex): string {
  const path = getRecordNamePath(record, index);
  let current = scope;
  while(!!current) {
    const owner = current.kind === "survey" ? undefined
      : current.kind === "record" ? current.recordOwner : current.containers[0];
    const prefix = !owner ? "" : getRecordNamePath(owner, index) + ".";
    if (path.indexOf(prefix) === 0 && path.length > prefix.length) {
      const rest = path.substring(prefix.length);
      // an element of that path nearer to scope would answer first
      if (findFromNameScope(scope, rest, index, () => true) === record) return rest;
    }
    current = current.kind === "record" ? getRecordNameScope(current.recordOwner, index) : current.parent;
  }
  return path;
}
