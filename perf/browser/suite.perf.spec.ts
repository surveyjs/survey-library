import { test, chromium } from "@playwright/test";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { splitOnly } from "../harness/ids.ts";
import { scenarioById } from "../scenarios/index.ts";
import { getFixture } from "../fixtures/index.ts";
import { readEnv } from "../harness/node/env.ts";
import { summarize, median } from "../harness/stats.ts";
import { calibrationResult } from "../harness/calibration.ts";
import { sampleLoop } from "../harness/sample.ts";
import type { ResultEntry } from "../harness/node/result.ts";
import { suiteOf, resolveUrl, uiPackage } from "./paths.ts";

// The browser suite (03): one fresh context and page per scenario (and per sample of a load scenario), in a browser
// this file launches. Every request goes to http://perf.local/ and is answered from the target's builds; any other
// host fails at once (B01).
const suite = suiteOf();
const env = readEnv();
const split = splitOnly(env.only, suite);
const pageUrl = "http://perf.local/page/" + uiPackage[suite].page;
const loadOptions = { samples: 7, maxMs: 8000, minSamples: 5 };
let browser: Browser;
const failedRequests: Array<string> = [];

test.beforeAll(async() => {
  browser = await chromium.launch({ headless: true, args: ["--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE perf.local, EXCLUDE localhost",
    "--js-flags=--expose-gc", "--enable-precise-memory-info"] });
});

test.afterAll(async() => {
  if (browser) await browser.close();
});

async function openPage(): Promise<{ context: BrowserContext, page: Page }> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  await context.route("**/*", async(route: any) => {
    const file = resolveUrl(route.request().url(), suite);
    if (file) await route.fulfill({ path: file });
    else await route.abort();
  });
  const page = await context.newPage();
  page.on("requestfailed", (r: any) => failedRequests.push(r.url()));
  page.on("pageerror", (e: any) => failedRequests.push("pageerror: " + String(e && e.message)));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(pageUrl);
  const problems = await page.evaluate(() => (window as any).PerfPage.ready());
  if (problems.length > 0) throw new Error("page not ready: " + problems.join("; "));
  return { context: context, page: page };
}

function fixtureFor(key: string): any {
  const f = getFixture(key);
  return { key: f.key, json: f.json, text: JSON.stringify(f.json), data: f.data, meta: f.meta };
}

function entryOf(id: string, r: any, samples: Array<number>, phases: any): ResultEntry {
  const stats = summarize(samples);
  let ph: any;
  if (phases) {
    ph = {};
    for (const key in phases) {
      const p = summarize(phases[key]);
      ph[key] = { median: p.median, min: p.min };
    }
  }
  const entry: ResultEntry = { id: id, rev: r.rev, unit: "ms", samples: samples.map((v: number) => Math.round(v * 100) / 100), median: stats.median,
    min: stats.min, max: stats.max, mad: stats.mad, calibration: r.calibration, phases: ph, counters: r.counters, info: r.info,
    jsonErrors: r.jsonErrors, tolerance: r.tolerance === undefined ? null : r.tolerance, local: false };
  if (r.repeat) entry.repeat = r.repeat;
  if (r.counterOnly) entry.counterOnly = true;
  return entry;
}

async function runAction(id: string, fixture: any): Promise<any> {
  const { context, page } = await openPage();
  try {
    const res = await page.evaluate(async(arg: any) => {
      const P = (window as any).PerfPage;
      await P.prepare();
      return P.runAction(arg.id, arg.fixture, { maxMs: arg.maxMs });
    }, { id: id, fixture: fixture, maxMs: loadOptions.maxMs });
    if (res.skipped) return { skipped: res.skipped };
    return { entry: entryOf(id, res, res.samples, res.phases) };
  } finally {
    await context.close();
  }
}

// A load scenario: Node runs the sample loop; each sample is a new context, a page and one evaluate. Calibration
// runs in a fresh page of its own before the first sample and after the last.
async function runLoad(id: string, fixture: any): Promise<any> {
  let calibrationPage: { context: BrowserContext, page: Page } | undefined;
  let skipped = "";
  let last: any = {};
  const longTasks: Array<number> = [];
  const closeCalibration = async(): Promise<void> => {
    if (calibrationPage) await calibrationPage.context.close();
    calibrationPage = undefined;
  };
  const res = await sampleLoop({
    calibrate: async(): Promise<number> => {
      if (!calibrationPage) calibrationPage = await openPage();
      return calibrationPage.page.evaluate(() => (window as any).PerfPage.calibrate());
    },
    sample: async(): Promise<any> => {
      await closeCalibration();
      if (skipped) return { ms: 0 };
      const { context, page } = await openPage();
      try {
        const r = await page.evaluate((arg: any) => (window as any).PerfPage.loadSample(arg.id, arg.fixture), { id: id, fixture: fixture });
        if (r.skipped) skipped = r.skipped;
        last = r;
        if (typeof r.longTaskMs === "number") longTasks.push(r.longTaskMs);
        return { ms: r.ms || 0, phases: r.phases };
      } finally {
        await context.close();
      }
    },
    counterRun: async(): Promise<any> => {
      if (skipped) return {};
      const { context, page } = await openPage();
      try {
        const r = await page.evaluate((arg: any) => (window as any).PerfPage.loadCounters(arg.id, arg.fixture), { id: id, fixture: fixture });
        last.heapMB = r.heapMB;
        return r.counters;
      } finally {
        await context.close();
      }
    }
  }, { warmup: 0, samples: loadOptions.samples, maxMs: loadOptions.maxMs, minSamples: loadOptions.minSamples, now: () => performance.now() });
  await closeCalibration();
  if (skipped) return { skipped: skipped };
  const r = Object.assign({}, last, { calibration: calibrationResult(res.calibrationBefore, res.calibrationAfter), counters: res.counters,
    info: { kept: res.samples.length, warmups: 0, wallMs: Math.round(res.wallMs), longTaskMs: longTasks.length ? median(longTasks) : 0, heapMB: last.heapMB } });
  return { entry: entryOf(id, r, res.samples, res.phases) };
}

test("environment", async({ browserName }, testInfo: any) => {
  const { context, page } = await openPage();
  try {
    const probe = await page.evaluate(() => (window as any).PerfPage.nextPageProbe());
    const framework = await page.evaluate(() => ({ react: (window as any).React ? (window as any).React.version : undefined }));
    await testInfo.attach("perf-environment", { contentType: "application/json",
      body: JSON.stringify({ chromium: browser.version(), framework: framework, nextPageProbe: probe, notInSuite: split.notInSuite }) });
    if (!probe.found) throw new Error("survey.nextPage() from page code: the new page is not in the DOM at the end of the update");
  } finally {
    await context.close();
  }
});

for (const id of split.run) {
  test(id, async({ browserName }, testInfo: any) => {
    const scenario = scenarioById(id);
    if (!scenario) throw new Error("Unknown scenario " + id);
    const fixture = fixtureFor(scenario.fixture);
    // The Chromium version for the machine key, from every test (R03-F3: not only from the environment test).
    await testInfo.attach("perf-browser", { contentType: "application/json", body: JSON.stringify({ chromium: browser.version() }) });
    const before = failedRequests.length;
    const res = scenario.kind === "load" ? await runLoad(id, fixture) : await runAction(id, fixture);
    if (failedRequests.length > before) res.requestfailed = failedRequests.slice(before);
    await testInfo.attach("perf-result", { contentType: "application/json", body: JSON.stringify(res) });
    if (res.requestfailed) throw new Error("requests failed: " + res.requestfailed.join(", "));
  });
}
