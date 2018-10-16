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
  SurveyQuestionMatrixDropdownRowBase
} from "./reactquestionmatrixdropdownbase";

export class SurveyQuestionMatrixDynamic extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
  }
  protected get matrix(): QuestionMatrixDynamicModel {
    return this.questionBase as QuestionMatrixDynamicModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  protected setProperties(nextProps: any) {
    super.setProperties(nextProps);
    this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
  }
  handleOnRowAddClick(event: any) {
    this.matrix.addRow();
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var mainDiv = this.renderTableDiv();
    return (
      <div ref="matrixDynamicRef">
        {this.renderAddRowButtonOnTop(cssClasses)}
        {mainDiv}
        {this.renderAddRowButtonOnBottom(cssClasses)}
      </div>
    );
  }
  renderRow(
    index: number,
    row: MatrixDropdownRowModelBase,
    cssClasses: any
  ): JSX.Element {
    return (
      <SurveyQuestionMatrixDynamicRow
        key={row.id}
        row={row}
        index={index}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        creator={this.creator}
        question={this.question}
      />
    );
  }
  protected addHeaderRigth(elements: Array<JSX.Element>) {
    if (this.matrix.canRemoveRow) {
      elements.push(<td />);
    }
  }
  protected renderAddRowButtonOnTop(cssClasses: any): JSX.Element {
    if (!this.matrix.isAddRowOnTop) return null;
    return this.renderAddRowButton(cssClasses);
  }
  protected renderAddRowButtonOnBottom(cssClasses: any): JSX.Element {
    if (!this.matrix.isAddRowOnBottom) return null;
    return this.renderAddRowButton(cssClasses);
  }
  protected renderAddRowButton(cssClasses: any): JSX.Element {
    return (
      <div className={cssClasses.footer}>
        <input
          className={cssClasses.button + " " + cssClasses.buttonAdd}
          type="button"
          onClick={this.handleOnRowAddClick}
          value={this.matrix.addRowText}
        />
      </div>
    );
  }
  protected addBottomColumnAsRows(elements: Array<JSX.Element>) {
    if (!this.matrix.canRemoveRow) return;
    var cssClasses = this.question.cssClasses;
    var tds = [];
    if (this.question.showHeader) {
      tds.push(<td key={"header"} />);
    }
    var rows = this.question.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      var removeButton = (
        <SurveyQuestionMatrixDynamicRemoveButton
          question={this.question}
          index={i}
          cssClasses={cssClasses}
        />
      );
      tds.push(<td key={"cell" + i}>{removeButton}</td>);
    }
    elements.push(<tr key={"removeRow"}>{tds}</tr>);
  }
}

export class SurveyQuestionMatrixDynamicRemoveButton extends ReactSurveyElement {
  private question: QuestionMatrixDynamicModel;
  private index: number;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  private setProperties(nextProps: any) {
    this.question = nextProps.question;
    this.index = nextProps.index;
    this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
  }
  handleOnRowRemoveClick(event: any) {
    this.question.removeRowUI(this.index);
  }
  render(): JSX.Element {
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
  }
  protected AddRightCells(tds: Array<JSX.Element>) {
    if (this.question.canRemoveRow) {
      var removeButton = (
        <SurveyQuestionMatrixDynamicRemoveButton
          question={this.question}
          index={this.index}
          cssClasses={this.cssClasses}
        />
      );
      tds.push(<td key={"row" + this.row.cells.length + 1}>{removeButton}</td>);
    }
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", props => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});
