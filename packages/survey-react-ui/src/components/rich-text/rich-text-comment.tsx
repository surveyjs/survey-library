import * as React from "react";
import { QuestionCommentModel } from "survey-core";
import { getRichTextString, RichTextEditorModel } from "survey-core/rich-text";
import { SurveyQuestionUncontrolledElement } from "../../reactquestion_element";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { SurveyActionBar } from "../action-bar/action-bar";
import { TextAreaComponent } from "../text-area";

class RichTextSurface extends React.Component<{ hostRef: React.RefObject<HTMLDivElement>, question: QuestionCommentModel, block: boolean }> {
  public shouldComponentUpdate(): boolean {
    return false;
  }
  public render(): React.JSX.Element {
    const question = this.props.question;
    return (
      <div
        ref={this.props.hostRef}
        className="sd-comment__input sd-formbox__input sd-rich-text__area"
        contentEditable
        role="textbox"
        aria-multiline={this.props.block ? true : undefined}
        aria-label={question.a11y_input_ariaLabel}
        aria-labelledby={question.a11y_input_ariaLabelledBy}
        aria-describedby={question.a11y_input_ariaDescribedBy}
        aria-required={question.a11y_input_ariaRequired}
        aria-invalid={question.a11y_input_ariaInvalid}
        aria-errormessage={question.a11y_input_ariaErrormessage}
        id={question.inputId}
        suppressContentEditableWarning
      />
    );
  }
}

export class SurveyQuestionRichTextComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  private editor: RichTextEditorModel;
  private hostRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: any) {
    super(props);
    const question = this.question;
    this.editor = new RichTextEditorModel({
      getValue: () => question.value || "",
      setValue: (value: string) => { question.value = value; },
      get isInputTextUpdate() { return question.isInputTextUpdate; },
      get acceptCarriageReturn() { return question.acceptCarriageReturn !== false; },
      get mode() { return question.acceptCarriageReturn === false ? "inline" : ((question as any).richTextEditMode === "inline" ? "inline" : "block"); },
      get format() { return question.textFormat === "html" ? "html" : "markdown"; },
      get converter() { return (question as any).richTextConverter; },
      get maxLength() { return question.getMaxLength(); },
      get placeholder() { return question.renderedPlaceholder || ""; },
      get rows() { return question.rows || 4; },
      get autoGrow() { return question.renderedAutoGrow; },
      get allowResize() { return question.renderedAllowResize; },
      onDraft: (source: string) => question.updateRemainingCharacterCounter(source),
      onSourceMode: (sourceMode: boolean) => question.setPropertyValue("richTextSourceMode", sourceMode),
      owner: question
    });
  }

  public componentDidMount(): void {
    super.componentDidMount();
    this.syncHost();
  }

  public componentDidUpdate(): void {
    this.syncHost();
    this.editor.notifyExternalValue(this.question.value || "");
  }

  public componentWillUnmount(): void {
    this.editor.detach();
    super.componentWillUnmount();
  }

  private syncHost(): void {
    const host = this.hostRef.current;
    if (host && !this.editor.isAttached) this.editor.attach(host);
    if (!host && this.editor.isAttached) this.editor.detach();
  }

  protected renderElement(): React.JSX.Element {
    const question = this.question;
    if (question.isInputReadOnly) return this.renderReadOnly();
    if (question.getPropertyValue("richTextSourceMode")) return this.renderSource();
    const block = this.editor.mode === "block";
    return (
      <div className="sd-rich-text">
        <div className="sd-comment sd-formbox">
          <RichTextSurface hostRef={this.hostRef} question={question} block={block} />
          {question.hasVisibleInputActions ? <SurveyActionBar model={question.inputActionsContainer} /> : null}
        </div>
        <div className="sd-rich-text__toolbar" role="toolbar" aria-label={getRichTextString("richTextToolbar")} aria-controls={question.inputId}>
          <SurveyActionBar model={this.editor.toolbar} />
        </div>
      </div>
    );
  }

  private renderSource(): React.JSX.Element {
    return (
      <div className="sd-rich-text sd-rich-text--source">
        <div className="sd-rich-text__notice">{getRichTextString("richTextSourceMode")}</div>
        <button type="button" className="sd-rich-text__edit-anyway" onClick={() => this.editor.editAnyway()}>
          {getRichTextString("richTextEditAnyway")}
        </button>
        <TextAreaComponent viewModel={this.question.textAreaModel} />
      </div>
    );
  }

  private renderReadOnly(): React.JSX.Element {
    const question = this.question;
    const value = question.value || "";
    const html = this.editor.getReadOnlyHtml(value);
    if (!html) return <div className="sd-comment">{value}</div>;
    return <div className={"sd-comment " + (question.viewModeCssClass || "")} dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-rich-text-comment", (props) => {
  return React.createElement(SurveyQuestionRichTextComment, props);
});
