import { Base } from "./base";
import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { JsonObject } from "./jsonobject";
import { SurveyError } from "./base";
import { surveyLocalization } from "./surveyStrings";
import { CustomError } from "./error";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";

export interface IMatrixData {
  onMatrixRowChanged(row: MatrixRowModel);
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

/**
 * A Model for a simple matrix question.
 */
export class QuestionMatrixModel extends Question implements IMatrixData {
  private columnsValue: Array<ItemValue>;
  private rowsValue: Array<ItemValue>;
  private isRowChanging = false;
  private generatedVisibleRows: Array<MatrixRowModel>;
  constructor(public name: string) {
    super(name);
    this.columnsValue = this.createItemValues("columns");
    this.rowsValue = this.createItemValues("rows");
  }
  public getType(): string {
    return "matrix";
  }
  public get isAllowTitleLeft(): boolean {
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
    return this.rowsValue.length > 0;
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
  /**
   * The list of rows. A row has a value and an optional text
   */
  get rows(): Array<any> {
    return this.rowsValue;
  }
  set rows(newValue: Array<any>) {
    this.setPropertyValue("rows", newValue);
  }
  /**
   * Returns the list of rows as model objects.
   */
  public get visibleRows(): Array<MatrixRowModel> {
    var result = new Array<MatrixRowModel>();
    var val = this.value;
    if (!val) val = {};
    for (var i = 0; i < this.rows.length; i++) {
      if (!this.rows[i].value) continue;
      result.push(
        this.createMatrixRow(
          this.rows[i],
          this.name + "_" + this.rows[i].value.toString(),
          val[this.rows[i].value]
        )
      );
    }
    if (result.length == 0) {
      result.push(this.createMatrixRow(new ItemValue(null), this.name, val));
    }
    this.generatedVisibleRows = result;
    return result;
  }
  supportGoNextPageAutomatic() {
    return this.hasValuesInAllRows();
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    if (this.hasErrorInRows()) {
      errors.push(
        new CustomError(surveyLocalization.getString("requiredInAllRowsError"))
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
  public get displayValue(): any {
    var values = this.value;
    if (!values) return values;
    for (var key in values) {
      values[key] = ItemValue.getTextOrHtmlByValue(this.columns, values[key]);
    }
    return values;
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
    "isAllRowRequired:boolean"
  ],
  function() {
    return new QuestionMatrixModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("matrix", name => {
  var q = new QuestionMatrixModel(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
