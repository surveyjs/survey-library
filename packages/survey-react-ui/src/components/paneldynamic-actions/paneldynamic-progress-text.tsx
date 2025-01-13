import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SurveyQuestionPanelDynamicAction } from "./paneldynamic-add-btn";

export class SurveyQuestionPanelDynamicProgressText extends SurveyQuestionPanelDynamicAction {
  protected renderElement(): React.JSX.Element {
    return (<div className={this.question.cssClasses.progressText}>
      {this.question.progressText}
    </div>);
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-paneldynamic-progress-text",
  (props) => {
    return React.createElement(SurveyQuestionPanelDynamicProgressText, props);
  }
);