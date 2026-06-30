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
    expect(multipletext.items[0].maskType).toBe("numeric");
    expect(multipletext.items[0].maskSettings.getType()).toBe("numericmask");

    expect(multipletext.items[1].maskType).toBe("pattern");
    expect(multipletext.items[1].maskSettings.getType()).toBe("patternmask");

    expect(multipletext.items[2].maskType).toBe("datetime");
    expect(multipletext.items[2].maskSettings.getType()).toBe("datetimemask");

    expect(survey.toJSON()).toEqual(json);
  });

  test("Initial mask settings", () => {
    const testInput = document.createElement("input");

    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    const itemEditor = item.editor;
    itemEditor.input = testInput;
    expect(item.maskType).toBe("none");
    expect(item.maskSettings.getType()).toBe("masksettings");
    expect(!!itemEditor["maskInputAdapter"]).toBe(false);

    item.maskType = "pattern";
    expect(item.maskType).toBe("pattern");
    expect(item.maskSettings.getType()).toBe("patternmask");
    expect(!!itemEditor["maskInputAdapter"]).toBe(true);

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
    expect(item.value).toBe("1234");
    expect(itemEditor.inputValue).toBe("+12-34");

    itemEditor.inputValue = "+78-68";
    expect(item.value).toBe("7868");
    expect(itemEditor.inputValue).toBe("+78-68");
  });

  test("Switch mask type", () => {
    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    expect(item.maskType).toBe("none");
    expect(item.maskSettings instanceof InputMaskBase).toBe(true);

    item.maskType = "pattern";
    expect(item.maskType).toBe("pattern");
    expect(item.maskSettings instanceof InputMaskPattern).toBe(true);

    item.maskType = "numeric";
    expect(item.maskType).toBe("numeric");
    expect(item.maskSettings instanceof InputMaskNumeric).toBe(true);

    item.maskType = "none";
    expect(item.maskType).toBe("none");
    expect(item.maskSettings instanceof InputMaskBase).toBe(true);
  });

  test("Currency mask: text aligment", () => {
    const multipletext = new QuestionMultipleTextModel("q1");
    multipletext.addItem("item1");
    const item = multipletext.items[0];
    const itemEditor = item.editor;
    expect(itemEditor.inputStyle).toEqual({ width: "" });

    item.maskType = "currency";
    expect(itemEditor.inputStyle).toEqual({ width: "", textAlign: "right" });

    item.inputTextAlignment = "left";
    expect(itemEditor.inputStyle).toEqual({ width: "", textAlign: "left" });
  });
});
