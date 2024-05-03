import { HashTable, Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { QuestionMatrixBaseModel } from "./martixBase";
import { JsonObject, Serializer } from "./jsonobject";
import { Base } from "./base";
import { SurveyError } from "./survey-error";
import { surveyLocalization } from "./surveyStrings";
import { RequiredInAllRowsError, EachRowUniqueError } from "./error";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString, ILocalizableOwner } from "./localizablestring";
import { QuestionDropdownModel } from "./question_dropdown";
import { IConditionObject, IQuestionPlainData } from "./question";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IPlainDataOptions } from "./base-interfaces";

export interface IMatrixData {
  onMatrixRowChanged(row: MatrixRowModel): void;
  getCorrectedRowValue(value: any): any;
  cssClasses: any;
  isDisabledStyle: boolean;
  isInputReadOnly: boolean;
  hasErrorInRow(row: MatrixRowModel): boolean;
}

export class MatrixRowModel extends Base {
  private data: IMatrixData;
  public cellClick: any;

  constructor(
    public item: ItemValue,
    public fullName: string,
    data: IMatrixData,
    value: any
  ) {
    super();
    this.data = data;
    this.setValueDirectly(value);
    this.cellClick = (column: any) => {
      this.value = column.value;
    };
    this.registerPropertyChangedHandlers(["value"], () => {
      if (this.data) this.data.onMatrixRowChanged(this);
    });
    if(this.data && this.data.hasErrorInRow(this)) {
      this.hasError = true;
    }
  }
  public get name(): string {
    return this.item.value;
  }
  public get text(): string {
    return this.item.text;
  }
  public get locText(): LocalizableString {
    return this.item.locText;
  }
  public get value(): any {
    return this.getPropertyValue("value");
  }
  public set value(val: any) {
    if(!this.isReadOnly) {
      this.setValueDirectly(this.data.getCorrectedRowValue(val));
    }
  }
  public setValueDirectly(val: any): void {
    this.setPropertyValue("value", val);
  }
  public get isReadOnly(): boolean { return !this.item.enabled || this.data.isInputReadOnly; }
  public get rowTextClasses(): string {
    return new CssClassBuilder().append(this.data.cssClasses.rowTextCell).toString();
  }
  public get hasError(): boolean {
    return this.getPropertyValue("hasError", false);
  }
  public set hasError(val: boolean) {
    this.setPropertyValue("hasError", val);
  }
  public get rowClasses(): string {
    const cssClasses = (<any>this.data).cssClasses;
    return new CssClassBuilder().append(cssClasses.row)
      .append(cssClasses.rowError, this.hasError)
      .append(cssClasses.rowReadOnly, this.isReadOnly)
      .append(cssClasses.rowDisabled, this.data.isDisabledStyle)
      .toString();
  }
}

export interface IMatrixCellsOwner extends ILocalizableOwner {
  getRows(): Array<any>;
  getColumns(): Array<any>;
}

