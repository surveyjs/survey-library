import { describe, test, expect } from "vitest";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as Survey from "survey-core";
import { median, min, max, mad, p75, summarize } from "./stats.ts";
import { sampleLoop, scenarioDriver } from "./sample.ts";
import type { SampleDriver } from "./sample.ts";
import { installFunnels, funnels } from "./counters.ts";
import { cdpMetricNames, pickMetrics, renderCounters, durationInfo, leakCounters, untilQuiet, pickHeapUsage, heapInfo, heapGrowthCounters } from "./cdp.ts";
import { SCENARIO_IDS, FIXTURE_KEYS, LOCAL_IDS, idsOfSuite, splitOnly, suitesOf, isLocalId, RENDER_SUBSET } from "./ids.ts";
import { defineScenarios, fixtureOfId, missingRequirement } from "./scenario.ts";
import { allScenarios, PAGE_REV } from "../scenarios/index.ts";
import { suiteOf, resolveUrl, uiPackage, cacheDir } from "../browser/paths.ts";
import { runnerRoot } from "./node/build.ts";
import { machineKey, slug } from "./node/machine.ts";
import { dependencyInfo } from "./node/deps.ts";
import { parseOnly } from "./node/env.ts";

describe("stats", () => {
  test("median, min, max, MAD, p75", () => {
    const v = [5, 1, 4, 2, 3];
    expect(median(v)).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(min(v)).toBe(1);
    expect(max(v)).toBe(5);
    expect(mad(v)).toBe(1);
    expect(p75(v)).toBe(4);
    expect(summarize([1.234, 2.345, 3.456])).toEqual({ median: 2.35, min: 1.23, max: 3.46, mad: 1.11, p75: 2.9 });
  });
});

