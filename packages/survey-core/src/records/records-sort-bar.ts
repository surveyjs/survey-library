import { ComputedUpdater } from "../base";
import { Action, IAction } from "../actions/action";
import { createDropdownActionModel } from "../actions/dropdown-action";
import type { ActionContainer } from "../actions/container";
import type { ListModel } from "../list";
import type { ILocalizableOwner } from "../localizablestring";
import { DynamicDataFieldType, ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";
import { getFirstSortDirection, getSortDirectionItems, getSortDirectionLocStringName, ISortDirectionItem } from "./records-sort-directions";

// A field the sort bar offers: the record key the list sorts by, the text the bar shows and the data type the list registered.
export interface IRecordsSortField { field: string, title: string, dataType: DynamicDataFieldType }
// The class names the sort bar gives its two dropdowns and its "Sort by" text.
export interface IRecordsSortBarCssClasses { sortDropdown: string, sortLabel: string }

// What the sort bar reads from its records question and the move it makes.
export interface IRecordsSortBarOwner {
  // The current sort as plain criteria; the bar shows its first level.
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
  /* The respondent's sort: it validates the page it replaces. false = an error was found at once;
     true = sorted, or waiting for asynchronous validators. */
  sortByUser(criteria: Array<ISortCriterion>): boolean;
  // The data type the list registered for a field the bar does not offer; "any" when it knows none.
  getSortFieldDataType(field: string): DynamicDataFieldType;
  getLocalizationString(strName: string): string;
  // The owner of the lists' texts: locale, Markdown, renderers and text processing.
  getLocOwner(): ILocalizableOwner;
  // Read inside the items' updaters, as the pager's: a css update resets the question's classes.
  getCssClasses(): IRecordsSortBarCssClasses;
}
// What the items read from the bar that holds them: the one visibility rule (QuestionRecordsBar.showSort).
export interface IRecordsSortBarView {
  readonly showSort: boolean;
}
// The container the renderers show, and the refresh the bar calls whenever an input of the items changes.
export interface IRecordsSortActions {
  container: ActionContainer;
  update(): void;
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

// The field the bar shows, and whether it is the fallback of a sort field the bar does not offer.
interface IShownSortField extends IRecordsSortField { isFallback: boolean }
/* What the bar remembers between two refreshes. lastField: the field the respondent last sorted by
   through the bar, shown while nothing is sorted. pickedField: the field of the last pick, which
   becomes lastField once the sort holds it - a pick refused by a validator, or still waiting for one,
   leaves the shown field as it was. The keys rebuild a list only when what it shows changed, so an
   open popup keeps its items. */
interface ISortBarMemory {
  lastField: string;
  pickedField: string;
  fieldListKey: string;
  directionListKey: string;
}

function findField(fields: Array<IRecordsSortField>, field: string): IRecordsSortField {
  return fields.filter((item: IRecordsSortField): boolean => item.field === field)[0];
}
/* The field of the first sort level while the sort has one - a fallback item when the bar does not
   offer it. With no sort: the field last sorted by through the bar while it is offered, otherwise
   the first offered field. */
function getShownField(owner: IRecordsSortBarOwner, fields: Array<IRecordsSortField>, memory: ISortBarMemory): IShownSortField {
  const first = owner.sortCriteria[0];
  if (!!first) {
    const offered = findField(fields, first.field);
    if (!!offered) return Object.assign({ isFallback: false }, offered);
    return { field: first.field, title: first.field, dataType: owner.getSortFieldDataType(first.field) || "any", isFallback: true };
  }
  const shown = findField(fields, memory.lastField) || fields[0];
  return !!shown ? Object.assign({ isFallback: false }, shown) : undefined;
}
function getDirection(criterion: ISortCriterion): SortDirection {
  return criterion.direction === "desc" ? "desc" : "asc";
}

/* A pick of the field list sorts by that field at once, in its type's first direction. A pick of
   the field the first sort level already holds - the fallback item included - changes nothing: the
   sort keeps every level. */
function onFieldPicked(owner: IRecordsSortBarOwner, field: string, memory: ISortBarMemory): void {
  const first = owner.sortCriteria[0];
  if (!field || !!first && first.field === field) return;
  const offered = findField(owner.sortFields, field);
  const dataType = !!offered ? offered.dataType : owner.getSortFieldDataType(field);
  sortByUser(owner, [{ field: field, direction: getFirstSortDirection(dataType) }], memory);
}
/* A pick of the direction list sorts the shown field in that direction, and Default clears the
   sort. A pick of what the bar already shows changes nothing: a sort of several levels keeps them
   all. Any other pick replaces the sort with one criterion. */
function onDirectionPicked(owner: IRecordsSortBarOwner, direction: SortDirection, memory: ISortBarMemory): void {
  const sort = owner.sortCriteria;
  const first = sort[0];
  if (!direction) {
    if (sort.length > 0) sortByUser(owner, [], memory);
    return;
  }
  const shown = getShownField(owner, owner.sortFields, memory);
  if (!shown || !!first && first.field === shown.field && getDirection(first) === direction) return;
  sortByUser(owner, [{ field: shown.field, direction: direction }], memory);
}
function sortByUser(owner: IRecordsSortBarOwner, criteria: Array<ISortCriterion>, memory: ISortBarMemory): void {
  memory.pickedField = criteria.length > 0 ? criteria[0].field : undefined;
  if (!owner.sortByUser(criteria)) {
    memory.pickedField = undefined;
  }
}

function setListItems(action: Action, items: Array<IAction>, key: string, memory: ISortBarMemory, keyName: "fieldListKey" | "directionListKey"): ListModel {
  const list = <ListModel>action.data;
  if (memory[keyName] !== key) {
    memory[keyName] = key;
    list.setItems(items);
  }
  return list;
}
/* Sets what the two dropdowns show from the sort: their titles, accessible names, lists and selected
   items. It runs after every pick too. ListModel selects the picked item before the pick is
   validated, and the dropdown copies its title onto the button: a pick refused by a required cell,
   or waiting for an asynchronous validator, has not sorted, and the bar shows the sort the question
   has. An accepted asynchronous pick arrives through the sortCriteria change. */
function updateSortActions(owner: IRecordsSortBarOwner, fieldAction: Action, labelAction: Action, directionAction: Action,
  memory: ISortBarMemory): void {
  const fields = owner.sortFields;
  const first = owner.sortCriteria[0];
  if (!!first && first.field === memory.pickedField) {
    memory.lastField = first.field;
  }
  const shown = getShownField(owner, fields, memory);

  const fieldItems: Array<IAction> = fields.map((item: IRecordsSortField): IAction =>
    ({ id: "sv-sort-field-" + item.field, title: item.title, data: item.field }));
  if (!!shown && shown.isFallback) {
    fieldItems.push({ id: "sv-sort-field-" + shown.field, title: shown.title, data: shown.field });
  }
  const fieldList = setListItems(fieldAction, fieldItems, JSON.stringify(fieldItems), memory, "fieldListKey");
  fieldList.selectedItem = !!shown ? fieldList.actions.filter((item: Action): boolean => item.data === shown.field)[0] : undefined;
  const fieldTitle = !!shown ? shown.title : "";
  fieldAction.title = fieldTitle;
  fieldAction.ariaLabel = owner.getLocalizationString("sortFieldAriaLabel") + " " + fieldTitle;

  labelAction.title = owner.getLocalizationString("sortByText");

  const defaultTitle = owner.getLocalizationString("sortDefaultText");
  const directionItems: Array<IAction> = [{ id: "sv-sort-direction-default", title: defaultTitle }];
  const dataType = !!shown ? shown.dataType : "any";
  getSortDirectionItems(dataType).forEach((item: ISortDirectionItem): void => {
    directionItems.push({ id: "sv-sort-direction-" + item.direction, title: owner.getLocalizationString(item.locStringName), data: item.direction });
  });
  const directionList = setListItems(directionAction, directionItems, JSON.stringify(directionItems), memory, "directionListKey");
  const direction = !!first ? getDirection(first) : undefined;
  directionList.selectedItem = directionList.actions.filter((item: Action): boolean => item.data === direction)[0];
  const directionTitle = !!direction ? owner.getLocalizationString(getSortDirectionLocStringName(dataType, direction)) : defaultTitle;
  directionAction.title = directionTitle;
  directionAction.ariaLabel = owner.getLocalizationString("sortDirectionAriaLabel") + " " + directionTitle;
}

// A dropdown of the bar: its title, then a chevron (the css puts the chevron after the label).
function createSortDropdownAction(owner: IRecordsSortBarOwner, view: IRecordsSortBarView, id: string,
  onPicked: (item: IAction) => void, update: () => void): Action {
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
      update();
    }
  }, owner.getLocOwner());
  // The list takes the focus as it opens, as the pager's page list does: the arrows and Enter pick from it.
  action.popupModel.isFocusedContent = true;
  return action;
}

