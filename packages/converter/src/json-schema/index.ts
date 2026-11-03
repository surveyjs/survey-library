// JSON Schema (family) -> SurveyJS converter.
//
// The data schema is JSON Schema and is common across the family. Presentation
// diverges and is LAYERED on top of the same data walk:
//   - JSONForms UI Schema  -> highest fidelity, done first
//   - RJSF `uiSchema`      -> widget hints / ordering, partial
//   - Uniforms             -> no layout data; flat form from the data schema only
//
// `convert(input)` accepts either a bare JSON Schema or a `{ schema, uiSchema }`
// envelope (see `normalizeInput`). It never throws on a construct it cannot map
// -- every such case goes to the report. It throws only when the input is not a
// JSON Schema at all (see `normalizeInput`, the entire throwing surface).
//
// "Free via JSON Schema" cases (OpenAPI 3.1 request bodies, Zod/Yup/TypeBox
// bridges, ngx-formly JSON Schema mode, ...) are documentation only -- anything
// that emits JSON Schema already converts here.
//
// SETTLED MODELLING DECISIONS (do not re-open in review).
// JSON Schema under-specifies layout; these resolve that once, at the mapping site:
//
//   * if/then/else -> `visibleIf`/`requiredIf` on the AFFECTED QUESTIONS (the
//     finest granularity that round-trips). The condition is computed from the
//     `if` subschema (`properties[k].const`/`enum`). `then` properties get
//     `visibleIf: <cond>`; `then.required` -> `requiredIf: <cond>`; `else` gets
//     the negated condition. When the `if` cannot be expressed as a SurveyJS
//     expression we do NOT guess a branch -> ASSUMED_IF_THEN_ELSE, questions
//     stay visible.
//
//   * oneOf + discriminator: a discriminated `oneOf` (explicit OpenAPI
//     `discriminator`, or a property carrying a `const` in every branch) becomes
//     a discriminator selector question plus one PANEL per variant (nested) or
//     one PAGE per variant (top level), each gated by `visibleIf` on the
//     discriminator const. Inferred (no explicit `discriminator`) ->
//     ASSUMED_ONEOF_DISCRIMINATOR. A non-discriminated `oneOf`/`anyOf` of
//     `const`s is just a `choices` set -- not over-modelled.
//
//   * dependencies / dependentRequired / dependentSchemas: a PROPERTY dependency
//     ({trigger present} -> other props required) becomes `requiredIf:
//     "{trigger} notempty"` on the dependents; a SCHEMA dependency is modelled
//     like if/then keyed on `{trigger} notempty`. Both emit ASSUMED_DEPENDENCIES
//     (the target granularity is inferred).
//
//   * Under a JSONForms UI schema, if/then/else and dependencies give `requiredIf` only, never
//     `visibleIf`, and create no question: JSONForms shows and hides only by
//     `rule`, and reads schema conditionals only to validate. The root schema's
//     are read after the UI walk, on the Controls that name each property.
//
//   * allOf: shallow-merge each subschema's `properties`/`required` into the
//     parent before walking (we build a form, not a validator). A genuine
//     conflict (same key, incompatible `type`) keeps the FIRST and emits
//     ASSUMED_ALLOF_MERGE.
//
//   * $ref: LOCAL refs (`#/definitions/...`, `#/$defs/...`, `#/properties/...`)
//     are resolved. REMOTE refs (`http(s)://...`, or a `$ref` into another doc)
//     are out of scope for a client-side converter -> DROPPED_REMOTE_REF and the
//     referencing property is emitted as a bare `text` so the form still builds.
//
//   * Uniforms has no serializable layout: its ceiling is a flat form from the
//     data schema. Stated here, not spammed per field.

import { ConversionResult, ReportBuilder } from "../report";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { SurveyJSON, SurveyJSONElement, SurveyJSONPage } from "../types";
import { formatLiteral } from "../expression";
import { JsonSchemaCodes } from "./codes";

const SOURCE = "json-schema";

type JsonValue = unknown;

interface JsonSchemaDoc {
  type?: string | string[];
  title?: string;
  description?: string;
  default?: JsonValue;
  properties?: Record<string, JsonSchemaDoc>;
  required?: string[];
  items?: JsonSchemaDoc;
  enum?: JsonValue[];
  const?: JsonValue;
  format?: string;
  readOnly?: boolean;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean; // a boolean flag on `minimum` in draft-04
  exclusiveMaximum?: number | boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  $ref?: string;
  allOf?: JsonSchemaDoc[];
  oneOf?: JsonSchemaDoc[];
  anyOf?: JsonSchemaDoc[];
  if?: JsonSchemaDoc;
  then?: JsonSchemaDoc;
  else?: JsonSchemaDoc;
  dependencies?: Record<string, string[] | JsonSchemaDoc>;
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, JsonSchemaDoc>;
  discriminator?: { propertyName?: string };
  definitions?: Record<string, JsonSchemaDoc>;
  $defs?: Record<string, JsonSchemaDoc>;
  [key: string]: unknown;
}

/** Optional presentation layer paired with the data schema. */
export interface JsonSchemaInput {
  /** The JSON Schema data document (required). */
  schema: JsonSchemaDoc;
  /** JSONForms UI Schema, RJSF uiSchema, etc. Optional; flat form without it. */
  uiSchema?: unknown;
}

function isSchemaLike(value: unknown): value is JsonSchemaDoc {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const s = value as JsonSchemaDoc;
  // A JSON Schema object schema declares `properties`, or `type`, or a
  // composition keyword. Enough to reject a Form.io form (`components`) or a
  // SurveyJS survey (`pages`).
  return (
    typeof s.properties === "object" ||
    typeof s.type === "string" ||
    Array.isArray(s.type) ||
    Array.isArray(s.allOf) ||
    Array.isArray(s.oneOf) ||
    Array.isArray(s.anyOf) ||
    typeof s.$ref === "string"
  );
}

function normalizeInput(input: unknown): JsonSchemaInput {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new UnparseableInputError("JSON Schema input must be a JSON object.");
  }
  // A Form.io form (top-level `components` array) is the sibling format -- steer
  // the caller loudly rather than silently mis-walking it.
  if (Array.isArray((input as { components?: unknown }).components)) {
    throw new WrongFormatError(
      "Input looks like a Form.io form (top-level `components` array). " +
        "Use survey-converter/formio."
    );
  }
  // Accept either a bare schema or a { schema, uiSchema } envelope.
  const maybeEnvelope = input as JsonSchemaInput;
  const isEnvelope = isSchemaLike(maybeEnvelope.schema);
  const schema = isEnvelope ? maybeEnvelope.schema : (input as JsonSchemaDoc);
  if (!isSchemaLike(schema)) {
    throw new WrongFormatError(
      "Input does not look like a JSON Schema (no `properties`, `type`, or composition keyword). " +
        "If this is a Form.io form, use survey-converter/formio."
    );
  }
  return { schema, uiSchema: isEnvelope ? maybeEnvelope.uiSchema : undefined };
}

// --- format -> text inputType ----------------------------------------------
const FORMAT_INPUT_TYPE: Record<string, string> = {
  date: "date",
  "date-time": "datetime-local",
  time: "time",
  email: "email",
  "idn-email": "email",
  uri: "url",
  iri: "url",
  "uri-reference": "url"
};

// A UI kind: which presentation vocabulary the uiSchema speaks.
type UiKind = "jsonforms" | "rjsf" | "none";

// JSONForms layout/control node types.
const JSONFORMS_TYPES = new Set([
  "VerticalLayout",
  "HorizontalLayout",
  "Group",
  "Categorization",
  "Category",
  "Control",
  "ListWithDetail",
  "Label"
]);

/** Refinements a UI layer contributes to a single question. */
interface UiHint {
  widget?: string;
  format?: string;
  multi?: boolean;
  hidden?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  // JSONForms `options.detail` as a layout: builds an array's item template, or an object's panel
  // elements, in place of the default walk of the items or object schema.
  template?: (schema: JsonSchemaDoc, targetPath: string) => SurveyJSONElement[];
  // RJSF `ui:disabled` / `ui:readonly`.
  readOnly?: boolean;
  // RJSF: where `widget` came from, for a report on a widget the converter does not honour.
  widgetPtr?: string;
  // RJSF: the uiSchema node the hint was read from. An object's properties and an array's
  // `items` read their own nodes from it.
  ui?: RjsfNode;
  // RJSF `inputType`: a `text` question's input type.
  inputType?: string;
  // RJSF `addable` / `removable` when `false`, with the pointers to report where no dynamic panel
  // takes them.
  addable?: boolean;
  removable?: boolean;
  // RJSF `enumNames` (an array by index, an object by value) and `enumDisabled` (values).
  enumNames?: unknown[] | Record<string, unknown>;
  enumDisabled?: unknown[];
  // RJSF `help`: the description when the field has none; `helpPtr` is set once, to report it
  // where it cannot be used.
  help?: string;
  // RJSF options read but not yet applied, by name, with their pointers. The place that applies one
  // takes it out; `mapProperty` reports what is left, so no key is dropped without a report entry.
  pending?: Map<string, string>;
}

// The option `name` was applied.
function consumeOption(hint: UiHint, name: string): void {
  hint.pending?.delete(name);
}

// Report the options of `hint` no question took.
function reportPending(hint: UiHint, ctx: Ctx): void {
  if (!hint.pending) return;
  for (const ptr of hint.pending.values()) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, ptr, "");
  hint.pending.clear();
}

// An RJSF uiSchema node and its pointer in the input (`#/uiSchema/address/street`).
interface RjsfNode {
  node: Record<string, unknown>;
  ptr: string;
}

interface Ctx {
  report: ReportBuilder;
  usedNames: Set<string>;
  // JSONForms: every property name in the document, lower-cased, which a page or panel the UI
  // schema names does not take, so that the question made for the property keeps its name.
  reservedNames: Set<string>;
  uiKind: UiKind;
  // The source pointers a remote `$ref` was reported at.
  remoteRefs: Set<string>;
  root: JsonSchemaDoc;
  // JSONForms: the frame scopes resolve in, and the rules waiting for the end of the walk.
  uiFrame: UiFrame;
  uiRules: UiRuleRecord[];
  // For each panel an object's data walk made, the question made for each property. JSONForms reads
  // it to put the fields of an object Control in the scope map.
  objectFields: WeakMap<SurveyJSONElement, Map<string, SurveyJSONElement>>;
  // RJSF: uiSchema nodes whose keys were reported, so a node read twice (a property shared by
  // `oneOf` variants) reports once.
  reportedUi: Set<string>;
  // The document's `$id` declarations, indexed on the first non-local `$ref`.
  ids?: IdIndex;
}

// --- $ref resolution --------------------------------------------------------

