import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { ResultFile, ResultEntry } from "./result.ts";
import { readResult, writeJsonAtomic } from "./result.ts";
import type { Baseline } from "./baseline.ts";
import { readBaseline, defaultTolerance, calibrationLimit } from "./baseline.ts";
import type { Ratchet, Reference } from "./reference.ts";
import { readRatchet, referenceOf } from "./reference.ts";
import type { KnownState } from "./known.ts";
import { readKnown, knownEntry, emptyKnown } from "./known.ts";
import { baselineFile, newestBaseline } from "./state.ts";
import { readEnv } from "./env.ts";

// Judging a run (04, D10): verdicts against the reference, the rerun plan, and the final verdicts after reruns.
export type Verdict = "ok" | "improved" | "suspect" | "regression" | "counter regression" | "slow-process" | "unconfirmed" |
  "not-run" | "missing" | "fixture changed" | "new" | "skipped" | "noisy" | "unstable" | "counterOnly" | "local" | "no reference";

export const failingVerdicts: Array<string> = ["regression", "counter regression", "missing", "fixture changed"];
export const rerunCap = 12;
export const rerunTop = 6;

export interface CounterVerdict {
  name: string;
  kind: "work" | "dom";
  value: number | null;
  ref: number | null;
  verdict: "ok" | "regression" | "dom-note" | "unstable" | "new";
  change?: number;
}

export interface ScenarioVerdict {
  id: string;
  verdict: Verdict;
  reason?: string;
  median?: number;
  reference?: number;
  timeSource?: Reference["timeSource"];
  referenceSince?: string;
  change?: number;
  threshold?: number;
  tolerance?: number;
  calibrationRatio?: number;
  vsPrevious?: number;
  rerunMedians?: Array<number>;
  counters: Array<CounterVerdict>;
  counter?: string;
  counterReference?: number;
  tags: Array<string>;
  // For known.json and the ratchet.
  judgedOk: boolean;
  okAgainstFrozen: boolean;
  countersOk: boolean;
  counterValues: { [name: string]: number | null };
}

export interface CompareInput {
  result: ResultFile;
  baseline?: Baseline;
  // The newest baseline of the suite with any machine key, for counters on a new machine (D22).
  counterBaseline?: Baseline;
  ratchet?: Ratchet;
  known?: KnownState;
  previous?: ResultFile;
}

export interface Comparison {
  suite: string;
  machineKey: string;
  newMachineKey: boolean;
  verdicts: Array<ScenarioVerdict>;
  reruns: Array<string>;
  noisy: boolean;
  failed: boolean;
}

export function minDeltaOf(suite: string): number {
  return suite === "core" ? 2 : 8;
}

function fixtureKeyOf(id: string): string {
  return id.split("/").slice(0, id.indexOf("extra/") === 0 ? 2 : 1).join("/");
}

function judgeCounters(entry: ResultEntry, ref: Reference | undefined, base: Baseline["scenarios"][string] | undefined): Array<CounterVerdict> {
  const res: Array<CounterVerdict> = [];
  for (const name in entry.counters) {
    const c = entry.counters[name];
    const r = ref ? ref.counters[name] : undefined;
    const b = base ? base.counters[name] : undefined;
    const cv: CounterVerdict = { name: name, kind: c.kind, value: c.value, ref: r === undefined ? null : r, verdict: "ok" };
    if (!b || r === undefined || r === null || c.value === null) cv.verdict = b && b.unstable ? "unstable" : "new";
    else if (b.unstable) cv.verdict = "unstable";
    else {
      cv.change = r === 0 ? (c.value > 0 ? Infinity : 0) : c.value / r - 1;
      // work: fail above +2% and +1; dom: reported from +2%, fail above x1.5 and +200 (D21).
      if (c.kind === "work" && c.value > r * 1.02 && c.value > r + 1) cv.verdict = "regression";
      if (c.kind === "dom" && c.value > r * 1.5 && c.value > r + 200) cv.verdict = "regression";
      else if (c.kind === "dom" && c.value > r * 1.02) cv.verdict = "dom-note";
    }
    res.push(cv);
  }
  return res;
}

