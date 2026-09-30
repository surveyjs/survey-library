import { Question } from "../question";
import { DynamicDataOperation, IDynamicDataOwner } from "./dynamic-data-interfaces";
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
  onDataSourceError(error: any, operation: DynamicDataOperation): void;
}
export type DynamicDataQuestionOwner = Question & IDynamicDataPagingOwner & IDynamicDataQuestionHooks &
  IDynamicDataOwner & IDynamicDataPageValidationOwner;

/* The coordination between a dynamic question and its list. Both dynamic questions need the same
   one and neither of them descends from the other, so it lives here and each question holds it by
   composition. The list computes (dynamic-data-list.ts), the question builds and renders its own
   rows or panels, and this class is what sits between the two: it creates and disposes the list and
   the question-side helpers.
   It is created with the question. The list and the helpers are created on first use, and the
   ...Value getters never create. */
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
        owner.onDataSourceError(error, operation);
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
}
