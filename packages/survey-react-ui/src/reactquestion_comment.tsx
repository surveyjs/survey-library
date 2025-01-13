import * as React from "react";
import { ReactSurveyElement, SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionCommentModel, TextAreaModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { CharacterCounterComponent } from "./components/character-counter";
import { TextAreaComponent } from "./components/text-area";

export class SurveyQuestionComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  private renderCharacterCounter(): React.JSX.Element | null {
    let counter: React.JSX.Element | null = null;
    if (!!this.question.getMaxLength()) {
      counter = <CharacterCounterComponent
        counter={this.question.characterCounter}
        remainingCharacterCounter={this.question.cssClasses.remainingCharacterCounter}>
      </CharacterCounterComponent>;
    }
    return counter;
  }
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): React.JSX.Element {
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }

    const counter = this.renderCharacterCounter();
    const textAreaModel: TextAreaModel = this.props.question.textAreaModel;
    return (
      <>
        <TextAreaComponent viewModel={textAreaModel}></TextAreaComponent>
        {counter}
      </>
    );
  }
}

export class SurveyQuestionCommentItem extends ReactSurveyElement {
  private textAreaModel: TextAreaModel;

  constructor(props: any) {
    super(props);
    this.textAreaModel = this.getTextAreaModel();
  }

  protected canRender(): boolean {
    return !!this.props.question;
  }

  protected getTextAreaModel(): TextAreaModel {
    return this.props.question.commentTextAreaModel;
  }

  protected renderElement(): React.JSX.Element {
    const question = this.props.question;
    if (question.isReadOnlyRenderDiv()) {
      const comment = this.textAreaModel.getTextValue() || "";
      return <div>{comment}</div>;
    }

    return (
      <TextAreaComponent viewModel={this.textAreaModel}></TextAreaComponent>
    );
  }
}
export class SurveyQuestionOtherValueItem extends SurveyQuestionCommentItem {
  protected getTextAreaModel(): TextAreaModel {
    return this.props.question.otherTextAreaModel;
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
