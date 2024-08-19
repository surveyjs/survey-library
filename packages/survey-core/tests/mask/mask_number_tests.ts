import { JsonObject } from "../../src/jsonobject";
import { splitString, InputMaskNumeric } from "../../src/mask/mask_numeric";
import { QuestionTextModel } from "../../src/question_text";

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
  const maskInstance = new InputMaskNumeric();
  assert.equal(maskInstance.parseNumber("123").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123").fractionalPart, 0);

  assert.equal(maskInstance.parseNumber("123.45").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123.45").fractionalPart, 45);

  assert.equal(maskInstance.parseNumber(".45").integralPart, 0);
  assert.equal(maskInstance.parseNumber(".45").fractionalPart, 45);
  assert.equal(maskInstance.parseNumber("123.").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123.").fractionalPart, 0);
});

QUnit.test("validationNumber: matchWholeMask is true", function(assert) {
  let maskInstance = new InputMaskNumeric();
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, true), true, "#1");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, true), true, "#2");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, true), true, "#3");

  maskInstance = new InputMaskNumeric();
  maskInstance.min = -100;
  maskInstance.max = 100;
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, true), false, "#4");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, true), true, "#5");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, true), false, "#6");
});

QUnit.test("validationNumber: matchWholeMask is false - one limit", function (assert) {
  let maskInstance = new InputMaskNumeric();
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), true, "#1");
  assert.equal(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, false), true, "#2");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, false), true, "#3");

  maskInstance.max = 100;
  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), true, "#4");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), true, "#5");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), false, "#6");

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), true, "#4.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), true, "#5.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), true, "#6.1");

  maskInstance.max = -100;
  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), false, "#4x");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), false, "#5x");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), false, "#6x");

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), true, "#4.1x");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), true, "#5.1x");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), true, "#6.1x");

  maskInstance.max = undefined as any;
  maskInstance.min = 100;

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), true, "#4.2");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), true, "#5.2");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), true, "#6.2");

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), false, "#4.3");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), false, "#5.3");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), false, "#6.3");

  maskInstance.min = -100;
  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), true, "#4.2n");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), true, "#5.2n");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), true, "#6.2n");

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), true, "#4.3n");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), true, "#5.3n");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), false, "#6.3n");

});

QUnit.test("validationNumber: matchWholeMask is false - both limits", function (assert) {
  let maskInstance = new InputMaskNumeric();
  maskInstance.max = 200;
  maskInstance.min = 100;

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), true, "#1");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), true, "#2");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), true, "#3");
  assert.equal(maskInstance.validateNumber({ integralPart: "1234", fractionalPart: "" }, false), false, "#4");

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), false, "#5");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), false, "#6");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), false, "#7");

  maskInstance.max = 100;
  maskInstance.min = -100;

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), true, "#1.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), true, "#2.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), false, "#3.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "1234", fractionalPart: "" }, false), false, "#4.1");

  assert.equal(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), true, "#5.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), true, "#6.1");
  assert.equal(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), false, "#7.1");
});

QUnit.test("get numeric masked valid text", function(assert) {
  const maskInstance = new InputMaskNumeric();
  assert.equal(maskInstance.getMaskedValue(123), "123");
  assert.equal(maskInstance.getMaskedValue(123456), "123,456");
  assert.equal(maskInstance.getMaskedValue(123456.78), "123,456.78");
  assert.equal(maskInstance.getMaskedValue(123456.789), "123,456.78");

  assert.equal(maskInstance.getMaskedValue("123456.78"), "123,456.78");
  assert.equal(maskInstance.getMaskedValue("123456.789"), "123,456.78");
});

