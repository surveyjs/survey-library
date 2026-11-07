import { createRng } from "../fixtures/random.ts";
import { median } from "./stats.ts";

// Fixed work independent of survey-core and of the fixture (00, Measurement rules): sort a seeded Float64Array of
// 10^5 numbers and JSON round-trip a fixed ~200 KB object. A process in the laptop's slow mode shows it here.
let numbers: Float64Array | undefined;
let object: any;

function prepare(): void {
  if (numbers) return;
  const rng = createRng(20261028);
  numbers = new Float64Array(100000);
  for (let i = 0; i < numbers.length; i++) numbers[i] = rng.next();
  const items: Array<any> = [];
  for (let i = 0; i < 2000; i++) {
    items.push({ id: i, name: rng.words(3), value: rng.int(0, 100000), flags: [rng.chance(0.5), rng.chance(0.5)], tags: [rng.word(), rng.word()] });
  }
  object = { items: items };
}

export const calibrationSamples = 3;

// One calibration sample in ms. The checksum keeps the work from being optimized away.
export function calibrateOnce(now: () => number): number {
  prepare();
  const start = now();
  const copy = (numbers as Float64Array).slice();
  copy.sort();
  const clone = JSON.parse(JSON.stringify(object));
  const elapsed = now() - start;
  if (copy[0] > copy[copy.length - 1] || clone.items.length !== 2000) throw new Error("calibration: wrong result");
  return elapsed;
}

// Drops the fixed work's data: a load sample's page calls it after its reading, so the sample runs with the heap it
// had before the page took readings.
export function releaseCalibration(): void {
  numbers = undefined;
  object = undefined;
}

export function calibrate(now: () => number, count: number = calibrationSamples): Array<number> {
  const res: Array<number> = [];
  for (let i = 0; i < count; i++) res.push(calibrateOnce(now));
  return res;
}

export interface CalibrationResult {
  median: number;
  before: number;
  after: number;
}

// Every reading of one scenario (info.calibrationReadings), in ms rounded to 0.01: 3 before the warm-ups, one before
// the setup of every kept sample, 3 after the counter run.
export interface CalibrationReadings {
  before: Array<number>;
  during: Array<number>;
  after: Array<number>;
}

const round = (v: number): number => Math.round(v * 100) / 100;

export function calibrationReadings(before: Array<number>, during: Array<number>, after: Array<number>): CalibrationReadings {
  return { before: before.map(round), during: during.map(round), after: after.map(round) };
}

// before and after: the medians of their 3. median: of the reading before every sample plus before and after as one
// value each, since a block's 3 readings are taken back to back in ~45 ms and are one observation. So the readings
// next to the samples are always the majority: a burst that hits one block or a few readings moves it little, and a
// process that runs slow throughout moves it fully. Not the minimum: a fast reading after an idle moment would hide
// the slow mode the calibration is for. Computed from the rounded readings, so a reader can recompute all three from
// info.calibrationReadings.
export function calibrationResult(readings: CalibrationReadings): CalibrationResult {
  const before = round(median(readings.before));
  const after = round(median(readings.after));
  return { median: round(median(readings.during.concat([before, after]))), before: before, after: after };
}
