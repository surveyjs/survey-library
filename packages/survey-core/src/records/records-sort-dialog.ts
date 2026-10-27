import { Base } from "../base";
import { Action, IAction } from "../actions/action";
import type { ActionContainer } from "../actions/container";
import { settings } from "../settings";
import type { IDialogOptions } from "../popup";
import type { PopupBaseViewModel } from "../popup-view-model";
import { classesToSelector } from "../utils/dom-utils";
import { ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";
import { getFirstSortDirection, getSortDirectionLocStringName } from "./records-sort-directions";
import { copySort, createSortDropdownAction, focusSortAction, getShownSortField, getSortDirectionListItems, getSortFieldItems,
  isFocusInsideOrIdle, isSameSort, ISortListKeys, setSortListItems } from "./records-sort-items";
import type { IRecordsSortBarOwner, IRecordsSortField } from "./records-sort-bar";

// What the dialog gets from the sort bar that opens it.
export interface IRecordsSortDialogOptions {
  // The field the first row shows while nothing is sorted: the one the bar's first level shows.
  shownField: string;
  // The respondent's sort, through the bar, which keeps the field it shows (IRecordsSortBarOwner.sortByUser).
  sortByUser(criteria: Array<ISortCriterion>): boolean;
  // A sort was applied: the bar shows it.
  onApplied(): void;
}

/* A row of the draft: a field and a direction - undefined when the row does not sort - and its own
   action bar: [field v] [direction v], plus a remove button from the second row on. The actions keep
   their row object, so a row keeps its actions while the rows before it are removed. */
interface ISortDialogRow {
  field: string;
  direction: SortDirection;
  container: ActionContainer;
  fieldAction: Action;
  directionAction: Action;
  remove: Action;
  keys: ISortListKeys;
}

/* The "Sort by" dialog that "More..." opens: every level of the sort as a row (SD03), a draft that sorts
   nothing until Apply (SD04). A row without a direction (Default in the first row, the dash item in a later one)
   does not sort, and Apply leaves it out (SD05). A field is in one row at most (SD07). The renderers show
   one action bar per row (sv-records-sort-dialog); the footer's Add New and Apply are the modal's. */
export class RecordsSortDialogModel extends Base {
  private rowsValue: Array<ISortDialogRow> = [];
  private rowCount = 0;
  private popupViewModel: PopupBaseViewModel;
  private addAction: Action;
  private applyAction: Action;

  constructor(private owner: IRecordsSortBarOwner, private options: IRecordsSortDialogOptions) {
    super();
    // An omitted direction is ascending: an imported level always sorts.
    const sort = copySort(owner.sortCriteria);
    sort.forEach((item: ISortCriterion): void => { this.rowsValue.push(this.createRow(item.field, item.direction)); });
    if (sort.length === 0 && !!options.shownField) {
      this.rowsValue.push(this.createRow(options.shownField, undefined));
    }
    this.update();
  }
  public getType(): string {
    return "recordssortdialog";
  }
  // The action bar of every row, in order.
  public get rows(): Array<ActionContainer> {
    return this.getPropertyValue("rows", []);
  }
  public get rootCss(): string {
    return this.owner.getCssClasses().sortDialog;
  }
  // Add New shows while the draft has fewer than maxSortLevel rows and an offered field no row has.
  public get canAddRow(): boolean {
    return this.getPropertyValue("canAddRow", false);
  }
  // No sort can be made while a page is read or a page move waits for its validators.
  public get canApply(): boolean {
    const isDataLoading = this.owner.isDataLoading;
    const isPageMovePending = this.owner.isPageMovePending;
    return !isDataLoading && !isPageMovePending;
  }
  // The sort Apply makes: the rows that have a direction, in order.
  public getCriteria(): Array<ISortCriterion> {
    return this.rowsValue.filter((row: ISortDialogRow): boolean => !!row.direction)
      .map((row: ISortDialogRow): ISortCriterion => ({ field: row.field, direction: row.direction }));
  }
  /* Adds a row with the first offered field that no row has and no direction (SD05). The focus stays on
     Add New; when the new row hides it, the focus moves to the new row's field. */
  public addRow(): void {
    const free = this.getFreeField();
    if (!this.canAddRow || !free) return;
    const hadFocus = !!this.addAction && isFocusInsideOrIdle(this.owner, this.addAction);
    const row = this.createRow(free.field, undefined);
    this.rowsValue.push(row);
    this.update();
    if (hadFocus && !this.canAddRow) {
      focusSortAction(this.owner, row.fieldAction, true);
    }
  }
  // Takes a row out of the draft; the first row has no remove button. The focus moves to the row before.
  public removeRow(index: number): void {
    const row = this.rowsValue[index];
    if (index < 1 || !row) return;
    const hadFocus = isFocusInsideOrIdle(this.owner, row.remove);
    this.rowsValue.splice(index, 1);
    this.update();
    row.container.dispose();
    if (hadFocus) {
      focusSortAction(this.owner, this.rowsValue[index - 1].fieldAction, true);
    }
  }
  /* Apply: the rows that have a direction become the sort, through the bar's validated sort. A draft equal
     to the current sort (both with their directions normalized) sorts nothing. The dialog closes even
     when the page validation refuses the sort: its errors are on the page, behind the overlay (SD06). */
  public apply(): boolean {
    if (!this.canApply) return false;
    const criteria = this.getCriteria();
    if (!isSameSort(criteria, this.owner.sortCriteria)) {
      this.options.sortByUser(criteria);
      this.options.onApplied();
    }
    return true;
  }
  /* Sets what every row shows from the draft, Add New, Apply and the title. The bar calls it on each of
     its own updates while the dialog is open: a locale change and the loading states reach it there. */
  public update(): void {
    if (this.isDisposed) return;
    const fields = this.owner.sortFields;
    this.rowsValue.forEach((row: ISortDialogRow, index: number): void => { this.updateRow(row, index, fields); });
    const rows = this.rowsValue.map((row: ISortDialogRow): ActionContainer => row.container);
    if (!this.isSameRows(rows)) {
      this.setPropertyValue("rows", rows);
    }
    const maxSortLevel = this.owner.maxSortLevel;
    this.setPropertyValue("canAddRow", this.rowsValue.length < maxSortLevel && !!this.getFreeField());
    this.updateFooter();
  }
  /* Takes over the modal that shows the dialog: its footer gets Add New at the start and keeps Apply, and
     Cancel is hidden - the close button and Esc drop the draft. */
  public attach(popupViewModel: PopupBaseViewModel): void {
    this.popupViewModel = popupViewModel;
    // The modal focuses its first input as it opens: the first row's field.
    popupViewModel.model.focusFirstInputSelector = classesToSelector(this.owner.getCssClasses().sortDropdown);
    const toolbar = popupViewModel.footerToolbar;
    const cancel = toolbar.getActionById("cancel");
    if (!!cancel) cancel.visible = false;
    this.applyAction = toolbar.getActionById("apply");
    this.addAction = toolbar.addAction({
      id: "sv-sort-dialog-add",
      visibleIndex: 0,
      title: "",
      action: (): void => { this.addRow(); }
    });
    this.updateFooter();
  }
  // Closes the modal without applying anything.
  public close(): void {
    const popupViewModel = this.popupViewModel;
    if (!!popupViewModel && !popupViewModel.isDisposed && popupViewModel.model.isVisible) {
      popupViewModel.model.hide();
    }
  }
  // The footer's actions belong to the modal, which disposes them.
  public dispose(): void {
    this.rowsValue.forEach((row: ISortDialogRow): void => { row.container.dispose(); });
    this.rowsValue = [];
    this.popupViewModel = undefined;
    this.addAction = undefined;
    this.applyAction = undefined;
    super.dispose();
  }

  private createRow(field: string, direction: SortDirection): ISortDialogRow {
    const owner = this.owner;
    const suffix = "-" + (++this.rowCount);
    const container = owner.createActionContainer();
    container.containerCss = owner.getCssClasses().sortDialogRow;
    container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "small" });
    const row: ISortDialogRow = { field: field, direction: direction, container: container, fieldAction: undefined,
      directionAction: undefined, remove: undefined, keys: {} };
    row.fieldAction = this.createDropdown("sv-sort-dialog-field" + suffix, (item: IAction): void => { this.onFieldPicked(row, item.data); });
    row.directionAction = this.createDropdown("sv-sort-dialog-direction" + suffix, (item: IAction): void => { this.onDirectionPicked(row, item.data); });
    const items: Array<Action> = [row.fieldAction, row.directionAction];
    if (this.rowsValue.length > 0) {
      row.remove = new Action({
        id: "sv-sort-dialog-remove" + suffix,
        title: "",
        showTitle: false,
        iconName: "icon-delete-24x24",
        iconSize: "auto",
        appearance: { mode: "quaternary" },
        action: (): void => { this.removeRow(this.rowsValue.indexOf(row)); }
      });
      items.push(row.remove);
    }
    container.setItems(items);
    return row;
  }
  private createDropdown(id: string, onPicked: (item: IAction) => void): Action {
    const owner = this.owner;
    const action = createSortDropdownAction(owner, {
      id: id,
      iconName: "icon-chevrondown-24x24",
      // The form box border is the border effect of the action.
      showBorder: true,
      innerCss: (): string => owner.getCssClasses().sortDropdown,
      onPicked: (item: IAction): void => {
        onPicked(item);
        this.update();
      }
    });
    // The list is as wide as its form box.
    action.popupModel.setWidthByTarget = true;
    return action;
  }
  // A field pick keeps the row's state: a row that sorts takes the new field's first direction, a row that does not stays so.
  private onFieldPicked(row: ISortDialogRow, field: string): void {
    if (!field || row.field === field) return;
    row.field = field;
    if (!!row.direction) {
      row.direction = getFirstSortDirection(getShownSortField(this.owner, this.owner.sortFields, field).dataType);
    }
  }
  private onDirectionPicked(row: ISortDialogRow, direction: SortDirection): void {
    row.direction = direction;
  }
  private updateRow(row: ISortDialogRow, index: number, fields: Array<IRecordsSortField>): void {
    const owner = this.owner;
    const level = index + 1;
    const shown = getShownSortField(owner, fields, row.field);
    const otherFields = this.rowsValue.filter((item: ISortDialogRow): boolean => item !== row).map((item: ISortDialogRow): string => item.field);
    const fieldList = setSortListItems(row.keys, "field", row.fieldAction, getSortFieldItems(fields, otherFields, shown));
    fieldList.selectedItem = fieldList.actions.filter((item: Action): boolean => item.data === row.field)[0];
    row.fieldAction.title = shown.title;
    const fieldLabel = index === 0 ? owner.getLocalizationString("sortFieldAriaLabel") : owner.getLocalizationFormatString("sortLevelFieldAriaLabel", level);
    row.fieldAction.ariaLabel = fieldLabel + " " + shown.title;

    // The first row's item that does not sort is Default, as in the bar; a later row's is the dash (sortNoDirectionText).
    const noSortItem: IAction = index === 0 ? { id: "sv-sort-direction-default", title: owner.getLocalizationString("sortDefaultText") }
      : { id: "sv-sort-direction-none", title: owner.getLocalizationString("sortNoDirectionText") };
    const directionList = setSortListItems(row.keys, "direction", row.directionAction, getSortDirectionListItems(owner, shown.dataType, noSortItem));
    directionList.selectedItem = directionList.actions.filter((item: Action): boolean => item.data === row.direction)[0];
    const directionTitle = !!row.direction ? owner.getLocalizationString(getSortDirectionLocStringName(shown.dataType, row.direction)) : noSortItem.title;
    row.directionAction.title = directionTitle;
    const directionLabel = index === 0 ? owner.getLocalizationString("sortDirectionAriaLabel") : owner.getLocalizationFormatString("sortLevelDirectionAriaLabel", level);
    row.directionAction.ariaLabel = directionLabel + " " + directionTitle;

    if (!!row.remove) {
      const removeTitle = owner.getLocalizationFormatString("sortRemoveLevelText", level);
      row.remove.title = removeTitle;
      row.remove.ariaLabel = removeTitle;
    }
  }
  private updateFooter(): void {
    const owner = this.owner;
    if (!!this.popupViewModel && !this.popupViewModel.isDisposed) {
      this.popupViewModel.model.title = owner.getLocalizationString("sortByText");
    }
    if (!!this.addAction) {
      this.addAction.title = owner.getLocalizationString("sortAddNewText");
      this.addAction.visible = this.canAddRow;
    }
    if (!!this.applyAction) {
      this.applyAction.title = owner.getLocalizationString("modalApplyButtonText");
      this.applyAction.enabled = this.canApply;
    }
  }
  private getFreeField(): IRecordsSortField {
    return this.owner.sortFields.filter((item: IRecordsSortField): boolean => !this.rowsValue.some((row: ISortDialogRow): boolean => row.field === item.field))[0];
  }
  private isSameRows(rows: Array<ActionContainer>): boolean {
    const current = this.rows;
    return current.length === rows.length && current.every((item: ActionContainer, index: number): boolean => item === rows[index]);
  }
}

/* Opens the dialog in a modal through settings.showDialog, which each renderer sets. The modal is placed
   under the survey's root element, so a survey in a shadow root shows it with its styles. onClosed runs
   once the modal has hidden, whatever closed it: Apply, the close button, Esc or the bar. */
export function showRecordsSortDialog(dialog: RecordsSortDialogModel, owner: IRecordsSortBarOwner, onClosed: () => void): PopupBaseViewModel {
  if (!settings.showDialog) return undefined;
  const popupViewModel: PopupBaseViewModel = settings.showDialog(<IDialogOptions>{
    componentName: "sv-records-sort-dialog",
    data: { model: dialog },
    title: owner.getLocalizationString("sortByText"),
    showCloseButton: true,
    displayMode: "popup",
    isFocusedContent: true,
    onApply: (): boolean => dialog.apply(),
    onCancel: (): void => { },
    onHide: (): void => { onClosed(); },
    cssClass: "sv-popup--records-sort"
  }, owner.getRootElement());
  if (!!popupViewModel) {
    dialog.attach(popupViewModel);
  }
  return popupViewModel;
}
