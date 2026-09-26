import { DynamicDataOperation, IDynamicDataSource } from "./dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data-list";
import { isFocusInsideOrIdle } from "../utils/focus-utils";

/* The question side of a caller-provided data source. Both dynamic questions expose the same
   members and neither of them descends from the other, so the source swap, the capability checks
   and the window helper live here and the questions keep the thin accessors - the same division of
   labour DynamicDataPagingController follows.

   What a source does NOT change is where the records are kept while they are being edited:
   question.value is the loaded window, so the nested questions, the {row.x} / {panel.x} contexts,
   validation and getFilteredData keep working on exactly the records the respondent can see. What
   it does change is who owns them - see canSetValueToSurvey on the two questions. */
export interface IDynamicDataRemoteOwner {
  getDataList(): DynamicDataList;
  // The source the question falls back to when no data source is assigned: the array source over
  // its own value.
  createValueDataSource(): IDynamicDataSource;
  /* Attaching a source: the answer the question already holds leaves the survey hash before the
     first read. It is one ordinary value change - attaching is a developer action, not a page load -
     and it is the only way to keep a stale local answer, which nobody can see any more, out of the
     submitted data (OPEN 21). */
  clearValueInSurveyData(): void;
  // Detaching: the window is dropped and the question reads the survey hash again.
  restoreValueFromSurveyData(): void;
  onDataLoadingChanged(isLoading: boolean): void;
  onDataSourceError(error: any, operation: DynamicDataOperation): void;
}

export class DynamicDataRemoteController {
  constructor(private owner: IDynamicDataRemoteOwner) { }
  private sourceValue: IDynamicDataSource;
  public get dataSource(): IDynamicDataSource {
    return this.sourceValue;
  }
  public set dataSource(val: IDynamicDataSource) {
    const newValue = !!val ? val : undefined;
    if (this.sourceValue === newValue) return;
    const wasRemote = this.isRemote;
    // Before the list is touched: isRemote decides how the question answers the notifications the
    // source swap raises, and those arrive from inside the assignment below.
    this.sourceValue = newValue;
    const list = this.owner.getDataList();
    if (!!newValue) {
      if (!wasRemote) {
        this.owner.clearValueInSurveyData();
      }
      /* The list resets its window and starts the first read. The two flags the questions need are
         already on it: isViewFrozenOnEdit (the membership of a view may not be re-decided by an edit
         made through one of the objects it materialized) is set when the list is created and holds
         for a remote source unchanged, and isReadThrough turns itself off - it only applies to an
         ArrayDynamicDataSource over the question's own value. Because of the frozen membership,
         refreshView() on a source that pages has to be a refresh(): the server decides which records
         are in the window, so re-deciding the view means re-reading it (see
         DynamicDataPagingController.refreshView). */
      list.source = newValue;
    } else {
      list.source = this.owner.createValueDataSource();
      this.owner.restoreValueFromSurveyData();
    }
  }
  public get isRemote(): boolean {
    return !!this.sourceValue;
  }
  // A capability is declared by the presence of the matching method, the same rule the list follows.
  public hasCapability(operation: DynamicDataOperation): boolean {
    const source: any = this.sourceValue;
    return !!source && typeof source[operation] === "function";
  }
  // Is the model still waiting for this source? A page that has not arrived, a page that is about to
  // be read again once the pending edits are acknowledged, and an edit that has not been
  // acknowledged are all asynchronous operations the survey has started.
  public get isRunning(): boolean {
    if (!this.isRemote) return false;
    const list = this.owner.getDataList();
    return !!list && (list.isLoading || list.hasPendingRead || list.hasPendingWrites);
  }
  /* The loaded window as a new array. It is what question.value becomes after every write the list
     makes: a new instance, so that the ordinary "did the value change" comparisons of the library
     see the change, and the records themselves are the ones the list holds. */
  public getWindow(): Array<any> {
    const list = this.owner.getDataList();
    const res = new Array<any>();
    if (!list) return res;
    for (let i = 0; i < list.loadedCount; i++) {
      res.push(list.getRecord(i));
    }
    return res;
  }
  /* A remove on a page the source reads again (the refill of a source that pages itself) is answered
     by a rebuild of every item on the page, which disposes the one the question has just focused.
     The question keeps the position here while that read is pending and takes it back from the
     reset that commits the read, to focus the item that is at that position then. A second remove
     overwrites the position; a page change and a rejected read drop it (the question calls
     forgetFocusIndex: a rejected read leaves the short window and its focused item in place). */
  private focusIndexAfterRead: number = undefined;
  public keepFocusIndexForRead(index: number): void {
    const list = this.owner.getDataList();
    this.focusIndexAfterRead = this.isRemote && !!list && list.hasPendingRead && index > -1 ? index : undefined;
  }
  public forgetFocusIndex(): void {
    this.focusIndexAfterRead = undefined;
  }
  // Returns the kept position, or -1 when there is none, the read is not committed yet, or the focus
  // has moved out of the question by the time the answer arrives.
  public takeFocusIndexAfterRead(elementId: string, element?: HTMLElement): number {
    const index = this.focusIndexAfterRead;
    const list = this.owner.getDataList();
    if (index === undefined || !list || list.hasPendingRead) return -1;
    this.focusIndexAfterRead = undefined;
    return isFocusInsideOrIdle(elementId, element) ? index : -1;
  }
}
