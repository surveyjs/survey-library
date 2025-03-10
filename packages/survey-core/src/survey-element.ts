import { JsonObjectProperty, Serializer, property } from "./jsonobject";
import { Base, EventBase } from "./base";
import { Action, IAction } from "./actions/action";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import {
  ISurveyElement,
  IElement,
  IPage,
  IPanel,
  IProgressInfo,
  ISurvey,
  ISurveyData,
  ISurveyImpl,
  ITextProcessor,
  ITitleOwner
} from "./base-interfaces";
import { SurveyError } from "./survey-error";
import { Helpers } from "./helpers";
import { settings } from "./settings";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { ActionContainer, defaultActionBarCss } from "./actions/container";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { SurveyModel } from "./survey";
import { IAnimationConsumer, AnimationBoolean, AnimationProperty } from "./utils/animation";
import { classesToSelector, cleanHtmlElementAfterAnimation, prepareElementForVerticalAnimation } from "./utils/utils";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { PanelModel } from "./panel";
/**
 * A base class for the [`SurveyElement`](https://surveyjs.io/form-library/documentation/surveyelement) and [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) classes.
 */
export abstract class SurveyElementCore extends Base implements ILocalizableOwner {
  constructor() {
    super();
    this.createLocTitleProperty();
  }
  protected createLocTitleProperty(): LocalizableString {
    return this.createLocalizableString("title", this, true);
  }
  /**
   * Returns `true` if the survey element is a page.
   *
   * This property returns `false` for [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model) objects in the following cases:
   *
   * - `SurveyModel`'s [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`.
   * - The page is included in a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).
   *
   * In those cases, the survey creates an internal `PageModel` object to show all questions on one page, and all regular pages become panels.
   */
  public get isPage(): boolean { return false; }
  /**
   * Returns `true` if the survey element is a panel or acts as one.
   *
   * This property returns `true` for `PageModel` objects in the following cases:
   *
   * - `SurveyModel`'s [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`.
   * - The page is included in a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).
   *
   * In those cases, the survey creates an internal `PageModel` object to show all questions on one page, and all regular pages become panels.
   */
  public get isPanel(): boolean { return false; }
  /**
   * Returns `true` if the survey element is a question.
   */
  public get isQuestion(): boolean { return false; }
  /**
   * Returns `true` if the element is a survey.
   */
  public get isSurvey(): boolean { return false; }
  /**
   * A title for the survey element. If `title` is undefined, the `name` property value is displayed instead.
   *
   * Empty pages and panels do not display their titles or names.
   *
   * @see [Configure Question Titles](https://surveyjs.io/form-library/documentation/design-survey-question-titles)
  */
  public get title(): string {
    return this.getLocalizableStringText("title", this.getDefaultTitleValue());
  }
  public set title(val: string) {
    this.setTitleValue(val);
  }
  get locTitle(): LocalizableString {
    return this.getLocalizableString("title");
  }
  protected getDefaultTitleValue(): string { return undefined; }
  protected setTitleValue(val: string): void {
    this.setLocalizableStringText("title", val);
  }
  /**
   * Returns `true` if the survey element has a description.
   * @see description
  */
  public get hasDescription(): boolean {
    return this.getPropertyValue("hasDescription", undefined, () => this.calcDescriptionVisibility());
  }
  public set hasDescription(val: boolean) {
    this.setPropertyValue("hasDescription", val);
  }
  protected calcDescriptionVisibility(): boolean {
    const newDescription = this.description;
    let showPlaceholder = false;
    if (this.isDesignMode) {
      const property: JsonObjectProperty = Serializer.findProperty(this.getType(), "description");
      showPlaceholder = !!(property?.placeholder);
    }
    return !!newDescription || (showPlaceholder && this.isDesignMode);
  }
  protected resetDescriptionVisibility(): void {
    this.resetPropertyValue("hasDescription");
  }
  /**
   * Explanatory text displayed under the title.
   * @see hasDescription
   */
  @property({
    localizable: true, onSet: (newDescription, self) => {
      self.resetDescriptionVisibility();
    }
  }) description: string;
  get locDescription(): LocalizableString {
    return this.getLocalizableString("description");
  }
  public get titleTagName(): string {
    let titleTagName = this.getDefaultTitleTagName();
    const survey = this.getSurvey();
    return !!survey ? survey.getElementTitleTagName(this, titleTagName) : titleTagName;
  }
  protected getDefaultTitleTagName(): string {
    return (<any>settings.titleTags)[this.getType()];
  }
  public get hasTitle(): boolean { return this.title.length > 0; }
  public get hasTitleActions(): boolean { return false; }
  public get hasTitleEvents(): boolean {
    return this.hasTitleActions;
  }
  public getTitleToolbar(): AdaptiveActionContainer { return null; }
  public getTitleOwner(): ITitleOwner { return undefined; }
  public get isTitleOwner(): boolean { return !!this.getTitleOwner(); }
  public get isTitleRenderedAsString(): boolean { return this.getIsTitleRenderedAsString(); }
  public toggleState(): boolean { return undefined; }
  public get cssClasses(): any { return {}; }
  public get cssTitle(): string { return ""; }
  public get ariaTitleId(): string { return undefined; }
  public get ariaDescriptionId(): string { return undefined; }
  public get titleTabIndex(): number { return undefined; }
  public get titleAriaExpanded(): any { return undefined; }
  public get titleAriaRole(): any { return undefined; }
  public get ariaLabel(): string {
    return this.locTitle.renderedHtml;
  }
  public get titleAriaLabel(): string | null {
    return this.ariaLabel;
  }
  protected getIsTitleRenderedAsString(): boolean { return !this.isTitleOwner; }
  //ILocalizableOwner
  public abstract getLocale(): string;
  public abstract getMarkdownHtml(text: string, name: string): string;
  public abstract getRenderer(name: string): string;
  public abstract getRendererContext(locStr: LocalizableString): any;
  public abstract getProcessedText(text: string): string;
}

