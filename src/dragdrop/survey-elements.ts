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
}
