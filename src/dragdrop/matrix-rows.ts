import { QuestionMatrixModel } from "src/question_matrix";
import { DragDropCore } from "./core";

export class DragDropMatrixRows extends DragDropCore {
  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected getShortcutText() {
    return this.draggedElement.id;
  }

  protected getDropTargetByName(dragOverElementName: any) {
    const matrix = <QuestionMatrixModel>this.parentElement;
    let dropTargetRow;

    dropTargetRow = matrix.visibleRows.filter(
      (row: any) => row.id === dragOverElementName
    )[0];

    return dropTargetRow;
  }

  protected isDropTargetValid(dropTarget: any) {
    const rows = this.parentElement.visibleRows;
    return rows.indexOf(dropTarget) !== -1;
  }

  protected calculateIsBottom(clientY: number): boolean {
    const rows = this.parentElement.visibleRows;
    let isBottom;
    //drag over next item
    if (
      rows.indexOf(this.dropTargetCandidate) -
        rows.indexOf(this.draggedElement) ===
      1
    ) {
      isBottom = true;
    }

    //drag over prev item
    if (
      rows.indexOf(this.draggedElement) -
        rows.indexOf(this.dropTargetCandidate) ===
      1
    ) {
      isBottom = false;
    }

    return isBottom;
  }

  protected doDrop = () => {
    const matrix = <QuestionMatrixModel>this.parentElement;
    const fromIndex = matrix.visibleRows.indexOf(this.draggedElement);
    const toIndex = matrix.visibleRows.indexOf(this.dropTarget);
    matrix.moveRowByIndex(fromIndex, toIndex);

    return matrix;
  };
}
