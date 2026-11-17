import { Base, ComputedUpdater } from "../base";
import { property } from "../decorators";
import { Action, IAction, IActionAppearance } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { createPopupModelWithListModel } from "../actions/dropdown-action";
import { ListModel } from "../list";
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
import { FilterSaveAsPopup } from "./filter-save-as-popup";
import { FilterEditPresetDialog, FilterPresetDialog } from "./filter-preset-dialog";
import { filterUIStrings } from "./filter-ui-strings";
export { filterUIStrings } from "./filter-ui-strings";

// What a popup or a dialog shows: a badge's FilterFieldPopup, "Save as..."'s FilterSaveAsPopup, or
// the Filters dialog. A popup
// renders its content even while it is hidden and does not re-render it when its content data
// changes, so a renderer watches this instead - and the holder is emptied, unmounting what it held,
// before that is disposed. cssClasses are the control's: a popup and a dialog are drawn outside the
// control's markup.
// Whoever fills a holder empties it before disposing what it held (see FilterToolbars.release), so a
// holder never holds a disposed model and the renderers don't ask: keep it that way. A holder that is
// done with - its dialog closed, its chip gone, the control disposed - is emptied first and disposed
// after (FilterToolbars.releaseHolder).
export class FilterEditorHolder extends Base {
  public getType(): string { return "filtereditorholder"; }
  @property() fieldPopup: FilterFieldPopup;
  @property() saveAsPopup: FilterSaveAsPopup;
  @property() modal: FilterModal;
  @property() presetDialog: FilterPresetDialog;
  public cssClasses: any;
}

// A chip that can be reset where it stands: a field's chip, while it has a condition, has a clear
// button at its end - a click on the chip opens its popup, a click on the cross clears the field.
// The cross is a button of its own, drawn next to the chip's (in the box boxCss names) and placed
// over its end: a button inside a button is not allowed. It goes with the chip. isClearable is the
// chip's own: what a renderer re-renders the chip by when the cross comes or goes.
export class FilterChip extends Action {
  @property({ defaultValue: false }) isClearable: boolean;
  public clearAction: Action;
  public boxCss: string;
  // The chip's own class, which the clearable modifier is added to.
  public chipCss: string;
  public dispose(): void {
    if (!!this.clearAction) {
      this.clearAction.dispose();
    }
    super.dispose();
  }
}

// What the toolbars read from the control and call on it. Only the control's public API: the
// toolbars hold no filter state of their own and decide nothing the control does not answer.
export interface IFilterToolbarsOwner {
  visibleItems: Array<FilterItem>;
  activeItem: FilterItem;
  toggleItem(item: FilterItem | string): void;
  // A button clicked in the designer, where it does nothing of its own: the presets' chip names the
  // preset it shows, every other button - and the presets' chip showing none - the control itself
  // (item undefined).
  onDesignItemClick(item?: FilterItem): void;
  canSaveActiveItem: boolean;
  saveActiveItem(): void;
  canAddItems: boolean;
  canClearActiveItem: boolean;
  clearActiveItem(): void;
  clearFieldCondition(name: string): void;
  isDesignMode: boolean;
  // The control's own readOnly: the buttons are disabled and open nothing (never in the designer).
  isControlReadOnly: boolean;
  isMobile: boolean;
  isLocked: boolean;
  showSearch: boolean;
  searchString: string;
  isSearchDisabled: boolean;
  activeConditionCount: number;
  isFastModeAvailable: boolean;
  isAdvancedModeAvailable: boolean;
  cssClasses: any;
  getFastModeFieldStates(): Array<IFilterFieldState>;
  createFieldPopup(name: string, close: () => void): FilterFieldPopup;
  createSaveAsPopup(close: () => void): FilterSaveAsPopup;
  createFilterModal(): FilterModal;
  createAddPresetDialog(conditions: Array<IFilterCondition>, expression?: string): FilterPresetDialog;
  createEditPresetDialog(itemName: string): FilterEditPresetDialog;
  getSurveyRootElement(): HTMLElement;
  getLocale(): string;
  // The chips that open a popup, in their order: what a renderer draws the popups from (see
  // FilterToolbars.updatePopupChips).
  popupChips: Array<FilterChip>;
}
// What the chips row shows of one fast mode field: the key it is addressed by (getFieldKey), its
// title, the editor its popup opens and its condition's text ("" with no condition).
export interface IFilterFieldState {
  key: string;
  title: string;
  kind: FilterFieldEditorKind;
  text: string;
}
// A row of the presets' list and the preset it picks.
interface IFilterPresetRow {
  item: FilterItem;
  row: Action;
}
// The content component of the Filters dialog, of a badge's popup, and the component of a chip.
export const filterModalComponentName = "sv-filter-modal";
export const filterFieldPopupComponentName = "sv-filter-field-popup";
export const filterSaveAsPopupComponentName = "sv-filter-save-as-popup";
export const filterChipComponentName = "sv-filter-chip";
export const filterPresetDialogComponentName = "sv-filter-preset-dialog";

