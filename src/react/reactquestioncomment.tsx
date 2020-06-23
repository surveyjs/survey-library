import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionUncontrolledElement,
} from "./reactquestionelement";
import { Helpers } from "../helpers";
import { QuestionCommentModel } from "../question_comment";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionComment extends SurveyQuestionUncontrolledElement<
  QuestionCommentModel
  > {
  constructor(props: any) {
    super(props);
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var onBlur = !this.question.isInputTextUpdate
      ? this.updateValueOnEvent
      : null;
    var onInput = this.question.isInputTextUpdate
      ? this.updateValueOnEvent
      : null;
    var placeHolder = this.question.isReadOnly ? "" : this.question.placeHolder;
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }
    return (
      <textarea
        id={this.question.inputId}
        className={cssClasses.root}
        disabled={this.isDisplayMode}
        ref={(tetxarea) => (this.control = tetxarea)}
        maxLength={this.question.getMaxLength()}
        placeholder={placeHolder}
        onBlur={onBlur}
        onInput={onInput}
        cols={this.question.cols}
        rows={this.question.rows}
        aria-required={this.question.isRequired}
        aria-label={this.question.locTitle.renderedHtml}
        aria-invalid={this.question.errors.length > 0}
        aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}
      />
    );
  }
}

export class SurveyQuestionCommentItem extends ReactSurveyElement {
  render(): JSX.Element {
    let question = this.props.question;
    if (!question) return null;
    let className = this.props.otherCss || this.cssClasses.comment;
    let handleOnChange = (event: any) => {
      this.setState({ comment: event.target.value });
    };
    let updateValueOnEvent = (event: any) => {
      question.comment = event.target.value;
    };
    var onBlur = !question.isSurveyInputTextUpdate ? updateValueOnEvent : null;
    var onInput = question.isSurveyInputTextUpdate ? updateValueOnEvent : null;

    let comment =
      !!this.state && this.state.comment !== undefined
        ? this.state.comment
        : question.comment || "";
    if (question.isReadOnlyRenderDiv()) {
      return <div>{comment}</div>;
    }
    return (
      <textarea
        className={className}
        value={comment}
        disabled={this.isDisplayMode}
        maxLength={question.getOthersMaxLength()}
        placeholder={question.otherPlaceHolder}
        onChange={handleOnChange}
        onBlur={onBlur}
        onInput={onInput}
        aria-required={question.isRequired}
        aria-label={question.locTitle.renderedHtml}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
