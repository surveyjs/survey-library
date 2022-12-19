import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { property, Serializer } from "./jsonobject";
import { ConditionRunner } from "./conditions";
import { Helpers } from "./helpers";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * A base class for all matrix question types.
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

  constructor(name: string) {
    super(name);
    this.filteredRows = null;
    this.filteredColumns = null;
    this.columns = this.createColumnValues();
    this.rows = this.createItemValues("rows");
  }
  public getType(): string {
    return "matrixbase";
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.updateVisibilityBasedOnRows();
  }
  public get isCompositeQuestion(): boolean {
    return true;
  }
  /**
   * Specifies whether to display the table header that contains column captions.
   *
   * Default value: `true`
   */
  public get showHeader(): boolean {
    return this.getPropertyValue("showHeader");
  }
  public set showHeader(val: boolean) {
    this.setPropertyValue("showHeader", val);
  }
  /**
   * An array of matrix columns.
   *
   * This array can contain primitive values or objects with the `text` (display value) and `value` (value to be saved in survey results) properties.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
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
   * An array of matrix rows.
   *
   * This array can contain primitive values or objects with the `text` (display value) and `value` (value to be saved in survey results) properties.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
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
   * Returns an array of visible matrix rows.
   * @see rowsVisibleIf
   */
  public get visibleRows(): Array<TRow> {
    return this.getVisibleRows();
  }
  /**
   * A Boolean expression that is evaluated against each matrix row. If the expression evaluates to `false`, the row becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Use the `{item}` placeholder to reference the current row in the expression.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see visibleRows
   * @see columnsVisibleIf
   */
  public get rowsVisibleIf(): string {
    return this.getPropertyValue("rowsVisibleIf", "");
  }
  public set rowsVisibleIf(val: string) {
    this.setPropertyValue("rowsVisibleIf", val);
    this.filterItems();
  }
  /**
   * A Boolean expression that is evaluated against each matrix column. If the expression evaluates to `false`, the column becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Use the `{item}` placeholder to reference the current column in the expression.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
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
  protected onColumnsChanged(): void { }
  protected onRowsChanged(): void {
    this.updateVisibilityBasedOnRows();
    this.fireCallback(this.visibleRowsChangedCallback);
  }
  protected updateVisibilityBasedOnRows(): void {
    if ((<any>this).hideIfRowsEmpty) {
      this.visible =
        this.rows.length > 0 &&
        (!this.filteredRows || this.filteredRows.length > 0);
    }
  }
  protected shouldRunColumnExpression(): boolean {
    return !this.survey || !this.survey.areInvisibleElementsShowing;
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
      if (this.isClearValueOnHidden && (!!this.filteredColumns || !!this.filteredRows)) {
        this.clearIncorrectValues();
      }
      if (!!oldVisibleRows) {
        this.restoreNewVisibleRowsValues(oldVisibleRows);
      }
      this.clearGeneratedRows();
      if (hasColumnsChanged) {
        this.onColumnsChanged();
      }
      this.onRowsChanged();
    }
    return hasChanges;
  }
  protected clearGeneratedRows() {
    this.generatedVisibleRows = null;
  }
  private runConditionsForRows(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    var showInvisibile =
      !!this.survey && this.survey.areInvisibleElementsShowing;
    var runner =
      !showInvisibile && !!this.rowsVisibleIf
        ? new ConditionRunner(this.rowsVisibleIf)
        : null;
    this.filteredRows = [];
    var hasChanged = ItemValue.runConditionsForItems(
      this.rows,
      this.filteredRows,
      runner,
      values,
      properties,
      !showInvisibile
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
    var useColumnsExpression =
      !!this.survey && !this.survey.areInvisibleElementsShowing;
    var runner =
      useColumnsExpression && !!this.columnsVisibleIf
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
    var newData = this.getUnbindValue(this.value);
    var rows = this.rows;
    for (var i = 0; i < rows.length; i++) {
      var key = rows[i].value;
      if (!!newData[key] && !rows[i].isVisible) {
        delete newData[key];
      }
    }
    if (this.isTwoValueEquals(newData, this.value)) return;
    this.value = newData;
  }
  private restoreNewVisibleRowsValues(oldVisibleRows: any) {
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    var val = this.defaultValue;
    var newValue = this.getUnbindValue(this.value);
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
  public needResponsiveWidth() {
    //TODO: make it mor intelligent
    return true;
  }

  public getTableCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootAlternateRows, this.alternateRows)
      .append(this.cssClasses.rootVerticalAlignTop, (this.verticalAlign === "top"))
      .append(this.cssClasses.rootVerticalAlignMiddle, (this.verticalAlign === "middle")).toString();
  }

  /**
   * Aligns matrix cell content in the vertical direction.
   */
  @property({ defaultValue: "middle" }) verticalAlign: "top" | "middle";

  /**
   * Specifies whether to apply shading to alternate matrix rows.
   */
  @property({ defaultValue: false }) alternateRows: boolean;

  /**
   * Minimum column width in CSS values.
   *
   * @see width
   */
  public get columnMinWidth(): string {
    return this.getPropertyValue("columnMinWidth", "");
  }
  public set columnMinWidth(val: string) {
    this.setPropertyValue("columnMinWidth", val);
  }

  /**
   * A width for the column that displays row titles (first column). Accepts CSS values.
   */
  public get rowTitleWidth(): string {
    return this.getPropertyValue("rowTitleWidth", "");
  }
  public set rowTitleWidth(val: string) {
    this.setPropertyValue("rowTitleWidth", val);
  }
}

Serializer.addClass(
  "matrixbase",
  [
    "columnsVisibleIf:condition",
    "rowsVisibleIf:condition",
    "columnMinWidth",
    { name: "showHeader:boolean", default: true },
    {
      name: "verticalAlign",
      choices: ["top", "middle"],
      default: "middle",
    },
    { name: "alternateRows:boolean", default: false }
  ],
  undefined,
  "question"
);
