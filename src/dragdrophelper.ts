import { Base, EventBase } from "./base";
import { IElement } from "./base-interfaces";
import { ItemValue } from "./itemvalue";
import { JsonObject, property, Serializer } from "./jsonobject";
import { PageModel } from "./page";
import { QuestionSelectBase } from "./question_baseselect";
import { SurveyModel } from "./survey";

export class DragDropHelper extends Base {
  public onBeforeDrop: EventBase<DragDropHelper> = new EventBase();
  public onAfterDrop: EventBase<DragDropHelper> = new EventBase();

  public static restrictDragQuestionBetweenPages: boolean = false;

  public static edgeHeight: number = 30;
  public static nestedPanelDepth: number = -1;
  public static prevEvent: any = {
    element: null,
    x: -1,
    y: -1,
  };
  public static newGhostPage: PageModel = null;
  public static ghostSurveyElementName =
    "svc-drag-drop-ghost-survey-element-name"; // before renaming use globa search (we have also css selectors)

  private draggedSurveyElement: IElement = null;
  @property() dropTargetSurveyElement: IElement = null;

  private draggedElementShortcut: HTMLElement = null;
  private scrollIntervalId: ReturnType<typeof setTimeout> = null;
  private ghostSurveyElement: IElement = null;
  @property() isBottom: boolean = null;
  private isEdge: boolean = null;
  private pageOrPanel: PageModel = null;
  private itemValueParentQuestion: QuestionSelectBase = null;

  protected isItemValueBeingDragged() {
    return Serializer.isDescendantOf(
      this.draggedSurveyElement.getType(),
      "itemvalue"
    );
  }

  protected get dropTargetDataAttributeName() {
    if (this.isItemValueBeingDragged()) {
      return "[data-svc-drop-target-item-value]";
    }
    return "[data-svc-drop-target-element-name]";
  }

  constructor(private surveyValue?: SurveyModel, private creator?: any) {
    super();
  }

  public get survey() {
    return this.surveyValue || this.creator.survey;
  }

  public startDragToolboxItem(
    event: PointerEvent,
    draggedElementJson: JsonObject
  ) {
    const draggedElement = this.createElementFromJson(draggedElementJson);
    this.startDragSurveyElement(event, draggedElement);
  }

  public startDragSurveyElement(event: PointerEvent, draggedElement: IElement) {
    this.startDrag(event, draggedElement);
  }

  public startDragItemValue(
    event: PointerEvent,
    question: QuestionSelectBase,
    item: ItemValue
  ) {
    const draggedElement = <any>item;
    this.itemValueParentQuestion = question;
    this.startDrag(event, draggedElement);
  }

  public startDrag(event: PointerEvent, draggedElement: IElement) {
    this.draggedSurveyElement = draggedElement;
    this.ghostSurveyElement = this.createGhostSurveyElement();
    this.draggedElementShortcut = this.createDraggedElementShortcut();

    document.body.append(this.draggedElementShortcut);
    this.moveShortcutElement(event);

    document.addEventListener("pointermove", this.moveDraggedElement);
    document.addEventListener("keydown", this.handleEscapeButton);
    this.draggedElementShortcut.addEventListener("pointerup", this.drop);
  }

  public getItemValueGhostPosition(item: any) {
    if (this.dropTargetSurveyElement !== item) return null;
    if (this.isBottom) return "bottom";
    return "top";
  }

  private createGhostSurveyElement(): any {
    const startWithNewLine = this.draggedSurveyElement.startWithNewLine;
    let className = "svc-drag-drop-ghost";

    const json = {
      type: "html",
      name: DragDropHelper.ghostSurveyElementName,
      html: `<div class="${className}"></div>`,
    };

    const element = this.createElementFromJson(json);
    element.startWithNewLine = startWithNewLine;

    return element;
  }

  private createDraggedElementShortcut() {
    const draggedElementShortcut = document.createElement("div");
    const draggedElement: any = this.draggedSurveyElement;
    draggedElementShortcut.innerText =
      draggedElement["title"] ||
      draggedElement["text"] ||
      draggedElement["name"];
    draggedElementShortcut.className = "svc-drag-shortcut";
    return draggedElementShortcut;
  }

  private moveDraggedElement = (event: PointerEvent) => {
    this.moveShortcutElement(event);

    if (this.isItemValueBeingDragged()) {
      this.handleItemValueDragOver(event);
    } else {
      this.handleSurveyElementDragOver(event);
    }
  };

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
    clearInterval(this.scrollIntervalId);
    const startScrollBoundary = 50;

