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
  choices: Array<any>;
}

function snapshot(className: string, propertyName: string): IPropertySnapshot {
  const prop = Serializer.findProperty(className, propertyName);
  return {
    prop: prop,
    visible: prop.visible,
    isSerializable: prop.isSerializable,
    defaultValue: prop.defaultValue,
    choices: prop.getChoices(null),
  };
}

const snapshots = [
  snapshot("survey", "questionDescriptionLocation"),
  snapshot("survey", "questionErrorLocation"),
  snapshot("survey", "questionTitleLocation"),
  snapshot("question", "descriptionLocation"),
  snapshot("question", "errorLocation"),
  snapshot("question", "titleLocation"),
  snapshot("panel", "questionErrorLocation"),
];

function restoreSnapshots(): void {
  snapshots.forEach((item) => {
    item.prop.visible = item.visible;
    item.prop.isSerializable = item.isSerializable;
    item.prop.defaultValue = item.defaultValue;
    item.prop.setChoices(item.choices);
  });
}

afterEach(restoreSnapshots);

function expectHidden(className: string, propertyName: string): void {
  const prop = Serializer.findProperty(className, propertyName);
  expect(prop.visible, className + "." + propertyName + " visible").toBe(false);
  expect(prop.isSerializable, className + "." + propertyName + " isSerializable").toBe(false);
}

function expectVisible(className: string, propertyName: string): void {
  const prop = Serializer.findProperty(className, propertyName);
  expect(prop.visible, className + "." + propertyName + " visible").toBe(true);
  expect(prop.isSerializable, className + "." + propertyName + " isSerializable").toBe(true);
}

describe("setupThemeAdapter", () => {
  test("bootstrap and shadcn set survey defaults and hide error location", () => {
    for (const adapter of ["bootstrap", "shadcn"] as const) {
      setupThemeAdapter(adapter);

      expect(Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue).toBe("underInput");
      expect(Serializer.findProperty("survey", "questionErrorLocation").defaultValue).toBe("bottom");

      expectHidden("survey", "questionErrorLocation");
      expectHidden("question", "errorLocation");
      expect(Serializer.findProperty("text", "errorLocation")).toBe(Serializer.findProperty("question", "errorLocation"));

      expectVisible("survey", "questionDescriptionLocation");
      expectVisible("question", "descriptionLocation");
      expectVisible("survey", "questionTitleLocation");
      expectVisible("question", "titleLocation");
      expectVisible("panel", "questionErrorLocation");

      expect(Serializer.findProperty("survey", "questionDescriptionLocation").getChoices(null)).toEqual(["underInput", "underTitle", "hidden"]);
      expect(Serializer.findProperty("question", "descriptionLocation").getChoices(null)).toEqual(["default", "underInput", "underTitle", "hidden"]);

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
      survey.questionTitleLocation = "bottom";
      question.errorLocation = "top";
      question.descriptionLocation = "underTitle";
      question.titleLocation = "left";
      const json = survey.toJSON();
      expect(json.questionErrorLocation).toBeUndefined();
      expect(json.questionDescriptionLocation).toBe("hidden");
      expect(json.questionTitleLocation).toBe("bottom");
      expect(json.pages[0].elements[0].errorLocation).toBeUndefined();
      expect(json.pages[0].elements[0].descriptionLocation).toBe("underTitle");
      expect(json.pages[0].elements[0].titleLocation).toBe("left");

      const panel = new PanelModel("p1");
      panel.questionErrorLocation = "bottom";
      expect(panel.toJSON().questionErrorLocation).toBe("bottom");

      restoreSnapshots();
    }
  });

  test("mui hides title location and removes the underTitle description choice", () => {
    setupThemeAdapter("mui");

    expect(Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue).toBe("underInput");
    expect(Serializer.findProperty("survey", "questionErrorLocation").defaultValue).toBe("bottom");

    expectHidden("survey", "questionErrorLocation");
    expectHidden("question", "errorLocation");
    expectHidden("survey", "questionTitleLocation");
    expectHidden("question", "titleLocation");

    expectVisible("survey", "questionDescriptionLocation");
    expectVisible("question", "descriptionLocation");
    expect(Serializer.findProperty("survey", "questionDescriptionLocation").getChoices(null)).toEqual(["underInput", "hidden"]);
    expect(Serializer.findProperty("question", "descriptionLocation").getChoices(null)).toEqual(["default", "underInput", "hidden"]);

    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", description: "Help" }],
    });
    expect(survey.questionDescriptionLocation).toBe("underInput");
    expect(survey.questionErrorLocation).toBe("bottom");
    expect(survey.getQuestionByName("q1").hasDescriptionUnderInput).toBe(true);

    survey.questionDescriptionLocation = "hidden";
    survey.questionErrorLocation = "top";
    survey.questionTitleLocation = "bottom";
    const question = <QuestionTextModel>survey.getQuestionByName("q1");
    question.descriptionLocation = "hidden";
    question.errorLocation = "top";
    question.titleLocation = "left";
    const json = survey.toJSON();
    expect(json.questionDescriptionLocation).toBe("hidden");
    expect(json.questionErrorLocation).toBeUndefined();
    expect(json.questionTitleLocation).toBeUndefined();
    expect(json.pages[0].elements[0].descriptionLocation).toBe("hidden");
    expect(json.pages[0].elements[0].errorLocation).toBeUndefined();
    expect(json.pages[0].elements[0].titleLocation).toBeUndefined();
  });

  test("an unknown adapter does not change serializer metadata", () => {
    setupThemeAdapter(<any>"unknown");

    expect(Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue).toBe("underTitle");
    expect(Serializer.findProperty("survey", "questionErrorLocation").defaultValue).toBe("top");
    expectVisible("survey", "questionErrorLocation");
    expectVisible("survey", "questionTitleLocation");
    expectVisible("question", "errorLocation");
    expectVisible("question", "descriptionLocation");
    expectVisible("question", "titleLocation");
    expect(Serializer.findProperty("question", "descriptionLocation").getChoices(null)).toEqual(["default", "underInput", "underTitle", "hidden"]);
  });
});
