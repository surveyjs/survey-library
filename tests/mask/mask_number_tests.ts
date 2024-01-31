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
  let maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }), true, "#1");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }), true, "#2");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }), true, "#3");

  maskInstance = new InputMaskNumber({ mask: "", type: "numeric", min: -100, max: 100 });
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }), false, "#4");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }), true, "#5");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }), false, "#6");
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
  assert.equal(maskInstance.getNumberMaskedValue(""), "");
  assert.equal(maskInstance.getNumberMaskedValue("9"), "9");
  assert.equal(maskInstance.getNumberMaskedValue("123A"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("123a"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("12a3"), "123");
});

QUnit.test("get numeric masked invalid text matchWholeMask true", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getNumberMaskedValue("", true), "");
  assert.equal(maskInstance.getNumberMaskedValue("-", true), "");
  assert.equal(maskInstance.getNumberMaskedValue(".", true), "");
  assert.equal(maskInstance.getNumberMaskedValue(",", true), "");
  assert.equal(maskInstance.getNumberMaskedValue("0", true), "0");
  assert.equal(maskInstance.getNumberMaskedValue("-0", true), "0");
  assert.equal(maskInstance.getNumberMaskedValue("-9,", true), "-9");
  assert.equal(maskInstance.getNumberMaskedValue("9.", true), "9");
  assert.equal(maskInstance.getNumberMaskedValue("123,", true), "123");
});

QUnit.test("get numeric masked value by formated text", function(assert) {
  const maskInstance = new InputMaskNumber();
  assert.equal(maskInstance.getNumberMaskedValue("0"), "0");
  assert.equal(maskInstance.getNumberMaskedValue("01"), "1");
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
  assert.equal(maskInstance.getNumberMaskedValue("-0123"), "-123");
  assert.equal(maskInstance.getNumberMaskedValue("12-34"), "-1,234");
  assert.equal(maskInstance.getNumberMaskedValue("-123-,456.78"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("-123,45-678"), "12,345,678");
  assert.equal(maskInstance.getNumberMaskedValue("123,4-56.789"), "-123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,45--6,78,101.12"), "12,345,678,101.12");
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

QUnit.test("numeric processInput: insert characters", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });
  let result = maskInstance.processInput({ insertedCharacters: "1", selectionStart: 1, selectionEnd: 1, prevValue: "0", inputDirection: "leftToRight" });
  assert.equal(result.text, "1", "type #1");
  assert.equal(result.cursorPosition, 1, "type #1");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,234", "type #2.0");
  assert.equal(result.cursorPosition, 5, "type #2.0");

  result = maskInstance.processInput({ insertedCharacters: ",", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "leftToRight" });
  assert.equal(result.text, "123", "type #2.1");
  assert.equal(result.cursorPosition, 3, "type #2.1");

  result = maskInstance.processInput({ insertedCharacters: ".", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.", "type #2.2");
  assert.equal(result.cursorPosition, 4, "type #2.2");

  result = maskInstance.processInput({ insertedCharacters: "a", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.", "type #3.0");
  assert.equal(result.cursorPosition, 4, "type #3.0");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.4", "type #3.1");
  assert.equal(result.cursorPosition, 5, "type #3.1");

  result = maskInstance.processInput({ insertedCharacters: "456", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.45", "type #3.2");
  assert.equal(result.cursorPosition, 6, "type #3.2");

  result = maskInstance.processInput({ insertedCharacters: ".", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.", "type #3.3");
  assert.equal(result.cursorPosition, 4, "type #3.3");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 1, selectionEnd: 1, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,023.45", "type #4.0");
  assert.equal(result.cursorPosition, 3, "type #4.0");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 4, selectionEnd: 4, prevValue: "1,023.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "10,203.45", "type #4.1");
  assert.equal(result.cursorPosition, 5, "type #4.1");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,230.45", "type #5.0");
  assert.equal(result.cursorPosition, 5, "type #5.0");

  result = maskInstance.processInput({ insertedCharacters: "d", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.45", "type #5.1");
  assert.equal(result.cursorPosition, 3, "type #5.1");

  result = maskInstance.processInput({ insertedCharacters: ".", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.45", "type #5.2");
  assert.equal(result.cursorPosition, 4, "type #5.2");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "10,234.56", "type #6.1");
  assert.equal(result.cursorPosition, 2, "type #6.1");

  result = maskInstance.processInput({ insertedCharacters: "d", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,234.56", "type #6.2");
  assert.equal(result.cursorPosition, 1, "type #6.2");

  result = maskInstance.processInput({ insertedCharacters: ",", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,234.56", "type #6.3");
  assert.equal(result.cursorPosition, 1, "type #6.3");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 3, selectionEnd: 3, prevValue: "1,234,567.89", inputDirection: "leftToRight" });
  assert.equal(result.text, "12,034,567.89", "type #7.0");
  assert.equal(result.cursorPosition, 4, "type #7.0");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 2, selectionEnd: 2, prevValue: "1,234,567.89", inputDirection: "leftToRight" });
  assert.equal(result.text, "10,234,567.89", "type #7.1");
  assert.equal(result.cursorPosition, 2, "type #7.1");
});

QUnit.test("numeric processInput simple number: delete characters", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 1, selectionEnd: 2, prevValue: "0", inputDirection: "leftToRight" });
  assert.equal(result.text, "0", "#1");
  assert.equal(result.cursorPosition, 1, "#1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 0, selectionEnd: 1, prevValue: "0", inputDirection: "leftToRight" });
  assert.equal(result.text, "", "remove 0");
  assert.equal(result.cursorPosition, 0, "remove 0");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "123", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "remove 3");
  assert.equal(result.cursorPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 1, selectionEnd: 2, prevValue: "123", inputDirection: "leftToRight" });
  assert.equal(result.text, "13", "remove 2");
  assert.equal(result.cursorPosition, 1, "remove 2");

});

QUnit.test("numeric processInput decimal number: delete characters", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "12.45", "remove 3");
  assert.equal(result.cursorPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "12,345", "remove dot");
  assert.equal(result.cursorPosition, 4, "remove dot");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "123.5", "remove 4");
  assert.equal(result.cursorPosition, 4, "remove 4");
});

QUnit.test("numeric processInput big number: delete characters", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 0, selectionEnd: 1, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "234,567", "remove 1");
  assert.equal(result.cursorPosition, 0, "remove 1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 1, selectionEnd: 2, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,234,567", "try remove ,");
  assert.equal(result.cursorPosition, 2, "try remove ,");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "124,567", "remove 3");
  assert.equal(result.cursorPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "123,567", "remove 4");
  // assert.equal(result.cursorPosition, 3, "remove 4");
  assert.equal(result.cursorPosition, 4, "remove 4");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 7, selectionEnd: 8, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "123,457", "remove 6");
  assert.equal(result.cursorPosition, 6, "remove 6");
});

