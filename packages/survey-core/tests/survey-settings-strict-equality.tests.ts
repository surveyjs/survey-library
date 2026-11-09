import { describe, test, expect, afterEach } from "vitest";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionMatrixModel } from "../src/question_matrix";
import type { ISurveySettings } from "../src/survey-settings";

// comparator.strictEquality (decisions.md, C5): with the key on, the expression operators end their comparison
// in === instead of ==, after the explicit conversions. Value-change checks, choice matching and matrix cells keep ==.

const KEY_ON: ISurveySettings = { comparator: { strictEquality: true } };

function run(expression: string, values: any, surveySettings?: ISurveySettings): boolean {
  return new ConditionRunner(expression).runValues(values, undefined, surveySettings);
}
// questions: the question JSON for each value; a value without one goes to a text question
function isVisibleInSurvey(condition: string, values: any, questions: any, surveySettings?: ISurveySettings): boolean {
  const elements: Array<any> = Object.keys(values).map((name: string) => ({ type: "text", name: name, ...(questions[name] || {}) }));
  elements.push({ type: "text", name: "target", visibleIf: condition });
  const survey = new SurveyModel({ elements: elements }, surveySettings);
  Object.keys(values).forEach((name: string) => survey.setValue(name, values[name]));
  return survey.getQuestionByName("target").isVisible;
}
function checkBoth(condition: string, values: any, off: boolean, on: boolean, questions: any = {}): void {
  expect(run(condition, values), "ConditionRunner, key off: " + condition).toBe(off);
  expect(run(condition, values, KEY_ON), "ConditionRunner, key on: " + condition).toBe(on);
  expect(isVisibleInSurvey(condition, values, questions), "SurveyModel, key off: " + condition).toBe(off);
  expect(isVisibleInSurvey(condition, values, questions, KEY_ON), "SurveyModel, key on: " + condition).toBe(on);
}
const BOOLEAN = { b: { type: "boolean" } };
const CHECKBOX = { c: { type: "checkbox", choices: [1, 2] } };
const NUMBER = { q: { inputType: "number" } };

