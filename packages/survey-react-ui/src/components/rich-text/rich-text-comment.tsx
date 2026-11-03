import * as React from "react";
import { QuestionCommentModel } from "survey-core";
import { getRichTextString, RichText, RichTextEditorModel } from "survey-core/rich-text";
import { SurveyQuestionUncontrolledElement } from "../../reactquestion_element";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { SurveyActionBar } from "../action-bar/action-bar";

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
        aria-multiline={this.props.block}
        aria-label={question.a11y_input_ariaLabel}
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
      owner: question
    });
  }

  public componentDidMount(): void {
    super.componentDidMount();
    if (this.hostRef.current) this.editor.attach(this.hostRef.current);
  }

  public componentWillUnmount(): void {
    this.editor.detach();
    super.componentWillUnmount();
  }

  protected renderElement(): React.JSX.Element {
    const question = this.question;
    if (question.isInputReadOnly) return this.renderReadOnly();
    const block = this.editor.mode === "block";
    return (
      <div className="sd-rich-text">
        <div className="sd-rich-text__toolbar" role="toolbar" aria-label={getRichTextString("richTextToolbar")} aria-controls={question.inputId}>
          <SurveyActionBar model={this.editor.toolbar} />
        </div>
        <div className="sd-comment sd-formbox">
          <RichTextSurface hostRef={this.hostRef} question={question} block={block} />
        </div>
      </div>
    );
  }

  private renderReadOnly(): React.JSX.Element {
    const question = this.question;
    const value = question.value || "";
    const format = question.textFormat === "html" ? "html" : "markdown";
    const html = value ? RichText.getFormat(format).toHtml(value, { inline: this.editor.mode === "inline", element: question, name: "value" }) : "";
    if (!html) return <div className="sd-comment">{value}</div>;
    return <div className={"sd-comment " + (question.viewModeCssClass || "")} dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-rich-text-comment", (props) => {
  return React.createElement(SurveyQuestionRichTextComment, props);
});
