import { scenarioById } from "../scenarios/index.ts";
import { sampleLoop, scenarioDriver } from "../harness/sample.ts";
import { calibrateOnce, calibrationResult } from "../harness/calibration.ts";
import { installFunnels, dom } from "../harness/counters.ts";
import { median, round2 } from "../harness/stats.ts";
import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { missingRequirement } from "../harness/scenario.ts";
import { page, updated, settle, frame, delay, rootElement } from "./page-helpers.ts";

// The page harness of the browser suites (03), bundled into perf/results/.cache/perf-page.js with survey-core
// external: scenarios get the library only from window.Survey. It exposes window.PerfPage to the spec.
const W: any = globalThis;
const now = (): number => performance.now();
if (W.Survey) W.Survey.settings.animationEnabled = false;
// Page ready (03): the framework entry, React's createPortal and flushSync, a stylesheet that defines .sd-root-modern,
// the fonts.
function ready(): Array<string> {
  const problems: Array<string> = [];
  if (!W.Survey || !W.Survey.Model) problems.push("window.Survey is missing");
  if (W.SurveyReact) {
    if (!W.React || !W.ReactDOMClient || typeof W.ReactDOMClient.createRoot !== "function") problems.push("React 19 is missing");
    if (!W.ReactDOM || typeof W.ReactDOM.createPortal !== "function") problems.push("ReactDOM.createPortal is not a function");
    if (!W.ReactDOM || typeof W.ReactDOM.flushSync !== "function") problems.push("ReactDOM.flushSync is not a function");
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

function heapMB(): number | null {
  gc();
  const mem = (performance as any).memory;
  return mem ? round2(mem.usedJSHeapSize / 1048576) : null;
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

// An action scenario: the page loaded and rendered the fixture already; calibration, warm-ups, samples and
// statistics run here, in one evaluate.
async function runAction(id: string, fixture: any, options: any): Promise<any> {
  const scenario = getScenario(id);
  const skip = missingRequirement(W.Survey, scenario.requires);
  if (skip) return { skipped: skip };
  const ctx = context(scenario, fixture);
  const frames: Array<number> = [];
  const driver = scenarioDriver(scenario, ctx, {
    now: now, gc: gc, calibrate: (): number => calibrateOnce(now),
    installFunnels: () => installFunnels(W.Survey),
    afterRun: async(t0: number, t1: number): Promise<void> => {
      windows.push([t0, t1]);
      await frame();
      await delay(0);
      frames.push(now() - t0);
    },
    afterSample: settle
  });
  const res = await sampleLoop(driver, { warmup: scenario.warmup === undefined ? 1 : scenario.warmup, samples: scenario.samples || 7,
    maxMs: scenario.maxMs || options.maxMs, minSamples: 5, now: now });
  res.counters.domNodes = dom(rootElement().querySelectorAll("*").length);
  return {
    samples: res.samples, phases: res.phases, calibration: calibrationResult(res.calibrationBefore, res.calibrationAfter), counters: res.counters,
    info: { kept: res.samples.length, warmups: res.warmups.length, wallMs: Math.round(res.wallMs), frameMs: round2(median(frames)),
      longTaskMs: longTaskMsPerSample(), heapMB: heapMB() },
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
  await scenario.run(ctx, state);
  const read = funnels.read();
  funnels.uninstall();
  await settle();
  const counters: any = {};
  for (const key in read) counters[key] = { value: read[key], kind: "work" };
  counters.domNodes = dom(rootElement().querySelectorAll("*").length);
  await scenario.check(ctx, state);
  return { counters: counters, heapMB: heapMB() };
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
  calibrate: (): number => calibrateOnce(now), nextPageProbe: nextPageProbe };
