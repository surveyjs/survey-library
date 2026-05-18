import { Base } from "./base";
import { JsonObject, JsonObjectProperty, Serializer } from "./jsonobject";
import {
  applyOperation as fjpApplyOperation,
  applyPatch as fjpApplyPatch,
  deepClone as fjpDeepClone,
  getValueByPointer as fjpGetValueByPointer,
  unescapePathComponent as fjpUnescapePathComponent,
  Operation,
} from "fast-json-patch";

/**
 * A single JSON Patch operation, as defined by RFC 6902. Re-exported from
 * `fast-json-patch`.
 */
export { Operation as JsonPatchOperation } from "fast-json-patch";

/**
 * The reason a [[JsonPatchError]] was thrown.
 */
export type JsonPatchErrorReason =
  | "INVALID_OP"
  | "INVALID_POINTER"
  | "INVALID_PATH"
  | "INVALID_TARGET"
  | "PATH_NOT_FOUND";

/**
 * Thrown by [[SurveyModel.patchJSON]] when a patch operation cannot be applied.
 */
export class JsonPatchError extends Error {
  constructor(
    public readonly reason: JsonPatchErrorReason,
    public readonly opIndex: number,
    public readonly op: Operation,
    message: string
  ) {
    super(`JSON Patch op #${opIndex} (${op && op.op}) failed: ${reason} - ${message}`);
    this.name = "JsonPatchError";
    // Restore prototype chain for ES5 targets.
    Object.setPrototypeOf(this, JsonPatchError.prototype);
  }
}

// ---------------------------------------------------------------------------
// RFC 6901 JSON Pointer parsing
//
// fast-json-patch handles RFC 6901 parsing internally for its own
// applyOperation/applyPatch/getValueByPointer entry points. We still need
// segment-by-segment parsing here because the model walker has to inspect
// each token against Serializer metadata.
// ---------------------------------------------------------------------------

function parsePointer(pointer: string): string[] {
  if (pointer === undefined || pointer === null) {
    throw new OpError("INVALID_POINTER", "pointer is null");
  }
  if (pointer === "") return [];
  if (pointer.charAt(0) !== "/") {
    throw new OpError(
      "INVALID_POINTER",
      `pointer must be empty or start with "/": ${JSON.stringify(pointer)}`
    );
  }
  const parts = pointer.substring(1).split("/");
  for (let i = 0; i < parts.length; i++) {
    parts[i] = fjpUnescapePathComponent(parts[i]);
  }
  return parts;
}

function parseArrayIndex(token: string, length: number, allowDash: boolean): number {
  if (token === "-") return allowDash ? length : -1;
  if (!/^(0|[1-9][0-9]*)$/.test(token)) return -1;
  const idx = parseInt(token, 10);
  if (idx > length || (!allowDash && idx === length)) return -1;
  return idx;
}

class OpError {
  constructor(public reason: JsonPatchErrorReason, public message: string) { }
}

function runDryRun(snapshot: any, patches: Operation[]): void {
  // applyPatch validates ops, throws on the first failure. Mutates the
  // snapshot in place; we don't care about the result.
  try {
    fjpApplyPatch(snapshot, patches as any, true, true);
  } catch(e: any) {
    const idx = typeof e?.index === "number" ? e.index : -1;
    const op = idx >= 0 ? patches[idx] : (null as any);
    throw new JsonPatchError("INVALID_OP", idx, op, e?.message || "patch validation failed");
  }
}

function readProp(base: Base, prop: JsonObjectProperty): any {
  return (base as any)[prop.name];
}

// ---------------------------------------------------------------------------
// Model-aware patcher
// ---------------------------------------------------------------------------

/**
 * Where the patch lands inside the resolved property's value:
 *   - "property": the leaf is the property itself (scalar / locString / nested Base / whole array).
 *   - "arrayIndex": leaf targets element at `arrayIndex` of the property's array.
 *   - "arrayAppend": leaf targets a new slot at the end (only valid for `add`).
 *   - "locale": leaf targets a single locale of a localizable string.
 *   - "plain": leaf is somewhere inside a plain (non-Base) object/array subtree.
 */
