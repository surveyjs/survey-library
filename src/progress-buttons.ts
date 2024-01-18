import { Base, EventBase } from "./base";
import { surveyCss } from "./defaultCss/defaultV2Css";
import { PageModel } from "./page";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class ProgressButtons extends Base {
  constructor(public survey: SurveyModel) {
    super();
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
      result += " " + this.survey.css.progressButtonsRoot + " " + this.survey.css.progressButtonsRoot + "--" + (["footer", "contentBottom"].indexOf(container) !== -1 ? "bottom" : "top");
      result += " " + this.survey.css.progressButtonsRoot + "--" + (this.showItemTitles ? "with-titles" : "no-titles");
    }
    if (this.showItemNumbers && this.survey.css.progressButtonsNumbered) {
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
  public clickListElement(element: number | PageModel): void {
    if (!(element instanceof PageModel)) {
      element = this.survey.visiblePages[element];
    }
    this.survey.tryNavigateToPage(element);
  }
  public isListContainerHasScroller(element: HTMLElement): boolean {
    const listContainerElement: HTMLElement = element.querySelector("." + this.survey.css.progressButtonsListContainer);
    if (!!listContainerElement) {
      return listContainerElement.scrollWidth > listContainerElement.offsetWidth;
    }
    return false;
  }
  public isCanShowItemTitles(element: HTMLElement): boolean {
    const listContainerElement = element.querySelector("ul");
    if (!listContainerElement || listContainerElement.children.length < 2) return true;
    if (listContainerElement.clientWidth > listContainerElement.parentElement.clientWidth) {
      return false;
    }
    const expectedElementWidth = listContainerElement.children[0].clientWidth;
    for (let i = 0; i < listContainerElement.children.length; i++) {
      if (Math.abs(listContainerElement.children[i].clientWidth - expectedElementWidth) > 5) {
        return false;
      }
    }
    return true;
  }
  public adjustConnectors(element: HTMLElement): void {
    const listContainerElement = element.querySelector("ul");
    if (!listContainerElement) return;
    const listContainerElements = element.querySelectorAll(".sd-progress-buttons__connector");
    const connectorWidth = listContainerElement.clientWidth / (listContainerElement.children.length - 1) - 4;
    for (let i = 0; i < listContainerElements.length; i++) {
      (listContainerElements[i] as HTMLDivElement).style.width = connectorWidth + "px";
    }
  }
  public get showItemNumbers(): boolean {
    if (surveyCss.currentType !== "defaultV2") {
      return false;
    }
    return this.survey.progressBarShowPageNumbers;
  }
  public get showItemTitles(): boolean {
    if (surveyCss.currentType !== "defaultV2") {
      return true;
    }
    return this.survey.progressBarShowPageTitles;
  }
  public getItemNumber(page: PageModel): string {
    let result = "";
    if (this.showItemNumbers) {
      result += this.survey.visiblePages.indexOf(page) + 1;
    }
    return result;
  }
  public get headerText(): string {
    return this.survey.currentPage ? this.survey.currentPage.renderedNavigationTitle : "";
  }
  public get footerText(): string {
    return this.survey.progressText;
  }
  public onResize: EventBase<ProgressButtons, any> = this.addEvent<ProgressButtons, any>();
  public processResponsiveness(width: number): void {
    this.onResize.fire(this, { width });
  }
}