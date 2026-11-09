import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { Question } from "../question";
import { getLocaleString } from "../surveyStrings";
import { toCssClasses } from "../utils/cssClassBuilder";
import { setUpDialogSurvey } from "../utils/dialog-survey";
import { IFilterCondition, IFilterItemEdit } from "../interfaces/ui-interfaces";
import { FilterItem, getFilterElementId, getUniqueFilterActionId } from "./filter-item";
import { FilterConditionsEditor, IFilterConditionsEditorOwner, createFilterEditorOwner } from "./filter-conditions-editor";
import { getFilterFieldTitle } from "../dynamic-data/dynamic-data-filter-fields";
import type { FilterAIRequest } from "./filter-ai";
import { FilterAIPrompt } from "./filter-ai-prompt";
import { filterUIStrings } from "./filter-ui-strings";
// The question types the form is made of; imported here, as FilterConditionsEditor imports its own.
import "../question_text";
import "../question_dropdown";

// What the preset dialogs read from the control and call on it: the control's public API only.
export interface IFilterPresetDialogOwner extends IFilterConditionsEditorOwner {
  visibleItems: Array<FilterItem>;
  getAllFieldKeys(): Array<string>;
  addItem(title: string, conditions: Array<IFilterCondition>): FilterItem;
  cssClasses: any;
  isMobile?: boolean;
}
// The longest title a preset may get: the mockup's counter.
export const filterPresetTitleMaxLength = 32;
// Whether another preset already has the title: trimmed and compared case-insensitively, as a
// respondent reads them.
export function isFilterPresetTitleTaken(title: string, otherTitles: Array<string>): boolean {
  const key = (title || "").trim().toLocaleLowerCase();
  return otherTitles.some((other: string): boolean => (other || "").trim().toLocaleLowerCase() === key);
}

// A preset as a dialog edits it: its title, and its conditions - null for a preset that does not
// decompose, which has none to edit.
export interface IFilterPresetBuffer {
  item?: FilterItem;
  title: string;
  conditions: Array<IFilterCondition> | null;
  // the description of an AI preset (Edit Presets)
  prompt?: string;
}

// The Add New Preset dialog: the preset's title and what it contains - a dropdown per field, "+ Add"
// for one more and the "x" of a dropdown for one less - and the fields' editors under them, in the
// form of their kinds as in the Filters dialog. Two surveys: the form (the title and the dropdowns),
// made anew for every preset shown, and the dialog's survey (survey), which lives as long as the
// dialog: the fields' FilterConditionsEditor adds its panels to its "fields" panel - the frame - and
// is made anew whenever the set of fields changes; Edit Presets adds the description after it. A
// renderer watches the form and editor properties. Nothing reaches the control until apply(), which
// checks the preset - a title that is given, not too long and no other preset's, and at least one
// condition - and says whether the dialog may close. Made when the dialog opens, disposed when it
// closes.
export class FilterPresetDialog extends Base {
  @property() form: SurveyModel;
  // The fields' editors; undefined while no field is picked.
  @property() editor: FilterConditionsEditor;
  protected buffer: IFilterPresetBuffer;
  private surveyValue: SurveyModel;
  private fieldsPanelValue: PanelModel;
  private addFieldAction: Action;
  private rowCount: number = 0;

