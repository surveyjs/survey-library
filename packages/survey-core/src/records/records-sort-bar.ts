import { ComputedUpdater } from "../base";
import { Action, IAction } from "../actions/action";
import { AdaptiveActionContainer, UpdateResponsivenessMode } from "../actions/adaptive-container";
import type { ActionContainer } from "../actions/container";
import type { ILocalizableOwner } from "../localizablestring";
import { settings } from "../settings";
import { DynamicDataFieldType, ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";
import { getFirstSortDirection, getSortDirectionLocStringName } from "./records-sort-directions";
import { copySort, createSortDropdownAction, findSortField, focusSortAction, isFocusInsideOrIdle, getShownSortField, getSortDirection, getSortDirectionListItems,
  getSortFieldItems, IShownSortField, ISortListKeys, setSortListItems } from "./records-sort-items";
import { RecordsSortDialogModel, showRecordsSortDialog } from "./records-sort-dialog";

// A field the sort bar offers: the record key the list sorts by, the text the bar shows and the data type the list registered.
export interface IRecordsSortField { field: string, title: string, dataType: DynamicDataFieldType }
/* The class names the sort bar gives its dropdowns, its "Sort by" text and the container of a sort level, and
   the ones of the sort dialog: its list of rows and each row. */
export interface IRecordsSortBarCssClasses { sortDropdown: string, sortLabel: string, sortLevel: string, sortDialog: string, sortDialogRow: string }

// What the sort bar reads from its records question and the move it makes.
export interface IRecordsSortBarOwner {
  // The current sort as plain criteria; the bar shows every level of it.
  readonly sortCriteria: Array<ISortCriterion>;
  // The fields the bar offers, in the order the question shows them. Computed on every read.
  readonly sortFields: Array<IRecordsSortField>;
  // The API's opt-in: allowSort, and on the matrix showSortBar.
  readonly isSortBarVisible: boolean;
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
  // Gives the container the survey's action bar classes; a new plain container when none is passed.
  createActionContainer<T extends ActionContainer>(container?: T): T;
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
  return owner.isSortBarVisible && !owner.isDesignMode && !owner.isCollapsed && fields.length > 0;
}

interface ISortBarState {
  showSort: boolean;
  canSort: boolean;
}
/* Every updater of the sort bar reads its inputs through here. A ComputedUpdater collects its
   dependencies on its first run only, so an input that a && or || skips on that run is never
   observed afterwards: every input is read into its own local before any of them is combined. */
export function getSortBarState(owner: IRecordsSortBarOwner, view: IRecordsSortBarView): ISortBarState {
  const showSort = view.showSort;
  const isDataLoading = owner.isDataLoading;
  const isPageMovePending = owner.isPageMovePending;
  return { showSort: showSort, canSort: !isDataLoading && !isPageMovePending };
}

/* One level of the bar: the item of the bar (component sv-sort-bar-level), whose data is the level's
   own container - [field v] [direction v], plus a remove button from the second level on. A group
   belongs to its position: the k-th group shows the k-th level of the sort. sizeKey holds what decides
   the group's width (its titles and its remove button), which the bar's container does not see. */
interface ISortLevelGroup {
  action: Action;
  container: ActionContainer;
  field: Action;
  direction: Action;
  remove: Action;
  keys: ISortListKeys;
  sizeKey: string;
}

/* The container of the sort bar. On a desktop it fits the bar to its width by whole levels (SD02, SD08):
   while every level and "+" fit, they all show. Otherwise "+" leaves, "..." takes its place, and the levels
   leave the bar from the last one, with mode "removed", until "Sort by", the levels left and "..." fit;
   "..." shows only while a level is out. "Sort by" and the first level never leave. A level is one item of
   the bar, so a level is never split. The dotsItem menu is not used: it would list single actions and open
   a list, not the dialog. On a phone nothing is fitted: every level and "+" show and the row scrolls. */
export class RecordsSortBarContainer extends AdaptiveActionContainer {
  // The items fit() may take out of the bar - the levels from the second one on - and "..." and "+". Set by the bar.
  public hideableActions: Array<Action> = [];
  public moreAction: Action;
  public addLevelAction: Action;
  private afterFitCallback: () => void;
  private afterFitTime: number;

  protected getRenderedActions(): Array<Action> {
    return this.visibleActions;
  }
  /* The sizes are the ones the manager measured, a hidden item's included (it is rendered and measured
     without its hidden class). A level is measured in its large mode only: it has no small one. */
  public fit(options: { availableSpace: number, gap?: number }): void {
    if (this.isResponsivenessDisabled) {
      this.showAllLevels();
    } else if (options.availableSpace > 0) {
      this.fitLevels(options.availableSpace, options.gap || 0);
    }
    this.runAfterFitCallback();
  }
  /* "..." and "+" are measured each: their boxes match in the design, but nothing makes them. "+" that is
     not visible (maxSortLevel 1) takes no part: the levels alone are compared, then the levels with "...".
     With a single level nothing can leave, so the bar keeps "+" and no "...", even when it does not fit. */
  private fitLevels(availableSpace: number, gap: number): void {
    const visible = this.visibleActions;
    const more = visible.indexOf(this.moreAction) > -1 ? this.moreAction : undefined;
    const add = visible.indexOf(this.addLevelAction) > -1 ? this.addLevelAction : undefined;
    const levels = this.hideableActions.filter((item: Action): boolean => visible.indexOf(item) > -1);
    const fixed = visible.filter((item: Action): boolean => item !== more && item !== add && levels.indexOf(item) < 0);
    const getWidth = (count: number, last: Action): number => {
      const items = fixed.concat(levels.slice(0, count), !!last ? [last] : []);
      let res = -gap;
      items.forEach((item: Action): void => { res += (item.maxDimension || 0) + gap; });
      return res;
    };
    let count = levels.length;
    // Once the bar overflows, at least one level leaves: "..." never shows with every level in the bar.
    if (count > 0 && getWidth(count, add) > availableSpace) {
      count--;
      while(count > 0 && getWidth(count, more) > availableSpace) {
        count--;
      }
    }
    const isOverflow = count < levels.length;
    fixed.forEach((item: Action): void => { item.mode = "large"; });
    levels.forEach((item: Action, index: number): void => { item.mode = index < count ? "large" : "removed"; });
    if (!!more) {
      more.mode = isOverflow ? "large" : "removed";
    }
    if (!!add) {
      add.mode = isOverflow ? "removed" : "large";
    }
  }
  private showAllLevels(): void {
    this.actions.forEach((item: Action): void => { item.mode = item === this.moreAction ? "removed" : "large"; });
  }
  // On a phone the bar is not fitted: every level shows. Back on a desktop, every item is measured again.
  public setResponsive(isResponsive: boolean): void {
    if (this.isResponsivenessDisabled === !isResponsive) return;
    this.isResponsivenessDisabled = !isResponsive;
    if (!isResponsive) {
      this.showAllLevels();
    } else {
      this.raiseUpdate({ updateResponsivenessMode: UpdateResponsivenessMode.Hard });
    }
  }
  /* The width of an item changed where the container cannot see it - a title of an action inside a level.
     A rendered item is measured again by a light update; one out of the bar ("removed") through a hard
     update, which renders and measures every item. */
  public refitAction(action: Action): void {
    action.needUpdateMaxDimension = true;
    action.needUpdateMinDimension = true;
    const mode = action.mode === "removed" ? UpdateResponsivenessMode.Hard : UpdateResponsivenessMode.Light;
    this.raiseUpdate({ updateResponsivenessMode: mode });
  }
  /* Runs the callback once the bar has been fitted again, so that it reads what the respondent sees. It
     refits the bar to have one. With no fitting (a phone, no renderer) it runs at once. A callback that no
     fit runs within a second - the bar is not visible - is dropped, so a later fit cannot move the focus. */
  public runAfterFit(callback: () => void): void {
    if (this.isResponsivenessDisabled || !this.responsivityManager) {
      callback();
      return;
    }
    this.afterFitCallback = callback;
    this.afterFitTime = Date.now();
    this.raiseUpdate({ updateResponsivenessMode: UpdateResponsivenessMode.Light });
  }
  private runAfterFitCallback(): void {
    const callback = this.afterFitCallback;
    this.afterFitCallback = undefined;
    if (!!callback && Date.now() - this.afterFitTime <= 1000) {
      callback();
    }
  }
  public dispose(): void {
    this.afterFitCallback = undefined;
    this.hideableActions = [];
    this.moreAction = undefined;
    this.addLevelAction = undefined;
    super.dispose();
  }
}

/* The sort bar the renderers show through their action bar, in the design's order:
   Sort by  [field v] [direction v]  |  [field v] [direction v] [remove]  |  [...] or [+]
   It shows every level of the sort, with at least one group: a sort from code may have more levels
   than maxSortLevel, which limits only "+". "Sort by" is a disabled item without a tab stop, text the
   keyboard passes over. "..." takes the place of "+" while the container has taken levels out of the
   bar, and opens the sort dialog with every level. The bar computes no sort of its own: it shows the
   question's sortCriteria and passes the respondent's picks back through sortByUser, each one with the complete new sort. */
class RecordsSortBar implements IRecordsSortActions {
  /* lastField: the field the respondent last sorted the first level by through the bar, shown while
     nothing is sorted. pickedField: the first field of the last pick, which becomes lastField once
     the sort holds it - a pick refused by a validator, or still waiting for one, leaves the shown
     field as it was. */
  private lastField: string;
  private pickedField: string;
  private groups: Array<ISortLevelGroup> = [];
  private labelAction: Action;
  private moreAction: Action;
  private addAction: Action;
  private dialog: RecordsSortDialogModel;

  constructor(public container: RecordsSortBarContainer, private owner: IRecordsSortBarOwner, private view: IRecordsSortBarView) {
    this.labelAction = new Action({
      id: "sv-sort-by",
      title: "",
      enabled: false,
      disableTabStop: true,
      innerCss: <any>new ComputedUpdater(() => owner.getCssClasses().sortLabel),
      visible: <any>new ComputedUpdater(() => getSortBarState(owner, view).showSort)
    });
    // Shown by the container's fit only: out of the bar ("removed") until a level is. It has the box of "+".
    this.moreAction = new Action({
      id: "sv-sort-more",
      title: "",
      showTitle: false,
      iconName: "icon-more-16x16",
      iconSize: "auto",
      needSeparator: true,
      appearance: { showBorder: true },
      mode: "removed",
      visible: <any>new ComputedUpdater(() => {
        const showSort = getSortBarState(owner, view).showSort;
        const isMobile = owner.isMobile;
        return showSort && !isMobile;
      }),
      action: (): void => { this.showDialog(); }
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
    container.moreAction = this.moreAction;
    container.addLevelAction = this.addAction;
    container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });
    this.update();
  }

  /* Sets what every item shows from the sort: the number of groups, then the titles, accessible
     names, lists and selected items of each group, "..." and "+". It runs after every pick too.
     ListModel selects the picked item before the pick is validated, and the dropdown copies its title
     onto the button: a pick refused by a required cell, or waiting for an asynchronous validator, has
     not sorted, and the bar shows the sort the question has. An accepted asynchronous pick arrives
     through the sortCriteria change. An open dialog follows the locale and the loading states. */
  public update(): void {
    const owner = this.owner;
    const sort = owner.sortCriteria;
    const fields = owner.sortFields;
    if (sort.length > 0 && sort[0].field === this.pickedField) {
      this.lastField = sort[0].field;
    }
    this.container.setResponsive(!owner.isMobile);
    this.updateGroupCount(Math.max(1, sort.length));
    this.groups.forEach((group: ISortLevelGroup, index: number): void => {
      this.updateGroup(group, index, sort, fields);
    });
    this.labelAction.title = owner.getLocalizationString("sortByText");
    const moreTitle = owner.getLocalizationString("sortMoreAriaLabel");
    this.moreAction.title = moreTitle;
    this.moreAction.ariaLabel = moreTitle;
    this.updateAddAction(sort, fields);
    if (!!this.dialog) {
      this.dialog.update();
    }
  }
  public dispose(): void {
    this.closeDialog();
    this.groups.forEach((group: ISortLevelGroup): void => { group.container.dispose(); });
    this.groups = [];
    this.container.dispose();
  }

  /* Only a change in the number of levels adds or removes groups, at the end. The new items array
     passes the surviving actions themselves: setItems keeps an action it is given, and the renderers
     key the items by uniqueId, so a surviving item stays mounted and keeps the focus. setItems
     disposes nothing: a removed group is disposed here, with its container, its actions and their
     list and popup models. setItems makes the container measure and fit every item again. */
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
    items.push(this.moreAction);
    items.push(this.addAction);
    this.container.hideableActions = this.groups.slice(1).map((group: ISortLevelGroup): Action => group.action);
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
    return { action: action, container: container, field: field, direction: direction, remove: remove, keys: {}, sizeKey: undefined };
  }
  private createSortDropdownAction(id: string, onPicked: (item: IAction) => void): Action {
    const owner = this.owner;
    const view = this.view;
    return createSortDropdownAction(owner, {
      id: id,
      iconName: "icon-chevrondown-16x16",
      showBorder: true,
      innerCss: (): string => owner.getCssClasses().sortDropdown,
      visible: (): boolean => getSortBarState(owner, view).showSort,
      enabled: (): boolean => getSortBarState(owner, view).canSort,
      onPicked: (item: IAction): void => {
        onPicked(item);
        this.update();
      }
    });
  }

  /* The field a level shows: the field of its sort level - a fallback item when the bar does not offer
     it. The first level with no sort: the field last sorted by through the bar while it is offered,
     otherwise the first offered field. */
  private getShownField(index: number, sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): IShownSortField {
    const criterion = sort[index];
    if (!!criterion) return getShownSortField(this.owner, fields, criterion.field);
    const shown = findSortField(fields, this.lastField) || fields[0];
    return !!shown ? Object.assign({ isFallback: false }, shown) : undefined;
  }
  private updateGroup(group: ISortLevelGroup, index: number, sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): void {
    const owner = this.owner;
    const level = index + 1;
    const shown = this.getShownField(index, sort, fields);
    // A field is in one level at most: the list leaves out the fields of the other levels.
    const otherFields = sort.filter((_: ISortCriterion, i: number): boolean => i !== index).map((item: ISortCriterion): string => item.field);
    const fieldList = setSortListItems(group.keys, "field", group.field, getSortFieldItems(fields, otherFields, shown));
    fieldList.selectedItem = !!shown ? fieldList.actions.filter((item: Action): boolean => item.data === shown.field)[0] : undefined;
    const fieldTitle = !!shown ? shown.title : "";
    group.field.title = fieldTitle;
    const fieldLabel = index === 0 ? owner.getLocalizationString("sortFieldAriaLabel") : owner.getLocalizationFormatString("sortLevelFieldAriaLabel", level);
    group.field.ariaLabel = fieldLabel + " " + fieldTitle;

    // The first level offers Default, which clears the whole sort; a later level is taken out with its remove button.
    const defaultTitle = owner.getLocalizationString("sortDefaultText");
    const dataType = !!shown ? shown.dataType : "any";
    const noSortItem: IAction = index === 0 ? { id: "sv-sort-direction-default", title: defaultTitle } : undefined;
    const directionList = setSortListItems(group.keys, "direction", group.direction, getSortDirectionListItems(owner, dataType, noSortItem));
    const criterion = sort[index];
    const direction = !!criterion ? getSortDirection(criterion) : undefined;
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
    this.updateGroupSize(group);
  }
  /* The container watches the titles of its own items only: a new title of a level's field or direction,
     or its remove button shown or hidden, makes the level wider or narrower, and the bar fits again. */
  private updateGroupSize(group: ISortLevelGroup): void {
    const sizeKey = JSON.stringify([group.field.title, group.direction.title, !!group.remove && group.remove.visible]);
    if (group.sizeKey === sizeKey) return;
    const isNew = group.sizeKey === undefined;
    group.sizeKey = sizeKey;
    if (!isNew) {
      this.container.refitAction(group.action);
    }
  }
  // The first offered field that no level has, for "+"; undefined when every offered field is in the sort.
  private getFreeField(sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): IRecordsSortField {
    return fields.filter((item: IRecordsSortField): boolean => !sort.some((criterion: ISortCriterion): boolean => criterion.field === item.field))[0];
  }
  /* "+" shows while the respondent can add levels (maxSortLevel above 1); the container's fit takes it
     out while "..." shows. It is disabled once the sort has maxSortLevel levels (or more, from code) or no
     offered field is left for another one, while nothing is sorted - a second level under an unsorted
     first one is no sort - and while no sort can be made. update() runs on every one of these inputs,
     the loading states included. */
  private updateAddAction(sort: Array<ISortCriterion>, fields: Array<IRecordsSortField>): void {
    const state = getSortBarState(this.owner, this.view);
    const maxSortLevel = this.owner.maxSortLevel;
    const canAdd = sort.length > 0 && sort.length < maxSortLevel && !!this.getFreeField(sort, fields);
    this.addAction.visible = state.showSort && maxSortLevel > 1;
    this.addAction.enabled = state.canSort && canAdd;
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
    const offered = findSortField(this.owner.sortFields, field);
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
     once, like a field pick. The focus is decided once the bar is fitted again: it stays on "+" while "+"
     is in the bar and enabled. Otherwise it moves to "..." when the new level is out of the bar, or to the
     new level's field dropdown. A browser may leave the focus on a disabled "+", so it is moved anyway. */
  private onAddLevel(): void {
    const owner = this.owner;
    const sort = copySort(owner.sortCriteria);
    const free = this.getFreeField(sort, owner.sortFields);
    if (sort.length < 1 || !free || sort.length >= owner.maxSortLevel) return;
    const hadFocus = isFocusInsideOrIdle(this.owner, this.addAction);
    sort.push({ field: free.field, direction: getFirstSortDirection(free.dataType) });
    const isAdded = this.sortByUser(sort) && owner.sortCriteria.length === sort.length;
    this.update();
    if (isAdded && hadFocus) {
      const group = this.groups[sort.length - 1];
      this.container.runAfterFit((): void => {
        if (this.addAction.isVisible && this.addAction.enabled) return;
        if (!!group && group.action.mode === "removed") {
          focusSortAction(owner, this.moreAction, true);
        } else {
          this.focusField(sort.length - 1, true);
        }
      });
    }
  }
  public sortByUser(criteria: Array<ISortCriterion>): boolean {
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
    focusSortAction(this.owner, group.field, isTimeOut);
  }

  /* "..." opens the dialog with every level of the sort (SD03) as a draft: nothing sorts until Apply
     (SD04). The first row shows the field the first level shows. When the dialog closes, the focus goes
     back to "..." while the bar, fitted again, still shows it; otherwise to the first level's field,
     which never leaves the bar. */
  private showDialog(): void {
    if (!!this.dialog || !settings.showDialog) return;
    const sort = this.owner.sortCriteria;
    const shown = this.getShownField(0, sort, this.owner.sortFields);
    const dialog = new RecordsSortDialogModel(this.owner, {
      shownField: !!shown ? shown.field : undefined,
      sortByUser: (criteria: Array<ISortCriterion>): boolean => this.sortByUser(criteria),
      onApplied: (): void => { this.update(); }
    });
    this.dialog = dialog;
    showRecordsSortDialog(dialog, this.owner, (): void => { this.onDialogClosed(dialog); });
  }
  private onDialogClosed(dialog: RecordsSortDialogModel): void {
    if (this.dialog !== dialog) return;
    this.dialog = undefined;
    dialog.dispose();
    if (this.container.isDisposed) return;
    this.container.runAfterFit((): void => {
      if (this.moreAction.isVisible) {
        focusSortAction(this.owner, this.moreAction, true);
      } else {
        this.focusField(0, true);
      }
    });
  }
  private closeDialog(): void {
    const dialog = this.dialog;
    if (!dialog) return;
    this.dialog = undefined;
    dialog.close();
    dialog.dispose();
  }
}

export function createRecordsSortActions(container: RecordsSortBarContainer, owner: IRecordsSortBarOwner, view: IRecordsSortBarView): IRecordsSortActions {
  return new RecordsSortBar(container, owner, view);
}
