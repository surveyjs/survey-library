import { InputMaskDateTime, getDateTimeLiterals } from "../../src/mask/mask_datetime";
import { settings } from "../../src/mask/mask_utils";

export default QUnit.module("Datetime mask");

QUnit.test("getDateTimeLiterals simple pattern", function(assert) {
  let result = getDateTimeLiterals("m/d/yy");
  assert.equal(result.length, 5);
  assert.equal(result[0].type, "month");
  assert.equal(result[0].value, "m");
  assert.equal(result[0].length, 1);
  assert.equal(result[1].type, "separator");
  assert.equal(result[1].value, "/");
  assert.equal(result[1].length, 1);
  assert.equal(result[2].type, "day");
  assert.equal(result[2].value, "d");
  assert.equal(result[2].length, 1);
  assert.equal(result[3].type, "separator");
  assert.equal(result[3].value, "/");
  assert.equal(result[3].length, 1);
  assert.equal(result[4].type, "year");
  assert.equal(result[4].value, "y");
  assert.equal(result[4].length, 2);
});

QUnit.test("getDateTimeLiterals simple pattern", function(assert) {
  let result = getDateTimeLiterals("mm/dd/yyyy");
  assert.equal(result.length, 5);
  assert.equal(result[0].type, "month");
  assert.equal(result[0].value, "m");
  assert.equal(result[0].length, 2);
  assert.equal(result[1].type, "separator");
  assert.equal(result[1].value, "/");
  assert.equal(result[1].length, 1);
  assert.equal(result[2].type, "day");
  assert.equal(result[2].value, "d");
  assert.equal(result[2].length, 2);
  assert.equal(result[3].type, "separator");
  assert.equal(result[3].value, "/");
  assert.equal(result[3].length, 1);
  assert.equal(result[4].type, "year");
  assert.equal(result[4].value, "y");
  assert.equal(result[4].length, 4);
});

QUnit.skip("get masked valid date text matchWholeMask = true", function(assert) {
  settings.placeholderChar = "*";
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  assert.equal(maskInstance.getMaskedValue(""), "**/**/****");
  assert.equal(maskInstance.getMaskedValue("1"), "1*/**/****");
  assert.equal(maskInstance.getMaskedValue("1234"), "12/3*/****");
  assert.equal(maskInstance.getMaskedValue("1230198"), "12/30/567*");
  assert.equal(maskInstance.getMaskedValue("12301987"), "12/30/1987");
  settings.placeholderChar = "_";
});
