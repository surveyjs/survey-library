import { describe, test, expect } from "vitest";
import { MatrixRenderedTableHost } from "../src/matrix-rendered-table-host";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import "../src/question_text";

function createTable(): any {
  const table: any = { isDisposed: false, isRequireResetValue: false, log: [] };
  table.requireReset = () => { table.isRequireResetValue = true; table.log.push("requireReset"); };
  table.isRequireReset = () => table.isRequireResetValue;
  table.onAddedRow = (row: any, index: number) => table.log.push("added:" + row + ":" + index);
  table.onRemovedRow = (row: any) => table.log.push("removed:" + row);
  table.updateShowTable = () => table.log.push("updateShowTable");
  return table;
}
function createHost(): { host: MatrixRenderedTableHost, state: any } {
  const state: any = { stored: undefined, created: 0, reported: 0, disposed: [], resets: 0, cleared: 0, updateLocked: false, paging: false, rows: ["r1", "r2"] };
  const host = new MatrixRenderedTableHost({
    getStoredTable: () => state.stored,
    getTable: () => {
      if (!state.stored) { state.stored = createTable(); state.created++; }
      return state.stored;
    },
    removeStoredTable: () => { state.stored = undefined; },
    disposeTable: (table: any) => { table.isDisposed = true; state.disposed.push(table); },
    onTableCreated: () => { state.reported++; },
    onTableReset: () => { state.resets++; },
    clearRows: () => { state.cleared++; },
    isUpdateLocked: () => state.updateLocked,
    isPagingActive: () => state.paging,
    getVisibleRows: () => state.rows
  });
  return { host, state };
}

describe("MatrixRenderedTableHost", () => {
  test("a reset removes and disposes a created table; without one it does nothing", () => {
    const { host, state } = createHost();
    host.reset();
    expect([host.isCreated, state.created, state.resets], "#1: no table").toEqual([false, 0, 0]);
    const table = host.table;
    expect([host.isCreated, state.created], "#2: created on the first read").toEqual([true, 1]);
    host.reset();
    expect([host.isCreated, state.resets, state.disposed.length, table.isDisposed], "#3").toEqual([false, 1, 1, true]);
    expect(host.table !== table, "#4: a new table").toBe(true);
  });
  test("a locked reset keeps the table and, for a column visibility change, asks it to reset", () => {
    const { host, state } = createHost();
    const table = host.table;
    host.onStartRowAddingRemoving();
    host.reset();
    expect([host.isCreated, table.log], "#1").toEqual([true, []]);
    host.reset(true);
    expect([host.isCreated, table.log], "#2").toEqual([true, ["requireReset"]]);
    host.isResetLocked = false;
    state.updateLocked = true;
    host.reset();
    expect([host.isCreated, state.resets], "#3: an update lock").toEqual([true, 0]);
  });
  test("the end of a row add appends the last visible row, or resets a table that needs it or pages", () => {
    const { host, state } = createHost();
    host.onEndRowAdding();
    expect([host.isResetLocked, state.created], "#1: no table, nothing is created").toEqual([false, 0]);
    const table = host.table;
    host.onStartRowAddingRemoving();
    host.onEndRowAdding();
    expect([host.isResetLocked, table.log], "#2").toEqual([false, ["added:r2:1"]]);
    state.paging = true;
    host.onEndRowAdding();
    expect([host.isCreated, state.resets], "#3: paging").toEqual([false, 1]);
    state.paging = false;
    host.table.requireReset();
    host.onEndRowAdding();
    expect(state.resets, "#4: a table that needs a reset").toBe(2);
  });
  test("the end of a row remove takes the row out, or resets a table that needs it or pages", () => {
    const { host, state } = createHost();
    const table = host.table;
    host.onStartRowAddingRemoving();
    host.onEndRowRemoving(<any>"r1");
    host.onEndRowRemoving(null);
    expect([host.isResetLocked, table.log], "#1").toEqual([false, ["removed:r1"]]);
    state.paging = true;
    host.onEndRowRemoving(<any>"r2");
    expect([host.isCreated, state.resets], "#2").toEqual([false, 1]);
  });
  test("clearing the rows resets the table; updateShowTable reaches only a created table", () => {
    const { host, state } = createHost();
    host.updateShowTable();
    host.clearRowsAndReset();
    expect([state.created, state.cleared, state.resets], "#1").toEqual([0, 1, 0]);
    const table = host.table;
    host.updateShowTable();
    expect(table.log, "#2").toEqual(["updateShowTable"]);
    host.clearRowsAndReset();
    expect([state.cleared, state.resets, table.isDisposed], "#3").toEqual([2, 1, true]);
    host.dispose();
    const next = host.table;
    host.dispose();
    expect(next.isDisposed, "#4: dispose").toBe(true);
  });
  test("a matrix whose lockResetRenderedTable is set directly keeps its rendered table, as Survey Creator sets it", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const table = matrix.renderedTable;
    matrix["lockResetRenderedTable"] = true;
    matrix.resetRenderedTable();
    expect(matrix.renderedTable === table, "#1: locked").toBe(true);
    expect(matrix["lockResetRenderedTable"], "#2").toBe(true);
    matrix["lockResetRenderedTable"] = false;
    matrix.resetRenderedTable();
    expect(matrix.renderedTable !== table, "#3: unlocked").toBe(true);
  });
});

