// Prototype for the #11890 showcase: the shipping filter UI will replace this file. The styles are
// inline objects and the labels are hard-coded English on purpose - there is no design and no
// localized string for the control's buttons yet, and a half-guessed CSS class in the theme is
// harder to delete than a style object here. The question answers everything the control shows
// (a badge's text, which preset is on, whether there is anything to clear or save): nothing here
// computes filter state of its own.
import * as React from "react";
import { Base, PopupModel, PopupBaseViewModel, QuestionFilterModel, FilterConditionsEditor, FilterItem, settings } from "survey-core";
import type { IDialogOptions, IDynamicDataFilterField } from "survey-core";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase, SurveyQuestionElementBase } from "../../reactquestion_element";
import { ISurveyCreator } from "../../reactquestion";
import { SurveyPage } from "../../page";
import { Popup } from "../popup/popup";

const rootStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" };
const rowStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" };
const chipStyle: React.CSSProperties = {
  padding: "2px 10px", border: "1px solid #ccc", borderRadius: "12px", background: "#fff", cursor: "pointer", lineHeight: "20px"
};
const activeChipStyle: React.CSSProperties = { ...chipStyle, background: "#19b394", borderColor: "#19b394", color: "#fff" };
const badgeStyle: React.CSSProperties = {
  ...chipStyle, borderRadius: "4px", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
};
const setBadgeStyle: React.CSSProperties = { ...badgeStyle, borderColor: "#19b394", fontWeight: 600 };
const buttonStyle: React.CSSProperties = {
  padding: "2px 8px", border: "1px solid #ccc", borderRadius: "3px", background: "#fff", cursor: "pointer", lineHeight: "20px"
};
const clearButtonStyle: React.CSSProperties = { border: "none", background: "transparent", cursor: "pointer", padding: "0 4px" };
const badgeGroupStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center" };
const searchStyle: React.CSSProperties = { maxWidth: "360px", padding: "4px 8px", border: "1px solid #ccc", borderRadius: "3px" };
const noteStyle: React.CSSProperties = { color: "#888" };
// No overflow clipping: the editor's own dropdowns open their lists inline, inside this box.
const editorStyle: React.CSSProperties = { minWidth: "320px", padding: "12px 16px" };
// The editor survey's page and panels are drawn with the theme's survey chrome: a page gutter and a
// framed card per field. Inside a popup that is only empty space, so it is taken off here, scoped to
// the editor - a prototype stand-in for the rules the theme will get once there is a design.
const editorClassName = "sv-filter-conditions-editor";
const editorCss = [
  "." + editorClassName + " .sd-page__content { padding: 0; }",
  "." + editorClassName + " .sd-panel.sd-element--with-frame { box-shadow: none; background: transparent; border-radius: 0; }",
  "." + editorClassName + " .sd-panel__content { padding: 0; }"
].join(" ");
// The eslint i18n rule rejects non-ASCII source characters, so the glyphs are built from their codes.
const clearGlyph = String.fromCharCode(0x00D7);
const openGlyph = String.fromCharCode(0x25BE);

// What a popup's content shows, held as a model of its own. A popup does not re-render its content
// when the content data changes, so the content watches this slot instead - and the slot can be
// emptied, unmounting the editor's page, before the editor itself is disposed.
export class FilterEditorSlot extends Base {
  public getType(): string { return "filtereditorslot"; }
  public get editor(): FilterConditionsEditor { return this.getPropertyValue("editor"); }
  public set editor(val: FilterConditionsEditor) { this.setPropertyValue("editor", val); }
}

// The popup content: the editor survey's page, not a whole survey, the way Creator's embeddedsurvey
// question shows its editor surveys - a Survey inside another survey's question would put a <form>
// inside a <form> and bring its own background. creator is the host survey's renderer: titles,
// errors and question components come from it. An empty slot renders nothing.
export class SurveyFilterConditionsEditor extends SurveyElementBase<{ slot: FilterEditorSlot, creator: ISurveyCreator }, any> {
  private rootRef: React.RefObject<HTMLDivElement> = React.createRef();
  protected getStateElement(): Base | null {
    return this.props.slot || null;
  }
  private get editor(): FilterConditionsEditor {
    return !!this.props.slot ? this.props.slot.editor : undefined;
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
    return <div className={editorClassName} style={editorStyle} ref={this.rootRef}>
      <style>{editorCss}</style>
      {editor.isRawExpression ? <div style={noteStyle}>This preset has no editable conditions: applying starts a new filter.</div> : null}
      <SurveyPage survey={survey} page={survey.currentPage} css={survey.css} creator={this.props.creator} />
    </div>;
  }
}
ReactElementFactory.Instance.registerElement("sv-filter-conditions-editor",
  (props) => { return React.createElement(SurveyFilterConditionsEditor, props); });

