import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { ComponentCollection, QuestionCustomModel } from "../src/question_custom";

describe("A run that starts again inside itself keeps the outer run's state", () => {
  test("a value-changed handler that validates a question without its choice panels again: the outer validation skips them too", () => {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "q1",
      choices: ["a", { value: "b", elements: [{ type: "text", name: "t", isRequired: true }] }] }] });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    survey.setValue("q1", ["b", "unknown"]);
    let isInnerRun = false;
    survey.onValueChanged.add(() => {
      if (isInnerRun) return;
      isInnerRun = true;
      q1.validateWithoutChoicePanels();
    });
    expect(q1.validateWithoutChoicePanels(), "#1").toBe(true);
    expect(isInnerRun, "#2").toBe(true);
    expect(q1.choices[1].panel.getQuestionByName("t").errors.length, "#3").toBe(0);
  });
  test("a value-changed handler that sets a custom question in a dynamic panel again: each change is reported once", () => {
    ComponentCollection.Instance.add({ name: "nestedsetcustom", questionJSON: { type: "text" } });
    try {
      const survey = new SurveyModel({ elements: [
        { type: "paneldynamic", name: "q1", panelCount: 1, templateElements: [{ type: "nestedsetcustom", name: "c" }] }
      ] });
      const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
      const c = <QuestionCustomModel>q1.panels[0].getQuestionByName("c");
      let isInnerRun = false;
      survey.onValueChanged.add(() => {
        if (isInnerRun) return;
        isInnerRun = true;
        c.value = "inner";
      });
      const reported: Array<any> = [];
      survey.onDynamicPanelValueChanged.add((_, options) => { reported.push(options.value); });
      c.value = "outer";
      expect(c.value, "#1").toBe("inner");
      expect(reported, "#2").toEqual(["inner", "inner"]);
    } finally {
      ComponentCollection.Instance.remove("nestedsetcustom");
    }
  });
});
