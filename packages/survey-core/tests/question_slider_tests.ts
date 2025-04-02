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

QUnit.test("snapToTicks", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        snapToTicks: true,
        step: 10
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.snapToTicks, true);
  q1.snapToTicks = false;
  assert.deepEqual(q1.snapToTicks, false);
});

QUnit.test("snapToTicks", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        snapToTicks: true,
        step: 10
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.snapToTicks, true);
  q1.snapToTicks = false;
  assert.deepEqual(q1.snapToTicks, false);
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
        ticksCount: 11,
        snapToTicks: true
      },
    ],
  };
  survey = new SurveyModel(json);
  q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.step, 10);
});

QUnit.test("ticksCount", (assert) => {
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
  assert.deepEqual(q1.ticksCount, 6);

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
  assert.deepEqual(q1.ticksCount, 4+2);
});

QUnit.test("ticks (custom)", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        ticks: [
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
  assert.deepEqual(q1.ticks[0].value, 1);
  assert.deepEqual(q1.ticks[1].value, 2);
  assert.deepEqual(q1.ticksCount, q1.ticks.length);
});