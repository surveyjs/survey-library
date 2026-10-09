import { IDynamicDataSort, IDynamicDataSource, IDynamicDataSourceCapabilities } from "./dynamic-data-interfaces";

/* What the window of DynamicDataList in force is and how it was read: its offset, whether a read has
   committed one, whether the source paged it and with which view, the page it was read for, the
   capabilities of the source, and the marks of the read that is requested. That decides what the next
   read asks for. It decides; the list acts - it owns the records, the filter, the sort and the page
   index, it requests and commits the reads and raises every notification, and it hands in the filter,
   the sort and the page wherever a decision depends on them. */
export class DynamicDataReadState {
  private _windowOffset: number = 0;
  private _isLoaded: boolean = false;
  private isWindowPagedBySource: boolean = false;
  /* The page index a read asked for is set when the read is requested (pageIndex, setView), and the
     page the window in force was read for is committed with it (commitPageIndex). A read that fails
     leaves that window in force, so the page index goes back to the committed page: the page
     reported, the window and its offset agree, and the next forward move asks for the page that failed
     again. A whole storage in force is paged by the list, so nothing was read for its page. */
  private committedPageIndex: number = undefined;
  /* The read refillWindowAfterRemove asks for. Any other read asked for before it commits - merged
     into it while it waits for the writes, or superseding it in flight - takes the mark away: the read
     that commits then is an ordinary one. */
  private isRefillRead: boolean = false;
  // Set by the first load() or refresh(), and never cleared: see the list's source setter.
  private _isLoadRequested: boolean = false;
  /* The read capabilities of the source, taken when it is assigned (takeCapabilities) and never read
     from the source again: a source that changes them is assigned again. Filtering and sorting mean
     something only together with paging: a source without paging is read whole and filtered and
     sorted by the list. A paging source is read the same way while the list has a filter or a sort it
     cannot run; one page is never filtered or sorted locally. The decisions below follow the window
     in force (isPagedBySource). */
  private capabilities: IDynamicDataSourceCapabilities = { paging: false, filtering: false, sorting: false };

  public takeCapabilities(source: IDynamicDataSource): void {
    const caps = !!source ? source.capabilities : undefined;
    this.capabilities = {
      paging: !!caps && !!caps.paging,
      filtering: !!caps && !!caps.filtering,
      sorting: !!caps && !!caps.sorting
    };
  }
  public get windowOffset(): number {
    return this._windowOffset;
  }
  // A read of the source in use has committed a window.
  public get isLoaded(): boolean {
    return this._isLoaded;
  }
  public get isLoadRequested(): boolean {
    return this._isLoadRequested;
  }
  /* The loaded window is one page of the source. It describes the window in force, so it is the mode
     that window was read in: a paging source is read whole while the list has a filter or a sort the
     source has not declared (isReadPagedBySource), and the window it answered with stays the whole
     storage until the next read commits - a read that is pending or failed changes nothing about it.
     Before the first commit there is no window to describe, and the mode is the one the next read asks
     for. */
  public isPagedBySource(filter: string, sort: Array<IDynamicDataSort>): boolean {
    return this._isLoaded ? this.isWindowPagedBySource : this.isReadPagedBySource(filter, sort);
  }
  /* The next read asks the source for a page: the source pages, and it runs every part of the view
     the list has - it filters or there is no filter, it sorts or there is no sort. Otherwise the
     source is read whole and the list filters, sorts and pages the answer. It decides what a read
     requests; isPagedBySource decides how the window that is in force is read. */
  public isReadPagedBySource(filter: string, sort: Array<IDynamicDataSort>): boolean {
    const caps = this.capabilities;
    return caps.paging && (caps.filtering || !filter) && (caps.sorting || sort.length === 0);
  }
  /* A change of the view or of the page is answered by a read of the source: the source pages it, or
     a paging source owes the whole storage that a view part it cannot run is run over - the window in
     force is still a page, because the read of the whole storage is pending or failed, or nothing
     was committed yet. Once the whole storage is in force, the list answers those changes itself. */
  public readsSourceOnViewChange(filter: string, sort: Array<IDynamicDataSort>): boolean {
    if (this.isReadPagedBySource(filter, sort)) return true;
    if (!this.capabilities.paging || !this._isLoadRequested) return false;
    return !this._isLoaded || this.isWindowPagedBySource;
  }
  // The list runs the filter over the records it holds, sorts them, and a write to the window is a
  // write to the whole storage: the window holds every record of the source.
  public isWindowWholeStorage(filter: string, sort: Array<IDynamicDataSort>): boolean {
    return !this.isPagedBySource(filter, sort);
  }
  // A paging source answered with the whole storage, because it cannot run the view the list has, and
  // that window is in force.
  public get isWholeStorageInForce(): boolean {
    return this._isLoaded && !this.isWindowPagedBySource && this.capabilities.paging;
  }
  // The list runs any filter it is given: every source except one that pages and filters itself.
  public get mayFilterLocally(): boolean {
    return !this.capabilities.paging || !this.capabilities.filtering;
  }

