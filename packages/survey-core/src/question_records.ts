import { Base } from "./base";
import { IProgressInfo, IQuestion, ISurvey, ISurveyData, ISurveyImpl, ITextProcessor } from "./base-interfaces";
import { property } from "./decorators";
import { HashTable, Helpers } from "./helpers";
import { Question, QuestionItemValueGetterContext, QuestionValueGetterContext, ValidationContext } from "./question";
import { ActionContainer } from "./actions/container";
import { settings } from "./settings";
import { isFocusInsideOrIdle } from "./utils/focus-utils";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, VariableGetterContext } from "./conditions/conditionProcessValue";
import { TextContextProcessor } from "./textPreProcessor";
import { SurveyError } from "./survey-error";
import {
  DynamicDataFieldType, DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataSort,
  IDynamicDataSource
} from "./dynamic-data/dynamic-data-interfaces";
import {
  DynamicDataPageValidation, IDynamicDataPageState, IDynamicDataPageValidationOwner, findDuplicatePages, getReplacedRecordsRemap
} from "./dynamic-data/dynamic-data-page-validation";
import { createIndexes } from "./dynamic-data/dynamic-data-filter";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "./dynamic-data/dynamic-data-paging";
import { applyRecordChange } from "./dynamic-data/dynamic-data-record-remap";
import { IDynamicDataRecordCondition, IDynamicDataRecordScope } from "./dynamic-data/dynamic-data-record-visibility";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "./questionSingleInputSummary";
import { Action } from "./actions/action";
import { LocalizableString } from "./localizablestring";

export interface IDynamicDataRecordUniqueness {
  // The record keys whose values have to be unique; empty when none has to be.
  fields: Array<string>;
  // false: strings compare with toLocaleLowerCase.
  caseSensitive: boolean;
  // Owner-hidden records take part too.
  includeHidden: boolean;
  // Records outside the view - the filter excludes them - take part too.
  includeFilteredOut: boolean;
}
// What a value assignment takes before the value is stored and hands back after it (see
// QuestionRecordsModel.beginValueAssignment).
interface IDynamicDataValueAssignment {
  created: Array<number>;
}
// A write of one record field through an item, as the item prepared it (QuestionRecordItem.prepareRecordWrite).
export interface IRecordItemWrite {
  // The field as it is going to be stored: the write stops when it equals the stored one.
  fieldValue: any;
  // What the owner's updateItemValue receives.
  ownerValue: any;
  isDeleting: boolean;
}
/* A field is used for sorting only (the filter is an expression and needs no typing), so a value type
   that does not say how to compare is "any": the local sort then compares the raw values. "string" is
   also what a question that does not know its value type reports (an expression, a select question
   whose choices are not loaded yet), so it is not trusted: the values decide. */
function getFieldType(question: Question): DynamicDataFieldType {
  const type = question.getValueType();
  return type === "number" || type === "date" || type === "boolean" ? type : "any";
}
// What the list, the page validation and the paging helper call: one object, see helperOwner.
type RecordsHelperOwner = IDynamicDataOwner & IDynamicDataPageValidationOwner & IDynamicDataPagingOwner;

/* The question side shared by every question whose answer is a collection of records, and the
   coordination between such a question and its record list. The list computes
   (dynamic-data-list.ts), the question builds and renders its own rows or panels - its objects - and
   this class is what sits between the two: it creates and disposes the list and the question-side
   helpers, answers the changes of the list, and holds the question side of a caller-provided data
   source - the survey-data side of a source swap, the running state and the focus kept across a
   refill. The source itself, its capabilities and the loaded window belong to the list. It also
   coordinates the value assignment, the loading state and the disposal with the list.
   What the questions do with the helpers - a page leave, the validation of the records off the
   page, the record visibility of a question that pages, the page states kept for nested questions -
   runs here with the subclass's rules (the specialization hooks at the end): a subclass never sees
   the page validation. Rows, panels, columns and templates are the subclasses' terms. The matrix
   with fixed rows is one too: it defines its records itself and answers the hooks over its keyed
   answer.
   The list and the helpers are created on first use; dataListValue and _pageValidation never create.
   They talk to one private owner object (helperOwner) and not to the question, so the members they
   call never have to be public on a question.

   What a source does NOT change is where the records are kept while they are being edited:
   question.value is the loaded window, so the nested questions, the {row.x} / {panel.x} contexts,
   validation and getFilteredData keep working on exactly the records the respondent can see. What
   it does change is who owns them - see canSetValueToSurvey. */
