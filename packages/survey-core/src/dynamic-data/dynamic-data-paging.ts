import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { ComputedUpdater } from "../base";
import { Helpers } from "../helpers";
import { DynamicDataSortDirection, IDynamicDataSort } from "./dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data-list";

/* The question side of the list's paging, sorting and filtering. Both dynamic questions expose the
   same members and neither of them descends from the other, so the behaviour lives here and the
   questions keep the thin public accessors.

   The division of labour is the one every helper of this library follows: the list computes, the
   question stores. pageIndex, pageCount, sortOrder and filter are mirrored into the owner's
   property hash by syncState(), so that React/Vue/Angular re-render through the ordinary
   onPropertyChanged bridge; the accessors read the mirror and never the list. Every change the list
   makes on its own - a clamped page index, a filter it refused to run - reaches the mirror through
   the owner's onDataListChanged, which calls syncState() for a "reset" and a "pageChanged". */
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
     therefore no page, and -1 does nothing. */
  public goToPageOfVisibleIndex(visibleIndex: number): void {
    const pageSize = this.list.pageSize;
    if (pageSize <= 0 || visibleIndex < 0) return;
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
    this.owner.setPropertyValue("filter", list.filter);
    const sort = list.sort;
    if (!Helpers.isTwoValueEquals(this.sortOrder, sort)) {
      this.owner.setPropertyValue("sortOrder", sort.slice());
    }
  }
  public get sortOrder(): Array<IDynamicDataSort> {
    return this.owner.getPropertyValue("sortOrder") || [];
  }
  public set sortOrder(val: Array<IDynamicDataSort>) {
    const newValue = Array.isArray(val) ? val : [];
    if (this.owner.isDesignMode) return;
    const list = this.list;
    // The sort setter raises a reset even when the value did not change, and every reset costs a
    // full rebuild of the rows/panels.
    if (Helpers.isTwoValueEquals(list.sort, newValue)) return;
    list.sort = newValue;
    this.syncState();
  }
  /* One field, the way a header click sorts: ascending, then descending, then not sorted. A
     multi-field sort is assigned through sortOrder. */
  public sortBy(field: string, direction?: DynamicDataSortDirection): void {
    if (!field) return;
    let dir = direction;
    if (!dir) {
      const current = this.sortOrder.filter((s: IDynamicDataSort): boolean => s.field === field)[0];
      if (!current) {
        dir = "asc";
      } else {
        dir = current.direction === "asc" ? "desc" : undefined;
      }
    }
    this.sortOrder = !dir ? [] : [{ field: field, direction: dir }];
  }
  public clearSort(): void {
    this.sortOrder = [];
  }
  public get filter(): string {
    return this.owner.getPropertyValue("filter") || "";
  }
  public set filter(val: string) {
    const newValue = !!val ? val : "";
    if (this.owner.isDesignMode) return;
    const list = this.list;
    if (list.filter === newValue) return;
    list.filter = newValue;
    // A filter the list cannot run locally is reported through its onError and reset to "": the
    // mirror takes what the list ended up with, not what was assigned.
    this.syncState();
  }
  public refreshView(): void {
    this.list.refreshView();
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
