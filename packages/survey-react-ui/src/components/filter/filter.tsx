// The Filter Control (#11890). Everything it shows is survey-core's: the chips, Clear All, Save and
// Filters are actions the question owns (filter-toolbars.ts), drawn with sv-action-bar; a badge's
// popup is a FilterFieldPopup; the Filters dialog is a FilterModal over a FilterConditionsEditor, and
// Add New Preset and Edit Presets are FilterPresetDialogs; the classes are the theme's "filter"
// entry. This file only lays the parts out and draws the few pieces that are not standard components:
// a chip with a trailing chevron, a checkbox list entry, the popup's frame, the dialogs' content.
import * as React from "react";
import {
  Action, ActionDropdownViewModel, Base, FilterEditPresetsDialog, FilterEditorHolder, FilterFieldPopup, FilterModal,
  FilterPresetDialog, ListModel, Question, QuestionFilterModel, SurveyError, SurveyModel, filterChipComponentName,
  filterModalComponentName, filterFieldPopupComponentName, filterListItemComponentName, filterPresetDialogComponentName,
  filterUIStrings, toCssClasses
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

// What an editor survey is drawn from: a FilterConditionsEditor, or a preset dialog's form.
interface IFilterEditorSurvey {
  survey: SurveyModel;
  isDisposed: boolean;
}
// The page of an editor survey: the Filters dialog's fields, a "condition" popup's, and a preset
// dialog's form and fields.
class FilterEditorPage extends SurveyElementBase<{ editor: IFilterEditorSurvey, className: string }, any> {
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

// The Filters dialog's content: the search box, the presets and the fields; its footer is the
// dialog's own. It watches the holder, so an emptied holder unmounts the content before survey-core
// disposes the dialog's model.
export class SurveyFilterModal extends SurveyElementBase<{ holder: FilterEditorHolder }, any> {
  private get modal(): FilterModal {
    const holder = this.props.holder;
    return !!holder && !!holder.modal && !holder.modal.isDisposed ? holder.modal : undefined;
  }
  protected getStateElements(): Array<Base> {
    const holder = this.props.holder;
    const modal = this.modal;
    if (!modal) return !!holder ? [holder] : [];
    return [holder, modal, modal.creationToolbar, modal.presetsToolbar, modal.presetsTitleToolbar];
  }
  private renderSearch(modal: FilterModal): React.JSX.Element | null {
    if (!modal.showSearch) return null;
    const css = modal.cssClasses;
    const searchCss = modal.searchCss;
    return <div className={css.modalSection}>
      <div className={searchCss.root}>
        <SvgIcon className={css.searchIcon} iconName="icon-search-24x24" size={"auto"}></SvgIcon>
        <input type="text" className={searchCss.control} value={modal.searchString} placeholder={modal.searchPlaceholder}
          aria-label={filterUIStrings.searchLabel} disabled={modal.isReadOnly}
          onChange={(e) => { modal.searchString = e.target.value; }} />
      </div>
    </div>;
  }
  // Add Preset, under the search box.
  private renderCreation(modal: FilterModal): React.JSX.Element | null {
    if (!modal.creationToolbar.hasVisibleActions) return null;
    return <div className={modal.cssClasses.modalSection}>
      <SurveyActionBar model={modal.creationToolbar} />
    </div>;
  }
  private renderPresets(modal: FilterModal): React.JSX.Element | null {
    if (!modal.presetsToolbar.hasActions) return null;
    const css = modal.cssClasses;
    return <div className={css.modalSection}>
      <div className={css.modalSectionHeader}>
        <div className={css.modalSectionTitle}>{filterUIStrings.presetsTitle}</div>
        <SurveyActionBar model={modal.presetsTitleToolbar} />
      </div>
      <SurveyActionBar model={modal.presetsToolbar} />
    </div>;
  }
  protected renderElement(): React.JSX.Element | null {
    const modal = this.modal;
    if (!modal) return null;
    const css = modal.cssClasses;
    return <div className={css.modalContent}>
      {this.renderSearch(modal)}
      {this.renderCreation(modal)}
      {this.renderPresets(modal)}
      <FilterEditorPage editor={modal.editor} className={toCssClasses(css.editor, css.modalEditor)} />
    </div>;
  }
}
ReactElementFactory.Instance.registerElement(filterModalComponentName,
  (props) => { return React.createElement(SurveyFilterModal, props); });

// Add New Preset and Edit Presets: the tabs (Edit Presets only), the form, the fields' editors in a
// frame and the preset's actions (Edit Presets only); the footer is the dialog's own. A form or
// editors made anew (another tab, another set of fields) are drawn anew, keyed by their page.
export class SurveyFilterPresetDialog extends SurveyElementBase<{ holder: FilterEditorHolder }, any> {
  private get dialog(): FilterPresetDialog {
    const holder = this.props.holder;
    return !!holder && !!holder.presetDialog && !holder.presetDialog.isDisposed ? holder.presetDialog : undefined;
  }
  protected getStateElements(): Array<Base> {
    const holder = this.props.holder;
    const dialog = this.dialog;
    if (!dialog) return !!holder ? [holder] : [];
    if (dialog instanceof FilterEditPresetsDialog) return [holder, dialog, dialog.tabsToolbar, dialog.actionsToolbar];
    return [holder, dialog];
  }
  private renderTabs(dialog: FilterEditPresetsDialog, css: any): React.JSX.Element | null {
    if (!dialog || !dialog.tabsToolbar.hasActions) return null;
    return <div className={css.presetTabs}><SurveyActionBar model={dialog.tabsToolbar} /></div>;
  }
  private renderActions(dialog: FilterEditPresetsDialog, css: any): React.JSX.Element | null {
    if (!dialog || !dialog.actionsToolbar.hasVisibleActions) return null;
    return <div className={css.modalSection}>
      <div className={css.modalSectionTitle}>{filterUIStrings.presetActions}</div>
      <SurveyActionBar model={dialog.actionsToolbar} />
    </div>;
  }
  protected renderElement(): React.JSX.Element | null {
    const dialog = this.dialog;
    if (!dialog) return null;
    const css = this.props.holder.cssClasses;
    const edit = dialog instanceof FilterEditPresetsDialog ? dialog : undefined;
    const form = dialog.form;
    const editor = dialog.editor;
    return <div className={toCssClasses(css.modalContent, css.presetContent)}>
      {this.renderTabs(edit, css)}
      {!!form ? <FilterEditorPage key={form.currentPage.id} editor={{ survey: form, isDisposed: dialog.isDisposed }}
        className={toCssClasses(css.editor, css.presetForm)} /> : null}
      {!!editor ? <div className={css.presetFields}>
        <FilterEditorPage key={editor.survey.currentPage.id} editor={editor} className={toCssClasses(css.editor, css.modalEditor)} />
      </div> : null}
      {this.renderActions(edit, css)}
    </div>;
  }
}
ReactElementFactory.Instance.registerElement(filterPresetDialogComponentName,
  (props) => { return React.createElement(SurveyFilterPresetDialog, props); });

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
        onChange={(e) => { list.filterString = e.target.value; }}
        onKeyDown={(e) => { popup.onSearchKeyDown(e.nativeEvent); }} />
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
    if (!q) return [];
    // A disposed question has released its layout, and asking for it would build a new one.
    return q.isDisposed ? [q] : [q, q.chipsLayout];
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
    if (!!this.question && !this.question.isDisposed) {
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
