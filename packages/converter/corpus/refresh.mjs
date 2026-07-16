/* eslint-env node */
/* eslint-disable no-console -- this is a CLI-style corpus job; printing is its interface */

// Scheduled corpus refresh + vendored-schema diff.
//
// Status: SCAFFOLD. Full implementation is described in
// `../promts/03-eval-corpus.md`. Run weekly in CI (not on every push).
//
// Responsibilities:
//   1. Read corpus/sources.json.
//   2. For each source, fetch the matching files from upstream at the given ref.
//   3. Diff against the previous snapshot in corpus/<source>/. A NEW construct
//      (component type / JSON Schema keyword we have no rule for) -> alert.
//   4. Diff the vendored @formio/core types snapshot (src/formio/vendor/) and
//      the JSON Schema meta-schemas against upstream. Drift -> alert.
//
// Alerting is the whole point: the frozen fixtures pass forever while the
// upstream format moves. This job is what tells us before a customer does.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import process from "node:process";

const here = dirname(fileURLToPath(import.meta.url));

function loadSources() {
  return JSON.parse(readFileSync(join(here, "sources.json"), "utf8"));
}

async function main() {
  const sources = loadSources();
  // PROMPT 03: implement fetch + diff + alert. Until then, this only validates
  // that sources.json is well-formed so the scheduled job fails loudly if the
  // config rots, rather than silently scraping nothing.
  const converters = Object.keys(sources).filter((k) => !k.startsWith("_"));
  if (converters.length === 0) {
    console.error("corpus refresh: no sources configured");
    process.exit(1);
  }
  console.log(`corpus refresh: ${converters.length} converter source group(s) configured:`);
  for (const c of converters) {
    console.log(`  ${c}: ${sources[c].length} upstream source(s)`);
  }
  console.log("corpus refresh: scrape+diff not yet implemented (see promts/03-eval-corpus.md)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
