import { afterEach, describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Serializer } from "../../src/jsonobject";
import { ComponentCollection } from "../../src/question_custom";

describe("isFilterable and allowFiltering", () => {
  test("the types that cannot be filtered say so", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" }, { type: "expression", name: "q2", expression: "1" },
      { type: "checkbox", name: "q3", choices: [1, 2] }, { type: "file", name: "q4" },
      { type: "html", name: "q5" }, { type: "multipletext", name: "q6", items: [{ name: "i1" }] },
      { type: "paneldynamic", name: "q7" }] });
    const isFilterable = (name: string): boolean => (<any>survey.getQuestionByName(name)).isFilterable;
    expect(isFilterable("q1"), "#1: text").toBe(true);
    expect(isFilterable("q2"), "#2: an expression stores a real value").toBe(true);
    expect(isFilterable("q3"), "#3: an array of choices is filtered with anyof").toBe(true);
    expect(isFilterable("q4"), "#4: only the file UI can produce it").toBe(false);
    expect(isFilterable("q5"), "#5: it stores nothing").toBe(false);
    expect(isFilterable("q6"), "#6: a record of its own, its items are the fields").toBe(false);
    expect(isFilterable("q7"), "#7: a table of its own").toBe(false);
  });
  test("allowFiltering defaults to true, serializes when set and is per column", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "c1" }, { name: "c2", allowFiltering: false }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.columns[0].allowFiltering, "#1").toBe(true);
    expect(matrix.columns[1].allowFiltering, "#2").toBe(false);
    expect(matrix.toJSON().columns[0].allowFiltering, "#3: the default is not emitted").toBe(undefined);
    expect(matrix.toJSON().columns[1].allowFiltering, "#4").toBe(false);
  });
  test("the property grid shows allowFiltering only where it applies", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "c1" }] },
      { type: "file", name: "f" }, { type: "text", name: "t" }] });
    const prop = Serializer.findProperty("question", "allowFiltering");
    expect(prop.isVisible("", survey.getQuestionByName("t")), "#1").toBe(true);
    expect(prop.isVisible("", survey.getQuestionByName("f")), "#2").toBe(false);
    const colProp = Serializer.findProperty("matrixdropdowncolumn", "allowFiltering");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(colProp.isVisible("", matrix.columns[0]), "#3").toBe(true);
  });
});

describe("getFilterFields", () => {
  test("a matrix answers one descriptor per filterable column", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "c1", title: "Country" },
      { name: "c2", cellType: "rating" },
      { name: "c3", cellType: "file" },
      { name: "c4", allowFiltering: false }] }] });
    const matrix = <any>survey.getQuestionByName("m");
    const fields = matrix.getFilterFields();
    expect(fields.map((f: any) => f.name), "#1: no file, no opted-out column").toEqual(["c1", "c2"]);
    expect(fields[0].valueName, "#2").toBe("c1");
    expect(fields[0].locTitle.text, "#3: localizable").toBe("Country");
    expect(fields[0].fieldType, "#4: the resolved cell type, not 'default'").toBe("dropdown");
    expect(fields[1].valueType, "#5").toBe("number");
    expect(fields[1].templateQuestion, "#6").toBe(matrix.columns[1].templateQuestion);
  });
  test("a column bound through valueName names the key the cell writes", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m",
      columns: [{ name: "c1", cellType: "text", valueName: "country" }] }] });
    const fields = (<any>survey.getQuestionByName("m")).getFilterFields();
    expect(fields[0].name, "#1: the authored name").toBe("c1");
    expect(fields[0].valueName, "#2: the record key").toBe("country");
  });
  test("a dynamic panel walks its template, its static panels and its composite values", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "inner", elements: [{ type: "text", name: "q2" }] },
      { type: "multipletext", name: "mt", items: [{ name: "i1" }, { name: "i2" }] },
      { type: "file", name: "q3" },
      { type: "html", name: "q4" },
      { type: "matrixdynamic", name: "q5", columns: [{ name: "c1" }] }] }] });
    const fields = (<any>survey.getQuestionByName("p")).getFilterFields();
    expect(fields.map((f: any) => f.valueName), "#1: a nested table contributes nothing")
      .toEqual(["q1", "q2", "mt.i1", "mt.i2"]);
    expect(fields[1].name, "#2: a static panel is flattened, the key is plain").toBe("q2");
  });
  test("the dotted key of a nested field is the one the expression resolves", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 2,
      templateElements: [{ type: "multipletext", name: "mt", items: [{ name: "i1" }] }] }] });
    const panel = <any>survey.getQuestionByName("p");
    panel.value = [{ mt: { i1: "a" } }, { mt: { i1: "b" } }];
    const field = panel.getFilterFields()[0];
    panel.setControlFilter("control", "{" + field.valueName + "} = 'a'");
    expect(panel.visiblePanels.length, "#1: the record was reached through the dotted path").toBe(1);
  });
});

describe("getFilterFields with a composite cell type", () => {
  const addCustomerInfo = (): void => {
    ComponentCollection.Instance.add({ name: "customerinfo", elementsJSON: [
      { type: "text", name: "firstName" }, { type: "text", name: "lastName" }] });
  };
  afterEach(() => { ComponentCollection.Instance.clear(); });
  test("a composite column contributes its children and not itself", () => {
    addCustomerInfo();
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "col1", cellType: "customerinfo" }, { name: "col2", cellType: "text" }] }] });
    const fields = (<any>survey.getQuestionByName("m")).getFilterFields();
    expect(fields.map((f: any) => f.valueName), "#1: the composite is walked, not offered")
      .toEqual(["col1.firstName", "col1.lastName", "col2"]);
    expect(fields[0].name, "#2: the child names itself").toBe("firstName");
    expect(fields[0].fieldType, "#3: the child supplies the editor").toBe("text");
  });
  test("the dotted key of a composite cell is the one the expression resolves", () => {
    addCustomerInfo();
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 2,
      columns: [{ name: "col1", cellType: "customerinfo" }] }] });
    const matrix = <any>survey.getQuestionByName("m");
    matrix.value = [{ col1: { firstName: "Jon" } }, { col1: { firstName: "Jaime" } }];
    const field = matrix.getFilterFields()[0];
    matrix.setControlFilter("control", "{" + field.valueName + "} = 'Jon'");
    expect(matrix.visibleRows.length, "#1: the row was reached through the dotted path").toBe(1);
  });
  test("a composite column bound through valueName prefixes by the record key", () => {
    addCustomerInfo();
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m",
      columns: [{ name: "col1", cellType: "customerinfo", valueName: "customer" }] }] });
    const fields = (<any>survey.getQuestionByName("m")).getFilterFields();
    expect(fields.map((f: any) => f.valueName), "#1: the key the cell writes, not the column name")
      .toEqual(["customer.firstName", "customer.lastName"]);
  });
});
