import * as React from "react";
import { ReactSurveyElement, SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionCommentModel, Helpers } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { CharacterCounterComponent } from "./components/character-counter";

export class SurveyQuestionComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
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
    const placeholder = this.question.renderedPlaceholder;
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }
    const counter = !!this.question.getMaxLength() ? (<CharacterCounterComponent counter={this.question.characterCounter} remainingCharacterCounter={this.question.cssClasses.remainingCharacterCounter}></CharacterCounterComponent>) : null;
    return (
      <>
        <textarea
          id={this.question.inputId}
          className={this.question.className}
          disabled={this.question.isInputReadOnly}
          readOnly={this.question.isInputReadOnly}
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
        />
        {counter}
      </>
    );
  }
}

export class SurveyQuestionCommentItem extends ReactSurveyElement {
  private control: HTMLElement;
  constructor(props: any) {
    super(props);
    this.state = { comment: this.getComment() || "" };
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
      const newValue = this.getComment() || "";
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
  protected onCommentChange(event: any): void {
    this.props.question.onCommentChange(event);
  }
  protected onCommentInput(event: any): void {
    this.props.question.onCommentInput(event);
  }
  protected getComment(): string {
    return this.props.question.comment;
  }
  protected setComment(value: any): void {
    this.props.question.comment = value;
  }
  protected getId(): string {
    return this.props.question.commentId;
  }
  protected getPlaceholder(): string {
    return this.props.question.renderedCommentPlaceholder;
  }
  protected renderElement(): JSX.Element {
    const question = this.props.question;
    let className = this.props.otherCss || this.cssClasses.comment;
    if (question.isReadOnlyRenderDiv()) {
      const comment = this.getComment() || "";
      return <div>{comment}</div>;
    }
    return (
      <textarea
        id={this.getId()}
        className={className}
        ref={(textarea) => (this.setControl(textarea))}
        disabled={this.isDisplayMode}
        maxLength={question.getOthersMaxLength()}
        placeholder={this.getPlaceholder()}
        onBlur={(e) => { this.onCommentChange(e); }}
        onInput={(e) => this.onCommentInput(e)}
        aria-required={question.isRequired || question.a11y_input_ariaRequired}
        aria-label={question.ariaLabel || question.a11y_input_ariaLabel}
        style={{ resize: question.resizeStyle }}
      />
    );
  }
}
export class SurveyQuestionOtherValueItem extends SurveyQuestionCommentItem {
  protected onCommentChange(event: any): void {
    this.props.question.onOtherValueChange(event);
  }
  protected onCommentInput(event: any): void {
    this.props.question.onOtherValueInput(event);
  }
  protected getComment(): string {
    return this.props.question.otherValue;
  }
  protected setComment(value: any): void {
    this.props.question.otherValue = value;
  }
  protected getId(): string {
    return this.props.question.otherId;
  }
  protected getPlaceholder(): string {
    return this.props.question.otherPlaceholder;
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
