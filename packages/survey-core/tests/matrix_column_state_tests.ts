import { describe, test, expect } from "vitest";
import { MatrixColumnStateEvaluator, IMatrixColumnStateRow } from "../src/matrix-column-state";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import "../src/question_text";
import "../src/question_checkbox";

function createColumns(...names: Array<string>): Array<MatrixDropdownColumn> {
  return names.map((name, index) => {
    const column = new MatrixDropdownColumn(name);
    column.cellType = "text";
    column.setIndex(index);
    return column;
  });
}
function createRow(...cells: Array<{ isVisible?: boolean, isRequired?: boolean, choices?: Array<any> }>): IMatrixColumnStateRow {
  return { cells: cells.map(cell => ({ question: {
    isVisible: cell.isVisible !== false, isRequired: !!cell.isRequired,
    visibleChoices: cell.choices ? cell.choices.map(value => ({ value: value })) : undefined
  } })) };
}
function createEvaluator(columns: Array<MatrixDropdownColumn>, options: { rows?: Array<IMatrixColumnStateRow>, designMode?: boolean, columnsVisibleIf?: string } = {}) {
  const state = { rows: options.rows, designMode: !!options.designMode, columnsVisibleIf: options.columnsVisibleIf || "" };
  const evaluator = new MatrixColumnStateEvaluator({
    getColumns: () => columns,
    getRows: () => state.rows,
    isDesignMode: () => state.designMode,
    getColumnsVisibleIf: () => state.columnsVisibleIf
  });
  return { evaluator, state };
}

