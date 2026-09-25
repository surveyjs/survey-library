import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { HashTable, Helpers } from "./helpers";
import { QuestionFactory } from "./questionfactory";
import { Question, QuestionValueGetterContext, QuestionValueType } from "./question";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData,
  MatrixSingleInputLocOwner,
  IMatrixDuplicationEntry
} from "./question_matrixdropdownbase";
import { SurveyError } from "./survey-error";
import { MinRowCountError } from "./error";
import { Action, IAction } from "./actions/action";
import { settings } from "./settings";
import { confirmActionAsync } from "./utils/confirm-dialog";
import { DragDropMatrixRows } from "./dragdrop/matrix-rows";
import { IShortcutText, ISurveyImpl, IProgressInfo, ISurveyData } from "./base-interfaces";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";
import { DragOrClickHelper, ITargets } from "./utils/dragOrClickHelper";
import { LocalizableString } from "./localizablestring";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "./questionSingleInputSummary";
import { IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, IValueGetterItem } from "./conditions/conditionProcessValue";
import { ValidationContext } from "./question";
import { ActionContainer } from "./actions/container";
import { ComputedUpdater } from "./base";
import { Base } from "./base";
import { MatrixDropdownBaseSingleInputBehavior } from "./question_matrixdropdownbase";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { DynamicItemModelBase, DynamicRecordItem } from "./dynamicItemModelBase";
import { MatrixRowGetterContext } from "./question_matrixdropdownbase";
import { ConditionRunner } from "./conditions/conditionRunner";
import { DynamicDataPageValidation, IDynamicDataPageState, IDynamicDataPageValidationOwner } from "./dynamic-data/dynamic-data-page-validation";
import { createReadThroughDataList, DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { DynamicDataOperation, IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataSort, IDynamicDataSource } from "./dynamic-data/dynamic-data-interfaces";
import { getDynamicDataFieldsForQuestions } from "./dynamic-data/dynamic-data-fields";
import { DynamicDataPagingController } from "./dynamic-data/dynamic-data-paging";
import { DynamicDataRemoteController, IDynamicDataRemoteOwner } from "./dynamic-data/dynamic-data-remote";
import { ArrayDynamicDataSource } from "./dynamic-data/dynamic-data-sources";

export class MatrixDynamicValueGetterContext extends QuestionValueGetterContext {
  constructor (protected question: Question) {
    super(question);
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    const index = params.index;
    const md = <QuestionMatrixDynamicModel>this.question;
    if (index > -1 && md.isDesignMode) return md.getDesignRowContext().getValue(params);
    if (index > -1) {
      const rows = md.allRows;
      if (index >= 0 && index < rows.length) {
        params.isRoot = false;
        return rows[index].getValueGetterContext().getValue(params);
      }
      return { isFound: false, value: undefined, context: this };
    }
    if (!params.createObjects && this.question.isEmpty()) return { isFound: path.length === 0, value: undefined };
    return super.getValue(params);
  }
}

export class MatrixDynamicRowModel extends MatrixDropdownRowModelBase implements IShortcutText {
  private dragOrClickHelper: DragOrClickHelper;

  constructor(public index: number, data: IMatrixDropdownData, value: any) {
    super(data, value);
    this.buildCells(value);
  }
  /* The record the row was built for, kept in step with the list's inserts and removes: when the
     page changes the list already names the records of the new page, and whether the rows are the
     page is decided by comparing the two. */
  public builtRecordIndex: number = -1;
  protected getItemIndex(): number {
    const res = super.getItemIndex();
    return res > 0 ? res : this.index + 1;
  }
  public get rowName() {
    return this.id;
  }
  public get dataName(): string {
    return "row" + (this.index + 1);
  }
  public get text(): any {
    return "row " + (this.visibleIndex + 1);
  }
  public getAccessbilityText(): string {
    return (this.visibleIndex + 1).toString();
  }
  public get shortcutText(): string {
    const matrix = <QuestionMatrixDynamicModel>this.data;
    const index = matrix.visibleRows.indexOf(this) + 1;
    const questionValue1 = this.cells.length > 1 ? this.cells[1]["questionValue"] : undefined;
    const questionValue0 = this.cells.length > 0 ? this.cells[0]["questionValue"] : undefined;
    return (
      questionValue1 && questionValue1.value ||
      questionValue0 && questionValue0.value ||
      "" + index
    );
  }
}

/**
  * A class that describes the Dynamic Matrix question type.
  *
  * Dynamic Matrix allows respondents to add and delete matrix rows. You can use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkboxes](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radio Button Group](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Single-Line Input](https://surveyjs.io/form-library/documentation/questiontextmodel), [Long Text](https://surveyjs.io/form-library/documentation/questioncommentmodel), and other question types as cell editors.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/ (linkStyle))
  */
export class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData, IDynamicDataOwner, IDynamicDataRemoteOwner, IDynamicDataPageValidationOwner {
  public onGetValueForNewRowCallBack: (
    sender: QuestionMatrixDynamicModel
  ) => any;
  private rowCounter = 0;
  private initialRowCount: number;
  private setRowCountValueFromData: boolean = false;

  constructor(name: string) {
    super(name);
    this.initialRowCount = this.getDefaultPropertyValue("rowCount");
    this.dragOrClickHelper = new DragOrClickHelper(this.startDragMatrixRow);
    this.addExpressionProperty("rowCountExpression",
      (obj: Base, res: any) => { this.setRowCountByExpression(res); });
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const resetTableProps = ["allowRowReorder", "isReadOnly", "lockedRowCount"];
    if (resetTableProps.indexOf(name) > -1) {
      this.resetRenderedTable();
    }
    if (name === "minRowCount") {
      this.onMinRowCountChanged();
    }
    if (name === "maxRowCount") {
      this.onMaxRowCountChanged();
    }
    if (name === "allowRemoveRows" && !this.isUpdateLocked) {
      this.resetRenderedTable();
    }
  }
  private dataListValue: DynamicDataList;
  /* Every record-level read and write of this question goes through this list. Its source is a
     getter/setter pair over question.value - never a captured array - so that every write replaces
     the array instead of mutating the one the question currently holds.
     The invariant: generatedVisibleRows[i] holds the record dataList.getCreatedIndexes()[i] - the
     records that pass the list filter, in its sort order, owner-hidden ones included. With neither
     set the created indexes are 0 ... rowCount-1 and the rows, the records and question.value are
     parallel again, which is the state of every matrix until a filter or a sort is assigned.
     question.value always holds every record in record order: a filter never removes from it and a
     sort never reorders it. rowCount is the record count; it stops being the row count while a
     filter is active. */
  private get dataList(): DynamicDataList {
    if (!this.dataListValue) {
      this.dataListValue = createReadThroughDataList(this,
        (): Array<any> => this.getListRecords(),
        (arr: Array<any>): void => { this.setNewValue(this.normalizeRecords(arr)); },
        (): number => this.getListRecordCount());
      this.dataListValue.onError = (error: any, operation: DynamicDataOperation): void => {
        this.onDataSourceError(error, operation);
      };
      // The list is created on demand, so a rowsPerPage that came from JSON has to be pushed here
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
   * A data source that supplies the matrix records. Assign an object that implements `IDynamicDataSource` to read the rows from a server: the matrix then shows one loaded page at a time and pushes every cell edit, row insertion and row deletion to the source.
   *
   * This property is not serialized - a data source is code, not survey JSON. Set it to `undefined` to go back to the records stored in `question.value`.
   * @since 3.1.0
   */
  public get dataSource(): IDynamicDataSource {
    return this.remote.dataSource;
  }
  public set dataSource(val: IDynamicDataSource) {
    this.remote.dataSource = val;
    // The capabilities of the new source decide whether the cells are editable and whether the
    // add/remove buttons are shown: the cells read isMatrixReadOnly() through their readOnlyCallback
    // and need the reactive refresh that an ordinary read-only change would give them.
    (this.generatedVisibleRows || []).forEach(row => row.onQuestionReadOnlyChanged());
    this.resetRenderedTable();
  }
  // True while the data source is reading a page. The UI shows a loading state from it, and
  // question.isReady is false for exactly as long.
  @property({ defaultValue: false, onSet: (val: boolean, q: QuestionMatrixDynamicModel): void => { q.updateIsReady(); } }) isDataLoading: boolean;
  // Read by SurveyModel.getRunningAsyncOperations(): a page that has not arrived or an edit the
  // source has not acknowledged is an asynchronous operation the survey has started.
  public get isDynamicDataRunning(): boolean {
    return !!this.remoteValue && this.remoteValue.isRunning;
  }
  /* "the records are owned by a data source", the one condition every remote branch of this class
     asks. It is deliberately not "the list pages itself": a source that returns everything in one
     read is still a source, and its records are still not the question's to grow or truncate. */
  private get isRemoteData(): boolean {
    return !!this.remoteValue && this.remoteValue.isRemote;
  }
  createValueDataSource(): IDynamicDataSource {
    return new ArrayDynamicDataSource((): Array<any> => this.getListRecords(),
      (arr: Array<any>): void => { this.setNewValue(this.normalizeRecords(arr)); },
      (): number => this.getListRecordCount());
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
     Known limitation: expressions elsewhere in the survey that name this question ({matrix[0].col}
     or {matrix.length}) do not update on a remote edit. The {row.x} context inside the rows and the
     question's own validation are unaffected - they read question.value, which is the window. */
  protected canSetValueToSurvey(): boolean {
    return !this.isRemoteData;
  }
  /* The loaded window becomes the question value. It is the inbound path - the value is stored, the
     survey hash is not written and no trigger, condition or navigation runs - and then the rows are
     rebuilt for the records the window holds. Nothing else may assign the value on a load. */
  private setLoadedRecords(): void {
    this.storeLoadedRecords();
    this.rebuildRowsFromDataList();
  }
  /* The storage half alone: used after every write the list pushed to the source. The row the
     respondent is typing in already holds the new value, and a rebuild would dispose it under the
     edit (the frozen-membership rule).
     rowCount follows the loaded total here and not through its setter: the setter clamps to
     settings.matrix.maxRowCount, truncates the storage and creates one row object per counted
     record - none of which applies to a window of a larger table. With a source that answers
     without a total it is the count of the rows known to exist, a lower bound - isRowCountKnown
     says which of the two it is. */
  private storeLoadedRecords(): void {
    this.storeQuestionValue(this.remote.getWindow());
    this.rowCountValue = this.dataList.count;
  }
  getFields(): Array<IDynamicDataField> {
    const questions = new Array<Question>();
    this.columns.forEach(column => {
      if (!!column.templateQuestion) {
        questions.push(column.templateQuestion);
      }
    });
    const res = getDynamicDataFieldsForQuestions(questions);
    questions.forEach(q => {
      // storeOthersAsComment writes the "other" text into the comment key of the same record.
      if (!q.hasComment && (<any>q).hasOther === true) {
        const name = q.getValueName() + settings.commentSuffix;
        if (!res.some(f => f.name === name)) {
          res.push({ name: name, dataType: "string" });
        }
      }
    });
    return res;
  }
  /* A reset means the view was re-decided: a filter or a sort was assigned, or refreshView() was
     called. Which records have a row changes with it, so the rows are rebuilt.
     hasMaterializedView remembers that the rows were last built for a view: clearing the filter
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
      /* The rows that exist are the page (prompt 15): a page of an in-memory list is rebuilt at once,
         through the path a remote read takes. A remote page is rebuilt when its read commits. */
      if (!this.isRemoteData && this.isPagingActive) {
        this.rebuildRowsFromDataList();
      } else {
        this.resetRenderedTable();
      }
      return;
    }
    this.followRecordChange(change);
    /* A write the list pushed to a data source: with the array source over question.value the push
       IS the value write, a remote source has no such setter, so the question follows the window
       itself. The rows are not rebuilt - the one that was edited, added or removed is handled by the
       path that made the change. */
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
      // The window the read committed is the new value; setLoadedRecords rebuilds the rows.
      this.setLoadedRecords();
      this.focusActionCellAfterRead();
    } else {
      this.rebuildRowsFromDataList();
    }
  }
  private isReRunningRemoteConditions: boolean;
  /* With the array source over question.value a record write reaches the survey, and the survey then
     re-runs the conditions of every question - which is what recalculates an expression cell, a
     {row.x} reference and the totals. A remote write never reaches the survey
     (canSetValueToSurvey), so the question runs its own. Re-entrancy is guarded and not forbidden
     for a reason: an expression cell writes its result back as a record field, and the nested run
     would only recompute what the outer one has just settled. */
  private reRunConditionsOnRemoteWrite(): void {
    if (this.isReRunningRemoteConditions || !this.data || !this.generatedVisibleRows) return;
    this.isReRunningRemoteConditions = true;
    try {
      const properties = this.getDataFilteredProperties();
      this.runCellsCondition(properties);
      if (this.hasTotal) {
        this.runTotalsCondition(properties);
      }
    } finally {
      this.isReRunningRemoteConditions = false;
    }
  }
  // The edited set of layer 2 names records by index: it follows the list's own inserts and removes.
  private followRecordChange(change: IDynamicDataListChange): void {
    const validation = this.isPagedInMemory ? this.pageValidation : this.pageValidationValue;
    const shift = (func: (index: number) => number): void => {
      (this.generatedVisibleRows || []).forEach((row: MatrixDropdownRowModelBase): void => {
        const dynamicRow = <MatrixDynamicRowModel>row;
        if (dynamicRow.builtRecordIndex > -1) dynamicRow.builtRecordIndex = func(dynamicRow.builtRecordIndex);
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
  /* A remote window is a view of its own: the rows are built for the records the list holds, not for
     0 ... rowCount-1, because rowCount is the server total. A matrix that pages builds its rows for
     the page, so it takes the view path too. */
  private get hasDataListView(): boolean {
    return !!this.dataListValue && (this.dataListValue.hasView || this.hasMaterializedView || this.isRemoteData || this.isPagingActive);
  }
  /* Every value assignment of this question passes through setQuestionValue, and rowCount changes
     the padded records the list reads. The list sees the records themselves at once - it reads them
     through the value - but the views it cached over them it cannot: they are dropped here. The list
     is not created just to be invalidated.
     An assignment made outside the list - survey.data, a trigger, clearValue, a default value - also
     re-decides the membership, and when it changes which records have a row the rows are rebuilt;
     when it does not, the base refreshes their values by position, as it always has. An assignment
     the list itself is making is not a change from outside: invalidateViews ignores it and the
     snapshot is not taken. */
  protected setQuestionValue(newValue: any): void {
    const created = this.getCreatedIndexesSnapshot();
    const isFromOutside = !!this.dataListValue && !this.dataListValue.isWriting;
    // A copy: an array value is updated in place (Base.setArrayPropertyDirectly).
    const oldValue = this.getPropertyValueWithoutDefault("value");
    const oldRecords = Array.isArray(oldValue) ? [].concat(oldValue) : [];
    super.setQuestionValue(newValue);
    this.invalidateDataListViews();
    this.rebuildRowsIfViewChanged(created);
    if (isFromOutside && this.isPagedInMemory) {
      this.onRecordsReplaced(oldRecords);
    }
  }
  /* The records were assigned from outside the list (survey.data, a trigger, a sibling with the same
     valueName): the edited set follows the records it names across the insert, remove or move the
     assignment made, and a move that waits for its validators is dropped. The page is rebuilt when
     it names other records than its rows hold. */
  private onRecordsReplaced(oldRecords: Array<any>): void {
    if (!!this.pageValidationValue) {
      this.pageValidationValue.cancelPendingMove();
      const newRecords = this.getPropertyValueWithoutDefault("value");
      this.pageValidationValue.onRecordsReplaced(oldRecords, Array.isArray(newRecords) ? newRecords : []);
    }
    if (this.isPageStale()) {
      this.rebuildRowsFromDataList();
    }
  }
  // The rows hold other records than the page names.
  private isPageStale(): boolean {
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows) || !this.dataListValue) return false;
    const records = this.dataList.getMaterializedIndexes();
    if (records.length !== rows.length) return true;
    for (let i = 0; i < rows.length; i++) {
      if ((<MatrixDynamicRowModel>rows[i]).builtRecordIndex !== records[i]) return true;
    }
    return false;
  }
  private getCreatedIndexesSnapshot(): Array<number> {
    const list = this.dataListValue;
    return !!list && list.hasView && !list.isWriting ? list.getCreatedIndexes() : undefined;
  }
  private rebuildRowsIfViewChanged(created: Array<number>): void {
    if (!created || !this.dataListValue) return;
    if (Helpers.isTwoValueEquals(created, this.dataListValue.getCreatedIndexes())) return;
    this.rebuildRowsFromDataList();
  }
  /* A full rebuild: the rows are re-created for the records the view now holds. It costs the
     per-row state - open detail panels, row errors, cell question state, row ids - and fires the
     row-creation callbacks again. It is the same path a remote page change takes, so there is one. */
  private rebuildRowsFromDataList(): void {
    if (this.isEditingObjectValue) return;
    const hasRows = !!this.generatedVisibleRows;
    // The page is a slice of the visible records: their visibility is decided before it is cut.
    if (hasRows && !!this.data) {
      this.updateRecordsVisibilityByExpression(this.getDataFilteredProperties());
    }
    if (hasRows) {
      this.clearGeneratedRows();
      this.resetRenderedTable();
      this.getVisibleRows();
      this.onRowsChanged();
    }
    /* The totals are the totals of the rows that exist, so a view change recalculates them - and a
       total needs the rows even when nothing has asked for them yet. */
    if (this.hasTotal) {
      if (!hasRows) {
        this.getVisibleRows();
      }
      this.runTotalsCondition(this.getDataFilteredProperties());
    }
  }
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
  // row became hidden or because the records were replaced: those points call this.
  private syncPagingState(): void {
    if (!this.dataListValue) return;
    this.paging.syncState();
  }
  /* The rows that exist are the page (prompt 15): with paging on, visibleRows holds the current page
     only, whatever the source, so the page is visibleRows itself - the same instance - and never a
     slice of it. */
  public get rowsOnPage(): Array<MatrixDropdownRowModelBase> {
    return this.visibleRows;
  }
  protected get isPagingActive(): boolean {
    if (this.isDesignMode) return false;
    return !!this.dataListValue && this.dataListValue.pageSize > 0;
  }
  // An in-memory list that pages: the only kind whose edited records layer 2 tracks.
  private get isPagedInMemory(): boolean {
    return this.isPagingActive && !this.isRemoteData;
  }
  // Single-input mode is its own paging: it walks every row and lists them in its summary.
  public get listPageSize(): number {
    return this.isSingleInputActive ? 0 : this.rowsPerPage;
  }
  // internal: single-input mode reads every row, and nothing tells the list that it became active.
  public syncPageSizeWithMode(): void {
    const list = this.dataListValue;
    if (!list || this.isLoadingFromJson) return;
    const size = this.isDesignMode ? 0 : this.listPageSize;
    if (list.pageSize !== (size > 0 ? size : 0)) {
      this.paging.updatePageSize();
    }
  }
  /* Three indexes (prompt 15): the record index names the record, visibleIndex is its position among
     the visible records of the whole list, pageVisibleIndex its position in visibleRows;
     visibleIndex = pageStartVisibleIndex + pageVisibleIndex. */
  private get pageStartVisibleIndex(): number {
    const list = this.dataListValue;
    if (!list) return 0;
    if (this.isRemoteData) return list.windowOffset;
    return this.isPagingActive ? list.pageIndex * list.pageSize : 0;
  }
  protected getFirstRowVisibleIndex(): number {
    return this.pageStartVisibleIndex;
  }
  // IDynamicItemModelData: the window offset of a data source that pages itself (see rowIndex).
  getRecordNumberOffset(): number {
    return this.isRemoteData && !!this.dataListValue ? this.dataListValue.windowOffset : 0;
  }
  getItemVisibleIndex(item: ISurveyData): number {
    if (item instanceof MatrixDropdownRowModelBase) {
      const rows = this.visibleRows;
      if (!rows) return item.visibleIndex;
      const pos = rows.indexOf(item);
      return pos < 0 ? -1 : this.pageStartVisibleIndex + pos;
    }
    if (!(item instanceof DynamicRecordItem) || !this.dataListValue) return -1;
    const pos = this.dataListValue.getVisibleIndexes().indexOf(item.getIndex());
    return pos < 0 ? -1 : pos + (this.isRemoteData ? this.dataListValue.windowOffset : 0);
  }
  /* The neighbour comes from the view: the row when the record has one, the record read as a value
     when the matrix pages and it has none. */
  getItemByVisibleIndex(visibleIndex: number): DynamicItemModelBase {
    if (visibleIndex < 0) return null;
    const rows = this.visibleRows;
    if (!rows) return null;
    const pos = visibleIndex - this.pageStartVisibleIndex;
    if (pos >= 0 && pos < rows.length) return rows[pos];
    if (!this.isPagingActive) return null;
    const list = this.dataList;
    const at = visibleIndex - (this.isRemoteData ? list.windowOffset : 0);
    const visible = list.getVisibleIndexes();
    if (at < 0 || at >= visible.length) return null;
    return this.createRecordItem(visible[at]);
  }
  private createRecordItem(recordIndex: number): DynamicRecordItem {
    return new DynamicRecordItem(this, recordIndex, this.getListRecordAt(recordIndex), settings.expressionVariables.row,
      (item: DynamicRecordItem): IValueGetterContext => new MatrixRowGetterContext(<any>item));
  }
  // The number of rows on one page, 0 = no paging.
  public get rowsPerPage(): number {
    return this.getPropertyValue("rowsPerPage");
  }
  public set rowsPerPage(val: number) {
    const num = Helpers.getNumber(val);
    // The clamp is in the setter and not in an onSettingValue hook: the hook is skipped while the
    // question is loading from JSON.
    this.setPropertyValue("rowsPerPage", num > 0 ? num : 0);
    this.paging.updatePageSize();
    this.resetRenderedTable();
  }
  public get pageSize(): number { return this.rowsPerPage; }
  public set pageSize(val: number) { this.rowsPerPage = val; }
  // A zero-based page index; always 0 while paging is off.
  public get pageIndex(): number { return this.isPagingActive ? this.paging.pageIndex : 0; }
  public set pageIndex(val: number) { this.paging.pageIndex = val; }
  // The number of pages; 1 for an empty question and for one that does not page.
  public get pageCount(): number { return this.isPagingActive ? this.paging.pageCount : 1; }
  /* False while the data source answers a read without a total: rowCount is then the number of rows
     known to exist - a lower bound - and pageCount the number of pages found so far. Every source
     that hands over the whole table leaves it true. */
  public get isRowCountKnown(): boolean { return this.paging.isCountKnown; }
  // IDynamicDataPagingOwner: the name the controller reads, as pageSize is for rowsPerPage.
  public get isCountKnown(): boolean { return this.isRowCountKnown; }
  public get canGoNextPage(): boolean { return this.paging.canGoNextPage; }
  public get canGoPrevPage(): boolean { return this.paging.canGoPrevPage; }
  /* The respondent's page moves: a move forward validates the page it leaves. false = an error was
     found at once; true = moved, or waiting for asynchronous validators (see isPageMovePending). */
  public goToPage(index: number): boolean { return this.paging.goToPage(index); }
  public nextPage(): boolean { return this.paging.nextPage(); }
  public prevPage(): boolean { return this.paging.prevPage(); }
  /* The sort the rows are displayed in: { field, direction } descriptors applied in array order,
     an empty array = no sort. It never reorders the question value. */
  public get sortOrder(): Array<IDynamicDataSort> { return this.paging.sortOrder; }
  public set sortOrder(val: Array<IDynamicDataSort>) { this.paging.sortOrder = val; }
  /* The serialized form of sortOrder: "price-;name" = price descending, then name ascending (see
     dynamic-data-sort.ts for the grammar). One storage and two faces - this is the current sort,
     so a header click changes what toJSON() emits. */
  public get sortBy(): string { return this.paging.sortBy; }
  public set sortBy(val: string) { this.paging.sortBy = val; }
  /* What a click on a sortable header does: ascending, then descending, then not sorted. With
     addToSort the field is cycled inside the current sort instead of replacing it, which is the
     multi-field sort a modified header click makes. */
  public toggleSort(field: string, addToSort?: boolean): boolean { return this.paging.toggleSort(field, addToSort); }
  public clearSort(): void { this.paging.clearSort(); }
  /* A survey expression over the row values - the same language as visibleIf, with the record
     fields as its variables. A row that does not satisfy it is not created; the question value
     keeps every record. An empty string = no filter. It is not rowsVisibleIf: that one is a
     per-row expression with a row context and stays the owner-visibility layer. */
  public get filterExpression(): string { return this.paging.filterExpression; }
  public set filterExpression(val: string) { this.paging.filterExpression = val; }
  public raiseSortByChanged(oldValue: string, newValue: string): void {
    this.propertyValueChanged("sortBy", oldValue, newValue);
  }
  public refreshView(): void { this.paging.refreshView(); }
  protected isPropertyStoredInHash(name: string): boolean {
    // sortBy renders sortOrder and stores nothing of its own, so the serializer has to read the
    // accessor instead of looking for a hash entry that will never be there.
    return name !== "sortBy" && super.isPropertyStoredInHash(name);
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    // The one hook every load ends with: the sort and the filter the JSON authored reach the list
    // here, once, whatever order their keys came in.
    this.paging.flushAuthoredView();
  }
  private pagerActionsValue: ActionContainer;
  public get pagerActions(): ActionContainer {
    if (!this.pagerActionsValue) {
      this.pagerActionsValue = this.paging.createPagerActions(this.createActionContainer());
    }
    return this.pagerActionsValue;
  }
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
  // Rows that were never built were never shown: there is nothing the respondent could have left
  // invalid, and validating them would build them.
  validatePageObjects(context: ValidationContext): boolean {
    if (!this.generatedVisibleRows) return true;
    return this.validateRowObjects(context);
  }
  goToPageFromCode(pageIndex: number): void {
    this.paging.pageIndex = pageIndex;
  }
  /* internal: what this matrix keeps for its records when an ancestor (a dynamic panel that pages)
     rebuilds the panel holding it - undefined when it does not page, since a matrix that does not
     page validates every row anyway. The matrix itself keeps no state for questions nested in its
     rows: a paged question in a detail panel starts over when its row is rebuilt. */
  public getPageState(): IDynamicDataPageState {
    if (!this.isPagedInMemory) return undefined;
    return this.pageValidation.getState(this.pageIndex);
  }
  public setPageState(state: IDynamicDataPageState): void {
    if (!state) return;
    this.pageValidation.setState(state);
    if (state.pageIndex > 0) {
      this.paging.pageIndex = state.pageIndex;
    }
  }
  /* A matrix that pages validates the page that exists - Complete included - and then what the
     page cannot show: the edited records on other pages (layer 2) and a duplicate pair both of whose
     records are off the page. Either moves to the page that holds the error. */
  protected validateElementCore(context: ValidationContext): boolean {
    let res = super.validateElementCore(context);
    if (res && this.isPagedInMemory && context.fireCallback && !context.isOnValueChanged) {
      res = this.pageValidation.validateEditedRecords(context, this.getOffPageDuplicatePages());
    }
    return res;
  }
  /* Every unique column (keyName included) is scanned over the records without a row (O(records)):
     a pair whose records are both off the page has no row the base check could put the error on.
     Every record takes part, as it does without paging; the error goes on the later visible record
     of the pair, on its page. Returns the pages to visit; layer 2 walks them together with its own.
     The groups are a Map: the keys are respondent input, and "__proto__" in a plain object is the
     prototype, not a group. */
  private getOffPageDuplicatePages(): Array<number> {
    const pages: Array<number> = [];
    const names = this.getUniqueColumnsNames();
    if (names.length === 0) return pages;
    const list = this.dataList;
    const visiblePos: { [index: number]: number } = {};
    list.getVisibleIndexes().forEach((index: number, pos: number): void => { visiblePos[index] = pos; });
    names.forEach((name: string): void => {
      const groups = new Map<string, { count: number, target: number }>();
      for (let i = 0; i < list.loadedCount; i++) {
        const record = this.getListRecordAt(i);
        let val = !!record ? record[name] : undefined;
        if (this.isValueEmpty(val)) continue;
        if (!this.useCaseSensitiveComparison && typeof val === "string") {
          val = val.toLocaleLowerCase();
        }
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
    });
    return pages;
  }
  /* rowCount, not a write, decides how many records the list reads: the window is question.value
     padded up to it. The records that appear join the view - an added record always does - and the
     ones that disappear leave it; the membership of the rest is not re-decided. */
  private syncDataListRecordCount(): void {
    if (!!this.dataListValue) {
      this.dataListValue.syncMembershipWithRecordCount();
      this.syncPagingState();
    }
  }
  /* The records the list works with: question.value padded up to rowCount, exactly as
     createNewValue() pads it. The padding is virtual - it reaches question.value only when a write
     materializes it - and the array is never truncated here: the rowCount setter needs the records
     beyond the new rowCount in order to remove them through the list. */
  private getListRecords(): Array<any> {
    const val = this.value;
    if (Array.isArray(val) && val.length >= this.rowCount) return val;
    return this.padRecords(Array.isArray(val) ? val.slice() : []);
  }
  // The length getListRecords() would return: value.length padded up to rowCount, never truncated.
  private getListRecordCount(): number {
    const val = this.value;
    const len = Array.isArray(val) ? val.length : 0;
    return Math.max(len, this.rowCount);
  }
  /* One record of getListRecords() without composing the array: a padded record is the default row
     value. For the loops over the records by index. A data source's window is the list's to answer,
     and so is a write in progress: inside list.batch() the writes sit in the source's batch array and
     question.value does not have them yet. */
  private getListRecordAt(index: number, defaultRecord?: any): any {
    if (this.isRemoteData || this.dataList.isWriting) return this.dataList.getRecord(index);
    const val = this.value;
    if (Array.isArray(val) && index < val.length) return index < 0 ? undefined : val[index];
    if (index < 0 || index >= this.rowCount) return undefined;
    return defaultRecord !== undefined ? defaultRecord : this.getUnbindValue(this.getDefaultRowValue(false) || {});
  }
  // Appends default row values until the array holds rowCount records; the array is modified.
  private padRecords(records: Array<any>): Array<any> {
    const rowValue = this.getDefaultRowValue(false) || {};
    for (let i = records.length; i < this.rowCount; i++) {
      records.push(this.getUnbindValue(rowValue));
    }
    return records;
  }
  /* The value shape rules that used to be spread over createNewValue (truncate to rowCount),
     deleteRowValue (null when every record is empty) and correctValueForMinMaxRows. */
  private normalizeRecords(records: Array<any>): any {
    let res = Array.isArray(records) ? records : [];
    if (res.length > this.rowCount) {
      res = res.slice(0, this.rowCount);
    }
    return this.correctValueForMinMaxRows(this.deleteRowValue(res, null));
  }
  // The value is an array of Base objects edited in place (Creator's property grid): it is never
  // routed through the list, see the comments on the operations that branch on it.
  private get isEditingObjectValue(): boolean {
    return this.isValueSurveyElement(this.value);
  }
  private setLastRowRecord(record: any, force: boolean = false): void {
    if (this.isEditingObjectValue) {
      const newValue = this.createNewValue();
      if (newValue.length == this.rowCount) {
        newValue[newValue.length - 1] = record;
        this.value = newValue;
      }
      return;
    }
    const list = this.dataList;
    if (list.count < this.rowCount) return;
    const index = this.getLastRowRecordIndex();
    if (index < 0) return;
    list.setRecord(index, record, force && this.isPaddingPending);
  }
  // The record of the last row: the last created one under a view, the last record otherwise (the
  // window can be longer than rowCount while a value that outgrew it has not been normalized yet).
  private getLastRowRecordIndex(): number {
    if (!this.hasDataListView) return this.rowCount - 1;
    const created = this.dataList.getCreatedIndexes();
    return created.length > 0 ? created[created.length - 1] : -1;
  }
  /* question.value is shorter than rowCount: the padded records the list reads have not reached the
     storage yet. A write that used to compare whole values (it assigned the padded array and the
     comparison saw the new records) has to reach question.value even when its own record did not
     change; a write that compared one row (a cell edit) must not. */
  private get isPaddingPending(): boolean {
    const val = this.value;
    return !Array.isArray(val) || val.length < this.rowCount;
  }
  // Takes a created position - what every public index argument of the reordering methods is - and
  // returns the record it addresses.
  private getRecordIndex(index: number): number {
    const list = this.dataList;
    if (!this.hasDataListView) return Math.max(0, Math.min(index, list.count - 1));
    const created = list.getMaterializedIndexes();
    if (created.length === 0) return -1;
    return created[Math.max(0, Math.min(index, created.length - 1))];
  }
  public dragDropMatrixRows: DragDropMatrixRows;
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value, isLight);
    this.dragDropMatrixRows = new DragDropMatrixRows(this.survey, null, true);
    // isDesignMode is known only once the survey is attached, and the list may have been created
    // before that: paging is off in the Creator, whatever rowsPerPage says.
    if (!!this.dataListValue) {
      this.paging.updatePageSize();
    }
  }

  private draggedRow: MatrixDropdownRowModelBase;
  private isBanStartDrag(pointerDownEvent: PointerEvent): boolean {
    const target = (<HTMLElement>pointerDownEvent.target);
    return target.getAttribute("contenteditable") === "true" || target.nodeName === "INPUT" || !this.isDragHandleAreaValid(target);
  }
  public isDragHandleAreaValid(node:HTMLElement): boolean {
    if (this.matrixCallbacks.matrixDragHandleArea === "icon") {
      return node.classList.contains(this.cssClasses.dragElementDecorator);
    }
    return true;
  }
  public onPointerDown(pointerDownEvent: PointerEvent, row: MatrixDropdownRowModelBase):void {
    if (!row || !this.isRowsDragAndDrop || this.isDesignMode) return;
    if (this.isBanStartDrag(pointerDownEvent)) return;
    this.draggedRow = row;
    this.dragOrClickHelper.onPointerDown(pointerDownEvent);
  }

  public startDragMatrixRow = (event: PointerEvent, targets: ITargets): void => {
    this.dragDropMatrixRows.startDrag(event, this.draggedRow, this, targets.target);
  };

  public getType(): string {
    return "matrixdynamic";
  }
  public getValueType(): QuestionValueType {
    return "array";
  }
  protected getAllChildren(): Base[] {
    return [
      ...super.getAllChildren(),
      ...this.columns,
      ...this.choices
    ];
  }
  public get isRowsDynamic(): boolean {
    return true;
  }
  /**
   * Specifies whether to display a confirmation dialog when a respondent wants to delete a row.
   *
   * Default value: `false`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))
   * @see confirmDeleteText
   */
  @property() confirmDelete: boolean;

  public get isValueArray(): boolean { return true; }
  /**
   * Specifies a key column. Set this property to a column name, and the question will display `keyDuplicationError` if a user tries to enter a duplicate value in this column.
   * @see keyDuplicationError
   */
  @property({ defaultValue: "" }) keyName: string;
  /**
   * If it is not empty, then this value is set to every new row, including rows created initially, unless the defaultValue is not empty
   * @see defaultValue
   * @see copyDefaultValueFromLastEntry
   */
  @property() defaultRowValue: any;
  /**
   * Specifies whether default values for a new row/column should be copied from the last row/column.
   *
   * If you also specify `defaultValue`, it will be merged with the copied values.
   * @see defaultValue
   * @since 2.0.0
   */
  @property() copyDefaultValueFromLastEntry: boolean;
  /**
   * @deprecated Use the [`copyDefaultValueFromLastEntry`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#copyDefaultValueFromLastEntry) property instead.
   * @hidden
   */
  public get defaultValueFromLastRow(): boolean {
    return this.copyDefaultValueFromLastEntry;
  }
  public set defaultValueFromLastRow(val: boolean) {
    this.copyDefaultValueFromLastEntry = val;
  }
  protected isDefaultValueEmpty(): boolean {
    return (
      super.isDefaultValueEmpty() && this.isValueEmpty(this.defaultRowValue)
    );
  }
  protected valueFromData(val: any): any {
    if (this.minRowCount < 1 || this.isEditingSurveyElement || this.isEmpty()) return super.valueFromData(val);
    return this.correctValueForMinMaxRows(val);
  }
  protected correctValueForMinMaxRows(val: any): any {
    if (!Array.isArray(val)) val = [];
    for (var i = val.length; i < this.minRowCount; i++) val.push({});
    return val;
  }
  protected isNewValueCorrect(val: any): boolean {
    return Array.isArray(val);
  }
  protected setDefaultValue() {
    DynamicItemModelBase.setDefaultValueCore(this, this.defaultRowValue, this.rowCount, () => super.setDefaultValue());
  }
  public moveRowByIndex(fromIndex: number, toIndex: number):void {
    const maxIndex = Math.max(fromIndex, toIndex);
    const rows = this.generatedVisibleRows;
    // The row objects stay where they are and get the reordered records; the detail panel state is
    // the one thing that belongs to the row and has to be swapped with it - before the write.
    if (Array.isArray(rows) && maxIndex < rows.length) {
      const rowTo = rows[toIndex];
      const rowFrom = rows[fromIndex];
      if (this.getIsDetailPanelShowing(rowFrom) !== this.getIsDetailPanelShowing(rowTo)) {
        const isRowToShowing = this.getIsDetailPanelShowing(rowTo);
        this.setIsDetailPanelShowing(rowTo, this.getIsDetailPanelShowing(rowFrom));
        this.setIsDetailPanelShowing(rowFrom, isRowToShowing);
      }
    }
    if (this.isEditingObjectValue) {
      /* A live-object value is reordered in place: the array is a property of the edited object and
         it is its own splices - not a new array - that re-create the rows through
         isEditingObjectValueChanged. */
      const value = this.createNewValue();
      const movableRow = value[fromIndex];
      value.splice(fromIndex, 1);
      value.splice(toIndex, 0, movableRow);
      this.value = value;
    } else {
      const list = this.dataList;
      const from = this.getRecordIndex(fromIndex);
      const to = this.getRecordIndex(toIndex);
      list.move(from, to);
    }
    this.draggedRow = null;
  }
  public addRowByIndex(rowData: any, toIndex: number):void {
    if (this.isRemoteData) {
      // One source.insert at the position the caller named; no count setter and no move.
      this.addRecordRemote(rowData, toIndex);
      this.onRowsChanged();
      return;
    }
    if (this.isEditingObjectValue) {
      const value = this.createNewValue();
      value.splice(toIndex, 0, rowData);
      this.rowCount++;
      this.value = value;
      return;
    }
    // rowCount++ creates the row object and, with it, the record at the end; the record then moves
    // into place and takes rowData, so that the value is written once. The move takes the new record
    // to the record of the row that stood at toIndex, and the new row with it.
    this.rowCount++;
    const list = this.dataList;
    const index = this.getRecordIndex(toIndex);
    if (index < 0) return;
    list.batch((): void => {
      list.move(list.count - 1, index);
      list.setRecord(index, rowData);
    });
  }
  public removeRowByIndex(fromIndex: number):void {
    if (this.isRemoteData) {
      const list = this.dataList;
      const index = this.getRecordIndex(fromIndex);
      if (index < 0) return;
      const position = list.indexToMaterializedIndex(index);
      const rows = this.generatedVisibleRows;
      if (position > -1 && Array.isArray(rows) && position < rows.length) {
        rows.splice(position, 1);
      }
      // One source.remove; question.value and rowCount follow through the recordRemoved notification.
      list.remove(index);
      this.onRowsChanged();
      return;
    }
    if (this.isEditingObjectValue) {
      const value = this.createNewValue();
      value.splice(fromIndex, 1);
      this.rowCount--;
      this.value = value;
      return;
    }
    const list = this.dataList;
    if (fromIndex < 0 || fromIndex >= list.count) return;
    const index = this.getRecordIndex(fromIndex);
    if (index < 0) return;
    /* The record moves to the end and rowCount-- removes it there: the row objects are spliced
       instead of being re-created, exactly as they are when a row is removed by the UI. Both steps
       are one write of question.value - the value used to be assigned twice here, the intermediate
       assignment carrying a row the caller never asked to remove. */
    list.batch((): void => {
      list.move(index, list.count - 1);
      this.rowCount--;
    });
  }
  public dispose(): void {
    this.cancelPendingPageMove();
    super.dispose();
    /* The list goes with the question: it drops its pending-request counter, so a page or a push that
       is still in flight cannot write into a question that is gone. */
    if (!!this.dataListValue) {
      this.dataListValue.dispose();
    }
  }
  public clearOnDrop(): void {
    if (!this.isEditingSurveyElement) {
      this.resetRenderedTable();
    }
  }
  initDataUI(): void {
    if (!this.generatedVisibleRows) {
      this.getVisibleRows();
    }
  }
  /**
   * The number of rows in the matrix.
   *
   * Default value: 2
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see minRowCount
   * @see maxRowCount
   * @see rowCountExpression
   */
  public get rowCount(): number {
    return this.rowCountValue;
  }
  public set rowCount(val: number) {
    val = Helpers.getNumber(val);
    /* The data source owns the count: the question never grows or truncates its storage, and the
       count reaches it the other way round - through setLoadedRecords, from a read that committed.
       An incoming total above settings.matrix.maxRowCount is accepted there; the clamp below stays
       what it has always been, a limit on what a caller may ask for. */
    if (this.isRemoteData) return;
    if (val < 0 || val > settings.matrix.maxRowCount || val === this.rowCount) return;
    this.setRowCountValueFromData = false;
    var prevValue = this.rowCountValue;
    this.rowCountValue = val;
    /* Before the truncation, not after it: rowCount decides how many records the window holds, so
       the ones the padding just created or dropped have to reach the view first - the removals that
       follow are made against the record count the new rowCount produced. */
    this.syncDataListRecordCount();
    if (this.value && this.value.length > val) {
      if (this.isEditingObjectValue) {
        var qVal = this.value;
        qVal.splice(val);
        this.value = qVal;
      } else {
        this.dataList.batch((): void => { this.dataList.truncate(val); });
      }
    }
    if (this.isUpdateLocked) {
      this.initialRowCount = val;
      return;
    }
    if (this.generatedVisibleRows || prevValue == 0) {
      if (!this.generatedVisibleRows) {
        this.clearGeneratedRows();
        this.generatedVisibleRows = [];
      }
      if (this.hasDataListView) {
        this.updateRowsForCreatedIndexes();
      } else {
        this.generatedVisibleRows.splice(val);
        for (var i = prevValue; i < val; i++) {
          var newRow = this.createMatrixRow(this.getValueForNewRow());
          this.generatedVisibleRows.push(newRow);
          this.onMatrixRowCreated(newRow);
        }
      }
      this.runCondition(this.getDataFilteredProperties());
    }
    this.onRowsChanged();
  }
  /* rowCount no longer says how many rows there are while a filter is active: the created indexes
     do. A record that appeared gets a row appended (it is always in the view); records that
     disappeared can be anywhere in the view, so their rows are rebuilt rather than sliced off. */
  private updateRowsForCreatedIndexes(): void {
    const created = this.dataList.getMaterializedIndexes();
    const rows = this.generatedVisibleRows;
    // Under paging the rows are the page: a record added in front of the page, or one the page
    // gives up for it, is a different page, not an appended row.
    const isPageChanged = this.isPagingActive && rows.some((row: MatrixDropdownRowModelBase, i: number): boolean =>
      (<MatrixDynamicRowModel>row).builtRecordIndex !== created[i]);
    if (created.length < rows.length || isPageChanged) {
      this.rebuildRowsFromDataList();
      return;
    }
    for (let i = rows.length; i < created.length; i++) {
      const newRow = this.createMatrixRow(this.getValueForNewRow());
      newRow.builtRecordIndex = created[i];
      rows.push(newRow);
      this.onMatrixRowCreated(newRow);
    }
  }
  /**
   * An expression that dynamically calculates the row count. Overrides the static [`rowCount`](#rowCount) property.
   *
   * The calculation result is clamped to the [`minRowCount`](#minRowCount) and [`maxRowCount`](#maxRowCount) limits: a value below the minimum is set to `minRowCount`, and a value above the maximum is capped at `maxRowCount`. The global [`settings.matrix.maxRowCount`](/form-library/documentation/api-reference/settings#matrix) setting also limits the maximum.
   *
   * While this property is set, users cannot add or remove rows manually. The expression is reevaluated when its referenced values or row limits change.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   * @since 3.0.4
   */
  @property() rowCountExpression: string;
  /* A data source owns the number of records, so rowCountExpression is ignored while one is attached
     - including the add/remove gating it otherwise imposes. No error: a question may carry both and
     only the source decides. */
  private get hasRowCountExpression(): boolean {
    return !!this.rowCountExpression && !this.isRemoteData;
  }
  private setRowCountByExpression(val: any): void {
    const maxCount = Math.min(this.maxRowCount, settings.matrix.maxRowCount);
    this.rowCount = DynamicItemModelBase.getItemCountByExpressionValue(val, this.minRowCount, maxCount);
  }
  /* The result is clamped by minRowCount/maxRowCount, so changing a limit has to recalculate
     it: the raw expression result is not stored anywhere */
  private rerunRowCountExpression(): void {
    if (this.isLoadingFromJson || !this.canRunConditions()) return;
    this.runExpressionByProperty("rowCountExpression", this.getDataFilteredProperties(),
      (val: any): void => { this.setRowCountByExpression(val); });
  }
  protected updateBindings(propertyName: string, value: any): void {
    if (propertyName === "rowCount" && this.hasRowCountExpression) return;
    super.updateBindings(propertyName, value);
  }
  protected updateBindingProp(propName: string, value: any): void {
    if (propName === "rowCount" && this.hasRowCountExpression) return;
    super.updateBindingProp(propName, value);
    const rows = this.generatedVisibleRows;
    if (propName !== "rowCount" || !Array.isArray(rows)) return;
    const val = this.getUnbindValue(this.value) || [];
    if (val.length < rows.length) {
      let hasValue = false;
      for (let i = val.length; i < rows.length; i ++) {
        hasValue ||= !rows[i].isEmpty;
        val.push(rows[i].value || {});
      }
      if (hasValue) {
        this.value = val;
      }
    }
  }
  protected updateProgressInfoByValues(res: IProgressInfo): void {
    let val = this.value;
    if (!Array.isArray(val)) val = [];
    // The rows of a remote page: the records the matrix has not read say nothing about how far the
    // respondent has got with the ones in front of them.
    const count = this.isRemoteData ? val.length : this.rowCount;
    for (var i = 0; i < count; i ++) {
      const rowValue = i < val.length ? val[i] : {};
      this.updateProgressInfoByRow(res, rowValue);
    }
  }
  private getValueForNewRow(): any {
    var res = null;
    if (!!this.onGetValueForNewRowCallBack) {
      res = this.onGetValueForNewRowCallBack(this);
    }
    return res;
  }
  /**
   * Specifies whether users can drag and drop matrix rows to reorder them. Applies only if [`transposeData`](#transposeData) is `false`.
   *
   * Default value: `false`
   * @since 2.0.0
   */
  @property() allowRowReorder: boolean;
  /**
   * @deprecated Use the [`allowRowReorder`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#allowRowReorder) property instead.
   * @hidden
   */
  public get allowRowsDragAndDrop(): boolean {
    return this.allowRowReorder;
  }
  public set allowRowsDragAndDrop(val: boolean) {
    this.allowRowReorder = val;
  }
  public get allowRowDragIn() {
    return !(this.survey as any)?.onMatrixRowDragOver?.isEmpty;
  }
  public get isRowsDragAndDrop(): boolean {
    // Under a sort the row order is the sort's: dragging a row would say nothing about where the
    // record goes. A data source without a move method cannot be told about a reorder either.
    return this.allowRowReorder && !this.isReadOnly && this.dataList.sort.length === 0 && this.canMoveRecord;
  }
  /* The capabilities of a data source are declared by the presence of its optional methods: a source
     without insert gets no add button, one without remove no delete button, one without move no drag
     handles, and one without update makes every cell read-only - a silently unsaved edit is worse
     than a disabled field, and an application that wants local-only edits over remote reads
     implements a no-op update. A matrix without a data source has every capability. */
  private get canInsertRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("insert");
  }
  private get canRemoveRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("remove");
  }
  private get canUpdateRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("update");
  }
  private get canMoveRecord(): boolean {
    return !this.isRemoteData || this.remote.hasCapability("move");
  }
  // One hook for the whole matrix, not one per cell: the cell questions read it through
  // data.isMatrixReadOnly() (parentIsReadOnly).
  public isMatrixReadOnly(): boolean {
    return super.isMatrixReadOnly() || !this.canUpdateRecord;
  }
  @property({ defaultValue: 0 }) lockedRowCount: number;
  /* Enables the header-click sort the UI series will add; a column opts out with
     column.allowSort = false. This step only stores and exposes it - the sort itself is assigned
     through sortOrder/sortBy. */
  @property({ defaultValue: false }) allowSortRows: boolean;

  public get iconDragElement(): string {
    return this.cssClasses.iconDragElement;
  }

  protected createRenderedTable(): QuestionMatrixDropdownRenderedTable {
    return new QuestionMatrixDynamicRenderedTable(this);
  }
  private get rowCountValue(): number {
    return this.getPropertyValue("rowCount");
  }
  private set rowCountValue(val: number) {
    this.setPropertyValue("rowCount", val);
  }
  /**
   * A minimum number of rows in the matrix. Users cannot delete rows if `rowCount` equals `minRowCount`.
   *
   * Default value: 0
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see rowCount
   * @see maxRowCount
   * @see allowRemoveRows
   */
  @property({ onSetting: (val: number) => val < 0 ? 0 : val }) minRowCount: number;

  private onMinRowCountChanged(): void {
    const val = this.minRowCount;
    if (val > this.maxRowCount)this.maxRowCount = val;
    if (this.initialRowCount < val)this.initialRowCount = val;
    if (this.rowCount < val)this.rowCount = val;
    this.rerunRowCountExpression();
  }
  /**
   * A maximum number of rows in the matrix. Users cannot add new rows if `rowCount` equals `maxRowCount`.
   *
   * Default value: 1000 (inherited from [`settings.matrix.maxRowCount`](https://surveyjs.io/form-library/documentation/settings#matrixMaximumRowCount))
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see rowCount
   * @see minRowCount
   * @see allowAddRows
   */
  @property({ onSetting: (val: number) => val <= 0 ? 1 : val > settings.matrix.maxRowCount ? settings.matrix.maxRowCount : val }) maxRowCount: number;

  private onMaxRowCountChanged(): void {
    const val = this.maxRowCount;
    if (val < this.minRowCount)this.minRowCount = val;
    if (this.rowCount > val)this.rowCount = val;
    this.rerunRowCountExpression();
  }
  /**
   * Specifies whether users are allowed to add new rows.
   *
   * Default value: `true`
   * @see canAddRow
   * @see allowRemoveRows
   */
  @property() allowAddRows: boolean;
  /**
   * Specifies whether users are allowed to delete rows.
   *
   * Default value: `true`
   * @see canRemoveRows
   * @see allowAddRows
   */
  @property() allowRemoveRows: boolean;
  /**
   * Indicates whether it is possible to add a new row.
   *
   * This property returns `true` when all of the following conditions apply:
   *
   * - Users are allowed to add new rows (`allowAddRows` is `true`).
   * - The question, its parent panel, or survey is not in read-only state.
   * - `rowCount` is less than `maxRowCount`.
   * @see allowAddRows
   * @see isReadOnly
   * @see rowCount
   * @see maxRowCount
   * @see canRemoveRows
   */
  public get canAddRow(): boolean {
    return (
      this.allowAddRows && !this.isReadOnly && !this.hasRowCountExpression &&
      this.canInsertRecord && this.rowCount < this.maxRowCount
    );
  }
  public canRemoveRowsCallback: (allow: boolean) => boolean;
  /**
   * Indicates whether it is possible to delete rows.
   *
   * This property returns `true` when all of the following conditions apply:
   *
   * - Users are allowed to delete rows (`allowRemoveRows` is `true`).
   * - The question, its parent panel, or survey is not in read-only state.
   * - `rowCount` exceeds `minRowCount`.
   * @see allowRemoveRows
   * @see isReadOnly
   * @see rowCount
   * @see minRowCount
   * @see canAddRow
   */
  public get canRemoveRows(): boolean {
    var res =
      this.allowRemoveRows &&
      !this.isReadOnly &&
      !this.hasRowCountExpression &&
      this.canRemoveRecord &&
      this.rowCount > this.minRowCount;
    return !!this.canRemoveRowsCallback ? this.canRemoveRowsCallback(res) : res;
  }
  public canRemoveRow(row: MatrixDropdownRowModelBase): boolean {
    if (!this.survey) return true;
    // lockedRowCount counts records: the first N records are locked wherever they are shown. The
    // event keeps getting the created position it has always got.
    const recordIndex = (<MatrixDynamicRowModel>row).rowIndex - 1;
    if (this.lockedRowCount > 0 && recordIndex < this.lockedRowCount) return false;
    return this.matrixCallbacks.matrixAllowRemoveRow(this, this.getItemIndex(row), row);
  }
  /* "Add" is a move the respondent makes when the new row lands on another page than the one shown:
     that page is validated first (layer 1), and the add happens once it has passed - later, when
     its validators are asynchronous. */
  public addRowUI(): void {
    if (this.isAddLeavingPage()) {
      this.pageValidation.leave(true, (): void => { this.addRow(true); });
      return;
    }
    this.addRow(true);
  }
  // An added record is appended: it lands on the page after the last visible record.
  private isAddLeavingPage(): boolean {
    if (!this.isPagedInMemory || !this.canAddRow) return false;
    const list = this.dataList;
    return this.paging.getPageOfVisibleIndex(list.visibleCount) !== list.pageIndex;
  }
  /* Under paging the added record's page is shown: it is where the respondent must see the row they
     added. A move from code - the add itself was validated - and before onMatrixRowAdded, so that the
     event gets the new row. */
  private showPageOfAddedRecord(): void {
    const list = this.dataList;
    const recordIndex = this.getLastRowRecordIndex();
    if (recordIndex < 0) return;
    this.pageValidation.markEdited(recordIndex);
    const visibleIndex = list.getVisibleIndexes().indexOf(recordIndex);
    if (visibleIndex < 0) return;
    const page = this.paging.getPageOfVisibleIndex(visibleIndex);
    if (page !== list.pageIndex) {
      this.paging.pageIndex = page;
    }
  }
  private getQuestionToFocusOnAddingRow(): Question {
    if (this.visibleRows.length === 0) return null;
    var row = this.visibleRows[this.visibleRows.length - 1];
    for (var i = 0; i < row.cells.length; i++) {
      var q = row.cells[i].question;
      if (!!q && q.isVisible && !q.isReadOnly) {
        return q;
      }
    }
    return null;
  }
  /**
   * Creates and adds a new row to the matrix.
   * @param setFocus *(Optional)* Pass `true` to focus the cell in the first column.
   */
  public addRow(setFocus?: boolean): void {
    const oldRowCount = this.rowCount;
    const allow = this.canAddRow;
    var options = { question: this, canAddRow: allow, allow: allow };
    if (!!this.survey) {
      this.matrixCallbacks.matrixBeforeRowAdded(options);
    }
    const newAllow = allow !== options.allow ? options.allow :
      (allow !== options.canAddRow ? options.canAddRow : allow);
    if (!newAllow) return;
    this.onStartRowAddingRemoving();
    this.addRowCore();
    this.onEndRowAdding();
    this.singleInputOnAddItem(false);
    if (this.detailPanelShowOnAdding && this.visibleRows.length > 0) {
      this.visibleRows[this.visibleRows.length - 1].showDetailPanel();
    }
    if (setFocus && oldRowCount !== this.rowCount) {
      const q = this.getQuestionToFocusOnAddingRow();
      if (!!q) {
        q.focus();
      }
    }
  }
  /**
   * Specifies whether to expand the detail section immediately when a respondent adds a new row.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))
   * @see detailPanelMode
   */
  @property() detailPanelShowOnAdding: boolean;

  protected runConditionsForColumns(properties: HashTable<any>): boolean { return false; }
  public unbindValue() {
    this.clearGeneratedRows();
    this.clearPropertyValue("value");
    this.rowCountValue = 0;
    super.unbindValue();
  }
  protected isValueSurveyElement(val: any): boolean {
    return this.isEditingSurveyElement || super.isValueSurveyElement(val);
  }
  /* The remote counterpart of addRowCore. The local path grows rowCount first and writes the
     defaults afterwards, which over a data source is a throwing count setter followed by up to three
     server calls for one gesture. Here the complete record is built first - the column defaults, the
     defaultRowValue and then the copy from the last entry IN THE WINDOW - and handed to the list
     once: one source.insert, no move, no follow-up update. question.value and rowCount follow the
     window through the recordAdded notification. */
  private addRowCoreRemote(): void {
    const defaultValue = this.getDefaultRowValue(true);
    const createdCount = this.dataList.getMaterializedIndexes().length;
    this.addRecordRemote(this.isValueEmpty(defaultValue) ? {} : defaultValue, createdCount);
    if (this.data) {
      this.runCellsCondition(this.getDataFilteredProperties());
    }
    const rows = this.generatedVisibleRows;
    if (this.survey && Array.isArray(rows) && rows.length > 0) {
      this.matrixCallbacks.matrixRowAdded(this, rows[rows.length - 1]);
    }
    this.onRowsChanged();
  }
  /* One record into the loaded window at a created position. A record appended to the window gets a
     row of its own and the rows that exist keep their state; a record inserted in front of them
     moves every row after it onto another record, so those are rebuilt - the same rebuild a page
     change runs. */
  private addRecordRemote(record: any, position: number): void {
    const list = this.dataList;
    // Positions of rows: the materialized set, which for a source that pages itself is the window.
    const createdCount = list.getMaterializedIndexes().length;
    const at = Math.max(0, Math.min(position, createdCount));
    list.add(record, at < createdCount ? list.materializedIndexToIndex(at) : list.loadedCount);
    if (at < createdCount) {
      this.rebuildRowsFromDataList();
      return;
    }
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows)) return;
    const newRow = this.createMatrixRow(list.getRecord(list.materializedIndexToIndex(at)));
    newRow.builtRecordIndex = list.materializedIndexToIndex(at);
    rows.push(newRow);
    this.onMatrixRowCreated(newRow);
  }
  private addRowCore() {
    if (this.isRemoteData) {
      this.addRowCoreRemote();
      return;
    }
    var prevRowCount = this.rowCount;
    this.rowCount = this.rowCount + 1;
    var defaultValue = this.getDefaultRowValue(true);
    if (!this.isValueEmpty(defaultValue)) {
      this.setLastRowRecord(defaultValue, true);
    }
    if (this.data) {
      this.runCellsCondition(this.getDataFilteredProperties());
      const rows = this.generatedVisibleRows;
      if (this.isValueEmpty(defaultValue) && rows.length > 0) {
        const row = rows[rows.length - 1];
        // A live-object value is never written back from the row here, as before. Under paging the
        // last row of the page is the new record's only when the page has room for it.
        const isNewRow = !this.isPagingActive || (<MatrixDynamicRowModel>row).builtRecordIndex === this.getLastRowRecordIndex();
        if (isNewRow && !this.isValueEmpty(row.value) && !this.isEditingObjectValue) {
          this.setLastRowRecord(row.value);
        }
      }
    }
    if (this.isPagedInMemory && prevRowCount + 1 == this.rowCount) {
      this.showPageOfAddedRecord();
    }
    if (this.survey) {
      const rows = this.visibleRows;
      if (prevRowCount + 1 == this.rowCount && rows.length > 0) {
        const row = rows[rows.length - 1];
        this.matrixCallbacks.matrixRowAdded(this, row);
        this.onRowsChanged();
      }
    }
  }
  private getDefaultRowValue(isRowAdded: boolean): any {
    var res = null;
    for (var i = 0; i < this.columns.length; i++) {
      var q = this.columns[i].templateQuestion;
      if (!!q && !this.isValueEmpty(q.getDefaultValue())) {
        res = res || {};
        (<any>res)[this.columns[i].name] = q.getDefaultValue();
      }
    }
    if (!this.isValueEmpty(this.defaultRowValue)) {
      for (var key in this.defaultRowValue) {
        res = res || {};
        (<any>res)[key] = this.defaultRowValue[key];
      }
    }
    if (isRowAdded && this.copyDefaultValueFromLastEntry) {
      var rowValue = this.getLastEntryRecord();
      for (var key in rowValue) {
        res = res || {};
        (<any>res)[key] = rowValue[key];
      }
    }
    return res;
  }
  /* The record copyDefaultValueFromLastEntry copies from. The local path runs after rowCount was
     already grown, so the last entry is the record before the new one; the remote path builds the
     record before the insert, so it is the last record of the loaded window - the record beyond it
     is on the server. */
  private getLastEntryRecord(): any {
    if (this.isRemoteData) {
      const list = this.dataList;
      const created = list.getMaterializedIndexes();
      return created.length > 0 ? list.getRecord(created[created.length - 1]) : undefined;
    }
    const val = this.value;
    if (!!val && Array.isArray(val) && val.length >= this.rowCount - 1) return val[this.rowCount - 2];
    return undefined;
  }
  public focusAddBUtton(): void {
    this.toolbar.getActionById("sv-md-add-btn")?.getInputElement()?.focus();
  }
  public getActionCellIndex(row: MatrixDropdownRowModelBase): number {
    const headerShift = this.showHeader ? 1 : 0;
    if (this.isColumnLayoutHorizontal) {
      return row.cells.length;
    }
    return this.visibleRows.indexOf(row) + headerShift;
  }
  public removeRowUI(value: any): void {
    if (!!value && !!value.rowName) {
      var index = this.visibleRows.indexOf(value);
      if (index < 0) return;
      value = index;
    }
    this.removeRow(value, undefined, () => {
      const rowCount = this.visibleRows.length;
      const nextIndex = index >= rowCount ? rowCount - 1 : index;
      const nextRow = nextIndex > -1 ? this.visibleRows[nextIndex] : undefined;
      setTimeout(() => {
        this.focusActionCellOrAddButton(nextRow);
      }, 10);
      /* A remote page that is read again after the removal is rebuilt when the read commits, and the
         row focused above goes with it: the position is focused once more after that rebuild. A
         refill that completed inside the removal needs nothing - the rows above are already the
         rebuilt ones. */
      if (!!this.remoteValue)this.remoteValue.keepFocusIndexForRead(value);
    });
  }
  private focusActionCellOrAddButton(row: MatrixDropdownRowModelBase): void {
    if (row) {
      this.renderedTable.focusActionCell(row, this.getActionCellIndex(row));
    } else {
      this.focusAddBUtton();
    }
  }
  // After the rows were rebuilt from a committed read; through the same timeout as removeRowUI: the
  // rows have to be rendered before they can be focused.
  private focusActionCellAfterRead(): void {
    if (!this.remoteValue) return;
    const index = this.remoteValue.takeFocusIndexAfterRead(this.id, this.getWrapperElement());
    if (index < 0) return;
    setTimeout(() => {
      if (this.isDisposed) return;
      const rows = this.visibleRows;
      const rowIndex = Math.min(index, rows.length - 1);
      this.focusActionCellOrAddButton(rowIndex > -1 ? rows[rowIndex] : undefined);
    }, 10);
  }
  public isRequireConfirmOnRowDelete(index: number): boolean {
    if (!this.confirmDelete) return false;
    if (index < 0 || index >= this.rowCount) return false;
    var value = this.createNewValue();
    if (this.isValueEmpty(value) || !Array.isArray(value)) return false;
    if (index >= value.length) return false;
    return !this.isValueEmpty(value[index]);
  }
  /**
   * Removes a matrix row with a specified index.
   * @param index A zero-based row index.
   * @param confirmDelete *(Optional)* A Boolean value that specifies whether to display a confirmation dialog. If you do not specify this parameter, the [`confirmDelete`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#confirmDelete) property value is used.
   */
  public removeRow(index: number, confirmDelete?: boolean, onRowRemoved?: () => void): void {
    if (!this.canRemoveRows) return;
    if (index < 0 || index >= this.rowCount) return;
    var row =
      !!this.visibleRows && index < this.visibleRows.length
        ? this.visibleRows[index]
        : null;
    if (confirmDelete === undefined) {
      confirmDelete = this.isRequireConfirmOnRowDelete(index);
    }
    if (confirmDelete) {
      confirmActionAsync({
        message: this.confirmDeleteText,
        funcOnYes: () => {
          this.removeRowAsync(index, row);
          onRowRemoved && onRowRemoved();
        },
        locale: this.getLocale(),
        rootElement: this.survey.rootElement,
        cssClass: this.cssClasses.confirmDialog
      });
      return;
    }
    this.removeRowAsync(index, row);
    onRowRemoved && onRowRemoved();
  }
  private removeRowAsync(index: number, row: MatrixDropdownRowModelBase): void {
    if (!!row && !!this.survey && !this.matrixCallbacks.matrixRowRemoving(this, index, row)) return;
    this.onStartRowAddingRemoving();
    this.removeRowCore(index);
    this.singleInputOnRemoveItem(index);
    this.onEndRowRemoving(row);
    if (this.initialRowCount > this.rowCount) {
      this.initialRowCount = this.rowCount;
    }
  }
  private removeRowCore(index: number) {
    var row = this.visibleRows
      ? this.visibleRows[index]
      : null;
    index = this.generatedVisibleRows.indexOf(row);
    if (index < 0) return;
    // index is a created position from here on; the record it holds is what leaves the storage.
    const recordIndex = this.dataList.materializedIndexToIndex(index);
    const pageIndex = this.dataList.pageIndex;
    if (this.generatedVisibleRows && index < this.generatedVisibleRows.length) {
      this.generatedVisibleRows.splice(index, 1);
    }
    /* A record beyond question.value is padding: a row that was added and never filled, or every row
       of a matrix with no value. There is nothing to write, and the list cannot remove it either -
       the padded window has just lost it together with rowCount. The list learns the new count
       instead, or a page index left past the last page would show an empty page. */
    const val = this.value;
    const isPaddingRecord = !Array.isArray(val) || recordIndex >= val.length;
    this.rowCountValue--;
    if (isPaddingRecord) {
      this.syncDataListRecordCount();
    } else if (this.value) {
      this.isRowChanging = true;
      if (this.isEditingObjectValue) {
        // The live array is spliced in place: that is what removes the row from the edited object.
        const val = this.createValueCopy();
        val.splice(index, 1);
        this.value = val;
      } else if (recordIndex > -1) {
        this.dataList.remove(recordIndex);
      }
      this.isRowChanging = false;
    }
    /* The page came up one record short, and the first record of the next page belongs on it now: the
       page is refilled, as a data source's remove refill does (step 08). A remove that emptied the
       last page moved the page back, and that page change rebuilt it already. */
    if (this.isPagedInMemory && this.dataList.pageIndex === pageIndex) {
      this.rebuildRowsFromDataList();
    }
    this.onRowsChanged();
    if (this.survey) {
      this.matrixCallbacks.matrixRowRemoved(this, index, row);
    }
  }
  protected createSingleInputBehavior(): QuestionSingleInputBehavior {
    return new MatrixDynamicSingleInputBehavior(this);
  }
  /**
   * A message displayed in a confirmation dialog that appears when a respondent wants to delete a row.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))
   * @see confirmDelete
   */
  @property ({ localizable: { defaultStr: "confirmDelete" } }) confirmDeleteText: string;
  /**
   * A caption for the Add Row button.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see addRowButtonLocation
   */
  @property ({ localizable: { defaultStr: "addRow",
    onCreate: (obj: QuestionMatrixDynamicModel, locStr: LocalizableString) =>
      locStr.onGetTextCallback = (text: string): string => text || obj.defaultAddRowText
  } }) addRowText: string;
  private get defaultAddRowText(): string {
    return this.getLocalizationString(
      this.isColumnLayoutHorizontal ? "addRow" : "addColumn"
    );
  }
  public getSingleInputTitleTemplate(): string { return "rowIndexTemplateTitle"; }
  /**
   * Specifies the location of the Add Row button.
   *
   * Possible values:
   *
   * - `"top"` - Displays the Add Row button at the top of the matrix.
   * - `"bottom"` - Displays the Add Row button at the bottom of the matrix.
   * - `"topBottom"` - Displays the Add Row button at the top and bottom of the matrix.
   *
   * Default value: `"top"` if [`transposeData`](#transposeData) is `true`; `"bottom"` if `transposeData` is `false` or the matrix is in compact mode.
   * @see addRowText
   * @since 2.0.0
   */
  @property() addRowButtonLocation: string;
  /**
   * @deprecated Use the [`addRowButtonLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#addRowButtonLocation) property instead.
   * @hidden
   */
  public get addRowLocation(): string {
    return this.addRowButtonLocation;
  }
  public set addRowLocation(val: string) {
    this.addRowButtonLocation = val;
  }
  public getAddRowLocation(): string {
    return this.addRowButtonLocation;
  }
  /**
   * Specifies whether to hide columns when the matrix does not contain any rows. If you enable this property, the matrix displays the `noRowsText` message and the Add Row button.
   *
   * Default value: `false`
   * @see noRowsText
   */
  @property() hideColumnsIfEmpty: boolean;

  public getShowColumnsIfEmpty() {
    return this.hideColumnsIfEmpty;
  }
  /**
   * Use this property to change the default value of remove row button text.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))
   */
  @property({ localizable: { defaultStr: "removeRow" } }) removeRowText: string;
  /**
   * A message displayed when the matrix does not contain any rows. Applies only if `hideColumnsIfEmpty` is enabled.
   * @see hideColumnsIfEmpty
   * @since 2.0.0
   */
  @property({ localizable: { defaultStr: true } }) noRowsText: string;
  public get locEditRowText(): LocalizableString {
    return this.getOrCreateLocStr("editRowText", false, "editText");
  }
  /**
   * @deprecated Use the [`noRowsText`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#noRowsText) property instead.
   * @hidden
   */
  public get emptyRowsText(): string {
    return this.noRowsText;
  }
  public set emptyRowsText(val: string) {
    this.noRowsText = val;
  }
  get locEmptyRowsText(): LocalizableString {
    return this.locNoRowsText;
  }
  public getValueGetterContext(): IValueGetterContext {
    return new MatrixDynamicValueGetterContext(this);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value || !Array.isArray(value)) return value;
    var values = this.getUnbindValue(value);
    var rows = this.visibleRows;
    if (this.isPagingActive && !this.isRemoteData) return this.getPagedDisplayValue(keysAsText, values);
    for (var i = 0; i < rows.length && i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      values[i] = this.getRowDisplayValue(keysAsText, rows[i], val);
    }
    return values;
  }
  /* Under paging (OPEN 57): a record on the page reads its display values from its row's cells, a
     record without a row through the column's templateQuestion - nothing is built on this live path.
     Choices that depend on {row.x}, and a choicesByUrl whose answer is not cached, give the value. */
  private getPagedDisplayValue(keysAsText: boolean, values: Array<any>): Array<any> {
    const rows = this.generatedVisibleRows || [];
    const positions = this.getMaterializedPositions();
    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      if (!val) continue;
      const row = positions[i] !== undefined ? rows[positions[i]] : undefined;
      values[i] = !!row ? this.getRowDisplayValue(keysAsText, row, val) : this.getRecordDisplayValue(keysAsText, val);
    }
    return values;
  }
  private getRecordDisplayValue(keysAsText: boolean, rowValue: any): any {
    const keys = Object.keys(rowValue);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const column = this.getColumnByName(key);
      const question = !!column ? column.templateQuestion : undefined;
      if (!question) continue;
      const displayValue = question.getDisplayValue(keysAsText, rowValue[key]);
      if (keysAsText && !!question.title && question.title !== key) {
        rowValue[question.title] = displayValue;
        delete rowValue[key];
      } else {
        rowValue[key] = displayValue;
      }
    }
    return rowValue;
  }
  protected getConditionObjectRowName(index: number): string {
    return "[" + index.toString() + "]";
  }
  protected getConditionObjectsRowIndeces() : Array<number> {
    const res = [];
    const rowCount = Math.max(this.rowCount, 1);
    for (var i = 0; i < Math.min(settings.matrix.maxRowCountInCondition, rowCount); i++) {
      res.push(i);
    }
    return res;
  }
  public supportAutoAdvance(): boolean {
    return false;
  }
  public get hasRowText(): boolean {
    return false;
  }
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (!isOnValueChanged && !this.validateMinRows()) {
      errors.push(new MinRowCountError(this.minRowCount, this));
    }
  }
  private validateMinRows(): boolean {
    if (this.minRowCount <= 0 || !this.isRequired || !this.generatedVisibleRows)
      return true;
    let setRowCount = 0;
    this.generatedVisibleRows.forEach(row => {
      if (!row.isEmpty) setRowCount++;
    });
    return setRowCount >= this.minRowCount;
  }
  protected getUniqueColumnsNames(): Array<string> {
    var res = super.getUniqueColumnsNames();
    const name = this.keyName;
    if (!!name && res.indexOf(name) < 0) {
      res.push(name);
    }
    return res;
  }
  protected generateRows(): Array<MatrixDynamicRowModel> {
    var result = new Array<MatrixDynamicRowModel>();
    if (this.rowCount === 0) return result;
    var val = this.createNewValue();
    const indexes = this.getRecordIndexesForRows();
    for (var i = 0; i < indexes.length; i++) {
      const row = this.createMatrixRow(this.getRowValueByIndex(val, indexes[i]));
      row.builtRecordIndex = indexes[i];
      result.push(row);
    }
    if (!this.isValueEmpty(this.getDefaultRowValue(false))) {
      this.value = val;
    }
    return result;
  }
  /* One row per record in the view. Without a filter and a sort that is one row per record, in
     record order, which is what createNewValue() composed the value for. The live-object value
     (Creator's property grid) is never filtered: its rows follow the edited array. */
  private getRecordIndexesForRows(): Array<number> {
    if (this.isEditingObjectValue || !this.hasDataListView) {
      const res = new Array<number>(this.rowCount);
      for (let i = 0; i < this.rowCount; i++) {
        res[i] = i;
      }
      return res;
    }
    return this.dataList.getMaterializedIndexes();
  }
  protected createMatrixRow(value: any): MatrixDynamicRowModel {
    return new MatrixDynamicRowModel(this.rowCounter++, this, value);
  }
  private lastDeletedRow: MatrixDropdownRowModelBase;
  private getInsertedDeletedIndex(rows: MatrixDropdownRowModelBase[], val: any[]): number {
    const len = Math.min(rows.length, val.length);
    for (let i = 0; i < len; i ++) {
      if (val[i] !== rows[i].editingObj) return i;
    }
    return len;
  }
  private isEditingObjectValueChanged(): boolean {
    const val = this.value;
    if (!this.generatedVisibleRows || !this.isValueSurveyElement(val)) return false;
    let lastDelRow = this.lastDeletedRow;
    this.lastDeletedRow = undefined;
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(val) || Math.abs(rows.length - val.length) > 1 || rows.length === val.length) return false;
    const index = this.getInsertedDeletedIndex(rows, val);
    if (rows.length > val.length) {
      this.lastDeletedRow = rows[index];
      const row = rows[index];
      rows.splice(index, 1);
      this.setPropertyValueDirectly("rowCount", val.length);
      if (this.isRendredTableCreated) {
        this.renderedTable.onRemovedRow(row);
      }
    } else {
      let newRow = undefined;
      if (!!lastDelRow && lastDelRow.editingObj === val[index]) {
        newRow = lastDelRow;
      } else {
        lastDelRow = undefined;
        newRow = this.createMatrixRow(val[index]);
      }
      rows.splice(index, 0, newRow);
      if (!lastDelRow) {
        this.onMatrixRowCreated(newRow);
      }
      this.setPropertyValueDirectly("rowCount", val.length);
      if (this.isRendredTableCreated) {
        if (this.renderedTable.isRequireReset()) {
          this.resetRenderedTable();
        } else {
          this.renderedTable.onAddedRow(newRow, index);
        }
      }
    }
    return true;
  }
  /* The incoming direction of the canSetValueToSurvey rule: while a data source is attached,
     survey.data = ..., survey.setValue, mergeData and a setvalue trigger do not reach the question.
     The survey hash may then hold a value the question does not show; that is the caller's doing. */
  updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    if (this.isRemoteData) return;
    const isInProcess = this.setRowCountValueFromData;
    this.setRowCountValueFromData = true;
    let refreshRows = false;
    if (!isInProcess && this.minRowCount > 0 && !this.draggedRow) {
      const newLen = Array.isArray(newValue) ? newValue.length : 0;
      const isEditingEl = this.isEditingSurveyElement;
      if (newLen < this.minRowCount && (isEditingEl && this.rowCount > 0 || !isEditingEl && !Helpers.isValueEmpty(this.defaultRowValue))) {
        if (!Array.isArray(newValue)) {
          newValue = [];
        }
        for (let i = newLen; i < this.minRowCount; i ++) {
          if (isEditingEl) {
            this.getValueForNewRow();
          } else {
            newValue.push(Helpers.createCopy(this.defaultRowValue));
          }
        }
      }
      if (isEditingEl && (newLen <= this.minRowCount && this.rowCount > this.minRowCount ||
        newLen > this.minRowCount && this.rowCount <= this.minRowCount)) {
        refreshRows = true;
      }
    }
    super.updateValueFromSurvey(newValue, clearData);
    if (refreshRows) {
      this.onRowsChanged();
    }
    this.setRowCountValueFromData = false;
  }
  /* The data the survey and the expressions see: the rows that exist and are visible. A record the
     list filter excluded has no row and is not part of it - the same answer a source that filters on
     its own side gives, and what makes a total the total of the filtered rows. */
  protected getFilteredDataCore(): any {
    if (this.isPagingActive && !this.isRemoteData) return this.getPagedFilteredData();
    const res: any = [];
    this.generatedVisibleRows.forEach(row => {
      if (row.isVisible && !row.isEmpty) {
        res.push(row.filteredValue);
      }
    });
    return res;
  }
  /* Under paging the survey data and the totals are the view's records, not the page's rows: a
     record with a row gives its filteredValue (the values of invisible cells dropped), a record
     without one is taken as it is stored - it has no cells to be invisible. */
  private getPagedFilteredData(): any {
    const list = this.dataList;
    const rows = this.generatedVisibleRows || [];
    const positions = this.getMaterializedPositions();
    const res: any = [];
    list.getVisibleIndexes().forEach((index: number): void => {
      const row = positions[index] !== undefined ? rows[positions[index]] : undefined;
      if (!!row) {
        if (row.isVisible && !row.isEmpty) res.push(row.filteredValue);
        return;
      }
      const record = this.getListRecordAt(index);
      if (!this.isValueEmpty(record)) res.push(record);
    });
    return res;
  }
  /* Clearing the values of invisible rows may only touch the records that HAVE a row: a record the
     list filter excluded is not invisible, it is unrepresented, and dropping it here would delete
     it from question.value. */
  protected getDataWithoutInvisibleRows(): any {
    if (!this.hasDataListView) return super.getDataWithoutInvisibleRows();
    const list = this.dataList;
    const rows = this.generatedVisibleRows || [];
    const positions = this.getMaterializedPositions();
    const res: any = [];
    // loadedCount, not count: with a data source that pages, count is the server total and only the
    // records of the loaded window can be looked at. Equal for every local source.
    for (let i = 0; i < list.loadedCount; i++) {
      const position = positions[i] !== undefined ? positions[i] : -1;
      const row = position > -1 && position < rows.length ? rows[position] : undefined;
      if (!row) {
        res.push(this.getListRecordAt(i));
      } else if (row.isVisible && !row.isEmpty) {
        res.push(row.filteredValue);
      }
    }
    return res;
  }
  // record index -> position in generatedVisibleRows, for the records that have a row.
  private getMaterializedPositions(): { [index: number]: number } {
    const res: { [index: number]: number } = {};
    this.dataList.getMaterializedIndexes().forEach((index: number, pos: number): void => { res[index] = pos; });
    return res;
  }
  protected getDuplicationEntries(columnName: string): Array<IMatrixDuplicationEntry> {
    if (!this.hasDataListView) return super.getDuplicationEntries(columnName);
    const list = this.dataList;
    const rows = this.generatedVisibleRows || [];
    const res = new Array<IMatrixDuplicationEntry>();
    const positions = this.getMaterializedPositions();
    // Only read, never stored: every padded record can share one default record.
    const defaultRecord = this.getDefaultRowValue(false) || {};
    // The records that are loaded: a duplicate on a page the matrix has not read is the server's
    // business, and a key constraint over a whole remote table cannot be checked here.
    for (let i = 0; i < list.loadedCount; i++) {
      const position = positions[i] !== undefined ? positions[i] : -1;
      const row = position > -1 && position < rows.length ? rows[position] : undefined;
      if (!!row) {
        res.push({ row: row, value: this.getDuplicationValue(row, position, columnName) });
      } else {
        const record = this.getListRecordAt(i, defaultRecord);
        res.push({ row: undefined, value: !!record ? record[columnName] : undefined });
      }
    }
    return res;
  }
  protected onBeforeValueChanged(val: any): void {
    // The record count of a remote-backed matrix comes from the read, never from the length of the
    // window: the window is one page of a larger table.
    if (this.isRemoteData) return;
    if (!val || !Array.isArray(val)) return;
    var newRowCount = val.length;
    if (newRowCount == this.rowCount) return;
    if (!this.setRowCountValueFromData && newRowCount < this.initialRowCount)
      return;
    if (this.isEditingObjectValueChanged()) return;
    this.setRowCountValueFromData = true;
    this.rowCountValue = newRowCount;
    if (!this.generatedVisibleRows) return;
    if (newRowCount == this.generatedVisibleRows.length + 1) {
      this.onStartRowAddingRemoving();
      const newValue = this.getRowValueByIndex(val, newRowCount - 1);
      const newRow = this.createMatrixRow(newValue);
      this.generatedVisibleRows.push(newRow);
      this.onMatrixRowCreated(newRow);
      this.onEndRowAdding();
    } else {
      this.clearGeneratedRows();
      this.getVisibleRows();
      this.onRowsChanged();
    }
    this.setRowCountValueFromData = false;
  }
  // A deep copy of the value, truncated to rowCount and padded up to it.
  protected createNewValue(): any {
    var result = this.createValueCopy();
    if (!result || !Array.isArray(result)) result = [];
    /* The window of a data source is neither truncated nor padded to rowCount: rowCount is the server
       total and the records beyond the window are on the server, not missing from the value. */
    if (this.isRemoteData) return result;
    if (result.length > this.rowCount) result.splice(this.rowCount);
    return this.padRecords(result);
  }
  protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any {
    if (!Array.isArray(newValue)) return newValue;
    var isEmpty = true;
    for (var i = 0; i < newValue.length; i++) {
      if (this.isObject(newValue[i]) && Object.keys(newValue[i]).length > 0) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty ? null : newValue;
  }

  private getRowValueByIndex(questionValue: any, index: number): any {
    return Array.isArray(questionValue) &&
      index >= 0 &&
      index < questionValue.length
      ? questionValue[index]
      : null;
  }
  /* Still reached with an explicit value: onSetQuestionValue, updateValueOnRowsGeneration,
     onRowChanging, runTriggersOnNewRows and getRowObj all compose a value of their own and ask for
     one row of it. The record storage of the question is the list; this is a lookup in a value. */
  protected getRowValueCore(
    row: MatrixDropdownRowModelBase,
    questionValue: any,
    create: boolean = false
  ): any {
    if (!this.generatedVisibleRows) return {};
    var res = this.getRowValueByIndex(questionValue, this.getRecordIndexOf(row));
    if (!res && create) res = {};
    return res;
  }
  // index is a created position; the record it addresses is what the list holds.
  protected getRowValueByIndexCore(index: number): any {
    const res = this.getListRecordAt(this.dataList.materializedIndexToIndex(index));
    return res !== undefined ? res : null;
  }
  /* The one seam between an object and its record. getItemIndex stays the row position - it is
     IMatrixDropdownData API and the rendered table addresses rows by position - and this is the
     record the row at that position holds. */
  private getRecordIndexOf(item: ISurveyData): number {
    const position = this.getItemIndex(item);
    if (position < 0) return -1;
    return this.dataList.materializedIndexToIndex(position);
  }
  getItemRecordIndex(item: ISurveyData): number {
    return this.getRecordIndexOf(item);
  }
  getItemByRecordIndex(recordIndex: number): DynamicItemModelBase {
    const position = this.dataList.indexToMaterializedIndex(recordIndex);
    return position < 0 ? undefined : this.getItem(position);
  }
  protected updateRowValueInData(row: MatrixDropdownRowModelBase, columnName: string,
    newRowValue: any, isDeletingValue: boolean): { rowValue: any, oldCellValue: any } {
    if (this.isEditingObjectValue) return super.updateRowValueInData(row, columnName, newRowValue, isDeletingValue);
    const index = this.getRecordIndexOf(row);
    if (index < 0) return null;
    const list = this.dataList;
    const oldRecord = list.getRecord(index);
    const oldCellValue = oldRecord?.[columnName];
    // The merge is the base's; the record it works on is a copy of the one the list holds.
    const rowValue = Object.assign({}, oldRecord);
    this.mergeRowValue(rowValue, row, columnName, newRowValue, isDeletingValue);
    this.isRowChanging = true;
    const isChanged = list.setRecord(index, rowValue);
    this.isRowChanging = false;
    return isChanged ? { rowValue: rowValue, oldCellValue: oldCellValue } : null;
  }
  onRowVisibilityChanged(row: MatrixDropdownRowModelBase): void {
    super.onRowVisibilityChanged(row);
    // Under paging the records decide the flags (updateRecordsVisibilityByExpression).
    const index = this.isPagingActive ? -1 : this.getRecordIndexOf(row);
    if (index > -1) {
      this.dataList.setRecordVisible(index, row.isVisible);
    }
    // A hidden row takes no page slot: the page count follows row visibility, and the list does not
    // announce it.
    this.syncPagingState();
  }
  protected runCellsCondition(properties: HashTable<any>): boolean {
    // The records decide the page; when it is not the page the rows hold, the rebuild runs the
    // conditions of the new rows itself.
    if (this.updateRecordsVisibilityByExpression(properties) && this.isPageStale()) {
      this.rebuildRowsFromDataList();
      return true;
    }
    const res = super.runCellsCondition(properties);
    this.updateRecordsVisibility();
    return res;
  }
  // A matrix that pages decides rowsVisibleIf over the records; its rows are visible records only.
  protected getRowsVisibleIfForRows(): string {
    return this.isPagingActive ? "" : super.getRowsVisibleIfForRows();
  }
  /* rowsVisibleIf under paging (Andrew's decision 2026-09-25): a page is a slice of the VISIBLE
     records, so the condition is evaluated over every record with a value-only context - {row.x} is
     the record's field, {rowIndex} its number - and the list's hidden flags are written without a
     row. A row that is built runs no rowsVisibleIf of its own (getRowsVisibleIfForRows), so the two
     cannot disagree. Limitation: an expression cell the condition reads contributes its stored
     value. Returns whether a flag changed. */
  private updateRecordsVisibilityByExpression(properties: HashTable<any>): boolean {
    if (!this.isPagingActive || this.isDesignMode || this.isLoadingFromJson) return false;
    const list = this.dataList;
    const expression = this.getExpressionFromSurvey("rowsVisibleIf");
    let isChanged = false;
    if (!expression || this.areInvisibleElementsShowing) {
      if (!this.hasRecordVisibilityFlags) return false;
      this.hasRecordVisibilityFlags = false;
      isChanged = list.setRecordsVisible((): boolean => true);
    } else {
      this.hasRecordVisibilityFlags = true;
      if (!this.recordVisibilityRunner || this.recordVisibilityRunner.expression !== expression) {
        this.recordVisibilityRunner = new ConditionRunner(expression);
      }
      const runner = this.recordVisibilityRunner;
      const item = this.createRecordItem(-1);
      isChanged = list.setRecordsVisible((index: number): boolean => {
        item.reset(index, this.getListRecordAt(index));
        return runner.runContext(item.getValueGetterContext(), properties) === true;
      });
    }
    if (isChanged) {
      this.syncPagingState();
    }
    return isChanged;
  }
  private hasRecordVisibilityFlags: boolean;
  private recordVisibilityRunner: ConditionRunner;
  /* Under in-memory paging the progress is counted from the records - every visible record, every
     input column - as it is before the rows exist: the rows are one page. */
  public getProgressInfo(): IProgressInfo {
    if (!this.isPagingActive || this.isRemoteData) return super.getProgressInfo();
    const res = Base.createProgressInfo();
    this.dataList.getVisibleIndexes().forEach((index: number): void => {
      this.updateProgressInfoByRow(res, this.getListRecordAt(index) || {});
    });
    if (res.requiredQuestionCount === 0 && this.isRequired) {
      res.requiredQuestionCount = 1;
      res.requiredAnsweredQuestionCount = !this.isEmpty() ? 1 : 0;
    }
    return res;
  }
  /* The owner-visibility layer of the list: a record follows row.isVisible - the same flag
     visibleRows is built from - so that dataList.visibleCount and visibleRows.length agree. */
  private updateRecordsVisibility(): void {
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows) || this.isPagingActive) return;
    const list = this.dataList;
    let isChanged = false;
    for (let i = 0; i < rows.length; i++) {
      const index = list.materializedIndexToIndex(i);
      if (index > -1 && list.setRecordVisible(index, rows[i].isVisible)) {
        isChanged = true;
      }
    }
    // A run that changed no flag changed no page count.
    if (isChanged) {
      this.syncPagingState();
    }
  }
  public getRootCss(): string {
    return new CssClassBuilder().append(super.getRootCss()).append(this.cssClasses.empty, !this.renderedTable?.showTable).toString();
  }
  public getToolbarCssClass(location?: "top" | "bottom"): string {
    return new CssClassBuilder().append(this.cssClasses.toolbar)
      .append(this.cssClasses.toolbarBottom, location == "bottom")
      .append(this.cssClasses.toolbarTop, location == "top").toString();
  }
  public getShowToolbar(location?: "top" | "bottom") {
    const showToolbar = !this.isDesignMode && this.canAddRow;
    if (!location) return showToolbar;
    if (this.renderedTable.showTable && showToolbar) {
      if (this.getAddRowLocation() === "default") {
        return this.isColumnLayoutHorizontal ? location == "bottom" : location == "top";
      } else {
        return this.getAddRowLocation().toLowerCase().indexOf(location) >= 0;
      }
    }
    return false;
  }
  private initFooterToolbar() {
    this.toolbarValue = this.createActionContainer();
    this.toolbarValue.setActionsAppearance({ style: "brand", mode: "secondary", size: "small", });
    const addBtnAction = new Action({
      locTitle: this.locAddRowText,
      visible: new ComputedUpdater(() => this.canAddRow),
      action: () => {
        this.addRowUI();
      },
      iconName: <any>new ComputedUpdater(() => this.cssClasses.iconAddId),
      innerCss: new ComputedUpdater(() => new CssClassBuilder().append(this.cssClasses.button).append(this.cssClasses.buttonAdd).toString()) as any as string,
      id: "sv-md-add-btn"
    });
    this.toolbarValue.addAction(addBtnAction);
  }
  private toolbarValue: ActionContainer;
  public get toolbar(): ActionContainer {
    if (!this.toolbarValue) {
      this.initFooterToolbar();
    }
    return this.toolbarValue;
  }
  public getTableCss(): string {
    return new CssClassBuilder().append(super.getTableCss()).append(this.cssClasses.hasFooter, !!this.getShowToolbar("bottom")).toString();
  }
}

