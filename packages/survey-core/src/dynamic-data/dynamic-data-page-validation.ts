import { ValidationContext } from "../question";
import { DynamicDataList } from "./dynamic-data-list";

/* How the records of an array assigned from outside map onto the records it replaced: a sibling on
   the same valueName inserted, removed or moved one, or changed one in place. The common prefix and
   suffix stay where they are (the suffix shifted by the count difference); inside the part that
   changed a single record changed in place keeps its index, removed records map to -1, and a record
   moved from one end of that part to the other follows it. Anything else maps to undefined: the
   caller treats every record of the changed part as its own (a superset is safe - it only costs a
   validation more). */
export function getReplacedRecordsRemap(oldRecords: Array<any>, newRecords: Array<any>): (index: number) => number {
  const oldLen = oldRecords.length;
  const newLen = newRecords.length;
  const isSame = (a: any, b: any): boolean => !DynamicDataList.isValueChanged(a, b);
  let prefix = 0;
  while(prefix < oldLen && prefix < newLen && isSame(oldRecords[prefix], newRecords[prefix])) prefix++;
  let suffix = 0;
  while(suffix < oldLen - prefix && suffix < newLen - prefix &&
    isSame(oldRecords[oldLen - 1 - suffix], newRecords[newLen - 1 - suffix])) suffix++;
  const oldMid = oldLen - prefix - suffix;
  const newMid = newLen - prefix - suffix;
  const delta = newLen - oldLen;
  const isRangeSame = (oldFrom: number, newFrom: number, length: number): boolean => {
    for (let i = 0; i < length; i++) {
      if (!isSame(oldRecords[oldFrom + i], newRecords[newFrom + i])) return false;
    }
    return true;
  };
  let movedToEnd = false;
  let movedToStart = false;
  if (oldMid === newMid && oldMid > 1) {
    const last = prefix + oldMid - 1;
    movedToEnd = isSame(oldRecords[prefix], newRecords[last]) && isRangeSame(prefix + 1, prefix, oldMid - 1);
    movedToStart = !movedToEnd && isSame(oldRecords[last], newRecords[prefix]) && isRangeSame(prefix, prefix + 1, oldMid - 1);
  }
  return (index: number): number => {
    if (index < prefix) return index;
    if (index >= oldLen - suffix) return index + delta;
    if (newMid === 0) return -1;
    if (oldMid === 1 && newMid === 1) return prefix;
    const last = prefix + oldMid - 1;
    if (movedToEnd) return index === prefix ? last : index - 1;
    if (movedToStart) return index === last ? prefix : index + 1;
    return undefined;
  };
}

/* What a paged question hands to the ancestor that rebuilds the object holding it, and gets back
   when that object is created again for the same outer record: the records edited and not validated
   yet, the page it was on, and - one level down - the same for the paged questions nested in its own
   records. It belongs to the records and not to the object, so it has to outlive the object. */
export interface IDynamicDataPageState {
  pageIndex: number;
  edited: Array<number>;
  nested: { [recordIndex: number]: { [valueName: string]: IDynamicDataPageState } };
}

export interface IDynamicDataPageValidationOwner {
  getDataList(): DynamicDataList;
  // Layer 1 is on: the question is in a running survey whose settings validate a page before a
  // forward move (see SurveyModel.canLeavePageWithErrors).
  isPageLeaveValidated(): boolean;
  // Layer 2 is on: an in-memory list that pages. A remote record index names another record after
  // every page change, and a record that left the window is not held.
  canTrackEditedRecords(): boolean;
  // The objects of the current page - every panel or row that exists, and the key duplicates they
  // take part in - validated with the context.
  validatePageObjects(context: ValidationContext): boolean;
  // A page move from code: no validation, the objects are rebuilt at once.
  goToPageFromCode(pageIndex: number): void;
  setPropertyValue(name: string, val: any): void;
  isDisposed: boolean;
}

