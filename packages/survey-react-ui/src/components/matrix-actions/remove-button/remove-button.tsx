import React from "react";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "survey-core";
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
    var removeRowText = this.renderLocString(this.question.locRemoveRowText);
    return (
      <button
        className={this.question.getRemoveRowButtonCss()}
        type="button"
        onClick={this.handleOnRowRemoveClick}
        disabled={this.question.isInputReadOnly}
      >
        {removeRowText}
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
