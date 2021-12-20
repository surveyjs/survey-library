import { DragTypeOverMeEnum, SurveyElement } from "../survey-element";
import { IElement } from "../base-interfaces";
import { JsonObject, Serializer } from "../jsonobject";
import { PageModel } from "../page";
import { DragDropCore } from "./core";

export class DragDropSurveyElements extends DragDropCore<any> {
  public static newGhostPage: PageModel = null;
  public static restrictDragQuestionBetweenPages: boolean = false;
  public static edgeHeight: number = 30;
  public static nestedPanelDepth: number = -1;
  public static ghostSurveyElementName =
    "sv-drag-drop-ghost-survey-element-name"; // before renaming use globa search (we have also css selectors)

  protected isEdge: boolean = false;
  protected prevIsEdge: any = null;
  protected ghostSurveyElement: IElement = null;

  protected get draggedElementType(): string {
    return "survey-element";
  }
  protected isDraggedElementSelected: boolean = false;

  public startDragToolboxItem(
    event: PointerEvent,
    draggedElementJson: JsonObject
  ): void {
    const draggedElement = this.createElementFromJson(draggedElementJson);
    this.startDrag(event, draggedElement);
  }

  public startDragSurveyElement(
    event: PointerEvent,
    draggedElement: any,
    isElementSelected?: boolean
  ): void {
    this.isDraggedElementSelected = isElementSelected;
    draggedElement.isDragMe = true;
    this.startDrag(event, draggedElement);
  }

  protected createDraggedElementShortcut(text: string, draggedElementNode?: HTMLElement, event?: PointerEvent): HTMLElement {
    const draggedElementShortcut = document.createElement("div");
    const textSpan = document.createElement("span");

    textSpan.className = "svc-dragged-element-shortcut__text";
    textSpan.innerText = text;
    draggedElementShortcut.appendChild(this.createDraggedElementIcon());
    draggedElementShortcut.appendChild(textSpan);
    draggedElementShortcut.className = this.getDraggedElementClass();
    return draggedElementShortcut;
  }

  protected createDraggedElementIcon(): HTMLElement {
    const span = document.createElement("span");
    const type = this.draggedElement.getType();
    const svgString = `<svg class="sv-svg-icon" role="img" style="width: 24px; height: 24px;"><use xlink:href="#icon-${type}"></use></svg>`;

    span.className = "svc-dragged-element-shortcut__icon";
    span.innerHTML = svgString;
    return span;
  }

  protected getDraggedElementClass() {
    let result = "svc-dragged-element-shortcut";
    if (this.isDraggedElementSelected) result += " svc-dragged-element-shortcut--selected";
    return result;
  }

  protected createElementFromJson(json: object): HTMLElement {
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

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string,
    dropTargetNode: HTMLElement,
    event: PointerEvent
  ): any {
    this.isEdge = this.calculateIsEdge(dropTargetNode, event.clientY);

    if (!dataAttributeValue) {
      // panel dynamic
      const nearestDropTargetElement = dropTargetNode.parentElement.closest<
        HTMLElement
      >(this.dropTargetDataAttributeName);
      dataAttributeValue = this.getDataAttributeValueByNode(nearestDropTargetElement);
    }

    if (!dataAttributeValue) {
      throw new Error("Can't find drop target survey element name");
    }

    if (dataAttributeValue === DragDropSurveyElements.ghostSurveyElementName) {
      return this.prevDropTarget;
    }

    // drop to new page
    if (dataAttributeValue === "newGhostPage") {
      return DragDropSurveyElements.newGhostPage;
    }

    // drop to page
    let page: any = this.survey.getPageByName(dataAttributeValue);
    if (page) {
      if (
        // TODO we can't drop on not empty page directly for now
        page.elements.length !== 0
      ) {
        return null;
      }
      return page;
    }

    // drop to question or panel
    let dropTarget: any;
    let question;

    this.survey.pages.forEach((page: PageModel) => {
      question = page.getElementByName(dataAttributeValue);
      if (question) dropTarget = question;
    });

    // drop to paneldynamic
    if (dropTarget.getType() === "paneldynamic" && !this.isEdge) {
      dropTarget = (<any>dropTarget).template;
    }

    // drop to matrix detail panel
    if ((dropTarget.getType() === "matrixdropdown" || dropTarget.getType() === "matrixdynamic") && (<any>dropTarget).detailPanelMode !=="none" && !this.isEdge) {
      dropTarget = (<any>dropTarget).detailPanel;
    }

    // drop to panel
    else if (dropTarget.isPanel) {
      const panelDragInfo = this.getPanelDragInfo(
        dropTargetNode,
        dropTarget,
        event
      );
      dropTarget = panelDragInfo.dropTarget;
      this.isEdge = panelDragInfo.isEdge;
    }
    // drop to question

    //question inside paneldymanic
    if (!dropTarget.page) {
      const nearestDropTargetPageElement = dropTargetNode.parentElement.closest<
        HTMLElement
      >("[data-sv-drop-target-page]");
      dataAttributeValue = nearestDropTargetPageElement.dataset.svDropTargetPage;
      let page: any = this.survey.getPageByName(dataAttributeValue);
      dropTarget.__page = page;
    }

    return dropTarget;
    // EO drop to question or panel
  }

