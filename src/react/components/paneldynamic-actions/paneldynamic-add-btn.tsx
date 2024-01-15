import React from "react";
import {
  QuestionPanelDynamicModel
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";

export class SurveyQuestionPanelDynamicAction extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected get data(): any {
    return (this.props.item && this.props.item.data) || this.props.data;
  }
  protected get question(): QuestionPanelDynamicModel {
    return (this.props.item && this.props.item.data.question) || this.props.data.question;
  }
}

export class SurveyQuestionPanelDynamicAddButton extends SurveyQuestionPanelDynamicAction {
  protected handleClick = (event: any) => {
    this.question.addPanelUI();
  }
  protected renderElement(): JSX.Element | null {
    if (!this.question.canAddPanel) return null;
    const btnText = this.renderLocString(this.question.locPanelAddText);
    return (
      <button type="button" className={this.question.getAddButtonCss()} onClick={this.handleClick} >
        <span className={this.question.cssClasses.buttonAddText}>{btnText}</span>
      </button>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-paneldynamic-add-btn",
  (props) => {
    return React.createElement(SurveyQuestionPanelDynamicAddButton, props);
  }
);
