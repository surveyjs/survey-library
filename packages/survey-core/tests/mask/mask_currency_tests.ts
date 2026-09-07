import { JsonObject, Serializer } from "../../src/jsonobject";
import { InputMaskCurrency, isValidCurrencyPattern } from "../../src/mask/mask_currency";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskBase } from "../../src/mask/mask_base";
import { InputElementAdapter } from "../../src/mask/input_element_adapter";
import { localeData } from "../../src/locale-data";
import { ITextInputParams } from "../../src/mask/mask_utils";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { surveyLocalization } from "../../src/surveyStrings";

import { describe, test, expect, afterEach } from "vitest";
describe("Currency mask", () => {
  test.each([
    { prefix: "$ ", suffix: "", saveMaskedValue: false },
    { prefix: "", suffix: " EUR", saveMaskedValue: false },
    { prefix: "$ ", suffix: " USD", saveMaskedValue: true }
  ])("Locale changes preserve entered currency affixes: %j", ({ prefix, suffix, saveMaskedValue }) => {
    const previousLocale = surveyLocalization.currentLocale;
    const survey = new SurveyModel({ locale: "de", elements: [{
      type: "text", name: "q1", maskType: "currency", maskSettings: { prefix, suffix, saveMaskedValue }
    }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      q.value = 1234;
      input.focus();
      input.value = prefix + "1.234,5" + suffix;

      survey.locale = "en";
      expect(input.value).toBe(prefix + "1,234.5" + suffix);
      expect(q.inputValue).toBe(input.value);
      expect(q.value).toBe(saveMaskedValue ? prefix + "1,234" + suffix : 1234);
      expect(q.maskSettings.getUnmaskedValue(input.value)).toBe(1234.5);

      input.value = prefix + "-1,234." + suffix;
      survey.regionOptions.locale = "de";
      expect(input.value).toBe(prefix + "-1.234," + suffix);
    } finally {
      survey.dispose();
      input.remove();
      surveyLocalization.currentLocale = previousLocale;
    }
  });

  test("Serialize InputMaskCurrency properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    let json = jsonObject.toJsonObject(q);
    expect(json, "empty mask").toEqual({ name: "q1" });

    q.maskType = "currency";
    json = jsonObject.toJsonObject(q);
    expect(json, "init currency").toEqual({
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
    expect(json, "all setting is changed currency").toEqual({
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
    expect(q.maskType).toBe("none");
    expect(maskSettings.getType()).toBe("masksettings");

    jsonObject.toObject({ name: "q1", maskType: "currency" }, q);
    maskSettings = q.maskSettings as InputMaskCurrency;
    expect(q.maskType).toBe("currency");
    expect(maskSettings.getType(), "currencymask type").toBe("currencymask");
    expect(maskSettings.saveMaskedValue, "currency saveMaskedValue").toBe(false);
    expect(maskSettings.decimalSeparator, "numbermask decimalSeparator").toBe(".");
    expect(maskSettings.thousandsSeparator, "numbermask thousandsSeparator").toBe(",");
    expect(maskSettings.precision, "numbermask precision").toBe(2);
    expect(maskSettings.allowNegativeValues, "numbermask allowNegativeValues").toBe(true);
    expect(maskSettings.min, "currency min").toBeUndefined();
    expect(maskSettings.max, "currency max").toBeUndefined();
    expect(maskSettings.prefix, "currency prefix").toBeUndefined();
    expect(maskSettings.suffix, "currency suffix").toBeUndefined();

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
    expect(q.maskType).toBe("currency");
    expect(maskSettings.getType(), "currencymask type").toBe("currencymask");
    expect(maskSettings.saveMaskedValue, "currency saveMaskedValue").toBe(true);
    expect(maskSettings.decimalSeparator, "numbermask decimalSeparator").toBe("-");
    expect(maskSettings.thousandsSeparator, "numbermask thousandsSeparator").toBe("*");
    expect(maskSettings.precision, "numbermask precision").toBe(5);
    expect(maskSettings.allowNegativeValues, "currency allowNegativeValues").toBe(true);
    expect(maskSettings.min, "currency min").toBe(0);
    expect(maskSettings.max, "currency max").toBe(1000);
    expect(maskSettings.prefix, "currency prefix").toBe("$");
    expect(maskSettings.suffix, "currency suffix").toBe(" USD");
  });

  test("get currency masked invalid text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$_";
    maskInstance.suffix = "_USD";

    let args: ITextInputParams = { prevValue: "$_1_USD", selectionStart: 0, selectionEnd: 0, insertedChars: "" };
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toBe("1");

    args.prevValue = "$_1,234_USD";
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toBe("1,234");

    args.prevValue = "$_12_USD";
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toBe("12");
  // expect(maskInstance.unwrapText("$_13_US")).toBe("13");
  // expect(maskInstance.unwrapText("_14_USD")).toBe("14");
  });

  test("get currency masked invalid text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("")).toBe("");
    expect(maskInstance.getMaskedValue("9")).toBe("$ 9");
    expect(maskInstance.getMaskedValue("123A")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("123a")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("12a3")).toBe("$ 123");

    expect(maskInstance.getMaskedValue("-")).toBe("");
    expect(maskInstance.getMaskedValue(".")).toBe("");
    expect(maskInstance.getMaskedValue(",")).toBe("");
    expect(maskInstance.getMaskedValue("0")).toBe("$ 0");
    expect(maskInstance.getMaskedValue("-0")).toBe("$ 0");
    expect(maskInstance.getMaskedValue("-9,")).toBe("$ -9");
    expect(maskInstance.getMaskedValue("9.")).toBe("$ 9");
    expect(maskInstance.getMaskedValue("123,")).toBe("$ 123");
  });

  test("get currency masked value by formated text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("0")).toBe("$ 0");
    expect(maskInstance.getMaskedValue("01")).toBe("$ 1");
    expect(maskInstance.getMaskedValue("123")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("1234")).toBe("$ 1,234");
    expect(maskInstance.getMaskedValue("123,")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("123.")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("123.4")).toBe("$ 123.4");
    expect(maskInstance.getMaskedValue("123,.")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("1239,456")).toBe("$ 1,239,456");
    expect(maskInstance.getMaskedValue("1239456")).toBe("$ 1,239,456");
    expect(maskInstance.getMaskedValue("123,456.78")).toBe("$ 123,456.78");
    expect(maskInstance.getMaskedValue("123,45678")).toBe("$ 12,345,678");
    expect(maskInstance.getMaskedValue("123,456.789")).toBe("$ 123,456.78");
    expect(maskInstance.getMaskedValue("123,456,78,101.12")).toBe("$ 12,345,678,101.12");
  });

  test("get currency masked negative value by formated text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("-123")).toBe("$ -123");
    expect(maskInstance.getMaskedValue("-0123")).toBe("$ -123");
    expect(maskInstance.getMaskedValue("12-34")).toBe("$ -1,234");
    expect(maskInstance.getMaskedValue("-123-,456.78")).toBe("$ 123,456.78");
    expect(maskInstance.getMaskedValue("-123,45-678")).toBe("$ 12,345,678");
    expect(maskInstance.getMaskedValue("123,4-56.789")).toBe("$ -123,456.78");
    expect(maskInstance.getMaskedValue("123,45--6,78,101.12")).toBe("$ 12,345,678,101.12");
  });

  test("get currency masked not allow negative value by formated text", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.allowNegativeValues = false;
    maskInstance.prefix = "$ ";
    expect(maskInstance.getMaskedValue("-123")).toBe("$ 123");
    expect(maskInstance.getMaskedValue("12-34")).toBe("$ 1,234");
    expect(maskInstance.getMaskedValue("-123-,456.78")).toBe("$ 123,456.78");
    expect(maskInstance.getMaskedValue("-123,45-678")).toBe("$ 12,345,678");
    expect(maskInstance.getMaskedValue("123,4-56.789")).toBe("$ 123,456.78");
    expect(maskInstance.getMaskedValue("123,45--6,78,101.12")).toBe("$ 12,345,678,101.12");
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
    expect(result.value, "type #1").toBe("$1");
    expect(result.caretPosition, "type #1").toBe(2);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "$123", inputDirection: "forward" });
    expect(result.value, "type #2.0").toBe("$1,234");
    expect(result.caretPosition, "type #2.0").toBe(6);
  });

  test("currency processInput: insert characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 3, selectionEnd: 3, prevValue: "$ 0", inputDirection: "forward" });
    expect(result.value, "type #1").toBe("$ 1");
    expect(result.caretPosition, "type #1").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "type #2.0").toBe("$ 1,234");
    expect(result.caretPosition, "type #2.0").toBe(7);

    result = maskInstance.processInput({ insertedChars: ",", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "type #2.1").toBe("$ 123");
    expect(result.caretPosition, "type #2.1").toBe(5);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "type #2.2").toBe("$ 123.");
    expect(result.caretPosition, "type #2.2").toBe(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.0").toBe("$ 123.");
    expect(result.caretPosition, "type #3.0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.1").toBe("$ 123.4");
    expect(result.caretPosition, "type #3.1").toBe(7);

    result = maskInstance.processInput({ insertedChars: "456", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.2").toBe("$ 123.45");
    expect(result.caretPosition, "type #3.2").toBe(8);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 6, selectionEnd: 6, prevValue: "$ 123.", inputDirection: "forward" });
    expect(result.value, "type #3.3").toBe("$ 123.");
    expect(result.caretPosition, "type #3.3").toBe(6);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #4.0").toBe("$ 1,023.45");
    expect(result.caretPosition, "type #4.0").toBe(5);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 6, selectionEnd: 6, prevValue: "$ 1,023.45", inputDirection: "forward" });
    expect(result.value, "type #4.1").toBe("$ 10,203.45");
    expect(result.caretPosition, "type #4.1").toBe(7);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #5.0").toBe("$ 1,230.45");
    expect(result.caretPosition, "type #5.0").toBe(7);

    result = maskInstance.processInput({ insertedChars: "d", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #5.1").toBe("$ 123.45");
    expect(result.caretPosition, "type #5.1").toBe(5);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 5, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "type #5.2").toBe("$ 123.45");
    expect(result.caretPosition, "type #5.2").toBe(6);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.1").toBe("$ 10,234.56");
    expect(result.caretPosition, "type #6.1").toBe(4);

    result = maskInstance.processInput({ insertedChars: "d", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.2").toBe("$ 1,234.56");
    expect(result.caretPosition, "type #6.2").toBe(3);

    result = maskInstance.processInput({ insertedChars: ",", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.3").toBe("$ 1,234.56");
    expect(result.caretPosition, "type #6.3").toBe(3);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 5, selectionEnd: 5, prevValue: "$ 1,234,567.89", inputDirection: "forward" });
    expect(result.value, "type #7.0").toBe("$ 12,034,567.89");
    expect(result.caretPosition, "type #7.0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "$ 1,234,567.89", inputDirection: "forward" });
    expect(result.value, "type #7.1").toBe("$ 10,234,567.89");
    expect(result.caretPosition, "type #7.1").toBe(4);
  });

  test("currency processInput simple number: delete characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 0", inputDirection: "forward" });
    expect(result.value, "#1").toBe("$ 0");
    expect(result.caretPosition, "#1").toBe(3);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 0", inputDirection: "forward" });
    expect(result.value, "remove 0").toBe("");
    expect(result.caretPosition, "remove 0").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "remove 3").toBe("$ 12");
    expect(result.caretPosition, "remove 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 123", inputDirection: "forward" });
    expect(result.value, "remove 2").toBe("$ 13");
    expect(result.caretPosition, "remove 2").toBe(3);

  });

  test("currency processInput decimal number: delete characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "remove 3").toBe("$ 12.45");
    expect(result.caretPosition, "remove 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "remove dot").toBe("$ 12,345");
    expect(result.caretPosition, "remove dot").toBe(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 123.45", inputDirection: "forward" });
    expect(result.value, "remove 4").toBe("$ 123.5");
    expect(result.caretPosition, "remove 4").toBe(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 11, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove all").toBe("");
    expect(result.caretPosition, "remove all").toBe(0);
  });

  test("currency processInput big number: delete characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 1").toBe("$ 234,567");
    expect(result.caretPosition, "remove 1").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "try remove ,").toBe("$ 1,234,567");
    expect(result.caretPosition, "try remove ,").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 3").toBe("$ 124,567");
    expect(result.caretPosition, "remove 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 4").toBe("$ 123,567");
    // expect(result.caretPosition, "remove 4").toBe(5);
    expect(result.caretPosition, "remove 4").toBe(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 9, selectionEnd: 10, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 6").toBe("$ 123,457");
    expect(result.caretPosition, "remove 6").toBe(8);
  });

  test("currency processInput simple number: delete characters by backspace", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 2, prevValue: "$ 0", inputDirection: "backward" });
    expect(result.value, "#1").toBe("$ 0");
    expect(result.caretPosition, "#1").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 0", inputDirection: "backward" });
    expect(result.value, "remove 0").toBe("");
    expect(result.caretPosition, "remove 0").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123", inputDirection: "backward" });
    expect(result.value, "remove 3").toBe("$ 12");
    expect(result.caretPosition, "remove 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 123", inputDirection: "backward" });
    expect(result.value, "remove 2").toBe("$ 13");
    expect(result.caretPosition, "remove 2").toBe(3);

  });

  test("currency processInput decimal number: delete characters by backspace", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "$ 123.45", inputDirection: "backward" });
    expect(result.value, "remove 3").toBe("$ 12.45");
    expect(result.caretPosition, "remove 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 123.45", inputDirection: "backward" });
    expect(result.value, "remove dot").toBe("$ 12,345");
    expect(result.caretPosition, "remove dot").toBe(6);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 123.45", inputDirection: "backward" });
    expect(result.value, "remove 4").toBe("$ 123.5");
    expect(result.caretPosition, "remove 4").toBe(6);
  });

  test("currency processInput big number: delete characters by backspace", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 1").toBe("$ 234,567");
    expect(result.caretPosition, "remove 1").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "try remove ,").toBe("$ 1,234,567");
    expect(result.caretPosition, "try remove ,").toBe(3);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 6, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 3").toBe("$ 124,567");
    expect(result.caretPosition, "remove 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 6, selectionEnd: 7, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 4").toBe("$ 123,567");
    expect(result.caretPosition, "remove 4").toBe(5);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 9, selectionEnd: 10, prevValue: "$ 1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 6").toBe("$ 123,457");
    expect(result.caretPosition, "remove 6").toBe(8);
  });

  test("currency processInput: cut + paste characters", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5").toBe("$ 1,267");
    expect(result.caretPosition, "cut 34,5").toBe(5);

    result = maskInstance.processInput({ insertedChars: "00", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5 & insert 00").toBe("$ 120,067");
    expect(result.caretPosition, "cut 34,5 & insert 00").toBe(7);

    result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5 & insert 000000").toBe("$ 1,200,000,067");
    expect(result.caretPosition, "cut 34,5 & insert 000000").toBe(13);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5").toBe("$ 126");
    expect(result.caretPosition, "cut 34.5").toBe(4);

    result = maskInstance.processInput({ insertedChars: "00", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5 & insert 00").toBe("$ 12,006");
    expect(result.caretPosition, "cut 34.5 & insert 00").toBe(7);

    result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 5, selectionEnd: 9, prevValue: "$ 1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5 & insert 000000").toBe("$ 120,000,006");
    expect(result.caretPosition, "cut 34.5 & insert 000000").toBe(12);
  });

  test("currency processInput: allowNegativeValues false", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = false;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert minus").toBe("$ 12");
    expect(result.caretPosition, "try insert minus").toBe(4);
  });

  test("currency processInput: allowNegativeValues true", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("$ -12");
    expect(result.caretPosition, "insert minus").toBe(5);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("$ 12");
    expect(result.caretPosition, "insert minus").toBe(3);
  });

  test("currency processInput: min", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;
    maskInstance.min = -100;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("$ -12");
    expect(result.caretPosition, "insert minus").toBe(5);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toBe("$ -12");
    expect(result.caretPosition, "try insert 4").toBe(5);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("$ 12");
    expect(result.caretPosition, "type 2").toBe(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("$ 123");
    expect(result.caretPosition, "try insert 3").toBe(5);

    result = maskInstance.processInput({ insertedChars: "999", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 999").toBe("$ 12,999");
    expect(result.caretPosition, "try insert 999").toBe(8);
  });

  test("currency processInput: max", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("$ 12");
    expect(result.caretPosition, "type 2").toBe(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("$ 12");
    expect(result.caretPosition, "try insert 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("$ -12");
    expect(result.caretPosition, "insert minus").toBe(5);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toBe("$ -124");
    expect(result.caretPosition, "try insert 4").toBe(6);

    result = maskInstance.processInput({ insertedChars: "999", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 999").toBe("$ -12,999");
    expect(result.caretPosition, "try insert 999").toBe(9);
  });

  test("currency processInput: min & max", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "$ ";
    maskInstance.allowNegativeValues = true;
    maskInstance.min = -100;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "$ 1", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("$ 12");
    expect(result.caretPosition, "type 2").toBe(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("$ 12");
    expect(result.caretPosition, "try insert 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 4, selectionEnd: 4, prevValue: "$ 12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("$ -12");
    expect(result.caretPosition, "insert minus").toBe(5);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 5, selectionEnd: 5, prevValue: "$ -12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toBe("$ -12");
    expect(result.caretPosition, "try insert 4").toBe(5);

    result = maskInstance.processInput({ insertedChars: "", selectionStart: 3, selectionEnd: 4, prevValue: "$ -1", inputDirection: "forward" });
    expect(result.value, "remove 1").toBe("$ -");
    expect(result.caretPosition, "remove 1").toBe(3);
  });
});

// written as escapes so that this file stays ascii: the euro sign, a no-break space, the
// currency symbol token of the pattern grammar, a right-to-left mark and the saudi riyal symbol
const euro = "\u20AC";
const nbsp = "\u00A0";
const symbolToken = "\u00A4";
const rlm = "\u200F";
const riyal = "\u0631.\u0633";

const createCurrencySurvey = (maskSettings?: any, locale?: string): SurveyModel => {
  return new SurveyModel({ locale: locale, elements: [{ type: "text", name: "q1", maskType: "currency", maskSettings: maskSettings }] });
};
const getCurrencyMask = (survey: SurveyModel): InputMaskCurrency => {
  return <InputMaskCurrency>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
};

describe("Currency mask: inherited localization", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("A currency mask renders the format locale's separators inside its affixes", () => {
    const survey = createCurrencySurvey({ prefix: "$ " }, "de");
    const mask = getCurrencyMask(survey);
    expect(mask.decimalSeparator, "german decimal").toBe(",");
    expect(mask.thousandsSeparator, "german thousands").toBe(".");
    expect(mask.getMaskedValue(1234.56), "german rendering").toBe("$ 1.234,56");
    survey.locale = "";
  });

  test("The unmasked value is the same number under every locale", () => {
    const survey = createCurrencySurvey({ prefix: "$ ", suffix: " USD" });
    const mask = getCurrencyMask(survey);
    ["", "de", "fr", "nl", "ru"].forEach(locale => {
      survey.locale = locale;
      const masked = mask.getMaskedValue(1234.56);
      expect(mask.getUnmaskedValue(masked), "locale " + JSON.stringify(locale) + " of " + JSON.stringify(masked)).toBe(1234.56);
    });
    survey.locale = "";
  });

  test("The separators resolve identically on the currency and the numeric mask", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", maskType: "numeric" },
        { type: "text", name: "q2", maskType: "currency", maskSettings: { prefix: "$ " } }
      ]
    });
    const numeric = <InputMaskNumeric>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    const currency = <InputMaskCurrency>(<QuestionTextModel>survey.getQuestionByName("q2")).maskSettings;
    ["", "de", "fr", "ru"].forEach(locale => {
      survey.locale = locale;
      expect(currency.decimalSeparator, "decimal, locale " + JSON.stringify(locale)).toBe(numeric.decimalSeparator);
      expect(currency.thousandsSeparator, "thousands, locale " + JSON.stringify(locale)).toBe(numeric.thousandsSeparator);
      expect(currency.getMaskedValue(1234.56), "masked, locale " + JSON.stringify(locale)).toBe("$ " + numeric.getMaskedValue(1234.56));
    });
    survey.locale = "";
  });

  test("The separator defaultFunc of the numeric mask is inherited by the currency mask", () => {
    const prop = Serializer.findProperty("currencymask", "decimalSeparator");
    // a metadata query - the property grid, the json schema - has no instance to resolve with
    expect(prop.defaultValue, "the canonical default").toBe(".");
    const survey = createCurrencySurvey(undefined, "de");
    const mask = getCurrencyMask(survey);
    expect(mask.getExplicitPropertyValue("decimalSeparator"), "nothing is stored").toBeUndefined();
    expect(prop.getDefaultValue(mask), "resolved for the mask's survey").toBe(",");
    expect(mask.decimalSeparator, "the getter returns the locale value").toBe(",");
    expect(mask.thousandsSeparator, "and so does the thousands separator").toBe(".");
    survey.locale = "";
  });

  test("An authored separator on a currency mask still wins", () => {
    const survey = createCurrencySurvey({ prefix: "$ ", decimalSeparator: "*", thousandsSeparator: "|" }, "de");
    const mask = getCurrencyMask(survey);
    expect(mask.getMaskedValue(1234.56)).toBe("$ 1|234*56");
    survey.locale = "";
  });
});

