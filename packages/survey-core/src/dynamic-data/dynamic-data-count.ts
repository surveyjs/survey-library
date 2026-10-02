import { IDynamicDataReadResult } from "./dynamic-data-interfaces";

/* The page a read that was not committed asks for next (see stepBackPastEnd): an empty page past the
   end. It is kept apart from the committed state - the page index, the total and what is known about
   it describe the window in force until the retry commits its own window, and a retry that fails
   leaves them as they were. total and discoveredTotalFilter are what the empty answer proved about
   the end; the commit of the retry takes them together with its window. */
interface IDynamicDataRetry {
  pageIndex: number;
  total: number;
  discoveredTotalFilter: string;
}

/* What DynamicDataList knows about the size of its storage: the total, whether it is known, whether
   there are records behind the window, how far the windows have reached, and the pending retry of a
   page past the end. It decides; the list acts - it owns the window, the page index and the reads,
   and it hands in the window offset and the record count wherever a decision depends on them. */
export class DynamicDataCount {
  private _total: number = undefined;
  /* Committed together with the window (see commitWindow). A source that cannot count its records
     cheaply answers without a total: the list then knows only what it has seen, and hasMore is what
     tells it that there is a page behind the one it holds. Both are true/false by default, which is
     what every source that is not a paging one answers: read() returns the whole storage. */
  private _isCountKnown: boolean = true;
  private _hasMore: boolean = false;
  /* The filter a total the list worked out ITSELF belongs to (see commitCount). Such a total
     outlives the read that found it - a walk back to the first page must not send the pager looking
     for the end all over again - but it describes one set of records, and another filter is another
     set. undefined = the total is the source's own answer, or there is none. */
  private discoveredTotalFilter: string = undefined;
  private maxSeenCount: number = 0;
  private retry: IDynamicDataRetry = undefined;

  /* The storage count. With an unknown total (isCountKnown false) it is the count of the records
     known to exist - the ones that have been seen, a lower bound - and never NaN or -1: a source
     that cannot count its records still has at least the ones it has handed over. */
  public getCount(windowOffset: number, recordCount: number): number {
    return this._total !== undefined ? this._total : windowOffset + recordCount;
  }
  public get isCountKnown(): boolean {
    return this._isCountKnown;
  }
  public get hasMore(): boolean {
    return this._hasMore;
  }
  /* The most records the list knows to exist: the total when there is one, otherwise the furthest
     any window has reached. The count is the lower bound of the window in force, so a walk back to
     the first page of a source without a total would make it forget the pages it has already seen;
     this does not. */
  public getKnownCount(windowOffset: number, recordCount: number): number {
    if (this._total !== undefined) return this._total;
    return Math.max(windowOffset + recordCount, this.maxSeenCount);
  }
  // The page the pending retry reads, undefined when there is none.
  public get retryPageIndex(): number {
    return !!this.retry ? this.retry.pageIndex : undefined;
  }
  // Drops the pending retry and nothing else: the committed state is the window in force.
  public cancelRetry(): void {
    this.retry = undefined;
  }

