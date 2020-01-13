import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionUncontrolledElement
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

    return (
      <textarea
        id={this.question.inputId}
        className={cssClasses.root}
        disabled={this.isDisplayMode}
        ref={tetxarea => (this.control = tetxarea)}
        maxLength={this.question.getMaxLength()}
        placeholder={this.question.placeHolder}
        onBlur={onBlur}
        onInput={onInput}
        onChange={this.updateValueOnEvent}
        cols={this.question.cols}
        rows={this.question.rows}
        aria-label={this.question.locTitle.renderedHtml}
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
        aria-label={question.locTitle.renderedHtml}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", props => {
  return React.createElement(SurveyQuestionComment, props);
});
