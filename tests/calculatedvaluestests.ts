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
