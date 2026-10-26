import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { getActionDropdownButtonTarget } from "../actions/dropdown-action";
import { IDialogOptions, PopupModel } from "../popup";
import { settings } from "../settings";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor } from "./filter-conditions-editor";
import { FilterFieldEditorKind } from "./filter-field-kinds";
import { FilterFieldPopup } from "./filter-field-popup";
import { FilterChipsLayout } from "./filter-chips-layout";
import { filterUIStrings } from "./filter-ui-strings";
export { filterUIStrings } from "./filter-ui-strings";

// What a popup or a dialog shows: a badge's FilterFieldPopup, or the advanced dialog's editor. A
// popup renders its content even while it is hidden and does not re-render it when its content data
// changes, so a renderer watches this instead - and the holder is emptied, unmounting what it held,
// before that is disposed. cssClasses are the control's: a popup and a dialog are drawn outside the
// control's markup.
export class FilterEditorHolder extends Base {
  public getType(): string { return "filtereditorholder"; }
  @property() editor: FilterConditionsEditor;
  @property() fieldPopup: FilterFieldPopup;
  @property({ defaultValue: false }) isAdvanced: boolean;
  public cssClasses: any;
}

// What the toolbars read from the control and call on it. Only the control's public API: the
// toolbars hold no filter state of their own and decide nothing the control does not answer.
export interface IFilterToolbarsOwner {
  visibleItems: Array<FilterItem>;
  activeItem: FilterItem;
  toggleItem(item: FilterItem | string): void;
  canSaveActiveItem: boolean;
  saveActiveItem(): void;
  canClearActiveItem: boolean;
  clearActiveItem(): void;
  isDesignMode: boolean;
  isMobile: boolean;
  isLocked: boolean;
  showSearch: boolean;
  activeConditionCount: number;
  isFastModeAvailable: boolean;
  isAdvancedModeAvailable: boolean;
  cssClasses: any;
  getFastModeFieldStates(): Array<IFilterFieldState>;
  createFieldPopup(name: string, close: () => void): FilterFieldPopup;
  createAdvancedModeEditor(): FilterConditionsEditor;
  getSurveyRootElement(): HTMLElement;
}
// What the chips row shows of one fast mode field: the key it is addressed by (getFieldKey), its
// title, the editor its popup opens and its condition's text ("" with no condition).
export interface IFilterFieldState {
  key: string;
  title: string;
  kind: FilterFieldEditorKind;
  text: string;
}
// The content component of the advanced dialog, of a badge's popup, and the component of a chip.
export const filterEditorComponentName = "sv-filter-conditions-editor";
export const filterFieldPopupComponentName = "sv-filter-field-popup";
export const filterChipComponentName = "sv-filter-chip";

// The control's UI as standard action bars the question owns, drawn with sv-action-bar:
// - the chips row: Filters (when there is no search box to stand next to), the active preset, a
//   badge per fast mode field, the other presets and "Show More" last;
// - the clear row: Save (single mode only) and Clear All, at the right end of the chips row;
// - the search row: Filters, next to the search box.
// An active preset locks the chips (see QuestionFilterModel.isLocked): the badges show its
// conditions with no chevron and no popup, and a click on any chip only turns the filter off. Kept
// in sync by update(), which the control calls on every change of its state. Containers are not
// adaptive: chips that do not fit wrap, and FilterChipsLayout cuts the collapsed row to one.
export class FilterToolbars {
  private chipsToolbarValue: ActionContainer;
  private clearToolbarValue: ActionContainer;
  private searchToolbarValue: ActionContainer;
  private layoutValue: FilterChipsLayout;
  private filtersAction: Action;
  private moreAction: Action;
  private saveAction: Action;
  private clearAction: Action;
  private fieldChips: { [key: string]: { chip: Action, holder: FilterEditorHolder } } = {};
  private itemChips: Array<{ item: FilterItem, chip: Action }> = [];
  private chipIds: Array<string>;
  private advancedHolder: FilterEditorHolder;
  private advancedDialog: any;

  constructor(private owner: IFilterToolbarsOwner, private createContainer: (adaptive: boolean) => ActionContainer) {
  }

