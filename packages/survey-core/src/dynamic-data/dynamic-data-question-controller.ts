import { Question } from "../question";
import { isFocusInsideOrIdle } from "../utils/focus-utils";
import { DynamicDataOperation, IDynamicDataOwner, IDynamicDataSource } from "./dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data-list";
import { DynamicDataPageValidation, IDynamicDataPageValidationOwner } from "./dynamic-data-page-validation";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "./dynamic-data-paging";

/* What a dynamic question supplies to the coordination it shares with the other one. They are
   methods of the question and not a closure literal, so that the question's own code calls the same
   members. */
export interface IDynamicDataQuestionHooks {
  // The question's own storage, given to DynamicDataList.createReadThrough once.
  getListRecords(): Array<any>;
  setListRecords(records: Array<any>): void;
  // Absent -> the record count is the length of getListRecords().
  getListRecordCount?(): number;
}
export type DynamicDataQuestionOwner = Question & IDynamicDataPagingOwner & IDynamicDataQuestionHooks &
  IDynamicDataOwner & IDynamicDataPageValidationOwner;

/* The coordination between a dynamic question and its list. Both dynamic questions need the same
   one and neither of them descends from the other, so it lives here and each question holds it by
   composition. The list computes (dynamic-data-list.ts), the question builds and renders its own
   rows or panels, and this class is what sits between the two: it creates and disposes the list and
   the question-side helpers, and it holds the question side of a caller-provided data source - the
   survey-data side of a source swap, the running state and the focus kept across a refill. The
   source itself, its capabilities and the loaded window belong to the list.
   It is created with the question. The list and the helpers are created on first use, and the
   ...Value getters never create.

   What a source does NOT change is where the records are kept while they are being edited:
   question.value is the loaded window, so the nested questions, the {row.x} / {panel.x} contexts,
   validation and getFilteredData keep working on exactly the records the respondent can see. What
   it does change is who owns them - see canSetValueToSurvey on the two questions. */
export class DynamicDataQuestionController {
  private _list: DynamicDataList;
  private _paging: DynamicDataPagingController;
  private _pageValidation: DynamicDataPageValidation;
  constructor(private owner: DynamicDataQuestionOwner) { }
  public get listValue(): DynamicDataList {
    return this._list;
  }
  public get list(): DynamicDataList {
    if (!this._list) {
      const owner = this.owner;
      /* createReadThrough loads the list, which raises a reset before _list is assigned: the owner
         drops it, because the list it asks for does not exist yet. */
      this._list = DynamicDataList.createReadThrough(owner,
        (): Array<any> => owner.getListRecords(),
        (records: Array<any>): void => { owner.setListRecords(records); },
        typeof owner.getListRecordCount === "function" ? (): number => owner.getListRecordCount() : undefined);
      this._list.onError = (error: any, operation: DynamicDataOperation): void => {
        this.onSourceError(error, operation);
      };
      // The list is created on demand, so a page size that came from JSON has to be pushed here and
      // not only from its setter.
      this.paging.updatePageSize();
    }
    return this._list;
  }
  /* The paging helper gets an accessor and not the list: the list is created on demand, and the
     helper is first used while the list is being created. */
  public get paging(): DynamicDataPagingController {
    if (!this._paging) {
      this._paging = new DynamicDataPagingController(this.owner, (): DynamicDataList => this.list);
    }
    return this._paging;
  }
  public get pageValidationValue(): DynamicDataPageValidation {
    return this._pageValidation;
  }
  public get pageValidation(): DynamicDataPageValidation {
    if (!this._pageValidation) {
      this._pageValidation = new DynamicDataPageValidation(this.owner);
    }
    return this._pageValidation;
  }
  /* The list goes with the question: it drops its pending-request counter, so a page or a push that
     is still in flight cannot write into a question that is gone. */
  public dispose(): void {
    if (!!this._list) {
      this._list.dispose();
    }
  }

  // The survey-data side of the swap. The list keeps the assigned source (assignedSource), so there
  // is no getter here. The question follows the call with its own refresh, also for the same source.
  public assignSource(val: IDynamicDataSource): void {
    const newValue = val || undefined;
    // Another storage: the records layer 2 tracks and the states kept for them name records of the
    // old one. Dropped before the swap, whose first read may commit inside it.
    if (!!this._pageValidation && newValue !== (!!this._list ? this._list.assignedSource : undefined)) {
      this._pageValidation.cancelPendingMove();
      this._pageValidation.clearRecords();
    }
    const list = this.list;
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
      if (!!newValue && !wasRemote)this.clearValueInSurveyData();
    });
    if (!newValue)this.restoreValueFromSurveyData();
  }
  /* Attaching a source: the answer the question already holds leaves the survey hash before the
     first read. It is one ordinary value change - attaching is a developer action, not a page load -
     and it is the only way to keep a stale local answer, which nobody can see any more, out of the
     submitted data (OPEN 21). */
  private clearValueInSurveyData(): void {
    const owner = this.owner;
    if (!owner.data || owner.isValueEmpty(owner.data.getValue(owner.getValueName()))) return;
    owner.data.setValue(owner.getValueName(), undefined, false, true, owner.name);
  }
  // Detaching: the window is dropped and the question reads the survey hash again.
  private restoreValueFromSurveyData(): void {
    const owner = this.owner;
    owner.updateValueFromSurvey(!!owner.data ? owner.data.getValue(owner.getValueName()) : undefined);
  }
  // A rejected read leaves the short window and its focused item in place: the kept position goes.
  private onSourceError(error: any, operation: DynamicDataOperation): void {
    if (operation === "read")this.forgetFocusIndex();
    const owner = this.owner;
    if (!!owner.survey) {
      owner.survey.dynamicDataError(owner, operation, error);
    }
  }
  // Is the model still waiting for this source? A page that has not arrived, a page that is about to
  // be read again once the pending edits are acknowledged, and an edit that has not been
  // acknowledged are all asynchronous operations the survey has started.
  public get isRunning(): boolean {
    const list = this._list;
    return !!list && list.isRemote && (list.isLoading || list.hasPendingRead || list.hasPendingWrites);
  }
  /* A remove on a page the source reads again (the refill of a source that pages itself) is answered
     by a rebuild of every item on the page, which disposes the one the question has just focused.
     The position is kept here while that read is pending and taken back by the question from the
     reset that commits the read, to focus the item that is at that position then. A second remove
     overwrites the position; a page change and a rejected read drop it. */
  private focusIndexAfterRead: number = undefined;
  public keepFocusIndexForRead(index: number): void {
    const list = this._list;
    this.focusIndexAfterRead = !!list && list.isRemote && list.hasPendingRead && index > -1 ? index : undefined;
  }
  public forgetFocusIndex(): void {
    this.focusIndexAfterRead = undefined;
  }
  // Returns the kept position, or -1 when there is none, the read is not committed yet, or the focus
  // has moved out of the question by the time the answer arrives.
  public takeFocusIndexAfterRead(elementId: string, element?: HTMLElement): number {
    const index = this.focusIndexAfterRead;
    const list = this._list;
    if (index === undefined || !list || list.hasPendingRead) return -1;
    this.focusIndexAfterRead = undefined;
    return isFocusInsideOrIdle(elementId, element) ? index : -1;
  }
}
