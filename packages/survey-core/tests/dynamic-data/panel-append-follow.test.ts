import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { FunctionFactory } from "../../src/functionsfactory";

export * from "../../src/question_text";
export * from "../../src/question_expression";

const panelIndexNum = { type: "expression", name: "num", expression: "{panelIndex} + {panel.key}" };
const keyNum = { type: "expression", name: "num", expression: "{panel.key} * 2" };
const records = (): Array<any> => [{ key: 3 }, { key: 1 }, { key: 5 }, { key: 2 }, { key: 4 }];

function panelJson(options: { num?: any, extra?: any, pageSize?: number, templateVisibleIf?: string, isSorted?: boolean, defaultValue?: any } = {}): any {
  const question: any = { type: "paneldynamic", name: "p", pageSize: options.pageSize || 2,
    templateVisibleIf: options.templateVisibleIf || "{panel.key} != 2",
    templateElements: [{ type: "text", name: "key", inputType: "number" }, options.num || panelIndexNum] };
  if (options.extra) question.templateElements.push(options.extra);
  if (options.isSorted !== false) question.sortCriteria = [{ field: "key", direction: "desc" }];
  if (options.defaultValue !== undefined) question.defaultValue = options.defaultValue;
  return { elements: [question] };
}
function getPanel(survey: SurveyModel): QuestionPanelDynamicModel {
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
}
function getState(survey: SurveyModel): any {
  const panel = getPanel(survey);
  return {
    data: survey.data.p,
    keys: panel.renderedPanels.map((p: any): any => p.getQuestionByName("key").value),
    nums: panel.renderedPanels.map((p: any): any => p.getQuestionByName("num").value),
    pageCount: panel.pageCount
  };
}
// Counts the panels built: one "key" question per panel.
function countBuilds(survey: SurveyModel): { count: number } {
  const res = { count: 0 };
  survey.onQuestionCreated.add((_, options: any): void => {
    if (options.question.name === "key") res.count++;
  });
  return res;
}
/* The runtime path the assignment has to match: the same survey without a sort in the JSON, the data
   assigned, then the sort applied. The assignment builds the unsorted first page before the sort. */
function getRuntimeSortState(options: any = {}, data: Array<any> = records()): any {
  const survey = new SurveyModel(panelJson(Object.assign({}, options, { isSorted: false })));
  survey.data = { p: data };
  getPanel(survey).sort("key", "desc");
  return getState(survey);
}

