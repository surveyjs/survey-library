// @vitest-environment node
// Batch mode is what an agent talks to, and an agent runs on a server: nothing here needs a DOM.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview } from "survey-core/interview";
import { ComponentCollection, SurveyModel, settings, surveyLocalization } from "survey-core";

import { afterEach, describe, expect, test } from "vitest";

const petJson = {
  title: "Pet survey",
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
  "items:",
  "  - name: hasPet",
  "    type: radiogroup",
  "    title: Do you have a pet?",
  "    required: true",
  "    choices:",
  "      - value: \"Yes\"",
  "      - value: \"No\"",
  "```"
);

// The loop the README hands an integrator, run against a scripted "agent" instead of a model. It is
// under test here as much as the calls are: the condition is current, not "errors or becameVisible",
// and a turn that changes nothing must end it rather than spin.
async function runAgentLoop(interview: IInterview, agent: (document: string) => any): Promise<number> {
  let result = await interview.answerAll(agent(interview.describeAll()));
  let previous = "";
  let turns = 1;
  while(result.current) {
    if (result.describe === previous) break;
    previous = result.describe;
    result = await interview.answerAll(agent(result.describe));
    turns++;
    if (turns > 20) throw new Error("the loop did not terminate");
  }
  return turns;
}

const customComponents: Array<string> = [];
afterEach(() => {
  while(customComponents.length > 0) {
    ComponentCollection.Instance.remove(customComponents.pop());
  }
  settings.commentSuffix = "-Comment";
});

