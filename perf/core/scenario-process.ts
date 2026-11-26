import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { scenarioById } from "../scenarios/index.ts";
import { getFixture } from "../fixtures/index.ts";
import { getExtraFixtures } from "../fixtures/extra.ts";
import { sampleLoop, scenarioDriver } from "../harness/sample.ts";
import { installFunnels } from "../harness/counters.ts";
import { summarize } from "../harness/stats.ts";
import type { PerfContext, PerfFixture } from "../harness/scenario.ts";
import { missingRequirement } from "../harness/scenario.ts";
import type { ResultEntry } from "../harness/node/result.ts";
import { resolveCoreDir } from "../harness/node/build.ts";
import { readEnv } from "../harness/node/env.ts";
import { isLocalId } from "../harness/ids.ts";

// One scenario in this fresh process: `node --expose-gc perf/core/scenario-process.ts <id>`. It prints one JSON
// line on stdout, { type: "entry" | "skipped" | "failed", ... }, and nothing on stderr.
declare const gc: undefined | (() => void);

const id = process.argv[2];
let printed: any;
const print = (line: any): void => { printed = line; };

async function main(): Promise<void> {
  const env = readEnv();
  const core = resolveCoreDir();
  const extra = id.indexOf("extra/") === 0 ? getExtraFixtures(env.extraJson || "").filter((f: any) => id.indexOf(f.key + "/") === 0)[0] : undefined;
  const scenario = scenarioById(id, extra ? extra.ops : undefined);
  if (!scenario) throw new Error("Unknown scenario " + id);
  if (typeof gc !== "function") throw new Error("gc() is missing: run with node --expose-gc");
  // A console.warn or console.error during a scenario fails it.
  const warnings: Array<string> = [];
  console.warn = (...args: Array<any>): void => { warnings.push("warn: " + String(args[0]).substring(0, 300)); };
  console.error = (...args: Array<any>): void => { warnings.push("error: " + String(args[0]).substring(0, 300)); };
  // The target build is imported by path, so the master build and an npm build load the same way (D05).
  const Survey = await import(pathToFileURL(path.join(core.dir, "fesm", "survey-core.mjs")).href);
  await import(pathToFileURL(path.join(core.dir, "fesm", "i18n", "german.mjs")).href);
  const skip = missingRequirement(Survey, scenario.requires);
  if (skip) {
    print({ type: "skipped", id: id, reason: skip });
    return;
  }
  const isExtra = scenario.fixture.indexOf("extra/") === 0;
  let fixture: PerfFixture;
  if (isExtra) {
    if (!extra || extra.key !== scenario.fixture) throw new Error("No PERF_EXTRA_JSON file for " + scenario.fixture);
    // <base>.setup.mjs: once, before any survey of this process is created (it registers the form's functions).
    if (extra.setup) {
      const setup = await import(pathToFileURL(extra.setup).href);
      if (typeof setup.default !== "function") throw new Error(extra.setup + ": the default export is not a function");
      await setup.default(Survey);
    }
    // meta counts the questions without the data: load/model sets none.
    const probe = new Survey.Model(extra.json);
    const meta = { pages: probe.pages.length, questions: probe.getAllQuestions(false).length };
    probe.dispose();
    fixture = { key: extra.key, json: extra.json, text: JSON.stringify(extra.json), data: extra.data, meta: meta };
  } else {
    const f = getFixture(scenario.fixture);
    fixture = { key: f.key, json: f.json, text: JSON.stringify(f.json), data: f.data, meta: f.meta };
  }
  const now = (): number => performance.now();
  const ctx: PerfContext = { Survey: Survey, fixture: fixture, platform: "node", now: now, cache: {} };
  const driver = scenarioDriver(scenario, ctx, {
    now: now,
    gc: (): void => (gc as () => void)(),
    installFunnels: () => installFunnels(Survey)
  });
  // maxMs 3 s (5 s before 2026-11-10): the samples' spread is a few percent against a 25% threshold, so the extra
  // samples bought little; at least 5 are kept either way, or all of them when a scenario asks for fewer (a slow
  // extra/ op).
  const samples = scenario.samples || 12;
  const res = await sampleLoop(driver, { warmup: scenario.warmup === undefined ? 2 : scenario.warmup, samples: samples,
    maxMs: scenario.maxMs || 3000, minSamples: Math.min(5, samples), now: now });
  (gc as () => void)();
  if (warnings.length > 0 && !isExtra) throw new Error("warnings during the scenario: " + warnings.slice(0, 3).join(" | "));
  const jsonErrors = ctx.cache.jsonErrors || 0;
  // jsonErrors fail a scenario on the runner's own build and in nightly or record runs; elsewhere (an npm build,
  // extra/*) they are only recorded.
  const strict = !isExtra && (core.isRunnerBuild || env.kind === "nightly" || env.kind === "record");
  if (strict && jsonErrors > 0) throw new Error(jsonErrors + " jsonErrors on " + scenario.fixture);
  const stats = summarize(res.samples);
  const phases: { [phase: string]: { median: number, min: number } } | undefined = res.phases ? {} : undefined;
  if (res.phases && phases) {
    for (const key in res.phases) {
      const p = summarize(res.phases[key]);
      phases[key] = { median: p.median, min: p.min };
    }
  }
  const entry: ResultEntry = {
    id: scenario.id, rev: scenario.rev, unit: "ms", samples: res.samples.map((v: number) => Math.round(v * 100) / 100),
    median: stats.median, min: stats.min, max: stats.max, mad: stats.mad,
    phases: phases, counters: res.counters,
    info: { kept: res.samples.length, warmups: res.warmups.length, wallMs: Math.round(res.wallMs), heapMB: Math.round(process.memoryUsage().heapUsed / 1048576),
      gc: true, fixtureMeta: isExtra ? fixture.meta : undefined, warnings: isExtra ? warnings.length : undefined },
    jsonErrors: jsonErrors, tolerance: scenario.tolerance === undefined ? null : scenario.tolerance, local: isExtra || isLocalId(id)
  };
  if (scenario.repeat) entry.repeat = scenario.repeat;
  if (scenario.counterOnly) entry.counterOnly = true;
  print({ type: "entry", entry: entry });
}

// Exit once the line is flushed: a survey may leave timers behind, so the process is not left to end by itself.
const finish = (): void => {
  process.stdout.write(JSON.stringify(printed) + "\n", () => process.exit(0));
};
main().then(finish, (e: any) => {
  printed = { type: "failed", id: id, error: String(e && e.stack ? e.stack : e).substring(0, 2000) };
  finish();
});
