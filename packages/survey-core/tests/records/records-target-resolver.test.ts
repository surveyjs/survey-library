import { describe, test, expect } from "vitest";
import { IRecordRemoval, IRecordTarget, IRecordTargetResolverOwner, RecordTargetResolver } from "../../src/records/records-target-resolver";
import { settings } from "../../src/settings";

// An object of a record: the record index it holds; typed as any, it stands for a QuestionRecordItem.
class FakeItem {
  constructor(public recordIndex: number) { }
}
const itemOf = (recordIndex: number): any => new FakeItem(recordIndex);
/* The records question over records[], without a view: the objects are items, in record order, and a
   record's visible index is its index. */
class FakeOwner implements IRecordTargetResolverOwner {
  public isDisposed = false;
  public isPagingActive = false;
  public hasDataListView = false;
  public items: Array<any> = [];
  public removed: Array<IRecordRemoval> = [];
  public focused: Array<number> = [];
  public reported: Array<string> = [];
  public isRefused = false;
  constructor(public records: Array<any>) { }
  public getDataList(): any {
    const records = this.records;
    return {
      get loadedCount(): number { return records.length; },
      get visibleCount(): number { return records.length; },
      get globalCreatedExtent(): number { return records.length; },
      getIndexAtGlobalCreatedIndex: (index: number): number => index,
      getInsertIndexAtCreatedIndex: (index: number): number => Math.min(index, records.length),
      getGlobalVisibleIndex: (index: number): number => index < records.length ? index : -1,
      indexOfRecord: (record: any): number => records.indexOf(record),
      getRecord: (index: number): any => records[index]
    };
  }
  public getSurvey(): any { return { rootElement: "root" }; }
  public getItem(position: number): any { return this.items[position]; }
  public getItemPosition(item: any): number { return this.items.indexOf(item); }
  public getItemRecordIndex(item: any): number { return item.recordIndex; }
  public getItemVisibleIndex(item: any): number { return this.items.indexOf(item); }
  public getItemByRecordIndex(recordIndex: number): any { return this.items.filter((item: any) => item.recordIndex === recordIndex)[0]; }
  public getListRecordAt(index: number): any { return this.records[index]; }
  public getRecordViewIndex(recordIndex: number): number { return recordIndex; }
  public getRecordIndexAtVisibleIndex(visibleIndex: number): number { return visibleIndex < this.records.length ? visibleIndex : -1; }
  public isRecordNotLoaded(recordIndex: number): boolean { return false; }
  public getVisibleNumberEnd(unpagedCount: number): number { return unpagedCount; }
  public refuseOperationOfSource(operation: string): boolean { return this.isRefused; }
  public reportRecordNotLoaded(operation: string): void { this.reported.push(operation); }
  public removeResolvedRecord(removal: IRecordRemoval): void {
    this.removed.push(removal);
    this.records.splice(removal.recordIndex, 1);
  }
  public keepFocusIndexForRead(index: number): void { this.focused.push(index); }
  public getLocale(): string { return "de"; }
  public getConfirmDialogCss(): string { return "confirm-css"; }
}
function create(count: number): { owner: FakeOwner, resolver: RecordTargetResolver } {
  const records: Array<any> = [];
  for (let i = 0; i < count; i++) records.push({ id: i });
  const owner = new FakeOwner(records);
  return { owner, resolver: new RecordTargetResolver(owner) };
}
// The list's insert of one record in front of index, and its remove of index.
const insertAt = (at: number): any => ({ kind: "insert", remap: (index: number): number => index >= at ? index + 1 : index });
const removeAt = (at: number): any => ({ kind: "remove", remap: (index: number): number => index === at ? -1 : (index > at ? index - 1 : index) });
// The confirmation dialog: answer() is the respondent's answer.
function holdConfirmation(func: (answer: (yes: boolean) => void, options: () => any) => void): void {
  const saved = { func: settings.confirmActionFunc, async: settings.confirmActionAsync };
  let callback: (yes: boolean) => void;
  let dialogOptions: any;
  settings.confirmActionFunc = undefined;
  settings.confirmActionAsync = (message: string, cb: (yes: boolean) => void, options: any): boolean => {
    callback = cb;
    dialogOptions = options;
    return true;
  };
  try {
    func((yes: boolean): void => callback(yes), (): any => dialogOptions);
  } finally {
    settings.confirmActionFunc = saved.func;
    settings.confirmActionAsync = saved.async;
  }
}

