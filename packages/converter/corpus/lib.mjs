/* eslint-env node */

// Shared helpers for the corpus refresh job (`refresh.mjs`).
//
// CONTENT-FREE boundary: this module fetches and extracts raw upstream
// definitions and writes them into `corpus/<source>/` (where raw content is
// allowed to live). Everything it feeds the ALERT/telemetry side is structural
// only — construct tokens (a component `type`, a JSON Schema keyword), file
// paths, and counts. It never lifts a label, option text, or expression source
// into an alert. Keep that split: raw defs go to disk, tokens go to alerts.

import { runInNewContext } from "node:vm";
import { tableCellComponents } from "./scoring.mjs";

// --- GitHub fetch -----------------------------------------------------------

const GH_HEADERS = () => {
  const h = { "User-Agent": "surveyjs-corpus-refresh", Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

/** List every blob path in a repo at a ref via the git-trees API (recursive). */
export async function listRepoFiles(repo, ref) {
  const url = `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`;
  const res = await fetch(url, { headers: GH_HEADERS() });
  if (!res.ok) throw new Error(`GitHub trees ${repo}@${ref}: ${res.status} ${res.statusText}`);
  const body = await res.json();
  if (body.truncated) {
    // The trees API caps at ~100k entries. We do NOT silently proceed on a
    // partial tree — the caller logs it so a shrinking scrape is visible.
    return { paths: (body.tree || []).filter((t) => t.type === "blob").map((t) => t.path), truncated: true };
  }
  return { paths: (body.tree || []).filter((t) => t.type === "blob").map((t) => t.path), truncated: false };
}

/** The commit a ref points at, so a snapshot records exactly what it was scraped from. */
export async function resolveCommit(repo, ref) {
  const url = `https://api.github.com/repos/${repo}/commits/${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: GH_HEADERS() });
  if (!res.ok) throw new Error(`GitHub commit ${repo}@${ref}: ${res.status} ${res.statusText}`);
  const body = await res.json();
  return body.sha;
}

/** Fetch a single file's raw text. */
export async function fetchRaw(repo, ref, path) {
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${path}`;
  const res = await fetch(url, { headers: { "User-Agent": "surveyjs-corpus-refresh" } });
  if (!res.ok) throw new Error(`raw ${repo}/${path}: ${res.status}`);
  return res.text();
}

// --- glob matching ----------------------------------------------------------

/** Minimal glob → RegExp supporting `**`, `*`, `?`, and `{a,b}` alternation. */
export function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") { re += ".*"; i++; if (glob[i + 1] === "/") i++; }
      else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else if (c === "{") { re += "(?:"; }
    else if (c === "}") { re += ")"; }
    else if (c === ",") { re += "|"; }
    else re += c.replace(/[.+^$()|[\]\\]/g, "\\$&");
  }
  return new RegExp("^" + re + "$");
}

export function matchGlobs(path, globs) {
  return globs.some((g) => globToRegExp(g).test(path));
}

// --- object-literal extraction from .ts/.js modules -------------------------

/**
 * Find the matching close bracket for the value literal that starts at `open`
 * (`{` or `[`), respecting strings, template literals, and comments so a brace
 * inside a string does not miscount.
 */
function matchBracket(src, open) {
  const close = { "{": "}", "[": "]" };
  const stack = [src[open]];
  let i = open + 1;
  while (i < src.length && stack.length > 0) {
    const c = src[i];
    if (c === "'" || c === '"' || c === "`") {
      const quote = c; i++;
      while (i < src.length) {
        if (src[i] === "\\") { i += 2; continue; }
        if (src[i] === quote) { i++; break; }
        // template-literal interpolation may contain brackets; skip conservatively
        if (quote === "`" && src[i] === "$" && src[i + 1] === "{") {
          let depth = 1; i += 2;
          while (i < src.length && depth > 0) { if (src[i] === "{") depth++; else if (src[i] === "}") depth--; i++; }
          continue;
        }
        i++;
      }
      continue;
    }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i += 2; continue; }
    if (c === "{" || c === "[") stack.push(c);
    else if (c === "}" || c === "]") { if (c === close[stack[stack.length - 1]]) stack.pop(); else stack.pop(); }
    i++;
  }
  return i; // index just past the matched close bracket
}

