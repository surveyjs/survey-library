import * as React from "react";
import { SurveyQuestionUncontrolledElement } from "./reactquestionelement";
import { QuestionTextModel } from "../question_text";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionText extends SurveyQuestionUncontrolledElement<
  QuestionTextModel
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
    var placeHolder =
      this.question.inputType === "range" || this.question.isReadOnly
        ? ""
        : this.question.placeHolder;
    return (
      <input
        id={this.question.inputId}
        disabled={this.isDisplayMode}
        className={cssClasses.root}
        type={this.question.inputType}
        ref={input => (this.control = input)}
        maxLength={this.question.getMaxLength()}
        min={this.question.min}
        max={this.question.max}
        step={this.question.step}
        size={this.question.size}
        placeholder={placeHolder}
        onBlur={onBlur}
        onInput={onInput}
        aria-required={this.question.isRequired}
        aria-label={this.question.locTitle.renderedHtml} 
        aria-invalid={this.question.errors.length > 0}
        aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("text", props => {
  return React.createElement(SurveyQuestionText, props);
});