QUnit.test("get numeric masked invalid text", function(assert) {
  const maskInstance = new InputMaskNumeric();
  assert.equal(maskInstance.getNumberMaskedValue(""), "");
  assert.equal(maskInstance.getNumberMaskedValue("9"), "9");
  assert.equal(maskInstance.getNumberMaskedValue("123A"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("123a"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("12a3"), "123");
});

QUnit.test("get numeric masked invalid text matchWholeMask true", function(assert) {
  const maskInstance = new InputMaskNumeric();
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
  const maskInstance = new InputMaskNumeric();
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
  const maskInstance = new InputMaskNumeric();
  assert.equal(maskInstance.getNumberMaskedValue("-123"), "-123");
  assert.equal(maskInstance.getNumberMaskedValue("-0123"), "-123");
  assert.equal(maskInstance.getNumberMaskedValue("12-34"), "-1,234");
  assert.equal(maskInstance.getNumberMaskedValue("-123-,456.78"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("-123,45-678"), "12,345,678");
  assert.equal(maskInstance.getNumberMaskedValue("123,4-56.789"), "-123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,45--6,78,101.12"), "12,345,678,101.12");
});

QUnit.test("get numeric masked not allow negative value by formated text", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = false;
  assert.equal(maskInstance.getNumberMaskedValue("-123"), "123");
  assert.equal(maskInstance.getNumberMaskedValue("12-34"), "1,234");
  assert.equal(maskInstance.getNumberMaskedValue("-123-,456.78"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("-123,45-678"), "12,345,678");
  assert.equal(maskInstance.getNumberMaskedValue("123,4-56.789"), "123,456.78");
  assert.equal(maskInstance.getNumberMaskedValue("123,45--6,78,101.12"), "12,345,678,101.12");
});

QUnit.test("get numeric unmasked valid text", function(assert) {
  const maskInstance = new InputMaskNumeric();
  assert.ok(maskInstance.getUnmaskedValue("") === undefined);
  assert.ok(maskInstance.getUnmaskedValue("0") === 0);
  assert.ok(maskInstance.getUnmaskedValue("123") === 123);
  assert.ok(maskInstance.getUnmaskedValue("123,456") === 123456);
  assert.ok(maskInstance.getUnmaskedValue("123,456.78") === 123456.78);
  assert.ok(maskInstance.getUnmaskedValue("123,456.789") === 123456.78);
  assert.ok(maskInstance.getUnmaskedValue("123,456,789,101.12") === 123456789101.12);
});

QUnit.test("get numeric unmasked invalid text", function (assert) {
  const maskInstance = new InputMaskNumeric();
  assert.ok(maskInstance.getUnmaskedValue(" ") === undefined);
  assert.ok(maskInstance.getUnmaskedValue(".") === undefined);
  assert.ok(maskInstance.getUnmaskedValue(",") === undefined);
  assert.ok(maskInstance.getUnmaskedValue("-") === undefined);
  assert.ok(maskInstance.getUnmaskedValue("@") === undefined);
  assert.ok(maskInstance.getUnmaskedValue("a") === undefined);
});

QUnit.test("get numeric unmasked valid text custom settings", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.setData({ "decimalSeparator": ",", "thousandsSeparator": "." });
  assert.ok(maskInstance.getUnmaskedValue("0") === 0);
  assert.ok(maskInstance.getUnmaskedValue("123") === 123);
  assert.ok(maskInstance.getUnmaskedValue("123.456") === 123456);
  assert.ok(maskInstance.getUnmaskedValue("123.456,78") === 123456.78);
  assert.ok(maskInstance.getUnmaskedValue("123.456,789") === 123456.78);
  assert.ok(maskInstance.getUnmaskedValue("123.456.789.101,12") === 123456789101.12);
});

QUnit.test("numeric processInput: insert characters", function(assert) {
  const maskInstance = new InputMaskNumeric();
  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 1, selectionEnd: 1, prevValue: "0", inputDirection: "forward" });
  assert.equal(result.value, "1", "type #1");
  assert.equal(result.caretPosition, 1, "type #1");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
  assert.equal(result.value, "1,234", "type #2.0");
  assert.equal(result.caretPosition, 5, "type #2.0");

  result = maskInstance.processInput({ insertedChars: ",", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
  assert.equal(result.value, "123", "type #2.1");
  assert.equal(result.caretPosition, 3, "type #2.1");

  result = maskInstance.processInput({ insertedChars: ".", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
  assert.equal(result.value, "123.", "type #2.2");
  assert.equal(result.caretPosition, 4, "type #2.2");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
  assert.equal(result.value, "123.", "type #3.0");
  assert.equal(result.caretPosition, 4, "type #3.0");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
  assert.equal(result.value, "123.4", "type #3.1");
  assert.equal(result.caretPosition, 5, "type #3.1");

  result = maskInstance.processInput({ insertedChars: "456", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
  assert.equal(result.value, "123.45", "type #3.2");
  assert.equal(result.caretPosition, 6, "type #3.2");

  result = maskInstance.processInput({ insertedChars: ".", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
  assert.equal(result.value, "123.", "type #3.3");
  assert.equal(result.caretPosition, 4, "type #3.3");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "1,023.45", "type #4.0");
  assert.equal(result.caretPosition, 3, "type #4.0");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "1,023.45", inputDirection: "forward" });
  assert.equal(result.value, "10,203.45", "type #4.1");
  assert.equal(result.caretPosition, 5, "type #4.1");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "1,230.45", "type #5.0");
  assert.equal(result.caretPosition, 5, "type #5.0");

  result = maskInstance.processInput({ insertedChars: "d", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "123.45", "type #5.1");
  assert.equal(result.caretPosition, 3, "type #5.1");

  result = maskInstance.processInput({ insertedChars: ".", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "123.45", "type #5.2");
  assert.equal(result.caretPosition, 4, "type #5.2");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "forward" });
  assert.equal(result.value, "10,234.56", "type #6.1");
  assert.equal(result.caretPosition, 2, "type #6.1");

  result = maskInstance.processInput({ insertedChars: "d", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "forward" });
  assert.equal(result.value, "1,234.56", "type #6.2");
  assert.equal(result.caretPosition, 1, "type #6.2");

  result = maskInstance.processInput({ insertedChars: ",", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "forward" });
  assert.equal(result.value, "1,234.56", "type #6.3");
  assert.equal(result.caretPosition, 1, "type #6.3");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "1,234,567.89", inputDirection: "forward" });
  assert.equal(result.value, "12,034,567.89", "type #7.0");
  assert.equal(result.caretPosition, 4, "type #7.0");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 2, selectionEnd: 2, prevValue: "1,234,567.89", inputDirection: "forward" });
  assert.equal(result.value, "10,234,567.89", "type #7.1");
  assert.equal(result.caretPosition, 2, "type #7.1");
});

