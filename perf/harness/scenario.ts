import type { Counters } from "./counters.ts";

// The scenario shape shared by the core runner and the browser page (02, The harness). A scenario never imports
// survey-core: it gets the target's module as ctx.Survey.
export type ScenarioKind = "load" | "action";
export type PhaseTimes = { [phase: string]: number };

export interface PerfFixture {
  key: string;
  json: any;
  // JSON.stringify(json): load scenarios parse it inside the timed run, the same in core and in the browser.
  text: string;
  data?: any;
  meta: any;
}

// The page side of a browser suite (03); element arguments are DOM elements, typed loosely so the harness stays
// platform-neutral.
export interface PerfPage {
  framework: "react" | "survey-js-ui";
  // Renders the survey into #root (the survey shown before is unmounted and disposed), then settles.
  show(survey: any): Promise<void>;
  // The end of the framework update: two MessageChannel hops, then a forced layout (03, the clock).
  updated(): Promise<void>;
  // Renders a survey and waits for updated(), without the settle: the paint phase of a load.
  render(survey: any): Promise<void>;
  // element.click() on the first match, then updated().
  click(selector: string): Promise<void>;
  // The native value setter, then bubbling input and change events, then updated().
  commit(element: any, value: string): Promise<void>;
  // Characters one by one (native setter, input, keyup), then change; updated() after the last one.
  type(element: any, text: string): Promise<void>;
  query(selector: string): any;
  queryAll(selector: string): Array<any>;
}

export interface PerfContext {
  Survey: any;
  fixture: PerfFixture;
  platform: "node" | "browser";
  now(): number;
  // Per process (core) or per page (browser): what a scenario keeps between samples, and the jsonErrors count of
  // the last survey it loaded.
  cache: { [key: string]: any };
  // Browser only (03): the DOM helpers of the page.
  page?: PerfPage;
}

export interface PerfScenario<S = any> {
  id: string;
  rev: number;
  fixture: string;
  kind: ScenarioKind;
  // "<class>.<property>", checked with Serializer.findProperty before anything runs.
  requires?: Array<string>;
  // Helpers of perf/scenarios/helpers.ts the scenario calls: their source is part of its rev hash.
  uses?: Array<string>;
  setup(ctx: PerfContext): S | Promise<S>;
  run(ctx: PerfContext, state: S): void | PhaseTimes | Promise<void | PhaseTimes>;
  // Untimed, right after the timed run, before check: the page reads the DOM fact the action changed (03).
  record?(ctx: PerfContext, state: S): void | Promise<void>;
  // After every sample, warm-ups too: throws if the action did not happen.
  check(ctx: PerfContext, state: S): void | Promise<void>;
  teardown?(ctx: PerfContext, state: S): void | Promise<void>;
  counters?(ctx: PerfContext, state: S): Counters;
  // The action k times in one sample, so a sample is long enough to judge.
  repeat?: number;
  counterOnly?: boolean;
  samples?: number;
  warmup?: number;
  maxMs?: number;
  tolerance?: number;
  // What differs in a browser suite (03): a sample there also renders, so it may be long enough to judge.
  browser?: { counterOnly?: boolean, repeat?: number, samples?: number, warmup?: number, maxMs?: number };
}

export const scenarioIdPattern = /^((?:records-1k|records-10k|large|expressions|expressions-x2|calculations|complexLogic|manyPages)|extra\/[^/]+)\/(load|answer|pages|records|output)\/([A-Za-z0-9-]+)(@[A-Za-z0-9_]+)?$/;

export function fixtureOfId(id: string): string {
  const m = scenarioIdPattern.exec(id);
  if (!m) throw new Error("Not a scenario id: " + id);
  return m[1];
}

export function defineScenarios(list: Array<PerfScenario>): Array<PerfScenario> {
  const seen = new Set<string>();
  list.forEach((s: PerfScenario) => {
    if (!scenarioIdPattern.test(s.id)) throw new Error("Not a scenario id: " + s.id);
    if (typeof s.check !== "function") throw new Error("Scenario " + s.id + " has no check");
    if (typeof s.setup !== "function" || typeof s.run !== "function") throw new Error("Scenario " + s.id + " needs setup and run");
    if (fixtureOfId(s.id) !== s.fixture) throw new Error("Scenario " + s.id + " names fixture " + s.fixture);
    if (!(s.rev >= 1)) throw new Error("Scenario " + s.id + " has no rev");
    if (seen.has(s.id)) throw new Error("Duplicate scenario " + s.id);
    seen.add(s.id);
  });
  return list;
}

// A check's assertion: platform-neutral, so the page needs no test library.
export function expectThat(condition: any, message: string): void {
  if (!condition) throw new Error("check failed: " + message);
}

export function expectEqual(actual: any, expected: any, message: string): void {
  if (actual !== expected) throw new Error("check failed: " + message + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
}

// The first "<class>.<property>" of requires the build lacks, as a skip reason; "" when it has them all.
export function missingRequirement(Survey: any, requires: Array<string> | undefined): string {
  for (const req of requires || []) {
    const parts = req.split(".");
    if (!Survey.Serializer.findProperty(parts[0], parts[1])) return "not in this build: " + req;
  }
  return "";
}
