import { InputMaskBase } from "../src/mask/mask";
import { checkValueByPattern, getMaskedValueByPattern, getUnmaskedValueByPattern } from "../src/mask/mask_utils";

export default QUnit.module("Pattern mask");

const mask = "+9(999)-999-99-99";

QUnit.test("get masked valid text", function(assert) {
  assert.equal(getMaskedValueByPattern("", mask).text, "+_(___)-___-__-__");
  assert.equal(getMaskedValueByPattern("1", mask).text, "+1(___)-___-__-__");
  assert.equal(getMaskedValueByPattern("1234", mask).text, "+1(234)-___-__-__");
  assert.equal(getMaskedValueByPattern("1234567", mask).text, "+1(234)-567-__-__");
  assert.equal(getMaskedValueByPattern("12345678910", mask).text, "+1(234)-567-89-10");
});

QUnit.test("get masked invalid text", function(assert) {
  const resultMaskedText = "+_(___)-___-__-__";
  assert.equal(getMaskedValueByPattern("", mask).text, resultMaskedText);
  assert.equal(getMaskedValueByPattern("a", mask).text, resultMaskedText);
  assert.equal(getMaskedValueByPattern("@", mask).text, resultMaskedText);
  assert.equal(getMaskedValueByPattern(".", mask).text, resultMaskedText);
  assert.equal(getMaskedValueByPattern("123456789101112", mask).text, "+1(234)-567-89-10");
});

QUnit.test("get unmasked value, matchWholeMask is true", function(assert) {
  assert.equal(getUnmaskedValueByPattern("", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+_(___)-___-__-__", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-__-__", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-89-10", mask, true), "12345678910");
});

QUnit.test("get unmasked invalid value, matchWholeMask is true", function(assert) {
  assert.equal(getUnmaskedValueByPattern("+.(___)-___-__-__", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+a(bcd)-567-__-__", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("++(234)-567-89-10", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-__-10", mask, true), "");
});

QUnit.test("get unmasked value, matchWholeMask is false", function(assert) {
  assert.equal(getUnmaskedValueByPattern("+_(___)-___-__-__", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-__-__", mask, false), "1234567");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-89-10", mask, false), "12345678910");
});

QUnit.test("get unmasked invalid value, matchWholeMask is false", function(assert) {
  assert.equal(getUnmaskedValueByPattern("+.(___)-___-__-__", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("+a(bcd)-567-__-__", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("++(234)-567-89-10", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-__-10", mask, false), "1234567");
});

QUnit.test("update masked value", function(assert) {
  const resultMaskedText = "+1(234)-567-__-__";
  const testInput = document.createElement("input");
  const inputMask = new InputMaskBase(testInput, mask);
  assert.equal(testInput.value, "+_(___)-___-__-__");

  testInput.value = "+1(234)-567-__-__";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567_-__-__";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567-ab-__";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567-.,-__";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567-!?-__";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.remove();
});
