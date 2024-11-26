import { Helpers, createDate } from "../src/helpers";
import { EmailValidator } from "../src/validator";
import { SurveyModel } from "../src/survey";
import { ProcessValue } from "../src/conditionProcessValue";
import { Base } from "../src/base";
import { property } from "../src/jsonobject";
import { settings } from "../src/settings";
import { SurveyError } from "../src/survey-error";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";

export default QUnit.module("Helpers");

QUnit.test("Event hasEvents property", function(assert) {
  assert.ok(Helpers.isArrayContainsEqual([1], [1]), "Arrays are equal");
  assert.notOk(Helpers.isArrayContainsEqual([1], [1, 2]), "Different length");
  assert.notOk(
    Helpers.isArrayContainsEqual([1, 3], [1, 2]),
    "The content of array is not the same"
  );
  assert.ok(
    Helpers.isArrayContainsEqual([2, 1], [1, 2]),
    "The content of array is the same"
  );
  assert.ok(
    Helpers.isArraysEqual([2, 1], [1, 2], true),
    "Ignore Order = true: We believe it is the same arrays"
  );
  assert.notOk(
    Helpers.isArraysEqual([2, 1], [1, 2]),
    "Ignore Order = false: We believe it is not the same arrays"
  );
});
QUnit.test("Helpers.isValueEmpty function", function(assert) {
  assert.equal(Helpers.isValueEmpty(false), false, "false is not empty value");
  assert.equal(Helpers.isValueEmpty(0), false, "0 is not empty value");
  assert.equal(Helpers.isValueEmpty(null), true, "null is empty value");
  assert.equal(Helpers.isValueEmpty(""), true, "empty string is empty value");
  assert.equal(Helpers.isValueEmpty([]), true, "empty array is empty value");
  assert.equal(Helpers.isValueEmpty({}), true, "empty object is empty value");
  assert.equal(
    Helpers.isValueEmpty(new Date()),
    false,
    "date is not empty value"
  );
  assert.equal(
    Helpers.isValueEmpty({ val: "something" }),
    false,
    "the object is not empty"
  );
  assert.equal(
    Helpers.isValueEmpty({ val: false }),
    false,
    "the object is not empty, false"
  );
  assert.equal(
    Helpers.isValueEmpty({ val: "" }),
    true,
    "the object is empty, empty string"
  );
});
QUnit.test("isTwoValueEquals with validators", function(assert) {
  var survey = new SurveyModel();
  var validators1 = [];
  var validator1 = new EmailValidator();
  validator1.errorOwner = survey;
  validator1.text = "en-text";
  validators1.push(validator1);

  var validators2 = [];
  var validator2 = new EmailValidator();
  validator2.errorOwner = survey;
  validator2.text = "en-text";
  validators2.push(validator2);
  survey.locale = "de";
  validator2.text = "de-text";
  assert.equal(
    Helpers.isTwoValueEquals(validators1, validators2),
    false,
    "These two arrays are not equal"
  );
  survey.locale = "";
});

QUnit.test("isTwoValueEquals, undefined", function(assert) {
  assert.equal(
    Helpers.isTwoValueEquals([], undefined),
    true,
    "Empty array equals undefined"
  );

  assert.equal(
    Helpers.isTwoValueEquals(undefined, []),
    true,
    "Undefined equals empty array"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, "undefined"),
    false,
    "undefined vs 'undefined'"
  );
  assert.equal(
    Helpers.isTwoValueEquals("undefined", null),
    false,
    "null vs 'undefined'"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, null),
    true,
    "null vs undefined"
  );
});

