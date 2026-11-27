import { describe, test, expect } from "vitest";
import { ExpressionRunner } from "../../src/expressions/expressionRunner";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";

// https://github.com/surveyjs/survey-library/issues/12430
// A text value is converted before it is used ("0" reads as 0, "false" as false). In "{q} || 'fallback'"
// that made an entered "0" or "false" look empty, so the fallback replaced the value. The or operator
// now keeps such a value as its text, the way it keeps any other entered text.

function runExpression(expression: string, values: any): any {
  return new ExpressionRunner(expression).runValues(values);
}

describe("|| fallback keeps a text that converts to 0 or false (#12430)", () => {
  test("Dynamic Panel tab title: a fallback is used only for an empty value", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "vacation-info", displayMode: "tab", templateTabTitle: "{panel.tabTitle}",
        panelCount: 1, maxPanelCount: 10, confirmDelete: true,
        templateElements: [
          { type: "expression", name: "tabTitle", visible: false, expression: "{panel.country} || 'New Vacation'" },
          { type: "text", name: "country", title: "Enter a country" }
        ]
      }]
    });
    const dynamicPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("vacation-info");
    const panel = dynamicPanel.panels[0];
    const tabTitle = (): string => dynamicPanel.tabbedMenu.actions[0].locTitle.textOrHtml;
    expect(tabTitle(), "empty").toBe("New Vacation");
    panel.getQuestionByName("country").value = "0";
    expect(tabTitle(), "0").toBe("0");
    panel.getQuestionByName("country").value = "false";
    expect(tabTitle(), "false").toBe("false");
    panel.getQuestionByName("country").value = "Spain";
    expect(tabTitle(), "Spain").toBe("Spain");
    panel.getQuestionByName("country").clearValue();
    expect(tabTitle(), "cleared").toBe("New Vacation");
  });
  test("ExpressionRunner: the fallback applies to an empty value only", () => {
    expect(runExpression("{q} || 'none'", { q: "0" }), "'0'").toBe("0");
    expect(runExpression("{q} || 'none'", { q: "false" }), "'false'").toBe("false");
    expect(runExpression("{q} or 'none'", { q: "0" }), "or keyword").toBe("0");
    expect(runExpression("{q} || 'none'", { q: "5" }), "'5'").toBe(5);
    expect(runExpression("{q} || 'none'", { q: "abc" }), "'abc'").toBe("abc");
    expect(runExpression("{q} || 'none'", { q: "" }), "empty text").toBe("none");
    expect(runExpression("{q} || 'none'", {}), "no value").toBe("none");
    expect(runExpression("({q} || 10) + 1", { q: "0" }), "arithmetic").toBe(1);
    expect(runExpression("({q} || 10) + 1", { q: "5" }), "arithmetic, '5'").toBe(6);
    expect(runExpression("({q} || 10) + 1", {}), "arithmetic, no value").toBe(11);
    expect(runExpression("({a} || {b} || 10) * 2 + 1", { b: "0" }), "arithmetic, chain").toBe(1);
    expect(runExpression("{a} || {b} || 'none'", { b: "0" }), "chain").toBe("0");
    expect(runExpression("{a} || {b} || 'none'", { a: "false", b: "x" }), "chain, first value").toBe("false");
    expect(runExpression("{a} || {b} || 'none'", { a: "0", b: false }), "chain, false next").toBe("0");
    expect(runExpression("{a} || {b} || 'none'", { b: false }), "chain, false only").toBe("none");
  });
  test("ExpressionRunner: an entered 0 or false text satisfies an or condition in iif", () => {
    const expression = "iif({q} or {r} = 0, 'provided', 'missing')";
    expect(runExpression(expression, { q: "0", r: "abc" }), "'0'").toBe("provided");
    expect(runExpression(expression, { q: "false", r: "abc" }), "'false'").toBe("provided");
    expect(runExpression(expression, { q: "abc", r: "abc" }), "'abc'").toBe("provided");
    expect(runExpression(expression, { r: "abc" }), "no value").toBe("missing");
    expect(runExpression(expression, { r: 0 }), "no value, comparison holds").toBe("provided");
  });
  test("ConditionRunner: or against a boolean stays a logical or", () => {
    const run = (expression: string, values: any): boolean => new ConditionRunner(expression).runValues(values);
    expect(run("{q} or {b}", { q: "false", b: true }), "'false' or true").toBe(true);
    expect(run("{q} or {b}", { q: "0", b: true }), "'0' or true").toBe(true);
    expect(run("{q} or {b} = 1", { q: "false", b: 1 }), "'false' or a comparison").toBe(true);
    expect(run("{q} or {b}", { q: "false", b: false }), "'false' or false").toBe(false);
    expect(run("{q} or {b} = 1", { q: "0", b: 2 }), "'0' or a false comparison").toBe(false);
  });
});
