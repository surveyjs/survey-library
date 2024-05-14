import { property, Serializer } from "./jsonobject";
import { Helpers } from "./helpers";
import {
  IPage,
  IPanel,
  IElement,
  ISurveyElement,
  IQuestion,
} from "./base-interfaces";
import { PanelModelBase, QuestionRowModel } from "./panel";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { DragDropPageHelperV1 } from "./drag-drop-page-helper-v1";

/**
 * The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions).
 *
 * [View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))
 */
export class PageModel extends PanelModelBase implements IPage {
  private hasShownValue: boolean = false;
  private dragDropPageHelper: DragDropPageHelperV1;

  constructor(name: string = "") {
    super(name);
    this.locTitle.onGetTextCallback = (text: string) => {
      if (this.canShowPageNumber() && text) return this.num + ". " + text;
      return text;
    };
    this.createLocalizableString("navigationDescription", this, true);
    this.dragDropPageHelper = new DragDropPageHelperV1(this);
  }
  public getType(): string {
    return "page";
  }
  public toString(): string {
    return this.name;
  }
  public get isPage(): boolean {
    return true;
  }
  protected canShowPageNumber(): boolean {
    return this.survey && (<any>this.survey).showPageNumbers;
  }
  protected canShowTitle(): boolean {
    return this.survey && (<any>this.survey).showPageTitles;
  }
  /**
   * A caption displayed on a navigation button in the TOC or progress bar. Applies when [`showTOC`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showTOC) is `true` or when the [progress bar is visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar), [`progressBarType`](https://surveyjs.io/form-library/documentation/surveymodel#progressBarType) is set to `"pages"`, and [`progressBarShowPageTitles`](https://surveyjs.io/form-library/documentation/surveymodel#progressBarShowPageTitles) is `true`.
   *
   * If navigation titles are unspecified, the navigation buttons display page [titles](https://surveyjs.io/form-library/documentation/api-reference/page-model#title) or [names](https://surveyjs.io/form-library/documentation/pagemodel#name).
   */
  public get navigationTitle(): string {
    return this.getLocalizableStringText("navigationTitle");
  }
  public set navigationTitle(val: string) {
    this.setLocalizableStringText("navigationTitle", val);
  }
  /**
   * Explanatory text displayed under a navigation button in the progress bar. Applies when the [progress bar is visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar), `SurveyModel`'s [`progressBarType`](https://surveyjs.io/form-library/documentation/surveymodel#progressBarType) is set to `"pages"`, and [`progressBarShowPageTitles`](https://surveyjs.io/form-library/documentation/surveymodel#progressBarShowPageTitles) is `true`.
   */
  public get navigationDescription(): string {
    return this.getLocalizableStringText("navigationDescription");
  }
  public set navigationDescription(val: string) {
    this.setLocalizableStringText("navigationDescription", val);
  }
  public get locNavigationDescription(): LocalizableString {
    return this.getLocalizableString("navigationDescription");
  }
  public navigationLocStrChanged(): void {
    if(this.locNavigationTitle.isEmpty) {
      this.locTitle.strChanged();
    }
    this.locNavigationTitle.strChanged();
    this.locNavigationDescription.strChanged();
  }
  public get passed(): boolean {
    return this.getPropertyValue("passed", false);
  }
  public set passed(val: boolean) {
    this.setPropertyValue("passed", val);
  }
  protected removeFromParent(): void {
    if (!!this.survey) {
      this.removeSelfFromList(this.survey.pages);
    }
  }
  public onFirstRendering(): void {
    if (this.wasShown) return;
    super.onFirstRendering();
  }
  /**
   * The visible index of the page. It has values from 0 to visible page count - 1.
   * @see SurveyModel.visiblePages
   * @see SurveyModel.pages
   */
  public get visibleIndex(): number {
    return this.getPropertyValue("visibleIndex", -1);
  }
  public set visibleIndex(val: number) {
    this.setPropertyValue("visibleIndex", val);
  }
  protected canRenderFirstRows(): boolean {
    return !this.isDesignMode || this.visibleIndex == 0;
  }
  /**
   * Returns `true` if this page is a start page.
   *
   * Refer to the following help topic for more information on how to configure a start page: [Start Page](https://surveyjs.io/form-library/documentation/design-survey-create-a-multi-page-survey#start-page).
   */
  public get isStartPage(): boolean {
    return this.survey && this.survey.isPageStarted(this);
  }
  public get isStarted(): boolean { return this.isStartPage; }
  protected calcCssClasses(css: any): any {
    const classes = { page: {}, error: {}, pageTitle: "", pageDescription: "", row: "", rowMultiple: "", pageRow: "", rowCompact: "", rowFadeIn: "", rowFadeOut: "", rowFadeOutActive: "" };
    this.copyCssClasses(classes.page, css.page);
    this.copyCssClasses(classes.error, css.error);
    if (!!css.pageTitle) {
      classes.pageTitle = css.pageTitle;
    }
    if (!!css.pageDescription) {
      classes.pageDescription = css.pageDescription;
    }
    if (!!css.row) {
      classes.row = css.row;
    }
    if (!!css.pageRow) {
      classes.pageRow = css.pageRow;
    }
    if (!!css.rowMultiple) {
      classes.rowMultiple = css.rowMultiple;
    }
    if (!!css.rowCompact) {
      classes.rowCompact = css.rowCompact;
    }
    if (!!css.rowFadeIn) {
      classes.rowFadeIn = css.rowFadeIn;
    }
    if (!!css.rowFadeOut) {
      classes.rowFadeOut = css.rowFadeOut;
    }
    if (!!css.rowFadeOutActive) {
      classes.rowFadeOutActive = css.rowFadeOutActive;
    }
    if (this.survey) {
      this.survey.updatePageCssClasses(this, classes);
    }
    return classes;
  }
  public get cssTitle(): string {
    if(!this.cssClasses.page) return "";
    return new CssClassBuilder()
      .append(this.cssClasses.page.title)
      .toString();
  }
  public get cssRoot(): string {
    if(!this.cssClasses.page || !this.survey) return "";
    return new CssClassBuilder()
      .append(this.cssClasses.page.root)
      .append(this.cssClasses.page.emptyHeaderRoot, !(<any>this.survey).renderedHasHeader &&
        !((<any>this.survey).isShowProgressBarOnTop && !(<any>this.survey).isStaring))
      .toString();
  }
  protected getCssError(cssClasses: any): string {
    return new CssClassBuilder()
      .append(super.getCssError(cssClasses))
      .append(cssClasses.page.errorsContainer).toString();
  }
  @property({ defaultValue: -1, onSet: (val: number, target: PageModel) => target.onNumChanged(val) }) num: number;
  /**
   * Set this property to "hide" to make "Prev", "Next" and "Complete" buttons are invisible for this page. Set this property to "show" to make these buttons visible, even if survey showNavigationButtons property is false.
   * @see SurveyMode.showNavigationButtons
   */
  public get navigationButtonsVisibility(): string {
    return this.getPropertyValue("navigationButtonsVisibility");
  }
  public set navigationButtonsVisibility(val: string) {
    this.setPropertyValue("navigationButtonsVisibility", val.toLowerCase());
  }
  /**
   * Returns `true` if this is the current page.
   * @see SurveyModel.currentPage
   */
  public get isActive(): boolean {
    return !!this.survey && <PageModel>this.survey.currentPage === this;
  }
  /**
   * Returns `true` if the respondent has already seen this page during the current session.
   */
  public get wasShown(): boolean {
    return this.hasShownValue;
  }
  get hasShown(): boolean {
    return this.wasShown;
  }
  public setWasShown(val: boolean) {
    if (val == this.hasShownValue) return;
    this.hasShownValue = val;
    if (this.isDesignMode || val !== true) return;
    var els = this.elements;
    for (var i = 0; i < els.length; i++) {
      if (els[i].isPanel) {
        (<PanelModelBase><any>els[i]).randomizeElements(this.areQuestionsRandomized);
      }
    }
    this.randomizeElements(this.areQuestionsRandomized);
  }
  /**
   * Scrolls this page to the top.
   */
  public scrollToTop() {
    if (!!this.survey) {
      this.survey.scrollElementToTop(this, null, this, this.id);
    }
  }
  /**
   * A time period that a respondent has spent on this page so far; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).
   * @see maxTimeToFinish
   */
  public timeSpent = 0;
  // public get timeSpent(): number {
  //   return this.getPropertyValue("timeSpent", 0);
  // }
  // public set timeSpent(val: number) {
  //   this.setPropertyValue("timeSpent", val);
  // }
  /**
   * Returns a list of all panels on this page.
   * @param visibleOnly A Boolean value that specifies whether to include only visible panels.
   * @param includingDesignTime For internal use.
   */
  public getAllPanels(
    visibleOnly: boolean = false,
    includingDesignTime: boolean = false
  ): Array<IPanel> {
    var result = new Array<IPanel>();
    this.addPanelsIntoList(result, visibleOnly, includingDesignTime);
    return result;
  }
  public getPanels(visibleOnly: boolean = false, includingDesignTime: boolean = false): Array<IPanel> {
    return this.getAllPanels(visibleOnly, includingDesignTime);
  }
  /**
   * A time period that a respondent has to complete this page; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).
   *
   * A negative value or 0 sets an unlimited time period.
   *
   * Alternatively, you can use the `SurveyModel`'s [`maxTimeToFinishPage`](https://surveyjs.io/form-library/documentation/surveymodel#maxTimeToFinishPage) property to specify identical time periods for all survey pages.
   * @see timeSpent
   */
  public get maxTimeToFinish(): number {
    return this.getPropertyValue("maxTimeToFinish", 0);
  }
  public set maxTimeToFinish(val: number) {
    this.setPropertyValue("maxTimeToFinish", val);
  }
  protected onNumChanged(value: number) { }
  protected onVisibleChanged() {
    if (this.isRandomizing) return;
    super.onVisibleChanged();
    if (this.survey != null) {
      this.survey.pageVisibilityChanged(this, this.isVisible);
    }
  }
  public getDragDropInfo(): any { return this.dragDropPageHelper.getDragDropInfo(); }
  public dragDropStart(
    src: IElement,
    target: IElement,
    nestedPanelDepth: number = -1
  ): void {
    this.dragDropPageHelper.dragDropStart(src, target, nestedPanelDepth);
  }
  public dragDropMoveTo(
    destination: ISurveyElement,
    isBottom: boolean = false,
    isEdge: boolean = false
  ): boolean {
    return this.dragDropPageHelper.dragDropMoveTo(destination, isBottom, isEdge);
  }
  public dragDropFinish(isCancel: boolean = false): IElement {
    return this.dragDropPageHelper.dragDropFinish(isCancel);
  }

  public ensureRowsVisibility() {
    super.ensureRowsVisibility();
    this.getPanels().forEach((panel) => panel.ensureRowsVisibility());
  }
}

Serializer.addClass(
  "page",
  [
    {
      name: "navigationButtonsVisibility",
      default: "inherit",
      choices: ["inherit", "show", "hide"],
    },
    { name: "maxTimeToFinish:number", default: 0, minValue: 0 },
    {
      name: "navigationTitle",
      visibleIf: function (obj: any) {
        return !!obj.survey && (obj.survey.progressBarType === "buttons" || obj.survey.showTOC);
      },
      serializationProperty: "locNavigationTitle",
    },
    {
      name: "navigationDescription",
      visibleIf: function (obj: any) {
        return !!obj.survey && obj.survey.progressBarType === "buttons";
      },
      serializationProperty: "locNavigationDescription",
    },
    { name: "title:text", serializationProperty: "locTitle" },
    { name: "description:text", serializationProperty: "locDescription" },
  ],
  function () {
    return new PageModel();
  },
  "panelbase"
);
