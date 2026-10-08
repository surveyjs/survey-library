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

/* Where each record of the old rows is in the new ones: by key, occurrence by occurrence for a key
   two rows share; -1 for a record whose key is gone. */
function createKeyRemap(oldKeys: Array<string>, newKeys: Array<string>): (index: number) => number {
  const positions = new Map<string, Array<number>>();
  newKeys.forEach((key: string, index: number): void => {
    if (!positions.has(key)) positions.set(key, []);
    positions.get(key).push(index);
  });
  const occurrences = new Map<string, number>();
  const res = oldKeys.map((key: string): number => {
    const occurrence = occurrences.has(key) ? occurrences.get(key) : 0;
    occurrences.set(key, occurrence + 1);
    const indexes = positions.get(key);
    return !!indexes && occurrence < indexes.length ? indexes[occurrence] : -1;
  });
  return (index: number): number => index >= 0 && index < res.length ? res[index] : -1;
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
      this.onRecordItemsChanged();
      if (!!this.generatedVisibleRows) {
        // A single added or removed row is spliced into the rendered table (Bug#11212), unless the rows
        // are built for a view: then the view decides which rows exist.
        if (this.hasDataListView || !this.tryUpdateRowsIncrementally(arrayChanges)) {
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
      this.onRecordItemsChanged();
      if (!!this.generatedVisibleRows) {
        this.clearGeneratedRows();
        this.resetRenderedTable();
      }
    }
  }

  /* The records of the list are the rows' answers: one per rows item with a non-empty value, in rows
     order - the record index. A record is the nested row object of the keyed answer itself,
     value[item.value], never a copy, and a key the answer does not hold is a virtual empty record
     (undefined) that a read never writes. Two items with the same value are two records that read one
     key. The keyed answer is the only stored value: the composed array is derived from it, cached,
     and never written to. */
  private rowsRevision: number = 0;
  private recordItemsCache: { revision: number, items: Array<ItemValue>, keys: Array<string>, hasDuplicates: boolean };
  private recordsCache: { value: any, revision: number, records: Array<any> };
  // The items and the answer keys of the records, by the rows revision. A key is compared as a string,
  // the way an object key is.
  private getRecordItemsCache(): { items: Array<ItemValue>, keys: Array<string>, hasDuplicates: boolean } {
    const cache = this.recordItemsCache;
    if (!!cache && cache.revision === this.rowsRevision) return cache;
    const items = (this.rows || []).filter((item: ItemValue): boolean => !this.isValueEmpty(item.value));
    const keys = items.map((item: ItemValue): string => String(item.value));
    const hasDuplicates = keys.some((key: string, index: number): boolean => keys.indexOf(key) !== index);
    this.recordItemsCache = { revision: this.rowsRevision, items: items, keys: keys, hasDuplicates: hasDuplicates };
    return this.recordItemsCache;
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
    return this.getRecordItemsCache().items;
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
  /* Every change of the rows - an assignment, an array change, a reorder, a row value renamed - is a
     change of the records: the caches go, the record indexes kept for the validation of the pages
     follow their keys, and the list re-decides its views over the new records. The rows reach the
     list as a membership change, never as an insert or a remove. */
  private onRecordItemsChanged(): void {
    const oldKeys = this.getRecordItemsCache().keys;
    this.rowsRevision++;
    const newKeys = this.getRecordItemsCache().keys;
    if (!this.dataListValue) return;
    // A touched row follows its row name; a removed row leaves the touched set.
    this.followRemappedRecords((): ((index: number) => number) => createKeyRemap(oldKeys, newKeys));
  }
  // The one method that composes the records; everything else reads the cache (getListRecords).
  protected composeRecords(): Array<any> {
    const value = this.getStoredRecords();
    const isObject = this.isObject(value);
    return this.getRecordItems().map((item: ItemValue): any => isObject ? value[item.value] : undefined);
  }
  // A write of one row copies every row object of the answer: the row item is what stays.
  protected getRecordStateKey(recordIndex: number, record: any): any {
    return this.getRecordItems()[recordIndex] || record;
  }
  // Composed once per answer and rows revision: the list reads through on every record access.
  protected getListRecords(): Array<any> {
    const value = this.getStoredRecords();
    const cache = this.recordsCache;
    if (!!cache && cache.value === value && cache.revision === this.rowsRevision) return cache.records;
    const records = this.composeRecords();
    this.recordsCache = { value: value, revision: this.rowsRevision, records: records };
    return records;
  }
  protected getListRecordCount(): number {
    return this.getRecordItems().length;
  }
  // The keyed answer: a record is under its row name.
  protected getRecordInValue(value: any, recordIndex: number): any {
    const item = recordIndex > -1 ? this.getRecordItems()[recordIndex] : undefined;
    return !!item && this.isObject(value) ? value[item.value] : undefined;
  }
  protected isItemWithoutRecordRefreshed(): boolean {
    return true;
  }
  /* An answer assignment never adds, removes or moves a record: the rows define them. A row whose
     answer changed or went is the same record, so every record keeps its index. Only a rows change
     moves or removes one (onRecordItemsChanged). */
  protected createAssignmentRemap(oldRecords: any, newRecords: any): (index: number) => number {
    return (index: number): number => index;
  }
  // QuestionRecordsModel hook: one stored record without composing the array, by its row key.
  protected getStoredRecordAt(index: number, defaultRecord?: any): any {
    const items = this.getRecordItems();
    if (index < 0 || index >= items.length) return undefined;
    const value = this.getStoredRecords();
    return this.isObject(value) ? value[items[index].value] : undefined;
  }
  /* The list hands the whole array back, and only the positions whose record instance changed are
     written: the source replaces one element of the array it read and keeps every other one. So the
     stale record of another row on the same key never overwrites a write. The answer is copied first,
     which keeps the keys that are not rows - a question sharing the valueName, an unknown key. An empty
     record deletes its key, and an answer with no key left is null. The membership is the rows', so an
     array of another length, or one that moves a record to another position, is refused and nothing is
     written. */
  protected setListRecords(records: Array<any>): void {
    const composed = this.getListRecords();
    if (!Array.isArray(records) || records.length !== composed.length) return;
    const changed: Array<number> = [];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record === composed[i]) continue;
      // Only a record with content can be moved: an empty one is what every unanswered row holds.
      if (!this.isEmptyRecord(record) && composed.indexOf(record) > -1) return;
      changed.push(i);
    }
    if (changed.length === 0) return;
    const items = this.getRecordItems();
    const value = this.getStoredRecords();
    const newValue = this.isObject(value) ? Object.assign({}, value) : {};
    changed.forEach((index: number): void => {
      const key = items[index].value;
      if (this.isEmptyRecord(records[index])) {
        delete newValue[key];
      } else {
        newValue[key] = records[index];
      }
    });
    this.setOwnRecordsValue(Object.keys(newValue).length > 0 ? newValue : null);
    this.refreshRowsOfSameKeys(changed);
  }
  private isEmptyRecord(record: any): boolean {
    return record === undefined || record === null || this.isObject(record) && Object.keys(record).length === 0;
  }
  /* A cell write of one row reaches the other rows on the same key here: they show the record that was
     just written. Any other write is an assignment that refreshes the rows whose record changed
     (QuestionRecordsModel.onRecordsValueAssigned). */
  private refreshRowsOfSameKeys(changed: Array<number>): void {
    const cache = this.getRecordItemsCache();
    if (!cache.hasDuplicates || !this.isWritingRecords) return;
    const value = this.value;
    cache.keys.forEach((key: string, index: number): void => {
      if (changed.indexOf(index) > -1) return;
      if (!changed.some((changedIndex: number): boolean => cache.keys[changedIndex] === key)) return;
      const row = <MatrixDropdownRowModelBase>this.getItemByRecordIndex(index);
      if (!!row) {
        row.value = this.getUnbindValue(this.isObject(value) ? value[cache.items[index].value] : undefined);
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
  private getAddedRowIndex(item: ItemValue): number {
    if (!item || this.isValueEmpty(item.value)) return -1;
    if (!!this.getRowByKey(item.value)) return -1;
    const indexInRows = this.rows.indexOf(item);
    if (indexInRows < 0) return -1;
    let insertIndex = 0;
    for (let i = 0; i < indexInRows; i++) {
      if (!this.isValueEmpty(this.rows[i].value)) insertIndex++;
    }
    return insertIndex;
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
     built for it. The first row of a key decides; each record is formatted in a copy. */
  private getPagedDisplayValue(keysAsText: boolean, value: any): any {
    const res: any = {};
    const items = this.getRecordItems();
    this.forEachRecordRow(this.dataList.getVisibleIndexes(), (index: number, row: MatrixDropdownRowModelBase): void => {
      let rowName = items[index].value;
      const val = value[rowName];
      if (!val) return;
      if (keysAsText) {
        rowName = ItemValue.getTextOrHtmlByValue(this.rows, rowName) || rowName;
      }
      if (Object.prototype.hasOwnProperty.call(res, rowName)) return;
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
    // A record without a row - off the page or filtered out - decides by its own flag: the filter is a
    // view, and a filtered-out record keeps its answer.
    const list = this.dataListValue;
    if (!list) return false;
    const index = this.getRecordItemsCache().keys.indexOf(String(key));
    return index > -1 && list.isRecordVisible(index);
  }
  private getRowByKey(val: any): MatrixDropdownRowModelBase {
    const rows = this.generatedVisibleRows;
    if (!rows) return null;
    for (let i = 0; i < rows.length; i ++) {
      if (String(rows[i].rowName) === String(val)) return rows[i];
    }
    return null;
  }
  // The results of a record walk are keyed by the row value; the first record of a key decides.
  protected createRecordValues(): any {
    return {};
  }
  protected addRecordValue(values: any, index: number, value: any): void {
    if (value === undefined || value === null) return;
    const key = this.getRecordItems()[index].value;
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      values[key] = value;
    }
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
    this.onRecordItemsChanged();
  }

  public randomSeedChanged(): void {
    if (this.rowOrder.toLowerCase() !== "random") return;
    this.rows = this.sortVisibleRows(this.rows);
    this.onRecordItemsChanged();
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
    // Hidden in the property grid: paging is turned on from JSON or code.
    { name: "rowsPerPage:number", default: 0, minValue: 0, visible: false },
    /* The sort and the filter of the rows. Plain strings and not ":condition"/":expression": both
       of those make JsonObjectProperty.isExpression true, and everything that discovers expressions
       by type - Base.validateExpressions(), the linter - would then read them with the survey as
       the variable context, while their variables are record fields. */
    { name: "sortBy", default: "", visible: false },
    { name: "filterExpression", default: "", visible: false }
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
