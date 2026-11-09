import { describe, test, expect, afterEach } from "vitest";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import type { ISurveySettings } from "../src/survey-settings";

// comparator.numericTextAsText (decisions.md, C4): with the key on, a text that looks like a number is compared
// as a text with another text (a text value, a quoted literal, another text variable) in =, <>, contains,
// notcontains, anyof, allof and noneof. It is converted only when the other side is an actual number.

const KEY_ON: ISurveySettings = { comparator: { numericTextAsText: true } };

function run(expression: string, values: any, surveySettings?: ISurveySettings): boolean {
  return new ConditionRunner(expression).runValues(values, undefined, surveySettings);
}
// The values go to text questions, except the keys listed in numericQuestions (a numeric input)
function isVisibleInSurvey(condition: string, values: any, surveySettings?: ISurveySettings, numericQuestions: Array<string> = []): boolean {
  const elements: Array<any> = Object.keys(values).map((name: string) =>
    numericQuestions.indexOf(name) > -1 ? { type: "text", inputType: "number", name: name } : { type: "text", name: name });
  elements.push({ type: "text", name: "target", visibleIf: condition });
  const survey = new SurveyModel({ elements: elements }, surveySettings);
  Object.keys(values).forEach((name: string) => survey.setValue(name, values[name]));
  return survey.getQuestionByName("target").isVisible;
}
function checkBoth(condition: string, values: any, off: boolean, on: boolean, numericQuestions?: Array<string>): void {
  expect(run(condition, values), "ConditionRunner, key off: " + condition).toBe(off);
  expect(run(condition, values, KEY_ON), "ConditionRunner, key on: " + condition).toBe(on);
  expect(isVisibleInSurvey(condition, values, undefined, numericQuestions), "SurveyModel, key off: " + condition).toBe(off);
  expect(isVisibleInSurvey(condition, values, KEY_ON, numericQuestions), "SurveyModel, key on: " + condition).toBe(on);
}

