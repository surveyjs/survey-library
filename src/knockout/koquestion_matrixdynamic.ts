import * as ko from "knockout";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { QuestionMatrixBaseImplementor } from "./koquestion_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { Question } from "../question";
import { MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "../question_matrixdropdownbase";
import { MatrixDynamicRowModel } from "../question_matrixdynamic";
import { PanelModel } from "../panel";
import { Panel } from "./kopage";

export class QuestionMatrixDynamicImplementor extends QuestionMatrixBaseImplementor {
  constructor(question: Question) {
    super(question);
    (<any>this.question)["getKoPopupIsVisible"] = this.getKoPopupIsVisible;
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
  public getKoPopupIsVisible(row: MatrixDropdownRowModelBase) {
    return ko.observable(row.isDetailPanelShowing);
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
  protected createNewDetailPanel(): PanelModel {
    return new Panel();
  }
}

Serializer.overrideClassCreator("matrixdynamic", function () {
  return new QuestionMatrixDynamic("");
});

QuestionFactory.Instance.registerQuestion("matrixdynamic", (name) => {
  var q = new QuestionMatrixDynamic(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rowCount = 2;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
