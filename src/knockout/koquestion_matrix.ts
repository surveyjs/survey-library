import * as ko from "knockout";
import {
  QuestionMatrixModel,
  MatrixRowModel,
  IMatrixData
} from "../question_matrix";
import { QuestionImplementor } from "./koquestion";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { ItemValue } from "../itemvalue";
import { Helpers } from "../helpers";

export class MatrixRow extends MatrixRowModel {
  private isValueUpdating = false;
  koValue: any;
  koCellClick: any;
  constructor(
    item: ItemValue,
    public fullName: string,
    data: IMatrixData,
    value: any
  ) {
    super(item, fullName, data, value);
    this.koValue = ko.observable(this.value);
    var self = this;
    this.koValue.subscribe(function(newValue:any) {
      if (self.isValueUpdating) true;
      self.value = newValue;
    });
    this.koCellClick = function(column:any) {
      self.koValue(column.value);
    };
  }
  protected onValueChanged() {
    this.isValueUpdating = true;
    if (!Helpers.isTwoValueEquals(this.koValue(), this.value)) {
      this.koValue(this.value);
    }
    this.isValueUpdating = false;
  }
}
export class QuestionMatrix extends QuestionMatrixModel {
  koVisibleRows: any;
  koVisibleColumns: any;
  constructor(public name: string) {
    super(name);
    new QuestionImplementor(this);
    this.koVisibleRows = ko.observable(this.visibleRows);
    this.koVisibleColumns = ko.observable(this.visibleColumns);
  }
  protected onRowsChanged() {
    super.onRowsChanged();
    this.koVisibleRows(this.visibleRows);
    this.koVisibleColumns(this.visibleColumns);
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.onRowsChanged();
  }
  protected createMatrixRow(
    item: ItemValue,
    fullName: string,
    value: any
  ): MatrixRowModel {
    return new MatrixRow(item, fullName, this, value);
  }
  public getItemCss(row:any, column:any) {
    var isChecked = row.koValue() == column.value;
    var cellSelectedClass = this.hasCellText
      ? this.cssClasses.cellTextSelected
      : "checked";
    var cellClass = this.hasCellText
      ? (<any>this)["koCss"]().cellText
      : (<any>this)["koCss"]().label;
    let itemClass = cellClass + (isChecked ? " " + cellSelectedClass : "");
    return itemClass;
  }
}

JsonObject.metaData.overrideClassCreatore("matrix", function() {
  return new QuestionMatrix("");
});
QuestionFactory.Instance.registerQuestion("matrix", name => {
  var q = new QuestionMatrix(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
