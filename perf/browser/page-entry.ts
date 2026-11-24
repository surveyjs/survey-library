import { scenarioById } from "../scenarios/index.ts";
import { sampleLoop, scenarioDriver } from "../harness/sample.ts";
import { installFunnels, dom } from "../harness/counters.ts";
import { median, round2 } from "../harness/stats.ts";
import { renderCounters, durationInfo, leakCounters, heapGrowthCounters, heapInfo, untilQuiet } from "../harness/cdp.ts";
import type { CdpSnapshot } from "../harness/cdp.ts";
import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { missingRequirement } from "../harness/scenario.ts";
import { page, updated, settle, frame, delay, rootElement } from "./page-helpers.ts";

// The page harness of the browser suites (03), bundled into perf/results/.cache/perf-page.js with survey-core
// external: scenarios get the library only from window.Survey. It exposes window.PerfPage to the spec.
const W: any = globalThis;
const now = (): number => performance.now();
if (W.Survey) W.Survey.settings.animationEnabled = false;
// Page ready (03): the framework entry, React's createPortal and flushSync, Vue's app API and the survey plugin, the
// Angular app booted, a stylesheet that defines .sd-root-modern, the fonts.
async function ready(): Promise<Array<string>> {
  const problems: Array<string> = [];
  if (!W.Survey || !W.Survey.Model) problems.push("window.Survey is missing");
  if (W.SurveyReact) {
    if (!W.React || !W.ReactDOMClient || typeof W.ReactDOMClient.createRoot !== "function") problems.push("React 19 is missing");
    if (!W.ReactDOM || typeof W.ReactDOM.createPortal !== "function") problems.push("ReactDOM.createPortal is not a function");
    if (!W.ReactDOM || typeof W.ReactDOM.flushSync !== "function") problems.push("ReactDOM.flushSync is not a function");
  } else if (W.SurveyVue) {
    if (!W.Vue || typeof W.Vue.createApp !== "function" || typeof W.Vue.shallowRef !== "function") problems.push("Vue 3 is missing");
    if (!W.SurveyVue.SurveyComponent || !W.SurveyVue.surveyPlugin) problems.push("SurveyVue.SurveyComponent or surveyPlugin is missing");
  } else if (W.SurveyNgPerf) {
    try {
      await W.SurveyNgPerf.ready;
    } catch(e: any) {
      problems.push("the Angular app did not boot: " + String(e && e.message || e));
    }
  } else if (!W.SurveyUI || typeof W.SurveyUI.renderSurvey !== "function") {
    problems.push("SurveyUI.renderSurvey is missing");
  }
  const hasRule = Array.prototype.some.call(document.styleSheets, (sheet: any) => {
    try {
      return Array.prototype.some.call(sheet.cssRules, (rule: any) => (rule.selectorText || "").indexOf(".sd-root-modern") > -1);
    } catch(e) {
      return false;
    }
  });
  if (!hasRule) problems.push("no stylesheet defines .sd-root-modern");
  if (document.fonts.status !== "loaded") problems.push("fonts: " + document.fonts.status);
  return problems;
}

function context(scenario: PerfScenario, fixture: any): PerfContext {
  return { Survey: W.Survey, fixture: fixture, platform: "browser", now: now, cache: {}, page: page };
}

function gc(): void {
  if (typeof W.gc === "function") W.gc();
}

// A CDP snapshot through the spec's bridge (cdp-metrics.ts); null without it.
async function metrics(): Promise<CdpSnapshot> {
  return typeof W.__perfMetrics === "function" ? await W.__perfMetrics() : null;
}

// Twice, a task apart: what the first collection frees through finalizers goes in the second. Through the spec's
// bridge when there is one (cdp-metrics.ts: no JS on the stack), else gc().
async function fullGc(): Promise<void> {
  const collect = typeof W.__perfCollectGarbage === "function" ? (): Promise<void> => W.__perfCollectGarbage() : async(): Promise<void> => gc();
  await collect();
  await delay(0);
  await collect();
}

