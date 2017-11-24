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
  koRows: any;
  koRecalc: any;
  koAddRowClick: any;
  koRemoveRowClick: any;
  koOverflowX: any;
  koCanAddRow: any;
  koCanRemoveRow: any;
  constructor(question: Question) {
    super(question);
    this.koRecalc = ko.observable(0);
    this.koRows = ko.pureComputed(function() {
      this.koRecalc();
      return (<QuestionMatrixDynamic>this.question).visibleRows;
    }, this);

    this.koOverflowX = ko.pureComputed(function() {
      return (<QuestionMatrixDropdownModelBase>this.question).horizontalScroll
        ? "scroll"
        : "none";
    }, this);
    this.question["koRows"] = this.koRows;
    var self = this;
    this.koAddRowClick = function() {
      self.addRow();
    };
    this.koRemoveRowClick = function(data) {
      self.removeRow(data);
    };
    this.koCanAddRow = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionMatrixDynamic>self.question).canAddRow;
    });
    this.koCanRemoveRow = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionMatrixDynamic>self.question).canRemoveRow;
    });
    this.question["koAddRowClick"] = this.koAddRowClick;
    this.question["koRemoveRowClick"] = this.koRemoveRowClick;
    this.question["koOverflowX"] = this.koOverflowX;
    this.question["koCanAddRow"] = this.koCanAddRow;
    this.question["koCanRemoveRow"] = this.koCanRemoveRow;
    (<QuestionMatrixDynamic>this
      .question).rowCountChangedCallback = function() {
      self.onRowCountChanged();
    };
    (<QuestionMatrixDynamic>this.question).columnsChangedCallback = function() {
      self.onColumnChanged();
    };
    (<QuestionMatrixDynamic>this.question).updateCellsCallback = function() {
      self.onUpdateCells();
    };
  }
  protected onUpdateCells() {
    //Genereate rows again.
    var rows = (<QuestionMatrixDynamic>this.question)["generatedVisibleRows"];
    var columns = (<QuestionMatrixDynamic>this.question).columns;
    if (rows && rows.length > 0 && columns && columns.length > 0)
      this.onColumnChanged();
  }
  protected onColumnChanged() {
    var rows = (<QuestionMatrixDynamic>this.question).visibleRows;
    this.onRowCountChanged();
  }
  protected onRowCountChanged() {
    this.koRecalc(this.koRecalc() + 1);
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