  /* A page past the end? Returns true when the answer must not be committed; the retry it records
     says which page to read instead, and nothing committed changes until that window commits.
     pageIndex is the committed one - a pending retry's page takes its place: that is a retry of a
     retry.
     With an unknown total nothing stops a pageIndex the source has no records for, and an empty
     answer at an offset is what says so: the page does not exist. It is not announced - the owner
     would see a table that is empty for a moment - the list steps one page back and reads that one,
     and again if it is empty too (bounded by pageIndex). The empty answer is not thrown away:
     nothing exists at skip or behind it, so the storage holds at most that many records. The window
     the step back commits then confirms that bound or lowers it, and the pager stops offering the
     page that answered empty.
     Both steps go to the retry and not to the committed state: the
     window in force, its page index and its total stay together until the retry commits, and a
     retry that fails leaves them as they were. */
  public stepBackPastEnd(result: IDynamicDataReadResult, skip: number, take: number, length: number,
    pageIndex: number, pageSize: number, filter: string): boolean {
    const fromPageIndex = !!this.retry ? this.retry.pageIndex : pageIndex;
    if (length === 0 && skip > 0 && take > 0 && typeof result.total !== "number" && fromPageIndex > 0) {
      this.retry = { pageIndex: fromPageIndex - 1, total: skip, discoveredTotalFilter: filter };
      return true;
    }
    /* A page past a total the source reported: the storage shrank under the page the respondent is
       on. The empty window is not committed either - the page would be empty and nothing would
       read it again. The total says where the end is, so the retry goes straight to the last page
       of it. It terminates: the retry reads in front of the total, and a source that shrank again
       answers with a smaller one. */
    if (length === 0 && skip > 0 && pageSize > 0 && typeof result.total === "number" && skip >= result.total) {
      this.retry = {
        pageIndex: Math.max(0, Math.ceil(result.total / pageSize) - 1), total: result.total, discoveredTotalFilter: undefined
      };
      return true;
    }
    return false;
  }
  /* A window of a paging source commits. The pending retry commits first: the page it was read for
     and what the empty answer proved about the end become the committed state, before commitCount -
     which keeps a discovered end the window confirms and lowers one it contradicts. Returns the
     retry's page index, for the list to apply, or undefined when there was no retry. */
  public commitWindow(result: IDynamicDataReadResult, skip: number, take: number, length: number, filter: string): number {
    const retry = this.retry;
    this.retry = undefined;
    if (!!retry) {
      this._total = retry.total;
      this._isCountKnown = true;
      this.discoveredTotalFilter = retry.discoveredTotalFilter;
    }
    this.commitCount(result, skip, take, length, filter);
    this.maxSeenCount = Math.max(this.maxSeenCount, skip + length);
    return !!retry ? retry.pageIndex : undefined;
  }
  // read() answers with the whole storage, so its length IS the count.
  public commitWholeStorage(): void {
    this.retry = undefined;
    this._total = undefined;
    this._isCountKnown = true;
    this._hasMore = false;
  }
  // The source was replaced: nothing is known about the new one.
  public reset(): void {
    this.retry = undefined;
    this._total = undefined;
    this._isCountKnown = true;
    this._hasMore = false;
    this.discoveredTotalFilter = undefined;
    this.maxSeenCount = 0;
  }
  /* Another filter is another set of records: what the old one reached says nothing about it. Only
     the reach is forgotten here; a discovered total stays in force with the window it came with, and
     the next window commit drops it, because it was found under another filter (commitCount). */
  public forgetReach(): void {
    this.maxSeenCount = 0;
  }
  // The list inserted a record into its window; recordCount is the window length after the write.
  public onRecordInserted(windowOffset: number, recordCount: number): void {
    if (this._total !== undefined)this._total++;
    if (this.maxSeenCount > 0)this.maxSeenCount++;
    this.updateHasMoreFromTotal(windowOffset, recordCount);
  }
  // The list removed a record from its window; recordCount is the window length after the write.
  public onRecordRemoved(windowOffset: number, recordCount: number): void {
    if (this._total !== undefined)this._total--;
    if (this.maxSeenCount > 0)this.maxSeenCount--;
    this.updateHasMoreFromTotal(windowOffset, recordCount);
  }

  // The committed hasMore follows a total the list changed itself; with an unknown total the flag
  // stays as the source left it - a record the list removed cannot tell it what is behind the window.
  private updateHasMoreFromTotal(windowOffset: number, recordCount: number): void {
    if (this._total === undefined) return;
    this._hasMore = windowOffset + recordCount < this._total;
  }
  /* Does this answer reach the end of the storage? The source says so with hasMore; otherwise a
     window shorter than the take it asked for is the end, and so is any window answering a take of
     0 - that request was for everything from skip. */
  private isEndOfStorage(result: IDynamicDataReadResult, take: number, length: number): boolean {
    if (typeof result.hasMore === "boolean") return !result.hasMore;
    return take <= 0 || length < take;
  }
  private commitCount(result: IDynamicDataReadResult, skip: number, take: number, length: number, filter: string): void {
    if (typeof result.total === "number") {
      this._total = result.total;
      this._isCountKnown = true;
      this.discoveredTotalFilter = undefined;
      this._hasMore = skip + length < this._total;
      return;
    }
    /* An answer that reaches the end settles the count as well: there is nothing behind the last
       record, so the storage holds exactly the records up to it. A source that cannot count in
       advance is therefore counted once, by walking to its end. */
    if (this.isEndOfStorage(result, take, length)) {
      this._total = skip + length;
      this._isCountKnown = true;
      this.discoveredTotalFilter = filter;
      this._hasMore = false;
      return;
    }
    /* A total the list worked out itself is kept while the window fits inside it: this is a page in
       front of an end that has already been found, and forgetting it would offer a page behind the
       end again and cost two reads to discover the same end. A window that reaches past it is a
       storage that has grown, and the end has to be found again. So is an explicit hasMore: true at
       the known end - the source says there are records behind a window the total says is the last
       one. A full window without hasMore at that end is only inferred to have more, and keeps it. */
    const end = skip + length;
    const isInFront = result.hasMore === true ? end < this._total : end <= this._total;
    if (this._total !== undefined && this.discoveredTotalFilter === filter && isInFront) {
      this._isCountKnown = true;
      this._hasMore = skip + length < this._total;
      return;
    }
    this._total = undefined;
    this._isCountKnown = false;
    this.discoveredTotalFilter = undefined;
    // Not the end, so there is at least one record behind this window.
    this._hasMore = true;
  }
}
