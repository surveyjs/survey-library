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
//     `if` subschema (`properties[k].const`/`enum`, `required`); a key the `if`
//     does not require satisfies it while empty. `then` properties get
//     `visibleIf: <cond>`; `then.required` -> `requiredIf: <cond>`, several of
//     either joined with `or`; `else` gets the negated condition. An `if` that
//     holds for every value (`true`, `{}`) or none (`false`) applies its branch
//     always, as AJV does. A property two branches give different schemas is
//     shown by the first only, and reported. When the `if` cannot
//     be expressed as a SurveyJS expression (another keyword in it, or a literal
//     survey-core's lenient `=` does not compare exactly -- it even reads some
//     comma numbers, `'1,000'`, as unequal to themselves) we do NOT guess a
//     branch -> ASSUMED_IF_THEN_ELSE, questions stay visible.
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
//   * allOf: merge the subschemas into the parent before walking (we build a
//     form, not a validator), each one's `$ref` followed and its own `allOf`
//     merged first: their `properties` and `required` are added to the
//     parent's. A property several of them declare is the `allOf` of its
//     declarations, merged the same way where it is read; `true` adds nothing,
//     and `false` outweighs the others. A genuine conflict (same key,
//     incompatible `type`), or a keyword two of them set differently
//     (annotations aside), keeps the first and emits ASSUMED_ALLOF_MERGE. Each
//     subschema's conditionals are applied apart.
//
//   * $ref: LOCAL refs (`#/definitions/...`, `#/$defs/...`, `#/properties/...`)
//     are resolved. REMOTE refs (`http(s)://...`, or a `$ref` into another doc)
//     are out of scope for a client-side converter -> DROPPED_REMOTE_REF and the
//     referencing property is emitted as a bare `text` so the form still builds.
//     A keyword beside a `$ref` applies with its target, as AJV 8 applies it: the
//     two are merged as an `allOf` of the `$ref` and the keywords. An annotation
//     beside it wins over the target's, as RJSF reads it; under a JSONForms UI
//     schema the target's stands, as JSONForms renders it.
//
//   * Uniforms has no serializable layout: its ceiling is a flat form from the
//     data schema. Stated here, not spammed per field.

import { ConversionResult, ReportBuilder } from "../report";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { SurveyJSON, SurveyJSONElement, SurveyJSONPage } from "../types";
import { formatLiteral } from "../expression";
import { surveyEmpty, surveyHolds, surveyLiteral } from "../survey-values";
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
  if?: JsonSchemaDoc | boolean;
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
  // JSONForms: the data key of the question on a data path of an array's row, for a label option.
  // The detail layout's frame sets it, or the walk of the items.
  rowKey?: (path: string[]) => string | undefined;
  // RJSF `ui:disabled` / `ui:readonly`.
  readOnly?: boolean;
  // JSONForms: the Control names the data the frame's scopes resolve in (`#`), the form or a row,
  // which is always there: an object Control on it is not an optional object.
  present?: boolean;
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
  // The source pointers a `$ref` the converter cannot follow (remote, or naming nothing) was reported at.
  remoteRefs: Set<string>;
  root: JsonSchemaDoc;
  // JSONForms: the frame scopes resolve in, and the rules waiting for the end of the walk.
  uiFrame: UiFrame;
  uiRules: UiRuleRecord[];
  // For each panel an object's data walk made, the question made for each property. JSONForms reads
  // it to put the fields of an object Control in the scope map.
  objectFields: WeakMap<SurveyJSONElement, Map<string, SurveyJSONElement>>;
  // The document's `$id` declarations, indexed on the first non-local `$ref`.
  ids?: IdIndex;
  // The merged schema each scalar question was made from, for the values it can hold.
  schemaOf: WeakMap<SurveyJSONElement, JsonSchemaDoc>;
  // JSONForms: the source pointer of an object whose conditionals an earlier Control read and
  // reported, so that a data walk on it applies them to its own fields without reporting them again.
  quietConditionalsAt?: string;
  // The source pointers of the objects whose conditionals were read and reported: a JSONForms detail
  // layout and a data walk on one object (or a nested one) report them once, whichever comes first.
  readConditionals: Set<string>;
  // For a source pointer, the schema there with every declaration merged in (see `declaredAt`).
  declared: Map<string, JsonSchemaDoc | undefined>;
  // For such a pointer below the root, the property's (or the items') declaration before the merge.
  declaredNodes: Map<string, JsonSchemaDoc>;
  // The negation of each `if` condition written, to find a visibility that holds always.
  complements: Map<string, string>;
  // For a property's pointer (`<object>/properties/<key>`, the key escaped, see `lossKey`), the
  // pointers of the declarations of it an `allOf` merge of the object dropped: a type conflict, or one
  // a `false` declaration outweighs. Every merge records them, a quiet one too, so that a JSONForms
  // Control on the property reports them.
  mergeLosses: Map<string, Set<string>>;
  // The dropped declarations reported, each once.
  mergeReported: Set<string>;
  // The elements whose requirement holds only while an optional object they belong to holds a value,
  // and the panels whose fields' requirements do: the object's own presence implies that of every
  // object around it, as its fields are theirs too, so an enclosing object adds nothing to them (see
  // `requireWhilePresent`).
  presenceElements: WeakSet<SurveyJSONElement>;
  presencePanels: WeakSet<SurveyJSONElement>;
  // The choice questions whose `minSelectedChoices` holds `minItems` only while they are required, and
  // where the `minItems` is, see `applyItemCounts`.
  minChoices: Map<SurveyJSONElement, { ptr: string, targetPath: string }>;
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
// scope for a client-side converter -> `{ remote: true }`. One that names nothing in the document (a
// pointer or an `$id` fragment that resolves nowhere, or a cycle of refs) cannot be followed either
// -> `{ remote: true, unresolved: true }`. `remote` marks both for the callers, which treat them
// alike; `reportRemoteRef` reports each with its own code. Returns the effective schema otherwise.
// With `siblings`, a schema on the way that sets a keyword beside its `$ref` (see
// `besideRef`) gives the `allOf` of its `$ref` and those keywords instead, for `mergeAllOf` to merge:
// for a caller that merges the schema it gets, or reads it as a merge would.
function resolveRef(schema: JsonSchemaDoc, ctx: Ctx, siblings = false): { schema: JsonSchemaDoc, remote?: boolean, unresolved?: boolean } {
  let s = schema;
  const seen = new Set<string>();
  let beside: JsonSchemaDoc | undefined;
  while(s && typeof s.$ref === "string") {
    if (siblings && !beside) beside = besideRef(s, ctx.uiKind !== "jsonforms");
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
    if (seen.has(key) || !target) return { schema: s, remote: true, unresolved: true }; // a cycle, or a ref naming nothing
    seen.add(key);
    s = target;
  }
  // The chain is followed first, so that a ref it cannot follow is reported as it was.
  return { schema: beside ?? s ?? {} };
}

// The `allOf`s `besideRef` made in one conversion. They are keyed by the caller's schema objects,
// which may be edited between conversions, so each `convert` starts with its own (see `withRefCache`).
interface RefCache {
  // For each schema that sets a keyword beside its `$ref`, the `allOf` of the `$ref` and those
  // keywords that `besideRef` gives with the annotations, one per schema, so that a merge that meets
  // it again knows it.
  siblings: WeakMap<JsonSchemaDoc, JsonSchemaDoc>;
  // The `allOf`s `besideRef` gives without the annotations beside the `$ref`, one per schema.
  constraints: WeakMap<JsonSchemaDoc, JsonSchemaDoc>;
  // The `allOf`s `siblings` and `constraints` hold: both entries sit at the schema's own pointer.
  allOfs: WeakSet<JsonSchemaDoc>;
  // For the `$ref` entry of each such `allOf`, the schema it was taken from, whose base URI it
  // resolves against (see `resolveBundledRef`).
  origins: WeakMap<JsonSchemaDoc, JsonSchemaDoc>;
}

function newRefCache(): RefCache {
  return { siblings: new WeakMap(), constraints: new WeakMap(), allOfs: new WeakSet(), origins: new WeakMap() };
}

let refCache = newRefCache();

// Run `run` with a fresh `refCache`, and give the one before back after it, so that a conversion
// started inside another leaves the outer one's as it was.
function withRefCache<T>(run: () => T): T {
  const outer = refCache;
  refCache = newRefCache();
  try {
    return run();
  } finally {
    refCache = outer;
  }
}

// Keywords beside a `$ref` that neither constrain nor describe the value: a resource's identity and
// definitions, and a comment.
const REF_INERT = new Set(["$id", "$schema", "$anchor", "$defs", "definitions", "$comment"]);

// AJV 8, which JSONForms and RJSF use, applies the keywords beside a `$ref` with the target's, as the
// `allOf` of the two does: that `allOf`, for a schema with a keyword beside its `$ref`. With
// `annotations`, the annotations beside it (`title`, `default`, `readOnly`, ...) are also set on the
// `allOf` itself, so that they win over the target's, as RJSF reads the property
// (`{ ...target, ...beside }`); AJV ignores them. Without, as JSONForms renders the resolved target,
// they are left out, and annotations alone leave the target as it is. Identity, definitions and a
// comment alone leave it too.
function besideRef(schema: JsonSchemaDoc, annotations: boolean): JsonSchemaDoc | undefined {
  const read = (key: string) => key !== "$ref" && !REF_INERT.has(key) && (annotations || !ANNOTATIONS.has(key));
  if (!Object.keys(schema).some(read)) return undefined;
  const cache = annotations ? refCache.siblings : refCache.constraints;
  let both = cache.get(schema);
  if (!both) {
    const { $ref, ...siblings } = schema;
    const ref: JsonSchemaDoc = { $ref };
    refCache.origins.set(ref, schema);
    const rest = Object.fromEntries(Object.entries(siblings).filter(([key]) => annotations || !ANNOTATIONS.has(key)));
    const own = annotations ? Object.fromEntries(Object.entries(siblings).filter(([key]) => ANNOTATIONS.has(key))) : {};
    both = { ...own, allOf: [ref, rest] };
    cache.set(schema, both);
    refCache.allOfs.add(both);
  }
  return both;
}

// The pointer of the `allOf` entry `i` of `schema`, found at `sourcePtr`: where `declarations` or
// `besideRef` put it, or its own place.
function allOfEntryPointer(schema: JsonSchemaDoc, sourcePtr: string, i: number): string {
  if (refCache.allOfs.has(schema)) return sourcePtr;
  return allOfPointers.get(schema)?.[i] ?? `${sourcePtr}/allOf/${i}`;
}

