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
   * For a Single-Select Matrix, the `columns` array can contain configuration objects with the `text` (display value) and `value` (value to be saved in survey results) properties. Alternatively, the array can contain primitive values that will be used as both the display values and values to be saved in survey results.
   *
   * [View "Single-Select Matrix" Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   *
   * For a Multi-Select Matrix or Dynamic Matrix, the `columns` array should contain configuration objects with properties described in the [`MatrixDropdownColumn`](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) API Reference section.
   *
   * [View "Multi-Select Matrix" Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))
   */
  get columns(): Array<any> {
    return this.getPropertyValue("columns");
  }
  set columns(newValue: Array<any>) {
    this.setPropertyValue("columns", newValue);
  }
  public get visibleColumns(): Array<any> {
    const res: Array<any> = [];
    this.columns.forEach(col => { if(this.isColumnVisible(col)) { res.push(col); } });
    return res;
  }
  protected isColumnVisible(column: any): boolean {
    return column.isVisible;
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
    if(!this.isLoadingFromJsonValue) {
      this.runCondition(this.getDataFilteredValues(), this.getDataFilteredProperties());
    }
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
    if(!this.isLoadingFromJson) {
      this.runCondition(this.getDataFilteredValues(), this.getDataFilteredProperties());
    }
  }
  protected runConditionCore(values: HashTable<any>, properties: HashTable<any>): void {
    super.runConditionCore(values, properties);
    this.runItemsCondition(values, properties);
  }
  protected onColumnsChanged(): void { }
  protected onRowsChanged(): void {
    this.updateVisibilityBasedOnRows();
    this.fireCallback(this.visibleRowsChangedCallback);
  }
  protected updateVisibilityBasedOnRows(): void {
    if ((<any>this).hideIfRowsEmpty) {
      this.onVisibleChanged();
    }
  }
  protected isVisibleCore(): boolean {
    const res = super.isVisibleCore();
    if(!res || !(<any>this).hideIfRowsEmpty) return res;
    return this.visibleRows?.length > 0;
  }
  protected shouldRunColumnExpression(): boolean {
    return !this.survey || !this.survey.areInvisibleElementsShowing;
  }
  protected hasRowsAsItems(): boolean {
    return true;
  }
  protected runItemsCondition(values: HashTable<any>, properties: HashTable<any>): void {
    let hasChanges = this.hasRowsAsItems() && this.runConditionsForRows(values, properties);
    const hasColumnsChanged = this.runConditionsForColumns(values, properties);
    hasChanges = hasColumnsChanged || hasChanges;
    if (hasChanges) {
      if (this.isClearValueOnHidden && hasColumnsChanged) {
        this.clearInvisibleColumnValues();
      }
      this.clearGeneratedRows();
      if (hasColumnsChanged) {
        this.onColumnsChanged();
      }
      this.onRowsChanged();
    }
  }
  protected isRowsFiltered(): boolean { return !!this.filteredRows; }
  protected clearGeneratedRows(): void {
    this.generatedVisibleRows = null;
  }
  protected createRowsVisibleIfRunner(): ConditionRunner { return null; }
  private runConditionsForRows(values: HashTable<any>, properties: HashTable<any>): boolean {
    const showInvisibile = !!this.survey && this.survey.areInvisibleElementsShowing;
    const runner = !showInvisibile ? this.createRowsVisibleIfRunner() : null;
    this.filteredRows = [];
    const hasChanged = ItemValue.runConditionsForItems(this.rows, this.filteredRows, runner,
      values, properties, !showInvisibile);
    ItemValue.runEnabledConditionsForItems(this.rows, undefined, values, properties);
    if (this.filteredRows.length === this.rows.length) {
      this.filteredRows = null;
    }
    return hasChanged;
  }
  protected runConditionsForColumns(values: HashTable<any>, properties: HashTable<any>): boolean {
    const useColumnsExpression = !!this.survey && !this.survey.areInvisibleElementsShowing;
    const runner = useColumnsExpression && !!this.columnsVisibleIf ? new ConditionRunner(this.columnsVisibleIf) : null;
    return ItemValue.runConditionsForItems(this.columns, undefined, runner, values, properties, this.shouldRunColumnExpression());
  }
  protected clearInvisibleColumnValues(): void {}
  protected clearInvisibleValuesInRows(): void {}
  public needResponsiveWidth() {
    //TODO: make it mor intelligent
    return true;
  }

  protected get columnsAutoWidth() {
    return !this.isMobile && !this.columns.some(col => !!col.width);
  }
  public getTableCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.columnsAutoWidth, this.columnsAutoWidth)
      .append(this.cssClasses.noHeader, !this.showHeader)
      .append(this.cssClasses.hasFooter, !!this.renderedTable?.showAddRowOnBottom)
      .append(this.cssClasses.rootAlternateRows, this.alternateRows)
      .append(this.cssClasses.rootVerticalAlignTop, (this.verticalAlign === "top"))
      .append(this.cssClasses.rootVerticalAlignMiddle, (this.verticalAlign === "middle")).toString();
  }

  /**
   * Aligns matrix cell content in the vertical direction.
   */
  @property() verticalAlign: "top" | "middle";

  /**
   * Specifies whether to apply shading to alternate matrix rows.
   */
  @property() alternateRows: boolean;

  /**
   * Minimum column width in CSS values.
   *
   * @see width
   */
  public get columnMinWidth(): string {
    return this.getPropertyValue("columnMinWidth") || "";
  }
  public set columnMinWidth(val: string) {
    this.setPropertyValue("columnMinWidth", val);
  }

  /**
   * A width for the column that displays row titles (first column). Accepts CSS values.
   */
  public get rowTitleWidth(): string {
    return this.getPropertyValue("rowTitleWidth") || "";
  }
  public set rowTitleWidth(val: string) {
    this.setPropertyValue("rowTitleWidth", val);
  }
  /**
   * Specifies how to arrange matrix questions.
   *
   * Possible values:
   *
   * - `"table"` - Displays matrix questions in a table.
   * - `"list"` - Displays matrix questions one under another as a list.
   * - `"auto"` (default) - Uses the `"table"` mode if the survey has sufficient width to fit the table or the `"list"` mode otherwise.
   */
  public set displayMode(val: "auto" | "table" | "list") {
    this.setPropertyValue("displayMode", val);
  }
  public get displayMode(): "auto" | "table" | "list" {
    return this.getPropertyValue("displayMode");
  }

  //a11y
  public getCellAriaLabel(rowTitle:string, columnTitle:string):string {
    const row = (this.getLocalizationString("matrix_row") || "row").toLocaleLowerCase();
    const column = (this.getLocalizationString("matrix_column") || "column").toLocaleLowerCase();
    return `${row} ${rowTitle}, ${column} ${columnTitle}`;
  }

  public get isNewA11yStructure(): boolean {
    return true;
  }
  // EO a11y
  protected getIsMobile(): boolean {
    if(this.displayMode == "auto") return super.getIsMobile();
    return this.displayMode === "list";
  }
}

Serializer.addClass(
  "matrixbase",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true, category: "general" },
    "columnsVisibleIf:condition",
    "rowsVisibleIf:condition",
    "columnMinWidth",
    { name: "showHeader:boolean", default: true },
    {
      name: "verticalAlign",
      choices: ["top", "middle"],
      default: "middle",
    },
    { name: "alternateRows:boolean", default: false },
    {
      name: "displayMode",
      default: "auto",
      choices: ["auto", "table", "list"],
      visible: false
    },
  ],
  undefined,
  "question"
);
