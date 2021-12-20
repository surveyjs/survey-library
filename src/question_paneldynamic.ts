import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";

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

export interface IQuestionPanelDynamicData {
  getItemIndex(item: ISurveyData): number;
  getPanelItemData(item: ISurveyData): any;
  setPanelItemData(item: ISurveyData, name: string, val: any): any;
  getSharedQuestionFromArray(name: string, panelIndex: number): Question;
  getSurvey(): ISurvey;
  getRootData(): ISurveyData;
}

class QuestionPanelDynamicItemTextProcessor extends QuestionTextProcessor {
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
    return index > -1
      ? this.data.getSharedQuestionFromArray(name, index)
      : null;
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
    this.data.setPanelItemData(this, name, newValue);
  }
  getVariable(name: string): any {
    return undefined;
  }
  setVariable(name: string, newValue: any) {}
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
  constructor(public data: IQuestionPanelDynamicData) {}
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
 * A Model for a panel dymanic question. You setup the template panel, but adding elements (any question or a panel) and assign a text to it's title, and this panel will be used as a template on creating dynamic panels. The number of panels is defined by panelCount property.
 * An end-user may dynamically add/remove panels, unless you forbidden this.
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
    this.registerFunctionOnPropertyValueChanged("panelsState", () => {
      this.setPanelsState();
    });
  }
  public get hasSingleInput(): boolean {
    return false;
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
    if(element.isQuestion) {
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

  protected get items(): Array<ISurveyData> {
    var res = [];
    for (var i = 0; i < this.panels.length; i++) {
      res.push(this.panels[i].data);
    }
    return res;
  }
  /**
   * The array of dynamic panels created based on panel template
   * @see template
   * @see panelCount
   */
  public get panels(): Array<PanelModel> {
    return this.getPropertyValue("panels");
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
      this.fireCallback(this.currentIndexChangedCallback);
    }
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
    return this.getLocalizableStringText("confirmDeleteText");
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
    return this.getLocalizableStringText("keyDuplicationError");
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
    return this.getLocalizableStringText("panelPrevText");
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
    return this.getLocalizableStringText("panelNextText");
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
    return this.getLocalizableStringText("panelAddText");
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
   * Returns true when currentIndex is more than 0.
   * @see currenIndex
   * @see currenPanel
   */
  public get isPrevButtonShowing(): boolean {
    return this.currentIndex > 0;
  }
  /**
   * Returns true when currentIndex is more than or equal 0 and less than panelCount - 1.
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
   * Use this property to get/set the number of dynamic panels.
   * @see template
   * @see minPanelCount
   * @see maxPanelCount
   * @see addPanel
   * @see removePanel
   * @see removePanelUI
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
    this.fireCallback(this.panelCountChangedCallback);
  }
  /**
   * Use this property to allow the end-user to collapse/expand the panels. It works only if the renderMode property equals to "list" and templateTitle property is not empty. The following values are available:
   * <br/> default - the default value. User can't collapse/expand panels
   * <br/> expanded - User can collapse/expand panels and all panels are expanded by default
   * <br/> collapsed - User can collapse/expand panels and all panels are collapsed by default
   * <br/> firstExpanded - User can collapse/expand panels. The first panel is expanded and others are collapsed
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
   * The minimum panel count. A user could not delete a panel if the panelCount equals to minPanelCount
   * @see panelCount
   * @see maxPanelCount
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
   * The maximum panel count. A user could not add a panel if the panelCount equals to maxPanelCount
   * @see panelCount
   * @see minPanelCount
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
   * Set this property to false to hide the 'Add New' button
   * @see allowRemovePanel
   */
  public get allowAddPanel(): boolean {
    return this.getPropertyValue("allowAddPanel");
  }
  public set allowAddPanel(val: boolean) {
    this.setPropertyValue("allowAddPanel", val);
  }
  /**
   * Set this property to false to hide the 'Remove' button
   * @see allowAddPanel
   */
  public get allowRemovePanel(): boolean {
    return this.getPropertyValue("allowRemovePanel");
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
   * Use this property to change the location of the remove button relative to the panel.
   * By default the value is "bottom". You may set it to "right" and remove button will appear to the right of the panel.
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
    this.fireCallback(this.renderModeChangedCallback);
  }
  /**
   * Returns true when renderMode equals to "list".
   * @see renderMode
   */
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
   * Returns true when an end user may add a new panel. The question is not read only and panelCount less than maxPanelCount
   * @see isReadOnly
   * @see panelCount
   * @see maxPanelCount
   */
  public get canAddPanel(): boolean {
    if (this.isDesignMode) return false;
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
   * @see template
   * @see panelCount
   * @see panels
   * @see canAddPanel
   */
  public addPanelUI(): PanelModel {
    if (!this.canAddPanel) return null;
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
   * Goes to the next panel in the PanelDynamic
   *
   */
  public goToNextPanel() {
    if (this.renderMode !== "list" && this.currentPanel.hasErrors()) return;
    this.currentIndex++;
  }
  /**
   * Goes to the previous panel in the PanelDynamic
   *
   */
  public goToPrevPanel() {
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
    this.panels.splice(index, 1);
    this.updateBindings("panelCount", this.panelCount);
    var value = this.value;
    if (!value || !Array.isArray(value) || index >= value.length) return;
    this.isValueChangingInternally = true;
    value.splice(index, 1);
    this.value = value;
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
    return !!panel.getQuestionByName(key.substr(0, key.indexOf(postPrefix)));
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
      ? this.template.questions.indexOf(context) > -1
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
      for (var i = 0; i < panelObjs.length; i++) {
        if (panelObjs[i].question == context) continue;
        objects.push({
          name: "panel." + panelObjs[i].name,
          text: "panel." + panelObjs[i].text,
          question: panelObjs[i].question,
        });
      }
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
    super.onSurveyLoad();
  }
  public onFirstRendering() {
    this.template.onFirstRendering();
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].onFirstRendering();
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
  public clearValueIfInvisible() {
    for (var i = 0; i < this.panels.length; i++) {
      var questions = this.panels[i].questions;
      for (var j = 0; j < questions.length; j++) {
        questions[j].clearValueIfInvisible();
      }
    }
    super.clearValueIfInvisible();
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
      pnlError = this.isValueDuplicated(panels[i], keyValues, rec) || pnlError;
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
    fireCallback?: boolean
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
        question.addError(
          new KeyDuplicationError(this.keyDuplicationError, this)
        );
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
    return surveyLocalization
      .getString("panelDynamicProgressText")
      ["format"](this.currentIndex + 1, rangeMax);
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
      .append(this.cssClasses.buttonPrev + "--disabled", !this.isPrevButtonShowing)
      .toString();
  }
  public getNextButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.buttonNext)
      .append(this.cssClasses.buttonNext + "--disabled", !this.isNextButtonShowing)
      .toString();
  }
  /**
   * A text displayed when the dynamic panel contains no entries. Applies only in the Default V2 theme.
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
    { name: "noEntriesText:text", visible: false, serializationProperty: "locNoEntriesText" },
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
  function() {
    return new QuestionPanelDynamicModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => {
  return new QuestionPanelDynamicModel(name);
});
