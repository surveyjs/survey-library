import { SurveyModel } from "../survey";
import { Base, EventBase } from "../base";
import { IShortcutText, ISurvey, ISurveyElement } from "../base-interfaces";
import { DragTypeOverMeEnum } from "../survey-element";
import { IDragDropEngine } from "./engine";
import { DragDropDOMAdapter, IDragDropDOMAdapter } from "./dom-adapter";

export abstract class DragDropCore<T> implements IDragDropEngine {
  private _isBottom: boolean = null;
  public get isBottom(): boolean { //TODO rename isBottom to isShowGhostAtBottomOfDropTarget
    return !!this._isBottom;
  }
  public set isBottom(val: boolean) {
    if(this._isBottom === val) {
      return;
    }
    this._isBottom = val;
    this.ghostPositionChanged();
  }
  public onGhostPositionChanged: EventBase<{}> = new EventBase<{}>();
  protected ghostPositionChanged(): void {
    this.onGhostPositionChanged.fire(<any>{}, {});
  }

  public onDragStart: EventBase<DragDropCore<T>> = new EventBase();
  public onDragEnd: EventBase<DragDropCore<T>> = new EventBase();
  public onBeforeDrop = this.onDragStart;
  public onAfterDrop = this.onDragEnd;

  public draggedElement: any = null;
  protected abstract get draggedElementType(): string;
  protected parentElement: T;
  public dropTarget: any = null;
  protected get dropTargetDataAttributeName(): string {
    return `[data-sv-drop-target-${this.draggedElementType}]`;
  }
  protected get survey(): SurveyModel {
    return this.surveyValue || this.creator.survey;
  }

  public prevDropTarget: any = null;
  protected allowDropHere = false;

  protected domAdapter: IDragDropDOMAdapter;
  constructor(private surveyValue?: ISurvey, private creator?: any, longTap?: boolean, domAdapter?: IDragDropDOMAdapter) {
    this.domAdapter = domAdapter || new DragDropDOMAdapter(this, longTap);
  }

  public startDrag(event: PointerEvent, draggedElement: any, parentElement?: any, draggedElementNode?: HTMLElement, preventSaveTargetNode: boolean = false): void {
    this.domAdapter.startDrag(event, draggedElement, parentElement, draggedElementNode, preventSaveTargetNode);
  }

  protected calculateDragOverLocation(
    clientX: number,
    clientY: number,
    dropTargetNode: HTMLElement
  ): DragTypeOverMeEnum {
    const rect = dropTargetNode.getBoundingClientRect();
    const tg = rect.height / rect.width;
    const dx = clientX - rect.x;
    const dy = clientY - rect.y;

    if(dy >= tg * dx) {
      if(dy >= - tg * dx + rect.height) {
        return DragTypeOverMeEnum.Bottom;
      }
      else {
        return DragTypeOverMeEnum.Left;
      }
    }
    else {
      if(dy >= - tg * dx + rect.height) {
        return DragTypeOverMeEnum.Right;
      }
      else {
        return DragTypeOverMeEnum.Top;
      }
    }
  }

  protected removeDragOverMarker(dropTarget: { dragTypeOverMe: any }): void {
    if (!!dropTarget) {
      dropTarget.dragTypeOverMe = null;
    }
  }

  protected dragOverLocation: DragTypeOverMeEnum;

  protected isDropTargetDoesntChanged(newIsBottom: boolean): boolean {
    return (
      this.dropTarget === this.prevDropTarget && newIsBottom === this.isBottom
    );
  }

  protected onStartDrag(): void {
  }

  public dragInit(event: PointerEvent, draggedElement: any, parentElement?: any, draggedElementNode?: HTMLElement): void {
    this.draggedElement = draggedElement;
    this.parentElement = parentElement;
    const shortcutText = this.getShortcutText(this.draggedElement);
    this.domAdapter.draggedElementShortcut = this.createDraggedElementShortcut(
      shortcutText,
      draggedElementNode,
      event
    );
    this.onStartDrag();
  }

  protected getShortcutText(draggedElement: IShortcutText): string {
    return draggedElement.shortcutText;
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode?: HTMLElement,
    event?: PointerEvent
  ): HTMLElement {
    const draggedElementShortcut = document.createElement("div");
    draggedElementShortcut.innerText = text;
    draggedElementShortcut.className = this.getDraggedElementClass();
    return draggedElementShortcut;
  }

