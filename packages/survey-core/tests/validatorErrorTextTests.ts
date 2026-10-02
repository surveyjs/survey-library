import { SurveyModel } from "../src/survey";
import { describe, expect, test } from "vitest";

function createSurvey(errorText: string): SurveyModel {
  return new SurveyModel({
    checkErrorsMode: "onValueChanged",
    calculatedValues: [
      {
        name: "existing_item_name",
        expression: "{existing_items[0]}"
      }
    ],
    elements: [
      {
        type: "text",
        name: "selection",
        title: "Selection",
        validators: [
          {
            type: "expression",
            expression: "count({existing_items}) == 0",
            text: errorText
          }
        ]
      }
    ]
  });
}

// survey-vue3-ui useLocString caches locString.renderedHtml from onStringChanged.
function displayedByVue(survey: SurveyModel): { text: () => string, events: Array<string> } {
  const question = survey.getQuestionByName("selection");
  survey.setVariable("existing_items", ["Item A"]);
  const error = question.errors[0];
  const events: Array<string> = [];
  let text = error.locText.renderedHtml;
  error.locText.onStringChanged.add((sender) => {
    text = sender.renderedHtml;
    events.push(text);
  });
  return { text: () => text, events };
}

describe("expression validator error text after setVariable", () => {
  test("calculated value in a retained error is broadcast after it updates", () => {
    const survey = createSurvey("An item already exists: {existing_item_name}");
    const question = survey.getQuestionByName("selection");
    const vue = displayedByVue(survey);
    const error = question.errors[0];

    expect(error.locText.renderedHtml).toBe("An item already exists: Item A");

    survey.setVariable("existing_items", ["Item B"]);

    expect(survey.getVariable("existing_item_name")).toBe("Item B");
    expect(question.errors[0]).toBe(error);
    expect(error.locText.renderedHtml).toBe("An item already exists: Item B");
    expect(vue.events).toEqual(["An item already exists: Item B"]);
    expect(vue.text()).toBe("An item already exists: Item B");
  });

  test("setVariables updates a retained error that interpolates a calculated value", () => {
    const survey = createSurvey("An item already exists: {existing_item_name}");
    const question = survey.getQuestionByName("selection");
    const vue = displayedByVue(survey);
    const error = question.errors[0];

    survey.setVariables({ existing_items: ["Item B"] });

    expect(question.errors[0]).toBe(error);
    expect(vue.text()).toBe("An item already exists: Item B");
  });

  test("direct source variable in the error text is broadcast with the new value", () => {
    const survey = createSurvey("An item already exists: {existing_items}");
    const vue = displayedByVue(survey);

    survey.setVariable("existing_items", ["Item B"]);

    expect(vue.events[vue.events.length - 1]).toContain("Item B");
    expect(vue.text()).toContain("Item B");
  });
});
