import { syntacticAnalysisMask } from "../../src/mask/mask_utils";
import { getNumberMaskedValue, getNumberUnmaskedValue, parseNumber } from "../../src/mask/number_mask";

export default QUnit.module("Numeric mask");

QUnit.test("parseNumber", assert => {
  assert.equal(parseNumber(123).integralPart, 123);
  assert.equal(parseNumber(123).fractionalPart, 0);
  assert.equal(parseNumber("123").integralPart, 123);
  assert.equal(parseNumber("123").fractionalPart, 0);

  assert.equal(parseNumber(123.45).integralPart, 123);
  assert.equal(parseNumber(123.45).fractionalPart, 45);
  assert.equal(parseNumber("123.45").integralPart, 123);
  assert.equal(parseNumber("123.45").fractionalPart, 45);

  assert.equal(parseNumber(".45").integralPart, 0);
  assert.equal(parseNumber(".45").fractionalPart, 45);
  assert.equal(parseNumber("123.").integralPart, 123);
  assert.equal(parseNumber("123.").fractionalPart, 0);
});

QUnit.test("parsing numeric mask simple pattern", function(assert) {
  const mask = "9+";
  let result = syntacticAnalysisMask(mask);
  assert.equal(result.length, 1);
  assert.equal(result[0].type, "regex");
  assert.equal(result[0].value, "9");
  assert.equal(result[0].repeat, true);
});

QUnit.test("get numeric masked valid text", function(assert) {
  const customMask = "9+";
  assert.equal(getNumberMaskedValue(123, customMask), "123");
  assert.equal(getNumberMaskedValue(123456, customMask), "123,456");
  assert.equal(getNumberMaskedValue(123456.78, customMask), "123,456.78");
  assert.equal(getNumberMaskedValue(123456.789, customMask), "123,456.78");
});

// QUnit.test("get numeric masked invalid text", function(assert) {
//   const customMask = "9+";
//   assert.equal(getMaskedValueByPattern("", customMask, true), "0");
//   assert.equal(getMaskedValueByPattern("9", customMask, true), "9");
//   assert.equal(getMaskedValueByPattern("123A", customMask, true), "123");
//   assert.equal(getMaskedValueByPattern("123a", customMask, true), "123");
// });