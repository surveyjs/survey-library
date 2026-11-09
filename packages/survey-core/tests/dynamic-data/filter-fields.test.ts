import { afterEach, describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { Serializer } from "../../src/jsonobject";
import { ComponentCollection } from "../../src/question_custom";
import { getFilterFieldsForQuestions } from "../../src/dynamic-data/dynamic-data-filter-fields";
import "../../src/question_signaturepad";

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
  // Shown only where a Filter Control can reach the question: in a top-level Dynamic Panel's template,
  // at any depth, and as a matrix column.
  test("the property grid shows allowFiltering only where it applies", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "c1" }], detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d1" }] },
      { type: "file", name: "f" }, { type: "text", name: "t" },
      { type: "paneldynamic", name: "p", templateElements: [
        { type: "text", name: "pt" }, { type: "file", name: "pf" },
        { type: "panel", name: "inner", elements: [{ type: "dropdown", name: "pd", choices: [1, 2] }] },
        { type: "multipletext", name: "pm", items: [{ name: "i1" }] },
        { type: "paneldynamic", name: "nested", templateElements: [{ type: "text", name: "nt" }] }] }] });
    const prop = Serializer.findProperty("question", "allowFiltering");
    const p = <any>survey.getQuestionByName("p");
    const inTemplate = (name: string): any => p.template.getQuestionByName(name);
    expect(prop.isVisible("", survey.getQuestionByName("t")), "#1: a top-level question is no field").toBe(false);
    expect(prop.isVisible("", survey.getQuestionByName("f")), "#2").toBe(false);
    expect(prop.isVisible("", inTemplate("pt")), "#3: in the template").toBe(true);
    expect(prop.isVisible("", inTemplate("pf")), "#4: a file is never a field").toBe(false);
    expect(prop.isVisible("", inTemplate("pd")), "#5: in a panel in the template").toBe(true);
    expect(prop.isVisible("", inTemplate("pm")), "#6: it has nested fields, allowFiltering: false opts them out").toBe(true);
    expect(prop.isVisible("", inTemplate("nested").template.getQuestionByName("nt")), "#7: a nested Dynamic Panel's template").toBe(false);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const colProp = Serializer.findProperty("matrixdropdowncolumn", "allowFiltering");
    expect(colProp.isVisible("", matrix.columns[0]), "#8").toBe(true);
    expect(prop.isVisible("", matrix.detailPanel.getQuestionByName("d1")), "#9: a detail panel's question").toBe(false);
  });
  test("a Dynamic Panel subclass registered under a type of its own reaches its template's questions", () => {
    class MyDynamicPanel extends QuestionPanelDynamicModel {
      public getType(): string { return "mydynamicpanel"; }
    }
    Serializer.addClass("mydynamicpanel", [], (): any => new MyDynamicPanel(""), "paneldynamic");
    try {
      const survey = new SurveyModel({ elements: [{ type: "mydynamicpanel", name: "p", templateElements: [{ type: "text", name: "pt" }] }] });
      const pt = (<any>survey.getQuestionByName("p")).template.getQuestionByName("pt");
      expect(Serializer.findProperty("question", "allowFiltering").isVisible("", pt), "#1").toBe(true);
      expect(Serializer.findProperty("question", "filterOperators").isVisible("", pt), "#2").toBe(true);
    } finally {
      Serializer.removeClass("mydynamicpanel");
    }
  });
  test("a question that has nested filter fields shows allowFiltering, not filterOperators", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "multipletext", name: "pm", items: [{ name: "i1" }] }] }] });
    const pm = (<any>survey.getQuestionByName("p")).template.getQuestionByName("pm");
    expect(Serializer.findProperty("question", "allowFiltering").isVisible("", pm), "#1").toBe(true);
    expect(Serializer.findProperty("question", "filterOperators").isVisible("", pm), "#2").toBe(false);
  });
  test("filterOperators is shown where allowFiltering is on, and offers the operators of the question's type", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "top" }, { type: "paneldynamic", name: "p", templateElements: [
      { type: "file", name: "f" }, { type: "text", name: "t" }, { type: "boolean", name: "b" },
      { type: "text", name: "n", inputType: "number" }] }] });
    const prop = Serializer.findProperty("question", "filterOperators");
    const template = (<any>survey.getQuestionByName("p")).template;
    const t = template.getQuestionByName("t");
    expect(prop.isVisible("", t), "#1").toBe(true);
    expect(prop.isVisible("", template.getQuestionByName("f")), "#2: a file is never a field").toBe(false);
    expect(prop.isVisible("", survey.getQuestionByName("top")), "#3: no Filter Control reaches it").toBe(false);
    t.allowFiltering = false;
    expect(prop.isVisible("", t), "#4: opted out").toBe(false);
    t.allowFiltering = true;
    const bool = prop.getChoices(template.getQuestionByName("b"));
    expect(bool.filter((op: string): boolean => ["contains", "greater", "allof"].indexOf(op) > -1), "#5: a boolean").toEqual([]);
    expect(bool.indexOf("equal") > -1, "#6").toBe(true);
    t.filterOperators = ["equal"];
    expect(prop.getChoices(t).indexOf("contains") > -1, "#7: the author's own choice does not narrow the list").toBe(true);
    expect(prop.getChoices(template.getQuestionByName("n")).indexOf("greater") > -1, "#8: a number").toBe(true);
    expect(prop.getChoices(null), "#9: no object, every operator").toEqual(["empty", "notempty", "equal", "notequal", "contains", "notcontains",
      "anyof", "noneof", "allof", "greater", "less", "greaterorequal", "lessorequal"]);
    expect(Serializer.findProperty("text", "inputType").getDependedProperties().indexOf("filterOperators") > -1, "#10: inputType changes them").toBe(true);
  });
  test("the JSON schema still lists every operator", () => {
    const schema: any = Serializer.generateSchema();
    expect(schema.definitions.question.properties.filterOperators.enum.length, "#1").toBe(13);
  });
  test("a column's filterOperators follows the column's allowFiltering and offers its cell type's operators", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "c1", cellType: "dropdown" }, { name: "c2", cellType: "file" }, { name: "c3", cellType: "boolean" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const prop = Serializer.findProperty("matrixdropdowncolumn", "filterOperators");
    expect(prop.isVisible("", matrix.columns[0]), "#1").toBe(true);
    expect(prop.isVisible("", matrix.columns[1]), "#2: a file cell is never a field").toBe(false);
    expect(prop.getChoices(matrix.columns[2]).indexOf("contains"), "#3: a boolean column").toBe(-1);
    expect(prop.getChoices(matrix.columns[2].templateQuestion).indexOf("contains"), "#4: handed the cell question").toBe(-1);
    matrix.columns[0].allowFiltering = false;
    expect(prop.isVisible("", matrix.columns[0]), "#5: the column opted out").toBe(false);
  });
  // A Filter Control finds its source by name among the survey's questions, so a matrix in a Dynamic
  // Panel's template or in a detail panel is no source, and its columns are no fields.
  test("a column's properties are hidden where no Filter Control can reach its matrix", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "top", columns: [{ name: "c1" }], detailPanelMode: "underRow", detailElements: [
        { type: "matrixdynamic", name: "inDetail", columns: [{ name: "d1" }] }] },
      { type: "paneldynamic", name: "p", templateElements: [
        { type: "matrixdynamic", name: "inTemplate", columns: [{ name: "t1" }] }, { type: "text", name: "pt" }] }] });
    const allow = Serializer.findProperty("matrixdropdowncolumn", "allowFiltering");
    const operators = Serializer.findProperty("matrixdropdowncolumn", "filterOperators");
    const top = <QuestionMatrixDynamicModel>survey.getQuestionByName("top");
    const p = <any>survey.getQuestionByName("p");
    const inTemplate = <QuestionMatrixDynamicModel>p.template.getQuestionByName("inTemplate");
    const inDetail = <QuestionMatrixDynamicModel>top.detailPanel.getQuestionByName("inDetail");
    expect([allow.isVisible("", top.columns[0]), operators.isVisible("", top.columns[0])], "#1: a top-level matrix").toEqual([true, true]);
    expect([allow.isVisible("", inTemplate.columns[0]), operators.isVisible("", inTemplate.columns[0])], "#2: in a template").toEqual([false, false]);
    expect(operators.isVisible("", inTemplate.columns[0].templateQuestion), "#3: handed the cell question").toBe(false);
    expect([allow.isVisible("", inDetail.columns[0]), operators.isVisible("", inDetail.columns[0])], "#4: in a detail panel").toEqual([false, false]);
    expect(Serializer.findProperty("question", "allowFiltering").isVisible("", p.template.getQuestionByName("pt")), "#5: the template's own field").toBe(true);
  });
  test("a Dynamic Panel in a matrix detail panel is no source: its template's questions are no fields", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "top", columns: [{ name: "c1" }], detailPanelMode: "underRow", detailElements: [
        { type: "paneldynamic", name: "pdInDetail", templateElements: [{ type: "text", name: "x" }] }] }] });
    const top = <QuestionMatrixDynamicModel>survey.getQuestionByName("top");
    const x = (<any>top.detailPanel.getQuestionByName("pdInDetail")).template.getQuestionByName("x");
    expect([Serializer.findProperty("question", "allowFiltering").isVisible("", x),
      Serializer.findProperty("question", "filterOperators").isVisible("", x)], "#1").toEqual([false, false]);
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
  test("a column's filterOperators reach its descriptor; the cell question's own do not", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "c1", cellType: "dropdown", choices: [1, 2], filterOperators: ["anyof"] },
      { name: "c2", cellType: "dropdown", choices: [1, 2] }] }] });
    const matrix = <any>survey.getQuestionByName("m");
    expect(matrix.columns[0].filterOperators, "#1").toEqual(["anyof"]);
    expect(matrix.toJSON().columns[0].filterOperators, "#2").toEqual(["anyof"]);
    expect(matrix.toJSON().columns[1].filterOperators, "#3: not emitted when not set").toBe(undefined);
    matrix.columns[1].templateQuestion.filterOperators = ["equal"];
    const fields = matrix.getFilterFields();
    expect(fields[0].operators, "#4").toEqual(["anyof"]);
    expect(fields[1].operators, "#5: the column is the only authority").toBeFalsy();
  });
  test("a panel template question's filterOperators reach its descriptor", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "dropdown", name: "q1", choices: [1, 2], filterOperators: ["anyof", "noneof"] }, { type: "text", name: "q2" }] }] });
    const panel = <any>survey.getQuestionByName("p");
    expect(panel.toJSON().templateElements[0].filterOperators, "#1").toEqual(["anyof", "noneof"]);
    const fields = panel.getFilterFields();
    expect(fields[0].operators, "#2").toEqual(["anyof", "noneof"]);
    expect(fields[1].operators, "#3").toBeFalsy();
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
  test("a composite shows allowFiltering, in a template and as a column, and not filterOperators", () => {
    addCustomerInfo();
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", templateElements: [{ type: "customerinfo", name: "c" }] },
      { type: "matrixdynamic", name: "m", columns: [{ name: "col1", cellType: "customerinfo" }] }] });
    const c = (<any>survey.getQuestionByName("p")).template.getQuestionByName("c");
    expect(Serializer.findProperty("question", "allowFiltering").isVisible("", c), "#1").toBe(true);
    expect(Serializer.findProperty("question", "filterOperators").isVisible("", c), "#2").toBe(false);
    const column = (<any>survey.getQuestionByName("m")).columns[0];
    expect(Serializer.findProperty("matrixdropdowncolumn", "allowFiltering").isVisible("", column), "#3").toBe(true);
    expect(Serializer.findProperty("matrixdropdowncolumn", "filterOperators").isVisible("", column), "#4").toBe(false);
  });
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
