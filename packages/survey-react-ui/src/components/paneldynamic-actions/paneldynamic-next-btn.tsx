import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SvgIcon } from "../svg-icon/svg-icon";
import { SurveyQuestionPanelDynamicAction } from "./paneldynamic-add-btn";

export class SurveyQuestionPanelDynamicNextButton extends SurveyQuestionPanelDynamicAction {
  protected handleClick = (event: any) => {
    this.question.goToNextPanel();
  }
  protected renderElement(): React.JSX.Element {
    return (
      <div title={this.question.panelNextText} onClick={this.handleClick} className={this.question.getNextButtonCss()}>
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
  "sv-paneldynamic-next-btn",
  (props) => {
    return React.createElement(SurveyQuestionPanelDynamicNextButton, props);
  }
);
