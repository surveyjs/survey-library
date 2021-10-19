import * as ko from "knockout";
import { SurveyElement } from "survey-core";
import { QuestionMatrixDropdownModel } from "survey-core";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownRenderedTable,
  QuestionMatrixDropdownRenderedCell,
} from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { Question } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { ImplementorBase } from "./kobase";
import { PanelModel } from "survey-core";
import { Panel } from "./kopage";

export class QuestionMatrixBaseImplementor extends QuestionImplementor {
  private _tableImplementor: ImplementorBase;
  koRecalc: any;
  constructor(question: Question) {
    super(question);
    this.koRecalc = ko.observable(0);
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableCreatedCallback = (
      table: QuestionMatrixDropdownRenderedTable
    ) => {
      if (!!this._tableImplementor) {
        this._tableImplementor.dispose();
      }
      this._tableImplementor = new ImplementorBase(table);
    };
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableResetCallback = () => {
      if (this.question.isDisposed) return;
      this.koRecalc(this.koRecalc() + 1);
    };
    this.setObservaleObj(
      "koTable",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionMatrixDropdownModel>this.question).renderedTable;
      })
    );
    this.setCallbackFunc("koCellAfterRender", (el: any, con: any) => {
      return this.cellAfterRender(el, con);
    });
    this.setCallbackFunc("koCellQuestionAfterRender", (el: any, con: any) => {
      return this.cellQuestionAfterRender(el, con);
    });
    this.setCallbackFunc("koAddRowClick", () => {
      this.addRow();
    });
    this.setCallbackFunc("koRemoveRowClick", (data: any) => {
      this.removeRow(data.row);
    });
    this.setCallbackFunc("koPanelAfterRender", (el: any, con: any) => {
      this.panelAfterRender(el, con);
    });
  }
  protected getQuestionTemplate(): string {
    return "matrixdynamic";
  }
  private cellAfterRender(elements: any, con: any) {
    if (!this.question.survey) return;
    setTimeout(() => {
      !!ko.tasks && ko.tasks.runEarly();
      const el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      const cell = <QuestionMatrixDropdownRenderedCell>con;
      const options = {
        cell: cell.cell,
        cellQuestion: cell.question,
        htmlElement: el,
        row: cell.row,
        column: !!cell.cell ? cell.cell.column : null,
      };
      this.question.survey.matrixAfterCellRender(this.question, options);
    }, 0);
  }
  private cellQuestionAfterRender(elements: any, con: any) {
    if (!this.question.survey) return;
    setTimeout(() => {
      !!ko.tasks && ko.tasks.runEarly();
      const el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      const cell = <QuestionMatrixDropdownRenderedCell>con;
      if (cell.question.customWidget) {
        cell.question.customWidget.afterRender(cell.question, el);
        ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
          cell.question.customWidget.willUnmount(cell.question, el);
        });
      }
      cell.question.afterRenderQuestionElement(el);
    }, 0);
  }
  protected isAddRowTop(): boolean {
    return false;
  }
  protected isAddRowBottom(): boolean {
    return false;
  }
  protected addRow() {}
  protected removeRow(row: MatrixDropdownRowModelBase) {}
  private panelAfterRender(elements: any, con: any) {
    if (!this.question || !this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    this.question.survey.afterRenderPanel(con, el);
  }
  public dispose() {
    if (!!this._tableImplementor) {
      this._tableImplementor.dispose();
    }
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableCreatedCallback = undefined;
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableResetCallback = undefined;
    super.dispose();
  }
}

export class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionMatrixBaseImplementor(this);
  }
  public dispose() {
    super.dispose();
    this._implementor.dispose();
    this._implementor = undefined;
  }
}

Serializer.overrideClassCreator("matrixdropdown", function() {
  return new QuestionMatrixDropdown("");
});

QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => {
  var q = new QuestionMatrixDropdown(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rows = QuestionFactory.DefaultRows;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
