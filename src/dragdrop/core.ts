import { Base, EventBase } from "../base";
import { IElement, ISurvey } from "../base-interfaces";
import { JsonObject, property, Serializer } from "../jsonobject";

export abstract class DragDropCore extends Base {
  public onBeforeDrop: EventBase<DragDropCore> = new EventBase();
  public onAfterDrop: EventBase<DragDropCore> = new EventBase();

  public static edgeHeight: number = 30;
  public static nestedPanelDepth: number = -1;
  public static prevEvent: any = {
    element: null,
    x: -1,
    y: -1,
  };

  public static ghostSurveyElementName =
    "sv-drag-drop-ghost-survey-element-name"; // before renaming use globa search (we have also css selectors)

  protected draggedElement: any = null;
  protected dropTarget: any = null;
  protected dropTargetNode: HTMLElement = null;
  protected dropTargetCandidate: IElement = null;
  protected dropTargetNodeCandidate: HTMLElement = null;

  private draggedElementShortcut: HTMLElement = null;
  private scrollIntervalId: ReturnType<typeof setTimeout> = null;
  protected ghostSurveyElement: IElement = null;
  @property() isBottom: boolean = null;

  protected allowDropHere = false;

  protected isItemValueBeingDragged() {
    return Serializer.isDescendantOf(
      this.draggedElement.getType(),
      "itemvalue"
    );
  }

  protected get dropTargetDataAttributeName() {
    return `[data-sv-drop-target-${this.draggedElementType}]`;
  }

  protected getDropTargetName(element: HTMLElement) {
    let datasetName = "svDropTarget";
    const words = this.draggedElementType.split("-");
    words.forEach((word) => {
      datasetName += this.capitalizeFirstLetter(word);
    });
    return element.dataset[datasetName];
  }

  public parentElement: any;
  protected abstract get draggedElementType(): string;