export abstract class QuestionRecordsModel extends Question {
  private _dataList: DynamicDataList;
  private _paging: DynamicDataPagingController;
  private _pageValidation: DynamicDataPageValidation;
  private helperOwnerValue: RecordsHelperOwner;
  /* The owner the list (IDynamicDataOwner), the page validation (IDynamicDataPageValidationOwner) and
     the paging helper (IDynamicDataPagingOwner) talk to. It is built with the first helper, and its
     functions call the question's members when they are called, so an override or a spy on the
     question is honoured. */
  private get helperOwner(): RecordsHelperOwner {
    if (!this.helperOwnerValue) {
      this.helperOwnerValue = this.createHelperOwner();
    }
    return this.helperOwnerValue;
  }
  private createHelperOwner(): RecordsHelperOwner {
    const question = this;
    return {
      // IDynamicDataOwner: the question chooses the questions its records are made of (getFieldsOfQuestions).
      getFields: (): Array<IDynamicDataField> => question.getFields(),
      onDataListChanged: (change: IDynamicDataListChange): void => { question.onDataListChanged(change); },
      // IDynamicDataPageValidationOwner: the rules every records question shares; the rest is the question's.
      getDataList: (): DynamicDataList => question.dataList,
      isPageLeaveValidated: (): boolean => question.isPageLeaveValidated(),
      canTrackEditedRecords: (): boolean => question.isPagedByList,
      goToPageFromCode: (pageIndex: number): void => { question.paging.pageIndex = pageIndex; },
      validatePageObjects: (context: ValidationContext): boolean => question.validatePageObjects(context),
      setPropertyValue: (name: string, val: any): void => { question.setPropertyValue(name, val); },
      get isDisposed(): boolean { return question.isDisposed; },
      /* IDynamicDataPagingOwner: the question's paging state never has to be public for the paging
         helper. The state itself stays in the question's property hash (setPropertyValue above serves
         both helpers), which is what the renderers observe. The page moves are leavePage and
         cancelPendingPageMove. */
      getPropertyValue: (name: string): any => question.getPropertyValue(name),
      getLocalizationFormatString: (strName: string, ...args: any[]): string => question.getLocalizationFormatString(strName, ...args),
      get pageSize(): number { return question.pageSize; },
      get listPageSize(): number { return question.listPageSize; },
      get pageIndex(): number { return question.reportedPageIndex; },
      get pageCount(): number { return question.reportedPageCount; },
      get isCountKnown(): boolean { return question.paging.isCountKnown; },
      get isDesignMode(): boolean { return question.isDesignMode; },
      get isLoadingFromJson(): boolean { return question.isLoadingFromJson; },
      raiseSortByChanged: (oldValue: string, newValue: string): void => { question.raiseSortByChanged(oldValue, newValue); },
      leavePage: (isForward: boolean, move: () => void): boolean => question.leavePage(isForward, move),
      cancelPendingPageMove: (): void => { question.cancelPendingPageMove(); },
      // True while a page move waits for the asynchronous validators of the page it leaves.
      get isPageMovePending(): boolean { return question.getPropertyValue("isPageMovePending", false); }
    };
  }
  // A peek: it never creates the list.
  protected get dataListValue(): DynamicDataList {
    return this._dataList;
  }
  /* Every record-level read and write of the question goes through this list. Its source is a
     getter/setter pair over the question's storage (getListRecords / setListRecords) - never a
     captured array - so that the storage overrides of the question are honoured and every write
     replaces the array instead of mutating the one the question currently holds.
     The invariant: the objects - rows, panels - hold the records dataList.getCreatedIndexes() names,
     in that order: the records that pass the list filter, in its sort order, owner-hidden ones
     included. With neither set the created indexes are 0 ... count-1 and the objects, the records and
     question.value are parallel again, which is the state of every question until a filter or a sort
     is assigned. question.value always holds every record in record order: a filter never removes
     from it and a sort never reorders it. The record count (rowCount, panelCount) stops being the
     object count while a filter is active. */
  protected get dataList(): DynamicDataList {
    if (!this._dataList) {
      // createReadThrough loads the list, which raises a reset before _dataList is assigned:
      // onDataListChanged drops it.
      this._dataList = DynamicDataList.createReadThrough(this.helperOwner,
        (): Array<any> => this.getListRecords(),
        (records: Array<any>): void => { this.setListRecords(records); },
        (): number => this.getListRecordCount(), this.isRecordMembershipFixed());
      this._dataList.onError = (error: any, operation: DynamicDataOperation): void => {
        this.onSourceError(error, operation);
      };
      // The list is created on demand, so a page size that came from JSON has to be pushed here and
      // not only from its setter.
      this.paging.updatePageSize();
    }
    return this._dataList;
  }
  /* The paging helper gets an accessor and not the list: the list is created on demand, and the
     helper is first used while the list is being created. */
  protected get paging(): DynamicDataPagingController {
    if (!this._paging) {
      this._paging = new DynamicDataPagingController(this.helperOwner, (): DynamicDataList => this.dataList);
    }
    return this._paging;
  }
  // The questions ask for what they need done (leavePage, validateOffPage, ...); _pageValidation is
  // the peek.
  private get pageValidation(): DynamicDataPageValidation {
    if (!this._pageValidation) {
      this._pageValidation = new DynamicDataPageValidation(this.helperOwner);
    }
    return this._pageValidation;
  }
  public get isCompositeQuestion(): boolean {
    return true;
  }
  public get isContainer(): boolean { return true; }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  // recordIndex, not an object position: the other question may hold its objects (rows, panels) for
  // another set of records or in another order.
  public getSharedQuestionFromArray(name: string, recordIndex: number): Question {
    return !!this.survey && !!this.valueName ? <Question>(this.survey.getQuestionByValueNameFromRecord(this.valueName, name, recordIndex)) : null;
  }
  public getBindedQuestions(): Array<IQuestion> {
    if (!this.survey || !this.valueName) return [];
    return this.survey.getQuestionsByValueName(this.valueName);
  }
  protected isPropertyStoredInHash(name: string): boolean {
    // sortBy renders sortOrder and stores nothing of its own, so the serializer has to read the
    // accessor instead of looking for a hash entry that will never be there.
    return name !== "sortBy" && super.isPropertyStoredInHash(name);
  }
  /* The record fields the template questions of a dynamic panel or the column questions of a matrix
     contribute to the list: one per question, under its value name, and one more for a comment,
     which is stored under an ordinary key of the same record. */
  protected getFieldsOfQuestions(questions: Array<Question>): Array<IDynamicDataField> {
    const res = new Array<IDynamicDataField>();
    (questions || []).forEach((question: Question): void => {
      res.push({ name: question.getValueName(), dataType: getFieldType(question) });
      if (question.hasComment) {
        res.push({ name: question.getValueName() + settings.commentSuffix, dataType: "string" });
      }
    });
    return res;
  }
  /* A reset means the view was re-decided: a filter or a sort was assigned, or refreshView() was
     called. Which records have an object changes with it, so the objects are rebuilt.
     hasMaterializedView remembers that the objects were last built for a view: clearing the filter
     leaves hasView false and still has to rebuild. */
  private hasMaterializedView: boolean = false;
  private onDataListChanged(change: IDynamicDataListChange): void {
    const list = this._dataList;
    // The reset the list raises while it is being created.
    if (!list) return;
    if (change.type === "loading") {
      this.isDataLoading = change.isLoading;
      return;
    }
    if (change.type === "pageChanged") {
      this.forgetFocusIndex();
      this.syncPagingState();
      /* The objects that exist are the page: a page the list cuts - from question.value
         or from everything a read() source answered with - is rebuilt at once, through the path a
         remote read takes. A page of a source that pages itself is rebuilt when its read commits. */
      if (this.isPagedByList) {
        this.rebuildFromDataList(true);
      } else {
        this.refreshRenderedPage();
      }
      return;
    }
    // The record indexes the question keeps - its objects' records, the edited set of layer 2 - name
    // a record only until something is inserted, removed or moved in front of it. Only a list that
    // pages in memory creates the edited set here.
    applyRecordChange(change, this.isPagedByList ? this.pageValidation : this._pageValidation,
      (remap: (index: number) => number): void => {
        if (change.type === "recordMoved") {
          this.followRecordMove(remap);
        } else {
          this.remapBuiltItems(remap);
        }
      });
    /* A write the list pushed to a data source: with the array source over question.value the push
       IS the value write, a remote source has no such setter, so the question follows the window
       itself. The objects are not rebuilt - the one that was edited, added or removed is handled by
       the path that made the change. */
    if (list.isRemote && change.type !== "reset") {
      this.storeLoadedRecords();
      this.prepareRemoteWrite(change);
      this.runConditionsAfterRemoteWrite();
      return;
    }
    if (change.type !== "reset") return;
    this.syncPagingState();
    const isRemote = list.isRemote;
    const hasView = list.hasView || isRemote || this.isPagingActive;
    if (!hasView && !this.hasMaterializedView) return;
    this.hasMaterializedView = hasView;
    if (isRemote) {
      this.commitLoadedRecords();
    } else {
      this.rebuildFromDataList(false);
    }
  }
  /* A read committed: the loaded window becomes the question value. It is the inbound path - the
     value is stored, the survey hash is not written and no trigger, condition or navigation runs -
     and then the objects are rebuilt for the records the window holds. Nothing else may assign the
     value on a load. The position a refill kept is focused last: the objects it names exist now. */
  private commitLoadedRecords(): void {
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly).
    const oldValue = this.getStoredRecords();
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : oldValue;
    this.storeLoadedRecords();
    this.followReloadedRecords(oldRecords);
    this.rebuildFromDataList(false);
    const index = this.takeFocusIndexAfterRead();
    if (index > -1) {
      this.focusItemAfterRead(index);
    }
  }
  /* A read() source the list pages holds the whole storage, so layer 2 tracks its edited records by
     index - and a read that commits again (refresh(), a filter the source answers again) may bring
     them back at other indexes: another writer moved, added or removed records. The edited set, the
     states of nested paged questions and what the question keeps besides them follow their records
     into the new window, by key when the source names its records and by content otherwise
     (getReplacedRecordsRemap), so that an edited record is still validated wherever it is now. The
     objects are renumbered only by a question that keeps state under their records (the panel's
     remapKeptRecordIndexes): the rows a read replaces keep the records they were built for until the
     rebuild disposes them. Replacing the source starts over (see setDataSource). */
  private followReloadedRecords(oldRecords: any): void {
    if (!this.isPagedByList) return;
    const validation = this._pageValidation;
    const hasRecords = !!validation && validation.hasRecords;
    if (!hasRecords && !this.hasKeptRecordIndexes()) return;
    const newRecords = this.getStoredRecords();
    const oldArray = Array.isArray(oldRecords) ? oldRecords : [];
    const newArray = Array.isArray(newRecords) ? newRecords : [];
    const remap = getReplacedRecordsRemap(oldArray, newArray, this._dataList.keyField);
    if (hasRecords) {
      validation.cancelPendingMove();
      validation.onRecordsReplaced(oldArray, newArray, remap);
    }
    this.remapKeptRecordIndexes(remap);
  }
  /* With the array source over question.value a record write reaches the survey, and the survey then
     re-runs the conditions of every question - which is what recalculates an expression, a {row.x} or
     {panel.x} reference and the totals. A remote write never reaches the survey (canSetValueToSurvey),
     so the question runs its own. Re-entrancy is guarded and not forbidden for a reason: an
     expression writes its result back as a record field, and the nested run would only recompute what
     the outer one has just settled. */
  private isRunningRemoteWriteConditions: boolean = false;
  private runConditionsAfterRemoteWrite(): void {
    if (this.isRunningRemoteWriteConditions || !this.data) return;
    this.isRunningRemoteWriteConditions = true;
    try {
      this.runRemoteWriteConditions();
    } finally {
      this.isRunningRemoteWriteConditions = false;
    }
  }
  /* "the records are owned by a data source": the survey hash, the write routing, the capabilities
     and the count setters ask it. It is deliberately not "the list pages itself": a source that
     returns everything in one read is still a source, and its records are still not the question's
     to grow or truncate - but the list pages them exactly as it pages question.value. Who pages is
     isPagedByList. */
  protected get isRemoteData(): boolean {
    return !!this.dataListValue && this.dataListValue.isRemote;
  }
  /* Paging is on: the objects are built for the page, and an incremental update of the rendered
     table would work in page-local terms. Off in design mode and without a list. */
  protected get isPagingActive(): boolean {
    return !this.isDesignMode && !!this._dataList && this._dataList.pageSize > 0;
  }
  /* The list cuts the page: over question.value, or over the whole storage a read() source answered
     with. Every record is in memory, so the page is a slice and layer 2 can track the edited
     records. Its opposite is a source with readRange (list.isPagedBySource): the window IS the page
     and the records of the other pages are on the server. */
  protected get isPagedByList(): boolean {
    return this.isPagingActive && !this._dataList.isPagedBySource;
  }
  /* The objects are built for the records the list holds and not for 0 ... count-1. A remote window
     is a view of its own, because the count is the server total; a question that pages builds its
     objects for the page, so it takes the view path too. */
  protected get hasDataListView(): boolean {
    const list = this._dataList;
    return !!list && (list.hasView || this.hasMaterializedView || list.isRemote || this.isPagingActive);
  }
  /* The objects hold other records than the page names: a record became hidden or visible ahead of
     them, the page moved under them, or the records were replaced. The objects are read one by one:
     nothing is allocated for the answer. */
  protected isPageStale(): boolean {
    const list = this._dataList;
    if (!list || !this.areObjectsBuilt()) return false;
    const records = list.getMaterializedIndexes();
    for (let i = 0; i < records.length; i++) {
      const item = this.getItem(i);
      if (!(item instanceof QuestionRecordItem) || item.builtRecordIndex !== records[i]) return true;
    }
    return !!this.getItem(records.length);
  }
  /* The record indexes the objects were built for follow an insert, a remove or the records a read
     brought back. Every object is renumbered, also before the first build. An object whose record is
     gone - removed, or not found again by a reload - keeps -1: it is being disposed. */
  protected remapBuiltItems(remap: (index: number) => number): void {
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      if (item instanceof QuestionRecordItem && item.builtRecordIndex > -1) {
        const to = remap(item.builtRecordIndex);
        item.builtRecordIndex = to === undefined ? -1 : to;
      }
    }
  }
  /* The records of indexes, each with the object that holds it when it has one: the value-level
     results of a question whose objects are a view or a page walk the records, not the objects.
     position is the created position, -1 for a record the objects do not hold; a position past the
     built objects has no object either. */
  protected forEachRecordItem(indexes: Array<number>, func: (index: number, item: QuestionRecordItem, position: number) => void): void {
    const positions = this.dataList.getMaterializedPositions();
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      const position = positions[index] !== undefined ? positions[index] : -1;
      func(index, position > -1 ? this.getItem(position) || undefined : undefined, position);
    }
  }
  /* Three indexes: the record index names the record, visibleIndex is its position among the visible
     records of the whole list (the list's globalVisibleIndex; what the respondent navigates by),
     pageVisibleIndex its position among the visible objects; visibleIndex = pageStartVisibleIndex +
     pageVisibleIndex. 0 without a list. */
  protected get pageStartVisibleIndex(): number {
    return !!this.dataListValue ? this.dataListValue.getPageStartGlobalVisibleIndex() : 0;
  }
  /* The index the respondent and the expressions see for an item's record ({panelIndex},
     {rowIndex}) is the record index plus this offset: the position of the loaded window in the whole
     list for a data source that pages itself, 0 otherwise. The record index itself stays
     window-local - it is what the question storage is addressed by. */
  public getRecordNumberOffset(): number {
    return !!this.dataListValue ? this.dataListValue.getRecordNumberOffset() : 0;
  }
  /* A record without an object, read as a value. The record-item lookups create it, and so does the
     record visibility scope (updatePagedRecordsVisibility). */
  private createRecordItem(recordIndex: number): RecordValueItem {
    return new RecordValueItem(this, recordIndex, this.getListRecordAt(recordIndex), this.getRecordItemVariableName(),
      (item: RecordValueItem): IValueGetterContext => this.createRecordItemContext(item));
  }
  /* The record-item halves of getItemVisibleIndex and getItemByVisibleIndex.
     A record the page does not show has no object: its position among the visible records of the
     whole list, and the record at such a position, are the list's to answer. */
  protected getRecordItemVisibleIndex(item: ISurveyData): number {
    if (!(item instanceof RecordValueItem) || !this.dataListValue) return -1;
    return this.dataListValue.getGlobalVisibleIndex(item.getIndex());
  }
  protected getRecordItemByVisibleIndex(visibleIndex: number): QuestionRecordItem {
    if (!this.isPagingActive) return null;
    const recordIndex = this.dataListValue.getIndexAtGlobalVisibleIndex(visibleIndex);
    return recordIndex < 0 ? null : this.createRecordItem(recordIndex);
  }
  /* The view half of getExpressionItem: index names a record, and a record without an object -
     filtered out, off the page or not built - is read as a value. */
  protected getViewExpressionItem(index: number): QuestionRecordItem {
    const item = this.getItemByRecordIndex(index);
    if (!!item) return item;
    return index < this.dataListValue.loadedCount ? this.createRecordItem(index) : null;
  }
  /* The display values of one record, formatted key by key in place: getQuestion names the question
     that formats a key - one of the record's object, of the template or a shared one - and a key
     without a question keeps its value. With keysAsText a key whose question has another title is
     renamed to the title. Returns the record. */
  protected formatRecordDisplayValue(keysAsText: boolean, record: any, getQuestion: (key: string) => Question): any {
    const keys = Object.keys(record);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const question = getQuestion(key);
      if (!question) continue;
      const displayValue = question.getDisplayValue(keysAsText, record[key]);
      if (keysAsText && !!question.title && question.title !== key) {
        record[question.title] = displayValue;
        delete record[key];
      } else {
        record[key] = displayValue;
      }
    }
    return record;
  }
  /* The setting (settings.matrix.maxRowCount, settings.panel.maxPanelCount) is the number of objects
     one page may hold: without paging every object is on the one page, so it limits the total as
     well; with paging it limits the page size only (listPageSize). */
  protected get isRecordCountLimitedByPageMax(): boolean {
    return this.isDesignMode || !(this.listPageSize > 0);
  }
  /* The limit the record count is checked against: maxCount and the page maximum pageMax without
     paging; with paging explicitMaxCount alone - when the question sets it, since the default of
     maxCount is the setting. */
  protected getRecordCountLimit(maxCount: number, explicitMaxCount: number, pageMax: number): number {
    if (this.isRecordCountLimitedByPageMax) return Math.min(maxCount, pageMax);
    return explicitMaxCount > 0 ? explicitMaxCount : Number.MAX_SAFE_INTEGER;
  }
  protected collectNestedQuestionsOfItems(
    items: Array<{ questions: Array<Question> }>,
    questions: Array<Question>,
    visibleOnly: boolean,
    includeNested: boolean,
    includeItSelf: boolean
  ): void {
    if (!Array.isArray(items)) return;
    items.forEach(item => {
      item.questions.forEach(q => q.addNestedQuestion(questions, visibleOnly, includeNested, includeItSelf));
    });
  }
  protected runTriggersOnItems(
    items: Array<QuestionRecordItem>,
    getItemValue: (item: QuestionRecordItem) => any,
    variablePrefix: string
  ): void {
    items.forEach(item => {
      const val = getItemValue(item);
      if (!Helpers.isValueEmpty(val)) {
        item.runTriggers("", undefined, Helpers.createCopyWithPrefix(val, variablePrefix + "."));
      }
    });
  }
  /* Converts the result of a panelCountExpression/rowCountExpression into a record count.
     Invalid results (NaN, undefined, negative) become 0 and fractional results are rounded
     down. The clamping is done here, before the count is assigned, because the panelCount
     setter clamps in design mode only and the rowCount setter rejects out-of-range values
     instead of clamping them. */
  protected getRecordCountByExpressionValue(value: any, minCount: number, maxCount: number): number {
    let res = Math.floor(Helpers.getNumber(value));
    if (!(res > 0)) {
      res = 0;
    }
    if (res < minCount) {
      res = minCount;
    }
    if (maxCount >= 0 && res > maxCount) {
      res = maxCount;
    }
    return res;
  }
  /* defaultRowValue / defaultPanelValue: an empty question gets recordCount copies of it. Returns
     false when it does not apply - there is no default record value, or defaultValue is set - and the
     question's own default value is applied instead. */
  protected setDefaultRecordValues(defaultRecordValue: any, recordCount: number): boolean {
    if (this.isValueEmpty(defaultRecordValue) || !this.isValueEmpty(this.defaultValue)) return false;
    if (!this.isEmpty() || recordCount == 0) return true;
    const newValue: Array<any> = [];
    for (let i = 0; i < recordCount; i++) newValue.push(defaultRecordValue);
    this.value = newValue;
    return true;
  }
  /* The records decide the page; when it is not the page the objects hold, the rebuild runs the
     conditions of the new objects itself. Returns true when it rebuilt them. */
  protected rebuildStalePage(properties: HashTable<any>): boolean {
    if (!(this.updatePagedRecordsVisibility(properties) && this.isPageStale())) return false;
    this.rebuildFromDataList(false);
    return true;
  }
  /* When the list pages the progress is counted from the records - every visible record - as it is
     before the objects exist: the objects are one page. A source that pages itself counts its
     window: the other pages are on the server. updateByRecord adds one record's inputs. */
  protected getProgressInfoByRecords(updateByRecord: (res: IProgressInfo, record: any) => void): IProgressInfo {
    const res = Base.createProgressInfo();
    this.dataList.getVisibleIndexes().forEach((index: number): void => {
      updateByRecord(res, this.getListRecordAt(index) || {});
    });
    if (res.requiredQuestionCount === 0 && this.isRequired) {
      res.requiredQuestionCount = 1;
      res.requiredAnsweredQuestionCount = !this.isEmpty() ? 1 : 0;
    }
    return res;
  }
  /* The page size is decided by the question's mode as well - the display mode, single-input mode,
     design mode - and none of them tells the list: the points that depend on it re-read it here.
     Returns true when it changed. The list is not created for it. */
  protected syncListPageSize(): boolean {
    if (!this._dataList || this.isLoadingFromJson) return false;
    return this.paging.updatePageSizeIfChanged();
  }

  /* What the question keeps for its records when an ancestor (a dynamic panel that pages) rebuilds
     the object holding it: undefined when the list does not page in memory, since a question that
     does not page validates every object anyway. The ancestor reads it for the questions nested in
     its records (getPageStateOf). */
  private getPageState(): IDynamicDataPageState {
    if (!this.isPagedByList) return undefined;
    return this.pageValidation.getState(this.paging.pageIndex);
  }
  // The page is kept as well: the respondent comes back to where they were.
  private setPageState(state: IDynamicDataPageState): void {
    if (!state) return;
    this.pageValidation.setState(state);
    if (state.pageIndex > 0) {
      this.paging.pageIndex = state.pageIndex;
    }
  }
  /* What a question that pages keeps for its records when an ancestor (a dynamic panel that pages)
     rebuilds the object holding it: undefined for a question that is not a records question, and for
     one whose list does not page in memory, since a question that does not page validates every
     object anyway. */
  private static getPageStateOf(question: Question): IDynamicDataPageState {
    return question instanceof QuestionRecordsModel ? question.getPageState() : undefined;
  }
  protected hasPagedQuestions(questions: Array<Question>): boolean {
    return questions.some((q: Question): boolean => !!QuestionRecordsModel.getPageStateOf(q));
  }
  /* The ancestor side of the states above: what the paged questions nested in one record keep, by
     value name, while their objects are rebuilt. A record without such a question keeps empty
     states, which clear its entry - and need no page validation to be created for that - while states
     that are not empty create it. Only the panel keeps them: a paged question in a matrix detail
     panel starts over when its row is rebuilt. */
  protected keepPageStatesOfQuestions(recordIndex: number, questions: Array<Question>): void {
    const states: { [valueName: string]: IDynamicDataPageState } = {};
    questions.forEach((q: Question): void => {
      const state = QuestionRecordsModel.getPageStateOf(q);
      if (!!state) states[q.getValueName()] = state;
    });
    const validation = Object.keys(states).length > 0 ? this.pageValidation : this._pageValidation;
    if (!!validation) {
      validation.keepNestedStates(recordIndex, states);
    }
  }
  // The questions of the object built for a record take what was kept for it; a peek: nothing is
  // created for it.
  protected restorePageStatesOfQuestions(recordIndex: number, questions: Array<Question>): void {
    const states = !!this._pageValidation ? this._pageValidation.getNestedStates(recordIndex) : undefined;
    if (!states) return;
    questions.forEach((q: Question): void => {
      const state = states[q.getValueName()];
      if (!!state && q instanceof QuestionRecordsModel) {
        q.setPageState(state);
      }
    });
  }

  /* The page moves of DynamicDataPageValidation.leave: validate, clearIncorrectValues and
     validatedRecords are what carousel/tab Next and the panel's add pass instead of the page. */
  protected leavePage(isForward: boolean, move: () => void, validate?: (context: ValidationContext) => boolean,
    clearIncorrectValues?: boolean, validatedRecords?: Array<number>): boolean {
    return this.pageValidation.leave(isForward, move, validate, clearIncorrectValues, validatedRecords);
  }
  // Nothing is created for it: without the page validation no move is pending.
  protected cancelPendingPageMove(): void {
    if (!!this._pageValidation) {
      this._pageValidation.cancelPendingMove();
    }
  }
  // An inserted record is an edit layer 2 tracks (see DynamicDataPageValidation.markEdited).
  protected markRecordEdited(recordIndex: number): void {
    this.pageValidation.markEdited(recordIndex);
  }
  /* Shows the page that holds a visible position - where an added record is, or the record carousel
     and tab mode keep showing - as a move from code: the add was validated already. prepare runs
     only when the page changes, before the move: the page change rebuilds the objects at once, and
     the rebuild has to find what the question set aside for it. Returns whether the page changed. */
  protected showPageOfVisibleIndex(visibleIndex: number, prepare?: () => void): boolean {
    const list = this.dataList;
    const page = list.getPageOfVisibleIndex(visibleIndex);
    if (page === list.pageIndex) return false;
    if (!!prepare) prepare();
    this.paging.pageIndex = page;
    return true;
  }
  /* A question that pages validates the page that exists - Complete included - and then what the
     page cannot show: the edited records on other pages (layer 2) and a duplicate pair both of whose
     records are off the page. Only a full validation that fires its callbacks visits them; a
     validation on a value change and a quiet one stay on the page, and so does a source that pages
     itself. The question calls it once its page has passed. Returns true when there is nothing to
     visit. */
  protected validateOffPage(context: ValidationContext): boolean {
    if (!this.isPagedByList || !context.fireCallback || context.isOnValueChanged) return true;
    const pages = this.getOffPageDuplicatePages();
    if (this.isEveryPageValidated()) {
      for (let i = 0; i < this.dataList.pageCount; i++) {
        if (pages.indexOf(i) < 0) pages.push(i);
      }
    }
    return this.pageValidation.validateEditedRecords(context, pages);
  }
  /* The duplicates are looked for only when they are visited: the scan is O(records) per unique
     field, and a pair whose records both have no object has none the question's own check could put
     the error on. Returns the pages, without repeats; layer 2 walks them together with its own. */
  private getOffPageDuplicatePages(): Array<number> {
    const list = this.dataList;
    const uniqueness = this.getRecordUniqueness();
    const pages: Array<number> = [];
    uniqueness.fields.forEach((name: string): void => {
      const readKey = (index: number): any => {
        const record = this.getListRecordAt(index);
        return !!record ? record[name] : undefined;
      };
      findDuplicatePages(list, readKey, uniqueness).forEach((page: number): void => {
        if (pages.indexOf(page) < 0) pages.push(page);
      });
    });
    return pages;
  }
  /* The records the duplicate check on the page compares, as getRecordUniqueness names them, so that
     the check on the page and the scan off it agree: the loaded records - a duplicate on a page the
     question has not read is the server's business - or only the visible ones, and of the records
     with no object the owner-hidden ones only when they take part. A record with an object takes
     part as its object does: the question decides that, and reads and compares the keys itself. */
  protected forEachUniquenessRecord(func: (index: number, item: QuestionRecordItem, position: number) => void): void {
    const list = this.dataList;
    const uniqueness = this.getRecordUniqueness();
    const indexes = uniqueness.includeFilteredOut ? createIndexes(list.loadedCount) : list.getVisibleIndexes();
    this.forEachRecordItem(indexes, (index: number, item: QuestionRecordItem, position: number): void => {
      if (!item && !uniqueness.includeHidden && !list.isRecordVisible(index)) return;
      func(index, item, position);
    });
  }
  // Layer 1 is on: design mode never validates a page leave.
  private isPageLeaveValidated(): boolean {
    if (this.isDesignMode) return false;
    return !this.survey || !this.validationCallbacks.canLeavePageWithErrors;
  }

  /* rowsVisibleIf / templateVisibleIf under paging (Andrew's decision 2026-09-25): a page is a slice
     of the VISIBLE records, so the condition is evaluated over every record without an object and
     the list's hidden flags are written from it (DynamicDataRecordVisibility), without building a
     row or a panel: O(records) expression runs per condition run. The context is value-only -
     {row.x} / {panel.x} is the record's field, {rowIndex} / {panelIndex} its index, survey values
     as usual - and the record item is the {row} / {panel} variable of a copy of the run's
     properties, as a built row or panel is, so a custom function sees it as this.row / this.panel.
     A built object runs no visibility condition of its own (getRowsVisibleIfForRows, createNewPanel):
     a hidden record gets none, and the two cannot disagree. Limitation: an expression cell or an
     expression question the condition reads contributes its stored value.
     The expression is read only past the guards, and before areInvisibleElementsShowing is applied:
     the survey's onExpressionRunning fires in that mode too. A flag that changed changes the page
     count, which the list does not announce: the question syncs it. Returns whether a flag changed. */
  protected updatePagedRecordsVisibility(properties: HashTable<any>): boolean {
    // isPagingActive is false in design mode.
    if (!this.isPagingActive || this.isLoadingFromJson) return false;
    const expression = this.getExpressionFromSurvey(this.getRecordVisibleIfPropertyName());
    const isShowingAll = this.areInvisibleElementsShowing;
    const isChanged = this._dataList.updateRecordsVisibility(isShowingAll ? "" : expression,
      (index: number): any => this.getListRecordAt(index), (): IDynamicDataRecordScope => this.createRecordVisibilityScope(properties),
      isShowingAll ? undefined : this.getRecordConditionReader());
    if (isChanged) {
      this.syncPagingState();
    }
    return isChanged;
  }
  // Called only when the expression runs, once per run: one item is reset to every record.
  private createRecordVisibilityScope(properties: HashTable<any>): IDynamicDataRecordScope {
    const item = this.createRecordItem(-1);
    const newProps = Helpers.createCopy(properties);
    newProps[this.getRecordItemVariableName()] = item;
    return { item: item, properties: newProps };
  }

  /* The capabilities of a data source are declared by the presence of its optional methods: a source
     without insert gets no add button, one without remove no delete button, one without move no drag
     handles, and one without update makes every object read-only - a silently unsaved edit is worse
     than a disabled field, and an application that wants local-only edits over remote reads
     implements a no-op update. A question without a data source has every capability, except the
     membership operations of a question that defines its records itself (isRecordMembershipFixed).
     The list is not created for the answer. */
  protected canWriteRecords(operation: DynamicDataOperation): boolean {
    if (this.isRecordMembershipFixed() && (operation === "insert" || operation === "remove" || operation === "move")) return false;
    const list = this._dataList;
    return !list || !list.isRemote || list.hasCapability(operation);
  }
  /* A remove on a page the list cuts leaves it one record short, and the first record of the next
     page belongs on it now: the page is refilled, as a data source's remove refill does. A
     remove that emptied the last page moved the page back, and that page change rebuilt it already.
     pageIndexBefore: the page index the list had before the remove. */
  protected refillPageAfterRemove(pageIndexBefore: number): void {
    if (this.isPagedByList && this._dataList.pageIndex === pageIndexBefore) {
      this.rebuildFromDataList(false);
    }
  }
  /* The authored page size, 0 = no paging, stored under the property getPageSizePropertyName() names
     - the one the JSON and the property grid know (rowsPerPage, panelsPerPage). The question reads
     pageSize; the named property is its public face. */
  public get pageSize(): number {
    return this.getPropertyValue(this.getPageSizePropertyName());
  }
  public set pageSize(val: number) {
    this.paging.setPageSize(this.getPageSizePropertyName(), val);
    this.onPageSizeAssigned();
  }
  // internal, for tests and renderers
  public getDataList(): DynamicDataList {
    return this.dataList;
  }
  // internal: single-input mode reads every object, and nothing tells the list that it became active.
  public syncPageSizeWithMode(): void {
    this.syncListPageSize();
  }
  // A zero-based page index; always 0 while paging is off.
  public get pageIndex(): number { return this.reportedPageIndex; }
  public set pageIndex(val: number) { this.paging.pageIndex = val; }
  // The number of pages; 1 for an empty question and for one that does not page.
  public get pageCount(): number { return this.reportedPageCount; }
  /* False while the data source answers a read without a total: the record count (rowCount,
     panelCount) is then the number of records known to exist - a lower bound - and pageCount the
     number of pages found so far. Every source that hands over the whole storage leaves it true. */
  public get isCountKnown(): boolean { return this.paging.isCountKnown; }
  public get canGoNextPage(): boolean { return this.paging.canGoNextPage; }
  public get canGoPrevPage(): boolean { return this.paging.canGoPrevPage; }
  /* The respondent's page moves: a move forward validates the page it leaves. false = an error was
     found at once; true = moved, or waiting for asynchronous validators (see isPageMovePending). */
  public goToPage(index: number): boolean { return this.paging.goToPage(index); }
  public nextPage(): boolean { return this.paging.nextPage(); }
  public prevPage(): boolean { return this.paging.prevPage(); }
  /* The sort the records are displayed in: { field, direction } descriptors applied in array order,
     an empty array = no sort. It never reorders the question value. */
  public get sortOrder(): Array<IDynamicDataSort> { return this.paging.sortOrder; }
  public set sortOrder(val: Array<IDynamicDataSort>) { this.paging.sortOrder = val; }
  /* The serialized form of sortOrder: "price-;name" = price descending, then name ascending (see
     dynamic-data-sort.ts for the grammar). One storage and two faces - this is the current sort,
     so a sort made at runtime, a header click included, changes what toJSON() emits. */
  public get sortBy(): string { return this.paging.sortBy; }
  public set sortBy(val: string) { this.paging.sortBy = val; }
  /* What a click on a sortable header does: ascending, then descending, then not sorted. With
     addToSort the field is cycled inside the current sort instead of replacing it, which is the
     multi-field sort a modified header click makes. */
  public toggleSort(field: string, addToSort?: boolean): boolean { return this.paging.toggleSort(field, addToSort); }
  public clearSort(): void { this.paging.clearSort(); }
  /* A survey expression over the record values - the same language as visibleIf, with the record
     fields as its variables. A record that does not satisfy it has no object; the question value
     keeps every record. An empty string = no filter. It is not rowsVisibleIf / templateVisibleIf:
     that one is a per-object expression with the object's context and stays the owner-visibility
     layer. */
  public get filterExpression(): string { return this.paging.filterExpression; }
  public set filterExpression(val: string) { this.paging.filterExpression = val; }
  public refreshView(): void { this.paging.refreshView(); }
  private pagerActionsValue: ActionContainer;
  public get pagerActions(): ActionContainer {
    if (!this.pagerActionsValue) {
      this.pagerActionsValue = this.paging.createPagerActions(this.createActionContainer());
    }
    return this.pagerActionsValue;
  }
  // True while a page move waits for the asynchronous validators of the page it leaves.
  public get isPageMovePending(): boolean { return this.getPropertyValue("isPageMovePending", false); }
  // What the question reports. A zero-based page index; always 0 while paging is off.
  protected get reportedPageIndex(): number {
    return this.isPagingActive ? this.paging.pageIndex : 0;
  }
  // The number of pages; 1 for an empty question and for one that does not page.
  protected get reportedPageCount(): number {
    return this.isPagingActive ? this.paging.pageCount : 1;
  }

  // The assigned data source, read back from the list (assignedSource); nothing is created for it.
  protected getDataSource(): IDynamicDataSource {
    return !!this.dataListValue ? this.dataListValue.assignedSource : undefined;
  }
  // The survey-data side of the swap. The question follows the call with its own refresh, also for
  // the same source.
  protected setDataSource(val: IDynamicDataSource): void {
    const newValue = val || undefined;
    // Another storage: the records layer 2 tracks and the states kept for them name records of the
    // old one. Dropped before the swap, whose first read may commit inside it.
    if (!!this._pageValidation && newValue !== (!!this._dataList ? this._dataList.assignedSource : undefined)) {
      this._pageValidation.cancelPendingMove();
      this._pageValidation.clearRecords();
    }
    const list = this.dataList;
    if (list.assignedSource === newValue) return;
    const wasRemote = list.isRemote;
    /* The list resets its window and starts the first read. The two flags the questions need are
       already on it: isViewFrozenOnEdit (the membership of a view may not be re-decided by an edit
       made through one of the objects it materialized) is set when the list is created and holds for
       a remote source unchanged, and isReadThrough stays on but covers the question's own storage
       only. An assigned source is read, not read through, whatever its class - an
       ArrayDynamicDataSource and a SurveyDataDynamicDataSource included: the question is not told
       when the developer's array changes, so that change is seen after getDataList().refresh() and
       not at once. The list reads through again after a detach. Because of the frozen membership,
       refreshView() on a source that pages has to be a refresh(): the server decides which records
       are in the window, so re-deciding the view means re-reading it (see
       DynamicDataPagingController.refreshView). */
    list.assignSource(newValue, (): void => {
      if (!!newValue && !wasRemote)this.clearValueInSurveyData();
    });
    if (!newValue)this.restoreValueFromSurveyData();
  }
  /* Attaching a source: the answer the question already holds leaves the survey hash before the
     first read. It is one ordinary value change - attaching is a developer action, not a page load -
     and it is the only way to keep a stale local answer, which nobody can see any more, out of the
     submitted data. */
  private clearValueInSurveyData(): void {
    if (!this.data || this.isValueEmpty(this.data.getValue(this.getValueName()))) return;
    this.data.setValue(this.getValueName(), undefined, false, true, this.name);
  }
  // Detaching: the window is dropped and the question reads the survey hash again.
  private restoreValueFromSurveyData(): void {
    this.updateValueFromSurvey(!!this.data ? this.data.getValue(this.getValueName()) : undefined);
  }
  // A rejected read leaves the short window and its focused item in place: the kept position goes.
  private onSourceError(error: any, operation: DynamicDataOperation): void {
    if (operation === "read")this.forgetFocusIndex();
    if (!!this.survey) {
      this.survey.dynamicDataError(this, operation, error);
    }
  }
  // True while the data source is reading a page. The UI shows a loading state from it, and
  // question.isReady is false for exactly as long.
  @property({ defaultValue: false, onSet: (val: boolean, q: QuestionRecordsModel): void => { q.updateIsReady(); } }) isDataLoading: boolean;
  /* Read by SurveyModel.getRunningAsyncOperations(). Is the model still waiting for this source? A
     page that has not arrived, a page that is about to be read again once the pending edits are
     acknowledged, and an edit that has not been acknowledged are all asynchronous operations the
     survey has started. */
  public get isDynamicDataRunning(): boolean {
    const list = this._dataList;
    return !!list && list.isRemote && (list.isLoading || list.hasPendingRead || list.hasPendingWrites);
  }
  protected getIsQuestionReady(): boolean {
    return !this.isDataLoading && super.getIsQuestionReady();
  }
  /* A remote-backed question is excluded from the survey data: a page load never writes into the
     survey hash - it is not an answer - so an edit that did would leave the hash holding one page of
     a table nobody submitted. The records go to the source instead.
     Known limitation: expressions elsewhere in the survey that name this question ({matrix[0].col},
     {panel.length}) do not update on a remote edit. The {row.x} / {panel.x} contexts inside the
     objects and the question's own validation are unaffected - they read question.value, which is
     the window. */
  protected canSetValueToSurvey(): boolean {
    return !this.isRemoteData && super.canSetValueToSurvey();
  }
  /* The incoming direction of the same rule: while a source is attached, survey.data = ...,
     survey.setValue, mergeData and a setvalue trigger do not reach the question. The survey hash may
     then hold a value the question does not show; that is the caller's doing. */
  public updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    if (this.isRemoteData) return;
    super.updateValueFromSurvey(newValue, clearData);
  }
  /* The list side of an assignment is the begin/end pair below: every assignment of the value passes
     through here. The subclasses do their own work in two hooks - inside the list-side pair
     (onRecordsValueStored) and after it (onRecordsValueAssigned) - and update isAnswered there, after
     that work: the value is stored with updateIsAnswered = false, whatever the caller passed. */
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    const assignment = this.beginValueAssignment();
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly). A value that is not
    // an array is kept as it is - a keyed answer is never turned into one.
    const oldValue = this.getStoredRecords();
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : oldValue;
    super.setQuestionValue(newValue, false);
    this.onRecordsValueStored();
    this.endValueAssignment(assignment, oldRecords);
    this.onRecordsValueAssigned(oldRecords);
  }
  /* The list side of a value assignment. Every assignment of the question's value - by the survey,
     a trigger, a default value or one of its own objects - passes through its setQuestionValue, which
     calls beginValueAssignment before it stores the value and endValueAssignment after. The list
     reads the records through the value, so it sees them at once, but the views it cached over them
     it cannot: they are dropped. An assignment made outside the list also re-decides the membership:
     the created indexes are taken before it and compared after it, and the objects are rebuilt when
     it changed which records have one. An assignment the list itself is making is not a change from
     outside: begin answers nothing for it and nothing is allocated. The list is not created for any
     of this.
     The state is handed back in by setQuestionValue, never kept in a field: an assignment made from
     inside another one - a valueChangedCallback that writes through the list - runs both halves of
     its own in between. */
  private beginValueAssignment(): IDynamicDataValueAssignment {
    const list = this._dataList;
    if (!list || list.isWriting) return undefined;
    return { created: list.hasView ? list.getCreatedIndexes() : undefined };
  }
  /* oldRecords: the question's copy of the value it replaced. The new records are read here and not
     passed in: the rebuild of a changed membership can write the value. */
  private endValueAssignment(assignment: IDynamicDataValueAssignment, oldRecords: any): void {
    const list = this._dataList;
    if (!list) return;
    list.invalidateViews();
    this.syncPagingState();
    if (!assignment) return;
    if (!!assignment.created && !Helpers.isTwoValueEquals(assignment.created, list.getCreatedIndexes())) {
      this.rebuildFromDataList(false);
    }
    if (!this.isPagedByList) return;
    this.onRecordsReplaced(oldRecords, this.getStoredRecords());
    // The page is rebuilt when it names other records than its objects hold now.
    if (this.isPageStale()) {
      this.rebuildFromDataList(false);
    }
  }
  /* The validation half of an assignment from outside, for a list that pages in memory: the edited
     set follows the records it names across the insert, remove or move the assignment made
     (DynamicDataPageValidation.onRecordsReplaced), and a move that waits for its validators is
     dropped. */
  private onRecordsReplaced(oldRecords: any, newRecords: any): void {
    const validation = this._pageValidation;
    if (!validation) return;
    validation.cancelPendingMove();
    validation.onRecordsReplaced(Array.isArray(oldRecords) ? oldRecords : [], Array.isArray(newRecords) ? newRecords : []);
  }
  /* The records were replaced by a change of what defines them - the rows of the fixed matrix - and
     the question knows where each one went: the remap gives the new index of an old record, -1 for
     one that is gone. The edited set, the states kept for nested paged questions and the record
     indexes the question keeps besides them follow. Nothing is created for it, and the remap is asked
     for only when something keeps record indexes. */
  protected followRemappedRecords(createRemap: () => ((index: number) => number)): void {
    const validation = this._pageValidation;
    if (!!validation) {
      validation.cancelPendingMove();
    }
    const hasValidationRecords = !!validation && validation.hasRecords;
    if (!hasValidationRecords && !this.hasKeptRecordIndexes()) return;
    const remap = createRemap();
    if (hasValidationRecords) {
      validation.onRecordRemap(remap);
    }
    this.remapKeptRecordIndexes(remap);
  }
  // The value is stored and the list-side pair is still open.
  protected onRecordsValueStored(): void { }
  // The list-side pair is closed. oldRecords: a copy of the value the assignment replaced.
  protected onRecordsValueAssigned(oldRecords: any): void {
    this.updateItemsFromRecords(oldRecords);
  }
  /* The question is writing its records itself - a record on behalf of one of its objects, or what
     its objects hold: the assignment that write makes does not push the records back into the objects
     (updateItemsFromRecords). A depth: one write can run inside another, from a callback. */
  private recordWriteDepth: number = 0;
  protected get isWritingRecords(): boolean {
    return this.recordWriteDepth > 0;
  }
  protected writeRecords<T>(func: () => T): T {
    this.recordWriteDepth++;
    try {
      return func();
    } finally {
      this.recordWriteDepth--;
    }
  }
  /* An assignment from outside the objects - the survey, a trigger, a bound question - pushes the
     records into the objects that exist, and only into those whose record changed: a question bound
     to the same value receives the whole value on every write a sibling makes to one record field, so
     refreshing every object would make loading N records cost O(N^2). The objects are walked by
     position and each position is mapped to its record through the list: an object never looks up its
     own record here, which would be one more O(N) lookup per object.
     A record that is the same object as before may have been changed in place, and a value that is
     not a collection of records says nothing about them: those objects are refreshed. So is every
     object of a data source - its window is replaced by a read. */
  private updateItemsFromRecords(oldRecords: any): void {
    if (this.isWritingRecords) return;
    const newRecords = this.getStoredRecords();
    const isEveryChanged = !Helpers.isValueObject(oldRecords) || !Helpers.isValueObject(newRecords) || this.isRemoteData;
    const list = this.dataListValue;
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      const recordIndex = !!list ? list.materializedIndexToIndex(i) : i;
      const newRecord = this.getItemRecordInValue(newRecords, recordIndex, item);
      if (isEveryChanged || QuestionRecordsModel.isRecordChanged(this.getItemRecordInValue(oldRecords, recordIndex, item), newRecord)) {
        item.updateFromRecord(newRecord);
      }
    }
  }
  private static isRecordChanged(oldRecord: any, newRecord: any): boolean {
    if (oldRecord === newRecord && oldRecord !== undefined) return true;
    return DynamicDataList.isValueChanged(newRecord, oldRecord);
  }
  /* The record of an item in a value of the question: by record index in an array answer. The fixed
     matrix keys its answer by row name. */
  protected getItemRecordInValue(value: any, recordIndex: number, item: QuestionRecordItem): any {
    return Array.isArray(value) && recordIndex > -1 ? value[recordIndex] : undefined;
  }
  // The stored value, not the default: the records an assignment or a read replaces.
  protected getStoredRecords(): any {
    return this.getPropertyValueWithoutDefault("value");
  }
  /* A change of the question's value made while its objects did not exist: the first build runs the
     triggers the change would have run in them (takeValueChangedBeforeBuild). */
  private isValueChangedBeforeBuild: boolean = false;
  /* The question's own dependencies first, then every created object. What depends on the object's
     own record ({row.x}, {panel.x}) is re-run by the object that wrote it (notifyRecordWritten), not
     here: this runs on every survey change. */
  onAnyValueChanged(name: string, questionName: string): void {
    super.onAnyValueChanged(name, questionName);
    if (!this.areObjectsBuilt() && name === this.getValueName()) {
      this.isValueChangedBeforeBuild = true;
    }
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      item.onAnyValueChanged(name, questionName);
    }
  }
  /* The error walks visit the objects that exist and create none: a record without an object has
     shown no error. Every object is cleared and asked for running validators - a hidden one may
     still hold an error or wait for one - and the visible ones report their errors: a hidden object
     is never validated, so what it holds is stale. */
  public clearErrors(): void {
    super.clearErrors();
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      item.clearErrors();
    }
  }
  public getAllErrors(): Array<SurveyError> {
    let res = super.getAllErrors();
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return res;
      if (this.isItemVisible(item)) {
        res = res.concat(item.getAllErrors());
      }
    }
  }
  protected getIsRunningValidators(): boolean {
    if (super.getIsRunningValidators()) return true;
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return false;
      if (item.isRunningValidators()) return true;
    }
  }
  // Read once, by the first build of the objects.
  protected takeValueChangedBeforeBuild(): boolean {
    const res = this.isValueChangedBeforeBuild;
    this.isValueChangedBeforeBuild = false;
    return res;
  }
  /* A remove on a page the source reads again (the refill of a source that pages itself) is answered
     by a rebuild of every item on the page, which disposes the one the question has just focused.
     The position is kept here while that read is pending and taken back when the read commits
     (commitLoadedRecords), to focus the item that is at that position then. A second remove
     overwrites the position; a page change and a rejected read drop it. */
  private focusIndexAfterRead: number;
  protected keepFocusIndexForRead(index: number): void {
    const list = this._dataList;
    this.focusIndexAfterRead = !!list && list.isRemote && list.hasPendingRead && index > -1 ? index : undefined;
  }
  private forgetFocusIndex(): void {
    this.focusIndexAfterRead = undefined;
  }
  // Returns the kept position, or -1 when there is none, the read is not committed yet, or the focus
  // has moved out of the question by the time the answer arrives.
  private takeFocusIndexAfterRead(): number {
    const index = this.focusIndexAfterRead;
    const list = this._dataList;
    if (index === undefined || !list || list.hasPendingRead) return -1;
    this.focusIndexAfterRead = undefined;
    return isFocusInsideOrIdle(this.id, this.getWrapperElement()) ? index : -1;
  }
  /* The list goes after the question's objects: it drops its pending-request counter, so a page or a
     push that is still in flight cannot write into a question that is gone. */
  public dispose(): void {
    this.cancelPendingPageMove();
    super.dispose();
    this.disposeRecordObjects();
    if (!!this._dataList) {
      this._dataList.dispose();
    }
  }
  // The objects that have to go before the list does.
  protected disposeRecordObjects(): void { }
  /* The tail of setSurveyImpl, which the subclasses call last: isDesignMode is known only once the
     survey is attached, and the list may have been created before that - paging is off in the
     Creator, whatever the page size says. */
  /* The sort and the filter the JSON authored reach the list once the load is over. An authored one
     created the paging helper when it was set, so a question without one has nothing pending and
     nothing is created for it. */
  protected flushAuthoredView(): void {
    if (!!this._paging) {
      this._paging.flushAuthoredView();
    }
  }
  protected syncPageSizeWithSurvey(): void {
    if (!!this.dataListValue) {
      this.paging.updatePageSize();
    }
  }

  // The specialization hooks: what every records question answers.
  /* The records the list works with: the question's own storage, given to
     DynamicDataList.createReadThrough once. */
  protected abstract getListRecords(): Array<any>;
  protected abstract setListRecords(records: Array<any>): void;
  // The record fields the list knows (see getFieldsOfQuestions).
  protected abstract getFields(): Array<IDynamicDataField>;
  // The objects are re-created for the records the view - under paging, the page - holds now.
  protected abstract rebuildFromDataList(isPageMove: boolean): void;
  // A page of a source that pages itself was asked for: its objects arrive when the read commits.
  protected abstract refreshRenderedPage(): void;
  // The objects exist: generated rows, panels built for the first time. Objects that do not exist
  // are never stale.
  protected abstract areObjectsBuilt(): boolean;
  // What a write to the survey would have re-run after a write to a data source; guarded by
  // runConditionsAfterRemoteWrite.
  protected abstract runRemoteWriteConditions(): void;
  // The question's own objects on the page; the rest of the page validation is shared.
  protected abstract validatePageObjects(context: ValidationContext): boolean;
  /* One record as the question reads it without an object: the duplicate scan, the record
     visibility and the record items read through it. The matrix pads question.value up to rowCount
     with the default row value; a data source's window and a write in progress are the list's. */
  protected abstract getListRecordAt(index: number): any;
  // What a duplicate is among the records; asked only when the records without an object are scanned.
  protected abstract getRecordUniqueness(): IDynamicDataRecordUniqueness;
  // The property the authored page size is stored under (see pageSize).
  protected abstract getPageSizePropertyName(): string;
  // The property the record visibility expression is stored under (rowsVisibleIf, templateVisibleIf).
  protected abstract getRecordVisibleIfPropertyName(): string;
  /* The page size the list gets at runtime. Usually the authored one; a carousel pages one panel at
     a time whatever panelsPerPage says, and single-input mode is its own paging and builds every
     object. */
  protected abstract get listPageSize(): number;
  // The objects, by created position and by record.
  public abstract getItem(index: number): QuestionRecordItem;
  // An object the question shows: a hidden one reports no errors (see getAllErrors).
  protected abstract isItemVisible(item: QuestionRecordItem): boolean;
  public abstract getItemByRecordIndex(recordIndex: number): QuestionRecordItem;
  // The record an item - a row, a panel - reads and writes.
  public abstract getItemData(item: ISurveyData): any;
  /* The index of the item record in the question storage. It is the only index two questions bound
     to one value share: they may create objects for a different set of records (a filtered list) or
     in a different order (a sorted one). */
  public abstract getItemRecordIndex(item: ISurveyData): number;
  // The value an item's {matrix} / {panel} variable reads.
  public abstract getFilteredData(): any;
  /* A write of an item's record: val is the field value for a panel and the whole proposed row for a
     matrix row (see QuestionRecordItem.prepareRecordWrite). */
  public abstract updateItemValue(item: ISurveyData, name: string, val: any, isDeletingValue: boolean): void;
  /* The item's position among the visible records of the whole list ({visiblePanelIndex}, the
     row's visibleIndex), and the item at such a position - an object when the record has one, a
     record read as a value when it has not (the question pages). */
  public abstract getItemVisibleIndex(item: ISurveyData): number;
  public abstract getItemByVisibleIndex(visibleIndex: number): QuestionRecordItem;
  // internal: the item {matrix[index].x} / {panel[index].x} reads. index is a record index; a record
  // without a row or a panel - filtered out, off the page or not built - is read as a value.
  public abstract getExpressionItem(index: number): QuestionRecordItem;
  // A record without an object, read as a value: the variable name ({row}, {panel}) and the context
  // the record is read through are the question's.
  protected abstract getRecordItemVariableName(): string;
  protected abstract createRecordItemContext(item: QuestionRecordItem): IValueGetterContext;

  // The specialization hooks with a default.
  /* The item at a position is focused once the objects of a committed read exist. Only a committed read
     of an assigned source reaches it; the default: nothing to focus (the fixed matrix has no source). */
  protected focusItemAfterRead(index: number): void { }
  /* The question defines which records exist and in what order (the rows of the fixed matrix): the
     list it creates refuses to insert, remove or move one, and so does its default source. */
  protected isRecordMembershipFixed(): boolean {
    return false;
  }
  /* A full validation visits every page of the view, not only the pages of the edited records: the
     records exist whether or not the respondent opened their page (the rows of the fixed matrix).
     The pages are visited one at a time, so only one page of objects exists at once. */
  protected isEveryPageValidated(): boolean {
    return false;
  }
  /* The visibility a record has of its own under paging, beside the record visibility expression (the
     fixed matrix: a row's visibleIf and visible flag). undefined: no record has one, which is the
     default; the reader is asked for one record at a time. */
  protected getRecordConditionReader(): (index: number) => IDynamicDataRecordCondition {
    return undefined;
  }
  /* Runs after every assignment of the page size, whatever the value - also one that does not change
     it, which onPropertyValueChanged would skip: the question refreshes what it renders. */
  protected onPageSizeAssigned(): void { }
  // The length getListRecords() would return.
  protected getListRecordCount(): number {
    const records = this.getListRecords();
    return Array.isArray(records) ? records.length : 0;
  }
  /* Mirrors the paging state of the list into the question (see DynamicDataPagingController.syncState).
     The list announces a page index it had to clamp, but not a page count that changed because a
     record became hidden or because the records were replaced: those points call this. */
  protected syncPagingState(): void {
    if (!this.dataListValue) return;
    this.paging.syncState();
  }
  /* A move does not carry the objects: they keep their positions and take the records of their
     positions. The default: the objects follow their records (remap renumbers them). */
  protected followRecordMove(remap: (index: number) => number): void {
    this.remapBuiltItems(remap);
  }
  /* The storage half alone: used after every write the list pushed to the source. The object the
     respondent is typing in already holds the new value, and a rebuild would dispose it under the
     edit (the frozen-membership rule). */
  protected storeLoadedRecords(): void {
    this.storeQuestionValue(this.dataList.getLoadedRecords());
  }
  // After a write to a data source was stored, before the conditions run; not guarded against
  // re-entrancy. The default: nothing to prepare.
  protected prepareRemoteWrite(change: IDynamicDataListChange): void { }
  /* Record indexes the question keeps besides its objects and the edited set: a read that commits
     again renumbers them with its remap. The default: the question keeps none. */
  protected hasKeptRecordIndexes(): boolean {
    return false;
  }
  protected remapKeptRecordIndexes(remap: (index: number) => number): void { }
  /* sortBy is computed from sortOrder and nothing raises its change on its own (see
     DynamicDataPagingController.setSortOrderValue). Base.propertyValueChanged is protected, so the
     question raises it. */
  protected raiseSortByChanged(oldValue: string, newValue: string): void {
    this.propertyValueChanged("sortBy", oldValue, newValue);
  }
}

