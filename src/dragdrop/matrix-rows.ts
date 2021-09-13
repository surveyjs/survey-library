import { MatrixDropdownRowModelBase, QuestionMatrixDropdownRenderedRow } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { DragDropCore } from "./core";
export class DragDropMatrixRows extends DragDropCore<QuestionMatrixDynamicModel> {
  protected get draggedElementType(): string {
    return "matrix-row";
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

  protected getShortcutText(draggedElement: any): string {
    const matrix = this.parentElement;
    const index = matrix.visibleRows.indexOf(draggedElement) + 1;
    return (
      draggedElement.cells[1].questionValue.value ||
      draggedElement.cells[0].questionValue.value ||
      "" + index
    );
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