  public get chipsToolbar(): ActionContainer {
    if (!this.chipsToolbarValue) {
      this.chipsToolbarValue = this.createRow("small");
      this.chipsToolbarValue.setCssClasses({ itemMarkerIcon: this.cssClasses.chipMarker });
      this.update();
    }
    return this.chipsToolbarValue;
  }
  public get clearToolbar(): ActionContainer {
    if (!this.clearToolbarValue) {
      this.clearToolbarValue = this.createRow("small");
      this.update();
    }
    return this.clearToolbarValue;
  }
  public get searchToolbar(): ActionContainer {
    if (!this.searchToolbarValue) {
      this.searchToolbarValue = this.createRow("medium");
      this.update();
    }
    return this.searchToolbarValue;
  }
  public get layout(): FilterChipsLayout {
    if (!this.layoutValue) {
      this.layoutValue = new FilterChipsLayout();
      this.layoutValue.isMobile = this.owner.isMobile;
      this.layoutValue.onPropertyChanged.add((): void => { this.updateOverflow(); });
    }
    return this.layoutValue;
  }
  public update(): void {
    if (!!this.layoutValue) {
      this.layoutValue.isMobile = this.owner.isMobile;
    }
    this.updateSearchRow();
    this.updateChipsRow();
    this.updateClearRow();
  }
  // A locale change reaches the captions the library owns (Clear, Apply) through the containers; the
  // chips' texts are composed here, so they are composed again.
  public locStrsChanged(): void {
    [this.chipsToolbarValue, this.clearToolbarValue, this.searchToolbarValue].forEach((c: ActionContainer): void => {
      if (!!c) c.locStrsChanged();
    });
    this.update();
  }
  // All of the fields at once, in a dialog: settings.showDialog mounts it through a portal into the
  // survey's root element - outside the survey's <form>, still under its theme - the way Creator
  // opens its modal property editors. Any way it closes ends in onHide. With no dialog host (no
  // survey rendered) there is nothing to open, and one dialog is open at a time.
  public showAdvancedEditor(): void {
    if (!settings.showDialog || !!this.advancedDialog) return;
    const editor = this.owner.createAdvancedModeEditor();
    if (!editor) return;
    const holder = this.createHolder();
    holder.isAdvanced = true;
    holder.editor = editor;
    this.advancedHolder = holder;
    const options: IDialogOptions = {
      componentName: filterEditorComponentName,
      data: { holder: holder },
      onApply: (): boolean => {
        editor.apply();
        return true;
      },
      onCancel: (): void => { },
      onHide: (): void => {
        this.release(holder);
        this.advancedDialog = undefined;
        this.advancedHolder = undefined;
      },
      title: filterUIStrings.dialogTitle,
      displayMode: "popup"
    };
    this.advancedDialog = settings.showDialog(options, this.owner.getSurveyRootElement());
  }
  public dispose(): void {
    if (!!this.advancedDialog && !!this.advancedDialog.model) {
      this.advancedDialog.model.hide();
    }
    if (!!this.advancedHolder) {
      this.release(this.advancedHolder);
    }
    this.advancedDialog = undefined;
    this.advancedHolder = undefined;
    Object.keys(this.fieldChips).forEach((key: string): void => { this.disposeFieldChip(key); });
    this.itemChips.forEach((entry: { item: FilterItem, chip: Action }): void => { entry.chip.dispose(); });
    this.itemChips = [];
    [this.chipsToolbarValue, this.clearToolbarValue, this.searchToolbarValue].forEach((c: ActionContainer): void => {
      if (!!c) c.dispose();
    });
    this.chipsToolbarValue = undefined;
    this.clearToolbarValue = undefined;
    this.searchToolbarValue = undefined;
    [this.filtersAction, this.moreAction, this.saveAction, this.clearAction].forEach((a: Action): void => {
      if (!!a) a.dispose();
    });
    this.filtersAction = undefined;
    this.moreAction = undefined;
    this.saveAction = undefined;
    this.clearAction = undefined;
    if (!!this.layoutValue) {
      this.layoutValue.dispose();
      this.layoutValue = undefined;
    }
  }

  private get cssClasses(): any { return this.owner.cssClasses || {}; }
  private createRow(size: "small" | "medium"): ActionContainer {
    const container = this.createContainer(false);
    container.setActionsAppearance({ style: "neutral", mode: "secondary", size: size });
    return container;
  }
  private createHolder(): FilterEditorHolder {
    const holder = new FilterEditorHolder();
    holder.cssClasses = this.cssClasses;
    return holder;
  }
  private get isFiltersShown(): boolean { return this.owner.isAdvancedModeAvailable; }
  private get isFiltersInSearchRow(): boolean { return this.owner.showSearch; }