  constructor(private surveyValue?: ISurvey, private creator?: any) {
    super();
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public get survey() {
    return this.surveyValue || this.creator.survey;
  }

  public startDragToolboxItem(
    event: PointerEvent,
    draggedElementJson: JsonObject
  ) {
    const draggedElement = this.createElementFromJson(draggedElementJson);
    this.startDrag(event, draggedElement);
  }

  public startDrag(
    event: PointerEvent,
    draggedElement: any,
    parentElement?: any
  ) {
    this.draggedElement = draggedElement;
    this.parentElement = parentElement;

    this.doStartDrag();
    this.draggedElementShortcut = this.createDraggedElementShortcut();

    document.body.append(this.draggedElementShortcut);
    this.moveShortcutElement(event);

    document.addEventListener("pointermove", this.moveDraggedElement);
    document.addEventListener("keydown", this.handleEscapeButton);
    this.draggedElementShortcut.addEventListener("pointerup", this.drop);
  }

  protected doStartDrag() {}

  public getGhostPosition(item: any) {
    if (this.dropTargetCandidate !== item) return null;
    if (this.isBottom) return "bottom";
    return "top";
  }

  private createDraggedElementShortcut() {
    const draggedElementShortcut = document.createElement("div");
    draggedElementShortcut.innerText = this.getShortcutText();
    draggedElementShortcut.style.cssText =
      "height: 24px; min-width: 100px; border-radius: 36px; background-color: white; padding: 16px; cursor: grabbing; position: absolute; z-index: 1000; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); font-family: 'Open Sans'; font-size: 16px; text-align: center; line-height: 24px;";
    return draggedElementShortcut;
  }

  protected abstract getShortcutText(): string;

  protected moveDraggedElement = (event: PointerEvent) => {
    this.moveShortcutElement(event);
    this.draggedElementShortcut.style.cursor = "grabbing";
    this.dragOver(event);
  };

  protected dragOver(event: PointerEvent) {
    this.dropTargetNodeCandidate = this.findDropTargetNodeFromPoint(
      event.clientX,
      event.clientY
    );

    this.dropTargetCandidate = this.getDropTargetFromNode(
      this.dropTargetNodeCandidate
    );

    if (!this.dropTargetCandidate) {
      this.allowDropHere = false;
      this.banDropHere();
      return;
    }
    this.allowDropHere = true;

    let isBottom = this.calculateIsBottom(event.clientY);

    const isDropTargetValid = this.isDropTargetValid(
      this.dropTargetCandidate,
      isBottom
    );

    if (
      !isDropTargetValid &&
      this.dropTargetCandidate === this.dropTarget &&
      isBottom === this.isBottom
    )
      return;

    this.isBottom = isBottom;
    this.dropTarget = this.dropTargetCandidate;
    this.doDragOverAfter(this.dropTarget, isBottom);
  }

  protected doDragOverAfter(dropTarget: any, isBottom: boolean): void {}

  protected isDropTargetValid(dropTarget: any, isBottom: boolean): boolean {
    return true;
  }

  private handleEscapeButton = (event: KeyboardEvent) => {
    if (event.keyCode == 27) {
      this.clear();
    }
  };

  protected moveShortcutElement(event: PointerEvent) {
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
    clearInterval(this.scrollIntervalId);
    const startScrollBoundary = 50;

    // need to import getScrollableParent method
    // let scrollableParentElement = getScrollableParent(dropZoneElement)
    //   .parentNode;
    let scrollableParentElement =
      document.querySelector(".svc-tab-designer.sd-root-modern") ||
      document.querySelector(".sv-root-modern") ||
      document.querySelector(".sv_container");

    let top = scrollableParentElement.getBoundingClientRect().top;
    let bottom = scrollableParentElement.getBoundingClientRect().bottom;
    let left = scrollableParentElement.getBoundingClientRect().left;
    let right = scrollableParentElement.getBoundingClientRect().right;

    if (clientY - top <= startScrollBoundary) {
      this.scrollIntervalId = setInterval(() => {
        scrollableParentElement.scrollTop -= 5;
      }, 10);
    } else if (bottom - clientY <= startScrollBoundary) {
      this.scrollIntervalId = setInterval(() => {
        scrollableParentElement.scrollTop += 5;
      }, 10);
    } else if (right - clientX <= startScrollBoundary) {
      this.scrollIntervalId = setInterval(() => {
        scrollableParentElement.scrollLeft += 5;
      }, 10);
    } else if (clientX - left <= startScrollBoundary) {
      this.scrollIntervalId = setInterval(() => {
        scrollableParentElement.scrollLeft -= 5;
      }, 10);
    }
  }

  protected banDropHere = () => {
    this.doBanDropHere();
    this.dropTarget = null;
    this.isBottom = null;
    this.draggedElementShortcut.style.cursor = "not-allowed";
  };

  protected doBanDropHere = () => {};

  protected getDropTargetFromNode(dropTargetNode: HTMLElement) {
    if (!dropTargetNode) return null;
    let dropTarget = null;
    let dropTargetName = this.getDropTargetName(dropTargetNode);
    let isDragOverInnerPanel = false;

    if (!dropTargetName) {
      const nearestDropTargetElement = dropTargetNode.parentElement.closest<
        HTMLElement
      >(this.dropTargetDataAttributeName);
      dropTargetName = this.getDropTargetName(nearestDropTargetElement);
      isDragOverInnerPanel =
        nearestDropTargetElement !== dropTargetNode && !!dropTargetName;
    }
    if (!dropTargetName) {
      throw new Error("Can't find drop target survey element name");
    }

    if (dropTargetName === DragDropCore.ghostSurveyElementName) {
      return this.ghostSurveyElement;
    }

    dropTarget = this.getDropTargetByName(
      dropTargetName,
      isDragOverInnerPanel,
      dropTargetNode
    );

    if (dropTarget === this.draggedElement) return null;

    return dropTarget;
  }

  protected abstract getDropTargetByName(
    dropTargetName: any,
    isDragOverInnerPanel?: boolean,
    dropTargetNode?: HTMLElement
  ): any;

  protected calculateMiddleOfHTMLElement(HTMLElement: HTMLElement) {
    const rect = HTMLElement.getBoundingClientRect();
    return rect.y + rect.height / 2;
  }

  protected calculateIsBottom(clientY: number): boolean {
    const middle = this.calculateMiddleOfHTMLElement(
      this.dropTargetNodeCandidate
    );
    return clientY >= middle;
  }

  private findDropTargetNodeFromPoint(
    clientX: number,
    clientY: number
  ): HTMLElement {
    this.draggedElementShortcut.hidden = true;
    let draggedOverNode = document.elementFromPoint(clientX, clientY);
    this.draggedElementShortcut.hidden = false;

    return this.findDropTargetHTMLElement(draggedOverNode);
  }

  private findDropTargetHTMLElement(draggedOverNode: Element): HTMLElement {
    if (!draggedOverNode) return null;

    const selector = this.dropTargetDataAttributeName;
    let dropTargetNode = this.doFindDropTargetHTMLElement(draggedOverNode);

    if (!dropTargetNode) {
      dropTargetNode = draggedOverNode.closest<HTMLElement>(selector);
    }

    return dropTargetNode;
  }

  protected doFindDropTargetHTMLElement(draggedOverNode: Element): HTMLElement {
    return null;
  }

  protected findDeepestDropTargetChild(parent: HTMLElement): HTMLElement {
    const selector = this.dropTargetDataAttributeName;

    let result = parent;
    while (!!parent) {
      result = parent;
      parent = parent.querySelector(selector);
    }

    return <HTMLElement>result;
  }

  protected createElementFromJson(json: object) {
    const element: any = this.createNewElement(json);
    if (element["setSurveyImpl"]) {
      element["setSurveyImpl"](this.survey);
    } else {
      element["setData"](this.survey);
    }
    element.renderWidth = "100%";
    return element;
  }

  private createNewElement(json: any): IElement {
    var newElement = Serializer.createClass(json["type"]);
    new JsonObject().toObject(json, newElement);
    return newElement;
  }

  private drop = () => {
    if (this.allowDropHere) {
      this.onBeforeDrop.fire(this, null);
      const newElement = this.doDrop();
      this.onAfterDrop.fire(this, { draggedElement: newElement });
    }

    this.clear();
  };

  protected abstract doDrop(): any;

  private clear = () => {
    clearInterval(this.scrollIntervalId);

    document.removeEventListener("pointermove", this.moveDraggedElement);
    document.removeEventListener("keydown", this.handleEscapeButton);
    this.draggedElementShortcut.removeEventListener("pointerup", this.drop);
    document.body.removeChild(this.draggedElementShortcut);

    this.doClear();

    const prevEvent = DragDropCore.prevEvent;
    prevEvent.element = null;
    prevEvent.x = -1;
    prevEvent.y = -1;

    this.dropTarget = null;
    this.dropTargetNode = null;
    this.dropTargetCandidate = null;
    this.dropTargetNodeCandidate = null;

    this.draggedElementShortcut = null;
    this.ghostSurveyElement = null;
    this.draggedElement = null;
    this.parentElement = null;
    this.isBottom = null;
    this.scrollIntervalId = null;
  };

  protected doClear() {}
}
