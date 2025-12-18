import { HashTable, Helpers } from "./helpers";
import {
  IElement,
  IQuestion,
  IPanel,
  ISurveyData,
  ISurvey,
  ISurveyImpl,
  ITextProcessor,
  IProgressInfo,
  IPlainDataOptions, IElementUIState
} from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { LocalizableString } from "./localizablestring";
import { TextContextProcessor } from "./textPreProcessor";
import { Base } from "./base";
import { Question, QuestionValueGetterContext, IConditionObject, IQuestionPlainData, QuestionItemValueGetterContext, QuestionArrayGetterContext, ValidationContext } from "./question";
import { PanelModel } from "./panel";
import { JsonObject, property, propertyArray, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { KeyDuplicationError } from "./error";
import { settings } from "./settings";
import { classesToSelector, cleanHtmlElementAfterAnimation, confirmActionAsync, prepareElementForVerticalAnimation, setPropertiesOnElementForAnimation } from "./utils/utils";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ActionContainer } from "./actions/container";
import { Action, IAction } from "./actions/action";
import { ComputedUpdater } from "./base";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { ITheme } from "./themes";
import { AnimationGroup, AnimationProperty, AnimationTab, IAnimationConsumer, IAnimationGroupConsumer } from "./utils/animation";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "./questionSingleInputSummary";
import { getLocaleString } from "./surveyStrings";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, IValueGetterItem, VariableGetterContext } from "./conditionProcessValue";

export interface IQuestionPanelDynamicData {
  getItemIndex(item: ISurveyData): number;
  getVisibleItemIndex(item: ISurveyData): number;
  getPanelItemData(item: ISurveyData): any;
  setPanelItemData(item: ISurveyData, name: string, val: any): any;
  getSharedQuestionFromArray(name: string, panelIndex: number): Question;
  getSurvey(): ISurvey;
  getRootData(): ISurveyData;
}
export class PanelDynamicItemGetterContext extends QuestionItemValueGetterContext {
  constructor(private item: QuestionPanelDynamicItem) {
    super();
  }
  protected getIndex(): number { return this.panelIndex; }
  protected getQuestionData(): Question { return <Question>(<any>this.item.data); }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length === 0) return undefined;
    if (path.length === 1) {
      const val = this.getPanelValue(path[0].name);
      if (val !== undefined) {
        return { isFound: true, value: val, context: this };
      }
    }
    const expVar = settings.expressionVariables;
    const panelPrefix = expVar.panel;
    if (path.length > 1) {
      const dIndex = path[0].name === expVar.prevPanel ? -1 : path[0].name === expVar.nextPanel ? 1 : 0;
      if (dIndex !== 0) {
        const index = this.visiblePanelIndex + dIndex;
        if (index < 0 || index >= this.getPanels(true).length) return { isFound: true, value: undefined, context: this };
        const panel = this.getPanels(true)[index];
        path[0].name = panelPrefix;
        params.index = index;
        return (<any>panel.data).getValueGetterContext().getValue(params);
      }
    }
    if (path.length > 1 && path[0].name.toLocaleLowerCase() === expVar.parentPanel.toLocaleLowerCase()) {
      const q = <Question>(<any>this.item.data);
      if (!!q && !!q.parentQuestion && !!q.parent && !!(<any>q.parent).data) {
        path[0].name = panelPrefix;
        params.isRoot = true;
        return (<QuestionPanelDynamicItem>(<any>q.parent).data).getValueGetterContext().getValue(params);
      }
    }
    const panel = this.item.panel;
    const isPanelPrefix = path[0].name === panelPrefix;
    if (isPanelPrefix || !params.isRoot) {
      if (isPanelPrefix) {
        path.shift();
      }
      const res = new QuestionArrayGetterContext(panel.questions).getValue(params);
      if (!!res && res.isFound) return res;
      const allValues = this.item.getAllValues();
      if (params.isRoot) {
        const res = this.getValueFromBindedQuestions(path, allValues);
        if (!!res) return res;
      }
      params.isRoot = false;
      return new VariableGetterContext(allValues).getValue(params);
    }
    return undefined;
  }
  getTextValue(name: string, value: any, isDisplayValue: boolean): string {
    name = name.toLocaleLowerCase();
    if ([this.indexVar, this.visIndexVar].indexOf(name) > -1 && value > -1) {
      value ++;
    }
    return super.getTextValue(name, value, isDisplayValue);
  }
  private get indexVar() { return settings.expressionVariables.panelIndex.toLocaleLowerCase(); }
  private get visIndexVar() { return settings.expressionVariables.visiblePanelIndex.toLocaleLowerCase(); }

  private getPanelValue(name: string): any {
    name = name.toLocaleLowerCase();
    if (name === this.indexVar) {
      return this.panelIndex;
    }
    if (name == this.visIndexVar) {
      return this.visiblePanelIndex;
    }
    return undefined;
  }
  private get panelIndex(): number {
    return this.getPanels(false).indexOf(this.item.panel);
  }
  private get visiblePanelIndex(): number {
    return this.getPanels(true).indexOf(this.item.panel);
  }
  private getPanels(isVisible: boolean): Array<PanelModel> {
    const data: any = this.item.data;
    if (!data) return [];
    return isVisible ? data.visiblePanels : data.panels;
  }
}

export class PanelDynamicValueGetterContext extends QuestionValueGetterContext {
  constructor (protected question: Question) {
    super(question);
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (!params.createObjects && this.question.isEmpty()) return { isFound: path.length === 0, value: undefined };
    const index = params.index;
    if (index > -1) {
      const pd = <QuestionPanelDynamicModel>this.question;
      if (index >= 0 && index < pd.panels.length) {
        const item = <QuestionPanelDynamicItem>pd.panels[index].data;
        params.isRoot = false;
        return item.getValueGetterContext().getValue(params);
      }
      return { isFound: false, value: undefined, context: this };
    }
    return super.getValue(params);
  }
}

interface IPanelDynamicTabbedMenuItem extends IAction {
  panelId: string;
}
class PanelDynamicTabbedMenuItem extends Action {
  public panelId: string;
  constructor(innerItem: IPanelDynamicTabbedMenuItem) {
    super(innerItem);
  }
}

export class QuestionPanelDynamicItem implements ISurveyData, ISurveyImpl, IObjectValueContext {
  private panelValue: PanelModel;
  private textPreProcessor: TextContextProcessor;
  constructor(public data: IQuestionPanelDynamicData, panel: PanelModel) {
    this.data = data;
    this.panelValue = panel;
    this.textPreProcessor = new TextContextProcessor(this);
    this.setSurveyImpl();
  }
  public get panel(): PanelModel {
    return this.panelValue;
  }
  public setSurveyImpl() {
    this.panel.setSurveyImpl(this);
  }
  public getValueGetterContext(): IValueGetterContext {
    return new PanelDynamicItemGetterContext(this);
  }
  public getValue(name: string): any {
    var values = this.getAllValues();
    return values[name];
  }
  public setValue(name: string, newValue: any): void {
    const oldItemData = this.data.getPanelItemData(this);
    const oldValue = !!oldItemData ? oldItemData[name] : undefined;
    if (Helpers.isTwoValueEquals(newValue, oldValue, false, true, false)) return;
    this.data.setPanelItemData(this, name, Helpers.getUnbindValue(newValue));
    const questions = this.panel.questions;
    for (var i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.getValueName() !== name) {
        q.checkBindings(name, newValue);
      }
      const suffix = settings.commentSuffix;
      if (name.endsWith(suffix)) {
        name = name.substring(0, name.length - suffix.length);
        const cQ = this.panel.getQuestionByName(name);
        if (!!cQ) {
          newValue = cQ.value;
        }
      }
      const triggerName = settings.expressionVariables.panel + "." + name;
      q.runTriggers(triggerName, newValue);
    }
  }
  getVariable(name: string): any {
    return undefined;
  }
  setVariable(name: string, newValue: any) { }
  public getComment(name: string): string {
    var result = this.getValue(name + settings.commentSuffix);
    return result ? result : "";
  }
  public setComment(name: string, newValue: string, locNotification: any) {
    this.setValue(name + settings.commentSuffix, newValue);
  }
  findQuestionByName(name: string): IQuestion {
    if (!name) return undefined;
    const prefix = settings.expressionVariables.panel + ".";
    if (name.indexOf(prefix) === 0) {
      return this.panel.getQuestionByName(name.substring(prefix.length));
    }
    const survey = this.getSurvey();
    return !!survey ? survey.getQuestionByName(name) : null;
  }
  getEditingSurveyElement(): Base { return undefined; }
  getAllValues(): any {
    return this.data.getPanelItemData(this);
  }
  getFilteredProperties(): any {
    if (!!this.data && !!this.data.getRootData())
      return this.data.getRootData().getFilteredProperties();
    return { survey: this.getSurvey() };
  }
  getSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  getTextProcessor(): ITextProcessor {
    return this.textPreProcessor;
  }
}

export class QuestionPanelDynamicTemplateSurveyImpl implements ISurveyImpl {
  constructor(public data: IQuestionPanelDynamicData) { }
  getSurveyData(): ISurveyData {
    return null;
  }
  getSurvey(): ISurvey {
    return this.data.getSurvey();
  }
  getTextProcessor(): ITextProcessor {
    return null;
  }
}

/**
  * A class that describes the Dynamic Panel question type.
  *
  * Dynamic Panel allows respondents to add panels based on a panel template and delete them. Specify the [`templateElements`](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel#templateElements) property to configure panel template elements.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/ (linkStyle))
  */