  /* The page of a pending retry (retryPageIndex), else the window in force (a refresh) or the page (a
     load); a source without paging - and a paging source while the list has a filter or a sort it
     cannot run - is read whole: skip 0, take 0, whatever the page size is.
     The window offset is the destination of a read only while no navigation is pending; otherwise the
     destination is the requested page. A page move or a new filter sets the page index before its read
     commits (pageIndex, setView), so a refresh or the refill after a remove that starts meanwhile -
     in flight, queued behind writes, or issued again after a write overtook it - reads the page the
     newest navigation asked for, and that page commits with its index. */
  public getReadRange(useWindowOffset: boolean, pageIndex: number, pageSize: number, retryPageIndex: number,
    filter: string, sort: Array<IDynamicDataSort>): { skip: number, take: number } {
    if (!this.isReadPagedBySource(filter, sort)) return { skip: 0, take: 0 };
    let skip: number;
    if (retryPageIndex !== undefined) {
      skip = retryPageIndex * pageSize;
    } else {
      const isNavigationPending = pageIndex !== this.committedPageIndex;
      skip = useWindowOffset && this._isLoaded && !isNavigationPending ? this._windowOffset : pageIndex * pageSize;
    }
    return { skip: skip, take: pageSize };
  }
  public onReadRequested(isRefill: boolean): void {
    this._isLoadRequested = true;
    this.isRefillRead = isRefill;
  }
  public onReadFailed(): void {
    this.isRefillRead = false;
  }
  /* Is the read that commits the refill of the window in force? A refill that stepped back to another
     page (a page past the end), or that read the page of a pending navigation (getReadRange), is an
     ordinary read: it did not read the window in force. The mark is taken either way. */
  public takeRefill(isPagedRead: boolean, skip: number): boolean {
    const res = this.isRefillRead && isPagedRead && skip === this._windowOffset;
    this.isRefillRead = false;
    return res;
  }
  // The window a read answered with is in force: a page the source read at skip, or the whole storage.
  public commitWindow(isPagedRead: boolean, skip: number): void {
    this._windowOffset = isPagedRead ? skip : 0;
    this.isWindowPagedBySource = isPagedRead;
    this._isLoaded = true;
  }
  // The page index the committed window was read for, once the list has clamped it.
  public commitPageIndex(pageIndex: number): void {
    this.committedPageIndex = pageIndex;
  }
  // The page the window in force was read for; pageIndex while no window was committed.
  public getCommittedPageIndex(pageIndex: number): number {
    return this.committedPageIndex !== undefined ? this.committedPageIndex : pageIndex;
  }
  // The page index a failed read goes back to, undefined when it stays (see committedPageIndex).
  public getPageIndexToRestore(pageIndex: number): number {
    if (!this._isLoaded || !this.isWindowPagedBySource || this.committedPageIndex === undefined) return undefined;
    return pageIndex !== this.committedPageIndex ? this.committedPageIndex : undefined;
  }
  /* The source was replaced: no window is in force. The rest describes the window the next read
     commits, which sets it again. */
  public reset(): void {
    this._windowOffset = 0;
    this._isLoaded = false;
  }
}
