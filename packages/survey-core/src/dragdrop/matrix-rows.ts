import { CssClassBuilder } from "../utils/cssClassBuilder";
import { DomDocumentHelper } from "../global_variables_utils";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel, MatrixDynamicRowModel } from "../question_matrixdynamic";
import { DragDropCore } from "./core";
import { DragDropAllowEvent, MatrixRowDragOverEvent } from "src/survey-events-api";
import { Question } from "src/question";
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

    const matrices = [];
    if (this.survey.onMatrixRowDragOver.isEmpty) {
      matrices.push(this.parentElement);
    } else {
      this.fillMatricies(this.survey.getAllQuestions(), matrices);
    }
    this.fillMatrixRowMap(matrices);
    this.fromIndex = this.parentElement.visibleRows.indexOf(this.draggedElement);
    this.draggedElement?.hideDetailPanel();
  }

  private fillMatricies(questions: Question[], matrices: QuestionMatrixDynamicModel[]) {
    const ms = questions.filter(q => q.isDescendantOf("matrixdynamic") && (q as QuestionMatrixDynamicModel).allowRowReorder);
    ms.forEach((m: QuestionMatrixDynamicModel) => {
      matrices.push(m);
      if (m.detailPanelMode !== "none") {
        m.visibleRows.forEach(r => {
          if (r.isDetailPanelShowing) {
            this.fillMatricies(r.questions, matrices);
          }
        });
      }
    });
  }

  private fillMatrixRowMap(matrices: QuestionMatrixDynamicModel[]) {
    matrices.forEach(matrix => {
      matrix.visibleRows.forEach(row => {
        this.matrixRowMap[row.id] = { row, matrix };
      });
      if (matrix.visibleRows.length == 0) {
        this.matrixRowMap[matrix.id] = { row: matrix, matrix };
      }
    });
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
    const mapData = this.matrixRowMap[dataAttributeValue];
    return mapData?.row || mapData?.matrix;
  }
  public canInsertIntoThisRow(row: MatrixDynamicRowModel): boolean {
    const lockedRows = this.parentElement.lockedRowCount;
    return lockedRows <= 0 || row.rowIndex > lockedRows;
  }
  protected isDropTargetValid(dropTarget: any, dropTargetNode?: HTMLElement): boolean {
    return this.canInsertIntoThisRow(dropTarget);
  }

  protected calculateIsBottom(clientY: number, dropTargetNode?: HTMLElement): boolean {
    const isRootContentNode = !!dropTargetNode.dataset.svDropTargetMatrix;
    if (isRootContentNode) return true;
    const rect = dropTargetNode.getBoundingClientRect();
    return clientY >= rect.y + rect.height / 2;
  }

  private expandCollapseTimer = null;
  private expandCollapseHandlingRow = null;
  protected doDragOver() {
    if (this.survey.onMatrixRowDragOver.isEmpty) return;
    if (this.dropTarget && typeof this.dropTarget.isDetailPanelShowing !== "undefined" && this.dropTarget.isDetailPanelShowing === false) {
      const row = this.dropTarget;
      const matrix = row.data;
      const renderedRow = matrix.renderedTable.rows.filter(r => r.row == row)[0];
      const startAction = renderedRow?.cells[1]?.item?.value?.actions?.filter(a => a.id == "show-detail")[0];
      const endAction = renderedRow?.cells[renderedRow.cells.length - 1]?.item?.value?.actions?.filter(a => a.id == "show-detail")[0];

      if ((startAction?.visible || endAction?.visible)) {

        if (this.expandCollapseHandlingRow !== row.id) {
          this.expandCollapseHandlingRow = row.id;
          this.clearExpandCollapseTimeout();
          this.expandCollapseTimer = setTimeout(()=>{
            const matrices = [];
            row.showDetailPanel();
            this.fillMatricies([matrix], matrices);
            this.fillMatrixRowMap(matrices);
          }, 500);
        }
      } else {
        this.clearExpandCollapseTimeout();
      }
    }
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
    const dropTargetRow = this.matrixRowMap[this.dropTarget.id].row;
    const bottomOffset = this.isBottom && !dropTargetRow.isDetailPanelShowing ? 1 : 0;
    let toIndex = 0;
    const options: MatrixRowDragOverEvent = {
      allow: dropTargetMatrix == this.parentElement,
      row: dropTargetRow,
      fromMatrix: this.parentElement,
      toMatrix: dropTargetMatrix,
    } as any;
    this.survey.onMatrixRowDragOver.fire(this.survey, options);
    if (!options.allow) return;

    this.removeGhost();
    this.lastDropTargetParentElement = dropTargetMatrix;

    const renderedRows = dropTargetMatrix.renderedTable.rows;
    if (dropTargetMatrix.visibleRows.length > 0) {
      const dropTargetRenderedRowIndex = renderedRows.findIndex(r => r.row == this.dropTarget);
      if (dropTargetRenderedRowIndex >= 0) {
        renderedRows.splice(dropTargetRenderedRowIndex + bottomOffset, 0, this.draggedRenderedRow);
      }
      toIndex = dropTargetMatrix.visibleRows.indexOf(this.dropTarget) + bottomOffset;
    } else {
      if (!dropTargetMatrix.renderedTable.headerRow) renderedRows[0].cells[0].colSpans = this.draggedRenderedRow.cells.length;
      renderedRows.splice(0, 0, this.draggedRenderedRow);
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
    } else if (this.toMatrix) {
      const row = { ...this.parentElement.value[this.fromIndex] };
      this.parentElement.removeRowByIndex(this.fromIndex);
      this.toMatrix.addRowByIndex(row, this.toIndex);
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
    this.clearExpandCollapseTimeout();
  }

  private clearExpandCollapseTimeout() {
    clearTimeout(this.expandCollapseTimer);
    this.expandCollapseTimer = null;
    this.expandCollapseHandlingRow = null;
  }
}