describe("the sample loop", () => {
  // A fake clock: every sample takes `ms`.
  const fake = (ms: number): { driver: SampleDriver, now: () => number } => {
    let t = 0;
    return {
      now: (): number => t,
      driver: {
        sample: async(): Promise<any> => { t += ms; return { ms: ms }; },
        counterRun: async(): Promise<any> => ({ rows: { value: 1, kind: "work" } })
      }
    };
  };
  test("order: warm-ups, samples, counter run, and nothing else", async() => {
    const f = fake(100);
    const res = await sampleLoop(f.driver, { warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: f.now });
    expect(res.log).toEqual(["warmup", "warmup"].concat(new Array(12).fill("sample"), ["counters"]));
    expect(res.samples.length).toBe(12);
    expect(res.warmups.length).toBe(2);
  });
  test("maxMs is wall time from the first warm-up; at least minSamples are kept", async() => {
    const slow = fake(2000);
    const res = await sampleLoop(slow.driver, { warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: slow.now });
    expect(res.samples.length).toBe(5);
    const mid = fake(600);
    // 2 warm-ups (1,200 ms), then samples until 5,000 ms: 7 samples (5,400 ms).
    expect((await sampleLoop(mid.driver, { warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: mid.now })).samples.length).toBe(7);
  });
  test("one sample: setup -> gc -> run -> check -> teardown; check runs after warm-ups too; counters come from the counter run", async() => {
    const log: Array<string> = [];
    const s = defineScenarios([{
      id: "large/load/model", rev: 1, fixture: "large", kind: "load",
      setup: () => { log.push("setup"); return {}; },
      run: () => { log.push("run"); },
      check: () => { log.push("check"); },
      teardown: () => { log.push("teardown"); },
      counters: () => ({ own: { value: 7, kind: "work" } })
    }])[0];
    let t = 0;
    const ctx: any = { Survey: Survey, fixture: {}, platform: "node", now: () => t, cache: {} };
    const driver = scenarioDriver(s, ctx, { now: () => ++t, gc: () => { log.push("gc"); }, installFunnels: () => installFunnels(Survey) });
    const res = await sampleLoop(driver, { warmup: 1, samples: 5, maxMs: 100000, minSamples: 5, now: () => t });
    expect(log.slice(0, 5)).toEqual(["setup", "gc", "run", "check", "teardown"]);
    expect(log.filter((x: string) => x === "check").length).toBe(1 + 5 + 1);
    expect(res.counters.own).toEqual({ value: 7, kind: "work" });
    expect(res.counters.conditionRuns).toEqual({ value: 0, kind: "work" });
  });
  test("beforeSamples runs after the warm-ups, afterSamples after the last sample and before the counter run", async() => {
    const log: Array<string> = [];
    let t = 0;
    let warm = 2;
    const driver: SampleDriver = {
      sample: async(): Promise<any> => { t += 100; log.push(warm-- > 0 ? "warmup" : "sample"); return { ms: 100 }; },
      counterRun: async(): Promise<any> => { log.push("counters"); return {}; },
      beforeSamples: async(): Promise<void> => { log.push("before"); },
      afterSamples: async(): Promise<void> => { log.push("after"); }
    };
    const res = await sampleLoop(driver, { warmup: 2, samples: 5, maxMs: 100000, minSamples: 5, now: () => t });
    expect(log).toEqual(["warmup", "warmup", "before"].concat(new Array(5).fill("sample"), ["after", "counters"]));
    expect(res.log).toEqual(["warmup", "warmup"].concat(new Array(5).fill("sample"), ["counters"]));
  });
  test("the counter run hooks wrap the runs only (repeat included), and their counters join the counter run's", async() => {
    const log: Array<string> = [];
    const s = defineScenarios([{
      id: "manyPages/pages/prev", rev: 1, fixture: "manyPages", kind: "action", repeat: 3,
      setup: () => { log.push("setup"); return {}; },
      run: () => { log.push("run"); },
      check: () => { log.push("check"); },
      teardown: () => { log.push("teardown"); }
    }])[0];
    let t = 0;
    const ctx: any = { Survey: Survey, fixture: {}, platform: "browser", now: () => t, cache: {} };
    const driver = scenarioDriver(s, ctx, { now: () => ++t, gc: () => {}, installFunnels: () => installFunnels(Survey),
      beforeCounterRun: async(): Promise<void> => { log.push("before"); },
      afterCounterRun: async(): Promise<any> => { log.push("after"); return { layoutCount: { value: 2, kind: "render" } }; } });
    const counters = await driver.counterRun();
    expect(log).toEqual(["setup", "before", "run", "run", "run", "after", "check", "teardown"]);
    expect(counters.layoutCount).toEqual({ value: 2, kind: "render" });
    expect(counters.conditionRuns).toEqual({ value: 0, kind: "work" });
    log.length = 0;
    await driver.sample();
    expect(log).toEqual(["setup", "run", "run", "run", "check", "teardown"]);
  });
  test("requires: the first property the build lacks is the skip reason", () => {
    const fake = { Serializer: { findProperty: (cls: string, prop: string) => (cls === "matrixdynamic" && prop === "pageSize" ? {} : null) } };
    expect(missingRequirement(fake, ["matrixdynamic.pageSize", "paneldynamic.pageSize"])).toBe("not in this build: paneldynamic.pageSize");
    expect(missingRequirement(fake, ["matrixdynamic.pageSize"])).toBe("");
    expect(missingRequirement(Survey, ["matrixdynamic.pageSize", "paneldynamic.pageSize"])).toBe("");
  });
  test("a scenario without check throws at registration", () => {
    expect(() => defineScenarios([{ id: "large/load/model", rev: 1, fixture: "large", kind: "load", setup: () => 1, run: () => 1 } as any])).toThrow(/no check/);
  });
});

