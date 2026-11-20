import type { ISurvey } from "./base-interfaces";
import { Helpers } from "./helpers";
import { settings } from "./settings";

// The plain-object side of nested data: a key's value read as an object, a key set or removed in a copy, the
// value at a path read and written, the keys at paths removed, and the data.keepEmptyValues rule for the keys
// of an object. No scope or element here.

// A key's value as a scope's object: an object, not an array; undefined for another value.
export function asScopeObject(val: any): any {
  return !!val && typeof val === "object" && !Array.isArray(val) ? val : undefined;
}
// The value at the path in obj, through the objects on the way; undefined when a key on the way holds no object
// (an array included). An empty path gives obj.
export function getValueByPath(obj: any, path: Array<string>): any {
  for (let i = 0; i < path.length && obj !== undefined; i++) {
    obj = asScopeObject(obj)?.[path[i]];
  }
  return obj;
}
// Writes value into obj under the path, copying the objects on the way (obj may hold the stored objects).
// isOwnObj: obj and the objects in it were built by the caller (server data), no copy is needed.
export function setValueByPath(obj: any, path: Array<string>, value: any, isOwnObj?: boolean): void {
  for (let i = 0; i < path.length - 1; i++) {
    const cur = asScopeObject(obj[path[i]]);
    obj[path[i]] = !cur ? {} : isOwnObj ? cur : Object.assign({}, cur);
    obj = obj[path[i]];
  }
  obj[path[path.length - 1]] = value;
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