  protected getDraggedElementClass() {
    return "sv-dragged-element-shortcut";
  }

  protected doDragOver(dropTargetNode?: HTMLElement, event?: PointerEvent): void { }
  protected duringDragOver(dropTargetNode?: HTMLElement, event?: PointerEvent): void { }
  protected afterDragOver(dropTargetNode?: HTMLElement, event?: PointerEvent): void { }

  // public getGhostPosition(item: any): string {
  //   if (this.dropTarget !== item) return null;
  //   if (this.isBottom) return "bottom";
  //   return "top";
  // }

  protected abstract isDropTargetValid(
    dropTarget: any,
    dropTargetNode?: HTMLElement
  ): boolean;

  protected banDropHere = (): void => {
    this.allowDropHere = false;
    this.doBanDropHere();
    this.dropTarget = null;
    this.domAdapter.draggedElementShortcut.style.cursor = "not-allowed";
    this.isBottom = null;
  };

  protected doBanDropHere = (): void => { };

  protected getDataAttributeValueByNode(node: HTMLElement) {
    let datasetName = "svDropTarget";
    const words = this.draggedElementType.split("-");
    words.forEach((word) => {
      datasetName += this.capitalizeFirstLetter(word);
    });
    return node.dataset[datasetName];
  }

  protected getDropTargetByNode(
    dropTargetNode: HTMLElement,
    event: PointerEvent
  ): any {
    let dataAttributeValue = this.getDataAttributeValueByNode(dropTargetNode);

    return this.getDropTargetByDataAttributeValue(
      dataAttributeValue,
      dropTargetNode,
      event
    );
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //TODO adandone unrequired params (survey-elements)
  protected abstract getDropTargetByDataAttributeValue(
    dataAttributeValue: string,
    dropTargetNode?: HTMLElement,
    event?: PointerEvent
  ): any;

  protected calculateVerticalMiddleOfHTMLElement(HTMLElement: HTMLElement): number {
    const rect = HTMLElement.getBoundingClientRect();
    return rect.y + rect.height / 2;
  }

  protected calculateHorizontalMiddleOfHTMLElement(HTMLElement: HTMLElement): number {
    const rect = HTMLElement.getBoundingClientRect();
    return rect.x + rect.width / 2;
  }

  protected abstract calculateIsBottom(
    clientY: number,
    dropTargetNode?: HTMLElement
  ): boolean;

  public findDropTargetNodeByDragOverNode(
    dragOverNode: HTMLElement
  ): HTMLElement {
    const dropTargetNode: HTMLElement = dragOverNode.closest(this.dropTargetDataAttributeName);
    return dropTargetNode;
  }

  public dragOver(dropTargetNode: HTMLElement, event: PointerEvent) {
    if (!dropTargetNode) {
      this.banDropHere();
      return;
    }

    this.removeDragOverMarker(this.dropTarget);
    this.dropTarget = this.getDropTargetByNode(dropTargetNode, event);

    const isDropTargetValid = this.isDropTargetValid(
      this.dropTarget,
      dropTargetNode
    );

    this.doDragOver(dropTargetNode, event);

    if (!isDropTargetValid) {
      this.banDropHere();
      return;
    }

    let isBottom = this.calculateIsBottom(event.clientY, dropTargetNode);
    this.dragOverLocation = this.calculateDragOverLocation(event.clientX, event.clientY, dropTargetNode);

    this.allowDropHere = true;

    this.duringDragOver(dropTargetNode, event);

    if (this.isDropTargetDoesntChanged(isBottom)) return;

    this.isBottom = null; //TODO need for property change trigger with guarantee but it would be better not to watch on isBottom property but have some event like onValidTargetDragOver
    this.isBottom = isBottom;

    this.afterDragOver(dropTargetNode, event);
    this.prevDropTarget = this.dropTarget;
  }

  protected abstract doDrop(): any;
  public drop(): void {
    if (this.allowDropHere) {
      const fromElement = this.draggedElement.parent;
      this.onDragStart.fire(this, { fromElement: fromElement, draggedElement: this.draggedElement });
      const newElement = this.doDrop();
      this.onDragEnd.fire(this, { fromElement: fromElement, draggedElement: newElement, toElement: this.dropTarget });
    }
  }

  public clear(): void {
    this.dropTarget = null;
    this.draggedElement = null;
    this.isBottom = null;
    this.parentElement = null;
  }
}