// The question-level context of matrixdynamic and paneldynamic: {matrix[2].col1}, {panel[2].q1}.
export abstract class QuestionRecordsValueGetterContext extends QuestionValueGetterContext {
  /* Design mode with an index: whether the design-time answer applies. When it does, its result is
     returned as it is - undefined included. */
  protected hasDesignValue(params: IValueGetterContextGetValueParams): boolean {
    return true;
  }
  protected abstract getDesignValue(params: IValueGetterContextGetValueParams): IValueGetterInfo;
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const index = params.index;
    if (index > -1 && this.question.isDesignMode && this.hasDesignValue(params)) return this.getDesignValue(params);
    if (index > -1) {
      // The index names a record of the value, and so does the index a bound question passes: the
      // row or panel that holds it, or - when the record has none - the record read as a value.
      const item = (<QuestionRecordsModel>this.question).getExpressionItem(index);
      if (!!item) {
        params.isRoot = false;
        return item.getValueGetterContext().getValue(params);
      }
      return { isFound: false, value: undefined, context: this };
    }
    if (!params.createObjects && this.question.isEmpty()) return { isFound: params.path.length === 0, value: undefined };
    return super.getValue(params);
  }
}

export abstract class QuestionRecordItemGetterContext extends QuestionItemValueGetterContext {
  constructor(protected item: QuestionRecordItem) {
    super();
  }
  protected getIndex(): number { return this.item.getIndex(); }
  protected getQuestionData(): Question { return this.item.data; }
  protected get questionName(): string {
    return "";
  }
  protected abstract getSpecificValue(params: IValueGetterContextGetValueParams): IValueGetterInfo;
  protected abstract getNextName(): string;
  protected abstract getPrevName(): string;
  protected get variableName(): string {
    return this.item.getVariableName();
  }
  protected abstract getItemValue(name: string): any;
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length === 0) return undefined;
    // context variables ({row.col1}, {PANEL.q1}, {prevRow.col1}, ...) are case-insensitive
    const firstName = path[0].name.toLocaleLowerCase();

    if (path.length === 1) {
      const val = this.getItemValue(path[0].name);
      if (val !== undefined) {
        return { isFound: true, value: val, context: this };
      }

      if (this.questionName && firstName === this.questionName.toLocaleLowerCase()) {
        const matrix = this.item.data;
        return { isFound: true, context: matrix.getValueGetterContext(), value: matrix.getFilteredData() };
      }
    }

    if (path.length > 1) {
      const dIndex = firstName === this.getPrevName().toLocaleLowerCase() ? -1 : firstName === this.getNextName().toLocaleLowerCase() ? 1 : 0;
      if (dIndex !== 0) {
        const index = this.visibleIndex + dIndex;
        const item = this.getVisibleItem(index);
        if (!item) return { isFound: true, value: undefined, context: this };
        path[0].name = this.variableName;
        return item.getValueGetterContext().getValue(params);
      }
    }

    const res = this.getSpecificValue(params);
    if (res) return res;

    const isVarPrefix = firstName === this.variableName.toLocaleLowerCase();
    if (isVarPrefix || !params.isRoot) {
      if (isVarPrefix) {
        path.shift();
      }
      let res = super.getValue(params);
      if (!!res && res.isFound) return res;
      const allValues = this.item.getAllValues();
      if (params.isRoot) {
        res = this.getValueFromBindedQuestions(path, allValues);
        if (!!res) return res;
      }
      return new VariableGetterContext(allValues).getValue(params);
    }
    return undefined;
  }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const qs = this.item.getQuestionsByValueName(name, true);
    if (qs.length > 0) {
      res.isFound = true;
      res.obj = qs[0];
      res.context = qs[0].getValueGetterContext();
    }
  }
  /* The neighbour comes from the view, not from the objects that exist: the first panel or row of a
     page has a previous record, it just has no object. The owner answers with the object's item or
     with the record read as a value. */
  protected getVisibleItem(index: number): QuestionRecordItem {
    const data = this.item.data;
    return !!data ? data.getItemByVisibleIndex(index) : null;
  }
  // The position among the visible records of the whole list, not among the objects of the page.
  protected get visibleIndex(): number {
    const data = this.item.data;
    return !!data ? data.getItemVisibleIndex(this.item) : -1;
  }
  /* The RECORD index, so that a stored {panelIndex} / {rowIndex} expression keeps meaning the same
     record when a filter or a sort changes which objects exist - and in the whole list, so that
     "Participant 23" is record 23 on every page of a data source that pages itself. item.getIndex()
     is the window-local index the storage is addressed by; the offset turns it into the number the
     respondent sees. 0-based: the callers add 1 where the variable is 1-based. */
  protected getRecordNumber(): number {
    const data = this.item.data;
    return this.item.getIndex() + (!!data ? data.getRecordNumberOffset() : 0);
  }
  protected getItemVariableNames(): Array<string> {
    return [];
  }
  public getContextKeys(keys?: any): { [key: string]: any } {
    const res: { [key: string]: any } = {};
    let names = this.getItemVariableNames();
    if (!keys || !this.isItemDependenciesTrackable() || this.isContainerValueChanged(keys)) {
      names = names.concat([this.variableName, this.questionName, this.getPrevName(), this.getNextName()])
        .concat(this.getRelatedItemNames());
    }
    names.forEach((name) => {
      if (name) {
        res[name] = this.item;
        // expressions may reference variables in any case ({parentpanel.q1} vs "parentPanel")
        const lowerName = name.toLowerCase();
        if (lowerName !== name) {
          res[lowerName] = this.item;
        }
      }
    });
    return res;
  }
  protected getRelatedItemNames(): Array<string> {
    return [];
  }
  /* An item whose expressions calculate over filtered (visible) data - a matrix total row -
     can change on any value change (e.g. row visibility), so its dependencies cannot be
     analyzed statically and its context names are always reported as changed */
  protected isItemDependenciesTrackable(): boolean {
    return true;
  }
  private isContainerValueChanged(keys: any): boolean {
    let container: any = this.item.data;
    while(!!container) {
      const valueName = typeof container.getValueName === "function" ? container.getValueName() : container.name;
      if (!!valueName && Object.prototype.hasOwnProperty.call(keys, valueName)) return true;
      let itemData = container.data;
      if (itemData instanceof QuestionRecordItem) {
        itemData = itemData.data;
      }
      /* Walk up through container questions that store the data (nested matrices/panels via
         their item, custom questions directly) until the survey level is reached */
      container = !!itemData && itemData !== container && typeof itemData.getValueName === "function" ? itemData : undefined;
    }
    return false;
  }
}