// The end of the counter run's CDP window: after the runs, frame after frame (a frame and a task each) until the
// rendering is quiet (harness/cdp.ts, untilQuiet), so the ResizeObserver -> rAF -> layout work an action starts counts
// whole; the settle's timers do not.
async function afterRunMetrics(): Promise<CdpSnapshot> {
  const res = await untilQuiet(metrics, async(): Promise<void> => { await frame(); await delay(0); }, { quietFrames: 2, maxFrames: 60 });
  return res.snapshot;
}

// The V8 and Blink heaps through the spec's bridge (Runtime.getHeapUsage); null without it.
async function heapUsage(): Promise<CdpSnapshot> {
  return typeof W.__perfHeapUsage === "function" ? await W.__perfHeapUsage() : null;
}

// A leak snapshot: the metrics and the heaps, after a full collection.
async function leakSnapshot(): Promise<CdpSnapshot> {
  await fullGc();
  const m = await metrics();
  const h = await heapUsage();
  return m || h ? Object.assign({}, m, h) : null;
}

// info.jsHeapMB and info.blinkHeapMB after a full collection; none without the bridge.
async function heapNow(): Promise<{ [name: string]: number }> {
  await fullGc();
  return heapInfo(await heapUsage());
}

function applyBrowser(scenario: PerfScenario): PerfScenario {
  return scenario.browser ? Object.assign({}, scenario, scenario.browser) : scenario;
}

function getScenario(id: string): PerfScenario {
  const s = scenarioById(id);
  if (!s) throw new Error("Unknown scenario " + id);
  W.Survey.settings.animationEnabled = false;
  return applyBrowser(s);
}

// Long tasks inside the sample windows.
const windows: Array<[number, number]> = [];
const longTasks: Array<{ start: number, duration: number }> = [];
try {
  new PerformanceObserver((list: any) => {
    list.getEntries().forEach((e: any) => longTasks.push({ start: e.startTime, duration: e.duration }));
  }).observe({ type: "longtask", buffered: true } as any);
} catch(e) {
  // No longtask entries in this browser: longTaskMs stays 0.
}
function longTaskMsPerSample(): number {
  // The task that holds the action starts before t0, so a task counts by its overlap with the window.
  const per = windows.map((w: [number, number]) => longTasks.reduce((n: number, t: any) => n + Math.max(0, Math.min(w[1], t.start + t.duration) - Math.max(w[0], t.start)), 0));
  return per.length ? round2(median(per)) : 0;
}

// An action scenario: the page loaded and rendered the fixture already; warm-ups, samples and statistics run here,
// in one evaluate.
async function runAction(id: string, fixture: any, options: any): Promise<any> {
  const scenario = getScenario(id);
  const skip = missingRequirement(W.Survey, scenario.requires);
  if (skip) return { skipped: skip };
  const ctx = context(scenario, fixture);
  const frames: Array<number> = [];
  let runBefore: CdpSnapshot = null;
  let durations: { [name: string]: number } = {};
  const driver = scenarioDriver(scenario, ctx, {
    now: now, gc: gc,
    installFunnels: () => installFunnels(W.Survey),
    afterRun: async(t0: number, t1: number): Promise<void> => {
      windows.push([t0, t1]);
      await frame();
      await delay(0);
      frames.push(now() - t0);
    },
    afterSample: settle,
    beforeCounterRun: async(): Promise<void> => { runBefore = await metrics(); },
    afterCounterRun: async(): Promise<any> => {
      const after = await afterRunMetrics();
      durations = durationInfo(runBefore, after);
      return renderCounters(runBefore, after);
    }
  });
  // The leak snapshots: after the first sample (not the warm-ups: harness/cdp.ts, leakCounters) and after the last one,
  // each after a full gc.
  let samplesBefore: CdpSnapshot = null;
  let samplesAfter: CdpSnapshot = null;
  let measured = -1;
  const takeSample = driver.sample;
  driver.sample = async(): Promise<any> => {
    const s = await takeSample();
    if (measured > -1 && ++measured === 1) samplesBefore = await leakSnapshot();
    return s;
  };
  driver.beforeSamples = async(): Promise<void> => { measured = 0; };
  driver.afterSamples = async(): Promise<void> => { samplesAfter = await leakSnapshot(); };
  const res = await sampleLoop(driver, { warmup: scenario.warmup === undefined ? 1 : scenario.warmup, samples: scenario.samples || 7,
    maxMs: scenario.maxMs || options.maxMs, minSamples: 5, now: now });
  res.counters.domNodes = dom(rootElement().querySelectorAll("*").length);
  Object.assign(res.counters, leakCounters(samplesBefore, samplesAfter, res.samples.length - 1),
    heapGrowthCounters(samplesBefore, samplesAfter, res.samples.length - 1));
  const heap = await heapNow();
  return {
    samples: res.samples, phases: res.phases, counters: res.counters,
    info: Object.assign({ kept: res.samples.length, warmups: res.warmups.length, wallMs: Math.round(res.wallMs), frameMs: round2(median(frames)),
      longTaskMs: longTaskMsPerSample() }, heap, durations),
    jsonErrors: ctx.cache.jsonErrors || 0, repeat: scenario.repeat, counterOnly: scenario.counterOnly, tolerance: scenario.tolerance, rev: scenario.rev
  };
}

