import { InputMaskBase } from "../src/mask/mask";
import { processValueWithPattern, getMaskedValueByPattern, getUnmaskedValueByPattern } from "../src/mask/mask_utils";

export default QUnit.module("Pattern mask");

const mask = "+9(999)-999-99-99";

QUnit.test("get masked valid text", function(assert) {
  assert.equal(getMaskedValueByPattern("", mask, true), "+_(___)-___-__-__");
  assert.equal(getMaskedValueByPattern("1", mask, true), "+1(___)-___-__-__");
  assert.equal(getMaskedValueByPattern("1234", mask, true), "+1(234)-___-__-__");
  assert.equal(getMaskedValueByPattern("1234567", mask, true), "+1(234)-567-__-__");
  assert.equal(getMaskedValueByPattern("12345678910", mask, true), "+1(234)-567-89-10");
});

QUnit.test("get masked valid text", function(assert) {
  const customMask = "+1(999)-999-99-99";
  assert.equal(getMaskedValueByPattern("", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("1", customMask, false), "+1(1");
  assert.equal(getMaskedValueByPattern("123", customMask, false), "+1(123)-");
  assert.equal(getMaskedValueByPattern("123456", customMask, false), "+1(123)-456-");
  assert.equal(getMaskedValueByPattern("12345678910", customMask, false), "+1(123)-456-78-91");
});

QUnit.test("get masked invalid text", function(assert) {
  const resultMaskedText = "+_(___)-___-__-__";
  assert.equal(getMaskedValueByPattern("", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("a", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("@", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern(".", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("123456789101112", mask, true), "+1(234)-567-89-10");
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

QUnit.test("edit value - type", function(assert) {
  const pattern = "+1(999)-999-99-99";
  assert.equal(processValueWithPattern("+1(3___)-___-__-__", pattern, 3, 4).text, "+1(3__)-___-__-__", "type #1");
  assert.equal(processValueWithPattern("+1(3___)-___-__-__", pattern, 3, 4).cursorPosition, 4, "type #1");
  assert.equal(processValueWithPattern("+1(345_)-___-__-__", pattern, 5, 6).text, "+1(345)-___-__-__", "type #2");
  assert.equal(processValueWithPattern("+1(345_)-___-__-__", pattern, 5, 6).cursorPosition, 8, "type #2");
  assert.equal(processValueWithPattern("+1(345)-6___-__-__", pattern, 8, 9).text, "+1(345)-6__-__-__", "type #2");
  assert.equal(processValueWithPattern("+1(345)-6___-__-__", pattern, 8, 9).cursorPosition, 9, "type #2");
  assert.equal(processValueWithPattern("+1(345)-a___-__-__", pattern, 8, 9).text, "+1(345)-___-__-__", "type #3");
  assert.equal(processValueWithPattern("+1(345)-a___-__-__", pattern, 8, 9).cursorPosition, 8, "type #3");
  assert.equal(processValueWithPattern("+1(345)-9678-10-11", pattern, 8, 9).text, "+1(345)-967-81-01", "type #4");
  assert.equal(processValueWithPattern("+1(345)-9678-10-11", pattern, 8, 9).cursorPosition, 9, "type #4");
  assert.equal(processValueWithPattern("+1(345)-a678-10-11", pattern, 8, 9).text, "+1(345)-678-10-11", "type #5");
  assert.equal(processValueWithPattern("+1(345)-a678-10-11", pattern, 8, 9).cursorPosition, 8, "type #5");
  assert.equal(processValueWithPattern("+1(345)-678-10-111", pattern, 17, 18).text, "+1(345)-678-10-11", "type #6");
  assert.equal(processValueWithPattern("+1(345)-678-10-111", pattern, 17, 18).cursorPosition, 17, "type #6");
});

QUnit.test("edit value - delete", function(assert) {
  const pattern = "+1(999)-999-99-99";
  assert.equal(processValueWithPattern("+1(3_)-___-__-__", pattern, 5, 4).text, "+1(3__)-___-__-__", "delete #1");
  assert.equal(processValueWithPattern("+1(3_)-___-__-__", pattern, 5, 4).cursorPosition, 4, "delete #1");
  assert.equal(processValueWithPattern("+1(345)-__-__-__", pattern, 8, 7).text, "+1(345)-___-__-__", "delete #2");
  assert.equal(processValueWithPattern("+1(345)-__-__-__", pattern, 8, 7).cursorPosition, 7, "delete #2");
  assert.equal(processValueWithPattern("+1(345)-8_-__-__", pattern, 10, 9).text, "+1(345)-8__-__-__", "delete #3");
  assert.equal(processValueWithPattern("+1(345)-8_-__-__", pattern, 10, 9).cursorPosition, 9, "delete #3");
  assert.equal(processValueWithPattern("+1(345)-91-12-15", pattern, 9, 8).text, "+1(345)-911-21-5_", "delete #4");
  assert.equal(processValueWithPattern("+1(345)-91-12-15", pattern, 9, 8).cursorPosition, 8, "delete #4");
  assert.equal(processValueWithPattern("+1(345)-891-11-1", pattern, 17, 16).text, "+1(345)-891-11-1_", "delete #5");
  assert.equal(processValueWithPattern("+1(345)-891-11-1", pattern, 17, 16).cursorPosition, 16, "delete #5");
});

QUnit.test("edit value - insert value", function(assert) {
  const pattern = "+1(999)-999-99-99";
  assert.equal(processValueWithPattern("+1(345)-8a_-__-__", pattern, 9, 8).text, "+1(345)-8__-__-__", "insert value #3");
});

/*
QUnit.only("update masked value", function(assert) {
  const resultMaskedText = "+1(234)-567-__-__";
  const testInput = document.createElement("input");
  const inputMask = new InputMaskBase(testInput, mask);
  inputMask["_prevSelectionStart"] = 0;
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
*/
