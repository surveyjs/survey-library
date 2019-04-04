import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import { ISurveyCreator, SurveyElementErrors } from "./reactquestion";
import { MatrixDropdownRowModel } from "../question_matrixdropdown";
import {
  MatrixDropdownCell,
  MatrixDropdownRowModelBase
} from "../question_matrixdropdownbase";
import {
  SurveyQuestionMatrixDropdownBase,
  SurveyQuestionMatrixDropdownRowBase
} from "./reactquestionmatrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyCustomWidget } from "./custom-widget";

export class SurveyQuestionMatrixDropdown extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
  }
  protected get matrix(): QuestionMatrixDropdownModel {
    return this.questionBase as QuestionMatrixDropdownModel;
  }
  protected addHeaderLeft(elements: Array<JSX.Element>) {
    elements.push(<td key="header-left-1" />);
  }
  renderRow(
    index: number,
    row: MatrixDropdownRowModelBase,
    cssClasses: any
  ): JSX.Element {
    return (
      <SurveyQuestionMatrixDropdownRow
        key={row.id}
        row={row}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        creator={this.creator}
      />
    );
  }
  renderRowsAsHeaders(): JSX.Element {
    var headers = [];
    if (this.question.showHeader) {
      headers.push(<td key="head-column-0" />);
    }
    var rows = this.matrix.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      var key = "column" + i;
      var row = rows[i] as MatrixDropdownRowModel;
      var columnTitle = this.renderLocString(row.locText);
      headers.push(<th key={key}>{columnTitle}</th>);
    }
    return (
      <thead>
        <tr>{headers}</tr>
      </thead>
    );
  }
}
export class SurveyQuestionMatrixDropdownRow extends SurveyQuestionMatrixDropdownRowBase {
  constructor(props: any) {
    super(props);
  }
  protected AddLeftCells(tds: Array<JSX.Element>) {
    var row = this.row as MatrixDropdownRowModel;
    var rowText = this.renderLocString(row.locText);
    tds.push(<td key="row-left-1">{rowText}</td>);
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", props => {
  return React.createElement(SurveyQuestionMatrixDropdown, props);
});