export class QuestionPanelDynamicModel extends Question
  implements IQuestionPanelDynamicData {
  private templateValue: PanelModel;
  private isValueChangingInternally: boolean;
  private changingValueQuestions: Array<Question>;

  renderModeChangedCallback: () => void;
  panelCountChangedCallback: () => void;
  currentIndexChangedCallback: () => void;

  constructor(name: string) {
    super(name);
    this.createNewArray("panels",
      (panel: PanelModel) => { this.onPanelAdded(panel); },
      (panel: PanelModel) => { this.onPanelRemoved(panel); });
    this.createNewArray("visiblePanels");
    this.templateValue = this.createAndSetupNewPanelObject();
    this.template.renderWidth = "100%";
    this.template.selectedElementInDesign = this;

    this.template.addElementCallback = (element) => {
      this.addOnPropertyChangedCallback(<SurveyElement><any>element);
      this.rebuildPanels();
    };
    this.template.removeElementCallback = () => {
      this.rebuildPanels();
    };

    this.createLocString({ name: "confirmDeleteText", translationKey: "confirmDelete" });
    this.createLocString({ name: "keyDuplicationError", hasTranslation: true });
    this.createLocString({ name: "addPanelText", translationKey: "addPanel" });
    this.createLocString({ name: "removePanelText", translationKey: "removePanel" });
    this.createLocString({ name: "prevPanelText", translationKey: "pagePrevText" });
    this.createLocString({ name: "nextPanelText", translationKey: "pageNextText" });
    this.createLocString({ name: "noEntriesText", translationKey: "noEntriesText" });
    this.createLocString({ name: "editPanelText", translationKey: "editText" });

    this.createLocString({ name: "templateTabTitle", translationKey: "panelDynamicTabTextFormat", supportsMarkdown: true });
    this.createLocString({ name: "tabTitlePlaceholder", translationKey: "tabTitlePlaceholder", supportsMarkdown: true });
    this.registerPropertyChangedHandlers(["panelsState"], () => {
      this.setPanelsState();
    });
    this.registerPropertyChangedHandlers(["newPanelPosition", "displayMode", "showProgressBar"], () => {
      this.updateFooterActions();
    });
    this.registerPropertyChangedHandlers(["allowAddPanel"], () => { this.updateNoEntriesTextDefaultLoc(); });
    this.registerPropertyChangedHandlers(["minPanelCount"], () => { this.onMinPanelCountChanged(); });
    this.registerPropertyChangedHandlers(["maxPanelCount"], () => { this.onMaxPanelCountChanged(); });
    this.registerPropertyChangedHandlers(["templateQuestionTitleLocation", "templateQuestionTitleWidth"], () => {
      const panels = this.visiblePanelsCore;
      if (panels) panels.forEach((panel) => { panel.updateElementCss(true); });
    });
  }
  public get isCompositeQuestion(): boolean { return true; }
  public get isContainer(): boolean { return true; }
  public getFirstQuestionToFocus(withError: boolean): Question {
    const panels = this.currentPanel ? [this.currentPanel] : this.visiblePanelsCore;
    for (let panel of panels) {
      const res = panel.getFirstQuestionToFocus(withError);
      if (!!res) return res;
    }
    if (this.showAddPanelButton && (!withError || this.currentErrorCount > 0)) return this;
    return null;
  }
  protected getFirstInputElementId(): string {
    const question = this.getFirstQuestionToFocus(false);
    if (question && question !== this) return question.inputId;
    if (this.showAddPanelButton) return this.addButtonId;
    return super.getFirstInputElementId();
  }
  protected getFirstErrorInputElementId(): string {
    const question = this.getFirstQuestionToFocus(true);
    return question ? question.inputId : super.getFirstErrorInputElementId();
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value, isLight);
    this.setTemplatePanelSurveyImpl();
    this.setPanelsSurveyImpl();
  }
  private assignOnPropertyChangedToTemplate() {
    var elements = this.template.elements;
    for (var i = 0; i < elements.length; i++) {
      this.addOnPropertyChangedCallback(<SurveyElement><any>elements[i]);
    }
  }
  private addOnPropertyChangedCallback(element: SurveyElement) {
    if (element.isQuestion) {
      (<Question>element).setParentQuestion(this);
    }
    element.onPropertyChanged.add((element, options) => {
      this.onTemplateElementPropertyChanged(element, options);
    });
    if (element.isPanel) {
      (<PanelModel>element).addElementCallback = (element) => {
        this.addOnPropertyChangedCallback(<SurveyElement><any>element);
      };
    }
  }
  private onTemplateElementPropertyChanged(element: any, options: any) {
    if (this.isLoadingFromJson || this.useTemplatePanel || this.panelsCore.length == 0)
      return;
    var property = Serializer.findProperty(element.getType(), options.name);
    if (!property) return;
    var panels = this.panelsCore;
    for (var i = 0; i < panels.length; i++) {
      var question = panels[i].getQuestionByName(element.name);
      if (!!question && (<any>question)[options.name] !== options.newValue) {
        (<any>question)[options.name] = options.newValue;
      }
    }
  }
  private get useTemplatePanel(): boolean {
    return this.isDesignMode && !this.isContentElement;
  }
  public getType(): string {
    return "paneldynamic";
  }
  public clearOnDeletingContainer(): void {
    this.panelsCore.forEach((panel) => {
      panel.clearOnDeletingContainer();
    });
  }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  public removeElement(element: IElement): boolean {
    return this.template.removeElement(element);
  }

  /**
   * A `PanelModel` object used as a template to create dynamic panels.
   * @see PanelModel
   * @see templateElements
   * @see templateTitle
   * @see panels
   * @see panelCount
   */
  public get template(): PanelModel {
    return this.templateValue;
  }
  public getPanelInDesignMode() : PanelModel { return this.template; }
  public getPanels(): Array<IPanel> {
    return [this.template];
  }
  /**
   * An array of questions and panels included in a panel template.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))
   * @see template
   * @see panels
   * @see panelCount
   */
  public get templateElements(): Array<IElement> {
    return this.template.elements;
  }
  /**
   * A template for panel titles.
   *
   * The template can contain the following placeholders:
   *
   * - `{panelIndex}` - A panel index within the collection of all panels. Starts with 1.
   * - `{visiblePanelIndex}` - A panel index within the collection of visible panels. Starts with 1.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/breakable-loop/ (linkStyle))
   * @see template
   * @see templateDescription
   * @see templateElements
   * @see panels
   * @see panelCount
   */
  public get templateTitle(): string {
    return this.template.title;
  }
  public set templateTitle(newValue: string) {
    this.template.title = newValue;
  }
  get locTemplateTitle(): LocalizableString {
    return this.template.locTitle;
  }
  /**
   * A template for tab titles. Applies when [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"tab"`.
   *
   * The template can contain the following placeholders:
   *
   * - `{panelIndex}` - A panel index within the collection of all panels. Starts with 1.
   * - `{visiblePanelIndex}` - A panel index within the collection of visible panels. Starts with 1.
   *
   * If you want to customize individual tab titles, handle `SurveyModel`'s [`onGetDynamicPanelTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onGetDynamicPanelTabTitle) event.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/tabbed-interface-for-duplicate-group-option/ (linkStyle))
   * @see templateTitle
   * @see tabTitlePlaceholder
   * @see displayMode
   */
  public get templateTabTitle(): string {
    return this.locTemplateTabTitle.text;
  }
  public set templateTabTitle(newValue: string) {
    this.locTemplateTabTitle.text = newValue;
  }
  get locTemplateTabTitle(): LocalizableString {
    return this.getLocalizableString("templateTabTitle");
  }
  /**
   * A placeholder for tab titles that applies when the [`templateTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateTabTitle) expression doesn't produce a meaningful value.
   *
   * Default value: `"New Panel"` (taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization))
   */
  public get tabTitlePlaceholder(): string {
    return this.locTabTitlePlaceholder.text;
  }
  public set tabTitlePlaceholder(newValue: string) {
    this.locTabTitlePlaceholder.text = newValue;
  }
  get locTabTitlePlaceholder(): LocalizableString {
    return this.getLocalizableString("tabTitlePlaceholder");
  }
  /**
   * A template for panel descriptions.
   * @see template
   * @see templateTitle
   * @see templateElements
   * @see panels
   * @see panelCount
   */
  public get templateDescription(): string {
    return this.template.description;
  }
  public set templateDescription(newValue: string) {
    this.template.description = newValue;
  }
  get locTemplateDescription(): LocalizableString {
    return this.template.locDescription;
  }
  /**
   * A Boolean expression that is evaluated against each panel. If the expression evaluates to `false`, the panel becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Use the `{panel}` placeholder to reference the current panel in the expression.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility).
   * @see visibleIf
   * @see visiblePanels
   */
  public get templateVisibleIf(): string {
    return this.getPropertyValue("templateVisibleIf");
  }
  public set templateVisibleIf(val: string) {
    this.setPropertyValue("templateVisibleIf", val);
    this.template.visibleIf = val;
  }
  /**
   * Specifies a number or letter used to start numbering of elements inside the dynamic panel.
   *
   * You can include desired prefixes and postfixes alongside the number or letter:
   *
   * ```js
   * "questionStartIndex": "a.", // a., b., c., ...
   * "questionStartIndex": "#3", // #3, #4, #5, ...
   * "questionStartIndex": "(B)." // (B)., (C)., (D)., ...
   * ```
   * Default value: `"1."` (inherited from the `questionStartIndex` property specified for the parent panel, page, or survey)
   * @see showQuestionNumbers
   */
  public get questionStartIndex(): string {
    return this.template.questionStartIndex;
  }
  public set questionStartIndex(val: string) {
    this.template.questionStartIndex = val;
  }
  protected get items(): Array<ISurveyData> {
    var res = [];
    for (var i = 0; i < this.panelsCore.length; i++) {
      res.push(this.panelsCore[i].data);
    }
    return res;
  }
  /**
   * An array of `PanelModel` objects created based on a panel template.
   * @see PanelModel
   * @see template
   * @see panelCount
   */
  public get panels(): Array<PanelModel> {
    this.buildPanelsFirstTime(this.canBuildPanels);
    return this.panelsCore;
  }
  /**
   * An array of currently visible panels ([`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model) objects).
   * @see templateVisibleIf
   */
  public get visiblePanels(): Array<PanelModel> {
    this.buildPanelsFirstTime(this.canBuildPanels);
    return this.visiblePanelsCore;
  }
  protected get panelsCore(): Array<PanelModel> {
    return this.getPropertyValue("panels");
  }
  protected get visiblePanelsCore(): Array<PanelModel> {
    return this.getPropertyValue("visiblePanels");
  }
  private onPanelAdded(panel: PanelModel): void {
    this.onPanelRemovedCore(panel);
    if (!panel.visible) return;
    let index = 0;
    const panels = this.panelsCore;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i] === panel) break;
      if (panels[i].visible) index++;
    }
    this.visiblePanelsCore.splice(index, 0, panel);
    this.addTabFromToolbar(panel, index);
    if (!this.currentPanel) {
      this.currentPanel = panel;
    }
    this.updateRenderedPanels();
  }
  private onPanelRemoved(panel: PanelModel): void {
    let index = this.onPanelRemovedCore(panel);
    if (this.currentPanel === panel) {
      const visPanels = this.visiblePanelsCore;
      if (index >= visPanels.length) index = visPanels.length - 1;
      this.currentPanel = index >= 0 ? visPanels[index] : null;
    }
    this.updateRenderedPanels();
  }
  private onPanelRemovedCore(panel: PanelModel): number {
    const visPanels = this.visiblePanelsCore;
    let index = visPanels.indexOf(panel);
    if (index > -1) {
      visPanels.splice(index, 1);
      this.removeTabFromToolbar(panel);
    }
    return index;
  }
  /**
   * A zero-based index of the currently displayed panel.
   *
   * When `displayMode` is `"list"` or Dynamic Panel is empty (`panelCount` is 0), this property contains -1.
   * @see currentPanel
   * @see panels
   * @see panelCount
   * @see displayMode
   */
  public get currentIndex(): number {
    if (this.isRenderModeList) return -1;
    if (this.useTemplatePanel) return 0;
    return this.visiblePanelsCore.indexOf(this.currentPanel);
  }
  public set currentIndex(val: number) {
    if (val < 0 || this.visiblePanelCount < 1) return;
    if (val >= this.visiblePanelCount) val = this.visiblePanelCount - 1;
    this.currentPanel = this.visiblePanelsCore[val];
  }
  /**
   * A `PanelModel` object that is the currently displayed panel.
   *
   * When `displayMode` is `"list"` or Dynamic Panel is empty (`panelCount` is 0), this property contains `null`.
   * @see currentIndex
   * @see panels
   * @see panelCount
   * @see displayMode
   */
  public get currentPanel(): PanelModel {
    if (this.isDesignMode) return this.template;
    if (this.isRenderModeList || this.useTemplatePanel) return null;
    let res = this.getPropertyValue("currentPanel", null);
    if (!res && this.visiblePanelCount > 0) {
      res = this.visiblePanelsCore[0];
      this.currentPanel = res;
    }
    return res;
  }
  public set currentPanel(val: PanelModel) {
    if (this.isRenderModeList || this.useTemplatePanel) return;
    const curPanel = this.getPropertyValue("currentPanel");
    const index = !!val ? this.visiblePanelsCore.indexOf(val) : -1;
    if (!!val && index < 0 || val === curPanel) return;
    if (curPanel) {
      curPanel.onHidingContent();
    }
    if (!!val) {
      val.onFirstRendering();
    }
    this.setPropertyValue("currentPanel", val);
    this.updateRenderedPanels();
    this.updateFooterActions();
    this.updateTabToolbarItemsPressedState();
    this.fireCallback(this.currentIndexChangedCallback);
    if (index > -1 && this.survey) {
      const options = {
        panel: val,
        visiblePanelIndex: index
      };
      this.survey.dynamicPanelCurrentIndexChanged(this, options);
    }
  }
  protected getUIState(): any {
    let result = super.getUIState();
    const index = this.currentIndex;
    if (index > 0) {
      result = result || {};
      result.activePanelIndex = index;
    }
    return result;
  }
  protected setUIState(state: any): void {
    super.setUIState(state);
    if (state.activePanelIndex) {
      this.currentIndex = state.activePanelIndex;
    }
  }

  @propertyArray({}) private _renderedPanels: Array<PanelModel> = [];

  private updateRenderedPanels() {
    let panels: Array<PanelModel> = [];
    if (this.isRenderModeList) {
      panels = [].concat(this.visiblePanels);
    } else if (this.currentPanel) {
      panels = [this.currentPanel];
    }
    panels.forEach(panel => this.panelOnFirstRendering(panel));
    this.renderedPanels = panels;
  }
  private panelOnFirstRendering(panel: PanelModel) {
    if (panel) {
      panel.onFirstRendering();
      panel.locStrsChanged();
    }
  }
  public set renderedPanels(val: Array<PanelModel>) {
    if (this.renderedPanels.length == 0 || val.length == 0) {
      this.blockAnimations();
      this.panelsAnimation.sync(val);
      this.releaseAnimations();
    } else {
      this.isPanelsAnimationRunning = true;
      this.panelsAnimation.sync(val);
    }
  }

  public get renderedPanels(): Array<PanelModel> {
    return this._renderedPanels;
  }
  private isPanelsAnimationRunning: boolean = false;
  private getPanelsAnimationOptions(): IAnimationConsumer<[PanelModel]> {
    const getDirectionCssClass = () => {
      if (this.isRenderModeList) return "";
      let cssClass = new CssClassBuilder();
      let isRemoving = false;
      const leavingPanel = this.renderedPanels.filter(el => el !== this.currentPanel)[0];
      let leavingPanelIndex = this.visiblePanels.indexOf(leavingPanel);
      if (leavingPanelIndex < 0) {
        isRemoving = true;
        leavingPanelIndex = this.removedPanelIndex;
      }
      return cssClass
        .append("sv-pd-animation-adding", !!this.focusNewPanelCallback)
        .append("sv-pd-animation-removing", isRemoving)
        .append("sv-pd-animation-left", leavingPanelIndex <= this.currentIndex)
        .append("sv-pd-animation-right", leavingPanelIndex > this.currentIndex)
        .toString();
    };
    return {
      getRerenderEvent: () => this.onElementRerendered,
      getAnimatedElement: (panel) => {
        if (panel && this.cssContent) {
          const contentSelector = classesToSelector(this.cssContent);
          return this.getWrapperElement()?.querySelector(`:scope ${contentSelector} #${panel.id}`)?.parentElement;
        }
      },
      getEnterOptions: () => {
        const cssClass = new CssClassBuilder().append(this.cssClasses.panelWrapperEnter).append(getDirectionCssClass()).toString();
        return {
          onBeforeRunAnimation: (el) => {
            if (this.focusNewPanelCallback) {
              const scolledElement = this.isRenderModeList ? el : el.parentElement;
              SurveyElement.ScrollElementToViewCore(scolledElement, false, false, { behavior: "smooth" });
            }
            if (!this.isRenderModeList && el.parentElement) {
              setPropertiesOnElementForAnimation(el.parentElement, { heightTo: el.offsetHeight + "px" });
            } else {
              prepareElementForVerticalAnimation(el);
            }
          },
          onAfterRunAnimation: (el) => {
            cleanHtmlElementAfterAnimation(el);
            if (el.parentElement) {
              cleanHtmlElementAfterAnimation(el.parentElement);
            }
          },
          cssClass: cssClass
        };
      },
      getLeaveOptions: () => {
        const cssClass = new CssClassBuilder().append(this.cssClasses.panelWrapperLeave).append(getDirectionCssClass()).toString();
        return {
          onBeforeRunAnimation: (el) => {
            if (!this.isRenderModeList && el.parentElement) {
              setPropertiesOnElementForAnimation(el.parentElement, { heightFrom: el.offsetHeight + "px" });
            } else {
              prepareElementForVerticalAnimation(el);
            }
          },
          onAfterRunAnimation: (el) => {
            cleanHtmlElementAfterAnimation(el);
            if (el.parentElement) {
              cleanHtmlElementAfterAnimation(el.parentElement);
            }
          },
          cssClass: cssClass
        };
      },
      isAnimationEnabled: () => {
        return this.animationAllowed && !!this.getWrapperElement();
      },
    };
  }

  private _panelsAnimations: AnimationProperty<Array<PanelModel>, IAnimationGroupConsumer<PanelModel>>;
  private disablePanelsAnimations() {
    this.panelsCore.forEach((panel) => {
      panel.blockAnimations();
    });
  }
  private enablePanelsAnimations() {
    this.panelsCore.forEach((panel) => {
      panel.releaseAnimations();
    });
  }
  private updatePanelsAnimation() {
    this._panelsAnimations = new (this.isRenderModeList ? AnimationGroup : AnimationTab)(this.getPanelsAnimationOptions(), (val, isTempUpdate?: boolean) => {
      this._renderedPanels = val;
      if (!isTempUpdate) {
        this.isPanelsAnimationRunning = false;
        this.focusNewPanel();
      }
    }, () => this._renderedPanels);
  }

  get panelsAnimation(): AnimationProperty<Array<PanelModel>, IAnimationGroupConsumer<PanelModel>> {
    if (!this._panelsAnimations) {
      this.updatePanelsAnimation();
    }
    return this._panelsAnimations;
  }

  public onHidingContent(): void {
    super.onHidingContent();
    if (this.currentPanel) {
      this.currentPanel.onHidingContent();
    } else {
      this.visiblePanelsCore.forEach(panel => panel.onHidingContent());
    }
  }
  /**
   * Specifies whether to display a confirmation dialog when a respondent wants to delete a panel.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))
   * @see confirmDeleteText
   */
  public get confirmDelete(): boolean {
    return this.getPropertyValue("confirmDelete");
  }
  public set confirmDelete(val: boolean) {
    this.setPropertyValue("confirmDelete", val);
  }
  /**
   * Specifies a key question. Set this property to the name of a question used in the template, and Dynamic Panel will display `keyDuplicationError` if a user tries to enter a duplicate value in this question.
   * @see keyDuplicationError
   */
  public get keyName(): string {
    return this.getPropertyValue("keyName", "");
  }
  public set keyName(val: string) {
    this.setPropertyValue("keyName", val);
  }
  /**
   * A message displayed in a confirmation dialog that appears when a respondent wants to delete a panel.
   * @see confirmDelete
   */
  public get confirmDeleteText() {
    return this.getLocalizableStringText("confirmDeleteText");
  }
  public set confirmDeleteText(val: string) {
    this.setLocalizableStringText("confirmDeleteText", val);
  }
  get locConfirmDeleteText(): LocalizableString {
    return this.getLocalizableString("confirmDeleteText");
  }
  /**
   * An error message displayed when users enter a duplicate value into a question that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified).
   *
   * A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).
   * @see keyName
   */
  public get keyDuplicationError() {
    return this.getLocalizableStringText("keyDuplicationError");
  }
  public set keyDuplicationError(val: string) {
    this.setLocalizableStringText("keyDuplicationError", val);
  }
  get locKeyDuplicationError(): LocalizableString {
    return this.getLocalizableString("keyDuplicationError");
  }
  /**
   * A caption for the Previous button. Applies only if `displayMode` is different from `"list"`.
   * @see displayMode
   * @see isPrevButtonVisible
   */
  public get prevPanelText(): string { return this.getLocalizableStringText("prevPanelText"); }
  public set prevPanelText(val: string) { this.setLocalizableStringText("prevPanelText", val); }
  get locPrevPanelText(): LocalizableString { return this.getLocalizableString("prevPanelText"); }
  /**
   * @deprecated Use the [`prevPanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#prevPanelText) property instead.
   */
  public get panelPrevText(): string { return this.prevPanelText; }
  public set panelPrevText(val: string) { this.prevPanelText = val; }
  get locPanelPrevText(): LocalizableString { return this.locPrevPanelText; }
  /**
   * A caption for the Next button. Applies only if `displayMode` is different from `"list"`.
   * @see displayMode
   * @see isNextButtonVisible
   */
  public get nextPanelText(): string { return this.getLocalizableStringText("nextPanelText"); }
  public set nextPanelText(val: string) { this.setLocalizableStringText("nextPanelText", val); }
  get locNextPanelText(): LocalizableString { return this.getLocalizableString("nextPanelText"); }
  /**
   * @deprecated Use the [`nextPanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#nextPanelText) property instead.
   */
  public get panelNextText(): string { return this.nextPanelText; }
  public set panelNextText(val: string) { this.nextPanelText = val; }
  get locPanelNextText(): LocalizableString { return this.locNextPanelText; }
  /**
   * A caption for the Add Panel button.
   */
  public get addPanelText(): string { return this.getLocalizableStringText("addPanelText"); }
  public set addPanelText(value: string) { this.setLocalizableStringText("addPanelText", value); }
  get locAddPanelText(): LocalizableString { return this.getLocalizableString("addPanelText"); }
  /**
   * @deprecated Use the [`addPanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#addPanelText) property instead.
   */
  public get panelAddText(): string { return this.addPanelText; }
  public set panelAddText(value: string) { this.addPanelText = value; }
  get locPanelAddText(): LocalizableString { return this.locAddPanelText; }
  /**
   * A caption for the Remove Panel button.
   * @see removePanelButtonLocation
   */
  public get removePanelText(): string { return this.getLocalizableStringText("removePanelText"); }
  public set removePanelText(val: string) { this.setLocalizableStringText("removePanelText", val); }
  get locRemovePanelText(): LocalizableString { return this.getLocalizableString("removePanelText"); }
  /**
   * @deprecated Use the [`removePanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#removePanelText) property instead.
   */
  public get panelRemoveText(): string { return this.removePanelText; }
  public set panelRemoveText(val: string) { this.removePanelText = val; }
  get locPanelRemoveText(): LocalizableString { return this.locRemovePanelText; }
  public get isProgressTopShowing(): boolean {
    return this.displayMode == "carousel" && (this.progressBarLocation === "top" || this.progressBarLocation === "topBottom");
  }
  public get isProgressBottomShowing(): boolean {
    return this.displayMode == "carousel" && (this.progressBarLocation === "bottom" || this.progressBarLocation === "topBottom");
  }
  /**
   * Indicates whether the Previous button is visible.
   * @see currentIndex
   * @see currentPanel
   * @see prevPanelText
   */
  public get isPrevButtonVisible(): boolean { return this.currentIndex > 0; }
  public get isPrevButtonShowing(): boolean { return this.isPrevButtonVisible; }
  /**
   * Indicates whether the Next button is visible.
   * @see currentIndex
   * @see currentPanel
   * @see nextPanelText
   */
  public get isNextButtonVisible(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.visiblePanelCount - 1;
  }
  public get isNextButtonShowing(): boolean { return this.isNextButtonVisible; }
  public get isRangeShowing(): boolean {
    return (
      this.showProgressBar && this.currentIndex >= 0 && this.visiblePanelCount > 1
    );
  }
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    return includeHidden ? [this.template] : this.templateElements;
  }
  private isAddingNewPanels: boolean = false;
  private addingNewPanelsValue: any;
  private isNewPanelsValueChanged: boolean;
  private prepareValueForPanelCreating() {
    this.addingNewPanelsValue = this.value;
    this.isAddingNewPanels = true;
    this.isNewPanelsValueChanged = false;
  }
  private setValueAfterPanelsCreating() {
    this.isAddingNewPanels = false;
    if (this.isNewPanelsValueChanged) {
      this.isValueChangingInternally = true;
      this.value = this.addingNewPanelsValue;
      this.isValueChangingInternally = false;
    }
  }
  protected getValueCore() {
    return this.isAddingNewPanels
      ? this.addingNewPanelsValue
      : super.getValueCore();
  }
  protected setValueCore(newValue: any) {
    if (this.isAddingNewPanels) {
      this.isNewPanelsValueChanged = true;
      this.addingNewPanelsValue = newValue;
    } else {
      super.setValueCore(newValue);
    }
  }
  public setIsMobile(val: boolean) {
    super.setIsMobile(val);
    (this.panelsCore || []).forEach(panel => panel.getQuestions(true).forEach(question => {
      question.setIsMobile(val);
    }));
  }
  public themeChanged(theme: ITheme): void {
    super.themeChanged(theme);
    (this.panelsCore || []).forEach(panel =>
      panel.getQuestions(true).forEach(question => {
        question.themeChanged(theme);
      })
    );
  }

  /**
   * The number of panels in Dynamic Panel.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))
   * @see minPanelCount
   * @see maxPanelCount
   */
  public get panelCount(): number {
    return !this.canBuildPanels || this.wasNotRenderedInSurvey
      ? this.getPropertyValue("panelCount")
      : this.panelsCore.length;
  }
  public set panelCount(val: number) {
    if (val < 0) return;
    if (!this.isLoadingFromJson && this.isDesignMode) {
      const min = this.minPanelCount;
      if (val < min) {
        val = min;
      }
      const max = this.maxPanelCount;
      if (max > 0 && val > max) {
        val = max;
      }
    }
    if (!this.canBuildPanels || this.wasNotRenderedInSurvey) {
      this.setPropertyValue("panelCount", val);
      this.updateFooterActions();
      return;
    }
    if (val == this.panelsCore.length || this.useTemplatePanel) return;
    this.updateBindings("panelCount", val);
    this.prepareValueForPanelCreating();
    const isAddingOnePanel = val - this.panelCount === 1;
    for (let i = this.panelCount; i < val; i++) {
      const panel = this.createNewPanel();
      this.panelsCore.push(panel);
      if (this.displayMode == "list" && this.panelsState != "default") {
        if (this.panelsState === "expanded") {
          panel.expand();
        } else {
          if (!!panel.title) {
            panel.collapse();
          }
        }
      }
    }
    if (isAddingOnePanel) {
      this.singleInputOnAddItem(this.settingPanelCountBasedOnValue);
    }
    if (val < this.panelCount) {
      this.panelsCore.splice(val, this.panelCount - val);
    }
    this.disablePanelsAnimations();
    this.setValueAfterPanelsCreating();
    this.setValueBasedOnPanelCount();
    this.reRunCondition();
    this.updateFooterActions();
    this.fireCallback(this.panelCountChangedCallback);
    this.enablePanelsAnimations();
  }
  /**
   * Returns the number of visible panels in Dynamic Panel.
   * @see templateVisibleIf
   */
  public get visiblePanelCount(): number { return this.visiblePanels.length; }
  /**
   * Specifies whether users can expand and collapse panels. Applies if `displayMode` is `"list"` and the `templateTitle` property is specified.
   *
   * Possible values:
   *
   * - `"default"` (default) - All panels are displayed in full and cannot be collapsed.
   * - `"expanded"` - All panels are displayed in full and can be collapsed in the UI.
   * - `"collapsed"` - All panels display only their titles and descriptions and can be expanded in the UI.
   * - `"firstExpanded"` - Only the first panel is displayed in full; other panels are collapsed and can be expanded in the UI.
   * @see displayMode
   * @see templateTitle
   */
  public get panelsState(): string {
    return this.getPropertyValue("panelsState");
  }
  public set panelsState(val: string) {
    this.setPropertyValue("panelsState", val);
  }
  public getStructuredValue(level: number = -1): any {
    if (level < 0 || this.isEmpty() || !Array.isArray(this.value)) return this.value;
    const data = new Array<any>();
    const valCount = Math.min(this.visiblePanelCount, this.value.length);
    for (let i = 0; i < valCount; i++) {
      const panel = this.visiblePanels[i];
      const panelData: any = {};
      panel.collectValues(panelData, level);
      data.push(panelData);
    }
    return data;
  }
  private setTemplatePanelSurveyImpl() {
    this.template.setSurveyImpl(
      this.useTemplatePanel
        ? this.surveyImpl
        : new QuestionPanelDynamicTemplateSurveyImpl(this)
    );
  }
  private setPanelsSurveyImpl() {
    for (var i = 0; i < this.panelsCore.length; i++) {
      var panel = this.panelsCore[i];
      if (panel == this.template) continue;
      panel.setSurveyImpl(<QuestionPanelDynamicItem>panel.data);
    }
  }
  private setPanelsState() {
    if (this.useTemplatePanel || this.displayMode != "list" || !this.templateTitle)
      return;
    for (var i = 0; i < this.panelsCore.length; i++) {
      var state = this.panelsState;
      if (state === "firstExpanded") {
        state = i === 0 ? "expanded" : "collapsed";
      }
      this.panelsCore[i].state = state;
    }
  }
  private setValueBasedOnPanelCount() {
    var value = this.value;
    if (!value || !Array.isArray(value)) value = [];
    if (value.length == this.panelCount) return;
    for (var i = value.length; i < this.panelCount; i++) {
      const panelValue = this.panels[i].getValue();
      const val = !Helpers.isValueEmpty(panelValue) ? panelValue : {};
      value.push(val);
    }
    if (value.length > this.panelCount) {
      value.splice(this.panelCount, value.length - this.panelCount);
    }
    this.isValueChangingInternally = true;
    this.value = value;
    this.isValueChangingInternally = false;
  }
  /**
   * A minimum number of panels in Dynamic Panel. Users cannot delete panels if `panelCount` equals `minPanelCount`.
   *
   * Default value: 0
   * @see panelCount
   * @see maxPanelCount
   * @see allowRemovePanel
   */
  public get minPanelCount(): number {
    return this.getPropertyValue("minPanelCount");
  }
  public set minPanelCount(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("minPanelCount", val);
  }
  private onMinPanelCountChanged(): void {
    const val = this.minPanelCount;
    if (val > this.maxPanelCount)this.maxPanelCount = val;
    if (this.panelCount < val)this.panelCount = val;
  }
  /**
   * A maximum number of panels in Dynamic Panel. Users cannot add new panels if `panelCount` equals `maxPanelCount`.
   *
   * Default value: 100 (inherited from [`settings.panel.maxPanelCount`](https://surveyjs.io/form-library/documentation/settings#panelMaximumPanelCount))
   *
   * [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))
   * @see panelCount
   * @see minPanelCount
   * @see allowAddPanel
   */
  public get maxPanelCount(): number {
    return this.getPropertyValue("maxPanelCount");
  }
  public set maxPanelCount(val: number) {
    if (val <= 0) return;
    if (val > settings.panel.maxPanelCount)
      val = settings.panel.maxPanelCount;
    this.setPropertyValue("maxPanelCount", val);
    this.updateFooterActions();
  }
  private onMaxPanelCountChanged(): void {
    const val = this.maxPanelCount;
    if (val < this.minPanelCount)this.minPanelCount = val;
    if (this.panelCount > val)this.panelCount = val;
    this.updateFooterActions();
  }
  /**
   * Specifies whether users are allowed to add new panels.
   *
   * Default value: `true`
   *
   * By default, users add new panels to the end. If you want to let users insert a new panel after the current panel, set the [`newPanelPosition`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#newPanelPosition) property to `"next"`.
   * @see canAddPanel
   * @see allowRemovePanel
   */
  public get allowAddPanel(): boolean {
    return this.getPropertyValue("allowAddPanel");
  }
  public set allowAddPanel(val: boolean) {
    this.setPropertyValue("allowAddPanel", val);
  }
  public get addButtonId(): string {
    return this.id + "addPanel";
  }
  /**
   * Specifies the position of newly added panels.
   *
   * Possible values:
   *
   * - `"last"` (default) - New panels are added to the end.
   * - `"next"` - New panels are inserted after the current panel.
   * @see allowAddPanel
   * @see addPanel
   */
  public get newPanelPosition(): string {
    return this.getPropertyValue("newPanelPosition");
  }
  public set newPanelPosition(val: string) {
    this.setPropertyValue("newPanelPosition", val);
  }
  /**
   * Specifies whether users are allowed to delete panels.
   *
   * Default value: `true`
   * @see canRemovePanel
   * @see allowAddPanel
   */
  public get allowRemovePanel(): boolean {
    return this.getPropertyValue("allowRemovePanel");
  }
  public set allowRemovePanel(val: boolean) {
    this.setPropertyValue("allowRemovePanel", val);
  }
  /**
   * Gets or sets the location of question titles relative to their input fields.
   *
   * - `"default"` (default) - Inherits the setting from the Dynamic Panel's `titleLocation` property, which in turn inherits the [`questionTitleLocation`](https://surveyjs.io/form-library/documentation/surveymodel#questionTitleLocation) property value specified for the Dynamic Panel's container (page or survey).
   * - `"top"` - Displays question titles above input fields.
   * - `"bottom"` - Displays question titles below input fields.
   * - `"left"` - Displays question titles to the left of input fields.
   * - `"hidden"` - Hides question titles.
   * @see titleLocation
   */
  public get templateQuestionTitleLocation(): string {
    return this.getPropertyValue("templateQuestionTitleLocation");
  }
  public set templateQuestionTitleLocation(val: string) {
    this.setPropertyValue("templateQuestionTitleLocation", val);
  }
  /**
   * @deprecated Use the [`templateQuestionTitleLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateQuestionTitleLocation) property instead.
   */
  public get templateTitleLocation(): string {
    return this.templateQuestionTitleLocation;
  }
  public set templateTitleLocation(val: string) {
    this.templateQuestionTitleLocation = val;
  }
  /**
   * Sets consistent width for question titles in CSS values. Applies only when [`templateQuestionTitleLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateQuestionTitleLocation) evaluates to `"left"`.
   *
   * Default value: `undefined` (inherits the actual value from the [`questionTitleWidth`](https://surveyjs.io/form-library/documentation/api-reference/page-model#questionTitleWidth) property of the parent panel or page.
   */
  public get templateQuestionTitleWidth(): string {
    return this.template.questionTitleWidth;
  }
  public set templateQuestionTitleWidth(val: string) {
    this.template.questionTitleWidth = val;
  }
  /**
   * Specifies the error message position.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
   * - `"top"` - Displays error messages above questions.
   * - `"bottom"` - Displays error messages below questions.
   */
  public get templateErrorLocation(): string {
    return this.getPropertyValue("templateErrorLocation");
  }
  public set templateErrorLocation(value: string) {
    this.setPropertyValue("templateErrorLocation", value.toLowerCase());
  }
  public resetSingleInput(): void {
    super.resetSingleInput();
    this.locTemplateTitle.onGetTextCallback = null;
  }
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    this.onFirstRendering();
    const res = new Array<Question>();
    const panels = this.visiblePanels;
    if (checkDynamic) {
      for (let i = 0; i < panels.length; i ++) {
        const panel = panels[i];
        if (!panel.hasValueAnyQuestion(true) || !panel.validate(false, false)) {
          this.fillSingleInputQuestionsByPanel(res, panel);
        }
      }
    }
    return this.getSingleInputQuestionsForDynamic(question, res);
  }
  protected fillSingleInputQuestionsInContainer(res: Array<Question>, innerQuestion: Question): void {
    const panel = this.getPanelByQuestion(innerQuestion);
    this.fillSingleInputQuestionsByPanel(res, panel);
  }
  private fillSingleInputQuestionsByPanel(res: Array<Question>, panel: PanelModel): void {
    if (panel) {
      panel.visibleQuestions.forEach(q => q.addNestedQuestion(res, true, false, false));
    }
  }
  protected getSingleQuestionLocTitleCore(): LocalizableString {
    const res = this.locTemplateTitle;
    res.onGetTextCallback = (text: string): string => {
      const q = this.singleInputQuestion;
      if (!q) return text;
      return this.processSingleInputTitle(text, this.getPanelByQuestion(q));
    };
    return res;
  }
  private processSingleInputTitle(text: string, panel: PanelModel): string {
    if (!text) text = this.getSingleInputTitleTemplate();
    if (!panel) return text;
    return panel.getProcessedText(text);
  }
  private getSingleInputTitleTemplate(): string {
    return this.getLocalizationString("panelDynamicTabTextFormat");
  }
  private getPanelByQuestion(question: Question): PanelModel {
    let parent = question.parent;
    while(!!parent && !!parent.parent) {
      parent = parent.parent;
    }
    return <PanelModel>parent;
  }
  protected getSingleInputAddTextCore(): string {
    if (!this.canAddPanel) return undefined;
    return this.addPanelText;
  }
  protected singleInputAddItemCore(): void {
    this.addPanelUI();
  }
  protected getSingleQuestionOnChange(index: number): Question {
    const panels = this.visiblePanelsCore;
    if (panels.length > 0) {
      if (index < 0 || index >= panels.length) index = panels.length - 1;
      const row = panels[index];
      const vQs = row.visibleQuestions;
      if (vQs.length > 0) {
        return vQs[0];
      }
    }
    return null;
  }
  protected createSingleInputSummary(): QuestionSingleInputSummary {
    const res = new QuestionSingleInputSummary(this, this.locNoEntriesText);
    const items = new Array<QuestionSingleInputSummaryItem>();
    this.visiblePanels.forEach((panel) => {
      const locText = new LocalizableString(this, true, undefined, this.locTemplateTitle.localizationName);
      locText.setJson(this.locTemplateTitle.getJson());
      locText.onGetTextCallback = (text: string): string => {
        return this.processSingleInputTitle(this.templateTitle, panel);
      };
      const bntEdit = new Action({ locTitle: this.getLocalizableString("editPanelText"), action: () => { this.singInputEditPanel(panel); } });
      const btnRemove = this.canRemovePanel ? new Action({ locTitle: this.locPanelRemoveText, action: () => { this.removePanelUI(panel); } }) : undefined;
      items.push(new QuestionSingleInputSummaryItem(locText, bntEdit, btnRemove));
    });
    res.items = items;
    return res;
  }
  protected singleInputMoveToFirstCore(): void {
    let panel = this.singleInputQuestion?.parent;
    while(!!panel && !!panel.parent) {
      panel = panel.parent;
    }
    this.singInputEditPanel(<PanelModel>panel);
  }
  private singInputEditPanel(panel: PanelModel): void {
    if (!panel) return;
    const qs = panel.visibleQuestions;
    if (qs.length > 0) {
      this.setSingleInputQuestion(qs[0]);
    }
  }
  /**
   * Specifies whether to display survey element numbers within the dynamic panel and how to calculate them.
   *
   * Possible values:
   *
   * - `"off"` (default) - Hides question numbers.
   * - `"default"` - Inherits the setting from the parent panel, page, or survey.
   * - `"recursive"` - Applies recursive numbering to elements nested within the dynamic panel (for example, 1 -> 1.1 -> 1.1.1, etc.).
   * - `"onpanel"` - Starts numbering within the dynamic panel from scratch.
   * - `"onSurvey"` - Obsolete. Use the `"default"` value instead.
   * @see questionStartIndex
   * @see showNumber
   */
  public get showQuestionNumbers(): string {
    return this.getPropertyValue("showQuestionNumbers");
  }
  public set showQuestionNumbers(val: string) {
    if (!val) {
      val = "off";
    }
    val = val.toLowerCase();
    if (val === "onsurvey") {
      val = "default";
    }
    this.setPropertyValue("showQuestionNumbers", val);
    if (!this.isLoadingFromJson && this.survey) {
      this.survey.questionVisibilityChanged(this, this.visible, true);
    }
  }
  private getShowQuestionNumbers(): string {
    const res = this.showQuestionNumbers;
    if (res === "default") {
      const sqn = this.survey?.showQuestionNumbers;
      if (sqn === "recursive") return sqn;
    }
    return res;
  }
  protected notifySurveyOnChildrenVisibilityChanged(): boolean {
    return this.showQuestionNumbers === "default";
  }
  /**
   * Specifies the location of the Remove Panel button relative to panel content.
   *
   * Possible values:
   *
   * - `"bottom"` (default) - Displays the Remove Panel button below panel content.
   * - `"right"` - Displays the Remove Panel button to the right of panel content.
   * @see removePanelText
   */
  public get removePanelButtonLocation(): string {
    return this.getPropertyValue("removePanelButtonLocation");
  }
  public set removePanelButtonLocation(val: string) {
    this.setPropertyValue("removePanelButtonLocation", val);
  }
  /**
   * @deprecated Use the [`removePanelButtonLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#removePanelButtonLocation) property instead.
   */
  public get panelRemoveButtonLocation(): string { return this.removePanelButtonLocation; }
  public set panelRemoveButtonLocation(val: string) { this.removePanelButtonLocation = val; }
  /**
   * @deprecated Use the [`showProgressBar`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#showProgressBar) property instead.
   */
  public get showRangeInProgress(): boolean {
    return this.showProgressBar;
  }
  public set showRangeInProgress(val: boolean) {
    this.showProgressBar = val;
  }
  /**
   * @deprecated Use the [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) property instead.
   */
  public get renderMode(): string {
    let displayMode = this.displayMode;
    if (displayMode == "carousel") {
      const progressBarLocation = this.progressBarLocation;
      if (progressBarLocation == "top") {
        return "progressTop";
      } else if (progressBarLocation == "bottom") {
        return "progressBottom";
      } else if (progressBarLocation == "topBottom") {
        return "progressTopBottom";
      }
    }
    return displayMode;
  }
  public set renderMode(val: string) {
    if ((val || "").startsWith("progress")) {
      if (val == "progressTop") {
        this.progressBarLocation = "top";
      } else if (val == "progressBottom") {
        this.progressBarLocation = "bottom";
      } else if (val == "progressTopBottom") {
        this.progressBarLocation = "topBottom";
      }
      this.displayMode = "carousel";
    } else {
      this.displayMode = val as any;
    }
    // this.updatePanelView();
  }
  private updatePanelView() {
    this.blockAnimations();
    this.updateRenderedPanels();
    this.releaseAnimations();
    this.updatePanelsAnimation();
  }
  /**
   * Specifies how to display panels.
   *
   * Possible values:
   *
   * - `"list"` (default) - Displays panels one under the other. [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/)
   * - `"carousel"` - Displays panels in a carousel. Users can switch between panels using navigation buttons.
   * - `"tab"` - Displays each panel within a tab. Use the [`templateTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateTabTitle) to specify a template for tab titles. [View Demo](https://surveyjs.io/form-library/examples/tabbed-interface-for-duplicate-group-option/)
   * @see showProgressBar
   * @see progressBarLocation
   */
  @property({
    onSet: (val, target: QuestionPanelDynamicModel) => {
      target.fireCallback(target.renderModeChangedCallback);
      target.updatePanelView();
    }
  }) displayMode: "list" | "carousel" | "tab";
  /**
   * Specifies whether to display the progress bar. Applies only if [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"carousel"`.
   *
   * Default value: `true`
   * @see progressBarLocation
   */
  @property({
    onSet: (val, target: QuestionPanelDynamicModel) => {
      target.fireCallback(target.currentIndexChangedCallback);
    }
  }) showProgressBar: true | false;
  /**
   * Specifies the alignment of the [progress bar](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#showProgressBar) relative to the currently displayed panel. Applies only if [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"carousel"`.
   *
   * Possible values:
   *
   * - `"top"` (default) - Displays the progress bar at the top of the current panel.
   * - `"bottom"` - Displays the progress bar at the bottom of the current panel.
   * - `"topBottom"` - Displays the progress bar at the top and bottom of the current panel.
   */
  @property({
    onSet: (val, target: QuestionPanelDynamicModel) => {
      // target.updatePanelView();
    }
  }) progressBarLocation: "top" | "bottom" | "topBottom";
  public get tabAlign(): "center" | "left" | "right" {
    return this.getPropertyValue("tabAlign");
  }
  public set tabAlign(val: "center" | "left" | "right") {
    this.setPropertyValue("tabAlign", val);
    if (this.isRenderModeTab) {
      this.tabbedMenu.containerCss = this.getTabbedMenuCss();
    }
  }
  public get isRenderModeList(): boolean {
    return this.displayMode === "list" || this.isSingleInputActive;
  }
  public get isRenderModeTab(): boolean {
    return this.displayMode === "tab" && !this.isSingleInputActive;
  }
  public setVisibleIndex(val: number): number {
    const panels = this.isDesignMode ? [this.template] : this.visiblePanelsCore;
    if (this.isVisibleIndexNegative(val)) {
      panels.forEach(panel => panel.setVisibleIndex(-1));
      return super.setVisibleIndex(-1);
    }
    const sqn = this.getShowQuestionNumbers();
    const onSurveyNumbering = sqn === "default";
    let startIndex = onSurveyNumbering ? val : 0;
    for (let i = 0; i < panels.length; i++) {
      let counter = this.setPanelVisibleIndex(panels[i], startIndex, sqn != "off");
      if (onSurveyNumbering) {
        startIndex += counter;
      }
    }
    super.setVisibleIndex(!onSurveyNumbering ? val : -1);
    return !onSurveyNumbering ? 1 : startIndex - val;
  }
  private setPanelVisibleIndex(
    panel: PanelModel,
    index: number,
    showIndex: boolean
  ): number {
    if (!showIndex) {
      panel.setVisibleIndex(-1);
      return 0;
    }
    return panel.setVisibleIndex(index);
  }

  /**
   * Indicates whether it is possible to add a new panel.
   *
   * This property returns `true` when all of the following conditions apply:
   *
   * - Users are allowed to add new panels (`allowAddPanel` is `true`).
   * - Dynamic Panel or its parent survey is not in read-only state.
   * - `panelCount` is less than `maxPanelCount`.
   * @see allowAddPanel
   * @see isReadOnly
   * @see panelCount
   * @see maxPanelCount
   * @see canRemovePanel
   */
  public get canAddPanel(): boolean {
    if (this.isDesignMode) return false;
    if (!this.legacyNavigation && !this.isRenderModeList &&
      (this.currentIndex < this.visiblePanelCount - 1 && this.newPanelPosition !== "next")) {
      return false;
    }
    return (
      this.allowAddPanel &&
      !this.isReadOnly &&
      this.panelCount < this.maxPanelCount
    );
  }
  /**
   * Indicates whether it is possible to delete panels.
   *
   * This property returns `true` when all of the following conditions apply:
   *
   * - Users are allowed to delete panels (`allowRemovePanel` is `true`).
   * - Dynamic Panel or its parent survey is not in read-only state.
   * - `panelCount` exceeds `minPanelCount`.
   * @see allowRemovePanel
   * @see isReadOnly
   * @see panelCount
   * @see minPanelCount
   * @see canAddPanel
   */
  public get canRemovePanel(): boolean {
    if (this.isDesignMode) return false;
    return (
      this.allowRemovePanel &&
      !this.isReadOnly &&
      this.panelCount > this.minPanelCount
    );
  }
  protected rebuildPanels() {
    if (this.isLoadingFromJson) return;
    this.prepareValueForPanelCreating();
    var panels = [];
    if (this.useTemplatePanel) {
      new QuestionPanelDynamicItem(this, this.template);
      panels.push(this.template);
    } else {
      for (var i = 0; i < this.panelCount; i++) {
        panels.push(this.createNewPanel());
      }
    }
    this.panelsCore.splice(0, this.panelsCore.length, ...panels);
    this.setValueAfterPanelsCreating();
    this.setPanelsState();
    this.reRunCondition();
    this.updateFooterActions();
    this.fireCallback(this.panelCountChangedCallback);
    this.updateTabToolbar();
  }
  /**
   * If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty
   * @see defaultValue
   * @see copyDefaultValueFromLastEntry
   */
  public get defaultPanelValue(): any {
    return this.getPropertyValue("defaultPanelValue");
  }
  public set defaultPanelValue(val: any) {
    this.setPropertyValue("defaultPanelValue", val);
  }
  /**
   * Specifies whether default values for a new panel should be copied from the last panel.
   *
   * If you also specify `defaultValue`, it will be merged with the copied values.
   * @see defaultValue
   */
  public get copyDefaultValueFromLastEntry(): boolean {
    return this.getPropertyValue("copyDefaultValueFromLastEntry");
  }
  public set copyDefaultValueFromLastEntry(val: boolean) {
    this.setPropertyValue("copyDefaultValueFromLastEntry", val);
  }
  /**
   * @deprecated Use the [`copyDefaultValueFromLastEntry`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#copyDefaultValueFromLastEntry) property instead.
   */
  public get defaultValueFromLastPanel(): boolean {
    return this.copyDefaultValueFromLastEntry;
  }
  public set defaultValueFromLastPanel(val: boolean) {
    this.copyDefaultValueFromLastEntry = val;
  }
  protected isDefaultValueEmpty(): boolean {
    return (
      super.isDefaultValueEmpty() && this.isValueEmpty(this.defaultPanelValue)
    );
  }
  protected setDefaultValue() {
    if (
      this.isValueEmpty(this.defaultPanelValue) ||
      !this.isValueEmpty(this.defaultValue)
    ) {
      super.setDefaultValue();
      return;
    }
    if (!this.isEmpty() || this.panelCount == 0) return;
    var newValue = [];
    for (var i = 0; i < this.panelCount; i++) {
      newValue.push(this.defaultPanelValue);
    }
    this.value = newValue;
  }
  public get isValueArray(): boolean { return true; }
  public isEmpty(): boolean {
    var val = this.value;
    if (!val || !Array.isArray(val)) return true;
    for (var i = 0; i < val.length; i++) {
      if (!this.isRowEmpty(val[i])) return false;
    }
    return true;
  }
  public getProgressInfo(): IProgressInfo {
    return SurveyElement.getProgressInfoByElements(
      this.visiblePanelsCore,
      this.isRequired
    );
  }
  private isRowEmpty(val: any) {
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) return false;
    }
    return true;
  }
  public addPanelUI(): PanelModel {
    return this.addPanel(undefined, true);
  }
  /**
   * Adds a new panel based on the [template](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#template).
   * @param index *(Optional)* An index at which to insert the new panel. `undefined` adds the panel to the end or inserts it after the current panel if [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"tab"`. A negative index (for instance, -1) adds the panel to the end in all cases, regardless of the `displayMode` value.
   * @param runAdditionalActions *(Optional)* Pass `true` if you want to perform additional actions: check whether a new panel [can be added](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#canAddPanel), expand and focus the new panel, and run animated effects. Default value: `false` (the listed actions are skipped).
   * @see panelCount
   * @see panels
   * @see allowAddPanel
   * @see newPanelPosition
   */
  public addPanel(index?: number, runAdditionalActions?: boolean): PanelModel {
    const isUI = runAdditionalActions === true;
    if (isUI) {
      if (!this.canAddPanel) return null;
      if (!this.canLeaveCurrentPanel()) return null;
    }
    const newPanel = this.addPanelCore(index);
    this.panelOnFirstRendering(newPanel);
    if (isUI) {
      if (this.displayMode === "list" && this.panelsState !== "default") {
        newPanel.expand();
      }
      this.focusNewPanelCallback = () => {
        newPanel?.focusFirstQuestion();
      };
      if (!this.isPanelsAnimationRunning) {
        this.focusNewPanel();
      }
    }
    return newPanel;
  }
  private addPanelCore(index: number): PanelModel {
    const curIndex = this.currentIndex;
    if (index === undefined) {
      index = curIndex < 0 ? this.panelCount : curIndex + 1;
    }
    if (index < 0 || index > this.panelCount) {
      index = this.panelCount;
    }
    this.updateValueOnAddingPanel(curIndex < 0 ? this.panelCount - 1 : curIndex, index);
    if (!this.isRenderModeList) {
      this.currentIndex = index;
    }
    this.notifyOnPanelAddedRemoved(true, index);
    return this.panelsCore[index];
  }
  private focusNewPanelCallback: () => void;
  private focusNewPanel() {
    if (this.focusNewPanelCallback) {
      this.focusNewPanelCallback();
      this.focusNewPanelCallback = undefined;
    }
  }
  private updateValueOnAddingPanel(prevIndex: number, index: number): void {
    this.panelCount++;
    let newValue = this.value;
    if (!Array.isArray(newValue) || newValue.length !== this.panelCount) return;
    let hasModified = false;
    const lastIndex = this.panelCount - 1;
    if (index < lastIndex) {
      hasModified = true;
      const rec = newValue[lastIndex];
      newValue.splice(lastIndex, 1);
      newValue.splice(index, 0, rec);
    }
    if (!this.isValueEmpty(this.defaultPanelValue)) {
      hasModified = true;
      this.copyValue(newValue[index], this.defaultPanelValue);
    }
    if (this.copyDefaultValueFromLastEntry && newValue.length > 1) {
      const fromIndex = prevIndex > -1 && prevIndex <= lastIndex ? prevIndex : lastIndex;
      hasModified = true;
      this.copyValue(newValue[index], newValue[fromIndex]);
    }
    if (hasModified) {
      this.value = newValue;
    }
  }
  private canLeaveCurrentPanel(): boolean {
    return this.displayMode === "list" || !this.currentPanel || this.currentPanel.validate(true, true);
  }
  private copyValue(dest: any, src: any) {
    for (var key in src) {
      dest[key] = src[key];
    }
  }
  public getPanelRemoveButtonId(panel: PanelModel): string {
    return panel.id + "_remove_button";
  }
  public isRequireConfirmOnDelete(val: any): boolean {
    if (!this.confirmDelete) return false;
    const index = this.getVisualPanelIndex(val);
    if (index < 0 || index >= this.visiblePanelCount) return false;
    const panelValue = this.visiblePanelsCore[index].getValue();
    return !this.isValueEmpty(panelValue) &&
      (this.isValueEmpty(this.defaultPanelValue) || !this.isTwoValueEquals(panelValue, this.defaultPanelValue));
  }
  /**
   * Switches Dynamic Panel to the next panel. Returns `true` in case of success, or `false` if `displayMode` is `"list"` or the current panel contains validation errors.
   * @see displayMode
   */
  public goToNextPanel(): boolean {
    if (this.currentIndex < 0) return false;
    if (!this.canLeaveCurrentPanel()) return false;
    this.currentIndex++;
    return true;
  }
  /**
   * Switches Dynamic Panel to the previous panel.
   */
  public goToPrevPanel() {
    if (this.currentIndex < 0) return;
    this.currentIndex--;
  }
  public removePanelUI(value: any): void {
    this.removePanel(value, this.isRequireConfirmOnDelete(value));
  }
  /**
   * Deletes a panel from the [`panels`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#panels) array.
   * @param value A `PanelModel` instance or zero-based panel index.
   * @param confirmDelete *(Optional)* Pass `true` if you want to perform additional actions: check whether the panel [can be removed](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#canRemovePanel) and display a confirmation dialog.
   * @see addPanel
   */
  public removePanel(value: any, confirmDelete?: boolean): void {
    const visIndex = this.getVisualPanelIndex(value);
    if (visIndex < 0 || visIndex >= this.visiblePanelCount) return;
    const isUI = confirmDelete !== undefined;
    if (isUI) {
      if (!this.canRemovePanel) return;
      const removePanel = () => {
        this.removePanelCore(visIndex);
        const pnlCount = this.visiblePanelCount;
        const nextIndex = visIndex >= pnlCount ? pnlCount - 1 : visIndex;
        let id = pnlCount === 0 ? this.addButtonId : (nextIndex > -1 ? this.getPanelRemoveButtonId(this.visiblePanels[nextIndex]) : "");
        if (!!id) {
          SurveyElement.FocusElement(id, true, this.survey?.rootElement);
        }
      };
      if (confirmDelete) {
        confirmActionAsync({
          message: this.confirmDeleteText,
          funcOnYes: () => { removePanel(); },
          locale: this.getLocale(),
          rootElement: this.survey.rootElement,
          cssClass: this.cssClasses.confirmDialog
        });
      } else {
        removePanel();
      }
    } else {
      this.removePanelCore(visIndex);
    }
  }
  private removedPanelIndex: number;
  private removePanelCore(visIndex: number): void {
    this.removedPanelIndex = visIndex;
    const panel = this.visiblePanelsCore[visIndex];
    const index = this.panelsCore.indexOf(panel);
    if (index < 0) return;
    if (this.survey && !this.survey.dynamicPanelRemoving(this, index, panel)) return;
    this.panelsCore.splice(index, 1);
    this.updateBindings("panelCount", this.panelCount);
    this.singleInputOnRemoveItem(visIndex);
    var value = this.value;
    if (!value || !Array.isArray(value) || index >= value.length) {
      this.updateFooterActions();
    } else {
      this.isValueChangingInternally = true;
      value.splice(index, 1);
      this.value = value;
      this.updateFooterActions();
      this.fireCallback(this.panelCountChangedCallback);
      this.notifyOnPanelAddedRemoved(false, index, panel);
      this.isValueChangingInternally = false;
    }
  }
  private notifyOnPanelAddedRemoved(isAdded: boolean, index: number, panel?: PanelModel): void {
    if (!panel) {
      panel = this.panelsCore[index];
    }
    const sQN = this.getShowQuestionNumbers();
    if (this.survey) {
      const updateIndeces = sQN === "default";
      if (isAdded) {
        this.survey.dynamicPanelAdded(this, index, panel, updateIndeces);
      } else {
        this.survey.dynamicPanelRemoved(this, index, panel, updateIndeces);
      }
    }
    if (isAdded && !!panel && (sQN === "onpanel" || sQN === "recursive")) {
      panel.setVisibleIndex(0);
    }
  }
  private recursiveNoCallback(): string {
    return this.getShowQuestionNumbers() === "recursive" ? this.no : "";
  }
  private getVisualPanelIndex(val: any): number {
    if (Helpers.isNumber(val)) return val;
    const visPanels = this.visiblePanelsCore;
    for (var i = 0; i < visPanels.length; i++) {
      if (visPanels[i] === val || visPanels[i].data === val) return i;
    }
    return -1;
  }
  private getPanelVisibleIndexById(id: string): number {
    const visPanels = this.visiblePanelsCore;
    for (var i = 0; i < visPanels.length; i++) {
      if (visPanels[i].id === id) return i;
    }
    return -1;
  }
  public locStrsChanged() {
    super.locStrsChanged();
    this.locTemplateTitle.strChanged();
    var panels = this.panelsCore;
    for (var i = 0; i < panels.length; i++) {
      panels[i].locStrsChanged();
    }
    if (this.tabbedMenu) {
      this.tabbedMenu.locStrsChanged();
    }
  }
  public clearIncorrectValues() {
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.clearIncorrectValuesInPanel(i);
    }
  }
  public clearErrors() {
    super.clearErrors();
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.panelsCore[i].clearErrors();
    }
  }
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (index < 0 || index >= this.panelsCore.length) return null;
    return this.panelsCore[index].getQuestionByName(name);
  }
  private clearIncorrectValuesInPanel(index: number) {
    var panel = this.panelsCore[index];
    panel.clearIncorrectValues();
    var val = this.value;
    var values = !!val && index < val.length ? val[index] : null;
    if (!values) return;
    var isChanged = false;
    for (var key in values) {
      if (this.getSharedQuestionFromArray(key, index)) continue;
      var q = panel.getQuestionByValueName(key);
      if (!!q) continue;
      if (
        this.iscorrectValueWithPostPrefix(panel, key, settings.commentSuffix) ||
        this.iscorrectValueWithPostPrefix(
          panel,
          key,
          settings.matrix.totalsSuffix
        )
      )
        continue;
      delete values[key];
      isChanged = true;
    }
    if (isChanged) {
      val[index] = values;
      this.value = val;
    }
  }
  private iscorrectValueWithPostPrefix(
    panel: PanelModel,
    key: string,
    postPrefix: string
  ): boolean {
    if (key.indexOf(postPrefix) !== key.length - postPrefix.length)
      return false;
    return !!panel.getQuestionByName(key.substring(0, key.indexOf(postPrefix)));
  }
  public getSharedQuestionFromArray(name: string, panelIndex: number): Question {
    return !!this.survey && !!this.valueName ? <Question>(this.survey.getQuestionByValueNameFromArray(this.valueName, name, panelIndex)) : null;
  }
  public addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void {
    const contextQ = !!context?.isValidator ? context.errorOwner : context;
    const hasContext = !!context && (context === true || this.template.questions.indexOf(contextQ) > -1);
    const panelObjs = new Array<IConditionObject>();
    const questions = this.template.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].addConditionObjectsByContext(panelObjs, context);
    }
    for (var index = 0; index < settings.panel.maxPanelCountInCondition; index++) {
      const indexStr = "[" + index + "].";
      const prefixName = this.getValueName() + indexStr;
      const prefixText = this.processedTitle + indexStr;
      for (var i = 0; i < panelObjs.length; i++) {
        if (!!panelObjs[i].context) {
          objects.push(panelObjs[i]);
        } else {
          objects.push({
            name: prefixName + panelObjs[i].name,
            text: prefixText + panelObjs[i].text,
            question: panelObjs[i].question,
          });
        }
      }
    }
    if (hasContext) {
      const prefixName = context === true ? this.getValueName() + "." : "";
      const prefixText = context === true ? this.processedTitle + "." : "";
      const panelPrefix = settings.expressionVariables.panel + ".";
      for (var i = 0; i < panelObjs.length; i++) {
        if (panelObjs[i].question == context) continue;
        const obj: IConditionObject = {
          name: prefixName + panelPrefix + panelObjs[i].name,
          text: prefixText + panelPrefix + panelObjs[i].text,
          question: panelObjs[i].question
        };
        obj.context = this;
        objects.push(obj);
      }
    }
  }
  protected collectNestedQuestionsCore(questions: Question[], visibleOnly: boolean, includeNested: boolean, includeItSelf: boolean): void {
    if (includeItSelf) {
      questions.push(this);
    }
    const panels = visibleOnly ? this.visiblePanelsCore : this.panelsCore;
    if (!Array.isArray(panels)) return;
    panels.forEach(panel => {
      panel.questions.forEach(q => q.addNestedQuestion(questions, visibleOnly, includeNested, includeItSelf));
    });
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson(operator);
    var questionName = path;
    var pos = path.indexOf(".");
    if (pos > -1) {
      questionName = path.substring(0, pos);
      path = path.substring(pos + 1);
    }
    var question = this.template.getQuestionByName(questionName);
    if (!question) return null;
    return question.getConditionJson(operator, path);
  }
  protected onReadOnlyChanged(): void {
    var readOnly = this.isReadOnly;
    this.template.readOnly = readOnly;
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.panelsCore[i].readOnly = readOnly;
    }
    this.updateNoEntriesTextDefaultLoc();
    this.updateFooterActions();
    super.onReadOnlyChanged();
  }
  private updateNoEntriesTextDefaultLoc(): void {
    const loc = this.getLocalizableString("noEntriesText");
    if (!loc) return;
    loc.localizationName = (this.isReadOnly || !this.allowAddPanel) ? "noEntriesReadonlyText" : "noEntriesText";
  }
  public onSurveyLoad(): void {
    this.template.readOnly = this.isReadOnly;
    this.template.onSurveyLoad();
    const newPanelCount = this.adjustPanelCount();
    if (newPanelCount > -1) {
      this.setPropertyValue("panelCount", newPanelCount);
    }
    super.onSurveyLoad();
  }
  private adjustPanelCount(): number {
    const pnlCount = this.getPropertyValue("panelCount");
    if (pnlCount < this.minPanelCount) {
      return this.minPanelCount;
    }
    if (pnlCount > this.maxPanelCount) {
      return this.maxPanelCount;
    }
    return -1;
  }
  private hasPanelBuildFirstTime: boolean;
  private isBuildingPanelsFirstTime: boolean;
  private buildPanelsFirstTime(force: boolean = false): void {
    if (this.hasPanelBuildFirstTime) return;
    if (!force && this.wasNotRenderedInSurvey) return;
    this.blockAnimations();
    this.hasPanelBuildFirstTime = true;
    this.isBuildingPanelsFirstTime = true;
    if (this.getPropertyValue("panelCount") > 0) {
      this.panelCount = this.getPropertyValue("panelCount");
    }
    if (this.useTemplatePanel) {
      this.rebuildPanels();
    }
    this.setPanelsSurveyImpl();
    this.setPanelsState();
    this.assignOnPropertyChangedToTemplate();
    if (this.data && this.isValueChangedWithoutPanels) {
      this.isValueChangedWithoutPanels = false;
      this.runTriggersOnBuildPanelsFirstTime();
    }
    if (!!this.survey) {
      for (var i = 0; i < this.panelCount; i++) {
        this.notifyOnPanelAddedRemoved(true, i);
      }
    }
    this.updateIsReady();
    if (!this.showAddPanelButton) {
      this.updateNoEntriesTextDefaultLoc();
    }
    this.updateFooterActions();
    this.isBuildingPanelsFirstTime = false;
    this.releaseAnimations();
  }
  private runTriggersOnBuildPanelsFirstTime(): void {
    const val = this.value;
    this.visiblePanelsCore.forEach(p => {
      const panelValue = this.getPanelItemData(p.data);
      if (!Helpers.isValueEmpty(panelValue)) {
        const triggeredValue = Helpers.createCopyWithPrefix(panelValue, settings.expressionVariables.panel + ".");
        p.questions.forEach(q => q.runTriggers("", undefined, triggeredValue));
      }
    });
  }
  private get showAddPanelButton(): boolean { return this.allowAddPanel && !this.isReadOnly; }
  private get wasNotRenderedInSurvey(): boolean {
    return !this.hasPanelBuildFirstTime && !this.wasRendered && !!this.survey;
  }
  private get canBuildPanels(): boolean {
    return !this.isLoadingFromJson && !this.useTemplatePanel;
  }
  protected onFirstRenderingCore(): void {
    super.onFirstRenderingCore();
    this.buildPanelsFirstTime();
    this.template.onFirstRendering();
  }
  public localeChanged(): void {
    super.localeChanged();
    this.panelsCore.forEach(panel => panel.localeChanged());
  }
  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    this.runPanelsCondition(this.panelsCore, properties);
  }
  public runTriggers(name: string, value: any, keys?: any): void {
    super.runTriggers(name, value, keys);
    this.visiblePanelsCore.forEach(p => {
      p.questions.forEach(q => q.runTriggers(name, value, keys));
    });
  }
  private reRunCondition() {
    if (!this.data) return;
    this.runCondition(this.getDataFilteredProperties());
  }
  protected runPanelsCondition(panels: PanelModel[], properties: HashTable<any>): void {
    this.isValueChangingInternally = true;
    let visibleIndex = 0;
    for (var i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const panelName = settings.expressionVariables.panel;
      const newProps = Helpers.createCopy(properties);
      newProps[panelName] = panel;
      panel.runCondition(newProps);
      if (panel.isVisible) {
        visibleIndex++;
      }
    }
    this.isValueChangingInternally = false;
  }
  private isValueChangedWithoutPanels: boolean;
  onAnyValueChanged(name: string, questionName: string): void {
    super.onAnyValueChanged(name, questionName);
    if (!this.hasPanelBuildFirstTime && name === this.getValueName()) {
      this.isValueChangedWithoutPanels = true;
    }
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.panelsCore[i].onAnyValueChanged(name, questionName);
      this.panelsCore[i].onAnyValueChanged(settings.expressionVariables.panel, "");
    }
  }
  private hasKeysDuplicated(context: ValidationContext): boolean {
    var keyValues: Array<any> = [];
    var res;
    for (var i = 0; i < this.panelsCore.length; i++) {
      res =
        this.isValueDuplicated(this.panelsCore[i], keyValues, context) ||
        res;
    }
    return res;
  }
  private updatePanelsContainsErrors() {
    const qs = this.changingValueQuestions;
    if (!Array.isArray(qs) || qs.length === 0) return;
    var question = qs[0];
    var parent = <PanelModel>question.parent;
    while(!!parent) {
      parent.updateContainsErrors();
      parent = <PanelModel>parent.parent;
    }
    this.updateContainsErrors();
  }
  protected validateElementCore(context: ValidationContext): boolean {
    if (this.isValueChangingInternally && !this.hasInputInChangedQuestions() || this.isBuildingPanelsFirstTime) return true;
    let res = true;
    const qs = this.changingValueQuestions;
    if (Array.isArray(qs)) {
      let qRes = true;
      qs.forEach(q => {
        qRes = q.validateElement(context) && qRes;
      });
      res = !this.hasKeysDuplicated(context) && qRes;
      this.updatePanelsContainsErrors();
    } else {
      res = this.validateInPanels(context);
    }
    return super.validateElementCore(context) && res;
  }
  private hasInputInChangedQuestions(): boolean {
    const qs = this.changingValueQuestions;
    if (!Array.isArray(qs) || qs.length === 0) return false;
    for (let i = 0; i < qs.length; i++) {
      if (qs[i].hasInput) return true;
    }
    return false;
  }
  protected getContainsErrors(): boolean {
    var res = super.getContainsErrors();
    if (res) return res;
    var panels = this.panelsCore;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].containsErrors) return true;
    }
    return false;
  }
  protected getIsAnswered(): boolean {
    if (!super.getIsAnswered()) return false;
    var panels = this.visiblePanelsCore;
    for (var i = 0; i < panels.length; i++) {
      var visibleQuestions = <Array<any>>[];
      panels[i].addQuestionsToList(visibleQuestions, true);
      for (var j = 0; j < visibleQuestions.length; j++) {
        if (!visibleQuestions[j].isAnswered) return false;
      }
    }
    return true;
  }
  protected clearValueOnHidding(isClearOnHidden: boolean): void {
    if (!isClearOnHidden) {
      if (!!this.survey && this.survey.getQuestionClearIfInvisible("onHidden") === "none") return;
      this.clearValueInPanelsIfInvisible("onHiddenContainer");
    }
    super.clearValueOnHidding(isClearOnHidden);
  }
  public clearValueIfInvisible(reason: string = "onHidden"): void {
    const panelReason = reason === "onHidden" ? "onHiddenContainer" : reason;
    this.clearValueInPanelsIfInvisible(panelReason);
    super.clearValueIfInvisible(reason);
  }
  private clearValueInPanelsIfInvisible(reason: string): void {
    for (var i = 0; i < this.panelsCore.length; i++) {
      const panel = this.panelsCore[i];
      var questions = panel.questions;
      this.isSetPanelItemData = {};
      for (var j = 0; j < questions.length; j++) {
        const q = questions[j];
        if (q.visible && !panel.isVisible) continue;
        q.clearValueIfInvisible(reason);
        this.isSetPanelItemData[q.getValueName()] = this.maxCheckCount + 1;
      }
    }
    this.isSetPanelItemData = {};
  }
  protected getIsRunningValidators(): boolean {
    if (super.getIsRunningValidators()) return true;
    for (var i = 0; i < this.panelsCore.length; i++) {
      var questions = this.panelsCore[i].questions;
      for (var j = 0; j < questions.length; j++) {
        if (questions[j].isRunningValidators) return true;
      }
    }
    return false;
  }
  public getAllErrors(): Array<SurveyError> {
    var result = super.getAllErrors();
    const panels = this.visiblePanelsCore;
    for (var i = 0; i < panels.length; i++) {
      var questions = panels[i].questions;
      for (var j = 0; j < questions.length; j++) {
        var errors = questions[j].getAllErrors();
        if (errors && errors.length > 0) {
          result = result.concat(errors);
        }
      }
    }
    return result;
  }
  public getValueGetterContext(): IValueGetterContext {
    return new PanelDynamicValueGetterContext(this);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var values = this.getUnbindValue(value);
    if (!values || !Array.isArray(values)) return values;
    for (var i = 0; i < this.panelsCore.length && i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      values[i] = this.getPanelDisplayValue(i, val, keysAsText);
    }
    return values;
  }

  private getPanelDisplayValue(
    panelIndex: number,
    val: any,
    keysAsText: boolean
  ): any {
    if (!val) return val;
    var panel = this.panelsCore[panelIndex];
    var keys = Object.keys(val);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var question = panel.getQuestionByValueName(key);
      if (!question) {
        question = this.getSharedQuestionFromArray(key, panelIndex);
      }
      if (!!question) {
        var qValue = question.getDisplayValue(keysAsText, val[key]);
        val[key] = qValue;
        if (keysAsText && !!question.title && question.title !== key) {
          val[question.title] = qValue;
          delete val[key];
        }
      }
    }
    return val;
  }
  private validateInPanels(context: ValidationContext): boolean {
    let res = true;
    const panels = this.visiblePanels;
    const keyValues: Array<any> = [];
    for (let i = 0; i < panels.length; i++) {
      let isPnlValid = panels[i].validateElement(context);
      isPnlValid = !this.isValueDuplicated(panels[i], keyValues, context) && isPnlValid;
      if (!this.isRenderModeList && !isPnlValid && res && context.focusOnFirstError) {
        this.currentIndex = i;
      }
      res = isPnlValid && res;
    }
    return res;
  }
  private isValueDuplicated(panel: PanelModel, keyValues: Array<any>, context: ValidationContext): boolean {
    if (!this.keyName) return false;
    var question = <Question>panel.getQuestionByValueName(this.keyName);
    if (!question || question.isEmpty()) return false;
    var value = question.value;
    const qs = this.changingValueQuestions;
    if (Array.isArray(qs) && qs.indexOf(question) < 0) {
      question.validateElement(context);
    }
    for (var i = 0; i < keyValues.length; i++) {
      if (value == keyValues[i]) {
        if (context.fireCallback) {
          question.addError(
            new KeyDuplicationError(this.keyDuplicationError, this)
          );
        }
        context.setErrorElement(question);
        return true;
      }
    }
    keyValues.push(value);
    return false;
  }
  public getPanelActions(panel: PanelModel): Array<IAction> {
    let actions = panel.footerActions;
    if (this.removePanelButtonLocation !== "right") {
      actions.push(new Action({
        id: `remove-panel-${panel.id}`,
        component: "sv-paneldynamic-remove-btn",
        visible: <any>new ComputedUpdater(() => [this.canRenderRemovePanel(panel, "bottom")].every((val: boolean) => val === true)),
        data: { question: this, panel: panel }
      }));
    }
    if (!!this.survey) {
      actions = this.survey.getUpdatedPanelFooterActions(panel, actions, this);
    }
    return actions;
  }
  public canRenderRemovePanelOnRight(panel: PanelModel): boolean {
    return this.canRenderRemovePanel(panel, "right");
  }
  private canRenderRemovePanel(panel: PanelModel, side: string): boolean {
    const canRemove = this.canRemovePanel;
    const notCollpased = panel.state !== "collapsed";
    return this.removePanelButtonLocation === side && canRemove && notCollpased;
  }
  protected createNewPanel(): PanelModel {
    var panel = this.createAndSetupNewPanelObject();
    var json = this.template.toJSON();
    new JsonObject().toObject(json, panel);
    panel.renderWidth = "100%";
    panel.updateCustomWidgets();
    panel.questions.forEach(q => q.setParentQuestion(this));
    new QuestionPanelDynamicItem(this, panel);
    panel.onGetFooterActionsCallback = () => {
      return this.getPanelActions(panel);
    };
    panel.onGetFooterToolbarCssCallback = () => { return this.cssClasses.panelFooter; };
    panel.registerPropertyChangedHandlers(["visible"], () => {
      if (panel.visible)this.onPanelAdded(panel);
      else this.onPanelRemoved(panel);
      this.updateFooterActions();
    });
    return panel;
  }
  protected createAndSetupNewPanelObject(): PanelModel {
    var panel = this.createNewPanelObject();
    panel.isInteractiveDesignElement = false;
    panel.setParentQuestion(this);
    panel.onGetQuestionTitleLocation = () => this.getTemplateQuestionTitleLocation();
    panel.onGetQuestionTitleWidth = () => this.templateQuestionTitleWidth;
    panel.recursiveNoCallback = () => this.recursiveNoCallback();
    return panel;
  }
  private getTemplateQuestionTitleLocation(): string {
    return this.templateQuestionTitleLocation != "default"
      ? this.templateQuestionTitleLocation
      : this.getParentTitleLocation();
  }
  public getChildErrorLocation(child: Question): string {
    if (this.templateErrorLocation !== "default") return this.templateErrorLocation;
    return super.getChildErrorLocation(child);
  }
  protected createNewPanelObject(): PanelModel {
    return Serializer.createClass("panel");
  }
  private settingPanelCountBasedOnValue: boolean;
  private setPanelCountBasedOnValue() {
    if (this.isValueChangingInternally || this.useTemplatePanel) return;
    var val = this.value;
    var newPanelCount = val && Array.isArray(val) ? val.length : 0;
    if (newPanelCount == 0 && this.getPropertyValue("panelCount") > 0) {
      newPanelCount = this.getPropertyValue("panelCount");
    }
    this.settingPanelCountBasedOnValue = true;
    this.panelCount = newPanelCount;
    this.settingPanelCountBasedOnValue = false;
  }
  public setQuestionValue(newValue: any): void {
    if (this.settingPanelCountBasedOnValue) return;
    super.setQuestionValue(newValue, false);
    this.setPanelCountBasedOnValue();
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.panelUpdateValueFromSurvey(this.panelsCore[i]);
    }
    this.updateIsAnswered();
  }
  public onSurveyValueChanged(newValue: any): void {
    if (newValue === undefined && this.isAllPanelsEmpty()) return;
    super.onSurveyValueChanged(newValue);
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.panelSurveyValueChanged(this.panelsCore[i]);
    }
    if (newValue === undefined) {
      this.setValueBasedOnPanelCount();
    }
    this.updateIsReady();
  }
  private isAllPanelsEmpty(): boolean {
    for (var i = 0; i < this.panelsCore.length; i++) {
      if (!Helpers.isValueEmpty(this.panelsCore[i].getValue()))
        return false;
    }
    return true;
  }
  private panelUpdateValueFromSurvey(panel: PanelModel) {
    const questions = panel.questions;
    var values = this.getPanelItemData(panel.data);
    for (var i = 0; i < questions.length; i++) {
      const q = questions[i];
      q.updateValueFromSurvey(values[q.getValueName()]);
      q.updateCommentFromSurvey(
        values[q.getValueName() + settings.commentSuffix]
      );
      q.initDataUI();
    }
  }
  private panelSurveyValueChanged(panel: PanelModel) {
    var questions = panel.questions;
    var values = this.getPanelItemData(panel.data);
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      q.onSurveyValueChanged(values[q.getValueName()]);
    }
  }
  protected onSetData(): void {
    super.onSetData();
    if (!this.isLoadingFromJson && this.useTemplatePanel) {
      this.setTemplatePanelSurveyImpl();
      this.rebuildPanels();
    }
  }
  protected isNewValueCorrect(val: any): boolean {
    return Array.isArray(val);
  }
  public getValueChangingOptions(childQuestion: Question): any {
    let pnl = childQuestion.parent;
    while(pnl.parent) {
      pnl = pnl.parent;
    }
    const panel = pnl;
    const panelIndex = this.panels.indexOf(<PanelModel>panel);
    return {
      question: this,
      panel: panel,
      name: childQuestion.name,
      panelIndex: panelIndex,
      panelData: this.getPanelItemDataByIndex(panelIndex),
      oldValue: childQuestion.value
    };
  }
  //IQuestionPanelDynamicData
  getItemIndex(item: ISurveyData): number {
    var res = this.items.indexOf(item);
    return res > -1 ? res : this.items.length;
  }
  getVisibleItemIndex(item: ISurveyData): number {
    const visPanels = this.visiblePanelsCore;
    for (var i = 0; i < visPanels.length; i++) {
      if (visPanels[i].data === item) return i;
    }
    return visPanels.length;
  }
  getPanelItemData(item: ISurveyData): any {
    return this.getPanelItemDataByIndex(this.items.indexOf(item));
  }
  private getPanelItemDataByIndex(index: number): any {
    const items = this.items;
    var qValue = this.value;
    if (index < 0 && Array.isArray(qValue) && qValue.length > items.length) {
      index = items.length;
    }
    if (index < 0) return {};
    if (!qValue || !Array.isArray(qValue) || qValue.length <= index) return {};
    return qValue[index];
  }
  private isSetPanelItemData: HashTable<number> = {};
  private static maxCheckCount = 3;
  setPanelItemData(item: ISurveyData, name: string, val: any): void {
    if (this.isSetPanelItemData[name] > this.maxCheckCount)
      return;
    if (!this.isSetPanelItemData[name]) {
      this.isSetPanelItemData[name] = 0;
    }
    this.isSetPanelItemData[name]++;
    var items = this.items;
    var index = items.indexOf(item);
    if (index < 0) index = items.length;
    var qValue = this.getUnbindValue(this.value);
    if (!qValue || !Array.isArray(qValue)) {
      qValue = [];
    }
    const lValue = Math.max(index + 1, items.length);
    for (var i = qValue.length; i < lValue; i++) {
      qValue.push({});
    }
    if (!qValue[index]) qValue[index] = {};
    if (!this.isValueEmpty(val)) {
      qValue[index][name] = val;
    } else {
      delete qValue[index][name];
    }
    if (index >= 0 && index < this.panelsCore.length) {
      if (!Array.isArray(this.changingValueQuestions)) {
        this.changingValueQuestions = [];
      }
      this.changingValueQuestions.push(this.panelsCore[index].getQuestionByValueName(name));
    }
    this.value = qValue;
    this.changingValueQuestions = null;
    this.isSetPanelItemData[name]--;
    if (this.isSetPanelItemData[name] - 1) {
      delete this.isSetPanelItemData[name];
    }
  }
  getRootData(): ISurveyData {
    return this.data;
  }
  public getPlainData(options: IPlainDataOptions = { includeEmpty: true }): IQuestionPlainData {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      questionPlainData.isNode = true;
      const prevData = Array.isArray(questionPlainData.data) ? [].concat(questionPlainData.data) : [];
      questionPlainData.data = this.panels.map(
        (panel: PanelModel, index: number) => {
          var panelDataItem = <any>{
            name: panel.name || index,
            title: panel.title || "Panel",
            value: panel.getValue(),
            displayValue: panel.getValue(),
            getString: (val: any) =>
              typeof val === "object" ? JSON.stringify(val) : val,
            isNode: true,
            data: panel.questions
              .map((question: Question) => question.getPlainData(options))
              .filter((d: any) => !!d),
          };
          (options.calculations || []).forEach((calculation) => {
            panelDataItem[calculation.propertyName] = (<any>panel)[
              calculation.propertyName
            ];
          });
          return panelDataItem;
        }
      );
      questionPlainData.data = questionPlainData.data.concat(prevData);
    }
    return questionPlainData;
  }
  public updateElementCss(reNew?: boolean) {
    super.updateElementCss(reNew);
    for (var i = 0; i < this.panelsCore.length; i++) {
      var el = this.panelsCore[i];
      el.updateElementCss(reNew);
    }
  }
  public get progressText(): string {
    var rangeMax = this.visiblePanelCount;
    return this.getLocalizationFormatString("panelDynamicProgressText", this.currentIndex + 1, rangeMax);
  }
  public get progress(): string {
    return ((this.currentIndex + 1) / this.visiblePanelCount) * 100 + "%";
  }
  public get progressBarAriaLabel(): string {
    return getLocaleString("progressbar", this.getLocale());
  }
  public getRootCss(): string {
    return new CssClassBuilder().append(super.getRootCss()).append(this.cssClasses.empty, this.getShowNoEntriesPlaceholder()).toString();
  }
  public get cssHeader(): string {
    const showTab = this.isRenderModeTab && !!this.visiblePanelCount;
    return new CssClassBuilder()
      .append(super.getCssHeader(this.cssClasses))
      .append(this.cssClasses.headerTab, this.hasTitleOnTop && showTab)
      .toString();
  }
  public getTabsContainerCss(): string {
    return new CssClassBuilder().append(this.cssClasses.tabsContainer).append(this.cssClasses.tabsContainerWithHeader, this.hasTitleOnTop).toString();
  }
  public getPanelWrapperCss(panel: PanelModel): string {
    return new CssClassBuilder()
      .append(this.cssClasses.panelWrapper, !panel || panel.visible)
      .append(this.cssClasses.panelWrapperList, this.isRenderModeList)
      .append(this.cssClasses.panelWrapperInRow, this.removePanelButtonLocation === "right")
      .toString();
  }
  public getPanelRemoveButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.button)
      .append(this.cssClasses.buttonRemove)
      .append(this.cssClasses.buttonRemoveRight, this.removePanelButtonLocation === "right")
      .toString();
  }
  public getAddButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.button)
      .append(this.cssClasses.buttonAdd)
      .append(this.cssClasses.buttonAdd + "--list-mode", this.displayMode === "list")
      .toString();
  }
  public getPrevButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.buttonPrev)
      .append(this.cssClasses.buttonPrevDisabled, !this.isPrevButtonVisible)
      .toString();
  }
  public getNextButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.buttonNext)
      .append(this.cssClasses.buttonNextDisabled, !this.isNextButtonVisible)
      .toString();
  }
  /**
   * A text displayed when Dynamic Panel contains no entries.
   */
  public get noEntriesText(): string {
    return this.getLocalizableStringText("noEntriesText");
  }
  public set noEntriesText(val: string) {
    this.setLocalizableStringText("noEntriesText", val);
  }
  public get locNoEntriesText(): LocalizableString {
    return this.getLocalizableString("noEntriesText");
  }
  public getShowNoEntriesPlaceholder(): boolean {
    return !!this.cssClasses.noEntriesPlaceholder && !this.isDesignMode && this.visiblePanelCount === 0;
  }
  public needResponsiveWidth(): boolean {
    const panels = this.getPanels();
    for (let i = 0; i < panels.length; i++) {
      const panel = <PanelModel>panels[i];
      if (panel.isVisible && panel.needResponsiveWidth()) return true;
    }
    return false;
  }
  private tabbedMenuValue: AdaptiveActionContainer<PanelDynamicTabbedMenuItem>;
  public get hasTabbedMenu(): boolean {
    return this.isRenderModeTab && this.visiblePanels.length > 0;
  }
  public get tabbedMenu(): AdaptiveActionContainer<PanelDynamicTabbedMenuItem> | null {
    if (!this.isRenderModeTab) return null;
    if (!this.tabbedMenuValue) {
      this.tabbedMenuValue = new AdaptiveActionContainer<PanelDynamicTabbedMenuItem>();
      this.tabbedMenuValue.dotsItem.popupModel.showPointer = false;
      this.tabbedMenuValue.dotsItem.popupModel.verticalPosition = "bottom";
      this.tabbedMenuValue.dotsItem.popupModel.horizontalPosition = "center";
      this.updateElementCss(false);
    }
    return this.tabbedMenuValue;
  }
  @property({ defaultValue: false }) _showFooterToolbar: boolean;

  get showFooterToolbar() {
    return this.footerToolbar && this._showFooterToolbar;
  }

  private footerToolbarValue: ActionContainer;
  public get footerToolbar(): ActionContainer {
    if (!this.footerToolbarValue) {
      this.initFooterToolbar();
    }
    return this.footerToolbarValue;
  }
  @property({ defaultValue: false, onSet: (_, target) => { target.updateFooterActions(); } })
    legacyNavigation: boolean;

  public get ariaRole() {
    return "group";
  }
  public get ariaRequired() {
    return null;
  }
  public get ariaInvalid() {
    return null;
  }
  private updateFooterActionsCallback: any;
  private updateFooterActions() {
    if (!!this.updateFooterActionsCallback) {
      this.updateFooterActionsCallback();
    }
  }
  private initFooterToolbar() {
    this.footerToolbarValue = this.createActionContainer();
    const items = [];
    const prevTextBtn = new Action({
      id: "sv-pd-prev-btn",
      title: this.prevPanelText,
      action: () => {
        this.goToPrevPanel();
      }
    });
    const nextTextBtn = new Action({
      id: "sv-pd-next-btn",
      title: this.nextPanelText,
      action: () => {
        this.goToNextPanel();
      }
    });
    const addBtn = new Action({
      id: "sv-pd-add-btn",
      component: "sv-paneldynamic-add-btn",
      data: { question: this }
    });
    const prevBtnIcon = new Action({
      id: "sv-prev-btn-icon",
      component: "sv-paneldynamic-prev-btn",
      data: { question: this }
    });
    const progressText = new Action({
      id: "sv-pd-progress-text",
      component: "sv-paneldynamic-progress-text",
      data: { question: this }
    });
    const nextBtnIcon = new Action({
      id: "sv-pd-next-btn-icon",
      component: "sv-paneldynamic-next-btn",
      data: { question: this }
    });
    items.push(prevTextBtn, nextTextBtn, addBtn, prevBtnIcon, progressText, nextBtnIcon);
    this.updateFooterActionsCallback = () => {
      const isLegacyNavigation = this.legacyNavigation;
      const isRenderModeList = this.isRenderModeList;
      const isMobile = this.isMobile;
      const showNavigation = !isLegacyNavigation && !isRenderModeList;
      prevTextBtn.visible = showNavigation && this.currentIndex > 0;
      nextTextBtn.visible = showNavigation && this.currentIndex < this.visiblePanelCount - 1;
      nextTextBtn.needSpace = isMobile && nextTextBtn.visible && prevTextBtn.visible;
      addBtn.visible = this.canAddPanel;
      addBtn.needSpace = this.isMobile && !nextTextBtn.visible && prevTextBtn.visible;
      progressText.visible = !this.isRenderModeList && !isMobile;
      progressText.needSpace = !isLegacyNavigation && !this.isMobile;

      const showLegacyNavigation = isLegacyNavigation && !isRenderModeList;
      prevBtnIcon.visible = showLegacyNavigation;
      nextBtnIcon.visible = showLegacyNavigation;
      prevBtnIcon.needSpace = showLegacyNavigation;
    };
    this.updateFooterActionsCallback();
    this.footerToolbarValue.setItems(items);
    this.footerToolbar.flushUpdates();
    this._showFooterToolbar = new ComputedUpdater<boolean>(() => this.footerToolbarValue?.hasVisibleActions) as any as boolean;
  }
  private createTabByPanel(panel: PanelModel, visPanelIndex: number) {
    if (!this.isRenderModeTab) return;

    const locTitle = new LocalizableString(panel, true);
    locTitle.onGetTextCallback = (str: string): string => {
      if (!str) {
        str = this.locTabTitlePlaceholder.renderedHtml;
      }
      if (!this.survey) return str;
      const options = {
        title: str,
        panel: panel,
        visiblePanelIndex: visPanelIndex
      };
      this.survey.dynamicPanelGetTabTitle(this, options);
      return options.title;
    };
    locTitle.sharedData = this.locTemplateTabTitle;
    const panelId = panel.id;
    const isActive = this.getPanelVisibleIndexById(panelId) === this.currentIndex;
    const newItem = new PanelDynamicTabbedMenuItem({
      id: `${this.id}_tab_${panelId}`,
      panelId: panelId,
      pressed: isActive,
      locTitle: locTitle,
      disableHide: isActive,
      action: () => {
        this.currentIndex = this.getPanelVisibleIndexById(panelId);
      }
    });
    return newItem;
  }
  private getTabbedMenuCss(cssClasses?: any): string {
    const css = cssClasses ?? this.cssClasses;
    return new CssClassBuilder()
      .append(css.tabsRoot)
      .append(css.tabsLeft, this.tabAlign === "left")
      .append(css.tabsRight, this.tabAlign === "right")
      .append(css.tabsCenter, this.tabAlign === "center")
      .toString();
  }
  private updateTabToolbarItemsPressedState() {
    if (!this.isRenderModeTab) return;
    if (this.currentIndex < 0 || this.currentIndex >= this.visiblePanelCount) return;
    const panel = this.visiblePanelsCore[this.currentIndex];
    this.tabbedMenu.actions.forEach(action => {
      const isActive = action.panelId === panel.id;
      action.pressed = isActive;
      action.disableHide = isActive;
    });
  }
  private updateTabToolbar() {
    if (!this.isRenderModeTab) return;

    const items: Array<Action> = [];
    const visPanels = this.visiblePanelsCore;
    for (let i = 0; i < visPanels.length; i++) {
      this.visiblePanelsCore.forEach(panel => items.push(this.createTabByPanel(visPanels[i], i)));
    }
    this.tabbedMenu.setItems(items);
  }
  private addTabFromToolbar(panel: PanelModel, index: number) {
    if (!this.isRenderModeTab) return;

    const newItem = this.createTabByPanel(panel, index);
    this.tabbedMenu.actions.splice(index, 0, newItem);
    this.updateTabToolbarItemsPressedState();
  }
  private removeTabFromToolbar(panel: PanelModel) {
    if (!this.isRenderModeTab) return;
    const removedItem = this.tabbedMenu.actions.find(a => a.panelId == panel.id);
    if (!removedItem) return;
    this.tabbedMenu.actions.splice(this.tabbedMenu.actions.indexOf(removedItem), 1);
    this.updateTabToolbarItemsPressedState();
  }

  get showNavigation(): boolean {
    if (this.isReadOnly && this.visiblePanelCount == 1) return false;
    return this.visiblePanelCount > 0 && !!this.cssClasses.footer;
  }
  showSeparator(index: number): boolean {
    return this.isRenderModeList && index < this.renderedPanels.length - 1;
  }

  protected calcCssClasses(css: any): any {
    const classes = super.calcCssClasses(css);
    const tabbedMenu = <AdaptiveActionContainer>this.tabbedMenu;
    if (!!tabbedMenu) {
      tabbedMenu.containerCss = this.getTabbedMenuCss(classes);
      tabbedMenu.cssClasses = classes.tabs;
      tabbedMenu.dotsItem.cssClasses = classes.tabs;
      tabbedMenu.dotsItem.popupModel.contentComponentData.model.cssClasses = css.list;
    }
    return classes;
  }
  protected onMobileChanged(): void {
    super.onMobileChanged();
    this.updateFooterActions();
  }
}

