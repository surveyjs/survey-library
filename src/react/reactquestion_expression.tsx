import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionExpressionModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionExpression extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionExpressionModel {
    return this.questionBase as QuestionExpressionModel;
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    return (
      <div
        id={this.question.inputId}
        className={cssClasses.root}
        ref={(div) => (this.setControl(div))}
      >
        {this.question.formatedValue}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("expression", (props) => {
  return React.createElement(SurveyQuestionExpression, props);
});
