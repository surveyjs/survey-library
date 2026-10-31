import { knownFile, readJson, writeJson } from "./state.ts";

// The known-regression state (D16): open regressions with their frozen reference and bisect range, and the last
// commit where each scenario was judged ok. Writes are atomic.
export interface KnownEntry {
  kind: "time" | "counter";
  // The frozen reference: a regression never becomes the reference (D19).
  ref: number;
  counter?: string;
  since: string;
  sinceCommit: string | null;
  lastOkCommit: string | null;
  firstBad?: { sha: string, pr: number | null };
  bisect?: "done" | "narrowed" | "not-reproduced" | "not-in-range" | "skipped";
}

// entries: a time entry is keyed by the scenario id, a counter entry by "<id>#<counter>", so both can be open at once.
// lastOkCounters: the last commit whose counters were all ok, for counter ranges (unstable and noisy nights judge
// counters too).
export interface KnownState {
  entries: { [suite: string]: { [key: string]: KnownEntry } };
  lastOk: { [suite: string]: { [id: string]: string } };
  lastOkCounters: { [suite: string]: { [id: string]: string } };
}

export function emptyKnown(): KnownState {
  return { entries: {}, lastOk: {}, lastOkCounters: {} };
}

export function readKnown(stateDir: string): KnownState {
  const k = readJson<KnownState>(knownFile(stateDir), emptyKnown());
  return { entries: k.entries || {}, lastOk: k.lastOk || {}, lastOkCounters: k.lastOkCounters || {} };
}

export function writeKnown(stateDir: string, known: KnownState): void {
  writeJson(knownFile(stateDir), known);
}

export function entryKey(id: string, kind: "time" | "counter", counter?: string): string {
  return kind === "time" ? id : id + "#" + counter;
}

// The open time entry of a scenario.
export function knownEntry(known: KnownState, suite: string, id: string): KnownEntry | undefined {
  return (known.entries[suite] || {})[id];
}

// Every open entry of a scenario: its time entry and its counter entries.
export function knownEntries(known: KnownState, suite: string, id: string): Array<{ key: string, entry: KnownEntry }> {
  const all = known.entries[suite] || {};
  return Object.keys(all).filter((key: string) => key === id || key.indexOf(id + "#") === 0).map((key: string) => ({ key: key, entry: all[key] }));
}

// A renewed baseline accepts the scenarios' current values (04, Removal): their entries go, and their last ok commits
// start at the commit the baseline was recorded on. A full renewal (ids undefined) removes every entry of the suite.
export function renewKnown(known: KnownState, suite: string, commits: { [id: string]: string | null | undefined }, ids?: Array<string>): Array<string> {
  const entries = known.entries[suite] || {};
  const removed = Object.keys(entries).filter((key: string) => !ids || ids.indexOf(key.split("#")[0]) > -1);
  removed.forEach((key: string) => { delete entries[key]; });
  const lastOk = known.lastOk[suite] = known.lastOk[suite] || {};
  const lastOkCounters = known.lastOkCounters[suite] = known.lastOkCounters[suite] || {};
  Object.keys(commits).forEach((id: string) => {
    const commit = commits[id];
    if (commit) lastOk[id] = lastOkCounters[id] = commit;
  });
  return removed;
}

export interface KnownChange {
  added: Array<{ id: string, entry: KnownEntry }>;
  still: Array<{ id: string, entry: KnownEntry }>;
  removed: Array<string>;
}

// Applies one judged night to the state:
// * a scenario judged ok (not noisy, not slow-process) records the night's commit as its lastOkCommit; all its counters
//   ok record it for counter ranges;
// * a time entry is removed when the night is ok against its frozen ref, a counter entry when that counter is ok
//   against its frozen ref (the reference carries it);
// * a new regression gets an entry with the bisect range lastOkCommit..current;
// * a known one is "still regressed", with no new bisect.
export function applyNight(known: KnownState, suite: string, verdicts: Array<any>, commit: string | null, date: string): KnownChange {
  const entries = known.entries[suite] = known.entries[suite] || {};
  const lastOk = known.lastOk[suite] = known.lastOk[suite] || {};
  const lastOkCounters = known.lastOkCounters[suite] = known.lastOkCounters[suite] || {};
  const change: KnownChange = { added: [], still: [], removed: [] };
  for (const v of verdicts) {
    knownEntries(known, suite, v.id).forEach((open: { key: string, entry: KnownEntry }) => {
      const fixed = open.entry.kind === "time" ? v.okAgainstFrozen : v.verdict !== "fixture changed" &&
        (v.counters || []).some((c: any) => c.name === open.entry.counter && (c.verdict === "ok" || c.verdict === "dom-note"));
      if (!fixed) return;
      delete entries[open.key];
      change.removed.push(open.key);
    });
    if (v.judgedOk && commit) lastOk[v.id] = commit;
    if (v.countersOk && commit) lastOkCounters[v.id] = commit;
    if (v.verdict === "regression" || v.verdict === "counter regression") {
      const kind = v.verdict === "regression" ? "time" : "counter";
      const key = entryKey(v.id, kind, v.counter);
      if (entries[key]) {
        change.still.push({ id: v.id, entry: entries[key] });
      } else {
        const added: KnownEntry = { kind: kind, ref: kind === "time" ? v.reference : v.counterReference, since: date, sinceCommit: commit,
          lastOkCommit: (kind === "counter" ? lastOkCounters[v.id] || lastOk[v.id] : lastOk[v.id]) || null };
        if (v.counter) added.counter = v.counter;
        entries[key] = added;
        change.added.push({ id: v.id, entry: added });
      }
    }
  }
  return change;
}
