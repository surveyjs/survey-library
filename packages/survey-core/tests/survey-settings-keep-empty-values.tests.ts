import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { QuestionFileModel } from "../src/question_file";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixModel } from "../src/question_matrix";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { IAction } from "../src/actions/action";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { describe, expect, test, afterEach } from "vitest";

const keepOn = { data: { keepEmptyValues: true } };
const createSurvey = (json: any, isKeepOn: boolean): SurveyModel => isKeepOn ? new SurveyModel(json, keepOn) : new SurveyModel(json);
const offAndOn = [false, true];
const caseName = (isKeepOn: boolean): string => isKeepOn ? "the key on" : "the key off";
const blurText = (q: Question, text: string): void => (<QuestionTextModel>q).onBlur({ target: { value: text } });
const getClearAction = (q: Question): IAction => <IAction>q.getTitleActions()[0];

describe("data.keepEmptyValues: a respondent's own clear", () => {
  offAndOn.forEach(isKeepOn => {
    test("a text question: type a text, then erase it, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "text", name: "q" }] }, isKeepOn);
      const q = survey.getQuestionByName("q");
      blurText(q, "x");
      expect(survey.data, "#1").toEqual({ q: "x" });
      blurText(q, "");
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { q: "" } : {});
      expect(q.isEmpty(), "#3: the question is empty either way").toBe(true);
    });
    test("a comment question: type a text, then erase it, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "comment", name: "q" }] }, isKeepOn);
      const q = <QuestionCommentModel>survey.getQuestionByName("q");
      q.textAreaModel.onTextAreaChange({ target: { value: "x" } });
      expect(survey.data, "#1").toEqual({ q: "x" });
      q.textAreaModel.onTextAreaChange({ target: { value: "" } });
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { q: "" } : {});
    });
    test("a checkbox: check one item, then uncheck it, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "checkbox", name: "q", choices: ["a", "b"] }] }, isKeepOn);
      const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
      q.clickItemHandler(q.choices[0], true);
      expect(survey.data, "#1").toEqual({ q: ["a"] });
      q.clickItemHandler(q.choices[0], false);
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { q: [] } : {});
    });
    test("a dropdown cleared by its clear button, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }] }, isKeepOn);
      const q = <QuestionDropdownModel>survey.getQuestionByName("q");
      q.value = "a";
      q.dropdownListModel.onClear(<any>{ preventDefault: () => {}, stopPropagation: () => {} });
      expect(survey.data).toStrictEqual(isKeepOn ? { q: null } : {});
      expect(q.isEmpty(), "the question is empty").toBe(true);
    });
    test("a radiogroup cleared by its clear button, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"], allowClear: true }] }, isKeepOn);
      survey.css = defaultCss;
      const q = survey.getQuestionByName("q");
      q.value = "a";
      getClearAction(q).action();
      expect(survey.data).toStrictEqual(isKeepOn ? { q: null } : {});
    });
    test("a rating: a click on the selected item clears it, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "rating", name: "q" }] }, isKeepOn);
      const q = <QuestionRatingModel>survey.getQuestionByName("q");
      q.setValueFromClick("3");
      expect(survey.data, "#1").toEqual({ q: 3 });
      q.setValueFromClick("3");
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { q: null } : {});
    });
    test("multiple text: erasing the only item, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "multipletext", name: "q", items: [{ name: "t1" }, { name: "t2" }] }] }, isKeepOn);
      const q = <QuestionMultipleTextModel>survey.getQuestionByName("q");
      q.items[0].editor.value = "x";
      expect(survey.data, "#1").toEqual({ q: { t1: "x" } });
      q.items[0].editor.value = "";
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { q: {} } : {});
    });
    test("a single-select matrix cleared by its clear button, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "matrix", name: "q", rows: ["r1"], columns: ["c1"], allowClear: true }] }, isKeepOn);
      survey.css = defaultCss;
      const q = <QuestionMatrixModel>survey.getQuestionByName("q");
      q.value = { r1: "c1" };
      getClearAction(q).action();
      expect(survey.data).toStrictEqual(isKeepOn ? { q: {} } : {});
    });
    test("file: the remove button on the last file, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "file", name: "q", allowMultiple: true, confirmDelete: false }] }, isKeepOn);
      survey.onClearFiles.add((_, options) => { options.callback("success"); });
      const q = <QuestionFileModel>survey.getQuestionByName("q");
      survey.data = { q: [{ name: "f1", content: "data1" }] };
      q.doRemoveFile(q.value[0]);
      expect(survey.data).toStrictEqual(isKeepOn ? { q: [] } : {});
    });
    test("file: the Clear button, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "file", name: "q", allowMultiple: true, confirmDelete: false }] }, isKeepOn);
      survey.onClearFiles.add((_, options) => { options.callback("success"); });
      const q = <QuestionFileModel>survey.getQuestionByName("q");
      survey.data = { q: [{ name: "f1", content: "data1" }, { name: "f2", content: "data2" }] };
      q.doClean();
      expect(survey.data).toStrictEqual(isKeepOn ? { q: [] } : {});
    });
    test("a masked text: erase the input, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [
        { type: "text", name: "n", maskType: "numeric" },
        { type: "text", name: "p", maskType: "pattern", maskSettings: { pattern: "999-99" } }
      ] }, isKeepOn);
      const n = <QuestionTextModel>survey.getQuestionByName("n");
      const p = <QuestionTextModel>survey.getQuestionByName("p");
      n.inputValue = "12";
      p.inputValue = "123-45";
      expect(survey.data, "#1").toEqual({ n: 12, p: "12345" });
      p.inputValue = "123-4_";
      expect(survey.data, "#2: an incomplete entry has no value").toEqual({ n: 12 });
      p.inputValue = "123-45";
      n.inputValue = "";
      p.inputValue = "___-__";
      expect(survey.data, "#3: erased").toStrictEqual(isKeepOn ? { n: "", p: "" } : {});
    });
    test("a boolean cleared by its clear button, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "boolean", name: "q", allowClear: true }] }, isKeepOn);
      survey.css = defaultCss;
      const q = survey.getQuestionByName("q");
      q.value = true;
      getClearAction(q).action();
      expect(survey.data, "#1").toStrictEqual(isKeepOn ? { q: null } : {});
      expect(q.isEmpty(), "#2").toBe(true);
      expect((<any>q).booleanValue, "#3: indeterminate").toBeNull();
    });
    test("a tagbox cleared by its clear button, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "tagbox", name: "q", choices: ["a", "b"] }] }, isKeepOn);
      const q = <any>survey.getQuestionByName("q");
      q.value = ["a"];
      q.dropdownListModel.onClear(<any>{ preventDefault: () => {}, stopPropagation: () => {} });
      expect(survey.data).toStrictEqual(isKeepOn ? { q: [] } : {});
    });
    test("a multi-select matrix cleared by its clear button removes the key, as a dynamic matrix does, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [{ type: "matrixdropdown", name: "q", allowClear: true, rows: ["r1"], columns: [{ name: "c1", cellType: "text" }] }] }, isKeepOn);
      survey.css = defaultCss;
      const q = survey.getQuestionByName("q");
      q.value = { r1: { c1: "a" } };
      getClearAction(q).action();
      expect(survey.data, "#1").toStrictEqual({});
      expect(q.isEmpty(), "#2").toBe(true);
    });
  });
  test("values inside a dynamic panel item or a matrix row are not kept: an erased text leaves the item or row empty", () => {
    const survey = createSurvey({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 1, templateElements: [{ type: "text", name: "t" }] },
      { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c", cellType: "text" }] }
    ] }, true);
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    blurText(p.panels[0].getQuestionByName("t"), "x");
    blurText(p.panels[0].getQuestionByName("t"), "");
    m.visibleRows[0].cells[0].question.value = "x";
    m.visibleRows[0].cells[0].question.value = "";
    expect(survey.data).toStrictEqual({ p: [{}], m: [{}] });
  });
  test("an empty value assigned in code or by a setvalue trigger is kept, as a respondent's clear", () => {
    const survey = createSurvey({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "q" }],
      triggers: [{ type: "setvalue", expression: "{a} = 1", setToName: "q", setValue: "" }]
    }, true);
    survey.setValue("q", "x");
    survey.setValue("q", "");
    expect(survey.data, "#1: survey.setValue").toStrictEqual({ q: "" });
    survey.clearValue("q");
    survey.setValue("q", "x");
    survey.setValue("a", 1);
    expect(survey.data, "#2: the trigger").toStrictEqual({ q: "", a: 1 });
  });
  test("onValueChanged fires for a respondent's clear with the empty value, as with the key off", () => {
    offAndOn.forEach(isKeepOn => {
      const survey = createSurvey({ elements: [{ type: "text", name: "q" }, { type: "checkbox", name: "c", choices: ["a"] }] }, isKeepOn);
      const changes: Array<any> = [];
      survey.onValueChanged.add((_, options) => { changes.push({ name: options.name, value: options.value }); });
      blurText(survey.getQuestionByName("q"), "x");
      blurText(survey.getQuestionByName("q"), "");
      const c = <QuestionCheckboxModel>survey.getQuestionByName("c");
      c.clickItemHandler(c.choices[0], true);
      c.clickItemHandler(c.choices[0], false);
      expect(changes, caseName(isKeepOn)).toEqual([
        { name: "q", value: "x" }, { name: "q", value: "" }, { name: "c", value: ["a"] }, { name: "c", value: [] }
      ]);
    });
  });
  test("hasValue('q') is true after a respondent's clear with the key on, false with it off", () => {
    offAndOn.forEach(isKeepOn => {
      const survey = createSurvey({ elements: [{ type: "text", name: "q" }, { type: "text", name: "r", visibleIf: "hasValue('q')" }] }, isKeepOn);
      const r = survey.getQuestionByName("r");
      expect(r.isVisible, "untouched").toBe(false);
      blurText(survey.getQuestionByName("q"), "x");
      blurText(survey.getQuestionByName("q"), "");
      expect(r.isVisible, "cleared, " + caseName(isKeepOn)).toBe(isKeepOn);
      expect(new ConditionRunner("hasValue('q')").runValues(survey.data), "with the data, " + caseName(isKeepOn)).toBe(isKeepOn);
    });
  });
  test("clearEmptyValues() removes what the key kept", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q" }, { type: "checkbox", name: "c", choices: ["a"] }] }, true);
    blurText(survey.getQuestionByName("q"), "x");
    blurText(survey.getQuestionByName("q"), "");
    const c = <QuestionCheckboxModel>survey.getQuestionByName("c");
    c.clickItemHandler(c.choices[0], true);
    c.clickItemHandler(c.choices[0], false);
    expect(survey.data, "#1").toStrictEqual({ q: "", c: [] });
    survey.clearEmptyValues();
    expect(survey.data, "#2").toStrictEqual({});
  });
  test("completion does not remove an empty value the key kept", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q" }] }, true);
    blurText(survey.getQuestionByName("q"), "x");
    blurText(survey.getQuestionByName("q"), "");
    survey.doComplete();
    expect(survey.data).toStrictEqual({ q: "" });
  });
  test("the key set by survey.settings() after load applies to the next clear", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] });
    const q = survey.getQuestionByName("q");
    blurText(q, "x");
    blurText(q, "");
    expect(survey.data, "#1: the key is off").toStrictEqual({});
    survey.settings({ data: { keepEmptyValues: true } });
    blurText(q, "x");
    blurText(q, "");
    expect(survey.data, "#2: the key is on").toStrictEqual({ q: "" });
    survey.settings({ data: { keepEmptyValues: false } });
    blurText(q, "x");
    blurText(q, "");
    expect(survey.data, "#3: the key is off again").toStrictEqual({});
  });
  describe("the global settings", () => {
    afterEach(() => { settings.data.keepEmptyValues = false; });
    test("a survey without its own value follows the global key at the time of the clear", () => {
      const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] });
      settings.data.keepEmptyValues = true;
      blurText(survey.getQuestionByName("q"), "x");
      blurText(survey.getQuestionByName("q"), "");
      expect(survey.data).toStrictEqual({ q: "" });
    });
    test("a survey's own false wins over the global true", () => {
      settings.data.keepEmptyValues = true;
      const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] }, { data: { keepEmptyValues: false } });
      blurText(survey.getQuestionByName("q"), "x");
      blurText(survey.getQuestionByName("q"), "");
      expect(survey.data).toStrictEqual({});
    });
  });
});

