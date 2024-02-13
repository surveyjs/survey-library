import { InputElementAdapter } from "../../src/mask/input_element_adapter";
import { InputMaskPattern } from "../../src/mask/mask_pattern";

export default QUnit.module("Input mask");

QUnit.test("InputElementAdapter createArgs insertText", function(assert) {
  const testInput = document.createElement("input");
  const inputMaskPattern = new InputMaskPattern();
  inputMaskPattern.mask = "999";
  let adapter = new InputElementAdapter(inputMaskPattern, testInput);
  const target = {
    selectionStart: 1,
    selectionEnd: 1,
    value: "123"
  };
  let args = adapter.createArgs({ data: "a", inputType: "insertText", target: target });
  assert.equal(args.insertedCharacters, "a");
  assert.equal(args.selectionStart, 1);
  assert.equal(args.selectionEnd, 1);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "leftToRight");

  testInput.remove();
});

QUnit.test("InputElementAdapter createArgs deleteContentForward", function(assert) {
  const testInput = document.createElement("input");
  const inputMaskPattern = new InputMaskPattern();
  inputMaskPattern.mask = "999";
  let adapter = new InputElementAdapter(inputMaskPattern, testInput);
  const target = {
    selectionStart: 1,
    selectionEnd: 1,
    value: "123"
  };
  let args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
  assert.equal(args.insertedCharacters, null);
  assert.equal(args.selectionStart, 1);
  assert.equal(args.selectionEnd, 2);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "leftToRight");

  target.selectionStart = 3;
  target.selectionEnd = 3;

  args = adapter.createArgs({ data: null, inputType: "deleteContentForward", target: target });
  assert.equal(args.insertedCharacters, null);
  assert.equal(args.selectionStart, 3);
  assert.equal(args.selectionEnd, 4);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "leftToRight");

  testInput.remove();
});

QUnit.test("InputElementAdapter createArgs deleteContentBackward", function(assert) {
  const testInput = document.createElement("input");
  const inputMaskPattern = new InputMaskPattern();
  inputMaskPattern.mask = "999";
  let adapter = new InputElementAdapter(inputMaskPattern, testInput);

  const target = {
    selectionStart: 1,
    selectionEnd: 1,
    value: "123"
  };
  let args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
  assert.equal(args.insertedCharacters, null);
  assert.equal(args.selectionStart, 0);
  assert.equal(args.selectionEnd, 1);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "rightToLeft");

  target.selectionStart = 0;
  target.selectionEnd = 0;
  args = adapter.createArgs({ data: null, inputType: "deleteContentBackward", target: target });
  assert.equal(args.insertedCharacters, null);
  assert.equal(args.selectionStart, 0);
  assert.equal(args.selectionEnd, 0);
  assert.equal(args.prevValue, "123");
  assert.equal(args.inputDirection, "rightToLeft");

  testInput.remove();
});