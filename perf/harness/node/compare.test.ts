import { describe, test, expect } from "vitest";
import { buildBaseline, noiseTolerance } from "./baseline.ts";
import type { Baseline } from "./baseline.ts";
import { judge, finalize, markdownTable } from "./compare.ts";
import type { Comparison } from "./compare.ts";
import { advanceRatchet, referenceOf } from "./reference.ts";
import type { Ratchet } from "./reference.ts";
import { emptyKnown, applyNight, renewKnown } from "./known.ts";
import { bisect, isBadStep, judgeEnds } from "./bisect-step.ts";
import { canonical } from "./state.ts";

// Hand-made result files (04, Checks): every verdict, the new-key path, only / skipped / incomplete against missing, a
// changed rev, the ratchet, the cap, known.json, the bisect step rule.
const KEY = "test-machine";
function entry(id: string, median: number, extra?: any): any {
  return Object.assign({ id: id, rev: 1, unit: "ms", samples: [median], median: median, min: median, max: median, mad: 0,
    calibration: { median: 10, before: 10, after: 10 }, counters: { expressionRuns: { value: 100, kind: "work" }, domNodes: { value: 1000, kind: "dom" } },
    info: {}, jsonErrors: 0, tolerance: null, local: false }, extra || {});
}
function result(entries: Array<any>, extra?: any): any {
  const fixtures: any = {};
  entries.forEach((e: any) => { fixtures[e.id.split("/")[0]] = { hash: "h-" + e.id.split("/")[0], options: {} }; });
  return Object.assign({ schema: 1, suite: "core", kind: "nightly", label: "nightly", ref: null, commit: "c1", previousCommit: null, date: "2026-10-29T03:00:00.000Z",
    requested: { only: null, notInSuite: [] }, incomplete: null, build: { core: { dir: "/b", version: "1", commit: "t1", mtime: "m" }, deps: { fingerprint: null, versions: {} } },
    machine: { key: KEY }, environment: null, fixtures: fixtures, skipped: [], failed: [], results: entries }, extra || {});
}
const ids = ["large/load/model", "expressions/load/model", "calculations/load/model", "manyPages/load/model", "complexLogic/load/model"];
function baselineOf(medians: { [id: string]: number }): Baseline {
  const runs = [0, 1, 2, 3, 4].map((i: number) => result(Object.keys(medians).map((id: string) => entry(id, medians[id] * (1 + (i - 2) * 0.01))), { kind: "record" }));
  return buildBaseline(runs).baseline;
}
const verdictOf = (c: Comparison, id: string): any => c.verdicts.filter((v: any) => v.id === id)[0];

