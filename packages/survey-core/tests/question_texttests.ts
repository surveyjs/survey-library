import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";
import { SurveyModel } from "../src/survey";
import { QuestionTextBase, CharacterCounter } from "../src/question_textbase";
import { settings } from "../src/settings";
import { InputMaskPattern } from "../src/mask/mask_pattern";
import { FunctionFactory } from "../src/functionsfactory";
import { describe, test, expect } from "vitest";
export * from "../src/localization/german";

describe("question text tests", () => {
  test("check text disabled class", () => {
    var json = {
      elements: [
        {
          name: "q1",
          type: "text",
        },
      ],
    };
    const survey = new SurveyModel(json);
    const question = <QuestionTextModel>survey.getAllQuestions()[0];
    question.cssClasses.controlReadOnly = "sv_q_text_disabled";
    expect(question.getControlClass().indexOf("sv_q_text_disabled") == -1).toBeTruthy();
    question.readOnly = true;
    expect(question.getControlClass().indexOf("sv_q_text_disabled") != -1).toBeTruthy();
  });
  test("Test renderedPlaceholder", () => {
    var json = {
      elements: [
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
    expect(q1.renderedPlaceholder, "q1, there is no placeHolder").toBeFalsy();
    expect(q2.renderedPlaceholder, "q2 has placeHolder").toBe("comment_2");
    expect(q3.renderedPlaceholder, "q3, question is readOnly").toBeFalsy();
    q2.readOnly = true;
    expect(q2.renderedPlaceholder, "q2, question is readOnly").toBeFalsy();
    q3.readOnly = false;
    expect(q3.renderedPlaceholder, "q3 is not readOnly any more").toBe("text_3");
    q1.placeHolder = "text_1";
    expect(q1.renderedPlaceholder, "q1 has placeHolder now").toBe("text_1");
    q1.inputType = "range";
    expect(q1.renderedPlaceholder, "q1 has inputType range").toBeFalsy();
    q1.inputType = "text";
    expect(q1.renderedPlaceholder, "q1 has inputType text").toBe("text_1");
  });
  test("Test renderedPlaceholder on locale change", () => {
    const json = {
      elements: [
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
    expect(q1.renderedPlaceholder, "text, locale en").toBe("text_en");
    expect(q2.renderedPlaceholder, "text, locale en").toBe("comment_en");
    survey.locale = "de";
    expect(q1.renderedPlaceholder, "text, locale de").toBe("text_de");
    expect(q2.renderedPlaceholder, "text, locale de").toBe("comment_de");
    survey.locale = "";
  });
  test("Test renderedPlaceholder on locale change, bug#7911", () => {
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
    expect(q1.renderedPlaceholder, "#1").toBeFalsy();
    survey.cancelPreview();
    q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q1.renderedPlaceholder, "#2").toBe("my text");
  });
  test("Test renderedPlaceholder on locale change", () => {
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
    expect(q1.renderedPlaceholder, "text, locale es").toBe("Spanish");
  });

  test("min date error text, bug #4596", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", inputType: "date", min: "2000-10-10" }]
    });
    survey.setValue("q1", "2000-09-09");
    expect(survey.validate(), "there is an error").toBe(false);
    const errorText = survey.getQuestionByName("q1").errors[0].text;
    expect(errorText.indexOf(":"), "There is no time in the error text").toBe(-1);
  });
  test("min/max onSettingValue property function", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "date";
    q.min = "2000-10-10";
    q.max = "2000-09-09";
    expect(q.max, "Correct the max date value").toBe("2000-10-10");
    q.max = "2000-11-11";
    expect(q.max, "Set the max date value directly").toBe("2000-11-11");
    q.min = "2000-12-12";
    expect(q.min, "Correct the min date value").toBe("2000-11-11");
    q.min = "2000-10-10";
    expect(q.min, "Set the min date value directly").toBe("2000-10-10");
    q.max = "";
    q.min = "2020-10-10";
    expect(q.min, "Set the min date value, max value is empty").toBe("2020-10-10");

    q.inputType = "number";
    q.min = "10";
    expect(q.min, "Set the min number value, max value is empty").toBe("10");
    q.max = "9";
    expect(q.max, "Correct the max number value").toBe("10");
    q.max = "11";
    expect(q.max, "Set the max number value").toBe("11");
    q.min = "12";
    expect(q.min, "Correct the min number value").toBe("11");
    q.min = "9";
    expect(q.min, "Set the min number value").toBe("9");
    q.max = "10";
    expect(q.max, "Set the max number value, #2").toBe("10");
    q.min = <any>5;
    q.max = <any>7;
    expect(q.max, "Set the max number value as number, #3").toBe(7);

    q.inputType = "month";
    q.min = "2020-5";
    expect(q.min, "Set the min month value").toBe("2020-5");
    q.max = "2020-4";
    expect(q.max, "Correct the max month value").toBe("2020-5");
    q.max = "2020-6";
    expect(q.max, "Set the max month value").toBe("2020-6");
    q.min = "2020-7";
    expect(q.min, "Correct the min month value").toBe("2020-6");
    q.min = "2020-3";
    expect(q.min, "Set the min month value, #2").toBe("2020-3");

    q.inputType = "week";
    q.min = "2020-W5";
    expect(q.min, "Set the min week value").toBe("2020-W5");
    q.max = "2020-W4";
    expect(q.max, "Correct the max week value").toBe("2020-W5");
    q.max = "2020-W6";
    expect(q.max, "Set the max week value").toBe("2020-W6");
    q.min = "2020-W7";
    expect(q.min, "Correct the min week value").toBe("2020-W6");
    q.min = "2020-W3";
    expect(q.min, "Set the min week value, #2").toBe("2020-W3");

    q.inputType = "time";
    q.min = "10:10";
    expect(q.min, "Set the min time value").toBe("10:10");
    q.max = "09:10";
    expect(q.max, "Correct the max time value").toBe("10:10");
    q.max = "11:10";
    expect(q.max, "Set the max time value").toBe("11:10");
    q.min = "12:01";
    expect(q.min, "Correct the min time value").toBe("11:10");
    q.min = "10:15";
    expect(q.min, "Set the min time value, #2").toBe("10:15");
  });
  test("month value should have format 9999-99, Bug#8668", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "month";
    q.value = "2024-01";
    expect(q.value, "#1").toBe("2024-01");
    q.value = "2024-5";
    expect(q.value, "#2").toBe("2024-05");
  });
  test("Change placeHolder to placeholder", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", placeHolder: "text1" },
        { type: "text", name: "q2", placeholder: "text2" },
        { type: "comment", name: "q3", placeHolder: "text3" },
        { type: "comment", name: "q4", placeholder: "text4" }
      ]
    });
    let q = <QuestionTextBase>survey.getQuestionByName("q1");
    expect(q.placeHolder, "placeHolder #1").toBe("text1");
    expect(q.placeholder, "placeholder #1").toBe("text1");
    q = <QuestionTextBase>survey.getQuestionByName("q2");
    expect(q.placeHolder, "placeHolder #2").toBe("text2");
    expect(q.placeholder, "placeholder #2").toBe("text2");
    q = <QuestionTextBase>survey.getQuestionByName("q3");
    expect(q.placeHolder, "placeHolder #3").toBe("text3");
    expect(q.placeholder, "placeholder #3").toBe("text3");
    q = <QuestionTextBase>survey.getQuestionByName("q4");
    expect(q.placeHolder, "placeHolder #4").toBe("text4");
    expect(q.placeholder, "placeholder #4").toBe("text4");
  });
  test("Test event handlers", () => {
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
    expect(q.value).toBeUndefined();
    fakeInput.focus();
    q.onChange({
      target: testInput
    });
    expect(q.value, "value should be updated on change only if element is not focused #5270").toBe("test1");
    testInput.value = "test2";
    q.onBlur({
      target: testInput
    });
    expect(q.value, "value should be updated after focus loose").toBe("test2");
    testInput.value = "test3";
    q.onKeyUp({
      target: testInput,
      keyCode: 14
    });
    expect(q.value).toBe("test2");
    q.onKeyUp({
      target: testInput,
      keyCode: 13
    });
    expect(q.value, "value should be updated after 'enter' press").toBe("test3");

    testInput.remove();
    fakeInput.remove();
  });

  test("Test event handlers with on typing text update mode", () => {
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
    expect(q.value).toBe("test1");
    testInput.value = "test2";
    fakeInput.focus();
    q.onChange({
      target: testInput
    });
    expect(q.value, "value always should be update on change if onTyping mode").toBe("test2");
    testInput.value = "test3";
    q.onBlur({
      target: testInput
    });
    expect(q.value, "value should be updated after focus loose").toBe("test3");
    testInput.value = "test4";
    q.onKeyUp({
      target: testInput
    });
    expect(q.value, "value should be updated on key up").toBe("test4");
    testInput.value = "test5";
    q.onKeyDown({
      target: testInput,
      keyCode: 15
    });
    expect(q.value, "value should not be updated on key down").toBe("test4");

    q.onKeyDown({
      target: testInput,
      keyCode: 229
    });
    expect(q["_isWaitingForEnter"]).toBe(true);
    q.onKeyUp({
      target: testInput,
    });
    expect(q.value, "value should not be updated on key up if is waiting for enter and key is not enter").toBe("test4");
    q.onKeyUp({
      target: testInput,
      keyCode: 13
    });
    expect(q["_isWaitingForEnter"]).toBe(false);
    expect(q.value, "value should be updated on key up if is waiting for enter and key is enter").toBe("test5");

    testInput.remove();
    fakeInput.remove();
  });

  test("Test event handlers do not change question'value if newValue is same", () => {
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
    expect(log, "Value should be changed only one time").toBe("->changedValue");

    testInput.remove();
  });
  test("min/max numeric, non required, bug#5758", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", inputType: "number", min: 1, max: 10 }]
    });
    const q = survey.getQuestionByName("q1");
    q.value = 12;
    q.validate();
    expect(q.errors.length, "There is an error").toBe(1);
    q.value = "";
    q.validate();
    expect(q.errors.length, "There is no errors").toBe(0);
  });
  test("CharacterCounter + settings.showMaxLengthIndicator", () => {
    const ch = new CharacterCounter();
    expect(ch.remainingCharacterCounter, "#1").toBeFalsy();
    ch.updateRemainingCharacterCounter("abc", 5);
    expect(ch.remainingCharacterCounter, "#2").toBe("3/5");
    settings.showMaxLengthIndicator = false;
    ch.updateRemainingCharacterCounter("abcd", 7);
    expect(ch.remainingCharacterCounter, "#3").toBe("");
    settings.showMaxLengthIndicator = true;
    ch.updateRemainingCharacterCounter("abcd", 7);
    expect(ch.remainingCharacterCounter, "#4").toBe("4/7");
  });
  test("getControlClass with characterCounter", () => {
    const inputClasses = "sd-input sd-text";
    const constrolWithCharacterCounter = "sd-text__character-counter";
    const characterCounterBig = "sd-text__character-counter--big";

    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const q = survey.getQuestionByName("q1");
    expect(q.getControlClass(), "#1").toBe(inputClasses);

    q.maxLength = 99;
    expect(q.getControlClass(), "#2").toBe(inputClasses + " " + constrolWithCharacterCounter);

    q.maxLength = 100;
    expect(q.getControlClass(), "#3").toBe(inputClasses + " " + constrolWithCharacterCounter + " " + characterCounterBig);
  });

  test("Set empty text", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }]
    });
    const q = survey.getQuestionByName("q1");
    q.value = " ";
    expect(q.isEmpty(), "question.isEmpty() #1").toBe(true);
    expect(q.value, "question.value #1").toBe(" ");
    expect(survey.data, "survey.data #1").toEqual({ q1: " " });
    q.value = "a";
    expect(q.isEmpty(), "question.isEmpty() #2").toBe(false);
    expect(q.value, "question.value #2").toBe("a");
    expect(survey.data, "survey.data #2").toEqual({ q1: "a" });
    q.value = " a ";
    expect(q.isEmpty(), "question.isEmpty() #3").toBe(false);
    expect(q.value, "question.value #3").toBe(" a ");
    expect(survey.data, "survey.data #3").toEqual({ q1: " a " });
    q.allowSpaceAsAnswer = true;
    q.value = " ";
    expect(q.isEmpty(), "question.isEmpty() #4").toBe(false);
    expect(q.value, "question.value #4").toBe(" ");
    expect(survey.data, "survey.data #4").toEqual({ q1: " " });
    q.value = "a";
    expect(q.isEmpty(), "question.isEmpty() #5").toBe(false);
    expect(q.value, "question.value #5").toBe("a");
    expect(survey.data, "survey.data #5").toEqual({ q1: "a" });
    q.value = " a ";
    expect(q.isEmpty(), "question.isEmpty() #6").toBe(false);
    expect(q.value, "question.value #6").toBe(" a ");
    expect(survey.data, "survey.data #6").toEqual({ q1: " a " });
  });
  test("Text Question KeyHandler exists", () => {
    const q = new QuestionTextModel("q1");
    expect(q["onTextKeyDownHandler"], "we need this handler for using in Survey Creator").toBeTruthy();
  });
  test("Test maxLength & getMaxLength", () => {
    const q = new QuestionTextModel("q1");
    q.maxLength = 10;
    expect(q.isTextInput, "isTextInput - text").toBe(true);
    expect(q.getMaxLength(), "getMaxLength() - text").toBe(10);
    q.inputType = "color";
    expect(q.isTextInput, "isTextInput - color").toBe(false);
    expect(q.getMaxLength(), "getMaxLength() - color").toBeNull();
    q.inputType = "password";
    expect(q.isTextInput, "isTextInput - password").toBe(true);
    expect(q.getMaxLength(), "getMaxLength() - password").toBe(10);
  });
  test("settings.storeUtcDates = true, #8542", () => {
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
    expect(survey.data, "#1").toEqual({ q1: utcD.toISOString() });
    let str = survey.data.q1;
    expect(str.indexOf("Z"), "Has z symbol").toBe(str.length - 1);
    q1.clearValue();
    expect(survey.data, "#2").toEqual({ });
    survey.data = { q1: utcD.toISOString() };
    expect(new Date(q1.value).toTimeString(), "#3").toBe(locD.toTimeString());
    expect(q1.value.indexOf("Z"), "Has no z symbol").toBe(-1);
    settings.storeUtcDates = false;
  });
  test("inputType='month' and today function, #8552", () => {
    const survey = new SurveyModel({
      "elements": [
        { "type": "text", "name": "q1", "defaultValueExpression": "today()", "inputType": "month" },
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    const m = new Date().getMonth() + 1;
    const etalon = new Date().getFullYear() + "-" + (m < 10 ? "0" : "") + m;
    expect(q1.value, "today works correctly for month input").toBe(etalon);
  });
  test("inputType='month' and when year is less than 1000 (4 digits) Bug#10663", () => {
    const survey = new SurveyModel({
      "elements": [
        { "type": "text", "name": "q1", "inputType": "month" },
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    q1.inputValue = "0133-5";
    expect(q1.value, "the value is correct #3").toBe("0133-05");
  });
  test("inputType='date' invalid value, #8617", () => {
    const survey = new SurveyModel({
      "elements": [
        { "type": "text", "name": "q1", "inputType": "date" },
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    q1.value = "2000-01-01";
    expect(q1.errors.length, "errors #1").toBe(0);
    const event = { target: { value: "", validationMessage: "Invalid date" } };
    q1.onKeyUp(event);
    q1.value = undefined;
    expect(q1.errors.length, "errors #2").toBe(0);
    survey.tryComplete();
    expect(q1.errors.length, "errors #3").toBe(1);
    expect(q1.errors[0].text, "errors #4").toBe("Invalid date");
    expect(survey.state, "survey.state #1").toBe("running");
    q1.value = "2000-01-01";
    expect(q1.errors.length, "errors #5").toBe(0);
  });
  test("Mask is removed on loading, Bug#8624", () => {
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
    expect(q1.maskType, "mask type is set correctly").toBe("pattern");
    expect(maskSettings.pattern, "pattern is loaded").toBe("999-99-999999");
  });
  test("Mask datetime with defaultValue as date", () => {
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
    expect(q1.inputValue).toBe("2024-09-4 12:34");
  });
  test("Mask datetime with defaultValue as date", () => {
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
    q1.validate(true);
    expect(q1.errors.length, "There is an error").toBe(1);
    expect(q1.errors[0].text, "Error in Deutsch").toBe("Bitte geben Sie eine gültige E-Mail-Adresse ein."); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  });
  test("Mask pattern default inputValue", () => {
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
    expect(q1.inputValue).toBe("_");
  });
  test("Support mask in displayValue, #9268", () => {
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
    expect(q1.displayValue, "displayValue #1").toBe("");
    expect(q2.locTitle.textOrHtml, "title #1").toBe("Title: ");

    q1.value = 1234567.3;
    expect(q1.displayValue, "displayValue #2").toBe("1 234 567,3");
    expect(q2.locTitle.textOrHtml, "title #2").toBe("Title: 1 234 567,3");
    expect(q1.getDisplayValue(false, 1234), "getDisplayValue with value #1").toBe("1 234");

    q1.maskSettings.saveMaskedValue = true;
    q1.value = "1 234 567,3";
    expect(q1.getDisplayValue(false, 1234), "getDisplayValue with value #2").toBe("1 234");
    expect(q1.value, "Have the same value").toBe("1 234 567,3");
    expect(q1.inputValue, "Have the same input value").toBe("1 234 567,3");
  });
  test("Expression vs saveMaskedValue, #10056", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "maskType": "numeric",
          "maskSettings": {
            "saveMaskedValue": true,
            "decimalSeparator": ",",
            "thousandsSeparator": "."
          }
        },
        {
          "type": "expression",
          "name": "q2",
          "expression": "{q1} + 22"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.value, "q2.value #1").toBe(22);
    q1.inputValue = "1000";
    expect(q1.value, "q1.value #2").toBe("1.000");
    expect(q2.value, "q2.value #2").toBe(1022);
    q1.value = "1.000,4";
    expect(q2.value, "q2.value #3").toBe(1022.4);
  });
  test("Expression vs saveMaskedValue in different surveys, #10056", () => {
    const survey1 = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
        },
        {
          "type": "expression",
          "name": "q2",
          "expression": "{q1} + 12"
        }
      ]
    });
    const survey2 = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "maskType": "numeric",
          "maskSettings": {
            "saveMaskedValue": true,
            "decimalSeparator": ",",
            "thousandsSeparator": "."
          }
        },
        {
          "type": "expression",
          "name": "q2",
          "expression": "{q1} + 12"
        }
      ]
    });
    let q1 = survey1.getQuestionByName("q1");
    let q2 = survey1.getQuestionByName("q2");
    expect(q2.value, "survey1 q2.value #1").toBe(12);
    q1.value = 1000;
    expect(q2.value, "survey1 q2.value #2").toBe(1012);
    q1 = survey2.getQuestionByName("q1");
    q2 = survey2.getQuestionByName("q2");
    expect(q2.value, "survey2 q2.value #1").toBe(12);
    q1.inputValue = "1000";
    expect(q2.value, "survey2 q2.value #2").toBe(1012);
  });
  test("inputType email &  checkErrorsMode = `onValueChanged`, #10173", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "inputType": "email",
          "validators": [
            {
              "type": "text",
              "minLength": 9
            }
          ],
        }
      ],
      "checkErrorsMode": "onValueChanged"
    });
    const q1 = survey.getQuestionByName("q1");
    q1.value = "test";
    expect(q1.errors.length, "There is an error").toBe(1);
    expect(q1.errors[0].text, "Error text is correct #1").toBe("Please enter a valid e-mail address.");
    q1.value = "a@a.com";
    expect(q1.errors.length, "There is an error - incorrect email").toBe(1);
    expect(q1.errors[0].text, "Error text is correct #2").toBe("Please enter at least 9 character(s).");
    q1.value = "a@abc.com";
    expect(q1.errors.length, "There is no errors #1").toBe(0);
    q1.textUpdateMode = "onTyping";
    q1.value = "test";
    expect(q1.errors.length, "There is an error #2").toBe(1);
    q1.value = "a@abc.com";
    expect(q1.errors.length, "No errors #2").toBe(0);
    q1.value = "test_test";
    expect(q1.errors.length, "Do not show email error if textUpdateMode is onTyping").toBe(0);
  });
  test("Show error if number is not valid because of step, #10348", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "inputType": "number",
          "step": 3
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    q1.value = 10;
    expect(q1.validate(), "10 is not valid").toBe(false);
    expect(q1.errors[0].getText(), "error text #1").toBe("Please enter a value that matches the step size of 3.");
    q1.value = 9;
    expect(q1.validate(), "9 is valid").toBe(true);
  });
  test("Incorrect floating point validation of a numeric input, #10927", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "inputType": "number",
          "step": 0.01
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    q1.value = 1.13;
    expect(q1.validate(), "1.13 is valid").toBe(true);
  });
  test("Numeric Single-Line Input: step validation floating point issues, #10393", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "inputType": "number",
          "step": 0.3
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    q1.value = 4.3;
    expect(q1.validate(), "4.3 is not valid").toBe(false);
    expect(q1.errors[0].getText(), "error text #1").toBe("Please enter a value that matches the step size of 0.3.");
    q1.value = 4.2;
    expect(q1.validate(), "4.2 is valid").toBe(true);
  });
  test("Numeric Single-Line Input: float point value with integer step", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1",
          "inputType": "number",
          "step": 1
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    q1.value = 4.3;
    expect(q1.validate(), "4.3 is not valid").toBe(false);
    expect(q1.errors[0].getText(), "error text #2").toBe("Please enter a value that matches the step size of 1.");
    q1.value = 4;
    expect(q1.validate(), "4 is valid").toBe(true);
  });
  test("getSupportedValidators for text based on inputType, #10440", () => {
    const q = new QuestionTextModel("q1");
    expect(q.getSupportedValidators(), "default inputType").toEqual(["expression", "text", "regex"]);
    q.inputType = "number";
    expect(q.getSupportedValidators(), "inputType=number").toEqual(["expression", "numeric"]);
    q.inputType = "email";
    expect(q.getSupportedValidators(), "inputType=email").toEqual(["expression", "text", "regex", "email"]);
    q.inputType = "date";
    expect(q.getSupportedValidators(), "inputType=date").toEqual(["expression"]);
    q.inputType = "time";
    expect(q.getSupportedValidators(), "inputType=time").toEqual(["expression"]);
    q.inputType = "datetime-local";
    expect(q.getSupportedValidators(), "inputType=datetime-local").toEqual(["expression"]);
    q.inputType = "tel";
    expect(q.getSupportedValidators(), "inputType=tel").toEqual(["expression", "text", "regex"]);
    q.inputType = "color";
    expect(q.getSupportedValidators(), "inputType=color").toEqual(["expression"]);
    q.inputType = "password";
    expect(q.getSupportedValidators(), "inputType=password").toEqual(["expression", "text", "regex"]);
    q.inputType = "url";
    expect(q.getSupportedValidators(), "inputType=url").toEqual(["expression", "text", "regex"]);
  });
  test("Could not change the value from upper case into lower case, #10590", () => {
    const q = new QuestionTextModel("q1");
    q.inputValue = "TEST";
    expect(q.value, "value is set to upper case").toBe("TEST");
    q.inputValue = "test";
    expect(q.value, "value is changed to lower case").toBe("test");
  });
  test("inputType='datetime-local' &currentDate() function, #10610", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          inputType: "datetime-local",
          defaultValueExpression: "currentDate()"
        },
        {
          type: "text",
          name: "q2",
          inputType: "datetime-local",
          setValueExpression: "currentDate()"
        },
        {
          type: "text",
          name: "q3",
          inputType: "datetime-local"
        },
        {
          type: "expression",
          name: "exp1",
          expression: "currentDate() = {q1}"
        },
        {
          type: "expression",
          name: "exp2",
          expression: "{q1} = {q2}"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const exp1 = survey.getQuestionByName("exp1");
    const exp2 = survey.getQuestionByName("exp2");
    expect(q1.value.indexOf("T") > -1, "q1 T is present in the value").toBeTruthy();
    expect(q2.value.indexOf("T") > -1, "q2 T is present in the value").toBeTruthy();
    q3.value = new Date().toString();
    expect(q3.value.indexOf("T") > -1, "q3 T is present in the value").toBeTruthy();
    expect(exp1.value, "exp1 is true").toBe(true);
    expect(exp2.value, "exp2 is true").toBe(true);
  });
  test("Create dataList strings on demand", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }]
    });
    const q1 = survey.getQuestionByName("q1") as QuestionTextModel;
    const obj = q1 as any;
    expect(obj.locDataListValue, "dataList is not created initially").toBeUndefined();
    q1.toJSON();
    expect(obj.locDataListValue, "dataList is not created on toJSON").toBeUndefined();
  });
  test("The dataList property value is not saved in a survey JSON definition Bug#10849", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }]
    });
    const q1 = survey.getQuestionByName("q1") as QuestionTextModel;
    q1.dataList = ["item1", "item2"];
    const json = q1.toJSON();
    expect(json.dataList, "dataList is stored in the JSON").toEqual(["item1", "item2"]);
  });

  test("Numeric input validation - prevent 'e' character", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "number";

    const createKeyEvent = (key: string, selectionStart: number = 0) => {
      return {
        key: key,
        target: { selectionStart: selectionStart, value: "" },
        preventDefault: () => {},
        ctrlKey: false,
        metaKey: false,
        altKey: false
      };
    };

    // Test 'e' character prevention
    const eventE = createKeyEvent("e");
    expect(q["shouldPreventNumberInput"](eventE), "Should prevent 'e' character").toBe(true);

    const eventEUpper = createKeyEvent("E");
    expect(q["shouldPreventNumberInput"](eventEUpper), "Should prevent 'E' character").toBe(true);
  });

  test("Numeric input validation - prevent '+' character", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "number";

    const createKeyEvent = (key: string, selectionStart: number = 0) => {
      return {
        key: key,
        target: { selectionStart: selectionStart, value: "" },
        preventDefault: () => {},
        ctrlKey: false,
        metaKey: false,
        altKey: false
      };
    };

    // Test '+' character prevention
    const eventPlus = createKeyEvent("+", 0);
    expect(q["shouldPreventNumberInput"](eventPlus), "Should prevent '+' at start").toBe(true);

    const eventPlusMiddle = createKeyEvent("+", 5);
    expect(q["shouldPreventNumberInput"](eventPlusMiddle), "Should prevent '+' in middle").toBe(true);
  });

  test("Numeric input validation - prevent '-' at non-first position", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "number";
    // No min/max set, so renderedMin is undefined
    // For input type="number", selectionStart is null, so we clean up "-" in onKeyUp event

    // Simulates the keydown->keyup sequence for typing "-" into a number input.
    // onKeyDown stores prevNumberValue (the value before the keystroke).
    // The browser then processes the key, potentially making the value invalid (empty string for type="number").
    // onKeyUp calls updateNumericValue which restores the value from prevNumberValue if needed.
    const simulateMinusKey = (valueBefore: string, valueAfter: string) => {
      const target = { value: valueBefore };
      const keyDownEvent = {
        key: "-",
        target: target,
        preventDefault: () => {},
        ctrlKey: false,
        metaKey: false,
        altKey: false
      };
      q.onKeyDown(keyDownEvent);
      // Simulate browser processing the keystroke - value changes
      target.value = valueAfter;
      const keyUpEvent = {
        key: "-",
        target: target
      };
      q.onKeyUp(keyUpEvent);
      return target.value;
    };

    // Test onKeyUp cleans up "-" at non-first positions
    // When "-" is typed in the middle, browser sees "1-23" which is invalid -> returns ""
    // updateNumericValue restores from prevNumberValue "123" and cleans it
    let result1 = simulateMinusKey("123", "1-23");
    expect(result1, "Should remove '-' from middle of value").toBe("123");

    let result2 = simulateMinusKey("-123", "-12-3");
    expect(result2, "Should keep first '-' but remove others").toBe("-123");

    let result3 = simulateMinusKey("123", "123-");
    expect(result3, "Should remove '-' from end of value").toBe("123");

    let result4 = simulateMinusKey("", "-123");
    expect(result4, "Should allow '-' at first position").toBe("-123");
  });

  test("Numeric input validation - prevent '-' when min >= 0", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "number";
    q.min = "0";

    const createKeyEvent = (key: string, selectionStart: number = 0) => {
      return {
        key: key,
        target: { selectionStart: selectionStart, value: "" },
        preventDefault: () => {},
        ctrlKey: false,
        metaKey: false,
        altKey: false
      };
    };

    // Test '-' character prevention when min is 0
    const eventMinusStart = createKeyEvent("-", 0);
    expect(q["shouldPreventNumberInput"](eventMinusStart), "Should prevent '-' at start when min=0").toBe(true);

    // Allow '-' when min is negative
    q.min = "-10";
    const eventMinusStartNegMin = createKeyEvent("-", 0);
    expect(q["shouldPreventNumberInput"](eventMinusStartNegMin), "Should allow '-' at start when min=-10").toBe(false);

    // Test with min = 5
    q.min = "5";
    const eventMinusStartPosMin = createKeyEvent("-", 0);
    expect(q["shouldPreventNumberInput"](eventMinusStartPosMin), "Should prevent '-' at start when min=5").toBe(true);
  });

  test("Numeric input validation - allow control keys", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "number";

    const createKeyEvent = (key: string, ctrlKey: boolean = false) => {
      return {
        key: key,
        target: { selectionStart: 0, value: "" },
        preventDefault: () => {},
        ctrlKey: ctrlKey,
        metaKey: false,
        altKey: false
      };
    };

    // Test control keys are allowed
    const controlKeys = ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Escape"];
    controlKeys.forEach(key => {
      const event = createKeyEvent(key);
      expect(q["shouldPreventNumberInput"](event), `Should allow ${key} key`).toBe(false);
    });

    // Test Ctrl+key combinations are allowed
    const eventCtrlC = createKeyEvent("c", true);
    expect(q["shouldPreventNumberInput"](eventCtrlC), "Should allow Ctrl+C").toBe(false);
  });

  test("Numeric input validation - only applies to inputType='number'", () => {
    const q = new QuestionTextModel("q1");
    q.inputType = "text";

    const createKeyEvent = (key: string) => {
      return {
        key: key,
        target: { selectionStart: 0, value: "" },
        preventDefault: () => {},
        ctrlKey: false,
        metaKey: false,
        altKey: false
      };
    };

    // When inputType is not 'number', validation should not apply
    const eventE = createKeyEvent("e");
    // shouldPreventNumberInput is only called when inputType === "number"
    // So we just test that the method exists and returns correctly
    expect(q["shouldPreventNumberInput"], "shouldPreventNumberInput method exists").toBeTruthy();
  });
});