describe("comparator.numericTextAsText", () => {
  afterEach(() => {
    settings.comparator.numericTextAsText = false;
    settings.comparator.caseSensitive = false;
    settings.comparator.trimStrings = true;
  });

  test("the global default is false", () => {
    expect(settings.comparator.numericTextAsText).toBe(false);
  });

  describe("the table of prompt 10", () => {
    test("\"5.0\" = '5'", () => {
      checkBoth("{q} = '5'", { q: "5.0" }, true, false);
      checkBoth("{q} <> '5'", { q: "5.0" }, false, true);
      checkBoth("'5' = {q}", { q: "5.0" }, true, false);
    });
    test("\"1e1\" = '10'", () => {
      checkBoth("{q} = '10'", { q: "1e1" }, true, false);
    });
    test("\"0xa\" = '10' (recorded after prompt 03)", () => {
      checkBoth("{q} = '10'", { q: "0xa" }, true, false);
    });
    test("\"7\" = '007'", () => {
      checkBoth("{q} = '007'", { q: "7" }, true, false);
    });
    test("{a} = {b} for the texts \"5.0\" and \"5\"", () => {
      checkBoth("{a} = {b}", { a: "5.0", b: "5" }, true, false);
      checkBoth("{a} <> {b}", { a: "5.0", b: "5" }, false, true);
      checkBoth("{a} = {b}", { a: "5", b: "5" }, true, true);
    });
    // The prompt's probe (false today) predates prompt 04: a variable's text is now compared with a quoted
    // literal first, so the literal case is true with the key off. Two variables still see the number's text.
    test("\"5.0\" contains '0'", () => {
      checkBoth("{q} contains '0'", { q: "5.0" }, true, true);
      checkBoth("{q} notcontains '0'", { q: "5.0" }, false, false);
      checkBoth("{q} contains {z}", { q: "5.0", z: "0" }, false, true);
      // Off, both are false: containsCore returns false for the number 0 on the right
      checkBoth("{q} notcontains {z}", { q: "5.0", z: "0" }, false, false);
    });
    test("\"5.0\" = 5: a number literal converts the text", () => {
      checkBoth("{q} = 5", { q: "5.0" }, true, true);
      checkBoth("5 = {q}", { q: "5.0" }, true, true);
      checkBoth("{q} = 10", { q: "1e1" }, true, true);
    });
    test("\"10\" > '9': > < >= <= keep the conversion", () => {
      checkBoth("{q} > '9'", { q: "10" }, true, true);
      checkBoth("{q} < '9'", { q: "10" }, false, false);
      checkBoth("{q} >= '5'", { q: "5.0" }, true, true);
      checkBoth("{q} <= '5'", { q: "5.0" }, true, true);
    });
    test("a numeric input holding 5 = '5' (recorded)", () => {
      checkBoth("{q} = '5'", { q: 5 }, true, true, ["q"]);
      checkBoth("{q} = '5.0'", { q: 5 }, true, true, ["q"]);
    });
  });

  describe("other cases", () => {
    test("a numeric input against a numeric text converts the text", () => {
      checkBoth("{a} = {b}", { a: "5.0", b: 5 }, true, true, ["b"]);
      checkBoth("{a} = {b}", { a: "1e1", b: 10 }, true, true, ["b"]);
    });
    test("arithmetic keeps the conversion", () => {
      checkBoth("{q} + 1 = 6", { q: "5.0" }, true, true);
      checkBoth("{a} + {b} = 15", { a: "5.0", b: "1e1" }, true, true);
    });
    test("anyof, noneof and allof with quoted items compare texts", () => {
      checkBoth("{q} anyof ['5', 'x']", { q: "5.0" }, true, false);
      checkBoth("{q} noneof ['5', 'x']", { q: "5.0" }, false, true);
      checkBoth("{q} anyof ['5.0', 'x']", { q: "5.0" }, true, true);
      // prompt 04 already looks each quoted item up in the text
      checkBoth("{q} allof ['5', '.0']", { q: "5.0" }, true, true);
      checkBoth("{q} allof ['5', 'x']", { q: "5.0" }, false, false);
    });
    test("anyof with number items converts the text", () => {
      checkBoth("{q} anyof [5, 6]", { q: "5.0" }, true, true);
      checkBoth("{q} noneof [5, 6]", { q: "5.0" }, false, false);
    });
    test("a checkbox value against a numeric text variable", () => {
      const json = {
        elements: [
          { type: "checkbox", name: "c", choices: ["5", "6"] },
          { type: "text", name: "q" },
          { type: "text", name: "target", visibleIf: "{c} contains {q}" }
        ]
      };
      const check = (surveySettings: ISurveySettings): boolean => {
        const survey = new SurveyModel(json, surveySettings);
        survey.setValue("c", ["5"]);
        survey.setValue("q", "5.0");
        return survey.getQuestionByName("target").isVisible;
      };
      expect(check(undefined), "key off").toBe(true);
      expect(check(KEY_ON), "key on").toBe(false);
      expect(run("{c} contains {q}", { c: [5, 6], q: "5.0" }, KEY_ON), "number items convert the text").toBe(true);
    });
    test("the text comparison follows the comparator's case and trim", () => {
      checkBoth("{q} = '1e1'", { q: "1E1" }, true, true);
      expect(run("{q} = '1e1'", { q: "1E1" }, { comparator: { numericTextAsText: true, caseSensitive: true } }), "case-sensitive").toBe(false);
      expect(run("{q} = '5.0'", { q: " 5.0 " }, KEY_ON), "trimmed").toBe(true);
      expect(run("{q} = '5.0'", { q: " 5.0 " }, { comparator: { numericTextAsText: true, trimStrings: false } }), "not trimmed").toBe(false);
    });
    // A boolean is not a text: the final == of checkIfValuesEqual decides, which is C5's key, not this one
    test("a boolean literal keeps the conversion", () => {
      checkBoth("{q} = true", { q: "1" }, true, true);
    });
    test("a text that reads as a boolean is a text", () => {
      checkBoth("{q} = {b}", { q: "1", b: "true" }, true, false);
      checkBoth("{q} = {b}", { q: "0", b: "false" }, true, false);
      checkBoth("{q} <> {b}", { q: "1", b: "true" }, false, true);
    });
    test("an array that mixes numbers and texts converts the text for its number items", () => {
      checkBoth("{q} anyof [1.5, 'x']", { q: "1,5" }, true, true);
      checkBoth("{q} anyof [1, 'x']", { q: "1,000" }, true, true);
      checkBoth("{q} anyof [10, 'x']", { q: "1e1" }, true, true);
      checkBoth("{q} anyof [6, '5']", { q: "5.0" }, true, false);
      expect(run("{q} anyof {c}", { q: "1,5", c: [1.5, "x"] }, KEY_ON), "anyof a question value").toBe(true);
      expect(run("{c} contains {q}", { q: "1,5", c: [1.5, "x"] }, KEY_ON), "contains in a question value").toBe(true);
      const c = [1.5, "x"];
      run("{q} anyof {c}", { q: "1,5", c: c }, KEY_ON);
      expect(c, "the question value is not changed").toEqual([1.5, "x"]);
    });
    test("{#q} and a value with no conversion are unchanged", () => {
      checkBoth("{#q} = '5'", { q: "5.0" }, false, false);
      checkBoth("{q} = 'abc'", { q: "abc" }, true, true);
      checkBoth("{q} = '5'", { q: "5" }, true, true);
    });
    test("one runner reused for a numeric text, a number and no value", () => {
      const runner = new ConditionRunner("{q} = '5'");
      expect(runner.runValues({ q: "5.0" }, undefined, KEY_ON), "text").toBe(false);
      expect(runner.runValues({ q: 5 }, undefined, KEY_ON), "number").toBe(true);
      expect(runner.runValues({ q: "5.0" }, undefined, KEY_ON), "text again").toBe(false);
      expect(runner.runValues({}, undefined, KEY_ON), "no value").toBe(false);
      expect(runner.runValues({ q: "5.0" }), "key off").toBe(true);
    });
  });

  describe("where the key comes from", () => {
    test("the global setting reaches a survey and a runner with no own value", () => {
      settings.comparator.numericTextAsText = true;
      expect(isVisibleInSurvey("{q} = '5'", { q: "5.0" }), "survey").toBe(false);
      expect(run("{q} = '5'", { q: "5.0" }), "runner").toBe(false);
      expect(isVisibleInSurvey("{q} = '5'", { q: "5.0" }, { comparator: { caseSensitive: true } }), "a survey that sets another key").toBe(false);
    });
    test("a survey's own false beats a global true", () => {
      settings.comparator.numericTextAsText = true;
      const own: ISurveySettings = { comparator: { numericTextAsText: false } };
      expect(isVisibleInSurvey("{q} = '5'", { q: "5.0" }, own), "survey").toBe(true);
      expect(run("{q} = '5'", { q: "5.0" }, own), "runner").toBe(true);
    });
    test("the key reaches a dynamic panel's and a matrix row's conditions", () => {
      const check = (surveySettings: ISurveySettings): Array<boolean> => {
        const survey = new SurveyModel({
          elements: [
            { type: "paneldynamic", name: "panel", panelCount: 1, templateElements: [
              { type: "text", name: "pq" },
              { type: "text", name: "pt", visibleIf: "{panel.pq} = '5'" }
            ] },
            { type: "matrixdynamic", name: "matrix", rowCount: 1, columns: [
              { name: "c1", cellType: "text" },
              { name: "c2", cellType: "text", visibleIf: "{row.c1} = '5'" }
            ] }
          ]
        }, surveySettings);
        survey.data = { panel: [{ pq: "5.0" }], matrix: [{ c1: "5.0" }] };
        const panelQuestion = (<any>survey.getQuestionByName("panel")).panels[0].getQuestionByName("pt");
        const cell = (<any>survey.getQuestionByName("matrix")).visibleRows[0].getQuestionByName("c2");
        return [panelQuestion.isVisible, cell.isVisible];
      };
      expect(check(undefined), "key off").toEqual([true, true]);
      expect(check(KEY_ON), "key on").toEqual([false, false]);
    });
    test("survey.settings() on a loaded survey changes a visibleIf at once", () => {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q" },
          { type: "text", name: "target", visibleIf: "{q} = '5'" }
        ]
      });
      survey.setValue("q", "5.0");
      const target = survey.getQuestionByName("target");
      expect(target.isVisible, "#1: key off").toBe(true);
      survey.settings(KEY_ON);
      expect(target.isVisible, "#2: key on").toBe(false);
      expect(survey.getSettings().comparator.numericTextAsText, "#3: the effective value").toBe(true);
      survey.settings({ comparator: { numericTextAsText: undefined } });
      expect(target.isVisible, "#4: key removed").toBe(true);
    });
  });
});
