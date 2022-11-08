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
} from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import {
  TextPreProcessorValue,
  QuestionTextProcessor,
} from "./textPreProcessor";
import { Question, IConditionObject } from "./question";
import { PanelModel } from "./panel";
import { JsonObject, property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { KeyDuplicationError } from "./error";
import { settings } from "./settings";
import { confirmAction } from "./utils/utils";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ActionContainer } from "./actions/container";
import { Action } from "./actions/action";

export interface IQuestionPanelDynamicData {
  getItemIndex(item: ISurveyData): number;
  getPanelItemData(item: ISurveyData): any;
  setPanelItemData(item: ISurveyData, name: string, val: any): any;
  getSharedQuestionFromArray(name: string, panelIndex: number): Question;
  getSurvey(): ISurvey;
  getRootData(): ISurveyData;
}

class QuestionPanelDynamicItemTextProcessor extends QuestionTextProcessor {
  private sharedQuestions: any = {};
  constructor(
    private data: IQuestionPanelDynamicData,
    protected panelItem: QuestionPanelDynamicItem,
    protected variableName: string
  ) {
    super(variableName);
  }
  protected get survey(): ISurvey {
    return this.panelItem.getSurvey();
  }
  protected get panel(): PanelModel {
    return this.panelItem.panel;
  }
  private get panelIndex(): number {
    return !!this.data ? this.data.getItemIndex(this.panelItem) : -1;
  }
  protected getValues(): any {
    return this.panelItem.getAllValues();
  }
  protected getQuestionByName(name: string): Question {
    var res = super.getQuestionByName(name);
    if (!!res) return res;
    var index = this.panelIndex;
    res = index > -1 ? this.data.getSharedQuestionFromArray(name, index) : undefined;
    const qName = !!res ? res.name : name;
    this.sharedQuestions[qName] = name;
    return res;
  }
  protected getQuestionDisplayText(question: Question): string {
    const name = this.sharedQuestions[question.name];
    if (!name) return super.getQuestionDisplayText(question);
    const val = this.panelItem.getValue(name);
    return question.getDisplayValue(true, val);
  }
  protected onCustomProcessText(textValue: TextPreProcessorValue): boolean {
    if (textValue.name == QuestionPanelDynamicItem.IndexVariableName) {
      var index = this.panelIndex;
      if (index > -1) {
        textValue.isExists = true;
        textValue.value = index + 1;
        return true;
      }
    }
    if (
      textValue.name.toLowerCase().indexOf(
        QuestionPanelDynamicItem.ParentItemVariableName + "."
      ) == 0
    ) {
      var q = <Question>(<any>this.data);
      if (!!q && !!q.parentQuestion && !!q.parent && !!(<any>q.parent).data) {
        var processor = new QuestionPanelDynamicItemTextProcessor(
          <IQuestionPanelDynamicData>(<any>q.parentQuestion),
          <QuestionPanelDynamicItem>(<any>q.parent).data,
          QuestionPanelDynamicItem.ItemVariableName
        );
        var text = QuestionPanelDynamicItem.ItemVariableName +
          textValue.name.substring(QuestionPanelDynamicItem.ParentItemVariableName.length);
        var res = processor.processValue(text, textValue.returnDisplayValue);
        textValue.isExists = res.isExists;
        textValue.value = res.value;
      }
      return true;
    }
    return false;
  }
}

