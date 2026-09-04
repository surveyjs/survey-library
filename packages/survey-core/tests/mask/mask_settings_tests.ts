import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { InputMaskDateTime } from "../../src/mask/mask_datetime";
import { QuestionTextModel } from "../../src/question_text";
import { Serializer } from "../../src/jsonobject";
import { SurveyModel } from "../../src/survey";
import { ArrayChanges, Base } from "../../src/base";
import { hasStrongRtlText } from "../../src/mask/mask_utils";
import { surveyLocalization } from "../../src/surveyStrings";

import "../../src/localization/german";
import "../../src/localization/arabic";

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
    expect(q.inputStyle).toEqual({ width: "", textAlign: "right", direction: "ltr" });

    q.inputTextAlignment = "left";
    expect(q.inputStyle).toEqual({ width: "", textAlign: "left", direction: "ltr" });
  });

  test("hasStrongRtlText classifies the text a mask can emit", () => {
    expect(hasStrongRtlText("ي")).toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("י")).toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("ر.س")).toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("999 محلي 999")).toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("ࡀ"), "mandaic").toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("ࡰ"), "arabic extended-b").toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("\u{1E900}"), "adlam, supplementary plane").toBe(true);
    expect(hasStrongRtlText("ﭏ"), "hebrew presentation form").toBe(true); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("٫٬"), "arabic decimal and thousands separators").toBe(false); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("١۱"), "arabic-indic and extended digits").toBe(false); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("َ"), "harakat").toBe(false); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("dd/mm/yyyy")).toBe(false);
    expect(hasStrongRtlText("+1 (999) 999-9999")).toBe(false);
    expect(hasStrongRtlText("$ 1,234.56")).toBe(false);
    expect(hasStrongRtlText("дд.мм.гггг")).toBe(false); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(hasStrongRtlText("")).toBe(false);
    expect(hasStrongRtlText(undefined as any)).toBe(false);
  });

  test("getInputDirection per mask class", () => {
    const q = new QuestionTextModel("q1");
    expect(q.maskSettings.getInputDirection(), "no mask").toBe("auto");

    q.maskType = "numeric";
    expect(q.maskSettings.getInputDirection(), "numeric").toBe("ltr");
    (<InputMaskNumeric>q.maskSettings).decimalSeparator = "٫"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "numeric, arabic decimal separator is not strong RTL").toBe("ltr");
    (<InputMaskNumeric>q.maskSettings).decimalSeparator = "ر"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "numeric, strong RTL separator").toBe("auto");

    q.maskType = "currency";
    expect(q.maskSettings.getInputDirection(), "currency").toBe("ltr");
    (<InputMaskCurrency>q.maskSettings).prefix = "$ ";
    expect(q.maskSettings.getInputDirection(), "currency, latin prefix").toBe("ltr");
    (<InputMaskCurrency>q.maskSettings).suffix = " ر.س"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "currency, arabic suffix").toBe("auto");
    (<InputMaskCurrency>q.maskSettings).suffix = "";
    (<InputMaskCurrency>q.maskSettings).prefix = "ر.س "; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "currency, arabic prefix").toBe("auto");

    q.maskType = "pattern";
    expect(q.maskSettings.getInputDirection(), "pattern, empty").toBe("ltr");
    (<InputMaskPattern>q.maskSettings).pattern = "+1 (999) 999-9999";
    expect(q.maskSettings.getInputDirection(), "pattern, ascii literals").toBe("ltr");
    (<InputMaskPattern>q.maskSettings).pattern = "999 محلي 999"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "pattern, arabic literal").toBe("auto");
    (<InputMaskPattern>q.maskSettings).pattern = "\\ي999"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "pattern, escaped arabic literal").toBe("auto");
    (<InputMaskPattern>q.maskSettings).pattern = "aaa";
    expect(q.maskSettings.getInputDirection(), "pattern, definitions are not inspected").toBe("ltr");

    q.maskType = "datetime";
    expect(q.maskSettings.getInputDirection(), "datetime").toBe("ltr");
    (<InputMaskDateTime>q.maskSettings).pattern = "dd/mm/yyyy";
    expect(q.maskSettings.getInputDirection(), "datetime, explicit pattern").toBe("ltr");
    (<InputMaskDateTime>q.maskSettings).pattern = "dd ي mm"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.maskSettings.getInputDirection(), "datetime, arabic separator").toBe("auto");
  });

  test("getInputDirection: datetime follows the resolved placeholder symbols", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q.maskSettings.getInputDirection(), "default locale").toBe("ltr");
    expect(q.inputStyle, "default locale").toEqual({ width: "", direction: "ltr" });

    survey.locale = "ar";
    expect(q.inputValue, "ar keeps the latin fallback symbols").toBe("dd/mm/yyyy");
    expect(q.maskSettings.getInputDirection(), "ar with latin symbols").toBe("ltr");
    expect(q.inputStyle, "ar with latin symbols").toEqual({ width: "", direction: "ltr" });

    survey.locale = "de";
    expect(q.inputValue, "de symbols").toBe("TT.MM.JJJJ");
    expect(q.maskSettings.getInputDirection(), "latin symbols").toBe("ltr");

    // a strong right-to-left symbol, set temporarily on the dictionary, opts the mask out
    const ar = surveyLocalization.locales["ar"];
    ar.maskPlaceholderDay = "ي"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    try {
      survey.locale = "ar";
      expect(q.inputValue).toBe("يي/mm/yyyy"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      expect(q.maskSettings.getInputDirection(), "strong RTL symbol").toBe("auto");
      expect(q.inputStyle, "no direction is emitted then").toEqual({ width: "" });
    } finally {
      delete ar.maskPlaceholderDay;
      survey.locale = "";
    }
    expect(surveyLocalization.locales["ar"].maskPlaceholderDay, "dictionary restored").toBeUndefined();
  });

  test("inputStyle: direction per mask", () => {
    const q = new QuestionTextModel("q1");
    expect(q.inputStyle, "no mask").toEqual({ width: "" });

    q.maskType = "pattern";
    expect(q.inputStyle, "pattern").toEqual({ width: "", direction: "ltr" });

    q.maskType = "datetime";
    expect(q.inputStyle, "datetime").toEqual({ width: "", direction: "ltr" });

    q.maskType = "numeric";
    expect(q.inputStyle, "numeric keeps its alignment").toEqual({ width: "", textAlign: "right", direction: "ltr" });

    q.inputTextAlignment = "left";
    expect(q.inputStyle, "explicit alignment wins, direction stays").toEqual({ width: "", textAlign: "left", direction: "ltr" });

    q.maskType = "currency";
    (<InputMaskCurrency>q.maskSettings).suffix = " ر.س"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(q.inputStyle, "strong RTL literal: no direction").toEqual({ width: "", textAlign: "left" });

    q.maskType = "none";
    expect(q.inputStyle, "mask removed").toEqual({ width: "", textAlign: "left" });
  });

  test("getControlClass marks a masked input", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q.getControlClass()).toBe("sd-formbox__input");
    q.maskType = "datetime";
    expect(q.getControlClass()).toBe("sd-formbox__input sd-formbox__input--mask");
    q.maskType = "none";
    expect(q.getControlClass()).toBe("sd-formbox__input");
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

  test("Masked input value is updated immediately when survey.data is set while the input is focused, Bug#11577", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          maskType: "pattern",
          maskSettings: { pattern: "+99-99" },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);
    expect(testInput.value, "empty masked value is rendered").toBe("+__-__");

    testInput.focus();
    expect(document.activeElement, "the input is focused").toBe(testInput);

    survey.data = { q1: "1234" };
    expect(q.value, "q.value is set from survey.data").toBe("1234");
    expect(q.inputValue, "q.inputValue is masked").toBe("+12-34");
    expect(testInput.value, "the masked value inside the focused input is updated immediately").toBe("+12-34");

    testInput.remove();
  });

  test("Masked input value is updated when survey.data is set after an empty focused input lost focus", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          maskType: "pattern",
          maskSettings: { pattern: "+99-99" },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);
    expect(testInput.value, "empty masked value is rendered").toBe("+__-__");

    testInput.focus();
    // Nothing is entered and the input loses focus. The UI pushes the empty masked text back into the model,
    // the unmasked value is empty and the question value does not change.
    q.onBlur({ target: testInput });
    expect(q.value, "the question value is still empty").toBeFalsy();

    survey.data = { q1: "1234" };
    expect(q.value, "q.value is set from survey.data").toBe("1234");
    expect(q.inputValue, "q.inputValue is masked").toBe("+12-34");
    expect(testInput.value, "the masked value inside the input is updated").toBe("+12-34");

    testInput.remove();
  });

  test("Set a value with pattern literals from code, saveMaskedValue is enabled", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          maskType: "pattern",
          maskSettings: { pattern: "+99-99", saveMaskedValue: true },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);
    testInput.focus();

    survey.data = { q1: "+12-34" };
    expect(q.value, "the value keeps the pattern literals").toBe("+12-34");
    expect(q.inputValue, "q.inputValue is masked").toBe("+12-34");
    expect(testInput.value, "the masked value is rendered").toBe("+12-34");
    expect(survey.data, "survey.data keeps the pattern literals").toEqual({ q1: "+12-34" });

    testInput.remove();
  });

  test("Set a value with pattern literals from code, saveMaskedValue is disabled", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          maskType: "pattern",
          maskSettings: { pattern: "+99-99" },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);
    testInput.focus();

    survey.data = { q1: "+12-34" };
    expect(q.value, "the value is stored without the pattern literals").toBe("1234");
    expect(q.inputValue, "q.inputValue is masked").toBe("+12-34");
    expect(testInput.value, "the masked value is rendered").toBe("+12-34");
    expect(survey.data, "survey.data is stored without the pattern literals").toEqual({ q1: "1234" });

    testInput.remove();
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

  test("Only the datetime mask is locale dependent", () => {
    expect(new InputMaskBase().isLocaleDependent, "base").toBe(false);
    expect(new InputMaskPattern().isLocaleDependent, "pattern").toBe(false);
    expect(new InputMaskNumeric().isLocaleDependent, "numeric").toBe(false);
    expect(new InputMaskCurrency().isLocaleDependent, "currency").toBe(false);
    expect(new InputMaskDateTime().isLocaleDependent, "datetime").toBe(true);
  });

  test("The rendered datetime input is updated when the survey locale changes", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          maskType: "datetime",
          maskSettings: { pattern: "dd.mm.yyyy" },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);
    expect(testInput.value, "the english empty mask is rendered").toBe("dd.mm.yyyy");

    survey.locale = "de";
    expect(testInput.value, "the german empty mask is rendered").toBe("TT.MM.JJJJ");

    survey.locale = "";
    expect(testInput.value, "the english empty mask is rendered again").toBe("dd.mm.yyyy");

    testInput.remove();
  });

  test("An entered datetime value is re-rendered in the input when the survey locale changes", () => {
    const testInput = document.createElement("input");
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          maskType: "datetime",
          maskSettings: { pattern: "dd.mm.yyyy" },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);

    q.inputValue = "15.mm.yyyy";
    survey.locale = "de";
    expect(testInput.value, "an incomplete value keeps the entered digits").toBe("15.MM.JJJJ");

    q.inputValue = "15.12.2024";
    expect(q.value, "the complete value").toBe("2024-12-15");
    survey.locale = "";
    expect(testInput.value, "a complete value does not depend on the locale").toBe("15.12.2024");

    testInput.remove();
  });

  test("Focus, click and blur on an empty datetime input after the survey locale has changed", () => {
    const testInput = document.createElement("input");
    testInput.placeholder = "enter a date";
    document.body.appendChild(testInput);

    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          placeholder: "enter a date",
          maskType: "datetime",
          maskSettings: { pattern: "dd.mm.yyyy" },
        },
      ],
    });
    const q = survey.getQuestionByName("q1") as QuestionTextModel;
    q.afterRenderQuestionElement(testInput);
    expect(testInput.value, "the placeholder is shown instead of the empty mask").toBe("");

    survey.locale = "de";
    expect(testInput.value, "the placeholder is still shown after the locale change").toBe("");

    testInput.dispatchEvent(new Event("focus"));
    expect(testInput.value, "the german empty mask is shown on focus").toBe("TT.MM.JJJJ");

    testInput.setSelectionRange(5, 5);
    testInput.dispatchEvent(new Event("click"));
    expect(testInput.selectionStart, "the caret is moved to the first part").toBe(0);

    testInput.dispatchEvent(new Event("blur"));
    expect(testInput.value, "the placeholder is shown again on blur").toBe("");

    testInput.remove();
  });
});
