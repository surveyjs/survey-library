import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  MatrixRowGetterContext,
  IMatrixDropdownData,
} from "./question_matrixdropdownbase";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { ItemValue } from "./itemvalue";
import { QuestionFactory } from "./questionfactory";
import { QuestionValueType, IVerifyDataContext } from "./question";
import { LocalizableString } from "./localizablestring";
import { IProgressInfo } from "./base-interfaces";
import { HashTable, Helpers } from "./helpers";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, ValueGetterContextCore, VariableGetterContext } from "./conditions/conditionProcessValue";
import { ConditionRunner } from "./conditions/conditionRunner";
import { ArrayChanges, Base } from "./base";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";
import { QuestionRecordItem, IDynamicDataRecordUniqueness } from "./question_records";
import { ArrayDynamicDataSource, RowsDynamicDataSource } from "./dynamic-data/dynamic-data-sources";
import { IDynamicDataRecordCondition } from "./dynamic-data/dynamic-data-record-visibility";
import { IDynamicDataField } from "./dynamic-data/dynamic-data-interfaces";
import { settings } from "./settings";

export class MatrixDropdownValueGetterContext extends ValueGetterContextCore {
  constructor (protected question: QuestionMatrixDropdownModel) {
    super();
  }
  public getObj(): Base { return this.question; }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (!this.question.isDesignMode && !params.createObjects && this.question.isEmpty() && path.length === 0) return { isFound: true, value: undefined };
    if (path.length > 0) {
      const res = super.getValue(params);
      if (res && res.isFound) return res;
    }
    return new VariableGetterContext(this.question.value).getValue(params);
  }
  getRootObj(): IObjectValueContext { return <any>this.question.data; }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    name = name.toLocaleLowerCase();
    if (!this.hasRowName(name)) return;
    const rows = this.question.visibleRows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const itemName = row.rowName?.toString() || "";
      if (itemName.toLocaleLowerCase() === name) {
        res.isFound = true;
        res.obj = row;
        res.context = row.getValueGetterContext();
        return;
      }
    }
  }
  private hasRowName(name: string): boolean {
    const rows = this.question.rows;
    for (let i = 0; i < rows.length; i++) {
      const val = rows[i].value;
      if (val !== undefined && val !== null && val.toString().toLocaleLowerCase() === name) return true;
    }
    return false;
  }
}

/* The row context of a record without a row - off the page: {item}, {rowName}, {rowValue} and
   {rowTitle} are its rows item's, read through the record index. */
class MatrixDropdownRecordGetterContext extends MatrixRowGetterContext {
  // getRecordItems: the rows items of the matrix's records, in record order.
  constructor(private getRecordItems: () => Array<ItemValue>, private record: QuestionRecordItem) {
    super(<any>record);
  }
  private get rowItem(): ItemValue {
    return this.getRecordItems()[this.record.getIndex()];
  }
  protected getRowName(): any {
    const item = this.rowItem;
    return !!item ? item.value : undefined;
  }
  protected getRowTitle(): any {
    const item = this.rowItem;
    return !!item ? item.text : undefined;
  }
}

export class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
  private item: ItemValue;
  constructor(
    public name: string,
    item: ItemValue,
    data: QuestionMatrixDropdownModelBase,
    value: any
  ) {
    super(data, value);
    this.item = item;
    this.buildCells(value);
  }
  public get rowName(): string {
    return this.name;
  }
  public get rowTitle(): any {
    return this.text;
  }
  public get text(): string {
    return this.item.text;
  }
  public get locText(): LocalizableString {
    return this.item.locText;
  }
  protected isItemVisible(): boolean { return this.item.isVisible; }
  public isRowEnabled(): boolean { return this.item.isEnabled; }
  protected isRowHasEnabledCondition(): boolean { return !!this.item.enableIf; }
  protected getRowsVisibleIfExpression(rowsVisibleIf: string): Array<string> {
    const res = super.getRowsVisibleIfExpression(rowsVisibleIf);
    if (this.item.visibleIf) {
      res.push(this.item.visibleIf);
    }
    return res;
  }
  protected runRowsEnableCondition(properties: HashTable<any>): void {
    if (this.item.enableIf) {
      this.item.enabled = new ConditionRunner(this.item.enableIf).runContext(this.getValueGetterContext(), properties);
    }
  }
}
/**
  * A class that describes the Multi-Select Matrix question type. Multi-Select Matrix allows you to use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkbox](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radiogroup](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Text](https://surveyjs.io/form-library/documentation/questiontextmodel), and [Comment](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types as cell editors.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))
 */
