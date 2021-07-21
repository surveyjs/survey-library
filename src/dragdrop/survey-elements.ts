import { IElement } from "src/base-interfaces";
import { JsonObject, Serializer } from "src/jsonobject";
import { turkishSurveyStrings } from "src/localization/turkish";
import { PageModel } from "src/page";
import { DragDropCore } from "./core";

export class DragDropSurveyElements extends DragDropCore {
  public static newGhostPage: PageModel = null;
  protected isEdge: boolean = null;

  protected get draggedElementType(): string {
    return "survey-element";
  }

  protected getShortcutText() {
    return this.draggedElement["title"] || this.draggedElement["name"];
  }

  protected getDropTargetByName(
    dropTargetName: string,
    isDragOverInnerPanel: boolean
  ) {
    let dropTarget = undefined;
    // drop to page
    if (dropTargetName === "newGhostPage") {
      dropTarget = DragDropSurveyElements.newGhostPage;
    } else {
      dropTarget = this.survey.getPageByName(dropTargetName);
    }

    // drop to element (question or panel)
    if (!dropTarget) {
      let element;
      this.survey.pages.forEach((page: PageModel) => {
        element = page.getElementByName(dropTargetName);
        if (element) dropTarget = element;
      });
      if (
        !!dropTarget &&
        dropTarget.getType() === "paneldynamic" &&
        isDragOverInnerPanel
      ) {
        const page = (<any>dropTarget).page;
        dropTarget = (<any>dropTarget).template;
        dropTarget.page = page;
      }
    }

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

    if (this.isEdge === isEdge) return false;

    this.isEdge = isEdge;

    return true;
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

      dropTarget = this.getDropTargetFromNode(HTMLElement);
    }

    return { dropTarget, isEdge };
  }

  private calculateIsEdge(HTMLElement: HTMLElement, clientY: number) {
    const middle = this.calculateMiddleOfHTMLElement(HTMLElement);
    return Math.abs(clientY - middle) >= DragDropCore.edgeHeight;
  }

  protected doDragOverAfter() {
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
  };

  protected insertGhostElementIntoSurvey(): boolean {
    this.removeGhostElementFromSurvey();

    this.ghostSurveyElement.name = DragDropCore.ghostSurveyElementName; //TODO why do we need setup it manually see createGhostSurveyElement method

    this.parentElement = this.dropTarget.isPage
      ? this.dropTarget
      : (<any>this.dropTarget)["page"];

    this.parentElement.dragDropStart(
      this.draggedElement,
      this.ghostSurveyElement,
      DragDropCore.nestedPanelDepth
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
      DragDropCore.nestedPanelDepth
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
