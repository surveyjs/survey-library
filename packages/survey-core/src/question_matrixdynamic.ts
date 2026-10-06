import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { HashTable, Helpers } from "./helpers";
import { QuestionFactory } from "./questionfactory";
import { Question, QuestionValueType } from "./question";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData,
  MatrixSingleInputLocOwner
} from "./question_matrixdropdownbase";
import { SurveyError } from "./survey-error";
import { MinRowCountError } from "./error";
import { Action, IAction } from "./actions/action";
import { settings } from "./settings";
import { confirmActionAsync } from "./utils/confirm-dialog";
import { DragDropMatrixRows } from "./dragdrop/matrix-rows";
import { IShortcutText, ISurveyImpl, IProgressInfo } from "./base-interfaces";
import { toCssClasses } from "./utils/cssClassBuilder";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";
import { DragOrClickHelper, ITargets } from "./utils/dragOrClickHelper";
import { LocalizableString } from "./localizablestring";
import { QuestionSingleInputSummary } from "./questionSingleInputSummary";
import { IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, IValueGetterItem } from "./conditions/conditionProcessValue";
import { ActionContainer } from "./actions/container";
import { ComputedUpdater } from "./base";
import { Base } from "./base";
import { MatrixDropdownBaseSingleInputBehavior } from "./question_matrixdropdownbase";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import { IRecordTarget, QuestionRecordsValueGetterContext } from "./question_records";
import { DynamicDataOperation, IDynamicDataListChange, IDynamicDataSource } from "./dynamic-data/dynamic-data-interfaces";

// What a removal acts on (QuestionMatrixDynamicModel.resolveRowTarget): a row, or a record without one.
interface IRowTarget extends IRecordTarget {
  row?: MatrixDropdownRowModelBase;
}
export class MatrixDynamicValueGetterContext extends QuestionRecordsValueGetterContext {
  // The design row answers any path; isRoot is left as it is.
  protected getDesignValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    return (<QuestionMatrixDynamicModel>this.question).getDesignRowContext().getValue(params);
  }
}

export class MatrixDynamicRowModel extends MatrixDropdownRowModelBase implements IShortcutText {
  private dragOrClickHelper: DragOrClickHelper;

