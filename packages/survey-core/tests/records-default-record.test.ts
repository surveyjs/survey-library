import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

const columns = [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }];
const templateElements = [{ type: "text", name: "a" }, { type: "text", name: "b" }];
function createMatrix(json: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "q", columns: columns }, json)] });
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
}
function createPanel(json: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "q", templateElements: templateElements }, json)] });
  return <QuestionPanelDynamicModel>survey.getQuestionByName("q");
}

describe("the default record of the dynamic matrix and the dynamic panel", () => {
  test("an empty question gets one copy of the default record per record", () => {
    expect(createMatrix({ rowCount: 2, defaultRowValue: { a: 1 } }).value, "#1: matrix").toEqual([{ a: 1 }, { a: 1 }]);
    expect(createPanel({ panelCount: 2, defaultPanelValue: { a: 1 } }).value, "#2: panel").toEqual([{ a: 1 }, { a: 1 }]);
  });
  test("defaultValue wins over the default record", () => {
    const defaultValue = [{ b: 2 }];
    expect(createMatrix({ rowCount: 2, defaultRowValue: { a: 1 }, defaultValue: defaultValue }).value, "#1: matrix").toEqual(defaultValue);
    expect(createPanel({ panelCount: 2, defaultPanelValue: { a: 1 }, defaultValue: defaultValue }).value, "#2: panel").toEqual(defaultValue);
  });
  test("no record, no copy: the value stays empty", () => {
    expect(createMatrix({ rowCount: 0, defaultRowValue: { a: 1 } }).isEmpty(), "#1: matrix").toBe(true);
    expect(createPanel({ panelCount: 0, defaultPanelValue: { a: 1 } }).isEmpty(), "#2: panel").toBe(true);
  });
  test("a question with a default record has a default value: clearing it in design mode does not leave it empty", () => {
    const matrix = createMatrix({ rowCount: 1, defaultRowValue: { a: 1 } });
    const panel = createPanel({ panelCount: 1, defaultPanelValue: { a: 1 } });
    expect(matrix["isDefaultValueEmpty"](), "#1: matrix").toBe(false);
    expect(panel["isDefaultValueEmpty"](), "#2: panel").toBe(false);
    expect(createMatrix({ rowCount: 1 })["isDefaultValueEmpty"](), "#3: matrix without one").toBe(true);
    expect(createPanel({ panelCount: 1 })["isDefaultValueEmpty"](), "#4: panel without one").toBe(true);
  });
  test("the Multi-Select Matrix has no default record: its defaultValue is applied as for any question", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "q", columns: columns, rows: ["r1", "r2"],
      defaultValue: { r1: { a: 1 } } }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
    expect(matrix.value, "#1").toEqual({ r1: { a: 1 } });
    expect(matrix["isDefaultValueEmpty"](), "#2").toBe(false);
    const empty = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "q", columns: columns, rows: ["r1"] }] });
    expect(empty.getQuestionByName("q")["isDefaultValueEmpty"](), "#3").toBe(true);
    expect(empty.getQuestionByName("q").isEmpty(), "#4").toBe(true);
  });
});

describe("confirmDelete: a record that is empty or equals the default record is removed without asking", () => {
  test("dynamic matrix", () => {
    const matrix = createMatrix({ rowCount: 3, confirmDelete: true, defaultRowValue: { a: 1 } });
    matrix.value = [{ a: 1 }, { a: 2 }, {}];
    expect([0, 1, 2].map(i => matrix.isRequireConfirmOnRowDelete(i)), "#1").toEqual([false, true, false]);
    matrix.confirmDelete = false;
    expect(matrix.isRequireConfirmOnRowDelete(1), "#2: confirmDelete is off").toBe(false);
  });
  test("dynamic panel", () => {
    const panel = createPanel({ panelCount: 3, confirmDelete: true, defaultPanelValue: { a: 1 } });
    panel.value = [{ a: 1 }, { a: 2 }, {}];
    expect([0, 1, 2].map(i => panel.isRequireConfirmOnDelete(i)), "#1").toEqual([false, true, false]);
    expect(panel.isRequireConfirmOnDelete(panel.panels[1]), "#2: a panel names itself").toBe(true);
    panel.confirmDelete = false;
    expect(panel.isRequireConfirmOnDelete(1), "#3: confirmDelete is off").toBe(false);
  });
  test("without a default record every record that is not empty asks", () => {
    const matrix = createMatrix({ rowCount: 2, confirmDelete: true });
    matrix.value = [{ a: 1 }, {}];
    expect([0, 1].map(i => matrix.isRequireConfirmOnRowDelete(i)), "#1: matrix").toEqual([true, false]);
    const panel = createPanel({ panelCount: 2, confirmDelete: true });
    panel.value = [{ a: 1 }, {}];
    expect([0, 1].map(i => panel.isRequireConfirmOnDelete(i)), "#2: panel").toEqual([true, false]);
  });
});