describe("baseline", () => {
  test("median of run medians, sigma of ln, noise tolerance, dropped slow runs, refusals", () => {
    expect(noiseTolerance(0.03)).toEqual({ noiseTol: 0.1, unstable: false });
    expect(noiseTolerance(0.2)).toEqual({ noiseTol: 0.5, unstable: true });
    const runs = [100, 102, 98, 101, 99].map((m: number, i: number) => result([entry("large/load/model", m, i === 4 ? { calibration: { median: 13, before: 13, after: 13 } } : {})], { kind: "record" }));
    const b = buildBaseline(runs);
    const s = b.baseline.scenarios["large/load/model"];
    expect(s.runs).toBe(4);
    expect(s.droppedRuns).toBe(1);
    expect(s.median).toBe(100.5);
    expect(s.min).toBe(98);
    expect(b.rerecord).toEqual([]);
    expect(() => buildBaseline([result([]), result([], { machine: { key: "other" } })])).toThrow(/mixed machine keys/);
    expect(() => buildBaseline([result([], { environment: { noisy: true, noisyReasons: ["gate-timeout"] } })])).toThrow(/noisy/);
    expect(() => buildBaseline([result([], { kind: "local" })])).toThrow(/local/);
    expect(() => buildBaseline([result([entry("large/load/model", 1)]), result([entry("large/load/model", 1, { rev: 2 })])])).toThrow(/mixed fixture/);
    // Two slow runs of five: fewer than 4 left, recorded again.
    const slow = [100, 102, 98, 101, 99].map((m: number, i: number) => result([entry("large/load/model", m, i > 2 ? { calibration: { median: 14, before: 14, after: 14 } } : {})], { kind: "record" }));
    expect(buildBaseline(slow).rerecord).toEqual(["large/load/model"]);
    // Four slow runs of five do not keep each other: the fast end decides, and the baseline is not a slow one.
    const mostlySlow = [300, 302, 100, 301, 299].map((m: number, i: number) => result([entry("large/load/model", m, i !== 2 ? { calibration: { median: 27, before: 27, after: 27 } } : {})], { kind: "record" }));
    const ms = buildBaseline(mostlySlow);
    expect(ms.baseline.scenarios["large/load/model"]).toMatchObject({ runs: 1, droppedRuns: 4, median: 100, unstable: true });
    expect(ms.rerecord).toEqual(["large/load/model"]);
    expect(s.commit).toBe("t1");
    expect(Object.keys(canonical({ b: 1.234, a: [2.345] }))).toEqual(["a", "b"]);
    expect(canonical({ sigma: 0.012345, median: 1.23456 })).toEqual({ median: 1.23, sigma: 0.0123 });
  });
  test("a counter that differs between the runs is unstable", () => {
    const runs = [0, 1, 2, 3, 4].map((i: number) => result([entry("large/load/model", 100, { counters: { expressionRuns: { value: 100 + (i % 2), kind: "work" } } })], { kind: "record" }));
    expect(buildBaseline(runs).baseline.scenarios["large/load/model"].counters.expressionRuns.unstable).toBe(true);
  });
});