  constructor(public index: number, data: QuestionMatrixDropdownModelBase, value: any) {
    super(data, value);
    this.buildCells(value);
  }
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
  implements IMatrixDropdownData {
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
  /* A data source that supplies the matrix records (IDynamicDataSource): the matrix reads them from it,
     a page at a time when it pages, and pushes every cell edit, row insertion and row deletion to it.
     Not serialized - a data source is code, not survey JSON. undefined goes back to question.value. */
  public get dataSource(): IDynamicDataSource {
    return this.getDataSource();
  }
  public set dataSource(val: IDynamicDataSource) {
    this.setDataSource(val);
    // The capabilities of the new source decide whether the cells are editable and whether the
    // add/remove buttons are shown: the cells read isMatrixReadOnly() through their readOnlyCallback
    // and need the reactive refresh that an ordinary read-only change would give them.
    (this.generatedVisibleRows || []).forEach(row => row.onQuestionReadOnlyChanged());
    this.resetRenderedTable();
  }
  // Reads the data source again (see QuestionRecordsModel.refreshSource).
  public refreshDataSource(): void | Promise<void> {
    return this.refreshSource();
  }
  /* rowCount follows the loaded total here and not through its setter: the setter clamps to
     settings.matrix.maxRowCount, truncates the storage and creates one row object per counted
     record - none of which applies to a window of a larger table. With a source that answers
     without a total it is the count of the rows known to exist, a lower bound - isRowCountKnown
     says which of the two it is. */
  protected storeLoadedRecords(): void {
    super.storeLoadedRecords();
    this.rowCountValue = this.dataList.count;
  }
  // The respondent adds, removes and reorders the rows: the records are the question's to change.
  protected isRecordMembershipFixed(): boolean {
    return false;
  }
  // A move through a data source hands the rows their records before the conditions run.
  protected prepareRemoteWrite(change: IDynamicDataListChange): void {
    if (change.type === "recordMoved")this.updateRowsFromRecords();
  }
  /* A move does not carry the row objects (moveRowByIndex): they stay where they are and take the
     reordered records, so each row names the record its position holds now, not the record it held
     before. The positions decide, so the remap of the move is not used. */
  protected followRecordMove(remap: (index: number) => number): void {
    const indexes = this.getRecordIndexesForRows();
    (this.generatedVisibleRows || []).forEach((row: MatrixDropdownRowModelBase, position: number): void => {
      if (row.builtRecordIndex > -1 && position < indexes.length) row.builtRecordIndex = indexes[position];
    });
  }
  /* The values half of a move made through a data source. With the array source over question.value
     the push assigns the value, and that assignment hands the rows whose position now holds another
     record that record (onRecordsValueAssigned); a data source has no such assignment, so the rows
     are given theirs here. */
  private updateRowsFromRecords(): void {
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows)) return;
    const indexes = this.getRecordIndexesForRows();
    this.writeRecords((): void => {
      for (let i = 0; i < rows.length && i < indexes.length; i++) {
        rows[i].updateFromRecord(this.getNewRowValue(indexes[i]));
      }
    });
  }
  /* False while the data source answers a read without a total: rowCount is then the number of rows
     known to exist - a lower bound (see isCountKnown). */
  public get isRowCountKnown(): boolean { return this.isCountKnown; }
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
  protected getListRecords(): Array<any> {
    const val = this.value;
    if (Array.isArray(val) && val.length >= this.rowCount) return val;
    return this.padRecords(Array.isArray(val) ? val.slice() : []);
  }
  protected setListRecords(records: Array<any>, operations?: Array<DynamicDataOperation>): void {
    this.setNewValue(this.normalizeRecords(records, operations));
  }
  // The length getListRecords() would return: value.length padded up to rowCount, never truncated.
  protected getListRecordCount(): number {
    const val = this.value;
    const len = Array.isArray(val) ? val.length : 0;
    return Math.max(len, this.rowCount);
  }
  /* QuestionRecordsModel hook: one record of getListRecords() without composing the array: a padded
     record is the default row value. For the loops over the records by index. A data source's window
     is the list's to answer, and so is a write in progress: inside list.batch() the writes sit in the
     source's batch array and question.value does not have them yet. */
  protected getListRecordAt(index: number, defaultRecord?: any): any {
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
  /* The value shape rules of a write, as each kind of write has always had them. Every write is
     truncated to rowCount. A cell edit - the writes are updates - drops a value whose records are all
     empty and keeps minRowCount empty records instead; a row the matrix removes itself drops such a
     value and keeps no empty records; an insert, a move and the records a lower rowCount cuts off are
     stored as they are. operations: the writes the source made, absent for a write of its own. */
  private normalizeRecords(records: Array<any>, operations?: Array<DynamicDataOperation>): any {
    let res = Array.isArray(records) ? records : [];
    if (res.length > this.rowCount) {
      res = res.slice(0, this.rowCount);
    }
    const isOnly = (operation: DynamicDataOperation): boolean => operations.every((op: DynamicDataOperation): boolean => op === operation);
    if (!operations || isOnly("update")) return this.correctValueForMinMaxRows(this.deleteRowValue(res, null));
    if (this.isWritingRecords && isOnly("remove")) return this.deleteRowValue(res, null);
    return res;
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
  protected isDataValueCorrect(val: any): boolean {
    // Every row is a plain object; an empty one may be null.
    return Array.isArray(val) && val.every(row => Helpers.isValueEmpty(row) || Helpers.isValueObject(row, true));
  }
  protected setDefaultValue() {
    if (!this.setDefaultRecordValues(this.defaultRowValue, this.rowCount)) super.setDefaultValue();
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
      const list = this.dataList;
      let at: number;
      if (this.isPagedByList) {
        /* toIndex is a row position on the page; past the last row of the page it is the first
           record of the next page - the rule the dynamic panel's add follows - and past the last
           visible record, the end of the storage. */
        const pageLength = list.getMaterializedIndexes().length;
        at = list.getInsertIndexAtVisibleIndex(this.pageStartVisibleIndex + Math.max(0, Math.min(toIndex, pageLength)));
      } else {
        // A position among the rows of the window.
        at = list.getInsertIndexAtMaterializedPosition(toIndex);
      }
      this.followInsertedRecord(list.add(rowData, at), false);
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
      this.removeRecordAndRefill((): void => { list.remove(index); });
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
       count reaches it the other way round - through storeLoadedRecords, from a read that committed.
       An incoming total above settings.matrix.maxRowCount is accepted there; the clamp below stays
       what it has always been, a limit on what a caller may ask for. */
    if (this.isRemoteData) return;
    if (val < 0 || val === this.rowCount) return;
    if (val > settings.matrix.maxRowCount) {
      // The page size is not known yet while loading: rowsPerPage may follow rowCount in the JSON.
      if (this.isLoadingFromJson) {
        this.rowCountAboveSettings = val;
        return;
      }
      if (this.isRecordCountLimitedByPageMax) return;
    }
    this.setRowCountCore(val);
  }
  private rowCountAboveSettings: number;
  endLoadingFromJson(): void {
    const val = this.rowCountAboveSettings;
    this.rowCountAboveSettings = undefined;
    if (val > 0 && !this.isRecordCountLimitedByPageMax) {
      this.setRowCountCore(val);
    }
    super.endLoadingFromJson();
  }
  private setRowCountCore(val: number): void {
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
      row.builtRecordIndex !== created[i]);
    if (created.length < rows.length || isPageChanged) {
      this.rebuildFromDataList(false);
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
   * The calculation result is clamped to the [`minRowCount`](#minRowCount) and [`maxRowCount`](#maxRowCount) limits: a value below the minimum is set to `minRowCount`, and a value above the maximum is capped at `maxRowCount`. If rows are not split into pages, the global [`settings.matrix.maxRowCount`](/form-library/documentation/api-reference/settings#matrix) setting also limits the maximum.
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
    this.rowCount = this.getRecordCountByExpressionValue(val, this.minRowCount, this.rowCountLimit);
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
    return this.allowRowReorder && !this.isReadOnly && this.dataList.sort.length === 0 && this.canWriteRecords("move");
  }
  // One hook for the whole matrix, not one per cell: the cell questions read it through
  // data.isMatrixReadOnly() (parentIsReadOnly).
  public isMatrixReadOnly(): boolean {
    return super.isMatrixReadOnly() || !this.canWriteRecords("update");
  }
  @property({ defaultValue: 0 }) lockedRowCount: number;
  /* Enables the header-click sort a renderer may offer; a column opts out with
     column.allowSort = false, and a data source that pages without declaring sorting makes every
     column unsortable (canSortRecords). The property is stored and exposed (column.isSortable reads
     it) - the sort itself is assigned through sortOrder/sortBy/toggleSort. */
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
   * `settings.matrix.maxRowCount` is the maximum number of rows on one page. If rows are not split into pages, it also limits `maxRowCount`. If they are, only `maxRowCount` limits the total number of rows, and only when you set it.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see rowCount
   * @see minRowCount
   * @see allowAddRows
   */
  /* Without paging the setting caps it, as it always has: a value above the setting reads as the
     setting and is therefore not serialized. With paging the setting is the page maximum and the
     value is kept (rowCountLimit). */
  public get maxRowCount(): number {
    const val = this.getPropertyValue("maxRowCount");
    return this.pageSize > 0 ? val : Math.min(val, settings.matrix.maxRowCount);
  }
  public set maxRowCount(val: number) {
    this.setPropertyValue("maxRowCount", val <= 0 ? 1 : val);
  }
  // internal: the limit rowCount is checked against (see getRecordCountLimit).
  public get rowCountLimit(): number {
    return this.getRecordCountLimit(this.maxRowCount, this.getPropertyValueWithoutDefault("maxRowCount"), settings.matrix.maxRowCount);
  }

  private onMaxRowCountChanged(): void {
    const val = this.maxRowCount;
    if (val < this.minRowCount)this.minRowCount = val;
    const limit = this.rowCountLimit;
    if (this.rowCount > limit)this.rowCount = limit;
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
      this.canWriteRecords("insert") && this.rowCount < this.rowCountLimit
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
      this.canWriteRecords("remove") &&
      this.rowCount > this.minRowCount;
    return !!this.canRemoveRowsCallback ? this.canRemoveRowsCallback(res) : res;
  }
  public canRemoveRow(row: MatrixDropdownRowModelBase): boolean {
    if (!this.survey) return true;
    // lockedRowCount counts records: the first N records are locked wherever they are shown. The
    // event gets the row's position in the whole view, as it always has (getRecordViewIndex).
    const recordIndex = (<MatrixDynamicRowModel>row).rowIndex - 1;
    if (this.lockedRowCount > 0 && recordIndex < this.lockedRowCount) return false;
    return this.matrixCallbacks.matrixAllowRemoveRow(this, this.getRecordViewIndex(this.getRecordIndexOf(row)), row);
  }
  /* "Add" is a move the respondent makes when the new row lands on another page than the one shown:
     that page is validated first (layer 1), and the add happens once it has passed - later, when
     its validators are asynchronous. */
  public addRowUI(): void {
    if (this.isAddLeavingPage()) {
      this.leavePage(true, (): void => { this.addRow(true); });
      return;
    }
    this.addRow(true);
  }
  // An added record is appended: it lands on the page after the last visible record.
  private isAddLeavingPage(): boolean {
    if (!this.isPagedByList || !this.canAddRow) return false;
    const list = this.dataList;
    return list.getPageOfVisibleIndex(list.visibleCount) !== list.pageIndex;
  }
  /* Under paging the added record's page is shown: it is where the respondent must see the row they
     added. A move from code - the add itself was validated - and before onMatrixRowAdded, so that the
     event gets the new row. */
  private showPageOfAddedRecord(): void {
    this.showPageOfRecord(this.getLastRowRecordIndex());
  }
  // A record the view does not show (rowsVisibleIf hides it) has no page: the page stays.
  private showPageOfRecord(recordIndex: number): void {
    if (recordIndex < 0) return;
    this.markRecordEdited(recordIndex);
    const visibleIndex = this.dataList.getVisibleIndexes().indexOf(recordIndex);
    if (visibleIndex < 0) return;
    this.showPageOfVisibleIndex(visibleIndex);
  }
  private getQuestionToFocusOnAddingRow(row: MatrixDropdownRowModelBase): Question {
    if (!row.isVisible) return null;
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
    // The new row is the last one in allRows; visibleRows may end with an existing row when rowsVisibleIf hides the new row
    const rows = this.allRows;
    const newRow = oldRowCount !== this.rowCount && rows.length > 0 ? rows[rows.length - 1] : null;
    if (!newRow) return;
    if (this.detailPanelShowOnAdding) {
      newRow.showDetailPanel();
    }
    if (setFocus) {
      const q = this.getQuestionToFocusOnAddingRow(newRow);
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
     defaultRowValue and then the copy from the last entry (getLastEntryRecord) - and handed to the
     list once: one source.insert, no move, no follow-up update. question.value and rowCount follow
     the window through the recordAdded notification. */
  private addRowCoreRemote(): void {
    const defaultValue = this.getDefaultRowValue(true);
    const record = this.isValueEmpty(defaultValue) ? {} : defaultValue;
    const list = this.dataList;
    // Appended to the storage, as the local path appends to question.value; the rows follow the record.
    const newRow = <MatrixDropdownRowModelBase>this.followInsertedRecord(list.add(record, list.loadedCount), false);
    if (this.data) {
      this.runCellsCondition(this.getDataFilteredProperties());
    }
    // A record the page does not hold has no row, and no event.
    if (this.survey && !!newRow) {
      this.matrixCallbacks.matrixRowAdded(this, newRow);
    }
    this.onRowsChanged();
  }
  // QuestionRecordsModel hook: one row for a record at the end of the rows; the rows before it keep their state.
  protected appendItemForRecord(recordIndex: number): void {
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows)) return;
    const newRow = this.createMatrixRow(this.dataList.getRecord(recordIndex));
    newRow.builtRecordIndex = recordIndex;
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
        const isNewRow = !this.isPagingActive || row.builtRecordIndex === this.getLastRowRecordIndex();
        if (isNewRow && !this.isValueEmpty(row.value) && !this.isEditingObjectValue) {
          this.setLastRowRecord(row.value);
        }
      }
    }
    if (this.isPagedByList && prevRowCount + 1 == this.rowCount) {
      this.showPageOfAddedRecord();
    }
    if (this.survey) {
      const rows = this.allRows;
      if (prevRowCount + 1 == this.rowCount && rows.length > 0) {
        // Under paging the page may not hold the new record (rowsVisibleIf hides it): no row, no event.
        const row = this.isPagingActive ? this.getItemByRecordIndex(this.getLastRowRecordIndex()) : rows[rows.length - 1];
        if (!!row) {
          this.matrixCallbacks.matrixRowAdded(this, <MatrixDropdownRowModelBase>row);
        }
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
     already grown, so the last entry is the record before the new one. The remote path builds the
     record before the insert: a source without paging holds the whole storage, so it is the last record of
     it, as for question.value; a source that pages itself holds one window, so it is the last
     record of the window - the record beyond it is on the server. */
  private getLastEntryRecord(): any {
    if (this.isRemoteData) {
      const list = this.dataList;
      if (!list.isPagedBySource) return list.getRecord(list.loadedCount - 1);
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
      // removeRow takes a position in the whole view; the focus below stays on the page.
      value = this.pageStartVisibleIndex + index;
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
      this.keepFocusIndexForRead(index);
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
  protected focusItemAfterRead(index: number): void {
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
    // A view or a page: the number is a position among the visible records of the whole view.
    if (this.hasDataListView) {
      const target = this.resolveRowTarget(index);
      const record = !target ? undefined : (!!target.row ? target.row.value : this.getListRecordAt(target.recordIndex));
      return !this.isValueEmpty(record);
    }
    var value = this.createNewValue();
    if (this.isValueEmpty(value) || !Array.isArray(value)) return false;
    if (index >= value.length) return false;
    return !this.isValueEmpty(value[index]);
  }
  /* What removeRow acts on. index is a position among the visible rows - under paging among the
     visible records of the whole view, and the record it names may be on another page and have no row.
     undefined: there is nothing to act on; isNotLoaded: a source that pages itself holds another
     window. record: the record a target without a row is found again by. */
  private resolveRowTarget(index: number): IRowTarget {
    const rows = this.visibleRows;
    if (!this.isPagingActive) {
      const row = !!rows && index < rows.length ? rows[index] : null;
      return !row ? undefined : { row: row, recordIndex: this.getRecordIndexOf(row), visibleIndex: index };
    }
    const target = this.getRecordTargetAtVisibleIndex(index);
    return !target || !target.item ? target : { row: <MatrixDropdownRowModelBase>target.item, recordIndex: target.recordIndex, visibleIndex: index };
  }
  /* A confirmation answers later: by then the page, the sort or the records may have changed. A row
     still names its record - the remap layer keeps it in step - and a row that is gone names none. A
     record without a row is found again by its object; a write replaced it, and then it is stale. */
  private resolveRowTargetAgain(target: IRowTarget): IRowTarget {
    const rows = this.generatedVisibleRows;
    if (!!target.row) {
      if (!Array.isArray(rows) || rows.indexOf(target.row) < 0) return undefined;
      const pos = this.visibleRows.indexOf(target.row);
      return pos < 0 ? undefined : { row: target.row, recordIndex: this.getRecordIndexOf(target.row), visibleIndex: this.pageStartVisibleIndex + pos };
    }
    return this.findRecordTargetAgain(target);
  }
  /**
   * Removes a matrix row with a specified index.
   * @param index A zero-based row index.
   * @param confirmDelete *(Optional)* A Boolean value that specifies whether to display a confirmation dialog. If you do not specify this parameter, the [`confirmDelete`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#confirmDelete) property value is used.
   */
  /* Under paging index is a position among the visible records of the whole view (resolveRowTarget):
     a record on another page is removed too, without a row - so without the row events. A source that
     pages itself refuses one it has not loaded and reports it. */
  public removeRow(index: number, confirmDelete?: boolean, onRowRemoved?: () => void): void {
    if (!this.canRemoveRows) return;
    if (index < 0 || index >= this.rowCount) return;
    const target = this.resolveRowTarget(index);
    if (!target) return;
    if (target.isNotLoaded) {
      this.reportRecordNotLoaded("remove");
      return;
    }
    if (confirmDelete === undefined) {
      confirmDelete = this.isRequireConfirmOnRowDelete(index);
    }
    if (confirmDelete) {
      confirmActionAsync({
        message: this.confirmDeleteText,
        funcOnYes: () => {
          const current = this.resolveRowTargetAgain(target);
          if (!current) return;
          this.removeRowAsync(current);
          onRowRemoved && onRowRemoved();
        },
        locale: this.getLocale(),
        rootElement: this.survey.rootElement,
        cssClass: this.cssClasses.confirmDialog
      });
      return;
    }
    this.removeRowAsync(target);
    onRowRemoved && onRowRemoved();
  }
  private removeRowAsync(target: IRowTarget): void {
    const row = target.row;
    if (!!row && !!this.survey && !this.matrixCallbacks.matrixRowRemoving(this, target.visibleIndex, row)) return;
    this.onStartRowAddingRemoving();
    this.removeRowCore(target);
    this.singleInputOnRemoveItem(target.visibleIndex);
    this.onEndRowRemoving(row);
    if (this.initialRowCount > this.rowCount) {
      this.initialRowCount = this.rowCount;
    }
  }
  private removeRowCore(target: IRowTarget) {
    const row = target.row;
    const rows = this.generatedVisibleRows;
    const index = !!row && Array.isArray(rows) ? rows.indexOf(row) : -1;
    if (!!row && index < 0) return;
    // index is a created position; the record the row holds is what leaves the storage.
    const recordIndex = !!row ? this.dataList.materializedIndexToIndex(index) : target.recordIndex;
    const viewIndex = this.getRecordViewIndex(recordIndex);
    if (index > -1) {
      rows.splice(index, 1);
    }
    this.removeRecordAndRefill((): void => {
      /* A record beyond question.value is padding: a row that was added and never filled, or every
         row of a matrix with no value. There is nothing to write, and the list cannot remove it
         either - the padded window has just lost it together with rowCount. The list learns the new
         count instead, or a page index left past the last page would show an empty page. */
      const val = this.value;
      const isPaddingRecord = !Array.isArray(val) || recordIndex >= val.length;
      this.rowCountValue--;
      if (isPaddingRecord) {
        this.syncDataListRecordCount();
      } else if (this.value) {
        this.writeRecords((): void => {
          if (this.isEditingObjectValue) {
            // The live array is spliced in place: that is what removes the row from the edited object.
            const val = this.createValueCopy();
            val.splice(index, 1);
            this.value = val;
          } else if (recordIndex > -1) {
            this.dataList.remove(recordIndex);
          }
        });
      }
    });
    this.onRowsChanged();
    if (this.survey && !!row) {
      this.matrixCallbacks.matrixRowRemoved(this, viewIndex, row);
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
    // A filter, a sort or a page: the rows are not parallel to the records.
    if (this.hasDataListView) return this.getPagedDisplayValue(keysAsText, values);
    for (var i = 0; i < rows.length && i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      values[i] = this.getRowDisplayValue(keysAsText, rows[i], val);
    }
    return values;
  }
  /* Under a view - a filter, a sort, paging (Andrew's decision 2026-09-25) - a record that has a row
     reads its display values from the row's cells, a record without one through the column's
     templateQuestion: nothing is built on this live path. Choices that depend on {row.x}, and a
     choicesByUrl whose answer is not cached, give the value. */
  private getPagedDisplayValue(keysAsText: boolean, values: Array<any>): Array<any> {
    const rows = this.generatedVisibleRows || [];
    const positions = this.dataList.getMaterializedPositions();
    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      if (!val) continue;
      const row = positions[i] !== undefined ? rows[positions[i]] : undefined;
      values[i] = this.getRecordDisplayValue(keysAsText, row, val);
    }
    return values;
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
    if (this.rowCount === 0) return [];
    const indexes = this.getRecordIndexesForRows();
    /* The default write-back needs the whole padded value, and a live-object value is not copied at
       all. Every other build copies the records that get a row and nothing else: a page visit of a
       matrix that pages costs the page, not the record count. Without paging the indexes are
       0 ... rowCount-1 and the copies are the ones createNewValue() makes, record for record. */
    const isWritingDefaults = this.isDefaultWriteBackNeeded();
    const val = isWritingDefaults || this.isEditingObjectValue ? this.createNewValue() : undefined;
    const result = this.createRowsForRecords(indexes, (index: number): MatrixDynamicRowModel =>
      this.createMatrixRow(!!val ? this.getRowValueByIndex(val, index) : this.getNewRowValue(index)));
    if (isWritingDefaults) {
      this.value = val;
    }
    return result;
  }
  /* The defaults reach question.value when rows are built for records it does not hold yet: the
     value is shorter than rowCount (the padded records get the defaults) or longer (it is truncated).
     A value that already holds rowCount records is what createNewValue() would compose, so writing
     it back changes nothing - and a data source's window is never padded or truncated. */
  private isDefaultWriteBackNeeded(): boolean {
    if (this.isRemoteData || this.isValueEmpty(this.getDefaultRowValue(false))) return false;
    const val = this.value;
    return !Array.isArray(val) || val.length !== this.rowCount;
  }
  // One record of createNewValue() without copying the others: the window of a data source as it is,
  // question.value truncated and padded to rowCount.
  private getNewRowValue(index: number): any {
    const isRemote = this.isRemoteData;
    if (index < 0 || !isRemote && index >= this.rowCount) return null;
    const val = this.value;
    if (Array.isArray(val) && index < val.length) return this.getUnbindValue(val[index]);
    return isRemote ? null : this.getUnbindValue(this.getDefaultRowValue(false) || {});
  }
  // rowCount rows, whatever the value holds beyond them until it is normalized.
  protected getRecordCountForRows(): number {
    return this.rowCount;
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
    // QuestionRecordsModel guards too, but the minRowCount padding below must not run for a source.
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
    const res: any = [];
    this.generatedVisibleRows.forEach(row => {
      if (row.isVisible && !row.isEmpty) {
        res.push(row.filteredValue);
      }
    });
    return res;
  }
  // Only read, never stored: every padded record can share one default record.
  protected createDuplicationRecordReader(): (index: number) => any {
    const defaultRecord = this.getDefaultRowValue(false) || {};
    return (index: number): any => this.getListRecordAt(index, defaultRecord);
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
  /* The row count follows the assigned value as it does for any assignment from the survey
     (updateValueFromSurvey). The rows can be re-created inside a row add or remove, which locks out
     the reset of the rendered table (onStartRowAddingRemoving): its end resets the table instead. */
  protected followOutsideAssignment(): void {
    const prev = this.setRowCountValueFromData;
    this.setRowCountValueFromData = true;
    try {
      super.followOutsideAssignment();
    } finally {
      this.setRowCountValueFromData = prev;
    }
    if (this.isRendredTableCreated) {
      this.renderedTable.requireReset();
    }
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
  /* Still reached with an explicit value: updateValueOnRowsGeneration, onRowChanging,
     runTriggersOnNewRows, verifyValueCore and getRowObj all compose a value of their own and ask for
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
  // A row position is not a record index under paging, filtering or sorting: a location names the record.
  protected getRowDataSegment(row: MatrixDropdownRowModelBase, index: number): string | number {
    if (!this.hasDataListView) return index;
    const res = this.getRecordIndexOf(row);
    return res > -1 ? res : index;
  }
  public getRootCss(): string {
    return toCssClasses(super.getRootCss(), !this.renderedTable?.showTable && this.cssClasses.empty);
  }
  public getToolbarCssClass(location?: "top" | "bottom"): string {
    return toCssClasses(
      this.cssClasses.toolbar,
      location == "bottom" && this.cssClasses.toolbarBottom,
      location == "top" && this.cssClasses.toolbarTop
    );
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
      innerCss: new ComputedUpdater(() => toCssClasses(this.cssClasses.button, this.cssClasses.buttonAdd)) as any as string,
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
    return toCssClasses(super.getTableCss(), !!this.getShowToolbar("bottom") && this.cssClasses.hasFooter);
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
    return this.getDynamicSingleInputQuestions(question, checkDynamic);
  }
  public getSingleInputAddTextCore(): string {
    if (!this.matrixDynamic.canAddRow) return undefined;
    return this.matrixDynamic.addRowText;
  }
  public singleInputAddItemCore(): void {
    this.matrixDynamic.addRowUI();
  }
  protected createSingleInputSummary(): QuestionSingleInputSummary {
    const md = this.matrixDynamic;
    // Read once per summary; the page-size sync that the summary starts with does not change it.
    const canRemoveRows = md.canRemoveRows;
    return this.createRecordsSummary({
      noEntriesText: md.locNoRowsText,
      editText: md.locEditRowText,
      removeText: md.locRemoveRowText,
      getTitle: (row: MatrixDropdownRowModelBase): LocalizableString => {
        const locText = new LocalizableString(new MatrixSingleInputLocOwner(md, row), true, undefined, md.getSingleInputTitleTemplate());
        locText.setJson(md.locSingleInputTitleTemplate.getJson());
        return locText;
      },
      canRemove: (row: MatrixDropdownRowModelBase): boolean => canRemoveRows && md.canRemoveRow(row),
      remove: (row: MatrixDropdownRowModelBase): void => { md.removeRowUI(row); }
    });
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