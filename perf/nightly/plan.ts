import type { Suite } from "../harness/ids.ts";
import { SUITES, splitOnly, suitesOf, isExtraId } from "../harness/ids.ts";
import type { ResultFile } from "../harness/node/result.ts";
import type { ScenarioVerdict } from "../harness/node/compare.ts";

// The pure parts of a night (05): which suites run with which ids, the rerun order, last-nightly.json, the bisect choice.

// --only split per suite with ids.ts: only suites with a match run; an id in none of the requested suites is an error.
export function planSuites(only: Array<string> | null, suites: Array<Suite>): Array<{ suite: Suite, only: Array<string> | null }> {
  const order = SUITES.filter((s: Suite) => suites.indexOf(s) > -1);
  const unknown = suites.filter((s: string) => SUITES.indexOf(s as Suite) < 0);
  if (unknown.length) throw new Error("unknown suites: " + unknown.join(", "));
  if (!only) return order.map((s: Suite) => ({ suite: s, only: null }));
  const outside = only.filter((id: string) => !isExtraId(id) && !suitesOf(id).some((s: Suite) => order.indexOf(s) > -1));
  if (outside.length) throw new Error("--only names ids in none of the suites " + order.join(",") + ": " + outside.join(", "));
  return order.map((s: Suite) => ({ suite: s, only: splitOnly(only, s).run })).filter((p: { only: Array<string> }) => p.only.length > 0);
}

// The environment a rerun gets: the judged run's target builds (04, Reruns: a rerun with another build is refused).
export function rerunEnv(result: ResultFile): { [name: string]: string } {
  const env: { [name: string]: string } = { PERF_CORE_DIR: result.build.core.dir };
  if (result.build.ui) env.PERF_UI_DIR = result.build.ui.dir;
  if (result.build.core.commit) env.PERF_TARGET_COMMIT = result.build.core.commit;
  return env;
}

export interface RerunStep {
  suite: Suite;
  // The ids to rerun, or "calibration" for the spacer process.
  ids: Array<string> | "calibration";
  round: number;
  env: { [name: string]: string };
}

// After all suites: every suite's reruns twice, round 1 for every suite, then round 2, so other scenarios run between a
// scenario's two reruns. With a single suspect in the whole night, a calibration-only process is the spacer.
export function planReruns(judged: Array<{ suite: Suite, reruns: Array<string>, result: ResultFile }>): Array<RerunStep> {
  const withReruns = judged.filter((j: { reruns: Array<string> }) => j.reruns.length > 0);
  const steps: Array<RerunStep> = [];
  const total = withReruns.reduce((n: number, j: { reruns: Array<string> }) => n + j.reruns.length, 0);
  for (let round = 1; round <= 2; round++) {
    withReruns.forEach((j: { suite: Suite, reruns: Array<string>, result: ResultFile }) => steps.push({ suite: j.suite, ids: j.reruns.slice(), round: round, env: rerunEnv(j.result) }));
    if (round === 1 && total === 1) steps.push({ suite: withReruns[0].suite, ids: "calibration", round: 1, env: rerunEnv(withReruns[0].result) });
  }
  return steps;
}

// <state>/last-nightly.json (05, State): lastRun moves on every nightly and gives the commit range of the post;
// lastJudged moves only when that suite ran completely, was not noisy and had a reference.
export interface LastNightly {
  lastRun: { commit: string, date: string, runId: string } | null;
  suites: { [suite: string]: { lastJudged: { commit: string, date: string, result: string } } };
}

export interface NightSuite {
  suite: string;
  complete: boolean;
  noisy: boolean;
  hasReference: boolean;
  result: string;
}

export function nextLastNightly(prev: LastNightly | null, night: { kind: string, commit: string, date: string, runId: string, suites: Array<NightSuite> }): LastNightly {
  const res: LastNightly = { lastRun: prev ? prev.lastRun : null, suites: Object.assign({}, prev ? prev.suites : {}) };
  if (night.kind !== "nightly") return res;
  res.lastRun = { commit: night.commit, date: night.date, runId: night.runId };
  night.suites.forEach((s: NightSuite) => {
    if (s.complete && !s.noisy && s.hasReference) res.suites[s.suite] = { lastJudged: { commit: night.commit, date: night.date, result: s.result } };
  });
  return res;
}

export interface BisectCandidate {
  suite: Suite;
  id: string;
  verdict: ScenarioVerdict;
  lastOkCommit: string | null;
  counter?: string;
}

const suiteCost: { [suite: string]: number } = { "core": 0, "survey-js-ui": 1, "react": 2 };

// The cheapest suite that shows a regression: core before survey-js-ui before react; a browser suite only when core has
// no regression for that operation (the same id). A whole-suite regression bisects its confirmed scenario with the
// highest ratio, once. At most `max` bisects a night; the rest are skipped (budget).
export function chooseBisects(candidates: Array<BisectCandidate>, max: number = 2): { chosen: Array<BisectCandidate>, skipped: Array<{ c: BisectCandidate, reason: string }> } {
  const sorted = candidates.slice().sort((a: BisectCandidate, b: BisectCandidate) => suiteCost[a.suite] - suiteCost[b.suite] ||
    (a.counter ? 0 : 1) - (b.counter ? 0 : 1) || (b.verdict.change || 0) - (a.verdict.change || 0));
  const chosen: Array<BisectCandidate> = [];
  const skipped: Array<{ c: BisectCandidate, reason: string }> = [];
  const wholeSuite = new Set<string>();
  for (const c of sorted) {
    const covered = chosen.concat(skipped.map((s: { c: BisectCandidate }) => s.c)).filter((x: BisectCandidate) => x.id === c.id && x.suite !== c.suite)[0];
    if (covered) { skipped.push({ c: c, reason: "bisected in " + covered.suite }); continue; }
    const whole = c.verdict.tags.indexOf("whole-suite") > -1;
    if (whole && wholeSuite.has(c.suite)) { skipped.push({ c: c, reason: "whole-suite: one scenario is bisected" }); continue; }
    if (whole && !(c.verdict.rerunMedians && c.verdict.rerunMedians.length)) { skipped.push({ c: c, reason: "whole-suite: not rerun" }); continue; }
    if (chosen.length >= max) { skipped.push({ c: c, reason: "budget: at most " + max + " bisects a night" }); continue; }
    if (whole) wholeSuite.add(c.suite);
    chosen.push(c);
  }
  return { chosen: chosen, skipped: skipped };
}
