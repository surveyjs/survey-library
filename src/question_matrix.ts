import { ItemValue } from "./itemvalue";
import { QuestionMatrixBaseModel } from "./martixBase";
import { JsonObject } from "./jsonobject";
import { SurveyError } from "./base";
import { surveyLocalization } from "./surveyStrings";
import { CustomError } from "./error";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString, ILocalizableOwner } from "./localizablestring";
import { QuestionDropdownModel } from "./question_dropdown";

export interface IMatrixData {
  onMatrixRowChanged(row: MatrixRowModel): void;
}

export class MatrixRowModel {
  private data: IMatrixData;
  private item: ItemValue;
  protected rowValue: any;

  constructor(
    item: ItemValue,
    public fullName: string,
    data: IMatrixData,
    value: any
  ) {
    this.item = item;
    this.data = data;
    this.rowValue = value;
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
    return this.rowValue;
  }
  public set value(newValue: any) {
    this.rowValue = newValue;
    if (this.data) this.data.onMatrixRowChanged(this);
    this.onValueChanged();
  }
  protected onValueChanged() {}
}

export interface IMatrixCellsOwner extends ILocalizableOwner {
  getRows(): Array<any>;
  getColumns(): Array<any>;
}

export class MartrixCells {
  public static DefaultRowName = "default";
  private values: {[index: string]: any} = {};
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
    this.setCellText(MartrixCells.DefaultRowName, column, val);
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
    return this.getCellLocText(MartrixCells.DefaultRowName, column);
  }
  public getCellDisplayLocText(row: any, column: any): LocalizableString {
    var cellText = this.getCellLocText(row, column);
    if (cellText && !cellText.isEmpty) return cellText;
    cellText = this.getCellLocText(MartrixCells.DefaultRowName, column);
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
    return loc ? loc.text : null;
  }
  public getDefaultCellText(column: any): string {
    var loc = this.getCellLocText(MartrixCells.DefaultRowName, column);
    return loc ? loc.text : null;
  }
  public getCellDisplayText(row: any, column: any): string {
    var loc = this.getCellDisplayLocText(row, column);
    return loc ? loc.text : null;
  }
  public get rows(): Array<any> {
    return this.cellsOwner ? this.cellsOwner.getRows() : [];
  }
  public get columns(): Array<any> {
    return this.cellsOwner ? this.cellsOwner.getColumns() : [];
  }
  private getCellRowColumnValue(val: any, values: Array<any>): any {
    if (typeof val == "number") {
      if (val < 0 || val >= values.length) return null;
      val = values[val].value;
    }
    if (val.value) return val.value;
    return val;
  }
  public getJson(): any {
    if (this.isEmpty) return null;
    var res: {[index: string]: any} = {};
    for (var row in this.values) {
      var resRow: {[index: string]: any} = {};
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
  private cellsValue: MartrixCells;

  protected createColumnValues() {
    return this.createItemValues("columns");
  }

  constructor(public name: string) {
    super(name);
    this.cellsValue = new MartrixCells(this);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("rows", function() {
      if (!self.filterItems()) {
        self.onRowsChanged();
      }
    });
  }
  public getType(): string {
    return "matrix";
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
  getRows(): Array<any> {
    return this.rows;
  }
  getColumns(): Array<any> {
    return this.visibleColumns;
  }
  protected getVisibleRows(): Array<MatrixRowModel> {
    var result = new Array<MatrixRowModel>();
    var val = this.value;
    if (!val) val = {};
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].value) continue;
      result.push(
        this.createMatrixRow(
          rows[i],
          this.id + "_" + this.rows[i].value.toString(),
          val[this.rows[i].value]
        )
      );
    }
    if (result.length == 0 && !this.filteredRows) {
      result.push(this.createMatrixRow(new ItemValue(null), this.name, val));
    }
    this.generatedVisibleRows = result;
    return result;
  }
  /**
   * Returns the list of visible rows as model objects.
   * @see rowsVisibleIf
   */
  public get visibleRows(): Array<MatrixRowModel> {
    return this.getVisibleRows();
  }
  public get cells(): MartrixCells {
    return this.cellsValue;
  }
  public set cells(value: MartrixCells) {
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
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    if (this.hasErrorInRows()) {
      errors.push(
        new CustomError(
          surveyLocalization.getString("requiredInAllRowsError"),
          this
        )
      );
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
      var val = rows[i].value;
      if (!val) return false;
    }
    return true;
  }
  protected createMatrixRow(
    item: ItemValue,
    fullName: string,
    value: any
  ): MatrixRowModel {
    return new MatrixRowModel(item, fullName, this, value);
  }
  protected onValueChanged() {
    if (
      this.isRowChanging ||
      !this.generatedVisibleRows ||
      this.generatedVisibleRows.length == 0
    )
      return;
    this.isRowChanging = true;
    var val = this.value;
    if (!val) val = {};
    if (this.rows.length == 0) {
      this.generatedVisibleRows[0].value = val;
    } else {
      for (var i = 0; i < this.generatedVisibleRows.length; i++) {
        var row = this.generatedVisibleRows[i];
        var rowVal = val[row.name] ? val[row.name] : null;
        this.generatedVisibleRows[i].value = rowVal;
      }
    }
    this.isRowChanging = false;
  }
  public getDisplayValueCore(keysAsText: boolean): any {
    var values = this.value;
    if (!values) return values;
    var res: {[index: string]: any} = {};
    for (var key in values) {
      var newKey = keysAsText
        ? ItemValue.getTextOrHtmlByValue(this.rows, key)
        : key;
      if (!newKey) newKey = key;
      var newValue = ItemValue.getTextOrHtmlByValue(this.columns, values[key]);
      if (!newValue) newValue = values[key];
      res[newKey] = newValue;
    }
    return res;
  }
  public addConditionNames(names: Array<string>) {
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i].value) {
        names.push(this.name + "." + this.rows[i].value);
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
}

JsonObject.metaData.addClass(
  "matrix",
  [
    {
      name: "columns:itemvalues",
      onGetValue: function(obj: any) {
        return ItemValue.getData(obj.columns);
      },
      onSetValue: function(obj: any, value: any) {
        obj.columns = value;
      }
    },
    {
      name: "rows:itemvalues",
      onGetValue: function(obj: any) {
        return ItemValue.getData(obj.rows);
      },
      onSetValue: function(obj: any, value: any) {
        obj.rows = value;
      }
    },
    { name: "cells:cells", serializationProperty: "cells" },
    "isAllRowRequired:boolean"
  ],
  function() {
    return new QuestionMatrixModel("");
  },
  "matrixbase"
);

QuestionFactory.Instance.registerQuestion("matrix", name => {
  var q = new QuestionMatrixModel(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
