import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { settings } from "../src/settings";
import { SurveyModel } from "../src/survey";

QUnit.test("Items number in run-time and design-time", function (assert) {
  settings.supportCreatorV2 = true;
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
  settings.supportCreatorV2 = false;
});