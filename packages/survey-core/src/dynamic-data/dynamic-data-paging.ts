import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { ComputedUpdater } from "../base";
import { Helpers } from "../helpers";
import { DynamicDataSortDirection, IDynamicDataSort } from "./dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data-list";
import { dynamicDataSortToString, parseDynamicDataSort } from "./dynamic-data-sort";

/* The question side of the list's paging, sorting and filtering. Both dynamic questions expose the
   same members and neither of them descends from the other, so the behaviour lives here and the
   questions keep the thin public accessors.

   The division of labour is the one every helper of this library follows: the list computes, the
   question stores. pageIndex, pageCount, sortOrder and filterExpression are mirrored into the
   owner's property hash by syncState(), so that React/Vue/Angular re-render through the ordinary
   onPropertyChanged bridge; the accessors read the mirror and never the list. Every change the list
   makes on its own - a clamped page index, a filter it refused to run - reaches the mirror through
   the owner's onDataListChanged, which calls syncState() for a "reset" and a "pageChanged".

   The sort and the filter are serialized (sortBy / filterExpression), so their hash entries are not
   a pure mirror: while an authored value has not been handed to the list yet - during a load, and
   for as long as the question is in design mode - the hash is the truth and the list is the one
   that lags behind. isViewPending says which direction the next sync runs in. */
export interface IDynamicDataPagingOwner {
  getDataList(): DynamicDataList;
  getPropertyValue(name: string): any;
  setPropertyValue(name: string, val: any): void;
  // The authored page size: rowsPerPage / panelsPerPage.
  pageSize: number;
  // What the question reports: 1 page and page 0 while it does not page.
  pageIndex: number;
  pageCount: number;
  isDesignMode: boolean;
  isLoadingFromJson: boolean;
  // sortBy is computed from sortOrder and nothing raises its change on its own (see
  // setSortOrderValue). Base.propertyValueChanged is protected, so the owner raises it.
  raiseSortByChanged(oldValue: string, newValue: string): void;
}