QUnit.test("numeric processInput simple number: delete characters", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "0", inputDirection: "forward" });
  assert.equal(result.value, "0", "#1");
  assert.equal(result.caretPosition, 1, "#1");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "0", inputDirection: "forward" });
  assert.equal(result.value, "", "remove 0");
  assert.equal(result.caretPosition, 0, "remove 0");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
  assert.equal(result.value, "12", "remove 3");
  assert.equal(result.caretPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "123", inputDirection: "forward" });
  assert.equal(result.value, "13", "remove 2");
  assert.equal(result.caretPosition, 1, "remove 2");

});

QUnit.test("numeric processInput decimal number: delete characters", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "12.45", "remove 3");
  assert.equal(result.caretPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "12,345", "remove dot");
  assert.equal(result.caretPosition, 4, "remove dot");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "123.45", inputDirection: "forward" });
  assert.equal(result.value, "123.5", "remove 4");
  assert.equal(result.caretPosition, 4, "remove 4");
});

QUnit.test("numeric processInput big number: delete characters", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "234,567", "remove 1");
  assert.equal(result.caretPosition, 0, "remove 1");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "1,234,567", "try remove ,");
  assert.equal(result.caretPosition, 2, "try remove ,");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "124,567", "remove 3");
  assert.equal(result.caretPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "123,567", "remove 4");
  // assert.equal(result.caretPosition, 3, "remove 4");
  assert.equal(result.caretPosition, 4, "remove 4");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 7, selectionEnd: 8, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "123,457", "remove 6");
  assert.equal(result.caretPosition, 6, "remove 6");
});

QUnit.test("numeric processInput simple number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 0, prevValue: "0", inputDirection: "backward" });
  assert.equal(result.value, "0", "#1");
  assert.equal(result.caretPosition, 0, "#1");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "0", inputDirection: "backward" });
  assert.equal(result.value, "", "remove 0");
  assert.equal(result.caretPosition, 0, "remove 0");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123", inputDirection: "backward" });
  assert.equal(result.value, "12", "remove 3");
  assert.equal(result.caretPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "123", inputDirection: "backward" });
  assert.equal(result.value, "13", "remove 2");
  assert.equal(result.caretPosition, 1, "remove 2");

});

