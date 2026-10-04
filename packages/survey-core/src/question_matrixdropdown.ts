import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
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
import { MatrixDropdownBaseSingleInputBehavior } from "./question_matrixdropdownbase";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";

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
  protected getRecordItems(): Array<ItemValue> {
    return this.getRecordItemsCache().items;
  }
  /* Every change of the rows - an assignment, an array change, a reorder, a row value renamed - is a
     change of the records: the caches go, the record indexes kept for the validation of the pages
     follow their keys, and the list re-decides its views over the new records. The rows reach the
     list as a membership change, never as an insert or a remove. */
  private onRecordItemsChanged(): void {
    const oldKeys = this.getRecordItemsCache().keys;
    this.rowsRevision++;
    const newKeys = this.getRecordItemsCache().keys;
    const list = this.dataListValue;
    if (!list) return;
    this.followRemappedRecords((): ((index: number) => number) => createKeyRemap(oldKeys, newKeys));
    list.invalidateViews();
    this.syncPagingState();
  }
  // The one method that composes the records; everything else reads the cache (getListRecords).
  protected composeRecords(): Array<any> {
    const value = this.getStoredRecords();
    const isObject = this.isObject(value);
    return this.getRecordItems().map((item: ItemValue): any => isObject ? value[item.value] : undefined);
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
  // One record without composing the array. Inside a list write the list answers: the write is not in
  // the value yet.
  protected getListRecordAt(index: number): any {
    const list = this.dataListValue;
    if (!!list && list.isWriting) return list.getRecord(index);
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
    this.setNewValue(Object.keys(newValue).length > 0 ? newValue : null);
    this.refreshRowsOfSameKeys(changed);
  }
  private isEmptyRecord(record: any): boolean {
    return record === undefined || record === null || this.isObject(record) && Object.keys(record).length === 0;
  }
  /* A cell write of one row reaches the other rows on the same key here: they show the record that was
     just written. Any other write is an assignment that refreshes every row (onSetQuestionValue). */
  private refreshRowsOfSameKeys(changed: Array<number>): void {
    const cache = this.getRecordItemsCache();
    if (!cache.hasDuplicates || !this.isRowChanging) return;
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
    this.generatedVisibleRows.splice(insertIndex, 0, newRow);
    newRow.visibleIndex = insertIndex;
    this.onMatrixRowCreated(newRow);
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
    this.generatedVisibleRows.forEach((row: MatrixDropdownRowModelBase, index: number): void => { row.builtRecordIndex = index; });
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

  public getSingleInputTitleTemplate(): string { return "rowNameTemplateTitle"; }
  public getValueGetterContext(): IValueGetterContext {
    return new MatrixDropdownValueGetterContext(this);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value) return value;
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
      (<any>res)[rowName] = this.getRowDisplayValue(keysAsText, rows[i], val);
    }
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
  protected getRowDataSegment(row: MatrixDropdownRowModelBase, index: number): string | number {
    return row.rowName + "";
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
      this.getVisibleRows();
      const newVal: any = {};
      const val = this.value;
      for (let key in val) {
        const row = this.getRowByKey(key);
        const isSharedRow = !this.hasValueKey(key) && this.isValueKeyKnown(key);
        if (isSharedRow || (!!row && row.isVisible && this.isRowValueCorrect(val[key]))) {
          newVal[key] = val[key];
        }
      }
      this.value = newVal;
    }
    super.clearIncorrectValues();
  }
  private getRowByKey(val: any): MatrixDropdownRowModelBase {
    const rows = this.generatedVisibleRows;
    if (!rows) return null;
    for (let i = 0; i < rows.length; i ++) {
      if (rows[i].rowName === val) return rows[i];
    }
    return null;
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
    const result = new Array<MatrixDropdownRowModel>();
    const items = this.getRecordItems();
    if (items.length === 0) return result;
    let val = this.value;
    if (!val) val = {};
    const indexes = this.getRecordIndexesForRows();
    for (let i = 0; i < indexes.length; i++) {
      const item = items[indexes[i]];
      const row = this.createMatrixRow(item, this.getRowValueForCreation(val, item.value));
      row.builtRecordIndex = indexes[i];
      result.push(row);
    }
    return result;
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
    }
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
