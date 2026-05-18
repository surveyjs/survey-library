import { Base } from "./base";
import { JsonObject, JsonObjectProperty, Serializer } from "./jsonobject";
import {
  applyOperation as fjpApplyOperation,
  applyPatch as fjpApplyPatch,
  deepClone as fjpDeepClone,
  getValueByPointer as fjpGetValueByPointer,
  unescapePathComponent as fjpUnescapePathComponent,
  _areEquals as fjpAreEquals,
  Operation,
} from "fast-json-patch";

/**
 * A single JSON Patch operation, as defined by RFC 6902.
 * Re-exported from `fast-json-patch`.
 */
export type JsonPatchOperation = Operation;

/**
 * A JSON Patch operation name, as defined by RFC 6902.
 */
export type JsonPatchOp = Exclude<JsonPatchOperation["op"], "_get">;

/**
 * The reason a [[JsonPatchError]] was thrown.
 */
export type JsonPatchErrorReason =
  | "INVALID_OP"
  | "INVALID_POINTER"
  | "INVALID_PATH"
  | "INVALID_TARGET"
  | "PATH_NOT_FOUND"
  | "TEST_FAILED";

/**
 * Thrown by [[SurveyModel.patchJSON]] when a patch operation cannot be applied.
 */
export class JsonPatchError extends Error {
  constructor(
    public readonly reason: JsonPatchErrorReason,
    public readonly opIndex: number,
    public readonly op: JsonPatchOperation,
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
    throw new PointerError("INVALID_POINTER", "pointer is null");
  }
  if (pointer === "") return [];
  if (pointer.charAt(0) !== "/") {
    throw new PointerError(
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

class PointerError {
  constructor(public reason: JsonPatchErrorReason, public message: string) { }
}

function runDryRun(snapshot: any, patches: JsonPatchOperation[]): void {
  // applyPatch validates ops, throws on the first failure. Mutates the
  // snapshot in place; we don't care about the result.
  try {
    fjpApplyPatch(snapshot, patches as any, true, true);
  } catch(e: any) {
    const idx = typeof e?.index === "number" ? e.index : -1;
    const op = idx >= 0 ? patches[idx] : (null as any);
    throw new JsonPatchError(mapFjpReason(e?.name), idx, op, e?.message || "patch validation failed");
  }
}

function mapFjpReason(name: string | undefined): JsonPatchErrorReason {
  switch(name) {
    case "TEST_OPERATION_FAILED":
      return "TEST_FAILED";
    case "OPERATION_OP_INVALID":
    case "OPERATION_NOT_AN_OBJECT":
    case "OPERATION_PATH_INVALID":
    case "OPERATION_FROM_REQUIRED":
    case "OPERATION_VALUE_REQUIRED":
    case "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED":
    case "SEQUENCE_NOT_AN_ARRAY":
      return "INVALID_OP";
    case "OPERATION_PATH_ILLEGAL_ARRAY_INDEX":
    case "OPERATION_VALUE_OUT_OF_BOUNDS":
      return "INVALID_TARGET";
    case "OPERATION_PATH_UNRESOLVABLE":
    case "OPERATION_FROM_UNRESOLVABLE":
      return "PATH_NOT_FOUND";
    default:
      return "PATH_NOT_FOUND";
  }
}

// ---------------------------------------------------------------------------
// Model-aware patcher
// ---------------------------------------------------------------------------

interface IResolvedPath {
  /** The Base instance owning the property in `prop`. */
  parentBase: Base;
  /** The property descriptor for the leaf. */
  prop: JsonObjectProperty;
  /**
   * Where the patch lands inside the property's value:
   *   - "property": the leaf is the property itself (scalar / locString / nested Base / whole array).
   *   - "arrayIndex": leaf targets element at `arrayIndex` of the property's array.
   *   - "arrayAppend": leaf targets a new slot at the end (only valid for `add`).
   *   - "locale": leaf targets a single locale of a localizable string.
   *   - "plain": leaf is somewhere inside a plain (non-Base) object/array subtree.
   */
  kind: "property" | "arrayIndex" | "arrayAppend" | "locale" | "plain";
  /** Array index when kind === "arrayIndex". */
  arrayIndex?: number;
  /** Locale code (or `null` for default) when kind === "locale". */
  locale?: string | null;
  /**
   * For kind === "plain": tokens that walk inside `parentBase[prop.name]`.
   * The first non-Base subtree is mutated as plain JSON, then committed via
   * `prop.setValue`.
   */
  plainTokens?: string[];
}

function resolvePath(root: Base, pointer: string, allowAppend: boolean): IResolvedPath {
  const tokens = parsePointer(pointer);
  if (tokens.length === 0) {
    throw new PointerError("INVALID_PATH", "root pointer is not supported on a model");
  }
  let cur: any = root;
  let parentBase: Base = root;
  let prop: JsonObjectProperty | null = null;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isLast = i === tokens.length - 1;

    if (cur instanceof Base) {
      parentBase = cur;
      prop = Serializer.findProperty(cur.getType(), token);
      if (!prop) {
        const orig = (cur as any).getOriginalByProperty
          ? (cur as any).getOriginalByProperty(token)
          : null;
        if (orig && orig !== cur) {
          prop = Serializer.findProperty(orig.getType(), token);
        }
      }
      if (!prop) {
        throw new PointerError("PATH_NOT_FOUND", `unknown property "${token}" on "${cur.getType()}"`);
      }
      if (prop.isLocalizable) {
        if (isLast) {
          return { parentBase, prop, kind: "property" };
        }
        // Exactly one extra token = locale.
        if (i + 1 !== tokens.length - 1) {
          throw new PointerError(
            "INVALID_PATH",
            `localizable string "${token}" can only be addressed by one locale segment`
          );
        }
        const locToken = tokens[i + 1];
        const loc = locToken === "default" || locToken === "" ? null : locToken;
        return { parentBase, prop, kind: "locale", locale: loc };
      }
      if (isLast) {
        return { parentBase, prop, kind: "property" };
      }
      // Descend.
      cur = (cur as any)[prop.name];
      if (cur === undefined || cur === null) {
        throw new PointerError(
          "PATH_NOT_FOUND",
          `property "${prop.name}" is not set; cannot descend into "${tokens.slice(i + 1).join("/")}"`
        );
      }
      continue;
    }

    if (Array.isArray(cur)) {
      if (!prop) {
        throw new PointerError("INVALID_TARGET", "array reached without an owning property");
      }
      const idx = parseArrayIndex(token, cur.length, isLast && allowAppend);
      if (idx === -1) {
        throw new PointerError(
          isLast ? "PATH_NOT_FOUND" : "INVALID_TARGET",
          `invalid array index "${token}" for property "${prop.name}"`
        );
      }
      if (isLast) {
        if (token === "-") {
          return { parentBase, prop, kind: "arrayAppend" };
        }
        // For `add` ops, an index equal to length means append-at-end too.
        if (idx === cur.length) {
          return { parentBase, prop, kind: "arrayAppend" };
        }
        return { parentBase, prop, kind: "arrayIndex", arrayIndex: idx };
      }
      if (idx >= cur.length) {
        throw new PointerError("PATH_NOT_FOUND", `array index out of range: ${token}`);
      }
      cur = cur[idx];
      continue;
    }

    // cur is a plain JSON value held inside a property without className.
    // Resolve the rest of the path as plain JSON and commit by reassigning the subtree.
    if (!prop) {
      throw new PointerError("INVALID_TARGET", "cannot descend into a value without an owning property");
    }
    return {
      parentBase,
      prop,
      kind: "plain",
      plainTokens: tokens.slice(i),
    };
  }
  // Unreachable: the loop returns on the last iteration.
  throw new PointerError("INVALID_PATH", "unreachable");
}

function getCurrentValueAt(root: Base, pointer: string): any {
  const resolved = resolvePath(root, pointer, false);
  return readResolved(resolved);
}

function readResolved(r: IResolvedPath): any {
  const value = (r.parentBase as any)[r.prop.name];
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
      const arr = value as any[];
      const item = arr[r.arrayIndex!];
      return item instanceof Base ? snapshotBase(item, r.prop) : fjpDeepClone(item);
    }
    case "arrayAppend":
      return undefined;
    case "locale": {
      const ls = r.parentBase.getLocalizableString(r.prop.name);
      return ls ? (ls.getLocaleText(r.locale as any) || undefined) : undefined;
    }
    case "plain": {
      const pointer = tokensToPointer(r.plainTokens!);
      const v = fjpGetValueByPointer(value, pointer);
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

function createItemForArrayProperty(prop: JsonObjectProperty, value: any): any {
  // Polymorphic arrays (baseClassName set) use the item's `type`; otherwise prop.className.
  let className: string | undefined = prop.className;
  if (value !== null && typeof value === "object" && value.type) {
    className = value.type;
  }
  if (!className) {
    // Primitive array - just return the raw value (e.g., array of strings).
    return fjpDeepClone(value);
  }
  className = className.toLowerCase();
  const classNamePart = (prop as any).classNamePart as string | undefined;
  if (classNamePart && className.indexOf(classNamePart) < 0) {
    className += classNamePart;
  }
  const instance = Serializer.createClass(className, value);
  if (!instance) {
    // Fallback to primitive value if class is unknown.
    return fjpDeepClone(value);
  }
  if (value !== null && typeof value === "object") {
    new JsonObject().toObjectCore(value, instance);
  }
  return instance;
}

function createNestedBaseForProperty(prop: JsonObjectProperty, value: any): any {
  if (!prop.className) return fjpDeepClone(value);
  if (value === null || value === undefined) return value;
  const instance = Serializer.createClass(prop.className.toLowerCase(), value);
  if (!instance) return fjpDeepClone(value);
  if (typeof value === "object") {
    new JsonObject().toObjectCore(value, instance);
  }
  return instance;
}

function setWholeLocalizable(parent: Base, prop: JsonObjectProperty, value: any): void {
  const ls = parent.getLocalizableString(prop.name);
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
    throw new PointerError(
      "INVALID_TARGET",
      `localizable leaf accepts only strings, got ${typeof value}`
    );
  }
  let ls = parent.getLocalizableString(prop.name);
  if (!ls) {
    // Initialize the underlying locString via the standard setter, then mutate.
    prop.setValue(parent, "", undefined as any);
    ls = parent.getLocalizableString(prop.name);
    if (!ls) {
      throw new PointerError(
        "INVALID_TARGET",
        `property "${prop.name}" is not localizable on this object`
      );
    }
  }
  ls.setLocaleText(loc as any, value as any);
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

function assertOpFields(op: JsonPatchOperation, fields: string[]): void {
  if (!op || typeof op !== "object") {
    throw new PointerError("INVALID_OP", "operation is not an object");
  }
  if (!op.op) throw new PointerError("INVALID_OP", "missing op field");
  if (typeof op.path !== "string") throw new PointerError("INVALID_OP", "missing path field");
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (!(f in op)) throw new PointerError("INVALID_OP", `missing "${f}" field`);
  }
}

function applyOpToModel(root: Base, op: JsonPatchOperation): void {
  switch(op.op) {
    case "add":
      assertOpFields(op, ["value"]);
      applyAddOrReplace(root, op.path, op.value, /*requireExisting*/ false);
      return;
    case "replace":
      assertOpFields(op, ["value"]);
      applyAddOrReplace(root, op.path, op.value, /*requireExisting*/ true);
      return;
    case "remove":
      assertOpFields(op, []);
      applyRemove(root, op.path);
      return;
    case "test": {
      assertOpFields(op, ["value"]);
      const current = getCurrentValueAt(root, op.path);
      if (!fjpAreEquals(current, op.value)) {
        throw new PointerError("TEST_FAILED", "test op value mismatch");
      }
      return;
    }
    case "move": {
      if (typeof op.from !== "string") {
        throw new PointerError("INVALID_OP", "missing from field");
      }
      if (op.path === op.from) return;
      if (isAncestorPath(op.from, op.path)) {
        throw new PointerError("INVALID_OP", "move: from must not be a prefix of path");
      }
      const value = getCurrentValueAt(root, op.from);
      applyRemove(root, op.from);
      applyAddOrReplace(root, op.path, value, false);
      return;
    }
    case "copy": {
      if (typeof op.from !== "string") {
        throw new PointerError("INVALID_OP", "missing from field");
      }
      const value = getCurrentValueAt(root, op.from);
      applyAddOrReplace(root, op.path, value, false);
      return;
    }
    default:
      throw new PointerError("INVALID_OP", `unknown op: ${(op && op.op) as any}`);
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
        const currentArr = (parentBase as any)[prop.name];
        if (!Array.isArray(currentArr)) {
          throw new PointerError("INVALID_TARGET", `array property "${prop.name}" is not initialized`);
        }
        const arrValue = Array.isArray(value) ? value : [];
        const items = arrValue.map(v => createItemForArrayProperty(prop, v));
        replaceArrayContents(currentArr, items);
        return;
      }
      if (prop.className) {
        const instance = createNestedBaseForProperty(prop, value);
        prop.setValue(parentBase, instance, undefined as any);
        return;
      }
      prop.setValue(parentBase, value, undefined as any);
      return;
    }
    case "arrayIndex": {
      const arr = (parentBase as any)[prop.name] as any[];
      const idx = resolved.arrayIndex!;
      if (requireExisting) {
        // replace: drop the existing item, splice in the new one.
        const item = createItemForArrayProperty(prop, value);
        arr.splice(idx, 1, item);
      } else {
        // add at index: insert.
        const item = createItemForArrayProperty(prop, value);
        arr.splice(idx, 0, item);
      }
      return;
    }
    case "arrayAppend": {
      if (requireExisting) {
        throw new PointerError("PATH_NOT_FOUND", "cannot replace a non-existent array slot");
      }
      const arr = (parentBase as any)[prop.name] as any[];
      const item = createItemForArrayProperty(prop, value);
      arr.push(item);
      return;
    }
    case "locale": {
      setLocaleOf(parentBase, prop, resolved.locale!, value);
      return;
    }
    case "plain": {
      // Read the subtree, mutate via fast-json-patch, write back. The single
      // setValue at the end fires property-change events on the owning Base.
      const current = (parentBase as any)[prop.name];
      const clone = current === undefined || current === null ? {} : fjpDeepClone(current);
      const subOp = {
        op: requireExisting ? "replace" : "add",
        path: tokensToPointer(resolved.plainTokens!),
        value,
      } as const;
      const next = applySubtreeOp(clone, subOp, requireExisting ? "replace" : "add");
      prop.setValue(parentBase, next, undefined as any);
      return;
    }
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
        const currentArr = (parentBase as any)[prop.name];
        if (Array.isArray(currentArr) && currentArr.length > 0) {
          currentArr.splice(0, currentArr.length);
        }
        return;
      }
      const def = prop.getDefaultValue(parentBase);
      prop.setValue(parentBase, def, undefined as any);
      return;
    }
    case "arrayIndex": {
      const arr = (parentBase as any)[prop.name] as any[];
      arr.splice(resolved.arrayIndex!, 1);
      return;
    }
    case "arrayAppend":
      throw new PointerError("PATH_NOT_FOUND", "cannot remove from the end of an array using '-'");
    case "locale": {
      const ls = parentBase.getLocalizableString(prop.name);
      if (ls) ls.setLocaleText(resolved.locale as any, undefined as any);
      return;
    }
    case "plain": {
      const current = (parentBase as any)[prop.name];
      if (current === undefined || current === null) {
        throw new PointerError("PATH_NOT_FOUND", "cannot remove from undefined subtree");
      }
      const clone = fjpDeepClone(current);
      const subOp = { op: "remove" as const, path: tokensToPointer(resolved.plainTokens!) };
      const next = applySubtreeOp(clone, subOp, "remove");
      prop.setValue(parentBase, next, undefined as any);
      return;
    }
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
    const res = fjpApplyOperation(doc, op as any, true, true);
    return res.newDocument;
  } catch(e: any) {
    throw new PointerError(mapFjpReason(e?.name), e?.message || `subtree ${kind} failed`);
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
  patches: JsonPatchOperation[],
  validateFirst?: boolean
): void {
  if (!root) throw new JsonPatchError("INVALID_TARGET", -1, null as any, "root is null");
  if (!Array.isArray(patches)) {
    throw new JsonPatchError("INVALID_OP", -1, null as any, "patches must be an array");
  }
  if (patches.length === 0) return;

  if (validateFirst) {
    const snapshot = (root as any).toJSON ? (root as any).toJSON() : {};
    runDryRun(snapshot, patches);
  }

  for (let i = 0; i < patches.length; i++) {
    const op = patches[i];
    try {
      applyOpToModel(root, op);
    } catch(e) {
      if (e instanceof PointerError) {
        throw new JsonPatchError(e.reason, i, op, e.message);
      }
      if (e instanceof JsonPatchError) {
        throw e;
      }
      throw e;
    }
  }
}
