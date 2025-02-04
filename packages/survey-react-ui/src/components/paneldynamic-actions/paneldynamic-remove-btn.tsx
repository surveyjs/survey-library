import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SurveyQuestionPanelDynamicAction } from "./paneldynamic-add-btn";

export class SurveyQuestionPanelDynamicRemoveButton extends SurveyQuestionPanelDynamicAction {
  protected handleClick = (event: any) => {
    this.question.removePanelUI(this.data.panel);
  }
  protected renderElement(): React.JSX.Element {
    const btnText = this.renderLocString(this.question.locRemovePanelText);
    const id = this.question.getPanelRemoveButtonId(this.data.panel);
    return (
      <button id={id}
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
