import { JsonObject, Serializer } from "../src/jsonobject";
import { Base } from "../src/base";
import { SurveyModel } from "../src/survey";

export default QUnit.module("JsonSchemaTests");

QUnit.test("generate survey schema", function (assert) {
  Serializer.findClass;
  var schema = Serializer.generateSchema();
  assert.equal(schema.title, "SurveyJS Library json schema");
  assert.equal(schema.properties.surveyId.type, "string", "surveyId is string");
  assert.equal(
    schema.properties.sendResultOnPageNext.type,
    "boolean",
    "sendResultOnPageNext is boolean"
  );
  assert.equal(
    schema.properties.maxTextLength.type,
    "number",
    "maxTextLength is number"
  );
  assert.equal(
    schema.properties.showNavigationButtons.type,
    "string",
    "showNavigationButtons is showNavigationButtons"
  );
  assert.deepEqual(
    schema.properties.showNavigationButtons.enum,
    ["none", "top", "bottom", "both"],
    "showNavigationButtons has enum"
  );
  assert.deepEqual(
    schema.properties.completedHtmlOnCondition.type,
    "array",
    "completedHtmlOnCondition type is array"
  );
  assert.deepEqual(
    schema.properties.completedHtmlOnCondition.items.$ref,
    "#htmlconditionitem",
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
    "#htmlconditionitem",
    "htmlconditionitem id is here"
  );
  assert.ok(schema.definitions.page, "page object is here");
  assert.equal(schema.definitions.page.type, "object", "page type is object");
  assert.equal(schema.definitions.page.$id, "#page", "page id is here");
  assert.ok(schema.definitions.page.allOff, "page has allOff");
  assert.equal(
    schema.definitions.page.allOff.length,
    2,
    "page.allOff is array with two items"
  );
  assert.equal(
    schema.definitions.page.allOff[0].$ref,
    "#panelbase",
    "page parent is here"
  );
  assert.ok(
    schema.definitions.page.allOff[1].properties,
    "page.allOff has properties"
  );

  assert.ok(schema.definitions.panelbase, "panelbase object is here");
  assert.equal(
    schema.definitions.panelbase.type,
    "object",
    "panelbase type is object"
  );
  assert.equal(
    schema.definitions.panelbase.$id,
    "#panelbase",
    "panelbase id is here"
  );
  assert.equal(
    schema.definitions.panelbase.properties.title.type,
    "string",
    "panelbase.title type is string"
  );

  assert.equal(schema.properties.triggers.type, "array", "triggers is array");
  assert.deepEqual(
    schema.properties.triggers.items,
    [
      {
        $ref: "#visibletrigger",
      },
      {
        $ref: "#completetrigger",
      },
      {
        $ref: "#setvaluetrigger",
      },
      {
        $ref: "#copyvaluetrigger",
      },
      {
        $ref: "#skiptrigger",
      },
      {
        $ref: "#runexpressiontrigger",
      },
    ],
    "triggers.items"
  );

  assert.equal(
    schema.definitions.panelbase.properties.elements.type,
    "array",
    "panelbase.elements type is array"
  );
  var panelElements = schema.definitions.panelbase.properties.elements.items;
  assert.ok(
    panelElements.length > 5,
    "There are many elements in panelbase.elements.items"
  );
  function findInElements(elType: string): boolean {
    for (var i = 0; i < panelElements.length; i++)
      if (panelElements[i].$ref == elType) return true;
    return false;
  }
  assert.ok(findInElements("#text"), "question text is in panel.elements");
  assert.ok(
    findInElements("#checkbox"),
    "question checkbox is in panel.elements"
  );
  assert.ok(
    findInElements("#matrixdropdown"),
    "question matrixdropdown is in panel.elements"
  );
  assert.ok(findInElements("#panel"), "panel is in panel.elements");
  assert.notOk(findInElements("#page"), "page is not in panel.elements");
  assert.notOk(
    findInElements("#question"),
    "abstract question is not in panel.elements"
  );

  var propChoices = schema.definitions.selectbase.allOff[1].properties.choices;
  assert.ok(propChoices, "selectbase class and it's choices is here");
  assert.equal(propChoices.type, "array", "choices is array");
  assert.equal(propChoices.items.$ref, "#itemvalue", "item is  itemvalue");
  assert.notOk(
    schema.definitions.selectbase.allOff[1].properties.name,
    "This property should be in question"
  );

  assert.equal(
    schema.definitions.itemvalue.properties.text.type,
    "string",
    "itemvalue text is string"
  );
});
