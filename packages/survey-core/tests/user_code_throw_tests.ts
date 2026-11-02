import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { FunctionFactory } from "../src/functionsfactory";
import { Base } from "../src/base";
import { PageModel } from "../src/page";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { ComponentCollection, QuestionCompositeModel } from "../src/question_custom";

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
