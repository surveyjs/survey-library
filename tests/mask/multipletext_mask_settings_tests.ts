import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { QuestionMultipleTextModel } from "../../src/question_multipletext";

export default QUnit.module("Multiple text: Input mask");

QUnit.test("Initial mask settings", function (assert) {
  const testInput = document.createElement("input");

  const multipletext = new QuestionMultipleTextModel("q1");
  multipletext.addItem("item1");
  const item = multipletext.items[0];
  const itemEditor = item.editor;
  itemEditor.input = testInput;
  assert.equal(item.maskType, "none");
  assert.equal(item.maskSettings.getType(), "masksettings");
  assert.equal(!!itemEditor["maskInputAdapter"], false);

  item.maskType = "pattern";
  assert.equal(item.maskType, "pattern");
  assert.equal(item.maskSettings.getType(), "patternmask");
  assert.equal(!!itemEditor["maskInputAdapter"], true);

  testInput.remove();
});

QUnit.test("Apply mask", function (assert) {
  const multipletext = new QuestionMultipleTextModel("q1");
  multipletext.addItem("item1");
  const item = multipletext.items[0];
  const itemEditor = item.editor;

  item.maskType = "pattern";
  item.maskSettings.fromJSON({ pattern: "+99-99" });
  item.value = "1234";
  assert.equal(item.value, "1234");
  assert.equal(itemEditor.inputValue, "+12-34");

  itemEditor.inputValue = "+78-68";
  assert.equal(item.value, "7868");
  assert.equal(itemEditor.inputValue, "+78-68");

  assert.deepEqual(multipletext.toJSON(), {
    "name": "q1",
    "items": [
      {
        "name": "item1",
        "maskType": "pattern",
        "maskSettings": {
          pattern: "+99-99"
        }
      }
    ]
  });
});

QUnit.test("Switch mask type", function (assert) {
  const multipletext = new QuestionMultipleTextModel("q1");
  multipletext.addItem("item1");
  const item = multipletext.items[0];
  assert.equal(item.maskType, "none");
  assert.equal(item.maskSettings instanceof InputMaskBase, true);

  item.maskType = "pattern";
  assert.equal(item.maskType, "pattern");
  assert.equal(item.maskSettings instanceof InputMaskPattern, true);

  item.maskType = "numeric";
  assert.equal(item.maskType, "numeric");
  assert.equal(item.maskSettings instanceof InputMaskNumeric, true);

  item.maskType = "none";
  assert.equal(item.maskType, "none");
  assert.equal(item.maskSettings instanceof InputMaskBase, true);
});

QUnit.test("Currency mask: text aligment", function (assert) {
  const multipletext = new QuestionMultipleTextModel("q1");
  multipletext.addItem("item1");
  const item = multipletext.items[0];
  const itemEditor = item.editor;
  assert.deepEqual(itemEditor.inputStyle, { width: undefined });

  item.maskType = "currency";
  assert.deepEqual(itemEditor.inputStyle, { width: undefined, textAlign: "right" });

  item.inputTextAlignment = "left";
  assert.deepEqual(itemEditor.inputStyle, { width: undefined, textAlign: "left" });
});