  constructor(protected owner: IFilterPresetDialogOwner, conditions?: Array<IFilterCondition>) {
    super();
    this.surveyValue = this.createSurvey();
    if (conditions !== undefined) {
      this.showBuffer({ title: "", conditions: [].concat(conditions || []) });
    }
  }
  public getType(): string { return "filterpresetdialog"; }
  public get title(): string { return filterUIStrings.addPresetTitle; }
  // Whether the preset shown may be changed; a dialog that adds one always may.
  public get isReadOnly(): boolean { return false; }
  // The control's classes (the "filter" entry of the theme): the dialog is drawn outside the
  // control's own markup.
  public get cssClasses(): any { return this.owner.cssClasses || {}; }
  public get contentCss(): string { return toCssClasses(this.cssClasses.modalContent, this.cssClasses.presetContent); }
  public get formCss(): string { return toCssClasses(this.cssClasses.editor, this.cssClasses.presetForm); }
  public get editorCss(): string { return toCssClasses(this.cssClasses.editor, this.cssClasses.modalEditor); }
  // What a renderer draws under the form: the fields' editors in their frame and, in Edit Presets,
  // the description. Its page is empty while there is neither.
  public get survey(): SurveyModel { return this.surveyValue; }
  // The control's isMobile, which may change while the dialog is open (a rotation, a resize).
  public setIsMobile(isMobile: boolean): void {
    if (this.isDisposed) return;
    this.surveyValue.setIsMobile(!!isMobile);
  }
  // Checks the preset and adds it. false keeps the dialog open, with the errors shown in the form.
  public apply(): boolean {
    if (this.isDisposed) return false;
    this.saveBuffer();
    if (!this.validateBuffer()) return false;
    this.owner.addItem(this.buffer.title.trim(), this.buffer.conditions);
    return true;
  }
  // The dialog's survey goes last: the editor (and Edit Presets' description) take their panels out
  // of it first.
  public dispose(): void {
    [this.editor, this.form, this.addFieldAction].forEach((part: { dispose(): void }): void => {
      if (!!part) part.dispose();
    });
    super.dispose();
    this.surveyValue.dispose();
  }

  // Shows a preset: a new form and new editors for it, the old form disposed once replaced. No
  // preset, no form.
  protected showBuffer(buffer: IFilterPresetBuffer): void {
    const oldForm = this.form;
    this.buffer = buffer;
    this.form = !!buffer ? this.createForm() : undefined;
    this.replaceEditor();
    if (!!oldForm) oldForm.dispose();
  }
  // Reads what the form and the editors hold back into the preset shown.
  protected saveBuffer(): void {
    if (!this.buffer || !this.form) return;
    this.buffer.title = this.form.getValue("presetTitle") || "";
    if (this.buffer.conditions !== null) {
      this.buffer.conditions = !!this.editor ? this.editor.getConditions() : [];
    }
  }
  protected validateBuffer(): boolean {
    return this.form.validate(true, true);
  }
  // The titles the preset's may not repeat.
  protected getOtherTitles(): Array<string> {
    return this.owner.visibleItems.map((item: FilterItem): string => item.title);
  }
  // Called after every change the respondent makes in the form or the editors.
  protected onChanged(): void { }