describe("compare: the verdict table", () => {
  const base = baselineOf({ "large/load/model": 100, "expressions/load/model": 100, "calculations/load/model": 100, "manyPages/load/model": 100, "complexLogic/load/model": 100,
    "records-1k/load/model": 100, "records-10k/load/model": 100 });
  test("ok, improved, suspect, slow-process, counter regressions, DOM note, new, skipped, not-run, missing, fixture changed", () => {
    const r = result([
      entry("large/load/model", 110),
      entry("expressions/load/model", 70),
      entry("calculations/load/model", 130),
      entry("manyPages/load/model", 140, { calibration: { median: 12, before: 10, after: 12 } }),
      entry("complexLogic/load/model", 100, { counters: { expressionRuns: { value: 103, kind: "work" }, domNodes: { value: 1100, kind: "dom" } } }),
      entry("records-1k/load/model", 100, { rev: 2 }),
      entry("manyPages/pages/next10", 30)
    ], { skipped: [{ id: "records-10k/load/model", reason: "not in this build: matrixdynamic.pageSize" }] });
    const c = judge({ result: r, baseline: base });
    expect(verdictOf(c, "large/load/model").verdict).toBe("ok");
    expect(verdictOf(c, "expressions/load/model").verdict).toBe("improved");
    expect(verdictOf(c, "calculations/load/model").verdict).toBe("suspect");
    expect(verdictOf(c, "manyPages/load/model").verdict).toBe("slow-process");
    expect(verdictOf(c, "complexLogic/load/model").verdict).toBe("counter regression");
    expect(verdictOf(c, "complexLogic/load/model").counters.filter((x: any) => x.name === "domNodes")[0].verdict).toBe("dom-note");
    expect(verdictOf(c, "records-1k/load/model").verdict).toBe("fixture changed");
    expect(verdictOf(c, "manyPages/pages/next10").verdict).toBe("new");
    expect(verdictOf(c, "records-10k/load/model").verdict).toBe("skipped");
    expect(c.reruns.sort()).toEqual(["calculations/load/model", "manyPages/load/model"]);
    expect(c.failed).toBe(true);
    // A small difference under minDelta is not a suspect, whatever the ratio.
    const tiny = judge({ result: result([entry("large/load/model", 1.5)]), baseline: baselineOf({ "large/load/model": 1 }) });
    expect(verdictOf(tiny, "large/load/model").verdict).toBe("ok");
    // A dom counter fails only above x1.5 and +200.
    const dom = judge({ result: result([entry("large/load/model", 100, { counters: { domNodes: { value: 1600, kind: "dom" } } })]), baseline: base });
    expect(verdictOf(dom, "large/load/model").verdict).toBe("counter regression");
  });
  test("missing against not-run, only and skipped; a jsonErrors change is a changed fixture", () => {
    const r = result([entry("large/load/model", 100, { jsonErrors: 3 })], {
      requested: { only: null, notInSuite: ["manyPages/load/model"] },
      incomplete: { reason: "timeout", unrun: ["calculations/load/model"] },
      skipped: [{ id: "records-1k/load/model", reason: "x" }], failed: [{ id: "complexLogic/load/model", error: "check failed: y" }]
    });
    const c = judge({ result: r, baseline: base });
    expect(verdictOf(c, "large/load/model").verdict).toBe("fixture changed");
    expect(verdictOf(c, "manyPages/load/model").verdict).toBe("not-run");
    expect(verdictOf(c, "calculations/load/model").verdict).toBe("not-run");
    expect(verdictOf(c, "records-1k/load/model").verdict).toBe("skipped");
    expect(verdictOf(c, "complexLogic/load/model").verdict).toBe("missing");
    expect(verdictOf(c, "complexLogic/load/model").reason).toContain("failed");
    expect(verdictOf(c, "expressions/load/model").verdict).toBe("missing");
    // With only, a scenario not asked for is not missing.
    const only = judge({ result: result([entry("large/load/model", 100)], { requested: { only: ["large/load/model"], notInSuite: [] } }), baseline: base });
    expect(only.verdicts.map((v: any) => v.verdict)).toEqual(["ok"]);
  });
  test("reruns: regression in both, unconfirmed after a slow rerun, ok when not confirmed; a different build is refused", () => {
    const first = result([entry("calculations/load/model", 130), entry("large/load/model", 140), entry("expressions/load/model", 140)]);
    const input = { result: first, baseline: base };
    const c = judge(input);
    const r1 = result([entry("calculations/load/model", 131), entry("large/load/model", 141, { calibration: { median: 13, before: 13, after: 13 } }), entry("expressions/load/model", 101)]);
    const r2 = result([entry("calculations/load/model", 129), entry("large/load/model", 139), entry("expressions/load/model", 140)]);
    const f = finalize(c, input, [r1, r2]);
    expect(verdictOf(f, "calculations/load/model").verdict).toBe("regression");
    expect(verdictOf(f, "calculations/load/model").rerunMedians).toEqual([131, 129]);
    expect(verdictOf(f, "large/load/model").verdict).toBe("unconfirmed");
    expect(verdictOf(f, "expressions/load/model").verdict).toBe("ok");
    // RF-F10: judged on the reruns, so the state treats it as an ok night with the reruns' median.
    expect(verdictOf(f, "expressions/load/model")).toMatchObject({ median: 120.5, firstMedian: 140, judgedOk: true });
    const known = emptyKnown();
    applyNight(known, "core", f.verdicts, "c9", "2026-10-29");
    expect(known.lastOk.core["expressions/load/model"]).toBe("c9");
    expect(known.lastOk.core["calculations/load/model"]).toBeUndefined();
    const other = result([entry("calculations/load/model", 130)], { build: { core: { dir: "/other", version: "1", commit: "t2", mtime: "m" }, deps: {} } });
    expect(() => finalize(c, input, [other, r2])).toThrow(/different build/);
  });
  test("reruns that were not judged on time leave a suspect unconfirmed; a slow first run is shown with its reruns' median", () => {
    const first = result([entry("calculations/load/model", 150)]);
    const input = { result: first, baseline: base };
    const c = judge(input);
    const clean = result([entry("calculations/load/model", 151)]);
    const failed = result([], { requested: { only: ["calculations/load/model"], notInSuite: [] }, failed: [{ id: "calculations/load/model", error: "check: no rows" }] });
    const unrun = result([], { requested: { only: ["calculations/load/model"], notInSuite: [] }, incomplete: { reason: "killed", unrun: ["calculations/load/model"] } });
    const noisyRerun = result([entry("calculations/load/model", 150)], { environment: { noisy: true } });
    for (const bad of [failed, unrun, noisyRerun]) {
      const v = verdictOf(finalize(c, input, [bad, clean]), "calculations/load/model");
      expect(v.verdict).toBe("unconfirmed");
      expect(v.rerunMedians.every((m: any) => typeof m === "number")).toBe(true);
    }
    expect(verdictOf(finalize(c, input, [failed, clean]), "calculations/load/model").reason).toBe("rerun missing");
    const slowFirst = result([entry("calculations/load/model", 300, { calibration: { median: 13, before: 13, after: 13 } })]);
    const sInput = { result: slowFirst, baseline: base };
    const s = verdictOf(finalize(judge(sInput), sInput, [result([entry("calculations/load/model", 70)]), result([entry("calculations/load/model", 72)])]), "calculations/load/model");
    expect(s).toMatchObject({ verdict: "improved", median: 71, firstMedian: 300, judgedOk: true });
    expect(s.change).toBeCloseTo(71 / base.scenarios["calculations/load/model"].median - 1, 6);
  });
  test("a failed scenario is a failure without a baseline entry too; a new key checks the fixture before judging counters", () => {
    const r = result([entry("large/load/model", 100)], { failed: [{ id: "extra/new/load", error: "check | no rows\nstack" }] });
    const c = judge({ result: r, baseline: base });
    expect(verdictOf(c, "extra/new/load")).toMatchObject({ verdict: "missing", reason: "failed: check | no rows" });
    expect(c.failed).toBe(true);
    expect(markdownTable(c)).toContain("failed: check \\| no rows");
    const first = judge({ result: r });
    expect(verdictOf(first, "extra/new/load").verdict).toBe("missing");
    expect(first.failed).toBe(true);
    const newKey = result([entry("expressions/load/model", 100, { rev: 2, counters: { expressionRuns: { value: 300, kind: "work" } } })], { machine: { key: "new-key" } });
    const n = verdictOf(judge({ result: newKey, counterBaseline: base }), "expressions/load/model");
    expect(n.verdict).toBe("no reference");
    expect(n.reason).toContain("rev 1 -> 2");
  });
  test("vs previous only on the same machine key, and the comparison names the previous night", () => {
    const prev = result([entry("large/load/model", 50)], { date: "2026-10-28T03:00:00.000Z" });
    const c = judge({ result: result([entry("large/load/model", 100)]), baseline: base, previous: prev });
    expect(verdictOf(c, "large/load/model").vsPrevious).toBe(1);
    expect(c.previous).toEqual({ date: "2026-10-28T03:00:00.000Z", commit: "t1" });
    const other = judge({ result: result([entry("large/load/model", 100)]), baseline: base, previous: result([entry("large/load/model", 50)], { machine: { key: "other" } }) });
    expect(verdictOf(other, "large/load/model").vsPrevious).toBeUndefined();
    expect(other.previous).toBeUndefined();
  });
  test("noisy runs: times not judged, counters judged, nothing rerun; unstable and counterOnly are not judged on time", () => {
    const r = result([entry("large/load/model", 200), entry("expressions/load/model", 100, { counters: { expressionRuns: { value: 200, kind: "work" } } })],
      { environment: { noisy: true } });
    const c = judge({ result: r, baseline: base });
    expect(verdictOf(c, "large/load/model").verdict).toBe("noisy");
    expect(verdictOf(c, "expressions/load/model").verdict).toBe("counter regression");
    expect(c.reruns).toEqual([]);
    const b2 = JSON.parse(JSON.stringify(base));
    b2.scenarios["large/load/model"].unstable = true;
    expect(verdictOf(judge({ result: result([entry("large/load/model", 200)]), baseline: b2 }), "large/load/model").verdict).toBe("unstable");
    expect(verdictOf(judge({ result: result([entry("large/load/model", 200, { counterOnly: true })]), baseline: base }), "large/load/model").verdict).toBe("counterOnly");
  });
  test("a new machine key: counters against the newest baseline of the suite, times not judged", () => {
    const r = result([entry("large/load/model", 500), entry("expressions/load/model", 100, { counters: { expressionRuns: { value: 300, kind: "work" } } })], { machine: { key: "new-key" } });
    const c = judge({ result: r, counterBaseline: base });
    expect(c.newMachineKey).toBe(true);
    expect(verdictOf(c, "large/load/model").verdict).toBe("no reference");
    expect(verdictOf(c, "expressions/load/model").verdict).toBe("counter regression");
  });
  test("the cap: 20 suspects with a clean calibration rerun the top 6 and end as whole-suite regressions, not noisy", () => {
    const many: { [id: string]: number } = {};
    for (let i = 0; i < 20; i++) many["large/load/s" + i] = 100;
    const b = baselineOf(many);
    const slower = (f: number): any => result(Object.keys(many).map((id: string, i: number) => entry(id, 100 * (f + i * 0.01))));
    const input = { result: slower(1.5), baseline: b };
    const c = judge(input);
    expect(c.noisy).toBe(false);
    expect(c.reruns.length).toBe(6);
    const f = finalize(c, input, [slower(1.5), slower(1.5)]);
    expect(f.verdicts.every((v: any) => v.verdict === "regression" && v.tags.indexOf("whole-suite") > -1)).toBe(true);
    // The rerun files hold only the 6 rerun ids, as in a night.
    const only6 = (): any => result(c.reruns.map((id: string) => entry(id, 150)));
    const f6 = finalize(c, input, [only6(), only6()]);
    expect(f6.verdicts.every((v: any) => v.verdict === "regression" && v.tags.indexOf("whole-suite") > -1)).toBe(true);
    // Not confirmed: the rest is unconfirmed, not a regression.
    const back = (): any => result(c.reruns.map((id: string) => entry(id, 100)));
    expect(finalize(c, input, [back(), back()]).verdicts.filter((v: any) => v.verdict === "unconfirmed").length).toBe(14);
    // The same with high calibrations: the machine, the suite is noisy.
    const hot = result(Object.keys(many).map((id: string) => entry(id, 150, { calibration: { median: 13, before: 13, after: 13 } })));
    expect(judge({ result: hot, baseline: b }).noisy).toBe(true);
    // One slow-process scenario does not make the suite noisy: it is rerun in the room the 6 suspects leave.
    const mixed = (): any => result(Object.keys(many).map((id: string, i: number) => entry(id, 150 + i, i === 19 ? { calibration: { median: 13, before: 13, after: 13 } } : {})));
    const mInput = { result: mixed(), baseline: b };
    const m = judge(mInput);
    expect(m.noisy).toBe(false);
    expect(m.reruns.length).toBe(7);
    expect(m.reruns).toContain("large/load/s19");
    const mf = finalize(m, mInput, [slower(1.5), slower(1.5)]);
    expect(mf.verdicts.filter((v: any) => v.verdict === "regression" && v.tags.indexOf("whole-suite") > -1).length).toBe(19);
    // 12 suspects and 3 slow-process: all 12 suspects are rerun, the slow ones over the cap are unconfirmed.
    const twelve = judge({ result: result(Object.keys(many).slice(0, 15).map((id: string, i: number) => entry(id, 150, i >= 12 ? { calibration: { median: 13, before: 13, after: 13 } } : {}))), baseline: b });
    expect(twelve.reruns.length).toBe(12);
    expect(twelve.verdicts.filter((v: any) => v.verdict === "unconfirmed").length).toBe(3);
  });
});

