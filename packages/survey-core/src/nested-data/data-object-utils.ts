import type { ISurvey } from "../base-interfaces";
import { Helpers } from "../helpers";

// The plain-object side of nested data: no scope or element here.

export function asScopeObject(val: any): any {
  return !!val && typeof val === "object" && !Array.isArray(val) ? val : undefined;
}
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

// What a key of an object holds, for keepEmptyValues: "value" a question's value, "comment" a comment key
// (never kept, as at the top level), "container" the object of a nesting container inside.
export type ObjectKeyKind = "value" | "comment" | "container";
// With keepEmptyValues on, a container's object stays while it has keys, even deep empty ({ street: "" })
// and in a system clear. undefined when the rule does not apply: the caller's own rule decides.
export function isContainerObjectKept(survey: ISurvey, value: any): boolean {
  const obj = asScopeObject(value);
  if (!obj || !survey || !survey.runtimeSettings.keepEmptyValues) return undefined;
  return Object.keys(obj).length > 0;
}
function isEmptyObjectKeyKept(value: any, survey: ISurvey, kind: ObjectKeyKind): boolean {
  if (!survey || kind === "comment") return false;
  const kept = kind === "container" ? isContainerObjectKept(survey, value) : undefined;
  return kept !== undefined ? kept : survey.isEmptyValueKept(value);
}
// A copy of obj with one key set, or removed when the value is empty; keys no question owns are kept. An empty
// value stays only when a survey keeps it (keepEmptyValues); without one (a record) every empty value goes.
export function setObjectKey(obj: any, name: string, value: any, survey?: ISurvey, kind: ObjectKeyKind = "value"): any {
  const res = Object.assign({}, obj);
  if (Helpers.isValueEmpty(value) && !isEmptyObjectKeyKept(value, survey, kind)) {
    delete res[name];
  } else {
    res[name] = Helpers.getUnbindValue(value);
  }
  return res;
}
