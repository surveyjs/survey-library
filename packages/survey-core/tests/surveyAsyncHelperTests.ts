import { SurveyModel } from "../src/survey";
import { DEFAULT_SURVEY_ASYNC_TIMEOUT, getSurveyAsyncTimeout, waitForSurveyOperations } from "../src/utils/survey-async";

import { afterEach, describe, expect, test, vi } from "vitest";

// src/utils/survey-async.ts is the one implementation of waiting for a survey's running operations,
// shared by the optional bundles that drive a model from outside. The tester's own tests pin how it
// reports the outcome; these pin the waiter's result for the cases a tester run cannot reach cheaply.

afterEach(() => {
  vi.restoreAllMocks();
});

const onePageSurvey = { elements: [{ type: "text", name: "q1" }] };

function createValidatingSurvey(completeAfter?: number): SurveyModel {
  const survey = new SurveyModel(onePageSurvey);
  survey.onServerValidateQuestions.add((_, options: any) => {
    if (completeAfter !== undefined) setTimeout(() => options.complete(), completeAfter);
  });
  survey.tryComplete();
  return survey;
}

describe("The shared async helper", () => {
  test("An idle model settles without a timer, Issue#11818", async () => {
    const survey = new SurveyModel(onePageSurvey);
    const spy = vi.spyOn(globalThis, "setTimeout");
    const res = await waitForSurveyOperations(survey, 30);
    expect(res).toEqual({ status: "settled" });
    expect(spy).not.toHaveBeenCalled();
  });
  test("A missing operation report means idle, Issue#11818", async () => {
    expect(await waitForSurveyOperations(undefined, 30)).toEqual({ status: "settled" });
    expect(await waitForSurveyOperations({}, 30)).toEqual({ status: "settled" });
    expect(await waitForSurveyOperations({ getRunningAsyncOperations: () => undefined }, 30)).toEqual({ status: "settled" });
  });
  test("A running operation is waited for until it lands, Issue#11818", async () => {
    const survey = createValidatingSurvey(5);
    expect(survey.getRunningAsyncOperations().length).toBe(1);
    const res = await waitForSurveyOperations(survey, 1000);
    expect(res).toEqual({ status: "settled" });
    expect(survey.getRunningAsyncOperations()).toEqual([]);
    expect(survey.state).toBe("completed");
  });
  test("An operation started by the one before it is waited for too, Issue#11818", async () => {
    const survey = new SurveyModel(onePageSurvey);
    survey.onServerValidateQuestions.add((_, options: any) => { setTimeout(() => options.complete(), 5); });
    survey.onCompleting.add((): Promise<void> => new Promise<void>(resolve => { setTimeout(resolve, 5); }));
    survey.tryComplete();
    const res = await waitForSurveyOperations(survey, 1000);
    expect(res).toEqual({ status: "settled" });
    expect(survey.state).toBe("completed");
  });
  test("A timeout returns what is still running and the budget, Issue#11818", async () => {
    const survey = createValidatingSurvey();
    const res = await waitForSurveyOperations(survey, 20);
    expect(res.status).toBe("timedOut");
    expect(res.busy).toEqual({ reason: "serverValidation" });
    expect(res.timeout).toBe(20);
  });
  test("A budget of zero or less does not wait, Issue#11818", async () => {
    const survey = createValidatingSurvey();
    expect(await waitForSurveyOperations(survey, 0)).toEqual({ status: "notWaited", busy: { reason: "serverValidation" } });
    expect(await waitForSurveyOperations(survey, -5)).toEqual({ status: "notWaited", busy: { reason: "serverValidation" } });
  });
  test("A budget that is not a finite number is the default, Issue#11818", () => {
    expect(DEFAULT_SURVEY_ASYNC_TIMEOUT).toBe(5000);
    expect(getSurveyAsyncTimeout(undefined)).toBe(5000);
    expect(getSurveyAsyncTimeout("30")).toBe(5000);
    expect(getSurveyAsyncTimeout(NaN)).toBe(5000);
    expect(getSurveyAsyncTimeout(Infinity)).toBe(5000);
    expect(getSurveyAsyncTimeout(-Infinity)).toBe(5000);
    expect(getSurveyAsyncTimeout(30)).toBe(30);
    expect(getSurveyAsyncTimeout(0)).toBe(0);
    expect(getSurveyAsyncTimeout(-1)).toBe(-1);
  });
  test("A canceled wait is aborted, not timed out, even when the budget has run out, Issue#11818", async () => {
    const survey = createValidatingSurvey();
    // The first check of the cancellation outlasts the budget, so both hold at once.
    const isCanceled = (): boolean => {
      const start = Date.now();
      while(Date.now() - start < 3) { /* spin past the budget */ }
      return true;
    };
    const res = await waitForSurveyOperations(survey, 1, isCanceled);
    expect(res).toEqual({ status: "aborted", busy: { reason: "serverValidation" } });
    // Stopping the wait does not stop the survey's operation.
    expect(survey.getRunningAsyncOperations().map(operation => operation.type)).toEqual(["serverValidation"]);
  });
});
