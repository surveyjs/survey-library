import { property } from "./jsonobject";
import { RendererFactory } from "./rendererFactory";
import { Base } from "./base";
import { Action } from "./actions/action";
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
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { Helpers } from "./helpers";
import { settings } from "./settings";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";

/**
 * Base class of SurveyJS Elements and Survey.
 */
export abstract class SurveyElementCore extends Base implements ILocalizableOwner {
  constructor() {
    super();
    this.createLocTitleProperty();
    this.createLocalizableString("description", this, true);
  }
  protected createLocTitleProperty(): LocalizableString {
    return this.createLocalizableString("title", this, true);
  }
  /**
   * Question, Panel, Page and Survey title. If page and panel is empty then they are not rendered.
   * Question renders question name if the title is empty. Use survey questionTitleTemplate property to change the title question rendering.
   * @see SurveyModel.questionTitleTemplate
  */
  public get title(): string {
    return this.getLocalizableStringText("title", this.getDefaultTitleValue());
  }
  public set title(val: string) {
    this.setLocalizableStringText("title", val);
  }
  get locTitle(): LocalizableString {
    return this.getLocalizableString("title");
  }
  protected getDefaultTitleValue(): string { return undefined; }
  /**
   * Question, Panel and Page description. It renders under element title by using smaller font. Unlike the question title, description can be empty.
   * Please note, this property is hidden for questions without input, for example html question.
   * @see title
  */
  public get description(): string {
    return this.getLocalizableStringText("description");
  }
  public set description(val: string) {
    this.setLocalizableStringText("description", val);
  }
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
  public toggleState(): boolean { return undefined; }
  public get cssClasses(): any { return {}; }
  public get cssTitle(): string { return ""; }
  public get ariaTitleId(): string { return undefined; }
  public get titleTabIndex(): number { return undefined; }
  public get titleAriaExpanded(): boolean { return undefined; }
  //ILocalizableOwner
  public abstract getLocale(): string;
  public abstract getMarkdownHtml(text: string, name: string): string;
  public abstract getRenderer(name: string): string;
  public abstract getRendererContext(locStr: LocalizableString): any;
  public abstract getProcessedText(text: string): string;
}

export enum DragTypeOverMeEnum {
  InsideEmptyPanel = 1,
  MultilineRight,
  MultilineLeft
}

/**
 * Base class of SurveyJS Elements.
 */
export class SurveyElement extends SurveyElementCore implements ISurveyElement {
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
  private expandAction: Action;

  @property({ defaultValue: null }) dragTypeOverMe: DragTypeOverMeEnum;

  public readOnlyChangedCallback: () => void;

