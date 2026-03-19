import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { QuestionTextModel } from "../../src/question_text";
import { Serializer } from "../../src/jsonobject";
import { SurveyModel } from "../../src/survey";
import { ArrayChanges, Base } from "../../src/base";

export default QUnit.module("Question text: Input mask");

QUnit.test("Initial mask settings", function (assert) {
  const testInput = document.createElement("input");

  const q = new QuestionTextModel("q1");
  q.input = testInput;
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings.getType(), "masksettings");
  assert.equal(!!q["maskInputAdapter"], false);

  q.maskType = "pattern";
  assert.equal(q.maskType, "pattern");
  assert.equal(q.maskSettings.getType(), "patternmask");
  assert.equal(!!q["maskInputAdapter"], true);

  testInput.remove();
});

QUnit.test("Apply mask", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "+99-99" });
  q.value = "1234";
  assert.equal(q.value, "1234");
  assert.equal(q.inputValue, "+12-34");

  q.inputValue = "+78-68";
  assert.equal(q.value, "7868");
  assert.equal(q.inputValue, "+78-68");
});

QUnit.test("Pattern mask: value is completed", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

  q.inputValue = "+12-34";
  assert.equal(q.value, "+12-34", "masked value");
  assert.equal(q.inputValue, "+12-34", "masked inputValue");

  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });
  q.inputValue = "+45-67";
  assert.equal(q.value, "4567", "unmasked value");
  assert.equal(q.inputValue, "+45-67", "unmasked inputValue");
});

QUnit.test("Pattern mask: value is incompleted", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: true });

  q.inputValue = "+12-__";
  assert.equal(q.value, undefined, "incomplete masked value");
  assert.equal(q.inputValue, "+12-__", "incomplete masked inputValue");

  q.inputValue = "+12-34";

  q.inputValue = "+12-__";
  assert.equal(q.value, undefined, "incomplete masked value");
  assert.equal(q.inputValue, "+12-__", "incomplete masked inputValue");

  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });

  q.inputValue = "+45-__";
  assert.equal(q.value, undefined, "incomplete unmasked value (saveMaskedValue: false)");
  assert.equal(q.inputValue, "+45-__", "incomplete unmasked inputValue (saveMaskedValue: false)");

  q.inputValue = "+12-34";

  q.inputValue = "+45-__";
  assert.equal(q.value, undefined, "incomplete unmasked value (saveMaskedValue: false)");
  assert.equal(q.inputValue, "+45-__", "incomplete unmasked inputValue (saveMaskedValue: false)");
});

QUnit.test("Switch mask type", function (assert) {
  const q = new QuestionTextModel("q1");
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings instanceof InputMaskBase, true);

  q.maskType = "pattern";
  assert.equal(q.maskType, "pattern");
  assert.equal(q.maskSettings instanceof InputMaskPattern, true);

  q.maskType = "numeric";
  assert.equal(q.maskType, "numeric");
  assert.equal(q.maskSettings instanceof InputMaskNumeric, true);

  q.maskType = "none";
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings instanceof InputMaskBase, true);
});

QUnit.test("Switch input type", function (assert) {
  const testInput = document.createElement("input");
  const q = new QuestionTextModel("q1");
  q["input"] = testInput;
  assert.ok(q.maskTypeIsEmpty);
  assert.ok(!q["maskInputAdapter"]);

  q.maskType = "pattern";
  assert.ok(!q.maskTypeIsEmpty, "maskType = pattern");
  assert.ok(q["maskInputAdapter"], "maskType = pattern");

  q.inputType = "date";
  assert.ok(q.maskTypeIsEmpty, "inputType = date");
  assert.ok(!q["maskInputAdapter"], "inputType = date");

  q.inputType = "text";
  assert.ok(!q.maskTypeIsEmpty, "inputType = text");
  assert.ok(q["maskInputAdapter"], "inputType = text");

  q.inputType = "tel";
  assert.ok(!q.maskTypeIsEmpty, "inputType = tel");
  assert.ok(q["maskInputAdapter"], "inputType = tel");

  testInput.remove();
});

