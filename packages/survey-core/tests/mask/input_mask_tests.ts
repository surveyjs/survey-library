import { InputElementAdapter } from "../../src/mask/input_element_adapter";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { InputMaskDateTime } from "../../src/mask/mask_datetime";
import { normalizeInputDigits } from "../../src/mask/mask_utils";

import { describe, test, expect } from "vitest";
// the Arabic-Indic (U+0660) and extended Arabic-Indic (U+06F0) spellings of an ASCII digit string,
// built from code points so the tests stay readable and lint-clean
const arabicIndic = (text: string): string => text.replace(/[0-9]/g, (d: string) => String.fromCharCode(0x0660 + Number(d)));
const extendedArabicIndic = (text: string): string => text.replace(/[0-9]/g, (d: string) => String.fromCharCode(0x06F0 + Number(d)));

describe("Input mask", () => {
  test("normalizeInputDigits maps Arabic-Indic and extended Arabic-Indic digits to ASCII", () => {
    expect(normalizeInputDigits(arabicIndic("0123456789")), "Arabic-Indic").toBe("0123456789");
    expect(normalizeInputDigits(extendedArabicIndic("0123456789")), "extended Arabic-Indic").toBe("0123456789");
    expect(normalizeInputDigits("1" + arabicIndic("2/") + extendedArabicIndic("3") + arabicIndic("4/") + "2" + arabicIndic("0") + extendedArabicIndic("0") + arabicIndic("6")), "mixed with ASCII digits and literals").toBe("12/34/2006");
    expect(normalizeInputDigits("abc 123 -+()/.:_"), "ASCII passes through").toBe("abc 123 -+()/.:_");
    const arabicText = "ر.س ٫٬"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(normalizeInputDigits(arabicText), "Arabic letters and the Arabic separators are not digits").toBe(arabicText);
    expect(normalizeInputDigits(""), "empty").toBe("");
    expect(normalizeInputDigits(null), "a deletion carries null data").toBeNull();
    expect(normalizeInputDigits(undefined), "no data").toBeUndefined();
  });

  test("InputElementAdapter createArgs normalizes Arabic-Indic digits in the inserted text", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999";
    const adapter = new InputElementAdapter(inputMaskPattern, testInput);
    const target = { selectionStart: 1, selectionEnd: 1, value: "1__" };
    let args = adapter.createArgs({ data: arabicIndic("5"), inputType: "insertText", target: target });
    expect(args.insertedChars, "a typed Arabic-Indic digit").toBe("5");
    expect(args.prevValue, "the element text is not touched").toBe("1__");
    args = adapter.createArgs({ data: extendedArabicIndic("78"), inputType: "insertFromPaste", target: target });
    expect(args.insertedChars, "pasted extended Arabic-Indic digits").toBe("78");
    args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
    expect(args.insertedChars, "null data stays null").toBeNull();
    testInput.remove();
  });

  test("Arabic-Indic digits typed into numeric, pattern and datetime masks are stored as ASCII", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const type = (text: string) => {
      text.split("").forEach(ch => adapter.beforeInputHandler({ data: ch, inputType: "insertText", target: testInput, preventDefault: (): void => {} }));
    };
    const pattern = new InputMaskPattern();
    pattern.pattern = "+1 (999) 999-9999";
    let adapter = new InputElementAdapter(pattern, testInput, "");
    testInput.focus();
    testInput.setSelectionRange(0, 0);
    type(arabicIndic("555"));
    expect(testInput.value, "pattern: half typed").toBe("+1 (555) ___-____");
    expect(testInput.selectionStart, "pattern: the caret follows the ASCII value").toBe(9);
    type(extendedArabicIndic("1234567"));
    expect(testInput.value, "pattern: complete").toBe("+1 (555) 123-4567");
    expect(pattern.getUnmaskedValue(testInput.value), "pattern: the unmasked value is ASCII").toBe("15551234567");
    adapter.dispose();

    const datetime = new InputMaskDateTime();
    datetime.pattern = "mm/dd/yyyy";
    adapter = new InputElementAdapter(datetime, testInput, "");
    testInput.setSelectionRange(0, 0);
    type(arabicIndic("12252000"));
    expect(testInput.value, "datetime: complete").toBe("12/25/2000");
    expect(datetime.getUnmaskedValue(testInput.value), "datetime: the ISO value").toBe("2000-12-25");
    adapter.dispose();

    const numeric = new InputMaskNumeric();
    adapter = new InputElementAdapter(numeric, testInput, "");
    testInput.setSelectionRange(0, 0);
    type(arabicIndic("1234.5"));
    expect(testInput.value, "numeric: grouped").toBe("1,234.5");
    expect(numeric.getUnmaskedValue(testInput.value), "numeric: the number").toBe(1234.5);
    adapter.dispose();
    testInput.remove();
  });

  test("Arabic-Indic digits in a selection replacement, Delete and Backspace", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);
    const pattern = new InputMaskPattern();
    pattern.pattern = "999-99";
    const adapter = new InputElementAdapter(pattern, testInput, "12345");
    testInput.focus();
    const send = (data: string | null, inputType: string) => {
      adapter.beforeInputHandler({ data: data, inputType: inputType, target: testInput, preventDefault: (): void => {} });
    };
    expect(testInput.value).toBe("123-45");

    testInput.setSelectionRange(1, 2);
    send(arabicIndic("9"), "insertText");
    expect(testInput.value, "the selected digit is replaced").toBe("193-45");
    expect(testInput.selectionStart, "the caret is after the replacement").toBe(2);

    testInput.setSelectionRange(1, 1);
    send(null, "deleteContentForward");
    expect(testInput.value, "Delete in the middle").toBe("134-5_");

    testInput.setSelectionRange(2, 2);
    send(null, "deleteContentBackward");
    expect(testInput.value, "Backspace in the middle").toBe("145-__");

    testInput.setSelectionRange(1, 1);
    send(extendedArabicIndic("0"), "insertText");
    expect(testInput.value, "an extended Arabic-Indic digit inserted in the middle").toBe("104-5_");

    adapter.dispose();
    testInput.remove();
  });

  test("The change fallback normalizes Arabic-Indic digits in a pasted or autofilled value", () => {
    const testInput = document.createElement("input");
    const pattern = new InputMaskPattern();
    pattern.pattern = "999-99-99";
    let adapter = new InputElementAdapter(pattern, testInput, "");
    testInput.focus();
    testInput.value = arabicIndic("12345") + extendedArabicIndic("67");
    testInput.dispatchEvent(new Event("change"));
    expect(testInput.value, "pattern").toBe("123-45-67");
    adapter.dispose();

    const datetime = new InputMaskDateTime();
    datetime.pattern = "mm/dd/yyyy";
    adapter = new InputElementAdapter(datetime, testInput, "");
    testInput.value = arabicIndic("12/25/2000");
    testInput.dispatchEvent(new Event("change"));
    expect(testInput.value, "datetime with separators").toBe("12/25/2000");
    adapter.dispose();

    const numeric = new InputMaskNumeric();
    adapter = new InputElementAdapter(numeric, testInput, "");
    testInput.value = arabicIndic("123456.78");
    testInput.dispatchEvent(new Event("change"));
    expect(testInput.value, "numeric").toBe("123,456.78");
    adapter.dispose();
    testInput.remove();
  });

  test("InputElementAdapter constructor", () => {
    const testInput = document.createElement("input");
    const inputMask = new InputMaskCurrency();
    inputMask.fromJSON({
      "decimalSeparator": ",",
      "thousandsSeparator": " ",
      "suffix": " Eur"
    });
    let adapter = new InputElementAdapter(inputMask, testInput, 12345.67);
    expect(testInput.value).toBe("12 345,67 Eur");

    adapter = new InputElementAdapter(inputMask, testInput);
    expect(testInput.value).toBe("");

    adapter = new InputElementAdapter(inputMask, testInput, undefined);
    expect(testInput.value).toBe("");

    adapter = new InputElementAdapter(inputMask, testInput, null);
    expect(testInput.value).toBe("");

    testInput.remove();
  });

  test("InputElementAdapter renders the empty mask when saveMaskedValue is set", () => {
    const testInput = document.createElement("input");
    const inputMask = new InputMaskDateTime();
    inputMask.pattern = "mm/dd/yyyy";
    inputMask.saveMaskedValue = true;

    let adapter = new InputElementAdapter(inputMask, testInput, "");
    expect(testInput.value, "an empty value").toBe("mm/dd/yyyy");

    adapter = new InputElementAdapter(inputMask, testInput, undefined);
    expect(testInput.value, "no value").toBe("mm/dd/yyyy");

    adapter = new InputElementAdapter(inputMask, testInput, "12/25/2000");
    expect(testInput.value, "a stored masked value is displayed as it is").toBe("12/25/2000");

    adapter.updateInputElementValue("");
    expect(testInput.value, "the empty mask returns when the value is cleared").toBe("mm/dd/yyyy");

    testInput.remove();
  });

  test("getMaskedValueBySaveMode renders the empty mask in both save modes", () => {
    const inputMask = new InputMaskPattern();
    inputMask.pattern = "+1(999)-999";
    expect(inputMask.getMaskedValueBySaveMode(""), "an empty value").toBe("+1(___)-___");
    expect(inputMask.getMaskedValueBySaveMode("+1(123)-456"), "a value").toBe("+1(123)-456");

    inputMask.saveMaskedValue = true;
    expect(inputMask.getMaskedValueBySaveMode(""), "an empty value, saveMaskedValue").toBe("+1(___)-___");
    expect(inputMask.getMaskedValueBySaveMode(undefined), "no value, saveMaskedValue").toBe("+1(___)-___");
    expect(inputMask.getMaskedValueBySaveMode(null), "a null value, saveMaskedValue").toBe("+1(___)-___");
    expect(inputMask.getMaskedValueBySaveMode("+1(123)-456"), "a stored masked value").toBe("+1(123)-456");
  });

  test("InputElementAdapter createArgs insertText", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput);
    const target = {
      selectionStart: 1,
      selectionEnd: 1,
      value: "123"
    };
    let args = adapter.createArgs({ data: "a", inputType: "insertText", target: target });
    expect(args.insertedChars).toBe("a");
    expect(args.selectionStart).toBe(1);
    expect(args.selectionEnd).toBe(1);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("forward");

    testInput.remove();
  });

  test("InputElementAdapter createArgs deleteContentForward", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput);
    const target = {
      selectionStart: 1,
      selectionEnd: 1,
      value: "123"
    };
    let args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
    expect(args.insertedChars).toBeNull();
    expect(args.selectionStart).toBe(1);
    expect(args.selectionEnd).toBe(2);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("forward");

    target.selectionStart = 3;
    target.selectionEnd = 3;

    args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
    expect(args.insertedChars).toBeNull();
    expect(args.selectionStart).toBe(3);
    expect(args.selectionEnd).toBe(4);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("forward");

    target.selectionStart = 1;
    target.selectionEnd = 2;

    args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
    expect(args.insertedChars).toBeNull();
    expect(args.selectionStart).toBe(1);
    expect(args.selectionEnd).toBe(2);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("forward");

    testInput.remove();
  });

  test("InputElementAdapter createArgs deleteContentBackward", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput);

    const target = {
      selectionStart: 1,
      selectionEnd: 1,
      value: "123"
    };
    let args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
    expect(args.insertedChars).toBeNull();
    expect(args.selectionStart).toBe(0);
    expect(args.selectionEnd).toBe(1);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("backward");

    target.selectionStart = 0;
    target.selectionEnd = 0;
    args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
    expect(args.insertedChars).toBeNull();
    expect(args.selectionStart).toBe(0);
    expect(args.selectionEnd).toBe(0);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("backward");

    target.selectionStart = 1;
    target.selectionEnd = 2;
    args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
    expect(args.insertedChars).toBeNull();
    expect(args.selectionStart).toBe(1);
    expect(args.selectionEnd).toBe(2);
    expect(args.prevValue).toBe("123");
    expect(args.inputDirection).toBe("backward");

    testInput.remove();
  });

  test("Change property mask => update display value", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput, "123");
    expect(testInput.value).toBe("123");

    inputMaskPattern.pattern = "9";
    expect(testInput.value).toBe("1");

    const inputMaskNumeric = new InputMaskNumeric();
    adapter = new InputElementAdapter(inputMaskNumeric, testInput, "123456");
    expect(testInput.value).toBe("123,456");

    inputMaskNumeric.thousandsSeparator = " ";
    expect(testInput.value).toBe("123 456");

    inputMaskNumeric.thousandsSeparator = ",";
    expect(testInput.value).toBe("123,456");

    testInput.remove();
  });

  test("Input mask + autocomplete", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999-99-99";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput, "");
    expect(testInput.value).toBe("___-__-__");

    testInput.focus();
    testInput.value = "+123456789";
    testInput.dispatchEvent(new Event("change"));
    expect(testInput.value).toBe("123-45-67");

    testInput.remove();
  });
  test("InputElementAdapter saveMaskedValue constructor", () => {
    const testInput = document.createElement("input");
    const inputMask = new InputMaskDateTime();
    inputMask.fromJSON({
      "pattern": "mm-dd-yyyy",
    });
    let adapter = new InputElementAdapter(inputMask, testInput, "1999-01-19");
    expect(testInput.value).toBe("01-19-1999");

    inputMask.saveMaskedValue = true;
    adapter = new InputElementAdapter(inputMask, testInput, "01-19-1999");
    expect(testInput.value).toBe("01-19-1999");

    testInput.remove();
  });

  test("Input mask with placeholder attribute - should hide mask when not focused", () => {
    const testInput = document.createElement("input");
    testInput.placeholder = "test";
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999-99-99";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput, "");

    expect(testInput.placeholder, "#1").toBe("test");
    expect(testInput.value, "value is empty before focus").toBe("");

    testInput.dispatchEvent(new Event("focus"));
    expect(testInput.placeholder, "#2").toBe("test");
    expect(testInput.value, "Mask visible when focused").toBe("___-__-__");

    testInput.dispatchEvent(new Event("blur"));
    expect(testInput.placeholder, "#3").toBe("test");
    expect(testInput.value, "value is empty after blur").toBe("");

    testInput.value = "123-45-78";
    testInput.dispatchEvent(new Event("focus"));
    expect(testInput.placeholder, "#4").toBe("test");
    expect(testInput.value, "focused").toBe("123-45-78");

    testInput.dispatchEvent(new Event("blur"));
    expect(testInput.placeholder, "#5").toBe("test");
    expect(testInput.value, "blur").toBe("123-45-78");

    testInput.remove();
  });

  test("Input mask without placeholder attribute - should show mask always", () => {
    const testInput = document.createElement("input");
    const inputMaskPattern = new InputMaskPattern();
    inputMaskPattern.pattern = "999-99-99";
    let adapter = new InputElementAdapter(inputMaskPattern, testInput, "");

    expect(testInput.placeholder, "#1").toBe("");
    expect(testInput.value, "#1").toBe("___-__-__");

    testInput.dispatchEvent(new Event("focus"));
    expect(testInput.placeholder, "#2").toBe("");
    expect(testInput.value, "#2").toBe("___-__-__");

    testInput.dispatchEvent(new Event("blur"));
    expect(testInput.placeholder, "#3").toBe("");
    expect(testInput.value, "#3").toBe("___-__-__");

    testInput.value = "123-45-78";
    testInput.dispatchEvent(new Event("focus"));
    expect(testInput.placeholder, "#4").toBe("");
    expect(testInput.value, "focused").toBe("123-45-78");

    testInput.dispatchEvent(new Event("blur"));
    expect(testInput.placeholder, "#5").toBe("");
    expect(testInput.value, "blur").toBe("123-45-78");

    testInput.remove();
  });
});
