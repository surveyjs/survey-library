import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { JsonObject } from "./jsonobject";
import { ConditionRunner } from "./conditions";

/**
 * A Model for a matrix base question.
 */
export class QuestionMatrixBaseModel<TRow, TColumn> extends Question {
  protected columnsValue: Array<TColumn>;
  protected filteredColumns: Array<TColumn>;
  protected filteredRows: Array<ItemValue>;
  protected generatedVisibleRows: Array<TRow> = null;
  public visibleRowsChangedCallback: () => void;

  protected createColumnValues():any {
    return [];
  }

  constructor(public name: string) {
    super(name);
    this.filteredRows = null;
    this.filteredColumns = null;
    this.columnsValue = this.createColumnValues();
    this.rows = this.createItemValues("rows");
  }
  public getType(): string {
    return "matrixbase";
  }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  /**
   * The list of columns. A column has a value and an optional text
   */
  get columns(): Array<any> {
    return this.columnsValue;
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
    this.setPropertyValue("rows", newValue);
    this.filterItems();
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
    if (this.isDesignMode) {
      this.onRowsChanged();
      return false;
    }
    if (this.isLoadingFromJson || !this.data) return false;
    return this.runItemsCondition(
      this.getDataFilteredValues(),
      this.getDataFilteredProperties()
    );
  }
  protected onRowsChanged() {
    this.fireCallback(this.visibleRowsChangedCallback);
  }
  protected runItemsCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    var hasChanges = this.runConditionsForRows(values, properties);
    hasChanges = this.runConditionsForColumns(values, properties) || hasChanges;
    if (hasChanges) {
      if (!!this.filteredColumns || !!this.filteredRows) {
        this.clearIncorrectValues();
      }
      this.generatedVisibleRows = null;
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
      properties
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
}

JsonObject.metaData.addClass(
  "matrixbase",
  ["columnsVisibleIf:condition", "rowsVisibleIf:condition"],
  undefined,
  "question"
);
