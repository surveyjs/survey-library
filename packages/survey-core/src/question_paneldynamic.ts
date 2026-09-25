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
  IPlainDataOptions, IElementUIState,
  ISurveyDynamicPanelCallbacks
} from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { LocalizableString } from "./localizablestring";
import { Base, IExpressionValidationOptions, IExpressionValidationResult } from "./base";
import { Question, QuestionValueGetterContext, IConditionObject, IQuestionPlainData, ValidationContext, QuestionValueType } from "./question";
import { PanelModel } from "./panel";
import { JsonObject, Serializer } from "./jsonobject";
import { property, propertyArray } from "./decorators";
import { QuestionFactory } from "./questionfactory";
import { KeyDuplicationError } from "./error";
import { settings } from "./settings";
import { classesToSelector } from "./utils/dom-utils";
import { cleanHtmlElementAfterAnimation, prepareElementForVerticalAnimation, setPropertiesOnElementForAnimation } from "./utils/animation-dom";
import { confirmActionAsync } from "./utils/confirm-dialog";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ActionContainer } from "./actions/container";
import { defaultActionBarCss } from "./actions/actionBarCss";
import { Action, IAction } from "./actions/action";
import { ComputedUpdater } from "./base";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { ITheme } from "./themes";
import { AnimationGroup, AnimationProperty, AnimationTab, IAnimationConsumer, IAnimationGroupConsumer } from "./utils/animation";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "./questionSingleInputSummary";
import { getLocaleString } from "./surveyStrings";
import { IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo } from "./conditions/conditionProcessValue";
import { DynamicItemGetterContext, DynamicItemModelBase, DynamicRecordItem, IDynamicItemModelData } from "./dynamicItemModelBase";
import { ConditionRunner } from "./conditions/conditionRunner";
import { DynamicDataPageValidation, IDynamicDataPageState, IDynamicDataPageValidationOwner } from "./dynamic-data/dynamic-data-page-validation";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { createReadThroughDataList, DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataSort, IDynamicDataSource } from "./dynamic-data/dynamic-data-interfaces";
import { getDynamicDataFieldsForQuestions } from "./dynamic-data/dynamic-data-fields";
import { DynamicDataPagingController } from "./dynamic-data/dynamic-data-paging";
import { DynamicDataRemoteController, IDynamicDataRemoteOwner } from "./dynamic-data/dynamic-data-remote";
import { ArrayDynamicDataSource } from "./dynamic-data/dynamic-data-sources";

export class PanelDynamicItemGetterContext extends DynamicItemGetterContext {
  constructor(protected item: DynamicItemModelBase) {
    super(item);
  }
  protected getNextName(): string {
    return settings.expressionVariables.nextPanel;
  }
  protected getPrevName(): string {
    return settings.expressionVariables.prevPanel;
  }
  /* The neighbour comes from the view, not from the panels that exist: the first panel of a page has
     a previous record, it just has no panel. The owner answers with the panel's item or with the
     record read as a value. */
  protected getVisibleItem(index: number): DynamicItemModelBase {
    const data = this.item.data;
    return !!data && typeof data.getItemByVisibleIndex === "function" ? data.getItemByVisibleIndex(index) : null;
  }
  protected getSpecificValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length > 1 && path[0].name.toLocaleLowerCase() === settings.expressionVariables.parentPanel.toLocaleLowerCase()) {
      const q = <Question>(<any>this.item.data);
      if (!!q && !!q.parentQuestion && !!q.parent && !!(<any>q.parent).data) {
        path[0].name = this.variableName;
        params.isRoot = true;
        return (<QuestionPanelDynamicItem>(<any>q.parent).data).getValueGetterContext().getValue(params);
      }
    }
    return null;
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
  protected getItemVariableNames(): Array<string> {
    return [settings.expressionVariables.panelIndex, settings.expressionVariables.visiblePanelIndex];
  }
  protected getRelatedItemNames(): Array<string> {
    return [settings.expressionVariables.parentPanel];
  }
  protected getItemValue(name: string): any {
    name = name.toLocaleLowerCase();
    if (name === this.indexVar) {
      return this.panelIndex;
    }
    if (name == this.visIndexVar) {
      return this.visibleIndex;
    }
    return undefined;
  }
  /* The RECORD index, so that a stored {panelIndex} expression keeps meaning the same panel when a
     filter or a sort changes which panels exist - and in the whole list, so that "Participant 23" is
     record 23 on every page of a data source that pages itself. item.getIndex() is the window-local
     index the storage is addressed by; the offset turns it into the number the respondent sees. */
  private get panelIndex(): number {
    return this.item.getIndex() + DynamicItemModelBase.getRecordNumberOffset(this.item.data);
  }
  // The position among the visible records of the whole list, not among the panels of the page.
  protected get visibleIndex(): number {
    const data = this.item.data;
    return !!data && typeof data.getItemVisibleIndex === "function" ? data.getItemVisibleIndex(this.item) : -1;
  }
}

