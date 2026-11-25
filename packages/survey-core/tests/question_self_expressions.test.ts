import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import "../src/question_text";

describe("{self} in a question's own conditions", () => {
  test("visibleIf, enableIf and requiredIf with {self} run when the question value changes", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visibleIf: "{self} != 3" },
        { type: "text", name: "q2", enableIf: "{self} != 2" },
        { type: "text", name: "q3", requiredIf: "{self} = 1" },
        { type: "text", name: "q4" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q1.isVisible, "q1 is visible on load").toBe(true);
    expect(q2.isReadOnly, "q2 is enabled on load").toBe(false);
    expect(q3.isRequired, "q3 is not required on load").toBe(false);
    q1.value = 3;
    expect(q1.isVisible, "q1 = 3").toBe(false);
    q1.value = 1;
    expect(q1.isVisible, "q1 = 1").toBe(true);
    q2.value = 2;
    expect(q2.isReadOnly, "q2 = 2").toBe(true);
    q2.value = 1;
    expect(q2.isReadOnly, "q2 = 1").toBe(false);
    q3.value = 1;
    expect(q3.isRequired, "q3 = 1").toBe(true);
    survey.setValue("q4", "a");
    expect(q3.isRequired, "a change of another question keeps q3 required").toBe(true);
    q3.value = 2;
    expect(q3.isRequired, "q3 = 2").toBe(false);
  });
  test("{self} in a dynamic panel question's visibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "dp", panelCount: 1,
          templateElements: [{ type: "text", name: "q1", visibleIf: "{self} != 3" }] }
      ]
    });
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0];
    const q1 = panel.getQuestionByName("q1");
    expect(q1.isVisible, "q1 is visible on load").toBe(true);
    q1.value = 3;
    expect(q1.isVisible, "q1 = 3").toBe(false);
    q1.value = 1;
    expect(q1.isVisible, "q1 = 1").toBe(true);
  });
});
