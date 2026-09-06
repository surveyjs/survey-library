import { JsonObject, Serializer } from "../../src/jsonobject";
import { splitString, InputMaskNumeric } from "../../src/mask/mask_numeric";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { surveyLocalization } from "../../src/surveyStrings";
import { InputElementAdapter } from "../../src/mask/input_element_adapter";

import { describe, test, expect, afterEach } from "vitest";
describe("Numeric mask", () => {
  test("splitString", () => {
    let result = splitString("1234567", false);
    expect(result.length).toBe(3);
    expect(result[0]).toBe("123");
    expect(result[1]).toBe("456");
    expect(result[2]).toBe("7");

    result = splitString("1234567");
    expect(result.length).toBe(3);
    expect(result[0]).toBe("1");
    expect(result[1]).toBe("234");
    expect(result[2]).toBe("567");
  });

  test("parseNumber", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.parseNumber("123").integralPart).toBe("123");
    expect(maskInstance.parseNumber("123").fractionalPart).toBe("");

    expect(maskInstance.parseNumber("123.45").integralPart).toBe("123");
    expect(maskInstance.parseNumber("123.45").fractionalPart).toBe("45");

    expect(maskInstance.parseNumber(".45").integralPart).toBe("");
    expect(maskInstance.parseNumber(".45").fractionalPart).toBe("45");
    expect(maskInstance.parseNumber("123.").integralPart).toBe("123");
    expect(maskInstance.parseNumber("123.").fractionalPart).toBe("");
  });

  test("validationNumber: matchWholeMask is true", () => {
    let maskInstance = new InputMaskNumeric();
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, true), "#1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, true), "#2").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, true), "#3").toBe(true);

    maskInstance = new InputMaskNumeric();
    maskInstance.min = -100;
    maskInstance.max = 100;
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, true), "#4").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, true), "#5").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, true), "#6").toBe(false);
  });

  test("validationNumber: matchWholeMask is false - one limit", () => {
    let maskInstance = new InputMaskNumeric();
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "", fractionalPart: "123" }, false), "#2").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "456" }, false), "#3").toBe(true);

    maskInstance.max = 100;
    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), "#4").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), "#5").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#6").toBe(false);

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), "#4.1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), "#5.1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), "#6.1").toBe(true);

    maskInstance.max = -100;
    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), "#4x").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), "#5x").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#6x").toBe(false);

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), "#4.1x").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), "#5.1x").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), "#6.1x").toBe(true);

    maskInstance.max = undefined as any;
    maskInstance.min = 100;

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), "#4.2").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), "#5.2").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#6.2").toBe(true);

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), "#4.3").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), "#5.3").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), "#6.3").toBe(false);

    maskInstance.min = -100;
    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), "#4.2n").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), "#5.2n").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#6.2n").toBe(true);

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), "#4.3n").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), "#5.3n").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), "#6.3n").toBe(false);

  });

  test("validationNumber: matchWholeMask is false - both limits", () => {
    let maskInstance = new InputMaskNumeric();
    maskInstance.max = 200;
    maskInstance.min = 100;

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), "#1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), "#2").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#3").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "1234", fractionalPart: "" }, false), "#4").toBe(false);

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), "#5").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), "#6").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), "#7").toBe(false);

    maskInstance.max = 100;
    maskInstance.min = -100;

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "" }, false), "#1.1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "" }, false), "#2.1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "" }, false), "#3.1").toBe(false);
    expect(maskInstance.validateNumber({ integralPart: "1234", fractionalPart: "" }, false), "#4.1").toBe(false);

    expect(maskInstance.validateNumber({ integralPart: "1", fractionalPart: "", isNegative: true }, false), "#5.1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "12", fractionalPart: "", isNegative: true }, false), "#6.1").toBe(true);
    expect(maskInstance.validateNumber({ integralPart: "123", fractionalPart: "", isNegative: true }, false), "#7.1").toBe(false);
  });

  test("get numeric masked valid text", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getMaskedValue(123)).toBe("123");
    expect(maskInstance.getMaskedValue(123456)).toBe("123,456");
    expect(maskInstance.getMaskedValue(123456.78)).toBe("123,456.78");
    expect(maskInstance.getMaskedValue(123456.789)).toBe("123,456.78");

    expect(maskInstance.getMaskedValue("123456.78")).toBe("123,456.78");
    expect(maskInstance.getMaskedValue("123456.789")).toBe("123,456.78");
  });

  test("get numeric masked invalid text", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getNumberMaskedValue("")).toBe("");
    expect(maskInstance.getNumberMaskedValue("9")).toBe("9");
    expect(maskInstance.getNumberMaskedValue("123A")).toBe("123");
    expect(maskInstance.getNumberMaskedValue("123a")).toBe("123");
    expect(maskInstance.getNumberMaskedValue("12a3")).toBe("123");
  });

  test("get numeric masked invalid text matchWholeMask true", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getNumberMaskedValue("", true)).toBe("");
    expect(maskInstance.getNumberMaskedValue("-", true)).toBe("");
    expect(maskInstance.getNumberMaskedValue(".", true)).toBe("");
    expect(maskInstance.getNumberMaskedValue(",", true)).toBe("");
    expect(maskInstance.getNumberMaskedValue("0", true)).toBe("0");
    expect(maskInstance.getNumberMaskedValue("-0", true)).toBe("0");
    expect(maskInstance.getNumberMaskedValue("-9,", true)).toBe("-9");
    expect(maskInstance.getNumberMaskedValue("9.", true)).toBe("9");
    expect(maskInstance.getNumberMaskedValue("123,", true)).toBe("123");
  });

  test("get numeric masked value by formated text", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getNumberMaskedValue("0")).toBe("0");
    expect(maskInstance.getNumberMaskedValue("01")).toBe("1");
    expect(maskInstance.getNumberMaskedValue("123")).toBe("123");
    expect(maskInstance.getNumberMaskedValue("1234")).toBe("1,234");
    expect(maskInstance.getNumberMaskedValue("123,")).toBe("123");
    expect(maskInstance.getNumberMaskedValue("123.")).toBe("123.");
    expect(maskInstance.getNumberMaskedValue("123.4")).toBe("123.4");
    expect(maskInstance.getNumberMaskedValue("123,.")).toBe("123.");
    expect(maskInstance.getNumberMaskedValue("1239,456")).toBe("1,239,456");
    expect(maskInstance.getNumberMaskedValue("1239456")).toBe("1,239,456");
    expect(maskInstance.getNumberMaskedValue("123,456.78")).toBe("123,456.78");
    expect(maskInstance.getNumberMaskedValue("123,45678")).toBe("12,345,678");
    expect(maskInstance.getNumberMaskedValue("123,456.789")).toBe("123,456.78");
    expect(maskInstance.getNumberMaskedValue("123,456,78,101.12")).toBe("12,345,678,101.12");
  });

  test("get numeric masked negative value by formated text", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getNumberMaskedValue("-123")).toBe("-123");
    expect(maskInstance.getNumberMaskedValue("-0123")).toBe("-123");
    expect(maskInstance.getNumberMaskedValue("12-34")).toBe("-1,234");
    expect(maskInstance.getNumberMaskedValue("-123-,456.78")).toBe("123,456.78");
    expect(maskInstance.getNumberMaskedValue("-123,45-678")).toBe("12,345,678");
    expect(maskInstance.getNumberMaskedValue("123,4-56.789")).toBe("-123,456.78");
    expect(maskInstance.getNumberMaskedValue("123,45--6,78,101.12")).toBe("12,345,678,101.12");
  });

  test("get numeric masked not allow negative value by formated text", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = false;
    expect(maskInstance.getNumberMaskedValue("-123")).toBe("123");
    expect(maskInstance.getNumberMaskedValue("12-34")).toBe("1,234");
    expect(maskInstance.getNumberMaskedValue("-123-,456.78")).toBe("123,456.78");
    expect(maskInstance.getNumberMaskedValue("-123,45-678")).toBe("12,345,678");
    expect(maskInstance.getNumberMaskedValue("123,4-56.789")).toBe("123,456.78");
    expect(maskInstance.getNumberMaskedValue("123,45--6,78,101.12")).toBe("12,345,678,101.12");
  });

  test("get numeric unmasked valid text", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getUnmaskedValue("") === undefined).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("0") === 0).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123") === 123).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123,456") === 123456).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123,456.78") === 123456.78).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123,456.789") === 123456.78).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123,456,789,101.12") === 123456789101.12).toBeTruthy();
  });

  test("get numeric unmasked invalid text", () => {
    const maskInstance = new InputMaskNumeric();
    expect(maskInstance.getUnmaskedValue(" ") === undefined).toBeTruthy();
    expect(maskInstance.getUnmaskedValue(".") === undefined).toBeTruthy();
    expect(maskInstance.getUnmaskedValue(",") === undefined).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("-") === undefined).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("@") === undefined).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("a") === undefined).toBeTruthy();
  });

  test("get numeric unmasked valid text custom settings", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.setData({ "decimalSeparator": ",", "thousandsSeparator": "." });
    expect(maskInstance.getUnmaskedValue("0") === 0).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123") === 123).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123.456") === 123456).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123.456,78") === 123456.78).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123.456,789") === 123456.78).toBeTruthy();
    expect(maskInstance.getUnmaskedValue("123.456.789.101,12") === 123456789101.12).toBeTruthy();
  });

  test("numeric processInput: insert characters", () => {
    const maskInstance = new InputMaskNumeric();
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 1, selectionEnd: 1, prevValue: "0", inputDirection: "forward" });
    expect(result.value, "type #1").toBe("1");
    expect(result.caretPosition, "type #1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
    expect(result.value, "type #2.0").toBe("1,234");
    expect(result.caretPosition, "type #2.0").toBe(5);

    result = maskInstance.processInput({ insertedChars: ",", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
    expect(result.value, "type #2.1").toBe("123");
    expect(result.caretPosition, "type #2.1").toBe(3);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
    expect(result.value, "type #2.2").toBe("123.");
    expect(result.caretPosition, "type #2.2").toBe(4);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
    expect(result.value, "type #3.0").toBe("123.");
    expect(result.caretPosition, "type #3.0").toBe(4);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
    expect(result.value, "type #3.1").toBe("123.4");
    expect(result.caretPosition, "type #3.1").toBe(5);

    result = maskInstance.processInput({ insertedChars: "456", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
    expect(result.value, "type #3.2").toBe("123.45");
    expect(result.caretPosition, "type #3.2").toBe(6);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 4, selectionEnd: 4, prevValue: "123.", inputDirection: "forward" });
    expect(result.value, "type #3.3").toBe("123.");
    expect(result.caretPosition, "type #3.3").toBe(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "type #4.0").toBe("1,023.45");
    expect(result.caretPosition, "type #4.0").toBe(3);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "1,023.45", inputDirection: "forward" });
    expect(result.value, "type #4.1").toBe("10,203.45");
    expect(result.caretPosition, "type #4.1").toBe(5);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "type #5.0").toBe("1,230.45");
    expect(result.caretPosition, "type #5.0").toBe(5);

    result = maskInstance.processInput({ insertedChars: "d", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "type #5.1").toBe("123.45");
    expect(result.caretPosition, "type #5.1").toBe(3);

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 3, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "type #5.2").toBe("123.45");
    expect(result.caretPosition, "type #5.2").toBe(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.1").toBe("10,234.56");
    expect(result.caretPosition, "type #6.1").toBe(2);

    result = maskInstance.processInput({ insertedChars: "d", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.2").toBe("1,234.56");
    expect(result.caretPosition, "type #6.2").toBe(1);

    result = maskInstance.processInput({ insertedChars: ",", selectionStart: 1, selectionEnd: 1, prevValue: "1,234.56", inputDirection: "forward" });
    expect(result.value, "type #6.3").toBe("1,234.56");
    expect(result.caretPosition, "type #6.3").toBe(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "1,234,567.89", inputDirection: "forward" });
    expect(result.value, "type #7.0").toBe("12,034,567.89");
    expect(result.caretPosition, "type #7.0").toBe(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 2, selectionEnd: 2, prevValue: "1,234,567.89", inputDirection: "forward" });
    expect(result.value, "type #7.1").toBe("10,234,567.89");
    expect(result.caretPosition, "type #7.1").toBe(2);
  });

  test("numeric processInput simple number: delete characters", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "0", inputDirection: "forward" });
    expect(result.value, "#1").toBe("0");
    expect(result.caretPosition, "#1").toBe(1);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "0", inputDirection: "forward" });
    expect(result.value, "remove 0").toBe("");
    expect(result.caretPosition, "remove 0").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
    expect(result.value, "remove 3").toBe("12");
    expect(result.caretPosition, "remove 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "123", inputDirection: "forward" });
    expect(result.value, "remove 2").toBe("13");
    expect(result.caretPosition, "remove 2").toBe(1);

  });

  test("numeric processInput decimal number: delete characters", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "remove 3").toBe("12.45");
    expect(result.caretPosition, "remove 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "remove dot").toBe("12,345");
    expect(result.caretPosition, "remove dot").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "123.45", inputDirection: "forward" });
    expect(result.value, "remove 4").toBe("123.5");
    expect(result.caretPosition, "remove 4").toBe(4);
  });

  test("numeric processInput big number: delete characters", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 1").toBe("234,567");
    expect(result.caretPosition, "remove 1").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "try remove ,").toBe("1,234,567");
    expect(result.caretPosition, "try remove ,").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 3").toBe("124,567");
    expect(result.caretPosition, "remove 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 4").toBe("123,567");
    // expect(result.caretPosition, "remove 4").toBe(3);
    expect(result.caretPosition, "remove 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 7, selectionEnd: 8, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "remove 6").toBe("123,457");
    expect(result.caretPosition, "remove 6").toBe(6);
  });

  test("numeric processInput simple number: delete characters by backspace", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 0, prevValue: "0", inputDirection: "backward" });
    expect(result.value, "#1").toBe("0");
    expect(result.caretPosition, "#1").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "0", inputDirection: "backward" });
    expect(result.value, "remove 0").toBe("");
    expect(result.caretPosition, "remove 0").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123", inputDirection: "backward" });
    expect(result.value, "remove 3").toBe("12");
    expect(result.caretPosition, "remove 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "123", inputDirection: "backward" });
    expect(result.value, "remove 2").toBe("13");
    expect(result.caretPosition, "remove 2").toBe(1);

  });

  test("numeric processInput decimal number: delete characters by backspace", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 2, selectionEnd: 3, prevValue: "123.45", inputDirection: "backward" });
    expect(result.value, "remove 3").toBe("12.45");
    expect(result.caretPosition, "remove 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "123.45", inputDirection: "backward" });
    expect(result.value, "remove dot").toBe("12,345");
    expect(result.caretPosition, "remove dot").toBe(4);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "123.45", inputDirection: "backward" });
    expect(result.value, "remove 4").toBe("123.5");
    expect(result.caretPosition, "remove 4").toBe(4);
  });

  test("numeric processInput big number: delete characters by backspace", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 0, selectionEnd: 1, prevValue: "1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 1").toBe("234,567");
    expect(result.caretPosition, "remove 1").toBe(0);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 1, selectionEnd: 2, prevValue: "1,234,567", inputDirection: "backward" });
    expect(result.value, "try remove ,").toBe("1,234,567");
    expect(result.caretPosition, "try remove ,").toBe(1);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 4, prevValue: "1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 3").toBe("124,567");
    expect(result.caretPosition, "remove 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 4, selectionEnd: 5, prevValue: "1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 4").toBe("123,567");
    expect(result.caretPosition, "remove 4").toBe(3);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 7, selectionEnd: 8, prevValue: "1,234,567", inputDirection: "backward" });
    expect(result.value, "remove 6").toBe("123,457");
    expect(result.caretPosition, "remove 6").toBe(6);
  });

  test("numeric processInput: cut + paste characters", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5").toBe("1,267");
    expect(result.caretPosition, "cut 34,5").toBe(3);

    result = maskInstance.processInput({ insertedChars: "00", selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5 & insert 00").toBe("120,067");
    expect(result.caretPosition, "cut 34,5 & insert 00").toBe(5);

    result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 3, selectionEnd: 7, prevValue: "1,234,567", inputDirection: "forward" });
    expect(result.value, "cut 34,5 & insert 000000").toBe("1,200,000,067");
    expect(result.caretPosition, "cut 34,5 & insert 000000").toBe(11);

    result = maskInstance.processInput({ insertedChars: null, selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5").toBe("126");
    expect(result.caretPosition, "cut 34.5").toBe(2);

    result = maskInstance.processInput({ insertedChars: "00", selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5 & insert 00").toBe("12,006");
    expect(result.caretPosition, "cut 34.5 & insert 00").toBe(5);

    result = maskInstance.processInput({ insertedChars: "000000", selectionStart: 3, selectionEnd: 7, prevValue: "1,234.56", inputDirection: "forward" });
    expect(result.value, "cut 34.5 & insert 000000").toBe("120,000,006");
    expect(result.caretPosition, "cut 34.5 & insert 000000").toBe(10);
  });

  test("numeric processInput: allowNegativeValues false", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = false;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "try insert minus").toBe("12");
    expect(result.caretPosition, "try insert minus").toBe(2);
  });

  test("numeric processInput: allowNegativeValues true", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("-12");
    expect(result.caretPosition, "insert minus").toBe(3);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "-12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("12");
    expect(result.caretPosition, "insert minus").toBe(1);
  });

  test("numeric processInput: min", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.min = -100;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("-12");
    expect(result.caretPosition, "insert minus").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toBe("-12");
    expect(result.caretPosition, "try insert 4").toBe(3);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12");
    expect(result.caretPosition, "type 2").toBe(2);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("123");
    expect(result.caretPosition, "try insert 3").toBe(3);

    result = maskInstance.processInput({ insertedChars: "999", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "try insert 999").toBe("12,999");
    expect(result.caretPosition, "try insert 999").toBe(6);
  });

  test("numeric processInput: max", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12");
    expect(result.caretPosition, "type 2").toBe(2);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("12");
    expect(result.caretPosition, "try insert 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("-12");
    expect(result.caretPosition, "insert minus").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toBe("-124");
    expect(result.caretPosition, "try insert 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: "999", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
    expect(result.value, "try insert 999").toBe("-12,999");
    expect(result.caretPosition, "try insert 999").toBe(7);
  });

  test("numeric processInput: min & max", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.min = -100;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12");
    expect(result.caretPosition, "type 2").toBe(2);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("12");
    expect(result.caretPosition, "try insert 3").toBe(2);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 2, selectionEnd: 2, prevValue: "12", inputDirection: "forward" });
    expect(result.value, "insert minus").toBe("-12");
    expect(result.caretPosition, "insert minus").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "-12", inputDirection: "forward" });
    expect(result.value, "try insert 4").toBe("-12");
    expect(result.caretPosition, "try insert 4").toBe(3);

    result = maskInstance.processInput({ insertedChars: "", selectionStart: 1, selectionEnd: 2, prevValue: "-1", inputDirection: "forward" });
    expect(result.value, "remove 1").toBe("-");
    expect(result.caretPosition, "remove 1").toBe(1);
  });

  test("numeric processInput: min 200", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.min = 200;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "try insert minus").toBe("");
    expect(result.caretPosition, "try insert minus").toBe(0);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("2");
    expect(result.caretPosition, "type 2").toBe(1);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 1, selectionEnd: 1, prevValue: "2", inputDirection: "forward" });
    expect(result.value, "try insert minus").toBe("2");
    expect(result.caretPosition, "try insert minus").toBe(1);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "20", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("201");
    expect(result.caretPosition, "type 1").toBe(3);
  });

  test("numeric processInput: min 0 & max 100", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.min = 0;
    maskInstance.max = 100;

    let result = maskInstance.processInput({ insertedChars: "-", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "try insert minus").toBe("");
    expect(result.caretPosition, "try insert minus").toBe(0);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("2");
    expect(result.caretPosition, "type 2").toBe(1);

    result = maskInstance.processInput({ insertedChars: "-", selectionStart: 1, selectionEnd: 1, prevValue: "2", inputDirection: "forward" });
    expect(result.value, "try insert minus").toBe("2");
    expect(result.caretPosition, "try insert minus").toBe(1);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "99", inputDirection: "forward" });
    expect(result.value, "try type 1").toBe("99");
    expect(result.caretPosition, "try type 1").toBe(2);
  });

  test("numeric processInput: precision", () => {
    const maskInstance = new InputMaskNumeric();

    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 3, selectionEnd: 3, prevValue: "1.0", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("1.02");
    expect(result.caretPosition, "type 2").toBe(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 4, selectionEnd: 4, prevValue: "1.02", inputDirection: "forward" });
    expect(result.value, "try insert 3").toBe("1.02");
    expect(result.caretPosition, "try insert 3").toBe(4);

    maskInstance.precision = 0;

    result = maskInstance.processInput({ insertedChars: ".", selectionStart: 1, selectionEnd: 1, prevValue: "1", inputDirection: "forward" });
    expect(result.value, "try insert dot").toBe("1");
    expect(result.caretPosition, "try insert dot").toBe(1);
  });

  test("Serialize InputMaskNumeric properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    let json = jsonObject.toJsonObject(q);
    expect(json, "empty mask").toEqual({ name: "q1" });

    q.maskType = "numeric";
    json = jsonObject.toJsonObject(q);
    expect(json, "init numbermask").toEqual({
      name: "q1",
      maskType: "numeric"
    });

    q.maskSettings.saveMaskedValue = true;
    q.maskSettings["decimalSeparator"] = "-";
    q.maskSettings["thousandsSeparator"] = "*";
    q.maskSettings["precision"] = 5;
    q.maskSettings["allowNegativeValues"] = false;
    q.maskSettings["min"] = 0;
    q.maskSettings["max"] = 1000;

    json = jsonObject.toJsonObject(q);
    expect(json, "all setting is changed numbermask").toEqual({
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
    });
  });

  test("Deserialize InputMaskNumeric properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    jsonObject.toObject({ name: "q1" }, q);
    let maskSettings = q.maskSettings as InputMaskNumeric;
    expect(q.maskType).toBe("none");
    expect(maskSettings.getType()).toBe("masksettings");

    jsonObject.toObject({ name: "q1", maskType: "numeric" }, q);
    maskSettings = q.maskSettings as InputMaskNumeric;
    expect(q.maskType).toBe("numeric");
    expect(maskSettings.getType(), "numbermask type").toBe("numericmask");
    expect(maskSettings.saveMaskedValue, "numbermask saveMaskedValue").toBe(false);
    expect(maskSettings.decimalSeparator, "numbermask decimalSeparator").toBe(".");
    expect(maskSettings.thousandsSeparator, "numbermask thousandsSeparator").toBe(",");
    expect(maskSettings.precision, "numbermask precision").toBe(2);
    expect(maskSettings.allowNegativeValues, "numbermask allowNegativeValues").toBe(true);
    expect(maskSettings.min, "numbermask min").toBeUndefined();
    expect(maskSettings.max, "numbermask max").toBeUndefined();

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
    expect(q.maskType).toBe("numeric");
    expect(maskSettings.getType(), "numbermask type").toBe("numericmask");
    expect(maskSettings.saveMaskedValue, "numbermask saveMaskedValue").toBe(true);
    expect(maskSettings.decimalSeparator, "numbermask decimalSeparator").toBe("-");
    expect(maskSettings.thousandsSeparator, "numbermask thousandsSeparator").toBe("*");
    expect(maskSettings.precision, "numbermask precision").toBe(5);
    expect(maskSettings.allowNegativeValues, "numbermask allowNegativeValues").toBe(true);
    expect(maskSettings.min, "numbermask min").toBe(0);
    expect(maskSettings.max, "numbermask max").toBe(1000);
  });

  const customMaskSettings = {
    decimalSeparator: ",",
    thousandsSeparator: " ",
    precision: 3,
    allowNegativeValues: false,
  };
  test("parseNumber with custom settings", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.setData(customMaskSettings);

    expect(maskInstance.parseNumber("123,45").integralPart).toBe("123");
    expect(maskInstance.parseNumber("123,45").fractionalPart).toBe("45");

    expect(maskInstance.parseNumber(",45").integralPart).toBe("");
    expect(maskInstance.parseNumber(",45").fractionalPart).toBe("45");
    expect(maskInstance.parseNumber("123,").integralPart).toBe("123");
    expect(maskInstance.parseNumber("123,").fractionalPart).toBe("");
  });

  test("get numeric masked value with custom settings", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.setData(customMaskSettings);
    expect(maskInstance.getMaskedValue(123456.78)).toBe("123 456,78");
    expect(maskInstance.getMaskedValue(123456.789)).toBe("123 456,789");

    expect(maskInstance.getMaskedValue("123456,78")).toBe("123 456,78");
    expect(maskInstance.getMaskedValue("123456,789")).toBe("123 456,789");
  });

  test("numeric with custom settings processInput: insert characters", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.setData(customMaskSettings);
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 1, selectionEnd: 1, prevValue: "0", inputDirection: "forward" });
    expect(result.value, "type #1").toBe("1");
    expect(result.caretPosition, "type #1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
    expect(result.value, "type #2.0").toBe("1 234");
    expect(result.caretPosition, "type #2.0").toBe(5);
  });
  test("numeric processInput: min & max - small range", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = false;
    maskInstance.min = 3;
    maskInstance.max = 7;

    let result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "try type 8").toBe("");
    expect(result.caretPosition, "try type 8").toBe(0);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "try type 2").toBe("");
    expect(result.caretPosition, "try type 2").toBe(0);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "insert 5").toBe("5");
    expect(result.caretPosition, "insert 5").toBe(1);

    maskInstance.allowNegativeValues = false;
    maskInstance.min = 43;
    maskInstance.max = 47;

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "try type 3").toBe("");
    expect(result.caretPosition, "try type 3").toBe(0);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
    expect(result.value, "type 4").toBe("4");
    expect(result.caretPosition, "type 4").toBe(1);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 1, selectionEnd: 1, prevValue: "4", inputDirection: "forward" });
    expect(result.value, "try type 1").toBe("4");
    expect(result.caretPosition, "try type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 1, selectionEnd: 1, prevValue: "4", inputDirection: "forward" });
    expect(result.value, "try type 9").toBe("4");
    expect(result.caretPosition, "try type 9").toBe(1);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 1, selectionEnd: 1, prevValue: "4", inputDirection: "forward" });
    expect(result.value, "insert 6").toBe("46");
    expect(result.caretPosition, "insert 6").toBe(2);
  });

  test("numeric processInput: doesn't allow resetting if min & max", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = false;
    maskInstance.min = 2;
    maskInstance.max = 10;

    let result = maskInstance.processInput({ insertedChars: null, prevValue: "8", selectionEnd: 1, selectionStart: 0, inputDirection: "forward" });
    expect(result.value, "clear").toBe("");
    expect(result.caretPosition, "clear").toBe(0);
  });

  test("numeric validateNumber: min & max - small range positive", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = false;
    maskInstance.min = 3;
    maskInstance.max = 7;

    const number: any = {};

    number.integralPart = "0";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "8";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "2";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "5";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();

    maskInstance.allowNegativeValues = false;
    maskInstance.min = 43;
    maskInstance.max = 47;

    number.integralPart = "0";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "3";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "2";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "4";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();

    number.integralPart = "42";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.integralPart = "48";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.integralPart = "43";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
    number.integralPart = "45";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
  });

  test("numeric validateNumber: min & max - small range negative", () => {
    const maskInstance = new InputMaskNumeric();
    const number: any = {};

    maskInstance.allowNegativeValues = true;
    maskInstance.max = -43;
    maskInstance.min = -47;

    number.integralPart = "0";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.isNegative = true;
    number.integralPart = "3";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "2";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();

    number.integralPart = "4";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();

    number.integralPart = "42";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.integralPart = "48";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.integralPart = "43";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
    number.integralPart = "45";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
  });

  test("numeric validateNumber: min & max - small range fractial negative", () => {
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
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.fractionalPart = "68";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.fractionalPart = "63";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
    number.fractionalPart = "65";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
  });

  test("numeric validateNumber: min & max - small range fractial positive", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.min = 2.63;
    maskInstance.max = 2.67;
    maskInstance.precision = 2;

    const number: any = {};

    number.integralPart = "2";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();

    number.hasDecimalSeparator = true;
    expect(maskInstance.validateNumber(number, false), "test with dot " + maskInstance.convertNumber(number)).toBeTruthy();

    number.fractionalPart = "62";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.fractionalPart = "68";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.fractionalPart = "63";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
    number.fractionalPart = "65";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
  });

  test("numeric validateNumber: min & max - small range fractial positive less 1", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.allowNegativeValues = true;
    maskInstance.min = 0.63;
    maskInstance.max = 0.67;
    maskInstance.precision = 2;

    const number: any = {};

    number.integralPart = "0";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();

    number.hasDecimalSeparator = true;
    expect(maskInstance.validateNumber(number, false), "test with dot " + maskInstance.convertNumber(number)).toBeTruthy();

    number.fractionalPart = "62";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.fractionalPart = "68";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeFalsy();
    number.fractionalPart = "63";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
    number.fractionalPart = "65";
    expect(maskInstance.validateNumber(number, false), "test " + maskInstance.convertNumber(number)).toBeTruthy();
  });

  test("empty thousandsSeparator disables grouping", () => {
    const maskInstance = new InputMaskNumeric();
    maskInstance.setData({
      thousandsSeparator: "",
      precision: 0,
      allowNegativeValues: false,
      min: -10,
      max: 999999999
    });

    expect(maskInstance.thousandsSeparator).toBe("");
    expect(maskInstance.getMaskedValue(1234567)).toBe("1234567");
    expect(maskInstance.getMaskedValue("1234567")).toBe("1234567");

    let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "123", inputDirection: "forward" });
    expect(result.value).toBe("1234");
    expect(result.caretPosition).toBe(4);
  });
});

