import { IElement, ISurveyElement } from "./base-interfaces";
import { DragDropInfo } from "./drag-drop-helper-v1";
import { PanelModelBase, QuestionRowModel } from "./panel";
import { settings } from "./settings";

export class DragDropPanelHelperV1 {
  constructor(private panel: PanelModelBase) {
  }

  public dragDropAddTarget(dragDropInfo: DragDropInfo) {
    var prevRow = this.dragDropFindRow(dragDropInfo.target);
    if (this.dragDropAddTargetToRow(dragDropInfo, prevRow)) {
      this.panel.updateRowsRemoveElementFromRow(dragDropInfo.target, prevRow);
    }
  }
  public dragDropFindRow(findElement: ISurveyElement): QuestionRowModel {
    if (!findElement || findElement.isPage) return null;
    var element = <IElement>findElement;
    var rows = this.panel.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].elements.indexOf(element) > -1) return rows[i];
    }
    for (var i = 0; i < this.panel.elements.length; i++) {
      var pnl = this.panel.elements[i].getPanel();
      if (!pnl) continue;
      var row = (<PanelModelBase>pnl).dragDropFindRow(element);
      if (!!row) return row;
    }
    return null;
  }
  public dragDropMoveElement(src: IElement, target: IElement, targetIndex: number) {
    var srcIndex = (<PanelModelBase>src.parent).elements.indexOf(src);
    if (targetIndex > srcIndex) {
      targetIndex--;
    }
    this.panel.removeElement(src);
    this.panel.addElement(target, targetIndex);
  }

  public updateRowsOnElementAdded(element: IElement, index: number, dragDropInfo?: DragDropInfo, thisElement?: PanelModelBase) {
    if (!dragDropInfo) {
      dragDropInfo = new DragDropInfo(null, element);
      dragDropInfo.target = element;
      dragDropInfo.isEdge = this.panel.elements.length > 1;
      if (this.panel.elements.length < 2) {
        dragDropInfo.destination = thisElement;
      } else {
        dragDropInfo.isBottom = index > 0;
        if (index == 0) {
          dragDropInfo.destination = this.panel.elements[1];
        } else {
          dragDropInfo.destination = this.panel.elements[index - 1];
        }
      }
    }
    this.dragDropAddTargetToRow(dragDropInfo, null);
  }
  private dragDropAddTargetToRow(
    dragDropInfo: DragDropInfo,
    prevRow: QuestionRowModel
  ): boolean {
    if (!dragDropInfo.destination) return true;
    if (this.dragDropAddTargetToEmptyPanel(dragDropInfo)) return true;
    var dest = dragDropInfo.destination;
    var destRow = this.dragDropFindRow(dest);
    if (!destRow) return true;

    // if (settings.supportCreatorV2 && this.panel.isDesignMode) {
    //   if (destRow.elements.length > 1)
    //     return this.dragDropAddTargetToExistingRow(
    //       dragDropInfo,
    //       destRow,
    //       prevRow
    //     );
    //   else
    //     return this.dragDropAddTargetToNewRow(dragDropInfo, destRow, prevRow);
    // }
    if (!dragDropInfo.target.startWithNewLine)
      return this.dragDropAddTargetToExistingRow(
        dragDropInfo,
        destRow,
        prevRow
      );
    return this.dragDropAddTargetToNewRow(dragDropInfo, destRow, prevRow);
  }
  private dragDropAddTargetToEmptyPanel(dragDropInfo: DragDropInfo): boolean {
    if (dragDropInfo.destination.isPage) {
      this.dragDropAddTargetToEmptyPanelCore(
        this.panel.root,
        dragDropInfo.target,
        dragDropInfo.isBottom
      );
      return true;
    }
    var dest = <IElement>dragDropInfo.destination;
    if (dest.isPanel && !dragDropInfo.isEdge) {
      var panel = <PanelModelBase>(<any>dest);
      if ((<any>dragDropInfo.target)["template"] === dest) {
        return false;
      }
      if (
        dragDropInfo.nestedPanelDepth < 0 ||
        dragDropInfo.nestedPanelDepth >= panel.depth
      ) {
        this.dragDropAddTargetToEmptyPanelCore(
          <PanelModelBase>(<any>dest),
          dragDropInfo.target,
          dragDropInfo.isBottom
        );
        return true;
      }
    }
    return false;
  }
  private dragDropAddTargetToExistingRow(
    dragDropInfo: DragDropInfo,
    destRow: QuestionRowModel,
    prevRow: QuestionRowModel
  ): boolean {
    var index = destRow.elements.indexOf(<IElement>dragDropInfo.destination);
    if (
      index == 0 &&
      !dragDropInfo.isBottom) {

      if (this.panel.isDesignModeV2) {

      }
      else
      if (destRow.elements[0].startWithNewLine) {
        if (destRow.index > 0) {
          dragDropInfo.isBottom = true;
          destRow = destRow.panel.rows[destRow.index - 1];
          dragDropInfo.destination =
              destRow.elements[destRow.elements.length - 1];
          return this.dragDropAddTargetToExistingRow(
            dragDropInfo,
            destRow,
            prevRow
          );
        } else {
          return this.dragDropAddTargetToNewRow(dragDropInfo, destRow, prevRow);
        }
      }
    }
    var prevRowIndex = -1;
    if (prevRow == destRow) {
      prevRowIndex = destRow.elements.indexOf(dragDropInfo.target);
    }
    if (dragDropInfo.isBottom) index++;
    var srcRow = this.panel.findRowByElement(dragDropInfo.source);
    if (
      srcRow == destRow &&
      srcRow.elements.indexOf(dragDropInfo.source) == index
    )
      return false;
    if (index == prevRowIndex) return false;
    if (prevRowIndex > -1) {
      destRow.elements.splice(prevRowIndex, 1);
      if (prevRowIndex < index) index--;
    }
    destRow.elements.splice(index, 0, dragDropInfo.target);
    destRow.updateVisible();
    return prevRowIndex < 0;
  }
  private dragDropAddTargetToNewRow(
    dragDropInfo: DragDropInfo,
    destRow: QuestionRowModel,
    prevRow: QuestionRowModel
  ): boolean {
    var targetRow = destRow.panel.createRowAndSetLazy(destRow.panel.rows.length);
    if (this.panel.isDesignModeV2) {
      targetRow.setIsLazyRendering(false);
    }
    targetRow.addElement(dragDropInfo.target);
    var index = destRow.index;
    if (dragDropInfo.isBottom) {
      index++;
    }
    //same row
    if (!!prevRow && prevRow.panel == targetRow.panel && prevRow.index == index)
      return false;
    var srcRow = this.panel.findRowByElement(dragDropInfo.source);
    if (
      !!srcRow &&
      srcRow.panel == targetRow.panel &&
      srcRow.elements.length == 1 &&
      srcRow.index == index
    )
      return false;
    destRow.panel.rows.splice(index, 0, targetRow);
    return true;
  }
  private dragDropAddTargetToEmptyPanelCore(
    panel: PanelModelBase,
    target: IElement,
    isBottom: boolean
  ) {
    var targetRow = panel.createRow();
    targetRow.addElement(target);
    if (panel.elements.length == 0 || isBottom) {
      panel.rows.push(targetRow);
    } else {
      panel.rows.splice(0, 0, targetRow);
    }
  }

}