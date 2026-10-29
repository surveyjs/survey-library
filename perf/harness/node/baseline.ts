import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { median, mad } from "../stats.ts";
import type { ResultFile, ResultEntry } from "./result.ts";
import { readResult } from "./result.ts";
import { readEnv } from "./env.ts";
import { baselineFile, ratchetFile, readJson, writeJson, canonical } from "./state.ts";

// The baseline of a suite on one machine (04): built from record runs, never committed to the repo.
export const defaultTolerance = 0.25;
export const calibrationLimit = 1.15;

export interface BaselineCounter {
  value: number | null;
  kind: "work" | "dom";
  unstable?: boolean;
}

export interface BaselineScenario {
  rev: number;
  fixtureHash: string;
  dataHash?: string;
  jsonErrors: number;
  median: number;
  min: number;
  sigma: number;
  calibration: number;
  noiseTol: number;
  unstable?: boolean;
  counterOnly?: boolean;
  runs: number;
  droppedRuns: number;
  counters: { [name: string]: BaselineCounter };
  createdFrom: Array<string>;
  createdAt: string;
}

export interface Baseline {
  schema: 1;
  suite: string;
  machineKey: string;
  createdAt: string;
  scenarios: { [id: string]: BaselineScenario };
}

export interface BaselineOptions {
  // Ids to replace in an existing baseline (D22, partial renewal); the other scenarios are kept.
  update?: Array<string>;
  // kind "local" results are refused unless the baseline is a local one (PERF_STATE_DIR unset).
  allowLocal?: boolean;
  now?: Date;
}

export interface BaselineBuild {
  baseline: Baseline;
  // Scenarios with fewer than 4 runs left after dropping slow ones: record them again (at most twice).
  rerecord: Array<string>;
}

// noiseTol = clamp(exp(2.5 x sigma) - 1, 0, 0.50), rounded up to 0.05; above 0.50 the scenario is unstable.
export function noiseTolerance(sigma: number): { noiseTol: number, unstable: boolean } {
  const raw = Math.exp(2.5 * sigma) - 1;
  const rounded = Math.ceil(Math.max(0, raw) * 20 - 1e-9) / 20;
  return { noiseTol: Math.min(0.5, rounded), unstable: raw > 0.5 };
}

export function sigmaOf(medians: Array<number>): number {
  return 1.4826 * mad(medians.map((m: number) => Math.log(m)));
}

function refuse(message: string): never {
  throw new Error("baseline refused: " + message);
}

export function buildBaseline(results: Array<ResultFile>, options: BaselineOptions = {}, previous?: Baseline): BaselineBuild {
  if (results.length === 0) refuse("no result files");
  const suite = results[0].suite;
  const key = results[0].machine.key;
  results.forEach((r: ResultFile, i: number) => {
    if (r.suite !== suite) refuse("mixed suites: " + r.suite + " and " + suite);
    if (r.machine.key !== key) refuse("mixed machine keys: " + r.machine.key + " and " + key);
    if (r.environment && r.environment.noisy) refuse("run " + (i + 1) + " is noisy (" + (r.environment.noisyReasons || []).join(", ") + ")");
    if (r.kind === "local" && !options.allowLocal) refuse("run " + (i + 1) + " is kind local; a local baseline needs PERF_STATE_DIR unset");
  });
  const now = (options.now || new Date()).toISOString();
  const ids = Array.from(new Set(results.flatMap((r: ResultFile) => r.results.filter((e: ResultEntry) => !e.local).map((e: ResultEntry) => e.id)))).sort()
    .filter((id: string) => !options.update || options.update.indexOf(id) > -1);
  const scenarios: { [id: string]: BaselineScenario } = previous && options.update ? Object.assign({}, previous.scenarios) : {};
  const rerecord: Array<string> = [];
  for (const id of ids) {
    const runs = results.map((r: ResultFile) => ({ r: r, e: r.results.filter((e: ResultEntry) => e.id === id)[0] })).filter((x: any) => !!x.e);
    const fixtureKey = id.split("/").slice(0, id.indexOf("extra/") === 0 ? 2 : 1).join("/");
    const hashes = new Set(runs.map((x: any) => JSON.stringify([x.e.rev, (x.r.fixtures[fixtureKey] || {}).hash, (x.r.fixtures[fixtureKey] || {}).dataHash, x.e.jsonErrors])));
    if (hashes.size > 1) refuse(id + ": mixed fixture hashes, revs or jsonErrors across the runs");
    // Drop a run whose calibration was > 1.15x the others'.
    const cals = runs.map((x: any) => Math.max(x.e.calibration.before, x.e.calibration.after));
    const kept = runs.filter((x: any, i: number) => cals[i] <= calibrationLimit * median(cals.filter((c: number, j: number) => j !== i)));
    const medians = kept.map((x: any) => x.e.median);
    const sigma = medians.length > 1 ? sigmaOf(medians) : 0;
    const noise = noiseTolerance(sigma);
    const counters: { [name: string]: BaselineCounter } = {};
    const names = Array.from(new Set(kept.flatMap((x: any) => Object.keys(x.e.counters))));
    names.forEach((name: string) => {
      const values = kept.map((x: any) => x.e.counters[name] ? x.e.counters[name].value : undefined);
      const c: BaselineCounter = { value: values[0] === undefined ? null : values[0], kind: (kept[0].e.counters[name] || { kind: "work" }).kind };
      if (new Set(values.map(String)).size > 1) c.unstable = true;
      counters[name] = c;
    });
    const first = kept[0] || runs[0];
    const fx = first.r.fixtures[fixtureKey] || {};
    const entry: BaselineScenario = {
      rev: first.e.rev, fixtureHash: fx.hash, dataHash: fx.dataHash, jsonErrors: first.e.jsonErrors,
      median: medians.length ? median(medians) : NaN, min: medians.length ? Math.min(...medians) : NaN, sigma: sigma,
      calibration: median(kept.map((x: any) => x.e.calibration.median)), noiseTol: noise.noiseTol, counters: counters,
      runs: kept.length, droppedRuns: runs.length - kept.length, createdFrom: results.map((r: ResultFile) => r.date), createdAt: now
    };
    if (first.e.counterOnly) entry.counterOnly = true;
    if (noise.unstable || kept.length < 4) entry.unstable = true;
    if (kept.length < 4) rerecord.push(id);
    scenarios[id] = entry;
  }
  return { baseline: { schema: 1, suite: suite, machineKey: key, createdAt: now, scenarios: scenarios }, rerecord: rerecord };
}

