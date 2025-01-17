import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";
import { SurveyModel } from "../src/survey";
import { QuestionTextBase, CharacterCounter } from "../src/question_textbase";
import { settings } from "../src/settings";
import { InputMaskPattern } from "../src/mask/mask_pattern";
import { FunctionFactory } from "../src/functionsfactory";
export * from "../src/localization/german";

QUnit.test("check text disabled class", function (assert) {
  var json = {
    questions: [
      {
        name: "q1",
        type: "text",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionTextModel>survey.getAllQuestions()[0];
  question.cssClasses.controlReadOnly = "sv_q_text_disabled";
  assert.ok(question.getControlClass().indexOf("sv_q_text_disabled") == -1);
  question.readOnly = true;
  assert.ok(question.getControlClass().indexOf("sv_q_text_disabled") != -1);
});
QUnit.test("Test renderedPlaceholder", function(assert) {
  var json = {
    questions: [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "comment",
        placeHolder: "comment_2",
        name: "q2",
      },
      {
        type: "text",
        placeHolder: "text_3",
        readOnly: true,
        name: "q3",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionTextModel>survey.getAllQuestions()[0];
  const q2 = <QuestionCommentModel>survey.getAllQuestions()[1];
  const q3 = <QuestionTextModel>survey.getAllQuestions()[2];
  assert.notOk(q1.renderedPlaceholder, "q1, there is no placeHolder");
  assert.equal(q2.renderedPlaceholder, "comment_2", "q2 has placeHolder");
  assert.notOk(q3.renderedPlaceholder, "q3, question is readOnly");
  q2.readOnly = true;
  assert.notOk(q2.renderedPlaceholder, "q2, question is readOnly");
  q3.readOnly = false;
  assert.equal(q3.renderedPlaceholder, "text_3", "q3 is not readOnly any more");
  q1.placeHolder = "text_1";
  assert.equal(q1.renderedPlaceholder, "text_1", "q1 has placeHolder now");
  q1.inputType = "range";
  assert.notOk(q1.renderedPlaceholder, "q1 has inputType range");
  q1.inputType = "text";
  assert.equal(q1.renderedPlaceholder, "text_1", "q1 has inputType text");
});
QUnit.test("Test renderedPlaceholder on locale change", function(assert) {
  const json = {
    questions: [
      {
        type: "text",
        name: "q1",
        placeHolder: { en: "text_en", de: "text_de" }
      },
      {
        type: "comment",
        name: "q2",
        placeHolder: { en: "comment_en", de: "comment_de" }
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionTextModel>survey.getAllQuestions()[0];
  const q2 = <QuestionCommentModel>survey.getAllQuestions()[1];
  assert.equal(q1.renderedPlaceholder, "text_en", "text, locale en");
  assert.equal(q2.renderedPlaceholder, "comment_en", "text, locale en");
  survey.locale = "de";
  assert.equal(q1.renderedPlaceholder, "text_de", "text, locale de");
  assert.equal(q2.renderedPlaceholder, "comment_de", "text, locale de");
  survey.locale = "";
});
QUnit.test("Test renderedPlaceholder on locale change, bug#7911", function(assert) {
  const survey = new SurveyModel({
    elements: [
      {
        name: "q1",
        type: "text",
        placeholder: "my text"
      }
    ]
  });
  survey.showPreview();
  let q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  assert.notOk(q1.renderedPlaceholder, "#1");
  survey.cancelPreview();
  q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  assert.equal(q1.renderedPlaceholder, "my text", "#2");
});
QUnit.test("Test renderedPlaceholder on locale change", function(assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "name": "q1",
        "type": "text",
        "placeHolder": {
          "default": "English",
          "fr": "French",
          "es": "Spanish"
        }
      }
    ],
    "locale": "es",
  });
  const q1 = <QuestionTextModel>survey.getAllQuestions()[0];
  assert.equal(q1.renderedPlaceholder, "Spanish", "text, locale es");
});

QUnit.test("min date error text, bug #4596", function(assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1", inputType: "date", min: "2000-10-10" }]
  });
  survey.setValue("q1", "2000-09-09");
  assert.equal(survey.hasErrors(), true, "there is an error");
  const errorText = survey.getQuestionByName("q1").errors[0].text;
  assert.equal(errorText.indexOf(":"), -1, "There is no time in the error text");
});
QUnit.test("min/max onSettingValue property function", function(assert) {
  const q = new QuestionTextModel("q1");
  q.inputType = "date";
  q.min = "2000-10-10";
  q.max = "2000-09-09";
  assert.equal(q.max, "2000-10-10", "Correct the max date value");
  q.max = "2000-11-11";
  assert.equal(q.max, "2000-11-11", "Set the max date value directly");
  q.min = "2000-12-12";
  assert.equal(q.min, "2000-11-11", "Correct the min date value");
  q.min = "2000-10-10";
  assert.equal(q.min, "2000-10-10", "Set the min date value directly");
  q.max = "";
  q.min = "2020-10-10";
  assert.equal(q.min, "2020-10-10", "Set the min date value, max value is empty");

  q.inputType = "number";
  q.min = "10";
  assert.equal(q.min, "10", "Set the min number value, max value is empty");
  q.max = "9";
  assert.equal(q.max, "10", "Correct the max number value");
  q.max = "11";
  assert.equal(q.max, "11", "Set the max number value");
  q.min = "12";
  assert.equal(q.min, "11", "Correct the min number value");
  q.min = "9";
  assert.equal(q.min, "9", "Set the min number value");
  q.max = "10";
  assert.equal(q.max, "10", "Set the max number value, #2");
  q.min = <any>5;
  q.max = <any>7;
  assert.equal(q.max, 7, "Set the max number value as number, #3");

  q.inputType = "month";
  q.min = "2020-5";
  assert.equal(q.min, "2020-5", "Set the min month value");
  q.max = "2020-4";
  assert.equal(q.max, "2020-5", "Correct the max month value");
  q.max = "2020-6";
  assert.equal(q.max, "2020-6", "Set the max month value");
  q.min = "2020-7";
  assert.equal(q.min, "2020-6", "Correct the min month value");
  q.min = "2020-3";
  assert.equal(q.min, "2020-3", "Set the min month value, #2");

  q.inputType = "week";
  q.min = "2020-W5";
  assert.equal(q.min, "2020-W5", "Set the min week value");
  q.max = "2020-W4";
  assert.equal(q.max, "2020-W5", "Correct the max week value");
  q.max = "2020-W6";
  assert.equal(q.max, "2020-W6", "Set the max week value");
  q.min = "2020-W7";
  assert.equal(q.min, "2020-W6", "Correct the min week value");
  q.min = "2020-W3";
  assert.equal(q.min, "2020-W3", "Set the min week value, #2");

  q.inputType = "time";
  q.min = "10:10";
  assert.equal(q.min, "10:10", "Set the min time value");
  q.max = "09:10";
  assert.equal(q.max, "10:10", "Correct the max time value");
  q.max = "11:10";
  assert.equal(q.max, "11:10", "Set the max time value");
  q.min = "12:01";
  assert.equal(q.min, "11:10", "Correct the min time value");
  q.min = "10:15";
  assert.equal(q.min, "10:15", "Set the min time value, #2");
});
QUnit.test("month value should have format 9999-99, Bug#8668", function(assert) {
  const q = new QuestionTextModel("q1");
  q.inputType = "month";
  q.value = "2024-01";
  assert.equal(q.value, "2024-01", "#1");
  q.value = "2024-5";
  assert.equal(q.value, "2024-05", "#2");
});
QUnit.test("Change placeHolder to placeholder", function(assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", placeHolder: "text1" },
      { type: "text", name: "q2", placeholder: "text2" },
      { type: "comment", name: "q3", placeHolder: "text3" },
      { type: "comment", name: "q4", placeholder: "text4" }
    ]
  });
  let q = <QuestionTextBase>survey.getQuestionByName("q1");
  assert.equal(q.placeHolder, "text1", "placeHolder #1");
  assert.equal(q.placeholder, "text1", "placeholder #1");
  q = <QuestionTextBase>survey.getQuestionByName("q2");
  assert.equal(q.placeHolder, "text2", "placeHolder #2");
  assert.equal(q.placeholder, "text2", "placeholder #2");
  q = <QuestionTextBase>survey.getQuestionByName("q3");
  assert.equal(q.placeHolder, "text3", "placeHolder #3");
  assert.equal(q.placeholder, "text3", "placeholder #3");
  q = <QuestionTextBase>survey.getQuestionByName("q4");
  assert.equal(q.placeHolder, "text4", "placeHolder #4");
  assert.equal(q.placeholder, "text4", "placeholder #4");
});
QUnit.test("Test event handlers", function(assert) {
  const testInput = document.createElement("input");
  const fakeInput = document.createElement("input");
  document.body.appendChild(testInput);
  document.body.appendChild(fakeInput);
  let survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
    ]
  });
  let q = <QuestionTextModel>survey.getQuestionByName("q1");
  testInput.focus();
  testInput.value = "test1";
  q.onChange({
    target: testInput
  });
  assert.equal(q.value, undefined);
  fakeInput.focus();
  q.onChange({
    target: testInput
  });
  assert.equal(q.value, "test1", "value should be updated on change only if element is not focused #5270");
  testInput.value = "test2";
  q.onBlur({
    target: testInput
  });
  assert.equal(q.value, "test2", "value should be updated after focus loose");
  testInput.value = "test3";
  q.onKeyUp({
    target: testInput,
    keyCode: 14
  });
  assert.equal(q.value, "test2");
  q.onKeyUp({
    target: testInput,
    keyCode: 13
  });
  assert.equal(q.value, "test3", "value should be updated after 'enter' press");

  testInput.remove();
  fakeInput.remove();
});

