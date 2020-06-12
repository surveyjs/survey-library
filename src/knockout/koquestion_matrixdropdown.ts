import * as ko from "knockout";
import { SurveyElement } from "../base";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownCell,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownRenderedTable,
  QuestionMatrixDropdownRenderedCell,
} from "../question_matrixdropdownbase";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { Question } from "../question";
import { QuestionImplementor } from "./koquestion";
import { ImplementorBase } from "./kobase";

export class QuestionMatrixBaseImplementor extends QuestionImplementor {
  koCellAfterRender: any;
  koCellQuestionAfterRender: any;
  koRecalc: any;
  koAddRowClick: any;
  koRemoveRowClick: any;
  koIsAddRowOnTop: any;
  koIsAddRowOnBottom: any;
  koTable: any;
  constructor(question: Question) {
    super(question);
    var self = this;
    this.koCellAfterRender = function (el: any, con: any) {
      return self.cellAfterRender(el, con);
    };
    this.koCellQuestionAfterRender = function (el: any, con: any) {
      return self.cellQuestionAfterRender(el, con);
    };
    this.koRecalc = ko.observable(0);
    this.koTable = ko.pureComputed(function () {
      self.koRecalc();
      return (<QuestionMatrixDropdownModel>self.question).renderedTable;
    });
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableCreatedCallback = function (
      table: QuestionMatrixDropdownRenderedTable
    ) {
      new ImplementorBase(table);
    };
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableResetCallback = function () {
      self.koRecalc(self.koRecalc() + 1);
    };
    this.koAddRowClick = function () {
      self.addRow();
    };
    this.koRemoveRowClick = function (data: any) {
      self.removeRow(data.row);
    };
    this.koIsAddRowOnTop = ko.pureComputed(function () {
      self.koRecalc();
      return self.isAddRowTop();
    });
    this.koIsAddRowOnBottom = ko.pureComputed(function () {
      self.koRecalc();
      return self.isAddRowBottom();
    });
    (<any>this.question)["koTable"] = this.koTable;
    (<any>this.question)["koCellAfterRender"] = this.koCellAfterRender;
    (<any>this.question)[
      "koCellQuestionAfterRender"
    ] = this.koCellQuestionAfterRender;
    (<any>this.question)["koAddRowClick"] = this.koAddRowClick;
    (<any>this.question)["koRemoveRowClick"] = this.koRemoveRowClick;
    (<any>this.question)["koIsAddRowOnTop"] = this.koIsAddRowOnTop;
    (<any>this.question)["koIsAddRowOnBottom"] = this.koIsAddRowOnBottom;
  }
  protected getQuestionTemplate(): string {
    return "matrixdynamic";
  }
  private cellAfterRender(elements: any, con: any) {
    if (!this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!el) return;
    var cell = <QuestionMatrixDropdownRenderedCell>con;
    if (cell.question.customWidget) {
      cell.question.customWidget.afterRender(cell.question, el);
      ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
        cell.question.customWidget.willUnmount(cell.question, el);
      });
    }
    var options = {
      cell: cell.cell,
      cellQuestion: cell.question,
      htmlElement: el,
      row: cell.row,
      column: !!cell.cell ? cell.cell.column : null,
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
  }
  private cellQuestionAfterRender(elements: any, con: any) {
    if (!this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!el) return;
    var cell = <QuestionMatrixDropdownRenderedCell>con;
    cell.question.afterRenderQuestionElement(el);
  }
  protected isAddRowTop(): boolean {
    return false;
  }
  protected isAddRowBottom(): boolean {
    return false;
  }
  protected canRemoveRows(): boolean {
    return false;
  }
  protected addRow() {}
  protected removeRow(row: MatrixDropdownRowModelBase) {}
  public dispose() {
    super.dispose();
    this.koTemplateName.dispose();
    this.koTable.dispose();
    this.koIsAddRowOnTop.dispose();
    this.koIsAddRowOnBottom.dispose();
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableCreatedCallback = undefined;
    (<QuestionMatrixDropdownModel>(
      this.question
    )).onRenderedTableResetCallback = undefined;
  }
}

export class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
  private _implementor: QuestionImplementor;
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionMatrixBaseImplementor(this);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
  }
}

Serializer.overrideClassCreator("matrixdropdown", function () {
  return new QuestionMatrixDropdown("");
});

QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => {
  var q = new QuestionMatrixDropdown(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rows = QuestionFactory.DefaultRows;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
