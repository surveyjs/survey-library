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
    const clone = <HTMLElement>(
      draggedElementNode
        .closest("[data-sv-drop-target-matrix-row]")
        .cloneNode(isDeepClone)
    );
    clone.style.cssText = `
      min-width: 100px;
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
      background-color: white;
      border-radius: 36px;
      padding-right: 16px;
    `;

    // clone.classList.remove("svc-item-value--moveup");
    // clone.classList.remove("svc-item-value--movedown");
    // this.draggedElement.isDragDropMoveDown = false;
    // this.draggedElement.isDragDropMoveUp = false;

    draggedElementShortcut.appendChild(clone);

    const rect = draggedElementNode.getBoundingClientRect();
    draggedElementShortcut.shortcutXOffset = event.clientX - rect.x;
    draggedElementShortcut.shortcutYOffset = event.clientY - rect.y;

    //this.isBottom = null;

    return draggedElementShortcut;
  }

  protected ghostPositionChanged(): void {
    this.parentElement.renderedTable.rows.forEach(
      (renderedRow: QuestionMatrixDropdownRenderedRow) => {
        renderedRow.ghostPosition = this.getGhostPosition(
          renderedRow.row
        );
      }
    );
    super.ghostPositionChanged();
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: any
  ): MatrixDropdownRowModelBase {
    const matrix = this.parentElement;
    let dropTargetRow;

    dropTargetRow = matrix.visibleRows.filter(
      (row: any) => row.id === dataAttributeValue
    )[0];

    return dropTargetRow;
  }

  protected isDropTargetValid(dropTarget: any): boolean {
    if (this.dropTarget === this.draggedElement) return false;
    const rows = this.parentElement.visibleRows;
    return rows.indexOf(dropTarget) !== -1;
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
    const rows = this.parentElement.visibleRows;
    return (
      rows.indexOf(this.dropTarget) - rows.indexOf(this.draggedElement) > 0
    );
  }

  protected doDrop = (): QuestionMatrixDynamicModel => {
    const matrix = this.parentElement;
    const fromIndex = matrix.visibleRows.indexOf(this.draggedElement);
    const toIndex = matrix.visibleRows.indexOf(this.dropTarget);
    matrix.moveRowByIndex(fromIndex, toIndex);

    return matrix;
  };
}
