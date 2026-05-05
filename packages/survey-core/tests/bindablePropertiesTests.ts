import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { Bindings, Base, ArrayChanges } from "../src/base";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

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

describe("Bindings", () => {
  test("Use calculated value in expression", () => {
    var bindings = new Bindings(null);
    expect(bindings.isEmpty(), "There is no binding").toBe(true);
    expect(
      bindings.getValueNameByPropertyName("defaultValue"),
      "There is no bindig for defaultValue"
    ).toBeFalsy();
    expect(
      bindings.getPropertiesByValueName("valueName"),
      "There is no bindig for valueName"
    ).toEqual([]);
    bindings.setBinding("defaultValue", "valueName");
    expect(bindings.isEmpty(), "There is one binding").toBe(false);
    expect(
      bindings.getValueNameByPropertyName("defaultValue"),
      "One binding"
    ).toBe("valueName");
    expect(
      bindings.getPropertiesByValueName("valueName"),
      "One binding"
    ).toEqual(["defaultValue"]);
    bindings.setBinding("min", "valueName");
    expect(bindings.isEmpty(), "There are two binding").toBe(false);
    expect(
      bindings.getPropertiesByValueName("valueName"),
      "Two bindings"
    ).toEqual(["defaultValue", "min"]);
    bindings.clearBinding("min");
    expect(bindings.isEmpty(), "There is still on binding").toBe(false);
    expect(
      bindings.getValueNameByPropertyName("min"),
      "Remove binding"
    ).toBeFalsy();
    expect(
      bindings.getPropertiesByValueName("valueName"),
      "Remove one binding"
    ).toEqual(["defaultValue"]);
    bindings.setBinding("defaultValue", "");
    expect(bindings.isEmpty(), "We remove all bindings").toBe(true);
    expect(
      bindings.getValueNameByPropertyName("defaultValue"),
      "setBinding with empty string"
    ).toBeFalsy();
    expect(
      bindings.getPropertiesByValueName("valueName"),
      "There is no bindings"
    ).toEqual([]);
  });

  test("Serialization", () => {
    var obj = new BindingsTester();
    expect(obj.toJSON(), "Object is empty").toEqual({});
    obj.bindings.setBinding("strProperty", "test");
    expect(obj.toJSON(), "serialize bindable property").toEqual({
      bindings: { strProperty: "test" },
    });
  });

  test("Load from JSON", () => {
    var obj = new BindingsTester();
    obj.fromJSON({ bindings: { strProperty: "test" } });
    expect(
      obj.bindings.getValueNameByPropertyName("strProperty"),
      "binding set from JSON"
    ).toBe("test");
  });

  test("Question, bind a property", () => {
    var survey = new SurveyModel({
      elements: [
        { name: "q1", type: "text", inputType: "number", defaultValue: 3 },
        {
          name: "q2",
          type: "matrixdynamic",
          bindings: {
            rowCount: "q1",
          },
        },
      ],
    });
    var question = survey.getQuestionByName("q2");
    expect(
      question.bindings.getValueNameByPropertyName("rowCount"),
      "bindable properties serialized successful"
    ).toBe("q1");
    expect(question.rowCount, "bindable question has default value").toBe(3);
    survey.setValue("q1", 4);
    expect(question.rowCount, "bindable question value is 4").toBe(4);
    question.rowCount = 5;
    expect(survey.getValue("q1"), "Set value from a property").toBe(5);
  });

  test("Dynamic Panel, bind panelCount", () => {
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
    expect(
      panel.bindings.getValueNameByPropertyName("panelCount"),
      "bindable properties serialized successful"
    ).toBe("q1");
    expect(panel.panelCount, "bindable question has default value").toBe(3);
    survey.setValue("q1", 4);
    expect(panel.panelCount, "bindable question value is 4").toBe(4);
    panel.addPanel();
    panel.addPanel();
    expect(survey.getValue("q1"), "We added two panels").toBe(6);
    panel.removePanel(0);
    expect(survey.getValue("q1"), "We removed one panel").toBe(5);
  });

  test("Dynamic Matrix, bind rowCount", () => {
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
    expect(
      matrix.bindings.getValueNameByPropertyName("rowCount"),
      "bindable properties serialized successful"
    ).toBe("q1");
    expect(matrix.rowCount, "bindable question has default value").toBe(3);
    survey.setValue("q1", 4);
    expect(matrix.rowCount, "bindable question value is 4").toBe(4);
    matrix.addRow();
    matrix.addRow();
    expect(survey.getValue("q1"), "We added two rows").toBe(6);
    matrix.removeRow(0);
    expect(survey.getValue("q1"), "We removed one row").toBe(5);
    survey.clearValue("q1");
    expect(matrix.rowCount, "bindable question value is cleared").toBe(0);
    survey.setValue("q1", 6);
    expect(matrix.rowCount, "bindable question value is 4").toBe(6);
  });

  test("BindingsTester, getNames()", () => {
    expect(
      new BindingsTester().bindings.getNames(),
      "One bindable property"
    ).toEqual(["strProperty"]);
    Serializer.findProperty("bindingstester", "strProperty").visible = false;
    expect(
      new BindingsTester().bindings.getNames(),
      "Made bindable property invisible"
    ).toEqual([]);
    Serializer.findProperty("bindingstester", "strProperty").visible = true;
    expect(
      new BindingsTester().bindings.getNames(),
      "Made bindable property visible again"
    ).toEqual(["strProperty"]);
  });

  test("Dynamic Panel, getNames()", () => {
    expect(
      new QuestionPanelDynamicModel("q1").bindings.getNames(),
      "One bindable property"
    ).toEqual(["panelCount"]);
  });

  test("onPropertyValueChangedCallback is not changed on changing bindings", () => {
    const survey = new SurveyModel({
      elements: [
        { name: "q1", type: "text", defaultValue: 3 },
        {
          name: "matrix1",
          type: "matrixdynamic",
          columns: [{ name: "col1" }],
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
      rowCount: "q1",
    };
    matrix.bindings.setBinding("rowCount", "q1");
    expect(counter, "#1, Binding is changed").toBe(1);
    expect(e_name, "#1, name").toBe("bindings");
    expect(e_oldValue, "#1, oldValue").toBeFalsy();
    expect(e_newValue, "#1, newValue").toEqual(bindingJSON);
    expect(e_sender.name, "#1, sender").toBe("matrix1");
    matrix.bindings.clearBinding("rowCount");
    expect(counter, "#2, Binding is changed").toBe(2);
    expect(e_name, "#2, name").toBe("bindings");
    expect(e_oldValue, "#2, oldValue").toEqual(bindingJSON);
    expect(e_newValue, "#2, newValue").toEqual(undefined);
    expect(e_sender.name, "#2, sender").toBe("matrix1");
    matrix.bindings.setJson(bindingJSON);
    expect(counter, "#3, Binding is changed").toBe(3);
    expect(e_name, "#3, name").toBe("bindings");
    expect(e_oldValue, "#3, oldValue").toEqual(undefined);
    expect(e_newValue, "#3, newValue").toEqual(bindingJSON);
    expect(e_sender.name, "#3, sender").toBe("matrix1");
  });

  test("Dynamic Matrix, bind rowCount and expression column", () => {
    var survey = new SurveyModel({
      elements: [
        { name: "q1", type: "text" },
        {
          name: "matrix1",
          type: "matrixdynamic",
          columns: [
            { name: "col1", cellType: "expression", expression: "'Row ' + {rowIndex}" },
          ],
          rowCount: 0,
          bindings: {
            rowCount: "q1",
          },
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    expect(matrix.rowCount, "row count is 0 by default").toBe(0);
    survey.setValue("q1", 3);
    expect(matrix.rowCount, "bindable question value is 3").toBe(3);
    expect(matrix.visibleRows.length, "visible rows is 3").toBe(3);
    expect(matrix.value, "expression set correct value").toEqual([
      { col1: "Row 1" },
      { col1: "Row 2" },
      { col1: "Row 3" },
    ]);
  });

  test("Bindings - do not store incorrect values", () => {
    var survey = new SurveyModel({
      elements: [
        { name: "q1", type: "text" },
        {
          name: "q2",
          type: "matrixdynamic",
          bindings: {
            rowCount: "q1",
            pos: {
              pos: {
                start: 1,
                end: 10,
              },
              start: 20,
              end: 30,
            },
          },
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    expect(matrix.toJSON(), "toJSON #1").toEqual({
      name: "q2",
      bindings: { rowCount: "q1" },
    });
    matrix.bindings.setBinding("dummy", "val1");
    expect(matrix.toJSON(), "toJSON #2").toEqual({
      name: "q2",
      bindings: { rowCount: "q1" },
    });
  });
});
