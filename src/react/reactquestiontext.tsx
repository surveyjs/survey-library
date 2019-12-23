import * as React from "react";
import { Helpers } from "../helpers";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionTextModel } from "../question_text";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionText extends SurveyQuestionElementBase {
  input: any;
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionTextModel {
    return this.questionBase as QuestionTextModel;
  }
  componentWillUpdate() {
    this.input.value = this.getValue(this.question.value);
  }
  componentDidMount() {
    this.input.value = this.getValue(this.question.value);
  }
  updateValueOnEvent = (event: any) => {
    this.question.value = event.target.value;
  };
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
      <input
        id={this.question.inputId}
        disabled={this.isDisplayMode}
        className={cssClasses.root}
        type={this.question.inputType}
        ref={input => (this.input = input)}
        maxLength={this.question.getMaxLength()}
        size={this.question.size}
        placeholder={this.question.placeHolder}
        onBlur={onBlur}
        onInput={onInput}
        aria-required={this.question.isRequired}
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
