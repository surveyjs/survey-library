import { ConditionRunner } from "../conditions/conditionRunner";
import { combineFilterExpressions, createFilterRunner } from "./dynamic-data-filter";
import { ISortCriterion } from "./dynamic-data-interfaces";

/* The sort the list holds, hands to a source and reports back: plain { field, direction } objects and
   never the objects the caller passed in. A criterion without a field
   names nothing and is dropped, a field that is already in the sort keeps the priority of its first
   occurrence - it is the primary key either way -, and any direction but "desc" is ascending. */
export function normalizeSort(sort: Array<ISortCriterion>): Array<ISortCriterion> {
  const res: Array<ISortCriterion> = [];
  if (!Array.isArray(sort)) return res;
  sort.forEach((item: ISortCriterion): void => {
    const field = !!item && typeof item.field === "string" ? item.field : "";
    if (!field || res.some((s: ISortCriterion): boolean => s.field === field)) return;
    res.push({ field: field, direction: item.direction === "desc" ? "desc" : "asc" });
  });
  return res;
}

// What decides which side runs the filter: the window in force and the source (DynamicDataReadState).
export interface IDynamicDataViewReadState {
  readonly mayFilterLocally: boolean;
  readonly isWholeStorageInForce: boolean;
  readonly readsSourceOnViewChange: boolean;
}

/* The view of DynamicDataList: the filter, the sort, and the runner of the filter while the list may
   be the one filtering. The list owns it and assigns the filter and the sort (setView);
   DynamicDataReadState reads them through IDynamicDataReadStateView.
   The filter has two slots: the authored one and the one a Filter Control sets (controlFilter). Two
   and not one: the authored expression is what the question serializes and mirrors, and a control
   must be able to filter without touching it - or erasing it when its own cannot be run. Each slot
   has its own runner and is dropped on its own; a read carries the two combined (sourceFilter). */
export class DynamicDataView {
  private _filter: string = "";
  private _controlFilter: string = "";
  private _sort: Array<ISortCriterion> = [];
  private _filterRunner: ConditionRunner = undefined;
  private _controlFilterRunner: ConditionRunner = undefined;

  // onFilterError: a filter the list cannot run and no read carries to the source.
  constructor(private onFilterError: (error: any) => void) { }

  public get filter(): string {
    return this._filter;
  }
  public get controlFilter(): string {
    return this._controlFilter;
  }
  // Either slot filters: whatever asks "is there a filter" asks this.
  public get hasFilter(): boolean {
    return !!this._filter || !!this._controlFilter;
  }
  // What a read request carries, and what the count of a filtered window is kept for: the two slots
  // combined, each one bracketed.
  public get sourceFilter(): string {
    return combineFilterExpressions(this._filter, this._controlFilter);
  }
  // The array the view holds, not a copy: whoever hands it out of the list copies it.
  public get sort(): Array<ISortCriterion> {
    return this._sort;
  }
  public get filterRunner(): ConditionRunner {
    return this._filterRunner;
  }
  public get controlFilterRunner(): ConditionRunner {
    return this._controlFilterRunner;
  }
  // The runners the list runs over the records it holds, the authored one first.
  public get filterRunners(): Array<ConditionRunner> {
    return [this._filterRunner, this._controlFilterRunner].filter((runner: ConditionRunner): boolean => !!runner);
  }
  public get hasView(): boolean {
    return this.hasFilter || this._sort.length > 0;
  }
  /* Takes the filter, the control filter and a normalized copy of the sort (normalizeSort); a
     control filter left out keeps the one the view holds. Returns whether either filter changed: the
     caller decides what that resets, and builds the runners for it (updateFilterRunner) once it has. */
  public setView(filter: string, sort: Array<ISortCriterion>, controlFilter: string = this._controlFilter): boolean {
    const isFilterChanged = this._filter !== filter || this._controlFilter !== controlFilter;
    this._filter = filter;
    this._controlFilter = controlFilter;
    this._sort = normalizeSort(sort);
    return isFilterChanged;
  }
  // The list is disposed: the runners go, the filters and the sort stay readable.
  public clear(): void {
    this._filterRunner = undefined;
    this._controlFilterRunner = undefined;
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
     it to the source. Both slots go by these rules, each on its own. */
  public updateFilterRunner(readState: IDynamicDataViewReadState): void {
    this._filterRunner = this.createRunner(this._filter, readState, (): void => { this._filter = ""; });
    this._controlFilterRunner = this.createRunner(this._controlFilter, readState, (): void => { this._controlFilter = ""; });
  }
  private createRunner(expression: string, readState: IDynamicDataViewReadState, dropSlot: () => void): ConditionRunner {
    if (!expression) return undefined;
    if (!readState.mayFilterLocally && !readState.isWholeStorageInForce) return undefined;
    try {
      return createFilterRunner(expression);
    } catch(e) {
      if (!readState.mayFilterLocally && readState.readsSourceOnViewChange) return undefined;
      // The slot stays unfiltered: showing every record beats showing none. The operation is "read":
      // it is the read of the view that the filter made impossible.
      dropSlot();
      this.onFilterError(e);
      return undefined;
    }
  }
  /* A source that pages and filters but cannot sort is read whole for a sort, and the list runs the
     filter over that answer: the filter it never had to parse is parsed now (see
     updateFilterRunner). One the list cannot run refuses the read - the filter is the source's to run
     and stays, the window in force stays, and clearing the sort reads the filtered page again. The
     throw takes the read down the path of a source that throws (DynamicDataList.onReadFailed). */
  public ensureWholeStorageFilterRunner(readState: IDynamicDataViewReadState): void {
    if (readState.mayFilterLocally) return;
    this._filterRunner = this.ensureRunner(this._filter, this._filterRunner);
    this._controlFilterRunner = this.ensureRunner(this._controlFilter, this._controlFilterRunner);
  }
  private ensureRunner(expression: string, runner: ConditionRunner): ConditionRunner {
    if (!expression || !!runner) return runner;
    try {
      return createFilterRunner(expression);
    } catch(e) {
      throw new Error("DynamicDataList: the source pages but does not declare the \"sorting\" capability, " +
        "so the sorted records are read whole and filtered here, and the filter cannot be run here (" +
        String(e && e.message) + "). The window in force is kept.");
    }
  }
}
