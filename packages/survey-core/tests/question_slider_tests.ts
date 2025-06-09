import { ItemValue } from "../src/itemvalue";
import { QuestionSliderModel } from "../src/question_slider";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question slider");

QUnit.test("check value", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        sliderType: "single"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.equal(q1.value, undefined);

  q1.value = 50;
  assert.deepEqual(survey.data, { q1: 50 });
});

QUnit.test("check value: range", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        name: "q1",
        sliderType: "range"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, []);

  q1.value = [20, 40];
  assert.deepEqual(survey.data, { q1: [20, 40] });
});

QUnit.test("check getType", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        sliderType: "single",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.equal(q1.getType(), "slider");
});

QUnit.test("check defaultValue: single", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        sliderType: "single",
        name: "q1",
        defaultValue: 50
      },
    ],
  };
  const survey = new SurveyModel(json);
  assert.deepEqual(survey.data, { q1: 50 });
});

QUnit.test("check defaultValue: range", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        sliderType: "range",
        name: "q1",
        defaultValue: [20, 40]
      },
    ],
  };
  const survey = new SurveyModel(json);
  assert.deepEqual(survey.data, { q1: [20, 40] });
});

QUnit.test("check css", (assert) => {
  var json = {
    elements: [
      {
        type: "slider",
        sliderType: "range",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.rootCss, "sd-slider");
});

// QUnit.test("segmentCount", (assert) => {
//   var json = {
//     elements: [
//       {
//         type: "slider",
//         sliderType: "range",
//         name: "q1",
//         segmentCount: 5,
//         min: 0,
//         max: 100,
//         step: 10
//       },
//     ],
//   };
//   const survey = new SurveyModel(json);
//   const q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
//   assert.deepEqual(q1.segmentCount, 5);
//   assert.deepEqual(q1.step, 20);
//   q1.segmentCount = null;
//   assert.deepEqual(q1.segmentCount, null);
//   assert.deepEqual(q1.step, 10);
// });

QUnit.test("step", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
        name: "q1",
        // segmentCount: 5,
        step: 20,
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
        sliderType: "range",
        name: "q1",
      },
      {
        type: "slider",
        name: "q2"
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
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
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
  q1.sliderType = "range";
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
        sliderType: "range",
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
        sliderType: "range",
        name: "q1",
        minRangeLength: 20,
        maxRangeLength: 100,
        min: -100,
        max: 100
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  let renderedValue = q1.getRenderedValue();
  assert.deepEqual(renderedValue, [-10, 10]);

  q1.min = -100;
  q1.max = -40;
  q1.maxRangeLength = 20;
  renderedValue = q1.getRenderedValue();
  assert.deepEqual(renderedValue, [-80, -60]);

  q1.max = 100;
  q1.min = 0;
  q1.maxRangeLength = 20;
  renderedValue = q1.getRenderedValue();
  assert.deepEqual(renderedValue, [40, 60]);

  q1.step = 10;
  q1.minRangeLength = 20;
  q1.maxRangeLength = 50;
  assert.deepEqual(q1.getRenderedValue(), [40, 60]);
});

QUnit.test("autoGenerate", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        sliderType: "range",
        name: "q1",
        customLabels: [{
          text: "middle",
          value: "50"
        }]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.equal(q1.autoGenerate, false);
  assert.deepEqual(q1.labelCount, 1);
  q1.autoGenerate = true;
  assert.equal(q1.autoGenerate, true);
  assert.deepEqual(q1.labelCount, 6);
});

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

  assert.deepEqual(q1.getTrackPercentLeft(), 0, "percent left is correct when single default value");
  assert.deepEqual(q1.getTrackPercentRight(), 25, "percent right is correct when single default value");

  q1.min = 50;
  assert.deepEqual(q1.getTrackPercentLeft(), 0);
  assert.deepEqual(q1.getTrackPercentRight(), 50);

  q1.value = 50;
  q1.min = -100;
  assert.deepEqual(q1.getTrackPercentLeft(), 50);
  assert.deepEqual(q1.getTrackPercentRight(), 25);

  q1.value = -50;
  assert.deepEqual(q1.getTrackPercentLeft(), 25, "percent left is correct when single value is negative");
  assert.deepEqual(q1.getTrackPercentRight(), 50, "percent right is correct when single value is negative");

  q1.value = -75;
  q1.max = -50;
  assert.deepEqual(q1.getTrackPercentLeft(), 50);
  assert.deepEqual(q1.getTrackPercentRight(), 0);

  q1.sliderType = "range";
  q1.max = 100;
  q1.min = 0;
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

  q1.max = -10;
  q1.min = -110;
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

  // q1.segmentCount = null;
  q1.min = 10;
  q1.max = 100;
  q1.step = 18;
  assert.deepEqual(q1.getClosestToStepValue(9.9), 10);
  assert.deepEqual(q1.getClosestToStepValue(10), 10);
  assert.deepEqual(q1.getClosestToStepValue(60), 64);
  assert.deepEqual(q1.getClosestToStepValue(100), 100);
  assert.deepEqual(q1.getClosestToStepValue(100.1), 100);

  // q1.segmentCount = null;
  q1.min = -100;
  q1.max = -10;
  q1.step = 18;
  assert.deepEqual(q1.getClosestToStepValue(-10), -10);
  assert.deepEqual(q1.getClosestToStepValue(-20), -28);
  assert.deepEqual(q1.getClosestToStepValue(-100), -100);

  // q1.segmentCount = null;
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

  assert.deepEqual(q1.min, 90, "min is set");
  assert.deepEqual(q1.max, 91, "max < min is set to min + step");

  q1.min = 90;
  q1.max = 90;
  assert.deepEqual(q1.max, 91, "max = min is set to min + step");
});

