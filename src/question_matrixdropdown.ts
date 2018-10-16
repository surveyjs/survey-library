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
import { HashTable } from "./helpers";
import { ConditionRunner } from "./conditions";

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
  constructor(public name: string) {
    super(name);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("rows", function() {
      self.generatedVisibleRows = null;
      self.filterItems();
    });
  }
  public getType(): string {
    return "matrixdropdown";
  }
  protected getDisplayValueCore(keysAsText: boolean): any {
    var values = this.value;
    if (!values) return values;
    var rows = this.visibleRows;
    var res = {};
    for (var i = 0; i < rows.length; i++) {
      var rowValue = this.rows[i].value;
      var val = values[rowValue];
      if (!val) continue;
      if (keysAsText) {
        var displayRowValue = ItemValue.getTextOrHtmlByValue(
          this.rows,
          rowValue
        );
        if (!!displayRowValue) {
          rowValue = displayRowValue;
        }
      }
      (<any>res)[rowValue] = this.getRowDisplayValue(rows[i], val);
    }
    return values;
  }
  public addConditionNames(names: Array<string>) {
    for (var i = 0; i < this.rows.length; i++) {
      if (!this.rows[i].value) continue;
      var prefix = this.name + "." + this.rows[i].value + ".";
      for (var j = 0; j < this.columns.length; j++) {
        names.push(prefix + this.columns[j].name);
      }
    }
  }
  public clearIncorrectValues() {
    var val = this.value;
    if (!val) return;
    var newVal = null;
    var isChanged = false;
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    for (var key in val) {
      if (ItemValue.getItemByValue(rows, key)) {
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
  protected generateRows(): Array<MatrixDropdownRowModel> {
    var result = new Array<MatrixDropdownRowModel>();
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    if (!rows || rows.length === 0) return result;
    var val = this.value;
    if (!val) val = {};
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].value) continue;
      result.push(this.createMatrixRow(rows[i], val[rows[i].value]));
    }
    return result;
  }
  protected createMatrixRow(
    item: ItemValue,
    value: any
  ): MatrixDropdownRowModel {
    return new MatrixDropdownRowModel(item.value, item, this, value);
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
    },
    "rowsVisibleIf:condition"
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