describe("Numeric mask: localization", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  const createSurvey = (maskSettings?: any): SurveyModel => {
    return new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: maskSettings }] });
  };
  const getMask = (survey: SurveyModel): InputMaskNumeric => {
    return <InputMaskNumeric>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
  };

  test("An unset separator resolves through the survey format locale", () => {
    const survey = createSurvey();
    const mask = getMask(survey);
    expect(mask.decimalSeparator, "english decimal").toBe(".");
    expect(mask.thousandsSeparator, "english thousands").toBe(",");

    survey.locale = "de";
    expect(mask.decimalSeparator, "german decimal").toBe(",");
    expect(mask.thousandsSeparator, "german thousands").toBe(".");
    expect(mask.getMaskedValue(1234567.89), "german rendering").toBe("1.234.567,89");

    survey.locale = "ru";
    expect(mask.decimalSeparator, "russian decimal").toBe(",");
    expect(mask.thousandsSeparator, "russian thousands").toBe("\u00A0");
    expect(mask.getMaskedValue(1234567.89), "russian rendering").toBe("1\u00A0234\u00A0567,89");

    survey.locale = "";
  });

  test("An authored separator beats the locale", () => {
    const survey = createSurvey({ decimalSeparator: "*", thousandsSeparator: "|" });
    const mask = getMask(survey);
    survey.locale = "de";
    expect(mask.decimalSeparator, "authored decimal").toBe("*");
    expect(mask.thousandsSeparator, "authored thousands").toBe("|");
    expect(mask.getMaskedValue(1234567.89), "authored rendering").toBe("1|234|567*89");
    survey.locale = "";
  });

  test("An unknown locale falls back through the language subtag to english", () => {
    const survey = createSurvey();
    const mask = getMask(survey);

    survey.regionLocale = "de-AT";
    expect(mask.decimalSeparator, "the de subtag decimal").toBe(",");
    expect(mask.thousandsSeparator, "the de subtag thousands").toBe(".");

    survey.regionLocale = "xx";
    expect(mask.decimalSeparator, "english decimal").toBe(".");
    expect(mask.thousandsSeparator, "english thousands").toBe(",");

    survey.regionLocale = "";
  });

  test("regionLocale outranks locale", () => {
    const survey = createSurvey();
    const mask = getMask(survey);
    survey.locale = "de";
    expect(mask.thousandsSeparator, "the locale is used while no region locale is set").toBe(".");

    survey.regionLocale = "en-GB";
    expect(mask.decimalSeparator, "the region locale decimal").toBe(".");
    expect(mask.thousandsSeparator, "the region locale thousands").toBe(",");

    survey.regionLocale = "";
    expect(mask.thousandsSeparator, "the locale is used again").toBe(".");
    survey.locale = "";
  });

  test("An authored empty thousands separator disables grouping under every locale", () => {
    const survey = createSurvey({ thousandsSeparator: "" });
    const mask = getMask(survey);
    ["", "de", "ru", "fr"].forEach(locale => {
      survey.locale = locale;
      expect(mask.thousandsSeparator, "locale " + JSON.stringify(locale)).toBe("");
      expect(mask.getMaskedValue(1234567), "locale " + JSON.stringify(locale)).toBe("1234567");
    });
    survey.locale = "";
  });

  test("An explicit value equal to the resolved default survives a locale change", () => {
    const survey = createSurvey();
    survey.locale = "de";
    const mask = getMask(survey);
    mask.decimalSeparator = ",";
    expect(mask.getExplicitPropertyValue("decimalSeparator"), "the assignment is stored").toBe(",");

    survey.locale = "";
    expect(mask.decimalSeparator, "the authored value holds under english").toBe(",");

    mask.resetPropertyValue("decimalSeparator");
    expect(mask.getExplicitPropertyValue("decimalSeparator"), "the override is cleared").toBeUndefined();
    expect(mask.decimalSeparator, "inheritance returns").toBe(".");
  });

  test("An explicit value equal to the resolved default survives a round trip", () => {
    const survey = createSurvey();
    survey.locale = "de";
    getMask(survey).decimalSeparator = ",";
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].maskSettings.decimalSeparator, "written even though it equals the default").toBe(",");

    const survey2 = new SurveyModel(json);
    expect(getMask(survey2).getExplicitPropertyValue("decimalSeparator"), "read back as an explicit value").toBe(",");
    survey2.locale = "";
    expect(getMask(survey2).decimalSeparator, "still authored under english").toBe(",");
  });

  test("An authored empty thousands separator survives a round trip", () => {
    const survey = createSurvey({ thousandsSeparator: "" });
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].maskSettings.thousandsSeparator, "an empty string is written").toBe("");

    const survey2 = new SurveyModel(json);
    expect(getMask(survey2).thousandsSeparator, "read back as an empty string").toBe("");
    expect(getMask(survey2).getMaskedValue(1234567), "grouping stays disabled").toBe("1234567");
  });

  test("An unset separator is not serialized under any locale", () => {
    const survey = createSurvey();
    survey.locale = "ru";
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].maskSettings, "nothing is written for a locale value").toBeUndefined();
    survey.locale = "";
  });

  test("The two serialization paths write the same keys", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", maskType: "numeric", maskSettings: { decimalSeparator: ",", thousandsSeparator: "", precision: 3 } },
        { type: "text", name: "q2", maskType: "currency", maskSettings: { decimalSeparator: ",", thousandsSeparator: "", prefix: "$ " } }
      ]
    });
    survey.locale = "de";
    const json = survey.toJSON();
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    const q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(json.pages[0].elements[0].maskSettings, "the numeric getData path").toEqual({ decimalSeparator: ",", thousandsSeparator: "", precision: 3 });
    expect(q1.maskSettings.getData(), "getData agrees with the question json").toEqual(json.pages[0].elements[0].maskSettings);
    expect(json.pages[0].elements[1].maskSettings, "the currency getData path").toEqual({ decimalSeparator: ",", thousandsSeparator: "", prefix: "$ " });
    expect(q2.maskSettings.getData(), "getData agrees with the question json").toEqual(json.pages[0].elements[1].maskSettings);

    const maskJson = q1.maskSettings.toJSON();
    delete maskJson.type;
    expect(maskJson, "the mask toJSON path writes the same keys").toEqual(json.pages[0].elements[0].maskSettings);
    survey.locale = "";
  });

  test("The serializer answers a metadata query with the canonical default", () => {
    expect(Serializer.findProperty("numericmask", "decimalSeparator").defaultValue, "decimal").toBe(".");
    expect(Serializer.findProperty("numericmask", "thousandsSeparator").defaultValue, "thousands").toBe(",");
    expect(Serializer.findProperty("currencymask", "decimalSeparator").defaultValue, "currency decimal").toBe(".");
  });

  test("A mask deserialized inside a survey renders that survey's locale", () => {
    const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    const mask = getMask(survey);
    expect(mask.getExplicitPropertyValue("decimalSeparator"), "deserialization stores nothing").toBeUndefined();
    expect(mask.getMaskedValue(1234.56), "german rendering").toBe("1.234,56");
    survey.locale = "";
  });

  test("A mask resolved standalone follows the survey it is attached to afterwards", () => {
    const mask = new InputMaskNumeric();
    expect(mask.getMaskedValue(1234.56), "english by itself").toBe("1,234.56");

    const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    mask.owner = q;
    expect(mask.getMaskedValue(1234.56), "the survey it was attached to").toBe("1.234,56");
    survey.locale = "";
  });

  test("A mask moved between two same locale surveys follows the new one", () => {
    const first = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    const second = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    second.regionLocale = "de";
    const mask = new InputMaskNumeric();
    mask.owner = <QuestionTextModel>first.getQuestionByName("q1");
    expect(mask.getMaskedValue(1234.56), "the first survey").toBe("1,234.56");

    mask.owner = <QuestionTextModel>second.getQuestionByName("q1");
    expect(mask.getMaskedValue(1234.56), "the second survey").toBe("1.234,56");
  });

  test("Collision policy: an inherited pair is distinct", () => {
    const survey = createSurvey();
    survey.locale = "de";
    const mask = getMask(survey);
    expect(mask.getMaskedValue(1234.56), "rendered").toBe("1.234,56");
    expect(mask.getUnmaskedValue("1.234,56"), "round trip").toBe(1234.56);
    survey.locale = "";
  });

  test("Collision policy: an authored decimal equal to the inherited thousands", () => {
    const survey = createSurvey({ decimalSeparator: "," });
    const mask = getMask(survey);
    expect(mask.thousandsSeparator, "grouping is suppressed").toBe("");
    expect(mask.getMaskedValue(1234.56), "rendered").toBe("1234,56");
    expect(mask.getUnmaskedValue("1234,56"), "round trip").toBe(1234.56);
  });

  test("Collision policy: an authored thousands equal to the inherited decimal", () => {
    const survey = createSurvey({ thousandsSeparator: "." });
    const mask = getMask(survey);
    expect(mask.decimalSeparator, "the decimal separator is primary").toBe(".");
    expect(mask.getMaskedValue(1234.56), "rendered ungrouped").toBe("1234.56");
    expect(mask.getUnmaskedValue("1234.56"), "round trip").toBe(1234.56);
  });

  test("Collision policy: both authored and equal", () => {
    const survey = createSurvey({ decimalSeparator: ",", thousandsSeparator: "," });
    const mask = getMask(survey);
    expect(mask.getMaskedValue(1234.56), "rendered ungrouped").toBe("1234,56");
    expect(mask.getUnmaskedValue("1234,56"), "round trip").toBe(1234.56);
  });

  test("No change for a survey with no locale or an english one", () => {
    const survey = createSurvey();
    const mask = getMask(survey);
    ["", "en"].forEach(locale => {
      survey.locale = locale;
      expect(mask.decimalSeparator, "decimal, locale " + JSON.stringify(locale)).toBe(".");
      expect(mask.thousandsSeparator, "thousands, locale " + JSON.stringify(locale)).toBe(",");
      expect(mask.getMaskedValue(1234.5), "masked, locale " + JSON.stringify(locale)).toBe("1,234.5");
      expect(mask.getUnmaskedValue("1,234.5"), "unmasked, locale " + JSON.stringify(locale)).toBe(1234.5);
    });
    survey.locale = "";
  });

  test("Typing under a non-english locale", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createSurvey();
    survey.locale = "de";
    const mask = getMask(survey);
    const adapter = new InputElementAdapter(mask, testInput);
    const type = (chars: string): void => {
      adapter.beforeInputHandler({ data: chars, inputType: "insertText", target: testInput, preventDefault: () => { } });
    };

    type("1");
    expect(testInput.value, "type 1").toBe("1");
    expect(testInput.selectionStart, "caret after 1").toBe(1);

    type("2");
    type("3");
    type("4");
    expect(testInput.value, "type 4").toBe("1.234");
    expect(testInput.selectionStart, "caret after 4").toBe(5);

    type(",");
    expect(testInput.value, "type the decimal separator").toBe("1.234,");
    expect(testInput.selectionStart, "caret after the decimal separator").toBe(6);

    type("5");
    expect(testInput.value, "type 5").toBe("1.234,5");
    expect(testInput.selectionStart, "caret after 5").toBe(7);
    expect(mask.getUnmaskedValue(testInput.value), "the entered number").toBe(1234.5);

    adapter.dispose();
    testInput.remove();
    survey.locale = "";
  });

  test("A stored value is re-rendered when the survey locale changes", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createSurvey();
    survey.locale = "de";
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.afterRenderQuestionElement(testInput);
    q.value = 1234567.89;
    expect(testInput.value, "the german rendering").toBe("1.234.567,89");

    survey.locale = "";
    expect(testInput.value, "the english rendering").toBe("1,234,567.89");
    expect(q.value, "the stored number never changes").toBe(1234567.89);

    survey.regionLocale = "ru";
    expect(testInput.value, "the russian rendering").toBe("1\u00A0234\u00A0567,89");
    expect(q.value, "the stored number never changes").toBe(1234567.89);

    survey.regionLocale = "";
    testInput.remove();
  });

  test("An in-progress entry is re-formatted through the previous locale's separators", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createSurvey();
    survey.locale = "de";
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.afterRenderQuestionElement(testInput);
    testInput.focus();
    expect(q["maskInputAdapter"].isInputElementFocused, "the element is focused").toBe(true);
    // typed but not committed: the question value is still empty
    testInput.value = "1.234,5";
    expect(q.isEmpty(), "nothing is stored yet").toBe(true);

    survey.locale = "";
    expect(testInput.value, "the entry is re-formatted for english").toBe("1,234.5");
    expect(q.inputValue, "the question keeps the same text").toBe("1,234.5");
    expect(getMask(survey).getUnmaskedValue(testInput.value), "the entry still means the same number").toBe(1234.5);

    testInput.remove();
  });

  test("A focused field with a stored answer keeps its unsaved edits", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const survey = createSurvey();
    survey.locale = "de";
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.afterRenderQuestionElement(testInput);
    q.value = 1234;
    expect(testInput.value, "the stored answer").toBe("1.234");

    testInput.focus();
    // two digits typed into the element and not yet committed to the question
    testInput.value = "123.456";

    survey.locale = "";
    expect(testInput.value, "the edits survive the locale change").toBe("123,456");
    expect(q.value, "the edits are not stored yet").toBe(1234);

    testInput.remove();
  });

  test.each(["locale", "regionLocale"])("Reading separators in a callback during a %s change preserves the saved number", (propertyName) => {
    const survey = createSurvey({ saveMaskedValue: true });
    survey.locale = "de";
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.value = 1234.56;
    expect(q.value).toBe("1.234,56");
    q.localeChangedCallback = () => {
      expect(getMask(survey).decimalSeparator).toBe(".");
      expect(getMask(survey).thousandsSeparator).toBe(",");
    };

    survey[propertyName] = "en";
    expect(q.value).toBe("1,234.56");
    expect(q.inputValue).toBe("1,234.56");
    expect(q.getExpressionValue(q.value)).toBe(1234.56);
    q.localeChangedCallback = undefined;
    survey.dispose();
  });

  test.each([false, true])("A focused deletion survives a locale change with saveMaskedValue=%s", (saveMaskedValue) => {
    const survey = createSurvey({ saveMaskedValue });
    survey.locale = "de";
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      q.afterRenderQuestionElement(input);
      q.value = 1234;
      input.focus();
      input.setSelectionRange(0, input.value.length);
      q["maskInputAdapter"].beforeInputHandler({
        data: null, inputType: "deleteContentBackward", target: input, preventDefault: () => { }
      });
      expect(input.value).toBe("");

      survey.locale = "en";
      expect(input.value).toBe("");
      expect(q.inputValue).toBe("");
      expect(q.value).toBe(saveMaskedValue ? "1,234" : 1234);
    } finally {
      survey.dispose();
      input.remove();
    }
  });

  test("A masked value stored under one locale is re-masked when the locale changes", () => {
    const survey = createSurvey({ saveMaskedValue: true });
    survey.locale = "de";
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.inputValue = "1234,56";
    expect(q.value, "the german masked value is stored").toBe("1.234,56");

    survey.locale = "";
    expect(q.value, "the stored text is re-masked for english").toBe("1,234.56");
    expect(q.inputValue, "the rendered text follows").toBe("1,234.56");
  });
});

describe("Numeric mask: the resolved format cache", () => {
  test("Attaching a mask to an owner drops the values it resolved before", () => {
    const mask = new InputMaskNumeric();
    expect(mask.decimalSeparator, "resolved standalone").toBe(".");
    expect(mask["getCachedFormatValue"]("decimalSeparator"), "the resolved value is cached").toBe(".");

    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    mask.owner = <QuestionTextModel>survey.getQuestionByName("q1");
    // the locale name alone would still say "en" here, so the cache cannot be keyed by it only
    expect(mask["getCachedFormatValue"]("decimalSeparator"), "attaching drops the cache").toBeUndefined();
  });

  test("A locale change drops the values resolved for the previous locale", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    const mask = <InputMaskNumeric>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    expect(mask.thousandsSeparator, "resolved for english").toBe(",");
    expect(mask["getCachedFormatValue"]("thousandsSeparator"), "the resolved value is cached").toBe(",");

    survey.locale = "de";
    expect(mask.thousandsSeparator, "resolved for german").toBe(".");
    // the entry the previous locale left behind is gone, not merely shadowed
    expect(mask["getCachedFormatValue"]("thousandsSeparator"), "the cache holds the german value").toBe(".");
    survey.locale = "";
  });
});
