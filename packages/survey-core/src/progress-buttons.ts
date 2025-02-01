import { Base, EventBase } from "./base";
import { surveyCss } from "./defaultCss/defaultCss";
import { PageModel } from "./page";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class ProgressButtons extends Base {
  constructor(public survey: SurveyModel) {
    super();
  }
  public isListElementClickable(index: number | any): boolean {
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
    if (this.isFitToSurveyWidth) {
      result += " " + this.survey.css.progressButtonsFitSurveyWidth;
    }
    return result;
  }
  public getListElementCss(index: number | any): string {
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
  public clearConnectorsWidth(element: HTMLElement): void {
    const listContainerElements = element.querySelectorAll(".sd-progress-buttons__connector");
    for (let i = 0; i < listContainerElements.length; i++) {
      (listContainerElements[i] as HTMLDivElement).style.width = "";
    }
  }
  public adjustConnectors(element: HTMLElement): void {
    const listContainerElement = element.querySelector("ul");
    if (!listContainerElement) return;
    const listContainerElements = element.querySelectorAll(".sd-progress-buttons__connector");
    const circleWidth = this.showItemNumbers ? 36 : 20;
    // const sideCorrection = this.survey.isMobile ? circleWidth : listContainerElement.children[0].clientWidth;
    // const connectorWidth = (listContainerElement.clientWidth - sideCorrection) / (listContainerElement.children.length - 1) - circleWidth;
    const connectorWidth = (listContainerElement.clientWidth - circleWidth) / (listContainerElement.children.length - 1) - circleWidth;
    for (let i = 0; i < listContainerElements.length; i++) {
      (listContainerElements[i] as HTMLDivElement).style.width = connectorWidth + "px";
    }
  }
  public get isFitToSurveyWidth(): boolean {
    if (surveyCss.currentType !== "default") {
      return false;
    }
    return this.survey.progressBarInheritWidthFrom === "survey" && this.survey.widthMode == "static";
  }
  public get progressWidth(): string {
    if (this.isFitToSurveyWidth) {
      return this.survey.renderedWidth;
    }
    return "";
  }
  public get showItemNumbers(): boolean {
    if (surveyCss.currentType !== "default") {
      return false;
    }
    return this.survey.progressBarShowPageNumbers;
  }
  public get showItemTitles(): boolean {
    if (surveyCss.currentType !== "default") {
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
    return this.progressText;
  }
  public get progressText(): string {
    return this.getPropertyValue("progressText", undefined, () => this.survey.getProgressText());
  }
  public resetProgressText(): void {
    this.resetPropertyValue("progressText");
  }
  public onResize: EventBase<ProgressButtons, any> = this.addEvent<ProgressButtons, any>();
  public processResponsiveness(width: number): void {
    this.onResize.fire(this, { width });
  }
}

export interface IProgressButtonsViewModel {
  container: string;
  onResize(canShowItemTitles: boolean): void;
  onUpdateScroller(hasScroller: boolean): void;
  onUpdateSettings(): void;
}

export class ProgressButtonsResponsivityManager {
  private criticalProperties = ["progressBarType", "progressBarShowPageTitles"];
  private timer: any;
  private prevWidth: number;
  private canShowItemTitles = true;
  constructor(private model: ProgressButtons, private element: HTMLElement, private viewModel: IProgressButtonsViewModel) {
    this.model.survey.registerFunctionOnPropertiesValueChanged(this.criticalProperties, () => this.forceUpdate(), "ProgressButtonsResponsivityManager" + this.viewModel.container);
    this.model.onResize.add(this.processResponsiveness);
    this.forceUpdate();
  }
  private forceUpdate() {
    this.viewModel.onUpdateSettings();
    this.processResponsiveness(this.model, {} as any);
  }
  private processResponsiveness = (model: ProgressButtons, options: { width: number }) => {
    this.viewModel.onUpdateScroller(model.isListContainerHasScroller(this.element));
    this.model.clearConnectorsWidth(this.element);
    if (!model.showItemTitles) {
      this.model.adjustConnectors(this.element);
      return;
    }
    if (model.survey.isMobile) {
      this.prevWidth = options.width;
      this.canShowItemTitles = false;
      this.model.adjustConnectors(this.element);
      this.viewModel.onResize(this.canShowItemTitles);
      return;
    }
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (this.prevWidth === undefined || this.prevWidth < options.width && !this.canShowItemTitles || this.prevWidth > options.width && this.canShowItemTitles) {
        this.prevWidth = options.width;
        this.canShowItemTitles = model.isCanShowItemTitles(this.element);
        this.viewModel.onResize(this.canShowItemTitles);
        this.timer = undefined;
      }
    }, 10);
  }
  dispose(): void {
    clearTimeout(this.timer);
    this.model.onResize.remove(this.processResponsiveness);
    this.model.survey.unRegisterFunctionOnPropertiesValueChanged(this.criticalProperties, "ProgressButtonsResponsivityManager" + this.viewModel.container);
    this.element = undefined;
    this.model = undefined;
  }
}