import { median } from "../stats.ts";
import type { Baseline } from "./baseline.ts";
import type { KnownState } from "./known.ts";
import { knownEntry } from "./known.ts";
import { ratchetFile, readJson, writeJson } from "./state.ts";

// The reference a run is judged against (D19): the baseline, the ratchet after improvements, or the value frozen in
// known.json while a regression is open. Counters keep a running minimum over ok nights.
export interface RatchetScenario {
  // The last nightly medians judged ok or improved for this scenario, with the same key, hash and rev.
  okNights: Array<{ date: string, median: number }>;
  rolling?: { value: number, since: string };
  counters: { [name: string]: number };
}

export interface Ratchet {
  scenarios: { [id: string]: RatchetScenario };
}

export function readRatchet(stateDir: string, suite: string, machineKey: string): Ratchet {
  return readJson<Ratchet>(ratchetFile(stateDir, suite, machineKey), { scenarios: {} });
}

export function writeRatchet(stateDir: string, suite: string, machineKey: string, ratchet: Ratchet): void {
  writeJson(ratchetFile(stateDir, suite, machineKey), ratchet);
}

export interface Reference {
  time: number;
  timeSource: "baseline" | "rolling" | "frozen";
  since?: string;
  counters: { [name: string]: number | null };
}

export function referenceOf(suite: string, id: string, baseline: Baseline, ratchet: Ratchet, known: KnownState): Reference | undefined {
  const b = baseline.scenarios[id];
  if (!b) return undefined;
  const r = ratchet.scenarios[id];
  const counters: { [name: string]: number | null } = {};
  for (const name in b.counters) {
    const fromRatchet = r && r.counters[name] !== undefined ? r.counters[name] : undefined;
    counters[name] = fromRatchet !== undefined ? fromRatchet : b.counters[name].value;
  }
  const k = knownEntry(known, suite, id);
  if (k && k.kind === "counter" && k.counter) counters[k.counter] = k.ref;
  if (k && k.kind === "time") return { time: k.ref, timeSource: "frozen", since: k.since, counters: counters };
  if (r && r.rolling && r.rolling.value < b.median) return { time: r.rolling.value, timeSource: "rolling", since: r.rolling.since, counters: counters };
  return { time: b.median, timeSource: "baseline", counters: counters };
}

// After a nightly: the time ratchet moves only down, once the last 3 ok nights are all below baseline / (1 + tol);
// the counter minimum moves over ok nights. A scenario in known.json is frozen.
export function advanceRatchet(ratchet: Ratchet, baseline: Baseline, known: KnownState, suite: string, verdicts: Array<any>, date: string): void {
  for (const v of verdicts) {
    const b = baseline.scenarios[v.id];
    if (!b || knownEntry(known, suite, v.id)) continue;
    const r = ratchet.scenarios[v.id] = ratchet.scenarios[v.id] || { okNights: [], counters: {} };
    if (v.verdict === "ok" || v.verdict === "improved") {
      r.okNights.push({ date: date, median: v.median });
      r.okNights = r.okNights.slice(-3);
      const tol = v.tolerance;
      if (r.okNights.length === 3 && r.okNights.every((n: any) => n.median < b.median / (1 + tol))) {
        const m = median(r.okNights.map((n: any) => n.median));
        if (!r.rolling || m < r.rolling.value) r.rolling = { value: m, since: date };
      }
    }
    if (v.countersOk) {
      for (const name in v.counterValues) {
        const value = v.counterValues[name];
        if (typeof value !== "number") continue;
        const ref = r.counters[name] !== undefined ? r.counters[name] : (b.counters[name] ? b.counters[name].value : null);
        if (ref === null || value < ref) r.counters[name] = value;
      }
    }
  }
}