export class MatrixCells {
  private values: { [index: string]: any } = {};
  public constructor(public cellsOwner: IMatrixCellsOwner) {}
  public get isEmpty(): boolean {
    return Object.keys(this.values).length == 0;
  }
  public onValuesChanged: () => void;
  private valuesChanged(): void {
    if(!!this.onValuesChanged) {
      this.onValuesChanged();
    }
  }
  public setCellText(row: any, column: any, val: string): void {
    row = this.getCellRowColumnValue(row, this.rows);
    column = this.getCellRowColumnValue(column, this.columns);
    if (!row || !column) return;
    if (val) {
      if (!this.values[row]) this.values[row] = {};
      if (!this.values[row][column])
        this.values[row][column] = this.createString();
      this.values[row][column].text = val;
    } else {
      if (this.values[row] && this.values[row][column]) {
        var loc = this.values[row][column];
        loc.text = "";
        if (loc.isEmpty) {
          delete this.values[row][column];
          if (Object.keys(this.values[row]).length == 0) {
            delete this.values[row];
          }
        }
      }
    }
    this.valuesChanged();
  }
  public setDefaultCellText(column: any, val: string) {
    this.setCellText(settings.matrix.defaultRowName, column, val);
  }
  public getCellLocText(row: any, column: any): LocalizableString {
    row = this.getCellRowColumnValue(row, this.rows);
    column = this.getCellRowColumnValue(column, this.columns);
    if (!row || !column) return null;
    if (!this.values[row]) return null;
    if (!this.values[row][column]) return null;
    return this.values[row][column];
  }
  public getDefaultCellLocText(column: any, val: string): LocalizableString {
    return this.getCellLocText(settings.matrix.defaultRowName, column);
  }
  public getCellDisplayLocText(row: any, column: any): LocalizableString {
    var cellText = this.getCellLocText(row, column);
    if (cellText && !cellText.isEmpty) return cellText;
    cellText = this.getCellLocText(settings.matrix.defaultRowName, column);
    if (cellText && !cellText.isEmpty) return cellText;
    if (typeof column == "number") {
      column =
        column >= 0 && column < this.columns.length
          ? this.columns[column]
          : null;
    }
    if (column && column.locText) return column.locText;
    return null;
  }
  public getCellText(row: any, column: any): string {
    var loc = this.getCellLocText(row, column);
    return loc ? loc.calculatedText : null;
  }
  public getDefaultCellText(column: any): string {
    var loc = this.getCellLocText(settings.matrix.defaultRowName, column);
    return loc ? loc.calculatedText : null;
  }
  public getCellDisplayText(row: any, column: any): string {
    var loc = this.getCellDisplayLocText(row, column);
    return loc ? loc.calculatedText : null;
  }
  public get rows(): Array<any> {
    return this.cellsOwner ? this.cellsOwner.getRows() : [];
  }
  public get columns(): Array<any> {
    return this.cellsOwner ? this.cellsOwner.getColumns() : [];
  }
  private getCellRowColumnValue(val: any, values: Array<any>): any {
    if (val === null || val === undefined) return null;
    if (typeof val == "number") {
      if (val < 0 || val >= values.length) return null;
      val = values[val].value;
    }
    if (val.value) return val.value;
    return val;
  }
  public getJson(): any {
    if (this.isEmpty) return null;
    var res: { [index: string]: any } = {};
    for (var row in this.values) {
      var resRow: { [index: string]: any } = {};
      var rowValues = this.values[row];
      for (var col in rowValues) {
        resRow[col] = rowValues[col].getJson();
      }
      res[row] = resRow;
    }
    return res;
  }
  public setJson(value: any): void {
    this.values = {};
    if (!!value) {
      for (var row in value) {
        if (row == "pos") continue;
        var rowValues = value[row];
        this.values[row] = {};
        for (var col in rowValues) {
          if (col == "pos") continue;
          var loc = this.createString();
          loc.setJson(rowValues[col]);
          this.values[row][col] = loc;
        }
      }
    }
    this.valuesChanged();
  }
  public locStrsChanged(): void {
    if (this.isEmpty) return;
    for (var row in this.values) {
      var rowValues = this.values[row];
      for (var col in rowValues) {
        rowValues[col].strChanged();
      }
    }
  }
  protected createString(): LocalizableString {
    return new LocalizableString(this.cellsOwner, true);
  }
}

/**
  * A class that describes the Single-Select Matrix question type.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
  */