export abstract class QuestionRecordItem implements ISurveyData, ISurveyImpl, IObjectValueContext {

  protected isSettingValue: boolean = false;
  private textPreProcessor: TextContextProcessor;
  /* The record the object - a row or a panel - was built for, kept in step with the list's inserts
     and removes. When the page changes the list already names the records of the new page: whether
     the objects are the page is decided by comparing the two, and an object that is about to be
     disposed can no longer be asked for its record through the mapping - a panel's record is where
     the state of the paged questions nested in it is kept. -1: built for no record (a total row, a
     record read as a value, an object whose record is gone). */
  public builtRecordIndex: number = -1;
  constructor(public data: QuestionRecordsModel) {
    this.textPreProcessor = new TextContextProcessor(this);
  }
  abstract getValueGetterContext(): IValueGetterContext;
  getSurveyData(): ISurveyData {
    return this;
  }
  getTextProcessor(): ITextProcessor {
    return this.textPreProcessor;
  }

  public abstract getQuestionsByValueName(name: string, caseInsensitive?: boolean): Array<Question>;
  public abstract getVariableName(): string;
  protected abstract getQuestionByName(name: string): IQuestion;

  public abstract getIndex(): number;

  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  getValue(name: string): any {
    return this.getAllValues()[name];
  }
  public setValue(name: string, newValue: any): void {
    this.writeRecordValue(name, newValue, false);
  }

