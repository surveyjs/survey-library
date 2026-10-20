import { describe, test, expect } from "vitest";
import { MatrixRenderedTableHost } from "../src/matrix-rendered-table-host";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import "../src/question_text";

function createTable(): any {
  const table: any = { isDisposed: false, isRequireResetValue: false, log: [] };
  table.requireReset = () => { table.isRequireResetValue = true; table.log.push("requireReset"); };
  table.isRequireReset = () => table.isRequireResetValue;
  table.isResetRequested = () => table.isRequireResetValue;
  table.onAddedRow = (row: any, index: number) => table.log.push("added:" + row + ":" + index);
  table.onRemovedRow = (row: any) => table.log.push("removed:" + row);
  table.updateShowTable = () => table.log.push("updateShowTable");
  return table;
}
function createHost(): { host: MatrixRenderedTableHost, state: any } {
  const state: any = { stored: undefined, created: 0, disposed: [], resets: 0, cleared: 0, updateLocked: false, paging: false, rows: ["r1", "r2"] };
  const host = new MatrixRenderedTableHost({
    getStoredTable: () => state.stored,
    getTable: () => {
      if (!state.stored) { state.stored = createTable(); state.created++; }
      return state.stored;
    },
    removeStoredTable: () => { state.stored = undefined; },
    disposeTable: (table: any) => { table.isDisposed = true; state.disposed.push(table); },
    onTableReset: () => { state.resets++; },
    clearRows: () => { state.cleared++; },
    isUpdateLocked: () => state.updateLocked,
    isPagingActive: () => state.paging,
    canAppendAddedRow: () => !state.paging,
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
  test("rows disposed while the reset is locked mark the table; the external release resets a marked table only", () => {
    const { host, state } = createHost();
    host.onRowsDisposed();
    expect(state.created, "#1: no table, nothing is created").toBe(0);
    const table = host.table;
    host.onRowsDisposed();
    expect(table.log, "#2: not locked, the reset that follows does it").toEqual([]);
    host.isResetLocked = true;
    host.reset();
    host.releaseResetLock();
    expect([host.isResetLocked, host.isCreated, state.resets], "#3: a routine reset under the lock stays skipped").toEqual([false, true, 0]);
    host.isResetLocked = true;
    host.onRowsDisposed();
    expect(table.log, "#4: marked").toEqual(["requireReset"]);
    host.releaseResetLock();
    expect([host.isResetLocked, host.isCreated, state.resets], "#5: reset on release").toEqual([false, false, 1]);
    const next = host.table;
    state.updateLocked = true;
    host.onRowsDisposed();
    expect(next.log, "#6: an update lock marks too").toEqual(["requireReset"]);
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
