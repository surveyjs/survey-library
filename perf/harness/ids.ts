// The fixture keys and every scenario id with the suites that run it (00, Ids). The same operation has the same id
// in core and in the browser. 03 adds the browser suites.
export const FIXTURE_KEYS = ["large", "expressions", "calculations", "complexLogic", "manyPages", "records-1k", "records-10k"] as const;
export type FixtureKey = typeof FIXTURE_KEYS[number];

export type Suite = "core" | "react" | "survey-js-ui";
export const SUITES: ReadonlyArray<Suite> = ["core", "react", "survey-js-ui"];

export interface ScenarioIdInfo {
  id: string;
  suites: Array<Suite>;
}

const core: Array<string> = [];
const add = (fixture: string, group: string, ops: Array<string>, question?: string): void => {
  ops.forEach((op: string) => core.push(fixture + "/" + group + "/" + op + (question ? "@" + question : "")));
};
FIXTURE_KEYS.forEach((key: string) => add(key, "load", ["model"]));
add("large", "load", ["design"]);
add("complexLogic", "load", ["design"]);
add("records-1k", "load", ["data"]);
add("records-10k", "load", ["data"]);
["expressions", "calculations", "complexLogic"].forEach((key: string) => add(key, "answer", ["first", "next10"]));
add("manyPages", "pages", ["next10", "prev", "last", "preview", "validate", "locale"]);
const recordOps = ["next", "prev", "last", "first-visit", "sort-1", "sort-3", "sort-reverse", "filter-set", "filter-change", "filter-clear",
  "edit-cell", "add-row", "remove-row"];
add("records-1k", "records", recordOps, "orders");
add("records-10k", "records", recordOps, "orders");
add("records-1k", "records", ["next", "sort-1"], "ordersPanel");
["large", "complexLogic", "records-10k"].forEach((key: string) => add(key, "output", ["data", "toJSON", "dispose"]));

// The fixture x operation matrix of phase 1.
export const SCENARIO_IDS: ReadonlyArray<ScenarioIdInfo> = core.map((id: string): ScenarioIdInfo => ({ id: id, suites: ["core"] }));

// Remedy 2 of 00, Budgets: when a suite is over budget, drop scenarios from the end of this list first.
export const DROP_LIST: ReadonlyArray<string> = [
  "records-1k/records/sort-1@ordersPanel",
  "records-1k/records/filter-change@orders",
  "records-10k/records/filter-change@orders",
  "large/output/dispose",
  "complexLogic/output/dispose",
  "records-1k/records/prev@orders",
  "records-10k/records/prev@orders"
];

export function isExtraId(id: string): boolean {
  return id.indexOf("extra/") === 0;
}

export function suitesOf(id: string): Array<Suite> {
  const info = SCENARIO_IDS.filter((s: ScenarioIdInfo) => s.id === id)[0];
  return info ? info.suites.slice() : [];
}

export function idsOfSuite(suite: Suite): Array<string> {
  return SCENARIO_IDS.filter((s: ScenarioIdInfo) => s.suites.indexOf(suite) > -1).map((s: ScenarioIdInfo) => s.id).sort();
}

// PERF_ONLY (00, Ids): an id in no suite is an error; a suite runs the ids it has and lists the others as notInSuite.
// extra/* ids belong to the core suite of a local run.
export function splitOnly(only: ReadonlyArray<string> | null, suite: Suite): { run: Array<string>, notInSuite: Array<string> } {
  const all = idsOfSuite(suite);
  if (!only) return { run: all, notInSuite: [] };
  const unknown = only.filter((id: string) => !isExtraId(id) && suitesOf(id).length === 0);
  if (unknown.length > 0) throw new Error("PERF_ONLY names ids that are in no suite: " + unknown.join(", "));
  const run = only.filter((id: string) => all.indexOf(id) > -1 || (suite === "core" && isExtraId(id)));
  const notInSuite = only.filter((id: string) => run.indexOf(id) < 0);
  return { run: Array.from(new Set(run)).sort(), notInSuite: Array.from(new Set(notInSuite)).sort() };
}