/**
 * A base class for all survey elements.
 */
export class SurveyElement<E = any> extends SurveyElementCore implements ISurveyElement {
  stateChangedCallback: () => void;

  public static getProgressInfoByElements(
    children: Array<SurveyElement>,
    isRequired: boolean
  ): IProgressInfo {
    const info: IProgressInfo = Base.createProgressInfo();
    for (let i = 0; i < children.length; i++) {
      if (!children[i].isVisible) continue;
      const childInfo: IProgressInfo = children[i].getProgressInfo();
      info.questionCount += childInfo.questionCount;
      info.answeredQuestionCount += childInfo.answeredQuestionCount;
      info.requiredQuestionCount += childInfo.requiredQuestionCount;
      info.requiredAnsweredQuestionCount +=
        childInfo.requiredAnsweredQuestionCount;
    }
    if (isRequired && info.questionCount > 0) {
      if (info.requiredQuestionCount == 0) info.requiredQuestionCount = 1;
      if (info.answeredQuestionCount > 0)
        info.requiredAnsweredQuestionCount = 1;
    }
    return info;
  }
  private surveyImplValue: ISurveyImpl;
  private surveyDataValue: ISurveyData;
  private surveyValue: ISurvey;
  private textProcessorValue: ITextProcessor;
  private selectedElementInDesignValue: SurveyElement = this;

  public readOnlyChangedCallback: () => void;

