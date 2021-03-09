import React from "react";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "../../../../question_matrixdropdownbase";
import { ReactElementFactory } from "../../../element-factory";
import { ReactSurveyElement } from "../../../reactquestion_element";

export class SurveyQuestionMatrixDynamicRemoveButton extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
  }
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.item.data.question;
  }
  private get row(): MatrixDropdownRowModelBase {
    return this.props.item.data.row;
  }
  handleOnRowRemoveClick(event: any) {
    this.question.removeRowUI(this.row);
  }
  protected renderElement(): JSX.Element {
    return (
      <button
        className={this.question.cssClasses.button + " " + this.question.cssClasses.buttonRemove}
        type="button"
        onClick={this.handleOnRowRemoveClick}
      >
        <span>{this.question.removeRowText}</span>
        <span className={this.question.cssClasses.iconRemove} />
      </button>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-remove-button",
  (props) => {
    return React.createElement(SurveyQuestionMatrixDynamicRemoveButton, props);
  }
);