export class QuestionMatrixModel
  extends QuestionMatrixBaseModel<MatrixRowModel, ItemValue>
  implements IMatrixData, IMatrixCellsOwner {
  private isRowChanging = false;
  private cellsValue: MatrixCells;

  constructor(name: string) {
    super(name);
    this.cellsValue = new MatrixCells(this);
    this.cellsValue.onValuesChanged = () => {
      this.updateHasCellText();
      this.propertyValueChanged("cells", this.cells, this.cells);
    };
    this.registerPropertyChangedHandlers(["columns"], () => {
      this.onColumnsChanged();
    });
    this.registerPropertyChangedHandlers(["rows"], () => {
      if (!this.filterItems()) {
        this.onRowsChanged();
      }
    });
    this.registerPropertyChangedHandlers(["hideIfRowsEmpty"], () => {
      this.updateVisibilityBasedOnRows();
    });
  }
  public getType(): string {
    return "matrix";
  }
  /**
   * The name of a component used to render cells.
   */
  public get cellComponent(): string {
    return this.getPropertyValue("cellComponent");
  }
  public set itemComponent(value: string) {
    this.setPropertyValue("cellComponent", value);
  }
  public get hasSingleInput(): boolean {
    return false;
  }
  /**
   * Specifies whether each row requires an answer. If a respondent skips a row, the question displays a validation error.
   * @see isRequired
   * @see eachRowUnique
   * @see validators
   */
  public get isAllRowRequired(): boolean {
    return this.getPropertyValue("isAllRowRequired");
  }
  public set isAllRowRequired(val: boolean) {
    this.setPropertyValue("isAllRowRequired", val);
  }
  /**
   * Specifies whether answers in all rows should be unique. If any answers duplicate, the question displays a validation error.
   * @see isAllRowRequired
   * @see validators
   */
  public get eachRowUnique(): boolean {
    return this.getPropertyValue("eachRowUnique");
  }
  public set eachRowUnique(val: boolean) {
    this.setPropertyValue("eachRowUnique", val);
  }
  public get hasRows(): boolean {
    return this.rows.length > 0;
  }
  /**
   * Specifies a sort order for matrix rows.
   *
   * Possible values:
   *
   * - "initial" (default) - Preserves the original order of the `rows` array.
   * - "random" - Arranges matrix rows in random order each time the question is displayed.
   * @see rows
   */
  public get rowsOrder(): string {
    return this.getPropertyValue("rowsOrder");
  }
  public set rowsOrder(val: string) {
    val = val.toLowerCase();
    if (val == this.rowsOrder) return;
    this.setPropertyValue("rowsOrder", val);
    this.onRowsChanged();
  }
  /**
   * Specifies whether to hide the question when the matrix has no visible rows.
   * @see rowsVisibleIf
   */
  public get hideIfRowsEmpty(): boolean {
    return this.getPropertyValue("hideIfRowsEmpty");
  }
  public set hideIfRowsEmpty(val: boolean) {
    this.setPropertyValue("hideIfRowsEmpty", val);
  }
  getRows(): Array<any> {
    return this.rows;
  }
  getColumns(): Array<any> {
    return this.visibleColumns;
  }
  public addColumn(value: any, text?: string): ItemValue {
    var col = new ItemValue(value, text);
    this.columns.push(col);
    return col;
  }
  public getItemClass(row: any, column: any): string {
    const isChecked = row.value == column.value;
    const isDisabled = this.isReadOnly;
    const allowHover = !isChecked && !isDisabled;
    const hasCellText = this.hasCellText;
    const css = this.cssClasses;
    return new CssClassBuilder()
      .append(css.cell, hasCellText)
      .append(hasCellText ? css.cellText : css.label)
      .append(css.itemOnError, !hasCellText && (this.isAllRowRequired || this.eachRowUnique ? row.hasError : this.hasCssError()))
      .append(hasCellText ? css.cellTextSelected : css.itemChecked, isChecked)
      .append(hasCellText ? css.cellTextDisabled : css.itemDisabled, this.isDisabledStyle)
      .append(hasCellText ? css.cellTextReadOnly : css.itemReadOnly, this.isReadOnlyStyle)
      .append(hasCellText ? css.cellTextPreview : css.itemPreview, this.isPreviewStyle)
      .append(css.itemHover, allowHover && !hasCellText)
      .toString();
  }
  public get itemSvgIcon(): string {
    if (this.isPreviewStyle && this.cssClasses.itemPreviewSvgIconId) {
      return this.cssClasses.itemPreviewSvgIconId;
    }
    return this.cssClasses.itemSvgIconId;
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.cells.locStrsChanged();
  }
  protected getQuizQuestionCount() {
    var res = 0;
    for (var i = 0; i < this.rows.length; i++) {
      if (!this.isValueEmpty(this.correctAnswer[this.rows[i].value])) res++;
    }
    return res;
  }
  protected getCorrectAnswerCount(): number {
    var res = 0;
    var value = this.value;
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i].value;
      if (
        !this.isValueEmpty(value[row]) &&
        this.isTwoValueEquals(this.correctAnswer[row], value[row])
      )
        res++;
    }
    return res;
  }
  protected runItemsCondition(values: HashTable<any>, properties: HashTable<any>): boolean {
    ItemValue.runEnabledConditionsForItems(this.rows, undefined, values, properties);
    return super.runItemsCondition(values, properties);
  }
  protected getVisibleRows(): Array<MatrixRowModel> {
    var result = new Array<MatrixRowModel>();
    var val = this.value;
    if (!val) val = {};
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (this.isValueEmpty(row.value)) continue;
      result.push(
        this.createMatrixRow(
          row,
          this.id + "_" + row.value.toString().replace(/\s/g, "_"),
          val[row.value]
        )
      );
    }
    this.generatedVisibleRows = result;
    return result;
  }
  protected sortVisibleRows(
    array: Array<MatrixRowModel>
  ): Array<MatrixRowModel> {
    if (!!this.survey && this.survey.isDesignMode)
      return array;
    var order = this.rowsOrder.toLowerCase();
    if (order === "random")
      return Helpers.randomizeArray<MatrixRowModel>(array);
    return array;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.rows = this.sortVisibleRows(this.rows);
  }
  protected isNewValueCorrect(val: any): boolean {
    return Helpers.isValueObject(val, true);
  }
  protected processRowsOnSet(newRows: Array<any>) {
    return this.sortVisibleRows(newRows);
  }
  public get visibleRows(): Array<MatrixRowModel> {
    return this.getVisibleRows();
  }
  /**
   * An array of matrix cells. Use this array to get or set cell values.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/questiontype-matrix-rubric/ (linkStyle))
   */
  public get cells(): MatrixCells {
    return this.cellsValue;
  }
  public set cells(value: MatrixCells) {
    this.cells.setJson(value && value.getJson ? value.getJson() : null);
  }
  public get hasCellText(): boolean {
    return this.getPropertyValue("hasCellText", false);
  }
  protected updateHasCellText(): void {
    this.setPropertyValue("hasCellText", !this.cells.isEmpty);
  }
  public setCellText(row: any, column: any, val: string) {
    this.cells.setCellText(row, column, val);
  }
  public getCellText(row: any, column: any): string {
    return this.cells.getCellText(row, column);
  }
  public setDefaultCellText(column: any, val: string) {
    this.cells.setDefaultCellText(column, val);
  }
  public getDefaultCellText(column: any): string {
    return this.cells.getDefaultCellText(column);
  }
  public getCellDisplayText(row: any, column: any): string {
    return this.cells.getCellDisplayText(row, column);
  }
  private emptyLocalizableString = new LocalizableString(this);
  public getCellDisplayLocText(row: any, column: any): LocalizableString {
    var loc = this.cells.getCellDisplayLocText(row, column);
    return loc ? loc : this.emptyLocalizableString;
  }
  supportGoNextPageAutomatic(): boolean {
    return this.isMouseDown === true && this.hasValuesInAllRows();
  }
  private errorsInRow: HashTable<boolean>;
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (!isOnValueChanged || this.hasCssError()) {
      const rowsErrors = { noValue: false, isNotUnique: false };
      this.checkErrorsAllRows(true, rowsErrors);
      if(rowsErrors.noValue) {
        errors.push(new RequiredInAllRowsError(null, this));
      }
      if(rowsErrors.isNotUnique) {
        errors.push(new EachRowUniqueError(null, this));
      }
    }
  }
  private hasValuesInAllRows(): boolean {
    const rowsErrors = { noValue: false, isNotUnique: false };
    this.checkErrorsAllRows(false, rowsErrors, true);
    return !rowsErrors.noValue;
  }
  private checkErrorsAllRows(modifyErrors: boolean, res: { noValue: boolean, isNotUnique: boolean }, allRowsRequired?: boolean): void {
    var rows = this.generatedVisibleRows;
    if (!rows) rows = this.visibleRows;
    if (!rows) return;
    const rowsRequired = this.isAllRowRequired || allRowsRequired;
    const rowsUnique = this.eachRowUnique;
    res.noValue = false;
    res.isNotUnique = false;
    if(modifyErrors) {
      this.errorsInRow = undefined;
    }
    if(!rowsRequired && !rowsUnique) return;
    const hash: HashTable<any> = {};
    for (var i = 0; i < rows.length; i++) {
      const val = rows[i].value;
      let isEmpty = this.isValueEmpty(val);
      const isNotUnique = rowsUnique && (!isEmpty && hash[val] === true);
      isEmpty = isEmpty && rowsRequired;
      if(modifyErrors && (isEmpty || isNotUnique)) {
        this.addErrorIntoRow(rows[i]);
      }
      if(!isEmpty) {
        hash[val] = true;
      }
      res.noValue = res.noValue || isEmpty;
      res.isNotUnique = res.isNotUnique || isNotUnique;
    }
    if(modifyErrors) {
      rows.forEach(row => {
        row.hasError = this.hasErrorInRow(row);
      });
    }
  }
  private addErrorIntoRow(row: MatrixRowModel): void {
    if(!this.errorsInRow) this.errorsInRow = {};
    this.errorsInRow[row.name] = true;
    row.hasError = true;
  }
  private refreshRowsErrors(): void {
    if(!this.errorsInRow) return;
    this.checkErrorsAllRows(true, { noValue: false, isNotUnique: false });
  }
  protected getIsAnswered(): boolean {
    return super.getIsAnswered() && this.hasValuesInAllRows();
  }
  private createMatrixRow(
    item: ItemValue,
    fullName: string,
    value: any
  ): MatrixRowModel {
    var row = new MatrixRowModel(item, fullName, this, value);
    this.onMatrixRowCreated(row);
    return row;
  }
  protected onMatrixRowCreated(row: MatrixRowModel) {}
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, this.isRowChanging || updateIsAnswered);
    if (!this.generatedVisibleRows || this.generatedVisibleRows.length == 0)
      return;
    this.isRowChanging = true;
    var val = this.value;
    if (!val) val = {};
    if (this.rows.length == 0) {
      this.generatedVisibleRows[0].setValueDirectly(val);
    } else {
      for (var i = 0; i < this.generatedVisibleRows.length; i++) {
        var row = this.generatedVisibleRows[i];
        var rowVal = val[row.name];
        if (this.isValueEmpty(rowVal)) rowVal = null;
        this.generatedVisibleRows[i].setValueDirectly(rowVal);
      }
    }
    this.refreshRowsErrors();
    this.updateIsAnswered();
    this.isRowChanging = false;
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var res: { [index: string]: any } = {};
    for (var key in value) {
      var newKey = keysAsText
        ? ItemValue.getTextOrHtmlByValue(this.rows, key)
        : key;
      if (!newKey) newKey = key;
      var newValue = ItemValue.getTextOrHtmlByValue(this.columns, value[key]);
      if (!newValue) newValue = value[key];
      res[newKey] = newValue;
    }
    return res;
  }
  public getPlainData(
    options: IPlainDataOptions = {
      includeEmpty: true,
    }
  ): IQuestionPlainData {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      var values = this.createValueCopy();
      questionPlainData.isNode = true;
      questionPlainData.data = Object.keys(values || {}).map((rowName) => {
        var row = this.rows.filter(
          (r: MatrixRowModel) => r.value === rowName
        )[0];
        var rowDataItem = <any>{
          name: rowName,
          title: !!row ? row.text : "row",
          value: values[rowName],
          displayValue: ItemValue.getTextOrHtmlByValue(
            this.visibleColumns,
            values[rowName]
          ),
          getString: (val: any) =>
            typeof val === "object" ? JSON.stringify(val) : val,
          isNode: false,
        };
        var item = ItemValue.getItemByValue(
          this.visibleColumns,
          values[rowName]
        );
        if (!!item) {
          (options.calculations || []).forEach((calculation) => {
            rowDataItem[calculation.propertyName] =
              item[calculation.propertyName];
          });
        }
        return rowDataItem;
      });
    }
    return questionPlainData;
  }
  public addConditionObjectsByContext(
    objects: Array<IConditionObject>,
    context: any
  ) {
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      if (!!row.value) {
        objects.push({
          name: this.getValueName() + "." + row.value,
          text: this.processedTitle + "." + row.calculatedText,
          question: this,
        });
      }
    }
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson(operator);
    var question = new QuestionDropdownModel(path);
    question.choices = this.columns;
    var json = new JsonObject().toJsonObject(question);
    json["type"] = question.getType();
    return json;
  }
  protected clearValueIfInvisibleCore(reason: string): void {
    super.clearValueIfInvisibleCore(reason);
    if (this.hasRows) {
      this.clearInvisibleValuesInRows();
    }
  }
  protected getFirstInputElementId(): string {
    var rows = this.generatedVisibleRows;
    if (!rows) rows = this.visibleRows;
    if (rows.length > 0 && this.visibleColumns.length > 0) {
      return this.inputId + "_" + rows[0].name + "_" + 0;
    }
    return super.getFirstInputElementId();
  }
  //IMatrixData
  onMatrixRowChanged(row: MatrixRowModel) {
    if (this.isRowChanging) return;
    this.isRowChanging = true;
    if (!this.hasRows) {
      this.setNewValue(row.value);
    } else {
      var newValue = this.value;
      if (!newValue) {
        newValue = {};
      }
      newValue[row.name] = row.value;
      this.setNewValue(newValue);
    }
    this.isRowChanging = false;
  }
  getCorrectedRowValue(value: any): any {
    for (var i = 0; i < this.columns.length; i++) {
      if (value === this.columns[i].value) return value;
    }
    for (var i = 0; i < this.columns.length; i++) {
      if (this.isTwoValueEquals(value, this.columns[i].value))
        return this.columns[i].value;
    }
    return value;
  }
  hasErrorInRow(row: MatrixRowModel): boolean {
    return !!this.errorsInRow && !!this.errorsInRow[row.name];
  }
  protected getSearchableItemValueKeys(keys: Array<string>) {
    keys.push("columns");
    keys.push("rows");
  }

  private get SurveyModel() {
    return this.survey as SurveyModel;
  }
  public getColumnHeaderWrapperComponentName(cell: ItemValue) {
    return this.SurveyModel.getElementWrapperComponentName(
      { column: cell },
      "column-header"
    );
  }
  public getColumnHeaderWrapperComponentData(cell: ItemValue) {
    return this.SurveyModel.getElementWrapperComponentData(
      { column: cell },
      "column-header"
    );
  }
  public getRowHeaderWrapperComponentName(cell: ItemValue) {
    return this.SurveyModel.getElementWrapperComponentName(
      { row: cell },
      "row-header"
    );
  }
  public getRowHeaderWrapperComponentData(cell: ItemValue) {
    return this.SurveyModel.getElementWrapperComponentData(
      { row: cell },
      "row-header"
    );
  }
}

Serializer.addClass(
  "matrix",
  [
    "rowTitleWidth",
    {
      name: "columns:itemvalue[]", uniqueProperty: "value",
      baseValue: function() {
        return surveyLocalization.getString("matrix_column");
      },
    },
    {
      name: "rows:itemvalue[]", uniqueProperty: "value",
      baseValue: function() {
        return surveyLocalization.getString("matrix_row");
      },
    },
    { name: "cells:cells", serializationProperty: "cells" },
    {
      name: "rowsOrder",
      default: "initial",
      choices: ["initial", "random"],
    },
    "isAllRowRequired:boolean",
    { name: "eachRowUnique:boolean", category: "validation" },
    "hideIfRowsEmpty:boolean",
    { name: "cellComponent", visible: false, default: "survey-matrix-cell" }
  ],
  function() {
    return new QuestionMatrixModel("");
  },
  "matrixbase"
);

QuestionFactory.Instance.registerQuestion("matrix", (name) => {
  var q = new QuestionMatrixModel(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
