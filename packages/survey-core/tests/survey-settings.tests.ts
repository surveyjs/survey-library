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
import { ISurveyRuntimeSettings } from "../src/survey-settings";

export * from "../src/question_text";
export * from "../src/question_checkbox";
export * from "../src/question_matrixdynamic";

const visibleIfJson = {
  elements: [
    { type: "text", name: "q" },
    { type: "text", name: "t", visibleIf: "{q} = 'us'" }
  ]
};
const caseSensitiveOptions = { runtimeSettings: { comparator: { caseSensitive: true } } };
function isTVisible(survey: SurveyModel): boolean {
  return survey.getQuestionByName("t").isVisible;
}
function createWithValue(value: any, options?: any, json: any = visibleIfJson): SurveyModel {
  const survey = new SurveyModel(json, options);
  survey.setValue("q", value);
  return survey;
}

describe("Survey runtime settings", () => {
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
    expect(survey.runtimeSettings.comparator.caseSensitive, "#3").toBe(false);
    expect(survey.runtimeSettings.comparator.trimStrings, "#4").toBe(true);
    expect(warnSpy, "#5: no warning").not.toHaveBeenCalled();
  });

  test("options in the constructor: caseSensitive for one survey only", () => {
    const survey1 = createWithValue("US", caseSensitiveOptions);
    const survey2 = createWithValue("US");
    expect(isTVisible(survey1), "#1: case-sensitive survey").toBe(false);
    expect(isTVisible(survey2), "#2: the other survey keeps the global value").toBe(true);
    survey1.setValue("q", "us");
    expect(isTVisible(survey1), "#3").toBe(true);
    expect(settings.comparator.caseSensitive, "#4: the global value is untouched").toBe(false);
  });

  test("the fallback is per leaf key and at read time", () => {
    const survey = createWithValue(" us", caseSensitiveOptions);
    expect(isTVisible(survey), "#1: trimStrings comes from the global settings").toBe(true);
    settings.comparator.trimStrings = false;
    survey.setValue("q", "us ");
    expect(isTVisible(survey), "#2: a later global trimStrings reaches the survey").toBe(false);
    expect(survey.runtimeSettings.comparator.trimStrings, "#3").toBe(false);
    settings.comparator.trimStrings = true;
    settings.comparator.caseSensitive = false;
    survey.setValue("q", "US");
    expect(isTVisible(survey), "#4: the global caseSensitive does not override the survey's own value").toBe(false);
    settings.comparator.caseSensitive = true;
    const survey2 = createWithValue("US", { runtimeSettings: { comparator: { caseSensitive: false } } });
    expect(isTVisible(survey2), "#5: an own false wins over a global true").toBe(true);
  });

  test("the options are read-only: runtimeSettings, propertyDefaults and events are set in the constructor only", () => {
    const survey = createWithValue("US", caseSensitiveOptions);
    expect((<any>survey).settings, "#1: no settings() method").toBeUndefined();
    expect((<any>survey).getSettings, "#2: no getSettings() method").toBeUndefined();
    expect((<any>survey).propertyDefaults, "#3: no propertyDefaults() method").toBeUndefined();
    expect(() => { (<any>survey).runtimeSettings = { comparator: { caseSensitive: false } }; }, "#4: no setter").toThrow();
    expect(survey.runtimeSettings.comparator.caseSensitive, "#5").toBe(true);
    expect(isTVisible(survey), "#6: unchanged").toBe(false);
  });

  test("an unknown runtime setting warns once with its full path and changes nothing", () => {
    const survey = new SurveyModel(visibleIfJson, <any>{ runtimeSettings: { comparator: { caseSensitiv: true, trimStrings: false }, comparatorr: { caseSensitive: true }, toString: { a: 1 } } });
    expect(warnSpy, "#1: three unknown keys").toHaveBeenCalledTimes(3);
    expect(warnSpy.mock.calls[0][0], "#2").toContain("\"comparator.caseSensitiv\"");
    expect(warnSpy.mock.calls[1][0], "#3").toContain("\"comparatorr\"");
    expect(warnSpy.mock.calls[2][0], "#4: a key of Object.prototype is unknown too").toContain("\"toString\"");
    expect(survey.runtimeSettings.comparator.caseSensitive, "#5").toBe(false);
    expect(survey.runtimeSettings.comparator.trimStrings, "#6: the known key in the same group is applied").toBe(false);
    survey.setValue("q", "US");
    expect(isTVisible(survey), "#7").toBe(true);
  });

  test("an unknown option warns; a runtime setting at the top level points to runtimeSettings and is not applied", () => {
    const survey = createWithValue("US", <any>{ comparator: { caseSensitive: true }, keepEmptyValues: true, renderedElement: 1 });
    expect(warnSpy, "#1").toHaveBeenCalledTimes(3);
    expect(warnSpy.mock.calls[0][0], "#2").toContain("\"comparator\"");
    expect(warnSpy.mock.calls[0][0], "#3").toContain("runtimeSettings");
    expect(warnSpy.mock.calls[1][0], "#4").toContain("\"keepEmptyValues\"");
    expect(warnSpy.mock.calls[2][0], "#5").toContain("\"renderedElement\"");
    expect(warnSpy.mock.calls[2][0], "#6").not.toContain("runtimeSettings");
    expect(survey.getOwnRuntimeSettings(), "#7: nothing is applied").toBeUndefined();
    expect(isTVisible(survey), "#8").toBe(true);
    warnSpy.mockClear();
    new SurveyModel(visibleIfJson, { runtimeSettings: {}, events: {}, propertyDefaults: {} });
    expect(warnSpy, "#9: the known options do not warn").not.toHaveBeenCalled();
  });

  test("a __proto__ or constructor key warns and never reaches Object.prototype", () => {
    const payload = "{ \"caseSensitive\": true, \"polluted\": \"yes\" }";
    const group = "{ \"__proto__\": " + payload + ", \"constructor\": " + payload;
    const options = JSON.parse(group + ", \"runtimeSettings\": " + group + ", \"comparator\": " + group + " } } }");
    const survey = new SurveyModel(visibleIfJson, options);
    expect(({} as any).polluted, "#1: Object.prototype is untouched").toBeUndefined();
    expect(({} as any).caseSensitive, "#2").toBeUndefined();
    expect(survey.getOwnRuntimeSettings(), "#3: the survey sets nothing itself").toBeUndefined();
    expect(warnSpy, "#4: two keys in the options, two in runtimeSettings, two in comparator").toHaveBeenCalledTimes(6);
    expect(warnSpy.mock.calls[0][0], "#5").toContain("\"__proto__\"");
    expect(warnSpy.mock.calls[5][0], "#6").toContain("\"comparator.constructor\"");
  });

  test("runtimeSettings or a group that is not a plain object is ignored with no warning; undefined is not an own value", () => {
    const values: Array<any> = ["x", ["x"], null, 5];
    for (let i = 0; i < values.length; i++) {
      const s1 = new SurveyModel(visibleIfJson, <any>{ runtimeSettings: values[i] });
      expect(s1.getOwnRuntimeSettings(), "#1." + i + ": runtimeSettings").toBeUndefined();
      const s2 = new SurveyModel(visibleIfJson, <any>{ runtimeSettings: { comparator: values[i] } });
      expect(s2.getOwnRuntimeSettings(), "#2." + i + ": the comparator group").toBeUndefined();
    }
    const s3 = new SurveyModel(visibleIfJson, { runtimeSettings: { comparator: undefined, keepEmptyValues: undefined } });
    expect(s3.getOwnRuntimeSettings(), "#3: undefined groups").toBeUndefined();
    const s4 = new SurveyModel(visibleIfJson, { runtimeSettings: { comparator: { caseSensitive: undefined } } });
    expect(s4.getOwnRuntimeSettings(), "#4: an undefined key").toBeUndefined();
    expect(warnSpy, "#5: no warning").not.toHaveBeenCalled();
  });

  test("null is a value; it does not fall back", () => {
    const survey = createWithValue("US", { runtimeSettings: { comparator: { caseSensitive: <any>null } } });
    expect(survey.runtimeSettings.comparator.caseSensitive, "#1").toBe(null);
    settings.comparator.caseSensitive = true;
    expect(survey.runtimeSettings.comparator.caseSensitive, "#2: null does not fall back").toBe(null);
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
    const arr = [caseSensitiveOptions];
    const survey3 = new SurveyModel(visibleIfJson, <any>arr);
    expect(renderSpy, "#7: an array").toHaveBeenCalledTimes(3);
    expect(renderSpy.mock.calls[2].length, "#8").toBe(0);
    expect(survey3.runtimeSettings.comparator.caseSensitive, "#9: an array is not read as options").toBe(false);
    expect(warnSpy, "#10: no warning").not.toHaveBeenCalled();

    renderSpy.mockClear();
    const nullProto = Object.create(null);
    nullProto.runtimeSettings = { comparator: { caseSensitive: true } };
    const parsed = JSON.parse("{ \"runtimeSettings\": { \"comparator\": { \"caseSensitive\": true } } }");
    const options = [caseSensitiveOptions, nullProto, parsed];
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
    const survey = new SurveyModel(json, caseSensitiveOptions);
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
    const s2 = createWithValue("FOCUS US", caseSensitiveOptions, json);
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
    const s2 = createWithValue(["US", "UK"], caseSensitiveOptions, json);
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
    const s2 = createWithValue("us", caseSensitiveOptions, json);
    expect(s2.getQuestionByName("ge").isVisible, "#3: 'us' > 'US'").toBe(true);
    expect(s2.getQuestionByName("le").isVisible, "#4: not equal any more").toBe(false);
  });

  test("trimStrings", () => {
    expect(isTVisible(createWithValue(" us")), "#1").toBe(true);
    expect(isTVisible(createWithValue(" us", { runtimeSettings: { comparator: { trimStrings: false } } })), "#2").toBe(false);
  });

  test("normalizeTextCallback is not a per-survey key: it warns, and the global callback applies", () => {
    settings.comparator.normalizeTextCallback = (str: string): string => str.replace(/-/g, "");
    const survey = createWithValue("u-s", <any>{ runtimeSettings: { comparator: { normalizeTextCallback: (str: string): string => str } } });
    expect(warnSpy, "#1").toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0], "#2").toContain("\"comparator.normalizeTextCallback\"");
    expect(isTVisible(survey), "#3: the global callback").toBe(true);
    expect("normalizeTextCallback" in survey.runtimeSettings.comparator, "#4: not in the view").toBe(false);
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
    const s2 = new SurveyModel(json, caseSensitiveOptions);
    s2.data = data;
    expect(s2.getQuestionByName("q").isAnswerCorrect(), "#3").toBe(false);
    expect(s2.getQuestionByName("c").isAnswerCorrect(), "#4").toBe(false);
    const s3 = new SurveyModel(json, { runtimeSettings: { comparator: { caseSensitive: false } } });
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

    const s2 = new SurveyModel(json, caseSensitiveOptions);
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
    const s2 = new SurveyModel(json, caseSensitiveOptions);
    expect((<QuestionTextModel>s2.getQuestionByName("q")).renderedMin, "#2").toBe(1);
    // Assigned after load, the expression runs with no properties: the survey is found through the context
    const q2 = <QuestionTextModel>s2.getQuestionByName("q");
    q2.minValueExpression = "iif('UK' = 'uk', 6, 2)";
    expect(q2.renderedMin, "#3: after load, the survey is found through the context").toBe(2);
  });

  test("a dynamic-data list filter uses the survey's runtime settings", () => {
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
    const s2 = new SurveyModel(json, caseSensitiveOptions);
    s2.data = data;
    expect((<QuestionMatrixDynamicModel>s2.getQuestionByName("m")).visibleRows.length, "#2").toBe(1);
  });

  test("applyFilter takes the runtime settings as a trailing argument", () => {
    const records = [{ name: "US" }, { name: "us" }, { name: "z-a" }];
    const caseSensitive: ISurveyRuntimeSettings = { comparator: { caseSensitive: true } };
    expect(applyFilter(records, "{name} = 'us'"), "#1").toEqual([0, 1]);
    expect(applyFilter(records, "{name} = 'us'", undefined, caseSensitive), "#2").toEqual([1]);
  });

  test("a question created outside the survey uses the survey's runtime settings once it is added", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] }, caseSensitiveOptions);
    const t = new QuestionTextModel("t");
    t.visibleIf = "{q} = 'us'";
    survey.pages[0].addElement(t);
    survey.setValue("q", "US");
    expect(t.isVisible, "#1").toBe(false);
    survey.setValue("q", "us");
    expect(t.isVisible, "#2").toBe(true);
  });

  test("runtimeSettings returns one read-only view of the effective values", () => {
    const survey = new SurveyModel(visibleIfJson, caseSensitiveOptions);
    const view = survey.runtimeSettings;
    expect(survey.runtimeSettings, "#1: the same object").toBe(view);
    expect(view, "#2: never the global settings").not.toBe(<any>settings);
    expect(view.comparator, "#3: the same group object").toBe(view.comparator);
    expect(JSON.parse(JSON.stringify(view)), "#4").toEqual({ comparator: { trimStrings: true, caseSensitive: true, numericStringsAsText: false, strictEquality: false }, keepEmptyValues: false });
    settings.comparator.trimStrings = false;
    expect(JSON.parse(JSON.stringify(view)), "#5: read at read time").toEqual({ comparator: { trimStrings: false, caseSensitive: true, numericStringsAsText: false, strictEquality: false }, keepEmptyValues: false });
    expect({ ...view.comparator }.caseSensitive, "#6: spread").toBe(true);
    expect(() => { (<any>view.comparator).caseSensitive = false; }, "#7").toThrow();
    expect(() => { (<any>view).comparator = {}; }, "#8").toThrow();
    expect(() => { (<any>view).other = {}; }, "#9").toThrow();
    expect(view.comparator.caseSensitive, "#10").toBe(true);
    expect(settings.comparator.caseSensitive, "#11: the global settings unchanged").toBe(false);
    settings.comparator.trimStrings = true;

    const copy = createWithValue("US", { runtimeSettings: survey.runtimeSettings });
    expect(copy.runtimeSettings.comparator.caseSensitive, "#12: copied").toBe(true);
    expect(isTVisible(copy), "#13").toBe(false);
    expect(warnSpy, "#14").not.toHaveBeenCalled();
  });

  test("getOwnRuntimeSettings() is undefined when the survey sets no key itself, so comparisons read the global settings", () => {
    const survey = createWithValue("US");
    expect(survey.getOwnRuntimeSettings(), "#1: no own settings").toBeUndefined();
    expect(survey.runtimeSettings.comparator.caseSensitive, "#2: the view is still there").toBe(false);
    settings.comparator.caseSensitive = true;
    survey.runExpressions();
    expect(isTVisible(survey), "#3: a global change applies").toBe(false);
    settings.comparator.caseSensitive = false;
    const s2 = createWithValue("US", { runtimeSettings: { comparator: { trimStrings: false } } });
    expect(s2.getOwnRuntimeSettings(), "#4: from the constructor").toBe(s2.runtimeSettings);
  });

  test("keepEmptyValues is a top-level key: an own value, or the global value at read time", () => {
    const survey = new SurveyModel(visibleIfJson, { runtimeSettings: { keepEmptyValues: true } });
    const view = survey.runtimeSettings;
    expect(view.keepEmptyValues, "#1: from the constructor").toBe(true);
    expect(survey.getOwnRuntimeSettings(), "#2: an own value").toBe(view);
    expect(() => { (<any>view).keepEmptyValues = false; }, "#3: read-only").toThrow();
    const s2 = new SurveyModel(visibleIfJson, { runtimeSettings: { keepEmptyValues: undefined } });
    expect(s2.getOwnRuntimeSettings(), "#4: undefined is not an own value").toBeUndefined();
    settings.keepEmptyValues = true;
    expect(s2.runtimeSettings.keepEmptyValues, "#5: the global value at read time").toBe(true);
    settings.keepEmptyValues = false;
    const s3 = new SurveyModel(visibleIfJson, <any>{ runtimeSettings: { data: { keepEmptyValues: true } } });
    expect(warnSpy, "#6: the data group is unknown").toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0], "#7").toContain("\"data\"");
    expect(s3.runtimeSettings.keepEmptyValues, "#8").toBe(false);
  });

  test("runtimeSettings works during construction, before the JSON is loaded", () => {
    let fromEvent: ISurveyRuntimeSettings;
    class TestSurvey extends SurveyModel {
      public fromJSON(json: any, options?: any): void {
        fromEvent = this.runtimeSettings;
        super.fromJSON(json, options);
      }
    }
    const survey = new TestSurvey(visibleIfJson, caseSensitiveOptions);
    expect(fromEvent, "#1").toBe(survey.runtimeSettings);
    expect(fromEvent.comparator.caseSensitive, "#2").toBe(true);
  });

  test("a standalone ConditionRunner / ExpressionRunner takes the runtime settings", () => {
    const runner = new ConditionRunner("{a} = 'us'");
    expect(runner.runValues({ a: "US" }), "#1").toBe(true);
    expect(runner.runValues({ a: "US" }, undefined, { comparator: { caseSensitive: true } }), "#2").toBe(false);
    expect(runner.runValues({ a: "US" }), "#3: nothing is kept on the runner").toBe(true);
    const exprRunner = new ExpressionRunner("iif({a} = 'us', 1, 2)");
    expect(exprRunner.runValues({ a: "US" }), "#4").toBe(1);
    expect(exprRunner.runValues({ a: "US" }, undefined, { comparator: { caseSensitive: true } }), "#5").toBe(2);
    const survey = new SurveyModel(visibleIfJson, { runtimeSettings: { comparator: { caseSensitive: false } } });
    settings.comparator.caseSensitive = true;
    expect(runner.runValues({ a: "US" }, { survey: survey }), "#6: properties.survey").toBe(true);
    expect(runner.runValues({ a: "US" }, { survey: survey }, { comparator: { caseSensitive: true } }), "#7: the explicit settings win").toBe(false);
  });
});