  private get containsPanel(): PanelModel { return <PanelModel>this.form.getPanelByName("contains"); }
  private get rows(): Array<Question> { return !!this.containsPanel ? <Array<Question>>this.containsPanel.elements : []; }
  // The fields the rows pick, in their order.
  private getRowKeys(): Array<string> {
    return this.rows.map((row: Question): string => row.value).filter((key: string): boolean => !!key);
  }
  // The fields the conditions are on, in the order the Filters dialog shows them.
  private getConditionKeys(conditions: Array<IFilterCondition>): Array<string> {
    return this.owner.getAllFieldKeys().filter((key: string): boolean => {
      const field = this.owner.getFieldByName(key);
      return !!field && conditions.some((c: IFilterCondition): boolean => c.field === field.valueName);
    });
  }
  // The dialog's survey, in the outer survey's look (setUpDialogSurvey): a "fields" panel that holds
  // the fields' panels and is their frame (css.presetFields). The fields' panels are nested in it, but
  // drawn as they were on a page of their own: with the frame classes, which the editor's styles
  // reset, and not the nested ones.
  private createSurvey(): SurveyModel {
    const survey = new SurveyModel();
    setUpDialogSurvey(survey, { locale: this.owner.getLocale(), isMobile: !!this.owner.isMobile });
    const page = survey.addNewPage("page1");
    const fields = new PanelModel("fields");
    this.fieldsPanelValue = fields;
    survey.onUpdatePanelCssClasses.add((_: SurveyModel, options: any): void => {
      const classes = options.cssClasses.panel;
      if (options.panel === fields) {
        classes.container = toCssClasses(classes.container, (this.owner.cssClasses || {}).presetFields);
      } else if (options.panel.parent === fields) {
        classes.nested = classes.withFrame;
      }
    });
    page.addElement(fields);
    return survey;
  }
  // The editor for the rows as they are now. The old one goes first: the new one's panels and values
  // have the same names in the same survey. The survey is read-only for a preset that is.
  private replaceEditor(): void {
    const page = this.surveyValue.pages[0];
    page.blockAnimations();
    this.fieldsPanelValue.blockAnimations();
    try {
      const old = this.editor;
      this.editor = undefined;
      if (!!old) old.dispose();
      this.surveyValue.mode = this.isReadOnly ? "display" : "edit";
      this.editor = !!this.buffer ? this.createEditor() : undefined;
    } finally {
      this.fieldsPanelValue.releaseAnimations();
      page.releaseAnimations();
    }
  }
  private createForm(): SurveyModel {
    // The title in a panel of its own, as Contains is: a question that is not in a panel gets a frame,
    // and the mockup has none.
    const elements: Array<any> = [{ type: "panel", name: "presetName", title: filterUIStrings.presetName, elements: [
      { type: "text", name: "presetTitle", titleLocation: "hidden", maxLength: filterPresetTitleMaxLength, textUpdateMode: "onTyping" }] }];
    if (this.buffer.conditions !== null) {
      elements.push({ type: "panel", name: "contains", title: filterUIStrings.presetContains });
    }
    const form = new SurveyModel({ showNavigationButtons: false, showQuestionNumbers: "off", elements: elements });
    form.locale = this.owner.getLocale();
    // Inside the dialog with no frames of its own, as the fields' editors are.
    form.isCompact = true;
    // A panel with no question in it is hidden, and Contains starts with no rows when there is no
    // condition: its title and "+ Add" have to stay. The form has nothing else to hide.
    form.showInvisibleElements = true;
    if (this.isReadOnly) {
      form.mode = "display";
    }
    form.setValue("presetTitle", this.buffer.title);
    const panel = <PanelModel>form.getPanelByName("contains");
    if (!!panel) {
      this.rowCount = 0;
      this.getConditionKeys(this.buffer.conditions).forEach((key: string): void => { this.addRow(panel, key); });
      // An action of each form's own: the panel's footer disposes its actions with the form.
      this.addFieldAction = new Action({ id: "sv-filter-preset-add-field", title: filterUIStrings.addField, iconName: "icon-plus-24x24",
        iconSize: "auto", appearance: { style: "neutral", mode: "secondary" }, action: (): void => { this.addEmptyRow(); } });
      panel.footerActions.push(this.addFieldAction);
    }
    // Listened to once it is filled: what it opens with is not a change.
    form.onValueChanged.add((_: SurveyModel, options: any): void => { this.onFormChanged(options.name); });
    form.onValidateQuestion.add((_: SurveyModel, options: any): void => {
      if (options.name === "presetTitle") options.error = this.getTitleError(options.value);
    });
    form.onValidatePanel.add((_: SurveyModel, options: any): void => {
      if (options.name === "contains" && this.buffer.conditions.length === 0) options.error = filterUIStrings.presetNoConditions;
    });
    this.updateRows(form);
    return form;
  }
  // A dropdown of fields; the respondent picks one, or the "x" takes the row away.
  private addRow(panel: PanelModel, key?: string): void {
    this.rowCount++;
    panel.blockAnimations();
    try {
      const row = <Question>panel.addNewQuestion("dropdown", "field" + this.rowCount);
      row.titleLocation = "hidden";
      (<any>row).allowClear = true;
      (<any>row).choices = this.getFieldChoices([]);
      if (!!key) {
        row.value = key;
      }
    } finally {
      panel.releaseAnimations();
    }
  }
  private addEmptyRow(): void {
    this.addRow(this.containsPanel);
    this.updateRows(this.form);
  }
  private removeRow(row: Question): void {
    const panel = this.containsPanel;
    panel.blockAnimations();
    try {
      panel.removeElement(row);
      row.dispose();
    } finally {
      panel.releaseAnimations();
    }
  }
  // Each dropdown offers the fields no other row picked; "+ Add" is there while a field is left over.
  private updateRows(form: SurveyModel): void {
    const panel = <PanelModel>form.getPanelByName("contains");
    if (!panel) return;
    const rows = <Array<Question>>panel.elements;
    const picked = rows.map((row: Question): string => row.value);
    rows.forEach((row: Question): void => {
      (<any>row).choices = this.getFieldChoices(picked.filter((key: string): boolean => key !== row.value));
    });
    this.addFieldAction.visible = !this.isReadOnly && rows.length < this.owner.getAllFieldKeys().length;
  }
  private getFieldChoices(exclude: Array<string>): Array<any> {
    return this.owner.getAllFieldKeys().filter((key: string): boolean => exclude.indexOf(key) < 0).map((key: string): any => {
      const field = this.owner.getFieldByName(key);
      return { value: key, text: getFilterFieldTitle(field) };
    });
  }
  private onFormChanged(name: string): void {
    const row = this.form.getQuestionByName(name);
    if (!!row && row.parent === this.containsPanel) {
      if (row.isEmpty()) {
        this.removeRow(row);
      }
      this.updateRows(this.form);
      this.updateEditor();
    }
    this.onChanged();
  }
  // The rows changed: the editors are made anew for the fields they pick now, each keeping the
  // condition it had; a field that is new to them starts empty.
  private updateEditor(): void {
    const keys = this.getRowKeys();
    const conditions = !!this.editor ? this.editor.getConditions() : (this.buffer.conditions || []);
    const valueNames = keys.map((key: string): string => this.owner.getFieldByName(key).valueName);
    this.buffer.conditions = conditions.filter((c: IFilterCondition): boolean => valueNames.indexOf(c.field) > -1);
    this.replaceEditor();
  }
  private createEditor(): FilterConditionsEditor {
    const keys = !!this.form ? this.getRowKeys() : [];
    if (keys.length === 0 || this.buffer.conditions === null) return undefined;
    // The fields start with the preset's conditions, not the filter's.
    const editorOwner = createFilterEditorOwner(this.owner, (): Array<IFilterCondition> => this.buffer.conditions || []);
    return new FilterConditionsEditor(editorOwner, keys, { survey: this.surveyValue, panel: this.fieldsPanelValue,
      readOnly: this.isReadOnly, showFieldTitles: true,
      useFieldKinds: true, linkCss: (this.owner.cssClasses || {}).link, onFieldChanged: (): void => { this.onChanged(); } });
  }
  protected getTitleError(value: any, otherTitles: Array<string> = this.getOtherTitles()): string {
    const locale = this.owner.getLocale();
    const title = (value || "").toString().trim();
    if (!title) return getLocaleString("requiredError", locale);
    if (title.length > filterPresetTitleMaxLength) {
      return getLocaleString("textMaxLength", locale).replace("{0}", filterPresetTitleMaxLength.toString());
    }
    return isFilterPresetTitleTaken(title, otherTitles) ? filterUIStrings.presetTitleExists : undefined;
  }
}

