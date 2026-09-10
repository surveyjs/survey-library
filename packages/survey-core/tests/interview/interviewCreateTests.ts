// @vitest-environment node
// The interview is a Node runtime: it renders nothing and it must not need a DOM. This file runs
// without jsdom, so a src/interview/ file that reached for document or window would fail here.
import { createInterview } from "survey-core/interview";
import { SurveyModel } from "survey-core";
import type { ISurveyWebRequest, ISurveyWebResponse } from "survey-core";

import { describe, expect, test } from "vitest";

function neverAnswers(): any {
  return { sendRequest: (): void => { /* the request is accepted and never answered */ } };
}

describe("createInterview takes the model the integrator owns (issue #11818)", () => {
  test("A plain object is survey JSON", async () => {
    const interview = await createInterview({});
    expect(interview.survey).toBeInstanceOf(SurveyModel);
    expect(interview.data).toEqual({});
  });

  test("A SurveyModel instance is used as is", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const interview = await createInterview(survey);
    expect(interview.survey).toBe(survey);
  });

  test("A subclass of SurveyModel is an instance too, and stays a subclass", async () => {
    class MySurvey extends SurveyModel {
      public readonly marker = "mine";
    }
    const survey = new MySurvey({ elements: [{ type: "text", name: "q1" }] });
    const interview = await createInterview(survey);
    expect(interview.survey).toBe(survey);
    expect(interview.survey).toBeInstanceOf(MySurvey);
    expect((<MySurvey>interview.survey).marker).toBe("mine");
  });

  test("Anything but a model or a JSON object is a TypeError", async () => {
    await expect(createInterview("{}")).rejects.toThrow(TypeError);
    await expect(createInterview(<any>["q1"])).rejects.toThrow(TypeError);
    await expect(createInterview(null)).rejects.toThrow(TypeError);
    await expect(createInterview(undefined)).rejects.toThrow(TypeError);
    await expect(createInterview(<any>42)).rejects.toThrow(TypeError);
    // The message names the two accepted forms, so the caller does not have to guess which it missed.
    await expect(createInterview("{}")).rejects.toThrow("SurveyModel instance or a survey JSON object");
  });

  test("A disposed model is a TypeError, not a broken interview", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.dispose();
    await expect(createInterview(survey)).rejects.toThrow(TypeError);
    await expect(createInterview(survey)).rejects.toThrow("disposed");
  });

  test("questionsOnPageMode becomes inputPerPage and nothing else on the model changes", async () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1", defaultValue: "a" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
      showPreviewBeforeComplete: "showAllQuestions",
      checkErrorsMode: "onValueChanged",
    });
    const before = {
      firstPageIsStartPage: survey.firstPageIsStartPage,
      showPreviewBeforeComplete: survey.showPreviewBeforeComplete,
      checkErrorsMode: survey.checkErrorsMode,
      locale: survey.locale,
      data: survey.data,
    };
    expect(survey.questionsOnPageMode).toBe("standard");
    const interview = await createInterview(survey);
    expect(interview.survey.questionsOnPageMode).toBe("inputPerPage");
    expect({
      firstPageIsStartPage: survey.firstPageIsStartPage,
      showPreviewBeforeComplete: survey.showPreviewBeforeComplete,
      checkErrorsMode: survey.checkErrorsMode,
      locale: survey.locale,
      data: survey.data,
    }).toEqual(before);
  });

  // Assigning the property re-runs onQuestionsOnPageModeChanged, which resets every single-input
  // state and makes the first root current. A model already in the mode has been navigated by its
  // owner, and the interview does not throw that away.
  test("The model is left on the input the interview will ask for", async () => {
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
    };
    const answered = new SurveyModel(json);
    answered.data = { q1: "a", q2: "b" };
    answered.questionsOnPageMode = "inputPerPage";
    answered.currentSingleQuestion = answered.getQuestionByName("q3");
    await createInterview(answered);
    expect(answered.currentSingleQuestion.name, "the first unanswered input, and where it already was").toBe("q3");

    // The interview selects and then tells the model, so a model navigated somewhere else is moved
    // to the input the interview is about to ask for - the two may never disagree.
    const empty = new SurveyModel(json);
    empty.questionsOnPageMode = "inputPerPage";
    empty.currentSingleQuestion = empty.getQuestionByName("q3");
    const interview = await createInterview(empty);
    expect(interview.current().name).toBe("q1");
    expect(empty.currentSingleQuestion.name).toBe("q1");
  });

  test("A model showing a start page is started", async () => {
    const survey = new SurveyModel({
      firstPageIsStartPage: true,
      pages: [
        { elements: [{ type: "html", name: "welcome", html: "Hello" }] },
        { elements: [{ type: "text", name: "q1" }] },
      ],
    });
    expect(survey.state).toBe("starting");
    const interview = await createInterview(survey);
    expect(interview.survey.state).toBe("running");
    expect(survey.firstPageIsStartPage, "the start page setting is the developer's").toBe(true);
  });

  test("A start page with an unanswered required question rejects and names it", async () => {
    const survey = new SurveyModel({
      firstPageIsStartPage: true,
      pages: [
        { elements: [{ type: "text", name: "consent", isRequired: true }] },
        { elements: [{ type: "text", name: "q1" }] },
      ],
    });
    let error: any = undefined;
    try {
      await createInterview(survey);
    } catch(e) {
      error = e;
    }
    expect(error, "the interview cannot ask a start-page question").toBeDefined();
    expect(error.code).toBe("startPageIncomplete");
    expect(error.names).toEqual(["consent"]);
    expect(error.message).toContain("consent");
    expect(survey.state, "the model is left where it was").toBe("starting");
  });

  test("The locale the owner set is the locale the interview reads, before and after", async () => {
    const survey = new SurveyModel({
      title: { default: "Health check", de: "Gesundheitscheck" },
      elements: [{ type: "text", name: "q1" }],
    });
    survey.locale = "de";
    const interview = await createInterview(survey);
    expect(survey.locale, "the interview never writes the locale").toBe("de");
    expect(interview.describe().indexOf("# Gesundheitscheck")).toBe(0);
    // Nothing is cached: a change the owner makes past the interview is seen on the next call.
    survey.locale = "en";
    expect(interview.describe().indexOf("# Health check")).toBe(0);
  });

  test("A variable the owner set decides what the interview can ask", async () => {
    const json = { elements: [{ type: "text", name: "premium", visibleIf: "{tier} = 'gold'" }] };
    const gold = new SurveyModel(json);
    gold.setVariable("tier", "gold");
    const goldInterview = await createInterview(gold);
    expect(goldInterview.survey.currentSingleQuestion.name).toBe("premium");

    const silver = new SurveyModel(json);
    silver.setVariable("tier", "silver");
    const silverInterview = await createInterview(silver);
    expect(silverInterview.survey.currentSingleQuestion).toBeFalsy();
  });

  // Resuming is the owner's decision and the interview starts from whatever state it receives.
  // Assigning "data" restores: conditions, expression questions and calculated values run, triggers
  // do not, and a default is not re-applied on top of the restored answers.
  test("Data assigned before the hand-over keeps the owner's restore semantics", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "greeting", defaultValueExpression: "'Hello ' + {q1}" },
        { type: "expression", name: "shout", expression: "{q1} + '!'" },
      ],
      calculatedValues: [{ name: "calc", expression: "{q1} + '?'", includeIntoResult: true }],
      triggers: [{ type: "complete", expression: "{q1} = 'done'" }],
    });
    survey.data = { q1: "done" };
    const interview = await createInterview(survey);
    expect(interview.survey.state, "assigning data does not fire triggers").toBe("running");
    expect(interview.data.shout, "expression questions did run").toBe("done!");
    expect(interview.data.calc, "calculated values did run").toBe("done?");
    expect(interview.data.greeting, "an assignment restores answers, it does not re-apply defaults").toBeUndefined();
  });

  // Filling the model through setValue is the other half of the same choice: there the triggers ran,
  // and the interview does not undo that either.
  test("A model filled through setValue before the hand-over arrives with its triggers fired", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "greeting", defaultValueExpression: "'Hello ' + {q1}" },
        { type: "text", name: "flag" },
      ],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "flag", setValue: "on" }],
    });
    survey.setValue("q1", "done");
    const interview = await createInterview(survey);
    expect(interview.data.greeting, "the defaultValueExpression was evaluated").toBe("Hello done");
    expect(interview.data.flag, "by the owner's setValue, not by the interview").toBe("on");
  });

  test("A model handed over completed resolves with nothing to ask", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.doComplete();
    expect(survey.state).toBe("completed");
    const interview = await createInterview(survey);
    expect(interview.survey.state).toBe("completed");
    expect(interview.current()).toBe(null);
  });

  test("The dateProvider of the owner pins the clock the expressions read", async () => {
    const survey = new SurveyModel();
    const pinned = new Date(2020, 4, 17).getTime();
    survey.dateProvider = { now: (): number => pinned };
    survey.fromJSON({
      elements: [{ type: "text", name: "startedOn", inputType: "date", defaultValueExpression: "today()" }],
    });
    const interview = await createInterview(survey);
    const value = new Date(interview.data.startedOn);
    expect(value.getFullYear()).toBe(2020);
    expect(value.getMonth()).toBe(4);
    expect(value.getDate()).toBe(17);
  });

  test("createInterview resolves only after the choices of the owner's webProvider arrived", async () => {
    const survey = new SurveyModel();
    survey.webProvider = {
      sendRequest: (request: ISurveyWebRequest, onResponse: (response: ISurveyWebResponse) => void): void => {
        expect(request.url).toBe("https://example.com/cities");
        setTimeout(() => onResponse({ status: 200, response: ["Berlin", "Paris", "Rome"] }), 20);
      },
    };
    survey.fromJSON({
      elements: [{ type: "dropdown", name: "city", choicesByUrl: { url: "https://example.com/cities" } }],
    });
    const interview = await createInterview(survey);
    const city: any = interview.survey.getQuestionByName("city");
    expect(city.visibleChoices.length).toBe(3);
  });

  test("timeout: 0 does not wait for a request that is never answered", async () => {
    const survey = new SurveyModel();
    survey.webProvider = neverAnswers();
    survey.fromJSON({
      elements: [{ type: "dropdown", name: "city", choicesByUrl: { url: "https://example.com/never" } }],
    });
    const start = Date.now();
    const interview = await createInterview(survey, { timeout: 0 });
    expect(Date.now() - start).toBeLessThan(1000);
    const city: any = interview.survey.getQuestionByName("city");
    expect(city.visibleChoices.length, "and it describes what the model has: nothing").toBe(0);
  });

  // Wall-clock time and a real timer, not fake ones: what is bounded is how long a handler may take,
  // and a fake clock would only prove that the polling loop calls setTimeout.
  test("A request that is never answered ends in a timeout that names the url", async () => {
    const survey = new SurveyModel();
    survey.webProvider = neverAnswers();
    survey.fromJSON({
      elements: [{ type: "dropdown", name: "city", choicesByUrl: { url: "https://example.com/never" } }],
    });
    const start = Date.now();
    let error: any = undefined;
    try {
      await createInterview(survey, { timeout: 50 });
    } catch(e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain("https://example.com/never");
    expect(error.message).toContain("city");
    expect(error.code).toBe("asyncTimeout");
    expect(Date.now() - start, "it stops at the budget, it does not hang").toBeLessThan(2000);
  });

  test("dispose drops the interview's state and leaves the model alone", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] });
    const interview = await createInterview(survey);
    interview.dispose();
    expect(survey.isDisposed).toBe(false);
    expect(survey.getAllQuestions().length).toBe(2);
    expect(survey.getQuestionByName("q1").name).toBe("q1");
    expect(interview.survey).toBe(survey);
  });
});
