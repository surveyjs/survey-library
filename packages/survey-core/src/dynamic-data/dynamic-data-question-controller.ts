import { ISurveyData } from "../base-interfaces";
import { DynamicItemModelBase, DynamicRecordItem, IDynamicItemModelData } from "../dynamicItemModelBase";
import { HashTable, Helpers } from "../helpers";
import { Question, ValidationContext } from "../question";
import { isFocusInsideOrIdle } from "../utils/focus-utils";
import {
  DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataSource
} from "./dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data-list";
import {
  DynamicDataPageValidation, IDynamicDataPageState, IDynamicDataPageValidationOwner, findDuplicatePages, getReplacedRecordsRemap
} from "./dynamic-data-page-validation";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "./dynamic-data-paging";
import { applyRecordChange } from "./dynamic-data-record-remap";
import { IDynamicDataRecordScope } from "./dynamic-data-record-visibility";

/* What a dynamic question supplies to the coordination it shares with the other one: where its
   records are stored, and what differs for rows and panels in the answer to a list change. They are
   methods of the question and not a closure literal, so that the question's own code calls the same
   members. */
export interface IDynamicDataQuestionHooks {
  // The question's own storage, given to DynamicDataList.createReadThrough once.
  getListRecords(): Array<any>;
  setListRecords(records: Array<any>): void;
  // Absent -> the record count is the length of getListRecords().
  getListRecordCount?(): number;
  getFields(): Array<IDynamicDataField>;

  isDataLoading: boolean;
  // Mirrors the paging state of the list into the question (see DynamicDataPagingController.syncState).
  syncPagingState(): void;
  // The objects are re-created for the records the view - under paging, the page - holds now.
  rebuildFromDataList(isPageMove: boolean): void;
  // A page of a source that pages itself was asked for: its objects arrive when the read commits.
  refreshRenderedPage(): void;
  // The objects exist: generated rows, panels built for the first time. Objects that do not exist
  // are never stale.
  areObjectsBuilt(): boolean;
  // A move does not carry the objects: they keep their positions and take the records of their
  // positions. Absent -> the objects follow their records.
  followRecordMove?(): void;
  // The stored value, not the default: the records an assignment or a read replaces.
  getStoredRecords(): any;
  // The loaded window becomes the question value; nothing is rebuilt.
  storeLoadedRecords(): void;
  // After a write to a data source was stored, before the conditions run; not guarded against
  // re-entrancy. Absent -> nothing to prepare.
  prepareRemoteWrite?(change: IDynamicDataListChange): void;
  // What a write to the survey would have re-run after that write; guarded by the controller.
  runRemoteWriteConditions(): void;
  // Record indexes the question keeps besides its objects and the edited set: a read that commits
  // again renumbers them with its remap. Absent -> the question keeps none.
  hasKeptRecordIndexes?(): boolean;
  remapKeptRecordIndexes?(remap: (index: number) => number): void;
  // The item at a position is focused once the objects of a committed read exist.
  focusItemAfterRead(index: number): void;
  // The one member of IDynamicDataPageValidationOwner that is about the question's own objects.
  validatePageObjects(context: ValidationContext): boolean;
  /* One record as the question reads it without an object: the duplicate scan, the record
     visibility and createRecordItem read through it. The matrix pads question.value up to rowCount
     with the default row value; a data source's window and a write in progress are the list's. */
  getListRecordAt(index: number): any;
  // A record without an object, read as a value: the variable name and the context class are the
  // question's.
  createRecordItem(recordIndex: number): DynamicRecordItem;
  // What a duplicate is among the records; asked only when the records without an object are scanned.
  getRecordUniqueness(): IDynamicDataRecordUniqueness;
  /* rowsVisibleIf / templateVisibleIf over the records of a question that pages: the expression as
     the survey hands it out (survey.onExpressionRunning) and the scope it runs in. Asked once the
     controller's guards have passed. */
  getRecordVisibilityRule(properties: HashTable<any>): IDynamicDataRecordVisibilityRule;
}
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
// The objects are read through the owner's IDynamicItemModelData: by created position and by record.
export type DynamicDataQuestionOwner = Question & IDynamicDataPagingOwner & IDynamicDataQuestionHooks
  & Pick<IDynamicItemModelData, "getItem" | "getItemByRecordIndex">;