interface IResolvedBase {
  parentBase: Base;
  prop: JsonObjectProperty;
}
type ResolvedPath =
  | (IResolvedBase & { kind: "property" })
  | (IResolvedBase & { kind: "arrayIndex", arrayIndex: number })
  | (IResolvedBase & { kind: "arrayAppend" })
  | (IResolvedBase & { kind: "locale", locale: string | null })
  | (IResolvedBase & { kind: "plain", plainTokens: string[] });

function findPropertyOn(base: Base, token: string): JsonObjectProperty | null {
  let prop = Serializer.findProperty(base.getType(), token);
  if (prop) return prop;
  const orig = (base as any).getOriginalByProperty
    ? (base as any).getOriginalByProperty(token)
    : null;
  if (orig && orig !== base) {
    prop = Serializer.findProperty(orig.getType(), token);
  }
  return prop;
}

function resolvePath(root: Base, pointer: string, allowAppend: boolean): ResolvedPath {
  const tokens = parsePointer(pointer);
  if (tokens.length === 0) {
    throw new OpError("INVALID_PATH", "root pointer is not supported on a model");
  }
  let cur: any = root;
  let parentBase: Base = root;
  let prop: JsonObjectProperty | null = null;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isLast = i === tokens.length - 1;

    if (cur instanceof Base) {
      parentBase = cur;
      prop = findPropertyOn(cur, token);
      if (!prop) {
        throw new OpError("PATH_NOT_FOUND", `unknown property "${token}" on "${cur.getType()}"`);
      }
      if (prop.isLocalizable) {
        if (isLast) return { parentBase, prop, kind: "property" };
        // Exactly one extra token = locale.
        if (i + 1 !== tokens.length - 1) {
          throw new OpError(
            "INVALID_PATH",
            `localizable string "${token}" can only be addressed by one locale segment`
          );
        }
        const locToken = tokens[i + 1];
        const loc = locToken === "default" || locToken === "" ? null : locToken;
        return { parentBase, prop, kind: "locale", locale: loc };
      }
      if (isLast) return { parentBase, prop, kind: "property" };
      // Descend.
      cur = readProp(cur, prop);
      if (cur === undefined || cur === null) {
        throw new OpError(
          "PATH_NOT_FOUND",
          `property "${prop.name}" is not set; cannot descend into "${tokens.slice(i + 1).join("/")}"`
        );
      }
      continue;
    }

    if (Array.isArray(cur)) {
      if (!prop) {
        throw new OpError("INVALID_TARGET", "array reached without an owning property");
      }
      const idx = parseArrayIndex(token, cur.length, isLast && allowAppend);
      if (idx === -1) {
        throw new OpError(
          isLast ? "PATH_NOT_FOUND" : "INVALID_TARGET",
          `invalid array index "${token}" for property "${prop.name}"`
        );
      }
      if (isLast) {
        // `-` or index === length both mean append-at-end (the latter is
        // valid for `add` when allowAppend is true).
        if (token === "-" || idx === cur.length) {
          return { parentBase, prop, kind: "arrayAppend" };
        }
        return { parentBase, prop, kind: "arrayIndex", arrayIndex: idx };
      }
      if (idx >= cur.length) {
        throw new OpError("PATH_NOT_FOUND", `array index out of range: ${token}`);
      }
      cur = cur[idx];
      continue;
    }

    // cur is a plain JSON value held inside a property without className.
    // Resolve the rest of the path as plain JSON and commit by reassigning the subtree.
    if (!prop) {
      throw new OpError("INVALID_TARGET", "cannot descend into a value without an owning property");
    }
    return { parentBase, prop, kind: "plain", plainTokens: tokens.slice(i) };
  }
  // Loop always returns on the last iteration above; this is provably unreachable.
  throw new OpError("INVALID_PATH", "unreachable");
}

function getCurrentValueAt(root: Base, pointer: string): any {
  return readResolved(resolvePath(root, pointer, false));
}

