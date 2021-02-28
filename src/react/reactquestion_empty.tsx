import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionEmptyModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionEmpty extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.question.value };
  }
  protected get question(): QuestionEmptyModel {
    return this.questionBase as QuestionEmptyModel;
  }
  protected renderElement(): JSX.Element {
    return <div />;
  }
}

ReactQuestionFactory.Instance.registerQuestion("empty", (props) => {
  return React.createElement(SurveyQuestionEmpty, props);
});
