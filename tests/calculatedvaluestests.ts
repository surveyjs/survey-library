import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";

export default QUnit.module("CalculatedValues");

QUnit.test("Use calculated value in expression", function (assert) {
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
QUnit.test("Deserialize/serialize calculated values", function (assert) {
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
QUnit.test("Include into result", function (assert) {
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

QUnit.test("Use complex values in variables, Bug#T2705", function (assert) {
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
  function (assert) {
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
  function (assert) {
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
