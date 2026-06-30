import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { QuestionTextModel } from "../../src/question_text";
import { Serializer } from "../../src/jsonobject";
import { SurveyModel } from "../../src/survey";
import { ArrayChanges, Base } from "../../src/base";

import { describe, test, expect } from "vitest";
describe("Question text: Input mask", () => {
  test("Initial mask settings", () => {
    const testInput = document.createElement("input");

    const q = new QuestionTextModel("q1");
    q.input = testInput;
    expect(q.maskType).toBe("none");
    expect(q.maskSettings.getType()).toBe("masksettings");
    expect(!!q["maskInputAdapter"]).toBe(false);

    q.maskType = "pattern";
    expect(q.maskType).toBe("pattern");
    expect(q.maskSettings.getType()).toBe("patternmask");
    expect(!!q["maskInputAdapter"]).toBe(true);

    testInput.remove();
  });

  test("Apply mask", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "+99-99" });
    q.value = "1234";
    expect(q.value).toBe("1234");
    expect(q.inputValue).toBe("+12-34");

    q.inputValue = "+78-68";
    expect(q.value).toBe("7868");
    expect(q.inputValue).toBe("+78-68");
  });

  test("Pattern mask: value is completed", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

    q.inputValue = "+12-34";
    expect(q.value, "masked value").toBe("+12-34");
    expect(q.inputValue, "masked inputValue").toBe("+12-34");

    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });
    q.inputValue = "+45-67";
    expect(q.value, "unmasked value").toBe("4567");
    expect(q.inputValue, "unmasked inputValue").toBe("+45-67");
  });

  test("Pattern mask: value is incompleted", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

    q.inputValue = "+12-__";
    expect(q.value, "incomplete masked value").toBeUndefined();
    expect(q.inputValue, "incomplete masked inputValue").toBe("+12-__");

    q.inputValue = "+12-34";

    q.inputValue = "+12-__";
    expect(q.value, "incomplete masked value").toBeUndefined();
    expect(q.inputValue, "incomplete masked inputValue").toBe("+12-__");

    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });

    q.inputValue = "+45-__";
    expect(q.value, "incomplete unmasked value (saveMaskedValue: false)").toBeUndefined();
    expect(q.inputValue, "incomplete unmasked inputValue (saveMaskedValue: false)").toBe("+45-__");

    q.inputValue = "+12-34";

    q.inputValue = "+45-__";
    expect(q.value, "incomplete unmasked value (saveMaskedValue: false)").toBeUndefined();
    expect(q.inputValue, "incomplete unmasked inputValue (saveMaskedValue: false)").toBe("+45-__");
  });

  test("Switch mask type", () => {
    const q = new QuestionTextModel("q1");
    expect(q.maskType).toBe("none");
    expect(q.maskSettings instanceof InputMaskBase).toBe(true);

    q.maskType = "pattern";
    expect(q.maskType).toBe("pattern");
    expect(q.maskSettings instanceof InputMaskPattern).toBe(true);

    q.maskType = "numeric";
    expect(q.maskType).toBe("numeric");
    expect(q.maskSettings instanceof InputMaskNumeric).toBe(true);

    q.maskType = "none";
    expect(q.maskType).toBe("none");
    expect(q.maskSettings instanceof InputMaskBase).toBe(true);
  });

  test("Switch input type", () => {
    const testInput = document.createElement("input");
    const q = new QuestionTextModel("q1");
    q["input"] = testInput;
    expect(q.maskTypeIsEmpty).toBeTruthy();
    expect(!q["maskInputAdapter"]).toBeTruthy();

    q.maskType = "pattern";
    expect(!q.maskTypeIsEmpty, "maskType = pattern").toBeTruthy();
    expect(q["maskInputAdapter"], "maskType = pattern").toBeTruthy();

    q.inputType = "date";
    expect(q.maskTypeIsEmpty, "inputType = date").toBeTruthy();
    expect(!q["maskInputAdapter"], "inputType = date").toBeTruthy();

    q.inputType = "text";
    expect(!q.maskTypeIsEmpty, "inputType = text").toBeTruthy();
    expect(q["maskInputAdapter"], "inputType = text").toBeTruthy();

    q.inputType = "tel";
    expect(!q.maskTypeIsEmpty, "inputType = tel").toBeTruthy();
    expect(q["maskInputAdapter"], "inputType = tel").toBeTruthy();

    testInput.remove();
  });

  test("Datetime mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "datetime";
    q.maskSettings.fromJSON({ pattern: "dd/mm/yyyy" });
    q.inputValue = "12/03/2024";
    expect(q.value, "unmasked value #1").toBe("2024-03-12");
    expect(q.inputValue, "unmasked inputValue #1").toBe("12/03/2024");

    q.inputValue = "12/03/202y";
    expect(q.value, "unmasked value #2").toBeUndefined();
    expect(q.inputValue, "unmasked inputValue #2").toBe("12/03/202y");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "12/03/2024";
    expect(q.value, "masked value #3").toBe("12/03/2024");
    expect(q.inputValue, "masked inputValue #3").toBe("12/03/2024");

    q.inputValue = "12/03/202y";
    expect(q.value, "masked value #4").toBeUndefined();
    expect(q.inputValue, "masked inputValue #4").toBe("12/03/202y");
  });

  test("Pattern mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "999-999" });
    q.inputValue = "123-456";
    expect(q.value, "unmasked value #1").toBe("123456");
    expect(q.inputValue, "unmasked inputValue #1").toBe("123-456");

    q.inputValue = "123-45_";
    expect(q.value, "unmasked value #2").toBeUndefined();
    expect(q.inputValue, "unmasked inputValue #2").toBe("123-45_");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "123-456";
    expect(q.value, "masked value #3").toBe("123-456");
    expect(q.inputValue, "masked inputValue #3").toBe("123-456");

    q.inputValue = "123-45_";
    expect(q.value, "masked value #4").toBeUndefined();
    expect(q.inputValue, "masked inputValue #4").toBe("123-45_");
  });

  test("Numeric mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    q.inputValue = "123,456";
    expect(q.value, "unmasked value #1").toBe(123456);
    expect(q.inputValue, "unmasked inputValue #1").toBe("123,456");

    q.inputValue = "123,456.";
    expect(q.value, "unmasked value #2").toBe(123456);
    expect(q.inputValue, "masked inputValue #2").toBe("123,456");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "123,456";
    expect(q.value, "masked value #3").toBe("123,456");
    expect(q.inputValue, "masked inputValue #3").toBe("123,456");

    q.inputValue = "123,456.";
    expect(q.value, "masked value #4").toBe("123,456");
    expect(q.inputValue, "masked inputValue #4").toBe("123,456");
  });

  test("Currency mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "currency";
    q.maskSettings.fromJSON({ prefix: "$ " });
    q.inputValue = "123,456";
    expect(q.value, "unmasked value #1").toBe(123456);
    expect(q.inputValue, "unmasked inputValue #1").toBe("$ 123,456");

    q.inputValue = "123,456.";
    expect(q.value, "unmasked value #2").toBe(123456);
    expect(q.inputValue, "masked inputValue #2").toBe("$ 123,456");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "123,456";
    expect(q.value, "masked value #3").toBe("$ 123,456");
    expect(q.inputValue, "masked inputValue #3").toBe("$ 123,456");

    q.inputValue = "123,456.";
    expect(q.value, "masked value #4").toBe("$ 123,456");
    expect(q.inputValue, "masked inputValue #4").toBe("$ 123,456");
  });

  test("Currency mask: text aligment", () => {
    const q = new QuestionTextModel("q1");
    expect(q.inputStyle).toEqual({ width: "" });

    q.maskType = "currency";
    expect(q.inputStyle).toEqual({ width: "", textAlign: "right" });

    q.inputTextAlignment = "left";
    expect(q.inputStyle).toEqual({ width: "", textAlign: "left" });
  });

  test("Text aligment inputType is date, maskType is numeric", () => {
    const q = new QuestionTextModel("q1");
    q.fromJSON({
      "type": "text",
      "name": "since-date",
      "inputType": "date",
      "maskType": "numeric"
    });
    expect(q.inputStyle).toEqual({ width: "" });
  });

  class IntegerMask extends InputMaskNumeric {
    public getType(): string {
      return "integermask";
    }
  }

  test("isNumeric", () => {
    Serializer.addClass("integermask", [],
      () => new IntegerMask(),
      "numericmask"
    );

    const q = new QuestionTextModel("q1");
    expect(q.maskType).toBe("none");
    expect(q.maskSettings.getTextAlignment()).toBe("auto");

    q.maskType = "numeric";
    expect(q.maskSettings.getTextAlignment()).toBe("right");

    q.maskType = "datetime";
    expect(q.maskSettings.getTextAlignment()).toBe("auto");

    q.maskType = "currency";
    expect(q.maskSettings.getTextAlignment()).toBe("right");

    q.maskType = "pattern";
    expect(q.maskSettings.getTextAlignment()).toBe("auto");

    q.maskType = "integer";
    expect(q.maskSettings.getTextAlignment()).toBe("right");

    Serializer.removeClass("integermask");
  });

  test("isNumeric: load form data", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "puslapis1",
          elements: [
            {
              type: "text",
              name: "klausimas298",
              maskType: "numeric",
              maskSettings: { decimalSeparator: ",", thousandsSeparator: " " },
            },
            {
              type: "text",
              name: "klausimas",
              maskType: "numeric",
              maskSettings: { decimalSeparator: ",", thousandsSeparator: " " },
            },
          ],
        },
      ],
    });
    survey.data = { klausimas298: "10000.99", klausimas: 10000.99 };
    const q1 = survey.getQuestionByName("klausimas298") as QuestionTextModel;
    const q2 = survey.getQuestionByName("klausimas") as QuestionTextModel;

    expect(q1.value).toBe("10000.99");
    expect(q1.inputValue).toBe("10 000,99");
    expect(q2.value).toBe(10000.99);
    expect(q2.inputValue).toBe("10 000,99");
  });

  test("mask settings changes trigger survey.onPropertyValueChangedCallback", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              "maskType": "numeric",
              "maskSettings": {
                "thousandsSeparator": "."
              }
            }
          ]
        }
      ]
    });
    let propName = "not triggered";
    survey.onPropertyValueChangedCallback = (
      name: string,
      oldValue: any,
      newValue: any,
      sender: Base,
      arrayChanges: ArrayChanges
    ) => {
      propName += "->name:" + name;
    };

    const maskedQuestion = survey.getQuestionByName("question1") as QuestionTextModel;
    (maskedQuestion.maskSettings as any).thousandsSeparator = "-";
    expect(propName).toBe("not triggered->name:thousandsSeparator");
  });

  test("Inputmask: saveMaskedValue: true doesn't work on changing value outside the input", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    expect(q.value, "empty value").toBeUndefined();
    expect(q.inputValue, "empty inputValue").toBe("");

    q.value = 12345;
    expect(q.value, "q.value #1").toBe(12345);
    expect(q.inputValue, "q.inputValue #1").toBe("12,345");

    q.maskSettings.saveMaskedValue = true;
    q.value = 54321;
    expect(q.value, "q.value #2").toBe("54,321");
    expect(q.inputValue, "q.inputValue #2").toBe("54,321");

    q.value = 54.321;
    expect(q.value, "q.value #3").toBe("54.32");
    expect(q.inputValue, "q.inputValue #3").toBe("54.32");
  });

  test("Inputmask: saveMaskedValue: true & decimalSeparator ',' , doesn't work on changing value outside the input", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    q.maskSettings.saveMaskedValue = true;
    (<InputMaskNumeric>q.maskSettings).decimalSeparator = ",";
    (<InputMaskNumeric>q.maskSettings).thousandsSeparator = " ";
    expect(q.value, "empty value").toBeUndefined();
    expect(q.inputValue, "empty inputValue").toBe("");

    q.value = 54321;
    expect(q.value, "q.value #1").toBe("54 321");
    expect(q.inputValue, "q.inputValue #1").toBe("54 321");

    q.value = 54.321;
    expect(q.value, "q.value #2").toBe("54,32");
    expect(q.inputValue, "q.inputValue #2").toBe("54,32");
  });

  test("Currency Input Mask: update the prefix at runtime", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "currency";

    const maskSettings = <InputMaskCurrency>q.maskSettings;
    maskSettings.prefix = "*";
    expect(q.value, "empty value").toBeUndefined();
    expect(q.inputValue, "empty inputValue").toBe("");

    q.value = 123;
    expect(q.value, "q.value #1").toBe(123);
    expect(q.inputValue, "q.inputValue #1").toBe("*123");

    maskSettings.prefix = "$";
    expect(q.value, "q.value #2").toBe(123);
    expect(q.inputValue, "q.inputValue #2").toBe("$123");
  });

  test("Pattern mask: validation error on incomplete pattern value", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "phone",
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }
      ]
    });
    const q = survey.getQuestionByName("phone") as QuestionTextModel;

    // Complete value - no error
    q.inputValue = "+12-34";
    expect(q.value, "complete value").toBe("1234");
    expect(q.validate(), "no errors for complete value").toBe(true);
    expect(q.errors.length, "no errors array for complete value").toBe(0);

    // Incomplete value - should produce error
    q.inputValue = "+12-__";
    expect(q.value, "incomplete value is undefined").toBeUndefined();
    expect(q.validate(), "has errors for incomplete value").toBe(false);
    expect(q.errors.length, "one error for incomplete value").toBe(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError").toBe("patternincompleteerror");
    expect(q.errors[0].getText(), "error text from localization").toBe("Please complete the value to match the required format.");

    // Empty value (untouched) - no error (not required)
    q.inputValue = "+__-__";
    expect(q.value, "empty value is undefined").toBeUndefined();
    expect(q.validate(), "no errors for empty value when not required").toBe(true);
    expect(q.errors.length, "no errors for empty mask").toBe(0);
  });

  test("Pattern mask: incomplete value replaces required error", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "phone",
          isRequired: true,
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }
      ]
    });
    const q = survey.getQuestionByName("phone") as QuestionTextModel;

    // Incomplete value on required field - should show incomplete error, not required error
    q.inputValue = "+12-__";
    expect(q.validate(), "has errors for incomplete value").toBe(false);
    expect(q.errors.length, "one error").toBe(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError, not AnswerRequiredError").toBe("patternincompleteerror");

    // Empty value on required field - should show required error
    q.inputValue = "+__-__";
    expect(q.validate(), "has errors for empty required field").toBe(false);
    expect(q.errors.length, "one error for required").toBe(1);
    expect(q.errors[0].getErrorType(), "required error for empty field").toBe("required");
  });

  test("Pattern mask: tryComplete with incomplete value - show error, fix, complete", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "phone",
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }
      ]
    });
    const q = survey.getQuestionByName("phone") as QuestionTextModel;

    // Set incomplete value and try to complete - should fail
    q.inputValue = "+12-__";
    expect(q.value, "incomplete value is undefined").toBeUndefined();
    const result1 = survey.tryComplete();
    expect(result1, "tryComplete fails with incomplete mask").toBe(false);
    expect(survey.state, "survey is still running").toBe("running");
    expect(q.errors.length, "one error shown").toBe(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError").toBe("patternincompleteerror");

    // Fix the value - complete the mask
    q.inputValue = "+12-34";
    expect(q.value, "value is now complete").toBe("1234");
    expect(q.errors.length, "errors are cleared after fixing").toBe(0);

    // Try to complete again - should succeed
    const result2 = survey.tryComplete();
    expect(result2, "tryComplete succeeds with complete value").toBe(true);
    expect(survey.state, "survey is completed").toBe("completed");
  });

  test("Pattern mask: checkErrorsMode onValueChanged - add/clear errors", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "text",
          name: "phone",
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }
      ]
    });
    const q = survey.getQuestionByName("phone") as QuestionTextModel;

    // Initially no errors
    expect(q.errors.length, "no errors initially").toBe(0);

    // Enter a complete value - no errors
    q.inputValue = "+12-34";
    expect(q.value, "complete value").toBe("1234");
    expect(q.errors.length, "no errors for complete value").toBe(0);

    // Change to incomplete value - error should appear
    q.inputValue = "+56-__";
    expect(q.value, "incomplete value is undefined").toBeUndefined();
    expect(q.errors.length, "error appears on value change to incomplete").toBe(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError").toBe("patternincompleteerror");

    // Fix the value - error should clear
    q.inputValue = "+56-78";
    expect(q.value, "value is complete again").toBe("5678");
    expect(q.errors.length, "error cleared after completing the mask").toBe(0);

    // Clear the value entirely - no error (not required)
    q.inputValue = "+__-__";
    expect(q.value, "empty value").toBeUndefined();
    expect(q.errors.length, "no error for empty non-required field").toBe(0);
  });

  test("Pattern mask: checkErrorsMode onValueChanged with isRequired", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "text",
          name: "phone",
          isRequired: true,
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }
      ]
    });
    const q = survey.getQuestionByName("phone") as QuestionTextModel;

    // Enter a complete value first
    q.inputValue = "+12-34";
    expect(q.value, "complete value").toBe("1234");
    expect(q.errors.length, "no errors for complete value").toBe(0);

    // Change to incomplete - should show incomplete error, not required
    q.inputValue = "+12-__";
    expect(q.errors.length, "one error for incomplete").toBe(1);
    expect(q.errors[0].getErrorType(), "incomplete error, not required error").toBe("patternincompleteerror");

    // Complete the value again - errors cleared
    q.inputValue = "+12-56";
    expect(q.value, "complete value again").toBe("1256");
    expect(q.errors.length, "errors cleared").toBe(0);
  });
});