/** Navigate a local JSON Pointer (`#/a/b`) against the root document. */
function resolvePointer(root: JsonSchemaDoc, ref: string): JsonSchemaDoc | undefined {
  const path = ref.replace(/^#/, "");
  if (path === "") return root;
  const parts = path.split("/").filter((p) => p.length > 0).map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
  let node: unknown = root;
  for (const part of parts) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node && typeof node === "object" ? (node as JsonSchemaDoc) : undefined;
}

// Resolve `$ref` chains. A `#` ref is a JSON Pointer into the root. Any other ref is looked up
// among the document's `$id` declarations (a bundled schema), against the base URI it sits under,
// and followed by the pointer in its fragment, if any. A ref no `$id` declares is remote, out of
// scope for a client-side converter -> `{ remote: true }`. A cycle or a dangling ref gives an
// empty schema. Returns the effective schema otherwise.
function resolveRef(schema: JsonSchemaDoc, ctx: Ctx): { schema: JsonSchemaDoc, remote?: boolean } {
  let s = schema;
  const seen = new Set<string>();
  while(s && typeof s.$ref === "string") {
    const ref = s.$ref;
    let key = ref;
    let target: JsonSchemaDoc | undefined;
    if (ref.startsWith("#")) {
      target = resolvePointer(ctx.root, ref);
    } else {
      // A bundled document declares the resource a URI names with `$id`, so the ref is local.
      const bundled = resolveBundledRef(s, ref, ctx);
      if (!bundled) return { schema: s, remote: true };
      key = bundled.uri;
      target = bundled.schema;
    }
    if (seen.has(key)) return { schema: {} }; // direct cycle
    seen.add(key);
    if (!target) return { schema: {} }; // dangling local ref
    s = target;
  }
  return { schema: s ?? {} };
}

// Report a remote `$ref` at `sourcePtr`, and remember the pointer for a later read of the same
// schema that must not report it again.
function reportRemoteRef(sourcePtr: string, targetPath: string, ctx: Ctx): void {
  ctx.remoteRefs.add(sourcePtr);
  ctx.report.dropped(JsonSchemaCodes.DROPPED_REMOTE_REF, sourcePtr, targetPath);
}

// --- bundled `$id` resources ----------------------------------------------------

// Every `$id` in a document, resolved against the base URI it is declared under, and the base URI
// of every schema object, so that a relative `$ref` resolves against the resource it sits in.
interface IdIndex {
  byUri: Map<string, JsonSchemaDoc>;
  base: Map<object, string>;
}

// Keywords whose values are data, not schemas: an `$id` inside them declares nothing.
const DATA_KEYWORDS = new Set(["enum", "const", "default", "examples"]);

function buildIdIndex(root: JsonSchemaDoc): IdIndex {
  const byUri = new Map<string, JsonSchemaDoc>();
  const base = new Map<object, string>();
  const seen = new Set<object>();
  const visit = (node: unknown, parentBase: string): void => {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const child of node) visit(child, parentBase);
      return;
    }
    let own = parentBase;
    const id = (node as JsonSchemaDoc).$id;
    // An `$id` starting with `#` is a draft-06 anchor, not a resource.
    if (typeof id === "string" && id.length > 0 && !id.startsWith("#")) {
      own = resolveUri(id, parentBase).replace(/#$/, "");
      if (!byUri.has(own)) byUri.set(own, node as JsonSchemaDoc);
    }
    base.set(node, own);
    for (const [key, value] of Object.entries(node)) {
      if (!DATA_KEYWORDS.has(key)) visit(value, own);
    }
  };
  visit(root, "");
  return { byUri, base };
}

// `ref` resolved against `base`. A relative ref with no absolute base stays as written.
function resolveUri(ref: string, base: string): string {
  try {
    return new URL(ref, base.length > 0 ? base : undefined).href;
  } catch{
    return ref;
  }
}

// The schema a non-local `$ref` names in this document: an `$id` match, then the JSON Pointer in its
// fragment, if any. `undefined` when no `$id` matches, or the fragment is not a pointer.
function resolveBundledRef(node: JsonSchemaDoc, ref: string, ctx: Ctx): { schema: JsonSchemaDoc | undefined, uri: string } | undefined {
  ctx.ids ??= buildIdIndex(ctx.root);
  const base = ctx.ids.base.get(node) ?? ctx.ids.base.get(ctx.root) ?? "";
  const uri = resolveUri(ref, base);
  const hashAt = uri.indexOf("#");
  const resource = ctx.ids.byUri.get(hashAt < 0 ? uri : uri.slice(0, hashAt));
  if (!resource) return undefined;
  const fragment = hashAt < 0 ? "" : uri.slice(hashAt + 1);
  if (fragment === "") return { schema: resource, uri };
  if (!fragment.startsWith("/")) return undefined;
  let pointer = fragment;
  try {
    pointer = decodeURIComponent(fragment);
  } catch{
    // keep the fragment as written
  }
  return { schema: resolvePointer(resource, `#${pointer}`), uri };
}

// --- allOf merge ------------------------------------------------------------

/**
 * Shallow-merge `allOf` subschemas' `properties`/`required` (and scalar
 * keywords) into a copy of the parent. On a genuine per-property conflict (same
 * key, incompatible `type`) the first wins and we flag ASSUMED_ALLOF_MERGE. We
 * deliberately do NOT implement full allOf validation semantics -- we build a
 * form, not a validator.
 */
function mergeAllOf(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): JsonSchemaDoc {
  if (!Array.isArray(schema.allOf) || schema.allOf.length === 0) return schema;
  const merged: JsonSchemaDoc = { ...schema };
  delete merged.allOf;
  const props: Record<string, JsonSchemaDoc> = { ...(schema.properties ?? {}) };
  const required = new Set<string>(schema.required ?? []);
  let hasProperties = schema.properties !== undefined;

  schema.allOf.forEach((sub, i) => {
    const resolved = resolveRef(sub, ctx);
    if (resolved.remote) {
      reportRemoteRef(`${sourcePtr}/allOf/${i}`, "", ctx);
      return;
    }
    const part = mergeAllOf(resolved.schema, `${sourcePtr}/allOf/${i}`, ctx);
    for (const [k, v] of Object.entries(part.properties ?? {})) {
      const existing = props[k];
      if (existing && typesConflict(existing, v)) {
        ctx.report.assumed(JsonSchemaCodes.ASSUMED_ALLOF_MERGE, `${sourcePtr}/allOf/${i}/properties/${k}`, "");
        continue; // keep the first
      }
      props[k] = existing ? { ...v, ...existing } : v;
    }
    if (part.properties !== undefined) hasProperties = true;
    for (const r of part.required ?? []) required.add(r);
    // Carry through composition keywords a subschema may add, and the scalar keywords (`type`,
    // `format`, bounds, `title`, ...) the parent does not set: the first subschema that sets one wins.
    for (const [key, value] of Object.entries(part)) {
      if (!ALLOF_NOT_MERGED.has(key) && merged[key] === undefined && value !== undefined) (merged as Record<string, unknown>)[key] = value;
    }
  });

  // A merge with no `properties` anywhere stays a scalar schema, not an empty object.
  if (hasProperties) merged.properties = props;
  if (required.size > 0) merged.required = [...required];
  return merged;
}

// Keywords an `allOf` subschema does not copy onto the parent: merged above, a resource's own
// identity and definitions, or `anyOf`, which the walk does not model.
const ALLOF_NOT_MERGED = new Set(["properties", "required", "allOf", "anyOf", "$ref", "$id", "$schema", "$defs", "definitions"]);

function typesConflict(a: JsonSchemaDoc, b: JsonSchemaDoc): boolean {
  const ta = effectiveType(a);
  const tb = effectiveType(b);
  return ta !== undefined && tb !== undefined && ta !== tb;
}

// --- type detection & choices ----------------------------------------------

/** The effective SurveyJS-relevant type of a schema, ignoring `"null"`. */
function effectiveType(s: JsonSchemaDoc): string | undefined {
  let t = s.type;
  if (Array.isArray(t)) t = t.find((x) => x !== "null");
  if (typeof t === "string") return t;
  if (s.properties) return "object";
  if (s.items) return "array";
  if (Array.isArray(s.enum) || hasConstComposition(s)) return "string";
  return undefined;
}

function hasConstComposition(s: JsonSchemaDoc): boolean {
  const branches = s.oneOf ?? s.anyOf;
  return Array.isArray(branches) && branches.length > 0 && branches.every((b) => b && typeof b === "object" && "const" in b);
}

// An RJSF `enumNames` entry for the enum value at `index`: an array is read by index, an object by
// the value.
function enumName(names: UiHint["enumNames"], value: unknown, index: number): string | undefined {
  const key = String(value);
  const name = Array.isArray(names) ? names[index]
    : names && typeof value !== "object" && Object.prototype.hasOwnProperty.call(names, key) ? names[key] : undefined;
  return name === undefined || name === null ? undefined : String(name);
}

/** SurveyJS `choices` from `enum` or an `oneOf`/`anyOf` of `const`s. */
function readChoices(schema: JsonSchemaDoc, hint?: UiHint): { value: unknown, text?: string, enableIf?: string }[] | undefined {
  let choices: { value: unknown, text?: string, enableIf?: string }[] | undefined;
  if (Array.isArray(schema.enum)) {
    // A null is no choice, but still takes its place in `enumNames`' indexes.
    choices = [];
    schema.enum.forEach((v, i) => {
      if (v === null) return;
      const text = enumName(hint?.enumNames, v, i);
      choices!.push(text !== undefined ? { value: v, text } : { value: v });
    });
    if (hint?.enumNames) consumeOption(hint, "enumNames");
  } else {
    const branches = schema.oneOf ?? schema.anyOf;
    if (Array.isArray(branches) && branches.every((b) => b && typeof b === "object" && "const" in b)) {
      choices = branches.map((b) => {
        const c = (b as JsonSchemaDoc).const;
        const title = (b as JsonSchemaDoc).title;
        return title !== undefined ? { value: c, text: String(title) } : { value: c };
      });
    }
  }
  // A disabled choice stays in the list and cannot be picked.
  if (choices && hint?.enumDisabled) {
    for (const choice of choices) if (hint.enumDisabled.includes(choice.value)) choice.enableIf = "false";
    consumeOption(hint, "enumDisabled");
  }
  return choices;
}

// --- expression helpers -----------------------------------------------------

function combineAnd(existing: string | undefined, cond: string): string {
  return existing ? `(${existing}) and (${cond})` : cond;
}

/**
 * Build positive and negated SurveyJS expressions from an `if` subschema. Only
 * the provable subset is handled (`properties[k].const` and `properties[k].enum`,
 * ANDed across keys). Returns `undefined` when the `if` cannot be expressed --
 * the caller then flags ASSUMED_IF_THEN_ELSE instead of guessing a branch.
 */
function ifToExpression(ifSchema: JsonSchemaDoc, fields: ObjectFields): { pos: string, neg: string } | undefined {
  const props = ifSchema.properties;
  if (!props || Object.keys(props).length === 0) return undefined;
  const pos: string[] = [];
  const neg: string[] = [];
  for (const [k, cond] of Object.entries(props)) {
    // A property with no question has nothing to read, and a value that cannot be written as a
    // literal cannot be compared: either makes the whole `if` inexpressible.
    const ref = fields.ref(k);
    if (ref === undefined) return undefined;
    if (cond && cond.const !== undefined) {
      const lit = formatLiteral(cond.const);
      if (lit === undefined) return undefined;
      pos.push(`${ref} = ${lit}`);
      neg.push(`${ref} <> ${lit}`);
    } else if (cond && Array.isArray(cond.enum)) {
      const lits = cond.enum.map((v) => formatLiteral(v));
      if (lits.some((lit) => lit === undefined)) return undefined;
      pos.push("(" + lits.map((lit) => `${ref} = ${lit}`).join(" or ") + ")");
      neg.push("(" + lits.map((lit) => `${ref} <> ${lit}`).join(" and ") + ")");
    } else {
      return undefined;
    }
  }
  return { pos: pos.join(" and "), neg: neg.join(" or ") };
}

// --- object walk ------------------------------------------------------------

interface WalkState {
  elements: SurveyJSONElement[];
  byProp: Map<string, SurveyJSONElement>;
  // How an expression in this object names its questions: empty at the top, `panel.` inside an
  // array's item template, where a question is read from its own row.
  refPrefix: string;
  // RJSF: this object's uiSchema node, for questions a branch creates.
  ui?: RjsfNode;
}

// The expression reference to the question made from property `key` of this object. It uses the
// question's output name, which `uniqueName` may have changed, and is `undefined` when the
// property has no question.
function questionRef(key: string, state: WalkState): string | undefined {
  const el = state.byProp.get(key);
  return el ? `{${state.refPrefix}${el.name}}` : undefined;
}

// The questions of one object that its schema conditionals (`if`/`then`/`else`, dependencies) read
// and mark, by property key.
interface ObjectFields {
  // The expression reference to the question holding the property's value.
  ref(key: string): string | undefined;
  // The elements made for the property, which a branch's `required` marks.
  elements(key: string): SurveyJSONElement[];
  // The element a branch's property shows, made when the object does not declare the property.
  // Absent under JSONForms, which renders what its UI schema names and reads schema conditionals
  // only to validate: a branch there gives `requiredIf` only.
  shown?(key: string, sub: JsonSchemaDoc, sourcePtr: string): SurveyJSONElement | undefined;
}

