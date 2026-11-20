import type { Counters } from "./counters.ts";
import { render, leak, heap } from "./counters.ts";
import { round2 } from "./stats.ts";

// CDP Performance.getMetrics readings of a browser suite. The spec exposes them to the page as __perfMetrics()
// (perf/browser/cdp-metrics.ts); the page takes a snapshot before and after what it counts. The metrics are cumulative
// since Performance.enable, so a counter is the difference of two snapshots; the durations are seconds.
// Platform-neutral: no Playwright here.
export const cdpMetricNames: ReadonlyArray<string> = ["LayoutCount", "RecalcStyleCount", "LayoutDuration", "RecalcStyleDuration",
  "ScriptDuration", "JSEventListeners", "Nodes"];

// null: no bridge (a page opened outside the spec), so the counters are null, as a funnel the build lacks.
export type CdpSnapshot = { [name: string]: number } | null;

export function pickMetrics(list: ReadonlyArray<{ name: string, value: number }>): { [name: string]: number } {
  const res: { [name: string]: number } = {};
  list.forEach((m: { name: string, value: number }) => { if (cdpMetricNames.indexOf(m.name) > -1) res[m.name] = m.value; });
  return res;
}

function delta(before: CdpSnapshot, after: CdpSnapshot, name: string): number | null {
  if (!before || !after || typeof before[name] !== "number" || typeof after[name] !== "number") return null;
  return after[name] - before[name];
}

// The end of a render window: frame after frame (wait), until the layout and recalc counts stay the same for
// quietFrames frames in a row. A fixed number of frames cut the work an action starts at a random point: survey-core's
// ResizeObserver callbacks (ResponsivityManager, question responsiveness) measure in a rAF of the next frame, and
// whether that rAF ran before the snapshot depended on the order of the rAF requests. No quiet within maxFrames, or
// no bridge: a null snapshot, so the counters are null rather than a cut-off count.
export async function untilQuiet(snapshot: () => Promise<CdpSnapshot>, wait: () => Promise<void>,
  options: { quietFrames: number, maxFrames: number }): Promise<{ snapshot: CdpSnapshot, frames: number }> {
  await wait();
  let frames = 1;
  let last = await snapshot();
  if (!last) return { snapshot: null, frames: frames };
  let quiet = 0;
  while(frames < options.maxFrames) {
    await wait();
    frames++;
    const next = await snapshot();
    if (!next) return { snapshot: null, frames: frames };
    quiet = next.LayoutCount === last.LayoutCount && next.RecalcStyleCount === last.RecalcStyleCount ? quiet + 1 : 0;
    last = next;
    if (quiet >= options.quietFrames) return { snapshot: next, frames: frames };
  }
  return { snapshot: null, frames: frames };
}

// Layouts and style recalcs in a window of the counter run (kind "render").
export function renderCounters(before: CdpSnapshot, after: CdpSnapshot): Counters {
  return { layoutCount: render(delta(before, after, "LayoutCount")), recalcStyleCount: render(delta(before, after, "RecalcStyleCount")) };
}

// The same window's durations in ms, for info: times, as noisy as the samples, not counts.
export function durationInfo(before: CdpSnapshot, after: CdpSnapshot): { [name: string]: number } {
  const res: { [name: string]: number } = {};
  const names: { [name: string]: string } = { layoutMs: "LayoutDuration", recalcStyleMs: "RecalcStyleDuration", scriptMs: "ScriptDuration" };
  for (const key in names) {
    const d = delta(before, after, names[key]);
    if (d !== null) res[key] = round2(d * 1000);
  }
  return res;
}

// The used sizes of Runtime.getHeapUsage, in bytes, as snapshot fields: usedSize is the V8 heap, embedderHeapUsedSize
// Blink's (Oilpan: DOM nodes, styles, layout objects). A Chromium without the embedder heap has no BlinkHeapUsed.
export function pickHeapUsage(res: { usedSize: number, embedderHeapUsedSize?: number }): { [name: string]: number } {
  const snap: { [name: string]: number } = { JSHeapUsed: res.usedSize };
  if (typeof res.embedderHeapUsedSize === "number") snap.BlinkHeapUsed = res.embedderHeapUsedSize;
  return snap;
}

// The heaps in MB for info.
export function heapInfo(snap: CdpSnapshot): { [name: string]: number } {
  const res: { [name: string]: number } = {};
  if (snap && typeof snap.JSHeapUsed === "number") res.jsHeapMB = round2(snap.JSHeapUsed / 1048576);
  if (snap && typeof snap.BlinkHeapUsed === "number") res.blinkHeapMB = round2(snap.BlinkHeapUsed / 1048576);
  return res;
}

// Heap growth per sample cycle in KB, in the same snapshots as leakCounters (kind "heap"). Observed: not 0 without a
// leak, and different between runs (V8's by a few percent: JIT code, V8's caches; Blink's by up to a few KB).
export function heapGrowthCounters(before: CdpSnapshot, after: CdpSnapshot, cycles: number): Counters {
  const perCycle = (name: string): number | null => {
    const d = delta(before, after, name);
    return d === null || !(cycles > 0) ? null : round2(d / cycles / 1024);
  };
  return { jsHeapGrowth: heap(perCycle("JSHeapUsed")), blinkHeapGrowth: heap(perCycle("BlinkHeapUsed")) };
}

// Listener and node growth per sample cycle of an action scenario, both snapshots after a full gc (kind "leak"). The
// page takes the first snapshot after the first sample, not after the warm-ups: a page often keeps something once (a
// cache, the previous tree) in that sample and never more, which is no leak. Per cycle, because the number of samples
// a scenario keeps depends on the machine.
export function leakCounters(before: CdpSnapshot, after: CdpSnapshot, cycles: number): Counters {
  const perCycle = (name: string): number | null => {
    const d = delta(before, after, name);
    return d === null || !(cycles > 0) ? null : round2(d / cycles);
  };
  return { listenerGrowth: leak(perCycle("JSEventListeners")), nodeGrowth: leak(perCycle("Nodes")) };
}