QUnit.test("Test event handlers with on typing text update mode", function(assert) {
  const testInput = document.createElement("input");
  const fakeInput = document.createElement("input");
  document.body.appendChild(testInput);
  document.body.appendChild(fakeInput);
  let survey = new SurveyModel({
    textUpdateMode: "onTyping",
    elements: [
      { type: "text", name: "q1" },
    ]
  });
  let q = <QuestionTextModel>survey.getQuestionByName("q1");
  testInput.focus();
  testInput.value = "test1";
  q.onChange({
    target: testInput
  });
  assert.equal(q.value, "test1");
  testInput.value = "test2";
  fakeInput.focus();
  q.onChange({
    target: testInput
  });
  assert.equal(q.value, "test2", "value always should be update on change if onTyping mode");
  testInput.value = "test3";
  q.onBlur({
    target: testInput
  });
  assert.equal(q.value, "test3", "value should be updated after focus loose");
  testInput.value = "test4";
  q.onKeyUp({
    target: testInput
  });
  assert.equal(q.value, "test4", "value should be updated on key up");
  testInput.value = "test5";
  q.onKeyDown({
    target: testInput,
    keyCode: 15
  });
  assert.equal(q.value, "test4", "value should not be updated on key down");

  q.onKeyDown({
    target: testInput,
    keyCode: 229
  });
  assert.equal(q["_isWaitingForEnter"], true);
  q.onKeyUp({
    target: testInput,
  });
  assert.equal(q.value, "test4", "value should not be updated on key up if is waiting for enter and key is not enter");
  q.onKeyUp({
    target: testInput,
    keyCode: 13
  });
  assert.equal(q["_isWaitingForEnter"], false);
  assert.equal(q.value, "test5", "value should be updated on key up if is waiting for enter and key is enter");

  testInput.remove();
  fakeInput.remove();
});

