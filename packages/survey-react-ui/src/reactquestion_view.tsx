import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { Question, RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionView extends SurveyQuestionElementBase {
  protected get question(): Question {
    return this.questionBase;
  }
  protected renderElement(): React.JSX.Element {
    return (
      <div
        id={this.question.inputId}
        className={this.question.viewModeCssClass}
        ref={(div) => (this.setControl(div))}
      >
        {this.question.viewDisplayText}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-question-view", (props) => {
  return React.createElement(SurveyQuestionView, props);
});

RendererFactory.Instance.registerRenderer("question", "view", "sv-question-view");
