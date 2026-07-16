// Corpus fidelity scoring — the per-push regression gate (`npm run corpus:score`).
//
// For every scraped definition in corpus/<source>/ this runs TWO gates
// (promts/03-eval-corpus.md):
//
//   1. Oracle (HARD gate): convert(def).output constructs a survey-core
//      SurveyModel with ZERO jsonErrors. This is the shared oracle from steps
//      01/02. A single failure fails CI — the whole point of scoring against a
//      real corpus is that a converter change that produces invalid SurveyJS on
//      a real-world form is caught here, not by a customer.
//
//   2. Fidelity (tracked metric): fields_out/fields_in and the weighted "clean"
//      score, per definition and aggregated. A drop in the AGGREGATE below the
//      committed baseline fails CI; per-definition drops are logged, not failed
//      (real forms vary; the aggregate is the signal).
//
// The corpus is scored in FULL — no top-N, no sampling. If anything is dropped
// (a def that will not parse at all), it is logged loudly, never skipped
// silently: a silent truncation reads as "covered everything" when it did not.

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { convert as convertFormio } from "../src/formio/index";
import { convert as convertJsonSchema } from "../src/json-schema/index";
import { assertConstructsCleanly } from "../src/testing/oracle";
import { scoreDefinition, aggregate, round4 } from "./scoring.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(here, "fidelity-baseline.json");
// Aggregate tolerances. Fidelity may not drop more than this below baseline;
// weighted-clean-per-field may not rise more than this above it.
const RATIO_EPS = 0.02;
const CLEAN_EPS = 0.05;

const CONVERTERS = {
  formio: convertFormio,
  "json-schema": convertJsonSchema
} as const;

type SourceId = keyof typeof CONVERTERS;

interface Scored {
  source: SourceId;
  file: string;
  output: unknown;
  score: ReturnType<typeof scoreDefinition>;
}

/** Load every committed snapshot for a source (excludes the token manifest). */
function loadDefs(source: SourceId): { file: string, def: unknown }[] {
  const dir = join(here, source);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "_manifest.json")
    .sort()
    .map((f) => ({ file: f, def: JSON.parse(readFileSync(join(dir, f), "utf8")) }));
}

// Convert the whole corpus eagerly so the oracle tests, the per-definition drop
// log, and the aggregate all read the same results. Conversion failures are
// recorded (never swallowed) and asserted per-file below.
const scored: Scored[] = [];
const conversionErrors: { source: SourceId, file: string, message: string }[] = [];

for (const source of Object.keys(CONVERTERS) as SourceId[]) {
  for (const { file, def } of loadDefs(source)) {
    try {
      const { output, report } = CONVERTERS[source](def);
      scored.push({ source, file, output, score: scoreDefinition(source, def, output, report) });
    } catch (e) {
      // A throw here means detection rejected the file as wrong-format /
      // unparseable — it is not a scorable definition. Record it so it is
      // visible; it still fails its oracle test below (nothing was produced).
      conversionErrors.push({ source, file, message: (e as Error).message });
    }
  }
}

describe("corpus fidelity — oracle (hard gate)", () => {
  for (const source of Object.keys(CONVERTERS) as SourceId[]) {
    const defs = loadDefs(source);
    describe(source, () => {
      if (defs.length === 0) {
        it("has a committed corpus to score", () => {
          // An empty corpus is itself a failure — the gate would pass vacuously.
          expect(defs.length, `no committed definitions under corpus/${source}/`).toBeGreaterThan(0);
        });
        return;
      }
      for (const { file } of defs) {
        it(`${file} constructs a SurveyModel with zero errors`, () => {
          const err = conversionErrors.find((e) => e.source === source && e.file === file);
          expect(err, err ? `convert() threw: ${err.message}` : undefined).toBeUndefined();
          const entry = scored.find((s) => s.source === source && s.file === file)!;
          assertConstructsCleanly(entry.output, `${source}/${file}`);
        });
      }
    });
  }
});

