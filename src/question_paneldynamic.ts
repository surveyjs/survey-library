import { HashTable } from "./helpers";
import {
  IElement,
  Base,
  IPanel,
  SurveyError,
  ISurveyData,
  ISurvey,
  ISurveyImpl,
  ITextProcessor
} from "./base";
import { surveyLocalization } from "./surveyStrings";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { TextPreProcessor, TextPreProcessorValue } from "./textPreProcessor";
import { ProcessValue } from "./conditionProcessValue";
import { Question } from "./question";
import { PanelModel } from "./panel";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { CustomError } from "./error";

export interface IQuestionPanelDynamicData {
  getItemIndex(item: QuestionPanelDynamicItem): number;
  getPanelItemData(item: QuestionPanelDynamicItem): any;
  setPanelItemData(item: QuestionPanelDynamicItem, name: string, val: any): any;
  getSurvey(): ISurvey;
}

export class QuestionPanelDynamicItem
  implements ISurveyData, ISurveyImpl, ITextProcessor {
  public static ItemVariableName = "panel";
  public static IndexVariableName = "panelIndex";
  private panelValue: PanelModel;
  private data: IQuestionPanelDynamicData;
  private textPreProcessor: TextPreProcessor;
  constructor(data: IQuestionPanelDynamicData, panel: PanelModel) {
    this.data = data;
    this.panelValue = panel;
    var self = this;
    this.textPreProcessor = new TextPreProcessor();
    this.textPreProcessor.onProcess = function(
      textValue: TextPreProcessorValue
    ) {
      self.getProcessedTextValue(textValue);
    };
    this.setSurveyImpl();
    this.panel.updateCustomWidgets();
  }
  public get panel(): PanelModel {
    return this.panelValue;
  }
  public setSurveyImpl() {
    this.panel.setSurveyImpl(this);
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    this.panel.runCondition(values, properties);
  }
  public getValue(name: string): any {
    var values = this.data.getPanelItemData(this);
    return values[name];
  }
  public setValue(name: string, newValue: any) {
    this.data.setPanelItemData(this, name, newValue);
  }
  public getComment(name: string): string {
    var result = this.getValue(name + Base.commentPrefix);
    return result ? result : "";
  }
  public setComment(name: string, newValue: string) {
    this.setValue(name + Base.commentPrefix, newValue);
  }
  public onSurveyValueChanged() {
    var questions = this.panel.questions;
    var values = this.data.getPanelItemData(this);
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      q.onSurveyValueChanged(values[q.getValueName()]);
    }
  }
  public setVisibleIndex(index: number, showIndex: boolean): number {
    if (!showIndex) {
      this.panel.setVisibleIndex(-1);
      return 0;
    }
    return this.panel.setVisibleIndex(index);
  }

  getAllValues(): any {
    return this.data.getPanelItemData(this);
  }
  getFilteredValues(): any {
    var allValues = this.getAllValues();
    var values: { [key: string]: any } = { panel: allValues };
    for (var key in allValues) {
      values[key] = allValues[key];
    }
    return values;
  }
  getFilteredProperties(): any {
    return { survey: this.getSurvey() };
  }
  geSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  getTextProcessor(): ITextProcessor {
    return this;
  }
  //ITextProcessor
  private getProcessedTextValue(textValue: TextPreProcessorValue) {
    if (!textValue) return;
    if (textValue.name == QuestionPanelDynamicItem.IndexVariableName) {
      textValue.isExists = true;
      textValue.value = this.data.getItemIndex(this) + 1;
      return;
    }
    var firstName = new ProcessValue().getFirstName(textValue.name);
    textValue.isExists = firstName == QuestionPanelDynamicItem.ItemVariableName;
    textValue.canProcess = textValue.isExists;
    if (!textValue.canProcess) return;
    //name should start with the panel
    textValue.name = textValue.name.replace(
      QuestionPanelDynamicItem.ItemVariableName + ".",
      ""
    );
    var firstName = new ProcessValue().getFirstName(textValue.name);
    var question = <Question>this.panel.getQuestionByValueName(firstName);
    var values = {};
    if (question) {
      (<any>values)[firstName] = textValue.returnDisplayValue
        ? question.displayValue
        : question.value;
    } else {
      var allValues = this.getAllValues();
      if (allValues) {
        (<any>values)[firstName] = allValues[firstName];
      }
    }
    textValue.value = new ProcessValue().getValue(textValue.name, values);
  }
  processText(text: string, returnDisplayValue: boolean): string {
    text = this.textPreProcessor.process(text, returnDisplayValue);
    var survey = this.getSurvey();
    return survey ? survey.processText(text, returnDisplayValue) : text;
  }
  processTextEx(text: string, returnDisplayValue: boolean): any {
    text = this.processText(text, returnDisplayValue);
    var hasAllValuesOnLastRun = this.textPreProcessor.hasAllValuesOnLastRun;
    var res = { hasAllValuesOnLastRun: true, text: text };
    if (this.getSurvey()) {
      res = this.getSurvey().processTextEx(text, returnDisplayValue);
    }
    res.hasAllValuesOnLastRun =
      res.hasAllValuesOnLastRun && hasAllValuesOnLastRun;
    return res;
  }
  onAnyValueChanged(name: string) {
    this.panel.onAnyValueChanged(name);
    this.panel.onAnyValueChanged(QuestionPanelDynamicItem.ItemVariableName);
  }
}

