import { ExpressionRunner } from "../../src/expressions/expressionRunner";
import { ExpressionExecutor } from "../../src/expressions/expressionExecutor";
import { Operand } from "../../src/expressions/expressions";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";
import { registerFunction, unregisterFunction } from "../../src/functionsfactory";
import { QuestionCheckboxModel } from "../../src/question_checkbox";

import { describe, test, expect, beforeEach, afterEach } from "vitest";

// ExpressionExecutor caches parsed operand trees in a static hash, so the trees are shared
// between all runners in the process - including runners that belong to different surveys.
// The tests below check that this sharing does not leak state from one survey into another.
function getParsedExpressionsCache(): Map<string, { operand: Operand }> {
  return (<any>ExpressionExecutor).parsedExpressions;
}
function getCachedOperands(expression: string): Array<any> {
  const parsed = getParsedExpressionsCache().get(expression);
  if (!parsed || !parsed.operand) return [];
  const res = new Array<Operand>();
  parsed.operand.addOperandsToList(res);
  return res;
}
// Walks everything the cached tree references and reports whether any of it is the given value
function isReachableFromCachedOperands(expression: string, value: any): boolean {
  const visited = new Set<any>();
  const stack: Array<any> = getCachedOperands(expression);
  while(stack.length > 0) {
    const item = stack.pop();
    if (item === null || item === undefined) continue;
    if (typeof item !== "object") {
      if (item === value) return true;
      continue;
    }
    if (visited.has(item)) continue;
    visited.add(item);
    Object.keys(item).forEach(key => stack.push(item[key]));
  }
  return false;
}

describe("Parsed expression cache is shared between surveys", () => {
  beforeEach(() => {
    getParsedExpressionsCache().clear();
  });
  afterEach(() => {
    getParsedExpressionsCache().clear();
  });

  test("The shared operand tree does not keep the survey values alive", () => {
    const expression = "{q1} notempty";
    const marker = "the-value-of-the-disposed-survey";
    let survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: expression }
      ]
    });
    survey.setValue("q1", marker);
    expect(survey.getQuestionByName("q2").isVisible, "the expression has been executed").toBe(true);
    survey.dispose();
    survey = undefined;

    expect(isReachableFromCachedOperands(expression, marker),
      "the cached operands do not reference the values of the disposed survey").toBe(false);
  });

  test("The shared operand tree does not keep the values of another survey", () => {
    const expression = "{q1} notempty";
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: expression }
      ]
    };
    const survey1 = new SurveyModel(json);
    const survey2 = new SurveyModel(json);
    survey1.setValue("q1", "the-value-of-the-first-survey");
    survey2.setValue("q1", "the-value-of-the-second-survey");

    expect(isReachableFromCachedOperands(expression, "the-value-of-the-first-survey"),
      "the shared operand does not store the value of the first survey").toBe(false);
    expect(isReachableFromCachedOperands(expression, "the-value-of-the-second-survey"),
      "the shared operand does not store the value of the second survey").toBe(false);
  });

  test("settings.expressionDisableConversionChar is applied to a runner created after the change", () => {
    const prevChar = settings.expressionDisableConversionChar;
    try {
      const expression = "{#q1} = '01'";
      const runner1 = new ExpressionRunner(expression);
      expect(runner1.runValues({ q1: "01" }),
        "'#' disables the conversion, '01' is compared as a string").toBe(true);

      settings.expressionDisableConversionChar = "@";
      const runner2 = new ExpressionRunner(expression);
      expect(runner2.runValues({ q1: "01" }),
        "'#' is not the disable conversion char anymore, '#q1' is an unknown variable").toBe(false);
    } finally {
      settings.expressionDisableConversionChar = prevChar;
    }
  });

  test("settings.expressionVariableDelimiters are applied to a runner created after the change", () => {
    const prev = settings.expressionVariableDelimiters;
    try {
      const expression = "[q1] = 1";
      expect(new ExpressionRunner(expression).runValues({ q1: 1 }),
        "'[q1]' is not a variable with the default delimiters").toBe(false);

      settings.expressionVariableDelimiters = { start: "[", end: "]" };
      expect(new ExpressionRunner(expression).runValues({ q1: 1 }),
        "'[q1]' is a variable now").toBe(true);
    } finally {
      settings.expressionVariableDelimiters = prev;
    }
  });

  // FunctionOperand.markOriginalValueParams() marks the parameters that must receive the original
  // value. The mark used to live in a tree owned by a single executor, now it stays in the shared
  // tree and would be applied to every survey that runs the same expression afterwards.
  test("The shared operand tree does not keep the originalValueParams flag of a re-registered function", () => {
    const expression = "funcOrigParam({q1}) = 1";
    const func = (): any => 1;
    const runExpression = (): void => {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "expression", name: "q2", expression: expression }
        ]
      });
      survey.setValue("q1", 1);
    };
    const getReturnOriginalValueFlags = (): Array<boolean> => getCachedOperands(expression)
      .filter(op => op.getType() === "variable")
      .map(op => op.returnOriginalValue === true);
    try {
      registerFunction({ name: "funcOrigParam", func: func, originalValueParams: [0] });
      runExpression();
      expect(getReturnOriginalValueFlags(), "the parameter is marked as the original value")
        .toEqual([true]);

      unregisterFunction("funcOrigParam");
      registerFunction({ name: "funcOrigParam", func: func });
      runExpression();
      expect(getReturnOriginalValueFlags(), "the function does not request the original value anymore")
        .toEqual([false]);
    } finally {
      unregisterFunction("funcOrigParam");
    }
  });
});

