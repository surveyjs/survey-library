import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData
} from "./question_matrixdropdownbase";
import { JsonObject } from "./jsonobject";
import { ItemValue } from "./itemvalue";
import { QuestionFactory } from "./questionfactory";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";

export class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
  private item: ItemValue;
  constructor(
    public name: string,
    item: ItemValue,
    data: IMatrixDropdownData,
    value: any
  ) {
    super(data, value);
    this.item = item;
    this.buildCells();
  }
  public get rowName(): string {
    return this.name;
  }
  public get text(): string {
    return this.item.text;
  }
  public get locText(): LocalizableString {
    return this.item.locText;
  }
}
/**
 * A Model for a matrix dropdown question. You may use a dropdown, checkbox, radiogroup, text and comment questions as a cell editors.
 */
export class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData {
  private rowsValue: Array<ItemValue>;

  constructor(public name: string) {
    super(name);
    this.rowsValue = this.createItemValues("rows");
    var self = this;
    this.registerFunctionOnPropertyValueChanged("rows", function() {
      self.generatedVisibleRows = null;
    });
  }
  public getType(): string {
    return "matrixdropdown";
  }
  public get displayValue(): any {
    var values = this.value;
    if (!values) return values;
    var rows = this.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      var rowValue = this.rows[i].value;
      var val = values[rowValue];
      if (!val) continue;
      values[rowValue] = this.getRowDisplayValue(rows[i], val);
    }
    return values;
  }

  /**
   * The list of rows. A row has a value and an optional text
   */
  public get rows(): Array<any> {
    return this.rowsValue;
  }
  public set rows(val: Array<any>) {
    this.setPropertyValue("rows", val);
  }
  protected generateRows(): Array<MatrixDropdownRowModel> {
    var result = new Array<MatrixDropdownRowModel>();
    if (!this.rows || this.rows.length === 0) return result;
    var val = this.value;
    if (!val) val = {};
    for (var i = 0; i < this.rows.length; i++) {
      if (!this.rows[i].value) continue;
      result.push(this.createMatrixRow(this.rows[i], val[this.rows[i].value]));
    }
    return result;
  }
  protected createMatrixRow(
    item: ItemValue,
    value: any
  ): MatrixDropdownRowModel {
    var row = new MatrixDropdownRowModel(item.value, item, this, value);
    this.onMatrixRowCreated(row);
    return row;
  }
}

JsonObject.metaData.addClass(
  "matrixdropdown",
  [
    {
      name: "rows:itemvalues",
      onGetValue: function(obj: any) {
        return ItemValue.getData(obj.rows);
      },
      onSetValue: function(obj: any, value: any) {
        obj.rows = value;
      }
    }
  ],
  function() {
    return new QuestionMatrixDropdownModel("");
  },
  "matrixdropdownbase"
);

QuestionFactory.Instance.registerQuestion("matrixdropdown", name => {
  var q = new QuestionMatrixDropdownModel(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rows = QuestionFactory.DefaultColums;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
