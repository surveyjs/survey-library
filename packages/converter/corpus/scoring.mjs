/* eslint-env node */

// Fidelity scoring — pure, content-free, deterministic.
//
// Shared by the scoring spec (`corpus/fidelity.spec.ts`, which runs the
// converters + the survey-core oracle) and, structurally, by `refresh.mjs`.
// It reads ONLY structure and counts — never a label, option text, or
// expression source — so its output is safe to log and to store as a baseline.
//
// The metric:
//   fields_in  = leaf inputs in the SOURCE definition.
//   fields_out = questions in the PRODUCED SurveyJS JSON that carry a value.
//   clean      = weighted count of unsupported + unknown + assumed report
//                entries. `assumed` is the dangerous one (renders right, may
//                branch wrong) and is weighted highest.
// We report fields_out / fields_in and the bucket totals per definition, plus an
// aggregate. `dropped` is tracked but NOT part of the weighted clean score
// (knowingly discarded styling/vendor metadata is not a fidelity loss).

/**
 * Weights for the `clean` score. `assumed` highest — a silent mis-branch is the
 * failure this whole corpus exists to catch; `unknown` (drift) above
 * `unsupported` (a known backlog gap).
 */
export const CLEAN_WEIGHTS = Object.freeze({ assumed: 5, unknown: 3, unsupported: 1 });

// --- source-side leaf counting --------------------------------------------

// Form.io component types that are containers (recurse, do not count as a leaf
// input) or produce no value (buttons, static content).
const FORMIO_CONTAINER_TYPES = new Set([
  "panel", "fieldset", "well", "container", "columns", "table", "tabs",
  "datagrid", "editgrid", "tree", "datamap"
]);
const FORMIO_NONVALUE_TYPES = new Set(["button", "content", "htmlelement"]);

/** Recursively collect a Form.io component's children across every nesting shape. */
function formioChildren(comp) {
  const out = [];
  if (Array.isArray(comp.components)) out.push(...comp.components);
  if (Array.isArray(comp.columns)) for (const col of comp.columns) if (Array.isArray(col?.components)) out.push(...col.components);
  if (Array.isArray(comp.rows)) for (const row of comp.rows) if (Array.isArray(row)) for (const cell of row) out.push(...tableCellComponents(cell));
  return out;
}

// A `table` cell is `{ components }`; older forms store the component array itself.
export function tableCellComponents(cell) {
  if (Array.isArray(cell)) return cell;
  return cell && Array.isArray(cell.components) ? cell.components : [];
}

/**
 * Count leaf value-bearing inputs in a Form.io form. A leaf is a component that
 * is not a container and not a static/button component. Grid children ARE
 * counted (they are real inputs inside a repeating template) so the source and
 * produced counts stay comparable.
 */
export function countFormioLeafInputs(def) {
  let n = 0;
  // Radio-type checkbox siblings sharing a `name` are one field: Form.io stores one value under
  // the name, and the converter makes one radio group of them.
  const visitList = (list) => {
    const radioNames = new Set();
    for (const comp of list) {
      if (comp && comp.type === "checkbox" && comp.inputType === "radio" && typeof comp.name === "string" && comp.name) {
        if (radioNames.has(comp.name)) continue;
        radioNames.add(comp.name);
      }
      visit(comp);
    }
  };
  const visit = (comp) => {
    if (!comp || typeof comp !== "object") return;
    const type = typeof comp.type === "string" ? comp.type : "";
    const children = formioChildren(comp);
    // A tab has no `type`; it is a container like the `tabs` around it.
    if (FORMIO_CONTAINER_TYPES.has(type) || (type === "" && children.length > 0)) {
      visitList(children);
      return;
    }
    if (!FORMIO_NONVALUE_TYPES.has(type) && comp.input !== false && type !== "") n++;
    // Some inputs (e.g. select with nested data) may still carry children; only
    // containers recurse, so nothing else to do here.
  };
  visitList(Array.isArray(def.components) ? def.components : []);
  return n;
}

// --- JSON Schema leaf counting ---------------------------------------------

function schemaEffectiveType(s) {
  if (!s || typeof s !== "object") return undefined;
  let t = s.type;
  if (Array.isArray(t)) t = t.find((x) => x !== "null");
  if (typeof t === "string") return t;
  if (s.properties) return "object";
  if (s.items) return "array";
  if (Array.isArray(s.enum) || Array.isArray(s.oneOf) || Array.isArray(s.anyOf)) return "string";
  return undefined;
}