/* The page-level validation of a question that pages (Andrew's decision 2026-09-25, prompt 15).
   Validating every record is not an option - there can be thousands, and a record has no object
   until its page is shown - so it is done in two layers:
   1. A forward move the respondent makes (the pager, "add", a sort header, carousel/tab Next)
      validates the page it leaves and does not happen on an error. It waits for the asynchronous
      validators of that page, as the survey's own next page does.
   2. A safety net for what does not validate - a sort, a filter or a pageIndex from code, a record
      that became visible ahead of the page: the records edited since their page was last validated
      are remembered, and every full validation of the question (Complete, the survey's next page, an
      ancestor leaving its page) visits the pages that hold them. The cost is bounded by the pages the
      respondent edited, never by the record count. */
export class DynamicDataPageValidation {
  // Record indexes, ascending. Kept in step with the list's own inserts, removes and moves.
  private edited: Array<number> = [];
  private nested: { [recordIndex: number]: { [valueName: string]: IDynamicDataPageState } } = {};
  private moveToken: number = 0;
  private isPendingValue: boolean = false;
  constructor(private owner: IDynamicDataPageValidationOwner) { }

  public get isMovePending(): boolean {
    return this.isPendingValue;
  }
  private setIsPending(val: boolean): void {
    this.isPendingValue = val;
    this.owner.setPropertyValue("isPageMovePending", val);
  }
  /* A page or a current index set from code, another move, a sort or a filter, records replaced
     from outside, dispose: the move that is waiting for its validators is dropped. A late result
     still lands on the questions it validated - they are on the page that was left, or disposed -
     and nowhere else. */
  public cancelPendingMove(): void {
    if (!this.isPendingValue) return;
    this.moveToken++;
    this.setIsPending(false);
  }
  /* Returns false only when an error was found synchronously; true means moved or pending - the
     survey's own contract (SurveyModel.nextPage returns validateCurrentPage(func) !== false). */
  /* validate: what is validated instead of the page's objects (carousel and tab mode validate the
     panel they leave inside a page). A page move shows errors and changes no value - see
     IValidationContextParams.clearIncorrectValues - except where the move has always validated the
     way panel.validate() does: carousel and tab Next pass clearIncorrectValues. */
  /* validatedRecords: the records validate() covers when it is not the whole page - the one panel a
     tab Next validates - so that only they leave the edited set. */
  public leave(isForward: boolean, move: () => void, validate?: (context: ValidationContext) => boolean,
    clearIncorrectValues: boolean = false, validatedRecords?: Array<number>): boolean {
    this.cancelPendingMove();
    if (!isForward || !this.owner.isPageLeaveValidated()) {
      move();
      return true;
    }
    const token = ++this.moveToken;
    let isValidating = true;
    const context = new ValidationContext({
      fireCallback: true, focusOnFirstError: true, clearIncorrectValues: clearIncorrectValues,
      callbackResult: (res: boolean): void => {
        // The synchronous answer is read from the context below; only a late one is handled here.
        if (isValidating) return;
        this.onAsyncResult(token, res, move, validatedRecords);
      }
    });
    const isValid = !!validate ? validate(context) : this.owner.validatePageObjects(context);
    context.finish();
    isValidating = false;
    const res = context.runningResult;
    if (!isValid || res === false) return false;
    if (res === true) {
      this.markValidatedRecords(validatedRecords);
      move();
      return true;
    }
    this.setIsPending(true);
    return true;
  }
  private onAsyncResult(token: number, res: boolean, move: () => void, validatedRecords: Array<number>): void {
    if (token !== this.moveToken || this.owner.isDisposed) return;
    this.setIsPending(false);
    if (!res) return;
    this.markValidatedRecords(validatedRecords);
    move();
  }
  private markValidatedRecords(records: Array<number>): void {
    if (Array.isArray(records)) {
      this.markValidated(records);
    } else {
      this.markPageValidated();
    }
  }
  private markPageValidated(): void {
    this.markValidated(this.owner.getDataList().getMaterializedIndexes());
  }