// What a value assignment takes before the value is stored and hands back after it (see
// DynamicDataQuestionController.beginValueAssignment).
export interface IDynamicDataValueAssignment {
  created: Array<number>;
}

/* The coordination between a dynamic question and its list. Both dynamic questions need the same
   one and neither of them descends from the other, so it lives here and each question holds it by
   composition. The list computes (dynamic-data-list.ts), the question builds and renders its own
   rows or panels - its objects - and this class is what sits between the two: it creates and
   disposes the list and the question-side helpers, it is the owner of the list and of the page
   validation and answers the changes of the list, and it holds the question side of a
   caller-provided data source - the survey-data side of a source swap, the running state and the
   focus kept across a refill. The source itself, its capabilities and the loaded window belong to
   the list.
   It is created with the question. The list and the helpers are created on first use, and the
   ...Value getters never create.

   What a source does NOT change is where the records are kept while they are being edited:
   question.value is the loaded window, so the nested questions, the {row.x} / {panel.x} contexts,
   validation and getFilteredData keep working on exactly the records the respondent can see. What
   it does change is who owns them - see canSetValueToSurvey on the two questions. */
export class DynamicDataQuestionController implements IDynamicDataOwner, IDynamicDataPageValidationOwner {
  private _list: DynamicDataList;
  private _paging: DynamicDataPagingController;
  private _pageValidation: DynamicDataPageValidation;
  constructor(private owner: DynamicDataQuestionOwner) { }
  public get listValue(): DynamicDataList {
    return this._list;
  }
  public get list(): DynamicDataList {
    if (!this._list) {
      const owner = this.owner;
      // createReadThrough loads the list, which raises a reset before _list is assigned:
      // onDataListChanged drops it.
      this._list = DynamicDataList.createReadThrough(this,
        (): Array<any> => owner.getListRecords(),
        (records: Array<any>): void => { owner.setListRecords(records); },
        typeof owner.getListRecordCount === "function" ? (): number => owner.getListRecordCount() : undefined);
      this._list.onError = (error: any, operation: DynamicDataOperation): void => {
        this.onSourceError(error, operation);
      };
      // The list is created on demand, so a page size that came from JSON has to be pushed here and
      // not only from its setter.
      this.paging.updatePageSize();
    }
    return this._list;
  }
  /* The paging helper gets an accessor and not the list: the list is created on demand, and the
     helper is first used while the list is being created. */
  public get paging(): DynamicDataPagingController {
    if (!this._paging) {
      this._paging = new DynamicDataPagingController(this.owner, (): DynamicDataList => this.list);
    }
    return this._paging;
  }
  // The questions ask for what they need done (leavePage, validateOffPage, ...); _pageValidation is
  // the peek.
  private get pageValidation(): DynamicDataPageValidation {
    if (!this._pageValidation) {
      this._pageValidation = new DynamicDataPageValidation(this);
    }
    return this._pageValidation;
  }
  /* The list goes with the question: it drops its pending-request counter, so a page or a push that
     is still in flight cannot write into a question that is gone. */
  public dispose(): void {
    if (!!this._list) {
      this._list.dispose();
    }
  }

