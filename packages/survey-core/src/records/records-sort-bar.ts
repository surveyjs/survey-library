import { ComputedUpdater } from "../base";
import { Action, IAction } from "../actions/action";
import { createDropdownActionModel } from "../actions/dropdown-action";
import type { ActionContainer } from "../actions/container";
import type { ListModel } from "../list";
import type { ILocalizableOwner } from "../localizablestring";
import { settings } from "../settings";
import { focusElement } from "../utils/focus-utils";
import { getActiveElement } from "../utils/dom-utils";
import { DynamicDataFieldType, ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";
import { getFirstSortDirection, getSortDirectionItems, getSortDirectionLocStringName, ISortDirectionItem } from "./records-sort-directions";

// A field the sort bar offers: the record key the list sorts by, the text the bar shows and the data type the list registered.
export interface IRecordsSortField { field: string, title: string, dataType: DynamicDataFieldType }
// The class names the sort bar gives its dropdowns, its "Sort by" text and the container of a sort level.
export interface IRecordsSortBarCssClasses { sortDropdown: string, sortLabel: string, sortLevel: string }

// What the sort bar reads from its records question and the move it makes.
export interface IRecordsSortBarOwner {
  // The current sort as plain criteria; the bar shows every level of it.
  readonly sortCriteria: Array<ISortCriterion>;
  // The fields the bar offers, in the order the question shows them. Computed on every read.
  readonly sortFields: Array<IRecordsSortField>;
  // The API's opt-in: allowSort and showSortMenu.
  readonly isSortMenuVisible: boolean;
  readonly isDesignMode: boolean;
  readonly isCollapsed: boolean;
  // A page is read, or a move waits for asynchronous validators: no sort can be made meanwhile.
  readonly isDataLoading: boolean;
  readonly isPageMovePending: boolean;
  readonly isMobile: boolean;
  // How many levels a respondent can make with "+". A sort from code or JSON can have more.
  readonly maxSortLevel: number;
  /* The respondent's sort: it validates the page it replaces. false = an error was found at once;
     true = sorted, or waiting for asynchronous validators. */
  sortByUser(criteria: Array<ISortCriterion>): boolean;
  // The data type the list registered for a field the bar does not offer; "any" when it knows none.
  getSortFieldDataType(field: string): DynamicDataFieldType;
  getLocalizationString(strName: string): string;
  getLocalizationFormatString(strName: string, ...args: any[]): string;
  // The owner of the lists' texts: locale, Markdown, renderers and text processing.
  getLocOwner(): ILocalizableOwner;
  // Read inside the items' updaters, as the pager's: a css update resets the question's classes.
  getCssClasses(): IRecordsSortBarCssClasses;
  createActionContainer(): ActionContainer;
  // The survey's rendered root, where the bar finds its buttons to move the focus; a shadow root holds it too.
  getRootElement(): HTMLElement;
}
// What the items read from the bar that holds them: the one visibility rule (QuestionRecordsBar.showSort).
export interface IRecordsSortBarView {
  readonly showSort: boolean;
}
/* The container the renderers show, the refresh the bar calls whenever an input of the items changes,
   and the clean-up of the level containers, which the container's own dispose does not reach. */
export interface IRecordsSortActions {
  container: ActionContainer;
  update(): void;
  dispose(): void;
}

/* The sort bar shows while the API opts in, outside design mode (the designer selects the question
   with header clicks), while the question is expanded, with a field to offer. Read-only and display
   mode keep it: a sort changes no answer. */
export function getShowSort(owner: IRecordsSortBarOwner, fields: Array<IRecordsSortField>): boolean {
  return owner.isSortMenuVisible && !owner.isDesignMode && !owner.isCollapsed && fields.length > 0;
}

interface ISortBarState {
  showSort: boolean;
  canSort: boolean;
}
/* Every updater of the sort bar reads its inputs through here. A ComputedUpdater collects its
   dependencies on its first run only, so an input that a && or || skips on that run is never
   observed afterwards: every input is read into its own local before any of them is combined. */
function getSortBarState(owner: IRecordsSortBarOwner, view: IRecordsSortBarView): ISortBarState {
  const showSort = view.showSort;
  const isDataLoading = owner.isDataLoading;
  const isPageMovePending = owner.isPageMovePending;
  return { showSort: showSort, canSort: !isDataLoading && !isPageMovePending };
}

// The field a level shows, and whether it is the fallback of a sort field the bar does not offer.
interface IShownSortField extends IRecordsSortField { isFallback: boolean }
/* One level of the bar: the item of the bar (component sv-sort-bar-level), whose data is the level's
   own container - [field v] [direction v], plus a remove button from the second level on. A group
   belongs to its position: the k-th group shows the k-th level of the sort. The keys rebuild a list
   only when what it shows changed, so an open popup keeps its items. */
interface ISortLevelGroup {
  action: Action;
  container: ActionContainer;
  field: Action;
  direction: Action;
  remove: Action;
  fieldListKey: string;
  directionListKey: string;
}

function findField(fields: Array<IRecordsSortField>, field: string): IRecordsSortField {
  return fields.filter((item: IRecordsSortField): boolean => item.field === field)[0];
}
function getDirection(criterion: ISortCriterion): SortDirection {
  return criterion.direction === "desc" ? "desc" : "asc";
}
function copySort(sort: Array<ISortCriterion>): Array<ISortCriterion> {
  return sort.map((item: ISortCriterion): ISortCriterion => ({ field: item.field, direction: getDirection(item) }));
}
function setListItems(group: ISortLevelGroup, action: Action, items: Array<IAction>, keyName: "fieldListKey" | "directionListKey"): ListModel {
  const list = <ListModel>action.data;
  const key = JSON.stringify(items);
  if (group[keyName] !== key) {
    group[keyName] = key;
    list.setItems(items);
  }
  return list;
}
/* The rendered element of an action: every renderer gives the action's root element its renderedId. It is
   looked up under the survey's root element, which may be inside a shadow root that the document cannot see into. */
function getActionElement(owner: IRecordsSortBarOwner, action: Action): HTMLElement {
  const container = owner.getRootElement();
  if (!!container) return container.querySelector("#" + CSS.escape(action.renderedId));
  const root: any = settings.environment.root;
  return !!root && typeof root.getElementById === "function" ? root.getElementById(action.renderedId) : null;
}
/* Is the keyboard focus inside the action's element, or on nothing (<body>)? The active element is read
   through a shadow root. */
function isFocusInsideOrIdle(owner: IRecordsSortBarOwner, action: Action): boolean {
  const active = getActiveElement();
  if (!active || active === active.ownerDocument.body) return true;
  const el = getActionElement(owner, action);
  return !!el && el.contains(active);
}

/* The sort bar the renderers show through their action bar, in the design's order:
   Sort by  [field v] [direction v]  |  [field v] [direction v] [remove]  |  [+]
   It shows every level of the sort, with at least one group: a sort from code may have more levels
   than maxSortLevel, which limits only "+". "Sort by" is a disabled item without a tab stop, text the
   keyboard passes over. The bar computes no sort of its own: it shows the question's sortCriteria and
   passes the respondent's picks back through sortByUser, each one with the complete new sort. */
class RecordsSortBar implements IRecordsSortActions {
  /* lastField: the field the respondent last sorted the first level by through the bar, shown while
     nothing is sorted. pickedField: the first field of the last pick, which becomes lastField once
     the sort holds it - a pick refused by a validator, or still waiting for one, leaves the shown
     field as it was. */
  private lastField: string;
  private pickedField: string;
  private groups: Array<ISortLevelGroup> = [];
  private labelAction: Action;
  private addAction: Action;

  constructor(public container: ActionContainer, private owner: IRecordsSortBarOwner, private view: IRecordsSortBarView) {
    this.labelAction = new Action({
      id: "sv-sort-by",
      title: "",
      enabled: false,
      disableTabStop: true,
      innerCss: <any>new ComputedUpdater(() => owner.getCssClasses().sortLabel),
      visible: <any>new ComputedUpdater(() => getSortBarState(owner, view).showSort)
    });
    // Its visibility and state are set in update(): they depend on the sort's levels and the offered fields.
    this.addAction = new Action({
      id: "sv-sort-add",
      title: "",
      showTitle: false,
      iconName: "icon-plus-16x16",
      iconSize: "auto",
      needSeparator: true,
      appearance: { showBorder: true },
      visible: false,
      action: (): void => { this.onAddLevel(); }
    });
    container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });
    this.update();
  }

  /* Sets what every item shows from the sort: the number of groups, then the titles, accessible
     names, lists and selected items of each group, and "+". It runs after every pick too. ListModel
     selects the picked item before the pick is validated, and the dropdown copies its title onto the
     button: a pick refused by a required cell, or waiting for an asynchronous validator, has not
     sorted, and the bar shows the sort the question has. An accepted asynchronous pick arrives
     through the sortCriteria change. */
  public update(): void {
    const owner = this.owner;
    const sort = owner.sortCriteria;
    const fields = owner.sortFields;
    if (sort.length > 0 && sort[0].field === this.pickedField) {
      this.lastField = sort[0].field;
    }
    this.updateGroupCount(Math.max(1, sort.length));
    this.groups.forEach((group: ISortLevelGroup, index: number): void => {
      this.updateGroup(group, index, sort, fields);
    });
    this.labelAction.title = owner.getLocalizationString("sortByText");
    this.updateAddAction(sort, fields);
  }
  public dispose(): void {
    this.groups.forEach((group: ISortLevelGroup): void => { group.container.dispose(); });
    this.groups = [];
    this.container.dispose();
  }

  /* Only a change in the number of levels adds or removes groups, at the end. The new items array
     passes the surviving actions themselves: setItems keeps an action it is given, and the renderers
     key the items by uniqueId, so a surviving item stays mounted and keeps the focus. setItems
     disposes nothing: a removed group is disposed here, with its container, its actions and their
     list and popup models. */
  private updateGroupCount(count: number): void {
    if (this.groups.length === count) return;
    const removed: Array<ISortLevelGroup> = [];
    while(this.groups.length > count) {
      removed.unshift(this.groups.pop());
    }
    while(this.groups.length < count) {
      this.groups.push(this.createGroup(this.groups.length));
    }
    const items: Array<Action> = [this.labelAction];
    this.groups.forEach((group: ISortLevelGroup): void => { items.push(group.action); });
    items.push(this.addAction);
    this.container.setItems(items);
    removed.forEach((group: ISortLevelGroup): void => {
      group.container.dispose();
      group.action.dispose();
    });
  }
  private createGroup(index: number): ISortLevelGroup {
    const owner = this.owner;
    const view = this.view;
    const suffix = index === 0 ? "" : "-" + (index + 1);
    const container = owner.createActionContainer();
    container.containerCss = owner.getCssClasses().sortLevel;
    container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });
    const field = this.createSortDropdownAction("sv-sort-field" + suffix, (item: IAction): void => { this.onFieldPicked(index, item.data); });
    const direction = this.createSortDropdownAction("sv-sort-direction" + suffix, (item: IAction): void => { this.onDirectionPicked(index, item.data); });
    const items: Array<Action> = [field, direction];
    let remove: Action;
    if (index > 0) {
      remove = new Action({
        id: "sv-sort-remove" + suffix,
        title: "",
        showTitle: false,
        iconName: "icon-delete-16x16",
        iconSize: "auto",
        appearance: { mode: "quaternary", showBorder: true },
        visible: <any>new ComputedUpdater(() => getSortBarState(owner, view).showSort),
        enabled: <any>new ComputedUpdater(() => getSortBarState(owner, view).canSort),
        action: (): void => { this.onRemoveLevel(index); }
      });
      items.push(remove);
    }
    container.setItems(items);
    const action = new Action({
      id: "sv-sort-level" + suffix,
      component: "sv-sort-bar-level",
      data: container,
      needSeparator: index > 0,
      visible: <any>new ComputedUpdater(() => getSortBarState(owner, view).showSort)
    });
    return { action: action, container: container, field: field, direction: direction, remove: remove,
      fieldListKey: undefined, directionListKey: undefined };
  }
  // A dropdown of a level: its title, then a chevron (the css puts the chevron after the label).
  private createSortDropdownAction(id: string, onPicked: (item: IAction) => void): Action {
    const owner = this.owner;
    const view = this.view;
    const action = createDropdownActionModel({
      id: id,
      title: "",
      showTitle: true,
      iconName: "icon-chevrondown-16x16",
      iconSize: "auto",
      appearance: { showBorder: true },
      innerCss: <any>new ComputedUpdater(() => owner.getCssClasses().sortDropdown),
      visible: <any>new ComputedUpdater(() => getSortBarState(owner, view).showSort),
      enabled: <any>new ComputedUpdater(() => getSortBarState(owner, view).canSort)
    }, {
      items: [],
      allowSelection: true,
      // Under the button: the default opens to its left, over the bar's other dropdown.
      verticalPosition: "bottom",
      horizontalPosition: "center",
      onSelectionChanged: (item: IAction): void => {
        onPicked(item);
        this.update();
      }
    }, owner.getLocOwner());
    // The list takes the focus as it opens, as the pager's page list does: the arrows and Enter pick from it.
    action.popupModel.isFocusedContent = true;
    return action;
  }

  /* The field a level shows: the field of its sort level - a fallback item when the bar does not offer
     it. The first level with no sort: the field last sorted by through the bar while it is offered,
     otherwise the first offered field. */
  private getShownField(index: number, sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): IShownSortField {
    const criterion = sort[index];
    if (!!criterion) {
      const offered = findField(fields, criterion.field);
      if (!!offered) return Object.assign({ isFallback: false }, offered);
      return { field: criterion.field, title: criterion.field, dataType: this.owner.getSortFieldDataType(criterion.field) || "any", isFallback: true };
    }
    const shown = findField(fields, this.lastField) || fields[0];
    return !!shown ? Object.assign({ isFallback: false }, shown) : undefined;
  }
  private updateGroup(group: ISortLevelGroup, index: number, sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): void {
    const owner = this.owner;
    const level = index + 1;
    const shown = this.getShownField(index, sort, fields);
    // A field is in one level at most: the list leaves out the fields of the other levels.
    const otherFields = sort.filter((_: ISortCriterion, i: number): boolean => i !== index).map((item: ISortCriterion): string => item.field);
    const fieldItems: Array<IAction> = fields.filter((item: IRecordsSortField): boolean => otherFields.indexOf(item.field) < 0)
      .map((item: IRecordsSortField): IAction => ({ id: "sv-sort-field-" + item.field, title: item.title, data: item.field }));
    if (!!shown && shown.isFallback) {
      fieldItems.push({ id: "sv-sort-field-" + shown.field, title: shown.title, data: shown.field });
    }
    const fieldList = setListItems(group, group.field, fieldItems, "fieldListKey");
    fieldList.selectedItem = !!shown ? fieldList.actions.filter((item: Action): boolean => item.data === shown.field)[0] : undefined;
    const fieldTitle = !!shown ? shown.title : "";
    group.field.title = fieldTitle;
    const fieldLabel = index === 0 ? owner.getLocalizationString("sortFieldAriaLabel") : owner.getLocalizationFormatString("sortLevelFieldAriaLabel", level);
    group.field.ariaLabel = fieldLabel + " " + fieldTitle;

    // The first level offers Default, which clears the whole sort; a later level is taken out with its remove button.
    const defaultTitle = owner.getLocalizationString("sortDefaultText");
    const directionItems: Array<IAction> = index === 0 ? [{ id: "sv-sort-direction-default", title: defaultTitle }] : [];
    const dataType = !!shown ? shown.dataType : "any";
    getSortDirectionItems(dataType).forEach((item: ISortDirectionItem): void => {
      directionItems.push({ id: "sv-sort-direction-" + item.direction, title: owner.getLocalizationString(item.locStringName), data: item.direction });
    });
    const directionList = setListItems(group, group.direction, directionItems, "directionListKey");
    const criterion = sort[index];
    const direction = !!criterion ? getDirection(criterion) : undefined;
    directionList.selectedItem = directionList.actions.filter((item: Action): boolean => item.data === direction)[0];
    const directionTitle = !!direction ? owner.getLocalizationString(getSortDirectionLocStringName(dataType, direction)) : defaultTitle;
    group.direction.title = directionTitle;
    const directionLabel = index === 0 ? owner.getLocalizationString("sortDirectionAriaLabel") : owner.getLocalizationFormatString("sortLevelDirectionAriaLabel", level);
    group.direction.ariaLabel = directionLabel + " " + directionTitle;

    if (!!group.remove) {
      const removeTitle = owner.getLocalizationFormatString("sortRemoveLevelText", level);
      group.remove.title = removeTitle;
      group.remove.ariaLabel = removeTitle;
    }
  }
  // The first offered field that no level has, for "+"; undefined when every offered field is in the sort.
  private getFreeField(sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): IRecordsSortField {
    return fields.filter((item: IRecordsSortField): boolean => !sort.some((criterion: ISortCriterion): boolean => criterion.field === item.field))[0];
  }
  /* "+" shows while the respondent can add levels (maxSortLevel above 1) and hides once the sort has
     maxSortLevel levels or no offered field is left for another one. It is disabled while nothing is
     sorted - a second level under an unsorted first one is no sort - and while no sort can be made.
     update() runs on every one of these inputs, the loading states included. */
  private updateAddAction(sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): void {
    const state = getSortBarState(this.owner, this.view);
    const maxSortLevel = this.owner.maxSortLevel;
    const canAdd = maxSortLevel > 1 && sort.length < maxSortLevel && !!this.getFreeField(sort, fields);
    this.addAction.visible = state.showSort && canAdd;
    this.addAction.enabled = state.canSort && sort.length > 0;
    const title = this.owner.getLocalizationString("sortAddLevelText");
    this.addAction.title = title;
    this.addAction.ariaLabel = title;
  }

  /* A pick of the field list sorts that level by that field, in its type's first direction; the other
     levels stay. A pick of the field the level already holds - the fallback item included - changes
     nothing. With no sort, a pick of the first level sorts by that field. */
  private onFieldPicked(index: number, field: string): void {
    const sort = copySort(this.owner.sortCriteria);
    const current = sort[index];
    if (!field || !!current && current.field === field || index > sort.length) return;
    const offered = findField(this.owner.sortFields, field);
    const dataType = !!offered ? offered.dataType : this.owner.getSortFieldDataType(field);
    sort[index] = { field: field, direction: getFirstSortDirection(dataType) };
    this.sortByUser(sort);
  }
  /* A pick of a direction list sorts the level's field in that direction. Default, which only the
     first level offers, clears the whole sort: it names the stored order. A pick of what the level
     already shows changes nothing. */
  private onDirectionPicked(index: number, direction: SortDirection): void {
    const sort = copySort(this.owner.sortCriteria);
    if (!direction) {
      if (sort.length > 0) {
        this.sortByUser([]);
      }
      return;
    }
    const current = sort[index];
    if (!!current) {
      if (current.direction === direction) return;
      current.direction = direction;
      this.sortByUser(sort);
      return;
    }
    if (index > 0) return;
    const shown = this.getShownField(0, sort, this.owner.sortFields);
    if (!shown) return;
    this.sortByUser([{ field: shown.field, direction: direction }]);
  }
  /* The remove button takes its level out of the sort; the other levels keep their order. When that
     level held the focus, the focus moves to the field dropdown of the level before it. */
  private onRemoveLevel(index: number): void {
    const sort = copySort(this.owner.sortCriteria);
    if (index < 1 || index >= sort.length) return;
    const group = this.groups[index];
    const hadFocus = !!group && isFocusInsideOrIdle(this.owner, group.action);
    sort.splice(index, 1);
    const isRemoved = this.sortByUser(sort) && this.owner.sortCriteria.length === sort.length;
    this.update();
    if (isRemoved && hadFocus) {
      this.focusField(index - 1, false);
    }
  }
  /* "+" appends the first offered field that no level has, in its type's first direction, and sorts at
     once, like a field pick. The focus stays on "+"; when the new level hides it, the focus moves to
     the new level's field dropdown. */
  private onAddLevel(): void {
    const owner = this.owner;
    const sort = copySort(owner.sortCriteria);
    const free = this.getFreeField(sort, owner.sortFields);
    if (sort.length < 1 || !free || sort.length >= owner.maxSortLevel) return;
    const hadFocus = isFocusInsideOrIdle(this.owner, this.addAction);
    sort.push({ field: free.field, direction: getFirstSortDirection(free.dataType) });
    const isAdded = this.sortByUser(sort) && owner.sortCriteria.length === sort.length;
    this.update();
    if (isAdded && hadFocus && !this.addAction.visible) {
      this.focusField(sort.length - 1, true);
    }
  }
  private sortByUser(criteria: Array<ISortCriterion>): boolean {
    this.pickedField = criteria.length > 0 ? criteria[0].field : undefined;
    const res = this.owner.sortByUser(criteria);
    if (!res) {
      this.pickedField = undefined;
    }
    return res;
  }
  // A new group renders after the bar's update: isTimeOut waits for it.
  private focusField(index: number, isTimeOut: boolean): void {
    const group = this.groups[index];
    if (!group) return;
    const owner = this.owner;
    const field = group.field;
    focusElement(() => {
      const el = getActionElement(owner, field);
      return !!el ? el.querySelector("button") : null;
    }, isTimeOut);
  }
}

export function createRecordsSortActions(container: ActionContainer, owner: IRecordsSortBarOwner, view: IRecordsSortBarView): IRecordsSortActions {
  return new RecordsSortBar(container, owner, view);
}