class QuestionMatrixDynamicRenderedTable extends QuestionMatrixDropdownRenderedTable {
  protected setDefaultRowActions(
    row: MatrixDropdownRowModelBase,
    actions: Array<IAction>
  ) {
    super.setDefaultRowActions(row, actions);
  }
}

export class MatrixDynamicSingleInputBehavior extends MatrixDropdownBaseSingleInputBehavior {
  protected get matrixDynamic(): QuestionMatrixDynamicModel {
    return this.question as QuestionMatrixDynamicModel;
  }
  protected onSingleInputQuestionAdded(question: Question): void {
    if (!this.matrixDynamic.showHeader) {
      question.titleLocation = "hidden";
    }
  }
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    this.matrixDynamic.syncPageSizeWithMode();
    const res = new Array<Question>();
    const rows = this.matrixDynamic.visibleRows;
    if (checkDynamic) {
      for (let i = 0; i < rows.length; i ++) {
        const row = rows[i];
        // A navigation check, not a validation: it must not show errors or expand detail panels/questions.
        if (!row.hasValueAnyQuestion(true) || !row.validate(new ValidationContext({ fireCallback: false }))) {
          this.fillSingleInputQuestionsByRow(res, row);
        }
      }
    }
    return this.getSingleInputQuestionsForDynamic(question, res);
  }
  public fillSingleInputQuestionsInContainer(res: Array<Question>, innerQuestion: Question): void {
    const row = <MatrixDropdownRowModelBase>innerQuestion.data;
    this.fillSingleInputQuestionsByRow(res, row);
  }
  private fillSingleInputQuestionsByRow(res: Array<Question>, row: MatrixDropdownRowModelBase): void {
    if (row) {
      row.questions.forEach(q => q.addNestedQuestion(res, true, false, false));
    }
  }
  public getSingleInputAddTextCore(): string {
    if (!this.matrixDynamic.canAddRow) return undefined;
    return this.matrixDynamic.addRowText;
  }
  public singleInputAddItemCore(): void {
    this.matrixDynamic.addRowUI();
  }
  protected getSingleQuestionOnChange(index: number): Question {
    const rows = this.matrixDynamic.visibleRows;
    if (rows.length > 0) {
      if (index < 0 || index >= rows.length) index = rows.length - 1;
      const row = rows[index];
      const vQs = row.visibleQuestions;
      if (vQs.length > 0) {
        return vQs[0];
      }
    }
    return null;
  }
  protected createSingleInputSummary(): QuestionSingleInputSummary {
    const md = this.matrixDynamic;
    md.syncPageSizeWithMode();
    const res = new QuestionSingleInputSummary(md, md.locNoRowsText);
    const items = new Array<QuestionSingleInputSummaryItem>();
    const canRemoveRows = md.canRemoveRows;
    md.visibleRows.forEach((row) => {
      const locText = new LocalizableString(new MatrixSingleInputLocOwner(md, row), true, undefined, md.getSingleInputTitleTemplate());
      locText.setJson(md.locSingleInputTitleTemplate.getJson());
      const bntEdit = new Action({ locTitle: md.locEditRowText, action: () => { this.singleInputEditRow(row); } });
      const btnRemove = canRemoveRows && md.canRemoveRow(row) ?
        new Action({ locTitle: md.locRemoveRowText, action: () => { md.removeRowUI(row); } }) : undefined;
      items.push(new QuestionSingleInputSummaryItem(locText, bntEdit, btnRemove));
    });
    res.items = items;
    return res;
  }
}

