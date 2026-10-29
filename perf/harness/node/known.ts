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

export interface KnownState {
  entries: { [suite: string]: { [id: string]: KnownEntry } };
  lastOk: { [suite: string]: { [id: string]: string } };
}

export function emptyKnown(): KnownState {
  return { entries: {}, lastOk: {} };
}

export function readKnown(stateDir: string): KnownState {
  const k = readJson<KnownState>(knownFile(stateDir), emptyKnown());
  return { entries: k.entries || {}, lastOk: k.lastOk || {} };
}

export function writeKnown(stateDir: string, known: KnownState): void {
  writeJson(knownFile(stateDir), known);
}

export function knownEntry(known: KnownState, suite: string, id: string): KnownEntry | undefined {
  return (known.entries[suite] || {})[id];
}

export interface KnownChange {
  added: Array<{ id: string, entry: KnownEntry }>;
  still: Array<{ id: string, entry: KnownEntry }>;
  removed: Array<string>;
}

// Applies one judged night to the state:
// * a scenario judged ok (not noisy, not slow-process) records the night's commit as its lastOkCommit, and an open
//   entry is removed when the night is ok against the entry's frozen ref;
// * a new regression gets an entry with the bisect range lastOkCommit..current;
// * a known one is "still regressed", with no new bisect.
export function applyNight(known: KnownState, suite: string, verdicts: Array<any>, commit: string | null, date: string): KnownChange {
  const entries = known.entries[suite] = known.entries[suite] || {};
  const lastOk = known.lastOk[suite] = known.lastOk[suite] || {};
  const change: KnownChange = { added: [], still: [], removed: [] };
  for (const v of verdicts) {
    const entry = entries[v.id];
    if (v.okAgainstFrozen && entry) {
      delete entries[v.id];
      change.removed.push(v.id);
    }
    if (v.judgedOk && commit) lastOk[v.id] = commit;
    if (v.verdict === "regression" || v.verdict === "counter regression") {
      if (entries[v.id]) {
        change.still.push({ id: v.id, entry: entries[v.id] });
      } else {
        const added: KnownEntry = { kind: v.verdict === "regression" ? "time" : "counter", ref: v.verdict === "regression" ? v.reference : v.counterReference,
          since: date, sinceCommit: commit, lastOkCommit: lastOk[v.id] || null };
        if (v.counter) added.counter = v.counter;
        entries[v.id] = added;
        change.added.push({ id: v.id, entry: added });
      }
    }
  }
  return change;
}