QUnit.test("Datetime mask: value & inputValue", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "datetime";
  q.maskSettings.fromJSON({ pattern: "dd/mm/yyyy" });
  q.inputValue = "12/03/2024";
  assert.equal(q.value, "2024-03-12", "unmasked value #1");
  assert.equal(q.inputValue, "12/03/2024", "unmasked inputValue #1");

  q.inputValue = "12/03/202y";
  assert.equal(q.value, undefined, "unmasked value #2");
  assert.equal(q.inputValue, "12/03/202y", "unmasked inputValue #2");

  q.maskSettings.saveMaskedValue = true;

  q.inputValue = "12/03/2024";
  assert.equal(q.value, "12/03/2024", "masked value #3");
  assert.equal(q.inputValue, "12/03/2024", "masked inputValue #3");

  q.inputValue = "12/03/202y";
  assert.equal(q.value, undefined, "masked value #4");
  assert.equal(q.inputValue, "12/03/202y", "masked inputValue #4");
});

QUnit.test("Pattern mask: value & inputValue", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "999-999" });
  q.inputValue = "123-456";
  assert.equal(q.value, "123456", "unmasked value #1");
  assert.equal(q.inputValue, "123-456", "unmasked inputValue #1");

  q.inputValue = "123-45_";
  assert.equal(q.value, undefined, "unmasked value #2");
  assert.equal(q.inputValue, "123-45_", "unmasked inputValue #2");

  q.maskSettings.saveMaskedValue = true;

  q.inputValue = "123-456";
  assert.equal(q.value, "123-456", "masked value #3");
  assert.equal(q.inputValue, "123-456", "masked inputValue #3");

  q.inputValue = "123-45_";
  assert.equal(q.value, undefined, "masked value #4");
  assert.equal(q.inputValue, "123-45_", "masked inputValue #4");
});

QUnit.test("Numeric mask: value & inputValue", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "numeric";
  q.inputValue = "123,456";
  assert.equal(q.value, 123456, "unmasked value #1");
  assert.equal(q.inputValue, "123,456", "unmasked inputValue #1");

  q.inputValue = "123,456.";
  assert.equal(q.value, 123456, "unmasked value #2");
  assert.equal(q.inputValue, "123,456", "masked inputValue #2");

  q.maskSettings.saveMaskedValue = true;

  q.inputValue = "123,456";
  assert.equal(q.value, "123,456", "masked value #3");
  assert.equal(q.inputValue, "123,456", "masked inputValue #3");

  q.inputValue = "123,456.";
  assert.equal(q.value, "123,456", "masked value #4");
  assert.equal(q.inputValue, "123,456", "masked inputValue #4");
});

QUnit.test("Currency mask: value & inputValue", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "currency";
  q.maskSettings.fromJSON({ prefix: "$ " });
  q.inputValue = "123,456";
  assert.equal(q.value, 123456, "unmasked value #1");
  assert.equal(q.inputValue, "$ 123,456", "unmasked inputValue #1");

  q.inputValue = "123,456.";
  assert.equal(q.value, 123456, "unmasked value #2");
  assert.equal(q.inputValue, "$ 123,456", "masked inputValue #2");

  q.maskSettings.saveMaskedValue = true;

  q.inputValue = "123,456";
  assert.equal(q.value, "$ 123,456", "masked value #3");
  assert.equal(q.inputValue, "$ 123,456", "masked inputValue #3");

  q.inputValue = "123,456.";
  assert.equal(q.value, "$ 123,456", "masked value #4");
  assert.equal(q.inputValue, "$ 123,456", "masked inputValue #4");
});

QUnit.test("Currency mask: text aligment", function (assert) {
  const q = new QuestionTextModel("q1");
  assert.deepEqual(q.inputStyle, { width: "" });

  q.maskType = "currency";
  assert.deepEqual(q.inputStyle, { width: "", textAlign: "right" });

  q.inputTextAlignment = "left";
  assert.deepEqual(q.inputStyle, { width: "", textAlign: "left" });
});

QUnit.test("Text aligment inputType is date, maskType is numeric", function (assert) {
  const q = new QuestionTextModel("q1");
  q.fromJSON({
    "type": "text",
    "name": "since-date",
    "inputType": "date",
    "maskType": "numeric"
  });
  assert.deepEqual(q.inputStyle, { width: "" });
});

