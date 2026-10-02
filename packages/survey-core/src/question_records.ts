import { property } from "./decorators";
import { HashTable } from "./helpers";
import { Question, ValidationContext } from "./question";
import { DynamicItemModelBase, DynamicRecordItem } from "./dynamicItemModelBase";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { IDynamicDataField, IDynamicDataListChange } from "./dynamic-data/dynamic-data-interfaces";
import { DynamicDataPagingController } from "./dynamic-data/dynamic-data-paging";
import {
  DynamicDataQuestionController, IDynamicDataQuestionHooks, IDynamicDataRecordUniqueness, IDynamicDataRecordVisibilityRule
} from "./dynamic-data/dynamic-data-question-controller";

/* The question side shared by every question whose answer is a collection of records: it holds the
   controller that sits between the question and its record list, and it coordinates the value
   assignment, the loading state and the disposal with it. Rows, panels, columns and templates are
   the subclasses' terms: they answer the hooks below. A question that never creates a record list -
   the matrix with fixed rows - is one too; the controller then never calls them. */
export abstract class QuestionRecordsModel extends Question {
  // The controller and the hooks object it calls (see IDynamicDataQuestionHooks).
  protected dynamicData: DynamicDataQuestionController = new DynamicDataQuestionController(this, this.createDynamicDataHooks());
  /* The hooks stay protected members of the question, so that its own code calls the same members the
     controller calls; the controller reaches them through these functions. None of them runs while
     the question is being created. */
  private createDynamicDataHooks(): IDynamicDataQuestionHooks {
    return {
      getListRecords: (): Array<any> => this.getListRecords(),
      setListRecords: (records: Array<any>): void => { this.setListRecords(records); },
      getListRecordCount: (): number => this.getListRecordCount(),
      getFields: (): Array<IDynamicDataField> => this.getFields(),
      syncPagingState: (): void => { this.syncPagingState(); },
      rebuildFromDataList: (isPageMove: boolean): void => { this.rebuildFromDataList(isPageMove); },
      refreshRenderedPage: (): void => { this.refreshRenderedPage(); },
      areObjectsBuilt: (): boolean => this.areObjectsBuilt(),
      followRecordMove: (remap: (index: number) => number): void => { this.followRecordMove(remap); },
      getStoredRecords: (): any => this.getStoredRecords(),
      storeLoadedRecords: (): void => { this.storeLoadedRecords(); },
      prepareRemoteWrite: (change: IDynamicDataListChange): void => { this.prepareRemoteWrite(change); },
      runRemoteWriteConditions: (): void => { this.runRemoteWriteConditions(); },
      hasKeptRecordIndexes: (): boolean => this.hasKeptRecordIndexes(),
      remapKeptRecordIndexes: (remap: (index: number) => number): void => { this.remapKeptRecordIndexes(remap); },
      focusItemAfterRead: (index: number): void => { this.focusItemAfterRead(index); },
      validatePageObjects: (context: ValidationContext): boolean => this.validatePageObjects(context),
      getListRecordAt: (index: number): any => this.getListRecordAt(index),
      createRecordItem: (recordIndex: number): DynamicRecordItem => this.createRecordItem(recordIndex),
      getRecordUniqueness: (): IDynamicDataRecordUniqueness => this.getRecordUniqueness(),
      getRecordVisibilityRule: (properties: HashTable<any>): IDynamicDataRecordVisibilityRule => this.getRecordVisibilityRule(properties),
      getPageSize: (): number => this.pageSize,
      getListPageSize: (): number => this.listPageSize,
      raiseSortByChanged: (oldValue: string, newValue: string): void => { this.raiseSortByChanged(oldValue, newValue); }
    };
  }
  // A peek: it never creates the list.
  protected get dataListValue(): DynamicDataList {
    return this.dynamicData.listValue;
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
    return this.dynamicData.list;
  }
  protected get paging(): DynamicDataPagingController {
    return this.dynamicData.paging;
  }
  /* "the records are owned by a data source": the survey hash, the write routing, the capabilities
     and the count setters ask it. It is deliberately not "the list pages itself": a source that
     returns everything in one read is still a source, and its records are still not the question's
     to grow or truncate - but the list pages them exactly as it pages question.value. Who pages is
     isPagedByList. */
  protected get isRemoteData(): boolean {
    return !!this.dataListValue && this.dataListValue.isRemote;
  }
  // True while the data source is reading a page. The UI shows a loading state from it, and
  // question.isReady is false for exactly as long.
  @property({ defaultValue: false, onSet: (val: boolean, q: QuestionRecordsModel): void => { q.updateIsReady(); } }) isDataLoading: boolean;
  // Read by SurveyModel.getRunningAsyncOperations(): a page that has not arrived or an edit the
  // source has not acknowledged is an asynchronous operation the survey has started.
  public get isDynamicDataRunning(): boolean {
    return this.dynamicData.isRunning;
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
  /* The list side of an assignment is the controller's (beginValueAssignment): every assignment of
     the value passes through here. The subclasses do their own work in two hooks - inside the
     list-side pair (onRecordsValueStored) and after it (onRecordsValueAssigned) - and update
     isAnswered there, after that work: the value is stored with updateIsAnswered = false, whatever
     the caller passed. */
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    const assignment = this.dynamicData.beginValueAssignment();
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly). A value that is not
    // an array is kept as it is - a keyed answer is never turned into one.
    const oldValue = this.getStoredRecords();
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : oldValue;
    super.setQuestionValue(newValue, false);
    this.onRecordsValueStored();
    this.dynamicData.endValueAssignment(assignment, oldRecords);
    this.onRecordsValueAssigned(oldRecords);
  }
  // The value is stored and the list-side pair is still open.
  protected onRecordsValueStored(): void { }
  // The list-side pair is closed. oldRecords: a copy of the value the assignment replaced.
  protected onRecordsValueAssigned(oldRecords: any): void { }
  // The stored value, not the default: the records an assignment or a read replaces.
  protected getStoredRecords(): any {
    return this.getPropertyValueWithoutDefault("value");
  }
  /* The list goes after the question's objects: it drops its pending-request counter, so a page or a
     push that is still in flight cannot write into a question that is gone. */
  public dispose(): void {
    this.dynamicData.cancelPendingPageMove();
    super.dispose();
    this.disposeRecordObjects();
    this.dynamicData.dispose();
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

  // IDynamicDataQuestionHooks: what every records question answers.
  /* The records the list works with: the question's own storage, given to
     DynamicDataList.createReadThrough once. */
  protected abstract getListRecords(): Array<any>;
  protected abstract setListRecords(records: Array<any>): void;
  // The record fields the list knows (see DynamicDataQuestionController.getFieldsOfQuestions).
  protected abstract getFields(): Array<IDynamicDataField>;
  // The objects are re-created for the records the view - under paging, the page - holds now.
  protected abstract rebuildFromDataList(isPageMove: boolean): void;
  // A page of a source that pages itself was asked for: its objects arrive when the read commits.
  protected abstract refreshRenderedPage(): void;
  // The objects exist. Objects that do not exist are never stale.
  protected abstract areObjectsBuilt(): boolean;
  // What a write to the survey would have re-run after a write to a data source.
  protected abstract runRemoteWriteConditions(): void;
  // The item at a position is focused once the objects of a committed read exist.
  protected abstract focusItemAfterRead(index: number): void;
  // The question's own objects on the page; the rest of the page validation is the controller's.
  protected abstract validatePageObjects(context: ValidationContext): boolean;
  // One record as the question reads it without an object.
  protected abstract getListRecordAt(index: number): any;
  // A record without an object, read as a value.
  protected abstract createRecordItem(recordIndex: number): DynamicRecordItem;
  // What a duplicate is among the records.
  protected abstract getRecordUniqueness(): IDynamicDataRecordUniqueness;
  // The record visibility condition of a question that pages, and the scope it runs in.
  protected abstract getRecordVisibilityRule(properties: HashTable<any>): IDynamicDataRecordVisibilityRule;
  // The authored page size (rowsPerPage / panelsPerPage) and the one the list gets at runtime.
  protected abstract get pageSize(): number;
  protected abstract get listPageSize(): number;
  // The objects, by created position and by record: the controller's owner type reads them.
  public abstract getItem(index: number): DynamicItemModelBase;
  public abstract getItemByRecordIndex(recordIndex: number): DynamicItemModelBase;

  // IDynamicDataQuestionHooks with a default.
  // The length getListRecords() would return.
  protected getListRecordCount(): number {
    const records = this.getListRecords();
    return Array.isArray(records) ? records.length : 0;
  }
  // The list announces a page index it had to clamp, but not a page count that changed because a
  // record became hidden or because the records were replaced: those points call this.
  protected syncPagingState(): void {
    if (!this.dataListValue) return;
    this.paging.syncState();
  }
  // A move: the objects follow their records.
  protected followRecordMove(remap: (index: number) => number): void {
    this.dynamicData.remapBuiltItems(remap);
  }
  /* The storage half alone: used after every write the list pushed to the source. The object the
     respondent is typing in already holds the new value, and a rebuild would dispose it under the
     edit (the frozen-membership rule). */
  protected storeLoadedRecords(): void {
    this.storeQuestionValue(this.dataList.getLoadedRecords());
  }
  // After a write to a data source was stored, before the conditions run: nothing to prepare.
  protected prepareRemoteWrite(change: IDynamicDataListChange): void { }
  // Record indexes the question keeps besides its objects and the edited set: none.
  protected hasKeptRecordIndexes(): boolean {
    return false;
  }
  protected remapKeptRecordIndexes(remap: (index: number) => number): void { }
  // sortBy is computed from sortOrder and nothing raises its change on its own.
  protected raiseSortByChanged(oldValue: string, newValue: string): void {
    this.propertyValueChanged("sortBy", oldValue, newValue);
  }
}
