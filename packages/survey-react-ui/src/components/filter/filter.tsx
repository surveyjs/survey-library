// The Filter Control (#11890). Everything it shows is survey-core's: the chips, Clear All, Save and
// Filters are actions the question owns (filter-toolbars.ts), drawn with sv-action-bar; a badge's
// popup is a FilterFieldPopup; the advanced dialog is a FilterConditionsEditor; the classes are the
// theme's "filter" entry. This file only lays the parts out and draws the few pieces that are not
// standard components: a chip with a trailing chevron, a checkbox list entry, the popup's frame.
import * as React from "react";
import {
  Action, ActionDropdownViewModel, Base, FilterConditionsEditor, FilterEditorHolder, FilterFieldPopup, ListModel,
  Question, QuestionFilterModel, SurveyError, SurveyModel, filterChipComponentName, filterEditorComponentName,
  filterFieldPopupComponentName, filterListItemComponentName, filterUIStrings, toCssClasses
} from "survey-core";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase, SurveyQuestionElementBase } from "../../reactquestion_element";
import { ISurveyCreator } from "../../reactquestion";
import { SurveyPage } from "../../page";
import { SurveyActionBar } from "../action-bar/action-bar";
import { SurveyActionBarItem } from "../action-bar/action-bar-item";
import { Popup } from "../popup/popup";
import { List } from "../list/list";
import { SvgIcon } from "../svg-icon/svg-icon";

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

// The page of a FilterConditionsEditor: the advanced dialog's, and a "condition" popup's.
class FilterEditorPage extends SurveyElementBase<{ editor: FilterConditionsEditor, className: string }, any> {
  private rootRef: React.RefObject<HTMLDivElement> = React.createRef();
  private creator: FilterEditorCreator;
  private creatorSurvey: SurveyModel;
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
    const editor = this.props.editor;
    if (!!editor && !editor.isDisposed && !!this.rootRef.current) {
      editor.survey.rootElement = this.rootRef.current;
    }
  }
  protected renderElement(): React.JSX.Element | null {
    const editor = this.props.editor;
    if (!editor || editor.isDisposed) return null;
    const survey = editor.survey;
    return <div className={this.props.className} ref={this.rootRef}>
      <SurveyPage survey={survey} page={survey.currentPage} css={survey.css} creator={this.getCreator(survey)} />
    </div>;
  }
}

// The advanced dialog's content. It watches the holder, so an emptied holder unmounts the page
// before survey-core disposes the editor.
export class SurveyFilterConditionsEditor extends SurveyElementBase<{ holder: FilterEditorHolder }, any> {
  protected getStateElement(): Base {
    return this.props.holder;
  }
  protected renderElement(): React.JSX.Element | null {
    const holder = this.props.holder;
    if (!holder || !holder.editor) return null;
    return <FilterEditorPage editor={holder.editor} className={holder.cssClasses.editor} />;
  }
}
ReactElementFactory.Instance.registerElement(filterEditorComponentName,
  (props) => { return React.createElement(SurveyFilterConditionsEditor, props); });

// A badge's popup: the search box (a long list, or one a value can be typed into), the title row
// with its link, the list or the operator and value, and Apply.
export class SurveyFilterFieldPopup extends SurveyElementBase<{ holder: FilterEditorHolder }, any> {
  private get popup(): FilterFieldPopup {
    const holder = this.props.holder;
    return !!holder && !!holder.fieldPopup && !holder.fieldPopup.isDisposed ? holder.fieldPopup : undefined;
  }
  protected getStateElements(): Array<Base> {
    const holder = this.props.holder;
    const popup = this.popup;
    if (!popup) return !!holder ? [holder] : [];
    const res: Array<Base> = [holder, popup.headerToolbar, popup.footerToolbar];
    if (!!popup.list) res.push(popup.list);
    return res;
  }
  private renderSearch(popup: FilterFieldPopup): React.JSX.Element | null {
    const list = popup.list;
    if (!list || !popup.showSearch) return null;
    const css = popup.cssClasses;
    return <div className={css.popupSearch}>
      <SvgIcon className={css.popupSearchIcon} iconName="icon-search-24x24" size={"auto"}></SvgIcon>
      <input type="text" className={css.popupSearchInput} value={list.filterString || ""}
        placeholder={list.filterStringPlaceholder} aria-label={list.filterStringPlaceholder}
        onChange={(e) => { list.filterString = e.target.value; }} />
    </div>;
  }
  protected renderElement(): React.JSX.Element | null {
    const popup = this.popup;
    if (!popup) return null;
    const css = popup.cssClasses;
    const body = !!popup.list ? <List model={popup.list}></List> : <FilterEditorPage editor={popup.editor} className={css.editor} />;
    const footer = popup.footerToolbar.hasActions
      ? <div className={css.popupFooter}><SurveyActionBar model={popup.footerToolbar} /></div> : null;
    return <div className={css.popup}>
      {this.renderSearch(popup)}
      <div className={css.popupHeader}>
        <div className={css.popupTitle}>{popup.title}</div>
        <SurveyActionBar model={popup.headerToolbar} />
      </div>
      <div className={css.popupBody}>{body}</div>
      {footer}
    </div>;
  }
}
ReactElementFactory.Instance.registerElement(filterFieldPopupComponentName,
  (props) => { return React.createElement(SurveyFilterFieldPopup, props); });

