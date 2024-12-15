import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SvgIcon } from "../svg-icon/svg-icon";
import { SurveyQuestionPanelDynamicAction } from "./paneldynamic-add-btn";

export class SurveyQuestionPanelDynamicPrevButton extends SurveyQuestionPanelDynamicAction {
  protected handleClick = (event: any) => {
    this.question.goToPrevPanel();
  }
  protected renderElement(): React.JSX.Element {
    return (
      <div title={this.question.panelPrevText} onClick={this.handleClick} className={this.question.getPrevButtonCss()}>
        <SvgIcon
          iconName={this.question.cssClasses.progressBtnIcon}
          size={"auto"}
        >
        </SvgIcon>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-paneldynamic-prev-btn",
  (props) => {
    return React.createElement(SurveyQuestionPanelDynamicPrevButton, props);
  }
);
