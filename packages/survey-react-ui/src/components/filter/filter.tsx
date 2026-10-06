// Prototype for the #11890 showcase. The control is standard SurveyJS parts: the presets, Save, Clear,
// the field badges, the Clear in a badge's popup and Advanced are actions the question owns (survey-core's
// filter-toolbars.ts), drawn with sv-action-bar; the search box is drawn the way a text question's
// input is. This file only lays the parts out and renders the editor a badge popup or the advanced
// dialog holds - the popups, the dialog and the editors themselves live in survey-core.
import * as React from "react";
import { Base, Question, QuestionFilterModel, FilterConditionsEditor, FilterEditorHolder, SurveyError, SurveyModel,
  filterUIStrings, filterEditorComponentName } from "survey-core";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase, SurveyQuestionElementBase } from "../../reactquestion_element";
import { ISurveyCreator } from "../../reactquestion";
import { SurveyPage } from "../../page";
import { SurveyActionBar } from "../action-bar/action-bar";

const rootStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sjs2-spacing-x150, 12px)" };
// No overflow clipping: the editor's own dropdowns open their lists inline, inside this box.
const editorStyle: React.CSSProperties = { minWidth: "320px", padding: "12px 16px" };
// The editor's page has no bottom gutter of its own (see editorCss), so the bar under it keeps the
// same distance the control keeps between its rows.
const editorActionsStyle: React.CSSProperties = { marginTop: "var(--sjs2-spacing-x150, 12px)" };
// The editor survey's page and panels are drawn with the theme's survey chrome: a page gutter and a
// framed card per field. Inside a popup that is only empty space, so it is taken off here, scoped to
// the editor - a prototype stand-in for the rules the theme will get once there is a design. A field's
// title (advanced mode) is a plain label over its operator and value: without the card it would keep
// the card's inset and the rule under it would touch the field's first input.
const editorClassName = "sv-filter-conditions-editor";
const editorCss = [
  "." + editorClassName + " .sd-page__content { padding: 0; }",
  "." + editorClassName + " .sd-panel.sd-element--with-frame { box-shadow: none; background: transparent; border-radius: 0; }",
  "." + editorClassName + " .sd-panel { --sd-panel-header-border-bottom: none; --sd-panel-header-padding-inline: 0; --sd-panel-title-padding-inline: 0; }",
  "." + editorClassName + " .sd-panel__content { padding: 0; }"
].join(" ");

// The editor survey is rendered as a page, not as a whole Survey (a Survey inside another survey's
// question would put a <form> inside a <form>), so what the Survey component would answer for its
// questions is answered here, from the editor survey itself.
class FilterEditorCreator implements ISurveyCreator {
  constructor(private survey: SurveyModel) {
  }
  public createQuestionElement(question: Question): React.JSX.Element | null {
    return ReactQuestionFactory.Instance.createQuestion(question.isDefaultRendering() ? question.getTemplate() : question.getComponentName(),
      { question: question, isDisplayMode: question.isInputReadOnly, creator: this });
  }
  public renderError(key: string, error: SurveyError, cssClasses: any, element?: any): React.JSX.Element {
    return ReactElementFactory.Instance.createElement(this.survey.questionErrorComponent, { key: key, error, cssClasses, element });
  }
  public questionTitleLocation(): string {
    return this.survey.questionTitleLocation;
  }
  public questionErrorLocation(): string {
    return this.survey.questionErrorLocation;
  }
}

// The content of a badge popup and of the advanced dialog: the page of the editor its holder holds.
// It watches the holder, so an emptied holder unmounts the page before survey-core disposes the
// editor. An empty holder renders nothing.
export class SurveyFilterConditionsEditor extends SurveyElementBase<{ holder: FilterEditorHolder }, any> {
  private rootRef: React.RefObject<HTMLDivElement> = React.createRef();
  private creator: FilterEditorCreator;
  private creatorSurvey: SurveyModel;
  // The holder's actions come and go with the field's condition while the popup is open.
  protected getStateElements(): Array<Base> {
    const holder = this.props.holder;
    if (!holder) return [];
    return !!holder.actions ? [holder, holder.actions] : [holder];
  }
  private get editor(): FilterConditionsEditor {
    return !!this.props.holder ? this.props.holder.editor : undefined;
  }
  private getCreator(survey: SurveyModel): FilterEditorCreator {
    if (this.creatorSurvey !== survey) {
      this.creator = new FilterEditorCreator(survey);
      this.creatorSurvey = survey;
    }
    return this.creator;
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.updateRootElement();
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.updateRootElement();
  }
  // The Survey component would set this; a page rendered on its own leaves it to its host.
  private updateRootElement(): void {
    const editor = this.editor;
    if (!!editor && !editor.isDisposed && !!this.rootRef.current) {
      editor.survey.rootElement = this.rootRef.current;
    }
  }
  protected renderElement(): React.JSX.Element | null {
    const editor = this.editor;
    if (!editor || editor.isDisposed) return null;
    const survey = editor.survey;
    // Only the dialog says it: over a preset with no conditions to show, applying starts a new filter.
    const note = this.props.holder.isAdvanced && editor.isRawExpression
      ? <div className={survey.css.question.description}>{filterUIStrings.rawNote}</div> : null;
    const holderActions = this.props.holder.actions;
    const actions = !!holderActions && holderActions.hasVisibleActions ? <div style={editorActionsStyle}><SurveyActionBar model={holderActions} /></div> : null;
    return <div className={editorClassName} style={editorStyle} ref={this.rootRef}>
      <style>{editorCss}</style>
      {note}
      <SurveyPage survey={survey} page={survey.currentPage} css={survey.css} creator={this.getCreator(survey)} />
      {actions}
    </div>;
  }
}
ReactElementFactory.Instance.registerElement(filterEditorComponentName,
  (props) => { return React.createElement(SurveyFilterConditionsEditor, props); });

export class SurveyQuestionFilter extends SurveyQuestionElementBase {
  protected get question(): QuestionFilterModel {
    return this.questionBase as QuestionFilterModel;
  }
  // The presets row is rendered only while it has something to show, and the container learns that
  // on its own time (its updates run after it is mounted), so it is watched along with the question.
  protected getStateElements(): Array<Base> {
    const q = this.question;
    return !!q ? [q, q.itemsToolbar] : [];
  }
  private renderSearch(): React.JSX.Element | null {
    const q = this.question;
    if (!q.showSearch) return null;
    const css = q.searchCss;
    return <div className={css.root}>
      <input type="text" className={css.control} value={q.searchString} placeholder={q.searchPlaceholder}
        aria-label={filterUIStrings.searchLabel} disabled={q.isDesignMode}
        onChange={(e) => { q.searchString = e.target.value; }} />
    </div>;
  }
  protected renderElement(): React.JSX.Element {
    const q = this.question;
    // With no presets to show the row is empty - Save and Clear are in the fields row then - and it is
    // left out, gap and all.
    const items = q.itemsToolbar.hasVisibleActions ? <SurveyActionBar model={q.itemsToolbar} /> : null;
    const note = !!q.noteText ? <div className={q.cssClasses.description}>{q.noteText}</div> : null;
    return <div style={rootStyle}>
      {this.renderSearch()}
      {items}
      {note}
      <SurveyActionBar model={q.fieldsToolbar} />
    </div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("filter",
  (props) => { return React.createElement(SurveyQuestionFilter, props); });
