// import { MaskSettings, NumberMaskSettings, PatternMaskSettings } from "../../src/mask/mask_settings";
import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumber } from "../../src/mask/mask_number";
import { QuestionTextModel } from "../../src/question_text";

export default QUnit.module("Question text: Input mask");

QUnit.test("Apply mask", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.setData({ mask: "+99-99" });
  q.value = "1234";
  assert.equal(q.value, "1234");
  assert.equal(q.inputValue, "+12-34");

  q.inputValue = "+78-68";
  assert.equal(q.value, "7868");
  assert.equal(q.inputValue, "+78-68");
});

QUnit.test("Pattern mask", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.setData({ mask: "+99-99", dataToSave: "masked" });

  q.inputValue = "+12-34";
  assert.equal(q.value, "+12-34", "masked value");
  assert.equal(q.inputValue, "+12-34", "masked inputValue");

  q.maskSettings.setData({ mask: "+99-99", dataToSave: "unmasked" });
  q.inputValue = "+45-67";
  assert.equal(q.value, "4567", "unmasked value");
  assert.equal(q.inputValue, "+45-67", "unmasked inputValue");
});

QUnit.test("Switch mask type", function (assert) {
  const q = new QuestionTextModel("q1");
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings instanceof InputMaskBase, true);

  q.maskType = "pattern";
  assert.equal(q.maskType, "pattern");
  assert.equal(q.maskSettings instanceof InputMaskPattern, true);

  q.maskType = "number";
  assert.equal(q.maskType, "number");
  assert.equal(q.maskSettings instanceof InputMaskNumber, true);

  q.maskType = "none";
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings instanceof InputMaskBase, true);
});