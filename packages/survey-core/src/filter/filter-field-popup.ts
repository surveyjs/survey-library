import { Base } from "../base";
import { Action, IAction } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { ListModel } from "../list";
import { MultiSelectListModel } from "../multiSelectListModel";
import { ILocalizableOwner } from "../localizablestring";
import { Helpers, normalizeTextForSearch } from "../helpers";
import { getLocaleString } from "../surveyStrings";
import { ElementHelper } from "../element-helper";
import { classesToSelector, getFirstVisibleChild } from "../utils/dom-utils";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-filter-fields";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { FilterConditionsEditor } from "./filter-conditions-editor";
import {
  FilterFieldEditorKind, IFilterFieldListItem, canFilterFieldSelectAll, getFilterFieldListItems,
  getFilterFieldSelection, getFilterSelectionCondition
} from "./filter-field-kinds";
import { filterUIStrings } from "./filter-ui-strings";

// What a field's popup reads from the control and calls on it: the control's public API only.
export interface IFilterFieldPopupOwner extends ILocalizableOwner {
  getFieldByName(name: string): IDynamicDataFilterField;
  getFieldCondition(name: string): IFilterCondition;
  getFieldEditorKind(name: string): FilterFieldEditorKind;
  setFieldCondition(name: string, operator: string, value?: any): void;
  clearFieldCondition(name: string): void;
  createFastModeEditor(name: string): FilterConditionsEditor;
  canEditConditions: boolean;
  cssClasses: any;
}
// A list this long or longer gets a search box. The list's own threshold (ListModel.MINELEMENTCOUNT)
// is shared by every dropdown in the library and is not changed for this one.
export const filterPopupSearchMinItemCount = 7;
// The component a renderer draws a list entry of a "multi" or "boolean" popup with: a checkbox, the
// text and, for a value the respondent typed, a button that removes it.
export const filterListItemComponentName = "sv-filter-list-item";

// The content of a fast mode badge's popup: a title row with one link, the field's editor and a row
// with Apply. Nothing reaches the control until Apply (or a pick in a "single" list): closing the
// popup any other way drops what was changed in it. The editor depends on the field (see
// getFilterFieldEditorKind): a list of values - one pick, checkboxes, Yes and No - or an operator
// and a value. Made when the popup shows, disposed when it hides.
export class FilterFieldPopup extends Base {
  public readonly kind: FilterFieldEditorKind;
  public readonly title: string;
  private field: IDynamicDataFilterField;
  private showSearchValue: boolean = false;
  private listValue: ListModel<Action>;
  private editorValue: FilterConditionsEditor;
  private headerToolbarValue: ActionContainer;
  private footerToolbarValue: ActionContainer;
  private headerAction: Action;
  private addAction: Action;
  private customCount: number = 0;