describe("MatrixColumnStateEvaluator", () => {
  test("columnsVisibleIf runs against each column; without an expression every column passes", () => {
    const columns = createColumns("a", "b", "c");
    const { evaluator } = createEvaluator(columns);
    evaluator.runColumnConditions("{item} != 'b'", {});
    expect(columns.map(column => column.isColumnsVisibleIf), "#1").toEqual([true, false, true]);
    evaluator.runColumnConditions("{item}", {});
    expect(columns.map(column => column.isColumnsVisibleIf), "#2: only true passes").toEqual([false, false, false]);
    evaluator.runColumnConditions("", {});
    expect(columns.map(column => column.isColumnsVisibleIf), "#3").toEqual([true, true, true]);
  });
  test("a column rejected by columnsVisibleIf hides once the columns are checked, and the table needs a reset once", () => {
    const columns = createColumns("a", "b");
    const { evaluator } = createEvaluator(columns, { rows: [createRow({}, {})], columnsVisibleIf: "{item} != 'b'" });
    evaluator.runColumnConditions("{item} != 'b'", {});
    expect(columns.map(column => column.isColumnVisible), "#1: not checked yet").toEqual([true, true]);
    expect(evaluator.checkColumnsVisibility(), "#2: a reset").toBe(true);
    expect(columns.map(column => column.isColumnVisible), "#2").toEqual([true, false]);
    expect(evaluator.checkColumnsVisibility(), "#3: nothing changed").toBe(false);
  });
  test("a column with visibleIf hides when no cell of it is visible and shows when one is", () => {
    const columns = createColumns("a", "b");
    columns[1].visibleIf = "{row.a} = 1";
    const { evaluator, state } = createEvaluator(columns, { rows: [createRow({}, { isVisible: false }), createRow({}, { isVisible: false })] });
    expect(evaluator.checkColumnsVisibility(), "#1").toBe(true);
    expect(columns.map(column => column.isColumnVisible), "#1").toEqual([true, false]);
    state.rows = [createRow({}, { isVisible: false }), createRow({}, {})];
    expect(evaluator.checkColumnsVisibility(), "#2").toBe(true);
    expect(columns[1].isColumnVisible, "#2").toBe(true);
  });
  test("a column without visibleIf is not checked unless the matrix has columnsVisibleIf", () => {
    const columns = createColumns("a");
    const { evaluator, state } = createEvaluator(columns, { rows: [createRow({ isVisible: false })] });
    expect(evaluator.checkColumnsVisibility(), "#1").toBe(false);
    expect(columns[0].hasVisibleCell, "#1: untouched").toBe(true);
    columns[0].isColumnsVisibleIf = false;
    state.columnsVisibleIf = "false";
    expect(evaluator.checkColumnsVisibility(), "#2").toBe(true);
    expect(columns[0].isColumnVisible, "#2").toBe(false);
  });
  test("in design mode the columns are neither checked nor changed by a cell", () => {
    const columns = createColumns("a");
    columns[0].visibleIf = "false";
    const { evaluator, state } = createEvaluator(columns, { rows: [createRow({ isVisible: false })], designMode: true });
    expect(evaluator.checkColumnsVisibility(), "#1").toBe(false);
    expect(evaluator.onColumnCellVisibilityChanged(columns[0]), "#2").toBe(false);
    expect(columns[0].isColumnVisible, "#3").toBe(true);
    state.designMode = false;
    expect(evaluator.onColumnCellVisibilityChanged(columns[0]), "#4").toBe(true);
    expect(columns[0].isColumnVisible, "#4").toBe(false);
  });
  test("a cell visibility change checks its column against the cells", () => {
    const columns = createColumns("a", "b");
    const { evaluator, state } = createEvaluator(columns, { rows: [createRow({}, { isVisible: false })] });
    expect(evaluator.onColumnCellVisibilityChanged(columns[1]), "#1").toBe(true);
    expect(columns[1].isColumnVisible, "#1").toBe(false);
    expect(evaluator.onColumnCellVisibilityChanged(columns[1]), "#2: no change").toBe(false);
    state.rows = undefined;
    expect(evaluator.onColumnCellVisibilityChanged(columns[1]), "#3: no rows, no visible cell").toBe(false);
    expect(columns[1].isColumnVisible, "#3").toBe(false);
  });
  test("a column shown in multiple columns keeps the choices its visible cells show", () => {
    const column = new MatrixDropdownColumn("a");
    column.cellType = "checkbox";
    column.setIndex(0);
    column.templateQuestion.choices = [{ value: 1, visibleIf: "{row.x} = 1" }, 2, 3];
    column.showInMultipleColumns = true;
    expect(column.isFilteredMultipleColumns, "#0").toBe(true);
    const { evaluator, state } = createEvaluator([column], { rows: [createRow({ choices: [1, 2] }), createRow({ choices: [2, 3] }), createRow({ isVisible: false, choices: [4] })] });
    expect(evaluator.checkColumnsVisibility(), "#1: the choices changed").toBe(true);
    expect(column.getVisibleChoicesInCell, "#1").toEqual([1, 2, 3]);
    expect(evaluator.checkColumnsVisibility(), "#2: the same choices").toBe(false);
    state.rows = [createRow({ choices: [3, 2] })];
    expect(evaluator.checkColumnsVisibility(), "#3").toBe(true);
    expect(column.getVisibleChoicesInCell, "#3").toEqual([3, 2]);
  });
  test("a column with requiredIf renders as required when every row's cell is required", () => {
    const columns = createColumns("a", "b");
    columns[0].requiredIf = "{row.b} = 1";
    const { evaluator, state } = createEvaluator(columns);
    evaluator.checkColumnsRenderedRequired();
    expect(columns[0].isRenderedRequired, "#1: no rows, nothing updated").toBe(false);
    state.rows = [createRow({ isRequired: true }, {}), createRow({ isRequired: true }, {})];
    evaluator.checkColumnsRenderedRequired();
    expect(columns.map(column => column.isRenderedRequired), "#2").toEqual([true, false]);
    state.rows = [createRow({ isRequired: true }, {}), createRow({}, {})];
    evaluator.checkColumnsRenderedRequired();
    expect(columns[0].isRenderedRequired, "#3").toBe(false);
    state.rows = [];
    columns[0].updateIsRenderedRequired(true);
    evaluator.checkColumnsRenderedRequired();
    expect(columns[0].isRenderedRequired, "#4: no row, not required").toBe(false);
  });
});
