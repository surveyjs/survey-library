import { syntacticAnalysisMask, processValueWithPattern, getMaskedValueByPattern, getUnmaskedValueByPattern, settings } from "../src/mask/mask_utils";

export default QUnit.module("Pattern mask");

const mask = "+9(999)-999-99-99";

QUnit.test("parsingMask simple pattern", function(assert) {
  let result = syntacticAnalysisMask(mask);
  assert.equal(result.length, 17);
  assert.equal(result[0].type, "const");
  assert.equal(result[0].value, "+");
  assert.equal(result[1].type, "regex");
  assert.equal(result[1].value, "9");
  assert.equal(result[2].type, "const");
  assert.equal(result[2].value, "(");
  assert.equal(result[3].type, "regex");
  assert.equal(result[3].value, "9");
});

QUnit.test("parsingMask with fixed character", function(assert) {
  let result = syntacticAnalysisMask("+\\9(999)-999-99-99");
  assert.equal(result.length, 17);
  assert.equal(result[0].type, "const");
  assert.equal(result[0].value, "+");
  assert.equal(result[1].type, "const");
  assert.equal(result[1].value, "9");
  assert.equal(result[2].type, "const");
  assert.equal(result[2].value, "(");
  assert.equal(result[3].type, "regex");
  assert.equal(result[3].value, "9");
});