QUnit.test("isTwoValueEquals, strings: trim and caseSensitive", function(assert) {
  assert.equal(Helpers.isTwoValueEquals("abc", "abc"), true, "Two simple strings");
  assert.equal(Helpers.isTwoValueEquals("abc ", "abc"), true, "Space case 1");
  assert.equal(Helpers.isTwoValueEquals(" abc", "abc"), true, "Space case 2");
  assert.equal(Helpers.isTwoValueEquals("abc", " abc "), true, "Space case 3");
  assert.equal(Helpers.isTwoValueEquals("Abc", "abc"), true, "CaseSensitive (false) case 1");
  assert.equal(Helpers.isTwoValueEquals("Abc", "aBc"), true, "CaseSensitive (false) case 2");
  assert.equal(Helpers.isTwoValueEquals("abc", "ABC"), true, "CaseSensitive (false) case 3");
  assert.equal(Helpers.isTwoValueEquals("abc ", " ABC"), true, "CaseSensitive and trim");
  assert.equal(Helpers.isTwoValueEquals({ text1: "Text1", text2: "Text2" }, { text1: "text1", text2: "text2" }), true, "CaseSensitive (true) for object");
  settings.comparator.trimStrings = false;
  settings.comparator.caseSensitive = true;
  assert.equal(Helpers.isTwoValueEquals("abc ", "abc"), false, "trimString = false");
  assert.equal(Helpers.isTwoValueEquals("Abc", "abc"), false, "CaseSensitive (true)");
  settings.comparator.trimStrings = true;
  settings.comparator.caseSensitive = false;
});
QUnit.test("isTwoValueEquals, strings: settings.normalizeTextCallback", function(assert) {
  assert.equal(Helpers.isTwoValueEquals("Brouillé", "Brouille"), false, "#1");
  settings.comparator.normalizeTextCallback = (str: string, reason: string): string => {
    return reason === "compare" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""): str;
  };
  assert.equal(Helpers.isTwoValueEquals("Brouillé", "Brouille"), true, "#2");
  settings.comparator.normalizeTextCallback = (str: string, reason: string): string => { return str; };
});

QUnit.test("Return correct value for array.length", function(assert) {
  var process = new ProcessValue();
  assert.equal(
    process.getValue("ar.length", { ar: [1, 2] }),
    2,
    "There are two values in array"
  );
  assert.equal(
    process.getValue("ar.length", { ar: [] }),
    0,
    "Return 0 for empty array"
  );
  assert.equal(
    process.getValue("ar.length", { ar: null }),
    0,
    "Return 0 for null value"
  );
  assert.equal(
    process.getValue("ar.length", {}),
    0,
    "Return 0 for undefined array"
  );
  //Test for bug: #1243
  assert.equal(process.getValue("region", {}), null, "Return null string");
  //Test for bug: https://surveyjs.answerdesk.io/ticket/details/t2558
  assert.equal(
    process.getValue("a.b.c.D", { "a.b": 1, "a.b.c.D": 2 }),
    2,
    "Ignore a.b"
  );
});

QUnit.test("isConvertibleToNumber", function(assert) {
  assert.equal(
    Helpers.isConvertibleToNumber("0"),
    true,
    "Zero is convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(0),
    true,
    "Number is convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(null),
    false,
    "null is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(undefined),
    false,
    "undefined is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber("undefined"),
    false,
    "'undefined' is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber([1]),
    false,
    "array is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(["1"]),
    false,
    "array of string is not convertible to number"
  );
});

QUnit.test("isTwoValueEquals, undefined, null and empty string", function(
  assert
) {
  assert.equal(
    Helpers.isTwoValueEquals(undefined, null),
    true,
    "null and undefined are equals"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, ""),
    true,
    "undefined and empty string are equals"
  );
  assert.equal(
    Helpers.isTwoValueEquals(null, ""),
    true,
    "null and empty string are equals"
  );
});
QUnit.test("isTwoValueEquals, 0 and '0'", function(assert) {
  assert.equal(
    Helpers.isTwoValueEquals(0, "0"),
    true,
    "Zeroes equal as number and text"
  );
  assert.equal(
    Helpers.isTwoValueEquals(0, "0a"),
    false,
    "Zero dosnt' equal '0a'"
  );
  assert.equal(Helpers.isTwoValueEquals(undefined, 0), false, "undefined vs 0");
  assert.equal(
    Helpers.isTwoValueEquals(undefined, "0"),
    false,
    "undefined vs '0'"
  );
  assert.equal(
    Helpers.isTwoValueEquals("undefined", "0"),
    false,
    "'0' vs 'undefined'"
  );
  assert.equal(Helpers.isTwoValueEquals(1, "1"), true, "1 is '1'");
  assert.equal(Helpers.isTwoValueEquals(1.5, "1.5"), true, "1.5 is '1.5'");
  assert.equal(Helpers.isTwoValueEquals(1, "1.5"), false, "1 is not '1.5'");
  assert.equal(Helpers.isTwoValueEquals(2, "1.5"), false, "2 is not '1.5'");
  assert.equal(
    Helpers.isTwoValueEquals(true, "true"),
    true,
    "'true' equals true"
  );
  assert.equal(
    Helpers.isTwoValueEquals(false, "false"),
    true,
    "'false' equals false"
  );
  assert.equal(
    Helpers.isTwoValueEquals("True", true),
    true,
    "'True' equals true"
  );
  assert.equal(
    Helpers.isTwoValueEquals("False", false),
    true,
    "'False' equals false"
  );
  assert.equal(
    Helpers.isTwoValueEquals(null, undefined),
    true,
    "null and undefined"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, null),
    true,
    "undefined and null"
  );
});

