/* eslint-env node */

// Shared helpers for the scheduled corpus refresh (`refresh.mjs`).
//
// CONTENT-FREE boundary: this module fetches and extracts raw upstream
// definitions and writes them into `corpus/<source>/` (where raw content is
// allowed to live). Everything it feeds the ALERT/telemetry side is structural
// only — construct tokens (a component `type`, a JSON Schema keyword), file
// paths, and counts. It never lifts a label, option text, or expression source
// into an alert. Keep that split: raw defs go to disk, tokens go to alerts.

import { runInNewContext } from "node:vm";

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

/**
 * Turn a module's extracted literals into definitions ready to score/convert.
 * For `json-schema`, pairs a schema literal with a sibling uiSchema literal when
 * both are present (`{ schema, uiSchema }`), else emits the bare schema. For
 * `formio`, emits each object with a top-level `components` array.
 */
export function classifyDefinitions(source, literals) {
  const defs = [];
  if (source === "formio") {
    for (const { name, value } of literals) if (looksLikeFormioForm(value)) defs.push({ suffix: name, def: value });
    return defs;
  }
  // json-schema family
  const schemas = literals.filter((l) => looksLikeJsonSchema(l.value) && !looksLikeUiSchema(l.value));
  const uis = literals.filter((l) => looksLikeUiSchema(l.value));
  // An RJSF/JSONForms module commonly exports `{ schema, uiSchema }` as one const.
  const envelopes = literals.filter((l) => looksLikeJsonSchema(l.value?.schema));
  for (const { name, value } of envelopes) defs.push({ suffix: name, def: { schema: value.schema, uiSchema: value.uiSchema } });
  if (envelopes.length === 0) {
    const ui = uis[0]?.value;
    for (const { name, value } of schemas) defs.push({ suffix: name, def: ui ? { schema: value, uiSchema: ui } : value });
  }
  return defs;
}

// --- construct tokens (the drift signal) ------------------------------------

// Component types the Form.io converter has a mapping for (mirror of
// src/formio/index.ts — a NEW type outside this set is exactly the drift the
// refresh job exists to catch). Kept here, not imported, so refresh needs no
// build of the TS sources.
export const HANDLED_FORMIO_TYPES = new Set([
  "textfield", "email", "url", "phoneNumber", "number", "currency", "password",
  "datetime", "day", "time", "textarea", "checkbox", "selectboxes", "radio",
  "select", "file", "signature", "content", "htmlelement",
  "panel", "fieldset", "well", "container", "columns", "table", "tabs",
  "datagrid", "editgrid", "button"
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
const HANDLED_UI_TYPES = new Set(["VerticalLayout", "HorizontalLayout", "Group", "Categorization", "Category", "Control", "Label"]);
const HANDLED_UI_WIDGETS = new Set(["hidden", "radio", "textarea", "tagbox", "password", "email", "url", "color", "date", "date-time", "datetime-local", "time", "updown", "range"]);

/**
 * Collect construct tokens for a definition. A token is namespaced and
 * content-free (`type:datagrid`, `keyword:if`, `format:uuid`, `ui-type:Control`,
 * `ui-widget:color`). `unhandled` is the subset with no converter rule — the
 * new-construct alarm keys off changes to it.
 */
export function constructTokens(source, def) {
  const tokens = new Set();
  const unhandled = new Set();
  const mark = (tok, handled) => { tokens.add(tok); if (!handled) unhandled.add(tok); };

  if (source === "formio") {
    const visit = (comp) => {
      if (!comp || typeof comp !== "object") return;
      if (typeof comp.type === "string") mark(`type:${comp.type}`, HANDLED_FORMIO_TYPES.has(comp.type));
      const kids = [];
      if (Array.isArray(comp.components)) kids.push(...comp.components);
      if (Array.isArray(comp.columns)) for (const c of comp.columns) if (Array.isArray(c?.components)) kids.push(...c.components);
      if (Array.isArray(comp.rows)) for (const r of comp.rows) if (Array.isArray(r)) for (const cell of r) if (Array.isArray(cell)) kids.push(...cell);
      kids.forEach(visit);
    };
    (Array.isArray(def.components) ? def.components : []).forEach(visit);
    return { tokens, unhandled };
  }

  // json-schema family
  const schema = def && def.schema ? def.schema : def;
  const seen = new Set();
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
    if (typeof s.$ref === "string" && !s.$ref.startsWith("#")) mark("ref:remote", false);
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

  const visitUi = (n, depth) => {
    if (!n || typeof n !== "object" || depth > 40) return;
    if (typeof n.type === "string") mark(`ui-type:${n.type}`, HANDLED_UI_TYPES.has(n.type));
    for (const [k, v] of Object.entries(n)) {
      if (k === "ui:widget" && typeof v === "string") mark(`ui-widget:${v}`, HANDLED_UI_WIDGETS.has(v));
    }
    if (Array.isArray(n.elements)) n.elements.forEach((c) => visitUi(c, depth + 1));
  };
  if (def && def.uiSchema) visitUi(def.uiSchema, 0);
  return { tokens, unhandled };
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
  const stem = base.replace(/\.(ts|js|json)$/i, "");
  return `${stem}${suffix && suffix !== "default" ? "__" + suffix : ""}.json`;
}
