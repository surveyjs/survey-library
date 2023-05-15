import { SurveyModel } from "../survey";
import { Base, EventBase } from "../base";
import { IShortcutText, ISurvey, ISurveyElement } from "../base-interfaces";
import { property } from "../jsonobject";
import { findScrollableParent, isShadowDOM } from "../utils/utils";
import { IsMobile, IsTouch } from "../utils/devices";
import { DragTypeOverMeEnum } from "../survey-element";
import { settings, ISurveyEnvironment } from "../settings";

// WebKit requires cancelable `touchmove` events to be added as early as possible
// see https://bugs.webkit.org/show_bug.cgi?id=184250
if(typeof window !== "undefined") {
  window.addEventListener(
    "touchmove",
    (event) => {
      if (!DragDropCore.PreventScrolling) {
        return;
      }

      // Prevent scrolling
      event.preventDefault();
    },
    { passive: false }
  );
}

export abstract class DragDropCore<T> {
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

  public static PreventScrolling = false;

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
  protected draggedElementShortcut: any = null;
  private scrollIntervalId: number = null;
  protected allowDropHere = false;

  constructor(private surveyValue?: ISurvey, private creator?: any, private longTap?: boolean) {
  }

  public startDrag(
    event: PointerEvent,
    draggedElement: any,
    parentElement?: any,
    draggedElementNode?: HTMLElement,
    preventSaveTargetNode: boolean = false
  ): void {
    if (IsTouch) {
      this.startLongTapProcessing(
        event,
        draggedElement,
        parentElement,
        draggedElementNode,
        preventSaveTargetNode
      );
      return;
    }
    this.doStartDrag(event, draggedElement, parentElement, draggedElementNode);
  }

  //long tap
  private timeoutID: any;
  private startX: number;
  private startY: number;
  private currentX: number;
  private currentY: number;
  // save event.target node from the frameworks update. See  https://stackoverflow.com/questions/33298828/touch-move-event-dont-fire-after-touch-start-target-is-removed
  private savedTargetNode: any;

  private startLongTapProcessing(
    event: PointerEvent,
    draggedElement: any,
    parentElement?: any,
    draggedElementNode?: HTMLElement,
    preventSaveTargetNode: boolean = false
  ): void {
    this.startX = event.pageX;
    this.startY = event.pageY;
    document.body.style.setProperty("touch-action", "none", "important");
    document.body.style.setProperty("user-select", "none", "important");
    document.body.style.setProperty("-webkit-user-select", "none", "important");

    this.timeoutID = setTimeout(() => {
      this.doStartDrag(
        event,
        draggedElement,
        parentElement,
        draggedElementNode
      );
      if (!preventSaveTargetNode) {
        this.savedTargetNode = event.target;
        this.savedTargetNode.style.cssText =
            `
          position: absolute;
          height: 1px!important;
          width: 1px!important;
          overflow: hidden;
          clip: rect(1px 1px 1px 1px);
          clip: rect(1px, 1px, 1px, 1px);
        `;
        settings.environment.rootElement.appendChild(this.savedTargetNode);
      }

      this.stopLongTap();
    }, this.longTap? 500: 0);

    document.addEventListener("pointerup", this.stopLongTap);
    document.addEventListener("pointermove", this.stopLongTapIfMoveEnough);
  }
  private stopLongTapIfMoveEnough = (pointerMoveEvent: PointerEvent) => {
    pointerMoveEvent.preventDefault();
    this.currentX = pointerMoveEvent.pageX;
    this.currentY = pointerMoveEvent.pageY;
    if (this.isMicroMovement) return;
    document.body.style.setProperty("touch-action", "");
    document.body.style.setProperty("user-select", "");
    document.body.style.setProperty("-webkit-user-select", "");
    this.stopLongTap();
  };
  // see https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
  private get isMicroMovement() {
    const delta = 5;
    const diffX = Math.abs(this.currentX - this.startX);
    const diffY = Math.abs(this.currentY - this.startY);
    return diffX < delta && diffY < delta;
  }
  private stopLongTap = (e?: any) => {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
    document.removeEventListener("pointerup", this.stopLongTap);
    document.removeEventListener("pointermove", this.stopLongTapIfMoveEnough);
  };
  // EO long tap

