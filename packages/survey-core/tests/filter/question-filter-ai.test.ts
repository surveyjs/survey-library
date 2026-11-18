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
    expect(q.canRequestAI, "#1").toBe(false);
    (<SurveyModel>q.survey).onAIFilterRequest.add(() => { });
    expect(q.canRequestAI, "#2").toBe(true);
  });
  test("asking needs no presets that may be added", () => {
    expect([withAI({ allowAddItems: false }).q.canRequestAI, withAI({ allowMultipleItems: false }).q.canRequestAI]).toEqual([true, true]);
  });
  test("never in the designer", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    survey.onAIFilterRequest.add(() => { });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.canRequestAI).toBe(false);
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
  test("an answer that does not decompose is the filter as text; one that does not parse goes back to the model with what is wrong", () => {
    const { q, calls } = withAI();
    const results: Array<FilterAIResult> = [];
    const request = q.createAIRequest();
    request.generate("kids or old", (res: FilterAIResult): void => { results.push(res); });
    calls[0].callback(answer("{age} > 1 or {age} < 5", "Ends"));
    expect([calls.length, results], "#1").toEqual([1, [{ status: "expression", expression: "{age} > 1 or {age} < 5", title: "Ends" }]]);
    request.generate("kids", (res: FilterAIResult): void => { results.push(res); });
    calls[1].callback(answer("{age} <"));
    expect([calls.length, calls[2].attempt, calls[2].issues[0].code, calls[2].expression], "#2").toEqual([3, 1, "filter:syntax", "{age} <"]);
    calls[2].callback(answer("{age} < 5"));
    expect(results[1], "#3").toEqual({ status: "answer", conditions: [{ field: "age", operator: "less", value: 5 }], title: "" });
  });
  test("an answer still wrong after every attempt is an error", () => {
    const { q, calls } = withAI();
    const results: Array<FilterAIResult> = [];
    q.createAIRequest().generate("x", (res: FilterAIResult): void => { results.push(res); });
    calls[0].callback(answer("{age} >"));
    calls[1].callback(answer("{age} >"));
    calls[2].callback(answer("{age} >"));
    expect(calls.length, "#1").toBe(3);
    expect([results.length, results[0].status], "#2").toEqual([1, "error"]);
  });
  test("modify: the current filter, as text, goes with what to change", () => {
    const { q, calls } = withAI();
    q.createAIRequest().modify("only adults", " {age} > 18 or {age} < 2 ", (): void => { });
    expect([calls[0].action, calls[0].userPrompt, calls[0].expression]).toEqual(["modify", "only adults", "{age} > 18 or {age} < 2"]);
    expect(calls[0].messages[calls[0].messages.length - 1].content.indexOf("Change it like this:\nonly adults") > -1, "#2").toBe(true);
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
