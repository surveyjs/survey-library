import React from "react";
import {
  QuestionPanelDynamicModel
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";
import { SurveyQuestionPanelDynamic } from "../../reactquestion_paneldynamic";

export class SurveyQuestionPanelDynamicAction extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
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
    return (
      <button type="button" className={this.question.getAddButtonCss()} onClick={this.handleClick} >
        <span className={this.question.cssClasses.buttonAddText}>{this.question.panelAddText}</span>
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
