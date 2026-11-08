import { describe, test, expect } from "vitest";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";

// A text value is converted to a number or a boolean before it is compared ("1,000" reads as 1,
// a single comma being a decimal point), while a quoted literal is never converted. A text value
// compared with a quoted literal is compared as the text first, and only when that fails as the
// converted value.

function run(expression: string, values: any): boolean {
  return new ConditionRunner(expression).runValues(values);
}

function isVisibleInSurvey(questionJson: any, value: any, condition: string): boolean {
  const survey = new SurveyModel({
    elements: [
      questionJson,
      { type: "text", name: "target", visibleIf: condition }
    ]
  });
  survey.setValue(questionJson.name, value);
  return survey.getQuestionByName("target").isVisible;
}

const SAME_TEXT_VALUES = ["1,000", "1,5", "12,345", "5.0", " 5", "0x1"];

describe("A text value compared with its own quoted text", () => {
  SAME_TEXT_VALUES.forEach((text: string) => {
    test("ConditionRunner: '" + text + "' equals its own quoted text", () => {
      expect(run("{q} = '" + text + "'", { q: text }), "=").toBe(true);
      expect(run("{q} <> '" + text + "'", { q: text }), "<>").toBe(false);
      expect(run("'" + text + "' = {q}", { q: text }), "= with the literal on the left").toBe(true);
      expect(run("'" + text + "' <> {q}", { q: text }), "<> with the literal on the left").toBe(false);
    });
    test("visibleIf: '" + text + "' equals its own quoted text", () => {
      expect(isVisibleInSurvey({ type: "text", name: "q" }, text, "{q} = '" + text + "'"), "text =").toBe(true);
      expect(isVisibleInSurvey({ type: "text", name: "q" }, text, "{q} <> '" + text + "'"), "text <>").toBe(false);
      expect(isVisibleInSurvey({ type: "comment", name: "q" }, text, "{q} = '" + text + "'"), "comment =").toBe(true);
      const dropdown = { type: "dropdown", name: "q", choices: [text, "other"] };
      expect(isVisibleInSurvey(dropdown, text, "{q} = '" + text + "'"), "dropdown =").toBe(true);
      expect(isVisibleInSurvey(dropdown, text, "{q} <> '" + text + "'"), "dropdown <>").toBe(false);
    });
  });
  test("a double-quoted literal behaves as a single-quoted one", () => {
    expect(run("{q} = \"1,000\"", { q: "1,000" })).toBe(true);
    expect(run("{q} <> \"1,000\"", { q: "1,000" })).toBe(false);
  });
  test("a text value whose own quotes are stripped equals its quoted text", () => {
    expect(run("{q} = '\\'abc\\''", { q: "'abc'" })).toBe(true);
    expect(run("{q} = 'abc'", { q: "'abc'" }), "the text without its quotes still matches").toBe(true);
  });
  test("one runner compares each value it is given, not the text of an earlier run", () => {
    const runner = new ConditionRunner("{q} = '1,000'");
    expect(runner.runValues({ q: "1,000" }), "text").toBe(true);
    expect(runner.runValues({ q: 1000 }), "number").toBe(false);
    expect(runner.runValues({ q: "1,000" }), "text again").toBe(true);
    expect(runner.runValues({}), "no value").toBe(false);
  });
  test("a matrix cell compares its row value with the quoted text", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", visibleIf: "{row.a} = '1,000'" }]
      }]
    });
    const row = (<any>survey.getQuestionByName("m")).visibleRows[0];
    row.getQuestionByColumnName("a").value = "1,000";
    expect(row.getQuestionByColumnName("b").isVisible).toBe(true);
  });
});

describe("Text operators on a text value and a quoted literal", () => {
  const values = { q: "1,000" };
  test("contains and notcontains look in the original text", () => {
    expect(run("{q} contains '1,000'", values)).toBe(true);
    expect(run("{q} contains ',00'", values)).toBe(true);
    expect(run("{q} notcontains ',00'", values)).toBe(false);
    expect(run("{q} notcontains '1,000'", values)).toBe(false);
    expect(run("{q} notcontains 'x'", values)).toBe(true);
    expect(run("{q} contains 'x'", values)).toBe(false);
  });
  test("contains falls back to the converted value when the text does not hold the literal", () => {
    expect(run("{q} contains '1'", values)).toBe(true);
    expect(run("{q} notcontains '1'", values)).toBe(false);
  });
  test("notcontains is the negation of contains for a text that converts to 0", () => {
    expect(run("{q} contains '0'", { q: "0" })).toBe(true);
    expect(run("{q} notcontains '0'", { q: "0" })).toBe(false);
    expect(run("{q} notcontains 'x'", { q: "0" })).toBe(true);
  });
  test("the variable on the right of the literal is compared as its text too", () => {
    expect(run("'10' contains {q}", { q: "0" })).toBe(true);
    expect(run("'10' notcontains {q}", { q: "0" })).toBe(false);
    expect(run("'a 1,000 b' contains {q}", values)).toBe(true);
    expect(run("'a 1,000 b' notcontains {q}", values)).toBe(false);
    expect(run("'1,000' anyof {q}", values)).toBe(true);
    expect(run("'1,000' noneof {q}", values)).toBe(false);
  });
  test("anyof and noneof compare with the original text", () => {
    expect(run("{q} anyof ['1,000']", values)).toBe(true);
    expect(run("{q} anyof ['x', '1,000']", values)).toBe(true);
    expect(run("{q} noneof ['1,000']", values)).toBe(false);
    expect(run("{q} noneof ['x', '1,000']", values)).toBe(false);
    expect(run("{q} anyof ['x']", values)).toBe(false);
    expect(run("{q} noneof ['x']", values)).toBe(true);
  });
  test("anyof and noneof match a number item with the converted value", () => {
    expect(run("{q} anyof [1]", values)).toBe(true);
    expect(run("{q} noneof [1]", values)).toBe(false);
    expect(run("{q} anyof ['x', 1]", values)).toBe(true);
  });
  test("allof on a text value looks for every item in the original text", () => {
    expect(run("{q} allof ['1,000']", values)).toBe(true);
    expect(run("{q} allof ['1,', '000']", values)).toBe(true);
    expect(run("{q} allof ['1,000', 'x']", values)).toBe(false);
  });
  test("contains, notcontains, anyof and noneof work in visibleIf", () => {
    const text = { type: "text", name: "q" };
    expect(isVisibleInSurvey(text, "1,000", "{q} contains '1,000'"), "contains").toBe(true);
    expect(isVisibleInSurvey(text, "1,000", "{q} contains ',00'"), "contains part").toBe(true);
    expect(isVisibleInSurvey(text, "1,000", "{q} notcontains ',00'"), "notcontains").toBe(false);
    expect(isVisibleInSurvey(text, "1,000", "{q} anyof ['1,000']"), "anyof").toBe(true);
    expect(isVisibleInSurvey(text, "1,000", "{q} noneof ['1,000']"), "noneof").toBe(false);
    const dropdown = { type: "dropdown", name: "q", choices: ["1,000", "2,000"] };
    expect(isVisibleInSurvey(dropdown, "1,000", "{q} anyof ['1,000', '2,000']"), "dropdown anyof").toBe(true);
    expect(isVisibleInSurvey(dropdown, "1,000", "{q} noneof ['1,000', '2,000']"), "dropdown noneof").toBe(false);
  });
});

