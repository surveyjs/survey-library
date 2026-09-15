import { ILintFix, ILintFixEdit } from "./types";

// "pages[0].elements[1].visibleIf" -> ["pages", 0, "elements", 1, "visibleIf"]
function parsePath(path: string): Array<string | number> {
  const res: Array<string | number> = [];
  if (!path) return res;
  path.split(".").forEach(part => {
    if (!part) return;
    const bracket = part.indexOf("[");
    if (bracket < 0) {
      res.push(part);
      return;
    }
    const name = part.substring(0, bracket);
    if (!!name) res.push(name);
    const indexes = part.substring(bracket).match(/\[(\d+)\]/g) || [];
    indexes.forEach(entry => res.push(parseInt(entry.substring(1, entry.length - 1), 10)));
  });
  return res;
}

function copyContainer(node: any): any {
  return Array.isArray(node) ? node.slice() : { ...node };
}

// The key stays where the author wrote it: an object literal keeps its order, and deleting a key
// to add it back under another name would move it to the end.
function renameKey(node: any, key: string, newKey: string): any {
  const res: any = {};
  Object.keys(node).forEach(current => {
    if (current === key) res[newKey] = node[key];
    else res[current] = node[current];
  });
  return res;
}

function hasKey(node: any, key: string | number): boolean {
  if (Array.isArray(node)) return typeof key === "number" && key >= 0 && key < node.length;
  return Object.prototype.hasOwnProperty.call(node, key);
}

// undefined means the edit does not apply to this document, and the caller keeps the original.
function applyOp(node: any, key: string | number, edit: ILintFixEdit): any {
  const has = hasKey(node, key);
  if (edit.op === "set") {
    // the one op that may name a key the object does not have yet: a required property is
    // missing exactly because nobody wrote it
    if (Array.isArray(node) && !has) return undefined;
    const res = copyContainer(node);
    res[key] = edit.value;
    return res;
  }
  if (!has) return undefined;
  if (edit.op === "wrap") {
    const res = copyContainer(node);
    res[key] = [node[key]];
    return res;
  }
  if (edit.op === "remove") {
    if (Array.isArray(node)) {
      const res = node.slice();
      res.splice(<number>key, 1);
      return res;
    }
    const res = copyContainer(node);
    delete res[key];
    return res;
  }
  if (edit.op === "rename") {
    if (Array.isArray(node) || !edit.key) return undefined;
    return renameKey(node, <string>key, edit.key);
  }
  return undefined;
}

// Rebuilds the containers on the way down to the edit; everything the edit does not touch stays
// shared with the input, which is never modified.
function rebuild(node: any, segments: Array<string | number>, index: number,
  edit: ILintFixEdit): any {
  if (!node || typeof node !== "object") return undefined;
  const key = segments[index];
  const isLast = index === segments.length - 1;
  // the walker reads a single object written where an array belongs as its one element, and the
  // document has no index for it - so the index addresses that object itself
  if (typeof key === "number" && !Array.isArray(node)) {
    if (key !== 0 || isLast) return undefined;
    return rebuild(node, segments, index + 1, edit);
  }
  if (typeof key === "string" && Array.isArray(node)) return undefined;
  if (isLast) return applyOp(node, key, edit);
  const child = node[key];
  if (child === undefined) return undefined;
  const newChild = rebuild(child, segments, index + 1, edit);
  if (newChild === undefined) return undefined;
  const res = copyContainer(node);
  res[key] = newChild;
  return res;
}

// Applies one fix and returns the repaired JSON. The input is left exactly as it was, the way
// lintSurvey leaves it: a host that wants to repair everything lints the result and applies the
// next fix, because removing an array item renumbers the paths that follow it.
export function applyFix(json: any, fix: ILintFix): any {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new TypeError("applyFix expects a survey JSON object. Parse JSON strings with JSON.parse before calling.");
  }
  if (!fix || !Array.isArray(fix.edits) || fix.edits.length === 0) return json;
  let res = json;
  for (let i = 0; i < fix.edits.length; i++) {
    const edit = fix.edits[i];
    const segments = !!edit ? parsePath(edit.path) : [];
    if (segments.length === 0) return json;
    const next = rebuild(res, segments, 0, edit);
    // an edit that does not apply undoes the whole fix: half a repair is worse than none
    if (next === undefined) return json;
    res = next;
  }
  return res;
}
