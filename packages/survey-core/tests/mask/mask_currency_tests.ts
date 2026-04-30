import { JsonObject } from "../../src/jsonobject";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { ITextInputParams } from "../../src/mask/mask_utils";
import { QuestionTextModel } from "../../src/question_text";

import { describe, test, expect } from "vitest";
describe("Currency mask", () => {
  test("Serialize InputMaskCurrency properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    let json = jsonObject.toJsonObject(q);
    expect(json, "empty mask").toEqualValues({ name: "q1" });

    q.maskType = "currency";
    json = jsonObject.toJsonObject(q);
    expect(json, "init currency").toEqualValues({
      name: "q1",
      maskType: "currency",
    });

    const maskSettings = q.maskSettings as InputMaskCurrency;
    maskSettings.saveMaskedValue = true;
    maskSettings.decimalSeparator = "-";
    maskSettings.thousandsSeparator = "*";
    maskSettings.precision = 5;
    maskSettings.allowNegativeValues = false;
    maskSettings.min = 0;
    maskSettings.max = 1000;
    maskSettings.prefix = "$";
    maskSettings.suffix = " USD";

    json = jsonObject.toJsonObject(q);
    expect(json, "all setting is changed currency").toEqualValues({
      name: "q1",
      maskType: "currency",
      maskSettings: {
        saveMaskedValue: true,
        decimalSeparator: "-",
        thousandsSeparator: "*",
        precision: 5,
        allowNegativeValues: false,
        min: 0,
        max: 1000,
        prefix: "$",
        suffix: " USD"
      }
    });
  });

  test("Deserialize InputMaskCurrency properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    jsonObject.toObject({ name: "q1" }, q);
    let maskSettings = q.maskSettings as InputMaskCurrency;
    expect(q.maskType).toLooseEqual("none");
    expect(maskSettings.getType()).toLooseEqual("masksettings");

    jsonObject.toObject({ name: "q1", maskType: "currency" }, q);
    maskSettings = q.maskSettings as InputMaskCurrency;
    expect(q.maskType).toLooseEqual("currency");
    expect(maskSettings.getType(), "currencymask type").toLooseEqual("currencymask");
    expect(maskSettings.saveMaskedValue, "currency saveMaskedValue").toLooseEqual(false);
    expect(maskSettings.decimalSeparator, "numbermask decimalSeparator").toLooseEqual(".");
    expect(maskSettings.thousandsSeparator, "numbermask thousandsSeparator").toLooseEqual(",");
    expect(maskSettings.precision, "numbermask precision").toLooseEqual(2);
    expect(maskSettings.allowNegativeValues, "numbermask allowNegativeValues").toLooseEqual(true);
    expect(maskSettings.min, "currency min").toLooseEqual(undefined);
    expect(maskSettings.max, "currency max").toLooseEqual(undefined);
    expect(maskSettings.prefix, "currency prefix").toLooseEqual(undefined);
    expect(maskSettings.suffix, "currency suffix").toLooseEqual(undefined);

    jsonObject.toObject({
      name: "q1",
      maskType: "currency",
      maskSettings: {
        saveMaskedValue: true,
        decimalSeparator: "-",
        thousandsSeparator: "*",
        allowNegativeValues: true,
        precision: 5,
        min: 0,
        max: 1000,
        prefix: "$",
        suffix: " USD"
      }
    }, q);
    maskSettings = q.maskSettings as InputMaskCurrency;
    expect(q.maskType).toLooseEqual("currency");
    expect(maskSettings.getType(), "currencymask type").toLooseEqual("currencymask");
    expect(maskSettings.saveMaskedValue, "currency saveMaskedValue").toLooseEqual(true);
    expect(maskSettings.decimalSeparator, "numbermask decimalSeparator").toLooseEqual("-");
    expect(maskSettings.thousandsSeparator, "numbermask thousandsSeparator").toLooseEqual("*");
    expect(maskSettings.precision, "numbermask precision").toLooseEqual(5);
    expect(maskSettings.allowNegativeValues, "currency allowNegativeValues").toLooseEqual(true);
    expect(maskSettings.min, "currency min").toLooseEqual(0);
    expect(maskSettings.max, "currency max").toLooseEqual(1000);
    expect(maskSettings.prefix, "currency prefix").toLooseEqual("$");
    expect(maskSettings.suffix, "currency suffix").toLooseEqual(" USD");
  });

  test("get currency masked invalid text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$_";
    maskInstance.suffix = "_USD";

    let args: ITextInputParams = { prevValue: "$_1_USD", selectionStart: 0, selectionEnd: 0, insertedChars: "" };
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toLooseEqual("1");

    args.prevValue = "$_1,234_USD";
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toLooseEqual("1,234");

    args.prevValue = "$_12_USD";
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toLooseEqual("12");
  // expect(maskInstance.unwrapText("$_13_US")).toLooseEqual("13");
  // expect(maskInstance.unwrapText("_14_USD")).toLooseEqual("14");
  });

  test("get currency masked invalid text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("")).toLooseEqual("");
    expect(maskInstance.getMaskedValue("9")).toLooseEqual("$ 9");
    expect(maskInstance.getMaskedValue("123A")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("123a")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("12a3")).toLooseEqual("$ 123");

    expect(maskInstance.getMaskedValue("-")).toLooseEqual("");
    expect(maskInstance.getMaskedValue(".")).toLooseEqual("");
    expect(maskInstance.getMaskedValue(",")).toLooseEqual("");
    expect(maskInstance.getMaskedValue("0")).toLooseEqual("$ 0");
    expect(maskInstance.getMaskedValue("-0")).toLooseEqual("$ 0");
    expect(maskInstance.getMaskedValue("-9,")).toLooseEqual("$ -9");
    expect(maskInstance.getMaskedValue("9.")).toLooseEqual("$ 9");
    expect(maskInstance.getMaskedValue("123,")).toLooseEqual("$ 123");
  });

  test("get currency masked value by formated text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("0")).toLooseEqual("$ 0");
    expect(maskInstance.getMaskedValue("01")).toLooseEqual("$ 1");
    expect(maskInstance.getMaskedValue("123")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("1234")).toLooseEqual("$ 1,234");
    expect(maskInstance.getMaskedValue("123,")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("123.")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("123.4")).toLooseEqual("$ 123.4");
    expect(maskInstance.getMaskedValue("123,.")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("1239,456")).toLooseEqual("$ 1,239,456");
    expect(maskInstance.getMaskedValue("1239456")).toLooseEqual("$ 1,239,456");
    expect(maskInstance.getMaskedValue("123,456.78")).toLooseEqual("$ 123,456.78");
    expect(maskInstance.getMaskedValue("123,45678")).toLooseEqual("$ 12,345,678");
    expect(maskInstance.getMaskedValue("123,456.789")).toLooseEqual("$ 123,456.78");
    expect(maskInstance.getMaskedValue("123,456,78,101.12")).toLooseEqual("$ 12,345,678,101.12");
  });

  test("get currency masked negative value by formated text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("-123")).toLooseEqual("$ -123");
    expect(maskInstance.getMaskedValue("-0123")).toLooseEqual("$ -123");
    expect(maskInstance.getMaskedValue("12-34")).toLooseEqual("$ -1,234");
    expect(maskInstance.getMaskedValue("-123-,456.78")).toLooseEqual("$ 123,456.78");
    expect(maskInstance.getMaskedValue("-123,45-678")).toLooseEqual("$ 12,345,678");
    expect(maskInstance.getMaskedValue("123,4-56.789")).toLooseEqual("$ -123,456.78");
    expect(maskInstance.getMaskedValue("123,45--6,78,101.12")).toLooseEqual("$ 12,345,678,101.12");
  });

  test("get currency masked not allow negative value by formated text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.allowNegativeValues = false;
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("-123")).toLooseEqual("$ 123");
    expect(maskInstance.getMaskedValue("12-34")).toLooseEqual("$ 1,234");
    expect(maskInstance.getMaskedValue("-123-,456.78")).toLooseEqual("$ 123,456.78");
    expect(maskInstance.getMaskedValue("-123,45-678")).toLooseEqual("$ 12,345,678");
    expect(maskInstance.getMaskedValue("123,4-56.789")).toLooseEqual("$ 123,456.78");
    expect(maskInstance.getMaskedValue("123,45--6,78,101.12")).toLooseEqual("$ 12,345,678,101.12");
  });

  test("get currency unmasked valid text", () => {
    const maskInstance = new InputMaskCurrency();
    expect(maskInstance.getUnmaskedValue("$ 123") === 123).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("$ 123,456") === 123456).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("$ 123,456.78") === 123456.78).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("$ 123,456.789") === 123456.78).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("$ 123,456,789,101.12") === 123456789101.12).toBeTruthy();
  });

  test("currency processInput: insert characters v2.0", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "$0", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("$1");
    expect(result.caretPosition, "type #1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "$123", inputDirection: "forward" });
    expect(result.value, "type #2.0").toLooseEqual("$1,234");
    expect(result.caretPosition, "type #2.0").toLooseEqual(6);
  });

  test("currency processInput: insert characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 3, selectionEnd: 3, prevValue: "$ 0", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("$ 1");
    expect(result.caretPosition, "type #1").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "type #2.0").toLooseEqual("$ 1,234");
    expect(result.caretPosition, "type #2.0").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: ",", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "type #2.1").toLooseEqual("$ 123");
    expect(result.caretPosition, "type #2.1").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "type #2.2").toLooseEqual("$ 123.");
    expect(result.caretPosition, "type #2.2").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.0").toLooseEqual("$ 123.");
    expect(result.caretPosition, "type #3.0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.1").toLooseEqual("$ 123.4");
    expect(result.caretPosition, "type #3.1").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "456", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.2").toLooseEqual("$ 123.45");
    expect(result.caretPosition, "type #3.2").toLooseEqual(8);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.3").toLooseEqual("$ 123.");
    expect(result.caretPosition, "type #3.3").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #4.0").toLooseEqual("$ 1,023.45");
    expect(result.caretPosition, "type #4.0").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 6, selectionEnd: 6, prevValue: "$ 1,023.45", inputDirection: "forward" });
    expect(result.value, "type #4.1").toLooseEqual("$ 10,203.45");
    expect(result.caretPosition, "type #4.1").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #5.0").toLooseEqual("$ 1,230.45");
    expect(result.caretPosition, "type #5.0").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "d", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #5.1").toLooseEqual("$ 123.45");
    expect(result.caretPosition, "type #5.1").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #5.2").toLooseEqual("$ 123.45");
    expect(result.caretPosition, "type #5.2").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.1").toLooseEqual("$ 10,234.56");
    expect(result.caretPosition, "type #6.1").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "d", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.2").toLooseEqual("$ 1,234.56");
    expect(result.caretPosition, "type #6.2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: ",", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.3").toLooseEqual("$ 1,234.56");
    expect(result.caretPosition, "type #6.3").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 5, selectionEnd: 5, prevValue: "$ 1,234,567.89", inputDirection: "forward" });
    expect(result.value, "type #7.0").toLooseEqual("$ 12,034,567.89");
    expect(result.caretPosition, "type #7.0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "$ 1,234,567.89", inputDirection: "forward" });
    expect(result.value, "type #7.1").toLooseEqual("$ 10,234,567.89");
    expect(result.caretPosition, "type #7.1").toLooseEqual(4);
  });

  test("currency processInput simple number: delete characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 0", inputDirection: "forward" });
    expect(result.value, "#1").toLooseEqual("$ 0");
    expect(result.caretPosition, "#1").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 0", inputDirection: "forward" });
    expect(result.value, "remove 0").toLooseEqual("");
    expect(result.caretPosition, "remove 0").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "remove 3").toLooseEqual("$ 12");
    expect(result.caretPosition, "remove 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "remove 2").toLooseEqual("$ 13");
    expect(result.caretPosition, "remove 2").toLooseEqual(3);

  });

  test("currency processInput decimal number: delete characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "remove 3").toLooseEqual("$ 12.45");
    expect(result.caretPosition, "remove 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "remove dot").toLooseEqual("$ 12,345");
    expect(result.caretPosition, "remove dot").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "remove 4").toLooseEqual("$ 123.5");
    expect(result.caretPosition, "remove 4").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 11, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove all").toLooseEqual("");
    expect(result.caretPosition, "remove all").toLooseEqual(0);
  });

  test("currency processInput big number: delete characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 1").toLooseEqual("$ 234,567");
    expect(result.caretPosition, "remove 1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "try remove ,").toLooseEqual("$ 1,234,567");
    expect(result.caretPosition, "try remove ,").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 3").toLooseEqual("$ 124,567");
    expect(result.caretPosition, "remove 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 4").toLooseEqual("$ 123,567");
    // expect(result.caretPosition, "remove 4").toLooseEqual(5);
    expect(result.caretPosition, "remove 4").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 9, selectionEnd: 10, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 6").toLooseEqual("$ 123,457");
    expect(result.caretPosition, "remove 6").toLooseEqual(8);
  });

  test("currency processInput simple number: delete characters by backspace", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 2, prevValue: "$ 0", inputDirection: "backward" });
    expect(result.value, "#1").toLooseEqual("$ 0");
    expect(result.caretPosition, "#1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 0", inputDirection: "backward" });
    expect(result.value, "remove 0").toLooseEqual("");
    expect(result.caretPosition, "remove 0").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123", inputDirection: "backward" });
    expect(result.value, "remove 3").toLooseEqual("$ 12");
    expect(result.caretPosition, "remove 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 123", inputDirection: "backward" });
    expect(result.value, "remove 2").toLooseEqual("$ 13");
    expect(result.caretPosition, "remove 2").toLooseEqual(3);

  });

  test("currency processInput decimal number: delete characters by backspace", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "backward" });
    expect(result.value, "remove 3").toLooseEqual("$ 12.45");
    expect(result.caretPosition, "remove 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 123.45", inputDirection: "backward" });
    expect(result.value, "remove dot").toLooseEqual("$ 12,345");
    expect(result.caretPosition, "remove dot").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 123.45", inputDirection: "backward" });
    expect(result.value, "remove 4").toLooseEqual("$ 123.5");
    expect(result.caretPosition, "remove 4").toLooseEqual(6);
  });

  test("currency processInput big number: delete characters by backspace", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 1").toLooseEqual("$ 234,567");
    expect(result.caretPosition, "remove 1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "try remove ,").toLooseEqual("$ 1,234,567");
    expect(result.caretPosition, "try remove ,").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 3").toLooseEqual("$ 124,567");
    expect(result.caretPosition, "remove 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 4").toLooseEqual("$ 123,567");
    expect(result.caretPosition, "remove 4").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 9, selectionEnd: 10, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 6").toLooseEqual("$ 123,457");
    expect(result.caretPosition, "remove 6").toLooseEqual(8);
  });

  test("currency processInput: cut + paste characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5").toLooseEqual("$ 1,267");
    expect(result.caretPosition, "cut 34,5").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "00", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5 & insert 00").toLooseEqual("$ 120,067");
    expect(result.caretPosition, "cut 34,5 & insert 00").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5 & insert 000000").toLooseEqual("$ 1,200,000,067");
    expect(result.caretPosition, "cut 34,5 & insert 000000").toLooseEqual(13);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5").toLooseEqual("$ 126");
    expect(result.caretPosition, "cut 34.5").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "00", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5 & insert 00").toLooseEqual("$ 12,006");
    expect(result.caretPosition, "cut 34.5 & insert 00").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5 & insert 000000").toLooseEqual("$ 120,000,006");
    expect(result.caretPosition, "cut 34.5 & insert 000000").toLooseEqual(12);
  });

  test("currency processInput: allowNegativeValues false", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = false;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert minus").toLooseEqual("$ 12");
    expect(result.caretPosition, "try insert minus").toLooseEqual(4);
  });

  test("currency processInput: allowNegativeValues true", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toLooseEqual("$ -12");
    expect(result.caretPosition, "insert minus").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "insert minus").toLooseEqual("$ 12");
    expect(result.caretPosition, "insert minus").toLooseEqual(3);
  });

  test("currency processInput: min", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;
    maskInstance.min = -100;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toLooseEqual("$ -12");
    expect(result.caretPosition, "insert minus").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toLooseEqual("$ -12");
    expect(result.caretPosition, "try insert 4").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("$ 12");
    expect(result.caretPosition, "type 2").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toLooseEqual("$ 123");
    expect(result.caretPosition, "try insert 3").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "999", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 999").toLooseEqual("$ 12,999");
    expect(result.caretPosition, "try insert 999").toLooseEqual(8);
  });

  test("currency processInput: max", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("$ 12");
    expect(result.caretPosition, "type 2").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toLooseEqual("$ 12");
    expect(result.caretPosition, "try insert 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toLooseEqual("$ -12");
    expect(result.caretPosition, "insert minus").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toLooseEqual("$ -124");
    expect(result.caretPosition, "try insert 4").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "999", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 999").toLooseEqual("$ -12,999");
    expect(result.caretPosition, "try insert 999").toLooseEqual(9);
  });

  test("currency processInput: min & max", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;
    maskInstance.min = -100;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("$ 12");
    expect(result.caretPosition, "type 2").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toLooseEqual("$ 12");
    expect(result.caretPosition, "try insert 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toLooseEqual("$ -12");
    expect(result.caretPosition, "insert minus").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toLooseEqual("$ -12");
    expect(result.caretPosition, "try insert 4").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "", selectionStart: 3, selectionEnd: 4, prevValue: "$ -1", inputDirection: "forward" });
    expect(result.value, "remove 1").toLooseEqual("$ -");
    expect(result.caretPosition, "remove 1").toLooseEqual(3);
  });
});