  getAllValues(): any {
    return this.data.getItemData(this);
  }

  abstract getComment(name: string): string;
  public setComment(name: string, newValue: string, locNotification: any): void {
    this.writeRecordValue(name, newValue, true);
  }
  /* One write of a question of the item into the item's record. A comment is the field
     name + commentSuffix of the same record. The other questions on the same value name take the
     value first: a matrix row composes the record it proposes from its questions, and a stale twin
     would put the old value back. The item prepares the write and may refuse it; a field that would
     not change stops the write before the owner, the triggers and the notification. */
  private writeRecordValue(name: string, newValue: any, isComment: boolean): void {
    if (this.isSettingValue) return;
    if (!isComment) {
      this.updateSharedQuestionsValue(name, newValue);
    }
    const write = this.prepareRecordWrite(name, newValue, isComment);
    if (!write) return;
    const fieldName = isComment ? name + settings.commentSuffix : name;
    if (!this.isValueChanged(fieldName, write.fieldValue)) return;
    this.data.updateItemValue(this, fieldName, write.ownerValue, write.isDeleting);
    this.runTriggersOnSetValue(fieldName, newValue);
    this.notifyRecordWritten();
    this.onRecordWritten(name, isComment);
  }
  /* Returns undefined to refuse the write. The default hands the owner the field value, unbound: the
     owner stores it, and the question keeps its own. */
  protected prepareRecordWrite(name: string, newValue: any, isComment: boolean): IRecordItemWrite {
    return { fieldValue: newValue, ownerValue: Helpers.getUnbindValue(newValue), isDeleting: false };
  }
  // After a write that reached the owner.
  protected onRecordWritten(name: string, isComment: boolean): void { }
  /* The owner's value was assigned from outside the item: the record is pushed into the questions,
     which do not write it back. */
  public updateFromRecord(record: any): void {
    const questions = this.questions;
    for (let i = 0; i < questions.length; i++) {
      this.updateQuestionFromRecord(questions[i], record);
    }
  }
  protected updateQuestionFromRecord(question: Question, record: any): void {
    const name = question.getValueName();
    question.updateValueFromSurvey(!!record ? record[name] : undefined);
    question.updateCommentFromSurvey(!!record ? record[name + settings.commentSuffix] : undefined);
  }
  // The questions receive values the item does not write back; the flag nests.
  protected runSettingValue(func: () => void): void {
    const prev = this.isSettingValue;
    this.isSettingValue = true;
    try {
      func();
    } finally {
      this.isSettingValue = prev;
    }
  }

