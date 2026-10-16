import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import "../src/question_text";
import "../src/question_dropdown";

function createSurvey(elements: Array<any>): SurveyModel {
  return new SurveyModel({ elements: elements });
}
function getRowActionIds(matrix: QuestionMatrixDynamicModel | QuestionMatrixDropdownModel): Array<Array<string>> {
  return matrix.renderedTable.rows.filter(row => !!row.row && !row.isDetailRow && !row.isErrorsRow).map(row =>
    row.cells.filter(cell => cell.isActionsCell).reduce((res: Array<string>, cell) => res.concat(cell.item.value.actions.map(action => action.id)), []));
}

describe("Matrix: columnsVisibleIf", () => {
  test("a Dynamic Matrix keeps a column that columnsVisibleIf rejects; a Multi-Select Matrix in the same survey hides it", () => {
    const survey = createSurvey([
      { type: "matrixdynamic", name: "dynamic", rowCount: 1, columnsVisibleIf: "false", columns: [{ name: "c1", cellType: "text" }] },
      { type: "matrixdropdown", name: "dropdown", rows: ["r1"], columnsVisibleIf: "false", columns: [{ name: "c1", cellType: "text" }] }
    ]);
    const dynamic = <QuestionMatrixDynamicModel>survey.getQuestionByName("dynamic");
    const dropdown = <QuestionMatrixDropdownModel>survey.getQuestionByName("dropdown");
    dynamic.visibleRows;
    dropdown.visibleRows;
    expect(dynamic.columns[0].isColumnVisible, "#1: dynamic").toBe(true);
    expect(dynamic.visibleColumns.length, "#1: dynamic, visibleColumns").toBe(1);
    expect(dropdown.columns[0].isColumnVisible, "#2: dropdown").toBe(false);
    expect(dropdown.visibleColumns.length, "#2: dropdown, visibleColumns").toBe(0);
    survey.setValue("x", 1);
    expect(dynamic.columns[0].isColumnVisible, "#3: dynamic, after a value change").toBe(true);
    expect(dropdown.columns[0].isColumnVisible, "#3: dropdown, after a value change").toBe(false);
  });
  test("a Multi-Select Matrix shows a column again when columnsVisibleIf accepts it", () => {
    const survey = createSurvey([
      { type: "text", name: "q1" },
      { type: "matrixdropdown", name: "m", rows: ["r1"], columnsVisibleIf: "{q1} = 1", columns: [{ name: "c1", cellType: "text" }] }
    ]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.renderedTable;
    expect(matrix.columns[0].isColumnVisible, "#1").toBe(false);
    survey.setValue("q1", 1);
    expect(matrix.columns[0].isColumnVisible, "#2").toBe(true);
    expect(matrix.renderedTable.headerRow.cells.filter(cell => !!cell.column).length, "#3: the table shows it").toBe(1);
  });
});

describe("Matrix: the children whose expressions are validated", () => {
  const sort = (res: Array<any>): Array<string> => res.map(e => e.obj.getType() + ":" + e.propertyName).sort();
  test("a Multi-Select Matrix validates its rows, columns, choices and detail elements", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m",
      rows: [{ value: "r1", visibleIf: "unknownRowFunc() = 1" }],
      columns: [{ name: "c1", visibleIf: "unknownColumnFunc() = 1" }],
      choices: [{ value: 1, enableIf: "unknownChoiceFunc() = 1" }],
      detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "d1", visibleIf: "unknownDetailFunc() = 1" }] }]);
    expect(sort(survey.validateExpressions({ functions: true, variables: true, semantics: true })))
      .toEqual(["itemvalue:enableIf", "itemvalue:visibleIf", "matrixdropdowncolumn:visibleIf", "text:visibleIf"]);
  });
  test("a Dynamic Matrix validates its columns, choices and detail elements", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 1,
      columns: [{ name: "c1", visibleIf: "unknownColumnFunc() = 1" }],
      choices: [{ value: 1, enableIf: "unknownChoiceFunc() = 1" }],
      detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "d1", visibleIf: "unknownDetailFunc() = 1" }] }]);
    expect(sort(survey.validateExpressions({ functions: true, variables: true, semantics: true })))
      .toEqual(["itemvalue:enableIf", "matrixdropdowncolumn:visibleIf", "text:visibleIf"]);
  });
});

describe("Matrix: the default row actions", () => {
  const detailElements = [{ type: "text", name: "d1" }];
  test("a Dynamic Matrix row has the drag handle, the remove button and the detail button, in this order", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, allowRowReorder: true,
      detailPanelMode: "underRow", detailElements: detailElements, columns: [{ name: "c1", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    // The start cell holds the drag handle and the detail button, the end cell the remove button.
    expect(getRowActionIds(matrix)).toEqual([["drag-drop", "show-detail", "remove-row"], ["drag-drop", "show-detail", "remove-row"]]);
  });
  test("a Dynamic Matrix creates the row actions in the order drag handle, remove button, detail button", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 1, allowRowReorder: true,
      detailPanelMode: "underRow", detailElements: detailElements, columns: [{ name: "c1", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const table = matrix.renderedTable;
    const actions: Array<any> = [];
    table["setDefaultRowActions"](matrix.visibleRows[0], actions);
    expect(actions.map(action => action.id)).toEqual(["drag-drop", "remove-row", "show-detail"]);
    actions.forEach(action => action.dispose());
  });
  test("a Dynamic Matrix has no drag handle on a locked row and no remove button when rows cannot be removed", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 3, allowRowReorder: true,
      columns: [{ name: "c1", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.lockedRowCount = 1;
    const create = (index: number): Array<string> => {
      const actions: Array<any> = [];
      matrix.renderedTable["setDefaultRowActions"](matrix.visibleRows[index], actions);
      const res = actions.map(action => action.id);
      actions.forEach(action => action.dispose());
      return res;
    };
    expect([create(0), create(1), create(2)], "#1").toEqual([[], ["drag-drop", "remove-row"], ["drag-drop", "remove-row"]]);
    matrix.allowRemoveRows = false;
    matrix.allowRowReorder = false;
    expect([create(0), create(1)], "#2").toEqual([[], []]);
  });
  test("a Multi-Select Matrix row has only the detail button", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["r1", "r2"],
      detailPanelMode: "underRow", detailElements: detailElements, columns: [{ name: "c1", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const actions: Array<any> = [];
    matrix.renderedTable["setDefaultRowActions"](matrix.visibleRows[0], actions);
    expect(actions.map(action => action.id), "#1").toEqual(["show-detail"]);
    actions.forEach(action => action.dispose());
    expect(matrix.renderedTable.isRowsDragAndDrop, "#2: no row drag").toBeFalsy();
  });
});