// What the Edit Presets dialog reads from the control and calls on it besides what adding takes.
export interface IFilterEditPresetsDialogOwner extends IFilterPresetDialogOwner {
  getEditableItems(): Array<FilterItem>;
  getItemConditions(name: string): Array<IFilterCondition> | null;
  getOriginalItemState(name: string): { title: string, conditions: Array<IFilterCondition> | null, prompt?: string };
  isOriginalItemState(name: string, title: string, conditions: Array<IFilterCondition> | null, prompt?: string): boolean;
  // an AI preset may be asked about again (Make Changes)
  canRequestAI: boolean;
  createAIRequest(): FilterAIRequest;
  canEditItem(item: FilterItem): boolean;
  canDeleteItem(item: FilterItem): boolean;
  isUserItem(item: FilterItem): boolean;
  applyItemEdits(edits: Array<IFilterItemEdit>): void;
}
// A preset of the Edit Presets dialog: its tab, and whether it was deleted, reset or changed in any
// other way in the dialog.
interface IFilterPresetTab extends IFilterPresetBuffer {
  chip: Action;
  isDeleted: boolean;
  isReset: boolean;
  isTouched: boolean;
}

// The Edit Presets dialog: a tab per preset the respondent may change, delete or reset
// (getEditableItems), the form and the fields' editors of the selected one, and its actions -
// Delete, and Reset for an authored preset that is not what the JSON made it. All the tabs are one
// buffer: a tab keeps its changes while another is selected, Delete takes the tab away and Reset
// brings the JSON's title and conditions back into it. apply() checks every tab the respondent
// changed - the first one with an error is selected, its errors shown - and writes them all as one
// change (applyItemEdits). A tab nobody touched is what the control has: it is neither checked nor
// written, so an authored title longer than a typed one may be, or one two authored presets share,
// does not hold the others back. A preset that may not be edited shows read-only; one that does not
// decompose has its title only, and no Contains.
export class FilterEditPresetsDialog extends FilterPresetDialog {
  // The description and Make Changes of the selected tab's AI preset (see canAskAI); undefined for
  // any other tab. Made anew for another tab: an answer for the tab left is ignored.
  @property() aiPrompt: FilterAIPrompt;
  private aiPromptTab: IFilterPresetTab;
  // The dialog survey's onValueChanged handler that writes the description into its tab.
  private aiPromptHandler: (sender: SurveyModel, options: any) => void;
  private tabs: Array<IFilterPresetTab>;
  private tabsToolbarValue: ActionContainer;
  private actionsToolbarValue: ActionContainer;
  // The Preset Actions section is a group named by its title (aria-labelledby): the renderer gives
  // the title this id.
  public readonly actionsTitleId: string = getFilterElementId("sv-filter-preset-actions-title-");
  private deleteAction: Action;
  private resetAction: Action;

