import { property, Serializer } from "./jsonobject";
import { Helpers } from "./helpers";
import {
  IPage,
  IPanel,
  IElement,
  ISurveyElement,
  ISurveyImpl,
  ISurvey,
} from "./base-interfaces";
import { PanelModelBase, PanelModel } from "./panel";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions).
 *
 * [View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))
 */
export class PageModel extends PanelModel implements IPage {
  private hasShownValue: boolean = false;
  public isPageContainer: boolean;

  constructor(name: string = "") {
    super(name);
    this.createLocalizableString("navigationDescription", this, true);
  }
  public getType(): string {
    return "page";
  }
  public toString(): string {
    return this.name;
  }
  public get isPage(): boolean {
    return !this.isPanel;
  }
  public get isPanel(): boolean {
    return !!this.parent;
  }
  public get showPanelAsPage(): boolean {
    return true;
  }
  public get hasEditButton(): boolean {
    return this.isPanel && this.survey && this.survey.state === "preview"
     && !!this.parent && !this.parent.isPanel;
  }
  protected getElementsForRows(): Array<IElement> {
    if(!this.isStartPage) {
      const q = this.survey?.currentSingleQuestion;
      if(!!q) {
        if((<any>q).page === this) return [q];
        return [];
      }
    }
    return super.getElementsForRows();
  }
  protected disposeElements(): void {
    if(!this.isPageContainer) {
      super.disposeElements();
    }
  }
  protected onRemoveElement(element: IElement): void {
    if(this.isPageContainer) {
      element.parent = null;
      this.unregisterElementPropertiesChanged(element);
    } else {
      super.onRemoveElement(element);
    }
  }
  public getTemplate(): string {
    return this.isPanel ? "panel" : super.getTemplate();
  }
  public get no(): string {
    if(!this.canShowPageNumber() || !this.survey) return "";
    let no = this.isStartPage ? "" : this.num + ". ";
    return this.survey.getUpdatedPageNo(this, no);
  }
  public get cssTitleNumber(): string {
    return this.cssClasses.page.number;
  }
  public getCssTitleExpandableSvg(): string {
    return null;
  }
  public get cssRequiredMark(): string {
    return "";
  }
  protected canShowPageNumber(): boolean {
    return this.survey && (<any>this.survey).showPageNumbers;
  }
  protected canShowTitle(survey: ISurvey): boolean {
    return !survey || (<any>survey).showPageTitles;
  }
  protected setTitleValue(val: string): void {
    super.setTitleValue(val);
    this.navigationLocStrChanged();
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
  getMarkdownHtml(text: string, name: string): string {
    const result = super.getMarkdownHtml(text, name);
    if (name === "navigationTitle" && this.canShowPageNumber() && result) {
      return this.num + ". " + result;
    }
    return result;
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
    if(this.isPanel) return super.calcCssClasses(css);
    const classes = { page: {}, error: {}, pageTitle: "", pageDescription: "", row: "", rowMultiple: "", pageRow: "", rowCompact: "", rowEnter: "", rowLeave: "", rowDelayedEnter: "", rowReplace: "" };
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
    if (!!css.rowEnter) {
      classes.rowEnter = css.rowEnter;
    }
    if (!!css.rowDelayedEnter) {
      classes.rowDelayedEnter = css.rowDelayedEnter;
    }
    if (!!css.rowLeave) {
      classes.rowLeave = css.rowLeave;
    }
    if (!!css.rowReplace) {
      classes.rowReplace = css.rowReplace;
    }
    if (this.survey) {
      this.survey.updatePageCssClasses(this, classes);
    }
    return classes;
  }
  protected getCssPanelTitle(): string {
    if(this.isPanel) return super.getCssPanelTitle();
    if(!this.cssClasses.page) return "";
    return new CssClassBuilder()
      .append(this.cssClasses.page.title)
      .toString();
  }
  public get cssRoot(): string {
    if(this.isPanel || !this.cssClasses.page || !this.survey) return "";
    return new CssClassBuilder()
      .append(this.cssClasses.page.root)
      .append(this.cssClasses.page.emptyHeaderRoot, !(<any>this.survey).renderedHasHeader &&
        !((<any>this.survey).isShowProgressBarOnTop && !(<any>this.survey).isStaring))
      .toString();
  }
  protected getCssError(cssClasses: any): string {
    if(this.isPanel) return super.getCssError(cssClasses);
    return new CssClassBuilder()
      .append(super.getCssError(cssClasses))
      .append(cssClasses.page.errorsContainer).toString();
  }
  @property({ defaultValue: -1, onSet: (val: number, target: PageModel) => target.onNumChanged(val) }) num: number;
  /**
   * @deprecated Use the [`showNavigationButtons`](https://surveyjs.io/form-library/documentation/api-reference/page-model#showNavigationButtons) property instead.
   */
  public get navigationButtonsVisibility(): string {
    const result = this.showNavigationButtons;
    if (result === undefined || result === null) {
      return "inherit";
    }
    return result ? "show" : "hide";
  }
  public set navigationButtonsVisibility(val: string) {
    if (typeof val == "string") {
      val = val.toLowerCase();
    }
    this.showNavigationButtons = val;
  }
  /**
   * Gets or sets the visibility of the Start, Next, Previous, and Complete navigation buttons on this page. Overrides the [`showNavigationButtons`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showNavigationButtons) property specified on the survey-level.
   *
   * Default value: `undefined` (the visibility depends on the survey-level setting)
   */
  public get showNavigationButtons(): boolean | string {
    return this.getPropertyValue("showNavigationButtons", undefined);
  }
  public set showNavigationButtons(val: boolean | string) {
    this.setShowNavigationButtonsProperty(val);
  }
  public setShowNavigationButtonsProperty(val: boolean | string) {
    if (val === true || val === false) {
      this.setPropertyValue("showNavigationButtons", val);
    } else if (val === "show") {
      this.setPropertyValue("showNavigationButtons", true);
    } else if (val === "hide") {
      this.setPropertyValue("showNavigationButtons", false);
    } else {
      this.setPropertyValue("showNavigationButtons", undefined);
    }
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
  public setWasShown(val: boolean): void {
    if (val == this.hasShownValue) return;
    this.hasShownValue = val;
    if (this.isDesignMode || val !== true) return;
    var els = this.elements;
    for (var i = 0; i < els.length; i++) {
      if (els[i].isPanel) {
        (<PanelModelBase><any>els[i]).randomizeElements(this.areQuestionsRandomized);
      }
    }
    if(this.randomizeElements(this.areQuestionsRandomized)) {
      const singleQuestion: any = this.survey?.currentSingleQuestion;
      if(singleQuestion?.page === this) {
        this.survey.currentSingleQuestion = this.getFirstVisibleQuestion();
      }
    }
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
   * @see timeLimit
   */
  public timeSpent = 0;
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
   * Default value: 0 (time is unlimited)
   *
   * Alternatively, you can use the `SurveyModel`'s [`timeLimitPerPage`](https://surveyjs.io/form-library/documentation/surveymodel#timeLimitPerPage) property to specify identical time periods for all survey pages.
   * @see timeSpent
   */
  public get timeLimit(): number {
    return this.getPropertyValue("timeLimit", 0);
  }
  public set timeLimit(val: number) {
    this.setPropertyValue("timeLimit", val);
  }
  /**
   * @deprecated Use the [`timeLimit`](https://surveyjs.io/form-library/documentation/api-reference/page-model#timeLimit) property instead.
   */
  public get maxTimeToFinish(): number {
    return this.timeLimit;
  }
  public set maxTimeToFinish(val: number) {
    this.timeLimit = val;
  }
  public getMaxTimeToFinish(): number {
    if(this.timeLimit !== 0) return this.timeLimit;
    const res = !!this.survey ? this.survey.timeLimitPerPage : 0;
    return res > 0 ? res : 0;
  }
  protected onNumChanged(value: number) { }
  protected onVisibleChanged() {
    if (this.isRandomizing) return;
    super.onVisibleChanged();
    if (this.survey != null) {
      this.survey.pageVisibilityChanged(this, this.isVisible);
    }
  }

  public ensureRowsVisibility() {
    super.ensureRowsVisibility();
    this.getPanels().forEach((panel) => panel.ensureRowsVisibility());
  }

  private _isReadyForClean: boolean = true;
  public get isReadyForClean(): boolean {
    return this._isReadyForClean;
  }
  public set isReadyForClean(val: boolean) {
    const oldValue = this._isReadyForClean;
    this._isReadyForClean = val;
    if(this._isReadyForClean !== oldValue) {
      this.isReadyForCleanChangedCallback && this.isReadyForCleanChangedCallback();
    }
  }
  public isReadyForCleanChangedCallback: () => void;
  public enableOnElementRerenderedEvent(): void {
    super.enableOnElementRerenderedEvent();
    this.isReadyForClean = false;
  }
  public disableOnElementRerenderedEvent(): void {
    super.disableOnElementRerenderedEvent();
    this.isReadyForClean = true;
  }
}

Serializer.addClass(
  "page",
  [
    {
      name: "showNavigationButtons:boolean",
      defaultFunc: () => undefined,
      onSetValue: function (obj: any, value: any) {
        obj && obj.setShowNavigationButtonsProperty(value);
      },
      alternativeName: "navigationButtonsVisibility"
    },
    {
      name: "timeLimit:number",
      alternativeName: "maxTimeToFinish",
      default: 0,
      minValue: 0,
      visibleIf: (obj: any) => {
        return !!obj.survey && obj.survey.showTimer;
      }
    },
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
    { name: "state", visible: false },
    { name: "isRequired", visible: false },
    { name: "startWithNewLine", visible: false },
    { name: "width", visible: false },
    { name: "minWidth", visible: false },
    { name: "maxWidth", visible: false },
    { name: "colSpan", visible: false, isSerializable: false },
    { name: "effectiveColSpan:number", visible: false, isSerializable: false },
    { name: "innerIndent", visible: false },
    { name: "indent", visible: false },
    { name: "page", visible: false, isSerializable: false },
    { name: "showNumber", visible: false },
    { name: "showQuestionNumbers", visible: false },
    { name: "questionStartIndex", visible: false },
    { name: "allowAdaptiveActions", visible: false },
    { name: "requiredErrorText:text", serializationProperty: "locRequiredErrorText", visible: false },
  ],
  function () {
    return new PageModel();
  },
  "panel"
);