  // IDynamicDataOwner: the fields are the question's.
  public getFields(): Array<IDynamicDataField> {
    return this.owner.getFields();
  }
  /* A reset means the view was re-decided: a filter or a sort was assigned, or refreshView() was
     called. Which records have an object changes with it, so the objects are rebuilt.
     hasMaterializedView remembers that the objects were last built for a view: clearing the filter
     leaves hasView false and still has to rebuild. */
  private hasMaterializedView: boolean = false;
  public onDataListChanged(change: IDynamicDataListChange): void {
    const list = this._list;
    // The reset the list raises while it is being created.
    if (!list) return;
    const owner = this.owner;
    if (change.type === "loading") {
      owner.isDataLoading = change.isLoading;
      return;
    }
    if (change.type === "pageChanged") {
      this.forgetFocusIndex();
      owner.syncPagingState();
      /* The objects that exist are the page (prompt 15): a page the list cuts - from question.value
         or from everything a read() source answered with - is rebuilt at once, through the path a
         remote read takes. A page of a source that pages itself is rebuilt when its read commits. */
      if (this.isPagedByList) {
        owner.rebuildFromDataList(true);
      } else {
        owner.refreshRenderedPage();
      }
      return;
    }
    // The record indexes the question keeps - its objects' records, the edited set of layer 2 - name
    // a record only until something is inserted, removed or moved in front of it. Only a list that
    // pages in memory creates the edited set here.
    applyRecordChange(change, this.isPagedByList ? this.pageValidation : this._pageValidation,
      (remap: (index: number) => number): void => {
        if (change.type === "recordMoved" && typeof owner.followRecordMove === "function") {
          owner.followRecordMove();
        } else {
          this.remapBuiltItems(remap);
        }
      });
    /* A write the list pushed to a data source: with the array source over question.value the push
       IS the value write, a remote source has no such setter, so the question follows the window
       itself. The objects are not rebuilt - the one that was edited, added or removed is handled by
       the path that made the change. */
    if (list.isRemote && change.type !== "reset") {
      owner.storeLoadedRecords();
      if (typeof owner.prepareRemoteWrite === "function") {
        owner.prepareRemoteWrite(change);
      }
      this.runConditionsAfterRemoteWrite();
      return;
    }
    if (change.type !== "reset") return;
    owner.syncPagingState();
    const isRemote = list.isRemote;
    const hasView = list.hasView || isRemote || this.isPagingActive;
    if (!hasView && !this.hasMaterializedView) return;
    this.hasMaterializedView = hasView;
    if (isRemote) {
      this.commitLoadedRecords();
    } else {
      owner.rebuildFromDataList(false);
    }
  }
  /* A read committed: the loaded window becomes the question value. It is the inbound path - the
     value is stored, the survey hash is not written and no trigger, condition or navigation runs -
     and then the objects are rebuilt for the records the window holds. Nothing else may assign the
     value on a load. The position a refill kept is focused last: the objects it names exist now. */
  private commitLoadedRecords(): void {
    const owner = this.owner;
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly).
    const oldValue = owner.getStoredRecords();
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : oldValue;
    owner.storeLoadedRecords();
    this.followReloadedRecords(oldRecords);
    owner.rebuildFromDataList(false);
    const index = this.takeFocusIndexAfterRead();
    if (index > -1) {
      owner.focusItemAfterRead(index);
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
     rebuild disposes them. Replacing the source starts over (see assignSource). */
  private followReloadedRecords(oldRecords: any): void {
    if (!this.isPagedByList) return;
    const owner = this.owner;
    const validation = this._pageValidation;
    const hasRecords = !!validation && validation.hasRecords;
    if (!hasRecords && !(typeof owner.hasKeptRecordIndexes === "function" && owner.hasKeptRecordIndexes())) return;
    const newRecords = owner.getStoredRecords();
    const oldArray = Array.isArray(oldRecords) ? oldRecords : [];
    const newArray = Array.isArray(newRecords) ? newRecords : [];
    const remap = getReplacedRecordsRemap(oldArray, newArray, this._list.keyField);
    if (hasRecords) {
      validation.cancelPendingMove();
      validation.onRecordsReplaced(oldArray, newArray, remap);
    }
    if (typeof owner.remapKeptRecordIndexes === "function") {
      owner.remapKeptRecordIndexes(remap);
    }
  }
  /* With the array source over question.value a record write reaches the survey, and the survey then
     re-runs the conditions of every question - which is what recalculates an expression, a {row.x} or
     {panel.x} reference and the totals. A remote write never reaches the survey (canSetValueToSurvey
     on the questions), so the question runs its own. Re-entrancy is guarded and not forbidden for a
     reason: an expression writes its result back as a record field, and the nested run would only
     recompute what the outer one has just settled. */
  private isRunningRemoteWriteConditions: boolean = false;
  private runConditionsAfterRemoteWrite(): void {
    if (this.isRunningRemoteWriteConditions || !this.owner.data) return;
    this.isRunningRemoteWriteConditions = true;
    try {
      this.owner.runRemoteWriteConditions();
    } finally {
      this.isRunningRemoteWriteConditions = false;
    }
  }
  public get isPagingActive(): boolean {
    return !this.owner.isDesignMode && !!this._list && this._list.pageSize > 0;
  }
  /* The list cuts the page: over question.value, or over the whole storage a read() source answered
     with. Every record is in memory, so the page is a slice and layer 2 can track the edited
     records. Its opposite is a source with readRange (list.isPagedBySource): the window IS the page
     and the records of the other pages are on the server. */
  public get isPagedByList(): boolean {
    return this.isPagingActive && !this._list.isPagedBySource;
  }
  /* The objects are built for the records the list holds and not for 0 ... count-1. A remote window
     is a view of its own, because the count is the server total; a question that pages builds its
     objects for the page, so it takes the view path too. */
  public get hasView(): boolean {
    const list = this._list;
    return !!list && (list.hasView || this.hasMaterializedView || list.isRemote || this.isPagingActive);
  }
  /* The objects hold other records than the page names: a record became hidden or visible ahead of
     them, the page moved under them, or the records were replaced. The objects are read one by one:
     nothing is allocated for the answer. */
  public isPageStale(): boolean {
    const list = this._list;
    const owner = this.owner;
    if (!list || !owner.areObjectsBuilt()) return false;
    const records = list.getMaterializedIndexes();
    for (let i = 0; i < records.length; i++) {
      const item = owner.getItem(i);
      if (!(item instanceof DynamicItemModelBase) || item.builtRecordIndex !== records[i]) return true;
    }
    return !!owner.getItem(records.length);
  }
  /* The record indexes the objects were built for follow an insert, a remove or the records a read
     brought back. Every object is renumbered, also before the first build. An object whose record is
     gone - removed, or not found again by a reload - keeps -1: it is being disposed. */
  public remapBuiltItems(remap: (index: number) => number): void {
    const owner = this.owner;
    for (let i = 0; ; i++) {
      const item = owner.getItem(i);
      if (!item) return;
      if (item instanceof DynamicItemModelBase && item.builtRecordIndex > -1) {
        const to = remap(item.builtRecordIndex);
        item.builtRecordIndex = to === undefined ? -1 : to;
      }
    }
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
     The state goes back to the question and is handed in again, never kept here: an assignment made
     from inside another one - a valueChangedCallback that writes through the list - runs both halves
     of its own in between. */
  public beginValueAssignment(): IDynamicDataValueAssignment {
    const list = this._list;
    if (!list || list.isWriting) return undefined;
    return { created: list.hasView ? list.getCreatedIndexes() : undefined };
  }
  /* oldRecords: the question's copy of the value it replaced. The new records are read here and not
     passed in: the rebuild of a changed membership can write the value. */
  public endValueAssignment(assignment: IDynamicDataValueAssignment, oldRecords: any): void {
    const list = this._list;
    if (!list) return;
    list.invalidateViews();
    this.owner.syncPagingState();
    if (!assignment) return;
    if (!!assignment.created && !Helpers.isTwoValueEquals(assignment.created, list.getCreatedIndexes())) {
      this.owner.rebuildFromDataList(false);
    }
    if (!this.isPagedByList) return;
    this.onRecordsReplaced(oldRecords, this.owner.getStoredRecords());
    // The page is rebuilt when it names other records than its objects hold now.
    if (this.isPageStale()) {
      this.owner.rebuildFromDataList(false);
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
  /* The page size is decided by the question's mode as well - the display mode, single-input mode,
     design mode - and none of them tells the list: the points that depend on it re-read it here.
     Returns true when it changed. The list is not created for it. */
  public syncListPageSize(): boolean {
    if (!this._list || this.owner.isLoadingFromJson) return false;
    return this.paging.updatePageSizeIfChanged();
  }

  /* The record-item halves of IDynamicItemModelData.getItemVisibleIndex and getItemByVisibleIndex.
     A record the page does not show has no object: its position among the visible records of the
     whole list, and the record at such a position, are the list's to answer. */
  public getRecordItemVisibleIndex(item: ISurveyData): number {
    if (!(item instanceof DynamicRecordItem) || !this._list) return -1;
    return this._list.getGlobalVisibleIndex(item.getIndex());
  }
  public getRecordItemByVisibleIndex(visibleIndex: number): DynamicRecordItem {
    if (!this.isPagingActive) return null;
    const recordIndex = this._list.getIndexAtGlobalVisibleIndex(visibleIndex);
    return recordIndex < 0 ? null : this.owner.createRecordItem(recordIndex);
  }
  /* The view half of IDynamicExpressionItemOwner.getExpressionItem: index names a record, and a record
     without an object - filtered out, off the page or not built - is read as a value. */
  public getViewExpressionItem(index: number): DynamicItemModelBase {
    const item = this.owner.getItemByRecordIndex(index);
    if (!!item) return item;
    return index < this._list.loadedCount ? this.owner.createRecordItem(index) : null;
  }

  /* What a question that pages keeps for its records when an ancestor (a dynamic panel that pages)
     rebuilds the object holding it: undefined when the list does not page in memory, since a
     question that does not page validates every object anyway. */
  public getPageState(): IDynamicDataPageState {
    if (!this.isPagedByList) return undefined;
    return this.pageValidation.getState(this.paging.pageIndex);
  }
  // The page is kept as well: the respondent comes back to where they were.
  public setPageState(state: IDynamicDataPageState): void {
    if (!state) return;
    this.pageValidation.setState(state);
    if (state.pageIndex > 0) {
      this.paging.pageIndex = state.pageIndex;
    }
  }
  /* The ancestor side of the states above: what the paged questions nested in one record of this
     question keep while their objects are rebuilt (the dynamic panel's rebuild). Empty states clear
     the record's entry - and need no page validation to be created for that - while a record that
     has states creates it. */
  public keepNestedPageStates(recordIndex: number, states: { [valueName: string]: IDynamicDataPageState }): void {
    const validation = Object.keys(states).length > 0 ? this.pageValidation : this._pageValidation;
    if (!!validation) {
      validation.keepNestedStates(recordIndex, states);
    }
  }
  public getNestedPageStates(recordIndex: number): { [valueName: string]: IDynamicDataPageState } {
    return !!this._pageValidation ? this._pageValidation.getNestedStates(recordIndex) : undefined;
  }

  /* The page moves of DynamicDataPageValidation.leave: validate, clearIncorrectValues and
     validatedRecords are what carousel/tab Next and the panel's add pass instead of the page. */
  public leavePage(isForward: boolean, move: () => void, validate?: (context: ValidationContext) => boolean,
    clearIncorrectValues?: boolean, validatedRecords?: Array<number>): boolean {
    return this.pageValidation.leave(isForward, move, validate, clearIncorrectValues, validatedRecords);
  }
  // Nothing is created for it: without the page validation no move is pending.
  public cancelPendingPageMove(): void {
    if (!!this._pageValidation) {
      this._pageValidation.cancelPendingMove();
    }
  }
  // An inserted record is an edit layer 2 tracks (see DynamicDataPageValidation.markEdited).
  public markRecordEdited(recordIndex: number): void {
    this.pageValidation.markEdited(recordIndex);
  }
  /* Shows the page that holds a visible position - where an added record is, or the record carousel
     and tab mode keep showing - as a move from code: the add was validated already. prepare runs
     only when the page changes, before the move: the page change rebuilds the objects at once, and
     the rebuild has to find what the question set aside for it. Returns whether the page changed. */
  public showPageOfVisibleIndex(visibleIndex: number, prepare?: () => void): boolean {
    const list = this.list;
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
  public validateOffPage(context: ValidationContext): boolean {
    if (!this.isPagedByList || !context.fireCallback || context.isOnValueChanged) return true;
    return this.pageValidation.validateEditedRecords(context, this.getOffPageDuplicatePages());
  }
  /* The duplicates are looked for only when they are visited: the scan is O(records) per unique
     field, and a pair whose records both have no object has none the question's own check could put
     the error on. Returns the pages, without repeats; layer 2 walks them together with its own. */
  private getOffPageDuplicatePages(): Array<number> {
    const owner = this.owner;
    const list = this.list;
    const uniqueness = owner.getRecordUniqueness();
    const pages: Array<number> = [];
    uniqueness.fields.forEach((name: string): void => {
      const readKey = (index: number): any => {
        const record = owner.getListRecordAt(index);
        return !!record ? record[name] : undefined;
      };
      findDuplicatePages(list, readKey, uniqueness).forEach((page: number): void => {
        if (pages.indexOf(page) < 0) pages.push(page);
      });
    });
    return pages;
  }

  /* rowsVisibleIf / templateVisibleIf under paging (Andrew's decision 2026-09-25): a page is a slice
     of the VISIBLE records, so the condition is evaluated over every record without an object and
     the list's hidden flags are written from it (DynamicDataRecordVisibility). The rule is asked
     only past the guards, and before areInvisibleElementsShowing is applied: the survey's
     onExpressionRunning fires in that mode too. A flag that changed changes the page count, which
     the list does not announce: the question syncs it. Returns whether a flag changed. */
  public updateRecordsVisibility(properties: HashTable<any>): boolean {
    const owner = this.owner;
    // isPagingActive is false in design mode.
    if (!this.isPagingActive || owner.isLoadingFromJson) return false;
    const rule = owner.getRecordVisibilityRule(properties);
    const isChanged = this._list.updateRecordsVisibility(owner.areInvisibleElementsShowing ? "" : rule.expression,
      (index: number): any => owner.getListRecordAt(index), rule.createScope);
    if (isChanged) {
      owner.syncPagingState();
    }
    return isChanged;
  }

  /* The capabilities of a data source are declared by the presence of its optional methods: a source
     without insert gets no add button, one without remove no delete button, one without move no drag
     handles, and one without update makes every object read-only - a silently unsaved edit is worse
     than a disabled field, and an application that wants local-only edits over remote reads
     implements a no-op update. A question without a data source has every capability. The list is
     not created for the answer. */
  public canWrite(operation: DynamicDataOperation): boolean {
    const list = this._list;
    return !list || !list.isRemote || list.hasCapability(operation);
  }
  /* A remove on a page the list cuts leaves it one record short, and the first record of the next
     page belongs on it now: the page is refilled, as a data source's remove refill does (step 08). A
     remove that emptied the last page moved the page back, and that page change rebuilt it already.
     pageIndexBefore: the page index the list had before the remove. */
  public refillPageAfterRemove(pageIndexBefore: number): void {
    if (this.isPagedByList && this._list.pageIndex === pageIndexBefore) {
      this.owner.rebuildFromDataList(false);
    }
  }

  // IDynamicDataPageValidationOwner: the rules both questions share; the rest is the question's.
  public getDataList(): DynamicDataList {
    return this.list;
  }
  public isPageLeaveValidated(): boolean {
    const owner = this.owner;
    if (owner.isDesignMode) return false;
    return !owner.survey || !owner.validationCallbacks.canLeavePageWithErrors;
  }
  public canTrackEditedRecords(): boolean {
    return this.isPagedByList;
  }
  public goToPageFromCode(pageIndex: number): void {
    this.paging.pageIndex = pageIndex;
  }
  public validatePageObjects(context: ValidationContext): boolean {
    return this.owner.validatePageObjects(context);
  }
  public setPropertyValue(name: string, val: any): void {
    this.owner.setPropertyValue(name, val);
  }
  public get isDisposed(): boolean {
    return this.owner.isDisposed;
  }

  // The survey-data side of the swap. The list keeps the assigned source (assignedSource), so there
  // is no getter here. The question follows the call with its own refresh, also for the same source.
  public assignSource(val: IDynamicDataSource): void {
    const newValue = val || undefined;
    // Another storage: the records layer 2 tracks and the states kept for them name records of the
    // old one. Dropped before the swap, whose first read may commit inside it.
    if (!!this._pageValidation && newValue !== (!!this._list ? this._list.assignedSource : undefined)) {
      this._pageValidation.cancelPendingMove();
      this._pageValidation.clearRecords();
    }
    const list = this.list;
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
     submitted data (OPEN 21). */
  private clearValueInSurveyData(): void {
    const owner = this.owner;
    if (!owner.data || owner.isValueEmpty(owner.data.getValue(owner.getValueName()))) return;
    owner.data.setValue(owner.getValueName(), undefined, false, true, owner.name);
  }
  // Detaching: the window is dropped and the question reads the survey hash again.
  private restoreValueFromSurveyData(): void {
    const owner = this.owner;
    owner.updateValueFromSurvey(!!owner.data ? owner.data.getValue(owner.getValueName()) : undefined);
  }
  // A rejected read leaves the short window and its focused item in place: the kept position goes.
  private onSourceError(error: any, operation: DynamicDataOperation): void {
    if (operation === "read")this.forgetFocusIndex();
    const owner = this.owner;
    if (!!owner.survey) {
      owner.survey.dynamicDataError(owner, operation, error);
    }
  }
  // Is the model still waiting for this source? A page that has not arrived, a page that is about to
  // be read again once the pending edits are acknowledged, and an edit that has not been
  // acknowledged are all asynchronous operations the survey has started.
  public get isRunning(): boolean {
    const list = this._list;
    return !!list && list.isRemote && (list.isLoading || list.hasPendingRead || list.hasPendingWrites);
  }
  /* A remove on a page the source reads again (the refill of a source that pages itself) is answered
     by a rebuild of every item on the page, which disposes the one the question has just focused.
     The position is kept here while that read is pending and taken back when the read commits
     (commitLoadedRecords), to focus the item that is at that position then. A second remove
     overwrites the position; a page change and a rejected read drop it. */
  private focusIndexAfterRead: number = undefined;
  public keepFocusIndexForRead(index: number): void {
    const list = this._list;
    this.focusIndexAfterRead = !!list && list.isRemote && list.hasPendingRead && index > -1 ? index : undefined;
  }
  private forgetFocusIndex(): void {
    this.focusIndexAfterRead = undefined;
  }
  // Returns the kept position, or -1 when there is none, the read is not committed yet, or the focus
  // has moved out of the question by the time the answer arrives.
  private takeFocusIndexAfterRead(): number {
    const index = this.focusIndexAfterRead;
    const list = this._list;
    if (index === undefined || !list || list.hasPendingRead) return -1;
    this.focusIndexAfterRead = undefined;
    return isFocusInsideOrIdle(this.owner.id, this.owner.getWrapperElement()) ? index : -1;
  }
}