  constructor(private owner: IFilterFieldPopupOwner, public readonly key: string, private close: () => void) {
    super();
    this.field = owner.getFieldByName(key);
    this.kind = owner.getFieldEditorKind(key);
    this.title = !!this.field.locTitle ? this.field.locTitle.calculatedText : this.field.name;
    this.headerToolbarValue = new ActionContainer();
    this.headerToolbarValue.locOwner = owner;
    this.headerToolbarValue.setActionsAppearance({ style: "brand", mode: "tertiary", size: "small" });
    this.footerToolbarValue = new ActionContainer();
    this.footerToolbarValue.locOwner = owner;
    this.footerToolbarValue.setActionsAppearance({ style: "brand", mode: "secondary", size: "medium" });
    if (this.kind === "condition") {
      this.editorValue = owner.createFastModeEditor(key);
    } else {
      this.listValue = this.createList();
      this.selectConditionValues();
    }
    this.createActions();
  }
  public getType(): string { return "filterfieldpopup"; }
  // The list of a "single", "multi" or "boolean" popup; undefined for a "condition" one.
  public get list(): ListModel<Action> { return this.listValue; }
  // The operator and value editor of a "condition" popup; undefined for a list.
  public get editor(): FilterConditionsEditor { return this.editorValue; }
  // The link in the title row: Clear, or Select All / Clear All for checkboxes.
  public get headerToolbar(): ActionContainer { return this.headerToolbarValue; }
  // Apply; empty for a "single" list, where a pick is the whole edit.
  public get footerToolbar(): ActionContainer { return this.footerToolbarValue; }
  // A search box over the list: from filterPopupSearchMinItemCount values on, and always where a
  // value can be typed in. The popup draws it above its title row, so the list's own box is off.
  public get showSearch(): boolean { return this.showSearchValue; }
  public get isReadOnly(): boolean { return !this.owner.canEditConditions; }
  // The control's classes (the "filter" entry of the theme): the popup is drawn outside the
  // control's own markup.
  public get cssClasses(): any { return this.owner.cssClasses; }
  // Writes what the popup holds and closes it. Nothing once the popup is gone: a second click on
  // Apply can arrive after the first one closed and disposed it.
  public apply(): void {
    if (this.isReadOnly || this.isDisposed) return;
    if (!!this.editorValue) {
      this.editorValue.apply();
    } else {
      this.write(getFilterSelectionCondition(this.field, this.kind, this.getCheckedValues()));
    }
    this.close();
  }
  // Arrow Down in the popup's search box moves to the first entry of the list, as in the list's own
  // box. ListModel.goToItems looks for the list around its box, and this box is outside the list.
  public onSearchKeyDown(event: KeyboardEvent): void {
    if (!this.listValue || !(event.key === "ArrowDown" || event.keyCode === 40)) return;
    const box = <HTMLElement>event.target;
    const root = !!box && !!box.closest ? box.closest(classesToSelector(this.cssClasses.popup)) : undefined;
    const listElement = !!root ? root.querySelector("ul") : undefined;
    const first = !!listElement ? getFirstVisibleChild(listElement) : undefined;
    if (!first) return;
    ElementHelper.focusElement(first);
    event.preventDefault();
  }
  // Removes a value the respondent typed from a checkbox list. A "single" list has no checkboxes:
  // its typed value goes with the next pick or with Clear.
  public removeCustomItem(item: IAction): void {
    const list = <MultiSelectListModel<Action>>this.listValue;
    if (!list || !this.isMultiple || !item || !item.data || !item.data.isCustom) return;
    list.setSelectedItems(list.selectedItems.filter((a: IAction): boolean => a.id !== item.id));
    list.setItems(list.actions.filter((a: Action): boolean => a.id !== item.id), false);
    this.updateHeader();
  }
  public dispose(): void {
    if (!!this.editorValue) {
      this.editorValue.dispose();
      this.editorValue = undefined;
    }
    if (!!this.listValue) {
      this.listValue.dispose();
      this.listValue = undefined;
    }
    this.headerToolbarValue.dispose();
    this.footerToolbarValue.dispose();
    super.dispose();
  }