  public static ScrollElementToTop(elementId: string): boolean {
    if (!elementId || typeof document === "undefined") return false;
    const el = document.getElementById(elementId);
    if (!el || !el.scrollIntoView) return false;
    const elemTop: number = el.getBoundingClientRect().top;
    if (elemTop < 0) el.scrollIntoView();
    return elemTop < 0;
  }
  public static GetFirstNonTextElement(
    elements: any,
    removeSpaces: boolean = false
  ) {
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
  public static FocusElement(elementId: string): boolean {
    if (!elementId || typeof document === "undefined") return false;
    const res: boolean = SurveyElement.focusElementCore(elementId);
    if (!res) {
      setTimeout(() => {
        SurveyElement.focusElementCore(elementId);
      }, 10);
    }
    return res;
  }
  private static focusElementCore(elementId: string): boolean {
    const el = document.getElementById(elementId);
    if (el) {
      el.focus();
      return true;
    }
    return false;
  }
  public static CreateDisabledDesignElements: boolean = false;
  public disableDesignActions: boolean =
    SurveyElement.CreateDisabledDesignElements;
  constructor(name: string) {
    super();
    this.name = name;
    this.createNewArray("errors");
    this.createNewArray("titleActions");
    this.registerFunctionOnPropertyValueChanged("isReadOnly", () => {
      this.onReadOnlyChanged();
    });
    this.registerFunctionOnPropertyValueChanged("errors", () => {
      this.updateVisibleErrors();
    });
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "state") {
      if (oldValue === "default" || newValue === "default") {
        this.updateTitleActions();
      } else {
        this.updateExpandAction();
      }
      if (this.stateChangedCallback) this.stateChangedCallback();
    }
  }
  protected getSkeletonComponentNameCore(): string {
    if (this.survey) {
      return this.survey.getSkeletonComponentName(this);
    }
    return "";
  }
  public get skeletonComponentName(): string {
    return this.getSkeletonComponentNameCore();
  }
  /**
   * Set this property to "collapsed" to render only Panel title and expanded button and to "expanded" to render the collapsed button in the Panel caption
   */
  public get state(): string {
    return this.getPropertyValue("state");
  }
  public set state(val: string) {
    this.setPropertyValue("state", val);
    this.notifyStateChanged();
  }
  private notifyStateChanged() {
    if (this.survey) {
      this.survey.elementContentVisibilityChanged(this);
    }
  }
  /**
   * Returns true if the Element is in the collapsed state
   * @see state
   * @see collapse
   * @see isExpanded
   */
  public get isCollapsed() {
    if (this.isDesignMode) return;
    return this.state === "collapsed";
  }
  /**
   * Returns true if the Element is in the expanded state
   * @see state
   * @see expand
   * @see isCollapsed
   */
  public get isExpanded() {
    return this.state === "expanded";
  }
  /**
   * Collapse the Element
   * @see state
   */
  public collapse() {
    if (this.isDesignMode) return;
    this.state = "collapsed";
  }
  /**
   * Expand the Element
   * @see state
   */
  public expand() {
    this.state = "expanded";
  }
  /**
   * Toggle element's state
   * @see state
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
  private titleToolbarValue: AdaptiveActionContainer;
  public getTitleToolbar(): AdaptiveActionContainer {
    if (!this.titleToolbarValue) {
      this.titleToolbarValue = new AdaptiveActionContainer();
      this.titleToolbarValue.setItems(this.getTitleActions());
    }
    return this.titleToolbarValue;
  }
  private updateExpandAction() {
    if (!!this.expandAction) {
      this.expandAction.visible = this.isExpanded || this.isCollapsed;
      this.expandAction.innerCss = new CssClassBuilder()
        .append("sv-expand-action").append("sv-expand-action--expanded", this.isExpanded).toString();
    }
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
  private updateTitleActions() {
    let actions = [];
    if (this.hasStateButton && !this.expandAction) {
      this.expandAction = new Action({
        id: "expand-collapse-action",
        title: "",
        disableTabStop: true,
        action: () => {
          this.toggleState();
        },
      });
    }
    if (!!this.expandAction) {
      actions.push(this.expandAction);
    }
    if (!!this.survey) {
      actions = this.survey.getUpdatedElementTitleActions(this, actions);
    }
    this.updateExpandAction();
    this.setPropertyValue("titleActions", actions);
  }
  public get hasTitleActions(): boolean {
    return this.getTitleActions().length > 0;
  }
  public get hasTitleEvents(): boolean {
    return this.hasTitleActions || this.state !== "default";
  }
  public getTitleComponentName(): string {
    var componentName = RendererFactory.Instance.getRenderer(
      "element",
      "title-actions"
    );
    if (componentName == "default") {
      return "sv-default-title";
    }
    return componentName;
  }
  public get titleTabIndex(): number {
    return !this.isPage && this.state !== "default" ? 0 : undefined;
  }
  public get titleAriaExpanded(): boolean {
    if (this.isPage || this.state === "default") return undefined;
    return this.state === "expanded";
  }
  public setSurveyImpl(value: ISurveyImpl) {
    this.surveyImplValue = value;
    if (!this.surveyImplValue) {
      this.setSurveyCore(null);
    } else {
      this.surveyDataValue = this.surveyImplValue.getSurveyData();
      this.setSurveyCore(this.surveyImplValue.getSurvey());
      this.textProcessorValue = this.surveyImplValue.getTextProcessor();
      this.onSetData();
    }
  }
  protected get surveyImpl() {
    return this.surveyImplValue;
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
  protected setSurveyCore(value: ISurvey) {
    this.surveyValue = value;
    if (!!this.surveyChangedCallback) {
      this.surveyChangedCallback();
    }
  }
  /**
   * Returns true if the question in design mode right now.
   */
  public get isDesignMode(): boolean {
    return !!this.survey && this.survey.isDesignMode;
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
  public get isReadOnly(): boolean {
    return false;
  }
  /**
   * Set it to true to make an element question/panel/page readonly.
   * Please note, this property is hidden for question without input, for example html question.
   * @see enableIf
   * @see isReadOnly
   */
  public get readOnly(): boolean {
    return this.getPropertyValue("readOnly", false);
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
  @property() cssClassesValue: any;
  /**
   * Returns all css classes that used for rendering the question, panel or page.
   * You can use survey.onUpdateQuestionCssClasses event to override css classes for a question, survey.onUpdatePanelCssClasses event for a panel and survey.onUpdatePageCssClasses for a page.
   * @see SurveyModel.updateQuestionCssClasses
   * @see SurveyModel.updatePanelCssClasses
   * @see SurveyModel.updatePageCssClasses
   */
  public get cssClasses(): any {
    if (!this.survey) return this.calcCssClasses(this.css);
    if (!this.cssClassesValue) {
      this.cssClassesValue = this.calcCssClasses(this.css);
      this.updateElementCssCore(this.cssClassesValue);
    }
    return this.cssClassesValue;
  }
  protected calcCssClasses(css: any): any { return undefined; }
  protected updateElementCssCore(cssClasses: any) { }
  public get cssError(): string { return ""; }
  public updateElementCss(reNew?: boolean) {
    this.cssClassesValue = undefined;
  }
  protected getIsLoadingFromJson(): boolean {
    if (super.getIsLoadingFromJson()) return true;
    return this.survey ? this.survey.isLoadingFromJson : false;
  }
  /**
   * This is the identifier of a survey element - question or panel.
   * @see valueName
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
   * The list of errors. It is created by callig hasErrors functions
   * @see hasErrors
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
   * Returns true if a question or a container (panel/page) or their chidren have an error.
   * The value can be out of date. hasErrors function should be called to get the correct value.
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
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    return [];
  }
  public get selectedElementInDesign(): SurveyElement {
    return this.selectedElementInDesignValue;
  }
  public set selectedElementInDesign(val: SurveyElement) {
    this.selectedElementInDesignValue = val;
  }
  public updateCustomWidgets() { }

  public onSurveyLoad() { }
  public onFirstRendering() { }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    if (!this.survey) {
      this.onSurveyLoad();
    }
  }
  public setVisibleIndex(index: number): number {
    return 0;
  }
  /**
   * Returns true if it is a page.
   */
  public get isPage() {
    return false;
  }
  /**
   * Returns true if it is a panel.
   */
  public get isPanel() {
    return false;
  }
  /**
   * Returns true if it is a question.
   */
  public get isQuestion() {
    return false;
  }
  public delete() { }
  //ILocalizableOwner
  locOwner: ILocalizableOwner;
  /**
   * Returns the current survey locale
   * @see SurveyModel.locale
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
        : null;
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
      return this.textProcessor.processText(text, this.getUseDisplayValuesInTitle());
    if (this.locOwner) return this.locOwner.getProcessedText(text);
    return text;
  }
  protected getUseDisplayValuesInTitle(): boolean { return true; }
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
  protected onSetData() { }
  public get parent(): IPanel {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: IPanel) {
    this.setPropertyValue("parent", val);
  }

  protected getPage(parent: IPanel): IPage {
    while (parent && parent.parent) parent = parent.parent;
    if (parent && parent.getType() == "page") return <IPage>(<any>parent);
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
  }
  protected getSearchableLocKeys(keys: Array<string>) {
    keys.push("title");
    keys.push("description");
  }
}