export class SurveyQuestionFilter extends SurveyQuestionElementBase {
  private fastPopup: PopupModel;
  private advancedDialog: PopupBaseViewModel;
  private fastEditor: FilterConditionsEditor;
  private advancedEditor: FilterConditionsEditor;
  private fastAnchor: HTMLElement;
  private fastSlot: FilterEditorSlot = new FilterEditorSlot();
  private advancedSlot: FilterEditorSlot;

  constructor(props: any) {
    super(props);
    // No pointer: sv-popup draws it with a transform on the container, and a transformed container
    // clips the fixed-position lists the editor's own dropdowns open - their lower items go out of reach.
    this.fastPopup = new PopupModel("sv-filter-conditions-editor", { slot: this.fastSlot, creator: props.creator },
      { getTargetCallback: () => this.fastAnchor, showPointer: false });
    // Whatever hides the popup - a click outside, Esc, another badge - ends the editor with it.
    this.fastPopup.onVisibilityChanged.add((_: any, options: any) => {
      if (!options.isVisible) {
        this.disposeFastEditor();
      }
    });
  }
  protected get question(): QuestionFilterModel {
    return this.questionBase as QuestionFilterModel;
  }
  // A preset's title and expression are its own properties, not the question's: a save rewrites
  // item.expression, so the items are watched too.
  protected getStateElements(): Array<Base> {
    const q = this.question;
    return !!q ? [q as Base].concat(q.items) : [];
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.fastPopup.hide();
    if (!!this.advancedDialog) {
      this.advancedDialog.model.hide();
    }
    this.disposeFastEditor();
    this.disposeAdvancedEditor();
    this.fastPopup.dispose();
  }
  // A popup keeps its content rendered after it hides (its container stays mounted), so an editor
  // is first taken off the content - its page unmounts - and disposed on the next tick, never while
  // its questions are still mounted: a disposed dropdown that re-renders has no list model left and
  // takes the whole host survey down with it.
  private releaseEditor(editor: FilterConditionsEditor): void {
    if (!editor) return;
    setTimeout(() => editor.dispose(), 0);
  }
  private disposeFastEditor(): void {
    const editor = this.fastEditor;
    this.fastEditor = undefined;
    if (!editor) return;
    this.fastSlot.editor = undefined;
    this.releaseEditor(editor);
  }
  private disposeAdvancedEditor(): void {
    const editor = this.advancedEditor;
    this.advancedEditor = undefined;
    if (!editor) return;
    if (!!this.advancedSlot) {
      this.advancedSlot.editor = undefined;
    }
    this.releaseEditor(editor);
  }
  // sv-popup closes on a click anywhere outside it, another badge included, and that click never
  // reaches the badge: an open popup is closed by the first click and the next one opens the badge
  // clicked. A hide and a show in one tick would be merged by the popup's visibility animation into
  // no change at all (old position, disposed content), so this never switches an open popup.
  private openFastEditor(key: string, anchor: HTMLElement): void {
    if (this.fastPopup.isVisible) return;
    const editor = this.question.createFastModeEditor(key);
    if (!editor) return;
    this.fastEditor = editor;
    this.fastAnchor = anchor;
    this.fastSlot.editor = editor;
    this.fastPopup.show();
  }
  // A dialog, the way Creator opens its modal property editors: settings.showDialog mounts it
  // through a portal into the host survey's root element - outside that survey's <form>, still
  // under its theme variables. Any way it closes (Apply, Cancel, Esc) ends in onHide. With no
  // PopupModal rendered there is no showDialog, and there is no dialog to open.
  private openAdvancedEditor(): void {
    if (!settings.showDialog || !!this.advancedDialog) return;
    this.fastPopup.hide();
    const editor = this.question.createAdvancedModeEditor();
    this.advancedEditor = editor;
    this.advancedSlot = new FilterEditorSlot();
    this.advancedSlot.editor = editor;
    const options: IDialogOptions = {
      componentName: "sv-filter-conditions-editor",
      data: { slot: this.advancedSlot, creator: this.creator },
      onApply: (): boolean => {
        editor.apply();
        return true;
      },
      onCancel: (): void => { },
      onHide: (): void => {
        this.disposeAdvancedEditor();
        this.advancedDialog = undefined;
      },
      title: "Filter",
      displayMode: "popup"
    };
    this.advancedDialog = settings.showDialog(options, this.question.getSurveyRootElement());
  }

