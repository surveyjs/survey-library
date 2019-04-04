import * as ko from "knockout";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { QuestionMatrixBaseImplementor } from "./koquestion_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { Question } from "../question";
import { QuestionMatrixDropdownModelBase } from "../question_matrixdropdownbase";
import { MatrixDynamicRowModel } from "../question_matrixdynamic";

export class QuestionMatrixDynamicImplementor extends QuestionMatrixBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected hasRowText(): boolean {
    return false;
  }
  protected isAddRowTop(): boolean {
    return (<QuestionMatrixDynamic>this.question).isAddRowOnTop;
  }
  protected isAddRowBottom(): boolean {
    return (<QuestionMatrixDynamic>this.question).isAddRowOnBottom;
  }
  protected canRemoveRow(): boolean {
    return (
      !this.question.isReadOnly &&
      (<QuestionMatrixDynamic>this.question).canRemoveRow
    );
  }
  protected onUpdateCells() {
    //Genereate rows again.
    var rows = (<QuestionMatrixDynamic>this.question)["generatedVisibleRows"];
    var columns = (<QuestionMatrixDynamic>this.question).columns;
    if (rows && rows.length > 0 && columns && columns.length > 0)
      this.onColumnChanged();
  }
  protected addRow() {
    (<QuestionMatrixDynamic>this.question).addRow();
  }
  protected removeRow(row: MatrixDynamicRowModel) {
    var rows = (<QuestionMatrixDynamic>this.question).visibleRows;
    var index = rows.indexOf(row);
    if (index > -1) {
      (<QuestionMatrixDynamic>this.question).removeRowUI(index);
    }
  }
}

export class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
  koCellAfterRender: any;
  constructor(public name: string) {
    super(name);
    new QuestionMatrixDynamicImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("matrixdynamic", function() {
  return new QuestionMatrixDynamic("");
});

QuestionFactory.Instance.registerQuestion("matrixdynamic", name => {
  var q = new QuestionMatrixDynamic(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rowCount = 2;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
