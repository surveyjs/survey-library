import { Serializer } from "../src/jsonobject";

export default QUnit.module("JsonSchemaTests");

QUnit.test("generate survey schema", function (assert) {
  Serializer.addProperty("survey", {
    name: "customSurveyProperty2",
    category: "general",
    visibleIndex: 0,
    choices: [{ text: "Value A", value: "a" }, "b"]
  });
  const schema = Serializer.generateSchema();
  assert.equal(schema.title, "SurveyJS Library json schema");
  assert.equal(schema.properties.surveyId.type, "string", "surveyId is string");
  assert.notOk(schema.properties.isSinglePage, "isSinglePage is not seriazable");
  assert.equal(
    schema.properties.showPreviewBeforeComplete.type,
    "boolean",
    "showPreviewBeforeComplete is boolean"
  );
  assert.equal(
    schema.properties.partialSendEnabled.type,
    "boolean",
    "partialSendEnabled is boolean"
  );
  assert.deepEqual(schema.properties.title,
    { "oneOf": [
      { "type": "string" },
      { "$ref": "#/definitions/locstring" }
    ] },
    "Localization property"
  );
  assert.equal(
    schema.properties.maxTextLength.type,
    "number",
    "maxTextLength is number"
  );
  assert.equal(
    schema.properties.showNavigationButtons.type,
    "boolean",
    "showNavigationButtons is boolean"
  );
  assert.deepEqual(
    schema.properties.showNavigationButtons.enum,
    undefined,
    "showNavigationButtons doen't have enum"
  );
  assert.equal(
    schema.properties.navigationButtonsLocation.type,
    "string",
    "navigationButtonsLocation is navigationButtonsLocation"
  );
  assert.deepEqual(
    schema.properties.navigationButtonsLocation.enum,
    ["top", "bottom", "topBottom"],
    "navigationButtonsLocation has enum"
  );
  assert.deepEqual(
    schema.properties.completedHtmlOnCondition.type,
    "array",
    "completedHtmlOnCondition type is array"
  );
  assert.deepEqual(
    schema.properties.completedHtmlOnCondition.items.$ref,
    "#/definitions/htmlconditionitem",
    "completedHtmlOnCondition items.$ref has a link on class"
  );

  assert.ok(
    schema.definitions.htmlconditionitem,
    "htmlconditionitem object is here"
  );
  assert.equal(
    schema.definitions.htmlconditionitem.type,
    "object",
    "htmlconditionitem type is object"
  );
  assert.equal(
    schema.definitions.htmlconditionitem.$id,
    "htmlconditionitem",
    "htmlconditionitem id is here"
  );
  assert.ok(schema.definitions.page, "page object is here");
  assert.equal(schema.definitions.page.type, "object", "page type is object");
  assert.equal(schema.definitions.page.$id, "page", "page id is here");
  assert.ok(schema.definitions.page.allOf, "page has allOf");
  assert.equal(
    schema.definitions.page.allOf.length,
    2,
    "page.allOf is array with two items"
  );
  assert.equal(
    schema.definitions.page.allOf[0].$ref,
    "panel",
    "page parent is here"
  );
  assert.ok(
    schema.definitions.page.allOf[1].properties,
    "page.allOf has properties"
  );
  assert.notOk(schema.definitions.page.allOf[1].properties.type, "there is no type in page");
  assert.notOk(schema.definitions.panel.allOf[1].properties.type, "there is no type in panel");
  assert.notOk(schema.definitions.panelbase.properties.type, "there is no type in panelbase");

  assert.ok(schema.definitions.panelbase, "panelbase object is here");
  assert.equal(
    schema.definitions.panelbase.type,
    "object",
    "panelbase type is object"
  );
  assert.equal(
    schema.definitions.panelbase.$id,
    "panelbase",
    "panelbase id is here"
  );
  assert.deepEqual(
    schema.definitions.panelbase.properties.title,
    { "oneOf": [
      { "type": "string" },
      { "$ref": "locstring" }
    ] },
    "panelbase.title type is string"
  );

  assert.equal(schema.properties.triggers.type, "array", "triggers is array");
  assert.deepEqual(
    schema.properties.triggers.items.anyOf,
    [
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
    ],
    "triggers.items.anyOf"
  );

  assert.equal(
    schema.definitions.panelbase.properties.elements.type,
    "array",
    "panelbase.elements type is array"
  );
  var panelElements = schema.definitions.panelbase.properties.elements.items.anyOf;
  assert.ok(
    panelElements.length > 5,
    "There are many elements in panelbase.elements.items.anyOf"
  );
  function findInElements(elType: string): boolean {
    //elType = "#/definitions/" + elType;
    for (var i = 0; i < panelElements.length; i++)
      if (panelElements[i].$ref == elType) return true;
    return false;
  }
  assert.ok(findInElements("text"), "question text is in panel.elements");
  assert.ok(
    findInElements("checkbox"),
    "question checkbox is in panel.elements"
  );
  assert.ok(
    findInElements("matrixdropdown"),
    "question matrixdropdown is in panel.elements"
  );
  assert.ok(findInElements("panel"), "panel is in panel.elements");
  assert.notOk(findInElements("page"), "page is not in panel.elements");
  assert.notOk(findInElements("question"), "abstract question is not in panel.elements");
  const selectBaseProps = schema.definitions.selectbase.allOf[1].properties;
  const propChoices = selectBaseProps.choices;
  assert.ok(propChoices, "selectbase class and it's choices is here");
  assert.equal(propChoices.type, "array", "choices is array");
  // Make anyOf to allow both itemvalue and string types in the choices array Bug#10655
  assert.ok(propChoices.items.anyOf, "choices items is anyOf");
  assert.equal(propChoices.items.anyOf[0].$ref, "choiceitem", "item is  choiceitem");
  assert.equal(propChoices.items.anyOf[1].type, "string", "item can be string also");
  assert.equal(propChoices.items.anyOf[2].type, "number", "item can be number also");
  assert.notOk(selectBaseProps.name, "The property name should be in question");
  assert.notOk(selectBaseProps.showCommentArea, "The property showCommentArea should be in question");

  assert.deepEqual(
    schema.definitions.itemvalue.properties.text,
    { "oneOf": [
      { "type": "string" },
      { "$ref": "locstring" }
    ] },
    "itemvalue text is localizable string"
  );
  assert.ok(schema.properties.questionTitlePattern, "exists schema.properties.questionTitlePattern");
  assert.notOk(schema.properties.questionTitlePattern.enum, "not exists schema.properties.questionTitlePattern.enum");
  assert.notOk(selectBaseProps.choicesByUrl.type, "selectbase.choicesByUrl doesn't have type");
  assert.equal(selectBaseProps.choicesByUrl.$ref, "choicesByUrl", "selectbase.choicesByUrl $ref");

  assert.ok(schema.definitions.question.properties.visible, "question visible is here");
  assert.equal(schema.definitions.question.properties.visible.type, "boolean", "question visible type is boolean");
  assert.equal(schema.definitions.question.$id, "question", "question id is correct");
  assert.ok(schema.definitions.question.properties.type, "question type is here");
  assert.equal(schema.definitions.question.properties.type.type, "string", "question type is string");
  assert.deepEqual(schema.definitions.question.required, ["type", "name"], "question required");
  assert.deepEqual(schema.definitions.question.properties.showCommentArea, { "type": "boolean" }, "question showCommentArea is boolean");

  const locString = schema.definitions.locstring;
  assert.equal(locString.type, "object", "locString type");
  assert.equal(locString.$id, "locstring", "locString $id");
  const lostStringProp = locString.properties;
  assert.ok(lostStringProp.default, "locale default is here");
  assert.ok(lostStringProp.en, "locale en is here");
  assert.ok(lostStringProp.fr, "locale fr is here");
  assert.equal(lostStringProp.default.type, "string", "has default in locString properties");
  assert.equal(lostStringProp.en.type, "string", "has en in locString properties");
  assert.equal(lostStringProp.fr.type, "string", "has fr in locString properties");

  const customProp2 = schema.properties.customSurveyProperty2;
  assert.ok(customProp2);
  assert.equal(customProp2.type, "string", "customProp2.type");
  assert.deepEqual(customProp2.enum, ["a", "b"], "customProp2.enum");
  Serializer.removeProperty("survey", "customSurveyProperty2");
});