// The control's UI as standard action bars the question owns, drawn with sv-action-bar:
// - the chips row: Filters (when there is no search box to stand next to), the presets' chip, a badge
//   per fast mode field and "Show More" last;
// - the clear row: Save (single mode only), "Save as..." and Clear All, at the right end of the chips
//   row;
// - the search row: Filters, next to the search box.
// A badge with a condition has a cross that clears it (FilterChip), one without has the chevron of
// its popup. The presets are one chip that opens their list: "Preset" while none is on, the active
// preset's title and a cross that turns it off otherwise. The badges show the active preset's
// conditions and stay editable: an edit - a cross too - turns the preset off and keeps them
// (QuestionFilterModel.editConditions). Only a preset with no conditions to show locks the badges
// (QuestionFilterModel.isLocked): no chevron or cross, no popup, and a click turns the preset off.
// Kept in sync by update(), which the control calls on
// every change of its state. Containers are not adaptive: chips that do not fit wrap, and
// FilterChipsLayout cuts the collapsed row to one.
export class FilterToolbars {
  private chipsToolbarValue: ActionContainer;
  private clearToolbarValue: ActionContainer;
  private searchToolbarValue: ActionContainer;
  private layoutValue: FilterChipsLayout;
  private filtersAction: Action;
  private moreAction: Action;
  private searchClearActionValue: Action;
  private saveAction: Action;
  private saveAsAction: FilterChip;
  private saveAsHolder: FilterEditorHolder;
  private clearAction: Action;
  private fieldChips: { [key: string]: { chip: FilterChip, holder: FilterEditorHolder } } = {};
  private presetChip: FilterChip;
  // The rows of the presets' list, one per visible preset. Compared by object and not by id: a preset
  // replaced by another one of the same name (a restored uiState, a new items array) has a new row with
  // the same id.
  private presetRows: Array<IFilterPresetRow> = [];
  // The chips the row holds, in order.
  private rowChips: Array<Action>;
  private advancedHolder: FilterEditorHolder;
  private advancedDialog: PopupModalViewModel;
  // The one dialog open over the Filters dialog - New Preset or Edit Preset: what the dialog host
  // returned, its model, and the holder it is drawn from.
  private subDialog: PopupModalViewModel;
  private subDialogModel: FilterPresetDialog;
  private subDialogHolder: FilterEditorHolder;
  private isUpdating: boolean;
  private isUpdatePending: boolean;
  // isControlReadOnly as of the last update: the dialogs close when it changes, not on every update.
  // Taken at creation too: a dialog can open from code before any row is built.
  private wasControlReadOnly: boolean;

  // requestUpdate: how a row built on first request asks for its first update - through the control,
  // which runs every update as one pass over its fields (QuestionFilterModel.updateToolbars).
  constructor(private owner: IFilterToolbarsOwner, private createContainer: (adaptive: boolean) => ActionContainer,
    private requestUpdate?: () => void) {
    this.wasControlReadOnly = !!owner.isControlReadOnly;
  }

