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

const PANEL_REQUIRED_ERROR = "Response required: answer at least one question.";

describe("interview completion validates panels (Issue#11818)", () => {
  test("A required static panel with every field skipped blocks the completion under the panel's name (B1)", async () => {
    const json = { elements: [{ type: "panel", name: "contact", isRequired: true,
      elements: [{ type: "text", name: "phone" }, { type: "text", name: "email" }] }] };
    expect(new SurveyModel(json).tryComplete(), "the model itself refuses").toBe(false);
    const iv = await createInterview(json);
    await iv.skip();
    await iv.skip();
    const res = await iv.complete();
    expect(res.completed, "the interview refuses what the model refuses").toBe(false);
    expect(res.errors).toEqual([{ name: "contact", message: PANEL_REQUIRED_ERROR }]);
    expect(iv.survey.state).toBe("running");
    // Answering a field of the panel is what the model needs, and it clears the panel's error.
    await iv.answer("email", "a@b.c");
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ email: "a@b.c" });
  });

  test("A required panel nested in another panel is reported under its own name", async () => {
    const json = { elements: [{ type: "panel", name: "outer",
      elements: [{ type: "text", name: "name" }, { type: "panel", name: "inner", isRequired: true,
        elements: [{ type: "text", name: "phone" }, { type: "text", name: "email" }] }] }] };
    expect(new SurveyModel(json).tryComplete(), "the model itself refuses").toBe(false);
    const iv = await createInterview(json);
    await iv.answer("Ann");
    await iv.skip();
    await iv.skip();
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors).toEqual([{ name: "inner", message: PANEL_REQUIRED_ERROR }]);
  });

  test("An onValidatePanel error blocks the completion under the panel's name", async () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "range",
      elements: [{ type: "text", name: "from", inputType: "number" }, { type: "text", name: "to", inputType: "number" }] }] });
    const validated: Array<string> = [];
    survey.onValidatePanel.add((sender, options) => {
      validated.push(options.name);
      if (options.panel.getQuestionByName("from").value > options.panel.getQuestionByName("to").value) {
        options.error = "\"from\" must not be greater than \"to\"";
      }
    });
    const iv = await createInterview(survey);
    await iv.answer(5);
    await iv.answer(2);
    validated.length = 0;
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors).toEqual([{ name: "range", message: "\"from\" must not be greater than \"to\"" }]);
    expect(validated, "the handler runs once per panel").toEqual(["range"]);
    await iv.answer("to", 9);
    expect((await iv.complete()).completed).toBe(true);
  });

  test("A required panel inside a dynamic panel's template is reported under the entry's address", async () => {
    const json = { elements: [{ type: "paneldynamic", name: "people", panelCount: 1,
      templateElements: [{ type: "text", name: "name" }, { type: "panel", name: "contact", isRequired: true,
        elements: [{ type: "text", name: "phone" }, { type: "text", name: "email" }] }] }] };
    expect(new SurveyModel(json).tryComplete(), "the model itself refuses").toBe(false);
    const iv = await createInterview(json);
    await iv.answer("Ann");
    await iv.skip();
    await iv.skip();
    expect(iv.current().name).toBe("people");
    await iv.answer({ action: "done" });
    const res = await iv.complete();
    expect(res.completed).toBe(false);
    expect(res.errors).toEqual([{ name: "people[0].contact", message: PANEL_REQUIRED_ERROR }]);
    await iv.answer("people[0].phone", "123");
    expect((await iv.complete()).completed).toBe(true);
  });

  test("A required panel the survey hides does not block the completion", async () => {
    const iv = await createInterview({ elements: [
      { type: "boolean", name: "show" },
      { type: "panel", name: "contact", isRequired: true, visibleIf: "{show} = true",
        elements: [{ type: "text", name: "phone" }] }] });
    await iv.answer(false);
    expect((await iv.complete()).completed).toBe(true);
  });
});

function lines(...text: Array<string>): string {
  return text.join("\n") + "\n";
}
