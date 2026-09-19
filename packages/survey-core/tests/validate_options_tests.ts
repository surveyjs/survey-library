import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { FunctionFactory, registerFunction } from "../src/functionsfactory";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const asyncFuncName = "asyncFuncForValidateOptions";
let returnResults: Array<(res: any) => void> = [];

function registerAsyncFunc(): void {
  returnResults = [];
  registerFunction({
    name: asyncFuncName, isAsync: true, useCache: false,
    func: function (params: any): any {
      returnResults.push(this.returnResult);
      return false;
    }
  });
}
function createAsyncSurvey(questionCount: number, firstIsRequired: boolean = false): SurveyModel {
  const elements: Array<any> = [];
  for (let i = 1; i <= questionCount; i++) {
    const element: any = { type: "text", name: "q" + i };
    if (i === 1 && firstIsRequired) {
      element.isRequired = true;
    } else {
      element.validators = [{ type: "expression", expression: asyncFuncName + "({q" + i + "})" }];
    }
    elements.push(element);
  }
  const survey = new SurveyModel({ elements: elements });
  for (let i = 1; i <= questionCount; i++) {
    if (i === 1 && firstIsRequired) continue;
    survey.getQuestionByName("q" + i).value = i;
  }
  return survey;
}

describe("validate(options)", () => {
  test("The options form and the positional form give the same result and the same errors", () => {
    const createSurvey = (): SurveyModel => new SurveyModel({
      elements: [
        { type: "text", name: "q1", isRequired: true },
        { type: "panel", name: "p1", elements: [{ type: "text", name: "q2", isRequired: true }] }
      ]
    });
    const errorCounts = (survey: SurveyModel): Array<number> =>
      [survey.getQuestionByName("q1").errors.length, survey.getQuestionByName("q2").errors.length];
    [false, true].forEach(fireCallback => {
      const label = ": fireCallback = " + fireCallback;
      const positional = createSurvey();
      const options = createSurvey();
      expect(options.validate({ fireCallback: fireCallback }), "survey" + label)
        .toBe(positional.validate(fireCallback, false));
      expect(errorCounts(options), "survey errors" + label).toEqual(errorCounts(positional));

      const positionalPage = createSurvey();
      const optionsPage = createSurvey();
      expect(optionsPage.pages[0].validate({ fireCallback: fireCallback }), "page" + label)
        .toBe(positionalPage.pages[0].validate(fireCallback, false));
      expect(errorCounts(optionsPage), "page errors" + label).toEqual(errorCounts(positionalPage));

      const positionalPanel = createSurvey();
      const optionsPanel = createSurvey();
      expect((<PanelModel>optionsPanel.getPanelByName("p1")).validate({ fireCallback: fireCallback }), "panel" + label)
        .toBe((<PanelModel>positionalPanel.getPanelByName("p1")).validate(fireCallback, false));
      expect(errorCounts(optionsPanel), "panel errors" + label).toEqual(errorCounts(positionalPanel));

      const positionalQuestion = createSurvey();
      const optionsQuestion = createSurvey();
      expect(optionsQuestion.getQuestionByName("q1").validate({ fireCallback: fireCallback }), "question" + label)
        .toBe(positionalQuestion.getQuestionByName("q1").validate(fireCallback, false));
      expect(errorCounts(optionsQuestion), "question errors" + label).toEqual(errorCounts(positionalQuestion));
    });
  });
  test("focusFirstError works the same in both forms", () => {
    // The focus itself needs a rendered input, so the call on the model is what is observed here.
    const countFocusCalls = (validate: (survey: SurveyModel) => void): number => {
      const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", isRequired: true }] });
      const question: any = survey.getQuestionByName("q1");
      let count = 0;
      question.focus = (): void => { count++; };
      validate(survey);
      return count;
    };
    const positional = countFocusCalls(survey => survey.validate(true, true));
    expect(positional, "the positional form focuses the question").toBe(1);
    expect(countFocusCalls(survey => survey.validate({ fireCallback: true, focusFirstError: true })),
      "the options form focuses the question").toBe(positional);
    expect(countFocusCalls(survey => survey.validate({ fireCallback: true })),
      "nothing is focused without the option").toBe(0);
  });
  test("fireCallback is true by default in the options form", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", isRequired: true }] });
    expect(survey.validate({}), "validate").toBe(false);
    expect(survey.getQuestionByName("q1").errors.length, "the error is shown").toBe(1);
  });
  test("changeCurrentPage through ISurveyValidateOptions", () => {
    const createSurvey = (): SurveyModel => {
      const survey = new SurveyModel({
        pages: [
          { elements: [{ type: "text", name: "q1" }] },
          { elements: [{ type: "text", name: "q2", isRequired: true }] }
        ]
      });
      survey.focusFirstError = false;
      return survey;
    };
    const survey = createSurvey();
    expect(survey.validate({ fireCallback: true }), "validate").toBe(false);
    expect(survey.currentPageNo, "the page is not changed").toBe(0);
    const withChange = createSurvey();
    expect(withChange.validate({ fireCallback: true, changeCurrentPage: true }), "validate").toBe(false);
    expect(withChange.currentPageNo, "the page with the error becomes current").toBe(1);
  });
  test("A subclass that overrides the positional validate() is never called with an object", () => {
    const calls: Array<any> = [];
    class CustomQuestion extends QuestionTextModel {
      public validate(fireCallback: boolean = true, focusFirstError: boolean = false, isOnValueChanged: boolean = false,
        callbackResult?: (res: boolean, question: Question) => void, isOnValueChanging?: boolean): boolean {
        calls.push(fireCallback);
        return super.validate(fireCallback, focusFirstError, isOnValueChanged, callbackResult, isOnValueChanging);
      }
    }
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const page = survey.pages[0];
    const custom = new CustomQuestion("custom");
    page.addElement(custom);
    survey.checkErrorsMode = "onValueChanged";
    custom.isRequired = true;
    custom.value = "abc";
    survey.validate();
    survey.validate({ valueChecks: { unknownKeys: true } });
    survey.nextPage();
    survey.tryComplete();
    custom.value = "def";
    // isRequired fires validate() on the question when it has errors.
    custom.isRequired = false;
    custom.isRequired = true;
    survey.data = { custom: "" };
    custom.isRequired = false;
    expect(calls.length > 0, "the override is called by the library").toBe(true);
    calls.forEach(call => {
      expect(typeof call, "the library calls the positional form only").toBe("boolean");
    });
  });
});

