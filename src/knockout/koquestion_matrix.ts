import * as ko from "knockout";
import { QuestionMatrixModel, MatrixRowModel, IMatrixData } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { ImplementorBase } from "./kobase";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";

export class QuestionMatrix extends QuestionMatrixModel {
  private _implementor: QuestionImplementor;
  koVisibleRows: any = <any>ko.observableArray<MatrixRowModel>();
  koVisibleColumns: any = <any>ko.observableArray<any>();
  constructor(name: string) {
    super(name);
    this.koVisibleRows(this.visibleRows);
    this.koVisibleColumns(this.visibleColumns);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
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
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    this.koVisibleRows = undefined;
    this.koVisibleColumns = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("matrix", function() {
  return new QuestionMatrix("");
});
QuestionFactory.Instance.registerQuestion("matrix", name => {
  var q = new QuestionMatrix(name);
  q.rows = QuestionFactory.DefaultRows;
  q.columns = QuestionFactory.DefaultColums;
  return q;
});