  public get chipsToolbar(): ActionContainer {
    if (!this.chipsToolbarValue) {
      this.chipsToolbarValue = this.createRow();
      this.chipsToolbarValue.setCssClasses({ itemMarkerIcon: this.cssClasses.chipMarker });
      this.updateNewRow();
    }
    return this.chipsToolbarValue;
  }
  public get clearToolbar(): ActionContainer {
    if (!this.clearToolbarValue) {
      this.clearToolbarValue = this.createRow();
      this.updateNewRow();
    }
    return this.clearToolbarValue;
  }
  public get searchToolbar(): ActionContainer {
    if (!this.searchToolbarValue) {
      this.searchToolbarValue = this.createRow();
      this.updateNewRow();
    }
    return this.searchToolbarValue;
  }
  private updateNewRow(): void {
    if (!!this.requestUpdate) {
      this.requestUpdate();
    } else {
      this.update();
    }
  }
  // The search box's clear button: a small icon button inside the box, drawn while there is text to
  // clear (QuestionFilterModel.showSearchClear). With the search row's classes: it is not in the row.
  public get searchClearAction(): Action {
    if (!this.searchClearActionValue) {
      const action = new Action({ id: "sv-filter-search-clear", locTitleName: "clearCaption", showTitle: false,
        iconName: "icon-cancel-24x24", iconSize: "auto", innerCss: this.cssClasses.searchClear,
        appearance: { style: "neutral", mode: "tertiary", size: "small" }, action: (): void => {
          if (!this.owner.isSearchDisabled) {
            this.owner.searchString = "";
          }
        } });
      // The row's classes and the row's locale: the row is the control's.
      const row = this.searchToolbar;
      action.cssClasses = row.cssClasses;
      action.owner = row;
      this.searchClearActionValue = action;
    }
    return this.searchClearActionValue;
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
    const isReadOnly = !!this.owner.isControlReadOnly;
    if (isReadOnly !== this.wasControlReadOnly) {
      this.wasControlReadOnly = isReadOnly;
      this.closeDialogs();
    }
    this.updateSearchRow();
    this.updateChipsRow();
    this.updateClearRow();
  }
  // A locale change reaches the captions the library owns (Clear, Apply) through the containers. The
  // chips' texts are composed by update(): the control runs it when what they are composed of changed
  // (QuestionFilterModel.locStrsChanged).
  public locStrsChanged(): void {
    [this.chipsToolbarValue, this.clearToolbarValue, this.searchToolbarValue].forEach((c: ActionContainer): void => {
      if (!!c) c.locStrsChanged();
    });
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
        this.releaseHolder(holder);
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
  // New Preset, or Edit Preset of the preset picked there, over the Filters dialog that opened it - see
  // FilterPresetDialog and FilterEditPresetDialog. Its Apply writes the preset into the control and
  // refreshes that dialog's presets, or keeps it open while the preset has errors; Edit Preset's
  // Delete deletes the preset, refreshes them and closes it; any other way it closes writes nothing.
  // Edit Preset opens only for a preset the respondent may change or delete. One at a time.
  public showPresetDialog(modal: FilterModal, isEdit: boolean): void {
    if (!settings.showDialog || !!this.subDialog || !modal || modal.isDisposed) return;
    const edit = isEdit ? this.owner.createEditPresetDialog(modal.activeItemName) : undefined;
    if (!!edit && !edit.item) {
      edit.dispose();
      return;
    }
    const dialogModel: FilterPresetDialog = edit || this.owner.createAddPresetDialog(modal.presetConditions, modal.presetExpression);
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
    this.setPresetDialogFooter(this.subDialog, dialogModel, (): void => { modal.refreshPresets(); });
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
      this.releaseHolder(holder);
    }
    if (!!model && !model.isDisposed) model.dispose();
  }
  // A control that turns read-only closes what it opened, and so does one that turns editable: a dialog
  // is built for the mode it opened in. The dialog over the Filters dialog first; each one's onHide
  // releases it. One opened from code while the control is read-only stays open until the mode changes.
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
    return toCssClasses(css.modal, css.presetDialog, this.owner.isMobile && css.modalMobile);
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
  // Cancel on the left - Delete in its place for a preset Edit Preset may delete - and Apply on the
  // right, as in the mockup. Apply is off while the dialog cannot apply (canApply).
  private setPresetDialogFooter(dialog: PopupModalViewModel, dialogModel: FilterPresetDialog, onDeleted: () => void): void {
    const footer: ActionContainer = !!dialog ? dialog.footerToolbar : undefined;
    if (!footer) return;
    const locale = this.owner.getLocale();
    const edit = dialogModel instanceof FilterEditPresetDialog ? dialogModel : undefined;
    const left = !!edit && edit.canDelete ?
      new Action({ id: "sv-filter-preset-delete", title: filterUIStrings.deletePreset, iconName: "icon-delete-24x24", iconSize: "auto",
        appearance: { style: "alert", mode: "secondary" }, action: (): void => {
          if (!edit.deletePreset()) return;
          onDeleted();
          dialog.model.hide();
        } }) :
      new Action({ id: "sv-filter-preset-cancel", title: getLocaleString("modalCancelButtonText", locale), appearance: { style: "brand", mode: "secondary" },
        action: (): void => { dialog.cancel(); } });
    footer.setItems([left,
      new Action({ id: "sv-filter-preset-apply", title: getLocaleString("modalApplyButtonText", locale), needSpace: true,
        appearance: { style: "brand", mode: "primary" }, enabled: <any>new ComputedUpdater<boolean>((): boolean => dialogModel.canApply),
        action: (): void => { dialog.apply(); } })
    ]);
  }
  // Every action is the toolbars' own - the chips, Filters, Show More, Save, Clear All - and the rows only
  // show them: the rows are emptied and disposed first, then each action is disposed once.
  public dispose(): void {
    if (!!this.subDialog && !!this.subDialog.model) {
      this.subDialog.model.hide();
    }
    this.releaseSubDialog();
    if (!!this.advancedDialog && !!this.advancedDialog.model) {
      this.advancedDialog.model.hide();
    }
    if (!!this.advancedHolder) {
      this.releaseHolder(this.advancedHolder);
    }
    this.advancedDialog = undefined;
    this.advancedHolder = undefined;
    const actions: Array<Action> = Object.keys(this.fieldChips).map((key: string): Action => this.takeFieldChip(key));
    if (!!this.presetChip) {
      this.presetChip.popupModel.hide();
    }
    // The list's rows go with the list, and the list with the chip's popup.
    this.presetRows = [];
    this.rowChips = undefined;
    if (!!this.saveAsAction) {
      this.saveAsAction.popupModel.hide();
      this.releaseHolder(this.saveAsHolder);
    }
    [this.filtersAction, this.presetChip, this.moreAction, this.saveAction, this.saveAsAction, this.clearAction,
      this.searchClearActionValue].forEach((a: Action): void => {
      if (!!a) actions.push(a);
    });
    this.filtersAction = undefined;
    this.presetChip = undefined;
    this.searchClearActionValue = undefined;
    this.moreAction = undefined;
    this.saveAction = undefined;
    this.saveAsAction = undefined;
    this.saveAsHolder = undefined;
    this.clearAction = undefined;
    this.owner.popupChips = [];
    [this.chipsToolbarValue, this.clearToolbarValue, this.searchToolbarValue].forEach((row: ActionContainer): void => {
      if (!row) return;
      row.actions.splice(0, row.actions.length);
      row.dispose();
    });
    this.chipsToolbarValue = undefined;
    this.clearToolbarValue = undefined;
    this.searchToolbarValue = undefined;
    actions.forEach((a: Action): void => { a.dispose(); });
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
  // text changes. A chip that is gone is disposed once the row no longer holds it.
  private updateChipsRow(): void {
    if (!this.chipsToolbarValue) return;
    const states = this.owner.isFastModeAvailable ? this.owner.getFastModeFieldStates() : [];
    const items = this.owner.visibleItems;
    const gone = this.takeGoneChips(states);
    const chips: Array<Action> = [];
    if (!this.isFiltersInSearchRow && this.isFiltersShown) chips.push(this.getFiltersAction());
    if (items.length > 0) chips.push(this.getPresetChip());
    states.forEach((state: IFilterFieldState): void => { chips.push(this.getFieldChip(state.key)); });
    chips.push(this.getMoreAction());
    if (!this.isSameList(this.rowChips, chips)) {
      this.rowChips = chips;
      this.chipsToolbarValue.setItems(chips, false);
    }
    this.updatePopupChips();
    gone.forEach((chip: Action): void => { chip.dispose(); });
    states.forEach((state: IFilterFieldState): void => { this.updateFieldChip(state); });
    if (!!this.presetChip) {
      this.updatePresetChip(items);
    }
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
      this.saveAsAction = this.createSaveAsAction();
      this.clearToolbarValue.setItems([this.saveAction, this.saveAsAction, this.clearAction], false);
      this.updatePopupChips();
    }
    const isEditable = !this.owner.isDesignMode && !this.owner.isControlReadOnly;
    this.saveAction.visible = isEditable && this.owner.canSaveActiveItem;
    // What the respondent set with no preset on - an edit over a preset turns it off - may become a
    // preset of their own.
    this.saveAsAction.visible = isEditable && this.owner.canAddItems && !this.owner.activeItem && this.owner.activeConditionCount > 0;
    if (!this.saveAsAction.visible) {
      this.saveAsAction.popupModel.hide();
    }
    this.clearAction.visible = isEditable && this.owner.canClearActiveItem;
  }
  // "Save as...": a button whose popup - under it, a sheet on a phone, as a badge's - names the new
  // preset (FilterSaveAsPopup). Drawn as a chip is, with no cross.
  private createSaveAsAction(): FilterChip {
    const holder = this.createHolder();
    this.saveAsHolder = holder;
    // Centered under the button and moved back into the window when it does not fit ("flex" mode):
    // the button stands at the right end of the row, and a popup with its left edge on the button's
    // ("fixed", as a badge's) would run past the window's edge.
    const popup = new PopupModel(filterSaveAsPopupComponentName, { holder: holder },
      { showPointer: false, verticalPosition: "bottom", horizontalPosition: "center" });
    popup.onFooterActionsCreated.add((_: PopupModel, options: { actions: Array<IAction> }): void => {
      options.actions = [];
    });
    popup.onVisibilityChanged.add((_: PopupModel, options: { isVisible: boolean }): void => {
      this.release(holder);
      if (options.isVisible) {
        holder.saveAsPopup = this.owner.createSaveAsPopup((): void => { popup.hide(); });
      }
    });
    const action = new FilterChip({ id: "sv-filter-save-as", component: filterChipComponentName, title: filterUIStrings.saveAs,
      innerCss: this.cssClasses.saveAs, appearance: { style: "brand", mode: "secondary" }, visible: false,
      action: (): void => {
        if (!popup.isVisible) {
          this.updateFieldPopupMode(popup);
        }
        popup.toggleVisibility();
      } });
    action.boxCss = this.cssClasses.chipBox;
    this.setChipPopup(action, popup);
    return action;
  }