QUnit.test(
  "isTwoValueEquals, numbers and string + string and string, Bug# 2000",
  function(assert) {
    assert.equal(Helpers.isTwoValueEquals(10, "10"), true, "10 equals '10'");
    assert.equal(Helpers.isTwoValueEquals(10, "010"), true, "10 equals '010'");
    assert.equal(
      Helpers.isTwoValueEquals("10", "010"),
      false,
      "'10' not equals '010'"
    );
  }
);
QUnit.test("isTwoValueEquals, undefined vs 'undefined', Bug# ", function(
  assert
) {
  assert.equal(
    Helpers.isTwoValueEquals(undefined, "undefined"),
    false,
    "undefined not equals 'undefined'"
  );
});
QUnit.test("isTwoValueEquals, Arrays with empty objects", function(assert) {
  assert.equal(Helpers.isTwoValueEquals([{ a: "a" }], [{ a: "a" }, {}]), false, "arrays are not equal");
});
QUnit.test("isTwoValueEquals, Arrays ignore orders", function(assert) {
  assert.equal(Helpers.isTwoValueEquals([1, 2, 3], [3, 2, 1], true), true, "arrays ignore order");
  assert.equal(Helpers.isTwoValueEquals([1, 2, 3], [3, 2, 1], false), false, "arrays doesn't ignore order");
});
QUnit.test("Helpers.isNumber", function(assert) {
  assert.equal(Helpers.isNumber("1"), true, "1 is a number");
  assert.equal(Helpers.isNumber("0xabcd"), true, "0xabcd is a number");
  assert.equal(Helpers.isNumber("23.3"), true, "23.3 is a number");
  assert.equal(Helpers.isNumber("abcd"), false, "abcd is not a number");
  assert.equal(Helpers.isNumber("0.1"), true, "0.1 is number");
  assert.equal(Helpers.isNumber("0.2"), true, "0.2 is number");
  assert.equal(
    Helpers.isNumber("0xbe0eb53f46cd790cd13851d5eff43d12404d33e8"),
    false,
    "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8 is not a number"
  );
});
QUnit.test("Helpers.getNumber", function(assert) {
  assert.equal(Helpers.getNumber("1"), 1, "1 is a number");
  assert.equal(Helpers.getNumber("23.3"), 23.3, "23.3 is a number");
  assert.equal(Helpers.getNumber("23,3"), 23.3, "23,3 is a number");
  assert.equal(isNaN(Helpers.getNumber("abcd")), true, "abcd is not a number");
  assert.equal(
    isNaN(Helpers.getNumber("0xbe0eb53f46cd790cd13851d5eff43d12404d33e8")),
    true,
    "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8 is not a number"
  );
  assert.equal(Helpers.getNumber("0"), 0, "0 is a number");
  assert.equal(Helpers.getNumber("00"), 0, "0 is a number");
  assert.equal(Helpers.getNumber("0001"), 1, "0001 is a number");
  assert.equal(Helpers.getNumber("0.1"), 0.1, "0.1 is a number");
  assert.equal(Helpers.getNumber("0,1"), 0.1, "0,1 is a number");
  assert.equal(Helpers.getNumber("0x10"), 16, "0x10 is a number");
});
QUnit.test("Helpers.getNumber & settings.parseNumber, #8634", function(assert) {
  const newParseNumber = (stringValue: any, numericValue: number): number => {
    if(typeof stringValue !== "string" || !stringValue) return numericValue;
    if(stringValue.indexOf(",") < 0) return numericValue;
    while(stringValue.indexOf(",") > -1) {
      stringValue = stringValue.replace(",", "");
    }
    return Helpers.getNumber(stringValue);
  };
  const oldCallback = settings.parseNumber;

  assert.equal(isNaN(Helpers.getNumber("1,234,567")), true, "standard behavior");
  settings.parseNumber = newParseNumber;
  assert.equal(Helpers.getNumber("1,234,567"), 1234567, "new behavior");
  settings.parseNumber = oldCallback;
});
QUnit.test("Helpers.getNumberByIndex", function(assert) {
  assert.equal(Helpers.getNumberByIndex(0, "1."), "1.", "0/1.");
  assert.equal(Helpers.getNumberByIndex(2, "1."), "3.", "2/3.");
  assert.equal(Helpers.getNumberByIndex(2, "a)"), "c)", "2/a)");
  assert.equal(Helpers.getNumberByIndex(2, "#1)"), "#3)", "2/#1)");
  assert.equal(Helpers.getNumberByIndex(2, "Q1."), "Q3.", "2/Q1.");
  assert.equal(Helpers.getNumberByIndex(2, "(10)"), "(12)", "2/(10)");
  assert.equal(Helpers.getNumberByIndex(2, "# (a)"), "# (c)", "2/# (a)");
  assert.equal(Helpers.getNumberByIndex(2, "1.2"), "1.4", "2/1.2");
  assert.equal(Helpers.getNumberByIndex(2, "1.2."), "1.4.", "2/1.2.");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11"), "1.2.13", "2/1.2.11");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11."), "1.2.13.", "2/1.2.11.");
  assert.equal(Helpers.getNumberByIndex(2, "1.01"), "1.03", "2/1.02");
  assert.equal(Helpers.getNumberByIndex(2, "01"), "03.", "2/01");
});
QUnit.test("Helpers.getNumberByIndex vs parent", function(assert) {
  assert.equal(Helpers.getNumberByIndex(0, "1.", 2), "1.", "0/1.");
  assert.equal(Helpers.getNumberByIndex(2, "1.", 2), "3.", "2/3.");
  assert.equal(Helpers.getNumberByIndex(2, "a)", 2), "c)", "2/a)");
  assert.equal(Helpers.getNumberByIndex(2, "#1)", 2), "#3)", "2/#1)");
  assert.equal(Helpers.getNumberByIndex(2, "Q1.", 2), "Q3.", "2/Q1.");
  assert.equal(Helpers.getNumberByIndex(2, "(10)", 2), "(12)", "2/(10)");
  assert.equal(Helpers.getNumberByIndex(2, "# (a)", 2), "# (c)", "2/# (a)");
  assert.equal(Helpers.getNumberByIndex(2, "1.2", 2), "3.4", "2/1.2");
  assert.equal(Helpers.getNumberByIndex(2, "3.2.", 2), "5.4.", "2/1.2.");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11", 2), "1.4.13", "2/1.2.11");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11.", 2), "1.4.13.", "2/1.2.11.");
  assert.equal(Helpers.getNumberByIndex(2, "1.01", 2), "3.03", "2/1.02");
  assert.equal(Helpers.getNumberByIndex(2, "01", 2), "03.", "2/01");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11", -1), "1.2.13", "2/1.2.11");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11.", -1), "1.2.13.", "2/1.2.11.");
});
QUnit.test("Helpers.getNumberByIndex", function(assert) {
  assert.equal(Helpers.getRemainingCharacterCounterText("", 10), "0/10", "''/10");
  assert.equal(Helpers.getRemainingCharacterCounterText("abc", 10), "3/10", "'abc'/10");
  assert.equal(Helpers.getRemainingCharacterCounterText(undefined, 10), "0/10", "undefined/10");
});

