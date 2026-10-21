import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";
import { FunctionFactory } from "../src/functionsfactory";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { settings } from "../src/settings";

import { describe, test, expect } from "vitest";
describe("CalculatedValues", () => {
  test("Use calculated value in expression", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValue: 1 },
        { type: "text", name: "q2", defaultValue: 2 },
        { type: "text", name: "q3", visibleIf: "{var1} > 2" },
      ],
    });
    expect(survey.getQuestionByName("q3").isVisible, "It is invisible by default var1 is undefined").toBe(false);
    survey.calculatedValues.push(new CalculatedValue("var1", "{q1} + {q2}"));
    expect(survey.getVariable("var1"), "var1 is calculated").toBe(3);
    expect(survey.getQuestionByName("q3").isVisible, "It is visible now var1 equals 3").toBe(true);
    survey.setValue("q2", 1);
    expect(survey.getVariable("var1"), "var1 is re-calculated").toBe(2);
    expect(survey.getQuestionByName("q3").isVisible, "It is invisible again, var1 equals 2").toBe(false);
  });
  test("Deserialize/serialize calculated values", () => {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1", defaultValue: 1 },
            { type: "text", name: "q2", defaultValue: 2 },
            { type: "text", name: "q3", visibleIf: "{var1} > 2" },
          ],
        },
      ],
      calculatedValues: [{ name: "var1", expression: "{q1} + {q2}" }],
    };
    var survey = new SurveyModel(json);
    expect(survey.getVariable("var1"), "var1 is calculated").toBe(3);
    expect(survey.getQuestionByName("q3").isVisible, "It is visible, var1 equals 3").toBe(true);
    expect(survey.toJSON(), "Serialized correctly").toEqual(json);
  });
  test("Include into result", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValue: 1 },
        { type: "text", name: "q2", defaultValue: 2 },
      ],
    });
    survey.calculatedValues.push(new CalculatedValue("var1", "{q1} + {q2}"));
    expect(survey.getVariable("var1"), "var1 is calculated").toBe(3);
    expect(survey.data).toEqual({ q1: 1, q2: 2 });
    survey.calculatedValues[0].includeIntoResult = true;
    expect(survey.data).toEqual({ q1: 1, q2: 2, var1: 3 });
  });

  test("Use complex values in variables, Bug#T2705", () => {
    var survey = new SurveyModel({});
    survey.setVariable("obj", { state: "CA" });
    survey.setVariable("arr", [{ state: "CA" }, { state: "TX" }]);
    expect(survey.getVariable("obj.state"), "var1 is calculated").toBe("CA");
    expect(survey.getVariable("arr[0].state"), "get value from array").toBe("CA");
    expect(survey.getVariable("arr.length"), "get array length").toBe(2);
  });

  test("Error with calculated values on setting survey.data, Bug #1973", () => {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "question1", inputType: "number" },
            {
              type: "expression",
              name: "question2",
              expression: "{var1}",
            },
            {
              type: "expression",
              name: "question5",
              expression: "{totale}",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            { type: "text", name: "question3", inputType: "number" },
            {
              type: "expression",
              name: "question4",
              expression: "{var2}",
            },
          ],
        },
      ],
      calculatedValues: [
        {
          name: "totale",
          expression: "{var1}+{var2}",
          includeIntoResult: true,
        },
        { name: "var1", expression: "{question1}", includeIntoResult: true },
        { name: "var2", expression: "{question3}", includeIntoResult: true },
      ],
    };

    var survey = new SurveyModel(json);
    survey.data = {
      question1: 7,
      question2: 7,
      question5: 12,
      question3: 5,
      question4: 5,
    };
    expect(survey.getValue("question5"), "expression with calculated values returns correct value: {totale} = {var1} + {var2} = {question1} + {question3} = 7 + 5").toBe(12);
  });

  test("Survey.data doesn't contain the calculatedValue change, if it exists before, Bug #2133", () => {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "fruit",
              title: "Enter a fruit",
            },
          ],
        },
      ],
      calculatedValues: [
        {
          name: "finalAnswer",
          expression: "{fruit}",
          includeIntoResult: true,
        },
      ],
    };

    var survey = new SurveyModel(json);
    survey.data = { fruit: "apple", finalAnswer: "apple" };
    survey.setValue("fruit", "orange");
    expect(survey.data, "finalAnswer is 'orange' too.").toEqual({ fruit: "orange", finalAnswer: "orange" });
  });
  test("defaultValue and survey.clearInvisibleValues='onHidden', Bug#2428", () => {
    var survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        {
          name: "q1",
          type: "text",
          defaultValue: 1,
          visible: false,
        },
        {
          name: "q2",
          type: "text",
          defaultValue: 2,
          visible: false,
        },
      ],
      calculatedValues: [{ name: "var1", expression: "{q1} + {q2}" }],
    });
    var q1 = survey.getQuestionByName("q1");
    var q2 = survey.getQuestionByName("q2");

    var calcValue = survey.calculatedValues[0];
    expect(calcValue.value, "0 + 0").toBe(0);
    q1.visible = true;
    expect(calcValue.value, "1 + 0").toBe(1);
    q2.visible = true;
    expect(calcValue.value, "1 + 2").toBe(3);
    q1.visible = false;
    expect(calcValue.value, "0 + 2").toBe(2);
  });

  test("survey.clearIncorrectValues with parameter removeNonExistingRootKeys", () => {
    var json = {
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
        },
      ],
      calculatedValues: [
        { name: "val1", expression: "{q1} + {q2}", includeIntoResult: true },
      ],
    };
    var survey = new SurveyModel(json);
    var calcValue = survey.getCalculatedValueByName("val1");
    expect(calcValue, "Calc value is here").toBeTruthy();
    survey.setValue("q1", "v1");
    survey.setValue("q2", "v2");
    survey.setValue("q3", "v3");
    survey.setValue("val3", "v4");
    expect(survey.data, "values set correctly").toEqual({ q1: "v1", q2: "v2", q3: "v3", val1: "v1v2", val3: "v4" });
    survey.clearIncorrectValues(true);
    expect(survey.data, "Remove q3 and val3 keys").toEqual({ q1: "v1", q2: "v2", val1: "v1v2" });
  });

  test("Compete trigger and calculatedValues, Bug#2595", () => {
    var json = {
      pages: [
        {
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
            },
          ],
        },
        {
          elements: [
            {
              type: "text",
              name: "q3",
            },
          ],
        },
      ],
      calculatedValues: [
        {
          name: "result",
          expression: "iif({q1} = 'val1', 'screenout', 'complete')",
          includeIntoResult: true,
        },
      ],
      triggers: [
        {
          type: "complete",
          expression: "{result} = 'screenout'",
        },
      ],
    };
    var survey = new SurveyModel(json);
    expect(survey.calculatedValues.length, "There is one calcualted values").toBe(1);
    var calcValue: CalculatedValue = survey.calculatedValues[0];
    expect(calcValue.name, "calcValue is here").toBe("result");
    var isCompleteOnTrigger = false;
    survey.onComplete.add(function(sender, options) {
      isCompleteOnTrigger = options.isCompleteOnTrigger;
    });
    survey.setValue("q1", "val1");
    survey.nextPage();
    expect(survey.state, "survey is completed").toBe("completed");
    expect(isCompleteOnTrigger, "complete on trigger").toBe(true);
  });

  test("Survey.onPropertyValueChangedCallback for calculatedValues, Bug#2604", () => {
    var json = {
      elements: [
        {
          type: "text",
          name: "q1",
        },
      ],
      calculatedValues: [
        {
          name: "var1",
          expression: "1+2",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var counter = 0;
    var propName = null;
    var testOldValue = null;
    var testNewValue = null;
    var senderType = null;

    survey.onPropertyValueChangedCallback = (
      name: string,
      oldValue: any,
      newValue: any,
      sender: any,
      arrayChanges: any
    ) => {
      if (name != "name" && name != "expression") return;
      counter++;
      propName = name;
      testOldValue = oldValue;
      testNewValue = newValue;
      senderType = sender.getType();
    };

    expect(counter, "initial").toBe(0);
    survey.calculatedValues[0].name = "var2";
    expect(counter, "calculdatedValue: callback called").toBe(1);
    expect(propName, "calculdatedValue: property name is correct").toBe("name");
    expect(testOldValue, "calculdatedValue: oldValue is correct").toBe("var1");
    expect(testNewValue, "calculdatedValue: newValue is correct").toBe("var2");
    survey.calculatedValues[0].expression = "1+2+3";
    expect(counter, "calculdatedValue: callback called #2").toBe(2);
    expect(propName, "calculdatedValue: property name is correct #2").toBe("expression");
    expect(testOldValue, "calculdatedValue: oldValue is correct #2").toBe("1+2");
    expect(testNewValue, "calculdatedValue: newValue is correct #2").toBe("1+2+3");
  });
  test("Use calculated value in text processing", () => {
    var json = {
      elements: [
        {
          type: "text",
          title: "title: {var1}",
          name: "q1",
        },
      ],
      calculatedValues: [
        {
          name: "var1",
          expression: "1+2",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    expect(question.locTitle.renderedHtml).toBe("title: 3");
  });
  test("Fire onVariableChanged on changing calculated value", () => {
    const json = {
      elements: [
        {
          type: "text",
          name: "q1",
          defaultValue: 1
        },
      ],
      calculatedValues: [
        {
          name: "var1",
          expression: "{q1} + 1",
        },
      ],
    };
    const survey = new SurveyModel(json);
    let counter = 0;
    let name, value;
    survey.onVariableChanged.add((sender, options) => {
      counter++;
      name = options.name;
      value = options.value;
    });
    expect(survey.calculatedValues[0].value, "The value set correctly").toBe(2);
    survey.setValue("q1", 2);
    expect(survey.calculatedValues[0].value, "The value updated correctly").toBe(3);
    expect(counter, "onVariableChanged is fired one time").toBe(1);
    expect(name, "options.name is correct").toBe("var1");
    expect(value, "options.value is correct").toBe(3);
  });
  test("Calculated value with containsErrors and regex validators, Bug#11152", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
              validators: [
                {
                  type: "regex",
                  regex: "^https?:\\/\\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+(com|net)(?:[\\/?#][-a-zA-Z0-9@:%_+.~#?&\\/=]*)?$",
                  caseInsensitive: true
                }
              ]
            },
            {
              type: "text",
              name: "q2",
              validators: [
                {
                  type: "regex",
                  regex: "^https?:\\/\\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+(com|net)(?:[\\/?#][-a-zA-Z0-9@:%_+.~#?&\\/=]*)?$",
                  caseInsensitive: true
                }
              ]
            },
            {
              type: "boolean",
              name: "q3",
              visibleIf: "{q1} notempty and !{$q1.containsErrors} and {q2} notempty and !{$q2.containsErrors}"
            }
          ]
        }
      ],
      calculatedValues: [
        {
          name: "allUrlsAreEntered",
          expression: "{q1} notempty and !{$q1.containsErrors} and {q2} notempty and !{$q2.containsErrors}"
        }
      ],
      checkErrorsMode: "onValueChanged",
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const calcValue = survey.calculatedValues[0];

    expect(calcValue.value, "Initially calculated value is false").toBe(false);
    expect(q3.isVisible, "q3 is invisible initially").toBe(false);

    q1.value = "http://www.one.com";
    expect(calcValue.value, "Calculated value is false, q2 is still empty").toBe(false);
    expect(q3.isVisible, "q3 is invisible, q2 is still empty").toBe(false);

    q2.value = "//www.second.com";
    expect(calcValue.value, "Calculated value is false, q2 has invalid URL").toBe(false);
    expect(q3.isVisible, "q3 is invisible, q2 contains errors").toBe(false);

    q2.value = "http://www.second.com";
    expect(calcValue.value, "Calculated value is true, both URLs are valid").toBe(true);
    expect(q3.isVisible, "q3 is visible, both URLs are valid").toBe(true);

    q1.value = "//www.one.com";
    expect(calcValue.value, "Calculated value is false, q1 has invalid URL").toBe(false);
    expect(q3.isVisible, "q3 is invisible, q1 contains errors").toBe(false);
  });
});
// A calculated value skips its run in the survey's conditions pass when no value or variable its
// expression uses changed, the same rule as a visibleIf with strict dependencies
describe("CalculatedValues: recalculate when a value they use changes", () => {
  const registerCounter = (name: string, counter: { count: number }) => {
    FunctionFactory.Instance.register(name, (params: any[]) => {
      counter.count++;
      return params.length > 0 ? params[0] : counter.count;
    });
  };
  test("a calculated value with {correctanswers} and {incorrectanswers} follows the quiz answers", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: "a" },
        { type: "text", name: "q2", correctAnswer: "b" }
      ],
      calculatedValues: [
        { name: "correct", expression: "{correctanswers}" },
        { name: "incorrect", expression: "{incorrectanswers}" }
      ]
    });
    expect(survey.getVariable("correct"), "nothing answered: correct").toBe(0);
    expect(survey.getVariable("incorrect"), "nothing answered: incorrect").toBe(2);
    survey.setValue("q1", "a");
    expect(survey.getVariable("correct"), "q1 is correct: correct").toBe(1);
    expect(survey.getVariable("incorrect"), "q1 is correct: incorrect").toBe(1);
    survey.setValue("q2", "b");
    expect(survey.getVariable("correct"), "both are correct: correct").toBe(2);
    expect(survey.getVariable("incorrect"), "both are correct: incorrect").toBe(0);
    survey.setValue("q1", "x");
    expect(survey.getVariable("correct"), "q1 is wrong: correct").toBe(1);
    expect(survey.getVariable("incorrect"), "q1 is wrong: incorrect").toBe(1);
  });
  test("a calculated value does not run when an answer it does not use changes", () => {
    const counter = { count: 0 };
    registerCounter("countCalls", counter);
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
        calculatedValues: [{ name: "cv", expression: "countCalls({a})" }]
      });
      counter.count = 0;
      survey.setValue("b", 1);
      expect(counter.count, "b is not used").toBe(0);
      survey.setValue("a", 2);
      expect(survey.getVariable("cv"), "cv follows a").toBe(2);
      // two passes: the first one changes cv, and that change starts the second one
      expect(counter.count, "a is used: one run per pass").toBe(2);
      counter.count = 0;
      survey.setValue("b", 3);
      expect(counter.count, "b is not used, again").toBe(0);
      expect(survey.getVariable("cv"), "cv keeps its value").toBe(2);
    } finally {
      FunctionFactory.Instance.unregister("countCalls");
    }
  });
  test("a chain of calculated values updates in one setValue, in both declaration orders", () => {
    const check = (calculatedValues: Array<any>, order: string) => {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "q" }, { type: "text", name: "other" }],
        calculatedValues: calculatedValues
      });
      survey.setValue("q", 1);
      expect(survey.getVariable("cv1"), order + ": cv1 after q = 1").toBe(2);
      expect(survey.getVariable("cv2"), order + ": cv2 after q = 1").toBe(4);
      survey.setValue("other", 1);
      expect(survey.getVariable("cv2"), order + ": cv2 after an unrelated answer").toBe(4);
      survey.setValue("q", 5);
      expect(survey.getVariable("cv1"), order + ": cv1 after q = 5").toBe(6);
      expect(survey.getVariable("cv2"), order + ": cv2 after q = 5").toBe(12);
    };
    const cv1 = { name: "cv1", expression: "{q} + 1" };
    const cv2 = { name: "cv2", expression: "{cv1} * 2" };
    check([cv1, cv2], "cv1 first");
    check([cv2, cv1], "cv2 first");
  });
  test("a cycle of calculated values no longer runs again on an answer it does not use (it grew on every answer before)", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "x" }, { type: "text", name: "y" }],
      calculatedValues: [
        { name: "a", expression: "{b} + {x}" },
        { name: "b", expression: "{a} + 1" }
      ]
    });
    expect(survey.getVariable("a"), "a after load").toBe(11);
    expect(survey.getVariable("b"), "b after load").toBe(11);
    survey.setValue("y", 1);
    expect(survey.getVariable("a"), "a after an unrelated answer").toBe(11);
    expect(survey.getVariable("b"), "b after an unrelated answer").toBe(11);
    survey.setValue("x", 1);
    expect(survey.getVariable("a"), "a after x = 1: the cycle ran").toBe(32);
    expect(survey.getVariable("b"), "b after x = 1: the cycle ran").toBe(31);
  });
  test("a parameterless function runs on every value change", () => {
    const counter = { count: 0 };
    registerCounter("countCallsNoParams", counter);
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
        calculatedValues: [{ name: "cv", expression: "countCallsNoParams() + {a}" }]
      });
      counter.count = 0;
      survey.setValue("b", 1);
      expect(counter.count > 0, "runs although only b changed").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("countCallsNoParams");
    }
  });
  test("a property reference {$q1.isVisible} runs on every value change", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "other" }],
      calculatedValues: [{ name: "cv", expression: "{$q1.isVisible}" }]
    });
    expect(survey.getVariable("cv"), "q1 is visible").toBe(true);
    survey.getQuestionByName("q1").visible = false;
    survey.setValue("other", 1);
    expect(survey.getVariable("cv"), "q1 is hidden, read on the next answer").toBe(false);
  });
  test("a calculated value runs on every value change while onExpressionRunning has a handler", () => {
    const counter = { count: 0 };
    registerCounter("countCalls", counter);
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
        calculatedValues: [{ name: "cv", expression: "countCalls({a})" }]
      });
      survey.onExpressionRunning.add(() => { });
      counter.count = 0;
      survey.setValue("b", 1);
      expect(counter.count > 0, "runs although only b changed").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("countCalls");
    }
  });
  test("survey.runExpressions(), survey.data and setVariable run a calculated value", () => {
    const counter = { count: 0 };
    registerCounter("countCalls", counter);
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
        calculatedValues: [
          { name: "cv", expression: "countCalls({a})" },
          { name: "cvVar", expression: "{v} + 1" }
        ]
      });
      survey.setValue("a", 1);
      counter.count = 0;
      survey.runExpressions();
      expect(counter.count > 0, "runExpressions()").toBe(true);
      counter.count = 0;
      survey.data = { a: 1, b: 2 };
      expect(counter.count > 0, "survey.data").toBe(true);
      expect(survey.getVariable("cv"), "cv after survey.data").toBe(1);
      survey.setVariable("v", 5);
      expect(survey.getVariable("cvVar"), "setVariable of a variable it uses").toBe(6);
    } finally {
      FunctionFactory.Instance.unregister("countCalls");
    }
  });
  test("paths into a matrix {m.row1} and a dynamic panel {panel[0].q1}", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrix", name: "m", columns: ["a", "b"], rows: ["row1", "row2"] },
        { type: "paneldynamic", name: "panel", panelCount: 2, templateElements: [{ type: "text", name: "q1" }] }
      ],
      calculatedValues: [
        { name: "cvRow", expression: "{m.row1}" },
        { name: "cvPanel", expression: "{panel[0].q1}" }
      ]
    });
    survey.setValue("m", { row2: "a" });
    expect(survey.getVariable("cvRow"), "another row changed").toBeFalsy();
    survey.setValue("m", { row2: "a", row1: "b" });
    expect(survey.getVariable("cvRow"), "row1 changed").toBe("b");
    survey.clearValue("m");
    expect(survey.getVariable("cvRow"), "the matrix is cleared").toBeFalsy();
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.panels[1].getQuestionByName("q1").value = "second";
    expect(survey.getVariable("cvPanel"), "the second panel changed").toBeFalsy();
    panel.panels[0].getQuestionByName("q1").value = "first";
    expect(survey.getVariable("cvPanel"), "the first panel changed").toBe("first");
    panel.panels[0].getQuestionByName("q1").value = "first-2";
    expect(survey.getVariable("cvPanel"), "the first panel changed again").toBe("first-2");
  });
  test("a value cleared because its question is hidden updates the calculated value (clearInvisibleValues: onHidden)", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "text", name: "b" },
        { type: "text", name: "q1", visibleIf: "{b} empty" }
      ],
      calculatedValues: [{ name: "cv", expression: "iif({q1} notempty, {q1}, 'none')" }]
    });
    survey.setValue("q1", "value");
    expect(survey.getVariable("cv"), "q1 has a value").toBe("value");
    survey.setValue("b", 1);
    expect(survey.getValue("q1"), "q1 is hidden and cleared").toBeUndefined();
    expect(survey.getVariable("cv"), "cv follows the cleared q1").toBe("none");
  });
  test("a custom function that reads another survey value by itself is stale while settings.calculatedValueTrackDependencies is true", () => {
    FunctionFactory.Instance.register("readOther", function (this: any) {
      return this.survey.getValue("other");
    });
    const prevTrackDependencies = settings.calculatedValueTrackDependencies;
    try {
      const createSurvey = () => new SurveyModel({
        elements: [{ type: "text", name: "a" }, { type: "text", name: "other" }],
        calculatedValues: [{ name: "cv", expression: "readOther({a})" }]
      });
      settings.calculatedValueTrackDependencies = true;
      let survey = createSurvey();
      survey.setValue("a", 1);
      survey.setValue("other", 5);
      expect(survey.getVariable("cv"), "true: other is not a parameter, cv is stale").toBeUndefined();
      survey.setValue("a", 2);
      expect(survey.getVariable("cv"), "true: a changed, cv reads other").toBe(5);

      settings.calculatedValueTrackDependencies = false;
      survey = createSurvey();
      survey.setValue("a", 1);
      survey.setValue("other", 5);
      expect(survey.getVariable("cv"), "false: runs on every value change").toBe(5);
    } finally {
      settings.calculatedValueTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("readOther");
    }
  });
  test("names and changed keys are compared case-insensitively", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "Age" },
        { type: "text", name: "age2" },
        { type: "matrix", name: "m", columns: ["a", "b"], rows: ["row1", "row2"] },
        { type: "checkbox", name: "Fruits", choices: ["apple", "banana"], valuePropertyName: "fruit" }
      ],
      calculatedValues: [
        { name: "cv", expression: "{age} + 1" },
        { name: "cv2", expression: "{AGE2} + 1" },
        { name: "cvRow", expression: "{M.row1}" },
        { name: "cvFruits", expression: "{fruits-unwrapped} contains 'apple'" }
      ]
    });
    survey.setValue("Age", 30);
    expect(survey.getVariable("cv"), "key Age, name {age}").toBe(31);
    survey.setValue("age2", 40);
    expect(survey.getVariable("cv2"), "key age2, name {AGE2}").toBe(41);
    survey.setValue("m", { row2: "a" });
    survey.setValue("m", { row2: "a", row1: "b" });
    expect(survey.getVariable("cvRow"), "key m, name {M.row1}").toBe("b");
    survey.getQuestionByName("Fruits").renderedValue = ["apple"];
    expect(survey.getVariable("cvFruits"), "key Fruits, name {fruits-unwrapped}").toBe(true);
  });
  test("a stored value cleared or overwritten from outside is calculated again", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q" }, { type: "text", name: "other" }],
      calculatedValues: [{ name: "cv", expression: "{q} + 1", includeIntoResult: true }]
    });
    survey.setValue("q", 2);
    expect(survey.getVariable("cv"), "after q = 2").toBe(3);
    survey.setVariables({}, true);
    expect(survey.getVariable("cv"), "after the variables are cleared").toBe(3);
    expect(survey.data, "data after the variables are cleared").toEqual({ q: 2, cv: 3 });
    survey.setVariable("cv", 100);
    expect(survey.getVariable("cv"), "after the variable is overwritten").toBe(3);
    expect(survey.data, "data after the variable is overwritten").toEqual({ q: 2, cv: 3 });
  });
  test("a renamed calculated value is calculated under the new name on the next answer", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q" }, { type: "text", name: "other" }],
      calculatedValues: [{ name: "cv", expression: "{q} + 1", includeIntoResult: true }]
    });
    survey.setValue("q", 2);
    expect(survey.getVariable("cv"), "before the rename").toBe(3);
    survey.calculatedValues[0].name = "renamed";
    expect(survey.getVariable("renamed"), "right after the rename").toBeUndefined();
    survey.setValue("other", 5);
    expect(survey.getVariable("renamed"), "after an answer it does not use").toBe(3);
    expect(survey.data.renamed, "survey.data has the new name").toBe(3);
  });
});
