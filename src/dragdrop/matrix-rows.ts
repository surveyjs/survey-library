import { QuestionMatrixDropdownRenderedRow } from "src/question_matrixdropdownrendered";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { DragDropCore } from "./core";
export class DragDropMatrixRows extends DragDropCore<QuestionMatrixDynamicModel> {
  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement,
    event: PointerEvent
  ): HTMLElement {
    const draggedElementShortcut: any = document.createElement("div");
    // draggedElementShortcut.innerText = text;
    draggedElementShortcut.style.cssText = ` 
          cursor: grabbing;
          position: absolute;
          z-index: 1000;
          font-family: "Open Sans";
        `;

    const isDeepClone = true;

    const row = <HTMLElement>(draggedElementNode
      .closest("[data-sv-drop-target-matrix-row]"));
    const clone = <HTMLElement>(row.cloneNode(isDeepClone));

    clone.style.cssText = `
      box-shadow: rgb(0 0 0 / 10%) 0px 8px 16px;
      background-color: white;
      display: flex;
      flex-grow: 0;
      flex-shrink: 0;
      align-items: center;
      line-height: 0;
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
      (renderedRow: any) => renderedRow.row.id === dataAttributeValue
    )[0];

    return dropTargetRenderedRow.row;
  }

  protected isDropTargetValid(dropTarget: any): boolean {
    return true;
  }

  protected findDropTargetNodeByDragOverNode(
    dragOverNode: HTMLElement
  ): HTMLElement {
    const result: HTMLElement = dragOverNode.closest(
      this.dropTargetDataAttributeName
    );
    return result;
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
    if (this.dropTarget === this.draggedElement) return;

    let dropTargetIndex;
    let draggedElementIndex;
    let draggedRenderedRow;

    const renderedRows = this.parentElement.renderedTable.rows;
    renderedRows.forEach((renderedRow, index)=> {
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
    this.toIndex = dropTargetIndex;

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

  protected doClear(): void {
    this.parentElement["resetRenderedTable"]();
    this.fromIndex = null;
    this.toIndex = null;
  }
}
