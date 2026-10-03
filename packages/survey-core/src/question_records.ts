import { Base } from "./base";
import { IProgressInfo, ISurveyData } from "./base-interfaces";
import { property } from "./decorators";
import { HashTable, Helpers } from "./helpers";
import { Question, ValidationContext } from "./question";
import { settings } from "./settings";
import { isFocusInsideOrIdle } from "./utils/focus-utils";
import { DynamicItemModelBase, DynamicRecordItem } from "./dynamicItemModelBase";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import {
  DynamicDataFieldType, DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataSource
} from "./dynamic-data/dynamic-data-interfaces";
import {
  DynamicDataPageValidation, IDynamicDataPageState, IDynamicDataPageValidationOwner, findDuplicatePages, getReplacedRecordsRemap
} from "./dynamic-data/dynamic-data-page-validation";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "./dynamic-data/dynamic-data-paging";
import { applyRecordChange } from "./dynamic-data/dynamic-data-record-remap";
import { IDynamicDataRecordScope } from "./dynamic-data/dynamic-data-record-visibility";

export interface IDynamicDataRecordUniqueness {
  // The record keys whose values have to be unique; empty when none has to be.
  fields: Array<string>;
  // false: strings compare with toLocaleLowerCase.
  caseSensitive: boolean;
  // Owner-hidden records take part too.
  includeHidden: boolean;
}
export interface IDynamicDataRecordVisibilityRule {
  expression: string;
  // Called only when the expression runs.
  createScope: () => IDynamicDataRecordScope;
}
// What a value assignment takes before the value is stored and hands back after it (see
// QuestionRecordsModel.beginValueAssignment).
interface IDynamicDataValueAssignment {
  created: Array<number>;
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
   the page validation. Rows, panels, columns and templates are the subclasses' terms. A question
   that never creates a record list - the matrix with fixed rows - is one too; the list-side code
   then never calls the hooks.
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
        (): number => this.getListRecordCount());
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
     rebuild disposes them. Replacing the source starts over (see assignDataSource). */
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
     table would work in page-local terms. Off in design mode and without a list, so the matrix with
     fixed rows never pages. */
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
      if (!(item instanceof DynamicItemModelBase) || item.builtRecordIndex !== records[i]) return true;
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
      if (item instanceof DynamicItemModelBase && item.builtRecordIndex > -1) {
        const to = remap(item.builtRecordIndex);
        item.builtRecordIndex = to === undefined ? -1 : to;
      }
    }
  }
  /* Three indexes: the record index names the record, visibleIndex is its position among the visible
     records of the whole list (the list's globalVisibleIndex; what the respondent navigates by),
     pageVisibleIndex its position among the visible objects; visibleIndex = pageStartVisibleIndex +
     pageVisibleIndex. 0 without a list. */
  protected get pageStartVisibleIndex(): number {
    return !!this.dataListValue ? this.dataListValue.getPageStartGlobalVisibleIndex() : 0;
  }
  // IDynamicItemModelData: the window offset of a data source that pages itself (see rowIndex,
  // getIndex); 0 without one.
  public getRecordNumberOffset(): number {
    return !!this.dataListValue ? this.dataListValue.getRecordNumberOffset() : 0;
  }
  /* The record-item halves of IDynamicItemModelData.getItemVisibleIndex and getItemByVisibleIndex.
     A record the page does not show has no object: its position among the visible records of the
     whole list, and the record at such a position, are the list's to answer. */
  protected getRecordItemVisibleIndex(item: ISurveyData): number {
    if (!(item instanceof DynamicRecordItem) || !this.dataListValue) return -1;
    return this.dataListValue.getGlobalVisibleIndex(item.getIndex());
  }
  protected getRecordItemByVisibleIndex(visibleIndex: number): DynamicRecordItem {
    if (!this.isPagingActive) return null;
    const recordIndex = this.dataListValue.getIndexAtGlobalVisibleIndex(visibleIndex);
    return recordIndex < 0 ? null : this.createRecordItem(recordIndex);
  }
  /* The view half of IDynamicExpressionItemOwner.getExpressionItem: index names a record, and a record
     without an object - filtered out, off the page or not built - is read as a value. */
  protected getViewExpressionItem(index: number): DynamicItemModelBase {
    const item = this.getItemByRecordIndex(index);
    if (!!item) return item;
    return index < this.dataListValue.loadedCount ? this.createRecordItem(index) : null;
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
    return this.pageValidation.validateEditedRecords(context, this.getOffPageDuplicatePages());
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
  // Layer 1 is on: design mode never validates a page leave.
  private isPageLeaveValidated(): boolean {
    if (this.isDesignMode) return false;
    return !this.survey || !this.validationCallbacks.canLeavePageWithErrors;
  }

  /* rowsVisibleIf / templateVisibleIf under paging (Andrew's decision 2026-09-25): a page is a slice
     of the VISIBLE records, so the condition is evaluated over every record without an object and
     the list's hidden flags are written from it (DynamicDataRecordVisibility). The rule is asked
     only past the guards, and before areInvisibleElementsShowing is applied: the survey's
     onExpressionRunning fires in that mode too. A flag that changed changes the page count, which
     the list does not announce: the question syncs it. Returns whether a flag changed. */
  protected updatePagedRecordsVisibility(properties: HashTable<any>): boolean {
    // isPagingActive is false in design mode.
    if (!this.isPagingActive || this.isLoadingFromJson) return false;
    const rule = this.getRecordVisibilityRule(properties);
    const isChanged = this._dataList.updateRecordsVisibility(this.areInvisibleElementsShowing ? "" : rule.expression,
      (index: number): any => this.getListRecordAt(index), rule.createScope);
    if (isChanged) {
      this.syncPagingState();
    }
    return isChanged;
  }

  /* The capabilities of a data source are declared by the presence of its optional methods: a source
     without insert gets no add button, one without remove no delete button, one without move no drag
     handles, and one without update makes every object read-only - a silently unsaved edit is worse
     than a disabled field, and an application that wants local-only edits over remote reads
     implements a no-op update. A question without a data source has every capability. The list is
     not created for the answer. */
  protected canWriteRecords(operation: DynamicDataOperation): boolean {
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
  // What the question reports. A zero-based page index; always 0 while paging is off.
  protected get reportedPageIndex(): number {
    return this.isPagingActive ? this.paging.pageIndex : 0;
  }
  // The number of pages; 1 for an empty question and for one that does not page.
  protected get reportedPageCount(): number {
    return this.isPagingActive ? this.paging.pageCount : 1;
  }

  // The survey-data side of the swap. The list keeps the assigned source (assignedSource), so there
  // is no getter here. The question follows the call with its own refresh, also for the same source.
  protected assignDataSource(val: IDynamicDataSource): void {
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
  // The value is stored and the list-side pair is still open.
  protected onRecordsValueStored(): void { }
  // The list-side pair is closed. oldRecords: a copy of the value the assignment replaced.
  protected onRecordsValueAssigned(oldRecords: any): void { }
  // The stored value, not the default: the records an assignment or a read replaces.
  protected getStoredRecords(): any {
    return this.getPropertyValueWithoutDefault("value");
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
  // The item at a position is focused once the objects of a committed read exist.
  protected abstract focusItemAfterRead(index: number): void;
  // The question's own objects on the page; the rest of the page validation is shared.
  protected abstract validatePageObjects(context: ValidationContext): boolean;
  /* One record as the question reads it without an object: the duplicate scan, the record
     visibility and the record items read through it. The matrix pads question.value up to rowCount
     with the default row value; a data source's window and a write in progress are the list's. */
  protected abstract getListRecordAt(index: number): any;
  // What a duplicate is among the records; asked only when the records without an object are scanned.
  protected abstract getRecordUniqueness(): IDynamicDataRecordUniqueness;
  /* rowsVisibleIf / templateVisibleIf over the records of a question that pages: the expression as
     the survey hands it out (survey.onExpressionRunning) and the scope it runs in. Asked once the
     guards of updatePagedRecordsVisibility have passed. */
  protected abstract getRecordVisibilityRule(properties: HashTable<any>): IDynamicDataRecordVisibilityRule;
  // The authored page size: rowsPerPage / panelsPerPage.
  protected abstract get pageSize(): number;
  /* The page size the list gets at runtime. Usually the authored one; a carousel pages one panel at
     a time whatever panelsPerPage says, and single-input mode is its own paging and builds every
     object. */
  protected abstract get listPageSize(): number;
  // The objects, by created position and by record.
  public abstract getItem(index: number): DynamicItemModelBase;
  public abstract getItemByRecordIndex(recordIndex: number): DynamicItemModelBase;
  // A record without an object, read as a value: the variable name and the context class are the
  // question's. The record-item lookups and the record visibility scope create it.
  protected abstract createRecordItem(recordIndex: number): DynamicRecordItem;

  // The specialization hooks with a default.
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
