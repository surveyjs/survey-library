import { Base } from "../base";
import { property } from "../decorators";
import { toCssClasses } from "../utils/cssClassBuilder";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { IFilterCondition, IFilterState } from "../interfaces/ui-interfaces";
import { FilterItem, getUniqueFilterActionId } from "./filter-item";
import { FilterConditionsEditor } from "./filter-conditions-editor";
import { getLocaleString } from "../surveyStrings";
import { normalizeTextForSearch } from "../helpers";

// What the Filters dialog reads from the control and calls on it: the control's public API only.
export interface IFilterModalOwner {
  visibleItems: Array<FilterItem>;
  activeItem: FilterItem;
  allowMultipleItems: boolean;
  searchCss: { root: string, control: string };
  canEditConditionsInUI: boolean;
  cssClasses: any;
  getFilterState(): IFilterState;
  getItemConditions(name: string): Array<IFilterCondition> | null;
  getRawItemExpression(state: IFilterState): string;
  composeFilterExpression(state: IFilterState): string;
  countFilterResults(expression: string): Promise<number | undefined>;
  applyFilterState(state: IFilterState): void;
  createModalEditor(onFieldChanged: () => void): FilterConditionsEditor;
  canAddItems: boolean;
  getEditableItems(): Array<FilterItem>;
  showPresetDialog(modal: FilterModal, isEdit: boolean): void;
  getLocale(): string;
}
// How long the dialog waits after a change before it counts the records again: a source on a
// server is asked once for a burst of clicks, not once per click.
export const filterModalCountDelay = 300;

// The Filters dialog (filters v2): "Search in Filters", the presets - their pills, Add New and Edit
// Selected - and every field, all of it a buffer the control does not see until apply() - the
// dialog's "Show N items". Closing the dialog any other way drops it. The fields are an editor survey
// (FilterConditionsEditor, each field in the form of its kind); a preset turned on here shows its
// conditions there, and the first edit of a field turns it off - its conditions stay, with the edit. A
// preset that does not decompose has no conditions to show: while it applies as it is, its text shows
// under the presets, with Edit... - in place of the fields with several presets, over them in single
// mode, where the first edit of a field starts from nothing and takes the text away. The search looks
// among the filters (FilterConditionsEditor.setFilterText, the presets' titles), not in the records:
// the records' search is the control's. N is the number of records the buffer would leave, counted at
// once when the dialog opens and filterModalCountDelay after the changes stop. Made when the dialog
// opens, disposed when it closes.
export class FilterModal extends Base {
  // The preset turned on in the buffer, "" for none.
  @property({ defaultValue: "" }) activeItemName: string;
  // The number of records the buffer would leave; undefined while it is not known.
  @property() resultCount: number;
  @property({ defaultValue: false }) isCounting: boolean;
  // "Search in Filters": what the dialog's search box holds.
  @property({ defaultValue: "", onSet: (_: string, target: FilterModal): void => { target.onFilterTextChanged(); } }) filterText: string;
  // Whether "Search in Filters" found nothing: no field and no preset.
  @property({ defaultValue: false }) isNothingFound: boolean;
  private editorValue: FilterConditionsEditor;
  private presetsToolbarValue: ActionContainer;
  private expressionToolbarValue: ActionContainer;
  // The presets section is a group named by its title (aria-labelledby): the renderer gives the title
  // this id, made of the dialog's own element id.
  public get presetsTitleId(): string { return this.id + "_presets-title"; }
  public get presetsTitle(): string { return this.getString("filterPresetsTitle"); }
  private addPresetAction: Action;
  private editPresetAction: Action;
  private editExpressionAction: Action;
  private searchClearActionValue: Action;
  // The conditions of the buffer while no field is edited: the control's as the dialog opened, [] once
  // a preset is turned off or everything is cleared, undefined while a preset applies as it is. Once a
  // field is edited, the editor's conditions are the buffer's.
  private conditions: Array<IFilterCondition> | undefined;
  private isFieldEdited: boolean = false;
  private countRequest: number = 0;
  private countTimer: any;

