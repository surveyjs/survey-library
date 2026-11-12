import * as React from "react";
import { Base, QuestionDateTimePickerModel } from "survey-core";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { Popup } from "./components/popup/popup";
import "./components/calendar/calendar";

export class SurveyQuestionDateTimePicker extends SurveyQuestionElementBase {
  private inputs: Array<HTMLInputElement | null> = [];

  protected get question(): QuestionDateTimePickerModel {
    return this.questionBase as QuestionDateTimePickerModel;
  }
  protected getStateElement(): Base {
    return this.question;
  }
  private getRenderedTexts(): Array<string> {
    const q = this.question;
    return q.range ? [q.renderedStartInputValue, q.renderedEndInputValue] : [q.renderedInputValue];
  }
  private renderInput(index: number, id: string, text: string, placeholder: string): React.JSX.Element {
    const q = this.question;
    return (
      <input
        key={id}
        id={id}
        type="text"
        autoComplete="off"
        className={q.getControlClass()}
        defaultValue={text}
        placeholder={placeholder}
        disabled={q.isDisabledAttr}
        readOnly={q.isReadOnlyAttr}
        ref={(input) => { this.inputs[index] = input; }}
        onBlur={(event) => { q.onBlur(event); }}
        onFocus={(event) => { q.onFocus(event); }}
        onKeyUp={q.onKeyUp}
        aria-required={q.a11y_input_ariaRequired}
        aria-label={q.a11y_input_ariaLabel}
        aria-labelledby={q.a11y_input_ariaLabelledBy}
        aria-describedby={q.a11y_input_ariaDescribedBy}
        aria-invalid={q.a11y_input_ariaInvalid}
        aria-errormessage={q.a11y_input_ariaErrormessage}
      />
    );
  }
  private renderField(index: number, id: string, text: string, placeholder: string): React.JSX.Element {
    const q = this.question;
    return (
      <div key={id} className={q.getFieldClass()}>
        {this.renderInput(index, id, text, placeholder)}
        <SurveyActionBar model={q.getEditorButtons(index)}></SurveyActionBar>
      </div>
    );
  }
  private renderFields(): React.JSX.Element | Array<React.JSX.Element> {
    const q = this.question;
    if (!q.range) {
      return this.renderField(0, q.inputId, q.renderedInputValue, q.renderedPlaceholder);
    }
    return [
      this.renderField(0, q.startInputId, q.renderedStartInputValue, q.renderedStartPlaceholder),
      <span key="separator" className={q.cssClasses.rangeSeparator}>{q.rangeSeparatorText}</span>,
      this.renderField(1, q.endInputId, q.renderedEndInputValue, q.renderedEndPlaceholder)
    ];
  }
  protected renderElement(): React.JSX.Element {
    const q = this.question;
    return (
      <div key={q.range ? "range" : "single"} className={q.getRootClass()} ref={(div) => this.setControl(div)}>
        {this.renderFields()}
        {q.isInputReadOnly ? null : <Popup model={q.popupModel}></Popup>}
      </div>
    );
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    const texts = this.getRenderedTexts();
    this.inputs.forEach((input, index) => {
      // The mask writes an entry in progress to the focused input directly; the model gets it on blur.
      const isFocused = !!input && input.ownerDocument.activeElement === input;
      if (!!input && !isFocused && index < texts.length && input.value !== texts[index]) {
        input.value = texts[index];
      }
    });
  }
}

ReactQuestionFactory.Instance.registerQuestion("datetimepicker", (props) => {
  return React.createElement(SurveyQuestionDateTimePicker, props);
});