describe("Dynamic Panel with a sort, paging and templateVisibleIf: an assigned value builds the page without extra records", () => {
  test("survey.data with an expression that reads {panelIndex} stores the assigned records only", () => {
    const survey = new SurveyModel(panelJson());
    survey.data = { p: records() };
    expect(survey.data.p, "#1 right after the assignment").toEqual([
      { key: 3, num: 3 }, { key: 1, num: 2 }, { key: 5, num: 7 }, { key: 2, num: 5 }, { key: 4, num: 8 }]);
    const state = getState(survey);
    expect(state.keys, "#2 the first page").toEqual([5, 4]);
    expect(state.data.length, "#3 no record added by rendering").toBe(5);
    expect(state, "#4 the runtime sort").toEqual(getRuntimeSortState());
  });
  const variants: Array<{ name: string, options: any }> = [
    { name: "an expression without {panelIndex}", options: { num: keyNum } },
    { name: "pageSize: 3", options: { num: keyNum, pageSize: 3 } },
    { name: "templateVisibleIf hides a record of the first page", options: { num: keyNum, templateVisibleIf: "{panel.key} != 5" } },
    { name: "templateVisibleIf hides a record of the first page, {panelIndex}", options: { templateVisibleIf: "{panel.key} != 5" } }
  ];
  variants.forEach((variant) => {
    test("survey.data, " + variant.name + ": the records and panels of the runtime sort", () => {
      const survey = new SurveyModel(panelJson(variant.options));
      survey.data = { p: records() };
      expect(survey.data.p.length, "#1 right after the assignment").toBe(5);
      const state = getState(survey);
      expect(state.data.length, "#2 after the render").toBe(5);
      expect(state, "#3 the runtime sort").toEqual(getRuntimeSortState(variant.options));
    });
  });
  test("survey.data, a defaultValueExpression: the panels of the runtime sort, a value for each record with a panel", () => {
    const options = { num: { type: "text", name: "num", defaultValueExpression: "{panel.key} * 2" } };
    const survey = new SurveyModel(panelJson(options));
    survey.data = { p: records() };
    const state = getState(survey);
    /* A default value is written by the panel of its record. The runtime path builds the unsorted first
       page (keys 3 and 1) before its sort, so it also writes theirs: only the panels are compared. */
    expect(state.data, "#1 the values of the panels built: keys 5 and 4").toEqual([
      { key: 3 }, { key: 1 }, { key: 5, num: 10 }, { key: 2 }, { key: 4, num: 8 }]);
    const runtime = getRuntimeSortState(options);
    expect(runtime.data.length, "#2").toBe(5);
    expect({ keys: state.keys, nums: state.nums, pageCount: state.pageCount }, "#3 the runtime sort").toEqual(
      { keys: runtime.keys, nums: runtime.nums, pageCount: runtime.pageCount });
  });
  test("The value assigned after the question has rendered once", () => {
    const survey = new SurveyModel(panelJson());
    const panel = getPanel(survey);
    expect(panel.renderedPanels.length, "#1 nothing to show").toBe(0);
    survey.data = { p: records() };
    const state = getState(survey);
    expect(state.data.length, "#2").toBe(5);
    expect(state.keys, "#3").toEqual([5, 4]);
    expect(state, "#4 the runtime sort").toEqual(getRuntimeSortState());
  });
  test("defaultValue of the question and survey.data give the same records and panels", () => {
    const fromDefault = new SurveyModel(panelJson({ defaultValue: records() }));
    const fromData = new SurveyModel(panelJson());
    fromData.data = { p: records() };
    const state = getState(fromData);
    expect(state.data.length, "#1").toBe(5);
    expect(state, "#2").toEqual(getState(fromDefault));
  });
  test("One panel is built per shown record", () => {
    [{ pageSize: 2, shown: 2 }, { pageSize: 3, shown: 3 }, { pageSize: 2, shown: 2, templateVisibleIf: "{panel.key} != 5" }].forEach((item: any) => {
      const survey = new SurveyModel(panelJson({ pageSize: item.pageSize, templateVisibleIf: item.templateVisibleIf }));
      const builds = countBuilds(survey);
      survey.data = { p: records() };
      const name = "pageSize " + item.pageSize + ", " + (item.templateVisibleIf || "");
      expect(getPanel(survey).renderedPanels.length, "#1 " + name).toBe(item.shown);
      expect(builds.count, "#2 " + name).toBe(item.shown);
    });
  });
  test("The panels' conditions run for the panels the assignment builds: a question's visibleIf", () => {
    const options = { extra: { type: "text", name: "note", visibleIf: "{panel.key} > 4" } };
    const survey = new SurveyModel(panelJson(options));
    survey.data = { p: records() };
    const panel = getPanel(survey);
    expect(panel.renderedPanels.map((p: any): boolean => p.getQuestionByName("note").isVisible), "#1 keys 5, 4").toEqual([true, false]);
    expect(panel.renderedPanels.map((p: any): any => p.getQuestionByName("num").value), "#2 the expressions").toEqual([7, 8]);
    expect(survey.data.p.length, "#3").toBe(5);
  });
  test("No panel the assignment builds asks for a record past the page (getRecordIndexOfMissingPosition)", () => {
    [{}, { pageSize: 3 }, { num: keyNum, templateVisibleIf: "{panel.key} != 5" }].forEach((options: any, index: number) => {
      const survey = new SurveyModel(panelJson(options));
      const panel = getPanel(survey);
      const calls: Array<number> = [];
      const original = panel["getRecordIndexOfMissingPosition"];
      panel["getRecordIndexOfMissingPosition"] = function (): number {
        const res = original.call(this);
        calls.push(res);
        return res;
      };
      survey.data = { p: records() };
      panel.renderedPanels;
      expect(calls, "#" + index).toEqual([]);
    });
  });
  test("nextPage() and prevPage() after the assignment keep the records and show the right keys", () => {
    const survey = new SurveyModel(panelJson());
    survey.data = { p: records() };
    const panel = getPanel(survey);
    expect(getState(survey).keys, "#1").toEqual([5, 4]);
    expect(panel.nextPage(), "#2").toBe(true);
    expect(getState(survey).keys, "#3 key 2 is hidden").toEqual([3, 1]);
    expect(survey.data.p.length, "#4").toBe(5);
    expect(panel.prevPage(), "#5").toBe(true);
    expect(getState(survey).keys, "#6").toEqual([5, 4]);
    expect(survey.data.p.length, "#7").toBe(5);
    const runtime = new SurveyModel(panelJson({ isSorted: false }));
    runtime.data = { p: records() };
    getPanel(runtime).renderedPanels;
    getPanel(runtime).sort("key", "desc");
    getPanel(runtime).nextPage();
    getPanel(runtime).prevPage();
    expect(getState(survey), "#8 the runtime sort").toEqual(getState(runtime));
  });
  test("A second assignment with more records, then with fewer", () => {
    const survey = new SurveyModel(panelJson());
    survey.data = { p: records() };
    expect(getState(survey).keys, "#1").toEqual([5, 4]);
    expect(survey.data.p.length, "#1a").toBe(5);
    const more = records().concat([{ key: 7 }, { key: 6 }, { key: 2 }]);
    survey.data = { p: JSON.parse(JSON.stringify(more)) };
    let state = getState(survey);
    expect(state.data.length, "#2 more").toBe(8);
    expect(state.keys, "#3 more").toEqual([7, 6]);
    expect(state, "#4 more, the runtime sort").toEqual(getRuntimeSortState({}, JSON.parse(JSON.stringify(more))));
    const fewer = [{ key: 1 }, { key: 2 }, { key: 3 }];
    survey.data = { p: JSON.parse(JSON.stringify(fewer)) };
    state = getState(survey);
    expect(state.data.length, "#5 fewer").toBe(3);
    expect(state.keys, "#6 fewer").toEqual([3, 1]);
    expect(state, "#7 fewer, the runtime sort").toEqual(getRuntimeSortState({}, JSON.parse(JSON.stringify(fewer))));
  });
  // The other caller of the follow: a count change appends its panels under the same held run.
  test("panelCount grown under the view stores the count it was given", () => {
    const survey = new SurveyModel(panelJson({ num: { type: "text", name: "num", defaultValueExpression: "{panelIndex} + 1" } }));
    survey.data = { p: records() };
    const panel = getPanel(survey);
    panel.renderedPanels;
    panel.panelCount = 8;
    expect(survey.data.p.length, "#1").toBe(8);
    panel.renderedPanels;
    expect(survey.data.p.length, "#2").toBe(8);
  });
  test("An edit of a paged panel decides the records' visibility once", () => {
    let runs = 0;
    FunctionFactory.Instance.register("panelAppendFollowCount", (params: Array<any>): boolean => { runs++; return params[0] !== 2; });
    try {
      const json = panelJson({ num: { type: "text", name: "num" }, extra: { type: "text", name: "note" }, templateVisibleIf: "panelAppendFollowCount({panel.key})" });
      const survey = new SurveyModel(json);
      const data: Array<any> = [];
      for (let i = 0; i < 20; i++) data.push({ key: i });
      survey.data = { p: data };
      const panel = getPanel(survey);
      expect(panel.renderedPanels.map((p: any): any => p.getQuestionByName("key").value), "#1").toEqual([19, 18]);
      runs = 0;
      panel.renderedPanels[0].getQuestionByName("note").value = "a";
      expect(runs, "#2 one pass over the records").toBe(20);
      expect(survey.data.p.length, "#3").toBe(20);
    } finally {
      FunctionFactory.Instance.unregister("panelAppendFollowCount");
    }
  });
});
