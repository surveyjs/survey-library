import { SurveyModel } from "./survey";

export class SurveyProgressButtonsModel {
  constructor(private survey: SurveyModel) {
  }
  public isListElementClickable(index: number): boolean {
    if (!this.survey.onServerValidateQuestions ||
      this.survey.onServerValidateQuestions.isEmpty ||
      this.survey.checkErrorsMode === "onComplete") {
      return true;
    }
    return index <= this.survey.currentPageNo + 1;
  }
  public getListElementCss(index: number): string {
    if (index >= this.survey.visiblePages.length) return;
    let elementCss: string = this.survey.visiblePages[index].passed ?
      this.survey.css.progressButtonsListElementPassed : "";
    if (this.survey.currentPageNo === index) {
      elementCss += elementCss !== "" ? " " : "";
      elementCss += this.survey.css.progressButtonsListElementCurrent;
    }
    if (!this.isListElementClickable(index)) {
      elementCss += elementCss !== "" ? " " : "";
      elementCss += this.survey.css.progressButtonsListElementNonClickable;
    }
    return elementCss;
  }
  public clickListElement(index: number): void {
    if (this.survey.isDesignMode) return;
    if (index < this.survey.currentPageNo) {
      this.survey.currentPageNo = index;
    }
    else if (index > this.survey.currentPageNo) {
      for (let i: number = this.survey.currentPageNo; i < index; i++) {
        if (!this.survey.nextPage()) break;
      }
    }
  }
}
