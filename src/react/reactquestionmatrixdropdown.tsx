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
  SurveyQuestionMatrixDropdownRowBase,
  SurveyQuestionMatrixDropdownCell
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
    elements.push(<td />);
  }
  renderRow(
    key: number,
    row: MatrixDropdownRowModelBase,
    cssClasses: any
  ): JSX.Element {
    return (
      <SurveyQuestionMatrixDropdownRow
        key={key}
        row={row}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        creator={this.creator}
      />
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
    tds.push(<td>{rowText}</td>);
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", props => {
  return React.createElement(SurveyQuestionMatrixDropdown, props);
});
