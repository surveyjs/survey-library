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
    expect(q.maskType).toLooseEqual("none");
    expect(q.maskSettings.getType()).toLooseEqual("masksettings");
    expect(!!q["maskInputAdapter"]).toLooseEqual(false);

    q.maskType = "pattern";
    expect(q.maskType).toLooseEqual("pattern");
    expect(q.maskSettings.getType()).toLooseEqual("patternmask");
    expect(!!q["maskInputAdapter"]).toLooseEqual(true);

    testInput.remove();
  });

  test("Apply mask", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "+99-99" });
    q.value = "1234";
    expect(q.value).toLooseEqual("1234");
    expect(q.inputValue).toLooseEqual("+12-34");

    q.inputValue = "+78-68";
    expect(q.value).toLooseEqual("7868");
    expect(q.inputValue).toLooseEqual("+78-68");
  });

  test("Pattern mask: value is completed", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

    q.inputValue = "+12-34";
    expect(q.value, "masked value").toLooseEqual("+12-34");
    expect(q.inputValue, "masked inputValue").toLooseEqual("+12-34");

    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });
    q.inputValue = "+45-67";
    expect(q.value, "unmasked value").toLooseEqual("4567");
    expect(q.inputValue, "unmasked inputValue").toLooseEqual("+45-67");
  });

  test("Pattern mask: value is incompleted", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

    q.inputValue = "+12-__";
    expect(q.value, "incomplete masked value").toLooseEqual(undefined);
    expect(q.inputValue, "incomplete masked inputValue").toLooseEqual("+12-__");

    q.inputValue = "+12-34";

    q.inputValue = "+12-__";
    expect(q.value, "incomplete masked value").toLooseEqual(undefined);
    expect(q.inputValue, "incomplete masked inputValue").toLooseEqual("+12-__");

    q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });

    q.inputValue = "+45-__";
    expect(q.value, "incomplete unmasked value (saveMaskedValue: false)").toLooseEqual(undefined);
    expect(q.inputValue, "incomplete unmasked inputValue (saveMaskedValue: false)").toLooseEqual("+45-__");

    q.inputValue = "+12-34";

    q.inputValue = "+45-__";
    expect(q.value, "incomplete unmasked value (saveMaskedValue: false)").toLooseEqual(undefined);
    expect(q.inputValue, "incomplete unmasked inputValue (saveMaskedValue: false)").toLooseEqual("+45-__");
  });

  test("Switch mask type", () => {
    const q = new QuestionTextModel("q1");
    expect(q.maskType).toLooseEqual("none");
    expect(q.maskSettings instanceof InputMaskBase).toLooseEqual(true);

    q.maskType = "pattern";
    expect(q.maskType).toLooseEqual("pattern");
    expect(q.maskSettings instanceof InputMaskPattern).toLooseEqual(true);

    q.maskType = "numeric";
    expect(q.maskType).toLooseEqual("numeric");
    expect(q.maskSettings instanceof InputMaskNumeric).toLooseEqual(true);

    q.maskType = "none";
    expect(q.maskType).toLooseEqual("none");
    expect(q.maskSettings instanceof InputMaskBase).toLooseEqual(true);
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
    expect(q.value, "unmasked value #1").toLooseEqual("2024-03-12");
    expect(q.inputValue, "unmasked inputValue #1").toLooseEqual("12/03/2024");

    q.inputValue = "12/03/202y";
    expect(q.value, "unmasked value #2").toLooseEqual(undefined);
    expect(q.inputValue, "unmasked inputValue #2").toLooseEqual("12/03/202y");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "12/03/2024";
    expect(q.value, "masked value #3").toLooseEqual("12/03/2024");
    expect(q.inputValue, "masked inputValue #3").toLooseEqual("12/03/2024");

    q.inputValue = "12/03/202y";
    expect(q.value, "masked value #4").toLooseEqual(undefined);
    expect(q.inputValue, "masked inputValue #4").toLooseEqual("12/03/202y");
  });

  test("Pattern mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "pattern";
    q.maskSettings.fromJSON({ pattern: "999-999" });
    q.inputValue = "123-456";
    expect(q.value, "unmasked value #1").toLooseEqual("123456");
    expect(q.inputValue, "unmasked inputValue #1").toLooseEqual("123-456");

    q.inputValue = "123-45_";
    expect(q.value, "unmasked value #2").toLooseEqual(undefined);
    expect(q.inputValue, "unmasked inputValue #2").toLooseEqual("123-45_");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "123-456";
    expect(q.value, "masked value #3").toLooseEqual("123-456");
    expect(q.inputValue, "masked inputValue #3").toLooseEqual("123-456");

    q.inputValue = "123-45_";
    expect(q.value, "masked value #4").toLooseEqual(undefined);
    expect(q.inputValue, "masked inputValue #4").toLooseEqual("123-45_");
  });

  test("Numeric mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    q.inputValue = "123,456";
    expect(q.value, "unmasked value #1").toLooseEqual(123456);
    expect(q.inputValue, "unmasked inputValue #1").toLooseEqual("123,456");

    q.inputValue = "123,456.";
    expect(q.value, "unmasked value #2").toLooseEqual(123456);
    expect(q.inputValue, "masked inputValue #2").toLooseEqual("123,456");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "123,456";
    expect(q.value, "masked value #3").toLooseEqual("123,456");
    expect(q.inputValue, "masked inputValue #3").toLooseEqual("123,456");

    q.inputValue = "123,456.";
    expect(q.value, "masked value #4").toLooseEqual("123,456");
    expect(q.inputValue, "masked inputValue #4").toLooseEqual("123,456");
  });

  test("Currency mask: value & inputValue", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "currency";
    q.maskSettings.fromJSON({ prefix: "$ " });
    q.inputValue = "123,456";
    expect(q.value, "unmasked value #1").toLooseEqual(123456);
    expect(q.inputValue, "unmasked inputValue #1").toLooseEqual("$ 123,456");

    q.inputValue = "123,456.";
    expect(q.value, "unmasked value #2").toLooseEqual(123456);
    expect(q.inputValue, "masked inputValue #2").toLooseEqual("$ 123,456");

    q.maskSettings.saveMaskedValue = true;

    q.inputValue = "123,456";
    expect(q.value, "masked value #3").toLooseEqual("$ 123,456");
    expect(q.inputValue, "masked inputValue #3").toLooseEqual("$ 123,456");

    q.inputValue = "123,456.";
    expect(q.value, "masked value #4").toLooseEqual("$ 123,456");
    expect(q.inputValue, "masked inputValue #4").toLooseEqual("$ 123,456");
  });

  test("Currency mask: text aligment", () => {
    const q = new QuestionTextModel("q1");
    expect(q.inputStyle).toEqualValues({ width: "" });

    q.maskType = "currency";
    expect(q.inputStyle).toEqualValues({ width: "", textAlign: "right" });

    q.inputTextAlignment = "left";
    expect(q.inputStyle).toEqualValues({ width: "", textAlign: "left" });
  });

  test("Text aligment inputType is date, maskType is numeric", () => {
    const q = new QuestionTextModel("q1");
    q.fromJSON({
      "type": "text",
      "name": "since-date",
      "inputType": "date",
      "maskType": "numeric"
    });
    expect(q.inputStyle).toEqualValues({ width: "" });
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
    expect(q.maskType).toLooseEqual("none");
    expect(q.maskSettings.getTextAlignment()).toLooseEqual("auto");

    q.maskType = "numeric";
    expect(q.maskSettings.getTextAlignment()).toLooseEqual("right");

    q.maskType = "datetime";
    expect(q.maskSettings.getTextAlignment()).toLooseEqual("auto");

    q.maskType = "currency";
    expect(q.maskSettings.getTextAlignment()).toLooseEqual("right");

    q.maskType = "pattern";
    expect(q.maskSettings.getTextAlignment()).toLooseEqual("auto");

    q.maskType = "integer";
    expect(q.maskSettings.getTextAlignment()).toLooseEqual("right");

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

    expect(q1.value).toLooseEqual("10000.99");
    expect(q1.inputValue).toLooseEqual("10 000,99");
    expect(q2.value).toLooseEqual("10000.99");
    expect(q2.inputValue).toLooseEqual("10 000,99");
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
    expect(propName).toLooseEqual("not triggered->name:thousandsSeparator");
  });

  test("Inputmask: saveMaskedValue: true doesn't work on changing value outside the input", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    expect(q.value, "empty value").toLooseEqual(undefined);
    expect(q.inputValue, "empty inputValue").toLooseEqual("");

    q.value = 12345;
    expect(q.value, "q.value #1").toLooseEqual(12345);
    expect(q.inputValue, "q.inputValue #1").toLooseEqual("12,345");

    q.maskSettings.saveMaskedValue = true;
    q.value = 54321;
    expect(q.value, "q.value #2").toLooseEqual("54,321");
    expect(q.inputValue, "q.inputValue #2").toLooseEqual("54,321");

    q.value = 54.321;
    expect(q.value, "q.value #3").toLooseEqual("54.32");
    expect(q.inputValue, "q.inputValue #3").toLooseEqual("54.32");
  });

  test("Inputmask: saveMaskedValue: true & decimalSeparator ',' , doesn't work on changing value outside the input", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    q.maskSettings.saveMaskedValue = true;
    (<InputMaskNumeric>q.maskSettings).decimalSeparator = ",";
    (<InputMaskNumeric>q.maskSettings).thousandsSeparator = " ";
    expect(q.value, "empty value").toLooseEqual(undefined);
    expect(q.inputValue, "empty inputValue").toLooseEqual("");

    q.value = 54321;
    expect(q.value, "q.value #1").toLooseEqual("54 321");
    expect(q.inputValue, "q.inputValue #1").toLooseEqual("54 321");

    q.value = 54.321;
    expect(q.value, "q.value #2").toLooseEqual("54,32");
    expect(q.inputValue, "q.inputValue #2").toLooseEqual("54,32");
  });

  test("Currency Input Mask: update the prefix at runtime", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "currency";

    const maskSettings = <InputMaskCurrency>q.maskSettings;
    maskSettings.prefix = "*";
    expect(q.value, "empty value").toLooseEqual(undefined);
    expect(q.inputValue, "empty inputValue").toLooseEqual("");

    q.value = 123;
    expect(q.value, "q.value #1").toLooseEqual("123");
    expect(q.inputValue, "q.inputValue #1").toLooseEqual("*123");

    maskSettings.prefix = "$";
    expect(q.value, "q.value #2").toLooseEqual("123");
    expect(q.inputValue, "q.inputValue #2").toLooseEqual("$123");
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
    expect(q.value, "complete value").toLooseEqual("1234");
    expect(q.validate(), "no errors for complete value").toLooseEqual(true);
    expect(q.errors.length, "no errors array for complete value").toLooseEqual(0);

    // Incomplete value - should produce error
    q.inputValue = "+12-__";
    expect(q.value, "incomplete value is undefined").toLooseEqual(undefined);
    expect(q.validate(), "has errors for incomplete value").toLooseEqual(false);
    expect(q.errors.length, "one error for incomplete value").toLooseEqual(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError").toLooseEqual("patternincompleteerror");
    expect(q.errors[0].getText(), "error text from localization").toLooseEqual("Please complete the value to match the required format.");

    // Empty value (untouched) - no error (not required)
    q.inputValue = "+__-__";
    expect(q.value, "empty value is undefined").toLooseEqual(undefined);
    expect(q.validate(), "no errors for empty value when not required").toLooseEqual(true);
    expect(q.errors.length, "no errors for empty mask").toLooseEqual(0);
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
    expect(q.validate(), "has errors for incomplete value").toLooseEqual(false);
    expect(q.errors.length, "one error").toLooseEqual(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError, not AnswerRequiredError").toLooseEqual("patternincompleteerror");

    // Empty value on required field - should show required error
    q.inputValue = "+__-__";
    expect(q.validate(), "has errors for empty required field").toLooseEqual(false);
    expect(q.errors.length, "one error for required").toLooseEqual(1);
    expect(q.errors[0].getErrorType(), "required error for empty field").toLooseEqual("required");
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
    expect(q.value, "incomplete value is undefined").toLooseEqual(undefined);
    const result1 = survey.tryComplete();
    expect(result1, "tryComplete fails with incomplete mask").toLooseEqual(false);
    expect(survey.state, "survey is still running").toLooseEqual("running");
    expect(q.errors.length, "one error shown").toLooseEqual(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError").toLooseEqual("patternincompleteerror");

    // Fix the value - complete the mask
    q.inputValue = "+12-34";
    expect(q.value, "value is now complete").toLooseEqual("1234");
    expect(q.errors.length, "errors are cleared after fixing").toLooseEqual(0);

    // Try to complete again - should succeed
    const result2 = survey.tryComplete();
    expect(result2, "tryComplete succeeds with complete value").toLooseEqual(true);
    expect(survey.state, "survey is completed").toLooseEqual("completed");
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
    expect(q.errors.length, "no errors initially").toLooseEqual(0);

    // Enter a complete value - no errors
    q.inputValue = "+12-34";
    expect(q.value, "complete value").toLooseEqual("1234");
    expect(q.errors.length, "no errors for complete value").toLooseEqual(0);

    // Change to incomplete value - error should appear
    q.inputValue = "+56-__";
    expect(q.value, "incomplete value is undefined").toLooseEqual(undefined);
    expect(q.errors.length, "error appears on value change to incomplete").toLooseEqual(1);
    expect(q.errors[0].getErrorType(), "error is PatternIncompleteError").toLooseEqual("patternincompleteerror");

    // Fix the value - error should clear
    q.inputValue = "+56-78";
    expect(q.value, "value is complete again").toLooseEqual("5678");
    expect(q.errors.length, "error cleared after completing the mask").toLooseEqual(0);

    // Clear the value entirely - no error (not required)
    q.inputValue = "+__-__";
    expect(q.value, "empty value").toLooseEqual(undefined);
    expect(q.errors.length, "no error for empty non-required field").toLooseEqual(0);
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
    expect(q.value, "complete value").toLooseEqual("1234");
    expect(q.errors.length, "no errors for complete value").toLooseEqual(0);

    // Change to incomplete - should show incomplete error, not required
    q.inputValue = "+12-__";
    expect(q.errors.length, "one error for incomplete").toLooseEqual(1);
    expect(q.errors[0].getErrorType(), "incomplete error, not required error").toLooseEqual("patternincompleteerror");

    // Complete the value again - errors cleared
    q.inputValue = "+12-56";
    expect(q.value, "complete value again").toLooseEqual("1256");
    expect(q.errors.length, "errors cleared").toLooseEqual(0);
  });
});
