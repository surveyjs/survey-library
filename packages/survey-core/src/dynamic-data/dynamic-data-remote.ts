import { IDynamicDataSource } from "./dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data-list";
import { isFocusInsideOrIdle } from "../utils/focus-utils";

/* The question side of a caller-provided data source. Both dynamic questions expose the same
   members and neither of them descends from the other, so the survey-data side of a source swap,
   the running state and the focus kept across a refill live here, and the questions keep the thin
   accessors - the same division of labour DynamicDataPagingController follows. The source itself,
   its capabilities and the loaded window belong to the list.

   What a source does NOT change is where the records are kept while they are being edited:
   question.value is the loaded window, so the nested questions, the {row.x} / {panel.x} contexts,
   validation and getFilteredData keep working on exactly the records the respondent can see. What
   it does change is who owns them - see canSetValueToSurvey on the two questions. */
export interface IDynamicDataRemoteOwner {
  getDataList(): DynamicDataList;
  /* Attaching a source: the answer the question already holds leaves the survey hash before the
     first read. It is one ordinary value change - attaching is a developer action, not a page load -
     and it is the only way to keep a stale local answer, which nobody can see any more, out of the
     submitted data (OPEN 21). */
  clearValueInSurveyData(): void;
  // Detaching: the window is dropped and the question reads the survey hash again.
  restoreValueFromSurveyData(): void;
}

export class DynamicDataRemoteController {
  constructor(private owner: IDynamicDataRemoteOwner) { }
  // The survey-data side of the swap. The list keeps the assigned source (assignedSource), so there
  // is no getter here.
  public set dataSource(val: IDynamicDataSource) {
    const list = this.owner.getDataList();
    const newValue = val || undefined;
    if (list.assignedSource === newValue) return;
    const wasRemote = list.isRemote;
    /* The list resets its window and starts the first read. The two flags the questions need are
       already on it: isViewFrozenOnEdit (the membership of a view may not be re-decided by an edit
       made through one of the objects it materialized) is set when the list is created and holds for
       a remote source unchanged, and isReadThrough stays on but covers the question's own storage
       only. An assigned source is read, not read through, whatever its class - an
       ArrayDynamicDataSource and a SurveyDataDynamicDataSource included: the question is not told
       when the developer's array changes, so that change is seen after getDataList().refresh() and
       not at once. The list reads through again after a detach. Because of the frozen membership,
       refreshView() on a source that pages has to be a refresh(): the server decides which records
       are in the window, so re-deciding the view means re-reading it (see
       DynamicDataPagingController.refreshView). */
    list.assignSource(newValue, (): void => {
      if (!!newValue && !wasRemote)this.owner.clearValueInSurveyData();
    });
    if (!newValue)this.owner.restoreValueFromSurveyData();
  }
  // Is the model still waiting for this source? A page that has not arrived, a page that is about to
  // be read again once the pending edits are acknowledged, and an edit that has not been
  // acknowledged are all asynchronous operations the survey has started.
  public get isRunning(): boolean {
    const list = this.owner.getDataList();
    return !!list && list.isRemote && (list.isLoading || list.hasPendingRead || list.hasPendingWrites);
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
    this.focusIndexAfterRead = !!list && list.isRemote && list.hasPendingRead && index > -1 ? index : undefined;
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