  getFilteredProperties(): any {
    return { survey: this.getSurvey(), [this.getVariableName()]: this };
  }
  findQuestionByName(name: string): IQuestion {

    if (!name) return undefined;
    const prefix = this.getVariableName() + ".";
    if (name.indexOf(prefix) === 0) {
      return this.getQuestionByName(name.substring(prefix.length));
    }
    const survey = this.getSurvey();
    return !!survey ? survey.getQuestionByName(name) : null;
  }

  public abstract get questions(): Array<Question>;
  public runTriggers(name: string, value: any, keys?: any): void {
    if (!name && !keys) return;
    this.questions.forEach(q => q.runTriggers(name, value, keys));
  }
  /* The questions of a panel item are the panel's, nested panels included, in the order
     PanelModel.onAnyValueChanged reaches them through its elements. */
  public onAnyValueChanged(name: string, questionName: string): void {
    const questions = this.questions;
    for (let i = 0; i < questions.length; i++) {
      questions[i].onAnyValueChanged(name, questionName);
    }
  }
  /* After a write of this item reached the owner: its own questions re-run what reads the record
     through the item variable ({row.x}, {panel.x}). The other items are not told. */
  private notifyRecordWritten(): void {
    this.onAnyValueChanged(this.getVariableName(), "");
  }
  // The errors the item's questions show; the owner asks the visible items only.
  public getAllErrors(): Array<SurveyError> {
    let res: Array<SurveyError> = [];
    const questions = this.questions;
    for (let i = 0; i < questions.length; i++) {
      const errors = questions[i].getAllErrors();
      if (errors && errors.length > 0) {
        res = res.concat(errors);
      }
    }
    return res;
  }
  public isRunningValidators(): boolean {
    const questions = this.questions;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].isRunningValidators) return true;
    }
    return false;
  }
  public clearErrors(): void {
    const questions = this.questions;
    for (let i = 0; i < questions.length; i++) {
      questions[i].clearErrors();
    }
  }

  protected runTriggersOnSetValue(name: string, newValue: any): void {
    const questions = this.questions;
    const suffix = settings.commentSuffix;
    if (name.endsWith(suffix)) {
      name = name.substring(0, name.length - suffix.length);
      const cQ = this.getQuestionByName(name);
      if (!!cQ) {
        newValue = cQ.value;
      }
    }
    const triggerName = this.getVariableName() + "." + name;
    for (var i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.getValueName() !== name) {
        q.checkBindings(name, newValue);
      }
      q.runTriggers(triggerName, newValue);
    }
    /* The record index, not the position of this item: a question bound to the same value may have
       created its objects for a different set of records or in a different order. */
    const index = this.data.getItemRecordIndex(this);
    if (index < 0) return;
    const bindedQuestions = this.data.getBindedQuestions();
    bindedQuestions.forEach((q: IQuestion) => {
      if (q === this.data || !(q instanceof QuestionRecordsModel)) return;
      const item = q.getItemByRecordIndex(index);
      if (!!item) {
        const triggerName = item.getVariableName() + "." + name;
        item.runTriggers(triggerName, newValue);
      }
    });
  }

  protected updateSharedQuestionsValue(name: string, value: any): void {
    const questions = this.getQuestionsByValueName(name);
    if (questions.length > 1) {
      for (let i = 0; i < questions.length; i ++) {
        if (!Helpers.isTwoValueEquals(questions[i].value, value)) {
          this.runSettingValue((): void => questions[i].updateValueFromSurvey(value));
        }
      }
    }
  }

  protected isValueChanged(name: string, newValue: any): boolean {
    const oldItemData = this.data.getItemData(this);
    const oldValue = !!oldItemData ? oldItemData[name] : undefined;
    return DynamicDataList.isValueChanged(newValue, oldValue);
  }

  protected getSharedQuestionByName(columnName: string): Question {
    return !!this.data
      ? this.data.getSharedQuestionFromArray(columnName, this.getIndex())
      : null;
  }
}

