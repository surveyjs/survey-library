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
// that emits JSON Schema already converts here. See promts/04-docs-*.
//
// SETTLED MODELLING DECISIONS (do not re-open in review -- see promts/02-json-schema.md).
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
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
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
}

interface Ctx {
  report: ReportBuilder;
  usedNames: Set<string>;
  root: JsonSchemaDoc;
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

/**
 * Resolve `$ref` chains. Local refs are followed against the root; a remote ref
 * (anything not starting with `#`) is out of scope for a client-side converter
 * -> `{ remote: true }`. Returns the effective schema otherwise.
 */
function resolveRef(schema: JsonSchemaDoc, ctx: Ctx): { schema: JsonSchemaDoc, remote?: boolean } {
  let s = schema;
  const seen = new Set<string>();
  while(s && typeof s.$ref === "string") {
    const ref = s.$ref;
    if (!ref.startsWith("#")) return { schema: s, remote: true };
    if (seen.has(ref)) return { schema: {} }; // direct cycle
    seen.add(ref);
    const target = resolvePointer(ctx.root, ref);
    if (!target) return { schema: {} }; // dangling local ref
    s = target;
  }
  return { schema: s ?? {} };
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

  schema.allOf.forEach((sub, i) => {
    const resolved = resolveRef(sub, ctx);
    if (resolved.remote) {
      ctx.report.dropped(JsonSchemaCodes.DROPPED_REMOTE_REF, `${sourcePtr}/allOf/${i}`, "");
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
    for (const r of part.required ?? []) required.add(r);
    // Carry through composition keywords a subschema may add.
    for (const key of ["if", "then", "else", "oneOf", "discriminator", "dependencies", "dependentRequired", "dependentSchemas"] as const) {
      if (merged[key] === undefined && part[key] !== undefined) (merged as Record<string, unknown>)[key] = part[key];
    }
  });

  merged.properties = props;
  if (required.size > 0) merged.required = [...required];
  return merged;
}

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

/** SurveyJS `choices` from `enum` or an `oneOf`/`anyOf` of `const`s. */
function readChoices(schema: JsonSchemaDoc): { value: unknown, text?: string }[] | undefined {
  if (Array.isArray(schema.enum)) {
    return schema.enum.filter((v) => v !== null).map((v) => ({ value: v }));
  }
  const branches = schema.oneOf ?? schema.anyOf;
  if (Array.isArray(branches) && branches.every((b) => b && typeof b === "object" && "const" in b)) {
    return branches.map((b) => {
      const c = (b as JsonSchemaDoc).const;
      const title = (b as JsonSchemaDoc).title;
      return title !== undefined ? { value: c, text: String(title) } : { value: c };
    });
  }
  return undefined;
}

// --- expression helpers -----------------------------------------------------

/** Quote a value for a SurveyJS expression literal. */
function fmt(value: unknown): string {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return `'${String(value ?? "")}'`;
}

function combineAnd(existing: string | undefined, cond: string): string {
  return existing ? `(${existing}) and (${cond})` : cond;
}

/**
 * Build positive and negated SurveyJS expressions from an `if` subschema. Only
 * the provable subset is handled (`properties[k].const` and `properties[k].enum`,
 * ANDed across keys). Returns `undefined` when the `if` cannot be expressed --
 * the caller then flags ASSUMED_IF_THEN_ELSE instead of guessing a branch.
 */
function ifToExpression(ifSchema: JsonSchemaDoc): { pos: string, neg: string } | undefined {
  const props = ifSchema.properties;
  if (!props || Object.keys(props).length === 0) return undefined;
  const pos: string[] = [];
  const neg: string[] = [];
  for (const [k, cond] of Object.entries(props)) {
    if (cond && cond.const !== undefined) {
      pos.push(`{${k}} = ${fmt(cond.const)}`);
      neg.push(`{${k}} <> ${fmt(cond.const)}`);
    } else if (cond && Array.isArray(cond.enum)) {
      pos.push("(" + cond.enum.map((v) => `{${k}} = ${fmt(v)}`).join(" or ") + ")");
      neg.push("(" + cond.enum.map((v) => `{${k}} <> ${fmt(v)}`).join(" and ") + ")");
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
}

/**
 * Walk an object schema's `properties` (plus its composition keywords) into a
 * flat list of SurveyJS elements. `rjsfUi` supplies per-property widget/order
 * hints (empty for JSONForms / bare schemas).
 */
function walkObject(
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  rjsfUi: Record<string, unknown> | undefined,
  depth: number
): SurveyJSONElement[] {
  const merged = mergeAllOf(schema, sourcePtr, ctx);
  const state: WalkState = { elements: [], byProp: new Map() };
  const requiredSet = new Set(merged.required ?? []);
  const order = orderKeys(Object.keys(merged.properties ?? {}), rjsfUi);

  for (const key of order) {
    const sub = merged.properties![key];
    const hint = rjsfHint(rjsfUi?.[key]);
    const el = mapProperty(key, sub, `${sourcePtr}/properties/${key}`, `${targetPath}[${state.elements.length}]`, ctx, requiredSet.has(key), hint, depth);
    if (el) {
      state.elements.push(el);
      state.byProp.set(key, el);
    }
  }

  applyIfThenElse(merged, sourcePtr, targetPath, ctx, state, depth);
  applyDependencies(merged, sourcePtr, targetPath, ctx, state, depth);
  appendOneOfVariants(merged, sourcePtr, targetPath, ctx, state, "panel", depth);

  return state.elements;
}

/** RJSF `ui:order` reordering; unlisted keys fill the `"*"` slot (or append). */
function orderKeys(keys: string[], rjsfUi: Record<string, unknown> | undefined): string[] {
  const order = rjsfUi?.["ui:order"];
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
  depth: number
): SurveyJSONElement | null {
  const resolved = resolveRef(rawSchema, ctx);
  if (resolved.remote) {
    // Client-side converter does not fetch -- emit a bare text so the form still
    // builds, and raise the drop alarm.
    ctx.report.dropped(JsonSchemaCodes.DROPPED_REMOTE_REF, sourcePtr, targetPath);
    const el: SurveyJSONElement = { type: "text", name: uniqueName(name, ctx) };
    applyTitleDesc(rawSchema, el, hint);
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
    return mapObjectPanel(name, schema, sourcePtr, targetPath, ctx, required, depth);
  }
  if (type === "array") {
    return mapArray(name, schema, sourcePtr, targetPath, ctx, required, hint, depth);
  }

  const qname = uniqueName(name, ctx);
  let el: SurveyJSONElement;
  const choices = readChoices(schema);

  if (hint.widget === "hidden") {
    el = { type: "text", name: qname, visible: false };
  } else if (type === "boolean") {
    el = { type: "boolean", name: qname };
  } else if ((type === "integer" || type === "number") && !choices) {
    el = { type: "text", name: qname, inputType: "number" };
  } else if (choices) {
    // string + enum / oneOf-const -> single-select. dropdown by default;
    // radiogroup when a UI hint asks for it.
    const wantRadio = hint.widget === "radio" || hint.format === "radio";
    el = { type: wantRadio ? "radiogroup" : "dropdown", name: qname, choices };
  } else if (hint.widget === "textarea") {
    el = { type: "comment", name: qname };
  } else {
    // string (or untyped scalar) -> text, refined by format / widget inputType.
    el = { type: "text", name: qname };
    const inputType = textInputType(schema, hint);
    if (inputType) el.inputType = inputType;
  }

  applyTitleDesc(schema, el, hint);
  applyScalarMeta(schema, el, required, ctx, sourcePtr);
  if (hint.hidden) el.visible = false;
  if (schema.readOnly) el.readOnly = true;
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
  range: "number"
};

/** Map an object schema to a SurveyJS `panel`, recursing into its properties. */
function mapObjectPanel(
  name: string,
  schema: JsonSchemaDoc,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  required: boolean,
  depth: number
): SurveyJSONElement {
  const panel: SurveyJSONElement = { type: "panel", name: uniqueName(name, ctx) };
  if (schema.title !== undefined) panel.title = String(schema.title);
  if (schema.description !== undefined) panel.description = String(schema.description);
  const elements = walkObject(schema, sourcePtr, `${targetPath}.elements`, ctx, undefined, depth + 1);
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
  if (itemsResolved.remote) ctx.report.dropped(JsonSchemaCodes.DROPPED_REMOTE_REF, `${sourcePtr}/items`, targetPath);

  const itemChoices = readChoices(items);
  const qname = uniqueName(name, ctx);

  if (itemChoices) {
    // Multi-select. checkbox by default; tagbox when a UI hint prefers a compact
    // multi-select.
    const wantTagbox = hint.multi === true || hint.widget === "tagbox" || hint.format === "combo";
    const el: SurveyJSONElement = { type: wantTagbox ? "tagbox" : "checkbox", name: qname, choices: itemChoices };
    applyTitleDesc(schema, el, hint);
    if (required) el.isRequired = true;
    if (hint.hidden) el.visible = false;
    return el;
  }

  if (effectiveType(items) === "object") {
    // Repeating group of objects -> dynamic panel; item properties -> template.
    const el: SurveyJSONElement = { type: "paneldynamic", name: qname };
    applyTitleDesc(schema, el, hint);
    const template = walkObject(items, `${sourcePtr}/items`, `${targetPath}.templateElements`, ctx, undefined, depth + 1);
    if (template.length > 0) el.templateElements = template;
    if (required) el.isRequired = true;
    return el;
  }

  // Array of primitives without an enum -> tagbox (free-form multi value). No
  // predefined choices; the user can add them after import.
  const el: SurveyJSONElement = { type: "tagbox", name: qname };
  applyTitleDesc(schema, el, hint);
  if (required) el.isRequired = true;
  return el;
}

/** `title`/`description` onto an element, with UI-layer overrides winning. */
function applyTitleDesc(schema: JsonSchemaDoc, el: SurveyJSONElement, hint: UiHint): void {
  const title = hint.title ?? schema.title;
  if (title !== undefined) el.title = String(title);
  const description = hint.description ?? schema.description;
  if (description !== undefined) el.description = String(description);
  if (hint.placeholder !== undefined && (el.type === "text" || el.type === "comment")) {
    el.placeholder = hint.placeholder;
  }
}

/** `default`/validators/`required` onto a scalar element. */
function applyScalarMeta(schema: JsonSchemaDoc, el: SurveyJSONElement, required: boolean, ctx: Ctx, sourcePtr: string): void {
  void ctx;
  void sourcePtr;
  if (schema.default !== undefined && schema.default !== null) el.defaultValue = schema.default;
  if (required) el.isRequired = true;

  const validators: Record<string, unknown>[] = [];
  if (schema.minLength !== undefined || schema.maxLength !== undefined) {
    const t: Record<string, unknown> = { type: "text" };
    if (schema.minLength !== undefined) t.minLength = schema.minLength;
    if (schema.maxLength !== undefined) t.maxLength = schema.maxLength;
    validators.push(t);
  }
  const min = schema.minimum ?? schema.exclusiveMinimum;
  const max = schema.maximum ?? schema.exclusiveMaximum;
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

// --- if/then/else -----------------------------------------------------------

function applyIfThenElse(schema: JsonSchemaDoc, sourcePtr: string, targetPath: string, ctx: Ctx, state: WalkState, depth: number): void {
  if (!schema.if) return;
  const expr = ifToExpression(schema.if);
  if (!expr) {
    // Cannot express the condition -- do not guess a branch.
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, `${sourcePtr}/if`, "");
    return;
  }
  applyBranch(schema.then, expr.pos, `${sourcePtr}/then`, targetPath, ctx, state, depth);
  applyBranch(schema.else, expr.neg, `${sourcePtr}/else`, targetPath, ctx, state, depth);
}

/**
 * Apply a `then`/`else` branch: its `properties` become `visibleIf: <cond>` on
 * the matching questions (creating them if the branch introduces new ones), and
 * its `required` become `requiredIf: <cond>`.
 */
function applyBranch(
  branch: JsonSchemaDoc | undefined,
  cond: string,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  state: WalkState,
  depth: number
): void {
  if (!branch) return;
  for (const [key, sub] of Object.entries(branch.properties ?? {})) {
    let el = state.byProp.get(key);
    if (!el) {
      // Branch introduces a property not in the base object -- materialise it.
      const created = mapProperty(key, sub, `${sourcePtr}/properties/${key}`, `${targetPath}[${state.elements.length}]`, ctx, false, {}, depth);
      if (!created) continue;
      el = created;
      state.elements.push(el);
      state.byProp.set(key, el);
    }
    el.visibleIf = combineAnd(typeof el.visibleIf === "string" ? el.visibleIf : undefined, cond);
  }
  for (const key of branch.required ?? []) {
    const el = state.byProp.get(key);
    if (el) el.requiredIf = combineAnd(typeof el.requiredIf === "string" ? el.requiredIf : undefined, cond);
  }
}

// --- dependencies -----------------------------------------------------------

function applyDependencies(schema: JsonSchemaDoc, sourcePtr: string, targetPath: string, ctx: Ctx, state: WalkState, depth: number): void {
  // draft-07 `dependencies`: value is either an array (property dependency) or a
  // schema (schema dependency).
  for (const [trigger, dep] of Object.entries(schema.dependencies ?? {})) {
    if (Array.isArray(dep)) {
      requireWhenPresent(trigger, dep, state);
      ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependencies/${trigger}`, "");
    } else if (dep && typeof dep === "object") {
      applyBranch(dep, `{${trigger}} notempty`, `${sourcePtr}/dependencies/${trigger}`, targetPath, ctx, state, depth);
      ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependencies/${trigger}`, "");
    }
  }
  // draft 2019-09+ split forms.
  for (const [trigger, keys] of Object.entries(schema.dependentRequired ?? {})) {
    requireWhenPresent(trigger, keys, state);
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependentRequired/${trigger}`, "");
  }
  for (const [trigger, dep] of Object.entries(schema.dependentSchemas ?? {})) {
    applyBranch(dep, `{${trigger}} notempty`, `${sourcePtr}/dependentSchemas/${trigger}`, targetPath, ctx, state, depth);
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/dependentSchemas/${trigger}`, "");
  }
}

function requireWhenPresent(trigger: string, keys: string[], state: WalkState): void {
  const cond = `{${trigger}} notempty`;
  for (const key of keys) {
    const el = state.byProp.get(key);
    if (el) el.requiredIf = combineAnd(typeof el.requiredIf === "string" ? el.requiredIf : undefined, cond);
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
  const discName = state.byProp.get(d.disc)!.name;

  for (const variant of d.variants) {
    const panel: SurveyJSONElement = {
      type: "panel",
      name: uniqueName(`${d.disc}_${String(variant.value)}`, ctx),
      visibleIf: `{${discName}} = ${fmt(variant.value)}`
    };
    if (variant.schema.title !== undefined) panel.title = String(variant.schema.title);
    // Variant panel holds every property except the shared discriminator.
    const variantProps: Record<string, JsonSchemaDoc> = { ...variant.schema.properties };
    delete variantProps[d.disc];
    const variantSchema: JsonSchemaDoc = { ...variant.schema, properties: variantProps };
    const elements = walkObject(variantSchema, `${sourcePtr}/oneOf/${variant.index}`, `${targetPath}[${state.elements.length}].elements`, ctx, undefined, depth + 1);
    if (elements.length > 0) panel.elements = elements;
    state.elements.push(panel);
  }
}

// --- unique names -----------------------------------------------------------

function uniqueName(base: string, ctx: Ctx): string {
  const safe = base && base.length > 0 ? base : "question";
  let name = safe;
  let i = 1;
  while(ctx.usedNames.has(name)) name = `${safe}_${i++}`;
  ctx.usedNames.add(name);
  return name;
}

const MAX_DEPTH = 24;

// --- RJSF uiSchema ----------------------------------------------------------

/** Read a single property's RJSF `ui:*` hints into the shared UiHint shape. */
function rjsfHint(node: unknown): UiHint {
  if (!node || typeof node !== "object") return {};
  const ui = node as Record<string, unknown>;
  const hint: UiHint = {};
  if (typeof ui["ui:widget"] === "string") hint.widget = ui["ui:widget"] as string;
  if (typeof ui["ui:title"] === "string") hint.title = ui["ui:title"] as string;
  if (typeof ui["ui:description"] === "string") hint.description = ui["ui:description"] as string;
  if (typeof ui["ui:placeholder"] === "string") hint.placeholder = ui["ui:placeholder"] as string;
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

/** Resolve a JSONForms `scope` (`#/properties/x/properties/y`) to a property. */
function resolveScope(scope: string, ctx: Ctx): { name: string, schema: JsonSchemaDoc, required: boolean } | undefined {
  const target = resolvePointer(ctx.root, scope);
  if (!target) return undefined;
  const parts = scope.replace(/^#/, "").split("/").filter((p) => p.length > 0);
  const name = parts[parts.length - 1] ?? "field";
  // The owning object sits two segments up (the leaf key and its `properties`
  // keyword) and holds the `required` list for this leaf.
  const owner = resolvePointer(ctx.root, "#/" + parts.slice(0, -2).join("/"));
  const required = Array.isArray(owner?.required) && owner!.required!.includes(name);
  return { name, schema: target, required };
}

/** JSONForms `Control` `options` refinements. */
function jsonFormsHint(node: UiNode, ctx: Ctx, sourcePtr: string): UiHint {
  const hint: UiHint = {};
  if (node.label !== undefined && node.label !== false) hint.title = String(node.label);
  const opts = node.options;
  if (!opts || typeof opts !== "object") return hint;
  for (const [k, v] of Object.entries(opts)) {
    if (k === "format") hint.format = String(v);
    else if (k === "multi") hint.multi = v === true;
    else if (k === "readonly") hint.hidden = false; // handled via schema.readOnly; ignore quietly
    else ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/${k}`, "");
  }
  return hint;
}

/**
 * Walk a JSONForms UI node into SurveyJS elements. Layout nodes nest into
 * panels; a root Vertical/Horizontal layout is flattened (no redundant wrapper).
 */
function walkUiNode(node: unknown, sourcePtr: string, targetPath: string, ctx: Ctx, depth: number, root: boolean): SurveyJSONElement[] {
  if (!node || typeof node !== "object") return [];
  const ui = node as UiNode;
  switch(ui.type) {
    case "Control": {
      if (typeof ui.scope !== "string") {
        ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, sourcePtr, "");
        return [];
      }
      const resolved = resolveScope(ui.scope, ctx);
      if (!resolved) {
        ctx.report.dropped(JsonSchemaCodes.DROPPED_REMOTE_REF, `${sourcePtr}/scope`, "");
        return [];
      }
      const hint = jsonFormsHint(ui, ctx, sourcePtr);
      const el = mapProperty(resolved.name, resolved.schema, ui.scope, targetPath, ctx, resolved.required, hint, depth);
      return el ? [el] : [];
    }
    case "Group": {
      const panel: SurveyJSONElement = { type: "panel", name: uniqueName(labelToName(ui.label, "group"), ctx) };
      if (ui.label !== undefined) panel.title = String(ui.label);
      const elements = walkUiChildren(ui, sourcePtr, `${targetPath}.elements`, ctx, depth + 1);
      if (elements.length > 0) panel.elements = elements;
      return [panel];
    }
    case "VerticalLayout":
    case "HorizontalLayout": {
      const elements = walkUiChildren(ui, sourcePtr, root ? targetPath : `${targetPath}.elements`, ctx, depth + 1);
      if (root) return elements; // outermost layout is the form body -- no wrapper
      const panel: SurveyJSONElement = { type: "panel", name: uniqueName("layout", ctx) };
      if (elements.length > 0) panel.elements = elements;
      return [panel];
    }
    case "Label": {
      const html: SurveyJSONElement = { type: "html", name: uniqueName("label", ctx), html: String(ui.text ?? ui.label ?? "") };
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

function labelToName(label: unknown, fallback: string): string {
  if (typeof label !== "string" || label.length === 0) return fallback;
  const cleaned = label.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  return cleaned.length > 0 ? cleaned : fallback;
}

/** Build pages from a JSONForms `Categorization` (each `Category` -> one page). */
function buildCategorization(ui: UiNode, ctx: Ctx): SurveyJSONPage[] {
  const categories = Array.isArray(ui.elements) ? ui.elements : [];
  const pages: SurveyJSONPage[] = [];
  categories.forEach((cat, i) => {
    if (!cat || typeof cat !== "object") return;
    const c = cat as UiNode;
    const page: SurveyJSONPage = { name: uniqueName(labelToName(c.label, `page${i + 1}`), ctx), elements: [] };
    if (c.label !== undefined) page.title = String(c.label);
    page.elements = walkUiChildren(c, `#/uiSchema/elements/${i}`, `pages[${i}].elements`, ctx, 1);
    pages.push(page);
  });
  return pages;
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
  const ctx: Ctx = { report, usedNames: new Set<string>(), root: schema };

  const output: SurveyJSON = {};
  if (typeof schema.title === "string" && schema.title.length > 0) output.title = schema.title;
  if (typeof schema.description === "string" && schema.description.length > 0) output.description = schema.description;

  const uiKind = detectUiKind(uiSchema);

  if (uiKind === "jsonforms") {
    const ui = uiSchema as UiNode;
    if (ui.type === "Categorization") {
      // Categorization -> pages (each Category is a page).
      output.pages = buildCategorization(ui, ctx);
    } else {
      output.elements = walkUiNode(ui, "#/uiSchema", "elements", ctx, 0, true);
    }
    return { output, report: report.build() };
  }

  // Bare schema / RJSF uiSchema / Uniforms (no layout data) -> data walk.
  const rjsfUi = uiKind === "rjsf" ? (uiSchema as Record<string, unknown>) : undefined;

  // A top-level discriminated oneOf becomes one page per variant.
  const merged = mergeAllOf(schema, "#", ctx);
  const topDiscriminator = detectDiscriminator(merged, ctx);
  if (topDiscriminator && !(merged.properties && Object.keys(merged.properties).length > 0)) {
    output.pages = buildDiscriminatorPages(merged, topDiscriminator, ctx, rjsfUi);
    return { output, report: report.build() };
  }

  if (merged.properties && Object.keys(merged.properties).length > 0 || merged.oneOf || merged.if || merged.dependencies) {
    output.elements = walkObject(schema, "#", "elements", ctx, rjsfUi, 0);
  } else {
    // Root is a single scalar/array schema -> one question.
    const el = mapProperty(String(schema.title ?? "value"), schema, "#", "elements[0]", ctx, false, {}, 0);
    output.elements = el ? [el] : [];
  }

  return { output, report: report.build() };
}

/** Top-level discriminated oneOf -> a selector page plus one page per variant. */
function buildDiscriminatorPages(
  schema: JsonSchemaDoc,
  d: Discriminated,
  ctx: Ctx,
  rjsfUi: Record<string, unknown> | undefined
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
      visibleIf: `{${selectorName}} = ${fmt(variant.value)}`,
      elements: walkObject(variantSchema, `#/oneOf/${variant.index}`, `pages[${variant.index + 1}].elements`, ctx, rjsfUi, 1)
    };
    if (variant.schema.title !== undefined) page.title = String(variant.schema.title);
    pages.push(page);
  }
  return pages;
}

export { JsonSchemaCodes } from "./codes";
export type { ConversionResult } from "../report";
