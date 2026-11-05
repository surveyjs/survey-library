import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { FunctionFactory } from "../src/functionsfactory";
import { Base } from "../src/base";
import { PageModel } from "../src/page";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { ComponentCollection, QuestionCompositeModel } from "../src/question_custom";
import { QuestionCustomModel } from "../src/question_custom";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { QuestionTextModel } from "../src/question_text";
import { settings } from "../src/settings";

// A switch for user code that throws once when the test arms it.
function createThrowOnce(name: string): { arm: () => void, check: () => void } {
  let isArmed = false;
  return {
    arm: (): void => { isArmed = true; },
    check: (): void => {
      if (!isArmed) return;
      isArmed = false;
      throw new Error(name);
    }
  };
}
function registerThrowOnceFunction(name: string): { arm: () => void } {
  const throwOnce = createThrowOnce(name);
  FunctionFactory.Instance.register(name, (): boolean => {
    throwOnce.check();
    return true;
  });
  return throwOnce;
}
function throwOnPropertyChange(obj: Base, propertyName: string, errorText: string): { arm: () => void } {
  const throwOnce = createThrowOnce(errorText);
  obj.onPropertyChanged.add((_, options) => {
    if (options.name === propertyName) throwOnce.check();
  });
  return throwOnce;
}

