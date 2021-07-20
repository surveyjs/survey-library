import { JsonObject, Serializer } from "src/jsonobject";
import { PageModel } from "src/page";
import { DragDropCore } from "./core";

export class DragDropSurveyElements extends DragDropCore {
  protected get draggedElementType(): string {
    return "survey-element";
  }

  protected getDragOverElementByName(
    dropTargetName: string,
    isDragOverInnerPanel: boolean
  ) {
    let dragOverSurveyElement = undefined;
    // drop to page
    if (dropTargetName === "newGhostPage") {
      dragOverSurveyElement = DragDropCore.newGhostPage;
    } else {
      dragOverSurveyElement = this.survey.getPageByName(dropTargetName);
    }

    // drop to element (question or panel)
    if (!dragOverSurveyElement) {
      let element;
      this.survey.pages.forEach((page: PageModel) => {
        element = page.getElementByName(dropTargetName);
        if (element) dragOverSurveyElement = element;
      });
      if (
        !!dragOverSurveyElement &&
        dragOverSurveyElement.getType() === "paneldynamic" &&
        isDragOverInnerPanel
      ) {
        const page = (<any>dragOverSurveyElement).page;
        dragOverSurveyElement = (<any>dragOverSurveyElement).template;
        dragOverSurveyElement.page = page;
      }
    }

    return dragOverSurveyElement;
  }

  protected doDragOver(
    dropTargetSurveyElement: any,
    isBottom: boolean,
    isEdge: boolean
  ) {
    this.insertGhostElementIntoSurvey();
  }

  protected doStartDrag() {
    this.ghostSurveyElement = this.createGhostSurveyElement();
  }

  protected doBanDropHere = () => {
    this.removeGhostElementFromSurvey();
  };

  protected doDrop = () => {
    if (this.dropTargetSurveyElement) {
      return this.insertRealElementIntoSurvey();
    }

    return null;
  };

  protected doClear = () => {
    this.removeGhostElementFromSurvey();
  };

  protected insertGhostElementIntoSurvey(): boolean {
    this.removeGhostElementFromSurvey();

    this.ghostSurveyElement.name = DragDropCore.ghostSurveyElementName; //TODO why do we need setup it manually see createGhostSurveyElement method

    this.parentElement = this.dropTargetSurveyElement.isPage
      ? this.dropTargetSurveyElement
      : (<any>this.dropTargetSurveyElement)["page"];

    this.parentElement.dragDropStart(
      this.draggedElement,
      this.ghostSurveyElement,
      DragDropCore.nestedPanelDepth
    );

    return this.parentElement.dragDropMoveTo(
      this.dropTargetSurveyElement,
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
    if (
      this.dropTargetSurveyElement.isPage &&
      (<any>this.dropTargetSurveyElement)["_isGhost"]
    ) {
      (<any>this.dropTargetSurveyElement)["_addGhostPageViewMobel"]();
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
      DragDropCore.nestedPanelDepth
    );

    this.parentElement.dragDropMoveTo(
      this.dropTargetSurveyElement,
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
    let className = "svc-drag-drop-ghost";

    const json = {
      type: "html",
      name: DragDropCore.ghostSurveyElementName,
      html: `<div class="${className}"></div>`,
    };

    const element = this.createElementFromJson(json);
    element.startWithNewLine = startWithNewLine;

    return element;
  }
}
