import { InputMaskBase } from "../src/mask/mask";

export default QUnit.module("Pattern mask");

const mask = "+9(999)-999-99-99";

QUnit.test("get masked valid text", function(assert) {
  const inputMask = new InputMaskBase(mask);
  assert.equal(inputMask.getMaskedString(""), "+_(___)-___-__-__");
  assert.equal(inputMask.getMaskedString("1"), "+1(___)-___-__-__");
  assert.equal(inputMask.getMaskedString("1234"), "+1(234)-___-__-__");
  assert.equal(inputMask.getMaskedString("1234567"), "+1(234)-567-__-__");
  assert.equal(inputMask.getMaskedString("12345678910"), "+1(234)-567-89-10");
});

QUnit.test("get masked invalid text", function(assert) {
  const resultMaskedText = "+_(___)-___-__-__";
  const inputMask = new InputMaskBase(mask);
  assert.equal(inputMask.getMaskedString(""), resultMaskedText);
  assert.equal(inputMask.getMaskedString("a"), resultMaskedText);
  assert.equal(inputMask.getMaskedString("@"), resultMaskedText);
  assert.equal(inputMask.getMaskedString("."), resultMaskedText);
  assert.equal(inputMask.getMaskedString("123456789101112"), "+1(234)-567-89-10");
});

QUnit.test("get unmasked value", function(assert) {
  const inputMask = new InputMaskBase(mask);
  assert.equal(inputMask.getUnmaskedValue("+_(___)-___-__-__"), "");
  assert.equal(inputMask.getUnmaskedValue("+1(234)-567-__-__"), "");
  assert.equal(inputMask.getUnmaskedValue("+1(234)-567-89-10"), "12345678910");
});

QUnit.test("get unmasked invalid value", function(assert) {
  const inputMask = new InputMaskBase(mask);
  assert.equal(inputMask.getUnmaskedValue("+.(___)-___-__-__"), "");
  assert.equal(inputMask.getUnmaskedValue("+a(bcd)-567-__-__"), "");
  assert.equal(inputMask.getUnmaskedValue("++(234)-567-89-10"), "");
  assert.equal(inputMask.getUnmaskedValue("+1(234)-567-__-10"), "");
});

QUnit.test("update masked value", function(assert) {
  const resultMaskedText = "+1(234)-567-__-__";
  const inputMask = new InputMaskBase(mask);
  assert.equal(inputMask.updateMaskedString("+1(234)-567-__-__"), resultMaskedText);
  assert.equal(inputMask.updateMaskedString("+1(234)-567-ab-__"), resultMaskedText);
  assert.equal(inputMask.updateMaskedString("+1(234)-567-.,-__"), resultMaskedText);
  assert.equal(inputMask.updateMaskedString("+1(234)-567-!?-__"), resultMaskedText);
});
