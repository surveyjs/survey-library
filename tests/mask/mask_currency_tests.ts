import { JsonObject } from "../../src/jsonobject";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { ITextMaskInputArgs } from "../../src/mask/mask_utils";
import { QuestionTextModel } from "../../src/question_text";

export default QUnit.module("Currency mask");

QUnit.test("Serialize InputMaskCurrency properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  let json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1" }, "empty mask");

  q.maskType = "currencymask";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "currencymask",
  }, "init currencymask");

  const maskSettings = q.maskSettings as InputMaskCurrency;
  maskSettings.dataToSave = "masked";
  maskSettings.decimalSeparator = "-";
  maskSettings.thousandsSeparator = "*";
  maskSettings.precision = 5;
  maskSettings.allowNegative = false;
  maskSettings.min = 0;
  maskSettings.max = 1000;
  maskSettings.prefix = "$";
  maskSettings.suffix = " USD";

  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "currencymask",
    maskSettings: {
      dataToSave: "masked",
      decimalSeparator: "-",
      thousandsSeparator: "*",
      precision: 5,
      allowNegative: false,
      min: 0,
      max: 1000,
      prefix: "$",
      suffix: " USD"
    }
  }, "all setting is changed currencymask");
});

QUnit.test("Deserialize InputMaskCurrency properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  jsonObject.toObject({ name: "q1" }, q);
  let maskSettings = q.maskSettings as InputMaskCurrency;
  assert.equal(q.maskType, "none");
  assert.equal(maskSettings.getType(), "masksettings");

  jsonObject.toObject({ name: "q1", maskType: "currencymask" }, q);
  maskSettings = q.maskSettings as InputMaskCurrency;
  assert.equal(q.maskType, "currencymask");
  assert.equal(maskSettings.getType(), "currencymask", "currencymask type");
  assert.equal(maskSettings.dataToSave, "unmasked", "currencymask dataToSave");
  assert.equal(maskSettings.decimalSeparator, ".", "numbermask decimalSeparator");
  assert.equal(maskSettings.thousandsSeparator, ",", "numbermask thousandsSeparator");
  assert.equal(maskSettings.precision, 2, "numbermask precision");
  assert.equal(maskSettings.allowNegative, true, "numbermask allowNegative");
  assert.equal(maskSettings.min, undefined, "currencymask min");
  assert.equal(maskSettings.max, undefined, "currencymask max");
  assert.equal(maskSettings.prefix, undefined, "currencymask prefix");
  assert.equal(maskSettings.suffix, undefined, "currencymask suffix");

  jsonObject.toObject({
    name: "q1",
    maskType: "currencymask",
    maskSettings: {
      dataToSave: "masked",
      decimalSeparator: "-",
      thousandsSeparator: "*",
      allowNegative: true,
      precision: 5,
      min: 0,
      max: 1000,
      prefix: "$",
      suffix: " USD"
    }
  }, q);
  maskSettings = q.maskSettings as InputMaskCurrency;
  assert.equal(q.maskType, "currencymask");
  assert.equal(maskSettings.getType(), "currencymask", "currencymask type");
  assert.equal(maskSettings.dataToSave, "masked", "currencymask dataToSave");
  assert.equal(maskSettings.decimalSeparator, "-", "numbermask decimalSeparator");
  assert.equal(maskSettings.thousandsSeparator, "*", "numbermask thousandsSeparator");
  assert.equal(maskSettings.precision, 5, "numbermask precision");
  assert.equal(maskSettings.allowNegative, true, "currencymask allowNegative");
  assert.equal(maskSettings.min, 0, "currencymask min");
  assert.equal(maskSettings.max, 1000, "currencymask max");
  assert.equal(maskSettings.prefix, "$", "currencymask prefix");
  assert.equal(maskSettings.suffix, " USD", "currencymask suffix");
});

QUnit.test("get currency masked invalid text", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$_";
  maskInstance.suffix = "_USD";

  let args: ITextMaskInputArgs = { prevValue: "$_1_USD", selectionStart: 0, selectionEnd: 0, insertedCharacters: "" };
  maskInstance.unwrapInputArgs(args);
  assert.equal(args.prevValue, "1");

  args.prevValue = "$_1,234_USD";
  maskInstance.unwrapInputArgs(args);
  assert.equal(args.prevValue, "1,234");

  args.prevValue = "$_12_USD";
  maskInstance.unwrapInputArgs(args);
  assert.equal(args.prevValue, "12");
  // assert.equal(maskInstance.unwrapText("$_13_US"), "13");
  // assert.equal(maskInstance.unwrapText("_14_USD"), "14");
});

