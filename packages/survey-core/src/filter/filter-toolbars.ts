import { Base } from "../base";
import { property } from "../decorators";
import { Action, IAction } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { getActionDropdownButtonTarget } from "../actions/dropdown-action";
import { IDialogOptions, PopupModel } from "../popup";
import { settings } from "../settings";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor } from "./filter-conditions-editor";

// The captions the control's UI adds. Prototype strings, not localized yet: only the captions the
// library already has (clearCaption, filterStringPlaceholder, the dialog's Apply and Cancel) are.
export const filterUIStrings = {
  save: "Save",
  advanced: "Advanced...",
  dialogTitle: "Filter",
  searchLabel: "Search",
  searchPlaceholder: "Search by {0}",
  rawNote: "This preset has no editable conditions: the first edit starts a new filter.",
  readOnlyNote: "This preset cannot be edited."
};

// What a popup or a dialog shows: the editor it holds, if any. A popup renders its content even
// while it is hidden and does not re-render it when its content data changes, so a renderer
// watches this instead - and the holder is emptied, unmounting the editor's page, before the
// editor itself is disposed. actions is the bar a renderer draws under the editor: a badge's popup
// has its Clear there, the advanced dialog has none (Apply and Cancel are the dialog's own).
export class FilterEditorHolder extends Base {
  public getType(): string { return "filtereditorholder"; }
  @property() editor: FilterConditionsEditor;
  @property({ defaultValue: false }) isAdvanced: boolean;
  public actions: ActionContainer;
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
  isFastModeAvailable: boolean;
  isAdvancedModeAvailable: boolean;
  canEditConditions: boolean;
  getFastModeFieldStates(): Array<IFilterFieldState>;
  clearFieldCondition(name: string): void;
  createFastModeEditor(name: string): FilterConditionsEditor;
  createAdvancedModeEditor(): FilterConditionsEditor;
  getSurveyRootElement(): HTMLElement;
}
// What the fields toolbar shows of one fast mode field: the key it is addressed by (getFieldKey), its
// title and its condition's text ("" with no condition).
export interface IFilterFieldState {
  key: string;
  title: string;
  text: string;
}
// The content component both the badge popups and the advanced dialog show.
export const filterEditorComponentName = "sv-filter-conditions-editor";

// The control's UI as standard action bars: the question owns them the way a matrix owns its
// toolbar, and a renderer only draws them with sv-action-bar. Kept in sync by update(), which the
// control calls on every change of its state - imperatively and not through ComputedUpdater: the
// control's getters branch, and an updater collects its dependencies on its first run only.
export class FilterToolbars {
  private itemsToolbarValue: ActionContainer;
  private itemNames: Array<string>;
  private saveAction: Action;
  private clearAction: Action;
  private fieldsToolbarValue: ActionContainer;
  private fieldKeys: Array<string>;
  private fieldHolders: Array<FilterEditorHolder> = [];
  private advancedAction: Action;
  private advancedHolder: FilterEditorHolder;
  private advancedDialog: any;
  // Where Save and Clear are now: in the fields row while there are no presets to show (see
  // update()). Both rows build from this value, so they never disagree; undefined until a row is built.
  private isEditInFields: boolean;

  constructor(private owner: IFilterToolbarsOwner, private createContainer: (adaptive: boolean) => ActionContainer) {
  }