describe("corpus fidelity — aggregate metric (regression gate)", () => {
  it("scored every committed definition (no silent truncation)", () => {
    const totalFiles = (Object.keys(CONVERTERS) as SourceId[]).reduce((n, s) => n + loadDefs(s).length, 0);
    const covered = scored.length + conversionErrors.length;
    // Every file is either scored or recorded as an error — nothing vanishes.
    expect(covered, "some corpus files were neither scored nor recorded as errors").toBe(totalFiles);
    if (conversionErrors.length > 0) {
      console.log(`corpus:score — ${conversionErrors.length} file(s) failed to convert (see oracle failures):`);
      for (const e of conversionErrors) console.log(`  ! ${e.source}/${e.file}: ${e.message}`);
    }
    console.log(`corpus:score — scored ${scored.length} definition(s) across ${(Object.keys(CONVERTERS)).length} converter(s).`);
  });

  it("aggregate fidelity has not regressed below the committed baseline", () => {
    const agg = aggregate(scored.map((s) => s.score));
    const perSource: Record<string, ReturnType<typeof aggregate>> = {};
    for (const source of Object.keys(CONVERTERS) as SourceId[]) {
      perSource[source] = aggregate(scored.filter((s) => s.source === source).map((s) => s.score));
    }
    const current = summarize(agg, perSource);

    // Per-definition drop log (tracked, not failed).
    const worst = [...scored]
      .filter((s) => s.score.fieldsIn > 0 && (s.score.ratio < 0.9 || s.score.weightedClean > 0))
      .sort((a, b) => a.score.ratio - b.score.ratio)
      .slice(0, 15);
    if (worst.length > 0) {
      console.log("corpus:score — lowest-fidelity definitions (logged, not gated):");
      for (const s of worst) {
        console.log(`  ${s.source}/${s.file}: ratio=${round4(s.score.ratio)} in=${s.score.fieldsIn} out=${s.score.fieldsOut} weightedClean=${s.score.weightedClean}`);
      }
    }
    console.log(`corpus:score — aggregate fidelityRatio=${current.fidelityRatio} cleanPerField=${current.cleanPerField} over ${current.definitions} defs.`);

    if (!existsSync(BASELINE_PATH) || process.env.UPDATE_BASELINE) {
      writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 2) + "\n", "utf8");
      console.log(`corpus:score — wrote baseline to ${BASELINE_PATH} (bootstrap / UPDATE_BASELINE).`);
      return; // bootstrap run establishes the baseline; nothing to compare against
    }

    const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
    // Fidelity must not fall, weighted-clean-per-field must not climb.
    expect(
      current.fidelityRatio,
      `aggregate fidelityRatio ${current.fidelityRatio} dropped >${RATIO_EPS} below baseline ${baseline.fidelityRatio}`
    ).toBeGreaterThanOrEqual(baseline.fidelityRatio - RATIO_EPS);
    expect(
      current.cleanPerField,
      `aggregate cleanPerField ${current.cleanPerField} rose >${CLEAN_EPS} above baseline ${baseline.cleanPerField}`
    ).toBeLessThanOrEqual(baseline.cleanPerField + CLEAN_EPS);

    // A shrinking corpus can hide a regression — log it loudly (do not silently pass).
    if (current.definitions < baseline.definitions) {
      console.log(`corpus:score — WARNING: corpus shrank ${baseline.definitions} -> ${current.definitions} definitions since the baseline.`);
    }
  });
});

function summarize(agg: ReturnType<typeof aggregate>, perSource: Record<string, ReturnType<typeof aggregate>>) {
  const shape = (a: ReturnType<typeof aggregate>) => ({
    definitions: a.definitions,
    fieldsIn: a.fieldsIn,
    fieldsOut: a.fieldsOut,
    buckets: a.buckets,
    weightedClean: a.weightedClean,
    fidelityRatio: round4(a.fidelityRatio),
    cleanPerField: round4(a.cleanPerField)
  });
  return {
    ...shape(agg),
    perSource: Object.fromEntries(Object.entries(perSource).map(([k, v]) => [k, shape(v)]))
  };
}