// A matrixdynamic of 30 records, 10 per page, and the counts the tests read: the reset and created
// callbacks, and onGetMatrixRowActions, which fires once per row whose actions a table build makes.
function createPagedMatrix(): { matrix: QuestionMatrixDynamicModel, counts: any } {
  const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 10, columns: [{ name: "id", cellType: "text" }] }] });
  const data: Array<any> = [];
  for (let i = 1; i <= 30; i++) data.push({ id: i });
  survey.data = { m: data };
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
  const counts: any = { resets: 0, created: 0, rowActions: 0, createdTables: [] };
  survey.onGetMatrixRowActions.add(() => { counts.rowActions++; });
  matrix.onRenderedTableResetCallback = () => { counts.resets++; };
  matrix.onRenderedTableCreatedCallback = (table: any) => { counts.created++; counts.createdTables.push(table); };
  return { matrix, counts };
}
function dataRows(table: any): Array<any> {
  return table.rows.filter((row: any) => !!row.row && !row.isDetailRow && !row.isErrorsRow);
}
function renderedIds(table: any): Array<number> {
  return dataRows(table).map((row: any) => row.row.getQuestionByName("id").value);
}
function idsFrom(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}

describe("The rendered table of a matrix that pages: one reset per page move, and a created callback", () => {
  test("a page move with a table built fires onRenderedTableResetCallback once", () => {
    const { matrix, counts } = createPagedMatrix();
    expect(renderedIds(matrix.renderedTable), "#1: page 1").toEqual(idsFrom(1, 10));
    counts.resets = 0;
    matrix.goToPage(1);
    expect(counts.resets, "#2: one reset").toBe(1);
  });
  test("a reset callback that reads renderedTable during a page move builds the new page once and keeps it", () => {
    const { matrix, counts } = createPagedMatrix();
    matrix.renderedTable;
    let readTable: any = undefined;
    counts.rowActions = 0;
    matrix.onRenderedTableResetCallback = () => { counts.resets++; readTable = matrix.renderedTable; };
    matrix.goToPage(1);
    expect(counts.resets, "#1: one reset callback").toBe(1);
    expect(counts.rowActions, "#2: one build of the page").toBe(10);
    expect(matrix.renderedTable === readTable, "#3: the table the callback built is kept").toBe(true);
    expect(renderedIds(readTable), "#4: rows 11-20").toEqual(idsFrom(11, 20));
  });
  test("created callback: the first read after a page move fires it once, with the new page's table", () => {
    const { matrix, counts } = createPagedMatrix();
    matrix.renderedTable;
    counts.created = 0;
    counts.createdTables = [];
    counts.rowActions = 0;
    matrix.goToPage(1);
    expect([counts.created, counts.rowActions], "#1: nothing is built by the page move").toEqual([0, 0]);
    const table = matrix.renderedTable;
    expect(counts.created, "#2: the first read").toBe(1);
    expect(counts.createdTables[0] === table, "#3: with the table that is read").toBe(true);
    expect(renderedIds(table), "#4: rows 11-20").toEqual(idsFrom(11, 20));
    expect(matrix.renderedTable === table, "#5").toBe(true);
    expect(counts.created, "#6: a second read fires nothing").toBe(1);
  });
  test("created callback: page moves without a table built in between fire once, for the page that is shown", () => {
    const { matrix, counts } = createPagedMatrix();
    matrix.goToPage(1);
    matrix.goToPage(2);
    expect([counts.created, counts.rowActions], "#1: nothing is built").toEqual([0, 0]);
    const table = matrix.renderedTable;
    expect(counts.created, "#2").toBe(1);
    expect(counts.createdTables[0] === table, "#3").toBe(true);
    expect(renderedIds(table), "#4: page 3").toEqual(idsFrom(21, 30));
  });
  test("created callback: a re-entrant read returns the same table, whose rendered rows the callback may mark", () => {
    const { matrix, counts } = createPagedMatrix();
    let isSame: boolean = undefined;
    let marked: any = undefined;
    matrix.onRenderedTableCreatedCallback = (table: any) => {
      counts.created++;
      const read = matrix.renderedTable;
      isSame = read === table;
      marked = dataRows(read)[2];
      marked.isAdditionalClasses = true;
    };
    const table = matrix.renderedTable;
    expect(isSame, "#1: the callback reads its argument").toBe(true);
    expect(table.rows.indexOf(marked) > -1 && marked.isAdditionalClasses, "#2: the mark is on the returned table").toBe(true);
    expect(marked.row.getQuestionByName("id").value, "#3").toBe(3);
    expect([counts.created, counts.rowActions], "#4: one build, one callback").toEqual([1, 10]);
  });
  test("created callback: a reset inside it, not locked, drops the table and the read returns the replacement", () => {
    const { matrix, counts } = createPagedMatrix();
    let tableA: any = undefined;
    matrix.onRenderedTableCreatedCallback = (table: any) => {
      counts.created++;
      if (!tableA) {
        tableA = table;
        matrix.resetRenderedTable();
      }
    };
    const tableB = matrix.renderedTable;
    expect([counts.created, counts.resets], "#1: two created callbacks, one reset").toEqual([2, 1]);
    expect(!!tableB && tableB !== tableA, "#2: the read returns the replacement").toBe(true);
    expect(tableA.isDisposed, "#3: the dropped table is disposed").toBe(true);
    expect(renderedIds(tableB), "#4").toEqual(idsFrom(1, 10));
    expect(matrix.renderedTable === tableB, "#5: a second read").toBe(true);
    expect([counts.created, counts.resets, counts.rowActions], "#6: two builds in total").toEqual([2, 1, 20]);
  });
  test("created callback: a reset inside it while the reset is locked keeps the table", () => {
    const { matrix, counts } = createPagedMatrix();
    let calls = 0;
    matrix.onRenderedTableCreatedCallback = () => {
      counts.created++;
      if (calls++ === 0) matrix.resetRenderedTable();
    };
    matrix["lockResetRenderedTable"] = true;
    const table = matrix.renderedTable;
    expect([counts.created, counts.resets], "#1: one created callback, no reset").toEqual([1, 0]);
    expect(matrix.renderedTable === table && !table.isDisposed, "#2: the table that was built").toBe(true);
    // Releasing the lock replays nothing: the reset it skipped is gone and the table stays.
    matrix["lockResetRenderedTable"] = false;
    expect([matrix.renderedTable === table, counts.resets, counts.created], "#3: unlocked").toEqual([true, 0, 1]);
    matrix.resetRenderedTable();
    expect([counts.resets, table.isDisposed], "#4: the next reset drops it").toEqual([1, true]);
  });
  test("created callback without paging: one per table build; an incremental add or remove builds nothing", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3, columns: [{ name: "id", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const tables: Array<any> = [];
    let rowActions = 0;
    survey.onGetMatrixRowActions.add(() => { rowActions++; });
    matrix.onRenderedTableCreatedCallback = (table: any) => { tables.push(table); };
    const table = matrix.renderedTable;
    expect([tables.length, tables[0] === table, rowActions], "#1: the first read").toEqual([1, true, 3]);
    matrix.addRow();
    expect([tables.length, matrix.renderedTable === table, rowActions], "#2: an add appends the row").toEqual([1, true, 4]);
    matrix.removeRow(0);
    expect([tables.length, matrix.renderedTable === table], "#3: a remove takes it out").toEqual([1, true]);
    matrix.addColumn("c2");
    expect(tables.length, "#4: a column change builds nothing until a read").toBe(1);
    const next = matrix.renderedTable;
    expect([tables.length, tables[1] === next, next !== table], "#5: the read after a column change").toEqual([2, true, true]);
  });
  test("visibleRowsChangedCallback fires once per page move", () => {
    const { matrix } = createPagedMatrix();
    let changed = 0;
    matrix.visibleRowsChangedCallback = () => { changed++; };
    matrix.renderedTable;
    matrix.goToPage(1);
    expect(changed, "#1: a page move with a table built").toBe(1);
    matrix.goToPage(2);
    matrix.renderedTable;
    matrix.goToPage(0);
    expect(changed, "#2: two more page moves").toBe(3);
  });
});