export class QuestionPanelDynamicItem implements ISurveyData, ISurveyImpl {
  public static ItemVariableName = "panel";
  public static ParentItemVariableName = "parentpanel";
  public static IndexVariableName = "panelIndex";
  private panelValue: PanelModel;
  private data: IQuestionPanelDynamicData;
  private textPreProcessor: QuestionPanelDynamicItemTextProcessor;
  constructor(data: IQuestionPanelDynamicData, panel: PanelModel) {
    this.data = data;
    this.panelValue = panel;
    this.textPreProcessor = new QuestionPanelDynamicItemTextProcessor(
      data,
      this,
      QuestionPanelDynamicItem.ItemVariableName
    );
    this.setSurveyImpl();
  }
  public get panel(): PanelModel {
    return this.panelValue;
  }
  public setSurveyImpl() {
    this.panel.setSurveyImpl(this);
  }
  public getValue(name: string): any {
    var values = this.getAllValues();
    return values[name];
  }
  public setValue(name: string, newValue: any) {
    const oldItemData = this.data.getPanelItemData(this);
    const oldValue = !!oldItemData ? oldItemData[name] : undefined;
    if (typeof oldValue !== "object" && Helpers.isTwoValueEquals(newValue, oldValue)) return;
    this.data.setPanelItemData(this, name, newValue);
    const questions = this.panel.questions;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].getValueName() === name) continue;
      questions[i].checkBindings(name, newValue);
    }
  }
  getVariable(name: string): any {
    return undefined;
  }
  setVariable(name: string, newValue: any) { }
  public getComment(name: string): string {
    var result = this.getValue(name + settings.commentPrefix);
    return result ? result : "";
  }
  public setComment(name: string, newValue: string, locNotification: any) {
    this.setValue(name + settings.commentPrefix, newValue);
  }
  getAllValues(): any {
    return this.data.getPanelItemData(this);
  }
  getFilteredValues(): any {
    var values: { [key: string]: any } = {};
    var surveyValues =
      !!this.data && !!this.data.getRootData()
        ? this.data.getRootData().getFilteredValues()
        : {};
    for (var key in surveyValues) {
      values[key] = surveyValues[key];
    }
    values[QuestionPanelDynamicItem.ItemVariableName] = this.getAllValues();
    if (!!this.data) {
      values[
        QuestionPanelDynamicItem.IndexVariableName.toLowerCase()
      ] = this.data.getItemIndex(this);
      const q = <Question>(<any>this.data);
      if (!!q && !!q.parentQuestion && !!q.parent) {
        values[QuestionPanelDynamicItem.ParentItemVariableName] = (<any>q.parent).getValue();
      }
    }
    return values;
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
  * Dynamic Panel allows respondents to add panels based on a template panel and delete them. Specify the [`templateElements`](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel#templateElements) property to configure template panel elements.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/ (linkStyle))
  */
export class QuestionPanelDynamicModel extends Question
  implements IQuestionPanelDynamicData {
  private templateValue: PanelModel;
  private loadingPanelCount: number = 0;
  private isValueChangingInternally: boolean;
  private changingValueQuestion: Question;
  private currentIndexValue: number = -1;

  renderModeChangedCallback: () => void;
  panelCountChangedCallback: () => void;
  currentIndexChangedCallback: () => void;

  constructor(name: string) {
    super(name);
    this.createNewArray("panels");
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

    this.createLocalizableString("confirmDeleteText", this, false, "confirmDelete");
    this.createLocalizableString("keyDuplicationError", this, false, true);
    this.createLocalizableString("panelAddText", this, false, "addPanel");
    this.createLocalizableString("panelRemoveText", this, false, "removePanel");
    this.createLocalizableString("panelPrevText", this, false, "pagePrevText");
    this.createLocalizableString("panelNextText", this, false, "pageNextText");
    this.createLocalizableString("noEntriesText", this, false, "noEntriesText");
    this.registerPropertyChangedHandlers(["panelsState"], () => {
      this.setPanelsState();
    });
    this.registerPropertyChangedHandlers(["isMobile"], () => {
      this.updateFooterActions();
    });
  }
  public get hasSingleInput(): boolean {
    return false;
  }
  public getFirstQuestionToFocus(withError: boolean): Question {
    for (var i = 0; i < this.panels.length; i++) {
      const res = this.panels[i].getFirstQuestionToFocus(withError);
      if (!!res) return res;
    }
    return null;
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
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
    if (this.isLoadingFromJson || this.useTemplatePanel || this.panels.length == 0)
      return;
    var property = Serializer.findProperty(element.getType(), options.name);
    if (!property) return;
    var panels = this.panels;
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
  public get isCompositeQuestion(): boolean {
    return true;
  }
  public clearOnDeletingContainer() {
    this.panels.forEach((panel) => {
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
  public getPanel(): IPanel {
    return this.template;
  }
  /**
   * An array of questions and panels included in the template panel.
   * @see template
   * @see panels
   * @see panelCount
   */
  public get templateElements(): Array<IElement> {
    return this.template.elements;
  }
  /**
   * A title for the template panel.
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
   * A description for the template panel.
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

  protected get items(): Array<ISurveyData> {
    var res = [];
    for (var i = 0; i < this.panels.length; i++) {
      res.push(this.panels[i].data);
    }
    return res;
  }
  /**
   * An array of `PanelModel` objects created based on the template panel.
   * @see PanelModel
   * @see template
   * @see panelCount
   */
  public get panels(): Array<PanelModel> {
    return this.getPropertyValue("panels");
  }
  /**
   * A zero-based index of the currently displayed panel.
   *
   * When `renderMode` is `"list"` or Dynamic Panel is empty (`panelCount` is 0), this property contains -1.
   * @see currentPanel
   * @see panels
   * @see panelCount
   * @see renderMode
   */
  public get currentIndex(): number {
    if (this.isRenderModeList) return -1;
    if (this.useTemplatePanel) return 0;
    if (this.currentIndexValue < 0 && this.panelCount > 0) {
      this.currentIndexValue = 0;
    }
    if (this.currentIndexValue >= this.panelCount) {
      this.currentIndexValue = this.panelCount - 1;
    }
    return this.currentIndexValue;
  }
  public set currentIndex(val: number) {
    if (this.currentIndexValue !== val) {
      if (val >= this.panelCount) val = this.panelCount - 1;
      this.currentIndexValue = val;
      this.updateFooterActions();
      this.fireCallback(this.currentIndexChangedCallback);
    }
  }
  /**
   * A `PanelModel` object that is the currently displayed panel.
   *
   * When `renderMode` is `"list"` or Dynamic Panel is empty (`panelCount` is 0), this property contains `null`.
   * @see currentIndex
   * @see panels
   * @see panelCount
   * @see renderMode
   */
  public get currentPanel(): PanelModel {
    var index = this.currentIndex;
    if (index < 0 || index >= this.panels.length) return null;
    return this.panels[index];
  }
  /**
   * Specifies whether to display a confirmation dialog when a respondent wants to delete a panel.
   * @see confirmDeleteText
   */
  public get confirmDelete(): boolean {
    return this.getPropertyValue("confirmDelete", false);
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
   * A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/master/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).
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
   * A caption for the Previous button. Applies only if `renderMode` is different from `"list"`.
   * @see renderMode
   * @see isPrevButtonShowing
   */
  public get panelPrevText(): string {
    return this.getLocalizableStringText("panelPrevText");
  }
  public set panelPrevText(val: string) {
    this.setLocalizableStringText("panelPrevText", val);
  }
  get locPanelPrevText(): LocalizableString {
    return this.getLocalizableString("panelPrevText");
  }
  /**
   * A caption for the Next button. Applies only if `renderMode` is different from `"list"`.
   * @see renderMode
   * @see isNextButtonShowing
   */
  public get panelNextText(): string {
    return this.getLocalizableStringText("panelNextText");
  }
  public set panelNextText(val: string) {
    this.setLocalizableStringText("panelNextText", val);
  }
  get locPanelNextText(): LocalizableString {
    return this.getLocalizableString("panelNextText");
  }
  /**
   * A caption for the Add Panel button.
   */
  public get panelAddText() {
    return this.getLocalizableStringText("panelAddText");
  }
  public set panelAddText(value: string) {
    this.setLocalizableStringText("panelAddText", value);
  }
  get locPanelAddText(): LocalizableString {
    return this.getLocalizableString("panelAddText");
  }
  /**
   * A caption for the Delete Panel button.
   * @see panelRemoveButtonLocation
   */
  public get panelRemoveText() {
    return this.getLocalizableStringText("panelRemoveText");
  }
  public set panelRemoveText(val: string) {
    this.setLocalizableStringText("panelRemoveText", val);
  }
  get locPanelRemoveText(): LocalizableString {
    return this.getLocalizableString("panelRemoveText");
  }
  /**
   * Returns true when the renderMode equals to "progressTop" or "progressTopBottom"
   */
  public get isProgressTopShowing(): boolean {
    return this.renderMode === "progressTop" || this.renderMode === "progressTopBottom";
  }
  /**
   * Returns true when the renderMode equals to "progressBottom" or "progressTopBottom"
   */
  public get isProgressBottomShowing(): boolean {
    return this.renderMode === "progressBottom" || this.renderMode === "progressTopBottom";
  }
  /**
   * Indicates whether the Previous button is visible.
   * @see currentIndex
   * @see currentPanel
   * @see panelPrevText
   */
  public get isPrevButtonShowing(): boolean {
    return this.currentIndex > 0;
  }
  /**
   * Indicates whether the Next button is visible.
   * @see currentIndex
   * @see currentPanel
   * @see panelNextText
   */
  public get isNextButtonShowing(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.panelCount - 1;
  }
  /**
   * Returns true when showRangeInProgress equals to true, renderMode doesn't equal to "list" and panelCount is >= 2.
   */
  public get isRangeShowing(): boolean {
    return (
      this.showRangeInProgress && this.currentIndex >= 0 && this.panelCount > 1
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
  /**
   * The number of panels in Dynamic Panel.
   * @see minPanelCount
   * @see maxPanelCount
   */
  public get panelCount(): number {
    return this.isLoadingFromJson || this.useTemplatePanel
      ? this.loadingPanelCount
      : this.panels.length;
  }
  public set panelCount(val: number) {
    if (val < 0) return;
    if (this.isLoadingFromJson || this.useTemplatePanel) {
      this.loadingPanelCount = val;
      return;
    }
    if (val == this.panels.length || this.useTemplatePanel) return;
    this.updateBindings("panelCount", val);
    this.prepareValueForPanelCreating();
    for (let i = this.panelCount; i < val; i++) {
      var panel = this.createNewPanel();
      this.panels.push(panel);
      if (this.renderMode == "list" && this.panelsState != "default") {
        if (this.panelsState === "expand") {
          panel.expand();
        } else {
          if (!!panel.title) {
            panel.collapse();
          }
        }
      }
    }
    if (val < this.panelCount) this.panels.splice(val, this.panelCount - val);
    this.setValueAfterPanelsCreating();
    this.setValueBasedOnPanelCount();
    this.reRunCondition();
    this.updateFooterActions();
    this.fireCallback(this.panelCountChangedCallback);
  }
  /**
   * Specifies whether users can expand and collapse panels. Applies if `renderMode` is `"list"` and the `templateTitle` property is specified.
   *
   * Possible values:
   *
   * - `"default"` (default) - All panels are displayed in full and cannot be collapsed.
   * - `"expanded"` - All panels are displayed in full and can be collapsed in the UI.
   * - `"collapsed"` - All panels display only their titles and descriptions and can be expanded in the UI.
   * - `"firstExpanded"` - Only the first panel is displayed in full; other panels are collapsed and can be expanded in the UI.
   * @see renderMode
   * @see templateTitle
   */
  public get panelsState(): string {
    return this.getPropertyValue("panelsState");
  }
  public set panelsState(val: string) {
    this.setPropertyValue("panelsState", val);
  }
  private setTemplatePanelSurveyImpl() {
    this.template.setSurveyImpl(
      this.useTemplatePanel
        ? this.surveyImpl
        : new QuestionPanelDynamicTemplateSurveyImpl(this)
    );
  }
  private setPanelsSurveyImpl() {
    for (var i = 0; i < this.panels.length; i++) {
      var panel = this.panels[i];
      if (panel == this.template) continue;
      panel.setSurveyImpl(<QuestionPanelDynamicItem>panel.data);
    }
  }
  private setPanelsState() {
    if (this.useTemplatePanel || this.renderMode != "list" || !this.templateTitle)
      return;
    for (var i = 0; i < this.panels.length; i++) {
      var state = this.panelsState;
      if (state === "firstExpanded") {
        state = i === 0 ? "expanded" : "collapsed";
      }
      this.panels[i].state = state;
    }
  }
  private setValueBasedOnPanelCount() {
    var value = this.value;
    if (!value || !Array.isArray(value)) value = [];
    if (value.length == this.panelCount) return;
    for (var i = value.length; i < this.panelCount; i++) value.push({});
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
    if (val == this.minPanelCount) return;
    this.setPropertyValue("minPanelCount", val);
    if (val > this.maxPanelCount) this.maxPanelCount = val;
    if (this.panelCount < val) this.panelCount = val;
  }
  /**
   * A maximum number of panels in Dynamic Panel. Users cannot add new panels if `panelCount` equals `maxPanelCount`.
   *
   * Default value: 100 (inherited from [`settings.panelMaximumPanelCount`](https://surveyjs.io/form-library/documentation/settings#panelMaximumPanelCount))
   * @see panelCount
   * @see minPanelCount
   * @see allowAddPanel
   */
  public get maxPanelCount(): number {
    return this.getPropertyValue("maxPanelCount");
  }
  public set maxPanelCount(val: number) {
    if (val <= 0) return;
    if (val > settings.panelMaximumPanelCount)
      val = settings.panelMaximumPanelCount;
    if (val == this.maxPanelCount) return;
    this.setPropertyValue("maxPanelCount", val);
    if (val < this.minPanelCount) this.minPanelCount = val;
    if (this.panelCount > val) this.panelCount = val;
  }
  /**
   * Specifies whether users are allowed to add new panels.
   *
   * Default value: `true`
   * @see canAddPanel
   * @see allowRemovePanel
   */
  public get allowAddPanel(): boolean {
    return this.getPropertyValue("allowAddPanel");
  }
  public set allowAddPanel(val: boolean) {
    this.setPropertyValue("allowAddPanel", val);
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
   * Gets or sets the location of question titles within the template panel relative to their input fields.
   *
   * - `"default"` (default) - Inherits the setting from the Dynamic Panel's `titleLocation` property, which in turn inherits the [`questionTitleLocation`](https://surveyjs.io/form-library/documentation/surveymodel#questionTitleLocation) property value specified for the Dynamic Panel's container (page or survey).
   * - `"top"` - Displays question titles above input fields.
   * - `"bottom"` - Displays question titles below input fields.
   * - `"left"` - Displays question titles to the left of input fields.
   * - `"hidden"` - Hides question titles.
   * @see titleLocation
   */
  public get templateTitleLocation(): string {
    return this.getPropertyValue("templateTitleLocation");
  }
  public set templateTitleLocation(value: string) {
    this.setPropertyValue("templateTitleLocation", value.toLowerCase());
  }
  /**
   * Use this property to show/hide the numbers in titles in questions inside a dynamic panel.
   * By default the value is "off". You may set it to "onPanel" and the first question inside a dynamic panel will start with 1 or "onSurvey" to include nested questions in dymamic panels into global survey question numbering.
   */
  public get showQuestionNumbers(): string {
    return this.getPropertyValue("showQuestionNumbers");
  }
  public set showQuestionNumbers(val: string) {
    this.setPropertyValue("showQuestionNumbers", val);
    if (!this.isLoadingFromJson && this.survey) {
      this.survey.questionVisibilityChanged(this, this.visible);
    }
  }
  /**
   * Specifies the location of the Delete Panel button relative to panel content.
   *
   * Possible values:
   *
   * - `"bottom"` (default) - Displays the Delete Panel button below panel content.
   * - `"right"` - Displays the Delete Panel button to the right of panel content.
   * @see panelRemoveText
   */
  public get panelRemoveButtonLocation(): string {
    return this.getPropertyValue("panelRemoveButtonLocation");
  }
  public set panelRemoveButtonLocation(val: string) {
    this.setPropertyValue("panelRemoveButtonLocation", val);
  }
  /**
   * Shows the range from 1 to panelCount when renderMode doesn't equal to "list". Set to false to hide this element.
   * @see panelCount
   * @see renderMode
   */
  public get showRangeInProgress(): boolean {
    return this.getPropertyValue("showRangeInProgress");
  }
  public set showRangeInProgress(val: boolean) {
    this.setPropertyValue("showRangeInProgress", val);
    this.updateFooterActions();
    this.fireCallback(this.currentIndexChangedCallback);
  }
  /**
   * By default the property equals to "list" and all dynamic panels are rendered one by one on the page. You may change it to: "progressTop", "progressBottom" or "progressTopBottom" to render only one dynamic panel at once. The progress and navigation elements can be rendred on top, bottom or both.
   */
  public get renderMode(): string {
    return this.getPropertyValue("renderMode");
  }
  public set renderMode(val: string) {
    this.setPropertyValue("renderMode", val);
    this.updateFooterActions();
    this.fireCallback(this.renderModeChangedCallback);
  }
  public get isRenderModeList() {
    return this.renderMode === "list";
  }
  public setVisibleIndex(value: number): number {
    if (!this.isVisible) return 0;
    var startIndex = this.showQuestionNumbers == "onSurvey" ? value : 0;
    for (var i = 0; i < this.panels.length; i++) {
      var counter = this.setPanelVisibleIndex(
        this.panels[i],
        startIndex,
        this.showQuestionNumbers != "off"
      );
      if (this.showQuestionNumbers == "onSurvey") {
        startIndex += counter;
      }
    }
    super.setVisibleIndex(this.showQuestionNumbers != "onSurvey" ? value : -1);
    return this.showQuestionNumbers != "onSurvey" ? 1 : startIndex - value;
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
    if (this.isDefaultV2Theme && !this.legacyNavigation && !this.isRenderModeList && this.currentIndex < this.panelCount - 1) {
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
    this.panels.splice(0, this.panels.length, ...panels);
    this.setValueAfterPanelsCreating();
    this.setPanelsState();
    this.reRunCondition();
    this.updateFooterActions();
    this.fireCallback(this.panelCountChangedCallback);
  }
  /**
   * If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty
   * @see defaultValue
   * @see defaultValueFromLastPanel
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
  public get defaultValueFromLastPanel(): boolean {
    return this.getPropertyValue("defaultValueFromLastPanel", false);
  }
  public set defaultValueFromLastPanel(val: boolean) {
    this.setPropertyValue("defaultValueFromLastPanel", val);
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
      this.panels,
      this.isRequired
    );
  }
  private isRowEmpty(val: any) {
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  /**
   * Add a new dynamic panel based on the template Panel. It checks if canAddPanel returns true and then calls addPanel method.
   * If a renderMode is different from "list" and the current panel has erros, then
   * @see template
   * @see panelCount
   * @see panels
   * @see canAddPanel
   */
  public addPanelUI(): PanelModel {
    if (!this.canAddPanel) return null;
    if (!this.canLeaveCurrentPanel()) return null;
    const newPanel = this.addPanel();
    if (this.renderMode === "list" && this.panelsState !== "default") {
      newPanel.expand();
    }
    return newPanel;
  }
  /**
   * Add a new dynamic panel based on the template Panel.
   * @see template
   * @see panelCount
   * @see panels
   * @see renderMode
   */
  public addPanel(): PanelModel {
    this.panelCount++;
    if (!this.isRenderModeList) {
      this.currentIndex = this.panelCount - 1;
    }
    var newValue = this.value;
    var hasModified = false;
    if (!this.isValueEmpty(this.defaultPanelValue)) {
      if (
        !!newValue &&
        Array.isArray(newValue) &&
        newValue.length == this.panelCount
      ) {
        hasModified = true;
        this.copyValue(newValue[newValue.length - 1], this.defaultPanelValue);
      }
    }
    if (
      this.defaultValueFromLastPanel &&
      !!newValue &&
      Array.isArray(newValue) &&
      newValue.length > 1 &&
      newValue.length == this.panelCount
    ) {
      hasModified = true;
      this.copyValue(
        newValue[newValue.length - 1],
        newValue[newValue.length - 2]
      );
    }
    if (hasModified) {
      this.value = newValue;
    }
    if (this.survey) this.survey.dynamicPanelAdded(this);
    return this.panels[this.panelCount - 1];
  }
  private canLeaveCurrentPanel(): boolean {
    return !(this.renderMode !== "list" && this.currentPanel && this.currentPanel.hasErrors());
  }
  private copyValue(src: any, dest: any) {
    for (var key in dest) {
      src[key] = dest[key];
    }
  }
  /**
   * Call removePanel function. Do nothing is canRemovePanel returns false. If confirmDelete set to true, it shows the confirmation dialog first.
   * @param value a panel or panel index
   * @see removePanel
   * @see confirmDelete
   * @see confirmDeleteText
   * @see canRemovePanel
   *
   */
  public removePanelUI(value: any) {
    if (!this.canRemovePanel) return;
    if (!this.confirmDelete || confirmAction(this.confirmDeleteText)) {
      this.removePanel(value);
    }
  }
  /**
   * Switches Dynamic Panel to the next panel. Returns `true` in case of success, or `false` if `renderMode` is `"list"` or the current panel contains validation errors.
   * @see renderMode
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
  /**
   * Removes a dynamic panel from the panels array.
   * @param value a panel or panel index
   * @see panels
   * @see template
   */
  public removePanel(value: any) {
    var index = this.getPanelIndex(value);
    if (index < 0 || index >= this.panelCount) return;
    var panel = this.panels[index];
    if (this.survey && !this.survey.dynamicPanelRemoving(this, index, panel)) return;
    this.panels.splice(index, 1);
    this.updateBindings("panelCount", this.panelCount);
    var value = this.value;
    if (!value || !Array.isArray(value) || index >= value.length) return;
    this.isValueChangingInternally = true;
    value.splice(index, 1);
    this.value = value;
    this.updateFooterActions();
    this.fireCallback(this.panelCountChangedCallback);
    if (this.survey) this.survey.dynamicPanelRemoved(this, index, panel);
    this.isValueChangingInternally = false;
  }
  private getPanelIndex(val: any): number {
    if (Helpers.isNumber(val)) return val;
    var items = this.items;
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i] === val || items[i] === val) return i;
    }
    return -1;
  }
  public locStrsChanged() {
    super.locStrsChanged();
    var panels = this.panels;
    for (var i = 0; i < panels.length; i++) {
      panels[i].locStrsChanged();
    }
  }
  public clearIncorrectValues() {
    for (var i = 0; i < this.panels.length; i++) {
      this.clearIncorrectValuesInPanel(i);
    }
  }
  public clearErrors() {
    super.clearErrors();
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].clearErrors();
    }
  }
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (index >= this.panelCount) return null;
    return this.panels[index].getQuestionByName(name);
  }
  private clearIncorrectValuesInPanel(index: number) {
    var panel = this.panels[index];
    panel.clearIncorrectValues();
    var val = this.value;
    var values = !!val && index < val.length ? val[index] : null;
    if (!values) return;
    var isChanged = false;
    for (var key in values) {
      if (this.getSharedQuestionFromArray(key, index)) continue;
      var q = panel.getQuestionByName(key);
      if (!!q) continue;
      if (
        this.iscorrectValueWithPostPrefix(panel, key, settings.commentPrefix) ||
        this.iscorrectValueWithPostPrefix(
          panel,
          key,
          settings.matrixTotalValuePostFix
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
  public getSharedQuestionFromArray(
    name: string,
    panelIndex: number
  ): Question {
    return !!this.survey && !!this.valueName
      ? <Question>(
        this.survey.getQuestionByValueNameFromArray(
          this.valueName,
          name,
          panelIndex
        )
      )
      : null;
  }
  public addConditionObjectsByContext(
    objects: Array<IConditionObject>,
    context: any
  ) {
    var hasContext = !!context
      ? context === true || this.template.questions.indexOf(context) > -1
      : false;
    var prefixName = this.getValueName() + "[0].";
    var prefixText = this.processedTitle + "[0].";
    var panelObjs = new Array<IConditionObject>();
    var questions = this.template.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].addConditionObjectsByContext(panelObjs, context);
    }
    for (var i = 0; i < panelObjs.length; i++) {
      objects.push({
        name: prefixName + panelObjs[i].name,
        text: prefixText + panelObjs[i].text,
        question: panelObjs[i].question,
      });
    }
    if (hasContext) {
      const prefixName = context === true ? this.getValueName() + "." : "";
      const prefixText = context === true ? this.processedTitle + "." : "";
      for (var i = 0; i < panelObjs.length; i++) {
        if (panelObjs[i].question == context) continue;
        const obj: IConditionObject = {
          name: prefixName + "panel." + panelObjs[i].name,
          text: prefixText + "panel." + panelObjs[i].text,
          question: panelObjs[i].question
        };
        if (context === true) {
          obj.context = this;
        }
        objects.push(obj);
      }
    }
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson(operator, path);
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
  protected onReadOnlyChanged() {
    var readOnly = this.isReadOnly;
    this.template.readOnly = readOnly;
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].readOnly = readOnly;
    }
    super.onReadOnlyChanged();
  }
  public onSurveyLoad() {
    this.template.readOnly = this.isReadOnly;
    this.template.onSurveyLoad();
    if (this.loadingPanelCount > 0) {
      this.panelCount = this.loadingPanelCount;
    }
    if (this.useTemplatePanel) {
      this.rebuildPanels();
    }
    this.setPanelsSurveyImpl();
    this.setPanelsState();
    this.assignOnPropertyChangedToTemplate();
    if (!!this.survey) {
      for (var i = 0; i < this.panelCount; i++) {
        this.survey.dynamicPanelAdded(this);
      }
    }
    this.recalculateIsReadyValue();
    super.onSurveyLoad();
  }
  public onFirstRendering() {
    this.template.onFirstRendering();
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].onFirstRendering();
    }
    super.onFirstRendering();
  }
  public localeChanged() {
    super.localeChanged();
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].localeChanged();
    }
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    this.runPanelsCondition(values, properties);
  }
  private reRunCondition() {
    if (!this.data) return;
    this.runCondition(
      this.getDataFilteredValues(),
      this.getDataFilteredProperties()
    );
  }
  protected runPanelsCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    var cachedValues: { [index: string]: any } = {};
    if (values && values instanceof Object) {
      cachedValues = JSON.parse(JSON.stringify(values));
    }
    if (!!this.parentQuestion && !!this.parent) {
      cachedValues[QuestionPanelDynamicItem.ParentItemVariableName] = (<any>this.parent).getValue();
    }
    for (var i = 0; i < this.panels.length; i++) {
      var panelValues = this.getPanelItemData(this.panels[i].data);
      //Should be unique for every panel due async expression support
      var newValues = Helpers.createCopy(cachedValues);
      newValues[
        QuestionPanelDynamicItem.ItemVariableName.toLowerCase()
      ] = panelValues;
      newValues[QuestionPanelDynamicItem.IndexVariableName.toLowerCase()] = i;
      this.panels[i].runCondition(newValues, properties);
    }
  }
  onAnyValueChanged(name: string) {
    super.onAnyValueChanged(name);
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].onAnyValueChanged(name);
      this.panels[i].onAnyValueChanged(
        QuestionPanelDynamicItem.ItemVariableName
      );
    }
  }
  private hasKeysDuplicated(fireCallback: boolean, rec: any = null) {
    var keyValues: Array<any> = [];
    var res;
    for (var i = 0; i < this.panels.length; i++) {
      res =
        this.isValueDuplicated(this.panels[i], keyValues, rec, fireCallback) ||
        res;
    }
    return res;
  }
  private updatePanelsContainsErrors() {
    var question = this.changingValueQuestion;
    var parent = <PanelModel>question.parent;
    while (!!parent) {
      parent.updateContainsErrors();
      parent = <PanelModel>parent.parent;
    }
    this.updateContainsErrors();
  }
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    if (this.isValueChangingInternally) return false;
    var res = false;
    if (!!this.changingValueQuestion) {
      var res = this.changingValueQuestion.hasErrors(fireCallback, rec);
      res = this.hasKeysDuplicated(fireCallback, rec) || res;
      this.updatePanelsContainsErrors();
      return res;
    } else {
      var errosInPanels = this.hasErrorInPanels(fireCallback, rec);
      return super.hasErrors(fireCallback) || errosInPanels;
    }
  }
  protected getContainsErrors(): boolean {
    var res = super.getContainsErrors();
    if (res) return res;
    var panels = this.panels;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].containsErrors) return true;
    }
    return false;
  }
  protected getIsAnswered(): boolean {
    if (!super.getIsAnswered()) return false;
    var panels = this.panels;
    for (var i = 0; i < panels.length; i++) {
      var visibleQuestions = <Array<any>>[];
      panels[i].addQuestionsToList(visibleQuestions, true);
      for (var j = 0; j < visibleQuestions.length; j++) {
        if (!visibleQuestions[j].isAnswered) return false;
      }
    }
    return true;
  }
  protected clearValueIfInvisibleCore(): void {
    for (var i = 0; i < this.panels.length; i++) {
      var questions = this.panels[i].questions;
      for (var j = 0; j < questions.length; j++) {
        questions[j].clearValueIfInvisible();
      }
    }
    super.clearValueIfInvisibleCore();
  }
  protected getIsRunningValidators(): boolean {
    if (super.getIsRunningValidators()) return true;
    for (var i = 0; i < this.panels.length; i++) {
      var questions = this.panels[i].questions;
      for (var j = 0; j < questions.length; j++) {
        if (questions[j].isRunningValidators) return true;
      }
    }
    return false;
  }
  public getAllErrors(): Array<SurveyError> {
    var result = super.getAllErrors();
    for (var i = 0; i < this.panels.length; i++) {
      var questions = this.panels[i].questions;
      for (var j = 0; j < questions.length; j++) {
        var errors = questions[j].getAllErrors();
        if (errors && errors.length > 0) {
          result = result.concat(errors);
        }
      }
    }
    return result;
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var values = this.getUnbindValue(value);
    if (!values || !Array.isArray(values)) return values;
    for (var i = 0; i < this.panels.length && i < values.length; i++) {
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
    var panel = this.panels[panelIndex];
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
  private hasErrorInPanels(fireCallback: boolean, rec: any): boolean {
    var res = false;
    var panels = this.panels;
    var keyValues: Array<any> = [];
    for (var i = 0; i < panels.length; i++) {
      this.setOnCompleteAsyncInPanel(panels[i]);
    }
    for (var i = 0; i < panels.length; i++) {
      var pnlError = panels[i].hasErrors(
        fireCallback,
        !!rec && rec.focuseOnFirstError,
        rec
      );
      pnlError = this.isValueDuplicated(panels[i], keyValues, rec, fireCallback) || pnlError;
      if (!this.isRenderModeList && pnlError && !res) {
        this.currentIndex = i;
      }
      res = pnlError || res;
    }
    return res;
  }
  private setOnCompleteAsyncInPanel(panel: PanelModel) {
    var questions = panel.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].onCompletedAsyncValidators = (hasErrors: boolean) => {
        this.raiseOnCompletedAsyncValidators();
      };
    }
  }
  private isValueDuplicated(
    panel: PanelModel,
    keyValues: Array<any>,
    rec: any,
    fireCallback: boolean
  ): boolean {
    if (!this.keyName) return false;
    var question = <Question>panel.getQuestionByValueName(this.keyName);
    if (!question || question.isEmpty()) return false;
    var value = question.value;
    if (
      !!this.changingValueQuestion &&
      question != this.changingValueQuestion
    ) {
      question.hasErrors(fireCallback, rec);
    }
    for (var i = 0; i < keyValues.length; i++) {
      if (value == keyValues[i]) {
        if (fireCallback) {
          question.addError(
            new KeyDuplicationError(this.keyDuplicationError, this)
          );
        }
        if (!!rec && !rec.firstErrorQuestion) {
          rec.firstErrorQuestion = question;
        }
        return true;
      }
    }
    keyValues.push(value);
    return false;
  }
  protected createNewPanel(): PanelModel {
    var panel = this.createAndSetupNewPanelObject();
    var json = this.template.toJSON();
    new JsonObject().toObject(json, panel);
    panel.renderWidth = "100%";
    panel.updateCustomWidgets();
    new QuestionPanelDynamicItem(this, panel);
    panel.onFirstRendering();
    var questions = panel.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].setParentQuestion(this);
    }
    panel.locStrsChanged();
    return panel;
  }
  protected createAndSetupNewPanelObject(): PanelModel {
    var panel = this.createNewPanelObject();
    panel.isInteractiveDesignElement = false;
    panel.setParentQuestion(this);
    var self = this;
    panel.onGetQuestionTitleLocation = function () {
      return self.getTemplateQuestionTitleLocation();
    };
    return panel;
  }
  private getTemplateQuestionTitleLocation() {
    return this.templateTitleLocation != "default"
      ? this.templateTitleLocation
      : this.getTitleLocationCore();
  }
  protected createNewPanelObject(): PanelModel {
    return Serializer.createClass("panel");
  }
  private setPanelCountBasedOnValue() {
    if (this.isValueChangingInternally || this.useTemplatePanel) return;
    var val = this.value;
    var newPanelCount = val && Array.isArray(val) ? val.length : 0;
    if (newPanelCount == 0 && this.loadingPanelCount > 0) {
      newPanelCount = this.loadingPanelCount;
    }
    this.panelCount = newPanelCount;
  }
  public setQuestionValue(newValue: any) {
    super.setQuestionValue(newValue, false);
    this.setPanelCountBasedOnValue();
    for (var i = 0; i < this.panels.length; i++) {
      this.panelUpdateValueFromSurvey(this.panels[i]);
    }
    this.updateIsAnswered();
  }
  public onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    for (var i = 0; i < this.panels.length; i++) {
      this.panelSurveyValueChanged(this.panels[i]);
    }
    if (newValue === undefined) {
      this.setValueBasedOnPanelCount();
    }
    this.recalculateIsReadyValue();
  }
  private panelUpdateValueFromSurvey(panel: PanelModel) {
    var questions = panel.questions;
    var values = this.getPanelItemData(panel.data);
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      q.updateValueFromSurvey(values[q.getValueName()]);
      q.updateCommentFromSurvey(
        values[q.getValueName() + settings.commentPrefix]
      );
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
  private onReadyChangedCallback = () => {
    this.recalculateIsReadyValue();
  };
  recalculateIsReadyValue(): void {
    let oldIsReady = this.isReadyValue;
    let isReady: boolean = true;
    this.panels.forEach(panel => {
      panel.questions.forEach(q => {
        if(!q.isReady) {
          isReady = false;
          q.onReadyChanged.add(this.onReadyChangedCallback);
        } else {
          q.onReadyChanged.remove(this.onReadyChangedCallback);
        }
      });
    });
    this.isReadyValue = isReady;
    if(oldIsReady != this.isReadyValue) {
      this.onReadyChanged.fire(this, {
        question: this,
        oldIsReady: oldIsReady,
        isReady: this.isReadyValue
      });
    }
  }
  protected onSetData() {
    super.onSetData();
    if (this.useTemplatePanel) {
      this.setTemplatePanelSurveyImpl();
      this.rebuildPanels();
    }
  }
  //IQuestionPanelDynamicData
  getItemIndex(item: ISurveyData): number {
    var res = this.items.indexOf(item);
    return res > -1 ? res : this.items.length;
  }
  getPanelItemData(item: ISurveyData): any {
    var items = this.items;
    var index = items.indexOf(item);
    var qValue = this.value;
    if (index < 0 && Array.isArray(qValue) && qValue.length > items.length) {
      index = items.length;
    }
    if (index < 0) return {};
    if (!qValue || !Array.isArray(qValue) || qValue.length <= index) return {};
    return qValue[index];
  }
  private isSetPanelItemData: Array<string>;
  setPanelItemData(item: ISurveyData, name: string, val: any) {
    if (this.isSetPanelItemData && this.isSetPanelItemData.indexOf(name) > -1)
      return;
    if (!this.isSetPanelItemData) this.isSetPanelItemData = [];
    this.isSetPanelItemData.push(name);
    var items = this.items;
    var index = items.indexOf(item);
    if (index < 0) index = items.length;
    var qValue = this.getUnbindValue(this.value);
    if (!qValue || !Array.isArray(qValue)) {
      qValue = [];
    }
    if (qValue.length <= index) {
      for (var i = qValue.length; i <= index; i++) {
        qValue.push({});
      }
    }
    if (!qValue[index]) qValue[index] = {};
    if (!this.isValueEmpty(val)) {
      qValue[index][name] = val;
    } else {
      delete qValue[index][name];
    }
    if (index >= 0 && index < this.panels.length) {
      this.changingValueQuestion = this.panels[index].getQuestionByValueName(
        name
      );
    }
    this.value = qValue;
    this.changingValueQuestion = null;
    if (this.survey) {
      var options = {
        question: this,
        panel: (<QuestionPanelDynamicItem>item).panel,
        name: name,
        itemIndex: index,
        itemValue: qValue[index],
        value: val,
      };
      this.survey.dynamicPanelItemValueChanged(this, options);
    }
    var index = this.isSetPanelItemData.indexOf(name);
    if (index > -1) {
      this.isSetPanelItemData.splice(index, 1);
    }
  }
  getRootData(): ISurveyData {
    return this.data;
  }
  public getPlainData(
    options: {
      includeEmpty?: boolean,
      calculations?: Array<{
        propertyName: string,
      }>,
    } = {
      includeEmpty: true,
    }
  ) {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      questionPlainData.isNode = true;
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
    }
    return questionPlainData;
  }
  public updateElementCss(reNew?: boolean) {
    super.updateElementCss(reNew);
    for (var i = 0; i < this.panels.length; i++) {
      var el = this.panels[i];
      el.updateElementCss(reNew);
    }
  }
  public get progressText(): string {
    var rangeMax = this.panelCount;
    return this.getLocalizationFormatString("panelDynamicProgressText", this.currentIndex + 1, rangeMax);
  }
  public get progress(): string {
    return ((this.currentIndex + 1) / this.panelCount) * 100 + "%";
  }
  public getRootCss(): string {
    return new CssClassBuilder().append(super.getRootCss()).append(this.cssClasses.empty, this.getShowNoEntriesPlaceholder()).toString();
  }
  public getPanelWrapperCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.panelWrapper)
      .append(this.cssClasses.panelWrapperInRow, this.panelRemoveButtonLocation === "right")
      .toString();
  }
  public getPanelRemoveButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.button)
      .append(this.cssClasses.buttonRemove)
      .append(this.cssClasses.buttonRemoveRight, this.panelRemoveButtonLocation === "right")
      .toString();
  }
  public getAddButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.button)
      .append(this.cssClasses.buttonAdd)
      .append(this.cssClasses.buttonAdd + "--list-mode", this.renderMode === "list")
      .toString();
  }
  public getPrevButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.buttonPrev)
      .append(this.cssClasses.buttonPrevDisabled, !this.isPrevButtonShowing)
      .toString();
  }
  public getNextButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.buttonNext)
      .append(this.cssClasses.buttonNextDisabled, !this.isNextButtonShowing)
      .toString();
  }
  /**
   * A text displayed when Dynamic Panel contains no entries. Applies only in the Default V2 theme.
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
    return !!this.cssClasses.noEntriesPlaceholder && !this.isDesignMode && this.panelCount === 0;
  }
  public needResponsiveWidth(): boolean {
    const panel = <PanelModel>this.getPanel();
    if (!!panel && panel.needResponsiveWidth()) return true;
    return false;
  }
  private footerToolbarValue: ActionContainer;
  public get footerToolbar(): ActionContainer {
    if (!this.footerToolbarValue) {
      this.initFooterToolbar();
    }
    return this.footerToolbarValue;
  }
  @property({ defaultValue: false, onSet: (_, target) => { target.updateFooterActions(); } })
  legacyNavigation: boolean
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
      title: this.panelPrevText,
      action: () => {
        this.goToPrevPanel();
      }
    });
    const nextTextBtn = new Action({
      id: "sv-pd-next-btn",
      title: this.panelNextText,
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
      nextTextBtn.visible = showNavigation && this.currentIndex < this.panelCount - 1;
      nextTextBtn.needSpace = isMobile && nextTextBtn.visible && prevTextBtn.visible;
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
  }
  private get showLegacyNavigation() {
    return !this.isDefaultV2Theme;
  }
}

Serializer.addClass(
  "paneldynamic",
  [
    {
      name: "templateElements",
      alternativeName: "questions",
      visible: false,
      isLightSerializable: false,
    },
    { name: "templateTitle:text", serializationProperty: "locTemplateTitle" },
    {
      name: "templateDescription:text",
      serializationProperty: "locTemplateDescription",
    },
    { name: "minWidth", default: "auto" },
    { name: "noEntriesText:text", serializationProperty: "locNoEntriesText" },
    { name: "allowAddPanel:boolean", default: true },
    { name: "allowRemovePanel:boolean", default: true },
    {
      name: "panelCount:number",
      isBindable: true,
      default: 0,
      choices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    { name: "minPanelCount:number", default: 0, minValue: 0 },
    {
      name: "maxPanelCount:number",
      default: settings.panelMaximumPanelCount,
    },
    "defaultPanelValue:panelvalue",
    "defaultValueFromLastPanel:boolean",
    {
      name: "panelsState",
      default: "default",
      choices: ["default", "collapsed", "expanded", "firstExpanded"],
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
    },
    { name: "panelAddText", serializationProperty: "locPanelAddText" },
    { name: "panelRemoveText", serializationProperty: "locPanelRemoveText" },
    { name: "panelPrevText", serializationProperty: "locPanelPrevText" },
    { name: "panelNextText", serializationProperty: "locPanelNextText" },
    {
      name: "showQuestionNumbers",
      default: "off",
      choices: ["off", "onPanel", "onSurvey"],
    },
    { name: "showRangeInProgress:boolean", default: true },
    {
      name: "renderMode",
      default: "list",
      choices: ["list", "progressTop", "progressBottom", "progressTopBottom"],
    },
    {
      name: "templateTitleLocation",
      default: "default",
      choices: ["default", "top", "bottom", "left"],
    },
    {
      name: "panelRemoveButtonLocation",
      default: "bottom",
      choices: ["bottom", "right"],
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
