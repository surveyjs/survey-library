import { median } from "../stats.ts";

// The bisect step rule (04, D16), used by 05's bisect.ts. A measure function returns the medians of fresh runs of one
// scenario on one commit; the runner's perf/ stays the same, only the target build changes.
export type Measure = (commit: string) => Promise<number>;

export interface BisectStep {
  commit: string;
  medians: Array<number>;
  median: number;
  bad?: boolean;
}

export interface BisectResult {
  result: "found" | "not-reproduced" | "not-in-range";
  message: string;
  firstBad?: string;
  lastGood?: string;
  good?: BisectStep;
  bad?: BisectStep;
  steps: Array<BisectStep>;
}

export interface BisectOptions {
  // The reference and tolerance of the scenario, for the endpoint verdicts.
  reference: number;
  tolerance: number;
  runs?: number;
  // A counter regression: one run per step, bad above the good end x 1.02.
  counter?: boolean;
}

// A step is bad when its median is past the geometric midpoint of the two ends: ln(step) > (ln(good) + ln(bad)) / 2.
// (Judging against the baseline with 3-of-3 would call a +30% commit good about 60% of the time.)
export function isBadStep(step: number, good: number, bad: number): boolean {
  return Math.log(step) > (Math.log(good) + Math.log(bad)) / 2;
}

export function isBadCounterStep(value: number, good: number): boolean {
  return value > good * 1.02;
}

// The ends differ when the ratio of their medians is at least 1 + tol / 2. When they do not: the bad end not slow now
// is "not reproduced"; a good end that is slow too is "not in range" (an environment or dependency change).
export function judgeEnds(good: number, bad: number, reference: number, tolerance: number, counter?: boolean): "differ" | "not-reproduced" | "not-in-range" {
  if (counter) {
    if (isBadCounterStep(bad, good)) return "differ";
    return bad <= reference * 1.02 ? "not-reproduced" : "not-in-range";
  }
  if (bad / good >= 1 + tolerance / 2) return "differ";
  return bad < reference * (1 + tolerance) ? "not-reproduced" : "not-in-range";
}

// commits: first-parent order, oldest first; commits[0] is the good end (lastOkCommit), the last one the bad end.
export async function bisect(commits: Array<string>, measure: Measure, options: BisectOptions): Promise<BisectResult> {
  const runs = options.counter ? 1 : (options.runs || 3);
  const range = commits[0].substring(0, 9) + ".." + commits[commits.length - 1].substring(0, 9);
  // The ends first, in the same session, alternating good and bad.
  const goodMedians: Array<number> = [];
  const badMedians: Array<number> = [];
  for (let i = 0; i < runs; i++) {
    goodMedians.push(await measure(commits[0]));
    badMedians.push(await measure(commits[commits.length - 1]));
  }
  const good: BisectStep = { commit: commits[0], medians: goodMedians, median: median(goodMedians) };
  const bad: BisectStep = { commit: commits[commits.length - 1], medians: badMedians, median: median(badMedians) };
  const ends = judgeEnds(good.median, bad.median, options.reference, options.tolerance, options.counter);
  if (ends === "not-reproduced") return { result: ends, message: "not reproduced in " + range, good: good, bad: bad, steps: [] };
  if (ends === "not-in-range") return { result: ends, message: "regression is not in " + range + ": environment or dependency change", good: good, bad: bad, steps: [] };
  let lo = 0;
  let hi = commits.length - 1;
  const steps: Array<BisectStep> = [];
  while(hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    const medians: Array<number> = [];
    for (let i = 0; i < runs; i++) medians.push(await measure(commits[mid]));
    const step: BisectStep = { commit: commits[mid], medians: medians, median: median(medians) };
    step.bad = options.counter ? isBadCounterStep(step.median, good.median) : isBadStep(step.median, good.median, bad.median);
    steps.push(step);
    if (step.bad) hi = mid; else lo = mid;
  }
  return { result: "found", message: "first bad " + commits[hi].substring(0, 9), firstBad: commits[hi], lastGood: commits[lo], good: good, bad: bad, steps: steps };
}
