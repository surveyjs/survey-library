import { ConditionRunner } from "../conditions/conditionRunner";
import { createFilterRunner } from "./dynamic-data-filter";
import { IDynamicDataSort } from "./dynamic-data-interfaces";

// What decides which side runs the filter: the window in force and the source (DynamicDataReadState).
export interface IDynamicDataViewReadState {
  readonly mayFilterLocally: boolean;
  readonly isWholeStorageInForce: boolean;
  readonly readsSourceOnViewChange: boolean;
}

/* The view of DynamicDataList: the filter, the sort, and the runner of the filter while the list may
   be the one filtering. The list owns it and assigns the filter and the sort (setView);
   DynamicDataReadState reads them through IDynamicDataReadStateView. */
export class DynamicDataView {
  private _filter: string = "";
  private _sort: Array<IDynamicDataSort> = [];
  private _filterRunner: ConditionRunner = undefined;

  // onFilterError: a filter the list cannot run and no read carries to the source.
  constructor(private onFilterError: (error: any) => void) { }

  public get filter(): string {
    return this._filter;
  }
  // The array the view holds, not a copy: whoever hands it out of the list copies it.
  public get sort(): Array<IDynamicDataSort> {
    return this._sort;
  }
  public get filterRunner(): ConditionRunner {
    return this._filterRunner;
  }
  public get hasView(): boolean {
    return !!this._filter || this._sort.length > 0;
  }
  /* Takes the filter and a copy of the sort. Returns whether the filter changed: the caller decides
     what that resets, and builds the runner for it (updateFilterRunner) once it has. */
  public setView(filter: string, sort: Array<IDynamicDataSort>): boolean {
    const isFilterChanged = this._filter !== filter;
    this._filter = filter;
    this._sort = Array.isArray(sort) ? sort.slice() : [];
    return isFilterChanged;
  }
  // The list is disposed: the runner goes, the filter and the sort stay readable.
  public clear(): void {
    this._filterRunner = undefined;
  }
  /* The runner exists while the list may be the one filtering. A source that does not page, and a
     paging source that cannot filter, have it run here, over the whole storage they are read for:
     parsed as soon as the filter - or the source - is set, so that a filter which cannot be run
     locally is reported then and not on the first read of a view. A source that pages and filters
     gets the expression text inside its paged reads, and the list keeps no runner for it: a filter
     only that source can run (an async function) stays valid. When such a source cannot sort, a sort
     makes the list read it whole and run the filter itself, so the runner is built then - by the read
     that needs it (DynamicDataList.createReadRequest), or here while the whole storage is in force:
     the list runs the new view over it, also while a page read is pending or after one failed. A
     filter the list cannot run is dropped only when no read follows; a page read that follows carries
     it to the source. */
  public updateFilterRunner(readState: IDynamicDataViewReadState): void {
    this._filterRunner = undefined;
    if (!this._filter) return;
    if (!readState.mayFilterLocally && !readState.isWholeStorageInForce) return;
    try {
      this._filterRunner = createFilterRunner(this._filter);
    } catch(e) {
      if (!readState.mayFilterLocally && readState.readsSourceOnViewChange) return;
      // The list stays unfiltered: showing every record beats showing none. The operation is "read":
      // it is the read of the view that the filter made impossible.
      this._filter = "";
      this.onFilterError(e);
    }
  }
  /* A source that pages and filters but cannot sort is read whole for a sort, and the list runs the
     filter over that answer: the filter it never had to parse is parsed now (see
     updateFilterRunner). One the list cannot run refuses the read - the filter is the source's to run
     and stays, the window in force stays, and clearing the sort reads the filtered page again. The
     throw takes the read down the path of a source that throws (DynamicDataList.onReadFailed). */
  public ensureWholeStorageFilterRunner(readState: IDynamicDataViewReadState): void {
    if (!this._filter || !!this._filterRunner || readState.mayFilterLocally) return;
    try {
      this._filterRunner = createFilterRunner(this._filter);
    } catch(e) {
      throw new Error("DynamicDataList: the source pages but does not declare the \"sorting\" capability, " +
        "so the sorted records are read whole and filtered here, and the filter cannot be run here (" +
        String(e && e.message) + "). The window in force is kept.");
    }
  }
}
