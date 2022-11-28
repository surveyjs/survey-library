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
  protected renderElement(): JSX.Element {
    let question = this.props.question;
    let className = this.props.otherCss || this.cssClasses.comment;
    let handleOnChange = (event: any) => {
      this.setState({ comment: event.target.value });
      question.onCommentChange(event);
    };
    let stateComment: string = !!this.state ? this.state.comment : undefined;
    if(stateComment !== undefined && stateComment.trim() !== question.comment) {
      stateComment = question.comment;
    }
    let comment = stateComment !== undefined ? stateComment : question.comment || "";

    if (question.isReadOnlyRenderDiv()) {
      return <div>{comment}</div>;
    }
    return (
      <textarea
        className={className}
        value={comment}
        disabled={this.isDisplayMode}
        maxLength={question.getOthersMaxLength()}
        placeholder={question.commentOrOtherPlaceholder}
        onChange={handleOnChange}
        onBlur={(e) => { question.onCommentChange(e); handleOnChange(e); } }
        onInput={(e) => question.onCommentInput(e)}
        aria-required={question.isRequired}
        aria-label={question.locTitle.renderedHtml}
        style={{ resize: question.resizeStyle }}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
  return React.createElement(SurveyQuestionComment, props);
});
