import type { ISurvey } from "./base-interfaces";
import { Helpers } from "./helpers";
import { settings } from "./settings";

// The plain-object side of nested data: a key's value read as an object, a key set or removed in a copy, the
// keys at paths removed, and the data.keepEmptyValues rule for the keys of an object. No scope or element here.

// A key's value as a scope's object: an object, not an array; undefined for another value.
export function asScopeObject(val: any): any {
  return !!val && typeof val === "object" && !Array.isArray(val) ? val : undefined;
}
// Removes the keys at the paths from obj, in place, copying the objects on the way; an object that becomes
// empty goes too. A path through a value that is no object (an array included) is skipped.
export function deleteObjectPaths(obj: any, paths: Array<Array<string>>): void {
  paths.forEach(path => {
    const objects: Array<any> = [obj];
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const next = asScopeObject(cur[path[i]]);
      if (!next) return;
      cur = cur[path[i]] = Object.assign({}, next);
      objects.push(cur);
    }
    delete cur[path[path.length - 1]];
    for (let i = objects.length - 1; i > 0; i--) {
      if (Object.keys(objects[i]).length > 0) break;
      delete objects[i - 1][path[i - 1]];
    }
  });
}

// What a key of an object holds, for data.keepEmptyValues: "value" a question's value, "comment" a comment key
// (never kept, as at the top level), "container" the object of a nesting container inside.
export type ObjectKeyKind = "value" | "comment" | "container";
// With data.keepEmptyValues on, a container's object is removed only when it has no keys left. One that
// still has keys stays, even deep empty ({ street: "" }) and in a system clear. undefined when the rule does
// not apply (no survey, the key off, or the value is no object): the caller's own rule decides. The survey asks
// it for a root container's key, an outer scope for the key of a container inside it.
export function isContainerObjectKept(survey: ISurvey, value: any): boolean {
  const obj = asScopeObject(value);
  if (!obj || !survey || !survey.getSettings().data.keepEmptyValues) return undefined;
  return Object.keys(obj).length > 0;
}
function isEmptyObjectKeyKept(value: any, survey: ISurvey, kind: ObjectKeyKind): boolean {
  if (!survey || kind === "comment") return false;
  const kept = kind === "container" ? isContainerObjectKept(survey, value) : undefined;
  return kept !== undefined ? kept : survey.isEmptyValueKept(value);
}
// A copy of obj with one key set, or removed when the value is empty. The other keys are kept, including keys
// no question owns. With a survey, an empty value stays when the survey keeps it (data.keepEmptyValues);
// without one (no survey, a record) every empty value is removed.
export function setObjectKey(obj: any, name: string, value: any, survey?: ISurvey, kind: ObjectKeyKind = "value"): any {
  const res = Object.assign({}, obj);
  if (Helpers.isValueEmpty(value) && !isEmptyObjectKeyKept(value, survey, kind)) {
    delete res[name];
  } else {
    res[name] = Helpers.getUnbindValue(value);
  }
  return res;
}
// The value name a comment key names, ignoring letter case ({Kind-comment} -> "Kind"); "" for another name.
export function getNameOfCommentName(name: string): string {
  const suffix = settings.commentSuffix;
  if (!suffix || name.length <= suffix.length) return "";
  return name.toLowerCase().endsWith(suffix.toLowerCase()) ? name.substring(0, name.length - suffix.length) : "";
}
