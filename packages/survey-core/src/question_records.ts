import { Base } from "./base";
import { IPlainDataOptions, IProgressInfo, IQuestion, ISurvey, ISurveyData, ISurveyImpl, ITextProcessor } from "./base-interfaces";
import { property } from "./decorators";
import { HashTable, Helpers } from "./helpers";
import { INestedElementInfo, IVerifyDataContext, NestedWalkBuild, Question, QuestionItemValueGetterContext, QuestionValueGetterContext, ValidationContext, getNestedElementQuestions } from "./question";
import { ActionContainer } from "./actions/container";
import { settings } from "./settings";
import { isFocusInsideOrIdle } from "./utils/focus-utils";
import { toCssClasses } from "./utils/cssClassBuilder";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource, hasFixedMembership, IArrayDynamicDataSourceOptions, isLocalSource, LocalDynamicDataSource } from "./dynamic-data/dynamic-data-sources";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, VariableGetterContext } from "./conditions/conditionProcessValue";
import { TextContextProcessor } from "./textPreProcessor";
import { SurveyError } from "./survey-error";
import { KeyDuplicationError } from "./error";
import {
  DynamicDataErrorOperation, DynamicDataFieldType, DynamicDataSourceMethod, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner,
  ISortCriterion, IDynamicDataSource, SortDirection
} from "./dynamic-data/dynamic-data-interfaces";
import { SortCriterion } from "./records/records-sort-criterion";
import { findDuplicatePages, groupByDuplicateKey } from "./records/records-duplicates";
import { RecordsPageValidation, IRecordsPageValidationOwner, RecordsPageValidationFollower } from "./question_records_page_validation";
import { createIndexes } from "./dynamic-data/dynamic-data-records";
import { RecordsPagingController, IRecordsPageState, IRecordsPagingOwner, pagingStateKeys } from "./records/records-paging";
import { getReplacedRecordsRemap } from "./dynamic-data/dynamic-data-record-remap";
import {
  IRecordIndexFollower, RecordIndexEvent, RecordRemap, createLazyRemap, getRecordListChangeEvent, isRecordListChange, toKnownRemap
} from "./records/records-index-followers";
import { IDynamicDataRecordCondition, IDynamicDataRecordScope } from "./dynamic-data/dynamic-data-record-visibility";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "./questionSingleInputSummary";
import { Action } from "./actions/action";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { ConsoleWarnings } from "./console-warnings";
import { Scope, ValueScope } from "./utils/scope";
import { RecordsDataWaits } from "./records/records-data-waits";
import { HiddenAnswerTracker, IHiddenAnswerTrackerOwner, isHiddenAnswerContainerVisible } from "./records/records-hidden-answers";
import { IRecordCleanupRunnerOwner, RecordCleanupRunner } from "./records/records-cleanup-runner";
import { IRecordRemoval, IRecordTarget, IRecordTargetResolverOwner, RecordTargetResolver } from "./records/records-target-resolver";
import { IQuestionRecordsBarOwner, IRecordsBarCssClasses, QuestionRecordsBar } from "./question_records_bar";
import type { PanelModelBase } from "./panel";

/* An item of the nested walk of a records question: a matrix row, or a dynamic panel's panel - not its
   QuestionPanelDynamicItem: in design mode the panel shown is the template, which has none. */
export type NestedWalkItem = QuestionRecordItem | PanelModelBase;
import type { ItemValue } from "./itemvalue";
import type { ISurveyOldValueReads } from "./interfaces/survey-callbacks";

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
// A value the duplicate check compares; item is undefined for a record without an object.
interface IUniquenessEntry {
  item: QuestionRecordItem;
  value: any;
  isEmpty: boolean;
}
/* What a value assignment from outside takes before the value is stored and hands back after it (see
   QuestionRecordsModel.beginValueAssignment). created: the created indexes, undefined without a
   view, null when they could not be read - inside a write of the list, whose views are its own until
   it ends. oldRecords: kept by an assignment owed to the end of an open write only (see
   runOwnRecordsChange); the pair hands them over itself. */
interface IDynamicDataValueAssignment {
  created: Array<number>;
  oldRecords?: any;
  // An owed assignment only: one of the assignments it stands for drops the touched records.
  isTouchedSetDropped?: boolean;
  /* A sibling's write that updated records in place (QuestionRecordsModel.isInPlaceWriteOfSibling): no
     record was inserted, removed or moved. An owed assignment is in place only while every assignment
     it stands for is. */
  isUpdatedInPlace?: boolean;
}
// A write of one record field through an item, as the item prepared it (QuestionRecordItem.prepareRecordWrite).
export interface IRecordItemWrite {
  // The field as it is going to be stored: the write stops when it equals the stored one.
  fieldValue: any;
  // What the owner's updateItemValue receives.
  ownerValue: any;
  isDeleting: boolean;
}
// The types of the removal flow keep importing these from here.
export type { IRecordTarget, IRecordRemoval } from "./records/records-target-resolver";
/* A field is used for sorting only (the filter is an expression and needs no typing), so a value type
   that does not say how to compare is "any": the local sort then compares the raw values. "string" is
   also what a question that does not know its value type reports (an expression, a select question
   whose choices are not loaded yet), so it is not trusted: the values decide. */
function getFieldType(question: Question): DynamicDataFieldType {
  const type = question.getValueType();
  return type === "number" || type === "date" || type === "boolean" ? type : "any";
}
// What the list, the page validation, the paging helper and the records helpers call: one object, see helperOwner.
type RecordsHelperOwner = IDynamicDataOwner & IRecordsPageValidationOwner & IRecordsPagingOwner & IHiddenAnswerTrackerOwner &
  IRecordCleanupRunnerOwner & IRecordTargetResolverOwner;
/* The 0-based number the respondent sees for the record of an object or a record item: its index in
   the whole list - the window offset of a source that pages itself added to the window-local
   getIndex(), which the storage is addressed by. */
function getRecordNumberOf(item: QuestionRecordItem): number {
  return item.getIndex() + (!!item.data ? item.data.getRecordNumberOffset() : 0);
}

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
   it does change is who owns them - see canSetValueToSurvey.
   Its objects - rows or panels -, their contexts and the single-input behavior call its protected
   members by element access (question["getItemRecordIndex"](item)). The compiler checks the
   signature; tests/dynamic-data/internal-access.test.ts checks that the member exists. A member
   reached this way is added to, or renamed in, that test's list. The rows and the panel items of the
   other modules ask the protected helpers of QuestionRecordItem. */
