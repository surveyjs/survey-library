import * as ko from "knockout";
import { MatrixDropdownColumn, QuestionMatrixDropdownRenderedErrorRow, QuestionMatrixDropdownRenderedRow, SurveyElement } from "survey-core";
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
export class QuestionMatrixBaseImplementor extends QuestionImplementor {
  private _tableImplementor: ImplementorBase;
  koRecalc: any;
  constructor(question: Question) {
    super(question);
    this.koRecalc = ko.observable(0);
    this.matrix.onRenderedTableCreatedCallback = (
      table: QuestionMatrixDropdownRenderedTable
    ) => {
      if (!!this._tableImplementor) {
        this._tableImplementor.dispose();
      }
      this._tableImplementor = new ImplementorBase(table);
    };
    this.matrix.onRenderedTableResetCallback = () => {
      if (this.question.isDisposed) return;
      this.koRecalc(this.koRecalc() + 1);
    };
    this.matrix.onAddColumn = (column: MatrixDropdownColumn) => {
      new ImplementorBase(column);
    };
    this.setObservaleObj(
      "koTable",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.matrix.renderedTable;
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
    this.setCallbackFunc("koRowAfterRender", (htmlElements: any, element: QuestionMatrixDropdownRenderedRow) => {
      for (var i = 0; i < htmlElements.length; i++) {
        var tEl = htmlElements[i];
        var nName = tEl.nodeName;
        if(nName !== "#text" && nName !== "#comment") {
          element.setRootElement(tEl);
          ko.utils.domNodeDisposal.addDisposeCallback(tEl, () => {
            element.setRootElement(undefined);
          });
        }
      }
    });
  }
  public get matrix(): QuestionMatrixDropdownModel { return <QuestionMatrixDropdownModel>this.question; }
  private cellAfterRender(elements: any, con: any) {
    if (!this.question.survey) return;
    setTimeout(() => {
      !!ko.tasks && ko.tasks.runEarly();
      const el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      const cell = <QuestionMatrixDropdownRenderedCell>con;
      if(!cell || !this.question || !this.question.survey || this.question.isDisposed) return;
      const options = {
        cell: cell.cell,
        cellQuestion: cell.question,
        htmlElement: el,
        row: cell.row,
        column: !!cell.cell ? cell.cell.column : null,
      };
      this.question.survey.matrixAfterCellRender(this.question, options);
      if(cell.question) {
        cell.question.afterRenderCore(el);
      }
    }, 0);
  }
  private cellQuestionAfterRender(elements: any, con: any) {
    if (!this.question || !this.question.survey) return;
    setTimeout(() => {
      !!ko.tasks && ko.tasks.runEarly();
      const el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      const cell = <QuestionMatrixDropdownRenderedCell>con;
      if(!cell) return;
      const question = cell.question;
      if(!question || !question.survey || question.isDisposed) return;
      if (question.customWidget) {
        question.customWidget.afterRender(cell.question, el);
        ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
          question.customWidget.willUnmount(cell.question, el);
        });
      }
      ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
        question.beforeDestroyQuestionElement(el);
      });
      question.afterRenderQuestionElement(el);
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
  public dispose(): void {
    if (!!this._tableImplementor) {
      this._tableImplementor.dispose();
    }
    this.matrix.onRenderedTableCreatedCallback = undefined;
    this.matrix.onRenderedTableResetCallback = undefined;
    this.matrix.onAddColumn = undefined;
    super.dispose();
  }
}

export class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected createRenderedTable(): QuestionMatrixDropdownRenderedTable {
    return new KoQuestionMatrixDropdownRenderedTable(this);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionMatrixBaseImplementor(this);
  }
  public dispose(): void {
    super.dispose();
    this._implementor.dispose();
    this._implementor = undefined;
  }
}

export class KoQuestionMatrixDropdownRenderedTable extends QuestionMatrixDropdownRenderedTable {
  protected createRenderedRow(cssClasses: any, isDetailRow: boolean = false): QuestionMatrixDropdownRenderedRow {
    const renderedRow = new QuestionMatrixDropdownRenderedRow(cssClasses, isDetailRow);
    new ImplementorBase(renderedRow);
    return renderedRow;
  }
  protected createErrorRenderedRow(cssClasses: any): QuestionMatrixDropdownRenderedErrorRow {
    const res = super.createErrorRenderedRow(cssClasses);
    new ImplementorBase(res);
    return res;
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
