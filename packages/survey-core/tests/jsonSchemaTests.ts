import { Serializer } from "../src/jsonobject";

import { describe, test, expect } from "vitest";
describe("JsonSchemaTests", () => {
  test("generate survey schema", () => {
    Serializer.addProperty("survey", {
      name: "customSurveyProperty2",
      category: "general",
      visibleIndex: 0,
      choices: [{ text: "Value A", value: "a" }, "b"]
    });
    const schema = Serializer.generateSchema();
    expect(schema.title).toBe("SurveyJS Library json schema");
    expect(schema.properties.surveyId.type, "surveyId is string").toBe("string");
    expect(schema.properties.isSinglePage, "isSinglePage is not seriazable").toBeFalsy();
    expect(schema.properties.locale.type, "locale is string").toBe("string");
    expect(schema.properties.locale.enum, "locale enum is not seriazable").toBeFalsy();
    expect(schema.properties.completedHtml, "survey.completedHtml is Localization property").toEqual({ "oneOf": [
      { "type": "string" },
      { "$ref": "#/definitions/locstring" }
    ] });
    expect(schema.properties.showPreviewBeforeComplete.type, "showPreviewBeforeComplete is boolean").toBe("boolean");
    expect(schema.properties.partialSendEnabled.type, "partialSendEnabled is boolean").toBe("boolean");
    expect(schema.properties.title, "Localization property").toEqual({ "oneOf": [
      { "type": "string" },
      { "$ref": "#/definitions/locstring" }
    ] });
    expect(schema.properties.maxTextLength.type, "maxTextLength is number").toBe("number");
    expect(schema.properties.showNavigationButtons.type, "showNavigationButtons is boolean").toBe("boolean");
    expect(schema.properties.showNavigationButtons.enum, "showNavigationButtons doen't have enum").toEqual(undefined);
    expect(schema.properties.navigationButtonsLocation.type, "navigationButtonsLocation is navigationButtonsLocation").toBe("string");
    expect(schema.properties.navigationButtonsLocation.enum, "navigationButtonsLocation has enum").toEqual(["top", "bottom", "topBottom"]);
    expect(schema.properties.completedHtmlOnCondition.type, "completedHtmlOnCondition type is array").toEqual("array");
    expect(schema.properties.completedHtmlOnCondition.items.$ref, "completedHtmlOnCondition items.$ref has a link on class").toEqual("#/definitions/htmlconditionitem");

    expect(schema.definitions.htmlconditionitem, "htmlconditionitem object is here").toBeTruthy();
    expect(schema.definitions.htmlconditionitem.type, "htmlconditionitem type is object").toBe("object");
    expect(schema.definitions.htmlconditionitem.$id, "htmlconditionitem id is here").toBe("htmlconditionitem");
    expect(schema.definitions.page, "page object is here").toBeTruthy();
    expect(schema.definitions.page.type, "page type is object").toBe("object");
    expect(schema.definitions.page.$id, "page id is here").toBe("page");
    expect(schema.definitions.page.allOf, "page has allOf").toBeTruthy();
    expect(schema.definitions.page.allOf.length, "page.allOf is array with two items").toBe(2);
    expect(schema.definitions.page.allOf[0].$ref, "page parent is here").toBe("panel");
    expect(schema.definitions.page.allOf[1].properties, "page.allOf has properties").toBeTruthy();
    expect(schema.definitions.page.allOf[1].properties.type, "there is no type in page").toBeFalsy();
    expect(schema.definitions.panel.allOf[1].properties.type, "there is no type in panel").toBeFalsy();
    expect(schema.definitions.panelbase.properties.type, "there is no type in panelbase").toBeFalsy();

    expect(schema.definitions.panelbase, "panelbase object is here").toBeTruthy();
    expect(schema.definitions.panelbase.type, "panelbase type is object").toBe("object");
    expect(schema.definitions.panelbase.$id, "panelbase id is here").toBe("panelbase");
    expect(schema.definitions.panelbase.properties.title, "panelbase.title type is string").toEqual({ "oneOf": [
      { "type": "string" },
      { "$ref": "locstring" }
    ] });

    expect(schema.properties.triggers.type, "triggers is array").toBe("array");
    expect(schema.properties.triggers.items.anyOf, "triggers.items.anyOf").toEqual([
      {
        $ref: "#/definitions/visibletrigger",
      },
      {
        $ref: "#/definitions/completetrigger",
      },
      {
        $ref: "#/definitions/setvaluetrigger",
      },
      {
        $ref: "#/definitions/copyvaluetrigger",
      },
      {
        $ref: "#/definitions/skiptrigger",
      },
      {
        $ref: "#/definitions/runexpressiontrigger",
      },
    ]);

    expect(schema.definitions.panelbase.properties.elements.type, "panelbase.elements type is array").toBe("array");
    var panelElements = schema.definitions.panelbase.properties.elements.items.anyOf;
    expect(panelElements.length > 5, "There are many elements in panelbase.elements.items.anyOf").toBeTruthy();
    function findInElements(elType: string): boolean {
    //elType = "#/definitions/" + elType;
      for (var i = 0; i < panelElements.length; i++)
        if (panelElements[i].$ref == elType) return true;
      return false;
    }
    expect(findInElements("text"), "question text is in panel.elements").toBeTruthy();
    expect(findInElements("checkbox"), "question checkbox is in panel.elements").toBeTruthy();
    expect(findInElements("matrixdropdown"), "question matrixdropdown is in panel.elements").toBeTruthy();
    expect(findInElements("panel"), "panel is in panel.elements").toBeTruthy();
    expect(findInElements("page"), "page is not in panel.elements").toBeFalsy();
    expect(findInElements("question"), "abstract question is not in panel.elements").toBeFalsy();
    const selectBaseProps = schema.definitions.selectbase.allOf[1].properties;
    const propChoices = selectBaseProps.choices;
    expect(propChoices, "selectbase class and it's choices is here").toBeTruthy();
    expect(propChoices.type, "choices is array").toBe("array");
    // Make anyOf to allow both itemvalue and string types in the choices array Bug#10655
    expect(propChoices.items.anyOf, "choices items is anyOf").toBeTruthy();
    expect(propChoices.items.anyOf[0].$ref, "item is  choiceitem").toBe("choiceitem");
    expect(propChoices.items.anyOf[1].type, "item can be string also").toBe("string");
    expect(propChoices.items.anyOf[2].type, "item can be number also").toBe("number");
    expect(selectBaseProps.name, "The property name should be in question").toBeFalsy();
    expect(selectBaseProps.showCommentArea, "The property showCommentArea should be in question").toBeFalsy();

    expect(schema.definitions.itemvalue.properties.text, "itemvalue text is localizable string").toEqual({ "oneOf": [
      { "type": "string" },
      { "$ref": "locstring" }
    ] });
    expect(schema.properties.questionTitlePattern, "exists schema.properties.questionTitlePattern").toBeTruthy();
    expect(schema.properties.questionTitlePattern.enum, "not exists schema.properties.questionTitlePattern.enum").toBeFalsy();
    expect(selectBaseProps.choicesByUrl.type, "selectbase.choicesByUrl doesn't have type").toBeFalsy();
    expect(selectBaseProps.choicesByUrl.$ref, "selectbase.choicesByUrl $ref").toBe("choicesByUrl");

    expect(schema.definitions.question.properties.visible, "question visible is here").toBeTruthy();
    expect(schema.definitions.question.properties.visible.type, "question visible type is boolean").toBe("boolean");
    expect(schema.definitions.question.$id, "question id is correct").toBe("question");
    expect(schema.definitions.question.properties.type, "question type is here").toBeTruthy();
    expect(schema.definitions.question.properties.type.type, "question type is string").toBe("string");
    expect(schema.definitions.question.required, "question required").toEqual(["type", "name"]);
    expect(schema.definitions.question.properties.showCommentArea, "question showCommentArea is boolean").toEqual({ "type": "boolean" });

    const locString = schema.definitions.locstring;
    expect(locString.type, "locString type").toBe("object");
    expect(locString.$id, "locString $id").toBe("locstring");
    const lostStringProp = locString.properties;
    expect(lostStringProp.default, "locale default is here").toBeTruthy();
    expect(lostStringProp.en, "locale en is here").toBeTruthy();
    expect(lostStringProp.fr, "locale fr is here").toBeTruthy();
    expect(lostStringProp.default.type, "has default in locString properties").toBe("string");
    expect(lostStringProp.en.type, "has en in locString properties").toBe("string");
    expect(lostStringProp.fr.type, "has fr in locString properties").toBe("string");

    const customProp2 = schema.properties.customSurveyProperty2;
    expect(customProp2).toBeTruthy();
    expect(customProp2.type, "customProp2.type").toBe("string");
    expect(customProp2.enum, "customProp2.enum").toEqual(["a", "b"]);
    Serializer.removeProperty("survey", "customSurveyProperty2");
  });

  test("generate schema with polymorphic single object properties (maskSettings)", () => {
    const schema = Serializer.generateSchema();
    const textProps = schema.definitions.text.allOf[1].properties;
    const maskSettingsProp = textProps.maskSettings;

    expect(maskSettingsProp, "maskSettings property exists on text question").toBeTruthy();
    expect(maskSettingsProp.oneOf, "maskSettings has oneOf for polymorphic types").toBeTruthy();
    expect(maskSettingsProp.oneOf.length >= 5, "maskSettings oneOf has base and derived types").toBeTruthy();

    const refNames = maskSettingsProp.oneOf.map((item: any) => item.$ref);
    expect(refNames.includes("masksettings"), "masksettings base class is in oneOf").toBeTruthy();
    expect(refNames.includes("patternmask"), "patternmask is in oneOf").toBeTruthy();
    expect(refNames.includes("numericmask"), "numericmask is in oneOf").toBeTruthy();
    expect(refNames.includes("datetimemask"), "datetimemask is in oneOf").toBeTruthy();
    expect(refNames.includes("currencymask"), "currencymask is in oneOf").toBeTruthy();

    expect(schema.definitions.masksettings, "masksettings definition exists").toBeTruthy();
    expect(schema.definitions.patternmask, "patternmask definition exists").toBeTruthy();
    expect(schema.definitions.numericmask, "numericmask definition exists").toBeTruthy();
    expect(schema.definitions.datetimemask, "datetimemask definition exists").toBeTruthy();
    expect(schema.definitions.currencymask, "currencymask definition exists").toBeTruthy();

    expect(schema.definitions.patternmask.allOf, "patternmask has allOf for inheritance").toBeTruthy();
    expect(schema.definitions.patternmask.allOf[0].$ref, "patternmask extends masksettings").toBe("masksettings");
    expect(schema.definitions.patternmask.allOf[1].properties.pattern, "patternmask has pattern property").toBeTruthy();

    expect(schema.definitions.numericmask.allOf, "numericmask has allOf for inheritance").toBeTruthy();
    expect(schema.definitions.numericmask.allOf[0].$ref, "numericmask extends masksettings").toBe("masksettings");
    expect(schema.definitions.numericmask.allOf[1].properties.precision, "numericmask has precision property").toBeTruthy();

    expect(schema.definitions.datetimemask.allOf, "datetimemask has allOf for inheritance").toBeTruthy();
    expect(schema.definitions.datetimemask.allOf[0].$ref, "datetimemask extends patternmask").toBe("patternmask");

    expect(schema.definitions.currencymask.allOf, "currencymask has allOf for inheritance").toBeTruthy();
    expect(schema.definitions.currencymask.allOf[0].$ref, "currencymask extends numericmask").toBe("numericmask");
    expect(schema.definitions.currencymask.allOf[1].properties.prefix, "currencymask has prefix property").toBeTruthy();
  });
});