// An entry of a checkbox list: drawn checked by the entry's active flag (FilterFieldPopup keeps it),
// with a remove button for a value the respondent typed. The "Add" entry is its text alone.
export class SurveyFilterListItem extends SurveyElementBase<{ model: ListModel, item: Action }, any> {
  protected getStateElement(): Base {
    return this.props.item;
  }
  protected renderElement(): React.JSX.Element | null {
    const item = this.props.item;
    if (!item || !item.data || !item.data.popup) return null;
    const popup: FilterFieldPopup = item.data.popup;
    const css = popup.cssClasses;
    const text = <span className={css.listItemText}>{item.title}</span>;
    if (item.data.isAdd) return <div className={css.listItem}>{text}</div>;
    const check = <span className={toCssClasses(css.listItemCheck, !!item.active && css.listItemCheckChecked)}>
      {!!item.active ? <SvgIcon iconName="icon-check-16x16" size={"auto"}></SvgIcon> : null}
    </span>;
    const remove = item.data.isCustom && !popup.isReadOnly
      ? <button type="button" className={css.listItemRemove} title={filterUIStrings.removeValue} aria-label={filterUIStrings.removeValue}
        onClick={(e) => { e.stopPropagation(); popup.removeCustomItem(item); }}>
        <SvgIcon iconName="icon-delete-16x16" size={"auto"}></SvgIcon>
      </button> : null;
    return <div className={css.listItem}>{check}{text}{remove}</div>;
  }
}
ReactElementFactory.Instance.registerElement(filterListItemComponentName,
  (props) => { return React.createElement(SurveyFilterListItem, props); });

// A chip: the standard action button with a trailing chevron while it opens a popup, and the popup.
export class SurveyFilterChip extends SurveyActionBarItem {
  private viewModel: ActionDropdownViewModel;
  renderButtonContent() {
    const content = super.renderButtonContent();
    if (!this.item.markerIconName) return content;
    return <>
      {content}
      <SvgIcon className={this.item.cssClasses.itemMarkerIcon} iconName={this.item.markerIconName} size={"auto"}></SvgIcon>
    </>;
  }
  renderInnerButton() {
    const button = super.renderInnerButton();
    if (!this.item.popupModel) return button;
    return <>
      {button}
      <Popup model={this.item.popupModel}></Popup>
    </>;
  }
  componentDidMount(): void {
    super.componentDidMount();
    if (!!this.item.popupModel) {
      this.viewModel = new ActionDropdownViewModel(this.item);
    }
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if (!!this.viewModel) {
      this.viewModel.dispose();
      this.viewModel = undefined;
    }
  }
}
ReactElementFactory.Instance.registerElement(filterChipComponentName,
  (props) => { return React.createElement(SurveyFilterChip, props); });

export class SurveyQuestionFilter extends SurveyQuestionElementBase {
  private chipsRef: React.RefObject<HTMLDivElement> = React.createRef();
  protected get question(): QuestionFilterModel {
    return this.questionBase as QuestionFilterModel;
  }
  protected getStateElements(): Array<Base> {
    const q = this.question;
    return !!q ? [q, q.chipsLayout] : [];
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.updateLayout();
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.updateLayout();
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if (!!this.question) {
      this.question.chipsLayout.detach();
    }
  }
  // The chips row is measured once it is drawn: FilterChipsLayout cuts it to one row.
  private updateLayout(): void {
    const el = this.chipsRef.current;
    if (!el || !this.question) return;
    this.question.chipsLayout.attach(el);
    this.question.chipsLayout.update();
  }
  private renderSearch(): React.JSX.Element | null {
    const q = this.question;
    if (!q.showSearch) return null;
    const css = q.cssClasses;
    const searchCss = q.searchCss;
    return <div className={css.searchRow}>
      <div className={toCssClasses(searchCss.root, css.search)}>
        <SvgIcon className={css.searchIcon} iconName="icon-search-24x24" size={"auto"}></SvgIcon>
        <input type="text" className={searchCss.control} value={q.searchString} placeholder={q.searchPlaceholder}
          aria-label={filterUIStrings.searchLabel} disabled={q.isDesignMode}
          onChange={(e) => { q.searchString = e.target.value; }} />
      </div>
      <SurveyActionBar model={q.searchToolbar} />
    </div>;
  }
  protected renderElement(): React.JSX.Element {
    const q = this.question;
    const css = q.cssClasses;
    return <div className={toCssClasses(css.root, q.isMobile && css.rootMobile)}>
      {this.renderSearch()}
      <div className={css.chipsRow}>
        <div className={toCssClasses(css.chips, q.chipsLayout.isExpanded && css.chipsExpanded)} ref={this.chipsRef}>
          <SurveyActionBar model={q.chipsToolbar} />
        </div>
        <SurveyActionBar model={q.clearToolbar} />
      </div>
    </div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("filter",
  (props) => { return React.createElement(SurveyQuestionFilter, props); });