QUnit.test("allowClear", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        sliderType: "range",
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
        sliderType: "range",
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
        sliderType: "range",
        name: "q1",
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.tooltipVisibility, "auto", "auto by default");
});

QUnit.test("incorrect value shoudn't lead to js error", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "range";
  q1.value = 10;
  assert.deepEqual(q1.getRenderedValue(), [0, 100]);
});

QUnit.test("getLabelPosition", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  assert.equal(q1.labelCount, 6);
  assert.deepEqual(q1.getLabelPosition(0), 0);
  assert.deepEqual(q1.getLabelPosition(1), 20);
});

QUnit.test("setSliderValue", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.setSliderValue(50);
  assert.equal(q1.value, 50);
  q1.setSliderValue([50]);
  assert.equal(q1.value, 50);
  q1.setSliderValue([50, 60]);
  assert.equal(q1.value, 50);

  q1.sliderType = "range";
  q1.setSliderValue([50, 60]);
  assert.deepEqual(q1.value, [50, 60]);
});

QUnit.test("sliderType='single' but defaultValue is array", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.defaultValue = [50, 60];
  assert.equal(q1.getRenderedValue(), 50, "rendered value is ok");
  assert.equal(q1.value, 50, "value is ok");
});

QUnit.test("disable allowSwap when minRangeLength is set", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "range";
  assert.equal(q1.allowSwap, true, "default");
  q1.minRangeLength = 20;
  assert.equal(q1.allowSwap, false, "disabled due to minRangeLength");
});

QUnit.test("auto generated labels", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  (<any>q1.generatedLabels).customTag = "#1";
  assert.equal(q1.generatedLabels.length, 6, "generated labels #1");
  q1.max = 120;
  assert.equal(q1.generatedLabels.length, 6, "generated labels #2");
  assert.equal((<any>q1.generatedLabels).customTag, "#1", "custom tag #2");
  q1.autoGenerate = false;
  assert.equal(q1.generatedLabels.length, 6, "generated labels #3");
  assert.equal((<any>q1.generatedLabels).customTag, "#1", "custom tag #3");
  q1.autoGenerate = true;
  assert.equal(q1.generatedLabels.length, 6, "generated labels #4");
  assert.equal((<any>q1.generatedLabels).customTag, "#1", "custom tag #4");
});