QUnit.test("numeric processInput simple number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 0, selectionEnd: 0, prevValue: "0", inputDirection: "rightToLeft" });
  assert.equal(result.text, "0", "#1");
  assert.equal(result.cursorPosition, 0, "#1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 0, selectionEnd: 1, prevValue: "0", inputDirection: "rightToLeft" });
  assert.equal(result.text, "", "remove 0");
  assert.equal(result.cursorPosition, 0, "remove 0");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "123", inputDirection: "rightToLeft" });
  assert.equal(result.text, "12", "remove 3");
  assert.equal(result.cursorPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 1, selectionEnd: 2, prevValue: "123", inputDirection: "rightToLeft" });
  assert.equal(result.text, "13", "remove 2");
  assert.equal(result.cursorPosition, 1, "remove 2");

});

QUnit.test("numeric processInput decimal number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "123.45", inputDirection: "rightToLeft" });
  assert.equal(result.text, "12.45", "remove 3");
  assert.equal(result.cursorPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "123.45", inputDirection: "rightToLeft" });
  assert.equal(result.text, "12,345", "remove dot");
  assert.equal(result.cursorPosition, 4, "remove dot");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "123.45", inputDirection: "rightToLeft" });
  assert.equal(result.text, "123.5", "remove 4");
  assert.equal(result.cursorPosition, 4, "remove 4");
});

