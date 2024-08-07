import * as React from "react";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { SurveyQuestion } from "./reactquestion";
import { Base, QuestionCustomModel, QuestionCompositeModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyPanel } from "./panel";

export class SurveyQuestionCustom extends SurveyQuestionUncontrolledElement<QuestionCustomModel> {
  constructor(props: any) {
    super(props);
  }
  protected getStateElements(): Array<Base> {
    const res = super.getStateElements();
    if(!!this.question.contentQuestion) {
      res.push(this.question.contentQuestion);
    }
    return res;
  }
  protected renderElement(): JSX.Element {
    return SurveyQuestion.renderQuestionBody(
      this.creator,
      this.question.contentQuestion
    );
  }
}

export class SurveyQuestionComposite extends SurveyQuestionUncontrolledElement<QuestionCompositeModel> {
  constructor(props: any) {
    super(props);
  }
  protected canRender(): boolean {
    return !!this.question.contentPanel;
  }
  protected renderElement(): JSX.Element {
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
