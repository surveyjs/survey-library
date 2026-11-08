import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterAIResult } from "../../src/filter/filter-ai";

// A Filter Control asks the application's model through survey.onAIFilterRequest.
function withAI(over: any = {}): { q: QuestionFilterModel, calls: Array<any> } {
  const q = createFilter(over);
  const calls: Array<any> = [];
  (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
  return { q: q, calls: calls };
}
const answer = (expression: string, title: string = "", explanation: string = "") =>
  ({ data: { expression: expression, title: title, explanation: explanation } });

describe("QuestionFilterModel: whether it may ask AI", () => {
  test("only with a handler of onAIFilterRequest", () => {
    const q = createFilter();
    expect([q.canRequestAI, q.canCreateAIItems], "#1").toEqual([false, false]);
    (<SurveyModel>q.survey).onAIFilterRequest.add(() => { });
    expect([q.canRequestAI, q.canCreateAIItems], "#2").toEqual([true, true]);
  });
  test("creating needs presets that may be added; asking does not", () => {
    expect([withAI({ allowAddItems: false }).q.canRequestAI, withAI({ allowAddItems: false }).q.canCreateAIItems], "#1").toEqual([true, false]);
    expect(withAI({ allowMultipleItems: false }).q.canCreateAIItems, "#2").toBe(false);
  });
  test("never in the designer", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    survey.onAIFilterRequest.add(() => { });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([q.canRequestAI, q.canCreateAIItems]).toEqual([false, false]);
  });
});

describe("FilterAIRequest", () => {
  test("generate: the payload and the answer as conditions", () => {
    const { q, calls } = withAI();
    const results: Array<FilterAIResult> = [];
    q.createAIRequest().generate("adults", (res: FilterAIResult): void => { results.push(res); });
    expect(calls.length, "#1").toBe(1);
    const o = calls[0];
    expect([o.action, o.userPrompt, o.attempt, o.expression, o.question === q, o.context.fields.length, o.responseFormat.name], "#2")
      .toEqual(["generate", "adults", 0, "", true, 3, "survey_filter"]);
    expect(o.systemPrompt.indexOf("\"country\"") > -1, "#3").toBe(true);
    o.callback(answer("{age} > 18", "Adults"));
    expect(results, "#4").toEqual([{ status: "answer", conditions: [{ field: "age", operator: "greater", value: 18 }], title: "Adults" }]);
  });
  test("an answer that does not decompose goes back to the model with what is wrong", () => {
    const { q, calls } = withAI();
    const results: Array<FilterAIResult> = [];
    q.createAIRequest().generate("kids or old", (res: FilterAIResult): void => { results.push(res); });
    calls[0].callback(answer("{age} > 1 or {age} < 5"));
    expect(calls.length, "#1").toBe(2);
    expect([calls[1].attempt, calls[1].issues[0].code, calls[1].expression], "#2").toEqual([1, "filter:not-and", "{age} > 1 or {age} < 5"]);
    calls[1].callback(answer("{age} < 5"));
    expect(results, "#3").toEqual([{ status: "answer", conditions: [{ field: "age", operator: "less", value: 5 }], title: "" }]);
  });
  test("an answer still wrong after every attempt is an error", () => {
    const { q, calls } = withAI();
    const results: Array<FilterAIResult> = [];
    q.createAIRequest().generate("x", (res: FilterAIResult): void => { results.push(res); });
    calls[0].callback(answer("{price} > 1"));
    calls[1].callback(answer("{price} > 1"));
    calls[2].callback(answer("{price} > 1"));
    expect(calls.length, "#1").toBe(3);
    expect([results.length, results[0].status], "#2").toEqual([1, "error"]);
  });
  test("modify: the current filter goes with the new description", () => {
    const { q, calls } = withAI();
    q.createAIRequest().modify("only adults", [{ field: "age", operator: "greater", value: 18 }], (): void => { });
    expect([calls[0].action, calls[0].userPrompt, calls[0].expression]).toEqual(["modify", "only adults", "{age} > 18"]);
  });
  test("the handler's error, and an empty answer with its reason", () => {
    const { q, calls } = withAI();
    const results: Array<FilterAIResult> = [];
    const request = q.createAIRequest();
    request.generate("x", (res: FilterAIResult): void => { results.push(res); });
    calls[0].callback({ error: "quota" });
    request.generate("y", (res: FilterAIResult): void => { results.push(res); });
    calls[1].callback(answer("", "", "no field for that"));
    expect(results).toEqual([{ status: "error", error: "quota" }, { status: "empty", explanation: "no field for that" }]);
  });
});

