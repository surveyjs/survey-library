import * as React from "react";
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
  protected get isActionEnabled(): boolean {
    return !this.props.item || this.props.item.enabled !== false;
  }
}

export class SurveyQuestionPanelDynamicAddButton extends SurveyQuestionPanelDynamicAction {
  protected get isActionEnabled(): boolean {
    if (this.props.item) return this.props.item.enabled !== false;
    return this.question.enableAddPanel !== false;
  }
  protected handleClick = (event: any) => {
    if (!this.isActionEnabled) return;
    this.question.addPanelUI();
  };
  protected renderElement(): React.JSX.Element | null {
    if (!this.question.canAddPanel) return null;
    const btnText = this.renderLocString(this.question.locAddPanelText);
    return (
      <button type="button" id={this.question.addButtonId} className={this.question.getAddButtonCss()} onClick={this.handleClick} disabled={!this.isActionEnabled}>
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
