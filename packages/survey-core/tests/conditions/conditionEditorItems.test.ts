import { describe, test, expect } from "vitest";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { ConditionEditorItem, SurveyConditionEditorItem, ConditionEditorItemsBuilder } from "../../src/conditions/conditionEditorItems";
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
  test("a new row takes the default operator the settings give when it is created", () => {
    const prev = settings.logic.defaultOperators.default;
    settings.logic.defaultOperators.default = "notequal";
    try {
      expect(new ConditionEditorItem().operator).toBe("notequal");
    } finally {
      settings.logic.defaultOperators.default = prev;
    }
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

const build = (text: string): Array<any> => new ConditionEditorItemsBuilder().build(text)
  .map((item: ConditionEditorItem): any => (
    { conjunction: item.conjunction, questionName: item.questionName, operator: item.operator, value: item.value }));

describe("ConditionEditorItemsBuilder: text to rows", () => {
  // Ported from survey-creator-core tests/property-grid/condition-survey.tests.ts.
  test("Items Builder, simple test", () => {
    const builder = new ConditionEditorItemsBuilder();
    let items = builder.build("{question1} = 1");
    expect(items).toHaveLength(1);
    expect(items[0].questionName).toEqual("question1");
    expect(items[0].operator).toEqual("equal");
    expect(items[0].value).toEqual(1);
    items = builder.build("1 = {question1}");
    expect(items).toHaveLength(1);
    expect(items[0].questionName).toEqual("question1");
    expect(items[0].operator).toEqual("equal");
    expect(items[0].value).toEqual(1);
  });
  // Ported from survey-creator-core tests/property-grid/condition-survey.tests.ts.
  test("Items Builder with double braces", () => {
    withDoubleBraces((): void => {
      const items = new ConditionEditorItemsBuilder().build("{{question1}} = 1");
      expect(items).toHaveLength(1);
      expect(items[0].questionName).toEqual("question1");
      expect(items[0].operator).toEqual("equal");
      expect(items[0].value).toEqual(1);
    });
  });
  test("or binds looser than and: a flat chain is taken, an or inside an and is not", () => {
    expect(build("{a} = 1 or {b} = 2 and {c} = 3"), "#1").toEqual([
      { conjunction: "and", questionName: "a", operator: "equal", value: 1 },
      { conjunction: "or", questionName: "b", operator: "equal", value: 2 },
      { conjunction: "and", questionName: "c", operator: "equal", value: 3 }]);
    expect(build("{a} = 1 and ({b} = 2 or {c} = 3)"), "#2: the rows cannot say it").toEqual([]);
  });
  test("a constant on the left is taken only where swapping the sides keeps the meaning of strings, numbers and arrays", () => {
    expect(build("1 < {q1}")[0].operator, "#1").toBe("greater");
    expect(build("1 >= {q1}")[0].operator, "#2").toBe("lessorequal");
    expect(build("1 = {q1}")[0].operator, "#3").toBe("equal");
    expect(build("1 != {q1}")[0].operator, "#4").toBe("notequal");
    expect(build("1 > {q1}")[0].operator, "#5").toBe("less");
    expect(build("1 <= {q1}")[0].operator, "#6").toBe("greaterorequal");
    // No mirror operator, or an empty value that reads differently on each side.
    ["'abc' contains {q1}", "'abc' notcontains {q1}", "['a', 'x'] allof {q1}", "['a', 'x'] anyof {q1}",
      "['a', 'x'] noneof {q1}", "{a} = 1 and 'x' contains {q1}"]
      .forEach((text: string): void => { expect(build(text), text).toEqual([]); });
  });
  test("arrays of constants are values, empty and notempty take none", () => {
    expect(build("{q3} = [1, 2]")[0].value, "#1").toEqual([1, 2]);
    expect(build("{q3} anyof ['a', 'b']")[0], "#2")
      .toEqual({ conjunction: "and", questionName: "q3", operator: "anyof", value: ["a", "b"] });
    expect(build("{q1} empty")[0], "#3")
      .toEqual({ conjunction: "and", questionName: "q1", operator: "empty", value: undefined });
    expect(build("{q1} = '5'")[0].value, "#4: a quoted number stays a string").toBe("5");
  });
  test("anything the rows cannot say gives no rows", () => {
    ["", "{q1} = ", "!({q1} = 1)", "age({q1}) = 1", "{q1} + 1 = 2", "{a} = {b}", "{q1} = null", "1 = 2"]
      .forEach((text: string): void => { expect(build(text), text).toEqual([]); });
  });
  test("a null operand is refused, not thrown on", () => {
    expect(build("null = {q1}"), "#1").toEqual([]);
    expect(build("{q1} = 1 and null"), "#2").toEqual([]);
  });
  test("hasValue turns away the names it does not know", () => {
    const builder = new ConditionEditorItemsBuilder((name: string): boolean => name === "q1");
    expect(builder.build("{q1} = 1"), "#1").toHaveLength(1);
    expect(builder.build("{q1} = 1 and {q2} = 2"), "#2").toEqual([]);
    expect(builder.build("{q2} empty"), "#3").toEqual([]);
  });
  // "Can parse expression" is ported from survey-creator-core, the rest is new.
  test("Can parse expression", () => {
    expect(ConditionEditorItemsBuilder.canBuildExpression("{q1} = 1"), "#1").toBe(true);
    expect(ConditionEditorItemsBuilder.canBuildExpression("age({q1}) = 1"), "#2").toBe(false);
    expect(ConditionEditorItemsBuilder.canBuildExpression(""), "#3: nothing to build").toBe(true);
    expect(ConditionEditorItemsBuilder.canParseExpression("age({q1}) = 1"), "#4").toBe(true);
    expect(ConditionEditorItemsBuilder.canParseExpression("{q1} = "), "#5").toBe(false);
  });
});

describe("ConditionEditorItemsBuilder.itemsToExpression", () => {
  test("rows are joined by their conjunctions, without brackets", () => {
    expect(ConditionEditorItemsBuilder.itemsToExpression([createItem("a", "equal", 1), createItem("b", "equal", 2, "or")]))
      .toBe("{a} = 1 or {b} = 2");
  });
  test("the first row that is not ready ends the text", () => {
    expect(ConditionEditorItemsBuilder.itemsToExpression(
      [createItem("a", "equal", 1), createItem("b", "equal"), createItem("c", "equal", 3)])).toBe("{a} = 1");
  });
  test("text built from rows parses back into the same rows", () => {
    const text = "{a} = 1 or {b} <> 'x' and {c} empty and {d} anyof [1, 2]";
    expect(ConditionEditorItemsBuilder.itemsToExpression(new ConditionEditorItemsBuilder().build(text))).toBe(text);
  });
});
