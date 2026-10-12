import { JsonObjectProperty, Serializer } from "../src/jsonobject";
import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { PanelModel } from "../src/panel";
import { setupThemeAdapter } from "survey-core";
import { afterEach, describe, expect, test } from "vitest";

interface IPropertySnapshot {
  prop: JsonObjectProperty;
  visible: boolean;
  isSerializable: boolean;
  defaultValue: any;
}

function snapshot(className: string, propertyName: string): IPropertySnapshot {
  const prop = Serializer.findProperty(className, propertyName);
  return {
    prop: prop,
    visible: prop.visible,
    isSerializable: prop.isSerializable,
    defaultValue: prop.defaultValue,
  };
}

const snapshots = [
  snapshot("survey", "questionDescriptionLocation"),
  snapshot("survey", "questionErrorLocation"),
  snapshot("question", "descriptionLocation"),
  snapshot("question", "errorLocation"),
  snapshot("panel", "questionErrorLocation"),
];

afterEach(() => {
  for (let i = 0; i < snapshots.length; i++) {
    const item = snapshots[i];
    item.prop.visible = item.visible;
    item.prop.isSerializable = item.isSerializable;
    item.prop.defaultValue = item.defaultValue;
  }
});

describe("setupThemeAdapter", () => {
  test("bootstrap and shadcn set survey defaults and hide error location", () => {
    for (const adapter of ["bootstrap", "shadcn"] as const) {
      setupThemeAdapter(adapter);

      expect(Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue).toBe("underInput");
      expect(Serializer.findProperty("survey", "questionErrorLocation").defaultValue).toBe("bottom");

      const surveyError = Serializer.findProperty("survey", "questionErrorLocation");
      expect(surveyError.visible).toBe(false);
      expect(surveyError.isSerializable).toBe(false);

      const questionError = Serializer.findProperty("question", "errorLocation");
      expect(questionError.visible).toBe(false);
      expect(questionError.isSerializable).toBe(false);
      expect(Serializer.findProperty("text", "errorLocation")).toBe(questionError);

      const surveyDescription = Serializer.findProperty("survey", "questionDescriptionLocation");
      expect(surveyDescription.visible).toBe(true);
      expect(surveyDescription.isSerializable).toBe(true);
      const questionDescription = Serializer.findProperty("question", "descriptionLocation");
      expect(questionDescription.visible).toBe(true);
      expect(questionDescription.isSerializable).toBe(true);

      const panelError = Serializer.findProperty("panel", "questionErrorLocation");
      expect(panelError.visible).toBe(true);
      expect(panelError.isSerializable).toBe(true);

      const survey = new SurveyModel({
        elements: [{ type: "text", name: "q1", description: "Help" }],
      });
      expect(survey.questionDescriptionLocation).toBe("underInput");
      expect(survey.questionErrorLocation).toBe("bottom");
      const question = survey.getQuestionByName("q1");
      expect(question.getErrorLocation()).toBe("bottom");
      expect(question.hasDescriptionUnderInput).toBe(true);

      survey.questionErrorLocation = "top";
      survey.questionDescriptionLocation = "hidden";
      question.errorLocation = "top";
      question.descriptionLocation = "underTitle";
      const json = survey.toJSON();
      expect(json.questionErrorLocation).toBeUndefined();
      expect(json.questionDescriptionLocation).toBe("hidden");
      expect(json.pages[0].elements[0].errorLocation).toBeUndefined();
      expect(json.pages[0].elements[0].descriptionLocation).toBe("underTitle");

      const panel = new PanelModel("p1");
      panel.questionErrorLocation = "bottom";
      expect(panel.toJSON().questionErrorLocation).toBe("bottom");

      snapshots.forEach((item) => {
        item.prop.visible = item.visible;
        item.prop.isSerializable = item.isSerializable;
        item.prop.defaultValue = item.defaultValue;
      });
    }
  });

  test("mui also hides question description location", () => {
    setupThemeAdapter("mui");

    expect(Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue).toBe("underInput");
    expect(Serializer.findProperty("survey", "questionErrorLocation").defaultValue).toBe("bottom");

    const surveyDescription = Serializer.findProperty("survey", "questionDescriptionLocation");
    expect(surveyDescription.visible).toBe(false);
    expect(surveyDescription.isSerializable).toBe(false);
    const questionDescription = Serializer.findProperty("question", "descriptionLocation");
    expect(questionDescription.visible).toBe(false);
    expect(questionDescription.isSerializable).toBe(false);

    const surveyError = Serializer.findProperty("survey", "questionErrorLocation");
    expect(surveyError.visible).toBe(false);
    expect(surveyError.isSerializable).toBe(false);
    const questionError = Serializer.findProperty("question", "errorLocation");
    expect(questionError.visible).toBe(false);
    expect(questionError.isSerializable).toBe(false);

    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", description: "Help" }],
    });
    expect(survey.questionDescriptionLocation).toBe("underInput");
    expect(survey.questionErrorLocation).toBe("bottom");
    expect(survey.getQuestionByName("q1").hasDescriptionUnderInput).toBe(true);

    survey.questionDescriptionLocation = "underTitle";
    survey.questionErrorLocation = "top";
    const question = <QuestionTextModel>survey.getQuestionByName("q1");
    question.descriptionLocation = "underTitle";
    question.errorLocation = "top";
    const json = survey.toJSON();
    expect(json.questionDescriptionLocation).toBeUndefined();
    expect(json.questionErrorLocation).toBeUndefined();
    expect(json.pages[0].elements[0].descriptionLocation).toBeUndefined();
    expect(json.pages[0].elements[0].errorLocation).toBeUndefined();
  });

  test("an unknown adapter does not change serializer metadata", () => {
    setupThemeAdapter(<any>"unknown");

    expect(Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue).toBe("underTitle");
    expect(Serializer.findProperty("survey", "questionErrorLocation").defaultValue).toBe("top");
    expect(Serializer.findProperty("survey", "questionErrorLocation").visible).toBe(true);
    expect(Serializer.findProperty("survey", "questionErrorLocation").isSerializable).toBe(true);
    expect(Serializer.findProperty("question", "errorLocation").visible).toBe(true);
    expect(Serializer.findProperty("question", "descriptionLocation").visible).toBe(true);
  });
});