Serializer.addClass(
  "paneldynamic",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true, category: "general" },
    {
      name: "templateElements",
      alternativeName: "questions",
      baseClassName: "question",
      visible: false,
      isLightSerializable: false
    },
    { name: "templateTitle:text", serializationProperty: "locTemplateTitle" },
    {
      name: "templateTabTitle", serializationProperty: "locTemplateTabTitle",
      visibleIf: (obj: any) => { return obj.displayMode === "tab"; }
    },
    {
      name: "tabTitlePlaceholder", serializationProperty: "locTabTitlePlaceholder",
      visibleIf: (obj: any) => { return obj.displayMode === "tab"; }
    },
    {
      name: "templateDescription:text",
      serializationProperty: "locTemplateDescription",
    },
    { name: "minWidth", defaultFunc: () => "auto" },
    { name: "noEntriesText:text", serializationProperty: "locNoEntriesText" },
    { name: "allowAddPanel:boolean", default: true },
    { name: "allowRemovePanel:boolean", default: true },
    { name: "newPanelPosition", choices: ["next", "last"], default: "last", category: "layout" },
    {
      name: "panelCount:number",
      isBindable: true,
      default: 0,
      choices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    { name: "minPanelCount:number", default: 0, minValue: 0 },
    {
      name: "maxPanelCount:number",
      defaultFunc: () => settings.panel.maxPanelCount,
    },
    "defaultPanelValue:panelvalue",
    { name: "copyDefaultValueFromLastEntry:boolean", alternativeName: "defaultValueFromLastPanel" },
    {
      name: "panelsState",
      default: "default",
      choices: ["default", "collapsed", "expanded", "firstExpanded"],
      visibleIf: (obj: any) => { return obj.displayMode === "list"; }
    },
    { name: "keyName" },
    {
      name: "keyDuplicationError",
      serializationProperty: "locKeyDuplicationError",
    },
    { name: "confirmDelete:boolean" },
    {
      name: "confirmDeleteText",
      serializationProperty: "locConfirmDeleteText",
      visibleIf: (obj: any) => { return obj.confirmDelete; }
    },
    {
      name: "addPanelText", alternativeName: "panelAddText",
      serializationProperty: "locAddPanelText",
      visibleIf: (obj: any) => { return obj.allowAddPanel; }
    },
    {
      name: "removePanelText", alternativeName: "panelRemoveText",
      serializationProperty: "locRemovePanelText",
      visibleIf: (obj: any) => { return obj.allowRemovePanel; }
    },
    {
      name: "prevPanelText", alternativeName: "panelPrevText",
      serializationProperty: "locPrevPanelText",
      visibleIf: (obj: any) => { return obj.displayMode !== "list"; }
    },
    {
      name: "nextPanelText", alternativeName: "panelNextText",
      serializationProperty: "locNextPanelText",
      visibleIf: (obj: any) => { return obj.displayMode !== "list"; }
    },
    {
      name: "showQuestionNumbers",
      default: "off",
      choices: ["default", "onpanel", "recursive", "off"],
    },
    { name: "questionStartIndex", visibleIf: (obj: QuestionPanelDynamicModel): boolean => {
      const sQN = obj.showQuestionNumbers;
      return sQN === "onpanel" || sQN === "recursive";
    } },
    { name: "renderMode", visible: false, isSerializable: false },
    { name: "displayMode", default: "list", choices: ["list", "carousel", "tab"] },
    {
      name: "showProgressBar:boolean", alternativeName: "showRangeInProgress",
      default: true,
      visibleIf: (obj: any) => { return obj.displayMode === "carousel"; }
    },
    {
      name: "progressBarLocation",
      default: "top",
      choices: ["top", "bottom", "topBottom"],
      visibleIf: (obj: any) => { return obj.showProgressBar && obj.displayMode === "carousel"; }
    },
    {
      name: "tabAlign", default: "center", choices: ["left", "center", "right"],
      visibleIf: (obj: any) => { return obj.displayMode === "tab"; }
    },
    {
      name: "templateQuestionTitleLocation", alternativeName: "templateTitleLocation",
      default: "default",
      choices: ["default", "top", "bottom", "left"],
    },
    {
      name: "templateQuestionTitleWidth",
      visibleIf: function (obj: any) {
        return !!obj && obj.template.availableQuestionTitleWidth();
      }
    },
    { name: "templateErrorLocation", default: "default", choices: ["default", "top", "bottom"] },
    {
      name: "templateVisibleIf:expression",
      category: "logic"
    },
    {
      name: "removePanelButtonLocation", alternativeName: "panelRemoveButtonLocation",
      default: "bottom",
      choices: ["bottom", "right"],
      visibleIf: (obj: any) => { return obj.allowRemovePanel; }
    },
  ],
  function () {
    return new QuestionPanelDynamicModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => {
  return new QuestionPanelDynamicModel(name);
});