// The data walk's fields of an object: the questions in `state`.
function walkFields(state: WalkState, targetPath: string, ctx: Ctx, depth: number): ObjectFields {
  const fields: ObjectFields = {
    ref: (key) => questionRef(key, state),
    elements: (key) => {
      const el = state.byProp.get(key);
      return el ? [el] : [];
    }
  };
  if (ctx.uiKind === "jsonforms") return fields;
  fields.shown = (key, sub, sourcePtr) => {
    let el = state.byProp.get(key);
    if (!el) {
      // Branch introduces a property not in the base object -- materialise it.
      const created = mapProperty(key, sub, sourcePtr, `${targetPath}[${state.elements.length}]`, ctx, false, rjsfHint(childUi(state.ui, key), ctx), depth, state.refPrefix);
      if (!created) return undefined;
      el = created;
      state.elements.push(el);
      state.byProp.set(key, el);
    }
    return el;
  };
  return fields;
}

/**
 * Walk an object schema's `properties` (plus its composition keywords) into a
 * flat list of SurveyJS elements. `rjsfUi` is the object's RJSF uiSchema node:
 * its `order`, and one node per property (none for JSONForms / bare schemas).
 */
function walkObject(
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  rjsfUi: RjsfNode | undefined,
  depth: number,
  refPrefix = ""
): SurveyJSONElement[] {
  return walkObjectState(schema, sourcePtr, targetPath, ctx, rjsfUi, depth, refPrefix).elements;
}

// `walkObject`, returning the walk's state: its elements and the question made for each property.
function walkObjectState(
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  rjsfUi: RjsfNode | undefined,
  depth: number,
  refPrefix: string
): WalkState {
  const merged = mergeAllOf(schema, sourcePtr, ctx);
  const state: WalkState = { elements: [], byProp: new Map(), refPrefix, ui: rjsfUi };
  const requiredSet = new Set(merged.required ?? []);
  const order = orderKeys(Object.keys(merged.properties ?? {}), rjsfUi ? rjsfOptions(rjsfUi).options.get("order")?.value : undefined);

  for (const key of order) {
    const sub = merged.properties![key];
    const hint = rjsfHint(childUi(rjsfUi, key), ctx);
    const el = mapProperty(key, sub, `${sourcePtr}/properties/${key}`, `${targetPath}[${state.elements.length}]`, ctx, requiredSet.has(key), hint, depth, refPrefix);
    if (el) {
      state.elements.push(el);
      state.byProp.set(key, el);
    }
  }

  const fields = walkFields(state, targetPath, ctx, depth);
  applyIfThenElse(merged, sourcePtr, ctx, fields);
  applyDependencies(merged, sourcePtr, ctx, fields);
  appendOneOfVariants(merged, sourcePtr, targetPath, ctx, state, "panel", depth);

  return state;
}

/** RJSF `ui:order` reordering; unlisted keys fill the `"*"` slot (or append). */
function orderKeys(keys: string[], order: unknown): string[] {
  if (!Array.isArray(order)) return keys;
  const listed = order.filter((k): k is string => typeof k === "string" && k !== "*");
  const rest = keys.filter((k) => !listed.includes(k));
  const out: string[] = [];
  let restInserted = false;
  for (const k of order) {
    if (k === "*") {
      out.push(...rest);
      restInserted = true;
    } else if (typeof k === "string" && keys.includes(k)) {
      out.push(k);
    }
  }
  if (!restInserted) out.push(...rest);
  // Guard against a partial ui:order dropping keys.
  for (const k of keys) if (!out.includes(k)) out.push(k);
  return out;
}

/**
 * Map a single property subschema to a SurveyJS element (or `null` when nothing
 * is produced). `sourcePtr` points into the source; `targetPath` is where the
 * node will live in the output.
 */
function mapProperty(
  name: string,
  rawSchema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  required: boolean,
  hint: UiHint,
  depth: number,
  refPrefix = ""
): SurveyJSONElement | null {
  const el = mapPropertyOptions(name, rawSchema, sourcePtr, targetPath, ctx, required, hint, depth, refPrefix);
  reportPending(hint, ctx);
  return el;
}

function mapPropertyOptions(
  name: string,
  rawSchema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  required: boolean,
  hint: UiHint,
  depth: number,
  refPrefix = ""
): SurveyJSONElement | null {
  const resolved = resolveRef(rawSchema, ctx);
  if (resolved.remote) {
    // Client-side converter does not fetch -- emit a bare text so the form still
    // builds, and raise the drop alarm.
    reportRemoteRef(sourcePtr, targetPath, ctx);
    const el: SurveyJSONElement = { type: "text", name: uniqueName(name, ctx) };
    applyTitleDesc(rawSchema, el, hint, ctx);
    if (required) el.isRequired = true;
    return el;
  }
  if (depth > MAX_DEPTH) {
    // Recursive schema guard -- collapse to a bare text rather than loop.
    ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, sourcePtr, targetPath);
    return { type: "text", name: uniqueName(name, ctx) };
  }
  const schema = mergeAllOf(resolved.schema, sourcePtr, ctx);
  const type = effectiveType(schema);

  // Nested object -> panel (recurse). A discriminated oneOf inside is handled by
  // the recursive walkObject.
  if (type === "object" || (type === undefined && schema.properties)) {
    return mapObjectPanel(name, schema, sourcePtr, targetPath, ctx, required, depth, refPrefix, hint);
  }
  if (type === "array") {
    return mapArray(name, schema, sourcePtr, targetPath, ctx, required, hint, depth);
  }

  const qname = uniqueName(name, ctx);
  let el: SurveyJSONElement;
  const choices = readChoices(schema, hint);
  checkWidget(hint, type === "boolean" ? "boolean" : choices ? "enum" : "scalar", ctx);

  // A hidden widget keeps the question's real type; `hint.hidden` hides it below.
  if (type === "boolean") {
    el = { type: "boolean", name: qname };
  } else if ((type === "integer" || type === "number") && !choices) {
    el = { type: "text", name: qname, inputType: "number" };
  } else if (choices) {
    // string + enum / oneOf-const -> single-select. dropdown by default;
    // radiogroup when a UI hint asks for it.
    const wantRadio = hint.widget === "radio" || hint.format === "radio";
    el = { type: wantRadio ? "radiogroup" : "dropdown", name: qname, choices };
  } else if (hint.widget === "textarea" || (hint.multi === true && (type === "string" || type === undefined))) {
    // JSONForms `options.multi` on a string means a multi-line input.
    el = { type: "comment", name: qname };
  } else {
    // string (or untyped scalar) -> text, refined by format / widget inputType.
    el = { type: "text", name: qname };
    const inputType = hint.inputType ?? textInputType(schema, hint);
    if (inputType) el.inputType = inputType;
    if (hint.inputType) consumeOption(hint, "inputType");
  }

  applyTitleDesc(schema, el, hint, ctx);
  applyScalarMeta(schema, el, required, ctx, sourcePtr);
  if (hint.hidden) el.visible = false;
  if (schema.readOnly || hint.readOnly) el.readOnly = true;
  return el;
}

/** Pick a `text` `inputType` from `format` (data schema) or a UI widget hint. */
function textInputType(schema: JsonSchemaDoc, hint: UiHint): string | undefined {
  if (hint.widget && WIDGET_INPUT_TYPE[hint.widget]) return WIDGET_INPUT_TYPE[hint.widget];
  if (typeof schema.format === "string" && FORMAT_INPUT_TYPE[schema.format]) return FORMAT_INPUT_TYPE[schema.format];
  return undefined;
}

// RJSF `ui:widget` values that refine a `text` question's inputType.
const WIDGET_INPUT_TYPE: Record<string, string> = {
  password: "password",
  email: "email",
  url: "url",
  color: "color",
  date: "date",
  "date-time": "datetime-local",
  "datetime-local": "datetime-local",
  time: "time",
  updown: "number",
  range: "number",
  // RJSF's dropdown date pickers store the same values as `date` and `date-time`.
  "alt-date": "date",
  "alt-datetime": "datetime-local"
};

// RJSF `ui:widget` values the converter honours, whatever the field. `corpus/lib.mjs`
// (`HANDLED_UI_WIDGETS`) mirrors this set.
const HANDLED_WIDGETS = new Set([...Object.keys(WIDGET_INPUT_TYPE), "hidden", "radio", "textarea", "tagbox"]);

// Report a widget the converter does not honour. A widget that restates RJSF's default for the
// field is honoured too: `checkboxes` on an enum array, `checkbox` on a boolean, `select` on a
// single-choice enum.
function checkWidget(hint: UiHint, kind: "boolean" | "enum" | "scalar" | "array-enum" | "array" | "object", ctx: Ctx): void {
  const widget = hint.widget;
  if (widget === undefined || hint.widgetPtr === undefined || HANDLED_WIDGETS.has(widget)) return;
  if ((widget === "checkboxes" && kind === "array-enum") || (widget === "checkbox" && kind === "boolean")
    || (widget === "select" && kind === "enum")) return;
  ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, hint.widgetPtr, "");
}

// Map an object schema to a SurveyJS `panel`, recursing into its properties. A static panel inside
// an item template shares the row, so its questions keep the template's reference prefix. An RJSF
// hint gives the panel its title, description, hidden and read-only state, and its node holds the
// properties' own nodes and `order`. A JSONForms detail layout (`hint.template`) gives the panel's
// elements instead; JSONForms renders that layout alone, with no label of the object's.
function mapObjectPanel(
  name: string,
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  required: boolean,
  depth: number,
  refPrefix: string,
  hint: UiHint
): SurveyJSONElement {
  const panel: SurveyJSONElement = { type: "panel", name: uniqueName(name, ctx) };
  checkWidget(hint, "object", ctx);
  if (!hint.template) applyTitleDesc(schema, panel, hint, ctx);
  if (hint.hidden) panel.visible = false;
  if (hint.readOnly) panel.readOnly = true;
  let elements: SurveyJSONElement[];
  if (hint.template) {
    elements = hint.template(schema, `${targetPath}.elements`);
  } else {
    const state = walkObjectState(schema, sourcePtr, `${targetPath}.elements`, ctx, hint.ui, depth + 1, refPrefix);
    ctx.objectFields.set(panel, state.byProp);
    elements = state.elements;
  }
  if (elements.length > 0) panel.elements = elements;
  if (required) panel.isRequired = true;
  return panel;
}

/** Map an array schema: enum items -> checkbox/tagbox; object items -> paneldynamic. */
function mapArray(
  name: string,
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  required: boolean,
  hint: UiHint,
  depth: number
): SurveyJSONElement {
  const itemsResolved = schema.items ? resolveRef(schema.items, ctx) : { schema: {} as JsonSchemaDoc };
  const items = itemsResolved.remote ? {} : mergeAllOf(itemsResolved.schema, `${sourcePtr}/items`, ctx);
  if (itemsResolved.remote) reportRemoteRef(`${sourcePtr}/items`, targetPath, ctx);

  const itemChoices = readChoices(items, hint);
  const qname = uniqueName(name, ctx);
  checkWidget(hint, itemChoices ? "array-enum" : "array", ctx);
  const composed = objectCompositions(items, ctx);

  if (itemChoices) {
    // Multi-select. checkbox by default; tagbox when a UI hint prefers a compact
    // multi-select.
    const wantTagbox = hint.multi === true || hint.widget === "tagbox" || hint.format === "combo" || hint.format === "multiselect";
    const el: SurveyJSONElement = { type: wantTagbox ? "tagbox" : "checkbox", name: qname, choices: itemChoices };
    applyTitleDesc(schema, el, hint, ctx);
    applyArrayMeta(schema, el, required, hint);
    return el;
  }

  if (effectiveType(items) === "object") {
    // Repeating group of objects -> dynamic panel; item properties -> template. A question in the
    // template is read from its own row, as `{panel.k}`; a nested array starts its own rows.
    const el: SurveyJSONElement = { type: "paneldynamic", name: qname };
    applyTitleDesc(schema, el, hint, ctx);
    const template = hint.template
      ? hint.template(items, `${targetPath}.templateElements`)
      : walkObject(items, `${sourcePtr}/items`, `${targetPath}.templateElements`, ctx, childUi(hint.ui, "items"), depth + 1, "panel.");
    if (template.length > 0) el.templateElements = template;
    if (hint.addable === false) {
      el.allowAddPanel = false;
      consumeOption(hint, "addable");
    }
    if (hint.removable === false) {
      el.allowRemovePanel = false;
      consumeOption(hint, "removable");
    }
    // The item walk reports a `oneOf` it cannot model, and does not read an `anyOf` at all. A
    // detail layout names its fields itself, and a scope finds them in the branches.
    if (!hint.template && composed.includes("anyOf")) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/items/anyOf`, targetPath);
    applyArrayMeta(schema, el, required, hint);
    return el;
  }

  for (const key of composed) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/items/${key}`, targetPath);
  // Array of primitives without an enum -> tagbox (free-form multi value). No
  // predefined choices; the user can add them after import.
  const el: SurveyJSONElement = { type: "tagbox", name: qname };
  applyTitleDesc(schema, el, hint, ctx);
  applyArrayMeta(schema, el, required, hint);
  return el;
}