/* A record that has no object - an owner that pages builds objects for the current page only - seen
   by an expression as a value: {panel.x} / {row.x} is the record's field, the index variables are
   the record's, and nothing inside it is a question. What reads the record this way: the
   {prevPanel.x} / {nextRow.x} neighbours of the first and last object of a page, and
   templateVisibleIf / rowsVisibleIf, which decide the page before any object exists. It is never
   written through. */
class RecordValueItem extends QuestionRecordItem {
  constructor(data: QuestionRecordsModel, private recordIndex: number, private record: any,
    private variableName: string, private createContext: (item: RecordValueItem) => IValueGetterContext) {
    super(data);
  }
  public reset(recordIndex: number, record: any): void {
    this.recordIndex = recordIndex;
    this.record = record;
  }
  public getValueGetterContext(): IValueGetterContext {
    return this.createContext(this);
  }
  public getQuestionsByValueName(name: string, caseInsensitive?: boolean): Array<Question> {
    return [];
  }
  public getVariableName(): string {
    return this.variableName;
  }
  protected getQuestionByName(name: string): IQuestion {
    return null;
  }
  public getIndex(): number {
    return this.recordIndex;
  }
  public getAllValues(): any {
    return this.record || {};
  }
  public setValue(name: string, newValue: any): void { }
  public getComment(name: string): string {
    const res = this.getAllValues()[name + settings.commentSuffix];
    return !!res ? res : "";
  }
  public setComment(name: string, newValue: string, locNotification: boolean): void { }
  public get questions(): Array<Question> {
    return [];
  }
}
// A record object as the single-input steps see it: a matrix row or a dynamic panel.
interface ISingleInputRecord {
  visibleQuestions: Array<Question>;
  hasValueAnyQuestion(visibleOnly?: boolean): boolean;
}

