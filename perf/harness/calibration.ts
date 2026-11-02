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

export function calibrationResult(before: Array<number>, after: Array<number>): CalibrationResult {
  const r = (v: number): number => Math.round(v * 100) / 100;
  return { median: r(median(before.concat(after))), before: r(median(before)), after: r(median(after)) };
}
