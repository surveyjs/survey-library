import { IElement, IPanel, ISurveyElement } from "./base-interfaces";
import { DragDropInfo } from "./drag-drop-helper-v1";
import { PageModel } from "./page";
import { PanelModelBase, QuestionRowModel } from "./panel";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { DragDropAllowEvent } from "./survey-events-api";

export class DragDropPageHelperV1 {
  constructor(private page: PageModel) {
  }

  private dragDropInfo: DragDropInfo;
  public getDragDropInfo(): any { return this.dragDropInfo; }

  public dragDropStart(
    src: IElement,
    target: IElement,
    nestedPanelDepth: number = -1
  ): void {
    this.dragDropInfo = new DragDropInfo(src, target, nestedPanelDepth);
  }
  public dragDropMoveTo(
    destination: ISurveyElement,
    isBottom: boolean = false,
    isEdge: boolean = false
  ): boolean {
    if (!this.dragDropInfo) return false;
    this.dragDropInfo.destination = destination;
    this.dragDropInfo.isBottom = isBottom;
    this.dragDropInfo.isEdge = isEdge;
    this.correctDragDropInfo(this.dragDropInfo);
    if (!this.dragDropCanDropTagert()) return false;
    if (!this.dragDropCanDropSource() || !this.dragDropAllowFromSurvey()) {
      if (!!this.dragDropInfo.source) {
        var row = this.page.dragDropFindRow(this.dragDropInfo.target);
        this.page.updateRowsRemoveElementFromRow(this.dragDropInfo.target, row);
      }
      return false;
    }
    this.page.dragDropAddTarget(this.dragDropInfo);
    return true;
  }

