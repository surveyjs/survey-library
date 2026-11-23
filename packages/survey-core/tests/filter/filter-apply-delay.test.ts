import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { settings } from "../../src/settings";
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

describe("Filter Control over a remote source: every write is debounced", () => {
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
  test("a preset, a chip condition and the dialog's Apply are debounced too", async () => {
    const { control, writes } = await setUp();
    control.togglePreset("small");
    expect(writes.m, "#1").toEqual([]);
    vi.advanceTimersByTime(300);
    expect(writes.m, "#2").toEqual(["{col2} < 3"]);
    control.setFieldCondition("col2", "greater", 5);
    expect(writes.m.length, "#3").toBe(1);
    vi.advanceTimersByTime(300);
    expect(writes.m, "#4").toEqual(["{col2} < 3", "{col2} > 5"]);
    control.applyFilterState({ selectedPreset: "", conditions: [{ field: "col2", operator: "less", value: 9 }], searchString: "" });
    expect(writes.m.length, "#5").toBe(2);
    vi.advanceTimersByTime(300);
    expect(writes.m[2], "#6").toBe("{col2} < 9");
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
  test("settings.filterApplyDelay = 0 writes at once", async () => {
    settings.filterApplyDelay = 0;
    const { control, writes } = await setUp();
    control.searchString = "v1";
    expect(writes.m, "#1").toEqual(["{col1} contains 'v1'"]);
  });
});
