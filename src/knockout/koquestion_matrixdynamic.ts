import * as ko from "knockout";
import { QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedTable, Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { KoQuestionMatrixDropdownRenderedTable, QuestionMatrixBaseImplementor } from "./koquestion_matrixdropdown";
import { QuestionMatrixDynamicModel } from "survey-core";
import { Question } from "survey-core";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "survey-core";
import { MatrixDynamicRowModel } from "survey-core";
import { PanelModel } from "survey-core";
import { Panel } from "./kopage";
import { ImplementorBase } from "./kobase";

export class QuestionMatrixDynamicImplementor extends QuestionMatrixBaseImplementor {
  constructor(question: Question) {
    super(question);
    (<any>this.question)["getKoPopupIsVisible"] = this.getKoPopupIsVisible;
  }
  protected addRow() {
    (<QuestionMatrixDynamic>this.question).addRowUI();
  }
  protected removeRow(row: MatrixDynamicRowModel) {
    (<QuestionMatrixDynamic>this.question).removeRowUI(row);
  }
  public getKoPopupIsVisible(row: MatrixDropdownRowModelBase) {
    return <any>ko.observable(row.isDetailPanelShowing);
  }
  public dispose(): void {
    super.dispose();
    (<any>this.question)["getKoPopupIsVisible"] = undefined;
  }
}

export class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
  private _implementor: QuestionMatrixDynamicImplementor;
  constructor(name: string) {
    super(name);
  }
  protected createRenderedTable(): QuestionMatrixDropdownRenderedTable {
    return new KoQuestionMatrixDropdownRenderedTable(this);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionMatrixDynamicImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("matrixdynamic", function() {
  return new QuestionMatrixDynamic("");
});

// QuestionMatrixDropdownRenderedRow.prototype["onCreating"] = function() {
//   new ImplementorBase(this);
// };

QuestionFactory.Instance.registerQuestion("matrixdynamic", (name) => {
  var q = new QuestionMatrixDynamic(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rowCount = 2;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});