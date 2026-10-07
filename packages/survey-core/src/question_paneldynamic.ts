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
import { Question, IConditionObject, IQuestionPlainData, ValidationContext, QuestionValueType, IVerifyDataContext } from "./question";
import { PanelModel } from "./panel";
import { JsonObject, Serializer } from "./jsonobject";
import { property, propertyArray } from "./decorators";
import { QuestionFactory } from "./questionfactory";
import { KeyDuplicationError } from "./error";
import { settings } from "./settings";
import { classesToSelector } from "./utils/dom-utils";
import { cleanHtmlElementAfterAnimation, prepareElementForVerticalAnimation, setPropertiesOnElementForAnimation } from "./utils/animation-dom";
import { confirmActionAsync } from "./utils/confirm-dialog";
import { toCssClasses } from "./utils/cssClassBuilder";
import { ActionContainer } from "./actions/container";
import { defaultActionBarCss } from "./actions/actionBarCss";
import { Action, IAction } from "./actions/action";
import { ComputedUpdater } from "./base";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { ITheme } from "./themes";
import { AnimationGroup, AnimationProperty, AnimationTab, IAnimationConsumer, IAnimationGroupConsumer } from "./utils/animation";
import { getScrollBehavior } from "./utils/reduced-motion";
import { QuestionSingleInputSummary } from "./questionSingleInputSummary";
import { getLocaleString } from "./surveyStrings";
import { IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo } from "./conditions/conditionProcessValue";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { IDynamicDataField, IDynamicDataSource } from "./dynamic-data/dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { getDuplicateKey } from "./dynamic-data/dynamic-data-page-validation";
import {
  QuestionRecordItemGetterContext, QuestionRecordItem, QuestionRecordsValueGetterContext, IDynamicDataRecordUniqueness, QuestionRecordsModel,
  QuestionRecordsSingleInputBehavior, IRecordTarget
} from "./question_records";

export class PanelDynamicItemGetterContext extends QuestionRecordItemGetterContext {
  protected getNextName(): string {
    return settings.expressionVariables.nextPanel;
  }
  protected getPrevName(): string {
    return settings.expressionVariables.prevPanel;
  }
  protected getSpecificValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length > 1 && path[0].name.toLocaleLowerCase() === settings.expressionVariables.parentPanel.toLocaleLowerCase()) {
      const q = this.item.data;
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
      return this.getRecordNumber();
    }
    if (name == this.visIndexVar) {
      return this.visibleIndex;
    }
    return undefined;
  }
}

export class PanelDynamicValueGetterContext extends QuestionRecordsValueGetterContext {
  // An empty path goes on to the record the index names.
  protected hasDesignValue(params: IValueGetterContextGetValueParams): boolean {
    return params.path.length > 0;
  }
  // A template question answers the rest of the path.
  protected getDesignValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    const q = (<QuestionPanelDynamicModel>this.question).template.getQuestionByName(path[0].name);
    if (!q) return { isFound: false };
    path.shift();
    return path.length === 0 ? { isFound: true } : q.getValueGetterContext().getValue(params);
  }
}

// What a removal acts on (QuestionPanelDynamicModel.resolvePanelTarget): a panel, or a record without one.
interface IPanelDynamicTabbedMenuItem extends IAction {
  panelId: string;
}
class PanelDynamicTabbedMenuItem extends Action {
  public panelId: string;
  constructor(innerItem: IPanelDynamicTabbedMenuItem) {
    super(innerItem);
  }
}

