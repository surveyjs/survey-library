import {NumericValidator, EmailValidator} from "../src/validator";

export default QUnit.module("Validators");

QUnit.test("Numeric validator", function (assert) {
    var validator = new NumericValidator();
    assert.notEqual(validator.validate("s5").error, null, "Could not convert to numeric");
    assert.equal(validator.validate(5), null, "There is no limits here");
    assert.equal(validator.validate("5").value, 5, "Convert to numeric");
    assert.equal(validator.validate("5").error, null, "There is no error");
    validator.minValue = 10;
    assert.notEqual(validator.validate(5).error, null, "There is should be an error. The value is low.");
    validator.maxValue = 20;
    assert.notEqual(validator.validate(25).error, null, "There is should be an error. The value is high.");
    assert.equal(validator.validate("15").error, null, "There value is between minValue and maxValue");
    assert.equal(validator.validate(15), null, "everything is fine - return null");
});

QUnit.test("Email validator", function (assert) {
    var validator = new EmailValidator();
    assert.equal(validator.validate("my@mail.com"), null, "Could convert the correct e-mail");
    assert.notEqual(validator.validate("@mail.com").error, null, "Could convert the incorrect correct e-mail");
});
