import * as React from "react";
import { QuestionCommentModel } from "survey-core";
import { SurveyQuestionUncontrolledElement } from "../../reactquestion_element";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";
import { TextAreaComponent } from "../text-area";

function editorModel(question: QuestionCommentModel): any {
  const host = globalThis as any;
  const Ctor = host.SurveyRichText && host.SurveyRichText.RichTextEditorModel;
  return Ctor ? new Ctor(question) : undefined;
}

export class SurveyQuestionRichTextComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  private model: any;
  private boundQuestion: QuestionCommentModel;
  private hostRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.boundQuestion = props.question;
    this.model = editorModel(props.question);
    this.hostRef = React.createRef();
    if (this.model)this.model.onState = (): void => this.forceUpdate();
  }

  // The property grid keeps this component and swaps the question. The editor follows that question
  // and writes its value into the existing contenteditable, the same way an input gets control.value.
  private bindQuestion(): void {
    const question = this.question;
    if (this.boundQuestion === question) return;
    if (this.model && this.model.dispose)this.model.dispose();
    else if (this.model)this.model.detach();
    this.boundQuestion = question;
    this.model = editorModel(question);
    if (this.model)this.model.onState = (): void => this.forceUpdate();
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.attach();
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    if (this.model && this.model.isAttached && !this.hostRef.current)this.model.detach();
    this.attach();
  }

  componentWillUnmount(): void {
    if (this.model && this.model.dispose)this.model.dispose();
    else if (this.model)this.model.detach();
    super.componentWillUnmount();
  }

  private attach(): void {
    if (this.model && this.hostRef.current && !this.model.isAttached)this.model.attach(this.hostRef.current);
  }

  // Design, display and read-only keep the comment formbox: the value sits in the
  // input, the same element the textarea and the editor use. Putting the HTML on
  // the formbox itself makes that box the flex column and drops the input styles.
  private renderReadOnly(): React.JSX.Element {
    const question = this.question;
    const html = this.model ? this.model.displayHtml : "";
    const area = this.model ? this.model.areaStyle : undefined;
    const style = area ? { minHeight: area.minHeight, height: area.height, overflow: area.overflow } : undefined;
    return (
      <div className={question.getRootClass()}>
        <div
          className={question.getControlClass() + " sd-rich-text__content"}
          style={style}
          data-placeholder={!html && this.model && this.model.placeholder ? this.model.placeholder : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {this.renderCounter()}
      </div>
    );
  }

  private renderCounter(): React.JSX.Element | null {
    return this.question.hasVisibleInputActions
      ? ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.question.inputActionsContainer })
      : null;
  }

  // read / edit / source are different hosts. One shared div keeps the previous node,
  // so a design-mode switch never replaces the contenteditable.
  protected renderElement(): React.JSX.Element {
    this.bindQuestion();
    const question = this.question;
    if (!this.model || !this.model.isEditing) {
      return this.renderReadOnly();
    }
    if (this.model.sourceMode) {
      return (
        <div className="sd-rich-text sd-rich-text--source">
          <div className="sd-rich-text__notice">{this.model.sourceNotice}</div>
          <button type="button" className="sd-rich-text__edit-anyway" onClick={() => this.model.editAnyway()}>{this.model.editAnywayLabel}</button>
          {React.createElement(TextAreaComponent, { viewModel: question.textAreaModel })}
        </div>
      );
    }
    const toolbarMode = this.model.toolbarMode || "onFocus";
    // "static" has no layout yet, so it keeps the floating on-focus toolbar.
    const toolbarClass = "sd-rich-text--toolbar-" + String(toolbarMode).replace(/[A-Z]/g, (letter: string) => "-" + letter.toLowerCase());
    const openClass = toolbarMode === "onSelection" && this.model.toolbarOpen ? " sd-rich-text--toolbar-open" : "";
    return (
      <div className={question.getRootClass() + " sd-rich-text " + toolbarClass + openClass}>
        <div
          ref={this.hostRef}
          className={question.getControlClass() + " sd-rich-text__area"}
          contentEditable={true}
          role="textbox"
          aria-multiline={this.model.mode === "block" ? true : undefined}
          aria-label={question.a11y_input_ariaLabel}
          aria-labelledby={question.a11y_input_ariaLabelledBy}
          aria-describedby={question.a11y_input_ariaDescribedBy}
          aria-required={question.a11y_input_ariaRequired}
          aria-invalid={question.a11y_input_ariaInvalid}
          aria-errormessage={question.a11y_input_ariaErrormessage}
          data-placeholder={this.model.placeholder || undefined}
          suppressContentEditableWarning={true}
          id={question.inputId}
          style={this.model.areaStyle}
        />
        {this.renderCounter()}
        {this.model.hasToolbar ? (
          <div className="sd-rich-text__toolbar" role="toolbar" aria-label={this.model.toolbarLabel} aria-controls={question.inputId}>
            {ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.model.toolbar })}
          </div>
        ) : null}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-rich-text-comment", (props) => {
  return React.createElement(SurveyQuestionRichTextComment, props);
});