/**
 * A Model for a panel dymanic question. You setup the template panel, but adding elements (any question or a panel) and assign a text to it's title, and this panel will be used as a template on creating dynamic panels. The number of panels is defined by panelCount property.
 * An end-user may dynamically add/remove panels, unless you forbidden this.
 */
export class QuestionPanelDynamicModel extends Question
  implements IQuestionPanelDynamicData {
  public static MaxPanelCount = 100;
  private templateValue: PanelModel;
  private itemsValue: Array<QuestionPanelDynamicItem> = new Array<
    QuestionPanelDynamicItem
  >();
  private loadingPanelCount: number = 0;
  private isValueChangingInternally: boolean;
  private currentIndexValue: number = -1;

  renderModeChangedCallback: () => void;
  panelCountChangedCallback: () => void;
  currentIndexChangedCallback: () => void;

  constructor(public name: string) {
    super(name);
    this.templateValue = this.createAndSetupNewPanelObject();
    this.template.renderWidth = "100%";
    this.template.selectedElementInDesign = this;
    var self = this;
    this.template.addElementCallback = function(element) {
      self.addOnPropertyChangedCallback(element);
      self.rebuildPanels();
    };
    this.template.removeElementCallback = function(element) {
      self.rebuildPanels();
    };

    this.createLocalizableString("confirmDeleteText", this);
    this.createLocalizableString("keyDuplicationError", this);
    this.createLocalizableString("panelAddText", this);
    this.createLocalizableString("panelRemoveText", this);
    this.createLocalizableString("panelPrevText", this);
    this.createLocalizableString("panelNextText", this);
    this.registerFunctionOnPropertyValueChanged("panelsState", function() {
      self.setPanelsState();
    });
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    this.template.setSurveyImpl(this.surveyImpl);
  }
  private assignOnPropertyChangedToTemplate() {
    var elements = this.template.elements;
    for (var i = 0; i < elements.length; i++) {
      this.addOnPropertyChangedCallback(elements[i]);
    }
  }
  private addOnPropertyChangedCallback(element: IElement) {
    var self = this;
    (<Base>(<any>element)).onPropertyChanged.add(function(element, options) {
      self.onTemplateElementPropertyChanged(element, options);
    });
    if (element.isPanel) {
      (<PanelModel>(<any>element)).addElementCallback = function(element) {
        self.addOnPropertyChangedCallback(element);
      };
    }
  }
  private onTemplateElementPropertyChanged(element: any, options: any) {
    if (
      this.isLoadingFromJson ||
      this.isDesignMode ||
      !this.items ||
      this.items.length == 0
    )
      return;
    var property = JsonObject.metaData.findProperty(
      element.getType(),
      options.name
    );
    if (!property) return;
    var panels = this.panels;
    for (var i = 0; i < panels.length; i++) {
      var question = panels[i].getQuestionByName(element.name);
      if (!!question && (<any>question)[options.name] !== options.newValue) {
        (<any>question)[options.name] = options.newValue;
      }
    }
  }
  public getType(): string {
    return "paneldynamic";
  }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  public removeElement(element: IElement): boolean {
    return this.template.removeElement(element);
  }

  /**
   * The template Panel. This panel is used as a template on creatign dynamic panels
   * @see  templateElements
   * @see templateTitle
   * @see panelCount
   */
  public get template(): PanelModel {
    return this.templateValue;
  }
  public getPanel(): IPanel {
    return this.template;
  }
  /**
   * The template Panel elements, questions and panels.
   * @see  templateElements
   * @see template
   * @see panelCount
   */
  public get templateElements(): Array<IElement> {
    return this.template.elements;
  }
  /**
   * The template Panel title property.
   * @see  templateElements
   * @see template
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
   * The template Panel description property.
   * @see  templateElements
   * @see template
   * @see panelCount
   * @see templateTitle
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

  protected get items(): Array<QuestionPanelDynamicItem> {
    return this.itemsValue;
  }
  /**
   * The array of dynamic panels created based on panel template
   * @see template
   * @see panelCount
   */
  public get panels(): Array<PanelModel> {
    var res = [];
    for (var i = 0; i < this.items.length; i++) {
      res.push(this.items[i].panel);
    }
    return res;
  }
  /**
   * The index of current active dynamical panel when the renderMode is not "list". If there is no dymamic panel (panelCount = 0) or renderMode equals "list" it returns -1, otherwise it returns a value from 0 to panelCount - 1.
   * @see currentPanel
   * @see panels
   * @see panelCount
   * @see renderMode
   */
  public get currentIndex(): number {
    if (this.isRenderModeList) return -1;
    if (this.currentIndexValue < 0 && this.panelCount > 0) {
      this.currentIndexValue = 0;
    }
    if (this.currentIndexValue >= this.panelCount) {
      this.currentIndexValue = this.panelCount - 1;
    }
    return this.currentIndexValue;
  }
  public set currentIndex(val: number) {
    if (val >= this.panelCount) val = this.panelCount - 1;
    this.currentIndexValue = val;
    this.fireCallback(this.currentIndexChangedCallback);
  }
  /**
   * The current active dynamical panel when the renderMode is not "list". If there is no dymamic panel (panelCount = 0) or renderMode equals "list" it returns null.
   * @see currenIndex
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
   * Set it to true, to show a confirmation dialog on removing a panel
   * @see ConfirmDeleteText
   */
  public get confirmDelete(): boolean {
    return this.getPropertyValue("confirmDelete", false);
  }
  public set confirmDelete(val: boolean) {
    this.setPropertyValue("confirmDelete", val);
  }
  /**
   * Set it to a question name used in the template panel and the library shows duplication error, if there are same values in different panels of this question.
   * @see keyDuplicationError
   */
  public get keyName(): string {
    return this.getPropertyValue("keyName", "");
  }
  public set keyName(val: string) {
    this.setPropertyValue("keyName", val);
  }
  /**
   * Use this property to change the default text showing in the confirmation delete dialog on removing a panel.
   */
  public get confirmDeleteText() {
    return this.getLocalizableStringText(
      "confirmDeleteText",
      surveyLocalization.getString("confirmDelete")
    );
  }
  public set confirmDeleteText(val: string) {
    this.setLocalizableStringText("confirmDeleteText", val);
  }
  get locConfirmDeleteText(): LocalizableString {
    return this.getLocalizableString("confirmDeleteText");
  }
  /**
   * The duplication value error text. Set it to show the text different from the default.
   * @see keyName
   */
  public get keyDuplicationError() {
    return this.getLocalizableStringText(
      "keyDuplicationError",
      surveyLocalization.getString("keyDuplicationError")
    );
  }
  public set keyDuplicationError(val: string) {
    this.setLocalizableStringText("keyDuplicationError", val);
  }
  get locKeyDuplicationError(): LocalizableString {
    return this.getLocalizableString("keyDuplicationError");
  }
  /**
   * Use this property to change the default previous button text. Previous button shows the previous panel, change the currentPanel, when the renderMode doesn't equal to "list".
   * @see currentPanel
   * @see currentIndex
   * @see renderMode
   */
  public get panelPrevText(): string {
    return this.getLocalizableStringText(
      "panelPrevText",
      surveyLocalization.getString("pagePrevText")
    );
  }
  public set panelPrevText(val: string) {
    this.setLocalizableStringText("panelPrevText", val);
  }
  get locPanelPrevText(): LocalizableString {
    return this.getLocalizableString("panelPrevText");
  }
  /**
   * Use this property to change the default next button text. Next button shows the next panel, change the currentPanel, when the renderMode doesn't equal to "list".
   * @see currentPanel
   * @see currentIndex
   * @see renderMode
   */
  public get panelNextText(): string {
    return this.getLocalizableStringText(
      "panelNextText",
      surveyLocalization.getString("pageNextText")
    );
  }
  public set panelNextText(val: string) {
    this.setLocalizableStringText("panelNextText", val);
  }
  get locPanelNextText(): LocalizableString {
    return this.getLocalizableString("panelNextText");
  }
  /**
   * Use this property to change the default value of add panel button text.
   */
  public get panelAddText() {
    return this.getLocalizableStringText(
      "panelAddText",
      surveyLocalization.getString("addPanel")
    );
  }
  public set panelAddText(value: string) {
    this.setLocalizableStringText("panelAddText", value);
  }
  get locPanelAddText(): LocalizableString {
    return this.getLocalizableString("panelAddText");
  }
  /**
   * Use this property to change the default value of remove panel button text.
   */
  public get panelRemoveText() {
    return this.getLocalizableStringText(
      "panelRemoveText",
      surveyLocalization.getString("removePanel")
    );
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
    return (
      this.renderMode == "progressTop" || this.renderMode == "progressTopBottom"
    );
  }
  /**
   * Returns true when the renderMode equals to "progressBottom" or "progressTopBottom"
   */
  public get isProgressBottomShowing(): boolean {
    return (
      this.renderMode == "progressBottom" ||
      this.renderMode == "progressTopBottom"
    );
  }
  /**
   * Returns true when currentIndex is more than 0.
   * @see currenIndex
   * @see currenPanel
   */
  public get isPrevButtonShowing(): boolean {
    return this.currentIndex > 0;
  }
  /**
   * Returns true when currentIndex is more than or equal 0 and less then panelCount - 1.
   * @see currenIndex
   * @see currenPanel
   * @see panelCount
   */
  public get isNextButtonShowing(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.panelCount - 1;
  }
  /**
   * Returns true when showRangeInProgress equals to true, renderMode doesn't equal to "list" and panelCount is >= 2.
   */
  public get isRangeShowing(): boolean {
    return (
      this.showRangeInProgress &&
      (this.currentIndex >= 0 && this.panelCount > 1)
    );
  }
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    return includeHidden ? [this.template] : this.templateElements;
  }
  /**
   * Use this property to get/set the number of dynamic panels.
   * @see template
   * @see minPanelCount
   * @see maxPanelCount
   * @see addPanel
   * @see removePanel
   * @see removePanelUI
   */
  public get panelCount(): number {
    return this.isLoadingFromJson || this.isDesignMode
      ? this.loadingPanelCount
      : this.items.length;
  }
  public set panelCount(val: number) {
    if (val < 0) return;
    if (this.isLoadingFromJson || this.isDesignMode) {
      this.loadingPanelCount = val;
      return;
    }
    if (val == this.items.length || this.isDesignMode) return;
    for (let i = this.panelCount; i < val; i++) {
      var newItem = this.createNewItem();
      this.items.push(newItem);
      if (this.renderMode == "list" && this.panelsState != "default") {
        if (this.panelsState === "expand") {
          newItem.panel.expand();
        } else {
          newItem.panel.collapse();
        }
      }
    }
    if (val < this.panelCount) this.items.splice(val, this.panelCount - val);
    this.setValueBasedOnPanelCount();
    this.reRunCondition();
    this.fireCallback(this.panelCountChangedCallback);
  }
  /**
   * Use this property to allow the end-user to collapse/expand the panels. It works only if the renderMode property equals to "list" and templateTitle property is not empty. The following values are available:
   * <br/> default - the default value. User can't collpase/expand panels
   * <br/> expanded - User can collpase/expand panels and all panels are expanded by default
   * <br/> collapsed - User can collpase/expand panels and all panels are collapsed by default
   * <br/> firstExpanded - User can collpase/expand panels. The first panel is expanded and others are collapsed
   * @see renderMode
   * @see templateTitle
   */
  public get panelsState(): string {
    return this.getPropertyValue("panelsState", "default");
  }
  public set panelsState(val: string) {
    this.setPropertyValue("panelsState", val);
  }
  private setPanelsSurveyImpl() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].setSurveyImpl();
    }
  }
  private setPanelsState() {
    if (this.isDesignMode || this.renderMode != "list") return;
    for (var i = 0; i < this.items.length; i++) {
      var state = this.panelsState;
      if (state === "firstExpanded") {
        state = i === 0 ? "expanded" : "collapsed";
      }
      this.items[i].panel.state = state;
    }
  }
  private setValueBasedOnPanelCount() {
    var value = this.value;
    if (!value || !Array.isArray(value)) value = [];
    if (value.length == this.panelCount) return;
    for (var i = value.length; i < this.panelCount; i++) value.push({});
    if (value.length > this.panelCount)
      value.splice(this.panelCount, value.length - this.panelCount);
    this.value = value;
  }
  /**
   * The minimum panel count. A user could not delete a panel if the panelCount equals to minPanelCount
   * @see panelCount
   * @see maxPanelCount
   */
  public get minPanelCount(): number {
    return this.getPropertyValue("minPanelCount", 0);
  }
  public set minPanelCount(val: number) {
    if (val < 0) val = 0;
    if (val == this.minPanelCount) return;
    this.setPropertyValue("minPanelCount", val);
    if (val > this.maxPanelCount) this.maxPanelCount = val;
    if (this.panelCount < val) this.panelCount = val;
  }
  /**
   * The maximum panel count. A user could not add a panel if the panelCount equals to maxPanelCount
   * @see panelCount
   * @see minPanelCount
   */
  public get maxPanelCount(): number {
    return this.getPropertyValue(
      "maxPanelCount",
      QuestionPanelDynamicModel.MaxPanelCount
    );
  }
  public set maxPanelCount(val: number) {
    if (val <= 0) return;
    if (val > QuestionPanelDynamicModel.MaxPanelCount)
      val = QuestionPanelDynamicModel.MaxPanelCount;
    if (val == this.maxPanelCount) return;
    this.setPropertyValue("maxPanelCount", val);
    if (val < this.minPanelCount) this.minPanelCount = val;
    if (this.panelCount > val) this.panelCount = val;
  }
  /**
   * Set this property to false to hide the 'Add New' button
   * @see allowRemovePanel
   */
  public get allowAddPanel(): boolean {
    return this.getPropertyValue("allowAddPanel", true);
  }
  public set allowAddPanel(val: boolean) {
    this.setPropertyValue("allowAddPanel", val);
  }
  /**
   * Set this property to false to hide the 'Remove' button
   * @see allowAddPanel
   */
  public get allowRemovePanel(): boolean {
    return this.getPropertyValue("allowRemovePanel", true);
  }
  public set allowRemovePanel(val: boolean) {
    this.setPropertyValue("allowRemovePanel", val);
  }
  /**
   * Set this property different from "default" to set the specific question title location for the template questions.
   * @see SurveyModel.questionTitleLocation
   * @see PanelModelBase.questionTitleLocation
   */
  public get templateTitleLocation(): string {
    return this.getPropertyValue("templateTitleLocation", "default");
  }
  public set templateTitleLocation(value: string) {
    this.setPropertyValue("templateTitleLocation", value.toLowerCase());
  }
  /**
   * Use this property to show/hide the numbers in titles in questions inside a dynamic panel.
   * By default the value is "off". You may set it to "onPanel" and the first question inside a dynamic panel will start with 1 or "onSurvey" to include nested questions in dymamic panels into global survey question numbering.
   */
  public get showQuestionNumbers(): string {
    return this.getPropertyValue("showQuestionNumbers", "off");
  }
  public set showQuestionNumbers(val: string) {
    this.setPropertyValue("showQuestionNumbers", val);
    if (!this.isLoadingFromJson && this.survey) {
      this.survey.questionVisibilityChanged(this, this.visible);
    }
  }
  /**
   * Shows the range from 1 to panelCount when renderMode doesn't equal to "list". Set to false to hide this element.
   * @see panelCount
   * @see renderMode
   */
  public get showRangeInProgress(): boolean {
    return this.getPropertyValue("showRangeInProgress", true);
  }
  public set showRangeInProgress(val: boolean) {
    this.setPropertyValue("showRangeInProgress", val);
    this.fireCallback(this.currentIndexChangedCallback);
  }
  /**
   * By default the property equals to "list" and all dynamic panels are rendered one by one on the page. You may change it to: "progressTop", "progressBottom" or "progressTopBottom" to render only one dynamic panel at once. The progress and navigation elements can be rendred on top, bottom or both.
   */
  public get renderMode(): string {
    return this.getPropertyValue("renderMode", "list");
  }
  public set renderMode(val: string) {
    this.setPropertyValue("renderMode", val);
    this.fireCallback(this.renderModeChangedCallback);
  }
  /**
   * Returns true when renderMode equals to "list".
   * @see renderMode
   */
  public get isRenderModeList() {
    return this.renderMode == "list";
  }
  public setVisibleIndex(value: number): number {
    if (!this.isVisible) return 0;
    var startIndex = this.showQuestionNumbers == "onSurvey" ? value : 0;
    for (var i = 0; i < this.items.length; i++) {
      var counter = this.items[i].setVisibleIndex(
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
  /**
   * Returns true when an end user may add a new panel. The question is not read only and panelCount less than maxPanelCount
   * @see isReadOnly
   * @see panelCount
   * @see maxPanelCount
   */
  public get canAddPanel(): boolean {
    if (this.survey && this.survey.isDesignMode) return false;
    return (
      this.allowAddPanel &&
      !this.isReadOnly &&
      this.panelCount < this.maxPanelCount
    );
  }
  /**
   * Returns true when an end user may remove a panel. The question is not read only and panelCount is more than minPanelCount
   * @see isReadOnly
   * @see panelCount
   * @see minPanelCount
   */
  public get canRemovePanel(): boolean {
    if (this.survey && this.survey.isDesignMode) return false;
    return (
      this.allowRemovePanel &&
      !this.isReadOnly &&
      this.panelCount > this.minPanelCount
    );
  }
  protected rebuildPanels() {
    if (this.isLoadingFromJson) return;
    var items = new Array<QuestionPanelDynamicItem>();
    if (this.isDesignMode) {
      items.push(new QuestionPanelDynamicItem(this, this.template));
    } else {
      for (var i = 0; i < this.panelCount; i++) {
        items.push(this.createNewItem());
      }
    }
    this.setPanelsState();
    this.itemsValue = items;
    this.reRunCondition();
    this.fireCallback(this.panelCountChangedCallback);
  }
  /**
   * If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty
   * @see defaultValue
   * @see defaultValueFromLastRow
   */
  public get defaultPanelValue(): any {
    return this.getPropertyValue("defaultPanelValue");
  }
  public set defaultPanelValue(val: any) {
    this.setPropertyValue("defaultPanelValue", val);
  }
  /**
   * Set it to true to copy the value into new added panel from the last panel. If defaultPanelValue is set and this property equals to true,
   * then the value for new added panel is merging.
   * @see defaultValue
   * @see defaultPanelValue
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
  private isRowEmpty(val: any) {
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  /**
   * Add a new dynamic panel based on the template Panel. It checks if canAddPanel returns true and then calls addPanel method.
   * @see template
   * @see panelCount
   * @see panels
   * @see canAddPanel
   */
  public addPanelUI(): PanelModel {
    if (!this.canAddPanel) return null;
    var newPanel = this.addPanel();
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
    return this.items[this.panelCount - 1].panel;
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
    if (!this.confirmDelete || confirm(this.confirmDeleteText)) {
      this.removePanel(value);
    }
  }
  private static isPanelRemoving: boolean = false;
  /**
   * Removes a dynamic panel from the panels array.
   * @param value a panel or panel index
   * @see panels
   * @see template
   */
  public removePanel(value: any) {
    var index = this.getPanelIndex(value);
    if (index < 0 || index >= this.panelCount) return;
    this.items.splice(index, 1);
    var value = this.value;
    if (!value || !Array.isArray(value) || index >= value.length) return;
    value.splice(index, 1);
    QuestionPanelDynamicModel.isPanelRemoving = true;
    this.value = value;
    QuestionPanelDynamicModel.isPanelRemoving = false;
    this.fireCallback(this.panelCountChangedCallback);
    if (this.survey) this.survey.dynamicPanelRemoved(this, index);
  }
  private getPanelIndex(val: any): number {
    if (!isNaN(parseFloat(val)) && isFinite(val)) return val;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i] === val || this.items[i].panel === val) return i;
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
  private clearIncorrectValuesInPanel(index: number) {
    var panel = this.panels[index];
    panel.clearIncorrectValues();
    var val = this.value;
    var values = !!val && index < val.length ? val[index] : null;
    if (!values) return;
    var isChanged = false;
    for (var key in values) {
      if (!panel.getQuestionByName(key)) {
        delete values[key];
        isChanged = true;
      }
    }
    if (isChanged) {
      val[index] = values;
      this.value = val;
    }
  }
  public addConditionNames(names: Array<string>) {
    var prefix = this.name + "[0].";
    var panelNames: Array<any> = [];
    var questions = this.template.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].addConditionNames(panelNames);
    }
    for (var i = 0; i < panelNames.length; i++) {
      names.push(prefix + panelNames[i]);
    }
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson(operator, path);
    var questionName = path;
    var pos = path.indexOf(".");
    if (pos > -1) {
      questionName = path.substr(0, pos);
      path = path.substr(pos + 1);
    }
    var question = this.template.getQuestionByName(questionName);
    if (!question) return null;
    return question.getConditionJson(operator, path);
  }
  public onSurveyLoad() {
    this.template.onSurveyLoad();
    if (this.loadingPanelCount > 0) {
      this.panelCount = this.loadingPanelCount;
    }
    if (this.isDesignMode) {
      this.rebuildPanels();
    }
    this.setPanelsSurveyImpl();
    this.setPanelsState();
    this.assignOnPropertyChangedToTemplate();
    super.onSurveyLoad();
  }
  public onFirstRendering() {
    this.template.onFirstRendering();
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].panel.onFirstRendering();
    }
    super.onFirstRendering();
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
    var newValues: { [index: string]: any } = {};
    if (values && values instanceof Object) {
      newValues = JSON.parse(JSON.stringify(values));
    }
    for (var i = 0; i < this.items.length; i++) {
      newValues[
        QuestionPanelDynamicItem.ItemVariableName
      ] = this.getPanelItemData(this.items[i]);
      newValues[QuestionPanelDynamicItem.IndexVariableName] = i;
      this.items[i].runCondition(newValues, properties);
    }
  }
  onAnyValueChanged(name: string) {
    super.onAnyValueChanged(name);
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].onAnyValueChanged(name);
    }
  }
  public hasErrors(fireCallback: boolean = true): boolean {
    var errosInPanels = this.hasErrorInPanels(fireCallback);
    return super.hasErrors(fireCallback) || errosInPanels;
  }
  public clearValueIfInvisible() {
    for (var i = 0; i < this.panels.length; i++) {
      var questions = this.panels[i].questions;
      for (var j = 0; j < questions.length; j++) {
        questions[j].clearValueIfInvisible();
      }
    }
    super.clearValueIfInvisible();
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
  private hasErrorInPanels(fireCallback: boolean): boolean {
    var res = false;
    var panels = this.panels;
    var keyValues: Array<any> = [];
    for (var i = 0; i < panels.length; i++) {
      var pnlError = panels[i].hasErrors(fireCallback);
      pnlError = this.isValueDuplicated(panels[i], keyValues) || pnlError;
      if (!this.isRenderModeList && pnlError && !res) {
        this.currentIndex = i;
      }
      res = pnlError || res;
    }
    return res;
  }
  private isValueDuplicated(panel: PanelModel, keyValues: Array<any>): boolean {
    if (!this.keyName) return false;
    var question = <Question>panel.getQuestionByValueName(this.keyName);
    if (!question || question.isEmpty()) return false;
    var value = question.value;
    for (var i = 0; i < keyValues.length; i++) {
      if (value == keyValues[i]) {
        question.addError(new CustomError(this.keyDuplicationError, this));
        return true;
      }
    }
    keyValues.push(value);
    return false;
  }
  protected createNewItem(): QuestionPanelDynamicItem {
    return new QuestionPanelDynamicItem(this, this.createNewPanel());
  }
  protected createNewPanel(): PanelModel {
    var panel = this.createAndSetupNewPanelObject();
    var json = this.template.toJSON();
    new JsonObject().toObject(json, panel);
    panel.renderWidth = "100%";
    return panel;
  }
  protected createAndSetupNewPanelObject(): PanelModel {
    var panel = this.createNewPanelObject();
    var self = this;
    panel.onGetQuestionTitleLocation = function() {
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
    return new PanelModel();
  }
  protected onValueChanged() {
    if (this.isValueChangingInternally) return;
    var val = this.value;
    var newPanelCount = val && Array.isArray(val) ? val.length : 0;
    if (
      !QuestionPanelDynamicModel.isPanelRemoving &&
      newPanelCount <= this.panelCount
    )
      return;
    this.panelCount = newPanelCount;
  }
  public onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].onSurveyValueChanged();
    }
    if (newValue === undefined) {
      this.setValueBasedOnPanelCount();
    }
  }
  protected onSetData() {
    super.onSetData();
    if (this.isDesignMode) {
      this.template.setSurveyImpl(this.surveyImpl);
      this.rebuildPanels();
    }
  }
  //IQuestionPanelDynamicData
  getItemIndex(item: QuestionPanelDynamicItem): number {
    return this.items.indexOf(item);
  }
  getPanelItemData(item: QuestionPanelDynamicItem): any {
    var index = this.items.indexOf(item);
    var qValue = this.value;
    if (
      index < 0 &&
      Array.isArray(qValue) &&
      qValue.length > this.items.length
    ) {
      index = this.items.length;
    }
    if (index < 0) return {};
    if (!qValue || !Array.isArray(qValue) || qValue.length <= index) return {};
    return qValue[index];
  }
  setPanelItemData(item: QuestionPanelDynamicItem, name: string, val: any) {
    var index = this.items.indexOf(item);
    if (index < 0) index = this.items.length;
    var qValue = this.value;
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
    this.isValueChangingInternally = true;
    this.value = qValue;
    this.isValueChangingInternally = false;
    if (this.survey) {
      var options = {
        question: this,
        panel: item.panel,
        name: name,
        itemIndex: index,
        itemValue: qValue[index],
        value: val
      };
      this.survey.dynamicPanelItemValueChanged(this, options);
    }
  }
  getSurvey(): ISurvey {
    return this.survey;
  }
}

