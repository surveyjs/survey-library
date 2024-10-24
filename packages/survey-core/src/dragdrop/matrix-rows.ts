import { CssClassBuilder } from "../utils/cssClassBuilder";
import { DomDocumentHelper } from "../global_variables_utils";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel, MatrixDynamicRowModel } from "../question_matrixdynamic";
import { DragDropCore } from "./core";
export class DragDropMatrixRows extends DragDropCore<QuestionMatrixDynamicModel> {
  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected restoreUserSelectValue: string;

  protected onStartDrag(): void {
    const _body = DomDocumentHelper.getBody();
    if(!!_body) {
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
    if(!draggedElementShortcut) return;

    draggedElementShortcut.className = this.shortcutClass;

    const isDeepClone = true;

    if(!!draggedElementNode) {
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

    //this.isBottom = null;

    const renderedRows = this.parentElement.renderedTable.rows;
    renderedRows.forEach((renderedRow, index) => {
      if (renderedRow.row === this.draggedElement) {
        renderedRow.isGhostRow = true;
      }
    });

    this.fromIndex = this.parentElement.visibleRows.indexOf(this.draggedElement);
    return draggedElementShortcut;
  }

  private fromIndex: number = null;
  private toIndex: number = null;

  // protected ghostPositionChanged(): void {
  //   let ghostPosition;
  //   this.parentElement.renderedTable.rows.forEach(
  //     (renderedRow: QuestionMatrixDropdownRenderedRow) => {

  //       ghostPosition = this.getGhostPosition(
  //         renderedRow.row
  //       );
  //       renderedRow.isGhostRow = !ghostPosition;
  //     }
  //   );
  //   super.ghostPositionChanged();
  // }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: any
  ): MatrixDropdownRowModelBase {
    const matrix = this.parentElement;
    let dropTargetRenderedRow;

    dropTargetRenderedRow = matrix.renderedTable.rows.filter(
      (renderedRow: any) => renderedRow.row && renderedRow.row.id === dataAttributeValue
    )[0];

    return dropTargetRenderedRow.row;
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

    let dropTargetIndex;
    let draggedElementIndex;
    let draggedRenderedRow;

    const renderedRows = this.parentElement.renderedTable.rows;
    renderedRows.forEach((renderedRow, index) => {
      if (renderedRow.row === this.dropTarget) {
        // renderedRow.isGhostRow = true;
        dropTargetIndex = index;
      }
      if (renderedRow.row === this.draggedElement) {
        draggedRenderedRow = renderedRow;
        draggedElementIndex = index;
        draggedRenderedRow.isGhostRow = true;
      }
    });

    renderedRows.splice(draggedElementIndex, 1);
    renderedRows.splice(dropTargetIndex, 0, draggedRenderedRow);
    this.toIndex = this.parentElement.visibleRows.indexOf(this.dropTarget);

    // const matrix = this.parentElement;
    // const fromIndex = matrix.visibleRows.indexOf(this.draggedElement);
    // const toIndex = matrix.visibleRows.indexOf(this.dropTarget);
    // matrix.moveRowByIndex(fromIndex, toIndex);

    // if (draggedElementIndex !== dropTargetIndex) {
    //   dropTargetNode.classList.remove("sv-matrix__drag-drop--moveup");
    //   dropTargetNode.classList.remove("sv-matrix__drag-drop--movedown");
    //   this.dropTarget.isDragDropMoveDown = false;
    //   this.dropTarget.isDragDropMoveUp = false;
    // }

    // if (draggedElementIndex > dropTargetIndex) {
    //   this.dropTarget.isDragDropMoveDown = true;
    // }

    // if (draggedElementIndex < dropTargetIndex) {
    //   this.dropTarget.isDragDropMoveUp = true;
    // }
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
    if(!!_body) {
      _body.style.userSelect = this.restoreUserSelectValue || "initial";
    }
    super.clear();
  }
}
