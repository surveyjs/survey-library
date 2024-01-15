import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";
import { SurveyQuestionPanelDynamic } from "../../reactquestion_paneldynamic";
import { SurveyQuestionPanelDynamicAction } from "./paneldynamic-add-btn";

export class SurveyQuestionPanelDynamicRemoveButton extends SurveyQuestionPanelDynamicAction {
  protected handleClick = (event: any) => {
    this.question.removePanelUI(this.data.panel);
  }
  protected renderElement(): JSX.Element {
    const btnText = this.renderLocString(this.question.locPanelRemoveText);
    return (
      <button
        className={this.question.getPanelRemoveButtonCss()}
        onClick={this.handleClick}
        type="button">
        <span
          className={this.question.cssClasses.buttonRemoveText}
        >{btnText}</span>
        <span
          className={this.question.cssClasses.iconRemove}
        ></span>
      </button>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-paneldynamic-remove-btn",
  (props) => {
    return React.createElement(SurveyQuestionPanelDynamicRemoveButton, props);
  }
);