export class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData {
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any, arrayChanges?: ArrayChanges): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "rows") {
      this.rowsSource.rowsChanged();
      if (!!this.generatedVisibleRows) {
        /* A single added or removed row is spliced into the rendered table (Bug#11212), unless the rows
           are built for a view: then the view decides which rows exist, and they are rebuilt as a view
           change rebuilds them, the totals included. */
        if (this.hasDataListView) {
          this.rebuildFromDataList(false);
          this.clearIncorrectValues();
        } else if (!this.tryUpdateRowsIncrementally(arrayChanges)) {
          this.clearGeneratedRows();
          this.resetRenderedTable();
          this.getVisibleRows();
          this.clearIncorrectValues();
        }
      }
    }
    if (name === "hideIfRowsEmpty") {
      this.updateVisibilityBasedOnRows();
    }
  }
  public itemValuePropertyChanged(item: ItemValue, name: string, oldValue: any, newValue: any): void {
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
    if (item.ownerPropertyName === "rows" && name === "text") {
      this.redecideViewOfRows();
    }
    // A row whose value changed names another record: its row is built again for it. The answer is
    // left as it is - the old key stays in the value, as it does without rows.
    if (item.ownerPropertyName === "rows" && name === "value") {
      this.rowsSource.rowsChanged();
      if (!!this.generatedVisibleRows) {
        this.clearGeneratedRows();
        this.resetRenderedTable();
      }
    }
  }

  /* The records of the list are the rows' answers, and the rows source owns how they are stored: which
     rows are records, composing them from the keyed answer, the write back by key and where the
     records go when the rows change. It is the list's default source. Created on first use: the base
     constructor assigns the rows before the fields of this class are initialized. */
  private rowsSourceValue: RowsDynamicDataSource<ItemValue>;
  private get rowsSource(): RowsDynamicDataSource<ItemValue> {
    if (!this.rowsSourceValue) {
      this.rowsSourceValue = new RowsDynamicDataSource<ItemValue>((): Array<ItemValue> => this.rows,
        (): any => this.getStoredRecords(), (newValue: any, changedIndexes: Array<number>): void => { this.storeRowsValue(newValue, changedIndexes); });
      /* A touched row follows its row name; a removed row leaves the touched set. Without a list the
         states kept for nested paged questions follow as well (followRemappedRecords creates nothing). */
      this.rowsSourceValue.onRecordsReplaced = (createRemap: () => ((index: number) => number)): void => {
        this.followRemappedRecords(createRemap);
      };
    }
    return this.rowsSourceValue;
  }
  protected createRecordsSource(): ArrayDynamicDataSource {
    return this.rowsSource;
  }
  public localeChanged(): void {
    super.localeChanged();
    this.redecideViewOfRows();
  }
  /* The rowTitle field reads the rows items' text, which an edit of a title or the survey locale
     changes. Under a sort or a filter that is a change from outside, so the view is decided again, as
     after an assignment. Without a view nothing happens and no list is created. Not tracked: a title
     whose text processing reads a survey value ("Row {q1}") - re-deciding on every value change would
     re-sort the table under the respondent; the view picks the new title up at its next re-decision
     (refreshView(), an assignment from outside, a rows change, a locale change). */
  private redecideViewOfRows(): void {
    if (!this.hasRecordView) return;
    // No record changes: the touched rows keep their places (createAssignmentRemap), and the edited set stays.
    this.decideViewAgain(this.dataListValue.getCreatedIndexes(), undefined, false, false);
  }
  /* The record fields: the columns', and the row itself, which the answer never stores - item, rowName
     and rowValue are the row value, rowTitle its text, under the names the row context answers in
     rowsVisibleIf. A virtual field wins over a column of the same value name, as the row context does:
     that column is left out of the fields, so it can be neither sorted nor filtered by. */
  protected getFields(): Array<IDynamicDataField> {
    const vars = settings.expressionVariables;
    const readItem = (index: number): ItemValue => this.getRecordItems()[index];
    const virtualFields: Array<IDynamicDataField> = [vars.item, vars.rowName, vars.rowValue].map((name: string): IDynamicDataField => ({
      name: name, dataType: "any", getValue: (record: any, index: number): any => { const item = readItem(index); return !!item ? item.value : undefined; }
    }));
    virtualFields.push({
      name: vars.rowTitle, dataType: "string", getValue: (record: any, index: number): any => { const item = readItem(index); return !!item ? item.text : undefined; }
    });
    const names = virtualFields.map((field: IDynamicDataField): string => field.name);
    return super.getFields().filter((field: IDynamicDataField): boolean => names.indexOf(field.name) < 0).concat(virtualFields);
  }
  // The rows items of the records, in record order.
  protected getRecordItems(): Array<ItemValue> {
    return this.rowsSource.items;
  }
  protected createRecordItemContext(item: QuestionRecordItem): IValueGetterContext {
    return new MatrixDropdownRecordGetterContext((): Array<ItemValue> => this.getRecordItems(), item);
  }
  // Under paging a record is visible when its row's visibleIf passes and the row is visible, besides rowsVisibleIf.
  protected getRecordConditionReader(): (index: number) => IDynamicDataRecordCondition {
    const items = this.getRecordItems();
    if (!items.some((item: ItemValue): boolean => !!item.visibleIf || !item.isVisible)) return undefined;
    return (index: number): IDynamicDataRecordCondition => {
      const item = items[index];
      return !item ? undefined : { visible: item.isVisible, expression: item.visibleIf };
    };
  }
  // A write of one row copies every row object of the answer: the row item is what stays.
  protected getRecordStateKey(recordIndex: number, record: any): any {
    return this.rowsSource.itemAt(recordIndex) || record;
  }
  protected getListRecordCount(): number {
    return this.rowsSource.count;
  }
  /* A record in a value the caller passes - the old records of an assignment, a value being verified -,
     not in the storage: under its row name. */
  protected getRecordInValue(value: any, recordIndex: number): any {
    const item = recordIndex > -1 ? this.rowsSource.itemAt(recordIndex) : undefined;
    return !!item && this.isObject(value) ? value[item.value] : undefined;
  }
  protected isItemWithoutRecordRefreshed(): boolean {
    return true;
  }
  /* An answer assignment never adds, removes or moves a record: the rows define them. A row whose
     answer changed or went is the same record, so every record keeps its index. Only a rows change
     moves or removes one (rowsSource.rowsChanged). */
  protected createAssignmentRemap(oldRecords: any, newRecords: any): (index: number) => number {
    return (index: number): number => index;
  }
  // QuestionRecordsModel hook: one stored record without composing the array, by its row key.
  protected getStoredRecordAt(index: number, defaultRecord?: any): any {
    return this.rowsSource.readAt(index);
  }
  /* The rows source's write: newValue is the answer with the written records in place. What a row
     model does to the rows that were not written happens here (dropEmptyColumnKeys), an answer with
     no key left is null, and the other rows of a written key show what was written. */
  private storeRowsValue(newValue: any, changedIndexes: Array<number>): void {
    const items = this.rowsSource.items;
    const writtenKeys = changedIndexes.map((index: number): any => items[index].value);
    items.forEach((item: ItemValue): void => {
      if (writtenKeys.indexOf(item.value) < 0)this.dropEmptyColumnKeys(newValue, item.value);
    });
    this.setOwnRecordsValue(Object.keys(newValue).length > 0 ? newValue : null);
    this.refreshRowsOfSameKeys(changedIndexes);
  }
  /* The record of a row that was not written changes only as a built row changes it, as without
     paging: a falsy value (null, 0, false, "") is no record and its key goes, a column key holding an
     empty value goes, and so does the row's key when that leaves the record with no key. An empty
     record, a value that is not an object and a key that is not a column stay. */
  private dropEmptyColumnKeys(value: any, key: any): void {
    const record = value[key];
    if (!record && value.hasOwnProperty(key)) {
      delete value[key];
      return;
    }
    if (!this.isObject(record)) return;
    const emptyKeys = this.columns.map(column => column.name)
      .filter((name: string): boolean => record.hasOwnProperty(name) && this.isValueEmpty(record[name]));
    if (emptyKeys.length === 0) return;
    const rest = Object.assign({}, record);
    emptyKeys.forEach((name: string): void => { delete rest[name]; });
    if (Object.keys(rest).length > 0) {
      value[key] = rest;
    } else {
      delete value[key];
    }
  }
  /* A cell write of one row reaches the other rows on the same key here: they show the record that was
     just written. Any other write is an assignment that refreshes the rows whose record changed
     (QuestionRecordsModel.onRecordsValueAssigned). */
  private refreshRowsOfSameKeys(changed: Array<number>): void {
    const source = this.rowsSource;
    if (!source.hasDuplicateKeys || !this.isWritingRecords) return;
    const value = this.value;
    const items = source.items;
    const getKey = (index: number): string => String(items[index].value);
    items.forEach((item: ItemValue, index: number): void => {
      if (changed.indexOf(index) > -1) return;
      const key = getKey(index);
      if (!changed.some((changedIndex: number): boolean => getKey(changedIndex) === key)) return;
      const row = <MatrixDropdownRowModelBase>this.getItemByRecordIndex(index);
      if (!!row) {
        row.value = this.getUnbindValue(this.isObject(value) ? value[item.value] : undefined);
      }
    });
  }
  private tryUpdateRowsIncrementally(arrayChanges: ArrayChanges | undefined): boolean {
    if (!arrayChanges) return false;
    const itemsToAdd = arrayChanges.itemsToAdd || [];
    const deleteCount = arrayChanges.deleteCount || 0;
    if (itemsToAdd.length === 1 && deleteCount === 0) {
      return this.tryAddSingleRow(<ItemValue>itemsToAdd[0]);
    }
    if (itemsToAdd.length === 0 && deleteCount === 1) {
      return this.tryRemoveSingleRow();
    }
    return false;
  }
  private tryAddSingleRow(item: ItemValue): boolean {
    const insertIndex = this.getAddedRowIndex(item);
    if (insertIndex < 0) return false;
    const val = this.value || {};
    const newRow = this.createMatrixRow(item, this.getRowValueForCreation(val, item.value));
    newRow.visibleIndex = insertIndex;
    // The records are the rows items with a value: the row's position is its record index.
    this.addRowForRecord(newRow, insertIndex, insertIndex);
    this.finishIncrementalRowChange((table) => table.onAddedRow(newRow, insertIndex));
    return true;
  }
  private tryRemoveSingleRow(): boolean {
    const removeIndex = this.getRemovedRowIndex();
    if (removeIndex < 0) return false;
    const removedRow = this.generatedVisibleRows[removeIndex];
    if (!this.isDisposed) {
      this.defaultValuesInRows[removedRow.rowName] = removedRow.getNamesWithDefaultValues();
    }
    this.generatedVisibleRows.splice(removeIndex, 1);
    this.finishIncrementalRowChange((table) => table.onRemovedRow(removedRow));
    return true;
  }
  // The source knows the new rows already (rowsChanged runs first): the record index is the item's place among them.
  private getAddedRowIndex(item: ItemValue): number {
    if (!item || !item.hasValue) return -1;
    if (!!this.getRowByKey(item.value)) return -1;
    return this.rowsSource.items.indexOf(item);
  }
  private getRemovedRowIndex(): number {
    const currentRowNames: { [key: string]: boolean } = {};
    for (let i = 0; i < this.rows.length; i++) {
      currentRowNames[this.rows[i].value] = true;
    }
    for (let i = 0; i < this.generatedVisibleRows.length; i++) {
      if (!currentRowNames[this.generatedVisibleRows[i].rowName]) return i;
    }
    return -1;
  }
  private finishIncrementalRowChange(updateRendered: (table: QuestionMatrixDropdownRenderedTable) => void): void {
    // Without a view every row is built, in record order: a row's position is its record index.
    this.generatedVisibleRows.forEach((row: MatrixDropdownRowModelBase, index: number): void => { this.setBuiltRecordIndex(row, index); });
    this.clearVisibleRows();
    if (this.isRendredTableCreated) {
      updateRendered(this.renderedTable);
    }
    this.clearIncorrectValues();
  }
  public getType(): string {
    return "matrixdropdown";
  }
  public getValueType(): QuestionValueType {
    return "object";
  }
  protected getAllChildren(): Base[] {
    return [
      ...super.getAllChildren(),
      ...this.columns,
      ...this.rows,
    ];
  }
  /**
   * A title for the total row. Applies if at least one column displays total values.
   * @see rowTitleWidth
   * @see columns
   */
  @property ({ localizable: { markdown: true } }) totalText: string;
  public getFooterText(): LocalizableString {
    return this.locTotalText;
  }
  public getRowTitleWidth(): string {
    return this.rowTitleWidth;
  }
  /**
   * Specifies whether to hide the question when the matrix has no visible rows.
   * @see rowsVisibleIf
   */
  @property() hideIfRowsEmpty: boolean;
  protected updateVisibilityBasedOnRows(): void {
    if (this.hideIfRowsEmpty) {
      this.onVisibleChanged();
    }
  }
  protected isVisibleCore(): boolean {
    const res = super.isVisibleCore();
    if (!res || !this.hideIfRowsEmpty) return res;
    // Under paging the rows are one page: the visible records count.
    const count = this.visibleRecordCount;
    if (count !== undefined) return count > 0;
    return this.visibleRows?.length > 0;
  }

  public getSingleInputTitleTemplate(): string { return "rowNameTemplateTitle"; }
  public getValueGetterContext(): IValueGetterContext {
    return new MatrixDropdownValueGetterContext(this);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value) return value;
    if (this.isPagedByList) return this.getPagedDisplayValue(keysAsText, value);
    var rows = this.visibleRows;
    var res = {};
    if (!rows) return res;
    for (var i = 0; i < rows.length; i++) {
      var rowName = rows[i].rowName;
      var val = value[rowName];
      if (!val) continue;
      if (keysAsText) {
        var displayRowValue = ItemValue.getTextOrHtmlByValue(
          this.rows,
          rowName
        );
        if (!!displayRowValue) {
          rowName = displayRowValue;
        }
      }
      // A copy: val is the caller's, and may be survey data itself.
      (<any>res)[rowName] = this.getRowDisplayValue(keysAsText, rows[i], this.getUnbindValue(val));
    }
    return res;
  }
  /* Under paging every visible record, in view order: a record on the page reads its display values
     from its row's cells, a record without a row through the columns' template questions - nothing is
     built for it. As without paging, the last row of a key decides; each record is formatted in a copy. */
  private getPagedDisplayValue(keysAsText: boolean, value: any): any {
    const res: any = {};
    const items = this.getRecordItems();
    this.forEachViewRecord(true, (index: number, item: QuestionRecordItem): void => {
      const row = <MatrixDropdownRowModelBase>item;
      let rowName = items[index].value;
      const val = value[rowName];
      if (!val) return;
      if (keysAsText) {
        rowName = ItemValue.getTextOrHtmlByValue(this.rows, rowName) || rowName;
      }
      res[rowName] = this.getRecordDisplayValue(keysAsText, row, this.getUnbindValue(val), index);
    });
    return res;
  }
  protected getConditionObjectRowName(index: number): string {
    return "." + this.rows[index].value;
  }
  protected getConditionObjectRowText(index: number): string {
    return "." + this.rows[index].calculatedText;
  }
  protected getConditionObjectsRowIndeces() : Array<number> {
    const res = [];
    for (var i = 0; i < this.rows.length; i++) res.push(i);
    return res;
  }
  protected isDataValueCorrect(val: any): boolean {
    return Helpers.isValueObject(val, true);
  }
  protected verifyValueCore(val: any, context: IVerifyDataContext): boolean {
    if (!super.verifyValueCore(val, context)) return false;
    const unknownKeys: Array<string> = [];
    // A row of another question that shares the value is checked by that question.
    for (const key of Object.keys(val)) {
      if (this.hasValueKey(key)) {
        if (context.checks.reportInvalidValueTypes && !this.isRowValueCorrect(val[key])) {
          context.addIssue("invalidValueType", key, val[key], this);
        }
      } else {
        if (!this.isValueKeyKnown(key)) unknownKeys.push(key);
      }
    }
    if (context.checks.reportUnknownProperties) {
      unknownKeys.forEach(key => context.addIssue("unknownProperty", key, val[key], this));
    }
    return true;
  }
  protected hasValueKey(key: string): boolean {
    return this.rows.some(row => row.value + "" === key);
  }
  // Every row is a plain object.
  private isRowValueCorrect(rowValue: any): boolean {
    return Helpers.isValueEmpty(rowValue) || Helpers.isValueObject(rowValue, true);
  }
  public clearIncorrectValues(): void {
    if (!this.isEmpty()) {
      const isPaged = this.isPagingActive;
      if (!isPaged) {
        this.getVisibleRows();
      }
      const newVal: any = {};
      const val = this.value;
      for (let key in val) {
        const isSharedRow = !this.hasValueKey(key) && this.isValueKeyKnown(key);
        if (isSharedRow || (this.isKeyVisible(key, isPaged) && this.isRowValueCorrect(val[key]))) {
          newVal[key] = val[key];
        }
      }
      this.value = newVal;
    }
    super.clearIncorrectValues();
  }
  /* The first row of a key decides. Under paging the records decide: a record off the page keeps its
     answer when it is visible. An answer key is a string, so a key and a row value compare as strings. */
  private isKeyVisible(key: string, isPaged: boolean): boolean {
    const row = isPaged ? undefined : this.getRowByKey(key);
    if (!!row) return row.isVisible;
    // A record without a row - off the page or filtered out - follows the rule of the base (isRecordKeptWithoutRow).
    if (!this.dataListValue) return false;
    const index = this.rowsSource.indexOfKey(key);
    return index > -1 && this.isRecordKeptWithoutRow(index);
  }
  private getRowByKey(val: any): MatrixDropdownRowModelBase {
    const rows = this.generatedVisibleRows;
    if (!rows) return null;
    for (let i = 0; i < rows.length; i ++) {
      if (String(rows[i].rowName) === String(val)) return rows[i];
    }
    return null;
  }
  // The results of a record walk are keyed by the row value; the last record of a key decides.
  protected createRecordValues(): any {
    return {};
  }
  // As without paging (getFilteredDataCore), the last row of a key decides.
  protected addRecordValue(values: any, index: number, value: any): void {
    if (value === undefined || value === null) return;
    values[this.getRecordItems()[index].value] = value;
  }
  // An owner-hidden record loses its answer when invisible values are cleared, as a hidden row does.

  // The rows are schema-defined: a row the respondent never opened can violate a required column, a
  // cell validator or a unique column, so a full validation visits every page of the view.
  protected isEveryPageValidated(): boolean {
    return true;
  }
  // Only rows in the view take part, as only they are checked without paging.
  protected getRecordUniqueness(): IDynamicDataRecordUniqueness {
    const res = super.getRecordUniqueness();
    res.includeFilteredOut = false;
    return res;
  }
  protected getRecordDataName(index: number): string {
    return this.getRecordItems()[index].value;
  }
  protected getRecordText(index: number, visibleIndex: number): string {
    return this.getRecordItems()[index].text;
  }
  protected getRecordAccessibilityTitle(index: number, visibleIndex: number): string {
    return this.getRecordItems()[index].locText.renderedHtml;
  }
  protected getRecordDataSegment(index: number): string | number {
    return this.getRecordItems()[index].value + "";
  }
  private defaultValuesInRows: any = {};
  protected clearGeneratedRows(): void {
    if (!this.generatedVisibleRows) return;
    if (!this.isDisposed) {
      this.generatedVisibleRows.forEach(row => {
        this.defaultValuesInRows[row.rowName] = row.getNamesWithDefaultValues();
      });
    }
    super.clearGeneratedRows();
  }
  private getRowValueForCreation(val: any, rowName: any): any {
    const res = val[rowName];
    if (!res) return res;
    const names = this.defaultValuesInRows[rowName];
    if (!Array.isArray(names) || names.length === 0) return res;
    names.forEach(name => {
      delete res[name];
    });
    return res;
  }
  // One row per record the view holds - every record, in record order, without one.
  protected generateRows(): Array<MatrixDropdownRowModel> {
    const items = this.getRecordItems();
    if (items.length === 0) return [];
    let val = this.value;
    if (!val) val = {};
    return this.createRowsForRecords(this.getRecordIndexesForRows(), (index: number): MatrixDropdownRowModel =>
      this.createMatrixRow(items[index], this.getRowValueForCreation(val, items[index].value)));
  }
  protected createMatrixRow(item: ItemValue, value: any): MatrixDropdownRowModel {
    return new MatrixDropdownRowModel(item.value, item, this, value);
  }
  // The temporary row of the records clean-up: the record is the rows item at index.
  protected createRowForRecordCleanup(index: number, record: any): MatrixDropdownRowModelBase {
    const item = this.rowsSource.itemAt(index);
    return !!item ? this.createMatrixRow(item, record) : undefined;
  }
  protected getFilteredDataCore(): any {
    const res: any = {};
    this.generatedVisibleRows.forEach(row => {
      if (row.isVisible && !row.isEmpty) {
        res[row.rowName] = row.filteredValue;
      }
    });
    return res;
  }
  protected getSearchableItemValueKeys(keys: Array<string>) {
    keys.push("rows");
  }
  protected getIsRequireToGenerateRows(): boolean {
    if (super.getIsRequireToGenerateRows()) return true;
    for (let i = 0; i < this.rows.length; i ++) {
      if (!!this.rows[i].visibleIf) return true;
    }
    return false;
  }
  protected updateProgressInfoByValues(res: IProgressInfo): void {
    let val = this.value;
    if (!val) val = {};
    for (var i = 0; i < this.rows.length; i ++) {
      const row = this.rows[i];
      const rowName = val[row.value];
      this.updateProgressInfoByRow(res, !!rowName ? rowName : {});
    }
  }

  /**
   * Specifies a sort order for matrix rows.
   *
   * Possible values:
   *
   * - `"initial"` (default) - Preserves the original order of the `rows` array.
   * - `"random"` - Arranges matrix rows in random order each time the question is displayed.
   * @see rows
   * @since 2.0.0
   */
  @property({ isLowerCase: true }) rowOrder: string;

  protected sortVisibleRows(array: Array<MatrixDropdownRowModel>): Array<MatrixDropdownRowModel> {
    if (!!this.survey && this.survey.isDesignMode) return array;
    if (this.rowOrder.toLowerCase() === "random") return Helpers.randomizeArray<MatrixDropdownRowModel>(array, this.randomSeed);
    return array;
  }

  // The rows are reordered in place, which an assignment of the same array may not announce: the
  // records follow explicitly.
  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    this.rows = this.sortVisibleRows(this.rows);
    this.rowsSource.rowsChanged();
  }

  public randomSeedChanged(): void {
    if (this.rowOrder.toLowerCase() !== "random") return;
    this.rows = this.sortVisibleRows(this.rows);
    this.rowsSource.rowsChanged();
    this.clearGeneratedRows();
    this.resetRenderedTable();
    super.randomSeedChanged();
  }
}

Serializer.addClass(
  "matrixdropdown",
  [
    {
      name: "rows:itemvalue[]", uniqueProperty: "value"
    },
    "rowsVisibleIf:condition",
    "rowTitleWidth",
    { name: "totalText", serializationProperty: "locTotalText" },
    "hideIfRowsEmpty:boolean",
    {
      name: "rowOrder",
      default: "initial",
      choices: ["initial", "random"],
    },
  ],
  function() {
    return new QuestionMatrixDropdownModel("");
  },
  "matrixdropdownbase"
);

QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => {
  var q = new QuestionMatrixDropdownModel(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rows = QuestionFactory.DefaultRows;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