function sameBuild(a: ResultFile, b: ResultFile): boolean {
  const key = (r: ResultFile): string => JSON.stringify([r.build.core.dir, r.build.core.version, r.build.core.commit, r.build.core.mtime,
    r.build.ui ? [r.build.ui.dir, r.build.ui.version, r.build.ui.commit, r.build.ui.mtime] : null]);
  return key(a) === key(b);
}

// The first pass: every scenario of the run and of the reference, and the rerun plan.
export function judge(input: CompareInput): Comparison {
  const { result } = input;
  const suite = result.suite;
  const minDelta = minDeltaOf(suite);
  const known = input.known || emptyKnown();
  const ratchet = input.ratchet || { scenarios: {} };
  const baseline = input.baseline;
  const counterBase = baseline || input.counterBaseline;
  const noisy = !!(result.environment && result.environment.noisy);
  const notRun = new Set<string>((result.requested.notInSuite || []).concat(result.incomplete ? result.incomplete.unrun : []));
  const verdicts: Array<ScenarioVerdict> = [];
  const seen = new Set<string>();
  const make = (id: string, verdict: Verdict, extra?: Partial<ScenarioVerdict>): ScenarioVerdict => Object.assign({ id: id, verdict: verdict,
    counters: [], tags: [], judgedOk: false, okAgainstFrozen: false, countersOk: false, counterValues: {} }, extra || {});
  result.requested.notInSuite.forEach((id: string) => { verdicts.push(make(id, "not-run", { reason: "not in this suite" })); seen.add(id); });
  if (result.incomplete) result.incomplete.unrun.forEach((id: string) => { verdicts.push(make(id, "not-run", { reason: result.incomplete!.reason })); seen.add(id); });
  result.skipped.forEach((s: any) => { verdicts.push(make(s.id, "skipped", { reason: s.reason })); seen.add(s.id); });
  for (const entry of result.results) {
    seen.add(entry.id);
    if (entry.local) { verdicts.push(make(entry.id, "local")); continue; }
    const b = baseline ? baseline.scenarios[entry.id] : undefined;
    const ref = baseline ? referenceOf(suite, entry.id, baseline, ratchet, known) : (counterBase ? referenceOf(suite, entry.id, counterBase, { scenarios: {} }, known) : undefined);
    const counters = judgeCounters(entry, ref, counterBase ? counterBase.scenarios[entry.id] : undefined);
    const counterValues: { [name: string]: number | null } = {};
    counters.forEach((c: CounterVerdict) => { counterValues[c.name] = c.value; });
    const badCounter = counters.filter((c: CounterVerdict) => c.verdict === "regression")[0];
    const base: Partial<ScenarioVerdict> = { median: entry.median, counters: counters, counterValues: counterValues,
      countersOk: !badCounter && counters.every((c: CounterVerdict) => c.verdict !== "unstable") };
    if (!b) {
      if (badCounter) { verdicts.push(make(entry.id, "counter regression", Object.assign(base, { counter: badCounter.name, counterReference: badCounter.ref as number }))); continue; }
      verdicts.push(make(entry.id, baseline ? "new" : "no reference", base));
      continue;
    }
    const fx = result.fixtures[fixtureKeyOf(entry.id)] || ({} as any);
    if (fx.hash !== b.fixtureHash || fx.dataHash !== b.dataHash || entry.rev !== b.rev || entry.jsonErrors !== b.jsonErrors) {
      const what = fx.hash !== b.fixtureHash || fx.dataHash !== b.dataHash ? "fixture hash" : entry.rev !== b.rev ? "rev " + b.rev + " -> " + entry.rev : "jsonErrors " + b.jsonErrors + " -> " + entry.jsonErrors;
      verdicts.push(make(entry.id, "fixture changed", Object.assign(base, { reason: what, countersOk: false })));
      continue;
    }
    const r = ref as Reference;
    const tol = Math.max(entry.tolerance === null || entry.tolerance === undefined ? defaultTolerance : entry.tolerance, b.noiseTol || 0);
    const change = entry.median / r.time - 1;
    const threshold = Math.max(tol, minDelta / r.time);
    const calibrationRatio = Math.max(entry.calibration.before, entry.calibration.after) / b.calibration;
    Object.assign(base, { reference: r.time, timeSource: r.timeSource, referenceSince: r.since, change: change, threshold: threshold,
      tolerance: tol, calibrationRatio: calibrationRatio });
    const k = knownEntry(known, suite, entry.id);
    const vsPrev = input.previous ? input.previous.results.filter((p: ResultEntry) => p.id === entry.id && p.rev === entry.rev)[0] : undefined;
    if (vsPrev && input.previous && (input.previous.fixtures[fixtureKeyOf(entry.id)] || {}).hash === fx.hash) base.vsPrevious = entry.median / vsPrev.median - 1;
    if (badCounter) {
      verdicts.push(make(entry.id, "counter regression", Object.assign(base, { counter: badCounter.name, counterReference: badCounter.ref as number })));
      continue;
    }
    if (noisy) { verdicts.push(make(entry.id, "noisy", base)); continue; }
    if (b.unstable) { verdicts.push(make(entry.id, "unstable", base)); continue; }
    if (entry.counterOnly || b.counterOnly) {
      verdicts.push(make(entry.id, "counterOnly", Object.assign(base, { judgedOk: !!base.countersOk })));
      continue;
    }
    if (calibrationRatio > calibrationLimit) { verdicts.push(make(entry.id, "slow-process", base)); continue; }
    const isSuspect = entry.median > r.time * (1 + tol) && entry.median - r.time > minDelta;
    const isImproved = entry.median < r.time / (1 + tol) && r.time - entry.median > minDelta;
    const okFrozen = !!k && k.kind === "time" && entry.median <= k.ref * (1 + tol);
    if (isSuspect) verdicts.push(make(entry.id, "suspect", base));
    else verdicts.push(make(entry.id, isImproved ? "improved" : "ok", Object.assign(base, { judgedOk: true, okAgainstFrozen: okFrozen })));
  }
  // missing: in the reference, not run, not skipped, not unrun, and asked for.
  if (baseline) {
    const only = result.requested.only;
    Object.keys(baseline.scenarios).sort().forEach((id: string) => {
      if (seen.has(id) || notRun.has(id)) return;
      if (only && only.indexOf(id) < 0) return;
      const failed = (result.failed || []).filter((f: any) => f.id === id)[0];
      verdicts.push(make(id, "missing", { reason: failed ? "failed: " + String(failed.error).split("\n")[0] : "not in the result" }));
    });
  }
  // The rerun plan and its cap: at most 12 scenarios to rerun (suspects and slow-process) per suite.
  const suspects = verdicts.filter((v: ScenarioVerdict) => v.verdict === "suspect");
  const slow = verdicts.filter((v: ScenarioVerdict) => v.verdict === "slow-process");
  let reruns = suspects.map((v: ScenarioVerdict) => v.id).concat(slow.map((v: ScenarioVerdict) => v.id));
  let suiteNoisy = noisy;
  if (suspects.length + slow.length > rerunCap) {
    if (slow.length === 0) {
      // Clean calibrations: a broad slowdown points at code. Rerun the 6 with the highest ratio.
      reruns = suspects.slice().sort((x: ScenarioVerdict, y: ScenarioVerdict) => (y.change || 0) - (x.change || 0)).slice(0, rerunTop).map((v: ScenarioVerdict) => v.id);
      suspects.forEach((v: ScenarioVerdict) => v.tags.push("whole-suite-candidate"));
    } else {
      // High calibrations: the machine, not the code. Times are not judged and nothing is rerun.
      suiteNoisy = true;
      suspects.concat(slow).forEach((v: ScenarioVerdict) => { v.verdict = "noisy"; v.reason = "over the rerun cap with high calibrations"; });
      reruns = [];
    }
  }
  return { suite: suite, machineKey: result.machine.key, newMachineKey: !baseline, verdicts: verdicts, reruns: reruns, noisy: suiteNoisy,
    failed: verdicts.some((v: ScenarioVerdict) => failingVerdicts.indexOf(v.verdict) > -1) };
}

