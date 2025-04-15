import { QuestionSliderModel } from "../src/question_slider";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question slider");

QUnit.test("check value", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, []);

  q1.value = [1, 3];
  assert.deepEqual(q1.value, [1, 3]);
});

QUnit.test("check getType", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.equal(q1.getType(), "slider");
});

QUnit.test("check defaultValue", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        defaultValue: [1, 3]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, [1, 3]);
});

QUnit.test("check css", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.rootCss, "sd-slider");
});

QUnit.test("segmentCount", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        segmentCount: 5,
        min: 0,
        max: 100,
        step: 10
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.segmentCount, 5);
  assert.deepEqual(q1.step, 20);
  q1.segmentCount = null;
  assert.deepEqual(q1.segmentCount, null);
  assert.deepEqual(q1.step, 10);
});

QUnit.test("step", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1"
      },
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.step, 1);

  json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        min: 100,
        max: 200,
        step: 10
      },
    ],
  };
  survey = new SurveyModel(json);
  q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.step, 10);
});

QUnit.test("labelCount", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1"
      },
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.labelCount, 6);

  json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        min: 0,
        max: 100,
        tickPercent: 25
      },
    ],
  };
  survey = new SurveyModel(json);
  q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.labelCount, 4 + 2);
});

QUnit.test("labels (custom)", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        labels: [
          {
            text: "one",
            value: 1
          },
          {
            text: "two",
            value: 2
          }
        ]
      },
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.labels[0].value, 1);
  assert.deepEqual(q1.labels[1].value, 2);
  assert.deepEqual(q1.labelCount, q1.labels.length);
});

QUnit.test("sliderType", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
      },
      {
        type: "slider",
        name: "q2",
        sliderType: "single"
      },
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  let q2 = <QuestionSliderModel>survey.getQuestionByName("q2");
  assert.deepEqual(q1.sliderType, "range");
  assert.deepEqual(q2.sliderType, "single");
});

QUnit.test("showLabels", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
      }
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.showLabels, true);
});