QUnit.test("get currency masked invalid text", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  assert.equal(maskInstance.getMaskedValue(""), "");
  assert.equal(maskInstance.getMaskedValue("9"), "$ 9");
  assert.equal(maskInstance.getMaskedValue("123A"), "$ 123");
  assert.equal(maskInstance.getMaskedValue("123a"), "$ 123");
  assert.equal(maskInstance.getMaskedValue("12a3"), "$ 123");

  assert.equal(maskInstance.getMaskedValue("-"), "");
  assert.equal(maskInstance.getMaskedValue("."), "");
  assert.equal(maskInstance.getMaskedValue(","), "");
  assert.equal(maskInstance.getMaskedValue("0"), "$ 0");
  assert.equal(maskInstance.getMaskedValue("-0"), "$ 0");
  assert.equal(maskInstance.getMaskedValue("-9,"), "$ -9");
  assert.equal(maskInstance.getMaskedValue("9."), "$ 9");
  assert.equal(maskInstance.getMaskedValue("123,"), "$ 123");
});

QUnit.test("get currency masked value by formated text", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  assert.equal(maskInstance.getMaskedValue("0"), "$ 0");
  assert.equal(maskInstance.getMaskedValue("01"), "$ 1");
  assert.equal(maskInstance.getMaskedValue("123"), "$ 123");
  assert.equal(maskInstance.getMaskedValue("1234"), "$ 1,234");
  assert.equal(maskInstance.getMaskedValue("123,"), "$ 123");
  assert.equal(maskInstance.getMaskedValue("123."), "$ 123");
  assert.equal(maskInstance.getMaskedValue("123.4"), "$ 123.4");
  assert.equal(maskInstance.getMaskedValue("123,."), "$ 123");
  assert.equal(maskInstance.getMaskedValue("1239,456"), "$ 1,239,456");
  assert.equal(maskInstance.getMaskedValue("1239456"), "$ 1,239,456");
  assert.equal(maskInstance.getMaskedValue("123,456.78"), "$ 123,456.78");
  assert.equal(maskInstance.getMaskedValue("123,45678"), "$ 12,345,678");
  assert.equal(maskInstance.getMaskedValue("123,456.789"), "$ 123,456.78");
  assert.equal(maskInstance.getMaskedValue("123,456,78,101.12"), "$ 12,345,678,101.12");
});

QUnit.test("get currency masked negative value by formated text", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  assert.equal(maskInstance.getMaskedValue("-123"), "$ -123");
  assert.equal(maskInstance.getMaskedValue("-0123"), "$ -123");
  assert.equal(maskInstance.getMaskedValue("12-34"), "$ -1,234");
  assert.equal(maskInstance.getMaskedValue("-123-,456.78"), "$ 123,456.78");
  assert.equal(maskInstance.getMaskedValue("-123,45-678"), "$ 12,345,678");
  assert.equal(maskInstance.getMaskedValue("123,4-56.789"), "$ -123,456.78");
  assert.equal(maskInstance.getMaskedValue("123,45--6,78,101.12"), "$ 12,345,678,101.12");
});

QUnit.test("get currency masked not allow negative value by formated text", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.allowNegative = false;
  maskInstance.prefix = "$ ";
  assert.equal(maskInstance.getMaskedValue("-123"), "$ 123");
  assert.equal(maskInstance.getMaskedValue("12-34"), "$ 1,234");
  assert.equal(maskInstance.getMaskedValue("-123-,456.78"), "$ 123,456.78");
  assert.equal(maskInstance.getMaskedValue("-123,45-678"), "$ 12,345,678");
  assert.equal(maskInstance.getMaskedValue("123,4-56.789"), "$ 123,456.78");
  assert.equal(maskInstance.getMaskedValue("123,45--6,78,101.12"), "$ 12,345,678,101.12");
});

QUnit.test("get currency unmasked valid text", function(assert) {
  const maskInstance = new InputMaskCurrency();
  assert.ok(maskInstance.getUnmaskedValue("$ 123") === 123);
  assert.ok(maskInstance.getUnmaskedValue("$ 123,456") === 123456);
  assert.ok(maskInstance.getUnmaskedValue("$ 123,456.78") === 123456.78);
  assert.ok(maskInstance.getUnmaskedValue("$ 123,456.789") === 123456.78);
  assert.ok(maskInstance.getUnmaskedValue("$ 123,456,789,101.12") === 123456789101.12);
});

QUnit.test("currency processInput: insert characters v2.0", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$";
  let result = maskInstance.processInput({ insertedCharacters: "1", selectionStart: 2, selectionEnd: 2, prevValue: "$0", inputDirection: "leftToRight" });
  assert.equal(result.text, "$1", "type #1");
  assert.equal(result.cursorPosition, 2, "type #1");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 4, selectionEnd: 4, prevValue: "$123", inputDirection: "leftToRight" });
  assert.equal(result.text, "$1,234", "type #2.0");
  assert.equal(result.cursorPosition, 6, "type #2.0");
});