QUnit.test("get masked valid text matchWholeMask = true", function(assert) {
  settings.placeholderChar = "*";
  assert.equal(getMaskedValueByPattern("", mask, true), "+*(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("1", mask, true), "+1(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("1234", mask, true), "+1(234)-***-**-**");
  assert.equal(getMaskedValueByPattern("1234567", mask, true), "+1(234)-567-**-**");
  assert.equal(getMaskedValueByPattern("12345678910", mask, true), "+1(234)-567-89-10");
  settings.placeholderChar = "_";
});

QUnit.test("get masked valid text matchWholeMask = false", function(assert) {
  settings.placeholderChar = "*";
  const customMask = "+1(999)-999-99-99";
  assert.equal(getMaskedValueByPattern("", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("1", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("1234", customMask, false), "+1(234)-");
  assert.equal(getMaskedValueByPattern("123456", customMask, false), "+1(234)-56");
  assert.equal(getMaskedValueByPattern("123456789101", customMask, false), "+1(234)-567-89-10");
  settings.placeholderChar = "_";
});

QUnit.test("get masked valid text with fixed character", function(assert) {
  settings.placeholderChar = "*";
  const customMask = "+\\9(999)-999-99-99";
  assert.equal(getMaskedValueByPattern("", customMask, true), "+9(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("9", customMask, true), "+9(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("123", customMask, true), "+9(123)-***-**-**");
  assert.equal(getMaskedValueByPattern("9123", customMask, true), "+9(123)-***-**-**");
  assert.equal(getMaskedValueByPattern("1234567891", customMask, true), "+9(123)-456-78-91");
  settings.placeholderChar = "_";
});

QUnit.test("get masked invalid text", function(assert) {
  settings.placeholderChar = "*";
  const resultMaskedText = "+*(***)-***-**-**";
  assert.equal(getMaskedValueByPattern("", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("a", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("@", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern(".", mask, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("123456789101112", mask, true), "+1(234)-567-89-10");
  settings.placeholderChar = "_";
});

QUnit.test("get unmasked value, matchWholeMask is true", function(assert) {
  settings.placeholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+*(***)-***-**-**", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-**", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-89-10", mask, true), "12345678910");
  settings.placeholderChar = "_";
});

QUnit.test("get unmasked invalid value, matchWholeMask is true", function(assert) {
  settings.placeholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("+.(***)-***-**-**", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+a(bcd)-567-**-**", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("++(234)-567-89-10", mask, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-10", mask, true), "");
  settings.placeholderChar = "_";
});

QUnit.test("get unmasked value, matchWholeMask is false", function(assert) {
  settings.placeholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("+*(***)-***-**-**", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-**", mask, false), "1234567");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-89-10", mask, false), "12345678910");
  settings.placeholderChar = "_";
});

QUnit.test("get unmasked invalid value, matchWholeMask is false", function(assert) {
  settings.placeholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("+.(***)-***-**-**", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("+a(bcd)-567-**-**", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("++(234)-567-89-10", mask, false), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-10", mask, false), "1234567");
  settings.placeholderChar = "_";
});

QUnit.test("edit value - type", function(assert) {
  settings.placeholderChar = "*";
  const pattern = "+1(999)-999-99-99";
  assert.equal(processValueWithPattern("+1(3***)-***-**-**", pattern, 3, 4).text, "+1(3**)-***-**-**", "type #1");
  assert.equal(processValueWithPattern("+1(3***)-***-**-**", pattern, 3, 4).cursorPosition, 4, "type #1");
  assert.equal(processValueWithPattern("+1(345*)-***-**-**", pattern, 5, 6).text, "+1(345)-***-**-**", "type #2");
  assert.equal(processValueWithPattern("+1(345*)-***-**-**", pattern, 5, 6).cursorPosition, 8, "type #2");
  assert.equal(processValueWithPattern("+1(345)-6***-**-**", pattern, 8, 9).text, "+1(345)-6**-**-**", "type #2");
  assert.equal(processValueWithPattern("+1(345)-6***-**-**", pattern, 8, 9).cursorPosition, 9, "type #2");
  assert.equal(processValueWithPattern("+1(345)-a***-**-**", pattern, 8, 9).text, "+1(345)-***-**-**", "type #3");
  assert.equal(processValueWithPattern("+1(345)-a***-**-**", pattern, 8, 9).cursorPosition, 8, "type #3");
  assert.equal(processValueWithPattern("+1(345)-9678-10-11", pattern, 8, 9).text, "+1(345)-967-81-01", "type #4");
  assert.equal(processValueWithPattern("+1(345)-9678-10-11", pattern, 8, 9).cursorPosition, 9, "type #4");
  assert.equal(processValueWithPattern("+1(345)-a678-10-11", pattern, 8, 9).text, "+1(345)-678-10-11", "type #5");
  assert.equal(processValueWithPattern("+1(345)-a678-10-11", pattern, 8, 9).cursorPosition, 8, "type #5");
  assert.equal(processValueWithPattern("+1(345)-678-10-111", pattern, 17, 18).text, "+1(345)-678-10-11", "type #6");
  assert.equal(processValueWithPattern("+1(345)-678-10-111", pattern, 17, 18).cursorPosition, 17, "type #6");
  settings.placeholderChar = "_";
});

QUnit.test("edit value - delete", function(assert) {
  settings.placeholderChar = "*";
  const pattern = "+1(999)-999-99-99";
  assert.equal(processValueWithPattern("+1(3*)-***-**-**", pattern, 5, 4).text, "+1(3**)-***-**-**", "delete #1");
  assert.equal(processValueWithPattern("+1(3*)-***-**-**", pattern, 5, 4).cursorPosition, 4, "delete #1");
  assert.equal(processValueWithPattern("+1(345)-**-**-**", pattern, 8, 7).text, "+1(345)-***-**-**", "delete #2");
  assert.equal(processValueWithPattern("+1(345)-**-**-**", pattern, 8, 7).cursorPosition, 7, "delete #2");
  assert.equal(processValueWithPattern("+1(345)-8_-**-**", pattern, 10, 9).text, "+1(345)-8**-**-**", "delete #3");
  assert.equal(processValueWithPattern("+1(345)-8_-**-**", pattern, 10, 9).cursorPosition, 9, "delete #3");
  assert.equal(processValueWithPattern("+1(345)-91-12-15", pattern, 9, 8).text, "+1(345)-911-21-5*", "delete #4");
  assert.equal(processValueWithPattern("+1(345)-91-12-15", pattern, 9, 8).cursorPosition, 8, "delete #4");
  assert.equal(processValueWithPattern("+1(345)-891-11-1", pattern, 17, 16).text, "+1(345)-891-11-1*", "delete #5");
  assert.equal(processValueWithPattern("+1(345)-891-11-1", pattern, 17, 16).cursorPosition, 16, "delete #5");
  settings.placeholderChar = "_";
});

QUnit.test("edit value - insert value", function(assert) {
  settings.placeholderChar = "*";
  const pattern = "+1(999)-999-99-99";
  assert.equal(processValueWithPattern("+1(345)-8a_-**-**", pattern, 9, 8).text, "+1(345)-8**-**-**", "insert value #3");
  settings.placeholderChar = "_";
});

/*
QUnit.test("update masked value", function(assert) {
  const resultMaskedText = "+1(234)-567-**-**";
  const testInput = document.createElement("input");
  const inputMask = new InputMaskBase(testInput, mask);
  inputMask["_prevSelectionStart"] = 0;
  assert.equal(testInput.value, "+*(***)-***-**-**");

  testInput.value = "+1(234)-567-**-**";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567_-**-**";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567-ab-**";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567-.,-**";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.value = "+1(234)-567-!?-**";
  inputMask.updateMaskedString(mask);
  assert.equal(testInput.value, resultMaskedText);

  testInput.remove();
});
*/
