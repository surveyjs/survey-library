import { Base, ComputedUpdater } from "./base";
import { Action, IAction } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { createDropdownActionModel } from "./actions/dropdown-action";
import { ListModel } from "./list";
import { ILocalizableOwner } from "./localizablestring";
import { DynamicDataSortDirection, IDynamicDataSort } from "./dynamic-data/dynamic-data-interfaces";

// A field the sort menu offers: the value name the list sorts by and the text the menu shows.
export interface IRecordsBarSortField { field: string, title: string }
// The class names of the bar's three blocks, from the question's css.
export interface IRecordsBarCssClasses { root: string, viewActions: string, pager: string }

/* What the records bar reads from its question and the moves it makes. The question implements it on a
   private object, so the members it calls stay protected on the question. */
export interface IQuestionRecordsBarOwner {
  // The list's paging state: the page the list is on, its page count and whether the count is known.
  readonly pageIndex: number;
  readonly pageCount: number;
  readonly isCountKnown: boolean;
  readonly canGoPrevPage: boolean;
  readonly canGoNextPage: boolean;
  // What the question reports: 0 and 1 while it does not page.
  readonly reportedPageIndex: number;
  readonly reportedPageCount: number;
  goToPage(pageIndex: number): void;
  prevPage(): void;
  nextPage(): void;
  readonly isPageMovePending: boolean;
  readonly isDataLoading: boolean;
  readonly isDesignMode: boolean;
  readonly isDisposed: boolean;
  readonly sortOrder: Array<IDynamicDataSort>;
  readonly sortFields: Array<IRecordsBarSortField>;
  readonly maxSortLevels: number;
  // The type's opt-in for the sort menu (allowSortPanels, allowSortRows and where the matrix shows it).
  readonly isSortMenuAllowed: boolean;
  // The type's rule for the pager (more than one page; the panel in list mode).
  readonly showPager: boolean;
  setSortOrderByUser(sort: Array<IDynamicDataSort>): boolean;
  getLocalizationString(strName: string): string;
  getLocalizationFormatString(strName: string, ...args: any[]): string;
  // The owner of the sort lists' texts: locale, Markdown, renderers and text processing.
  getLocOwner(): ILocalizableOwner;
  getCssClasses(): IRecordsBarCssClasses;
  createActionContainer(): ActionContainer;
}

/* The bar under the records of a dynamic panel and a dynamic matrix: the sort menu (viewActions) and,
   under it, the pager (pagerActions). It computes nothing about paging or sorting of its own: it shows
   what its question answers and passes the respondent's picks back. Both containers are built on their
   first read; whether each part shows is known without them (update()). */
export class QuestionRecordsBar extends Base {
  constructor(private owner: IQuestionRecordsBarOwner) {
    super();
    this.update();
  }
  public getType(): string {
    return "recordsbar";
  }
  // The sort menu shows: the question opted in, not in design mode, with a field to sort by.
  public get showViewActions(): boolean {
    return this.getPropertyValue("showViewActions", false);
  }
  public get showPager(): boolean {
    return this.getPropertyValue("showPager", false);
  }
  // The renderers draw the bar while either part shows.
  public get isVisible(): boolean {
    return this.showViewActions || this.showPager;
  }
  public get cssClasses(): IRecordsBarCssClasses {
    return this.owner.getCssClasses();
  }
  /* Sets what the bar shows from the question's current state. The question calls it whenever an input
     of the sort menu or of the pager changes. */
  public update(): void {
    if (this.isDisposed || this.owner.isDisposed) return;
    const fields = this.owner.sortFields;
    this.setPropertyValue("showViewActions", this.owner.isSortMenuAllowed && !this.owner.isDesignMode && fields.length > 0);
    this.setPropertyValue("showPager", this.owner.showPager);
    this.updateSortActions(fields);
  }
  public dispose(): void {
    if (!!this.pagerActionsValue) {
      this.pagerActionsValue.dispose();
      this.pagerActionsValue = undefined;
    }
    if (!!this.viewActionsValue) {
      this.viewActionsValue.dispose();
      this.viewActionsValue = undefined;
      this.sortActionsValue = undefined;
    }
    super.dispose();
  }

  // The pager

