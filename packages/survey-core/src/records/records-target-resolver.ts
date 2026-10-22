import { confirmActionAsync } from "../utils/confirm-dialog";
import { IRecordIndexFollower, RecordIndexEvent, isRecordListChange, toKnownRemap } from "./records-index-followers";
import type { ISurvey, ISurveyData } from "../base-interfaces";
import type { DynamicDataList } from "../dynamic-data/dynamic-data-list";
import type { DynamicDataSourceMethod } from "../dynamic-data/dynamic-data-interfaces";
import type { QuestionRecordItem } from "../question_records";

/* What a number, a panel or a row names: the record, its position in the whole view, its object when
   it has one, and the record object a target without one is found again by. A target a created
   position names (getRecordTargetAtCreatedIndex) has no visibleIndex: nothing it is used for asks. */
export interface IRecordTarget {
  recordIndex: number;
  visibleIndex?: number;
  item?: QuestionRecordItem;
  record?: any;
  isNotLoaded?: boolean;
}
/* A removal resolved before anything changes (resolveRecordRemoval): the object and its created
   position (-1 without one), the record that leaves the storage and the view index the removal
   reports. A type adds what its own steps decided before the splice. */
export interface IRecordRemoval {
  item: QuestionRecordItem;
  position: number;
  recordIndex: number;
  viewIndex: number;
}

// What the targets of a removal, a move and an insert read from the records question.
export interface IRecordTargetResolverOwner {
  getDataList(): DynamicDataList;
  getSurvey(): ISurvey;
  readonly isDisposed: boolean;
  readonly isPagingActive: boolean;
  readonly hasDataListView: boolean;
  getItem(position: number): QuestionRecordItem;
  getItemPosition(item: QuestionRecordItem): number;
  getItemRecordIndex(item: ISurveyData): number;
  getItemVisibleIndex(item: ISurveyData): number;
  getItemByRecordIndex(recordIndex: number): QuestionRecordItem;
  getListRecordAt(index: number): any;
  getRecordViewIndex(recordIndex: number): number;
  getRecordIndexAtVisibleIndex(visibleIndex: number): number;
  isRecordNotLoaded(recordIndex: number): boolean;
  getVisibleNumberEnd(unpagedCount: number): number;
  refuseOperationOfSource(operation: DynamicDataSourceMethod): boolean;
  reportRecordNotLoaded(operation: DynamicDataSourceMethod): void;
  removeResolvedRecord(removal: IRecordRemoval): void;
  keepFocusIndexForRead(index: number): void;
  getLocale(): string;
  getConfirmDialogCss(): string;
}

/* The records a number, a row or a panel names for a removal, a move or an insert by number, and the
   removal itself up to the splice: its target is resolved, held while a confirmation or a removing
   handler runs, and found again afterwards. The question writes the records (removeResolvedRecord). */
