import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { IFilterCondition, IFilterState } from "../interfaces/ui-interfaces";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor } from "./filter-conditions-editor";
import { filterUIStrings } from "./filter-ui-strings";

// What the Filters dialog reads from the control and calls on it: the control's public API only.
export interface IFilterModalOwner {
  visibleItems: Array<FilterItem>;
  allowMultipleItems: boolean;
  showSearch: boolean;
  searchPlaceholder: string;
  searchCss: { root: string, control: string };
  canEditConditions: boolean;
  cssClasses: any;
  getFilterState(): IFilterState;
  getItemConditions(name: string): Array<IFilterCondition> | null;
  composeFilterExpression(state: IFilterState): string;
  countFilterResults(expression: string): Promise<number | undefined>;
  applyFilterState(state: IFilterState): void;
  createModalEditor(onFieldChanged: () => void): FilterConditionsEditor;
  canAddItems: boolean;
  getEditableItems(): Array<FilterItem>;
  showPresetDialog(modal: FilterModal, isEdit: boolean): void;
}
// How long the dialog waits after a change before it counts the records again: a source on a
// server is asked once for a burst of clicks, not once per click.
export const filterModalCountDelay = 300;

// The Filters dialog: the search box, the presets and every field, all of it a buffer the control
// does not see until apply() - the dialog's "Show N items". Closing the dialog any other way drops
// it. The fields are an editor survey (FilterConditionsEditor, each field in the form of its kind);
// a preset turned on here shows its conditions there, and the first edit of a field turns it off -
// its conditions stay, with the edit. N is the number of records the buffer would leave, counted at
// once when the dialog opens and filterModalCountDelay after the changes stop. Made when the dialog
// opens, disposed when it closes.
export class FilterModal extends Base {
  // The preset turned on in the buffer, "" for none.
  @property({ defaultValue: "" }) activeItemName: string;
  // The number of records the buffer would leave; undefined while it is not known.
  @property() resultCount: number;
  @property({ defaultValue: false }) isCounting: boolean;
  private editorValue: FilterConditionsEditor;
  private presetsToolbarValue: ActionContainer;
  private creationToolbarValue: ActionContainer;
  private presetsTitleToolbarValue: ActionContainer;
  private addPresetAction: Action;
  private editPresetsAction: Action;
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
    this.presetsToolbarValue = new ActionContainer();
    this.presetsToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    this.presetsToolbarValue.setItems(this.createPresetChips(), false);
    this.updatePresetChips();
    this.addPresetAction = new Action({ id: "sv-filter-modal-add-preset", title: filterUIStrings.addPreset, iconName: "icon-plus-16x16",
      iconSize: "auto", action: (): void => { this.owner.showPresetDialog(this, false); } });
    this.creationToolbarValue = new ActionContainer();
    this.creationToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    this.creationToolbarValue.setItems([this.addPresetAction], false);
    this.editPresetsAction = new Action({ id: "sv-filter-modal-edit-presets", title: filterUIStrings.editPresets, showTitle: false,
      tooltip: filterUIStrings.editPresets, iconName: "icon-editsmall-16x16", iconSize: "auto",
      action: (): void => { this.owner.showPresetDialog(this, true); } });
    this.presetsTitleToolbarValue = new ActionContainer();
    this.presetsTitleToolbarValue.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "small" });
    this.presetsTitleToolbarValue.setItems([this.editPresetsAction], false);
    this.updatePresetActions();
    this.count();
  }
  public getType(): string { return "filtermodal"; }
  public get editor(): FilterConditionsEditor { return this.editorValue; }
  // The presets' chips; none in single mode, which has no preset to pick.
  public get presetsToolbar(): ActionContainer { return this.presetsToolbarValue; }
  // The row under the search box: Add Preset.
  public get creationToolbar(): ActionContainer { return this.creationToolbarValue; }
  // The pencil at the end of the presets' title, which opens Edit Presets.
  public get presetsTitleToolbar(): ActionContainer { return this.presetsTitleToolbarValue; }
  // The conditions the buffer filters by - a preset's that is on as it is, the fields' otherwise -
  // which a new preset starts with.
  public get presetConditions(): Array<IFilterCondition> {
    const state = this.state;
    if (state.conditions !== undefined) return [].concat(state.conditions);
    return this.owner.getItemConditions(state.activeItemName) || [];
  }
  // The presets changed under the dialog (Add Preset, Edit Presets): their chips are made again. The
  // buffer's preset, when one is on, shows what it is now in the fields - or, deleted, is off with no
  // conditions left.
  public refreshPresets(): void {
    if (this.isDisposed) return;
    const old = this.presetsToolbarValue.actions.slice();
    this.presetsToolbarValue.setItems(this.createPresetChips(), false);
    old.forEach((chip: Action): void => { chip.dispose(); });
    const name = this.activeItemName;
    if (!!name) {
      const isThere = this.owner.visibleItems.some((item: FilterItem): boolean => item.name === name);
      this.setBuffer(isThere ? name : "", isThere ? undefined : [], isThere ? (this.owner.getItemConditions(name) || []) : undefined);
    }
    this.updatePresetChips();
    this.updatePresetActions();
  }
  public get isReadOnly(): boolean { return !this.owner.canEditConditions; }
  public get showSearch(): boolean { return this.owner.showSearch; }
  public get searchPlaceholder(): string { return this.owner.searchPlaceholder; }
  // The search box is drawn the way the control's own is: as a text question's input.
  public get searchCss(): { root: string, control: string } { return this.owner.searchCss; }
  // The control's classes (the "filter" entry of the theme): the dialog is drawn outside the
  // control's own markup.
  public get cssClasses(): any { return this.owner.cssClasses; }
  // The buffer's search text.
  public get searchString(): string { return this.getPropertyValue("searchString", ""); }
  public set searchString(val: string) {
    val = val || "";
    if (val === this.searchString) return;
    this.setPropertyValue("searchString", val);
    this.scheduleCount();
  }
  // What the buffer holds, as the control applies it.
  public get state(): IFilterState {
    const conditions = this.isFieldEdited ? this.editorValue.getConditions() : this.conditions;
    return { activeItemName: this.activeItemName, conditions: conditions, searchString: this.searchString };
  }
  // The caption of the dialog's main button: "Show 12 items", or "Show results" while the number is
  // being counted or cannot be known.
  public get showResultsText(): string {
    const count = this.resultCount;
    if (this.isCounting || typeof count !== "number") return filterUIStrings.showResults;
    if (count === 1) return filterUIStrings.showOneResult;
    return filterUIStrings.showResultsCount.replace("{0}", count.toString());
  }
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
    this.creationToolbarValue.dispose();
    this.presetsTitleToolbarValue.dispose();
    super.dispose();
  }

  private setBuffer(activeItemName: string, conditions: Array<IFilterCondition> | undefined, fields?: Array<IFilterCondition>): void {
    this.activeItemName = activeItemName;
    this.conditions = conditions;
    this.isFieldEdited = false;
    this.editorValue.setConditions(fields !== undefined ? fields : (conditions || []));
    this.updatePresetChips();
    this.scheduleCount();
  }
  // The first edit of a field turns the buffer's preset off: from then on the fields are the filter.
  private onFieldChanged(): void {
    this.isFieldEdited = true;
    if (!!this.activeItemName) {
      this.activeItemName = "";
      this.updatePresetChips();
    }
    this.scheduleCount();
  }
  private createPresetChips(): Array<Action> {
    if (!this.owner.allowMultipleItems) return [];
    const used: { [id: string]: boolean } = {};
    return this.owner.visibleItems.map((item: FilterItem): Action => {
      // A chip of its own even for a second preset with the same name, as in the control's row.
      const base = "sv-filter-modal-item-" + item.name;
      let id = base;
      for (let n = 2; used[id]; n++) {
        id = base + "-" + n;
      }
      used[id] = true;
      const chip = new Action({ id: id, enabled: !this.isReadOnly, iconSize: "auto",
        iconName: item.type === "ai" ? "icon-sparkle-16x16" : undefined,
        activeAppearance: { style: "brand", mode: "primary" }, action: (): void => { this.togglePreset(item); } });
      chip.locTitle = item.locTitle;
      chip.data = item;
      return chip;
    });
  }
  // Add Preset where presets may be added, the pencil while a preset may be changed, deleted or
  // reset; neither in the designer or in single mode.
  private updatePresetActions(): void {
    const isEditable = !this.isReadOnly && this.owner.allowMultipleItems;
    this.addPresetAction.visible = isEditable && this.owner.canAddItems;
    this.editPresetsAction.visible = isEditable && this.owner.getEditableItems().length > 0;
  }
  private updatePresetChips(): void {
    this.presetsToolbarValue.actions.forEach((chip: Action): void => {
      chip.active = !!this.activeItemName && (<FilterItem>chip.data).name === this.activeItemName;
    });
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
  // Only the answer to the latest count is taken: an older one can arrive after it.
  private count(): void {
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
