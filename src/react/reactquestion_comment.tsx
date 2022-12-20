import * as React from "react";
import { ReactSurveyElement, SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionCommentModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    var onBlur:((e: any) => void) | undefined = !this.question.isInputTextUpdate ? this.updateValueOnEvent : undefined;
    var onInput = (event: any) => {
      if (this.question.isInputTextUpdate)
        this.updateValueOnEvent(event);
      else
        this.question.updateElement();
    };
    const placeholder = this.question.renderedPlaceholder;
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }
    return (
      <textarea
        id={this.question.inputId}
        className={this.question.className}
        disabled={ this.question.isInputReadOnly }
        readOnly={ this.question.isInputReadOnly }
        ref={(textarea) => (this.setControl(textarea))}
        maxLength={this.question.getMaxLength()}
        placeholder={placeholder}
        onBlur={onBlur}
        onInput={onInput}
        onKeyDown={(event) => { this.question.onKeyDown(event); }}
        cols={this.question.cols}
        rows={this.question.rows}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
        style={{ resize: this.question.resizeStyle }}
      />
    );
  }
}

export class SurveyQuestionCommentItem extends ReactSurveyElement {
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
  protected getId(): string {
    return this.props.question.commentId;
  }
  protected renderElement(): JSX.Element {
    let question = this.props.question;
    let className = this.props.otherCss || this.cssClasses.comment;
    let handleOnChange = (event: any) => {
      this.setState({ comment: event.target.value });
      this.onCommentChange(event);
    };
    const questionComment = this.getComment();
    let stateComment: string = !!this.state ? this.state.comment : undefined;
    if(stateComment !== undefined && stateComment.trim() !== questionComment) {
      stateComment = questionComment;
    }
    let comment = stateComment !== undefined ? stateComment : questionComment || "";

    if (question.isReadOnlyRenderDiv()) {
      return <div>{comment}</div>;
    }
    return (
      <textarea
        id={this.getId()}
        className={className}
        value={comment}
        disabled={this.isDisplayMode}
        maxLength={question.getOthersMaxLength()}
        placeholder={question.commentOrOtherPlaceholder}
        onChange={handleOnChange}
        onBlur={(e) => { this.onCommentChange(e); handleOnChange(e); } }
        onInput={(e) => this.onCommentInput(e)}
        aria-required={question.isRequired}
        aria-label={question.locTitle.renderedHtml}
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
  protected getId(): string {
    return this.props.question.commentId;
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