  // The presets, then Save and Clear at the end of the row. With no presets to show - none authored,
  // or single mode - Save and Clear are in the fields row and this row is empty.
  public get itemsToolbar(): ActionContainer {
    if (!this.itemsToolbarValue) {
      this.initEditPlacement();
      this.itemsToolbarValue = this.createContainer(true);
      this.itemsToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
      this.rebuildItems();
      this.updateItems();
    }
    return this.itemsToolbarValue;
  }
  // A badge per fast mode field (its condition's text, or the field's title), then Save and Clear when
  // there are no presets to show, then Advanced at the end of the row. A field's condition is cleared
  // from inside its badge's popup.
  public get fieldsToolbar(): ActionContainer {
    if (!this.fieldsToolbarValue) {
      this.initEditPlacement();
      this.fieldsToolbarValue = this.createContainer(true);
      this.fieldsToolbarValue.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
      const states = this.getFieldStates();
      this.rebuildFields(states.map((state: IFilterFieldState): string => state.key));
      this.updateFields(states);
    }
    return this.fieldsToolbarValue;
  }
  // Save and Clear move when the presets come or go. The row that gives them up is rebuilt first: a
  // container that drops an action clears its owner, and the row that takes them sets it again.
  public update(): void {
    const isEditInFields = !this.hasPresets;
    const isMoved = this.isEditInFields !== undefined && this.isEditInFields !== isEditInFields;
    this.isEditInFields = isEditInFields;
    if (isEditInFields) {
      this.updateItemsRow(isMoved);
      this.updateFieldsRow(isMoved);
    } else {
      this.updateFieldsRow(isMoved);
      this.updateItemsRow(isMoved);
    }
  }
  private get hasPresets(): boolean { return this.owner.visibleItems.length > 0; }
  private initEditPlacement(): void {
    if (this.isEditInFields === undefined) {
      this.isEditInFields = !this.hasPresets;
    }
  }
  private updateItemsRow(isRebuildNeeded: boolean): void {
    if (!this.itemsToolbarValue) return;
    if (isRebuildNeeded || !this.isSameList(this.itemNames, this.getItemNames())) {
      this.rebuildItems();
    }
    this.updateItems();
  }
  private updateFieldsRow(isRebuildNeeded: boolean): void {
    if (!this.fieldsToolbarValue) return;
    const states = this.getFieldStates();
    const keys = states.map((state: IFilterFieldState): string => state.key);
    if (isRebuildNeeded || !this.isSameList(this.fieldKeys, keys)) {
      this.rebuildFields(keys);
    }
    this.updateFields(states);
  }
  // A locale change reaches the captions the library owns (Clear) through the containers; the badges'
  // texts are composed here, so they are composed again.
  public locStrsChanged(): void {
    if (!!this.itemsToolbarValue) {
      this.itemsToolbarValue.locStrsChanged();
    }
    if (!!this.fieldsToolbarValue) {
      this.fieldsToolbarValue.locStrsChanged();
    }
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
    const holder = new FilterEditorHolder();
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
        this.releaseEditor(holder);
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
      this.releaseEditor(this.advancedHolder);
    }
    this.advancedDialog = undefined;
    this.advancedHolder = undefined;
    this.disposeFieldActions();
    if (!!this.fieldsToolbarValue) {
      this.fieldsToolbarValue.dispose();
      this.fieldsToolbarValue = undefined;
    }
    this.advancedAction = undefined;
    if (!!this.itemsToolbarValue) {
      this.itemsToolbarValue.dispose();
      this.itemsToolbarValue = undefined;
    }
    this.saveAction = undefined;
    this.clearAction = undefined;
    this.isEditInFields = undefined;
  }

  private getItemNames(): Array<string> {
    return this.owner.visibleItems.map((item: FilterItem): string => item.name);
  }
  private isSameList(a: Array<string>, b: Array<string>): boolean {
    return !!a && a.length === b.length && a.every((v: string, i: number): boolean => v === b[i]);
  }
  private getItemActionId(item: FilterItem): string { return "sv-filter-item-" + item.name; }
  // A preset's action borrows the preset's own title string, so a retitled preset and a locale
  // change reach the button without an update. Save and Clear are made once and kept: they are the
  // same two buttons whatever presets stand before them.
  private rebuildItems(): void {
    const toolbar = this.itemsToolbarValue;
    toolbar.actions.forEach((a: Action): void => {
      if (a !== this.saveAction && a !== this.clearAction) a.dispose();
    });
    const actions: Array<IAction> = this.owner.visibleItems.map((item: FilterItem): Action => {
      const a = new Action({
        id: this.getItemActionId(item),
        action: (): void => { this.owner.toggleItem(item); }
      });
      // Borrowed after the constructor, so it stays off innerItem: every overflow menu copy made from
      // innerItem would subscribe to the preset's string and never let go. The copies get the text
      // itself - updateItems() keeps innerItem's title current.
      a.locTitle = item.locTitle;
      return a;
    });
    if (!this.isEditInFields) {
      this.addEditActions(actions);
    }
    this.itemNames = this.getItemNames();
    toolbar.setItems(actions);
  }
  // Save and Clear are made once and kept: they are the same two buttons whichever row shows them and
  // whatever stands before them. Design mode has neither.
  private addEditActions(actions: Array<IAction>): void {
    if (this.owner.isDesignMode) return;
    if (!this.saveAction) {
      this.saveAction = new Action({
        id: "sv-filter-save",
        title: filterUIStrings.save,
        appearance: { style: "brand" },
        disableHide: true,
        visible: false,
        action: (): void => { this.owner.saveActiveItem(); }
      });
      // The same caption and look as the Clear of a radiogroup.
      this.clearAction = new Action({
        id: "sv-filter-clear",
        locTitleName: "clearCaption",
        appearance: { style: "alert" },
        disableHide: true,
        visible: false,
        action: (): void => { this.owner.clearActiveItem(); }
      });
    }
    actions.push(this.saveAction, this.clearAction);
  }
  // One read of the fields per update: the control is asked on every change of its state, and a
  // bound control rebuilds its field list on every read.
  private getFieldStates(): Array<IFilterFieldState> {
    return this.owner.isFastModeAvailable ? this.owner.getFastModeFieldStates() : [];
  }
  private getBadgeId(key: string): string { return "sv-filter-field-" + key; }
  private getClearId(key: string): string { return "sv-filter-clear-" + key; }
  // An open popup is closed and its editor released before its badge goes: a disposed popup never
  // reports that it was hidden.
  private disposeFieldActions(): void {
    this.fieldHolders.forEach((holder: FilterEditorHolder): void => {
      this.releaseEditor(holder);
      holder.actions.dispose();
    });
    this.fieldHolders = [];
    if (!this.fieldsToolbarValue) return;
    this.fieldsToolbarValue.actions.forEach((a: Action): void => {
      if (a === this.advancedAction || a === this.saveAction || a === this.clearAction) return;
      if (!!a.popupModel) a.popupModel.hide();
      a.dispose();
    });
  }
  private rebuildFields(keys: Array<string>): void {
    this.disposeFieldActions();
    const actions: Array<IAction> = [];
    keys.forEach((key: string): void => { actions.push(this.createBadge(key)); });
    if (this.isEditInFields) {
      this.addEditActions(actions);
    }
    if (!this.advancedAction) {
      this.advancedAction = new Action({
        id: "sv-filter-advanced",
        title: filterUIStrings.advanced,
        needSpace: true,
        disableHide: true,
        action: (): void => { this.showAdvancedEditor(); }
      });
    }
    actions.push(this.advancedAction);
    this.fieldKeys = keys;
    this.fieldsToolbarValue.setItems(actions);
  }
  // A standard dropdown action whose popup holds the field's editor: made when the popup shows,
  // released when it hides. A badge the row had no room for sits in the overflow menu, where its
  // popup has no button to open under - it opens the advanced dialog instead, which has every field.
  private createBadge(key: string): Action {
    const holder = new FilterEditorHolder();
    this.fieldHolders.push(holder);
    const popup = new PopupModel(filterEditorComponentName, { holder: holder },
      { showPointer: false, verticalPosition: "bottom", horizontalPosition: "center" });
    // One button in a popup: nothing to fold into an overflow menu, so not an adaptive bar. Its caption
    // and look are the Clear of the presets row. Clearing ends the edit, so the popup closes with it.
    holder.actions = this.createContainer(false);
    holder.actions.setActionsAppearance({ style: "neutral", mode: "secondary", size: "small" });
    holder.actions.setItems([{
      id: this.getClearId(key),
      locTitleName: "clearCaption",
      appearance: { style: "alert" },
      needSpace: true,
      visible: false,
      action: (): void => {
        this.owner.clearFieldCondition(key);
        popup.hide();
      }
    }]);
    popup.getTargetCallback = getActionDropdownButtonTarget;
    const id = this.getBadgeId(key);
    const badge = new Action({
      id: id,
      action: (): void => {
        if (badge.mode === "popup") {
          this.showAdvancedEditor();
        } else {
          popup.toggleVisibility();
        }
      }
    });
    // Set after the constructor, so they stay off innerItem: the overflow menu copies innerItem, and a
    // copy that were a dropdown with this popup would draw a bare button and a second popup inside the
    // menu. The copy stays a plain menu item whose click runs the action above.
    badge.component = "sv-action-bar-item-dropdown";
    badge.popupModel = popup;
    popup.onVisibilityChanged.add((_: PopupModel, options: { isVisible: boolean }): void => {
      this.releaseEditor(holder);
      if (options.isVisible) {
        holder.editor = this.owner.createFastModeEditor(key);
      }
      // An open badge stays in the row: a condition's longer text or its clear button would otherwise
      // push it into the overflow menu, and its popup would be left open under a hidden button.
      badge.disableHide = options.isVisible;
    });
    return badge;
  }
  // The holder is emptied first: a renderer watching it unmounts the editor's page, and only then
  // is the editor disposed - a disposed question that re-renders has nothing left to render from.
  private releaseEditor(holder: FilterEditorHolder): void {
    const editor = holder.editor;
    if (!editor) return;
    holder.editor = undefined;
    editor.dispose();
  }
  private updateFields(states: Array<IFilterFieldState>): void {
    const canEdit = this.owner.canEditConditions;
    states.forEach((state: IFilterFieldState): void => {
      const badge = this.fieldsToolbarValue.getActionById(this.getBadgeId(state.key));
      if (!badge) return;
      const text = state.text;
      this.setState(badge, "title", text || state.title || state.key);
      this.setState(badge, "active", !!text);
      const clear = badge.popupModel.contentComponentData.holder.actions.getActionById(this.getClearId(state.key));
      if (!!clear) clear.visible = !!text && canEdit;
    });
    if (!!this.advancedAction) {
      this.setState(this.advancedAction, "visible", this.owner.isAdvancedModeAvailable);
    }
    this.updateRightGroup(this.isEditInFields ? [this.saveAction, this.clearAction, this.advancedAction] : [this.advancedAction]);
  }
  // The buttons at the right end of a row. Save and Clear follow the control, and the first button
  // shown takes the space: the group keeps to the right, and a button that comes or goes moves none
  // after it - Advanced stays where it is when Clear shows up before it.
  private updateRightGroup(group: Array<Action>): void {
    if (!!this.saveAction) {
      this.setState(this.saveAction, "visible", this.owner.canSaveActiveItem);
      this.setState(this.clearAction, "visible", this.owner.canClearActiveItem);
    }
    let isSpaceTaken = false;
    group.forEach((a: Action): void => {
      if (!a) return;
      this.setState(a, "needSpace", !isSpaceTaken && a.visible);
      if (a.visible) isSpaceTaken = true;
    });
  }
  // An adaptive container's overflow menu makes its items anew from each hidden action's innerItem -
  // the options the action was created from - so whatever changes an action after it was made is
  // written there too, or the menu would show the action as it was born: untitled, hidden, inactive.
  private setState(action: Action, name: string, value: any): void {
    (<any>action)[name] = value;
    const options: any = action.innerItem;
    if (!!options && options !== action) {
      options[name] = value;
    }
  }
  private updateItems(): void {
    const active = this.owner.activeItem;
    this.owner.visibleItems.forEach((item: FilterItem): void => {
      const a = this.itemsToolbarValue.getActionById(this.getItemActionId(item));
      if (!!a) {
        this.setState(a, "title", item.title);
        this.setState(a, "active", item === active);
      }
    });
    if (!this.isEditInFields) {
      this.updateRightGroup([this.saveAction, this.clearAction]);
    }
  }
}
