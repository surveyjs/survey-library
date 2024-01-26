import { splitString, InputMaskNumber } from "../../src/mask/mask_number";

export default QUnit.module("Numeric mask");

QUnit.test("splitString", assert => {
  let result = splitString("1234567", false);
  assert.equal(result.length, 3);
  assert.equal(result[0], "123");
  assert.equal(result[1], "456");
  assert.equal(result[2], "7");

  result = splitString("1234567");
  assert.equal(result.length, 3);
  assert.equal(result[0], "1");
  assert.equal(result[1], "234");
  assert.equal(result[2], "567");
});

QUnit.test("parseNumber", assert => {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.parseNumber(123).integralPart, 123);
  assert.equal(maskInstance.parseNumber(123).fractionalPart, 0);
  assert.equal(maskInstance.parseNumber("123").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123").fractionalPart, 0);

  assert.equal(maskInstance.parseNumber(123.45).integralPart, 123);
  assert.equal(maskInstance.parseNumber(123.45).fractionalPart, 45);
  assert.equal(maskInstance.parseNumber("123.45").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123.45").fractionalPart, 45);

  assert.equal(maskInstance.parseNumber(".45").integralPart, 0);
  assert.equal(maskInstance.parseNumber(".45").fractionalPart, 45);
  assert.equal(maskInstance.parseNumber("123.").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123.").fractionalPart, 0);
});

QUnit.test("validationNumber", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }), true, "#1");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }), true, "#2");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }), true, "#3");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, -100, 100), false, "#4");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, -100, 100), true, "#5");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, -100, 100), false, "#6");
});

QUnit.test("get numeric masked valid text", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getNumberMaskedValue(123), "123");
  assert.equal(maskInstance.getNumberMaskedValue(123456), "123,456");
  assert.equal(maskInstance.getNumberMaskedValue(123456.78), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue(123456.789), "123,456.78");
});

QUnit.test("get numeric masked invalid text", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getNumberMaskedValue(""), "0");
  assert.equal(maskInstance.getNumberMaskedValue("9"), "9");
  assert.equal(maskInstance.getNumberMaskedValue("123A"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("123a"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("12a3"), "123");
});

QUnit.test("get numeric masked value by formated text", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getNumberMaskedValue("123"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("1234"), "1,234");
  assert.equal(maskInstance.getNumberMaskedValue("123,"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("123."), "123.");
  assert.equal(maskInstance.getNumberMaskedValue("123.4"), "123.4");
  assert.equal(maskInstance.getNumberMaskedValue("123,."), "123.");
  assert.equal(maskInstance.getNumberMaskedValue("1239,456"), "1,239,456");
  assert.equal(maskInstance.getNumberMaskedValue("1239456"), "1,239,456");
  assert.equal(maskInstance.getNumberMaskedValue("123,456.78"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,45678"), "12,345,678");
  assert.equal(maskInstance.getNumberMaskedValue("123,456.789"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,456,78,101.12"), "12,345,678,101.12");
});

QUnit.test("get numeric masked negative value by formated text", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getNumberMaskedValue("-123"), "-123");
  assert.equal(maskInstance.getNumberMaskedValue("12-34"), "-1,234");
  assert.equal(maskInstance.getNumberMaskedValue("-123-,456.78"), "-123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("-123,45-678"), "-12,345,678");
  assert.equal(maskInstance.getNumberMaskedValue("123,4-56.789"), "-123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,45--6,78,101.12"), "-12,345,678,101.12");
});

QUnit.test("get numeric masked not allow negative value by formated text", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric", allowNegative: false });
  assert.equal(maskInstance.getNumberMaskedValue("-123"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("12-34"), "1,234");
  assert.equal(maskInstance.getNumberMaskedValue("-123-,456.78"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("-123,45-678"), "12,345,678");
  assert.equal(maskInstance.getNumberMaskedValue("123,4-56.789"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,45--6,78,101.12"), "12,345,678,101.12");
});

QUnit.test("get numeric unmasked valid text", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getUnmaskedValue("123"), 123);
  assert.equal(maskInstance.getUnmaskedValue("123,456"), 123456);
  assert.equal(maskInstance.getUnmaskedValue("123,456.78"), 123456.78);
  assert.equal(maskInstance.getUnmaskedValue("123,456.789"), 123456.78);
  assert.equal(maskInstance.getUnmaskedValue("123,456,789,101.12"), 123456789101.12);
});