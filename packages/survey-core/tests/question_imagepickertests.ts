import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { settings } from "../src/settings";
import { SurveyModel } from "../src/survey";

QUnit.test("Items number in run-time and design-time", function (assert) {

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
  assert.equal(q1.visibleChoices.length, 3, "There are 3 items in run-time");
  assert.equal(q2.visibleChoices.length, 4, "There are 4 items in design-time");
});

QUnit.test("ImagePicker itemFlowDirection should be row by default", (assert) => {
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
  assert.deepEqual(getValuesInColumns(q), [["Image 1", "Image 3"], ["Image 2", "Image 4"]]);
});