function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

// Writes the baseline; a renewal keeps the old file as <name>.<UTC date>.json and removes the ratchet (D19).
export function writeBaseline(stateDir: string, build: BaselineBuild, options: BaselineOptions = {}): string {
  const b = build.baseline;
  const file = baselineFile(stateDir, b.suite, b.machineKey);
  if (fs.existsSync(file)) fs.copyFileSync(file, file.replace(/\.json$/, "." + stamp(options.now || new Date()) + ".json"));
  writeJson(file, canonical(b));
  const ratchet = ratchetFile(stateDir, b.suite, b.machineKey);
  if (fs.existsSync(ratchet)) {
    if (options.update) {
      const r = readJson<any>(ratchet, { scenarios: {} });
      options.update.forEach((id: string) => { delete r.scenarios[id]; });
      writeJson(ratchet, r);
    } else {
      fs.unlinkSync(ratchet);
    }
  }
  return file;
}

export function readBaseline(file: string): Baseline | undefined {
  return readJson<Baseline | undefined>(file, undefined);
}

// node perf/harness/node/baseline.ts <suite> <result.json>... [--update <ids>]
function main(): void {
  const args = process.argv.slice(2);
  const updateAt = args.indexOf("--update");
  const update = updateAt > -1 ? args[updateAt + 1].split(",") : undefined;
  const rest = args.filter((a: string, i: number) => i !== updateAt && i !== updateAt + 1);
  const suite = rest[0];
  const files = rest.slice(1);
  if (!suite || files.length === 0) throw new Error("usage: baseline.ts <suite> <result.json>... [--update <ids>]");
  const env = readEnv();
  const results = files.map(readResult).filter((r: ResultFile) => r.suite === suite);
  const allowLocal = !process.env.PERF_STATE_DIR;
  const key = results[0] ? results[0].machine.key : "";
  const previous = update ? readBaseline(baselineFile(env.stateDir, suite, key)) : undefined;
  if (update && !previous) throw new Error("--update needs an existing baseline for " + suite + " on " + key);
  const build = buildBaseline(results, { update: update, allowLocal: allowLocal }, previous);
  const file = writeBaseline(env.stateDir, build, { update: update });
  const unstable = Object.keys(build.baseline.scenarios).filter((id: string) => build.baseline.scenarios[id].unstable);
  console.log(suite + ": baseline of " + Object.keys(build.baseline.scenarios).length + " scenarios from " + results.length + " runs -> " + file);
  if (unstable.length) console.log("unstable: " + unstable.join(", "));
  if (build.rerecord.length) console.log("record again (fewer than 4 runs after dropping slow ones): " + build.rerecord.join(","));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
