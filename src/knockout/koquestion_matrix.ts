import * as ko from "knockout";
import {
  QuestionMatrixModel,
  MatrixRowModel,
  IMatrixData,
} from "../question_matrix";
import { QuestionImplementor } from "./koquestion";
import { ImplementorBase } from "./kobase";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";

export class QuestionMatrix extends QuestionMatrixModel {
  koVisibleRows: any = <any>ko.observableArray<MatrixRowModel>();
  koVisibleColumns: any = <any>ko.observableArray<any>();
  constructor(name: string) {
    super(name);
    this.koVisibleRows(this.visibleRows);
    this.koVisibleColumns(this.visibleColumns);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
  protected onColumnsChanged() {
    super.onColumnsChanged();
    this.koVisibleColumns(this.visibleColumns);
  }
  protected onRowsChanged() {
    super.onRowsChanged();
    this.koVisibleRows(this.visibleRows);
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.onRowsChanged();
  }
  protected onMatrixRowCreated(row: MatrixRowModel) {
    new ImplementorBase(row);
  }
  protected getVisibleRows(): Array<MatrixRowModel> {
    var rows = super.getVisibleRows();
    this.koVisibleRows(rows);
    return rows;
  }
}

Serializer.overrideClassCreator("matrix", function () {
  return new QuestionMatrix("");
});
QuestionFactory.Instance.registerQuestion("matrix", (name) => {
  var q = new QuestionMatrix(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