  private get isMultiple(): boolean { return this.kind === "multi" || this.kind === "boolean"; }
  // A value the respondent types in: a choice field whose question allows custom choices. Not for a
  // boolean - it has nothing to add - and not in the designer.
  private get allowCustom(): boolean {
    const q: any = this.field.templateQuestion;
    return (this.kind === "single" || this.kind === "multi") && !!q && q.allowCustomChoices === true && !this.isReadOnly;
  }
  // The values the field's condition picks, or none when the list cannot show the condition.
  private get conditionValues(): Array<any> {
    return getFilterFieldSelection(this.field, this.kind, this.owner.getFieldCondition(this.key)) || [];
  }
  private createList(): ListModel<Action> {
    const items = this.createItems(this.conditionValues);
    const onTextSearchCallback = (item: IAction, text: string): boolean => this.isFound(item, text);
    let list: ListModel<Action>;
    if (this.isMultiple) {
      list = new MultiSelectListModel<Action>({ items: [], allowSelection: true, locOwner: this.owner, onTextSearchCallback,
        onSelectionChanged: (item: Action, status: string): void => { this.onItemToggled(item, status); } });
      list.itemComponent = filterListItemComponentName;
    } else {
      list = new ListModel<Action>({ items: [], allowSelection: true, locOwner: this.owner, onTextSearchCallback,
        onSelectionChanged: (item: Action): void => { this.onItemPicked(item); } });
    }
    // The list still filters its entries by filterString; only its own box is not drawn.
    list.searchEnabled = false;
    this.showSearchValue = items.length >= filterPopupSearchMinItemCount || this.allowCustom;
    if (this.allowCustom) {
      this.addAction = new Action({ id: "sv-filter-add-custom", title: "", data: { isAdd: true, popup: this } });
      list.setOnFilterStringChangedCallback((text: string): void => { this.updateAddAction(text); });
    }
    list.setItems(items, false);
    return list;
  }
  private selectConditionValues(): void {
    const values = this.conditionValues;
    const selected = this.listValue.actions.filter((a: Action): boolean =>
      values.some((v: any): boolean => Helpers.isTwoValueEquals(v, a.data.value)));
    if (this.isMultiple) {
      (<MultiSelectListModel<Action>>this.listValue).setSelectedItems(selected);
      this.syncChecked();
    } else {
      this.listValue.selectedItem = selected[0];
    }
  }
  // The field's own values, then the values of its condition that are none of them (typed in, or
  // written by hand into a preset): they are shown, so the filter does not hold anything hidden.
  private createItems(selection: Array<any>): Array<Action> {
    const enabled = !this.isReadOnly;
    const own = getFilterFieldListItems(this.field, this.owner.getLocale());
    const res = own.map((item: IFilterFieldListItem, index: number): Action =>
      new Action({ id: "sv-filter-value-" + index, title: item.text, enabled: enabled, data: { value: item.value, popup: this } }));
    selection.forEach((value: any): void => {
      if (own.some((item: IFilterFieldListItem): boolean => Helpers.isTwoValueEquals(item.value, value))) return;
      res.push(this.createCustomAction(value, enabled));
    });
    return res;
  }
  private createCustomAction(value: any, enabled: boolean): Action {
    const title = value === undefined || value === null ? "" : value.toString();
    return new Action({ id: "sv-filter-custom-" + (this.customCount++), title: title, enabled: enabled, data: { value: value, isCustom: true, popup: this } });
  }
  private createActions(): void {
    if (this.isReadOnly) return;
    if (this.kind === "multi" || this.kind === "boolean") {
      if (canFilterFieldSelectAll(this.field, this.kind)) {
        this.headerAction = new Action({ id: "sv-filter-select-all", action: (): void => { this.toggleAll(); } });
      }
    } else {
      this.headerAction = new Action({ id: "sv-filter-clear", locTitleName: "clearCaption",
        action: (): void => { this.owner.clearFieldCondition(this.key); this.close(); } });
    }
    if (!!this.headerAction) {
      this.headerToolbarValue.setItems([this.headerAction]);
      this.updateHeader();
    }
    if (this.kind !== "single") {
      this.footerToolbarValue.setItems([{ id: "sv-filter-apply", locTitleName: "modalApplyButtonText",
        action: (): void => { this.apply(); } }]);
    }
  }
  // A checkbox entry is drawn checked by its own active flag: a list redraws an entry when the entry
  // changes, and a selection is the list's state, not the entry's.
  private syncChecked(): void {
    if (!this.isMultiple) return;
    this.listValue.actions.forEach((a: Action): void => { a.active = this.listValue.isItemSelected(a); });
  }
  // Clear is there while the field has a condition to clear; Select All turns into Clear All once
  // every value is checked.
  private updateHeader(): void {
    this.syncChecked();
    const header = this.headerAction;
    if (!header) return;
    if (header.id === "sv-filter-clear") {
      header.visible = !!this.owner.getFieldCondition(this.key);
      return;
    }
    const isAll = this.getValueActions().length > 0 && this.getValueActions().every((a: Action): boolean => this.listValue.isItemSelected(a));
    header.title = isAll ? filterUIStrings.clearAll : getLocaleString("selectAllItemText", this.owner.getLocale());
  }
  private toggleAll(): void {
    const list = <MultiSelectListModel<Action>>this.listValue;
    const values = this.getValueActions();
    const isAll = values.every((a: Action): boolean => list.isItemSelected(a));
    list.setSelectedItems(isAll ? [] : [].concat(values));
    this.updateHeader();
  }
  private getValueActions(): Array<Action> {
    return this.listValue.actions.filter((a: Action): boolean => !a.data || !a.data.isAdd);
  }
  private getCheckedValues(): Array<any> {
    return this.getValueActions().filter((a: Action): boolean => this.listValue.isItemSelected(a)).map((a: Action): any => a.data.value);
  }
  private onItemToggled(item: Action, status: string): void {
    if (!!item.data && item.data.isAdd && status === "added") {
      this.addTypedValue();
      return;
    }
    this.updateHeader();
  }
  // A pick in a "single" list is the whole edit: written at once, and the popup closes.
  private onItemPicked(item: Action): void {
    if (this.isReadOnly) return;
    const value = !!item.data && item.data.isAdd ? this.getTypedText() : item.data.value;
    this.write(getFilterSelectionCondition(this.field, this.kind, [value]));
    this.close();
  }
  // The "Add" entry was checked: it becomes a checked entry of its own for the typed text, and the
  // search box is emptied.
  private addTypedValue(): void {
    const list = <MultiSelectListModel<Action>>this.listValue;
    const text = this.getTypedText();
    const selected = list.selectedItems.filter((a: IAction): boolean => a !== this.addAction);
    if (!text) {
      list.setSelectedItems(selected);
      return;
    }
    const custom = this.createCustomAction(text, true);
    list.setItems(this.getValueActions().concat([custom]), false);
    list.setSelectedItems(selected.concat([custom]));
    list.filterString = "";
    this.updateHeader();
  }
  private getTypedText(): string {
    return (this.listValue.filterString || "").trim();
  }
  // The search box finds an entry by its text or by the value itself: "de" finds Germany. "Add" stays
  // in the list for as long as it is there (see updateAddAction).
  private isFound(item: IAction, text: string): boolean {
    if (!!item.data && item.data.isAdd) return true;
    const search = normalizeTextForSearch(text || "");
    return this.getSearchTexts(item).some((t: string): boolean => t.indexOf(search) > -1);
  }
  private getSearchTexts(item: IAction): Array<string> {
    const value = !!item.data ? item.data.value : undefined;
    return [item.title, value].filter((v: any): boolean => v !== undefined && v !== null)
      .map((v: any): string => normalizeTextForSearch(String(v)));
  }
  // "Add" is in the list while the search box holds text that is no value of the list yet. It is
  // added and taken out rather than hidden: a checkbox list makes every entry visible again whenever
  // its selection changes (MultiSelectListModel.updateItemState).
  private updateAddAction(text: string): void {
    const add = this.addAction;
    if (!add) return;
    const typed = (text || "").trim();
    const search = normalizeTextForSearch(typed);
    const isKnown = this.getValueActions().some((a: Action): boolean =>
      this.getSearchTexts(a).some((t: string): boolean => t === search));
    add.title = filterUIStrings.addCustomValue.replace("{0}", typed);
    const isNeeded = !!typed && !isKnown;
    if (isNeeded === this.listValue.actions.indexOf(add) > -1) return;
    this.listValue.setItems(isNeeded ? this.getValueActions().concat([add]) : this.getValueActions(), false);
  }
  private write(condition: IFilterCondition): void {
    if (!!condition) {
      this.owner.setFieldCondition(this.key, condition.operator, condition.value);
    } else if (!!this.owner.getFieldCondition(this.key)) {
      this.owner.clearFieldCondition(this.key);
    }
  }
}