  private pagerActionsValue: ActionContainer;
  public get pagerActions(): ActionContainer {
    if (!this.pagerActionsValue) {
      this.pagerActionsValue = this.createPagerActions(this.owner.createActionContainer());
    }
    return this.pagerActionsValue;
  }
  /* The pager the renderers show through their action bar: it computes nothing of its own, it shows
     what the paging helper answers. The move buttons are icons whose localized titles are their
     accessible names; the page info and the loading text are disabled items without a tab stop,
     text the keyboard passes over. Every updater reads its inputs through getPagerState(): a
     ComputedUpdater collects its dependencies once, on the first run, so an input read only in a
     branch not taken then would never be observed afterwards. */
  private getPagerState(): { pageIndex: number, pageCount: number, isCountKnown: boolean, canMove: boolean, slots: Array<number> } {
    const owner = this.owner;
    const pageIndex = owner.pageIndex;
    const pageCount = owner.pageCount;
    const isCountKnown = owner.isCountKnown;
    const canMove = !owner.isPageMovePending && !owner.isDataLoading;
    return { pageIndex: pageIndex, pageCount: pageCount, isCountKnown: isCountKnown, canMove: canMove,
      slots: isCountKnown ? getPagerSlots(pageIndex, pageCount) : [] };
  }
  // A page-move action of the pager: an icon button with a localized title.
  private createPageMoveAction(id: string, iconName: string, titleName: string, canMove: () => boolean, move: () => void, isVisible?: () => boolean): Action {
    return new Action({
      id: id,
      iconName: iconName,
      showTitle: false,
      title: <any>new ComputedUpdater(() => this.owner.getLocalizationFormatString(titleName)),
      enabled: <any>new ComputedUpdater(() => {
        const state = this.getPagerState();
        const res = canMove();
        return state.canMove && res;
      }),
      visible: !!isVisible ? <any>new ComputedUpdater(isVisible) : true,
      action: move
    });
  }
  // A page number slot: the page it shows (or the gap it marks) follows the current page.
  private createPageSlotAction(slot: number): Action {
    const getPage = (): number => {
      const slots = this.getPagerState().slots;
      return slot < slots.length ? slots[slot] : -1;
    };
    return new Action({
      id: "sv-pager-page-" + slot,
      title: <any>new ComputedUpdater(() => {
        const page = getPage();
        return page < 0 ? "\u2026" : String(page + 1);
      }),
      visible: <any>new ComputedUpdater(() => slot < this.getPagerState().slots.length),
      // The current page stays enabled: a disabled item's style would hide the active one.
      enabled: <any>new ComputedUpdater(() => {
        const state = this.getPagerState();
        return state.canMove && getPage() > -1;
      }),
      active: <any>new ComputedUpdater(() => {
        const state = this.getPagerState();
        const page = getPage();
        return page > -1 && page === state.pageIndex;
      }),
      disableTabStop: <any>new ComputedUpdater(() => getPage() < 0),
      action: (): void => {
        const page = getPage();
        if (page > -1)this.owner.goToPage(page);
      }
    });
  }
  private createPagerActions(container: ActionContainer): ActionContainer {
    const owner = this.owner;
    const items: Array<Action> = [];
    items.push(this.createPageMoveAction("sv-pager-first", "icon-arrowfirst-16x16", "pageFirstText",
      (): boolean => owner.canGoPrevPage, (): void => { owner.goToPage(0); }));
    items.push(this.createPageMoveAction("sv-pager-prev", "icon-arrowleft", "pagePrevText",
      (): boolean => owner.canGoPrevPage, (): void => { owner.prevPage(); }));
    for (let i = 0; i < pagerSlotCount; i++) {
      items.push(this.createPageSlotAction(i));
    }
    items.push(new Action({
      id: "sv-pager-info",
      /* A count nobody knows has no total to show: the page number alone. A known count goes through
         indexText like every other pager (some locales reverse the order). survey.locale is a property
         read, so the updater follows it; the global surveyLocalization.currentLocale is not observed.
         Both texts are computed on every run (see getPagerState). The info shows only while the count
         is unknown: with a known count the page number slots show the total. */
      title: <any>new ComputedUpdater(() => {
        const page = owner.reportedPageIndex + 1;
        const text = owner.getLocalizationFormatString("indexText", page, owner.reportedPageCount);
        return owner.isCountKnown ? text : String(page);
      }),
      visible: <any>new ComputedUpdater(() => !this.getPagerState().isCountKnown),
      enabled: false,
      disableTabStop: true
    }));
    items.push(this.createPageMoveAction("sv-pager-next", "icon-arrowright", "pageNextText",
      (): boolean => owner.canGoNextPage, (): void => { owner.nextPage(); }));
    // There is no last page to go to while the count is unknown.
    items.push(this.createPageMoveAction("sv-pager-last", "icon-arrowlast-16x16", "pageLastText",
      (): boolean => owner.canGoNextPage, (): void => { owner.goToPage(owner.pageCount - 1); },
      (): boolean => this.getPagerState().isCountKnown));
    items.push(new Action({
      id: "sv-pager-loading",
      title: <any>new ComputedUpdater(() => owner.getLocalizationString("loadingData")),
      visible: <any>new ComputedUpdater(() => owner.isDataLoading),
      enabled: false,
      disableTabStop: true
    }));
    container.setItems(items);
    return container;
  }

