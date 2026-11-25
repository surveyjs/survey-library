import { afterEach, describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { Serializer } from "../../src/jsonobject";
import { ComponentCollection } from "../../src/question_custom";
import { getFilterFieldsForQuestions } from "../../src/dynamic-data/dynamic-data-filter-fields";
import "../../src/question_signaturepad";
import "../../src/question_boolean";
import "../../src/question_comment";
import "../../src/question_expression";
import "../../src/question_multipletext";
import "../../src/question_matrixdropdown";

describe("isFilterable", () => {
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
});

describe("getFilterFields", () => {
  test("a file and a signature pad are no fields, in a template and as a column", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", templateElements: [
        { type: "text", name: "t" }, { type: "file", name: "f" }, { type: "signaturepad", name: "s" }] },
      { type: "matrixdynamic", name: "m", columns: [
        { name: "c1" }, { name: "c2", cellType: "file" }, { name: "c3", cellType: "signaturepad" }] }] });
    const panel = <any>survey.getQuestionByName("p");
    expect(getFilterFieldsForQuestions(panel.template.questions).map((f: any) => f.name), "#1").toEqual(["t"]);
    expect((<any>survey.getQuestionByName("m")).getFilterFields().map((f: any) => f.name), "#2").toEqual(["c1"]);
  });
  test("a matrix answers one descriptor per filterable column", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "c1", title: "Country" },
      { name: "c2", cellType: "rating" },
      { name: "c3", cellType: "file" }] }] });
    const matrix = <any>survey.getQuestionByName("m");
    const fields = matrix.getFilterFields();
    expect(fields.map((f: any) => f.name), "#1: no file").toEqual(["c1", "c2"]);
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
  test("a dropdown matrix in a panel template contributes no field", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "text", name: "q1" },
      { type: "matrixdropdown", name: "md", rows: ["r1", "r2"], columns: [{ name: "c1" }] }] }] });
    const fields = (<any>survey.getQuestionByName("p")).getFilterFields();
    expect(fields.map((f: any) => f.valueName), "#1: its cells sit under the row, not under the matrix")
      .toEqual(["q1"]);
  });
  test("a select column with no choices of its own reports the matrix choices", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m",
      choices: [{ value: "de", text: "Germany" }], columns: [
        { name: "c1" }, { name: "c2", cellType: "dropdown", choices: ["x"] }, { name: "c3", cellType: "text" }] }] });
    const fields = (<any>survey.getQuestionByName("m")).getFilterFields();
    expect(fields[0].choices.map((item: any) => item.value), "#1: what its cells show").toEqual(["de"]);
    expect(fields[1].choices, "#2: its own choices are the template question's").toBe(undefined);
    expect(fields[2].choices, "#3: not a select column").toBe(undefined);
  });
});

// The detail panel is a part of the row record, as the sort bar already takes it: its questions are
// fields after the columns, by the same walk a Dynamic Panel template takes.
describe("getFilterFields with a detail panel", () => {
  const expenses = (detailPanelMode?: string): any => ({ type: "matrixdynamic", name: "expenses", detailPanelMode: detailPanelMode,
    columns: [
      { name: "date", cellType: "text", inputType: "date" },
      { name: "category", cellType: "dropdown", choices: ["Airfare", "Meals"] },
      { name: "merchant", cellType: "text" },
      { name: "amount", cellType: "text", inputType: "number" }],
    detailElements: [
      { type: "dropdown", name: "project", choices: ["PRJ-118", "PRJ-204"] },
      { type: "dropdown", name: "payment", startWithNewLine: false, choices: ["corporate", "cash"] },
      { type: "boolean", name: "receipt" },
      { type: "boolean", name: "billable", startWithNewLine: false },
      { type: "comment", name: "purpose", rows: 2 }] });
  test("a matrix offers its detail panel's questions after its columns", () => {
    const survey = new SurveyModel({ elements: [expenses("underRowSingle")] });
    const matrix = <any>survey.getQuestionByName("expenses");
    const fields = matrix.getFilterFields();
    expect(fields.map((f: any) => f.name), "#1").toEqual(["date", "category", "merchant", "amount", "project", "payment", "receipt", "billable", "purpose"]);
    const project = fields.filter((f: any) => f.name === "project")[0];
    expect(project.fieldType, "#2").toBe("dropdown");
    expect(project.templateQuestion, "#3: the detail panel template's question").toBe(matrix.detailPanel.getQuestionByName("project"));
    expect(fields.filter((f: any) => f.name === "receipt")[0].fieldType, "#4").toBe("boolean");
  });
  test("without a detail panel mode the detail elements are no fields", () => {
    const survey = new SurveyModel({ elements: [expenses()] });
    expect((<any>survey.getQuestionByName("expenses")).getFilterFields().map((f: any) => f.name), "#1").toEqual(["date", "category", "merchant", "amount"]);
  });
  test("a detail question nested in a panel, an expression, a multipletext", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c1" }], detailPanelMode: "underRow", detailElements: [
      { type: "panel", name: "pnl", elements: [{ type: "text", name: "inner" }] },
      { type: "expression", name: "calc", expression: "1" },
      { type: "multipletext", name: "mt", items: [{ name: "i1" }] }] }] });
    expect((<any>survey.getQuestionByName("m")).getFilterFields().map((f: any) => f.valueName),
      "#1: an expression holds a value only in the rows that were opened").toEqual(["c1", "inner", "mt.i1"]);
  });
  test("a detail question sharing a column's key leaves the field to the column", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c1" }, { name: "c2" }],
      detailPanelMode: "underRow", detailElements: [{ type: "dropdown", name: "c1", choices: [1] }, { type: "text", name: "c2" }, { type: "text", name: "d" }] }] });
    const matrix = <any>survey.getQuestionByName("m");
    const fields = matrix.getFilterFields();
    expect(fields.map((f: any) => f.name), "#1: a key a column has stays the column's").toEqual(["c1", "c2", "d"]);
    expect(fields[0].templateQuestion, "#2").toBe(matrix.columns[0].templateQuestion);
  });
  test("a fixed-rows matrix offers its detail panel's questions too", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }],
      detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] }] });
    expect((<any>survey.getQuestionByName("md")).getFilterFields().map((f: any) => f.name), "#1").toEqual(["c1", "d"]);
  });
});