QUnit.test("numeric processInput big number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 0, selectionEnd: 1, prevValue: "1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "234,567", "remove 1");
  assert.equal(result.cursorPosition, 0, "remove 1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 1, selectionEnd: 2, prevValue: "1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "1,234,567", "try remove ,");
  assert.equal(result.cursorPosition, 1, "try remove ,");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "124,567", "remove 3");
  assert.equal(result.cursorPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "123,567", "remove 4");
  assert.equal(result.cursorPosition, 3, "remove 4");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 7, selectionEnd: 8, prevValue: "1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "123,457", "remove 6");
  assert.equal(result.cursorPosition, 6, "remove 6");
});

QUnit.test("numeric processInput: cut + paste characters", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric" });

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,267", "cut 34,5");
  assert.equal(result.cursorPosition, 3, "cut 34,5");

  result = maskInstance.processInput({ insertedCharacters: "00", selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "120,067", "cut 34,5 & insert 00");
  assert.equal(result.cursorPosition, 5, "cut 34,5 & insert 00");

  result = maskInstance.processInput({ insertedCharacters: "000000", selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "1,200,000,067", "cut 34,5 & insert 000000");
  assert.equal(result.cursorPosition, 11, "cut 34,5 & insert 000000");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "126", "cut 34.5");
  assert.equal(result.cursorPosition, 2, "cut 34.5");

  result = maskInstance.processInput({ insertedCharacters: "00", selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "12,006", "cut 34.5 & insert 00");
  assert.equal(result.cursorPosition, 5, "cut 34.5 & insert 00");

  result = maskInstance.processInput({ insertedCharacters: "000000", selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "120,000,006", "cut 34.5 & insert 000000");
  assert.equal(result.cursorPosition, 10, "cut 34.5 & insert 000000");
});

QUnit.test("numeric processInput: allowNegative false", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric", allowNegative: false });

  let result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "try insert minus");
  assert.equal(result.cursorPosition, 2, "try insert minus");
});

QUnit.test("numeric processInput: allowNegative true", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric", allowNegative: true });

  let result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12", "insert minus");
  assert.equal(result.cursorPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 2, selectionEnd: 2, prevValue: "-12", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "insert minus");
  assert.equal(result.cursorPosition, 1, "insert minus");
});

QUnit.test("numeric processInput: min", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric", allowNegative: true, min: -100 });

  let result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12", "insert minus");
  assert.equal(result.cursorPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12", "try insert 4");
  assert.equal(result.cursorPosition, 3, "try insert 4");

  result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "type 2");
  assert.equal(result.cursorPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "123", "try insert 3");
  assert.equal(result.cursorPosition, 3, "try insert 3");

  result = maskInstance.processInput({ insertedCharacters: "999", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "12,999", "try insert 999");
  assert.equal(result.cursorPosition, 6, "try insert 999");
});

QUnit.test("numeric processInput: max", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric", allowNegative: true, max: 100 });

  let result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "type 2");
  assert.equal(result.cursorPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "try insert 3");
  assert.equal(result.cursorPosition, 2, "try insert 3");

  result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12", "insert minus");
  assert.equal(result.cursorPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-124", "try insert 4");
  assert.equal(result.cursorPosition, 4, "try insert 4");

  result = maskInstance.processInput({ insertedCharacters: "999", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12,999", "try insert 999");
  assert.equal(result.cursorPosition, 7, "try insert 999");
});

QUnit.test("numeric processInput: min & max", function(assert) {
  const maskInstance = new InputMaskNumber({ mask: "", type: "numeric", allowNegative: true, min: -100, max: 100 });

  let result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "type 2");
  assert.equal(result.cursorPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "12", "try insert 3");
  assert.equal(result.cursorPosition, 2, "try insert 3");

  result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12", "insert minus");
  assert.equal(result.cursorPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "leftToRight" });
  assert.equal(result.text, "-12", "try insert 4");
  assert.equal(result.cursorPosition, 3, "try insert 4");

  result = maskInstance.processInput({ insertedCharacters: "", selectionStart: 1, selectionEnd: 2, prevValue: "-1", inputDirection: "leftToRight" });
  assert.equal(result.text, "-", "remove 1");
  assert.equal(result.cursorPosition, 1, "remove 1");
});