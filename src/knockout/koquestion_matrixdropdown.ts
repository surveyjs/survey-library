import * as ko from "knockout";
import { SurveyElement } from "../base";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownCell,
  MatrixDropdownRowModelBase
} from "../question_matrixdropdownbase";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { Question } from "../question";
import { QuestionImplementor } from "./koquestion";

export class QuestionMatrixBaseImplementor extends QuestionImplementor {
  koCellAfterRender: any;
  koRows: any;
  koRecalc: any;
  koAddRowClick: any;
  koRemoveRowClick: any;
  koIsAddRowOnTop: any;
  koIsAddRowOnBottom: any;
  koCanRemoveRow: any;
  koIsHorizontalColumnsLocation: any;
  constructor(question: Question) {
    super(question);
    var self = this;
    this.koCellAfterRender = function(el, con) {
      return self.cellAfterRender(el, con);
    };
    this.koRecalc = ko.observable(0);
    this.koRows = ko.pureComputed(function() {
      this.koRecalc();
      return (<QuestionMatrixDropdownModel>this.question).visibleRows;
    }, this);
    var self = this;
    this.koAddRowClick = function() {
      self.addRow();
    };
    this.koRemoveRowClick = function(data) {
      self.removeRow(data);
    };
    this.koIsAddRowOnTop = ko.pureComputed(function() {
      self.koRecalc();
      return self.isAddRowTop();
    });
    this.koIsAddRowOnBottom = ko.pureComputed(function() {
      self.koRecalc();
      return self.isAddRowBottom();
    });
    this.koCanRemoveRow = ko.pureComputed(function() {
      self.koRecalc();
      return self.canRemoveRow();
    });
    this.koIsHorizontalColumnsLocation = ko.observable(
      (<QuestionMatrixDropdownModel>this.question).isColumnsLocationHorizontal
    );
    this.question["koRows"] = this.koRows;
    this.question["koCellAfterRender"] = this.koCellAfterRender;
    this.question["koAddRowClick"] = this.koAddRowClick;
    this.question["koRemoveRowClick"] = this.koRemoveRowClick;
    this.question["koIsAddRowOnTop"] = this.koIsAddRowOnTop;
    this.question["koIsAddRowOnBottom"] = this.koIsAddRowOnBottom;
    this.question["koCanRemoveRow"] = this.koCanRemoveRow;
    this.question[
      "koIsHorizontalColumnsLocation"
    ] = this.koIsHorizontalColumnsLocation;
    this.question["hasRowText"] = this.hasRowText();
    (<QuestionMatrixDropdownModel>this
      .question).columnsChangedCallback = function() {
      self.onColumnChanged();
    };
    (<QuestionMatrixDropdownModel>this
      .question).updateCellsCallback = function() {
      self.onUpdateCells();
    };
    (<QuestionMatrixDropdownModel>this
      .question).columnsLocationChangedCallback = function() {
      self.onColumnsLocationChanged();
    };
  }
  protected getQuestionTemplate(): string {
    return "matrixdynamic";
  }
  private cellAfterRender(elements, con) {
    if (!this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!el) return;
    var cell = <MatrixDropdownCell>con;
    if (cell.question.customWidget) {
      cell.question.customWidget.afterRender(cell.question, el);
    }
    var options = {
      cell: cell,
      cellQuestion: cell.question,
      htmlElement: el,
      row: cell.row,
      column: cell.column
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
  }
  protected onSurveyLoad() {
    super.onSurveyLoad();
    this.onColumnsLocationChanged();
  }
  protected hasRowText(): boolean {
    return true;
  }
  protected onColumnsLocationChanged() {
    this.koIsHorizontalColumnsLocation(
      (<QuestionMatrixDropdownModelBase>this.question)
        .isColumnsLocationHorizontal
    );
  }
  protected isAddRowTop(): boolean {
    return false;
  }
  protected isAddRowBottom(): boolean {
    return false;
  }
  protected canRemoveRow(): boolean {
    return false;
  }
  protected onColumnChanged() {}
  protected onRowCountChanged() {}
  protected addRow() {}
  protected removeRow(row: MatrixDropdownRowModelBase) {}
  protected onUpdateCells() {}
}

export class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
  constructor(public name: string) {
    super(name);
    new QuestionMatrixBaseImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("matrixdropdown", function() {
  return new QuestionMatrixDropdown("");
});

QuestionFactory.Instance.registerQuestion("matrixdropdown", name => {
  var q = new QuestionMatrixDropdown(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rows = QuestionFactory.DefaultRows;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