describe("ids", () => {
  test("unique, known fixtures, suites per id, and every core id has a scenario", () => {
    const ids = SCENARIO_IDS.map((s: any) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id: string) => expect(FIXTURE_KEYS as ReadonlyArray<string>).toContain(fixtureOfId(id)));
    SCENARIO_IDS.forEach((s: any) => expect(s.suites.length).toBeGreaterThan(0));
    expect(allScenarios().map((s: any) => s.id).sort()).toEqual(ids.slice().sort());
    // survey-js-ui runs React's ids except the preview of all 4,500 questions.
    expect(idsOfSuite("react").filter((id: string) => id !== "manyPages/pages/preview")).toEqual(idsOfSuite("survey-js-ui"));
    expect(idsOfSuite("react").length).toBe(24);
    expect(suitesOf("manyPages/pages/preview")).toEqual(["core", "react"]);
    expect(idsOfSuite("core").length).toBe(68);
    // The slot form: thirteen core ids, none in a browser suite; its full size only in LOCAL_IDS, which no suite runs.
    expect(idsOfSuite("core").filter((id: string) => id.indexOf("slotForm/") === 0).length).toBe(13);
    expect(SCENARIO_IDS.filter((s: any) => s.id.indexOf("slotForm") === 0).every((s: any) => s.suites.join() === "core")).toBe(true);
    expect(LOCAL_IDS.length).toBe(13);
    LOCAL_IDS.forEach((id: string) => {
      expect(suitesOf(id)).toEqual([]);
      expect(fixtureOfId(id)).toBe("slotForm-full");
    });
    expect(idsOfSuite("core").filter((id: string) => id.indexOf("records-1k/records/") === 0 && /@orders$/.test(id)))
      .toEqual(["records-1k/records/filter-set@orders", "records-1k/records/next@orders", "records-1k/records/sort-1@orders"]);
    // vue3 and angular run RENDER_SUBSET: browser ids that React runs.
    RENDER_SUBSET.forEach((id: string) => expect(idsOfSuite("react")).toContain(id));
    expect(RENDER_SUBSET.length).toBe(13);
    expect(idsOfSuite("vue3")).toEqual(RENDER_SUBSET.slice().sort());
    expect(idsOfSuite("angular")).toEqual(RENDER_SUBSET.slice().sort());
    expect(suitesOf("manyPages/pages/next10")).toEqual(["core", "react", "survey-js-ui", "vue3", "angular"]);
    expect(suitesOf("large/load/paint")).toEqual(["react", "survey-js-ui", "vue3", "angular"]);
  });
  test("the PERF_ONLY split", () => {
    expect(parseOnly(" a , b,,")).toEqual(["a", "b"]);
    expect(parseOnly("")).toBeNull();
    expect(splitOnly(null, "core").run.length).toBe(idsOfSuite("core").length);
    expect(splitOnly(["large/load/model", "extra/x/load/model"], "core")).toEqual({ run: ["extra/x/load/model", "large/load/model"], notInSuite: [] });
    expect(() => splitOnly(["large/load/nothing"], "core")).toThrow(/in no suite/);
    // The former spacer id is an unknown id like any other.
    expect(() => splitOnly(["calibration"], "core")).toThrow(/in no suite: calibration$/);
    expect(() => splitOnly(["calibration"], "react")).toThrow(/in no suite: calibration$/);
    // A suite with none of the ids runs nothing and lists the others as notInSuite.
    expect(splitOnly(["large/load/model"], "react")).toEqual({ run: [], notInSuite: ["large/load/model"] });
    expect(splitOnly(["large/load/paint", "large/load/model"], "core")).toEqual({ run: ["large/load/model"], notInSuite: ["large/load/paint"] });
    expect(suitesOf("records-10k/records/next@orders")).toEqual(["core", "react", "survey-js-ui"]);
    // A local id runs in core when PERF_ONLY names it, never by default.
    expect(splitOnly(["slotForm-full/load/data", "slotForm/load/data"], "core")).toEqual({ run: ["slotForm-full/load/data", "slotForm/load/data"], notInSuite: [] });
    expect(splitOnly(["slotForm-full/load/data"], "react")).toEqual({ run: [], notInSuite: ["slotForm-full/load/data"] });
    expect(splitOnly(null, "core").run.filter((id: string) => isLocalId(id))).toEqual([]);
  });
});

describe("machine", () => {
  test("the key is a slug of os, CPU, cores, Node and Chromium majors and the extra", () => {
    expect(slug("Intel(R) Core(TM) i7-1185G7 @ 3.00GHz")).toBe("intel-core-i7-1185g7-3.00ghz");
    const key = machineKey({ os: "linux-6", cpu: "AMD Ryzen 9 7950X 16-Core Processor", cores: 32, availableParallelism: 8, node: "24.11.1",
      chromium: "140.0.7339.16", extra: "surveyjs-perf:1.60.0-abc1234 2-5" });
    expect(key).toBe("linux-6-amd-ryzen-9-7950x-16-core-processor-32c-node24-chromium140-surveyjs-perf-1.60.0-abc1234-2-5");
    expect(key).toMatch(/^[a-z0-9.-]+$/);
  });
});