// Report a `$ref` the converter cannot follow at `sourcePtr`: a remote one, or, when `unresolved`, one
// that names nothing in the document. Remember the pointer for a later read of the same schema that
// must not report it again.
function reportRemoteRef(sourcePtr: string, targetPath: string, ctx: Ctx, unresolved = false): void {
  ctx.remoteRefs.add(sourcePtr);
  if (unresolved) ctx.report.unsupported(JsonSchemaCodes.UNRESOLVED_REF, sourcePtr, targetPath);
  else ctx.report.dropped(JsonSchemaCodes.DROPPED_REMOTE_REF, sourcePtr, targetPath);
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
// fragment, if any. `undefined` when no `$id` matches, or the fragment is not a pointer: the reference
// is then remote. A pointer that names nothing in the resource gives no `schema`: the reference names
// nothing in the document.
function resolveBundledRef(node: JsonSchemaDoc, ref: string, ctx: Ctx): { schema: JsonSchemaDoc | undefined, uri: string } | undefined {
  ctx.ids ??= buildIdIndex(ctx.root);
  const base = ctx.ids.base.get(refCache.origins.get(node) ?? node) ?? ctx.ids.base.get(ctx.root) ?? "";
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

// Keywords that only annotate a schema, and constrain no value.
const ANNOTATIONS = new Set(["title", "description", "$comment", "examples", "default", "deprecated", "readOnly", "writeOnly"]);

// Merge the `allOf` entries of `schema` into a copy of it, each entry's `$ref` followed and its own
// `allOf` merged first: their `properties` and `required` are added, and a scalar keyword the parent
// does not set is taken from the first entry that sets it. A property several entries declare is the
// `allOf` of its declarations (`declarations`), merged where the property is read. On a genuine
// per-property conflict (same key, incompatible `type`) the first declaration wins and the other is
// flagged ASSUMED_ALLOF_MERGE, as is a keyword two entries set differently. We deliberately do NOT
// implement full allOf validation semantics -- we build a form, not a validator.
// `merging` holds the schemas this merge has taken in already: an entry that names one of them again
// (a schema several entries name, or one that leads back to a schema being merged) adds nothing, as
// `allOf` holds a schema once however often it is named, so the merge is taken once.
function mergeAllOf(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, merging: Set<object> = new Set()): JsonSchemaDoc {
  if (!Array.isArray(schema.allOf) || schema.allOf.length === 0) return schema;
  merging.add(schema);
  const merged: JsonSchemaDoc = { ...schema };
  delete merged.allOf;
  const props: Record<string, JsonSchemaDoc | boolean> = { ...(schema.properties ?? {}) };
  const required = new Set<string>(schema.required ?? []);
  let hasProperties = schema.properties !== undefined;
  const sources: ConditionalSource[] = [...conditionalSourcesOf(schema, sourcePtr)];
  // Where each property was first declared.
  const propPtr = new Map(Object.keys(props).map((k) => [k, `${sourcePtr}/properties/${escapeSegment(k)}`]));

  let itemsPtr = `${sourcePtr}/items`;
  schema.allOf.forEach((sub, i) => {
    const ptr = allOfEntryPointer(schema, sourcePtr, i);
    const resolved = resolveRef(sub, ctx, true);
    if (resolved.remote) {
      reportRemoteRef(ptr, "", ctx, resolved.unresolved);
      return;
    }
    if (isPlainObject(resolved.schema) && merging.has(resolved.schema)) return;
    if (isPlainObject(resolved.schema)) merging.add(resolved.schema);
    const part = mergeAllOf(resolved.schema, ptr, ctx, merging);
    for (const source of conditionalSourcesOf(part, ptr)) sources.push(source);
    for (const [k, declared] of Object.entries(part.properties ?? {})) {
      const existing = props[k];
      const v = declared as JsonSchemaDoc | boolean;
      if (isPlainObject(existing) && isPlainObject(v) && typesConflict(existing, v)) {
        dropDeclaration(lossKey(sourcePtr, k), `${ptr}/properties/${escapeSegment(k)}`, ctx);
        continue; // keep the first
      }
      const vPtr = `${ptr}/properties/${escapeSegment(k)}`;
      // `true` allows every value and adds nothing: the other declaration stands as it is.
      if (existing === undefined || existing === true) {
        props[k] = v;
        propPtr.set(k, vPtr);
        continue;
      }
      if (v === true) continue;
      // `false` allows no value, whatever the other declaration says: the property takes none, and
      // the declaration it drops is reported at the `false` one.
      if (existing === false || v === false) {
        if (existing !== v) dropDeclaration(lossKey(sourcePtr, k), existing === false ? propPtr.get(k)! : vPtr, ctx);
        if (existing !== false) {
          props[k] = false;
          propPtr.set(k, vPtr);
        }
        continue;
      }
      if (!isPlainObject(existing) || !isPlainObject(v)) continue;
      // Both declarations hold: the property is their `allOf`, which `mergeAllOf` merges where the
      // property is read, each entry from its own pointer and with its `$ref` followed.
      props[k] = declarations(existing, propPtr.get(k)!, v, vPtr);
    }
    if (part.properties !== undefined) hasProperties = true;
    for (const r of part.required ?? []) required.add(r);
    // Carry through composition keywords a subschema may add, and the scalar keywords (`type`,
    // `format`, bounds, `title`, ...) the parent does not set: the first subschema that sets one wins.
    // Both hold in JSON Schema, so a keyword set otherwise by a later one is reported; an annotation
    // only describes, and each schema's conditionals are applied apart (`conditionalSourcesOf`).
    for (const [key, value] of Object.entries(part)) {
      if (ALLOF_NOT_MERGED.has(key) || value === undefined) continue;
      if (merged[key] === undefined) {
        (merged as Record<string, unknown>)[key] = value;
        if (key === "items") itemsPtr = `${ptr}/items`;
      } else if (key === "items" && isPlainObject(merged.items) && isPlainObject(value)) {
        // Both `items` hold for every item, as their `allOf`.
        merged.items = declarations(merged.items, itemsPtr, value, `${ptr}/items`);
      } else if (!ALLOF_UNCHECKED.has(key) && !sameKeyword(key, merged[key], value)) {
        const conflict = `${ptr}/${escapeSegment(key)}`;
        ctx.report.assumed(JsonSchemaCodes.ASSUMED_ALLOF_MERGE, conflict, "");
        // Recorded so that `reportUnheld` does not report the keyword the merge dropped again.
        if (ctx.report !== quietReport) ctx.mergeReported.add(conflict);
      }
    }
  });

  // A merge with no `properties` anywhere stays a scalar schema, not an empty object.
  if (hasProperties) merged.properties = props as Record<string, JsonSchemaDoc>;
  if (required.size > 0) merged.required = [...required];
  conditionalSources.set(merged, sources);
  return merged;
}

// The key of `Ctx.mergeLosses` for the property `key` of the object at `sourcePtr`: the property's
// pointer with the key escaped, as a JSONForms scope writes it (`x/y` is `x~1y`), so that a Control
// finds the losses by its scope's pointer.
function lossKey(sourcePtr: string, key: string): string {
  return `${sourcePtr}/properties/${escapeSegment(key)}`;
}

// A key as a JSON Pointer segment: `~` is `~0` and `/` is `~1` (RFC 6901). `decodeSegment` reads it back.
function escapeSegment(key: string): string {
  return key.replace(/~/g, "~0").replace(/\//g, "~1");
}

// A declaration of the property at `propertyPtr` that a merge drops, at `ptr`: recorded for the
// property (see `Ctx.mergeLosses`), and reported once, unless `ctx` is quiet.
function dropDeclaration(propertyPtr: string, ptr: string, ctx: Ctx): void {
  let losses = ctx.mergeLosses.get(propertyPtr);
  if (!losses) ctx.mergeLosses.set(propertyPtr, losses = new Set());
  losses.add(ptr);
  reportDropped(ptr, ctx);
}

// Report each `false` entry of the `allOf` the schema `merged` at `sourcePtr` was made from: no
// instance meets it, and the merge drops it.
function reportFalseEntries(merged: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): void {
  for (const source of conditionalSourcesOf(merged, sourcePtr)) if ((source.schema as unknown) === false) reportDropped(source.ptr, ctx);
}

// Report a declaration a merge drops, at `ptr`, once.
function reportDropped(ptr: string, ctx: Ctx): void {
  if (ctx.report === quietReport || ctx.mergeReported.has(ptr)) return;
  ctx.mergeReported.add(ptr);
  ctx.report.assumed(JsonSchemaCodes.ASSUMED_ALLOF_MERGE, ptr, "");
}

// Keywords an `allOf` subschema does not copy onto the parent: merged above, a resource's own
// identity and definitions, or `anyOf`, which the walk does not model.
const ALLOF_NOT_MERGED = new Set(["properties", "required", "allOf", "anyOf", "$ref", "$id", "$schema", "$defs", "definitions"]);

// The schema conditionals, which every `allOf` entry applies on its own.
const CONDITIONAL_KEYWORDS = ["if", "then", "else", "dependencies", "dependentRequired", "dependentSchemas"];

// Keywords two `allOf` entries may set differently without a loss: the annotations, and the
// conditionals, each of which is applied.
const ALLOF_UNCHECKED = new Set<string>([...ANNOTATIONS, ...CONDITIONAL_KEYWORDS]);

// A schema whose conditionals hold for an object, and its pointer.
interface ConditionalSource {
  schema: JsonSchemaDoc;
  ptr: string;
}

// For each `allOf` the merge makes of two declarations of one schema (`declarations`), the pointer
// of each entry in the document.
const allOfPointers = new WeakMap<JsonSchemaDoc, string[]>();

// The `allOf` of a schema declared at `existingPtr` (already such an `allOf`, or one schema) and one
// declared at `ptr`, each read from its own pointer.
function declarations(existing: JsonSchemaDoc, existingPtr: string, schema: JsonSchemaDoc, ptr: string): JsonSchemaDoc {
  const prior = allOfPointers.get(existing);
  const both: JsonSchemaDoc = { allOf: prior ? [...existing.allOf!, schema] : [existing, schema] };
  allOfPointers.set(both, prior ? [...prior, ptr] : [existingPtr, ptr]);
  return both;
}

// For each schema `mergeAllOf` made, the schemas whose conditionals hold for it: the schema it was
// made from and each `allOf` entry, in order, as each is a constraint of its own.
const conditionalSources = new WeakMap<JsonSchemaDoc, ConditionalSource[]>();

// The schemas whose conditionals hold for `schema`, found at `sourcePtr`.
function conditionalSourcesOf(schema: JsonSchemaDoc, sourcePtr: string): ConditionalSource[] {
  return conditionalSources.get(schema) ?? [{ schema, ptr: sourcePtr }];
}

// The schemas whose conditionals hold for the object `merged` at `sourcePtr`. Under JSONForms a
// scope resolves to one schema, as JSONForms' `resolveSchema` does, while AJV validates the data with
// every `allOf` entry: a property several entries declare takes the conditionals of each (see
// `declaredAt`), when they include the schema the scope found.
function objectSources(merged: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): ConditionalSource[] {
  const own = conditionalSourcesOf(merged, sourcePtr);
  if (ctx.uiKind !== "jsonforms") return own;
  return declaredSources(own, sourcePtr, ctx) ?? own;
}

// Every declaration of the object at `sourcePtr` (see `declaredAt`), when they include the schemas
// `own` the scope found. Otherwise `undefined`, and each other declaration that constrains the object
// (a conditional or a `required`) is reported, as it is not read.
function declaredSources(own: ConditionalSource[], sourcePtr: string, ctx: Ctx): ConditionalSource[] | undefined {
  const declared = declaredAt(sourcePtr, ctx);
  if (!declared || own.length === 0) return undefined;
  const all = conditionalSourcesOf(declared, sourcePtr);
  if (holdsSources(own, all)) return all;
  for (const other of all) {
    if (own.some((source) => source.schema === other.schema)) continue;
    const constrains = CONDITIONAL_KEYWORDS.some((key) => other.schema[key] !== undefined) || (Array.isArray(other.schema.required) && other.schema.required.length > 0);
    if (constrains) ctx.report.assumed(JsonSchemaCodes.ASSUMED_ALLOF_MERGE, other.ptr, "");
  }
  return undefined;
}

// `keys` without those the merged object `merged` declares `false`: a declaration that allows no
// value outweighs another's.
function withoutFalse(keys: Set<string>, merged: JsonSchemaDoc): Set<string> {
  for (const [key, sub] of Object.entries(merged.properties ?? {})) if ((sub as unknown) === false) keys.delete(key);
  return keys;
}

// The schema at `ptr`, a pointer of `properties` and `items` steps from the root, with the `allOf` of
// each schema on the way merged, so that a property several entries declare carries the
// conditionals of each. `undefined` for any other pointer, or one that leads nowhere.
function declaredAt(ptr: string, ctx: Ctx): JsonSchemaDoc | undefined {
  if (ctx.declared.has(ptr)) return ctx.declared.get(ptr);
  let found: JsonSchemaDoc | undefined;
  const quiet = quietCtx(ctx);
  if (ptr === "#") {
    const root = resolveRef(ctx.root, quiet, true);
    found = root.remote ? undefined : mergeAllOf(root.schema, "#", quiet);
  } else {
    const property = /^(.*)\/properties\/([^/]+)$/.exec(ptr);
    const items = property ? undefined : /^(.*)\/items$/.exec(ptr);
    const parent = property || items ? declaredAt((property ?? items)![1], ctx) : undefined;
    const next = !parent ? undefined : property ? parent.properties?.[decodeSegment(property[2])] : parent.items;
    const resolved = isPlainObject(next) ? resolveRef(next, quiet, true) : undefined;
    found = resolved && !resolved.remote ? mergeAllOf(resolved.schema, ptr, quiet) : undefined;
    if (found) ctx.declaredNodes.set(ptr, resolved!.schema);
  }
  ctx.declared.set(ptr, found);
  return found;
}

// The schema a JSONForms Control at `schemaPtr` maps: the property's declaration (every one, as an
// `allOf`, see `declarations`), when it holds the schema the scope found, `found`, so that another
// declaration's constraint is merged as the data walk merges it; `found` otherwise, and each
// declaration it does not hold that sets a keyword `found` does not is reported, as AJV validates the
// data with it. The declaration is looked up at `declPtr`, the data's (see `declarationPointer`). A
// `true` found schema constrains nothing, and is held by any. The declarations of the property the
// merge of its object drops are reported, as on the data walk; `undefined`, for no question, when one
// of them is `false`, which allows no value.
function controlSchema(found: JsonSchemaDoc, schemaPtr: string, declPtr: string, ctx: Ctx): JsonSchemaDoc | undefined {
  const declared = declaredAt(declPtr, ctx);
  for (const ptr of ctx.mergeLosses.get(declPtr) ?? []) reportDropped(ptr, ctx);
  const property = /^(.*)\/properties\/([^/]+)$/.exec(declPtr);
  if (property && (declaredAt(property[1], ctx)?.properties?.[decodeSegment(property[2])] as unknown) === false) return undefined;
  const node = ctx.declaredNodes.get(declPtr);
  if (!declared || node === undefined) return found;
  const target = resolveRef(found, quietCtx(ctx), true);
  if (target.remote) return found;
  const merged = mergeAllOf(target.schema, schemaPtr, quietCtx(ctx));
  const own = conditionalSourcesOf(merged, schemaPtr);
  const all = conditionalSourcesOf(declared, declPtr);
  if (holdsSources(own, all)) return node;
  for (const other of all) {
    if (!own.some((source) => source.schema === other.schema) && setsMore(other.schema, merged)) reportDropped(other.ptr, ctx);
  }
  return found;
}

// Whether the declaration `schema` constrains a value more than `merged` does: it is `false`, or sets
// a keyword `merged` does not set alike. Annotations, identity and definitions constrain nothing, and
// an `allOf` is read through its entries, each a declaration of its own.
function setsMore(schema: unknown, merged: JsonSchemaDoc): boolean {
  if (!isPlainObject(schema)) return schema === false;
  return Object.entries(schema).some(([key, value]) => !UNCONSTRAINING.has(key) && key !== "allOf" && !sameKeyword(key, merged[key], value));
}

// Whether `all` holds every schema of `own` that constrains anything.
function holdsSources(own: ConditionalSource[], all: ConditionalSource[]): boolean {
  return own.every((source) => !isPlainObject(source.schema) || all.some((other) => other.schema === source.schema));
}

// The property keys `schemas` declare so that a question can be made for them: in `properties`, in a
// branch or a schema dependency, and in their `allOf`, `anyOf` and `oneOf` entries, local `$ref`s
// followed. A `false` property allows no value, a branch's property its own `if` reads is not shown,
// and neither is a schema dependency's own trigger. A branch no `if` gives (with no `if`, or the `then`
// of an `if` that never holds, the `else` of one that always holds) declares nothing.
function declaredKeys(schemas: JsonSchemaDoc[], ctx: Ctx): Set<string> {
  const keys = new Set<string>();
  const seen = new Set<object>();
  const visit = (raw: unknown, exclude?: Set<string>): void => {
    if (!isPlainObject(raw)) return;
    const resolved = resolveRef(raw as JsonSchemaDoc, quietCtx(ctx), true);
    const s = resolved.schema;
    if (resolved.remote || seen.has(s)) return;
    seen.add(s);
    if (isPlainObject(s.properties)) {
      for (const [key, sub] of Object.entries(s.properties)) if ((sub as unknown) !== false && !exclude?.has(key)) keys.add(key);
    }
    // A branch applies only under an `if`, and only when the `if` can give it. The keys an outer
    // branch's own `if` or trigger reads stay out of the branches and entries inside it.
    const within = (reads: Set<string>) => new Set([...(exclude ?? []), ...reads]);
    if (s.if !== undefined) {
      const always = constantIf(s.if);
      if (always !== false) visit(s.then, within(ifReads(s.if)));
      if (always !== true) visit(s.else, within(ifReads(s.if)));
    }
    for (const [trigger, dep] of Object.entries(s.dependentSchemas ?? {})) visit(dep, within(new Set([trigger])));
    for (const [trigger, dep] of Object.entries(s.dependencies ?? {})) if (!Array.isArray(dep)) visit(dep, within(new Set([trigger])));
    for (const sub of [...(s.allOf ?? []), ...(s.anyOf ?? []), ...(s.oneOf ?? [])]) visit(sub, exclude);
  };
  schemas.forEach((schema) => visit(schema));
  return keys;
}

// Whether two values of the keyword `key` say the same: equal JSON, and `type`s that list the same
// types (`["string"]` is `"string"`).
function sameKeyword(key: string, a: unknown, b: unknown): boolean {
  if (key !== "type") return sameJson(a, b);
  const types = (t: unknown) => (Array.isArray(t) ? [...new Set(t.map(String))].sort() : [String(t)]);
  return sameJson(types(a), types(b));
}

// Whether two schemas constrain alike: every keyword says the same, the annotations aside.
function sameSchema(a: unknown, b: unknown): boolean {
  if (!isPlainObject(a) || !isPlainObject(b)) return sameJson(a, b);
  const keys = (s: Record<string, unknown>) => Object.keys(s).filter((k) => !ANNOTATIONS.has(k));
  const ka = keys(a);
  return ka.length === keys(b).length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && sameKeyword(k, a[k], b[k]));
}

// Whether two JSON values are equal.
function sameJson(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => sameJson(x, b[i]));
  }
  if (!isPlainObject(a) || !isPlainObject(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((k) => Object.prototype.hasOwnProperty.call(b, k) && sameJson(a[k], b[k]));
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
  if (s.items || Array.isArray(s.prefixItems)) return "array";
  if (Array.isArray(s.enum) || hasConstComposition(s)) return "string";
  return undefined;
}

// Whether a schema is an object's, as `mapProperty` reads it.
function isObjectSchema(s: JsonSchemaDoc): boolean {
  const type = effectiveType(s);
  return type === "object" || (type === undefined && !!s.properties);
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

// Build positive and negated SurveyJS expressions from an `if` subschema. Only the provable subset
// is handled: `properties[k].const` and `properties[k].enum`, and `required`, ANDed across keys.
// `properties` constrains only the keys present (JSON Schema's `properties` keyword), so a key's
// term holds while it is empty, unless the `if` lists it in `required`; a required key the `if`
// does not constrain only has to be present. Returns `undefined` when the `if` cannot be expressed
// -- the caller then flags ASSUMED_IF_THEN_ELSE instead of guessing a branch.
function ifToExpression(ifSchema: JsonSchemaDoc, fields: ObjectFields): { pos: string, neg: string } | undefined {
  // Any other keyword constrains the object too, and is not read: such an `if` is not expressed.
  // `type: "object"` holds for the form's data, which is an object.
  for (const [key, value] of Object.entries(ifSchema)) {
    if (key === "properties" || key === "required" || ANNOTATIONS.has(key)) continue;
    if (key === "type" && (value === "object" || (Array.isArray(value) && value.includes("object")))) continue;
    return undefined;
  }
  const props = isPlainObject(ifSchema.properties) ? ifSchema.properties as Record<string, JsonSchemaDoc> : {};
  const required = new Set(Array.isArray(ifSchema.required) ? ifSchema.required.filter((k): k is string => typeof k === "string") : []);
  const keys = new Set([...Object.keys(props), ...required]);
  if (keys.size === 0) return undefined;
  const pos: string[] = [];
  const neg: string[] = [];
  for (const k of keys) {
    // A property with no question has nothing to read, and a value that cannot be compared exactly
    // makes the whole `if` inexpressible.
    const ref = fields.ref(k);
    if (ref === undefined) return undefined;
    if (!Object.prototype.hasOwnProperty.call(props, k)) {
      if (!readsPresence(fields.values(k))) return undefined;
      pos.push(`${ref} notempty`);
      neg.push(`${ref} empty`);
      continue;
    }
    // A value the field's `type` excludes is never the value of valid data: it is not compared.
    const allowed = ofType(propertyValues(props[k]), fields.type(k));
    const optional = !required.has(k);
    const lits = allowed && equalityLiterals(allowed, optional, fields.values(k));
    if (!lits || (lits.length === 0 && !optional)) return undefined;
    const eq = lits.map((lit) => `${ref} = ${lit}`);
    const ne = lits.map((lit) => `${ref} <> ${lit}`);
    if (optional) {
      eq.unshift(`${ref} empty`);
      ne.unshift(`${ref} notempty`);
    }
    pos.push(eq.length === 1 ? eq[0] : `(${eq.join(" or ")})`);
    neg.push(ne.length === 1 ? ne[0] : `(${ne.join(" and ")})`);
  }
  return { pos: pos.join(" and "), neg: neg.join(" or ") };
}

// Whether survey-core's `{q} notempty` holds for exactly the values JSON Schema reads as present,
// for a question that can hold `known`: no known value may be one survey-core reads as empty, such
// as null or the empty text, which are values in JSON Schema. A question whose values are not
// known is taken to hold no such value, as a cleared input holds no value in both; a type that
// allows null makes null a known value (see `schemaValues`).
function readsPresence(known: unknown[] | undefined): boolean {
  return !(known ?? []).some((value) => surveyEmpty(value));
}

// The values an `if`'s property schema accepts when it is present, or `undefined` when it is not a
// `const` or a non-empty `enum` alone: another keyword would be ignored, and `enum: []` accepts no
// value, which a schema should not write (AJV's meta-schema refuses it). A `type` every value has
// adds nothing.
function propertyValues(cond: JsonSchemaDoc | undefined): unknown[] | undefined {
  if (!isPlainObject(cond)) return undefined;
  const values = cond.const !== undefined ? [cond.const] : Array.isArray(cond.enum) && cond.enum.length > 0 ? cond.enum : undefined;
  if (!values || (cond.const !== undefined && cond.enum !== undefined)) return undefined;
  for (const [key, value] of Object.entries(cond)) {
    if (key === "const" || key === "enum" || ANNOTATIONS.has(key)) continue;
    if (key === "type" && values.every((v) => hasJsonType(v, value))) continue;
    return undefined;
  }
  return values;
}

// The `values` of a JSON Schema `type` (all of them with no `type`).
function ofType(values: unknown[] | undefined, type: unknown): unknown[] | undefined {
  return values && type !== undefined ? values.filter((value) => hasJsonType(value, type)) : values;
}

// Whether `value` has one of the JSON Schema `type`s in `type`.
function hasJsonType(value: unknown, type: unknown): boolean {
  const types = Array.isArray(type) ? type : [type];
  return types.some((t) => {
    if (t === "null") return value === null;
    if (t === "integer") return Number.isInteger(value);
    if (t === "number") return typeof value === "number";
    if (t === "string" || t === "boolean") return typeof value === t;
    return false;
  });
}

// The values a property's schema allows, when they are known: its `const`, its `enum` (a null
// included), a `oneOf`/`anyOf` of `const`s, or a boolean's two (and null, when the type allows it).
// Of any other type that allows null, null is the one value known: survey-core reads it as empty,
// where JSON Schema reads it as present, so a presence test or an `empty` term is not written on it.
function schemaValues(schema: JsonSchemaDoc): unknown[] | undefined {
  if (schema.const !== undefined) return [schema.const];
  if (Array.isArray(schema.enum)) return [...schema.enum];
  if (hasConstComposition(schema)) return (schema.oneOf ?? schema.anyOf)!.map((b) => b.const);
  const nullable = schema.type === "null" || (Array.isArray(schema.type) && schema.type.includes("null"));
  if (effectiveType(schema) === "boolean") return nullable ? [true, false, null] : [true, false];
  return nullable ? [null] : undefined;
}

// The values the questions made on one value can hold, when they are known: each question's schema
// (see `schemaValues`), or a selector's choices, together. A question whose values are not known (a
// free text, a number) adds none. `undefined` when none is known.
function knownValues(elements: SurveyJSONElement[], schemaOf: WeakMap<SurveyJSONElement, JsonSchemaDoc>): unknown[] | undefined {
  const values: unknown[] = [];
  for (const el of elements) {
    const schema = schemaOf.get(el);
    const own = schema ? schemaValues(schema)
      : el.type === "boolean" ? [true, false]
        : (el.type === "dropdown" || el.type === "radiogroup") && Array.isArray(el.choices)
          ? el.choices.map((c) => (isPlainObject(c) && "value" in c ? c.value : c)) : undefined;
    if (own) values.push(...own);
  }
  return values.length > 0 ? values : undefined;
}

// The `type` of the schema the first of `elements` that has one was made from.
function schemaType(elements: SurveyJSONElement[], schemaOf: WeakMap<SurveyJSONElement, JsonSchemaDoc>): unknown {
  for (const el of elements) {
    const schema = schemaOf.get(el);
    if (schema) return schema.type;
  }
  return undefined;
}

// The literals of a comparison of a question with the `allowed` values, one `{q} = <literal>` each,
// so that survey-core's `=` holds for exactly the values JSON Schema's equality holds for: `const`
// and `enum` compare strictly (AJV's `const` and `enum`), and survey-core reads texts trimmed and
// without regard to case, a numeric text as a number, and "true" as a boolean. The values checked
// are the question's `known` values, the `allowed` values themselves, and no value, which matches
// when `optional` (and reads as `{q} empty` then) and does not otherwise. `undefined` when they
// disagree, or a value cannot be written as a literal. survey-core does not read every text as
// equal to itself: `{q} = '1,000'` is false when q is "1,000", as it reads the literal as text and
// the value as a number, and so are '1,5' and '12,345'; checking the `allowed` values refuses
// those. A null or an empty text is a value in JSON Schema and empty to survey-core. A question
// whose values are not known (a free text, a number) is checked with no value and the `allowed`
// values only (and null, when its type allows it), so survey-core still reads a text that differs
// from a literal only in case, in surrounding spaces, or in how it writes a number, as equal to it,
// and a text "1" or "0" as equal to `true` or `false` on a field whose type allows both texts and
// booleans. An `allowed` value the field's `type` excludes is dropped before (see `ofType`).
function equalityLiterals(allowed: unknown[], optional: boolean, known: unknown[] | undefined): string[] | undefined {
  const literals: string[] = [];
  const reads: unknown[] = [];
  for (const value of allowed) {
    const literal = isPrimitive(value) ? formatLiteral(value) : undefined;
    if (literal === undefined) return undefined;
    literals.push(literal);
    reads.push(surveyLiteral(value));
  }
  for (const value of [undefined, ...(known ?? []), ...allowed]) {
    if (value !== undefined && !isPrimitive(value)) return undefined;
    const matches = value === undefined ? optional : allowed.some((a) => a === value);
    const holds = (optional && surveyEmpty(value)) || reads.some((read) => surveyHolds("=", value, read));
    if (matches !== holds) return undefined;
  }
  return literals;
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
  // The values that question can hold, when they are known (see `knownValues`).
  values(key: string): unknown[] | undefined;
  // The elements made for the property, which a branch's `required` marks.
  elements(key: string): SurveyJSONElement[];
  // The `type` of the schema the property's question was made from, when it has one.
  type(key: string): unknown;
  // Whether a schema of the object declares the property: its `properties`, or a branch's. A key a
  // JSONForms UI schema has no Control for is declared, as the UI schema leaves it out; under
  // JSONForms an object Control's walk makes a question for every key its `properties` declare, and
  // no branch makes one, so there a key is declared only when it has a question.
  declares(key: string): boolean;
  // Show the question of a branch's property when `cond` holds, or always with no `cond`: it is
  // made when the object does not declare the property. A property several branches give is shown
  // when any of them holds. False when another branch made the question from a different schema:
  // one question cannot be both, so this branch's is not shown. Absent under JSONForms, which
  // renders what its UI schema names and reads schema conditionals only to validate: a branch there
  // gives `requiredIf` only.
  show?(key: string, sub: JsonSchemaDoc, sourcePtr: string, cond: string | undefined): boolean;
  // Show a question a branch shows also when `cond` holds (always, with no `cond`), as a branch
  // requires it then. A question no branch shows is visible already.
  reveal?(key: string, cond: string | undefined): void;
  // Hide the question while a branch that declares the property `false` holds: it is visible only
  // while each of `negations`, the negation of each such branch's condition, holds too. survey-core
  // clears a hidden question's value when the survey completes. Absent under JSONForms, as `show` is.
  forbid?(key: string, negations: string[]): void;
}

// The data walk's fields of an object: the questions in `state`.
function walkFields(state: WalkState, targetPath: string, ctx: Ctx, depth: number, declared: Set<string>, forbidden: Set<string>): ObjectFields {
  const fields: ObjectFields = {
    declares: (key) => (ctx.uiKind === "jsonforms" ? state.byProp.has(key) : declared.has(key)),
    // A panel holds no value: `{panel} notempty` never holds, and `{panel} empty` always does, where
    // an object is a value to JSON Schema. A condition on it is not written.
    ref: (key) => (state.byProp.get(key)?.type === "panel" ? undefined : questionRef(key, state)),
    values: (key) => {
      const el = state.byProp.get(key);
      return knownValues(el ? [el] : [], ctx.schemaOf);
    },
    elements: (key) => {
      const el = state.byProp.get(key);
      return el ? [el] : [];
    },
    type: (key) => schemaType(state.byProp.has(key) ? [state.byProp.get(key)!] : [], ctx.schemaOf)
  };
  if (ctx.uiKind === "jsonforms") return fields;
  // The branch schema each question a branch made was made from, the properties a branch shows, and
  // those shown always.
  const madeFrom = new Map<string, JsonSchemaDoc>();
  const shown = new Set<string>();
  const always = new Set<string>();
  fields.show = (key, sub, sourcePtr, cond) => {
    // A key a declaration makes `false` allows no value, whatever a branch declares.
    if (forbidden.has(key)) return false;
    let el = state.byProp.get(key);
    if (!el) {
      // Branch introduces a property not in the base object -- materialise it.
      const created = mapProperty(key, sub, sourcePtr, `${targetPath}[${state.elements.length}]`, ctx, false, rjsfHint(childUi(state.ui, key), ctx), depth, state.refPrefix);
      if (!created) return true;
      el = created;
      state.elements.push(el);
      state.byProp.set(key, el);
      madeFrom.set(key, sub);
    } else if (madeFrom.has(key) && !sameSchema(madeFrom.get(key), sub)) {
      return false;
    }
    shown.add(key);
    showWhen(el, key, cond);
    return true;
  };
  fields.reveal = (key, cond) => {
    const el = state.byProp.get(key);
    if (el && shown.has(key)) showWhen(el, key, cond);
  };
  fields.forbid = (key, negations) => {
    const el = state.byProp.get(key);
    if (!el) return;
    const terms = [...(typeof el.visibleIf === "string" ? [el.visibleIf] : []), ...new Set(negations)];
    el.visibleIf = terms.length === 1 ? terms[0] : terms.map((term) => `(${term})`).join(" and ");
  };
  // The question is visible when `cond` holds, or always.
  const showWhen = (el: SurveyJSONElement, key: string, cond: string | undefined) => {
    if (always.has(key)) return;
    if (cond !== undefined) {
      addTerm(el, "visibleIf", cond);
      // An `if` and its negation together hold always.
      const terms = conditionTerms.get(el)?.get("visibleIf") ?? [];
      if (!terms.some((term) => terms.includes(ctx.complements.get(term) ?? ""))) return;
    }
    always.add(key);
    delete el.visibleIf;
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
  reportFalseEntries(merged, sourcePtr, ctx);
  const state: WalkState = { elements: [], byProp: new Map(), refPrefix, ui: rjsfUi };
  const requiredSet = new Set(merged.required ?? []);
  const order = orderKeys(Object.keys(merged.properties ?? {}), rjsfUi ? rjsfOptions(rjsfUi).options.get("order")?.value : undefined);
  // The conditionals of the schema and of each `allOf` entry, read once at each pointer (a JSONForms
  // detail layout on the object may have read them).
  const quiet = ctx.quietConditionalsAt === sourcePtr || ctx.readConditionals.has(sourcePtr);
  const conditionals = quiet ? { ...ctx, report: quietReport } : ctx;
  // A branch that applies always and declares a property `false` allows it no value, as a `false`
  // declaration does; a declaration of the property it outweighs is reported at it.
  const alwaysFalse = ctx.uiKind === "jsonforms" ? new Map<string, string>() : falseAlways(conditionalSourcesOf(merged, sourcePtr), ctx);

  for (const key of order) {
    const sub = merged.properties![key];
    // `false` allows no value: no question can hold one.
    if ((sub as unknown) === false) continue;
    if (alwaysFalse.has(key)) {
      conditionals.report.assumed(JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, alwaysFalse.get(key)!, "");
      continue;
    }
    const hint = rjsfHint(childUi(rjsfUi, key), ctx);
    const el = mapProperty(key, sub, `${sourcePtr}/properties/${escapeSegment(key)}`, `${targetPath}[${state.elements.length}]`, ctx, requiredSet.has(key), hint, depth, refPrefix);
    if (el) {
      state.elements.push(el);
      state.byProp.set(key, el);
    }
  }

  ctx.readConditionals.add(sourcePtr);
  const sources = objectSources(merged, sourcePtr, conditionals);
  // The keys a declaration makes `false`: no branch shows them, and a `required` on one is reported.
  const forbidden = new Set([...Object.keys(merged.properties ?? {}).filter((key) => (merged.properties![key] as unknown) === false), ...alwaysFalse.keys()]);
  const declared = declaredKeys(sources.map((source) => source.schema), ctx);
  forbidden.forEach((key) => declared.delete(key));
  const fields = walkFields(state, targetPath, ctx, depth, declared, forbidden);
  reportFreeKeys(merged, sourcePtr, conditionals);
  reportObjectKeywords(merged, sourcePtr, conditionals);
  applyConditionals(sources.flatMap((source) => conditionalsOf(source.schema, source.ptr, conditionals, fields, true)), conditionals, fields);
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
  const resolved = resolveRef(rawSchema, ctx, true);
  if (resolved.remote) {
    // Client-side converter does not fetch -- emit a bare text so the form still
    // builds, and raise the drop alarm.
    reportRemoteRef(sourcePtr, targetPath, ctx, resolved.unresolved);
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
  reportFalseEntries(schema, sourcePtr, ctx);
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
  reportUnheld(schema, sourcePtr, targetPath, ctx, scalarUnheld(schema, el));
  if (hint.hidden) el.visible = false;
  if (schema.readOnly || hint.readOnly) el.readOnly = true;
  ctx.schemaOf.set(el, schema);
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
    if (elements.length === 0 && declaresNoKeys(schema)) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, sourcePtr, targetPath);
  }
  if (elements.length > 0) panel.elements = elements;
  if (required) panel.isRequired = true;
  // An optional object may be absent, and AJV checks nothing inside it then: each requirement of its
  // fields holds only while it holds a value. A required one is there whenever the parent is.
  else if (!hint.present) {
    const refs = fieldRefs(elements, refPrefix);
    if (refs.length > 0) {
      requireWhilePresent(elements, refs, refPrefix, ctx);
      ctx.presencePanels.add(panel);
    }
  }
  return panel;
}

// --- presence of an optional object -----------------------------------------------

// The condition that an object holds a value: the question of one of its fields, `refs`, is not
// empty. survey-core leaves a value out of the data when it is empty, so an object whose fields are
// all empty is absent, as JSON Schema reads a missing key. `undefined` with no field.
function presenceOf(refs: string[]): string | undefined {
  const unique = [...new Set(refs)];
  return unique.length === 0 ? undefined : unique.map((ref) => `${ref} notempty`).join(" or ");
}

// The references of the questions among `elements` and in the static panels among them. A dynamic
// panel's rows are its own value.
function fieldRefs(elements: SurveyJSONElement[], refPrefix: string, refs: string[] = []): string[] {
  for (const el of elements) {
    if (el.type === "panel") fieldRefs(Array.isArray(el.elements) ? el.elements as SurveyJSONElement[] : [], refPrefix, refs);
    else if (el.type !== "html") refs.push(`{${refPrefix}${el.valueName ?? el.name}}`);
  }
  return refs;
}

// Hold the requirement of each of `elements`, and of the elements of the static panels among them, to
// the presence of the object whose fields' questions `refs` name (see `presenceOf`): `isRequired`
// becomes `requiredIf: <presence>`, and a `requiredIf` holds only while the presence does too. A
// question's own value is left out of its presence: while it holds one, its requirement is met
// anyway, so a field that is the object's only one is not required at all. An element or a panel's
// fields already held to a presence that implies this one (see `Ctx.presenceElements`) are left as
// they are.
function requireWhilePresent(elements: SurveyJSONElement[], refs: string[], refPrefix: string, ctx: Ctx): void {
  for (const el of elements) {
    if (!ctx.presenceElements.has(el) && (el.isRequired === true || typeof el.requiredIf === "string")) {
      const own = el.type === "panel" ? undefined : `{${refPrefix}${el.valueName ?? el.name}}`;
      const presence = presenceOf(refs.filter((ref) => ref !== own));
      if (el.isRequired === true) {
        delete el.isRequired;
        dropMinChoices(el, ctx);
        if (presence !== undefined) el.requiredIf = presence;
      } else if (presence === undefined) delete el.requiredIf;
      // A condition that a field of the object holds a value (a dependency's) implies the presence.
      else if (!refs.some((ref) => el.requiredIf === `${ref} notempty`)) el.requiredIf = `(${presence}) and (${el.requiredIf})`;
    }
    if (el.type === "panel" && !ctx.presencePanels.has(el) && Array.isArray(el.elements)) requireWhilePresent(el.elements as SurveyJSONElement[], refs, refPrefix, ctx);
  }
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
): SurveyJSONElement | null {
  // `items: false` allows no item: the array can only be empty, and no question is made for it. Beside
  // a `prefixItems` it allows none past the prefix, which the question below holds and reports.
  if ((schema.items as unknown) === false && !Array.isArray(schema.prefixItems)) {
    ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/items`, "");
    return null;
  }
  // A tuple-form `items` (an array of schemas) types each position on its own. JSONForms leaves it to
  // no array renderer (`isObjectArray`: "we don't care about tuples") and RJSF renders fixed fields
  // (`ArrayField`, `isFixedItems`); the tagbox takes any text at any position.
  const tuple = Array.isArray(schema.items);
  if (tuple) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/items`, targetPath);
  // `prefixItems` (2020-12) is that tuple form under its own name, with `items` then holding for the
  // positions after it, so the question built from `items` misses each position's own schema.
  if (Array.isArray(schema.prefixItems)) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/prefixItems`, targetPath);
  const itemsResolved = schema.items && !tuple ? resolveRef(schema.items, ctx, true) : { schema: {} as JsonSchemaDoc };
  const items = itemsResolved.remote ? {} : mergeAllOf(itemsResolved.schema, `${sourcePtr}/items`, ctx);
  if (itemsResolved.remote) reportRemoteRef(`${sourcePtr}/items`, targetPath, ctx, itemsResolved.unresolved);

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
    applyItemCounts(schema, el, "choices", required, sourcePtr, targetPath, ctx);
    return el;
  }

  if (effectiveType(items) === "object") {
    // Repeating group of objects -> dynamic panel; item properties -> template. A question in the
    // template is read from its own row, as `{panel.k}`; a nested array starts its own rows.
    const el: SurveyJSONElement = { type: "paneldynamic", name: qname };
    applyTitleDesc(schema, el, hint, ctx);
    let template: SurveyJSONElement[];
    if (hint.template) {
      template = hint.template(items, `${targetPath}.templateElements`);
    } else {
      const state = walkObjectState(items, `${sourcePtr}/items`, `${targetPath}.templateElements`, ctx, childUi(hint.ui, "items"), depth + 1, "panel.");
      template = state.elements;
      // A data path in the row goes through the questions the walk made, and a nested object's panel.
      hint.rowKey = (path) => {
        let el: SurveyJSONElement | undefined;
        let fields: Map<string, SurveyJSONElement> | undefined = state.byProp;
        for (const key of path) {
          el = fields?.get(key);
          if (!el) return undefined;
          fields = ctx.objectFields.get(el);
        }
        return el && el.type !== "panel" ? (el.valueName ?? el.name) as string : undefined;
      };
    }
    if (template.length > 0) el.templateElements = template;
    else if (!hint.template && declaresNoKeys(items)) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, `${sourcePtr}/items`, targetPath);
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
    applyItemCounts(schema, el, "rows", required, sourcePtr, targetPath, ctx);
    return el;
  }

  for (const key of composed) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/items/${escapeSegment(key)}`, targetPath);
  reportItemConstraints(items, `${sourcePtr}/items`, composed, targetPath, ctx);
  // Array of primitives without an enum -> tagbox (free-form multi value). No predefined choices; the
  // respondent types the items, so custom choices are allowed (without them survey-core takes the items
  // as unknown values: a required tagbox shows an error and completion clears them). It stores the
  // items as text; `reportItemConstraints` reports an item `type` that allows none (JSONForms'
  // `MaterialTableControl` cells and RJSF's `NumberField` / `asNumber` store numbers).
  const el: SurveyJSONElement = { type: "tagbox", name: qname, allowCustomChoices: true };
  applyTitleDesc(schema, el, hint, ctx);
  applyArrayMeta(schema, el, required, hint);
  applyItemCounts(schema, el, "free", required, sourcePtr, targetPath, ctx);
  return el;
}

// --- keywords a question cannot hold ------------------------------------------------

// Report each keyword `unheld` picks among those set by the schemas the merged schema `merged` at
// `sourcePtr` was made from (itself, and each `allOf` entry), at the pointer of the schema that sets
// it: the question made for it holds none of them. A keyword the `allOf` merge reported already (see
// `reportDropped`) keeps that one entry.
function reportUnheld(merged: JsonSchemaDoc, sourcePtr: string, targetPath: string, ctx: Ctx, unheld: (key: string, value: unknown) => boolean): void {
  for (const source of conditionalSourcesOf(merged, sourcePtr)) {
    if (!isPlainObject(source.schema)) continue;
    for (const [key, value] of Object.entries(source.schema)) {
      const ptr = `${source.ptr}/${escapeSegment(key)}`;
      if (unheld(key, value) && !ctx.mergeReported.has(ptr)) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, ptr, targetPath);
    }
  }
}

// A `not` that constrains something: `not: false` allows every value.
function constrainingNot(value: unknown): boolean {
  return value !== false;
}

// Whether `branches` are a string and null, in either order, as Pydantic v2 and OpenAPI 3.1 write an
// optional string: a text question holds exactly that.
function isOptionalString(branches: unknown): boolean {
  if (!Array.isArray(branches) || branches.length !== 2) return false;
  const types = branches.map((b) => isPlainObject(b) && Object.keys(b).length === 1 ? b.type : undefined);
  return types.includes("string") && types.includes("null");
}

// A count of items or properties: a whole number, not negative.
function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

// What a scalar question (`text`, `dropdown`, `boolean`) `el` made from `merged` does not hold: a `not`
// that constrains something; a `const` (the question takes any value); `type: "null"`; a `multipleOf`
// (a whole number meets one whose inverse is whole); a `oneOf` or `anyOf`, unless it is the set of
// `const`s the choices came from (see `readChoices`), or a string and null on a text question of any
// text (see `isOptionalString`).
function scalarUnheld(merged: JsonSchemaDoc, el: SurveyJSONElement): (key: string, value: unknown) => boolean {
  const type = effectiveType(merged);
  const integer = type === "integer";
  const choicesFrom = !Array.isArray(merged.enum) && hasConstComposition(merged) ? (merged.oneOf !== undefined ? "oneOf" : "anyOf") : undefined;
  // A text question stores a string, unless its input gives a number.
  const anyText = (type === undefined || type === "string") && (el.type === "comment" || (el.type === "text" && el.inputType !== "number" && el.inputType !== "range"));
  return (key, value) => {
    switch(key) {
      case "not":
        return constrainingNot(value);
      case "const":
        return true;
      case "type":
        return value === "null" || (Array.isArray(value) && value.length > 0 && value.every((t) => t === "null"));
      case "multipleOf":
        return !(integer && typeof value === "number" && value > 0 && Number.isInteger(1 / value));
      case "oneOf":
      case "anyOf":
        if (anyText && isOptionalString(value)) return false;
        return !(key === choicesFrom && sameJson(value, merged[key]));
      default:
        return false;
    }
  };
}

// The item counts of the array `merged`, on its question `el`: a checkbox or tagbox of `choices`, a
// tagbox of `free` items, or a dynamic panel of `rows`. survey-core's `maxSelectedChoices` stops the
// respondent picking more choices, but not adding custom items, and 0 sets no limit, where
// `maxItems: 0` allows only an empty array. Its `minSelectedChoices` is checked on an empty question
// too, where AJV checks `minItems` only on an array that is there: it holds `minItems` while the
// question is required (see `dropMinChoices`). A dynamic panel's rows can be added empty, so its panel
// counts are not set. A selection holds each choice once, as `uniqueItems` asks. What is not held is
// reported, with a `not` that constrains something, `contains`, and a `oneOf` or `anyOf` of the array.
function applyItemCounts(merged: JsonSchemaDoc, el: SurveyJSONElement, kind: "choices" | "free" | "rows", required: boolean, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const { minItems, maxItems } = merged;
  const minHeld = kind !== "rows" && required && isCount(minItems) && minItems > 0;
  const maxHeld = kind === "choices" && isCount(maxItems) && maxItems > 0;
  if (minHeld) {
    el.minSelectedChoices = minItems;
    ctx.minChoices.set(el, { ptr: keywordPointer(merged, sourcePtr, "minItems"), targetPath });
  }
  if (maxHeld) el.maxSelectedChoices = maxItems;
  reportUnheld(merged, sourcePtr, targetPath, ctx, (key, value) => {
    switch(key) {
      case "not":
        return constrainingNot(value);
      case "contains":
      case "oneOf":
      case "anyOf":
        return true;
      case "uniqueItems":
        return value === true && kind !== "choices";
      case "minItems":
        return !minHeld && !(isCount(value) && value === 0);
      case "maxItems":
        return !maxHeld;
      default:
        return false;
    }
  });
}

// The pointer of `key` in the first schema `merged` at `sourcePtr` was made from that sets it.
function keywordPointer(merged: JsonSchemaDoc, sourcePtr: string, key: string): string {
  const source = conditionalSourcesOf(merged, sourcePtr).find((s) => isPlainObject(s.schema) && s.schema[key] !== undefined);
  return `${source?.ptr ?? sourcePtr}/${escapeSegment(key)}`;
}

// A choice question that is no longer always required: its `minSelectedChoices`, which survey-core
// checks on an empty question too, is removed and its `minItems` reported.
function dropMinChoices(el: SurveyJSONElement, ctx: Ctx): void {
  const held = ctx.minChoices.get(el);
  if (!held) return;
  delete el.minSelectedChoices;
  ctx.minChoices.delete(el);
  ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, held.ptr, held.targetPath);
}