  constructor(private owner: IFilterModalOwner) {
    super();
    const state = owner.getFilterState();
    this.activeItemName = state.activeItemName;
    this.conditions = state.conditions;
    this.setPropertyValue("searchString", state.searchString);
    this.editorValue = owner.createModalEditor((): void => { this.onFieldChanged(); });
    this.addPresetAction = new Action({ id: "sv-filter-modal-add-preset", title: this.getString("filterAddPreset"), iconName: "icon-plus-24x24",
      iconSize: "auto", action: (): void => { this.owner.showPresetDialog(this, false); } });
    this.editPresetAction = new Action({ id: "sv-filter-modal-edit-preset", title: this.getString("filterEditSelected"), iconName: "icon-edit-24x24",
      iconSize: "auto", action: (): void => { this.owner.showPresetDialog(this, true); } });
    this.presetsToolbarValue = new ActionContainer();
    this.presetsToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    this.presetsToolbarValue.setItems(this.createPresetChips().concat([this.addPresetAction, this.editPresetAction]), false);
    this.editExpressionAction = new Action({ id: "sv-filter-modal-edit-expression", title: this.getString("filterEditExpression"),
      action: (): void => { this.owner.showPresetDialog(this, true); } });
    this.expressionToolbarValue = new ActionContainer();
    this.expressionToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    this.expressionToolbarValue.setItems([this.editExpressionAction], false);
    this.searchClearActionValue = new Action({ id: "sv-filter-modal-search-clear", locTitleName: "clearCaption", showTitle: false,
      iconName: "icon-cancel-24x24", iconSize: "auto", innerCss: this.cssClasses.searchClear,
      appearance: { style: "neutral", mode: "tertiary", size: "small" }, action: (): void => { this.filterText = ""; } });
    this.updatePresetChips();
    this.updateExpression();
    this.count();
  }
  public getType(): string { return "filtermodal"; }
  public get editor(): FilterConditionsEditor { return this.editorValue; }
  // The presets' pills, then Add New and Edit Selected; no pill in single mode, which has no preset to
  // pick.
  public get presetsToolbar(): ActionContainer { return this.presetsToolbarValue; }
  // Edit... next to the text of a preset that does not decompose.
  public get expressionToolbar(): ActionContainer { return this.expressionToolbarValue; }
  // The text of the buffer's preset while it applies as it is and does not decompose, "" otherwise:
  // what the dialog shows of it, and what a new preset starts with instead of presetConditions.
  public get presetExpression(): string {
    return this.isFieldEdited ? "" : this.owner.getRawItemExpression(this.state);
  }
  // The text's block: there while there is a text, and Search in Filters looks for nothing - it is no
  // filter to find.
  public get showExpression(): boolean { return !!this.presetExpression && !this.filterText; }
  // "<Preset> Expression".
  public get expressionTitle(): string { return this.getString("filterPresetExpression").replace("{0}", this.getPresetTitle()); }
  // The conditions the buffer filters by - a preset's that is on as it is, the fields' otherwise -
  // which a new preset starts with.
  public get presetConditions(): Array<IFilterCondition> {
    const state = this.state;
    if (state.conditions !== undefined) return [].concat(state.conditions);
    return this.owner.getItemConditions(state.activeItemName) || [];
  }
  // The presets changed under the dialog (Add New, Edit Selected): their pills are made again. The
  // buffer's preset, when one is on, shows what it is now in the fields - or, deleted, is off with no
  // conditions left.
  public refreshPresets(): void {
    if (this.isDisposed) return;
    const old = this.getPresetChips();
    this.presetsToolbarValue.setItems(this.createPresetChips().concat([this.addPresetAction, this.editPresetAction]), false);
    old.forEach((chip: Action): void => { chip.dispose(); });
    const name = this.activeItemName;
    if (!!name) {
      const isThere = this.owner.visibleItems.some((item: FilterItem): boolean => item.name === name);
      this.setBuffer(isThere ? name : "", isThere ? undefined : [], isThere ? (this.owner.getItemConditions(name) || []) : undefined);
    }
    this.updatePresetChips();
  }
  // In the designer and while the control is read-only.
  public get isReadOnly(): boolean { return !this.owner.canEditConditionsInUI; }
  public get searchPlaceholder(): string { return this.getString("filterSearchInFilters"); }
  // The search box's clear button, there while there is text to clear.
  public get searchClearAction(): Action { return this.searchClearActionValue; }
  public get showSearchClear(): boolean { return !!this.filterText; }
  public get nothingFoundText(): string { return this.getString("filterNothingFound"); }
  // The search box is drawn the way the control's own is: as a text question's input.
  public get searchCss(): { root: string, control: string } { return this.owner.searchCss; }
  // The control's classes (the "filter" entry of the theme): the dialog is drawn outside the
  // control's own markup.
  public get cssClasses(): any { return this.owner.cssClasses; }
  public get editorCss(): string { return toCssClasses(this.cssClasses.editor, this.cssClasses.modalEditor); }
  // The records' search, the control's: the dialog keeps it as it is.
  public get searchString(): string { return this.getPropertyValue("searchString", ""); }
  // What the buffer holds, as the control applies it.
  public get state(): IFilterState {
    const conditions = this.isFieldEdited ? this.editorValue.getConditions() : this.conditions;
    return { activeItemName: this.activeItemName, conditions: conditions, searchString: this.searchString };
  }
  // The caption of the dialog's main button: "Show 12 items", or "Show results" while the number is
  // being counted or cannot be known.
  public get showResultsText(): string {
    const count = this.resultCount;
    if (this.isCounting || typeof count !== "number") return this.getString("filterShowResults");
    if (count === 1) return this.getString("filterShowOneResult");
    return this.getString("filterShowResultsCount").replace("{0}", count.toString());
  }
  // The dialog lives while it is open: its captions are in the control's locale of that time.
  private getString(name: string): string { return getLocaleString(name, this.owner.getLocale()); }
  // Turns a preset on in the buffer - its conditions show in the fields - or off when it is on.
  public togglePreset(item: FilterItem): void {
    if (this.isReadOnly || !item) return;
    if (this.activeItemName === item.name) {
      this.setBuffer("", []);
    } else {
      this.setBuffer(item.name, undefined, this.owner.getItemConditions(item.name) || []);
    }
  }
  // No preset and no conditions; the search stays, as with the control's own Clear All.
  public clearAll(): void {
    if (this.isReadOnly) return;
    this.setBuffer("", []);
  }
  // Writes the buffer into the control. Nothing once the dialog is gone: a second click can arrive
  // after the first one closed and disposed it.
  public apply(): void {
    if (this.isReadOnly || this.isDisposed) return;
    this.owner.applyFilterState(this.state);
  }
  public dispose(): void {
    this.cancelCountTimer();
    this.countRequest++;
    this.editorValue.dispose();
    this.presetsToolbarValue.dispose();
    this.expressionToolbarValue.dispose();
    this.searchClearActionValue.dispose();
    super.dispose();
  }