QUnit.test("numeric processInput decimal number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123.45", inputDirection: "backward" });
  assert.equal(result.value, "12.45", "remove 3");
  assert.equal(result.caretPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "123.45", inputDirection: "backward" });
  assert.equal(result.value, "12,345", "remove dot");
  assert.equal(result.caretPosition, 4, "remove dot");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "123.45", inputDirection: "backward" });
  assert.equal(result.value, "123.5", "remove 4");
  assert.equal(result.caretPosition, 4, "remove 4");
});

QUnit.test("numeric processInput big number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "1,234,567", inputDirection: "backward" });
  assert.equal(result.value, "234,567", "remove 1");
  assert.equal(result.caretPosition, 0, "remove 1");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "1,234,567", inputDirection: "backward" });
  assert.equal(result.value, "1,234,567", "try remove ,");
  assert.equal(result.caretPosition, 1, "try remove ,");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "1,234,567", inputDirection: "backward" });
  assert.equal(result.value, "124,567", "remove 3");
  assert.equal(result.caretPosition, 2, "remove 3");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "1,234,567", inputDirection: "backward" });
  assert.equal(result.value, "123,567", "remove 4");
  assert.equal(result.caretPosition, 3, "remove 4");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 7, selectionEnd: 8, prevValue: "1,234,567", inputDirection: "backward" });
  assert.equal(result.value, "123,457", "remove 6");
  assert.equal(result.caretPosition, 6, "remove 6");
});

QUnit.test("numeric processInput: cut + paste characters", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "1,267", "cut 34,5");
  assert.equal(result.caretPosition, 3, "cut 34,5");

  result = maskInstance.processInput({ insertedChars: "00", selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "120,067", "cut 34,5 & insert 00");
  assert.equal(result.caretPosition, 5, "cut 34,5 & insert 00");

  result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "forward" });
  assert.equal(result.value, "1,200,000,067", "cut 34,5 & insert 000000");
  assert.equal(result.caretPosition, 11, "cut 34,5 & insert 000000");

  result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "forward" });
  assert.equal(result.value, "126", "cut 34.5");
  assert.equal(result.caretPosition, 2, "cut 34.5");

  result = maskInstance.processInput({ insertedChars: "00", selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "forward" });
  assert.equal(result.value, "12,006", "cut 34.5 & insert 00");
  assert.equal(result.caretPosition, 5, "cut 34.5 & insert 00");

  result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "forward" });
  assert.equal(result.value, "120,000,006", "cut 34.5 & insert 000000");
  assert.equal(result.caretPosition, 10, "cut 34.5 & insert 000000");
});

QUnit.test("numeric processInput: allowNegativeValues false", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = false;

  let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "12", "try insert minus");
  assert.equal(result.caretPosition, 2, "try insert minus");
});

QUnit.test("numeric processInput: allowNegativeValues true", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;

  let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "-12", "insert minus");
  assert.equal(result.caretPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "-12", inputDirection: "forward" });
  assert.equal(result.value, "12", "insert minus");
  assert.equal(result.caretPosition, 1, "insert minus");
});

QUnit.test("numeric processInput: min", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.min = -100;

  let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "-12", "insert minus");
  assert.equal(result.caretPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
  assert.equal(result.value, "-12", "try insert 4");
  assert.equal(result.caretPosition, 3, "try insert 4");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
  assert.equal(result.value, "12", "type 2");
  assert.equal(result.caretPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "123", "try insert 3");
  assert.equal(result.caretPosition, 3, "try insert 3");

  result = maskInstance.processInput({ insertedChars: "999", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "12,999", "try insert 999");
  assert.equal(result.caretPosition, 6, "try insert 999");
});

