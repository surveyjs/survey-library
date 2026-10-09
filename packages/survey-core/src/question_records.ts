import { Base, ComputedUpdater } from "./base";
import { IPlainDataOptions, IProgressInfo, IQuestion, ISurvey, ISurveyData, ISurveyImpl, ITextProcessor } from "./base-interfaces";
import { property } from "./decorators";
import { HashTable, Helpers } from "./helpers";
import { IVerifyDataContext, Question, QuestionItemValueGetterContext, QuestionValueGetterContext, ValidationContext } from "./question";
import { ActionContainer } from "./actions/container";
import { settings } from "./settings";
import { isFocusInsideOrIdle } from "./utils/focus-utils";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "./dynamic-data/dynamic-data-sources";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, VariableGetterContext } from "./conditions/conditionProcessValue";
import { TextContextProcessor } from "./textPreProcessor";
import { SurveyError } from "./survey-error";
import {
  DynamicDataFieldType, DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataSort,
  IDynamicDataSource
} from "./dynamic-data/dynamic-data-interfaces";
import { IDynamicDataPageState, findDuplicatePages, getDuplicateKey, getReplacedRecordsRemap } from "./dynamic-data/dynamic-data-page-validation";
import { DynamicDataPageValidation, IDynamicDataPageValidationOwner } from "./question_records_page_validation";
import { createIndexes } from "./dynamic-data/dynamic-data-filter";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "./dynamic-data/dynamic-data-paging";
import { applyRecordChange } from "./dynamic-data/dynamic-data-record-remap";
import { IDynamicDataRecordCondition, IDynamicDataRecordScope } from "./dynamic-data/dynamic-data-record-visibility";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "./questionSingleInputSummary";
import { Action } from "./actions/action";
import { LocalizableString } from "./localizablestring";
import { ConsoleWarnings } from "./console-warnings";
import { ConditionRunner } from "./conditions/conditionRunner";
import { confirmActionAsync } from "./utils/confirm-dialog";
import { Serializer } from "./jsonobject";
import type { PanelModelBase } from "./panel";
import type { ISurveyDynamicDataWrites } from "./interfaces/survey-callbacks";

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
}
// A write of one record field through an item, as the item prepared it (QuestionRecordItem.prepareRecordWrite).
export interface IRecordItemWrite {
  // The field as it is going to be stored: the write stops when it equals the stored one.
  fieldValue: any;
  // What the owner's updateItemValue receives.
  ownerValue: any;
  isDeleting: boolean;
}
/* What a number, a panel or a row names: the record, its position in the whole view, its object when
   it has one, and the record object a target without one is found again by. A target a created
   position names (getRecordTargetAtCreatedIndex) has no visibleIndex: nothing it is used for asks. */
export interface IRecordTarget {
  recordIndex: number;
  visibleIndex?: number;
  item?: QuestionRecordItem;
  record?: any;
  isNotLoaded?: boolean;
}
/* A removal resolved before anything changes (resolveRecordRemoval): the object and its created
   position (-1 without one), the record that leaves the storage and the view index the removal
   reports. A type adds what its own steps decided before the splice. */