  private updateSearchRow(): void {
    if (!this.searchToolbarValue) return;
    const items = this.isFiltersInSearchRow && this.isFiltersShown ? [this.getFiltersAction()] : [];
    if (!this.isSameList(this.searchToolbarValue.actions.map((a: Action): string => a.id), items.map((a: Action): string => a.id))) {
      this.searchToolbarValue.setItems(items, false);
    }
    this.updateFiltersAction();
  }
  // The chips in their order. The row is rebuilt only when that order changes - a chip that comes or
  // goes, or a preset that is turned on and moves to the front; otherwise the chips are updated in
  // place, so a badge's open popup stays open while its text changes.
  private updateChipsRow(): void {
    if (!this.chipsToolbarValue) return;
    const states = this.owner.isFastModeAvailable ? this.owner.getFastModeFieldStates() : [];
    const items = this.owner.visibleItems;
    const active = this.owner.isLocked ? this.owner.activeItem : undefined;
    this.releaseGoneChips(states, items);
    const chips: Array<Action> = [];
    if (!this.isFiltersInSearchRow && this.isFiltersShown) chips.push(this.getFiltersAction());
    if (!!active && items.indexOf(active) > -1) chips.push(this.getItemChip(active));
    states.forEach((state: IFilterFieldState): void => { chips.push(this.getFieldChip(state.key)); });
    items.forEach((item: FilterItem): void => {
      if (item !== active) chips.push(this.getItemChip(item));
    });
    chips.push(this.getMoreAction());
    const ids = chips.map((a: Action): string => a.id);
    if (!this.isSameList(this.chipIds, ids)) {
      this.chipIds = ids;
      this.chipsToolbarValue.setItems(chips, false);
    }
    states.forEach((state: IFilterFieldState): void => { this.updateFieldChip(state); });
    this.itemChips.forEach((entry: { item: FilterItem, chip: Action }): void => { this.updateItemChip(entry.item, entry.chip); });
    this.updateFiltersAction();
    this.updateOverflow();
  }
  private updateClearRow(): void {
    if (!this.clearToolbarValue) return;
    if (!this.clearAction) {
      this.saveAction = new Action({ id: "sv-filter-save", title: filterUIStrings.save, appearance: { style: "brand" },
        visible: false, action: (): void => { this.owner.saveActiveItem(); } });
      this.clearAction = new Action({ id: "sv-filter-clear", title: filterUIStrings.clearAll, iconName: "icon-close-16x16",
        iconSize: "auto", innerCss: this.cssClasses.clear, appearance: { showBorder: true }, visible: false,
        action: (): void => { this.owner.clearActiveItem(); } });
      this.clearToolbarValue.setItems([this.saveAction, this.clearAction], false);
    }
    const isEditable = !this.owner.isDesignMode;
    this.saveAction.visible = isEditable && this.owner.canSaveActiveItem;
    this.clearAction.visible = isEditable && this.owner.canClearActiveItem;
  }

  private getFiltersAction(): Action {
    if (!this.filtersAction) {
      this.filtersAction = new Action({ id: "sv-filter-filters", iconName: "icon-filter-24x24", iconSize: "auto",
        action: (): void => { this.showAdvancedEditor(); } });
    }
    return this.filtersAction;
  }
  // "Filters", or "Filters: 3" with conditions; a phone's search row has room for the icon and the
  // number only.
  private updateFiltersAction(): void {
    const action = this.filtersAction;
    if (!action) return;
    const count = this.owner.activeConditionCount;
    if (this.owner.isMobile && this.isFiltersInSearchRow) {
      action.title = count > 0 ? count.toString() : "";
    } else {
      action.title = count > 0 ? filterUIStrings.filtersCount.replace("{0}", count.toString()) : filterUIStrings.filters;
    }
    action.tooltip = filterUIStrings.filters;
  }
  private getMoreAction(): Action {
    if (!this.moreAction) {
      this.moreAction = new Action({ id: "sv-filter-more", innerCss: this.cssClasses.showMore,
        appearance: { mode: "tertiary" }, action: (): void => { this.layout.isExpanded = !this.layout.isExpanded; } });
    }
    return this.moreAction;
  }
  // The collapsed row shows the chips that fit (FilterChipsLayout.fitCount) and "Show More"; the
  // others are taken out of the flow but still rendered, so the next measure knows their widths.
  // "Show More" itself is rendered even when there is nothing more to show, for the same reason.
  private updateOverflow(): void {
    if (!this.chipsToolbarValue || !this.moreAction) return;
    const layout = this.layout;
    const hidden = this.cssClasses.chipOverflow;
    const fit = layout.fitCount;
    let index = 0;
    this.chipsToolbarValue.actions.forEach((a: Action): void => {
      if (a === this.moreAction) return;
      a.css = !layout.isExpanded && fit > -1 && index >= fit ? hidden : undefined;
      index++;
    });
    this.moreAction.title = layout.isExpanded ? filterUIStrings.showLess : filterUIStrings.showMore;
    this.moreAction.css = fit > -1 ? undefined : hidden;
  }

