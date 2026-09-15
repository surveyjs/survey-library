// @vitest-environment node
// Single-input mode runs in Node like the rest of the module: nothing here needs a DOM.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview } from "survey-core/interview";
import { FunctionFactory, SurveyModel, surveyLocalization } from "survey-core";
import type { ISurveyWebRequest, ISurveyWebResponse } from "survey-core";

import { afterEach, describe, expect, test } from "vitest";

// The survey of the issue's example, and the one every transcript test walks. petAge declares its
// bounds as properties, so an out-of-range answer produces the model's own "maxError" text - the
// string the issue prints under the input.
const petJson = {
  title: "Pet survey",
  // The issue's transcript expects the answer of a question a condition hides to be gone; the model
  // keeps it until completion unless the survey says otherwise, so the survey says so.
  clearInvisibleValues: "onHidden",
  elements: [
    { type: "radiogroup", name: "hasPet", title: "Do you have a pet?", isRequired: true, choices: ["Yes", "No"] },
    { type: "dropdown", name: "petType", title: "What kind?", isRequired: true, visibleIf: "{hasPet} = 'Yes'",
      choices: ["Dog", "Cat", "Other"] },
    { type: "text", name: "petAge", title: "Pet age (years)", inputType: "number", min: 0, max: 40,
      visibleIf: "{hasPet} = 'Yes'" },
  ],
};

const MAX_AGE_ERROR = "The value should not be greater than 40";

function lines(...text: Array<string>): string {
  return text.join("\n") + "\n";
}

const petStartText = lines(
  "# Pet survey",
  "",
  "```yaml",
  "progress:",
  "  answered: 0",
  "  remainingRequired: 1",
  "current:",
  "  name: hasPet",
  "  type: radiogroup",
  "  title: Do you have a pet?",
  "  required: true",
  "  choices:",
  "    - value: \"Yes\"",
  "    - value: \"No\"",
  "```"
);

const petAfterYesText = lines(
  "# Pet survey",
  "",
  "```yaml",
  "progress:",
  "  answered: 1",
  "  remainingRequired: 1",
  "answered:",
  "  hasPet: \"Yes\"",
  "changes:",
  "  becameVisible: [petType, petAge]",
  "  becameRequired: [petType]",
  "current:",
  "  name: petType",
  "  type: dropdown",
  "  title: What kind?",
  "  required: true",
  "  choices:",
  "    - value: Dog",
  "    - value: Cat",
  "    - value: Other",
  "```"
);

// The interview selects its own next input and then tells the model, so the two may never disagree:
// a UI rendering the same model shows the input the interview is asking for.
function expectModelAgrees(interview: IInterview): void {
  const current = interview.current();
  const model = interview.survey.currentSingleQuestion;
  if (!current) return;
  expect(model, "the model has a current input").toBeTruthy();
  const root = interview.survey.getQuestionByName(current.name) || model;
  expect(model.name).toBe(root.name);
}

// The sequence the mode itself walks, on a second model with the same JSON and the same data. It is
// the reference the inventory's roots are pinned against: the interview may not invent an order.
function walkRoots(json: any, data?: any): Array<string> {
  const survey = new SurveyModel(json);
  if (!!data) survey.data = data;
  survey.questionsOnPageMode = "inputPerPage";
  const res: Array<string> = [];
  for (let guard = 0; guard < 50; guard++) {
    const question = survey.currentSingleQuestion;
    if (!question) break;
    res.push(question.name);
    survey.performNext();
    // performNext() answers "did the navigation attempt run", not "did it move": at the last input it
    // still returns true. The walk ends where the current input stops changing.
    if (survey.currentSingleQuestion === question) break;
  }
  return res;
}

const registeredFunctions: Array<string> = [];
function registerAsync(name: string, func: any): void {
  FunctionFactory.Instance.register(name, func, true);
  registeredFunctions.push(name);
}

afterEach(() => {
  while(registeredFunctions.length > 0) {
    FunctionFactory.Instance.unregister(registeredFunctions.pop());
  }
});