// The composition keywords (`anyOf`, `oneOf`) through which array items with no properties of their
// own are objects: their fields are only in the branches, which no question is built from.
function objectCompositions(items: JsonSchemaDoc, ctx: Ctx): ("anyOf" | "oneOf")[] {
  if (items.properties && Object.keys(items.properties).length > 0) return [];
  return (["anyOf", "oneOf"] as const).filter((key) => {
    const branches = items[key];
    return Array.isArray(branches) && branches.some((b) => {
      if (!b || typeof b !== "object") return false;
      const resolved = resolveRef(b, ctx);
      return !resolved.remote && effectiveType(resolved.schema) === "object";
    });
  });
}

// `default`, `readOnly`, `required` and a hidden UI hint on an array question, in every branch.
function applyArrayMeta(schema: JsonSchemaDoc, el: SurveyJSONElement, required: boolean, hint: UiHint): void {
  if (schema.default !== undefined && schema.default !== null) el.defaultValue = schema.default;
  if (schema.readOnly || hint.readOnly) el.readOnly = true;
  if (required) el.isRequired = true;
  if (hint.hidden) el.visible = false;
}

/** `title`/`description` onto an element, with UI-layer overrides winning. */
function applyTitleDesc(schema: JsonSchemaDoc, el: SurveyJSONElement, hint: UiHint, ctx: Ctx): void {
  const title = hint.title ?? schema.title;
  if (title !== undefined) el.title = String(title);
  const description = hint.description ?? schema.description;
  if (description !== undefined) el.description = String(description);
  // RJSF `help` shows under the field; it is the description only when the field has none.
  else if (hint.help !== undefined) {
    el.description = hint.help;
    consumeOption(hint, "help");
  }
  if (hint.placeholder !== undefined && (el.type === "text" || el.type === "comment")) {
    el.placeholder = hint.placeholder;
  }
}

/** `default`/validators/`required` onto a scalar element. */
function applyScalarMeta(schema: JsonSchemaDoc, el: SurveyJSONElement, required: boolean, ctx: Ctx, sourcePtr: string): void {
  if (schema.default !== undefined && schema.default !== null) el.defaultValue = schema.default;
  if (required) el.isRequired = true;

  const validators: Record<string, unknown>[] = [];
  if (schema.minLength !== undefined || schema.maxLength !== undefined) {
    const t: Record<string, unknown> = { type: "text" };
    if (schema.minLength !== undefined) t.minLength = schema.minLength;
    if (schema.maxLength !== undefined) t.maxLength = schema.maxLength;
    validators.push(t);
  }
  const isInteger = effectiveType(schema) === "integer";
  const min = readBound("min", schema.minimum, schema.exclusiveMinimum, isInteger, `${sourcePtr}/exclusiveMinimum`, ctx);
  const max = readBound("max", schema.maximum, schema.exclusiveMaximum, isInteger, `${sourcePtr}/exclusiveMaximum`, ctx);
  if (min !== undefined || max !== undefined) {
    const n: Record<string, unknown> = { type: "numeric" };
    if (min !== undefined) n.minValue = min;
    if (max !== undefined) n.maxValue = max;
    validators.push(n);
  }
  if (typeof schema.pattern === "string" && schema.pattern.length > 0) {
    validators.push({ type: "regex", regex: schema.pattern });
  }
  if (validators.length > 0) el.validators = validators;
}

// The inclusive bound a `numeric` validator takes from `minimum` / `exclusiveMinimum` (or the
// maximum pair). Draft-04 writes `exclusiveMinimum: true` as a flag on `minimum`; later drafts
// write the exclusive bound as a number next to an inclusive one, and the stricter wins. An
// exclusive bound on an integer is exact one step inside; on a number it stays the bound and is
// reported, since the validator accepts a value equal to it.
function readBound(
  side: "min" | "max",
  inclusive: number | undefined,
  exclusive: number | boolean | undefined,
  isInteger: boolean,
  exclusivePtr: string,
  ctx: Ctx
): number | undefined {
  let lower = typeof inclusive === "number" ? inclusive : undefined;
  let strict: number | undefined;
  if (typeof exclusive === "number") strict = exclusive;
  else if (exclusive === true && lower !== undefined) {
    strict = lower;
    lower = undefined;
  }
  if (strict === undefined) return lower;
  const stepped = isInteger ? (side === "min" ? Math.floor(strict) + 1 : Math.ceil(strict) - 1) : strict;
  const stricter = (a: number, b: number) => (side === "min" ? a > b : a < b);
  // An inclusive bound at least as strict as the exclusive one makes it redundant.
  if (lower !== undefined && (stricter(lower, stepped) || (isInteger && lower === stepped))) return lower;
  if (!isInteger) ctx.report.assumed(JsonSchemaCodes.ASSUMED_EXCLUSIVE_BOUND, exclusivePtr, "");
  return stepped;
}

// --- if/then/else -----------------------------------------------------------

function applyIfThenElse(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields): void {
  if (!schema.if) return;
  if (!fields.shown && !branchRequires(schema)) return;
  const expr = ifToExpression(schema.if, fields);
  if (!expr) {
    // Cannot express the condition -- do not guess a branch.
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, `${sourcePtr}/if`, "");
    return;
  }
  applyBranch(schema.then, expr.pos, `${sourcePtr}/then`, fields);
  applyBranch(schema.else, expr.neg, `${sourcePtr}/else`, fields);
}

// Whether `then` or `else` requires a property. Under JSONForms a branch gives only its `required`,
// so an `if` whose branches require nothing has nothing to express, and loses nothing.
function branchRequires(schema: JsonSchemaDoc): boolean {
  return [schema.then, schema.else].some((branch) => Array.isArray(branch?.required) && branch.required.length > 0);
}

// Apply a `then`/`else` branch: its `properties` become `visibleIf: <cond>` on the matching
// questions (creating them if the branch introduces new ones), except under JSONForms, and its
// `required` become `requiredIf: <cond>`.
function applyBranch(branch: JsonSchemaDoc | undefined, cond: string, sourcePtr: string, fields: ObjectFields): void {
  if (!branch) return;
  if (fields.shown) {
    for (const [key, sub] of Object.entries(branch.properties ?? {})) {
      const el = fields.shown(key, sub, `${sourcePtr}/properties/${key}`);
      if (el) el.visibleIf = combineAnd(typeof el.visibleIf === "string" ? el.visibleIf : undefined, cond);
    }
  }
  requireWhen(cond, branch.required ?? [], fields);
}

// --- dependencies -----------------------------------------------------------

// Every dependency is reported `assumed`. One whose trigger has no question has nothing to read,
// so it also adds no condition, and a schema dependency's properties are not created.
function applyDependencies(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields): void {
  // draft-07 `dependencies`: value is either an array (property dependency) or a
  // schema (schema dependency).
  for (const [trigger, dep] of Object.entries(schema.dependencies ?? {})) {
    if (Array.isArray(dep)) {
      requireWhenPresent(trigger, dep, fields);
      ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependencies/${trigger}`, "");
    } else if (dep && typeof dep === "object") {
      const ref = fields.ref(trigger);
      if (ref !== undefined) applyBranch(dep, `${ref} notempty`, `${sourcePtr}/dependencies/${trigger}`, fields);
      ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependencies/${trigger}`, "");
    }
  }
  // draft 2019-09+ split forms.
  for (const [trigger, keys] of Object.entries(schema.dependentRequired ?? {})) {
    requireWhenPresent(trigger, keys, fields);
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependentRequired/${trigger}`, "");
  }
  for (const [trigger, dep] of Object.entries(schema.dependentSchemas ?? {})) {
    const ref = fields.ref(trigger);
    if (ref !== undefined) applyBranch(dep, `${ref} notempty`, `${sourcePtr}/dependentSchemas/${trigger}`, fields);
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependentSchemas/${trigger}`, "");
  }
}

function requireWhenPresent(trigger: string, keys: string[], fields: ObjectFields): void {
  const ref = fields.ref(trigger);
  if (ref !== undefined) requireWhen(`${ref} notempty`, keys, fields);
}

// `requiredIf: <cond>` on the elements made for each of `keys`.
function requireWhen(cond: string, keys: string[], fields: ObjectFields): void {
  for (const key of keys) {
    for (const el of fields.elements(key)) el.requiredIf = combineAnd(typeof el.requiredIf === "string" ? el.requiredIf : undefined, cond);
  }
}

// --- oneOf discriminator ----------------------------------------------------

interface Discriminated {
  disc: string;
  explicit: boolean;
  variants: { value: unknown, schema: JsonSchemaDoc, index: number }[];
}

/**
 * Detect a discriminated `oneOf`: an explicit OpenAPI `discriminator`, or a
 * property carrying a `const` in every branch. Returns `undefined` for a
 * non-discriminated `oneOf` (which is handled as a `choices` set elsewhere).
 */
function detectDiscriminator(schema: JsonSchemaDoc, ctx: Ctx): Discriminated | undefined {
  const oneOf = schema.oneOf;
  if (!Array.isArray(oneOf) || oneOf.length < 2) return undefined;
  const resolved = oneOf.map((b) => resolveRef(b, ctx).schema);
  let disc = schema.discriminator?.propertyName;
  const explicit = typeof disc === "string" && disc.length > 0;
  if (!disc) disc = inferDiscriminator(resolved);
  if (!disc) return undefined;
  const variants: Discriminated["variants"] = [];
  for (let i = 0; i < resolved.length; i++) {
    const constVal = resolved[i].properties?.[disc]?.const;
    if (constVal === undefined) return undefined; // not fully discriminated
    variants.push({ value: constVal, schema: resolved[i], index: i });
  }
  return { disc, explicit, variants };
}

/** A property key that has a `const` in every branch is the discriminator. */
function inferDiscriminator(branches: JsonSchemaDoc[]): string | undefined {
  const first = branches[0]?.properties ?? {};
  for (const key of Object.keys(first)) {
    if (branches.every((b) => b.properties?.[key]?.const !== undefined)) return key;
  }
  return undefined;
}

/**
 * Append a discriminator selector question plus one gated panel per variant to
 * the current object's elements. `container` is `"panel"` (nested) -- top-level
 * page variants are handled in `convert`.
 */