describe("Currency mask: affix wrapping", () => {
  test("An affix that also occurs inside the number is still rendered", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = ",";
    maskInstance.suffix = ".";
    expect(maskInstance.getMaskedValue(1234.5), "the affixes are added at the boundaries").toBe(",1,234.5.");
    expect(maskInstance.getUnmaskedValue(",1,234.5."), "and removed there").toBe(1234.5);
  });

  test("unwrapInputArgs strips an affix only at the text boundary", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = ",";
    const args: ITextInputParams = { prevValue: ",1,234", selectionStart: 6, selectionEnd: 6, insertedChars: "" };
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue, "the leading prefix is removed").toBe("1,234");
    expect(args.selectionStart, "the caret follows it").toBe(5);

    const inner: ITextInputParams = { prevValue: "1,234", selectionStart: 5, selectionEnd: 5, insertedChars: "" };
    maskInstance.unwrapInputArgs(inner);
    expect(inner.prevValue, "the same character inside the number is not an affix").toBe("1,234");
    expect(inner.selectionStart, "and the caret does not move").toBe(5);
  });

  test("Explicitly empty affixes leave the number alone", () => {
    const maskInstance = new InputMaskCurrency();
    maskInstance.prefix = "";
    maskInstance.suffix = "";
    expect(maskInstance.getMaskedValue(1234)).toBe("1,234");
    const args: ITextInputParams = { prevValue: "1,234", selectionStart: 5, selectionEnd: 5, insertedChars: "" };
    maskInstance.unwrapInputArgs(args);
    expect(args.prevValue).toBe("1,234");
    expect(args.selectionStart).toBe(5);
  });
});

