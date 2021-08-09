import { QuestionMatrixModel } from "src/question_matrix";
import { DragDropCore } from "./core";

export class DragDropMatrixRows extends DragDropCore {
  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected getShortcutText(draggedElement: any) {
    const matrix = <QuestionMatrixModel>this.parentElement;
    const index = matrix.visibleRows.indexOf(draggedElement) + 1;
    return (
      draggedElement.cells[1].questionValue.value ||
      draggedElement.cells[0].questionValue.value ||
      "" + index
    );
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: any) {
    const matrix = <QuestionMatrixModel>this.parentElement;
    let dropTargetRow;

    dropTargetRow = matrix.visibleRows.filter(
      (row: any) => row.id === dataAttributeValue
    )[0];

    return dropTargetRow;
  }

  protected isDropTargetValid(dropTarget: any) {
    const rows = this.parentElement.visibleRows;
    return rows.indexOf(dropTarget) !== -1;
  }

  protected calculateIsBottom(clientY: number): boolean {
    const rows = this.parentElement.visibleRows;
    return (
      rows.indexOf(this.dropTarget) - rows.indexOf(this.draggedElement) > 0
    );
  }

  protected doDrop = () => {
    const matrix = <QuestionMatrixModel>this.parentElement;
    const fromIndex = matrix.visibleRows.indexOf(this.draggedElement);
    const toIndex = matrix.visibleRows.indexOf(this.dropTarget);
    matrix.moveRowByIndex(fromIndex, toIndex);

    return matrix;
  };
}