QUnit.test("formatNumber", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "range";
  q1.max = 30;
  q1.step = 0.1;
  assert.equal(q1.getTooltipValue(1), 30);
});

QUnit.test("setNewValue", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.sliderType = "single";
  q1.max = 100;
  q1.value = 110;
  assert.equal(q1.getRenderedValue(), 100);
  assert.equal(q1.value, 100);
  assert.equal(q1.isIndeterminate, false);
});

QUnit.test("check valueName", (assert) => {
  let json:any = {
    elements: [
      {
        type: "slider",
        sliderType: "single",
        name: "q1",
        valueName: "q2",
      },
      {
        type: "text",
        name: "q2"
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  let q2 = <QuestionSliderModel>survey.getQuestionByName("q2");
  assert.deepEqual(q1.getRenderedValue(), [0], "indeterminate state");
  assert.equal(q1.isIndeterminate, true);
  q2.value = 110;
  assert.deepEqual(q1.value, 100, "slider value respect max");
  q2.value = -100;
  assert.deepEqual(q1.value, 0, "slider value respect min");
  assert.equal(q1.isIndeterminate, false);
});

QUnit.test("check if customLabels produces correct renderedLabels", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.max = 1000;
  q1.autoGenerate = false;
  q1.customLabels = [new ItemValue(500, "middle")];
  assert.deepEqual(q1.renderedLabels[0].text, "middle", "text is correct");
  assert.deepEqual(q1.renderedLabels[0].value, 500, "value is correct");
});

QUnit.test("check if generated and custom labels correct when min and max are set", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.min = 50;
  q1.max = 150;
  assert.deepEqual(q1.generatedLabels.map(l=>l.value), [50, 70, 90, 110, 130, 150], "generated label values are correct");
  q1.autoGenerate = false;
  assert.deepEqual(q1.customLabels.map(l=>l.value), [50, 70, 90, 110, 130, 150], "custom label values are correct");
});

QUnit.test("check if autoGenerated labels correct when max is set", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.max = 1000;
  assert.equal(q1.renderedLabels[q1.renderedLabels.length - 1].value, 1000, "auto generated label values are correct");
});

QUnit.test("check labelFormat for autogenerated", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.min = 50;
  q1.max = 100;
  q1.labelFormat = "{0} %";
  assert.deepEqual(q1.renderedLabels.map(l=>l.locText.renderedHtml), ["50 %", "60 %", "70 %", "80 %", "90 %", "100 %"], "labelFormat");
});

QUnit.test("check labelFormat for custom labels", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.min = 50;
  q1.max = 100;
  q1.labelFormat = "{0} %";
  q1.autoGenerate = false;
  assert.deepEqual(q1.customLabels.map(l=>l.locText.textOrHtml), ["50 %", "60 %", "70 %", "80 %", "90 %", "100 %"], "labelFormat");
  q1.labelFormat = "{0} $";
  assert.deepEqual(q1.customLabels.map(l=>l.locText.textOrHtml), ["50 $", "60 $", "70 $", "80 $", "90 $", "100 $"], "labelFormat");
});

QUnit.test("labelFormat", (assert) => {
  let json:any = {
    elements: [
      {
        "type": "slider",
        "sliderType": "single",
        "name": "q1",
        "customLabels": [
          {
            "value": 0,
            "text": "begin"
          },
          {
            "value": 50,
            "text": "50"
          },
          100
        ],
        "labelFormat": "{0}%"
      }
    ]
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
  assert.equal(q1.renderedLabels[0].locText.renderedHtml, "begin");
  assert.equal(q1.renderedLabels[1].locText.renderedHtml, "50");
  assert.equal(q1.renderedLabels[2].locText.renderedHtml, "100%");
});

QUnit.test("check labelCount=1 works correctly", (assert) => {
  let q1 = new QuestionSliderModel("q1");
  q1.labelCount = 1;
  q1.autoGenerate = false;
  assert.equal(q1.renderedLabels[0].value, 0);
  assert.equal(q1.renderedLabels[0].text, "0");
});