  private getFieldChip(key: string): Action {
    let entry = this.fieldChips[key];
    if (!entry) {
      const holder = this.createHolder();
      const popup = new PopupModel(filterFieldPopupComponentName, { holder: holder },
        { showPointer: false, verticalPosition: "bottom", horizontalPosition: "center" });
      // Under the chip, its left edge on the chip's.
      popup.positionMode = "fixed";
      popup.getTargetCallback = getActionDropdownButtonTarget;
      const chip = new Action({ id: "sv-filter-field-" + key, component: filterChipComponentName, innerCss: this.cssClasses.chip,
        activeAppearance: { style: "brand", mode: "primary" }, action: (): void => { this.onFieldChipClick(key); } });
      chip.popupModel = popup;
      popup.onVisibilityChanged.add((_: PopupModel, options: { isVisible: boolean }): void => {
        this.release(holder);
        if (options.isVisible) {
          holder.fieldPopup = this.owner.createFieldPopup(key, (): void => { popup.hide(); });
        }
      });
      entry = { chip: chip, holder: holder };
      this.fieldChips[key] = entry;
    }
    return entry.chip;
  }
  private onFieldChipClick(key: string): void {
    if (this.owner.isLocked) {
      this.owner.clearActiveItem();
      return;
    }
    this.fieldChips[key].chip.popupModel.toggleVisibility();
  }
  private updateFieldChip(state: IFilterFieldState): void {
    const chip = this.fieldChips[state.key].chip;
    const isLocked = this.owner.isLocked;
    chip.title = state.text || state.title || state.key;
    chip.active = !!state.text;
    chip.markerIconName = isLocked ? undefined : "icon-chevrondown-24x24";
    if (isLocked) {
      chip.popupModel.hide();
    }
  }
  private getItemChip(item: FilterItem): Action {
    let entry = this.itemChips.filter((e: { item: FilterItem, chip: Action }): boolean => e.item === item)[0];
    if (!entry) {
      const chip = new Action({ id: "sv-filter-item-" + item.name, innerCss: this.cssClasses.chip,
        activeAppearance: { style: "brand", mode: "primary" }, action: (): void => { this.onItemChipClick(item); } });
      // Borrowed after the constructor, so a retitled preset and a locale change reach the chip
      // without an update.
      chip.locTitle = item.locTitle;
      entry = { item: item, chip: chip };
      this.itemChips.push(entry);
    }
    return entry.chip;
  }
  private onItemChipClick(item: FilterItem): void {
    if (this.owner.isLocked) {
      this.owner.clearActiveItem();
      return;
    }
    this.owner.toggleItem(item);
  }
  private updateItemChip(item: FilterItem, chip: Action): void {
    chip.active = item === this.owner.activeItem;
    chip.iconName = item.type === "ai" ? "icon-sparkle-16x16" : undefined;
    chip.iconSize = "auto";
  }
  // A field or a preset that is no longer shown takes its chip with it; an open popup is closed and
  // what it held released first - a disposed popup never reports that it was hidden.
  private releaseGoneChips(states: Array<IFilterFieldState>, items: Array<FilterItem>): void {
    Object.keys(this.fieldChips).forEach((key: string): void => {
      if (!states.some((state: IFilterFieldState): boolean => state.key === key)) {
        this.disposeFieldChip(key);
      }
    });
    this.itemChips = this.itemChips.filter((entry: { item: FilterItem, chip: Action }): boolean => {
      if (items.indexOf(entry.item) > -1) return true;
      entry.chip.dispose();
      return false;
    });
  }
  private disposeFieldChip(key: string): void {
    const entry = this.fieldChips[key];
    if (!entry) return;
    delete this.fieldChips[key];
    entry.chip.popupModel.hide();
    this.release(entry.holder);
    entry.chip.popupModel.dispose();
    entry.chip.dispose();
  }
  // The holder is emptied first: a renderer watching it unmounts what it held, and only then is that
  // disposed - a disposed question that re-renders has nothing left to render from.
  private release(holder: FilterEditorHolder): void {
    const editor = holder.editor;
    const fieldPopup = holder.fieldPopup;
    holder.editor = undefined;
    holder.fieldPopup = undefined;
    if (!!editor) editor.dispose();
    if (!!fieldPopup) fieldPopup.dispose();
  }
  private isSameList(a: Array<string>, b: Array<string>): boolean {
    return !!a && a.length === b.length && a.every((v: string, i: number): boolean => v === b[i]);
  }
}
