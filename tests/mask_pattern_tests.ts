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

QUnit.only("edit value - type", function(assert) {
  const pattern = "+1(999)-999-99-99";
  assert.equal(checkValueByPattern("+1(3___)-___-__-__", pattern, 3, 4), "+1(3__)-___-__-__", "type #1");
  assert.equal(checkValueByPattern("+1(345)-6___-__-__", pattern, 8, 9), "+1(345)-6__-__-__", "type #2");
  assert.equal(checkValueByPattern("+1(345)-a___-__-__", pattern, 8, 9), "+1(345)-___-__-__", "type #3");
  assert.equal(checkValueByPattern("+1(345)-9678-10-11", pattern, 8, 9), "+1(345)-967-81-01", "type #4");
  assert.equal(checkValueByPattern("+1(345)-a678-10-11", pattern, 8, 9), "+1(345)-678-10-11", "type #5");
  assert.equal(checkValueByPattern("+1(345)-678-10-111", pattern, 17, 18), "+1(345)-678-10-11", "type #6");
});

QUnit.only("edit value - delete", function(assert) {
  const pattern = "+1(999)-999-99-99";
  assert.equal(checkValueByPattern("+1(3_)-___-__-__", pattern, 4, 3), "+1(3__)-___-__-__", "delete #1");
  assert.equal(checkValueByPattern("+1(345)-__-__-__", pattern, 8, 7), "+1(345)-___-__-__", "delete #2");
  assert.equal(checkValueByPattern("+1(345)-8_-__-__", pattern, 9, 8), "+1(345)-8__-__-__", "delete #3");
  assert.equal(checkValueByPattern("+1(345)-91-12-15", pattern, 9, 8), "+1(345)-911-21-5_", "delete #4");
  assert.equal(checkValueByPattern("+1(345)-891-11-1", pattern, 17, 16), "+1(345)-891-11-1_", "delete #5");
});

QUnit.only("edit value - insert value", function(assert) {
  const pattern = "+1(999)-999-99-99";
  assert.equal(checkValueByPattern("+1(345)-8a_-__-__", pattern, 9, 8), "+1(345)-8__-__-__", "insert value #3");
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