QUnit.test("numeric processInput: max", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.max = 100;

  let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
  assert.equal(result.value, "12", "type 2");
  assert.equal(result.caretPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "12", "try insert 3");
  assert.equal(result.caretPosition, 2, "try insert 3");

  result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "-12", "insert minus");
  assert.equal(result.caretPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
  assert.equal(result.value, "-124", "try insert 4");
  assert.equal(result.caretPosition, 4, "try insert 4");

  result = maskInstance.processInput({ insertedChars: "999", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
  assert.equal(result.value, "-12,999", "try insert 999");
  assert.equal(result.caretPosition, 7, "try insert 999");
});

QUnit.test("numeric processInput: min & max", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.min = -100;
  maskInstance.max = 100;

  let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
  assert.equal(result.value, "12", "type 2");
  assert.equal(result.caretPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "12", "try insert 3");
  assert.equal(result.caretPosition, 2, "try insert 3");

  result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
  assert.equal(result.value, "-12", "insert minus");
  assert.equal(result.caretPosition, 3, "insert minus");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
  assert.equal(result.value, "-12", "try insert 4");
  assert.equal(result.caretPosition, 3, "try insert 4");

  result = maskInstance.processInput({ insertedChars: "", selectionStart: 1, selectionEnd: 2, prevValue: "-1", inputDirection: "forward" });
  assert.equal(result.value, "-", "remove 1");
  assert.equal(result.caretPosition, 1, "remove 1");
});

QUnit.test("numeric processInput: min 200", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.min = 200;

  let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "", "try insert minus");
  assert.equal(result.caretPosition, 0, "try insert minus");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "2", "type 2");
  assert.equal(result.caretPosition, 1, "type 2");

  result = maskInstance.processInput({ insertedChars: "-", selectionStart: 1, selectionEnd: 1, prevValue: "2", inputDirection: "forward" });
  assert.equal(result.value, "2", "try insert minus");
  assert.equal(result.caretPosition, 1, "try insert minus");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "20", inputDirection: "forward" });
  assert.equal(result.value, "201", "type 1");
  assert.equal(result.caretPosition, 3, "type 1");
});

QUnit.test("numeric processInput: min 0 & max 100", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.min = 0;
  maskInstance.max = 100;

  let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "", "try insert minus");
  assert.equal(result.caretPosition, 0, "try insert minus");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "2", "type 2");
  assert.equal(result.caretPosition, 1, "type 2");

  result = maskInstance.processInput({ insertedChars: "-", selectionStart: 1, selectionEnd: 1, prevValue: "2", inputDirection: "forward" });
  assert.equal(result.value, "2", "try insert minus");
  assert.equal(result.caretPosition, 1, "try insert minus");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "99", inputDirection: "forward" });
  assert.equal(result.value, "99", "try type 1");
  assert.equal(result.caretPosition, 2, "try type 1");
});

QUnit.test("numeric processInput: precision", function(assert) {
  const maskInstance = new InputMaskNumeric();

  let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "1.0", inputDirection: "forward" });
  assert.equal(result.value, "1.02", "type 2");
  assert.equal(result.caretPosition, 4, "type 2");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "1.02", inputDirection: "forward" });
  assert.equal(result.value, "1.02", "try insert 3");
  assert.equal(result.caretPosition, 4, "try insert 3");

  maskInstance.precision = 0;

  result = maskInstance.processInput({ insertedChars: ".", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
  assert.equal(result.value, "1", "try insert dot");
  assert.equal(result.caretPosition, 1, "try insert dot");
});

QUnit.test("Serialize InputMaskNumeric properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  let json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1" }, "empty mask");

  q.maskType = "numeric";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "numeric"
  }, "init numbermask");

  q.maskSettings.saveMaskedValue = true;
  q.maskSettings["decimalSeparator"] = "-";
  q.maskSettings["thousandsSeparator"] = "*";
  q.maskSettings["precision"] = 5;
  q.maskSettings["allowNegativeValues"] = false;
  q.maskSettings["min"] = 0;
  q.maskSettings["max"] = 1000;

  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "numeric",
    maskSettings: {
      saveMaskedValue: true,
      decimalSeparator: "-",
      thousandsSeparator: "*",
      precision: 5,
      allowNegativeValues: false,
      min: 0,
      max: 1000
    }
  }, "all setting is changed numbermask");
});