QUnit.test("generate schema with polymorphic single object properties (maskSettings)", function (assert) {
  const schema = Serializer.generateSchema();
  const textProps = schema.definitions.text.allOf[1].properties;
  const maskSettingsProp = textProps.maskSettings;

  assert.ok(maskSettingsProp, "maskSettings property exists on text question");
  assert.ok(maskSettingsProp.oneOf, "maskSettings has oneOf for polymorphic types");
  assert.ok(maskSettingsProp.oneOf.length >= 5, "maskSettings oneOf has base and derived types");

  const refNames = maskSettingsProp.oneOf.map((item: any) => item.$ref);
  assert.ok(refNames.includes("masksettings"), "masksettings base class is in oneOf");
  assert.ok(refNames.includes("patternmask"), "patternmask is in oneOf");
  assert.ok(refNames.includes("numericmask"), "numericmask is in oneOf");
  assert.ok(refNames.includes("datetimemask"), "datetimemask is in oneOf");
  assert.ok(refNames.includes("currencymask"), "currencymask is in oneOf");

  assert.ok(schema.definitions.masksettings, "masksettings definition exists");
  assert.ok(schema.definitions.patternmask, "patternmask definition exists");
  assert.ok(schema.definitions.numericmask, "numericmask definition exists");
  assert.ok(schema.definitions.datetimemask, "datetimemask definition exists");
  assert.ok(schema.definitions.currencymask, "currencymask definition exists");

  assert.ok(schema.definitions.patternmask.allOf, "patternmask has allOf for inheritance");
  assert.equal(schema.definitions.patternmask.allOf[0].$ref, "masksettings", "patternmask extends masksettings");
  assert.ok(schema.definitions.patternmask.allOf[1].properties.pattern, "patternmask has pattern property");

  assert.ok(schema.definitions.numericmask.allOf, "numericmask has allOf for inheritance");
  assert.equal(schema.definitions.numericmask.allOf[0].$ref, "masksettings", "numericmask extends masksettings");
  assert.ok(schema.definitions.numericmask.allOf[1].properties.precision, "numericmask has precision property");

  assert.ok(schema.definitions.datetimemask.allOf, "datetimemask has allOf for inheritance");
  assert.equal(schema.definitions.datetimemask.allOf[0].$ref, "patternmask", "datetimemask extends patternmask");

  assert.ok(schema.definitions.currencymask.allOf, "currencymask has allOf for inheritance");
  assert.equal(schema.definitions.currencymask.allOf[0].$ref, "numericmask", "currencymask extends numericmask");
  assert.ok(schema.definitions.currencymask.allOf[1].properties.prefix, "currencymask has prefix property");
});