describe("Currency mask: the locale placed symbol", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
    delete localeData["xx"];
  });

  test("Every pattern shape places the symbol and the sign", () => {
    const shapes = [
      { pattern: symbolToken + "#", positive: euro + "1,234.56", negative: "-" + euro + "1,234.56" },
      { pattern: "#" + nbsp + symbolToken, positive: "1,234.56" + nbsp + euro, negative: "-1,234.56" + nbsp + euro },
      { pattern: symbolToken + nbsp + "#;" + symbolToken + nbsp + "-#", positive: euro + nbsp + "1,234.56", negative: euro + nbsp + "-1,234.56" },
      { pattern: symbolToken + nbsp + "#;-" + symbolToken + nbsp + "#", positive: euro + nbsp + "1,234.56", negative: "-" + euro + nbsp + "1,234.56" },
      { pattern: symbolToken + nbsp + "#;" + symbolToken + "-#", positive: euro + nbsp + "1,234.56", negative: euro + "-1,234.56" }
    ];
    const survey = createCurrencySurvey({ currencySymbol: euro });
    const mask = getCurrencyMask(survey);
    shapes.forEach(shape => {
      // the resolved pattern is cached per locale, so the data changes while no locale is set
      survey.regionOptions.locale = "";
      localeData["xx"] = { decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: shape.pattern };
      survey.regionOptions.locale = "xx";
      const title = "pattern " + JSON.stringify(shape.pattern);
      expect(mask.getMaskedValue(1234.56), title).toBe(shape.positive);
      expect(mask.getMaskedValue(-1234.56), title + ", negative").toBe(shape.negative);
      expect(mask.getUnmaskedValue(shape.positive), title + ", round trip").toBe(1234.56);
      expect(mask.getUnmaskedValue(shape.negative), title + ", negative round trip").toBe(-1234.56);
    });
    survey.regionOptions.locale = "";
  });

  test.each([
    { title: "a prefix only", settings: { prefix: "$ " }, positive: "$ 1,234.56", negative: "$ -1,234.56" },
    { title: "a suffix only", settings: { suffix: " USD" }, positive: "1,234.56 USD", negative: "-1,234.56 USD" },
    { title: "an empty prefix", settings: { prefix: "" }, positive: "1,234.56", negative: "-1,234.56" },
    { title: "an empty suffix", settings: { suffix: "" }, positive: "1,234.56", negative: "-1,234.56" },
    { title: "both affixes", settings: { prefix: "$ ", suffix: " USD" }, positive: "$ 1,234.56 USD", negative: "$ -1,234.56 USD" },
    { title: "neither affix", settings: {}, positive: "\u20AC1,234.56", negative: "-\u20AC1,234.56" }
  ])("A currency symbol next to $title", ({ settings, positive, negative }) => {
    const survey = createCurrencySurvey(Object.assign({ currencySymbol: euro }, settings));
    const mask = getCurrencyMask(survey);
    expect(mask.getMaskedValue(1234.56), "positive").toBe(positive);
    expect(mask.getMaskedValue(-1234.56), "negative").toBe(negative);
    expect(mask.getUnmaskedValue(positive), "positive round trip").toBe(1234.56);
    expect(mask.getUnmaskedValue(negative), "negative round trip").toBe(-1234.56);
  });

  test("No symbol renders no affix", () => {
    const survey = createCurrencySurvey();
    const mask = getCurrencyMask(survey);
    expect(mask.activePrefix, "no prefix").toBe("");
    expect(mask.activeSuffix, "no suffix").toBe("");
    expect(mask.getMaskedValue(1234.56), "english").toBe("1,234.56");
    expect(mask.getMaskedValue(-1234.56), "english negative").toBe("-1,234.56");
    survey.locale = "de";
    expect(mask.getMaskedValue(1234.56), "german").toBe("1.234,56");
    survey.locale = "";
  });

  test("An empty symbol renders no affix either", () => {
    const survey = createCurrencySurvey({ currencySymbol: "" });
    const mask = getCurrencyMask(survey);
    expect(mask.activePrefix).toBe("");
    expect(mask.getMaskedValue(1234.56)).toBe("1,234.56");
  });

  test("The active affixes follow the locale, the symbol and the affix mode", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro });
    const mask = getCurrencyMask(survey);
    expect([mask.activePrefix, mask.activeSuffix], "english places the symbol first").toEqual([euro, ""]);
    survey.locale = "de";
    expect([mask.activePrefix, mask.activeSuffix], "german places it last").toEqual(["", nbsp + euro]);
    survey.locale = "nl";
    expect([mask.activePrefix, mask.activeSuffix], "dutch adds a space").toEqual([euro + nbsp, ""]);
    mask.prefix = "$ ";
    expect([mask.activePrefix, mask.activeSuffix], "an authored affix wins").toEqual(["$ ", ""]);
    mask.resetPropertyValue("prefix");
    expect([mask.activePrefix, mask.activeSuffix], "clearing it restores the locale").toEqual([euro + nbsp, ""]);
    survey.locale = "";
  });

  test("Explicitly empty affixes round trip and keep the symbol suppressed", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro, prefix: "", suffix: "" });
    expect(getCurrencyMask(survey).getMaskedValue(1234.56), "authored mode").toBe("1,234.56");

    const json = survey.toJSON();
    const maskJson = json.pages[0].elements[0].maskSettings;
    expect(maskJson.prefix, "the empty prefix is written").toBe("");
    expect(maskJson.suffix, "the empty suffix is written").toBe("");
    expect(maskJson.currencySymbol, "the symbol is written").toBe(euro);

    const survey2 = new SurveyModel(json);
    expect(getCurrencyMask(survey2).getMaskedValue(1234.56), "the same text after a reload").toBe("1,234.56");
    expect(getCurrencyMask(survey2).getMaskedValue(-1234.56), "and the same negative text").toBe("-1,234.56");
  });

  test("An unset affix is not serialized while a symbol is", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro }, "de");
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].maskSettings, "the survey json").toEqual({ currencySymbol: euro });
    expect(getCurrencyMask(survey).getData(), "the getData path agrees").toEqual({ currencySymbol: euro });
    survey.locale = "";
  });

  test.each(["en", "nl"])("Formatted change events and pasted amounts preserve their value under %s", (locale) => {
    const survey = createCurrencySurvey({ currencySymbol: riyal }, locale);
    const mask = getCurrencyMask(survey);
    const input = document.createElement("input");
    const adapter = new InputElementAdapter(mask, input);
    try {
      [1234.56, -1234.56].forEach(value => {
        const formatted = mask.getMaskedValue(value);
        input.value = formatted;
        adapter.changeHandler({ target: input });
        expect(input.value, "a change event preserves the formatted amount").toBe(formatted);
        expect(mask.getUnmaskedValue(input.value)).toBe(value);

        input.value = mask.getMaskedValue(99);
        input.setSelectionRange(0, input.value.length);
        adapter.beforeInputHandler({
          data: formatted, inputType: "insertFromPaste", target: input, preventDefault: () => { }
        });
        expect(input.value, "pasting replaces the selected amount").toBe(formatted);
        expect(mask.getUnmaskedValue(input.value)).toBe(value);
      });
    } finally {
      adapter.dispose();
      survey.dispose();
    }
  });

  test.each([
    { settings: { currencySymbol: "1" }, value: 123, expected: "1123" },
    { settings: { currencySymbol: "1" }, value: -123, expected: "-1123" },
    { settings: { prefix: "1", suffix: "3" }, value: 123, expected: "11233" }
  ])("Affixes overlapping the number are added exactly once: %j", ({ settings, value, expected }) => {
    const survey = createCurrencySurvey(settings);
    const mask = getCurrencyMask(survey);
    try {
      expect(mask.getMaskedValue(value)).toBe(expected);
      expect(mask.getUnmaskedValue(expected)).toBe(value);
    } finally {
      survey.dispose();
    }
  });

  test.each([
    { locale: "en", symbol: "$", signPosition: 0 },
    { locale: "nl", symbol: "$", signPosition: 2 },
    { locale: "en", symbol: "-$", signPosition: 0 }
  ])("Deleting the localized sign preserves the digits: %j", ({ locale, symbol, signPosition }) => {
    const survey = createCurrencySurvey({ currencySymbol: symbol }, locale);
    const mask = getCurrencyMask(survey);
    const input = document.createElement("input");
    const adapter = new InputElementAdapter(mask, input);
    try {
      ["deleteContentForward", "deleteContentBackward"].forEach(inputType => {
        input.value = mask.getMaskedValue(-123);
        const caret = signPosition + (inputType === "deleteContentBackward" ? 1 : 0);
        input.setSelectionRange(caret, caret);
        adapter.beforeInputHandler({ data: null, inputType, target: input, preventDefault: () => { } });
        expect(input.value, inputType).toBe(mask.getMaskedValue(123));
        expect(mask.getUnmaskedValue(input.value), inputType).toBe(123);
        expect(input.selectionStart, inputType).toBe(mask.activePrefix.length);
      });
    } finally {
      adapter.dispose();
      survey.dispose();
    }
  });

  test("A symbol is inserted as literal text", () => {
    const survey = createCurrencySurvey();
    const mask = getCurrencyMask(survey);
    [symbolToken + "#;-$", riyal, "9", "-", ".", "$"].forEach(symbol => {
      mask.currencySymbol = symbol;
      const title = "symbol " + JSON.stringify(symbol);
      const positive = mask.getMaskedValue(1234.56);
      const negative = mask.getMaskedValue(-1234.56);
      expect(positive, title).toBe(symbol + "1,234.56");
      expect(negative, title + ", negative").toBe("-" + symbol + "1,234.56");
      expect(mask.getUnmaskedValue(positive), title + ", round trip").toBe(1234.56);
      expect(mask.getUnmaskedValue(negative), title + ", negative round trip").toBe(-1234.56);
    });
    mask.currencySymbol = riyal;
    expect(mask.getUnmaskedValue("1,234.56"), "a bare number is still accepted").toBe(1234.56);
    expect(mask.getUnmaskedValue("$ 123"), "and so is text around one").toBe(123);
  });

  test.each([false, true])("A symbol that contains the decimal separator keeps the numeric meaning, saveMaskedValue=%s", (saveMaskedValue) => {
    const survey = createCurrencySurvey({ currencySymbol: riyal, saveMaskedValue: saveMaskedValue });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.inputValue = riyal + "1,234.56";
    expect(q.inputValue, "the rendered text").toBe(riyal + "1,234.56");
    expect(q.value, "the stored value").toBe(saveMaskedValue ? riyal + "1,234.56" : 1234.56);
    expect(q.getExpressionValue(q.value), "the expression value").toBe(1234.56);

    q.inputValue = "-" + riyal + "1,234.56";
    expect(q.value, "the stored negative value").toBe(saveMaskedValue ? "-" + riyal + "1,234.56" : -1234.56);
    expect(q.getExpressionValue(q.value), "the negative expression value").toBe(-1234.56);
  });

  test("Typing under a locale that puts the symbol first", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createCurrencySurvey({ currencySymbol: euro });
    const mask = getCurrencyMask(survey);
    const adapter = new InputElementAdapter(mask, testInput);
    const type = (chars: string): void => {
      adapter.beforeInputHandler({ data: chars, inputType: "insertText", target: testInput, preventDefault: () => { } });
    };
    const remove = (inputType: string, caret: number): void => {
      testInput.setSelectionRange(caret, caret);
      adapter.beforeInputHandler({ data: null, inputType: inputType, target: testInput, preventDefault: () => { } });
    };

    type("1");
    expect(testInput.value, "type 1").toBe(euro + "1");
    expect(testInput.selectionStart, "caret after 1").toBe(2);

    type("2");
    type("3");
    type("4");
    expect(testInput.value, "type 4").toBe(euro + "1,234");
    expect(testInput.selectionStart, "caret after 4").toBe(6);

    type(".");
    type("5");
    expect(testInput.value, "type the fraction").toBe(euro + "1,234.5");
    expect(testInput.selectionStart, "caret after the fraction").toBe(8);

    remove("deleteContentBackward", 6);
    expect(testInput.value, "backspace over the 4").toBe(euro + "123.5");
    expect(testInput.selectionStart, "caret after the backspace").toBe(4);

    remove("deleteContentForward", 4);
    expect(testInput.value, "delete the decimal separator").toBe(euro + "1,235");
    expect(testInput.selectionStart, "caret after the delete").toBe(5);

    adapter.dispose();
    testInput.remove();
  });

  test("Typing a negative value under a locale that puts the sign between the symbol and the number", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createCurrencySurvey({ currencySymbol: euro }, "nl");
    const mask = getCurrencyMask(survey);
    const adapter = new InputElementAdapter(mask, testInput);
    const type = (chars: string): void => {
      adapter.beforeInputHandler({ data: chars, inputType: "insertText", target: testInput, preventDefault: () => { } });
    };

    type("-");
    expect(testInput.value, "the sign alone").toBe(euro + nbsp + "-");
    expect(testInput.selectionStart, "caret after the sign").toBe(3);

    type("1");
    expect(testInput.value, "type 1").toBe(euro + nbsp + "-1");
    expect(testInput.selectionStart, "caret after 1").toBe(4);

    type("2");
    type("3");
    type("4");
    expect(testInput.value, "type 4").toBe(euro + nbsp + "-1.234");
    expect(testInput.selectionStart, "caret after 4").toBe(8);

    testInput.setSelectionRange(8, 8);
    adapter.beforeInputHandler({ data: null, inputType: "deleteContentBackward", target: testInput, preventDefault: () => { } });
    expect(testInput.value, "backspace over the 4").toBe(euro + nbsp + "-123");
    expect(testInput.selectionStart, "caret after the backspace").toBe(6);
    expect(mask.getUnmaskedValue(testInput.value), "the entered number").toBe(-123);

    adapter.dispose();
    testInput.remove();
    survey.locale = "";
  });

  test("Typing the sign first under a locale that puts the sign first", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createCurrencySurvey({ currencySymbol: euro });
    const mask = getCurrencyMask(survey);
    const adapter = new InputElementAdapter(mask, testInput);
    const type = (chars: string): void => {
      adapter.beforeInputHandler({ data: chars, inputType: "insertText", target: testInput, preventDefault: () => { } });
    };

    type("-");
    expect(testInput.value, "the sign alone").toBe("-" + euro);
    expect(testInput.selectionStart, "caret after the sign").toBe(2);

    type("5");
    expect(testInput.value, "type 5").toBe("-" + euro + "5");
    expect(testInput.selectionStart, "caret after 5").toBe(3);
    expect(mask.getUnmaskedValue(testInput.value), "the entered number").toBe(-5);

    adapter.dispose();
    testInput.remove();
  });

  test("allowNegativeValues false keeps the sign out of a locale placed affix", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro, allowNegativeValues: false });
    const mask = getCurrencyMask(survey);
    expect(mask.getMaskedValue("-1234.56")).toBe(euro + "1,234.56");
    const result = mask.processInput({ insertedChars: "-", selectionStart: 1, selectionEnd: 1, prevValue: euro, inputDirection: "forward" });
    // an empty entry has no affixes of its own, as a currency mask has always rendered it
    expect(result.value, "the sign is not accepted").toBe("");
  });

  test.each([
    { title: "an authored prefix", settings: { prefix: "$ " }, before: "$ 1.234,5", after: "$ 1,234.5" },
    { title: "a locale placed symbol", settings: { currencySymbol: "\u20AC" }, before: "1.234,5\u00A0\u20AC", after: "\u20AC1,234.5" }
  ])("A half typed entry survives a locale change with $title", ({ settings, before, after }) => {
    const survey = createCurrencySurvey(settings, "de");
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      input.focus();
      input.value = before;
      survey.locale = "en";
      expect(input.value, "the entry is re-formatted").toBe(after);
      expect(q.inputValue, "the question keeps the same text").toBe(after);
      expect(getCurrencyMask(survey).getUnmaskedValue(input.value), "it still means the same number").toBe(1234.5);
    } finally {
      survey.dispose();
      input.remove();
    }
  });

  test("A negative entry with a trailing decimal separator survives a locale change", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro }, "de");
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      input.focus();
      input.value = "-1.234," + nbsp + euro;
      survey.locale = "en";
      expect(input.value, "the sign moves in front of the symbol").toBe("-" + euro + "1,234.");
      expect(q.inputValue).toBe("-" + euro + "1,234.");
      survey.regionOptions.locale = "nl";
      expect(input.value, "and between the symbol and the number").toBe(euro + nbsp + "-1.234,");
    } finally {
      survey.dispose();
      input.remove();
    }
  });

  test("A focused deletion survives a locale change with a locale placed symbol", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro }, "de");
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      q.value = 1234;
      expect(input.value, "the german rendering").toBe("1.234" + nbsp + euro);
      input.focus();
      input.setSelectionRange(0, input.value.length);
      q["maskInputAdapter"].beforeInputHandler({
        data: null, inputType: "deleteContentBackward", target: input, preventDefault: () => { }
      });
      expect(input.value, "the field is emptied").toBe("");

      survey.locale = "en";
      expect(input.value, "an emptied field stays empty").toBe("");
      expect(q.inputValue).toBe("");
      expect(q.value, "the stored number is untouched").toBe(1234);
    } finally {
      survey.dispose();
      input.remove();
    }
  });

  test("A saved value and an entered text with different signs are converted independently", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro, saveMaskedValue: true }, "de");
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      q.inputValue = "1234,56";
      expect(q.value, "the german masked value is stored").toBe("1.234,56" + nbsp + euro);
      input.focus();
      input.value = "-1.234,5" + nbsp + euro;

      survey.locale = "en";
      expect(q.value, "the positive saved value").toBe(euro + "1,234.56");
      expect(input.value, "the negative entry").toBe("-" + euro + "1,234.5");
      expect(q.getExpressionValue(q.value), "the expression value").toBe(1234.56);
    } finally {
      survey.dispose();
      input.remove();
    }
  });

  test.each(["locale", "regionOptions.locale"])("Reading the active affixes in a callback during a %s change preserves both texts", (propertyName) => {
    const survey = createCurrencySurvey({ currencySymbol: euro, saveMaskedValue: true }, "de");
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      q.inputValue = "1234,56";
      input.focus();
      input.value = "-1.234,5" + nbsp + euro;
      q.localeChangedCallback = () => {
        const mask = getCurrencyMask(survey);
        // the new defaults, read before the mask converts the text the previous ones produced
        expect(mask.activePrefix).toBe(euro);
        expect(mask.activeSuffix).toBe("");
        expect(mask.decimalSeparator).toBe(".");
      };

      if (propertyName === "locale") { survey.locale = "en"; } else { survey.regionOptions.locale = "en"; }
      expect(q.value, "the saved value").toBe(euro + "1,234.56");
      expect(input.value, "the entered text").toBe("-" + euro + "1,234.5");
      q.localeChangedCallback = undefined;
    } finally {
      survey.dispose();
      input.remove();
    }
  });

  test("A masked value stored under one locale is re-masked into the new locale's affixes", () => {
    const survey = createCurrencySurvey({ currencySymbol: euro, saveMaskedValue: true }, "de");
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.inputValue = "-1234,56";
    expect(q.value, "the german masked value").toBe("-1.234,56" + nbsp + euro);

    survey.regionOptions.locale = "nl";
    expect(q.value, "the dutch masked value").toBe(euro + nbsp + "-1.234,56");
    expect(q.inputValue, "the rendered text follows").toBe(euro + nbsp + "-1.234,56");
    expect(q.getExpressionValue(q.value), "the number never changes").toBe(-1234.56);
    survey.dispose();
  });

  test("Pattern validation", () => {
    expect(isValidCurrencyPattern(symbolToken + "#"), "a leading symbol").toBe(true);
    expect(isValidCurrencyPattern("#" + nbsp + symbolToken), "a trailing symbol").toBe(true);
    expect(isValidCurrencyPattern(symbolToken + nbsp + "#;" + symbolToken + nbsp + "-#"), "an explicit negative form").toBe(true);
    expect(isValidCurrencyPattern("#"), "a pattern with nothing to place").toBe(true);
    expect(isValidCurrencyPattern(""), "an empty pattern").toBe(false);
    expect(isValidCurrencyPattern(undefined), "no pattern").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + "##"), "two numbers").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + symbolToken + "#"), "two symbols").toBe(false);
    expect(isValidCurrencyPattern(symbolToken), "no number").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + "#;" + symbolToken + "-#;#"), "three subpatterns").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + "1#"), "a digit").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + "#" + rlm), "a control character").toBe(false);
    expect(isValidCurrencyPattern("-" + symbolToken + "#"), "a sign in the positive form").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + "#;" + symbolToken + "#"), "no sign in the negative form").toBe(false);
    expect(isValidCurrencyPattern(symbolToken + "#;-" + symbolToken + "-#"), "two signs in the negative form").toBe(false);
  });

  test("An invalid pattern falls through the chain", () => {
    localeData["xx"] = { currencyPattern: symbolToken + "#" + rlm };
    const survey = createCurrencySurvey({ currencySymbol: euro });
    const mask = getCurrencyMask(survey);
    survey.regionOptions.locale = "xx";
    expect(mask.getMaskedValue(1234.56), "the english pattern is used instead").toBe(euro + "1,234.56");
    survey.regionOptions.locale = "";
  });

  test.skip("A currencyPattern in survey.regionOptions beats the locale - needs tier 03", () => {
    // tier 03 introduces the region options object; the mask reads it through getFormatValue
  });

  const isRtlSeriesMerged = typeof (<any>InputMaskBase.prototype).getInputDirection === "function";
  test.skipIf(!isRtlSeriesMerged)("The input direction follows the resolved symbol - needs bug/11809-mask-rtl", () => {
    const survey = createCurrencySurvey({ currencySymbol: riyal });
    const mask = getCurrencyMask(survey);
    expect((<any>mask).getLiteralText(), "the symbol is part of the literal text").toContain(riyal);
    expect((<any>mask).getInputDirection(), "a right-to-left symbol opts out of the forced direction").toBe("auto");

    mask.currencySymbol = euro;
    survey.locale = "de";
    expect((<any>mask).getInputDirection(), "a left-to-right symbol does not").toBe("ltr");
    survey.locale = "";
  });
});