    // need to import getScrollableParent method
    // let scrollableParentElement = getScrollableParent(dropZoneElement)
    //   .parentNode;
    let scrollableParentElement = document.querySelector(
      ".svc-tab-designer.sd-root-modern"
    );

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

  private handleItemValueDragOver(event: PointerEvent) {
    this.draggedElementShortcut.style.cursor = "grabbing";

    const dragInfo = this.getDragInfo(event);
    let dropTargetSurveyElement = dragInfo.dropTargetSurveyElement;
    let isEdge = dragInfo.isEdge;
    let isBottom = dragInfo.isBottom;

    const choices = this.itemValueParentQuestion.choices;

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTargetSurveyElement) === -1) {
      this.banDropHere();
      return;
    }

    //drag over next item
    if (
      choices.indexOf(dropTargetSurveyElement) -
        choices.indexOf(this.draggedSurveyElement) ===
      1
    ) {
      isBottom = true;
    }

    //drag over prev item
    if (
      choices.indexOf(this.draggedSurveyElement) -
        choices.indexOf(dropTargetSurveyElement) ===
      1
    ) {
      isBottom = false;
    }

    if (dropTargetSurveyElement === this.draggedSurveyElement) {
      this.banDropHere();
      return true;
    }

    if (
      dropTargetSurveyElement === this.dropTargetSurveyElement &&
      isEdge === this.isEdge &&
      isBottom === this.isBottom
    )
      return;

    this.dropTargetSurveyElement = dropTargetSurveyElement;
    this.isEdge = isEdge;
    this.isBottom = isBottom;
  }

  private handleSurveyElementDragOver(event: PointerEvent) {
    this.draggedElementShortcut.style.cursor = "grabbing";

    const dragInfo = this.getDragInfo(event);
    let dropTargetSurveyElement = dragInfo.dropTargetSurveyElement;
    let isEdge = dragInfo.isEdge;
    let isBottom = dragInfo.isBottom;

    if (!dropTargetSurveyElement) {
      this.banDropSurveyElement();
      return;
    }

    if (
      DragDropHelper.restrictDragQuestionBetweenPages &&
      this.shouldRestricDragQuestionBetweenPages(dropTargetSurveyElement)
    ) {
      this.banDropSurveyElement();
      return;
    }

    if (dropTargetSurveyElement === this.ghostSurveyElement) {
      return;
    }

    if (
      dropTargetSurveyElement === this.dropTargetSurveyElement &&
      isEdge === this.isEdge &&
      isBottom === this.isBottom
    )
      return;

    this.isEdge = isEdge;
    this.isBottom = isBottom;
    this.dropTargetSurveyElement = dropTargetSurveyElement;
    this.insertGhostElementIntoSurvey();
  }

  private shouldRestricDragQuestionBetweenPages(
    dropTargetSurveyElement: any
  ): boolean {
    const oldPage = (<any>this.draggedSurveyElement)["page"];
    const newPage = dropTargetSurveyElement.isPage
      ? dropTargetSurveyElement
      : dropTargetSurveyElement["page"];

    // if oldPage === null then it is drom the toolbox
    return oldPage && oldPage !== newPage;
  }

  private getDragInfo(event: PointerEvent) {
    let dropTargetHTMLElement = this.findDropTargetHTMLElementFromPoint(
      event.clientX,
      event.clientY
    );

    if (!dropTargetHTMLElement) {
      return { dropTargetSurveyElement: null, isEdge: true, isBottom: true };
    }

    let dropTargetSurveyElement = this.getDropTargetSurveyElementFromHTMLElement(
      dropTargetHTMLElement
    );

    let isEdge = true;

    if (!this.isItemValueBeingDragged()) {
      if (dropTargetSurveyElement.isPanel) {
        const panelDragInfo = this.getPanelDragInfo(
          dropTargetHTMLElement,
          dropTargetSurveyElement,
          event
        );
        dropTargetSurveyElement = panelDragInfo.dropTargetSurveyElement;
        isEdge = panelDragInfo.isEdge;
      }
    }

    if (dropTargetSurveyElement === this.draggedSurveyElement) {
      dropTargetSurveyElement = null;
    }

    let isBottom = this.calculateIsBottom(dropTargetHTMLElement, event.clientY);

    if (
      // TODO we can't drop on not empty page directly for now
      dropTargetSurveyElement &&
      dropTargetSurveyElement.getType() === "page" &&
      dropTargetSurveyElement.elements.length !== 0
    ) {
      const elements = dropTargetSurveyElement.elements;
      dropTargetSurveyElement = isBottom
        ? elements[elements.length - 1]
        : elements[0];
    }

    return { dropTargetSurveyElement, isEdge, isBottom };
  }

  private getPanelDragInfo(
    HTMLElement: HTMLElement,
    surveyElement: IElement,
    event: PointerEvent
  ) {
    let isEdge = this.calculateIsEdge(HTMLElement, event.clientY);
    let dropTargetSurveyElement = surveyElement;

    if (!isEdge) {
      HTMLElement = this.findDeepestDropTargetChild(HTMLElement);

      dropTargetSurveyElement = this.getDropTargetSurveyElementFromHTMLElement(
        HTMLElement
      );
    }

    return { dropTargetSurveyElement, isEdge };
  }

  private banDropHere = () => {
    this.dropTargetSurveyElement = null;
    this.isBottom = null;
    this.isEdge = null;
    this.draggedElementShortcut.style.cursor = "not-allowed";
  };

  private banDropSurveyElement = () => {
    this.removeGhostElementFromSurvey();
    this.banDropHere();
  };

  private getDropTargetSurveyElementName(element: HTMLElement) {
    let dropTargetSurveyElementName = element.dataset.svcDropTargetElementName;
    if (!dropTargetSurveyElementName) {
      dropTargetSurveyElementName = element.dataset.svcDropTargetItemValue;
    }
    return dropTargetSurveyElementName;
  }

  private getDropTargetSurveyElementFromHTMLElement(element: HTMLElement) {
    let result = undefined;
    let dropTargetName = this.getDropTargetSurveyElementName(element);
    let isDragOverInnerPanel = false;
    if (!dropTargetName) {
      const nearestDropTargetElement = element.parentElement.closest<
        HTMLElement
      >(this.dropTargetDataAttributeName);
      dropTargetName = this.getDropTargetSurveyElementName(
        nearestDropTargetElement
      );
      isDragOverInnerPanel =
        nearestDropTargetElement !== element && !!dropTargetName;
    }
    if (!dropTargetName) {
      throw new Error("Can't find drop target survey element name");
    }

    if (dropTargetName === DragDropHelper.ghostSurveyElementName) {
      return this.ghostSurveyElement;
    }

    // drop to page
    if (dropTargetName === "newGhostPage") {
      result = DragDropHelper.newGhostPage;
    } else {
      result = this.survey.getPageByName(dropTargetName);
    }

    // drop to element (question or panel)
    if (!result) {
      let element;
      this.survey.pages.forEach((page: PageModel) => {
        element = page.getElementByName(dropTargetName);
        if (element) result = element;
      });
      if (
        !!result &&
        result.getType() === "paneldynamic" &&
        isDragOverInnerPanel
      ) {
        const page = (<any>result).page;
        result = (<any>result).template;
        result.page = page;
      }
    }

    // drop to item-value
    if (!result) {
      result = this.itemValueParentQuestion.choices.filter(
        (choice) => choice.value === dropTargetName
      )[0];
    }

    return result;
  }

  private calculateMiddleOfHTMLElement(HTMLElement: HTMLElement) {
    const rect = HTMLElement.getBoundingClientRect();
    return rect.y + rect.height / 2;
  }

  private calculateIsBottom(HTMLElement: HTMLElement, clientY: number) {
    const middle = this.calculateMiddleOfHTMLElement(HTMLElement);
    return clientY >= middle;
  }

  private calculateIsEdge(HTMLElement: HTMLElement, clientY: number) {
    const middle = this.calculateMiddleOfHTMLElement(HTMLElement);
    return Math.abs(clientY - middle) >= DragDropHelper.edgeHeight;
  }

  private findDropTargetHTMLElement(draggedOverNode: Element): HTMLElement {
    if (!draggedOverNode) return null;

    const selector = this.dropTargetDataAttributeName;
    let dropTargetHTMLElement =
      draggedOverNode.querySelector<HTMLElement>(selector) ||
      draggedOverNode.closest<HTMLElement>(selector);

    return dropTargetHTMLElement;
  }

  private findDropTargetHTMLElementFromPoint(
    clientX: number,
    clientY: number
  ): HTMLElement {
    this.draggedElementShortcut.hidden = true;
    let draggedOverNode = document.elementFromPoint(clientX, clientY);
    this.draggedElementShortcut.hidden = false;

    return this.findDropTargetHTMLElement(draggedOverNode);
  }

  private findDeepestDropTargetChild(parent: HTMLElement): HTMLElement {
    const selector = "[data-svc-drop-target-element-name]";

    let result = parent;
    while (!!parent) {
      result = parent;
      parent = parent.querySelector(selector);
    }

    return <HTMLElement>result;
  }

  private insertGhostElementIntoSurvey(): boolean {
    this.removeGhostElementFromSurvey();

    this.ghostSurveyElement.name = DragDropHelper.ghostSurveyElementName; //TODO why do we need setup it manually see createGhostSurveyElement method

    this.pageOrPanel = this.dropTargetSurveyElement.isPage
      ? this.dropTargetSurveyElement
      : (<any>this.dropTargetSurveyElement)["page"];

    this.pageOrPanel.dragDropStart(
      this.draggedSurveyElement,
      this.ghostSurveyElement,
      DragDropHelper.nestedPanelDepth
    );

    return this.pageOrPanel.dragDropMoveTo(
      this.dropTargetSurveyElement,
      this.isBottom,
      this.isEdge
    );
  }

  private insertRealElementIntoSurvey() {
    this.removeGhostElementFromSurvey();

    // ghost new page
    if (
      this.dropTargetSurveyElement.isPage &&
      (<any>this.dropTargetSurveyElement)["_isGhost"]
    ) {
      (<any>this.dropTargetSurveyElement)["_addGhostPageViewMobel"]();
    }
    // EO ghost new page

    // fake target element (need only for "startWithNewLine:false" feature)
    //TODO need for dragDrop helper in library
    const json = new JsonObject().toJsonObject(this.draggedSurveyElement);
    json["type"] = this.draggedSurveyElement.getType();
    const fakeTargetElement = this.createFakeTargetElement(
      this.draggedSurveyElement.name,
      json
    );
    // EO fake target element

    this.pageOrPanel.dragDropStart(
      this.draggedSurveyElement,
      fakeTargetElement,
      DragDropHelper.nestedPanelDepth
    );

    this.pageOrPanel.dragDropMoveTo(
      this.dropTargetSurveyElement,
      this.isBottom,
      this.isEdge
    );

    this.onBeforeDrop.fire(this, null);
    const newElement = this.pageOrPanel.dragDropFinish();
    this.onAfterDrop.fire(this, { draggedElement: newElement });
  }

  private removeGhostElementFromSurvey() {
    if (!!this.pageOrPanel) this.pageOrPanel.dragDropFinish(true);
  }

  private createElementFromJson(json: object) {
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

  private createFakeTargetElement(elementName: string, json: any): any {
    if (!elementName || !json) return null;
    var targetElement = null;
    targetElement = Serializer.createClass(json["type"]);
    new JsonObject().toObject(json, targetElement);
    targetElement.name = elementName;
    if (targetElement["setSurveyImpl"]) {
      targetElement["setSurveyImpl"](this.survey);
    } else {
      targetElement["setData"](this.survey);
    }
    targetElement.renderWidth = "100%";
    return targetElement;
  }

  private drop = () => {
    if (this.isItemValueBeingDragged()) {
      this.doDropItemValue();
    } else {
      this.doDropSurveyElement();
    }
    this.clear();
  };

  private doDropSurveyElement() {
    if (this.dropTargetSurveyElement) {
      this.insertRealElementIntoSurvey();
    }
  }

  private doDropItemValue = () => {
    const isTop = !this.isBottom;
    const choices = this.itemValueParentQuestion.choices;
    const oldIndex = choices.indexOf(this.draggedSurveyElement);
    let newIndex = choices.indexOf(this.dropTargetSurveyElement);

    if (oldIndex < newIndex && isTop) {
      newIndex--;
    } else if (oldIndex > newIndex && this.isBottom) {
      newIndex++;
    }

    this.onBeforeDrop.fire(this, null);
    choices.splice(oldIndex, 1);
    choices.splice(newIndex, 0, this.draggedSurveyElement);
    this.onAfterDrop.fire(this, {
      draggedElement: this.itemValueParentQuestion,
    });
  };

  private clear = () => {
    clearInterval(this.scrollIntervalId);

    document.removeEventListener("pointermove", this.moveDraggedElement);
    document.removeEventListener("keydown", this.handleEscapeButton);
    this.draggedElementShortcut.removeEventListener("pointerup", this.drop);
    document.body.removeChild(this.draggedElementShortcut);

    this.removeGhostElementFromSurvey();

    const prevEvent = DragDropHelper.prevEvent;
    prevEvent.element = null;
    prevEvent.x = -1;
    prevEvent.y = -1;

    this.dropTargetSurveyElement = null;
    this.draggedElementShortcut = null;
    this.ghostSurveyElement = null;
    this.draggedSurveyElement = null;
    this.pageOrPanel = null;
    this.itemValueParentQuestion = null;
    this.isBottom = null;
    this.isEdge = null;
    this.scrollIntervalId = null;
  };
}
