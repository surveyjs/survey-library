import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumeric } from "../../src/mask/mask_number";
import { QuestionTextModel } from "../../src/question_text";

export default QUnit.module("Question text: Input mask");

QUnit.test("Apply mask", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "+99-99" });
  q.value = "1234";
  assert.equal(q.value, "1234");
  assert.equal(q.inputValue, "+12-34");

  q.inputValue = "+78-68";
  assert.equal(q.value, "7868");
  assert.equal(q.inputValue, "+78-68");
});

QUnit.test("Pattern mask: value is completed", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

  q.inputValue = "+12-34";
  assert.equal(q.value, "+12-34", "masked value");
  assert.equal(q.inputValue, "+12-34", "masked inputValue");

  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });
  q.inputValue = "+45-67";
  assert.equal(q.value, "4567", "unmasked value");
  assert.equal(q.inputValue, "+45-67", "unmasked inputValue");
});

QUnit.test("Pattern mask: value is incompleted", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

  q.inputValue = "+12-";
  assert.equal(q.value, undefined, "masked value");
  assert.equal(q.inputValue, "+__-__", "masked inputValue");

  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });
  q.inputValue = "+45-";
  assert.equal(q.value, undefined, "unmasked value");
  assert.equal(q.inputValue, "+__-__", "unmasked inputValue");
});

QUnit.test("Switch mask type", function (assert) {
  const q = new QuestionTextModel("q1");
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings instanceof InputMaskBase, true);

  q.maskType = "pattern";
  assert.equal(q.maskType, "pattern");
  assert.equal(q.maskSettings instanceof InputMaskPattern, true);

  q.maskType = "numeric";
  assert.equal(q.maskType, "numeric");
  assert.equal(q.maskSettings instanceof InputMaskNumeric, true);

  q.maskType = "none";
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings instanceof InputMaskBase, true);
});