interface IRecordsSingleInputSummaryOptions<TRecord> {
  noEntriesText: LocalizableString;
  editText: LocalizableString;
  removeText: LocalizableString;
  getTitle: (record: TRecord) => LocalizableString;
  canRemove: (record: TRecord) => boolean;
  remove: (record: TRecord) => void;
}

// The single-input steps of a records question: a step is a visible question of a record.
export abstract class QuestionRecordsSingleInputBehavior<TRecord extends ISingleInputRecord> extends QuestionSingleInputBehavior {
  protected get recordsQuestion(): QuestionRecordsModel {
    return this.question as QuestionRecordsModel;
  }
  protected abstract getRecords(): Array<TRecord>;
  // Not always a record: the lookup is also asked for the question itself and for its parents.
  protected abstract getRecordOfQuestion(question: Question): TRecord;
  protected abstract isRecordValid(record: TRecord): boolean;

  // Single-input mode is its own paging and walks every record: the list is told before they are read.
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    this.recordsQuestion.syncPageSizeWithMode();
    return super.getSingleInputQuestionsCore(question, checkDynamic);
  }
  // The steps of a question that adds and removes records: the questions of every record that is
  // empty or invalid, the questions of the current record when it is complete, and the summary.
  protected getDynamicSingleInputQuestions(question: Question, checkDynamic: boolean): Array<Question> {
    this.recordsQuestion.syncPageSizeWithMode();
    const unfinished = new Array<Question>();
    if (checkDynamic) {
      const records = this.getRecords();
      for (let i = 0; i < records.length; i ++) {
        const record = records[i];
        if (!record.hasValueAnyQuestion(true) || !this.isRecordValid(record)) {
          this.addRecordQuestions(unfinished, record);
        }
      }
    }
    const res = new Array<Question>();
    if (!!question && question !== this.question && unfinished.indexOf(question) < 0) {
      this.addRecordQuestions(res, this.getRecordOfQuestion(question));
    }
    unfinished.forEach(q => res.push(q));
    if (this.singleInputSummaryShown && res.length > 0) {
      res.unshift(this.question);
    }
    res.push(this.question);
    return res;
  }
  private addRecordQuestions(res: Array<Question>, record: TRecord): void {
    if (!!record) {
      record.visibleQuestions.forEach(q => res.push(q));
    }
  }
  protected getSingleQuestionOnChange(index: number): Question {
    const records = this.getRecords();
    if (records.length > 0) {
      if (index < 0 || index >= records.length) index = records.length - 1;
      const vQs = records[index].visibleQuestions;
      if (vQs.length > 0) {
        return vQs[0];
      }
    }
    return null;
  }
  protected singleInputMoveToFirstCore(): void {
    const question = this.question.singleInputQuestion;
    if (!!question) {
      this.editRecord(this.getRecordOfQuestion(question));
    }
  }
  protected editRecord(record: TRecord): void {
    if (!record) return;
    const qs = record.visibleQuestions;
    // The summary step asks for the record of the question itself, which is not a record.
    if (Array.isArray(qs) && qs.length > 0) {
      this.setSingleInputQuestion(qs[0]);
    }
  }
  protected createRecordsSummary(options: IRecordsSingleInputSummaryOptions<TRecord>): QuestionSingleInputSummary {
    this.recordsQuestion.syncPageSizeWithMode();
    const res = new QuestionSingleInputSummary(this.question, options.noEntriesText);
    const items = new Array<QuestionSingleInputSummaryItem>();
    this.getRecords().forEach(record => {
      const locText = options.getTitle(record);
      const btnEdit = new Action({ locTitle: options.editText, action: () => { this.editRecord(record); } });
      const btnRemove = options.canRemove(record) ?
        new Action({ locTitle: options.removeText, action: () => { options.remove(record); } }) : undefined;
      items.push(new QuestionSingleInputSummaryItem(locText, btnEdit, btnRemove));
    });
    res.items = items;
    return res;
  }
}
