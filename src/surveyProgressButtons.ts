import { EventBase } from "./base";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class SurveyProgressButtonsModel {
  constructor(private survey: SurveyModel) {
  }
  public isListElementClickable(index: number): boolean {
    if (!this.survey.onServerValidateQuestions ||
      (<EventBase<SurveyModel>>this.survey.onServerValidateQuestions).isEmpty ||
      this.survey.checkErrorsMode === "onComplete") {
      return true;
    }
    return index <= this.survey.currentPageNo + 1;
  }
  public getListElementCss(index: number): string {
    if (index >= this.survey.visiblePages.length) return;
    return new CssClassBuilder()
      .append(this.survey.css.progressButtonsListElementPassed, this.survey.visiblePages[index].passed)
      .append(this.survey.css.progressButtonsListElementCurrent, this.survey.currentPageNo === index)
      .append(this.survey.css.progressButtonsListElementNonClickable, !this.isListElementClickable(index))
      .toString();
  }
  public getScrollButtonCss(hasScroller: boolean, isLeftScroll: boolean): string {
    return new CssClassBuilder()
      .append(this.survey.css.progressButtonsImageButtonLeft, isLeftScroll)
      .append(this.survey.css.progressButtonsImageButtonRight, !isLeftScroll)
      .append(this.survey.css.progressButtonsImageButtonHidden, !hasScroller)
      .toString();
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