  protected isDropTargetValid(dropTarget: SurveyElement): boolean {
    if (!dropTarget) return false;
    if (this.dropTarget === this.draggedElement) return false;

    if (
      DragDropSurveyElements.restrictDragQuestionBetweenPages &&
      this.shouldRestricDragQuestionBetweenPages(dropTarget)
    ) {
      return false;
    }

    return true;
  }

  protected calculateIsBottom(
    clientY: number,
    dropTargetNode?: HTMLElement
  ): boolean {
    // we shouldn't reculc isBottom if drag over ghost survey element
    if (this.getDataAttributeValueByNode(dropTargetNode) === DragDropSurveyElements.ghostSurveyElementName) {
      return this.isBottom;
    }
    const middle = this.calculateMiddleOfHTMLElement(dropTargetNode);
    return clientY >= middle;
  }

  protected isDropTargetDoesntChanged(newIsBottom: boolean): boolean {
    if (this.dropTarget === this.ghostSurveyElement) return true;
    return (
      this.dropTarget === this.prevDropTarget && newIsBottom === this.isBottom
      && this.isEdge === this.prevIsEdge
    );
  }

  private shouldRestricDragQuestionBetweenPages(dropTarget: any): boolean {
    const oldPage = (<any>this.draggedElement)["page"];
    const newPage = dropTarget.isPage ? dropTarget : dropTarget["page"];

    // if oldPage === null then it is drom the toolbox
    return oldPage && oldPage !== newPage;
  }