QUnit.test("Deserialize InputMaskNumeric properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  jsonObject.toObject({ name: "q1" }, q);
  let maskSettings = q.maskSettings as InputMaskNumeric;
  assert.equal(q.maskType, "none");
  assert.equal(maskSettings.getType(), "masksettings");

  jsonObject.toObject({ name: "q1", maskType: "numeric" }, q);
  maskSettings = q.maskSettings as InputMaskNumeric;
  assert.equal(q.maskType, "numeric");
  assert.equal(maskSettings.getType(), "numericmask", "numbermask type");
  assert.equal(maskSettings.saveMaskedValue, false, "numbermask saveMaskedValue");
  assert.equal(maskSettings.decimalSeparator, ".", "numbermask decimalSeparator");
  assert.equal(maskSettings.thousandsSeparator, ",", "numbermask thousandsSeparator");
  assert.equal(maskSettings.precision, 2, "numbermask precision");
  assert.equal(maskSettings.allowNegativeValues, true, "numbermask allowNegativeValues");
  assert.equal(maskSettings.min, undefined, "numbermask min");
  assert.equal(maskSettings.max, undefined, "numbermask max");

  jsonObject.toObject({
    name: "q1",
    maskType: "numeric",
    maskSettings: {
      saveMaskedValue: true,
      decimalSeparator: "-",
      thousandsSeparator: "*",
      allowNegativeValues: true,
      precision: 5,
      min: 0,
      max: 1000
    }
  }, q);
  maskSettings = q.maskSettings as InputMaskNumeric;
  assert.equal(q.maskType, "numeric");
  assert.equal(maskSettings.getType(), "numericmask", "numbermask type");
  assert.equal(maskSettings.saveMaskedValue, true, "numbermask saveMaskedValue");
  assert.equal(maskSettings.decimalSeparator, "-", "numbermask decimalSeparator");
  assert.equal(maskSettings.thousandsSeparator, "*", "numbermask thousandsSeparator");
  assert.equal(maskSettings.precision, 5, "numbermask precision");
  assert.equal(maskSettings.allowNegativeValues, true, "numbermask allowNegativeValues");
  assert.equal(maskSettings.min, 0, "numbermask min");
  assert.equal(maskSettings.max, 1000, "numbermask max");
});

const customMaskSettings = {
  decimalSeparator: ",",
  thousandsSeparator: " ",
  precision: 3,
  allowNegativeValues: false,
};
QUnit.test("parseNumber with custom settings", assert => {
  const maskInstance = new InputMaskNumeric();
  maskInstance.setData(customMaskSettings);

  assert.equal(maskInstance.parseNumber("123,45").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123,45").fractionalPart, 45);

  assert.equal(maskInstance.parseNumber(",45").integralPart, 0);
  assert.equal(maskInstance.parseNumber(",45").fractionalPart, 45);
  assert.equal(maskInstance.parseNumber("123,").integralPart, 123);
  assert.equal(maskInstance.parseNumber("123,").fractionalPart, 0);
});

QUnit.test("get numeric masked value with custom settings", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.setData(customMaskSettings);
  assert.equal(maskInstance.getMaskedValue(123456.78), "123 456,78");
  assert.equal(maskInstance.getMaskedValue(123456.789), "123 456,789");

  assert.equal(maskInstance.getMaskedValue("123456,78"), "123 456,78");
  assert.equal(maskInstance.getMaskedValue("123456,789"), "123 456,789");
});