QUnit.test("currency processInput: insert characters", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  let result = maskInstance.processInput({ insertedCharacters: "1", selectionStart: 3, selectionEnd: 3, prevValue: "$ 0", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1", "type #1");
  assert.equal(result.cursorPosition, 3, "type #1");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,234", "type #2.0");
  assert.equal(result.cursorPosition, 7, "type #2.0");

  result = maskInstance.processInput({ insertedCharacters: ",", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123", "type #2.1");
  assert.equal(result.cursorPosition, 5, "type #2.1");

  result = maskInstance.processInput({ insertedCharacters: ".", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.", "type #2.2");
  assert.equal(result.cursorPosition, 6, "type #2.2");

  result = maskInstance.processInput({ insertedCharacters: "a", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.", "type #3.0");
  assert.equal(result.cursorPosition, 6, "type #3.0");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.4", "type #3.1");
  assert.equal(result.cursorPosition, 7, "type #3.1");

  result = maskInstance.processInput({ insertedCharacters: "456", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.45", "type #3.2");
  assert.equal(result.cursorPosition, 8, "type #3.2");

  result = maskInstance.processInput({ insertedCharacters: ".", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.", "type #3.3");
  assert.equal(result.cursorPosition, 6, "type #3.3");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 3, selectionEnd: 3, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,023.45", "type #4.0");
  assert.equal(result.cursorPosition, 5, "type #4.0");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 6, selectionEnd: 6, prevValue: "$ 1,023.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 10,203.45", "type #4.1");
  assert.equal(result.cursorPosition, 7, "type #4.1");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,230.45", "type #5.0");
  assert.equal(result.cursorPosition, 7, "type #5.0");

  result = maskInstance.processInput({ insertedCharacters: "d", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.45", "type #5.1");
  assert.equal(result.cursorPosition, 5, "type #5.1");

  result = maskInstance.processInput({ insertedCharacters: ".", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.45", "type #5.2");
  assert.equal(result.cursorPosition, 6, "type #5.2");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 10,234.56", "type #6.1");
  assert.equal(result.cursorPosition, 4, "type #6.1");

  result = maskInstance.processInput({ insertedCharacters: "d", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,234.56", "type #6.2");
  assert.equal(result.cursorPosition, 3, "type #6.2");

  result = maskInstance.processInput({ insertedCharacters: ",", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,234.56", "type #6.3");
  assert.equal(result.cursorPosition, 3, "type #6.3");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 5, selectionEnd: 5, prevValue: "$ 1,234,567.89", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12,034,567.89", "type #7.0");
  assert.equal(result.cursorPosition, 6, "type #7.0");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 4, selectionEnd: 4, prevValue: "$ 1,234,567.89", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 10,234,567.89", "type #7.1");
  assert.equal(result.cursorPosition, 4, "type #7.1");
});

QUnit.test("currency processInput simple number: delete characters", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 0", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 0", "#1");
  assert.equal(result.cursorPosition, 3, "#1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 0", inputDirection: "leftToRight" });
  assert.equal(result.text, "", "remove 0");
  assert.equal(result.cursorPosition, 2, "remove 0");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "remove 3");
  assert.equal(result.cursorPosition, 4, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 123", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 13", "remove 2");
  assert.equal(result.cursorPosition, 3, "remove 2");

});

QUnit.test("currency processInput decimal number: delete characters", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12.45", "remove 3");
  assert.equal(result.cursorPosition, 4, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12,345", "remove dot");
  assert.equal(result.cursorPosition, 6, "remove dot");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 123.45", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123.5", "remove 4");
  assert.equal(result.cursorPosition, 6, "remove 4");
});

QUnit.test("currency processInput big number: delete characters", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 234,567", "remove 1");
  assert.equal(result.cursorPosition, 2, "remove 1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,234,567", "try remove ,");
  assert.equal(result.cursorPosition, 4, "try remove ,");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 124,567", "remove 3");
  assert.equal(result.cursorPosition, 4, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123,567", "remove 4");
  // assert.equal(result.cursorPosition, 5, "remove 4");
  assert.equal(result.cursorPosition, 6, "remove 4");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 9, selectionEnd: 10, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123,457", "remove 6");
  assert.equal(result.cursorPosition, 8, "remove 6");
});

QUnit.test("currency processInput simple number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 2, prevValue: "$ 0", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 0", "#1");
  assert.equal(result.cursorPosition, 2, "#1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 0", inputDirection: "rightToLeft" });
  assert.equal(result.text, "", "remove 0");
  assert.equal(result.cursorPosition, 2, "remove 0");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 12", "remove 3");
  assert.equal(result.cursorPosition, 4, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 123", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 13", "remove 2");
  assert.equal(result.cursorPosition, 3, "remove 2");

});

QUnit.test("currency processInput decimal number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 12.45", "remove 3");
  assert.equal(result.cursorPosition, 4, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 123.45", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 12,345", "remove dot");
  assert.equal(result.cursorPosition, 6, "remove dot");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 123.45", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 123.5", "remove 4");
  assert.equal(result.cursorPosition, 6, "remove 4");
});

QUnit.test("currency processInput big number: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 234,567", "remove 1");
  assert.equal(result.cursorPosition, 2, "remove 1");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 1,234,567", "try remove ,");
  assert.equal(result.cursorPosition, 3, "try remove ,");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 124,567", "remove 3");
  assert.equal(result.cursorPosition, 4, "remove 3");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 123,567", "remove 4");
  assert.equal(result.cursorPosition, 5, "remove 4");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 9, selectionEnd: 10, prevValue: "$ 1,234,567", inputDirection: "rightToLeft" });
  assert.equal(result.text, "$ 123,457", "remove 6");
  assert.equal(result.cursorPosition, 8, "remove 6");
});

QUnit.test("currency processInput: cut + paste characters", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";

  let result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,267", "cut 34,5");
  assert.equal(result.cursorPosition, 5, "cut 34,5");

  result = maskInstance.processInput({ insertedCharacters: "00", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 120,067", "cut 34,5 & insert 00");
  assert.equal(result.cursorPosition, 7, "cut 34,5 & insert 00");

  result = maskInstance.processInput({ insertedCharacters: "000000", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 1,200,000,067", "cut 34,5 & insert 000000");
  assert.equal(result.cursorPosition, 13, "cut 34,5 & insert 000000");

  result = maskInstance.processInput({ insertedCharacters: null, selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 126", "cut 34.5");
  assert.equal(result.cursorPosition, 4, "cut 34.5");

  result = maskInstance.processInput({ insertedCharacters: "00", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12,006", "cut 34.5 & insert 00");
  assert.equal(result.cursorPosition, 7, "cut 34.5 & insert 00");

  result = maskInstance.processInput({ insertedCharacters: "000000", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 120,000,006", "cut 34.5 & insert 000000");
  assert.equal(result.cursorPosition, 12, "cut 34.5 & insert 000000");
});

QUnit.test("currency processInput: allowNegative false", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  maskInstance.allowNegative = false;

  let result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "try insert minus");
  assert.equal(result.cursorPosition, 4, "try insert minus");
});

QUnit.test("currency processInput: allowNegative true", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  maskInstance.allowNegative = true;

  let result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12", "insert minus");
  assert.equal(result.cursorPosition, 5, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ -12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "insert minus");
  assert.equal(result.cursorPosition, 3, "insert minus");
});

QUnit.test("currency processInput: min", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  maskInstance.allowNegative = true;
  maskInstance.min = -100;

  let result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12", "insert minus");
  assert.equal(result.cursorPosition, 5, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12", "try insert 4");
  assert.equal(result.cursorPosition, 5, "try insert 4");

  result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "type 2");
  assert.equal(result.cursorPosition, 4, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 123", "try insert 3");
  assert.equal(result.cursorPosition, 5, "try insert 3");

  result = maskInstance.processInput({ insertedCharacters: "999", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12,999", "try insert 999");
  assert.equal(result.cursorPosition, 8, "try insert 999");
});

QUnit.test("currency processInput: max", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  maskInstance.allowNegative = true;
  maskInstance.max = 100;

  let result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "type 2");
  assert.equal(result.cursorPosition, 4, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "try insert 3");
  assert.equal(result.cursorPosition, 4, "try insert 3");

  result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12", "insert minus");
  assert.equal(result.cursorPosition, 5, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -124", "try insert 4");
  assert.equal(result.cursorPosition, 6, "try insert 4");

  result = maskInstance.processInput({ insertedCharacters: "999", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12,999", "try insert 999");
  assert.equal(result.cursorPosition, 9, "try insert 999");
});

QUnit.test("currency processInput: min & max", function(assert) {
  const maskInstance = new InputMaskCurrency();
  maskInstance.prefix = "$ ";
  maskInstance.allowNegative = true;
  maskInstance.min = -100;
  maskInstance.max = 100;

  let result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "type 2");
  assert.equal(result.cursorPosition, 4, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ 12", "try insert 3");
  assert.equal(result.cursorPosition, 4, "try insert 3");

  result = maskInstance.processInput({ insertedCharacters: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12", "insert minus");
  assert.equal(result.cursorPosition, 5, "insert minus");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -12", "try insert 4");
  assert.equal(result.cursorPosition, 5, "try insert 4");

  result = maskInstance.processInput({ insertedCharacters: "", selectionStart: 3, selectionEnd: 4, prevValue: "$ -1", inputDirection: "leftToRight" });
  assert.equal(result.text, "$ -", "remove 1");
  assert.equal(result.cursorPosition, 3, "remove 1");
});