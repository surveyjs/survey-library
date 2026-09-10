// @vitest-environment node
// The questions inside a choice of a radiogroup or a checkbox, as inputs of their own. The model keeps
// their values at the top level of data under their own names, so they are roots of the inventory:
// an item right after their owner in single mode, a root of the document in batch mode, their name as
// their address. Nothing here needs a DOM.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview, IInterviewItem } from "survey-core/interview";
import { SurveyModel, surveyLocalization } from "survey-core";
import type { Question } from "survey-core";
import { getInterviewInputs } from "../../src/interview/interview-items";

import { describe, expect, test } from "vitest";

function lines(...text: Array<string>): string {
  return text.join("\n") + "\n";
}

const PET_NAME = { type: "text", name: "petName", title: "Pet name", isRequired: true };
const PET_AGE = { type: "text", name: "petAge", title: "Pet age", inputType: "number" };

// A radiogroup whose "Yes" holds questions and whose "No" holds none.
function hasPet(elements?: Array<any>, extra?: any): any {
  return Object.assign({
    type: "radiogroup", name: "hasPet", title: "Do you have a pet?",
    choices: [{ value: "Yes", elements: elements || [PET_NAME, PET_AGE] }, "No"],
  }, extra || {});
}

// A checkbox with questions in two of its three choices.
const CONTACTS = {
  type: "checkbox", name: "contacts", title: "Contact me by",
  choices: [
    { value: "email", elements: [{ type: "text", name: "emailAddr", title: "Email address", isRequired: true }] },
    { value: "phone", elements: [{ type: "text", name: "phoneNum", title: "Phone number" }] },
    "post",
  ],
};
const NOTE = { type: "text", name: "note", title: "Note" };

function petJson(extra?: any): any {
  return Object.assign({ title: "Pets", elements: [hasPet(), CONTACTS, NOTE] }, extra || {});
}

const ORDERS = {
  type: "paneldynamic", name: "orders", title: "Orders", panelCount: 1,
  templateElements: [{ type: "text", name: "sku", title: "SKU", isRequired: true }],
};
const MATRIX = {
  type: "matrixdropdown", name: "matrix", title: "Matrix", rows: ["row1"],
  columns: [{ name: "column1", title: "Column", cellType: "text" }],
};

function batchNames(iv: IInterview): Array<string> {
  return iv.getBatchDocument().items.map(item => item.name);
}

function recordOf(iv: IInterview, name: string): IInterviewItem {
  return iv.getBatchDocument().items.filter(item => item.name === name)[0];
}

// The item names a document lists, read off the text the way a scripted agent reads them.
function itemNamesOf(document: string): Array<string> {
  const res: Array<string> = [];
  document.split("\n").forEach(line => {
    const match = /^ {2}- name: (.+)$/.exec(line);
    if (!!match) res.push(match[1]);
  });
  return res;
}

// The loop the README hands an integrator (README, "The loop").
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

// An agent that answers what it is shown, and nothing else.
function scriptedAgent(answers: { [name: string]: any }): (document: string) => any {
  return (document: string) => {
    const res: any = {};
    itemNamesOf(document).forEach(name => {
      if (answers[name] !== undefined) res[name] = answers[name];
    });
    return res;
  };
}

