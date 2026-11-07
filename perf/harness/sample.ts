import type { PerfScenario, PerfContext, PhaseTimes } from "./scenario.ts";
import type { Counters, FunnelCounters } from "./counters.ts";
import { work } from "./counters.ts";
import { calibrationSamples } from "./calibration.ts";

// The sample loop (02, The harness). A driver takes one sample; the loop decides how many, keeps the order
// calibration x3 -> warm-ups -> (calibration -> sample) per kept sample -> counter run -> calibration x3, and enforces
// maxMs. The reading before each sample shows a slow mode that starts partway through the process.
export interface Sample {
  ms: number;
  phases?: PhaseTimes;
}

// A kept sample that took its calibration reading itself, right before its setup, and the time the reading took.
export interface SampleWithReading extends Sample {
  reading: number;
  readingMs: number;
}

export interface SampleDriver {
  sample(): Promise<Sample>;
  // One extra untimed run with the funnels installed.
  counterRun(): Promise<Counters>;
  // One calibration reading in ms.
  calibrate(): Promise<number>;
  // Untimed, before the 3 readings before the warm-ups and the 3 after the counter run (the browser settles here).
  beforeCalibration?(): Promise<void>;
  // For a sample that runs where calibrate() cannot reach (a load scenario's fresh page): the loop takes each kept
  // sample with its reading from here instead of calling calibrate() and then sample().
  sampleWithReading?(): Promise<SampleWithReading>;
}

export interface SampleOptions {
  warmup: number;
  samples: number;
  maxMs: number;
  minSamples: number;
  now(): number;
}

export interface SampleResult {
  samples: Array<number>;
  phases?: { [phase: string]: Array<number> };
  warmups: Array<number>;
  calibrationBefore: Array<number>;
  // One reading before the setup of every kept sample.
  calibrationDuring: Array<number>;
  calibrationAfter: Array<number>;
  counters: Counters;
  // The maxMs clock: from the first warm-up to the end of the last sample, without the calibration readings.
  wallMs: number;
  // The order the steps ran in, for the unit test.
  log: Array<string>;
}

export async function sampleLoop(driver: SampleDriver, options: SampleOptions): Promise<SampleResult> {
  const log: Array<string> = [];
  const block = async(): Promise<Array<number>> => {
    if (driver.beforeCalibration) {
      await driver.beforeCalibration();
      log.push("settle");
    }
    const res: Array<number> = [];
    for (let i = 0; i < calibrationSamples; i++) {
      res.push(await driver.calibrate());
      log.push("calibrate");
    }
    return res;
  };
  const calibrationBefore = await block();
  const start = options.now();
  // The time of the readings before the samples: off the maxMs clock, so a scenario keeps as many samples as without them.
  let calibrationMs = 0;
  const elapsed = (): number => options.now() - start - calibrationMs;
  const warmups: Array<number> = [];
  for (let i = 0; i < options.warmup; i++) {
    warmups.push((await driver.sample()).ms);
    log.push("warmup");
  }
  const samples: Array<number> = [];
  const calibrationDuring: Array<number> = [];
  let phases: { [phase: string]: Array<number> } | undefined;
  while(samples.length < options.samples) {
    // maxMs is wall time from the first warm-up, setup and teardown included, the readings before the samples
    // excluded; at least minSamples are kept.
    if (samples.length >= options.minSamples && elapsed() >= options.maxMs) break;
    let s: Sample;
    if (driver.sampleWithReading) {
      // The driver took the reading before the sample's setup.
      const r = await driver.sampleWithReading();
      calibrationDuring.push(r.reading);
      calibrationMs += r.readingMs;
      log.push("calibrate");
      s = r;
    } else {
      const t = options.now();
      calibrationDuring.push(await driver.calibrate());
      calibrationMs += options.now() - t;
      log.push("calibrate");
      s = await driver.sample();
    }
    samples.push(s.ms);
    if (s.phases) {
      phases = phases || {};
      for (const key in s.phases) (phases[key] = phases[key] || []).push(s.phases[key]);
    }
    log.push("sample");
  }
  const wallMs = elapsed();
  const counters = await driver.counterRun();
  log.push("counters");
  const calibrationAfter = await block();
  return { samples: samples, phases: phases, warmups: warmups, calibrationBefore: calibrationBefore, calibrationDuring: calibrationDuring,
    calibrationAfter: calibrationAfter, counters: counters, wallMs: wallMs, log: log };
}

export interface ScenarioDriverOptions {
  now(): number;
  gc(): void | Promise<void>;
  calibrate(): number;
  installFunnels(): FunnelCounters;
  // Untimed, right after the timed run (the page measures frameMs and long tasks here).
  afterRun?(t0: number, t1: number): void | Promise<void>;
  // Untimed, after the teardown of every sample and of the counter run (the page settles here).
  afterSample?(): void | Promise<void>;
  // Untimed, before the 3 readings before the warm-ups and the 3 after the counter run (the page settles here).
  beforeCalibration?(): void | Promise<void>;
}

// The driver of a scenario that runs where the survey lives (a core process, or the page for browser actions):
// setup (untimed) -> gc -> timed run -> check (untimed) -> teardown.
export function scenarioDriver(scenario: PerfScenario, ctx: PerfContext, options: ScenarioDriverOptions): SampleDriver {
  const repeat = scenario.repeat || 1;
  const beforeCalibration = options.beforeCalibration;
  const runTimed = async(state: any): Promise<Sample> => {
    let phases: PhaseTimes | undefined;
    const t0 = options.now();
    for (let i = 0; i < repeat; i++) {
      const res = await scenario.run(ctx, state);
      if (res && typeof res === "object") {
        phases = phases || {};
        for (const key in res) phases[key] = (phases[key] || 0) + res[key];
      }
    }
    const t1 = options.now();
    if (options.afterRun) await options.afterRun(t0, t1);
    if (!phases) return { ms: t1 - t0 };
    let sum = 0;
    for (const key in phases) sum += phases[key];
    return { ms: sum, phases: phases };
  };
  return {
    sample: async(): Promise<Sample> => {
      const state = await scenario.setup(ctx);
      await options.gc();
      const s = await runTimed(state);
      if (scenario.record) await scenario.record(ctx, state);
      await scenario.check(ctx, state);
      if (scenario.teardown) await scenario.teardown(ctx, state);
      if (options.afterSample) await options.afterSample();
      return s;
    },
    counterRun: async(): Promise<Counters> => {
      const state = await scenario.setup(ctx);
      const funnels = options.installFunnels();
      let read: { [name: string]: number | null };
      try {
        funnels.reset();
        for (let i = 0; i < repeat; i++) await scenario.run(ctx, state);
        read = funnels.read();
      } finally {
        funnels.uninstall();
      }
      const counters: Counters = {};
      for (const key in read) counters[key] = work(read[key]);
      if (scenario.counters) Object.assign(counters, scenario.counters(ctx, state));
      if (scenario.record) await scenario.record(ctx, state);
      await scenario.check(ctx, state);
      if (scenario.teardown) await scenario.teardown(ctx, state);
      // The readings after the counter run come next; beforeCalibration settles before them, so a settle here
      // would only run twice in a row.
      if (options.afterSample && !beforeCalibration) await options.afterSample();
      return counters;
    },
    calibrate: async(): Promise<number> => options.calibrate(),
    beforeCalibration: beforeCalibration ? async(): Promise<void> => { await beforeCalibration(); } : undefined
  };
}