export class DynamicDataPagingController {
  constructor(private owner: IDynamicDataPagingOwner) { }
  private get list(): DynamicDataList {
    return this.owner.getDataList();
  }
  /* In design mode nothing is paged: the authored rowsPerPage/panelsPerPage keeps its value for
     serialization, but the Creator shows every row. The page size is re-pushed on every sync and
     not only from the property setter, because both the survey and the design mode reach a question
     that has already created its list. */
  private updateListPageSize(): void {
    const size = this.owner.isDesignMode ? 0 : this.owner.pageSize;
    this.list.pageSize = size > 0 ? size : 0;
  }
  public updatePageSize(): void {
    this.updateListPageSize();
    this.syncState();
  }
  public get pageIndex(): number {
    return this.owner.getPropertyValue("pageIndex") || 0;
  }
  public set pageIndex(val: number) {
    this.list.pageIndex = val;
    this.syncState();
  }
  public get pageCount(): number {
    const res = this.owner.getPropertyValue("pageCount");
    return res > 0 ? res : 1;
  }
  /* Through the owner and not through the mirror: the question answers 1 page and page 0 whenever
     it does not page at all, and that is what "can go" has to agree with. */
  public get canGoNextPage(): boolean {
    return this.owner.pageIndex < this.owner.pageCount - 1;
  }
  public get canGoPrevPage(): boolean {
    return this.owner.pageIndex > 0;
  }
  public goToPage(index: number): void {
    this.pageIndex = index;
  }
  public nextPage(): void {
    if (this.canGoNextPage) {
      this.pageIndex = this.owner.pageIndex + 1;
    }
  }
  public prevPage(): void {
    if (this.canGoPrevPage) {
      this.pageIndex = this.owner.pageIndex - 1;
    }
  }
  public goToLastPage(): void {
    this.pageIndex = this.owner.pageCount - 1;
  }
  /* Brings the object at a position in visibleRows / visiblePanels onto the current page - the same
     arithmetic the page slice itself uses. An object that is owner-hidden has no visible index and
     therefore no page, and -1 does nothing.
     With a source that pages itself the objects exist for the loaded page only, so a visible index
     is page-local: every object there is already on the page, and the arithmetic would read it as a
     position in the whole table and navigate away from the object it was asked to reveal. */
  public goToPageOfVisibleIndex(visibleIndex: number): void {
    const pageSize = this.list.pageSize;
    if (pageSize <= 0 || visibleIndex < 0 || this.list.isPagedBySource) return;
    this.pageIndex = Math.floor(visibleIndex / pageSize);
  }
  /* The list does not announce every change of the visible count: setRecordVisible and
     invalidateViews raise nothing unless the page index had to be clamped, yet both change
     pageCount. The owner calls this from every point that can change it. */
  public syncState(): void {
    this.updateListPageSize();
    const list = this.list;
    this.owner.setPropertyValue("pageIndex", list.pageIndex);
    this.owner.setPropertyValue("pageCount", list.pageCount);
    // A sync raised by the push itself: the page state is up to date, the view is being handed over
    // right now and mirroring it half way through would wipe the half that is still pending.
    if (this.isPushingView) return;
    if (this.owner.isDesignMode) {
      /* Design mode means exactly one thing: the authored sort and filter are not handed to the
         list, so nothing is sorted or filtered. The hash keeps what was authored - it is what
         toJSON() emits - and goes back to pending, so that the empty view of the list is never
         mirrored over it. The mode is read here and not remembered: setDesignMode() notifies
         nobody, so a switch takes effect at the next sync. */
      this.clearListView();
      this.isViewPending = true;
      return;
    }
    if (this.isViewPending) {
      // While loading, the hash is filled key by key and the push waits for onSurveyLoad(): the
      // list must receive the authored view once, when it is complete.
      if (!this.owner.isLoadingFromJson) {
        this.pushAuthoredView();
      }
      return;
    }
    this.mirrorListView();
  }
  // The load is over (or a list/survey arrived after it): what was authored reaches the list now,
  // once, whatever order the JSON keys came in.
  public flushAuthoredView(): void {
    if (!this.isViewPending || this.owner.isLoadingFromJson) return;
    this.syncState();
  }
  /* True while the hash holds a sort or a filter the list has not been given. Two writers with
     opposite directions share those hash entries - the setters (hash -> list, later) and
     syncState() (list -> hash) - and this flag is what keeps them apart. */
  private isViewPending: boolean = false;
  private isPushingView: boolean = false;
  private get canPushToList(): boolean {
    return !this.owner.isDesignMode && !this.owner.isLoadingFromJson;
  }
  private mirrorListView(): void {
    const list = this.list;
    this.owner.setPropertyValue("filterExpression", list.filter);
    const sort = list.sort;
    if (!Helpers.isTwoValueEquals(this.sortOrder, sort)) {
      this.setSortOrderValue(sort.slice());
    }
  }
  private pushAuthoredView(): void {
    if (this.isPushingView) return;
    /* Cleared before the assignments and not after: a filter the list cannot run resets itself to
       "" and reports the error through onError, and a value that is still pending would be handed
       back to the list on every following sync. At runtime the hash then holds "" - the mirror
       takes what the list ended up with. In design mode the text is never parsed at all, so the
       Creator keeps a filter that does not run. */
    this.isViewPending = false;
    this.isPushingView = true;
    const list = this.list;
    const filter = this.filterExpression;
    const sort = this.sortOrder;
    if (list.filter !== filter) {
      list.filter = filter;
    }
    if (!Helpers.isTwoValueEquals(list.sort, sort)) {
      list.sort = sort;
    }
    this.isPushingView = false;
    this.mirrorListView();
  }
  // In design mode the list holds no sort and no filter: what is authored stays in the hash.
  private clearListView(): void {
    const list = this.list;
    if (!list.filter && list.sort.length === 0) return;
    this.isPushingView = true;
    list.filter = "";
    list.sort = [];
    this.isPushingView = false;
  }
  /* The one writer of the sortOrder hash entry. sortBy renders it and stores nothing of its own, so
     nothing would raise its change: dependsOn cannot help either, because addDependsOnProperty
     looks the source property up in the Serializer and sortOrder is not registered there. */
  private setSortOrderValue(val: Array<IDynamicDataSort>): void {
    const oldText = this.sortBy;
    this.owner.setPropertyValue("sortOrder", val);
    const newText = dynamicDataSortToString(val);
    if (oldText !== newText) {
      this.owner.raiseSortByChanged(oldText, newText);
    }
  }
  public get sortOrder(): Array<IDynamicDataSort> {
    return this.owner.getPropertyValue("sortOrder") || [];
  }
  public set sortOrder(val: Array<IDynamicDataSort>) {
    const newValue = Array.isArray(val) ? val.slice() : [];
    if (!this.canPushToList) {
      // The hash only: the setter neither pushes nor creates the list while the question is loading
      // or in design mode.
      if (Helpers.isTwoValueEquals(this.sortOrder, newValue)) return;
      this.setSortOrderValue(newValue);
      this.isViewPending = true;
      return;
    }
    const list = this.list;
    // The sort setter raises a reset even when the value did not change, and every reset costs a
    // full rebuild of the rows/panels.
    if (Helpers.isTwoValueEquals(list.sort, newValue)) return;
    list.sort = newValue;
    this.syncState();
  }
  /* The serialized face of sortOrder: one storage, two faces. It is the CURRENT sort and not only
     the declared one - a header click through toggleSort() changes what toJSON() emits, which is
     what the Creator wants and what a running survey never asks for. */
  public get sortBy(): string {
    return dynamicDataSortToString(this.sortOrder);
  }
  public set sortBy(val: string) {
    this.sortOrder = parseDynamicDataSort(val);
  }
  /* One field, the way a header click sorts: ascending, then descending, then not sorted. Sorting
     by a field in a given direction is sortOrder = [{...}] or sortBy = "price-" and does not need a
     third spelling; what is unique here is the cycle, which every renderer needs in one place. */
  public toggleSort(field: string): void {
    if (!field) return;
    const current = this.sortOrder.filter((s: IDynamicDataSort): boolean => s.field === field)[0];
    let dir: DynamicDataSortDirection = undefined;
    if (!current) {
      dir = "asc";
    } else if (current.direction === "asc") {
      dir = "desc";
    }
    this.sortOrder = !dir ? [] : [{ field: field, direction: dir }];
  }
  public clearSort(): void {
    this.sortOrder = [];
  }
  public get filterExpression(): string {
    return this.owner.getPropertyValue("filterExpression") || "";
  }
  public set filterExpression(val: string) {
    const newValue = !!val ? val : "";
    if (!this.canPushToList) {
      if (this.filterExpression === newValue) return;
      this.owner.setPropertyValue("filterExpression", newValue);
      this.isViewPending = true;
      return;
    }
    const list = this.list;
    if (list.filter === newValue) return;
    list.filter = newValue;
    // A filter the list cannot run locally is reported through its onError and reset to "": the
    // mirror takes what the list ended up with, not what was assigned.
    this.syncState();
  }
  /* Re-decides which records are shown. A source that filters or sorts on its own side has decided
     that already - the window IS the answer - so re-running a local filter the list never ran would
     say nothing; the window is read again instead. Every in-memory source takes the local path. */
  public refreshView(): void {
    const list = this.list;
    const source: any = list.source;
    if (!!source && (typeof source.filter === "function" || typeof source.sort === "function")) {
      list.refresh();
    } else {
      list.refreshView();
    }
    this.syncState();
  }
  // The pager the UI series renders: it computes nothing of its own.
  public createPagerActions(container: ActionContainer): ActionContainer {
    const prevAction = new Action({
      id: "sv-pager-prev",
      enabled: <any>new ComputedUpdater(() => this.canGoPrevPage),
      action: () => { this.prevPage(); }
    });
    const pageInfoAction = new Action({
      id: "sv-pager-info",
      title: <any>new ComputedUpdater(() => this.owner.pageIndex + 1 + " / " + this.owner.pageCount)
    });
    const nextAction = new Action({
      id: "sv-pager-next",
      enabled: <any>new ComputedUpdater(() => this.canGoNextPage),
      action: () => { this.nextPage(); }
    });
    container.setItems([prevAction, pageInfoAction, nextAction]);
    return container;
  }
}