JsonObject.metaData.addClass(
  "paneldynamic",
  [
    { name: "templateElements", alternativeName: "questions", visible: false },
    { name: "templateTitle:text", serializationProperty: "locTemplateTitle" },
    {
      name: "templateDescription:text",
      serializationProperty: "locTemplateDescription"
    },
    { name: "allowAddPanel:boolean", default: true },
    { name: "allowRemovePanel:boolean", default: true },
    {
      name: "panelCount:number",
      default: 0,
      choices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    { name: "minPanelCount:number", default: 0 },
    {
      name: "maxPanelCount:number",
      default: QuestionPanelDynamicModel.MaxPanelCount
    },
    "defaultPanelValue:panelvalue",
    "defaultValueFromLastPanel:boolean",
    {
      name: "panelsState",
      default: "default",
      choices: ["default", "collapsed", "expanded", "firstExpanded"]
    },
    { name: "keyName" },
    {
      name: "keyDuplicationError",
      serializationProperty: "locKeyDuplicationError"
    },
    { name: "confirmDelete:boolean" },
    {
      name: "confirmDeleteText",
      serializationProperty: "locConfirmDeleteText"
    },
    { name: "panelAddText", serializationProperty: "locPanelAddText" },
    { name: "panelRemoveText", serializationProperty: "locPanelRemoveText" },
    { name: "panelPrevText", serializationProperty: "locPanelPrevText" },
    { name: "panelNextText", serializationProperty: "locPanelNextText" },
    {
      name: "showQuestionNumbers",
      default: "off",
      choices: ["off", "onPanel", "onSurvey"]
    },
    { name: "showRangeInProgress", default: true },
    {
      name: "renderMode",
      default: "list",
      choices: ["list", "progressTop", "progressBottom", "progressTopBottom"]
    },
    {
      name: "templateTitleLocation",
      default: "default",
      choices: ["default", "top", "bottom", "left"]
    }
  ],
  function() {
    return new QuestionPanelDynamicModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("paneldynamic", name => {
  return new QuestionPanelDynamicModel(name);
});