describe("QuestionFilterModel: the kind and the prompt of a preset", () => {
  const adults = [{ field: "age", operator: "greater", value: 18 }];
  const aiItem = { name: "a1", kind: "ai", prompt: "p0", expression: "{age} > 18" };
  function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
    const survey = <SurveyModel>q.survey;
    const res = { filter: 0, uiState: 0 };
    survey.onFilterChanged.add(() => { res.filter++; });
    survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
    return res;
  }
  test("the respondent's AI preset keeps its kind and prompt in uiState; any other preset has neither", () => {
    const q = createFilter();
    const item = q.addItem("Adults", adults, { kind: "ai", prompt: "grown-ups" });
    expect([item.kind, item.prompt], "#1").toEqual(["ai", "grown-ups"]);
    q.addItem("Kids", [{ field: "age", operator: "less", value: 10 }]);
    const userItems = q.uiState.filter.userItems;
    expect(userItems[0], "#2").toEqual({ name: "userItem1", title: "Adults", conditions: adults, kind: "ai", prompt: "grown-ups" });
    expect(Object.keys(userItems[1]).sort(), "#3").toEqual(["conditions", "name", "title"]);
  });
  test("a restore brings the AI preset back", () => {
    const q = createFilter();
    q.uiState = { filter: { userItems: [{ name: "userItem1", title: "Adults", conditions: adults, kind: "ai", prompt: "grown-ups" }] } };
    const item = q.getItemByName("userItem1");
    expect([item.kind, item.prompt, item.expression]).toEqual(["ai", "grown-ups", "{age} > 18"]);
  });
  test("an authored AI preset: a new prompt is a change Reset takes back", () => {
    const q = createFilter({ items: [aiItem] });
    const events = trackEvents(q);
    q.updateItem("a1", "", undefined, "p1");
    const item = q.getItemByName("a1");
    expect([item.prompt, q.isItemModified(item), events], "#1").toEqual(["p1", true, { filter: 0, uiState: 1 }]);
    expect(q.uiState.filter.items, "#2").toEqual({ a1: { prompt: "p1" } });
    expect(q.getOriginalItemState("a1").prompt, "#3").toBe("p0");
    expect(q.isOriginalItemState("a1", item.title, adults, "p1"), "#4").toBe(false);
    expect(q.isOriginalItemState("a1", item.title, adults, "p0"), "#5").toBe(true);
    expect(q.isOriginalItemState("a1", item.title, adults), "#6: no prompt, not compared").toBe(true);
    q.resetItem("a1");
    expect([item.prompt, q.isItemModified(item)], "#7").toEqual(["p0", false]);
    q.updateItem("a1", "", undefined, "p0");
    expect(events.uiState, "#8: the same prompt is no change").toBe(2);
  });
  test("a saved prompt of an authored preset is restored", () => {
    const q = createFilter({ items: [aiItem] });
    q.uiState = { filter: { items: { a1: { prompt: "p1" } } } };
    const item = q.getItemByName("a1");
    expect([item.prompt, q.isItemModified(item)]).toEqual(["p1", true]);
  });
  test("Edit Presets' Apply passes the prompt on: one onUIStateChanged, no onFilterChanged", () => {
    const q = createFilter({ items: [aiItem] });
    const events = trackEvents(q);
    q.applyItemEdits([{ name: "a1", prompt: "p2" }]);
    expect([q.getItemByName("a1").prompt, events]).toEqual(["p2", { filter: 0, uiState: 1 }]);
  });
});