describe("RecordTargetResolver: a removal follows its record through the removing handler", () => {
  test("a handler that inserts and removes records: the record the target named is the one removed", () => {
    const { owner, resolver } = create(4);
    const record = owner.records[2];
    const removal = resolver.removeTarget({ recordIndex: 2 }, (resolved: IRecordRemoval): boolean => {
      expect(resolver.heldRemoveTargets.map((t: IRecordTarget) => t.recordIndex), "#1: held while the handler runs").toEqual([2]);
      owner.records.splice(0, 0, { id: "new" });
      resolver.follow(insertAt(0));
      owner.records.splice(4, 1);
      resolver.follow(removeAt(4));
      return true;
    });
    expect(removal.recordIndex, "#2: found again at its new index").toBe(3);
    expect(owner.removed.length, "#3").toBe(1);
    expect(owner.records.indexOf(record), "#4: removed").toBe(-1);
    expect(resolver.heldRemoveTargets, "#5: released").toEqual([]);
    resolver.keepFocusForReadAfterRemoval(5);
    expect(owner.focused, "#6: a removal happened").toEqual([5]);
  });
  test("a handler that removes the record itself: nothing more is removed", () => {
    const { owner, resolver } = create(3);
    const removal = resolver.removeTarget({ recordIndex: 1 }, (): boolean => {
      owner.records.splice(1, 1);
      resolver.follow(removeAt(1));
      return true;
    });
    expect(removal, "#1").toBeUndefined();
    expect(owner.removed, "#2").toEqual([]);
  });
  test("a cancelled removal removes nothing, releases the target and keeps no focus", () => {
    const { owner, resolver } = create(3);
    const item = itemOf(1);
    owner.items = [itemOf(0), item, itemOf(2)];
    resolver.removeTarget({ recordIndex: 0 }, (): boolean => true);
    expect(owner.removed.length, "#1: a removal first").toBe(1);
    let extended = 0;
    const removal = resolver.removeTarget({ recordIndex: 1, item: item }, (): boolean => false, (r: IRecordRemoval): IRecordRemoval => { extended++; return r; });
    expect(removal, "#2").toBeUndefined();
    expect(extended, "#3: the type decides nothing").toBe(0);
    expect(owner.removed.length, "#4").toBe(1);
    expect(resolver.heldRemoveTargets, "#5").toEqual([]);
    resolver.keepFocusForReadAfterRemoval(1);
    expect(owner.focused, "#6: the last removal was cancelled").toEqual([]);
  });
  test("a target whose object is no longer among the objects is not removed; one replaced by an assignment takes the object at its position", () => {
    const { owner, resolver } = create(2);
    const gone = itemOf(0);
    owner.items = [itemOf(0), itemOf(1)];
    expect(resolver.removeTarget({ recordIndex: 0, item: gone }, (): boolean => true), "#1").toBeUndefined();
    const item = owner.items[1];
    const replacement = itemOf(1);
    const removal = resolver.removeTarget({ recordIndex: 1, item: item }, (): boolean => {
      owner.items = [itemOf(0), replacement];
      return true;
    });
    expect(removal.item, "#2: the object now at the position").toBe(replacement);
    expect(removal.position, "#3").toBe(1);
  });
});