describe("the ratchet and known.json", () => {
  const base = baselineOf({ "large/load/model": 100 });
  const night = (median: number, counter: number = 100): any => result([entry("large/load/model", median, { counters: { expressionRuns: { value: counter, kind: "work" } } })]);
  function nightly(state: { ratchet: Ratchet, known: any }, median: number, date: string, counter?: number): any {
    const input = { result: night(median, counter), baseline: base, ratchet: state.ratchet, known: state.known };
    let c = judge(input);
    if (c.reruns.length) c = finalize(c, input, [night(median, counter), night(median, counter)]);
    const change = applyNight(state.known, "core", c.verdicts, "commit-" + date, date);
    advanceRatchet(state.ratchet, base, state.known, "core", c.verdicts, date);
    return { v: verdictOf(c, "large/load/model"), change: change };
  }
  test("after an improvement the reference ratchets down; a later regression stays regressed on N+1, N+2 and N+5", () => {
    const state = { ratchet: { scenarios: {} } as Ratchet, known: emptyKnown() };
    ["d1", "d2", "d3"].forEach((d: string) => nightly(state, 70, d));
    expect(referenceOf("core", "large/load/model", base, state.ratchet, state.known)).toMatchObject({ time: 70, timeSource: "rolling", since: "d3" });
    const n = nightly(state, 95, "d4");
    expect(n.v.verdict).toBe("regression");
    expect(n.change.added.map((a: any) => a.entry)).toEqual([expect.objectContaining({ kind: "time", ref: 70, lastOkCommit: "commit-d3" })]);
    for (const d of ["d5", "d6", "d9"]) {
      const r = nightly(state, 95, d);
      expect(r.v.verdict).toBe("regression");
      expect(r.change.still.map((s: any) => s.id)).toEqual(["large/load/model"]);
      expect(r.change.added).toEqual([]);
    }
    // The reference is frozen while the entry is open, and the entry goes once a night is ok against it.
    expect(referenceOf("core", "large/load/model", base, state.ratchet, state.known)).toMatchObject({ time: 70, timeSource: "frozen" });
    const fixed = nightly(state, 72, "d10");
    expect(fixed.change.removed).toEqual(["large/load/model"]);
  });
  test("the counter minimum: a counter regression after an improvement stays regressed", () => {
    const state = { ratchet: { scenarios: {} } as Ratchet, known: emptyKnown() };
    nightly(state, 100, "d1", 90);
    expect(referenceOf("core", "large/load/model", base, state.ratchet, state.known)!.counters.expressionRuns).toBe(90);
    const r = nightly(state, 100, "d2", 100);
    expect(r.v.verdict).toBe("counter regression");
    expect(r.change.added[0].entry).toMatchObject({ kind: "counter", ref: 90, counter: "expressionRuns" });
    for (const d of ["d3", "d4", "d7"]) expect(nightly(state, 100, d, 100).change.still.length).toBe(1);
    // Fixed: the counter entry goes, and a later counter regression is a new one with its own range.
    const fixed = nightly(state, 100, "d8", 90);
    expect(fixed.change.removed).toEqual(["large/load/model#expressionRuns"]);
    const again = nightly(state, 100, "d9", 120);
    expect(again.change.added[0].entry).toMatchObject({ kind: "counter", lastOkCommit: "commit-d8" });
  });
  test("a time entry and a counter entry are open side by side; unstable nights keep the counter range", () => {
    const state = { ratchet: { scenarios: {} } as Ratchet, known: emptyKnown() };
    nightly(state, 100, "d1");
    expect(nightly(state, 140, "d2").change.added.map((a: any) => a.entry.kind)).toEqual(["time"]);
    const c = nightly(state, 140, "d3", 200);
    expect(c.change.added.map((a: any) => a.entry.kind)).toEqual(["counter"]);
    expect(Object.keys(state.known.entries.core).sort()).toEqual(["large/load/model", "large/load/model#expressionRuns"]);
    // An unstable scenario: times not judged, but ok counters move the counter range.
    const unstable = JSON.parse(JSON.stringify(base));
    unstable.scenarios["large/load/model"].unstable = true;
    const known = emptyKnown();
    const u = judge({ result: night(500), baseline: unstable, known: known });
    applyNight(known, "core", u.verdicts, "commit-u1", "u1");
    expect(known.lastOk.core["large/load/model"]).toBeUndefined();
    expect(known.lastOkCounters.core["large/load/model"]).toBe("commit-u1");
  });
  test("a renewed baseline removes the renewed scenarios' entries and starts their last ok commit at the baseline's", () => {
    const known = emptyKnown();
    known.entries.core = { "large/load/model": { kind: "time", ref: 100, since: "d1", sinceCommit: "x", lastOkCommit: null },
      "large/load/model#expressionRuns": { kind: "counter", counter: "expressionRuns", ref: 100, since: "d1", sinceCommit: "x", lastOkCommit: null },
      "expressions/load/model": { kind: "time", ref: 100, since: "d1", sinceCommit: "x", lastOkCommit: null } };
    expect(renewKnown(known, "core", { "large/load/model": "t9" }, ["large/load/model"])).toEqual(["large/load/model", "large/load/model#expressionRuns"]);
    expect(Object.keys(known.entries.core)).toEqual(["expressions/load/model"]);
    expect(known.lastOk.core["large/load/model"]).toBe("t9");
    expect(renewKnown(known, "core", {})).toEqual(["expressions/load/model"]);
  });
});

