import type { PerfScenario, PerfContext, PhaseTimes } from "./scenario.ts";
import type { Counters, FunnelCounters } from "./counters.ts";
import { work } from "./counters.ts";
import { calibrationSamples } from "./calibration.ts";

// The sample loop (02, The harness). A driver takes one sample; the loop decides how many, keeps the order
// calibration -> warm-ups -> samples -> counter run -> calibration, and enforces maxMs.
export interface Sample {
  ms: number;
  phases?: PhaseTimes;
}

export interface SampleDriver {
  sample(): Promise<Sample>;
  // One extra untimed run with the funnels installed.
  counterRun(): Promise<Counters>;
  calibrate(): Promise<number>;
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
  calibrationAfter: Array<number>;
  counters: Counters;
  wallMs: number;
  // The order the steps ran in, for the unit test.
  log: Array<string>;
}

export async function sampleLoop(driver: SampleDriver, options: SampleOptions): Promise<SampleResult> {
  const log: Array<string> = [];
  const calibrationBefore: Array<number> = [];
  for (let i = 0; i < calibrationSamples; i++) {
    calibrationBefore.push(await driver.calibrate());
    log.push("calibrate");
  }
  const start = options.now();
  const warmups: Array<number> = [];
  for (let i = 0; i < options.warmup; i++) {
    warmups.push((await driver.sample()).ms);
    log.push("warmup");
  }
  const samples: Array<number> = [];
  let phases: { [phase: string]: Array<number> } | undefined;
  while(samples.length < options.samples) {
    // maxMs is wall time from the first warm-up, setup and teardown included; at least minSamples are kept.
    if (samples.length >= options.minSamples && options.now() - start >= options.maxMs) break;
    const s = await driver.sample();
    samples.push(s.ms);
    if (s.phases) {
      phases = phases || {};
      for (const key in s.phases) (phases[key] = phases[key] || []).push(s.phases[key]);
    }
    log.push("sample");
  }
  const wallMs = options.now() - start;
  const counters = await driver.counterRun();
  log.push("counters");
  const calibrationAfter: Array<number> = [];
  for (let i = 0; i < calibrationSamples; i++) {
    calibrationAfter.push(await driver.calibrate());
    log.push("calibrate");
  }
  return { samples: samples, phases: phases, warmups: warmups, calibrationBefore: calibrationBefore, calibrationAfter: calibrationAfter,
    counters: counters, wallMs: wallMs, log: log };
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
}

// The driver of a scenario that runs where the survey lives (a core process, or the page for browser actions):
// setup (untimed) -> gc -> timed run -> check (untimed) -> teardown.
export function scenarioDriver(scenario: PerfScenario, ctx: PerfContext, options: ScenarioDriverOptions): SampleDriver {
  const repeat = scenario.repeat || 1;
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
      if (options.afterSample) await options.afterSample();
      return counters;
    },
    calibrate: async(): Promise<number> => options.calibrate()
  };
}