function readResolved(r: ResolvedPath): any {
  const value = readProp(r.parentBase, r.prop);
  switch(r.kind) {
    case "property":
      if (r.prop.isLocalizable) {
        const ls = r.parentBase.getLocalizableString(r.prop.name);
        return ls ? ls.getJson() : undefined;
      }
      if (value instanceof Base) return snapshotBase(value, r.prop);
      if (Array.isArray(value)) return baseAwareSnapshot(value, r.prop);
      return value;
    case "arrayIndex": {
      const item = (value as any[])[r.arrayIndex];
      return item instanceof Base ? snapshotBase(item, r.prop) : fjpDeepClone(item);
    }
    case "arrayAppend":
      return undefined;
    case "locale": {
      const ls = r.parentBase.getLocalizableString(r.prop.name);
      return ls ? (ls.getLocaleText(r.locale as any) || undefined) : undefined;
    }
    case "plain": {
      const v = fjpGetValueByPointer(value, tokensToPointer(r.plainTokens));
      return v === undefined ? undefined : fjpDeepClone(v);
    }
  }
}

function snapshotBase(item: Base, prop: JsonObjectProperty): any {
  // Use the array/nested-Base property so JsonObject preserves the
  // polymorphic `type` field for items whose property has no fixed className.
  return new JsonObject().toJsonObjectCore(item, prop);
}

function baseAwareSnapshot(arr: any[], prop: JsonObjectProperty): any[] {
  return arr.map(item => (item instanceof Base ? snapshotBase(item, prop) : fjpDeepClone(item)));
}

/**
 * Materializes a value for a Base-typed property slot:
 *   - `polymorphic=true`  (array-item slot): className from `value.type` when present, else `prop.className`.
 *   - `polymorphic=false` (single nested-Base slot): className strictly from `prop.className`.
 * Falls back to a deep-cloned primitive when no className can be determined or the class is unknown.
 */
function materializeBase(prop: JsonObjectProperty, value: any, polymorphic: boolean): any {
  if (value === null || value === undefined) return value;
  let className: string | undefined = prop.className;
  if (polymorphic && typeof value === "object" && value.type) {
    className = value.type;
  }
  if (!className) return fjpDeepClone(value);
  className = className.toLowerCase();
  if (polymorphic) {
    const classNamePart = (prop as any).classNamePart as string | undefined;
    if (classNamePart && className.indexOf(classNamePart) < 0) {
      className += classNamePart;
    }
  }
  const instance = Serializer.createClass(className, value);
  if (!instance) return fjpDeepClone(value);
  if (typeof value === "object") {
    new JsonObject().toObjectCore(value, instance);
  }
  return instance;
}

function getOrInitLocString(parent: Base, prop: JsonObjectProperty, initWithEmpty: boolean) {
  let ls = parent.getLocalizableString(prop.name);
  if (!ls && initWithEmpty) {
    prop.setValue(parent, "", undefined as any);
    ls = parent.getLocalizableString(prop.name);
  }
  return ls;
}

function setWholeLocalizable(parent: Base, prop: JsonObjectProperty, value: any): void {
  const ls = getOrInitLocString(parent, prop, false);
  if (!ls) {
    // Property is locString-backed but not yet initialized; fall through to the
    // generic setter, which will create one as part of deserialization.
    prop.setValue(parent, value, undefined as any);
    return;
  }
  // setJson with isLoading=false routes through setLocaleText and fires events.
  ls.setJson(value, false);
}

function setLocaleOf(parent: Base, prop: JsonObjectProperty, loc: string | null, value: any): void {
  if (value !== undefined && value !== null && typeof value !== "string") {
    throw new OpError(
      "INVALID_TARGET",
      `localizable leaf accepts only strings, got ${typeof value}`
    );
  }
  const ls = getOrInitLocString(parent, prop, true);
  if (!ls) {
    throw new OpError(
      "INVALID_TARGET",
      `property "${prop.name}" is not localizable on this object`
    );
  }
  ls.setLocaleText(loc as any, value as any);
}