describe("interview single-input mode (issue #11818)", () => {
  test("The issue's transcript, end to end", async () => {
    const iv = await createInterview(petJson);
    expect(iv.describe()).toBe(petStartText);
    expect(iv.current().name).toBe("hasPet");
    expectModelAgrees(iv);

    const yes = await iv.answer("Yes");
    expect(yes.errors).toEqual([]);
    expect(yes.becameVisible).toEqual(["petType", "petAge"]);
    expect(yes.becameHidden).toEqual([]);
    expect(yes.becameRequired).toEqual(["petType"]);
    expect(yes.current.name).toBe("petType");
    expect(yes.describe).toBe(petAfterYesText);
    expectModelAgrees(iv);

    const dog = await iv.answer("petType", "Dog");
    expect(dog.errors).toEqual([]);
    expect(dog.current.name).toBe("petAge");
    expectModelAgrees(iv);

    const tooOld = await iv.answer(55);
    expect(tooOld.errors).toEqual([{ name: "petAge", message: MAX_AGE_ERROR }]);
    expect(tooOld.current.name).toBe("petAge");
    expect(tooOld.current.error).toBe(MAX_AGE_ERROR);
    expect(tooOld.describe).toContain("  error: " + MAX_AGE_ERROR);
    // The value stays on the input, as it stays in the box of a rendered UI with the error under it,
    // and the answered map reports what the inputs hold. Keeping an out-of-range number off
    // survey.data until it is inside the bounds is the model's business, not the interview's.
    expect(iv.survey.getQuestionByName("petAge").value).toBe(55);
    expect(tooOld.describe).toContain("petAge: 55");
    expectModelAgrees(iv);

    const four = await iv.answer(4);
    expect(four.errors).toEqual([]);
    expect(four.current).toBe(null);
    expect(iv.current()).toBe(null);
    expect(four.describe).toContain("current: null");

    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "Yes", petType: "Dog", petAge: 4 });
  });

  test("The roots the interview enumerates are the sequence the mode walks", async () => {
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
    };
    const iv = await createInterview(json);
    await iv.answer("a");
    await iv.answer("b");
    await iv.answer("c");
    expect(walkRoots(json, iv.data)).toEqual(["q1", "q2", "q3"]);
    // Every answer is still in the map, in item order, after the walk.
    expect(iv.describe()).toContain(lines("answered:", "  q1: a", "  q2: b", "  q3: c").trim());
  });

  test("The inventory is not the mode's navigation list", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    await iv.answer("one");
    await iv.answer("two");
    const second = iv.survey.getQuestionByName("q2");
    iv.survey.currentSingleQuestion = second;
    // The mode has nothing left to walk into inside a plain question - and the interview's record of
    // what exists does not shrink with it.
    expect(second.singleInputBehavior.getSingleInputQuestions()).toEqual([]);
    expect(iv.describe()).toContain(lines("answered:", "  q1: one", "  q2: two").trim());
    expect(iv.data).toEqual({ q1: "one", q2: "two" });
  });

  test("An answer that hides two inputs reports both, and their values are gone", async () => {
    const iv = await createInterview(petJson);
    await iv.answer("Yes");
    await iv.answer("petType", "Dog");
    await iv.answer(4);
    const no = await iv.answer("hasPet", "No");
    expect(no.becameHidden).toEqual(["petType", "petAge"]);
    expect(no.becameVisible).toEqual([]);
    expect(no.describe, "what is not asked is not reported").toContain(lines("answered:", "  hasPet: \"No\"").trim());
    expect(no.describe).toContain("current: null");
    expect(iv.data).toEqual({ hasPet: "No" });
    expect(iv.current()).toBe(null);
  });

  test("Answering by name is a revisit, and the model's current moves back with it", async () => {
    const iv = await createInterview(petJson);
    await iv.answer("Yes");
    await iv.answer("petType", "Dog");
    await iv.answer(4);
    expect(iv.current()).toBe(null);
    await iv.answer("hasPet", "No");
    // The two answers went away with the questions, so saying "Yes" again asks for them again.
    const again = await iv.answer("hasPet", "Yes");
    expect(again.current.name).toBe("petType");
    expect(iv.survey.currentSingleQuestion.name).toBe("petType");
  });

  test("An unknown name and a name that cannot be answered are coded errors", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "ro", readOnly: true },
        { type: "text", name: "off", enableIf: "{q1} = 'open'" },
        { type: "file", name: "photo" },
      ],
    });
    const unknown = await iv.answer("nope", "x");
    expect(unknown.errors.length).toBe(1);
    expect(unknown.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(unknown.errors[0].name).toBe("nope");
    // A read-only question is not an item at all, so it is unknown, not "not askable".
    expect((await iv.answer("ro", "x")).errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    const disabled = await iv.answer("off", "x");
    expect(disabled.errors[0].code).toBe(InterviewErrorCodes.notAskable);
    expect(disabled.errors[0].message).toContain("enableIf");
    const file = await iv.answer("photo", "x");
    expect(file.errors[0].code).toBe(InterviewErrorCodes.notAskable);
    expect(iv.data).toEqual({});
    // Neither of them is ever the current input.
    expect(iv.current().name).toBe("q1");
    await iv.answer("open");
    expect(iv.current().name, "the enableIf turned it on, so now it is asked").toBe("off");
  });

  test("There is nothing to answer once every input is answered and valid", async () => {
    const iv = await createInterview({ elements: [{ type: "text", name: "q1" }] });
    await iv.answer("a");
    const res = await iv.answer("b");
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.nothingToAnswer);
    expect(res.errors[0].name).toBe("");
    expect(iv.data).toEqual({ q1: "a" });
  });

  test("An asynchronous validator is awaited, reported, and never restarted by a read", async () => {
    let calls = 0;
    registerAsync("slowCheck", function(params: any): any {
      calls++;
      const returnResult = this.returnResult;
      setTimeout(() => returnResult(params[0] !== "bad"), 10);
    });
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1", validators: [{ type: "expression", expression: "slowCheck({q1}) = true",
          text: "The server said no" }] },
        { type: "text", name: "q2" },
      ],
    });
    const bad = await iv.answer("bad");
    expect(calls).toBe(1);
    expect(bad.errors).toEqual([{ name: "q1", message: "The server said no" }]);
    expect(bad.current.name).toBe("q1");
    // A scan of the items reads the persisted state; it never runs a validator again.
    for (let i = 0; i < 5; i++) {
      expect(iv.current().name).toBe("q1");
      iv.describe();
    }
    expect(calls).toBe(1);
    // The model re-validates an input that already holds errors as soon as its value changes, and
    // the interview validates the input it wrote: a write to an invalid input runs them twice.
    const good = await iv.answer("good");
    expect(calls).toBeGreaterThan(1);
    expect(good.errors).toEqual([]);
    expect(good.current.name).toBe("q2");
  });

  test("A value that already violates an asynchronous validator is current right after creation", async () => {
    registerAsync("slowCheck2", function(params: any): any {
      const returnResult = this.returnResult;
      setTimeout(() => returnResult(params[0] !== "bad"), 10);
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", validators: [{ type: "expression", expression: "slowCheck2({q1}) = true",
          text: "The server said no" }] },
        { type: "text", name: "q2" },
      ],
    });
    survey.data = { q1: "bad", q2: "fine" };
    const iv = await createInterview(survey);
    expect(iv.current().name).toBe("q1");
    expect(iv.current().error).toBe("The server said no");
    expect(iv.survey.currentSingleQuestion.name).toBe("q1");
  });

  test("An answer that fixes what another input depended on clears its error", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "a", inputType: "number" },
        { type: "text", name: "b", inputType: "number",
          validators: [{ type: "expression", expression: "{b} > {a}", text: "b must be greater than a" }] },
        { type: "text", name: "c" },
      ],
    });
    await iv.answer(10);
    const bad = await iv.answer(5);
    expect(bad.errors).toEqual([{ name: "b", message: "b must be greater than a" }]);
    expect(bad.current.name).toBe("b");
    const fixed = await iv.answer("a", 1);
    expect(fixed.errors).toEqual([]);
    expect(iv.survey.getQuestionByName("b").errors.length).toBe(0);
    expect(fixed.current.name, "b is valid now, so the interview moves on").toBe("c");
  });

  test("skip() moves on, keeps the value, and is undone by an answer", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    survey.data = { q2: "typed earlier" };
    const iv = await createInterview(survey);
    await iv.answer("first");
    expect(iv.current()).toBe(null);

    survey.setValue("q2", "");
    expect(iv.current().name).toBe("q2");
    const skipped = await iv.skip();
    expect(skipped.errors).toEqual([]);
    expect(skipped.current).toBe(null);
    expect(skipped.describe).not.toContain("q2");

    const answered = await iv.answer("q2", "later");
    expect(answered.errors).toEqual([]);
    expect(answered.describe).toContain("q2: later");
  });

  test("skip() keeps the value the input already holds", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] });
    const iv = await createInterview(survey);
    await iv.answer("first");
    survey.setValue("q2", "half typed");
    survey.getQuestionByName("q2").addError(<any>{ getText: () => "not good enough" });
    expect(iv.current().name).toBe("q2");
    await iv.skip();
    expect(iv.data.q2, "skip means move on, not erase").toBe("half typed");
  });

  test("A required input cannot be skipped and stays current", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1", isRequired: true }, { type: "text", name: "q2" }],
    });
    const res = await iv.skip();
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.requiredCannotSkip);
    expect(res.errors[0].name).toBe("q1");
    expect(res.current.name).toBe("q1");
    expect(iv.current().name).toBe("q1");
  });

  test("A skipped input that becomes required is asked again", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", requiredIf: "{q3} = 'yes'" },
        { type: "radiogroup", name: "q3", choices: ["yes", "no"] },
      ],
    });
    await iv.answer("one");
    expect(iv.current().name).toBe("q2");
    await iv.skip();
    expect(iv.current().name).toBe("q3");
    const yes = await iv.answer("yes");
    expect(yes.becameRequired).toEqual(["q2"]);
    expect(yes.current.name, "required means asked").toBe("q2");
  });

  test("A value that is not among the choices is refused and not written", async () => {
    const iv = await createInterview(petJson);
    await iv.answer("Yes");
    const bird = await iv.answer("Bird");
    expect(bird.errors.length).toBe(1);
    expect(bird.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(bird.errors[0].name).toBe("petType");
    expect(bird.errors[0].message).toContain("\"Dog\", \"Cat\", \"Other\"");
    expect(bird.current.name).toBe("petType");
    expect(iv.data.petType).toBeUndefined();
  });

  test("The \"other\" item is a choice, and the object form writes its comment", async () => {
    const iv = await createInterview({
      elements: [{ type: "dropdown", name: "pet", choices: ["Dog", "Cat"], showOtherItem: true }],
    });
    const res = await iv.answer({ value: "other", comment: "Ferret" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ pet: "other", "pet-Comment": "Ferret" });
    // The map reports the object form back, the same shape answer() takes.
    expect(iv.describe()).toContain(lines("answered:", "  pet:", "    value: other", "    comment: Ferret").trim());
  });

  test("Choices that cannot be enumerated are not checked against", async () => {
    const iv = await createInterview({
      elements: [{ type: "dropdown", name: "city", choicesLazyLoadEnabled: true }],
    });
    expect(iv.current().choicesUnknown).toBe(true);
    expect(iv.current().choices).toBeUndefined();
    const res = await iv.answer("Rome");
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ city: "Rome" });
  });

  test("A scalar answer to a question whose value is an array is wrapped", async () => {
    const iv = await createInterview({
      elements: [{ type: "checkbox", name: "pets", choices: ["Dog", "Cat"] }],
    });
    const res = await iv.answer("Dog");
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ pets: ["Dog"] });
    const bad = await iv.answer("pets", "Bird");
    expect(bad.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
  });

  test("A number input refuses a value that is not a number", async () => {
    const iv = await createInterview(petJson);
    await iv.answer("Yes");
    await iv.answer("petType", "Dog");
    const res = await iv.answer("many");
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notANumber);
    expect(iv.data.petAge).toBeUndefined();
    const ok = await iv.answer("7");
    expect(ok.errors).toEqual([]);
    expect(iv.data.petAge).toBe(7);
  });

  test("An action is not a value", async () => {
    const iv = await createInterview({ elements: [{ type: "text", name: "q1" }] });
    const res = await iv.answer(<any>{ action: "add" });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.badAction);
    expect(res.errors[0].name).toBe("q1");
    expect(iv.data).toEqual({});
  });

  test("A panel that a condition reveals lists its questions in document order", async () => {
    const iv = await createInterview({
      elements: [
        { type: "radiogroup", name: "trip", choices: ["yes", "no"] },
        { type: "panel", name: "details", visibleIf: "{trip} = 'yes'", elements: [
          { type: "text", name: "from" },
          { type: "text", name: "to", isRequired: true },
        ] },
      ],
    });
    expect(iv.describe()).not.toContain("from");
    const res = await iv.answer("yes");
    expect(res.becameVisible).toEqual(["from", "to"]);
    expect(res.becameRequired).toEqual(["to"]);
    expect(res.current.name).toBe("from");
  });

  test("The questions of a start page are not items", async () => {
    const iv = await createInterview({
      firstPageIsStartPage: true,
      pages: [
        { elements: [{ type: "text", name: "welcomeName" }] },
        { elements: [{ type: "text", name: "q1" }] },
      ],
    });
    expect(iv.survey.state).toBe("running");
    expect(iv.current().name).toBe("q1");
    expect(iv.describe()).not.toContain("welcomeName");
    expect((await iv.answer("welcomeName", "x")).errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("checkErrorsMode: onValueChanged changes nothing the interview reports", async () => {
    const iv = await createInterview({ ...petJson, checkErrorsMode: "onValueChanged" });
    expect(iv.describe()).toBe(petStartText);
    const yes = await iv.answer("Yes");
    expect(yes.describe).toBe(petAfterYesText);
    await iv.answer("petType", "Dog");
    const tooOld = await iv.answer(55);
    expect(tooOld.errors).toEqual([{ name: "petAge", message: MAX_AGE_ERROR }]);
  });

  test("A setvalue trigger fires on an answer; a complete trigger does not", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }],
      triggers: [
        { type: "setvalue", expression: "{q1} = 'go'", setToName: "q2", setValue: "auto" },
        { type: "complete", expression: "{q1} = 'go'" },
      ],
    });
    const res = await iv.answer("go");
    expect(iv.data.q2, "value triggers run from setValue, so this one fired").toBe("auto");
    expect(iv.survey.state, "navigation triggers do not: the interview never calls performNext()").toBe("running");
    expect(res.current.name).toBe("q3");

    // The host that wants them navigates the model itself, from the input it answered.
    iv.survey.currentSingleQuestion = iv.survey.getQuestionByName("q1");
    expect(iv.survey.performNext()).toBe(true);
    expect(iv.survey.state).toBe("completed");
  });

  test("The error text is the model's, in the model's locale", async () => {
    const survey = new SurveyModel(petJson);
    survey.locale = "de";
    const iv = await createInterview(survey);
    await iv.answer("Yes");
    await iv.answer("petType", "Dog");
    const res = await iv.answer(55);
    // The expected text is the model's own German string, not a literal: what is under test is that
    // the interview reports what the locale says, not what this file believes German looks like.
    const german = (<any>surveyLocalization.locales["de"]).maxError.replace("{0}", "40");
    expect(german).not.toBe(MAX_AGE_ERROR);
    expect(res.errors).toEqual([{ name: "petAge", message: german }]);
    expect(res.describe).toContain(german);
    survey.locale = "";
  });

  test("An asynchronous expression in a visibleIf is awaited before the change is reported", async () => {
    registerAsync("slowVisible", function(params: any): any {
      const returnResult = this.returnResult;
      setTimeout(() => returnResult(params[0] === "yes"), 10);
    });
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "slowVisible({q1}) = true" },
      ],
    });
    const res = await iv.answer("yes");
    expect(res.becameVisible).toEqual(["q2"]);
    expect(res.current.name).toBe("q2");
  });

  test("Choices that load from a web service after an answer are there when the item is described", async () => {
    const survey = new SurveyModel();
    survey.webProvider = {
      sendRequest: (request: ISurveyWebRequest, onResponse: (response: ISurveyWebResponse) => void): void => {
        setTimeout(() => onResponse({ status: 200, response: ["Berlin", "Paris"] }), 10);
      },
    };
    survey.fromJSON({
      elements: [
        { type: "text", name: "country" },
        { type: "dropdown", name: "city", choicesByUrl: { url: "https://example.com/{country}/cities" } },
      ],
    });
    const iv = await createInterview(survey);
    const res = await iv.answer("de");
    expect(res.current.name).toBe("city");
    expect(res.current.choicesUnknown).toBeUndefined();
    expect(res.current.choices.map(choice => choice.value)).toEqual(["Berlin", "Paris"]);
  });

  test("progress counts what is done, and the answered map follows item order", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1", isRequired: true },
        { type: "text", name: "q2" },
        { type: "text", name: "q3", isRequired: true },
      ],
    });
    expect(iv.describe()).toContain(lines("progress:", "  answered: 0", "  remainingRequired: 2").trim());
    await iv.answer("a");
    expect(iv.describe()).toContain(lines("progress:", "  answered: 1", "  remainingRequired: 1").trim());
    // Answered out of order: the map still reads in item order, not in the order the answers arrived.
    await iv.answer("q3", "c");
    await iv.answer("q2", "b");
    expect(iv.describe()).toContain(lines("answered:", "  q1: a", "  q2: b", "  q3: c").trim());
    expect(iv.describe()).toContain(lines("progress:", "  answered: 3", "  remainingRequired: 0").trim());
  });

  test("An invalid answer is not counted as progress and keeps the input current", async () => {
    const iv = await createInterview(petJson);
    await iv.answer("Yes");
    await iv.answer("petType", "Dog");
    await iv.answer(55);
    expect(iv.describe()).toContain(lines("progress:", "  answered: 2", "  remainingRequired: 0").trim());
    expect(iv.current().name).toBe("petAge");
    expect(iv.describe()).toContain("petAge: 55");
  });
});
