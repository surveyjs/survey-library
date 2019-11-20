import * as React from "react";
import {
  SurveyElementBase,
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionCommentModel } from "../question_comment";
import { Question } from "../question";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionComment extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.updateValueOnEvent = this.updateValueOnEvent.bind(this);
  }
  protected get question(): QuestionCommentModel {
    return this.questionBase as QuestionCommentModel;
  }
  handleOnChange(event: any) {
    this.setState({ value: event.target.value });
  }
  updateValueOnEvent(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.getStateValue() });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var commentValue =
      !!this.state && this.state.value !== undefined
        ? this.state.value
        : this.getStateValue();
    var onBlue = !this.question.isInputTextUpdate
      ? this.updateValueOnEvent
      : null;
    var onInput = this.question.isInputTextUpdate
      ? this.updateValueOnEvent
      : null;

    return (
      <textarea
        id={this.question.inputId}
        className={cssClasses.root}
        readOnly={this.isDisplayMode}
        value={commentValue}
        maxLength={this.question.getMaxLength()}
        placeholder={this.question.placeHolder}
        onBlur={onBlue}
        onInput={onInput}
        onChange={this.handleOnChange}
        cols={this.question.cols}
        rows={this.question.rows}
        aria-label={this.question.locTitle.renderedHtml}
      />
    );
  }
  private getStateValue(): any {
    return !this.question.isEmpty() ? this.question.value : "";
  }
}

export class SurveyQuestionCommentItem extends ReactSurveyElement {
  render(): JSX.Element {
    let question = this.props.question;
    if (!question) return null;
    if (this.isDisplayMode) {
      let comment = question.comment || "";
      return <div className={this.cssClasses.comment}>{comment}</div>;
    }
    let className = this.props.otherCss || this.cssClasses.comment;
    let handleOnChange = (event: any) => {
      this.setState({ comment: event.target.value });
    };
    let updateValueOnEvent = (event: any) => {
      question.comment = event.target.value;
    };
    var onBlue = !question.isSurveyInputTextUpdate ? updateValueOnEvent : null;
    var onInput = question.isSurveyInputTextUpdate ? updateValueOnEvent : null;

    let comment =
      !!this.state && this.state.comment !== undefined
        ? this.state.comment
        : question.comment || "";
    return (
      <textarea
        className={className}
        value={comment}
        readOnly={question.isReadOnly}
        disabled={question.isReadOnly}
        maxLength={question.getOthersMaxLength()}
        placeholder={question.otherPlaceHolder}
        onChange={handleOnChange}
        onBlur={onBlue}
        onInput={onInput}
        aria-label={question.locTitle.renderedHtml}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", props => {
  return React.createElement(SurveyQuestionComment, props);
});