function mutatePlainSubtree(
  parent: Base,
  prop: JsonObjectProperty,
  plainTokens: string[],
  op: "add" | "replace" | "remove",
  value?: any
): void {
  const current = readProp(parent, prop);
  if (op === "remove" && (current === undefined || current === null)) {
    throw new OpError("PATH_NOT_FOUND", "cannot remove from undefined subtree");
  }
  const clone = current === undefined || current === null ? {} : fjpDeepClone(current);
  const subOp: any = { op, path: tokensToPointer(plainTokens) };
  if (op !== "remove") subOp.value = value;
  const next = applySubtreeOp(clone, subOp, op);
  prop.setValue(parent, next, undefined as any);
}

function replaceArrayContents(arr: any[], items: any[]): void {
  // Empty in-place then push new items so onPush/onRemove fire per element.
  if (arr.length > 0) {
    arr.splice(0, arr.length);
  }
  for (let i = 0; i < items.length; i++) {
    arr.push(items[i]);
  }
}

function requireValue(op: Operation): any {
  if (!("value" in op)) throw new OpError("INVALID_OP", "missing \"value\" field");
  return (op as any).value;
}

function requireFrom(op: Operation): string {
  const from = (op as any).from;
  if (typeof from !== "string") throw new OpError("INVALID_OP", "missing from field");
  return from;
}

function applyOpToModel(root: Base, op: Operation): void {
  if (!op || typeof op !== "object") {
    throw new OpError("INVALID_OP", "operation is not an object");
  }
  if (typeof op.path !== "string") {
    throw new OpError("INVALID_OP", "missing path field");
  }
  switch(op.op) {
    case "add":
      applyAddOrReplace(root, op.path, requireValue(op), /*requireExisting*/ false);
      return;
    case "replace":
      applyAddOrReplace(root, op.path, requireValue(op), /*requireExisting*/ true);
      return;
    case "remove":
      applyRemove(root, op.path);
      return;
    case "move": {
      const from = requireFrom(op);
      if (op.path === from) return;
      if (isAncestorPath(from, op.path)) {
        throw new OpError("INVALID_OP", "move: from must not be a prefix of path");
      }
      const value = getCurrentValueAt(root, from);
      applyRemove(root, from);
      applyAddOrReplace(root, op.path, value, false);
      return;
    }
    case "copy": {
      const from = requireFrom(op);
      const value = getCurrentValueAt(root, from);
      applyAddOrReplace(root, op.path, value, false);
      return;
    }
    default:
      throw new OpError("INVALID_OP", `unknown op: ${(op as any).op}`);
  }
}

function isAncestorPath(parent: string, child: string): boolean {
  if (parent === child) return true;
  if (!child.startsWith(parent)) return false;
  return child.charAt(parent.length) === "/";
}

function applyAddOrReplace(root: Base, pointer: string, value: any, requireExisting: boolean): void {
  const resolved = resolvePath(root, pointer, /*allowAppend*/ !requireExisting);
  const { parentBase, prop } = resolved;
  switch(resolved.kind) {
    case "property": {
      if (prop.isLocalizable) {
        setWholeLocalizable(parentBase, prop, value);
        return;
      }
      if (prop.isArray) {
        const currentArr = readProp(parentBase, prop);
        if (!Array.isArray(currentArr)) {
          throw new OpError("INVALID_TARGET", `array property "${prop.name}" is not initialized`);
        }
        const arrValue = Array.isArray(value) ? value : [];
        const items = arrValue.map(v => materializeBase(prop, v, /*polymorphic*/ true));
        replaceArrayContents(currentArr, items);
        return;
      }
      if (prop.className) {
        prop.setValue(parentBase, materializeBase(prop, value, /*polymorphic*/ false), undefined as any);
        return;
      }
      prop.setValue(parentBase, value, undefined as any);
      return;
    }
    case "arrayIndex": {
      const arr = readProp(parentBase, prop) as any[];
      const item = materializeBase(prop, value, /*polymorphic*/ true);
      // replace: drop one element at idx; add: insert before idx.
      arr.splice(resolved.arrayIndex, requireExisting ? 1 : 0, item);
      return;
    }
    case "arrayAppend": {
      if (requireExisting) {
        throw new OpError("PATH_NOT_FOUND", "cannot replace a non-existent array slot");
      }
      const arr = readProp(parentBase, prop) as any[];
      arr.push(materializeBase(prop, value, /*polymorphic*/ true));
      return;
    }
    case "locale":
      setLocaleOf(parentBase, prop, resolved.locale, value);
      return;
    case "plain":
      // Read the subtree, mutate via fast-json-patch, write back. The single
      // setValue at the end fires property-change events on the owning Base.
      mutatePlainSubtree(parentBase, prop, resolved.plainTokens, requireExisting ? "replace" : "add", value);
      return;
  }
}

