import { Helpers } from "../helpers";
import { SortDirection, ISortCriterion } from "../dynamic-data/dynamic-data-interfaces";
import { DynamicDataList } from "../dynamic-data/dynamic-data-list";
import { normalizeSort } from "../dynamic-data/dynamic-data-view";
import { ISortCriterionOwner, SortCriterion } from "./records-sort-criterion";
import { Scope } from "../utils/scope";

/* The question side of the list's paging, sorting and filtering. The behaviour lives here and the
   questions keep the thin public accessors. Its owner is a private object of the question
   (QuestionRecordsModel), which answers from the question's property hash and hooks, so the paging
   owner members are not part of any question's public type.

   The division of labour is the one every helper of this library follows: the list computes, the
   question stores. pageIndex, pageCount, sortCriteria and filterExpression are mirrored into the
   owner's property hash by syncState(), so that React/Vue/Angular re-render through the ordinary
   onPropertyChanged bridge; the accessors read the mirror and never the list. Every change the list
   makes on its own - a clamped page index, a filter it refused to run, a sort it normalized - reaches
   the mirror through QuestionRecordsModel.onDataListChanged, which calls syncState() for a
   "reset" and a "pageChanged".

   The sort and the filter are serialized (sortCriteria / filterExpression), so their hash entries are
   not a pure mirror: while an authored value has not been handed to the list yet - during a load, and
   for as long as the question is in design mode - the hash is the truth and the list is the one
   that lags behind. isViewPending says which direction the next sync runs in. */
/* The keys the paging state is kept under in the owner's property hash: the paging helper writes them
   (isPageMovePending is the page validation's), and the question reads them back. */
export const pagingStateKeys = {
  pageSize: "pageSize", pageIndex: "pageIndex", pageCount: "pageCount", isCountKnown: "isCountKnown",
  isPageMovePending: "isPageMovePending", sortCriteria: "sortCriteria", filterExpression: "filterExpression"
};
export interface IRecordsPagingOwner {
  getPropertyValue(name: string): any;
  setPropertyValue(name: string, val: any): void;
  // The owner's live array property (Base.getArrayPropertyValue / setArrayPropertyValue): sortCriteria.
  getArrayPropertyValue(name: string, onPush: (item: any) => void): Array<any>;
  setArrayPropertyValue(name: string, val: Array<any>): void;
  getLocalizationFormatString(strName: string, ...args: any[]): string;
  // The authored page size: pageSize.
  pageSize: number;
  /* The page size the list gets at runtime: the authored one, except in single-input mode, which is
     its own paging and builds every object. Absent -> pageSize. */
  listPageSize?: number;
  /* The most criteria a respondent's toggleSort(field, true) leaves in the sort: maxSortLevel.
     Absent or 0 -> no limit. sort(), sortCriteria and JSON are never limited. */
  maxSortLevel?: number;
  // What the question reports: 1 page and page 0 while it does not page.
  pageIndex: number;
  pageCount: number;
  isDesignMode: boolean;
  isLoadingFromJson: boolean;
  /* A move the respondent makes: the owner validates the page it leaves when the move goes forward
     (see RecordsPageValidation.leave, question-side) and runs move now, later, or never. Returns
     false only when an error was found synchronously. Absent -> the move just happens. */
  leavePage?(isForward: boolean, move: () => void): boolean;
  // Drops a move that waits for its validators: every change that replaces the page from code.
  cancelPendingPageMove?(): void;
}

/* What a paged question hands to the ancestor that rebuilds the object holding it, and gets back
   when that object is created again for the same outer record: the records edited and not validated
   yet, the page it was on, and - one level down - the same for the paged questions nested in its own
   records. It belongs to the records and not to the object, so it has to outlive the object. */
export interface IRecordsPageState {
  pageIndex: number;
  edited: Array<number>;
  nested: { [recordIndex: number]: { [valueName: string]: IRecordsPageState } };
}

// The sort as plain { field, direction } objects, in the order given: never the caller's own objects.
function toPlainSort(sort: Array<ISortCriterion>): Array<ISortCriterion> {
  if (!Array.isArray(sort)) return [];
  return sort.filter((item: ISortCriterion): boolean => !!item)
    .map((item: ISortCriterion): ISortCriterion => ({ field: item.field, direction: item.direction }));
}
/* Compared as { field, direction } projections and in order: Helpers.isTwoValueEquals never finds a
   SortCriterion equal to a plain object. */