/**
 * Extract top-level exported/const object & array literals from a JS/TS module,
 * WITHOUT importing it (the modules import sibling files we cannot resolve).
 * Each literal is evaluated in an empty VM context; anything referencing an
 * identifier or using TS-only syntax throws and is skipped (reported by count,
 * never by content). Returns `[{ name, value }]`.
 */
export function extractLiterals(src) {
  const out = [];
  let skipped = 0;
  // `const NAME =`, `export const NAME =`, `module.exports =`, `export default`.
  const decl = /(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*(?::\s*[^=]+?)?=\s*|module\.exports\s*=\s*|export\s+default\s+/g;
  let m;
  while ((m = decl.exec(src)) !== null) {
    const valueStart = decl.lastIndex;
    const ch = src[valueStart];
    if (ch !== "{" && ch !== "[") continue;
    const end = matchBracket(src, valueStart);
    const literal = src.slice(valueStart, end);
    try {
      const value = runInNewContext("(" + literal + ")", Object.create(null), { timeout: 1000 });
      if (value && typeof value === "object") out.push({ name: m[1] || "default", value });
    } catch {
      skipped++; // references an import / uses TS-only syntax — not a plain literal
    }
  }
  return { literals: out, skipped };
}

// --- classify extracted literals into convertible definitions ---------------

// The seven JSON Schema primitive `type` values. A string `type` outside this
// set (e.g. "VerticalLayout", "ListWithDetail") is a UI node, not a schema.
const JSON_SCHEMA_TYPES = new Set(["object", "array", "string", "number", "integer", "boolean", "null"]);

function looksLikeUiSchema(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  // A UI node carries a non-primitive `type`, or JSONForms `scope`/`elements`,
  // or RJSF `ui:*` keys.
  if (typeof v.type === "string" && !JSON_SCHEMA_TYPES.has(v.type)) return true;
  if (typeof v.scope === "string" || Array.isArray(v.elements)) return true;
  return Object.keys(v).some((k) => k.startsWith("ui:"));
}
function looksLikeJsonSchema(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  if (looksLikeUiSchema(v)) return false;
  return typeof v.properties === "object"
    || (typeof v.type === "string" && JSON_SCHEMA_TYPES.has(v.type))
    || (Array.isArray(v.type) && v.type.every((t) => JSON_SCHEMA_TYPES.has(t)))
    || Array.isArray(v.allOf) || Array.isArray(v.oneOf) || Array.isArray(v.anyOf) || typeof v.$ref === "string";
}
function looksLikeFormioForm(v) {
  return v && typeof v === "object" && Array.isArray(v.components);
}
// Form.io test fixtures are often a single component rather than a form. A container component
// has `components` too, so this is checked before `looksLikeFormioForm`; a saved form carries
// `type: "form"` or `"resource"`, and stays a form.
const FORMIO_FORM_TYPES = new Set(["form", "resource"]);
function looksLikeFormioComponent(v) {
  return v && typeof v === "object" && !Array.isArray(v) && typeof v.type === "string" && typeof v.key === "string"
    && !FORMIO_FORM_TYPES.has(v.type);
}

// The part of a literal's name that pairs a schema with its uiSchema: `schema_2343` and
// `uischema_2343` share `_2343`, `schema` and `uischema` share the empty key.
function pairKey(name, word) {
  const lower = name.toLowerCase();
  const at = lower.indexOf(word);
  return at < 0 ? lower : lower.slice(0, at) + lower.slice(at + word.length);
}

/**
 * Turn a module's extracted literals into definitions ready to score/convert.
 * For `json-schema`, pairs each schema literal with the uiSchema literal of the
 * same name (`{ schema, uiSchema }`), see `pairSchemas`. For `formio`, emits each
 * object with a top-level `components` array, and wraps a single component.
 */
export function classifyDefinitions(source, literals) {
  const defs = [];
  if (source === "formio") {
    for (const { name, value } of literals) {
      if (looksLikeFormioComponent(value)) defs.push({ suffix: name, def: { components: [value] } });
      else if (looksLikeFormioForm(value)) defs.push({ suffix: name, def: value });
    }
    return defs;
  }
  // json-schema family
  // An RJSF/JSONForms module commonly exports `{ schema, uiSchema }` as one const.
  const envelopes = literals.filter((l) => looksLikeJsonSchema(l.value?.schema));
  for (const { name, value } of envelopes) defs.push({ suffix: name, def: { schema: value.schema, uiSchema: value.uiSchema } });
  if (envelopes.length === 0) defs.push(...pairSchemas(literals));
  return defs;
}

// A schema pairs with the uiSchema of the same pair key. A schema with no match takes the
// module's only uiSchema if it has exactly one, and otherwise stays bare. A uiSchema left over
// pairs with the module's only schema, so one schema with two uiSchemas gives two definitions;
// that schema is then not emitted bare as well. A fallback pairing (no name match) is made only
// when the uiSchema fits the schema, see `uiSchemaFitsSchema`; otherwise the schema stays bare
// and the uiSchema is not used.
function pairSchemas(literals) {
  const schemas = literals.filter((l) => looksLikeJsonSchema(l.value) && !looksLikeUiSchema(l.value));
  const uis = literals.filter((l) => looksLikeUiSchema(l.value));
  const used = new Set();
  const paired = [];
  const unmatched = [];
  for (const schema of schemas) {
    const key = pairKey(schema.name, "schema");
    const ui = uis.find((u) => !used.has(u) && pairKey(u.name, "uischema") === key);
    if (ui) {
      used.add(ui);
      paired.push({ suffix: schema.name, def: { schema: schema.value, uiSchema: ui.value } });
    } else {
      unmatched.push(schema);
    }
  }
  if (uis.length === 1) {
    for (const schema of unmatched) {
      paired.push({ suffix: schema.name, def: uiSchemaFitsSchema(uis[0].value, schema.value) ? { schema: schema.value, uiSchema: uis[0].value } : schema.value });
    }
    return paired;
  }
  const leftover = uis.filter((u) => !used.has(u));
  if (schemas.length === 1 && leftover.length > 0) {
    for (const ui of leftover) {
      if (uiSchemaFitsSchema(ui.value, schemas[0].value)) paired.push({ suffix: ui.name, def: { schema: schemas[0].value, uiSchema: ui.value } });
    }
    // The schema is emitted bare when no leftover uiSchema fits it and nothing else paired with it.
    if (paired.length === 0) paired.push({ suffix: schemas[0].name, def: schemas[0].value });
    return paired;
  }
  for (const schema of unmatched) paired.push({ suffix: schema.name, def: schema.value });
  return paired;
}

// The scopes a JSONForms UI schema reads from the root schema: every `scope` string in its layout
// and rule conditions, leaving out `options.detail` subtrees, whose scopes are relative to an
// array's items.
export function collectUiScopes(ui, out = []) {
  if (Array.isArray(ui)) { for (const item of ui) collectUiScopes(item, out); return out; }
  if (!ui || typeof ui !== "object") return out;
  if (typeof ui.scope === "string") out.push(ui.scope);
  for (const [key, value] of Object.entries(ui)) {
    if (key === "options" && value && typeof value === "object") {
      for (const [optKey, optValue] of Object.entries(value)) if (optKey !== "detail") collectUiScopes(optValue, out);
    } else if (key !== "scope") {
      collectUiScopes(value, out);
    }
  }
  return out;
}

// A uiSchema fits a schema when at least one of its scopes resolves in it. A uiSchema with no
// scope at all (RJSF `ui:*` keys, a layout of labels) cannot be checked and fits.
function uiSchemaFitsSchema(ui, schema) {
  const scopes = collectUiScopes(ui);
  return scopes.length === 0 || scopes.some((scope) => resolveScopeIn(schema, scope) !== undefined);
}

// Resolve a scope in a schema as the converter's `resolveScope` does (itself a port of JSONForms'
// `resolveSchema`): one segment at a time as a property lookup, `#` and empty segments skipped, a
// `$ref` on a result followed from the root before the next segment; when the rest of the path
// is not found, tried from `oneOf`, `allOf`, `anyOf`, `then`, `else` entries in that order (each
// entry's `$ref` followed), first match wins; a path asked again from the same schema while it is
// being resolved is a cycle and resolves to nothing, and so is a combinator entry that leads back to
// a schema the same rest of the path is being searched from. Duplicated here, not imported, so refresh
// needs no build of the TS sources, and the converter publishes no resolver; `scope-resolver.spec.ts`
// checks that the two agree on every scope of the corpus.
const SCOPE_COMBINATORS = ["oneOf", "allOf", "anyOf", "then", "else"];
export function resolveScopeIn(root, scope) {
  const walk = { root, visited: new Map() };
  const decode = (s) => s.replace(/~1/g, "/").replace(/~0/g, "~");
  const isEmpty = (v) => (typeof v === "string" || Array.isArray(v)) ? v.length === 0
    : (v !== null && typeof v === "object") ? Object.keys(v).length === 0 : true;
  const refOf = (v) => (v && typeof v === "object" && !Array.isArray(v) && typeof v.$ref === "string") ? v.$ref : undefined;
  const withRef = (schema, path) => {
    let resolved;
    const ref = refOf(schema);
    if (ref !== undefined) {
      const base = from(walk.root, ref);
      if (base !== undefined) resolved = from(base, path);
    }
    return resolved === undefined ? from(schema, path) : resolved;
  };
  const from = (schema, path) => {
    let paths = walk.visited.get(schema);
    if (!paths) { paths = new Set(); walk.visited.set(schema, paths); }
    if (paths.has(path)) return undefined;
    paths.add(path);
    const resolved = withCombinators(schema, path.split("/").map(decode));
    paths.delete(path);
    return resolved;
  };
  const withCombinators = (schema, segments) => {
    if (segments.length === 0) return schema;
    if (isEmpty(schema)) return undefined;
    const direct = step(schema, segments);
    if (direct !== undefined) return direct;
    const entries = [];
    for (const key of SCOPE_COMBINATORS) {
      const value = schema[key];
      if (Array.isArray(value)) entries.push(...value);
      else if (value !== undefined && value !== null) entries.push(value);
    }
    const path = segments.join("/");
    for (const entry of entries) {
      const ref = refOf(entry);
      const sub = ref !== undefined ? withRef(walk.root, ref) : entry;
      // An entry back to a schema this path is already searched from is a cycle: try the next.
      let paths = walk.visited.get(sub);
      if (!paths) { paths = new Set(); walk.visited.set(sub, paths); }
      if (paths.has(path)) continue;
      paths.add(path);
      const resolved = withCombinators(sub, segments);
      paths.delete(path);
      if (resolved) return resolved;
    }
    return undefined;
  };
  const step = (schema, segments) => {
    if (segments.length === 0) return schema;
    if (isEmpty(schema)) return undefined;
    let rest = segments;
    while (rest.length > 0 && (rest[0] === "#" || rest[0] === "")) rest = rest.slice(1);
    let next = schema;
    if (rest.length > 0) {
      next = Object.prototype.hasOwnProperty.call(schema, rest[0]) ? schema[rest[0]] : undefined;
      rest = rest.slice(1);
    }
    const ref = refOf(next);
    if (ref !== undefined) {
      if (rest.length === 0 && !ref.startsWith("#")) return next;
      next = withRef(walk.root, ref);
    }
    return withCombinators(next, rest);
  };
  const target = withRef(root, scope);
  return target && typeof target === "object" && !Array.isArray(target) ? target : undefined;
}

// --- bundled `$id` resources --------------------------------------------------

// Keywords whose values are data, not schemas: an `$id` inside them declares nothing.
const DATA_KEYWORDS = new Set(["enum", "const", "default", "examples"]);

// Every `$id` of a document, resolved against the base URI it is declared under, and the base URI of
// every schema object, as the converter's `buildIdIndex` reads them.
function buildIdIndex(root) {
  const byUri = new Map();
  const base = new Map();
  const seen = new Set();
  const visit = (node, parentBase) => {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) { for (const child of node) visit(child, parentBase); return; }
    let own = parentBase;
    const id = node.$id;
    // An `$id` starting with `#` is a draft-06 anchor, not a resource.
    if (typeof id === "string" && id.length > 0 && !id.startsWith("#")) {
      own = resolveUri(id, parentBase).replace(/#$/, "");
      if (!byUri.has(own)) byUri.set(own, node);
    }
    base.set(node, own);
    for (const [key, value] of Object.entries(node)) if (!DATA_KEYWORDS.has(key)) visit(value, own);
  };
  visit(root, "");
  return { byUri, base };
}

function resolveUri(ref, base) {
  try {
    return new URL(ref, base.length > 0 ? base : undefined).href;
  } catch {
    return ref;
  }
}

// Whether the non-local `$ref` of `node` names a schema in the document: an `$id` match, then the
// JSON Pointer in its fragment, if any, as the converter's `resolveBundledRef` follows it. A ref this
// cannot follow is one the converter reports as remote.
function resolvesThroughId(node, ref, index, root) {
  const base = index.base.get(node) ?? index.base.get(root) ?? "";
  const uri = resolveUri(ref, base);
  const hashAt = uri.indexOf("#");
  const resource = index.byUri.get(hashAt < 0 ? uri : uri.slice(0, hashAt));
  if (!resource) return false;
  const fragment = hashAt < 0 ? "" : uri.slice(hashAt + 1);
  if (fragment === "") return true;
  if (!fragment.startsWith("/")) return false;
  let pointer = fragment;
  try { pointer = decodeURIComponent(fragment); } catch { /* keep the fragment as written */ }
  let target = resource;
  for (const part of pointer.split("/").filter((p) => p.length > 0).map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"))) {
    if (target === null || typeof target !== "object") return false;
    target = target[part];
  }
  return !!target && typeof target === "object";
}

// --- construct tokens (the drift signal) ------------------------------------

// Component types the Form.io converter has a mapping for (mirror of
// src/formio/index.ts — a NEW type outside this set is exactly the drift the
// refresh job exists to catch). Kept here, not imported, so refresh needs no
// build of the TS sources. `tags` (stored as an array) and `form` (with inline
// components) are mapped in part; the converter reports their other forms.
export const HANDLED_FORMIO_TYPES = new Set([
  "textfield", "email", "url", "phoneNumber", "number", "currency", "password",
  "datetime", "day", "time", "textarea", "checkbox", "selectboxes", "radio",
  "select", "file", "signature", "content", "htmlelement", "survey", "hidden",
  "tags", "panel", "fieldset", "well", "container", "columns", "table", "tabs",
  "form", "datagrid", "editgrid", "button"
]);

// JSON Schema keywords the converter reads, plus benign meta keywords it may
// safely ignore. A keyword outside BOTH sets is a candidate drift token.
const HANDLED_JSONSCHEMA_KEYWORDS = new Set([
  "type", "title", "description", "default", "properties", "required", "items",
  "enum", "const", "format", "readOnly", "minimum", "maximum",
  "exclusiveMinimum", "exclusiveMaximum", "minLength", "maxLength", "pattern",
  "$ref", "allOf", "oneOf", "anyOf", "if", "then", "else", "dependencies",
  "dependentRequired", "dependentSchemas", "discriminator", "definitions", "$defs"
]);
const BENIGN_JSONSCHEMA_KEYWORDS = new Set([
  "$schema", "$id", "$comment", "$anchor", "examples", "additionalProperties",
  "additionalItems", "uniqueItems", "multipleOf", "minItems", "maxItems",
  "minProperties", "maxProperties", "propertyNames", "patternProperties",
  "contains", "not", "contentMediaType", "contentEncoding", "writeOnly",
  "deprecated", "nullable", "prefixItems"
]);
const HANDLED_FORMATS = new Set(["date", "date-time", "time", "email", "idn-email", "uri", "iri", "uri-reference"]);
const HANDLED_UI_TYPES = new Set(["VerticalLayout", "HorizontalLayout", "Group", "Categorization", "Category", "Control", "ListWithDetail", "Label"]);
const HANDLED_UI_WIDGETS = new Set(["hidden", "radio", "textarea", "tagbox", "password", "email", "url", "color", "date", "date-time", "datetime-local", "time", "updown", "range", "alt-date", "alt-datetime", "checkboxes", "checkbox", "select"]);

/**
 * Collect construct tokens for a definition. A token is namespaced and
 * content-free (`type:datagrid`, `keyword:if`, `format:uuid`, `ui-type:Control`,
 * `ui-widget:color`). `unhandled` is the subset with no converter rule — the
 * new-construct alarm keys off changes to it.
 */
// A non-local `$ref` is `ref:bundled` when it resolves through an `$id` of the document, which the
// converter follows, and `ref:remote`, unhandled, otherwise.
export function constructTokens(source, def) {
  const tokens = new Set();
  const unhandled = new Set();
  const mark = (tok, handled) => { tokens.add(tok); if (!handled) unhandled.add(tok); };

  if (source === "formio") {
    const visit = (comp) => {
      if (!comp || typeof comp !== "object") return;
      if (typeof comp.type === "string") {
        mark(`type:${comp.type}`, HANDLED_FORMIO_TYPES.has(comp.type));
        for (const key of Object.keys(comp)) mark(`key:${comp.type}.${key}`, true);
      }
      // Values that change branching. Each is a closed set, so the value itself is the token.
      const cond = comp.conditional;
      if (cond && typeof cond === "object" && !Array.isArray(cond)) {
        if ("show" in cond) mark(`show:${cond.show === null ? "null" : typeof cond.show}`, true);
        if (Array.isArray(cond.conditions)) {
          for (const c of cond.conditions) if (typeof c?.operator === "string") mark(`condition-op:${c.operator}`, true);
        }
      }
      if (typeof comp.dataSrc === "string") mark(`data-src:${comp.dataSrc}`, true);
      const kids = [];
      if (Array.isArray(comp.components)) kids.push(...comp.components);
      if (Array.isArray(comp.columns)) for (const c of comp.columns) if (Array.isArray(c?.components)) kids.push(...c.components);
      if (Array.isArray(comp.rows)) for (const r of comp.rows) if (Array.isArray(r)) for (const cell of r) kids.push(...tableCellComponents(cell));
      kids.forEach(visit);
    };
    (Array.isArray(def.components) ? def.components : []).forEach(visit);
    return { tokens, unhandled };
  }

  // json-schema family
  const schema = def && def.schema ? def.schema : def;
  const seen = new Set();
  let ids;
  // A node is a schema only if it declares at least one schema keyword. This
  // stops us from walking arbitrary objects (a `default` value, an enum member)
  // and emitting their keys as phantom "unknown keywords".
  const isSchemaNode = (s) =>
    Object.keys(s).some((k) => HANDLED_JSONSCHEMA_KEYWORDS.has(k) || BENIGN_JSONSCHEMA_KEYWORDS.has(k));
  const visitSchema = (s, depth) => {
    if (!s || typeof s !== "object" || Array.isArray(s) || depth > 40) return;
    if (seen.has(s)) return; seen.add(s);
    if (!isSchemaNode(s)) return;
    for (const key of Object.keys(s)) {
      if (HANDLED_JSONSCHEMA_KEYWORDS.has(key)) mark(`keyword:${key}`, true);
      else if (BENIGN_JSONSCHEMA_KEYWORDS.has(key)) { /* ignored, not a token */ }
      else if (!key.startsWith("ui:") && !key.startsWith("$")) mark(`keyword-unknown:${key}`, false);
    }
    if (typeof s.$ref === "string" && !s.$ref.startsWith("#")) {
      ids ??= buildIdIndex(schema);
      if (resolvesThroughId(s, s.$ref, ids, schema)) mark("ref:bundled", true);
      else mark("ref:remote", false);
    }
    if (typeof s.format === "string") mark(`format:${s.format}`, HANDLED_FORMATS.has(s.format));
    for (const v of Object.values(s.properties || {})) visitSchema(v, depth + 1);
    for (const container of [s.allOf, s.oneOf, s.anyOf]) if (Array.isArray(container)) container.forEach((x) => visitSchema(x, depth + 1));
    // `items` may be a single schema or a tuple array of schemas.
    if (Array.isArray(s.items)) s.items.forEach((x) => visitSchema(x, depth + 1));
    else if (s.items) visitSchema(s.items, depth + 1);
    for (const k of ["if", "then", "else", "not", "contains"]) if (s[k]) visitSchema(s[k], depth + 1);
    for (const bag of [s.definitions, s.$defs, s.dependentSchemas, s.patternProperties]) if (bag && typeof bag === "object") Object.values(bag).forEach((x) => visitSchema(x, depth + 1));
  };
  visitSchema(schema, 0);

  // JSONForms: a tree of typed UI nodes under `elements`.
  const visitCondition = (c, depth) => {
    if (!c || typeof c !== "object" || Array.isArray(c) || depth > 40) return;
    if (typeof c.type === "string") mark(`rule-condition:${c.type}`, true);
    else if (c.schema && typeof c.schema === "object") for (const k of Object.keys(c.schema)) mark(`rule-condition:${k}`, true);
    if (Array.isArray(c.conditions)) c.conditions.forEach((x) => visitCondition(x, depth + 1));
  };
  const visitUi = (n, depth) => {
    if (!n || typeof n !== "object" || depth > 40) return;
    if (typeof n.type === "string") mark(`ui-type:${n.type}`, HANDLED_UI_TYPES.has(n.type));
    const options = n.options;
    if (options && typeof options === "object" && !Array.isArray(options)) {
      for (const k of Object.keys(options)) mark(`ui-option:${k}`, true);
      if (options.detail && typeof options.detail === "object") visitUi(options.detail, depth + 1);
    }
    if (n.rule && typeof n.rule === "object") {
      if (typeof n.rule.effect === "string") mark(`rule-effect:${n.rule.effect}`, true);
      visitCondition(n.rule.condition, 0);
    }
    if (Array.isArray(n.elements)) n.elements.forEach((c) => visitUi(c, depth + 1));
  };
  // RJSF: `ui:*` keys nested by property name, `items` and variant at any depth.
  const visitRjsf = (n, depth) => {
    if (!n || typeof n !== "object" || depth > 40) return;
    for (const [k, v] of Object.entries(n)) {
      if (k.startsWith("ui:")) mark(`ui-key:${k}`, true);
      if (k === "ui:widget" && typeof v === "string") mark(`ui-widget:${v}`, HANDLED_UI_WIDGETS.has(v));
      if (v && typeof v === "object") visitRjsf(v, depth + 1);
    }
  };
  if (def && def.uiSchema) {
    visitUi(def.uiSchema, 0);
    visitRjsf(def.uiSchema, 0);
  }
  return { tokens, unhandled };
}

// Token kinds that name a property or a branching value rather than a construct. A new one
// raises a `new-key` alert whether or not the converter handles it.
const PROPERTY_TOKEN_PREFIXES = ["key:", "condition-op:", "data-src:", "show:", "ui-option:", "rule-effect:", "rule-condition:", "ui-key:"];

export function isPropertyToken(token) {
  return PROPERTY_TOKEN_PREFIXES.some((p) => token.startsWith(p));
}

// --- vendored @formio/core type snapshot parsing ----------------------------

/** Parse the frozen KNOWN_FORMIO_COMPONENT_TYPES set out of component-types.ts. */
export function parseVendoredFormioTypes(tsText) {
  const start = tsText.indexOf("new Set([");
  if (start < 0) return new Set();
  const open = tsText.indexOf("[", start);
  const end = matchBracket(tsText, open);
  const arr = runInNewContext(tsText.slice(open, end).replace(/\/\/[^\n]*/g, ""), Object.create(null));
  return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
}

/**
 * Scrape the set of builtin component `type` values Form.io ships upstream. The
 * authoritative registrations live in `formio/formio.js` under
 * `src/components/<name>/<Name>.js`, each declaring `type: '<name>'` in its
 * schema defaults. Structural (type identifiers only) — content-free.
 */
export async function scrapeUpstreamFormioTypes(repo, ref) {
  const { paths } = await listRepoFiles(repo, ref);
  const modules = paths.filter((p) =>
    /^src\/components\/[^/]+\/[A-Z][A-Za-z0-9]+\.js$/.test(p) && !/\.(unit|spec|form)\.js$/.test(p) && !p.includes("__"));
  const types = new Set();
  for (const p of modules) {
    let text;
    try { text = await fetchRaw(repo, ref, p); } catch { continue; }
    // The component's own `schema()` default declares its `type`. Take the first
    // `type: '<x>'` in the module (the component's canonical type).
    const m = text.match(/\btype:\s*['"`]([A-Za-z0-9_]+)['"`]/);
    if (m) types.add(m[1]);
  }
  return { types, scanned: modules.length };
}

// --- set diff ---------------------------------------------------------------

export function diffSets(prev, next) {
  const added = [...next].filter((x) => !prev.has(x)).sort();
  const removed = [...prev].filter((x) => !next.has(x)).sort();
  return { added, removed };
}

/** Stable, filesystem-safe snapshot filename for an upstream path. */
export function snapshotName(repo, path, suffix) {
  const base = `${repo}/${path}`.replace(/[^A-Za-z0-9._-]+/g, "__").replace(/^_+|_+$/g, "");
  const stem = base.replace(/\.(tsx?|js|json)$/i, "");
  return `${stem}${suffix && suffix !== "default" ? "__" + suffix : ""}.json`;
}