// SurveyModel.conditionResultsCache is keyed by the expression string only. choicesVisibleIf and
// choicesEnableIf are executed by a ConditionRunner, which converts the result into a boolean
// (`res == true`), while visibleIf/defaultValueExpression and the other properties are executed by
// an ExpressionRunner and use the raw result. Both write into and read from the same cache entry.
describe("Condition results are shared between elements", () => {
  test("defaultValueExpression is not affected by choicesVisibleIf with the same expression", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "checkbox", name: "c1", choices: [1, 2, 3], choicesVisibleIf: "{q1}" },
        { type: "text", name: "q2", defaultValueExpression: "{q1}" }
      ]
    });
    survey.setValue("q1", 1);
    expect(survey.getValue("q2"), "q2 copies the value of q1").toBe(1);
  });

  test("visibleIf is not affected by choicesVisibleIf with the same expression", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "checkbox", name: "c1", choices: [1, 2, 3], choicesVisibleIf: "{q1}" },
        { type: "text", name: "q2", visibleIf: "{q1}" }
      ]
    });
    survey.setValue("q1", 1);
    expect(survey.getQuestionByName("q2").isVisible,
      "visibleIf compares the expression result strictly with true").toBe(false);
  });

  test("choicesVisibleIf is not affected by defaultValueExpression with the same expression", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", defaultValueExpression: "{q1}" },
        { type: "checkbox", name: "c1", choices: [1, 2, 3], choicesVisibleIf: "{q1}" }
      ]
    });
    survey.setValue("q1", 1);
    const c1 = <QuestionCheckboxModel>survey.getQuestionByName("c1");
    expect(c1.choices[0].isVisible, "the item visibility is a boolean").toBe(true);
  });

  test("the same expressions without a choices condition, for reference", () => {
    const survey1 = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", defaultValueExpression: "{q1}" }
      ]
    });
    survey1.setValue("q1", 1);
    expect(survey1.getValue("q2"), "q2 copies the value of q1").toBe(1);

    const survey2 = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1}" }
      ]
    });
    survey2.setValue("q1", 1);
    expect(survey2.getQuestionByName("q2").isVisible, "1 is not strictly equal to true").toBe(false);
  });
});