  private correctDragDropInfo(dragDropInfo: DragDropInfo) {
    if (!dragDropInfo.destination) return;
    var panel = (<IElement>dragDropInfo.destination).isPanel
      ? <IPanel>(<any>dragDropInfo.destination)
      : null;
    if (!panel) return;
    if (
      !dragDropInfo.target.isLayoutTypeSupported(panel.getChildrenLayoutType())
    ) {
      dragDropInfo.isEdge = true;
    }
  }
  private dragDropAllowFromSurvey(): boolean {
    var dest = this.dragDropInfo.destination;
    if (!dest || !this.page.survey) return true;
    var insertBefore: IElement = null;
    var insertAfter: IElement = null;
    var parent =
      dest.isPage || (!this.dragDropInfo.isEdge && (<IElement>dest).isPanel)
        ? dest
        : (<IElement>dest).parent;
    if (!dest.isPage) {
      var container = (<IElement>dest).parent;
      if (!!container) {
        var elements = (<PanelModelBase>container).elements;
        var index = elements.indexOf(<IElement>dest);
        if (index > -1) {
          insertBefore = <IElement>dest;
          insertAfter = <IElement>dest;
          if (this.dragDropInfo.isBottom) {
            insertBefore =
              index < elements.length - 1 ? elements[index + 1] : null;
          } else {
            insertAfter = index > 0 ? elements[index - 1] : null;
          }
        }
      }
    }
    const options: DragDropAllowEvent = {
      allow: true,
      target: this.dragDropInfo.target,
      source: this.dragDropInfo.source,
      toElement: this.dragDropInfo.target,
      draggedElement: this.dragDropInfo.source,
      parent: parent,
      fromElement: this.dragDropInfo.source ? this.dragDropInfo.source.parent : null,
      insertAfter: insertAfter,
      insertBefore: insertBefore,
    };
    return this.page.survey.dragAndDropAllow(options);
  }
  public dragDropFinish(isCancel: boolean = false): IElement {
    if (!this.dragDropInfo) return;
    var target = this.dragDropInfo.target;
    var src = this.dragDropInfo.source;
    var dest = this.dragDropInfo.destination;
    var row = this.page.dragDropFindRow(target);
    var targetIndex = this.dragDropGetElementIndex(target, row);
    this.page.updateRowsRemoveElementFromRow(target, row);
    var elementsToSetSWNL = [];
    var elementsToResetSWNL = [];
    if (!isCancel && !!row) {
      var isSamePanel = false;

      if (this.page.isDesignModeV2) {
        var srcRow = src && src.parent && (src.parent as PanelModelBase).dragDropFindRow(src);
        if (row.panel.elements[targetIndex] && row.panel.elements[targetIndex].startWithNewLine && row.elements.length > 1 && row.panel.elements[targetIndex] === dest) {
          elementsToSetSWNL.push(target);
          elementsToResetSWNL.push(row.panel.elements[targetIndex]);
        }
        if (target.startWithNewLine && row.elements.length > 1 && (!row.panel.elements[targetIndex] || !row.panel.elements[targetIndex].startWithNewLine)) {
          elementsToResetSWNL.push(target);
        }
        if (srcRow && srcRow.elements[0] === src && srcRow.elements[1]) {
          elementsToSetSWNL.push(srcRow.elements[1]);
        }
        if (row.elements.length <= 1) {
          elementsToSetSWNL.push(target);
        }
        if (target.startWithNewLine && row.elements.length > 1 && row.elements[0] !== dest) {
          elementsToResetSWNL.push(target);
        }
      }
      (this.page.survey as SurveyModel).startMovingQuestion();
      if (!!src && !!src.parent) {
        isSamePanel = row.panel == src.parent;
        if (isSamePanel) {
          row.panel.dragDropMoveElement(src, target, targetIndex);
          targetIndex = -1;
        } else {
          src.parent.removeElement(src);
        }
      }
      if (targetIndex > -1) {
        row.panel.addElement(target, targetIndex);
      }
      (this.page.survey as SurveyModel).stopMovingQuestion();
    }
    elementsToSetSWNL.map((e) => { e.startWithNewLine = true; });
    elementsToResetSWNL.map((e) => { e.startWithNewLine = false; });

    this.dragDropInfo = null;
    return !isCancel ? target : null;
  }
  private dragDropGetElementIndex(
    target: IElement,
    row: QuestionRowModel
  ): number {
    if (!row) return -1;
    var index = row.elements.indexOf(target);
    if (row.index == 0) return index;
    var prevRow = row.panel.rows[row.index - 1];
    var prevElement = prevRow.elements[prevRow.elements.length - 1];
    return index + row.panel.elements.indexOf(prevElement) + 1;
  }
  private dragDropCanDropTagert(): boolean {
    var destination = this.dragDropInfo.destination;
    if (!destination || destination.isPage) return true;
    return this.dragDropCanDropCore(
      this.dragDropInfo.target,
      <IElement>destination
    );
  }
  private dragDropCanDropSource(): boolean {
    var source = this.dragDropInfo.source;
    if (!source) return true;
    var destination = <IElement>this.dragDropInfo.destination;
    if (!this.dragDropCanDropCore(source, destination)) return false;
    if (this.page.isDesignModeV2) {
      const rowSource = this.page.dragDropFindRow(source);
      const rowDestination = this.page.dragDropFindRow(destination);

      if (rowSource !== rowDestination) {
        if (!source.startWithNewLine && destination.startWithNewLine)
          return true;

        if (source.startWithNewLine && !destination.startWithNewLine) {
          return true;
        }
      }

      let row = this.page.dragDropFindRow(destination);
      if (row && row.elements.length == 1)
        return true;
    }
    return this.dragDropCanDropNotNext(
      source,
      destination,
      this.dragDropInfo.isEdge,
      this.dragDropInfo.isBottom
    );
  }
  private dragDropCanDropCore(
    target: IElement,
    destination: IElement
  ): boolean {
    if (!destination) return true;
    if (this.dragDropIsSameElement(destination, target)) return false;
    if (target.isPanel) {
      var pnl = <PanelModelBase>(<any>target);
      if (
        pnl.containsElement(destination) ||
        !!pnl.getElementByName(destination.name)
      )
        return false;
    }
    return true;
  }
  private dragDropCanDropNotNext(
    source: IElement,
    destination: IElement,
    isEdge: boolean,
    isBottom: boolean
  ): boolean {
    if (!destination || (destination.isPanel && !isEdge)) return true;
    if (typeof source.parent === "undefined" || source.parent !== destination.parent) return true;
    var pnl = <PanelModelBase>source.parent;
    var srcIndex = pnl.elements.indexOf(source);
    var destIndex = pnl.elements.indexOf(destination);
    if (destIndex < srcIndex && !isBottom) destIndex--;
    if (isBottom) destIndex++;
    return srcIndex < destIndex
      ? destIndex - srcIndex > 1
      : srcIndex - destIndex > 0;
  }

  private dragDropIsSameElement(el1: IElement, el2: IElement) {
    return el1 == el2 || el1.name == el2.name;
  }
}