import { Helpers } from "./helpers";
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
} from "./base-interfaces";
import { SurveyError } from "./survey-error";

/**
 * Base class of SurveyJS Elements.
 */
export class SurveyElement extends Base implements ISurveyElement {
  stateChangedCallback: () => void;

  public static getProgressInfoByElements(
    children: Array<SurveyElement>,
    isRequired: boolean
  ): IProgressInfo {
    var info = Base.createProgressInfo();
    for (var i = 0; i < children.length; i++) {
      if (!children[i].isVisible) continue;
      var childInfo = children[i].getProgressInfo();
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
  public readOnlyChangedCallback: () => void;

  public static ScrollElementToTop(elementId: string): boolean {
    if (!elementId || typeof document === "undefined") return false;
    var el = document.getElementById(elementId);
    if (!el || !el.scrollIntoView) return false;
    var elemTop = el.getBoundingClientRect().top;
    if (elemTop < 0) el.scrollIntoView();
    return elemTop < 0;
  }
  public static GetFirstNonTextElement(
    elements: any,
    removeSpaces: boolean = false
  ) {
    if (!elements || !elements.length || elements.length == 0) return null;
    if (removeSpaces) {
      var tEl = elements[0];
      if (tEl.nodeName === "#text") tEl.data = "";
      tEl = elements[elements.length - 1];
      if (tEl.nodeName === "#text") tEl.data = "";
    }
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].nodeName != "#text" && elements[i].nodeName != "#comment")
        return elements[i];
    }
    return null;
  }
  public static FocusElement(elementId: string): boolean {
    if (!elementId || typeof document === "undefined") return false;
    var res = SurveyElement.focusElementCore(elementId);
    if (!res) {
      setTimeout(() => {
        SurveyElement.focusElementCore(elementId);
      }, 10);
    }
    return res;
  }
  private static focusElementCore(elementId: string): boolean {
    var el = document.getElementById(elementId);
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
    return this.state == "collapsed";
  }
  /**
   * Returns true if the Element is in the expanded state
   * @see state
   * @see expand
   * @see isCollapsed
   */
  public get isExpanded() {
    return this.state == "expanded";
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
      this.expandAction.innerCss =
        "sv-expand-action" +
        (this.isExpanded ? " sv-expand-action--expanded" : "");
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
    var actions = [];
    if (this.hasStateButton && !this.expandAction) {
      this.expandAction = new Action({
        id: "expand-collapse-action",
        title: "",
        active: false,
        enabled: false, //TODO
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
    return this.state !== "default" ? 0 : undefined;
  }
  public get titleAriaExpanded(): boolean {
    if (this.state === "default") return undefined;
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
  public updateElementCss(reNew?: boolean) {}
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
  protected onNameChanged(oldValue: string) {}
  protected updateBindingValue(valueName: string, value: any) {
    if (
      !!this.data &&
      !Helpers.isTwoValueEquals(value, this.data.getValue(valueName))
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
  public updateCustomWidgets() {}

  public onSurveyLoad() {}
  public onFirstRendering() {}
  endLoadingFromJson() {
    super.endLoadingFromJson();
    if (!this.survey) {
      this.onSurveyLoad();
    }
  }
  public setVisibleIndex(index: number): number {
    return 0;
  }
  public get isPage() {
    return false;
  }
  /**
   * Return false if it is not panel.
   */
  public get isPanel() {
    return false;
  }
  public delete() {}
  protected removeSelfFromList(list: Array<any>) {
    if (!list || !Array.isArray(list)) return;
    var index = list.indexOf(this);
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
  protected onSetData() {}
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
    var index = -1;
    if (Helpers.isNumber(insertBefore)) {
      index = parseInt(insertBefore);
    }
    if (index == -1 && !!insertBefore && !!insertBefore.getType) {
      index = container.indexOf(insertBefore);
    }
    container.addElement(<IElement>(<any>this), index);
    return true;
  }

  protected setPage(parent: IPanel, val: IPage) {
    var oldPage = this.getPage(parent);
    if (oldPage === val) return;
    if (parent) parent.removeElement(<IElement>(<any>this));
    if (val) {
      val.addElement(<IElement>(<any>this), -1);
    }
  }
  protected getSearchableLocKeys(keys: Array<string>) {
    keys.push("title");
    keys.push("description");
  }
}