  constructor(owner: IFilterEditPresetsDialogOwner, activeItemName?: string) {
    super(owner);
    this.tabsToolbarValue = new ActionContainer();
    this.tabsToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    this.deleteAction = new Action({ id: "sv-filter-preset-delete", title: filterUIStrings.deletePreset, iconName: "icon-delete-24x24",
      iconSize: "auto", appearance: { style: "alert", mode: "tertiary-muted", showBorder: true }, action: (): void => { this.deleteSelected(); } });
    this.resetAction = new Action({ id: "sv-filter-preset-reset", title: filterUIStrings.resetPreset, iconName: "icon-reset-24x24",
      iconSize: "auto", appearance: { style: "neutral", mode: "secondary", showBorder: true }, action: (): void => { this.resetSelected(); } });
    this.actionsToolbarValue = new ActionContainer();
    this.actionsToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    this.actionsToolbarValue.setItems([this.deleteAction, this.resetAction], false);
    const used: { [id: string]: boolean } = {};
    this.tabs = owner.getEditableItems().map((item: FilterItem): IFilterPresetTab => {
      // A tab of its own even for a second preset with the same name, as in the control's row.
      const id = getUniqueFilterActionId("sv-filter-preset-tab-" + item.name, (candidate: string): boolean => !!used[candidate]);
      used[id] = true;
      const conditions = owner.getItemConditions(item.name);
      const tab: IFilterPresetTab = { item: item, title: item.title, conditions: conditions, prompt: item.prompt, isDeleted: false,
        isReset: false, isTouched: false, chip: undefined };
      // One choice of several: a radio (aria-checked is not allowed on the default button role).
      tab.chip = new Action({ id: id, title: item.title, ariaRole: "radio", ariaChecked: false, activeAppearance: { style: "neutral", mode: "primary" },
        action: (): void => { this.showTab(tab); } });
      return tab;
    });
    this.tabsToolbarValue.setItems(this.tabs.map((tab: IFilterPresetTab): Action => tab.chip), false);
    const first = this.tabs.filter((tab: IFilterPresetTab): boolean => tab.item.name === activeItemName)[0] || this.tabs[0];
    this.showTab(first);
  }
  public getType(): string { return "filtereditpresetsdialog"; }
  public get title(): string { return filterUIStrings.editPresets; }
  public get tabsToolbar(): ActionContainer { return this.tabsToolbarValue; }
  // Delete and Reset of the selected preset.
  public get actionsToolbar(): ActionContainer { return this.actionsToolbarValue; }
  public get isReadOnly(): boolean {
    return !!this.buffer && !this.editOwner.canEditItem(this.buffer.item);
  }
  // The name of the preset whose tab is selected; "" when every tab was deleted.
  public get selectedName(): string { return !!this.buffer ? this.buffer.item.name : ""; }
  // Selects the tab of the named preset, keeping what was changed in the one selected before.
  public selectTab(name: string): void {
    this.showTab(this.liveTabs.filter((tab: IFilterPresetTab): boolean => tab.item.name === name)[0]);
  }
  // Takes the selected tab away; the next one is selected, or the one before it when it was the last.
  public deleteSelected(): void {
    const tab = <IFilterPresetTab>this.buffer;
    if (!tab || !this.editOwner.canDeleteItem(tab.item)) return;
    const live = this.liveTabs;
    const index = live.indexOf(tab);
    tab.isDeleted = true;
    this.tabsToolbarValue.setItems(this.liveTabs.map((t: IFilterPresetTab): Action => t.chip), false);
    this.showBuffer(live[index + 1] || live[index - 1]);
    this.updateTabs();
  }
  // Brings the JSON's title and conditions back into the selected tab.
  public resetSelected(): void {
    const tab = <IFilterPresetTab>this.buffer;
    if (!tab || this.editOwner.isUserItem(tab.item)) return;
    // An answer that comes after the reset would undo it.
    if (!!this.aiPrompt && this.aiPrompt.isBusy) {
      this.aiPrompt.cancel();
    }
    const original = this.editOwner.getOriginalItemState(tab.item.name);
    tab.title = original.title;
    tab.conditions = original.conditions;
    tab.prompt = original.prompt || "";
    tab.isReset = true;
    tab.isTouched = true;
    this.showBuffer(tab);
    if (!!this.aiPrompt) {
      this.aiPrompt.prompt = tab.prompt;
    }
    this.updateTabs();
  }
  // Checks every tab the respondent changed and writes all of them as one change. false keeps the
  // dialog open on the first tab with an error.
  // Not while Make Changes waits for the model: the tab's description would be saved with a filter
  // that is not its answer.
  public get canApply(): boolean {
    return !this.aiPrompt || !this.aiPrompt.isBusy;
  }
  public apply(): boolean {
    if (this.isDisposed || !this.canApply) return false;
    this.saveBuffer();
    const owner = this.editOwner;
    const invalid = this.liveTabs.filter((tab: IFilterPresetTab): boolean => tab.isTouched && owner.canEditItem(tab.item) && this.hasError(tab))[0];
    if (!!invalid) {
      this.showTab(invalid);
      this.validateBuffer();
      return false;
    }
    const edits: Array<IFilterItemEdit> = [];
    this.tabs.forEach((tab: IFilterPresetTab): void => {
      const name = tab.item.name;
      if (tab.isDeleted) {
        edits.push({ name: name, isDeleted: true });
      } else if (tab.isTouched && owner.canEditItem(tab.item)) {
        const edit: IFilterItemEdit = { name: name, isReset: tab.isReset, title: tab.title.trim(), conditions: tab.conditions === null ? undefined : tab.conditions };
        const prompt = (tab.prompt || "").trim();
        if (!!prompt && prompt !== tab.item.prompt) {
          edit.prompt = prompt;
        }
        edits.push(edit);
      } else if (tab.isReset) {
        edits.push({ name: name, isReset: true });
      }
    });
    owner.applyItemEdits(edits);
    return true;
  }
  public dispose(): void {
    this.setAIPrompt(undefined, undefined);
    this.tabsToolbarValue.dispose();
    this.actionsToolbarValue.dispose();
    super.dispose();
  }

