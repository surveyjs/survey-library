import { QuestionMatrixModel } from "src/question_matrix";
import { DragDropCore } from "./core";

export class DragDropMatrixRows extends DragDropCore {
  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected getDropTargetByName(dragOverElementName: any) {
    const matrix = <QuestionMatrixModel>this.parentElement;
    let dropTargetRow;

    if (!dropTargetRow) {
      dropTargetRow = matrix.visibleRows.filter(
        (row: any) => row.id === dragOverElementName
      )[0];
    }

    return dropTargetRow;
  }

  protected doDrop() {}
}
