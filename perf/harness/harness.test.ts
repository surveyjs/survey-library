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
import { calibrateOnce, calibrationReadings, calibrationResult } from "./calibration.ts";
import { SCENARIO_IDS, FIXTURE_KEYS, idsOfSuite, splitOnly, suitesOf, DROP_LIST, RENDER_SUBSET } from "./ids.ts";
import { defineScenarios, fixtureOfId, missingRequirement } from "./scenario.ts";
import { allScenarios } from "../scenarios/index.ts";
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
  // A fake clock: every sample takes `ms`, every calibration reading `calMs` (10 ms by default).
  const fake = (ms: number, calMs: number = 10): { driver: SampleDriver, now: () => number } => {
    let t = 0;
    return {
      now: (): number => t,
      driver: {
        sample: async(): Promise<any> => { t += ms; return { ms: ms }; },
        counterRun: async(): Promise<any> => ({ rows: { value: 1, kind: "work" } }),
        calibrate: async(): Promise<number> => { t += calMs; return calMs; }
      }
    };
  };
  test("order: calibration x3, warm-ups, (calibration, sample) per sample, counter run, calibration x3", async() => {
    const f = fake(100);
    const res = await sampleLoop(f.driver, { warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: f.now });
    const perSample: Array<string> = [];
    for (let i = 0; i < 12; i++) perSample.push("calibrate", "sample");
    expect(res.log).toEqual(["calibrate", "calibrate", "calibrate", "warmup", "warmup"].concat(perSample, ["counters", "calibrate", "calibrate", "calibrate"]));
    expect(res.samples.length).toBe(12);
    expect(res.warmups.length).toBe(2);
    expect([res.calibrationBefore.length, res.calibrationDuring.length, res.calibrationAfter.length]).toEqual([3, 12, 3]);
  });
  test("beforeCalibration runs before the 3 readings before the warm-ups and the 3 after the counter run, not before the others", async() => {
    const f = fake(100);
    const driver: SampleDriver = Object.assign({}, f.driver, { beforeCalibration: async(): Promise<void> => {} });
    const res = await sampleLoop(driver, { warmup: 1, samples: 5, maxMs: 5000, minSamples: 5, now: f.now });
    const perSample: Array<string> = [];
    for (let i = 0; i < 5; i++) perSample.push("calibrate", "sample");
    expect(res.log).toEqual(["settle", "calibrate", "calibrate", "calibrate", "warmup"].concat(perSample, ["counters", "settle", "calibrate", "calibrate", "calibrate"]));
  });
  test("a reading precedes the setup of every kept sample, and the sample's gc follows it; none precedes a warm-up", async() => {
    const log: Array<string> = [];
    const s = defineScenarios([{
      id: "large/load/model", rev: 1, fixture: "large", kind: "load",
      setup: () => { log.push("setup"); return {}; },
      run: () => { log.push("run"); },
      check: () => { log.push("check"); }
    }])[0];
    let t = 0;
    const ctx: any = { Survey: Survey, fixture: {}, platform: "node", now: () => t, cache: {} };
    const driver = scenarioDriver(s, ctx, { now: () => ++t, gc: () => { log.push("gc"); }, calibrate: () => { log.push("calibrate"); return 1; },
      installFunnels: () => installFunnels(Survey) });
    const res = await sampleLoop(driver, { warmup: 2, samples: 6, maxMs: 100000, minSamples: 5, now: () => t });
    const reading = ["calibrate"];
    const sample = ["setup", "gc", "run", "check"];
    let expected: Array<string> = reading.concat(reading, reading, sample, sample);
    for (let i = 0; i < 6; i++) expected = expected.concat(reading, sample);
    expected = expected.concat(["setup", "run", "check"], reading, reading, reading);
    expect(log).toEqual(expected);
    expect(res.calibrationDuring.length).toBe(res.samples.length);
  });
  test("the readings before the samples do not count against maxMs: the same samples kept with and without 50 ms readings", async() => {
    for (const ms of [30, 600, 2000]) {
      const options = (f: any): any => ({ warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: f.now });
      const without = fake(ms, 0);
      const withReadings = fake(ms, 50);
      const a = await sampleLoop(without.driver, options(without));
      const b = await sampleLoop(withReadings.driver, options(withReadings));
      expect(b.samples.length, "sample of " + ms + " ms").toBe(a.samples.length);
      expect(b.wallMs).toBe(a.wallMs);
    }
    // 2 warm-ups (1,200 ms), then samples until 5,000 ms: 7 samples, whatever the readings take.
    const mid = fake(600, 50);
    expect((await sampleLoop(mid.driver, { warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: mid.now })).samples.length).toBe(7);
  });
  test("scenarioDriver: afterSample after every sample; after the counter run only when no beforeCalibration follows it", async() => {
    const run = async(withBeforeCalibration: boolean): Promise<Array<string>> => {
      const log: Array<string> = [];
      const s = defineScenarios([{ id: "large/load/model", rev: 1, fixture: "large", kind: "load", setup: () => ({}), run: () => {},
        check: () => {}, teardown: () => { log.push("teardown"); } }])[0];
      const ctx: any = { Survey: Survey, fixture: {}, platform: "node", now: () => 0, cache: {} };
      const driver = scenarioDriver(s, ctx, { now: () => 0, gc: () => {}, calibrate: () => { log.push("calibrate"); return 1; },
        installFunnels: () => installFunnels(Survey), afterSample: () => { log.push("afterSample"); },
        beforeCalibration: withBeforeCalibration ? (): void => { log.push("beforeCalibration"); } : undefined });
      await sampleLoop(driver, { warmup: 0, samples: 5, maxMs: 100000, minSamples: 5, now: () => 0 });
      return log.slice(log.lastIndexOf("teardown"));
    };
    expect(await run(true)).toEqual(["teardown", "beforeCalibration", "calibrate", "calibrate", "calibrate"]);
    expect(await run(false)).toEqual(["teardown", "afterSample", "calibrate", "calibrate", "calibrate"]);
  });
  test("sampleWithReading (a load scenario's page): kept samples bring their own reading, warm-ups do not, its time is off the maxMs clock", async() => {
    let t = 0;
    const log: Array<string> = [];
    const driver: SampleDriver = {
      sample: async(): Promise<any> => { log.push("sample"); t += 600; return { ms: 600 }; },
      sampleWithReading: async(): Promise<any> => { log.push("sampleWithReading"); t += 650; return { ms: 600, reading: 12, readingMs: 50 }; },
      counterRun: async(): Promise<any> => { log.push("counters"); return {}; },
      calibrate: async(): Promise<number> => { log.push("calibrate"); t += 10; return 10; }
    };
    const res = await sampleLoop(driver, { warmup: 2, samples: 12, maxMs: 5000, minSamples: 5, now: () => t });
    // 2 warm-ups (1,200 ms), then samples until 5,000 ms: 7 samples, as without the readings.
    const kept: Array<string> = new Array(7).fill("sampleWithReading");
    expect(log).toEqual(["calibrate", "calibrate", "calibrate", "sample", "sample"].concat(kept, ["counters", "calibrate", "calibrate", "calibrate"]));
    expect(res.calibrationDuring).toEqual(new Array(7).fill(12));
    expect(res.samples).toEqual(new Array(7).fill(600));
  });
  test("calibration.median: the readings before the samples plus before and after as one value each", () => {
    const readings = calibrationReadings([30.004, 31, 29], [10, 11.111, 12, 10.5, 30.5], [28, 32, 33]);
    expect(readings).toEqual({ before: [30, 31, 29], during: [10, 11.11, 12, 10.5, 30.5], after: [28, 32, 33] });
    // 10 10.5 11.11 12 30.5, before 30, after 32 -> sorted 10 10.5 11.11 12 30 30.5 32. The median of all 11
    // readings would be 29: the two blocks, 6 readings, would outvote the 5 next to the samples.
    expect(calibrationResult(readings)).toEqual({ median: 12, before: 30, after: 32 });
    // The React run of records-10k/records/last@orders: 4 of 5 samples in the slow mode, both blocks fast.
    expect(calibrationResult(calibrationReadings([10.7, 10, 10.1], [24.5, 24.3, 23.8, 23.8, 10.1], [10.5, 9.9, 9.8])).median).toBe(23.8);
    // An even count: the mean of the two middle values (6 readings + 2 blocks).
    expect(calibrationResult(calibrationReadings([1, 2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12])).median).toBe(6.5);
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
    const driver = scenarioDriver(s, ctx, { now: () => ++t, gc: () => { log.push("gc"); }, calibrate: () => 1, installFunnels: () => installFunnels(Survey) });
    const res = await sampleLoop(driver, { warmup: 1, samples: 5, maxMs: 100000, minSamples: 5, now: () => t });
    expect(log.slice(0, 5)).toEqual(["setup", "gc", "run", "check", "teardown"]);
    expect(log.filter((x: string) => x === "check").length).toBe(1 + 5 + 1);
    expect(res.counters.own).toEqual({ value: 7, kind: "work" });
    expect(res.counters.conditionRuns).toEqual({ value: 0, kind: "work" });
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
  test("calibration is 10-20 ms of fixed work order of magnitude, and returns a time", () => {
    const ms = calibrateOnce(() => performance.now());
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThan(1000);
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
    expect(idsOfSuite("react").length).toBe(21);
    expect(suitesOf("manyPages/pages/preview")).toEqual(["core", "react"]);
    expect(idsOfSuite("core").length).toBe(52);
    expect(idsOfSuite("core").filter((id: string) => id.indexOf("records-1k/records/") === 0 && /@orders$/.test(id)))
      .toEqual(["records-1k/records/filter-set@orders", "records-1k/records/next@orders", "records-1k/records/sort-1@orders"]);
    // records-plain has no load ids: no load/paint of it in the browser or in RENDER_SUBSET.
    expect(SCENARIO_IDS.filter((s: any) => s.id.indexOf("records-plain/load/") === 0)).toEqual([]);
    DROP_LIST.forEach((id: string) => expect(ids).toContain(id));
    // The phase-2 browser suites' ids: browser ids that React runs.
    RENDER_SUBSET.forEach((id: string) => expect(idsOfSuite("react")).toContain(id));
    expect(RENDER_SUBSET.length).toBe(13);
  });
  test("the PERF_ONLY split", () => {
    expect(parseOnly(" a , b,,")).toEqual(["a", "b"]);
    expect(parseOnly("")).toBeNull();
    expect(splitOnly(null, "core").run.length).toBe(idsOfSuite("core").length);
    expect(splitOnly(["large/load/model", "extra/x/load/model"], "core")).toEqual({ run: ["extra/x/load/model", "large/load/model"], notInSuite: [] });
    expect(() => splitOnly(["large/load/nothing"], "core")).toThrow(/in no suite/);
    // A suite with none of the ids runs nothing and lists the others as notInSuite.
    expect(splitOnly(["large/load/model"], "react")).toEqual({ run: [], notInSuite: ["large/load/model"] });
    expect(splitOnly(["large/load/paint", "large/load/model"], "core")).toEqual({ run: ["large/load/model"], notInSuite: ["large/load/paint"] });
    expect(suitesOf("records-10k/records/next@orders")).toEqual(["core", "react", "survey-js-ui"]);
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

describe("revs", () => {
  test("revs.json matches every scenario (node perf/scenarios/revs.ts)", () => {
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "scenarios", "revs.ts")], { encoding: "utf8" });
    expect(res.stderr).toBe("");
    expect(res.stdout).toContain("all hashes match");
    expect(res.status).toBe(0);
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
