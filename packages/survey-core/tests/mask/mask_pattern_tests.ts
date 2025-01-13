import { getMaskedValueByPattern, getUnmaskedValueByPattern, getLiterals, InputMaskPattern } from "../../src/mask/mask_pattern";
import { QuestionTextModel } from "../../src/question_text";
import { JsonObject } from "../../src/jsonobject";
import { settings } from "../../src/settings";

export default QUnit.module("Pattern mask");

const pattern = "+9(999)-999-99-99";

QUnit.test("parsingMask simple pattern", function(assert) {
  let result = getLiterals(pattern);
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
  let result = getLiterals("+\\9(999)-999-99-99");
  assert.equal(result.length, 17);
  assert.equal(result[0].type, "const");
  assert.equal(result[0].value, "+");
  assert.equal(result[1].type, "fixed");
  assert.equal(result[1].value, "9");
  assert.equal(result[2].type, "const");
  assert.equal(result[2].value, "(");
  assert.equal(result[3].type, "regex");
  assert.equal(result[3].value, "9");
});

QUnit.test("get masked valid text matchWholeMask = true", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  assert.equal(getMaskedValueByPattern("", pattern, true), "+*(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("1", pattern, true), "+1(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("1234", pattern, true), "+1(234)-***-**-**");
  assert.equal(getMaskedValueByPattern("1234567", pattern, true), "+1(234)-567-**-**");
  assert.equal(getMaskedValueByPattern("12345678910", pattern, true), "+1(234)-567-89-10");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get masked valid text matchWholeMask = false", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const customMask = "+1(999)-999-99-99";
  assert.equal(getMaskedValueByPattern("", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("1", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("8", customMask, false), "+1(8");
  assert.equal(getMaskedValueByPattern("+1", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("+18", customMask, false), "+1(8");
  assert.equal(getMaskedValueByPattern("1234", customMask, false), "+1(234)-");
  assert.equal(getMaskedValueByPattern("123456", customMask, false), "+1(234)-56");
  assert.equal(getMaskedValueByPattern("123456789101", customMask, false), "+1(234)-567-89-10");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get masked valid text with fixed character", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const customMask = "+\\9(999)-999-99-99";
  assert.equal(getMaskedValueByPattern("", customMask, true), "+9(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("9", customMask, true), "+9(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("123", customMask, true), "+9(123)-***-**-**");
  assert.equal(getMaskedValueByPattern("9123", customMask, true), "+9(123)-***-**-**");
  assert.equal(getMaskedValueByPattern("1234567891", customMask, true), "+9(123)-456-78-91");
  assert.equal(getMaskedValueByPattern("9912", customMask, true), "+9(912)-***-**-**");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get masked valid text with fixed character in the middle string", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const customMask = "99+\\1(999)-999";
  assert.equal(getMaskedValueByPattern("", customMask, false), "");
  assert.equal(getMaskedValueByPattern("1", customMask, false), "1");
  assert.equal(getMaskedValueByPattern("12", customMask, false), "12+1(");
  assert.equal(getMaskedValueByPattern("123", customMask, false), "12+1(3");
  assert.equal(getMaskedValueByPattern("11123", customMask, false), "11+1(23");
  assert.equal(getMaskedValueByPattern("1234567891", customMask, false), "12+1(345)-678");
  assert.equal(getMaskedValueByPattern("111123", customMask, false), "11+1(123)-");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get masked invalid text", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const resultMaskedText = "+*(***)-***-**-**";
  assert.equal(getMaskedValueByPattern("", pattern, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("a", pattern, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("@", pattern, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern(".", pattern, true), resultMaskedText);
  assert.equal(getMaskedValueByPattern("123456789101112", pattern, true), "+1(234)-567-89-10");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get masked value by formated text matchWholeMask = true", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  assert.equal(getMaskedValueByPattern("+1***)-***-**-**", pattern, true), "+1(***)-***-**-**");
  assert.equal(getMaskedValueByPattern("+1(234)-1***-**-**", pattern, true), "+1(234)-1**-**-**");
  assert.equal(getMaskedValueByPattern("+1(234)-1567-89-10", pattern, true), "+1(234)-156-78-91");
  assert.equal(getMaskedValueByPattern("+1(234)-67-89-10", pattern, true), "+1(234)-678-91-0*");
  assert.equal(getMaskedValueByPattern("+1(2367-89-10", pattern, true), "+1(236)-789-10-**");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get masked value by formated text matchWholeMask = false", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const customMask = "+1(999)-999-99-99";
  assert.equal(getMaskedValueByPattern("", customMask, false), "+1(");
  assert.equal(getMaskedValueByPattern("+1(234)-1***-**-**", pattern, false), "+1(234)-1");
  assert.equal(getMaskedValueByPattern("+1(234)-1567-89-10", pattern, false), "+1(234)-156-78-91");
  assert.equal(getMaskedValueByPattern("+1(234)-67-89-10", pattern, false), "+1(234)-678-91-0");
  assert.equal(getMaskedValueByPattern("+1(2367-89-10", pattern, false), "+1(236)-789-10-");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get unmasked value, matchWholeMask is true", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("", pattern, true), "");
  assert.equal(getUnmaskedValueByPattern("+*(***)-***-**-**", pattern, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-**", pattern, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-89-10", pattern, true), "12345678910");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get unmasked invalid value, matchWholeMask is true", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("+.(***)-***-**-**", pattern, true), "");
  assert.equal(getUnmaskedValueByPattern("+a(bcd)-567-**-**", pattern, true), "");
  assert.equal(getUnmaskedValueByPattern("++(234)-567-89-10", pattern, true), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-10", pattern, true), "");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get unmasked value, matchWholeMask is false", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("+*(***)-***-**-**", pattern, false), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-**", pattern, false), "1234567");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-89-10", pattern, false), "12345678910");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("get unmasked invalid value, matchWholeMask is false", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  assert.equal(getUnmaskedValueByPattern("+.(***)-***-**-**", pattern, false), "");
  assert.equal(getUnmaskedValueByPattern("+a(bcd)-567-**-**", pattern, false), "");
  assert.equal(getUnmaskedValueByPattern("++(234)-567-89-10", pattern, false), "");
  assert.equal(getUnmaskedValueByPattern("+1(234)-567-**-10", pattern, false), "1234567");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: insert characters", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "+\\1(999)-999-99-99";
  let result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(3**)-***-**-**", "type #1");
  assert.equal(result.caretPosition, 4, "type #1");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 5, selectionEnd: 5, prevValue: "+1(34*)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-***-**-**", "type #2.1");
  assert.equal(result.caretPosition, 8, "type #2.1");

  result = maskInstance.processInput({ insertedChars: "6", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-6**-**-**", "type #2.2");
  assert.equal(result.caretPosition, 9, "type #2.2");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-***-**-**", "type #3");
  assert.equal(result.caretPosition, 8, "type #3");

  result = maskInstance.processInput({ insertedChars: "9", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-678-10-11", inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-967-81-01", "type #4");
  assert.equal(result.caretPosition, 9, "type #4");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-678-10-11", inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-678-10-11", "type #5");
  assert.equal(result.caretPosition, 8, "type #5");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 17, selectionEnd: 17, prevValue: "+1(345)-678-10-11", inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-678-10-11", "type #6");
  assert.equal(result.caretPosition, 17, "type #6");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 9, selectionEnd: 9, prevValue: "+1(123)-467-89-7*", inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-456-78-97", "type #7");
  assert.equal(result.caretPosition, 10, "type #7");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: insert characters into beginning string", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "+\\1(999)-999-99-99";
  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(***)-***-**-**", "type #1");
  assert.equal(result.caretPosition, 3, "type #1");

  result = maskInstance.processInput({ insertedChars: "+", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(***)-***-**-**", "type #2");
  assert.equal(result.caretPosition, 3, "type #2");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(***)-***-**-**", "type #3");
  assert.equal(result.caretPosition, 3, "type #3");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(8**)-***-**-**", "type #4");
  assert.equal(result.caretPosition, 4, "type #4");

  result = maskInstance.processInput({ insertedChars: "+18", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
  assert.equal(result.value, "+1(8**)-***-**-**", "type #5");
  assert.equal(result.caretPosition, 4, "type #5");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: insert characters into middle string", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "99+\\1(999)-999";
  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "56+1(***)-***", "type #1");
  assert.equal(result.caretPosition, 5, "type #1");

  result = maskInstance.processInput({ insertedChars: "+", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "56+1(***)-***", "type #2");
  assert.equal(result.caretPosition, 5, "type #2");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "56+1(***)-***", "type #3");
  assert.equal(result.caretPosition, 5, "type #3");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "56+1(8**)-***", "type #4");
  assert.equal(result.caretPosition, 6, "type #4");

  result = maskInstance.processInput({ insertedChars: "+18", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "56+1(8**)-***", "type #5");
  assert.equal(result.caretPosition, 6, "type #5");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "**+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "1*+1(***)-***", "type #6");
  assert.equal(result.caretPosition, 1, "type #6");

  result = maskInstance.processInput({ insertedChars: "9", selectionStart: 0, selectionEnd: 0, prevValue: "**+1(***)-***", inputDirection: "forward" });
  assert.equal(result.value, "9*+1(***)-***", "type #7");
  assert.equal(result.caretPosition, 1, "type #7");

  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: delete characters", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "+\\1(999)-999-99-99";
  let result = maskInstance.processInput({ prevValue: "+1(34*)-***-**-**", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(3**)-***-**-**", "delete 4");
  assert.equal(result.caretPosition, 4, "delete 4");

  result = maskInstance.processInput({ prevValue: "+1(345)-***-**-**", selectionStart: 5, selectionEnd: 6, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(34*)-***-**-**", "key delete 5");
  assert.equal(result.caretPosition, 5, "key delete 5");

  result = maskInstance.processInput({ prevValue: "+1(345)-891-**-**", selectionStart: 10, selectionEnd: 11, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-89*-**-**", "key delete 1");
  assert.equal(result.caretPosition, 10, "key delete 1");

  result = maskInstance.processInput({ prevValue: "+1(345)-89*-**-**", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-8**-**-**", "delete 9 ");
  assert.equal(result.caretPosition, 9, "delete 9");

  result = maskInstance.processInput({ prevValue: "+1(345)-891-12-15", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-911-21-5*", "delete 8");
  assert.equal(result.caretPosition, 8, "delete 8");

  result = maskInstance.processInput({ prevValue: "+1(345)-891-11-12", selectionStart: 16, selectionEnd: 17, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(345)-891-11-1*", "delete last character");
  assert.equal(result.caretPosition, 16, "delete last character");

  result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-567-89-7*", "key delete 4");
  assert.equal(result.caretPosition, 8, "key delete 4");
  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: delete characters by backspace", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "+\\1(999)-999-99-99";
  let result = maskInstance.processInput({ prevValue: "+1(34*)-***-**-**", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(3**)-***-**-**", "delete 4");
  assert.equal(result.caretPosition, 4, "delete 4");

  result = maskInstance.processInput({ prevValue: "+1(345)-***-**-**", selectionStart: 7, selectionEnd: 8, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(345)-***-**-**", "backspace delete - after )");
  assert.equal(result.caretPosition, 7, "backspace delete - after )");

  result = maskInstance.processInput({ prevValue: "+1(345)-891-**-**", selectionStart: 11, selectionEnd: 12, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(345)-891-**-**", "backspace delete - after 1");
  assert.equal(result.caretPosition, 11, "backspace delete - after 1");

  result = maskInstance.processInput({ prevValue: "+1(345)-89*-**-**", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(345)-8**-**-**", "delete 9 ");
  assert.equal(result.caretPosition, 9, "delete 9");

  result = maskInstance.processInput({ prevValue: "+1(345)-891-12-15", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(345)-911-21-5*", "delete 8");
  assert.equal(result.caretPosition, 8, "delete 8");

  result = maskInstance.processInput({ prevValue: "+1(345)-891-11-12", selectionStart: 16, selectionEnd: 17, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(345)-891-11-1*", "delete last character");
  assert.equal(result.caretPosition, 16, "delete last character");

  result = maskInstance.processInput({ prevValue: "+1(***)-***-**-**", selectionStart: 0, selectionEnd: 0, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(***)-***-**-**", "delete first character");
  assert.equal(result.caretPosition, 0, "delete first character");

  result = maskInstance.processInput({ prevValue: "+1(***)-***-**-**", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(***)-***-**-**", "delete +");
  assert.equal(result.caretPosition, 0, "delete +");

  result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "+1(123)-567-89-7*", "key backspace 4");
  assert.equal(result.caretPosition, 8, "key backspace 4");

  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: cut characters", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "+\\1(999)-999-99-99";
  let result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 14, insertedChars: null, inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-497-**-**", "cut #1");
  assert.equal(result.caretPosition, 9, "cut #1");

  result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 11, insertedChars: "00", inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-400-78-97", "cut + paste 2");
  assert.equal(result.caretPosition, 12, "cut + paste #2");

  result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 11, insertedChars: "000", inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-400-07-89", "cut + paste 3");
  assert.equal(result.caretPosition, 13, "cut + paste #3");

  result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 8, selectionEnd: 11, insertedChars: "00", inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-007-89-7*", "cut + paste 4.0");
  assert.equal(result.caretPosition, 10, "cut + paste #4.0");

  result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 13, insertedChars: "00", inputDirection: "forward" });
  assert.equal(result.value, "+1(123)-400-89-7*", "cut + paste 4");
  assert.equal(result.caretPosition, 12, "cut + paste #4");

  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("pattern processInput: cut characters into middle string", function(assert) {
  settings.maskSettings.patternPlaceholderChar = "*";
  const maskInstance = new InputMaskPattern();
  maskInstance.pattern = "99+\\1(999)-999";
  let result = maskInstance.processInput({ prevValue: "56+1(789)-123", selectionStart: 1, selectionEnd: 6, insertedChars: "2+14", inputDirection: "forward" });
  assert.equal(result.value, "52+1(489)-123", "cut #1");
  assert.equal(result.caretPosition, 6, "cut #1");

  result = maskInstance.processInput({ prevValue: "56+1(789)-123", selectionStart: 1, selectionEnd: 6, insertedChars: "000", inputDirection: "forward" });
  assert.equal(result.value, "50+1(008)-912", "cut #2");
  assert.equal(result.caretPosition, 7, "cut #2");

  result = maskInstance.processInput({ prevValue: "56+1(789)-123", selectionStart: 0, selectionEnd: 1, insertedChars: "000", inputDirection: "forward" });
  assert.equal(result.value, "00+1(067)-891", "cut #3");
  assert.equal(result.caretPosition, 6, "cut #3");

  settings.maskSettings.patternPlaceholderChar = "_";
});

QUnit.test("Serialize InputMaskPattern properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  let json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1" }, "empty mask");

  q.maskType = "pattern";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1", maskType: "pattern" }, "empty pattern");

  q.maskSettings["pattern"] = "9999-9999";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "pattern",
    maskSettings: {
      pattern: "9999-9999"
    }
  }, "set pattern pattern");

  q.maskSettings.saveMaskedValue = true;
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "pattern",
    maskSettings: {
      saveMaskedValue: true,
      pattern: "9999-9999"
    }
  }, "saveMaskedValue pattern");
});

QUnit.test("Deserialize InputMaskPattern properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  jsonObject.toObject({ name: "q1" }, q);
  let maskSettings = q.maskSettings as InputMaskPattern;
  assert.equal(q.maskType, "none");
  assert.equal(maskSettings.getType(), "masksettings");

  jsonObject.toObject({ name: "q1", maskType: "pattern" }, q);
  maskSettings = q.maskSettings as InputMaskPattern;
  assert.equal(q.maskType, "pattern");
  assert.equal(maskSettings.getType(), "patternmask", "patternmask type");
  assert.equal(maskSettings.pattern, undefined, "pattern pattern");
  assert.equal(maskSettings.saveMaskedValue, false, "pattern saveMaskedValue");

  jsonObject.toObject({
    name: "q1",
    maskType: "pattern",
    maskSettings: {
      saveMaskedValue: true,
      pattern: "9999-9999",
    }
  }, q);
  maskSettings = q.maskSettings as InputMaskPattern;
  assert.equal(q.maskType, "pattern");
  assert.equal(maskSettings.getType(), "patternmask", "patternmask type");
  assert.equal(maskSettings.pattern, "9999-9999", "pattern pattern");
  assert.equal(maskSettings.saveMaskedValue, true, "pattern saveMaskedValue");
});