import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";

export default QUnit.module("CalculatedValues");

QUnit.test("Use calculated value in expression", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", defaultValue: 1 },
      { type: "text", name: "q2", defaultValue: 2 },
      { type: "text", name: "q3", visibleIf: "{var1} > 2" },
    ],
  });
  assert.equal(
    survey.getQuestionByName("q3").isVisible,
    false,
    "It is invisible by default var1 is undefined"
  );
  survey.calculatedValues.push(new CalculatedValue("var1", "{q1} + {q2}"));
  assert.equal(survey.getVariable("var1"), 3, "var1 is calculated");
  assert.equal(
    survey.getQuestionByName("q3").isVisible,
    true,
    "It is visible now var1 equals 3"
  );
  survey.setValue("q2", 1);
  assert.equal(survey.getVariable("var1"), 2, "var1 is re-calculated");
  assert.equal(
    survey.getQuestionByName("q3").isVisible,
    false,
    "It is invisible again, var1 equals 2"
  );
});
QUnit.test("Deserialize/serialize calculated values", function(assert) {
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
  assert.equal(survey.getVariable("var1"), 3, "var1 is calculated");
  assert.equal(
    survey.getQuestionByName("q3").isVisible,
    true,
    "It is visible, var1 equals 3"
  );
  assert.deepEqual(survey.toJSON(), json, "Serialized correctly");
});
QUnit.test("Include into result", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", defaultValue: 1 },
      { type: "text", name: "q2", defaultValue: 2 },
    ],
  });
  survey.calculatedValues.push(new CalculatedValue("var1", "{q1} + {q2}"));
  assert.equal(survey.getVariable("var1"), 3, "var1 is calculated");
  assert.deepEqual(survey.data, { q1: 1, q2: 2 });
  survey.calculatedValues[0].includeIntoResult = true;
  assert.deepEqual(survey.data, { q1: 1, q2: 2, var1: 3 });
});

QUnit.test("Use complex values in variables, Bug#T2705", function(assert) {
  var survey = new SurveyModel({});
  survey.setVariable("obj", { state: "CA" });
  survey.setVariable("arr", [{ state: "CA" }, { state: "TX" }]);
  assert.equal(survey.getVariable("obj.state"), "CA", "var1 is calculated");
  assert.equal(
    survey.getVariable("arr[0].state"),
    "CA",
    "get value from array"
  );
  assert.equal(survey.getVariable("arr.length"), 2, "get array length");
});

QUnit.test(
  "Error with calculated values on setting survey.data, Bug #1973",
  function(assert) {
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
    assert.equal(
      survey.getValue("question5"),
      12,
      "expression with calculated values returns correct value: {totale} = {var1} + {var2} = {question1} + {question3} = 7 + 5"
    );
  }
);

QUnit.test(
  "Survey.data doesn't contain the calculatedValue change, if it exists before, Bug #2133",
  function(assert) {
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
    assert.deepEqual(
      survey.data,
      { fruit: "orange", finalAnswer: "orange" },
      "finalAnswer is 'orange' too."
    );
  }
);
QUnit.test(
  "defaultValue and survey.clearInvisibleValues='onHidden', Bug#2428",
  function(assert) {
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
    assert.equal(calcValue.value, 0, "0 + 0");
    q1.visible = true;
    assert.equal(calcValue.value, 1, "1 + 0");
    q2.visible = true;
    assert.equal(calcValue.value, 3, "1 + 2");
    q1.visible = false;
    assert.equal(calcValue.value, 2, "0 + 2");
  }
);

QUnit.test(
  "survey.clearIncorrectValues with parameter removeNonExistingRootKeys",
  function(assert) {
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
    assert.ok(calcValue, "Calc value is here");
    survey.setValue("q1", "v1");
    survey.setValue("q2", "v2");
    survey.setValue("q3", "v3");
    survey.setValue("val3", "v4");
    assert.deepEqual(
      survey.data,
      { q1: "v1", q2: "v2", q3: "v3", val1: "v1v2", val3: "v4" },
      "values set correctly"
    );
    survey.clearIncorrectValues(true);
    assert.deepEqual(
      survey.data,
      { q1: "v1", q2: "v2", val1: "v1v2" },
      "Remove q3 and val3 keys"
    );
  }
);

QUnit.test("Compete trigger and calculatedValues, Bug#2595", function(assert) {
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
  assert.equal(
    survey.calculatedValues.length,
    1,
    "There is one calcualted values"
  );
  var calcValue: CalculatedValue = survey.calculatedValues[0];
  assert.equal(calcValue.name, "result", "calcValue is here");
  var isCompleteOnTrigger = false;
  survey.onComplete.add(function(sender, options) {
    isCompleteOnTrigger = options.isCompleteOnTrigger;
  });
  survey.setValue("q1", "val1");
  survey.nextPage();
  assert.equal(survey.state, "completed", "survey is completed");
  assert.equal(isCompleteOnTrigger, true, "complete on trigger");
});

QUnit.test(
  "Survey.onPropertyValueChangedCallback for calculatedValues, Bug#2604",
  function(assert) {
    var json = {
      questions: [
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

    assert.equal(counter, 0, "initial");
    survey.calculatedValues[0].name = "var2";
    assert.equal(counter, 1, "calculdatedValue: callback called");
    assert.equal(
      propName,
      "name",
      "calculdatedValue: property name is correct"
    );
    assert.equal(testOldValue, "var1", "calculdatedValue: oldValue is correct");
    assert.equal(testNewValue, "var2", "calculdatedValue: newValue is correct");
    survey.calculatedValues[0].expression = "1+2+3";
    assert.equal(counter, 2, "calculdatedValue: callback called #2");
    assert.equal(
      propName,
      "expression",
      "calculdatedValue: property name is correct #2"
    );
    assert.equal(
      testOldValue,
      "1+2",
      "calculdatedValue: oldValue is correct #2"
    );
    assert.equal(
      testNewValue,
      "1+2+3",
      "calculdatedValue: newValue is correct #2"
    );
  }
);
QUnit.test("Use calculated value in text processing", function(assert) {
  var json = {
    questions: [
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
  assert.equal(question.locTitle.renderedHtml, "title: 3");
});
QUnit.test("Fire onVariableChanged on changing calculated value", function(assert) {
  const json = {
    questions: [
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
  assert.equal(survey.calculatedValues[0].value, 2, "The value set correctly");
  survey.setValue("q1", 2);
  assert.equal(survey.calculatedValues[0].value, 3, "The value updated correctly");
  assert.equal(counter, 1, "onVariableChanged is fired one time");
  assert.equal(name, "var1", "options.name is correct");
  assert.equal(value, 3, "options.value is correct");
});