describe("deps", () => {
  test("the fingerprint lists external packages only: no own version, no linked survey-core", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "perf-deps-"));
    const pkg = (at: string, name: string, version: string): void => {
      fs.mkdirSync(at, { recursive: true });
      fs.writeFileSync(path.join(at, "package.json"), JSON.stringify({ name: name, version: version }));
    };
    pkg(dir, "survey-react-ui", "3.2.3");
    pkg(path.join(dir, "node_modules", "rollup"), "rollup", "4.34.8");
    pkg(path.join(dir, "node_modules", "@types", "node"), "@types/node", "7.0.4");
    const build = path.join(dir, "core-build");
    pkg(build, "survey-core", "3.2.3");
    fs.symlinkSync(build, path.join(dir, "node_modules", "survey-core"), "junction");
    const a = dependencyInfo([dir]);
    expect(a.versions).toEqual({ rollup: "4.34.8" });
    // The release bump: the package's own version and the linked build's.
    pkg(dir, "survey-react-ui", "3.2.4");
    pkg(build, "survey-core", "3.2.4");
    expect(dependencyInfo([dir]).fingerprint).toBe(a.fingerprint);
    pkg(path.join(dir, "node_modules", "rollup"), "rollup", "4.35.0");
    expect(dependencyInfo([dir]).fingerprint).not.toBe(a.fingerprint);
    expect(dependencyInfo([]).fingerprint).toBeNull();
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe("counter funnels", () => {
  test("every funnel is reached on a tiny survey; a funnel the build lacks gives null", () => {
    const f = installFunnels(Survey);
    try {
      const survey = new Survey.Model({
        elements: [
          { type: "text", name: "a", visibleIf: "{b} = 1" },
          { type: "text", name: "b" },
          { type: "expression", name: "e", expression: "{b} + 1" },
          // On master element conditions run through ExpressionRunner; a filter runs through ConditionRunner.
          { type: "expression", name: "f", expression: "countInArray({m}, 'c', {c} = 1)" },
          { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "c" }] },
          { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "t" }] }
        ]
      });
      survey.setValue("b", 1);
      survey.getQuestionByName("m").visibleRows;
      survey.setValue("m", [{ c: 1 }, { c: 2 }]);
      const counts = f.read();
      funnels.forEach((fn: any) => expect(counts[fn.name], fn.name).toBeGreaterThan(0));
    } finally {
      f.uninstall();
    }
    const missing = installFunnels({}, [{ name: "x", className: "NoSuchClass", method: "run" }]);
    expect(missing.read()).toEqual({ x: null });
    missing.uninstall();
    // Uninstalled: the prototypes are back.
    expect(Object.prototype.hasOwnProperty.call(Survey.ExpressionRunner.prototype, "runContextCore")).toBe(false);
  });
});

