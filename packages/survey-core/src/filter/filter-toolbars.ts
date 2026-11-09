import { Base, ComputedUpdater } from "../base";
import { property } from "../decorators";
import { Action, IAction } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { getActionDropdownButtonTarget } from "../actions/dropdown-action";
import { IDialogOptions, PopupModel } from "../popup";
import type { PopupModalViewModel } from "../popup-modal-view-model";
import { getLocaleString } from "../surveyStrings";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { settings } from "../settings";
import { toCssClasses } from "../utils/cssClassBuilder";
import { FilterItem, getUniqueFilterActionId } from "./filter-item";
import { FilterFieldEditorKind } from "./filter-field-kinds";
import { FilterFieldPopup } from "./filter-field-popup";
import { FilterChipsLayout } from "./filter-chips-layout";
import { FilterModal } from "./filter-modal";
import { FilterEditPresetsDialog, FilterPresetDialog } from "./filter-preset-dialog";
import { FilterAIDialog } from "./filter-ai-dialog";
import { filterUIStrings } from "./filter-ui-strings";
export { filterUIStrings } from "./filter-ui-strings";

// What a popup or a dialog shows: a badge's FilterFieldPopup, or the Filters dialog. A popup
// renders its content even while it is hidden and does not re-render it when its content data
// changes, so a renderer watches this instead - and the holder is emptied, unmounting what it held,
// before that is disposed. cssClasses are the control's: a popup and a dialog are drawn outside the
// control's markup.
// Whoever fills a holder empties it before disposing what it held (see FilterToolbars.release), so a
// holder never holds a disposed model and the renderers don't ask: keep it that way.
export class FilterEditorHolder extends Base {
  public getType(): string { return "filtereditorholder"; }
  @property() fieldPopup: FilterFieldPopup;
  @property() modal: FilterModal;
  @property() presetDialog: FilterPresetDialog;
  public cssClasses: any;
}

// What the toolbars read from the control and call on it. Only the control's public API: the
// toolbars hold no filter state of their own and decide nothing the control does not answer.
export interface IFilterToolbarsOwner {
  visibleItems: Array<FilterItem>;
  activeItem: FilterItem;
  toggleItem(item: FilterItem | string): void;
  // A button clicked in the designer, where it does nothing of its own: a preset's chip names its
  // preset, every other button the control itself (item undefined).
  onDesignItemClick(item?: FilterItem): void;
  canSaveActiveItem: boolean;
  saveActiveItem(): void;
  canClearActiveItem: boolean;
  clearActiveItem(): void;
  isDesignMode: boolean;
  // The control's own readOnly: the buttons are disabled and open nothing (never in the designer).
  isControlReadOnly: boolean;
  isMobile: boolean;
  isLocked: boolean;
  showSearch: boolean;
  activeConditionCount: number;
  isFastModeAvailable: boolean;
  isAdvancedModeAvailable: boolean;
  cssClasses: any;
  getFastModeFieldStates(): Array<IFilterFieldState>;
  createFieldPopup(name: string, close: () => void): FilterFieldPopup;
  createFilterModal(): FilterModal;
  createAddPresetDialog(conditions: Array<IFilterCondition>): FilterPresetDialog;
  createEditPresetsDialog(activeItemName?: string): FilterEditPresetsDialog;
  createAIDialog(): FilterAIDialog;
  getSurveyRootElement(): HTMLElement;
  getLocale(): string;
}
// What the chips row shows of one fast mode field: the key it is addressed by (getFieldKey), its
// title, the editor its popup opens and its condition's text ("" with no condition).
export interface IFilterFieldState {
  key: string;
  title: string;
  kind: FilterFieldEditorKind;
  text: string;
}
// The content component of the Filters dialog, of a badge's popup, and the component of a chip.
export const filterModalComponentName = "sv-filter-modal";
export const filterFieldPopupComponentName = "sv-filter-field-popup";
export const filterChipComponentName = "sv-filter-chip";
export const filterPresetDialogComponentName = "sv-filter-preset-dialog";