describe("validate(options): onAsyncCompleted", () => {
  beforeEach(() => {
    registerAsyncFunc();
  });
  afterEach(() => {
    FunctionFactory.Instance.unregister(asyncFuncName);
  });
  test("Nothing pending: onAsyncCompleted is called synchronously, once", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", isRequired: true }] });
    const completed: Array<any> = [];
    let isReturned = false;
    const res = survey.validate({
      onAsyncCompleted: (isValid: boolean, question: Question) => {
        completed.push({ isValid: isValid, name: question?.name, isReturned: isReturned });
      }
    });
    isReturned = true;
    expect(res, "the result").toBe(false);
    expect(completed, "called once, before validate() returned")
      .toEqual([{ isValid: false, name: "q1", isReturned: false }]);
  });
  test("All async and all pass: onAsyncCompleted is called once, when the last validator answers", () => {
    const survey = createAsyncSurvey(2);
    const completed: Array<any> = [];
    const res = survey.validate({ onAsyncCompleted: (isValid: boolean) => { completed.push(isValid); } });
    expect(res, "the result is undefined while something is pending").toBeUndefined();
    expect(returnResults.length, "two validators are running").toBe(2);
    expect(completed, "nothing is completed yet").toEqual([]);
    returnResults[0](true);
    expect(completed, "one validator is still pending").toEqual([]);
    returnResults[1](true);
    expect(completed, "called once with true").toEqual([true]);
  });
  test("A synchronous failure next to a pending validator", () => {
    const survey = createAsyncSurvey(2, true);
    const completed: Array<any> = [];
    const res = survey.validate({ onAsyncCompleted: (isValid: boolean, question: Question) => { completed.push({ isValid: isValid, name: question?.name }); } });
    expect(res, "a failure is already known").toBe(false);
    expect(survey.getQuestionByName("q1").errors.length, "the sync error is set").toBe(1);
    expect(completed, "nothing is completed while a validator is pending").toEqual([]);
    returnResults[0](false);
    expect(completed, "called once with false").toEqual([{ isValid: false, name: "q1" }]);
    expect(survey.getQuestionByName("q2").errors.length, "the async error is set").toBe(1);
  });
  test("One async failure while another validator is still pending", () => {
    const survey = createAsyncSurvey(2);
    const completed: Array<any> = [];
    const res = survey.validate({ onAsyncCompleted: (isValid: boolean) => { completed.push(isValid); } });
    expect(res, "nothing has failed yet and something is pending").toBeUndefined();
    returnResults[0](false);
    expect(completed, "not called on the first failure").toEqual([]);
    returnResults[1](true);
    expect(completed, "called once with false").toEqual([false]);
  });
  test("onAsyncCompleted works on a page, a panel and a question", () => {
    const createSurvey = (): SurveyModel => {
      const survey = new SurveyModel({
        elements: [{
          type: "panel", name: "p1", elements: [
            { type: "text", name: "q1", validators: [{ type: "expression", expression: asyncFuncName + "({q1})" }] },
            { type: "text", name: "q2", validators: [{ type: "expression", expression: asyncFuncName + "({q2})" }] }
          ]
        }]
      });
      survey.getQuestionByName("q1").value = 1;
      survey.getQuestionByName("q2").value = 2;
      return survey;
    };
    const runOn = (getElement: (survey: SurveyModel) => any, expectedRunning: number): Array<any> => {
      returnResults = [];
      const survey = createSurvey();
      const completed: Array<any> = [];
      const res = getElement(survey).validate({ onAsyncCompleted: (isValid: boolean) => { completed.push(isValid); } });
      expect(res, "the result is undefined").toBeUndefined();
      expect(returnResults.length, "the running validators").toBe(expectedRunning);
      expect(completed, "nothing is completed yet").toEqual([]);
      returnResults.forEach(returnResult => returnResult(true));
      return completed;
    };
    expect(runOn(survey => survey.pages[0], 2), "page").toEqual([true]);
    expect(runOn(survey => survey.getPanelByName("p1"), 2), "panel").toEqual([true]);
    expect(runOn(survey => survey.getQuestionByName("q1"), 1), "question").toEqual([true]);
  });
  test("onAsyncCompleted forces fireCallback on the survey", () => {
    const survey = createAsyncSurvey(1, true);
    const completed: Array<any> = [];
    survey.validate({ fireCallback: false, onAsyncCompleted: (isValid: boolean) => { completed.push(isValid); } });
    expect(survey.getQuestionByName("q1").errors.length, "the error is shown").toBe(1);
    expect(completed, "called once").toEqual([false]);
  });
  test("The positional callbacks keep their fail-fast timing", () => {
    // The survey's onAsyncValidation receives hasErrors and fires on the first failure only.
    const survey = createAsyncSurvey(2, true);
    const callbackResults: Array<any> = [];
    const res = survey.validate(true, false, (hasErrors: boolean) => { callbackResults.push(hasErrors); });
    expect(res, "a failure is already known").toBe(false);
    expect(callbackResults, "fired on the synchronous failure").toEqual([true]);
    returnResults[0](false);
    expect(callbackResults, "not fired again when the pending validator answers").toEqual([true]);
    expect(survey.getQuestionByName("q2").errors.length, "the async error is set").toBe(1);

    // A question's callbackResult receives res and fires once as well.
    returnResults = [];
    const questionSurvey = createAsyncSurvey(1);
    const questionResults: Array<any> = [];
    const questionRes = questionSurvey.getQuestionByName("q1").validate(true, false, false,
      (result: boolean) => { questionResults.push(result); });
    expect(questionRes, "the question result is undefined").toBeUndefined();
    expect(questionResults, "not fired yet").toEqual([]);
    returnResults[0](false);
    expect(questionResults, "fired once with false").toEqual([false]);
  });
});