/* The sort bar the renderers show through their action bar, in the design's order:
   [field v]  Sort by  [direction v]
   One level: a sort of several levels - from code or a modified header click - shows its first
   one. "Sort by" is a disabled item without a tab stop, text the keyboard passes over. The bar
   computes no sort of its own: it shows the question's sortCriteria and passes the respondent's
   picks back through sortByUser. */
export function createRecordsSortActions(container: ActionContainer, owner: IRecordsSortBarOwner, view: IRecordsSortBarView): IRecordsSortActions {
  const memory: ISortBarMemory = { lastField: undefined, pickedField: undefined, fieldListKey: undefined, directionListKey: undefined };
  const update = (): void => { updateSortActions(owner, fieldAction, labelAction, directionAction, memory); };
  const fieldAction = createSortDropdownAction(owner, view, "sv-sort-field",
    (item: IAction): void => { onFieldPicked(owner, item.data, memory); }, update);
  const labelAction = new Action({
    id: "sv-sort-by",
    title: "",
    enabled: false,
    disableTabStop: true,
    innerCss: <any>new ComputedUpdater(() => owner.getCssClasses().sortLabel),
    visible: <any>new ComputedUpdater(() => getSortBarState(owner, view).showSort)
  });
  const directionAction = createSortDropdownAction(owner, view, "sv-sort-direction",
    (item: IAction): void => { onDirectionPicked(owner, item.data, memory); }, update);
  container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });
  container.setItems([fieldAction, labelAction, directionAction]);
  update();
  return { container: container, update: update };
}