// Count leaf value-bearing properties in a JSON Schema. Object properties recurse; array-of-object
// items recurse into the item template; scalars, enums and arrays-of-primitives each count as one.
// `allOf` subschemas are merged, an entry's own `allOf` too, and an item schema's `allOf` is merged
// before its type is read; a property several entries declare is counted once, from its first
// declaration. A key that only a `then` or `else` branch, `dependentSchemas` or a schema
// `dependencies` declares counts once too. Bounded by depth to survive recursive schemas.
export function countJsonSchemaLeafProps(input) {
  const root = input && typeof input === "object" && input.schema && typeof input.schema === "object" ? input.schema : input;
  if (!root || typeof root !== "object") return 0;

  const resolve = (s) => {
    // Local $ref resolution against the root; remote/broken refs collapse to {}.
    let cur = s;
    const seen = new Set();
    while (cur && typeof cur.$ref === "string" && cur.$ref.startsWith("#")) {
      if (seen.has(cur.$ref)) return {};
      seen.add(cur.$ref);
      const path = cur.$ref.replace(/^#/, "").split("/").filter(Boolean).map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
      let node = root;
      for (const part of path) node = node && typeof node === "object" ? node[part] : undefined;
      cur = node && typeof node === "object" ? node : {};
    }
    return cur || {};
  };
  // An `allOf` entry's own `allOf` is merged too, so a chain of entries (`person` -> `subject` ->
  // `conclusion`) gives every property once. A merge with no `properties` anywhere stays a scalar
  // schema, as the converter's merge does, and an entry that leads back to a schema being merged
  // adds nothing.
  const mergeAllOf = (s, merging = new Set()) => {
    if (!Array.isArray(s.allOf) || merging.has(s)) return s;
    const inner = new Set(merging).add(s);
    const props = { ...(s.properties || {}) };
    let hasProperties = s.properties !== undefined;
    for (const sub of s.allOf) {
      const r = mergeAllOf(resolve(sub), inner);
      if (r.properties !== undefined) hasProperties = true;
      for (const [k, v] of Object.entries(r.properties || {})) if (!(k in props)) props[k] = v;
    }
    return hasProperties ? { ...s, properties: props } : s;
  };

  // The properties only a conditional branch declares: `then`, `else`, `dependentSchemas` and the
  // schema form of `dependencies`, of the schema and of its `allOf` entries, each key once, from
  // its first declaration. A key the schema's own `properties` declare is not added again.
  const branchProperties = (s, own) => {
    const found = {};
    const seenSchemas = new Set();
    const take = (schema, depth) => {
      const r = resolve(schema);
      if (!r || typeof r !== "object" || Array.isArray(r) || seenSchemas.has(r) || depth > 32) return;
      seenSchemas.add(r);
      const merged = mergeAllOf(r);
      for (const [k, v] of Object.entries(merged.properties || {})) if (!(k in own) && !(k in found)) found[k] = v;
      collect(r, depth + 1);
    };
    const collect = (node, depth) => {
      for (const key of ["then", "else"]) if (node[key] && typeof node[key] === "object") take(node[key], depth);
      for (const key of ["dependentSchemas", "dependencies"]) {
        const bag = node[key];
        if (bag && typeof bag === "object" && !Array.isArray(bag)) {
          for (const v of Object.values(bag)) if (v && typeof v === "object" && !Array.isArray(v)) take(v, depth);
        }
      }
      if (Array.isArray(node.allOf)) for (const entry of node.allOf) take(entry, depth);
    };
    seenSchemas.add(s);
    collect(s, 0);
    return found;
  };

  let n = 0;
  const visit = (schema, depth) => {
    if (depth > 32) { n++; return; }
    const s = mergeAllOf(resolve(schema));
    const type = schemaEffectiveType(s);
    if (type === "object" || (type === undefined && s.properties)) {
      for (const sub of Object.values(s.properties || {})) visit(sub, depth + 1);
      for (const sub of Object.values(branchProperties(s, s.properties || {}))) visit(sub, depth + 1);
      // Discriminated oneOf variants contribute their own leaves.
      if (Array.isArray(s.oneOf)) for (const b of s.oneOf) visit(resolve(b), depth + 1);
      return;
    }
    if (type === "array") {
      const items = mergeAllOf(resolve(s.items || {}));
      if (schemaEffectiveType(items) === "object") { visit(items, depth + 1); return; }
      n++; // array of primitives / enum -> one multi-select
      return;
    }
    n++; // scalar / enum
  };
  visit(root, 0);
  return n;
}

// --- produced-output value question counting -------------------------------

// SurveyJS types that are containers (recurse) or carry no value (skip).
const SURVEY_CONTAINER_TYPES = new Set(["panel", "paneldynamic"]);
const SURVEY_NONVALUE_TYPES = new Set(["html", "image", "expression"]);

/**
 * Count value-bearing questions in produced SurveyJS JSON. Pages and panels are
 * containers; `paneldynamic` recurses into its `templateElements` (the real
 * inputs); `html` and display-only types are skipped.
 */
export function countSurveyValueQuestions(surveyJson) {
  let n = 0;
  const visitElements = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const el of arr) visit(el);
  };
  const visit = (el) => {
    if (!el || typeof el !== "object") return;
    const type = typeof el.type === "string" ? el.type : "";
    if (SURVEY_CONTAINER_TYPES.has(type)) {
      visitElements(el.elements);
      visitElements(el.templateElements);
      return;
    }
    if (SURVEY_NONVALUE_TYPES.has(type) || type === "") return;
    n++;
  };
  const obj = surveyJson && typeof surveyJson === "object" ? surveyJson : {};
  if (Array.isArray(obj.pages)) for (const p of obj.pages) visitElements(p && p.elements);
  visitElements(obj.elements);
  return n;
}

