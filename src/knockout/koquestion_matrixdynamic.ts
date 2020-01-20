import * as ko from "knockout";
import { Serializer } from "../jsonobject";
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
  protected isAddRowTop(): boolean {
    return (<QuestionMatrixDynamic>this.question).isAddRowOnTop;
  }
  protected isAddRowBottom(): boolean {
    return (<QuestionMatrixDynamic>this.question).isAddRowOnBottom;
  }
  protected canRemoveRows(): boolean {
    return (
      !this.question.isReadOnly &&
      (<QuestionMatrixDynamic>this.question).canRemoveRows
    );
  }
  protected addRow() {
    (<QuestionMatrixDynamic>this.question).addRow();
  }
  protected removeRow(row: MatrixDynamicRowModel) {
    (<QuestionMatrixDynamic>this.question).removeRowUI(row);
  }
}

export class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionMatrixDynamicImplementor(this);
  }
}

Serializer.overrideClassCreator("matrixdynamic", function() {
  return new QuestionMatrixDynamic("");
});

QuestionFactory.Instance.registerQuestion("matrixdynamic", name => {
  var q = new QuestionMatrixDynamic(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rowCount = 2;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
