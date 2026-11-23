import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { Base, PropertyAccessTracker } from "../src/base";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionMatrixDropdownRenderedCell, QuestionMatrixDropdownRenderedRow } from "../src/question_matrixdropdownrendered";
import { UpdateMatrixRowCssEvent } from "../src/survey-events-api";
import { FakeServerSource, createMatrix as createRemoteMatrix, flush, serverRecords } from "./dynamic-data/remote-source-integration-helpers";

/* onUpdateMatrixCellCss / onUpdateMatrixRowCss: the classes of a matrix data cell's <td> and a data row's
   <tr>, computed from the row's record when the table is built and again when the record changes. */

function createSurvey(json: any, data?: any): SurveyModel {
  const survey = new SurveyModel({ elements: [Object.assign({ name: "m" }, json)] });
  if (data !== undefined) survey.data = { m: JSON.parse(JSON.stringify(data)) };
  return survey;
}
function matrixOf(survey: SurveyModel): QuestionMatrixDynamicModel {
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
// The full stored record of a row, fields without a column too: no new API needed.
function recordOf(options: UpdateMatrixRowCssEvent): any {
  return (options.question.value || [])[options.row.getIndex()] || {};
}
// A status cell is "failed" when its record says so; a row is "draft" by a field without a column.
function addStatusHandler(survey: SurveyModel, log?: Array<string>): void {
  survey.onUpdateMatrixCellCss.add((_, options) => {
    const record = recordOf(options);
    if (!!log) log.push(options.column.name + ":" + record.id);
    if (options.column.name === "status" && record.status === "failed") options.css += " failed";
  });
  survey.onUpdateMatrixRowCss.add((_, options) => {
    const record = recordOf(options);
    if (!!log) log.push("row:" + record.id);
    if (record.draft) options.css += " draft";
  });
}
function dataRows(matrix: QuestionMatrixDropdownModelBase): Array<QuestionMatrixDropdownRenderedRow> {
  return matrix.renderedTable.rows.filter((row: QuestionMatrixDropdownRenderedRow) => !!row.row && !row.isErrorsRow && !row.isDetailRow);
}
function cellOf(row: QuestionMatrixDropdownRenderedRow, columnName: string): QuestionMatrixDropdownRenderedCell {
  return row.cells.filter((cell: QuestionMatrixDropdownRenderedCell) => cell.hasQuestion && cell.column?.name === columnName)[0];
}
function hasClass(className: string, name: string): boolean {
  return (className || "").split(" ").indexOf(name) > -1;
}
function statusFailed(matrix: QuestionMatrixDropdownModelBase): Array<boolean> {
  return dataRows(matrix).map((row: QuestionMatrixDropdownRenderedRow) => hasClass(cellOf(row, "status").className, "failed"));
}
function rowsDraft(matrix: QuestionMatrixDropdownModelBase): Array<boolean> {
  return dataRows(matrix).map((row: QuestionMatrixDropdownRenderedRow) => hasClass(row.className, "draft"));
}
const columns = [{ name: "id", cellType: "text" }, { name: "status", cellType: "text" }];
const records = [
  { id: 1, status: "ok" },
  { id: 2, status: "failed", draft: true },
  { id: 3, status: "failed" },
  { id: 4, status: "ok", draft: true },
  { id: 5, status: "ok" }
];

describe("onUpdateMatrixCellCss / onUpdateMatrixRowCss", () => {
  test("a cell takes a class by its record's value, a row by a field without a column", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records);
    addStatusHandler(survey);
    const matrix = matrixOf(survey);
    expect(statusFailed(matrix), "#1: status cells").toEqual([false, true, true, false, false]);
    expect(rowsDraft(matrix), "#2: rows by the column-less draft flag").toEqual([false, true, false, true, false]);
    expect(hasClass(cellOf(dataRows(matrix)[1], "id").className, "failed"), "#3: the other cell of the row").toBe(false);
  });
  test("the cell handler gets the matrix, the row, the column and the cell question; the row handler the matrix and the row", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 1));
    const cellCalls: Array<any> = [];
    const rowCalls: Array<any> = [];
    survey.onUpdateMatrixCellCss.add((_, options) => {
      cellCalls.push({ question: options.question, row: options.row, column: options.column.name,
        cellQuestion: options.cellQuestion, css: options.css });
    });
    survey.onUpdateMatrixRowCss.add((_, options) => {
      rowCalls.push({ question: options.question, row: options.row, css: options.css, keys: Object.keys(options).sort() });
    });
    const matrix = matrixOf(survey);
    const renderedRow = dataRows(matrix)[0];
    const row = matrix.visibleRows[0];
    expect(cellCalls.length, "#1: two cells").toBe(2);
    expect(cellCalls.every((call) => call.question === matrix && call.row === row), "#2").toBe(true);
    expect(cellCalls.map((call) => call.column), "#3").toEqual(["id", "status"]);
    expect(cellCalls[0].cellQuestion, "#4").toBe(row.getQuestionByColumnName("id"));
    expect(cellCalls[0].css, "#5: the cell's default classes").toBe(cellOf(renderedRow, "id").defaultClassName);
    expect(rowCalls.length, "#6: the row").toBe(1);
    expect(rowCalls[0].question === matrix && rowCalls[0].row === row, "#7").toBe(true);
    expect(rowCalls[0].css, "#8: the row's default classes").toBe(renderedRow.defaultCss);
    expect(rowCalls[0].keys, "#9: no cell options for a row").toEqual(["css", "question", "row"]);
  });
  test("each event alone: a cell handler leaves the rows alone, a row handler the cells", () => {
    const plain = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 2));
    const cellOnly = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 2));
    cellOnly.onUpdateMatrixCellCss.add((_, options) => { options.css += " cell-custom"; });
    const rowOnly = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 2));
    rowOnly.onUpdateMatrixRowCss.add((_, options) => { options.css += " row-custom"; });
    const rowClasses = (survey: SurveyModel): Array<string> => dataRows(matrixOf(survey)).map((row) => row.className);
    const cellClasses = (survey: SurveyModel): Array<string> => dataRows(matrixOf(survey)).map((row) => cellOf(row, "status").className);
    expect(cellClasses(cellOnly).every((css) => hasClass(css, "cell-custom")), "#1: cells").toBe(true);
    expect(rowClasses(cellOnly), "#2: rows as without a handler").toEqual(rowClasses(plain));
    expect(rowClasses(rowOnly).every((css) => hasClass(css, "row-custom")), "#3: rows").toBe(true);
    expect(cellClasses(rowOnly), "#4: cells as without a handler").toEqual(cellClasses(plain));
  });
  test("the classes follow a value assignment and an edit", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 3));
    addStatusHandler(survey);
    const matrix = matrixOf(survey);
    const table = matrix.renderedTable;
    const data = JSON.parse(JSON.stringify(records.slice(0, 3)));
    data[0].status = "failed";
    data[1].status = "ok";
    data[1].draft = false;
    data[2].draft = true;
    matrix.value = data;
    expect(matrix.renderedTable, "#1: the table is kept").toBe(table);
    expect(statusFailed(matrix), "#2").toEqual([true, false, true]);
    expect(rowsDraft(matrix), "#3").toEqual([false, false, true]);
    matrix.visibleRows[2].getQuestionByColumnName("status").value = "ok";
    expect(statusFailed(matrix), "#4: an edit").toEqual([true, false, false]);
    expect(matrix.renderedTable, "#5").toBe(table);
  });
  test("a re-run notifies the renderers that read the cell's and the row's className", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 2));
    addStatusHandler(survey);
    const matrix = matrixOf(survey);
    const renderedRow = dataRows(matrix)[0];
    const cell = cellOf(renderedRow, "status");
    const log: Array<{ model: Base, name: string }> = [];
    const tracker = new PropertyAccessTracker((model: Base, options: any) => { log.push({ model: model, name: options.name }); });
    tracker.startTracking();
    try {
      cell.className;
      renderedRow.className;
    } finally {
      tracker.stopTracking();
    }
    // A renderer commits its render: the tracker follows what it read.
    tracker.subscribe();
    const data = JSON.parse(JSON.stringify(matrix.value));
    data[0].status = "failed";
    data[0].draft = true;
    matrix.value = data;
    expect(log.some((item) => item.model === renderedRow && item.name === cell.cssKey), "#1: the cell").toBe(true);
    expect(log.some((item) => item.model === renderedRow && item.name === "rowCss"), "#2: the row").toBe(true);
    tracker.unsubscribe();
  });
  test("local paging and a sort: the rows of the new view are styled by their records", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, pageSize: 2, allowSort: true, columns: columns }, records);
    addStatusHandler(survey);
    const matrix = matrixOf(survey);
    expect(statusFailed(matrix), "#1: page 1").toEqual([false, true]);
    matrix.nextPage();
    expect(statusFailed(matrix), "#2: page 2").toEqual([true, false]);
    expect(rowsDraft(matrix), "#3: page 2").toEqual([false, true]);
    matrix.sort([{ field: "id", direction: "desc" }]);
    matrix.pageIndex = 0;
    expect(dataRows(matrix).map((row) => row.row.getQuestionByColumnName("id").value), "#4").toEqual([5, 4]);
    expect(rowsDraft(matrix), "#5: sorted").toEqual([false, true]);
    expect(statusFailed(matrix), "#6: sorted").toEqual([false, false]);
  });
  test("a paging dataSource: the window of a new read is styled by its records", async () => {
    const source = new FakeServerSource(serverRecords(12).map((record: any) => Object.assign(record, { status: record.id % 3 === 0 ? "failed" : "ok" })));
    const res = await createRemoteMatrix(source);
    const log: Array<string> = [];
    res.survey.onUpdateMatrixCellCss.add((_, options) => {
      if (options.column.name === "col1" && recordOf(options).status === "failed") options.css += " failed";
    });
    res.survey.onUpdateMatrixRowCss.add((_, options) => { log.push(recordOf(options).id); });
    const matrix = res.question;
    const failed = (): Array<boolean> => dataRows(matrix).map((row) => hasClass(cellOf(row, "col1").className, "failed"));
    expect(failed(), "#1: ids 0..4").toEqual([true, false, false, true, false]);
    matrix.nextPage();
    await flush();
    expect(failed(), "#2: ids 5..9").toEqual([false, true, false, false, true]);
    expect(log.slice(-5), "#3: the rows read the new window's records").toEqual([5, 6, 7, 8, 9]);
  });
  test("header, footer, error, actions and detail cells and the detail row take no classes", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, allowRemoveRows: true, minRowCount: 0,
      detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note" }],
      columns: [{ name: "id", cellType: "text", totalType: "sum" }, { name: "status", cellType: "text" }] }, records.slice(0, 2));
    survey.onUpdateMatrixCellCss.add((_, options) => { options.css += " custom"; });
    survey.onUpdateMatrixRowCss.add((_, options) => { options.css += " custom"; });
    const matrix = matrixOf(survey);
    matrix.visibleRows[0].showDetailPanel();
    const table = matrix.renderedTable;
    const all = (rows: Array<QuestionMatrixDropdownRenderedRow>): Array<QuestionMatrixDropdownRenderedCell> =>
      [].concat(...rows.map((row) => row.cells));
    expect(table.headerRow.cells.some((cell) => hasClass(cell.className, "custom")), "#1: header").toBe(false);
    expect(table.footerRow.cells.some((cell) => hasClass(cell.className, "custom")), "#2: footer (totals)").toBe(false);
    expect(all(table.rows.filter((row) => row.isErrorsRow)).some((cell) => hasClass(cell.className, "custom")), "#3: error cells").toBe(false);
    const detailRow = table.rows.filter((row) => row.isDetailRow)[0];
    expect(!!detailRow, "#4: the detail row is shown").toBe(true);
    expect(hasClass(detailRow.className, "custom"), "#5: the detail row").toBe(false);
    expect(detailRow.cells.some((cell) => hasClass(cell.className, "custom")), "#6: detail cells").toBe(false);
    const row = dataRows(matrix)[0];
    expect(row.cells.filter((cell) => cell.isActionsCell).length > 0, "#7: the row has action cells").toBe(true);
    expect(row.cells.filter((cell) => !cell.hasQuestion).some((cell) => hasClass(cell.className, "custom")), "#8: action and empty cells").toBe(false);
    expect(hasClass(cellOf(row, "id").className, "custom"), "#9: a data cell").toBe(true);
    expect(hasClass(row.className, "custom"), "#10: the data row").toBe(true);
    expect(hasClass(row.className, matrix.cssClasses.expandedRow), "#11: the row keeps its state classes").toBe(true);
  });
  test("a choice cell of a showInMultipleColumns column keeps the handler's class", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0,
      columns: [{ name: "id", cellType: "text" }, { name: "c", cellType: "checkbox", choices: [1, 2], showInMultipleColumns: true }] },
    [{ id: 1, c: [2] }]);
    survey.onUpdateMatrixCellCss.add((_, options) => {
      if (options.column.name === "c" && (recordOf(options).c || []).indexOf(2) > -1) options.css += " picked";
    });
    const choiceCells = dataRows(matrixOf(survey))[0].cells.filter((cell) => cell.isChoice && cell.hasQuestion);
    expect(choiceCells.length, "#1").toBe(2);
    expect(choiceCells.map((cell) => hasClass(cell.className, "picked")), "#2").toEqual([true, true]);
    expect(choiceCells.every((cell) => hasClass(cell.className, survey.css.matrixdynamic.itemCell)), "#3: the item cell classes stay").toBe(true);
  });
  test("a matrixdropdown: the record by the row name", () => {
    const survey = createSurvey({ type: "matrixdropdown", rows: ["a", "b"], columns: columns }, { b: { status: "failed", draft: true } });
    const recordByName = (options: UpdateMatrixRowCssEvent): any => ((<QuestionMatrixDropdownModel>options.question).value || {})[options.row.rowName] || {};
    survey.onUpdateMatrixCellCss.add((_, options) => {
      if (options.column.name === "status" && recordByName(options).status === "failed") options.css += " failed";
    });
    survey.onUpdateMatrixRowCss.add((_, options) => {
      if (recordByName(options).draft) options.css += " draft";
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    expect(statusFailed(matrix), "#1").toEqual([false, true]);
    expect(rowsDraft(matrix), "#2").toEqual([false, true]);
    matrix.value = { a: { status: "failed" } };
    expect(statusFailed(matrix), "#3: an assignment").toEqual([true, false]);
    expect(rowsDraft(matrix), "#4").toEqual([false, false]);
  });
  test("the vertical layout: the data cells take classes, its rows (columns) take none", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, transposeData: true, columns: columns }, records.slice(0, 2));
    let rowCalls = 0;
    survey.onUpdateMatrixRowCss.add((_, options) => { rowCalls++; options.css += " row-css"; });
    survey.onUpdateMatrixCellCss.add((_, options) => {
      if (recordOf(options).status === "failed") options.css += " failed";
    });
    const matrix = matrixOf(survey);
    const statusRow = matrix.renderedTable.rows.filter((row) => !row.isErrorsRow && row.cells.some((cell) => cell.column?.name === "status" && cell.hasQuestion))[0];
    const cells = statusRow.cells.filter((cell) => cell.hasQuestion);
    expect(cells.map((cell) => hasClass(cell.className, "failed")), "#1").toEqual([false, true]);
    expect(matrix.renderedTable.rows.some((row) => hasClass(row.className, "row-css")), "#2").toBe(false);
    expect(rowCalls, "#3: onUpdateMatrixRowCss is not raised").toBe(0);
  });
  test("pinning: without a handler, or with one that changes nothing, every class string is the same", () => {
    const json = { type: "matrixdynamic", rowCount: 0, allowRemoveRows: true, detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "note" }], columns: [{ name: "id", cellType: "text", totalType: "sum" },
        { name: "c", cellType: "checkbox", choices: [1, 2], showInMultipleColumns: true }] };
    const classes = (survey: SurveyModel): Array<string> => {
      const table = matrixOf(survey).renderedTable;
      const rows = [table.headerRow, table.footerRow].concat(table.rows);
      return [].concat(...rows.map((row) => [row.className].concat(row.cells.map((cell) => cell.className))));
    };
    const plain = createSurvey(json, records.slice(0, 2));
    const handled = createSurvey(json, records.slice(0, 2));
    let calls = 0;
    let rowCalls = 0;
    handled.onUpdateMatrixCellCss.add(() => { calls++; });
    handled.onUpdateMatrixRowCss.add(() => { rowCalls++; });
    expect(classes(handled), "#1").toEqual(classes(plain));
    expect(calls > 0, "#2: the cell handler ran").toBe(true);
    expect(rowCalls > 0, "#3: the row handler ran").toBe(true);
  });
  test("pinning: onUpdateQuestionCssClasses for a cell question behaves as before", () => {
    const survey = createSurvey({ type: "matrixdynamic", rowCount: 0, columns: columns }, records.slice(0, 1));
    const names: Array<string> = [];
    survey.onUpdateQuestionCssClasses.add((_, options) => {
      names.push(options.question.name + "@" + options.question.parentQuestion?.name);
      options.cssClasses.root += " q-custom";
    });
    survey.onUpdateMatrixCellCss.add((_, options) => { options.css += " cell-custom"; });
    const matrix = matrixOf(survey);
    const cell = cellOf(dataRows(matrix)[0], "status");
    expect(names.indexOf("status@m") > -1, "#1: fired for the cell question").toBe(true);
    expect(hasClass(cell.question.cssClasses.root, "q-custom"), "#2: the editor's classes").toBe(true);
    expect(hasClass(cell.className, "q-custom"), "#3: not the cell's").toBe(false);
    expect(hasClass(cell.question.cssClasses.root, "cell-custom"), "#4: the cell event leaves the editor alone").toBe(false);
  });
});