export class RecordTargetResolver implements IRecordIndexFollower {
  /* The removals a confirmation holds for records without an object (another page). Every write of a
     record replaces its object, so a held target names its record by index, kept in step with the
     question's own inserts, removes and moves; an assignment from outside, a read and a new source drop
     the held targets, and their answers fall back to the record object. */
  private held: Array<IRecordTarget>;
  // The last removeTarget removed a record (a handler may cancel it, or it may find nothing to remove).
  private isLastTargetRemoved: boolean = false;
  constructor(private owner: IRecordTargetResolverOwner) { }
  public get heldRemoveTargets(): Array<IRecordTarget> {
    return this.held;
  }
  /* The start of a removal, with no change: everything that depends on the object being among the
     objects is read now - after the splice a row has no position, and a panel that is not among the
     panels is taken for one being appended. undefined: the target's object is no longer among them.
     The caller's own steps that may cancel (a removing event) run between this and
     removeResolvedRecord. */
  private resolveRecordRemoval(target: IRecordTarget): IRecordRemoval {
    const owner = this.owner;
    const item = target.item;
    const position = !!item ? owner.getItemPosition(item) : -1;
    if (!!item && position < 0) return undefined;
    const recordIndex = !!item ? owner.getItemRecordIndex(item) : target.recordIndex;
    return { item: item, position: position, recordIndex: recordIndex, viewIndex: owner.getRecordViewIndex(recordIndex) };
  }
  /* A removal from its target, in the order every type keeps: the record is resolved, the type's
     removing event is raised (raiseRemoving answers false to cancel), the type adds what it decides
     before the splice (extend), and the record is removed (removeResolvedRecord). A handler of the
     event may insert, remove or move records: the removal follows its record by index through the
     list's own changes, and the object that shows it then is the one removed. An assignment from
     outside during the event replaces the objects: as the released rule, the removal takes the object
     now at the resolved position, and nothing is removed when there is none. undefined: nothing was
     removed. */
  public removeTarget<T extends IRecordRemoval>(target: IRecordTarget, raiseRemoving: (removal: IRecordRemoval) => boolean,
    extend?: (removal: IRecordRemoval) => T): T {
    const owner = this.owner;
    this.isLastTargetRemoved = false;
    let removal = this.resolveRecordRemoval(target);
    if (!removal) return undefined;
    const followed: IRecordTarget = { recordIndex: removal.recordIndex };
    if (!this.held)this.held = [];
    const held = this.held;
    held.push(followed);
    let isAllowed: boolean;
    try {
      isAllowed = raiseRemoving(removal);
    } finally {
      const at = held.indexOf(followed);
      if (at > -1) held.splice(at, 1);
    }
    if (!isAllowed) return undefined;
    if (followed.recordIndex !== removal.recordIndex && this.held === held) {
      if (followed.recordIndex < 0) return undefined;
      removal = this.resolveRecordRemoval(this.createRecordTargetOf(followed.recordIndex));
      if (!removal) return undefined;
    } else if (!!removal.item && owner.getItemPosition(removal.item) < 0) {
      /* An assignment from outside replaced the objects. Without a view the object now at the position
         is removed, as released; under a view a position names another record once the view is
         decided again, so the record is found again by its index. */
      if (owner.hasDataListView) {
        removal = this.resolveRecordRemoval(this.createRecordTargetOf(removal.recordIndex));
      } else {
        const item = owner.getItem(removal.position);
        removal = !!item ? this.resolveRecordRemoval({ item: item, recordIndex: owner.getItemRecordIndex(item) }) : undefined;
      }
      if (!removal) return undefined;
    }
    const res = !!extend ? extend(removal) : <T>removal;
    owner.removeResolvedRecord(res);
    this.isLastTargetRemoved = true;
    return res;
  }
  /* After a removal from the UI: a remote page that is read again after it is rebuilt when the read
     commits, and the object focused after the removal goes with it - the position is focused once more
     after that rebuild (focusItemAfterRead). Only when a record was removed: a cancelled removal leaves
     the focus where it is. */
  public keepFocusForReadAfterRemoval(index: number): void {
    if (this.isLastTargetRemoved)this.owner.keepFocusIndexForRead(index);
  }
  // The target of an object, at a visible index of the whole view.
  public createItemTarget(item: QuestionRecordItem, visibleIndex: number): IRecordTarget {
    return { item: item, recordIndex: this.owner.getItemRecordIndex(item), visibleIndex: visibleIndex };
  }
  // The target of a record index: with its object when it has one.
  private createRecordTargetOf(recordIndex: number): IRecordTarget {
    const item = this.owner.getItemByRecordIndex(recordIndex);
    return !!item ? { item: item, recordIndex: recordIndex } : { recordIndex: recordIndex, record: this.owner.getListRecordAt(recordIndex) };
  }
  /* Under paging, the record a whole-view number names (getRecordIndexAtVisibleIndex), with its
     object when it has one. undefined: there is none. isNotLoaded: a source that pages itself holds
     another window. A record without an object is captured as the question reads it
     (getListRecordAt), to be found again later. Range checks against the question's count stay with
     the caller. */
  private getRecordTargetAtVisibleIndex(visibleIndex: number): IRecordTarget {
    return this.createRecordTarget(this.owner.getRecordIndexAtVisibleIndex(visibleIndex), visibleIndex);
  }
  /* The created-position counterpart, for the numbers that count the owner-hidden records too
     (getRowValue, moveRowByIndex, the panel's getQuestionFromArray, ...): under paging a position among
     the created records of the whole view, also on another page. A number past the records shown
     (globalCreatedExtent) names nothing: undefined. */
  public getRecordTargetAtCreatedIndex(createdIndex: number): IRecordTarget {
    const list = this.owner.getDataList();
    if (createdIndex < 0 || createdIndex >= list.globalCreatedExtent) return undefined;
    return this.createRecordTarget(list.getIndexAtGlobalCreatedIndex(createdIndex));
  }
  private createRecordTarget(recordIndex: number, visibleIndex?: number): IRecordTarget {
    const owner = this.owner;
    if (recordIndex < 0) return owner.isRecordNotLoaded(recordIndex) ? { recordIndex: -1, visibleIndex: visibleIndex, isNotLoaded: true } : undefined;
    const item = owner.getItemByRecordIndex(recordIndex);
    if (!!item) return { recordIndex: recordIndex, visibleIndex: visibleIndex, item: item };
    return { recordIndex: recordIndex, visibleIndex: visibleIndex, record: owner.getListRecordAt(recordIndex) };
  }
  /* The record a created position of the whole view names, for an operation on it: -1 when there is
     none, and a record a source that pages itself has not loaded is refused and reported under the
     operation. */
  public getRecordIndexForOperation(createdIndex: number, operation: DynamicDataSourceMethod): number {
    const target = this.getRecordTargetForOperation(createdIndex, operation);
    return !!target ? target.recordIndex : -1;
  }
  // The same, with the record's object when it has one: undefined when there is no record to act on.
  public getRecordTargetForOperation(createdIndex: number, operation: DynamicDataSourceMethod): IRecordTarget {
    const target = this.getRecordTargetAtCreatedIndex(createdIndex);
    if (!target) return undefined;
    if (target.isNotLoaded) {
      this.owner.reportRecordNotLoaded(operation);
      return undefined;
    }
    return target;
  }
  /* The record index an insert at a created position of the whole view goes to: in front of the
     record at that position, an append at or past the last one (getInsertIndexAtCreatedIndex of the
     list). -1: a source that pages itself does not hold the position - the insert is refused and
     reported. */
  public getInsertIndexForOperation(createdIndex: number): number {
    const at = this.owner.getDataList().getInsertIndexAtCreatedIndex(createdIndex);
    if (at < 0) {
      this.owner.reportRecordNotLoaded("insert");
    }
    return at;
  }
  /* Where an insert at a created position of the whole view goes: the record index (-1: refused and
     reported, getInsertIndexForOperation) and the visible index the new record will have - an append's
     when it goes in front of a record the view hides. */
  public getInsertTargetForOperation(createdIndex: number): { at: number, visibleIndex: number } {
    const list = this.owner.getDataList();
    const at = this.getInsertIndexForOperation(createdIndex);
    const visibleIndex = at < list.loadedCount ? list.getGlobalVisibleIndex(at) : -1;
    return { at: at, visibleIndex: visibleIndex > -1 ? visibleIndex : list.visibleCount };
  }
  /* The two records a move between created positions of the whole view names, each end clamped to the
     records shown, as the numbers of a move are clamped without paging. undefined: there is nothing to
     move. Every end is loaded: a question with a data source refuses a move before it gets here. */
  public getMoveTargetsAtCreatedIndexes(fromIndex: number, toIndex: number): { from: IRecordTarget, to: IRecordTarget } {
    const last = this.owner.getDataList().globalCreatedExtent - 1;
    if (last < 0) return undefined;
    const from = this.getRecordTargetAtCreatedIndex(Math.max(0, Math.min(fromIndex, last)));
    const to = this.getRecordTargetAtCreatedIndex(Math.max(0, Math.min(toIndex, last)));
    if (!from || !to) return undefined;
    return { from: from, to: to };
  }
  /* The start of a removal: the remove a source cannot make is refused, resolve names the target, and
     a record a source that pages itself has not loaded is reported. undefined: nothing to remove. */
  public getRemoveTarget(resolve: () => IRecordTarget): IRecordTarget {
    if (this.owner.refuseOperationOfSource("remove")) return undefined;
    const target = resolve();
    if (!target) return undefined;
    if (target.isNotLoaded) {
      this.owner.reportRecordNotLoaded("remove");
      return undefined;
    }
    return target;
  }
  /* What a removal by number acts on. index is a position among the visible records of the whole
     view, below getVisibleNumberEnd(unpagedCount); under paging the record it names may be on another
     page and have no object. Without paging getVisibleItem answers the object at the position. */
  public resolveRecordTarget(index: number, unpagedCount: number, getVisibleItem: (index: number) => QuestionRecordItem): IRecordTarget {
    if (index < 0 || index >= this.owner.getVisibleNumberEnd(unpagedCount)) return undefined;
    if (this.owner.isPagingActive) return this.getRecordTargetAtVisibleIndex(index);
    const item = getVisibleItem(index);
    return !item ? undefined : this.createItemTarget(item, index);
  }
  /* A removal target found again when a confirmation answers: by then the page, the sort or the
     records may have changed. A target captured with an object names its record for as long as the
     object is built and visible - the remap layer keeps it in step - and none once the object is gone.
     A target captured without one is found again by its record (findRecordTargetAgain). The two kinds
     never stand in for each other: a target with an object holds no record, and looking that up could
     name another one - a stored undefined or empty entry. */
  private findRemoveTargetAgain(target: IRecordTarget): IRecordTarget {
    if (this.owner.isDisposed) return undefined;
    if (!target.item) return this.findRecordTargetAgain(target);
    const visibleIndex = this.owner.getItemVisibleIndex(target.item);
    if (visibleIndex < 0) return undefined;
    return this.createItemTarget(target.item, visibleIndex);
  }
  /* A target without an object, found again after the records or the view changed - a confirmation
     answers later. A held target (holdRemoveTarget) names its record by index; any other one by its
     record object. undefined when the record is gone or left the view, or an assignment from outside
     replaced the records. */
  private findRecordTargetAgain(target: IRecordTarget): IRecordTarget {
    const list = this.owner.getDataList();
    const held = !!this.held ? this.held.indexOf(target) : -1;
    if (held > -1)this.held.splice(held, 1);
    const recordIndex = held > -1 ? target.recordIndex : list.indexOfRecord(target.record);
    const visibleIndex = recordIndex < 0 ? -1 : list.getGlobalVisibleIndex(recordIndex);
    return visibleIndex < 0 ? undefined : { recordIndex: recordIndex, visibleIndex: visibleIndex, record: list.getRecord(recordIndex) };
  }
  /* The removal flow of both types: with a confirmation the target is found again when the respondent
     answers (confirmRecordRemoval), without one at once - the object or record the caller named, where
     it is now. */
  public runRecordRemoval(target: IRecordTarget, isConfirmed: boolean, message: string, remove: (current: IRecordTarget) => void): void {
    if (isConfirmed) {
      this.confirmRecordRemoval(target, message, remove);
      return;
    }
    const current = this.findRemoveTargetAgain(target);
    if (!!current) remove(current);
  }
  /* A removal the respondent confirms first (confirmDeleteText): the target is held while the dialog
     is open, found again when they confirm (findRemoveTargetAgain), and handed to remove; nothing is
     removed when it is gone. */
  private confirmRecordRemoval(target: IRecordTarget, message: string, remove: (current: IRecordTarget) => void): void {
    this.holdRemoveTarget(target);
    confirmActionAsync({
      message: message,
      funcOnYes: () => {
        const current = this.findRemoveTargetAgain(target);
        if (!!current) remove(current);
      },
      locale: this.owner.getLocale(),
      rootElement: this.owner.getSurvey()?.rootElement,
      cssClass: this.owner.getConfirmDialogCss()
    });
  }
  private holdRemoveTarget(target: IRecordTarget): void {
    if (!!target.item) return;
    if (!this.held)this.held = [];
    this.held.push(target);
  }
  public follow(event: RecordIndexEvent): void {
    if (isRecordListChange(event)) {
      this.remap(toKnownRemap(event.remap));
    } else if (event.kind === "reload" || event.kind === "assignment" || event.kind === "source") {
      this.held = undefined;
    }
  }
  private remap(remap: (index: number) => number): void {
    if (!this.held) return;
    this.held.forEach((target: IRecordTarget): void => {
      target.recordIndex = target.recordIndex < 0 ? -1 : remap(target.recordIndex);
    });
  }
}