  public get editedRecords(): Array<number> {
    return this.edited;
  }
  public markEdited(index: number): void {
    if (index < 0 || !this.owner.canTrackEditedRecords()) return;
    const at = this.findPosition(index);
    if (this.edited[at] !== index) {
      this.edited.splice(at, 0, index);
    }
  }
  public markValidated(indexes: Array<number>): void {
    if (this.edited.length === 0 || !Array.isArray(indexes) || indexes.length === 0) return;
    const drop: { [index: number]: boolean } = {};
    indexes.forEach((i: number): void => { drop[i] = true; });
    this.edited = this.edited.filter((i: number): boolean => !drop[i]);
  }
  public clearRecords(): void {
    this.edited = [];
    this.nested = {};
  }
  /* The records were assigned from outside the list - a sibling on the same valueName wrote them.
     The edited set and the nested states follow the records they name (getReplacedRecordsRemap); a
     change the remap cannot place marks every record of the changed part as edited. */
  public onRecordsReplaced(oldRecords: Array<any>, newRecords: Array<any>): void {
    if (this.edited.length === 0 && Object.keys(this.nested).length === 0) return;
    const remap = getReplacedRecordsRemap(Array.isArray(oldRecords) ? oldRecords : [], Array.isArray(newRecords) ? newRecords : []);
    const edited: Array<number> = [];
    let isUnplaced = false;
    const add = (index: number): void => { if (index > -1 && edited.indexOf(index) < 0) edited.push(index); };
    this.edited.forEach((i: number): void => {
      const to = remap(i);
      if (to === undefined) {
        isUnplaced = true;
      } else {
        add(to);
      }
    });
    if (isUnplaced) {
      // A new record no old one maps to is in the changed part: it may be the edited one.
      const placed: { [index: number]: boolean } = {};
      for (let i = 0; i < (oldRecords || []).length; i++) {
        const to = remap(i);
        if (to !== undefined && to > -1) placed[to] = true;
      }
      for (let i = 0; i < (newRecords || []).length; i++) {
        if (!placed[i]) add(i);
      }
    }
    this.edited = edited.sort((a: number, b: number): number => a - b);
    this.nested = this.remapNested((i: number): number => {
      const to = remap(i);
      return to === undefined ? -1 : to;
    });
  }
  // The same bookkeeping the frozen membership of the list does: a record index names a record only
  // as long as nothing is inserted or removed in front of it.
  public onRecordAdded(index: number): void {
    this.edited = this.edited.map((i: number): number => i >= index ? i + 1 : i);
    this.nested = this.remapNested((i: number): number => i >= index ? i + 1 : i);
  }
  public onRecordRemoved(index: number): void {
    const res: Array<number> = [];
    this.edited.forEach((i: number): void => {
      if (i !== index) res.push(i > index ? i - 1 : i);
    });
    this.edited = res;
    this.nested = this.remapNested((i: number): number => i === index ? -1 : (i > index ? i - 1 : i));
  }
  public onRecordMoved(from: number, to: number): void {
    const remap = (i: number): number => {
      if (i === from) return to;
      if (from < i && i <= to) return i - 1;
      if (to <= i && i < from) return i + 1;
      return i;
    };
    this.edited = this.edited.map(remap).sort((a: number, b: number): number => a - b);
    this.nested = this.remapNested(remap);
  }
  private remapNested(remap: (i: number) => number): { [recordIndex: number]: { [valueName: string]: IDynamicDataPageState } } {
    const res: { [recordIndex: number]: { [valueName: string]: IDynamicDataPageState } } = {};
    Object.keys(this.nested).forEach((key: string): void => {
      const to = remap(Number(key));
      if (to > -1) res[to] = this.nested[<any>key];
    });
    return res;
  }
  private findPosition(index: number): number {
    let res = 0;
    while(res < this.edited.length && this.edited[res] < index) res++;
    return res;
  }

