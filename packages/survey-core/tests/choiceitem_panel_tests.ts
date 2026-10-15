import { test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";

test("ChoiceItem panel re-links to the survey when the owner is attached after the panel was created", () => {
  // Reproduces the state after a question type conversion: the question (and its choice
  // panels) is built via fromJSON while still detached, then attached to the survey.
  const q = new QuestionRadiogroupModel("q1");
  q.fromJSON({
    type: "radiogroup", name: "q1",
    choices: ["item1", { value: "item2", elements: [{ type: "text", name: "nested1" }] }]
  });
  const item: any = q.choices[1];
  expect(item.isPanelCreated).toBeTruthy();
  expect(item.panel.survey).toBeFalsy();

  const survey = new SurveyModel();
  survey.addNewPage("p1").addQuestion(q);

  // Accessing the panel after the owner has a survey must re-link it so it can render.
  expect(item.panel.survey).toBeTruthy();
  expect(item.panel.elements).toHaveLength(1);
  expect(item.panel.elements[0].name).toEqual("nested1");
});

test("The questions of a choice panel that is not showing hold their values, and lose them on complete as typed ones do", () => {
  const json = { elements: [{ type: "checkbox", name: "q", choices: [{ value: "a", elements: [{ type: "text", name: "inner" }] }, "b"] }] };
  const loaded = new SurveyModel(json);
  loaded.data = { q: ["b"], inner: "z" };
  const inner = (<any>loaded.getQuestionByName("q")).choices[0].panel.getQuestionByName("inner");
  expect(inner.value, "loaded from the data").toBe("z");
  loaded.doComplete();
  expect(loaded.data, "cleared on complete").toEqual({ q: ["b"] });

  const typed = new SurveyModel(json);
  typed.setValue("q", ["a"]);
  (<any>typed.getQuestionByName("q")).choices[0].panel.getQuestionByName("inner").value = "z";
  typed.setValue("q", ["b"]);
  typed.doComplete();
  expect(typed.data, "a typed value is cleared on complete").toEqual({ q: ["b"] });

  const kept = new SurveyModel(json);
  kept.clearInvisibleValues = "none";
  kept.data = { q: ["b"], inner: "z" };
  kept.doComplete();
  expect(kept.data, "clearInvisibleValues: none keeps it").toEqual({ q: ["b"], inner: "z" });
});