Serializer.addClass(
  "matrixdynamic",
  [
    { name: "allowAddRows:boolean", default: true },
    { name: "allowRemoveRows:boolean", default: true },
    { name: "rowCount:number", default: 2, minValue: 0, isBindable: true },
    "rowCountExpression:expression",
    { name: "minRowCount:number", default: 0, minValue: 0 },
    {
      name: "maxRowCount:number",
      default: settings.matrix.maxRowCount,
    },
    { name: "keyName" },
    "defaultRowValue:rowvalue",
    { name: "copyDefaultValueFromLastEntry:boolean", alternativeName: "defaultValueFromLastRow" },
    { name: "confirmDelete:boolean" },
    {
      name: "confirmDeleteText",
      dependsOn: "confirmDelete",
      visibleIf: function(obj: any): boolean {
        return !obj || obj.confirmDelete;
      },
      serializationProperty: "locConfirmDeleteText",
    },
    {
      name: "addRowButtonLocation", alternativeName: "addRowLocation",
      default: "default",
      choices: ["default", "top", "bottom", "topBottom"],
    },
    { name: "addRowText", serializationProperty: "locAddRowText" },
    { name: "removeRowText", serializationProperty: "locRemoveRowText" },
    "hideColumnsIfEmpty:boolean",
    {
      name: "noRowsText:text", alternativeName: "emptyRowsText",
      serializationProperty: "locNoRowsText",
      dependsOn: "hideColumnsIfEmpty",
      visibleIf: function(obj: any): boolean {
        return !obj || obj.hideColumnsIfEmpty;
      },
    },
    {
      name: "detailPanelShowOnAdding:boolean",
      dependsOn: "detailPanelMode",
      visibleIf: function(obj: any): boolean {
        return obj.detailPanelMode !== "none";
      },
    },
    { name: "allowRowReorder:switch", alternativeName: "allowRowsDragAndDrop" },
    /* Invisible in the property grid until the UI series ships a pager and sortable headers: the
       properties load from and save to JSON, but a switch that renders nothing is a support
       ticket. */
    { name: "rowsPerPage:number", default: 0, minValue: 0, visible: false },
    { name: "allowSortRows:boolean", default: false, visible: false },
    /* The sort and the filter of the rows. Plain strings and not ":condition"/":expression": both
       of those make JsonObjectProperty.isExpression true, and everything that discovers expressions
       by type - Base.validateExpressions(), the linter - would then read them with the survey as
       the variable context, while their variables are record fields. */
    { name: "sortBy", default: "", visible: false },
    { name: "filterExpression", default: "", visible: false },
  ],
  function() {
    return new QuestionMatrixDynamicModel("");
  },
  "matrixdropdownbase"
);

QuestionFactory.Instance.registerQuestion("matrixdynamic", (name) => {
  var q = new QuestionMatrixDynamicModel(name);
  q.choices = [1, 2, 3, 4, 5];
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});