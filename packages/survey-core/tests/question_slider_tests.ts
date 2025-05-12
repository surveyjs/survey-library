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

QUnit.test("customLabels", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        segmentCount: 5,
        "customLabels": [
          {
            "value": 0,
            "text": "Left"
          },
          {
            "value": 50,
            "text": "Middle"
          },
          {
            "value": 100,
            "text": "Right"
          }
        ]
      },
    ],
  };

  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.customLabels[0].value, 0);
  assert.deepEqual(q1.customLabels[1].value, 50);
  assert.deepEqual(q1.customLabels[2].value, 100);

  assert.deepEqual(q1.labelCount, q1.customLabels.length);
  assert.deepEqual(q1.step, 20);
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

QUnit.test("renderedMaxRangeLength", (assert) => {
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
  assert.deepEqual(q1.renderedMaxRangeLength, 100);

  q1.maxRangeLength = 50;
  assert.deepEqual(q1.renderedMaxRangeLength, 50);
});

QUnit.test("renderedMinRangeLength", (assert) => {
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
  assert.deepEqual(q1.renderedMinRangeLength, 10);

  q1.minRangeLength = 20;
  assert.deepEqual(q1.renderedMinRangeLength, 20);
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

QUnit.test("ensureMinRangeBorders - allowSwap:false", (assert) => {
  const q1 = new QuestionSliderModel("q1");
  q1.allowSwap = false;
  q1.value = [10, 20, 30];

  let newValue = q1.ensureMinRangeBorders(31, 1);
  assert.deepEqual(newValue, 20, "can't cross next value");

  newValue = q1.ensureMinRangeBorders(10, 1);
  assert.deepEqual(newValue, 20, "can't cross prev value");

  newValue = q1.ensureMinRangeBorders(31, 2);
  assert.deepEqual(newValue, 31, "valid change");
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

QUnit.test("getRenderedValue: sliderType = 'single'", (assert) => {
  const q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.value = [40];
  const renderedValue = q1.getRenderedValue();
  assert.equal(renderedValue[0], 40);
  renderedValue[0] = 100;
  assert.equal(q1.value, 40);
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

// QUnit.test("autoGenerate", (assert) => {
//   let json:any = {
//     elements: [
//       {
//         type: "slider",
//         name: "q1",
//         customLabels: [{
//           text: "t",
//           value: "v"
//         }]
//       }
//     ]
//   };
//   let survey = new SurveyModel(json);
//   let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
//   q1.customLabels = [{ text: "t", value: "v" }] as any;
//   assert.deepEqual(q1.autoGenerate, false);
//   q1.autoGenerate = true;
//   assert.deepEqual(q1.autoGenerate, true);
// });

QUnit.test("getPercent", (assert) => {
  const q1 = new QuestionSliderModel("q1");
  assert.deepEqual(q1.getPercent(50), 50);
  q1.min = 0;
  q1.max = 200;
  assert.deepEqual(q1.getPercent(50), 25);
});

QUnit.test("getTrackPercentLeft and getTrackPercentRight", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.value = 75;

  assert.deepEqual(q1.getTrackPercentLeft(), 0);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.min = 50;
  assert.deepEqual(q1.getTrackPercentLeft(), 0);
  assert.deepEqual(q1.getTrackPercentRight(), 50);

  q1.value = 50;
  q1.min = -100;
  assert.deepEqual(q1.getTrackPercentLeft(), 50);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.value = -50;
  assert.deepEqual(q1.getTrackPercentLeft(), 25);
  assert.deepEqual(q1.getTrackPercentRight(), 50);

  q1.value = -75;
  q1.max = -50;
  assert.deepEqual(q1.getTrackPercentLeft(), 50);
  assert.deepEqual(q1.getTrackPercentRight(), 0);

  q1.sliderType = "range";
  q1.min = 0;
  q1.max = 100;
  q1.value = [20, 80];
  assert.deepEqual(q1.getTrackPercentLeft(), 20);
  assert.deepEqual(q1.getTrackPercentRight(), 20);

  q1.min = 10;
  q1.max = 110;
  q1.value = [35, 85];
  assert.deepEqual(q1.getTrackPercentLeft(), 25);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.min = -100;
  q1.max = 100;
  q1.value = [0, 50];
  assert.deepEqual(q1.getTrackPercentLeft(), 50);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.min = -100;
  q1.max = 100;
  q1.value = [-50, 0];
  assert.deepEqual(q1.getTrackPercentLeft(), 25);
  assert.deepEqual(q1.getTrackPercentRight(), 50);

  q1.min = -100;
  q1.max = 100;
  q1.value = [-50, 50];
  assert.deepEqual(q1.getTrackPercentLeft(), 25);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.min = -110;
  q1.max = -10;
  q1.value = [-85, -35];
  assert.deepEqual(q1.getTrackPercentLeft(), 25);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.min = -100;
  q1.max = 0;
  q1.value = [-80, -20];
  assert.deepEqual(q1.getTrackPercentLeft(), 20);
  assert.deepEqual(q1.getTrackPercentRight(), 20);
});

QUnit.test("getRenderedValue return correct initial value with negative scale", (assert) => {
  const q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.min = -100;
  q1.max = -10;
  assert.deepEqual(q1.getRenderedValue(), [-10]);

  q1.max = 100;
  assert.deepEqual(q1.getRenderedValue(), [0]);

  q1.min = 10;
  assert.deepEqual(q1.getRenderedValue(), [10]);
});

QUnit.test("getClosestToStepValue", (assert) => {
  const q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";

  q1.segmentCount = null;
  q1.min = 10;
  q1.max = 100;
  q1.step = 18;
  assert.deepEqual(q1.getClosestToStepValue(9.9), 10);
  assert.deepEqual(q1.getClosestToStepValue(10), 10);
  assert.deepEqual(q1.getClosestToStepValue(60), 64);
  assert.deepEqual(q1.getClosestToStepValue(100), 100);
  assert.deepEqual(q1.getClosestToStepValue(100.1), 100);

  q1.segmentCount = null;
  q1.min = -100;
  q1.max = -10;
  q1.step = 18;
  assert.deepEqual(q1.getClosestToStepValue(-10), -10);
  assert.deepEqual(q1.getClosestToStepValue(-20), -28);
  assert.deepEqual(q1.getClosestToStepValue(-100), -100);

  q1.segmentCount = null;
  q1.min = -90;
  q1.max = 90;
  q1.step = 18;
  assert.deepEqual(q1.getClosestToStepValue(-90), -90);
  assert.deepEqual(q1.getClosestToStepValue(-10), -18);
  assert.deepEqual(q1.getClosestToStepValue(0), 0);
  assert.deepEqual(q1.getClosestToStepValue(10), 18);
  assert.deepEqual(q1.getClosestToStepValue(90), 90);
});

QUnit.test("min>max", (assert) => {
  const q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.min = 90;
  q1.max = 10;

  assert.deepEqual(q1.renderedMin, 0, "min is default");
  assert.deepEqual(q1.renderedMax, 100, "max is default");
});

QUnit.test("allowClear", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
        allowClear: true
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.allowClear, true, "allowClear is set");

  json = {
    elements: [
      {
        type: "slider",
        name: "q1"
      }
    ]
  };
  survey = new SurveyModel(json);
  q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.allowClear, false, "allowClear is false by default");
});

QUnit.test("tooltipVisibility", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        name: "q1",
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.tooltipVisibility, "auto", "auto by default");
});