// The control's UI as standard action bars the question owns, drawn with sv-action-bar:
// - the chips row: Filters (when there is no search box to stand next to), a badge per fast mode
//   field, the presets and "Show More" last;
// - the clear row: Save (single mode only) and Clear All, at the right end of the chips row;
// - the search row: Filters, next to the search box.
// An active preset lights its chip where it stands, and the badges show its conditions and stay
// editable: an edit turns the preset off and keeps them (QuestionFilterModel.editConditions). Only a
// preset with no conditions to show locks the badges (QuestionFilterModel.isLocked): no chevron, no
// popup, and a click turns the preset off. Kept in sync by update(), which the control calls on
// every change of its state. Containers are not adaptive: chips that do not fit wrap, and
// FilterChipsLayout cuts the collapsed row to one.
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
  private advancedDialog: PopupModalViewModel;
  // The one dialog open over the Filters dialog - Add New Preset, Edit Presets or Create custom
  // filter: what the dialog host returned, its model, and the holder a preset dialog is drawn from
  // (Create custom filter is a survey, drawn with no holder).
  private subDialog: PopupModalViewModel;
  private subDialogModel: FilterPresetDialog | FilterAIDialog;
  private subDialogHolder: FilterEditorHolder;
  private isUpdating: boolean;
  private isUpdatePending: boolean;

  constructor(private owner: IFilterToolbarsOwner, private createContainer: (adaptive: boolean) => ActionContainer) {
  }

  public get chipsToolbar(): ActionContainer {
    if (!this.chipsToolbarValue) {
      this.chipsToolbarValue = this.createRow();
      this.chipsToolbarValue.setCssClasses({ itemMarkerIcon: this.cssClasses.chipMarker });
      this.update();
    }
    return this.chipsToolbarValue;
  }
  public get clearToolbar(): ActionContainer {
    if (!this.clearToolbarValue) {
      this.clearToolbarValue = this.createRow();
      this.update();
    }
    return this.clearToolbarValue;
  }
  public get searchToolbar(): ActionContainer {
    if (!this.searchToolbarValue) {
      this.searchToolbarValue = this.createRow();
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
  // An update asked for while one runs waits for it and then runs once more. Making the first chip
  // reads the control's css for the first time, and that sets the control's css properties - each a
  // change that asks for an update. Run there, it would build the chips again inside the first
  // build: the row would keep one chip and the toolbars would go on updating the other.
  public update(): void {
    if (this.isUpdating) {
      this.isUpdatePending = true;
      return;
    }
    this.isUpdating = true;
    this.isUpdatePending = false;
    try {
      this.updateRows();
      if (this.isUpdatePending) { this.updateRows(); }
    } finally {
      this.isUpdating = false;
    }
  }
  private updateRows(): void {
    const isMobile = this.owner.isMobile;
    if (!!this.layoutValue) {
      this.layoutValue.isMobile = isMobile;
    }
    this.updateDialogsMode(isMobile);
    if (this.owner.isControlReadOnly) {
      this.closeDialogs();
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
  // The Filters dialog (FilterModal): settings.showDialog mounts it through a portal into the
  // survey's root element - outside the survey's <form>, still under its theme - the way Creator
  // opens its modal property editors. On a phone it covers the screen: a class of its own does that,
  // the theme has no styles for the host's "overlay" mode. Any way it closes ends in
  // onHide, and only its main button applies it. With no dialog host (no survey rendered) there is
  // nothing to open, and one dialog is open at a time.
  public showAdvancedEditor(): void {
    if (!settings.showDialog || !!this.advancedDialog) return;
    const modal = this.owner.createFilterModal();
    if (!modal) return;
    const holder = this.createHolder();
    holder.modal = modal;
    this.advancedHolder = holder;
    this.advancedDialog = this.openDialog({
      componentName: filterModalComponentName,
      data: { holder: holder },
      onApply: (): boolean => {
        modal.apply();
        return true;
      },
      onHide: (): void => {
        this.release(holder);
        this.advancedDialog = undefined;
        this.advancedHolder = undefined;
      },
      title: filterUIStrings.dialogTitle,
      cssClass: this.getAdvancedDialogCss()
    });
    this.setModalFooter(this.advancedDialog, modal);
  }
  // What every dialog of the control shares: a close button, the host's "popup" mode, and no work on
  // cancel - only Apply writes anything. Returns what the dialog host returned.
  private openDialog(options: { componentName: string, data: any, onApply: () => boolean, onHide: () => void, title: string, cssClass: string }): PopupModalViewModel {
    const dialogOptions: IDialogOptions = {
      componentName: options.componentName,
      data: options.data,
      onApply: options.onApply,
      onCancel: (): void => { },
      onHide: options.onHide,
      title: options.title,
      showCloseButton: true,
      cssClass: options.cssClass,
      displayMode: "popup"
    };
    return settings.showDialog(dialogOptions, this.owner.getSurveyRootElement());
  }
  // The dialog's own Apply and Cancel give way to Clear All on the left and the main button on the
  // right, which says how many records it will show and applies the dialog through the dialog host
  // (onApply, then the dialog closes). In the designer there is nothing to clear or apply: only the
  // close button is left.
  private setModalFooter(dialog: PopupModalViewModel, modal: FilterModal): void {
    const footer: ActionContainer = !!dialog ? dialog.footerToolbar : undefined;
    if (!footer) return;
    if (modal.isReadOnly) {
      footer.setItems([]);
      return;
    }
    footer.setItems([
      new Action({ id: "sv-filter-modal-clear", title: filterUIStrings.clearAll, appearance: { style: "neutral", mode: "tertiary", showBorder: true },
        action: (): void => { modal.clearAll(); } }),
      new Action({ id: "sv-filter-modal-apply", needSpace: true, appearance: { style: "brand", mode: "primary" },
        title: <any>new ComputedUpdater<string>((): string => modal.showResultsText),
        action: (): void => { dialog.apply(); } })
    ]);
  }
  // Add New Preset or Edit Presets, over the Filters dialog that opened it - see FilterPresetDialog.
  // Its Apply writes the presets into the control and refreshes that dialog's presets, or keeps it
  // open while the preset has errors; any other way it closes writes nothing. One at a time.
  public showPresetDialog(modal: FilterModal, isEdit: boolean): void {
    if (!settings.showDialog || !!this.subDialog || !modal || modal.isDisposed) return;
    const dialogModel = isEdit ? this.owner.createEditPresetsDialog(modal.activeItemName) : this.owner.createAddPresetDialog(modal.presetConditions);
    const holder = this.createHolder();
    holder.presetDialog = dialogModel;
    this.subDialogHolder = holder;
    this.subDialogModel = dialogModel;
    this.subDialog = this.openDialog({
      componentName: filterPresetDialogComponentName,
      data: { holder: holder },
      onApply: (): boolean => {
        if (!dialogModel.apply()) return false;
        modal.refreshPresets();
        return true;
      },
      onHide: (): void => { this.releaseSubDialog(); },
      title: dialogModel.title,
      cssClass: this.getSubDialogCss()
    });
    this.setPresetDialogFooter(this.subDialog, dialogModel instanceof FilterEditPresetsDialog ? (): boolean => dialogModel.canApply : undefined);
  }
  // Create custom filter (FilterAIDialog), over the Filters dialog that opened it, in the place of a
  // preset dialog: one of them at a time. Its Apply adds the AI preset, refreshes that dialog's
  // presets and turns the new one on there, so its count says what the preset leaves; any other way
  // it closes writes nothing, and an answer that comes after is ignored. The dialog is one survey
  // (FilterAIDialog.survey), drawn by the "survey" component every renderer registers, as the records'
  // Sort by dialog is: no holder, the dialog is disposed once it closes.
  public showAIDialog(modal: FilterModal): void {
    if (!settings.showDialog || !!this.subDialog || !modal || modal.isDisposed) return;
    const dialogModel = this.owner.createAIDialog();
    this.subDialogModel = dialogModel;
    this.subDialog = this.openDialog({
      componentName: "survey",
      data: { model: dialogModel.survey, survey: dialogModel.survey },
      onApply: (): boolean => {
        if (!dialogModel.apply()) return false;
        modal.refreshPresets();
        modal.togglePreset(dialogModel.createdItem);
        return true;
      },
      onHide: (): void => { this.releaseSubDialog(); },
      title: dialogModel.title,
      cssClass: this.getSubDialogCss()
    });
    this.setPresetDialogFooter(this.subDialog, (): boolean => dialogModel.canApply);
  }
  // The dialog over the Filters dialog is gone (closed, or the control disposed): what it was drawn
  // from is released and its model disposed, once - onHide may come after dispose().
  private releaseSubDialog(): void {
    const holder = this.subDialogHolder;
    const model = this.subDialogModel;
    this.subDialog = undefined;
    this.subDialogHolder = undefined;
    this.subDialogModel = undefined;
    if (!!holder) {
      this.release(holder);
    }
    if (!!model && !model.isDisposed) model.dispose();
  }
  // A control that turns read-only closes what it opened: the dialog over the Filters dialog first.
  // Each one's onHide releases it.
  private closeDialogs(): void {
    if (!!this.subDialog && !!this.subDialog.model) {
      this.subDialog.model.hide();
    }
    if (!!this.advancedDialog && !!this.advancedDialog.model) {
      this.advancedDialog.model.hide();
    }
  }
  // The frame's classes: a phone's dialog covers the screen.
  private getAdvancedDialogCss(): string {
    return toCssClasses(this.cssClasses.modal, this.owner.isMobile && this.cssClasses.modalMobile);
  }
  private getSubDialogCss(): string {
    const css = this.cssClasses;
    return toCssClasses(css.modal, css.presetDialog, this.subDialogModel instanceof FilterAIDialog && css.aiDialog,
      this.owner.isMobile && css.modalMobile);
  }
  // The dialog host does not close a dialog on a rotation or a resize: the open dialogs follow the
  // control's isMobile - their frames and the surveys they show.
  private updateDialogsMode(isMobile: boolean): void {
    if (!!this.advancedDialog && !!this.advancedDialog.model) {
      this.advancedDialog.model.cssClass = this.getAdvancedDialogCss();
    }
    if (!!this.subDialogModel) {
      this.subDialogModel.setIsMobile(isMobile);
      if (!!this.subDialog && !!this.subDialog.model) {
        this.subDialog.model.cssClass = this.getSubDialogCss();
      }
    }
  }
  // Cancel on the left and Apply on the right, as in the mockup. canApply: Apply is off while it is false.
  private setPresetDialogFooter(dialog: PopupModalViewModel, canApply?: () => boolean): void {
    const footer: ActionContainer = !!dialog ? dialog.footerToolbar : undefined;
    if (!footer) return;
    const locale = this.owner.getLocale();
    const apply: IAction = { id: "sv-filter-preset-apply", title: getLocaleString("modalApplyButtonText", locale), needSpace: true,
      appearance: { style: "brand", mode: "primary" }, action: (): void => { dialog.apply(); } };
    if (!!canApply) {
      apply.enabled = <any>new ComputedUpdater<boolean>((): boolean => canApply());
    }
    footer.setItems([
      new Action({ id: "sv-filter-preset-cancel", title: getLocaleString("modalCancelButtonText", locale), appearance: { style: "brand", mode: "secondary" },
        action: (): void => { dialog.cancel(); } }),
      new Action(apply)
    ]);
  }
  public dispose(): void {
    if (!!this.subDialog && !!this.subDialog.model) {
      this.subDialog.model.hide();
    }
    this.releaseSubDialog();
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
  // Every row is small: 40px, as tall as the search box (see sd-filter.scss); the chips row makes
  // its text smaller still.
  private createRow(): ActionContainer {
    const container = this.createContainer(false);
    container.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
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
  // goes; otherwise the chips are updated in place, so a badge's open popup stays open while its
  // text changes.
  private updateChipsRow(): void {
    if (!this.chipsToolbarValue) return;
    const states = this.owner.isFastModeAvailable ? this.owner.getFastModeFieldStates() : [];
    const items = this.owner.visibleItems;
    this.releaseGoneChips(states, items);
    const chips: Array<Action> = [];
    if (!this.isFiltersInSearchRow && this.isFiltersShown) chips.push(this.getFiltersAction());
    states.forEach((state: IFilterFieldState): void => { chips.push(this.getFieldChip(state.key)); });
    items.forEach((item: FilterItem): void => { chips.push(this.getItemChip(item)); });
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
        iconSize: "auto", innerCss: this.cssClasses.clear, appearance: { style: "neutral", mode: "tertiary-surface", showBorder: true }, visible: false,
        action: (): void => { this.owner.clearActiveItem(); } });
      this.clearToolbarValue.setItems([this.saveAction, this.clearAction], false);
    }
    const isEditable = !this.owner.isDesignMode && !this.owner.isControlReadOnly;
    this.saveAction.visible = isEditable && this.owner.canSaveActiveItem;
    this.clearAction.visible = isEditable && this.owner.canClearActiveItem;
  }

  private getFiltersAction(): Action {
    if (!this.filtersAction) {
      // In the designer the button is a picture of itself and reports the click, so the designer can
      // select the control: an action stops the click event, the designer would never see it.
      // showAdvancedEditor() itself still opens the dialog read-only there.
      this.filtersAction = new Action({ id: "sv-filter-filters", iconName: "icon-filter-24x24", iconSize: "auto",
        action: (): void => {
          if (this.owner.isDesignMode) {
            this.owner.onDesignItemClick();
          } else if (!this.owner.isControlReadOnly) {
            this.showAdvancedEditor();
          }
        } });
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
    action.enabled = !this.owner.isControlReadOnly;
  }
  private getMoreAction(): Action {
    if (!this.moreAction) {
      this.moreAction = new Action({ id: "sv-filter-more", innerCss: this.cssClasses.showMore,
        appearance: { mode: "tertiary" }, action: (): void => {
          this.layout.isExpanded = !this.layout.isExpanded;
          // It works in the designer too, and reports the click there like the other buttons
          if (this.owner.isDesignMode) {
            this.owner.onDesignItemClick();
          }
        } });
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
      // Apply is in the popup's content: the sheet's own footer would add a Cancel under it.
      popup.onFooterActionsCreated.add((_: PopupModel, options: { actions: Array<IAction> }): void => {
        options.actions = [];
      });
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
    // No popup in the designer: its styles are the survey's, and nothing in it would work there.
    if (this.owner.isDesignMode) {
      this.owner.onDesignItemClick();
      return;
    }
    if (this.owner.isControlReadOnly) return;
    if (this.owner.isLocked) {
      this.owner.clearActiveItem();
      return;
    }
    const popup = this.fieldChips[key].chip.popupModel;
    if (!popup.isVisible) {
      this.updateFieldPopupMode(popup);
    }
    popup.toggleVisibility();
  }
  // Set on every open, so it opens in the mode the control is in now. On a phone it is a sheet at the
  // bottom of the screen, as the other popups are there: a menu under the chip closes on any scroll -
  // of the page under the phone's keyboard, of the chips row - and would close as it opens.
  // The sheet opens without the keyboard: the search box is focused when the respondent taps it. It
  // has no close button: its content has a title row of its own, and a tap on the dimmed page closes it.
  private updateFieldPopupMode(popup: PopupModel): void {
    const isSheet = this.owner.isMobile;
    popup.displayMode = isSheet ? "overlay" : "popup";
    popup.overlayDisplayMode = "dropdown-overlay";
    popup.cssClass = isSheet ? toCssClasses("sv-popup--sheet", this.cssClasses.popupSheet) : "";
    popup.isFocusedContent = !isSheet;
  }
  private updateFieldChip(state: IFilterFieldState): void {
    const chip = this.fieldChips[state.key].chip;
    const isLocked = this.owner.isLocked;
    chip.title = state.text || state.title || state.key;
    chip.active = !!state.text;
    chip.markerIconName = isLocked ? undefined : "icon-chevrondown-24x24";
    chip.enabled = !this.owner.isControlReadOnly;
    if (isLocked || this.owner.isControlReadOnly) {
      chip.popupModel.hide();
    }
  }
  private getItemChip(item: FilterItem): Action {
    let entry = this.itemChips.filter((e: { item: FilterItem, chip: Action }): boolean => e.item === item)[0];
    if (!entry) {
      // A chip of its own even for a second preset with the same name (an authoring error): the row
      // tells its chips apart by id, and so does a renderer.
      const id = getUniqueFilterActionId("sv-filter-item-" + item.name,
        (candidate: string): boolean => this.itemChips.some((e: { item: FilterItem, chip: Action }): boolean => e.chip.id === candidate));
      // A toggle: a checkbox, as aria-checked is not allowed on the default button role.
      const chip = new Action({ id: id, innerCss: this.cssClasses.chip, ariaRole: "checkbox", ariaChecked: false,
        activeAppearance: { style: "brand", mode: "primary" }, action: (): void => {
          if (this.owner.isDesignMode) {
            this.owner.onDesignItemClick(item);
          } else if (!this.owner.isControlReadOnly) {
            this.owner.toggleItem(item);
          }
        } });
      // Borrowed after the constructor, so a retitled preset and a locale change reach the chip
      // without an update.
      chip.locTitle = item.locTitle;
      entry = { item: item, chip: chip };
      this.itemChips.push(entry);
    }
    return entry.chip;
  }
  private updateItemChip(item: FilterItem, chip: Action): void {
    chip.active = item === this.owner.activeItem;
    chip.ariaChecked = chip.active;
    chip.enabled = !this.owner.isControlReadOnly;
    chip.iconName = item.kind === "ai" ? "icon-sparkle-16x16" : undefined;
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
    const modal = holder.modal;
    const fieldPopup = holder.fieldPopup;
    const presetDialog = holder.presetDialog;
    holder.modal = undefined;
    holder.fieldPopup = undefined;
    holder.presetDialog = undefined;
    if (!!modal) modal.dispose();
    if (!!fieldPopup) fieldPopup.dispose();
    if (!!presetDialog) presetDialog.dispose();
  }
  private isSameList(a: Array<string>, b: Array<string>): boolean {
    return !!a && a.length === b.length && a.every((v: string, i: number): boolean => v === b[i]);
  }
}
