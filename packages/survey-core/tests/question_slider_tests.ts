import { QuestionSliderModel, SliderLabelItemValue } from "../src/question_slider";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("question slider", () => {
  test("check value", () => {
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
    expect(q1.value).toLooseEqual(undefined);

    q1.value = 50;
    expect(survey.data).toEqualValues({ q1: 50 });
  });

  test("check value: range", () => {
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
    expect(q1.value).toEqualValues([]);

    q1.value = [20, 40];
    expect(survey.data).toEqualValues({ q1: [20, 40] });
  });

  test("check getType", () => {
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
    expect(q1.getType()).toLooseEqual("slider");
  });

  test("check defaultValue: single", () => {
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
    expect(survey.data).toEqualValues({ q1: 50 });
  });

  test("check defaultValue: range", () => {
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
    expect(survey.data).toEqualValues({ q1: [20, 40] });
  });

  test("check css", () => {
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
    expect(q1.rootCss).toEqualValues("sd-slider");
    q1.tooltipVisibility = "always";
    expect(q1.rootCss).toEqualValues("sd-slider sd-slider--tooltips-always-mode");
    q1.tooltipVisibility = "never";
    expect(q1.rootCss).toEqualValues("sd-slider");
  });

  // test("segmentCount", () => {
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
  //   expect(q1.segmentCount).toEqualValues(5);
  //   expect(q1.step).toEqualValues(20);
  //   q1.segmentCount = null;
  //   expect(q1.segmentCount).toEqualValues(null);
  //   expect(q1.step).toEqualValues(10);
  // });

  test("step", () => {
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
    expect(q1.step).toEqualValues(1);

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

    expect(q1.step).toEqualValues(10);
  });

  test("labelCount", () => {
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
    expect(q1.labelCount, "default labelCount").toLooseEqual(-1);
    expect(q1.renderedLabelCount, "default renderedLabelCount").toLooseEqual(6);

    json = {
      elements: [
        {
          type: "slider",
          sliderType: "range",
          name: "q1",
          min: 0,
          max: 100,
          customLabels: [{}, {}, {}]
        },
      ],
    };
    survey = new SurveyModel(json);
    q1 = <QuestionSliderModel>survey.getQuestionByName("q1");
    expect(q1.renderedLabelCount).toEqualValues(3);
  });

  test("customLabels", () => {
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
    expect(q1.customLabels[0].value).toEqualValues(0);
    expect(q1.customLabels[1].value).toEqualValues(50);
    expect(q1.customLabels[2].value).toEqualValues(100);

    expect(q1.labelCount).toEqualValues(q1.customLabels.length);
    expect(q1.step).toEqualValues(20);
  });

  test("sliderType", () => {
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
    expect(q1.sliderType).toEqualValues("range");
    expect(q2.sliderType).toEqualValues("single");
  });

  test("showLabels", () => {
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
    expect(q1.showLabels).toEqualValues(true);
  });

  test("renderedMaxRangeLength", () => {
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
    expect(q1.renderedMaxRangeLength).toEqualValues(100);

    q1.maxRangeLength = 50;
    expect(q1.renderedMaxRangeLength).toEqualValues(50);
  });

  test("renderedMinRangeLength", () => {
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
    expect(q1.renderedMinRangeLength).toEqualValues(10);

    q1.minRangeLength = 20;
    expect(q1.renderedMinRangeLength).toEqualValues(20);
  });

  test("ensureMaxRangeBorders", () => {
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
    expect(newValue).toEqualValues(11);
    newValue = 9;
    newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(10);

    newValue = 59;
    inputNumber = 1;
    newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(60);
    newValue = 61;
    newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(60);

    newValue = 109;
    inputNumber = 2;
    newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(109);
    newValue = 111;
    newValue = q1.ensureMaxRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(110);
  });

  test("ensureMaxRangeBorders - allowSwap", () => {
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
    expect(newValue).toEqualValues(30);
  });

  test("ensureMinRangeBorders", () => {
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
    expect(newValue).toEqualValues(29);
    newValue = 31;
    newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(30);

    newValue = 39;
    inputNumber = 1;
    newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(40);
    newValue = 41;
    newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(40);

    newValue = 49;
    inputNumber = 2;
    newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(50);
    newValue = 51;
    newValue = q1.ensureMinRangeBorders(newValue, inputNumber);
    expect(newValue).toEqualValues(51);
  });

  test("ensureMinRangeBorders - allowSwap:false", () => {
    const q1 = new QuestionSliderModel("q1");
    q1.sliderType = "range";
    q1.allowSwap = false;
    q1.value = [10, 20, 30];

    let newValue = q1.ensureMinRangeBorders(31, 1);
    expect(newValue, "can't cross next value").toEqualValues(20);

    newValue = q1.ensureMinRangeBorders(10, 1);
    expect(newValue, "can't cross prev value").toEqualValues(20);

    newValue = q1.ensureMinRangeBorders(31, 2);
    expect(newValue, "valid change").toEqualValues(31);
  });

  test("renderedValue", () => {
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
    expect(q1.renderedValue, "renderedValue with indeterminate state").toEqualValues([0, 100]);
    q1.maxRangeLength = 20;
    expect(q1.renderedValue, "renderedValue doesn't break maxRangeLength with indeterminate state").toEqualValues([40, 60]);
  });

  test("renderedValue: sliderType = 'single'", () => {
    const q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.value = [40];
    const renderedValue = q1.renderedValue;
    expect(renderedValue[0]).toLooseEqual(40);
    renderedValue[0] = 100;
    expect(q1.value).toLooseEqual(40);
  });

  test("renderedValue and maxRangeLength", () => {
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
    let renderedValue = q1.renderedValue;
    expect(renderedValue).toEqualValues([-50, 50]);

    q1.min = -100;
    q1.max = -40;
    q1.maxRangeLength = 20;
    renderedValue = q1.renderedValue;
    expect(renderedValue).toEqualValues([-80, -60]);

    q1.max = 100;
    q1.min = 0;
    q1.maxRangeLength = 20;
    renderedValue = q1.renderedValue;
    expect(renderedValue).toEqualValues([40, 60]);

    q1.step = 10;
    q1.minRangeLength = 20;
    q1.maxRangeLength = 50;
    expect(q1.renderedValue).toEqualValues([30, 80]);
  });

  test("autoGenerate", () => {
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
    expect(q1.autoGenerate).toLooseEqual(false);
    expect(q1.labelCount).toEqualValues(1);
    q1.autoGenerate = true;
    expect(q1.autoGenerate).toLooseEqual(true);
    expect(q1.labelCount).toEqualValues(-1);
  });

  test("getPercent", () => {
    const q1 = new QuestionSliderModel("q1");
    expect(q1.getPercent(50)).toEqualValues(50);
    q1.min = 0;
    q1.max = 200;
    expect(q1.getPercent(50)).toEqualValues(25);
  });

  test("getTrackPercentLeft and getTrackPercentRight", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.value = 75;

    expect(q1.getTrackPercentLeft(), "percent left is correct when single default value").toEqualValues(0);
    expect(q1.getTrackPercentRight(), "percent right is correct when single default value").toEqualValues(25);

    q1.min = 50;
    expect(q1.getTrackPercentLeft()).toEqualValues(0);
    expect(q1.getTrackPercentRight()).toEqualValues(50);

    q1.value = 50;
    q1.min = -100;
    expect(q1.getTrackPercentLeft()).toEqualValues(50);
    expect(q1.getTrackPercentRight()).toEqualValues(25);

    q1.value = -50;
    expect(q1.getTrackPercentLeft(), "percent left is correct when single value is negative").toEqualValues(25);
    expect(q1.getTrackPercentRight(), "percent right is correct when single value is negative").toEqualValues(50);

    q1.value = -75;
    q1.max = -50;
    expect(q1.getTrackPercentLeft()).toEqualValues(50);
    expect(q1.getTrackPercentRight()).toEqualValues(0);

    q1.sliderType = "range";
    q1.max = 100;
    q1.min = 0;
    q1.value = [20, 80];
    expect(q1.getTrackPercentLeft()).toEqualValues(20);
    expect(q1.getTrackPercentRight()).toEqualValues(20);

    q1.min = 10;
    q1.max = 110;
    q1.value = [35, 85];
    expect(q1.getTrackPercentLeft()).toEqualValues(25);
    expect(q1.getTrackPercentRight()).toEqualValues(25);

    q1.min = -100;
    q1.max = 100;
    q1.value = [0, 50];
    expect(q1.getTrackPercentLeft()).toEqualValues(50);
    expect(q1.getTrackPercentRight()).toEqualValues(25);

    q1.min = -100;
    q1.max = 100;
    q1.value = [-50, 0];
    expect(q1.getTrackPercentLeft()).toEqualValues(25);
    expect(q1.getTrackPercentRight()).toEqualValues(50);

    q1.min = -100;
    q1.max = 100;
    q1.value = [-50, 50];
    expect(q1.getTrackPercentLeft()).toEqualValues(25);
    expect(q1.getTrackPercentRight()).toEqualValues(25);

    q1.max = -10;
    q1.min = -110;
    q1.value = [-85, -35];
    expect(q1.getTrackPercentLeft()).toEqualValues(25);
    expect(q1.getTrackPercentRight()).toEqualValues(25);

    q1.min = -100;
    q1.max = 0;
    q1.value = [-80, -20];
    expect(q1.getTrackPercentLeft()).toEqualValues(20);
    expect(q1.getTrackPercentRight()).toEqualValues(20);
  });

  test("renderedValue return correct initial value with negative scale", () => {
    const q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.min = -100;
    q1.max = -10;
    expect(q1.renderedValue).toEqualValues([-10]);

    q1.max = 100;
    expect(q1.renderedValue).toEqualValues([0]);

    q1.min = 10;
    expect(q1.renderedValue).toEqualValues([10]);
  });

  test("getClosestToStepValue", () => {
    const q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";

    // q1.segmentCount = null;
    q1.min = 10;
    q1.max = 100;
    q1.step = 18;
    expect(q1.getClosestToStepValue(9.9)).toEqualValues(10);
    expect(q1.getClosestToStepValue(10)).toEqualValues(10);
    expect(q1.getClosestToStepValue(60)).toEqualValues(64);
    expect(q1.getClosestToStepValue(100)).toEqualValues(100);
    expect(q1.getClosestToStepValue(100.1)).toEqualValues(100);

    // q1.segmentCount = null;
    q1.min = -100;
    q1.max = -10;
    q1.step = 18;
    expect(q1.getClosestToStepValue(-10)).toEqualValues(-10);
    expect(q1.getClosestToStepValue(-20)).toEqualValues(-28);
    expect(q1.getClosestToStepValue(-100)).toEqualValues(-100);

    // q1.segmentCount = null;
    q1.min = -90;
    q1.max = 90;
    q1.step = 18;
    expect(q1.getClosestToStepValue(-90)).toEqualValues(-90);
    expect(q1.getClosestToStepValue(-10)).toEqualValues(-18);
    expect(q1.getClosestToStepValue(0)).toEqualValues(0);
    expect(q1.getClosestToStepValue(10)).toEqualValues(18);
    expect(q1.getClosestToStepValue(90)).toEqualValues(90);
  });

  test("min>max", () => {
    const q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.min = 90;
    q1.max = 10;

    expect(q1.min, "min is set").toEqualValues(90);
    expect(q1.max, "max < min is set to min + step").toEqualValues(91);

    q1.min = 90;
    q1.max = 90;
    expect(q1.max, "max = min is set to min + step").toEqualValues(91);
  });

  test("allowClear", () => {
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

    expect(q1.allowClear, "allowClear is set").toEqualValues(true);

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

    expect(q1.allowClear, "allowClear is false by default").toEqualValues(false);
  });

  test("tooltipVisibility", () => {
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

    expect(q1.tooltipVisibility, "auto by default").toEqualValues("auto");
  });

  test("incorrect value shoudn't lead to js error", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "range";
    q1.value = 10;
    expect(q1.renderedValue).toEqualValues([0, 100]);
  });

  test("getLabelPosition", () => {
    let q1 = new QuestionSliderModel("q1");
    expect(q1.renderedLabelCount).toLooseEqual(6);
    expect(q1.getLabelPosition(0)).toEqualValues(0);
    expect(q1.getLabelPosition(1)).toEqualValues(20);
  });

  test("setSliderValue", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.setSliderValue(50);
    expect(q1.value).toLooseEqual(50);
    q1.setSliderValue([50]);
    expect(q1.value).toLooseEqual(50);
    q1.setSliderValue([50, 60]);
    expect(q1.value).toLooseEqual(50);

    q1.sliderType = "range";
    q1.setSliderValue([50, 60]);
    expect(q1.value).toEqualValues([50, 60]);
  });

  test("sliderType='single' but defaultValue is array", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.defaultValue = [50, 60];
    expect(q1.renderedValue, "rendered value is ok").toLooseEqual(50);
    expect(q1.value, "value is ok").toLooseEqual(50);
  });

  test("disable allowSwap when minRangeLength is set", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "range";
    expect(q1.allowSwap, "default").toLooseEqual(true);
    q1.minRangeLength = 20;
    expect(q1.allowSwap, "disabled due to minRangeLength").toLooseEqual(false);
  });

  test("auto generated labels", () => {
    let q1 = new QuestionSliderModel("q1");
    (<any>q1.generatedLabels).customTag = "#1";
    expect(q1.generatedLabels.length, "generated labels #1").toLooseEqual(6);
    q1.max = 120;
    expect(q1.generatedLabels.length, "generated labels #2").toLooseEqual(6);
    expect((<any>q1.generatedLabels).customTag, "custom tag #2").toLooseEqual("#1");
    q1.autoGenerate = false;
    expect(q1.generatedLabels.length, "generated labels #3").toLooseEqual(6);
    expect((<any>q1.generatedLabels).customTag, "custom tag #3").toLooseEqual("#1");
    q1.autoGenerate = true;
    expect(q1.generatedLabels.length, "generated labels #4").toLooseEqual(6);
    expect((<any>q1.generatedLabels).customTag, "custom tag #4").toLooseEqual("#1");
  });

  test("formatNumber", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "range";
    q1.max = 30;
    q1.step = 0.1;
    expect(q1.getTooltipValue(1)).toLooseEqual(30);
  });

  test("setNewValue", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.sliderType = "single";
    q1.max = 100;
    q1.value = 110;
    expect(q1.renderedValue).toLooseEqual(100);
    expect(q1.value).toLooseEqual(100);
    expect(q1.isIndeterminate).toLooseEqual(false);
  });

  test("check valueName", () => {
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
    expect(q1.renderedValue, "indeterminate state").toEqualValues([0]);
    expect(q1.isIndeterminate).toLooseEqual(true);
    q2.value = 110;
    expect(q1.value, "slider value respect max").toEqualValues(100);
    q2.value = -100;
    expect(q1.value, "slider value respect min").toEqualValues(0);
    expect(q1.isIndeterminate).toLooseEqual(false);
  });

  test("check if customLabels produces correct renderedLabels", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.max = 1000;
    q1.autoGenerate = false;
    q1.customLabels = [new SliderLabelItemValue(500, "middle")];
    expect(q1.renderedLabels[0].text, "text is correct").toEqualValues("middle");
    expect(q1.renderedLabels[0].value, "value is correct").toEqualValues(500);
  });

  test("check if generated and custom labels correct when min and max are set", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.min = 50;
    q1.max = 150;
    expect(q1.generatedLabels.map(l=>l.value), "generated label values are correct").toEqualValues([50, 70, 90, 110, 130, 150]);
    q1.autoGenerate = false;
    expect(q1.customLabels.map(l=>l.value), "custom label values are correct").toEqualValues([50, 70, 90, 110, 130, 150]);
  });

  test("check if autoGenerated labels correct when max is set", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.max = 1000;
    expect(q1.renderedLabels[q1.renderedLabels.length - 1].value, "auto generated label values are correct").toLooseEqual(1000);
  });

  test("check labelFormat for autogenerated", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.min = 50;
    q1.max = 100;
    q1.labelFormat = "{0} %";
    expect(q1.renderedLabels.map(l=>l.locText.renderedHtml), "labelFormat").toEqualValues(["50 %", "60 %", "70 %", "80 %", "90 %", "100 %"]);
  });

  test("check labelFormat for custom labels", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.min = 50;
    q1.max = 100;
    q1.labelFormat = "{0} %";
    q1.autoGenerate = false;
    expect(q1.customLabels.map(l=>l.locText.textOrHtml), "labelFormat").toEqualValues(["50 %", "60 %", "70 %", "80 %", "90 %", "100 %"]);
    q1.labelFormat = "{0} $";
    expect(q1.customLabels.map(l=>l.locText.textOrHtml), "labelFormat").toEqualValues(["50 $", "60 $", "70 $", "80 $", "90 $", "100 $"]);
    q1.customLabels[1].value = 55;
    expect(q1.customLabels[1].locText.textOrHtml, "custom label value is correct").toLooseEqual("55 $");
  });

  test("labelFormat", () => {
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
    expect(q1.renderedLabels[0].locText.renderedHtml).toLooseEqual("begin");
    expect(q1.renderedLabels[1].locText.renderedHtml).toLooseEqual("50");
    expect(q1.renderedLabels[2].locText.renderedHtml).toLooseEqual("100%");
  });

  test("check labelCount=1 works correctly", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.labelCount = 1;
    q1.autoGenerate = false;
    expect(q1.renderedLabels[0].value).toLooseEqual(0);
    expect(q1.renderedLabels[0].text).toLooseEqual("0");
  });

  test("check labelCount=0 works correctly", () => {
    let item = new SliderLabelItemValue(50);
    expect(item.value, "value #1").toBe(50);
    item = new SliderLabelItemValue("50");
    expect(item.value, "value #2").toBe(50);
    item.value = "dfdff";
    expect(item.value, "value #3").toBe(50);
    item = new SliderLabelItemValue("fdsdf");
    expect(item.value, "value #4").toBe(0);
  });

  test("check if renderedValue reacts to sliderType change", () => {
    let q1 = new QuestionSliderModel("q1");
    expect(q1.renderedValue, "single renderedValue").toEqualValues([0]);
    q1.sliderType = "range";
    expect(q1.renderedValue, "range renderedValue").toEqualValues([0, 100]);
  });

  test("setValueExpression", () => {
    let json:any = {
      "elements": [
        {
          "type": "slider",
          "name": "slider",
          "setValueExpression": "[{qMin}, {qMax}]",
          "sliderType": "range"
        },
        {
          "type": "text",
          "name": "qMin",
          "setValueExpression": "{slider[0]}",
        },
        {
          "type": "text",
          "name": "qMax",
          "setValueExpression": "{slider[1]}"
        }
      ]
    };
    let survey = new SurveyModel(json);
    let slider = <QuestionSliderModel>survey.getQuestionByName("slider");
    let qMin = <QuestionSliderModel>survey.getQuestionByName("qMin");
    let qMax = <QuestionSliderModel>survey.getQuestionByName("qMax");

    expect(slider.renderedValue, "initial renderedValue").toEqualValues([0, 100]);
    expect(slider.value, "initial value").toEqualValues([]);

    qMin.value = 20;
    expect(slider.renderedValue, "set min renderedValue").toEqualValues([20, 100]);
    expect(slider.value, "set min value").toEqualValues([20, 100]);

    qMax.value = 40;
    expect(slider.renderedValue, "set max renderedValue").toEqualValues([20, 40]);
    expect(slider.value, "set max value").toEqualValues([20, 40]);

    slider.value = [10, 80];
    expect(qMin.value, "min value from slider").toEqualValues(10);
    expect(qMax.value, "max value from slider").toEqualValues(80);
  });

  test("Preview", () => {
    let json:any = {
      "elements": [
        {
          "type": "slider",
          "name": "slider",
        },
      ]
    };
    let survey = new SurveyModel(json);
    survey.showPreview();
    let slider = <QuestionSliderModel>survey.getQuestionByName("slider");
    expect(slider.renderedValue, "default value").toEqualValues([0]);

    slider["oldValue"] = [0];
    const event: any = { target: { value: 50 } };
    slider.handleOnChange(event, 0);
    expect(slider.renderedValue, "the value doesn't changed").toEqualValues([0]);
  });

  test("itemValuePropertyChanged for labels inplace editing in Creator https://github.com/surveyjs/survey-creator/issues/7205", () => {
    let q1 = new QuestionSliderModel("q1");
    q1.labelCount = 1;
    const label1 = q1.generatedLabels[0];
    label1.text = "min";
    expect(q1.autoGenerate).toLooseEqual(false);
    expect(q1.customLabels[0].text).toLooseEqual("min");
    expect(q1.customLabels[0].value).toLooseEqual(0);

    let q2 = new QuestionSliderModel("q2");
    q2.labelCount = 1;
    const label2 = q2.generatedLabels[0];
    label2.text = "5";
    expect(q2.autoGenerate).toLooseEqual(false);
    expect(q2.customLabels[0].text).toLooseEqual("5");
    expect(q2.customLabels[0].value).toLooseEqual(5);
  });
});