QUnit.test("numeric with custom settings processInput: insert characters", function(assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.setData(customMaskSettings);
  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 1, selectionEnd: 1, prevValue: "0", inputDirection: "forward" });
  assert.equal(result.value, "1", "type #1");
  assert.equal(result.caretPosition, 1, "type #1");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
  assert.equal(result.value, "1 234", "type #2.0");
  assert.equal(result.caretPosition, 5, "type #2.0");
});
QUnit.test("numeric processInput: min & max - small range", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = false;
  maskInstance.min = 3;
  maskInstance.max = 7;

  let result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "", "try type 8");
  assert.equal(result.caretPosition, 0, "try type 8");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "", "try type 2");
  assert.equal(result.caretPosition, 0, "try type 2");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "5", "insert 5");
  assert.equal(result.caretPosition, 1, "insert 5");

  maskInstance.allowNegativeValues = false;
  maskInstance.min = 43;
  maskInstance.max = 47;

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "", "try type 3");
  assert.equal(result.caretPosition, 0, "try type 3");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
  assert.equal(result.value, "4", "type 4");
  assert.equal(result.caretPosition, 1, "type 4");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 1, selectionEnd: 1, prevValue: "4", inputDirection: "forward" });
  assert.equal(result.value, "4", "try type 1");
  assert.equal(result.caretPosition, 1, "try type 1");

  result = maskInstance.processInput({ insertedChars: "9", selectionStart: 1, selectionEnd: 1, prevValue: "4", inputDirection: "forward" });
  assert.equal(result.value, "4", "try type 9");
  assert.equal(result.caretPosition, 1, "try type 9");

  result = maskInstance.processInput({ insertedChars: "6", selectionStart: 1, selectionEnd: 1, prevValue: "4", inputDirection: "forward" });
  assert.equal(result.value, "46", "insert 6");
  assert.equal(result.caretPosition, 2, "insert 6");
});

QUnit.test("numeric processInput: doesn't allow resetting if min & max", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = false;
  maskInstance.min = 2;
  maskInstance.max = 10;

  let result = maskInstance.processInput({ insertedChars: null, prevValue: "8", selectionEnd: 1, selectionStart: 0, inputDirection: "forward" });
  assert.equal(result.value, "", "clear");
  assert.equal(result.caretPosition, 0, "clear");
});

QUnit.test("numeric validateNumber: min & max - small range positive", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = false;
  maskInstance.min = 3;
  maskInstance.max = 7;

  const number: any = {};

  number.integralPart = "0";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "8";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "2";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "5";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  maskInstance.allowNegativeValues = false;
  maskInstance.min = 43;
  maskInstance.max = 47;

  number.integralPart = "0";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "3";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "2";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "4";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "42";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.integralPart = "48";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.integralPart = "43";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.integralPart = "45";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
});

QUnit.test("numeric validateNumber: min & max - small range negative", function (assert) {
  const maskInstance = new InputMaskNumeric();
  const number: any = {};

  maskInstance.allowNegativeValues = true;
  maskInstance.max = -43;
  maskInstance.min = -47;

  number.integralPart = "0";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.isNegative = true;
  number.integralPart = "3";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "2";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "4";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.integralPart = "42";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.integralPart = "48";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.integralPart = "43";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.integralPart = "45";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
});

QUnit.test("numeric validateNumber: min & max - small range fractial negative", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = false;
  maskInstance.max = -2.63;
  maskInstance.min = -2.67;
  maskInstance.precision = 2;

  const number: any = {};

  number.integralPart = "2";
  number.isNegative = true;
  number.hasDecimalSeparator = true;

  number.fractionalPart = "62";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "68";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "63";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "65";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
});

QUnit.test("numeric validateNumber: min & max - small range fractial positive", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.min = 2.63;
  maskInstance.max = 2.67;
  maskInstance.precision = 2;

  const number: any = {};

  number.integralPart = "2";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.hasDecimalSeparator = true;
  assert.ok(maskInstance.validateNumber(number, false), "test with dot " + maskInstance.convertNumber(number));

  number.fractionalPart = "62";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "68";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "63";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "65";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
});

QUnit.test("numeric validateNumber: min & max - small range fractial positive less 1", function (assert) {
  const maskInstance = new InputMaskNumeric();
  maskInstance.allowNegativeValues = true;
  maskInstance.min = 0.63;
  maskInstance.max = 0.67;
  maskInstance.precision = 2;

  const number: any = {};

  number.integralPart = "0";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));

  number.hasDecimalSeparator = true;
  assert.ok(maskInstance.validateNumber(number, false), "test with dot " + maskInstance.convertNumber(number));

  number.fractionalPart = "62";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "68";
  assert.notOk(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "63";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
  number.fractionalPart = "65";
  assert.ok(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number));
});