import { describe, test, expect } from "vitest";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { ConditionEditorItem, SurveyConditionEditorItem } from "../../src/conditions/conditionEditorItems";
import "../../src/question_text";

function createItem(questionName: string, operator: string, value?: any, conjunction?: string): ConditionEditorItem {
  const item = new ConditionEditorItem();
  item.questionName = questionName;
  item.operator = operator;
  item.value = value;
  if (!!conjunction) {
    item.conjunction = conjunction;
  }
  return item;
}
const textOf = (value: any, operator: string = "equal"): string => createItem("q1", operator, value).toExpression();
function withDoubleBraces(func: () => void): void {
  const prev = settings.expressionVariableDelimiters;
  settings.expressionVariableDelimiters = { start: "{{", end: "}}" };
  try {
    func();
  } finally {
    settings.expressionVariableDelimiters = prev;
  }
}

describe("ConditionEditorItem: rows to text", () => {
  test("a new row starts with the default operator and the and conjunction", () => {
    const item = new ConditionEditorItem();
    expect(item.operator, "#1").toBe("equal");
    expect(item.conjunction, "#2").toBe("and");
    expect(item.isReady, "#3: no question").toBe(false);
  });
  test("operators are written the way the editor has always written them", () => {
    expect(textOf(1, "equal")).toBe("{q1} = 1");
    expect(textOf(1, "notequal")).toBe("{q1} <> 1");
    expect(textOf(1, "greater")).toBe("{q1} > 1");
    expect(textOf(1, "less")).toBe("{q1} < 1");
    expect(textOf(1, "greaterorequal")).toBe("{q1} >= 1");
    expect(textOf(1, "lessorequal")).toBe("{q1} <= 1");
    expect(textOf("a", "contains")).toBe("{q1} contains 'a'");
    expect(textOf(["a", "b"], "anyof")).toBe("{q1} anyof ['a', 'b']");
    expect(createItem("q1", "notempty").toExpression(), "no value is written").toBe("{q1} notempty");
  });
  test("values keep the quoting the editor has always used", () => {
    expect(textOf("2"), "#1: a numeric string is not quoted").toBe("{q1} = 2");
    expect(textOf("000"), "#2: a leading zero keeps it a string").toBe("{q1} = '000'");
    expect(textOf("true"), "#3: the strings true and false are not quoted").toBe("{q1} = true");
    expect(textOf(true), "#4").toBe("{q1} = true");
    expect(textOf(0), "#5: zero is a value").toBe("{q1} = 0");
    expect(textOf("d'2"), "#6: an apostrophe is escaped").toBe("{q1} = 'd\\'2'");
    expect(textOf("say \"hi\""), "#7: so is a double quote").toBe("{q1} = 'say \\\"hi\\\"'");
    expect(textOf("[\"item1's\"]"), "#8: text that starts with a bracket goes as it is").toBe("{q1} = [\"item1\\'s\"]");
    expect(textOf([1, "a", "b's"]), "#9").toBe("{q1} = [1, 'a', 'b\\'s']");
  });
  test("a row is ready once it names a question and has the value its operator needs", () => {
    expect(createItem("q1", "equal").isReady, "#1: no value").toBe(false);
    expect(createItem("q1", "equal", "").isReady, "#2: an empty value").toBe(false);
    expect(createItem("q1", "equal", 0).isReady, "#3").toBe(true);
    expect(createItem("q1", "empty").isReady, "#4: empty needs no value").toBe(true);
    expect(createItem("", "empty").isReady, "#5: no question").toBe(false);
  });
  test("the variable delimiters come from the settings", () => {
    withDoubleBraces((): void => {
      expect(textOf(5)).toBe("{{q1}} = 5");
    });
  });
  test("a survey row names the question by its valueName", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", valueName: "val1" }, { type: "text", name: "q2" }] });
    const item = new SurveyConditionEditorItem(survey);
    item.questionName = "q1";
    item.value = 1;
    expect(item.toExpression(), "#1").toBe("{val1} = 1");
    item.questionName = "q2";
    expect(item.toExpression(), "#2: no valueName, no change").toBe("{q2} = 1");
    item.questionName = "nosuchquestion";
    expect(item.toExpression(), "#3: an unknown name goes as it is").toBe("{nosuchquestion} = 1");
  });
});
