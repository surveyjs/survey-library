import { QuestionMatrixModel } from "src/question_matrix";
import { DragDropCore } from "./core";

export class DragDropMatrixRows extends DragDropCore {
  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected getDragOverElementByName(dragOverElementName: any) {
    const matrix = <QuestionMatrixModel>this.parentElement;
    let dragOverRow;

    if (!dragOverRow) {
      dragOverRow = matrix.visibleRows.filter(
        (row: any) => row.id === dragOverElementName
      )[0];
    }

    return dragOverRow;
  }

  protected doDragOver(event: PointerEvent, dragInfo: any) {}
}
