// @vitest-environment node
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import { SurveyModel } from "survey-core";

import { describe, expect, test } from "vitest";

const twoQuestions = {
  title: "Two",
  elements: [
    { type: "text", name: "q1", title: "First", isRequired: true },
    { type: "text", name: "q2", title: "Second" },
  ],
};

describe("interview completion (issue #11818)", () => {
  test("An unanswered required input blocks the completion and is named", async () => {
    const iv = await createInterview(twoQuestions);
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].name).toBe("q1");
    expect(res.errors[0].code, "it is the model's error, not one the interview invented").toBeUndefined();
    expect(res.completedHtml).toBe("");
    expect(iv.survey.state).toBe("running");
    // The transcript still renders: a consumer wants the final progress and answers either way.
    expect(iv.describe()).toContain("remainingRequired: 1");
  });

  test("A survey with every required input answered completes", async () => {
    const iv = await createInterview(twoQuestions);
    await iv.answer("a");
    const res = await iv.complete();
    expect(res.completed).toBe(true);
    expect(res.errors).toEqual([]);
    expect(res.data).toEqual({ q1: "a" });
    expect(res.completedHtml).toContain("Thank you");
    expect(iv.survey.state).toBe("completed");
  });

  test("An invalid answer blocks the completion with the model's own error text", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "age", inputType: "number", min: 0, max: 40 }],
    });
    await iv.answer(55);
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors).toEqual([{ name: "age", message: "The value should not be greater than 40" }]);
  });

  test("An unsupported input is ignored by the completion", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1" }, { type: "file", name: "photo" }],
    });
    await iv.answer("a");
    expect(iv.current()).toBe(null);
    const res = await iv.complete();
    expect(res.completed).toBe(true);
    expect(res.errors).toEqual([]);
  });

  test("The host's onComplete fires once and the completed html is the model's", async () => {
    const survey = new SurveyModel({ ...twoQuestions, completedHtml: "<h3>All done, {q1}</h3>" });
    let completes = 0;
    survey.onComplete.add(() => { completes++; });
    const iv = await createInterview(survey);
    await iv.answer("Ann");
    const res = await iv.complete();
    expect(res.completed).toBe(true);
    expect(completes).toBe(1);
    expect(res.completedHtml).toBe("<h3>All done, Ann</h3>");
  });

  test("onCompleting that refuses is reported as completionBlocked", async () => {
    const survey = new SurveyModel(twoQuestions);
    survey.onCompleting.add((sender, options) => { options.allow = false; });
    const iv = await createInterview(survey);
    await iv.answer("a");
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.completionBlocked);
    expect(res.errors[0].name).toBe("");
    expect(res.completedHtml).toBe("");
    expect(iv.survey.state).toBe("running");
  });

  // tryComplete(), not doComplete(): server validation lives only on the tryComplete path, and a
  // survey whose host validates on a server must not be completed behind its back.
  test("onServerValidateQuestions is called once, with the full data, and awaited", async () => {
    const survey = new SurveyModel(twoQuestions);
    const seen: Array<any> = [];
    survey.onServerValidateQuestions.add((sender, options) => {
      seen.push(options.data);
      setTimeout(() => options.complete(), 10);
    });
    const iv = await createInterview(survey);
    await iv.answer("a");
    await iv.answer("b");
    const res = await iv.complete();
    expect(seen.length).toBe(1);
    expect(seen[0]).toEqual({ q1: "a", q2: "b" });
    expect(res.completed).toBe(true);
    expect(iv.survey.state).toBe("completed");
  });

  test("An error the server adds blocks the completion under the question's address", async () => {
    const survey = new SurveyModel(twoQuestions);
    survey.onServerValidateQuestions.add((sender, options) => {
      setTimeout(() => {
        options.errors["q1"] = "This name is already taken";
        options.complete();
      }, 10);
    });
    const iv = await createInterview(survey);
    await iv.answer("a");
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors).toEqual([{ name: "q1", message: "This name is already taken" }]);
    expect(iv.survey.state).toBe("running");
    expect(res.completedHtml).toBe("");
  });

  test("The completion works from a revisit, where the model is no longer at the last input", async () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    let calls = 0;
    survey.onServerValidateQuestions.add((sender, options) => { calls++; options.complete(); });
    const iv = await createInterview(survey);
    await iv.answer("a");
    await iv.answer("b");
    // A revisit that changes nothing: the model's current input stays on q1, and the interview has to
    // move it to the end before the model agrees to complete.
    await iv.answer("q1", "a");
    expect(iv.current()).toBe(null);
    const res = await iv.complete();
    expect(calls).toBe(1);
    expect(res.completed).toBe(true);
  });

  test("Nothing can be answered or skipped after the completion, and describe() still renders", async () => {
    const iv = await createInterview(twoQuestions);
    await iv.answer("a");
    await iv.answer("b");
    expect((await iv.complete()).completed).toBe(true);

    expect(iv.current()).toBe(null);
    const answered = await iv.answer("q1", "c");
    expect(answered.errors.length).toBe(1);
    expect(answered.errors[0].code).toBe(InterviewErrorCodes.surveyCompleted);
    expect((await iv.skip()).errors[0].code).toBe(InterviewErrorCodes.surveyCompleted);
    expect(iv.data).toEqual({ q1: "a", q2: "b" });

    const text = iv.describe();
    expect(text).toContain("# Two");
    expect(text).toContain(lines("answered:", "  q1: a", "  q2: b").trim());
    expect(text).toContain("current: null");
  });

  test("Completing a completed survey is a no-op with the same answer", async () => {
    const iv = await createInterview(twoQuestions);
    await iv.answer("a");
    expect((await iv.complete()).completed).toBe(true);
    const again = await iv.complete();
    expect(again.completed).toBe(true);
    expect(again.errors).toEqual([]);
    expect(again.data).toEqual({ q1: "a" });
  });

  test("A model handed over already completed is accepted and asks nothing", async () => {
    const survey = new SurveyModel(twoQuestions);
    survey.setValue("q1", "a");
    survey.doComplete();
    const iv = await createInterview(survey);
    expect(iv.current()).toBe(null);
    expect((await iv.answer("q1", "b")).errors[0].code).toBe(InterviewErrorCodes.surveyCompleted);
  });
});

function lines(...text: Array<string>): string {
  return text.join("\n") + "\n";
}