// Report what an object's panel or form does not hold: a `not` that constrains something; and, for an
// object that declares its keys, `propertyNames`, a `minProperties` its required keys do not meet,
// and a `maxProperties` below the number of keys it declares. An object that declares none is
// reported as a whole (see
// `declaresNoKeys`).
function reportObjectKeywords(merged: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): void {
  const free = declaresNoKeys(merged);
  const required = new Set(Array.isArray(merged.required) ? merged.required : []).size;
  const declared = Object.values(merged.properties ?? {}).filter((sub) => (sub as unknown) !== false).length;
  reportUnheld(merged, sourcePtr, "", ctx, (key, value) => {
    switch(key) {
      case "not":
        return constrainingNot(value);
      case "propertyNames":
        return !free && value !== true && !(isPlainObject(value) && Object.keys(value).length === 0);
      case "minProperties":
        return !free && !(isCount(value) && value <= required);
      case "maxProperties":
        return !free && !(isCount(value) && value >= declared);
      default:
        return false;
    }
  });
}

// Report what the items schema `items` at `itemsPtr` constrains beyond a text, each keyword at its own
// pointer (an `allOf` entry's, for one an entry sets): a tagbox takes any text as an item. Annotations
// and a `type` that allows a text constrain nothing a tagbox loses, and the `composed` keywords are
// reported already.
function reportItemConstraints(items: JsonSchemaDoc, itemsPtr: string, composed: string[], targetPath: string, ctx: Ctx): void {
  for (const source of conditionalSourcesOf(items, itemsPtr)) {
    if (!isPlainObject(source.schema)) continue;
    for (const [key, value] of Object.entries(source.schema)) {
      if (UNCONSTRAINING.has(key) || key === "allOf" || key === "$ref" || composed.includes(key)) continue;
      if (key === "type" && (value === "string" || (Array.isArray(value) && value.includes("string")))) continue;
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${source.ptr}/${escapeSegment(key)}`, targetPath);
    }
  }
}

// Whether an object schema declares none of its keys: no `properties`, and no `oneOf` or `anyOf`
// whose branches could. Its keys are free (`additionalProperties`, `patternProperties`, or any), and
// no question holds them; JSONForms (`generateUISchema`) and RJSF (`ObjectField`) render an empty
// group, RJSF with an "Add" button when either keyword is set (`canExpand`).
function declaresNoKeys(schema: JsonSchemaDoc): boolean {
  return !(isPlainObject(schema.properties) && Object.keys(schema.properties).length > 0) && !schema.oneOf && !schema.anyOf;
}

// Report the `additionalProperties` and `patternProperties` that let an object with `properties`
// hold keys it does not declare, at each schema (the object, or an `allOf` entry) that sets them: no
// question holds those keys. RJSF lets them be added (`canExpand`). An object that declares no keys
// is reported as a whole (`declaresNoKeys`).
function reportFreeKeys(merged: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): void {
  if (declaresNoKeys(merged)) return;
  for (const source of conditionalSourcesOf(merged, sourcePtr)) {
    const { additionalProperties, patternProperties } = source.schema;
    if (additionalProperties !== undefined && additionalProperties !== false) {
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, `${source.ptr}/additionalProperties`, "");
    }
    if (isPlainObject(patternProperties) && Object.keys(patternProperties).length > 0) {
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, `${source.ptr}/patternProperties`, "");
    }
  }
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

// A branch of a schema conditional, which holds when `cond` does (always, with no `cond`): a `then`
// or `else`, a schema dependency, a property dependency's `required`, or a schema's own `required`.
// `read` holds the keys its condition reads, which its `properties` do not hide; `code` reports a
// property it cannot show, and `undeclared` a key it requires that no schema declares.
interface Branch {
  schema: JsonSchemaDoc;
  cond: string | undefined;
  // The negation of `cond`.
  neg?: string;
  ptr: string;
  code: string;
  read?: Set<string>;
  // Where the `required` list is: `<ptr>/required`, or the property dependency's own pointer.
  requiredPtr?: string;
  // The pointer of each property's and each required key's declaration, when the branch was merged
  // from several schemas (see `BranchShape`).
  pointers?: Map<string, string>;
  requiredPointers?: Map<string, string>;
  // The conditions of the branches a nested branch sits in: it holds only while each of them does.
  within?: string[];
  undeclared?: (ptr: string) => void;
}

// A schema conditional (an `if`, a dependency, or a schema's own `required`): the keys its condition
// reads, the keys its branches show, and `resolve`, which reads the condition and gives the branches.
// The condition is read once the questions it reads are made, as a branch can show one.
interface Conditional {
  reads: string[];
  shows: Set<string>;
  resolve(): Branch[];
}

// The conditionals of `schema`, found at `sourcePtr`: its `if`/`then`/`else` and dependencies, and,
// with `required`, its own `required`.
function conditionalsOf(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields, required: boolean): Conditional[] {
  const units = [...ifConditionals(schema, sourcePtr, ctx, fields), ...dependencyConditionals(schema, sourcePtr, ctx, fields)];
  if (required) units.push(...requiredConditionals(schema, sourcePtr, ctx));
  return units;
}

// The keys an `if` reads: those its `properties` constrain and its `required` lists.
function ifReads(ifSchema: unknown): Set<string> {
  if (!isPlainObject(ifSchema)) return new Set();
  return new Set([...Object.keys(isPlainObject(ifSchema.properties) ? ifSchema.properties : {}),
    ...(Array.isArray(ifSchema.required) ? ifSchema.required.filter((k): k is string => typeof k === "string") : [])]);
}

// The conditional of `schema`'s `if`, which reports the `if` when it cannot be expressed. Its branches
// are read quietly for the keys they read and show, and again when the conditional is resolved, so
// that what they lose is reported only when they apply.
function ifConditionals(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields): Conditional[] {
  if (schema.if === undefined) return [];
  const code = JsonSchemaCodes.ASSUMED_IF_THEN_ELSE;
  // AJV takes `then` for every value when the `if` holds for every value (`true`, or a schema that
  // constrains nothing), and `else` when it holds for none (`false`): that branch applies always.
  const always = constantIf(schema.if);
  const shapes = (c: Ctx) => ({
    then: always === false ? undefined : branchShape(schema.then, `${sourcePtr}/then`, c),
    else: always === true ? undefined : branchShape(schema.else, `${sourcePtr}/else`, c)
  });
  const quiet = shapes(quietCtx(ctx));
  if (!fields.show && !shapeMatters(quiet.then) && !shapeMatters(quiet.else)) return [];
  if (always !== undefined) {
    const key = always ? "then" : "else";
    return [{ reads: [...shapeReads(quiet[key])], shows: shapeShows(quiet[key], new Set()), resolve: () => {
      const shape = shapes(ctx)[key];
      return shape ? shapeBranches(shape, undefined, undefined, new Set(), code, ctx, fields) : [];
    } }];
  }
  const ifSchema = schema.if;
  // A branch's `properties` only constrains a key the `if` reads: it is not hidden by its own value.
  const read = ifReads(ifSchema);
  return [{
    reads: [...new Set([...read, ...shapeReads(quiet.then), ...shapeReads(quiet.else)])],
    shows: shapeShows(quiet.else, read, shapeShows(quiet.then, read)),
    resolve: () => {
      const expr = isPlainObject(ifSchema) ? ifToExpression(ifSchema, fields) : undefined;
      if (!expr) {
        // Cannot express the condition -- do not guess a branch.
        ctx.report.assumed(code, `${sourcePtr}/if`, "");
        return [];
      }
      ctx.complements.set(expr.pos, expr.neg);
      ctx.complements.set(expr.neg, expr.pos);
      const real = shapes(ctx);
      return [...(real.then ? shapeBranches(real.then, expr.pos, expr.neg, read, code, ctx, fields) : []),
        ...(real.else ? shapeBranches(real.else, expr.neg, expr.pos, read, code, ctx, fields) : [])];
    }
  }];
}

// --- branch shapes ----------------------------------------------------------

// Keywords that constrain no object: the annotations, and a resource's identity and definitions.
const UNCONSTRAINING = new Set<string>(["$id", "$schema", "$anchor", "$defs", "definitions", ...ANNOTATIONS]);
// The keywords of a branch the conditionals read, or that constrain nothing: `properties` and
// `required`, an `allOf`, which is merged, a nested `if` with its `then` and `else`, the annotations,
// and a resource's identity and definitions. A `type` that allows an object holds for the form's data.
const BRANCH_KEYWORDS = new Set<string>(["properties", "required", "allOf", "if", "then", "else", ...UNCONSTRAINING]);

// A then/else/dependency branch as the conditionals read it. `schema` is the branch with its `$ref`
// followed and its `allOf` merged, as an object's own schema is (`mergeAllOf`), for its `properties`
// and `required`; `properties` and `required` map each key to the pointer of its first declaration (of
// a `false` one, when a declaration is `false`). `nested` holds the `if`s of the branch and of its
// `allOf` entries, which apply while the branch holds. `lost` holds the pointers of what is not
// translated: a keyword outside `BRANCH_KEYWORDS` (beside the branch's `$ref` too), and a `false` branch
// or `allOf` entry, which no object meets while the branch holds; `remote`, those of a `$ref` the
// converter cannot follow, and whether it names nothing in the document (see `resolveRef`).
interface BranchShape {
  schema: JsonSchemaDoc;
  ptr: string;
  properties: Map<string, string>;
  required: Map<string, string>;
  nested: NestedIf[];
  lost: string[];
  remote: { ptr: string, unresolved: boolean }[];
}

// An `if` inside a branch, in the schema at `ptr`: the keys it reads, and the shapes of its branches.
// `unread` marks one past the branch budget (see `MAX_BRANCH_SHAPES`), whose branches are not read.
interface NestedIf {
  ifSchema: unknown;
  ptr: string;
  read: Set<string>;
  then?: BranchShape;
  else?: BranchShape;
  unread?: boolean;
}

// How many branch schemas one top-level branch reads, nested ones included. Branches that name a
// schema along many paths (`then` and `else` both a `$ref` to the next `if`) double at each level;
// past the budget a nested `if` is reported, and nothing of it is applied.
// Each branch schema read costs one, an absent one nothing: a chain of `then`s one per level, and an `if`
// with both a `then` and an `else` two, so a branch holding more than 32 such `if`s side by side is
// reported past the 32nd.
const MAX_BRANCH_SHAPES = 64;

// The shape of the branch `raw` at `ptr`; `undefined` for a branch that constrains nothing: absent,
// `true`, or one that leads back to a branch `path` holds, as that branch applies already whenever
// this one does.
function branchShape(raw: unknown, ptr: string, ctx: Ctx, path: Set<object> = new Set(), budget = { left: MAX_BRANCH_SHAPES }): BranchShape | undefined {
  const shape: BranchShape = { schema: {}, ptr, properties: new Map(), required: new Map(), nested: [], lost: [], remote: [] };
  if (raw === false) {
    budget.left--;
    shape.lost.push(ptr);
    return shape;
  }
  if (!isPlainObject(raw)) return undefined;
  // Only a branch that is there costs one.
  budget.left--;
  // The `$ref` is followed, and the keywords beside it are merged with its target (see `besideRef`).
  const resolved = resolveRef(raw as JsonSchemaDoc, ctx, true);
  if (resolved.remote) {
    shape.remote.push({ ptr, unresolved: !!resolved.unresolved });
    return shape;
  }
  if (path.has(resolved.schema)) return undefined;
  const inner = new Set(path).add(resolved.schema);
  shape.schema = mergeAllOf(resolved.schema, ptr, ctx);
  const forbidden = new Set<string>();
  for (const source of conditionalSourcesOf(shape.schema, ptr)) {
    const s = source.schema;
    // A `false` entry of the branch's `allOf` allows no object.
    if (!isPlainObject(s)) {
      if ((s as unknown) === false) shape.lost.push(source.ptr);
      continue;
    }
    for (const [key, value] of Object.entries(s)) {
      if (!BRANCH_KEYWORDS.has(key) && !(key === "type" && allowsObject(value))) shape.lost.push(`${source.ptr}/${escapeSegment(key)}`);
    }
    for (const [key, sub] of Object.entries(isPlainObject(s.properties) ? s.properties : {})) {
      const isFalse = (sub as unknown) === false;
      if (!shape.properties.has(key) || (isFalse && !forbidden.has(key))) shape.properties.set(key, `${source.ptr}/properties/${escapeSegment(key)}`);
      if (isFalse) forbidden.add(key);
    }
    (Array.isArray(s.required) ? s.required : []).forEach((key, i) => {
      if (typeof key === "string" && !shape.required.has(key)) shape.required.set(key, `${source.ptr}/required/${i}`);
    });
    if (s.if === undefined) continue;
    if (budget.left <= 0) {
      shape.nested.push({ ifSchema: s.if, ptr: source.ptr, read: ifReads(s.if), unread: true });
      continue;
    }
    shape.nested.push({ ifSchema: s.if, ptr: source.ptr, read: ifReads(s.if),
      then: branchShape(s.then, `${source.ptr}/then`, ctx, inner, budget), else: branchShape(s.else, `${source.ptr}/else`, ctx, inner, budget) });
  }
  return shape;
}

// The branches of a nested `if` that can apply: both, or the one a constant `if` gives (see `constantIf`).
function nestedBranches(nested: NestedIf): (BranchShape | undefined)[] {
  const always = constantIf(nested.ifSchema);
  return always === undefined ? [nested.then, nested.else] : [always ? nested.then : nested.else];
}

// Whether a branch gives anything under JSONForms, where a branch gives only its `required`: a
// required key, a `false` property, or a loss to report; itself or a nested branch.
function shapeMatters(shape: BranchShape | undefined): boolean {
  if (!shape) return false;
  return shape.required.size > 0 || shape.lost.length > 0 || shape.remote.length > 0
    || Object.values(shape.schema.properties ?? {}).some((sub) => (sub as unknown) === false)
    || shape.nested.some((nested) => nested.unread || nestedBranches(nested).some(shapeMatters));
}

// The keys the nested `if`s of `shape` read.
function shapeReads(shape: BranchShape | undefined, keys = new Set<string>()): Set<string> {
  for (const nested of shape?.nested ?? []) {
    if (constantIf(nested.ifSchema) === undefined) nested.read.forEach((key) => keys.add(key));
    nestedBranches(nested).forEach((branch) => shapeReads(branch, keys));
  }
  return keys;
}

// The keys the `properties` of `shape` and of its nested branches show, but those their conditions read.
function shapeShows(shape: BranchShape | undefined, read: Set<string>, keys = new Set<string>()): Set<string> {
  if (!shape) return keys;
  for (const key of Object.keys(shape.schema.properties ?? {})) if (!read.has(key)) keys.add(key);
  for (const nested of shape.nested) {
    const both = constantIf(nested.ifSchema) === undefined ? new Set([...read, ...nested.read]) : read;
    nestedBranches(nested).forEach((branch) => shapeShows(branch, both, keys));
  }
  return keys;
}

// The branches `shape` gives while `cond` holds (always, with no `cond`); `neg` is its negation, and
// `read` holds the keys the conditions read. They are the shape itself, and the branches of each
// nested `if`, which hold while both its condition and `cond` do. What the shape does not translate
// is reported with `code`, and so is a nested `if` that cannot be expressed, of which nothing is
// applied. Under JSONForms such an `if` is reported only when its branches give anything there.
function shapeBranches(shape: BranchShape, cond: string | undefined, neg: string | undefined, read: Set<string>, code: string, ctx: Ctx, fields: ObjectFields,
  within: string[] = []): Branch[] {
  for (const ptr of shape.lost) ctx.report.assumed(code, ptr, "");
  for (const { ptr, unresolved } of shape.remote) if (!ctx.remoteRefs.has(ptr)) reportRemoteRef(ptr, "", ctx, unresolved);
  const branches: Branch[] = [{ schema: shape.schema, cond, neg, ptr: shape.ptr, code, read, pointers: shape.properties, requiredPointers: shape.required, within }];
  const inner = cond === undefined ? within : [...within, cond];
  for (const nested of shape.nested) {
    if (nested.unread) {
      ctx.report.assumed(code, `${nested.ptr}/if`, "");
      continue;
    }
    if (constantIf(nested.ifSchema) !== undefined) {
      for (const branch of nestedBranches(nested)) if (branch) branches.push(...shapeBranches(branch, cond, neg, read, code, ctx, fields, within));
      continue;
    }
    if (fields.show ? !nested.then && !nested.else : !nestedBranches(nested).some(shapeMatters)) continue;
    const expr = isPlainObject(nested.ifSchema) ? ifToExpression(nested.ifSchema, fields) : undefined;
    if (!expr) {
      ctx.report.assumed(code, `${nested.ptr}/if`, "");
      continue;
    }
    const both = new Set([...read, ...nested.read]);
    for (const [branch, pos, negation] of [[nested.then, expr.pos, expr.neg], [nested.else, expr.neg, expr.pos]] as const) {
      if (!branch) continue;
      // Both conditions hold, or either negation does.
      const c = cond === undefined ? pos : `(${cond}) and (${pos})`;
      const n = cond === undefined ? negation : neg === undefined ? undefined : `(${neg}) or (${negation})`;
      if (n !== undefined) {
        ctx.complements.set(c, n);
        ctx.complements.set(n, c);
      }
      branches.push(...shapeBranches(branch, c, n, both, code, ctx, fields, inner));
    }
  }
  return branches;
}

// What an `if` gives for every value: true when it holds for every value, false when for none,
// `undefined` otherwise. AJV reads `true`, a schema with only annotations, `type: "object"` (which
// the form's data has), `properties` each of which holds for every value, and an empty `required`,
// as holding always, and `false`, a `not` of a schema that always holds, or a `type` the form's
// data does not have, as never.
function constantIf(ifSchema: unknown): boolean | undefined {
  if (holdsAlways(ifSchema, true)) return true;
  if (holdsNever(ifSchema, true)) return false;
  return undefined;
}

// Whether a schema holds for every value; for every object, when `object`.
function holdsAlways(schema: unknown, object: boolean): boolean {
  if (schema === true) return true;
  if (!isPlainObject(schema)) return false;
  return Object.entries(schema).every(([key, value]) => ANNOTATIONS.has(key)
    || (key === "type" && object && allowsObject(value))
    || (key === "properties" && isPlainObject(value) && Object.values(value).every((sub) => holdsAlways(sub, false)))
    || (key === "required" && Array.isArray(value) && value.length === 0)
    || (key === "not" && holdsNever(value, object)));
}

// Whether a schema holds for no value; for no object, when `object`: a `type` without "object".
function holdsNever(schema: unknown, object: boolean): boolean {
  if (schema === false) return true;
  if (!isPlainObject(schema)) return false;
  return (schema.not !== undefined && holdsAlways(schema.not, object)) || (object && schema.type !== undefined && !allowsObject(schema.type));
}

// Whether a `type` keyword allows an object.
function allowsObject(type: unknown): boolean {
  return type === "object" || (Array.isArray(type) && type.includes("object"));
}

// The properties a branch that applies always (of an `if` that holds for every value or for none)
// declares `false` in `sources`, itself or a nested branch that applies always too, each with the
// pointer of the first such declaration.
function falseAlways(sources: ConditionalSource[], ctx: Ctx): Map<string, string> {
  const keys = new Map<string, string>();
  const collect = (shape: BranchShape | undefined): void => {
    if (!shape) return;
    for (const [key, sub] of Object.entries(shape.schema.properties ?? {})) {
      if ((sub as unknown) === false && !keys.has(key)) keys.set(key, shape.properties.get(key) ?? `${shape.ptr}/properties/${escapeSegment(key)}`);
    }
    for (const nested of shape.nested) if (constantIf(nested.ifSchema) !== undefined) nestedBranches(nested).forEach(collect);
  };
  for (const { schema, ptr } of sources) {
    const always = schema.if === undefined ? undefined : constantIf(schema.if);
    if (always === undefined) continue;
    collect(branchShape(always ? schema.then : schema.else, `${ptr}/${always ? "then" : "else"}`, quietCtx(ctx)));
  }
  return keys;
}

// A schema's own `required`, a branch that holds always: a key only a branch shows is shown always,
// as JSON Schema demands it always. A key no schema declares has no question, and is reported.
function requiredConditionals(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): Conditional[] {
  if (!Array.isArray(schema.required) || schema.required.length === 0) return [];
  const branch: Branch = { schema: { required: schema.required }, cond: undefined, ptr: sourcePtr, code: JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT,
    undeclared: (ptr) => ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, ptr, "") };
  return [{ reads: [], shows: new Set(), resolve: () => [branch] }];
}

// Apply `units`. Each condition is read once the questions it reads are made: a unit waits while a
// key it reads has no question and another unit can still show it (a cycle is read as it stands).
// A unit's branches show their `properties` when it is read (see `ObjectFields.show`), except under
// JSONForms. Then every branch's `required` become `requiredIf: <cond>`, or `isRequired` with no
// condition. JSON Schema demands a value whenever a key is required, so a question a branch shows is
// also shown when another branch requires it. The order of the conditionals does not change the
// result. A property one question cannot show for its branch, as another branch made it from a
// different schema, is reported with the branch's code, and is not shown by a branch that requires
// it either.
function applyConditionals(units: Conditional[], ctx: Ctx, fields: ObjectFields): void {
  const branches: Branch[] = [];
  const refused = new Map<Branch, Set<string>>();
  // For each key a branch declares `false`, the branches that do (`self`: a key the branch's own
  // condition reads); and the branches each key is required by.
  const forbids = new Map<string, { branch: Branch, self: boolean }[]>();
  const requiredBy = new Map<string, Branch[]>();
  let pending = [...units];
  const waits = (unit: Conditional) => !!fields.show
    && unit.reads.some((key) => fields.elements(key).length === 0 && pending.some((other) => other !== unit && other.shows.has(key)));
  while(pending.length > 0) {
    const unit = pending.find((u) => !waits(u)) ?? pending[0];
    pending = pending.filter((u) => u !== unit);
    for (const branch of unit.resolve()) {
      branches.push(branch);
      for (const [key, sub] of Object.entries(isPlainObject(branch.schema.properties) ? branch.schema.properties : {})) {
        const self = !!branch.read?.has(key);
        // On the data walk a branch that applies always outweighs the property's declarations (see
        // `falseAlways`); under JSONForms it is reported with the others.
        if ((sub as unknown) === false) {
          if (branch.cond !== undefined || !fields.forbid) {
            if (!forbids.has(key)) forbids.set(key, []);
            forbids.get(key)!.push({ branch, self });
          }
          continue;
        }
        if (self || !fields.show) continue;
        const ptr = propertyPointer(branch, key);
        if (fields.show(key, sub, ptr, branch.cond)) continue;
        ctx.report.assumed(branch.code, ptr, "");
        if (!refused.has(branch)) refused.set(branch, new Set());
        refused.get(branch)!.add(key);
      }
    }
  }
  for (const branch of branches) {
    const keys = Array.isArray(branch.schema.required) ? branch.schema.required.filter((k): k is string => typeof k === "string") : [];
    // A key no schema of the object declares has no question to require, and none is made for it.
    keys.forEach((key, i) => {
      if (fields.elements(key).length > 0 || fields.declares(key)) return;
      const ptr = branch.requiredPointers?.get(key) ?? `${branch.requiredPtr ?? `${branch.ptr}/required`}/${i}`;
      if (branch.undeclared) branch.undeclared(ptr);
      else ctx.report.assumed(branch.code, ptr, "");
    });
    if (branch.cond === undefined) requireAlways(keys, fields);
    else requireWhen(branch.cond, keys, fields, ctx);
    for (const key of keys) {
      if (!refused.get(branch)?.has(key)) fields.reveal?.(key, branch.cond);
      if (!requiredBy.has(key)) requiredBy.set(key, []);
      requiredBy.get(key)!.push(branch);
    }
  }
  // A key a branch declares `false` may have no value while the branch holds: its question is hidden
  // then, and survey-core clears it. Under JSONForms the Control stays, and the branch is reported.
  // While a branch that forbids the key holds, one that requires it under the same condition, always,
  // or under a condition one of them is nested in, cannot be met: no value is valid, which the form
  // cannot say, and the branch is reported.
  // A key the branch's own condition reads would hide on its own value, and is reported too.
  for (const [key, list] of forbids) {
    if (fields.elements(key).length === 0) continue;
    const required = requiredBy.get(key) ?? [];
    const hides: string[] = [];
    for (const { branch, self } of list) {
      const exact = !!fields.forbid && !self && branch.neg !== undefined;
      if (exact) hides.push(branch.neg!);
      if (!exact || required.some((other) => holdTogether(branch, other))) ctx.report.assumed(branch.code, propertyPointer(branch, key), "");
    }
    if (hides.length > 0) fields.forbid?.(key, hides);
  }
}

// Whether two branches hold together whenever one of them holds: one holds always, both under one
// condition, or one is nested in a branch of the other's condition.
function holdTogether(a: Branch, b: Branch): boolean {
  if (a.cond === undefined || b.cond === undefined || a.cond === b.cond) return true;
  return !!a.within?.includes(b.cond) || !!b.within?.includes(a.cond);
}

// The pointer of the declaration of the property `key` in `branch`.
function propertyPointer(branch: Branch, key: string): string {
  return branch.pointers?.get(key) ?? `${branch.ptr}/properties/${escapeSegment(key)}`;
}

// --- dependencies -----------------------------------------------------------

// The conditionals of `schema`'s dependencies. Every dependency is reported `assumed`. One whose
// trigger has no question has nothing to read, so it gives no branch, and a schema dependency's
// properties are not created. A schema dependency's properties only constrain its trigger, which is
// not hidden by its own presence.
function dependencyConditionals(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields): Conditional[] {
  const units: Conditional[] = [];
  const code = JsonSchemaCodes.ASSUMED_DEPENDENCIES;
  // A property dependency: the keys it lists are required while the trigger is there.
  const listed = (trigger: string, keys: unknown[], ptr: string) => {
    const read = new Set([trigger]);
    units.push({ reads: [trigger], shows: new Set(), resolve: () => {
      const ref = presenceRef(trigger, fields);
      return ref === undefined ? [] : [{ schema: { required: keys as string[] }, cond: `${ref} notempty`, neg: `${ref} empty`, ptr, code, read, requiredPtr: ptr }];
    } });
    ctx.report.assumed(code, ptr, "");
  };
  // A schema dependency, read as a branch (see `branchShape`). A `false` one, which no object with the
  // trigger meets, gives no branch: the dependency's report names it.
  const add = (trigger: string, dep: unknown, ptr: string) => {
    const read = new Set([trigger]);
    const quiet = dep === false ? undefined : branchShape(dep, ptr, quietCtx(ctx));
    if (quiet) {
      units.push({ reads: [...new Set([trigger, ...shapeReads(quiet)])], shows: shapeShows(quiet, read), resolve: () => {
        const ref = presenceRef(trigger, fields);
        const shape = ref === undefined ? undefined : branchShape(dep, ptr, ctx);
        return shape ? shapeBranches(shape, `${ref} notempty`, `${ref} empty`, read, code, ctx, fields) : [];
      } });
    }
    if (quiet || dep === false) ctx.report.assumed(code, ptr, "");
  };
  // draft-07 `dependencies`: value is either an array (property dependency) or a
  // schema (schema dependency).
  for (const [trigger, dep] of Object.entries(schema.dependencies ?? {})) {
    if (Array.isArray(dep)) listed(trigger, dep, `${sourcePtr}/dependencies/${escapeSegment(trigger)}`);
    else add(trigger, dep, `${sourcePtr}/dependencies/${escapeSegment(trigger)}`);
  }
  // draft 2019-09+ split forms.
  for (const [trigger, keys] of Object.entries(schema.dependentRequired ?? {})) {
    if (Array.isArray(keys)) listed(trigger, keys, `${sourcePtr}/dependentRequired/${escapeSegment(trigger)}`);
  }
  for (const [trigger, dep] of Object.entries(schema.dependentSchemas ?? {})) {
    add(trigger, dep, `${sourcePtr}/dependentSchemas/${escapeSegment(trigger)}`);
  }
  return units;
}

// The reference to a dependency's trigger, when `{trigger} notempty` reads its presence exactly (see
// `readsPresence`); `undefined` gives no condition, and the dependency stays reported.
function presenceRef(trigger: string, fields: ObjectFields): string | undefined {
  return readsPresence(fields.values(trigger)) ? fields.ref(trigger) : undefined;
}

// The terms an element's `visibleIf` or `requiredIf` was joined from, so that a condition two
// conditionals give alike (the same `$ref` listed twice) is written once.
const conditionTerms = new WeakMap<SurveyJSONElement, Map<string, string[]>>();

// Join `term` into `el[prop]` with `or`, unless it is there already.
function addTerm(el: SurveyJSONElement, prop: "visibleIf" | "requiredIf", term: string): void {
  let byProp = conditionTerms.get(el);
  if (!byProp) conditionTerms.set(el, byProp = new Map());
  const current = typeof el[prop] === "string" ? el[prop] as string : undefined;
  let terms = byProp.get(prop);
  // A condition written elsewhere, or renamed since, starts the list again.
  if (!terms || joinTerms(terms) !== current) terms = current === undefined ? [] : [current];
  byProp.set(prop, terms);
  if (terms.includes(term)) return;
  terms.push(term);
  el[prop] = joinTerms(terms);
}

function joinTerms(terms: string[]): string | undefined {
  return terms.length === 0 ? undefined : terms.length === 1 ? terms[0] : terms.map((t) => `(${t})`).join(" or ");
}

// `requiredIf: <cond>` on the elements made for each of `keys`. A key is required when any
// conditional that holds requires it, so the conditions are joined with `or`. A question that is
// required anyway takes none: survey-core's `requiredIf` overrides `isRequired`.
function requireWhen(cond: string, keys: string[], fields: ObjectFields, ctx: Ctx): void {
  for (const key of keys) {
    for (const el of fields.elements(key)) {
      if (el.isRequired === true) continue;
      addTerm(el, "requiredIf", cond);
      // A condition and its negation together hold always: the question is required whatever the value.
      const terms = conditionTerms.get(el)?.get("requiredIf") ?? [];
      if (terms.some((term) => terms.includes(ctx.complements.get(term) ?? ""))) {
        el.isRequired = true;
        delete el.requiredIf;
      }
    }
  }
}

// `isRequired` on the elements made for each of `keys`, which a branch that holds for every value
// requires. A `requiredIf` would override it, and any it had is weaker.
function requireAlways(keys: string[], fields: ObjectFields): void {
  for (const key of keys) {
    for (const el of fields.elements(key)) {
      el.isRequired = true;
      delete el.requiredIf;
    }
  }
}

// --- oneOf discriminator ----------------------------------------------------

interface Discriminated {
  disc: string;
  explicit: boolean;
  // `beside`: the `allOf` of a variant's `$ref` and the keywords beside it (see `besideRef`), which its
  // panel or page walks; the discriminator is read from the `$ref`'s target alone.
  variants: { value: unknown, schema: JsonSchemaDoc, index: number, beside?: JsonSchemaDoc }[];
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
    const withSiblings = resolveRef(oneOf[i], ctx, true).schema;
    variants.push({ value: constVal, schema: resolved[i], index: i, beside: refCache.allOfs.has(withSiblings) ? withSiblings : undefined });
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
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/oneOf`, "");
    }
    return;
  }
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
  // An inferred discriminator is reported at the selector: the one made here, or the one declared.
  if (!d.explicit) {
    const at = state.elements.indexOf(state.byProp.get(d.disc)!);
    ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, `${sourcePtr}/oneOf`, at < 0 ? "" : `${targetPath}[${at}]`);
  }
  const discRef = questionRef(d.disc, state)!;
  const discValues = [...(knownValues([state.byProp.get(d.disc)!], ctx.schemaOf) ?? []), ...d.variants.map((v) => v.value)];

  for (const variant of d.variants) {
    const panel: SurveyJSONElement = {
      type: "panel",
      name: uniqueName(`${d.disc}_${String(variant.value)}`, ctx)
    };
    // A variant whose value cannot be compared exactly stays visible, reported.
    const lit = equalityLiterals([variant.value], false, discValues)?.[0];
    if (lit !== undefined) panel.visibleIf = `${discRef} = ${lit}`;
    else ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, `${sourcePtr}/oneOf/${variant.index}`, `${targetPath}[${state.elements.length}]`);
    const title = variant.beside?.title ?? variant.schema.title;
    if (title !== undefined) panel.title = String(title);
    const elements = walkObject(variantSchema(variant, d.disc, `${sourcePtr}/oneOf/${variant.index}`, ctx), `${sourcePtr}/oneOf/${variant.index}`, `${targetPath}[${state.elements.length}].elements`, ctx, state.ui, depth + 1, state.refPrefix);
    if (elements.length > 0) panel.elements = elements;
    state.elements.push(panel);
  }
}

