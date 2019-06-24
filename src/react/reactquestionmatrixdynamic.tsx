import * as React from "react";
import { ReactSurveyElement } from "./reactquestionelement";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestionmatrixdropdownbase";

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
        <button
          className={cssClasses.button + " " + cssClasses.buttonAdd}
          type="button"
          onClick={this.handleOnRowAddClick}
        >
          <span>{this.matrix.addRowText}</span>
          <span className={cssClasses.iconAdd} />
        </button>
      </div>
    );
  }
  renderRemoveButton(row: MatrixDropdownRowModelBase): JSX.Element {
    return (
      <SurveyQuestionMatrixDynamicRemoveButton
        question={this.question}
        row={row}
        cssClasses={this.question.cssClasses}
      />
    );
  }
}

export class SurveyQuestionMatrixDynamicRemoveButton extends ReactSurveyElement {
  private question: QuestionMatrixDynamicModel;
  private row: MatrixDropdownRowModelBase;
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
    this.row = nextProps.row;
    this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
  }
  handleOnRowRemoveClick(event: any) {
    this.question.removeRowUI(this.row);
  }
  render(): JSX.Element {
    return (
      <button
        className={this.cssClasses.button + " " + this.cssClasses.buttonRemove}
        type="button"
        onClick={this.handleOnRowRemoveClick}
      >
        <span>{this.question.removeRowText}</span>
        <span className={this.cssClasses.iconRemove} />
      </button>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", props => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});
