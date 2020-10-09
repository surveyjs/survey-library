import * as React from "react";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { SurveyQuestion } from "./reactquestion";
import { QuestionCustomModel, QuestionCompositeModel } from "../question_custom";
import { ReactQuestionFactory } from "./reactquestion_factory";
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
