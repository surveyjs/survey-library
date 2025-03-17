import { QuestionRangeSlider } from "../src/question_range_slider";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question range slider");

QUnit.only("check allowhover class in design mode", (assert) => {
  var json = {
    questions: [
      {
        type: "rangeslider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRangeSlider>survey.getQuestionByName("q1");
  assert.equal(q1.value, null);
});