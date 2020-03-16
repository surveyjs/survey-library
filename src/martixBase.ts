import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { Serializer } from "./jsonobject";
import { ConditionRunner } from "./conditions";
import { Helpers } from "./helpers";

/**
 * A Model for a matrix base question.
 */
export class QuestionMatrixBaseModel<TRow, TColumn> extends Question {
  protected filteredColumns: Array<TColumn>;
  protected filteredRows: Array<ItemValue>;
  protected generatedVisibleRows: Array<TRow> = null;
  protected generatedTotalRow: TRow = null;
  public visibleRowsChangedCallback: () => void;

  protected createColumnValues(): any {
    return this.createItemValues("columns");
  }

  constructor(public name: string) {
    super(name);
    this.filteredRows = null;
    this.filteredColumns = null;
    this.columns = this.createColumnValues();
    this.rows = this.createItemValues("rows");
  }
  public getType(): string {
    return "matrixbase";
  }
  public get isCompositeQuestion(): boolean {
    return true;
  }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  /**
   * Set this property to false, to hide table header. The default value is true.
   */
  public get showHeader(): boolean {
    return this.getPropertyValue("showHeader");
  }
  public set showHeader(val: boolean) {
    this.setPropertyValue("showHeader", val);
  }
  /**
   * The list of columns. A column has a value and an optional text
   */
  get columns(): Array<any> {
    return this.getPropertyValue("columns");
  }
  set columns(newValue: Array<any>) {
    this.setPropertyValue("columns", newValue);
  }
  public get visibleColumns(): Array<any> {
    return !!this.filteredColumns ? this.filteredColumns : this.columns;
  }
  /**
   * The list of rows. A row has a value and an optional text
   */
  get rows(): Array<any> {
    return this.getPropertyValue("rows");
  }
  set rows(newValue: Array<any>) {
    var newRows = this.processRowsOnSet(newValue);
    this.setPropertyValue("rows", newRows);
    this.filterItems();
  }
  protected processRowsOnSet(newRows: Array<any>) {
    return newRows;
  }
  protected getVisibleRows(): Array<TRow> {
    return [];
  }
  /**
   * Returns the list of visible rows as model objects.
   * @see rowsVisibleIf
   */
  public get visibleRows(): Array<TRow> {
    return this.getVisibleRows();
  }

  /**
   * An expression that returns true or false. It runs against each row item and if for this item it returns true, then the item is visible otherwise the item becomes invisible. Please use {item} to get the current item value in the expression.
   * @see visibleIf
   */
  public get rowsVisibleIf(): string {
    return this.getPropertyValue("rowsVisibleIf", "");
  }
  public set rowsVisibleIf(val: string) {
    this.setPropertyValue("rowsVisibleIf", val);
    this.filterItems();
  }
  /**
   * An expression that returns true or false. It runs against each column item and if for this item it returns true, then the item is visible otherwise the item becomes invisible. Please use {item} to get the current item value in the expression.
   * @see rowsVisibleIf
   */
  public get columnsVisibleIf(): string {
    return this.getPropertyValue("columnsVisibleIf", "");
  }
  public set columnsVisibleIf(val: string) {
    this.setPropertyValue("columnsVisibleIf", val);
    this.filterItems();
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    this.runItemsCondition(values, properties);
  }
  protected filterItems(): boolean {
    if (this.areInvisibleElementsShowing) {
      this.onRowsChanged();
      return false;
    }
    if (this.isLoadingFromJson || !this.data) return false;
    return this.runItemsCondition(
      this.getDataFilteredValues(),
      this.getDataFilteredProperties()
    );
  }
  protected onColumnsChanged() {}
  protected onRowsChanged() {
    this.fireCallback(this.visibleRowsChangedCallback);
  }
  protected shouldRunColumnExpression(): boolean {
    return true;
  }
  protected hasRowsAsItems(): boolean {
    return true;
  }
  protected runItemsCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    var oldVisibleRows = null;
    if (!!this.filteredRows && !Helpers.isValueEmpty(this.defaultValue)) {
      oldVisibleRows = [];
      for (var i = 0; i < this.filteredRows.length; i++) {
        oldVisibleRows.push(this.filteredRows[i]);
      }
    }
    var hasChanges =
      this.hasRowsAsItems() && this.runConditionsForRows(values, properties);
    var hasColumnsChanged = this.runConditionsForColumns(values, properties);
    hasChanges = hasColumnsChanged || hasChanges;
    if (hasChanges) {
      if (!!this.filteredColumns || !!this.filteredRows) {
        this.clearIncorrectValues();
      }
      if (!!oldVisibleRows) {
        this.restoreNewVisibleRowsValues(oldVisibleRows);
      }
      this.generatedVisibleRows = null;
      if (hasColumnsChanged) {
        this.onColumnsChanged();
      }
      this.onRowsChanged();
    }
    return hasChanges;
  }
  private runConditionsForRows(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    var runner = !!this.rowsVisibleIf
      ? new ConditionRunner(this.rowsVisibleIf)
      : null;
    this.filteredRows = [];
    var hasChanged = ItemValue.runConditionsForItems(
      this.rows,
      this.filteredRows,
      runner,
      values,
      properties
    );
    if (this.filteredRows.length === this.rows.length) {
      this.filteredRows = null;
    }
    return hasChanged;
  }
  private runConditionsForColumns(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    var runner = !!this.columnsVisibleIf
      ? new ConditionRunner(this.columnsVisibleIf)
      : null;
    this.filteredColumns = [];
    var hasChanged = ItemValue.runConditionsForItems(
      this.columns,
      <any>this.filteredColumns,
      runner,
      values,
      properties,
      this.shouldRunColumnExpression()
    );
    if (this.filteredColumns.length === this.columns.length) {
      this.filteredColumns = null;
    }
    return hasChanged;
  }
  public clearIncorrectValues() {
    var val = this.value;
    if (!val) return;
    var newVal = null;
    var isChanged = false;
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    var columns = !!this.filteredColumns ? this.filteredColumns : this.columns;
    for (var key in val) {
      if (
        ItemValue.getItemByValue(rows, key) &&
        ItemValue.getItemByValue(columns, val[key])
      ) {
        if (newVal == null) newVal = {};
        (<any>newVal)[key] = val[key];
      } else {
        isChanged = true;
      }
    }
    if (isChanged) {
      this.value = newVal;
    }
    super.clearIncorrectValues();
  }
  protected clearInvisibleValuesInRows() {
    if (this.isEmpty()) return;
    var newData = Helpers.getUnbindValue(this.value);
    var rows = this.rows;
    for (var i = 0; i < rows.length; i++) {
      var key = rows[i].value;
      if (!!newData[key] && !rows[i].isVisible) {
        delete newData[key];
      }
    }
    if (Helpers.isTwoValueEquals(newData, this.value)) return;
    this.value = newData;
  }
  private restoreNewVisibleRowsValues(oldVisibleRows: any) {
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    var val = this.defaultValue;
    var newValue = Helpers.getUnbindValue(this.value);
    var isChanged = false;
    for (var key in val) {
      if (
        ItemValue.getItemByValue(rows, key) &&
        !ItemValue.getItemByValue(oldVisibleRows, key)
      ) {
        if (newValue == null) newValue = {};
        (<any>newValue)[key] = val[key];
        isChanged = true;
      }
    }
    if (isChanged) {
      this.value = newValue;
    }
  }
}

Serializer.addClass(
  "matrixbase",
  [
    "columnsVisibleIf:condition",
    "rowsVisibleIf:condition",
    { name: "showHeader:boolean", default: true }
  ],
  undefined,
  "question"
);