  private setBuffer(activeItemName: string, conditions: Array<IFilterCondition> | undefined, fields?: Array<IFilterCondition>): void {
    this.activeItemName = activeItemName;
    this.conditions = conditions;
    this.isFieldEdited = false;
    this.editorValue.setConditions(fields !== undefined ? fields : (conditions || []));
    this.updateExpression();
    this.updatePresetChips();
    this.scheduleCount();
  }
  // The text of the buffer's preset, a property a renderer re-renders by; the fields hidden under it
  // with several presets.
  private updateExpression(): void {
    const text = this.presetExpression;
    this.setPropertyValue("expressionText", text);
    this.editorValue.setFieldsVisible(!text || !this.owner.allowMultipleItems);
    this.updateNothingFound();
  }
  private getPresetTitle(): string {
    const item = this.getBufferItem();
    return !!item ? item.title : "";
  }
  private getBufferItem(): FilterItem {
    const name = this.activeItemName;
    return this.owner.allowMultipleItems ? this.owner.visibleItems.filter((i: FilterItem): boolean => i.name === name)[0] : this.owner.activeItem;
  }
  // The first edit of a field turns the buffer's preset off: from then on the fields are the filter.
  private onFieldChanged(): void {
    const hadExpression = !!this.getPropertyValue("expressionText");
    this.isFieldEdited = true;
    if (!!this.activeItemName) {
      this.activeItemName = "";
      this.updatePresetChips();
    }
    if (hadExpression) {
      this.updateExpression();
    }
    this.scheduleCount();
  }
  private onFilterTextChanged(): void {
    if (!this.editorValue) return;
    this.editorValue.setFilterText(this.filterText);
    this.updatePresetChips();
  }
  private getPresetChips(): Array<Action> {
    return this.presetsToolbarValue.actions.filter((a: Action): boolean => a !== this.addPresetAction && a !== this.editPresetAction);
  }
  private createPresetChips(): Array<Action> {
    if (!this.owner.allowMultipleItems) return [];
    const used: { [id: string]: boolean } = {};
    return this.owner.visibleItems.map((item: FilterItem): Action => {
      // A chip of its own even for a second preset with the same name, as in the control's list.
      const id = getUniqueFilterActionId("sv-filter-modal-item-" + item.name, (candidate: string): boolean => !!used[candidate]);
      used[id] = true;
      // A toggle: a checkbox, as aria-checked is not allowed on the default button role. A round pill,
      // dark while it is on.
      const chip = new Action({ id: id, enabled: !this.isReadOnly, iconSize: "auto", ariaRole: "checkbox", ariaChecked: false,
        innerCss: this.cssClasses.modalPreset, activeAppearance: { style: "neutral", mode: "primary" },
        action: (): void => { this.togglePreset(item); } });
      chip.locTitle = item.locTitle;
      chip.data = item;
      return chip;
    });
  }
  // The pills that are on, the ones Search in Filters finds; Add New where presets may be added, Edit
  // Selected - and Edit... at the text - while the preset picked may be changed; none of them in the
  // designer, in single mode or while the search looks.
  private updatePresetChips(): void {
    const text = normalizeTextForSearch((this.filterText || "").trim());
    this.getPresetChips().forEach((chip: Action): void => {
      const item: FilterItem = chip.data;
      chip.active = !!this.activeItemName && item.name === this.activeItemName;
      chip.ariaChecked = chip.active;
      chip.visible = !text || normalizeTextForSearch(item.title || "").indexOf(text) > -1;
    });
    const isEditable = !this.isReadOnly && this.owner.allowMultipleItems;
    const item = !!this.activeItemName ? this.getBufferItem() : undefined;
    const canEdit = isEditable && !!item && this.owner.getEditableItems().indexOf(item) > -1;
    this.addPresetAction.visible = isEditable && this.owner.canAddItems && !text;
    this.editPresetAction.visible = canEdit && !text;
    this.editExpressionAction.visible = canEdit;
    this.updateNothingFound();
  }
  private updateNothingFound(): void {
    if (!this.editorValue || !this.presetsToolbarValue) return;
    const isSearching = !!(this.filterText || "").trim();
    const hasPreset = this.getPresetChips().some((chip: Action): boolean => chip.visible);
    this.isNothingFound = isSearching && !hasPreset && !this.editorValue.hasVisibleFields;
  }
  private scheduleCount(): void {
    this.cancelCountTimer();
    this.isCounting = true;
    this.countTimer = setTimeout((): void => {
      this.countTimer = undefined;
      this.count();
    }, filterModalCountDelay);
  }
  private cancelCountTimer(): void {
    if (this.countTimer !== undefined) {
      clearTimeout(this.countTimer);
      this.countTimer = undefined;
    }
  }
  // Only the answer to the latest count is taken: an older one can arrive after it. A read-only dialog
  // has no button to show the count on (no footer), so it counts nothing: for a source that filters
  // itself, a count is a read.
  private count(): void {
    if (this.isReadOnly) {
      this.isCounting = false;
      return;
    }
    const request = ++this.countRequest;
    this.isCounting = true;
    const done = (count: number | undefined): void => {
      if (request !== this.countRequest || this.isDisposed) return;
      this.resultCount = count;
      this.isCounting = false;
    };
    this.owner.countFilterResults(this.owner.composeFilterExpression(this.state)).then(done, (): void => { done(undefined); });
  }
}