function isSameSort(a: Array<ISortCriterion>, b: Array<ISortCriterion>): boolean {
  return a.length === b.length && a.every((item: ISortCriterion, index: number): boolean =>
    item.field === b[index].field && item.direction === b[index].direction);
}

export class RecordsPagingController implements ISortCriterionOwner {
  // getList: whoever holds the list hands it over; it may create the list when it is asked.
  constructor(private owner: IRecordsPagingOwner, private getList: () => DynamicDataList) { }
  private get list(): DynamicDataList {
    return this.getList();
  }
  /* In design mode nothing is paged: the authored pageSize keeps its value for
     serialization, but the Creator shows every row. The page size is re-pushed on every sync and
     not only from the property setter, because both the survey and the design mode reach a question
     that has already created its list. */
  private get runtimePageSize(): number {
    const size = this.owner.isDesignMode ? 0 : this.listPageSize;
    return size > 0 ? size : 0;
  }
  private updateListPageSize(): void {
    this.list.pageSize = this.runtimePageSize;
  }
  public updatePageSize(): void {
    this.updateListPageSize();
    this.syncState();
  }
  /* The setter of the authored page size (pageSize). The clamp is
     here and not in an onSettingValue hook: the hook is skipped while the question is loading from
     JSON. */
  public setPageSize(val: any): void {
    const num = Helpers.getNumber(val);
    this.owner.setPropertyValue(pagingStateKeys.pageSize, num > 0 ? num : 0);
    this.updatePageSize();
  }
  // Returns true when the list pages by another size now: that resets the list.
  public updatePageSizeIfChanged(): boolean {
    if (this.list.pageSize === this.runtimePageSize) return false;
    this.updatePageSize();
    return true;
  }
  public get pageIndex(): number {
    return this.owner.getPropertyValue(pagingStateKeys.pageIndex) || 0;
  }
  // A page set from code: no validation, and a move that waits for its validators is dropped.
  public set pageIndex(val: number) {
    this.cancelPendingPageMove();
    this.setPageIndexCore(val);
  }
  private setPageIndexCore(val: number): void {
    this.list.pageIndex = val;
    this.syncState();
  }
  // The move itself, once the page it leaves has passed: the pending move it may have been is over.
  private movePage(val: number): void {
    this.setPageIndexCore(val);
  }
  public get pageCount(): number {
    const res = this.owner.getPropertyValue(pagingStateKeys.pageCount);
    return res > 0 ? res : 1;
  }
  /* False while the source answers a read without a total: pageCount is then the number of pages
     known to exist and the record count is a lower bound. The default is true - every source that
     is not a paging one hands over the whole storage. */
  public get isCountKnown(): boolean {
    return this.owner.getPropertyValue(pagingStateKeys.isCountKnown) !== false;
  }
  /* Through the owner and not through the mirror: the question answers 1 page and page 0 whenever
     it does not page at all, and that is what "can go" has to agree with. */
  // Not while a move waits for its validators: the pager is not usable until they settle.
  public get canGoNextPage(): boolean {
    return !this.isPageMovePending && this.owner.pageIndex < this.owner.pageCount - 1;
  }
  public get canGoPrevPage(): boolean {
    return !this.isPageMovePending && this.owner.pageIndex > 0;
  }
  /* The respondent's page moves. A move forward validates the page it leaves first and does not
     happen on an error; a move back does not validate, as the survey's own previous page does not.
     The return value is the survey's contract: false only for an error found synchronously, true
     for a move that happened or waits for asynchronous validators - the move itself is observed
     through pageIndex. */
  public goToPage(index: number): boolean {
    // Clamped against the pages known to exist, as the list clamps it: whether the move goes forward
    // is decided on the page it will reach.
    const target = this.getClampedPage(index);
    if (target === this.owner.pageIndex) return true;
    return this.leavePage(target > this.owner.pageIndex, (): void => { this.movePage(target); });
  }
  public nextPage(): boolean {
    if (!this.canGoNextPage) return false;
    const target = this.owner.pageIndex + 1;
    return this.leavePage(true, (): void => { this.movePage(target); });
  }
  public prevPage(): boolean {
    if (!this.canGoPrevPage) return false;
    const target = this.owner.pageIndex - 1;
    return this.leavePage(false, (): void => { this.movePage(target); });
  }
  private get listPageSize(): number {
    const size = this.owner.listPageSize;
    return size !== undefined ? size : this.owner.pageSize;
  }
  // True while a move waits for the asynchronous validators of the page: the pager is not usable.
  // The page validation keeps it in the owner's property hash.
  private get isPageMovePending(): boolean {
    return this.owner.getPropertyValue(pagingStateKeys.isPageMovePending) === true;
  }
  private cancelPendingPageMove(): void {
    if (typeof this.owner.cancelPendingPageMove === "function")this.owner.cancelPendingPageMove();
  }
  private leavePage(isForward: boolean, move: () => void): boolean {
    if (typeof this.owner.leavePage === "function") return this.owner.leavePage(isForward, move);
    move();
    return true;
  }
  private getClampedPage(index: number): number {
    return Math.max(0, Math.min(index, this.owner.pageCount - 1));
  }
  /* The list does not announce every change of the visible count: setRecordVisible and
     invalidateViews raise nothing unless the page index had to be clamped, yet both change
     pageCount. The owner calls this from every point that can change it. */
  public syncState(): void {
    this.updateListPageSize();
    const list = this.list;
    this.owner.setPropertyValue(pagingStateKeys.pageIndex, list.pageIndex);
    this.owner.setPropertyValue(pagingStateKeys.pageCount, list.pageCount);
    this.owner.setPropertyValue(pagingStateKeys.isCountKnown, list.isCountKnown);
    // A sync raised by the push itself: the page state is up to date, the view is being handed over
    // right now and mirroring it half way through would wipe the half that is still pending.
    if (this.viewPushScope.isActive) return;
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
    /* The serializer fills sortCriteria through the array's own push, and a question raises no change
       while it loads: an authored sort marks nothing pending on its way in, so a non-empty one is
       pending here. A sync before this point would mirror the list's empty sort over it. */
    if (this.currentSort.length > 0) {
      this.isViewPending = true;
    }
    if (!this.isViewPending || this.owner.isLoadingFromJson) return;
    this.syncState();
  }
  /* True while the hash holds a sort or a filter the list has not been given. Two writers with
     opposite directions share those hash entries - the setters (hash -> list, later) and
     syncState() (list -> hash) - and this flag is what keeps them apart. */
  private isViewPending: boolean = false;
  private viewPushScope = new Scope();
  private get canPushToList(): boolean {
    return !this.owner.isDesignMode && !this.owner.isLoadingFromJson;
  }
  private mirrorListView(): void {
    const list = this.list;
    this.owner.setPropertyValue(pagingStateKeys.filterExpression, list.filter);
    // The items that already say what the list sorts by stay: a caller may hold them.
    const sort = list.sort;
    if (!isSameSort(this.currentSort, sort)) {
      this.writeSortCriteria(sort);
    }
  }
  private pushAuthoredView(): void {
    if (this.viewPushScope.isActive) return;
    /* Cleared before the assignments and not after: a filter the list cannot run resets itself to
       "" and reports the error through onError, and a value that is still pending would be handed
       back to the list on every following sync. At runtime the hash then holds "" - the mirror
       takes what the list ended up with. In design mode the text is never parsed at all, so the
       Creator keeps a filter that does not run. */
    this.isViewPending = false;
    const list = this.list;
    const filter = this.filterExpression;
    const sort = this.currentSort;
    // One setView and not the two setters: with a paging source each of them is a read of its own,
    // and the authored view has to cost one request.
    if (list.filter !== filter || !isSameSort(list.sort, normalizeSort(sort))) {
      this.runViewPush((): void => { list.setView(filter, sort); });
    }
    this.mirrorListView();
  }
  /* A view authored in design mode is still pending when the owner comes back to runtime with no sync
     in between: setDesignMode() notifies nobody. A runtime assignment hands it over first, or the
     sync after the assignment would push the old authored value over the new one. The caller reads
     the list first: a list created by that read has received the view already. */
  private flushPendingView(): void {
    if (this.isViewPending)this.pushAuthoredView();
  }
  // In design mode the list holds no sort and no filter: what is authored stays in the hash.
  private clearListView(): void {
    const list = this.list;
    if (!list.filter && list.sort.length === 0) return;
    this.runViewPush((): void => { list.setView("", []); });
  }
  /* setView runs user code - onError for a filter it cannot run, the owner's rebuild on the reset -
     and a flag that a throw left set would make every later syncState skip the view: the hash would
     stop mirroring the list for good. */
  private runViewPush(func: () => void): void {
    this.viewPushScope.run(func);
  }
  /* The sort is a live array of SortCriterion items, the way choices is: an assignment, a push or a
     splice on it, and an edit of an item, all re-apply it. Every one of them goes through setSortCore,
     so design mode, the load, a pending view and the "same sort, no reset" check treat them alike.
     It is the CURRENT sort and not only the declared one - a header click through toggleSort()
     changes what toJSON() emits, which is what the Creator wants and what a running survey never
     asks for. */
  public get sortCriteria(): Array<SortCriterion> {
    return this.owner.getArrayPropertyValue(pagingStateKeys.sortCriteria, (item: any): void => { this.onSortCriterionAdded(item); });
  }
  public set sortCriteria(val: Array<ISortCriterion>) {
    this.setSortCore(toPlainSort(val), true);
  }
  // The sort the hash holds, as plain criteria. A peek: it never creates the array.
  private get currentSort(): Array<ISortCriterion> {
    return toPlainSort(this.owner.getPropertyValue(pagingStateKeys.sortCriteria));
  }
  /* True while the question writes sortCriteria itself - an assignment, or the mirror of what the
     list ended up with: the array and item hooks it raises are not changes to re-apply. A Scope and
     not a flag: a throw would leave a flag set and every later change would be dropped. */
  private sortWriteScope = new Scope();
  /* The question never holds the caller's objects: every write creates its own items. The array is
     read first, so that setArrayPropertyValue finds it created. */
  private writeSortCriteria(val: Array<ISortCriterion>): void {
    const items = val.map((item: ISortCriterion): SortCriterion => new SortCriterion(item.field, item.direction));
    this.sortWriteScope.run((): void => {
      this.sortCriteria;
      this.owner.setArrayPropertyValue(pagingStateKeys.sortCriteria, items);
    });
  }
  private onSortCriterionAdded(item: any): void {
    if (!!item && typeof item.setOwner === "function") {
      item.setOwner(this);
    }
    // The serializer pushes the authored items while the question loads, and the question raises no
    // change then: the push itself marks the view pending, so that no sync mirrors it away.
    if (!this.sortWriteScope.isActive && this.owner.isLoadingFromJson) {
      this.isViewPending = true;
    }
  }
  // A push, a splice, or any other change made on the array in place (the owner's property hook).
  public onSortCriteriaChanged(): void {
    if (this.sortWriteScope.isActive) return;
    this.applyChangedSort();
  }
  /* An item may outlive its place in the array - a caller can keep it after clearSort(), after an
     assignment or after the mirror rebuilt the items - and setArray never detaches it. Only an item of
     the current sort changes the sort: an edit of any other one would still drop a pending page move. */
  public onSortCriterionChanged(item: SortCriterion): void {
    if (this.sortWriteScope.isActive) return;
    const items = this.owner.getPropertyValue(pagingStateKeys.sortCriteria);
    if (!Array.isArray(items) || items.indexOf(item) < 0) return;
    this.applyChangedSort();
  }
  /* The hash IS the edited array, so the equality check of setSortCore would always pass while the
     question cannot push: the view is pending with no check. At runtime the list holds a copy, and
     setSortCore compares with it. */
  private applyChangedSort(): void {
    if (!this.canPushToList) {
      this.isViewPending = true;
      return;
    }
    this.setSortCore(this.currentSort, true);
  }
  // A sort from code drops a move that waits for its validators; the one toggleSort validated is
  // that move, and it has already been dropped by leavePage.
  private setSortCore(val: Array<ISortCriterion>, isFromCode: boolean): void {
    if (isFromCode && this.canPushToList) {
      this.cancelPendingPageMove();
    }
    if (!this.canPushToList) {
      // The hash only: the setter neither pushes nor creates the list while the question is loading
      // or in design mode. What was authored is kept as it is - an item with an empty field included,
      // which a Creator editor holds while the author types.
      if (isSameSort(this.currentSort, val)) return;
      this.writeSortCriteria(val);
      this.isViewPending = true;
      return;
    }
    const list = this.list;
    this.flushPendingView();
    // The sort setter raises a reset even when the value did not change, and every reset costs a
    // full rebuild of the rows/panels. The list normalizes what it is given: a sort it already has
    // after that is no change, but the items still take the normalized form.
    if (isSameSort(list.sort, normalizeSort(val))) {
      this.mirrorListView();
      return;
    }
    list.sort = val;
    this.syncState();
  }
  /* sort("price"): the sort becomes this one field. sort("price", "desc", true): the field takes the
     direction where it already is in the sort, or joins it at the end. sort([...]): the same as an
     assignment of sortCriteria. Any direction but "desc" is ascending. */
  public sort(fieldOrCriteria: string | Array<ISortCriterion>, direction?: SortDirection, append?: boolean): void {
    if (Array.isArray(fieldOrCriteria)) {
      this.sortCriteria = fieldOrCriteria;
      return;
    }
    const field = fieldOrCriteria;
    if (!field || typeof field !== "string") return;
    const criterion: ISortCriterion = { field: field, direction: direction === "desc" ? "desc" : "asc" };
    if (!append) {
      this.setSortCore([criterion], true);
      return;
    }
    const sort = this.currentSort;
    const isInSort = sort.some((s: ISortCriterion): boolean => s.field === field);
    this.setSortCore(isInSort ? sort.map((s: ISortCriterion): ISortCriterion => s.field === field ? criterion : s) :
      sort.concat([criterion]), true);
  }
  /* One field, the way a header click sorts: ascending, then descending, then not sorted. Sorting
     by a field in a given direction is sort() and does not need a third spelling; what is unique here
     is the cycle, which every renderer needs in one place. append runs the same cycle over one entry
     of the sort instead of over the whole of it - what a modified header click does in a grid - and
     leaves the other fields where they are. */
  /* A header click is a move the respondent makes: it replaces the page, so the page it replaces is
     validated first (layer 1). Returns false only for an error found synchronously. Every list can
     sort: a paging source that cannot sort is read whole while a sort is set (DynamicDataList). */
  public toggleSort(field: string, append?: boolean): boolean {
    if (!field) return false;
    const newSort = this.getToggledSort(field, append);
    if (!this.canPushToList) {
      this.setSortCore(newSort, true);
      return true;
    }
    return this.leavePage(true, (): void => { this.setSortCore(newSort, false); });
  }
  private getToggledSort(field: string, append: boolean): Array<ISortCriterion> {
    const sort = this.currentSort;
    const current = sort.filter((s: ISortCriterion): boolean => s.field === field)[0];
    let dir: SortDirection = undefined;
    if (!current) {
      dir = "asc";
    } else if (current.direction === "asc") {
      dir = "desc";
    }
    if (!append) {
      return !dir ? [] : [{ field: field, direction: dir }];
    }
    // Every branch below builds a NEW array: the setter compares the incoming value with the sort
    // the list already has, so an array changed in place would be a silent no-op.
    if (!dir) {
      // Cycled off: it leaves the sort and the fields around it keep their order.
      return sort.filter((s: ISortCriterion): boolean => s.field !== field);
    }
    if (!current) {
      // A field joins at the end: the last one clicked is the last tie-breaker. At the level limit
      // it replaces the last level, so with a limit of 1 an append is a plain click.
      const limit = this.owner.maxSortLevel > 0 ? this.owner.maxSortLevel : 0;
      const kept = limit > 0 && sort.length >= limit ? sort.slice(0, limit - 1) : sort;
      return kept.concat([{ field: field, direction: dir }]);
    }
    return sort.map((s: ISortCriterion): ISortCriterion =>
      s.field === field ? { field: field, direction: dir } : s);
  }
  public clearSort(): void {
    this.setSortCore([], true);
  }
  public get filterExpression(): string {
    return this.owner.getPropertyValue(pagingStateKeys.filterExpression) || "";
  }
  public set filterExpression(val: string) {
    const newValue = !!val ? val : "";
    if (!this.canPushToList) {
      if (this.filterExpression === newValue) return;
      this.owner.setPropertyValue(pagingStateKeys.filterExpression, newValue);
      this.isViewPending = true;
      return;
    }
    const list = this.list;
    this.flushPendingView();
    if (list.filter === newValue) return;
    this.cancelPendingPageMove();
    list.filter = newValue;
    // A filter the list cannot run locally is reported through its onError and reset to "": the
    // mirror takes what the list ended up with, not what was assigned.
    this.syncState();
  }
  /* Re-decides which records are shown. The view of a source that pages travels in the read request
     and the source decides the membership of the window itself - the window IS the answer - so
     re-running a local filter the list never ran would say nothing; the window is read again
     instead. So is the whole storage that a paging source owes while the list has a filter or a sort
     it cannot run and its window is still a page. Everything else - a source without paging, and that whole
     storage once it is in force - takes the local path. */
  public refreshView(): void {
    const list = this.list;
    this.cancelPendingPageMove();
    if (list.readsSourceOnViewChange) {
      list.refresh();
    } else {
      list.refreshView();
    }
    this.syncState();
  }
}
