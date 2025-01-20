import { Base, ComputedUpdater } from "./base";
import { SurveyModel } from "./survey";
import { LocalizableString } from "./localizablestring";
import { property } from "./jsonobject";
import { DomDocumentHelper } from "./global_variables_utils";

/**
 * A class that renders a survey in a pop-up window.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/popup-survey/ (linkStyle))
 */
export class PopupSurveyModel extends Base {
  surveyValue: SurveyModel;
  windowElement: HTMLDivElement;

  templateValue: string;
  expandedChangedCallback: () => void;
  showingChangedCallback: () => void;

  constructor(jsonObj: any, initialModel: SurveyModel = null) {
    super();
    if (initialModel) {
      this.surveyValue = initialModel;
    } else {
      this.surveyValue = this.createSurvey(jsonObj);
    }
    this.surveyValue.fitToContainer = true;
    this.windowElement = DomDocumentHelper.createElement("div") as HTMLDivElement;
    this.survey.onComplete.add((survey, options) => {
      this.onSurveyComplete();
    });
    this.registerPropertyChangedHandlers(["isShowing"], () => {
      if (!!this.showingChangedCallback) this.showingChangedCallback();
    });
    this.registerPropertyChangedHandlers(["isExpanded"], () => {
      this.onExpandedChanged();
    });
    this.width = <any>new ComputedUpdater<string>(() => this.survey.width);
    this.width = this.survey.width;
    this.updateCss();
    this.onCreating();
  }
  protected onCreating(): void { }
  public getType(): string {
    return "popupsurvey";
  }
  /**
   * A [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) instance rendered in the pop-up window.
   */
  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  /**
   * Specifies how many seconds the pop-up window should remain open after users complete the survey.
   *
   * Default value: 0 (the window is closed immediately)
   *
   * Set this property to a negative value (for instance, -1) to keep the pop-up window open without a time limit.
   */
  public closeOnCompleteTimeout: number = 0;
  /**
   * Indicates whether the pop-up survey appears on the page, regardless of its [expand state](#isExpanded).
   *
   * You can set this property to `true` or `false` to control visibility of the pop-up survey. Alternatively, you can use the [`show()`](#show) and [`hide()`](#hide) methods.
   */
  public get isShowing(): boolean {
    return this.getPropertyValue("isShowing", false);
  }
  public set isShowing(val: boolean) {
    this.setPropertyValue("isShowing", val);
  }

