/* eslint-env node */
/* eslint-disable no-console -- this is a CLI-style corpus job; printing is its interface */

// Corpus refresh + vendored-schema diff.
//
// Two independent jobs, run together by `npm run corpus:refresh`. No scheduled workflow runs this — it is invoked
// by hand, weekly being the cadence it was designed for:
//
//   Job A — re-scrape upstream + diff. Fetch the definitions matched by
//     sources.json, extract them into corpus/<source>/, and diff the set of
//     CONSTRUCT TOKENS against the committed manifest. A construct the converter
//     has no rule for (a new Form.io component `type`, a new JSON Schema keyword)
//     is the alarm — the frozen fixtures pass forever while upstream moves.
//
//   Job B — vendored-schema diff. Compare the vendored @formio/core type
//     snapshot (src/formio/vendor/) and the JSON Schema meta-schema keyword set
//     against upstream. These go stale SILENTLY — same failure mode as a pinned
//     corpus — so drift is an alert, not a shrug.
//
// Alerting is the whole point. Both jobs write structural, content-free alerts
// to corpus/.alerts.json (review the high-severity ones — they are the backlog
// this job exists to produce) and print a human summary. `--self-test` proves
// the alerting fires against a synthetic diff, offline, so the mechanism itself
// stays covered.
//
// Flags:
//   (default)         Jobs A + B against live upstream; writes snapshots,
//                     manifests, and .alerts.json. Exits 0.
//   --fail-on-alert   Exit non-zero when any alert fired (for a gating step).
//   --self-test       Offline: assert the diff/alert mechanism fires on a
//                     synthetic new construct + vendored drift. No network.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import process from "node:process";
import {
  listRepoFiles, resolveCommit, fetchRaw, matchGlobs, extractLiterals, classifyDefinitions,
  constructTokens, isPropertyToken, parseVendoredFormioTypes, scrapeUpstreamFormioTypes, diffSets,
  snapshotName
} from "./lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");

function loadSources() {
  return JSON.parse(readFileSync(join(here, "sources.json"), "utf8"));
}

function loadManifest(source) {
  const p = join(here, source, "_manifest.json");
  if (!existsSync(p)) return { source, files: [], tokens: [], unhandled: [] };
  return JSON.parse(readFileSync(p, "utf8"));
}

