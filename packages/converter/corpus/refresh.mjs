/* eslint-env node */
/* eslint-disable no-console -- this is a CLI-style corpus job; printing is its interface */

// Scheduled corpus refresh + vendored-schema diff.
//
// Two independent jobs on one weekly schedule (see promts/03-eval-corpus.md):
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
// to corpus/.alerts.json (consumed by the scheduled workflow to open an issue)
// and print a human summary. `--self-test` proves the alerting fires against a
// synthetic diff, offline, so the mechanism itself is covered in CI.
//
// Flags:
//   (default)         Jobs A + B against live upstream; writes snapshots,
//                     manifests, and .alerts.json. Exits 0.
//   --fail-on-alert   Exit non-zero when any alert fired (for a gating step).
//   --self-test       Offline: assert the diff/alert mechanism fires on a
//                     synthetic new construct + vendored drift. No network.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import process from "node:process";
import {
  listRepoFiles, fetchRaw, matchGlobs, extractLiterals, classifyDefinitions,
  constructTokens, parseVendoredFormioTypes, scrapeUpstreamFormioTypes, diffSets
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

async function scrapeSource(source, entries, alerts) {
  const tokens = new Set();
  const unhandled = new Set();
  const files = [];
  let extractedDefs = 0;
  let skippedLiterals = 0;

  for (const entry of entries) {
    const { repo, ref, globs } = entry;
    let listing;
    try {
      listing = await listRepoFiles(repo, ref);
    } catch (e) {
      // A source we cannot even list is itself an alert — the config may have
      // rotted (repo renamed, ref deleted) and a silent skip would hide it.
      alerts.push({ job: "A", severity: "high", kind: "source-unreachable", source, repo, ref, detail: e.message });
      continue;
    }
    if (listing.truncated) {
      alerts.push({ job: "A", severity: "medium", kind: "tree-truncated", source, repo, ref });
      console.log(`  ! ${repo}@${ref}: tree truncated by GitHub API — scrape is partial`);
    }
    const matched = listing.paths.filter((p) => matchGlobs(p, globs));
    console.log(`  ${repo}@${ref}: ${matched.length} file(s) match globs`);

    for (const path of matched) {
      let text;
      try { text = await fetchRaw(repo, ref, path); } catch { continue; }
      const defs = collectDefs(source, path, text);
      extractedDefs += defs.length;
      for (const { snapshot, def } of defs) {
        files.push(snapshot);
        writeFileSync(join(sourceDir(source), snapshot), JSON.stringify(def, null, 2) + "\n", "utf8");
        const t = constructTokens(source, def);
        for (const tok of t.tokens) tokens.add(tok);
        for (const tok of t.unhandled) unhandled.add(tok);
      }
    }
  }

  console.log(`  extracted ${extractedDefs} definition(s); ${tokens.size} construct token(s), ${unhandled.size} unhandled`);
  if (skippedLiterals > 0) console.log(`  (skipped ${skippedLiterals} non-literal exports)`);
  return { tokens, unhandled, files };
}

function sourceDir(source) {
  const d = join(here, source);
  mkdirSync(d, { recursive: true });
  return d;
}

function collectDefs(source, path, text) {
  const out = [];
  if (path.endsWith(".json")) {
    try {
      const value = JSON.parse(text);
      const defs = classifyDefinitions(source, [{ name: "default", value }]);
      defs.forEach((d) => out.push({ snapshot: snapFor(source, path, d.suffix), def: d.def }));
    } catch { /* not JSON we can use */ }
    return out;
  }
  // .ts / .js module -> extract exported literals, classify.
  const { literals } = extractLiterals(text);
  const defs = classifyDefinitions(source, literals);
  defs.forEach((d) => out.push({ snapshot: snapFor(source, path, d.suffix), def: d.def }));
  return out;
}

// Snapshot filename derived from the upstream path + literal name. Deterministic
// and filesystem-safe; carries no form content.
function snapFor(source, path, suffix) {
  const base = path.replace(/^.*\//, "").replace(/\.(ts|js|json)$/i, "");
  const clean = `${base}${suffix && suffix !== "default" ? "-" + suffix : ""}`.replace(/[^A-Za-z0-9_-]+/g, "-");
  return `${clean}.json`;
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
    const { tokens, unhandled, files } = await scrapeSource(source, sources[source], alerts);

    const { added, removed } = diffSets(prevTokens, tokens);
    const newUnhandled = added.filter((t) => unhandled.has(t));

    for (const token of newUnhandled) {
      const cls = classifyUnhandledToken(source, token, vendoredFormioTypes);
      alerts.push({
        job: "A", severity: "high", kind: "new-construct", class: cls, source, token,
        detail: `New ${cls} construct with no converter rule: ${token}`
      });
      console.log(`  ALERT new-construct [${cls}] ${token}`);
    }
    if (added.length > 0) console.log(`  + ${added.length} new token(s) (${newUnhandled.length} unhandled)`);
    if (removed.length > 0) console.log(`  - ${removed.length} token(s) gone`);

    writeManifest(source, {
      source,
      files: files.sort(),
      tokens: [...tokens].sort(),
      unhandled: [...unhandled].sort()
    });
  }
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
