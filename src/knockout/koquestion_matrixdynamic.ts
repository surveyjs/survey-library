import * as ko from "knockout";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionMatrixBaseImplementor } from "./koquestion_matrixdropdown";
import { QuestionMatrixDynamicModel } from "survey-core";
import { Question } from "survey-core";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "survey-core";
import { MatrixDynamicRowModel } from "survey-core";
import { PanelModel } from "survey-core";
import { Panel } from "./kopage";

export class QuestionMatrixDynamicImplementor extends QuestionMatrixBaseImplementor {
  constructor(question: Question) {
    super(question);
    (<any>this.question)["getKoPopupIsVisible"] = this.getKoPopupIsVisible;
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
    return <any>ko.observable(row.isDetailPanelShowing);
  }
}

export class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
  constructor(name: string) {
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
