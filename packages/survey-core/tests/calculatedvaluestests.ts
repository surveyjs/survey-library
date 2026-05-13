import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";

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
