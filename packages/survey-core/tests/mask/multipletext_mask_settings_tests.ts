import { InputMaskBase } from "../../src/mask/mask_base";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { InputMaskNumeric } from "../../src/mask/mask_numeric";
import { QuestionMultipleTextModel } from "../../src/question_multipletext";
import { SurveyModel } from "../../src/survey";

import { describe, test, expect } from "vitest";
describe("Multiple text: Input mask", () => {
  test("Deserialize/serialize mutltiple text with input mask", () => {
    const json = {
      pages: [{
        name: "page1",
        elements: [{
          "type": "multipletext",
          "name": "question1",
          "items": [
            {
              "name": "text1",
              "maskType": "numeric",
            },
            {
              "name": "text2",
              "maskType": "pattern",
              "maskSettings": {
                pattern: "+\\1(999)-999-99-99"
              }
            },
            {
              "name": "text3",
              "maskType": "datetime",
              "maskSettings": {
                "pattern": "mm/dd/yyyy"
              }
            }
          ]
        }]
      }]
    };
    const survey = new SurveyModel(json);
    const multipletext = survey.getQuestionByName("question1") as QuestionMultipleTextModel;
    expect(multipletext.items[0].maskType).toLooseEqual("numeric");
    expect(multipletext.items[0].maskSettings.getType()).toLooseEqual("numericmask");

    expect(multipletext.items[1].maskType).toLooseEqual("pattern");
    expect(multipletext.items[1].maskSettings.getType()).toLooseEqual("patternmask");

    expect(multipletext.items[2].maskType).toLooseEqual("datetime");
    expect(multipletext.items[2].maskSettings.getType()).toLooseEqual("datetimemask");

    expect(survey.toJSON()).toEqualValues(json);
  });

  test("Initial mask settings", () => {
    const testInput = document.createElement("input");

    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    const itemEditor = item.editor;
    itemEditor.input = testInput;
    expect(item.maskType).toLooseEqual("none");
    expect(item.maskSettings.getType()).toLooseEqual("masksettings");
    expect(!!itemEditor["maskInputAdapter"]).toLooseEqual(false);

    item.maskType = "pattern";
    expect(item.maskType).toLooseEqual("pattern");
    expect(item.maskSettings.getType()).toLooseEqual("patternmask");
    expect(!!itemEditor["maskInputAdapter"]).toLooseEqual(true);

    testInput.remove();
  });

  test("Apply mask", () => {
    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    const itemEditor = item.editor;

    item.maskType = "pattern";
    item.maskSettings.fromJSON({ pattern: "+99-99" });
    item.value = "1234";
    expect(item.value).toLooseEqual("1234");
    expect(itemEditor.inputValue).toLooseEqual("+12-34");

    itemEditor.inputValue = "+78-68";
    expect(item.value).toLooseEqual("7868");
    expect(itemEditor.inputValue).toLooseEqual("+78-68");
  });

  test("Switch mask type", () => {
    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    expect(item.maskType).toLooseEqual("none");
    expect(item.maskSettings instanceof InputMaskBase).toLooseEqual(true);

    item.maskType = "pattern";
    expect(item.maskType).toLooseEqual("pattern");
    expect(item.maskSettings instanceof InputMaskPattern).toLooseEqual(true);

    item.maskType = "numeric";
    expect(item.maskType).toLooseEqual("numeric");
    expect(item.maskSettings instanceof InputMaskNumeric).toLooseEqual(true);

    item.maskType = "none";
    expect(item.maskType).toLooseEqual("none");
    expect(item.maskSettings instanceof InputMaskBase).toLooseEqual(true);
  });

  test("Currency mask: text aligment", () => {
    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    const itemEditor = item.editor;
    expect(itemEditor.inputStyle).toEqualValues({ width: "" });

    item.maskType = "currency";
    expect(itemEditor.inputStyle).toEqualValues({ width: "", textAlign: "right" });

    item.inputTextAlignment = "left";
    expect(itemEditor.inputStyle).toEqualValues({ width: "", textAlign: "left" });
  });
});
