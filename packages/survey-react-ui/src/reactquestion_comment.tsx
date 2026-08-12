import * as React from "react";
import { IReactSurveyElementProps, ReactSurveyElement, SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { ItemValue, Question, QuestionCommentModel, TextAreaModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { CharacterCounterComponent } from "./components/character-counter";
import { TextAreaComponent } from "./components/text-area";

export class SurveyQuestionComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): React.JSX.Element {
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }

    const textAreaModel: TextAreaModel = this.props.question.textAreaModel;
    return (
      <>
        <TextAreaComponent viewModel={textAreaModel}></TextAreaComponent>
      </>
    );
  }
}

export interface ISurveyQuestionCommentItemProps extends IReactSurveyElementProps {
   question: Question;
}
export class SurveyQuestionCommentItem<P extends ISurveyQuestionCommentItemProps = ISurveyQuestionCommentItemProps> extends ReactSurveyElement<P> {
  private textAreaModel: TextAreaModel;

  constructor(props: { question: Question }) {
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
      <TextAreaComponent key={this.getKey()} viewModel={this.textAreaModel}></TextAreaComponent>
    );
  }
  protected getKey(): number { return undefined; }
}

export interface ISurveyQuestionCommentValueItemProps extends ISurveyQuestionCommentItemProps {
   question: Question;
   item: ItemValue;
}

export class SurveyQuestionCommentValueItem extends SurveyQuestionCommentItem<ISurveyQuestionCommentValueItemProps> {
  constructor(props: ISurveyQuestionCommentValueItemProps) {
    super(props);
  }
  protected getTextAreaModel(): TextAreaModel {
    return this.props.question.getCommentTextAreaModel(this.props.item);
  }
  protected getKey(): number { return this.props.item.uniqueId; }
}
ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