describe("CDP metrics", () => {
  const snap = (layouts: number, styles: number, layoutS: number, styleS: number, scriptS: number, listeners: number, nodes: number): any =>
    pickMetrics([{ name: "LayoutCount", value: layouts }, { name: "RecalcStyleCount", value: styles }, { name: "LayoutDuration", value: layoutS },
      { name: "RecalcStyleDuration", value: styleS }, { name: "ScriptDuration", value: scriptS }, { name: "JSEventListeners", value: listeners },
      { name: "Nodes", value: nodes }, { name: "Documents", value: 9 }, { name: "Timestamp", value: 123 }]);
  test("a snapshot keeps the named metrics only", () => {
    expect(Object.keys(snap(1, 1, 0, 0, 0, 1, 1)).sort()).toEqual(cdpMetricNames.slice().sort());
  });
  test("render counters, durations and leaks are the differences of two snapshots", () => {
    const before = snap(10, 20, 0.5, 0.25, 1, 100, 1000);
    const after = snap(12, 23, 0.5012345, 0.2504, 1.003, 104, 1050);
    expect(renderCounters(before, after)).toEqual({ layoutCount: { value: 2, kind: "render" }, recalcStyleCount: { value: 3, kind: "render" } });
    expect(durationInfo(before, after)).toEqual({ layoutMs: 1.23, recalcStyleMs: 0.4, scriptMs: 3 });
    expect(leakCounters(before, after, 1)).toEqual({ listenerGrowth: { value: 4, kind: "leak" }, nodeGrowth: { value: 50, kind: "leak" } });
  });
  test("leaks are the growth per cycle: a growth that stops after the first cycle is not one", () => {
    const at = (listeners: number, nodes: number): any => snap(0, 0, 0, 0, 0, listeners, nodes);
    // A real leak: +341 / +489 every cycle, whatever the number of cycles.
    expect(leakCounters(at(2688, 4859), at(4052, 6815), 4)).toEqual({ listenerGrowth: { value: 341, kind: "leak" }, nodeGrowth: { value: 489, kind: "leak" } });
    expect(leakCounters(at(2688, 4859), at(3370, 5837), 2)).toEqual({ listenerGrowth: { value: 341, kind: "leak" }, nodeGrowth: { value: 489, kind: "leak" } });
    expect(leakCounters(at(10, 100), at(11, 102), 3)).toEqual({ listenerGrowth: { value: 0.33, kind: "leak" }, nodeGrowth: { value: 0.67, kind: "leak" } });
    // No cycle between the snapshots: no growth to tell.
    expect(leakCounters(at(1, 1), at(1, 1), 0)).toEqual({ listenerGrowth: { value: null, kind: "leak" }, nodeGrowth: { value: null, kind: "leak" } });
  });
  test("without the bridge the counters are null and there are no durations", () => {
    expect(renderCounters(null, null)).toEqual({ layoutCount: { value: null, kind: "render" }, recalcStyleCount: { value: null, kind: "render" } });
    expect(leakCounters(snap(1, 1, 0, 0, 0, 1, 1), null, 4)).toEqual({ listenerGrowth: { value: null, kind: "leak" }, nodeGrowth: { value: null, kind: "leak" } });
    expect(durationInfo(null, null)).toEqual({});
  });
  test("heap usage: the V8 and the Blink heaps of Runtime.getHeapUsage, in MB for info", () => {
    // Chromium 148's full response.
    const res = { usedSize: 716436, totalSize: 1048576, embedderHeapUsedSize: 31467304, backingStorageSize: 30 };
    expect(pickHeapUsage(res)).toEqual({ JSHeapUsed: 716436, BlinkHeapUsed: 31467304 });
    expect(heapInfo(pickHeapUsage(res))).toEqual({ jsHeapMB: 0.68, blinkHeapMB: 30.01 });
    // A Chromium without the embedder heap: no blinkHeapMB rather than a stand-in.
    expect(pickHeapUsage({ usedSize: 2097152, totalSize: 4194304 })).toEqual({ JSHeapUsed: 2097152 });
    expect(heapInfo(pickHeapUsage({ usedSize: 2097152, totalSize: 4194304 }))).toEqual({ jsHeapMB: 2 });
    expect(heapInfo(null)).toEqual({});
  });
  test("heap growth per cycle, in KB, as counters of kind heap", () => {
    const at = (js: number, blink: number): any => ({ JSHeapUsed: js, BlinkHeapUsed: blink });
    expect(heapGrowthCounters(at(1048576, 2097152), at(1048576 + 4 * 10240, 2097152 + 4 * 512), 4))
      .toEqual({ jsHeapGrowth: { value: 10, kind: "heap" }, blinkHeapGrowth: { value: 0.5, kind: "heap" } });
    expect(heapGrowthCounters(at(1000, 1000), at(1000, 1000), 0))
      .toEqual({ jsHeapGrowth: { value: null, kind: "heap" }, blinkHeapGrowth: { value: null, kind: "heap" } });
    expect(heapGrowthCounters({ JSHeapUsed: 0 }, { JSHeapUsed: 3072 }, 3))
      .toEqual({ jsHeapGrowth: { value: 1, kind: "heap" }, blinkHeapGrowth: { value: null, kind: "heap" } });
  });
  // A fake page: each wait() is a frame; the snapshot after frame i has the i-th layout and recalc counts.
  const frames = (layouts: Array<number>, recalcs?: Array<number>): any => {
    let i = -1;
    const log: Array<string> = [];
    return {
      log: log,
      wait: async(): Promise<void> => { i++; log.push("frame"); },
      snapshot: async(): Promise<any> => {
        log.push("snapshot");
        const at = Math.min(i, layouts.length - 1);
        return { LayoutCount: layouts[at], RecalcStyleCount: recalcs ? recalcs[Math.min(i, recalcs.length - 1)] : 0 };
      }
    };
  };
  test("the window closes when the counts stay the same for two frames in a row", async() => {
    const f = frames([5, 7, 9, 9, 9, 12]);
    const res = await untilQuiet(f.snapshot, f.wait, { quietFrames: 2, maxFrames: 60 });
    expect(res.snapshot).toEqual({ LayoutCount: 9, RecalcStyleCount: 0 });
    expect(res.frames).toBe(5);
    expect(f.log.slice(0, 2)).toEqual(["frame", "snapshot"]);
  });
  test("a recalc count that still changes keeps the window open", async() => {
    const f = frames([3, 3, 3, 3, 3], [1, 2, 3, 3, 3]);
    const res = await untilQuiet(f.snapshot, f.wait, { quietFrames: 2, maxFrames: 60 });
    expect(res.snapshot).toEqual({ LayoutCount: 3, RecalcStyleCount: 3 });
    expect(res.frames).toBe(5);
  });
  test("no quiet within maxFrames, or no bridge: the snapshot is null", async() => {
    const busy = frames(Array.from({ length: 100 }, (v: any, i: number) => i));
    const res = await untilQuiet(busy.snapshot, busy.wait, { quietFrames: 2, maxFrames: 10 });
    expect(res).toEqual({ snapshot: null, frames: 10 });
    const none = await untilQuiet(async(): Promise<any> => null, async(): Promise<void> => {}, { quietFrames: 2, maxFrames: 10 });
    expect(none).toEqual({ snapshot: null, frames: 1 });
  });
});