// The second pass, after the reruns (twice, at the end of the night, same build): a suspect is a regression when it is
// a suspect again in both reruns, each with a calibration within 1.15; unconfirmed when a rerun was slow-process.
export function finalize(first: Comparison, input: CompareInput, reruns: Array<ResultFile>): Comparison {
  reruns.forEach((r: ResultFile) => {
    if (!sameBuild(r, input.result)) throw new Error("a rerun with a different build is refused: " + r.date);
  });
  const again = reruns.map((r: ResultFile) => judge(Object.assign({}, input, { result: r })));
  // Copies: the first comparison is not changed.
  const verdicts = first.verdicts.map((x: ScenarioVerdict) => Object.assign({}, x, { tags: x.tags.slice() })).map((v: ScenarioVerdict): ScenarioVerdict => {
    if (v.verdict !== "suspect" && v.verdict !== "slow-process") return v;
    // Over the cap, a suspect that was not rerun is decided by the whole-suite rule below.
    if (first.reruns.indexOf(v.id) < 0) return v;
    const runs = again.map((c: Comparison) => c.verdicts.filter((x: ScenarioVerdict) => x.id === v.id)[0]).filter((x: any) => !!x);
    const out = Object.assign({}, v, { rerunMedians: runs.map((x: ScenarioVerdict) => x.median as number) });
    if (runs.length < 2) return Object.assign(out, { verdict: "unconfirmed" as Verdict, reason: "fewer than two reruns" });
    if (v.verdict === "slow-process") {
      // A slow first run: judged on its reruns, which must both be clean.
      if (runs.some((x: ScenarioVerdict) => x.verdict === "slow-process")) return Object.assign(out, { verdict: "unconfirmed" as Verdict, reason: "rerun slow-process" });
      if (runs.every((x: ScenarioVerdict) => x.verdict === "suspect")) return Object.assign(out, { verdict: "regression" as Verdict });
      return Object.assign(out, { verdict: runs.every((x: ScenarioVerdict) => x.verdict === "improved") ? "improved" as Verdict : "ok" as Verdict,
        judgedOk: true, okAgainstFrozen: runs.every((x: ScenarioVerdict) => x.okAgainstFrozen) });
    }
    if (runs.some((x: ScenarioVerdict) => x.verdict === "slow-process")) return Object.assign(out, { verdict: "unconfirmed" as Verdict, reason: "rerun slow-process" });
    if (runs.every((x: ScenarioVerdict) => x.verdict === "suspect")) return Object.assign(out, { verdict: "regression" as Verdict });
    return Object.assign(out, { verdict: "ok" as Verdict, reason: "not confirmed by the reruns" });
  });
  // The cap: when the top suspects are confirmed, every suspect of the suite is a whole-suite regression.
  const candidates = verdicts.filter((v: ScenarioVerdict) => v.tags.indexOf("whole-suite-candidate") > -1);
  if (candidates.length > 0) {
    const rerun = candidates.filter((v: ScenarioVerdict) => first.reruns.indexOf(v.id) > -1);
    const confirmed = rerun.filter((v: ScenarioVerdict) => v.verdict === "regression");
    candidates.forEach((v: ScenarioVerdict) => {
      v.tags = v.tags.filter((t: string) => t !== "whole-suite-candidate");
      if (confirmed.length > 0 && confirmed.length === rerun.length) {
        v.verdict = "regression";
        v.tags.push("whole-suite");
      } else if (first.reruns.indexOf(v.id) < 0) {
        v.verdict = "unconfirmed";
        v.reason = "over the rerun cap";
      }
    });
  }
  return Object.assign({}, first, { verdicts: verdicts, reruns: [],
    failed: verdicts.some((v: ScenarioVerdict) => failingVerdicts.indexOf(v.verdict) > -1) });
}