function applyRemove(root: Base, pointer: string): void {
  const resolved = resolvePath(root, pointer, /*allowAppend*/ false);
  const { parentBase, prop } = resolved;
  switch(resolved.kind) {
    case "property": {
      if (prop.isLocalizable) {
        const ls = parentBase.getLocalizableString(prop.name);
        if (ls) ls.setJson(undefined as any, false);
        return;
      }
      if (prop.isArray) {
        const currentArr = readProp(parentBase, prop);
        if (Array.isArray(currentArr) && currentArr.length > 0) {
          currentArr.splice(0, currentArr.length);
        }
        return;
      }
      prop.setValue(parentBase, prop.getDefaultValue(parentBase), undefined as any);
      return;
    }
    case "arrayIndex": {
      const arr = readProp(parentBase, prop) as any[];
      arr.splice(resolved.arrayIndex, 1);
      return;
    }
    case "arrayAppend":
      throw new OpError("PATH_NOT_FOUND", "cannot remove from the end of an array using '-'");
    case "locale": {
      const ls = parentBase.getLocalizableString(prop.name);
      if (ls) ls.setLocaleText(resolved.locale as any, undefined as any);
      return;
    }
    case "plain":
      mutatePlainSubtree(parentBase, prop, resolved.plainTokens, "remove");
      return;
  }
}

function tokensToPointer(tokens: string[]): string {
  if (tokens.length === 0) return "";
  const escaped = tokens.map(t => t.replace(/~/g, "~0").replace(/\//g, "~1"));
  return "/" + escaped.join("/");
}

function applySubtreeOp(doc: any, op: { op: string, path: string, value?: any }, kind: "add" | "replace" | "remove"): any {
  // Delegates to fast-json-patch's applyOperation for the heavy lifting
  // (RFC 6901 walking, RFC 6902 semantics, validation, error reporting).
  try {
    return fjpApplyOperation(doc, op as any, true, true).newDocument;
  } catch(e: any) {
    throw new OpError("INVALID_OP", e?.message || `subtree ${kind} failed`);
  }
}

/**
 * Applies a sequence of RFC 6902 patch operations directly to a live
 * `Base` (typically a `SurveyModel`) tree, mutating nested properties,
 * tracked arrays and localizable strings in place. Used internally by
 * [[SurveyModel.patchJSON]].
 *
 * Throws [[JsonPatchError]] on the first failed operation. When
 * `validateFirst` is `true` the batch is dry-run against a JSON snapshot
 * first, so the model is only mutated if all operations would succeed.
 */
export function applyPatchToModel(
  root: Base,
  patches: Operation[],
  validateFirst?: boolean
): void {
  if (!root) throw new JsonPatchError("INVALID_TARGET", -1, null as any, "root is null");
  if (!Array.isArray(patches)) {
    throw new JsonPatchError("INVALID_OP", -1, null as any, "patches must be an array");
  }
  if (patches.length === 0) return;

  if (validateFirst) {
    runDryRun((root as any).toJSON(), patches);
  }

  for (let i = 0; i < patches.length; i++) {
    const op = patches[i];
    try {
      applyOpToModel(root, op);
    } catch(e) {
      if (e instanceof OpError) {
        throw new JsonPatchError(e.reason, i, op, e.message);
      }
      throw e;
    }
  }
}
