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
    this.state = { value: this.getStateValue() };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }
  protected get question(): QuestionCommentModel {
    return this.questionBase as QuestionCommentModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setState({ value: this.getStateValue() });
  }
  handleOnChange(event: any) {
    this.setState({ value: event.target.value });
  }
  handleOnBlur(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.getStateValue() });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    return (
      <textarea
        id={this.question.inputId}
        className={cssClasses.root}
        readOnly={this.isDisplayMode}
        value={this.state.value}
        maxLength={this.question.getMaxLength()}
        placeholder={this.question.placeHolder}
        onBlur={this.handleOnBlur}
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
  private question: Question;
  private comment: string;
  private otherCss: string;
  constructor(props: any) {
    super(props);
    this.question = props.question;
    this.comment = this.question.comment;
    this.otherCss = props.otherCss;
    this.state = { value: this.comment };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }
  handleOnChange(event: any) {
    this.comment = event.target.value;
    this.setState({ value: this.comment });
  }
  handleOnBlur(event: any) {
    this.question.comment = this.comment;
  }
  componentWillReceiveProps(nextProps: any) {
    this.question = nextProps.question;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    if (this.isDisplayMode)
      return <div className={this.cssClasses.comment}>{this.comment}</div>;
    var className = this.otherCss ? this.otherCss : this.cssClasses.comment;
    return (
      <input
        type="text"
        className={className}
        value={this.state.value}
        maxLength={this.question.getOthersMaxLength()}
        onChange={this.handleOnChange}
        onBlur={this.handleOnBlur}
        aria-label={this.question.locTitle.renderedHtml}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", props => {
  return React.createElement(SurveyQuestionComment, props);
});