  private renderSearch(): React.JSX.Element | null {
    const q = this.question;
    if (!q.showSearch) return null;
    return <input type="text" style={searchStyle} value={q.searchString} placeholder="Search..." aria-label="Search"
      disabled={q.isDesignMode} onChange={(e) => { q.searchString = e.target.value; }} />;
  }
  private renderItem(item: FilterItem): React.JSX.Element {
    const isActive = this.question.activeItem === item;
    return <button type="button" key={item.name} style={isActive ? activeChipStyle : chipStyle} aria-pressed={isActive}
      onClick={() => this.question.toggleItem(item)}>{item.title}</button>;
  }
  private renderItems(): React.JSX.Element | null {
    const q = this.question;
    const items = q.visibleItems;
    if (items.length === 0 && !q.canClearActiveItem) return null;
    return <div style={rowStyle} role="toolbar" aria-label="Filters">
      {items.map((item) => this.renderItem(item))}
      {q.canClearActiveItem ? <button type="button" style={buttonStyle} onClick={() => q.clearActiveItem()}>Clear</button> : null}
    </div>;
  }
  private renderState(): React.JSX.Element | null {
    const q = this.question;
    const notes: Array<React.JSX.Element> = [];
    if (!q.canEditConditions) notes.push(<span key="ro" style={noteStyle}>Read-only preset</span>);
    if (q.isRawExpression) notes.push(<span key="raw" style={noteStyle}>This preset has no editable conditions: the first edit starts a new filter.</span>);
    if (q.isActiveItemModified) notes.push(<span key="mod" style={noteStyle}>Modified</span>);
    if (q.canSaveActiveItem) notes.push(<button key="save" type="button" style={buttonStyle} onClick={() => q.saveActiveItem()}>Save</button>);
    return notes.length > 0 ? <div style={rowStyle}>{notes}</div> : null;
  }
  private renderBadge(field: IDynamicDataFilterField): React.JSX.Element {
    const q = this.question;
    const key = q.getFieldKey(field);
    const text = q.getFieldConditionText(key);
    const title = !!field.locTitle ? field.locTitle.calculatedText : field.name;
    return <span key={key} style={badgeGroupStyle}>
      <button type="button" style={!!text ? setBadgeStyle : badgeStyle} title={text || title} aria-haspopup="dialog"
        onClick={(e) => this.openFastEditor(key, e.currentTarget)}>{text || (title + " " + openGlyph)}</button>
      {!!text && q.canEditConditions
        ? <button type="button" style={clearButtonStyle} aria-label={"Clear " + title}
          onClick={() => q.clearFieldCondition(key)}>{clearGlyph}</button>
        : null}
    </span>;
  }
  private renderFields(): React.JSX.Element | null {
    const q = this.question;
    const badges = q.isFastModeAvailable ? q.getFastModeFields().map((f) => this.renderBadge(f)) : [];
    const advanced = q.isAdvancedModeAvailable
      ? <button type="button" style={buttonStyle} aria-haspopup="dialog" onClick={() => this.openAdvancedEditor()}>Advanced...</button>
      : null;
    if (badges.length === 0 && !advanced) return null;
    return <div style={rowStyle}>{badges}{advanced}</div>;
  }
  protected renderElement(): React.JSX.Element {
    return <div style={rootStyle}>
      {this.renderSearch()}
      {this.renderItems()}
      {this.renderState()}
      {this.renderFields()}
      <Popup model={this.fastPopup} />
    </div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("filter",
  (props) => { return React.createElement(SurveyQuestionFilter, props); });
