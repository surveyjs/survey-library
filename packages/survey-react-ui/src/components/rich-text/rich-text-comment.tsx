import * as React from "react";
import { QuestionCommentModel, ResizeManager } from "survey-core";
import { SurveyQuestionUncontrolledElement } from "../../reactquestion_element";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";
import { TextAreaComponent } from "../text-area";
import { SvgIcon } from "../svg-icon/svg-icon";

function editorModel(question: QuestionCommentModel): any {
  const host = globalThis as any;
  const Ctor = host.SurveyRichText && host.SurveyRichText.RichTextEditorModel;
  return Ctor ? new Ctor(question) : undefined;
}

export class SurveyQuestionRichTextComment extends SurveyQuestionUncontrolledElement<QuestionCommentModel> {
  private model: any;
  private boundQuestion: QuestionCommentModel;
  private hostRef: React.RefObject<HTMLDivElement>;
  private gripRef: React.RefObject<HTMLDivElement>;
  private resizeManager: ResizeManager;
  private resizeTarget: HTMLElement;

  constructor(props: any) {
    super(props);
    this.boundQuestion = props.question;
    this.model = editorModel(props.question);
    this.hostRef = React.createRef();
    this.gripRef = React.createRef();
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
    this.updateSizer();
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    if (this.model && this.model.isAttached && !this.hostRef.current)this.model.detach();
    this.attach();
    this.updateSizer();
  }

  componentWillUnmount(): void {
    this.disposeSizer();
    if (this.model && this.model.dispose)this.model.dispose();
    else if (this.model)this.model.detach();
    super.componentWillUnmount();
  }

  private attach(): void {
    if (this.model && this.hostRef.current && !this.model.isAttached)this.model.attach(this.hostRef.current);
  }

  // The comment's grip. It changes the height of the editing area and leaves the width alone.
  private updateSizer(): void {
    const question = this.question;
    const grip = this.gripRef.current;
    const target = this.hostRef.current;
    if (question.resizeStyle === "none" || !grip || !target) {
      this.disposeSizer();
      return;
    }
    if (this.resizeManager && this.resizeTarget === target) return;
    this.disposeSizer();
    this.resizeTarget = target;
    this.resizeManager = new ResizeManager(grip, target, "vertical");
  }

  private disposeSizer(): void {
    if (this.resizeManager)this.resizeManager.dispose();
    this.resizeManager = undefined;
    this.resizeTarget = undefined;
  }

  private renderSizer(): React.JSX.Element | null {
    const question = this.question;
    if (question.resizeStyle === "none") return null;
    return (
      <div className={question.cssClasses.grip} ref={this.gripRef}>
        <SvgIcon iconName={question.cssClasses.gripIconId} size={"auto"}></SvgIcon>
      </div>
    );
  }

  // Design, display and read-only keep the comment formbox: the value sits in the
  // input, the same element the textarea and the editor use. Putting the HTML on
  // the formbox itself makes that box the flex column and drops the input styles.
  private classes(...names: Array<string | undefined | false>): string {
    return names.filter(name => !!name).join(" ");
  }

  private toolbarModifierClass(): string {
    const css = this.question.cssClasses;
    const mode = this.model && this.model.toolbarMode ? this.model.toolbarMode : "static";
    if (mode === "none") return css.toolbarNone;
    if (mode === "onSelection") return css.toolbarOnSelection;
    if (mode === "onFocus") return css.toolbarOnFocus;
    return css.toolbarStatic;
  }

  private renderReadOnly(): React.JSX.Element {
    const question = this.question;
    const css = question.cssClasses;
    const html = this.model ? this.model.displayHtml : "";
    const area = this.model ? this.model.areaStyle : undefined;
    const style = area ? { minHeight: area.minHeight, height: area.height, overflow: area.overflow } : undefined;
    return (
      <div className={question.getRootClass()}>
        <div
          className={this.classes(question.getControlClass(), css.display)}
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

  private renderToolbar(floating: boolean): React.JSX.Element {
    const bar = ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.model.toolbar });
    if (!floating) return bar;
    const question = this.question;
    return (
      <div className={question.cssClasses.toolbar} role="toolbar" aria-label={this.model.toolbarLabel} aria-controls={question.inputId}>
        {bar}
      </div>
    );
  }

  // Static mode is an action bar in the comment footer: formatting on the left, the question's
  // input actions (character counter, reset) on the right. It does not use the floating toolbar box.
  private renderFooter(): React.JSX.Element {
    const question = this.question;
    const css = question.cssClasses;
    return (
      <div className={css.footer} role="toolbar" aria-label={this.model.toolbarLabel} aria-controls={question.inputId}>
        {this.renderToolbar(false)}
        {question.hasVisibleInputActions ? <div className={css.footerSpace} /> : null}
        {this.renderCounter()}
      </div>
    );
  }

  // read / edit / source are different hosts. One shared div keeps the previous node,
  // so a design-mode switch never replaces the contenteditable.
  protected renderElement(): React.JSX.Element {
    this.bindQuestion();
    const question = this.question;
    if (!this.model || !this.model.isEditing) {
      return this.renderReadOnly();
    }
    const css = question.cssClasses;
    if (this.model.sourceMode) {
      return (
        <div className={css.source}>
          <div className={css.notice}>{this.model.sourceNotice}</div>
          <button type="button" className={css.editAnyway} onClick={() => this.model.editAnyway()}>{this.model.editAnywayLabel}</button>
          {React.createElement(TextAreaComponent, { viewModel: question.textAreaModel })}
        </div>
      );
    }
    const toolbarMode = this.model.toolbarMode || "static";
    const openClass = toolbarMode === "onSelection" && this.model.toolbarOpen ? css.toolbarOpen : "";
    const staticToolbar = toolbarMode === "static";
    return (
      <div className={this.classes(question.getRootClass(), css.editor, this.toolbarModifierClass(), openClass)}>
        <div
          ref={this.hostRef}
          className={this.classes(question.getControlClass(), css.area)}
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
        {staticToolbar ? this.renderFooter() : this.renderCounter()}
        {!staticToolbar && this.model.hasToolbar ? this.renderToolbar(true) : null}
        {this.renderSizer()}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-rich-text", (props) => {
  return React.createElement(SurveyQuestionRichTextComment, props);
});