class ObjectWithDecoratedProperties extends Base {
  @property({ defaultValue: true }) boolPropertyWithDefault: boolean;
  @property() boolPropertyNoDefault: boolean;
  @property({ defaultValue: "test" }) stringPropertyWithDefault: string;
  @property() stringPropertyNoDefault: string;
}

QUnit.test("boolPropertyWithDefault", function(assert) {
  const instance: ObjectWithDecoratedProperties = new ObjectWithDecoratedProperties();
  assert.equal(instance.boolPropertyNoDefault, undefined);
  assert.equal(instance.boolPropertyWithDefault, true);
  assert.equal(instance.stringPropertyNoDefault, undefined);
  assert.equal(instance.stringPropertyWithDefault, "test");

  instance.boolPropertyNoDefault = false;
  instance.boolPropertyWithDefault = false;
  instance.stringPropertyNoDefault = "no default";
  instance.stringPropertyWithDefault = "";

  assert.equal(instance.boolPropertyNoDefault, false);
  assert.equal(instance.boolPropertyWithDefault, false);
  assert.equal(instance.stringPropertyNoDefault, "no default");
  assert.equal(instance.stringPropertyWithDefault, "");

  instance.boolPropertyNoDefault = null;
  instance.boolPropertyWithDefault = true;
  instance.stringPropertyNoDefault = null;
  instance.stringPropertyWithDefault = "text";

  assert.equal(instance.boolPropertyNoDefault, null);
  assert.equal(instance.boolPropertyWithDefault, true);
  assert.equal(instance.stringPropertyNoDefault, null);
  assert.equal(instance.stringPropertyWithDefault, "text");

  instance.boolPropertyNoDefault = true;
  instance.boolPropertyWithDefault = null;
  instance.stringPropertyNoDefault = "hole";
  instance.stringPropertyWithDefault = null;

  assert.equal(instance.boolPropertyNoDefault, true);
  assert.equal(instance.boolPropertyWithDefault, true);
  assert.equal(instance.stringPropertyNoDefault, "hole");
  assert.equal(instance.stringPropertyWithDefault, "test");
});
QUnit.test("isTwoValueEquals compare Base objects", function(assert) {
  var json = {
    elements: [{ type: "text", name: "q1" }],
  };
  var survey1 = new SurveyModel(json);
  var survey2 = new SurveyModel(json);
  assert.equal(
    Helpers.isTwoValueEquals(survey1, survey2),
    true,
    "Two surveys use the same JSON"
  );
  survey1.dispose();
  assert.equal(
    Helpers.isTwoValueEquals(survey1, survey2),
    false,
    "The first survey is disposed"
  );
  survey1 = new SurveyModel(json);
  assert.equal(
    Helpers.isTwoValueEquals(
      survey1.getAllQuestions()[0],
      survey2.getAllQuestions()[0]
    ),
    true,
    "The first survey is disposed"
  );
  survey1.getAllQuestions()[0].name = "q2";
  assert.equal(
    Helpers.isTwoValueEquals(
      survey1.getAllQuestions()[0],
      survey2.getAllQuestions()[0]
    ),
    false,
    "The first survey is disposed"
  );
  assert.equal(
    Helpers.isTwoValueEquals(survey1.pages[0], survey2.getAllQuestions()[0]),
    false,
    "The first survey is disposed"
  );
});
QUnit.test("Check errors", function(assert) {
  const error1 = new SurveyError("Error");
  const error2 = new SurveyError("Error");
  assert.equal(error1.locText.text, "Error");
  assert.equal(Helpers.isTwoValueEquals(error1, error2), true, "Two errors are equal");
  error2.text = "Error #2";
  assert.equal(Helpers.isTwoValueEquals(error1, error2), false, "Two errors are not equal");
});
QUnit.test("Check compareStrings function", function(assert) {
  assert.equal(Helpers.compareStrings("abc", "abc"), 0, "#1");
  assert.equal(Helpers.compareStrings("abc", "abcd"), -1, "#2");
  assert.equal(Helpers.compareStrings("abcd", "abc"), 1, "#3");
  assert.equal(Helpers.compareStrings("", ""), 0, "#4");
  assert.equal(Helpers.compareStrings("a", ""), 1, "#5");
  assert.equal(Helpers.compareStrings("", "a"), -1, "#6");
  assert.equal(Helpers.compareStrings("1 a", "2 b"), -1, "#7");
  assert.equal(Helpers.compareStrings("12 a", "2 b"), 1, "#8");
  assert.equal(Helpers.compareStrings("item 1", "item 2"), -1, "#9");
  assert.equal(Helpers.compareStrings("item 12", "item 2"), 1, "#10");
  assert.equal(Helpers.compareStrings("item 1 abc", "item 2 ed"), -1, "#11");
  assert.equal(Helpers.compareStrings("item 12 ed", "item 2 ed"), 1, "#12");
  assert.equal(Helpers.compareStrings("item1", "item 2"), 1, "#13");
  assert.equal(Helpers.compareStrings("item12", "item 2"), 1, "#14");
  assert.equal(Helpers.compareStrings("401", "60"), 1, "#15");
  assert.equal(Helpers.compareStrings("60", "401"), -1, "#16");

  settings.comparator.normalizeTextCallback = (str: string, reason: string): string => {
    return reason === "compare" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""): str;
  };
  assert.equal(Helpers.compareStrings("Brouillé", "Brouille"), 0, "#17");
  settings.comparator.normalizeTextCallback = (str: string, reason: string): string => { return str; };
});
QUnit.test("convertArrayValueToObject function", function(assert) {
  assert.deepEqual(Helpers.convertArrayValueToObject([1, 2], "name"), [{ name: 1 }, { name: 2 }], "#1");
  assert.deepEqual(Helpers.convertArrayObjectToValue([{ name: 1 }, { name: 2 }], "name"), [1, 2], "#2");
  assert.deepEqual(Helpers.convertArrayValueToObject([1, 2], "name", [{ name: 1, test: 2 }]), [{ name: 1, test: 2 }, { name: 2 }], "#1");
});
QUnit.test("getUnbindValue function", function(assert) {
  assert.deepEqual(Helpers.getUnbindValue(1), 1, "do not convert number");
  const obj = { val: 1 };
  const unbindObj = Helpers.getUnbindValue(obj);
  assert.notStrictEqual(obj, unbindObj, "new objects are not strict equal");
  assert.deepEqual(obj, unbindObj, "objects are deep equal");
  const dateVal = new Date(2004, 5, 7);
  assert.strictEqual(Helpers.getUnbindValue(dateVal), dateVal, "do not convert date");
  const arr = [1, "abc", { val: 1 }];
  const unbindArr = Helpers.getUnbindValue(arr);
  assert.notStrictEqual(arr, unbindArr, "new array are not strict equal");
  assert.notStrictEqual(arr[2], unbindArr[2], "nested object in new array are not strict equal");
  assert.deepEqual(arr, unbindArr, "Arrays are equals");
});
QUnit.test("convertDateToString/convertDateTimeToString functions", function(assert) {
  const d = new Date(2022, 11, 24, 10, 55, 33, 3);
  assert.equal(Helpers.convertDateToString(d), "2022-12-24", "convertDateToString");
  assert.equal(Helpers.convertDateTimeToString(d), "2022-12-24 10:55", "convertDateTimeToString");
});
QUnit.test("sumAnyValues", function(assert) {
  assert.equal(Helpers.sumAnyValues(1, 2), 3, "1 + 2");
  assert.equal(Helpers.sumAnyValues("ab", "cd"), "abcd", "ab + cd");
  assert.equal(Helpers.sumAnyValues("ab", 1), "ab1", "ab + 1");
  assert.deepEqual(Helpers.sumAnyValues([1, 2], [3, 4]), [1, 2, 3, 4], "[1, 2] + [3, 4]");
  assert.equal(Helpers.sumAnyValues([1, 2, 3], 4), 10, "[1, 2, 3] + 10");
  assert.equal(Helpers.sumAnyValues(["a", "b", "c"], " "), "a, b, c ", "['a', 'b', 'c'] + ' '");
  assert.equal(Helpers.sumAnyValues(["a", "b", "c"], ""), "a, b, c", "['a', 'b', 'c'] + ''");
  assert.equal(Helpers.sumAnyValues("0.1", "0.2"), "0.10.2", "'0.1' + '0.2'");
});
QUnit.test("isValueObject", function(assert) {
  assert.equal(Helpers.isValueObject("abc"), false, "abc");
  assert.equal(Helpers.isValueObject("a string", true), false, "a string, exclude array");
  assert.equal(Helpers.isValueObject(1), false, "1");
  assert.equal(Helpers.isValueObject([1]), true, "[1]");
  assert.equal(Helpers.isValueObject([1], true), false, "[1], exclude array");
  assert.equal(Helpers.isValueObject({ a: "abc" }), true, "{ a: 'abc' }");
  assert.equal(Helpers.isValueObject({ a: "abc" }, true), true, "{ a: 'abc' }, exclude array");
});
QUnit.test("base.equals", function(assert) {
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
  assert.equal(Helpers.isTwoValueEquals(q1, q2), false, "#1");
  assert.equal(Helpers.isTwoValueEquals(q1, q3), true, "#2");
  assert.equal(Helpers.isTwoValueEquals(q1, q4), false, "#3");
  assert.equal(Helpers.isTwoValueEquals(q1, q5), false, "#4");
});
QUnit.test("compareVersions", function(assert) {
  assert.equal(Helpers.compareVerions("", ""), 0, "#1");
  assert.equal(Helpers.compareVerions("1", ""), 1, "#2");
  assert.equal(Helpers.compareVerions("", "1"), -1, "#3");
  assert.equal(Helpers.compareVerions("1.2.3", "1.2.3"), 0, "#4");
  assert.equal(Helpers.compareVerions("1.201.31", "1.201.31"), 0, "#5");
  assert.equal(Helpers.compareVerions("1.201.31", "1.90.31"), 1, "#6");
  assert.equal(Helpers.compareVerions("1.90.31", "1.201.31"), -1, "#7");
  assert.equal(Helpers.compareVerions("1", "1.2.3"), -1, "#8");
  assert.equal(Helpers.compareVerions("1.2.3", "1"), 1, "#9");
  assert.equal(Helpers.compareVerions("1.2", "1.2.3"), -1, "#10");
  assert.equal(Helpers.compareVerions("1.2.3", "1.2"), 1, "#11");
});
QUnit.test("createDate & settings.onDateCreated", function(assert) {
  assert.equal(createDate("#1", "2024-10-10").getDate(), 10, "#1");
  let func_val: any = "";
  let func_reason = "";
  settings.onDateCreated = (newDate, reason, val) => {
    func_val = val;
    func_reason = reason;
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };
  assert.equal(createDate("#2", "2024-10-10").getDate(), 11, "#2");
  assert.equal(func_val, "2024-10-10T00:00:00", "val");
  assert.equal(func_reason, "#2", "reason");
  settings.onDateCreated = (date, reason, val) => {
    return date;
  };
  assert.equal(createDate("#3", "2024-10-10").getDate(), 10, "#3");
});
QUnit.test("createDate & T00:00:00 & settings.storeUtcDates", function(assert) {
  let func_val: any = "";
  settings.onDateCreated = (newDate, reason, val) => {
    func_val = val;
    return newDate;
  };
  createDate("#1", "2024-10-10");
  assert.equal(func_val, "2024-10-10T00:00:00", "#1");
  createDate("#2", "2024-10-10T02:00:00");
  assert.equal(func_val, "2024-10-10T02:00:00", "#2");
  createDate("#3", "10/10/2024");
  assert.equal(func_val, "10/10/2024", "#3");

  settings.storeUtcDates = true;
  createDate("#4", "2024-10-10");
  assert.equal(func_val, "2024-10-10", "#4");
  settings.storeUtcDates = false;

  settings.onDateCreated = (date, reason, val) => {
    return date;
  };
});