// The schema a variant's panel or page walks, at `ptr`: every property but the shared discriminator.
// A variant with keywords beside its `$ref` is merged here, its conditionals kept for the walk.
function variantSchema(variant: Discriminated["variants"][number], disc: string, ptr: string, ctx: Ctx): JsonSchemaDoc {
  const schema = variant.beside ? mergeAllOf(variant.beside, ptr, ctx) : variant.schema;
  const properties: Record<string, JsonSchemaDoc> = { ...schema.properties };
  delete properties[disc];
  const walked: JsonSchemaDoc = { ...schema, properties };
  if (variant.beside) conditionalSources.set(walked, conditionalSourcesOf(schema, ptr));
  return walked;
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
  return { node, ptr: `${ui.ptr}/${escapeSegment(key)}` };
}

// RJSF's `getUiOptions`: every `ui:` key without its prefix, with the keys of `ui:options` spread
// in, in the node's key order, so a later key wins. Each option keeps the pointer it came from. A
// `ui:widget` holding an object is refused upstream and is returned apart, to be reported.
function rjsfOptions(ui: RjsfNode): { options: Map<string, { value: unknown, ptr: string }>, objectWidgetPtr?: string } {
  const options = new Map<string, { value: unknown, ptr: string }>();
  let objectWidgetPtr: string | undefined;
  for (const [key, value] of Object.entries(ui.node)) {
    if (!key.startsWith("ui:")) continue;
    const ptr = `${ui.ptr}/${escapeSegment(key)}`;
    if (key === "ui:widget" && isPlainObject(value)) {
      objectWidgetPtr = ptr;
    } else if (key === "ui:options" && isPlainObject(value)) {
      for (const [option, optionValue] of Object.entries(value)) {
        options.delete(option);
        options.set(option, { value: optionValue, ptr: `${ptr}/${escapeSegment(option)}` });
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
// `DROPPED_CUSTOM_RENDERER`, and anything else, a new key included, is `UNSUPPORTED_UI_HINT`. Each
// read is for one question, which reports what it loses: a node that `oneOf` variants share reports
// an option every variant loses once per variant, and one a variant applies only where it is lost.
function rjsfHint(ui: RjsfNode | undefined, ctx: Ctx): UiHint {
  if (!ui) return {};
  const { options, objectWidgetPtr } = rjsfOptions(ui);
  if (objectWidgetPtr) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, objectWidgetPtr, "");

  const hint: UiHint = { ui };
  const text = (name: string) => {
    const value = options.get(name)?.value;
    return typeof value === "string" ? value : undefined;
  };
  const widget = options.get("widget");
  if (typeof widget?.value === "string") {
    hint.widget = widget.value;
    // `checkWidget` reports an unhonoured widget, where the field's type is known.
    hint.widgetPtr = widget.ptr;
    if (widget.value === "hidden") hint.hidden = true;
  }
  hint.title = text("title");
  hint.description = text("description");
  hint.placeholder = text("placeholder");
  if (options.get("disabled")?.value === true || options.get("readonly")?.value === true) hint.readOnly = true;
  // An option whose value is usable is read into the hint and held in `pending` until a question
  // applies it; an unusable one is reported below.
  const hold = (name: string) => {
    (hint.pending ??= new Map()).set(name, options.get(name)!.ptr);
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
  const target = resolveSchemaPath(schema, scope, root, true);
  if (!isPlainObject(target)) return undefined;
  const segments = scope.split("/");
  const parts = segments.map(decodeSegment).filter((p) => p.length > 0 && p !== "#");
  const name = parts[parts.length - 1] ?? "field";
  const parent = resolveSchemaPath(schema, segments.slice(0, -2).join("/"), root);
  const ownRequired = isPlainObject(parent) ? parent.required : undefined;
  const required = Array.isArray(ownRequired) && ownRequired.includes(decodeSegment(segments[segments.length - 1]));
  return { name, schema: target as JsonSchemaDoc, required };
}

// The target of a scope whose property the schema holds as `true`, from its declaration `declared`
// elsewhere: as `resolveScope` finds one.
function trueScopeTarget(scope: string, declared: JsonSchemaDoc, frame: UiFrame, ctx: Ctx): { name: string, schema: JsonSchemaDoc, required: boolean } | undefined {
  const segments = scope.split("/");
  const name = segments.map(decodeSegment).filter((p) => p.length > 0 && p !== "#").pop() ?? "field";
  const parent = resolveSchemaPath(frame.root, segments.slice(0, -2).join("/"), ctx.root);
  const ownRequired = isPlainObject(parent) ? parent.required : undefined;
  const required = Array.isArray(ownRequired) && ownRequired.includes(decodeSegment(segments[segments.length - 1]));
  return { name, schema: declared, required };
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
// Three differences. A scope's last segment holding a non-local `$ref` returns that node as is, where
// JSONForms finds nothing, so the question is built and the reference is reported as remote or as
// unresolved (or resolved through a bundled `$id`) like any other. With `beside`, a last segment
// whose `$ref` has keywords beside it returns their `allOf` (see `besideRef`), where JSONForms renders
// the target alone, as AJV validates the data with both. And a combinator entry that leads back to a
// schema the same rest of the path is already being searched from is skipped, so the next entry is
// tried; JSONForms recurses into it until the stack overflows.

interface PathWalk {
  root: JsonSchemaDoc;
  visited: Map<unknown, Set<string>>;
  // Whether the path's last node, when it has keywords beside its `$ref`, gives the `allOf` of the two
  // (see `besideRef`) rather than the target alone, which JSONForms renders: AJV validates the data
  // with both.
  beside?: boolean;
}

const SCOPE_COMBINATORS = ["oneOf", "allOf", "anyOf", "then", "else"] as const;

function resolveSchemaPath(schema: unknown, path: string, root: JsonSchemaDoc, beside = false): unknown {
  return resolveWithRef(schema, path, { root, visited: new Map(), beside });
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
    const node = next as JsonSchemaDoc;
    next = resolveWithRef(walk.root, ref, walk);
    const both = rest.length === 0 && walk.beside && next !== undefined ? besideRef(node, false) : undefined;
    if (both) return both;
  }
  return resolveWithCombinators(next, rest, walk);
}

// Where a UI node's scopes resolve. The root frame resolves against the root schema; an array's
// `options.detail` opens a frame on the items schema, whose scopes are relative to the row.
// `names` maps a data path to the data key of the first Control on it, so a rule reads that key; a
// second Control on the same data shares the value through `valueName`, as both edit one value in
// JSONForms. An object's `options.detail` opens a frame on the object schema, whose scopes are
// relative to the object; its questions sit in a static panel, in the enclosing frame's data, so it
// shares that frame's names and reference prefix, and `base` is the object's data path there.
// `elements` keeps every element made on a data path, panels included, for a schema conditional's
// `required` to mark; it is shared like `names`. `read` holds the data paths of the objects whose
// conditionals were read and reported, and `marked` the elements each object's conditionals were
// applied to, so that every Control on an object gets them once, and they are reported once.
interface UiFrame {
  root: JsonSchemaDoc;
  names: Map<string, string>;
  elements: Map<string, SurveyJSONElement[]>;
  refPrefix: string;
  base?: string[];
  read: Set<string>;
  marked: Map<string, Set<SurveyJSONElement>>;
  // The conversion's `Ctx.schemaOf`, for the values a Control can hold.
  schemaOf: WeakMap<SurveyJSONElement, JsonSchemaDoc>;
  // The pointer of the frame's schema from the schema root (`#`), which a report pointer of one of
  // its scopes starts from: a detail's scopes are relative to the items or the object schema.
  schemaPtr: string;
  // The pointer of the schema of the data the maps' paths start from: the root schema, or an array's
  // items schema. An object's detail shares it with its enclosing frame, as it shares the maps.
  dataPtr: string;
  // The Controls this frame's layout made on a scope through an object's `properties`, each with its
  // data path. Their objects are read when the layout is walked (see `finishNestedScopes`).
  nested: { el: SurveyJSONElement, path: string[] }[];
  // The schemas the Controls' scopes found on each data path, which their questions take; shared
  // like `names`.
  found: Map<string, Set<JsonSchemaDoc>>;
}

function newFrame(root: JsonSchemaDoc, refPrefix: string, schemaOf: WeakMap<SurveyJSONElement, JsonSchemaDoc>, schemaPtr: string): UiFrame {
  return { root, names: new Map(), elements: new Map(), refPrefix, read: new Set(), marked: new Map(), schemaOf, schemaPtr, dataPtr: schemaPtr, nested: [], found: new Map() };
}

// The report pointer of a scope of `frame`, from the schema root. `#/`, which JSONForms resolves to
// the schema itself, is the frame's schema.
function scopePointer(scope: string, frame: UiFrame): string {
  const rest = scope.replace(/^#/, "").replace(/^\/$/, "");
  if (rest === "") return frame.schemaPtr;
  if (frame.schemaPtr === "#") return scope;
  return `${frame.schemaPtr}${rest.startsWith("/") ? "" : "/"}${rest}`;
}

// The data path JSONForms binds a scope to: `toDataPathSegments` in @jsonforms/core
// (`packages/core/src/util/path.ts`), which drops each combinator step (`anyOf/0/`, `then/`) from
// the scope and keeps every second segment after `#`. So `#/anyOf/0/then/properties/x` and
// `#/properties/x` are the same value. As there, the rewrite also applies inside a property name
// ending in `then` or `else` (`strengthen/` loses `then/`). Unlike there, every `~0` is decoded,
// not only the first. Each step is removed in one left-to-right pass, as the global replace there
// does; this is path rewriting, not sanitizing.
function dataPathSegments(scope: string): string[] {
  const rewritten = scope.split(/(?:anyOf|allOf|oneOf)\/\d+\//).join("").split(/(?:then|else)\//).join("");
  const segments = rewritten.split("/").map(decodeSegment);
  const out: string[] = [];
  for (let i = segments[0] === "#" || segments[0] === "" ? 2 : 1; i < segments.length; i += 2) out.push(segments[i]);
  return out;
}

// The number of `properties` steps in a scope: the depth of the value it names, read from the scope
// itself rather than from `dataPathSegments`, which drops a `then/` inside a property name too. A
// combinator step (`allOf/0`, `then`, `else`) or an `items` step adds none.
function propertySteps(scope: string): number {
  const segments = scope.split("/");
  let steps = 0;
  for (let i = segments[0] === "#" || segments[0] === "" ? 1 : 0; i < segments.length;) {
    const segment = segments[i];
    if (segment === "properties") {
      steps++;
      i += 2;
    } else i += segment === "allOf" || segment === "anyOf" || segment === "oneOf" ? 2 : 1;
  }
  return steps;
}

// The pointer of every declaration of the data a scope of `frame` binds, which `declaredAt` reads: the
// scope's `properties` steps from the frame's data. A combinator step of the scope (`allOf/0`, `then`)
// is no step of the data, and every declaration on the data's path holds for it. The steps are read
// from the scope itself, as `propertySteps` reads them: `dataPathSegments`, which follows JSONForms,
// drops a `then/` inside a property name too. A scope through any other step (`items`) keeps its own
// pointer, which `declaredAt` follows.
function declarationPointer(scope: string, schemaPtr: string, frame: UiFrame): string {
  const segments = scope.split("/");
  const keys: string[] = [];
  for (let i = segments[0] === "#" || segments[0] === "" ? 1 : 0; i < segments.length;) {
    const segment = segments[i];
    const step = segment === "properties" || segment === "allOf" || segment === "anyOf" || segment === "oneOf";
    if (step && i + 1 >= segments.length) return schemaPtr;
    if (segment === "properties") keys.push(decodeSegment(segments[i + 1]));
    if (step) i += 2;
    else if (segment === "then" || segment === "else" || segment === "") i++;
    else return schemaPtr;
  }
  return dataPointer([...(frame.base ?? []), ...keys], frame);
}

// A data path as a key of a frame's maps.
function pathKey(path: string[]): string {
  return JSON.stringify(path);
}

// The data path of a scope of `frame`, from the frame's data: an object frame's scope is put under
// the object's data path in the enclosing frame.
function framePath(scope: string, frame: UiFrame): string[] {
  return [...(frame.base ?? []), ...dataPathSegments(scope)];
}

function frameKey(scope: string, frame: UiFrame): string {
  return pathKey(framePath(scope, frame));
}

// Put the question a Control made on the data path `key` into the frame's names. A path already
// there is a second Control on one value, which shares it. A panel has no value, so it is not put
// in: a rule naming an object scope has nothing to compare, and is reported. True when `el` took a
// `valueName`.
function registerScope(key: string, el: SurveyJSONElement, frame: UiFrame): boolean {
  const onScope = frame.elements.get(key);
  if (onScope) onScope.push(el);
  else frame.elements.set(key, [el]);
  if (el.type === "panel") return false;
  const shared = frame.names.get(key);
  if (shared === undefined) {
    frame.names.set(key, el.name as string);
    return false;
  }
  el.valueName = shared;
  return true;
}

// Put the questions an object Control's data walk made into the frame's names. survey-core reads
// an expression's `{name}` by data key, so a field that takes a `valueName` is renamed in the
// expressions the walk wrote under the panel.
function shareObjectFields(path: string[], panel: SurveyJSONElement, frame: UiFrame, ctx: Ctx): void {
  const renames = new Map<string, string>();
  registerObjectFields(path, panel, frame, ctx, renames);
  if (renames.size > 0) renameRefs(panel, renames);
}

// The fields go under the object's data path and their key, and those of each nested object under
// its own. `renames` maps each reference to a field that took a `valueName` to its data key's. The
// walk read and applied each object's conditionals to its own fields.
function registerObjectFields(path: string[], panel: SurveyJSONElement, frame: UiFrame, ctx: Ctx, renames: Map<string, string>): void {
  const fields = ctx.objectFields.get(panel);
  if (!fields) return;
  const objectKey = pathKey(path);
  frame.read.add(objectKey);
  const marked = frame.marked.get(objectKey) ?? new Set<SurveyJSONElement>();
  frame.marked.set(objectKey, marked);
  for (const [key, el] of fields) {
    marked.add(el);
    const sub = [...path, key];
    if (registerScope(pathKey(sub), el, frame)) renames.set(`{${frame.refPrefix}${el.name}}`, `{${frame.refPrefix}${el.valueName}}`);
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
    if (typeof expr === "string") node[prop] = renameTokens(expr, renames);
  }
  for (const key of ["elements", "templateElements"]) {
    const children = node[key];
    if (Array.isArray(children)) for (const child of children) renameRefs(child as SurveyJSONElement, renames);
  }
}

// `expr` with each `{name}` reference in `renames` replaced, and its text literals kept as written.
// A literal is read as survey-core's parser reads it (`parseString`): it ends at its own quote, and
// a backslash before either quote escapes it.
function renameTokens(expr: string, renames: Map<string, string>): string {
  let out = "";
  let i = 0;
  while(i < expr.length) {
    const c = expr[i];
    if (c === "'" || c === "\"") {
      let end = i + 1;
      while(end < expr.length && expr[end] !== c) end += expr[end] === "\\" && (expr[end + 1] === "'" || expr[end + 1] === "\"") ? 2 : 1;
      out += expr.slice(i, end + 1);
      i = end + 1;
    } else if (c === "{") {
      const close = expr.indexOf("}", i);
      const token = close < 0 ? expr.slice(i) : expr.slice(i, close + 1);
      out += renames.get(token) ?? token;
      i += token.length;
    } else {
      out += c;
      i++;
    }
  }
  return out;
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
    else if (JSONFORMS_PRESENTATION.has(k)) ctx.report.dropped(JsonSchemaCodes.DROPPED_STYLING, `${sourcePtr}/options/${escapeSegment(k)}`, "");
    else ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/${escapeSegment(k)}`, "");
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

// The data path in a row that a JSONForms label option names. `elementLabelProp` is a dotted path,
// read with lodash's `get` (`computeChildLabel`, @jsonforms/core `packages/core/src/mappers/
// renderer.ts`). `labelRef` is a pointer into the items schema (`#/items/properties/a/properties/
// b`), read as `removeSchemaKeywords` reads it (@jsonforms/angular-material `master-detail/
// master.ts`): without the `#`, `properties` and `items` segments.
function labelPath(key: string, value: unknown): string[] | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  const path = key === "labelRef"
    ? value.split("/").filter((s) => s !== "#" && s !== "properties" && s !== "items").map(decodeSegment)
    : value.split(".");
  return path.length > 0 && path.every((s) => s.length > 0) ? path : undefined;
}

// A report that records nothing, for reading a schema a second time.
const quietReport = { unsupported() { /* none */ }, dropped() { /* none */ }, assumed() { /* none */ } } as unknown as Ctx["report"];

// `ctx` for reading a schema ahead of the walk that reports it: nothing is recorded, and a remote
// `$ref` it meets is not taken as reported.
function quietCtx(ctx: Ctx): Ctx {
  return { ...ctx, report: quietReport, remoteRefs: new Set(ctx.remoteRefs) };
}

// Map the `options` of a Control that need the question: `restrict` and `step`, `slider`, and the
// label of a dynamic panel's items. `toggle` asks for a switch, which a `boolean` already is;
// JSONForms applies it to a boolean only (`isBooleanControl` in its toggle renderer's tester). An
// option that cannot be applied to the question is reported, as one with no rule is.
function applyControlOptions(ui: UiNode, el: SurveyJSONElement, schema: JsonSchemaDoc, hint: UiHint, sourcePtr: string, ctx: Ctx): void {
  const opts = ui.options;
  if (!opts || typeof opts !== "object") return;
  const unapplied = (key: string) => ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/${escapeSegment(key)}`, "");
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
  if (opts.toggle === true && el.type !== "boolean") unapplied("toggle");
  // The row's question on the label's full path: a property of a nested object is not taken for a
  // question of the row with the same name.
  for (const key of ["elementLabelProp", "labelRef"]) {
    const value = opts[key];
    if (value === undefined) continue;
    const path = labelPath(key, value);
    const dataKey = el.type === "paneldynamic" && path ? hint.rowKey?.(path) : undefined;
    if (dataKey !== undefined) el.templateTitle = `{panel.${dataKey}}`;
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
function readDetail(node: UiNode, scope: string, schemaPtr: string, schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, depth: number, hint: UiHint): UiHint["template"] {
  const detail = node.options?.detail;
  if (detail === undefined || detail === "GENERATED" || detail === "DEFAULT") return undefined;
  // The object or the array is read as `mapProperty` reads it: its `allOf` merged.
  const target = resolveRef(schema, ctx, true).schema;
  const merged = mergeAllOf(target, schemaPtr, quietCtx(ctx));
  const isObject = isObjectSchema(merged);
  if (!detail || typeof detail !== "object" || (effectiveType(merged) !== "array" && !isObject)) {
    ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/options/detail`, "");
    return undefined;
  }
  return (inner, targetPath) => {
    const outer = ctx.uiFrame;
    ctx.uiFrame = isObject
      ? { ...outer, root: inner, base: framePath(scope, outer), schemaPtr, nested: [] }
      : newFrame(inner, "panel.", ctx.schemaOf, `${schemaPtr}/items`);
    if (!isObject) {
      const rowFrame = ctx.uiFrame;
      hint.rowKey = (path) => rowFrame.names.get(pathKey(path));
    }
    // JSONForms renders the layout at the row's (or the object's) data path, and evaluates a rule on
    // its root there (`mapStateToLayoutProps`): the rule hides or disables the whole detail. A root
    // layout with a rule is then not flattened: it becomes the detail's panel, which carries it.
    const layout = detail as UiNode;
    const ruled = (layout.type === "VerticalLayout" || layout.type === "HorizontalLayout") && !!layout.rule;
    const elements = ruled
      ? walkUiNode(detail, `${sourcePtr}/options/detail`, `${targetPath}[0]`, ctx, depth + 1, false)
      : walkUiNode(detail, `${sourcePtr}/options/detail`, targetPath, ctx, depth + 1, true);
    // The layout replaces the data walk, so the object's (or the items') conditionals are read here,
    // through the Controls it made. A pointer is the scope's from the schema root, as `mapProperty`'s
    // are.
    if (isObject) applyFrameConditionals(target, schemaPtr, ctx);
    else if (merged.items) applyFrameConditionals(merged.items, `${schemaPtr}/items`, ctx);
    finishNestedScopes(ctx.uiFrame, ctx);
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
      let resolved = resolveScope(ui.scope, frame.root, ctx.root);
      if (!resolved && resolveSchemaPath(frame.root, ui.scope, ctx.root, true) === true) {
        // A property the schema holds as `true` allows every value and constrains nothing. Another
        // declaration of it that does is mapped, as an object Control is; with none, JSONForms
        // renders no input for it.
        const declared = declaredAt(declarationPointer(ui.scope, scopePointer(ui.scope, frame), frame), ctx);
        if (declared && Object.keys(declared).length > 0) resolved = trueScopeTarget(ui.scope, declared, frame, ctx);
        if (!resolved) {
          ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, scopePointer(ui.scope, frame), "");
          return [];
        }
      }
      if (!resolved) {
        ctx.report.unsupported(JsonSchemaCodes.UNRESOLVED_SCOPE, `${sourcePtr}/scope`, "");
        return [];
      }
      const schemaPtr = scopePointer(ui.scope, frame);
      const found = resolved.schema;
      // Every declaration of the property, as on the data walk.
      const declaration = controlSchema(resolved.schema, schemaPtr, declarationPointer(ui.scope, schemaPtr, frame), ctx);
      if (!declaration) return [];
      resolved.schema = declaration;
      const target = resolveRef(resolved.schema, quietCtx(ctx), true);
      const merged = mergeAllOf(target.schema, schemaPtr, quietCtx(ctx));
      // A remote target's type is not known: it is a Control's, reported as remote by `mapProperty`.
      if (ui.type === "ListWithDetail" && !target.remote && effectiveType(merged) !== "array") {
        // The Material and Vuetify ListWithDetail renderers take an array of objects only
        // (`isObjectArray`). Angular's master-detail takes any ListWithDetail, and lists the scope's
        // data as an array (`(data || []).map`), so it renders nothing for an object or a scalar
        // either; an array of primitives it lists, which a dynamic panel keeps.
        ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_UI_HINT, `${sourcePtr}/type`, "");
        return [];
      }
      const hint = jsonFormsHint(ui, ctx, sourcePtr);
      hint.template = readDetail(ui, ui.scope, schemaPtr, resolved.schema, sourcePtr, ctx, depth, hint);
      const path = framePath(ui.scope, frame);
      hint.present = path.length === 0;
      // An earlier Control on this object read and reported its conditionals.
      const quiet = ctx.quietConditionalsAt;
      if (frame.read.has(pathKey(path))) ctx.quietConditionalsAt = schemaPtr;
      const el = mapProperty(resolved.name, resolved.schema, schemaPtr, targetPath, ctx, resolved.required, hint, depth, frame.refPrefix);
      ctx.quietConditionalsAt = quiet;
      if (!el) return [];
      if (ui.type === "ListWithDetail") ctx.report.dropped(JsonSchemaCodes.DROPPED_STYLING, `${sourcePtr}/type`, targetPath);
      // JSONForms keeps the value at the scope's data path; survey-core keeps it under one key of the
      // form (or the row), which a scope through an object's properties changes.
      if (propertySteps(ui.scope) > 1) ctx.report.assumed(JsonSchemaCodes.ASSUMED_NESTED_SCOPE, `${sourcePtr}/scope`, targetPath);
      if (!readLabel(ui.label).show) el.titleLocation = "hidden";
      applyReadonlyOption(ui, el);
      applyControlOptions(ui, el, merged, hint, sourcePtr, ctx);
      registerScope(pathKey(path), el, frame);
      if (!frame.found.has(pathKey(path))) frame.found.set(pathKey(path), new Set());
      frame.found.get(pathKey(path))!.add(found);
      if (dataPathSegments(ui.scope).length > 1) frame.nested.push({ el, path });
      if (el.type === "panel") shareObjectFields(path, el, frame, ctx);
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
  if (c.type === "LEAF") return equalityTerm(c.scope, [c.expectedValue], frame);
  if ("schema" in c) {
    const term = schemaTerm(c.scope, c.schema, frame);
    if (term === undefined || c.failWhenUndefined !== true) return term;
    // With failWhenUndefined, an absent value fails before the schema is checked.
    const ref = readsPresence(scopeValues(c.scope, frame)) ? scopeRef(c.scope, frame) : undefined;
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
  if (keys.length === 1 && keys[0] === "const") return equalityTerm(scope, [s.const], frame);
  if (keys.length === 1 && keys[0] === "enum" && Array.isArray(s.enum) && s.enum.length > 0) return equalityTerm(scope, s.enum, frame);
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
      const sub = `${base}/properties/${escapeSegment(name)}`;
      const ref = readsPresence(scopeValues(sub, frame)) ? scopeRef(sub, frame) : undefined;
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
  const name = frame.names.get(frameKey(scope, frame));
  return name === undefined ? undefined : `{${frame.refPrefix}${name}}`;
}

// The values the Controls on `scope` can hold, when they are known (see `knownValues`).
function scopeValues(scope: string, frame: UiFrame): unknown[] | undefined {
  return knownValues(frame.elements.get(frameKey(scope, frame)) ?? [], frame.schemaOf);
}

// `{q} = <literal>` for a JSONForms condition that holds when the value at `scope` is one of
// `allowed`, as a LEAF's `===` and AJV's `const` and `enum` hold, and never with no value.
function equalityTerm(scope: string, allowed: unknown[], frame: UiFrame): string | undefined {
  const ref = scopeRef(scope, frame);
  const lits = ref === undefined ? undefined : equalityLiterals(allowed, false, scopeValues(scope, frame));
  if (!lits || lits.length === 0) return undefined;
  return lits.length === 1 ? `${ref} = ${lits[0]}` : `(${lits.map((lit) => `${ref} = ${lit}`).join(" or ")})`;
}

// --- JSONForms schema conditionals ------------------------------------------------

// The `if`/`then`/`else` and dependencies of a frame's object, read once its layout is walked: the
// root schema after the UI walk, an object or an array's items after a `detail` layout. JSONForms
// shows and hides only by `rule` and reads these only to validate, so a branch gives `requiredIf`
// only. A key is the Control on `#/properties/<key>` in the frame, read by its data key (from the
// row, in an array's detail); a key with no Control has nothing to read or mark, and an `if` or a
// trigger on it is reported as the data walk reports it. Every Control on the object reads them: an
// object's second Control, or a data walk on it, marks only the elements no earlier one marked, and
// reports nothing again.
function applyFrameConditionals(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): void {
  const frame = ctx.uiFrame;
  const objectKey = frameKey("#", frame);
  const prior = frame.marked.get(objectKey) ?? new Set<SurveyJSONElement>();
  const marked = new Set(prior);
  const scope = (key: string) => `#/properties/${escapeSegment(key)}`;
  // Read and reported already by an earlier Control on the object, or by a data walk on it.
  const read = frame.read.has(objectKey) || ctx.readConditionals.has(sourcePtr) ? { ...ctx, report: quietReport } : ctx;
  frame.read.add(objectKey);
  ctx.readConditionals.add(sourcePtr);
  // Every declaration of the object, when they include the schema the scope found (see `objectSources`).
  const target = resolveRef(schema, ctx, true);
  const merged = target.remote ? undefined : mergeAllOf(target.schema, sourcePtr, quietCtx(ctx));
  const own = merged ? conditionalSourcesOf(merged, sourcePtr) : [];
  const sources = declaredSources(own, sourcePtr, read);
  const keys = withoutFalse(declaredKeys(sources ? sources.map((source) => source.schema) : [schema], ctx), declaredAt(sourcePtr, ctx) ?? merged ?? {});
  const fields: ObjectFields = {
    declares: (key) => keys.has(key),
    ref: (key) => scopeRef(scope(key), frame),
    values: (key) => scopeValues(scope(key), frame),
    elements: (key) => {
      const fresh = (frame.elements.get(frameKey(scope(key), frame)) ?? []).filter((el) => !prior.has(el));
      for (const el of fresh) marked.add(el);
      return fresh;
    },
    type: (key) => schemaType(frame.elements.get(frameKey(scope(key), frame)) ?? [], frame.schemaOf)
  };
  const declaration = merged ?? mergeAllOf(target.schema, sourcePtr, quietCtx(ctx));
  reportFreeKeys(declaration, sourcePtr, read);
  reportObjectKeywords(declaration, sourcePtr, read);
  const seen = new Set<object>();
  const object: FrameObject = {
    ptr: sourcePtr,
    declared: declaredAt(sourcePtr, ctx) ?? merged,
    named: (key) => (frame.elements.get(frameKey(scope(key), frame)) ?? []).length > 0,
    found: (key) => frame.found.get(frameKey(scope(key), frame))
  };
  if (sources) for (const source of sources) readFrameConditionals(source.schema, source.ptr, read, fields, seen, object);
  else readFrameConditionals(schema, sourcePtr, read, fields, seen, object);
  frame.marked.set(objectKey, marked);
}

// Read the objects that the frame's Controls on nested scopes (`frame.nested`) go through, once its
// layout is walked. An object no Control walked, and no detail read, has its conditionals and its
// `required` read here, on the Controls on its fields, as AJV validates them. Then each such Control's
// requirement holds only while the innermost optional object on its path holds a value (see
// `mapObjectPanel`): one of the Controls on that object's fields is not empty. An object a scope does
// not reach through `properties` steps of declared objects is passed over.
function finishNestedScopes(frame: UiFrame, ctx: Ctx): void {
  const from = frame.base?.length ?? 0;
  const objects = new Map<string, string[]>();
  for (const { path } of frame.nested) {
    for (let n = from + 1; n < path.length; n++) objects.set(pathKey(path.slice(0, n)), path.slice(0, n));
  }
  for (const [key, path] of objects) {
    if (frame.read.has(key)) continue;
    const ptr = dataPointer(path, frame);
    const declared = declaredAt(ptr, ctx);
    if (!declared || !isObjectSchema(declared)) continue;
    const outer = ctx.uiFrame;
    ctx.uiFrame = { ...frame, root: declared, base: path, schemaPtr: ptr, nested: [] };
    applyFrameConditionals(declared, ptr, ctx);
    ctx.uiFrame = outer;
  }
  const presences = new Map<string, string[]>();
  for (const { el, path } of frame.nested) {
    for (let n = path.length - 1; n > from; n--) {
      const object = path.slice(0, n);
      if (!isOptionalObject(object, frame, ctx)) continue;
      const key = pathKey(object);
      if (!presences.has(key)) presences.set(key, registeredRefs(object, frame));
      requireWhilePresent([el], presences.get(key)!, frame.refPrefix, ctx);
      ctx.presenceElements.add(el);
      if (el.type === "panel") ctx.presencePanels.add(el);
      break;
    }
  }
  frame.nested = [];
}

// The schema pointer of the data path `path` of `frame`: a `properties` step for each key.
function dataPointer(path: string[], frame: UiFrame): string {
  return frame.dataPtr + path.map((key) => `/properties/${escapeSegment(key)}`).join("");
}

// Whether the data path `path` of `frame` names an object its parent does not list in `required`.
function isOptionalObject(path: string[], frame: UiFrame, ctx: Ctx): boolean {
  const own = declaredAt(dataPointer(path, frame), ctx);
  const parent = declaredAt(dataPointer(path.slice(0, -1), frame), ctx);
  if (!own || !parent || !isObjectSchema(own)) return false;
  return !(Array.isArray(parent.required) && parent.required.includes(path[path.length - 1]));
}

// The references of the questions the frame's Controls made on the fields of the object at `path`,
// nested ones included.
function registeredRefs(path: string[], frame: UiFrame): string[] {
  const prefix = `${pathKey(path).slice(0, -1)},`;
  const refs: string[] = [];
  for (const [key, name] of frame.names) if (key.startsWith(prefix)) refs.push(`{${frame.refPrefix}${name}}`);
  return refs;
}

// A frame's object, for the `anyOf` and `oneOf` entries that constrain its Controls (see
// `reportEntryConstraints`): its pointer, its declaration, whether a Control names a key, and the
// schemas the Controls on a key found.
interface FrameObject {
  ptr: string;
  declared: JsonSchemaDoc | undefined;
  named: (key: string) => boolean;
  found: (key: string) => Set<JsonSchemaDoc> | undefined;
}

// The conditionals of `raw`, its `$ref` followed, and of its `allOf`, `anyOf` and `oneOf` entries.
// An `allOf` entry holds as the schema does, and so does the only entry of an `anyOf` or `oneOf`. A
// `false` one is reported (see `reportFalseEntries`).
// With several entries the one that must hold is not known: their conditionals are reported
// (`fields` is undefined), not applied. A remote `$ref` is reported unless the walk already did.
// Inside an `anyOf` or `oneOf` entry (`inEntry`), what it declares for the Controls' keys is not
// merged into them, and is reported (see `reportEntryConstraints`).
function readFrameConditionals(raw: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, fields: ObjectFields | undefined, seen: Set<object>,
  object: FrameObject, inEntry = false): void {
  // A `false` entry allows no object.
  if ((raw as unknown) === false) {
    reportDropped(sourcePtr, ctx);
    return;
  }
  const resolved = resolveRef(raw, ctx, true);
  if (resolved.remote) {
    if (!ctx.remoteRefs.has(sourcePtr)) reportRemoteRef(sourcePtr, "", ctx, resolved.unresolved);
    return;
  }
  const schema = resolved.schema;
  if (seen.has(schema)) return;
  seen.add(schema);
  if (fields) {
    applyConditionals(conditionalsOf(schema, sourcePtr, ctx, fields, true), ctx, fields);
  } else {
    if (schema.if !== undefined && ifMatters(schema, sourcePtr, ctx)) ctx.report.assumed(JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, `${sourcePtr}/if`, "");
    for (const key of ["dependencies", "dependentRequired", "dependentSchemas"] as const) {
      for (const trigger of Object.keys(schema[key] ?? {})) ctx.report.assumed(JsonSchemaCodes.ASSUMED_DEPENDENCIES, `${sourcePtr}/${key}/${escapeSegment(trigger)}`, "");
    }
  }
  if (inEntry) reportEntryConstraints(schema, sourcePtr, ctx, object, fields === undefined);
  for (const key of ["allOf", "anyOf", "oneOf"] as const) {
    const entries = schema[key];
    if (!Array.isArray(entries)) continue;
    entries.forEach((entry, i) => {
      if (!isPlainObject(entry) && (entry as unknown) !== false) return;
      const holds = key === "allOf" || entries.length === 1;
      const ptr = key === "allOf" ? allOfEntryPointer(schema, sourcePtr, i) : `${sourcePtr}/${key}/${i}`;
      readFrameConditionals(entry, ptr, ctx, holds ? fields : undefined, seen, object, inEntry || key !== "allOf");
    });
  }
}

// Report what the `anyOf` or `oneOf` entry `schema` at `sourcePtr` declares for a key a Control names,
// as `unsupported-keyword`: a property schema that constrains more than the object's own declaration
// of it, which the Control's question does not take (unless its scope found that very schema, as a
// scope that resolves through the entry does), and, when the entry is not known to hold
// (`holdsNot`), a `required` key the object does not require already. The only entry holds, and its
// `required` is applied with its conditionals.
function reportEntryConstraints(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx, object: FrameObject, holdsNot: boolean): void {
  const quiet = quietCtx(ctx);
  for (const [key, sub] of Object.entries(isPlainObject(schema.properties) ? schema.properties : {})) {
    if (!object.named(key)) continue;
    // A schema with a keyword beside its `$ref` is found as the `allOf` of the two (see `besideRef`).
    const found = object.found(key);
    const both = isPlainObject(sub) ? besideRef(sub as JsonSchemaDoc, false) : undefined;
    if (found && (found.has(sub as JsonSchemaDoc) || (both !== undefined && found.has(both)))) continue;
    const ptr = lossKey(sourcePtr, key);
    const declared = declaredAt(lossKey(object.ptr, key), ctx) ?? {};
    const resolved = isPlainObject(sub) ? resolveRef(sub as JsonSchemaDoc, quiet, true) : undefined;
    const constrains = !resolved ? (sub as unknown) === false
      : resolved.remote || setsMore(mergeAllOf(resolved.schema, ptr, quiet), declared);
    if (constrains) ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, ptr, "");
  }
  if (!holdsNot || !Array.isArray(schema.required)) return;
  const required = Array.isArray(object.declared?.required) ? object.declared!.required : [];
  schema.required.forEach((key, i) => {
    if (typeof key === "string" && object.named(key) && !required.includes(key)) {
      ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, `${sourcePtr}/required/${i}`, "");
    }
  });
}

// Whether the branches of `schema`'s `if` that can apply give anything under JSONForms (see
// `shapeMatters`).
function ifMatters(schema: JsonSchemaDoc, sourcePtr: string, ctx: Ctx): boolean {
  const always = constantIf(schema.if);
  const quiet = quietCtx(ctx);
  return (always !== false && shapeMatters(branchShape(schema.then, `${sourcePtr}/then`, quiet)))
    || (always !== true && shapeMatters(branchShape(schema.else, `${sourcePtr}/else`, quiet)));
}

// --- entry point ------------------------------------------------------------

/**
 * Convert a JSON Schema (optionally with a UI schema) to SurveyJS survey JSON.
 *
 * Never throws on an unsupported keyword -- those are recorded in the report.
 * Throws only for input that is not a JSON Schema at all.
 */
export function convert(input: unknown): ConversionResult<SurveyJSON> {
  return withRefCache(() => convertSchema(input));
}

function convertSchema(input: unknown): ConversionResult<SurveyJSON> {
  const { schema, uiSchema } = normalizeInput(input);
  const report = new ReportBuilder(SOURCE);
  const uiKind = detectUiKind(uiSchema);
  const schemaOf = new WeakMap<SurveyJSONElement, JsonSchemaDoc>();
  const ctx: Ctx = {
    report,
    usedNames: new Set<string>(),
    reservedNames: uiKind === "jsonforms" ? collectPropertyNames(schema) : new Set<string>(),
    uiKind,
    remoteRefs: new Set<string>(),
    root: schema,
    uiFrame: newFrame(schema, "", schemaOf, "#"),
    uiRules: [],
    objectFields: new WeakMap(),
    readConditionals: new Set<string>(),
    declared: new Map(),
    declaredNodes: new Map(),
    complements: new Map(),
    mergeLosses: new Map(),
    mergeReported: new Set<string>(),
    presenceElements: new WeakSet(),
    presencePanels: new WeakSet(),
    minChoices: new Map(),
    schemaOf
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
      // A root layout is flattened into the form's elements; any other node is the first of them.
      output.elements = walkUiNode(ui, "#/uiSchema", isRootLayout ? "elements" : "elements[0]", ctx, 0, true);
    }
    applyFrameConditionals(ctx.root, "#", ctx);
    finishNestedScopes(ctx.uiFrame, ctx);
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

  // A root `$ref` names the form's schema, with the keywords beside it (see `besideRef`). One the
  // converter cannot follow leaves the root's own keywords, and is reported where they give the form.
  const root = resolveRef(schema, ctx, true);
  // A top-level discriminated oneOf becomes one page per variant.
  const merged = mergeAllOf(root.remote ? schema : root.schema, "#", ctx);
  const topDiscriminator = detectDiscriminator(merged, ctx);
  const hasProperties = !!merged.properties && Object.keys(merged.properties).length > 0;
  // A root whose fields are only in `anyOf` variants: the walk does not model `anyOf`, and a question
  // for the whole form would hold no field of it.
  const anyOfVariants = !hasProperties && !merged.oneOf && objectCompositions(merged, ctx).includes("anyOf");
  // `help` describes the form when it has no description. A lone scalar root takes it as its own.
  if (topDiscriminator || hasProperties || merged.oneOf || merged.if !== undefined || merged.dependencies || anyOfVariants) {
    if (rootHint.help !== undefined && output.description === undefined) {
      output.description = rootHint.help;
      consumeOption(rootHint, "help");
    }
    reportPending(rootHint, ctx);
    if (root.remote) reportRemoteRef("#", "", ctx, root.unresolved);
  }
  if (topDiscriminator && !hasProperties) {
    output.pages = buildDiscriminatorPages(merged, topDiscriminator, ctx, rjsfUi);
    return { output, report: report.build() };
  }

  if (hasProperties || merged.oneOf || merged.if !== undefined || merged.dependencies) {
    // The merged root, so that its `allOf` is merged and reported once.
    output.elements = walkObject(merged, "#", "elements", ctx, rjsfUi, 0);
  } else if (anyOfVariants) {
    ctx.report.unsupported(JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/anyOf", "");
    output.elements = [];
  } else {
    // Root is a single scalar/array schema -> one question, from the merged root, which is reported
    // once.
    const el = mapProperty(String(schema.title ?? "value"), merged, "#", "elements[0]", ctx, false, rootHint, 0);
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
  if (!d.explicit) ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, "#/oneOf", "pages[0].elements[0]");
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
    const page: SurveyJSONPage = {
      name: uniqueName(`${d.disc}_${String(variant.value)}`, ctx),
      elements: walkObject(variantSchema(variant, d.disc, `#/oneOf/${variant.index}`, ctx), `#/oneOf/${variant.index}`, `pages[${variant.index + 1}].elements`, ctx, rjsfUi, 1)
    };
    // A variant whose value cannot be compared exactly stays visible, reported.
    const lit = equalityLiterals([variant.value], false, d.variants.map((v) => v.value))?.[0];
    if (lit !== undefined) page.visibleIf = `{${selectorName}} = ${lit}`;
    else ctx.report.assumed(JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR, `#/oneOf/${variant.index}`, `pages[${variant.index + 1}]`);
    const title = variant.beside?.title ?? variant.schema.title;
    if (title !== undefined) page.title = String(title);
    pages.push(page);
  }
  return pages;
}

export { JsonSchemaCodes } from "./codes";
export type { ConversionResult } from "../report";