  /* Layer 2. Called by a full validation of the question once its current page has passed. The
     edited records the view shows are visited page by page in view order; the first page with an
     error is where the question stays, as the survey stays on its own first page with an error. A
     record the filter excludes or the owner hides is exempt - it has no page, exactly as it has no
     object without paging - and stays in the set until it comes back. */
  /* extraPages: other pages the same validation has to visit (a key pair both of whose records are
     off the page). One walk for both, so that a page waiting for asynchronous validators is not
     left under a second walk. */
  public validateEditedRecords(context: ValidationContext, extraPages?: Array<number>): boolean {
    if (!this.owner.canTrackEditedRecords()) return true;
    const list = this.owner.getDataList();
    this.markValidated(list.getMaterializedIndexes());
    const pageSize = list.pageSize;
    if (pageSize <= 0) return true;
    const pages: Array<number> = Array.isArray(extraPages) ? extraPages.slice() : [];
    if (this.edited.length > 0) {
      const editedHash: { [index: number]: boolean } = {};
      this.edited.forEach((i: number): void => { editedHash[i] = true; });
      const visible = list.getVisibleIndexes();
      for (let i = 0; i < visible.length; i++) {
        if (!editedHash[visible[i]]) continue;
        const page = Math.floor(i / pageSize);
        if (pages.indexOf(page) < 0) pages.push(page);
      }
    }
    pages.sort((a: number, b: number): number => a - b);
    return this.validatePages(context, pages);
  }
  /* Visits the pages and validates their objects, each with a context of its own. The first page
     with an error is where the question stays: the error goes to the caller's context. A page whose
     asynchronous validators are still running holds the caller's context open (addElement) and the
     walk goes on from the next page when they settle clean - the survey completes only after every
     page was checked. When every page passed, the page the respondent was on comes back. */
  public validatePages(context: ValidationContext, pages: Array<number>): boolean {
    const startPage = this.owner.getDataList().pageIndex;
    return this.validatePagesFrom(context, pages.filter((page: number): boolean => page !== startPage), 0, startPage);
  }
  private static asyncPageId: number = 0;
  private validatePagesFrom(context: ValidationContext, pages: Array<number>, from: number, startPage: number): boolean {
    for (let i = from; i < pages.length; i++) {
      this.owner.goToPageFromCode(pages[i]);
      let isValidating = true;
      let onLateResult: (res: boolean) => void = undefined;
      const pageContext = new ValidationContext({
        fireCallback: context.fireCallback, focusOnFirstError: context.focusOnFirstError,
        clearIncorrectValues: context.clearIncorrectValues,
        callbackResult: (res: boolean): void => {
          if (!isValidating && !!onLateResult) onLateResult(res);
        }
      });
      const isValid = this.owner.validatePageObjects(pageContext);
      pageContext.finish();
      isValidating = false;
      const res = pageContext.runningResult;
      if (!isValid || res === false) {
        context.setErrorElement(pageContext.firstErrorQuestion);
        return false;
      }
      if (res === undefined) {
        const id = "dynamic-data-page-" + (++DynamicDataPageValidation.asyncPageId);
        context.addElement(id);
        onLateResult = (pageRes: boolean): void => {
          onLateResult = undefined;
          if (!this.owner.isDisposed) {
            if (!pageRes) {
              context.setErrorElement(pageContext.firstErrorQuestion);
            } else {
              this.markPageValidated();
              this.validatePagesFrom(context, pages, i + 1, startPage);
            }
          }
          context.removeElement(id);
        };
        return true;
      }
      this.markPageValidated();
    }
    if (this.owner.getDataList().pageIndex !== startPage) {
      this.owner.goToPageFromCode(startPage);
    }
    return true;
  }

  public getState(pageIndex: number): IDynamicDataPageState {
    return { pageIndex: pageIndex, edited: this.edited.slice(), nested: this.nested };
  }
  public setState(state: IDynamicDataPageState): void {
    if (!state) return;
    this.edited = Array.isArray(state.edited) ? state.edited.slice() : [];
    this.nested = state.nested || {};
  }
  // The ancestor side: the states of the paged questions nested in one of its records.
  public keepNestedStates(recordIndex: number, states: { [valueName: string]: IDynamicDataPageState }): void {
    if (recordIndex < 0) return;
    if (!states || Object.keys(states).length === 0) {
      delete this.nested[recordIndex];
    } else {
      this.nested[recordIndex] = states;
    }
  }
  public getNestedStates(recordIndex: number): { [valueName: string]: IDynamicDataPageState } {
    return this.nested[recordIndex];
  }
}
