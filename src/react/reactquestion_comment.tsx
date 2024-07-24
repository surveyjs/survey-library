import * as React from "react";
import { ReactSurveyElement, SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionCommentModel, Helpers, TextAreaViewModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { CharacterCounterComponent } from "./components/character-counter";
import { TextAreaComponent } from "./components/textarea";

export class SurveyQuestionComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  private renderCharacterCounter() : JSX.Element | null {
    let counter = null;
    if(!!this.question.getMaxLength()) {
      <CharacterCounterComponent
        counter={this.question.characterCounter}
        remainingCharacterCounter={this.question.cssClasses.remainingCharacterCounter}>
      </CharacterCounterComponent>;
    }
    return counter;
  }
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }

    const onBlur: ((e: any) => void) | undefined = !this.question.isInputTextUpdate ? this.updateValueOnEvent : undefined;
    const onInput = (event: any) => {
      if (this.question.isInputTextUpdate) {
        this.updateValueOnEvent(event);
      } else {
        this.question.updateElement();
      }

      const newValue = event.target.value;
      this.question.updateRemainingCharacterCounter(newValue);
    };

    let counter = this.renderCharacterCounter();

    const textAreaOptions: TextAreaViewModel = this.props.question.getTextArea();
    /*{
      question: this.question,
      id: this.question.inputId,
      className: this.question.className,
      isDisabledAttr: this.question.isDisabledAttr,
      isReadOnlyAttr: this.question.isReadOnlyAttr,
      placeholder: this.question.renderedPlaceholder,
      maxLength: this.question.getMaxLength(),
      rows: this.question.rows,
      cols: this.question.cols,
      onTextAreaChange: onBlur,
      onTextAreaInput: onInput,
      onTextAreaKeyDown: (event) => { this.question.onKeyDown(event); }
    };*/

    return (
      <>
        <TextAreaComponent viewModelOptions={textAreaOptions}></TextAreaComponent>
        {counter}
      </>
    /* <textarea
          id={this.question.inputId}
          className={this.question.className}
          disabled={this.question.isDisabledAttr}
          readOnly={this.question.isReadOnlyAttr}
          ref={(textarea) => (this.setControl(textarea))}
          maxLength={this.question.getMaxLength()}
          placeholder={placeholder}
          onBlur={onBlur}
          onInput={onInput}
          onKeyDown={(event) => { this.question.onKeyDown(event); }}
          cols={this.question.cols}
          rows={this.question.rows}

          aria-required={this.question.a11y_input_ariaRequired}
          aria-label={this.question.a11y_input_ariaLabel}

          aria-labelledby={this.question.a11y_input_ariaLabelledBy}
          aria-describedby={this.question.a11y_input_ariaDescribedBy}
          aria-invalid={this.question.a11y_input_ariaInvalid}
          aria-errormessage={this.question.a11y_input_ariaErrormessage}
          style={{ resize: this.question.resizeStyle }}
          */
    );
  }
}

export class SurveyQuestionCommentItem extends ReactSurveyElement {
  private control: HTMLElement;
  private textAreaOptions: TextAreaViewModel;

  constructor(props: any) {
    super(props);
    this.textAreaOptions = this.getTextArea();
    this.state = { comment: this.textAreaOptions.getTextValue() || "" };
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.updateDomElement();
  }
  protected updateDomElement(): void {
    if (!!this.control) {
      const control: any = this.control;
      const newValue = this.textAreaOptions.getTextValue() || "";
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = newValue;
      }
    }
  }
  protected setControl(element: HTMLElement | null): void {
    if(!!element) {
      this.control = element;
    }
  }
  protected canRender(): boolean {
    return !!this.props.question;
  }

  protected getTextArea(): TextAreaViewModel {
    return this.props.question.getCommentTextArea();
  }
  protected renderElement(): JSX.Element {
    const question = this.props.question;
    if (question.isReadOnlyRenderDiv()) {
      const comment = this.textAreaOptions.getTextValue() || "";
      return <div>{comment}</div>;
    }

    return (
      <TextAreaComponent viewModelOptions={this.textAreaOptions}></TextAreaComponent>
      /*
      <textarea
        id={this.getId()}
        className={className}
        ref={(textarea) => (this.setControl(textarea))}
        disabled={this.isDisplayMode}
        maxLength={question.getOthersMaxLength()}
        rows={question.commentAreaRows}
        placeholder={this.getPlaceholder()}
        onBlur={(e) => { this.onCommentChange(e); }}
        onInput={(e) => this.onCommentInput(e)}
        aria-required={question.ariaRequired || question.a11y_input_ariaRequired}
        aria-label={question.ariaLabel || question.a11y_input_ariaLabel}
        style={{ resize: question.resizeStyle }}
      />
      */
    );
  }
}
export class SurveyQuestionOtherValueItem extends SurveyQuestionCommentItem {
  protected getTextArea(): TextAreaViewModel {
    return this.props.question.getOtherTextArea();
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