export interface IRecordRemoval {
  item: QuestionRecordItem;
  position: number;
  recordIndex: number;
  viewIndex: number;
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
/* What the objects of a records question - its rows or panels -, their contexts and the single-input
   behavior ask the question for. The members stay protected on the question: it registers one object
   of closures over them (registerRecordItemOwner), the code of this module reads it through
   getRecordItemOwner, and the rows and the panel items of the other modules ask the protected
   helpers of QuestionRecordItem. Not exported. */
interface IRecordItemOwner {
  getItemRecordIndex(item: ISurveyData): number;
  getItemVisibleIndex(item: ISurveyData): number;
  getItemByVisibleIndex(visibleIndex: number): QuestionRecordItem;
  getItemByRecordIndex(recordIndex: number): QuestionRecordItem;
  getExpressionItem(index: number): QuestionRecordItem;
  syncPageSizeWithMode(): void;
  writeItemValue(item: QuestionRecordItem, name: string, val: any, isDeleting: boolean): boolean;
  getRecordAddText(): string;
  addRecordFromUI(): void;
  isRecordKeyUnknown(key: string, recordIndex: number, item: QuestionRecordItem): boolean;
  getItemPageVisibleIndex(item: QuestionRecordItem): number;
}
const recordItemOwners: WeakMap<QuestionRecordsModel, IRecordItemOwner> = new WeakMap<QuestionRecordsModel, IRecordItemOwner>();
function getRecordItemOwner(question: QuestionRecordsModel): IRecordItemOwner {
  return recordItemOwners.get(question);
}
/* The 0-based number the respondent sees for the record of an object or a record item: its index in
   the whole list - the window offset of a source that pages itself added to the window-local
   getIndex(), which the storage is addressed by. */
function getRecordNumberOf(item: QuestionRecordItem): number {
  return item.getIndex() + (!!item.data ? item.data.getRecordNumberOffset() : 0);
}
/* The survey side that waits for the writes of a records question (ISurveyDynamicDataWrites). It is
   not part of ISurvey, so a survey is asked for it by its member: a custom ISurvey without it is
   never asked to wait. */
function getSurveyDynamicDataWrites(survey: ISurvey): ISurveyDynamicDataWrites {
  const writes = <ISurveyDynamicDataWrites><any>survey;
  return !!writes && typeof writes.dynamicDataWritesChanged === "function" ? writes : undefined;
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
   it does change is who owns them - see canSetValueToSurvey. */
export abstract class QuestionRecordsModel extends Question {
  private _dataList: DynamicDataList;
  private _paging: DynamicDataPagingController;
  private _pageValidation: DynamicDataPageValidation;
  private helperOwnerValue: RecordsHelperOwner;
  // Registered when the question is created: the objects and the contexts read it through getRecordItemOwner.
  private recordItemOwner: IRecordItemOwner = this.registerRecordItemOwner();
  private builtRecordIndexes: WeakMap<QuestionRecordItem, number>;
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
      onWriteEnded: (): void => { question.onListWriteEnded(); },
      onDataSettled: (): void => { question.onDataSettled(); },
      onWritesStarted: (): void => { question.onWritesStarted(); },
      onSourceWriterChanged: (): void => { question.onSourceCapabilitiesChanged(); },
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
      get isDesignMode(): boolean { return question.isDesignMode; },
      get isLoadingFromJson(): boolean { return question.isLoadingFromJson; },
      raiseSortByChanged: (oldValue: string, newValue: string): void => { question.raiseSortByChanged(oldValue, newValue); },
      leavePage: (isForward: boolean, move: () => void): boolean => question.leavePage(isForward, move),
      cancelPendingPageMove: (): void => { question.cancelPendingPageMove(); }
    };
  }
  private registerRecordItemOwner(): IRecordItemOwner {
    const question = this;
    const res: IRecordItemOwner = {
      getItemRecordIndex: (item: ISurveyData): number => question.getItemRecordIndex(item),
      getItemVisibleIndex: (item: ISurveyData): number => question.getItemVisibleIndex(item),
      getItemByVisibleIndex: (visibleIndex: number): QuestionRecordItem => question.getItemByVisibleIndex(visibleIndex),
      getItemByRecordIndex: (recordIndex: number): QuestionRecordItem => question.getItemByRecordIndex(recordIndex),
      getExpressionItem: (index: number): QuestionRecordItem => question.getExpressionItem(index),
      syncPageSizeWithMode: (): void => { question.syncPageSizeWithMode(); },
      writeItemValue: (item: QuestionRecordItem, name: string, val: any, isDeleting: boolean): boolean => question.writeItemValue(item, name, val, isDeleting),
      getRecordAddText: (): string => question.getRecordAddText(),
      addRecordFromUI: (): void => { question.addRecordFromUI(); },
      isRecordKeyUnknown: (key: string, recordIndex: number, item: QuestionRecordItem): boolean => question.isRecordKeyUnknown(key, recordIndex, item),
      getItemPageVisibleIndex: (item: QuestionRecordItem): number => question.getItemPageVisibleIndex(item)
    };
    recordItemOwners.set(this, res);
    return res;
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
    const list = this._dataList;
    if (!!list && list.isPagedBySource) {
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
    const list = this._dataList;
    if (!list || !list.isPagedBySource || recordIndex < 0) return recordIndex;
    const field = list.keyField;
    const key = !!field ? list.getValue(recordIndex, field) : undefined;
    return key !== undefined ? "k" + JSON.stringify(key) : "i" + (list.windowOffset + recordIndex);
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
        (records: Array<any>, operations?: Array<DynamicDataOperation>): void => { this.setListRecords(records, operations); },
        (): number => this.getListRecordCount(), this.isRecordMembershipFixed());
      this._dataList.onError = (error: any, operation: DynamicDataOperation): void => {
        this.onSourceError(error, operation);
      };
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
    const list = this._dataList;
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      if (!this.isItemVisible(item)) list.setRecordVisible(i, false);
    }
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
  /* A key another records question on the same value name can store is known, whether or not that
     question built its rows or panels: its columns, its template or its detail panel decide
     (getRecordTemplateQuestion), so nothing is built for the check. */
  protected isRecordKeyStoredByAnotherQuestion(key: string): boolean {
    if (!this.survey || !this.valueName) return false;
    return this.survey.getQuestionsByValueName(this.valueName).some((question: IQuestion): boolean =>
      question !== this && question instanceof QuestionRecordsModel && !!question.getRecordTemplateQuestion(key));
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
     which is stored under an ordinary key of the same record. A question with an "other" item and no
     comment stores the other text under the same comment key (storeOthersAsComment): a string field,
     declared after the others. */
  protected getFieldsOfQuestions(questions: Array<Question>): Array<IDynamicDataField> {
    const res = new Array<IDynamicDataField>();
    (questions || []).forEach((question: Question): void => {
      res.push({ name: question.getValueName(), dataType: getFieldType(question) });
      if (question.hasComment) {
        res.push({ name: question.getValueName() + settings.commentSuffix, dataType: "string" });
      }
    });
    (questions || []).forEach((question: Question): void => {
      if (question.hasComment || (<any>question).hasOther !== true) return;
      const name = question.getValueName() + settings.commentSuffix;
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
      this.forgetFocusIndex();
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
        // The current record follows its record, also on a move: it is a record, not a position.
        this.remapCurrentRecord(remap);
        this.remapHiddenAnswerStates(remap);
        this.remapHeldRemoveTargets(remap);
      });
    /* A write the list pushed to a data source: with the array source over question.value the push
       IS the value write, a remote source has no such setter, so the question follows the window
       itself. The objects are not rebuilt - the one that was edited, added or removed is handled by
       the path that made the change. */
    if (list.isRemote && change.type !== "reset") {
      this.storeLoadedRecords();
      this.prepareRemoteWrite(change);
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
  /* A source without paging holds the whole storage, so layer 2 tracks its edited records by
     index - and a read that commits again (refresh(), a filter the source answers again) may bring
     them back at other indexes: another writer moved, added or removed records. The edited set, the
     states of nested paged questions and what the question keeps besides them follow their records
     into the new window, by key when the source names its records and by content otherwise
     (getReplacedRecordsRemap), so that an edited record is still validated wherever it is now. The
     objects are renumbered only by a question that keeps state under their records (the panel's
     remapKeptRecordIndexes) while one of them holds a paged question. Replacing the source starts over (see setDataSource). The current record
     follows every committed read (followReloadedCurrentRecord). The remap is built once per commit,
     and only when something asks for it. */
  private followReloadedRecords(oldRecords: any): void {
    this.heldRemoveTargets = undefined;
    const list = this._dataList;
    const oldArray = Array.isArray(oldRecords) ? oldRecords : [];
    let remap: (index: number) => number = undefined;
    const getRemap = (): ((index: number) => number) => {
      if (!remap) {
        const newRecords = this.getStoredRecords();
        remap = getReplacedRecordsRemap(oldArray, Array.isArray(newRecords) ? newRecords : [], list.keyField);
      }
      return remap;
    };
    this.followReloadedCurrentRecord(getRemap);
    if (!this.isPagedByList) {
      /* A page of a paging source replaced the whole storage the list paged - a paging source is read
         whole only while the list has a filter or a sort it cannot run. The edited set named records by
         their index in that storage, which names nothing on a page, and a paging source never
         validates the records of other pages ahead of their page: they are on the server. Kept, the
         set would be remapped from the page into the next whole storage and name the wrong records. */
      if (!!this._pageValidation && list.isPagedBySource)this._pageValidation.clearEditedRecords();
      return;
    }
    this.followKeptRecordIndexes(getRemap, (validation: DynamicDataPageValidation, remap: (index: number) => number): void => {
      const newRecords = this.getStoredRecords();
      validation.cancelPendingMove();
      validation.onRecordsReplaced(oldArray, Array.isArray(newRecords) ? newRecords : [], remap);
    });
  }
  /* The record indexes kept besides the records follow one remap of them: the page validation's edited
     set and the states of nested paged questions (followValidation hands the remap to the validation as
     the change needs it), and what the question keeps (remapKeptRecordIndexes: the records the panels
     were built for). The remap is asked for only when something keeps record indexes. */
  private followKeptRecordIndexes(getRemap: () => ((index: number) => number),
    followValidation: (validation: DynamicDataPageValidation, remap: (index: number) => number) => void): void {
    const validation = this._pageValidation;
    const hasValidationRecords = !!validation && validation.hasRecords;
    if (!hasValidationRecords && !this.hasKeptRecordIndexes()) return;
    if (hasValidationRecords) {
      followValidation(validation, getRemap());
    }
    this.remapKeptRecordIndexes(getRemap());
  }
  /* A committed read renumbers the current record by the records it brought back. A window of a
     source that pages itself at another offset has no record in common with the old one when there
     is no key to find it by. The first read of a replaced source names nothing of the old one. */
  private followReloadedCurrentRecord(getRemap: () => ((index: number) => number)): void {
    const list = this._dataList;
    const isLost = this.isCurrentRecordOfOldSource ||
      list.isPagedBySource && !list.keyField && list.windowOffset !== this.currentRecordWindowOffset;
    this.isCurrentRecordOfOldSource = false;
    if (isLost) {
      this.currentRecordIndex = -1;
      this.announcedRecordIndex = -1;
    } else if (this.currentRecordIndex > -1 || this.announcedRecordIndex > -1) {
      this.remapCurrentRecord(getRemap());
    }
    this.currentRecordWindowOffset = list.windowOffset;
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
     isPagedByList.
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
     (clearIncorrectValuesWithoutObjects). */
  public clearIncorrectValues(): void {
    if (this.isRemoteData) return;
    this.clearIncorrectValueInData();
    this.clearIncorrectValuesInObjects();
    this.clearIncorrectValuesWithoutObjects();
  }
  protected abstract clearIncorrectValuesInObjects(): void;
  public clearValue(keepComment?: boolean, fromUI?: boolean): void {
    if (this.isRemoteData) {
      this.warnOutsideAssignment();
      return;
    }
    // The records the respondent touched go with the value (see isTouchedSetDropped).
    const prev = this.isClearingValue;
    this.isClearingValue = true;
    try {
      super.clearValue(keepComment, fromUI);
    } finally {
      this.isClearingValue = prev;
    }
  }
  private isClearingValue: boolean = false;
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
  private isOwnAssignmentInForce: boolean = false;
  protected get isAssigningOwnValue(): boolean {
    return this.isOwnAssignmentInForce;
  }
  // The one writer of isOwnAssignmentInForce: the kind is in force for func's extent, however it exits.
  private runAssignmentOfKind(isOwn: boolean, func: () => void): void {
    const prev = this.isOwnAssignmentInForce;
    this.isOwnAssignmentInForce = isOwn;
    try {
      func();
    } finally {
      this.isOwnAssignmentInForce = prev;
    }
  }
  protected setNewValue(newValue: any): void {
    const isOwn = this.isOwnValueAssignment;
    this.isOwnValueAssignment = false;
    if (!isOwn && this.isRemoteData) {
      this.warnOutsideAssignment();
      return;
    }
    this.runAssignmentOfKind(isOwn, (): void => { super.setNewValue(newValue); });
  }
  protected setOwnRecordsValue(newValue: any): void {
    this.isOwnValueAssignment = true;
    try {
      this.setNewValue(newValue);
    } finally {
      this.isOwnValueAssignment = false;
    }
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
  /* Paging is on: the objects are built for the page, and an incremental update of the rendered
     table would work in page-local terms. Off in design mode and without a list. */
  protected get isPagingActive(): boolean {
    return !this.isDesignMode && !!this._dataList && this._dataList.pageSize > 0;
  }
  /* The list cuts the page: over question.value, or over the whole storage a source without paging
     answered with - or a paging source, read whole while the list has a filter or a sort it cannot
     run. Every record is in memory, so the page is a slice and layer 2 can track the edited records.
     Its opposite is a paging source (list.isPagedBySource): the window IS the page and the records
     of the other pages are on the server. */
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
  /* The record indexes the objects were built for follow an insert, a remove or the records a read
     brought back. Every object is renumbered, also before the first build. An object whose record is
     gone - removed, or not found again by a reload - keeps -1: it is being disposed. */
  protected remapBuiltItems(remap: (index: number) => number): void {
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      if (!(item instanceof QuestionRecordItem)) continue;
      const from = this.getBuiltRecordIndex(item);
      if (from > -1) {
        const to = remap(from);
        this.setBuiltRecordIndex(item, to === undefined ? -1 : to);
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
    this.forEachStoredRecord(this.loadedRecordCount, (index: number, item: QuestionRecordItem): void => {
      const record = this.getRecordInValue(val, index);
      const keys = this.getRecordUnknownKeys(index, record, item);
      if (keys.length === 0) return;
      context.pushSegment(this.getRecordDataSegment(index));
      keys.forEach(key => context.addIssue("unknownProperty", key, record[key], this));
      context.popSegment();
    });
  }
  // The segment of a record in a location: its index, for a value that is an array.
  protected getRecordDataSegment(index: number): string | number {
    return index;
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
     and the record items read through it. A data source's window and a write in progress are the
     list's - inside list.batch() the writes sit in the source's batch array and the storage does not
     have them yet; otherwise the storage answers (getStoredRecordAt), and the list is not created.
     defaultRecord: what a record the storage pads reads as (the matrix). */
  protected getListRecordAt(index: number, defaultRecord?: any): any {
    const list = this.dataListValue;
    if (!!list && (list.isRemote || list.isWriting)) return list.getRecord(index);
    return this.getStoredRecordAt(index, defaultRecord);
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
  /* The page maximum (maxRecordsPerPage) is the number of objects one page may hold: without paging
     every object is on the one page, so it limits the total as well; with paging it limits the page
     size only (listPageSize). */
  protected get isRecordCountLimitedByPageMax(): boolean {
    return this.isDesignMode || !(this.listPageSize > 0);
  }
  /* The limit the record count is checked against: maxCount and the page maximum without paging; with
     paging explicitMaxCount alone - when the question sets it, since the default of maxCount is the
     setting. */
  private getRecordCountLimit(maxCount: number, explicitMaxCount: number): number {
    if (this.isRecordCountLimitedByPageMax) return Math.min(maxCount, this.maxRecordsPerPage);
    return explicitMaxCount > 0 ? explicitMaxCount : Number.MAX_SAFE_INTEGER;
  }
  /* The maximum record count a type stores under propertyName (maxRowCount, maxPanelCount): paging
     lifts the page maximum from it; at least 1. The limit the count is checked against follows from it. */
  protected getMaxRecordCount(propertyName: string): number {
    const val = this.getPropertyValue(propertyName);
    return this.pageSize > 0 ? val : Math.min(val, this.maxRecordsPerPage);
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
  // The count properties of a type; undefined: the type has no count of its own (the fixed matrix).
  protected getRecordCountNames(): { count: string, expression: string, min: string, max: string } {
    return undefined;
  }
  protected setRecordCountByExpression(val: any): void { }
  // The count getRecordCountNames names (rowCount, panelCount), read and set through its accessor.
  protected getRecordCountValue(): number {
    return 0;
  }
  protected setRecordCountValue(val: number): void { }
  /* A change of the minimum or the maximum count (getRecordCountNames): the other limit and the count
     follow, and the count expression runs again over the new limits. The type adds its own steps:
     onMinRecordCountApplied before the count follows a new minimum, onMaxRecordCountApplied last. */
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const names = this.getRecordCountNames();
    if (!names) return;
    if (name === names.min) {
      this.onMinRecordCountChanged(names);
    }
    if (name === names.max) {
      this.onMaxRecordCountChanged(names);
    }
  }
  private onMinRecordCountChanged(names: { count: string, expression: string, min: string, max: string }): void {
    const val = this.getPropertyValue(names.min);
    if (val > this.getMaxRecordCount(names.max))this.setMaxRecordCount(names.max, val);
    this.onMinRecordCountApplied(val);
    if (this.getRecordCountValue() < val)this.setRecordCountValue(val);
    this.rerunRecordCountExpression();
  }
  private onMaxRecordCountChanged(names: { count: string, expression: string, min: string, max: string }): void {
    const val = this.getMaxRecordCount(names.max);
    if (val < this.getPropertyValue(names.min))this.setPropertyValue(names.min, val);
    const limit = this.getRecordCountLimitOf(names.max);
    if (this.getRecordCountValue() > limit)this.setRecordCountValue(limit);
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
    return !!names && !!this.getPropertyValue(names.expression) && !this.isRemoteData;
  }
  protected rerunRecordCountExpression(): void {
    if (this.isLoadingFromJson || !this.canRunConditions()) return;
    this.runExpressionByProperty(this.getRecordCountNames().expression, this.getDataFilteredProperties(),
      (val: any): void => { this.setRecordCountByExpression(val); });
  }
  protected updateBindings(propertyName: string, value: any): void {
    if (this.hasRecordCountExpression && propertyName === this.getRecordCountNames().count) return;
    super.updateBindings(propertyName, value);
  }
  protected updateBindingProp(propName: string, value: any): void {
    if (this.hasRecordCountExpression && propName === this.getRecordCountNames().count) return;
    super.updateBindingProp(propName, value);
  }
  protected getRecordCountLimitOf(propertyName: string): number {
    return this.getRecordCountLimit(this.getMaxRecordCount(propertyName), this.getPropertyValueWithoutDefault(propertyName));
  }
  /* The page size the list gets: the authored one, capped by the number of objects one page may hold
     (maxRecordsPerPage). Single-input mode walks every object and lists them in its own summary - it
     is its own paging - so it builds every object and the list does not page. A carousel without
     panelsPerPage builds every panel, as it always has; with it, it pages like list and tab mode and
     shows one panel of the page. */
  protected get listPageSize(): number {
    if (this.isSingleInputActive) return 0;
    return Math.min(this.pageSize, this.maxRecordsPerPage);
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
    const list = this.dataListValue;
    if (!list || !this.isPagingActive && !list.isPagedBySource) return undefined;
    return list.globalVisibleCount;
  }
  /* A record follows the one at a visible index: the next index is below visibleCount (what the question
     navigates by), or the source said there are more and the total is unknown. */
  protected hasRecordAfterVisibleIndex(visibleIndex: number, visibleCount: number): boolean {
    if (visibleIndex < 0) return false;
    if (visibleIndex < visibleCount - 1) return true;
    const list = this.dataListValue;
    return !!list && list.hasRecordBeyondKnown;
  }
  /* When the list pages the progress is counted from the records - every visible record - as it is
     before the objects exist: the objects are one page. A source that pages itself counts its
     window: the other pages are on the server. updateByRecord adds one record's inputs. */
  /* The progress of a records question. When the list pages it is counted from the records - every
     input of every visible record (updateProgressInfoByRecord). Otherwise the built objects count, each
     question's own visibility is known there (getProgressInfoOfObjects); before they exist a view
     counts the records it shows, what the objects would be built for, and a question without a view
     answers getProgressInfoWithoutObjects. */
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
  /* The state a paged question keeps for its records outlives the object that holds it (see
     IDynamicDataPageState): before the objects are disposed - or an object drops its questions - the
     states of the paged questions of each object are kept under the record the object was built for,
     and the questions the record's next object holds take them back (restorePageStatesOfQuestions).
     getQuestions answers an object's questions: the panel's, a matrix row's detail panel's. undefined
     - a row whose detail panel was never created - hands nothing over and keeps what was kept for the
     record; questions without a paged one hand empty states, which drop it. */
  protected keepNestedPageStates(items: Array<QuestionRecordItem>): void {
    items.forEach((item: QuestionRecordItem): void => {
      const recordIndex = !!item ? this.getBuiltRecordIndex(item) : -1;
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
    const states = !!this._pageValidation ? this._pageValidation.getNestedStates(this.getNestedStateKey(recordIndex)) : undefined;
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
    const visibleIndex = this.dataList.getVisibleIndexes().indexOf(recordIndex);
    if (visibleIndex < 0) return false;
    return this.showPageOfVisibleIndex(visibleIndex, !!keepPosition ? (): void => keepPosition(visibleIndex) : undefined);
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
     part as its object does: the question decides that, and reads and compares the keys itself. */
  protected forEachUniquenessRecord(func: (index: number, item: QuestionRecordItem, position: number) => void): void {
    const list = this.dataList;
    const uniqueness = this.getRecordUniqueness();
    const indexes = uniqueness.includeFilteredOut ? this.getLoadedRecordIndexes() : list.getVisibleIndexes();
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
  /* The visibility of a template element - a question of a record, a panel around it - in a record that
     has no object: its visible, or its visibleIf run over the record (the record item is the {row} /
     {panel} variable, see createRecordVisibilityScope); once per element and record, one runner per
     expression text. reset names the record the next answers are about. */
  protected createRecordElementVisibility(properties: HashTable<any>): IRecordElementVisibility {
    const survey = this.survey;
    const scope = this.createRecordVisibilityScope(properties);
    const runners = new Map<string, ConditionRunner>();
    // The result of a condition that reads no record variable, computed once for the run.
    const recordIndependent = new Map<string, boolean>();
    let visibility = new Map<Question | PanelModelBase, boolean>();
    return {
      reset: (index: number, record: any): void => {
        scope.item.reset(index, record);
        visibility = new Map<Question | PanelModelBase, boolean>();
      },
      isVisible: (el: Question | PanelModelBase): boolean => {
        let res = visibility.get(el);
        if (res !== undefined) return res;
        const expression = !!el.visibleIf ? survey.beforeExpressionRunning(el, "visibleIf", el.visibleIf) : "";
        if (!expression) {
          res = el.visible;
        } else {
          res = recordIndependent.get(expression);
          if (res === undefined) {
            let runner = runners.get(expression);
            if (!runner) {
              runner = new ConditionRunner(expression);
              runners.set(expression, runner);
            }
            scope.properties["question"] = el;
            res = runner.runContext(scope.item.getValueGetterContext(), scope.properties) === true;
            if (!this.readsRecordVariable(runner))recordIndependent.set(expression, res);
          }
        }
        visibility.set(el, res);
        return res;
      }
    };
  }
  /* The variables the runner reports name a record: the record item and its neighbours ({row}, {panel},
     ...), the index variables, or a field of the record. */
  private readsRecordVariable(runner: ConditionRunner): boolean {
    const names = settings.expressionVariables;
    const roots = [names.row, names.prevRow, names.nextRow, names.rowIndex, names.visibleRowIndex, names.rowValue, names.rowName,
      names.rowTitle, names.panel, names.prevPanel, names.nextPanel, names.parentPanel, names.panelIndex, names.visiblePanelIndex];
    return runner.getVariables().some((name: string): boolean => {
      const root = name.split(/[.[]/)[0];
      return roots.indexOf(root) > -1 || !!this.getRecordTemplateQuestion(root);
    });
  }
  // The question's clearIfInvisible allows a clear for the reason (Question.clearValueIfInvisible).
  protected canRecordQuestionBeCleared(q: Question, reason: string): boolean {
    const clearIf = this.survey.getQuestionClearIfInvisible(q.clearIfInvisible);
    if (clearIf === "none") return false;
    if (reason === "onHidden" && clearIf === "onComplete") return false;
    return reason !== "onHiddenContainer" || clearIf === reason;
  }
  /* clearIfInvisible "onHidden" / "onHiddenContainer" under paging in memory. A question of a row or a
     panel clears its answer when it turns from visible to hidden, never because it is built hidden; a
     record without an object has no question to do it, so the transition is followed over the stored
     record, for the inputs the type names (getRecordConditionalInputs) whose own effective mode clears
     on hiding - the survey's setting or the question's clearIfInvisible. Each input keeps two flags per
     record: the question's own visibility and that of the panels around it (up to
     getRecordInputContainer). A built question clears for its own hiding under either mode, and for a
     hidden container only under "onHiddenContainer"; the pass does the same. A record that has an
     object takes its flags from the object's questions, so the history goes on when it loses the
     object; a record seen for the first time is only noted. On a transition the input's key and its
     comment go, as clearValue() removes them; the writes of one run go in one batch of the list.
     The flags are kept per record (getRecordStateKey): by record index for the array types, shifted by
     the question's own insert, remove and move and kept across an assignment from outside as a built
     object keeps them (followHiddenAnswerStatesOnAssignment).
     Cost: one condition run per conditional input and record without an object, per condition run of
     the question, while an input clears on hiding - except a condition that reads no record variable,
     which runs once per run (createRecordElementVisibility). */
  private hiddenAnswerStates: Map<any, HashTable<number>>;
  protected clearHiddenAnswersWithoutObjects(properties: HashTable<any>): void {
    if (!this.isPagedByList || this.areInvisibleElementsShowing || this.isRemoteData || !this.survey) return;
    const inputs = this.getRecordConditionalInputs().filter((q: Question): boolean => this.canRecordQuestionBeCleared(q, "onHidden"));
    if (inputs.length === 0) return;
    if (!this.hiddenAnswerStates)this.hiddenAnswerStates = new Map<any, HashTable<number>>();
    const states = this.hiddenAnswerStates;
    const container = this.getRecordInputContainer();
    const list = this.dataList;
    let visibility: IRecordElementVisibility;
    const changes: Array<{ index: number, record: any }> = [];
    this.forEachRecordItem(list.getCreatedIndexes(), (index: number, item: QuestionRecordItem): void => {
      const record = this.getListRecordAt(index);
      const key = this.getRecordStateKey(index, record);
      if (!!item) {
        states.set(key, this.getItemHiddenAnswerState(item, inputs, container));
        return;
      }
      if (!Helpers.isValueObject(record, true)) return;
      if (!visibility) visibility = this.createRecordElementVisibility(properties);
      visibility.reset(index, record);
      const prevState = states.get(key);
      const state: HashTable<number> = {};
      let cleared: any = undefined;
      inputs.forEach((q: Question): void => {
        const name = q.getValueName();
        const flags = getHiddenAnswerFlags(visibility.isVisible(q), (el: PanelModelBase): boolean => visibility.isVisible(el), q, container);
        state[name] = flags;
        if (!prevState || !this.isHiddenAnswerCleared(q, prevState[name], flags)) return;
        cleared = this.removeRecordAnswer(record, cleared, name);
      });
      states.set(key, state);
      if (!!cleared) changes.push({ index: index, record: cleared });
    });
    this.writeRecordChanges(changes);
  }
  // The flags a built object's questions give the inputs (see clearHiddenAnswersWithoutObjects).
  private getItemHiddenAnswerState(item: QuestionRecordItem, inputs: Array<Question>, container: PanelModelBase): HashTable<number> {
    const state: HashTable<number> = {};
    inputs.forEach((input: Question): void => {
      const name = input.getValueName();
      const q = item.getQuestionsByValueName(name)[0];
      if (!q) return;
      state[name] = getHiddenAnswerFlags(q.visible, (el: PanelModelBase): boolean => el.visible, q, null);
    });
    return state;
  }
  // A transition that clears: the question hid itself, or - under "onHiddenContainer" - a panel around it hid.
  private isHiddenAnswerCleared(q: Question, prev: number, flags: number): boolean {
    if (prev === undefined) return false;
    if ((prev & HIDDEN_ANSWER_SELF) && !(flags & HIDDEN_ANSWER_SELF)) return true;
    return (prev & HIDDEN_ANSWER_CONTAINER) && !(flags & HIDDEN_ANSWER_CONTAINER) && this.canRecordQuestionBeCleared(q, "onHiddenContainer");
  }
  // The question's own insert, remove and move renumber the flags kept by record index.
  private remapHiddenAnswerStates(remap: (index: number) => number): void {
    const states = this.hiddenAnswerStates;
    if (!states || states.size === 0) return;
    const res = new Map<any, HashTable<number>>();
    states.forEach((state: HashTable<number>, key: any): void => {
      const newKey = typeof key === "number" ? remap(key) : key;
      if (newKey !== -1) res.set(newKey, state);
    });
    this.hiddenAnswerStates = res;
  }
  /* An assignment from outside: the flags a built object would keep are kept. By default (the panel)
     the panels at the positions that stay keep theirs; a type that rebuilds its objects drops them
     (keepsHiddenAnswerStates). */
  private followHiddenAnswerStatesOnAssignment(oldCount: number, newCount: number): void {
    const states = this.hiddenAnswerStates;
    if (!states || states.size === 0) return;
    const keep = this.keepsHiddenAnswerStates(oldCount, newCount);
    Array.from(states.keys()).forEach((key: any): void => {
      if (typeof key === "number" && (!keep || key >= newCount)) states.delete(key);
    });
  }
  protected keepsHiddenAnswerStates(oldCount: number, newCount: number): boolean {
    return true;
  }
  /* The record without the answer stored under name and its comment, the keys clearValue() removes.
     cleared: the copy made so far, undefined for none; the result is that copy, made when needed. */
  protected removeRecordAnswer(record: any, cleared: any, name: string): any {
    [name, name + settings.commentSuffix].forEach((key: string): void => {
      if ((cleared || record)[key] === undefined) return;
      if (!cleared) cleared = Object.assign({}, record);
      delete cleared[key];
    });
    return cleared;
  }
  // The records a clean-up pass changed, written in one batch of the list as the question's own change.
  private writeRecordChanges(changes: Array<{ index: number, record: any }>): void {
    if (changes.length === 0) return;
    const list = this.dataList;
    this.writeRecords((): void => list.batch((): void => {
      changes.forEach((change: { index: number, record: any }): void => { list.setRecord(change.index, change.record); });
    }));
  }
  // What the visibility kept for a record is stored under: the record index (see clearHiddenAnswersWithoutObjects).
  protected getRecordStateKey(recordIndex: number, record: any): any {
    return recordIndex;
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
  // The page is a slice of the visible records: their visibility is decided before it is cut.
  protected decideRecordsVisibilityBeforeCut(): void {
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

  /* The incorrect answers of the records that have no object - the records of the pages never opened
     or left - cleared as their own objects would clear them, so that the result equals the unpaged
     one. The keys no question stores go (getRecordUnknownKeys). For each record a temporary object of
     the type is built for a copy of it, as a page build builds one (createRecordCleanupObject): the
     same factory and the survey's creation events (onMatrixCellCreating, onMatrixCellCreated,
     onQuestionCreated), the detail panel of a matrix that has one. It is loaded without writes, its
     conditions run, and its own released clearIncorrectValues() writes into the copy
     (recordCleanup); then it is disposed. It is not attached to the rows or panels and no add event
     fires.
     - A record the filter excludes keeps its answers, as it does without paging.
     - An assigned source is skipped, as every survey clean-up skips a source-owned question.
     - Kept as they are (isRecordCleanupSkipped): an answer whose choices come from a request
       (choicesByUrl, lazy loading) - no request is sent -, the value of a question that holds records
       of its own, whose clean-up does not run without an object, and a file question's value - no
       download starts. The object is built without them, or with them still loading, and their
       values are copied back unchanged.
     - A handler that changes the records during the walk wins: a cleaned copy is written only to a
       record whose stored object is still the one the walk read.
     Cost: one object per record without an object, only on an explicit clearIncorrectValues (the
     unpaged question builds one per record too). The changed records are written in one batch. */
  private clearIncorrectValuesWithoutObjects(): void {
    if (!this.isPagedByList || this.isRemoteData || this.isEmpty()) return;
    this.cleanRecordsWithoutObjects((index: number, record: any): any =>
      this.cleanRecordWithObject(index, record, (cleanupObject: IRecordCleanupObject): void => cleanupObject.clearIncorrectValues()));
  }
  /* The records without an object that the view creates, each passed to clean (which returns the
     cleaned record), and the changed ones written back - only where the stored object is still the one
     clean read: a handler that ran inside it may have changed the records. */
  protected cleanRecordsWithoutObjects(clean: (index: number, record: any) => any): void {
    const list = this.dataList;
    const read: Array<{ index: number, record: any, cleared: any }> = [];
    this.forEachRecordItem(list.getCreatedIndexes(), (index: number, item: QuestionRecordItem): void => {
      const record = this.getListRecordAt(index);
      if (!!item || !Helpers.isValueObject(record, true)) return;
      read.push({ index: index, record: record, cleared: clean(index, record) });
    });
    const changes: Array<{ index: number, record: any }> = [];
    read.forEach((entry: { index: number, record: any, cleared: any }): void => {
      if (Helpers.isTwoValueEquals(entry.cleared, entry.record)) return;
      if (entry.index >= list.loadedCount || this.getListRecordAt(entry.index) !== entry.record) return;
      changes.push({ index: entry.index, record: entry.cleared });
    });
    this.writeRecordChanges(changes);
  }
  // The question of a record's template that stores key, for the value-only clean-ups.
  protected abstract getRecordTemplateQuestion(key: string): Question;
  /* The record a temporary object of the clean-up judges: the object reads and writes a copy of it,
     never the list. item is the object once it is built; while it is built (isBuilding) the object the
     type does not know is it, and its writes are dropped - a build loads the record without writing. */
  private recordCleanup: { index: number, copy: any, item: ISurveyData, isBuilding: boolean };
  // The copy a temporary object reads; isUnknownItem: the type does not know the item as one of its objects.
  protected getRecordCleanupCopy(item: ISurveyData, isUnknownItem: boolean): any {
    const cleanup = this.recordCleanup;
    return !!cleanup && (cleanup.item === item || !cleanup.item && isUnknownItem) ? cleanup.copy : undefined;
  }
  /* A write of a temporary object goes into its copy (an empty value removes the key, as a write of
     a row or a panel does), or nowhere while it is built. Returns false for any other object. */
  protected writeRecordCleanupCopy(item: ISurveyData, isUnknownItem: boolean, name: string, val: any): boolean {
    const copy = this.getRecordCleanupCopy(item, isUnknownItem);
    if (copy === undefined) return false;
    if (this.recordCleanup.isBuilding) return true;
    if (Helpers.isValueEmpty(val)) {
      delete copy[name];
    } else {
      copy[name] = Helpers.getUnbindValue(val);
    }
    return true;
  }
  // A temporary object is being built: the types build the questions the clean-up skips without starting their requests.
  protected get isRecordCleanupBuilding(): boolean {
    return !!this.recordCleanup && this.recordCleanup.isBuilding;
  }
  // The record index of a temporary object, -1 for any other object.
  protected getRecordCleanupIndex(item: ISurveyData, isUnknownItem: boolean): number {
    return this.getRecordCleanupCopy(item, isUnknownItem) !== undefined ? this.recordCleanup.index : -1;
  }
  /* A copy of the record, cleaned by a temporary object of the type (clearIncorrectValuesWithoutObjects):
     clean runs the object's own released clean-up. */
  protected cleanRecordWithObject(index: number, record: any, clean: (cleanupObject: IRecordCleanupObject) => void): any {
    const copy = Object.assign({}, record);
    this.getRecordUnknownKeys(index, record, undefined).forEach((key: string): void => { delete copy[key]; });
    const cleanup = { index: index, copy: copy, item: <ISurveyData>undefined, isBuilding: true };
    const prev = this.recordCleanup;
    this.recordCleanup = cleanup;
    let cleanupObject: IRecordCleanupObject = undefined;
    try {
      cleanupObject = this.createRecordCleanupObject(index, copy);
      if (!cleanupObject) return record;
      cleanup.item = cleanupObject.item;
      // Loaded: what its conditions and its clean-up change is written into the copy, as a built object writes it.
      cleanup.isBuilding = false;
      cleanupObject.runCondition(this.getDataFilteredProperties());
      clean(cleanupObject);
    } finally {
      this.recordCleanup = prev;
      if (!!cleanupObject) cleanupObject.dispose();
    }
    // What the clean-up does not judge is copied back as it was.
    Object.keys(record).forEach((key: string): void => {
      const template = this.getRecordTemplateQuestion(key);
      if (!!template && isRecordCleanupSkipped(template)) copy[key] = record[key];
    });
    return copy;
  }
  /* The temporary object of clearIncorrectValuesWithoutObjects for the record at index, built and
     loaded as a page build builds one; undefined keeps the record as it is. */
  protected abstract createRecordCleanupObject(index: number, record: any): IRecordCleanupObject;
  // A template question the clean-up does not judge (see clearIncorrectValuesWithoutObjects).
  protected isRecordCleanupSkipped(question: Question): boolean {
    return isRecordCleanupSkipped(question);
  }
  /* The write capabilities of a data source are declared by the presence of its optional methods (its
     read capabilities by flags, see dynamic-data-interfaces.ts), and need a keyField for any source
     that is not an in-memory array (DynamicDataList.hasCapability): a source without insert gets no
     add button, one without remove no delete button, one without move no drag handles, and one
     without update makes every object read-only - a silently unsaved edit is worse than a disabled
     field. A source without keyField is read-only as a whole. A question without a data source has
     every capability, except the membership operations of a question that defines its records itself
     (isRecordMembershipFixed). The list is not created for the answer. */
  protected canWriteRecords(operation: DynamicDataOperation): boolean {
    if (this.isRecordMembershipFixed() && (operation === "insert" || operation === "remove" || operation === "move")) return false;
    const list = this._dataList;
    if (!list || !list.isRemote) return true;
    // A move of a page the list filtered or sorted itself cannot be told to the source.
    return list.hasCapability(operation) && (operation !== "move" || list.canMoveInSource);
  }
  /* The source half of canWriteRecords, for an operation the question is about to make: an assigned
     source without the capability refuses it before any other check, event or change, whichever path
     asked - code or UI - and the refusal is reported once, under the operation. The membership rule of
     a question that defines its records itself is not a refusal of the source and stays silent, as
     does every other reason not to make an operation. Returns true when the operation is refused. */
  protected refuseOperationOfSource(operation: DynamicDataOperation): boolean {
    if (this.isRecordMembershipFixed() && operation !== "update") return false;
    const list = this._dataList;
    if (!list || !list.isRemote) return false;
    if (!list.hasCapability(operation)) {
      // An in-memory array without keyField has every write method: it is refused only because another question writes it.
      const source = list.assignedSource;
      const reason = source instanceof ArrayDynamicDataSource && !list.keyField ?
        "The data source is written by position by another question, so the records of this question are read-only" :
        !list.keyField ? "The data source has no keyField, so its records are read-only" : "The data source does not implement " + operation;
      this.reportOperationRefused(operation, reason);
      return true;
    }
    // A move names a position in the whole source, which a page the source filtered or sorted does not know.
    if (operation === "move" && !list.canMoveInSource) {
      this.reportOperationRefused("move", "The data source filtered or sorted the loaded page, so the position in the whole source is not known");
      return true;
    }
    return false;
  }
  /* The writes the question computes itself - while it builds the objects of its records and while it
     runs the conditions of its objects: default values, expression results, setValueExpression and
     defaultValueExpression. They are not edits, and a source without update does not refuse them:
     they reach the window and question.value, never the source, as they always have. {panel.x} and
     {row.x} read the record, so a computed value has to reach it - an expression that reads another
     one would lose it otherwise. A depth: the scopes nest. */
  private computedWriteDepth: number = 0;
  protected runComputedWrites<T>(func: () => T): T {
    this.computedWriteDepth++;
    try {
      return func();
    } finally {
      this.computedWriteDepth--;
    }
  }
  /* The edit rule both owners' updateItemValue start with: an edit of a record - any write outside
     runComputedWrites - that the source cannot update is refused and reported, nothing is written, and
     the object shows its stored record again; updateFromRecord does not write it back.
     getRecordIndex names the item's record; it is read only for a refusal. Returns true when the edit
     is refused. */
  protected refuseRecordEdit(item: QuestionRecordItem, getRecordIndex: () => number): boolean {
    if (this.computedWriteDepth > 0 || !this.refuseOperationOfSource("update")) return false;
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
  /* The start of a removal, with no change: everything that depends on the object being among the
     objects is read now - after the splice a row has no position, and a panel that is not among the
     panels is taken for one being appended. undefined: the target's object is no longer among them.
     The caller's own steps that may cancel (a removing event) run between this and
     removeResolvedRecord. */
  protected resolveRecordRemoval(target: IRecordTarget): IRecordRemoval {
    const item = target.item;
    const position = !!item ? this.getItemPosition(item) : -1;
    if (!!item && position < 0) return undefined;
    const recordIndex = !!item ? this.getItemRecordIndex(item) : target.recordIndex;
    return { item: item, position: position, recordIndex: recordIndex, viewIndex: this.getRecordViewIndex(recordIndex) };
  }
  /* A removal from its target, in the order every type keeps: the record is resolved, the type's
     removing event is raised (raiseRemoving answers false to cancel), the type adds what it decides
     before the splice (extend), and the record is removed (removeResolvedRecord). A handler of the
     event may insert, remove or move records: the removal follows its record by index through the
     list's own changes, and the object that shows it then is the one removed. An assignment from
     outside during the event replaces the objects: as the released rule, the removal takes the object
     now at the resolved position, and nothing is removed when there is none. undefined: nothing was
     removed. */
  protected removeTarget<T extends IRecordRemoval>(target: IRecordTarget, raiseRemoving: (removal: IRecordRemoval) => boolean,
    extend?: (removal: IRecordRemoval) => T): T {
    this.isLastTargetRemoved = false;
    let removal = this.resolveRecordRemoval(target);
    if (!removal) return undefined;
    const followed: IRecordTarget = { recordIndex: removal.recordIndex };
    if (!this.heldRemoveTargets)this.heldRemoveTargets = [];
    const held = this.heldRemoveTargets;
    held.push(followed);
    let isAllowed: boolean;
    try {
      isAllowed = raiseRemoving(removal);
    } finally {
      const at = held.indexOf(followed);
      if (at > -1) held.splice(at, 1);
    }
    if (!isAllowed) return undefined;
    if (followed.recordIndex !== removal.recordIndex && this.heldRemoveTargets === held) {
      if (followed.recordIndex < 0) return undefined;
      removal = this.resolveRecordRemoval(this.createRecordTargetOf(followed.recordIndex));
      if (!removal) return undefined;
    } else if (!!removal.item && this.getItemPosition(removal.item) < 0) {
      const item = this.getItem(removal.position);
      if (!item) return undefined;
      removal = this.resolveRecordRemoval({ item: item, recordIndex: this.getItemRecordIndex(item) });
      if (!removal) return undefined;
    }
    const res = !!extend ? extend(removal) : <T>removal;
    this.removeResolvedRecord(res);
    this.isLastTargetRemoved = true;
    return res;
  }
  // The last removeTarget removed a record (a handler may cancel it, or it may find nothing to remove).
  private isLastTargetRemoved: boolean = false;
  /* After a removal from the UI: a remote page that is read again after it is rebuilt when the read
     commits, and the object focused after the removal goes with it - the position is focused once more
     after that rebuild (focusItemAfterRead). Only when a record was removed: a cancelled removal leaves
     the focus where it is. */
  protected keepFocusForReadAfterRemoval(index: number): void {
    if (this.isLastTargetRemoved)this.keepFocusIndexForRead(index);
  }
  /* The key the duplicate checks group a value by (getDuplicateKey); caseSensitive defaults to the
     question's uniqueness rule. */
  protected getRecordKey(value: any, caseSensitive?: boolean): string {
    return getDuplicateKey(value, caseSensitive !== undefined ? caseSensitive : this.getRecordUniqueness().caseSensitive);
  }
  // The indexes of every loaded record, in record order.
  protected getLoadedRecordIndexes(): Array<number> {
    return createIndexes(this.dataList.loadedCount);
  }
  // The target of an object, at a visible index of the whole view.
  protected createItemTarget(item: QuestionRecordItem, visibleIndex: number): IRecordTarget {
    return { item: item, recordIndex: this.getItemRecordIndex(item), visibleIndex: visibleIndex };
  }
  // The target of a record index: with its object when it has one.
  private createRecordTargetOf(recordIndex: number): IRecordTarget {
    const item = this.getItemByRecordIndex(recordIndex);
    return !!item ? { item: item, recordIndex: recordIndex } : { recordIndex: recordIndex, record: this.getListRecordAt(recordIndex) };
  }
  /* The removal, in order: the page index is read (the splice and what the type does after it do not
     move the page), the object leaves its array (detachItem), and the storage write runs
     (removeStoredRecord), which calls the refill of the page the list cuts once, where the type
     decides. The caller announces the removal afterwards, unless the type does inside its write. */
  protected removeResolvedRecord(removal: IRecordRemoval): void {
    const pageIndex = !!this.dataListValue ? this.dataListValue.pageIndex : 0;
    this.detachItem(removal);
    this.removeStoredRecord(removal, (): void => { this.refillPageAfterRemove(pageIndex); });
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
      const visibleIndex = this.dataList.getVisibleIndexes().indexOf(recordIndex);
      if (visibleIndex > -1)this.keepPendingVisibleIndex(visibleIndex);
    }
    return this.showPageOfRecord(recordIndex);
  }
  /* The add of a question whose count setter builds the objects (rowCount++, panelCount++ in grow):
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
      this.pagerActionsValue = this.createPagerActions(this.createActionContainer());
    }
    return this.pagerActionsValue;
  }
  /* The pager the renderers show through their action bar: it computes nothing of its own, it shows
     what the paging helper answers. The page buttons are icons whose localized titles are their
     accessible names; the page info is a disabled item without a tab stop, text the keyboard passes
     over. */
  // A page-move action of the pager: an icon button with a localized title.
  private createPageMoveAction(id: string, iconName: string, titleName: string, canMove: () => boolean, move: () => void): Action {
    return new Action({
      id: id,
      iconName: iconName,
      showTitle: false,
      title: <any>new ComputedUpdater(() => this.getLocalizationFormatString(titleName)),
      enabled: <any>new ComputedUpdater(canMove),
      action: move
    });
  }
  private createPagerActions(container: ActionContainer): ActionContainer {
    const prevAction = this.createPageMoveAction("sv-pager-prev", "icon-arrowleft", "pagePrevText",
      (): boolean => this.paging.canGoPrevPage, (): void => { this.paging.prevPage(); });
    const pageInfoAction = new Action({
      id: "sv-pager-info",
      /* A count nobody knows has no total to show: the page number alone. A known count goes through
         indexText like every other pager (some locales reverse the order). survey.locale is a property
         read, so the updater follows it; the global surveyLocalization.currentLocale is not observed.
         Both texts are computed on every run: a ComputedUpdater collects its dependencies once, on the
         first run, so a branch not taken then (the total, while the count is unknown) is never
         observed afterwards. */
      title: <any>new ComputedUpdater(() => {
        const page = this.reportedPageIndex + 1;
        const text = this.getLocalizationFormatString("indexText", page, this.reportedPageCount);
        return this.paging.isCountKnown ? text : String(page);
      }),
      enabled: false,
      disableTabStop: true
    });
    const nextAction = this.createPageMoveAction("sv-pager-next", "icon-arrowright", "pageNextText",
      (): boolean => this.paging.canGoNextPage, (): void => { this.paging.nextPage(); });
    container.setItems([prevAction, pageInfoAction, nextAction]);
    return container;
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
    return recordIndex < 0 && !!this.dataListValue && this.dataListValue.isPagedBySource;
  }
  /* Under paging, the record a whole-view number names (getRecordIndexAtVisibleIndex), with its
     object when it has one. undefined: there is none. isNotLoaded: a source that pages itself holds
     another window. A record without an object is captured as the question reads it
     (getListRecordAt), to be found again later. Range checks against the question's count stay with
     the caller. */
  protected getRecordTargetAtVisibleIndex(visibleIndex: number): IRecordTarget {
    return this.createRecordTarget(this.getRecordIndexAtVisibleIndex(visibleIndex), visibleIndex);
  }
  /* The created-position counterpart, for the numbers that count the owner-hidden records too
     (getRowValue, moveRowByIndex, the panel's getQuestionFromArray, ...): under paging a position among
     the created records of the whole view, also on another page. A number past the records shown
     (globalCreatedExtent) names nothing: undefined. */
  protected getRecordTargetAtCreatedIndex(createdIndex: number): IRecordTarget {
    const list = this.dataList;
    if (createdIndex < 0 || createdIndex >= list.globalCreatedExtent) return undefined;
    return this.createRecordTarget(list.getIndexAtGlobalCreatedIndex(createdIndex));
  }
  private createRecordTarget(recordIndex: number, visibleIndex?: number): IRecordTarget {
    if (recordIndex < 0) return this.isRecordNotLoaded(recordIndex) ? { recordIndex: -1, visibleIndex: visibleIndex, isNotLoaded: true } : undefined;
    const item = this.getItemByRecordIndex(recordIndex);
    if (!!item) return { recordIndex: recordIndex, visibleIndex: visibleIndex, item: item };
    return { recordIndex: recordIndex, visibleIndex: visibleIndex, record: this.getListRecordAt(recordIndex) };
  }
  /* The bound of the visible positions a number may name: unpagedCount without paging; under paging
     the visible records counted, or further where the window holds the records a source that pages
     itself keeps on a page (globalVisibleExtent). The counts stay the source's. */
  protected getVisibleNumberEnd(unpagedCount: number): number {
    return this.isPagingActive ? this.dataList.globalVisibleExtent : unpagedCount;
  }
  /* The record a created position of the whole view names, for an operation on it: -1 when there is
     none, and a record a source that pages itself has not loaded is refused and reported under the
     operation. */
  protected getRecordIndexForOperation(createdIndex: number, operation: DynamicDataOperation): number {
    const target = this.getRecordTargetForOperation(createdIndex, operation);
    return !!target ? target.recordIndex : -1;
  }
  // The same, with the record's object when it has one: undefined when there is no record to act on.
  protected getRecordTargetForOperation(createdIndex: number, operation: DynamicDataOperation): IRecordTarget {
    const target = this.getRecordTargetAtCreatedIndex(createdIndex);
    if (!target) return undefined;
    if (target.isNotLoaded) {
      this.reportRecordNotLoaded(operation);
      return undefined;
    }
    return target;
  }
  /* The record index an insert at a created position of the whole view goes to: in front of the
     record at that position, an append at or past the last one (getInsertIndexAtCreatedIndex of the
     list). -1: a source that pages itself does not hold the position - the insert is refused and
     reported. */
  protected getInsertIndexForOperation(createdIndex: number): number {
    const at = this.dataList.getInsertIndexAtCreatedIndex(createdIndex);
    if (at < 0) {
      this.reportRecordNotLoaded("insert");
    }
    return at;
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
  // The record of the last object of the page: -1 when there is none.
  protected getLastMaterializedRecordIndex(): number {
    const created = this.dataList.getMaterializedIndexes();
    return created.length > 0 ? created[created.length - 1] : -1;
  }
  /* Where an insert at a created position of the whole view goes: the record index (-1: refused and
     reported, getInsertIndexForOperation) and the visible index the new record will have - an append's
     when it goes in front of a record the view hides. */
  protected getInsertTargetForOperation(createdIndex: number): { at: number, visibleIndex: number } {
    const list = this.dataList;
    const at = this.getInsertIndexForOperation(createdIndex);
    const visibleIndex = at < list.loadedCount ? list.getGlobalVisibleIndex(at) : -1;
    return { at: at, visibleIndex: visibleIndex > -1 ? visibleIndex : list.visibleCount };
  }
  /* The two records a move between created positions of the whole view names, each end clamped to the
     records shown, as the numbers of a move are clamped without paging. undefined: there is nothing to
     move, or a source that pages itself has not loaded an end - the move is refused and reported once. */
  protected getMoveTargetsAtCreatedIndexes(fromIndex: number, toIndex: number): { from: IRecordTarget, to: IRecordTarget } {
    const last = this.dataList.globalCreatedExtent - 1;
    if (last < 0) return undefined;
    const from = this.getRecordTargetAtCreatedIndex(Math.max(0, Math.min(fromIndex, last)));
    const to = this.getRecordTargetAtCreatedIndex(Math.max(0, Math.min(toIndex, last)));
    if (!from || !to) return undefined;
    if (from.isNotLoaded || to.isNotLoaded) {
      this.reportRecordNotLoaded("move");
      return undefined;
    }
    return { from: from, to: to };
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
    const index = target.recordIndex;
    const list = this.dataList;
    const oldRecord = list.getRecord(index);
    const record = Object.assign({}, oldRecord);
    merge(record);
    if (!DynamicDataList.isValueChanged(record, oldRecord)) return;
    if (this.isPagedByList) {
      this.markRecordEdited(index);
    }
    this.writeRecords((): boolean => list.setRecord(index, record));
  }
  /* The start of a removal: the remove a source cannot make is refused, resolve names the target, and
     a record a source that pages itself has not loaded is reported. undefined: nothing to remove. */
  protected getRemoveTarget(resolve: () => IRecordTarget): IRecordTarget {
    if (this.refuseOperationOfSource("remove")) return undefined;
    const target = resolve();
    if (!target) return undefined;
    if (target.isNotLoaded) {
      this.reportRecordNotLoaded("remove");
      return undefined;
    }
    return target;
  }
  /* What a removal by number acts on. index is a position among the visible records of the whole
     view, below getVisibleNumberEnd(unpagedCount); under paging the record it names may be on another
     page and have no object. Without paging getVisibleItem answers the object at the position. */
  protected resolveRecordTarget(index: number, unpagedCount: number, getVisibleItem: (index: number) => QuestionRecordItem): IRecordTarget {
    if (index < 0 || index >= this.getVisibleNumberEnd(unpagedCount)) return undefined;
    if (this.isPagingActive) return this.getRecordTargetAtVisibleIndex(index);
    const item = getVisibleItem(index);
    return !item ? undefined : this.createItemTarget(item, index);
  }
  /* A removal target found again when a confirmation answers: by then the page, the sort or the
     records may have changed. A target captured with an object names its record for as long as the
     object is built and visible - the remap layer keeps it in step - and none once the object is gone.
     A target captured without one is found again by its record (findRecordTargetAgain). The two kinds
     never stand in for each other: a target with an object holds no record, and looking that up could
     name another one - a stored undefined or empty entry. */
  protected findRemoveTargetAgain(target: IRecordTarget): IRecordTarget {
    if (this.isDisposed) return undefined;
    if (!target.item) return this.findRecordTargetAgain(target);
    const visibleIndex = this.getItemVisibleIndex(target.item);
    if (visibleIndex < 0) return undefined;
    return this.createItemTarget(target.item, visibleIndex);
  }
  /* A target without an object, found again after the records or the view changed - a confirmation
     answers later. A held target (holdRemoveTarget) names its record by index; any other one by its
     record object. undefined when the record is gone or left the view, or an assignment from outside
     replaced the records. */
  private findRecordTargetAgain(target: IRecordTarget): IRecordTarget {
    const list = this.dataList;
    const held = !!this.heldRemoveTargets ? this.heldRemoveTargets.indexOf(target) : -1;
    if (held > -1)this.heldRemoveTargets.splice(held, 1);
    const recordIndex = held > -1 ? target.recordIndex : list.indexOfRecord(target.record);
    const visibleIndex = recordIndex < 0 ? -1 : list.getGlobalVisibleIndex(recordIndex);
    return visibleIndex < 0 ? undefined : { recordIndex: recordIndex, visibleIndex: visibleIndex, record: list.getRecord(recordIndex) };
  }
  /* The removals a confirmation holds for records without an object (another page). Every write of a
     record replaces its object, so a held target names its record by index, kept in step with the
     question's own inserts, removes and moves; an assignment from outside, a read and a new source drop
     the held targets, and their answers fall back to the record object. */
  private heldRemoveTargets: Array<IRecordTarget>;
  /* A removal the respondent confirms first (confirmDeleteText): the target is held while the dialog
     is open, found again when they confirm (findRemoveTargetAgain), and handed to remove; nothing is
     removed when it is gone. */
  protected confirmRecordRemoval(target: IRecordTarget, message: string, remove: (current: IRecordTarget) => void): void {
    this.holdRemoveTarget(target);
    confirmActionAsync({
      message: message,
      funcOnYes: () => {
        const current = this.findRemoveTargetAgain(target);
        if (!!current) remove(current);
      },
      locale: this.getLocale(),
      rootElement: this.survey.rootElement,
      cssClass: this.cssClasses.confirmDialog
    });
  }
  protected holdRemoveTarget(target: IRecordTarget): void {
    if (!!target.item) return;
    if (!this.heldRemoveTargets)this.heldRemoveTargets = [];
    this.heldRemoveTargets.push(target);
  }
  private remapHeldRemoveTargets(remap: (index: number) => number): void {
    if (!this.heldRemoveTargets) return;
    this.heldRemoveTargets.forEach((target: IRecordTarget): void => {
      const to = target.recordIndex < 0 ? -1 : remap(target.recordIndex);
      target.recordIndex = to === undefined ? -1 : to;
    });
  }
  /* The record a question that shows one record at a time keeps shown (the dynamic panel's current
     panel), held across rebuilds. It names its record for as long as the record exists: every
     insert, remove and move of the list renumbers it, and so does every read that commits again (by
     key, or by content for a source without a key). A record that is gone - removed, not found
     again, or in a window of a source that pages itself that moved and has no key to follow it by -
     makes it -1. Replacing the source and disposing clear it. An assignment of the value from outside
     does not renumber it: without paging the current panel keeps its position then, and the held
     index names a storage position the same way. */
  private currentRecordIndex: number = -1;
  // The window offset of the source the index was taken in, or last renumbered for.
  private currentRecordWindowOffset: number = 0;
  // The source was replaced: the index names a record of the old one until the new one commits.
  private isCurrentRecordOfOldSource: boolean = false;
  protected setCurrentRecordIndex(recordIndex: number): void {
    this.currentRecordIndex = recordIndex;
    this.currentRecordWindowOffset = !!this._dataList ? this._dataList.windowOffset : 0;
  }
  // -1 when there is none, or when it is stale: the window moved since it was taken.
  protected getCurrentRecordIndex(): number {
    const list = this._dataList;
    if (!!list && list.windowOffset !== this.currentRecordWindowOffset) return -1;
    return this.currentRecordIndex;
  }
  private remapCurrentRecord(remap: (index: number) => number): void {
    const follow = (index: number): number => {
      if (index < 0) return index;
      const to = remap(index);
      return to === undefined ? -1 : to;
    };
    this.currentRecordIndex = follow(this.currentRecordIndex);
    this.announcedRecordIndex = follow(this.announcedRecordIndex);
  }
  /* The current record the question last announced (the dynamic panel's current-index event), followed
     through the same inserts, removes, moves and reloads as the current record, so that an operation
     that ends on the record and the position it started from announces nothing. -1: none, or gone. */
  private announcedRecordIndex: number = -1;
  protected setAnnouncedRecordIndex(recordIndex: number): void {
    this.announcedRecordIndex = recordIndex;
  }
  protected getAnnouncedRecordIndex(): number {
    return this.announcedRecordIndex;
  }
  /* The visible position a move from code goes to while the objects of its page do not exist yet,
     and the move it belongs to: a move made from inside another one - an event handler - supersedes
     it. */
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
  protected reportRecordNotLoaded(operation: DynamicDataOperation): void {
    this.reportOperationRefused(operation, "The record is not in the loaded page of the data source");
  }
  // An operation the question refused before it changed anything, reported under that operation.
  protected reportOperationRefused(operation: DynamicDataOperation, reason: string): void {
    this.onSourceError(new Error(reason + "; the " + operation + " was not made."), operation);
  }
  // The assigned data source, read back from the list (assignedSource); nothing is created for it.
  protected getDataSource(): IDynamicDataSource {
    return !!this.dataListValue ? this.dataListValue.assignedSource : undefined;
  }
  // The survey-data side of the swap. The question follows the call with its own refresh, also for
  // the same source.
  /* While a source is assigned the list may read it synchronously and settle inside the swap: what
     waits for the settle (onDataSettled) runs once at the end, after the source's capabilities are
     applied. */
  private isAssigningDataSource: boolean;
  protected setDataSource(val: IDynamicDataSource): void {
    this.isAssigningDataSource = true;
    try {
      this.setDataSourceCore(val);
    } finally {
      this.isAssigningDataSource = false;
    }
    this.onDataSettled();
  }
  private setDataSourceCore(val: IDynamicDataSource): void {
    const newValue = val || undefined;
    /* Another storage: the records layer 2 tracks and the states kept for them name records of the
       old one, and so do the current record and the position a move is going to. Dropped before the
       swap, whose first read may commit inside it. */
    if (newValue !== (!!this._dataList ? this._dataList.assignedSource : undefined)) {
      if (!!this._pageValidation) {
        this._pageValidation.cancelPendingMove();
        this._pageValidation.clearRecords();
      }
      this.currentRecordIndex = -1;
      this.announcedRecordIndex = -1;
      this.isCurrentRecordOfOldSource = true;
      this.pendingVisibleIndex = undefined;
      this.heldRemoveTargets = undefined;
    }
    const list = this.dataList;
    if (list.assignedSource === newValue) {
      // Assigned again: the question claims an in-memory source written by position (changeSourceWriter).
      list.assignSource(newValue);
      this.onSourceCapabilitiesChanged();
      return;
    }
    const wasRemote = list.isRemote;
    /* The list resets its window and starts the first read. The two flags the questions need are
       already on it: isViewFrozenOnEdit (the membership of a view may not be re-decided by an edit
       made through one of the objects it materialized) is set when the list is created and holds for
       a remote source unchanged, and isReadThrough stays on but covers the question's own storage
       only. An assigned source is read, not read through, whatever its class - an
       ArrayDynamicDataSource and a SurveyDataDynamicDataSource included: the question is not told
       when the developer's array changes, so that change is seen after refreshDataSource() and
       not at once. The list reads through again after a detach. Because of the frozen membership,
       refreshView() on a source that pages has to be a refresh(): the server decides which records
       are in the window, so re-deciding the view means re-reading it (see
       DynamicDataPagingController.refreshView). */
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
     submitted data. */
  /* The answer stays when another question that has no data source stores the same value name: it
     is that question's answer, and a detach shows it here again. */
  private clearValueInSurveyData(): void {
    if (!this.data || this.isValueEmpty(this.data.getValue(this.getValueName()))) return;
    if (this.isValueStoredByAnotherQuestion()) return;
    this.data.setValue(this.getValueName(), undefined, false, true, this.name);
  }
  private isValueStoredByAnotherQuestion(): boolean {
    if (!this.survey) return false;
    return this.survey.getQuestionsByValueName(this.getValueName()).some((question: IQuestion): boolean =>
      question !== this && !(question instanceof QuestionRecordsModel && question.isRemoteData));
  }
  // Detaching: the window is dropped and the question reads the survey hash again.
  private restoreValueFromSurveyData(): void {
    this.updateValueFromSurvey(!!this.data ? this.data.getValue(this.getValueName()) : undefined);
  }
  /* A rejected read leaves the short window and its focused item in place: the kept position goes,
     and so does the position a move went to - the current object stays the one of the window in
     force. */
  private onSourceError(error: any, operation: DynamicDataOperation): void {
    if (operation === "read") {
      this.forgetFocusIndex();
      this.pendingVisibleIndex = undefined;
    } else if (!!this.reportedWritesSurvey) {
      this.hasRejectedWrite = true;
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
    this.runAssignmentOfKind(false, (): void => { super.updateValueFromSurvey(newValue, clearData); });
  }
  /* The list side of an assignment is the begin/end pair below: every assignment of the value passes
     through here. The subclasses do their own work in two hooks - inside the list-side pair
     (onRecordsValueStored) and after it (onRecordsValueAssigned) - and update isAnswered there, after
     that work: the value is stored with updateIsAnswered = false, whatever the caller passed. */
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly). A value that is not
    // an array is kept as it is - a keyed answer is never turned into one.
    const oldValue = this.getStoredRecords();
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : oldValue;
    const assignment = this.beginValueAssignment(newValue, oldRecords);
    super.setQuestionValue(newValue, false);
    this.onRecordsValueStored();
    this.endValueAssignment(assignment, oldRecords);
    if (!this.isAssigningOwnValue) {
      const newRecords = this.getStoredRecords();
      this.followHiddenAnswerStatesOnAssignment(Array.isArray(oldRecords) ? oldRecords.length : 0, Array.isArray(newRecords) ? newRecords.length : 0);
    }
    this.onRecordsValueAssigned(oldRecords);
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
     Begin answers nothing for the first two and allocates nothing. The list is not created for any
     of this.
     The state is handed back in by setQuestionValue, never kept in a field: an assignment made from
     inside another one - a valueChangedCallback that writes through the list - runs both halves of
     its own in between. */
  private beginValueAssignment(newValue: any, oldRecords: any): IDynamicDataValueAssignment {
    if (this.isAssigningOwnValue) return undefined;
    if (this.isOwnWriteOpen) {
      this.oweOutsideAssignment(newValue, oldRecords);
      return undefined;
    }
    const list = this._dataList;
    if (!list) return undefined;
    return { created: list.hasView ? list.getCreatedIndexes() : undefined };
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
    this.decideViewAgain(assignment.created, oldRecords, this.isTouchedSetDropped());
  }
  /* The view is decided again over the records as they are now, and the objects follow: created and
     oldRecords are what the view and the value were before the assignment (see
     IDynamicDataValueAssignment). The records the respondent touched keep their places: the list
     gets the remap of the assignment, built once and only when there are touched records, and the
     edited set follows the same remap. areRecordsReplaced: false for a change that replaced no record
     (the row titles of the fixed matrix) - the edited set stays and a pending page move is kept. */
  protected decideViewAgain(created: Array<number>, oldRecords: any, isTouchedSetDropped: boolean, areRecordsReplaced: boolean = true): void {
    if (areRecordsReplaced)this.heldRemoveTargets = undefined;
    const list = this._dataList;
    let remap: (index: number) => number = undefined;
    if (!isTouchedSetDropped && list.hasTouchedRecords) {
      remap = this.createAssignmentRemap(oldRecords, this.getStoredRecords());
    }
    list.invalidateViews(remap, !!created ? created : undefined);
    this.syncPagingState();
    if (this.isPagedByList && areRecordsReplaced) {
      this.followReplacedRecords(oldRecords, (): ((index: number) => number) =>
        remap || (remap = this.createAssignmentRemap(oldRecords, this.getStoredRecords())));
    }
    const isMembershipChanged = created === null
      ? list.hasView && this.isPageStale()
      : !!created && !Helpers.isTwoValueEquals(created, list.getCreatedIndexes());
    if (isMembershipChanged) {
      this.followRecordsWithObjects((recordIndex: number): void => { this.appendItemForRecord(recordIndex); });
    }
    if (!this.isPagedByList) return;
    // The page is rebuilt when it names other records than its objects hold now.
    if (this.isPageStale()) {
      this.rebuildFromDataList(false);
    }
  }
  /* The record indexes kept besides the records follow an assignment from outside, for a list that
     pages in memory: the edited set and the nested states follow the records they name across the
     insert, remove or move the assignment made (DynamicDataPageValidation.onRecordsReplaced), the
     records the objects were built for move with them, and a move that waits for its validators is
     dropped. It runs before any rebuild: a rebuild keeps the nested states of the objects it replaces
     under the records they were built for, and the new objects read them under their own. */
  private followReplacedRecords(oldRecords: any, getRemap: () => ((index: number) => number)): void {
    const validation = this._pageValidation;
    if (!!validation) {
      validation.cancelPendingMove();
    }
    this.followKeptRecordIndexes(getRemap, (validation: DynamicDataPageValidation, remap: (index: number) => number): void => {
      const newRecords = this.getStoredRecords();
      validation.onRecordsReplaced(Array.isArray(oldRecords) ? oldRecords : [], Array.isArray(newRecords) ? newRecords : [], remap);
    });
  }
  /* A reload - survey.data =, setData, mergeData, survey.clear(), each of which assigns under the
     survey's data pass - and clearValue() start over: the records the respondent touched are decided
     again like every other record. */
  private isTouchedSetDropped(): boolean {
    return this.isClearingValue || !!this.survey && this.survey.isSettingData();
  }
  /* Where each record of an assignment from outside went: the new index of an old record, -1 for a
     removed one, undefined for one it cannot place. The records of an array answer are compared by
     key, or by content (getReplacedRecordsRemap); the fixed matrix answers for its keyed answer. */
  protected createAssignmentRemap(oldRecords: any, newRecords: any): (index: number) => number {
    const list = this._dataList;
    return getReplacedRecordsRemap(Array.isArray(oldRecords) ? oldRecords : [], Array.isArray(newRecords) ? newRecords : [],
      !!list ? list.keyField : undefined);
  }
  /* A write of a record by one of its questions. A question the respondent answers (hasInput) touches
     the record - and so does code that assigns it, setValueExpression and a trigger included: the
     write does not say where it came from. A value an expression computes does not, or every record
     with an expression would be touched by its first recalculation. */
  // The values the objects' setValueExpression and resetValueIf compute are not edits (runComputedWrites).
  public runTriggers(name: string, value: any, keys?: any): void {
    super.runTriggers(name, value, keys);
    this.runComputedWrites((): void => { this.runTriggersInObjects(name, value, keys); });
  }
  protected abstract runTriggersInObjects(name: string, value: any, keys: any): void;
  protected markRecordTouchedBy(recordIndex: number, question: Question): void {
    if (!question || !question.hasInput) return;
    this.dataList.markRecordTouched(recordIndex);
  }
  // The question of an object - a cell, a detail or panel question - that writes a record field: a
  // field is a value name, or its comment key.
  protected getRecordFieldQuestion(item: QuestionRecordItem, field: string): Question {
    if (!item || !field) return undefined;
    const suffix = settings.commentSuffix;
    const name = field.endsWith(suffix) ? field.substring(0, field.length - suffix.length) : field;
    return item.getQuestionsByValueName(name)[0] || undefined;
  }
  protected markRecordTouchedByField(recordIndex: number, item: QuestionRecordItem, field: string): void {
    this.markRecordTouchedBy(recordIndex, this.getRecordFieldQuestion(item, field));
  }
  // The question's add: the records it inserts are touched as they enter the list. Nothing is created
  // for it: without a list there is no view to keep them in.
  protected runRecordAdd<T>(func: () => T): T {
    const list = this.dataListValue;
    return !!list ? list.runAddScope(func) : func();
  }
  /* The records were replaced by a change of what defines them - the rows of the fixed matrix - and
     the question knows where each one went: the remap gives the new index of an old record, -1 for
     one that is gone. The edited set, the states kept for nested paged questions and the record
     indexes the question keeps besides them follow, and the list decides its views again over the new
     records - a touched record follows the remap, a removed one leaves the touched set - and the page
     state follows. Nothing is created for it, and the remap is asked for once, only when something
     keeps record indexes. */
  protected followRemappedRecords(createRemap: () => ((index: number) => number)): void {
    let remap: (index: number) => number = undefined;
    const getRemap = (): ((index: number) => number) => remap || (remap = createRemap());
    const validation = this._pageValidation;
    if (!!validation) {
      validation.cancelPendingMove();
    }
    this.followKeptRecordIndexes(getRemap, (validation: DynamicDataPageValidation, remap: (index: number) => number): void => {
      validation.onRecordRemap(remap);
    });
    const list = this._dataList;
    if (!list) return;
    list.invalidateViews(list.hasTouchedRecords ? getRemap() : undefined);
    this.syncPagingState();
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
    return this.runOwnRecordsChange((): T => {
      this.recordWriteDepth++;
      try {
        return func();
      } finally {
        this.recordWriteDepth--;
        if (this.recordWriteDepth === 0)this.disposeItemsLeftByWrites();
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
  private ownRecordsChangeDepth: number = 0;
  private owedAssignment: IDynamicDataValueAssignment = undefined;
  private outsideAssignmentCountValue: number = 0;
  protected get outsideAssignmentCount(): number {
    return this.outsideAssignmentCountValue;
  }
  protected runOwnRecordsChange<T>(func: () => T): T {
    this.ownRecordsChangeDepth++;
    try {
      return func();
    } finally {
      this.ownRecordsChangeDepth--;
      if (this.ownRecordsChangeDepth === 0 && !!this.owedAssignment && !(!!this._dataList && this._dataList.isWriteOpen)) {
        this.followOwedAssignment();
      }
    }
  }
  private get isOwnWriteOpen(): boolean {
    return this.ownRecordsChangeDepth > 0 || !!this._dataList && this._dataList.isWriteOpen;
  }
  /* Owed before the value is stored: a handler that throws after storing it still leaves it owed. The
     view and the records before the first owed assignment are what the follow-up compares with. */
  private oweOutsideAssignment(newValue: any, oldRecords: any): void {
    if (Helpers.isTwoValueEquals(this.getStoredRecords(), newValue)) return;
    const isTouchedSetDropped = this.isTouchedSetDropped();
    if (!!this.owedAssignment) {
      this.owedAssignment.isTouchedSetDropped = this.owedAssignment.isTouchedSetDropped || isTouchedSetDropped;
      return;
    }
    const list = this._dataList;
    const canReadView = !!list && !list.isWriting;
    this.owedAssignment = { created: !canReadView ? null : list.hasView ? list.getCreatedIndexes() : undefined, oldRecords: oldRecords,
      isTouchedSetDropped: isTouchedSetDropped };
  }
  // The outermost write of the list has ended (IDynamicDataOwner.onWriteEnded).
  private onListWriteEnded(): void {
    if (this.ownRecordsChangeDepth > 0 || !this.owedAssignment) return;
    this.followOwedAssignment();
  }
  private followOwedAssignment(): void {
    const owed = this.owedAssignment;
    this.owedAssignment = undefined;
    this.outsideAssignmentCountValue++;
    this.followOutsideAssignment((): void => {
      if (!!this._dataList) {
        this.decideViewAgain(owed.created, owed.oldRecords, owed.isTouchedSetDropped);
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
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      const recordIndex = !!list ? list.materializedIndexToIndex(i) : i;
      const newRecord = this.getAssignedRecord(newRecords, recordIndex);
      if (isEveryChanged || newRecord === undefined && this.isItemWithoutRecordRefreshed() ||
        QuestionRecordsModel.isRecordChanged(this.getRecordInValue(oldRecords, recordIndex), newRecord)) {
        item.updateFromRecord(newRecord);
      }
    }
  }
  private static isRecordChanged(oldRecord: any, newRecord: any): boolean {
    if (oldRecord === newRecord && oldRecord !== undefined) return true;
    return DynamicDataList.isValueChanged(newRecord, oldRecord);
  }
  /* The record at a record index in a value of the question: by index in an array answer. The fixed
     matrix keys its answer by row name. */
  protected getRecordInValue(value: any, recordIndex: number): any {
    return Array.isArray(value) && recordIndex > -1 ? value[recordIndex] : undefined;
  }
  /* The record an object shows after an assignment: the record the value holds there. The dynamic
     matrix pads a row past the value with its default record; the record the object showed before
     is compared as the value held it. */
  protected getAssignedRecord(value: any, recordIndex: number): any {
    return this.getRecordInValue(value, recordIndex);
  }
  /* An object whose record the assigned value does not hold is refreshed by every assignment from
     outside, although it had no record before either: one updateFromRecord(undefined) per such object.
     The fixed matrix answers true - a row exists whether or not the answer holds its record, and a row
     added at runtime runs its expressions only when it is refreshed. The dynamic questions answer
     false: their objects without a record are padding. */
  protected isItemWithoutRecordRefreshed(): boolean {
    return false;
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
    this.clearItemErrors();
  }
  protected clearItemErrors(): void {
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return;
      item.clearErrors();
    }
  }
  public getAllErrors(): Array<SurveyError> {
    return super.getAllErrors().concat(this.getItemErrors());
  }
  protected getItemErrors(): Array<SurveyError> {
    let res: Array<SurveyError> = [];
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
  private keepFocusIndexForRead(index: number): void {
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
    this.releaseDataWaits(false);
    this.cancelPendingPageMove();
    this.currentRecordIndex = -1;
    this.pendingVisibleIndex = undefined;
    this.owedAssignment = undefined;
    super.dispose();
    this.disposeItemsLeftByWrites();
    this.disposeRecordObjects();
    if (!!this.pagerActionsValue) {
      this.pagerActionsValue.dispose();
      this.pagerActionsValue = undefined;
    }
    if (!!this._dataList) {
      this._dataList.dispose();
    }
    this.reportPendingWrites();
  }
  // The objects that have to go before the list does.
  protected disposeRecordObjects(): void { }
  /* A rebuild can run inside a write one of the old objects' questions is making - the record it edits
     leaves the page - and that question still finishes its own setter after the rebuild returns. Such an
     object is disposed when the question's write ends, or with the question: a question disposed
     inside its own write disposes its objects at once. */
  private itemsToDisposeAfterWrite: Array<() => void> = [];
  protected disposeReplacedItem(dispose: () => void): void {
    if (this.isWritingRecords && !this.isDisposed) {
      this.itemsToDisposeAfterWrite.push(dispose);
      return;
    }
    this.disposeItemsLeftByWrites();
    dispose();
  }
  private disposeItemsLeftByWrites(): void {
    const left = this.itemsToDisposeAfterWrite;
    this.itemsToDisposeAfterWrite = [];
    left.forEach((dispose: () => void): void => dispose());
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

  /* A validation that answers through a callback - complete, the next page, the preview,
     validate(callback) - waits while the question's data is read or written: the records the source
     has not brought yet, or not taken yet, cannot be validated. The context waits for the question
     (addElement) until the list settles - its last read or write answered or failed, or a new source,
     or none, was assigned and its first read committed - then the question is validated again into
     it. A write that never settles keeps the context waiting, and so does a write of a replaced
     source that never settles (the new source is read after it); a disposed question releases it. A
     synchronous validation (isCurrentPageValid, validate() without a callback) answers at once, as
     before. */
  private dataWaits: Array<ValidationContext>;
  /* The question's own objects (validateRecordObjectsOfPage, the type's), then the question, then -
     when both passed - the records off the page (validateOffPage). */
  protected validateElementCore(context: ValidationContext): boolean {
    const isObjectsValid = this.validateRecordObjectsOfPage(context);
    const res = super.validateElementCore(context) && isObjectsValid && this.validateOffPage(context);
    this.waitForDataOperations(context);
    return res;
  }
  protected validateRecordObjectsOfPage(context: ValidationContext): boolean {
    return true;
  }
  private get dataWaitId(): string {
    return this.id + "_data";
  }
  private waitForDataOperations(context: ValidationContext): void {
    if (!context.hasCallback || context.isOnValueChanged || context.isOnValueChanging || !this.isDynamicDataRunning) return;
    if (!this.dataWaits)this.dataWaits = [];
    if (this.dataWaits.indexOf(context) > -1) return;
    this.dataWaits.push(context);
    context.addElement(this.dataWaitId);
  }
  /* IDynamicDataOwner.onDataSettled, and the end of setDataSource. The survey is told too: a
     completion it holds for this question's writes goes on. */
  private onDataSettled(): void {
    if (this.isAssigningDataSource) return;
    try {
      if (!!this.dataWaits && !this.isDynamicDataRunning) {
        this.releaseDataWaits(true);
      }
    } finally {
      this.reportPendingWrites();
    }
  }
  // A write the assigned source has not answered.
  private get isWritingToSource(): boolean {
    const list = this._dataList;
    return !!list && list.isRemote && list.hasPendingWrites;
  }
  /* The survey keeps the records questions that have unanswered writes, and a completion waits for
     them (ISurveyDynamicDataWrites). It is told when the first write starts (IDynamicDataOwner.
     onWritesStarted) and when the writes have settled with everything else the source was asked
     for, as the validation waits for. A disposed question and one that leaves its survey are taken
     off. reportedWritesSurvey is the survey that was told the question writes. */
  private reportedWritesSurvey: ISurvey;
  // A write reported to the survey was rejected by the source (onSourceError).
  private hasRejectedWrite: boolean;
  private reportPendingWrites(): void {
    const survey = !this.isDisposed && this.isWritingToSource ? this.survey : undefined;
    const reported = this.reportedWritesSurvey;
    if (survey === reported) return;
    this.reportedWritesSurvey = survey;
    const isFailed = !!this.hasRejectedWrite;
    this.hasRejectedWrite = false;
    const oldWrites = getSurveyDynamicDataWrites(reported);
    if (!!oldWrites) oldWrites.dynamicDataWritesChanged(this, false, isFailed);
    const newWrites = getSurveyDynamicDataWrites(survey);
    if (!!newWrites) newWrites.dynamicDataWritesChanged(this, true);
  }
  private onWritesStarted(): void {
    if (!this.reportedWritesSurvey)this.reportPendingWrites();
  }
  protected setSurveyCore(value: ISurvey): void {
    super.setSurveyCore(value);
    if (this.reportedWritesSurvey !== undefined && this.reportedWritesSurvey !== value)this.reportPendingWrites();
  }
  /* Every held context is released, also when the validation of one throws: the first error is
     rethrown once all of them are released. */
  private releaseDataWaits(isValidated: boolean): void {
    const waits = this.dataWaits;
    this.dataWaits = undefined;
    if (!waits) return;
    let error: { error: any } = undefined;
    waits.forEach((context: ValidationContext): void => {
      try {
        if (isValidated) {
          this.validateElement(context);
        }
      } catch(e) {
        if (!error) error = { error: e };
      } finally {
        context.removeElement(this.dataWaitId);
      }
    });
    if (!!error) throw error.error;
  }
  // Objects that were never built were never shown: there is nothing the respondent could have left
  // invalid, and validating them would build them.
  protected validatePageObjects(context: ValidationContext): boolean {
    return !this.areObjectsBuilt() || this.validateBuiltPageObjects(context);
  }

  // The specialization hooks: what every records question answers.
  /* The records the list works with: the question's own storage, given to
     DynamicDataList.createReadThrough once. */
  protected abstract getListRecords(): Array<any>;
  // operations: the writes the default source made (DynamicDataOperation names), in order.
  protected abstract setListRecords(records: Array<any>, operations: Array<DynamicDataOperation>): void;
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
  // The question's own objects on the page, once they are built; the rest of the page validation is shared.
  protected abstract validateBuiltPageObjects(context: ValidationContext): boolean;
  /* One record of getRecordsDisplayValue, formatted in place: item is the object that holds it, and a
     record without one is formatted through the question's templates. */
  protected abstract getRecordDisplayValue(keysAsText: boolean, item: QuestionRecordItem, record: any, recordIndex: number): any;
  /* The keys of one record that no question of the type stores - for verifyRecordsUnknownKeys and the
     clean-ups -, with or without the record's object: the walk is shared, the rule for a key
     (comments, totals, shared questions) is the type's (isRecordKeyUnknown). */
  protected getRecordUnknownKeys(recordIndex: number, record: any, item: QuestionRecordItem): Array<string> {
    if (!Helpers.isValueObject(record, true)) return [];
    return Object.keys(record).filter((key: string): boolean => this.isRecordKeyUnknown(key, recordIndex, item));
  }
  protected abstract isRecordKeyUnknown(key: string, recordIndex: number, item: QuestionRecordItem): boolean;
  /* One record of the question's own storage (see getListRecordAt), without composing the array. The
     matrix pads question.value up to rowCount with defaultRecord, else the default row value. */
  protected abstract getStoredRecordAt(index: number, defaultRecord?: any): any;
  // The removal hooks (removeResolvedRecord). The object's created position in its array: the rows, the panels.
  protected abstract getItemPosition(item: QuestionRecordItem): number;
  // The object leaves its array at removal.position, and the type does what it does right after its splice.
  protected abstract detachItem(removal: IRecordRemoval): void;
  // The storage write of a removal, in the type's wrapper; refill runs exactly once, where the type decides.
  protected abstract removeStoredRecord(removal: IRecordRemoval, refill: () => void): void;
  // What a duplicate is among the records; asked only when the records without an object are scanned.
  protected abstract getRecordUniqueness(): IDynamicDataRecordUniqueness;
  // The property the authored page size is stored under (see pageSize).
  protected abstract getPageSizePropertyName(): string;
  // The property the record visibility expression is stored under (rowsVisibleIf, templateVisibleIf).
  protected abstract getRecordVisibleIfPropertyName(): string;
  // The number of objects one page may hold (settings.matrix.maxRowCount, settings.panel.maxPanelCount).
  protected abstract get maxRecordsPerPage(): number;
  // The objects, by created position (getItemByRecordIndex looks them up by record).
  public abstract getItem(index: number): QuestionRecordItem;
  // An object the question shows: a hidden one reports no errors (see getAllErrors).
  protected abstract isItemVisible(item: QuestionRecordItem): boolean;
  // The record an item - a row, a panel - reads and writes.
  public abstract getItemData(item: ISurveyData): any;
  /* The index of the item record in the question storage. It is the only index two questions bound
     to one value share: they may create objects for a different set of records (a filtered list) or
     in a different order (a sorted one). */
  protected abstract getItemRecordIndex(item: ISurveyData): number;
  // The value an item's {matrix} / {panel} variable reads.
  public abstract getFilteredData(): any;
  /* A write of an item's record: val is the field value for a panel and the whole proposed row for a
     matrix row (see QuestionRecordItem.prepareRecordWrite). */
  // A refused or ignored write never reaches it (writeItemValue).
  public abstract updateItemValue(item: ISurveyData, name: string, val: any, isDeletingValue: boolean): void;
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
  // The item {matrix[index].x} / {panel[index].x} reads. index is a record index; a record without a
  // row or a panel - filtered out, off the page or not built - is read as a value.
  protected abstract getExpressionItem(index: number): QuestionRecordItem;
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
  /* The record counts a read needs, peeked: the list's when it exists, the storage's otherwise - a
     read never creates the list. loadedRecordCount: the records that can be looked at (a source that
     pages itself holds one window); storedRecordCount: the count of the records, the total of such a source. */
  protected get loadedRecordCount(): number {
    const list = this.dataListValue;
    return !!list ? list.loadedCount : this.getListRecordCount();
  }
  protected get storedRecordCount(): number {
    const list = this.dataListValue;
    return !!list ? list.count : this.getListRecordCount();
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
  /* Record indexes the question keeps besides the edited set and the current record: the records its
     objects were built for, while a question nested in one of them pages - its state is kept under that
     record (keepNestedPageStates). A read that commits again renumbers them with its remap, so that the
     states follow their records. */
  protected hasKeptRecordIndexes(): boolean {
    for (let i = 0; ; i++) {
      const item = this.getItem(i);
      if (!item) return false;
      const questions = this.getNestedStateQuestions(item);
      if (!!questions && this.hasPagedQuestions(questions)) return true;
    }
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
     incremental path. */
  protected appendItemForRecord(recordIndex: number): void {
    this.rebuildFromDataList(false);
  }
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
      const item = getRecordItemOwner(<QuestionRecordsModel>this.question).getExpressionItem(index);
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
    return !!data ? getRecordItemOwner(data).getItemByVisibleIndex(index) : null;
  }
  // The position among the visible records of the whole list, not among the objects of the page.
  protected get visibleIndex(): number {
    const data = this.item.data;
    return !!data ? getRecordItemOwner(data).getItemVisibleIndex(this.item) : -1;
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

  protected isSettingValue: boolean = false;
  private textPreProcessor: TextContextProcessor;
  constructor(public data: QuestionRecordsModel) {
    this.textPreProcessor = new TextContextProcessor(this);
  }
  // The record this object holds, and its position among the visible records of the whole view: the
  // question's lookups are protected (IRecordItemOwner).
  protected getOwnRecordIndex(): number {
    return getRecordItemOwner(this.data).getItemRecordIndex(this);
  }
  protected getOwnVisibleIndex(): number {
    return getRecordItemOwner(this.data).getItemVisibleIndex(this);
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
    if (!getRecordItemOwner(this.data).writeItemValue(this, fieldName, write.ownerValue, write.isDeleting)) return;
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
    const index = this.getOwnRecordIndex();
    if (index < 0) return;
    const bindedQuestions = this.data.getBindedQuestions();
    bindedQuestions.forEach((q: IQuestion) => {
      if (q === this.data || !(q instanceof QuestionRecordsModel)) return;
      const item = getRecordItemOwner(q).getItemByRecordIndex(index);
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
    return !!this.data ? getRecordItemOwner(this.data).getItemPageVisibleIndex(this) : -1;
  }
  // The 0-based number the respondent sees for this object's record (getRecordNumberOf).
  protected getOwnRecordNumber(): number {
    return getRecordNumberOf(this);
  }
  // The rule of the owner for a key of this object's record (getRecordUnknownKeys).
  protected isOwnRecordKeyUnknown(key: string): boolean {
    return getRecordItemOwner(this.data).isRecordKeyUnknown(key, this.getOwnRecordIndex(), this);
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
// The visibility flags of an input in a record (clearHiddenAnswersWithoutObjects).
const HIDDEN_ANSWER_SELF = 1;
const HIDDEN_ANSWER_CONTAINER = 2;
function getHiddenAnswerFlags(isSelfVisible: boolean, isVisible: (el: PanelModelBase) => boolean, q: Question, container: PanelModelBase): number {
  let isContainerVisible = true;
  for (let el = <PanelModelBase><any>q.parent; isContainerVisible && !!el && el !== container && !el.isPage; el = <PanelModelBase><any>el.parent) {
    isContainerVisible = isVisible(el);
  }
  return (isSelfVisible ? HIDDEN_ANSWER_SELF : 0) | (isContainerVisible ? HIDDEN_ANSWER_CONTAINER : 0);
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
// A temporary row or panel of the records clean-up (createRecordCleanupObject).
export interface IRecordCleanupObject {
  item: ISurveyData;
  runCondition(properties: HashTable<any>): void;
  clearIncorrectValues(): void;
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
    return getRecordItemOwner(this.recordsQuestion).getRecordAddText();
  }
  public singleInputAddItemCore(): void {
    getRecordItemOwner(this.recordsQuestion).addRecordFromUI();
  }
  protected abstract getRecords(): Array<TRecord>;
  // Not always a record: the lookup is also asked for the question itself and for its parents.
  protected abstract getRecordOfQuestion(question: Question): TRecord;
  protected abstract isRecordValid(record: TRecord): boolean;

  // Single-input mode is its own paging and walks every record: the list is told before they are read.
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    getRecordItemOwner(this.recordsQuestion).syncPageSizeWithMode();
    return super.getSingleInputQuestionsCore(question, checkDynamic);
  }
  // The steps of a question that adds and removes records: the questions of every record that is
  // empty or invalid, the questions of the current record when it is complete, and the summary.
  protected getDynamicSingleInputQuestions(question: Question, checkDynamic: boolean): Array<Question> {
    getRecordItemOwner(this.recordsQuestion).syncPageSizeWithMode();
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
    getRecordItemOwner(this.recordsQuestion).syncPageSizeWithMode();
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
