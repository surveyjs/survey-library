import { SurveyModel } from "../src/survey";
import { BindableProperties, Base } from "../src/base";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

export default QUnit.module("BindableProperties");

class BindableTester extends Base {
  constructor() {
    super();
  }
  public getType(): string {
    return "bindabletester";
  }
  public get strProperty(): string {
    return this.getPropertyValue("strProperty");
  }
  public set strProperty(val: string) {
    this.setPropertyValue("strProperty", val);
  }
}

Serializer.addClass(
  "bindabletester",
  [
    { name: "bindableProperties", serializationProperty: "bindableProperties" },
    "strProperty",
  ],
  function () {
    return new BindableTester();
  }
);

QUnit.test("Use calculated value in expression", function (assert) {
  var bindings = new BindableProperties();
  assert.equal(bindings.isEmpty(), true, "There is no binding");
  assert.notOk(
    bindings.getValueNameByPropertyName("defaultValue"),
    "There is no bindig for defaultValue"
  );
  assert.deepEqual(
    bindings.getPropertiesByValueName("valueName"),
    [],
    "There is no bindig for valueName"
  );
  bindings.setBinding("defaultValue", "valueName");
  assert.equal(bindings.isEmpty(), false, "There is one binding");
  assert.equal(
    bindings.getValueNameByPropertyName("defaultValue"),
    "valueName",
    "One binding"
  );
  assert.deepEqual(
    bindings.getPropertiesByValueName("valueName"),
    ["defaultValue"],
    "One binding"
  );
  bindings.setBinding("min", "valueName");
  assert.equal(bindings.isEmpty(), false, "There are two binding");
  assert.deepEqual(
    bindings.getPropertiesByValueName("valueName"),
    ["defaultValue", "min"],
    "Two bindings"
  );
  bindings.clearBinding("min");
  assert.equal(bindings.isEmpty(), false, "There is still on binding");
  assert.notOk(bindings.getValueNameByPropertyName("min"), "Remove binding");
  assert.deepEqual(
    bindings.getPropertiesByValueName("valueName"),
    ["defaultValue"],
    "Remove one binding"
  );
  bindings.setBinding("defaultValue", "");
  assert.equal(bindings.isEmpty(), true, "We remove all bindings");
  assert.notOk(
    bindings.getValueNameByPropertyName("defaultValue"),
    "setBinding with empty string"
  );
  assert.deepEqual(
    bindings.getPropertiesByValueName("valueName"),
    [],
    "There is no bindings"
  );
});

QUnit.test("Serialization", function (assert) {
  var obj = new BindableTester();
  assert.deepEqual(obj.toJSON(), {}, "Object is empty");
  obj.bindableProperties.setBinding("strProperty", "test");
  assert.deepEqual(
    obj.toJSON(),
    { bindableProperties: { strProperty: "test" } },
    "serialize bindable property"
  );
});
QUnit.test("Load from JSON", function (assert) {
  var obj = new BindableTester();
  obj.fromJSON({ bindableProperties: { strProperty: "test" } });
  assert.equal(
    obj.bindableProperties.getValueNameByPropertyName("strProperty"),
    "test",
    "binding set from JSON"
  );
});

QUnit.test("Question, bind a property", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { name: "q1", type: "text", defaultValue: 3 },
      {
        name: "q2",
        type: "text",
        bindableProperties: {
          min: "q1",
        },
      },
    ],
  });
  var question = survey.getQuestionByName("q2");
  assert.equal(
    question.bindableProperties.getValueNameByPropertyName("min"),
    "q1",
    "bindable properties serialized successful"
  );
  assert.equal(question.min, 3, "bindable question has default value");
  survey.setValue("q1", 4);
  assert.equal(question.min, 4, "bindable question value is 4");
  question.min = 5;
  assert.equal(survey.getValue("q1"), 5, "Set value from a property");
});

QUnit.test("Dynamic Panel, bind panelCount", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { name: "q1", type: "text", defaultValue: 3 },
      {
        name: "panel1",
        type: "paneldynamic",
        templateElements: [{ name: "p_q1", type: "text" }],
        bindableProperties: {
          panelCount: "q1",
        },
      },
    ],
  });
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
  assert.equal(
    panel.bindableProperties.getValueNameByPropertyName("panelCount"),
    "q1",
    "bindable properties serialized successful"
  );
  assert.equal(panel.panelCount, 3, "bindable question has default value");
  survey.setValue("q1", 4);
  assert.equal(panel.panelCount, 4, "bindable question value is 4");
  panel.addPanel();
  panel.addPanel();
  assert.equal(survey.getValue("q1"), 6, "We added two panels");
  panel.removePanel(0);
  assert.equal(survey.getValue("q1"), 5, "We removed one panel");
});

QUnit.test("Dynamic Matrix, bind rowCount", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { name: "q1", type: "text", defaultValue: 3 },
      {
        name: "matrix1",
        type: "matrixdynamic",
        columns: [{ name: "col1" }],
        bindableProperties: {
          rowCount: "q1",
        },
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  assert.equal(
    matrix.bindableProperties.getValueNameByPropertyName("rowCount"),
    "q1",
    "bindable properties serialized successful"
  );
  assert.equal(matrix.rowCount, 3, "bindable question has default value");
  survey.setValue("q1", 4);
  assert.equal(matrix.rowCount, 4, "bindable question value is 4");
  matrix.addRow();
  matrix.addRow();
  assert.equal(survey.getValue("q1"), 6, "We added two rows");
  matrix.removeRow(0);
  assert.equal(survey.getValue("q1"), 5, "We removed one row");
});