export abstract class QuestionRecordsModel extends Question {
  private _dataList: DynamicDataList;
  private _paging: RecordsPagingController;
  private _pageValidation: RecordsPageValidation;
  private helperOwnerValue: RecordsHelperOwner;
  private builtRecordIndexes: WeakMap<QuestionRecordItem, number>;
  /* The owner the list (IDynamicDataOwner), the page validation (IRecordsPageValidationOwner) and
     the paging helper (IRecordsPagingOwner) talk to. It is built with the first helper, and its
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
      onWriteEnded: (): void => { question.onListWriteEnded(); },
      onDataSettled: (): void => { question.onDataSettled(); },
      onWritesStarted: (): void => { question.dataWaits.onWritesStarted(); },
      onSourceWriterChanged: (): void => { question.onSourceCapabilitiesChanged(); },
      onDataError: (error: any, operation: DynamicDataErrorOperation): void => { question.onSourceError(error, operation); },
      getSurvey: (): ISurvey => question.survey,
      // IRecordsPageValidationOwner: the rules every records question shares; the rest is the question's.
      getDataList: (): DynamicDataList => question.dataList,
      isPageLeaveValidated: (): boolean => question.isPageLeaveValidated(),
      canTrackEditedRecords: (): boolean => question.isPagedByList,
      goToPageFromCode: (pageIndex: number): void => { question.paging.pageIndex = pageIndex; },
      isRecordValidQuietly: (recordIndex: number): boolean => question.isRecordValidQuietly(recordIndex),
      validatePageObjects: (context: ValidationContext): boolean => question.validatePageObjects(context),
      setPropertyValue: (name: string, val: any): void => { question.setPropertyValue(name, val); },
      get isDisposed(): boolean { return question.isDisposed; },
      /* IRecordsPagingOwner: the question's paging state never has to be public for the paging
         helper. The state itself stays in the question's property hash (setPropertyValue above serves
         both helpers), which is what the renderers observe. The page moves are leavePage and
         cancelPendingPageMove. */
      getPropertyValue: (name: string): any => question.getPropertyValue(name),
      getArrayPropertyValue: (name: string, onPush: (item: any) => void): Array<any> => question.getArrayPropertyValue(name, onPush),
      setArrayPropertyValue: (name: string, val: Array<any>): void => { question.setArrayPropertyValue(name, val); },
      getLocalizationFormatString: (strName: string, ...args: any[]): string => question.getLocalizationFormatString(strName, ...args),
      get pageSize(): number { return question.pageSize; },
      get listPageSize(): number { return question.listPageSize; },
      get maxSortLevel(): number { return question.maxSortLevel; },
      get pageIndex(): number { return question.reportedPageIndex; },
      get pageCount(): number { return question.reportedPageCount; },
      get isDesignMode(): boolean { return question.isDesignMode; },
      get isLoadingFromJson(): boolean { return question.isLoadingFromJson; },
      leavePage: (isForward: boolean, move: () => void): boolean => question.leavePage(isForward, move),
      cancelPendingPageMove: (): void => { question.cancelPendingPageMove(); },
      // The records helpers: the hidden-answer tracker, the clean-up runner and the target resolver.
      get areInvisibleElementsShowing(): boolean { return question.areInvisibleElementsShowing; },
      get isRemoteData(): boolean { return question.isRemoteData; },
      get isPagedByList(): boolean { return question.isPagedByList; },
      get isPagingActive(): boolean { return question.isPagingActive; },
      get hasDataListView(): boolean { return question.hasDataListView; },
      get recordsSource(): LocalDynamicDataSource { return question.recordsSource; },
      getStoredRecords: (): any => question.getStoredRecords(),
      asRecords: (value: any): Array<any> => asRecords(value),
      isEmpty: (): boolean => question.isEmpty(),
      getRecordTemplateQuestion: (key: string): Question => question.getRecordTemplateQuestion(key),
      getRecordConditionalInputs: (): Array<Question> => question.getRecordConditionalInputs(),
      canRecordQuestionBeCleared: (q: Question, reason: string): boolean => question.canRecordQuestionBeCleared(q, reason),
      canCleanRecordsWithoutObjects: (): boolean => question.canCleanRecordsWithoutObjects(),
      createRecordVisibilityScope: (properties: HashTable<any>): IDynamicDataRecordScope => question.createRecordVisibilityScope(properties),
      collectRecordChangesWithoutObjects: (properties: HashTable<any>, clean: (index: number, record: any, visibility: IRecordElementVisibility) => any,
        onItem?: (index: number, record: any, item: QuestionRecordItem) => void): Array<{ index: number, record: any }> =>
        question.collectRecordChangesWithoutObjects(properties, clean, onItem),
      isRecordInputContainerVisible: (visibility: IRecordElementVisibility, q: Question): boolean => question.isRecordInputContainerVisible(visibility, q),
      removeRecordAnswer: (record: any, cleared: any, name: string): any => question.removeRecordAnswer(record, cleared, name),
      writeRecordChanges: (changes: Array<{ index: number, record: any }>): void => { question.writeRecordChanges(changes); },
      keepsHiddenAnswerStates: (oldCount: number, newCount: number): boolean => question.keepsHiddenAnswerStates(oldCount, newCount),
      forEachBuiltRecordItem: (func: (key: any, item: QuestionRecordItem) => void): void => { question.forEachBuiltRecordItem(func); },
      forEachRecordItem: (indexes: Array<number>, func: (index: number, item: QuestionRecordItem, position: number) => void): void => {
        question.forEachRecordItem(indexes, func);
      },
      getListRecordAt: (index: number): any => question.getListRecordAt(index),
      getRecordUnknownKeys: (recordIndex: number, record: any, item: QuestionRecordItem): Array<string> =>
        question.getRecordUnknownKeys(recordIndex, record, item),
      createRecordCleanupObject: (index: number, record: any): IRecordCleanupObject => question.createRecordCleanupObject(index, record),
      getDataFilteredProperties: (): HashTable<any> => question.getDataFilteredProperties(),
      isRecordCleanupSkipped: (q: Question): boolean => question.isRecordCleanupSkipped(q),
      getItem: (position: number): QuestionRecordItem => question.getItem(position),
      getItemPosition: (item: QuestionRecordItem): number => question.getItemPosition(item),
      getItemRecordIndex: (item: ISurveyData): number => question.getItemRecordIndex(item),
      getItemVisibleIndex: (item: ISurveyData): number => question.getItemVisibleIndex(item),
      getItemByRecordIndex: (recordIndex: number): QuestionRecordItem => question.getItemByRecordIndex(recordIndex),
      getRecordViewIndex: (recordIndex: number): number => question.getRecordViewIndex(recordIndex),
      getRecordIndexAtVisibleIndex: (visibleIndex: number): number => question.getRecordIndexAtVisibleIndex(visibleIndex),
      isRecordNotLoaded: (recordIndex: number): boolean => question.isRecordNotLoaded(recordIndex),
      getVisibleNumberEnd: (unpagedCount: number): number => question.getVisibleNumberEnd(unpagedCount),
      refuseOperationOfSource: (operation: DynamicDataSourceMethod): boolean => question.refuseOperationOfSource(operation),
      reportRecordNotLoaded: (operation: DynamicDataSourceMethod): void => { question.reportRecordNotLoaded(operation); },
      removeResolvedRecord: (removal: IRecordRemoval): void => { question.removeResolvedRecord(removal); },
      keepFocusIndexForRead: (index: number): void => { question.keepFocusIndexForRead(index); },
      getLocale: (): string => question.getLocale(),
      getConfirmDialogCss: (): string => question.cssClasses.confirmDialog
    };
  }
  /* The record an object - a row or a panel - was built for, kept in step with the list's inserts
     and removes. When the page changes the list already names the records of the new page: whether
     the objects are the page is decided by comparing the two, and an object that is about to be
     disposed can no longer be asked for its record through the mapping - a panel's record is where
     the state of the paged questions nested in it is kept. -1: built for no record (a total row, a
     record read as a value, an object whose record is gone). */
  protected getBuiltRecordIndex(item: QuestionRecordItem): number {
    const res = !!this.builtRecordIndexes ? this.builtRecordIndexes.get(item) : undefined;
    return res === undefined ? -1 : res;
  }
  protected setBuiltRecordIndex(item: QuestionRecordItem, recordIndex: number): void {
    if (!this.builtRecordIndexes) {
      this.builtRecordIndexes = new WeakMap<QuestionRecordItem, number>();
    }
    this.builtRecordIndexes.set(item, recordIndex);
    if (this.isPagedBySource) {
      if (!this.builtStateKeys)this.builtStateKeys = new WeakMap<QuestionRecordItem, number | string>();
      this.builtStateKeys.set(item, this.getNestedStateKey(recordIndex));
    }
  }
  /* The name the states of a record's nested paged questions are kept under: the record index, which
     the remaps keep in step. A window of a source that pages itself names another record on every
     page: there it is the record's key, or its index in the whole source - taken when the object is
     built, since the window has changed by the time its states are kept (builtStateKeys). */
  private builtStateKeys: WeakMap<QuestionRecordItem, number | string>;
  private getNestedStateKey(recordIndex: number): number | string {
    if (!this.isPagedBySource || recordIndex < 0) return recordIndex;
    const list = this._dataList;
    const field = list.keyField;
    const key = !!field ? list.getValue(recordIndex, field) : undefined;
    return key !== undefined ? "k" + JSON.stringify(key) : "i" + (list.windowOffset + recordIndex);
  }
  // A peek: it never creates the list.
  protected get dataListValue(): DynamicDataList {
    return this._dataList;
  }
  /* Every record-level read and write of the question goes through this list. Its source is the
     question's own (createRecordsSource): it reads the question's storage on demand - never a
     captured array - so that the storage rules of the type are honoured and every write replaces the
     array instead of mutating the one the question currently holds.
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
        (): LocalDynamicDataSource => this.recordsSourceValue = this.createRecordsSource());
      // The list is created on demand, so a page size that came from JSON has to be pushed here and
      // not only from its setter.
      this.paging.updatePageSize();
      this.seedItemRecordsVisibility();
    }
    return this._dataList;
  }
  /* A list created after the objects were built starts with their visibility: a hidden object's record
     takes no place in the visible count. Without paging and without a view (a new list has none) the
     objects are in record order. */
  private seedItemRecordsVisibility(): void {
    if (this.isPagingActive) return;
    this._dataList.setRecordsVisible((index: number): boolean => {
      const item = this.getItem(index);
      return !item || this.isItemVisible(item);
    });
  }
  /* The paging helper gets an accessor and not the list: the list is created on demand, and the
     helper is first used while the list is being created. */
  protected get paging(): RecordsPagingController {
    if (!this._paging) {
      this._paging = new RecordsPagingController(this.helperOwner, (): DynamicDataList => this.dataList);
    }
    return this._paging;
  }
  // The questions ask for what they need done (leavePage, validateOffPage, ...); _pageValidation is
  // the peek.
  private get pageValidation(): RecordsPageValidation {
    if (!this._pageValidation) {
      this._pageValidation = new RecordsPageValidation(this.helperOwner);
    }
    return this._pageValidation;
  }
  /* The helpers of the records without an object and of the removal flow, created on first use: the
     clearIfInvisible tracking (HiddenAnswerTracker), the clean-up by temporary objects
     (RecordCleanupRunner) and the targets of a removal, a move and an insert (RecordTargetResolver).
     The tracker and the resolver follow the record indexes too (createRecordIndexFollowers). */
  private _hiddenAnswers: HiddenAnswerTracker;
  private get hiddenAnswers(): HiddenAnswerTracker {
    if (!this._hiddenAnswers) {
      this._hiddenAnswers = new HiddenAnswerTracker(this.helperOwner);
    }
    return this._hiddenAnswers;
  }
  private _recordCleanup: RecordCleanupRunner;
  private get recordCleanup(): RecordCleanupRunner {
    if (!this._recordCleanup) {
      this._recordCleanup = new RecordCleanupRunner(this.helperOwner);
    }
    return this._recordCleanup;
  }
  private _recordTargets: RecordTargetResolver;
  private get recordTargets(): RecordTargetResolver {
    if (!this._recordTargets) {
      this._recordTargets = new RecordTargetResolver(this.helperOwner);
    }
    return this._recordTargets;
  }
  // The state of the helpers under the names the question held it by, which the record-state tests read.
  private get hiddenAnswerStates(): Map<any, HashTable<number>> {
    return !!this._hiddenAnswers ? this._hiddenAnswers.hiddenAnswerStates : undefined;
  }
  private get heldRemoveTargets(): Array<IRecordTarget> {
    return !!this._recordTargets ? this._recordTargets.heldRemoveTargets : undefined;
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
  /* A key another records question on the same value name can store is known, whether or not that
     question built its rows or panels: its columns, its template or its detail panel decide
     (getRecordTemplateQuestion), so nothing is built for the check. */
  protected isRecordKeyStoredByAnotherQuestion(key: string): boolean {
    if (!this.survey || !this.valueName) return false;
    return this.getQuestionsSharingValue(this.valueName).some((question: IQuestion): boolean =>
      question !== this && question instanceof QuestionRecordsModel && !!question.getRecordTemplateQuestion(key));
  }
  public getBindedQuestions(): Array<IQuestion> {
    if (!this.survey || !this.valueName) return [];
    return this.getQuestionsSharingValue(this.valueName);
  }
  // The survey hashes no question inside a dynamic panel or a matrix detail panel and answers null for it.
  private getQuestionsSharingValue(name: string): Array<IQuestion> {
    return this.survey.getQuestionsByValueName(name) || [];
  }
  /* The record fields the template questions of a dynamic panel or the column questions of a matrix
     contribute to the list: one per question, under its value name, and one more for a comment,
     which is stored under an ordinary key of the same record. A question with an "other" item and no
     comment stores the other text under the same comment key (storeOthersAsComment): a string field,
     declared after the others. */
  protected getFieldsOfQuestions(questions: Array<Question>): Array<IDynamicDataField> {
    const res = new Array<IDynamicDataField>();
    (questions || []).forEach((question: Question): void => {
      res.push({ name: question.getValueName(), dataType: getFieldType(question) });
      if (question.hasComment) {
        res.push({ name: Helpers.getCommentKey(question.getValueName()), dataType: "string" });
      }
    });
    (questions || []).forEach((question: Question): void => {
      if (question.hasComment || (<any>question).hasOther !== true) return;
      const name = Helpers.getCommentKey(question.getValueName());
      if (!res.some(f => f.name === name)) {
        res.push({ name: name, dataType: "string" });
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
      this.followRecordIndexEvent({ kind: "pageChanged" });
      this.syncPagingState();
      /* The objects that exist are the page: a page the list cuts - from question.value
         or from everything a source without paging answered with - is rebuilt at once, through the path a
         remote read takes. A page of a source that pages itself is rebuilt when its read commits. */
      if (this.isPagedByList) {
        this.rebuildFromDataList(true);
      } else {
        this.refreshRenderedPage();
      }
      return;
    }
    // A list that pages in memory creates the edited set on every change it raises here. An edit
    // renumbers nothing: it marks the record edited.
    const validation = this.isPagedByList ? this.pageValidation : this._pageValidation;
    if (change.type === "recordChanged" && !!validation) validation.markEdited(change.index);
    const listChange = getRecordListChangeEvent(change);
    if (!!listChange)this.followRecordIndexEvent(listChange);
    /* A write the list pushed to a data source: with the array source over question.value the push
       IS the value write, a remote source has no such setter, so the question follows the window
       itself. The objects are not rebuilt - the one that was edited, added or removed is handled by
       the path that made the change. */
    if (list.isRemote && change.type !== "reset") {
      this.storeLoadedRecords();
      if (change.type === "recordChanged" && change.isInsertAnswer) {
        this.showInsertAnswer(change.index);
      }
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
  /* An insert answer brought the record the source stored: the merged record reaches the object of
     the new record, if it has one, and nothing else is rebuilt. The respondent's fields are the
     client's in the merged record, so a value typed before the answer arrived is kept. The other
     record writes never push the record back into the object being edited (see storeLoadedRecords). */
  private showInsertAnswer(index: number): void {
    const item = this.getItemByRecordIndex(index);
    if (!!item) {
      item.updateFromRecord(this.dataList.getRecord(index));
    }
  }
  /* A read committed: the loaded window becomes the question value. It is the inbound path - the
     value is stored, the survey hash is not written and no trigger, condition or navigation runs -
     and then the objects are rebuilt for the records the window holds. Nothing else may assign the
     value on a load. The position a refill kept is focused last: the objects it names exist now. */
  private commitLoadedRecords(): void {
    const oldRecords = copyRecords(this.getStoredRecords());
    this.storeLoadedRecords();
    this.followReloadedRecords(oldRecords);
    this.rebuildFromDataList(false);
    const index = this.takeFocusIndexAfterRead();
    if (index > -1) {
      this.focusItemAfterRead(index);
    }
  }
  /* A read that commits again (refresh(), a filter the source answers again) may bring the records
     back at other indexes: another writer moved, added or removed records. What the question keeps by
     record index follows them into the new window - by key when the source names its records, by
     content otherwise (getReplacedRecordsRemap) - as each follower decides. The remap is built once
     per commit, and only when a follower asks for it. Replacing the source starts over (see
     setDataSource). */
  private followReloadedRecords(oldRecords: any): void {
    const list = this._dataList;
    const oldArray = asRecords(oldRecords);
    const newArray = asRecords(this.getStoredRecords());
    this.followRecordIndexEvent({ kind: "reload", oldRecords: oldArray, newRecords: newArray,
      getRemap: createLazyRemap(() => getReplacedRecordsRemap(oldArray, newArray, list.keyField)) });
  }
  /* The followers of the record indexes the question keeps, in the order they follow an event: the
     records its objects were built for, the current record of a type that shows one
     (createCurrentRecordFollower), the hidden-answer states, the held remove targets, the focus kept
     for a read, and the page validation last. Created on the first event. */
  private recordIndexFollowers: Array<IRecordIndexFollower>;
  private followRecordIndexEvent(event: RecordIndexEvent): void {
    if (!this.recordIndexFollowers) {
      this.recordIndexFollowers = this.createRecordIndexFollowers();
    }
    this.recordIndexFollowers.forEach((follower: IRecordIndexFollower): void => { follower.follow(event); });
  }
  private createRecordIndexFollowers(): Array<IRecordIndexFollower> {
    const res: Array<IRecordIndexFollower> = [{ follow: (event: RecordIndexEvent): void => { this.followBuiltItems(event); } }];
    const current = this.createCurrentRecordFollower();
    if (!!current) res.push(current);
    res.push(this.hiddenAnswers, this.recordTargets,
      { follow: (event: RecordIndexEvent): void => { this.followFocusIndex(event); } },
      new RecordsPageValidationFollower((create: boolean): RecordsPageValidation => create ? this.pageValidation : this._pageValidation,
        (): boolean => this.isPagedByList, (): boolean => this.isPagedBySource));
    return res;
  }
  // The record a type that shows one record at a time keeps shown (the dynamic panel's current panel).
  protected createCurrentRecordFollower(): IRecordIndexFollower {
    return undefined;
  }
  /* With the array source over question.value a record write reaches the survey, and the survey then
     re-runs the conditions of every question - which is what recalculates an expression, a {row.x} or
     {panel.x} reference and the totals. A remote write never reaches the survey (canSetValueToSurvey),
     so the question runs its own. Re-entrancy is guarded and not forbidden for a reason: an
     expression writes its result back as a record field, and the nested run would only recompute what
     the outer one has just settled. */
  private remoteWriteConditionsScope: Scope = new Scope();
  private runConditionsAfterRemoteWrite(): void {
    if (this.remoteWriteConditionsScope.isActive || !this.data) return;
    this.remoteWriteConditionsScope.run((): void => this.runRemoteWriteConditions());
  }
  /* "the records are owned by a data source": the survey hash, the write routing, the capabilities
     and the record count (recordCount) ask it. It is deliberately not "the list pages itself": a
     source that returns everything in one read is still a source, and its records are still not the
     question's to grow or truncate - but the list pages them exactly as it pages question.value. Who
     pages is isPagedByList.
     It also decides who owns the records. While it is set, the survey's clean-ups return before any
     record or value work: clearValueIfInvisible (complete, a container hide, the question's own hide),
     clearValueOnHidding, the matrix's rowsVisibleIf pass under onHidden (clearInvisibleValuesInRows)
     and clearIncorrectValues. Record validation validates without clearing (validateRecordObjects),
     and an assignment of the value from outside is not made (setNewValue, clearValue). The reactions
     inside one record - a question hidden by an edit of its own record under onHidden, the
     choice-driven clean-ups of a select question in a record (choicesVisibleIf, choicesFromQuestion,
     a choicesByUrl answer) - are not survey-level: they follow a change of that record's data or
     choices and write that record only, so they keep writing. */
  protected get isRemoteData(): boolean {
    return !!this.dataListValue && this.dataListValue.isRemote;
  }
  public clearValueIfInvisible(reason: string = "onHidden"): void {
    if (this.isRemoteData) return;
    this.clearObjectsIfInvisible(reason);
    super.clearValueIfInvisible(reason);
  }
  // What a type clears inside its objects before the question clears itself (the panel's questions).
  protected clearObjectsIfInvisible(reason: string): void { }
  /* The survey's clean-up of incorrect answers: nothing for a source-owned question; the answer as a
     whole, then the objects (clearIncorrectValuesInObjects), then the records without one
     (RecordCleanupRunner.clearIncorrectValuesWithoutObjects). */
  public clearIncorrectValues(): void {
    if (this.isRemoteData) return;
    super.clearIncorrectValues();
  }
  protected clearIncorrectOwnValue(): void {
    this.clearIncorrectValueInData();
  }
  // Record-aware: an object judges the record it holds, and a record without one is judged by a temporary object.
  protected clearIncorrectNestedValues(): void {
    this.clearIncorrectValuesInObjects();
    this.recordCleanup.clearIncorrectValuesWithoutObjects();
  }
  protected abstract clearIncorrectValuesInObjects(): void;
  public clearValue(keepComment?: boolean, fromUI?: boolean): void {
    if (this.isRemoteData) {
      this.warnOutsideAssignment();
      return;
    }
    this.clearingValueScope.run((): void => super.clearValue(keepComment, fromUI));
  }
  // The records the respondent touched go with the value (see isTouchedSetDropped).
  private clearingValueScope: Scope = new Scope();
  /* An assignment of the value of a source-backed question is made only by the question itself,
     through setOwnRecordsValue. Any other - value =, a default, setValueExpression, a setvalue or
     copyvalue trigger, user code that runs inside one of the question's own writes - returns here,
     before survey.questionValueChanging: nothing is stored and no event fires, a parent's included.
     The mark is one-shot and taken at entry, so an assignment made later inside the same write is an
     outside one.
     The same mark tells the store whose assignment it is (isAssigningOwnValue): an invocation makes
     its own kind the one in force for its whole extent and restores the outer one when it exits,
     however it exits. An assignment nested in it - a handler of survey.onValueChanging, which runs
     before the store - has its own kind while it runs and never changes the outer one's. */
  private isOwnValueAssignment: boolean = false;
  private ownAssignmentKindScope: ValueScope<boolean> = new ValueScope<boolean>(false);
  protected get isAssigningOwnValue(): boolean {
    return this.ownAssignmentKindScope.value;
  }
  protected setNewValue(newValue: any): void {
    const isOwn = this.isOwnValueAssignment;
    this.isOwnValueAssignment = false;
    if (!isOwn && this.isRemoteData) {
      this.warnOutsideAssignment();
      return;
    }
    this.ownAssignmentKindScope.run(isOwn, (): void => { super.setNewValue(newValue); });
  }
  /* An own record write copies the old records only for a handler that reads them. The survey is asked by
     its member (ISurveyOldValueReads): a survey without it gets the copy. */
  protected getOldValueOnSetNewValue(): any {
    if (this.isAssigningOwnValue) {
      const reads = <ISurveyOldValueReads><any>this.survey;
      if (!!reads && typeof reads.isQuestionOldValueRead === "function" && !reads.isQuestionOldValueRead(this)) return undefined;
    }
    return super.getOldValueOnSetNewValue();
  }
  protected setOwnRecordsValue(newValue: any): void {
    this.isOwnValueAssignment = true;
    try {
      this.setNewValue(newValue);
    } finally {
      this.isOwnValueAssignment = false;
    }
  }
  /* An own write that only updates records in place - the values new objects computed into the records
     they were built for: as many records as are stored, none inserted, removed or moved. The records it
     replaces (before) and the ones it stores (after) are held for the extent of that one write. A
     sibling that receives the write through the survey reads them (isInPlaceWriteOfSibling) and keeps
     its objects. */
  private inPlaceWriteScope = new ValueScope<{ before: Array<any>, after: Array<any> }>();
  private get inPlaceWrite(): { before: Array<any>, after: Array<any> } {
    return this.inPlaceWriteScope.value;
  }
  protected setOwnRecordsValueInPlace(newValue: any): void {
    const stored = this.getStoredRecords();
    if (!Array.isArray(newValue) || !Array.isArray(stored) || newValue.length !== stored.length) {
      this.setOwnRecordsValue(newValue);
      return;
    }
    // A copy: the stored array is updated in place when the value is stored (Base.setArrayPropertyDirectly).
    this.inPlaceWriteScope.run({ before: copyRecords(stored), after: newValue }, (): void => this.setOwnRecordsValue(newValue));
  }
  /* The assignment the question receives is a sibling's in-place write: a question bound to the same
     value is making one, the received value equals the records it stores, and the records the question
     held equal the ones it replaces. The survey stores a copy, so the records are compared by content,
     not by identity. An assignment made while the sibling writes - a survey.onValueChanging handler
     that calls survey.setValue, any user code before the store - has other content and stays one from
     outside, and so does the sibling's write that follows it: the question's records are the handler's
     then, not the ones the sibling replaces. One with equal content on both sides is taken as in place,
     which is right for it too. Cost: two comparisons of the records, only while a sibling makes an
     in-place write. */
  private isInPlaceWriteOfSibling(newValue: any, oldRecords: any): boolean {
    if (!Array.isArray(newValue) || !Array.isArray(oldRecords) || newValue.length !== oldRecords.length || !this.survey) return false;
    return this.getQuestionsSharingValue(this.getValueName()).some((question: IQuestion): boolean => {
      if (question === this || !(question instanceof QuestionRecordsModel)) return false;
      const write = question.inPlaceWrite;
      return !!write && write.after.length === newValue.length &&
        !DynamicDataList.isValueChanged(newValue, write.after) && !DynamicDataList.isValueChanged(oldRecords, write.before);
    });
  }
  // Once per question until its source changes.
  private warnedSource: IDynamicDataSource;
  private warnOutsideAssignment(): void {
    const source = this.getDataSource();
    if (this.warnedSource === source) return;
    this.warnedSource = source;
    ConsoleWarnings.warn("The value of the question \"" + this.name + "\" was not changed: a data source owns its records. Change them through the data source or the question's rows and panels.");
  }
  // The question's records are validated, but a source-backed question's are not cleared.
  protected validateRecordObjects<T>(context: ValidationContext, func: () => T): T {
    return this.isRemoteData ? context.runWithoutClearingIncorrectValues(func) : func();
  }
  /* Whether the question pages is decided by three facts, each in one place:
     - pageSize: the authored page size, 0 for none;
     - listPageSize: the size the list is to page by - 0 in single-input mode, which is its own
       paging, and capped by maxRecordsPerPage;
     - list.pageSize: the size the list pages by now; the paging helper sets it from listPageSize at
       every sync, 0 in design mode;
     and by two facts of the list: isRemoteData (a source is assigned) and isPagedBySource (the source
     hands over one window per page). The others are derived from them:
     - isPagingActive: the list pages;
     - isPagedByList: it pages, and not by the source;
     - hasDataListView: the objects are built for the records the list holds - a filter or a sort, a
       source, paging, or objects last built for a view;
     - isRecordCountLimitedByPageMax: the page maximum limits the record count - design mode, or
       listPageSize 0.
                                     pageSize listPageSize PagingActive PagedByList DataListView RemoteData PagedBySource
       no paging                        0         0            no           no          no          no          no
       paging over question.value       >0        >0           yes          yes         yes         no          no
       a source that pages itself       >0        >0           yes          no          yes         yes         yes
       a source the list pages          >0        >0           yes          yes         yes         yes         no
       design mode                      >0        >0           no           no          no          no          no
       single-input mode                >0        0            no           no          no          no          no
       a filter or a sort, no paging    0         0            no           no          yes         no          no
     getMaxRecordCount lifts the page maximum whenever pageSize is set, and getRecordCountLimit only
     while the question pages: in design and single-input mode with a pageSize, maxRowCount /
     maxPanelCount report the stored maximum while the count is checked against the page maximum. */
  /* Paging is on: the objects are built for the page, and an incremental update of the rendered
     table would work in page-local terms. Off in design mode and without a list. */
  protected get isPagingActive(): boolean {
    return !this.isDesignMode && !!this._dataList && this._dataList.pageSize > 0;
  }
  // The source hands over one window per page; a peek: nothing is created for it.
  private get isPagedBySource(): boolean {
    return !!this._dataList && this._dataList.isPagedBySource;
  }
  /* The list cuts the page: over question.value, or over the whole storage a source without paging
     answered with - or a paging source, read whole while the list has a filter or a sort it cannot
     run. Every record is in memory, so the page is a slice and layer 2 can track the edited records.
     Its opposite is a paging source (list.isPagedBySource): the window IS the page and the records
     of the other pages are on the server. */
  protected get isPagedByList(): boolean {
    return this.isPagingActive && !this.isPagedBySource;
  }
  /* The objects are built for the records the list holds and not for 0 ... count-1. A remote window
     is a view of its own, because the count is the server total; a question that pages builds its
     objects for the page, so it takes the view path too. */
  protected get hasDataListView(): boolean {
    const list = this._dataList;
    return !!list && (list.hasView || this.hasMaterializedView || this.isRemoteData || this.isPagingActive);
  }
  /* The record-index counterpart of getQuestionFromArray: the question of the object the record has,
     whatever position it took; null for a record without one. Nothing is built for it, except what the
     type builds first (prepareQuestionFromRecord). */
  public getQuestionFromRecord(name: string, recordIndex: number): IQuestion {
    this.prepareQuestionFromRecord();
    const item = this.getItemByRecordIndex(recordIndex);
    return !!item ? this.getItemQuestionByName(item, name) : null;
  }
  protected prepareQuestionFromRecord(): void { }
  protected abstract getItemQuestionByName(item: QuestionRecordItem, name: string): IQuestion;
  /* A created position - an object's position among the built objects, under paging on the page - and
     the record it holds: the materialized set of the list. Without a view the position is the record
     index. A position no record has answers getRecordIndexOfMissingPosition. */
  protected getRecordIndexAtCreatedPosition(position: number): number {
    if (!this.hasDataListView) return position;
    const res = this.dataListValue.materializedIndexToIndex(position);
    return res >= 0 ? res : this.getRecordIndexOfMissingPosition();
  }
  protected getRecordIndexOfMissingPosition(): number {
    return -1;
  }
  /* The object that holds a record, undefined for a record without one. Without a view the objects
     are built in record order, so the record index is the position - also for a panel whose record
     is not stored yet. Nothing is created: neither the list nor an object. */
  protected getItemByRecordIndex(recordIndex: number): QuestionRecordItem {
    const position = this.hasDataListView ? this.dataListValue.indexToMaterializedIndex(recordIndex) : recordIndex;
    return position < 0 ? undefined : this.getItem(position);
  }
  /* The records the objects are built for: the ones the view materialized, without a view one per
     record in record order (getRecordCountWithoutView). */
  protected getObjectRecordIndexes(): Array<number> {
    return this.hasDataListView ? this.dataList.getMaterializedIndexes() : createIndexes(this.getRecordCountWithoutView());
  }
  protected getObjectRecordCount(): number {
    return this.hasDataListView ? this.dataList.getMaterializedIndexes().length : this.getRecordCountWithoutView();
  }
  /* The number of objects without a view: the record count of a type with a count of its own (it runs
     only without a view, so never with a source); the stored records of the fixed matrix. */
  protected getRecordCountWithoutView(): number {
    return !!this.getRecordCountNames() ? this.recordCount : this.getListRecordCount();
  }
  /* The objects hold other records than the page names: a record became hidden or visible ahead of
     them, the page moved under them, or the records were replaced. The objects are read one by one:
     nothing is allocated for the answer. isAppendAllowed: objects that hold the first records of the
     page are not stale - the records after them are appended (the matrix's grown rowCount). */
  protected isPageStale(isAppendAllowed: boolean = false): boolean {
    const list = this._dataList;
    if (!list || !this.areObjectsBuilt()) return false;
    const records = list.getMaterializedIndexes();
    for (let i = 0; i < records.length; i++) {
      const item = this.getItem(i);
      if (!item && isAppendAllowed) return false;
      if (!(item instanceof QuestionRecordItem) || this.getBuiltRecordIndex(item) !== records[i]) return true;
    }
    return !!this.getItem(records.length);
  }
  /* The records the objects were built for follow the list's own insert and remove, and its move as
     the type moves its objects (followRecordMove). A reload, an assignment from outside under paging in
     memory and a redefinition of the records renumber them only while something keeps state under
     their records (isKeepingRecordIndexes); the objects are rebuilt after them anyway. */
  private followBuiltItems(event: RecordIndexEvent): void {
    if (isRecordListChange(event)) {
      if (event.kind === "move") {
        this.followRecordMove(toKnownRemap(event.remap));
      } else {
        this.remapBuiltItems(toKnownRemap(event.remap));
      }
    } else if (event.kind === "reload" || event.kind === "assignment" || event.kind === "redefined") {
      if (event.kind !== "redefined" && !this.isPagedByList) return;
      if (this.isKeepingRecordIndexes())this.remapKeptRecordIndexes(toKnownRemap(event.getRemap()));
    }
  }
  // Read before the page validation follows the event: the edited set may be empty afterwards.
  private isKeepingRecordIndexes(): boolean {
    const validation = this._pageValidation;
    return !!validation && validation.hasRecords || this.hasKeptRecordIndexes();
  }
  /* Every object is renumbered, also before the first build. An object whose record is gone - not
     found again by a reload - keeps -1: it is being disposed. */
  protected remapBuiltItems(remap: (index: number) => number): void {
    this.forEachItem((item: QuestionRecordItem): void => {
      if (!isRecordItem(item)) return;
      const from = this.getBuiltRecordIndex(item);
      if (from > -1) {
        this.setBuiltRecordIndex(item, remap(from));
      }
    });
  }
  // The objects in created order, up to the first position getItem answers none for.
  private forEachItem(func: (item: QuestionRecordItem, position: number) => void): void {
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      func(item, i);
    }
  }
  // The same walk, stopped at the first object func answers true for: whether there is one.
  private someItem(func: (item: QuestionRecordItem) => boolean): boolean {
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return false;
      if (func(item)) return true;
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
  /* The records of the view in view order, each with its object (undefined for a record without one):
     visibleOnly walks the visible records, otherwise every record the view creates. */
  protected forEachViewRecord(visibleOnly: boolean, func: (index: number, item: QuestionRecordItem) => void): void {
    this.forEachRecordItem(this.getViewIndexes(visibleOnly), (index: number, item: QuestionRecordItem): void => { func(index, item); });
  }
  protected getViewIndexes(visibleOnly: boolean): Array<number> {
    return visibleOnly ? this.dataList.getVisibleIndexes() : this.dataList.getCreatedIndexes();
  }
  /* The records 0 ... count-1, each with the object that holds it, undefined for a record without one.
     Without a view the objects are built in record order - the panel builds a panel before its record
     exists - so the position is the record index, and the list is not created. */
  protected forEachStoredRecord(count: number, func: (index: number, item: QuestionRecordItem) => void): void {
    if (this.hasDataListView) {
      this.forEachRecordItem(createIndexes(count), (index: number, item: QuestionRecordItem): void => { func(index, item); });
      return;
    }
    for (let i = 0; i < count; i++) {
      func(i, this.getItem(i) || undefined);
    }
  }
  /* The display values of a records value, in record order: getRecordDisplayValue formats each record
     with the object that holds it, or with the question's templates. This is a live path - text piping
     and displayValue() call it - so nothing is built for it. values is a copy the caller owns. */
  protected getRecordsDisplayValue(keysAsText: boolean, values: Array<any>): Array<any> {
    this.forEachStoredRecord(values.length, (index: number, item: QuestionRecordItem): void => {
      const record = values[index];
      if (!!record) {
        values[index] = this.getRecordDisplayValue(keysAsText, item, record, index);
      }
    });
    return values;
  }
  /* The keys of the value that no question of a record stores, for every loaded record, whatever hides
     it - the page, the filter, the owner's visibility: an unknown key is a property of the value, not
     of the view. A source that pages itself checks its window. */
  protected verifyRecordsUnknownKeys(val: any, context: IVerifyDataContext): void {
    const source = this.recordsSource;
    this.forEachStoredRecord(this.loadedRecordCount, (index: number, item: QuestionRecordItem): void => {
      const record = source["readRecordInAnswer"](val, index);
      const keys = this.getRecordUnknownKeys(index, record, item);
      if (keys.length === 0) return;
      context.pushSegment(source["getRecordSegment"](index));
      keys.forEach(key => context.addIssue("unknownProperty", key, record[key], this));
      context.popSegment();
    });
  }
  /* Adds one record's inputs to a progress count. inputs are what a record has questions for (the
     columns, the template questions); a question that is empty in the record and has a visibleIf is
     not counted, since whether it would be shown is not known without its object. */
  protected addRecordProgress<T>(res: IProgressInfo, record: any, inputs: Array<T>, getQuestion: (input: T) => Question,
    getKey: (input: T) => string, isRequired: (input: T) => boolean): void {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const question = getQuestion(input);
      if (!question || !question.hasInput) continue;
      const hasValue = !Helpers.isValueEmpty(record[getKey(input)]);
      if (!hasValue && !!question.visibleIf) continue;
      const required = isRequired(input) ? 1 : 0;
      res.questionCount += 1;
      res.requiredQuestionCount += required;
      res.answeredQuestionCount += hasValue ? 1 : 0;
      res.requiredAnsweredQuestionCount += hasValue ? required : 0;
    }
  }
  /* Three indexes: the record index names the record, visibleIndex is its position among the visible
     records of the whole list (the list's globalVisibleIndex; what the respondent navigates by),
     pageVisibleIndex its position among the visible objects; visibleIndex = pageStartVisibleIndex +
     pageVisibleIndex. 0 without a list. The questions convert through the two members below. */
  private get pageStartVisibleIndex(): number {
    return !!this.dataListValue ? this.dataListValue.getPageStartGlobalVisibleIndex() : 0;
  }
  // The position of an object among the visible objects of the page (QuestionRecordItem.pageVisibleIndex); -1: not shown.
  protected getItemPageVisibleIndex(item: QuestionRecordItem): number {
    const visibleIndex = this.getItemVisibleIndex(item);
    return visibleIndex < 0 ? -1 : this.getPositionAtVisibleIndex(visibleIndex);
  }
  // A position among the visible objects of the page -> the visible index of the whole view; -1 for no position.
  protected getVisibleIndexAtPosition(position: number): number {
    return position < 0 ? -1 : this.pageStartVisibleIndex + position;
  }
  // The visible index of the whole view -> a position among the visible objects of the page. Not clamped.
  protected getPositionAtVisibleIndex(visibleIndex: number): number {
    return visibleIndex - this.pageStartVisibleIndex;
  }
  // A filter or a sort is set (the view a question decides); a peek, nothing is created for it.
  protected get hasRecordView(): boolean {
    return !!this.dataListValue && this.dataListValue.hasView;
  }
  // A sort is set; nothing is created for the answer: every sort creates the list.
  protected get hasRecordSort(): boolean {
    return !!this.dataListValue && this.dataListValue.sort.length > 0;
  }
  /* One record as the question reads it without an object: the duplicate scan, the record visibility
     and the record items read through it. A remote source is read through the list - its window;
     the question's own source is read through recordsSource (getStoredRecordAt), which answers from
     the array a batch is building while list.batch() runs, and the list is not created.
     defaultRecord: what a record the source pads reads as (the Dynamic Matrix). */
  protected getListRecordAt(index: number, defaultRecord?: any): any {
    return this.isRemoteData ? this.dataListValue.getRecord(index) : this.getStoredRecordAt(index, defaultRecord);
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
  /* The total record count a type allows while its list does not page (settings.matrix.maxRowCount,
     settings.panel.maxPanelCount). A type without a record count of its own has no such limit. */
  protected get maxRecordCountWithoutPaging(): number {
    return Number.MAX_SAFE_INTEGER;
  }
  /* Without paging every object is on the one page, and the type setting (maxRecordCountWithoutPaging)
     limits the total; with paging it does not take part. */
  protected get isRecordCountLimitedBySetting(): boolean {
    return this.isDesignMode || !(this.listPageSize > 0);
  }
  /* The limit the record count is checked against: maxCount and the type setting without paging; with
     paging explicitMaxCount alone - when the question sets it, since the default of maxCount is the
     setting. */
  private getRecordCountLimit(maxCount: number, explicitMaxCount: number): number {
    if (this.isRecordCountLimitedBySetting) return Math.min(maxCount, this.maxRecordCountWithoutPaging);
    return explicitMaxCount > 0 ? explicitMaxCount : Number.MAX_SAFE_INTEGER;
  }
  /* The maximum record count a type stores under propertyName (maxRowCount, maxPanelCount): paging
     lifts the type setting from it; at least 1. The limit the count is checked against follows from it. */
  protected getMaxRecordCount(propertyName: string): number {
    const val = this.getPropertyValue(propertyName);
    return this.pageSize > 0 ? val : Math.min(val, this.maxRecordCountWithoutPaging);
  }
  protected setMaxRecordCount(propertyName: string, val: number): void {
    this.setPropertyValue(propertyName, val <= 0 ? 1 : val);
  }
  /* The core of the add and remove gates of the dynamic types: the type's allow flag, the read-only
     state, the count expression, the capability of the source and the count limit. The released
     clauses of one type stay with it (the panel's design mode and newPanelPosition, the matrix's
     canRemoveRowsCallback). */
  protected canAddRecordCore(isAllowed: boolean, count: number, limit: number): boolean {
    return this.isRecordAddAllowed(isAllowed) && count < limit;
  }
  // The add gate without the count limit: whether adding is possible at all.
  protected isRecordAddAllowed(isAllowed: boolean): boolean {
    return isAllowed && !this.isReadOnly && !this.hasRecordCountExpression && this.canWriteRecords("insert");
  }
  protected canRemoveRecordCore(isAllowed: boolean, count: number, min: number): boolean {
    return isAllowed && !this.isReadOnly && !this.hasRecordCountExpression && this.canWriteRecords("remove") && count > min;
  }
  // The add a respondent makes (the single-input add button): its text while an add is possible, undefined otherwise.
  protected getRecordAddText(): string {
    return undefined;
  }
  protected addRecordFromUI(): void { }
  // Nothing in the records may be edited: the question is read-only, or its source cannot update.
  protected get areRecordsReadOnly(): boolean {
    return this.isReadOnly || !this.canWriteRecords("update");
  }
  /* The value of the array types - the types with a record count of their own (getRecordCountNames):
     every record is a plain object, an empty one may be null. A keyed answer (the fixed matrices) keeps
     the rule of its type. */
  protected isDataValueCorrect(val: any): boolean {
    if (!this.getRecordCountNames()) return super.isDataValueCorrect(val);
    return Array.isArray(val) && val.every((record: any): boolean => Helpers.isValueEmpty(record) || Helpers.isValueObject(record, true));
  }
  // The count properties of a type; undefined: the type has no count of its own (the fixed matrix).
  protected getRecordCountNames(): IRecordCountNames {
    return undefined;
  }
  /* The serializer rule of the count property (rowCount, panelCount): left out while a data source is
     assigned, since the source owns the number of records (recordCount). */
  public static isRecordCountSerializable(obj: QuestionRecordsModel): boolean {
    return !obj.isRemoteData;
  }
  /* The record count of a type with a count of its own (getRecordCountNames): rowCount and panelCount
     delegate to it. Two counts live apart.
     While a data source is assigned, the source owns the number of records: the count is the one
     stored with its window (storedSourceRecordCount), and the question never asks the source to grow
     or shrink - records are added and removed one by one (an insert or a remove the source can
     refuse). The type's count property (getRecordCountNames().count) keeps the authored count then:
     only a JSON load and a binding write it, the survey JSON leaves it out (isRecordCountSerializable),
     and a detach shows it again (restoreValueFromSurveyData).
     Without a source the type keeps its count itself (getRecordCountCore / setRecordCountCore). */
  protected get recordCount(): number {
    return this.isRemoteData ? this.storedSourceRecordCount : this.getRecordCountCore();
  }
  protected set recordCount(val: number) {
    this.writeRecordCount(val, this.isLoadingFromJson ? "authored" : "code");
  }
  protected getRecordCountCore(): number {
    return 0;
  }
  protected setRecordCountCore(val: number): void { }
  /* The type's own writes of its count property (a removal that counts down, a clamp on load): while a
     source is assigned the property holds the authored count, so they leave it alone. */
  protected setRecordCountProperty(val: number): void {
    if (!this.isRemoteData) {
      this.setPropertyValue(this.getRecordCountNames().count, val);
    }
  }
  /* The one write of the record count. Without a source it reaches the type. While a source is
     assigned: an authored write (a JSON load, a binding) keeps the count in the type's property and
     does nothing else; a write from code that would change the count is reported once; an internal
     write (the limits, the count expression) is silent. */
  private writeRecordCount(val: number, origin: "code" | "authored" | "internal"): void {
    if (!this.isRemoteData) {
      this.setRecordCountCore(val);
    } else if (origin === "authored") {
      this.setPropertyValue(this.getRecordCountNames().count, Helpers.getNumber(val));
    } else if (origin === "code" && Helpers.getNumber(val) !== this.recordCount) {
      this.reportDataError(new Error("The data source owns the record count; add or remove records instead"), "count");
    }
  }
  /* The count the expression computes, clamped to the type's limits. A type runs the assignment in its
     own frame (runRecordCountExpressionWrite). */
  protected setRecordCountByExpression(val: any): void {
    const names = this.getRecordCountNames();
    if (!names) return;
    const count = this.getRecordCountByExpressionValue(val, this.getPropertyValue(names.minCount), this.getRecordCountLimitOf(names.maxCount));
    this.runRecordCountExpressionWrite((): void => this.writeRecordCount(count, "internal"));
  }
  protected runRecordCountExpressionWrite(write: () => void): void {
    write();
  }
  /* A change of the minimum or the maximum count (getRecordCountNames): the other limit and the count
     follow, and the count expression runs again over the new limits. The type adds its own steps:
     onMinRecordCountApplied before the count follows a new minimum, onMaxRecordCountApplied last. */
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === pagingStateKeys.pageCount) {
      this.updateRecordsBar();
    }
    // A push or a splice on sortCriteria: the array that raised it exists, and so does the helper.
    if (name === pagingStateKeys.sortCriteria && !!this._paging) {
      this._paging.onSortCriteriaChanged();
    }
    const names = this.getRecordCountNames();
    if (!names) return;
    if (name === names.minCount) {
      this.onMinRecordCountChanged(names);
    }
    if (name === names.maxCount) {
      this.onMaxRecordCountChanged(names);
    }
  }
  private onMinRecordCountChanged(names: IRecordCountNames): void {
    const val = this.getPropertyValue(names.minCount);
    if (val > this.getMaxRecordCount(names.maxCount))this.setMaxRecordCount(names.maxCount, val);
    this.onMinRecordCountApplied(val);
    if (this.recordCount < val)this.writeRecordCount(val, "internal");
    this.rerunRecordCountExpression();
  }
  private onMaxRecordCountChanged(names: IRecordCountNames): void {
    const val = this.getMaxRecordCount(names.maxCount);
    if (val < this.getPropertyValue(names.minCount))this.setPropertyValue(names.minCount, val);
    const limit = this.getRecordCountLimitOf(names.maxCount);
    if (this.recordCount > limit)this.writeRecordCount(limit, "internal");
    this.rerunRecordCountExpression();
    this.onMaxRecordCountApplied();
  }
  protected onMinRecordCountApplied(val: number): void { }
  protected onMaxRecordCountApplied(): void { }
  /* The count expression of a type (rowCountExpression, panelCountExpression) over the count it sets
     (getRecordCountNames). A data source owns the number of records, so the expression is ignored
     while one is attached - including the add/remove gating it otherwise imposes. No error: a question
     may carry both and only the source decides. The result is clamped by the type's limits, so
     changing a limit runs it again (rerunRecordCountExpression): the raw result is not stored. */
  protected get hasRecordCountExpression(): boolean {
    const names = this.getRecordCountNames();
    return !!names && !!this.getPropertyValue(names.countExpression) && !this.isRemoteData;
  }
  protected rerunRecordCountExpression(): void {
    if (this.isLoadingFromJson || !this.canRunConditions()) return;
    this.runExpressionByProperty(this.getRecordCountNames().countExpression, this.getDataFilteredProperties(),
      (val: any): void => { this.setRecordCountByExpression(val); });
  }
  protected updateBindings(propertyName: string, value: any): void {
    if (this.hasRecordCountExpression && propertyName === this.getRecordCountNames().count) return;
    super.updateBindings(propertyName, value);
  }
  // A bound count is an authored write: while a source is assigned it keeps the authored count only.
  protected updateBindingProp(propName: string, value: any): void {
    const names = this.getRecordCountNames();
    if (!names || propName !== names.count) {
      super.updateBindingProp(propName, value);
    } else if (!this.hasRecordCountExpression) {
      this.writeRecordCount(value, "authored");
    }
  }
  protected getRecordCountLimitOf(propertyName: string): number {
    return this.getRecordCountLimit(this.getMaxRecordCount(propertyName), this.getPropertyValueWithoutDefault(propertyName));
  }
  /* The page size the list gets: the authored one, capped by settings.maxPageSize - read on each call;
     a value that is not a positive number is no cap. Single-input mode walks every object and lists
     them in its own summary - it is its own paging - so it builds every object and the list does not
     page. A carousel without pageSize builds every panel, as it always has; with it, it pages like
     list and tab mode and shows one panel of the page. */
  protected get listPageSize(): number {
    if (this.isSingleInputActive) return 0;
    const maxPageSize = settings.maxPageSize;
    if (typeof maxPageSize !== "number" || !(maxPageSize > 0)) return this.pageSize;
    return Math.min(this.pageSize, maxPageSize);
  }
  // The nested elements of the rows or panels a build mode reads, item by item.
  protected forEachNestedElementCore(visit: (info: INestedElementInfo) => void, build: NestedWalkBuild): void {
    this.forEachNestedWalkItem(build, (item: NestedWalkItem, position: number, visible: boolean): void => {
      this.forEachNestedElementOfItem(item, position, visible, build, visit);
    });
  }
  /* The items a build mode reads, each with its position in the list of created items - never an index
     in a visible-only list, so that the segment of the record it holds can be computed - and whether the
     question shows it. */
  protected forEachNestedWalkItem(build: NestedWalkBuild, func: (item: NestedWalkItem, position: number, visible: boolean) => void): void { }
  // The nested elements of one item at a position in the list of created items.
  protected forEachNestedElementOfItem(item: NestedWalkItem, position: number, visible: boolean,
    build: NestedWalkBuild, visit: (info: INestedElementInfo) => void): void { }
  protected isListedAsNestedQuestion(includeItSelf: boolean): boolean {
    return includeItSelf;
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
  /* The records decide the page: their visibility is decided over the records, and when a flag changed
     and the page is not the one the objects hold, the objects are rebuilt - the rebuild runs the
     conditions of the new objects itself. Returns whether a flag changed and whether it rebuilt. */
  protected rebuildStalePage(properties: HashTable<any>): { isChanged: boolean, isRebuilt: boolean } {
    const isChanged = this.updatePagedRecordsVisibility(properties);
    const isRebuilt = isChanged && this.isPageStale();
    if (isRebuilt) {
      this.rebuildFromDataList(false);
    }
    return { isChanged: isChanged, isRebuilt: isRebuilt };
  }
  /* An object's visibility reaches its record: the owner-visibility layer of the list, which the
     visible count and the page count follow. Under paging the records decide the flags and nothing is
     written. The page state is synced only when the flag changed. Nothing is created for it: a list
     created later starts from the objects (seedItemRecordsVisibility). Returns whether the flag
     changed. */
  protected setItemRecordVisible(recordIndex: number, visible: boolean): boolean {
    const list = this._dataList;
    if (!list || this.isPagingActive || recordIndex < 0) return false;
    if (!list.setRecordVisible(recordIndex, visible)) return false;
    this.syncPagingState();
    return true;
  }
  /* The same for the objects that exist at once (count of them, by position), with one sync for the
     run. */
  protected setItemRecordsVisible(count: number, isVisible: (position: number) => boolean): boolean {
    const list = this._dataList;
    if (!list || this.isPagingActive) return false;
    let isChanged = false;
    for (let i = 0; i < count; i++) {
      const index = list.materializedIndexToIndex(i);
      if (index > -1 && list.setRecordVisible(index, isVisible(i))) {
        isChanged = true;
      }
    }
    // A run that changed no flag changed no page count.
    if (isChanged) {
      this.syncPagingState();
    }
    return isChanged;
  }
  /* The objects follow a change of the record count under a view: the objects that hold the first
     records of the page stay - a panel keeps its state and its errors, a row its open detail panel -
     and the records after them get objects appended (append, the type's way of making one); the page
     is rebuilt only when it is stale: a record added in front of the objects, one the page gives up for
     it, or one that left. */
  protected followRecordsWithObjects(append: (recordIndex: number) => void): void {
    if (this.isPageStale(true)) {
      this.rebuildFromDataList(false);
      return;
    }
    const records = this.dataList.getMaterializedIndexes();
    let count = 0;
    while(!!this.getItem(count)) count++;
    for (let i = count; i < records.length; i++) {
      append(records[i]);
    }
  }
  /* The record count changed outside a list write - the matrix pads its value up to rowCount, an
     assignment the list did not make: the records that appeared join the view, the ones that are gone
     leave it, and the page state follows. The list does not announce that page count. Nothing is
     created for it. */
  protected followRecordCountChange(): void {
    const list = this.dataListValue;
    if (!list) return;
    list.syncMembershipWithRecordCount();
    this.syncPagingState();
  }
  /* The visible records navigation counts when the list decides them - it pages, or its source pages
     itself and its window may hold hidden records; undefined otherwise: the question counts its
     objects. */
  protected get visibleRecordCount(): number {
    if (!this.isPagingActive && !this.isPagedBySource) return undefined;
    return this.dataListValue.globalVisibleCount;
  }
  /* A record follows the one at a visible index: the next index is below visibleCount (what the question
     navigates by), or the source said there are more and the total is unknown. */
  protected hasRecordAfterVisibleIndex(visibleIndex: number, visibleCount: number): boolean {
    if (visibleIndex < 0) return false;
    if (visibleIndex < visibleCount - 1) return true;
    const list = this.dataListValue;
    return !!list && list.hasRecordBeyondKnown;
  }
  /* The progress of a records question. When the list pages it is counted from the records - every
     input of every visible record (updateProgressInfoByRecord): the objects are one page. A source that
     pages itself counts its window: the other pages are on the server. Otherwise the built objects
     count, each question's own visibility is known there (getProgressInfoOfObjects); before they exist
     a view counts the records it shows, what the objects would be built for, and a question without a
     view answers getProgressInfoWithoutObjects. */
  public getProgressInfo(): IProgressInfo {
    const byRecords = (res: IProgressInfo, record: any): void => this.updateProgressInfoByRecord(res, record);
    if (this.isPagedByList) return this.getProgressInfoByRecords(byRecords);
    this.prepareProgressObjects();
    if (this.areObjectsBuilt()) return this.getProgressInfoOfObjects();
    if (this.hasRecordView) return this.getProgressInfoByRecords(byRecords);
    return this.getProgressInfoWithoutObjects();
  }
  protected prepareProgressObjects(): void { }
  protected abstract getProgressInfoOfObjects(): IProgressInfo;
  protected getProgressInfoWithoutObjects(): IProgressInfo {
    return this.getProgressInfoOfObjects();
  }
  protected abstract updateProgressInfoByRecord(res: IProgressInfo, record: any): void;
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
  private getPageState(): IRecordsPageState {
    if (!this.isPagedByList) return undefined;
    return this.pageValidation.getState(this.paging.pageIndex);
  }
  // The page is kept as well: the respondent comes back to where they were.
  private setPageState(state: IRecordsPageState): void {
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
  private static getPageStateOf(question: Question): IRecordsPageState {
    return question instanceof QuestionRecordsModel ? question.getPageState() : undefined;
  }
  protected hasPagedQuestions(questions: Array<Question>): boolean {
    return questions.some((q: Question): boolean => !!QuestionRecordsModel.getPageStateOf(q));
  }
  /* The state a paged question keeps for its records outlives the object that holds it (see
     IRecordsPageState): before the objects are disposed - or an object drops its questions - the
     states of the paged questions of each object are kept under the record the object was built for,
     and the questions the record's next object holds take them back (restorePageStatesOfQuestions).
     getQuestions answers an object's questions: the panel's, a matrix row's detail panel's. undefined
     - a row whose detail panel was never created - hands nothing over and keeps what was kept for the
     record; questions without a paged one hand empty states, which drop it. getRecordIndex names the
     record of an object, by default the one it was built for. */
  protected keepNestedPageStates(items: Array<QuestionRecordItem>,
    getRecordIndex: (item: QuestionRecordItem) => number = (item: QuestionRecordItem): number => this.getBuiltRecordIndex(item)): void {
    items.forEach((item: QuestionRecordItem): void => {
      const recordIndex = !!item ? getRecordIndex(item) : -1;
      if (recordIndex < 0) return;
      const questions = this.getNestedStateQuestions(item);
      if (!!questions) {
        const stateKey = !!this.builtStateKeys ? this.builtStateKeys.get(item) : undefined;
        this.keepPageStatesOfQuestions(stateKey !== undefined ? stateKey : recordIndex, questions);
      }
    });
  }
  /* The ancestor side of the states above: what the paged questions nested in one record keep, by
     value name, while their objects are rebuilt. A record without such a question keeps empty
     states, which clear its entry - and need no page validation to be created for that - while states
     that are not empty create it. */
  protected keepPageStatesOfQuestions(recordIndex: number | string, questions: Array<Question>): void {
    const states: { [valueName: string]: IRecordsPageState } = {};
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
    const states = !!this._pageValidation ? this._pageValidation.getNestedStates(this.getNestedStateKey(recordIndex)) : undefined;
    if (!states) return;
    questions.forEach((q: Question): void => {
      const state = states[q.getValueName()];
      if (!!state && q instanceof QuestionRecordsModel) {
        q.setPageState(state);
      }
    });
  }

  /* The page moves of RecordsPageValidation.leave: validate, clearIncorrectValues and
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
  // An inserted record is an edit layer 2 tracks (see RecordsPageValidation.markEdited).
  protected markRecordEdited(recordIndex: number): void {
    this.pageValidation.markEdited(recordIndex);
  }
  /* Shows the page that holds a visible position - where an added record is, or the record carousel
     and tab mode keep showing - as a move from code: the add was validated already. prepare runs
     only when the page changes, before the move: the page change rebuilds the objects at once, and
     the rebuild has to find what the question set aside for it. Returns whether the page changed. */
  private showPageOfVisibleIndex(visibleIndex: number, prepare?: () => void): boolean {
    if (this.isVisibleIndexOnPage(visibleIndex)) return false;
    if (!!prepare) prepare();
    this.paging.pageIndex = this.dataList.getPageOfVisibleIndex(visibleIndex);
    return true;
  }
  // The page that holds a visible index of the whole view is the page in force.
  protected isVisibleIndexOnPage(visibleIndex: number): boolean {
    const list = this.dataList;
    return list.getPageOfVisibleIndex(visibleIndex) === list.pageIndex;
  }
  /* Shows the page that holds a record, as a move from code (showPageOfVisibleIndex), under in-memory
     paging. A record the view does not show has no page: the page stays. keepPosition runs with the
     record's visible index before the page changes, and only when it does. Returns whether the page
     changed. */
  protected showPageOfRecord(recordIndex: number, keepPosition?: (visibleIndex: number) => void): boolean {
    if (!this.isPagedByList || recordIndex < 0) return false;
    const visibleIndex = this.dataList.getGlobalVisibleIndex(recordIndex);
    if (visibleIndex < 0) return false;
    return this.showPageOfVisibleIndex(visibleIndex, !!keepPosition ? (): void => keepPosition(visibleIndex) : undefined);
  }
  /* A question that pages validates the page that exists - Complete included - and then what the
     page cannot show: the edited records on other pages (layer 2) and a duplicate pair both of whose
     records are off the page. The question calls it once its page has passed. Returns true when there
     is nothing to visit. A validation on a value change stays on the page, and so does a source that
     pages itself. A full validation visits the other pages and shows the errors there; a quiet one (no
     callback) judges the same records without showing anything or moving the page, so both give the
     same answer.
     A record on a page the respondent never opened, and never edited, is not validated, and its
     computed values are not computed: that is how paging works (Andrew's decision 2026-10-12). */
  protected validateOffPage(context: ValidationContext): boolean {
    if (!this.isPagedByList || context.isOnValueChanged) return true;
    const pages = this.getOffPageDuplicatePages();
    if (this.isEveryPageValidated()) {
      for (let i = 0; i < this.dataList.pageCount; i++) {
        if (pages.indexOf(i) < 0) pages.push(i);
      }
    }
    if (!context.fireCallback) {
      if (this.pageValidation.validateEditedRecordsQuietly(pages)) return true;
      context.setErrorElement(this);
      return false;
    }
    return this.pageValidation.validateEditedRecords(context, pages);
  }
  // IRecordsPageValidationOwner: a record of another page judged by a temporary object (RecordCleanupRunner.cleanRecordWithObject).
  private isRecordValidQuietly(recordIndex: number): boolean {
    const record = this.getListRecordAt(recordIndex);
    let isValid = true;
    this.recordCleanup.cleanRecordWithObject(recordIndex, Helpers.isValueObject(record, true) ? record : {}, (cleanupObject: IRecordCleanupObject): void => {
      isValid = cleanupObject.validate();
    });
    return isValid;
  }
  /* The duplicates are looked for only when they are visited: the scan is O(records) per unique
     field, and a pair whose records both have no object has none the question's own check could put
     the error on. Returns the pages, without repeats; layer 2 walks them together with its own. */
  private getOffPageDuplicatePages(): Array<number> {
    const list = this.dataList;
    const uniqueness = this.getRecordUniqueness();
    const pages: Array<number> = [];
    if (uniqueness.fields.length === 0) return pages;
    // The records that take part, as the check on the page names them; an object takes part as it is shown.
    const indexes: Array<number> = [];
    this.forEachUniquenessRecord((index: number, item: QuestionRecordItem): void => {
      if (!item || this.isItemVisible(item)) indexes.push(index);
    });
    uniqueness.fields.forEach((name: string): void => {
      const readKey = (index: number): any => {
        const record = this.getListRecordAt(index);
        return !!record ? record[name] : undefined;
      };
      findDuplicatePages(list, indexes, readKey, uniqueness.caseSensitive).forEach((page: number): void => {
        if (pages.indexOf(page) < 0) pages.push(page);
      });
    });
    return pages;
  }
  /* The records the duplicate check on the page compares, as getRecordUniqueness names them, so that
     the check on the page and the scan off it agree: the loaded records - a duplicate on a page the
     question has not read is the server's business - or only the visible ones, and of the records
     with no object the owner-hidden ones only when they take part. A record with an object takes
     part when its object is visible (isItemVisible). */
  private forEachUniquenessRecord(func: (index: number, item: QuestionRecordItem, position: number) => void): void {
    const list = this.dataList;
    const uniqueness = this.getRecordUniqueness();
    const indexes = uniqueness.includeFilteredOut ? this.getLoadedRecordIndexes() : list.getVisibleIndexes();
    this.forEachRecordItem(indexes, (index: number, item: QuestionRecordItem, position: number): void => {
      if (!item && !uniqueness.includeHidden && !list.isRecordVisible(index)) return;
      func(index, item, position);
    });
  }
  /* The duplicate check of both types, field by field - the unique fields by default. Every visible
     object of a group of two or more is a duplicate: showErrors adds the error to its question, and
     every other object loses it. A record without an object takes part in the grouping and has
     nothing to mark. onDuplicate gets the question of each duplicate in object order, whether or not
     the error is shown - undefined for an object without the field's question, which is a duplicate
     all the same. Returns the objects that are duplicates in any of the fields. */
  protected checkRecordsUniqueness(showErrors: boolean, fields?: Array<string>, onDuplicate?: (question: Question) => void): Array<QuestionRecordItem> {
    const res: Array<QuestionRecordItem> = [];
    const inRes = new Set<QuestionRecordItem>();
    (fields || this.getUniqueColumnsNames()).forEach((field: string): void => {
      const duplicates = new Set<QuestionRecordItem>();
      groupByDuplicateKey(this.getUniquenessEntries(field), (entry: IUniquenessEntry): any => entry.value,
        this.isRecordUniquenessCaseSensitive(), (entry: IUniquenessEntry): boolean => entry.isEmpty)
        .forEach((group: Array<IUniquenessEntry>): void => {
          if (group.length > 1) group.forEach((entry: IUniquenessEntry): void => { if (!!entry.item) duplicates.add(entry.item); });
        });
      this.forEachItem((item: QuestionRecordItem): void => {
        const isDuplicate = duplicates.has(item);
        const question = this.getUniquenessQuestion(item, field, isDuplicate && showErrors);
        if (!isDuplicate) {
          if (!!question && this.removeDuplicationError(question)) {
            this.onDuplicationErrorRemoved(item, question);
          }
          return;
        }
        if (!inRes.has(item)) {
          inRes.add(item);
          res.push(item);
        }
        if (showErrors && !!question) {
          this.addDuplicationError(question);
        }
        if (!!onDuplicate) onDuplicate(question);
      });
    });
    return res;
  }
  /* The values of field that are compared: under a view the records forEachUniquenessRecord names,
     without one the objects. A visible object gives its question's value when it has the field's
     question, otherwise its stored record value; a hidden object takes no part. A question decides
     itself whether its value is empty (allowSpaceAsAnswer keeps "   "); any other value is empty when
     it is empty once trimmed. */
  private getUniquenessEntries(field: string): Array<IUniquenessEntry> {
    const res: Array<IUniquenessEntry> = [];
    const addValue = (item: QuestionRecordItem, value: any): void => { res.push({ item: item, value: value, isEmpty: this.isValueEmpty(value) }); };
    const addItem = (item: QuestionRecordItem, position: number): void => {
      if (!this.isItemVisible(item)) return;
      const question = this.getUniquenessQuestion(item, field, false);
      if (!!question) {
        res.push({ item: item, value: question.value, isEmpty: question.isEmpty() });
        return;
      }
      const record = this.getListRecordAt(this.getRecordIndexAtCreatedPosition(position));
      addValue(item, !!record ? record[field] : undefined);
    };
    if (!this.hasDataListView) {
      this.forEachItem(addItem);
      return res;
    }
    const read = this.createDuplicationRecordReader();
    this.forEachUniquenessRecord((index: number, item: QuestionRecordItem, position: number): void => {
      if (!!item) {
        addItem(item, position);
        return;
      }
      const record = read(index);
      addValue(undefined, !!record ? record[field] : undefined);
    });
    return res;
  }
  /* The question of an object that holds field and shows its duplication error: the one that writes
     the field. isShowingError: the error is about to be added, so a type may create the question. */
  protected getUniquenessQuestion(item: QuestionRecordItem, field: string, isShowingError: boolean): Question {
    return this.getRecordFieldQuestion(item, field);
  }
  // The duplication error has just left the question of an object that is no longer a duplicate.
  protected onDuplicationErrorRemoved(item: QuestionRecordItem, question: Question): void { }
  // Reads a record without an object for the duplicate checks.
  protected createDuplicationRecordReader(): (index: number) => any {
    return (index: number): any => this.getListRecordAt(index);
  }
  /* What a duplicate is among the records; asked only when the records without an object are scanned.
     A record the visibility expression hides does not take part, as a hidden object does not on the page;
     a filtered-out one does unless the type says otherwise. Strings compare as the on-page check compares
     them; every object of a group gets the error on its page (checkRecordsUniqueness). */
  protected getRecordUniqueness(): IDynamicDataRecordUniqueness {
    return { fields: this.getUniqueColumnsNames(), caseSensitive: this.isRecordUniquenessCaseSensitive(), includeHidden: false, includeFilteredOut: true };
  }
  /* The fields whose values must be unique among the records, in the order the check walks them: the key
     of a type with keyName. The matrix puts its isUnique columns before the key. */
  protected getUniqueColumnsNames(): Array<string> {
    const key = this.getRecordKeyName();
    return !!key ? [key] : [];
  }
  // The keyName of the types that have one.
  protected getRecordKeyName(): string {
    return "";
  }
  // The keys of a dynamic panel compare as text, case-sensitively; the matrix says useCaseSensitiveComparison.
  protected isRecordUniquenessCaseSensitive(): boolean {
    return true;
  }
  protected getDuplicationError(question: Question): SurveyError {
    const errors = question.errors;
    for (let i = 0; i < errors.length; i ++) {
      if (errors[i].getErrorType() === "keyduplicationerror") return errors[i];
    }
    return null;
  }
  // A question shows one duplication error, however many times it is found duplicated.
  protected addDuplicationError(question: Question): void {
    if (!this.getDuplicationError(question)) {
      question.addError(new KeyDuplicationError(this.getDuplicationErrorText(), this));
    }
  }
  // The keyDuplicationError of the types that declare it; empty gives the default text.
  protected getDuplicationErrorText(): string {
    return "";
  }
  protected removeDuplicationError(question: Question): boolean {
    return question.removeError(this.getDuplicationError(question));
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
  // The visibility of template elements in the records without an object (HiddenAnswerTracker).
  protected createRecordElementVisibility(properties: HashTable<any>): IRecordElementVisibility {
    return this.hiddenAnswers.createRecordElementVisibility(properties);
  }
  // The question's clearIfInvisible allows a clear for the reason (Question.clearValueIfInvisible).
  protected canRecordQuestionBeCleared(q: Question, reason: string): boolean {
    const clearIf = this.survey.getQuestionClearIfInvisible(q.clearIfInvisible);
    if (clearIf === "none") return false;
    if (reason === "onHidden" && clearIf === "onComplete") return false;
    return reason !== "onHiddenContainer" || clearIf === reason;
  }
  // clearIfInvisible "onHidden" / "onHiddenContainer" over the records without an object (HiddenAnswerTracker).
  protected clearHiddenAnswersWithoutObjects(properties: HashTable<any>): void {
    this.hiddenAnswers.clearHiddenAnswersWithoutObjects(properties);
  }
  /* The records that have no object under paging in memory - the records of the pages never opened or
     visited and left, and the records the visibility condition hides - walked by the clean-ups that work
     over the stored records: the onHidden pass above and the Dynamic Panel's completion pass. Only a
     question the list pages in memory has such records, a source-owned question is skipped as every
     survey clean-up skips it, and nothing runs while the invisible elements are shown
     (canCleanRecordsWithoutObjects). A record that is not an object (a string, an array) is left as it
     is. clean gets each record without an object together with the visibility of the template elements
     in it (createRecordElementVisibility, made once per walk and reset to the record), and returns the
     record without the cleared answers (removeRecordAnswer), or undefined. onItem gets each record that
     has an object, with the object. Returns the changed records, for writeRecordChanges.
     Cost: one condition run per condition per record without an object, one runner per expression text
     - except a condition that reads no record variable, which runs once per walk. */
  protected canCleanRecordsWithoutObjects(): boolean {
    return this.isPagedByList && !this.areInvisibleElementsShowing && !this.isRemoteData && !!this.survey;
  }
  protected collectRecordChangesWithoutObjects(properties: HashTable<any>, clean: (index: number, record: any, visibility: IRecordElementVisibility) => any,
    onItem?: (index: number, record: any, item: QuestionRecordItem) => void): Array<{ index: number, record: any }> {
    const changes: Array<{ index: number, record: any }> = [];
    if (!this.canCleanRecordsWithoutObjects()) return changes;
    let visibility: IRecordElementVisibility;
    this.forEachRecordItem(this.dataList.getCreatedIndexes(), (index: number, item: QuestionRecordItem): void => {
      const record = this.getListRecordAt(index);
      if (!!item) {
        if (!!onItem) onItem(index, record, item);
        return;
      }
      if (!Helpers.isValueObject(record, true)) return;
      if (!visibility) visibility = this.createRecordElementVisibility(properties);
      visibility.reset(index, record);
      const cleared = clean(index, record, visibility);
      if (!!cleared) changes.push({ index: index, record: cleared });
    });
    return changes;
  }
  // Whether the panels around an input in a record without an object, up to getRecordInputContainer(), are visible.
  protected isRecordInputContainerVisible(visibility: IRecordElementVisibility, q: Question): boolean {
    return isHiddenAnswerContainerVisible((el: PanelModelBase): boolean => visibility.isVisible(el), q, this.getRecordInputContainer());
  }
  /* An assignment from outside keeps the hidden-answer states of the records that stay (the panel); a
     type that rebuilds its objects drops them (HiddenAnswerTracker). */
  protected keepsHiddenAnswerStates(oldCount: number, newCount: number): boolean {
    return true;
  }
  // The built objects with the key their record's hidden-answer state is kept under.
  private forEachBuiltRecordItem(func: (key: any, item: QuestionRecordItem) => void): void {
    const source = this.recordsSource;
    this.forEachItem((item: QuestionRecordItem): void => {
      if (!isRecordItem(item)) return;
      const index = this.getBuiltRecordIndex(item);
      if (index > -1) func(source["getRecordStateKey"](index, undefined), item);
    });
  }
  /* The record without the answer stored under name and its comment, the keys clearValue() removes.
     cleared: the copy made so far, undefined for none; the result is that copy, made when needed. */
  protected removeRecordAnswer(record: any, cleared: any, name: string): any {
    getRecordAnswerKeys(name).forEach((key: string): void => {
      if ((cleared || record)[key] === undefined) return;
      if (!cleared) cleared = Object.assign({}, record);
      delete cleared[key];
    });
    return cleared;
  }
  // The record holds an answer of the question: one of the keys removeRecordAnswer removes.
  protected hasRecordQuestionAnswer(record: any, name: string): boolean {
    return getRecordAnswerKeys(name).some((key: string): boolean => record[key] !== undefined);
  }
  // The records a clean-up pass changed, written in one batch of the list as the question's own change.
  protected writeRecordChanges(changes: Array<{ index: number, record: any }>): void {
    if (changes.length === 0) return;
    const list = this.dataList;
    this.writeRecords((): void => list.batch((): void => {
      changes.forEach((change: { index: number, record: any }): void => { list.setRecord(change.index, change.record); });
    }));
  }
  /* The template questions whose visibility can differ by record or change while the survey runs: a
     visibleIf of their own or of a panel around them (up to getRecordInputContainer). */
  protected abstract getRecordConditionalInputs(): Array<Question>;
  // The element that holds the questions of a record, where the walk up a question's parents stops.
  protected getRecordInputContainer(): PanelModelBase {
    return undefined;
  }
  /* Under paging the records decide their visibility (updatePagedRecordsVisibility) and a hidden record
     gets no object, so an object runs no visibility condition of its own (rowsVisibleIf,
     templateVisibleIf): the object and its record cannot disagree. */
  protected get areRecordsDecidingVisibility(): boolean {
    return this.isPagingActive;
  }
  /* The records decide their visibility over the stored values (updatePagedRecordsVisibility): before
     the page is cut - it is a slice of the visible records - and before a clean-up over the records,
     where a record the condition hides has no object and its flag says so. */
  protected decideRecordsVisibility(): void {
    if (!!this.data) {
      this.updatePagedRecordsVisibility(this.getDataFilteredProperties());
    }
  }
  // Called only when the expression runs, once per run: one item is reset to every record.
  protected createRecordVisibilityScope(properties: HashTable<any>): IDynamicDataRecordScope {
    const item = this.createRecordItem(-1);
    const newProps = Helpers.createCopy(properties);
    newProps[this.getRecordItemVariableName()] = item;
    return { item: item, properties: newProps };
  }

  // The completion clean-up of the records without an object (RecordCleanupRunner).
  protected cleanRecordsWithoutObjectsAtComplete(container: PanelModelBase, clean: (cleanupObject: IRecordCleanupObject) => void): void {
    this.recordCleanup.cleanRecordsWithoutObjectsAtComplete(container, clean);
  }
  // The question of a record's template that stores key, for the value-only clean-ups.
  protected abstract getRecordTemplateQuestion(key: string): Question;
  // The copy a temporary object of the clean-up reads, and its build (RecordCleanupRunner).
  protected getRecordCleanupCopy(item: ISurveyData, isUnknownItem: boolean): any {
    return this.recordCleanup.getRecordCleanupCopy(item, isUnknownItem);
  }
  protected get isRecordCleanupBuilding(): boolean {
    return this.recordCleanup.isRecordCleanupBuilding;
  }
  /* The temporary object of the records clean-up (RecordCleanupRunner) for the record at index, built and
     loaded as a page build builds one; undefined keeps the record as it is. */
  protected abstract createRecordCleanupObject(index: number, record: any): IRecordCleanupObject;
  protected getRecordCleanupJson(build: () => any): any {
    return this.recordCleanup.getRecordCleanupJson(build);
  }
  protected validateRecordObjectQuietly(validate: (context: ValidationContext) => boolean): boolean {
    return this.recordCleanup.validateRecordObjectQuietly(validate);
  }
  // A template question the clean-up does not judge (see RecordCleanupRunner).
  protected isRecordCleanupSkipped(question: Question): boolean {
    return isRecordCleanupSkipped(question);
  }
  /* The write capabilities of a data source are declared by the presence of its optional methods (its
     read capabilities by flags, see dynamic-data-interfaces.ts), and need a keyField for any source
     that is not an in-memory array (DynamicDataList.hasCapability): a source without insert gets no
     add button, one without remove no delete button, and one without update makes every object
     read-only - a silently unsaved edit is worse than a disabled field. A source without keyField is
     read-only as a whole. No data source takes a move, so a question with one has no drag handles. A
     question without a data source has every capability, except the membership operations of a
     question that defines its records itself (isRecordMembershipFixed). The list is not created for
     the answer. */
  protected canWriteRecords(operation: DynamicDataSourceMethod): boolean {
    if (this.isRecordMembershipFixed() && (operation === "insert" || operation === "remove" || operation === "move")) return false;
    const list = this._dataList;
    if (!list || !list.isRemote) return true;
    return list.hasCapability(operation);
  }
  /* The source half of canWriteRecords, for an operation the question is about to make: an assigned
     source without the capability refuses it before any other check, event or change, whichever path
     asked - code or UI - and the refusal is reported once, under the operation. The membership rule of
     a question that defines its records itself is not a refusal of the source and stays silent, as
     does every other reason not to make an operation. Returns true when the operation is refused. */
  protected refuseOperationOfSource(operation: DynamicDataSourceMethod): boolean {
    if (this.isRecordMembershipFixed() && operation !== "update") return false;
    const list = this._dataList;
    if (!list || !list.isRemote) return false;
    // Before the capability: a source is refused a move whatever methods it has.
    if (operation === "move") {
      this.reportOperationRefused("move", "Rows cannot be reordered while a data source is assigned");
      return true;
    }
    if (!list.hasCapability(operation)) {
      // A local source without keyField has its write methods: it is refused only because another question writes it.
      const source = list.assignedSource;
      const reason = isLocalSource(source) && !list.keyField ?
        "The data source is written by position by another question, so the records of this question are read-only" :
        !list.keyField ? "The data source has no keyField, so its records are read-only" : "The data source does not implement " + operation;
      this.reportOperationRefused(operation, reason);
      return true;
    }
    return false;
  }
  /* The writes the question computes itself - while it builds the objects of its records and while it
     runs the conditions of its objects: default values, expression results, setValueExpression and
     defaultValueExpression. They are not edits, and a source without update does not refuse them:
     they reach the window and question.value, never the source, as they always have. {panel.x} and
     {row.x} read the record, so a computed value has to reach it - an expression that reads another
     one would lose it otherwise. The scopes nest. */
  private computedWritesScope: Scope = new Scope();
  protected runComputedWrites<T>(func: () => T): T {
    return this.computedWritesScope.run(func);
  }
  /* The edit rule both owners' updateItemValue start with: an edit of a record - any write outside
     runComputedWrites - that the source cannot update is refused and reported, nothing is written, and
     the object shows its stored record again; updateFromRecord does not write it back.
     getRecordIndex names the item's record; it is read only for a refusal. Returns true when the edit
     is refused. */
  protected refuseRecordEdit(item: QuestionRecordItem, getRecordIndex: () => number): boolean {
    if (this.computedWritesScope.isActive || !this.refuseOperationOfSource("update")) return false;
    const index = getRecordIndex();
    item.updateFromRecord(index > -1 ? this.dataList.getRecord(index) : undefined);
    return true;
  }
  /* A remove on a page the list cuts leaves it one record short, and the first record of the next
     page belongs on it now: the page is refilled, as a data source's remove refill does. A
     remove that emptied the last page moved the page back, and that page change rebuilt it already.
     pageIndexBefore: the page index the list had before the remove. */
  private refillPageAfterRemove(pageIndexBefore: number): void {
    if (this.isPagedByList && this._dataList.pageIndex === pageIndexBefore) {
      this.rebuildFromDataList(false);
    }
  }
  // The removal of a target and the focus after it (RecordTargetResolver). undefined: nothing was removed.
  protected removeTarget<T extends IRecordRemoval>(target: IRecordTarget, raiseRemoving: (removal: IRecordRemoval) => boolean,
    extend?: (removal: IRecordRemoval) => T): T {
    return this.recordTargets.removeTarget(target, raiseRemoving, extend);
  }
  protected keepFocusForReadAfterRemoval(index: number): void {
    this.recordTargets.keepFocusForReadAfterRemoval(index);
  }
  // The indexes of every loaded record, in record order.
  protected getLoadedRecordIndexes(): Array<number> {
    return createIndexes(this.dataList.loadedCount);
  }
  protected createItemTarget(item: QuestionRecordItem, visibleIndex: number): IRecordTarget {
    return this.recordTargets.createItemTarget(item, visibleIndex);
  }
  /* The removal, in order: the page index is read (the splice and what the type does after it do not
     move the page), the object leaves its array (detachItem), and the storage write runs
     (removeStoredRecord), which calls the refill of the page the list cuts once, where the type
     decides; a second call does nothing. The caller announces the removal afterwards, unless the type
     does inside its write. */
  protected removeResolvedRecord(removal: IRecordRemoval): void {
    const pageIndex = !!this.dataListValue ? this.dataListValue.pageIndex : 0;
    this.detachItem(removal);
    let isRefilled = false;
    this.runObjectsFollowingWrite((): void => {
      this.removeStoredRecord(removal, (): void => {
        if (isRefilled) return;
        isRefilled = true;
        this.refillPageAfterRemove(pageIndex);
      });
    });
  }
  /* "Add" is a move the respondent makes when the new record lands on another page than the one shown
     (getVisibleIndex: the place it takes in the view): that page is validated first, and the add
     happens once it has passed (leavePage) - later, when its validators are asynchronous. */
  protected isRecordAddLeavingPage(getVisibleIndex: () => number): boolean {
    return this.isPagedByList && !this.isVisibleIndexOnPage(getVisibleIndex());
  }
  /* The remote add. The local one grows the count first and writes the defaults afterwards, which
     over a data source is a throwing count setter followed by up to three server calls for one
     gesture. Here the type hands the complete record - its defaults and the copy from the last entry
     - and it goes to the list once: one source.insert, no move, no follow-up update; the defaults are
     part of the record because the new object finds them there and writes nothing. recordIndex: the
     record of the window the new one goes in front of, loadedCount to append. The objects follow the
     record (followInsertedRecord), and question.value the window. Returns the record index list.add
     answered and the object that shows it, if any. */
  protected addRecordRemote(record: any, recordIndex: number): { index: number, item: QuestionRecordItem } {
    const list = this.dataList;
    const index = this.runRecordAdd((): number => list.add(record, recordIndex));
    return { index: index, item: this.followInsertedRecord(index, false) };
  }
  /* The objects follow one record the list has just inserted. recordIndex is what list.add returned,
     a record index of the loaded window. In order:
     1. Under in-memory paging the record is marked edited and the page that holds it is shown; a
        page change rebuilds the objects. With select, the position of the record is kept for that
        rebuild, which selects it. A record the view does not show (rowsVisibleIf / templateVisibleIf
        hides it) has no page: the page stays.
     2. When the page did not change, the objects follow by the record's object position: an object
        already at that position - the objects are rebuilt (the record went in front of them); none
        there and the one before exists, or position 0 - one object is appended
        (appendItemForRecord); no position - nothing.
     Objects that were never built (areObjectsBuilt() is false) are not created or rebuilt for the
     record: only step 1 runs. Returns the record's item once that is done, undefined when it has
     none; with select the question selects it, the position kept for a rebuild is gone by then. */
  protected followInsertedRecord(recordIndex: number, select: boolean): QuestionRecordItem {
    const list = this.dataList;
    if (this.showPageOfInsertedRecord(recordIndex, select)) return this.getItemByRecordIndex(recordIndex);
    if (this.areObjectsBuilt()) {
      const position = list.indexToMaterializedIndex(recordIndex);
      if (position > -1 && !!this.getItem(position)) {
        this.rebuildFromDataList(false);
      } else if (position === 0 || position > 0 && !!this.getItem(position - 1)) {
        this.appendItemForRecord(recordIndex);
      }
    }
    if (select) {
      this.takePendingVisibleIndex();
    }
    return this.getItemByRecordIndex(recordIndex);
  }
  /* Step 1 of followInsertedRecord, also for an add whose objects the count setter has built already:
     under in-memory paging the inserted record is marked edited and the page that holds it is shown
     (showPageOfRecord). With select the record's position is kept for the rebuild that follows, a
     page change or not. Returns whether the page changed. */
  protected showPageOfInsertedRecord(recordIndex: number, select: boolean = false): boolean {
    if (!this.isPagedByList || recordIndex < 0) return false;
    this.markRecordEdited(recordIndex);
    if (select) {
      const visibleIndex = this.dataList.getGlobalVisibleIndex(recordIndex);
      if (visibleIndex > -1)this.keepPendingVisibleIndex(visibleIndex);
    }
    return this.showPageOfRecord(recordIndex);
  }
  /* The add of a question whose count setter builds the objects (setRecordCountCore in grow):
     the grow appends the new record at the end, and the record then moves to getIndex() and takes
     getRecord(index) when that answers one - one write, in one list.batch. getIndex runs after the
     grow; undefined keeps the record where the grow appended it. An assignment from outside that the
     grow defers and follows (see runOwnRecordsChange) stops the add. A count that did not grow runs
     onNotGrown: the caller decides what the add does then. Returns the record index the new record
     ended at, or -1: the count did not grow, an outside assignment happened during the grow - the
     assigned value stays, none of its records is the new one - or getIndex answered none. */
  protected growAndMoveRecord(grow: () => void, getIndex: () => number, getRecord: (index: number) => any, onNotGrown?: () => void): number {
    const outsideAssignmentCount = this.outsideAssignmentCount;
    const oldCount = this.getListRecordCount();
    this.runRecordAdd(grow);
    if (this.outsideAssignmentCount !== outsideAssignmentCount) return -1;
    const list = this.dataList;
    if (list.count === oldCount) {
      if (!!onNotGrown) onNotGrown();
      return -1;
    }
    let index = getIndex();
    if (index === undefined) index = list.count - 1;
    if (index < 0) return -1;
    list.batch((): void => {
      const lastIndex = list.count - 1;
      if (index !== lastIndex) {
        list.move(lastIndex, index);
      }
      const record = getRecord(index);
      if (record !== undefined) {
        list.setRecord(index, record);
      }
    });
    return index;
  }
  /* A new record: the default values of the questions a record has (inputs: the columns, the template
     questions; getKey names the key a value is stored under), then defaultRecord, then copyFrom - a
     later one wins. Everything is unbound: the record shares no object with the defaults or with the
     record it copies. */
  protected composeNewRecord<T>(inputs: Array<T>, getQuestion: (input: T) => Question, getKey: (input: T) => string,
    defaultRecord: any, copyFrom?: any): any {
    const record: any = {};
    for (let i = 0; i < inputs.length; i++) {
      const question = getQuestion(inputs[i]);
      const val = !!question ? question.getDefaultValue() : undefined;
      if (!this.isValueEmpty(val)) {
        record[getKey(inputs[i])] = Helpers.getUnbindValue(val);
      }
    }
    if (!this.isValueEmpty(defaultRecord)) {
      QuestionRecordsModel.copyRecordValues(record, defaultRecord);
    }
    if (!!copyFrom) {
      QuestionRecordsModel.copyRecordValues(record, copyFrom);
    }
    return record;
  }
  private static copyRecordValues(dest: any, src: any): void {
    for (const key in src) {
      dest[key] = Helpers.getUnbindValue(src[key]);
    }
  }
  /**
   * Specifies the number of rows or panels per data page.
   *
   * Default value: 0 (pagination is disabled)
   *
   * The effective page size is limited by the [`settings.maxPageSize`](https://surveyjs.io/form-library/documentation/api-reference/settings#maxPageSize) property.
   * @see pageIndex
   * @see pageCount
   */
  public get pageSize(): number {
    return this.getPropertyValue(pagingStateKeys.pageSize);
  }
  public set pageSize(val: number) {
    this.paging.setPageSize(val);
    this.onPageSizeAssigned();
  }
  /* The data source is read again with the request in force - the page, the filter and the sort. A
     source is read, not watched: a change made to it elsewhere (another user, an array changed in
     place, a survey value behind a SurveyDataDynamicDataSource) shows after this read. It is not
     refreshView(), which re-decides the view of the records in memory. Without a data source there is
     nothing to read: question.value is read through on every access. */
  protected refreshSource(): void | Promise<void> {
    const list = this.dataListValue;
    if (!list || !list.isRemote) return;
    return list.refresh();
  }
  // Single-input mode reads every object, and nothing tells the list that it became active.
  protected syncPageSizeWithMode(): void {
    this.syncListPageSize();
  }
  /**
   * Gets or sets the zero-based index of the current data page containing rows or panels. Set this property to switch between data pages.
   * @see pageSize
   * @see pageCount
   */
  public get pageIndex(): number { return this.reportedPageIndex; }
  public set pageIndex(val: number) { this.paging.pageIndex = val; }
  /**
   * Gets the number of data pages used to display rows or panels. Returns 1 when the question is empty or pagination is disabled.
   * @see pageSize
   * @see pageIndex
   */
  public get pageCount(): number { return this.reportedPageCount; }
  /* False while the data source answers a read without a total: the record count (rowCount,
     panelCount) is then the number of records known to exist - a lower bound - and pageCount the
     number of pages found so far. Every source that hands over the whole storage leaves it true. */
  public get isCountKnown(): boolean { return this.paging.isCountKnown; }
  public get canGoNextPage(): boolean { return this.paging.canGoNextPage; }
  public get canGoPrevPage(): boolean { return this.paging.canGoPrevPage; }
  private changePageWithoutAnimation(func: () => boolean) {
    this.blockAnimations();
    const res = func();
    this.releaseAnimations();
    return res;
  }
  /* The respondent's page moves: a move forward validates the page it leaves. false = an error was
     found at once; true = moved, or waiting for asynchronous validators (see isPageMovePending). */
  public goToPage(index: number): boolean { return this.changePageWithoutAnimation(() => this.paging.goToPage(index)); }
  public nextPage(): boolean { return this.changePageWithoutAnimation(() => this.paging.nextPage()); }
  public prevPage(): boolean { return this.changePageWithoutAnimation(() => this.paging.prevPage()); }
  /* The sort the records are displayed in: criteria applied in array order, an empty array = no sort.
     It never reorders the question value. A live array, like choices: an assignment, a push or a
     splice on it, or an edit of an item's field or direction re-applies it. The setter takes plain
     { field, direction } objects and copies them - the question never holds the caller's objects -,
     so its type is wider than the getter's. It is the current sort: a sort made at runtime changes
     what toJSON() emits. */
  public get sortCriteria(): Array<SortCriterion> { return this.paging.sortCriteria; }
  public set sortCriteria(val: Array<ISortCriterion>) { this.paging.sortCriteria = val; }
  /* sort("price") sorts by one field, ascending unless direction is "desc"; with append the current
     sort stays and the field takes the direction where it already is, or joins at the end.
     sort([...]) is the assignment of sortCriteria. A sort from code does not validate the page. */
  public sort(field: string, direction?: SortDirection, append?: boolean): void;
  public sort(criteria: Array<ISortCriterion>): void;
  public sort(fieldOrCriteria: string | Array<ISortCriterion>, direction?: SortDirection, append?: boolean): void {
    this.paging.sort(fieldOrCriteria, direction, append);
  }
  public clearSort(): void { this.paging.clearSort(); }
  /* What a click on a sortable header does: ascending, then descending, then not sorted. With
     append the field is cycled inside the current sort instead of replacing it, which is the
     multi-field sort a modified header click makes; a new field that would go past maxSortLevel
     replaces the last level. It validates the page it replaces. For the renderers: code sorts with
     sort(). */
  public toggleSort(field: string, append?: boolean): boolean { return this.paging.toggleSort(field, append); }
  /* The sort a respondent can make: by a header click a renderer may offer (a column opts out with
     column.allowSort = false) or from the Sort by menu. It does not gate the code API - sort(),
     sortCriteria, clearSort() and toggleSort() work whatever its value: the renderers gate on
     column.isSortable and isSortMenuVisible. */
  @property({ defaultValue: false }) allowSort: boolean;
  /* The most criteria a respondent's toggleSort(field, true) leaves in the sort: at least 1, with no
     upper bound. sort(), sortCriteria and JSON are not limited by it. The clamp is in the setter, which
     also runs while the question loads from JSON. */
  public get maxSortLevel(): number {
    return this.getPropertyValue("maxSortLevel", 1);
  }
  public set maxSortLevel(val: number) {
    const num = Helpers.getNumber(val);
    this.setPropertyValue("maxSortLevel", num >= 1 ? Math.floor(num) : 1);
  }
  // true, false or "auto": "auto" shows the Sort by menu only where the column headers cannot sort.
  public get showSortMenu(): boolean | "auto" {
    return this.getPropertyValue("showSortMenu", "auto");
  }
  public set showSortMenu(val: boolean | "auto") {
    this.setPropertyValue("showSortMenu", val === true || val === false ? val : "auto");
  }
  public get isSortMenuVisible(): boolean {
    const show = this.showSortMenu;
    return this.allowSort === true && (show === true || show === "auto" && !this.canSortByHeaders);
  }
  // Whether the rendered column headers sort: paneldynamic has no headers.
  protected get canSortByHeaders(): boolean { return false; }
  /* A survey expression over the record values - the same language as visibleIf, with the record
     fields as its variables. A record that does not satisfy it has no object; the question value
     keeps every record. An empty string = no filter. It is not rowsVisibleIf / templateVisibleIf:
     that one is a per-object expression with the object's context and stays the owner-visibility
     layer. */
  public get filterExpression(): string { return this.paging.filterExpression; }
  public set filterExpression(val: string) { this.paging.filterExpression = val; }
  public refreshView(): void { this.paging.refreshView(); }
  /* The bar the renderers show under the records: the pager. Created on its first read; the question
     keeps it current through updateRecordsBar(). */
  private recordsBarValue: QuestionRecordsBar;
  public get recordsBar(): QuestionRecordsBar {
    if (!this.recordsBarValue) {
      this.recordsBarValue = new QuestionRecordsBar(this.createRecordsBarOwner());
    }
    return this.recordsBarValue;
  }
  // Nothing to do before the bar is created: it reads the current state when it is.
  protected updateRecordsBar(): void {
    if (!!this.recordsBarValue) {
      this.recordsBarValue.update();
    }
  }
  /* The footer under the records: the type's own footer content (the matrix's bottom toolbar, the
     dynamic panel's progress and buttons) and the pager share one row while the pager shows. The
     matrix renders the footer only with the pager, so its markup stays the same without paging. A
     type without a footer class (the matrix dropdown) gets "". */
  public getFooterCss(): string {
    return toCssClasses(this.cssClasses.footer, this.showPager && this.cssClasses.footerWithPager);
  }
  /* The functions call the question's members when they are called, so an override or a spy on the
     question is honoured (see helperOwner). The page index and count are the synced state in the
     property hash, not the reported values: those answer one page without reading the hash while
     the list does not page yet, and a pager updater would then never observe them. */
  private createRecordsBarOwner(): IQuestionRecordsBarOwner {
    const question = this;
    return {
      get pageIndex(): number { return question.paging.pageIndex; },
      get pageCount(): number { return question.paging.pageCount; },
      get isCountKnown(): boolean { return question.isCountKnown; },
      get canGoPrevPage(): boolean { return question.canGoPrevPage; },
      get canGoNextPage(): boolean { return question.canGoNextPage; },
      goToPage: (pageIndex: number): void => { question.goToPage(pageIndex); },
      prevPage: (): void => { question.prevPage(); },
      nextPage: (): void => { question.nextPage(); },
      get isPageMovePending(): boolean { return question.isPageMovePending; },
      get isDataLoading(): boolean { return question.isDataLoading; },
      get isMobile(): boolean { return question.isMobile; },
      get isDisposed(): boolean { return question.isDisposed; },
      get showPager(): boolean { return question.showPager; },
      getLocalizationFormatString: (strName: string, ...args: any[]): string => question.getLocalizationFormatString(strName, ...args),
      getLocOwner: (): ILocalizableOwner => question,
      getCssClasses: (): IRecordsBarCssClasses => {
        const css = question.cssClasses;
        return { root: css.recordsBar, pager: css.pager, pagerPage: css.pagerPage, pagerTotal: css.pagerTotal };
      },
      createActionContainer: (): ActionContainer => question.createActionContainer()
    };
  }
  /* The type's pager rule: the renderers draw the pager under the records while it is true. The bar
     mirrors it (QuestionRecordsBar.showPager). */
  public get showPager(): boolean {
    return false;
  }
  // True while a page move waits for the asynchronous validators of the page it leaves.
  public get isPageMovePending(): boolean { return this.getPropertyValue(pagingStateKeys.isPageMovePending, false); }
  // What the question reports. A zero-based page index; always 0 while paging is off.
  protected get reportedPageIndex(): number {
    return this.isPagingActive ? this.paging.pageIndex : 0;
  }
  // The number of pages; 1 for an empty question and for one that does not page.
  protected get reportedPageCount(): number {
    return this.isPagingActive ? this.paging.pageCount : 1;
  }

  /* A reported index - an event's panelIndex or row index - keeps its released meaning: the record's
     position in the whole view (the unpaged order of the filter and the sort, owner-hidden records
     included), in the whole source for a source that pages itself. Without a view it is the record
     index, which is the object's position when the question does not page. -1: not in the view. */
  protected getRecordViewIndex(recordIndex: number): number {
    const list = this.dataListValue;
    if (!list || !this.hasDataListView || recordIndex < 0) return recordIndex;
    const pos = list.indexToCreatedIndex(recordIndex);
    return pos < 0 ? -1 : pos + list.getRecordNumberOffset();
  }
  /* One entry of the plain data: a record as its object (a row, a panel) gives it, or as the matrix's
     record walk gives it without one. data: the entries of its questions; calcSource: what the
     calculations read - none for a record without an object. */
  protected createRecordPlainData(name: any, title: string, value: any, displayValue: any,
    data: Array<any>, calcSource: any, options: IPlainDataOptions): any {
    const res: any = {
      name: name, title: title, value: value, displayValue: displayValue,
      getString: (val: any): string => this.getValueAsString(val),
      isNode: true,
      data: data.filter((d: any) => !!d)
    };
    if (!!calcSource) {
      (options.calculations || []).forEach((calculation) => { res[calculation.propertyName] = calcSource[calculation.propertyName]; });
    }
    return res;
  }
  /* The object at a visible index of the whole view: the visible object at its position on the page,
     or the record read as a value when the page does not show it. getVisibleItemAt reads the type's
     cached visible objects - no copy per call - and answers null when the type has none built. */
  protected getItemByVisibleIndex(visibleIndex: number): QuestionRecordItem {
    if (visibleIndex < 0) return null;
    const item = this.getVisibleItemAt(this.getPositionAtVisibleIndex(visibleIndex));
    if (item === null) return null;
    return item || this.getRecordItemByVisibleIndex(visibleIndex);
  }
  protected abstract getVisibleItemAt(position: number): QuestionRecordItem;
  // The reported index of an object's record (getRecordViewIndex).
  protected getItemViewIndex(item: QuestionRecordItem): number {
    return this.getRecordViewIndex(this.getItemRecordIndex(item));
  }
  /* The record a number a caller passes - removePanel(n), addPanel(n), removeRow(n) - names under
     paging: a position among the visible records of the whole view, as currentIndex is, also on
     another page. -1 when there is none; isRecordNotLoaded tells whether a source that pages itself
     holds another window. */
  protected getRecordIndexAtVisibleIndex(visibleIndex: number): number {
    return this.dataList.getIndexAtGlobalVisibleIndex(visibleIndex);
  }
  protected isRecordNotLoaded(recordIndex: number): boolean {
    return recordIndex < 0 && this.isPagedBySource;
  }
  // The targets of the numbers a caller passes (RecordTargetResolver).
  protected getRecordTargetAtCreatedIndex(createdIndex: number): IRecordTarget {
    return this.recordTargets.getRecordTargetAtCreatedIndex(createdIndex);
  }
  /* The bound of the visible positions a number may name: unpagedCount without paging; under paging
     the visible records counted, or further where the window holds the records a source that pages
     itself keeps on a page (globalVisibleExtent). The counts stay the source's. */
  protected getVisibleNumberEnd(unpagedCount: number): number {
    return this.isPagingActive ? this.dataList.globalVisibleExtent : unpagedCount;
  }
  protected getRecordIndexForOperation(createdIndex: number, operation: DynamicDataSourceMethod): number {
    return this.recordTargets.getRecordIndexForOperation(createdIndex, operation);
  }
  protected getRecordTargetForOperation(createdIndex: number, operation: DynamicDataSourceMethod): IRecordTarget {
    return this.recordTargets.getRecordTargetForOperation(createdIndex, operation);
  }
  protected getInsertIndexForOperation(createdIndex: number): number {
    return this.recordTargets.getInsertIndexForOperation(createdIndex);
  }
  /* The record copyDefaultValueFromLastEntry copies in list mode, the last entry, read before the add;
     recordCount: the record count before the add. Without a source the last record, whatever the view
     shows. A source that does not page holds the whole storage: its last loaded record. A source that
     pages itself holds one window: its last record - the record beyond it is on the server. -1: none. */
  protected getLastEntryRecordIndex(recordCount: number): number {
    if (!this.isRemoteData) return recordCount - 1;
    const list = this.dataList;
    return list.isPagedBySource ? this.getLastMaterializedRecordIndex() : list.loadedCount - 1;
  }
  /* The record copyDefaultValueFromLastEntry copies (getLastEntryRecordIndex), read without creating the
     list. A record the storage pads (the matrix's) reads as null and is not copied. undefined: none. */
  protected getLastEntryRecord(recordCount: number): any {
    const index = this.getLastEntryRecordIndex(recordCount);
    return index > -1 ? this.getListRecordAt(index, null) : undefined;
  }
  // The record of the last object of the page: -1 when there is none.
  private getLastMaterializedRecordIndex(): number {
    const created = this.dataList.getMaterializedIndexes();
    return created.length > 0 ? created[created.length - 1] : -1;
  }
  protected getInsertTargetForOperation(createdIndex: number): { at: number, visibleIndex: number } {
    return this.recordTargets.getInsertTargetForOperation(createdIndex);
  }
  protected getMoveTargetsAtCreatedIndexes(fromIndex: number, toIndex: number): { from: IRecordTarget, to: IRecordTarget } {
    return this.recordTargets.getMoveTargetsAtCreatedIndexes(fromIndex, toIndex);
  }
  /* A write by value of a record that has no object - a record on another page. It is an edit: a
     source that cannot update refuses it first, and a record a source that pages itself has not loaded
     is refused; both are reported. merge changes a copy of the stored record; nothing is written when
     it changes nothing. Under in-memory paging the record is marked edited, as an inserted one is. */
  protected writeRecordWithoutItem(target: IRecordTarget, merge: (record: any) => void): void {
    if (this.refuseOperationOfSource("update")) return;
    if (target.isNotLoaded) {
      this.reportRecordNotLoaded("update");
      return;
    }
    this.writeRecordAt(target.recordIndex, merge);
  }
  /* One record written by the question: a copy of the stored record, changed by merge - the stored
     one is never mutated - and written as the question's own change when it differs. A change is
     marked for the page validation: by default the record (markRecordEdited), or as markEdited says
     (the matrix marks the field a row touched). A stored record that is not an object - a string, a
     number, an array - is replaced: the write starts from an empty record. Returns the record written,
     undefined when nothing changed. */
  protected writeRecordAt(index: number, merge: (record: any) => void, markEdited?: () => void): any {
    const list = this.dataList;
    const oldRecord = list.getRecord(index);
    const record = Helpers.isValueObject(oldRecord, true) ? Object.assign({}, oldRecord) : {};
    merge(record);
    if (!DynamicDataList.isValueChanged(record, oldRecord)) return undefined;
    if (!!markEdited) {
      markEdited();
    } else if (this.isPagedByList) {
      this.markRecordEdited(index);
    }
    return this.writeRecords((): boolean => list.setRecord(index, record)) ? record : undefined;
  }
  // The removal flow by number, with or without a confirmation (RecordTargetResolver).
  protected getRemoveTarget(resolve: () => IRecordTarget): IRecordTarget {
    return this.recordTargets.getRemoveTarget(resolve);
  }
  protected resolveRecordTarget(index: number, unpagedCount: number, getVisibleItem: (index: number) => QuestionRecordItem): IRecordTarget {
    return this.recordTargets.resolveRecordTarget(index, unpagedCount, getVisibleItem);
  }
  protected runRecordRemoval(target: IRecordTarget, isConfirmed: boolean, message: string, remove: (current: IRecordTarget) => void): void {
    this.recordTargets.runRecordRemoval(target, isConfirmed, message, remove);
  }
  /* The visible position a move from code goes to while the objects of its page do not exist yet,
     and the move it belongs to: a move made from inside another one - an event handler - supersedes
     it. A failed read, a replaced source and dispose drop it: the current-record follower of the type
     that shows one record (createCurrentRecordFollower) takes it. */
  private pendingVisibleIndex: number = undefined;
  private visibleMoveId: number = 0;
  /* Shows the page that holds visibleIndex (the list's getPageOfVisibleIndex; a move from code, as
     showPageOfVisibleIndex is). Returns true only when this move completed and the caller has to
     select now: the page could not change (clamped to the page in force), or it changed without a
     rebuild that took the position. Returns false in every other case, and the caller then selects
     nothing: the rebuild of the new page took the position and selected itself; a read of the page
     is pending and the rebuild of its commit takes the position (takePendingVisibleIndex); the read
     failed, synchronously too - the page in force stays and the selection with it; the source was
     replaced or the question disposed during the move; or a newer move started during this one. */
  protected showVisibleIndex(visibleIndex: number): boolean {
    const id = ++this.visibleMoveId;
    this.pendingVisibleIndex = visibleIndex;
    const list = this.dataList;
    this.paging.pageIndex = list.getPageOfVisibleIndex(visibleIndex);
    if (id !== this.visibleMoveId) return false;
    // Taken by the rebuild, dropped by a failed read, a replaced source or dispose.
    if (this.pendingVisibleIndex === undefined) return false;
    if (list.hasPendingRead) return false;
    this.pendingVisibleIndex = undefined;
    return true;
  }
  /* The position is kept for the rebuild the caller runs next, on the same page or on the page a
     move it makes itself shows (the dynamic panel's add, and its rebuild that follows the current
     record to another page). A move that is under way is superseded. */
  protected keepPendingVisibleIndex(visibleIndex: number): void {
    this.visibleMoveId++;
    this.pendingVisibleIndex = visibleIndex;
  }
  protected hasPendingVisibleIndex(): boolean {
    return this.pendingVisibleIndex !== undefined;
  }
  // The position a pending move went to, once; undefined when there is none.
  protected takePendingVisibleIndex(): number {
    const res = this.pendingVisibleIndex;
    this.pendingVisibleIndex = undefined;
    return res;
  }
  /* An operation a number asked for is refused: the record is on a page a source that pages itself
     has not loaded, and acting on any record the window does hold would act on the wrong one. It is
     reported the way a source error is (onDynamicDataError), under the operation it refused. */
  protected reportRecordNotLoaded(operation: DynamicDataSourceMethod): void {
    this.reportOperationRefused(operation, "The record is not in the loaded page of the data source");
  }
  /* An operation the question refused before it changed anything, reported under that operation. No
     write was made, so none was rejected: a completion that waits for the pending writes keeps waiting. */
  protected reportOperationRefused(operation: DynamicDataErrorOperation, reason: string): void {
    this.reportDataError(new Error(reason + "; the " + operation + " was not made."), operation);
  }
  // The assigned data source, read back from the list (assignedSource); nothing is created for it.
  protected getDataSource(): IDynamicDataSource {
    return !!this.dataListValue ? this.dataListValue.assignedSource : undefined;
  }
  /* While a source is assigned the list may read it synchronously and settle inside the swap: what
     waits for the settle (onDataSettled) runs once at the end, after the source's capabilities are
     applied. */
  private dataSourceAssignmentScope: Scope = new Scope();
  // The survey-data side of the swap. The question follows the call with its own refresh, also for
  // the same source.
  protected setDataSource(val: IDynamicDataSource): void {
    // A source assigned while another one is being assigned (an error handler of its first read) ends
    // inside the outer assignment: the outer one settles the data.
    this.dataSourceAssignmentScope.run((): void => this.setDataSourceCore(val));
    this.onDataSettled();
  }
  private setDataSourceCore(val: IDynamicDataSource): void {
    const newValue = val || undefined;
    /* Another storage: the records layer 2 tracks and the states kept for them name records of the
       old one, and so do the current record, the position a move is going to and the held remove
       targets. Their followers drop them before the swap, whose first read may commit inside it. */
    if (newValue !== (!!this._dataList ? this._dataList.assignedSource : undefined)) {
      this.followRecordIndexEvent({ kind: "source" });
    }
    const list = this.dataList;
    if (list.assignedSource === newValue) {
      // Assigned again: the question claims an in-memory source written by position (DynamicDataList.assignSource).
      list.assignSource(newValue);
      this.onSourceCapabilitiesChanged();
      return;
    }
    const wasRemote = list.isRemote;
    /* The list resets its window and starts the first read. The two flags the questions need are
       already on it: isViewFrozenOnEdit (the membership of a view may not be re-decided by an edit
       made through one of the objects it materialized) is set when the list is created and holds for
       a remote source unchanged, and isReadThrough stays on but covers the question's own storage
       only. An assigned source is read, not read through, whatever its class - a local source
       included: the question is not told
       when the developer's array changes, so that change is seen after refreshDataSource() and
       not at once. The list reads through again after a detach. Because of the frozen membership,
       refreshView() on a source that pages has to be a refresh(): the server decides which records
       are in the window, so re-deciding the view means re-reading it (see
       RecordsPagingController.refreshView). */
    list.assignSource(newValue, (): void => {
      if (!!newValue && !wasRemote)this.clearValueInSurveyData();
    });
    if (!newValue) {
      this.restoreValueFromSurveyData();
    } else if (!list.isWindowCommitted) {
      this.showUnreadWindow();
    }
    this.onSourceCapabilitiesChanged();
  }
  /* The capabilities of the source just assigned decide whether the objects are editable and whether
     the add and remove buttons are shown: each type refreshes what it shows from them. */
  protected onSourceCapabilitiesChanged(): void { }
  /* The first read of an attached source is pending, or failed at once: the question shows the
     source's window, which is empty until a read commits, and not the records it held before - they
     belong to no storage any more, and an edit made on them would be dropped. A read that commits
     inside assignSource (a synchronous source) has already done this. */
  private showUnreadWindow(): void {
    this.storeLoadedRecords();
    this.rebuildFromDataList(false);
  }
  /* Attaching a source: the answer the question already holds leaves the survey hash before the
     first read. It is one ordinary value change - attaching is a developer action, not a page load -
     and it is the only way to keep a stale local answer, which nobody can see any more, out of the
     submitted data. The answer stays when another question that has no data source stores the same
     value name: it is that question's answer, and a detach shows it here again. */
  private clearValueInSurveyData(): void {
    if (!this.data || this.isValueEmpty(this.data.getValue(this.getValueName()))) return;
    if (this.isValueStoredByAnotherQuestion()) return;
    this.data.setValue(this.getValueName(), undefined, false, true, this.name);
  }
  private isValueStoredByAnotherQuestion(): boolean {
    if (!this.survey) return false;
    return this.getQuestionsSharingValue(this.getValueName()).some((question: IQuestion): boolean =>
      question !== this && !(question instanceof QuestionRecordsModel && question.isRemoteData));
  }
  /* Detaching: the window is dropped and the question reads the survey hash again. With an answer
     there the count follows its records. With none the question shows the authored count again: the
     type's count property kept it while the source was assigned (recordCount). It is read before the
     restore, which can follow the empty answer down (the matrix sets rowCount to its length). */
  private restoreValueFromSurveyData(): void {
    const names = this.getRecordCountNames();
    const authoredCount = !!names ? this.getPropertyValue(names.count) : undefined;
    const value = !!this.data ? this.data.getValue(this.getValueName()) : undefined;
    this.updateValueFromSurvey(value);
    if (!!names && this.isValueEmpty(value)) {
      this.setRecordCountCore(authoredCount);
    }
  }
  // An error of the source: a write it rejected releases a completion that waits for the writes.
  private onSourceError(error: any, operation: DynamicDataErrorOperation): void {
    if (!!this._dataWaits) {
      this._dataWaits.onSourceError(operation);
    }
    this.reportDataError(error, operation);
  }
  /* A rejected read leaves the short window and its focused item in place: the kept position goes,
     and so does the position a move went to - the current object stays the one of the window in
     force. */
  private reportDataError(error: any, operation: DynamicDataErrorOperation): void {
    if (operation === "read") {
      this.followRecordIndexEvent({ kind: "readFailed" });
    }
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
     survey.setValue and mergeData do not reach the question. The survey hash may then hold a value
     the question does not show; that is the caller's doing. A setvalue or copyvalue trigger aimed at
     the question goes through the value setter instead, and setNewValue skips it. */
  public updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    if (this.isRemoteData) return;
    // Always an assignment from outside, also when it runs inside one of the question's own.
    const update = (): void => this.ownAssignmentKindScope.run(false, (): void => { super.updateValueFromSurvey(newValue, clearData); });
    // survey.clear() and survey.data = null clear the value, as clearValue() does.
    if (clearData && Helpers.isValueEmpty(newValue)) {
      this.clearingValueScope.run(update);
    } else {
      update();
    }
  }
  /* The list side of an assignment is the begin/end pair below: every assignment of the value passes
     through here. The subclasses do their own work in two hooks - inside the list-side pair
     (onRecordsValueStored) and after it (onRecordsValueAssigned) - and update isAnswered there, after
     that work: the value is stored with updateIsAnswered = false, whatever the caller passed. */
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    const oldRecords = copyRecords(this.getStoredRecords());
    const assignment = this.beginValueAssignment(newValue, oldRecords);
    super.setQuestionValue(newValue, false);
    this.onRecordsValueStored();
    this.endValueAssignment(assignment, oldRecords);
    if (!this.isAssigningOwnValue) {
      this.followRecordIndexEvent({ kind: "valueAssigned", oldRecords: asRecords(oldRecords), newRecords: asRecords(this.getStoredRecords()) });
    }
    this.onRecordsValueAssigned(oldRecords, this.clearingValueScope.isActive);
  }
  /* The list side of a value assignment. Every assignment of the question's value - by the survey,
     a trigger, a default value or one of its own objects - passes through its setQuestionValue, which
     calls beginValueAssignment before it stores the value and endValueAssignment after. The list
     reads the records through the value, so it sees them at once, but the views it cached over them
     it cannot: they are dropped. Three kinds of assignment:
     - The question's own (isAssigningOwnValue: the list's writes, the values its new objects write
       back): the view keeps its membership. Records that appeared join it and records that are gone
       leave it; no other record is decided again.
     - One from outside while one of the question's own writes is open (isOwnWriteOpen): owed. It is
       followed once that write has ended (followOwedAssignment), which decides the view again then.
     - Any other one from outside decides the view again at once: the created indexes are taken
       before it and compared after it, and the objects are rebuilt when it changed which records
       have one.
     Begin also reads whether an assignment from outside is a sibling's in-place write
     (isInPlaceWriteOfSibling), and the answer travels with it - also when it is owed - to
     decideViewAgain.
     Begin answers nothing for the first two and allocates nothing. The list is not created for any
     of this.
     The state is handed back in by setQuestionValue, never kept in a field: an assignment made from
     inside another one - a valueChangedCallback that writes through the list - runs both halves of
     its own in between. */
  private beginValueAssignment(newValue: any, oldRecords: any): IDynamicDataValueAssignment {
    if (this.isAssigningOwnValue) return undefined;
    if (this.isOwnWriteOpen) {
      this.oweOutsideAssignment(newValue, oldRecords, this.isInPlaceWriteOfSibling(newValue, oldRecords));
      return undefined;
    }
    const list = this._dataList;
    if (!list) return undefined;
    return { created: list.hasView ? list.getCreatedIndexes() : undefined, isUpdatedInPlace: this.isInPlaceWriteOfSibling(newValue, oldRecords) };
  }
  /* oldRecords: the question's copy of the value it replaced. The new records are read here and not
     passed in: the rebuild of a changed membership can write the value. */
  private endValueAssignment(assignment: IDynamicDataValueAssignment, oldRecords: any): void {
    const list = this._dataList;
    if (!list) return;
    if (!assignment) {
      // A write of the list maintains the membership itself, record by record.
      if (list.isWriting) {
        this.syncPagingState();
      } else {
        this.followRecordCountChange();
      }
      return;
    }
    this.decideViewAgain(assignment.created, oldRecords, this.isTouchedSetDropped(), true, assignment.isUpdatedInPlace);
  }
  /* The view is decided again over the records as they are now, and the objects follow: created and
     oldRecords are what the view and the value were before the assignment (see
     IDynamicDataValueAssignment). The records the respondent touched keep their places: the list
     gets the remap of the assignment, built once and only when there are touched records, and the
     edited set follows the same remap. areRecordsReplaced: false for a change that replaced no record
     (the row titles of the fixed matrix) - the edited set stays and a pending page move is kept.
     isUpdatedInPlace: a sibling's write that updated records in place (isInPlaceWriteOfSibling). It
     replaced no record either, and every record stays where it was: the remap is the identity, so the
     objects keep their records, the page is not stale, and the objects take the new values from the
     records as they do after a write of their own sibling. Guessed from the content instead, a write
     that changed many records of the page could not be placed and the page was rebuilt - and the new
     objects computed and wrote again, which reached the next sibling. Still checked against the record
     count: an owed assignment is followed after the question's own write, which may have changed it. */
  protected decideViewAgain(created: Array<number>, oldRecords: any, isTouchedSetDropped: boolean, areRecordsReplaced: boolean = true,
    isUpdatedInPlace: boolean = false): void {
    const hiddenAnswers = this.hiddenAnswers.takeHiddenAnswerFlags(oldRecords);
    this.decideViewAgainCore(created, oldRecords, isTouchedSetDropped, areRecordsReplaced, isUpdatedInPlace);
    if (!!hiddenAnswers) {
      this.hiddenAnswers.clearAnswersHiddenInNewObjects(hiddenAnswers);
    }
  }
  private decideViewAgainCore(created: Array<number>, oldRecords: any, isTouchedSetDropped: boolean, areRecordsReplaced: boolean,
    isUpdatedInPlace: boolean): void {
    const isInPlace = isUpdatedInPlace && Array.isArray(oldRecords) && oldRecords.length === this.getStoredRecordCount();
    if (isInPlace) areRecordsReplaced = false;
    const list = this._dataList;
    let remap: (index: number) => number = undefined;
    if (!isTouchedSetDropped && list.hasTouchedRecords) {
      remap = isInPlace ? (index: number): number => index : this.createAssignmentRemap(oldRecords, this.getStoredRecords());
    }
    list.invalidateViews(remap, !!created ? created : undefined);
    this.syncPagingState();
    /* An assignment that replaced records - not a sibling's in-place write, which moved none: the
       held remove targets go, and under paging in memory the edited set, the nested states and the
       records the objects were built for follow the records they name across the insert, remove or
       move the assignment made (RecordsPageValidation.onRecordsReplaced), and a move that waits for
       its validators is dropped. It runs before any rebuild: a rebuild keeps the nested states of the
       objects it replaces under the records they were built for, and the new objects read them under
       their own. */
    if (areRecordsReplaced) {
      this.followRecordIndexEvent({ kind: "assignment", oldRecords: asRecords(oldRecords), newRecords: asRecords(this.getStoredRecords()),
        getRemap: (): RecordRemap => remap || (remap = this.createAssignmentRemap(oldRecords, this.getStoredRecords())) });
    }
    const isMembershipChanged = created === null
      ? list.hasView && this.isPageStale()
      : !!created && !Helpers.isTwoValueEquals(created, list.getCreatedIndexes());
    if (isMembershipChanged) {
      this.followRecordsWithObjects((recordIndex: number): void => { this.appendItemForRecord(recordIndex, true); });
    }
    if (!this.isPagedByList) return;
    // The page is rebuilt when it names other records than its objects hold now - unless the type
    // takes in a record that landed at the end of the page without one (followRecordAppendedToPage).
    if (this.isPageStale() && !this.followRecordAppendedToPage()) {
      this.rebuildFromDataList(false);
    }
  }
  /* An assignment from outside under in-memory paging left the objects one record short of the page:
     the type appends an object for it and returns true, or returns false and the page is rebuilt. The
     default rebuilds. */
  protected followRecordAppendedToPage(): boolean {
    return false;
  }
  /* A reload - survey.data =, setData, mergeData, survey.clear(), each of which assigns under the
     survey's data pass - and clearValue() start over: the records the respondent touched are decided
     again like every other record. */
  private isTouchedSetDropped(): boolean {
    return this.clearingValueScope.isActive || !!this.survey && this.survey.isSettingData();
  }
  /* Where each record of an assignment from outside went: the new index of an old record, -1 for a
     removed one, undefined for one it cannot place. The own source answers for the answer's shape; the
     list adds its keyField. Not asked for a sibling's in-place write: its records did not move
     (decideViewAgain). */
  private createAssignmentRemap(oldRecords: any, newRecords: any): (index: number) => number {
    return this.recordsSource["createAnswerAssignmentRemap"](oldRecords, newRecords, this._dataList?.keyField);
  }
  // The values the objects' setValueExpression and resetValueIf compute are not edits (runComputedWrites).
  public runTriggers(name: string, value: any, keys?: any): void {
    super.runTriggers(name, value, keys);
    this.runComputedWrites((): void => { this.runTriggersInObjects(name, value, keys); });
  }
  protected abstract runTriggersInObjects(name: string, value: any, keys: any): void;
  /* A write of a record by one of its questions. A question the respondent answers (hasInput) touches
     the record - and so does code that assigns it, setValueExpression and a trigger included: the
     write does not say where it came from. A value an expression computes does not, or every record
     with an expression would be touched by its first recalculation. */
  protected markRecordTouchedBy(recordIndex: number, question: Question): void {
    if (!question || !question.hasInput) return;
    this.dataList.markRecordTouched(recordIndex);
  }
  // The question of an object - a cell, a detail or panel question - that writes a record field: a
  // field is a value name, or its comment key.
  protected getRecordFieldQuestion(item: QuestionRecordItem, field: string): Question {
    if (!item || !field) return undefined;
    const name = Helpers.getNameOfCommentKey(field) ?? field;
    return item.getQuestionsByValueName(name)[0] || undefined;
  }
  // The question's add: the records it inserts are touched as they enter the list. Nothing is created
  // for it: without a list there is no view to keep them in.
  protected runRecordAdd<T>(func: () => T): T {
    const list = this.dataListValue;
    return !!list ? list.runAddScope(func) : func();
  }
  /* Writes that only show the records a data source holds: the values the objects compute while they are
     built go with a record's next update (DynamicDataList.runShowingRecords). Nothing is created for it:
     without a list there is nothing to send. */
  protected runShowingRecords<T>(func: () => T): T {
    const list = this.dataListValue;
    return !!list ? list.runShowingRecords(func) : func();
  }
  /* The records were replaced by a change of what defines them - the rows of the fixed matrix - and
     the question knows where each one went: the remap gives the new index of an old record, -1 for
     one that is gone. The edited set, the states kept for nested paged questions and the record
     indexes the question keeps besides them follow ("redefined"), and the list decides its views again
     over the new records - a touched record follows the remap, a removed one leaves the touched set -
     and the page state follows. Nothing is created for it, and the remap is asked for once, only when
     something keeps record indexes. */
  protected followRemappedRecords(createRemap: () => ((index: number) => number)): void {
    const getRemap = createLazyRemap(createRemap);
    this.followRecordIndexEvent({ kind: "redefined", getRemap: getRemap });
    const list = this._dataList;
    if (!list) return;
    list.invalidateViews(list.hasTouchedRecords ? getRemap() : undefined);
    this.syncPagingState();
  }
  // The value is stored and the list-side pair is still open.
  protected onRecordsValueStored(): void { }
  /* The list-side pair is closed. oldRecords: a copy of the value the assignment replaced. isCleared: the
     value was cleared - clearValue(), resetValueIf, survey.clear() -, not assigned. */
  protected onRecordsValueAssigned(oldRecords: any, isCleared: boolean = false): void {
    this.updateItemsFromRecords(oldRecords);
  }
  /* The question is writing its records itself - a record on behalf of one of its objects, or what
     its objects hold: the assignment that write makes does not push the records back into the objects
     (updateItemsFromRecords). The scopes nest: one write can run inside another, from a callback. */
  private recordWritesScope: Scope = new Scope();
  protected get isWritingRecords(): boolean {
    return this.recordWritesScope.isActive;
  }
  protected writeRecords<T>(func: () => T): T {
    return this.runOwnRecordsChange((): T => {
      try {
        return this.recordWritesScope.run(func);
      } finally {
        if (!this.recordWritesScope.isActive)this.disposeItemsLeftByWrites();
      }
    });
  }
  /* A change the question makes to its own value or records - writeRecords, the dynamic panel's
     internal value change - suppresses part of the follow-up of an assignment: the count or the
     objects do not follow the value meanwhile. User code runs inside such a change (onValueChanged
     of the question's own write, onDynamicPanelRemoved), and an assignment it makes from outside -
     survey.setValue, a bound question, a trigger - is stored but would not be followed. A write of the
     list is such a write too, also one the question makes outside a change of its own (the matrix's
     add, remove and move): the list's views are its own until the write ends. The assignment is owed
     when it is stored, and it is followed once, when the last open change and the outermost write of
     the list have both ended - also when they end with an exception: the assignment is the last
     write and wins. The steps of the operation that come after the change see the count and the
     objects of the assigned value; one that would write its own record into it checks
     outsideAssignmentCount. */
  private ownRecordsChangeScope: Scope = new Scope();
  private owedAssignment: IDynamicDataValueAssignment = undefined;
  private outsideAssignmentCountValue: number = 0;
  protected get outsideAssignmentCount(): number {
    return this.outsideAssignmentCountValue;
  }
  protected runOwnRecordsChange<T>(func: () => T): T {
    try {
      return this.ownRecordsChangeScope.run(func);
    } finally {
      if (!this.ownRecordsChangeScope.isActive && !!this.owedAssignment && !(!!this._dataList && this._dataList.isWriteOpen)) {
        this.followOwedAssignment();
      }
    }
  }
  private get isOwnWriteOpen(): boolean {
    return this.ownRecordsChangeScope.isActive || !!this._dataList && this._dataList.isWriteOpen;
  }
  /* Owed before the value is stored: a handler that throws after storing it still leaves it owed. The
     view and the records before the first owed assignment are what the follow-up compares with.
     isUpdatedInPlace: the assignment is a sibling's in-place write (isInPlaceWriteOfSibling). The owed
     follow-up keeps the objects only while every assignment it stands for is one: an assignment from
     outside merged into it makes the follow-up place the records by their content. */
  private oweOutsideAssignment(newValue: any, oldRecords: any, isUpdatedInPlace: boolean): void {
    if (Helpers.isTwoValueEquals(this.getStoredRecords(), newValue)) return;
    const isTouchedSetDropped = this.isTouchedSetDropped();
    if (!!this.owedAssignment) {
      this.owedAssignment.isTouchedSetDropped = this.owedAssignment.isTouchedSetDropped || isTouchedSetDropped;
      this.owedAssignment.isUpdatedInPlace = this.owedAssignment.isUpdatedInPlace && isUpdatedInPlace;
      return;
    }
    const list = this._dataList;
    const canReadView = !!list && !list.isWriting;
    this.owedAssignment = { created: !canReadView ? null : list.hasView ? list.getCreatedIndexes() : undefined, oldRecords: oldRecords,
      isTouchedSetDropped: isTouchedSetDropped, isUpdatedInPlace: isUpdatedInPlace };
  }
  // The outermost write of the list has ended (IDynamicDataOwner.onWriteEnded).
  private onListWriteEnded(): void {
    if (!this.ownRecordsChangeScope.isActive && !!this.owedAssignment)this.followOwedAssignment();
    this.runHeldItemsCondition();
  }
  /* An insert, a removal or a move of the list stores the value before the objects follow it: an
     in-memory source stores it inside the push, and the list notifies the owner after the push. Under
     a view - paging, a sort, a filter - a row or a panel addresses its record by its position until
     then, so the conditions that storing runs would have the objects compute values and write them
     into the records those positions held before. The objects' part of such a run waits until the
     objects have followed the write: when the list's write ends (onListWriteEnded), or - for a removal,
     whose page is refilled after the write, and a count change, whose objects follow it afterwards -
     when that operation ends (runObjectsFollowingWrite). Without a view a position is the record
     index, so nothing is held. */
  private structuralStoreScope: Scope = new Scope();
  private followingWriteScope: Scope = new Scope();
  private heldItemsCondition: { properties: HashTable<any> };
  private storeListRecords(records: Array<any>, operations: Array<DynamicDataSourceMethod>): void {
    const isStructural = this.hasDataListView && (operations || []).some((operation: DynamicDataSourceMethod): boolean => operation !== "update");
    const store = (): void => this.setListRecords(records, operations);
    if (isStructural) {
      this.structuralStoreScope.run(store);
    } else {
      store();
    }
  }
  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    if (this.structuralStoreScope.isActive) {
      this.heldItemsCondition = { properties: properties };
    } else {
      this.runItemsCondition(properties);
    }
  }
  protected runObjectsFollowingWrite(func: () => void): void {
    let isFollowed = false;
    try {
      this.followingWriteScope.run((): void => {
        func();
        isFollowed = true;
      });
    } finally {
      // A write that threw (a handler's error) left the objects where they were: a held run would
      // have them write into the records their positions held before, so it is dropped.
      if (!isFollowed && !this.followingWriteScope.isActive)this.heldItemsCondition = undefined;
      this.runHeldItemsCondition();
    }
  }
  /* An object's write during the held run can change how many records are stored - a padded record
     it fills in. The run that write makes skips the object that is still computing, so a record count
     that object read before is stale: the objects compute once more when the count changed. */
  private runHeldItemsCondition(): void {
    if (this.followingWriteScope.isActive) return;
    const held = this.heldItemsCondition;
    this.heldItemsCondition = undefined;
    if (!held || this.isDisposed) return;
    const count = this.getStoredRecordCount();
    this.runItemsCondition(held.properties);
    if (!this.isDisposed && this.getStoredRecordCount() !== count) {
      this.runItemsCondition(held.properties);
    }
  }
  private getStoredRecordCount(): number {
    const records = this.getStoredRecords();
    if (Array.isArray(records)) return records.length;
    return Helpers.isValueObject(records) ? Object.keys(records).length : 0;
  }
  private followOwedAssignment(): void {
    const owed = this.owedAssignment;
    this.owedAssignment = undefined;
    this.outsideAssignmentCountValue++;
    this.followOutsideAssignment((): void => {
      if (!!this._dataList) {
        this.decideViewAgain(owed.created, owed.oldRecords, owed.isTouchedSetDropped, true, owed.isUpdatedInPlace);
      }
    });
  }
  /* What an assignment does around the list-side pair, run again with every suppression gone: the
     count follows the stored value, the view is decided again (decideView), and every object is
     refreshed from its record - the records it showed before are unknown, so the changed-record
     shortcut cannot be used. */
  protected followOutsideAssignment(decideView: () => void): void {
    this.onRecordsValueStored();
    decideView();
    this.onRecordsValueAssigned(undefined);
  }
  /* An assignment from outside the objects - the survey, a trigger, a bound question - pushes the
     records into the objects that exist, and only into those whose record changed: a question bound
     to the same value receives the whole value on every write a sibling makes to one record field, so
     refreshing every object would make loading N records cost O(N^2). The objects are walked by
     position and each position is mapped to its record through the list: an object never looks up its
     own record here, which would be one more O(N) lookup per object.
     A record that is the same object as before may have been changed in place, and a value that is
     not a collection of records says nothing about them: those objects are refreshed. So is every
     object of a data source - its window is replaced by a read. Without a view the objects are built in
     record order, so the position is the record index - also for an object whose record the value
     does not hold (a panel count above the record count): it shows the record the value has there. */
  private updateItemsFromRecords(oldRecords: any): void {
    if (this.isWritingRecords) return;
    const newRecords = this.getStoredRecords();
    const isEveryChanged = !Helpers.isValueObject(oldRecords) || !Helpers.isValueObject(newRecords) || this.isRemoteData;
    const list = this.hasDataListView ? this.dataListValue : undefined;
    const source = this.recordsSource;
    /* When the rows decide which records exist, an object exists whether or not the answer holds its
       record, and an assignment refreshes it: a row added at runtime runs its expressions only when it
       is refreshed. Otherwise an object without a record is padding. */
    const isRefreshedWithoutRecord = this.isRecordMembershipFixed();
    this.forEachItem((item: QuestionRecordItem, position: number): void => {
      const recordIndex = !!list ? list.materializedIndexToIndex(position) : position;
      const newRecord = this.getAssignedRecord(newRecords, recordIndex);
      if (isEveryChanged || newRecord === undefined && isRefreshedWithoutRecord ||
        QuestionRecordsModel.isRecordChanged(source["readRecordInAnswer"](oldRecords, recordIndex), newRecord)) {
        item.updateFromRecord(newRecord);
      }
    });
  }
  private static isRecordChanged(oldRecord: any, newRecord: any): boolean {
    if (oldRecord === newRecord && oldRecord !== undefined) return true;
    return DynamicDataList.isValueChanged(newRecord, oldRecord);
  }
  /* The record an object shows after an assignment: the record the value holds there, read in the
     answer's shape by the own source. The dynamic matrix pads a row past the value with its default
     record; the record the object showed before is compared as the value held it. */
  protected getAssignedRecord(value: any, recordIndex: number): any {
    return this.recordsSource["readRecordInAnswer"](value, recordIndex);
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
    this.onAnyValueChangedInItems(name, questionName);
  }
  // The objects' half of onAnyValueChanged, without the question's own re-validation.
  protected onAnyValueChangedInItems(name: string, questionName: string): void {
    if (!this.areObjectsBuilt() && name === this.getValueName()) {
      this.isValueChangedBeforeBuild = true;
    }
    this.forEachItem((item: QuestionRecordItem): void => { item.onAnyValueChanged(name, questionName); });
  }
  /* The error walks visit the objects that exist and create none: a record without an object has
     shown no error. Every object is cleared and asked for running validators - a hidden one may
     still hold an error or wait for one - and the visible ones report their errors: a hidden object
     is never validated, so what it holds is stale. */
  public clearErrors(): void {
    super.clearErrors();
    this.clearItemErrors();
  }
  protected clearItemErrors(): void {
    this.forEachItem((item: QuestionRecordItem): void => { item.clearErrors(); });
  }
  public getAllErrors(): Array<SurveyError> {
    return super.getAllErrors().concat(this.getItemErrors());
  }
  protected getItemErrors(): Array<SurveyError> {
    let res: Array<SurveyError> = [];
    this.forEachItem((item: QuestionRecordItem): void => {
      if (this.isItemVisible(item)) {
        res = res.concat(item.getAllErrors());
      }
    });
    return res;
  }
  protected getIsRunningValidators(): boolean {
    return super.getIsRunningValidators() || this.someItem((item: QuestionRecordItem): boolean => item.isRunningValidators());
  }
  // Read once, by the first build of the objects.
  protected takeValueChangedBeforeBuild(): boolean {
    const res = this.isValueChangedBeforeBuild;
    this.isValueChangedBeforeBuild = false;
    return res;
  }
  /* The triggers a value assigned before the first build would have run in the objects, run once they
     exist: items are the objects (the panel's visible ones, all the rows of a matrix), getItemValue the
     record one of them shows, read from the value as it was before the triggers ran. */
  protected runTriggersOnFirstBuild(getItems: () => Array<QuestionRecordItem>, getItemValue: (item: QuestionRecordItem, value: any) => any, variablePrefix: string): void {
    if (!this.data || !this.takeValueChangedBeforeBuild()) return;
    const value = this.value;
    this.runTriggersOnItems(getItems(), (item: QuestionRecordItem): any => getItemValue(item, value), variablePrefix);
  }
  /* A remove on a page the source reads again (the refill of a source that pages itself) is answered
     by a rebuild of every item on the page, which disposes the one the question has just focused.
     The position is kept here while that read is pending and taken back when the read commits
     (commitLoadedRecords), to focus the item that is at that position then. A second remove
     overwrites the position; a page change and a rejected read drop it. */
  private focusIndexAfterRead: number;
  private keepFocusIndexForRead(index: number): void {
    const list = this._dataList;
    this.focusIndexAfterRead = !!list && list.isRemote && list.hasPendingRead && index > -1 ? index : undefined;
  }
  private followFocusIndex(event: RecordIndexEvent): void {
    if (event.kind === "pageChanged" || event.kind === "readFailed")this.focusIndexAfterRead = undefined;
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
    if (!!this._dataWaits) {
      this._dataWaits.release(false);
    }
    this.cancelPendingPageMove();
    this.followRecordIndexEvent({ kind: "dispose" });
    this.owedAssignment = undefined;
    super.dispose();
    this.disposeObjectsAwaitingRerender();
    this.disposeItemsLeftByWrites();
    this.disposeRecordObjects();
    if (!!this.recordsBarValue) {
      this.recordsBarValue.dispose();
      this.recordsBarValue = undefined;
    }
    if (!!this._dataList) {
      this._dataList.dispose();
    }
    if (!!this._dataWaits) {
      this._dataWaits.reportPendingWrites();
    }
  }
  // The objects that have to go before the list does.
  protected disposeRecordObjects(): void { }
  /* An object that leaves the question - a row or a panel replaced, removed or cut off, a dropped detail
     panel, a replaced rendered table or tab - can still be in use, and is disposed once it is not:
     - A question of it can still be writing. A rebuild can run inside a write one of the old objects'
       questions is making - the record it edits leaves the page - and that question still finishes its
       own setter after the rebuild returns. The object waits for the question's write to end.
     - It can still be on screen. A UI that renders asynchronously (Angular) checks its components once
       more before it drops them, and the check throws on a disposed object (a disposed dropdown has no
       dropdownListModel). While a UI renders the question, the object waits for the question's next
       rerender, or for the UI to stop rendering it (an isCancel notification).
     Without a UI and outside a write it is disposed at once. A disposed question disposes what waits:
     one disposed inside its own write disposes its objects at once. */
  protected disposeLeftObject(obj: { dispose(): void }, disposeFunc?: () => void): void {
    const func = disposeFunc || ((): void => obj.dispose());
    if (this.isWritingRecords && !this.isDisposed) {
      this.itemsToDisposeAfterWrite.push((): void => this.disposeAfterRerender(obj, func));
      return;
    }
    this.disposeItemsLeftByWrites();
    this.disposeAfterRerender(obj, func);
  }
  private itemsToDisposeAfterWrite: Array<() => void> = [];
  private disposeItemsLeftByWrites(): void {
    const left = this.itemsToDisposeAfterWrite;
    this.itemsToDisposeAfterWrite = [];
    left.forEach((dispose: () => void): void => dispose());
  }
  private disposeAfterRerender(obj: { dispose(): void }, func: () => void): void {
    const rerendered = this.isDisposed ? undefined : this.onElementRerendered;
    if (!rerendered) {
      func();
      return;
    }
    if (this.objectsAwaitingRerender.some(item => item.obj === obj)) return;
    if (this.objectsAwaitingRerender.length === 0) {
      rerendered.add(this.onRerenderedDisposeObjects);
    }
    this.objectsAwaitingRerender.push({ obj: obj, func: func });
  }
  private objectsAwaitingRerender: Array<{ obj: any, func: () => void }> = [];
  private onRerenderedDisposeObjects = (): void => {
    this.disposeObjectsAwaitingRerender();
  };
  private disposeObjectsAwaitingRerender(): void {
    this._onElementRerendered.remove(this.onRerenderedDisposeObjects);
    const items = this.objectsAwaitingRerender;
    this.objectsAwaitingRerender = [];
    items.forEach(item => item.func());
  }
  /* The sort and the filter the JSON authored reach the list once the load is over. An authored one
     created the paging helper when it was set, so a question without one has nothing pending and
     nothing is created for it. */
  protected flushAuthoredView(): void {
    if (!!this._paging) {
      this._paging.flushAuthoredView();
    }
  }
  /* The tail of setSurveyImpl, which the subclasses call last: isDesignMode is known only once the
     survey is attached, and the list may have been created before that - paging is off in the
     Creator, whatever the page size says. */
  protected syncPageSizeWithSurvey(): void {
    if (!!this.dataListValue) {
      this.paging.updatePageSize();
    }
  }

  /* What waits for the question's data operations (RecordsDataWaits): the validations that answer
     through a callback and the survey's completion. Created by the first wait or the first write;
     _dataWaits is the peek. */
  private _dataWaits: RecordsDataWaits;
  private get dataWaits(): RecordsDataWaits {
    if (!this._dataWaits) {
      const question = this;
      this._dataWaits = new RecordsDataWaits({
        question: question,
        get id(): string { return question.id; },
        get isDisposed(): boolean { return question.isDisposed; },
        get survey(): ISurvey { return question.survey; },
        isDataRunning: (): boolean => question.isDynamicDataRunning,
        isWriting: (): boolean => {
          const list = question._dataList;
          return !!list && list.isRemote && list.hasPendingWrites;
        },
        validate: (context: ValidationContext): void => { question.validateElement(context); }
      });
    }
    return this._dataWaits;
  }
  /* The question's own objects (validateRecordObjectsOfPage, the type's), then the question, then -
     when both passed - the records off the page (validateOffPage). A validation that answers through
     a callback waits while the data is read or written (RecordsDataWaits.wait). */
  protected validateElementCore(context: ValidationContext): boolean {
    const isObjectsValid = this.validateRecordObjectsOfPage(context);
    const res = super.validateElementCore(context) && isObjectsValid && this.validateOffPage(context);
    if (this.isDynamicDataRunning) {
      this.dataWaits.wait(context);
    }
    return res;
  }
  protected validateRecordObjectsOfPage(context: ValidationContext): boolean {
    return true;
  }
  /* IDynamicDataOwner.onDataSettled, and the end of setDataSource. The survey is told too: a
     completion it holds for this question's writes goes on. */
  private onDataSettled(): void {
    if (this.dataSourceAssignmentScope.isActive) return;
    this.dataWaits.onDataSettled();
  }
  protected setSurveyCore(value: ISurvey): void {
    super.setSurveyCore(value);
    if (!!this._dataWaits) {
      this._dataWaits.onSurveyChanged(value);
    }
  }
  // Objects that were never built were never shown: there is nothing the respondent could have left
  // invalid, and validating them would build them.
  protected validatePageObjects(context: ValidationContext): boolean {
    return !this.areObjectsBuilt() || this.validateBuiltPageObjects(context);
  }

  // The specialization hooks: what every records question answers.
  // The conditions of the objects, and of what the type derives from them (the matrix's columns and totals).
  protected abstract runItemsCondition(properties: HashTable<any>): void;
  // The record fields the list knows (see getFieldsOfQuestions).
  protected abstract getFields(): Array<IDynamicDataField>;
  // The objects are re-created for the records the view - under paging, the page - holds now.
  protected abstract rebuildFromDataList(isPageMove: boolean): void;
  // A page of a source that pages itself was asked for: its objects arrive when the read commits.
  protected abstract refreshRenderedPage(): void;
  // The objects exist: generated rows, panels built for the first time. Objects that do not exist
  // are never stale.
  protected abstract areObjectsBuilt(): boolean;
  /* What a write to the survey would have re-run after a write to a data source; guarded by
     runConditionsAfterRemoteWrite, which also returns without survey data. By default the question's
     conditions; the matrices re-run only their cells and totals. */
  protected runRemoteWriteConditions(): void {
    this.runCondition(this.getDataFilteredProperties());
  }
  // The question's own objects on the page, once they are built; the rest of the page validation is shared.
  protected abstract validateBuiltPageObjects(context: ValidationContext): boolean;
  /* One record of getRecordsDisplayValue, formatted in place: item is the object that holds it, and a
     record without one is formatted through the question's templates. */
  protected abstract getRecordDisplayValue(keysAsText: boolean, item: QuestionRecordItem, record: any, recordIndex: number): any;
  /* A record without an object, formatted by the question that would hold each field: the template's
     (getRecordTemplateQuestion), then a question that shares the value name and reads the record. */
  protected formatRecordWithoutObject(keysAsText: boolean, record: any, recordIndex: number): any {
    return this.formatRecordDisplayValue(keysAsText, record, (key: string): Question =>
      this.getRecordTemplateQuestion(key) || (recordIndex > -1 ? this.getSharedQuestionFromArray(key, recordIndex) : undefined));
  }
  /* The keys of one record that no question of the type stores - for verifyRecordsUnknownKeys and the
     clean-ups -, with or without the record's object: the walk is shared, the rule for a key
     (comments, totals, shared questions) is the type's (isRecordKeyUnknown). */
  protected getRecordUnknownKeys(recordIndex: number, record: any, item: QuestionRecordItem): Array<string> {
    if (!Helpers.isValueObject(record, true)) return [];
    return Object.keys(record).filter((key: string): boolean => this.isRecordKeyUnknown(key, recordIndex, item));
  }
  /* One rule for a key of a record, with or without its object: the type's own questions and its
     released suffix rule know a key (isRecordKeyOfType), and so do another records question on the same
     value name - asked for the name the type stores the key under (getRecordKeyValueName) -, a
     question on the same value name that keeps the key in the object of its item (hasValueItemKey, a
     checkbox choice comment) and a question on the same value name that reads the record
     (getSharedQuestionFromArray). */
  protected isRecordKeyUnknown(key: string, recordIndex: number, item: QuestionRecordItem): boolean {
    if (this.isRecordKeyOfType(key, item)) return false;
    if (this.isRecordKeyStoredByAnotherQuestion(this.getRecordKeyValueName(key))) return false;
    if (this.isRecordKeyOfSharedItem(key)) return false;
    return !this.getSharedQuestionFromArray(key, recordIndex);
  }
  private isRecordKeyOfSharedItem(key: string): boolean {
    if (!this.survey || !this.valueName) return false;
    return this.getQuestionsSharingValue(this.valueName).some((question: IQuestion): boolean =>
      question !== this && question instanceof Question && question.hasValueItemKey(key));
  }
  protected abstract isRecordKeyOfType(key: string, item: QuestionRecordItem): boolean;
  protected getRecordKeyValueName(key: string): string {
    return key;
  }
  /* One record of the question's own storage (see getListRecordAt), as the records source reads it,
     without composing the array: a padded record reads defaultRecord when it is given. */
  protected getStoredRecordAt(index: number, defaultRecord?: any): any {
    return this.recordsSource.readAt(index, defaultRecord);
  }
  // The removal hooks (removeResolvedRecord). The object's created position in its array: the rows, the panels.
  protected abstract getItemPosition(item: QuestionRecordItem): number;
  // The object leaves its array at removal.position, and the type does what it does right after its splice.
  protected abstract detachItem(removal: IRecordRemoval): void;
  // The storage write of a removal, in the type's wrapper; refill runs exactly once, where the type decides.
  protected abstract removeStoredRecord(removal: IRecordRemoval, refill: () => void): void;
  // The property the record visibility expression is stored under (rowsVisibleIf, templateVisibleIf).
  protected abstract getRecordVisibleIfPropertyName(): string;
  // The objects, by created position (getItemByRecordIndex looks them up by record).
  public abstract getItem(index: number): QuestionRecordItem;
  // An object the question shows: a hidden one reports no errors (see getAllErrors).
  protected abstract isItemVisible(item: QuestionRecordItem): boolean;
  // The record an item - a row, a panel - reads and writes.
  public abstract getItemData(item: ISurveyData): any;
  /* The index of the item record in the question storage. It is the only index two questions bound
     to one value share: they may create objects for a different set of records (a filtered list) or
     in a different order (a sorted one). A temporary object of the records clean-up answers its own
     index; an object at a created position the record there; an object at none
     getRecordIndexOfUnknownItem. */
  protected getItemRecordIndex(item: ISurveyData): number {
    const position = this.getItemPosition(<QuestionRecordItem>item);
    const cleanupIndex = this.recordCleanup.getRecordCleanupIndex(item, position < 0);
    if (cleanupIndex > -1) return cleanupIndex;
    return position < 0 ? this.getRecordIndexOfUnknownItem() : this.getRecordIndexAtCreatedPosition(position);
  }
  // The record of an object that holds no created position: none by default.
  protected getRecordIndexOfUnknownItem(): number {
    return -1;
  }
  // The value an item's {matrix} / {panel} variable reads.
  public abstract getFilteredData(): any;
  /* A write of an item's record: val is the field value for a panel and the whole proposed row for a
     matrix row (see QuestionRecordItem.prepareRecordWrite). A refused or ignored write never reaches it
     (writeItemValue). A temporary object of the records clean-up writes its copy; every other write is
     the type's (writeItemRecordValue). */
  public updateItemValue(item: ISurveyData, name: string, val: any, isDeletingValue: boolean): void {
    const recordItem = <QuestionRecordItem>item;
    const position = this.getItemPosition(recordItem);
    if (this.recordCleanup.writeRecordCleanupCopy(item, position < 0, name, this.getItemWriteFieldValue(name, val, isDeletingValue))) return;
    this.writeItemRecordValue(recordItem, position, name, val, isDeletingValue);
  }
  // The value val stores in the field name; the matrix takes it out of the proposed row.
  protected getItemWriteFieldValue(name: string, val: any, isDeleting: boolean): any {
    return isDeleting ? undefined : val;
  }
  // The write of an item at a created position (-1: one being built) into its record: the list write.
  protected writeItemRecordValue(item: QuestionRecordItem, position: number, name: string, val: any, isDeleting: boolean): void {
    this.writeItemRecord(item, position, name, val, isDeleting);
  }
  /* The list write of an item: the record it holds - for an object being built the one
     getRecordIndexOfUnknownItem names - takes the write as mergeItemWrite merges it, as one batch with
     what ensureItemRecord adds before it. The question of the written field touches the record; the
     values new objects write (isAddingNewItems) - their defaults - are not the respondent's and only
     show a record a source holds. Returns the record written and the field value it replaced;
     undefined when nothing changed. */
  protected writeItemRecord(item: QuestionRecordItem, position: number, name: string, val: any, isDeleting: boolean): { record: any, oldValue: any } {
    const recordIndex = position < 0 ? this.getRecordIndexOfUnknownItem() : this.getRecordIndexAtCreatedPosition(position);
    if (recordIndex < 0) return undefined;
    const question = position < 0 ? undefined : this.getRecordFieldQuestion(item, name);
    const isDefault = this.isAddingNewItems;
    let oldValue: any;
    const write = (): any => this.writeRecordAt(recordIndex, (record: any): void => {
      oldValue = record[name];
      this.mergeItemWrite(record, item, name, val, isDeleting);
    }, (): void => {
      if (!isDefault) {
        this.markRecordTouchedBy(recordIndex, question);
      }
    });
    let record: any;
    this.writeRecords((): void => {
      this.dataList.batch((): void => {
        this.ensureItemRecord(recordIndex);
        record = isDefault ? this.runShowingRecords(write) : write();
      });
    });
    return record !== undefined ? { record: record, oldValue: oldValue } : undefined;
  }
  /* The write of one field into a copy of the record. An empty value removes the key; the emptiness
     rule (a whitespace-only string is empty) is the question rule. */
  protected mergeItemWrite(record: any, item: QuestionRecordItem, name: string, val: any, isDeleting: boolean): void {
    if (isDeleting || this.isValueEmpty(val)) {
      delete record[name];
    } else {
      record[name] = val;
    }
  }
  // The objects being added write their default values.
  protected get isAddingNewItems(): boolean {
    return false;
  }
  // The record an item write goes to may not be stored yet: the type adds it here.
  protected ensureItemRecord(recordIndex: number): void { }
  /* The write of an item - a cell of a row, a question of a panel - into its record. A write the type
     ignores (isItemWriteIgnored) writes nothing and is not refused; a refused edit (refuseItemWrite)
     stops the item's write before its triggers and notification; every other write reaches
     updateItemValue, the released member, which a subclass may override. Returns false for a refusal. */
  protected writeItemValue(item: QuestionRecordItem, name: string, val: any, isDeleting: boolean): boolean {
    if (this.isItemWriteIgnored(item)) return true;
    if (this.refuseItemWrite(item)) return false;
    this.updateItemValue(item, name, val, isDeleting);
    return true;
  }
  protected isItemWriteIgnored(item: QuestionRecordItem): boolean {
    return false;
  }
  protected refuseItemWrite(item: QuestionRecordItem): boolean {
    return this.refuseRecordEdit(item, (): number => this.getItemRecordIndex(item));
  }
  /* The item's position among the visible records of the whole list ({visiblePanelIndex}, the
     row's visibleIndex), and the item at such a position - an object when the record has one, a
     record read as a value when it has not (the question pages). */
  protected abstract getItemVisibleIndex(item: ISurveyData): number;
  /* The item {matrix[index].x} / {panel[index].x} reads. The objects are built first, so that a record
     that has an object is answered by it. Without a view index is a position among the objects; with
     one it is a record index, and a record without a row or a panel - filtered out, off the page or not
     built - is read as a value (getViewExpressionItem). A reader without an object of its own - a
     record read as a value, asking the questions bound to the same value - builds nothing under a view
     (existingObjectsOnly): a page is built for its rendering, not for a lookup. */
  protected getExpressionItem(index: number, existingObjectsOnly?: boolean): QuestionRecordItem {
    if (existingObjectsOnly && this.hasDataListView) return this.getViewExpressionItem(index);
    const item = this.getBuiltItemForExpression(index);
    return this.hasDataListView ? this.getViewExpressionItem(index) : item;
  }
  // The objects built (reading them builds them), and the one at a position: null past them.
  protected abstract getBuiltItemForExpression(position: number): QuestionRecordItem;
  // A record without an object, read as a value: the variable name ({row}, {panel}) and the context
  // the record is read through are the question's.
  protected abstract getRecordItemVariableName(): string;
  protected abstract createRecordItemContext(item: QuestionRecordItem): IValueGetterContext;

  // The specialization hooks with a default.
  /* The item at a position is focused once the objects of a committed read exist. Only a committed read
     of an assigned source reaches it; the default: nothing to focus (the fixed matrix has no source). */
  protected focusItemAfterRead(index: number): void { }
  /* "Add" moves the focus into the new record: to the first question of its nested elements, in walk
     order, a respondent can answer - shown, visible, in a visible container, with an input and not
     read-only (Question.focus refuses a read-only one). position: as forEachNestedWalkItem gives it. */
  protected focusNewRecord(item: NestedWalkItem, position: number, visible: boolean): void {
    if (!item) return;
    let res: Question = null;
    this.forEachNestedElementOfItem(item, position, visible, "none", (info: INestedElementInfo): void => {
      if (!!res || !this.isNestedElementShown(item, info)) return;
      res = getNestedElementQuestions(info).filter(q => q.isVisible && q.isParentVisible && q.hasInput && !q.isReadOnly)[0] || null;
    });
    if (!!res) {
      res.focus();
    }
  }
  // Does the question render a nested element of an item? The default: whenever it shows the item.
  protected isNestedElementShown(item: NestedWalkItem, info: INestedElementInfo): boolean {
    return info.visible;
  }
  /* The question defines which records exist and in what order (the rows of the fixed matrix) when its
     own source has no insert: the list it creates refuses to insert, remove or move one. */
  private isRecordMembershipFixed(): boolean {
    return hasFixedMembership(this.recordsSource);
  }
  /* The local source over the question's own storage, which the list uses while no source is assigned.
     It owns how the storage reads - the padding included, see getRecordsSourceOptions -; the question
     owns how a write is stored (setListRecords). By default an array source over question.value; a type
     whose storage rules are a source class of their own returns its instance. */
  protected createRecordsSource(): LocalDynamicDataSource {
    return this.createArrayRecordsSource();
  }
  // An array source over question.value: every record can be inserted, removed and moved.
  protected createArrayRecordsSource(): ArrayDynamicDataSource {
    return new ArrayDynamicDataSource((): Array<any> => this.value,
      (records: Array<any>, operations?: Array<DynamicDataSourceMethod>): void => { this.storeListRecords(records, operations); },
      this.getRecordsSourceOptions());
  }
  // What the array records source adds to the array: a type's padding.
  protected getRecordsSourceOptions(): IArrayDynamicDataSourceOptions {
    return {};
  }
  /* The question's own records source: the one the list uses while no source is assigned, created on
     first use - before the list too, for a read without it. The list's factory replaces it, so after a
     detach the question reads the instance the list reads. No initializer: the base constructors reach
     the records code before the fields of this class are initialized. */
  private recordsSourceValue: LocalDynamicDataSource;
  protected get recordsSource(): LocalDynamicDataSource {
    if (!this.recordsSourceValue) {
      this.recordsSourceValue = this.createRecordsSource();
    }
    return this.recordsSourceValue;
  }
  /* The write of the default records source, as a type stores it. operations: the writes the source
     made (DynamicDataSourceMethod names), in order. */
  protected setListRecords(records: Array<any>, operations: Array<DynamicDataSourceMethod>): void {
    this.setOwnRecordsValue(records);
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
  // The count of the question's own records, as the records source reads it, without composing the array.
  protected getListRecordCount(): number {
    return this.recordsSource.count;
  }
  /* The record counts a read needs, peeked - a read never creates the list. A remote source is counted
     through the list; the question's own source through recordsSource, which has one count for both.
     loadedRecordCount: the records that can be looked at (a source that pages itself holds one window);
     storedRecordCount: the count of the records, the total of such a source. */
  protected get loadedRecordCount(): number {
    return this.isRemoteData ? this.dataListValue.loadedCount : this.getListRecordCount();
  }
  protected get storedRecordCount(): number {
    return this.isRemoteData ? this.dataListValue.count : this.getListRecordCount();
  }
  /* Mirrors the paging state of the list into the question (see RecordsPagingController.syncState).
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
  /* The window of a source becomes the stored value, and the source's count the record count
     (recordCount): it is stored on every transition that stores the window (a committed read, the
     unread window of an attach, each write pushed to the source before it answers) and read from there
     (storedSourceRecordCount) - a live read of the list while a source is being attached counts the
     question's own value, which reads the count back. It can be above settings.matrix.maxRowCount: that
     clamp limits what a caller may ask for. With a source that answers without a total it is the count
     of the records known to exist, a lower bound (isCountKnown says which of the two it is).
     After a write pushed to the source it runs without a rebuild: the object the respondent is typing
     in already holds the new value, and a rebuild would dispose it under the edit (the
     frozen-membership rule). */
  protected storeLoadedRecords(): void {
    this.storeQuestionValue(this.dataList.getLoadedRecords());
    this.storedSourceRecordCount = this.dataList.count;
  }
  /* In the property hash, so that a renderer showing the count follows a read that changes only the
     total. Only onPropertyChanged hears of the count property: a binding or a rendered table reset
     would treat it as an authored rowCount / panelCount change, and the source owns the count. */
  protected get storedSourceRecordCount(): number {
    return this.getPropertyValue("storedSourceRecordCount", 0);
  }
  protected set storedSourceRecordCount(val: number) {
    const oldValue = this.storedSourceRecordCount;
    this.setPropertyValue("storedSourceRecordCount", val);
    const names = this.getRecordCountNames();
    if (oldValue === val || !names || !this.isRemoteData) return;
    this.onPropertyChanged.fire(this, { name: names.count, oldValue: oldValue, newValue: val });
  }
  /* Record indexes the question keeps besides the edited set and the current record: the records its
     objects were built for, while a question nested in one of them pages - its state is kept under that
     record (keepNestedPageStates). A read that commits again renumbers them with its remap, so that the
     states follow their records. */
  protected hasKeptRecordIndexes(): boolean {
    return this.someItem((item: QuestionRecordItem): boolean => {
      const questions = this.getNestedStateQuestions(item);
      return !!questions && this.hasPagedQuestions(questions);
    });
  }
  protected remapKeptRecordIndexes(remap: (index: number) => number): void {
    this.remapBuiltItems(remap);
  }
  // The questions of an object whose page states are kept under its record: undefined for none.
  protected getNestedStateQuestions(item: QuestionRecordItem): Array<Question> {
    return undefined;
  }
  /* One object for the record at the end of the objects (followInsertedRecord): the objects before
     it keep their state. The default rebuilds them, which is correct for a question without an
     incremental path. isStoredRecord: the record came with the value (an assignment), not with an add. */
  protected appendItemForRecord(recordIndex: number, isStoredRecord: boolean = false): void {
    this.rebuildFromDataList(false);
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
      const item = (<QuestionRecordsModel>this.question)["getExpressionItem"](index, params.existingObjectsOnly);
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
  // A record read as a value has no object: the bound questions are not built for it.
  protected readsExistingObjectsOnly(): boolean {
    return this.item instanceof RecordValueItem;
  }
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
    return !!data ? data["getItemByVisibleIndex"](index) : null;
  }
  // The position among the visible records of the whole list, not among the objects of the page.
  protected get visibleIndex(): number {
    const data = this.item.data;
    return !!data ? data["getItemVisibleIndex"](this.item) : -1;
  }
  /* The RECORD index, so that a stored {panelIndex} / {rowIndex} expression keeps meaning the same
     record when a filter or a sort changes which objects exist - and in the whole list, so that
     "Participant 23" is record 23 on every page of a data source that pages itself. item.getIndex()
     is the window-local index the storage is addressed by; the offset turns it into the number the
     respondent sees. 0-based: the callers add 1 where the variable is 1-based. */
  protected getRecordNumber(): number {
    return getRecordNumberOf(this.item);
  }
  protected abstract getItemVariableNames(): Array<string>;
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
  protected abstract getRelatedItemNames(): Array<string>;
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

  private settingValueScope: Scope = new Scope();
  protected get isSettingValue(): boolean {
    return this.settingValueScope.isActive;
  }
  private textPreProcessor: TextContextProcessor;
  constructor(public data: QuestionRecordsModel) {
    this.textPreProcessor = new TextContextProcessor(this);
  }
  // The record this object holds, and its position among the visible records of the whole view: the
  // question's lookups are protected (see QuestionRecordsModel).
  protected getOwnRecordIndex(): number {
    return this.data["getItemRecordIndex"](this);
  }
  protected getOwnVisibleIndex(): number {
    return this.data["getItemVisibleIndex"](this);
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
    const fieldName = isComment ? Helpers.getCommentKey(name) : name;
    if (!this.isValueChanged(fieldName, write.fieldValue)) return;
    if (!this.data["writeItemValue"](this, fieldName, write.ownerValue, write.isDeleting)) return;
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
    question.updateCommentFromSurvey(!!record ? record[Helpers.getCommentKey(name)] : undefined);
  }
  // The questions receive values the item does not write back; the flag nests.
  protected runSettingValue(func: () => void): void {
    this.settingValueScope.run(func);
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
    const commentOf = Helpers.getNameOfCommentKey(name);
    if (commentOf !== undefined) {
      name = commentOf;
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
    const index = this.getOwnRecordIndex();
    if (index < 0) return;
    const bindedQuestions = this.data.getBindedQuestions();
    bindedQuestions.forEach((q: IQuestion) => {
      if (q === this.data || !(q instanceof QuestionRecordsModel)) return;
      const item = q["getItemByRecordIndex"](index);
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
    return this.data.getSharedQuestionFromArray(columnName, this.getIndex());
  }
  // The object's position among the visible objects: the page it is on, when the question pages; -1: not shown.
  public get pageVisibleIndex(): number {
    return !!this.data ? this.data["getItemPageVisibleIndex"](this) : -1;
  }
  // The 0-based number the respondent sees for this object's record (getRecordNumberOf).
  protected getOwnRecordNumber(): number {
    return getRecordNumberOf(this);
  }
  // The rule of the owner for a key of this object's record (getRecordUnknownKeys).
  protected isOwnRecordKeyUnknown(key: string): boolean {
    return this.data["isRecordKeyUnknown"](key, this.getOwnRecordIndex(), this);
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
    const res = this.getAllValues()[Helpers.getCommentKey(name)];
    return !!res ? res : "";
  }
  public setComment(name: string, newValue: string, locNotification: boolean): void { }
  public get questions(): Array<Question> {
    return [];
  }
}
// A records value as an array of records: [] for any other value (an empty answer, a keyed one).
function asRecords(value: any): Array<any> {
  return Array.isArray(value) ? value : [];
}
/* A copy of a records value taken before it is replaced: an array value is updated in place
   (Base.setArrayPropertyDirectly). A value that is not an array is kept as it is - a keyed answer is
   never turned into one. */
function copyRecords(value: any): any {
  return Array.isArray(value) ? [].concat(value) : value;
}
/* getItem is typed to answer a record item, but the dynamic panel answers its panel's data: in design
   mode the template panel shown takes the survey's data once its survey impl is set again. */
function isRecordItem(item: QuestionRecordItem): boolean {
  return item instanceof QuestionRecordItem;
}
// The keys of a question's answer in a record: its value name and its comment key, the keys clearValue() removes.
function getRecordAnswerKeys(name: string): Array<string> {
  return [name, Helpers.getCommentKey(name)];
}
/* The choices of such a question come from a request: they are not known here, and a temporary
   object would send it. A file question would download its files. A question that holds records of
   its own is not cleaned up without an object either. The select and file questions are recognized
   by their serializer type: this module does not import those classes. */
function isRecordCleanupSkipped(template: Question): boolean {
  if (template instanceof QuestionRecordsModel || template.isDescendantOf("file")) return true;
  if (!template.isDescendantOf("selectbase")) return false;
  const byUrl = template.getPropertyValue("choicesByUrl");
  return !!byUrl && !!byUrl.url || template.getPropertyValue("choicesLazyLoadEnabled") === true;
}
/* The JSON of a panel the records clean-up builds, without the questions it does not judge (names),
   at any depth: they are not created, so they start no request. */
export function removeRecordCleanupSkipped(json: any, names: Array<string>): any {
  if (names.length === 0 || !json) return json;
  ["elements", "questions", "templateElements"].forEach((key: string): void => {
    if (!Array.isArray(json[key])) return;
    json[key] = json[key].filter((el: any): boolean => !el || names.indexOf(el.name) < 0);
    json[key].forEach((el: any): void => { if (!!el && el.type === "panel") removeRecordCleanupSkipped(el, names); });
  });
  return json;
}
/* The serializer entries of the paging, the sort and the filter of a records question.
   pageSize shows in the property grid.
   sortCriteria and filterExpression stay hidden there until the sortable headers ship, and only load
   from and save to JSON. sortCriteria is an array of sortcriterion objects (the shape of
   calculatedValues); an element that is a plain string is not a criterion and has no shorthand.
   filterExpression is a plain string rather than ":condition"/":expression", because both of those
   make JsonObjectProperty.isExpression true, and everything that discovers expressions by type -
   Base.validateExpressions(), the linter - would then read it with the survey as the variable
   context, while its variables are record fields.
   All three are stored in the hash under their own names (pagingStateKeys). The respondent's sort
   (allowSort, maxSortLevel, showSortMenu) follows them. */
export function getRecordViewProperties(): Array<any> {
  return [{ name: pagingStateKeys.pageSize + ":number", default: 0, minValue: 0 },
    { name: pagingStateKeys.sortCriteria + ":sortcriteria", className: "sortcriterion", isArray: true, visible: false },
    { name: pagingStateKeys.filterExpression, default: "", visible: false },
    /* The respondent's sort. A developer sets it in code or JSON; it is invisible in the property
       grid - on the Multi-Select Matrix for good, on the dynamic types until the sort UI ships. */
    { name: "allowSort:boolean", default: false, visible: false },
    { name: "maxSortLevel:number", default: 1, minValue: 1, visible: false },
    { name: "showSortMenu", default: "auto", choices: ["auto", true, false], visible: false }];
}
/* The count properties of a type with a record count, named after its entity: rowCount, minRowCount,
   maxRowCount and rowCountExpression for "Row". A type makes one (getRecordCountNamesOf), and its
   getRecordCountNames and its Serializer entries both read it. */
export interface IRecordCountNames { entity: string, count: string, minCount: string, maxCount: string, countExpression: string }
export function getRecordCountNamesOf(entity: string): IRecordCountNames {
  const name = entity.charAt(0).toLowerCase() + entity.substring(1);
  return { entity: entity, count: name + "Count", minCount: "min" + entity + "Count", maxCount: "max" + entity + "Count",
    countExpression: name + "CountExpression" };
}
// A temporary row or panel of the records clean-up (createRecordCleanupObject).
export interface IRecordCleanupObject {
  item: ISurveyData;
  runCondition(properties: HashTable<any>): void;
  clearIncorrectValues(): void;
  // A quiet validation: false when a question of the object has an error; nothing is shown.
  validate(): boolean;
  // The clean-up of invisible answers a built object runs when the survey clears them; optional.
  clearValueIfInvisible?(reason: string): void;
  dispose(): void;
}
// The visibility of template elements in one record after another (createRecordElementVisibility).
export interface IRecordElementVisibility {
  reset(index: number, record: any): void;
  isVisible(el: Question | PanelModelBase): boolean;
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
  public getSingleInputAddTextCore(): string {
    return this.recordsQuestion["getRecordAddText"]();
  }
  public singleInputAddItemCore(): void {
    this.recordsQuestion["addRecordFromUI"]();
  }
  protected abstract getRecords(): Array<TRecord>;
  // Not always a record: the lookup is also asked for the question itself and for its parents.
  protected abstract getRecordOfQuestion(question: Question): TRecord;
  protected abstract isRecordValid(record: TRecord): boolean;

  // Single-input mode is its own paging and walks every record: the list is told before they are read.
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    this.recordsQuestion["syncPageSizeWithMode"]();
    return super.getSingleInputQuestionsCore(question, checkDynamic);
  }
  // The steps of a question that adds and removes records: the questions of every record that is
  // empty or invalid, the questions of the current record when it is complete, and the summary.
  protected getDynamicSingleInputQuestions(question: Question, checkDynamic: boolean): Array<Question> {
    this.recordsQuestion["syncPageSizeWithMode"]();
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
    this.recordsQuestion["syncPageSizeWithMode"]();
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
