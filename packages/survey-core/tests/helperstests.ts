import { Helpers, createDate, normalizeTextForSearch } from "../src/helpers";
import { EmailValidator } from "../src/validator";
import { SurveyModel } from "../src/survey";
import { ValueGetter, VariableGetterContext } from "../src/conditions/conditionProcessValue";
import { Base } from "../src/base";
import { property } from "../src/decorators";
import { settings } from "../src/settings";
import { SurveyError } from "../src/survey-error";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";

import { describe, test, expect } from "vitest";
describe("Helpers", () => {
  test("Event hasEvents property", () => {
    expect(Helpers.isArrayContainsEqual([1], [1]), "Arrays are equal").toBeTruthy();
    expect(Helpers.isArrayContainsEqual([1], [1, 2]), "Different length").toBeFalsy();
    expect(Helpers.isArrayContainsEqual([1, 3], [1, 2]), "The content of array is not the same").toBeFalsy();
    expect(Helpers.isArrayContainsEqual([2, 1], [1, 2]), "The content of array is the same").toBeTruthy();
    expect(Helpers.isArraysEqual([2, 1], [1, 2], true), "Ignore Order = true: We believe it is the same arrays").toBeTruthy();
    expect(Helpers.isArraysEqual([2, 1], [1, 2]), "Ignore Order = false: We believe it is not the same arrays").toBeFalsy();
  });
  test("Helpers.isValueEmpty function", () => {
    expect(Helpers.isValueEmpty(false), "false is not empty value").toBe(false);
    expect(Helpers.isValueEmpty(0), "0 is not empty value").toBe(false);
    expect(Helpers.isValueEmpty(null), "null is empty value").toBe(true);
    expect(Helpers.isValueEmpty(""), "empty string is empty value").toBe(true);
    expect(Helpers.isValueEmpty([]), "empty array is empty value").toBe(true);
    expect(Helpers.isValueEmpty({}), "empty object is empty value").toBe(true);
    expect(Helpers.isValueEmpty(new Date()), "date is not empty value").toBe(false);
    expect(Helpers.isValueEmpty({ val: "something" }), "the object is not empty").toBe(false);
    expect(Helpers.isValueEmpty({ val: false }), "the object is not empty, false").toBe(false);
    expect(Helpers.isValueEmpty({ val: "" }), "the object is empty, empty string").toBe(true);
  });
  test("isTwoValueEquals with validators", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const question = page.addNewQuestion("text", "q1");
    const validators1 = [];
    const validator1 = new EmailValidator();
    validator1.errorOwner = question;
    validator1.text = "en-text";
    validators1.push(validator1);

    const validators2 = [];
    const validator2 = new EmailValidator();
    validator2.errorOwner = question;
    validator2.text = "en-text";
    validators2.push(validator2);
    survey.locale = "de";
    validator2.text = "de-text";
    expect(Helpers.isTwoValueEquals(validators1, validators2), "These two arrays are not equal").toBe(false);
    survey.locale = "";
  });

  test("isTwoValueEquals, undefined", () => {
    expect(Helpers.isTwoValueEquals([], undefined), "Empty array equals undefined").toBe(true);

    expect(Helpers.isTwoValueEquals(undefined, []), "Undefined equals empty array").toBe(true);
    expect(Helpers.isTwoValueEquals(undefined, "undefined"), "undefined vs 'undefined'").toBe(false);
    expect(Helpers.isTwoValueEquals("undefined", null), "null vs 'undefined'").toBe(false);
    expect(Helpers.isTwoValueEquals(undefined, null), "null vs undefined").toBe(true);
  });

  test("isTwoValueEquals, strings: trim and caseSensitive", () => {
    expect(Helpers.isTwoValueEquals("abc", "abc"), "Two simple strings").toBe(true);
    expect(Helpers.isTwoValueEquals("abc ", "abc"), "Space case 1").toBe(true);
    expect(Helpers.isTwoValueEquals(" abc", "abc"), "Space case 2").toBe(true);
    expect(Helpers.isTwoValueEquals("abc", " abc "), "Space case 3").toBe(true);
    expect(Helpers.isTwoValueEquals("Abc", "abc"), "CaseSensitive (false) case 1").toBe(true);
    expect(Helpers.isTwoValueEquals("Abc", "aBc"), "CaseSensitive (false) case 2").toBe(true);
    expect(Helpers.isTwoValueEquals("abc", "ABC"), "CaseSensitive (false) case 3").toBe(true);
    expect(Helpers.isTwoValueEquals("abc ", " ABC"), "CaseSensitive and trim").toBe(true);
    expect(Helpers.isTwoValueEquals({ text1: "Text1", text2: "Text2" }, { text1: "text1", text2: "text2" }), "CaseSensitive (true) for object").toBe(true);
    settings.comparator.trimStrings = false;
    settings.comparator.caseSensitive = true;
    expect(Helpers.isTwoValueEquals("abc ", "abc"), "trimString = false").toBe(false);
    expect(Helpers.isTwoValueEquals("Abc", "abc"), "CaseSensitive (true)").toBe(false);
    settings.comparator.trimStrings = true;
    settings.comparator.caseSensitive = false;
  });
  test("isTwoValueEquals, strings: settings.normalizeTextCallback", () => {
    expect(Helpers.isTwoValueEquals("Brouillé", "Brouille"), "#1").toBe(false); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    settings.comparator.normalizeTextCallback = (str: string, reason: string): string => {
      return reason === "compare" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : str;
    };
    expect(Helpers.isTwoValueEquals("Brouillé", "Brouille"), "#2").toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    settings.comparator.normalizeTextCallback = (str: string, reason: string): string => { return str; };
  });
  test("normalizeTextForSearch supports ASCII and Turkish dotted i search", () => {
    expect(normalizeTextForSearch("ADIYAMAN"), "#1").toBe("adiyaman");
    expect(normalizeTextForSearch("adi"), "#2").toBe("adi");
    expect(normalizeTextForSearch("adı"), "#3").toBe("adi"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  });

  test("Return correct value for array.length", () => {
    var valueGetter = new ValueGetter();
    expect(valueGetter.getValueInfo({ name: "ar.length", context: new VariableGetterContext({ ar: [1, 2] }) }).value, "There are two values in array").toBe(2);
    expect(valueGetter.getValueInfo({ name: "ar.length", context: new VariableGetterContext({ ar: [] }) }).value, "Return 0 for empty array").toBe(0);
    expect(valueGetter.getValueInfo({ name: "ar.length", context: new VariableGetterContext({ ar: null }) }).value, "Return 0 for null value").toBe(0);
    expect(valueGetter.getValueInfo({ name: "ar.length", context: new VariableGetterContext({}) }).value, "Return 0 for undefined array").toBe(0);
    //Test for bug: #1243
    expect(valueGetter.getValueInfo({ name: "region", context: new VariableGetterContext({}) }).value, "Return null string").toBeUndefined();
    //Test for bug: https://surveyjs.answerdesk.io/ticket/details/t2558
    expect(valueGetter.getValueInfo({ name: "a.b.c.D", context: new VariableGetterContext({ "a.b": 1, "a.b.c.D": 2 }) }).value, "Ignore a.b").toBe(2);
  });

  test("isConvertibleToNumber", () => {
    expect(Helpers.isConvertibleToNumber("0"), "Zero is convertible to number").toBe(true);
    expect(Helpers.isConvertibleToNumber(0), "Number is convertible to number").toBe(true);
    expect(Helpers.isConvertibleToNumber(null), "null is not convertible to number").toBe(false);
    expect(Helpers.isConvertibleToNumber(undefined), "undefined is not convertible to number").toBe(false);
    expect(Helpers.isConvertibleToNumber("undefined"), "'undefined' is not convertible to number").toBe(false);
    expect(Helpers.isConvertibleToNumber([1]), "array is not convertible to number").toBe(false);
    expect(Helpers.isConvertibleToNumber(["1"]), "array of string is not convertible to number").toBe(false);
  });

  test("isTwoValueEquals, undefined, null and empty string", () => {
    expect(Helpers.isTwoValueEquals(undefined, null), "null and undefined are equals").toBe(true);
    expect(Helpers.isTwoValueEquals(undefined, ""), "undefined and empty string are equals").toBe(true);
    expect(Helpers.isTwoValueEquals(null, ""), "null and empty string are equals").toBe(true);
  });
  test("isTwoValueEquals, 0 and '0'", () => {
    expect(Helpers.isTwoValueEquals(0, "0"), "Zeroes equal as number and text").toBe(true);
    expect(Helpers.isTwoValueEquals(0, "0a"), "Zero dosnt' equal '0a'").toBe(false);
    expect(Helpers.isTwoValueEquals(undefined, 0), "undefined vs 0").toBe(false);
    expect(Helpers.isTwoValueEquals(undefined, "0"), "undefined vs '0'").toBe(false);
    expect(Helpers.isTwoValueEquals("undefined", "0"), "'0' vs 'undefined'").toBe(false);
    expect(Helpers.isTwoValueEquals(1, "1"), "1 is '1'").toBe(true);
    expect(Helpers.isTwoValueEquals(1.5, "1.5"), "1.5 is '1.5'").toBe(true);
    expect(Helpers.isTwoValueEquals(1, "1.5"), "1 is not '1.5'").toBe(false);
    expect(Helpers.isTwoValueEquals(2, "1.5"), "2 is not '1.5'").toBe(false);
    expect(Helpers.isTwoValueEquals(true, "true"), "'true' equals true").toBe(true);
    expect(Helpers.isTwoValueEquals(false, "false"), "'false' equals false").toBe(true);
    expect(Helpers.isTwoValueEquals("True", true), "'True' equals true").toBe(true);
    expect(Helpers.isTwoValueEquals("False", false), "'False' equals false").toBe(true);
    expect(Helpers.isTwoValueEquals(null, undefined), "null and undefined").toBe(true);
    expect(Helpers.isTwoValueEquals(undefined, null), "undefined and null").toBe(true);
  });
  test("isTwoValueEquals/checkIfValuesEqual, numbers and string, Bug# 9690", () => {
    expect(Helpers.isTwoValueEquals(10, "10"), "10 equals '10', #1").toBe(true);
    expect(Helpers.checkIfValuesEqual(10, "10", {}), "10 equals '10, #2").toBe(true);
    expect(Helpers.checkIfValuesEqual(10, "10", { doNotConvertNumbers: true }), "10 doesn't equal '10', #3").toBe(false);
  });
  test("isTwoValueEquals, numbers and string + string and string, Bug# 2000", () => {
    expect(Helpers.isTwoValueEquals(10, "10"), "10 equals '10'").toBe(true);
    expect(Helpers.isTwoValueEquals(10, "010"), "10 equals '010'").toBe(true);
    expect(Helpers.isTwoValueEquals("10", "010"), "'10' not equals '010'").toBe(false);
  });
  test("isTwoValueEquals, undefined vs 'undefined', Bug# ", () => {
    expect(Helpers.isTwoValueEquals(undefined, "undefined"), "undefined not equals 'undefined'").toBe(false);
  });
  test("isTwoValueEquals, Arrays with empty objects", () => {
    expect(Helpers.isTwoValueEquals([{ a: "a" }], [{ a: "a" }, {}]), "arrays are not equal").toBe(false);
  });
  test("isTwoValueEquals, Arrays ignore orders", () => {
    expect(Helpers.isTwoValueEquals([1, 2, 3], [3, 2, 1], true), "arrays ignore order").toBe(true);
    expect(Helpers.isTwoValueEquals([1, 2, 3], [3, 2, 1], false), "arrays doesn't ignore order").toBe(false);
  });
  test("Helpers.isNumber", () => {
    expect(Helpers.isNumber("1"), "1 is a number").toBe(true);
    expect(Helpers.isNumber("0xabcd"), "0xabcd is a number").toBe(true);
    expect(Helpers.isNumber("23.3"), "23.3 is a number").toBe(true);
    expect(Helpers.isNumber("abcd"), "abcd is not a number").toBe(false);
    expect(Helpers.isNumber("0.1"), "0.1 is number").toBe(true);
    expect(Helpers.isNumber("0.2"), "0.2 is number").toBe(true);
    expect(Helpers.isNumber("0xbe0eb53f46cd790cd13851d5eff43d12404d33e8"), "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8 is not a number").toBe(false);
  });
  test("Helpers.getNumber", () => {
    expect(Helpers.getNumber("1"), "1 is a number").toBe(1);
    expect(Helpers.getNumber("23.3"), "23.3 is a number").toBe(23.3);
    expect(Helpers.getNumber("23,3"), "23,3 is a number").toBe(23.3);
    expect(isNaN(Helpers.getNumber("abcd")), "abcd is not a number").toBe(true);
    expect(isNaN(Helpers.getNumber("0xbe0eb53f46cd790cd13851d5eff43d12404d33e8")), "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8 is not a number").toBe(true);
    expect(Helpers.getNumber("0"), "0 is a number").toBe(0);
    expect(Helpers.getNumber("00"), "0 is a number").toBe(0);
    expect(Helpers.getNumber("0001"), "0001 is a number").toBe(1);
    expect(Helpers.getNumber("0.1"), "0.1 is a number").toBe(0.1);
    expect(Helpers.getNumber("0,1"), "0,1 is a number").toBe(0.1);
    expect(Helpers.getNumber("0x10"), "0x10 is a number").toBe(16);
  });
  test("Helpers.getNumber & settings.parseNumber, #8634", () => {
    const newParseNumber = (stringValue: any, numericValue: number): number => {
      if (typeof stringValue !== "string" || !stringValue) return numericValue;
      if (stringValue.indexOf(",") < 0) return numericValue;
      while(stringValue.indexOf(",") > -1) {
        stringValue = stringValue.replace(",", "");
      }
      return Helpers.getNumber(stringValue);
    };
    const oldCallback = settings.parseNumber;

    expect(isNaN(Helpers.getNumber("1,234,567")), "standard behavior").toBe(true);
    settings.parseNumber = newParseNumber;
    expect(Helpers.getNumber("1,234,567"), "new behavior").toBe(1234567);
    settings.parseNumber = oldCallback;
  });
  test("Helpers.getNumberByIndex", () => {
    expect(Helpers.getNumberByIndex(0, "1."), "0/1.").toBe("1.");
    expect(Helpers.getNumberByIndex(2, "1."), "2/3.").toBe("3.");
    expect(Helpers.getNumberByIndex(2, "a)"), "2/a)").toBe("c)");
    expect(Helpers.getNumberByIndex(2, "#1)"), "2/#1)").toBe("#3)");
    expect(Helpers.getNumberByIndex(2, "Q1."), "2/Q1.").toBe("Q3.");
    expect(Helpers.getNumberByIndex(2, "(10)"), "2/(10)").toBe("(12)");
    expect(Helpers.getNumberByIndex(2, "# (a)"), "2/# (a)").toBe("# (c)");
    expect(Helpers.getNumberByIndex(2, "1.2"), "2/1.2").toBe("1.4");
    expect(Helpers.getNumberByIndex(2, "1.2."), "2/1.2.").toBe("1.4.");
    expect(Helpers.getNumberByIndex(2, "1.2.11"), "2/1.2.11").toBe("1.2.13");
    expect(Helpers.getNumberByIndex(2, "1.2.11."), "2/1.2.11.").toBe("1.2.13.");
    expect(Helpers.getNumberByIndex(2, "1.01"), "2/1.02").toBe("1.03");
    expect(Helpers.getNumberByIndex(2, "01"), "2/01").toBe("03");
    expect(Helpers.getNumberByIndex(2, "01."), "2/02").toBe("03.");
  });
  test("Helpers.getNumberByIndex vs parent", () => {
    expect(Helpers.getNumberByIndex(0, "1.", 2), "0/1.").toBe("1.");
    expect(Helpers.getNumberByIndex(2, "1.", 2), "2/3.").toBe("3.");
    expect(Helpers.getNumberByIndex(2, "a)", 2), "2/a)").toBe("c)");
    expect(Helpers.getNumberByIndex(2, "#1)", 2), "2/#1)").toBe("#3)");
    expect(Helpers.getNumberByIndex(2, "Q1.", 2), "2/Q1.").toBe("Q3.");
    expect(Helpers.getNumberByIndex(2, "(10)", 2), "2/(10)").toBe("(12)");
    expect(Helpers.getNumberByIndex(2, "# (a)", 2), "2/# (a)").toBe("# (c)");
    expect(Helpers.getNumberByIndex(2, "1.2", 2), "2/1.2").toBe("3.4");
    expect(Helpers.getNumberByIndex(2, "3.2.", 2), "2/1.2.").toBe("5.4.");
    expect(Helpers.getNumberByIndex(2, "1.2.11", 2), "2/1.2.11").toBe("1.4.13");
    expect(Helpers.getNumberByIndex(2, "1.2.11.", 2), "2/1.2.11.").toBe("1.4.13.");
    expect(Helpers.getNumberByIndex(2, "1.01", 2), "2/1.02").toBe("3.03");
    expect(Helpers.getNumberByIndex(2, "01", 2), "2/01").toBe("03");
    expect(Helpers.getNumberByIndex(2, "01.", 2), "2/02").toBe("03.");
    expect(Helpers.getNumberByIndex(2, "1.2.11", -1), "2/1.2.11").toBe("1.2.13");
    expect(Helpers.getNumberByIndex(2, "1.2.11.", -1), "2/1.2.11.").toBe("1.2.13.");
  });
  test("Helpers.getNumberByIndex", () => {
    expect(Helpers.getRemainingCharacterCounterText("", 10), "''/10").toBe("0/10");
    expect(Helpers.getRemainingCharacterCounterText("abc", 10), "'abc'/10").toBe("3/10");
    expect(Helpers.getRemainingCharacterCounterText(undefined, 10), "undefined/10").toBe("0/10");
  });

  class ObjectWithDecoratedProperties extends Base {
  @property({ defaultValue: true }) boolPropertyWithDefault: boolean;
  @property() boolPropertyNoDefault: boolean;
  @property({ defaultValue: "test" }) stringPropertyWithDefault: string;
  @property() stringPropertyNoDefault: string;
  }

  test("boolPropertyWithDefault", () => {
    const instance: ObjectWithDecoratedProperties = new ObjectWithDecoratedProperties();
    expect(instance.boolPropertyNoDefault).toBeUndefined();
    expect(instance.boolPropertyWithDefault).toBe(true);
    expect(instance.stringPropertyNoDefault).toBeUndefined();
    expect(instance.stringPropertyWithDefault).toBe("test");

    instance.boolPropertyNoDefault = false;
    instance.boolPropertyWithDefault = false;
    instance.stringPropertyNoDefault = "no default";
    instance.stringPropertyWithDefault = "";

    expect(instance.boolPropertyNoDefault).toBe(false);
    expect(instance.boolPropertyWithDefault).toBe(false);
    expect(instance.stringPropertyNoDefault).toBe("no default");
    expect(instance.stringPropertyWithDefault).toBe("");

    instance.boolPropertyNoDefault = null;
    instance.boolPropertyWithDefault = true;
    instance.stringPropertyNoDefault = null;
    instance.stringPropertyWithDefault = "text";

    expect(instance.boolPropertyNoDefault).toBeNull();
    expect(instance.boolPropertyWithDefault).toBe(true);
    expect(instance.stringPropertyNoDefault).toBeNull();
    expect(instance.stringPropertyWithDefault).toBe("text");

    instance.boolPropertyNoDefault = true;
    instance.boolPropertyWithDefault = null;
    instance.stringPropertyNoDefault = "hole";
    instance.stringPropertyWithDefault = null;

    expect(instance.boolPropertyNoDefault).toBe(true);
    expect(instance.boolPropertyWithDefault).toBe(true);
    expect(instance.stringPropertyNoDefault).toBe("hole");
    expect(instance.stringPropertyWithDefault).toBe("test");
  });
  test("isTwoValueEquals compare Base objects", () => {
    var json = {
      elements: [{ type: "text", name: "q1" }],
    };
    var survey1 = new SurveyModel(json);
    var survey2 = new SurveyModel(json);
    expect(Helpers.isTwoValueEquals(survey1, survey2), "Two surveys use the same JSON").toBe(true);
    survey1.dispose();
    expect(Helpers.isTwoValueEquals(survey1, survey2), "The first survey is disposed").toBe(false);
    survey1 = new SurveyModel(json);
    expect(Helpers.isTwoValueEquals(
      survey1.getAllQuestions()[0],
      survey2.getAllQuestions()[0]
    ), "The first survey is disposed").toBe(true);
    survey1.getAllQuestions()[0].name = "q2";
    expect(Helpers.isTwoValueEquals(
      survey1.getAllQuestions()[0],
      survey2.getAllQuestions()[0]
    ), "The first survey is disposed").toBe(false);
    expect(Helpers.isTwoValueEquals(survey1.pages[0], survey2.getAllQuestions()[0]), "The first survey is disposed").toBe(false);
  });
  test("Check errors", () => {
    const error1 = new SurveyError("Error");
    const error2 = new SurveyError("Error");
    expect(error1.locText.text).toBe("Error");
    expect(Helpers.isTwoValueEquals(error1, error2), "Two errors are equal").toBe(true);
    error2.text = "Error #2";
    expect(Helpers.isTwoValueEquals(error1, error2), "Two errors are not equal").toBe(false);
  });
  test("Check compareStrings function", () => {
    expect(Helpers.compareStrings("abc", "abc"), "#1").toBe(0);
    expect(Helpers.compareStrings("abc", "abcd"), "#2").toBe(-1);
    expect(Helpers.compareStrings("abcd", "abc"), "#3").toBe(1);
    expect(Helpers.compareStrings("", ""), "#4").toBe(0);
    expect(Helpers.compareStrings("a", ""), "#5").toBe(1);
    expect(Helpers.compareStrings("", "a"), "#6").toBe(-1);
    expect(Helpers.compareStrings("1 a", "2 b"), "#7").toBe(-1);
    expect(Helpers.compareStrings("12 a", "2 b"), "#8").toBe(1);
    expect(Helpers.compareStrings("item 1", "item 2"), "#9").toBe(-1);
    expect(Helpers.compareStrings("item 12", "item 2"), "#10").toBe(1);
    expect(Helpers.compareStrings("item 1 abc", "item 2 ed"), "#11").toBe(-1);
    expect(Helpers.compareStrings("item 12 ed", "item 2 ed"), "#12").toBe(1);
    expect(Helpers.compareStrings("item1", "item 2"), "#13").toBe(1);
    expect(Helpers.compareStrings("item12", "item 2"), "#14").toBe(1);
    expect(Helpers.compareStrings("401", "60"), "#15").toBe(1);
    expect(Helpers.compareStrings("60", "401"), "#16").toBe(-1);

    settings.comparator.normalizeTextCallback = (str: string, reason: string): string => {
      return reason === "compare" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : str;
    };
    expect(Helpers.compareStrings("Brouillé", "Brouille"), "#17").toBe(0); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    settings.comparator.normalizeTextCallback = (str: string, reason: string): string => { return str; };
  });
  test("getUnbindValue function", () => {
    expect(Helpers.getUnbindValue(1), "do not convert number").toEqual(1);
    const obj = { val: 1 };
    const unbindObj = Helpers.getUnbindValue(obj);
    expect(obj, "new objects are not strict equal").not.toBe(unbindObj);
    expect(obj, "objects are deep equal").toEqual(unbindObj);
    const dateVal = new Date(2004, 5, 7);
    expect(Helpers.getUnbindValue(dateVal), "do not convert date").toBe(dateVal);
    const arr = [1, "abc", { val: 1 }];
    const unbindArr = Helpers.getUnbindValue(arr);
    expect(arr, "new array are not strict equal").not.toBe(unbindArr);
    expect(arr[2], "nested object in new array are not strict equal").not.toBe(unbindArr[2]);
    expect(arr, "Arrays are equals").toEqual(unbindArr);
  });
  test("convertDateToString/convertDateTimeToString functions", () => {
    const d = new Date(2022, 11, 24, 10, 55, 33, 3);
    expect(Helpers.convertDateToString(d), "convertDateToString").toBe("2022-12-24");
    expect(Helpers.convertDateTimeToString(d), "convertDateTimeToString").toBe("2022-12-24 10:55");
    expect(Helpers.convertDateTimeToString(d, true), "convertDateTimeToString, isLocalIso").toBe("2022-12-24T10:55");
  });
  test("sumAnyValues", () => {
    expect(Helpers.sumAnyValues(1, 2), "1 + 2").toBe(3);
    expect(Helpers.sumAnyValues("ab", "cd"), "ab + cd").toBe("abcd");
    expect(Helpers.sumAnyValues("ab", 1), "ab + 1").toBe("ab1");
    expect(Helpers.sumAnyValues([1, 2], [3, 4]), "[1, 2] + [3, 4]").toEqual([1, 2, 3, 4]);
    expect(Helpers.sumAnyValues([1, 2, 3], 4), "[1, 2, 3] + 10").toBe(10);
    expect(Helpers.sumAnyValues(["a", "b", "c"], " "), "['a', 'b', 'c'] + ' '").toBe("a, b, c ");
    expect(Helpers.sumAnyValues(["a", "b", "c"], ""), "['a', 'b', 'c'] + ''").toBe("a, b, c");
    expect(Helpers.sumAnyValues("0.1", "0.2"), "'0.1' + '0.2'").toBe("0.10.2");
  });
  test("isValueObject", () => {
    expect(Helpers.isValueObject("abc"), "abc").toBe(false);
    expect(Helpers.isValueObject("a string", true), "a string, exclude array").toBe(false);
    expect(Helpers.isValueObject(1), "1").toBe(false);
    expect(Helpers.isValueObject([1]), "[1]").toBe(true);
    expect(Helpers.isValueObject([1], true), "[1], exclude array").toBe(false);
    expect(Helpers.isValueObject({ a: "abc" }), "{ a: 'abc' }").toBe(true);
    expect(Helpers.isValueObject({ a: "abc" }, true), "{ a: 'abc' }, exclude array").toBe(true);
  });
  test("base.equals", () => {
    const q1 = new QuestionTextModel("q1");
    q1.title = "title1";
    const q2 = new QuestionTextModel("q1");
    q2.title = "title2";
    const q3 = new QuestionTextModel("q1");
    q3.title = "title1";
    const q4 = new QuestionTextModel("q2");
    q4.title = "title1";
    const q5 = new QuestionCommentModel("q1");
    q5.title = "title1";
    expect(Helpers.isTwoValueEquals(q1, q2), "#1").toBe(false);
    expect(Helpers.isTwoValueEquals(q1, q3), "#2").toBe(true);
    expect(Helpers.isTwoValueEquals(q1, q4), "#3").toBe(false);
    expect(Helpers.isTwoValueEquals(q1, q5), "#4").toBe(false);
  });
  test("compareVersions", () => {
    expect(Helpers.compareVerions("", ""), "#1").toBe(0);
    expect(Helpers.compareVerions("1", ""), "#2").toBe(1);
    expect(Helpers.compareVerions("", "1"), "#3").toBe(-1);
    expect(Helpers.compareVerions("1.2.3", "1.2.3"), "#4").toBe(0);
    expect(Helpers.compareVerions("1.201.31", "1.201.31"), "#5").toBe(0);
    expect(Helpers.compareVerions("1.201.31", "1.90.31"), "#6").toBe(1);
    expect(Helpers.compareVerions("1.90.31", "1.201.31"), "#7").toBe(-1);
    expect(Helpers.compareVerions("1", "1.2.3"), "#8").toBe(-1);
    expect(Helpers.compareVerions("1.2.3", "1"), "#9").toBe(1);
    expect(Helpers.compareVerions("1.2", "1.2.3"), "#10").toBe(-1);
    expect(Helpers.compareVerions("1.2.3", "1.2"), "#11").toBe(1);
  });
  test("createDate & settings.onDateCreated", () => {
    expect(createDate("#1", "2024-10-10").getDate(), "#1").toBe(10);
    let func_val: any = "";
    let func_reason = "";
    settings.onDateCreated = (newDate, reason, val) => {
      func_val = val;
      func_reason = reason;
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    };
    expect(createDate("#2", "2024-10-10").getDate(), "#2").toBe(11);
    expect(func_val, "val").toBe("2024-10-10T00:00:00");
    expect(func_reason, "reason").toBe("#2");
    settings.onDateCreated = (date, reason, val) => {
      return date;
    };
    expect(createDate("#3", "2024-10-10").getDate(), "#3").toBe(10);
  });
  test("createDate & T00:00:00 & settings.storeUtcDates", () => {
    let func_val: any = "";
    settings.onDateCreated = (newDate, reason, val) => {
      func_val = val;
      return newDate;
    };
    createDate("#1", "2024-10-10");
    expect(func_val, "#1").toBe("2024-10-10T00:00:00");
    createDate("#2", "2024-10-10T02:00:00");
    expect(func_val, "#2").toBe("2024-10-10T02:00:00");
    createDate("#3", "10/10/2024");
    expect(func_val, "#3").toBe("10/10/2024");

    settings.storeUtcDates = true;
    createDate("#4", "2024-10-10");
    expect(func_val, "#4").toBe("2024-10-10");
    settings.storeUtcDates = false;

    settings.onDateCreated = (date, reason, val) => {
      return date;
    };
  });

  test("randomizeArray with seed", () => {
    const data = [
      { uniqueId: 1 },
      { uniqueId: 2 },
      { uniqueId: 3 },
      { uniqueId: 4 },
      { uniqueId: 5 },
    ];

    let result = Helpers.randomizeArray(data, 12345);
    expect(result.map(item => item.uniqueId), "The array is randomized in the expected way").toEqual([1, 3, 4, 2, 5]);

    result = Helpers.randomizeArray(result, 12345);
    expect(result.map(item => item.uniqueId), "Randomize already randomized array with the same seed gives the same result").toEqual([1, 3, 4, 2, 5]);

    result = Helpers.randomizeArray(result, 123456);
    expect(result.map(item => item.uniqueId), "Randomize already randomized array with a different seed gives a different result").not.toEqual([1, 3, 4, 2, 5]);
  });
});