describe("interview nested elements in choice items (issue #11818)", () => {
  // The model's rules the tier is built on, pinned once: a later core change fails here first.
  test("The model: the panel shows on a value write, its questions have no parent question and write to the top", () => {
    const survey = new SurveyModel(petJson());
    const owner: any = survey.getQuestionByName("hasPet");
    const petName = survey.getQuestionByName("petName");
    survey.setValue("hasPet", "Yes");
    expect(owner.choices[0].isPanelShowing, "no rendering is needed").toBe(true);
    expect(owner.getNestedQuestions(true, false), "the walk the mode is built on misses them").toEqual([]);
    expect(survey.getAllQuestions().map(q => q.name), "and so does the page list").toEqual(["hasPet", "contacts", "note"]);
    expect(petName.parentQuestion).toBeFalsy();
    petName.value = "Rex";
    expect(survey.data).toEqual({ hasPet: "Yes", petName: "Rex" });
    survey.setValue("hasPet", "No");
    expect(owner.choices[0].isPanelShowing).toBe(false);
    expect(petName.isVisibleInSurvey, "visibility is not the switch").toBe(true);
  });

  test("Single mode: the questions of a selected choice are asked right after their owner", async () => {
    const iv = await createInterview(petJson());
    expect(iv.current().name).toBe("hasPet");
    expect(iv.describe()).not.toContain("petName");
    const yes = await iv.answer("Yes");
    expect(yes.errors).toEqual([]);
    expect(yes.becameVisible).toEqual(["petName", "petAge"]);
    expect(yes.becameRequired).toEqual(["petName"]);
    expect(yes.becameHidden).toEqual([]);
    expect(yes.current.name).toBe("petName");
    expect(yes.current.entry, "the question is its own root: no breadcrumb").toBeUndefined();
    await iv.answer("Rex");
    expect(iv.current().name).toBe("petAge");
    const skipped = await iv.skip();
    expect(skipped.errors).toEqual([]);
    expect(iv.current().name).toBe("contacts");
    expect(iv.data).toEqual({ hasPet: "Yes", petName: "Rex" });
  });

  // README, "A question inside a choice, end to end": the transcript, both modes.
  const readmeJson = {
    title: "Pets",
    elements: [
      { type: "radiogroup", name: "hasPet", title: "Do you have a pet?", choices: [
        { value: "Yes", elements: [{ type: "text", name: "petName", title: "Pet name", isRequired: true }] },
        "No",
      ] },
      { type: "text", name: "note", title: "Note" },
    ],
  };

  test("The README transcript, single mode", async () => {
    const iv = await createInterview(readmeJson);
    const res = await iv.answer("Yes");
    expect(res.becameVisible).toEqual(["petName"]);
    expect(res.becameRequired).toEqual(["petName"]);
    expect(res.describe).toBe(lines(
      "# Pets",
      "",
      "```yaml",
      "progress:",
      "  answered: 1",
      "  remainingRequired: 1",
      "answered:",
      "  hasPet: \"Yes\"",
      "changes:",
      "  becameVisible: [petName]",
      "  becameRequired: [petName]",
      "current:",
      "  name: petName",
      "  type: text",
      "  title: Pet name",
      "  required: true",
      "```"
    ));
    expect((await iv.answer("Rex")).current.name).toBe("note");
    expect((await iv.skip()).current).toBe(null);
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "Yes", petName: "Rex" });
  });

  test("The README transcript, batch mode", async () => {
    const iv = await createInterview(readmeJson);
    expect(batchNames(iv)).toEqual(["hasPet", "note"]);
    const yes = await iv.answerAll({ hasPet: "Yes" });
    expect(yes.becameVisible).toEqual(["petName"]);
    expect(batchNames(iv)).toEqual(["petName", "note"]);
    const rest = await iv.answerAll({ petName: "Rex", note: "-" });
    expect(rest.errors).toEqual([]);
    expect(batchNames(iv)).toEqual([]);
    expect(rest.current).toBe(null);

    const once = await createInterview(readmeJson);
    expect((await once.answerAll({ hasPet: "Yes", petName: "Rex" })).errors).toEqual([]);
    expect(once.data).toEqual({ hasPet: "Yes", petName: "Rex" });
  });

  test("Single mode: a choice without questions moves on to the next root", async () => {
    const iv = await createInterview(petJson());
    const no = await iv.answer("No");
    expect(no.becameVisible).toEqual([]);
    expect(no.current.name).toBe("contacts");
  });

  test("describe() after the choice was selected, byte for byte", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("Yes");
    expect(iv.describe()).toBe(lines(
      "# Pets",
      "",
      "```yaml",
      "progress:",
      "  answered: 1",
      "  remainingRequired: 1",
      "answered:",
      "  hasPet: \"Yes\"",
      "current:",
      "  name: petName",
      "  type: text",
      "  title: Pet name",
      "  required: true",
      "```"
    ));
  });

  test("The model's current is the owner while one of its choice questions is asked", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("Yes");
    expect(iv.current().name).toBe("petName");
    expect(iv.survey.currentSingleQuestion.name).toBe("hasPet");
    await iv.answer("Rex");
    expect(iv.current().name).toBe("petAge");
    expect(iv.survey.currentSingleQuestion.name).toBe("hasPet");
    await iv.skip();
    expect(iv.survey.currentSingleQuestion.name).toBe("contacts");
  });

  test("Switching to a choice without questions reports them hidden", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("Yes");
    const no = await iv.answer("hasPet", "No");
    expect(no.becameHidden).toEqual(["petName", "petAge"]);
    expect(no.becameVisible).toEqual([]);
    expect(no.current.name).toBe("contacts");
  });

  test("A choice question is answered by its address, and only while its choice is selected", async () => {
    const iv = await createInterview(petJson());
    const before = await iv.answer("petName", "Rex");
    expect(before.errors.length).toBe(1);
    expect(before.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(before.errors[0].message).toContain("now are: \"hasPet\", \"contacts\", \"note\".");
    expect(iv.data).toEqual({});

    await iv.answer("Yes");
    await iv.answer("Rex");
    expect(iv.current().name).toBe("petAge");
    const revisit = await iv.answer("petName", "Max");
    expect(revisit.errors).toEqual([]);
    expect(revisit.current.name, "a revisit leaves the current where it was").toBe("petAge");
    expect(iv.data).toEqual({ hasPet: "Yes", petName: "Max" });

    await iv.answer("hasPet", "No");
    // getQuestionByName still finds the question; the inventory does not list it, and an address has
    // to name an input that exists now.
    expect(iv.survey.getQuestionByName("petName")).toBeTruthy();
    const after = await iv.answer("petName", "Rex");
    expect(after.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(after.errors[0].message).toContain("now are: \"hasPet\", \"contacts\", \"note\".");
    expect(iv.data).toEqual({ hasPet: "No", petName: "Max" });
  });

  test("Deselection under the default clearInvisibleValues: the value stays until complete()", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("Yes");
    await iv.answer("Rex");
    const no = await iv.answer("hasPet", "No");
    expect(no.becameHidden).toEqual(["petName", "petAge"]);
    // Named by the change report and nowhere else: the input is gone, so the answered map, which is a
    // map over the inputs there are, has no key for it.
    expect(no.describe).toContain("  becameHidden: [petName, petAge]");
    expect(no.describe.split("petName").length).toBe(2);
    expect(iv.describe()).not.toContain("petName");
    expect(iv.describeAll()).not.toContain("petName");
    expect(iv.getSingleDocument().answered).toEqual({ hasPet: "No" });
    expect(iv.data.petName, "the interview does not clear what the model keeps").toBe("Rex");
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "No" });
  });

  test("Deselection under onHidden in single mode: the value is gone with the answer", async () => {
    const iv = await createInterview(petJson({ clearInvisibleValues: "onHidden" }));
    await iv.answer("Yes");
    await iv.answer("Rex");
    await iv.answer("hasPet", "No");
    expect(iv.data).toEqual({ hasPet: "No" });
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "No" });
  });

  // The model clears a hidden choice panel only once the owner was rendered, which is the moment its
  // page first became the model's current. An owner on a page no call has made current keeps the
  // value until complete(), even under onHidden.
  const twoPagesJson = {
    clearInvisibleValues: "onHidden",
    pages: [
      { elements: [{ type: "text", name: "first", title: "First" }] },
      { elements: [hasPet()] },
    ],
  };

  test("Deselection under onHidden in batch mode, on a page no call has made current", async () => {
    const iv = await createInterview(twoPagesJson);
    await iv.answerAll({ hasPet: "Yes" });
    await iv.answerAll({ petName: "Rex" });
    const no = await iv.answerAll({ hasPet: "No" });
    expect(no.becameHidden).toEqual(["petName", "petAge"]);
    expect(iv.survey.getQuestionByName("hasPet").wasRendered).toBe(false);
    expect(iv.data.petName).toBe("Rex");
    expect(iv.describeAll()).not.toContain("petName");
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "No" });
  });

  test("Deselection under onHidden in batch mode, once single mode made the owner's page current", async () => {
    const iv = await createInterview(twoPagesJson);
    await iv.answer("x");
    expect(iv.current().name).toBe("hasPet");
    await iv.answerAll({ hasPet: "Yes" });
    await iv.answerAll({ petName: "Rex" });
    await iv.answerAll({ hasPet: "No" });
    expect(iv.survey.getQuestionByName("hasPet").wasRendered).toBe(true);
    expect(iv.data).toEqual({ first: "x", hasPet: "No" });
    const done = await iv.complete();
    expect(done.completed).toBe(true);
  });

  test("complete() reports the empty required question inside a choice, not a blocked completion", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("Yes");
    const blocked = await iv.complete();
    expect(blocked.completed).toBe(false);
    expect(blocked.errors).toEqual([{ name: "petName", message: "Response required." }]);
    expect(iv.survey.state).toBe("running");
    await iv.answer("petName", "Rex");
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "Yes", petName: "Rex" });
  });

  test("complete() reports the empty required question inside a checkbox's choice", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("hasPet", "No");
    await iv.answer("contacts", ["email"]);
    expect(iv.current().name).toBe("emailAddr");
    const blocked = await iv.complete();
    expect(blocked.completed).toBe(false);
    expect(blocked.errors).toEqual([{ name: "emailAddr", message: "Response required." }]);
    await iv.answer("emailAddr", "ann@example.com");
    expect((await iv.complete()).completed).toBe(true);
    expect(iv.data).toEqual({ hasPet: "No", contacts: ["email"], emailAddr: "ann@example.com" });
  });

  // The survey completes through server validation only when the model considers its current input
  // the last one, and the mode's navigation does not know a question inside a choice. So the model's
  // current for such a question is its owner - which is what lets a survey that ends inside a choice
  // complete at all.
  function serverValidatedSurvey(json: any, async: boolean): { survey: SurveyModel, calls: () => number } {
    const survey = new SurveyModel(json);
    let calls = 0;
    survey.onServerValidateQuestions.add((_, options) => {
      calls++;
      if (async) {
        setTimeout(() => options.complete(), 10);
      } else {
        options.complete();
      }
    });
    return { survey: survey, calls: () => calls };
  }

  [false, true].forEach(async => {
    const kind = async ? "asynchronously" : "synchronously";

    test("A survey whose last input is inside a choice completes through server validation (" + kind + ")", async () => {
      const server = serverValidatedSurvey({ elements: [NOTE, hasPet()] }, async);
      const iv = await createInterview(server.survey);
      await iv.answer("hi");
      await iv.answer("Yes");
      expect(iv.current().name).toBe("petName");
      expect(iv.survey.currentSingleElement).toBe(iv.survey.getQuestionByName("hasPet"));
      await iv.answer("Rex");
      await iv.answer(3);
      expect(iv.current()).toBe(null);
      const done = await iv.complete();
      expect(done.errors).toEqual([]);
      expect(done.completed).toBe(true);
      expect(iv.survey.state).toBe("completed");
      expect(server.calls()).toBe(1);
      expect(done.data).toEqual({ note: "hi", hasPet: "Yes", petName: "Rex", petAge: 3 });
    });

    test("The same with the owner on a second page (" + kind + ")", async () => {
      const server = serverValidatedSurvey({
        pages: [{ elements: [NOTE] }, { elements: [hasPet()] }],
      }, async);
      const iv = await createInterview(server.survey);
      await iv.answer("hi");
      await iv.answer("Yes");
      await iv.answer("Rex");
      await iv.answer(3);
      const done = await iv.complete();
      expect(done.completed).toBe(true);
      expect(iv.survey.state).toBe("completed");
      expect(server.calls()).toBe(1);
    });

    test("The same with a dynamic panel inside the choice as the last input (" + kind + ")", async () => {
      const server = serverValidatedSurvey({ elements: [NOTE, hasPet([ORDERS])] }, async);
      const iv = await createInterview(server.survey);
      await iv.answer("hi");
      await iv.answer("Yes");
      expect(iv.current().name).toBe("orders[0].sku");
      await iv.answer("A");
      // The summary step of the container is still built after the owner became the model's current:
      // the container's own single-input state survives the move.
      const summary = iv.current();
      expect(summary.name).toBe("orders");
      expect(summary.summary.entries.length).toBe(1);
      expect(iv.survey.currentSingleQuestion.name).toBe("hasPet");
      expect(iv.describe()).toContain("  summary:\n    entries:\n      - index: 0");
      await iv.answer({ action: "done" });
      expect(iv.current()).toBe(null);
      const done = await iv.complete();
      expect(done.errors).toEqual([]);
      expect(done.completed).toBe(true);
      expect(iv.survey.state).toBe("completed");
      expect(server.calls()).toBe(1);
      expect(done.data).toEqual({ note: "hi", hasPet: "Yes", orders: [{ sku: "A" }] });
    });
  });

  test("Batch mode: the questions of a choice are roots of the document while it is selected", async () => {
    const iv = await createInterview(petJson());
    expect(batchNames(iv)).toEqual(["hasPet", "contacts", "note"]);
    // Nothing on the choice record says a choice holds questions.
    expect(recordOf(iv, "hasPet").choices).toEqual([{ value: "Yes" }, { value: "No" }]);

    const yes = await iv.answerAll({ hasPet: "Yes" });
    expect(yes.errors).toEqual([]);
    expect(yes.becameVisible).toEqual(["petName", "petAge"]);
    let document = iv.getBatchDocument();
    expect(document.items.map(item => item.name)).toEqual(["petName", "petAge", "contacts", "note"]);
    expect(document.progress.remainingRequired).toBe(1);
    expect(document.answered).toEqual({ hasPet: "Yes" });

    await iv.answerAll({ petName: "Rex" });
    document = iv.getBatchDocument();
    expect(document.items.map(item => item.name)).toEqual(["petAge", "contacts", "note"]);
    expect(document.answered).toEqual({ hasPet: "Yes", petName: "Rex" });
    expect(document.progress.remainingRequired).toBe(0);
  });

  test("Batch mode: a checkbox lists the questions of every selected choice, in choice order", async () => {
    const iv = await createInterview(petJson());
    await iv.answerAll({ contacts: ["phone", "email"] });
    expect(batchNames(iv)).toEqual(["hasPet", "emailAddr", "phoneNum", "note"]);
    const one = await iv.answerAll({ contacts: ["phone"] });
    expect(one.becameHidden).toEqual(["emailAddr"]);
    expect(batchNames(iv)).toEqual(["hasPet", "phoneNum", "note"]);
  });

  test("Batch mode: a choice and its question are written in one call, whatever order the object carries", async () => {
    const forward = await createInterview(petJson());
    const one = await forward.answerAll({ hasPet: "Yes", petName: "Rex" });
    expect(one.errors).toEqual([]);
    expect(one.becameVisible).toEqual(["petName", "petAge"]);
    expect(forward.data).toEqual({ hasPet: "Yes", petName: "Rex" });

    const reverse = await createInterview(petJson());
    const two = await reverse.answerAll({ petName: "Rex", hasPet: "Yes" });
    expect(two.errors).toEqual([]);
    expect(two.becameVisible).toEqual(["petName", "petAge"]);
    expect(reverse.data).toEqual({ hasPet: "Yes", petName: "Rex" });
    expect(two.describe).toBe(one.describe);
  });

  test("Batch mode: a root a visibleIf reveals is written in the same call", async () => {
    const iv = await createInterview({
      elements: [
        { type: "radiogroup", name: "trip", choices: ["yes", "no"] },
        { type: "panel", name: "details", visibleIf: "{trip} = 'yes'", elements: [
          { type: "text", name: "from" },
        ] },
      ],
    });
    const res = await iv.answerAll({ from: "Rome", trip: "yes" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ trip: "yes", from: "Rome" });
  });

  test("Batch mode: a chain of reveals takes as many passes as it needs, and each key is written once", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b", visibleIf: "{a} notempty" },
        { type: "text", name: "c", visibleIf: "{b} notempty" },
      ],
    });
    const writes: Array<string> = [];
    survey.onValueChanged.add((_, options) => writes.push(options.name));
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ c: "z", b: "y", a: "x" });
    expect(res.errors).toEqual([]);
    expect(res.becameVisible).toEqual(["b", "c"]);
    expect(iv.data).toEqual({ a: "x", b: "y", c: "z" });
    expect(writes).toEqual(["a", "b", "c"]);
  });

  test("Batch mode: a key nothing reveals is unknownQuestion, listing what may be written after the call", async () => {
    const iv = await createInterview(petJson());
    const alone = await iv.answerAll({ petName: "Rex" });
    expect(alone.errors.length).toBe(1);
    expect(alone.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(alone.errors[0].name).toBe("petName");
    expect(iv.data).toEqual({});

    const no = await iv.answerAll({ hasPet: "No", petName: "Rex" });
    expect(no.errors.length).toBe(1);
    expect(no.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(no.errors[0].name).toBe("petName");
    expect(iv.data).toEqual({ hasPet: "No" });

    // The list is the one after the writes: the question the same call revealed is in it.
    const other = await iv.answerAll({ hasPet: "Yes", nope: "x" });
    expect(other.errors.length).toBe(1);
    expect(other.errors[0].name).toBe("nope");
    expect(other.errors[0].message).toContain("\"petName\"");
  });

  test("Batch mode: the shape of a field of the owner stays refused", async () => {
    const iv = await createInterview(petJson());
    const res = await iv.answerAll({ hasPet: { petName: "Rex" } });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(res.errors[0].name).toBe("hasPet");
    expect(iv.data).toEqual({});
  });

  test("Batch mode: deselecting the choice takes its questions out of the document", async () => {
    const iv = await createInterview(petJson());
    await iv.answerAll({ hasPet: "Yes", petName: "Rex" });
    const no = await iv.answerAll({ hasPet: "No" });
    expect(no.becameHidden).toEqual(["petName", "petAge"]);
    expect(iv.describeAll()).not.toContain("petName");
    expect(batchNames(iv)).toEqual(["contacts", "note"]);
  });

  test("The README loop terminates, one turn more than the same survey without questions in its choices", async () => {
    const answers = {
      hasPet: "Yes", petName: "Rex", petAge: 3, contacts: ["email"], emailAddr: "ann@example.com", note: "hi",
    };
    const iv = await createInterview(petJson());
    const turns = await runAgentLoop(iv, scriptedAgent(answers));
    expect(iv.current()).toBe(null);
    expect(iv.data).toEqual(answers);
    expect((await iv.complete()).completed).toBe(true);

    const plain = await createInterview({
      elements: [
        { type: "radiogroup", name: "hasPet", choices: ["Yes", "No"] },
        { type: "checkbox", name: "contacts", choices: ["email", "phone", "post"] },
        NOTE,
      ],
    });
    const plainTurns = await runAgentLoop(plain, scriptedAgent(answers));
    expect(plainTurns).toBe(1);
    expect(turns).toBe(plainTurns + 1);
  });

  test("A dynamic panel inside a choice: its entries in single mode, a root record in batch mode", async () => {
    const json = { elements: [hasPet([PET_NAME, PET_AGE, ORDERS]), NOTE] };
    const single = await createInterview(json);
    await single.answer("Yes");
    await single.answer("Rex");
    expect(single.current().name).toBe("petAge");
    await single.skip();
    expect(single.current().name).toBe("orders[0].sku");
    const sku = await single.answer("orders[0].sku", "A");
    expect(sku.errors).toEqual([]);
    expect(single.survey.currentSingleElement.name, "the model stands on the owner").toBe("hasPet");
    expect(single.current().name, "and the interview on the container's next input").toBe("orders");
    await single.answer({ action: "done" });
    expect(single.current().name).toBe("note");
    expect(single.data).toEqual({ hasPet: "Yes", petName: "Rex", orders: [{ sku: "A" }] });

    const batch = await createInterview({ elements: [hasPet([{ ...ORDERS, panelCount: 0 }]), NOTE] });
    await batch.answerAll({ hasPet: "Yes" });
    const record = recordOf(batch, "orders");
    expect(record.template.map(field => field.name)).toEqual(["sku"]);
    expect(record.canAdd).toBe(true);
    const res = await batch.answerAll({ orders: [{ sku: "A" }] });
    expect(res.errors).toEqual([]);
    expect(batch.data).toEqual({ hasPet: "Yes", orders: [{ sku: "A" }] });
  });

  test("A matrix dropdown inside a choice: rows at the root, its cells as items", async () => {
    const json = { elements: [hasPet([MATRIX])] };
    const single = await createInterview(json);
    await single.answer("Yes");
    expect(single.current().name).toBe("matrix.row1.column1");
    await single.answer("v");
    expect(single.data).toEqual({ hasPet: "Yes", matrix: { row1: { column1: "v" } } });

    const batch = await createInterview(json);
    await batch.answerAll({ hasPet: "Yes" });
    expect(recordOf(batch, "matrix").rows.map(row => row.name)).toEqual(["row1"]);
    const res = await batch.answerAll({ matrix: { row1: { column1: "w" } } });
    expect(res.errors).toEqual([]);
    expect(batch.data).toEqual({ hasPet: "Yes", matrix: { row1: { column1: "w" } } });
  });

  test("A radiogroup inside a choice: two levels of choices, bare names, the outermost owner current", async () => {
    const inner = {
      type: "radiogroup", name: "kind", title: "Kind",
      choices: [{ value: "dog", elements: [{ type: "text", name: "breed", title: "Breed" }] }, "cat"],
    };
    const iv = await createInterview({ elements: [hasPet([inner, PET_AGE]), NOTE] });
    const yes = await iv.answer("Yes");
    expect(yes.becameVisible).toEqual(["kind", "petAge"]);
    const dog = await iv.answer("dog");
    expect(dog.becameVisible).toEqual(["breed"]);
    expect(dog.current.name).toBe("breed");
    expect(iv.survey.currentSingleQuestion.name).toBe("hasPet");
    await iv.answer("Husky");
    expect(iv.current().name).toBe("petAge");
    expect(iv.data).toEqual({ hasPet: "Yes", kind: "dog", breed: "Husky" });
    expect(batchNames(iv)).toEqual(["petAge", "note"]);
    const cat = await iv.answerAll({ kind: "cat" });
    expect(cat.becameHidden).toEqual(["breed"]);
  });

  test("A detail panel of a matrix inside a choice is created by the call that selects the choice", async () => {
    const survey = new SurveyModel({
      elements: [hasPet([{
        type: "matrixdynamic", name: "items", title: "Items", rowCount: 1,
        columns: [{ name: "sku", cellType: "text" }],
        detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note", title: "Note" }],
      }])],
    });
    const matrix: any = survey.getQuestionByName("items");
    let created = 0;
    matrix.onCreateDetailPanelCallback = () => { created++; };
    const iv = await createInterview(survey);
    iv.current();
    iv.describe();
    iv.describeAll();
    expect(created, "no read creates a panel, and nothing before the choice is selected").toBe(0);
    await iv.answer("Yes");
    expect(created).toBe(1);
    expect(matrix.visibleRows[0].detailPanel).toBeTruthy();
    expect(iv.current().name).toBe("items[0].sku");
    await iv.answer("A");
    expect(iv.current().name).toBe("items[0].note");
  });

  test("A radiogroup with choice questions is a plain root in batch mode, never a container", async () => {
    const iv = await createInterview(petJson());
    const record = recordOf(iv, "hasPet");
    expect(record.fields).toBeUndefined();
    expect(record.choices.length).toBe(2);
    expect(iv.getBatchDocument().items[0].valueType).not.toBe("object");
    const res = await iv.answerAll({ hasPet: "Yes" });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ hasPet: "Yes" });
  });

  // Out of scope, pinned: the model gives the choice panel of a select question inside an entry the
  // survey as its data provider and no parent question, so its questions write to the top level of
  // data, one key shared by every entry. The interview lists them nowhere until the core scopes them
  // (ChoiceItem.setPanelSurvey, src/question_baseselect.ts); when it does, these assertions flip.
  //
  // The question is optional on purpose. The same gap leaves such a question with no page (the
  // choice panel's parent is the entry's panel, which has none), and a required one that is empty
  // makes the mode's validateSingleInput() focus it, which makes it the survey's current single
  // element and throws on the missing page - in the model, with or without the interview.
  const OPTIONAL_PET_NAME = { type: "text", name: "petName", title: "Pet name" };

  test("A select question with choice questions inside a dynamic panel keeps them out", async () => {
    const iv = await createInterview({
      elements: [{
        type: "paneldynamic", name: "orders", panelCount: 1, templateElements: [hasPet([OPTIONAL_PET_NAME])],
      }],
    });
    expect(iv.current().name).toBe("orders[0].hasPet");
    const yes = await iv.answer("orders[0].hasPet", "Yes");
    expect(yes.errors).toEqual([]);
    expect(yes.becameVisible).toEqual([]);
    expect(iv.current().name).not.toBe("petName");
    expect(iv.describe()).not.toContain("petName");
    expect(iv.describeAll()).not.toContain("petName");
    const batch = await iv.answerAll({ petName: "x" });
    expect(batch.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("A select question with choice questions inside a detail panel keeps them out", async () => {
    const iv = await createInterview({
      elements: [{
        type: "matrixdynamic", name: "items", rowCount: 1, columns: [{ name: "sku", cellType: "text" }],
        detailPanelMode: "underRow", detailElements: [hasPet([OPTIONAL_PET_NAME])],
      }],
    });
    const yes = await iv.answer("items[0].hasPet", "Yes");
    expect(yes.errors).toEqual([]);
    expect(yes.becameVisible).toEqual([]);
    expect(iv.describe()).not.toContain("petName");
    expect(iv.describeAll()).not.toContain("petName");
    const batch = await iv.answerAll({ petName: "x" });
    expect(batch.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("A visibleIf inside a choice reads the other questions of the choice", async () => {
    const iv = await createInterview({
      elements: [hasPet([PET_NAME, { ...PET_AGE, visibleIf: "{petName} = 'Rex'" }]), NOTE],
    });
    const yes = await iv.answer("Yes");
    expect(yes.becameVisible).toEqual(["petName"]);
    const rex = await iv.answer("Rex");
    expect(rex.becameVisible).toEqual(["petAge"]);
    expect(rex.current.name).toBe("petAge");
  });

  test("A static panel inside a choice: its questions in document order", async () => {
    const iv = await createInterview({
      elements: [hasPet([{ type: "panel", name: "details", elements: [PET_NAME, PET_AGE] }]), NOTE],
    });
    const yes = await iv.answer("Yes");
    expect(yes.becameVisible).toEqual(["petName", "petAge"]);
    expect(batchNames(iv)).toEqual(["petName", "petAge", "note"]);
  });

  test("A choice whose questions are all invisible lists nothing, and the owner is answered and valid", async () => {
    const iv = await createInterview({
      elements: [hasPet([{ ...PET_NAME, visible: false }]), NOTE],
    });
    const yes = await iv.answer("Yes");
    expect(yes.becameVisible).toEqual([]);
    expect(yes.current.name).toBe("note");
    expect(batchNames(iv)).toEqual(["note"]);
  });

  // Validating the owner after a write validates the questions of its selected choices with it, which
  // would put "Response required." on a question nobody has asked for yet.
  test("Selecting a choice puts no error on the questions it reveals", async () => {
    const single = await createInterview(petJson());
    await single.answer("Yes");
    expect(single.survey.getQuestionByName("petName").errors).toEqual([]);
    expect(single.current().error).toBeUndefined();

    const batch = await createInterview(petJson());
    const yes = await batch.answerAll({ hasPet: "Yes" });
    expect(yes.errors).toEqual([]);
    expect(recordOf(batch, "petName").error).toBeUndefined();
    // What the agent did send is its own: an empty required answer is an error of the call.
    const sent = await batch.answerAll({ petName: null });
    expect(sent.errors).toEqual([{ name: "petName", message: "Response required." }]);

    const survey = new SurveyModel(petJson());
    survey.data = { hasPet: "Yes" };
    const resumed = await createInterview(survey);
    expect(resumed.current().name).toBe("petName");
    expect(resumed.current().error, "nor does validating a resumed model").toBeUndefined();

    const orders = await createInterview({ elements: [hasPet([ORDERS])] });
    await orders.answer("Yes");
    expect(orders.current().name).toBe("orders[0].sku");
    expect(orders.current().error, "nor on the input of a container inside the choice").toBeUndefined();
  });

  test("An error the question already carried stays when its choice is written again", async () => {
    const iv = await createInterview(petJson());
    await iv.answer("Yes");
    const blocked = await iv.complete();
    expect(blocked.errors).toEqual([{ name: "petName", message: "Response required." }]);
    await iv.answer("hasPet", "Yes");
    expect(iv.current().name).toBe("petName");
    expect(iv.current().error).toBe("Response required.");
  });

  // What a later model could do: list a select question's choice questions as its nested questions,
  // the way every other container lists its own. The owner stays one plain input.
  test("A radiogroup stays one input even where the model lists its choice questions as nested", async () => {
    const survey = new SurveyModel(petJson());
    const owner: any = survey.getQuestionByName("hasPet");
    const original = owner.getNestedQuestions.bind(owner);
    owner.getNestedQuestions = (visibleOnly?: boolean) =>
      original(visibleOnly, true).filter((question: any) => question !== owner);
    expect(owner.getNestedQuestions(false, false).map((question: any) => question.name)).toEqual(["petName", "petAge"]);
    const iv = await createInterview(survey);
    expect(recordOf(iv, "hasPet").fields).toBeUndefined();
    expect(recordOf(iv, "hasPet").choices.length).toBe(2);
    const yes = await iv.answerAll({ hasPet: "Yes" });
    expect(yes.errors).toEqual([]);
    expect(getInterviewInputs(survey).map(input => input.address))
      .toEqual(["hasPet", "petName", "petAge", "contacts", "note"]);
    expect(iv.current().name).toBe("petName");
  });

  // What another later model could do: put the choice questions into the page list.
  test("A question inside a choice is listed once, and only while its choice is selected", async () => {
    const survey = new SurveyModel(petJson());
    const owner: any = survey.getQuestionByName("hasPet");
    const original = survey.getAllQuestions.bind(survey);
    (<any>survey).getAllQuestions = (visibleOnly?: boolean, includeDesignTime?: boolean, includeNested?: boolean) => {
      const res: Array<Question> = original(visibleOnly, includeDesignTime, includeNested);
      const index = res.indexOf(owner);
      if (includeNested || index < 0) return res;
      return res.slice(0, index + 1).concat(owner.choices[0].panel.questions, res.slice(index + 1));
    };
    expect(survey.getAllQuestions().map(question => question.name))
      .toEqual(["hasPet", "petName", "petAge", "contacts", "note"]);
    const iv = await createInterview(survey);
    const addresses = () => getInterviewInputs(survey).map(input => input.address);
    expect(addresses()).toEqual(["hasPet", "contacts", "note"]);
    await iv.answer("Yes");
    expect(addresses()).toEqual(["hasPet", "petName", "petAge", "contacts", "note"]);
    await iv.answer("hasPet", "No");
    expect(addresses()).toEqual(["hasPet", "contacts", "note"]);
  });

  test("Localization: the title and the required error of a choice question are in the survey's locale", async () => {
    const survey = new SurveyModel({
      elements: [hasPet([{ ...PET_NAME, title: { default: "Pet name", de: "Name des Tieres" } }])],
    });
    survey.locale = "de";
    try {
      const iv = await createInterview(survey);
      const start = iv.describe();
      expect(start).toContain(lines("  choices:", "    - value: \"Yes\"", "    - value: \"No\"").trim());
      await iv.answer("Yes");
      expect(iv.describe()).toContain("  title: Name des Tieres");
      // What the locale says, not what this file believes German looks like.
      const german = (<any>surveyLocalization.locales["de"]).requiredError;
      expect(german).not.toBe("Response required.");
      const blocked = await iv.complete();
      expect(blocked.errors).toEqual([{ name: "petName", message: german }]);
    } finally {
      survey.locale = "";
    }
  });
});
