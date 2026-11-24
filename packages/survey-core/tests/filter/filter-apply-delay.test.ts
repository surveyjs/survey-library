import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { settings } from "../../src/settings";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { FakeServerSource, serverRecords, flush } from "../dynamic-data/remote-source-integration-helpers";

const columns = [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text", inputType: "number" }];
// Each matrix records what is written into it; m reads from a server, local keeps its records in memory.
async function setUp(): Promise<{ survey: SurveyModel, control: QuestionFilterModel,
  writes: { [name: string]: Array<string> }, }> {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 5, columns: columns },
    { type: "matrixdynamic", name: "local", rowCount: 0, columns: columns },
    { type: "filter", name: "f", targetQuestion: "m", showSearchBar: true, searchFields: ["col1"],
      presets: [{ name: "small", expression: "{col2} < 3" }] }] });
  (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).dataSource = new FakeServerSource(serverRecords(12));
  await flush();
  const writes: { [name: string]: Array<string> } = {};
  ["m", "local"].forEach(name => {
    const q: any = survey.getQuestionByName(name);
    const original = q.setControlFilter.bind(q);
    writes[name] = [];
    q.setControlFilter = (key: string, expression: string): void => { writes[name].push(expression); original(key, expression); };
  });
  return { survey: survey, control: <QuestionFilterModel>survey.getQuestionByName("f"), writes: writes };
}

describe("Filter Control over a remote source: the respondent's changes are debounced", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); settings.filterApplyDelay = 300; });

  test("typing is written once, after the delay; the expression is composed at once", async () => {
    const { control, writes } = await setUp();
    control.searchString = "v";
    control.searchString = "v1";
    expect(control.combinedExpression, "#1: composed at once").toBe("{col1} contains 'v1'");
    expect(writes.m, "#2: nothing written yet").toEqual([]);
    vi.advanceTimersByTime(299);
    expect(writes.m, "#3").toEqual([]);
    vi.advanceTimersByTime(1);
    expect(writes.m, "#4: one write for the burst").toEqual(["{col1} contains 'v1'"]);
  });
  test("a preset and a chip condition are debounced too", async () => {
    const { control, writes } = await setUp();
    control.togglePreset("small");
    expect(writes.m, "#1").toEqual([]);
    vi.advanceTimersByTime(300);
    expect(writes.m, "#2").toEqual(["{col2} < 3"]);
    control.setFieldCondition("col2", "greater", 5);
    expect(writes.m.length, "#3").toBe(1);
    vi.advanceTimersByTime(300);
    expect(writes.m, "#4").toEqual(["{col2} < 3", "{col2} > 5"]);
  });
  test("the dialog's Apply is one deliberate change: written at once, the pending write goes with it", async () => {
    const { control, writes } = await setUp();
    control.searchString = "v1";
    control.applyFilterState({ selectedPreset: "", conditions: [{ field: "col2", operator: "less", value: 9 }], searchString: "v1" });
    expect(writes.m, "#1: at once").toEqual(["({col2} < 9) and ({col1} contains 'v1')"]);
    vi.advanceTimersByTime(300);
    expect(writes.m, "#2: nothing follows").toEqual(["({col2} < 9) and ({col1} contains 'v1')"]);
  });
  test("a change undone within the delay writes nothing", async () => {
    const { control, writes } = await setUp();
    control.searchString = "x";
    control.searchString = "";
    vi.advanceTimersByTime(300);
    expect(writes.m, "#1").toEqual([]);
  });
  test("clearing the search is debounced like any other change", async () => {
    const { control, writes } = await setUp();
    control.searchString = "v1";
    vi.advanceTimersByTime(300);
    control.searchString = "";
    expect(writes.m.length, "#1").toBe(1);
    vi.advanceTimersByTime(300);
    expect(writes.m[1], "#2").toBe("");
  });
  test("re-pointing the control writes into the new source at once and drops the pending write", async () => {
    const { control, writes } = await setUp();
    control.searchString = "v1";
    control.targetQuestion = "local";
    expect(writes.local, "#1: at once").toEqual(["{col1} contains 'v1'"]);
    expect(writes.m, "#2: the old source is cleared, nothing else").toEqual([""]);
    vi.advanceTimersByTime(300);
    expect(writes.m, "#3: the pending write was dropped").toEqual([""]);
    control.searchString = "v2";
    expect(writes.local[1], "#4: a local source is written at once").toBe("{col1} contains 'v2'");
  });
  test("dispose drops the pending write", async () => {
    const { control, writes } = await setUp();
    control.searchString = "v1";
    control.dispose();
    vi.advanceTimersByTime(300);
    expect(writes.m, "#1: only the detach").toEqual([""]);
  });
  test("a pending write is dropped when the source question is disposed", async () => {
    const { survey, control, writes } = await setUp();
    control.searchString = "v1";
    survey.getQuestionByName("m").dispose();
    vi.advanceTimersByTime(300);
    expect(writes.m, "#1: nothing is written into a disposed question").toEqual([]);
  });
  test("restoring the saved state writes at once: it is not a respondent's change", async () => {
    const { survey, writes } = await setUp();
    survey.uiState = { questions: { f: { filter: { selectedPreset: "small" } } } };
    expect(writes.m, "#1").toEqual(["{col2} < 3"]);
  });
  test("a target over an in-memory source (ArrayDynamicDataSource) is filtered at once: there is no request to save", async () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, columns: columns },
      { type: "filter", name: "f", targetQuestion: "m", showSearchBar: true, searchFields: ["col1"] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.dataSource = ArrayDynamicDataSource.fromArray(serverRecords(12));
    const control = <QuestionFilterModel>survey.getQuestionByName("f");
    expect(matrix.visibleRows.length, "#1").toBe(12);
    control.searchString = "v1";
    expect(matrix.visibleRows.length, "#2: typing, v1, v10, v11").toBe(3);
    control.searchString = "";
    control.applyFilter("{col2} < 2");
    expect(matrix.visibleRows.length, "#3: applyFilter").toBe(2);
  });
  test("settings.filterApplyDelay = 0 writes at once", async () => {
    settings.filterApplyDelay = 0;
    const { control, writes } = await setUp();
    control.searchString = "v1";
    expect(writes.m, "#1").toEqual(["{col1} contains 'v1'"]);
  });
});