describe("revs", () => {
  test("revs.json matches every scenario (node perf/scenarios/revs.ts)", () => {
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "scenarios", "revs.ts")], { encoding: "utf8" });
    expect(res.stderr).toBe("");
    expect(res.stdout).toContain("all hashes match");
    expect(res.status).toBe(0);
  });
});

describe("revs: the page code's rev", () => {
  test("a browser id's rev adds PAGE_REV - 1 to its own; a core-only id keeps its own", () => {
    const rev = (id: string): number => allScenarios().filter((s: any) => s.id === id)[0].rev;
    expect(PAGE_REV).toBe(2);
    expect(rev("large/load/paint")).toBe(1 + PAGE_REV - 1);
    expect(rev("manyPages/pages/next10")).toBe(1 + PAGE_REV - 1);
    expect(rev("records-plain/records/sort-header@orders30")).toBe(2 + PAGE_REV - 1);
    expect(rev("large/load/model")).toBe(1);
    expect(rev("records-10k/records/prev@orders")).toBe(2);
  });
});

describe("browser suites", () => {
  test("PERF_SUITE names a UI package, and the pinned frameworks are served from the cache", () => {
    ["react", "survey-js-ui", "vue3", "angular"].forEach((suite: string) => expect(suiteOf({ PERF_SUITE: suite })).toBe(suite));
    expect(() => suiteOf({ PERF_SUITE: "constructor" })).toThrow(/PERF_SUITE must be one of react, survey-js-ui, vue3, angular/);
    expect(() => suiteOf({})).toThrow(/PERF_SUITE/);
    expect(uiPackage.angular.file).toBe("fesm2015/survey-angular-ui.js");
    const cached = path.join(cacheDir, "perf-paths-test.js");
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cached, "");
    try {
      ["react19", "vue3", "angular"].forEach((root: string) => expect(resolveUrl("http://perf.local/" + root + "/perf-paths-test.js", "vue3")).toBe(cached));
      expect(resolveUrl("http://perf.local/other/perf-paths-test.js", "vue3")).toBeUndefined();
      expect(resolveUrl("http://other.local/vue3/perf-paths-test.js", "vue3")).toBeUndefined();
    } finally {
      fs.rmSync(cached, { force: true });
    }
  });
});

describe("revs: a changed hash without a rev bump fails", () => {
  test("revs.ts --file with one hash altered exits 1 and asks for a rev bump", async() => {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const real = JSON.parse(fs.readFileSync(path.join(runnerRoot, "perf", "scenarios", "revs.json"), "utf8"));
    const id = Object.keys(real)[0];
    real[id] = { rev: real[id].rev, hash: "0".repeat(40) };
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "perf-revs-"));
    const file = path.join(dir, "revs.json");
    fs.writeFileSync(file, JSON.stringify(real));
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "scenarios", "revs.ts"), "--file", file], { encoding: "utf8" });
    expect(res.status).toBe(1);
    expect(res.stdout).toContain(id + ": the measured code changed but rev is still");
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
