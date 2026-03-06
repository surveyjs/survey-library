
import { Base } from "./base";
import { EventBase } from "./event";
import { surveyCss } from "./defaultCss/defaultCss";
import { propertyArray } from "./jsonobject";
import { PageModel } from "./page";
import { SurveyModel } from "./survey";
import { getLocaleString } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class ProgressButtons extends Base {
  constructor(public survey: SurveyModel) {
    super();
    survey.onPagesVisibleChangedCallback = () => {
      this.visiblePages = survey.visiblePages;
    };
    this.visiblePages = survey.visiblePages;
  }

  @propertyArray() visiblePages: PageModel[];

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
  public minListWidth: number;
  public isCanShowItemTitles(element: HTMLElement): boolean {
    const listContainerElement = element.querySelector("ul");
    if (!listContainerElement || listContainerElement.children.length < 2) return true;
    if (listContainerElement.clientWidth > listContainerElement.parentElement.clientWidth) {
      this.minListWidth = Math.min(this.minListWidth || Infinity, listContainerElement.clientWidth);
      return false;
    }
    if (listContainerElement.parentElement.clientWidth < this.minListWidth) { return false; }
    return true;
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
  public get progressBarAriaLabel(): string {
    return getLocaleString("progressbar", this.survey.getLocale());
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
  private canShowItemTitles = true;
  private pages: number;
  private observer: MutationObserver;

  constructor(private model: ProgressButtons, private element: HTMLElement, private viewModel: IProgressButtonsViewModel) {
    this.model.survey.registerFunctionOnPropertiesValueChanged(this.criticalProperties, () => this.forceUpdate(), "ProgressButtonsResponsivityManager" + this.viewModel.container);
    this.model.onResize.add(this.processResponsiveness);
    this.forceUpdate();
    this.observer = new MutationObserver(() => {
      const els = element.querySelectorAll("ul > li");
      if (this.pages !== els.length) {
        this.pages = els.length;
        this.model.minListWidth = undefined;
        this.forceUpdate();
      }
    });
    this.observer.observe(element, { childList: true, subtree: true });
  }

  private forceUpdate() {
    this.viewModel.onUpdateSettings();
    this.processResponsiveness(this.model, {} as any);
  }

  private processResponsiveness = (model: ProgressButtons, options: { width: number }) => {
    this.viewModel.onUpdateScroller(model.isListContainerHasScroller(this.element));
    if (!model.showItemTitles) {
      return;
    }
    if (model.survey.isMobile) {
      this.canShowItemTitles = false;
      this.viewModel.onResize(this.canShowItemTitles);
      return;
    }
    this.canShowItemTitles = model.isCanShowItemTitles(this.element);
    this.viewModel.onResize(this.canShowItemTitles);
  };

  dispose(): void {
    this.model.onResize.remove(this.processResponsiveness);
    this.model.survey.unRegisterFunctionOnPropertiesValueChanged(this.criticalProperties, "ProgressButtonsResponsivityManager" + this.viewModel.container);
    this.observer.disconnect();
    this.observer = undefined;
    this.element = undefined;
    this.model = undefined;
  }
}