describe("interview batch mode (issue #11818)", () => {
  test("The pet survey, one batch at a time", async () => {
    const iv = await createInterview(petJson);
    expect(iv.describeAll()).toBe(petStartText);

    const yes = await iv.answerAll({ hasPet: "Yes" });
    expect(yes.errors).toEqual([]);
    expect(yes.becameVisible).toEqual(["petType", "petAge"]);
    expect(yes.becameRequired).toEqual(["petType"]);
    // hasPet is answered and valid, so it is not asked again; the two new questions are.
    expect(yes.describe).toContain(lines("items:", "  - name: petType").trim());
    expect(yes.describe).toContain("  - name: petAge");
    expect(yes.describe).not.toContain("- name: hasPet");
    expect(yes.current.name, "an askable item is still unanswered, so the loop goes on").toBe("petType");

    const two = await iv.answerAll({ petType: "Dog", petAge: 55 });
    expect(two.errors).toEqual([{ name: "petAge", message: MAX_AGE_ERROR }]);
    expect(two.describe).toContain("  - name: petAge");
    expect(two.describe, "what was accepted is not asked again").not.toContain("- name: petType");
    expect(two.describe).toContain("    error: " + MAX_AGE_ERROR);
    expect(two.current.name).toBe("petAge");

    const four = await iv.answerAll({ petAge: 4 });
    expect(four.errors).toEqual([]);
    expect(four.describe).toContain("items: []");
    expect(four.current).toBe(null);

    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "Yes", petType: "Dog", petAge: 4 });
  });

  test("The README loop terminates on the pet survey in three turns", async () => {
    const iv = await createInterview(petJson);
    const answers: Array<any> = [{ hasPet: "Yes" }, { petType: "Dog", petAge: 55 }, { petAge: 4 }];
    let turn = 0;
    const turns = await runAgentLoop(iv, () => answers[Math.min(turn++, answers.length - 1)]);
    expect(turns).toBe(3);
    expect(iv.current()).toBe(null);
    const done = await iv.complete();
    expect(done.completed).toBe(true);
  });

  test("A bad key is reported and the good keys of the same call are written", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    const res = await iv.answerAll({ q1: "one", nope: "x", q2: "two" });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(res.errors[0].name).toBe("nope");
    expect(res.errors[0].message).toContain("\"q1\", \"q2\"");
    expect(iv.data).toEqual({ q1: "one", q2: "two" });
  });

  test("The keys are written in item order, not in the order the object carries them", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b", setValueIf: "{a} = 'x'", setValueExpression: "{a} + '!'" },
      ],
    });
    // b first in the object: written in that order, the setValueIf that "a" triggers would land
    // after b's own answer and overwrite it.
    const res = await iv.answerAll({ b: "typed", a: "x" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ a: "x", b: "typed" });
  });

  test("A key hidden by an earlier key of the same call is refused, not written", async () => {
    const iv = await createInterview(petJson);
    await iv.answerAll({ hasPet: "Yes" });
    const res = await iv.answerAll({ hasPet: "No", petType: "Dog" });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAskable);
    expect(res.errors[0].name).toBe("petType");
    expect(res.becameHidden).toEqual(["petType", "petAge"]);
    expect(iv.data).toEqual({ hasPet: "No" });
  });

  test("A value is checked against the choices an earlier key of the same call produced", async () => {
    const iv = await createInterview({
      elements: [
        { type: "checkbox", name: "source", choices: ["Dog", "Cat", "Bird"] },
        { type: "dropdown", name: "pick", choicesFromQuestion: "source", choicesFromQuestionMode: "selected" },
      ],
    });
    const bad = await iv.answerAll({ source: ["Dog"], pick: "Cat" });
    expect(bad.errors.length).toBe(1);
    expect(bad.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(bad.errors[0].name).toBe("pick");
    expect(iv.data).toEqual({ source: ["Dog"] });
    const good = await iv.answerAll({ source: ["Dog", "Cat"], pick: "Cat" });
    expect(good.errors).toEqual([]);
    expect(iv.data.pick).toBe("Cat");
  });

  test("A comment is a key of its own, named the way the model names it", async () => {
    const iv = await createInterview({
      elements: [{ type: "dropdown", name: "petType", choices: ["Dog", "Cat"], showOtherItem: true }],
    });
    expect(Object.keys(iv.getAnswerSchema().properties)).toEqual(["petType", "petType-Comment"]);
    const res = await iv.answerAll({ petType: "other", "petType-Comment": "Ferret" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ petType: "other", "petType-Comment": "Ferret" });
  });

  test("The comment key follows settings.commentSuffix, in the schema and in answerAll", async () => {
    settings.commentSuffix = "__note";
    const iv = await createInterview({
      elements: [{ type: "dropdown", name: "petType", choices: ["Dog"], showOtherItem: true }],
    });
    expect(Object.keys(iv.getAnswerSchema().properties)).toEqual(["petType", "petType__note"]);
    const res = await iv.answerAll({ petType: "other", "petType__note": "Ferret" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ petType: "other", "petType__note": "Ferret" });
    // The old suffix is no key at all now.
    const stale = await iv.answerAll({ "petType-Comment": "Ferret" });
    expect(stale.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("current is the loop condition: one answer of two required questions does not end it", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1", isRequired: true },
        { type: "text", name: "q2", isRequired: true },
      ],
    });
    const first = await iv.answerAll({ q1: "one" });
    expect(first.errors, "the other required question is work left, not an error").toEqual([]);
    expect(first.becameVisible).toEqual([]);
    expect(first.becameRequired).toEqual([]);
    expect(first.current.name, "and current says so").toBe("q2");
    const second = await iv.answerAll({ q2: "two" });
    expect(second.current).toBe(null);
  });

  test("An agent that repeats itself trips the no-progress guard instead of spinning", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1", isRequired: true }, { type: "text", name: "q2", isRequired: true }],
    });
    let calls = 0;
    const turns = await runAgentLoop(iv, () => { calls++; return { q1: "one" }; });
    expect(turns).toBe(2);
    expect(calls).toBe(2);
    expect(iv.current().name).toBe("q2");
    const done = await iv.complete();
    expect(done.completed).toBe(false);
    expect(done.errors.length).toBe(1);
    expect(done.errors[0].name).toBe("q2");
  });

  test("A required item that just became required is listed, and is not an error", async () => {
    const iv = await createInterview({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["yes", "no"] },
        { type: "text", name: "q2", requiredIf: "{q1} = 'yes'" },
      ],
    });
    const res = await iv.answerAll({ q1: "yes" });
    expect(res.becameRequired).toEqual(["q2"]);
    expect(res.errors, "errors is what was wrong with what was sent").toEqual([]);
    expect(res.describe).toContain("  - name: q2");
    expect(res.current.name).toBe("q2");
  });

  test("A disabled item is listed and refused; a read-only one is not listed at all", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "off", title: "Off for now", enableIf: "{q1} = 'open'" },
        { type: "text", name: "ro", readOnly: true },
      ],
    });
    const document = iv.describeAll();
    expect(document, "\"off\" is a YAML keyword, so the address is quoted").toContain("  - name: \"off\"");
    expect(document).toContain("    disabled: true");
    expect(document, "read-only by property: nobody can ever answer it, so it is not an item").not.toContain("name: ro");
    const res = await iv.answerAll({ off: "x", ro: "y" });
    expect(res.errors.length).toBe(2);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAskable);
    expect(res.errors[0].name).toBe("off");
    expect(res.errors[0].message).toContain("enableIf");
    expect(res.errors[1].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(iv.data).toEqual({});
  });

  test("A dynamic container is filled as records, and a file is listed without a reason", async () => {
    const iv = await createInterview({
      elements: [
        { type: "paneldynamic", name: "meds", title: "Medications", panelCount: 1,
          templateElements: [{ type: "text", name: "dose", isRequired: true }] },
        { type: "file", name: "photo", title: "A photo" },
      ],
    });
    const document = iv.describeAll();
    expect(document).toContain(lines(
      "  - name: meds",
      "    type: paneldynamic",
      "    title: Medications",
      "    required: false",
      "    entries:",
      "      - index: 0",
      "        canRemove: true",
      "        fields:",
      "          - name: dose",
      "            type: text",
      "            title: dose",
      "            required: true"
    ).trim());
    expect(document).toContain(lines(
      "  - name: photo",
      "    type: file",
      "    title: A photo",
      "    required: false",
      "    unsupported: true",
      "```"
    ).trim());
    expect(document.split("reason:").length - 1,
      "no version will ever fill a file upload, so there is no reason to give").toBe(0);
    const res = await iv.answerAll({ meds: [{ dose: "1" }], photo: "x" });
    // The container took its list; the file is the one key nothing can be sent for.
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAskable);
    expect(iv.data).toEqual({ meds: [{ dose: "1" }] });
    // The questions inside a container still have no batch address: a record addresses them.
    expect((await iv.answerAll({ dose: "1" })).errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("A multiple text and a composite are filled as objects of fields", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "fullname",
      elementsJSON: [{ type: "text", name: "first" }, { type: "text", name: "last" }],
    });
    customComponents.push("fullname");
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "email" }, { name: "phone" }] },
        { type: "fullname", name: "who" },
      ],
    });
    const document = iv.describeAll();
    expect(document).toContain("  - name: contact");
    expect(document).toContain("  - name: who");
    // A fixed-shape container is one object with a fixed set of keys (tier 07): it is filled, not
    // refused, so neither record carries a reason.
    expect(document.split("reason: batch").length - 1).toBe(0);
    expect(Object.keys(iv.getAnswerSchema().properties)).toEqual(["contact", "who"]);
    // The fields are keys of the container's own object and never top-level addresses.
    expect((await iv.answerAll({ email: "a@b.c" })).errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    const res = await iv.answerAll({ contact: { email: "a@b.c" }, who: { first: "Ann" } });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ contact: { email: "a@b.c" }, who: { first: "Ann" } });
  });

  test("An item the interviewee skipped in single mode is still listed", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    await iv.answer("one");
    expect(iv.current().name).toBe("q2");
    await iv.skip();
    expect(iv.current(), "single mode moved past it").toBe(null);
    // Skipping is a gesture of a conversation with a person. An agent that wants to leave a question
    // blank leaves it blank, so batch mode shows it what is there.
    expect(iv.describeAll()).toContain("  - name: q2");
    const res = await iv.answerAll({ q2: "two" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ q1: "one", q2: "two" });
  });

  test("An answered but invalid item stays listed until it is fixed", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1", inputType: "number", min: 0, max: 10 },
        { type: "text", name: "q2" },
      ],
    });
    await iv.answerAll({ q1: 99, q2: "fine" });
    const document = iv.describeAll();
    expect(document).toContain("  - name: q1");
    expect(document).not.toContain("- name: q2");
    expect(document).toContain("    error: ");
  });

  test("An asynchronous validator of every key of a batch drains in one settle", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    survey.onValidateQuestion.add((sender, options) => {
      if (options.value !== "bad") return;
      options.error = options.name + " is bad";
    });
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ q1: "bad", q2: "bad" });
    expect(res.errors).toEqual([
      { name: "q1", message: "q1 is bad" },
      { name: "q2", message: "q2 is bad" },
    ]);
    expect(res.current.name).toBe("q1");
  });

  test("An error another key of the same batch fixed is cleared", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "a", inputType: "number" },
        { type: "text", name: "b", inputType: "number",
          validators: [{ type: "expression", expression: "{b} > {a}", text: "b must be greater than a" }] },
      ],
    });
    await iv.answerAll({ a: 10, b: 5 });
    expect(iv.survey.getQuestionByName("b").errors.length).toBe(1);
    const fixed = await iv.answerAll({ a: 1 });
    expect(fixed.errors).toEqual([]);
    expect(iv.survey.getQuestionByName("b").errors.length).toBe(0);
    expect(fixed.current).toBe(null);
  });

  test("Batch mode after the survey completed is a coded error", async () => {
    const iv = await createInterview({ elements: [{ type: "text", name: "q1" }] });
    await iv.answerAll({ q1: "one" });
    expect((await iv.complete()).completed).toBe(true);
    const res = await iv.answerAll({ q1: "two" });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.surveyCompleted);
    expect(iv.data).toEqual({ q1: "one" });
    // The document still renders: a transcript wants the final progress and answers.
    expect(iv.describeAll()).toContain("  q1: one");
  });

  test("The titles and the error texts of a batch document are the model's, in its locale", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "petAge", inputType: "number", min: 0, max: 40,
        title: { default: "Pet age", fr: "Age de l'animal" } }],
    });
    survey.locale = "fr";
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ petAge: 55 });
    const french = (<any>surveyLocalization.locales["fr"]).maxError.replace("{0}", "40");
    expect(french).not.toBe(MAX_AGE_ERROR);
    expect(res.errors).toEqual([{ name: "petAge", message: french }]);
    expect(res.describe).toContain("Age de l'animal");
    expect(res.describe).toContain(french);
    // The tool descriptions are read by the agent's own model, not by the interviewee, and they do
    // not follow the survey's locale.
    expect(iv.getTools()[0].description).toBe(
      "Return the questions that still need an answer, as Markdown with a YAML block.");
    survey.locale = "";
  });
});