class IntegerMask extends InputMaskNumeric {
  public getType(): string {
    return "integermask";
  }
}

QUnit.test("isNumeric", function (assert) {
  Serializer.addClass("integermask", [],
    () => new IntegerMask(),
    "numericmask"
  );

  const q = new QuestionTextModel("q1");
  assert.equal(q.maskType, "none");
  assert.equal(q.maskSettings.getTextAlignment(), "auto");

  q.maskType = "numeric";
  assert.equal(q.maskSettings.getTextAlignment(), "right");

  q.maskType = "datetime";
  assert.equal(q.maskSettings.getTextAlignment(), "auto");

  q.maskType = "currency";
  assert.equal(q.maskSettings.getTextAlignment(), "right");

  q.maskType = "pattern";
  assert.equal(q.maskSettings.getTextAlignment(), "auto");

  q.maskType = "integer";
  assert.equal(q.maskSettings.getTextAlignment(), "right");

  Serializer.removeClass("integermask");
});

QUnit.test("isNumeric: load form data", function (assert) {
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

  assert.equal(q1.value, "10000.99");
  assert.equal(q1.inputValue, "10 000,99");
  assert.equal(q2.value, "10000.99");
  assert.equal(q2.inputValue, "10 000,99");
});

QUnit.test("mask settings changes trigger survey.onPropertyValueChangedCallback", function (assert) {
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
  assert.equal(propName, "not triggered->name:thousandsSeparator");
});

QUnit.test("Inputmask: saveMaskedValue: true doesn't work on changing value outside the input", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "numeric";
  assert.equal(q.value, undefined, "empty value");
  assert.equal(q.inputValue, "", "empty inputValue");

  q.value = 12345;
  assert.equal(q.value, 12345, "q.value #1");
  assert.equal(q.inputValue, "12,345", "q.inputValue #1");

  q.maskSettings.saveMaskedValue = true;
  q.value = 54321;
  assert.equal(q.value, "54,321", "q.value #2");
  assert.equal(q.inputValue, "54,321", "q.inputValue #2");

  q.value = 54.321;
  assert.equal(q.value, "54.32", "q.value #3");
  assert.equal(q.inputValue, "54.32", "q.inputValue #3");
});

QUnit.test("Inputmask: saveMaskedValue: true & decimalSeparator ',' , doesn't work on changing value outside the input", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "numeric";
  q.maskSettings.saveMaskedValue = true;
  (<InputMaskNumeric>q.maskSettings).decimalSeparator = ",";
  (<InputMaskNumeric>q.maskSettings).thousandsSeparator = " ";
  assert.equal(q.value, undefined, "empty value");
  assert.equal(q.inputValue, "", "empty inputValue");

  q.value = 54321;
  assert.equal(q.value, "54 321", "q.value #1");
  assert.equal(q.inputValue, "54 321", "q.inputValue #1");

  q.value = 54.321;
  assert.equal(q.value, "54,32", "q.value #2");
  assert.equal(q.inputValue, "54,32", "q.inputValue #2");
});

QUnit.test("Currency Input Mask: update the prefix at runtime", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "currency";

  const maskSettings = <InputMaskCurrency>q.maskSettings;
  maskSettings.prefix = "*";
  assert.equal(q.value, undefined, "empty value");
  assert.equal(q.inputValue, "", "empty inputValue");

  q.value = 123;
  assert.equal(q.value, "123", "q.value #1");
  assert.equal(q.inputValue, "*123", "q.inputValue #1");

  maskSettings.prefix = "$";
  assert.equal(q.value, "123", "q.value #2");
  assert.equal(q.inputValue, "$123", "q.inputValue #2");
});

