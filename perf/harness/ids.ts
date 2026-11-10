// The fixture keys and every scenario id with the suites that run it (00, Ids). The same operation has the same id
// in core and in the browser. 03 adds the browser suites.
export const FIXTURE_KEYS = ["large", "expressions", "calculations", "complexLogic", "manyPages", "records-1k", "records-10k", "records-plain"] as const;
export type FixtureKey = typeof FIXTURE_KEYS[number];
// records-plain serves the plain-matrix sorts only: no load/model or load/paint of it, which would add suite time and
// measure a load the records fixtures measure already.
const loadKeys = FIXTURE_KEYS.filter((key: string) => key !== "records-plain");

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
loadKeys.forEach((key: string) => add(key, "load", ["model"]));
add("large", "load", ["design"]);
add("complexLogic", "load", ["design"]);
add("records-1k", "load", ["data"]);
add("records-10k", "load", ["data"]);
// answer/next3: three answers per sample. With ten, expressions/answer/next10 took 12 s a sample and three minutes a
// process locally.
["expressions", "calculations", "complexLogic"].forEach((key: string) => add(key, "answer", ["first", "next3"]));
add("manyPages", "pages", ["next10", "prev", "last", "preview", "validate", "locale"]);
const RECORD_OPS = ["next", "prev", "last", "first-visit", "sort-1", "sort-3", "sort-reverse", "filter-set", "filter-change", "filter-clear",
  "edit-cell", "add-row", "remove-row"];
// records-1k runs the same code as records-10k on a tenth of the rows: it keeps one paging, one sort and one filter
// operation, so 1k against 10k still shows how an operation scales; 10k has them all.
export const RECORD_OPS_1K = ["next", "sort-1", "filter-set"];
add("records-1k", "records", RECORD_OPS_1K, "orders");
add("records-10k", "records", RECORD_OPS, "orders");
add("records-1k", "records", ["next", "sort-1"], "ordersPanel");
["large", "complexLogic", "records-10k"].forEach((key: string) => add(key, "output", ["data", "toJSON", "dispose"]));
// A sort of a plain matrix, rows kept (rebound) where the rows allow it: 30 rows with no paging, and a page of 10 of
// 1,000 records. In the browser the same sort is a header click (sort-header).
const plainMatrices = ["orders30", "ordersPaged"];
plainMatrices.forEach((question: string) => add("records-plain", "records", ["sort-1"], question));
// The same for the plain dynamic panels, panels kept where the panels allow it, and Next on the paged one. The panel
// has no header to click: in the browser the sort is the same model call.
const plainPanels = ["panels30", "panelsPaged"];
plainPanels.forEach((question: string) => add("records-plain", "records", ["sort-1"], question));
add("records-plain", "records", ["next"], "panelsPaged");

// The browser column (03). survey-js-ui runs React's ids except manyPages/pages/preview: it renders all 4,500
// questions (11 s a sample in survey-js-ui, 4 s in React), and React and core keep it.
const react: Array<string> = [];
loadKeys.forEach((key: string) => react.push(key + "/load/paint"));
react.push("complexLogic/answer/first", "complexLogic/answer/type");
["next10", "preview", "locale"].forEach((op: string) => react.push("manyPages/pages/" + op));
["next", "last", "sort-header", "filter-set", "edit-cell", "add-row"].forEach((op: string) => react.push("records-10k/records/" + op + "@orders"));
react.push("records-1k/records/next@ordersPanel");
plainMatrices.forEach((question: string) => react.push("records-plain/records/sort-header@" + question));
plainPanels.forEach((question: string) => react.push("records-plain/records/sort-1@" + question));
react.push("records-plain/records/next@panelsPaged");
const jsUi = react.filter((id: string) => id !== "manyPages/pages/preview");

// The ids a phase-2 browser suite (vue3, angular) runs: the loads with paint and the actions whose cost is mostly
// rendering. The plain-matrix sorts keep (rebind) the rows, so their cost is how the framework updates kept rows.
// The rest exercise the model code that core and React already measure.
export const RENDER_SUBSET: ReadonlyArray<string> = loadKeys.map((key: string) => key + "/load/paint").concat([
  "complexLogic/answer/type", "manyPages/pages/next10", "records-10k/records/sort-header@orders", "records-10k/records/edit-cell@orders"],
plainMatrices.map((question: string) => "records-plain/records/sort-header@" + question));

// The fixture x operation matrix of phase 1.
export const SCENARIO_IDS: ReadonlyArray<ScenarioIdInfo> = Array.from(new Set(core.concat(react))).sort().map((id: string): ScenarioIdInfo => {
  const suites: Array<Suite> = [];
  if (core.indexOf(id) > -1) suites.push("core");
  if (react.indexOf(id) > -1) suites.push("react");
  if (jsUi.indexOf(id) > -1) suites.push("survey-js-ui");
  return { id: id, suites: suites };
});

// Remedy 2 of 00, Budgets: when a suite is over budget, drop scenarios from the end of this list first.
export const DROP_LIST: ReadonlyArray<string> = [
  "records-1k/records/sort-1@ordersPanel",
  "records-10k/records/filter-change@orders",
  "large/output/dispose",
  "complexLogic/output/dispose",
  "records-10k/records/prev@orders"
];

// PERF_ONLY=calibration: one calibration-only process, the spacer between the two reruns of a single suspect (04,
// Rerun spacing). It writes no result file.
export const CALIBRATION_ONLY = "calibration";

export function isCalibrationOnly(only: ReadonlyArray<string> | null): boolean {
  return !!only && only.length === 1 && only[0] === CALIBRATION_ONLY;
}

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
