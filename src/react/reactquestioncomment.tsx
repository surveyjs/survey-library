import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { Helpers } from "../helpers";
import { QuestionCommentModel } from "../question_comment";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionComment extends SurveyQuestionElementBase {
  tetxarea: any;
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.updateValueOnEvent = this.updateValueOnEvent.bind(this);
  }
  protected get question(): QuestionCommentModel {
    return this.questionBase as QuestionCommentModel;
  }
  componentWillUpdate() {
    this.tetxarea.value = this.getValue(this.question.value);
  }
  componentDidMount() {
    this.tetxarea.value = this.getValue(this.question.value);
  }
  handleOnChange(event: any) {
    this.question.value = event.target.value;
  }
  updateValueOnEvent(event: any) {
    this.question.value = event.target.value;
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
        readOnly={this.isDisplayMode}
        ref={tetxarea => (this.tetxarea = tetxarea)}
        maxLength={this.question.getMaxLength()}
        placeholder={this.question.placeHolder}
        onBlur={onBlur}
        onInput={onInput}
        onChange={this.handleOnChange}
        cols={this.question.cols}
        rows={this.question.rows}
        aria-label={this.question.locTitle.renderedHtml}
      />
    );
  }
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
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
        readOnly={this.isDisplayMode}
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
