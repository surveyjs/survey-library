import * as React from "react";
import { Helpers } from "../helpers";
import { Base } from "../base";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionTextModel } from "../question_text";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionText extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.getValue(this.question.value) };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }
  protected get question(): QuestionTextModel {
    return this.questionBase as QuestionTextModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setState({ value: this.getValue(this.question.value) });
  }
  handleOnChange(event: any) {
    this.setState({ value: this.getValue(event.target.value) });
  }
  handleOnBlur(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.getValue(this.question.value) });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    if (this.isDisplayMode) {
      return (
        <input
          disabled={true}
          id={this.question.inputId}
          className={cssClasses.root}
          type={this.question.inputType}
          value={this.state.value}
          maxLength={this.question.getMaxLength()}
          size={this.question.size}
          placeholder={this.question.placeHolder}
          aria-label={this.question.locTitle.renderedHtml}
        />
      );
    }
    return (
      <input
        id={this.question.inputId}
        className={cssClasses.root}
        type={this.question.inputType}
        value={this.state.value}
        maxLength={this.question.getMaxLength()}
        size={this.question.size}
        placeholder={this.question.placeHolder}
        onBlur={this.handleOnBlur}
        onChange={this.handleOnChange}
        aria-label={this.question.locTitle.renderedHtml}
      />
    );
  }
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
  }
}

ReactQuestionFactory.Instance.registerQuestion("text", props => {
  return React.createElement(SurveyQuestionText, props);
});
