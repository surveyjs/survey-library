import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { ConsoleWarnings } from "../src/console-warnings";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { ExpressionRunner } from "../src/expressions/expressionRunner";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { applyFilter } from "../src/dynamic-data/dynamic-data-filter";
import { ISurveySettings } from "../src/survey-settings";

export * from "../src/question_text";
export * from "../src/question_checkbox";
export * from "../src/question_matrixdynamic";

const visibleIfJson = {
  elements: [
    { type: "text", name: "q" },
    { type: "text", name: "t", visibleIf: "{q} = 'us'" }
  ]
};
function isTVisible(survey: SurveyModel): boolean {
  return survey.getQuestionByName("t").isVisible;
}
function createWithValue(value: any, options?: any, json: any = visibleIfJson): SurveyModel {
  const survey = new SurveyModel(json, options);
  survey.setValue("q", value);
  return survey;
}

describe("Survey settings", () => {
  let saved: any;
  let warnSpy: any;
  beforeEach(() => {
    saved = {
      trimStrings: settings.comparator.trimStrings,
      caseSensitive: settings.comparator.caseSensitive,
      normalizeTextCallback: settings.comparator.normalizeTextCallback
    };
    warnSpy = vi.spyOn(ConsoleWarnings, "warn").mockImplementation(() => { });
  });
  afterEach(() => {
    settings.comparator.trimStrings = saved.trimStrings;
    settings.comparator.caseSensitive = saved.caseSensitive;
    settings.comparator.normalizeTextCallback = saved.normalizeTextCallback;
    vi.restoreAllMocks();
  });

  test("a survey created without options behaves as today", () => {
    const survey = createWithValue("US");
    expect(isTVisible(survey), "#1: case-insensitive by default").toBe(true);
    survey.setValue("q", " us ");
    expect(isTVisible(survey), "#2: trims by default").toBe(true);
    expect(survey.getSettings().comparator.caseSensitive, "#3").toBe(false);
    expect(survey.getSettings().comparator.trimStrings, "#4").toBe(true);
    expect(warnSpy, "#5: no warning").not.toHaveBeenCalled();
  });

  test("options in the constructor: caseSensitive for one survey only", () => {
    const survey1 = createWithValue("US", { comparator: { caseSensitive: true } });
    const survey2 = createWithValue("US");
    expect(isTVisible(survey1), "#1: case-sensitive survey").toBe(false);
    expect(isTVisible(survey2), "#2: the other survey keeps the global value").toBe(true);
    survey1.setValue("q", "us");
    expect(isTVisible(survey1), "#3").toBe(true);
    expect(settings.comparator.caseSensitive, "#4: the global value is untouched").toBe(false);
  });

  test("the fallback is per leaf key and at read time", () => {
    const survey = createWithValue(" us", { comparator: { caseSensitive: true } });
    expect(isTVisible(survey), "#1: trimStrings comes from the global settings").toBe(true);
    settings.comparator.trimStrings = false;
    survey.setValue("q", "us ");
    expect(isTVisible(survey), "#2: a later global trimStrings reaches the survey").toBe(false);
    expect(survey.getSettings().comparator.trimStrings, "#3").toBe(false);
    settings.comparator.trimStrings = true;
    settings.comparator.caseSensitive = false;
    survey.setValue("q", "US");
    expect(isTVisible(survey), "#4: the global caseSensitive does not override the survey's own value").toBe(false);
    settings.comparator.caseSensitive = true;
    const survey2 = createWithValue("US", { comparator: { caseSensitive: false } });
    expect(isTVisible(survey2), "#5: an own false wins over a global true").toBe(true);
  });

  test("survey.settings() on a loaded survey re-runs conditions at once", () => {
    const survey = createWithValue("US");
    expect(isTVisible(survey), "#1").toBe(true);
    const spy = vi.spyOn(survey as any, "runConditions");
    survey.settings({ comparator: { caseSensitive: true } });
    expect(isTVisible(survey), "#2: hidden at once").toBe(false);
    expect(spy, "#3").toHaveBeenCalledTimes(1);
    survey.settings({ comparator: { caseSensitive: true } });
    expect(spy, "#4: the same values again do not re-run").toHaveBeenCalledTimes(1);
    survey.settings({ comparator: { caseSensitive: undefined } });
    expect(isTVisible(survey), "#5: back to the global value at once").toBe(true);
    expect(spy, "#6").toHaveBeenCalledTimes(2);
    survey.settings({ comparator: { caseSensitive: undefined } });
    expect(spy, "#7: removing a value that is not there does not re-run").toHaveBeenCalledTimes(2);
    survey.settings({});
    expect(spy, "#8: an empty object does not re-run").toHaveBeenCalledTimes(2);
  });

  test("survey.settings() before the JSON is loaded and while loading", () => {
    const survey = new SurveyModel();
    const spy = vi.spyOn(survey as any, "runConditions");
    survey.settings({ comparator: { caseSensitive: true } });
    survey.fromJSON(visibleIfJson);
    survey.setValue("q", "US");
    expect(isTVisible(survey), "#1").toBe(false);
    spy.mockClear();
    (<any>survey).isLoadingFromJsonValue = true;
    survey.settings({ comparator: { caseSensitive: false } });
    expect(spy, "#2: no re-run while loading").not.toHaveBeenCalled();
    (<any>survey).isLoadingFromJsonValue = false;
    expect(survey.getSettings().comparator.caseSensitive, "#3: the value is still applied").toBe(false);
  });

  test("an unknown key warns once with its full path and changes nothing", () => {
    const survey = new SurveyModel(visibleIfJson, <any>{ comparator: { caseSensitiv: true }, comparatorr: { caseSensitive: true } });
    expect(warnSpy, "#1: two unknown keys in the constructor").toHaveBeenCalledTimes(2);
    expect(warnSpy.mock.calls[0][0], "#2").toContain("\"comparator.caseSensitiv\"");
    expect(warnSpy.mock.calls[1][0], "#3").toContain("\"comparatorr\"");
    survey.setValue("q", "US");
    expect(isTVisible(survey), "#4: nothing changed").toBe(true);
    warnSpy.mockClear();
    survey.settings(<any>{ comparator: { caseSensitiv: true, trimStrings: false } });
    expect(warnSpy, "#5: one warning in survey.settings").toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0], "#6").toContain("\"comparator.caseSensitiv\"");
    expect(survey.getSettings().comparator.caseSensitive, "#7").toBe(false);
    expect(survey.getSettings().comparator.trimStrings, "#8: the known key in the same group is applied").toBe(false);
    warnSpy.mockClear();
    survey.settings(<any>{ toString: { a: 1 } });
    expect(warnSpy, "#9: a key of Object.prototype is unknown too").toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0], "#10").toContain("\"toString\"");
  });

  test("events is reserved: no warning in the constructor, a warning in survey.settings", () => {
    const survey = new SurveyModel(visibleIfJson, <any>{ events: {} });
    expect(warnSpy, "#1").not.toHaveBeenCalled();
    survey.settings(<any>{ events: {} });
    expect(warnSpy, "#2").toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0], "#3").toContain("events");
  });

  test("a group set to undefined clears its own values; a group that is not a plain object is ignored", () => {
    const survey = new SurveyModel(visibleIfJson, { comparator: { caseSensitive: true, trimStrings: false } });
    survey.settings({ comparator: undefined });
    expect(survey.getSettings().comparator.caseSensitive, "#1").toBe(false);
    expect(survey.getSettings().comparator.trimStrings, "#2").toBe(true);
    survey.settings({ comparator: { caseSensitive: true } });
    survey.settings(<any>{ comparator: "x" });
    expect(survey.getSettings().comparator.caseSensitive, "#3: ignored").toBe(true);
    survey.settings(<any>{ comparator: ["x"] });
    expect(survey.getSettings().comparator.caseSensitive, "#4: an array is not a plain object").toBe(true);
    survey.settings(<any>{ comparator: null });
    expect(survey.getSettings().comparator.caseSensitive, "#5: null is not a plain object").toBe(true);
    expect(warnSpy, "#6: no warning").not.toHaveBeenCalled();
  });

  test("null is a value; only undefined removes", () => {
    const survey = createWithValue("US", { comparator: { caseSensitive: <any>null } });
    expect(survey.getSettings().comparator.caseSensitive, "#1").toBe(null);
    settings.comparator.caseSensitive = true;
    expect(survey.getSettings().comparator.caseSensitive, "#2: null does not fall back").toBe(null);
  });

  test("survey.settings() with a value that is not a plain object does nothing, with no warning", () => {
    const survey = new SurveyModel(visibleIfJson, { comparator: { caseSensitive: true } });
    const spy = vi.spyOn(survey as any, "runConditions");
    survey.settings(<any>"x");
    survey.settings(<any>[{ comparator: { caseSensitive: false } }]);
    survey.settings(<any>null);
    survey.settings(<any>undefined);
    expect(warnSpy, "#1").not.toHaveBeenCalled();
    expect(survey.getSettings().comparator.caseSensitive, "#2").toBe(true);
    expect(spy, "#3").not.toHaveBeenCalled();
  });

  test("the second constructor argument: render() is called for anything that is not a plain object", () => {
    const renderSpy = vi.spyOn(SurveyModel.prototype, "render");
    const el = document.createElement("div");
    const survey1 = new SurveyModel(visibleIfJson, <any>el);
    expect(renderSpy, "#1: an element").toHaveBeenCalledTimes(1);
    expect(renderSpy.mock.calls[0].length, "#2: with no argument").toBe(0);
    expect(survey1.getAllQuestions().length, "#3: loads as today").toBe(2);
    const survey2 = new SurveyModel(visibleIfJson, <any>"surveyElement");
    expect(renderSpy, "#4: a string").toHaveBeenCalledTimes(2);
    expect(renderSpy.mock.calls[1].length, "#5").toBe(0);
    expect(survey2.getAllQuestions().length, "#6").toBe(2);
    const arr = [{ comparator: { caseSensitive: true } }];
    const survey3 = new SurveyModel(visibleIfJson, <any>arr);
    expect(renderSpy, "#7: an array").toHaveBeenCalledTimes(3);
    expect(renderSpy.mock.calls[2].length, "#8").toBe(0);
    expect(survey3.getSettings().comparator.caseSensitive, "#9: an array is not read as options").toBe(false);
    expect(warnSpy, "#10: no warning").not.toHaveBeenCalled();

    renderSpy.mockClear();
    const nullProto = Object.create(null);
    nullProto.comparator = { caseSensitive: true };
    const parsed = JSON.parse("{ \"comparator\": { \"caseSensitive\": true } }");
    const options = [{ comparator: { caseSensitive: true } }, nullProto, parsed];
    for (let i = 0; i < options.length; i++) {
      const survey = createWithValue("US", options[i]);
      expect(isTVisible(survey), "#11." + i + ": read as options").toBe(false);
    }
    expect(renderSpy, "#12: a plain object is never passed to render").not.toHaveBeenCalled();
    new SurveyModel(visibleIfJson, null);
    new SurveyModel(visibleIfJson, undefined);
    expect(renderSpy, "#13").not.toHaveBeenCalled();
    expect(warnSpy, "#14").not.toHaveBeenCalled();
  });

  test("options are applied before the JSON is loaded", () => {
    const json = {
      elements: [
        { type: "text", name: "q", defaultValue: "US" },
        { type: "text", name: "t", visibleIf: "{q} = 'us'" }
      ]
    };
    const survey = new SurveyModel(json, { comparator: { caseSensitive: true } });
    expect(isTVisible(survey), "#1: the first run of the conditions already uses the options").toBe(false);
  });

  test("contains / notcontains", () => {
    const json = {
      elements: [
        { type: "text", name: "q" },
        { type: "text", name: "t", visibleIf: "{q} contains 'us'" },
        { type: "text", name: "n", visibleIf: "{q} notcontains 'us'" }
      ]
    };
    const s1 = createWithValue("FOCUS US", undefined, json);
    expect(s1.getQuestionByName("t").isVisible, "#1").toBe(true);
    expect(s1.getQuestionByName("n").isVisible, "#2").toBe(false);
    const s2 = createWithValue("FOCUS US", { comparator: { caseSensitive: true } }, json);
    expect(s2.getQuestionByName("t").isVisible, "#3").toBe(false);
    expect(s2.getQuestionByName("n").isVisible, "#4").toBe(true);
  });

  test("anyof / allof / noneof on an array value", () => {
    const json = {
      elements: [
        { type: "checkbox", name: "q", choices: ["US", "UK", "DE"] },
        { type: "text", name: "any", visibleIf: "{q} anyof ['us']" },
        { type: "text", name: "all", visibleIf: "{q} allof ['us', 'uk']" },
        { type: "text", name: "none", visibleIf: "{q} noneof ['us']" }
      ]
    };
    const s1 = createWithValue(["US", "UK"], undefined, json);
    expect(s1.getQuestionByName("any").isVisible, "#1").toBe(true);
    expect(s1.getQuestionByName("all").isVisible, "#2").toBe(true);
    expect(s1.getQuestionByName("none").isVisible, "#3").toBe(false);
    const s2 = createWithValue(["US", "UK"], { comparator: { caseSensitive: true } }, json);
    expect(s2.getQuestionByName("any").isVisible, "#4").toBe(false);
    expect(s2.getQuestionByName("all").isVisible, "#5").toBe(false);
    expect(s2.getQuestionByName("none").isVisible, "#6").toBe(true);
  });

  test(">= / <= on text", () => {
    const json = {
      elements: [
        { type: "text", name: "q" },
        { type: "text", name: "ge", visibleIf: "{q} >= 'US'" },
        { type: "text", name: "le", visibleIf: "{q} <= 'US'" }
      ]
    };
    const s1 = createWithValue("us", undefined, json);
    expect(s1.getQuestionByName("ge").isVisible, "#1").toBe(true);
    expect(s1.getQuestionByName("le").isVisible, "#2").toBe(true);
    const s2 = createWithValue("us", { comparator: { caseSensitive: true } }, json);
    expect(s2.getQuestionByName("ge").isVisible, "#3: 'us' > 'US'").toBe(true);
    expect(s2.getQuestionByName("le").isVisible, "#4: not equal any more").toBe(false);
  });

  test("trimStrings", () => {
    expect(isTVisible(createWithValue(" us")), "#1").toBe(true);
    expect(isTVisible(createWithValue(" us", { comparator: { trimStrings: false } })), "#2").toBe(false);
  });

  test("normalizeTextCallback is not a per-survey key: it warns, and the global callback applies", () => {
    settings.comparator.normalizeTextCallback = (str: string): string => str.replace(/-/g, "");
    const survey = createWithValue("u-s", <any>{ comparator: { normalizeTextCallback: (str: string): string => str } });
    expect(warnSpy, "#1").toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0], "#2").toContain("\"comparator.normalizeTextCallback\"");
    expect(isTVisible(survey), "#3: the global callback").toBe(true);
    expect("normalizeTextCallback" in survey.getSettings().comparator, "#4: not in the view").toBe(false);
  });

  test("isAnswerCorrect for a text question and a checkbox", () => {
    const json = {
      elements: [
        { type: "text", name: "q", correctAnswer: "us" },
        // The correct answer must match a choice exactly (getCorrectAnswerValue); the value is set in code
        { type: "checkbox", name: "c", choices: ["us", "uk"], correctAnswer: ["us", "uk"] }
      ]
    };
    const data = { q: "US", c: ["UK", "US"] };
    const s1 = new SurveyModel(json);
    s1.data = data;
    expect(s1.getQuestionByName("q").isAnswerCorrect(), "#1").toBe(true);
    expect((<QuestionCheckboxModel>s1.getQuestionByName("c")).isAnswerCorrect(), "#2").toBe(true);
    const s2 = new SurveyModel(json, { comparator: { caseSensitive: true } });
    s2.data = data;
    expect(s2.getQuestionByName("q").isAnswerCorrect(), "#3").toBe(false);
    expect(s2.getQuestionByName("c").isAnswerCorrect(), "#4").toBe(false);
    const s3 = new SurveyModel(json, { comparator: { caseSensitive: false } });
    settings.comparator.caseSensitive = true;
    s3.data = data;
    expect(s3.getQuestionByName("q").isAnswerCorrect(), "#5: the survey's caseSensitive beats a global true").toBe(true);
  });

  test("a matrix: useCaseSensitiveComparison falls back to the survey, and its own value wins", () => {
    const json = {
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "c", cellType: "text", isUnique: true }] }]
    };
    const s1 = new SurveyModel(json);
    const m1 = <QuestionMatrixDynamicModel>s1.getQuestionByName("m");
    expect(m1.useCaseSensitiveComparison, "#1").toBe(false);
    m1.value = [{ c: "US" }, { c: "us" }];
    expect(m1.hasErrors(), "#2: a duplicate, case-insensitively").toBe(true);

    const s2 = new SurveyModel(json, { comparator: { caseSensitive: true } });
    const m2 = <QuestionMatrixDynamicModel>s2.getQuestionByName("m");
    expect(m2.useCaseSensitiveComparison, "#3: the survey's value").toBe(true);
    m2.value = [{ c: "US" }, { c: "us" }];
    expect(m2.hasErrors(), "#4: not a duplicate").toBe(false);
    m2.useCaseSensitiveComparison = false;
    expect(m2.useCaseSensitiveComparison, "#5: the matrix's own value wins").toBe(false);
    expect(m2.hasErrors(), "#6").toBe(true);
  });

  test("a text question's minValueExpression compares text at load", () => {
    const json = {
      elements: [{ type: "text", name: "q", inputType: "number", minValueExpression: "iif('US' = 'us', 5, 1)" }]
    };
    const s1 = new SurveyModel(json);
    expect((<QuestionTextModel>s1.getQuestionByName("q")).renderedMin, "#1").toBe(5);
    const s2 = new SurveyModel(json, { comparator: { caseSensitive: true } });
    expect((<QuestionTextModel>s2.getQuestionByName("q")).renderedMin, "#2").toBe(1);
    // Assigned after load, the expression runs with no properties: the survey is found through the context
    const q2 = <QuestionTextModel>s2.getQuestionByName("q");
    q2.minValueExpression = "iif('UK' = 'uk', 6, 2)";
    expect(q2.renderedMin, "#3: after load, the survey is found through the context").toBe(2);
  });

  test("updateSurvey with an absent settings value applies nothing and does not warn", () => {
    const s = new SurveyModel({ elements: [{ type: "text", name: "q" }] }, { comparator: { caseSensitive: true } });
    s.updateSurvey({ settings: undefined });
    s.updateSurvey({ settings: null });
    expect(warnSpy, "#1: no warning").not.toHaveBeenCalled();
    expect(typeof s.settings, "#2: still a function").toBe("function");
    expect(s.getSettings().comparator.caseSensitive, "#3: unchanged").toBe(true);
  });

  test("a dynamic-data list filter uses the survey's settings", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 3, filterExpression: "{name} = 'us'",
        columns: [{ name: "name", cellType: "text" }]
      }]
    };
    const data = { m: [{ name: "US" }, { name: "us" }, { name: "UK" }] };
    const s1 = new SurveyModel(json);
    s1.data = data;
    expect((<QuestionMatrixDynamicModel>s1.getQuestionByName("m")).visibleRows.length, "#1").toBe(2);
    const s2 = new SurveyModel(json, { comparator: { caseSensitive: true } });
    s2.data = data;
    expect((<QuestionMatrixDynamicModel>s2.getQuestionByName("m")).visibleRows.length, "#2").toBe(1);
  });

  test("applyFilter takes the settings as a trailing argument", () => {
    const records = [{ name: "US" }, { name: "us" }, { name: "z-a" }];
    const caseSensitive: ISurveySettings = { comparator: { caseSensitive: true } };
    expect(applyFilter(records, "{name} = 'us'"), "#1").toEqual([0, 1]);
    expect(applyFilter(records, "{name} = 'us'", undefined, caseSensitive), "#2").toEqual([1]);
  });

  test("a question created outside the survey uses the survey's settings once it is added", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] }, { comparator: { caseSensitive: true } });
    const t = new QuestionTextModel("t");
    t.visibleIf = "{q} = 'us'";
    survey.pages[0].addElement(t);
    survey.setValue("q", "US");
    expect(t.isVisible, "#1").toBe(false);
    survey.setValue("q", "us");
    expect(t.isVisible, "#2").toBe(true);
  });

  test("getSettings() returns one read-only view of the effective values", () => {
    const survey = new SurveyModel(visibleIfJson, { comparator: { caseSensitive: true } });
    const view = survey.getSettings();
    expect(survey.getSettings(), "#1: the same object").toBe(view);
    expect(view, "#2: never the global settings").not.toBe(<any>settings);
    expect(view.comparator, "#3: the same group object").toBe(view.comparator);
    expect(JSON.parse(JSON.stringify(view)), "#4").toEqual({ comparator: { trimStrings: true, caseSensitive: true }, data: { keepEmptyValues: false } });
    settings.comparator.trimStrings = false;
    expect(JSON.parse(JSON.stringify(view)), "#5: read at read time").toEqual({ comparator: { trimStrings: false, caseSensitive: true }, data: { keepEmptyValues: false } });
    expect({ ...view.comparator }.caseSensitive, "#6: spread").toBe(true);
    expect(() => { (<any>view.comparator).caseSensitive = false; }, "#7").toThrow();
    expect(() => { (<any>view).comparator = {}; }, "#8").toThrow();
    expect(() => { (<any>view).other = {}; }, "#9").toThrow();
    expect(view.comparator.caseSensitive, "#10").toBe(true);
    expect(settings.comparator.caseSensitive, "#11: the global settings unchanged").toBe(false);
    settings.comparator.trimStrings = true;

    const copy = createWithValue("US", survey.getSettings());
    expect(copy.getSettings().comparator.caseSensitive, "#12: copied").toBe(true);
    expect(isTVisible(copy), "#13").toBe(false);
    const other = new SurveyModel(visibleIfJson);
    other.settings(survey.getSettings());
    expect(other.getSettings().comparator.caseSensitive, "#14: settings() copies too").toBe(true);
    expect(warnSpy, "#15").not.toHaveBeenCalled();
  });

  test("getOwnSettings() is undefined until the survey sets a key itself, so comparisons read the global settings", () => {
    const survey = createWithValue("US");
    expect(survey.getOwnSettings(), "#1: no own settings").toBeUndefined();
    expect(survey.getSettings().comparator.caseSensitive, "#2: the view is still there").toBe(false);
    settings.comparator.caseSensitive = true;
    survey.runExpressions();
    expect(isTVisible(survey), "#3: a global change applies").toBe(false);
    settings.comparator.caseSensitive = false;
    survey.settings({ comparator: { caseSensitive: true } });
    expect(survey.getOwnSettings(), "#4: the view once a key is set").toBe(survey.getSettings());
    expect(isTVisible(survey), "#5").toBe(false);
    survey.settings({ comparator: { caseSensitive: undefined } });
    expect(survey.getOwnSettings(), "#6: undefined again after the key is removed").toBeUndefined();
    expect(isTVisible(survey), "#7").toBe(true);
    const s2 = createWithValue("US", { comparator: { trimStrings: false } });
    expect(s2.getOwnSettings(), "#8: from the constructor").toBe(s2.getSettings());
  });

  test("getSettings() works during construction, before the JSON is loaded", () => {
    let fromEvent: ISurveySettings;
    class TestSurvey extends SurveyModel {
      public fromJSON(json: any, options?: any): void {
        fromEvent = this.getSettings();
        super.fromJSON(json, options);
      }
    }
    const survey = new TestSurvey(visibleIfJson, { comparator: { caseSensitive: true } });
    expect(fromEvent, "#1").toBe(survey.getSettings());
    expect(fromEvent.comparator.caseSensitive, "#2").toBe(true);
  });

  test("a standalone ConditionRunner / ExpressionRunner takes the settings", () => {
    const runner = new ConditionRunner("{a} = 'us'");
    expect(runner.runValues({ a: "US" }), "#1").toBe(true);
    expect(runner.runValues({ a: "US" }, undefined, { comparator: { caseSensitive: true } }), "#2").toBe(false);
    expect(runner.runValues({ a: "US" }), "#3: nothing is kept on the runner").toBe(true);
    const exprRunner = new ExpressionRunner("iif({a} = 'us', 1, 2)");
    expect(exprRunner.runValues({ a: "US" }), "#4").toBe(1);
    expect(exprRunner.runValues({ a: "US" }, undefined, { comparator: { caseSensitive: true } }), "#5").toBe(2);
    const survey = new SurveyModel(visibleIfJson, { comparator: { caseSensitive: false } });
    settings.comparator.caseSensitive = true;
    expect(runner.runValues({ a: "US" }, { survey: survey }), "#6: properties.survey").toBe(true);
    expect(runner.runValues({ a: "US" }, { survey: survey }, { comparator: { caseSensitive: true } }), "#7: the explicit settings win").toBe(false);
  });

  test("updateSurvey() routes a settings prop to survey.settings()", () => {
    const survey = createWithValue("US");
    survey.updateSurvey({ model: survey, settings: { comparator: { caseSensitive: true } } });
    expect(typeof survey.settings, "#1: still a method").toBe("function");
    expect(isTVisible(survey), "#2").toBe(false);
  });
});
