import * as React from "react";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";
import { QuestionPanelDynamicModel } from "survey-core";

export class SurveyQuestionPanelDynamicProgressText extends ReactSurveyElement {
  protected get data(): any {
    return (this.props.item && this.props.item.data) || this.props.data;
  }
  protected get question(): QuestionPanelDynamicModel {
    return (this.props.item && this.props.item.data.question) || this.props.data.question;
  }
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