// --- report bucket tallying -------------------------------------------------

/** Sum `count` per bucket across a conversion report's entries. */
export function bucketTotals(report) {
  const totals = { unsupported: 0, unknown: 0, assumed: 0, dropped: 0 };
  for (const e of (report && Array.isArray(report.entries) ? report.entries : [])) {
    if (e && e.bucket in totals) totals[e.bucket] += typeof e.count === "number" ? e.count : 1;
  }
  return totals;
}

/** Weighted clean score: assumed*5 + unknown*3 + unsupported*1 (dropped excluded). */
export function weightedClean(buckets) {
  return buckets.assumed * CLEAN_WEIGHTS.assumed
    + buckets.unknown * CLEAN_WEIGHTS.unknown
    + buckets.unsupported * CLEAN_WEIGHTS.unsupported;
}

// --- per-definition + aggregate scoring ------------------------------------

/**
 * Score one converted definition.
 * @param {"formio"|"json-schema"} source
 * @param {object} def     the source definition (or { schema, uiSchema })
 * @param {object} output  the produced SurveyJS JSON
 * @param {object} report  the conversion report
 */
export function scoreDefinition(source, def, output, report) {
  const fieldsIn = source === "formio" ? countFormioLeafInputs(def) : countJsonSchemaLeafProps(def);
  const fieldsOut = countSurveyValueQuestions(output);
  const buckets = bucketTotals(report);
  return {
    fieldsIn,
    fieldsOut,
    ratio: fieldsIn > 0 ? fieldsOut / fieldsIn : (fieldsOut === 0 ? 1 : 0),
    buckets,
    weightedClean: weightedClean(buckets)
  };
}

/**
 * Aggregate per-definition scores into corpus-level totals. The two tracked
 * numbers the gate keys off:
 *   - fidelityRatio       = sum(fields_out) / sum(fields_in)   (higher is better)
 *   - cleanPerField       = sum(weightedClean) / sum(fields_in) (lower is better)
 */
export function aggregate(scores) {
  const fieldsIn = scores.reduce((s, x) => s + x.fieldsIn, 0);
  const fieldsOut = scores.reduce((s, x) => s + x.fieldsOut, 0);
  const weighted = scores.reduce((s, x) => s + x.weightedClean, 0);
  const buckets = scores.reduce((acc, x) => {
    for (const k of ["unsupported", "unknown", "assumed", "dropped"]) acc[k] += x.buckets[k];
    return acc;
  }, { unsupported: 0, unknown: 0, assumed: 0, dropped: 0 });
  return {
    definitions: scores.length,
    fieldsIn,
    fieldsOut,
    buckets,
    weightedClean: weighted,
    fidelityRatio: fieldsIn > 0 ? fieldsOut / fieldsIn : 1,
    cleanPerField: fieldsIn > 0 ? weighted / fieldsIn : 0
  };
}

/** Round to 4 decimals for stable, diff-friendly baseline numbers. */
export function round4(n) {
  return Math.round(n * 10000) / 10000;
}
