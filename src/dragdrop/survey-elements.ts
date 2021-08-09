import { IElement } from "src/base-interfaces";
import { JsonObject, Serializer } from "src/jsonobject";
import { PageModel } from "src/page";
import { DragDropCore } from "./core";

export class DragDropSurveyElements extends DragDropCore {
  public static newGhostPage: PageModel = null;
  public static restrictDragQuestionBetweenPages: boolean = false;
  public static edgeHeight: number = 30;
  public static nestedPanelDepth: number = -1;
  public static ghostSurveyElementName =
    "sv-drag-drop-ghost-survey-element-name"; // before renaming use globa search (we have also css selectors)

  protected isEdge: boolean = null;
  protected ghostSurveyElement: IElement = null;

  protected get draggedElementType(): string {
    return "survey-element";
  }

  public startDragToolboxItem(
    event: PointerEvent,
    draggedElementJson: JsonObject
  ) {
    const draggedElement = this.createElementFromJson(draggedElementJson);
    this.startDrag(event, draggedElement);
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

  protected getShortcutText(draggedElement: any) {
    return draggedElement["title"] || draggedElement["name"];
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: string) {
    // if (!dataAttributeValue) {
    //   const nearestDropTargetElement = dropTargetNode.parentElement.closest<
    //     HTMLElement
    //   >(this.dropTargetDataAttributeName);
    //   dataAttributeValue = this.getdataAttributeValueFromNode(nearestDropTargetElement);
    //   isDragOverInnerPanel =
    //     nearestDropTargetElement !== dropTargetNode && !!dataAttributeValue;
    // }

    // if (!dataAttributeValue) {
    //   throw new Error("Can't find drop target survey element name");
    // }
    let dropTarget = undefined;

    if (dataAttributeValue === DragDropSurveyElements.ghostSurveyElementName) {
      return this.ghostSurveyElement;
    }

    // drop to page
    if (dataAttributeValue === "newGhostPage") {
      dropTarget = DragDropSurveyElements.newGhostPage;
    } else {
      dropTarget = this.survey.getPageByName(dataAttributeValue);
    }

    // drop to element (question or panel)
    // if (!dropTarget) {
    //   let element;
    //   this.survey.pages.forEach((page: PageModel) => {
    //     element = page.getElementByName(dataAttributeValue);
    //     if (element) dropTarget = element;
    //   });
    //   if (
    //     !!dropTarget &&
    //     dropTarget.getType() === "paneldynamic" &&
    //     isDragOverInnerPanel
    //   ) {
    //     const page = (<any>dropTarget).page;
    //     dropTarget = (<any>dropTarget).template;
    //     dropTarget.page = page;
    //   }
    // }

    // if (dropTarget.isPanel) {
    //   const panelDragInfo = this.getPanelDragInfo(
    //     dropTargetNode,
    //     dropTarget,
    //     event
    //   );
    //   dropTarget = panelDragInfo.dropTarget;
    //   isEdge = panelDragInfo.isEdge;
    // }

    return dropTarget;
  }

  protected isDropTargetValid(dropTarget: any, isBottom: boolean) {
    // const isEdge = this.calculateIsEdge();
    const isEdge = true;

    if (dropTarget === this.ghostSurveyElement) return false;

    if (
      // TODO we can't drop on not empty page directly for now
      dropTarget &&
      dropTarget.getType() === "page" &&
      dropTarget.elements.length !== 0
    ) {
      const elements = dropTarget.elements;
      dropTarget = isBottom ? elements[elements.length - 1] : elements[0];
    }

    if (
      DragDropSurveyElements.restrictDragQuestionBetweenPages &&
      this.shouldRestricDragQuestionBetweenPages(dropTarget)
    ) {
      return false;
    }

    if (
      DragDropSurveyElements.restrictDragQuestionBetweenPages &&
      dropTarget["page"] !== (<any>this.draggedElement)["page"]
    ) {
      return false;
    }

    if (this.isEdge === isEdge) return false;

    this.isEdge = isEdge;

    return true;
  }

  private shouldRestricDragQuestionBetweenPages(dropTarget: any): boolean {
    const oldPage = (<any>this.draggedElement)["page"];
    const newPage = dropTarget.isPage ? dropTarget : dropTarget["page"];

    // if oldPage === null then it is drom the toolbox
    return oldPage && oldPage !== newPage;
  }

  private getPanelDragInfo(
    HTMLElement: HTMLElement,
    surveyElement: IElement,
    event: PointerEvent
  ) {
    let isEdge = this.calculateIsEdge(HTMLElement, event.clientY);
    let dropTarget = surveyElement;

    if (!isEdge) {
      HTMLElement = this.findDeepestDropTargetChild(HTMLElement);

      // dropTarget = this.getDropTargetByNode(HTMLElement);
    }

    return { dropTarget, isEdge };
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

  private calculateIsEdge(HTMLElement: HTMLElement, clientY: number) {
    const middle = this.calculateMiddleOfHTMLElement(HTMLElement);
    return Math.abs(clientY - middle) >= DragDropSurveyElements.edgeHeight;
  }

  protected doDrag() {
    this.insertGhostElementIntoSurvey();
  }

  protected doStartDrag() {
    this.ghostSurveyElement = this.createGhostSurveyElement();
  }

  protected doBanDropHere = () => {
    this.removeGhostElementFromSurvey();
    this.isEdge = null;
  };

  protected doDrop = () => {
    if (this.dropTarget) {
      return this.insertRealElementIntoSurvey();
    }

    return null;
  };

  protected doClear = () => {
    this.removeGhostElementFromSurvey();
    this.isEdge = null;
    this.ghostSurveyElement = null;
  };

  protected insertGhostElementIntoSurvey(): boolean {
    this.removeGhostElementFromSurvey();

    this.ghostSurveyElement.name =
      DragDropSurveyElements.ghostSurveyElementName; // TODO why do we need setup it manually see createGhostSurveyElement method

    this.parentElement = this.dropTarget.isPage
      ? this.dropTarget
      : (<any>this.dropTarget)["page"];

    this.parentElement.dragDropStart(
      this.draggedElement,
      this.ghostSurveyElement,
      DragDropSurveyElements.nestedPanelDepth
    );

    return this.parentElement.dragDropMoveTo(
      this.dropTarget,
      this.isBottom,
      this.isEdge
    );
  }

  protected removeGhostElementFromSurvey() {
    if (!!this.parentElement) this.parentElement.dragDropFinish(true);
  }

  private insertRealElementIntoSurvey() {
    this.removeGhostElementFromSurvey();

    // ghost new page
    if (this.dropTarget.isPage && (<any>this.dropTarget)["_isGhost"]) {
      (<any>this.dropTarget)["_addGhostPageViewMobel"]();
    }
    // EO ghost new page

    // fake target element (need only for "startWithNewLine:false" feature)
    //TODO need for dragDrop helper in library
    const json = new JsonObject().toJsonObject(this.draggedElement);
    json["type"] = this.draggedElement.getType();
    const fakeTargetElement = this.createFakeTargetElement(
      this.draggedElement.name,
      json
    );
    // EO fake target element

    this.parentElement.dragDropStart(
      this.draggedElement,
      fakeTargetElement,
      DragDropSurveyElements.nestedPanelDepth
    );

    this.parentElement.dragDropMoveTo(
      this.dropTarget,
      this.isBottom,
      this.isEdge
    );

    const newElement = this.parentElement.dragDropFinish();
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

  private createGhostSurveyElement(): any {
    const startWithNewLine = this.draggedElement.startWithNewLine;
    let className = "sv-drag-drop-ghost";

    const json = {
      type: "html",
      name: DragDropSurveyElements.ghostSurveyElementName,
      html: `<div class="${className}"></div>`,
    };

    const element = this.createElementFromJson(json);
    element.startWithNewLine = startWithNewLine;

    return element;
  }
}