describe("comparator.strictEquality", () => {
  afterEach(() => {
    settings.comparator.strictEquality = false;
  });

  test("the global default is false", () => {
    expect(settings.comparator.strictEquality).toBe(false);
  });

  describe("the table of prompt 11", () => {
    test("boolean true, {b} = 1", () => {
      checkBoth("{b} = 1", { b: true }, true, false, BOOLEAN);
      checkBoth("1 = {b}", { b: true }, true, false, BOOLEAN);
    });
    test("boolean false, {b} = 0", () => {
      checkBoth("{b} = 0", { b: false }, true, false, BOOLEAN);
    });
    test("boolean true, {b} <> 1", () => {
      checkBoth("{b} <> 1", { b: true }, false, true, BOOLEAN);
    });
    test("checkbox [1], {c} anyof [true] (recorded)", () => {
      checkBoth("{c} anyof [true]", { c: [1] }, true, false, CHECKBOX);
    });
    test("\"01\" = 1: the numeric-text conversion stays", () => {
      checkBoth("{q} = 1", { q: "01" }, true, true);
    });
    test("boolean true, {b} = 'true': the explicit rule stays", () => {
      checkBoth("{b} = 'true'", { b: true }, true, true, BOOLEAN);
      checkBoth("{b} = 'false'", { b: false }, true, true, BOOLEAN);
    });
    test("{q} = 5 for the number 5", () => {
      checkBoth("{q} = 5", { q: 5 }, true, true, NUMBER);
    });
  });

  describe("the other operators", () => {
    test("allof, noneof, contains and notcontains on an array", () => {
      checkBoth("{c} allof [true]", { c: [1] }, true, false, CHECKBOX);
      checkBoth("{c} noneof [true]", { c: [1] }, false, true, CHECKBOX);
      checkBoth("{c} contains true", { c: [1] }, true, false, CHECKBOX);
      checkBoth("{c} notcontains true", { c: [1] }, false, true, CHECKBOX);
      checkBoth("{c} anyof [1]", { c: [1] }, true, true, CHECKBOX);
    });
    test("a boolean against a number in an array", () => {
      checkBoth("{b} anyof [1, 2]", { b: true }, true, false, BOOLEAN);
    });
    test("two variables", () => {
      checkBoth("{b} = {n}", { b: true, n: 1 }, true, false, { ...BOOLEAN, n: { inputType: "number" } });
    });
    // >= and <= compare as > and < do, which convert; only their equal part could differ
    test(">= and <= keep today's result", () => {
      checkBoth("{b} >= 1", { b: true }, true, true, BOOLEAN);
      // Recorded: = is strict while >= and <= are not
      checkBoth("{b} >= 1 and {b} <= 1", { b: true }, true, true, BOOLEAN);
      checkBoth("{b} <= 1", { b: true }, true, true, BOOLEAN);
      checkBoth("{b} <= 0", { b: false }, true, true, BOOLEAN);
    });
    test("two empty values are still equal", () => {
      expect(run("{a} = {b}", { a: null }, KEY_ON), "null and a missing value").toBe(true);
      expect(run("{a} = {b}", {}, KEY_ON), "two missing values").toBe(true);
      expect(run("{a} <> {b}", { a: null }, KEY_ON)).toBe(false);
    });
    test("texts and the explicit conversions are unchanged", () => {
      checkBoth("{q} = 'abc'", { q: "ABC" }, true, true);
      checkBoth("{q} = 5", { q: "5.0" }, true, true);
      checkBoth("{q} = '1,000'", { q: "1,000" }, true, true);
      checkBoth("{q} = 1", { q: 1 }, true, true, NUMBER);
    });
    // Only a boolean side is strict: a number against a text that only == reads as that number stays as today
    // (numeric text is comparator.numericTextAsText's concern, C4)
    test("a number against a numeric text keeps loose equality", () => {
      checkBoth("{q} = '.5'", { q: 0.5 }, true, true, NUMBER);
      checkBoth("'.5' = 0.5", {}, true, true);
      checkBoth("{q} = '1e3'", { q: 1000 }, true, true, NUMBER);
      checkBoth("{q} = '0x10'", { q: 16 }, true, true, NUMBER);
      checkBoth("{q} anyof ['.5']", { q: 0.5 }, true, true, NUMBER);
      checkBoth("{#q} = 0.5", { q: ".5" }, true, true);
      expect(run("{q} contains '.5'", { q: [0.5] }, KEY_ON)).toBe(true);
    });
    test("with comparator.numericTextAsText on too, a text against a number still converts", () => {
      const both: ISurveySettings = { comparator: { numericTextAsText: true, strictEquality: true } };
      expect(run("{q} = '.5'", { q: 0.5 }, both)).toBe(true);
      expect(run("{q} = 5", { q: "5.0" }, both)).toBe(true);
      expect(run("{q} = '5'", { q: "5.0" }, both)).toBe(false);
      expect(run("{b} = 1", { b: true }, both)).toBe(false);
    });
    // A text that Variable reads as a number or a boolean meets the other side as that value (recorded)
    test("a text read as a boolean or a number before the comparison", () => {
      checkBoth("{q} = 1", { q: "true" }, true, false);
      checkBoth("{q} = true", { q: "1" }, true, false);
      checkBoth("{q} = true", { q: "true" }, true, true);
    });
    test("a boolean question with numeric valueTrue compared with true (recorded)", () => {
      checkBoth("{b} = true", { b: 1 }, true, false, { b: { type: "boolean", valueTrue: 1, valueFalse: 0 } });
      checkBoth("{b} = 1", { b: 1 }, true, true, { b: { type: "boolean", valueTrue: 1, valueFalse: 0 } });
    });
  });

  // Each check runs with the key off, on for the survey and on globally: choice matching and value-change checks
  // read the global settings, so a per-survey key alone would not show a leak of the strict comparison there.
  describe("conditions only", () => {
    const modes: Array<[string, ISurveySettings, boolean]> = [["off", undefined, false], ["survey", KEY_ON, false], ["global", undefined, true]];
    function forEachMode(check: (mode: string, surveySettings: ISurveySettings) => void): void {
      for (const [mode, surveySettings, globalOn] of modes) {
        settings.comparator.strictEquality = globalOn;
        check(mode, surveySettings);
      }
    }
    test("a choice with value 1 still matches the value true (recorded)", () => {
      const json = { elements: [{ type: "radiogroup", name: "r", choices: [1, 2] }] };
      forEachMode((mode, surveySettings) => {
        const survey = new SurveyModel(json, surveySettings);
        const q = <QuestionRadiogroupModel>survey.getQuestionByName("r");
        q.value = true;
        expect(q.selectedItem?.value, "selectedItem, " + mode).toBe(1);
        expect(q.isItemSelected(q.choices[0]), "isItemSelected, " + mode).toBe(true);
        expect(q.displayValue, "displayValue, " + mode).toBe("1");
      });
    });
    test("setting the same value twice fires onValueChanged once", () => {
      forEachMode((mode, surveySettings) => {
        const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] }, surveySettings);
        const names: Array<string> = [];
        survey.onValueChanged.add((_, options) => names.push(options.name + ":" + JSON.stringify(options.value)));
        survey.setValue("q", true);
        survey.setValue("q", true);
        survey.setValue("q", 1);
        survey.setValue("q", 1);
        // Recorded: the value-change check reads true and 1 as equal (==), so 1 after true fires nothing
        expect(names, mode).toEqual(["q:true"]);
      });
    });
    test("setVariable: true and then 1 fires onVariableChanged once", () => {
      forEachMode((mode, surveySettings) => {
        const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] }, surveySettings);
        let count = 0;
        survey.onVariableChanged.add(() => count++);
        survey.setVariable("a", { a: true });
        survey.setVariable("a", { a: 1 });
        survey.setVariable("b", [true]);
        survey.setVariable("b", [1]);
        expect(count, mode).toBe(2);
      });
    });
    test("a correct answer 1 still accepts the value true (recorded)", () => {
      forEachMode((mode, surveySettings) => {
        const survey = new SurveyModel({ elements: [{ type: "text", name: "q", correctAnswer: 1 }] }, surveySettings);
        survey.setValue("q", true);
        expect(survey.getQuestionByName("q").isAnswerCorrect(), "isAnswerCorrect, " + mode).toBe(true);
        expect(survey.getCorrectAnswerCount(), "getCorrectAnswerCount, " + mode).toBe(1);
      });
    });
    test("a matrix cell value check behaves as today", () => {
      const json = { elements: [{ type: "matrix", name: "m", columns: [1, 2], rows: ["r1"] }] };
      forEachMode((mode, surveySettings) => {
        const survey = new SurveyModel(json, surveySettings);
        const q = <QuestionMatrixModel>survey.getQuestionByName("m");
        q.value = { r1: true };
        const row = q.visibleRows[0];
        expect([row.isChecked(q.columns[0]), row.isChecked(q.columns[1])], mode).toEqual([true, false]);
      });
    });
    test("a matrix dropdown cell matches its choice as today", () => {
      const json = { elements: [{ type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "c1", cellType: "dropdown", choices: [1, 2] }] }] };
      forEachMode((mode, surveySettings) => {
        const survey = new SurveyModel(json, surveySettings);
        const q = <any>survey.getQuestionByName("m");
        q.value = { r1: { c1: true } };
        const cell = q.visibleRows[0].getQuestionByColumnName("c1");
        expect(cell.selectedItem?.value, mode).toBe(1);
      });
    });
  });

  describe("where the key comes from", () => {
    test("the global setting reaches a survey and a runner with no own value", () => {
      settings.comparator.strictEquality = true;
      expect(run("{b} = 1", { b: true })).toBe(false);
      expect(isVisibleInSurvey("{b} = 1", { b: true }, BOOLEAN)).toBe(false);
      expect(isVisibleInSurvey("{b} = 1", { b: true }, BOOLEAN, { comparator: { caseSensitive: true } })).toBe(false);
    });
    test("a survey's own false beats a global true", () => {
      settings.comparator.strictEquality = true;
      expect(isVisibleInSurvey("{b} = 1", { b: true }, BOOLEAN, { comparator: { strictEquality: false } })).toBe(true);
      expect(run("{b} = 1", { b: true }, { comparator: { strictEquality: false } })).toBe(true);
    });
    test("survey.settings() on a loaded survey changes a visibleIf at once", () => {
      const survey = new SurveyModel({ elements: [
        { type: "boolean", name: "b" },
        { type: "text", name: "target", visibleIf: "{b} = 1" }
      ] });
      survey.setValue("b", true);
      const target = survey.getQuestionByName("target");
      expect(target.isVisible, "#1").toBe(true);
      survey.settings({ comparator: { strictEquality: true } });
      expect(target.isVisible, "#2").toBe(false);
      survey.settings({ comparator: { strictEquality: undefined } });
      expect(target.isVisible, "#3").toBe(true);
    });
    test("one runner reused with the key off and on keeps nothing between runs", () => {
      const runner = new ConditionRunner("{b} = 1");
      expect(runner.runValues({ b: true }, undefined, KEY_ON)).toBe(false);
      expect(runner.runValues({ b: true })).toBe(true);
      expect(runner.runValues({ b: true }, undefined, KEY_ON)).toBe(false);
    });
    test("the key reaches a dynamic panel's and a matrix row's conditions", () => {
      const json = { elements: [
        { type: "paneldynamic", name: "p", panelCount: 1, templateElements: [
          { type: "boolean", name: "pb" },
          { type: "text", name: "pt", visibleIf: "{panel.pb} = 1" }
        ] },
        { type: "matrixdynamic", name: "m", rowCount: 1, columns: [
          { cellType: "boolean", name: "c1" },
          { cellType: "text", name: "c2", visibleIf: "{row.c1} = 1" }
        ] }
      ] };
      for (const [surveySettings, expected] of [[undefined, true], [KEY_ON, false]] as Array<[ISurveySettings, boolean]>) {
        const survey = new SurveyModel(json, surveySettings);
        survey.data = { p: [{ pb: true }], m: [{ c1: true }] };
        const panel = (<any>survey.getQuestionByName("p")).panels[0];
        expect(panel.getQuestionByName("pt").isVisible, "panel " + expected).toBe(expected);
        const row = (<any>survey.getQuestionByName("m")).visibleRows[0];
        expect(row.getQuestionByColumnName("c2").isVisible, "matrix row " + expected).toBe(expected);
      }
    });
  });
});
