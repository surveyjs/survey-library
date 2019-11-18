import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";

export default QUnit.module("CalculatedValues");

QUnit.test("Use calculated value in expression", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", defaultValue: 1 },
      { type: "text", name: "q2", defaultValue: 2 },
      { type: "text", name: "q3", visibleIf: "{var1} > 2" }
    ]
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
          { type: "text", name: "q3", visibleIf: "{var1} > 2" }
        ]
      }
    ],
    calculatedValues: [{ name: "var1", expression: "{q1} + {q2}" }]
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
      { type: "text", name: "q2", defaultValue: 2 }
    ]
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