// One sample of a load scenario in this fresh page: setup, gc, timed run, check.
async function loadSample(id: string, fixture: any): Promise<any> {
  const scenario = getScenario(id);
  const skip = missingRequirement(W.Survey, scenario.requires);
  if (skip) return { skipped: skip };
  const ctx = context(scenario, fixture);
  const state = await scenario.setup(ctx);
  gc();
  const t0 = now();
  const phases = await scenario.run(ctx, state);
  const t1 = now();
  windows.push([t0, t1]);
  await scenario.check(ctx, state);
  let ms = t1 - t0;
  if (phases && typeof phases === "object") {
    ms = 0;
    for (const key in phases) ms += (phases as any)[key];
  }
  return { ms: ms, phases: phases || undefined, jsonErrors: ctx.cache.jsonErrors || 0, longTaskMs: longTaskMsPerSample(), rev: scenario.rev,
    tolerance: scenario.tolerance, counterOnly: scenario.counterOnly };
}

// The counter run of a load scenario, in a fresh page of its own.
async function loadCounters(id: string, fixture: any): Promise<any> {
  const scenario = getScenario(id);
  const ctx = context(scenario, fixture);
  const state = await scenario.setup(ctx);
  const funnels = installFunnels(W.Survey);
  funnels.reset();
  const before = await metrics();
  await scenario.run(ctx, state);
  const read = funnels.read();
  const after = await afterRunMetrics();
  funnels.uninstall();
  await settle();
  const counters: any = {};
  for (const key in read) counters[key] = { value: read[key], kind: "work" };
  counters.domNodes = dom(rootElement().querySelectorAll("*").length);
  Object.assign(counters, renderCounters(before, after));
  await scenario.check(ctx, state);
  return { counters: counters, durations: durationInfo(before, after), heap: await heapNow() };
}

// Shows the fixture before an action scenario starts: untimed.
async function prepare(): Promise<void> {
  W.Survey.settings.animationEnabled = false;
  await settle();
}

// 03's probe: survey.nextPage() from page code, and the new page in the DOM at the end of updated().
async function nextPageProbe(): Promise<any> {
  const survey = new W.Survey.Model({ pages: [{ name: "p1", elements: [{ type: "text", name: "a" }] }, { name: "p2", elements: [{ type: "text", name: "b" }] }] });
  await page.show(survey);
  survey.nextPage();
  await updated();
  const found = !!document.querySelector("[data-name=\"b\"]");
  return { found: found };
}

W.PerfPage = { ready: ready, prepare: prepare, runAction: runAction, loadSample: loadSample, loadCounters: loadCounters,
  nextPageProbe: nextPageProbe };