QUnit.test("Test event handlers do not change question'value if newValue is same", function (assert) {
  let log = "";
  const testInput = document.createElement("input");
  class QuestionTextTest extends QuestionTextModel {
    protected onValueChanged() {
      log += "->changedValue";
    }
  }
  const question = new QuestionTextTest("q1");
  testInput.value = "test1";
  question.onBlur({
    target: testInput
  });
  question.onBlur({
    target: testInput
  });
  assert.equal(log, "->changedValue", "Value should be changed only one time");

  testInput.remove();
});
QUnit.test("min/max numeric, non required, bug#5758", function(assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1", inputType: "number", min: 1, max: 10 }]
  });
  const q = survey.getQuestionByName("q1");
  q.value = 12;
  q.validate();
  assert.equal(q.errors.length, 1, "There is an error");
  q.value = "";
  q.validate();
  assert.equal(q.errors.length, 0, "There is no errors");
});
QUnit.test("CharacterCounter + settings.showMaxLengthIndicator", function(assert) {
  const ch = new CharacterCounter();
  assert.notOk(ch.remainingCharacterCounter, "#1");
  ch.updateRemainingCharacterCounter("abc", 5);
  assert.equal(ch.remainingCharacterCounter, "3/5", "#2");
  settings.showMaxLengthIndicator = false;
  ch.updateRemainingCharacterCounter("abcd", 7);
  assert.equal(ch.remainingCharacterCounter, "", "#3");
  settings.showMaxLengthIndicator = true;
  ch.updateRemainingCharacterCounter("abcd", 7);
  assert.equal(ch.remainingCharacterCounter, "4/7", "#4");
});
QUnit.test("getControlClass with characterCounter", function(assert) {
  const inputClasses = "sd-input sd-text";
  const constrolWithCharacterCounter = "sd-text__character-counter";
  const characterCounterBig = "sd-text__character-counter--big";

  const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  const q = survey.getQuestionByName("q1");
  assert.equal(q.getControlClass(), inputClasses, "#1");

  q.maxLength = 99;
  assert.equal(q.getControlClass(), inputClasses + " " + constrolWithCharacterCounter, "#2");

  q.maxLength = 100;
  assert.equal(q.getControlClass(), inputClasses + " " + constrolWithCharacterCounter + " " + characterCounterBig, "#3");
});

