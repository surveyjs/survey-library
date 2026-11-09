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
  private hostRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.model = editorModel(props.question);
    this.hostRef = React.createRef();
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

  protected renderElement(): React.JSX.Element {
    const question = this.question;
    if (!this.model || !this.model.isEditing) {
      const html = this.model ? this.model.displayHtml : "";
      return <div className={question.getRootClass() + " sd-rich-text__content"} dangerouslySetInnerHTML={{ __html: html }} />;
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
    const counter = question.hasVisibleInputActions
      ? ReactElementFactory.Instance.createElement("sv-action-bar", { model: question.inputActionsContainer })
      : null;
    return (
      <div className={question.getRootClass() + " sd-rich-text"}>
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
        {counter}
        <div className="sd-rich-text__toolbar" role="toolbar" aria-label={this.model.toolbarLabel} aria-controls={question.inputId}>
          {ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.model.toolbar })}
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-rich-text-comment", (props) => {
  return React.createElement(SurveyQuestionRichTextComment, props);
});