const pct = (v: number | undefined): string => (v === undefined || !isFinite(v) ? "" : (v >= 0 ? "+" : "") + (v * 100).toFixed(1) + "%");
const ms = (v: number | undefined): string => (v === undefined || isNaN(v) ? "" : String(Math.round(v * 100) / 100));

export function markdownTable(c: Comparison): string {
  const lines = ["| scenario | reference | median | change | threshold | vs previous | verdict | rerun medians |", "|---|---|---|---|---|---|---|---|"];
  c.verdicts.forEach((v: ScenarioVerdict) => {
    const ref = v.reference === undefined ? "" : ms(v.reference) + (v.timeSource && v.timeSource !== "baseline" ? " (" + v.timeSource + (v.referenceSince ? " since " + v.referenceSince.slice(0, 10) : "") + ")" : "");
    const counter = v.counter ? " (" + v.counter + " " + v.counters.filter((x: CounterVerdict) => x.name === v.counter).map((x: CounterVerdict) => x.ref + " -> " + x.value)[0] + ")" : "";
    const notes = v.counters.filter((x: CounterVerdict) => x.verdict === "dom-note").map((x: CounterVerdict) => " DOM " + pct(x.change)).join("");
    lines.push("| " + v.id + " | " + ref + " | " + ms(v.median) + " | " + pct(v.change) + " | " + pct(v.threshold) + " | " + pct(v.vsPrevious) +
      " | " + v.verdict + counter + notes + (v.tags.length ? " [" + v.tags.join(", ") + "]" : "") + (v.reason ? " (" + v.reason + ")" : "") + " | " +
      (v.rerunMedians || []).map(ms).join(", ") + " |");
  });
  return lines.join("\n");
}

