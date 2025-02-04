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

  q.inputValue = "+12-";
  assert.equal(q.value, undefined, "masked value");
  assert.equal(q.inputValue, "+__-__", "masked inputValue");

  q.maskSettings.fromJSON({ pattern: "+99-99", saveMaskedValue: false });
  q.inputValue = "+45-";
  assert.equal(q.value, undefined, "unmasked value");
  assert.equal(q.inputValue, "+__-__", "unmasked inputValue");
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
  assert.equal(q.value, "", "unmasked value #2");
  assert.equal(q.inputValue, "dd/mm/yyyy", "unmasked inputValue #2");

  q.maskSettings.saveMaskedValue = true;

  q.inputValue = "12/03/2024";
  assert.equal(q.value, "12/03/2024", "masked value #3");
  assert.equal(q.inputValue, "12/03/2024", "masked inputValue #3");

  q.inputValue = "12/03/202y";
  assert.equal(q.value, "", "masked value #4");
  assert.equal(q.inputValue, "dd/mm/yyyy", "masked inputValue #4");
});

QUnit.test("Pattern mask: value & inputValue", function (assert) {
  const q = new QuestionTextModel("q1");
  q.maskType = "pattern";
  q.maskSettings.fromJSON({ pattern: "999-999" });
  q.inputValue = "123-456";
  assert.equal(q.value, "123456", "unmasked value #1");
  assert.equal(q.inputValue, "123-456", "unmasked inputValue #1");

  q.inputValue = "123-45_";
  assert.equal(q.value, "", "unmasked value #2");
  assert.equal(q.inputValue, "___-___", "unmasked inputValue #2");

  q.maskSettings.saveMaskedValue = true;

  q.inputValue = "123-456";
  assert.equal(q.value, "123-456", "masked value #3");
  assert.equal(q.inputValue, "123-456", "masked inputValue #3");

  q.inputValue = "123-45_";
  assert.equal(q.value, "", "masked value #4");
  assert.equal(q.inputValue, "___-___", "masked inputValue #4");
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