function appendOneOfVariants(
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  state: WalkState,
  container: "panel",
  depth: number
): void {
  void container;
  if (!Array.isArray(schema.oneOf) || schema.oneOf.length === 0) return;
  const d = detectDiscriminator(schema, ctx);
  if (!d) {
    // A non-discriminated `oneOf` of const branches is a choices set, consumed at
    // the property level -- not here. Anything else is a `oneOf` of mutually
    // EXCLUSIVE object shapes: we cannot flatten it (merging would let a user
    // satisfy two exclusive branches), and with no discriminator there is no
    // selector to gate on. Surface the loss instead of dropping it silently.
    if (!hasConstComposition(schema)) {
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/oneOf`, targetPath);
    }
    return;
  }
  if (!d.explicit) ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, `${sourcePtr}/oneOf`, targetPath);

  // Discriminator selector, unless the object already declares the property.
  if (!state.byProp.has(d.disc)) {
    const selector: SurveyJSONElement = {
      type: "dropdown",
      name: uniqueName(d.disc, ctx),
      choices: d.variants.map((v) => ({ value: v.value })),
      isRequired: true
    };
    const discSchema = schema.properties?.[d.disc];
    if (discSchema?.title !== undefined) selector.title = String(discSchema.title);
    state.elements.push(selector);
    state.byProp.set(d.disc, selector);
  }
  const discRef = questionRef(d.disc, state)!;

  for (const variant of d.variants) {
    const panel: SurveyJSONElement = {
      type: "panel",
      name: uniqueName(`${d.disc}_${String(variant.value)}`, ctx)
    };
    // A variant whose value cannot be written as a literal stays visible, reported.
    const lit = formatLiteral(variant.value);
    if (lit !== undefined) panel.visibleIf = `${discRef} = ${lit}`;
    else ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, `${sourcePtr}/oneOf/${variant.index}`, `${targetPath}[${state.elements.length}]`);
    if (variant.schema.title !== undefined) panel.title = String(variant.schema.title);
    // Variant panel holds every property except the shared discriminator.
    const variantProps: Record<string, JsonSchemaDoc> = { ...variant.schema.properties };
    delete variantProps[d.disc];
    const variantSchema: JsonSchemaDoc = { ...variant.schema, properties: variantProps };
    const elements = walkObject(variantSchema, `${sourcePtr}/oneOf/${variant.index}`, `${targetPath}[${state.elements.length}].elements`, ctx, state.ui, depth + 1, state.refPrefix);
    if (elements.length > 0) panel.elements = elements;
    state.elements.push(panel);
  }
}

// --- unique names -----------------------------------------------------------

function uniqueName(base: string, ctx: Ctx): string {
  const safe = base && base.length > 0 ? base : "question";
  let name = safe;
  let i = 1;
  // survey-core compares element names without regard to case.
  while(ctx.usedNames.has(name.toLowerCase())) name = `${safe}_${i++}`;
  ctx.usedNames.add(name.toLowerCase());
  return name;
}

// A name for a page, panel or label the UI schema makes. It also skips every property name, so a
// container named from a label never takes the name, and with it the data key, of a question made
// later in the walk.
function containerName(base: string, ctx: Ctx): string {
  let name = base;
  let i = 1;
  while(ctx.usedNames.has(name.toLowerCase()) || ctx.reservedNames.has(name.toLowerCase())) name = `${base}_${i++}`;
  ctx.usedNames.add(name.toLowerCase());
  return name;
}

// Every key of every `properties` in the document, lower-cased: the root schema's, its `$defs` and
// `definitions`, and those nested in objects, items and branches, which a scope can name.
function collectPropertyNames(root: JsonSchemaDoc): Set<string> {
  const names = new Set<string>();
  const seen = new Set<object>();
  const visit = (node: unknown): void => {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const child of node) visit(child);
      return;
    }
    const props = (node as JsonSchemaDoc).properties;
    if (isPlainObject(props)) for (const key of Object.keys(props)) names.add(key.toLowerCase());
    for (const [key, value] of Object.entries(node)) {
      if (!DATA_KEYWORDS.has(key)) visit(value);
    }
  };
  visit(root);
  return names;
}

const MAX_DEPTH = 24;

// --- RJSF uiSchema ----------------------------------------------------------

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// The uiSchema node of a property, or of an array's `items`.
function childUi(ui: RjsfNode | undefined, key: string): RjsfNode | undefined {
  const node = ui?.node[key];
  if (!ui || !isPlainObject(node)) return undefined;
  return { node, ptr: `${ui.ptr}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}` };
}

// RJSF's `getUiOptions`: every `ui:` key without its prefix, with the keys of `ui:options` spread
// in, in the node's key order, so a later key wins. Each option keeps the pointer it came from. A
// `ui:widget` holding an object is refused upstream and is returned apart, to be reported.
function rjsfOptions(ui: RjsfNode): { options: Map<string, { value: unknown, ptr: string }>, objectWidgetPtr?: string } {
  const options = new Map<string, { value: unknown, ptr: string }>();
  let objectWidgetPtr: string | undefined;
  for (const [key, value] of Object.entries(ui.node)) {
    if (!key.startsWith("ui:")) continue;
    const ptr = `${ui.ptr}/${key}`;
    if (key === "ui:widget" && isPlainObject(value)) {
      objectWidgetPtr = ptr;
    } else if (key === "ui:options" && isPlainObject(value)) {
      for (const [option, optionValue] of Object.entries(value)) {
        options.delete(option);
        options.set(option, { value: optionValue, ptr: `${ptr}/${option}` });
      }
    } else {
      options.delete(key.slice(3));
      options.set(key.slice(3), { value, ptr });
    }
  }
  return { options, objectWidgetPtr };
}

// RJSF options the converter maps; `widget` is checked against the field in `checkWidget`.
const RJSF_MAPPED = new Set([
  "widget", "title", "description", "placeholder", "order", "disabled", "readonly",
  "inputType", "addable", "removable", "enumNames", "enumDisabled", "help"
]);
// The `text` input types survey-core offers.
const TEXT_INPUT_TYPES = new Set(["color", "date", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"]);
// Options that only change how a field looks. `UIOptionsBaseType` and `GlobalUISchemaOptions` in
// `@rjsf/utils` `types.ts`, plus the singular `className` the samples still use.
const RJSF_PRESENTATION = new Set([
  "classNames", "className", "style", "rows", "autocomplete", "autocapitalize", "autofocus", "inline", "label",
  "submitButtonOptions", "hideError", "filePreview", "enableMarkdownInDescription", "enableMarkdownInHelp",
  "allowClearTextInputs"
]);

// Read an RJSF uiSchema node into the shared UiHint shape, and report each option the converter
// does not map: presentation is `DROPPED_STYLING`, a custom field, template or widget component is
// `DROPPED_CUSTOM_RENDERER`, and anything else, a new key included, is `UNSUPPORTED_UI_HINT`.
function rjsfHint(ui: RjsfNode | undefined, ctx: Ctx): UiHint {
  if (!ui) return {};
  const { options, objectWidgetPtr } = rjsfOptions(ui);
  const report = !ctx.reportedUi.has(ui.ptr);
  ctx.reportedUi.add(ui.ptr);
  if (report && objectWidgetPtr) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, objectWidgetPtr, "");

  const hint: UiHint = { ui };
  const text = (name: string) => {
    const value = options.get(name)?.value;
    return typeof value === "string" ? value : undefined;
  };
  const widget = options.get("widget");
  if (typeof widget?.value === "string") {
    hint.widget = widget.value;
    // `checkWidget` reports an unhonoured widget once, where the field's type is known.
    if (report) hint.widgetPtr = widget.ptr;
    if (widget.value === "hidden") hint.hidden = true;
  }
  hint.title = text("title");
  hint.description = text("description");
  hint.placeholder = text("placeholder");
  if (options.get("disabled")?.value === true || options.get("readonly")?.value === true) hint.readOnly = true;
  // An option whose value is usable is read into the hint and held in `pending` until a question
  // applies it; an unusable one is reported below.
  const hold = (name: string) => {
    if (report) (hint.pending ??= new Map()).set(name, options.get(name)!.ptr);
  };
  const inputType = text("inputType");
  if (inputType !== undefined && TEXT_INPUT_TYPES.has(inputType)) {
    hint.inputType = inputType;
    hold("inputType");
  }
  // Only `false` changes anything: a dynamic panel allows both by default.
  if (options.get("addable")?.value === false) {
    hint.addable = false;
    hold("addable");
  }
  if (options.get("removable")?.value === false) {
    hint.removable = false;
    hold("removable");
  }
  const enumNames = options.get("enumNames")?.value;
  if (Array.isArray(enumNames) || isPlainObject(enumNames)) {
    hint.enumNames = enumNames;
    hold("enumNames");
  }
  const enumDisabled = options.get("enumDisabled")?.value;
  if (Array.isArray(enumDisabled)) {
    hint.enumDisabled = enumDisabled;
    hold("enumDisabled");
  }
  hint.help = text("help");
  if (hint.help !== undefined) hold("help");

  if (!report) return hint;
  for (const [name, { value, ptr }] of options) {
    if (name === "widget" && typeof value === "function") ctx.report.dropped(JsonSchemaCodes.DROPPED_CUSTOM_RENDERER, ptr, "");
    else if (name === "inputType") {
      if (hint.inputType === undefined) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, ptr, "");
    } else if (name === "enumNames") {
      if (hint.enumNames === undefined) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, ptr, "");
    } else if (name === "enumDisabled") {
      if (hint.enumDisabled === undefined) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, ptr, "");
    } else if (name === "help") {
      if (hint.help === undefined) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, ptr, "");
    } else if (RJSF_MAPPED.has(name)) continue;
    else if (RJSF_PRESENTATION.has(name)) ctx.report.dropped(JsonSchemaCodes.DROPPED_STYLING, ptr, "");
    else if (name === "field" || name.endsWith("Template")) ctx.report.dropped(JsonSchemaCodes.DROPPED_CUSTOM_RENDERER, ptr, "");
    else ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, ptr, "");
  }
  return hint;
}

// --- JSONForms UI Schema ----------------------------------------------------

interface UiNode {
  type?: string;
  scope?: string;
  label?: unknown;
  text?: unknown;
  elements?: unknown[];
  options?: Record<string, unknown>;
  [key: string]: unknown;
}

function detectUiKind(uiSchema: unknown): UiKind {
  if (!uiSchema || typeof uiSchema !== "object" || Array.isArray(uiSchema)) return "none";
  const ui = uiSchema as UiNode;
  if (typeof ui.type === "string" && JSONFORMS_TYPES.has(ui.type)) return "jsonforms";
  return "rjsf";
}

// Resolve a JSONForms `scope` (`#/properties/x/properties/y`) to a property of `schema`: the root
// schema, or an array's items schema for a scope inside `options.detail`. `root` is the document
// a `$ref` points into. The schema is found as JSONForms' `resolveSchema` finds it, and `required`
// is read as its `isRequired` reads it: from the schema the scope's parent path (the scope less
// its last two segments) resolves to, not from the branch the property was found in.
function resolveScope(scope: string, schema: JsonSchemaDoc, root: JsonSchemaDoc = schema): { name: string, schema: JsonSchemaDoc, required: boolean } | undefined {
  const target = resolveSchemaPath(schema, scope, root);
  if (!isPlainObject(target)) return undefined;
  const segments = scope.split("/");
  const parts = segments.map(decodeSegment).filter((p) => p.length > 0 && p !== "#");
  const name = parts[parts.length - 1] ?? "field";
  const parent = resolveSchemaPath(schema, segments.slice(0, -2).join("/"), root);
  const ownRequired = isPlainObject(parent) ? parent.required : undefined;
  const required = Array.isArray(ownRequired) && ownRequired.includes(decodeSegment(segments[segments.length - 1]));
  return { name, schema: target as JsonSchemaDoc, required };
}

function decodeSegment(segment: string): string {
  return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

// --- JSONForms `resolveSchema` --------------------------------------------------
//
// A port of `resolveSchema` in @jsonforms/core (`packages/core/src/util/resolvers.ts`). A path is
// walked one segment at a time, as a property lookup; `#` and empty segments are skipped. A `$ref`
// on a segment's result is followed from `root` before the next segment. When the rest of the
// path does not resolve from a schema, it is tried from that schema's `oneOf`, `allOf`, `anyOf`,
// `then` and `else` entries, in that order, each entry's `$ref` followed first, and the first entry
// it resolves from wins. A path asked again from the same schema while it is being resolved is a
// reference cycle and resolves to nothing.
//
// Two differences. A scope's last segment holding a non-local `$ref` returns that node as is, where
// JSONForms finds nothing, so the question is built and the reference is reported as remote (or
// resolved through a bundled `$id`) like any other. And a combinator entry that leads back to a
// schema the same rest of the path is already being searched from is skipped, so the next entry
// is tried; JSONForms recurses into it until the stack overflows.

interface PathWalk {
  root: JsonSchemaDoc;
  visited: Map<unknown, Set<string>>;
}

const SCOPE_COMBINATORS = ["oneOf", "allOf", "anyOf", "then", "else"] as const;

function resolveSchemaPath(schema: unknown, path: string, root: JsonSchemaDoc): unknown {
  return resolveWithRef(schema, path, { root, visited: new Map() });
}

// lodash's `isEmpty`, which JSONForms uses to stop a walk.
function isEmptyValue(value: unknown): boolean {
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (value !== null && typeof value === "object") return Object.keys(value).length === 0;
  return true;
}

function refOf(value: unknown): string | undefined {
  const ref = isPlainObject(value) ? value.$ref : undefined;
  return typeof ref === "string" ? ref : undefined;
}

// `doResolveSchema`: the path from the schema a `$ref` names, else from the schema itself.
function resolveWithRef(schema: unknown, path: string, walk: PathWalk): unknown {
  let resolved: unknown;
  const ref = refOf(schema);
  if (ref !== undefined) {
    const base = resolveFrom(walk.root, ref, walk);
    if (base !== undefined) resolved = resolveFrom(base, path, walk);
  }
  if (resolved === undefined) resolved = resolveFrom(schema, path, walk);
  return resolved;
}

// `resolvePath`: the cycle guard around one walk.
function resolveFrom(schema: unknown, path: string, walk: PathWalk): unknown {
  let paths = walk.visited.get(schema);
  if (!paths) {
    paths = new Set();
    walk.visited.set(schema, paths);
  }
  if (paths.has(path)) return undefined;
  paths.add(path);
  const resolved = resolveWithCombinators(schema, path.split("/").map(decodeSegment), walk);
  paths.delete(path);
  return resolved;
}

// `resolvePathSegmentsWithCombinatorFallback`.
function resolveWithCombinators(schema: unknown, segments: string[], walk: PathWalk): unknown {
  if (segments.length === 0) return schema;
  if (isEmptyValue(schema)) return undefined;
  const direct = resolveSegments(schema, segments, walk);
  if (direct !== undefined) return direct;
  const node = schema as Record<string, unknown>;
  const entries: unknown[] = [];
  for (const key of SCOPE_COMBINATORS) {
    const value = node[key];
    if (Array.isArray(value)) entries.push(...value);
    else if (value !== undefined && value !== null) entries.push(value);
  }
  const path = segments.join("/");
  for (const entry of entries) {
    const ref = refOf(entry);
    const sub = ref !== undefined ? resolveWithRef(walk.root, ref, walk) : entry;
    // An entry that leads back to a schema this path is already being searched from is a cycle:
    // it resolves to nothing, and the next entry is tried.
    let paths = walk.visited.get(sub);
    if (!paths) {
      paths = new Set();
      walk.visited.set(sub, paths);
    }
    if (paths.has(path)) continue;
    paths.add(path);
    const resolved = resolveWithCombinators(sub, segments, walk);
    paths.delete(path);
    if (resolved) return resolved;
  }
  return undefined;
}

// `resolvePathSegments`: one step, its `$ref` followed, then the rest of the path.
function resolveSegments(schema: unknown, segments: string[], walk: PathWalk): unknown {
  if (segments.length === 0) return schema;
  if (isEmptyValue(schema)) return undefined;
  let rest = segments;
  while(rest.length > 0 && (rest[0] === "#" || rest[0] === "")) rest = rest.slice(1);
  let next: unknown = schema;
  if (rest.length > 0) {
    const node = schema as Record<string, unknown>;
    next = Object.prototype.hasOwnProperty.call(node, rest[0]) ? node[rest[0]] : undefined;
    rest = rest.slice(1);
  }
  const ref = refOf(next);
  if (ref !== undefined) {
    if (rest.length === 0 && !ref.startsWith("#")) return next;
    next = resolveWithRef(walk.root, ref, walk);
  }
  return resolveWithCombinators(next, rest, walk);
}

// Where a UI node's scopes resolve. The root frame resolves against the root schema; an array's
// `options.detail` opens a frame on the items schema, whose scopes are relative to the row.
// `names` maps a scope to the data key of the first Control on it, so a rule reads that key; a
// second Control on the same scope shares the value through `valueName`, as both edit one value in
// JSONForms. An object's `options.detail` opens a frame on the object schema, whose scopes are
// relative to the object; its questions sit in a static panel, in the enclosing frame's data, so it
// shares that frame's names and reference prefix, and `base` is the object's scope there.
// `elements` keeps every element made on a scope, panels included, for a schema conditional's
// `required` to mark; it is shared like `names`.
interface UiFrame {
  root: JsonSchemaDoc;
  names: Map<string, string>;
  elements: Map<string, SurveyJSONElement[]>;
  refPrefix: string;
  base?: string;
}

// A scope of `frame` as a key of its `names`: an object frame's scope is rewritten onto the
// object's scope in the enclosing frame (`#/properties/x` -> `#/properties/obj/properties/x`).
function frameScope(scope: string, frame: UiFrame): string {
  if (frame.base === undefined) return scope;
  if (scope === "#") return frame.base;
  return scope.startsWith("#/") ? `${frame.base}${scope.slice(1)}` : scope;
}

// Put the question a Control made on `scope` into the frame's names. A scope already there is a
// second Control on one value, which shares it. A panel has no value, so it is not put in: a rule
// naming an object scope has nothing to compare, and is reported. True when `el` took a `valueName`.
function registerScope(scope: string, el: SurveyJSONElement, frame: UiFrame): boolean {
  const onScope = frame.elements.get(scope);
  if (onScope) onScope.push(el);
  else frame.elements.set(scope, [el]);
  if (el.type === "panel") return false;
  const shared = frame.names.get(scope);
  if (shared === undefined) {
    frame.names.set(scope, el.name as string);
    return false;
  }
  el.valueName = shared;
  return true;
}

// Put the questions an object Control's data walk made into the frame's names. survey-core reads
// an expression's `{name}` by data key, so a field that takes a `valueName` is renamed in the
// expressions the walk wrote under the panel.
function shareObjectFields(scope: string, panel: SurveyJSONElement, frame: UiFrame, ctx: Ctx): void {
  const renames = new Map<string, string>();
  registerObjectFields(scope, panel, frame, ctx, renames);
  if (renames.size > 0) renameRefs(panel, renames);
}

// The fields go under `<scope>/properties/<key>`, and those of each nested object under its own
// scope. `renames` maps each reference to a field that took a `valueName` to its data key's.
function registerObjectFields(scope: string, panel: SurveyJSONElement, frame: UiFrame, ctx: Ctx, renames: Map<string, string>): void {
  const fields = ctx.objectFields.get(panel);
  if (!fields) return;
  for (const [key, el] of fields) {
    const sub = `${scope}/properties/${key}`;
    if (registerScope(sub, el, frame)) renames.set(`{${frame.refPrefix}${el.name}}`, `{${frame.refPrefix}${el.valueName}}`);
    if (el.type === "panel") registerObjectFields(sub, el, frame, ctx, renames);
  }
}

// The condition properties the data walk writes.
const WALK_EXPRESSIONS = ["visibleIf", "enableIf", "requiredIf"];

// Replace each exact reference token in `el`'s and its descendants' conditions.
function renameRefs(el: SurveyJSONElement, renames: Map<string, string>): void {
  const node = el as Record<string, unknown>;
  for (const prop of WALK_EXPRESSIONS) {
    const expr = node[prop];
    if (typeof expr !== "string") continue;
    let out = expr;
    for (const [from, to] of renames) out = out.split(from).join(to);
    node[prop] = out;
  }
  for (const key of ["elements", "templateElements"]) {
    const children = node[key];
    if (Array.isArray(children)) for (const child of children) renameRefs(child as SurveyJSONElement, renames);
  }
}

// A JSONForms `rule`, resolved after the walk because its scope can name a Control further down.
interface UiRuleRecord {
  rule: { effect?: unknown, condition?: unknown };
  target: SurveyJSONElement | SurveyJSONPage;
  sourcePtr: string;
  targetPath: string;
  frame: UiFrame;
}

// A JSONForms label: a string, a boolean, or `{ text, show }`.
function readLabel(label: unknown): { text?: string, show: boolean } {
  if (typeof label === "string") return { text: label, show: true };
  if (label === false) return { show: false };
  if (label && typeof label === "object") {
    const { text, show } = label as { text?: unknown, show?: unknown };
    return { text: typeof text === "string" ? text : undefined, show: show !== false };
  }
  return { show: true };
}

// JSONForms options that only change how a control looks: the date and time pickers' formats,
// labels and views, input helpers, and the label and asterisk display.
const JSONFORMS_PRESENTATION = new Set([
  "trim", "showUnfocusedDescription", "hideRequiredAsterisk", "autocomplete", "clearable", "orientation", "ampm",
  "okLabel", "cancelLabel", "clearLabel", "dateFormat", "dateTimeFormat", "views"
]);
// JSONForms options `applyControlOptions` maps once the question exists.
const JSONFORMS_MAPPED = new Set(["restrict", "step", "slider", "toggle", "elementLabelProp", "labelRef"]);

// JSONForms `Control` `options` refinements. `readonly` and `detail` are applied by the Control
// itself, and `JSONFORMS_MAPPED` once the question exists; presentation is `DROPPED_STYLING`, and
// any other option has no rule yet and is reported.
function jsonFormsHint(node: UiNode, ctx: Ctx, sourcePtr: string): UiHint {
  const hint: UiHint = {};
  const label = readLabel(node.label);
  if (label.text !== undefined) hint.title = label.text;
  const opts = node.options;
  if (!opts || typeof opts !== "object") return hint;
  for (const [k, v] of Object.entries(opts)) {
    if (k === "format") hint.format = String(v);
    else if (k === "multi") hint.multi = v === true;
    else if (k === "readonly" || k === "readOnly" || k === "detail" || JSONFORMS_MAPPED.has(k)) continue;
    else if (JSONFORMS_PRESENTATION.has(k)) ctx.report.dropped(JsonSchemaCodes.DROPPED_STYLING, `${sourcePtr}/options/${k}`, "");
    else ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/${k}`, "");
  }
  return hint;
}

// JSONForms' `isInherentlyEnabled`: an ENABLE or DISABLE rule decides alone; otherwise a boolean
// `options.readonly` (or `readOnly`) decides; otherwise `schema.readOnly`, which `mapProperty`
// already applied. survey-core's `enableIf` overrides `readOnly`, so a rule's element carries only
// its `enableIf`, set when the rule is resolved.
function applyReadonlyOption(node: UiNode, el: SurveyJSONElement): void {
  const readonly = node.options?.readonly ?? node.options?.readOnly;
  if (typeof readonly !== "boolean") return;
  if (readonly) el.readOnly = true;
  else delete el.readOnly;
}

// The question inside a dynamic panel's template that a JSONForms label option names, as the
// reference an expression in the row writes. `labelRef` is a pointer into the items schema
// (`#/items/properties/name`); the property it ends on names the question.
function templateLabelRef(panel: SurveyJSONElement, property: string): string | undefined {
  const search = (elements: unknown, exact: boolean): SurveyJSONElement | undefined => {
    if (!Array.isArray(elements)) return undefined;
    for (const child of elements as SurveyJSONElement[]) {
      const name = child.name as string;
      // `uniqueName` may have renamed the question to `<property>_<n>`.
      const renamed = name.startsWith(`${property}_`) && /^\d+$/.test(name.slice(property.length + 1));
      if (child.type !== "panel" && (exact ? name === property || child.valueName === property : renamed)) return child;
      const found = search(child.elements, exact);
      if (found) return found;
    }
    return undefined;
  };
  const found = search(panel.templateElements, true) ?? search(panel.templateElements, false);
  return found ? `{panel.${found.valueName ?? found.name}}` : undefined;
}

// A report that records nothing, for reading a schema a second time.
const quietReport = { unsupported() { /* none */ }, dropped() { /* none */ }, assumed() { /* none */ } } as unknown as Ctx["report"];

// Map the `options` of a Control that need the question: `restrict` and `step`, `slider`, and the
// label of a dynamic panel's items. `toggle` asks for a switch, which a `boolean` already is. An
// option that cannot be applied to the question is reported, as one with no rule is.
function applyControlOptions(ui: UiNode, el: SurveyJSONElement, schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): void {
  const opts = ui.options;
  if (!opts || typeof opts !== "object") return;
  const unapplied = (key: string) => ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/${key}`, "");
  const isNumber = el.type === "text" && el.inputType === "number";

  // JSONForms' `isRangeControl` needs `minimum`, `maximum` and `default` on a number schema; without
  // them it renders a number input, as the converter keeps.
  const hasRange = typeof schema.minimum === "number" && typeof schema.maximum === "number" && schema.default !== undefined;
  if (opts.slider === true) {
    if (isNumber && hasRange) {
      el.type = "slider";
      delete el.inputType;
      delete el.placeholder;
      el.min = schema.minimum;
      el.max = schema.maximum;
    } else unapplied("slider");
  }
  if ("step" in opts) {
    if (typeof opts.step === "number" && opts.step > 0 && (isNumber || el.type === "slider")) el.step = opts.step;
    else unapplied("step");
  }
  if (opts.restrict === true && typeof schema.maxLength === "number") {
    if (el.type === "text" || el.type === "comment") el.maxLength = schema.maxLength;
    else unapplied("restrict");
  }
  for (const key of ["elementLabelProp", "labelRef"]) {
    const value = opts[key];
    if (value === undefined) continue;
    const property = typeof value === "string" ? value.split("/").filter((p) => p.length > 0).map(decodeSegment).pop() : undefined;
    const ref = el.type === "paneldynamic" && property && property !== "#" ? templateLabelRef(el, property) : undefined;
    if (ref) el.templateTitle = ref;
    else unapplied(key);
  }
}

function recordUiRule(node: UiNode, target: SurveyJSONElement | SurveyJSONPage, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (!node.rule || typeof node.rule !== "object") return;
  ctx.uiRules.push({ rule: node.rule as UiRuleRecord["rule"], target, sourcePtr: `${sourcePtr}/rule`, targetPath, frame: ctx.uiFrame });
}

// `options.detail` on an array or object Control: a layout walks the row with scopes relative to
// the items schema, or the object's fields with scopes relative to the object schema; "GENERATED",
// "DEFAULT" or none is the default walk; "REGISTERED" names a detail layout registered in the
// application, which a definition cannot carry, so it is the default walk and reported.
function readDetail(node: UiNode, scope: string, schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, depth: number): UiHint["template"] {
  const detail = node.options?.detail;
  if (detail === undefined || detail === "GENERATED" || detail === "DEFAULT") return undefined;
  const target = resolveRef(schema, ctx).schema;
  const type = effectiveType(target);
  const isObject = type === "object" || (type === undefined && !!target.properties);
  if (!detail || typeof detail !== "object" || (type !== "array" && !isObject)) {
    ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/detail`, "");
    return undefined;
  }
  return (inner, targetPath) => {
    const outer = ctx.uiFrame;
    ctx.uiFrame = isObject
      ? { root: inner, names: outer.names, elements: outer.elements, refPrefix: outer.refPrefix, base: frameScope(scope, outer) }
      : { root: inner, names: new Map(), elements: new Map(), refPrefix: "panel." };
    const elements = walkUiNode(detail, `${sourcePtr}/options/detail`, targetPath, ctx, depth + 1, true);
    // The layout replaces the data walk, so the object's (or the items') conditionals are read here,
    // through the Controls it made. A pointer is the scope, as `mapProperty`'s are.
    if (isObject) applyFrameConditionals(target, scope, ctx);
    else if (target.items) applyFrameConditionals(target.items, `${scope}/items`, ctx);
    ctx.uiFrame = outer;
    return elements;
  };
}

/**
 * Walk a JSONForms UI node into SurveyJS elements. Layout nodes nest into
 * panels; a root Vertical/Horizontal layout is flattened (no redundant wrapper).
 */
function walkUiNode(node: unknown, sourcePtr: string, targetPath: string, ctx: Ctx, depth: number, root: boolean): SurveyJSONElement[] {
  if (!node || typeof node !== "object") return [];
  const ui = node as UiNode;
  switch(ui.type) {
    // A ListWithDetail is an array Control shown as a master list beside one item's detail form; the
    // dynamic panel shows every item, so only that presentation is lost.
    case "ListWithDetail":
    case "Control": {
      if (typeof ui.scope !== "string") {
        ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, sourcePtr, "");
        return [];
      }
      const frame = ctx.uiFrame;
      const resolved = resolveScope(ui.scope, frame.root, ctx.root);
      if (!resolved) {
        ctx.report.unsupported(JsonSchemaCodes.UNRESOLVED_SCOPE, `${sourcePtr}/scope`, "");
        return [];
      }
      const hint = jsonFormsHint(ui, ctx, sourcePtr);
      hint.template = readDetail(ui, ui.scope, resolved.schema, sourcePtr, ctx, depth);
      const el = mapProperty(resolved.name, resolved.schema, ui.scope, targetPath, ctx, resolved.required, hint, depth, frame.refPrefix);
      if (!el) return [];
      if (ui.type === "ListWithDetail") ctx.report.dropped(JsonSchemaCodes.DROPPED_STYLING, `${sourcePtr}/type`, targetPath);
      if (!readLabel(ui.label).show) el.titleLocation = "hidden";
      applyReadonlyOption(ui, el);
      applyControlOptions(ui, el, mergeAllOf(resolveRef(resolved.schema, ctx).schema, sourcePtr, { ...ctx, report: quietReport }), sourcePtr, ctx);
      const scope = frameScope(ui.scope, frame);
      registerScope(scope, el, frame);
      if (el.type === "panel") shareObjectFields(scope, el, frame, ctx);
      recordUiRule(ui, el, sourcePtr, targetPath, ctx);
      return [el];
    }
    case "Group": {
      const label = readLabel(ui.label);
      const panel: SurveyJSONElement = { type: "panel", name: containerName(labelToName(label.text, "group"), ctx) };
      if (label.text !== undefined && label.show) panel.title = label.text;
      recordUiRule(ui, panel, sourcePtr, targetPath, ctx);
      const elements = walkUiChildren(ui, sourcePtr, `${targetPath}.elements`, ctx, depth + 1);
      if (elements.length > 0) panel.elements = elements;
      return [panel];
    }
    case "VerticalLayout":
    case "HorizontalLayout": {
      const elements = walkUiChildren(ui, sourcePtr, root ? targetPath : `${targetPath}.elements`, ctx, depth + 1);
      if (root) {
        // The outermost layout is the form body, with no element to carry a rule.
        reportRootRule(ui, sourcePtr, ctx);
        return elements;
      }
      const panel: SurveyJSONElement = { type: "panel", name: containerName("layout", ctx) };
      recordUiRule(ui, panel, sourcePtr, targetPath, ctx);
      if (elements.length > 0) panel.elements = elements;
      return [panel];
    }
    case "Categorization": {
      // Below the form root a Categorization cannot be pages: each Category becomes a titled panel,
      // and the Categorization a panel around them.
      const panel: SurveyJSONElement = { type: "panel", name: containerName(labelToName(readLabel(ui.label).text, "categorization"), ctx) };
      recordUiRule(ui, panel, sourcePtr, targetPath, ctx);
      const elements = walkUiChildren(ui, sourcePtr, `${targetPath}.elements`, ctx, depth + 1);
      if (elements.length > 0) panel.elements = elements;
      return [panel];
    }
    case "Category": {
      const label = readLabel(ui.label);
      const panel: SurveyJSONElement = { type: "panel", name: containerName(labelToName(label.text, "category"), ctx) };
      if (label.text !== undefined && label.show) panel.title = label.text;
      recordUiRule(ui, panel, sourcePtr, targetPath, ctx);
      const elements = walkUiChildren(ui, sourcePtr, `${targetPath}.elements`, ctx, depth + 1);
      if (elements.length > 0) panel.elements = elements;
      return [panel];
    }
    case "Label": {
      const html: SurveyJSONElement = { type: "html", name: containerName("label", ctx), html: String(ui.text ?? readLabel(ui.label).text ?? "") };
      recordUiRule(ui, html, sourcePtr, targetPath, ctx);
      return [html];
    }
    default:
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/type`, "");
      return [];
  }
}

function walkUiChildren(ui: UiNode, sourcePtr: string, targetPath: string, ctx: Ctx, depth: number): SurveyJSONElement[] {
  const out: SurveyJSONElement[] = [];
  const children = Array.isArray(ui.elements) ? ui.elements : [];
  children.forEach((child, i) => {
    out.push(...walkUiNode(child, `${sourcePtr}/elements/${i}`, `${targetPath}[${out.length}]`, ctx, depth, false));
  });
  return out;
}

function reportRootRule(ui: UiNode, sourcePtr: string, ctx: Ctx): void {
  if (ui.rule) ctx.report.assumed(JsonSchemaCodes.ASSUMED_UI_RULE, `${sourcePtr}/rule`, "");
}

function labelToName(label: unknown, fallback: string): string {
  if (typeof label !== "string" || label.length === 0) return fallback;
  // Join the alphanumeric runs rather than replacing separators and then trimming underscores:
  // a `/^_+|_+$/` trim backtracks quadratically on long underscore runs coming from library input.
  const cleaned = (label.match(/[a-zA-Z0-9]+/g) || []).join("_").toLowerCase();
  return cleaned.length > 0 ? cleaned : fallback;
}

// Pages from a JSONForms `Categorization` at the form root: each child becomes a page. A
// `Category` child's elements go on the page; a child `Categorization` becomes a page holding one
// panel per `Category`. A rule on a child goes on its page; one on the Categorization itself has
// no element and is reported.
function buildCategorization(ui: UiNode, sourcePtr: string, ctx: Ctx): SurveyJSONPage[] {
  reportRootRule(ui, sourcePtr, ctx);
  const categories = Array.isArray(ui.elements) ? ui.elements : [];
  const pages: SurveyJSONPage[] = [];
  categories.forEach((cat, i) => {
    if (!cat || typeof cat !== "object") return;
    const c = cat as UiNode;
    const ptr = `${sourcePtr}/elements/${i}`;
    const targetPath = `pages[${pages.length}]`;
    const label = readLabel(c.label);
    const page: SurveyJSONPage = { name: containerName(labelToName(label.text, `page${i + 1}`), ctx), elements: [] };
    if (label.text !== undefined && label.show) page.title = label.text;
    recordUiRule(c, page, ptr, targetPath, ctx);
    // A child Categorization's children are Categories, which `walkUiNode` makes panels.
    page.elements = walkUiChildren(c, ptr, `${targetPath}.elements`, ctx, 1);
    pages.push(page);
  });
  return pages;
}

// --- JSONForms rules -----------------------------------------------------------

function resolveUiRules(ctx: Ctx): void {
  for (const record of ctx.uiRules) {
    const { effect, condition } = record.rule;
    const expr = translateUiCondition(condition, record.frame);
    const isEnablement = effect === "ENABLE" || effect === "DISABLE" || effect === "WRITABLE" || effect === "READONLY";
    // The rule decides enablement alone in JSONForms, so `readonly` and `schema.readOnly` give way.
    if (isEnablement) delete record.target.readOnly;
    if (expr === undefined || !(isEnablement || effect === "SHOW" || effect === "HIDE")) {
      ctx.report.assumed(JsonSchemaCodes.ASSUMED_UI_RULE, record.sourcePtr, record.targetPath);
      continue;
    }
    const target = record.target as Record<string, unknown>;
    // `!` and not `not`: survey-core reads `not ({a} = 1)` as true when `a` is 1.
    if (effect === "SHOW") target.visibleIf = expr;
    else if (effect === "HIDE") target.visibleIf = `!(${expr})`;
    else if (effect === "ENABLE" || effect === "WRITABLE") target.enableIf = expr;
    else target.enableIf = `!(${expr})`;
  }
}

// JSONForms' `evaluateCondition`: AND and OR by `type`, a LEAF compares the value with
// `expectedValue`, a condition with a `schema` validates the value against it. A `validate`
// function, or any other shape, has no expression.
function translateUiCondition(cond: unknown, frame: UiFrame): string | undefined {
  if (!cond || typeof cond !== "object") return undefined;
  const c = cond as { type?: unknown, conditions?: unknown, scope?: unknown, expectedValue?: unknown, schema?: unknown, failWhenUndefined?: unknown };
  if (c.type === "AND" || c.type === "OR") {
    if (!Array.isArray(c.conditions) || c.conditions.length === 0) return undefined;
    const parts = c.conditions.map((x) => translateUiCondition(x, frame));
    if (parts.some((p) => p === undefined)) return undefined;
    return `(${parts.join(c.type === "AND" ? " and " : " or ")})`;
  }
  if (typeof c.scope !== "string") return undefined;
  if (c.type === "LEAF") {
    const ref = scopeRef(c.scope, frame);
    const lit = isPrimitive(c.expectedValue) ? formatLiteral(c.expectedValue) : undefined;
    return ref !== undefined && lit !== undefined ? `${ref} = ${lit}` : undefined;
  }
  if ("schema" in c) {
    const term = schemaTerm(c.scope, c.schema, frame);
    if (term === undefined || c.failWhenUndefined !== true) return term;
    // With failWhenUndefined, an absent value fails before the schema is checked.
    const ref = scopeRef(c.scope, frame);
    return ref === undefined ? undefined : `(${ref} notempty and ${term})`;
  }
  return undefined;
}

function isPrimitive(value: unknown): boolean {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

// The expression for the value at `scope` validating against `schema`, as `ajv.validate` does with
// an absent value: `const` and `enum` fail on it, and `not` and an absent optional property pass.
function schemaTerm(scope: string, schema: unknown, frame: UiFrame): string | undefined {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return undefined;
  const s = schema as JsonSchemaDoc & { not?: unknown };
  const keys = Object.keys(s).filter((k) => k !== "type");
  if (keys.length === 1 && keys[0] === "const") {
    const ref = scopeRef(scope, frame);
    const lit = formatLiteral(s.const);
    return ref !== undefined && lit !== undefined ? `${ref} = ${lit}` : undefined;
  }
  if (keys.length === 1 && keys[0] === "enum" && Array.isArray(s.enum) && s.enum.length > 0) {
    const ref = scopeRef(scope, frame);
    const lits = s.enum.map((v) => formatLiteral(v));
    if (ref === undefined || lits.some((lit) => lit === undefined)) return undefined;
    return `(${lits.map((lit) => `${ref} = ${lit}`).join(" or ")})`;
  }
  if (keys.length === 1 && keys[0] === "not") {
    const inner = schemaTerm(scope, s.not, frame);
    return inner === undefined ? undefined : `!(${inner})`;
  }
  if (keys.length > 0 && keys.every((k) => k === "properties" || k === "required")) {
    // An object scope: one term per property. A required property must be present; an optional
    // one passes when absent.
    const base = scope === "#" ? "#" : scope;
    const required = new Set(Array.isArray(s.required) ? s.required : []);
    const names = new Set([...Object.keys(s.properties ?? {}), ...required]);
    if (names.size === 0) return undefined;
    const terms: string[] = [];
    for (const name of names) {
      const sub = `${base}/properties/${name}`;
      const ref = scopeRef(sub, frame);
      if (ref === undefined) return undefined;
      const propSchema = s.properties?.[name];
      const term = propSchema === undefined ? undefined : schemaTerm(sub, propSchema, frame);
      if (propSchema !== undefined && term === undefined) return undefined;
      if (required.has(name)) terms.push(term === undefined ? `${ref} notempty` : `(${ref} notempty and ${term})`);
      else if (term !== undefined) terms.push(`(${ref} empty or ${term})`);
    }
    return terms.length > 0 ? `(${terms.join(" and ")})` : undefined;
  }
  return undefined;
}

// The expression reference to the Control on `scope`, or `undefined` when no Control has it.
function scopeRef(scope: string, frame: UiFrame): string | undefined {
  const name = frame.names.get(frameScope(scope, frame));
  return name === undefined ? undefined : `{${frame.refPrefix}${name}}`;
}

// --- JSONForms schema conditionals ------------------------------------------------

// The `if`/`then`/`else` and dependencies of a frame's object, read once its layout is walked: the
// root schema after the UI walk, an object or an array's items after a `detail` layout. JSONForms
// shows and hides only by `rule` and reads these only to validate, so a branch gives `requiredIf`
// only. A key is the Control on `#/properties/<key>` in the frame, read by its data key (from the
// row, in an array's detail); a key with no Control has nothing to read or mark, and an `if` or a
// trigger on it is reported as the data walk reports it. A Control on the frame's object itself
// (`#`) walked its data, and its conditionals with it, so they are not read again.
function applyFrameConditionals(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): void {
  const frame = ctx.uiFrame;
  if (frame.elements.has(frameScope("#", frame))) return;
  const scope = (key: string) => `#/properties/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`;
  const fields: ObjectFields = {
    ref: (key) => scopeRef(scope(key), frame),
    elements: (key) => frame.elements.get(frameScope(scope(key), frame)) ?? []
  };
  readFrameConditionals(schema, sourcePtr, ctx, fields, new Set());
}

// The conditionals of `raw`, its `$ref` followed, and of its `allOf`, `anyOf` and `oneOf` entries.
// An `allOf` entry holds as the schema does, and so does the only entry of an `anyOf` or `oneOf`.
// With several entries the one that must hold is not known: their conditionals are reported
// (`fields` is undefined), not applied. A remote `$ref` is reported unless the walk already did.
function readFrameConditionals(raw: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields | undefined, seen: Set<object>): void {
  const resolved = resolveRef(raw, ctx);
  if (resolved.remote) {
    if (!ctx.remoteRefs.has(sourcePtr)) reportRemoteRef(sourcePtr, "", ctx);
    return;
  }
  const schema = resolved.schema;
  if (seen.has(schema)) return;
  seen.add(schema);
  if (fields) {
    applyIfThenElse(schema, sourcePtr, ctx, fields);
    applyDependencies(schema, sourcePtr, ctx, fields);
  } else {
    if (schema.if && branchRequires(schema)) ctx.report.assumed(JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, `${sourcePtr}/if`, "");
    for (const key of ["dependencies", "dependentRequired", "dependentSchemas"] as const) {
      for (const trigger of Object.keys(schema[key] ?? {})) ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/${key}/${trigger}`, "");
    }
  }
  for (const key of ["allOf", "anyOf", "oneOf"] as const) {
    const entries = schema[key];
    if (!Array.isArray(entries)) continue;
    entries.forEach((entry, i) => {
      if (!isPlainObject(entry)) return;
      const holds = key === "allOf" || entries.length === 1;
      readFrameConditionals(entry, `${sourcePtr}/${key}/${i}`, ctx, holds ? fields : undefined, seen);
    });
  }
}

// --- entry point ------------------------------------------------------------

/**
 * Convert a JSON Schema (optionally with a UI schema) to SurveyJS survey JSON.
 *
 * Never throws on an unsupported keyword -- those are recorded in the report.
 * Throws only for input that is not a JSON Schema at all.
 */
export function convert(input: unknown): ConversionResult<SurveyJSON> {
  const { schema, uiSchema } = normalizeInput(input);
  const report = new ReportBuilder(SOURCE);
  const uiKind = detectUiKind(uiSchema);
  const ctx: Ctx = {
    report,
    usedNames: new Set<string>(),
    reservedNames: uiKind === "jsonforms" ? collectPropertyNames(schema) : new Set<string>(),
    uiKind,
    remoteRefs: new Set<string>(),
    root: schema,
    uiFrame: { root: schema, names: new Map(), elements: new Map(), refPrefix: "" },
    uiRules: [],
    objectFields: new WeakMap(),
    reportedUi: new Set<string>()
  };

  const output: SurveyJSON = {};
  if (typeof schema.title === "string" && schema.title.length > 0) output.title = schema.title;
  if (typeof schema.description === "string" && schema.description.length > 0) output.description = schema.description;

  if (uiKind === "jsonforms") {
    const ui = uiSchema as UiNode;
    // A Categorization at the root, or as the only child of the root layout, becomes pages.
    const onlyChild = Array.isArray(ui.elements) && ui.elements.length === 1 ? ui.elements[0] as UiNode : undefined;
    const isRootLayout = ui.type === "VerticalLayout" || ui.type === "HorizontalLayout";
    if (ui.type === "Categorization") {
      output.pages = buildCategorization(ui, "#/uiSchema", ctx);
    } else if (isRootLayout && onlyChild?.type === "Categorization") {
      reportRootRule(ui, "#/uiSchema", ctx);
      output.pages = buildCategorization(onlyChild, "#/uiSchema/elements/0", ctx);
    } else {
      output.elements = walkUiNode(ui, "#/uiSchema", "elements", ctx, 0, true);
    }
    applyFrameConditionals(ctx.root, "#", ctx);
    resolveUiRules(ctx);
    return { output, report: report.build() };
  }

  // Bare schema / RJSF uiSchema / Uniforms (no layout data) -> data walk.
  const rjsfUi: RjsfNode | undefined = uiKind === "rjsf" ? { node: uiSchema as Record<string, unknown>, ptr: "#/uiSchema" } : undefined;
  // The root node's own options: `order` is read by the walk, `title` and `description` title the
  // form, and the rest is reported here.
  const rootHint = rjsfHint(rjsfUi, ctx);
  checkWidget(rootHint, "object", ctx);
  if (rootHint.title !== undefined) output.title = rootHint.title;
  if (rootHint.description !== undefined) output.description = rootHint.description;

  // A top-level discriminated oneOf becomes one page per variant.
  const merged = mergeAllOf(schema, "#", ctx);
  const topDiscriminator = detectDiscriminator(merged, ctx);
  const hasProperties = !!merged.properties && Object.keys(merged.properties).length > 0;
  // `help` describes the form when it has no description. A lone scalar root takes it as its own.
  if (topDiscriminator || hasProperties || merged.oneOf || merged.if || merged.dependencies) {
    if (rootHint.help !== undefined && output.description === undefined) {
      output.description = rootHint.help;
      consumeOption(rootHint, "help");
    }
    reportPending(rootHint, ctx);
  }
  if (topDiscriminator && !hasProperties) {
    output.pages = buildDiscriminatorPages(merged, topDiscriminator, ctx, rjsfUi);
    return { output, report: report.build() };
  }

  if (hasProperties || merged.oneOf || merged.if || merged.dependencies) {
    output.elements = walkObject(schema, "#", "elements", ctx, rjsfUi, 0);
  } else {
    // Root is a single scalar/array schema -> one question.
    const el = mapProperty(String(schema.title ?? "value"), schema, "#", "elements[0]", ctx, false, rootHint, 0);
    output.elements = el ? [el] : [];
  }

  return { output, report: report.build() };
}

/** Top-level discriminated oneOf -> a selector page plus one page per variant. */
function buildDiscriminatorPages(
  schema: JsonSchemaDoc,
  d: Discriminated,
  ctx: Ctx,
  rjsfUi: RjsfNode | undefined
): SurveyJSONPage[] {
  if (!d.explicit) ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, "#/oneOf", "pages");
  const selectorName = uniqueName(d.disc, ctx);
  const selector: SurveyJSONElement = {
    type: "dropdown",
    name: selectorName,
    choices: d.variants.map((v) => ({ value: v.value })),
    isRequired: true
  };
  const discSchema = schema.properties?.[d.disc];
  if (discSchema?.title !== undefined) selector.title = String(discSchema.title);

  const pages: SurveyJSONPage[] = [{ name: uniqueName("page1", ctx), elements: [selector] }];
  for (const variant of d.variants) {
    const variantProps: Record<string, JsonSchemaDoc> = { ...variant.schema.properties };
    delete variantProps[d.disc];
    const variantSchema: JsonSchemaDoc = { ...variant.schema, properties: variantProps };
    const page: SurveyJSONPage = {
      name: uniqueName(`${d.disc}_${String(variant.value)}`, ctx),
      elements: walkObject(variantSchema, `#/oneOf/${variant.index}`, `pages[${variant.index + 1}].elements`, ctx, rjsfUi, 1)
    };
    // A variant whose value cannot be written as a literal stays visible, reported.
    const lit = formatLiteral(variant.value);
    if (lit !== undefined) page.visibleIf = `{${selectorName}} = ${lit}`;
    else ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, `#/oneOf/${variant.index}`, `pages[${variant.index + 1}]`);
    if (variant.schema.title !== undefined) page.title = String(variant.schema.title);
    pages.push(page);
  }
  return pages;
}

export { JsonSchemaCodes } from "./codes";
export type { ConversionResult } from "../report";
