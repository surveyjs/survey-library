import { QuestionRangeSlider } from "../src/question_range_slider";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question range slider");

QUnit.test("check value", (assert) => {
  var json = {
    elements: [
      {
        type: "rangeslider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRangeSlider>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, []);

  q1.value = [1, 3];
  assert.deepEqual(q1.value, [1, 3]);
});

QUnit.test("check getType", (assert) => {
  var json = {
    elements: [
      {
        type: "rangeslider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRangeSlider>survey.getQuestionByName("q1");
  assert.equal(q1.getType(), "rangeslider");
});

QUnit.test("check defaultValue", (assert) => {
  var json = {
    elements: [
      {
        type: "rangeslider",
        name: "q1",
        defaultValue: [1, 3]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRangeSlider>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, [1, 3]);
});

QUnit.test("check css", (assert) => {
  var json = {
    elements: [
      {
        type: "rangeslider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRangeSlider>survey.getQuestionByName("q1");
  assert.deepEqual(q1.rootCss, "sd-range-slider");
});