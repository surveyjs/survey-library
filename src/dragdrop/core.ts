import { SurveyModel } from "../survey";
import { Base, EventBase } from "../base";
import { IShortcutText, ISurvey } from "../base-interfaces";
import { property } from "../jsonobject";
import { findScrollableParent } from "../utils/utils";
import { IsMobile } from "../utils/is-mobile";

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

export abstract class DragDropCore<T> extends Base {
  @property({
    defaultValue: null,
    onSet: (val, target: DragDropCore<T>) => {
      target.ghostPositionChanged();
    },
  })
  isBottom: boolean; //TODO rename isBottom to isShowGhostAtBottomOfDropTarget
  public onGhostPositionChanged: EventBase<Base> = new EventBase<Base>();
  protected ghostPositionChanged(): void {
    this.onGhostPositionChanged.fire({}, {});
  }

  public static PreventScrolling = false;

  public onBeforeDrop: EventBase<DragDropCore<T>> = new EventBase();
  public onAfterDrop: EventBase<DragDropCore<T>> = new EventBase();

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

  private preventScrolling = false;
  constructor(private surveyValue?: ISurvey, private creator?: any) {
    super();
  }

  public startDrag(
    event: PointerEvent,
    draggedElement: any,
    parentElement?: any,
    draggedElementNode?: HTMLElement
  ): void {
    if (IsMobile) {
      this.startLongTapProcessing(
        event,
        draggedElement,
        parentElement,
        draggedElementNode
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
    draggedElementNode?: HTMLElement
  ): void {
    this.startX = event.pageX;
    this.startY = event.pageY;

    this.timeoutID = setTimeout(() => {
      this.doStartDrag(
        event,
        draggedElement,
        parentElement,
        draggedElementNode
      );
      this.savedTargetNode = event.target;
      this.savedTargetNode.className = "sv-visuallyhidden";
      document.body.appendChild(this.savedTargetNode);
      this.stopLongTap();
    }, 500);

    document.addEventListener("pointerup", this.stopLongTap);
    document.addEventListener("pointermove", this.stopLongTapIfMoveEnough);
  }
  private stopLongTapIfMoveEnough = (pointerMoveEvent: PointerEvent) => {
    pointerMoveEvent.preventDefault();
    this.currentX = pointerMoveEvent.pageX;
    this.currentY = pointerMoveEvent.pageY;
    if (this.isMicroMovement) return;
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
    if (IsMobile) {
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
    if (!IsMobile) {
      this.draggedElementShortcut.addEventListener("pointerup", this.drop);
    }
  }

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

    this.dropTarget = this.getDropTargetByNode(dropTargetNode, event);

    const isDropTargetValid = this.isDropTargetValid(
      this.dropTarget,
      dropTargetNode
    );

    this.doDragOver(dropTargetNode);

    if (!isDropTargetValid) {
      this.banDropHere();
      return;
    }

    let isBottom = this.calculateIsBottom(event.clientY, dropTargetNode);

    this.allowDropHere = true;
    if (this.isDropTargetDoesntChanged(isBottom)) return;

    this.isBottom = null; //TODO need for property change trigger with guarantee but it would be better not to watch on isBottom property but have some event like onValidTargetDragOver
    this.isBottom = isBottom;
    this.afterDragOver(dropTargetNode);
    this.prevDropTarget = this.dropTarget;
  };

  private drop = () => {
    if (this.allowDropHere) {
      this.onBeforeDrop.fire(this, null);
      const newElement = this.doDrop();
      this.onAfterDrop.fire(this, { draggedElement: newElement });
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

  protected doDragOver(dropTargetNode?: HTMLElement): void { }
  protected afterDragOver(dropTargetNode?: HTMLElement): void { }

  public getGhostPosition(item: any): string {
    if (this.dropTarget !== item) return null;
    if (this.isBottom) return "bottom";
    return "top";
  }

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
    let shortcutXOffset;
    let shortcutYOffset;

    if (!!this.draggedElementShortcut.shortcutXOffset) {
      shortcutXOffset = this.draggedElementShortcut.shortcutXOffset;
      shortcutYOffset = this.draggedElementShortcut.shortcutYOffset;
    } else {
      shortcutXOffset = shortcutWidth / 2;
      shortcutYOffset = shortcutHeight / 2;
    }

    const documentClientHeight = document.documentElement.clientHeight;
    const documentClientWidth = document.documentElement.clientWidth;

    if (event.clientX + shortcutXOffset >= documentClientWidth) {
      this.draggedElementShortcut.style.left =
        event.pageX -
        event.clientX +
        documentClientWidth -
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

    if (event.clientY + shortcutYOffset >= documentClientHeight) {
      this.draggedElementShortcut.style.left =
        event.pageX - shortcutXOffset + "px";
      this.draggedElementShortcut.style.top =
        event.pageY -
        event.clientY +
        documentClientHeight -
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

  protected calculateMiddleOfHTMLElement(HTMLElement: HTMLElement): number {
    const rect = HTMLElement.getBoundingClientRect();
    return rect.y + rect.height / 2;
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
    const result: HTMLElement =
      dragOverNode.querySelector(this.dropTargetDataAttributeName) ||
      dragOverNode.closest(this.dropTargetDataAttributeName);

    return result;
  }
  protected abstract doDrop(): any;

  protected clear = () => {
    cancelAnimationFrame(this.scrollIntervalId);

    document.removeEventListener("pointermove", this.dragOver);
    document.removeEventListener("pointercancel", this.handlePointerCancel);
    document.removeEventListener("keydown", this.handleEscapeButton);
    document.removeEventListener("pointerup", this.drop);
    this.draggedElementShortcut.removeEventListener("pointerup", this.drop);
    document.body.removeChild(this.draggedElementShortcut);

    this.doClear();

    this.dropTarget = null;

    this.draggedElementShortcut = null;
    this.draggedElement = null;
    this.isBottom = null;
    this.parentElement = null;
    this.scrollIntervalId = null;

    if (IsMobile) {
      document.body.removeChild(this.savedTargetNode);
      DragDropCore.PreventScrolling = false;
    }
  };

  protected doClear(): void { }
}