  private static IsNeedScrollIntoView(el: HTMLElement, checkLeft: boolean, scrollIfVisible?: boolean) {
    const elTop: number = scrollIfVisible ? -1 : el.getBoundingClientRect().top;
    let needScroll = elTop < 0;
    let elLeft: number = -1;
    if (!needScroll && checkLeft) {
      elLeft = el.getBoundingClientRect().left;
      needScroll = elLeft < 0;
    }
    if (!needScroll && DomWindowHelper.isAvailable()) {
      const height = DomWindowHelper.getInnerHeight();
      needScroll = height > 0 && height < elTop;
      if (!needScroll && checkLeft) {
        const width = DomWindowHelper.getInnerWidth();
        needScroll = width > 0 && width < elLeft;
      }
    }
    return needScroll;
  }
  public static ScrollIntoView(el: HTMLElement, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): void {
    el.scrollIntoView(scrollIntoViewOptions);
    if (typeof doneCallback === "function") {
      let lastPos: number = null;
      let same: number = 0;
      const checkPos = () => {
        const newPos = el.getBoundingClientRect().top;
        if (newPos === lastPos) {
          if (same++ > 2) {
            doneCallback();
            return;
          }
        } else {
          lastPos = newPos;
          same = 0;
        }
        requestAnimationFrame(checkPos);
      };
      DomWindowHelper.requestAnimationFrame(checkPos);
    }
  }
  public static ScrollElementToTop(elementId: string, scrollIfVisible?: boolean, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): boolean {
    const { root } = settings.environment;
    if (!elementId || typeof root === "undefined") return false;
    const el = root.getElementById(elementId);
    return SurveyElement.ScrollElementToViewCore(el, false, scrollIfVisible, scrollIntoViewOptions, doneCallback);
  }
  public static ScrollElementToViewCore(el: HTMLElement, checkLeft: boolean, scrollIfVisible?: boolean, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): boolean {
    if (!el || !el.scrollIntoView) {
      doneCallback && doneCallback();
      return false;
    }
    const needScroll = SurveyElement.IsNeedScrollIntoView(el, checkLeft, scrollIfVisible);
    if (needScroll) {
      SurveyElement.ScrollIntoView(el, scrollIntoViewOptions, doneCallback);
    } else {
      doneCallback && doneCallback();
    }
    return needScroll;
  }
  public static GetFirstNonTextElement(elements: any, removeSpaces: boolean = false): any {
    if (!elements || !elements.length || elements.length == 0) return null;
    if (removeSpaces) {
      let tEl = elements[0];
      if (tEl.nodeName === "#text") tEl.data = "";
      tEl = elements[elements.length - 1];
      if (tEl.nodeName === "#text") tEl.data = "";
    }
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].nodeName != "#text" && elements[i].nodeName != "#comment")
        return elements[i];
    }
    return null;
  }
  public static FocusElement(elementId: string, isTimeOut?: boolean, containerEl?: HTMLElement): boolean {
    if (!elementId || !DomDocumentHelper.isAvailable()) return false;
    const res: boolean = !isTimeOut ? SurveyElement.focusElementCore(elementId, containerEl) : false;
    if (!res) {
      setTimeout(() => {
        SurveyElement.focusElementCore(elementId, containerEl);
      }, isTimeOut ? 100 : 10);
    }
    return res;
  }
  private static focusElementCore(elementId: string, containerEl?: HTMLElement): boolean {
    const { root } = settings.environment;
    if (!root && !containerEl) return false;
    const el: HTMLElement = containerEl ? containerEl.querySelector(`#${CSS.escape(elementId)}`) : root.getElementById(elementId);
    // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
    if (el && !(<any>el)["disabled"] && el.style.display !== "none" && el.offsetParent !== null) {
      SurveyElement.ScrollElementToViewCore(el, true, false);
      el.focus();
      return true;
    }
    return false;
  }
  // TODO V2: get rid of this flag
  public static CreateDisabledDesignElements: boolean = false;
  public disableDesignActions: boolean =
    SurveyElement.CreateDisabledDesignElements;
  public get effectiveColSpan(): number {
    const res = this.getPropertyValueWithoutDefault("effectiveColSpan");
    if(res !== undefined) return res;
    this.setRootStyle();
    return this.getPropertyValue("effectiveColSpan");
  }
  /**
   * Specifies how many columns this survey element spans in the grid layout. Applies only if you set the `SurveyModel`'s [`gridLayoutEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#gridLayoutEnabled) property to `true` and define the [`gridLayoutColumns`](https://surveyjs.io/form-library/documentation/api-reference/page-model#gridLayoutColumns) array for the parent page or panel.
   *
   * Default value: 1
   */
  public get colSpan(): number {
    return this.getPropertyValue("colSpan", 1);
  }
  public set colSpan(val: number) {
    this.setPropertyValue("colSpan", val);
  }

  constructor(name: string) {
    super();
    this.setPropertyValueDirectly("name", this.getValidName(name));
    this.createNewArray("errors");
    this.createNewArray("titleActions");
    this.registerPropertyChangedHandlers(["isReadOnly"], () => { this.onReadOnlyChanged(); });
    this.registerPropertyChangedHandlers(["errors"], () => { this.updateVisibleErrors(); });
    this.registerPropertyChangedHandlers(["isSingleInRow"], () => { this.updateElementCss(false); });
    this.registerPropertyChangedHandlers(["minWidth", "maxWidth", "renderWidth", "allowRootStyle", "parent"], () => { this.updateRootStyle(); });
    this.registerPropertyChangedHandlers(["effectiveColSpan"], (val: number) => { this.colSpan = val; });
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "state") {
      this.updateElementCss(false);
      this.notifyStateChanged(oldValue);
      if (this.stateChangedCallback) this.stateChangedCallback();
    }
  }
  protected getSkeletonComponentNameCore(): string {
    if (this.survey) {
      return this.survey.getSkeletonComponentName(this);
    }
    return "sv-skeleton";
  }

  private parentQuestionValue: E = null;
  /**
   * A Dynamic Panel, Dynamic Matrix, or Dropdown Matrix that includes the current question.
   *
   * This property is `null` for standalone questions.
   */
  public get parentQuestion(): E {
    return this.parentQuestionValue;
  }
  setParentQuestion(val: E): void {
    this.parentQuestionValue = val;
    this.onParentQuestionChanged();
  }
  protected onParentQuestionChanged(): void { }
  public updateElementVisibility(): void {
    this.setPropertyValue("isVisible", this.isVisible);
  }

  public get skeletonComponentName(): string {
    return this.getSkeletonComponentNameCore();
  }
  /**
   * Gets and sets the survey element's expand state.
   *
   * Possible values:
   *
   * - `"default"` (default) - The survey element is displayed in full and cannot be collapsed in the UI.
   * - `"expanded"` - The survey element is displayed in full and can be collapsed in the UI.
   * - `"collapsed"` - The survey element displays only `title` and `description` and can be expanded in the UI.
   *
   * @see toggleState
   * @see collapse
   * @see expand
   * @see isCollapsed
   * @see isExpanded
   */
  public get state(): string {
    return this.getPropertyValue("state");
  }
  public set state(val: string) {
    this.setPropertyValue("state", val);
    this.renderedIsExpanded = !this.isCollapsed;
  }
  protected notifyStateChanged(prevState: string): void {
    if (this.survey) {
      this.survey.elementContentVisibilityChanged(this);
    }
  }
  /**
   * Returns `true` if the survey element is collapsed.
   * @see state
   * @see toggleState
   * @see collapse
   * @see expand
   * @see isExpanded
   */
  public get isCollapsed(): boolean {
    return this.state === "collapsed" && !this.isDesignMode;
  }
  /**
   * Returns `true` if the survey element is expanded.
   * @see state
   * @see toggleState
   * @see collapse
   * @see expand
   * @see isCollapsed
   */
  public get isExpanded(): boolean {
    return this.state === "expanded";
  }
  /**
   * Collapses the survey element.
   *
   * In collapsed state, the element displays only `title` and `description`.
   * @see title
   * @see description
   * @see state
   * @see toggleState
   * @see expand
   * @see isCollapsed
   * @see isExpanded
   */
  public collapse() {
    if (this.isDesignMode) return;
    this.state = "collapsed";
  }
  /**
   * Expands the survey element.
   * @see state
   * @see toggleState
   * @see collapse
   * @see isCollapsed
   * @see isExpanded
   */
  public expand() {
    this.state = "expanded";
  }
  /**
   * Toggles the survey element's `state` between collapsed and expanded.
   * @see state
   * @see collapse
   * @see expand
   * @see isCollapsed
   * @see isExpanded
   */
  public toggleState(): boolean {
    if (this.isCollapsed) {
      this.expand();
      return true;
    }
    if (this.isExpanded) {
      this.collapse();
      return false;
    }
    return true;
  }
  public get hasStateButton(): boolean {
    return this.isExpanded || this.isCollapsed;
  }
  public get shortcutText(): string {
    return this.title || this.name;
  }
  private titleToolbarValue: AdaptiveActionContainer;
  public getTitleToolbar(): AdaptiveActionContainer {
    if (!this.titleToolbarValue) {
      this.titleToolbarValue = <AdaptiveActionContainer>this.createActionContainer(true);
      this.titleToolbarValue.locOwner = this;
      this.titleToolbarValue.containerCss = (this.isPanel ? this.cssClasses.panel.titleBar : this.cssClasses.titleBar) || "sv-action-title-bar";
      this.titleToolbarValue.setItems(this.getTitleActions());
    }
    return this.titleToolbarValue;
  }
  protected createActionContainer(allowAdaptiveActions?: boolean): ActionContainer {
    const actionContainer = allowAdaptiveActions ? new AdaptiveActionContainer() : new ActionContainer();
    if (this.survey && !!this.survey.getCss().actionBar) {
      actionContainer.cssClasses = this.survey.getCss().actionBar;
    }

    return actionContainer;
  }
  public get titleActions(): Array<any> {
    return this.getPropertyValue("titleActions");
  }
  private isTitleActionRequested: boolean;
  public getTitleActions(): Array<any> {
    if (!this.isTitleActionRequested) {
      this.updateTitleActions();
      this.isTitleActionRequested = true;
    }
    return this.titleActions;
  }
  protected getDefaultTitleActions(): Array<IAction> {
    return [];
  }
  private updateTitleActions() {
    let actions: Array<IAction> = this.getDefaultTitleActions();
    if (!!this.survey) {
      actions = this.survey.getUpdatedElementTitleActions(this, actions);
    }
    this.setPropertyValue("titleActions", actions);
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    if(!!this.titleToolbarValue) {
      this.titleToolbarValue.locStrsChanged();
    }
  }
  public get hasTitleActions(): boolean {
    return this.getTitleActions().length > 0;
  }
  public get hasTitleEvents(): boolean {
    return this.state !== undefined && this.state !== "default";
  }
  public get titleTabIndex(): number {
    return !this.isPage && this.state !== "default" ? 0 : undefined;
  }
  public get titleAriaExpanded(): any {
    if (this.isPage || this.state === "default") return undefined;
    return this.state === "expanded" ? "true" : "false";
  }

  public get titleAriaRole(): any {
    if (this.isPage || this.state === "default") return undefined;
    return "button";
  }

  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    this.surveyImplValue = value;
    if (!this.surveyImplValue) {
      this.setSurveyCore(null);
      this.surveyDataValue = null;
    } else {
      this.surveyDataValue = this.surveyImplValue.getSurveyData();
      this.setSurveyCore(this.surveyImplValue.getSurvey());
      this.textProcessorValue = this.surveyImplValue.getTextProcessor();
      this.onSetData();
    }
    if (!!this.survey) {
      this.resetDescriptionVisibility();
      this.clearCssClasses();
    }
    this.blockAnimations();
    this.renderedIsExpanded = !this.isCollapsed;
    this.releaseAnimations();
  }
  protected canRunConditions(): boolean {
    return super.canRunConditions() && !!this.data;
  }
  public getDataFilteredValues(): any {
    return !!this.data ? this.data.getFilteredValues() : {};
  }
  public getDataFilteredProperties(): any {
    var props = !!this.data ? this.data.getFilteredProperties() : {};
    props.question = this;
    return props;
  }
  protected get surveyImpl() {
    return this.surveyImplValue;
  }
  /* You shouldn't use this method ever */
  __setData(data: ISurveyData) {
    this.surveyDataValue = data;
  }
  public get data(): ISurveyData {
    return this.surveyDataValue;
  }
  /**
   * Returns the survey object.
   */
  public get survey(): ISurvey {
    return this.getSurvey();
  }
  public getSurvey(live: boolean = false): ISurvey {
    if (!!this.surveyValue) return this.surveyValue;
    if (!!this.surveyImplValue) {
      this.setSurveyCore(this.surveyImplValue.getSurvey());
    }
    return this.surveyValue;
  }
  protected setSurveyCore(value: ISurvey): void {
    this.surveyValue = value;
    if (!!this.surveyChangedCallback) {
      this.surveyChangedCallback();
    }
  }
  public get skeletonHeight(): string {
    let skeletonHeight: string = undefined;
    if (!!this.survey && (this.survey as any).skeletonHeight) {
      skeletonHeight = (this.survey as any).skeletonHeight + "px";
    }
    return skeletonHeight;
  }
  public isContentElement: boolean = false;
  public isEditableTemplateElement: boolean = false;
  public isInteractiveDesignElement: boolean = true;
  protected get isInternal(): boolean {
    return this.isContentElement;
  }
  public get areInvisibleElementsShowing(): boolean {
    return (
      !!this.survey &&
      this.survey.areInvisibleElementsShowing &&
      !this.isContentElement
    );
  }
  public get isVisible(): boolean {
    return true;
  }
  /**
   * Returns `true` if the survey element or its parent element is read-only.
   *
   * If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see readOnly
   */
  public get isReadOnly(): boolean {
    return this.readOnly;
  }
  /**
   * Makes the survey element read-only.
   *
   * If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see isReadOnly
   */
  public get readOnly(): boolean {
    return this.getPropertyValue("readOnly");
  }
  public set readOnly(val: boolean) {
    if (this.readOnly == val) return;
    this.setPropertyValue("readOnly", val);
    if (!this.isLoadingFromJson) {
      this.setPropertyValue("isReadOnly", this.isReadOnly);
    }
  }
  protected onReadOnlyChanged() {
    if (!!this.readOnlyChangedCallback) {
      this.readOnlyChangedCallback();
    }
  }
  private get css(): any {
    return !!this.survey ? this.survey.getCss() : {};
  }
  private isCssValueCalculating: boolean;
  public get cssClassesValue(): any {
    let res = this.getPropertyValueWithoutDefault("cssClassesValue");
    if(!res && !this.isCssValueCalculating) {
      this.isCssValueCalculating = true;
      res = this.createCssClassesValue();
      this.isCssValueCalculating = false;
    }
    return res;
  }
  private createCssClassesValue(): any {
    const res = this.calcCssClasses(this.css);
    this.setPropertyValue("cssClassesValue", res);
    this.onCalcCssClasses(res);
    this.updateElementCssCore(this.cssClassesValue);
    return res;
  }
  protected onCalcCssClasses(classes: any): void {}
  /**
   * Returns an object in which keys are UI elements and values are CSS classes applied to them.
   *
   * Use the following events of the [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) object to override CSS classes:
   *
   * - [`onUpdateQuestionCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdateQuestionCssClasses)
   * - [`onUpdatePanelCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePanelCssClasses)
   * - [`onUpdatePageCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePageCssClasses)
   * - [`onUpdateChoiceItemCss`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdateChoiceItemCss)
   */
  public get cssClasses(): any {
    const _dummy = this.cssClassesValue;
    if (!this.survey) return this.calcCssClasses(this.css);
    if (!this.cssClassesValue) {
      this.createCssClassesValue();
    }
    return this.cssClassesValue;
  }
  public get cssTitleNumber(): any {
    const css = this.cssClasses;
    if (css.number) return css.number;
    return css.panel ? css.panel.number : undefined;
  }
  public get cssRequiredMark(): any {
    const css = this.cssClasses;
    return css.requiredMark || (css.panel && css.panel.requiredMark);
  }
  public getCssTitleExpandableSvg(): string {
    if (this.state === "default") return null;
    return this.cssClasses.titleExpandableSvg;
  }
  protected calcCssClasses(css: any): any { return undefined; }
  protected updateElementCssCore(cssClasses: any): void { }
  public get cssError(): string { return ""; }
  public updateElementCss(reNew?: boolean): void {
    this.clearCssClasses();
  }
  protected clearCssClasses(): void {
    this.resetPropertyValue("cssClassesValue");
  }
  protected getIsLoadingFromJson(): boolean {
    if (super.getIsLoadingFromJson()) return true;
    return this.surveyValue ? this.surveyValue.isLoadingFromJson : false;
  }
  /**
   * A survey element identifier.
   *
   * > Question names must be unique.
   */
  public get name(): string {
    return this.getPropertyValue("name", "");
  }
  public set name(val: string) {
    var oldValue = this.name;
    this.setPropertyValue("name", this.getValidName(val));
    if (!this.isLoadingFromJson && !!oldValue) {
      this.onNameChanged(oldValue);
    }
  }
  protected getValidName(name: string): string {
    return name;
  }
  protected onNameChanged(oldValue: string) { }
  protected updateBindingValue(valueName: string, value: any) {
    if (
      !!this.data &&
      !this.isTwoValueEquals(value, this.data.getValue(valueName))
    ) {
      this.data.setValue(valueName, value, false);
    }
  }
  /**
   * Validation errors. Call the `validate()` method to validate survey element data.
   * @see validate
   */
  public get errors(): Array<SurveyError> {
    return this.getPropertyValue("errors");
  }
  public set errors(val: Array<SurveyError>) {
    this.setPropertyValue("errors", val);
  }
  @property({ defaultValue: false }) hasVisibleErrors: boolean;
  private updateVisibleErrors() {
    var counter = 0;
    for (var i = 0; i < this.errors.length; i++) {
      if (this.errors[i].visible) counter++;
    }
    this.hasVisibleErrors = counter > 0;
  }
  /**
   * Returns `true` if the survey element or its child elements have validation errors.
   *
   * This property contains the result of the most recent validation. This result may be outdated. Call the `validate` method to get an up-to-date value.
   * @see errors
   */
  public get containsErrors(): boolean {
    return this.getPropertyValue("containsErrors", false);
  }
  public updateContainsErrors() {
    this.setPropertyValue("containsErrors", this.getContainsErrors());
  }
  protected getContainsErrors(): boolean {
    return this.errors.length > 0;
  }
  public get selectedElementInDesign(): SurveyElement {
    return this.selectedElementInDesignValue;
  }
  public set selectedElementInDesign(val: SurveyElement) {
    this.selectedElementInDesignValue = val;
  }
  public updateCustomWidgets(): void { }

  public onSurveyLoad(): void { }
  private wasRenderedValue: boolean;
  public get wasRendered(): boolean { return !!this.wasRenderedValue; }
  public onFirstRendering(): void {
    if(!this.wasRendered) {
      this.wasRenderedValue = true;
      this.onFirstRenderingCore();
    }
  }
  protected onFirstRenderingCore(): void {}
  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    if (!this.survey) {
      this.onSurveyLoad();
    }
  }
  public setVisibleIndex(index: number): number {
    return 0;
  }
  public delete(doDispose: boolean): void { }
  //ILocalizableOwner
  locOwner: ILocalizableOwner;
  /**
   * Returns the survey's [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).
   *
   * If a default locale is used, this method returns an empty string. To get the applied locale in this case, use the following code:
   *
   * ```js
   * import { surveyLocalization } from 'survey-core';
   * const defaultLocale = surveyLocalization.defaultLocale;
   * ```
   *
   * @see [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization)
   */
  public getLocale(): string {
    return this.survey
      ? (<ILocalizableOwner>(<any>this.survey)).getLocale()
      : this.locOwner
        ? this.locOwner.getLocale()
        : "";
  }
  public getMarkdownHtml(text: string, name: string): string {
    return this.survey
      ? this.survey.getSurveyMarkdownHtml(this, text, name)
      : this.locOwner
        ? this.locOwner.getMarkdownHtml(text, name)
        : undefined;
  }
  public getRenderer(name: string): string {
    return this.survey && typeof this.survey.getRendererForString === "function"
      ? this.survey.getRendererForString(this, name)
      : this.locOwner && typeof this.locOwner.getRenderer === "function"
        ? this.locOwner.getRenderer(name)
        : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return this.survey && typeof this.survey.getRendererContextForString === "function"
      ? this.survey.getRendererContextForString(this, locStr)
      : this.locOwner && typeof this.locOwner.getRendererContext === "function"
        ? this.locOwner.getRendererContext(locStr)
        : locStr;
  }
  public getProcessedText(text: string): string {
    if (this.isLoadingFromJson) return text;
    if (this.textProcessor)
      return this.textProcessor.processText(text, this.getUseDisplayValuesInDynamicTexts());
    if (this.locOwner) return this.locOwner.getProcessedText(text);
    return text;
  }
  protected getUseDisplayValuesInDynamicTexts(): boolean { return true; }
  protected removeSelfFromList(list: Array<any>) {
    if (!list || !Array.isArray(list)) return;
    const index: number = list.indexOf(this);
    if (index > -1) {
      list.splice(index, 1);
    }
  }
  protected get textProcessor(): ITextProcessor {
    return this.textProcessorValue;
  }
  protected getProcessedHtml(html: string): string {
    if (!html || !this.textProcessor) return html;
    return this.textProcessor.processText(html, true);
  }
  protected onSetData(): void { }
  public get parent(): IPanel {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: IPanel) {
    this.setPropertyValue("parent", val);
  }

  protected getPage(parent: IPanel): IPage {
    while (parent && parent.parent) parent = parent.parent;
    if (parent && parent.isPage) return <IPage>(<any>parent);
    return null;
  }
  protected moveToBase(
    parent: IPanel,
    container: IPanel,
    insertBefore: any = null
  ): boolean {
    if (!container) return false;
    parent.removeElement(<IElement>(<any>this));
    let index = -1;
    if (Helpers.isNumber(insertBefore)) {
      index = parseInt(insertBefore);
    }
    if (index == -1 && !!insertBefore && !!insertBefore.getType) {
      index = container.indexOf(insertBefore);
    }
    container.addElement(<IElement>(<any>this), index);
    return true;
  }

  protected setPage(parent: IPanel, newPage: IPage): void {
    const oldPage: IPage = this.getPage(parent);
    (<any>this).prevSurvey = this.survey;

    //fix for the creator v1: https://github.com/surveyjs/survey-creator/issues/1744
    if (typeof newPage === "string") {
      const survey = this.getSurvey();
      survey.pages.forEach((page: IPage) => {
        if (<any>newPage === page.name) newPage = page;
      });
    }

    if (oldPage === newPage) return;
    if (parent) parent.removeElement(<IElement>(<any>this));
    if (newPage) {
      newPage.addElement(<IElement>(<any>this), -1);
    }
    (<any>this).prevSurvey = undefined;
  }
  protected getSearchableLocKeys(keys: Array<string>) {
    keys.push("title");
    keys.push("description");
  }

  public get isDefaultV2Theme() {
    return this.survey && this.survey.getCss().root.indexOf("sd-root-modern") !== -1;
  }

  public get hasParent() {
    return (this.parent && !this.parent.isPage) || (this.parent === undefined);
  }
  @property({ defaultValue: true }) isSingleInRow: boolean = true;

  private shouldAddRunnerStyles(): boolean {
    return !this.isDesignMode && this.isDefaultV2Theme;
  }

  protected get isCompact(): boolean {
    return this.survey && (<SurveyModel>this.survey)["isCompact"];
  }

  private canHaveFrameStyles() {
    if(<any>this.survey?.currentSingleQuestion === this) return true;
    return (this.parent !== undefined && (!this.hasParent || this.parent && (this.parent as PanelModel).showPanelAsPage));
  }

  protected getHasFrameV2(): boolean {
    return this.shouldAddRunnerStyles() && this.canHaveFrameStyles();
  }
  protected getIsNested(): boolean {
    return this.shouldAddRunnerStyles() && !this.canHaveFrameStyles();
  }
  protected getCssRoot(cssClasses: { [index: string]: string }): string {
    const isExpanadable = !!this.isCollapsed || !!this.isExpanded;
    return new CssClassBuilder()
      .append(cssClasses.withFrame, this.getHasFrameV2() && !this.isCompact)
      .append(cssClasses.compact, this.isCompact && this.getHasFrameV2())
      .append(cssClasses.collapsed, !!this.isCollapsed)
      .append(cssClasses.expandableAnimating, isExpanadable && this.isAnimatingCollapseExpand)
      .append(cssClasses.expanded, !!this.isExpanded && this.renderedIsExpanded)
      .append(cssClasses.expandable, isExpanadable)
      .append(cssClasses.nested, this.getIsNested())
      .toString();
  }

  /**
   * Sets survey element width in CSS values.
   *
   * Default value: ""
   * @see minWidth
   * @see maxWidth
  */
  public get width(): string {
    return this.getPropertyValue("width", "");
  }
  public set width(val: string) {
    this.setPropertyValue("width", val);
  }
  /**
   * Gets or sets minimum survey element width in CSS values.
   *
   * Default value: "300px" (taken from [`settings.minWidth`](https://surveyjs.io/form-library/documentation/settings#minWidth))
   * @see maxWidth
   * @see renderWidth
   * @see width
   */
  public get minWidth(): string {
    return this.getPropertyValue("minWidth");
  }
  public set minWidth(val: string) {
    this.setPropertyValue("minWidth", val);
  }
  /**
   * Gets or sets maximum survey element width in CSS values.
   *
   * Default value: "100%" (taken from [`settings.maxWidth`](https://surveyjs.io/form-library/documentation/settings#maxWidth))
   * @see minWidth
   * @see renderWidth
   * @see width
   */
  public get maxWidth(): string {
    return this.getPropertyValue("maxWidth");
  }
  public set maxWidth(val: string) {
    this.setPropertyValue("maxWidth", val);
  }

  /**
   * Returns a calculated width of the rendered survey element in CSS values.
   * @see width
   * @see minWidth
   * @see maxWidth
   */
  public get renderWidth(): string {
    return this.getPropertyValue("renderWidth", "");
  }
  public set renderWidth(val: string) {
    this.setPropertyValue("renderWidth", val);
  }

  /**
   * Increases or decreases an indent of survey element content from the left edge. Accepts positive integer values and 0.
   */
  public get indent(): number {
    return this.getPropertyValue("indent");
  }
  public set indent(val: number) {
    this.setPropertyValue("indent", val);
  }
  public get rightIndent(): number {
    return this.getPropertyValue("rightIndent", 0);
  }
  public set rightIndent(val: number) {
    this.setPropertyValue("rightIndent", val);
  }
  public getRootStyle(): object {
    const style: any = {};
    if (!!this.paddingLeft) { style["--sv-element-add-padding-left"] = this.paddingLeft; }
    if (!!this.paddingRight) { style["--sv-element-add-padding-right"] = this.paddingRight; }
    return style;
  }
  get paddingLeft(): string {
    return this.getPropertyValue("paddingLeft", undefined, () => this.calcPaddingLeft());
  }
  protected calcPaddingLeft(): string {
    return "";
  }
  get paddingRight(): string {
    return this.getPropertyValue("paddingRight", undefined, () => this.calcPaddingRight());
  }
  set paddingRight(val: string) {
    this.setPropertyValue("paddingRight", val);
  }
  protected calcPaddingRight(): string {
    return "";
  }
  protected resetIndents(): void {
    this.resetPropertyValue("paddingLeft");
    this.resetPropertyValue("paddingRight");
  }

  @property({ defaultValue: true }) allowRootStyle: boolean;
  public get rootStyle(): any {
    return this.getPropertyValue("rootStyle", undefined, () => this.calcRootStyle());
  }
  public set rootStyle(val: any) { this.setPropertyValue("rootStyle", val); }
  public updateRootStyle(): void {
    if(!this.getPropertyValueWithoutDefault("rootStyle")) {
      this.resetPropertyValue("effectiveColSpan");
    } else {
      this.setRootStyle();
    }
  }
  private setRootStyle() {
    this.rootStyle = this.calcRootStyle();
  }
  protected calcRootStyle(): any {
    const style: { [index: string]: any } = {};
    let _width;
    if (!!this.parent) {
      const columns = this.parent.getColumsForElement(this as any);
      _width = columns.reduce((sum, col) => col.effectiveWidth + sum, 0);
      if (!!_width && _width !== 100) {
        style["flexGrow"] = 1;
        style["flexShrink"] = 0;
        style["flexBasis"] = _width + "%";
        style["minWidth"] = undefined;
        style["maxWidth"] = this.maxWidth;
      }
    }
    if (Object.keys(style).length == 0) {
      let minWidth: string | number = "" + this.minWidth;
      if (!!minWidth && minWidth != "auto") {
        if (minWidth.indexOf("px") != -1 && this.survey) {
          minWidth = minWidth.replace("px", "");
          let minWidthNum = parseFloat(minWidth);
          if (!isNaN(minWidthNum)) {
            minWidth = minWidthNum * (this.survey as any).widthScale / 100;
            minWidth = "" + minWidth + "px";
          }
        }
        minWidth = "min(100%, " + minWidth + ")";
      }
      if (this.allowRootStyle && this.renderWidth) {
        style["flexGrow"] = 1;
        style["flexShrink"] = 1;
        style["flexBasis"] = this.renderWidth;
        style["minWidth"] = minWidth;
        style["maxWidth"] = this.maxWidth;
      }
    }
    return style;
  }
  private isContainsSelection(el: any) {
    let elementWithSelection: any = undefined;
    const _document = DomDocumentHelper.getDocument();
    if (DomDocumentHelper.isAvailable() && !!_document && (_document as any)["selection"]) {
      elementWithSelection = (_document as any)["selection"].createRange().parentElement();
    }
    else {
      var selection = DomWindowHelper.getSelection();
      if (!!selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.startOffset !== range.endOffset) {
          elementWithSelection = range.startContainer.parentNode;
        }
      }
    }
    return elementWithSelection == el;
  }
  public get clickTitleFunction(): any {
    if (this.needClickTitleFunction()) {
      return (event?: MouseEvent) => {
        if (!!event && this.isContainsSelection(event.target)) {
          return;
        }
        return this.processTitleClick();
      };
    }
    return undefined;
  }
  protected needClickTitleFunction(): boolean {
    return this.state !== "default";
  }
  protected processTitleClick() {
    if (this.state !== "default") {
      this.toggleState();
    }
  }
  public get hasAdditionalTitleToolbar(): boolean {
    return false;
  }
  public get additionalTitleToolbar(): ActionContainer {
    return this.getAdditionalTitleToolbar();
  }
  protected getAdditionalTitleToolbar(): ActionContainer | null {
    return null;
  }
  protected getCssTitle(cssClasses: any): string {
    if(!cssClasses) return "";
    const isExpandable = this.state !== "default";
    const numInlineLimit = 4;
    return new CssClassBuilder()
      .append(cssClasses.title)
      .append(cssClasses.titleNumInline, ((<any>this).no || "").length > numInlineLimit || isExpandable)
      .append(cssClasses.titleExpandable, isExpandable)
      .append(cssClasses.titleExpanded, this.isExpanded)
      .append(cssClasses.titleCollapsed, this.isCollapsed)
      .append(cssClasses.titleDisabled, this.isDisabledStyle)
      .append(cssClasses.titleReadOnly, this.isReadOnly)
      .append(cssClasses.titleOnError, this.containsErrors).toString();
  }
  public get isDisabledStyle(): boolean {
    return this.getIsDisableAndReadOnlyStyles(false)[1];
  }
  public get isReadOnlyStyle(): boolean {
    return this.getIsDisableAndReadOnlyStyles(false)[0];
  }
  protected getIsDisableAndReadOnlyStyles(itemReadOnly: boolean): Array<boolean> {
    const isPreview = this.isPreviewStyle;
    const isReadOnly = itemReadOnly || this.isReadOnly;
    const isReadOnlyStyle = isReadOnly && !isPreview;
    const isDisableStyle = !this.isDefaultV2Theme && (isReadOnly || isPreview);
    return [isReadOnlyStyle, isDisableStyle];
  }
  public get isPreviewStyle(): boolean {
    return !!this.survey && this.survey.state === "preview";
  }
  public localeChanged(): void {
    super.localeChanged();
    this.resetDescriptionVisibility();
    if (this.errors.length > 0) {
      this.errors.forEach(err => {
        err.updateText();
      });
    }
  }

  private wrapperElement?: HTMLElement;
  public setWrapperElement(element?: HTMLElement) {
    this.wrapperElement = element;
  }
  public getWrapperElement(): HTMLElement {
    return this.wrapperElement;
  }

  @property() private _renderedIsExpanded: boolean = true;
  private _isAnimatingCollapseExpand: boolean = false;
  private set isAnimatingCollapseExpand(val: boolean) {
    if (val !== this._isAnimatingCollapseExpand) {
      this._isAnimatingCollapseExpand = val;
      this.updateElementCss(false);
    }
  }
  private get isAnimatingCollapseExpand() {
    return this._isAnimatingCollapseExpand || this._renderedIsExpanded != this.isExpanded;
  }
  protected onElementExpanded(elementIsRendered: boolean) {
  }
  private getExpandCollapseAnimationOptions(): IAnimationConsumer {
    const beforeRunAnimation = (el: HTMLElement) => {
      this.isAnimatingCollapseExpand = true;
      prepareElementForVerticalAnimation(el);
    };
    const afterRunAnimation = (el: HTMLElement) => {
      this.isAnimatingCollapseExpand = false;
      cleanHtmlElementAfterAnimation(el);
    };
    return {
      getRerenderEvent: () => this.onElementRerendered,
      getEnterOptions: () => {
        const cssClasses = this.isPanel ? this.cssClasses.panel : this.cssClasses;
        return {
          cssClass: cssClasses.contentEnter,
          onBeforeRunAnimation: beforeRunAnimation,
          onAfterRunAnimation: (el) => {
            afterRunAnimation(el);
            this.onElementExpanded(true);
          },
        };
      },
      getLeaveOptions: () => {
        const cssClasses = this.isPanel ? this.cssClasses.panel : this.cssClasses;
        return {
          cssClass: cssClasses.contentLeave,
          onBeforeRunAnimation: beforeRunAnimation,
          onAfterRunAnimation: afterRunAnimation
        };
      },
      getAnimatedElement: () => {
        const cssClasses = this.isPanel ? this.cssClasses.panel : this.cssClasses;
        if (cssClasses.content) {
          const selector = classesToSelector(cssClasses.content);
          if (selector) {
            return this.getWrapperElement()?.querySelector(`:scope ${selector}`);
          }
        }
        return undefined;
      },
      isAnimationEnabled: () => this.isExpandCollapseAnimationEnabled
    };
  }

  private get isExpandCollapseAnimationEnabled() {
    return this.animationAllowed && !this.isDesignMode;
  }

  private animationCollapsed = new AnimationBoolean(this.getExpandCollapseAnimationOptions(), (val) => {
    this._renderedIsExpanded = val;
    if (this.animationAllowed) {
      if (val) {
        this.isAnimatingCollapseExpand = true;
      } else {
        this.updateElementCss(false);
      }
    }
  }, () => this.renderedIsExpanded);
  public set renderedIsExpanded(val: boolean) {
    const oldValue = this._renderedIsExpanded;
    this.animationCollapsed.sync(val);
    if (!this.isExpandCollapseAnimationEnabled && !oldValue && this.renderedIsExpanded) {
      this.onElementExpanded(false);
    }
  }

  public get renderedIsExpanded(): boolean {
    return !!this._renderedIsExpanded;
  }
  protected getIsAnimationAllowed(): boolean {
    return super.getIsAnimationAllowed() && !!this.survey && !(this.survey as SurveyModel)["isEndLoadingFromJson"];
  }

  public onAfterRenderElement: EventBase<SurveyElement<E>, any> = this.addEvent<SurveyElement<E>, any>();
  public afterRenderCore(element: HTMLElement): void {
    this.onAfterRenderElement.fire(this, { htmlElement: element });
  }

  public dispose(): void {
    super.dispose();
    if (this.titleToolbarValue) {
      this.titleToolbarValue.dispose();
    }
  }
}

