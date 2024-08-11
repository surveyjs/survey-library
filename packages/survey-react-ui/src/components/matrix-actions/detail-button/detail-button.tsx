import React from "react";
import { Action, MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "survey-core";
import { ReactElementFactory } from "../../../element-factory";
import { ReactSurveyElement } from "../../../reactquestion_element";
import { SvgIcon } from "../../svg-icon/svg-icon";

export class SurveyQuestionMatrixDetailButton extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnShowHideClick = this.handleOnShowHideClick.bind(this);
  }
  protected getStateElement() {
    return this.props.item;
  }
  get item(): Action {
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
    var ariaControls = isExpanded ? this.row.detailPanelId : undefined;
    return (
      <button
        type="button"
        onClick={this.handleOnShowHideClick}
        className={this.question.getDetailPanelButtonCss(this.row)}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
      >
        <SvgIcon
          className={this.question.getDetailPanelIconCss(this.row)}
          iconName={this.question.getDetailPanelIconId(this.row)}
          size={"auto"}
        >
        </SvgIcon>
      </button>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-detail-button",
  props => {
    return React.createElement(SurveyQuestionMatrixDetailButton, props);
  }
);
