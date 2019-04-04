import { Helpers } from "../src/helpers";
import { EmailValidator } from "../src/validator";
import { SurveyModel } from "../src/survey";
import { ProcessValue } from "../src/conditionProcessValue";

export default QUnit.module("Helpers");

QUnit.test("Event hasEvents property", function(assert) {
  assert.ok(Helpers.isArrayContainsEqual([1], [1]), "Arrays are equal");
  assert.notOk(Helpers.isArrayContainsEqual([1], [1, 2]), "Different length");
  assert.notOk(
    Helpers.isArrayContainsEqual([1, 3], [1, 2]),
    "The content of array is not the same"
  );
  assert.ok(
    Helpers.isArrayContainsEqual([2, 1], [1, 2]),
    "The content of array is the same"
  );
  assert.ok(
    Helpers.isArraysEqual([2, 1], [1, 2], true),
    "Ignore Order = true: We believe it is the same arrays"
  );
  assert.notOk(
    Helpers.isArraysEqual([2, 1], [1, 2]),
    "Ignore Order = false: We believe it is not the same arrays"
  );
});
QUnit.test("isTwoValueEquals with validators", function(assert) {
  var survey = new SurveyModel();
  var validators1 = [];
  var validator1 = new EmailValidator();
  validator1.errorOwner = survey;
  validator1.text = "en-text";
  validators1.push(validator1);

  var validators2 = [];
  var validator2 = new EmailValidator();
  validator2.errorOwner = survey;
  validator2.text = "en-text";
  validators2.push(validator2);
  survey.locale = "de";
  validator2.text = "de-text";
  assert.equal(
    Helpers.isTwoValueEquals(validators1, validators2),
    false,
    "These two arrays are not equal"
  );
  survey.locale = "";
});

QUnit.test("Return correct value for array.length", function(assert) {
  var process = new ProcessValue();
  assert.equal(
    process.getValue("ar.length", { ar: [1, 2] }),
    2,
    "There are two values in array"
  );
  assert.equal(
    process.getValue("ar.length", { ar: [] }),
    0,
    "Return 0 for empty array"
  );
  assert.equal(
    process.getValue("ar.length", { ar: null }),
    0,
    "Return 0 for null value"
  );
  assert.equal(
    process.getValue("ar.length", {}),
    0,
    "Return 0 for undefined array"
  );
  //Test for bug: #1243
  assert.equal(process.getValue("region", {}), null, "Return null string");
});
