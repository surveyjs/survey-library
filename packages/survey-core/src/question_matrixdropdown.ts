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
import { HashTable, Helpers } from "./helpers";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, ValueGetterContextCore, VariableGetterContext } from "./conditions/conditionProcessValue";
import { ConditionRunner } from "./conditions/conditionRunner";
import { ArrayChanges, Base } from "./base";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";
import { QuestionRecordItem, IDynamicDataRecordUniqueness } from "./question_records";
import { IRowsChange, RowsDynamicDataSource } from "./dynamic-data/dynamic-data-sources";
import { IDynamicDataRecordCondition } from "./dynamic-data/dynamic-data-record-visibility";
import { IDynamicDataField } from "./dynamic-data/dynamic-data-interfaces";
import { settings } from "./settings";
import { ItemsByNameIndex } from "./utils/items-by-name-index";

export class MatrixDropdownValueGetterContext extends ValueGetterContextCore {
  // hasRowName, findRow: the question's lookups by row name, which it keeps private.
  constructor (protected question: QuestionMatrixDropdownModel, private hasRowName: (name: string) => boolean,
    private findRow: (name: string) => MatrixDropdownRowModelBase) {
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
  // A name that is no rows item does not build the rows.
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    if (!this.hasRowName(name)) return;
    const row = this.findRow(name);
    if (!!row) {
      res.isFound = true;
      res.obj = row;
      res.context = row.getValueGetterContext();
    }
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
    // push, splice and an assignment of rows: the rows items array is refilled in place.
    if (name === "rows") {
      this.rowItemsByNameIndex?.reset();
    }
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "rows") {
      const change = this.rowsSource.rowsChanged();
      if (!!this.generatedVisibleRows) {
        /* A single added or removed row is spliced into the rendered table (Bug#11212), unless the rows
           are built for a view: then the view decides which rows exist, and they are rebuilt as a view
           change rebuilds them, the totals included. */
        if (this.hasDataListView) {
          this.rebuildFromDataList(false);
          this.clearIncorrectValues();
        } else if (!this.tryUpdateRowsIncrementally(arrayChanges, change)) {
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
    // Reset before super: it fires onItemValuePropertyChanged, and a listener may look up the renamed row.
    if (item.ownerPropertyName === "rows" && name === "value") {
      this.rowItemsByNameIndex?.reset();
    }
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
  protected createRecordsSource(): RowsDynamicDataSource<ItemValue> {
    return this.rowsSource;
  }
  /* The lookups by row name: is a name a rows item (any order), and which visible row answers it (the
     first in visibleRows order). Neither notices a change by itself. The rows items array is refilled
     in place, so it is reset when rows change, a rows item is renamed and the matrix is loaded again.
     visibleRows may be the very same array after a row is added or removed (the built rows changed in
     place), so that index is reset whenever visibleRows is cleared. A row keeps the name it was built
     with until the rows are built again. Created on first use, as the rows source. */
  private rowItemsByNameIndex: ItemsByNameIndex<ItemValue>;
  private visibleRowsByNameIndex: ItemsByNameIndex<MatrixDropdownRowModelBase>;
  private hasRowItemByName(name: string): boolean {
    if (!this.rowItemsByNameIndex) {
      this.rowItemsByNameIndex = new ItemsByNameIndex<ItemValue>(item => item.value);
    }
    return this.rowItemsByNameIndex.has(this.rows, name);
  }
  private findVisibleRowByName(name: string): MatrixDropdownRowModelBase {
    if (!this.visibleRowsByNameIndex) {
      this.visibleRowsByNameIndex = new ItemsByNameIndex<MatrixDropdownRowModelBase>(row => row.rowName?.toString() || "");
    }
    return this.visibleRowsByNameIndex.find(this.visibleRows, name);
  }
  protected clearVisibleRows(): void {
    super.clearVisibleRows();
    this.visibleRowsByNameIndex?.reset();
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
  /* The rows source's write: newValue is the answer with the written records in place. The records of
     the other rows stay as they are stored, an answer with no key left is null, and the other rows of a
     written key show what was written. */
  private storeRowsValue(newValue: any, changedIndexes: Array<number>): void {
    this.setOwnRecordsValue(Object.keys(newValue).length > 0 ? newValue : null);
    this.refreshRowsOfSameKeys(changedIndexes);
  }
  /* Generating the rows cleans the record of every row, built or not - a matrix that pages builds only
     the rows of its page -, as released, in the one write the generation makes (getRecordCleanedByRow).
     A later write keeps the records of the other rows as they are stored. */
  protected getValueCleanedOnRowsGeneration(): any {
    const value = this.value;
    if (!this.isObject(value)) return undefined;
    let res: any;
    this.rowsSource.items.forEach((item: ItemValue): void => {
      const key = item.value;
      if (!value.hasOwnProperty(key)) return;
      const record = this.getRecordCleanedByRow(value[key]);
      if (record === value[key]) return;
      if (!res) res = Object.assign({}, value);
      if (record === undefined) {
        delete res[key];
      } else {
        res[key] = record;
      }
    });
    return res;
  }
  /* A record as a built row cleans it: a falsy value (null, 0, false, "") is no record (undefined), a
     column key holding an empty value goes, and so does the record when that leaves it with no key. An
     empty record, a value that is not an object and a key that is not a column stay. Returns the record
     itself when nothing is cleaned. */
  private getRecordCleanedByRow(record: any): any {
    if (!record) return undefined;
    if (!this.isObject(record)) return record;
    const emptyKeys = this.columns.map(column => column.name)
      .filter((name: string): boolean => record.hasOwnProperty(name) && this.isValueEmpty(record[name]));
    if (emptyKeys.length === 0) return record;
    const rest = Object.assign({}, record);
    emptyKeys.forEach((name: string): void => { delete rest[name]; });
    return Object.keys(rest).length > 0 ? rest : undefined;
  }
  /* A cell write of one row reaches the other rows on the same key here: they show the record that was
     just written. Any other write is an assignment that refreshes the rows whose record changed
     (QuestionRecordsModel.onRecordsValueAssigned). */
  private refreshRowsOfSameKeys(changed: Array<number>): void {
    if (!this.isWritingRecords) return;
    const source = this.rowsSource;
    const value = this.value;
    source.getIndexesOfSameKeys(changed).forEach((index: number): void => {
      const row = <MatrixDropdownRowModelBase>this.getItemByRecordIndex(index);
      if (!!row) {
        row.value = this.getUnbindValue(source["readRecordInAnswer"](value, index));
      }
    });
  }
  /* The rows source decides which record a single added or removed row is (change). A row on a value
     another row has is in neither of its lists - the rows of one key are paired by occurrence, so it
     cannot tell which of them came or went - and the matrix is rebuilt; so is it for a row without a
     value, which is no record. */
  private tryUpdateRowsIncrementally(arrayChanges: ArrayChanges | undefined, change: IRowsChange): boolean {
    if (!arrayChanges) return false;
    const itemsToAdd = arrayChanges.itemsToAdd || [];
    const deleteCount = arrayChanges.deleteCount || 0;
    if (itemsToAdd.length === 1 && deleteCount === 0) {
      return this.tryAddSingleRow(<ItemValue>itemsToAdd[0], change.getAddedIndexes());
    }
    if (itemsToAdd.length === 0 && deleteCount === 1) {
      return this.tryRemoveSingleRow(change.getRemovedIndexes());
    }
    return false;
  }
  // The source knows the new rows already (rowsChanged runs first): the record index is the item's place among them.
  private tryAddSingleRow(item: ItemValue, addedIndexes: Array<number>): boolean {
    const insertIndex = this.rowsSource.items.indexOf(item);
    if (insertIndex < 0 || addedIndexes.length !== 1 || addedIndexes[0] !== insertIndex) return false;
    const val = this.value || {};
    const newRow = this.createMatrixRow(item, this.getRowValueForCreation(val, item.value));
    newRow.visibleIndex = insertIndex;
    // The records are the rows items with a value: the row's position is its record index.
    this.addRowForRecord(newRow, insertIndex, insertIndex);
    this.finishIncrementalRowChange((table) => table.onAddedRow(newRow, insertIndex));
    return true;
  }
  /* removedIndexes are old record indexes. Without a view the built rows are still the old records in
     record order, so the row is the one at that position. Its built record index cannot say it: the
     remap has already renumbered the built rows when a detail panel holds a paged question. */
  private tryRemoveSingleRow(removedIndexes: Array<number>): boolean {
    const rows = this.generatedVisibleRows;
    if (removedIndexes.length !== 1 || rows.length !== this.rowsSource.count + 1) return false;
    const removeIndex = removedIndexes[0];
    const removedRow = rows[removeIndex];
    if (!this.isDisposed) {
      this.defaultValuesInRows[removedRow.rowName] = removedRow.getNamesWithDefaultValues();
    }
    rows.splice(removeIndex, 1);
    this.finishIncrementalRowChange((table) => table.onRemovedRow(removedRow));
    this.disposeRow(removedRow);
    return true;
  }
  private finishIncrementalRowChange(updateRendered: (table: QuestionMatrixDropdownRenderedTable) => void): void {
    // Without a view every row is built, in record order: a row's position is its record index.
    this.generatedVisibleRows.forEach((row: MatrixDropdownRowModelBase, index: number): void => { this.setBuiltRecordIndex(row, index); });
    this.clearVisibleRows();
    if (this.isRenderedTableCreated) {
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
  // The base adds the columns and the choices.
  protected getAllChildren(): Base[] {
    return [
      ...super.getAllChildren(),
      ...this.rows
    ];
  }
  /**
   * A title for the total row. Applies if at least one column displays total values.
   * @see rowTitleWidth
   * @see columns
   */
  @property ({ localizable: { markdown: true } }) totalText: string;
  declare readonly locTotalText: LocalizableString;
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
    return new MatrixDropdownValueGetterContext(this, name => this.hasRowItemByName(name), name => this.findVisibleRowByName(name));
  }
  /* Without paging the visible rows; under paging every visible record, in view order: a record on the
     page reads its display values from its row's cells, a record without a row through the columns'
     template questions - nothing is built for it. Neither walk creates the list without paging. */
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value) return value;
    const res: any = {};
    if (this.isPagedByList) {
      this.forEachViewRecord(true, (index: number, item: QuestionRecordItem): void => {
        this.addRecordDisplayValue(res, keysAsText, value, index, <MatrixDropdownRowModelBase>item);
      });
      return res;
    }
    const rows = this.visibleRows;
    if (!rows) return res;
    rows.forEach((row: MatrixDropdownRowModelBase): void => {
      this.addRecordDisplayValue(res, keysAsText, value, this.getBuiltRecordIndex(row), row);
    });
    return res;
  }
  /* The record's row item gives the key and, under keysAsText, its text: two rows on one value each
     show their own. The last row of a key decides; the record is formatted in a copy - value is the
     caller's, and may be survey data itself. */
  private addRecordDisplayValue(res: any, keysAsText: boolean, value: any, index: number, row: MatrixDropdownRowModelBase): void {
    const item = this.getRecordItems()[index];
    const key = item.value;
    const val = value[key];
    if (!val) return;
    res[keysAsText ? item.textOrHtml || key : key] = this.getRecordDisplayValue(keysAsText, row, this.getUnbindValue(val), index);
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
      if (!this.isPagingActive) {
        this.getVisibleRows();
      }
      const newVal: any = {};
      const val = this.value;
      // A key that is no row stays when another question stores it (a shared value name).
      for (let key in val) {
        if (!this.hasValueKey(key) && this.isValueKeyKnown(key)) {
          newVal[key] = val[key];
        }
      }
      /* The records decide, as when invisible rows are cleared (getDataWithoutInvisibleRows): a record
         with a row keeps its answer when the row is visible, one without a row - off the page or
         filtered out - by isRecordKeptWithoutRow. Rows on one value share the answer: a visible one keeps it. */
      const items = this.getRecordItems();
      this.forEachStoredRecord(this.loadedRecordCount, (index: number, item: QuestionRecordItem): void => {
        const key = items[index].value;
        if (!val.hasOwnProperty(key) || !this.isRowValueCorrect(val[key])) return;
        const row = <MatrixDropdownRowModelBase>item;
        if (!!row ? row.isVisible : this.isRecordKeptWithoutRow(index)) {
          newVal[key] = val[key];
        }
      });
      this.value = newVal;
    }
    super.clearIncorrectValues();
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
  // The value is keyed by row name.
  protected createNewValue(nullOnEmpty: boolean = false): any {
    var res = !this.value ? {} : this.createValueCopy();
    if (nullOnEmpty && this.isMatrixValueEmpty(res)) return null;
    return res;
  }
  /* A row's record by its row name, read without a walk: a falsy record reads as null, and create puts
     {} under the name. The Dynamic Matrix reads by record index and keeps a stored 0 or "". */
  protected getRowValueCore(
    row: MatrixDropdownRowModelBase,
    questionValue: any,
    create: boolean = false
  ): any {
    var result =
      !!questionValue && !!questionValue[row.rowName]
        ? questionValue[row.rowName]
        : null;
    if (!result && create) {
      result = {};
      if (!!questionValue) {
        questionValue[row.rowName] = result;
      }
    }
    return result;
  }
  protected deleteRowValue(
    newValue: any,
    row: MatrixDropdownRowModelBase
  ): any {
    if (!newValue) return newValue;
    delete newValue[row.rowName];
    return this.isObject(newValue) && Object.keys(newValue).length == 0
      ? null
      : newValue;
  }
  private isMatrixValueEmpty(val: any) {
    if (!val) return;
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        if (this.isObject(val[i]) && Object.keys(val[i]).length > 0)
          return false;
      }
      return true;
    }
    return Object.keys(val).length == 0;
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
  protected createDesignRow(): MatrixDropdownRowModel {
    return this.createMatrixRow(new ItemValue(1), {});
  }
  // The temporary row of the records clean-up: the record is the rows item at index.
  protected createRowForRecordCleanup(index: number, record: any): MatrixDropdownRowModelBase {
    const item = this.rowsSource.itemAt(index);
    return !!item ? this.createMatrixRow(item, record) : undefined;
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
    // The rows were refilled while loading, which announces nothing. A lookup that ends the load sees them.
    this.rowItemsByNameIndex?.reset();
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
