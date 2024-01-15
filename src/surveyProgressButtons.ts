import { EventBase } from "./base";
import { PageModel } from "./page";
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
  public getRootCss(container: string = "center"): string {
    let result = this.survey.css.progressButtonsContainerCenter;
    if (this.survey.css.progressButtonsRoot) {
      result += " " + this.survey.css.progressButtonsRoot + "--" + (["footer", "contentBottom"].indexOf(container) !== -1 ? "bottom" : "top");
    }
    if (this.showPageNumbers && this.survey.css.progressButtonsNumbered) {
      result += " " + this.survey.css.progressButtonsNumbered;
    }
    return result;
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
    this.survey.tryNavigateToPage(this.survey.visiblePages[index]);
  }
  public isListContainerHasScroller(element: HTMLElement): boolean {
    const listContainerElement: HTMLElement = element.querySelector("." + this.survey.css.progressButtonsListContainer);
    if (!!listContainerElement) {
      return listContainerElement.scrollWidth > listContainerElement.offsetWidth;
    }
    return false;
  }
  public showPageNumbers: boolean = true;
  public getPageNumber(page: PageModel): string {
    let result = "";
    if (this.showPageNumbers) {
      result += this.survey.visiblePages.indexOf(page) + 1;
    }
    return result;
  }

  public processResponsiveness(width: number): void {
  }
}
