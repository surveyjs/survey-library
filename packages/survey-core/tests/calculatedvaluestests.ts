import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";
import { FunctionFactory } from "../src/functionsfactory";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { settings } from "../src/settings";
import { Base } from "../src/base";
import { ValueGetter } from "../src/conditions/conditionProcessValue";
import { ExpressionRunner } from "../src/expressions/expressionRunner";

import { describe, test, expect, vi } from "vitest";
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
describe("The skip check reads each name's parsed parts once", () => {
  test("an element visibleIf replaced in place follows its new variable", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
        { type: "text", name: "q", visibleIf: "{a} = 1" }
      ]
    });
    const q = survey.getQuestionByName("q");
    survey.setValue("a", 2);
    expect(q.isVisible, "a = 2").toBe(false);
    q.visibleIf = "{b} = 1";
    expect(q.isVisible, "visibleIf is {b} = 1").toBe(false);
    survey.setValue("b", 1);
    expect(q.isVisible, "b = 1").toBe(true);
    survey.setValue("b", 2);
    expect(q.isVisible, "b = 2").toBe(false);
  });
  test("a calculated value whose expression is replaced in place follows its new variable", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
      calculatedValues: [{ name: "cv", expression: "{a}" }]
    });
    survey.setValue("a", 1);
    expect(survey.getVariable("cv"), "a = 1").toBe(1);
    const runner = (<any>survey.calculatedValues[0]).expressionRunner;
    survey.calculatedValues[0].expression = "{b}";
    expect((<any>survey.calculatedValues[0]).expressionRunner, "the runner object is kept").toBe(runner);
    expect(survey.getVariable("cv"), "expression is {b}").toBeUndefined();
    survey.setValue("b", 5);
    expect(survey.getVariable("cv"), "b = 5").toBe(5);
    survey.setValue("a", 7);
    expect(survey.getVariable("cv"), "a = 7, not used any more").toBe(5);
  });
  test("a copyvalue trigger copies when its source changes", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "src" }, { type: "text", name: "dst" }],
      triggers: [{ type: "copyvalue", expression: "{a} = 1", fromName: "src", setToName: "dst" }]
    });
    survey.setValue("src", "x");
    survey.setValue("a", 1);
    expect(survey.getValue("dst"), "src = x, a = 1").toBe("x");
    survey.setValue("src", "y");
    expect(survey.getValue("dst"), "src = y").toBe("y");
  });
  test("paths, letter case and the unwrap postfix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "d", choices: [1, 2] },
        { type: "text", name: "e", visibleIf: "{d-unwrapped} = 2" },
        { type: "matrix", name: "m", rows: ["r1", "r2"], columns: ["c1", "c2"] },
        { type: "text", name: "f", visibleIf: "{M.R1} = 'c1'" },
        { type: "text", name: "g", visibleIf: "{m.r2} = 'c1'" }
      ]
    });
    const e = survey.getQuestionByName("e");
    const f = survey.getQuestionByName("f");
    const g = survey.getQuestionByName("g");
    survey.setValue("d", 2);
    expect(e.isVisible, "d = 2").toBe(true);
    survey.setValue("m", { r1: "c1" });
    expect(f.isVisible, "m.r1 = c1: f").toBe(true);
    expect(g.isVisible, "m.r1 = c1: g").toBe(false);
    survey.setValue("m", { r1: "c1", r2: "c1" });
    expect(g.isVisible, "m.r2 = c1: g").toBe(true);
  });
  test("a calculated value runs exactly as often as before", () => {
    let count = 0;
    FunctionFactory.Instance.register("countCalls", (params: any[]) => {
      count++;
      return params[1];
    });
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "a" },
          { type: "text", name: "b" },
          { type: "matrix", name: "m", rows: ["r1", "r2"], columns: ["c1", "c2"] }
        ],
        calculatedValues: [{ name: "cv", expression: "countCalls({A}, {M.r1})" }]
      });
      const step = (title: string, action: () => void, calls: number, cv: any) => {
        count = 0;
        action();
        expect(count, title + ": calls").toBe(calls);
        expect(survey.getVariable("cv"), title + ": cv").toBe(cv);
      };
      step("b = 1", () => survey.setValue("b", 1), 0, undefined);
      step("m = { r2: c1 }", () => survey.setValue("m", { r2: "c1" }), 1, undefined);
      step("m = { r1: c2, r2: c1 }", () => survey.setValue("m", { r1: "c2", r2: "c1" }), 2, "c2");
      step("b = 2", () => survey.setValue("b", 2), 0, "c2");
      step("a = 1", () => survey.setValue("a", 1), 1, "c2");
      step("m is cleared", () => survey.clearValue("m"), 2, null);
    } finally {
      FunctionFactory.Instance.unregister("countCalls");
    }
  });
  test("a defaultValueExpression with a path follows its key", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
        { type: "text", name: "q", defaultValueExpression: "{a.x}", defaultValue: 7 }
      ]
    });
    const q = survey.getQuestionByName("q");
    survey.setValue("a", { x: 2 });
    expect(q.value, "a = { x: 2 }").toBe(2);
    survey.setValue("b", 1);
    expect(q.value, "b = 1").toBe(2);
    survey.clearValue("a");
    expect(q.value, "a is cleared").toBe(7);
    survey.setValue("a", { x: 3 });
    expect(q.value, "a = { x: 3 }").toBe(3);
  });
  test("the unwrap postfix changed after the information is built", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "d", choices: [1, 2] },
        { type: "text", name: "e", visibleIf: "{d_raw} = 2" },
        { type: "text", name: "x" }
      ]
    });
    const e = survey.getQuestionByName("e");
    survey.setValue("x", 1);
    survey.setValue("x", 2);
    expect(e.isVisible, "x = 1, x = 2").toBe(false);
    settings.expressionVariables.unwrapPostfix = "_raw";
    try {
      survey.setValue("d", 2);
      expect(e.isVisible, "postfix _raw, d = 2").toBe(true);
      survey.setValue("d", 1);
      expect(e.isVisible, "postfix _raw, d = 1").toBe(false);
    } finally {
      settings.expressionVariables.unwrapPostfix = "-unwrapped";
    }
  });
  test("the property prefix changed after the information is built", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b", visibleIf: "{a} = 1" },
        { type: "text", name: "q", visibleIf: "{@b.isVisible}" }
      ]
    });
    const b = survey.getQuestionByName("b");
    const q = survey.getQuestionByName("q");
    survey.setValue("a", 2);
    survey.setValue("a", 3);
    expect(b.isVisible, "a = 3: b").toBe(false);
    expect(q.isVisible, "a = 3: q").toBe(false);
    settings.expressionElementPropertyPrefix = "@";
    try {
      survey.setValue("a", 1);
      expect(b.isVisible, "prefix @, a = 1: b").toBe(true);
      expect(q.isVisible, "prefix @, a = 1: q").toBe(true);
      survey.setValue("a", 4);
      expect(q.isVisible, "prefix @, a = 4: q").toBe(false);
    } finally {
      settings.expressionElementPropertyPrefix = "$";
    }
  });
  test("only the shortest prefix that is a key decides, through both entry paths", () => {
    const keySets: { [name: string]: any } = {
      same: { m: { oldValue: { r1: { x: 1 } }, newValue: { r1: { x: 1 }, r2: 5 } }, "m.r1": { x: 2 } },
      diff: { m: { oldValue: { r1: { x: 1 } }, newValue: { r1: { x: 2 } } }, "m.r1": { x: 2 } },
      onlyLong: { "m.r1": { x: 2 } }
    };
    const getter = new ValueGetter();
    expect(getter.isAnyKeyChanged(keySets.same, ["m.r1.x"]), "names: same").toBe(false);
    expect(getter.isAnyKeyChanged(keySets.diff, ["m.r1.x"]), "names: diff").toBe(true);
    expect(getter.isAnyKeyChanged(keySets.onlyLong, ["m.r1.x"]), "names: onlyLong").toBe(true);
    expect(getter.isAnyKeyChanged(keySets.same, ["M.R1.X"]), "names: same, upper case").toBe(false);
    const runner = new ExpressionRunner("{m.r1.x} = 1");
    const base: any = new Base();
    const expected: { [name: string]: boolean } = { same: true, diff: false, onlyLong: false };
    for (const name in expected) {
      expect(base.canSkipExpressionByKeys(runner, keySets[name]), "runner: " + name).toBe(expected[name]);
      expect(base.canSkipExpressionByKeys(runner, keySets[name]), "runner, again: " + name).toBe(expected[name]);
    }
  });
  test("a name pushed into the runner's variables after a check is checked too", () => {
    const runner = new ExpressionRunner("{a} = 1");
    const base: any = new Base();
    expect(base.canSkipExpressionByKeys(runner, { src: 1 }), "src is not used").toBe(true);
    runner.getVariables().push("src");
    expect(base.canSkipExpressionByKeys(runner, { src: 1 }), "src is pushed").toBe(false);
    runner.getVariables()[1] = "other";
    expect(base.canSkipExpressionByKeys(runner, { src: 1 }), "src is replaced").toBe(true);
    expect(base.canSkipExpressionByKeys(runner, { other: 1 }), "other is used").toBe(false);
  });
});
describe("The skip check shares each name's parsed parts within a survey", () => {
  const getSlot = (survey: SurveyModel, name: string): any =>
    (<any>survey.getQuestionByName(name)).getExpressionByProperty("visibleIf").getVariablesInfo()[0];
  test("two runners with the same name hold the same item after the first answer", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "x" },
        { type: "text", name: "a", visibleIf: "{q1} = 1" },
        { type: "text", name: "b", visibleIf: "{q1} = 1" }
      ]
    });
    survey.setValue("x", 1);
    const a = getSlot(survey, "a");
    expect(a, "a's slot is filled").toBeTruthy();
    expect(a.name, "a's slot name").toBe("q1");
    expect(getSlot(survey, "b"), "b holds a's item").toBe(a);
  });
  test("names that differ only in letter case hold their own items", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "x" },
        { type: "text", name: "a", visibleIf: "{q1} = 1" },
        { type: "text", name: "c", visibleIf: "{Q1} = 1" }
      ]
    });
    const a = survey.getQuestionByName("a");
    const c = survey.getQuestionByName("c");
    expect(a.isVisible, "at start: a").toBe(false);
    expect(c.isVisible, "at start: c").toBe(false);
    survey.setValue("q1", 1);
    expect(a.isVisible, "q1 = 1: a").toBe(true);
    expect(c.isVisible, "q1 = 1: c").toBe(true);
    expect(getSlot(survey, "a").name, "q1 = 1: a's slot name").toBe("q1");
    expect(getSlot(survey, "c").name, "q1 = 1: c's slot name").toBe("Q1");
    expect(getSlot(survey, "c"), "q1 = 1: two items").not.toBe(getSlot(survey, "a"));
    survey.setValue("x", 1);
    expect(a.isVisible, "x = 1: a").toBe(true);
    expect(c.isVisible, "x = 1: c").toBe(true);
    expect(getSlot(survey, "a").name, "x = 1: a's slot name").toBe("q1");
    expect(getSlot(survey, "c").name, "x = 1: c's slot name").toBe("Q1");
    expect(getSlot(survey, "c"), "x = 1: two items").not.toBe(getSlot(survey, "a"));
  });
  test("a runner whose expression changes to a name in the survey's map gets that item", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
        { type: "text", name: "x" },
        { type: "text", name: "p", visibleIf: "{a} = 1" },
        { type: "text", name: "q", visibleIf: "{b} = 1" }
      ]
    });
    const p = survey.getQuestionByName("p");
    const q = survey.getQuestionByName("q");
    survey.setValue("x", 1);
    expect(getSlot(survey, "q").name, "q's slot before the change").toBe("b");
    const runner = (<any>q).getExpressionByProperty("visibleIf");
    q.visibleIf = "{a} = 2";
    expect((<any>q).getExpressionByProperty("visibleIf"), "the runner object is kept").toBe(runner);
    expect(q.isVisible, "visibleIf is {a} = 2").toBe(false);
    survey.setValue("x", 2);
    expect(getSlot(survey, "q").name, "q's slot after the change").toBe("a");
    survey.setValue("a", 2);
    expect(q.isVisible, "a = 2: q").toBe(true);
    expect(p.isVisible, "a = 2: p").toBe(false);
    survey.setValue("a", 1);
    expect(q.isVisible, "a = 1: q").toBe(false);
    expect(p.isVisible, "a = 1: p").toBe(true);
    survey.setValue("b", 1);
    expect(q.isVisible, "b = 1: q").toBe(false);
    expect(getSlot(survey, "q"), "q holds p's item").toBe(getSlot(survey, "p"));
  });
  test("a survey trigger's names are built once per survey", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "x" },
        { type: "text", name: "dst" },
        { type: "text", name: "q", visibleIf: "{a} = 1" }
      ],
      triggers: [{ type: "setvalue", expression: "{a} = 1", setToName: "dst", setValue: "done" }]
    });
    survey.setValue("x", 1);
    const spy = vi.spyOn(<any>ValueGetter.prototype, "getNameInfo");
    try {
      survey.setValue("x", 2);
      expect(survey.getValue("dst"), "x = 2: dst").toBeUndefined();
      survey.setValue("a", 1);
      expect(survey.getValue("dst"), "a = 1: dst").toBe("done");
      expect(survey.getQuestionByName("q").isVisible, "a = 1: q").toBe(true);
      expect(spy, "names parsed after the first answer").toHaveBeenCalledTimes(0);
    } finally {
      spy.mockRestore();
    }
  });
  test("two surveys from the same JSON do not share items", () => {
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "x" },
        { type: "text", name: "a", visibleIf: "{q1} = 1" },
        { type: "text", name: "b", visibleIf: "{q1} = 1" }
      ]
    };
    const survey1 = new SurveyModel(json);
    const survey2 = new SurveyModel(json);
    survey1.setValue("x", 1);
    survey2.setValue("x", 1);
    const a1 = getSlot(survey1, "a");
    const a2 = getSlot(survey2, "a");
    expect(a1, "survey 1: a's slot is filled").toBeTruthy();
    expect(a2, "survey 2: a's slot is filled").toBeTruthy();
    expect(a2, "across the surveys").not.toBe(a1);
    expect(getSlot(survey1, "b"), "within survey 1").toBe(a1);
    expect(getSlot(survey2, "b"), "within survey 2").toBe(a2);
  });
});
// The calculated values a calculated value uses run first. They are found by the names its expression
// uses, matched exactly, and run in the order of the survey's list
describe("CalculatedValues: find the calculated values they use", () => {
  const registerTick = () => {
    const log = { counts: {} as { [name: string]: number }, sequence: [] as Array<string> };
    FunctionFactory.Instance.register("tick", (params: any[]) => {
      const name = params[0];
      log.counts[name] = (log.counts[name] || 0) + 1;
      log.sequence.push(name);
      return params[1];
    });
    const reset = () => {
      log.counts = {};
      log.sequence = [];
    };
    return { log, reset };
  };
  const createSurvey = (calculatedValues: Array<any>): SurveyModel => {
    return new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
      calculatedValues: calculatedValues
    });
  };
  test("a chain declared in reverse order calculates the values it uses first, and nothing runs on an unrelated answer", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {c2} + 1)" },
        { name: "c2", expression: "tick('c2', {c3} * 2)" },
        { name: "c3", expression: "tick('c3', {a})" }
      ]);
      reset();
      survey.setValue("a", 1);
      expect(survey.getVariable("c1"), "c1 after a = 1").toBe(3);
      expect(survey.getVariable("c2"), "c2 after a = 1").toBe(2);
      expect(survey.getVariable("c3"), "c3 after a = 1").toBe(1);
      expect(log.counts, "calls after a = 1").toEqual({ c3: 2, c2: 2, c1: 2 });
      reset();
      survey.setValue("b", 1);
      expect(survey.getVariable("c1"), "c1 after b = 1").toBe(3);
      expect(survey.getVariable("c2"), "c2 after b = 1").toBe(2);
      expect(survey.getVariable("c3"), "c3 after b = 1").toBe(1);
      expect(log.counts, "calls after b = 1").toEqual({});
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("a reference in another letter case is not a dependent: the next pass corrects the value", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {C2} + 1)" },
        { name: "c2", expression: "tick('c2', {a})" }
      ]);
      reset();
      survey.setValue("a", 1);
      expect(survey.getVariable("c1"), "c1 after a = 1").toBe(2);
      expect(survey.getVariable("c2"), "c2 after a = 1").toBe(1);
      expect(log.counts, "calls after a = 1").toEqual({ c2: 3, c1: 2 });
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("a calculated value renamed at runtime is found under its new name", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {c9} + 1)" },
        { name: "c2", expression: "tick('c2', {a})" }
      ]);
      survey.setValue("a", 1);
      survey.calculatedValues[1].name = "c9";
      reset();
      survey.setValue("a", 2);
      expect(survey.getVariable("c1"), "c1 after a = 2").toBe(3);
      expect(survey.getVariable("c9"), "c9 after a = 2").toBe(2);
      expect(log.counts, "calls after a = 2").toEqual({ c2: 2, c1: 2 });
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("a calculated value added at the start of the list, then one removed", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c2", expression: "tick('c2', {a})" }
      ]);
      survey.setValue("a", 1);
      survey.calculatedValues.unshift(new CalculatedValue("c1", "tick('c1', {c2} * 10)"));
      reset();
      survey.setValue("a", 2);
      expect(survey.getVariable("c1"), "c1 after a = 2").toBe(20);
      expect(survey.getVariable("c2"), "c2 after a = 2").toBe(2);
      expect(log.counts, "calls after a = 2").toEqual({ c2: 2, c1: 2 });
      survey.calculatedValues.splice(1, 1);
      reset();
      survey.setValue("a", 3);
      expect(survey.getVariable("c1"), "c1 after a = 3").toBe(20);
      expect(survey.getVariable("c2"), "c2 after a = 3: the variable stays").toBe(2);
      expect(log.counts, "calls after a = 3").toEqual({});
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("an expression replaced in place uses its new variables", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {c2} + 1)" },
        { name: "c2", expression: "tick('c2', {a})" },
        { name: "c3", expression: "tick('c3', {b})" }
      ]);
      const c1: any = survey.calculatedValues[0];
      survey.setValue("a", 1);
      survey.setValue("b", 5);
      const runner = c1.expressionRunner;
      c1.expression = "tick('c1', {c3} + 100)";
      reset();
      survey.setValue("b", 6);
      expect(c1.expressionRunner, "the runner object stays the same").toBe(runner);
      expect(survey.getVariable("c1"), "c1 after b = 6").toBe(106);
      expect(survey.getVariable("c2"), "c2 after b = 6").toBe(1);
      expect(survey.getVariable("c3"), "c3 after b = 6").toBe(6);
      expect(log.counts, "calls after b = 6").toEqual({ c3: 2, c1: 2 });
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("a dotted reference to a calculated value is not a dependent", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {c2.x})" },
        { name: "c2", expression: "tick('c2', {a})" }
      ]);
      reset();
      survey.setValue("a", { x: 7 });
      expect(survey.getVariable("c1"), "c1 after a = { x: 7 }").toBe(7);
      expect(survey.getVariable("c2"), "c2 after a = { x: 7 }").toEqual({ x: 7 });
      expect(log.counts, "calls after a = { x: 7 }").toEqual({ c2: 3, c1: 2 });
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("dependents run in list order, not in the order the expression names them", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {c3} + {c2})" },
        { name: "c2", expression: "tick('c2', {a})" },
        { name: "c3", expression: "tick('c3', {a} * 10)" }
      ]);
      reset();
      survey.setValue("a", 1);
      expect(survey.getVariable("c1"), "c1 after a = 1").toBe(11);
      expect(survey.getVariable("c2"), "c2 after a = 1").toBe(1);
      expect(survey.getVariable("c3"), "c3 after a = 1").toBe(10);
      expect(log.counts, "calls after a = 1").toEqual({ c2: 2, c3: 2, c1: 2 });
      expect(log.sequence, "sequence after a = 1").toEqual(["c2", "c3", "c1", "c2", "c3", "c1"]);
      reset();
      survey.setValue("b", 1);
      expect(survey.getVariable("c1"), "c1 after b = 1").toBe(11);
      expect(survey.getVariable("c2"), "c2 after b = 1").toBe(1);
      expect(survey.getVariable("c3"), "c3 after b = 1").toBe(10);
      expect(log.counts, "calls after b = 1").toEqual({});
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
  test("the runner's variables array grows in place after the dependents were found", () => {
    const { log, reset } = registerTick();
    try {
      const survey = createSurvey([
        { name: "c1", expression: "tick('c1', {a})" },
        { name: "c2", expression: "tick('c2', {a} * 10)" }
      ]);
      const c1: any = survey.calculatedValues[0];
      survey.setValue("a", 1);
      reset();
      survey.setValue("a", 2);
      expect(log.sequence, "sequence after a = 2: c2 is not a dependent yet").toEqual(["c1", "c2", "c1", "c2"]);
      const variables = c1.expressionRunner.getVariables();
      variables.push("c2");
      reset();
      survey.setValue("a", 3);
      expect(c1.expressionRunner.getVariables(), "the array stays the same object").toBe(variables);
      expect(survey.getVariable("c1"), "c1 after a = 3").toBe(3);
      expect(survey.getVariable("c2"), "c2 after a = 3").toBe(30);
      expect(log.counts, "calls after a = 3").toEqual({ c2: 2, c1: 2 });
      expect(log.sequence, "sequence after a = 3").toEqual(["c2", "c1", "c2", "c1"]);
    } finally {
      FunctionFactory.Instance.unregister("tick");
    }
  });
});
describe("CalculatedValues at load: only the calculated values of a cycle run again", () => {
  const registerLoadCounter = () => {
    const counts: { [name: string]: number } = {};
    FunctionFactory.Instance.register({
      name: "loadCount",
      func: (params: any[]) => {
        counts[params[0]] = (counts[params[0]] || 0) + 1;
        return params[1];
      },
      resultDependsOn: "parameters"
    });
    return counts;
  };
  test("a cycle reaches the same values at load, with the same number of evaluations", () => {
    const counts = registerLoadCounter();
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "x" }],
        calculatedValues: [
          { name: "a", expression: "loadCount('a', {b} + {x})" },
          { name: "b", expression: "loadCount('b', {a} + 1)" }
        ]
      });
      expect(survey.getVariable("a"), "a after load").toBe(11);
      expect(survey.getVariable("b"), "b after load").toBe(11);
      expect(counts, "evaluations at load").toEqual({ a: 11, b: 11 });
    } finally {
      FunctionFactory.Instance.unregister("loadCount");
    }
  });
  test("a calculated value and the conditions that read it are evaluated once at load", () => {
    const counts = registerLoadCounter();
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "v", visibleIf: "loadCount('visibleIf', {cv}) = 1" },
          { type: "radiogroup", name: "r", choices: [{ value: 1, visibleIf: "loadCount('choice', {cv}) = 1" }, 2] }
        ],
        calculatedValues: [{ name: "cv", expression: "loadCount('cv', 1)" }]
      });
      expect(survey.getVariable("cv"), "cv after load").toBe(1);
      expect(survey.getQuestionByName("v").isVisible, "v is visible").toBe(true);
      expect(survey.getQuestionByName("r").visibleChoices.length, "the choice is visible").toBe(2);
      expect(counts, "evaluations at load").toEqual({ cv: 1, visibleIf: 1, choice: 1 });
    } finally {
      FunctionFactory.Instance.unregister("loadCount");
    }
  });
  test("a default value expression that reads a calculated value still gets a second pass at load", () => {
    const counts = registerLoadCounter();
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "v", visibleIf: "loadCount('visibleIf', {cv}) = 1" },
          { type: "radiogroup", name: "r", choices: [{ value: 1, visibleIf: "loadCount('choice', {cv}) = 1" }, 2] },
          { type: "text", name: "d", defaultValueExpression: "loadCount('default', {cv})" }
        ],
        calculatedValues: [{ name: "cv", expression: "loadCount('cv', 1)" }]
      });
      expect(survey.getValue("d"), "d after load").toBe(1);
      expect(survey.getQuestionByName("v").isVisible, "v is visible").toBe(true);
      expect(counts, "evaluations at load").toEqual({ default: 3, cv: 2, visibleIf: 2, choice: 2 });
    } finally {
      FunctionFactory.Instance.unregister("loadCount");
    }
  });
  test("a value a survey trigger sets when a calculated value changes reaches the conditions and the calculated values that read it", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3", visibleIf: "{q2} = 5" }],
      triggers: [{ type: "setvalue", expression: "{cv} = 1", setToName: "q2", setValue: 5 }],
      calculatedValues: [
        { name: "cv2", expression: "{q2} + 1" },
        { name: "cv", expression: "1" }
      ]
    });
    expect(survey.getValue("q2"), "q2 after load").toBe(5);
    expect(survey.getQuestionByName("q3").isVisible, "q3 is visible").toBe(true);
    expect(survey.getVariable("cv2"), "cv2 after load").toBe(6);
  });
  test("a value an onVariableChanged handler sets when a calculated value changes reaches the conditions and the calculated values that read it", () => {
    const survey = new SurveyModel();
    survey.onVariableChanged.add((_, options) => {
      if (options.name === "cv") survey.setValue("q2", 5);
    });
    survey.fromJSON({
      elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3", visibleIf: "{q2} = 5" }],
      calculatedValues: [
        { name: "cv2", expression: "{q2} + 1" },
        { name: "cv", expression: "1" }
      ]
    });
    expect(survey.getValue("q2"), "q2 after load").toBe(5);
    expect(survey.getQuestionByName("q3").isVisible, "q3 is visible").toBe(true);
    expect(survey.getVariable("cv2"), "cv2 after load").toBe(6);
  });
  test("a calculated value declared after the one that reads it gives its value at load: by its name, in another letter case and through a path", () => {
    const check = (expression: string, bValue: string, caseName: string) => {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "q", visibleIf: "{a} = 3" }],
        calculatedValues: [
          { name: "a", expression: expression },
          { name: "b", expression: bValue }
        ]
      });
      expect(survey.getVariable("a"), caseName + ": a after load").toBe(3);
      expect(survey.getQuestionByName("q").isVisible, caseName + ": q is visible").toBe(true);
    };
    check("{b} + 1", "2", "by its name");
    check("{B} + 1", "2", "in another letter case");
    check("{b[0]} + 1", "[2, 3]", "through a path");
  });
  test("a calculated value whose first result is undefined gets the value of a later one it reads in another letter case", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q", visibleIf: "{a} = 2" }],
      calculatedValues: [
        { name: "a", expression: "{B}" },
        { name: "b", expression: "2" }
      ]
    });
    expect(survey.getVariable("a"), "a after load").toBe(2);
    expect(survey.getQuestionByName("q").isVisible, "q is visible").toBe(true);
  });
  test("a cycle of three calculated values that settles after several loops reaches the same values at load", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "x", defaultValue: 1 }],
      calculatedValues: [
        { name: "a", expression: "iif({c} > 0, {c}, 1)" },
        { name: "b", expression: "{a} + {x}" },
        { name: "c", expression: "iif({b} >= 3, 3, {b})" }
      ]
    });
    expect(survey.getVariable("a"), "a after load").toBe(3);
    expect(survey.getVariable("b"), "b after load").toBe(4);
    expect(survey.getVariable("c"), "c after load").toBe(3);
  });
  test("a calculated value that reads a cycle gets the cycle's final value at load, declared before or after it", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "x" }],
      calculatedValues: [
        { name: "c0", expression: "{a} * 2" },
        { name: "a", expression: "{b} + {x}" },
        { name: "b", expression: "{a} + 1" },
        { name: "c", expression: "{a} * 2" }
      ]
    });
    expect(survey.getVariable("a"), "a after load").toBe(11);
    expect(survey.getVariable("b"), "b after load").toBe(11);
    expect(survey.getVariable("c0"), "c0 after load").toBe(22);
    expect(survey.getVariable("c"), "c after load").toBe(22);
  });
  test("a cycle and a default value expression that reads it share the bound of the load's passes", () => {
    const counts = registerLoadCounter();
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "x" }, { type: "text", name: "d", defaultValueExpression: "{a}" }],
        calculatedValues: [
          { name: "a", expression: "loadCount('a', {b} + {x})" },
          { name: "b", expression: "{a} + 1" }
        ]
      });
      expect(survey.getVariable("a"), "a after load").toBe(11);
      expect(survey.getVariable("b"), "b after load").toBe(11);
      expect(survey.getValue("d"), "d after load").toBe(11);
      expect(counts, "evaluations of a at load").toEqual({ a: 11 });
    } finally {
      FunctionFactory.Instance.unregister("loadCount");
    }
  });
  test("a custom function that does not say what its result depends on gets a second pass at load", () => {
    FunctionFactory.Instance.register("readLaterValue", function (this: any) {
      return this.survey.getVariable("b");
    });
    try {
      const survey = new SurveyModel({
        calculatedValues: [
          { name: "a", expression: "readLaterValue() + 1" },
          { name: "b", expression: "2" }
        ]
      });
      expect(survey.getVariable("a"), "a after load").toBe(3);
    } finally {
      FunctionFactory.Instance.unregister("readLaterValue");
    }
  });
  test("propertyValue() in a calculated value reads the element state the conditions set at load", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "x" }, { type: "text", name: "q1", visibleIf: "{x} = 1" }],
      calculatedValues: [{ name: "cv", expression: "propertyValue('q1', 'isVisible')" }]
    });
    expect(survey.getQuestionByName("q1").isVisible, "q1 is hidden").toBe(false);
    expect(survey.getVariable("cv"), "cv after load").toBe(false);
  });
  test("an onExpressionRunning handler that makes a calculated value read a later one gets a second pass at load", () => {
    const survey = new SurveyModel();
    survey.onExpressionRunning.add((_, options) => {
      if ((<any>options.element).name === "a" && options.propertyName === "expression") {
        options.expression = "{b} + 1";
      }
    });
    survey.fromJSON({
      calculatedValues: [
        { name: "a", expression: "1" },
        { name: "b", expression: "2" }
      ]
    });
    expect(survey.getVariable("a"), "a after load").toBe(3);
  });
  test("an answer after load runs the same passes as before", () => {
    const counts = registerLoadCounter();
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "x" }, { type: "text", name: "v", visibleIf: "loadCount('v', {cv}) = 2" }],
        calculatedValues: [{ name: "cv", expression: "loadCount('cv', {x} + 1)" }]
      });
      for (const key in counts) delete counts[key];
      survey.setValue("x", 1);
      expect(survey.getVariable("cv"), "cv after x = 1").toBe(2);
      expect(survey.getQuestionByName("v").isVisible, "v is visible").toBe(true);
      expect(counts, "evaluations after x = 1").toEqual({ cv: 2, v: 2 });
    } finally {
      FunctionFactory.Instance.unregister("loadCount");
    }
  });
});
