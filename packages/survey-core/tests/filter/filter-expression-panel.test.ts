import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { FilterExpressionPanel, getFilterExpressionError } from "../../src/filter/filter-expression-panel";

// The text of a filter expression in someone else's survey: a panel and a comment question in it,
// checked by the survey's own validation.
function survey(): SurveyModel {
  return new SurveyModel({ elements: [{ type: "panel", name: "a", elements: [{ type: "text", name: "t" }] }] });
}
const errors = (s: SurveyModel): Array<string> => s.getQuestionByName("expression").errors.map((e: any): string => e.getText());

describe("getFilterExpressionError", () => {
  test("empty, a text that does not parse, and one that does", () => {
    expect([getFilterExpressionError(" "), getFilterExpressionError("{age} >"), getFilterExpressionError("{age} > 1 or iif({x}, 1, 2) = 1")])
      .toEqual(["Enter an expression.", "The expression is not valid.", ""]);
  });
});

describe("FilterExpressionPanel", () => {
  test("a panel named expression with a comment in it, where it is told to go, holding the text", () => {
    const s = survey();
    const p = new FilterExpressionPanel(s, "{age} > 1", { title: "Contains", index: 1 });
    expect(s.pages[0].elements.map((e: any): string => e.name), "#1").toEqual(["a", "expression"]);
    const q: any = p.question;
    expect([q.getType(), q.titleLocation, q.title, q.textUpdateMode, q.placeholder, p.panel.title], "#2")
      .toEqual(["comment", "hidden", "Contains", "onTyping", "Type an expression here...", "Contains"]);
    expect([p.text, s.getValue("expression")], "#3").toEqual(["{age} > 1", "{age} > 1"]);
  });
  test("the survey's validation checks it", () => {
    const s = survey();
    const p = new FilterExpressionPanel(s, "", { title: "Contains" });
    expect([s.validate(true, true), errors(s)], "#1").toEqual([false, ["Enter an expression."]]);
    p.text = "{age} >";
    expect([s.validate(true, true), errors(s)], "#2").toEqual([false, ["The expression is not valid."]]);
    p.text = "{age} > 1 or {age} < 0";
    expect([s.validate(true, true), errors(s)], "#3").toEqual([true, []]);
  });
  test("read-only: shown, with no placeholder and no check", () => {
    const s = survey();
    const p = new FilterExpressionPanel(s, "", { title: "Edges", readOnly: true });
    expect([p.question.readOnly, (<any>p.question).placeholder, s.validate(true, true)]).toEqual([true, "", true]);
  });
  test("onChanged follows what is typed, not the text it starts with", () => {
    const s = survey();
    const texts: Array<string> = [];
    const p = new FilterExpressionPanel(s, "{age} > 1", { title: "Contains", onChanged: (text: string): void => { texts.push(text); } });
    p.question.value = "{age} > 2";
    expect(texts).toEqual(["{age} > 2"]);
  });
  test("dispose takes the panel, its value and its check away; the rest of the survey stays", () => {
    const s = survey();
    const p = new FilterExpressionPanel(s, "", { title: "Contains" });
    p.dispose();
    expect([s.pages[0].elements.map((e: any): string => e.name), s.getValue("expression"), s.validate(true, true), p.isDisposed])
      .toEqual([["a"], undefined, true, true]);
  });
});
