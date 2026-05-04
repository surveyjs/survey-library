import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { settings } from "../src/settings";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
test("Items number in run-time and design-time", () => {

  const json = {
    elements: [
      { type: "imagepicker", name: "q", choices: ["a", "b", "c"] }
    ]
  };
  const survey1 = new SurveyModel(json);
  const q1 = <QuestionImagePickerModel>survey1.getQuestionByName("q");
  const survey2 = new SurveyModel();
  survey2.setDesignMode(true);
  survey2.fromJSON(json);
  const q2 = <QuestionImagePickerModel>survey2.getQuestionByName("q");
  expect(q1.visibleChoices.length, "There are 3 items in run-time").toBe(3);
  expect(q2.visibleChoices.length, "There are 4 items in design-time").toBe(4);
});

test("ImagePicker itemFlowDirection should be row by default", () => {
  const json = {
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "imagepicker",
            "name": "question1",
            "colCount": 2,
            "choices": [
              {
                "value": "Image 1",
                "imageLink": "#1"
              },
              {
                "value": "Image 2",
                "imageLink": "#2"
              },
              {
                "value": "Image 3",
                "imageLink": "#3"
              },
              {
                "value": "Image 4",
                "imageLink": "#4"
              }
            ]
          }
        ]
      }
    ]
  };
  function getValuesInColumns(question: QuestionImagePickerModel) {
    return question.columns.map((column) => column.map((choice) => choice.id));
  }
  const survey1 = new SurveyModel(json);
  const q = <QuestionImagePickerModel>survey1.getAllQuestions()[0];
  expect(getValuesInColumns(q)).toEqual([["Image 1", "Image 3"], ["Image 2", "Image 4"]]);
});