describe("A throw from user code leaves the survey working", () => {
  test("a custom function that throws while conditions run: later value changes still run conditions", () => {
    const fn = registerThrowOnceFunction("throwOnceInVisibleIf");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'a'" },
        { type: "text", name: "q3", visibleIf: "throwOnceInVisibleIf({q1})" }
      ] });
      const q2 = survey.getQuestionByName("q2");
      expect(q2.isVisible, "#1").toBe(false);
      fn.arm();
      expect(() => survey.setValue("q1", "x"), "#2").toThrow("throwOnceInVisibleIf");
      survey.setValue("q1", "a");
      expect(q2.isVisible, "#3").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInVisibleIf");
    }
  });
  test("a custom function that throws while triggers run: later value changes still run triggers", () => {
    const fn = registerThrowOnceFunction("throwOnceInTrigger");
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
        triggers: [
          { type: "runexpression", expression: "{q1} notempty", runExpression: "throwOnceInTrigger({q1})" },
          { type: "setvalue", expression: "{q1} = 'a'", setToName: "q2", setValue: "done" }
        ]
      });
      fn.arm();
      expect(() => survey.setValue("q1", "x"), "#1").toThrow("throwOnceInTrigger");
      survey.setValue("q1", "a");
      expect(survey.getValue("q2"), "#2").toBe("done");
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInTrigger");
    }
  });
  test("a property handler that throws while a page randomizes its questions: the page still follows question visibility", () => {
    const survey = new SurveyModel({ pages: [{ name: "p1", elements: [
      { type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }
    ] }] });
    const page = <PageModel>survey.pages[0];
    const q2 = survey.getQuestionByName("q2");
    const handler = throwOnPropertyChange(page, "rows", "throwOnRows");
    handler.arm();
    expect(() => page.randomizeElements(true), "#1").toThrow("throwOnRows");
    const rowOfQ2 = page.rows.filter(row => row.elements.indexOf(q2) > -1)[0];
    expect(rowOfQ2.visible, "#2").toBe(true);
    q2.visible = false;
    expect(rowOfQ2.visible, "#3").toBe(false);
  });
  test("a property handler that throws while rating properties sync: later changes still sync rateMax", () => {
    const survey = new SurveyModel({ elements: [{ type: "rating", name: "q1", rateMin: 1, rateMax: 5 }] });
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    const handler = throwOnPropertyChange(q1, "rateMax", "throwOnRateMax");
    handler.arm();
    expect(() => { q1.rateCount = 3; }, "#1").toThrow("throwOnRateMax");
    q1.rateCount = 4;
    expect(q1.rateMax, "#2").toBe(4);
  });
  test("a value-changed handler that throws while carried-forward choices update: later changes still update them", () => {
    const survey = new SurveyModel({ elements: [
      { type: "checkbox", name: "q1", choices: ["a", "b", "c"] },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q2.value = ["c"];
    const throwOnce = createThrowOnce("throwOnQ2Change");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
    });
    throwOnce.arm();
    expect(() => { q1.choices = ["a", "b"]; }, "#1").toThrow("throwOnQ2Change");
    expect(q2.visibleChoices.map(item => item.value), "#2").toEqual(["a", "b"]);
    q1.choices = ["x"];
    expect(q2.visibleChoices.map(item => item.value), "#3").toEqual(["x"]);
  });
  test("a value-changed handler that throws while the other-item comment is set: later comments are still set", () => {
    const survey = new SurveyModel({ elements: [{ type: "radiogroup", name: "q1", choices: ["a"], showOtherItem: true }] });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.value = "other";
    const throwOnce = createThrowOnce("throwOnComment");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => { q1.otherValue = "x"; }, "#1").toThrow("throwOnComment");
    q1.otherValue = "y";
    expect(q1.otherValue, "#2").toBe("y");
    expect(survey.getComment("q1"), "#3").toBe("y");
  });
  test("a value-changed handler that throws while a composite question sets an inner value: later inner values still reach the survey", () => {
    ComponentCollection.Instance.add({ name: "throwingcomposite", elementsJSON: [{ type: "text", name: "a" }, { type: "text", name: "b" }] });
    const survey = new SurveyModel({ elements: [{ type: "throwingcomposite", name: "q1" }] });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const throwOnce = createThrowOnce("throwOnCompositeChange");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => { q1.contentPanel.getQuestionByName("a").value = 1; }, "#1").toThrow("throwOnCompositeChange");
    q1.contentPanel.getQuestionByName("b").value = 2;
    expect(survey.data, "#2").toEqual({ q1: { a: 1, b: 2 } });
  });
  test("a value-changed handler that throws while a default value applies: a later answer stays an answer", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", defaultValue: "d" }
    ] });
    const q2 = survey.getQuestionByName("q2");
    q2.clearValue();
    const throwOnce = createThrowOnce("throwOnDefaultValue");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
    });
    throwOnce.arm();
    expect(() => q2.updateValueWithDefaults(), "#1").toThrow("throwOnDefaultValue");
    q2.defaultValueExpression = "{q1}";
    q2.value = "typed";
    survey.setValue("q1", "b");
    expect(q2.value, "#2").toBe("typed");
  });
  test("a value-changed handler that throws while a setValueExpression writes: the expression keeps writing", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", setValueExpression: "{q1} + 'x'" }
    ] });
    const q2 = survey.getQuestionByName("q2");
    const throwOnce = createThrowOnce("throwOnSetValueExpression");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
    });
    throwOnce.arm();
    expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnSetValueExpression");
    survey.setValue("q1", "b");
    expect(q2.value, "#2").toBe("bx");
  });
  test("a value-changed handler that throws while a setValueExpression writes: a later answer has no reason", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", setValueExpression: "{q1} + 'x'" },
      { type: "text", name: "q3" }
    ] });
    const throwOnce = createThrowOnce("throwOnExpressionWrite");
    const reasons: Array<string> = [];
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
      if (options.name === "q3") reasons.push(options.reason);
    });
    throwOnce.arm();
    expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnExpressionWrite");
    survey.getQuestionByName("q3").value = "typed";
    expect(reasons, "#2").toEqual([undefined]);
  });
  test("a value-changed handler that throws while a resetValueIf clears a value: a later answer has no reason", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", resetValueIf: "{q1} = 'reset'" },
      { type: "text", name: "q3" }
    ] });
    survey.setValue("q2", "v");
    const throwOnce = createThrowOnce("throwOnResetValueIf");
    const reasons: Array<string> = [];
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
      if (options.name === "q3") reasons.push(options.reason);
    });
    throwOnce.arm();
    expect(() => survey.setValue("q1", "reset"), "#1").toThrow("throwOnResetValueIf");
    survey.getQuestionByName("q3").value = "typed";
    expect(reasons, "#2").toEqual([undefined]);
  });
  test("a value-changed handler that throws while a trigger sets a value: a later answer has no reason", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 'a'", setToName: "q2", setValue: "done" }]
    });
    const throwOnce = createThrowOnce("throwOnTriggerWrite");
    const reasons: Array<string> = [];
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
      if (options.name === "q3") reasons.push(options.reason);
    });
    throwOnce.arm();
    expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnTriggerWrite");
    survey.getQuestionByName("q3").value = "typed";
    expect(reasons, "#2").toEqual([undefined]);
  });
  test("a property handler that throws while survey data is set: the survey no longer reports setting data", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const q1 = survey.getQuestionByName("q1");
    const handler = throwOnPropertyChange(q1, "value", "throwOnSetData");
    handler.arm();
    expect(() => { survey.data = { q1: "a" }; }, "#1").toThrow("throwOnSetData");
    expect(survey.isSettingData(), "#2").toBe(false);
  });
  test("a property handler that throws while a value updates from the survey: the bound panel count still writes its value", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "count" },
      { type: "paneldynamic", name: "q1", bindings: { panelCount: "count" }, templateElements: [{ type: "text", name: "t" }] }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const handler = throwOnPropertyChange(q1, "value", "throwOnUpdateFromSurvey");
    handler.arm();
    expect(() => survey.setValue("q1", [{ t: 1 }, { t: 2 }]), "#1").toThrow("throwOnUpdateFromSurvey");
    q1.panelCount = 3;
    expect(survey.getValue("count"), "#2").toBe(3);
  });
  test("a value-changed handler that throws while a choice comment updates from the survey: later comment changes in a dynamic panel are reported", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1", templateElements: [{ type: "radiogroup", name: "r", choices: ["a"], showOtherItem: true }] }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const throwOnce = createThrowOnce("throwOnChoiceComment");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => survey.setValue("q1", [{ r: "unknownText" }]), "#1").toThrow("throwOnChoiceComment");
    const r = q1.panels[0].getQuestionByName("r");
    expect(r.comment, "#2").toBe("unknownText");
    let changes = 0;
    survey.onDynamicPanelValueChanged.add(() => { changes++; });
    r.comment = "c";
    expect(changes, "#3").toBe(1);
  });
  test("a property handler that throws while value bindings update: later value changes still run conditions", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "count" },
      { type: "paneldynamic", name: "q1", bindings: { panelCount: "count" }, templateElements: [{ type: "text", name: "t" }] },
      { type: "text", name: "q2" },
      { type: "text", name: "q3", visibleIf: "{q2} = 'a'" }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const handler = throwOnPropertyChange(q1, "panels", "throwOnBinding");
    handler.arm();
    expect(() => survey.setValue("count", 2), "#1").toThrow("throwOnBinding");
    survey.setValue("q2", "a");
    expect(survey.getQuestionByName("q3").isVisible, "#2").toBe(true);
  });
  test("a property handler that hides a question and throws while value bindings update: the questions are numbered again", () => {
    const survey = new SurveyModel({ showQuestionNumbers: "on", elements: [
      { type: "text", name: "count" },
      { type: "paneldynamic", name: "q1", bindings: { panelCount: "count" }, templateElements: [{ type: "text", name: "t" }] },
      { type: "text", name: "q2" },
      { type: "text", name: "q3" }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q3.no, "#1").toBe("4.");
    const throwOnce = createThrowOnce("throwOnBindingIndexes");
    q1.onPropertyChanged.add((_, options) => {
      if (options.name !== "panels") return;
      q2.visible = false;
      throwOnce.check();
    });
    throwOnce.arm();
    expect(() => survey.setValue("count", 2), "#2").toThrow("throwOnBindingIndexes");
    expect(q3.no, "#3").toBe("3.");
  });
  test("a custom function that throws while conditions run on a value change: a later data assignment runs every condition", () => {
    const fn = registerThrowOnceFunction("throwOnceOnValueChange");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{x} = 1" },
        { type: "text", name: "q3", visibleIf: "throwOnceOnValueChange({q1})" }
      ] });
      fn.arm();
      expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnceOnValueChange");
      survey.data = { x: 1 };
      expect(survey.getQuestionByName("q2").isVisible, "#2").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceOnValueChange");
    }
  });
  test("a page-changed handler that throws while the preview is cancelled: a later page change is not after the preview", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "text", name: "q1" }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] }
    ] });
    survey.currentPageNo = 1;
    survey.showPreview();
    const throwOnce = createThrowOnce("throwOnCancelPreview");
    const afterPreview: Array<boolean> = [];
    survey.onCurrentPageChanged.add((_, options) => {
      afterPreview.push(options.isAfterPreview);
      throwOnce.check();
    });
    throwOnce.arm();
    expect(() => survey.cancelPreview(), "#1").toThrow("throwOnCancelPreview");
    survey.currentPageNo = 0;
    expect(afterPreview, "#2").toEqual([true, false]);
  });
  test("a value-changed handler that throws while unused values are cleared on complete: piped titles still update", () => {
    const survey = new SurveyModel({
      title: "T {v}",
      clearInvisibleValues: "onComplete",
      elements: [{ type: "text", name: "q1", title: "Q {v}" }, { type: "text", name: "q2", visible: false }]
    });
    survey.onTextMarkdown.add((_, options) => { options.html = options.text; });
    survey.setValue("q2", "a");
    const q1 = survey.getQuestionByName("q1");
    expect(q1.locTitle.renderedHtml, "#1").toBe("Q {v}");
    const throwOnce = createThrowOnce("throwOnClearUnused");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => survey.doComplete(), "#2").toThrow("throwOnClearUnused");
    survey.setVariable("v", "x");
    expect(q1.locTitle.renderedHtml, "#3").toBe("Q x");
  });
  test("a custom function that throws while a panel runs its conditions: hiding all its questions still reports the panel hidden", () => {
    const fn = registerThrowOnceFunction("throwOnceInPanel");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "p1", elements: [
          { type: "text", name: "q2", visibleIf: "throwOnceInPanel({q1})" },
          { type: "text", name: "q3" }
        ] }
      ] });
      const hiddenPanels: Array<string> = [];
      survey.onPanelVisibleChanged.add((_, options) => {
        if (!options.visible) hiddenPanels.push(options.panel.name);
      });
      fn.arm();
      expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnceInPanel");
      survey.getQuestionByName("q2").visible = false;
      survey.getQuestionByName("q3").visible = false;
      expect(hiddenPanels, "#2").toEqual(["p1"]);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInPanel");
    }
  });
  test("a custom function that throws while a panel runs its conditions: the questions hidden before the throw still report the panel hidden", () => {
    const fn = registerThrowOnceFunction("throwOnceInPanelRun");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "p1", elements: [
          { type: "text", name: "q2", visibleIf: "{q1} != 'a'" },
          { type: "text", name: "q3", visibleIf: "throwOnceInPanelRun({q1}) = false" }
        ] }
      ] });
      const hiddenPanels: Array<string> = [];
      survey.onPanelVisibleChanged.add((_, options) => {
        if (!options.visible) hiddenPanels.push(options.panel.name);
      });
      fn.arm();
      expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnceInPanelRun");
      expect(hiddenPanels, "#2").toEqual(["p1"]);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInPanelRun");
    }
  });
  test("a css handler that throws while css classes are calculated: later calculations still call the handler", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const q1 = survey.getQuestionByName("q1");
    const throwOnce = createThrowOnce("throwOnCss");
    let calls = 0;
    survey.onUpdateQuestionCssClasses.add(() => {
      calls++;
      throwOnce.check();
    });
    throwOnce.arm();
    expect(() => q1.cssClasses, "#1").toThrow("throwOnCss");
    calls = 0;
    q1.updateElementCss();
    q1.cssClasses;
    expect(calls, "#2").toBe(1);
  });
  test("a value-changed handler that throws while a required answer changes: clearing it from the survey shows no required error", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanged", elements: [{ type: "text", name: "q1", isRequired: true }] });
    const q1 = survey.getQuestionByName("q1");
    q1.value = "a";
    const throwOnce = createThrowOnce("throwOnRequiredAnswer");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => { q1.value = "b"; }, "#1").toThrow("throwOnRequiredAnswer");
    survey.setValue("q1", "");
    expect(q1.errors.length, "#2").toBe(0);
  });
  test("a property handler that throws while a matrix row updates from the value: later row answers reach the value", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrix", name: "q1", rows: ["r1", "r2"], columns: ["c1", "c2"] }] });
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const rows = q1.visibleRows;
    const handler = throwOnPropertyChange(rows[0], "value", "throwOnMatrixRow");
    handler.arm();
    expect(() => survey.setValue("q1", { r1: "c2" }), "#1").toThrow("throwOnMatrixRow");
    rows[1].value = "c2";
    expect(q1.value, "#2").toEqual({ r1: "c2", r2: "c2" });
  });
  test("a string handler that throws while matrix cells load: later cell text changes are reported", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrix", name: "q1", rows: ["r1"], columns: ["c1"], cells: { r1: { c1: "t" } } }] });
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const throwOnce = createThrowOnce("throwOnCellText");
    q1.cells.getCellDisplayLocText("r1", "c1").onStringChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => q1.cells.setJson({ r1: { c1: "u" } }), "#1").toThrow("throwOnCellText");
    const names: Array<string> = [];
    q1.onPropertyChanged.add((_, options) => { names.push(options.name); });
    q1.cells.setCellText("r1", "c1", "w");
    expect(names, "#2").toEqual(["cells"]);
  });
  test("a string handler that throws while matrix cells merge: later cell text changes are reported", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrix", name: "q1", rows: ["r1"], columns: ["c1"], cells: { r1: { c1: "t" } } },
      { type: "matrix", name: "q2", rows: ["r1"], columns: ["c1"], cells: { r1: { c1: "u" } } }
    ] });
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const q2 = <QuestionMatrixModel>survey.getQuestionByName("q2");
    const throwOnce = createThrowOnce("throwOnCellMerge");
    q1.cells.getCellDisplayLocText("r1", "c1").onStringChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => q1.cells.mergeWith(q2.cells), "#1").toThrow("throwOnCellMerge");
    const names: Array<string> = [];
    q1.onPropertyChanged.add((_, options) => { names.push(options.name); });
    q1.cells.setCellText("r1", "c1", "w");
    expect(names, "#2").toEqual(["cells"]);
  });
  test("a value-changed handler that throws while a multiple text item changes: later values still reach the items", () => {
    const survey = new SurveyModel({ elements: [{ type: "multipletext", name: "q1", items: [{ name: "a" }, { name: "b" }] }] });
    const q1 = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    const throwOnce = createThrowOnce("throwOnMultipleText");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => { q1.items[0].value = "x"; }, "#1").toThrow("throwOnMultipleText");
    const itemValues: Array<any> = [];
    q1.items[1].valueChangedCallback = (newValue: any): void => { itemValues.push(newValue); };
    q1.value = { a: "z", b: "y" };
    expect(itemValues, "#2").toEqual(["y"]);
  });
  test("a value-changed handler that throws while a custom question sets its value: later inner changes in a dynamic panel are reported", () => {
    ComponentCollection.Instance.add({ name: "throwingcustom", questionJSON: { type: "text" } });
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1", panelCount: 1, templateElements: [{ type: "throwingcustom", name: "c" }] }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const c = <QuestionCustomModel>q1.panels[0].getQuestionByName("c");
    const throwOnce = createThrowOnce("throwOnCustomValue");
    survey.onValueChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => { c.value = "a"; }, "#1").toThrow("throwOnCustomValue");
    let changes = 0;
    survey.onDynamicPanelValueChanged.add(() => { changes++; });
    c.contentQuestion.value = "b";
    expect(changes, "#2").toBe(1);
  });
  test("a value-changed handler that throws while hidden choices are cleared: a later answer drops the hidden ones", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q0" },
      { type: "checkbox", name: "q1", choices: ["a", "b", "c"], choicesVisibleIf: "{item} != {q0}" }
    ] });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.value = ["a", "b"];
    const throwOnce = createThrowOnce("throwOnClearHidden");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q1") throwOnce.check();
    });
    throwOnce.arm();
    expect(() => survey.setValue("q0", "b"), "#1").toThrow("throwOnClearHidden");
    q1.value = ["c"];
    survey.setValue("q0", "x");
    expect(q1.value, "#2").toEqual(["c"]);
  });
  test("a property handler that throws while a page randomizes its questions: the page still allows animations", () => {
    const oldAnimationEnabled = settings.animationEnabled;
    settings.animationEnabled = true;
    try {
      const survey = new SurveyModel({ pages: [{ name: "p1", elements: [
        { type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }
      ] }] });
      const page = <PageModel>survey.pages[0];
      page.supportOnElementRerenderedEvent = false;
      expect(page.animationAllowed, "#1").toBe(true);
      const handler = throwOnPropertyChange(page, "rows", "throwOnAnimatedRows");
      handler.arm();
      expect(() => page.randomizeElements(true), "#2").toThrow("throwOnAnimatedRows");
      expect(page.animationAllowed, "#3").toBe(true);
    } finally {
      settings.animationEnabled = oldAnimationEnabled;
    }
  });
  test("a property handler that throws while an element is inserted next to another: rows still follow startWithNewLine", () => {
    const survey = new SurveyModel({ pages: [{ name: "p1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }] });
    const page = <PageModel>survey.pages[0];
    page.onFirstRendering();
    const q2 = survey.getQuestionByName("q2");
    const q3 = new QuestionTextModel("q3");
    const handler = throwOnPropertyChange(q3, "startWithNewLine", "throwOnInsert");
    handler.arm();
    expect(() => page.insertElement(q3, q2, "right"), "#1").toThrow("throwOnInsert");
    expect(page.rows.length, "#2").toBe(2);
    q2.startWithNewLine = false;
    expect(page.rows.length, "#3").toBe(1);
  });
  test("a property handler that throws while a matrix total updates its settings: the total still follows the cells", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q1", rowCount: 2,
      columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" }] }] });
    const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const total = q1.visibleTotalRow.cells[0].question;
    const handler = throwOnPropertyChange(total, "format", "throwOnTotalFormat");
    q1.columns[0].totalFormat = "Total: {0}";
    handler.arm();
    expect(() => { q1.visibleRows[0].cells[0].value = 3; }, "#1").toThrow("throwOnTotalFormat");
    q1.visibleRows[1].cells[0].value = 4;
    expect(total.value, "#2").toBe(7);
  });
});

describe("A throw from user code leaves the expressions running", () => {
  // Returns its first parameter, so the result follows the value the expression reads
  function registerThrowOnceEcho(name: string): { arm: () => void } {
    const throwOnce = createThrowOnce(name);
    FunctionFactory.Instance.register(name, (params: Array<any>): any => {
      throwOnce.check();
      return params[0];
    });
    return throwOnce;
  }
  test("a value-changed handler that throws while a defaultValueExpression applies: the expression still applies", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", defaultValueExpression: "{q1}" }
    ] });
    const throwOnce = createThrowOnce("throwOnDefaultValue");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q2") throwOnce.check();
    });
    throwOnce.arm();
    expect(() => survey.setValue("q1", "a"), "#1").toThrow("throwOnDefaultValue");
    survey.setValue("q1", "b");
    expect(survey.getValue("q2"), "#2").toBe("b");
  });
  test("a visibility handler that throws while a visibleIf applies: the visibleIf still runs", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", visibleIf: "{q1} = 1" }
    ] });
    const q2 = survey.getQuestionByName("q2");
    const throwOnce = createThrowOnce("throwOnVisibility");
    survey.onQuestionVisibleChanged.add(() => { throwOnce.check(); });
    throwOnce.arm();
    expect(() => survey.setValue("q1", 1), "#1").toThrow("throwOnVisibility");
    survey.setValue("q1", 2);
    expect(q2.isVisible, "#2").toBe(false);
  });
  test("a custom function that throws in a visibleIf: the visibleIf still runs", () => {
    const fn = registerThrowOnceEcho("throwOnceEchoInVisibleIf");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "throwOnceEchoInVisibleIf({q1}) = 1" }
      ] });
      const q2 = survey.getQuestionByName("q2");
      fn.arm();
      expect(() => survey.setValue("q1", 5), "#1").toThrow("throwOnceEchoInVisibleIf");
      survey.setValue("q1", 1);
      expect(q2.isVisible, "#2").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceEchoInVisibleIf");
    }
  });
  test("a custom function that throws in an expression question: the question still updates", () => {
    const fn = registerThrowOnceEcho("throwOnceEchoInExpression");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "expression", name: "q2", expression: "throwOnceEchoInExpression({q1})" }
      ] });
      const q2 = survey.getQuestionByName("q2");
      fn.arm();
      expect(() => survey.setValue("q1", 5), "#1").toThrow("throwOnceEchoInExpression");
      survey.setValue("q1", 7);
      expect(q2.value, "#2").toBe(7);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceEchoInExpression");
    }
  });
  test("a custom function that throws in a calculated value: the value still updates", () => {
    const fn = registerThrowOnceEcho("throwOnceEchoInCalculated");
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "q1" }],
        calculatedValues: [{ name: "calc", expression: "throwOnceEchoInCalculated({q1})" }]
      });
      fn.arm();
      expect(() => survey.setValue("q1", 5), "#1").toThrow("throwOnceEchoInCalculated");
      survey.setValue("q1", 7);
      expect(survey.getVariable("calc"), "#2").toBe(7);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceEchoInCalculated");
    }
  });
  test("a value-changed handler that throws while a calculated value writes: the value still updates", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "calc", expression: "{q1}", includeIntoResult: true }]
    });
    const throwOnce = createThrowOnce("throwOnCalculatedWrite");
    survey.onVariableChanged.add((_, options) => {
      if (options.name === "calc") throwOnce.check();
    });
    throwOnce.arm();
    expect(() => survey.setValue("q1", 5), "#1").toThrow("throwOnCalculatedWrite");
    survey.setValue("q1", 7);
    expect(survey.getVariable("calc"), "#2").toBe(7);
  });
  test("a handler that throws when an asynchronous expression completes: the question is ready and the expression still runs", () => {
    const results: Array<(val: any) => void> = [];
    FunctionFactory.Instance.register("asyncFuncThrowOnComplete", function (params: Array<any>): any {
      results.push(this.returnResult);
      return undefined;
    }, true);
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "asyncFuncThrowOnComplete({q1}) = 1" }
      ] });
      const q2 = survey.getQuestionByName("q2");
      const once = createThrowOnce("onQuestionVisibleChanged");
      survey.onQuestionVisibleChanged.add(() => once.check());
      results.splice(0).forEach(res => res(0));
      survey.setValue("q1", "a");
      once.arm();
      expect(() => results.pop()(1), "#1").toThrow("onQuestionVisibleChanged");
      expect(q2.isAsyncExpressionRunning, "#2").toBe(false);
      expect(q2.isReady, "#3").toBe(true);
      expect(survey.getRunningAsyncOperations().length, "#4").toBe(0);
      survey.setValue("q1", "b");
      results.pop()(0);
      expect(q2.isVisible, "#5").toBe(false);
    } finally {
      FunctionFactory.Instance.unregister("asyncFuncThrowOnComplete");
    }
  });
  test("an asynchronous function that throws when it starts: the question is ready and the expression still runs", () => {
    const throwOnce = createThrowOnce("asyncFuncThrowOnStart");
    FunctionFactory.Instance.register("asyncFuncThrowOnStart", function (params: Array<any>): any {
      throwOnce.check();
      this.returnResult(params[0]);
      return undefined;
    }, true);
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "asyncFuncThrowOnStart({q1}) = 1" }
      ] });
      const q2 = survey.getQuestionByName("q2");
      throwOnce.arm();
      expect(() => survey.setValue("q1", 5), "#1").toThrow("asyncFuncThrowOnStart");
      expect(q2.isAsyncExpressionRunning, "#2").toBe(false);
      expect(q2.isReady, "#3").toBe(true);
      survey.setValue("q1", 1);
      expect(q2.isVisible, "#4").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("asyncFuncThrowOnStart");
    }
  });
  test("a ready handler that throws when an asynchronous expression starts: the question is ready and the expression still runs", () => {
    const results: Array<(val: any) => void> = [];
    FunctionFactory.Instance.register("asyncFuncThrowOnReady", function (params: Array<any>): any {
      results.push(this.returnResult);
      return undefined;
    }, true);
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "asyncFuncThrowOnReady({q1}) = 1" }
      ] });
      const q2 = survey.getQuestionByName("q2");
      const once = createThrowOnce("onReadyChanged");
      q2.onReadyChanged.add(() => once.check());
      results.splice(0).forEach(res => res(0));
      once.arm();
      expect(() => survey.setValue("q1", "a"), "#1").toThrow("onReadyChanged");
      expect(q2.isAsyncExpressionRunning, "#2").toBe(false);
      expect(q2.isReady, "#3").toBe(true);
      expect(survey.getRunningAsyncOperations().length, "#4").toBe(0);
      survey.setValue("q1", "b");
      results.pop()(1);
      expect(q2.isVisible, "#5").toBe(true);
      expect(q2.isReady, "#6").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("asyncFuncThrowOnReady");
    }
  });
  test("a custom function that throws in an expression validator: the question is not left validating", () => {
    const fn = registerThrowOnceEcho("throwOnceEchoInValidator");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q1", validators: [{ type: "expression", expression: "throwOnceEchoInValidator({q1})" }] }
      ] });
      const q1 = survey.getQuestionByName("q1");
      survey.setValue("q1", 1);
      fn.arm();
      expect(() => q1.validate(), "#1").toThrow("throwOnceEchoInValidator");
      expect(q1.isRunningValidators, "#2").toBe(false);
      expect(survey.getRunningAsyncOperations().length, "#3").toBe(0);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceEchoInValidator");
    }
  });
});
