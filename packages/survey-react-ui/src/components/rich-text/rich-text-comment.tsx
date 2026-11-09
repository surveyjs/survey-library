import * as React from "react";
import { QuestionCommentModel } from "survey-core";
import { SurveyQuestionUncontrolledElement } from "../../reactquestion_element";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";

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
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.attach();
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.attach();
  }

  componentWillUnmount(): void {
    if (this.model)this.model.detach();
    super.componentWillUnmount();
  }

  private attach(): void {
    if (this.model && this.hostRef.current && !this.model.isAttached)this.model.attach(this.hostRef.current);
  }

  protected renderElement(): React.JSX.Element {
    const question = this.question;
    if (!this.model || !this.model.isEditing) {
      const html = this.model ? this.model.displayHtml : "";
      return <div className="sd-rich-text__content" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return (
      <div className={question.getRootClass() + " sd-rich-text"}>
        <div
          ref={this.hostRef}
          className={question.getControlClass() + " sd-rich-text__area"}
          contentEditable={true}
          role="textbox"
          aria-multiline={this.model.mode === "block"}
          suppressContentEditableWarning={true}
          id={question.inputId}
          style={{ minHeight: ((question.rows || 4) * 1.5) + "em" }}
        />
        <div className="sd-rich-text__toolbar" role="toolbar" aria-label="Formatting" aria-controls={question.inputId}>
          {ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.model.toolbar })}
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-rich-text-comment", (props) => {
  return React.createElement(SurveyQuestionRichTextComment, props);
});
