import { getMaskedValueByPattern, getUnmaskedValueByPattern, getLiterals, InputMaskPattern } from "../../src/mask/mask_pattern";
import { QuestionTextModel } from "../../src/question_text";
import { JsonObject } from "../../src/jsonobject";
import { settings } from "../../src/settings";

import { describe, test, expect } from "vitest";
describe("Pattern mask", () => {
  const pattern = "+9(999)-999-99-99";

  test("parsingMask simple pattern", () => {
    let result = getLiterals(pattern);
    expect(result.length).toLooseEqual(17);
    expect(result[0].type).toLooseEqual("const");
    expect(result[0].value).toLooseEqual("+");
    expect(result[1].type).toLooseEqual("regex");
    expect(result[1].value).toLooseEqual("9");
    expect(result[2].type).toLooseEqual("const");
    expect(result[2].value).toLooseEqual("(");
    expect(result[3].type).toLooseEqual("regex");
    expect(result[3].value).toLooseEqual("9");
  });

  test("parsingMask with fixed character", () => {
    let result = getLiterals("+\\9(999)-999-99-99");
    expect(result.length).toLooseEqual(17);
    expect(result[0].type).toLooseEqual("const");
    expect(result[0].value).toLooseEqual("+");
    expect(result[1].type).toLooseEqual("fixed");
    expect(result[1].value).toLooseEqual("9");
    expect(result[2].type).toLooseEqual("const");
    expect(result[2].value).toLooseEqual("(");
    expect(result[3].type).toLooseEqual("regex");
    expect(result[3].value).toLooseEqual("9");
  });

  test("parsingMask non-definition characters do not require escape", () => {
    let result = getLiterals("+1(999)-999-99-99");
    expect(result.length).toLooseEqual(17);
    expect(result[0].type, "+ is const (does not match any definition)").toLooseEqual("const");
    expect(result[0].value).toLooseEqual("+");
    expect(result[1].type, "1 is auto-fixed (matches digit definition)").toLooseEqual("fixed");
    expect(result[1].value).toLooseEqual("1");
    expect(result[2].type, "( is const").toLooseEqual("const");
    expect(result[2].value).toLooseEqual("(");
    expect(result[3].type).toLooseEqual("regex");
    expect(result[3].value).toLooseEqual("9");

    result = getLiterals("+\\1(999)-999-99-99");
    expect(result[1].type, "escaped 1 is also fixed").toLooseEqual("fixed");
    expect(result[1].value).toLooseEqual("1");
  });

  test("get masked valid text matchWholeMask = true", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    expect(getMaskedValueByPattern("", pattern, true)).toLooseEqual("+*(***)-***-**-**");
    expect(getMaskedValueByPattern("1", pattern, true)).toLooseEqual("+1(***)-***-**-**");
    expect(getMaskedValueByPattern("1234", pattern, true)).toLooseEqual("+1(234)-***-**-**");
    expect(getMaskedValueByPattern("1234567", pattern, true)).toLooseEqual("+1(234)-567-**-**");
    expect(getMaskedValueByPattern("12345678910", pattern, true)).toLooseEqual("+1(234)-567-89-10");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get masked valid text matchWholeMask = false", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const customMask = "+1(999)-999-99-99";
    expect(getMaskedValueByPattern("", customMask, false)).toLooseEqual("+1(");
    expect(getMaskedValueByPattern("1", customMask, false)).toLooseEqual("+1(");
    expect(getMaskedValueByPattern("8", customMask, false)).toLooseEqual("+1(8");
    expect(getMaskedValueByPattern("+1", customMask, false)).toLooseEqual("+1(");
    expect(getMaskedValueByPattern("+18", customMask, false)).toLooseEqual("+1(8");
    expect(getMaskedValueByPattern("1234", customMask, false)).toLooseEqual("+1(234)-");
    expect(getMaskedValueByPattern("123456", customMask, false)).toLooseEqual("+1(234)-56");
    expect(getMaskedValueByPattern("123456789101", customMask, false)).toLooseEqual("+1(234)-567-89-10");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get masked valid text with fixed character", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const customMask = "+\\9(999)-999-99-99";
    expect(getMaskedValueByPattern("", customMask, true)).toLooseEqual("+9(***)-***-**-**");
    expect(getMaskedValueByPattern("9", customMask, true)).toLooseEqual("+9(***)-***-**-**");
    expect(getMaskedValueByPattern("123", customMask, true)).toLooseEqual("+9(123)-***-**-**");
    expect(getMaskedValueByPattern("9123", customMask, true)).toLooseEqual("+9(123)-***-**-**");
    expect(getMaskedValueByPattern("1234567891", customMask, true)).toLooseEqual("+9(123)-456-78-91");
    expect(getMaskedValueByPattern("9912", customMask, true)).toLooseEqual("+9(912)-***-**-**");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get masked valid text with fixed character in the middle string", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const customMask = "99+1(999)-999";
    expect(getMaskedValueByPattern("", customMask, false)).toLooseEqual("");
    expect(getMaskedValueByPattern("1", customMask, false)).toLooseEqual("1");
    expect(getMaskedValueByPattern("12", customMask, false)).toLooseEqual("12+1(");
    expect(getMaskedValueByPattern("123", customMask, false)).toLooseEqual("12+1(3");
    expect(getMaskedValueByPattern("11123", customMask, false)).toLooseEqual("11+1(23");
    expect(getMaskedValueByPattern("1234567891", customMask, false)).toLooseEqual("12+1(345)-678");
    expect(getMaskedValueByPattern("111123", customMask, false)).toLooseEqual("11+1(123)-");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get masked invalid text", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const resultMaskedText = "+*(***)-***-**-**";
    expect(getMaskedValueByPattern("", pattern, true)).toLooseEqual(resultMaskedText);
    expect(getMaskedValueByPattern("a", pattern, true)).toLooseEqual(resultMaskedText);
    expect(getMaskedValueByPattern("@", pattern, true)).toLooseEqual(resultMaskedText);
    expect(getMaskedValueByPattern(".", pattern, true)).toLooseEqual(resultMaskedText);
    expect(getMaskedValueByPattern("123456789101112", pattern, true)).toLooseEqual("+1(234)-567-89-10");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get masked value by formated text matchWholeMask = true", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    expect(getMaskedValueByPattern("+1***)-***-**-**", pattern, true)).toLooseEqual("+1(***)-***-**-**");
    expect(getMaskedValueByPattern("+1(234)-1***-**-**", pattern, true)).toLooseEqual("+1(234)-1**-**-**");
    expect(getMaskedValueByPattern("+1(234)-1567-89-10", pattern, true)).toLooseEqual("+1(234)-156-78-91");
    expect(getMaskedValueByPattern("+1(234)-67-89-10", pattern, true)).toLooseEqual("+1(234)-678-91-0*");
    expect(getMaskedValueByPattern("+1(2367-89-10", pattern, true)).toLooseEqual("+1(236)-789-10-**");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get masked value by formated text matchWholeMask = false", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const customMask = "+1(999)-999-99-99";
    expect(getMaskedValueByPattern("", customMask, false)).toLooseEqual("+1(");
    expect(getMaskedValueByPattern("+1(234)-1***-**-**", pattern, false)).toLooseEqual("+1(234)-1");
    expect(getMaskedValueByPattern("+1(234)-1567-89-10", pattern, false)).toLooseEqual("+1(234)-156-78-91");
    expect(getMaskedValueByPattern("+1(234)-67-89-10", pattern, false)).toLooseEqual("+1(234)-678-91-0");
    expect(getMaskedValueByPattern("+1(2367-89-10", pattern, false)).toLooseEqual("+1(236)-789-10-");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get unmasked value, matchWholeMask is true", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    expect(getUnmaskedValueByPattern("", pattern, true)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+*(***)-***-**-**", pattern, true)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+1(234)-567-**-**", pattern, true)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+1(234)-567-89-10", pattern, true)).toLooseEqual("12345678910");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get unmasked invalid value, matchWholeMask is true", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    expect(getUnmaskedValueByPattern("+.(***)-***-**-**", pattern, true)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+a(bcd)-567-**-**", pattern, true)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("++(234)-567-89-10", pattern, true)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+1(234)-567-**-10", pattern, true)).toLooseEqual("");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get unmasked value, matchWholeMask is false", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    expect(getUnmaskedValueByPattern("+*(***)-***-**-**", pattern, false)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+1(234)-567-**-**", pattern, false)).toLooseEqual("1234567");
    expect(getUnmaskedValueByPattern("+1(234)-567-89-10", pattern, false)).toLooseEqual("12345678910");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("get unmasked invalid value, matchWholeMask is false", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    expect(getUnmaskedValueByPattern("+.(***)-***-**-**", pattern, false)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+a(bcd)-567-**-**", pattern, false)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("++(234)-567-89-10", pattern, false)).toLooseEqual("");
    expect(getUnmaskedValueByPattern("+1(234)-567-**-10", pattern, false)).toLooseEqual("1234567");
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: insert characters", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "+1(999)-999-99-99";
    let result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("+1(3**)-***-**-**");
    expect(result.caretPosition, "type #1").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 5, selectionEnd: 5, prevValue: "+1(34*)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #2.1").toLooseEqual("+1(345)-***-**-**");
    expect(result.caretPosition, "type #2.1").toLooseEqual(8);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #2.2").toLooseEqual("+1(345)-6**-**-**");
    expect(result.caretPosition, "type #2.2").toLooseEqual(9);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #3").toLooseEqual("+1(345)-***-**-**");
    expect(result.caretPosition, "type #3").toLooseEqual(8);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-678-10-11", inputDirection: "forward" });
    expect(result.value, "type #4").toLooseEqual("+1(345)-967-81-01");
    expect(result.caretPosition, "type #4").toLooseEqual(9);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 8, selectionEnd: 8, prevValue: "+1(345)-678-10-11", inputDirection: "forward" });
    expect(result.value, "type #5").toLooseEqual("+1(345)-678-10-11");
    expect(result.caretPosition, "type #5").toLooseEqual(8);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 17, selectionEnd: 17, prevValue: "+1(345)-678-10-11", inputDirection: "forward" });
    expect(result.value, "type #6").toLooseEqual("+1(345)-678-10-11");
    expect(result.caretPosition, "type #6").toLooseEqual(17);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 9, selectionEnd: 9, prevValue: "+1(123)-467-89-7*", inputDirection: "forward" });
    expect(result.value, "type #7").toLooseEqual("+1(123)-456-78-97");
    expect(result.caretPosition, "type #7").toLooseEqual(10);
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: insert characters into beginning string", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "+1(999)-999-99-99";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("+1(***)-***-**-**");
    expect(result.caretPosition, "type #1").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "+", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #2").toLooseEqual("+1(***)-***-**-**");
    expect(result.caretPosition, "type #2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #3").toLooseEqual("+1(***)-***-**-**");
    expect(result.caretPosition, "type #3").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #4").toLooseEqual("+1(8**)-***-**-**");
    expect(result.caretPosition, "type #4").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "+18", selectionStart: 0, selectionEnd: 0, prevValue: "+1(***)-***-**-**", inputDirection: "forward" });
    expect(result.value, "type #5").toLooseEqual("+1(8**)-***-**-**");
    expect(result.caretPosition, "type #5").toLooseEqual(4);
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: insert characters into middle string", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "99+1(999)-999";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("56+1(***)-***");
    expect(result.caretPosition, "type #1").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "+", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #2").toLooseEqual("56+1(***)-***");
    expect(result.caretPosition, "type #2").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #3").toLooseEqual("56+1(***)-***");
    expect(result.caretPosition, "type #3").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #4").toLooseEqual("56+1(8**)-***");
    expect(result.caretPosition, "type #4").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "+18", selectionStart: 2, selectionEnd: 2, prevValue: "56+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #5").toLooseEqual("56+1(8**)-***");
    expect(result.caretPosition, "type #5").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "**+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #6").toLooseEqual("1*+1(***)-***");
    expect(result.caretPosition, "type #6").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 0, selectionEnd: 0, prevValue: "**+1(***)-***", inputDirection: "forward" });
    expect(result.value, "type #7").toLooseEqual("9*+1(***)-***");
    expect(result.caretPosition, "type #7").toLooseEqual(1);

    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: delete characters", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "+1(999)-999-99-99";
    let result = maskInstance.processInput({ prevValue: "+1(34*)-***-**-**", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "delete 4").toLooseEqual("+1(3**)-***-**-**");
    expect(result.caretPosition, "delete 4").toLooseEqual(4);

    result = maskInstance.processInput({ prevValue: "+1(345)-***-**-**", selectionStart: 5, selectionEnd: 6, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "key delete 5").toLooseEqual("+1(34*)-***-**-**");
    expect(result.caretPosition, "key delete 5").toLooseEqual(5);

    result = maskInstance.processInput({ prevValue: "+1(345)-891-**-**", selectionStart: 10, selectionEnd: 11, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "key delete 1").toLooseEqual("+1(345)-89*-**-**");
    expect(result.caretPosition, "key delete 1").toLooseEqual(10);

    result = maskInstance.processInput({ prevValue: "+1(345)-89*-**-**", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "delete 9 ").toLooseEqual("+1(345)-8**-**-**");
    expect(result.caretPosition, "delete 9").toLooseEqual(9);

    result = maskInstance.processInput({ prevValue: "+1(345)-891-12-15", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "delete 8").toLooseEqual("+1(345)-911-21-5*");
    expect(result.caretPosition, "delete 8").toLooseEqual(8);

    result = maskInstance.processInput({ prevValue: "+1(345)-891-11-12", selectionStart: 16, selectionEnd: 17, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "delete last character").toLooseEqual("+1(345)-891-11-1*");
    expect(result.caretPosition, "delete last character").toLooseEqual(16);

    result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "key delete 4").toLooseEqual("+1(123)-567-89-7*");
    expect(result.caretPosition, "key delete 4").toLooseEqual(8);
    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: delete characters by backspace", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "+1(999)-999-99-99";
    let result = maskInstance.processInput({ prevValue: "+1(34*)-***-**-**", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toLooseEqual("+1(3**)-***-**-**");
    expect(result.caretPosition, "delete 4").toLooseEqual(4);

    result = maskInstance.processInput({ prevValue: "+1(345)-***-**-**", selectionStart: 7, selectionEnd: 8, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "backspace delete - after )").toLooseEqual("+1(345)-***-**-**");
    expect(result.caretPosition, "backspace delete - after )").toLooseEqual(7);

    result = maskInstance.processInput({ prevValue: "+1(345)-891-**-**", selectionStart: 11, selectionEnd: 12, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "backspace delete - after 1").toLooseEqual("+1(345)-891-**-**");
    expect(result.caretPosition, "backspace delete - after 1").toLooseEqual(11);

    result = maskInstance.processInput({ prevValue: "+1(345)-89*-**-**", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 9 ").toLooseEqual("+1(345)-8**-**-**");
    expect(result.caretPosition, "delete 9").toLooseEqual(9);

    result = maskInstance.processInput({ prevValue: "+1(345)-891-12-15", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 8").toLooseEqual("+1(345)-911-21-5*");
    expect(result.caretPosition, "delete 8").toLooseEqual(8);

    result = maskInstance.processInput({ prevValue: "+1(345)-891-11-12", selectionStart: 16, selectionEnd: 17, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete last character").toLooseEqual("+1(345)-891-11-1*");
    expect(result.caretPosition, "delete last character").toLooseEqual(16);

    result = maskInstance.processInput({ prevValue: "+1(***)-***-**-**", selectionStart: 0, selectionEnd: 0, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete first character").toLooseEqual("+1(***)-***-**-**");
    expect(result.caretPosition, "delete first character").toLooseEqual(0);

    result = maskInstance.processInput({ prevValue: "+1(***)-***-**-**", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete +").toLooseEqual("+1(***)-***-**-**");
    expect(result.caretPosition, "delete +").toLooseEqual(0);

    result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 8, selectionEnd: 9, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "key backspace 4").toLooseEqual("+1(123)-567-89-7*");
    expect(result.caretPosition, "key backspace 4").toLooseEqual(8);

    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: cut characters", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "+1(999)-999-99-99";
    let result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 14, insertedChars: null, inputDirection: "forward" });
    expect(result.value, "cut #1").toLooseEqual("+1(123)-497-**-**");
    expect(result.caretPosition, "cut #1").toLooseEqual(9);

    result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 11, insertedChars: "00", inputDirection: "forward" });
    expect(result.value, "cut + paste 2").toLooseEqual("+1(123)-400-78-97");
    expect(result.caretPosition, "cut + paste #2").toLooseEqual(12);

    result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 11, insertedChars: "000", inputDirection: "forward" });
    expect(result.value, "cut + paste 3").toLooseEqual("+1(123)-400-07-89");
    expect(result.caretPosition, "cut + paste #3").toLooseEqual(13);

    result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 8, selectionEnd: 11, insertedChars: "00", inputDirection: "forward" });
    expect(result.value, "cut + paste 4.0").toLooseEqual("+1(123)-007-89-7*");
    expect(result.caretPosition, "cut + paste #4.0").toLooseEqual(10);

    result = maskInstance.processInput({ prevValue: "+1(123)-456-78-97", selectionStart: 9, selectionEnd: 13, insertedChars: "00", inputDirection: "forward" });
    expect(result.value, "cut + paste 4").toLooseEqual("+1(123)-400-89-7*");
    expect(result.caretPosition, "cut + paste #4").toLooseEqual(12);

    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("pattern processInput: cut characters into middle string", () => {
    settings.maskSettings.patternPlaceholderChar = "*";
    const maskInstance = new InputMaskPattern();
    maskInstance.pattern = "99+1(999)-999";
    let result = maskInstance.processInput({ prevValue: "56+1(789)-123", selectionStart: 1, selectionEnd: 6, insertedChars: "2+14", inputDirection: "forward" });
    expect(result.value, "cut #1").toLooseEqual("52+1(489)-123");
    expect(result.caretPosition, "cut #1").toLooseEqual(6);

    result = maskInstance.processInput({ prevValue: "56+1(789)-123", selectionStart: 1, selectionEnd: 6, insertedChars: "000", inputDirection: "forward" });
    expect(result.value, "cut #2").toLooseEqual("50+1(008)-912");
    expect(result.caretPosition, "cut #2").toLooseEqual(7);

    result = maskInstance.processInput({ prevValue: "56+1(789)-123", selectionStart: 0, selectionEnd: 1, insertedChars: "000", inputDirection: "forward" });
    expect(result.value, "cut #3").toLooseEqual("00+1(067)-891");
    expect(result.caretPosition, "cut #3").toLooseEqual(6);

    settings.maskSettings.patternPlaceholderChar = "_";
  });

  test("Serialize InputMaskPattern properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    let json = jsonObject.toJsonObject(q);
    expect(json, "empty mask").toEqualValues({ name: "q1" });

    q.maskType = "pattern";
    json = jsonObject.toJsonObject(q);
    expect(json, "empty pattern").toEqualValues({ name: "q1", maskType: "pattern" });

    q.maskSettings["pattern"] = "9999-9999";
    json = jsonObject.toJsonObject(q);
    expect(json, "set pattern pattern").toEqualValues({
      name: "q1",
      maskType: "pattern",
      maskSettings: {
        pattern: "9999-9999"
      }
    });

    q.maskSettings.saveMaskedValue = true;
    json = jsonObject.toJsonObject(q);
    expect(json, "saveMaskedValue pattern").toEqualValues({
      name: "q1",
      maskType: "pattern",
      maskSettings: {
        saveMaskedValue: true,
        pattern: "9999-9999"
      }
    });
  });

  test("Deserialize InputMaskPattern properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    jsonObject.toObject({ name: "q1" }, q);
    let maskSettings = q.maskSettings as InputMaskPattern;
    expect(q.maskType).toLooseEqual("none");
    expect(maskSettings.getType()).toLooseEqual("masksettings");

    jsonObject.toObject({ name: "q1", maskType: "pattern" }, q);
    maskSettings = q.maskSettings as InputMaskPattern;
    expect(q.maskType).toLooseEqual("pattern");
    expect(maskSettings.getType(), "patternmask type").toLooseEqual("patternmask");
    expect(maskSettings.pattern, "pattern pattern").toLooseEqual(undefined);
    expect(maskSettings.saveMaskedValue, "pattern saveMaskedValue").toLooseEqual(false);

    jsonObject.toObject({
      name: "q1",
      maskType: "pattern",
      maskSettings: {
        saveMaskedValue: true,
        pattern: "9999-9999",
      }
    }, q);
    maskSettings = q.maskSettings as InputMaskPattern;
    expect(q.maskType).toLooseEqual("pattern");
    expect(maskSettings.getType(), "patternmask type").toLooseEqual("patternmask");
    expect(maskSettings.pattern, "pattern pattern").toLooseEqual("9999-9999");
    expect(maskSettings.saveMaskedValue, "pattern saveMaskedValue").toLooseEqual(true);
  });
});
