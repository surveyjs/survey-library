import React from "react";
import { ActionBarItem } from "../../../../action-bar";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "../../../../question_matrixdropdownbase";
import { ReactElementFactory } from "../../../element-factory";
import { ReactSurveyElement } from "../../../reactquestion_element";

export class SurveyQuestionMatrixDetailButton extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnShowHideClick = this.handleOnShowHideClick.bind(this);
  }
  protected getStateElement() {
    return this.props.item;
  }
  get item(): ActionBarItem {
    return this.props.item;
  }
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.item.data.question;
  }
  private get row(): MatrixDropdownRowModelBase {
    return this.props.item.data.row;
  }
  handleOnShowHideClick(event: any) {
    this.row.showHideDetailPanelClick();
  }
  protected renderElement(): JSX.Element {
    var isExpanded = this.row.isDetailPanelShowing;
    var ariaExpanded = isExpanded;
    var ariaControls = isExpanded ? this.row.detailPanelId : null;
    return (
      <button
        type="button"
        onClick={this.handleOnShowHideClick}
        className={this.question.getDetailPanelButtonCss(this.row)}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
      >
        <span className={this.question.getDetailPanelIconCss(this.row)} />
      </button>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-detail-button",
  (props) => {
    return React.createElement(SurveyQuestionMatrixDetailButton, props);
  }
);
