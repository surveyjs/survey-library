// Prototype for the #11890 showcase: the shipping filter UI will replace this file. The styles are
// inline objects and the labels are hard-coded English on purpose - there is no design and no
// localized string for the control's buttons yet, and a half-guessed CSS class in the theme is
// harder to delete than a style object here. The question answers everything the control shows
// (a badge's text, which preset is on, whether there is anything to clear or save): nothing here
// computes filter state of its own.
import * as React from "react";
import { Base, PopupModel, QuestionFilterModel, FilterConditionsEditor, FilterItem } from "survey-core";
import type { IDynamicDataFilterField } from "survey-core";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";
import { SurveyQuestionElementBase } from "../../reactquestion_element";
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
const editorStyle: React.CSSProperties = { minWidth: "320px" };
// The eslint i18n rule rejects non-ASCII source characters, so the glyphs are built from their codes.
const clearGlyph = String.fromCharCode(0x00D7);
const openGlyph = String.fromCharCode(0x25BE);

// The popup content: the editor's own survey. A separate element and not "survey" itself, so an
// empty popup (before the first open, after a dispose) renders nothing instead of a survey of nothing.
export class SurveyFilterConditionsEditor extends React.Component<{ editor: FilterConditionsEditor }, any> {
  render(): React.JSX.Element | null {
    const editor = this.props.editor;
    if (!editor || editor.isDisposed) return null;
    return <div style={editorStyle}>
      {editor.isRawExpression ? <div style={noteStyle}>This preset has no editable conditions: applying starts a new filter.</div> : null}
      {ReactElementFactory.Instance.createElement("survey", { model: editor.survey })}
    </div>;
  }
}
ReactElementFactory.Instance.registerElement("sv-filter-conditions-editor",
  (props) => { return React.createElement(SurveyFilterConditionsEditor, props); });

export class SurveyQuestionFilter extends SurveyQuestionElementBase {
  private fastPopup: PopupModel;
  private advancedPopup: PopupModel;
  private fastEditor: FilterConditionsEditor;
  private advancedEditor: FilterConditionsEditor;
  private fastAnchor: HTMLElement;

  constructor(props: any) {
    super(props);
    this.fastPopup = new PopupModel("sv-filter-conditions-editor", { editor: undefined },
      { getTargetCallback: () => this.fastAnchor });
    // Whatever hides the popup - a click outside, Esc, another badge - ends the editor with it.
    this.fastPopup.onVisibilityChanged.add((_: any, options: any) => {
      if (!options.isVisible) {
        this.disposeFastEditor();
      }
    });
    this.advancedPopup = new PopupModel("sv-filter-conditions-editor", { editor: undefined },
      { isModal: true, displayMode: "popup", title: "Filter" });
    this.advancedPopup.onApply = (): boolean => {
      if (!!this.advancedEditor) {
        this.advancedEditor.apply();
      }
      return true;
    };
    this.advancedPopup.onVisibilityChanged.add((_: any, options: any) => {
      if (!options.isVisible) {
        this.disposeAdvancedEditor();
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
    this.advancedPopup.hide();
    this.disposeFastEditor();
    this.disposeAdvancedEditor();
    this.fastPopup.dispose();
    this.advancedPopup.dispose();
  }
  private disposeFastEditor(): void {
    if (!!this.fastEditor) {
      this.fastEditor.dispose();
    }
    this.fastEditor = undefined;
  }
  private disposeAdvancedEditor(): void {
    if (!!this.advancedEditor) {
      this.advancedEditor.dispose();
    }
    this.advancedEditor = undefined;
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
    this.fastPopup.contentComponentData = { editor: editor };
    this.fastPopup.show();
  }
  private openAdvancedEditor(): void {
    this.fastPopup.hide();
    this.advancedEditor = this.question.createAdvancedModeEditor();
    this.advancedPopup.contentComponentData = { editor: this.advancedEditor };
    this.advancedPopup.show();
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
      <Popup model={this.advancedPopup} />
    </div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("filter",
  (props) => { return React.createElement(SurveyQuestionFilter, props); });