describe("Comparisons a text value keeps", () => {
  test("a number literal still compares with the converted value", () => {
    expect(run("{q} = 1", { q: "1,000" })).toBe(true);
    expect(run("{q} <> 1", { q: "1,000" })).toBe(false);
  });
  test("a quoted literal that is not the text compares with the converted value", () => {
    // the text "1,000" differs from '1', so the converted value decides: 1 equals '1'
    expect(run("{q} = '1'", { q: "1,000" })).toBe(true);
    expect(run("{q} <> '1'", { q: "1,000" })).toBe(false);
    expect(isVisibleInSurvey({ type: "text", name: "q" }, "1,000", "{q} = '1'")).toBe(true);
  });
  test("a number value is not equal to formatted text", () => {
    const numeric = { type: "text", inputType: "number", name: "q" };
    expect(isVisibleInSurvey(numeric, 1000, "{q} = '1,000'")).toBe(false);
    expect(isVisibleInSurvey(numeric, 1000, "{q} <> '1,000'")).toBe(true);
    expect(run("{q} = '1,000'", { q: 1000 })).toBe(false);
  });
  test("an array value is not converted", () => {
    const checkbox = { type: "checkbox", name: "q", choices: ["1,000", "2,000"] };
    expect(isVisibleInSurvey(checkbox, ["1,000"], "{q} anyof ['1,000']")).toBe(true);
    expect(isVisibleInSurvey(checkbox, ["1,000"], "{q} noneof ['1,000']")).toBe(false);
    expect(run("{q} anyof ['1,000']", { q: ["1,000"] })).toBe(true);
  });
  test("the no-conversion prefix keeps the value as it is", () => {
    expect(run("{#q} = '1,000'", { q: "1,000" })).toBe(true);
    expect(run("{#q} = 1", { q: "1,000" })).toBe(false);
    expect(run("{#q} = '1'", { q: "1,000" })).toBe(false);
  });
  test("two variables compare their converted values", () => {
    expect(run("{a} = {b}", { a: "1,000", b: "1,000" })).toBe(true);
    expect(run("{a} = {b}", { a: "1,000", b: "1" })).toBe(true);
  });
  test("an unquoted word literal compares with the converted value", () => {
    expect(run("{q} = abc", { q: "abc" })).toBe(true);
    expect(run("{q} = true", { q: "true" })).toBe(true);
    expect(run("{q} = 'true'", { q: "TRUE" })).toBe(true);
  });
});

describe("Text comparison of a converted value follows the comparator", () => {
  test("case is ignored by default", () => {
    expect(run("{q} = 'abc'", { q: "ABC" })).toBe(true);
    expect(run("{q} <> 'abc'", { q: "ABC" })).toBe(false);
  });
  test("surrounding spaces are trimmed by default", () => {
    expect(run("{q} = '1,000'", { q: "1,000 " })).toBe(true);
    expect(run("{q} <> '1,000'", { q: "1,000 " })).toBe(false);
    expect(run("{q} = ' 1,000'", { q: "1,000" })).toBe(true);
  });
  test("trimStrings off compares the spaces", () => {
    const old = settings.comparator.trimStrings;
    settings.comparator.trimStrings = false;
    try {
      expect(run("{q} = '1,000'", { q: "1,000 " })).toBe(false);
      expect(run("{q} = '1,000 '", { q: "1,000 " })).toBe(true);
    } finally {
      settings.comparator.trimStrings = old;
    }
  });
  test("caseSensitive on compares the case", () => {
    const old = settings.comparator.caseSensitive;
    settings.comparator.caseSensitive = true;
    try {
      expect(run("{q} = 'abc'", { q: "ABC" })).toBe(false);
      expect(run("{q} = 'ABC'", { q: "ABC" })).toBe(true);
      expect(run("{q} = 'true'", { q: "TRUE" }), "the boolean rule is kept").toBe(true);
      expect(run("{q} contains '1,0'", { q: "1,000" })).toBe(true);
    } finally {
      settings.comparator.caseSensitive = old;
    }
  });
});
