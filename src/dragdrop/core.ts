import { Base, EventBase } from "../base";
import { ISurvey } from "../base-interfaces";
import { property } from "../jsonobject";

export abstract class DragDropCore extends Base {
  @property() isBottom: boolean = null; //TODO rename isBottom to isShowGhostAtBottomOfDropTarget

  public onBeforeDrop: EventBase<DragDropCore> = new EventBase();
  public onAfterDrop: EventBase<DragDropCore> = new EventBase();

  protected draggedElement: any = null;
  protected abstract get draggedElementType(): string;
  protected parentElement: any;
  protected dropTarget: any = null;
  protected get dropTargetDataAttributeName() {
    return `[data-sv-drop-target-${this.draggedElementType}]`;
  }
  protected get survey() {
    return this.surveyValue || this.creator.survey;
  }

  protected prevDropTarget: any = null;
  private draggedElementShortcut: HTMLElement = null;
  private scrollIntervalId: number = null;
  private allowDropHere = false;

  constructor(private surveyValue?: ISurvey, private creator?: any) {
    super();
  }

  public startDrag(
    event: PointerEvent,
    draggedElement: any,
    parentElement?: any
  ) {
    this.draggedElement = draggedElement;
    this.parentElement = parentElement;

    this.doStartDrag();

    const shortcutText = this.getShortcutText(this.draggedElement);
    this.draggedElementShortcut = this.createDraggedElementShortcut(
      shortcutText
    );
    document.body.append(this.draggedElementShortcut);
    this.moveShortcutElement(event);

    document.addEventListener("pointermove", this.dragOver);
    document.addEventListener("keydown", this.handleEscapeButton);
    this.draggedElementShortcut.addEventListener("pointerup", this.drop);
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

    let isBottom = this.calculateIsBottom(event.clientY, dropTargetNode);

    const isDropTargetValid = this.isDropTargetValid(this.dropTarget, isBottom);

    if (this.dropTarget === this.draggedElement || !isDropTargetValid) {
      this.banDropHere();
      return;
    }

    this.allowDropHere = true;
    if (this.isDropTargetDoesntChanged(isBottom)) return;

    this.isBottom = null; //TODO need for property change trigger with guarantee but it would be better not to watch on isBottom property but reate some event like onValidTargetDragOver
    this.isBottom = isBottom;
    this.doDragOver();
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

  public getGhostPosition(item: any) {
    if (this.dropTarget !== item) return null;
    if (this.isBottom) return "bottom";
    return "top";
  }

  protected isDropTargetDoesntChanged(newIsBottom: boolean) {
    return (
      this.dropTarget === this.prevDropTarget && newIsBottom === this.isBottom
    );
  }

  protected doStartDrag() {}
  protected abstract getShortcutText(draggedElement: any): string;

  private createDraggedElementShortcut(text: string) {
    const draggedElementShortcut = document.createElement("div");
    draggedElementShortcut.innerText = text;
    draggedElementShortcut.style.cssText =
      "height: 24px; min-width: 100px; border-radius: 36px; background-color: white; padding: 16px; cursor: grabbing; position: absolute; z-index: 1000; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); font-family: 'Open Sans'; font-size: 16px; padding-left: 20px; line-height: 24px;";
    return draggedElementShortcut;
  }

  protected doDragOver(): void {}

  protected abstract isDropTargetValid(
    dropTarget: any,
    isBottom: boolean
  ): boolean;

  private handleEscapeButton = (event: KeyboardEvent) => {
    if (event.keyCode == 27) {
      this.clear();
    }
  };

  private moveShortcutElement(event: PointerEvent) {
    this.doScroll(event.clientY, event.clientX);

    const shortcutHeight = this.draggedElementShortcut.offsetHeight;
    const shortcutWidth = this.draggedElementShortcut.offsetWidth;
    const shortcutXCenter = shortcutWidth / 2;
    const shortcutYCenter = shortcutHeight / 2;

    const documentClientHeight = document.documentElement.clientHeight;
    const documentClientWidth = document.documentElement.clientWidth;

    if (event.clientX + shortcutXCenter >= documentClientWidth) {
      this.draggedElementShortcut.style.left =
        event.pageX -
        event.clientX +
        documentClientWidth -
        shortcutWidth +
        "px";
      this.draggedElementShortcut.style.top =
        event.pageY - shortcutYCenter + "px";
      return;
    }

    if (event.clientX - shortcutXCenter <= 0) {
      this.draggedElementShortcut.style.left =
        event.pageX - event.clientX + "px";
      this.draggedElementShortcut.style.top =
        event.pageY - shortcutYCenter + "px";
      return;
    }

    if (event.clientY + shortcutYCenter >= documentClientHeight) {
      this.draggedElementShortcut.style.left =
        event.pageX - shortcutXCenter + "px";
      this.draggedElementShortcut.style.top =
        event.pageY -
        event.clientY +
        documentClientHeight -
        shortcutHeight +
        "px";
      return;
    }

    if (event.clientY - shortcutYCenter <= 0) {
      this.draggedElementShortcut.style.left =
        event.pageX - shortcutXCenter + "px";
      this.draggedElementShortcut.style.top =
        event.pageY - event.clientY + "px";
      return;
    }

    this.draggedElementShortcut.style.left =
      event.pageX - shortcutXCenter + "px";
    this.draggedElementShortcut.style.top =
      event.pageY - shortcutYCenter + "px";
  }

  private doScroll(clientY: number, clientX: number) {
    cancelAnimationFrame(this.scrollIntervalId);
    const startScrollBoundary = 50;

    // need to import getScrollableParent method
    // let scrollableParentNode = getScrollableParent(dropTragetNode)
    //   .parentNode;
    let scrollableParentNode =
      document.querySelector(".svc-tab-designer.sd-root-modern") ||
      document.querySelector(".sv-root-modern") ||
      document.querySelector(".sv_container");

    let top = scrollableParentNode.getBoundingClientRect().top;
    let bottom = scrollableParentNode.getBoundingClientRect().bottom;
    let left = scrollableParentNode.getBoundingClientRect().left;
    let right = scrollableParentNode.getBoundingClientRect().right;

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

  protected banDropHere = () => {
    this.doBanDropHere();
    this.allowDropHere = false;
    this.dropTarget = null;
    this.draggedElementShortcut.style.cursor = "not-allowed";
    this.isBottom = null;
  };

  protected doBanDropHere = () => {};

  private getDataAttributeValueByNode(node: HTMLElement) {
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
  ) {
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
    dataAttributeValue: any,
    dropTargetNode?: HTMLElement,
    event?: PointerEvent
  ): any;

  protected calculateMiddleOfHTMLElement(HTMLElement: HTMLElement) {
    const rect = HTMLElement.getBoundingClientRect();
    return rect.y + rect.height / 2;
  }

  protected calculateIsBottom(
    clientY: number,
    dropTargetNode?: HTMLElement
  ): boolean {
    const middle = this.calculateMiddleOfHTMLElement(dropTargetNode);
    return clientY >= middle;
  }

  private findDropTargetNodeFromPoint(
    clientX: number,
    clientY: number
  ): HTMLElement {
    this.draggedElementShortcut.hidden = true;
    let dragOverNode = document.elementFromPoint(clientX, clientY);
    this.draggedElementShortcut.hidden = false;

    if (!dragOverNode) return null;

    return (
      dragOverNode.querySelector(this.dropTargetDataAttributeName) ||
      dragOverNode.closest(this.dropTargetDataAttributeName)
    );
  }

  protected abstract doDrop(): any;

  private clear = () => {
    cancelAnimationFrame(this.scrollIntervalId);

    document.removeEventListener("pointermove", this.dragOver);
    document.removeEventListener("keydown", this.handleEscapeButton);
    this.draggedElementShortcut.removeEventListener("pointerup", this.drop);
    document.body.removeChild(this.draggedElementShortcut);

    this.doClear();

    this.dropTarget = null;
    this.dropTarget = null;

    this.draggedElementShortcut = null;
    this.draggedElement = null;
    this.parentElement = null;
    this.isBottom = null;
    this.scrollIntervalId = null;
  };

  protected doClear() {}
}