  // The sort menu

  /* The sort toolbar above the pager. It holds the sort menu: one dropdown per sort level, "Sort by" and
     then "Then by"; the page size selector and a filter are meant to join it. */
  private viewActionsValue: ActionContainer;
  private sortActionsValue: Array<Action>;
  private sortListKeys: Array<string>;
  public get viewActions(): ActionContainer {
    if (!this.viewActionsValue) {
      this.viewActionsValue = this.owner.createActionContainer();
      // Every level the menu may show, created once and hidden while not needed, as the pager's slots.
      this.sortActionsValue = [];
      for (let level = 0; level < maxSortLevelCount; level++) {
        this.sortActionsValue.push(this.createSortAction(level));
      }
      this.sortListKeys = [];
      this.viewActionsValue.setItems(this.sortActionsValue);
      this.updateSortActions(this.owner.sortFields);
    }
    return this.viewActionsValue;
  }
  private createSortAction(level: number): Action {
    return createDropdownActionModel({
      id: level === 0 ? "sv-sort-by" : "sv-sort-then-by-" + level,
      title: this.owner.getLocalizationString(level === 0 ? "sortByText" : "sortThenByText"),
      showTitle: true,
      visible: false
    }, {
      items: [],
      allowSelection: true,
      onSelectionChanged: (item: IAction): void => { this.onSortItemPicked(level, item); }
    }, this.owner.getLocOwner());
  }
  /* A pick from the list of a level. ListModel has already selected the item and the dropdown has
     already copied its title onto the button; every level is put back from sortOrder right after the
     pick, so the menu shows the committed sort: a pick rejected at once or waiting for asynchronous
     validators leaves the old one. An accepted asynchronous pick arrives through the sortOrder change.
     The clear item ends the sort at this level; the field already at this level flips its direction
     and keeps the later levels; another field resets them. */
  private onSortItemPicked(level: number, item: IAction): void {
    const field: string = !!item ? item.data : undefined;
    const sort = this.owner.sortOrder;
    const current = sort[level];
    let newSort: Array<IDynamicDataSort>;
    if (!field) {
      newSort = sort.slice(0, level);
    } else if (!!current && current.field === field) {
      const direction: DynamicDataSortDirection = current.direction === "asc" ? "desc" : "asc";
      newSort = sort.map((s: IDynamicDataSort, index: number): IDynamicDataSort => index === level ? { field: field, direction: direction } : s);
    } else {
      newSort = sort.slice(0, level).concat([{ field: field, direction: "asc" }]);
    }
    this.owner.setSortOrderByUser(newSort);
    this.update();
  }
  private getSortFieldTitle(field: string, fields: Array<IRecordsBarSortField>): string {
    const item = fields.filter(f => f.field === field)[0];
    return !!item ? item.title : field;
  }
  /* Sets everything the sort menu shows, level by level: whether a level is there and usable, its title,
     icon and accessible name, its list and its selected item. Level 0 shows with the menu; a later level
     while the level before it shows and has a sort, within maxSortLevels, and when it has something to
     show: a sort of its own (whatever the field, so a sort in force is never hidden) or a field the earlier
     levels left. Nothing to do before the toolbar is created. */
  private updateSortActions(fields: Array<IRecordsBarSortField>): void {
    const actions = this.sortActionsValue;
    if (!actions) return;
    const owner = this.owner;
    const sort = owner.sortOrder;
    const isEnabled = !owner.isDataLoading && !owner.isPageMovePending;
    let isPrevVisible = this.showViewActions;
    for (let level = 0; level < actions.length; level++) {
      const action = actions[level];
      const current = sort[level];
      const usedFields = sort.slice(0, level).map((s: IDynamicDataSort): string => s.field);
      const levelFields = fields.filter(f => usedFields.indexOf(f.field) < 0);
      const isVisible = level === 0 ? isPrevVisible :
        isPrevVisible && !!sort[level - 1] && level < owner.maxSortLevels && (!!current || levelFields.length > 0);
      action.visible = isVisible;
      action.enabled = isEnabled;
      // A hidden level is kept current too: it shows what it has once it appears.
      this.updateSortActionTexts(action, level, current, fields);
      this.updateSortList(level, levelFields, current, fields);
      isPrevVisible = isVisible;
    }
  }
  private updateSortActionTexts(action: Action, level: number, current: IDynamicDataSort, fields: Array<IRecordsBarSortField>): void {
    const owner = this.owner;
    const levelText = owner.getLocalizationString(level === 0 ? "sortByText" : "sortThenByText");
    if (!current) {
      action.title = levelText;
      action.iconName = undefined;
      action.ariaLabel = levelText;
    } else {
      const title = this.getSortFieldTitle(current.field, fields);
      const isDesc = current.direction === "desc";
      action.title = owner.getLocalizationFormatString(level === 0 ? "sortByFieldText" : "sortThenByFieldText", title);
      action.iconName = isDesc ? "icon-chevrondown-16x16" : "icon-chevronup-16x16";
      action.ariaLabel = levelText + " " + title + ", " + owner.getLocalizationString(isDesc ? "sortDescendingText" : "sortAscendingText");
    }
    action.tooltip = action.ariaLabel;
  }
  /* The list of a level: the clear item, the fallback item of a field the menu does not offer while it
     occupies this level (so the list shows the committed sort and it can be flipped), then the fields
     the earlier levels left. */
  private updateSortList(level: number, levelFields: Array<IRecordsBarSortField>, current: IDynamicDataSort,
    fields: Array<IRecordsBarSortField>): void {
    const list = <ListModel>this.sortActionsValue[level].data;
    const clearTitle = this.owner.getLocalizationString(level === 0 ? "sortDefaultOrderText" : "sortNoneText");
    const fallbackField = !!current && !fields.some(f => f.field === current.field) ? current.field : undefined;
    // The items are recreated only when what they show changed: an open list keeps its items.
    const key = JSON.stringify([clearTitle, fallbackField, levelFields]);
    if (this.sortListKeys[level] !== key) {
      this.sortListKeys[level] = key;
      const items: Array<IAction> = [{ id: level === 0 ? "sv-sort-default" : "sv-sort-none", title: clearTitle }];
      if (!!fallbackField) {
        items.push({ id: "sv-sort-by-" + fallbackField, title: fallbackField, data: fallbackField });
      }
      levelFields.forEach((f: IRecordsBarSortField): void => {
        items.push({ id: "sv-sort-by-" + f.field, title: f.title, data: f.field });
      });
      list.setItems(items);
    }
    const activeField = !!current ? current.field : undefined;
    list.selectedItem = list.actions.filter(item => !activeField ? !item.data : item.data === activeField)[0];
  }
}

// The most sort levels the sort menu can show (maxSortLevels).
export const maxSortLevelCount = 5;
// The page number slots of the pager: the first and the last page, the current one and one on each side.
const pagerSlotCount = 7;
/* The pages the slots show, zero-based, -1 for a gap. The count stays pagerSlotCount once there are
   more pages than slots, so the buttons around the current page do not move while it changes:
   0 1 2 3 4 ... N-1 near the start, 0 ... N-5 .. N-1 near the end, 0 ... c-1 c c+1 ... N-1 between. */
function getPagerSlots(pageIndex: number, pageCount: number): Array<number> {
  const res: Array<number> = [];
  if (pageCount <= pagerSlotCount) {
    for (let i = 0; i < pageCount; i++) res.push(i);
    return res;
  }
  const last = pageCount - 1;
  if (pageIndex <= 3) return [0, 1, 2, 3, 4, -1, last];
  if (pageIndex >= pageCount - 4) return [0, -1, last - 4, last - 3, last - 2, last - 1, last];
  return [0, -1, pageIndex - 1, pageIndex, pageIndex + 1, -1, last];
}