export function compareFileOf(resultFile: string, suite: string): string {
  return path.join(path.dirname(resultFile), suite + "-compare.json");
}

export function loadInput(resultFile: string, stateDir: string, previousFile?: string): CompareInput {
  const result = readResult(resultFile);
  const baseline = readBaseline(baselineFile(stateDir, result.suite, result.machine.key));
  const newest = baseline ? undefined : newestBaseline(stateDir, result.suite);
  return { result: result, baseline: baseline, counterBaseline: newest ? readBaseline(newest) : undefined,
    ratchet: readRatchet(stateDir, result.suite, result.machine.key), known: readKnown(stateDir), previous: previousFile ? readResult(previousFile) : undefined };
}

// node perf/harness/node/compare.ts <result.json> [--reruns <a.json>,<b.json>] [--previous <p.json>]
// Prints the table, writes <suite>-compare.json next to the result, exits 1 on a failing verdict.
function main(): void {
  const args = process.argv.slice(2);
  const opt = (name: string): string | undefined => { const i = args.indexOf(name); return i > -1 ? args[i + 1] : undefined; };
  const file = args[0];
  if (!file || !fs.existsSync(file)) throw new Error("usage: compare.ts <result.json> [--reruns a.json,b.json] [--previous p.json]");
  const env = readEnv();
  const input = loadInput(file, env.stateDir, opt("--previous"));
  let c = judge(input);
  const rerunFiles = opt("--reruns");
  if (rerunFiles) c = finalize(c, input, rerunFiles.split(",").map(readResult));
  console.log(markdownTable(c));
  if (c.reruns.length) console.log("\nreruns: " + c.reruns.join(","));
  if (c.newMachineKey) console.log("\nno baseline for " + c.machineKey + ": counters against the newest baseline of " + c.suite + ", times not judged");
  writeJsonAtomic(compareFileOf(file, c.suite), c);
  if (c.failed) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
