import { InputElementAdapter } from "../../src/mask/input_element_adapter";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskCurrency } from "../../src/mask/mask_currency";

export default QUnit.module("Input mask");

QUnit.test("InputElementAdapter constructor", function (assert) {
  const testInput = document.createElement("input");
  const inputMask = new InputMaskCurrency();
  inputMask.fromJSON({
    "decimalSeparator": ",",
    "thousandsSeparator": " ",
    "suffix": " Eur"
  });
  let adapter = new InputElementAdapter(inputMask, testInput, 12345.67);
  assert.equal(testInput.value, "12 345,67 Eur");

  adapter = new InputElementAdapter(inputMask, testInput);
  assert.equal(testInput.value, "");

  adapter = new InputElementAdapter(inputMask, testInput, undefined);
  assert.equal(testInput.value, "");

  adapter = new InputElementAdapter(inputMask, testInput, null);
  assert.equal(testInput.value, "");

  testInput.remove();
});

QUnit.test("InputElementAdapter createArgs insertText", function (assert) {
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
  assert.equal(args.insertedChars, "a");
  assert.equal(args.selectionStart, 1);
  assert.equal(args.selectionEnd, 1);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "forward");

  testInput.remove();
});

QUnit.test("InputElementAdapter createArgs deleteContentForward", function (assert) {
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
  assert.equal(args.insertedChars, null);
  assert.equal(args.selectionStart, 1);
  assert.equal(args.selectionEnd, 2);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "forward");

  target.selectionStart = 3;
  target.selectionEnd = 3;

  args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
  assert.equal(args.insertedChars, null);
  assert.equal(args.selectionStart, 3);
  assert.equal(args.selectionEnd, 4);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "forward");

  target.selectionStart = 1;
  target.selectionEnd = 2;

  args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
  assert.equal(args.insertedChars, null);
  assert.equal(args.selectionStart, 1);
  assert.equal(args.selectionEnd, 2);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "forward");

  testInput.remove();
});

QUnit.test("InputElementAdapter createArgs deleteContentBackward", function (assert) {
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
  assert.equal(args.insertedChars, null);
  assert.equal(args.selectionStart, 0);
  assert.equal(args.selectionEnd, 1);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "backward");

  target.selectionStart = 0;
  target.selectionEnd = 0;
  args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
  assert.equal(args.insertedChars, null);
  assert.equal(args.selectionStart, 0);
  assert.equal(args.selectionEnd, 0);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "backward");

  target.selectionStart = 1;
  target.selectionEnd = 2;
  args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
  assert.equal(args.insertedChars, null);
  assert.equal(args.selectionStart, 1);
  assert.equal(args.selectionEnd, 2);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "backward");

  testInput.remove();
});

QUnit.test("Change property mask => update display value", function (assert) {
  const testInput = document.createElement("input");
  const inputMaskPattern = new InputMaskPattern();
  inputMaskPattern.pattern = "999";
  let adapter = new InputElementAdapter(inputMaskPattern, testInput, "123");
  assert.equal(testInput.value, "123");

  inputMaskPattern.pattern = "9";
  assert.equal(testInput.value, "1");

  const inputMaskNumeric = new InputMaskNumeric();
  adapter = new InputElementAdapter(inputMaskNumeric, testInput, "123456");
  assert.equal(testInput.value, "123,456");

  inputMaskNumeric.thousandsSeparator = " ";
  assert.equal(testInput.value, "123 456");

  inputMaskNumeric.thousandsSeparator = ",";
  assert.equal(testInput.value, "123,456");

  testInput.remove();
});

QUnit.test("Input mask + autocomplete", function (assert) {
  const testInput = document.createElement("input");
  const inputMaskPattern = new InputMaskPattern();
  inputMaskPattern.pattern = "999-99-99";
  let adapter = new InputElementAdapter(inputMaskPattern, testInput, "");
  assert.equal(testInput.value, "___-__-__");

  testInput.focus();
  testInput.value = "+123456789";
  testInput.dispatchEvent(new Event("change"));
  assert.equal(testInput.value, "123-45-67");

  testInput.remove();
});