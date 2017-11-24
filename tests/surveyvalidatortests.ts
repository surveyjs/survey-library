import { NumericValidator, EmailValidator } from "../src/validator";

export default QUnit.module("Validators");

QUnit.test("Numeric validator", function(assert) {
  var validator = new NumericValidator();
  assert.notEqual(
    validator.validate("s5").error,
    null,
    "Could not convert to numeric"
  );
  assert.equal(validator.validate(5), null, "There are no limits (non-zero)");
  assert.equal(validator.validate(0), null, "There are no limits (zero)");
  assert.equal(
    validator.validate("5").value,
    5,
    "Convert to numeric (non-zero)"
  );
  assert.equal(
    validator.validate("5").error,
    null,
    "There is no error (non-zero)"
  );
  assert.equal(validator.validate("0").value, 0, "Convert to numeric (zero)");
  assert.equal(validator.validate("0").error, null, "There is no error (zero)");

  validator.minValue = 10;
  validator.maxValue = 20;
  assert.notEqual(
    validator.validate(5).error,
    null,
    "Value is too low. Limits are not 0."
  );
  assert.notEqual(
    validator.validate(25).error,
    null,
    "Value is too high. Limits are not 0."
  );
  assert.equal(
    validator.validate("15").error,
    null,
    "Value is between minValue and maxValue. Limits are not 0."
  );
  assert.equal(
    validator.validate(15),
    null,
    "Value is between minValue and maxValue. Return no errors. Limits are not 0."
  );

  validator.minValue = 0;
  validator.maxValue = 20;
  assert.notEqual(
    validator.validate(-1).error,
    null,
    "Value is too low. Low limit is 0."
  );
  assert.notEqual(
    validator.validate(25).error,
    null,
    "Value is too high. Low limit is 0."
  );
  assert.equal(
    validator.validate("15").error,
    null,
    "Value is between minValue and maxValue. Low limit is 0."
  );
  assert.equal(
    validator.validate(15),
    null,
    "Value is between minValue and maxValue. Return no errors. Low limit is 0."
  );

  validator.minValue = -20;
  validator.maxValue = 0;
  assert.notEqual(
    validator.validate(-21).error,
    null,
    "Value is too low. High limit is 0."
  );
  assert.notEqual(
    validator.validate(1).error,
    null,
    "Value is too high. High limit is 0."
  );
  assert.equal(
    validator.validate("-5").error,
    null,
    "Value is between minValue and maxValue. High limit is 0."
  );
  assert.equal(
    validator.validate(-5),
    null,
    "Value is between minValue and maxValue. Return no errors. High limit is 0."
  );
});

QUnit.test("Email validator", function(assert) {
  var validator = new EmailValidator();
  assert.equal(
    validator.validate("my@mail.com"),
    null,
    "Could convert the correct e-mail"
  );
  assert.notEqual(
    validator.validate("@mail.com").error,
    null,
    "Could convert the incorrect correct e-mail"
  );
});
