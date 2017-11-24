import * as React from "react";
import { Helpers } from "../helpers";
import { Base } from "../base";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionEmptyModel } from "../question_empty";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionEmpty extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.question.value };
  }
  protected get question(): QuestionEmptyModel {
    return this.questionBase as QuestionEmptyModel;
  }
  render(): JSX.Element {
    return <div />;
  }
}

ReactQuestionFactory.Instance.registerQuestion("empty", props => {
  return React.createElement(SurveyQuestionEmpty, props);
});