export class QuestionPanelDynamicItem extends QuestionRecordItem {
  private panelValue: PanelModel;
  // isLight: the questions are attached without running their conditions; the owner runs them later.
  constructor(public data: QuestionPanelDynamicModel, panel: PanelModel, isLight?: boolean) {
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
  // The panel's position among the visible records of the whole list ({visiblePanelIndex} - 1).
  public get visibleIndex(): number {
    return !!this.data ? this.data.getItemVisibleIndex(this) : -1;
  }
  // The panel's position in visiblePanels: the page it is on, when the question pages.
  public get pageVisibleIndex(): number {
    const panels = !!this.data ? this.data.visiblePanels : undefined;
    return Array.isArray(panels) ? panels.indexOf(this.panel) : -1;
  }

  public get questions(): Array<Question> {
    return this.panel.questions;
  }
  public getComment(name: string): string {
    var result = this.getValue(name + settings.commentSuffix);
    return result ? result : "";
  }
  protected updateQuestionFromRecord(question: Question, record: any): void {
    super.updateQuestionFromRecord(question, record);
    question.initDataUI();
  }
  // The panel clears its nested panels' own errors and its own as well.
  public clearErrors(): void {
    this.panel.clearErrors();
  }
}

export class QuestionPanelDynamicTemplateSurveyImpl implements ISurveyImpl {
  constructor(public data: QuestionPanelDynamicModel) { }
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
export class QuestionPanelDynamicModel extends QuestionRecordsModel {
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
    super.dispose();
    this.templateValue.dispose();
  }
  // The panels kept for a later dispose (still animated out) go with the question, before the list.
  protected disposeRecordObjects(): void {
    const left = this.panelsToDispose;
    this.panelsToDispose = [];
    left.forEach((panel: PanelModel): void => { this.disposePanelObject(panel); });
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
    this.syncPageSizeWithSurvey();
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
  getItemVisibleIndex(item: ISurveyData): number {
    if (item instanceof QuestionPanelDynamicItem) return this.getPanelVisibleIndex(item.panel);
    return this.getRecordItemVisibleIndex(item);
  }
  getItemByVisibleIndex(visibleIndex: number): QuestionRecordItem {
    if (visibleIndex < 0) return null;
    const panels = this.visiblePanels;
    const pos = this.getPositionAtVisibleIndex(visibleIndex);
    if (pos >= 0 && pos < panels.length) return <QuestionRecordItem>panels[pos].data;
    return this.getRecordItemByVisibleIndex(visibleIndex);
  }
  // QuestionRecordsModel hook: one record of question.value.
  protected getStoredRecordAt(index: number, defaultRecord?: any): any {
    const val = this.value;
    return Array.isArray(val) && index >= 0 && index < val.length ? val[index] : undefined;
  }
  protected getRecordItemVariableName(): string {
    return settings.expressionVariables.panel;
  }
  protected createRecordItemContext(item: QuestionRecordItem): IValueGetterContext {
    return new PanelDynamicItemGetterContext(item);
  }
  // internal: the item {panel[index].x} reads. index is a record index; a record the page does not
  // show is read as a value.
  public getExpressionItem(index: number): QuestionRecordItem {
    const panels = this.panels;
    if (!this.hasDataListView) return index < panels.length ? <QuestionRecordItem>panels[index].data : null;
    return this.getViewExpressionItem(index);
  }
  // The batched creation overrides (getValueCore/setValueCore) are honoured: the records are read
  // and written through question.value.
  protected getListRecords(): Array<any> {
    return this.value;
  }
  protected setListRecords(records: Array<any>): void {
    this.setOwnRecordsValue(records);
  }
  /* A data source that supplies the panel records (IDynamicDataSource): the question reads them from
     it, a page at a time when it pages, and pushes every edit, insertion and deletion to it. Not
     serialized - a data source is code, not survey JSON. undefined goes back to question.value. */
  public get dataSource(): IDynamicDataSource {
    return this.getDataSource();
  }
  public set dataSource(val: IDynamicDataSource) {
    this.setDataSource(val);
    // The capabilities of the new source decide whether the panels are editable and whether the
    // add/remove buttons are shown.
    this.updatePanelsReadOnly();
    this.updateFooterActions();
  }
  // Reads the data source again (see QuestionRecordsModel.refreshSource).
  public refreshDataSource(): void | Promise<void> {
    return this.refreshSource();
  }
  /* QuestionRecordsModel hook: what a read that commits again renumbers besides the edited set and
     the current record: the paged questions nested in the panels keep their states under the panels'
     records. */
  protected hasKeptRecordIndexes(): boolean {
    return this.hasNestedPagedQuestions(this.panelsCore);
  }
  // The panels' own record indexes move before the rebuild, which keeps the nested states under them.
  protected remapKeptRecordIndexes(remap: (index: number) => number): void {
    this.remapBuiltItems(remap);
  }
  protected getFields(): Array<IDynamicDataField> {
    return this.getFieldsOfQuestions(this.template.questions);
  }
  // QuestionRecordsModel hook: the panels' side of a list change, see
  // QuestionRecordsModel.onDataListChanged.
  protected rebuildFromDataList(isPageMove: boolean): void {
    this.rebuildPanelsFromDataList(isPageMove);
  }
  protected refreshRenderedPage(): void {
    this.updateRenderedPanels();
  }
  protected runRemoteWriteConditions(): void {
    this.reRunCondition();
  }
  protected areObjectsBuilt(): boolean {
    return this.hasPanelBuildFirstTime && !this.useTemplatePanel;
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
  // A sync is deferred while it is suspended, and the rendered panels follow it.
  protected syncPagingState(): void {
    if (!this.dataListValue) return;
    if (this.isPagingSyncSuspended) {
      this.isPagingSyncPending = true;
      return;
    }
    super.syncPagingState();
    /* renderedPanels is a stored array and not a computed one: panels that appeared, disappeared or
       became hidden change which of them are on the page, and the panels are created before the
       value that holds their records is - the update they made then saw no records at all. */
    if (this.isPagingActive && !this.isUpdatingRenderedPanels) {
      this.updateRenderedPanels();
    }
  }
  /* The panels that exist are the page: with paging on, panels and visiblePanels hold
     the current page only, whatever the source, so the page is visiblePanels itself - the same
     instance - and never a slice of it. renderedPanels is what is shown: the page in list mode,
     [currentPanel] in carousel and tab mode. */
  public get panelsOnPage(): Array<PanelModel> {
    return this.visiblePanels;
  }
  // settings.panel.maxPanelCount is the number of panels one page may hold, in every display mode.
  protected get maxRecordsPerPage(): number {
    return settings.panel.maxPanelCount;
  }
  /* The number of panels on one page, 0 = no paging. In list mode the page is what is shown; in tab
     and carousel mode it is the panels of one page, of which one is shown. */
  public get panelsPerPage(): number {
    return this.pageSize;
  }
  public set panelsPerPage(val: number) {
    this.pageSize = val;
  }
  protected getPageSizePropertyName(): string {
    return "panelsPerPage";
  }
  protected onPageSizeAssigned(): void {
    this.updateRenderedPanels();
  }
  /* False while the data source answers a read without a total: panelCount is then the number of
     records known to exist - a lower bound (see isCountKnown). */
  public get isPanelCountKnown(): boolean { return this.isCountKnown; }
  protected validateBuiltPageObjects(context: ValidationContext): boolean {
    return this.validateInPanels(context);
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
    const prevIsRebuildingView = this.isRebuildingView;
    this.isRebuildingView = true;
    try {
      this.runCurrentPanelChange((): void => { this.rebuildPanelsForView(isPageMove); });
    } finally {
      this.isRebuildingView = prevIsRebuildingView;
    }
  }
  // While the panels are rebuilt for the view, the ones added and removed select nothing: restoreCurrentPanel chooses.
  private isRebuildingView: boolean = false;
  private rebuildPanelsForView(isPageMove: boolean): void {
    const list = this.dataList;
    // The page is a slice of the visible records: their visibility is decided before it is cut.
    if (!!this.data) {
      this.updatePagedRecordsVisibility(this.getDataFilteredProperties());
    }
    if (!this.isWritingRecords) {
      this.disposeLeftPanels(this._renderedPanels);
    }
    const currentRecord = isPageMove || !this.getPropertyValue("currentPanel", null) ? -1 : this.getCurrentRecordIndex();
    /* Carousel and tab mode show one record: a rebuild that is not a page move - records replaced, a
       record hidden or shown ahead of it, a sort - keeps showing it, on whatever page it is now. */
    // Its pageChanged notification rebuilds the page that holds the record.
    if (currentRecord > -1 && !this.hasPendingVisibleIndex() && !this.isRenderModeList &&
      this.showPageOfRecord(currentRecord, (visibleIndex: number): void => { this.keepPendingVisibleIndex(visibleIndex); })) return;
    const count = list.getMaterializedIndexes().length;
    const oldPanels: Array<PanelModel> = [].concat(this.panelsCore);
    this.keepNestedPageStates(oldPanels.map((panel: PanelModel): QuestionRecordItem => <QuestionRecordItem>panel.data),
      (item: QuestionRecordItem): Array<Question> => item instanceof QuestionPanelDynamicItem ? item.panel.questions : undefined);
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
  private isRebuildingPanels: boolean;
  /* A panel that is still on screen - the one a carousel animates out, a removed one leaving the
     list - is disposed when its animation ends, not under it. */
  private panelsToDispose: Array<PanelModel> = [];
  private disposePanels(panels: Array<PanelModel>): void {
    /* A rebuild can run from inside a write one of the old panels' questions is making - the record
       it edits leaves the page when its visibility changes - and that question still finishes its
       own setter after the rebuild returns. Its panel is disposed at the next rebuild instead. */
    const isWriting = this.isWritingRecords;
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
  private disposePanelObject(panel: PanelModel): void {
    if (panel.isDisposed) return;
    // A panel that left renderedPanels can still be on screen until the UI rerenders the question.
    this.disposeAfterRerender(panel, (): void => this.disposePanelObjectCore(panel));
  }
  /* The panel was never announced to the survey as added - it is built before it has one - so its
     questions are not announced as removed either: the guard an element moved between pages uses.
     Without it every page visit would fire onQuestionRemoved and recompute the survey's visible
     indexes once per question. */
  private disposePanelObjectCore(panel: PanelModel): void {
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
  /* The current panel follows its record (QuestionRecordsModel keeps it renumbered); when that
     record left the view the first visible panel takes over. A move that crossed a page (Next on the
     last panel of a page, a currentIndex on another page, a Next that read the next window of a data
     source) names the visibleIndex it went to instead; it is taken once, on the rebuild of the page
     that holds it. */
  private restoreCurrentPanelByRecord(recordIndex: number): void {
    this.restoreCurrentPanel(this.takePendingVisibleIndex(), recordIndex);
  }
  // visibleIndex: where a move went, clamped to the page; undefined: the panel of recordIndex.
  private restoreCurrentPanel(visibleIndex: number, recordIndex: number): void {
    if (this.isRenderModeList || this.useTemplatePanel) return;
    let panel: PanelModel = undefined;
    if (visibleIndex !== undefined) {
      panel = this.getVisiblePanelAt(visibleIndex);
    } else {
      const item = recordIndex < 0 ? undefined : <QuestionPanelDynamicItem>this.getItemByRecordIndex(recordIndex);
      panel = !!item ? item.panel : undefined;
    }
    this.setPropertyValue("currentPanel", null);
    this.currentPanel = !!panel && panel.visible ? panel : this.visiblePanelsCore[0];
  }
  private hasNestedPagedQuestions(panels: Array<PanelModel>): boolean {
    return panels.some((panel: PanelModel): boolean => this.hasPagedQuestions(panel.questions));
  }
  private restoreNestedPageStates(): void {
    const panels = this.panelsCore;
    for (let i = 0; i < panels.length; i++) {
      const item = <QuestionPanelDynamicItem>panels[i].data;
      if (!(item instanceof QuestionPanelDynamicItem)) continue;
      this.restorePageStatesOfQuestions(item.builtRecordIndex, panels[i].questions);
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
    return name !== "templateElements" && super.isPropertyStoredInHash(name);
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
  // The panels that exist: under paging the page, and a number of the whole view is not a position in it.
  public get panels(): Array<PanelModel> {
    this.buildPanelsFirstTime(this.canBuildPanels);
    return this.panelsCore;
  }
  /**
   * An array of currently visible panels ([`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model) objects).
   * @see templateVisibleIf
   */
  // The visible panels that exist: under paging the page.
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
    if (!this.isRebuildingView && !this.currentPanel) {
      this.currentPanel = panel;
    }
    this.requestRenderedPanelsUpdate();
  }
  /* Without paging the panel at the removed one's position takes over, clamped to the last. A paged
     removal decides its successor itself (removePanelCore), and a rebuild leaves the choice to
     restoreCurrentPanel. */
  private onPanelRemoved(panel: PanelModel): void {
    let index = this.onPanelRemovedCore(panel);
    if (!this.isRebuildingView && !this.isPagingActive && this.getPropertyValue("currentPanel", null) === panel) {
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
    return this.getPanelVisibleIndex(this.currentPanel);
  }
  /* A move from code: clamped by the visible record count, it moves to the page that holds the
     position and then selects the panel on it. It does not validate, and a move that waits for its
     validators is dropped. */
  public set currentIndex(val: number) {
    if (val < 0 || this.visiblePanelCount < 1) return;
    if (this.isRenderModeList || this.useTemplatePanel) return;
    const end = this.getVisibleNumberEnd(this.visiblePanelCount);
    if (val >= end) val = end - 1;
    this.cancelPendingPageMove();
    this.moveToVisibleIndex(val);
  }
  /* Selects the panel at a visibleIndex: on the page when it is there, otherwise through a page move
     whose rebuild selects it (restoreCurrentPanelByRecord). A data source that pages itself selects
     it when the read of that page commits; a page that could not change selects at once. */
  private moveToVisibleIndex(visibleIndex: number): void {
    this.runCurrentPanelChange((): void => {
      const panel = this.getVisiblePanelAt(visibleIndex);
      if (!this.isPagingActive || !!panel && this.getPanelVisibleIndex(panel) === visibleIndex) {
        this.currentPanel = panel;
        return;
      }
      if (this.showVisibleIndex(visibleIndex)) {
        this.restoreCurrentPanel(visibleIndex, -1);
      }
    });
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
    const visibleIndex = !!val ? this.getPanelVisibleIndex(val) : -1;
    if (!!val && visibleIndex < 0 || val === curPanel) return;
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
    this.setCurrentRecordIndex(!val ? -1 : this.getPanelRecordIndex(val));
    // Inside an operation the change is announced when the operation ends (announceCurrentPanel).
    const isAnnounced = !!val && this.currentPanelChangeDepth === 0;
    if (isAnnounced) {
      this.leftVisibleIndex = this.currentVisibleIndexValue;
      this.currentVisibleIndexValue = visibleIndex;
      this.setAnnouncedRecordIndex(this.getCurrentRecordIndex());
    }
    this.updateRenderedPanels();
    this.updateFooterActions();
    this.fireCallback(this.currentIndexChangedCallback);
    if (isAnnounced) {
      this.raiseCurrentIndexChanged(val, visibleIndex);
    }
  }
  private raiseCurrentIndexChanged(panel: PanelModel, visibleIndex: number): void {
    if (visibleIndex < 0 || !this.survey) return;
    this.dynamicPanelCallbacks.dynamicPanelCurrentIndexChanged(this, { panel: panel, visiblePanelIndex: visibleIndex });
  }
  /* One change, one event. An operation that may change the current panel - a rebuild of the panels for
     the view, a removal, a move - runs here when the question has a view (without one there is no
     rebuild, and the panel setter announces as released). The panels it selects on the way are not
     announced; when the outermost one ends, the current panel is announced once if its record or its
     visible index differs from the ones announced last. A new panel object for the same record at the
     same index announces nothing, and neither does a current panel that is not on the page yet - a read
     of its page is pending, and the rebuild of its commit announces it. */
  private currentPanelChangeDepth: number = 0;
  private runCurrentPanelChange(func: () => void): void {
    if (!this.hasDataListView) {
      func();
      return;
    }
    this.currentPanelChangeDepth++;
    try {
      func();
    } finally {
      this.currentPanelChangeDepth--;
    }
    if (this.currentPanelChangeDepth === 0) {
      this.announceCurrentPanel();
    }
  }
  private announceCurrentPanel(): void {
    if (this.isRenderModeList || this.useTemplatePanel) return;
    const panel = this.getPropertyValue("currentPanel", null);
    const visibleIndex = !!panel ? this.getPanelVisibleIndex(panel) : -1;
    if (visibleIndex < 0) return;
    const recordIndex = this.getCurrentRecordIndex();
    if (recordIndex === this.getAnnouncedRecordIndex() && visibleIndex === this.currentVisibleIndexValue) return;
    this.leftVisibleIndex = this.currentVisibleIndexValue;
    this.currentVisibleIndexValue = visibleIndex;
    this.setAnnouncedRecordIndex(recordIndex);
    this.raiseCurrentIndexChanged(panel, visibleIndex);
  }
  /* The record a panel holds. Under a view it is the record the panel was built for, which
     remapBuiltItems keeps current: a panel selected while another one is spliced out - before the
     list knows about the remove - would name the removed record by its position. Without a view,
     and for a panel built before its record exists, the position names it: an assignment from outside
     builds the new panels while the old ones are still in panelsCore, so their built index counts on
     from the old ones. */
  private getPanelRecordIndex(panel: PanelModel): number {
    const item = <QuestionPanelDynamicItem>panel.data;
    if (this.hasDataListView && item instanceof QuestionPanelDynamicItem && item.builtRecordIndex > -1) return item.builtRecordIndex;
    return this.getRecordIndexByPanelIndex(this.panelsCore.indexOf(panel));
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
    // onFirstRendering runs in between: a flag a throw left set would stop every later paging render.
    this.isUpdatingRenderedPanels = true;
    try {
      if (this.isRenderModeList) {
        panels = [].concat(this.panelsOnPage);
      } else if (this.currentPanel) {
        panels = [this.currentPanel];
      }
      panels.forEach(panel => this.panelOnFirstRendering(panel));
      this.renderedPanels = panels;
    } finally {
      this.isUpdatingRenderedPanels = false;
    }
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
      const leavingPanel = this.renderedPanels.filter(el => el !== this.currentPanel)[0];
      // A panel that is still on the page answers for itself; one a page move took away is the one
      // the current panel replaced; one that was removed is neither.
      const leavingIndex = this.getPanelVisibleIndex(leavingPanel);
      const isRemoving = leavingIndex < 0 && (!leavingPanel || leavingPanel === this.removedPanel || this.leftVisibleIndex < 0);
      let leavingPanelIndex = leavingIndex > -1 ? leavingIndex : this.leftVisibleIndex;
      if (isRemoving) {
        leavingPanelIndex = this.removedPanelIndex;
      }
      return toCssClasses(
        !!this.focusNewPanelCallback && "sv-pd-animation-adding",
        isRemoving && "sv-pd-animation-removing",
        leavingPanelIndex <= this.currentIndex && "sv-pd-animation-left",
        leavingPanelIndex > this.currentIndex && "sv-pd-animation-right"
      );
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
        const cssClass = toCssClasses(this.cssClasses.panelWrapperEnter, getDirectionCssClass());
        return {
          onBeforeRunAnimation: (el) => {
            if (this.focusNewPanelCallback) {
              const scolledElement = this.isRenderModeList ? el : el.parentElement;
              SurveyElement.ScrollElementToViewCore(scolledElement, false, false, { behavior: getScrollBehavior() });
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
        const cssClass = toCssClasses(this.cssClasses.panelWrapperLeave, getDirectionCssClass());
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
    this.isNewPanelsValueAssignedFromOutside = false;
  }
  /* The values the new panels wrote - their defaults and expression results - are stored as one
     assignment of the question's own: it keeps the view. An assignment from outside made while the
     panels were built (a handler that set question.value) went into the same buffer, and then the
     store is one from outside. */
  private isNewPanelsValueAssignedFromOutside: boolean;
  private setValueAfterPanelsCreating() {
    this.runLightBuiltPanelsConditions();
    this.isAddingNewPanels = false;
    if (this.isNewPanelsValueChanged) {
      const value = this.addingNewPanelsValue;
      this.runInternalValueChange((): void => {
        if (this.isNewPanelsValueAssignedFromOutside) {
          this.value = value;
        } else {
          this.setOwnRecordsValue(value);
        }
      });
    }
  }
  /* A change the question makes to its own value or records: the panel count does not follow the
     value meanwhile (setPanelCountBasedOnValue), and the on-value-change validation skips it unless
     a respondent's input is part of it (validateElementCore). It is not writeRecords, which keeps the
     existing panels from being refreshed from the records. The previous state comes back afterwards,
     also when func throws or runs another such change from a callback. It is one of the question's
     own changes: an assignment from outside made meanwhile is followed after it, with the state
     already restored (runOwnRecordsChange). */
  private runInternalValueChange<T>(func: () => T): T {
    return this.runOwnRecordsChange((): T => {
      const prev = this.isValueChangingInternally;
      this.isValueChangingInternally = true;
      try {
        return func();
      } finally {
        this.isValueChangingInternally = prev;
      }
    });
  }
  protected getValueCore() {
    return this.isAddingNewPanels
      ? this.addingNewPanelsValue
      : super.getValueCore();
  }
  protected setValueCore(newValue: any) {
    if (this.isAddingNewPanels) {
      this.isNewPanelsValueChanged = true;
      if (!this.isAssigningOwnValue) {
        this.isNewPanelsValueAssignedFromOutside = true;
      }
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
      const max = this.panelCountLimit;
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
       question the other way round - through storeLoadedRecords, from a read that committed. */
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
  /* Grows or truncates the records to a count. createRecord makes a new record; by default, under
     paging most of the new records never get a panel, so they are created with the defaults their
     panel would have written. The callers keep a data source's records out: ensureCount refuses a
     partial window only, and a source without paging holds its whole storage. */
  private syncRecordCount(val: number, createRecord?: (i: number) => any): void {
    const list = this.dataList;
    if (!createRecord && this.isPagingActive) {
      createRecord = (): any => this.createNewRecord();
    }
    this.runInternalValueChange((): void => {
      list.batch((): void => {
        list.ensureCount(val, createRecord);
        list.truncate(val);
      });
    });
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
    /* Without paging the panels are the count: they exist before the list does. A source that pages
       itself is counted by the list even without a page size: its window may hold hidden records. */
    if (!list || !this.isPagingActive && !list.isPagedBySource) return panels.length;
    return list.globalVisibleCount;
  }
  // Next is available on the last record the list knows of while the source says there are more.
  private get hasRecordBeyondKnown(): boolean {
    const list = this.dataListValue;
    return !!list && list.hasRecordBeyondKnown;
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
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.setPanelState(this.panelsCore[i], i);
    }
  }
  // index: the panel's position in panelsCore.
  private setPanelState(panel: PanelModel, index: number): void {
    if (this.useTemplatePanel || this.displayMode != "list" || !this.templateTitle) return;
    let state = this.panelsState;
    if (state === "firstExpanded") {
      state = index === 0 ? "expanded" : "collapsed";
    }
    if (state === "expanded") {
      panel.expand(false);
    } else {
      panel.state = state;
    }
  }
  private setValueBasedOnPanelCount() {
    // The storage of a remote-backed question is the source's, and its window is one page: growing
    // it up to the count would pad the page with records the server does not have.
    if (this.isRemoteData) return;
    const panelCount = this.panelCount;
    if (this.dataList.count === panelCount) return;
    this.syncRecordCount(panelCount, (i: number): any => {
      // A record past the page has no panel to take its value from.
      const panel = this.panels[i];
      const panelValue = !!panel ? panel.getValue() : this.createNewRecord();
      return !Helpers.isValueEmpty(panelValue) ? panelValue : {};
    });
  }
  /**
   * An expression that dynamically calculates the panel count. Overrides the static [`panelCount`](#panelCount) property.
   *
   * The calculation result is clamped to the [`minPanelCount`](#minPanelCount) and [`maxPanelCount`](#maxPanelCount) limits: a value below the minimum is set to `minPanelCount`, and a value above the maximum is capped at `maxPanelCount`. If panels are not split into pages, the global [`settings.panel.maxPanelCount`](/form-library/documentation/api-reference/settings#panel) setting also limits the maximum.
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
    this.panelCount = this.getRecordCountByExpressionValue(val, this.minPanelCount, this.panelCountLimit);
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
   * `settings.panel.maxPanelCount` is the maximum number of panels on one page. If panels are not split into pages, it also limits `maxPanelCount`. If they are, only `maxPanelCount` limits the total number of panels, and only when you set it.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))
   * @see panelCount
   * @see minPanelCount
   * @see allowAddPanel
   */
  /* Without paging the setting caps it, as it always has: a value above the setting reads as the
     setting and is therefore not serialized. With paging the setting is the page maximum and the
     value is kept (panelCountLimit). */
  public get maxPanelCount(): number {
    const val = this.getPropertyValue("maxPanelCount");
    return this.pageSize > 0 ? val : Math.min(val, this.maxRecordsPerPage);
  }
  public set maxPanelCount(val: number) {
    this.setPropertyValue("maxPanelCount", val <= 0 ? 1 : val);
  }
  // internal: the limit panelCount is checked against (see getRecordCountLimit).
  public get panelCountLimit(): number {
    return this.getRecordCountLimit(this.maxPanelCount, this.getPropertyValueWithoutDefault("maxPanelCount"));
  }

  private onMaxPanelCountChanged(): void {
    const val = this.maxPanelCount;
    if (val < this.minPanelCount)this.minPanelCount = val;
    const limit = this.panelCountLimit;
    if (this.panelCount > limit)this.panelCount = limit;
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
    if (this.isDesignMode || this.hasPanelCountExpression || !this.canWriteRecords("insert")) return false;
    if (!this.isRenderModeList &&
      (this.currentIndex < this.visiblePanelCount - 1 && this.newPanelPosition !== "next")) {
      return false;
    }
    return (
      this.allowAddPanel &&
      !this.isReadOnly &&
      this.panelCount < this.panelCountLimit
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
    if (this.isDesignMode || this.hasPanelCountExpression || !this.canWriteRecords("remove")) return false;
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
    if (!this.setDefaultRecordValues(this.defaultPanelValue, this.panelCount)) super.setDefaultValue();
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
  /* When the list pages the progress is counted from the records (getProgressInfoByRecords): every
     input question of the template in every visible record. A question that is empty in a record
     and has a visibleIf is not counted, since whether it would be shown is not known without its
     panel. */
  public getProgressInfo(): IProgressInfo {
    if (!this.isPagedByList) {
      return SurveyElement.getProgressInfoByElements(this.visiblePanelsCore, this.isRequired);
    }
    const questions = this.template.questions;
    const getQuestion = (q: Question): Question => q;
    const getKey = (q: Question): string => q.getValueName();
    const isRequired = (q: Question): boolean => q.isRequired;
    return this.getProgressInfoByRecords((res: IProgressInfo, record: any): void => {
      this.addRecordProgress(res, record, questions, getQuestion, getKey, isRequired);
    });
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
    if (this.refuseOperationOfSource("insert")) return null;
    const isUI = runAdditionalActions === true;
    if (!isUI) return this.addPanelAndShow(index, false);
    if (!this.canAddPanel) return null;
    // Without paging an add is what it has always been: carousel and tab mode validate the panel
    // they leave, whatever the survey's checkErrorsMode says.
    if (!this.isPagingActive) {
      return this.canLeaveCurrentPanel() ? this.addPanelAndShow(index, true) : null;
    }
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
      this.leavePage(true, add, (context: ValidationContext): boolean =>
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
    return !panel || this.validateRecordObjects(context, (): boolean => panel.validateElement(context));
  }
  // The check carousel and tab mode run before Next and Add when the question does not page. Design
  // mode shows the template and validates nothing.
  private canLeaveCurrentPanel(): boolean {
    return this.isRenderModeList || this.isDesignMode || !this.currentPanel || this.currentPanel.validate(true, true);
  }
  // Does the record an add creates land on another page than the one shown?
  private isAddLeavingPage(index: number): boolean {
    if (!this.isPagedByList) return false;
    return !this.isVisibleIndexOnPage(this.getInsertTarget(index).visibleIndex);
  }
  /* Where an in-memory paged add puts the new record: the record index it is inserted at and the
     visibleIndex it will have. index is a created position of the whole view, as without paging - a
     record templateVisibleIf hides is counted: it inserts before the record at that position, on
     whatever page it is; one past the last record and a negative index append. undefined inserts
     after the current panel in carousel and tab mode and appends in list mode. The visibleIndex of an
     insert in front of a hidden record is taken as an append's: it only decides whether the add
     leaves the page. */
  private getInsertTarget(index: number): { at: number, visibleIndex: number } {
    const list = this.dataList;
    const visibleCount = list.visibleCount;
    if (index > -1) {
      const at = this.getInsertIndexForOperation(index);
      const visibleIndex = at < list.loadedCount ? list.getGlobalVisibleIndex(at) : -1;
      return { at: at, visibleIndex: visibleIndex > -1 ? visibleIndex : visibleCount };
    }
    const curIndex = index === undefined ? this.currentIndex : -1;
    const visibleIndex = curIndex > -1 ? Math.min(curIndex + 1, visibleCount) : visibleCount;
    return { at: list.getInsertIndexAtVisibleIndex(visibleIndex), visibleIndex: visibleIndex };
  }
  private addPanelCore(index: number): PanelModel {
    if (this.isPagedByList) return this.addPanelInPage(index);
    const curIndex = this.currentIndex;
    // A page-local position: the current panel's position in panelsCore.
    const curPos = curIndex < 0 ? -1 : this.getPositionAtVisibleIndex(curIndex);
    /* position is a created position - a position in panelsCore. Under a view the panels exist for the
       records the view holds - with a data source that pages, the loaded window - so the positions end
       with them and not with the record count that panelCount reports. Without a view panelCount panels
       exist, whether or not their records are stored. */
    const maxIndex = this.hasDataListView ? this.dataList.getMaterializedIndexes().length : this.panelCount;
    let position = index === undefined ? (curPos < 0 ? maxIndex : curPos + 1) : index;
    if (position < 0 || position > maxIndex) {
      position = maxIndex;
    }
    if (this.isRemoteData) {
      const list = this.dataList;
      /* The record of the window the new one goes in front of, loadedCount at the end of it. A number is
         a created position of the whole view: a source that pages itself refuses one its window does
         not hold. */
      const recordIndex = index > -1 ? this.getInsertIndexForOperation(index) : list.getInsertIndexAtMaterializedPosition(position);
      if (recordIndex < 0) return null;
      const at = this.addPanelRemote(recordIndex);
      this.followInsertedRecord(at, false);
      const added = list.indexToMaterializedIndex(at);
      // A record the view hides has no panel: the page and the current panel stay, as in the paged add.
      if (added < 0) return null;
      position = added;
    } else {
      this.updateValueOnAddingPanel(curPos < 0 ? this.panelCount - 1 : curPos, position);
    }
    if (!this.isRenderModeList) {
      this.currentIndex = this.getVisibleIndexAtPosition(position);
    }
    this.notifyOnPanelAddedRemoved(true, this.getPanelViewIndex(position), this.panelsCore[position]);
    return this.panelsCore[position];
  }
  // The released meaning of a panel's reported index (getRecordViewIndex); position: in panelsCore.
  private getPanelViewIndex(position: number): number {
    return this.getRecordViewIndex(this.getRecordIndexByPanelIndex(position));
  }
  /* The in-memory paged add. The complete record - the default panel value,
     then the copy from the previous entry - is inserted once, and the question shows the page of the
     inserted record, which is the last page only for an append. The panels follow the record
     (followInsertedRecord): a page change rebuilds them, a record last on the page in force gets a
     panel of its own and the others keep their state, an insert in front of panels rebuilds the
     page. A record templateVisibleIf hides has no page: the page stays, as the matrix's does, and
     there is no panel. The new record's panel is the one returned, and carousel and tab mode select
     it. */
  private addPanelInPage(index: number): PanelModel {
    const list = this.dataList;
    const target = this.getInsertTarget(index);
    const record = this.createNewRecord(this.getCopySourceRecord());
    this.updateBindings("panelCount", list.count + 1);
    let at = -1;
    this.runInternalValueChange((): void => {
      list.batch((): void => { at = this.runRecordAdd((): number => list.add(record, target.at)); });
    });
    const isSelected = !this.isRenderModeList;
    const item = <QuestionPanelDynamicItem>this.followInsertedRecord(at, isSelected);
    const newPanel = !!item ? item.panel : null;
    // A rebuild selected it already; an appended panel is selected here.
    if (isSelected && !!newPanel) {
      this.currentPanel = newPanel;
    }
    this.updateFooterActions();
    this.notifyOnPanelAddedRemoved(true, this.getRecordViewIndex(at), newPanel);
    return newPanel;
  }
  /* A record for a panel that does not exist yet: the defaults its panel would write when it is
     created - the template questions' default values and defaultPanelValue - and then copyFrom. Under
     paging a record is created long before its panel, and the panel of an unvisited page is never
     created at all. */
  private createNewRecord(copyFrom?: any): any {
    return this.composeNewRecord(this.template.questions, (q: Question): Question => q, (q: Question): string => q.getValueName(),
      this.defaultPanelValue, copyFrom);
  }
  /* The record copyDefaultValueFromLastEntry copies from in the record-first adds (the paged and the
     remote one), read before the insert: the current panel's in carousel and tab mode, the last
     panel's in list mode - the panels that exist, which under paging are the page and for a source
     that pages itself the window. undefined: none, or the property is off. */
  private getCopySourceRecord(): any {
    if (!this.copyDefaultValueFromLastEntry) return undefined;
    const list = this.dataList;
    const current = this.isRenderModeList ? null : this.currentPanel;
    let index = !!current ? this.getPanelRecordIndex(current) : -1;
    if (index < 0 || index >= list.loadedCount) {
      const created = list.getMaterializedIndexes();
      index = created.length > 0 ? created[created.length - 1] : -1;
    }
    return index > -1 ? list.getRecord(index) : undefined;
  }
  /* The remote add path. The local one grows the count first and writes the defaults afterwards,
     which over a data source is a throwing count setter followed by up to three server calls for one
     gesture. Here the complete record is built first - the template defaults and the default panel
     value, then the copy from the last entry IN THE WINDOW - and handed to the list once: one
     source.insert, no move, no follow-up update. The template defaults are part of the record
     because the new panel finds them there and writes nothing; without them each default would be
     an update after the insert. question.value follows the window through the recordAdded
     notification. */
  /* The record of the remote add. recordIndex: the record of the window the new one goes in front
     of, loadedCount to append. Returns the record index list.add answered. */
  private addPanelRemote(recordIndex: number): number {
    const list = this.dataList;
    const record = this.createNewRecord(this.getCopySourceRecord());
    return this.runRecordAdd((): number => list.add(record, recordIndex));
  }
  // QuestionRecordsModel hook: one panel at the end of the panels; the panels that exist keep their state.
  protected appendItemForRecord(recordIndex: number): void {
    this.prepareValueForPanelCreating();
    const panel = this.createNewPanel();
    this.panelsCore.push(panel);
    this.setValueAfterPanelsCreating();
    // The new panel only: a panel the respondent collapsed or expanded keeps its state.
    this.setPanelState(panel, this.panelsCore.length - 1);
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
  /* The unpaged add: panelCount++ creates the panel and appends its record, which then moves to the
     created position index. The panel object exists before its record is moved into place:
     onPanelAdded must see the same state it sees today. A handler that assigned the value meanwhile
     keeps it: the records are its own, and none of them is the new one. */
  private updateValueOnAddingPanel(prevIndex: number, index: number): void {
    const list = this.dataList;
    this.growAndMoveRecord((): void => { this.panelCount++; }, (): number => {
      if (list.count !== this.panelCount) return -1;
      const lastIndex = this.panelCount - 1;
      // index is a created position; the record it names is where the list moves the new one.
      return index < lastIndex ? this.getRecordIndexByPanelIndex(index) : lastIndex;
    }, (recordIndex: number): any => {
      /* The released copy source: prevIndex - the current panel in carousel and tab mode, the last one
         in list mode - read after the move, so an insert in front of it reads the record that has
         shifted into its position. The record-first adds read it before the insert
         (getCopySourceRecord). */
      let copyFrom: any = undefined;
      if (this.copyDefaultValueFromLastEntry && list.count > 1) {
        const lastIndex = list.count - 1;
        const fromIndex = this.getRecordIndexByPanelIndex(prevIndex > -1 && prevIndex <= lastIndex ? prevIndex : lastIndex);
        copyFrom = fromIndex > -1 ? list.getRecord(fromIndex) || {} : undefined;
      }
      if (this.isValueEmpty(this.defaultPanelValue) && !copyFrom) return undefined;
      return Object.assign({}, list.getRecord(recordIndex), this.composeNewRecord([], undefined, undefined, this.defaultPanelValue, copyFrom));
    });
  }
  public getPanelRemoveButtonId(panel: PanelModel): string {
    return panel.id + "_remove_button";
  }
  public isRequireConfirmOnDelete(val: any): boolean {
    if (!this.confirmDelete) return false;
    const target = this.resolvePanelTarget(val);
    if (!target || !target.item && target.recordIndex < 0) return false;
    const panelValue = !!target.item ? (<QuestionPanelDynamicItem>target.item).panel.getValue() : target.record;
    return !this.isValueEmpty(panelValue) &&
      (this.isValueEmpty(this.defaultPanelValue) || !this.isTwoValueEquals(panelValue, this.defaultPanelValue));
  }
  /* What removePanel and isRequireConfirmOnDelete act on. A panel, or its item, names itself. A number
     is a position among the visible records of the whole view, as currentIndex is (resolveRecordTarget):
     without paging a position in visiblePanels, under paging the record it names may be on another
     page and have no panel. A disposed panel is not in visiblePanels: it names nothing. */
  private resolvePanelTarget(val: any): IRecordTarget {
    // visiblePanels and not the core array: the getter builds panels that were not built yet.
    const visPanels = this.visiblePanels;
    if (Helpers.isNumber(val)) {
      return this.resolveRecordTarget(val, this.visiblePanelCount, (pos: number): QuestionRecordItem => <QuestionRecordItem>visPanels[pos]?.data);
    }
    const pos = this.getVisualPanelIndex(val);
    if (pos < 0 || pos >= visPanels.length) return undefined;
    const item = <QuestionRecordItem>visPanels[pos].data;
    return { item: item, recordIndex: this.getItemRecordIndex(item), visibleIndex: this.getVisibleIndexAtPosition(pos) };
  }
  /**
   * Switches Dynamic Panel to the next panel. Returns `true` in case of success, or `false` if `displayMode` is `"list"` or the current panel contains validation errors.
   * @see displayMode
   */
  /* A move the respondent makes, one record forward. Without paging the current panel is validated
     first, whatever the survey's checkErrorsMode says, as it always has been. With paging, inside the
     page the current panel is validated; the last panel of a page moves to the next page, and that
     page leave validates the page's panels. Both follow the survey's checkErrorsMode and wait for
     asynchronous validators (layer 1). Returns false only for an error found at once. */
  public goToNextPanel(): boolean {
    const index = this.currentIndex;
    if (index < 0) return false;
    if (!this.isPagingActive) {
      if (!this.canLeaveCurrentPanel()) return false;
      this.currentIndex = index + 1;
      return true;
    }
    // The current panel is the last one of the page: the next record is on the next page.
    const isLeavingPage = this.canGoToNextRecord && this.getPanelVisibleIndex(this.getVisiblePanelAt(index + 1)) !== index + 1;
    return this.leavePage(true, (): void => {
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
  /* A number is a position among the visible records of the whole view (see resolvePanelTarget): under
     paging a record on another page is removed too, without a panel - so without the panel events. A
     source that pages itself refuses one it has not loaded and reports it. */
  public removePanel(value: any, confirmDelete?: boolean): void {
    const target = this.getRemoveTarget((): IRecordTarget => this.resolvePanelTarget(value));
    if (!target) return;
    const isUI = confirmDelete !== undefined;
    if (isUI) {
      if (!this.canRemovePanel) return;
      const removePanel = () => {
        const current = this.findRemoveTargetAgain(target);
        if (!current) return;
        const visIndex = this.removePanelCore(current);
        if (visIndex < 0) return;
        this.focusAfterPanelRemoved(visIndex);
        // A remote page that is read again after the removal rebuilds every panel when the read
        // commits: the position is focused once more after that rebuild.
        this.keepFocusIndexForRead(visIndex);
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
      this.removePanelCore(target);
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
  protected focusItemAfterRead(index: number): void {
    this.focusAfterPanelRemoved(index);
  }
  // The visibleIndex of the removed panel and the panel itself: the animation that follows takes its
  // direction from them.
  private removedPanelIndex: number;
  private removedPanel: PanelModel;
  // Returns the removed panel's position in visiblePanels, -1 when no panel was removed.
  private removePanelCore(target: IRecordTarget): number {
    let res = -1;
    this.runCurrentPanelChange((): void => { res = this.removePanelCoreInScope(target); });
    return res;
  }
  /* The record that becomes current when the current panel is removed under paging: the next panel on
     its page, or, when it was the last of its page, the previous record - on the previous page when the
     page is left empty. panel: the successor's panel on the page; visibleIndex: the position the
     successor has after the removal. */
  private getRemovalSuccessor(panel: PanelModel, visibleIndex: number): { panel: PanelModel, visibleIndex: number } {
    const visPanels = this.visiblePanelsCore;
    const pos = visPanels.indexOf(panel);
    if (pos > -1 && pos + 1 < visPanels.length) return { panel: visPanels[pos + 1], visibleIndex: visibleIndex };
    if (pos > 0) return { panel: visPanels[pos - 1], visibleIndex: visibleIndex - 1 };
    return { panel: null, visibleIndex: visibleIndex - 1 };
  }
  private removePanelCoreInScope(target: IRecordTarget): number {
    this.removedPanelIndex = target.visibleIndex;
    const panel = !!target.item ? (<QuestionPanelDynamicItem>target.item).panel : undefined;
    const visIndex = !!panel ? this.visiblePanelsCore.indexOf(panel) : -1;
    const index = !!panel ? this.panelsCore.indexOf(panel) : -1;
    if (!!panel && index < 0) return -1;
    // index is a created position; the record it holds is what leaves the storage.
    const recordIndex = !!panel ? this.getRecordIndexByPanelIndex(index) : target.recordIndex;
    const viewIndex = this.getRecordViewIndex(recordIndex);
    if (!!panel && this.survey && !this.dynamicPanelCallbacks.dynamicPanelRemoving(this, viewIndex, panel)) return -1;
    this.removedPanel = panel;
    const isCurrentRemoved = !!panel && this.isPagingActive && !this.isRenderModeList && this.getPropertyValue("currentPanel", null) === panel;
    const successor = isCurrentRemoved ? this.getRemovalSuccessor(panel, target.visibleIndex) : undefined;
    if (index > -1) {
      this.panelsCore.splice(index, 1);
    }
    /* The one place the successor is decided. A panel on the page is selected now; its record is held,
       and the remove renumbers it, so the rebuilds that follow - the refill of the page, the read of a
       source that pages itself - keep it. A successor on the previous page has no panel yet: its
       position is kept for the rebuild of that page, which the page clamp of the remove asks for. */
    if (!!successor) {
      if (!!successor.panel) {
        this.currentPanel = successor.panel;
      } else {
        this.currentPanel = null;
        if (successor.visibleIndex > -1)this.keepPendingVisibleIndex(successor.visibleIndex);
      }
    }
    this.setPropertyValue("panelCount", this.panelCount);
    if (!!panel) {
      this.singleInputOnRemoveItem(visIndex);
    }
    const list = this.dataList;
    this.removeRecordAndRefill((): void => {
      if (recordIndex < 0 || recordIndex >= list.count) {
        this.updateFooterActions();
        return;
      }
      // The list's callbacks and onDynamicPanelRemoved run in between: user code.
      this.runInternalValueChange((): void => {
        list.remove(recordIndex);
        /* Without a view the current panel names its record by position, and a panel that replaced
           the removed current one was selected inside the splice, before the list knew about the
           remove: its record is taken again. */
        if (!this.hasDataListView && !this.isRenderModeList && !!this.getPropertyValue("currentPanel", null)) {
          this.setCurrentRecordIndex(this.getPanelRecordIndex(this.getPropertyValue("currentPanel")));
        }
        this.updateFooterActions();
        this.fireCallback(this.panelCountChangedCallback);
        this.notifyOnPanelAddedRemoved(false, viewIndex, panel);
      });
    });
    if (!!panel) {
      this.disposePanels([panel]);
    }
    return visIndex;
  }
  // index: the released meaning of panelIndex (getRecordViewIndex).
  private notifyOnPanelAddedRemoved(isAdded: boolean, index: number, panel: PanelModel): void {
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
  protected verifyValueCore(val: any, context: IVerifyDataContext): boolean {
    if (!super.verifyValueCore(val, context)) return false;
    if (!context.checks.reportUnknownProperties || !Array.isArray(val)) return true;
    // Verification builds the panels, as it always has.
    this.panels;
    this.verifyRecordsUnknownKeys(val, context);
    return true;
  }
  // A record is checked against its panel's questions, and a record without a panel against the template's.
  protected getRecordUnknownKeys(recordIndex: number, record: any, item: QuestionRecordItem): Array<string> {
    if (!Helpers.isValueObject(record, true)) return [];
    const panel = !!item ? (<QuestionPanelDynamicItem>item).panel : this.template;
    return Object.keys(record).filter((key: string): boolean => this.isUnknownValueKey(panel, key, recordIndex));
  }
  public initializeForVerification(): void {
    this.panels.forEach(panel => panel.initializeForVerification());
  }
  public verifyNestedValues(context: IVerifyDataContext): void {
    const panels = this.panels;
    for (let i = 0; i < panels.length; i++) {
      context.pushSegment(this.getRecordIndexByPanelIndex(i));
      panels[i].verifyDataCore(context);
      context.popSegment();
    }
  }
  private isUnknownValueKey(panel: PanelModel, key: string, index: number): boolean {
    if (!!this.getSharedQuestionFromArray(key, index) || !!panel.getQuestionByValueName(key)) return false;
    return !this.iscorrectValueWithPostPrefix(panel, key, settings.commentSuffix) &&
      !this.iscorrectValueWithPostPrefix(panel, key, settings.matrix.totalsSuffix);
  }
  public clearIncorrectValues() {
    if (this.isRemoteData) return;
    this.clearIncorrectValueInData();
    for (var i = 0; i < this.panelsCore.length; i++) {
      this.clearIncorrectValuesInPanel(i);
    }
  }
  /* index is a CREATED position - what it has always been for this method; under paging a created
     position of the whole view. A record without a panel on the page answers null: nothing is built and
     the page stays (getQuestionFromRecord reaches the panel a record has). */
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (this.isPagingActive) {
      const target = this.getRecordTargetAtCreatedIndex(index);
      return !!target && !!target.item ? (<QuestionPanelDynamicItem>target.item).panel.getQuestionByName(name) : null;
    }
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
      if (!this.isUnknownValueKey(panel, key, index)) continue;
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
    if (!key.endsWith(postPrefix)) return false;
    return !!panel.getQuestionByName(key.substring(0, key.length - postPrefix.length));
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
    this.collectNestedQuestionsOfItems(
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
  // One hook for the whole question, not one per nested question.
  private get arePanelsReadOnly(): boolean {
    return this.isReadOnly || !this.canWriteRecords("update");
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
    this.flushAuthoredView();
  }
  private adjustPanelCount(): number {
    const pnlCount = this.getPropertyValue("panelCount");
    if (pnlCount < this.minPanelCount) {
      return this.minPanelCount;
    }
    if (pnlCount > this.panelCountLimit) {
      return this.panelCountLimit;
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
    if (this.data && this.takeValueChangedBeforeBuild()) {
      this.runTriggersOnBuildPanelsFirstTime();
    }
    // The panels that were built: under paging the page's, as a remote first build has always done.
    if (!!this.survey) {
      for (var i = 0; i < this.panelsCore.length; i++) {
        this.notifyOnPanelAddedRemoved(true, this.getPanelViewIndex(i), this.panelsCore[i]);
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
    this.runTriggersOnItems(
      this.visiblePanelsCore.map(p => <QuestionRecordItem>p.data),
      item => this.getItemData(item),
      settings.expressionVariables.panel
    );
  }
  private get showAddPanelButton(): boolean { return this.allowAddPanel && !this.isReadOnly && !this.hasPanelCountExpression && this.canWriteRecords("insert"); }
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
      if (!this.rebuildStalePage(properties)) {
        this.runPanelsCondition(this.panelsCore, properties);
      }
    } finally {
      this.isPagingSyncSuspended = prevIsPagingSyncSuspended;
    }
    if (!this.isPagingSyncSuspended) {
      this.runDeferredPagingSync();
    }
  }
  protected getRecordVisibleIfPropertyName(): string {
    return "templateVisibleIf";
  }
  // The values the panels' setValueExpression and resetValueIf compute are not edits (runComputedWrites).
  public runTriggers(name: string, value: any, keys?: any): void {
    super.runTriggers(name, value, keys);
    this.runComputedWrites((): void => {
      this.visiblePanelsCore.forEach(p => {
        (<QuestionRecordItem>p.data).runTriggers(name, value, keys);
      });
    });
  }
  private reRunCondition() {
    if (!this.data) return;
    this.runCondition(this.getDataFilteredProperties());
  }
  protected runPanelsCondition(panels: PanelModel[], properties: HashTable<any>): void {
    /* Every paging sync and page render requested during the run - by the "visible" handler, which
       fires inside panel.runCondition(), by the call below, by anything a condition reaches - collapses
       into one after the loop. A re-entrant run leaves it to the outer one. */
    const prevIsPagingSyncSuspended = this.isPagingSyncSuspended;
    this.isPagingSyncSuspended = true;
    const isPanelsCore = panels === this.panelsCore;
    let visibleIndex = 0;
    try {
      this.runInternalValueChange((): void => this.runComputedWrites((): void => {
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
      }));
    } finally {
      this.isPagingSyncSuspended = prevIsPagingSyncSuspended;
    }
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
    if (syncPaging) {
      super.syncPagingState();
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
  // The on-value-change check: a key typed on this page that repeats the key of a record without a
  // panel - off the page, or filtered out - is a duplicate too.
  private hasKeysDuplicated(context: ValidationContext): boolean {
    const keys = this.getKeysWithoutPanels();
    var res;
    for (var i = 0; i < this.panelsCore.length; i++) {
      res =
        this.isValueDuplicated(this.panelsCore[i], keys, context) ||
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
      this.validateRecordObjects(context, (): void => {
        qs.forEach(q => {
          qRes = q.validateElement(context) && qRes;
        });
      });
      res = !this.hasKeysDuplicated(context) && qRes;
      this.updatePanelsContainsErrors();
    } else {
      // Off the page: the edited records and a key pair both of whose records have no panel. Either
      // moves to the page that holds the error.
      res = this.validateInPanels(context) && this.validateOffPage(context);
    }
    return super.validateElementCore(context) && res;
  }
  /* QuestionRecordsModel hook: the key, with the membership the question has without paging: an
     owner-hidden record does not take part, a filtered-out one does but never receives the error.
     Keys compare as text, case-sensitively, as the on-page check compares them (getKeyOf). The error
     goes on the later visible record of a pair, on its page. */
  protected getRecordUniqueness(): IDynamicDataRecordUniqueness {
    return { fields: !!this.keyName ? [this.keyName] : [], caseSensitive: true, includeHidden: false, includeFilteredOut: true };
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
    if (this.isRemoteData) return;
    if (!isClearOnHidden) {
      if (!!this.survey && this.survey.getQuestionClearIfInvisible("onHidden") === "none") return;
      this.clearValueInPanelsIfInvisible("onHiddenContainer");
    }
    super.clearValueOnHidding(isClearOnHidden);
  }
  public clearValueIfInvisible(reason: string = "onHidden"): void {
    if (this.isRemoteData) return;
    const panelReason = reason === "onHidden" ? "onHiddenContainer" : reason;
    this.clearValueInPanelsIfInvisible(panelReason);
    super.clearValueIfInvisible(reason);
  }
  private clearValueInPanelsIfInvisible(reason: string): void {
    for (var i = 0; i < this.panelsCore.length; i++) {
      const panel = this.panelsCore[i];
      var questions = panel.questions;
      for (var j = 0; j < questions.length; j++) {
        const q = questions[j];
        if (q.visible && !panel.isVisible) continue;
        q.clearValueIfInvisible(reason);
      }
    }
    this.clearValueInRecordsWithoutPanel(reason);
  }
  /* Under paging in memory only the page has panels: the records without one are cleared over their
     stored values (getRecordsWithoutInvisibleAnswers), and the result is written once, as one of the
     question's own changes. */
  private clearValueInRecordsWithoutPanel(reason: string): void {
    const records = this.getRecordsWithoutInvisibleAnswers(reason, this.template);
    if (!!records) {
      this.runInternalValueChange((): void => this.setOwnRecordsValue(records));
    }
  }
  // What puts a panel into visiblePanels.
  protected isItemVisible(item: QuestionRecordItem): boolean {
    return (<QuestionPanelDynamicItem>item).panel.visible;
  }
  public getValueGetterContext(): IValueGetterContext {
    return new PanelDynamicValueGetterContext(this);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var values = this.getUnbindValue(value);
    if (!values || !Array.isArray(values)) return values;
    return this.getRecordsDisplayValue(keysAsText, values);
  }
  /* The record's panel formats it. Under a view - a filter, a sort, paging - a record without a panel
     is formatted through the template, which gives the same text the panel would when the choices do
     not depend on the panel. Choices that depend on {panel.x}, and a choicesByUrl whose answer is not
     in the ChoicesRestful cache yet, give the raw value - reading here never starts a request. Without
     a view a record has no panel only while the panels were never built: it keeps its values. */
  protected getRecordDisplayValue(keysAsText: boolean, item: QuestionRecordItem, record: any, recordIndex: number): any {
    const container = !!item ? (<QuestionPanelDynamicItem>item).panel : (this.hasDataListView ? this.template : undefined);
    if (!container) return record;
    return this.formatRecordDisplayValue(keysAsText, record,
      (key: string): Question => <Question>container.getQuestionByValueName(key) || this.getSharedQuestionFromArray(key, recordIndex));
  }
  private validateInPanels(context: ValidationContext): boolean {
    let res = true;
    const panels = this.visiblePanels;
    // The keyName duplicates are looked for among the RECORDS: a panel that repeats the key of a
    // record with no panel is still a duplicate. A pair that is entirely outside the view reports
    // nothing - it cannot be shown.
    const keys = this.getKeysWithoutPanels();
    for (let i = 0; i < panels.length; i++) {
      let isPnlValid = this.validateRecordObjects(context, (): boolean => panels[i].validateElement(context));
      isPnlValid = !this.isValueDuplicated(panels[i], keys, context) && isPnlValid;
      if (!this.isRenderModeList && !isPnlValid && res && context.focusOnFirstError) {
        this.moveToVisibleIndex(this.getPanelVisibleIndex(panels[i]));
      }
      res = isPnlValid && res;
    }
    return res;
  }
  // A key value compared as text, as the off-page check compares it: 1 and "1.0" differ, true and "true" do not.
  private getKeyOf(value: any): string {
    return getDuplicateKey(value, this.getRecordUniqueness().caseSensitive);
  }
  // A Set and not an object: the keys are respondent input and may be named like Object.prototype members.
  private getKeysWithoutPanels(): Set<string> {
    const res = new Set<string>();
    if (!this.keyName || !this.hasDataListView) return res;
    // A key constraint over a whole remote table cannot be checked here. An owner-hidden record does not
    // take part (getRecordUniqueness), as it does not without paging, where its hidden panel is skipped.
    // A record the page holds is compared through its panel.
    this.forEachUniquenessRecord((index: number, item: QuestionRecordItem, position: number): void => {
      if (position > -1) return;
      const record = this.getListRecordAt(index);
      const val = !!record ? record[this.keyName] : undefined;
      if (!this.isValueEmpty(val)) {
        res.add(this.getKeyOf(val));
      }
    });
    return res;
  }
  private isValueDuplicated(panel: PanelModel, keys: Set<string>, context: ValidationContext): boolean {
    if (!this.keyName) return false;
    var question = <Question>panel.getQuestionByValueName(this.keyName);
    if (!question || question.isEmpty()) return false;
    var value = question.value;
    const qs = this.changingValueQuestions;
    if (Array.isArray(qs) && qs.indexOf(question) < 0) {
      question.validateElement(context);
    }
    const key = this.getKeyOf(value);
    if (keys.has(key)) {
      if (context.fireCallback) {
        question.addError(
          new KeyDuplicationError(this.keyDuplicationError, this)
        );
      }
      context.setErrorElement(question);
      return true;
    }
    keys.add(key);
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
  // The values a new panel writes while it is attached - its defaults - are computed (runComputedWrites).
  protected createNewPanel(): PanelModel {
    return this.runComputedWrites((): PanelModel => this.createNewPanelCore());
  }
  private createNewPanelCore(): PanelModel {
    var panel = this.createAndSetupNewPanelObject();
    var json = this.template.toJSON();
    /* Under paging a record's visibility is decided over the record (updatePagedRecordsVisibility)
       and a hidden record gets no panel, so the panel does not run templateVisibleIf a second time:
       it takes its visibility from that evaluation and the two cannot disagree. */
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
  // The list side of an assignment is QuestionRecordsModel's; the panels follow in onRecordsValueAssigned.
  public setQuestionValue(newValue: any): void {
    if (this.isValidatingExpressions || this.settingPanelCountBasedOnValue) return;
    super.setQuestionValue(newValue);
  }
  /* The panels take their records after the panel count follows the value. A write of a panel
     question does not push them back (isWritingRecords): that would re-create a nested dynamic
     question from the stored value and drop its state that is not in the answer, such as an added
     trailing empty row. */
  protected onRecordsValueAssigned(oldRecords: any): void {
    this.setPanelCountBasedOnValue();
    super.onRecordsValueAssigned(oldRecords);
    this.updateIsAnswered();
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
  /* index is a created position. The loop that calls it knows it: getItemData(panel.data) looks it
     up in a new items array - for every panel, on every write of the value. */
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
  protected isDataValueCorrect(val: any): boolean {
    // Every row is a plain object; an empty one may be null.
    return Array.isArray(val) && val.every(row => Helpers.isValueEmpty(row) || Helpers.isValueObject(row, true));
  }
  public getValueChangingOptions(childQuestion: Question): any {
    let pnl = childQuestion.parent;
    while(pnl.parent) {
      pnl = pnl.parent;
    }
    const panel = pnl;
    const position = this.panels.indexOf(<PanelModel>panel);
    return {
      question: this,
      panel: panel,
      name: childQuestion.name,
      panelIndex: position < 0 ? position : this.getPanelViewIndex(position),
      panelData: this.getPanelItemDataByIndex(position),
      oldValue: childQuestion.value
    };
  }
  // The panel's position in panelsCore: under paging a position on the page.
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
  getItemData(item: ISurveyData): any {
    return this.getPanelItemDataByIndex(this.items.indexOf(item));
  }
  /* index is a CREATED position (under paging, on the page), the counterpart of getItemIndex. It used to index visiblePanels,
     which disagreed with getItemIndex whenever a panel was hidden by templateVisibleIf - the pair is
     what a bound question was addressed through. */
  getItem(index: number): QuestionRecordItem {
    const panel = this.panelsCore[index] || undefined;
    return <QuestionRecordItem>panel?.data;
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
  updateItemValue(item: ISurveyData, name: string, val: any, isDeletingValue: boolean): boolean {
    if (this.isValidatingExpressions || item === this.template.data) return true;
    var items = this.items;
    var index = items.indexOf(item);
    if (index < 0) index = items.length;
    // index is a created position; the record it writes is the one that panel holds, or the next
    // record for a panel that does not exist yet.
    const recordIndex = this.getRecordIndexByPanelIndex(index);
    if (this.refuseRecordEdit(<QuestionRecordItem>item, (): number => recordIndex)) return false;
    /* The questions the validation on value change checks: the one being written, and the ones of the
       writes this one runs inside. A nested write adds its question to a copy, so the outer write
       keeps its own list. */
    const prevChangingValueQuestions = this.changingValueQuestions;
    let changedQuestion: Question = undefined;
    if (index < this.panelsCore.length) {
      const questions = Array.isArray(prevChangingValueQuestions) ? [].concat(prevChangingValueQuestions) : [];
      let qName = name;
      const suffix = settings.commentSuffix;
      if (qName.endsWith(suffix)) {
        qName = qName.substring(0, qName.length - suffix.length);
      }
      const q = this.panelsCore[index].getQuestionByValueName(qName);
      if (!!q) {
        questions.push(q);
        changedQuestion = q;
      }
      this.changingValueQuestions = questions;
    }
    // The list deletes the key for an empty value; the emptiness rule (a whitespace-only string is
    // empty) is the question rule, so it is applied here.
    const newValue = this.isValueEmpty(val) ? undefined : val;
    try {
      this.writeRecords((): void => {
        this.dataList.batch((): void => {
          // The padding is a question rule as well: a write to a panel whose record does not exist yet
          // grows the value up to the panel count. A remote window is never padded - the records it does
          // not hold are on the server, and ensureCount would insert them there.
          if (!this.isRemoteData) {
            this.dataList.ensureCount(Math.max(recordIndex + 1, items.length));
          }
          // The values new panels write - their defaults - are not the respondent's.
          if (!this.isAddingNewPanels && DynamicDataList.isValueChanged(newValue, this.dataList.getValue(recordIndex, name))) {
            this.markRecordTouchedBy(recordIndex, changedQuestion);
          }
          this.dataList.setValue(recordIndex, name, newValue);
        });
      });
    } finally {
      this.changingValueQuestions = prevChangingValueQuestions;
    }
    return true;
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
    return toCssClasses(
      super.getRootCss(),
      this.getShowNoEntriesPlaceholder() && this.cssClasses.empty,
      this.isRangeShowing && this.isProgressTopShowing && this.cssClasses.navigation + "--top",
      this.isRangeShowing && this.isProgressBottomShowing && this.cssClasses.navigation + "--bottom"
    );
  }
  public get cssHeader(): string {
    const showTab = this.isRenderModeTab && !!this.visiblePanelCount;
    return toCssClasses(
      super.getCssHeader(this.cssClasses),
      this.displayMode !== "tab" && this.cssClasses.root + "__header-" + this.displayMode,
      this.hasTitleOnTop && showTab && this.cssClasses.headerTab
    );
  }
  public getTabsContainerCss(): string {
    return toCssClasses(this.cssClasses.tabsContainer, this.hasTitleOnTop && this.cssClasses.tabsContainerWithHeader);
  }
  public getPanelWrapperCss(panel: PanelModel): string {
    return toCssClasses(
      (!panel || panel.visible) && this.cssClasses.panelWrapper,
      this.isRenderModeList && this.cssClasses.panelWrapperList,
      this.removePanelButtonLocation === "right" && this.cssClasses.panelWrapperInRow
    );
  }
  public getPanelRemoveButtonCss(): string {
    return toCssClasses(
      this.cssClasses.button,
      this.cssClasses.buttonRemove,
      this.removePanelButtonLocation === "right" && this.cssClasses.buttonRemoveRight
    );
  }
  public getAddButtonCss(): string {
    return toCssClasses(
      this.cssClasses.button,
      this.cssClasses.buttonAdd,
      this.displayMode === "list" && this.cssClasses.buttonAdd + "--list-mode"
    );
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
        const visibleIndex = this.getPanelVisibleIndex(panel);
        if (visibleIndex > -1) {
          this.currentIndex = visibleIndex;
        }
      }
    });
    return newItem;
  }
  // The panel's visibleIndex: its position among the visible records of the whole list; -1 when it is not visible.
  private getPanelVisibleIndex(panel: PanelModel): number {
    return this.getVisibleIndexAtPosition(this.visiblePanelsCore.indexOf(panel));
  }
  // The visible panel at a visibleIndex clamped to the page; undefined when the page has none.
  private getVisiblePanelAt(visibleIndex: number): PanelModel {
    const visPanels = this.visiblePanelsCore;
    return visPanels[Math.max(0, Math.min(this.getPositionAtVisibleIndex(visibleIndex), visPanels.length - 1))];
  }
  private getTabbedMenuCss(cssClasses?: any): string {
    const css = cssClasses ?? this.cssClasses;
    return toCssClasses(
      css.tabsRoot,
      this.tabAlign === "left" && css.tabsLeft,
      this.tabAlign === "right" && css.tabsRight,
      this.tabAlign === "center" && css.tabsCenter
    );
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

export class PanelDynamicSingleInputBehavior extends QuestionRecordsSingleInputBehavior<PanelModel> {
  protected get panelDynamic(): QuestionPanelDynamicModel {
    return this.question as QuestionPanelDynamicModel;
  }
  protected getRecords(): Array<PanelModel> {
    return this.panelDynamic.visiblePanels;
  }
  // The outermost panel of the question.
  protected getRecordOfQuestion(question: Question): PanelModel {
    let parent = question.parent;
    while(!!parent && !!parent.parent) {
      parent = parent.parent;
    }
    return <PanelModel>parent;
  }
  protected isRecordValid(panel: PanelModel): boolean {
    return panel.validate(false, false);
  }
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    this.panelDynamic.onFirstRendering();
    return this.getDynamicSingleInputQuestions(question, checkDynamic);
  }
  protected getSingleQuestionLocTitleCore(): LocalizableString {
    const res = this.panelDynamic.locTemplateTitle;
    res.onGetTextCallback = (text: string): string => {
      const q = this.panelDynamic.singleInputQuestion;
      if (!q) return text;
      return this.processSingleInputTitle(text, this.getRecordOfQuestion(q));
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
  public getSingleInputAddTextCore(): string {
    if (!this.panelDynamic.canAddPanel) return undefined;
    return this.panelDynamic.addPanelText;
  }
  public singleInputAddItemCore(): void {
    this.panelDynamic.addPanelUI();
  }
  protected createSingleInputSummary(): QuestionSingleInputSummary {
    const pd = this.panelDynamic;
    return this.createRecordsSummary({
      noEntriesText: pd.locNoEntriesText,
      editText: pd.locEditPanelText,
      removeText: pd.locRemovePanelText,
      getTitle: (panel: PanelModel): LocalizableString => {
        const locText = new LocalizableString(pd, true, undefined, pd.locTemplateTitle.localizationName);
        locText.setJson(pd.locTemplateTitle.getJson());
        locText.onGetTextCallback = (text: string): string => {
          return this.processSingleInputTitle(pd.templateTitle, panel);
        };
        return locText;
      },
      canRemove: (): boolean => pd.canRemovePanel,
      remove: (panel: PanelModel): void => { pd.removePanelUI(panel); }
    });
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
        if (val > obj.panelCountLimit) return obj.panelCountLimit;
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