describe("the bisect step rule", () => {
  test("a +50% step at the 4th of 6 commits is found; a slow good end is not in range; a bad end no longer slow is not reproduced", async() => {
    const commits = ["c0", "c1", "c2", "c3", "c4", "c5"];
    const at = (bad: number, value: (i: number) => number) => async(c: string): Promise<number> => value(commits.indexOf(c)) * (1 + (commits.indexOf(c) % 2) * 0.01);
    const found = await bisect(commits, at(3, (i: number) => (i >= 3 ? 150 : 100)), { reference: 100, tolerance: 0.25 });
    expect(found.result).toBe("found");
    expect(found.firstBad).toBe("c3");
    expect(found.steps.every((s: any) => s.medians.length === 3)).toBe(true);
    const notInRange = await bisect(commits, async() => 150, { reference: 100, tolerance: 0.25 });
    expect(notInRange.result).toBe("not-in-range");
    const notReproduced = await bisect(commits, async() => 101, { reference: 100, tolerance: 0.25 });
    expect(notReproduced.result).toBe("not-reproduced");
    expect(isBadStep(123, 100, 150)).toBe(true);
    expect(isBadStep(122, 100, 160)).toBe(false);
    expect(judgeEnds(100, 120, 100, 0.25)).toBe("differ");
    // A counter regression: one run per step, bad above the good end x 1.02.
    const counter = await bisect(commits, async(c: string) => (commits.indexOf(c) >= 4 ? 120 : 100), { reference: 100, tolerance: 0.25, counter: true });
    expect(counter.firstBad).toBe("c4");
    expect(counter.steps.every((s: any) => s.medians.length === 1)).toBe(true);
    // An unbuildable step: a neighbour is measured instead; with none left, the range is narrowed.
    const skip = await bisect(commits, async(c: string) => (c === "c2" ? null : commits.indexOf(c) >= 4 ? 150 : 100), { reference: 100, tolerance: 0.25 });
    expect(skip).toMatchObject({ result: "found", firstBad: "c4", unbuildable: ["c2"] });
    const narrowed = await bisect(commits, async(c: string) => (c === "c2" || c === "c3" ? null : commits.indexOf(c) >= 3 ? 150 : 100), { reference: 100, tolerance: 0.25 });
    expect(narrowed).toMatchObject({ result: "narrowed", lastGood: "c1", firstBad: "c4" });
    expect(narrowed.message).toBe("narrowed to c1..c4, unbuildable");
    const deps = await bisect(commits, async() => 150, { reference: 100, tolerance: 0.25, depsDiff: "typescript 5.4 -> 5.5" });
    expect(deps.message).toContain("typescript 5.4 -> 5.5");
  });
});
