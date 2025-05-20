import { CssClassBuilder } from "../utils/cssClassBuilder";
import { DomDocumentHelper } from "../global_variables_utils";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel, MatrixDynamicRowModel } from "../question_matrixdynamic";
import { DragDropCore } from "./core";
export class DragDropMatrixRows extends DragDropCore<QuestionMatrixDynamicModel> {
  private dropTargetIndex;
  private draggedRenderedRow;
  private lastDropTargetParentElement;
  private lastDropTargetIndex;

  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected restoreUserSelectValue: string;

  protected onStartDrag(): void {
    const _body = DomDocumentHelper.getBody();
    if (!!_body) {
      this.restoreUserSelectValue = _body.style.userSelect;
      _body.style.userSelect = "none";
    }
  }

  private get shortcutClass(): string {
    return new CssClassBuilder()
      .append(this.parentElement.cssClasses.draggedRow)
      //.append(this.parentElement.cssClasses.dragShortcutMobileMod, IsMobile)
      .toString();
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement,
    event: PointerEvent
  ): HTMLElement {
    const draggedElementShortcut: any = DomDocumentHelper.createElement("div");
    if (!draggedElementShortcut) return;

    draggedElementShortcut.className = this.shortcutClass;

    const isDeepClone = true;

    if (!!draggedElementNode) {
      const row = <HTMLElement>(draggedElementNode
        .closest("[data-sv-drop-target-matrix-row]"));
      const clone = <HTMLElement>(row.cloneNode(isDeepClone));

      clone.style.cssText = `
        width: ${row.offsetWidth}px;
      `;

      clone.classList.remove("sv-matrix__drag-drop--moveup");
      clone.classList.remove("sv-matrix__drag-drop--movedown");
      this.draggedElement.isDragDropMoveDown = false;
      this.draggedElement.isDragDropMoveUp = false;

      draggedElementShortcut.appendChild(clone);

      const rect = draggedElementNode.getBoundingClientRect();
      draggedElementShortcut.shortcutXOffset = event.clientX - rect.x;
      draggedElementShortcut.shortcutYOffset = event.clientY - rect.y;
    }

    const renderedRows = this.parentElement.renderedTable.rows;
    let draggedElementIndex = -1;
    renderedRows.forEach((renderedRow, index) => {
      if (renderedRow.row === this.draggedElement) {
        this.draggedRenderedRow = renderedRow;
        draggedElementIndex = index;
        renderedRow.isGhostRow = true;
      }
    });
    renderedRows.splice(draggedElementIndex, 1);
    this.fromIndex = this.parentElement.visibleRows.indexOf(this.draggedElement);
    return draggedElementShortcut;
  }

  private fromIndex: number = null;
  private toIndex: number = null;

  private findRowIndexInMatrixById(matrix: QuestionMatrixDynamicModel, rowid) {
    const rows = matrix.renderedTable.rows;
    const row = rows.filter(
      (renderedRow: any) => renderedRow.row && renderedRow.row.id === rowid
    )[0];
    return rows.indexOf(row);
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: any
  ): MatrixDropdownRowModelBase {
    const matrix = this.parentElement;
    this.dropTargetIndex = this.findRowIndexInMatrixById(matrix, dataAttributeValue);
    if (this.dropTargetIndex < 0) {
      const matrices = this.survey.getAllQuestions().filter(q => q instanceof QuestionMatrixDynamicModel);
      for (let i = 0; i < matrices.length; i++) {
        this.dropTargetIndex = this.findRowIndexInMatrixById(matrices[i], dataAttributeValue);
        if (this.dropTargetIndex >= 0) {
          this.dropTargetParentElement = matrices[i];
          break;
        }
      }
    }

    return matrix.renderedTable.rows[this.dropTargetIndex]?.row;
  }
  public canInsertIntoThisRow(row: MatrixDynamicRowModel): boolean {
    const lockedRows = this.parentElement.lockedRowCount;
    return lockedRows <= 0 || row.rowIndex > lockedRows;
  }
  protected isDropTargetValid(dropTarget: any, dropTargetNode?: HTMLElement): boolean {
    return this.canInsertIntoThisRow(dropTarget);
  }

  protected calculateIsBottom(clientY: number): boolean {
    const rendreredRows = this.parentElement.renderedTable.rows;
    const rows = rendreredRows.map(rendredRow => rendredRow.row);

    return (
      rows.indexOf(this.dropTarget) - rows.indexOf(this.draggedElement) > 0
    );
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    if (this.isDropTargetDoesntChanged(this.isBottom)) return;

    if (this.lastDropTargetParentElement) {
      const renderedRows = this.lastDropTargetParentElement?.renderedTable.rows;
      renderedRows.splice(this.lastDropTargetIndex, 1);
    }

    this.lastDropTargetParentElement = this.dropTargetParentElement;
    this.lastDropTargetIndex = this.dropTargetIndex;
    this.dropTargetParentElement.renderedTable.rows.splice(this.dropTargetIndex, 0, this.draggedRenderedRow);
    this.toIndex = this.dropTargetParentElement.visibleRows.indexOf(this.dropTarget);

    super.ghostPositionChanged();
  }

  protected doDrop = (): QuestionMatrixDynamicModel => {
    this.parentElement.moveRowByIndex(this.fromIndex, this.toIndex);
    return this.parentElement;
  };

  public clear(): void {
    const renderedRows = this.parentElement.renderedTable.rows;
    renderedRows.forEach((renderedRow) => {
      renderedRow.isGhostRow = false;
    });
    this.parentElement.clearOnDrop();
    this.fromIndex = null;
    this.toIndex = null;
    const _body = DomDocumentHelper.getBody();
    if (!!_body) {
      _body.style.userSelect = this.restoreUserSelectValue || "initial";
    }
    super.clear();
  }
}
