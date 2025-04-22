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
        segmentCount: 5,
        "labels": [
          {
            "value": "left",
            "text": "Left"
          },
          {
            "value": "middle",
            "text": "Middle"
          },
          {
            "value": "right",
            "text": "Right"
          }
        ]
      },
    ],
  };

  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.labels[0].value, "left");
  assert.deepEqual(q1.labels[1].value, "middle");
  assert.deepEqual(q1.labels[2].value, "right");

  assert.deepEqual(q1.labelCount, q1.labels.length);
  assert.deepEqual(q1.step, 50);
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

QUnit.test("renderedmaxRangeLength", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        min: -50,
        max: 50
      }
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.renderedmaxRangeLength, 100);

  q1.maxRangeLength = 50;
  assert.deepEqual(q1.renderedmaxRangeLength, 50);
});

QUnit.test("renderedminRangeLength", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        step: 10
      }
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.renderedminRangeLength, 10);

  q1.minRangeLength = 20;
  assert.deepEqual(q1.renderedminRangeLength, 20);
});

QUnit.test("ensureMaxRangeBorders", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        maxRangeLength: 50,
        defaultValue: [10, 60, 110],
        min: 0,
        max: 120
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  let newValue = 11;
  let inputNumber = 0;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 11);
  newValue = 9;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 10);

  newValue = 59;
  inputNumber = 1;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 60);
  newValue = 61;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 60);

  newValue = 109;
  inputNumber = 2;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 109);
  newValue = 111;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 110);
});

QUnit.test("ensureMaxRangeBorders - allowSwap", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        maxRangeLength: 10
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  q1.value = [30, 20];

  let newValue = 31;
  let inputNumber = 0;
  newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 30);
});

QUnit.test("ensureMinRangeBorders", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        minRangeLength: 10,
        defaultValue: [30, 40, 50]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  let newValue = 29;
  let inputNumber = 0;
  newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 29);
  newValue = 31;
  newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 30);

  newValue = 39;
  inputNumber = 1;
  newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 40);
  newValue = 41;
  newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 40);

  newValue = 49;
  inputNumber = 2;
  newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 50);
  newValue = 51;
  newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
  assert.deepEqual(newValue, 51);
});

QUnit.test("getRenderedValue", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        minRangeLength: 20,
        maxRangeLength: 50,
        defaultValue: [25, 75]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  const renderedValue = q1.getRenderedValue();
  renderedValue[0] = 125;

  assert.deepEqual(q1.value[0], 25);
  assert.deepEqual(q1.getRenderedValue()[0], 25);
  assert.deepEqual(renderedValue[0], 125);
});

QUnit.test("getRenderedValue and maxRangeLength", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        maxRangeLength: 100,
        min: -100,
        max: 100
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  let renderedValue = q1.getRenderedValue();
  assert.deepEqual(renderedValue, [-50, 50]);

  q1.min = -100;
  q1.max = -40;
  q1.maxRangeLength = 20;
  renderedValue = q1.getRenderedValue();
  assert.deepEqual(renderedValue, [-80, -60]);

  q1.min = 0;
  q1.max = 100;
  q1.maxRangeLength = 20;
  renderedValue = q1.getRenderedValue();
  assert.deepEqual(renderedValue, [40, 60]);
});

QUnit.test("autoGenerate", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  assert.deepEqual(q1.autoGenerate, true);
  q1.labels = [{ text: "t", value: "v" }] as any;
  assert.deepEqual(q1.autoGenerate, false);
});