export class PanelDynamicValueGetterContext extends QuestionValueGetterContext {
  constructor (protected question: Question) {
    super(question);
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    const pd = <QuestionPanelDynamicModel>this.question;
    const index = params.index;
    if (index > -1 && pd.isDesignMode && path.length > 0) {
      const name = path[0].name;
      const q = pd.template.getQuestionByName(name);
      if (!!q) {
        path.shift();
        return path.length === 0 ? { isFound: true } : q.getValueGetterContext().getValue(params);
      }
      return { isFound: false };
    }
    if (index > -1) {
      // {panel[2].q1} names a record of the value, and so does the index a bound question passes:
      // the panel that holds it, or - when the question pages and the record has none - the record.
      const item = pd.getExpressionItem(index);
      if (!!item) {
        params.isRoot = false;
        return item.getValueGetterContext().getValue(params);
      }
      return { isFound: false, value: undefined, context: this };
    }
    if (!params.createObjects && this.question.isEmpty()) return { isFound: path.length === 0, value: undefined };
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

export class QuestionPanelDynamicItem extends DynamicItemModelBase {
  private panelValue: PanelModel;
  // isLight: the questions are attached without running their conditions; the owner runs them later.
  constructor(public data: IDynamicItemModelData, panel: PanelModel, isLight?: boolean) {
    super(data);
    this.data = data;
    this.panelValue = panel;
    this.setSurveyImpl(isLight);
  }
  public get panel(): PanelModel {
    return this.panelValue;
  }
  public setSurveyImpl(isLight?: boolean) {
    this.panel.setSurveyImpl(this, isLight);
  }
  public getValueGetterContext(): IValueGetterContext {
    return new PanelDynamicItemGetterContext(this);
  }
  public getVariableName(): string {
    return settings.expressionVariables.panel;
  }
  public getQuestionsByValueName(name: string, caseInsensitive?: boolean): Array<Question> {
    return this.panel.getQuestionsByValueName(name, caseInsensitive);
  }
  protected getQuestionByName(name: string): IQuestion {
    return this.panel.getQuestionByName(name);
  }
  // The window-local RECORD index: what the owner's storage is addressed by. The number the
  // respondent sees ({panelIndex}) adds the window offset of a source that pages itself.
  public getIndex(): number {
    return this.data.getItemRecordIndex(this);
  }
  /* The record the panel was built for, kept in step with the list's inserts and removes. When the
     page changes the list already names the records of the new page, so the panel that is about to
     be disposed can no longer be asked for its record through the mapping - and its record is where
     the state of the paged questions nested in it is kept. */
  public builtRecordIndex: number = -1;
  // The panel's position among the visible records of the whole list ({visiblePanelIndex} - 1).
  public get visibleIndex(): number {
    const data: any = this.data;
    return !!data && typeof data.getItemVisibleIndex === "function" ? data.getItemVisibleIndex(this) : -1;
  }
  // The panel's position in visiblePanels: the page it is on, when the question pages.
  public get pageVisibleIndex(): number {
    const data: any = this.data;
    return !!data && Array.isArray(data.visiblePanels) ? data.visiblePanels.indexOf(this.panel) : -1;
  }

  public get questions(): Array<Question> {
    return this.panel.questions;
  }
  public setValue(name: string, newValue: any): void {
    if (this.isSettingValue || !this.isValueChanged(name, newValue)) return;
    this.updateSharedQuestionsValue(name, newValue);
    this.data.updateItemValue(this, name, Helpers.getUnbindValue(newValue), false);
    this.runTriggersOnSetValue(name, newValue);
  }
  public getComment(name: string): string {
    var result = this.getValue(name + settings.commentSuffix);
    return result ? result : "";
  }
  public setComment(name: string, newValue: string, locNotification: boolean | "text") {
    this.setValue(name + settings.commentSuffix, newValue);
  }
}

export class QuestionPanelDynamicTemplateSurveyImpl implements ISurveyImpl {
  constructor(public data: IDynamicItemModelData) { }
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
export class QuestionPanelDynamicModel extends Question implements IDynamicItemModelData, IDynamicDataOwner, IDynamicDataRemoteOwner, IDynamicDataPageValidationOwner {
  private templateValue: PanelModel;
  private isValueChangingInternally: boolean;
  private changingValueQuestions: Array<Question>;
  public get dynamicPanelCallbacks(): ISurveyDynamicPanelCallbacks {
    return this.survey as ISurveyDynamicPanelCallbacks;
  }

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
    this.template.onPropertyChanged.add((sender: Base, options: any) => {
      if (options.name === "title") {
        this.propertyValueChanged("templateTitle", options.oldValue, options.newValue);
      }
      if (options.name === "description") {
        this.propertyValueChanged("templateDescription", options.oldValue, options.newValue);
      }
    });
    this.addExpressionProperty("panelCountExpression",
      (obj: Base, res: any) => { this.setPanelCountByExpression(res); });
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "panelsState") {
      this.setPanelsState();
    }
    const footerProps = ["newPanelPosition", "displayMode", "showProgressBar"];
    if (footerProps.indexOf(name) > -1) {
      this.updateFooterActions();
    }
    if (name === "allowAddPanel" || name === "panelCountExpression") {
      this.updateNoEntriesTextDefaultLoc();
      this.updateFooterActions();
    }
    if (name === "minPanelCount") {
      this.onMinPanelCountChanged();
    }
    if (name === "maxPanelCount") {
      this.onMaxPanelCountChanged();
    }
    const templateProps = ["templateQuestionTitleLocation", "templateQuestionTitleWidth"];
    if (templateProps.indexOf(name) > -1) {
      const panels = this.visiblePanelsCore;
      if (panels) panels.forEach((panel) => { panel.updateElementCss(true); });
    }
    if (name === "showQuestionNumbers" && this.survey) {
      this.lifecycleCallbacks.questionVisibilityChanged(this, this.visible, true);
    }
    if (name === "tabAlign" && this.isRenderModeTab) {
      this.tabbedMenu.containerCss = this.getTabbedMenuCss();
    }
  }
  public dispose(): void {
    this.cancelPendingPageMove();
    super.dispose();
    /* The list goes with the question: it drops its pending-request counter, so a page or a push that
       is still in flight cannot write into a question that is gone. */
    if (!!this.dataListValue) {
      this.dataListValue.dispose();
    }
    const left = this.panelsToDispose;
    this.panelsToDispose = [];
    left.forEach((panel: PanelModel): void => { this.disposePanelObject(panel); });
    this.templateValue.dispose();
  }
  public validateExpressions(options: IExpressionValidationOptions = { functions: true, variables: true, semantics: true }): IExpressionValidationResult[] {
    if (!this.useTemplatePanel) {
      new QuestionPanelDynamicItem(this, this.template);
    }
    const res = super.validateExpressions(options);
    if (!this.useTemplatePanel) {
      this.setTemplatePanelSurveyImpl();
    }
    return res;
  }
  private get isValidatingExpressions(): boolean {
    return !this.useTemplatePanel && this.template.data instanceof QuestionPanelDynamicItem;
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
  protected getFirstInputElementId(): string | (() => HTMLElement) {
    const question = this.getFirstQuestionToFocus(false);
    if (question && question !== this) return question.inputId;
    if (this.showAddPanelButton) return () => this.addPanelAction.getInputElement();
    return super.getFirstInputElementId();
  }
  protected getFirstErrorInputElementId(): string | (() => HTMLElement) {
    const question = this.getFirstQuestionToFocus(true);
    return question ? question.inputId : super.getFirstErrorInputElementId();
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value, isLight);
    this.setTemplatePanelSurveyImpl();
    this.setPanelsSurveyImpl();
    // isDesignMode is known only once the survey is attached, and the list may have been created
    // before that: paging is off in the Creator, whatever panelsPerPage says.
    if (!!this.dataListValue) {
      this.paging.updatePageSize();
    }
  }
  /* The data the survey and the expressions see: the records that have a panel. A record the list
     filter excluded has no panel and is not part of it - the same answer a source that filters on
     its own side gives. */
  getFilteredData(): any {
    if (!this.hasDataListView) return this.value;
    const list = this.dataList;
    // The view, not the page: a question that pages still answers for every record it shows.
    return list.getCreatedIndexes().map((index: number): any => list.getRecord(index));
  }
  /* Three indexes (prompt 15): the record index names the record, visibleIndex is its position among
     the visible records of the whole list (what the respondent navigates by), pageVisibleIndex its
     position in visiblePanels. visibleIndex = pageStartVisibleIndex + pageVisibleIndex; the two are
     the same number for a question that does not page. */
  private get pageStartVisibleIndex(): number {
    const list = this.dataListValue;
    if (!list) return 0;
    if (this.isRemoteData) return list.windowOffset;
    return this.isPagingActive ? list.pageIndex * list.pageSize : 0;
  }
  // IDynamicItemModelData: the window offset of a data source that pages itself, see getIndex.
  getRecordNumberOffset(): number {
    return this.isRemoteData && !!this.dataListValue ? this.dataListValue.windowOffset : 0;
  }
  getItemVisibleIndex(item: ISurveyData): number {
    if (item instanceof QuestionPanelDynamicItem) {
      const pos = this.visiblePanelsCore.indexOf(item.panel);
      return pos < 0 ? -1 : this.pageStartVisibleIndex + pos;
    }
    if (!(item instanceof DynamicRecordItem) || !this.dataListValue) return -1;
    const pos = this.dataListValue.getVisibleIndexes().indexOf(item.getIndex());
    return pos < 0 ? -1 : pos + (this.isRemoteData ? this.dataListValue.windowOffset : 0);
  }
  getItemByVisibleIndex(visibleIndex: number): DynamicItemModelBase {
    if (visibleIndex < 0) return null;
    const panels = this.visiblePanels;
    const pos = visibleIndex - this.pageStartVisibleIndex;
    if (pos >= 0 && pos < panels.length) return <DynamicItemModelBase>panels[pos].data;
    if (!this.isPagingActive) return null;
    // Off the page: the record is read as a value. A remote window holds nothing beyond itself.
    const list = this.dataList;
    const at = visibleIndex - (this.isRemoteData ? list.windowOffset : 0);
    const visible = list.getVisibleIndexes();
    if (at < 0 || at >= visible.length) return null;
    return this.createRecordItem(visible[at]);
  }
  private createRecordItem(recordIndex: number): DynamicRecordItem {
    return new DynamicRecordItem(this, recordIndex, this.dataList.getRecord(recordIndex), settings.expressionVariables.panel,
      (item: DynamicRecordItem): IValueGetterContext => new PanelDynamicItemGetterContext(item));
  }
  // internal: the item {panel[index].x} reads. index is a record index; a record the page does not
  // show is read as a value.
  public getExpressionItem(index: number): DynamicItemModelBase {
    const panels = this.panels;
    if (!this.hasDataListView) return index < panels.length ? <DynamicItemModelBase>panels[index].data : null;
    const item = this.getItemByRecordIndex(index);
    if (!!item) return item;
    return index < this.dataList.loadedCount ? this.createRecordItem(index) : null;
  }
  private dataListValue: DynamicDataList;
  // Every record-level read and write of this question goes through this list. Its source is a
  // getter/setter pair over question.value - never a captured array - so that the batched creation
  // overrides (getValueCore/setValueCore) are honoured and every write replaces the array instead of
  // mutating the one the question currently holds.
  private get dataList(): DynamicDataList {
    if (!this.dataListValue) {
      this.dataListValue = createReadThroughDataList(this,
        (): Array<any> => this.value,
        (arr: Array<any>): void => { this.value = arr; });
      this.dataListValue.onError = (error: any, operation: DynamicDataOperation): void => {
        this.onDataSourceError(error, operation);
      };
      // The list is created on demand, so a panelsPerPage that came from JSON has to be pushed here
      // and not only from its setter.
      this.paging.updatePageSize();
    }
    return this.dataListValue;
  }
  // internal, for tests and renderers
  public getDataList(): DynamicDataList {
    return this.dataList;
  }
  private remoteValue: DynamicDataRemoteController;
  private get remote(): DynamicDataRemoteController {
    if (!this.remoteValue) {
      this.remoteValue = new DynamicDataRemoteController(this);
    }
    return this.remoteValue;
  }
  /**
   * A data source that supplies the panel records. Assign an object that implements `IDynamicDataSource` to read the records from a server: the question then shows one loaded page at a time and pushes every edit, insertion and deletion to the source.
   *
   * This property is not serialized - a data source is code, not survey JSON. Set it to `undefined` to go back to the records stored in `question.value`.
   * @since 3.1.0
   */
  public get dataSource(): IDynamicDataSource {
    return this.remote.dataSource;
  }
  public set dataSource(val: IDynamicDataSource) {
    this.remote.dataSource = val;
    // The capabilities of the new source decide whether the panels are editable and whether the
    // add/remove buttons are shown.
    this.updatePanelsReadOnly();
    this.updateFooterActions();
  }
  // True while the data source is reading a page. The UI shows a loading state from it, and
  // question.isReady is false for exactly as long.
  @property({ defaultValue: false, onSet: (val: boolean, q: QuestionPanelDynamicModel): void => { q.updateIsReady(); } }) isDataLoading: boolean;
  // Read by SurveyModel.getRunningAsyncOperations(): a page that has not arrived or an edit the
  // source has not acknowledged is an asynchronous operation the survey has started.
  public get isDynamicDataRunning(): boolean {
    return !!this.remoteValue && this.remoteValue.isRunning;
  }
  // "the records are owned by a data source", the one condition every remote branch of this class
  // asks. It is deliberately not "the list pages itself": a source that returns everything in one
  // read is still a source, and its records are still not the question's to grow or truncate.
  private get isRemoteData(): boolean {
    return !!this.remoteValue && this.remoteValue.isRemote;
  }
  createValueDataSource(): IDynamicDataSource {
    return new ArrayDynamicDataSource((): Array<any> => this.value, (arr: Array<any>): void => { this.value = arr; });
  }
  clearValueInSurveyData(): void {
    if (!this.data || this.isValueEmpty(this.data.getValue(this.getValueName()))) return;
    this.data.setValue(this.getValueName(), undefined, false, true, this.name);
  }
  restoreValueFromSurveyData(): void {
    this.updateValueFromSurvey(!!this.data ? this.data.getValue(this.getValueName()) : undefined);
  }
  onDataLoadingChanged(isLoading: boolean): void {
    this.isDataLoading = isLoading;
  }
  onDataSourceError(error: any, operation: DynamicDataOperation): void {
    if (operation === "read" && !!this.remoteValue)this.remoteValue.forgetFocusIndex();
    if (!!this.survey) {
      this.survey.dynamicDataError(this, operation, error);
    }
  }
  protected getIsQuestionReady(): boolean {
    return !this.isDataLoading && super.getIsQuestionReady();
  }
  /* A remote-backed question is excluded from the survey data: a page load never writes into the
     survey hash - it is not an answer - so an edit that did would leave the hash holding one page of
     a table nobody submitted. The records go to the source instead.
     Known limitation: expressions elsewhere in the survey that name this question ({panel[0].q} or
     {panel.length}) do not update on a remote edit. The {panel.x} context inside the panels and the
     question's own validation are unaffected - they read question.value, which is the window. */
  protected canSetValueToSurvey(): boolean {
    return !this.isRemoteData;
  }
  /* The incoming direction of the same rule: while a source is attached, survey.data = ...,
     survey.setValue, mergeData and a setvalue trigger do not reach the question. The survey hash may
     then hold a value the question does not show; that is the caller's doing. */
  public updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    if (this.isRemoteData) return;
    super.updateValueFromSurvey(newValue, clearData);
  }
  /* The loaded window becomes the question value. It is the inbound path - the value is stored, the
     survey hash is not written and no trigger, condition or navigation runs - and then the panels
     are rebuilt for the records the window holds. Nothing else may assign the value on a load. */
  private setLoadedRecords(): void {
    this.storeLoadedRecords();
    this.rebuildPanelsFromDataList();
  }
  // The storage half alone: used after every write the list pushed to the source. The panel the
  // respondent is typing in already holds the new value, and a rebuild would dispose it under the
  // edit (the frozen-membership rule).
  private storeLoadedRecords(): void {
    this.storeQuestionValue(this.remote.getWindow());
  }
  private isReRunningRemoteConditions: boolean;
  /* With the array source over question.value a record write reaches the survey, and the survey then
     re-runs the conditions of every question - which is what recalculates an expression question and
     a {panel.x} reference. A remote write never reaches the survey (canSetValueToSurvey), so the
     question runs its own. Re-entrancy is guarded and not forbidden for a reason: an expression
     question writes its result back as a record field, and the nested run would only recompute what
     the outer one has just settled. */
  private reRunConditionsOnRemoteWrite(): void {
    if (this.isReRunningRemoteConditions || !this.data) return;
    this.isReRunningRemoteConditions = true;
    try {
      this.reRunCondition();
    } finally {
      this.isReRunningRemoteConditions = false;
    }
  }
  getFields(): Array<IDynamicDataField> {
    return getDynamicDataFieldsForQuestions(this.template.questions);
  }
  /* A reset means the view was re-decided: a filter or a sort was assigned, or refreshView() was
     called. Which records have a panel changes with it, so the panels are rebuilt.
     hasMaterializedView remembers that the panels were last built for a view: clearing the filter
     leaves hasView false and still has to rebuild. The flag is also what keeps the reset the list
     raises while it is being constructed - before dataListValue is assigned - out of here. */
  private hasMaterializedView: boolean = false;
  onDataListChanged(change: IDynamicDataListChange): void {
    if (!this.dataListValue) return;
    if (change.type === "loading") {
      this.onDataLoadingChanged(change.isLoading);
      return;
    }
    if (change.type === "pageChanged") {
      if (!!this.remoteValue)this.remoteValue.forgetFocusIndex();
      this.syncPagingState();
      /* The panels that exist are the page (prompt 15): a page of an in-memory list is rebuilt at
         once, through the path a remote read takes. A remote page is rebuilt when its read commits. */
      if (!this.isRemoteData && this.isPagingActive) {
        this.rebuildPanelsFromDataList(true);
      } else {
        this.updateRenderedPanels();
      }
      return;
    }
    this.followRecordChange(change);
    /* A write the list pushed to a data source: with the array source over question.value the push
       IS the value write, a remote source has no such setter, so the question follows the window
       itself. The panels are not rebuilt - the one that was edited, added or removed is handled by
       the path that made the change. */
    if (this.isRemoteData && change.type !== "reset") {
      this.storeLoadedRecords();
      this.reRunConditionsOnRemoteWrite();
      return;
    }
    if (change.type !== "reset") return;
    this.syncPagingState();
    const isRemote = this.isRemoteData;
    const hasView = this.dataListValue.hasView || isRemote || this.isPagingActive;
    if (!hasView && !this.hasMaterializedView) return;
    this.hasMaterializedView = hasView;
    if (isRemote) {
      // The window the read committed is the new value; setLoadedRecords rebuilds the panels.
      this.setLoadedRecords();
      this.focusAfterRead();
    } else {
      this.rebuildPanelsFromDataList();
    }
  }
  /* The record indexes the question keeps - the panels' records, the edited set of layer 2 - name a
     record only until something is inserted or removed in front of it. */
  private followRecordChange(change: IDynamicDataListChange): void {
    const validation = this.isPagedInMemory ? this.pageValidation : this.pageValidationValue;
    const shift = (func: (index: number) => number): void => {
      this.panelsCore.forEach((panel: PanelModel): void => {
        const item = <QuestionPanelDynamicItem>panel.data;
        if (item instanceof QuestionPanelDynamicItem && item.builtRecordIndex > -1) {
          item.builtRecordIndex = func(item.builtRecordIndex);
        }
      });
    };
    if (change.type === "recordChanged") {
      if (!!validation) validation.markEdited(change.index);
    } else if (change.type === "recordAdded") {
      shift((i: number): number => i >= change.index ? i + 1 : i);
      if (!!validation) validation.onRecordAdded(change.index);
    } else if (change.type === "recordRemoved") {
      shift((i: number): number => i === change.index ? -1 : (i > change.index ? i - 1 : i));
      if (!!validation) validation.onRecordRemoved(change.index);
    } else if (change.type === "recordMoved") {
      const from = change.from;
      const to = change.to;
      shift((i: number): number => i === from ? to : (from < i && i <= to ? i - 1 : (to <= i && i < from ? i + 1 : i)));
      if (!!validation) validation.onRecordMoved(from, to);
    }
  }
  /* A remote window is a view of its own: the panels are built for the records the list holds, not
     for 0 ... panelCount-1, because panelCount is the server total. A question that pages builds its
     panels for the page, so it takes the view path too: its records exist first and the panels
     follow them - which is how "the panels are created before the value that holds their records"
     stops being true under paging. */
  private get hasDataListView(): boolean {
    return !!this.dataListValue && (this.dataListValue.hasView || this.hasMaterializedView || this.isRemoteData || this.isPagingActive);
  }
  /* Takes a created position - the position in panelsCore - and returns the record it holds: the
     materialized set, which under paging is the current page. A position past the last created one
     is a panel that is being built: its record is the next one, which is what the positional code
     meant by items.length. */
  private getRecordIndexByPanelIndex(index: number): number {
    if (!this.hasDataListView) return index;
    const res = this.dataList.materializedIndexToIndex(index);
    return res >= 0 ? res : this.dataList.count;
  }
  /* Every value assignment of this question passes through setQuestionValue - a value set by the
     survey, a trigger, a default value or a panel. The list reads the records through the value, so
     it sees them at once, but the views it cached over them it cannot: they are dropped here. The
     list is not created just to be invalidated. */
  private invalidateDataListViews(): void {
    if (!!this.dataListValue) {
      this.dataListValue.invalidateViews();
      this.syncPagingState();
    }
  }
  private pagingValue: DynamicDataPagingController;
  private get paging(): DynamicDataPagingController {
    if (!this.pagingValue) {
      this.pagingValue = new DynamicDataPagingController(this);
    }
    return this.pagingValue;
  }
  // The list announces a page index it had to clamp, but not a page count that changed because a
  // panel became hidden or because the records were replaced: those points call this.
  private syncPagingState(): void {
    if (!this.dataListValue) return;
    if (this.isPagingSyncSuspended) {
      this.isPagingSyncPending = true;
      return;
    }
    this.paging.syncState();
    /* renderedPanels is a stored array and not a computed one: panels that appeared, disappeared or
       became hidden change which of them are on the page, and the panels are created before the
       value that holds their records is - the update they made then saw no records at all. */
    if (this.isPagingActive && !this.isUpdatingRenderedPanels) {
      this.updateRenderedPanels();
    }
  }
  /* The panels that exist are the page (prompt 15): with paging on, panels and visiblePanels hold
     the current page only, whatever the source, so the page is visiblePanels itself - the same
     instance - and never a slice of it. renderedPanels is what is shown: the page in list mode,
     [currentPanel] in carousel and tab mode. */
  public get panelsOnPage(): Array<PanelModel> {
    return this.visiblePanels;
  }
  private get isPagingActive(): boolean {
    if (this.isDesignMode) return false;
    return !!this.dataListValue && this.dataListValue.pageSize > 0;
  }
  // An in-memory list that pages: the only kind whose edited records layer 2 tracks.
  private get isPagedInMemory(): boolean {
    return this.isPagingActive && !this.isRemoteData;
  }
  /* The page size the list gets. A carousel shows one panel and pages one record at a time, always
     (Andrew's decision 2026-09-25): panelsPerPage keeps its value and its JSON and is ignored.
     Single-input mode walks every panel and shows its own summary of them - it is its own paging -
     so it builds every panel and the list does not page. */
  public get listPageSize(): number {
    if (this.isSingleInputActive) return 0;
    if (this.displayMode === "carousel") return 1;
    return this.panelsPerPage;
  }
  /* The number of panels on one page, 0 = no paging. In list mode the page is what is shown; in tab
     mode it is the tabs of one page, of which one panel is shown; a carousel ignores it and pages one
     panel at a time. */
  public get panelsPerPage(): number {
    return this.getPropertyValue("panelsPerPage");
  }
  public set panelsPerPage(val: number) {
    const num = Helpers.getNumber(val);
    // The clamp is in the setter and not in an onSettingValue hook: the hook is skipped while the
    // question is loading from JSON.
    this.setPropertyValue("panelsPerPage", num > 0 ? num : 0);
    this.paging.updatePageSize();
    this.updateRenderedPanels();
  }
  public get pageSize(): number { return this.panelsPerPage; }
  public set pageSize(val: number) { this.panelsPerPage = val; }
  // A zero-based page index; always 0 while paging is off.
  public get pageIndex(): number { return this.isPagingActive ? this.paging.pageIndex : 0; }
  public set pageIndex(val: number) { this.paging.pageIndex = val; }
  // The number of pages; 1 for an empty question and for one that does not page.
  public get pageCount(): number { return this.isPagingActive ? this.paging.pageCount : 1; }
  /* False while the data source answers a read without a total: panelCount is then the number of
     records known to exist - a lower bound - and pageCount the number of pages found so far. Every
     source that hands over the whole storage leaves it true. */
  public get isPanelCountKnown(): boolean { return this.paging.isCountKnown; }
  // IDynamicDataPagingOwner: the name the controller reads, as pageSize is for panelsPerPage.
  public get isCountKnown(): boolean { return this.isPanelCountKnown; }
  public get canGoNextPage(): boolean { return this.paging.canGoNextPage; }
  public get canGoPrevPage(): boolean { return this.paging.canGoPrevPage; }
  /* The respondent's page moves: a move forward validates the page it leaves. false = an error was
     found at once; true = moved, or waiting for asynchronous validators (see isPageMovePending). */
  public goToPage(index: number): boolean { return this.paging.goToPage(index); }
  public nextPage(): boolean { return this.paging.nextPage(); }
  public prevPage(): boolean { return this.paging.prevPage(); }
  /* The sort the panels are displayed in: { field, direction } descriptors applied in array order,
     an empty array = no sort. It never reorders the question value. */
  public get sortOrder(): Array<IDynamicDataSort> { return this.paging.sortOrder; }
  public set sortOrder(val: Array<IDynamicDataSort>) { this.paging.sortOrder = val; }
  /* The serialized form of sortOrder: "price-;name" = price descending, then name ascending (see
     dynamic-data-sort.ts for the grammar). One storage and two faces - this is the current sort,
     so a sort made at runtime changes what toJSON() emits. */
  public get sortBy(): string { return this.paging.sortBy; }
  public set sortBy(val: string) { this.paging.sortBy = val; }
  /* The header-click cycle for one field: ascending, then descending, then not sorted. With
     addToSort the field is cycled inside the current sort instead of replacing it. */
  public toggleSort(field: string, addToSort?: boolean): boolean { return this.paging.toggleSort(field, addToSort); }
  public clearSort(): void { this.paging.clearSort(); }
  /* A survey expression over the panel values - the same language as visibleIf, with the record
     fields as its variables. A record that does not satisfy it gets no panel; the question value
     keeps every record. An empty string = no filter. */
  public get filterExpression(): string { return this.paging.filterExpression; }
  public set filterExpression(val: string) { this.paging.filterExpression = val; }
  public raiseSortByChanged(oldValue: string, newValue: string): void {
    this.propertyValueChanged("sortBy", oldValue, newValue);
  }
  public refreshView(): void { this.paging.refreshView(); }
  // True while a page move waits for the asynchronous validators of the page it leaves.
  public get isPageMovePending(): boolean { return this.getPropertyValue("isPageMovePending", false); }
  private pageValidationValue: DynamicDataPageValidation;
  private get pageValidation(): DynamicDataPageValidation {
    if (!this.pageValidationValue) {
      this.pageValidationValue = new DynamicDataPageValidation(this);
    }
    return this.pageValidationValue;
  }
  // IDynamicDataPagingOwner
  leavePage(isForward: boolean, move: () => void): boolean {
    return this.pageValidation.leave(isForward, move);
  }
  cancelPendingPageMove(): void {
    if (!!this.pageValidationValue) {
      this.pageValidationValue.cancelPendingMove();
    }
  }
  // IDynamicDataPageValidationOwner
  isPageLeaveValidated(): boolean {
    if (this.isDesignMode) return false;
    return !this.survey || !this.validationCallbacks.canLeavePageWithErrors;
  }
  canTrackEditedRecords(): boolean {
    return this.isPagedInMemory;
  }
  // Panels that were never built were never shown: there is nothing the respondent could have left
  // invalid, and validating them would build them.
  validatePageObjects(context: ValidationContext): boolean {
    if (!this.hasPanelBuildFirstTime) return true;
    return this.validateInPanels(context);
  }
  goToPageFromCode(pageIndex: number): void {
    this.paging.pageIndex = pageIndex;
  }
  private pagerActionsValue: ActionContainer;
  public get pagerActions(): ActionContainer {
    if (!this.pagerActionsValue) {
      this.pagerActionsValue = this.paging.createPagerActions(this.createActionContainer());
    }
    return this.pagerActionsValue;
  }
  private getCreatedIndexesSnapshot(): Array<number> {
    const list = this.dataListValue;
    return !!list && list.hasView && !list.isWriting ? list.getCreatedIndexes() : undefined;
  }
  private rebuildPanelsIfViewChanged(created: Array<number>): void {
    if (!created || !this.dataListValue) return;
    if (Helpers.isTwoValueEquals(created, this.dataListValue.getCreatedIndexes())) return;
    this.rebuildPanelsFromDataList();
  }
  /* A full rebuild: the panels are re-created for the records the view - under paging, the page -
     now holds. It costs the per-panel state - collapsed/expanded state, panel errors, question
     state. It fires no onDynamicPanelAdded: no record was added (Andrew's decision 2026-09-25); a
     question created by it is announced through survey.onQuestionCreated. It is the same path a
     remote read, a sort, a filter and an in-memory page change take, so there is one.
     The panels it replaces are disposed: a page visit would otherwise leave every dropdown of the
     page registered with its choicesFromQuestion source. */
  private rebuildPanelsFromDataList(isPageMove: boolean = false): void {
    if (this.isLoadingFromJson || this.useTemplatePanel || !this.hasPanelBuildFirstTime) return;
    // A page size that changed resets the list, and the reset has rebuilt the panels already.
    if (this.syncListPageSize()) return;
    // Every panel that is created asks for a render and a paging sync: they are collapsed into one.
    const prevIsPagingSyncSuspended = this.isPagingSyncSuspended;
    this.isPagingSyncSuspended = true;
    try {
      this.rebuildPanelsFromDataListCore(isPageMove);
    } finally {
      this.isPagingSyncSuspended = prevIsPagingSyncSuspended;
    }
    if (!this.isPagingSyncSuspended) {
      this.runDeferredPagingSync();
    }
  }
  private rebuildPanelsFromDataListCore(isPageMove: boolean): void {
    const list = this.dataList;
    // The page is a slice of the visible records: their visibility is decided before it is cut.
    if (!!this.data) {
      this.updateRecordsVisibility(this.getDataFilteredProperties());
    }
    if (!this.isSettingPanelItemData()) {
      this.disposeLeftPanels(this._renderedPanels);
    }
    const currentRecord = isPageMove ? -1 : this.getCurrentPanelRecordIndex();
    /* Carousel and tab mode show one record: a rebuild that is not a page move - records replaced, a
       record hidden or shown ahead of it, a sort - keeps showing it, on whatever page it is now. */
    if (currentRecord > -1 && this.pendingCurrentVisibleIndex === undefined && !this.isRenderModeList && this.isPagedInMemory) {
      const visibleIndex = list.getVisibleIndexes().indexOf(currentRecord);
      const page = visibleIndex < 0 ? -1 : this.paging.getPageOfVisibleIndex(visibleIndex);
      if (page > -1 && page !== list.pageIndex) {
        this.pendingCurrentVisibleIndex = visibleIndex;
        // Its pageChanged notification rebuilds the page that holds the record.
        this.paging.pageIndex = page;
        return;
      }
    }
    const count = list.getMaterializedIndexes().length;
    const oldPanels = [].concat(this.panelsCore);
    this.keepNestedPageStates(oldPanels);
    this.prepareValueForPanelCreating();
    this.isRebuildingPanels = true;
    try {
      this.panelsCore.splice(0, this.panelsCore.length);
      for (let i = 0; i < count; i++) {
        this.panelsCore.push(this.createNewPanel());
      }
    } finally {
      this.isRebuildingPanels = false;
    }
    this.setValueAfterPanelsCreating();
    this.restoreNestedPageStates();
    this.setPanelsState();
    this.reRunCondition();
    this.updateFooterActions();
    this.updateNewPanelsVisibleIndex(0);
    this.restoreCurrentPanelByRecord(currentRecord);
    this.fireCallback(this.panelCountChangedCallback);
    this.updateTabbedMenuItems();
    this.disposePanels(oldPanels);
  }
  /* The page size is decided by the display mode and by single-input mode as well, and neither of
     them tells the list: every build re-reads it. */
  // internal: single-input mode reads every panel, and nothing tells the list that it became active.
  public syncPageSizeWithMode(): void {
    this.syncListPageSize();
  }
  private syncListPageSize(): boolean {
    if (!this.dataListValue || this.isLoadingFromJson) return false;
    const size = this.isDesignMode ? 0 : this.listPageSize;
    if (this.dataListValue.pageSize === (size > 0 ? size : 0)) return false;
    this.paging.updatePageSize();
    return true;
  }
  private isRebuildingPanels: boolean;
  /* A panel that is still on screen - the one a carousel animates out, a removed one leaving the
     list - is disposed when its animation ends, not under it. */
  private panelsToDispose: Array<PanelModel> = [];
  private disposePanels(panels: Array<PanelModel>): void {
    /* A rebuild can run from inside a write one of the old panels' questions is making - the record
       it edits leaves the page when its visibility changes - and that question still finishes its
       own setter after the rebuild returns. Its panel is disposed at the next rebuild instead. */
    const isWriting = this.isSettingPanelItemData();
    panels.forEach((panel: PanelModel): void => {
      if (panel.isDisposed || this.panelsCore.indexOf(panel) > -1) return;
      if (isWriting || this._renderedPanels.indexOf(panel) > -1) {
        if (this.panelsToDispose.indexOf(panel) < 0)this.panelsToDispose.push(panel);
      } else {
        this.disposePanelObject(panel);
      }
    });
  }
  private disposeLeftPanels(rendered: Array<PanelModel>): void {
    if (this.panelsToDispose.length === 0) return;
    const left = this.panelsToDispose.filter((panel: PanelModel): boolean => rendered.indexOf(panel) < 0);
    this.panelsToDispose = this.panelsToDispose.filter((panel: PanelModel): boolean => rendered.indexOf(panel) > -1);
    left.forEach((panel: PanelModel): void => { this.disposePanelObject(panel); });
  }
  /* The panel was never announced to the survey as added - it is built before it has one - so its
     questions are not announced as removed either: the guard an element moved between pages uses.
     Without it every page visit would fire onQuestionRemoved and recompute the survey's visible
     indexes once per question. */
  private disposePanelObject(panel: PanelModel): void {
    if (panel.isDisposed) return;
    const survey = this.survey;
    const markElements = (container: PanelModel): void => {
      container.elements.forEach((el: any): void => {
        el.prevSurvey = survey;
        if (el.isPanel) markElements(el);
      });
    };
    markElements(panel);
    delete this.removePanelActions[panel.uniqueId];
    panel.dispose();
  }
  /* The record of the current panel, remembered when the panel is chosen: by the time the view has
     been re-decided the old mapping is gone, so it cannot be looked up then. */
  private currentPanelRecordIndex: number = -1;
  /* A record index is window-relative, so it only names the same record while the window does not
     move: index 1 of page 3 is another record than index 1 of page 2. The offset the index was taken
     against is remembered with it, and a reset that committed another one starts from the first
     visible panel. There is no stable record identity (a key) in this step, so a remote re-sort is
     the same case as a page change. */
  private currentPanelWindowOffset: number = 0;
  private getCurrentPanelRecordIndex(): number {
    if (!this.getPropertyValue("currentPanel", null)) return -1;
    // The offset is compared here and not when the panel is restored: by then the panels have been
    // spliced away, and losing one takes the current panel - and with it the offset it was
    // remembered against - with it.
    if (this.isRemoteData && this.currentPanelWindowOffset !== this.dataList.windowOffset) return -1;
    return this.currentPanelRecordIndex;
  }
  /* The current panel follows its record; when that record left the view the first visible panel
     takes over. A move that crossed a page (Next on the last panel of a page, a currentIndex on
     another page, a Next that read the next window of a data source) names the visibleIndex it went
     to instead; it is taken once, on the rebuild of the page that holds it. */
  private restoreCurrentPanelByRecord(recordIndex: number): void {
    const pending = this.pendingCurrentVisibleIndex;
    this.pendingCurrentVisibleIndex = undefined;
    if (this.isRenderModeList || this.useTemplatePanel) return;
    const visPanels = this.visiblePanelsCore;
    let panel: PanelModel = undefined;
    if (pending !== undefined) {
      const pos = Math.max(0, Math.min(pending - this.pageStartVisibleIndex, visPanels.length - 1));
      panel = visPanels[pos];
    } else {
      const position = recordIndex < 0 ? -1 : this.dataList.indexToMaterializedIndex(recordIndex);
      panel = position > -1 ? this.panelsCore[position] : undefined;
    }
    this.setPropertyValue("currentPanel", null);
    this.currentPanel = !!panel && panel.visible ? panel : visPanels[0];
  }
  private pendingCurrentVisibleIndex: number;
  /* The state a paged question keeps for its records outlives its panels (see
     IDynamicDataPageState): before the panels are disposed, the state of every paged question nested
     in them is kept under the record the panel was built for, and it is handed back to the question
     the new panel of that record holds. */
  private keepNestedPageStates(panels: Array<PanelModel>): void {
    if (!this.pageValidationValue && !this.hasNestedPagedQuestions(panels)) return;
    panels.forEach((panel: PanelModel): void => {
      const item = <QuestionPanelDynamicItem>panel.data;
      if (!(item instanceof QuestionPanelDynamicItem) || item.builtRecordIndex < 0) return;
      const states: { [valueName: string]: IDynamicDataPageState } = {};
      panel.questions.forEach((q: Question): void => {
        const state = QuestionPanelDynamicModel.getNestedPageState(q);
        if (!!state) states[q.getValueName()] = state;
      });
      this.pageValidation.keepNestedStates(item.builtRecordIndex, states);
    });
  }
  private hasNestedPagedQuestions(panels: Array<PanelModel>): boolean {
    return panels.some((panel: PanelModel): boolean =>
      panel.questions.some((q: Question): boolean => !!QuestionPanelDynamicModel.getNestedPageState(q)));
  }
  private restoreNestedPageStates(): void {
    const panels = this.panelsCore;
    for (let i = 0; i < panels.length; i++) {
      const item = <QuestionPanelDynamicItem>panels[i].data;
      if (!(item instanceof QuestionPanelDynamicItem)) continue;
      item.builtRecordIndex = this.getRecordIndexByPanelIndex(i);
      if (!this.pageValidationValue) continue;
      const states = this.pageValidationValue.getNestedStates(item.builtRecordIndex);
      if (!states) continue;
      panels[i].questions.forEach((q: Question): void => {
        const state = states[q.getValueName()];
        if (!!state && typeof (<any>q).setPageState === "function") {
          (<any>q).setPageState(state);
        }
      });
    }
  }
  // internal: the state of a question that pages its own records, undefined for any other question.
  public static getNestedPageState(q: Question): IDynamicDataPageState {
    return typeof (<any>q).getPageState === "function" ? (<any>q).getPageState() : undefined;
  }
  // internal: what this question keeps for its records when an ancestor rebuilds the object holding
  // it - undefined when it does not page, since a question that does not page validates every panel.
  public getPageState(): IDynamicDataPageState {
    if (!this.isPagedInMemory) return undefined;
    return this.pageValidation.getState(this.pageIndex);
  }
  public setPageState(state: IDynamicDataPageState): void {
    if (!state) return;
    this.pageValidation.setState(state);
    // The page is kept as well (the prompt allows either): the respondent comes back to where they were.
    if (state.pageIndex > 0) {
      this.paging.pageIndex = state.pageIndex;
    }
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
  public getValueType(): QuestionValueType {
    return "array";
  }
  protected get hasMinWidth(): boolean { return false; }
  protected getAllChildren(): Base[] {
    return [
      ...super.getAllChildren(),
      ...(<any>this.templateElements)
    ];
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
  protected isPropertyStoredInHash(name: string): boolean {
    // sortBy renders sortOrder and stores nothing of its own, so the serializer has to read the
    // accessor instead of looking for a hash entry that will never be there.
    return name !== "templateElements" && name !== "sortBy" && super.isPropertyStoredInHash(name);
  }
  protected mergeLocalizationWithInnerObjects(src: Base, locales?: Array<string>): void {
    const srcTemplate = (<QuestionPanelDynamicModel><unknown>src).template;
    if (srcTemplate) {
      (<any>this.template).mergeLocalizationObj(srcTemplate, locales);
    }
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
  public getLocalizableString(name: string): LocalizableString {
    if (name === "templateTitle") return this.template.locTitle;
    if (name === "templateDescription") return this.template.locDescription;
    return super.getLocalizableString(name);
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
  @property({ localizable: { defaultStr: "panelDynamicTabTextFormat", markdown: true } }) templateTabTitle: string;
  /**
   * A placeholder for tab titles that applies when the [`templateTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateTabTitle) expression doesn't produce a meaningful value.
   *
   * Default value: `"New Panel"` (taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization))
   */
  @property({ localizable: { defaultStr: true, markdown: true } }) tabTitlePlaceholder: string;
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
    this.updateTabbedMenuItems();
    if (!this.currentPanel) {
      this.currentPanel = panel;
    }
    this.requestRenderedPanelsUpdate();
  }
  private onPanelRemoved(panel: PanelModel): void {
    let index = this.onPanelRemovedCore(panel);
    if (this.currentPanel === panel) {
      const visPanels = this.visiblePanelsCore;
      if (index >= visPanels.length) index = visPanels.length - 1;
      this.currentPanel = index >= 0 ? visPanels[index] : null;
    }
    this.requestRenderedPanelsUpdate();
  }
  private onPanelRemovedCore(panel: PanelModel): number {
    const visPanels = this.visiblePanelsCore;
    let index = visPanels.indexOf(panel);
    if (index > -1) {
      visPanels.splice(index, 1);
      this.updateTabbedMenuItems();
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
  /* The position of the current panel among the visible records of the whole list - its visibleIndex
     (Andrew's decision 2026-09-25): paging and the source do not change what it means. */
  public get currentIndex(): number {
    if (this.isRenderModeList) return -1;
    if (this.useTemplatePanel) return 0;
    const pos = this.visiblePanelsCore.indexOf(this.currentPanel);
    return pos < 0 ? -1 : this.pageStartVisibleIndex + pos;
  }
  /* A move from code: clamped by the visible record count, it moves to the page that holds the
     position and then selects the panel on it. It does not validate, and a move that waits for its
     validators is dropped. */
  public set currentIndex(val: number) {
    if (val < 0 || this.visiblePanelCount < 1) return;
    if (this.isRenderModeList || this.useTemplatePanel) return;
    if (val >= this.visiblePanelCount) val = this.visiblePanelCount - 1;
    this.cancelPendingPageMove();
    this.moveToVisibleIndex(val);
  }
  /* Selects the panel at a visibleIndex: on the page when it is there, otherwise through a page move
     whose rebuild selects it (restoreCurrentPanelByRecord). A data source that pages itself selects
     it when the read of that page commits. */
  private moveToVisibleIndex(visibleIndex: number): void {
    const list = this.dataListValue;
    const pageSize = !!list && this.isPagingActive ? list.pageSize : 0;
    const pos = visibleIndex - this.pageStartVisibleIndex;
    const visPanels = this.visiblePanelsCore;
    if (pageSize <= 0 || pos >= 0 && pos < visPanels.length) {
      this.currentPanel = visPanels[Math.max(0, Math.min(pos, visPanels.length - 1))];
      return;
    }
    this.pendingCurrentVisibleIndex = visibleIndex;
    this.paging.pageIndex = Math.floor(visibleIndex / pageSize);
    // The page did not move - clamped to the page in force - so no rebuild takes the position.
    if (this.pendingCurrentVisibleIndex !== undefined && !this.isRemoteData) {
      this.restoreCurrentPanelByRecord(-1);
    }
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
    // The bound of visiblePanels, not the visible record count: the panels that exist are the page.
    if (!res && this.visiblePanels.length > 0) {
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
    /* The id is what the tab actions compute "active" from: two panels with the same values are equal
       for setPropertyValue, so a change of currentPanel between them raises nothing. */
    this.setPropertyValue("currentPanelId", !!val ? val.id : "");
    this.currentPanelRecordIndex = !val ? -1 : this.getRecordIndexByPanelIndex(this.panelsCore.indexOf(val));
    this.currentPanelWindowOffset = !!this.dataListValue ? this.dataListValue.windowOffset : 0;
    if (!!val) {
      this.leftVisibleIndex = this.currentVisibleIndexValue;
      this.currentVisibleIndexValue = this.pageStartVisibleIndex + index;
    }
    this.updateRenderedPanels();
    this.updateFooterActions();
    this.fireCallback(this.currentIndexChangedCallback);
    if (index > -1 && this.survey) {
      const options = {
        panel: val,
        visiblePanelIndex: this.pageStartVisibleIndex + index
      };
      this.dynamicPanelCallbacks.dynamicPanelCurrentIndexChanged(this, options);
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

  private isUpdatingRenderedPanels: boolean;
  private updateRenderedPanels() {
    /* The panels of a question in a survey are built on its first rendering. Before that there is
       nothing to render, and reading the page - visiblePanels - would build them: a page size set
       or loaded, or a paging sync after a value write, must not do it. The first build renders
       the page itself - every panel it creates asks for a render. */
    if (this.wasNotRenderedInSurvey) return;
    let panels: Array<PanelModel> = [];
    this.isUpdatingRenderedPanels = true;
    if (this.isRenderModeList) {
      panels = [].concat(this.panelsOnPage);
    } else if (this.currentPanel) {
      panels = [this.currentPanel];
    }
    panels.forEach(panel => this.panelOnFirstRendering(panel));
    this.renderedPanels = panels;
    this.isUpdatingRenderedPanels = false;
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
  /* The visibleIndex of the current panel, and of the one it replaced. A carousel Next rebuilds the
     page, so the panel that leaves is not in visiblePanels any more and its position there cannot
     say which way it goes: the two records' positions in the whole list do. */
  private currentVisibleIndexValue: number = -1;
  private leftVisibleIndex: number = -1;
  private getPanelsAnimationOptions(): IAnimationConsumer<[PanelModel]> {
    const getDirectionCssClass = () => {
      if (this.isRenderModeList) return "";
      let cssClass = new CssClassBuilder();
      const leavingPanel = this.renderedPanels.filter(el => el !== this.currentPanel)[0];
      // A panel that is still on the page answers for itself; one a page move took away is the one
      // the current panel replaced; one that was removed is neither.
      const leavingPos = this.visiblePanels.indexOf(leavingPanel);
      const isRemoving = leavingPos < 0 && (!leavingPanel || leavingPanel === this.removedPanel || this.leftVisibleIndex < 0);
      let leavingPanelIndex = leavingPos > -1 ? this.pageStartVisibleIndex + leavingPos : this.leftVisibleIndex;
      if (isRemoving) {
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
        // The panels that animated out are off the screen now.
        this.disposeLeftPanels(val);
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
  @property() confirmDelete: boolean;
  /**
   * Specifies a key question. Set this property to the name of a question used in the template, and Dynamic Panel will display `keyDuplicationError` if a user tries to enter a duplicate value in this question.
   * @see keyDuplicationError
   */
  @property({ defaultValue: "" }) keyName: string;
  /**
   * A message displayed in a confirmation dialog that appears when a respondent wants to delete a panel.
   * @see confirmDelete
   */
  @property({ localizable: { defaultStr: "confirmDelete" } }) confirmDeleteText: string;
  /**
   * An error message displayed when users enter a duplicate value into a question that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified).
   *
   * A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).
   * @see keyName
   */
  @property({ localizable: { defaultStr: true } }) keyDuplicationError: string;
  /**
   * A caption for the Previous button. Applies only if `displayMode` is different from `"list"`.
   * @see displayMode
   * @see isPrevButtonVisible
   * @since 2.0.0
   */
  @property({ localizable: { defaultStr: "pagePrevText" } }) prevPanelText: string;
  /**
   * @deprecated Use the [`prevPanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#prevPanelText) property instead.
   * @hidden
   */
  public get panelPrevText(): string { return this.prevPanelText; }
  public set panelPrevText(val: string) { this.prevPanelText = val; }
  /**
   * A caption for the Next button. Applies only if `displayMode` is different from `"list"`.
   * @see displayMode
   * @see isNextButtonVisible
   * @since 2.0.0
   */
  @property({ localizable: { defaultStr: "pageNextText" } }) nextPanelText: string;
  /**
   * @deprecated Use the [`nextPanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#nextPanelText) property instead.
   * @hidden
   */
  public get panelNextText(): string { return this.nextPanelText; }
  public set panelNextText(val: string) { this.nextPanelText = val; }
  /**
   * A caption for the Add Panel button.
   */
  @property({ localizable: { defaultStr: "addPanel" } }) addPanelText: string;
  /**
   * @deprecated Use the [`addPanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#addPanelText) property instead.
   * @hidden
   */
  public get panelAddText(): string { return this.addPanelText; }
  public set panelAddText(value: string) { this.addPanelText = value; }
  /**
   * A caption for the Remove Panel button.
   * @see removePanelButtonLocation
   */
  @property({ localizable: { defaultStr: "removePanel" } }) removePanelText: string;
  /**
   * @deprecated Use the [`removePanelText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#removePanelText) property instead.
   * @hidden
   */
  public get panelRemoveText(): string { return this.removePanelText; }
  public set panelRemoveText(val: string) { this.removePanelText = val; }
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
    return this.canGoToNextRecord;
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
  private lightBuiltPanels: Array<PanelModel> = [];
  /* What a light attach skipped (Question.runConditions), run once the batch placed its panels and
     every question has its value, still inside the batch: a value a condition computes for a record
     that does not hold it yet is buffered and published with the others, as it was when each question
     computed it on attach. */
  private runLightBuiltPanelsConditions(): void {
    const panels = this.lightBuiltPanels.filter(panel => !panel.isDisposed);
    this.lightBuiltPanels = [];
    if (panels.length === 0 || !this.data) return;
    this.runPanelsCondition(panels, this.getDataFilteredProperties());
    panels.forEach(panel => panel.locStrsChanged());
  }
  private prepareValueForPanelCreating() {
    this.addingNewPanelsValue = this.value;
    this.isAddingNewPanels = true;
    this.isNewPanelsValueChanged = false;
  }
  private setValueAfterPanelsCreating() {
    this.runLightBuiltPanelsConditions();
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
   * @see panelCountExpression
   */
  // The RECORD count. It stops being the panel count while a filter is active.
  public get panelCount(): number {
    if (!this.canBuildPanels || this.wasNotRenderedInSurvey) return this.getPropertyValue("panelCount");
    return this.hasDataListView ? this.dataList.count : this.panelsCore.length;
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
    /* The data source owns the count: the question never grows or truncates its storage, and the
       getter reads the loaded total, so there is nothing to store either. The count reaches the
       question the other way round - through setLoadedRecords, from a read that committed. */
    if (this.isRemoteData) return;
    if (this.hasDataListView) {
      this.setPanelCountInView(val);
      return;
    }
    if (val == this.panelsCore.length || this.useTemplatePanel) return;
    this.updateBindings("panelCount", val);
    this.prepareValueForPanelCreating();
    const isAddingOnePanel = val - this.panelCount === 1;
    const firstAddedIndex = this.panelCount;
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
    this.updateNewPanelsVisibleIndex(firstAddedIndex);
    this.fireCallback(this.panelCountChangedCallback);
    this.enablePanelsAnimations();
  }
  /* panelCount counts records while a filter is active, so it grows and shrinks the storage and the
     panels follow the view afterwards. The records that appear are always in the view, which keeps
     "the new panel is the last one" true for addPanel. */
  private setPanelCountInView(val: number): void {
    const list = this.dataList;
    if (val === list.count || this.useTemplatePanel) return;
    this.updateBindings("panelCount", val);
    this.syncRecordCount(val);
    this.rebuildPanelsFromDataList();
  }
  /* Grows or truncates the records to a count. Under paging most of the new records never get a
     panel, so they are created with the defaults their panel would have written. */
  private syncRecordCount(val: number): void {
    const list = this.dataList;
    const createRecord = this.isPagingActive ? (): any => this.createNewRecord() : undefined;
    this.isValueChangingInternally = true;
    try {
      list.batch((): void => {
        list.ensureCount(val, createRecord);
        list.truncate(val);
      });
    } finally {
      this.isValueChangingInternally = false;
    }
  }
  private updateNewPanelsVisibleIndex(firstAddedIndex: number): void {
    if (!this.survey) return;
    const sQN = this.getShowQuestionNumbers();
    if (sQN !== "onpanel" && sQN !== "recursive") return;
    for (let i = firstAddedIndex; i < this.panelsCore.length; i++) {
      this.panelsCore[i].setVisibleIndex(0);
    }
  }
  /**
   * Returns the number of visible panels in Dynamic Panel.
   * @see templateVisibleIf
   */
  /* The number of visible RECORDS (Andrew's decision 2026-09-25), which is what navigation and
     progress count: under paging only the page has panels. A data source that pages itself answers
     with its total, or with the most records known so far when it reports none. Code that indexes
     visiblePanels bounds itself by visiblePanels.length instead. */
  public get visiblePanelCount(): number {
    const panels = this.visiblePanels;
    const list = this.dataListValue;
    if (this.isRemoteData && !!list) return list.knownCount;
    return this.isPagingActive ? list.visibleCount : panels.length;
  }
  // Next is available on the last record the list knows of while the source says there are more.
  private get hasRecordBeyondKnown(): boolean {
    const list = this.dataListValue;
    return this.isRemoteData && !!list && !list.isCountKnown && list.hasMore;
  }
  private get canGoToNextRecord(): boolean {
    const index = this.currentIndex;
    return index >= 0 && (index < this.visiblePanelCount - 1 || this.hasRecordBeyondKnown);
  }
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
  @property() panelsState: string;

  public getStructuredValue(level: number = -1): any {
    if (level < 0 || this.isEmpty() || !Array.isArray(this.value)) return this.value;
    const data = new Array<any>();
    // The panels that exist: under paging the page (a limitation stated with getPlainData).
    const valCount = Math.min(this.visiblePanels.length, this.value.length);
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
  // onlyPanels: attach these of the panels only.
  private setPanelsSurveyImpl(onlyPanels?: Array<PanelModel>) {
    for (var i = 0; i < this.panelsCore.length; i++) {
      var panel = this.panelsCore[i];
      if (panel == this.template) continue;
      if (!!onlyPanels && onlyPanels.indexOf(panel) < 0) continue;
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
      if (state === "expanded") {
        this.panelsCore[i].expand(false);
      } else {
        this.panelsCore[i].state = state;
      }
    }
  }
  private setValueBasedOnPanelCount() {
    // The storage of a remote-backed question is the source's, and its window is one page: growing
    // it up to the count would pad the page with records the server does not have.
    if (this.isRemoteData) return;
    const list = this.dataList;
    const panelCount = this.panelCount;
    if (list.count === panelCount) return;
    this.isValueChangingInternally = true;
    list.batch((): void => {
      list.ensureCount(panelCount, (i: number): any => {
        // A record past the page has no panel to take its value from.
        const panel = this.panels[i];
        const panelValue = !!panel ? panel.getValue() : this.createNewRecord();
        return !Helpers.isValueEmpty(panelValue) ? panelValue : {};
      });
      list.truncate(panelCount);
    });
    this.isValueChangingInternally = false;
  }
  /**
   * An expression that dynamically calculates the panel count. Overrides the static [`panelCount`](#panelCount) property.
   *
   * The calculation result is clamped to the [`minPanelCount`](#minPanelCount) and [`maxPanelCount`](#maxPanelCount) limits: a value below the minimum is set to `minPanelCount`, and a value above the maximum is capped at `maxPanelCount`. The global [`settings.panel.maxPanelCount`](/form-library/documentation/api-reference/settings#panel) setting also limits the maximum.
   *
   * While this property is set, users cannot add or remove panels manually. The expression is reevaluated when its referenced values or panel limits change.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   * @since 3.0.4
   */
  @property() panelCountExpression: string;
  /* A data source owns the number of records, so panelCountExpression is ignored while one is
     attached - including the add/remove gating it otherwise imposes. No error: a question may carry
     both and only the source decides. */
  private get hasPanelCountExpression(): boolean {
    return !!this.panelCountExpression && !this.isRemoteData;
  }
  private setPanelCountByExpression(val: any): void {
    this.panelCount = DynamicItemModelBase.getItemCountByExpressionValue(val, this.minPanelCount, this.maxPanelCount);
  }
  /* The result is clamped by minPanelCount/maxPanelCount, so changing a limit has to
     recalculate it: the raw expression result is not stored anywhere */
  private rerunPanelCountExpression(): void {
    if (this.isLoadingFromJson || !this.canRunConditions()) return;
    this.runExpressionByProperty("panelCountExpression", this.getDataFilteredProperties(),
      (val: any): void => { this.setPanelCountByExpression(val); });
  }
  protected updateBindings(propertyName: string, value: any): void {
    if (propertyName === "panelCount" && this.hasPanelCountExpression) return;
    super.updateBindings(propertyName, value);
  }
  protected updateBindingProp(propName: string, value: any): void {
    if (propName === "panelCount" && this.hasPanelCountExpression) return;
    super.updateBindingProp(propName, value);
  }
  /**
   * A minimum number of panels in Dynamic Panel. Users cannot delete panels if `panelCount` equals `minPanelCount`.
   *
   * Default value: 0
   * @see panelCount
   * @see maxPanelCount
   * @see allowRemovePanel
   */
  @property({ onSetting: (val: number) => val < 0 ? 0 : val }) minPanelCount: number;

  private onMinPanelCountChanged(): void {
    const val = this.minPanelCount;
    if (val > this.maxPanelCount)this.maxPanelCount = val;
    if (this.panelCount < val)this.panelCount = val;
    this.rerunPanelCountExpression();
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
  @property({ onSetting: (val: number) => val <= 0 ? 1 : val < settings.panel.maxPanelCount ? val : settings.panel.maxPanelCount }) maxPanelCount: number;

  private onMaxPanelCountChanged(): void {
    const val = this.maxPanelCount;
    if (val < this.minPanelCount)this.minPanelCount = val;
    if (this.panelCount > val)this.panelCount = val;
    this.rerunPanelCountExpression();
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
  @property() allowAddPanel: boolean;
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
  @property() newPanelPosition: string;
  /**
   * Specifies whether users are allowed to delete panels.
   *
   * Default value: `true`
   * @see canRemovePanel
   * @see allowAddPanel
   */
  @property() allowRemovePanel: boolean;
  /**
   * Indicates whether the add panel button is enabled. When set to `false`, the button is disabled but remains visible.
   *
   * Default value: `true`
   *
   * This property is not serialized.
   * @see allowAddPanel
   * @since 2.5.25
   */
  @property({ defaultValue: true }) enableAddPanel: boolean;
  /**
   * Indicates whether the remove panel button is enabled. When set to `false`, the button is disabled but remains visible.
   *
   * Default value: `true`
   *
   * This property is not serialized.
   * @see allowRemovePanel
   * @since 2.5.25
   */
  @property({ defaultValue: true }) enableRemovePanel: boolean;
  /**
   * Gets or sets the location of question titles relative to their input fields.
   *
   * - `"default"` (default) - Inherits the setting from the Dynamic Panel's `titleLocation` property, which in turn inherits the [`questionTitleLocation`](https://surveyjs.io/form-library/documentation/surveymodel#questionTitleLocation) property value specified for the Dynamic Panel's container (page or survey).
   * - `"top"` - Displays question titles above input fields.
   * - `"bottom"` - Displays question titles below input fields.
   * - `"left"` - Displays question titles to the left of input fields.
   * - `"hidden"` - Hides question titles.
   * @see titleLocation
   * @since 2.0.0
   */
  @property() templateQuestionTitleLocation: string;
  /**
   * @deprecated Use the [`templateQuestionTitleLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateQuestionTitleLocation) property instead.
   * @hidden
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
   * @since 2.0.4
   */
  @property() templateQuestionTitleWidth: string;
  /**
   * Specifies the error message position.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
   * - `"top"` - Displays error messages above questions.
   * - `"bottom"` - Displays error messages below questions.
   */
  @property() templateErrorLocation: string;

  public resetSingleInput(): void {
    super.resetSingleInput();
    this.locTemplateTitle.onGetTextCallback = null;
  }
  public get locEditPanelText(): LocalizableString {
    return this.getOrCreateLocStr("editPanelText", false, "editText");
  }
  protected createSingleInputBehavior(): QuestionSingleInputBehavior {
    return new PanelDynamicSingleInputBehavior(this);
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
   * @see questionStartIndex
   * @see showNumber
   */
  @property({ onSetting: (val: string) => {
    if (!val) return "off";
    val = val.toLowerCase();
    if (val === "onsurvey") return "default";
    return val;
  } }) showQuestionNumbers: string;

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
   * @since 2.0.0
   */
  @property() removePanelButtonLocation: string;
  /**
   * @deprecated Use the [`removePanelButtonLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#removePanelButtonLocation) property instead.
   * @hidden
   */
  public get panelRemoveButtonLocation(): string { return this.removePanelButtonLocation; }
  public set panelRemoveButtonLocation(val: string) { this.removePanelButtonLocation = val; }
  /**
   * @deprecated Use the [`showProgressBar`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#showProgressBar) property instead.
   * @hidden
   */
  public get showRangeInProgress(): boolean {
    return this.showProgressBar;
  }
  public set showRangeInProgress(val: boolean) {
    this.showProgressBar = val;
  }
  /**
   * @deprecated Use the [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) property instead.
   * @hidden
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
    // The display mode decides the page size (a carousel pages one panel at a time): a page size
    // that changed rebuilds the page through the list reset.
    if (!!this.dataListValue || this.displayMode === "carousel") {
      this.paging.updatePageSize();
    }
    this.blockAnimations();
    this.updateRenderedPanels();
    this.releaseAnimations();
    this.updatePanelsAnimation();
    this.updateTabbedMenuItems();
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
  @property() tabAlign: "center" | "left" | "right";

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
    if (this.isDesignMode || this.hasPanelCountExpression || !this.canInsertRecord) return false;
    if (!this.isRenderModeList &&
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
    if (this.isDesignMode || this.hasPanelCountExpression || !this.canRemoveRecord) return false;
    return (
      this.allowRemovePanel &&
      !this.isReadOnly &&
      this.panelCount > this.minPanelCount
    );
  }
  protected rebuildPanels() {
    if (this.isLoadingFromJson) return;
    // Under paging a panel per record is exactly what must not be built: the page is rebuilt instead.
    if (!this.useTemplatePanel && this.isPagingActive && this.hasPanelBuildFirstTime) {
      this.rebuildPanelsFromDataList();
      return;
    }
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
    const oldPanels = [].concat(this.panelsCore);
    this.isRebuildingPanels = true;
    try {
      this.panelsCore.splice(0, this.panelsCore.length, ...panels);
    } finally {
      this.isRebuildingPanels = false;
    }
    this.setValueAfterPanelsCreating();
    this.setPanelsState();
    this.reRunCondition();
    this.updateFooterActions();
    this.fireCallback(this.panelCountChangedCallback);
    this.updateTabbedMenuItems();
    // The template is not the question's to dispose: it is one of the panels in design mode.
    this.disposePanels(oldPanels.filter((panel: PanelModel): boolean => panel !== this.template));
  }
  /**
   * If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty
   * @see defaultValue
   * @see copyDefaultValueFromLastEntry
   */
  @property() defaultPanelValue: any;
  /**
   * Specifies whether default values for a new panel should be copied from the last panel.
   *
   * If you also specify `defaultValue`, it will be merged with the copied values.
   * @see defaultValue
   * @since 2.0.0
   */
  @property() copyDefaultValueFromLastEntry: boolean;
  /**
   * @deprecated Use the [`copyDefaultValueFromLastEntry`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#copyDefaultValueFromLastEntry) property instead.
   * @hidden
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
    DynamicItemModelBase.setDefaultValueCore(this, this.defaultPanelValue, this.panelCount, () => super.setDefaultValue());
  }
  public get isValueArray(): boolean { return true; }
  public isEmpty(): boolean {
    const list = this.dataList;
    // loadedCount, not count: with a data source that pages, count is the server total and only the
    // records of the loaded window can be looked at. Equal for every local source.
    for (let i = 0; i < list.loadedCount; i++) {
      if (!this.isRowEmpty(list.getRecord(i))) return false;
    }
    return true;
  }
  /* Under in-memory paging the progress is counted from the records - every visible record, every
     input question of the template - as the matrix counts it before its rows exist: the panels are
     one page. A question that is empty in a record and has a visibleIf is not counted, since whether
     it would be shown is not known without its panel. A remote question counts its window. */
  public getProgressInfo(): IProgressInfo {
    if (!this.isPagedInMemory) {
      return SurveyElement.getProgressInfoByElements(this.visiblePanelsCore, this.isRequired);
    }
    const res = Base.createProgressInfo();
    const list = this.dataList;
    const questions = this.template.questions.filter((q: Question): boolean => q.hasInput);
    list.getVisibleIndexes().forEach((index: number): void => {
      const record = list.getRecord(index) || {};
      questions.forEach((q: Question): void => {
        const hasValue = !Helpers.isValueEmpty(record[q.getValueName()]);
        if (!hasValue && !!q.visibleIf) return;
        res.questionCount += 1;
        res.requiredQuestionCount += q.isRequired ? 1 : 0;
        res.answeredQuestionCount += hasValue ? 1 : 0;
        res.requiredAnsweredQuestionCount += hasValue && q.isRequired ? 1 : 0;
      });
    });
    if (res.requiredQuestionCount === 0 && this.isRequired) {
      res.requiredQuestionCount = 1;
      res.requiredAnsweredQuestionCount = !this.isEmpty() ? 1 : 0;
    }
    return res;
  }
  protected hasCorrectAnswerValue(): boolean {
    return this.getQuizQuestionsInPanels().length > 0 || super.hasCorrectAnswerValue();
  }
  protected getQuizQuestionCount(): number {
    return this.calcQuizCountInPanels(q => q.quizQuestionCount, () => super.getQuizQuestionCount());
  }
  protected getCorrectAnswerCount(): number {
    return this.calcQuizCountInPanels(q => q.correctAnswerCount, () => super.getCorrectAnswerCount());
  }
  private calcQuizCountInPanels(getCount: (q: Question) => number, getDefault: () => number): number {
    const questions = this.getQuizQuestionsInPanels();
    return questions.length === 0
      ? getDefault()
      : questions.reduce((res, q) => res + getCount(q), 0);
  }
  private getQuizQuestionsInPanels(): Array<Question> {
    const res: Array<Question> = [];
    this.visiblePanels.forEach(panel => {
      panel.questions.forEach(q => {
        if (q.quizQuestionCount > 0) {
          res.push(q);
        }
      });
    });
    return res;
  }
  private isRowEmpty(val: any) {
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) return false;
    }
    return true;
  }
  /* Returns the panel that was added and is shown, or null: add is not allowed, the page it leaves
     has errors, or the move waits for asynchronous validators - the add then happens once they
     settle clean and is observed through onDynamicPanelAdded. */
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
    if (!isUI) return this.addPanelAndShow(index, false);
    if (!this.canAddPanel) return null;
    /* "Add" is a move the respondent makes: the new panel is shown, so the page it lands on replaces
       the page in force whenever the two differ, and that page is validated first (layer 1). In
       carousel and tab mode the panel the respondent leaves is validated even on the same page, as
       it always has been. */
    let newPanel: PanelModel = null;
    const add = (): void => { newPanel = this.addPanelAndShow(index, true); };
    const isLeavingPage = this.isAddLeavingPage(index);
    if (this.isRenderModeList && !isLeavingPage) {
      add();
    } else {
      this.pageValidation.leave(true, add, (context: ValidationContext): boolean =>
        isLeavingPage ? this.validatePageObjects(context) : this.validateCurrentPanel(context), !this.isRenderModeList,
      isLeavingPage ? undefined : this.getCurrentPanelRecords());
    }
    return newPanel;
  }
  private addPanelAndShow(index: number, isUI: boolean): PanelModel {
    const newPanel = this.addPanelCore(index);
    this.panelOnFirstRendering(newPanel);
    if (isUI && !!newPanel) {
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
  private validateCurrentPanel(context: ValidationContext): boolean {
    const panel = this.currentPanel;
    return !panel || panel.validateElement(context);
  }
  // Does the record an add creates land on another page than the one shown?
  private isAddLeavingPage(index: number): boolean {
    if (!this.isPagedInMemory) return false;
    const target = this.getInsertTarget(index);
    return this.paging.getPageOfVisibleIndex(target.visibleIndex) !== this.dataList.pageIndex;
  }
  /* Where an in-memory paged add puts the new record: the record index it is inserted at and the
     visibleIndex it will have. index is a created position, page-local under paging: it inserts
     before the panel at that position - past the last one of the page, before the first record of
     the next page. undefined inserts after the current panel in carousel and tab mode and appends in
     list mode; a negative index always appends. */
  private getInsertTarget(index: number): { at: number, visibleIndex: number, prevIndex: number } {
    const list = this.dataList;
    const visible = list.getVisibleIndexes();
    const append = { at: list.count, visibleIndex: visible.length, prevIndex: visible.length > 0 ? visible[visible.length - 1] : -1 };
    let visibleIndex: number;
    if (index === undefined) {
      const curIndex = this.currentIndex;
      if (curIndex < 0) return append;
      visibleIndex = curIndex + 1;
    } else {
      if (index < 0) return append;
      visibleIndex = this.pageStartVisibleIndex + Math.min(index, this.visiblePanelsCore.length);
    }
    if (visibleIndex >= visible.length) return append;
    return { at: visible[visibleIndex], visibleIndex: visibleIndex, prevIndex: visibleIndex > 0 ? visible[visibleIndex - 1] : -1 };
  }
  private addPanelCore(index: number): PanelModel {
    if (this.isPagedInMemory) return this.addPanelInPage(index);
    const curIndex = this.currentIndex;
    // A page-local position: the current panel's position in panelsCore.
    const curPos = curIndex < 0 ? -1 : curIndex - this.pageStartVisibleIndex;
    /* Every index here is a created position - a position in panelsCore. With a data source that
       pages, the panels exist for the loaded window only, so the positions end with it and not with
       the server total that panelCount reports. */
    const maxIndex = this.isRemoteData ? this.dataList.getMaterializedIndexes().length : this.panelCount;
    if (index === undefined) {
      index = curPos < 0 ? maxIndex : curPos + 1;
    }
    if (index < 0 || index > maxIndex) {
      index = maxIndex;
    }
    if (this.isRemoteData) {
      this.addPanelRemote(curPos < 0 ? maxIndex - 1 : curPos, index);
    } else {
      this.updateValueOnAddingPanel(curPos < 0 ? this.panelCount - 1 : curPos, index);
    }
    if (!this.isRenderModeList) {
      this.currentIndex = this.pageStartVisibleIndex + index;
    }
    this.notifyOnPanelAddedRemoved(true, index);
    return this.panelsCore[index];
  }
  /* The in-memory paged add (prompt 15, item 10). The complete record - the default panel value,
     then the copy from the previous entry - is inserted once, and the question moves to the page of
     the inserted record, which is the last page only for an append; that move rebuilds the page and
     the new record's panel is the one returned. */
  private addPanelInPage(index: number): PanelModel {
    const list = this.dataList;
    const target = this.getInsertTarget(index);
    const record = this.createNewRecord();
    if (this.copyDefaultValueFromLastEntry && target.prevIndex > -1) {
      this.copyValue(record, list.getRecord(target.prevIndex));
    }
    this.updateBindings("panelCount", list.count + 1);
    this.isValueChangingInternally = true;
    let at = -1;
    try {
      list.batch((): void => { at = list.add(record, target.at); });
    } finally {
      this.isValueChangingInternally = false;
    }
    this.pageValidation.markEdited(at);
    const visibleIndex = list.getVisibleIndexes().indexOf(at);
    const page = this.paging.getPageOfVisibleIndex(visibleIndex);
    if (!this.isRenderModeList) {
      this.pendingCurrentVisibleIndex = visibleIndex;
    }
    if (page !== list.pageIndex) {
      this.paging.pageIndex = page;
    } else {
      this.rebuildPanelsFromDataList();
    }
    this.updateFooterActions();
    const position = list.indexToMaterializedIndex(at);
    const newPanel = this.panelsCore[position];
    this.notifyOnPanelAddedRemoved(true, position, newPanel);
    return newPanel;
  }
  /* A record for a panel that does not exist yet: the defaults its panel would write when it is
     created - the template questions' default values and defaultPanelValue. Under paging a record
     is created long before its panel, and the panel of an unvisited page is never created at all. */
  private createNewRecord(): any {
    const record: any = {};
    this.template.questions.forEach((q: Question): void => {
      const val = q.getDefaultValue();
      if (!this.isValueEmpty(val)) {
        record[q.getValueName()] = Helpers.getUnbindValue(val);
      }
    });
    if (!this.isValueEmpty(this.defaultPanelValue)) {
      this.copyValue(record, Helpers.getUnbindValue(this.defaultPanelValue));
    }
    return record;
  }
  /* The remote add path. The local one grows the count first and writes the defaults afterwards,
     which over a data source is a throwing count setter followed by up to three server calls for one
     gesture. Here the complete record is built first - the default panel value, then the copy from
     the last entry IN THE WINDOW - and handed to the list once: one source.insert, no move, no
     follow-up update. question.value follows the window through the recordAdded notification. */
  private addPanelRemote(prevPosition: number, position: number): void {
    const list = this.dataList;
    // Positions of panels: the materialized set, which for a source that pages itself is the window.
    const createdCount = list.getMaterializedIndexes().length;
    const at = Math.max(0, Math.min(position, createdCount));
    const record: any = {};
    if (!this.isValueEmpty(this.defaultPanelValue)) {
      this.copyValue(record, this.defaultPanelValue);
    }
    if (this.copyDefaultValueFromLastEntry && createdCount > 0) {
      const fromPosition = prevPosition > -1 && prevPosition < createdCount ? prevPosition : createdCount - 1;
      const fromIndex = list.materializedIndexToIndex(fromPosition);
      if (fromIndex > -1) {
        this.copyValue(record, list.getRecord(fromIndex));
      }
    }
    // Before the record the panel at that position holds, or at the end of the window.
    list.add(record, at < createdCount ? list.materializedIndexToIndex(at) : list.loadedCount);
    if (at < createdCount) {
      // Inserted inside the window: every panel after it holds another record now, so the panels are
      // rebuilt - the same rebuild a page change runs.
      this.rebuildPanelsFromDataList();
      return;
    }
    // Appended: one panel is created and the panels that exist keep their state.
    this.prepareValueForPanelCreating();
    this.panelsCore.push(this.createNewPanel());
    this.setValueAfterPanelsCreating();
    this.setPanelsState();
    this.reRunCondition();
    this.updateFooterActions();
    this.updateNewPanelsVisibleIndex(this.panelsCore.length - 1);
    this.fireCallback(this.panelCountChangedCallback);
  }
  private focusNewPanelCallback: () => void;
  private focusNewPanel() {
    if (this.focusNewPanelCallback) {
      this.focusNewPanelCallback();
      this.focusNewPanelCallback = undefined;
    }
  }
  private updateValueOnAddingPanel(prevIndex: number, index: number): void {
    // The panel object exists before its record is moved into place: onPanelAdded must see the same
    // state it sees today.
    this.panelCount++;
    const list = this.dataList;
    if (list.count !== this.panelCount) return;
    const lastIndex = this.panelCount - 1;
    // index and prevIndex are created positions; the records they name are what the list moves.
    const recordIndex = index < lastIndex ? this.getRecordIndexByPanelIndex(index) : lastIndex;
    if (recordIndex < 0) return;
    list.batch((): void => {
      // panelCount++ appended the new record at the end; it belongs at index.
      if (recordIndex !== lastIndex) {
        list.move(lastIndex, recordIndex);
      }
      const record = Object.assign({}, list.getRecord(recordIndex));
      let hasModified = false;
      if (!this.isValueEmpty(this.defaultPanelValue)) {
        hasModified = true;
        this.copyValue(record, this.defaultPanelValue);
      }
      if (this.copyDefaultValueFromLastEntry && list.count > 1) {
        const fromPosition = prevIndex > -1 && prevIndex <= lastIndex ? prevIndex : lastIndex;
        const fromIndex = this.getRecordIndexByPanelIndex(fromPosition);
        if (fromIndex > -1) {
          hasModified = true;
          this.copyValue(record, list.getRecord(fromIndex));
        }
      }
      if (hasModified) {
        list.setRecord(recordIndex, record);
      }
    });
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
    if (index < 0 || index >= this.visiblePanels.length) return false;
    const panelValue = this.visiblePanelsCore[index].getValue();
    return !this.isValueEmpty(panelValue) &&
      (this.isValueEmpty(this.defaultPanelValue) || !this.isTwoValueEquals(panelValue, this.defaultPanelValue));
  }
  /**
   * Switches Dynamic Panel to the next panel. Returns `true` in case of success, or `false` if `displayMode` is `"list"` or the current panel contains validation errors.
   * @see displayMode
   */
  /* A move the respondent makes, one record forward. Inside the page the current panel is validated
     first, as it always has been; the last panel of a page moves to the next page, and that page
     leave validates the page's panels. Both follow the survey's checkErrorsMode and wait for
     asynchronous validators (layer 1). Returns false only for an error found at once. */
  public goToNextPanel(): boolean {
    const index = this.currentIndex;
    if (index < 0) return false;
    const isLeavingPage = this.isPagingActive && this.canGoToNextRecord &&
      index - this.pageStartVisibleIndex >= this.visiblePanelsCore.length - 1;
    return this.pageValidation.leave(true, (): void => {
      if (this.canGoToNextRecord) {
        this.moveToVisibleIndex(index + 1);
      }
    }, (context: ValidationContext): boolean => isLeavingPage ? this.validatePageObjects(context) : this.validateCurrentPanel(context), true,
    isLeavingPage ? undefined : this.getCurrentPanelRecords());
  }
  // The record the current panel holds: what a Next inside the page validates, and nothing else.
  private getCurrentPanelRecords(): Array<number> {
    const panel = this.currentPanel;
    const position = !!panel ? this.panelsCore.indexOf(panel) : -1;
    return position < 0 ? [] : [this.getRecordIndexByPanelIndex(position)];
  }
  /**
   * Switches Dynamic Panel to the previous panel.
   */
  // A move back: it does not validate, as the survey's previous page does not.
  public goToPrevPanel() {
    const index = this.currentIndex;
    if (index <= 0) return;
    this.cancelPendingPageMove();
    this.moveToVisibleIndex(index - 1);
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
  // A number is a position in visiblePanels - a pageVisibleIndex under paging: an off-page record
  // has no panel and is removed through the value or after moving to its page.
  public removePanel(value: any, confirmDelete?: boolean): void {
    const visIndex = this.getVisualPanelIndex(value);
    // visiblePanels and not the core array: the getter builds panels that were not built yet.
    if (visIndex < 0 || visIndex >= this.visiblePanels.length) return;
    const isUI = confirmDelete !== undefined;
    if (isUI) {
      if (!this.canRemovePanel) return;
      const removePanel = () => {
        this.removePanelCore(visIndex);
        this.focusAfterPanelRemoved(visIndex);
        // A remote page that is read again after the removal rebuilds every panel when the read
        // commits: the position is focused once more after that rebuild.
        if (!!this.remoteValue)this.remoteValue.keepFocusIndexForRead(visIndex);
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
  private focusAfterPanelRemoved(visIndex: number): void {
    const pnlCount = this.visiblePanels.length;
    const nextIndex = visIndex >= pnlCount ? pnlCount - 1 : visIndex;
    const element = pnlCount === 0 ? () => this.addPanelAction?.getInputElement() : (nextIndex > -1 ? () => this.getRemovePanelAction(this.visiblePanels[nextIndex])?.getInputElement() : "");
    if (!!element) {
      SurveyElement.FocusElement(element, true, this.survey?.rootElement, this.shouldHandleFocusScroll);
    }
  }
  // After the panels were rebuilt from a committed read; FocusElement's own timeout lets them render.
  private focusAfterRead(): void {
    if (!this.remoteValue) return;
    const index = this.remoteValue.takeFocusIndexAfterRead(this.id, this.getWrapperElement());
    if (index > -1) {
      this.focusAfterPanelRemoved(index);
    }
  }
  // The visibleIndex of the removed panel and the panel itself: the animation that follows takes its
  // direction from them.
  private removedPanelIndex: number;
  private removedPanel: PanelModel;
  private removePanelCore(visIndex: number): void {
    this.removedPanelIndex = this.pageStartVisibleIndex + visIndex;
    const panel = this.visiblePanelsCore[visIndex];
    const index = this.panelsCore.indexOf(panel);
    if (index < 0) return;
    // index is a created position; the record it holds is what leaves the storage.
    const recordIndex = this.getRecordIndexByPanelIndex(index);
    if (this.survey && !this.dynamicPanelCallbacks.dynamicPanelRemoving(this, index, panel)) return;
    this.removedPanel = panel;
    const pageIndex = !!this.dataListValue ? this.dataListValue.pageIndex : 0;
    this.panelsCore.splice(index, 1);
    this.setPropertyValue("panelCount", this.panelCount);
    this.singleInputOnRemoveItem(visIndex);
    const list = this.dataList;
    if (recordIndex < 0 || recordIndex >= list.count) {
      this.updateFooterActions();
    } else {
      this.isValueChangingInternally = true;
      list.remove(recordIndex);
      this.updateFooterActions();
      this.fireCallback(this.panelCountChangedCallback);
      this.notifyOnPanelAddedRemoved(false, index, panel);
      this.isValueChangingInternally = false;
    }
    /* The page came up one record short, and the first record of the next page belongs on it now: the
       page is refilled, as a data source's remove refill does (step 08). A remove that emptied the
       last page moved the page back and that page change rebuilt it already. */
    if (this.isPagedInMemory && list.pageIndex === pageIndex) {
      this.rebuildPanelsFromDataList();
    }
    this.disposePanels([panel]);
  }
  private notifyOnPanelAddedRemoved(isAdded: boolean, index: number, panel?: PanelModel): void {
    if (!panel) {
      panel = this.panelsCore[index];
    }
    // The panel may be gone by now: adding one programmatically while panelCountExpression is
    // set re-evaluates the expression, which drops the panel again before this notification
    if (!panel) return;
    const sQN = this.getShowQuestionNumbers();
    if (this.survey) {
      const updateIndeces = sQN === "default";
      if (isAdded) {
        this.dynamicPanelCallbacks.dynamicPanelAdded(this, index, panel, updateIndeces);
      } else {
        this.dynamicPanelCallbacks.dynamicPanelRemoved(this, index, panel, updateIndeces);
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
  public randomSeedChanged(): void {
    const panels = this.panelsCore;
    for (var i = 0; i < panels.length; i++) {
      panels[i].randomSeedChanged();
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
  // index is a CREATED position - what it has always been for this method.
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (index < 0 || index >= this.panelsCore.length) return null;
    return this.panelsCore[index].getQuestionByName(name);
  }
  // The record-index counterpart of getQuestionFromArray: the panel the record has, whatever
  // position it took.
  public getQuestionFromRecord(name: string, recordIndex: number): IQuestion {
    const item = <QuestionPanelDynamicItem>this.getItemByRecordIndex(recordIndex);
    return !!item ? item.panel.getQuestionByName(name) : null;
  }
  private clearIncorrectValuesInPanel(position: number) {
    var panel = this.panelsCore[position];
    panel.clearIncorrectValues();
    const index = this.getRecordIndexByPanelIndex(position);
    const record = index < 0 ? undefined : this.dataList.getRecord(index);
    if (!record) return;
    // A copy: the stored record is never mutated, the list replaces it.
    const values = Object.assign({}, record);
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
      this.dataList.setRecord(index, values);
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
  // recordIndex, not a panel position: the other question may hold its panels for another set of
  // records or in another order.
  public getSharedQuestionFromArray(name: string, recordIndex: number): Question {
    return !!this.survey && !!this.valueName ? <Question>(this.survey.getQuestionByValueNameFromRecord(this.valueName, name, recordIndex)) : null;
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
    DynamicItemModelBase.collectNestedQuestionsInItems(
      visibleOnly ? this.visiblePanelsCore : this.panelsCore,
      questions, visibleOnly, includeNested, includeItSelf
    );
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
  /* The capabilities of a data source are declared by the presence of its optional methods: a source
     without insert gets no add button, one without remove no delete button, and one without update
     makes every panel read-only - a silently unsaved edit is worse than a disabled field, and an
     application that wants local-only edits over remote reads implements a no-op update. A question
     without a data source has every capability. */
  private get canInsertRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("insert");
  }
  private get canRemoveRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("remove");
  }
  private get canUpdateRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("update");
  }
  // One hook for the whole question, not one per nested question.
  private get arePanelsReadOnly(): boolean {
    return this.isReadOnly || !this.canUpdateRecord;
  }
  private updatePanelsReadOnly(): void {
    const readOnly = this.arePanelsReadOnly;
    this.template.readOnly = readOnly;
    for (let i = 0; i < this.panelsCore.length; i++) {
      this.panelsCore[i].readOnly = readOnly;
    }
  }
  protected onReadOnlyChanged(): void {
    this.updatePanelsReadOnly();
    this.updateNoEntriesTextDefaultLoc();
    this.updateFooterActions();
    super.onReadOnlyChanged();
  }
  private updateNoEntriesTextDefaultLoc(): void {
    const loc = this.getLocalizableString("noEntriesText");
    if (!loc) return;
    loc.localizationName = this.getNoEntriesLocalizationName();
  }
  private getNoEntriesLocalizationName(): string {
    return !this.showAddPanelButton ? "noEntriesReadonlyText" : "noEntriesText";
  }
  public onSurveyLoad(): void {
    this.template.readOnly = this.arePanelsReadOnly;
    this.template.onSurveyLoad();
    const newPanelCount = this.adjustPanelCount();
    if (newPanelCount > -1) {
      this.setPropertyValue("panelCount", newPanelCount);
    }
    super.onSurveyLoad();
    // The one hook every load ends with: the sort and the filter the JSON authored reach the list
    // here, once, whatever order their keys came in.
    this.paging.flushAuthoredView();
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
    // Before the flag: a page size that changes here resets the list, and that reset must not build.
    this.syncListPageSize();
    this.hasPanelBuildFirstTime = true;
    this.isBuildingPanelsFirstTime = true;
    // Panels that exist before the first build (built while the question had no survey) are attached
    // again below; the ones this build creates were attached to their item on creation.
    const panelsBefore: Array<PanelModel> = [].concat(this.panelsCore);
    if (this.isRemoteData) {
      /* The records come from a data source: the panels are built for the loaded window and the
         stored panelCount says nothing about them - the panelCount setter is a no-op while a source
         is attached. Without this branch a question that gets its source before its first rendering
         would never build a panel. */
      this.rebuildPanelsFromDataList();
    } else if (this.isPagingActive) {
      /* The records first, then the panels of the page: the panelCount setter would compare the count
         with the records the value already holds and build nothing. */
      const count = this.getPropertyValue("panelCount");
      if (count > 0 && count !== this.dataList.count) {
        this.updateBindings("panelCount", count);
        this.syncRecordCount(count);
      }
      this.rebuildPanelsFromDataList();
    } else if (this.getPropertyValue("panelCount") > 0) {
      this.panelCount = this.getPropertyValue("panelCount");
    }
    if (this.useTemplatePanel) {
      this.rebuildPanels();
    }
    this.setPanelsSurveyImpl(panelsBefore);
    this.setPanelsState();
    this.assignOnPropertyChangedToTemplate();
    if (this.data && this.isValueChangedWithoutPanels) {
      this.isValueChangedWithoutPanels = false;
      this.runTriggersOnBuildPanelsFirstTime();
    }
    // The panels that were built: under paging the page's, as a remote first build has always done.
    if (!!this.survey) {
      for (var i = 0; i < this.panelsCore.length; i++) {
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
    DynamicItemModelBase.runTriggersOnItems(
      this.visiblePanelsCore.map(p => <DynamicItemModelBase>p.data),
      item => this.getItemData(item),
      settings.expressionVariables.panel
    );
  }
  private get showAddPanelButton(): boolean { return this.allowAddPanel && !this.isReadOnly && !this.hasPanelCountExpression && this.canInsertRecord; }
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
    // One paging sync and one render for the whole run, a page rebuild included.
    const prevIsPagingSyncSuspended = this.isPagingSyncSuspended;
    this.isPagingSyncSuspended = true;
    try {
      // The records decide the page; when the page they decide is not the one built, the rebuild runs
      // the panels' conditions itself.
      if (this.updateRecordsVisibility(properties) && this.isPageStale()) {
        this.rebuildPanelsFromDataList();
      } else {
        this.runPanelsCondition(this.panelsCore, properties);
      }
    } finally {
      this.isPagingSyncSuspended = prevIsPagingSyncSuspended;
    }
    if (!this.isPagingSyncSuspended) {
      this.runDeferredPagingSync();
    }
  }
  /* templateVisibleIf under paging (Andrew's decision 2026-09-25): a page is a slice of the VISIBLE
     records, so the condition is evaluated over every record with a value-only context - {panel.x}
     is the record's field, {panelIndex} its index, survey values as usual - and the list's hidden
     flags are written without building a panel. O(records) expression runs per condition run, not
     O(records) panels. A panel that is built takes its visibility from the same evaluation (see
     createNewPanel), so the two cannot disagree. Limitation: an expression question the condition
     reads contributes its stored value. Returns whether a flag changed. */
  private updateRecordsVisibility(properties: HashTable<any>): boolean {
    if (!this.isPagingActive || this.isDesignMode || this.isLoadingFromJson) return false;
    const list = this.dataList;
    const expression = this.templateVisibleIf;
    if (!expression || this.areInvisibleElementsShowing) {
      if (!this.hasRecordVisibilityFlags) return false;
      this.hasRecordVisibilityFlags = false;
      return this.setRecordsVisibleAndSync((): boolean => true);
    }
    this.hasRecordVisibilityFlags = true;
    if (!this.recordVisibilityRunner || this.recordVisibilityRunner.expression !== expression) {
      this.recordVisibilityRunner = new ConditionRunner(expression);
    }
    const runner = this.recordVisibilityRunner;
    const item = this.createRecordItem(-1);
    const newProps = Helpers.createCopy(properties);
    newProps[settings.expressionVariables.panel] = item;
    return this.setRecordsVisibleAndSync((index: number): boolean => {
      item.reset(index, list.getRecord(index));
      return runner.runContext(item.getValueGetterContext(), newProps) === true;
    });
  }
  private setRecordsVisibleAndSync(isVisible: (index: number) => boolean): boolean {
    if (!this.dataList.setRecordsVisible(isVisible)) return false;
    this.syncPagingState();
    return true;
  }
  private hasRecordVisibilityFlags: boolean;
  private recordVisibilityRunner: ConditionRunner;
  // The panels hold other records than the page names: a record became hidden or visible ahead of
  // them, or the page moved under them.
  private isPageStale(): boolean {
    if (!this.hasPanelBuildFirstTime || this.useTemplatePanel || !this.dataListValue) return false;
    const records = this.dataList.getMaterializedIndexes();
    const panels = this.panelsCore;
    if (records.length !== panels.length) return true;
    for (let i = 0; i < panels.length; i++) {
      const item = <QuestionPanelDynamicItem>panels[i].data;
      if (!(item instanceof QuestionPanelDynamicItem) || item.builtRecordIndex !== records[i]) return true;
    }
    return false;
  }
  public runTriggers(name: string, value: any, keys?: any): void {
    super.runTriggers(name, value, keys);
    this.visiblePanelsCore.forEach(p => {
      (<DynamicItemModelBase>p.data).runTriggers(name, value, keys);
    });
  }
  private reRunCondition() {
    if (!this.data) return;
    this.runCondition(this.getDataFilteredProperties());
  }
  protected runPanelsCondition(panels: PanelModel[], properties: HashTable<any>): void {
    const prevIsValueChangingInternally = this.isValueChangingInternally;
    this.isValueChangingInternally = true;
    /* Every paging sync and page render requested during the run - by the "visible" handler, which
       fires inside panel.runCondition(), by the call below, by anything a condition reaches - collapses
       into one after the loop. A re-entrant run leaves it to the outer one. */
    const prevIsPagingSyncSuspended = this.isPagingSyncSuspended;
    this.isPagingSyncSuspended = true;
    const isPanelsCore = panels === this.panelsCore;
    let visibleIndex = 0;
    try {
      for (var i = 0; i < panels.length; i++) {
        const panel = panels[i];
        const panelName = settings.expressionVariables.panel;
        const newProps = Helpers.createCopy(properties);
        newProps[panelName] = panel;
        panel.runCondition(newProps);
        // The owner-visibility layer of the list: visiblePanels stays incrementally maintained by the
        // "visible" property-changed handler, this only keeps the list flags in step with it.
        this.setPanelRecordVisible(panel, isPanelsCore ? i : undefined);
        if (panel.isVisible) {
          visibleIndex++;
        }
      }
    } finally {
      this.isPagingSyncSuspended = prevIsPagingSyncSuspended;
    }
    this.isValueChangingInternally = prevIsValueChangingInternally;
    if (!this.isPagingSyncSuspended) {
      this.runDeferredPagingSync();
    }
  }
  private isPagingSyncSuspended: boolean;
  private isPagingSyncPending: boolean;
  private isRenderedPanelsUpdatePending: boolean;
  private runDeferredPagingSync(): void {
    const syncPaging = this.isPagingSyncPending;
    const render = this.isRenderedPanelsUpdatePending;
    this.isPagingSyncPending = false;
    this.isRenderedPanelsUpdatePending = false;
    if (syncPaging && !!this.dataListValue) {
      this.paging.syncState();
    }
    // One render for both requests: the paging sync renders the page only when paging is active.
    if ((render || syncPaging && !!this.dataListValue && this.isPagingActive) && !this.isUpdatingRenderedPanels) {
      this.updateRenderedPanels();
    }
  }
  // The render a panel that appeared or disappeared asks for; deferred while conditions run.
  private requestRenderedPanelsUpdate(): void {
    if (this.isPagingSyncSuspended) {
      this.isRenderedPanelsUpdatePending = true;
      return;
    }
    this.updateRenderedPanels();
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
  // The on-value-change check: a key typed on this page that repeats the key of a record without a
  // panel - off the page, or filtered out - is a duplicate too.
  private hasKeysDuplicated(context: ValidationContext): boolean {
    var keyValues: Array<any> = this.getKeyValuesWithoutPanels();
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
      /* A question that pages validates the page that exists - Complete included - and then what the
         page cannot show: the edited records on other pages (layer 2) and a key pair both of whose
         records are off the page. Either moves to the page that holds the error. */
      if (res && this.isPagedInMemory && context.fireCallback && !context.isOnValueChanged) {
        res = this.pageValidation.validateEditedRecords(context, this.getOffPageKeyDuplicatePages());
      }
    }
    return super.validateElementCore(context) && res;
  }
  /* The keys of the records are scanned without an object (O(records)) with the membership the
     question has without paging: an owner-hidden record does not take part, a filtered-out one does
     but never receives the error. The error goes on the later visible record of a pair, on its page.
     Returns the pages to visit; layer 2 walks them together with its own. The groups are a Map: the
     keys are respondent input, and "__proto__" in a plain object is the prototype, not a group. */
  private getOffPageKeyDuplicatePages(): Array<number> {
    const pages: Array<number> = [];
    if (!this.keyName) return pages;
    const list = this.dataList;
    const visiblePos: { [index: number]: number } = {};
    list.getVisibleIndexes().forEach((index: number, pos: number): void => { visiblePos[index] = pos; });
    const groups = new Map<string, { count: number, target: number }>();
    for (let i = 0; i < list.loadedCount; i++) {
      if (!list.isRecordVisible(i)) continue;
      const val = list.getValue(i, this.keyName);
      if (this.isValueEmpty(val)) continue;
      const key = String(val);
      let group = groups.get(key);
      if (!group) {
        group = { count: 0, target: -1 };
        groups.set(key, group);
      }
      group.count++;
      const pos = visiblePos[i];
      if (pos !== undefined && pos > group.target) group.target = pos;
    }
    groups.forEach((group: { count: number, target: number }): void => {
      if (group.count < 2 || group.target < 0) return;
      const page = this.paging.getPageOfVisibleIndex(group.target);
      if (pages.indexOf(page) < 0) pages.push(page);
    });
    return pages;
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
    return super.getIsRunningValidators() || this.isRunningValidatorsInPanels();
  }
  private isRunningValidatorsInPanels(): boolean {
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
    /* i is a record index: values is the stored value, in record order. A record the page shows reads
       its display values from its panel's questions; under paging a record without a panel reads them
       through the template's questions (Andrew's decision 2026-09-25, OPEN 57). This is a live path -
       text piping and displayValue() call it - so nothing is built for it. */
    const positions = this.hasDataListView ? this.getMaterializedPositions() : undefined;
    const useTemplate = this.isPagingActive;
    for (var i = 0; i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      const position = !!positions ? (positions[i] !== undefined ? positions[i] : -1) : i;
      if (position > -1 && position < this.panelsCore.length) {
        values[i] = this.getPanelDisplayValue(position, i, val, keysAsText);
      } else if (useTemplate) {
        values[i] = this.getRecordDisplayValue(i, val, keysAsText);
      }
    }
    return values;
  }
  // record index -> position in panelsCore, for the records that have a panel.
  private getMaterializedPositions(): { [index: number]: number } {
    const res: { [index: number]: number } = {};
    this.dataList.getMaterializedIndexes().forEach((index: number, pos: number): void => { res[index] = pos; });
    return res;
  }
  /* The same text the panel would give when the choices do not depend on the panel: the template
     question formats the value. Choices that depend on {panel.x}, and a choicesByUrl whose answer is
     not in the ChoicesRestful cache yet, give the raw value - reading here never starts a request. */
  private getRecordDisplayValue(recordIndex: number, val: any, keysAsText: boolean): any {
    const keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let question = <Question>this.template.getQuestionByValueName(key);
      if (!question) {
        question = this.getSharedQuestionFromArray(key, recordIndex);
      }
      if (!question) continue;
      const qValue = question.getDisplayValue(keysAsText, val[key]);
      val[key] = qValue;
      if (keysAsText && !!question.title && question.title !== key) {
        val[question.title] = qValue;
        delete val[key];
      }
    }
    return val;
  }

  private getPanelDisplayValue(
    panelIndex: number,
    recordIndex: number,
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
        question = this.getSharedQuestionFromArray(key, recordIndex);
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
    // The keyName duplicates are looked for among the RECORDS: a panel that repeats the key of a
    // record with no panel is still a duplicate. A pair that is entirely outside the view reports
    // nothing - it cannot be shown.
    const keyValues: Array<any> = this.getKeyValuesWithoutPanels();
    for (let i = 0; i < panels.length; i++) {
      let isPnlValid = panels[i].validateElement(context);
      isPnlValid = !this.isValueDuplicated(panels[i], keyValues, context) && isPnlValid;
      if (!this.isRenderModeList && !isPnlValid && res && context.focusOnFirstError) {
        // i is a pageVisibleIndex; currentIndex is a visibleIndex.
        this.moveToVisibleIndex(this.pageStartVisibleIndex + i);
      }
      res = isPnlValid && res;
    }
    return res;
  }
  private getKeyValuesWithoutPanels(): Array<any> {
    const res: Array<any> = [];
    if (!this.keyName || !this.hasDataListView) return res;
    const list = this.dataList;
    const positions = this.getMaterializedPositions();
    // The records that are loaded: a duplicate on a page the question has not read is the server's
    // business, and a key constraint over a whole remote table cannot be checked here. An owner-hidden
    // record does not take part, as it does not without paging, where its hidden panel is skipped.
    for (let i = 0; i < list.loadedCount; i++) {
      if (positions[i] !== undefined || !list.isRecordVisible(i)) continue;
      const val = list.getValue(i, this.keyName);
      if (!this.isValueEmpty(val)) {
        res.push(val);
      }
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
  private removePanelActions: {[index: number]: Action} = { };
  public getRemovePanelAction(panel: PanelModel) {
    if (!panel) return undefined;
    if (!this.removePanelActions[panel.uniqueId]) {
      const action = new Action({
        id: `remove-panel-${panel.id}`,
        locTitle: this.locRemovePanelText,
        innerCss: this.getPanelRemoveButtonCss(),
        appearance: { style: "alert", mode: "secondary", size: "small" },
        action: () => {
          if (!this.isInputReadOnly) {
            this.removePanelUI(panel);
            if (panel.isDisposed) {
              delete this.removePanelActions[panel.uniqueId];
            }
          }
        },
        visible: <any>new ComputedUpdater(() => [this.canRenderRemovePanel(panel)].every((val: boolean) => val === true)),
        enabled: <any>new ComputedUpdater(() => this.enableRemovePanel !== false),
        data: { question: this, panel: panel }
      });
      action.cssClasses = this.survey.getCss().actionBar || defaultActionBarCss;
      this.removePanelActions[panel.uniqueId] = action;
    }
    return this.removePanelActions[panel.uniqueId];
  }
  public getPanelActions(panel: PanelModel): Array<IAction> {
    let actions = panel.footerActions;
    if (this.removePanelButtonLocation !== "right") {
      actions.push(this.getRemovePanelAction(panel));
    }
    if (!!this.survey) {
      actions = this.titleSettings.getUpdatedPanelFooterActions(panel, actions, this);
    }
    return actions;
  }
  public canRenderRemovePanelOnRight(panel: PanelModel): boolean {
    return this.canRenderRemovePanel(panel, "right");
  }
  private canRenderRemovePanel(panel: PanelModel, side?: string): boolean {
    const canRemove = this.canRemovePanel;
    const notCollpased = panel.state !== "collapsed";
    return (side !== undefined ? this.removePanelButtonLocation === side : true) && canRemove && notCollpased;
  }
  protected createNewPanel(): PanelModel {
    var panel = this.createAndSetupNewPanelObject();
    var json = this.template.toJSON();
    /* Under paging a record's visibility is decided over the record (updateRecordsVisibility) and a
       hidden record gets no panel, so the panel does not run templateVisibleIf a second time: it takes
       its visibility from that evaluation and the two cannot disagree. */
    if (this.isPagingActive) {
      delete json.visibleIf;
    }
    new JsonObject().toObject(json, panel);
    panel.renderWidth = "100%";
    panel.updateCustomWidgets();
    panel.questions.forEach(q => q.setParentQuestion(this));
    /* Attached one by one, in element order, every question would run its conditions before the
       questions after it have their values: an expression reading {panel.x} computes a wrong value,
       writes it, and the survey writes the right one back after the build. Every batch that creates
       panels runs inside prepareValueForPanelCreating; setValueAfterPanelsCreating runs the conditions
       of its panels once, over all the values (runLightBuiltPanelsConditions). */
    const isLight = this.isAddingNewPanels && !this.isDesignMode && !!this.data;
    const item = new QuestionPanelDynamicItem(this, panel, isLight);
    if (isLight) {
      this.lightBuiltPanels.push(panel);
    }
    item.builtRecordIndex = this.getRecordIndexByPanelIndex(this.panelsCore.length);
    panel.onGetFooterActionsCallback = () => {
      return this.getPanelActions(panel);
    };
    panel.onGetFooterToolbarCssCallback = () => { return this.cssClasses.panelFooter; };
    panel.registerPropertyChangedHandlers(["visible"], () => {
      if (panel.visible)this.onPanelAdded(panel);
      else this.onPanelRemoved(panel);
      this.setPanelRecordVisible(panel);
      this.updateFooterActions();
    });
    return panel;
  }
  // The list flag follows panel.visible - the same flag visiblePanels is built from - so that
  // dataList.visibleCount and visiblePanelCount can never disagree.
  // position: the panel's position in panelsCore when the caller knows it.
  private setPanelRecordVisible(panel: PanelModel, position?: number): void {
    // Under paging the records decide the flags, and a panel is never hidden.
    if (this.isPagingActive) return;
    if (position === undefined) {
      position = this.panelsCore.indexOf(panel);
    }
    if (position < 0) return;
    const index = this.getRecordIndexByPanelIndex(position);
    if (index < 0) return;
    if (!this.dataList.setRecordVisible(index, panel.visible)) return;
    // A hidden panel takes no page slot: the page count follows panel visibility, and the list does
    // not announce it.
    this.syncPagingState();
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
    if (this.isValidatingExpressions || this.isValueChangingInternally || this.useTemplatePanel) return;
    // The count of a remote-backed question comes from the read, never from the length of the window.
    if (this.isRemoteData) return;
    var newPanelCount = this.dataList.count;
    if (newPanelCount == 0 && this.getPropertyValue("panelCount") > 0) {
      newPanelCount = this.getPropertyValue("panelCount");
    }
    /* A question with a view builds its panels for its records - under paging there is no panel
       without one - so an assignment that empties the value empties the question: the panels a
       question without a view keeps for the stored panelCount would need records nobody assigned,
       and writing them would put answers into survey.data that were never given. The one rule kept
       is minPanelCount. The records are written through the list, which guards itself against the
       write coming back here; under the flag below setQuestionValue would drop it. */
    if (this.hasDataListView && this.hasPanelBuildFirstTime) {
      if (this.dataList.count < this.minPanelCount) {
        this.panelCount = this.minPanelCount;
      } else if (this.isPageStale()) {
        this.rebuildPanelsFromDataList();
      }
      return;
    }
    this.settingPanelCountBasedOnValue = true;
    this.panelCount = newPanelCount;
    this.settingPanelCountBasedOnValue = false;
  }
  /* The records were assigned from outside the list (survey.data, a trigger, a sibling with the same
     valueName). The edited set follows the records it names across the insert, remove or move the
     assignment made (DynamicDataPageValidation.onRecordsReplaced), and a move that waits for its
     validators is dropped. The panels of the page are rebuilt when the page names other records now. */
  private onRecordsReplaced(oldRecords: any): void {
    if (!!this.pageValidationValue) {
      this.pageValidationValue.cancelPendingMove();
      const newRecords = this.getPropertyValueWithoutDefault("value");
      this.pageValidationValue.onRecordsReplaced(Array.isArray(oldRecords) ? oldRecords : [], Array.isArray(newRecords) ? newRecords : []);
    }
    if (this.isPageStale()) {
      this.rebuildPanelsFromDataList();
    }
  }
  public setQuestionValue(newValue: any): void {
    if (this.isValidatingExpressions || this.settingPanelCountBasedOnValue) return;
    const created = this.getCreatedIndexesSnapshot();
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly).
    const oldValue = this.getPropertyValueWithoutDefault("value");
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : oldValue;
    const isFromOutside = !!this.dataListValue && !this.dataListValue.isWriting;
    super.setQuestionValue(newValue, false);
    this.invalidateDataListViews();
    this.rebuildPanelsIfViewChanged(created);
    if (isFromOutside && this.isPagedInMemory) {
      this.onRecordsReplaced(oldRecords);
    }
    this.setPanelCountBasedOnValue();
    // Do not force-refresh nested panel questions while a child question updates panel data.
    // It may recreate nested dynamic questions (for example, matrixdynamic) from persisted
    // value and drop transient UI-only state, such as an added trailing empty row.
    if (!this.isSettingPanelItemData()) {
      for (var i = 0; i < this.panelsCore.length; i++) {
        if (this.isPanelRecordChanged(i, oldRecords)) {
          this.panelUpdateValueFromSurvey(i);
        }
      }
    }
    this.updateIsAnswered();
  }
  /* A question bound to the same value receives the whole array on every write one of its siblings
     makes to a single record field - and the survey hands it its own copy (updateValueFromSurvey
     unbinds the value), so the previous value is a snapshot nothing has written into. A panel whose
     record is a different, strictly equal object is already showing it and is not refreshed: with
     every write refreshing every panel of every sibling, loading N records cost O(N^2).
     The same record object may have been changed in place, and a previous value that is not an
     array says nothing about the panels: those panels are refreshed. index is a created position,
     oldRecords a copy of the previous value array. */
  private isPanelRecordChanged(index: number, oldRecords: any): boolean {
    const newRecords = this.getPropertyValueWithoutDefault("value");
    if (!Array.isArray(oldRecords) || !Array.isArray(newRecords) || this.isRemoteData) return true;
    const recordIndex = this.getRecordIndexByPanelIndex(index);
    const oldRecord = oldRecords[recordIndex];
    const newRecord = newRecords[recordIndex];
    if (oldRecord === newRecord && oldRecord !== undefined) return true;
    return DynamicDataList.isValueChanged(newRecord, oldRecord);
  }

  private isSettingPanelItemData(): boolean {
    for (const key in this.isSetPanelItemData) {
      if (this.isSetPanelItemData[key] > 0) return true;
    }
    return false;
  }
  public onSurveyValueChanged(newValue: any): void {
    if (newValue === undefined && this.isAllPanelsEmpty()) return;
    super.onSurveyValueChanged(newValue);
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.panelSurveyValueChanged(i);
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
  /* index is a created position. The loops that call these two know it: getItemData(panel.data)
     looks it up in a new items array - for every panel, on every write of the value. */
  private panelUpdateValueFromSurvey(index: number) {
    const questions = this.panelsCore[index].questions;
    var values = this.getPanelItemDataByIndex(index);
    for (var i = 0; i < questions.length; i++) {
      const q = questions[i];
      q.updateValueFromSurvey(values[q.getValueName()]);
      q.updateCommentFromSurvey(
        values[q.getValueName() + settings.commentSuffix]
      );
      q.initDataUI();
    }
  }
  private panelSurveyValueChanged(index: number) {
    var questions = this.panelsCore[index].questions;
    var values = this.getPanelItemDataByIndex(index);
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
  getItemIndex(item: ISurveyData): number {
    var res = this.items.indexOf(item);
    return res > -1 ? res : this.items.length;
  }
  getItemRecordIndex(item: ISurveyData): number {
    const items = this.items;
    const position = items.indexOf(item);
    // A panel that is being created is about to take the position at the end: the record it names is
    // the one updateItemValue writes and getPanelItemDataByIndex reads for it, not the record count.
    return this.getRecordIndexByPanelIndex(position < 0 ? items.length : position);
  }
  getItemByRecordIndex(recordIndex: number): DynamicItemModelBase {
    const position = this.hasDataListView ? this.dataList.indexToMaterializedIndex(recordIndex) : recordIndex;
    if (position < 0 || position >= this.panelsCore.length) return undefined;
    return <DynamicItemModelBase>this.panelsCore[position].data;
  }
  getItemData(item: ISurveyData): any {
    return this.getPanelItemDataByIndex(this.items.indexOf(item));
  }
  getBindedQuestions(): Array<IQuestion> {
    if (!this.survey || !this.valueName) return [];
    return this.survey.getQuestionsByValueName(this.valueName);
  }
  /* index is a CREATED position, the counterpart of getItemIndex. It used to index visiblePanels,
     which disagreed with getItemIndex whenever a panel was hidden by templateVisibleIf - the pair is
     what a bound question was addressed through. */
  getItem(index: number): DynamicItemModelBase {
    const panel = this.panelsCore[index] || undefined;
    return <DynamicItemModelBase>panel?.data;
  }
  // index is a created position: the position in panelsCore.
  private getPanelItemDataByIndex(index: number): any {
    /* The index correction is about items, not about the data: a question in a panel that is being
       created writes its default value, and reads its own, before the panel reaches panelsCore. The
       position it is about to take is the one at the end. */
    if (index < 0) {
      const items = this.items;
      const created = this.hasDataListView ? this.dataList.getMaterializedIndexes().length : this.dataList.count;
      if (created <= items.length) return {};
      index = items.length;
    }
    const recordIndex = this.getRecordIndexByPanelIndex(index);
    if (recordIndex < 0) return {};
    const record = this.dataList.getRecord(recordIndex);
    return record !== undefined ? record : {};
  }
  private isSetPanelItemData: HashTable<number> = {};
  updateItemValue(item: ISurveyData, name: string, val: any, isDeletingValue: boolean): void {
    if (this.isValidatingExpressions || item === this.template.data) return;
    if (this.isSetPanelItemData[name] > this.maxCheckCount)
      return;
    if (!this.isSetPanelItemData[name]) {
      this.isSetPanelItemData[name] = 0;
    }
    this.isSetPanelItemData[name]++;
    var items = this.items;
    var index = items.indexOf(item);
    if (index < 0) index = items.length;
    // index is a created position; the record it writes is the one that panel holds, or the next
    // record for a panel that does not exist yet.
    const recordIndex = this.getRecordIndexByPanelIndex(index);
    if (recordIndex < 0) return;
    if (index >= 0 && index < this.panelsCore.length) {
      if (!Array.isArray(this.changingValueQuestions)) {
        this.changingValueQuestions = [];
      }
      let qName = name;
      const suffix = settings.commentSuffix;
      if (qName.endsWith(suffix)) {
        qName = qName.substring(0, qName.length - suffix.length);
      }
      const q = this.panelsCore[index].getQuestionByValueName(qName);
      if (!!q) {
        this.changingValueQuestions.push(q);
      }
    }
    // The list deletes the key for an empty value; the emptiness rule (a whitespace-only string is
    // empty) is the question rule, so it is applied here.
    const newValue = this.isValueEmpty(val) ? undefined : val;
    this.dataList.batch((): void => {
      // The padding is a question rule as well: a write to a panel whose record does not exist yet
      // grows the value up to the panel count. A remote window is never padded - the records it does
      // not hold are on the server, and ensureCount would insert them there.
      if (!this.isRemoteData) {
        this.dataList.ensureCount(Math.max(recordIndex + 1, items.length));
      }
      this.dataList.setValue(recordIndex, name, newValue);
    });
    this.changingValueQuestions = null;
    this.isSetPanelItemData[name]--;
    if (this.isSetPanelItemData[name] - 1) {
      delete this.isSetPanelItemData[name];
    }
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
            getString: (val: any) => this.getValueAsString(val),
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
    return new CssClassBuilder().append(super.getRootCss()).append(this.cssClasses.empty, this.getShowNoEntriesPlaceholder())
      .append(this.cssClasses.navigation + "--top", this.isRangeShowing && this.isProgressTopShowing).append(this.cssClasses.navigation + "--bottom", this.isRangeShowing && this.isProgressBottomShowing).toString();
  }
  public get cssHeader(): string {
    const showTab = this.isRenderModeTab && !!this.visiblePanelCount;
    return new CssClassBuilder()
      .append(super.getCssHeader(this.cssClasses))
      .append(this.cssClasses.root + "__header-" + this.displayMode, this.displayMode !== "tab")
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
  /**
   * A text displayed when Dynamic Panel contains no entries.
   */
  public get noEntriesText(): string {
    return this.getLocStringText(this.locNoEntriesText);
  }
  public set noEntriesText(val: string) {
    this.setLocStringText(this.locNoEntriesText, val);
  }
  public get locNoEntriesText(): LocalizableString {
    return this.getOrCreateLocStr("noEntriesText", false, this.getNoEntriesLocalizationName());
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
      this.updateTabbedMenuItems();
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
  public get addPanelAction(): Action {
    return this.footerToolbar.getActionById("sv-pd-add-btn");
  }
  private initFooterToolbar() {
    this.footerToolbarValue = this.createActionContainer();
    this.footerToolbarValue.setActionsAppearance({ style: "brand", mode: "secondary", size: "small" });
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
    const progressText = new Action({
      id: "sv-pd-progress-text",
      component: "sv-paneldynamic-progress-text",
      data: { question: this }
    });
    const addBtn = new Action({
      id: "sv-pd-add-btn",
      enabled: <any>new ComputedUpdater(() => this.enableAddPanel !== false),
      action: () => {
        this.addPanelUI();
      },
      locTitle: this.locAddPanelText,
      innerCss: this.getAddButtonCss()
    });
    items.push(prevTextBtn, nextTextBtn, addBtn, progressText);
    this.updateFooterActionsCallback = () => {
      const isRenderModeList = this.isRenderModeList;
      const isMobile = this.isMobile;
      const showNavigation = !isRenderModeList;
      prevTextBtn.visible = showNavigation && this.currentIndex > 0;
      nextTextBtn.visible = showNavigation && this.currentIndex < this.visiblePanelCount - 1;
      nextTextBtn.needSpace = isMobile && nextTextBtn.visible && prevTextBtn.visible;
      addBtn.visible = this.canAddPanel;
      addBtn.needSpace = this.isMobile && !nextTextBtn.visible && prevTextBtn.visible;
      progressText.visible = !this.isRenderModeList && !isMobile && !this.getShowNoEntriesPlaceholder();
      progressText.needSpace = !this.isMobile;
    };
    this.updateFooterActionsCallback();
    this.footerToolbarValue.setItems(items);
    this.footerToolbar.flushUpdates();
    this._showFooterToolbar = new ComputedUpdater<boolean>(() => this.footerToolbarValue?.hasVisibleActions) as any as boolean;
  }
  /* One tab per panel of the page. Nothing positional is captured: the title event gets the tab's
     visibleIndex at the time the title is asked for, "active" is computed from currentPanel, and a
     click maps the panel to its pageVisibleIndex and then to its visibleIndex - an insert in front of
     the tab or a page other than the first cannot make any of them stale. */
  private createTabByPanel(panel: PanelModel): PanelDynamicTabbedMenuItem {
    const locTitle = new LocalizableString(panel, true);
    locTitle.onGetTextCallback = (str: string): string => {
      if (!str) {
        str = this.locTabTitlePlaceholder.renderedHtml;
      }
      if (!this.survey) return str;
      const options = {
        title: str,
        panel: panel,
        visiblePanelIndex: this.getPanelVisibleIndex(panel)
      };
      this.dynamicPanelCallbacks.dynamicPanelGetTabTitle(this, options);
      return options.title;
    };
    locTitle.sharedData = this.locTemplateTabTitle;
    const panelId = panel.id;
    const isActive = (): boolean => this.getPropertyValue("currentPanelId") === panelId;
    const newItem = new PanelDynamicTabbedMenuItem({
      id: `${this.id}_tab_${panelId}`,
      panelId: panelId,
      active: <any>new ComputedUpdater<boolean>(isActive),
      locTitle: locTitle,
      disableHide: <any>new ComputedUpdater<boolean>(isActive),
      action: () => {
        const pos = this.visiblePanelsCore.indexOf(panel);
        if (pos > -1) {
          this.currentIndex = this.pageStartVisibleIndex + pos;
        }
      }
    });
    return newItem;
  }
  // The panel's visibleIndex: its position among the visible records of the whole list.
  private getPanelVisibleIndex(panel: PanelModel): number {
    const pos = this.visiblePanelsCore.indexOf(panel);
    return pos < 0 ? -1 : this.pageStartVisibleIndex + pos;
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
  /* The tab bar is derived from the page (Andrew's decision 2026-09-25): its actions are the current
     page's visiblePanels, in order, computed from that one source whenever it changes. An action is
     reused for the same panel, so that the adaptive overflow is not reset needlessly. A rebuild
     derives it once, at its end. */
  private tabActions: { [panelId: string]: PanelDynamicTabbedMenuItem } = {};
  private updateTabbedMenuItems(): void {
    if (!this.tabbedMenuValue || this.isRebuildingPanels) return;
    if (!this.isRenderModeTab) {
      this.tabActions = {};
      if (this.tabbedMenuValue.actions.length > 0)this.tabbedMenuValue.setItems([]);
      return;
    }
    const actions: { [panelId: string]: PanelDynamicTabbedMenuItem } = {};
    const items = this.visiblePanelsCore.map((panel: PanelModel): PanelDynamicTabbedMenuItem => {
      const action = this.tabActions[panel.id] || this.createTabByPanel(panel);
      actions[panel.id] = action;
      return action;
    });
    this.tabActions = actions;
    const current = this.tabbedMenuValue.actions;
    if (current.length === items.length && current.every((a: Action, i: number): boolean => a === items[i])) return;
    this.tabbedMenuValue.setItems(items);
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
    }
    return classes;
  }
  protected onMobileChanged(): void {
    super.onMobileChanged();
    this.updateFooterActions();
  }
  public ensureRowsVisibility(): void {
    this.visiblePanels.forEach(panel => panel.ensureRowsVisibility());
  }
}

export class PanelDynamicSingleInputBehavior extends QuestionSingleInputBehavior {
  protected get panelDynamic(): QuestionPanelDynamicModel {
    return this.question as QuestionPanelDynamicModel;
  }
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    this.panelDynamic.onFirstRendering();
    this.panelDynamic.syncPageSizeWithMode();
    const res = new Array<Question>();
    const panels = this.panelDynamic.visiblePanels;
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
  public fillSingleInputQuestionsInContainer(res: Array<Question>, innerQuestion: Question): void {
    const panel = this.getPanelByQuestion(innerQuestion);
    this.fillSingleInputQuestionsByPanel(res, panel);
  }
  private fillSingleInputQuestionsByPanel(res: Array<Question>, panel: PanelModel): void {
    if (panel) {
      panel.visibleQuestions.forEach(q => q.addNestedQuestion(res, true, false, false));
    }
  }
  protected getSingleQuestionLocTitleCore(): LocalizableString {
    const res = this.panelDynamic.locTemplateTitle;
    res.onGetTextCallback = (text: string): string => {
      const q = this.panelDynamic.singleInputQuestion;
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
    return this.panelDynamic.getLocalizationString("panelDynamicTabTextFormat");
  }
  private getPanelByQuestion(question: Question): PanelModel {
    let parent = question.parent;
    while(!!parent && !!parent.parent) {
      parent = parent.parent;
    }
    return <PanelModel>parent;
  }
  public getSingleInputAddTextCore(): string {
    if (!this.panelDynamic.canAddPanel) return undefined;
    return this.panelDynamic.addPanelText;
  }
  public singleInputAddItemCore(): void {
    this.panelDynamic.addPanelUI();
  }
  protected getSingleQuestionOnChange(index: number): Question {
    const panels = this.panelDynamic.visiblePanels;
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
    const pd = this.panelDynamic;
    pd.syncPageSizeWithMode();
    const res = new QuestionSingleInputSummary(pd, pd.locNoEntriesText);
    const items = new Array<QuestionSingleInputSummaryItem>();
    pd.visiblePanels.forEach((panel) => {
      const locText = new LocalizableString(pd, true, undefined, pd.locTemplateTitle.localizationName);
      locText.setJson(pd.locTemplateTitle.getJson());
      locText.onGetTextCallback = (text: string): string => {
        return this.processSingleInputTitle(pd.templateTitle, panel);
      };
      const bntEdit = new Action({ locTitle: pd.locEditPanelText, action: () => { this.singInputEditPanel(panel); } });
      const btnRemove = pd.canRemovePanel ? new Action({ locTitle: pd.locRemovePanelText, action: () => { pd.removePanelUI(panel); } }) : undefined;
      items.push(new QuestionSingleInputSummaryItem(locText, bntEdit, btnRemove));
    });
    res.items = items;
    return res;
  }
  protected singleInputMoveToFirstCore(): void {
    let panel = this.panelDynamic.singleInputQuestion?.parent;
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
}

Serializer.addClass(
  "paneldynamic",
  [
    { name: "showCommentArea:switch", visible: true },
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
    { name: "noEntriesText:text", serializationProperty: "locNoEntriesText" },
    { name: "allowAddPanel:boolean", default: true },
    { name: "allowRemovePanel:boolean", default: true },
    { name: "newPanelPosition", choices: ["next", "last"], default: "last" },
    {
      name: "panelCount:number",
      isBindable: true,
      default: 0,
      choices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      onSettingValue: (obj: any, val: any): any => {
        if (val < obj.minPanelCount) return obj.minPanelCount;
        if (val > obj.maxPanelCount) return obj.maxPanelCount;
        return val;
      },
    },
    "panelCountExpression:expression",
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
    /* Invisible in the property grid until the UI series ships a pager: the property loads from and
       saves to JSON, but a switch that renders nothing is a support ticket. */
    { name: "panelsPerPage:number", default: 0, minValue: 0, visible: false },
    { name: "sortBy", default: "", visible: false },
    { name: "filterExpression", default: "", visible: false },
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
    { name: "templateVisibleIf:expression" },
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