  // Another tab gets its own description and Make Changes; the same tab drawn anew (Make Changes'
  // answer, Reset) keeps them - and a request it may be waiting for. The old description goes before
  // the new one is made: both are the "prompt" value of the dialog's survey. Its panel is added after
  // the "fields" panel, so it stays last whenever the editor is made anew.
  protected showBuffer(buffer: IFilterPresetBuffer): void {
    super.showBuffer(buffer);
    const tab = <IFilterPresetTab>buffer;
    if (tab === this.aiPromptTab && !!this.aiPrompt) return;
    this.setAIPrompt(undefined, undefined);
    if (this.canAskAI(tab)) {
      this.setAIPrompt(tab, this.createAIPrompt(tab));
    }
  }
  protected getOtherTitles(): Array<string> {
    return this.getTitlesExcept(<IFilterPresetTab>this.buffer);
  }
  // The titles of the other tabs as they are in the buffer, and of the presets that have no tab.
  private getTitlesExcept(except: IFilterPresetTab): Array<string> {
    const titles = this.liveTabs.filter((tab: IFilterPresetTab): boolean => tab !== except).map((tab: IFilterPresetTab): string => tab.title);
    const tabItems = this.tabs.map((tab: IFilterPresetTab): FilterItem => tab.item);
    this.owner.visibleItems.forEach((item: FilterItem): void => {
      if (tabItems.indexOf(item) < 0) titles.push(item.title);
    });
    return titles;
  }
  // A changed title shows in its tab at once, and Reset follows whether there is anything to reset.
  protected onChanged(): void {
    this.saveBuffer();
    if (!!this.buffer) {
      (<IFilterPresetTab>this.buffer).isTouched = true;
    }
    this.updateTabs();
  }

