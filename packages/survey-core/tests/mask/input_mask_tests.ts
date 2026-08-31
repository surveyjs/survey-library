import { InputElementAdapter } from "../../src/mask/input_element_adapter";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { InputMaskDateTime } from "../../src/mask/mask_datetime";

import { describe, test, expect } from "vitest";
describe("Input mask", () => {
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
