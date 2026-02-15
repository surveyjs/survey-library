import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { property, Serializer } from "./jsonobject";
import { ConditionRunner } from "./conditions";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * A base class for all matrix question types.
 */
export class QuestionMatrixBaseModel<TRow, TColumn> extends Question {
  protected generatedVisibleRows: Array<TRow> = null;
  protected generatedTotalRow: TRow = null;
  public visibleRowsChangedCallback: () => void;

  protected createColumnValues(): any {
    return this.createItemValues("columns");
  }

  constructor(name: string) {
    super(name);
    this.columns = this.createColumnValues();
    this.rows = this.createItemValues("rows");
  }
  public getType(): string {
    return "matrixbase";
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "rowsVisibleIf" || name === "columnsVisibleIf") {
      this.runCondition(this.getDataFilteredProperties());
    }
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
  @property() showHeader: boolean;
  /**
   * An array of matrix columns.
   *
   * For a Single-Select Matrix, the `columns` array can contain configuration objects with the `text` (display value) and `value` (value to be saved in survey results) properties. Alternatively, the array can contain primitive values that will be used as both the display values and values to be saved in survey results.
   *
   * [Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   *
   * For a Multi-Select Matrix or Dynamic Matrix, the `columns` array should contain configuration objects with properties described in the [`MatrixDropdownColumn`](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) API Reference section.
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))
   */
  @property() columns: Array<any>;
  public get visibleColumns(): Array<any> {
    const res: Array<any> = [];
    this.columns.forEach(col => { if (this.isColumnVisible(col)) { res.push(col); } });
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
   * [Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
+   */
  @property() rows: Array<any>;
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
   *
   * [View Demo](https://surveyjs.io/form-library/examples/change-visibility-of-rows-in-matrix-table/ (linkStyle))
   * @see visibleRows
   * @see columnsVisibleIf
   */
  @property() rowsVisibleIf: string;
  /**
   * A Boolean expression that is evaluated against each matrix column. If the expression evaluates to `false`, the column becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Use the `{item}` placeholder to reference the current column in the expression.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/change-visibility-of-rows-in-matrix-table/ (linkStyle))
   * @see rowsVisibleIf
   */
  @property() columnsVisibleIf: string;
  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    this.runItemsCondition(properties);
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
    if (!res || !(<any>this).hideIfRowsEmpty) return res;
    return this.visibleRows?.length > 0;
  }
  protected shouldRunColumnExpression(): boolean {
    return !this.survey || !this.survey.areInvisibleElementsShowing;
  }
  protected runItemsCondition(properties: HashTable<any>): void {
    const hasRowsChanged = this.runConditionsForRows(properties);
    const hasColumnsChanged = this.runConditionsForColumns(properties);
    const hasChanges = hasColumnsChanged || hasRowsChanged;
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
  protected clearGeneratedRows(): void {
    this.generatedVisibleRows = null;
  }
  protected createRowsVisibleIfRunner(): ConditionRunner { return null; }
  private runConditionsForRows(properties: HashTable<any>): boolean {
    const showInvisibile = this.areInvisibleElementsShowing;
    const runner = !showInvisibile ? this.createRowsVisibleIfRunner() : null;
    const hasChanged = ItemValue.runConditionsForItems(this.rows, undefined, runner,
      properties, !showInvisibile);
    ItemValue.runEnabledConditionsForItems(this.rows, undefined, properties);
    return hasChanged;
  }
  protected runConditionsForColumns(properties: HashTable<any>): boolean {
    const useColumnsExpression = !this.areInvisibleElementsShowing;
    const expression = this.getExpressionFromSurvey("columnsVisibleIf");
    const runner = useColumnsExpression && !!expression ? new ConditionRunner(expression) : null;
    return ItemValue.runConditionsForItems(this.columns, undefined, runner, properties, this.shouldRunColumnExpression());
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
      .append(this.cssClasses.rootAlternateRows, this.alternateRows)
      .append(this.cssClasses.rootVerticalAlignTop, (this.verticalAlign === "top"))
      .append(this.cssClasses.rootVerticalAlignMiddle, (this.verticalAlign === "middle")).toString();
  }
  public getTableWrapperCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.tableWrapper)
      .append(this.cssClasses.tableWrapperLeft, this.titleLocation == "left").toString();
  }

  /**
   * Aligns matrix cell content in the vertical direction.
   */
  @property() verticalAlign: "top" | "middle";

  /**
   * Specifies whether to apply shading to alternate matrix rows.
   *
   * [Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   */
  @property() alternateRows: boolean;

  /**
   * Minimum column width in CSS values.
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   *
   * [Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see width
   */
  @property({ returnValue: "" }) columnMinWidth: string;

  /**
   * A width for the column that displays row titles (first column). Accepts CSS values.
   */
  @property({ returnValue: "" }) rowTitleWidth: string;
  /**
   * Specifies how to arrange matrix questions.
   *
   * Possible values:
   *
   * - `"table"` - Displays matrix questions in a table.
   * - `"list"` - Displays matrix questions one under another as a list.
   * - `"auto"` (default) - Uses the `"table"` mode if the survey has sufficient width to fit the table or the `"list"` mode otherwise.
   */
  @property() displayMode: "auto" | "table" | "list";

  //a11y
  public getCellAriaLabel(row:any, column:any, directRowTitle?: string):string {
    let rowTitle:string = row.locText && row.locText.renderedHtml ? row.locText.renderedHtml : "";
    if (directRowTitle) rowTitle = directRowTitle;
    const columnTitle:string = column.locTitle && column.locTitle.renderedHtml ? column.locTitle.renderedHtml : "";
    const rowString:string = (this.getLocalizationString("matrix_row") || "row").toLocaleLowerCase();
    const columnString:string = (this.getLocalizationString("matrix_column") || "column").toLocaleLowerCase();
    return `${rowString} ${rowTitle}, ${columnString} ${columnTitle}`;
  }

  public get isNewA11yStructure(): boolean {
    return true;
  }
  // EO a11y
  protected getIsMobile(): boolean {
    if (this.displayMode == "auto") return super.getIsMobile();
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