  private doStartDrag(
    event: PointerEvent,
    draggedElement: any,
    parentElement?: any,
    draggedElementNode?: HTMLElement
  ): void {
    if (IsTouch) {
      DragDropCore.PreventScrolling = true;
    }
    if (event.which === 3) return; //right mouse btn

    this.draggedElement = draggedElement;
    this.parentElement = parentElement;

    this.onStartDrag();

    const shortcutText = this.getShortcutText(this.draggedElement);
    this.draggedElementShortcut = this.createDraggedElementShortcut(
      shortcutText,
      draggedElementNode,
      event
    );
    document.body.append(this.draggedElementShortcut);
    this.moveShortcutElement(event);

    document.addEventListener("pointermove", this.dragOver);
    document.addEventListener("pointercancel", this.handlePointerCancel);
    document.addEventListener("keydown", this.handleEscapeButton);
    document.addEventListener("pointerup", this.drop);
    if (!IsTouch) {
      this.draggedElementShortcut.addEventListener("pointerup", this.drop);
    } else {
      this.draggedElementShortcut.addEventListener("contextmenu", this.onContextMenu);
    }
  }

  private onContextMenu = (event:any) => {
    event.preventDefault();
    event.stopPropagation();
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

  private dragOver = (event: PointerEvent) => {
    this.moveShortcutElement(event);
    this.draggedElementShortcut.style.cursor = "grabbing";

    const dropTargetNode = this.findDropTargetNodeFromPoint(
      event.clientX,
      event.clientY
    );

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
  };

  private drop = () => {
    if (this.allowDropHere) {
      const fromElement = this.draggedElement.parent;
      this.onDragStart.fire(this, { fromElement: fromElement, draggedElement: this.draggedElement });
      const newElement = this.doDrop();
      this.onDragEnd.fire(this, { fromElement: fromElement, draggedElement: newElement, toElement: this.dropTarget });
    }

    this.clear();
  };

  protected isDropTargetDoesntChanged(newIsBottom: boolean): boolean {
    return (
      this.dropTarget === this.prevDropTarget && newIsBottom === this.isBottom
    );
  }

  protected onStartDrag(): void { }

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

  private handlePointerCancel = (event: PointerEvent) => {
    this.clear();
  };

  protected handleEscapeButton = (event: KeyboardEvent) => {
    if (event.keyCode == 27) {
      this.clear();
    }
  };

  private moveShortcutElement(event: PointerEvent) {
    this.doScroll(event.clientY, event.clientX);

    const shortcutHeight = this.draggedElementShortcut.offsetHeight;
    const shortcutWidth = this.draggedElementShortcut.offsetWidth;
    let shortcutXOffset = this.draggedElementShortcut.shortcutXOffset || shortcutWidth / 2;
    let shortcutYOffset = this.draggedElementShortcut.shortcutYOffset || shortcutHeight / 2;

    // TODO this is hot fix for RTL support. Probably we need better global strategy for it. https://github.com/surveyjs/survey-library/issues/4554
    if (document.querySelectorAll("[dir='rtl']").length !== 0) {
      shortcutXOffset = shortcutWidth / 2;
      shortcutYOffset = shortcutHeight / 2;
    }

    const documentBottom = (isShadowDOM(settings.environment.root) ? settings.environment.root.host : settings.environment.root.documentElement).clientHeight;
    const documentRight = (isShadowDOM(settings.environment.root) ? settings.environment.root.host : settings.environment.root.documentElement).clientWidth;
    const shortcutBottomCoordinate = this.getShortcutBottomCoordinate(event.clientY, shortcutHeight, shortcutYOffset);
    const shortcutRightCoordinate = this.getShortcutRightCoordinate(event.clientX, shortcutWidth, shortcutXOffset);

    if (shortcutRightCoordinate >= documentRight) {
      this.draggedElementShortcut.style.left =
        event.pageX -
        event.clientX +
        documentRight -
        shortcutWidth +
        "px";
      this.draggedElementShortcut.style.top =
        event.pageY - shortcutYOffset + "px";
      return;
    }

    if (event.clientX - shortcutXOffset <= 0) {
      this.draggedElementShortcut.style.left =
        event.pageX - event.clientX + "px";
      this.draggedElementShortcut.style.top =
        event.pageY - shortcutYOffset + "px";
      return;
    }

    if (shortcutBottomCoordinate >= documentBottom) {
      this.draggedElementShortcut.style.left =
        event.pageX - shortcutXOffset + "px";
      this.draggedElementShortcut.style.top =
        event.pageY -
        event.clientY +
        documentBottom -
        shortcutHeight +
        "px";
      return;
    }

    if (event.clientY - shortcutYOffset <= 0) {
      this.draggedElementShortcut.style.left =
        event.pageX - shortcutXOffset + "px";
      this.draggedElementShortcut.style.top =
        event.pageY - event.clientY + "px";
      return;
    }

    this.draggedElementShortcut.style.left =
      event.pageX - shortcutXOffset + "px";
    this.draggedElementShortcut.style.top =
      event.pageY - shortcutYOffset + "px";
  }

  private getShortcutBottomCoordinate(currentY: number, shortcutHeight: number, shortcutYOffset: number):number {
    return currentY + shortcutHeight - shortcutYOffset;
  }

  private getShortcutRightCoordinate(currentX: number, shortcutWidth: number, shortcutXOffset: number):number {
    return currentX + shortcutWidth - shortcutXOffset;
  }

  private doScroll(clientY: number, clientX: number) {
    cancelAnimationFrame(this.scrollIntervalId);
    const startScrollBoundary = 50;

    this.draggedElementShortcut.hidden = true;
    let dragOverNode = <HTMLElement>document.elementFromPoint(clientX, clientY);
    this.draggedElementShortcut.hidden = false;

    let scrollableParentNode = findScrollableParent(dragOverNode);

    let top: number;
    let bottom: number;
    let left: number;
    let right: number;

    if (scrollableParentNode.tagName === "HTML") {
      top = 0;
      bottom = document.documentElement.clientHeight;
      left = 0;
      right = document.documentElement.clientWidth;
    } else {
      top = scrollableParentNode.getBoundingClientRect().top;
      bottom = scrollableParentNode.getBoundingClientRect().bottom;
      left = scrollableParentNode.getBoundingClientRect().left;
      right = scrollableParentNode.getBoundingClientRect().right;
    }

    const repeat = () => {
      if (clientY - top <= startScrollBoundary) {
        scrollableParentNode.scrollTop -= 15;
      } else if (bottom - clientY <= startScrollBoundary) {
        scrollableParentNode.scrollTop += 15;
      } else if (right - clientX <= startScrollBoundary) {
        scrollableParentNode.scrollLeft += 15;
      } else if (clientX - left <= startScrollBoundary) {
        scrollableParentNode.scrollLeft -= 15;
      }
      this.scrollIntervalId = requestAnimationFrame(repeat);
    };
    this.scrollIntervalId = requestAnimationFrame(repeat);
  }

  protected banDropHere = (): void => {
    this.allowDropHere = false;
    this.doBanDropHere();
    this.dropTarget = null;
    this.draggedElementShortcut.style.cursor = "not-allowed";
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

  private findDropTargetNodeFromPoint(
    clientX: number,
    clientY: number
  ): HTMLElement {
    this.draggedElementShortcut.hidden = true;
    let dragOverNode = <HTMLElement>document.elementFromPoint(clientX, clientY);
    this.draggedElementShortcut.hidden = false;

    if (!dragOverNode) return null;

    return this.findDropTargetNodeByDragOverNode(dragOverNode);
  }

  protected findDropTargetNodeByDragOverNode(
    dragOverNode: HTMLElement
  ): HTMLElement {
    const dropTargetNode: HTMLElement = dragOverNode.closest(this.dropTargetDataAttributeName);
    return dropTargetNode;
  }
  protected abstract doDrop(): any;

  protected clear = () => {
    cancelAnimationFrame(this.scrollIntervalId);

    document.removeEventListener("pointermove", this.dragOver);
    document.removeEventListener("pointercancel", this.handlePointerCancel);
    document.removeEventListener("keydown", this.handleEscapeButton);
    document.removeEventListener("pointerup", this.drop);
    this.draggedElementShortcut.removeEventListener("pointerup", this.drop);
    if (IsTouch) {
      this.draggedElementShortcut.removeEventListener("contextmenu", this.onContextMenu);
    }
    settings.environment.rootElement.removeChild(this.draggedElementShortcut);

    this.doClear();

    this.dropTarget = null;

    this.draggedElementShortcut = null;
    this.draggedElement = null;
    this.isBottom = null;
    this.parentElement = null;
    this.scrollIntervalId = null;

    if (IsTouch) {
      this.savedTargetNode && settings.environment.rootElement.removeChild(this.savedTargetNode);
      DragDropCore.PreventScrolling = false;
    }
    document.body.style.setProperty("touch-action", "");
    document.body.style.setProperty("user-select", "");
    document.body.style.setProperty("-webkit-user-select", "");
  };

  protected doClear(): void { }
}