  public get isFullScreen(): boolean {
    return this.getPropertyValue("isFullScreen", false);
  }
  public set isFullScreen(val: boolean) {
    if (!this.isExpanded && !!val) {
      this.isExpanded = true;
    }
    this.setPropertyValue("isFullScreen", val);
    this.setCssRoot();
  }
  /**
   * Shows the pop-up survey. The survey may appear [expanded or collapsed](#isExpanded).
   *
   * As an alternative to this method, you can set the [`isShowing`](#isShowing) property to `true`.
   * @see hide
   */
  public show(): void {
    this.isShowing = true;
  }
  /**
   * Hides the pop-up survey.
   *
   * As an alternative to this method, you can set the [`isShowing`](#isShowing) property to `false`.
   * @see show
   * @see expand
   * @see collapse
   */
  public hide(): void {
    this.isShowing = false;
  }
  public toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
  }
  /**
   * Indicates whether the pop-up window is expanded or collapsed.
   *
   * You can set this property to `true` or `false` to control the expand state of the pop-up survey. Alternatively, you can use the [`expand()`](#expand) and [`collapse()`](#collapse) methods.
   */
  public get isExpanded(): boolean {
    return this.getPropertyValue("isExpanded", false);
  }
  public set isExpanded(val: boolean) {
    if (!!this.isFullScreen && !val) {
      this.isFullScreen = false;
    }
    this.setPropertyValue("isExpanded", val);
  }
  public get isCollapsed(): boolean {
    return !this.isExpanded;
  }
  protected onExpandedChanged(): void {
    if (!!this.expandedChangedCallback) {
      this.expandedChangedCallback();
    }
    this.updateCssButton();
  }
  /**
   * A title for the pop-up window. If this property is undefined, the title is taken from [`SurveyModel`](#survey)'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.
   */
  public get title(): string {
    return this.survey.title;
  }
  public set title(value: string) {
    this.survey.title = value;
  }
  get locTitle(): LocalizableString {
    if (this.survey.locTitle.isEmpty) return null;
    return this.survey.locTitle;
  }
  get locDescription(): LocalizableString {
    if (this.survey.locTitle.isEmpty) return null;
    return this.survey.locDescription;
  }
  /**
   * Expands the pop-up window.
   *
   * As an alternative to this method, you can set the [`isExpanded`](#isExpanded) property to `true`.
   * @see collapse
   */
  public expand(): void {
    this.isExpanded = true;
  }
  /**
   * Collapses the pop-up window, leaving only the survey title visible.
   *
   * As an alternative to this method, you can set the [`isExpanded`](#isExpanded) property to `false`.
   * @see expand
   */
  public collapse(): void {
    this.isExpanded = false;
  }
  public changeExpandCollapse(): void {
    this.isExpanded = !this.isExpanded;
  }
  /**
   * Specifies whether to display a button that closes the pop-up window.
   *
   * Default value: `false`
   *
   * If you allow users to close the pop-up window, make sure to implement a UI element that opens it. This element should call the [`show()`](#show) method or enable the [`isShowing`](#isShowing) property.
   * @see expand
   * @see collapse
   * @see hide
   */
  public get allowClose(): boolean {
    return this.getPropertyValue("allowClose", false);
  }
  public set allowClose(val: boolean) {
    this.setPropertyValue("allowClose", val);
  }
  /**
   * Specifies whether to display a button that allows respondents to show the pop-up survey in full screen mode.
   *
   * Default value: `false`
   */
  public get allowFullScreen(): boolean {
    return this.getPropertyValue("allowFullScreen", false);
  }
  public set allowFullScreen(val: boolean) {
    this.setPropertyValue("allowFullScreen", val);
  }
  public get css(): any {
    return this.survey.css;
  }
  public get cssButton(): string {
    return this.getPropertyValue("cssButton", "");
  }
  public get cssRoot(): string {
    let result = this.getPropertyValue("cssRoot", "");
    if (this.isCollapsed) result += " " + this.getPropertyValue("cssRootCollapsedMod", "");
    return result;
  }
  public get cssRootCollapsedMod(): string {
    return this.getPropertyValue("cssRootCollapsedMod");
  }
  public get cssRootContent(): string {
    return this.getPropertyValue("cssRootContent");
  }
  public get cssBody(): string {
    return this.getPropertyValue("cssBody", "");
  }
  public get cssHeaderRoot(): string {
    return this.getPropertyValue("cssHeaderRoot", "");
  }
  public get cssHeaderTitleCollapsed(): string {
    return this.getPropertyValue("cssHeaderTitleCollapsed", "");
  }
  public get cssHeaderButtonsContainer(): string {
    return this.getPropertyValue("cssHeaderButtonsContainer", "");
  }
  public get cssHeaderCollapseButton(): string {
    return this.getPropertyValue("cssHeaderCollapseButton", "");
  }
  public get cssHeaderCloseButton(): string {
    return this.getPropertyValue("cssHeaderCloseButton", "");
  }
  public get cssHeaderFullScreenButton(): string {
    return this.getPropertyValue("cssHeaderFullScreenButton", "");
  }
  public get renderedWidth(): string {
    let width = this.getPropertyValue("width", "60%");
    if (width && !isNaN(width)) width = width + "px";
    return width;
  }
  @property() width: string;

  private updateCss() {
    if (!this.css || !this.css.window) return;
    const cssWindow = this.css.window;
    this.setCssRoot();
    this.setPropertyValue("cssRootCollapsedMod", cssWindow.rootCollapsedMod);
    this.setPropertyValue("cssRootContent", cssWindow.rootContent);
    this.setPropertyValue("cssBody", cssWindow.body);
    const cssHeader = cssWindow.header;
    if (!cssHeader) return;
    this.setPropertyValue("cssHeaderRoot", cssHeader.root);
    this.setPropertyValue("cssHeaderTitleCollapsed", cssHeader.titleCollapsed);
    this.setPropertyValue("cssHeaderButtonsContainer", cssHeader.buttonsContainer);
    this.setPropertyValue("cssHeaderCollapseButton", cssHeader.collapseButton);
    this.setPropertyValue("cssHeaderCloseButton", cssHeader.closeButton);
    this.setPropertyValue("cssHeaderFullScreenButton", cssHeader.fullScreenButton);
    this.updateCssButton();
  }
  private setCssRoot() {
    const cssWindow = this.css.window;
    if (this.isFullScreen) {
      this.setPropertyValue("cssRoot", cssWindow.root + " " + cssWindow.rootFullScreenMode);
    } else {
      this.setPropertyValue("cssRoot", cssWindow.root);
    }
  }
  private updateCssButton() {
    const cssHeader = !!this.css.window ? this.css.window.header : null;
    if (!cssHeader) return;
    this.setCssButton(this.isExpanded ? cssHeader.buttonExpanded : cssHeader.buttonCollapsed);
  }
  private setCssButton(val: string): void {
    if (!val) return;
    this.setPropertyValue("cssButton", val);
  }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new SurveyModel(jsonObj);
  }
  protected onSurveyComplete(): void {
    if (this.closeOnCompleteTimeout < 0) return;
    if (this.closeOnCompleteTimeout == 0) {
      this.hide();
    } else {
      var self = this;
      var timerId: any = null;
      var func = function () {
        self.hide();
        clearInterval(timerId);
      };
      timerId = setInterval(func, this.closeOnCompleteTimeout * 1000);
    }
  }
  public onScroll(): void {
    this.survey.onScroll();
  }
}
/**
 * @deprecated Use `PopupSurveyModel` instead.
 */
export class SurveyWindowModel extends PopupSurveyModel { }