function writeManifest(source, manifest) {
  mkdirSync(join(here, source), { recursive: true });
  writeFileSync(join(here, source, "_manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

// --- Job A ------------------------------------------------------------------

// Files are fetched this many at a time; results keep the listing's order.
const FETCH_CONCURRENCY = 8;

async function fetchAll(repo, ref, paths) {
  const texts = new Array(paths.length);
  let next = 0;
  const worker = async () => {
    while (next < paths.length) {
      const i = next++;
      try { texts[i] = await fetchRaw(repo, ref, paths[i]); } catch { texts[i] = undefined; }
    }
  };
  await Promise.all(Array.from({ length: FETCH_CONCURRENCY }, worker));
  return texts;
}

async function scrapeSource(source, entries, alerts) {
  const tokens = new Set();
  const unhandled = new Set();
  const snapshots = new Map();
  const seen = new Set();
  const commits = [];
  let extractedDefs = 0;
  let duplicateDefs = 0;
  let skippedLiterals = 0;
  let unreadableFiles = 0;
  let complete = true;

  for (const entry of entries) {
    const { repo, ref, globs } = entry;
    let commit;
    let listing;
    try {
      // Scrape one commit, not a moving branch, so the files and the recorded commit agree.
      commit = await resolveCommit(repo, ref);
      listing = await listRepoFiles(repo, commit);
    } catch (e) {
      // A source we cannot even list is itself an alert — the config may have
      // rotted (repo renamed, ref deleted) and a silent skip would hide it.
      alerts.push({ job: "A", severity: "high", kind: "source-unreachable", source, repo, ref, detail: e.message });
      complete = false;
      continue;
    }
    commits.push({ repo, ref, commit });
    if (listing.truncated) {
      alerts.push({ job: "A", severity: "medium", kind: "tree-truncated", source, repo, ref });
      console.log(`  ! ${repo}@${ref}: tree truncated by GitHub API — scrape is partial`);
    }
    const matched = listing.paths.filter((p) => matchGlobs(p, globs));
    console.log(`  ${repo}@${ref} (${commit.slice(0, 9)}): ${matched.length} file(s) match globs`);

    const texts = await fetchAll(repo, commit, matched);
    matched.forEach((path, i) => {
      if (texts[i] === undefined) { unreadableFiles++; return; }
      const { defs, skipped } = collectDefs(source, repo, path, texts[i]);
      skippedLiterals += skipped;
      for (const { snapshot, def } of defs) {
        // The same form is often copied between test folders; score it once.
        const json = JSON.stringify(def);
        if (seen.has(json)) { duplicateDefs++; continue; }
        seen.add(json);
        extractedDefs++;
        snapshots.set(uniqueSnapshot(snapshots, snapshot), json);
        const t = constructTokens(source, def);
        for (const tok of t.tokens) tokens.add(tok);
        for (const tok of t.unhandled) unhandled.add(tok);
      }
    });
  }

  console.log(`  extracted ${extractedDefs} definition(s), ${duplicateDefs} duplicate(s) skipped; ${tokens.size} construct token(s), ${unhandled.size} unhandled`);
  // A literal that is not plain data (it references an import, or holds JSX) cannot be read.
  console.log(`  skipped ${skippedLiterals} non-literal export(s)`);
  if (unreadableFiles > 0) console.log(`  ! ${unreadableFiles} matched file(s) could not be fetched`);
  return { tokens, unhandled, snapshots, commits, complete, extractedDefs, skippedLiterals };
}

// A test module can declare the same `const` name in several test bodies, which gives the same
// snapshot name. Number the later ones in source order so none overwrites another.
function uniqueSnapshot(snapshots, name) {
  if (!snapshots.has(name)) return name;
  const stem = name.replace(/\.json$/, "");
  let i = 2;
  while (snapshots.has(`${stem}__${i}.json`)) i++;
  return `${stem}__${i}.json`;
}

// Replace a source's snapshots with a new set. Deleting first keeps a renamed or removed
// upstream file from being scored twice or forever.
function writeSnapshots(source, snapshots) {
  const dir = join(here, source);
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) {
    if (f.endsWith(".json") && f !== "_manifest.json") rmSync(join(dir, f));
  }
  for (const [name, json] of snapshots) {
    writeFileSync(join(dir, name), JSON.stringify(JSON.parse(json), null, 2) + "\n", "utf8");
  }
}

function collectDefs(source, repo, path, text) {
  const out = [];
  if (path.endsWith(".json")) {
    try {
      const value = JSON.parse(text);
      const defs = classifyDefinitions(source, [{ name: "default", value }]);
      defs.forEach((d) => out.push({ snapshot: snapshotName(repo, path, d.suffix), def: d.def }));
    } catch { /* not JSON we can use */ }
    return { defs: out, skipped: 0 };
  }
  // .ts / .tsx / .js module -> extract exported literals, classify.
  const { literals, skipped } = extractLiterals(text);
  const defs = classifyDefinitions(source, literals);
  defs.forEach((d) => out.push({ snapshot: snapshotName(repo, path, d.suffix), def: d.def }));
  return { defs: out, skipped };
}

function classifyUnhandledToken(source, token, vendoredFormioTypes) {
  // unknown = drift (not in the spec at all); unsupported = known but unmapped.
  if (source === "formio" && token.startsWith("type:")) {
    const type = token.slice("type:".length);
    return vendoredFormioTypes.has(type) ? "unsupported" : "unknown";
  }
  if (token.startsWith("keyword-unknown:") || token === "ref:remote") return "unknown";
  return "unsupported";
}

async function jobA(sources, alerts, vendoredFormioTypes) {
  console.log("Job A — re-scrape upstream + diff");
  const converters = Object.keys(sources).filter((k) => !k.startsWith("_"));
  if (converters.length === 0) {
    console.error("corpus refresh: no sources configured");
    process.exit(1);
  }
  for (const source of converters) {
    console.log(`- ${source}`);
    const prev = loadManifest(source);
    const prevTokens = new Set(prev.tokens);
    const scraped = await scrapeSource(source, sources[source], alerts);
    if (!scraped.complete) {
      // A partial scrape would delete the snapshots of the source that failed.
      console.log(`  ! ${source}: a repo could not be listed — snapshots and manifest left as they were`);
      continue;
    }
    const { tokens, unhandled, snapshots, commits } = scraped;

    const diff = tokenAlerts(source, prevTokens, tokens, unhandled, vendoredFormioTypes);
    for (const alert of diff.alerts) {
      alerts.push(alert);
      console.log(`  ALERT ${alert.kind}${alert.class ? ` [${alert.class}]` : ""} ${alert.token}`);
    }
    if (diff.bootstrapKeys > 0) {
      console.log(`  ${diff.bootstrapKeys} property token(s) recorded for the first time — no new-key alerts on this run`);
    }
    if (diff.added.length > 0) console.log(`  + ${diff.added.length} new token(s)`);
    if (diff.removed.length > 0) console.log(`  - ${diff.removed.length} token(s) gone`);

    writeSnapshots(source, snapshots);
    writeManifest(source, {
      source,
      commits,
      files: [...snapshots.keys()].sort(),
      tokens: [...tokens].sort(),
      unhandled: [...unhandled].sort()
    });
  }
}

// Alerts for one source's token diff. A new unhandled token is a `new-construct` alert. A new
// property token (see `isPropertyToken`) is a `new-key` alert, handled or not. The first run
// after property tokens were introduced has none in the previous manifest, and every one would
// alert, so that run only counts them.
function tokenAlerts(source, prevTokens, tokens, unhandled, vendoredFormioTypes) {
  const { added, removed } = diffSets(prevTokens, tokens);
  const bootstrap = ![...prevTokens].some(isPropertyToken);
  const alerts = [];
  let bootstrapKeys = 0;
  for (const token of added) {
    if (unhandled.has(token)) {
      const cls = classifyUnhandledToken(source, token, vendoredFormioTypes);
      alerts.push({
        job: "A", severity: "high", kind: "new-construct", class: cls, source, token,
        detail: `New ${cls} construct with no converter rule: ${token}`
      });
    }
    if (isPropertyToken(token)) {
      if (bootstrap) { bootstrapKeys++; continue; }
      alerts.push({
        job: "A", severity: "medium", kind: "new-key", source, token,
        detail: `New property or branching value in upstream definitions: ${token}`
      });
    }
  }
  return { alerts, added, removed, bootstrapKeys };
}

// --- Job B ------------------------------------------------------------------

async function jobB(alerts) {
  console.log("Job B — vendored-schema diff");

  // B1: @formio/core builtin type set vs our vendored snapshot.
  const vendorTsPath = join(pkgRoot, "src/formio/vendor/component-types.ts");
  const vendored = parseVendoredFormioTypes(readFileSync(vendorTsPath, "utf8"));
  // The builtin component `type`s are registered in formio/formio.js.
  try {
    const { types: upstream, scanned } = await scrapeUpstreamFormioTypes("formio/formio.js", "main");
    console.log(`  scanned ${scanned} formio.js component module(s); ${upstream.size} upstream type(s)`);
    if (upstream.size === 0) throw new Error("scraped 0 upstream types — layout may have changed");
    const { added, removed } = diffSets(vendored, upstream);
    for (const type of added) {
      alerts.push({ job: "B", severity: "high", kind: "vendored-formio-drift", type, detail: `formio.js ships builtin type not in the vendored snapshot: ${type}` });
      console.log(`  ALERT vendored-formio-drift + ${type}`);
    }
    // `removed` = in our snapshot but not seen by this scrape. We deliberately
    // vendor premium/legacy types (address, tree, resource, ...) that are NOT in
    // the OSS formio.js `src/components/*` tree, so a "removed" here is EXPECTED,
    // not stale — log it for visibility, never alert (that would be noise).
    if (removed.length > 0) console.log(`  (${removed.length} vendored type(s) not in the OSS component scan — premium/legacy, expected: ${removed.join(", ")})`);
  } catch (e) {
    alerts.push({ job: "B", severity: "medium", kind: "vendored-formio-unreachable", detail: e.message });
    console.log(`  ! could not scrape formio.js component types: ${e.message}`);
  }

  // B2: JSON Schema draft meta-schema keyword drift. A new declared keyword we
  // neither handle nor knowingly ignore is a candidate unsupported construct.
  const knownVocab = getKnownJsonSchemaVocab();
  const metaSchemas = [
    { name: "draft-07", url: "https://json-schema.org/draft-07/schema" },
    { name: "2020-12", url: "https://json-schema.org/draft/2020-12/schema" }
  ];
  for (const ms of metaSchemas) {
    let meta;
    try {
      const res = await fetch(ms.url, { headers: { "User-Agent": "surveyjs-corpus-refresh", Accept: "application/schema+json" } });
      if (!res.ok) throw new Error(`${res.status}`);
      meta = await res.json();
    } catch (e) {
      alerts.push({ job: "B", severity: "low", kind: "meta-schema-unreachable", name: ms.name, detail: e.message });
      continue;
    }
    const declared = collectMetaKeywords(meta);
    const novel = [...declared].filter((k) => !knownVocab.has(k)).sort();
    if (novel.length > 0) {
      alerts.push({ job: "B", severity: "medium", kind: "meta-schema-drift", name: ms.name, keywords: novel, detail: `${ms.name} declares keyword(s) outside our vocabulary: ${novel.join(", ")}` });
      console.log(`  ALERT meta-schema-drift [${ms.name}] ${novel.join(", ")}`);
    }
  }
}

function getKnownJsonSchemaVocab() {
  // Union of the keywords the converter reads and the benign ones it ignores —
  // mirrors lib.mjs. A meta-schema keyword outside this is worth a look.
  return new Set([
    "type", "title", "description", "default", "properties", "required", "items",
    "enum", "const", "format", "readOnly", "minimum", "maximum", "exclusiveMinimum",
    "exclusiveMaximum", "minLength", "maxLength", "pattern", "$ref", "allOf", "oneOf",
    "anyOf", "if", "then", "else", "dependencies", "dependentRequired", "dependentSchemas",
    "discriminator", "definitions", "$defs", "$schema", "$id", "$comment", "$anchor",
    "$vocabulary", "$dynamicRef", "$dynamicAnchor", "$recursiveRef", "$recursiveAnchor",
    "examples", "additionalProperties", "additionalItems", "unevaluatedProperties",
    "unevaluatedItems", "uniqueItems", "multipleOf", "minItems", "maxItems",
    "minProperties", "maxProperties", "propertyNames", "patternProperties", "contains",
    "minContains", "maxContains", "not", "contentMediaType", "contentEncoding",
    "contentSchema", "writeOnly", "deprecated", "nullable", "prefixItems", "format-assertion"
  ]);
}

function collectMetaKeywords(meta) {
  // Keyword names a meta-schema declares live under its `properties` (and under
  // `$defs`/`properties` of referenced vocab subschemas). Shallow read is enough
  // to catch a newly standardised keyword.
  const kw = new Set();
  const addProps = (obj) => { if (obj && typeof obj.properties === "object") for (const k of Object.keys(obj.properties)) kw.add(k); };
  addProps(meta);
  const defs = meta.$defs || meta.definitions;
  if (defs && typeof defs === "object") for (const sub of Object.values(defs)) addProps(sub);
  if (Array.isArray(meta.allOf)) for (const sub of meta.allOf) addProps(sub);
  return kw;
}

// --- self-test (offline proof the alerts fire) ------------------------------

function selfTest() {
  console.log("Self-test — proving the diff/alert mechanism fires (offline)");
  let failures = 0;
  const check = (name, cond) => { console.log(`  ${cond ? "ok  " : "FAIL"} ${name}`); if (!cond) failures++; };

  // 1. Job A: a synthetic snapshot that introduces a brand-new Form.io type must
  //    surface as a new UNHANDLED construct token classed `unknown` (drift).
  const prev = new Set(["type:textfield", "type:panel"]);
  const syntheticForm = { components: [
    { type: "textfield", key: "a" },
    { type: "quantumField", key: "b" } // <- new, not in the vendored snapshot
  ] };
  const { tokens, unhandled } = constructTokens("formio", syntheticForm);
  const { added } = diffSets(prev, tokens);
  const newUnhandled = added.filter((t) => unhandled.has(t));
  check("Job A detects the new token", added.includes("type:quantumField"));
  check("Job A flags it unhandled", newUnhandled.includes("type:quantumField"));
  check("Job A classes an unknown type as drift", classifyUnhandledToken("formio", "type:quantumField", new Set()) === "unknown");
  check("Job A classes a known-but-unmapped type as backlog", classifyUnhandledToken("formio", "type:tree", new Set(["tree"])) === "unsupported");

  // 2. Job A: a novel JSON Schema keyword must be flagged unhandled.
  const js = constructTokens("json-schema", { type: "object", properties: { x: { type: "string", "x-vendor-widget": "slider" } } });
  check("Job A flags a vendor JSON Schema keyword", js.unhandled.has("keyword-unknown:x-vendor-widget"));

  // 2a. Classification: a single Form.io component is wrapped as a form.
  const single = classifyDefinitions("formio", [{ name: "comp", value: { type: "textfield", key: "a" } }]);
  check("A single Form.io component is wrapped as a form",
    single.length === 1 && Array.isArray(single[0].def.components) && single[0].def.components[0].key === "a");
  const container = classifyDefinitions("formio", [
    { name: "tabs", value: { type: "tabs", key: "tabs", components: [{ key: "t", components: [] }] } },
    { name: "saved", value: { type: "form", key: "saved", components: [{ type: "textfield", key: "a" }] } }
  ]);
  check("A single container component is wrapped, a saved form is not",
    container[0].def.components?.[0]?.type === "tabs" && container[1].def.type === "form");

  // 2b. Pairing: a schema pairs with the uiSchema of its own name, not the module's first one.
  const s1 = { type: "object", properties: { a: { type: "string" } } };
  const s2 = { type: "object", properties: { b: { type: "string" } } };
  const u1 = { type: "VerticalLayout", elements: [] };
  const u2 = { type: "HorizontalLayout", elements: [] };
  const byName = classifyDefinitions("json-schema", [
    { name: "schema", value: s1 }, { name: "uischema", value: u1 },
    { name: "schema_2343", value: s2 }, { name: "uischema_2343", value: u2 }
  ]);
  check("Pairing matches schema_2343 with uischema_2343",
    byName.length === 2 && byName.some((d) => d.def.schema === s2 && d.def.uiSchema === u2)
      && byName.some((d) => d.def.schema === s1 && d.def.uiSchema === u1));
  const twoUis = classifyDefinitions("json-schema", [
    { name: "schema", value: s1 }, { name: "uischema", value: u1 }, { name: "uischemaAlt", value: u2 }
  ]);
  check("One schema with two uiSchemas gives two definitions",
    twoUis.length === 2 && twoUis.every((d) => d.def.schema === s1) && twoUis.some((d) => d.def.uiSchema === u2));

  // 2b'. Pairing by fit: a fallback pairing needs one of the uiSchema's scopes to resolve in the schema.
  const sa = { type: "object", properties: { a: { type: "string" } } };
  const sb = { type: "object", properties: { b: { type: "string" } } };
  const ua = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" }] };
  const ub = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/b" }] };
  const misOnly = classifyDefinitions("json-schema", [{ name: "schema_1", value: sa }, { name: "uischema_2", value: ub }]);
  check("A single uiSchema written for another schema stays unpaired",
    misOnly.length === 1 && misOnly[0].def === sa);
  const okOnly = classifyDefinitions("json-schema", [{ name: "schema_1", value: sa }, { name: "uischema_2", value: ua }]);
  check("A single uiSchema whose scope resolves still pairs",
    okOnly.length === 1 && okOnly[0].def.schema === sa && okOnly[0].def.uiSchema === ua);
  const misLeft = classifyDefinitions("json-schema", [
    { name: "schema", value: sa }, { name: "uischema", value: ua }, { name: "uischemaOther", value: ub }
  ]);
  check("A leftover uiSchema written for another schema is not used, the name match is kept",
    misLeft.length === 1 && misLeft[0].def.schema === sa && misLeft[0].def.uiSchema === ua);
  const misBare = classifyDefinitions("json-schema", [
    { name: "schema", value: sa }, { name: "uischemaX", value: ub }, { name: "uischemaY", value: ub }
  ]);
  check("One schema with only mis-paired leftovers stays bare",
    misBare.length === 1 && misBare[0].def === sa);
  const refd = { $defs: { p: { type: "object", properties: { c: { type: "string" } } } }, type: "object", allOf: [{ $ref: "#/$defs/p" }] };
  const uc = { type: "Control", scope: "#/properties/c" };
  const viaRef = classifyDefinitions("json-schema", [{ name: "schema_1", value: refd }, { name: "uischema_2", value: uc }]);
  check("A scope that resolves through allOf and $ref counts as fitting",
    viaRef.length === 1 && viaRef[0].def.uiSchema === uc);
  // A combinator that leads back to a schema being searched: Cat's allOf names Pet, whose oneOf
  // names Cat. The search moves on to Cat's own properties, and a missing one ends, not overflows.
  const pets = { type: "object", properties: { pet: { $ref: "#/definitions/Pet" } }, definitions: {
    Pet: { type: "object", properties: { kind: { type: "string" } }, oneOf: [{ $ref: "#/definitions/Cat" }] },
    Cat: { allOf: [{ $ref: "#/definitions/Pet" }, { properties: { meow: { type: "boolean" } } }] }
  } };
  const pairPets = (scope) => {
    try {
      return classifyDefinitions("json-schema", [{ name: "schema_1", value: pets }, { name: "uischema_2", value: { type: "Control", scope } }]);
    } catch {
      return undefined;
    }
  };
  const viaCycle = pairPets("#/properties/pet/properties/meow");
  check("A scope found past a combinator cycle counts as fitting", viaCycle?.length === 1 && viaCycle[0].def.uiSchema !== undefined);
  const missCycle = pairPets("#/properties/pet/properties/nope");
  check("A scope missing behind a combinator cycle does not fit, and does not throw", missCycle?.length === 1 && missCycle[0].def === pets);

  // 2c. Property tokens and the new-key alert, for a handled token too.
  const fio = constructTokens("formio", { components: [{
    type: "textfield", key: "a", conditional: { show: "true", conjunction: "all", conditions: [{ component: "b", operator: "isEqual" }] }
  }, { type: "select", key: "s", dataSrc: "url" }] });
  check("Form.io property tokens are collected",
    ["key:textfield.conditional", "show:string", "condition-op:isEqual", "data-src:url"].every((t) => fio.tokens.has(t)));
  const jf = constructTokens("json-schema", { schema: s1, uiSchema: { type: "Control", scope: "#/properties/a",
    options: { multi: true }, rule: { effect: "HIDE", condition: { scope: "#/properties/a", schema: { const: "x" } } } } });
  check("JSONForms property tokens are collected",
    ["ui-option:multi", "rule-effect:HIDE", "rule-condition:const"].every((t) => jf.tokens.has(t)));
  const rj = constructTokens("json-schema", { schema: s1, uiSchema: { a: { "ui:autocapitalize": "words", items: { "ui:readonly": true } } } });
  check("Nested RJSF ui keys are collected", rj.tokens.has("ui-key:ui:autocapitalize") && rj.tokens.has("ui-key:ui:readonly"));
  const keyDiff = tokenAlerts("formio", new Set(["key:textfield.key"]), new Set(["key:textfield.key", "key:textfield.prefix"]), new Set(), new Set());
  check("Job A raises new-key for a new handled property token",
    keyDiff.alerts.some((a) => a.kind === "new-key" && a.severity === "medium" && a.token === "key:textfield.prefix"));
  const firstRun = tokenAlerts("formio", new Set(["type:textfield"]), new Set(["type:textfield", "key:textfield.key"]), new Set(), new Set());
  check("Job A only counts property tokens on their first recording", firstRun.alerts.length === 0 && firstRun.bootstrapKeys === 1);

  // 3. Job B: a synthetic vendored drift (upstream ships a new builtin type).
  const vendored = new Set(["textfield", "panel"]);
  const upstream = new Set(["textfield", "panel", "hologramInput"]);
  const bDiff = diffSets(vendored, upstream);
  check("Job B detects vendored drift", bDiff.added.includes("hologramInput"));

  // 4. Job B: a novel meta-schema keyword outside our vocabulary is caught.
  const novelMeta = [...collectMetaKeywords({ properties: { type: {}, "$quantumKeyword": {} } })]
    .filter((k) => !getKnownJsonSchemaVocab().has(k));
  check("Job B detects meta-schema drift", novelMeta.includes("$quantumKeyword"));

  if (failures > 0) {
    console.error(`self-test: ${failures} check(s) FAILED — the alert mechanism is broken`);
    process.exit(1);
  }
  console.log("self-test: all alert paths fire");
}

// --- main -------------------------------------------------------------------

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--self-test")) { selfTest(); return; }

  const sources = loadSources();
  const alerts = [];
  const vendoredFormioTypes = parseVendoredFormioTypes(readFileSync(join(pkgRoot, "src/formio/vendor/component-types.ts"), "utf8"));

  await jobA(sources, alerts, vendoredFormioTypes);
  await jobB(alerts);

  const high = alerts.filter((a) => a.severity === "high");
  writeFileSync(join(here, ".alerts.json"), JSON.stringify({ alerts }, null, 2) + "\n", "utf8");

  console.log("");
  console.log(`corpus refresh complete: ${alerts.length} alert(s) (${high.length} high). See corpus/.alerts.json`);
  if (alerts.length === 0) console.log("  no drift — every scraped construct has a converter rule and the vendored snapshots are current.");

  if (argv.includes("--fail-on-alert") && alerts.length > 0) process.exit(3);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