QUnit.test("Pattern mask: validation error on incomplete pattern value", function (assert) {
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
  assert.equal(q.value, "1234", "complete value");
  assert.equal(q.validate(), true, "no errors for complete value");
  assert.equal(q.errors.length, 0, "no errors array for complete value");

  // Incomplete value - should produce error
  q.inputValue = "+12-__";
  assert.equal(q.value, undefined, "incomplete value is undefined");
  assert.equal(q.validate(), false, "has errors for incomplete value");
  assert.equal(q.errors.length, 1, "one error for incomplete value");
  assert.equal(q.errors[0].getErrorType(), "patternincompleteerror", "error is PatternIncompleteError");
  assert.equal(q.errors[0].getText(), "Please complete the value to match the required format.", "error text from localization");

  // Empty value (untouched) - no error (not required)
  q.inputValue = "+__-__";
  assert.equal(q.value, undefined, "empty value is undefined");
  assert.equal(q.validate(), true, "no errors for empty value when not required");
  assert.equal(q.errors.length, 0, "no errors for empty mask");
});

QUnit.test("Pattern mask: incomplete value replaces required error", function (assert) {
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
  assert.equal(q.validate(), false, "has errors for incomplete value");
  assert.equal(q.errors.length, 1, "one error");
  assert.equal(q.errors[0].getErrorType(), "patternincompleteerror", "error is PatternIncompleteError, not AnswerRequiredError");

  // Empty value on required field - should show required error
  q.inputValue = "+__-__";
  assert.equal(q.validate(), false, "has errors for empty required field");
  assert.equal(q.errors.length, 1, "one error for required");
  assert.equal(q.errors[0].getErrorType(), "required", "required error for empty field");
});

QUnit.test("Pattern mask: tryComplete with incomplete value - show error, fix, complete", function (assert) {
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
  assert.equal(q.value, undefined, "incomplete value is undefined");
  const result1 = survey.tryComplete();
  assert.equal(result1, false, "tryComplete fails with incomplete mask");
  assert.equal(survey.state, "running", "survey is still running");
  assert.equal(q.errors.length, 1, "one error shown");
  assert.equal(q.errors[0].getErrorType(), "patternincompleteerror", "error is PatternIncompleteError");

  // Fix the value - complete the mask
  q.inputValue = "+12-34";
  assert.equal(q.value, "1234", "value is now complete");
  assert.equal(q.errors.length, 0, "errors are cleared after fixing");

  // Try to complete again - should succeed
  const result2 = survey.tryComplete();
  assert.equal(result2, true, "tryComplete succeeds with complete value");
  assert.equal(survey.state, "completed", "survey is completed");
});

QUnit.test("Pattern mask: checkErrorsMode onValueChanged - add/clear errors", function (assert) {
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
  assert.equal(q.errors.length, 0, "no errors initially");

  // Enter a complete value - no errors
  q.inputValue = "+12-34";
  assert.equal(q.value, "1234", "complete value");
  assert.equal(q.errors.length, 0, "no errors for complete value");

  // Change to incomplete value - error should appear
  q.inputValue = "+56-__";
  assert.equal(q.value, undefined, "incomplete value is undefined");
  assert.equal(q.errors.length, 1, "error appears on value change to incomplete");
  assert.equal(q.errors[0].getErrorType(), "patternincompleteerror", "error is PatternIncompleteError");

  // Fix the value - error should clear
  q.inputValue = "+56-78";
  assert.equal(q.value, "5678", "value is complete again");
  assert.equal(q.errors.length, 0, "error cleared after completing the mask");

  // Clear the value entirely - no error (not required)
  q.inputValue = "+__-__";
  assert.equal(q.value, undefined, "empty value");
  assert.equal(q.errors.length, 0, "no error for empty non-required field");
});

QUnit.test("Pattern mask: checkErrorsMode onValueChanged with isRequired", function (assert) {
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
  assert.equal(q.value, "1234", "complete value");
  assert.equal(q.errors.length, 0, "no errors for complete value");

  // Change to incomplete - should show incomplete error, not required
  q.inputValue = "+12-__";
  assert.equal(q.errors.length, 1, "one error for incomplete");
  assert.equal(q.errors[0].getErrorType(), "patternincompleteerror", "incomplete error, not required error");

  // Complete the value again - errors cleared
  q.inputValue = "+12-56";
  assert.equal(q.value, "1256", "complete value again");
  assert.equal(q.errors.length, 0, "errors cleared");
});