  private get editOwner(): IFilterEditPresetsDialogOwner { return <IFilterEditPresetsDialogOwner>this.owner; }
  private get liveTabs(): Array<IFilterPresetTab> { return this.tabs.filter((tab: IFilterPresetTab): boolean => !tab.isDeleted); }
  // An AI preset whose filter the tab shows as conditions, which the respondent may change, while
  // the application answers AI requests.
  private canAskAI(tab: IFilterPresetTab): boolean {
    const owner = this.editOwner;
    return !!tab && !!tab.item && tab.item.kind === "ai" && tab.conditions !== null && owner.canEditItem(tab.item) && owner.canRequestAI;
  }
  private createAIPrompt(tab: IFilterPresetTab): FilterAIPrompt {
    return new FilterAIPrompt(this.editOwner.createAIRequest(), { prompt: tab.prompt, isModify: true,
      modifyTitle: filterUIStrings.aiPromptEdit, survey: this.survey, css: this.owner.cssClasses,
      getConditions: (): Array<IFilterCondition> => !!this.editor ? this.editor.getConditions() : (tab.conditions || []),
      onAnswer: (conditions: Array<IFilterCondition>): void => { this.onAIAnswer(tab, conditions); } });
  }
  // The handler that writes the description into its tab goes before the old prompt is disposed: the
  // dispose clears the "prompt" value, and the handler would write "" into the tab that is left.
  private setAIPrompt(tab: IFilterPresetTab, prompt: FilterAIPrompt): void {
    const old = this.aiPrompt;
    if (!!this.aiPromptHandler) {
      this.survey.onValueChanged.remove(this.aiPromptHandler);
      this.aiPromptHandler = undefined;
    }
    this.aiPromptTab = tab;
    this.aiPrompt = prompt;
    if (!!old) old.dispose();
    if (!!prompt) {
      this.aiPromptHandler = (_: SurveyModel, options: any): void => {
        if (options.name !== "prompt" || tab.prompt === prompt.prompt) return;
        tab.prompt = prompt.prompt;
        tab.isTouched = true;
        this.updateTabs();
      };
      this.survey.onValueChanged.add(this.aiPromptHandler);
    }
  }
  // The model's filter is the tab's now: its rows and editors are made anew, the title kept.
  private onAIAnswer(tab: IFilterPresetTab, conditions: Array<IFilterCondition>): void {
    if (this.isDisposed || tab !== this.buffer) return;
    this.saveBuffer();
    tab.conditions = conditions;
    tab.isTouched = true;
    this.showBuffer(tab);
    this.updateTabs();
  }
  private showTab(tab: IFilterPresetTab): void {
    if (!tab || tab.isDeleted || tab === this.buffer) return;
    this.saveBuffer();
    this.showBuffer(tab);
    this.updateTabs();
  }
  private hasError(tab: IFilterPresetTab): boolean {
    return !!this.getTitleError(tab.title, this.getTitlesExcept(tab)) || (tab.conditions !== null && tab.conditions.length === 0);
  }
  private updateTabs(): void {
    const tab = <IFilterPresetTab>this.buffer;
    this.tabs.forEach((t: IFilterPresetTab): void => {
      t.chip.active = t === tab;
      t.chip.ariaChecked = t.chip.active;
      t.chip.title = t.title.trim() || t.item.name;
    });
    const owner = this.editOwner;
    this.deleteAction.visible = !!tab && owner.canDeleteItem(tab.item);
    this.resetAction.visible = !!tab && !owner.isUserItem(tab.item) && !owner.isOriginalItemState(tab.item.name, tab.title, tab.conditions, tab.prompt);
  }
}
