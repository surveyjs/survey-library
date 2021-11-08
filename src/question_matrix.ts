import { Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { QuestionMatrixBaseModel } from "./martixBase";
import { JsonObject, Serializer } from "./jsonobject";
import { Base } from "./base";
import { SurveyError } from "./survey-error";
import { surveyLocalization } from "./surveyStrings";
import { RequiredInAllRowsError } from "./error";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString, ILocalizableOwner } from "./localizablestring";
import { QuestionDropdownModel } from "./question_dropdown";
import { IConditionObject } from "./question";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export interface IMatrixData {
  onMatrixRowChanged(row: MatrixRowModel): void;
  getCorrectedRowValue(value: any): any;
}

export class MatrixRowModel extends Base {
  private data: IMatrixData;
  private item: ItemValue;
  public cellClick: any;

  constructor(
    item: ItemValue,
    public fullName: string,
    data: IMatrixData,
    value: any
  ) {
    super();
    this.item = item;
    this.data = data;
    this.value = value;
    this.cellClick = (column: any) => {
      this.value = column.value;
    };
    this.registerFunctionOnPropertyValueChanged("value", () => {
      if (this.data) this.data.onMatrixRowChanged(this);
    });
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
  public get value() {
    return this.getPropertyValue("value");
  }
  public set value(newValue: any) {
    newValue = this.data.getCorrectedRowValue(newValue);
    this.setPropertyValue("value", newValue);
  }
  public get rowClasses(): string {
    const cssClasses = (<any>this.data).cssClasses;
    const hasError = !!(<any>this.data).getErrorByType("requiredinallrowserror");
    return new CssClassBuilder().append(cssClasses.row)
      .append(cssClasses.rowError, hasError && this.isValueEmpty(this.value))
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
  public setCellText(row: any, column: any, val: string) {
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
  }
  public setDefaultCellText(column: any, val: string) {
    this.setCellText(settings.matrixDefaultRowName, column, val);
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
    return this.getCellLocText(settings.matrixDefaultRowName, column);
  }
  public getCellDisplayLocText(row: any, column: any): LocalizableString {
    var cellText = this.getCellLocText(row, column);
    if (cellText && !cellText.isEmpty) return cellText;
    cellText = this.getCellLocText(settings.matrixDefaultRowName, column);
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
    var loc = this.getCellLocText(settings.matrixDefaultRowName, column);
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
  public setJson(value: any) {
    this.values = {};
    if (!value) return;
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
  protected createString(): LocalizableString {
    return new LocalizableString(this.cellsOwner, true);
  }
}

/**
 * A Model for a simple matrix question.
 */
export class QuestionMatrixModel
  extends QuestionMatrixBaseModel<MatrixRowModel, ItemValue>
  implements IMatrixData, IMatrixCellsOwner {
  private isRowChanging = false;
  private cellsValue: MatrixCells;

  constructor(name: string) {
    super(name);
    this.cellsValue = new MatrixCells(this);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("columns", function() {
      self.onColumnsChanged();
    });
    this.registerFunctionOnPropertyValueChanged("rows", function() {
      if (!self.filterItems()) {
        self.onRowsChanged();
      }
    });
    this.registerFunctionOnPropertyValueChanged("hideIfRowsEmpty", function() {
      self.updateVisibilityBasedOnRows();
    });
  }
  public getType(): string {
    return "matrix";
  }
  public get hasSingleInput(): boolean {
    return false;
  }
  /**
   * Set this property to true, if you want a user to answer all rows.
   */
  public get isAllRowRequired(): boolean {
    return this.getPropertyValue("isAllRowRequired", false);
  }
  public set isAllRowRequired(val: boolean) {
    this.setPropertyValue("isAllRowRequired", val);
  }
  /**
   * Returns true, if there is at least one row.
   */
  public get hasRows(): boolean {
    return this.rows.length > 0;
  }
  /**
   * Use this property to render items in a specific order: "random" or "initial". Default is "initial".
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
   * Set this property to true to hide the question if there is no visible rows in the matrix.
   */
  public get hideIfRowsEmpty(): boolean {
    return this.getPropertyValue("hideIfRowsEmpty", false);
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
  public getItemClass(row: any, column: any) {
    const isChecked = row.value == column.value;
    const isDisabled = this.isReadOnly;
    const allowHover = !isChecked && !isDisabled;

    return new CssClassBuilder()
      .append(this.cssClasses.cell, this.hasCellText)
      .append(this.hasCellText ? this.cssClasses.cellText : this.cssClasses.label)
      .append(this.cssClasses.itemOnError, !this.hasCellText && this.errors.length > 0)
      .append(this.hasCellText ? this.cssClasses.cellTextSelected : this.cssClasses.itemChecked, isChecked)
      .append(this.hasCellText ? this.cssClasses.cellTextDisabled : this.cssClasses.itemDisabled, isDisabled)
      .append(this.cssClasses.itemHover, allowHover && !this.hasCellText)
      .toString();
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
    if (result.length == 0 && !this.filteredRows) {
      result.push(
        this.createMatrixRow(
          new ItemValue(null),
          this.name.replace(/\s/g, "_"),
          val
        )
      );
    }
    this.generatedVisibleRows = result;
    return result;
  }
  protected sortVisibleRows(
    array: Array<MatrixRowModel>
  ): Array<MatrixRowModel> {
    var order = this.rowsOrder.toLowerCase();
    if (order === "random")
      return Helpers.randomizeArray<MatrixRowModel>(array);
    return array;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.rows = this.sortVisibleRows(this.rows);
    this.updateVisibilityBasedOnRows();
  }
  protected processRowsOnSet(newRows: Array<any>) {
    return this.sortVisibleRows(newRows);
  }

  /**
   * Returns the list of visible rows as model objects.
   * @see rowsVisibleIf
   */
  public get visibleRows(): Array<MatrixRowModel> {
    return this.getVisibleRows();
  }
  public get cells(): MatrixCells {
    return this.cellsValue;
  }
  public set cells(value: MatrixCells) {
    this.cells.setJson(value && value.getJson ? value.getJson() : null);
  }
  public get hasCellText(): boolean {
    return !this.cells.isEmpty;
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
  supportGoNextPageAutomatic() {
    return this.hasValuesInAllRows();
  }
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (
      (!isOnValueChanged || this.errors.length > 0) &&
      this.hasErrorInRows()
    ) {
      errors.push(new RequiredInAllRowsError(null, this));
    }
  }
  private hasErrorInRows(): boolean {
    if (!this.isAllRowRequired) return false;
    return !this.hasValuesInAllRows();
  }
  private hasValuesInAllRows(): boolean {
    var rows = this.generatedVisibleRows;
    if (!rows) rows = this.visibleRows;
    if (!rows) return true;
    for (var i = 0; i < rows.length; i++) {
      if (this.isValueEmpty(rows[i].value)) return false;
    }
    return true;
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
      this.generatedVisibleRows[0].value = val;
    } else {
      for (var i = 0; i < this.generatedVisibleRows.length; i++) {
        var row = this.generatedVisibleRows[i];
        var rowVal = val[row.name];
        if (this.isValueEmpty(rowVal)) rowVal = null;
        this.generatedVisibleRows[i].value = rowVal;
      }
    }
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
    options: {
      includeEmpty?: boolean,
      calculations?: Array<{
        propertyName: string,
      }>,
    } = {
      includeEmpty: true,
    }
  ) {
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
    if (!path) return super.getConditionJson();
    var question = new QuestionDropdownModel(path);
    question.choices = this.columns;
    var json = new JsonObject().toJsonObject(question);
    json["type"] = question.getType();
    return json;
  }
  public clearValueIfInvisible() {
    super.clearValueIfInvisible();
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
  protected onRowsChanged() {
    this.updateVisibilityBasedOnRows();
    super.onRowsChanged();
  }
  private updateVisibilityBasedOnRows() {
    if (this.hideIfRowsEmpty) {
      this.visible =
        this.rows.length > 0 &&
        (!this.filteredRows || this.filteredRows.length > 0);
    }
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
    {
      name: "columns:itemvalue[]",
      baseValue: function() {
        return surveyLocalization.getString("matrix_column");
      },
    },
    {
      name: "rows:itemvalue[]",
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
    "hideIfRowsEmpty:boolean",
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
