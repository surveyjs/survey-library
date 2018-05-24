import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { ISurveyCreator } from "./reactquestion";
import { MatrixDynamicRowModel } from "../question_matrixdynamic";
import {
  MatrixDropdownCell,
  MatrixDropdownRowModelBase
} from "../question_matrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyCustomWidget } from "./custom-widget";
import {
  SurveyQuestionMatrixDropdownBase,
  SurveyQuestionMatrixDropdownRowBase,
  SurveyQuestionMatrixDropdownCell
} from "./reactquestionmatrixdropdownbase";

export class SurveyQuestionMatrixDynamic extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
    this.setProperties(props);
    this.state = this.getState();
  }
  protected get matrix(): QuestionMatrixDynamicModel {
    return this.questionBase as QuestionMatrixDynamicModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  private setProperties(nextProps: any) {
    if (this.refs.matrixDynamicRef) this.setState({ rowCounter: 0 });
    this.matrix.rowCountChangedCallback = () => {
      this.setState(this.getState(this.state));
    };
    this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
  }
  private getState(prevState = null) {
    return { rowCounter: !prevState ? 0 : prevState.rowCounter + 1 };
  }
  handleOnRowAddClick(event) {
    this.matrix.addRow();
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var mainDiv = this.renderTableDiv();
    return (
      <div ref="matrixDynamicRef">
        {mainDiv}
        <div className={cssClasses.footer}>
          {this.renderAddRowButton(cssClasses)}
        </div>
      </div>
    );
  }
  renderRow(
    key: number,
    row: MatrixDropdownRowModelBase,
    cssClasses: any
  ): JSX.Element {
    return (
      <SurveyQuestionMatrixDynamicRow
        key={key}
        row={row}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        creator={this.creator}
      />
    );
  }
  protected addHeaderRigth(elements: Array<JSX.Element>) {
    if (this.matrix.canRemoveRow) {
      elements.push(<td />);
    }
  }
  protected renderAddRowButton(cssClasses: any): JSX.Element {
    if (!this.matrix.canAddRow) return null;
    return (
      <input
        className={cssClasses.button + " " + cssClasses.buttonAdd}
        type="button"
        onClick={this.handleOnRowAddClick}
        value={this.matrix.addRowText}
      />
    );
  }
}

export class SurveyQuestionMatrixDynamicRow extends SurveyQuestionMatrixDropdownRowBase {
  private question: QuestionMatrixDynamicModel;
  private index: number;
  constructor(props: any) {
    super(props);
  }
  protected setProperties(nextProps: any) {
    super.setProperties(nextProps);
    this.question = nextProps.question;
    this.index = nextProps.index;
    this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
  }
  handleOnRowRemoveClick(event) {
    this.question.removeRowUI(this.index);
  }

  protected AddRightCells(tds: Array<JSX.Element>) {
    if (!this.isDisplayMode && this.question.canRemoveRow) {
      var removeButton = this.renderButton();
      tds.push(<td key={"row" + this.row.cells.length + 1}>{removeButton}</td>);
    }
  }
  protected renderButton(): JSX.Element {
    return (
      <input
        className={this.cssClasses.button + " " + this.cssClasses.buttonRemove}
        type="button"
        onClick={this.handleOnRowRemoveClick}
        value={this.question.removeRowText}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", props => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});
