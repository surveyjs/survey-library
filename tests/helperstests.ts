import { Helpers } from "../src/helpers";
import { EmailValidator } from "../src/validator";
import { SurveyModel } from "../src/survey";

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
  validator1.locOwner = survey;
  validator1.text = "en-text";
  validators1.push(validator1);

  var validators2 = [];
  var validator2 = new EmailValidator();
  validator2.locOwner = survey;
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
