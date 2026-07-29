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
