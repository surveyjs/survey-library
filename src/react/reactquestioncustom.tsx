import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionUncontrolledElement,
} from "./reactquestionelement";
import { SurveyQuestion } from "./reactquestion";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
} from "../question_custom";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyPanel } from "./panel";

export class SurveyQuestionCustom extends SurveyQuestionUncontrolledElement<
  QuestionCustomModel
> {
  constructor(props: any) {
    super(props);
  }
  render(): JSX.Element {
    if (!this.question) return null;
    return SurveyQuestion.renderQuestionBody(
      this.creator,
      this.question.contentQuestion
    );
  }
}

export class SurveyQuestionComposite extends SurveyQuestionUncontrolledElement<
  QuestionCompositeModel
> {
  constructor(props: any) {
    super(props);
  }
  render(): JSX.Element {
    if (!this.question || !this.question.contentPanel) return null;
    return (
      <SurveyPanel
        element={this.question.contentPanel}
        creator={this.creator}
        survey={this.question.survey}
      ></SurveyPanel>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("custom", (props) => {
  return React.createElement(SurveyQuestionCustom, props);
});
ReactQuestionFactory.Instance.registerQuestion("composite", (props) => {
  return React.createElement(SurveyQuestionComposite, props);
});
