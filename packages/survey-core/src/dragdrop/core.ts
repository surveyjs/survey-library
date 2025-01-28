import { SurveyModel } from "../survey";
import { Base, EventBase } from "../base";
import { IShortcutText, ISurvey, ISurveyElement } from "../base-interfaces";
import { DragTypeOverMeEnum } from "../survey-element";
import { IDragDropEngine } from "./engine";
import { DragDropDOMAdapter, IDragDropDOMAdapter } from "./dom-adapter";
import { DomDocumentHelper } from "../global_variables_utils";

export abstract class DragDropCore<T> implements IDragDropEngine {
  private _isBottom: boolean = null;
  public get isBottom(): boolean { //TODO rename isBottom to isShowGhostAtBottomOfDropTarget
    return !!this._isBottom;
  }
  public set isBottom(val: boolean) {
    this._isBottom = val;
    this.ghostPositionChanged();
  }
  public onGhostPositionChanged: EventBase<{}> = new EventBase<{}>();
  protected ghostPositionChanged(): void {
    this.onGhostPositionChanged.fire(<any>{}, {});
  }

  public onDragStart: EventBase<DragDropCore<T>> = new EventBase();
  public onDragEnd: EventBase<DragDropCore<T>> = new EventBase();
  public onDragClear: EventBase<DragDropCore<T>> = new EventBase();
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
    return this.surveyValue || this.creator?.survey;
  }

  public prevDropTarget: any = null;
  protected allowDropHere = false;

  protected domAdapter: IDragDropDOMAdapter;
  constructor(private surveyValue?: ISurvey, private creator?: any, longTap?: boolean, domAdapter?: IDragDropDOMAdapter) {
    this.domAdapter = domAdapter || new DragDropDOMAdapter(this, longTap, this.survey?.fitToContainer);
  }

  public startDrag(event: PointerEvent, draggedElement: any, parentElement?: any, draggedElementNode?: HTMLElement, preventSaveTargetNode: boolean = false): void {
    this.domAdapter.rootContainer = this.getRootElement(this.survey, this.creator);
    this.domAdapter.startDrag(event, draggedElement, parentElement, draggedElementNode, preventSaveTargetNode);
  }

  private getRootElement(survey: SurveyModel, creator: any): HTMLElement {
    return creator ? creator.rootElement : survey.rootElement;
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
    this.onStartDrag(event);
    const fromElement = this.draggedElement && this.draggedElement.parent;
    this.onDragStart.fire(this, { fromElement: fromElement, draggedElement: this.draggedElement });
  }

  protected onStartDrag(event?: PointerEvent): void {
  }

  protected isDropTargetDoesntChanged(newIsBottom: boolean): boolean {
    return (
      this.dropTarget === this.prevDropTarget && newIsBottom === this.isBottom
    );
  }

  protected getShortcutText(draggedElement: IShortcutText): string {
    return draggedElement?.shortcutText;
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode?: HTMLElement,
    event?: PointerEvent
  ): HTMLElement {
    const draggedElementShortcut = DomDocumentHelper.createElement("div");
    if (!!draggedElementShortcut) {
      draggedElementShortcut.innerText = text;
      draggedElementShortcut.className = this.getDraggedElementClass();
    }
    return draggedElementShortcut;
  }

  protected getDraggedElementClass() {
    return "sv-dragged-element-shortcut";
  }

  protected doDragOver(): void { }
  protected afterDragOver(dropTargetNode: HTMLElement): void { }

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

  protected findDropTargetNodeFromPoint(clientX: number, clientY: number): HTMLElement {
    const displayProp = this.domAdapter.draggedElementShortcut.style.display;
    this.domAdapter.draggedElementShortcut.style.display = "none";

    if (!DomDocumentHelper.isAvailable()) return null;

    let dragOverNodes = <Array<HTMLElement>>this.domAdapter.documentOrShadowRoot.elementsFromPoint(clientX, clientY);
    this.domAdapter.draggedElementShortcut.style.display = displayProp || "block";

    let index = 0;
    let dragOverNode: HTMLElement = dragOverNodes[index];
    while (dragOverNode && dragOverNode.className && typeof dragOverNode.className.indexOf == "function" && dragOverNode.className.indexOf("sv-drag-target-skipped") != -1) {
      index++;
      dragOverNode = dragOverNodes[index];
    }

    if (!dragOverNode) return null;

    return this.findDropTargetNodeByDragOverNode(dragOverNode);
  }

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

  protected calculateIsBottom(clientY: number, dropTargetNode?: HTMLElement): boolean {
    return false;
  }

  protected findDropTargetNodeByDragOverNode(dragOverNode: HTMLElement): HTMLElement {
    const dropTargetNode: HTMLElement = dragOverNode.closest(this.dropTargetDataAttributeName);
    return dropTargetNode;
  }

  public dragOver(event: PointerEvent): void {
    const dropTargetNode = this.findDropTargetNodeFromPoint(
      event.clientX,
      event.clientY
    );

    if (!dropTargetNode) {
      this.banDropHere();
      return;
    }

    this.dropTarget = this.getDropTargetByNode(dropTargetNode, event);

    const isDropTargetValid = this.isDropTargetValid(
      this.dropTarget,
      dropTargetNode
    );

    this.doDragOver();

    if (!isDropTargetValid) {
      this.banDropHere();
      return;
    }

    let isBottom = this.calculateIsBottom(event.clientY, dropTargetNode);

    this.allowDropHere = true;

    if (this.isDropTargetDoesntChanged(isBottom)) return;

    this.isBottom = null; //TODO need for property change trigger with guarantee but it would be better not to watch on isBottom property but have some event like onValidTargetDragOver
    this.isBottom = isBottom;
    if (this.draggedElement != this.dropTarget) {
      this.afterDragOver(dropTargetNode);
    }
    this.prevDropTarget = this.dropTarget;
  }

  protected abstract doDrop(): any;
  public drop(): void {
    if (this.allowDropHere) {
      const fromElement = this.draggedElement.parent;
      const newElement = this.doDrop();
      this.onDragEnd.fire(this, { fromElement: fromElement, draggedElement: newElement, toElement: this.dropTarget });
    }
  }

  public clear(): void {
    const options = {
      draggedElement: this.draggedElement
    };
    this.dropTarget = null;
    this.prevDropTarget = null;
    this.draggedElement = null;
    this.isBottom = null;
    this.parentElement = null;
    this.onDragClear.fire(this, options);
  }
}