QUnit.test("Set empty text", function(assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }]
  });
  const q = survey.getQuestionByName("q1");
  q.value = " ";
  assert.equal(q.isEmpty(), true, "question.isEmpty() #1");
  assert.equal(q.value, " ", "question.value #1");
  assert.deepEqual(survey.data, { q1: " " }, "survey.data #1");
  q.value = "a";
  assert.equal(q.isEmpty(), false, "question.isEmpty() #2");
  assert.equal(q.value, "a", "question.value #2");
  assert.deepEqual(survey.data, { q1: "a" }, "survey.data #2");
  q.value = " a ";
  assert.equal(q.isEmpty(), false, "question.isEmpty() #3");
  assert.equal(q.value, " a ", "question.value #3");
  assert.deepEqual(survey.data, { q1: " a " }, "survey.data #3");
  q.allowSpaceAsAnswer = true;
  q.value = " ";
  assert.equal(q.isEmpty(), false, "question.isEmpty() #4");
  assert.equal(q.value, " ", "question.value #4");
  assert.deepEqual(survey.data, { q1: " " }, "survey.data #4");
  q.value = "a";
  assert.equal(q.isEmpty(), false, "question.isEmpty() #5");
  assert.equal(q.value, "a", "question.value #5");
  assert.deepEqual(survey.data, { q1: "a" }, "survey.data #5");
  q.value = " a ";
  assert.equal(q.isEmpty(), false, "question.isEmpty() #6");
  assert.equal(q.value, " a ", "question.value #6");
  assert.deepEqual(survey.data, { q1: " a " }, "survey.data #6");
});
QUnit.test("Text Question KeyHandler exists", function (assert) {
  const q = new QuestionTextModel("q1");
  assert.ok(q["onTextKeyDownHandler"], "we need this handler for using in Survey Creator");
});
QUnit.test("Test maxLength & getMaxLength", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maxLength = 10;
  assert.equal(q.isTextInput, true, "isTextInput - text");
  assert.equal(q.getMaxLength(), 10, "getMaxLength() - text");
  q.inputType = "color";
  assert.equal(q.isTextInput, false, "isTextInput - color");
  assert.equal(q.getMaxLength(), null, "getMaxLength() - color");
  q.inputType = "password";
  assert.equal(q.isTextInput, true, "isTextInput - password");
  assert.equal(q.getMaxLength(), 10, "getMaxLength() - password");
});
QUnit.test("settings.storeUtcDates = true, #8542", function(assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "name": "q1",
        "type": "text",
        "inputType": "datetime-local"
      }
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  settings.storeUtcDates = true;
  const locD = new Date(Date.now());
  const utcD = new Date(locD.toISOString());
  q1.value = locD;
  assert.deepEqual(survey.data, { q1: utcD.toISOString() }, "#1");
  let str = survey.data.q1;
  assert.equal(str.indexOf("Z"), str.length - 1, "Has z symbol");
  q1.clearValue();
  assert.deepEqual(survey.data, { }, "#2");
  survey.data = { q1: utcD.toISOString() };
  assert.equal(new Date(q1.value).toTimeString(), locD.toTimeString(), "#3");
  assert.equal(q1.value.indexOf("Z"), -1, "Has no z symbol");
  settings.storeUtcDates = false;
});
QUnit.test("inputType='month' and today function, #8552", function(assert) {
  const survey = new SurveyModel({
    "elements": [
      { "type": "text", "name": "q1", "defaultValueExpression": "today()", "inputType": "month" },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  const m = new Date().getMonth() + 1;
  const etalon = new Date().getFullYear() + "-" + (m < 10 ? "0" : "") + m;
  assert.equal(q1.value, etalon, "today works correctly for month input");
});
QUnit.test("inputType='date' invalid value, #8617", function(assert) {
  const survey = new SurveyModel({
    "elements": [
      { "type": "text", "name": "q1", "inputType": "date" },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  q1.value = "2000-01-01";
  assert.equal(q1.errors.length, 0, "errors #1");
  const event = { target: { value: "", validationMessage: "Invalid date" } };
  q1.onKeyUp(event);
  q1.value = undefined;
  assert.equal(q1.errors.length, 0, "errors #2");
  survey.tryComplete();
  assert.equal(q1.errors.length, 1, "errors #3");
  assert.equal(q1.errors[0].text, "Invalid date", "errors #4");
  assert.equal(survey.state, "running", "survey.state #1");
  q1.value = "2000-01-01";
  assert.equal(q1.errors.length, 0, "errors #5");
});
QUnit.test("Mask is removed on loading, Bug#8624", function(assert) {
  const survey = new SurveyModel({
    elements: [
      {
        maskSettings: {
          pattern: "999-99-999999",
          saveMaskedValue: true,
        },
        maskType: "pattern",
        name: "q1",
        type: "text"
      },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  const maskSettings = q1.maskSettings as InputMaskPattern;
  assert.equal(q1.maskType, "pattern", "mask type is set correctly");
  assert.equal(maskSettings.pattern, "999-99-999999", "pattern is loaded");
});
QUnit.test("Mask datetime with defaultValue as date", function (assert) {
  function currentDateMock() {
    return new Date("2024-09-04T12:34:00");
  }
  FunctionFactory.Instance.register("currentDateMock", currentDateMock);
  const survey = new SurveyModel({
    elements: [
      {
        "type": "text",
        "name": "q1",
        "defaultValueExpression": "currentDateMock()",
        "maskType": "datetime",
        "maskSettings": {
          "pattern": "yyyy-mm-d HH:MM"
        }
      },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  assert.equal(q1.inputValue, "2024-09-4 12:34");
});
QUnit.test("Mask datetime with defaultValue as date", function (assert) {
  const survey = new SurveyModel({
    locale: "de",
    elements: [
      {
        "type": "text",
        "name": "q1",
        "inputType": "email"
      },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  q1.value = "test";
  q1.validate(true, true);
  assert.equal(q1.errors.length, 1, "There is an error");
  assert.equal(q1.errors[0].text, "Bitte geben Sie eine gültige E-Mail-Adresse ein.", "Error in Deutsch");
});
QUnit.test("Mask pattern default inputValue", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "text",
        "name": "q1",
        "maskType": "pattern",
        "maskSettings": {
          "pattern": "9"
        }
      },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  assert.equal(q1.inputValue, "_");
});
QUnit.test("Support mask in displayValue, #9268", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        maskType: "numeric",
        maskSettings: {
          decimalSeparator: ",",
          thousandsSeparator: " ",
        },
      },
      { type: "text", name: "q2", title: "Title: {q1}" }
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q1.displayValue, "", "displayValue #1");
  assert.equal(q2.locTitle.textOrHtml, "Title: ", "title #1");
  q1.value = 1234567.3;
  assert.equal(q1.displayValue, "1 234 567,3", "displayValue #2");
  assert.equal(q2.locTitle.textOrHtml, "Title: 1 234 567,3", "title #2");
  assert.equal(q1.getDisplayValue(false, 1234), "1 234", "getDisplayValue with value #1");
  q1.maskSettings.saveMaskedValue = true;
  assert.equal(q1.getDisplayValue(false, 1234), "1 234", "getDisplayValue with value #2");
  assert.equal(q1.value, 1234567.3, "Have the same value");
  assert.equal(q1.inputValue, "1 234 567,3", "Have the same input value");
});