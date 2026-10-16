import { HashTable, Helpers } from "./helpers";
import { ConditionRunner } from "./conditions/conditionRunner";
import type { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";

// A cell question as the column state reads it: only a choice question has visibleChoices.
export interface IMatrixColumnStateCell {
  readonly isVisible: boolean;
  readonly isRequired: boolean;
  readonly visibleChoices?: Array<{ value: any }>;
}
export interface IMatrixColumnStateRow {
  readonly cells: Array<{ question: IMatrixColumnStateCell }>;
}
export interface IMatrixColumnStateOwner {
  getColumns(): Array<MatrixDropdownColumn>;
  // The built rows, none before the rows are built.
  getRows(): Array<IMatrixColumnStateRow>;
  isDesignMode(): boolean;
  // The matrix's own columnsVisibleIf: with one, every column is checked.
  getColumnsVisibleIf(): string;
}

/* Whether each column is shown, decided by columnsVisibleIf, by the visibility of its cells and, for a
   column shown in multiple columns, by the choices its cells show; and whether each column renders as
   required. A change of a column's visibility means the rendered table needs a reset: the methods that
   can find one return it, and the matrix resets. */
export class MatrixColumnStateEvaluator {
  constructor(private owner: IMatrixColumnStateOwner) { }
  // expression is columnsVisibleIf as the survey gives it to run.
  public runColumnConditions(expression: string, properties: HashTable<any>): void {
    this.owner.getColumns().forEach(column => {
      if (!expression) {
        column.isColumnsVisibleIf = true;
      } else {
        const condition = new ConditionRunner(expression);
        column.isColumnsVisibleIf = condition.runContext(column.getValueGetterContext(), properties) === true;
      }
    });
  }
  public checkColumnsVisibility(): boolean {
    if (this.owner.isDesignMode()) return false;
    const columns = this.owner.getColumns();
    const columnsVisibleIf = this.owner.getColumnsVisibleIf();
    var hasChanged = false;
    for (var i = 0; i < columns.length; i++) {
      const column = columns[i];
      const isCellsVisibilty = !!column.visibleIf || column.isFilteredMultipleColumns;
      if (!isCellsVisibilty && !columnsVisibleIf && column.isColumnVisible) continue;
      hasChanged = this.isColumnVisibilityChanged(column, isCellsVisibilty) || hasChanged;
    }
    return hasChanged;
  }
  public checkColumnsRenderedRequired(): void {
    const rows = this.owner.getRows();
    if (!rows) return;
    const columns = this.owner.getColumns();
    for (var i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (!column.requiredIf || !column.isColumnVisible) continue;
      let required = rows.length > 0;
      for (var j = 0; j < rows.length; j++) {
        if (!rows[j].cells[i].question.isRequired) {
          required = false;
          break;
        }
      }
      column.updateIsRenderedRequired(required);
    }
  }
  // A cell of the column was shown or hidden.
  public onColumnCellVisibilityChanged(column: MatrixDropdownColumn): boolean {
    if (this.owner.isDesignMode()) return false;
    return this.isColumnVisibilityChanged(column, true);
  }
  private isColumnVisibilityChanged(column: MatrixDropdownColumn, checkCellsVisiblity: boolean): boolean {
    const curVis = column.isColumnVisible;
    let hasVisCell = !checkCellsVisiblity;
    const rows = this.owner.getRows();
    const checkRows = checkCellsVisiblity && rows;
    const isMultipleColumnsVisibility = checkRows && column.isFilteredMultipleColumns;
    const curVisibleChoices = isMultipleColumnsVisibility ? column.getVisibleChoicesInCell : [];
    const newVisibleChoices = new Array<any>();
    if (checkRows) {
      for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[column.index];
        const q = cell?.question;
        if (!!q && q.isVisible) {
          hasVisCell = true;
          if (isMultipleColumnsVisibility) {
            this.updateNewVisibleChoices(q, newVisibleChoices);
          } else break;
        }
      }
    }
    column.hasVisibleCell = hasVisCell && column.isColumnsVisibleIf;
    if (isMultipleColumnsVisibility) {
      column.setVisibleChoicesInCell(newVisibleChoices);
      if (!Helpers.isArraysEqual(curVisibleChoices, newVisibleChoices, true, false, false)) return true;
    }
    return curVis !== column.isColumnVisible;
  }
  private updateNewVisibleChoices(q: IMatrixColumnStateCell, dest: Array<any>): void {
    const choices = q.visibleChoices;
    if (!Array.isArray(choices)) return;
    for (let i = 0; i < choices.length; i++) {
      const ch = choices[i];
      if (dest.indexOf(ch.value) < 0) dest.push(ch.value);
    }
  }
}