describe("RecordTargetResolver: a confirmation answers later", () => {
  test("a target without an object is held by its record index while the dialog is open", () => {
    const { owner, resolver } = create(4);
    const record = owner.records[2];
    const removed: Array<IRecordTarget> = [];
    holdConfirmation((answer: (yes: boolean) => void, options: () => any): void => {
      resolver.runRecordRemoval({ recordIndex: 2, record: record }, true, "Remove?", (current: IRecordTarget): void => { removed.push(current); });
      expect(options().locale, "#1").toBe("de");
      expect(options().rootElement, "#2").toBe("root");
      expect(options().cssClass, "#3").toBe("confirm-css");
      owner.records.splice(0, 0, { id: "new" });
      resolver.follow(insertAt(0));
      answer(true);
    });
    expect(removed, "#4: found again at its new index").toEqual([{ recordIndex: 3, visibleIndex: 3, record: record }]);
    expect(resolver.heldRemoveTargets, "#5: no longer held").toEqual([]);
  });
  test("a confirmation that answers after the record left removes nothing", () => {
    const { owner, resolver } = create(3);
    const removed: Array<IRecordTarget> = [];
    holdConfirmation((answer: (yes: boolean) => void): void => {
      resolver.runRecordRemoval({ recordIndex: 1, record: owner.records[1] }, true, "Remove?", (current: IRecordTarget): void => { removed.push(current); });
      owner.records.splice(1, 1);
      resolver.follow(removeAt(1));
      answer(true);
    });
    expect(removed, "#1").toEqual([]);
  });
  test("a reload drops the held targets: the answer finds the record by its object", () => {
    const { owner, resolver } = create(3);
    const record = owner.records[1];
    const removed: Array<IRecordTarget> = [];
    holdConfirmation((answer: (yes: boolean) => void): void => {
      resolver.runRecordRemoval({ recordIndex: 1, record: record }, true, "Remove?", (current: IRecordTarget): void => { removed.push(current); });
      owner.records.reverse();
      resolver.follow({ kind: "reload", oldRecords: [], newRecords: [], getRemap: () => (): number => -1 });
      expect(resolver.heldRemoveTargets, "#1").toBeUndefined();
      answer(true);
    });
    expect(removed, "#2").toEqual([{ recordIndex: 1, visibleIndex: 1, record: record }]);
  });
  test("an object that left, a disposed question and a no: nothing is removed", () => {
    const { owner, resolver } = create(2);
    const item = itemOf(0);
    owner.items = [item, itemOf(1)];
    const removed: Array<IRecordTarget> = [];
    const remove = (current: IRecordTarget): void => { removed.push(current); };
    holdConfirmation((answer: (yes: boolean) => void): void => {
      resolver.runRecordRemoval({ recordIndex: 0, item: item }, true, "Remove?", remove);
      expect(resolver.heldRemoveTargets, "#1: a target with an object is not held").toBeUndefined();
      owner.items = [itemOf(1)];
      answer(true);
      resolver.runRecordRemoval({ recordIndex: 1, item: owner.items[0] }, true, "Remove?", remove);
      answer(false);
      resolver.runRecordRemoval({ recordIndex: 1, item: owner.items[0] }, true, "Remove?", remove);
      owner.isDisposed = true;
      answer(true);
    });
    expect(removed, "#2").toEqual([]);
  });
  test("without a confirmation the target is found where it is now", () => {
    const { owner, resolver } = create(2);
    const item = itemOf(1);
    owner.items = [itemOf(0), item];
    const removed: Array<IRecordTarget> = [];
    resolver.runRecordRemoval({ recordIndex: 1, item: item, visibleIndex: 5 }, false, "", (current: IRecordTarget): void => { removed.push(current); });
    expect(removed, "#1").toEqual([{ item: item, recordIndex: 1, visibleIndex: 1 }]);
  });
});

describe("RecordTargetResolver: the targets of the numbers a caller passes", () => {
  test("a removal by number: refused by the source, out of range, without paging the visible object, under paging the record", () => {
    const { owner, resolver } = create(3);
    const item = itemOf(1);
    owner.items = [itemOf(0), item, itemOf(2)];
    const visible = (index: number): any => owner.items[index];
    expect(resolver.resolveRecordTarget(1, 3, visible), "#1").toEqual({ item: item, recordIndex: 1, visibleIndex: 1 });
    expect(resolver.resolveRecordTarget(3, 3, visible), "#2").toBeUndefined();
    owner.isPagingActive = true;
    owner.items = [];
    expect(resolver.resolveRecordTarget(2, 3, visible), "#3: a record without an object").toEqual({ recordIndex: 2, visibleIndex: 2, record: owner.records[2] });
    owner.isRefused = true;
    let resolved = 0;
    expect(resolver.getRemoveTarget((): IRecordTarget => { resolved++; return { recordIndex: 0 }; }), "#4").toBeUndefined();
    expect(resolved, "#5: refused before the target is resolved").toBe(0);
    owner.isRefused = false;
    expect(resolver.getRemoveTarget((): IRecordTarget => ({ recordIndex: -1, isNotLoaded: true })), "#6").toBeUndefined();
    expect(owner.reported, "#7").toEqual(["remove"]);
  });
  test("an insert, a move and an operation by created position", () => {
    const { owner, resolver } = create(3);
    expect(resolver.getInsertTargetForOperation(1), "#1").toEqual({ at: 1, visibleIndex: 1 });
    expect(resolver.getInsertTargetForOperation(5), "#2: an append").toEqual({ at: 3, visibleIndex: 3 });
    expect(resolver.getMoveTargetsAtCreatedIndexes(-1, 9), "#3: clamped")
      .toEqual({ from: { recordIndex: 0, visibleIndex: undefined, record: owner.records[0] }, to: { recordIndex: 2, visibleIndex: undefined, record: owner.records[2] } });
    expect(resolver.getRecordIndexForOperation(1, "update"), "#4").toBe(1);
    expect(resolver.getRecordIndexForOperation(3, "update"), "#5: past the records").toBe(-1);
    expect(owner.reported, "#6").toEqual([]);
  });
});
