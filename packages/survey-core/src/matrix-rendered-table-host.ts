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
  // The end of an add can append the last visible row to the table: always without paging; under paging
  // when the added record landed at the end of the page shown and no record moved between pages.
  canAppendAddedRow(): boolean;
  getVisibleRows(): Array<MatrixDropdownRowModelBase>;
}

// The rendered table of a matrix: when it is reset, and how a row add or remove reaches it.
export class MatrixRenderedTableHost {
  /* Set from the start of a row add or remove to its end, and by Survey Creator around an add: a reset
     asked for meanwhile is skipped. Every add and remove asks for one while the rows the table holds
     stay alive, and the end of the add or remove decides. A reset that is needed - the rows the table
     holds were disposed - is not lost: the table is marked (onRowsDisposed). */
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
  // The rows the table holds are disposed while its reset is locked: the reset is owed, and the table says so.
  public onRowsDisposed(): void {
    if (this.isCreated && (this.isResetLocked || this.owner.isUpdateLocked())) {
      this.table.requireReset();
    }
  }
  /* The lock is released from outside (Survey Creator's lockResetRenderedTable): a table whose rows
     were disposed meanwhile is reset now. The question releases its own lock without this: the end of
     its add or remove checks the table right after. */
  public releaseResetLock(): void {
    this.isResetLocked = false;
    if (this.isCreated && this.table.isResetRequested()) {
      this.reset();
    }
  }
  public onEndRowAdding(): void {
    this.isResetLocked = false;
    if (!this.isCreated) return;
    /* The incremental add appends the new row to the rendered table: right for a table that shows
       every visible row, and for a page whose last row is the new one while every other row stayed
       (canAppendAddedRow). Any other page is reset: the record started a new page or pushed one onto
       the next, or a sort or a filter placed it. A page move rebuilt the rows and marked the table
       (onRowsDisposed). */
    if (this.table.isRequireReset() || !this.owner.canAppendAddedRow()) {
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
