import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownRenderedTable } from "../../src/question_matrixdropdownrendered";
import { MatrixDropdownRowModelBase } from "../../src/question_matrixdropdownbase";

/* An add under in-memory paging: a record that lands at the end of the page shown, with nothing moved
   between pages, gets its row appended to the page's rows and to its rendered table, as without
   paging. Any other add rebuilds the page. A rebuild while the rendered table is locked (Survey
   Creator's lockResetRenderedTable around an add) resets the table when the lock is released.
   A value assignment that changes the row count resets an unlocked table on its own (the rowCount
   property), with paging and without: Survey Creator takes the lock for that reason. */

function createRecords(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) res.push({ a: i });
  return res;
}
function createMatrix(json: any, count: number): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
    columns: [{ name: "a", cellType: "text" }] }, json)] });
  survey.data = { m: createRecords(count) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
function dataRows(table: QuestionMatrixDropdownRenderedTable): Array<MatrixDropdownRowModelBase> {
  return table.rows.filter(r => !r.isDetailRow && !r.isErrorsRow && !!r.row).map(r => r.row);
}
function cellValues(rows: Array<MatrixDropdownRowModelBase>): Array<any> {
  return rows.map(r => r.getQuestionByName("a").value);
}
const originalOnAddedRow = QuestionMatrixDropdownRenderedTable.prototype.onAddedRow;
interface ITracker { resets: number, added: Array<MatrixDropdownRowModelBase>, rowsAdded: number }
// What reaches the rendered table from here on: resets, onAddedRow calls, onMatrixRowAdded.
function startTracking(matrix: QuestionMatrixDynamicModel): ITracker {
  const res: ITracker = { resets: 0, added: [], rowsAdded: 0 };
  vi.spyOn(QuestionMatrixDropdownRenderedTable.prototype, "onAddedRow").mockImplementation(
    function (this: QuestionMatrixDropdownRenderedTable, row: MatrixDropdownRowModelBase, index: number): void {
      res.added.push(row);
      originalOnAddedRow.call(this, row, index);
    });
  matrix.onRenderedTableResetCallback = () => { res.resets++; };
  (matrix.survey as SurveyModel).onMatrixRowAdded.add(() => { res.rowsAdded++; });
  return res;
}
// A page shown with its rendered table built: the state the renderer leaves.
function showPage(matrix: QuestionMatrixDynamicModel, pageIndex: number): { table: QuestionMatrixDropdownRenderedTable, rows: Array<MatrixDropdownRowModelBase> } {
  matrix.pageIndex = pageIndex;
  const table = matrix.renderedTable;
  return { table: table, rows: [].concat(matrix.visibleRows) };
}
function lock(matrix: QuestionMatrixDynamicModel, val: boolean): void {
  matrix["lockResetRenderedTable"] = val;
}
// A row has no isDisposed of its own: its cell questions are disposed with it.
function isRowDisposed(row: MatrixDropdownRowModelBase): boolean {
  return row.cells[0].question.isDisposed;
}
function isSameRows(rows: Array<MatrixDropdownRowModelBase>, expected: Array<MatrixDropdownRowModelBase>): boolean {
  return rows.length === expected.length && rows.every((r, i) => r === expected[i]);
}

afterEach(() => { vi.restoreAllMocks(); });

describe("an add on the page shown, under paging", () => {
  test("B.1 an append on the last page with room, by value: the rows stay and the new row is appended", () => {
    const matrix = createMatrix({ pageSize: 10 }, 25);
    const { rows } = showPage(matrix, 2);
    const t = startTracking(matrix);
    matrix.value = [].concat(matrix.value, [{ a: 25 }]);
    expect([matrix.pageIndex, matrix.pageCount], "#1: the page stays").toEqual([2, 3]);
    expect(isSameRows(matrix.visibleRows.slice(0, 5), rows), "#2: the rows of the page stay").toBe(true);
    expect(cellValues(matrix.visibleRows), "#3").toEqual([20, 21, 22, 23, 24, 25]);
    // The rowCount change resets an unlocked table first, as without paging (B.8); the new table has the row.
    expect([t.resets, t.added.length], "#4: one reset, by the rowCount change").toEqual([1, 0]);
    const rendered = dataRows(matrix.renderedTable);
    expect(isSameRows(rendered, matrix.visibleRows), "#5: the new table shows the page's rows").toBe(true);
  });
  test("B.2 an append on the last page with room, through addRowUI, adds the row to the page's table", () => {
    const matrix = createMatrix({ pageSize: 10 }, 25);
    const { table, rows } = showPage(matrix, 2);
    const t = startTracking(matrix);
    matrix.addRowUI();
    expect([matrix.rowCount, matrix.pageIndex, matrix.pageCount], "#1: the page stays").toEqual([26, 2, 3]);
    expect(matrix.renderedTable === table, "#2: the same table").toBe(true);
    expect([t.added.length, t.resets, t.rowsAdded], "#3: onAddedRow once, no reset, one row added").toEqual([1, 0, 1]);
    expect(isSameRows(matrix.visibleRows.slice(0, 5), rows), "#4: the rows of the page stay").toBe(true);
    const rendered = dataRows(matrix.renderedTable);
    expect(isSameRows(rendered, matrix.visibleRows), "#5: the table shows the page's rows").toBe(true);
    expect(rendered[5] === t.added[0], "#6: the new row is the last rendered data row").toBe(true);
  });
  test("B.3 an append while page 1 is shown: by value the rows stay; addRowUI moves to the last page and rebuilds", () => {
    const matrix = createMatrix({ pageSize: 10 }, 25);
    const { rows } = showPage(matrix, 0);
    const t = startTracking(matrix);
    matrix.value = [].concat(matrix.value, [{ a: 25 }]);
    expect([matrix.pageIndex, matrix.pageCount], "#1: by value the page stays").toEqual([0, 3]);
    expect(isSameRows(matrix.visibleRows, rows), "#2: the rows stay").toBe(true);
    expect([t.added.length, t.resets], "#3: the rowCount change resets the table").toEqual([0, 1]);
    const table = matrix.renderedTable;
    matrix.addRowUI();
    expect([matrix.rowCount, matrix.pageIndex, matrix.pageCount], "#4: addRowUI moves to the new row's page").toEqual([27, 2, 3]);
    expect(matrix.renderedTable !== table, "#5: the page is rebuilt").toBe(true);
    expect([t.added.length, t.resets], "#6: no incremental add").toEqual([0, 2]);
    expect(cellValues(dataRows(matrix.renderedTable)).slice(0, 6), "#7").toEqual([20, 21, 22, 23, 24, 25]);
    expect(dataRows(matrix.renderedTable).length, "#8").toBe(7);
  });
  test("B.4 an append when the last page is full starts a new page and rebuilds", () => {
    const matrix = createMatrix({ pageSize: 10 }, 30);
    const { table } = showPage(matrix, 2);
    const t = startTracking(matrix);
    matrix.addRowUI();
    expect([matrix.rowCount, matrix.pageIndex, matrix.pageCount], "#1").toEqual([31, 3, 4]);
    expect(matrix.renderedTable !== table, "#2: rebuilt").toBe(true);
    expect([t.added.length, t.resets], "#3: no incremental add").toEqual([0, 1]);
    expect(dataRows(matrix.renderedTable).length, "#4").toBe(1);
    const matrix2 = createMatrix({ pageSize: 10 }, 30);
    const shown = showPage(matrix2, 2);
    const t2 = startTracking(matrix2);
    matrix2.value = [].concat(matrix2.value, [{ a: 30 }]);
    expect([matrix2.pageIndex, matrix2.pageCount], "#5: by value, the page stays").toEqual([2, 4]);
    expect(isSameRows(matrix2.visibleRows, shown.rows), "#6: the rows stay").toBe(true);
    expect([t2.added.length, t2.resets], "#7: the rowCount change resets the table").toEqual([0, 1]);
  });
});

describe("an add under the external lock (Survey Creator's lockResetRenderedTable)", () => {
  test("B.5 a page rebuilt under the lock, by value, gets a new table when the lock is released", () => {
    const matrix = createMatrix({ pageSize: 10 }, 30);
    const { table, rows } = showPage(matrix, 0);
    // A record the respondent touched keeps its place across an assignment: the rows are renumbered,
    // and page 1 - which now starts with the new record - is rebuilt.
    matrix.visibleRows[0].getQuestionByName("a").value = 50;
    const t = startTracking(matrix);
    lock(matrix, true);
    matrix.value = [{ a: 100 }].concat(matrix.value);
    expect(matrix.visibleRows.indexOf(rows[0]), "#1: the page was rebuilt under the lock").toBe(-1);
    lock(matrix, false);
    expect([matrix.pageIndex, matrix.pageCount], "#2").toEqual([0, 4]);
    expect(matrix.renderedTable !== table, "#3: a new table").toBe(true);
    expect([t.resets, t.added.length], "#4: reset once").toEqual([1, 0]);
    const rendered = dataRows(matrix.renderedTable);
    expect(isSameRows(rendered, matrix.visibleRows), "#5: the page's current rows").toBe(true);
    expect(cellValues(rendered), "#6").toEqual([100, 50, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(rendered.some(r => isRowDisposed(r)), "#7: none is disposed").toBe(false);
  });
  test("B.6 a page move under the lock, through addRowUI: addRow releases the lock itself", () => {
    const matrix = createMatrix({ pageSize: 10 }, 30);
    showPage(matrix, 2);
    lock(matrix, true);
    matrix.addRowUI();
    expect([matrix.pageIndex, matrix.pageCount], "#1").toEqual([3, 4]);
    expect(matrix["lockResetRenderedTable"], "#2: addRow released the lock").toBe(false);
    const rendered = dataRows(matrix.renderedTable);
    expect(rendered.length, "#3").toBe(1);
    expect(rendered[0] === matrix.visibleRows[0] && !isRowDisposed(rendered[0]), "#4: the new row").toBe(true);
    lock(matrix, false);
  });
  const layouts = [
    { name: "(a) the last of 3 pages", pageSize: 10, count: 25, pageIndex: 2 },
    { name: "(b) one page", pageSize: 25, count: 5, pageIndex: 0 }];
  layouts.forEach(layout => {
    test("B.7 the incremental add survives the lock: " + layout.name, () => {
      const matrix = createMatrix({ pageSize: layout.pageSize }, layout.count);
      const { table, rows } = showPage(matrix, layout.pageIndex);
      const t = startTracking(matrix);
      lock(matrix, true);
      matrix.value = [].concat(matrix.value, [{ a: 1000 }]);
      lock(matrix, false);
      expect(matrix.pageIndex, "#1").toBe(layout.pageIndex);
      expect(matrix.renderedTable === table, "#2: the same table").toBe(true);
      expect([t.added.length, t.resets], "#3: onAddedRow once, no reset").toEqual([1, 0]);
      const rendered = dataRows(matrix.renderedTable);
      const visibleRows = matrix.visibleRows;
      expect(isSameRows(visibleRows.slice(0, rows.length), rows), "#4: the rows stay").toBe(true);
      expect(isSameRows(rendered, visibleRows), "#5: the new row is the last rendered data row").toBe(true);
      expect(t.added[0] === visibleRows[visibleRows.length - 1], "#6").toBe(true);
      expect(visibleRows[visibleRows.length - 1].getQuestionByName("a").value, "#7").toBe(1000);
    });
  });
});

describe("an add without paging, and with a sort or a filter in force", () => {
  [false, true].forEach(isLocked => {
    test("B.8 without paging, by value and through addRowUI" + (isLocked ? ", locked" : ""), () => {
      const matrix = createMatrix({}, 5);
      const table = matrix.renderedTable;
      const t = startTracking(matrix);
      if (isLocked) lock(matrix, true);
      matrix.value = [].concat(matrix.value, [{ a: 5 }]);
      if (isLocked) lock(matrix, false);
      // Without the lock the rowCount change resets the table before the row is added.
      expect(matrix.renderedTable === table, "#1: by value").toBe(isLocked);
      expect([t.added.length, t.resets], "#2").toEqual(isLocked ? [1, 0] : [0, 1]);
      const shown = matrix.renderedTable;
      if (isLocked) lock(matrix, true);
      matrix.addRowUI();
      if (isLocked) lock(matrix, false);
      expect(matrix.renderedTable === shown, "#3: addRowUI, the same table").toBe(true);
      expect([t.added.length, t.resets], "#4").toEqual(isLocked ? [2, 0] : [1, 1]);
      expect(isSameRows(dataRows(shown), matrix.visibleRows), "#5").toBe(true);
      expect(matrix.visibleRows.length, "#6").toBe(7);
    });
  });
  test("B.9 a sort in force: an add rebuilds the page", () => {
    const matrix = createMatrix({ pageSize: 10 }, 25);
    matrix.sortCriteria = [{ field: "a", direction: "asc" }];
    const { table } = showPage(matrix, 2);
    const t = startTracking(matrix);
    matrix.value = [].concat(matrix.value, [{ a: 25 }]);
    expect(t.added.length, "#1: by value, no incremental add").toBe(0);
    expect(matrix.renderedTable !== table, "#2: rebuilt").toBe(true);
    expect(cellValues(dataRows(matrix.renderedTable)), "#3").toEqual([20, 21, 22, 23, 24, 25]);
    const next = matrix.renderedTable;
    matrix.addRowUI();
    expect(t.added.length, "#4: addRowUI, no incremental add").toBe(0);
    expect(matrix.renderedTable !== next, "#5: rebuilt").toBe(true);
  });
  test("B.9 a filter in force: an add rebuilds the page", () => {
    const matrix = createMatrix({ pageSize: 10, filterExpression: "{a} >= 0" }, 25);
    const { table } = showPage(matrix, 2);
    const t = startTracking(matrix);
    matrix.value = [].concat(matrix.value, [{ a: 25 }]);
    expect(t.added.length, "#1: by value, no incremental add").toBe(0);
    expect(matrix.renderedTable !== table, "#2: rebuilt").toBe(true);
    expect(cellValues(dataRows(matrix.renderedTable)), "#3").toEqual([20, 21, 22, 23, 24, 25]);
    const next = matrix.renderedTable;
    matrix.addRowUI();
    expect(t.added.length, "#4: addRowUI, no incremental add").toBe(0);
    expect(matrix.renderedTable !== next, "#5: rebuilt").toBe(true);
  });
});
