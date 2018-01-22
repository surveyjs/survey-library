import * as ko from "knockout";
import { SurveyElement } from "../base";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownCell
} from "../question_matrixdropdownbase";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { Question } from "../question";
import { QuestionImplementor } from "./koquestion";

export class QuestionMatrixBaseImplementor extends QuestionImplementor {
  koCellAfterRender: any;
  constructor(question: Question) {
    super(question);
    var self = this;
    this.koCellAfterRender = function(el, con) {
      return self.cellAfterRender(el, con);
    };
    this.question["koCellAfterRender"] = this.koCellAfterRender;
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