describe("data.keepEmptyValues: a system clear removes the key with the key on", () => {
  test("clearIfInvisible: \"onHidden\" hides a question with a value", () => {
    const survey = createSurvey({ clearInvisibleValues: "onHidden", elements: [
      { type: "text", name: "a" },
      { type: "text", name: "q", visibleIf: "{a} != 'hide'" },
      { type: "checkbox", name: "c", choices: ["x"], visibleIf: "{a} != 'hide'" }
    ] }, true);
    survey.setValue("q", "v");
    survey.setValue("c", ["x"]);
    survey.setValue("a", "hide");
    expect(survey.data).toStrictEqual({ a: "hide" });
  });
  test("a kept empty value goes with a later system clear", () => {
    const survey = createSurvey({ clearInvisibleValues: "onHidden", elements: [
      { type: "text", name: "a" },
      { type: "text", name: "q", visibleIf: "{a} != 'hide'" },
      { type: "checkbox", name: "c", choices: ["x"] }
    ] }, true);
    blurText(survey.getQuestionByName("q"), "v");
    blurText(survey.getQuestionByName("q"), "");
    const c = <QuestionCheckboxModel>survey.getQuestionByName("c");
    c.clickItemHandler(c.choices[0], true);
    c.clickItemHandler(c.choices[0], false);
    expect(survey.data, "#1").toStrictEqual({ q: "", c: [] });
    survey.setValue("a", "hide");
    expect(survey.data, "#2: hidden").toStrictEqual({ a: "hide", c: [] });
    survey.clearValue("c");
    expect(survey.data, "#3: survey.clearValue").toStrictEqual({ a: "hide" });
  });
  test("clearInvisibleValues: \"onComplete\" removes the value of a hidden question", () => {
    const survey = createSurvey({ elements: [
      { type: "text", name: "a" },
      { type: "checkbox", name: "c", choices: ["x"], visibleIf: "{a} != 'hide'" }
    ] }, true);
    survey.setValue("c", ["x"]);
    const c = <QuestionCheckboxModel>survey.getQuestionByName("c");
    c.clickItemHandler(c.choices[0], false);
    expect(survey.data, "#1: the respondent's clear is kept").toStrictEqual({ c: [] });
    survey.setValue("a", "hide");
    survey.doComplete();
    expect(survey.data, "#2: the hidden question's key goes at completion").toStrictEqual({ a: "hide" });
  });
  test("clearIncorrectValues drops an unknown choice", () => {
    const survey = createSurvey({ elements: [
      { type: "radiogroup", name: "r", choices: ["a"] },
      { type: "checkbox", name: "c", choices: ["a"] },
      { type: "dropdown", name: "d", choices: ["a"] }
    ] }, true);
    survey.data = { r: "unknown", c: ["unknown"], d: "unknown" };
    survey.clearIncorrectValues();
    expect(survey.data).toStrictEqual({});
  });
  test("survey.clear() empties the data", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q" }] }, true);
    blurText(survey.getQuestionByName("q"), "x");
    blurText(survey.getQuestionByName("q"), "");
    expect(survey.data, "#1").toStrictEqual({ q: "" });
    survey.clear();
    expect(survey.data, "#2").toStrictEqual({});
  });
  test("question.clearValue() and survey.clearValue() remove the key, also a kept empty value", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q" }, { type: "checkbox", name: "c", choices: ["a"] }] }, true);
    survey.setValue("q", "x");
    survey.setValue("c", ["a"]);
    survey.getQuestionByName("q").clearValue();
    survey.clearValue("c");
    expect(survey.data, "#1").toStrictEqual({});
    blurText(survey.getQuestionByName("q"), "x");
    blurText(survey.getQuestionByName("q"), "");
    expect(survey.data, "#2").toStrictEqual({ q: "" });
    survey.getQuestionByName("q").clearValue();
    expect(survey.data, "#3").toStrictEqual({});
  });
  test("removeRow and removePanel: the last row or panel goes with the key, not left as []", () => {
    const survey = createSurvey({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "col", cellType: "text" }] },
      { type: "paneldynamic", name: "p", panelCount: 1, templateElements: [{ type: "text", name: "t" }] }
    ] }, true);
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    m.visibleRows[0].cells[0].question.value = "a";
    p.panels[0].getQuestionByName("t").value = "b";
    expect(survey.data, "#1").toEqual({ m: [{ col: "a" }], p: [{ t: "b" }] });
    m.removeRow(0);
    p.removePanel(0);
    expect(survey.data, "#2").toStrictEqual({});
  });
  test("a row of a dynamic matrix is removed from the value, not left as {}", () => {
    const survey = createSurvey({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "col", cellType: "text" }] }
    ] }, true);
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.visibleRows[0].cells[0].question.value = "a";
    m.visibleRows[1].cells[0].question.value = "b";
    m.removeRow(0);
    expect(survey.data).toStrictEqual({ m: [{ col: "b" }] });
  });
  test("file removal by code: removeFile() and clear()", () => {
    const survey = createSurvey({ elements: [{ type: "file", name: "q", allowMultiple: true }] }, true);
    survey.onClearFiles.add((_, options) => { options.callback("success"); });
    const q = <QuestionFileModel>survey.getQuestionByName("q");
    survey.data = { q: [{ name: "f1", content: "data1" }] };
    q.removeFile("f1");
    expect(survey.data, "#1: removeFile").toStrictEqual({});
    survey.data = { q: [{ name: "f1", content: "data1" }, { name: "f2", content: "data2" }] };
    q.clear();
    expect(survey.data, "#2: clear").toStrictEqual({});
  });
  test("an expression question, defaultValueExpression and setValueExpression with an empty result", () => {
    const survey = createSurvey({ elements: [
      { type: "text", name: "a" },
      { type: "expression", name: "e", expression: "iif({a} = 1, '', {a})" },
      { type: "text", name: "d", defaultValueExpression: "iif({a} = 1, '', 'x')" },
      { type: "text", name: "s", setValueExpression: "iif({a} = 1, '', 'y')" }
    ] }, true);
    survey.setValue("a", 2);
    expect(survey.data, "#1").toEqual({ a: 2, e: 2, d: "x", s: "y" });
    survey.setValue("a", 1);
    expect(survey.data, "#2").toStrictEqual({ a: 1 });
  });
  test("a choicesByUrl reload that drops the value", () => {
    [{ status: 500, response: "" }, { status: 200, response: ["b"] }].forEach(reload => {
      offAndOn.forEach(isKeepOn => {
        const survey = createSurvey({ elements: [
          { type: "dropdown", name: "q", choicesByUrl: { url: "http://test/{v}" } },
          { type: "checkbox", name: "c", choicesByUrl: { url: "http://test/{v}" } }
        ] }, isKeepOn);
        survey.webProvider = { sendRequest: (_, callback) => {
          callback(survey.getVariable("v") === 1 ? { status: 200, response: ["a", "b"] } : reload);
        } };
        survey.setVariable("v", 1);
        survey.setValue("q", "a");
        survey.setValue("c", ["a"]);
        expect(survey.data, "#1").toEqual({ q: "a", c: ["a"] });
        survey.setVariable("v", 2);
        expect(survey.data, JSON.stringify(reload) + ", " + caseName(isKeepOn)).toStrictEqual({});
      });
    });
  });
  test("choicesVisibleIf and choicesFromQuestion drop a selected choice as with the key off", () => {
    offAndOn.forEach(isKeepOn => {
      const survey = createSurvey({ clearInvisibleValues: "onHidden", elements: [
        { type: "text", name: "a" },
        { type: "checkbox", name: "src", choices: ["x", "y"] },
        { type: "checkbox", name: "c", choices: ["x", "y"], choicesVisibleIf: "{a} != 'hide'" },
        { type: "radiogroup", name: "r", choicesFromQuestion: "src", choicesFromQuestionMode: "selected" }
      ] }, isKeepOn);
      survey.setValue("src", ["x"]);
      survey.setValue("c", ["x"]);
      survey.setValue("r", "x");
      survey.setValue("a", "hide");
      survey.setValue("src", ["y"]);
      survey.clearIncorrectValues();
      expect(survey.data, caseName(isKeepOn)).toStrictEqual({ a: "hide", src: ["y"] });
    });
  });
  test("a masked value the mask rejects on load", () => {
    const survey = createSurvey({ elements: [
      { type: "text", name: "q", maskType: "numeric", maskSettings: { saveMaskedValue: true, min: 0, max: 100 } }
    ] }, true);
    survey.data = { q: -5 };
    expect(survey.data).toStrictEqual({});
  });
  test("survey.data and setDataCore keep empty values, with the key on or off", () => {
    offAndOn.forEach(isKeepOn => {
      const survey = createSurvey({ elements: [{ type: "text", name: "q" }] }, isKeepOn);
      survey.data = { q: "", c: [], d: null, e: {} };
      expect(survey.data, caseName(isKeepOn)).toStrictEqual({ q: "", c: [], d: null, e: {} });
    });
  });
});