export class RenderingCompletedAwaiter {
  constructor(private _elements: Array<SurveyElement>, private _renderedHandler: () => void, waitingTimeout = 100) {
    this._elements.forEach(element => {
      if (element.onAfterRenderElement) {
        element.onAfterRenderElement.add(this._elementRenderedHandler);
        this._elementsToRenderCount++;
      }
    });
    if (this._elementsToRenderCount > 0) {
      this._elementsToRenderTimer = setTimeout(() => {
        if (this._elementsToRenderCount > 0) {
          this.visibleElementsRendered();
        }
      }, waitingTimeout);
    } else {
      this.visibleElementsRendered();
    }
  }
  private _elementsToRenderCount = 0;
  private _elementsToRenderTimer: any = undefined;
  private _elementRenderedHandler = (s: SurveyElement, o: any) => {
    s.onAfterRenderElement?.remove(this._elementRenderedHandler);
    this._elementsToRenderCount--;
    if (this._elementsToRenderCount <= 0) {
      this.visibleElementsRendered();
    }
  }
  private stopWaitingForElementsRendering() {
    if (this._elementsToRenderTimer) {
      clearTimeout(this._elementsToRenderTimer);
      this._elementsToRenderTimer = undefined;
    }
    this._elements.forEach(element => {
      element.onAfterRenderElement?.remove(this._elementRenderedHandler);
    });
    this._elementsToRenderCount = 0;
  }
  private visibleElementsRendered(): void {
    const renderedHandler = this._renderedHandler;
    this.dispose();
    if (typeof renderedHandler == "function") {
      renderedHandler();
    }
  }
  public dispose(): void {
    this.stopWaitingForElementsRendering();
    this._elements = undefined;
    this._renderedHandler = undefined;
  }
}