  private getPanelDragInfo(
    HTMLElement: HTMLElement,
    dropTarget: any,
    event: PointerEvent
  ) {
    let isEdge = this.isEdge;

    if (!isEdge && dropTarget.questions.length !== 0) {
      HTMLElement = this.findDeepestDropTargetChild(HTMLElement);
      dropTarget = this.getDropTargetByNode(HTMLElement, event);
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
    const rect = HTMLElement.getBoundingClientRect();
    return clientY - rect.top <= DragDropSurveyElements.edgeHeight || rect.bottom - clientY <= DragDropSurveyElements.edgeHeight;
  }

  private calculateIsRight(): boolean {
    var pageOrPanel = this.dropTarget.parent;
    var srcIndex = pageOrPanel.elements.indexOf(this.draggedElement);
    var destIndex = pageOrPanel.elements.indexOf(this.dropTarget);
    return srcIndex < destIndex;
  }

  protected afterDragOver(): void {
    this.prevIsEdge = this.isEdge;
    this.insertGhostElementIntoSurvey();
  }

  protected onStartDrag(): void {
    this.ghostSurveyElement = this.createGhostSurveyElement();
  }

  protected doBanDropHere = (): void => {
    this.removeGhostElementFromSurvey();
    this.isEdge = null;
  };

  protected doDrop = (): any => {
    if (this.dropTarget) {
      return this.insertRealElementIntoSurvey();
    }

    return null;
  };

  protected doClear = (): void => {
    this.removeGhostElementFromSurvey();
    this.isEdge = null;
    this.ghostSurveyElement = null;
    if (!!this.draggedElement) {
      this.draggedElement.isDragMe = false;
    }
  };

  protected insertGhostElementIntoSurvey(): boolean {
    this.removeGhostElementFromSurvey();

    let isTargetRowMultiple = this.calcTargetRowMultiple();

    this.ghostSurveyElement = this.createGhostSurveyElement(isTargetRowMultiple);

    this.ghostSurveyElement.name =
      DragDropSurveyElements.ghostSurveyElementName; // TODO why do we need setup it manually see createGhostSurveyElement method

    this.parentElement = this.dropTarget.isPage
      ? this.dropTarget
      : ((<any>this.dropTarget).page || (<any>this.dropTarget).__page);

    if (this.isDragOverInsideEmptyPanel()) {
      this.dropTarget.dragTypeOverMe = DragTypeOverMeEnum.InsideEmptyPanel;
      return;
    }

    if (!this.isEdge && isTargetRowMultiple) {
      this.dropTarget.dragTypeOverMe = this.calculateIsRight() ?
        DragTypeOverMeEnum.MultilineRight :
        DragTypeOverMeEnum.MultilineLeft;
      return;
    }

    this.parentElement.dragDropStart(
      this.draggedElement,
      this.ghostSurveyElement,
      DragDropSurveyElements.nestedPanelDepth
    );

    const result = this.parentElement.dragDropMoveTo(
      this.dropTarget,
      isTargetRowMultiple ? this.calculateIsRight() : this.isBottom,
      this.isEdge
    );

    return result;
  }

  private calcTargetRowMultiple() {
    let targetParent = this.dropTarget.isPage || this.dropTarget.isPanel ? this.dropTarget : this.dropTarget.parent;

    if (this.dropTarget.getType() === "paneldynamic") {
      targetParent = this.dropTarget.templateValue;
    }

    let targetRow: any;

    targetParent.rows.forEach((row: any) => {
      if (row.elements.indexOf(this.dropTarget) !== -1) {
        targetRow = row;
      }
    });

    const isTargetRowMultiple = targetRow && targetRow.elements.length > 1;

    if (this.isEdge && isTargetRowMultiple) {
      targetParent.__page = this.dropTarget.page;
      this.dropTarget = targetParent;
      return false;
    }

    return isTargetRowMultiple;
  }

  private isDragOverInsideEmptyPanel(): boolean {
    const isEmptyPanel = this.dropTarget.isPanel && this.dropTarget.questions.length === 0;
    const isDragOverInside = !this.isEdge;
    return isEmptyPanel && isDragOverInside;
  }

  protected removeGhostElementFromSurvey(): void {
    const dropTarget = this.prevDropTarget || this.dropTarget;
    if (!!dropTarget) {
      dropTarget.dragTypeOverMe = null;
    }
    if (!!this.parentElement) this.parentElement.dragDropFinish(true);
  }

  private insertRealElementIntoSurvey() {
    this.removeGhostElementFromSurvey();

    const isTargetRowMultiple = this.calcTargetRowMultiple();

    // ghost new page
    if (this.dropTarget.isPage && (<any>this.dropTarget)["_isGhost"]) {
      (<any>this.dropTarget)["_addGhostPageViewModel"]();
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
      isTargetRowMultiple ? this.calculateIsRight() : this.isBottom,
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

  private createGhostSurveyElement(isMultipleRowDrag = false): any {
    let className = "sv-drag-drop-ghost";
    let minWidth = "300px";

    if (isMultipleRowDrag) {
      minWidth = "4px";
      className += " sv-drag-drop-ghost--vertical";
    }

    const json: any = {
      type: "html",
      minWidth,
      name: DragDropSurveyElements.ghostSurveyElementName,
      html: `<div class="${className}"></div>`,
    };

    const element = <any>this.createElementFromJson(json);
    element.startWithNewLine = !isMultipleRowDrag;

    if (isMultipleRowDrag) {
      element.maxWidth = "4px";
      element.renderWidth = "0px";
      element.paddingRight = "0px";
      element.paddingLeft = "0px";
    }

    return element;
  }
}
