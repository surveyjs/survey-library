import type { MatrixDropdownRowModelBase } from "./question_matrixdropdownbase";
import type { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";

/* What the host needs from its matrix. The table stays the matrix's "renderedTable" property: the UI
   packages react to it, so the host reads, creates and removes it through the matrix. */
export interface IMatrixRenderedTableOwner {
  getStoredTable(): QuestionMatrixDropdownRenderedTable;
  // Creates the table on the first read.
  getTable(): QuestionMatrixDropdownRenderedTable;
  removeStoredTable(): void;
  disposeTable(table: QuestionMatrixDropdownRenderedTable): void;
  onTableReset(): void;
  clearRows(): void;
  isUpdateLocked(): boolean;
  isPagingActive(): boolean;
  getVisibleRows(): Array<MatrixDropdownRowModelBase>;
}

// The rendered table of a matrix: when it is reset, and how a row add or remove reaches it.
export class MatrixRenderedTableHost {
  // Set from the start of a row add or remove to its end: a reset asked for meanwhile is skipped.
  public isResetLocked: boolean = false;
  constructor(private owner: IMatrixRenderedTableOwner) { }
  public get isCreated(): boolean {
    return !!this.owner.getStoredTable();
  }
  public get table(): QuestionMatrixDropdownRenderedTable {
    return this.owner.getTable();
  }
  public reset(columnVisibilityChanged?: boolean): void {
    if (!this.isCreated) return;
    if (this.isResetLocked || this.owner.isUpdateLocked()) {
      if (columnVisibilityChanged) {
        this.table.requireReset();
      }
    } else {
      const table = this.owner.getStoredTable();
      this.owner.removeStoredTable();
      this.disposeTable(table);
      this.owner.onTableReset();
    }
  }
  public clearRowsAndReset(): void {
    this.owner.clearRows();
    this.reset();
  }
  public updateShowTable(): void {
    if (this.isCreated) {
      this.table.updateShowTable();
    }
  }
  public dispose(): void {
    this.disposeTable(this.owner.getStoredTable());
  }
  public onStartRowAddingRemoving(): void {
    this.isResetLocked = true;
  }
  public onEndRowAdding(): void {
    this.isResetLocked = false;
    if (!this.isCreated) return;
    /* The incremental add appends the new row to the rendered table, which is right for a table
       that shows every visible row and wrong for a page that may not hold the new one at all. With
       paging on the table is reset instead - the question moves pageIndex to the page the new row
       landed on, which resets it anyway. */
    if (this.table.isRequireReset() || this.owner.isPagingActive()) {
      this.reset();
    } else {
      const index = this.owner.getVisibleRows().length - 1;
      this.table.onAddedRow(this.owner.getVisibleRows()[index], index);
    }
  }
  public onEndRowRemoving(row: MatrixDropdownRowModelBase): void {
    this.isResetLocked = false;
    if (!this.isCreated) return;
    /* Removing one row from the rendered table is right for a table that shows every visible row.
       A page is a window: the row that took the vacated slot comes from the next page, and a
       removal that emptied the last page moved pageIndex back while the reset it raised was locked
       out by onStartRowAddingRemoving. Either way the whole page is re-rendered. */
    if (this.table.isRequireReset() || this.owner.isPagingActive()) {
      this.reset();
    } else {
      if (!!row) {
        this.table.onRemovedRow(row);
      }
    }
  }
  /* A table that is replaced - a page move, a column change - holds the actions of its rows: each keeps
     listeners on the matrix's strings and on the survey's locale. They go with the table, once the UI
     no longer shows it (disposeLeftObject). The table disposes its rows and their actions. */
  private disposeTable(table: QuestionMatrixDropdownRenderedTable): void {
    if (!table || table.isDisposed) return;
    this.owner.disposeTable(table);
  }
}
