import { SurveyModel } from "../src/survey";
import { Bindings, Base, ArrayChanges } from "../src/base";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

export default QUnit.module("Bindings");

class BindingsTester extends Base {
  constructor() {
    super();
  }
  public getType(): string {
    return "bindingstester";
  }
  public get strProperty(): string {
    return this.getPropertyValue("strProperty");
  }
  public set strProperty(val: string) {
    this.setPropertyValue("strProperty", val);
  }
}

Serializer.addClass(
  "bindingstester",
  [
    { name: "bindings", serializationProperty: "bindings" },
    { name: "strProperty", isBindable: true },
  ],
  function () {
    return new BindingsTester();
  }
);

QUnit.test("Use calculated value in expression", function (assert) {
  var bindings = new Bindings(null);
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
  var obj = new BindingsTester();
  assert.deepEqual(obj.toJSON(), {}, "Object is empty");
  obj.bindings.setBinding("strProperty", "test");
  assert.deepEqual(
    obj.toJSON(),
    { bindings: { strProperty: "test" } },
    "serialize bindable property"
  );
});
QUnit.test("Load from JSON", function (assert) {
  var obj = new BindingsTester();
  obj.fromJSON({ bindings: { strProperty: "test" } });
  assert.equal(
    obj.bindings.getValueNameByPropertyName("strProperty"),
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
        bindings: {
          min: "q1",
        },
      },
    ],
  });
  var question = survey.getQuestionByName("q2");
  assert.equal(
    question.bindings.getValueNameByPropertyName("min"),
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
        bindings: {
          panelCount: "q1",
        },
      },
    ],
  });
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
  assert.equal(
    panel.bindings.getValueNameByPropertyName("panelCount"),
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
        bindings: {
          rowCount: "q1",
        },
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  assert.equal(
    matrix.bindings.getValueNameByPropertyName("rowCount"),
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
  survey.clearValue("q1");
  assert.equal(matrix.rowCount, 0, "bindable question value is cleared");
  survey.setValue("q1", 6);
  assert.equal(matrix.rowCount, 6, "bindable question value is 4");
});

QUnit.test("BindingsTester, getNames()", function (assert) {
  assert.deepEqual(
    new BindingsTester().bindings.getNames(),
    ["strProperty"],
    "One bindable property"
  );
  Serializer.findProperty("bindingstester", "strProperty").visible = false;
  assert.deepEqual(
    new BindingsTester().bindings.getNames(),
    [],
    "Made bindable property invisible"
  );
  Serializer.findProperty("bindingstester", "strProperty").visible = true;
  assert.deepEqual(
    new BindingsTester().bindings.getNames(),
    ["strProperty"],
    "Made bindable property visible again"
  );
});

QUnit.test("Dynamic Panel, getNames()", function (assert) {
  assert.deepEqual(
    new QuestionPanelDynamicModel("q1").bindings.getNames(),
    ["panelCount"],
    "One bindable property"
  );
});
QUnit.test("onPropertyValueChangedCallback is not changed on changing bindings", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { name: "q1", type: "text", defaultValue: 3 },
      {
        name: "matrix1",
        type: "matrixdynamic",
        columns: [{ name: "col1" }]
      },
    ],
  });
  let e_name, e_oldValue, e_newValue, e_sender;
  let counter = 0;
  survey.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: ArrayChanges
  ) => {
    e_name = name;
    e_oldValue = oldValue;
    e_newValue = newValue;
    e_sender = sender;
    counter++;
  };
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  const bindingJSON = {
    rowCount: "q1"
  };
  matrix.bindings.setBinding("rowCount", "q1");
  assert.equal(counter, 1, "#1, Binding is changed");
  assert.equal(e_name, "bindings", "#1, name");
  assert.notOk(e_oldValue, "#1, oldValue");
  assert.deepEqual(e_newValue, bindingJSON, "#1, newValue");
  assert.equal(e_sender.name, "matrix1", "#1, sender");
  matrix.bindings.clearBinding("rowCount");
  assert.equal(counter, 2, "#2, Binding is changed");
  assert.equal(e_name, "bindings", "#2, name");
  assert.deepEqual(e_oldValue, bindingJSON, "#2, oldValue");
  assert.deepEqual(e_newValue, undefined, "#2, newValue");
  assert.equal(e_sender.name, "matrix1", "#2, sender");
  matrix.bindings.setJson(bindingJSON);
  assert.equal(counter, 3, "#3, Binding is changed");
  assert.equal(e_name, "bindings", "#3, name");
  assert.deepEqual(e_oldValue, undefined, "#3, oldValue");
  assert.deepEqual(e_newValue, bindingJSON, "#3, newValue");
  assert.equal(e_sender.name, "matrix1", "#3, sender");
});
QUnit.test("Dynamic Matrix, bind rowCount and expression column", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { name: "q1", type: "text" },
      {
        name: "matrix1",
        type: "matrixdynamic",
        columns: [{ name: "col1", cellType: "expression", expression: "'Row ' + {rowIndex}" }],
        rowCount: 0,
        bindings: {
          rowCount: "q1",
        },
      },
    ],
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  assert.equal(matrix.rowCount, 0, "row count is 0 by default");
  survey.setValue("q1", 3);
  assert.equal(matrix.rowCount, 3, "bindable question value is 3");
  assert.equal(matrix.visibleRows.length, 3, "visible rows is 3");
  assert.deepEqual(matrix.value, [{ col1: "Row 1" }, { col1: "Row 2" }, { col1: "Row 3" }], "expression set correct value");
});