  private getFiltersAction(): Action {
    if (!this.filtersAction) {
      // In the designer the button is a picture of itself and reports the click, so the designer can
      // select the control: an action stops the click event, the designer would never see it.
      // showAdvancedEditor() itself still opens the dialog read-only there.
      this.filtersAction = new Action({ id: "sv-filter-filters", iconSize: "auto",
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
    // The set draws this icon as three sliders at 24px and as two at 16px. The chips row shows its
    // icons at 16px, and the mockup's Filters chip has the two sliders.
    action.iconName = this.isFiltersInSearchRow ? "icon-filter-24x24" : "icon-filter-16x16";
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

  private getFieldChip(key: string): FilterChip {
    let entry = this.fieldChips[key];
    if (!entry) {
      const holder = this.createHolder();
      const popup = new PopupModel(filterFieldPopupComponentName, { holder: holder },
        { showPointer: false, verticalPosition: "bottom", horizontalPosition: "center" });
      // Under the chip, its left edge on the chip's.
      popup.positionMode = "fixed";
      const chip = new FilterChip({ id: "sv-filter-field-" + key, component: filterChipComponentName, innerCss: this.cssClasses.chip,
        activeAppearance: { style: "brand", mode: "primary" }, action: (): void => { this.onFieldChipClick(key); } });
      chip.boxCss = this.cssClasses.chipBox;
      chip.chipCss = this.cssClasses.chip;
      chip.clearAction = this.createChipClearAction("sv-filter-clear-" + key, { style: "brand", mode: "primary" },
        (): void => { this.owner.clearFieldCondition(key); });
      this.setChipPopup(chip, popup);
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
  // The menu's class puts it 8px off the chip and lets a click outside it reach the page (sd-filter.scss),
  // as a dropdown's list does: the menu hides as the focus leaves it, so one click on another chip, the
  // search box or a button closes it and works.
  private updateFieldPopupMode(popup: PopupModel): void {
    const isSheet = this.owner.isMobile;
    popup.displayMode = isSheet ? "overlay" : "popup";
    popup.overlayDisplayMode = "dropdown-overlay";
    popup.cssClass = isSheet ? toCssClasses("sv-popup--sheet", this.cssClasses.popupSheet) : toCssClasses(this.cssClasses.chipPopup);
    popup.isFocusedContent = !isSheet;
    popup.hideOnFocusOut = !isSheet;
  }
  private updateFieldChip(state: IFilterFieldState): void {
    const chip = this.fieldChips[state.key].chip;
    const isLocked = this.owner.isLocked;
    const isReadOnly = this.owner.isControlReadOnly;
    chip.title = state.text || state.title || state.key;
    chip.active = !!state.text;
    // A chip that opens nothing - locked, or read-only (it keeps its active colors) - has neither the
    // chevron nor the cross. One that opens its popup has the chevron, or the cross while it has a
    // condition to clear.
    const canOpen = !isLocked && !isReadOnly;
    this.updateChipClearAction(chip, canOpen && chip.active, state.title || state.key);
    chip.markerIconName = canOpen && !chip.active ? "icon-chevrondown-16x16" : undefined;
    chip.enabled = !isReadOnly;
    if (isLocked || isReadOnly) {
      chip.popupModel.hide();
    }
  }
  // The cross of a chip (FilterChip): an icon button with the chip's own colors while it is active,
  // labelled by what it clears. In the designer it is a picture of itself, as the chip is, and reports
  // the click. Small, as the row's chips are.
  private createChipClearAction(id: string, appearance: Partial<IActionAppearance>, clear: () => void): Action {
    return new Action({ id: id, iconName: "icon-close-16x16", iconSize: "auto", visible: false,
      innerCss: this.cssClasses.chipClear, appearance: Object.assign({ size: "small" }, appearance), action: (): void => {
        if (this.owner.isDesignMode) {
          this.owner.onDesignItemClick();
        } else if (!this.owner.isControlReadOnly) {
          clear();
        }
      } });
  }
  private updateChipClearAction(chip: FilterChip, isVisible: boolean, title: string): void {
    const clear = chip.clearAction;
    const label = filterUIStrings.clearChip.replace("{0}", title);
    // The row's classes, which the chip has from the row: the cross is not in the row.
    clear.cssClasses = chip.cssClasses;
    clear.visible = isVisible;
    chip.isClearable = isVisible;
    clear.ariaLabel = label;
    clear.tooltip = label;
    chip.innerCss = toCssClasses(chip.chipCss, isVisible && this.cssClasses.chipClearable);
  }
  // The presets' chip and the list it opens - the standard list popup, under the chip as a badge's
  // popup is, a sheet on a phone. A pick turns the preset on (the active one stays on) and closes the
  // list; the chip's cross turns it off. In the designer the chip opens nothing and reports the click
  // on the preset it shows, or on the control while it shows none.
  private getPresetChip(): FilterChip {
    if (!this.presetChip) {
      const popup = createPopupModelWithListModel({ items: [], allowSelection: true, onSelectionChanged: (row: IAction): void => {
        const item: FilterItem = row.data;
        if (this.owner.isDesignMode || this.owner.isControlReadOnly) return;
        if (!!item && item !== this.owner.activeItem) {
          this.owner.toggleItem(item);
        }
      } }, { showPointer: false, verticalPosition: "bottom", horizontalPosition: "center" });
      // One preset is painted: the pointer moves the focus, a key moves the highlight off the hovered one.
      (<ListModel>popup.contentComponentData.model).focusFollowsPointer = true;
      popup.positionMode = "fixed";
      popup.onFooterActionsCreated.add((_: PopupModel, options: { actions: Array<IAction> }): void => {
        options.actions = [];
      });
      const chip = new FilterChip({ id: "sv-filter-preset", component: filterChipComponentName,
        innerCss: toCssClasses(this.cssClasses.chip, this.cssClasses.chipPreset), iconName: "icon-star-16x16", iconSize: "auto",
        activeAppearance: { style: "neutral", mode: "primary" }, action: (): void => { this.onPresetChipClick(); } });
      chip.boxCss = this.cssClasses.chipBox;
      chip.chipCss = toCssClasses(this.cssClasses.chip, this.cssClasses.chipPreset);
      chip.clearAction = this.createChipClearAction("sv-filter-preset-clear", { style: "neutral", mode: "primary" },
        (): void => { this.owner.clearActiveItem(); });
      this.setChipPopup(chip, popup);
      this.presetChip = chip;
    }
    return this.presetChip;
  }
  private get presetList(): ListModel { return this.presetChip.popupModel.contentComponentData.model; }
  private onPresetChipClick(): void {
    if (this.owner.isDesignMode) {
      this.owner.onDesignItemClick(this.owner.activeItem);
      return;
    }
    if (this.owner.isControlReadOnly) return;
    const popup = this.presetChip.popupModel;
    if (!popup.isVisible) {
      this.updateFieldPopupMode(popup);
      // The list moves the focus to its first preset as it opens: its class shows that focus only
      // when a keyboard gave it (sd-filter.scss).
      popup.cssClass = toCssClasses(popup.cssClass, this.cssClasses.presetList);
    }
    popup.toggleVisibility();
  }
  private updatePresetChip(items: Array<FilterItem>): void {
    const chip = this.presetChip;
    const active = this.owner.activeItem;
    const isReadOnly = this.owner.isControlReadOnly;
    const isOn = !!active && items.indexOf(active) > -1;
    this.updatePresetRows(items);
    chip.title = isOn ? active.title : filterUIStrings.preset;
    chip.active = isOn;
    this.updateChipClearAction(chip, isOn && !isReadOnly, chip.title);
    chip.markerIconName = !isReadOnly && !isOn ? "icon-chevrondown-16x16" : undefined;
    chip.enabled = !isReadOnly;
    if (isReadOnly || items.length === 0) {
      chip.popupModel.hide();
    }
    const selected = this.presetRows.filter((e: IFilterPresetRow): boolean => e.item === active)[0];
    this.presetList.selectedItem = !!selected ? selected.row : undefined;
  }
  // A row of its own even for a second preset with the same name (an authoring error): the list tells
  // its rows apart by id, and so does a renderer. A row borrows its preset's title, so a retitled preset
  // and a locale change reach it without an update.
  private updatePresetRows(items: Array<FilterItem>): void {
    const old = this.presetRows;
    const rows: Array<IFilterPresetRow> = items.map((item: FilterItem): IFilterPresetRow =>
      old.filter((e: IFilterPresetRow): boolean => e.item === item)[0] || { item: item, row: undefined });
    const used: { [id: string]: boolean } = {};
    rows.forEach((e: IFilterPresetRow): void => {
      if (!!e.row) used[e.row.id] = true;
    });
    rows.forEach((e: IFilterPresetRow): void => {
      if (!!e.row) return;
      const id = getUniqueFilterActionId("sv-filter-item-" + e.item.name, (candidate: string): boolean => !!used[candidate]);
      used[id] = true;
      e.row = new Action({ id: id, data: e.item });
      e.row.locTitle = e.item.locTitle;
    });
    this.presetRows = rows;
    const newRows = rows.map((e: IFilterPresetRow): Action => e.row);
    if (this.isSameList(old.map((e: IFilterPresetRow): Action => e.row), newRows)) return;
    this.presetList.setItems(newRows, false);
    old.filter((e: IFilterPresetRow): boolean => newRows.indexOf(e.row) < 0).forEach((e: IFilterPresetRow): void => { e.row.dispose(); });
  }
  // A field that is no longer shown takes its chip with it: the chips that are gone, which the caller
  // disposes once the row no longer holds them.
  private takeGoneChips(states: Array<IFilterFieldState>): Array<Action> {
    const res: Array<Action> = [];
    Object.keys(this.fieldChips).forEach((key: string): void => {
      if (!states.some((state: IFilterFieldState): boolean => state.key === key)) {
        res.push(this.takeFieldChip(key));
      }
    });
    return res;
  }
  // A badge's chip, let go of: its open popup is closed and its holder released at once - a disposed
  // popup never reports that it was hidden. The caller disposes the chip, and the chip its popup.
  private takeFieldChip(key: string): Action {
    const entry = this.fieldChips[key];
    delete this.fieldChips[key];
    entry.chip.popupModel.hide();
    this.releaseHolder(entry.holder);
    return entry.chip;
  }
  // A holder that is done with: emptied, then disposed - the renderer that watches it unmounts first.
  private releaseHolder(holder: FilterEditorHolder): void {
    if (holder.isDisposed) return;
    this.release(holder);
    holder.dispose();
  }
  // The holder is emptied first: a renderer watching it unmounts what it held, and only then is that
  // disposed - a disposed question that re-renders has nothing left to render from.
  private release(holder: FilterEditorHolder): void {
    const modal = holder.modal;
    const fieldPopup = holder.fieldPopup;
    const saveAsPopup = holder.saveAsPopup;
    const presetDialog = holder.presetDialog;
    holder.modal = undefined;
    holder.fieldPopup = undefined;
    holder.saveAsPopup = undefined;
    holder.presetDialog = undefined;
    if (!!modal) modal.dispose();
    if (!!fieldPopup) fieldPopup.dispose();
    if (!!saveAsPopup) saveAsPopup.dispose();
    if (!!presetDialog) presetDialog.dispose();
  }
  // A chip's popup is drawn next to the chips' action bar, not inside the chip (see
  // QuestionFilterModel.popupChips), so it stands against the chip's own button: the button its
  // renderer sets as the chip's input element.
  private setChipPopup(chip: FilterChip, popup: PopupModel): void {
    popup.getTargetCallback = (): HTMLElement => chip.getInputElement();
    chip.popupModel = popup;
  }
  // The chips that open a popup, in their order: the presets' chip and the badges as the chips row
  // holds them, then Save as. Reported before a chip that is gone is disposed: the renderer unmounts
  // its popup first.
  private updatePopupChips(): void {
    const res: Array<FilterChip> = (this.rowChips || []).filter((a: Action): boolean => a instanceof FilterChip) as Array<FilterChip>;
    if (!!this.saveAsAction) res.push(this.saveAsAction);
    if (!this.isSameList(this.owner.popupChips, res)) {
      this.owner.popupChips = res;
    }
  }
  private isSameList<T>(a: Array<T>, b: Array<T>): boolean {
    return !!a && a.length === b.length && a.every((v: T, i: number): boolean => v === b[i]);
  }
}
