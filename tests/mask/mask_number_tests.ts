import { getNumberMaskedValue, getNumberUnmaskedValue, parseNumber, getNumberMaskLiterals, splitString } from "../../src/mask/mask_number";

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

QUnit.test("splitString", assert => {
  let result = splitString("1234567");
  assert.equal(result.length, 3);
  assert.equal(result[0], "123");
  assert.equal(result[1], "456");
  assert.equal(result[2], "7");

  result = splitString("1234567", true);
  assert.equal(result.length, 3);
  assert.equal(result[0], "1");
  assert.equal(result[1], "234");
  assert.equal(result[2], "567");
});

QUnit.test("parsing numeric mask simple pattern", function(assert) {
  const mask = "9+";
  let result = getNumberMaskLiterals(mask);
  assert.equal(result.length, 1);
  assert.equal(result[0].type, "regex");
  assert.equal(result[0].value, "9");
  assert.equal(result[0].repeat, true);
});

QUnit.test("get numeric masked valid text", function(assert) {
  assert.equal(getNumberMaskedValue(123), "123");
  assert.equal(getNumberMaskedValue(123456), "123,456");
  assert.equal(getNumberMaskedValue(123456.78), "123,456.78");
  assert.equal(getNumberMaskedValue(123456.789), "123,456.78");
});

QUnit.test("get numeric masked invalid text", function(assert) {
  assert.equal(getNumberMaskedValue(""), "0");
  assert.equal(getNumberMaskedValue("9"), "9");
  assert.equal(getNumberMaskedValue("123A"), "123");
  assert.equal(getNumberMaskedValue("123a"), "123");
});

QUnit.test("get numeric unmasked valid text", function(assert) {
  assert.equal(getNumberUnmaskedValue("123"), 123);
  assert.equal(getNumberUnmaskedValue("123,456"), 123456);
  assert.equal(getNumberUnmaskedValue("123,456.78"), 123456.78);
  assert.equal(getNumberUnmaskedValue("123,456.789"), 123456.78);
  assert.equal(getNumberUnmaskedValue("123,456,789,101.12"), 123456789101.12);
});