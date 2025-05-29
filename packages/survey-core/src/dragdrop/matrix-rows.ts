import { CssClassBuilder } from "../utils/cssClassBuilder";
import { DomDocumentHelper } from "../global_variables_utils";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel, MatrixDynamicRowModel } from "../question_matrixdynamic";
import { DragDropCore } from "./core";
import { DragDropAllowEvent, MatrixRowDragOverEvent } from "src/survey-events-api";
export class DragDropMatrixRows extends DragDropCore<QuestionMatrixDynamicModel> {
  private draggedRenderedRow;
  private initialDraggedElementIndex: number;
  private lastDropTargetParentElement;
  private dropIsBanned = false;

  protected get draggedElementType(): string {
    return "matrix-row";
  }

  protected restoreUserSelectValue: string;

  private patchUserSelect() {
    const _body = DomDocumentHelper.getBody();
    if (!!_body) {
      this.restoreUserSelectValue = _body.style.userSelect;
      _body.style.userSelect = "none";
    }
  }

  private matrixRowMap = {};
  protected onStartDrag(): void {
    this.patchUserSelect();
    const renderedRows = this.parentElement.renderedTable.rows;
    let index = renderedRows.findIndex(r => r.row === this.draggedElement);
    if (index >= 0) {
      this.draggedRenderedRow = renderedRows[index];
      this.initialDraggedElementIndex = index;
      this.draggedRenderedRow.isGhostRow = true;
      this.lastDropTargetParentElement = this.parentElement;
    }

    const matrices = this.survey.onMatrixRowDragOver.isEmpty ?
      [this.parentElement] :
      this.survey.getAllQuestions().filter(q => q.isDescendantOf("matrixdynamic") && (q as QuestionMatrixDynamicModel).allowRowReorder);
    this.matrixRowMap = {};
    matrices.forEach(matrix => {
      matrix.visibleRows.forEach(row => {
        this.matrixRowMap[row.id] = { row, matrix };
      });
    });

    this.fromIndex = this.parentElement.visibleRows.indexOf(this.draggedElement);
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

    return draggedElementShortcut;
  }

  private fromIndex: number = null;
  private toIndex: number = null;
  private toMatrix: QuestionMatrixDynamicModel = null;

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: any
  ): MatrixDropdownRowModelBase {
    return this.matrixRowMap[dataAttributeValue]?.row;
  }
  public canInsertIntoThisRow(row: MatrixDynamicRowModel): boolean {
    const lockedRows = this.parentElement.lockedRowCount;
    return lockedRows <= 0 || row.rowIndex > lockedRows;
  }
  protected isDropTargetValid(dropTarget: any, dropTargetNode?: HTMLElement): boolean {
    return this.canInsertIntoThisRow(dropTarget);
  }

  protected calculateIsBottom(clientY: number, dropTargetNode?: HTMLElement): boolean {
    const rect = dropTargetNode.getBoundingClientRect();
    return clientY >= rect.y + rect.height / 2;
  }

  private removeGhost() {
    const lastRenderedRows = this.lastDropTargetParentElement.renderedTable.rows;
    const draggedRenderedRowIndex = lastRenderedRows.indexOf(this.draggedRenderedRow);
    if (draggedRenderedRowIndex >= 0) lastRenderedRows.splice(draggedRenderedRowIndex, 1);
  }

  protected doBanDropHere = (): void => {
    if (!this.dropIsBanned) {
      this.removeGhost();
      this.parentElement.renderedTable.rows.splice(this.initialDraggedElementIndex, 0, this.draggedRenderedRow);
      this.dropIsBanned = true;
      this.lastDropTargetParentElement = this.parentElement;
    }
  };

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    if (!this.dropTarget) return;
    const dropTargetMatrix = this.matrixRowMap[this.dropTarget.id].matrix;
    const bottomOffset = this.isBottom ? 1 : 0;
    const toIndex = dropTargetMatrix.visibleRows.indexOf(this.dropTarget) + bottomOffset;
    const options: MatrixRowDragOverEvent = {
      allow: dropTargetMatrix == this.parentElement,
      row: this.dropTarget,
      fromMatrix: this.parentElement,
      toMatrix: dropTargetMatrix,
    } as any;
    this.survey.onMatrixRowDragOver.fire(this.survey, options);
    if (!options.allow) return;

    this.removeGhost();
    this.lastDropTargetParentElement = dropTargetMatrix;

    const renderedRows = dropTargetMatrix.renderedTable.rows;
    const dropTargetRenderedRowIndex = renderedRows.findIndex(r => r.row == this.dropTarget);

    if (dropTargetRenderedRowIndex >= 0) {
      renderedRows.splice(dropTargetRenderedRowIndex + bottomOffset, 0, this.draggedRenderedRow);
    }
    this.toIndex = toIndex;
    this.toMatrix = dropTargetMatrix;
    this.dropIsBanned = false;

    super.ghostPositionChanged();
  }

  protected doDrop = (): QuestionMatrixDynamicModel => {
    if (this.parentElement == this.toMatrix) {
      if (this.fromIndex < this.toIndex) {
        this.toIndex--;
      }
      this.parentElement.moveRowByIndex(this.fromIndex, this.toIndex);
    } else {
      const row = { ...this.parentElement.value[this.fromIndex] };
      this.toMatrix.addRowByIndex(row, this.toIndex);
      this.parentElement.removeRowByIndex(this.fromIndex);
    }
    return this.parentElement;
  };

  public clear(): void {
    this.matrixRowMap = {};
    const renderedRows = this.parentElement.renderedTable.rows;
    renderedRows.forEach((renderedRow) => {
      renderedRow.isGhostRow = false;
    });
    this.parentElement.clearOnDrop();
    if (this.toMatrix)this.toMatrix.clearOnDrop();
    this.fromIndex = null;
    this.toIndex = null;
    const _body = DomDocumentHelper.getBody();
    if (!!_body) {
      _body.style.userSelect = this.restoreUserSelectValue || "initial";
    }
    super.clear();
  }
}
