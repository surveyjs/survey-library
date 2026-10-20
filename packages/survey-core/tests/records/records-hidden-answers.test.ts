import { describe, test, expect } from "vitest";
import { HiddenAnswerTracker, IHiddenAnswerTrackerOwner } from "../../src/records/records-hidden-answers";
import { RecordIndexEvent } from "../../src/records/records-index-followers";

// A template input as the tracker reads it: its value name.
class FakeInput {
  constructor(public name: string) { }
  public getValueName(): string { return this.name; }
}
// A question of a built object: its visibility, the panel around it, and the clean-up it was asked for.
class FakeItemQuestion {
  public cleared: Array<string> = [];
  public parent: any;
  constructor(public visible: boolean, isContainerVisible: boolean) {
    this.parent = { visible: isContainerVisible, isPage: false, parent: { isPage: true } };
  }
  public clearValueIfInvisible(reason: string): void { this.cleared.push(reason); }
}
class FakeItem {
  constructor(public questions: { [name: string]: FakeItemQuestion }) { }
  public getQuestionsByValueName(name: string): Array<FakeItemQuestion> { return !!this.questions[name] ? [this.questions[name]] : []; }
}
/* The records question over records[]: items[i] is the object of record i, if it has one. In a record
   without an object an input hides itself when "<index>:<name>" is in selfHidden, and the panel around
   it hides when the index is in containerHidden. */
class FakeOwner implements IHiddenAnswerTrackerOwner {
  public survey: any = {};
  public areInvisibleElementsShowing = false;
  public isRemoteData = false;
  public recordsSource: any = { getRecordStateKey: (index: number): any => index };
  public inputs: Array<any> = [new FakeInput("a")];
  public items: Array<FakeItem> = [];
  public selfHidden = new Set<string>();
  public containerHidden = new Set<number>();
  public clearsOnContainer = true;
  public keeps = true;
  public writes: Array<{ index: number, record: any }> = [];
  constructor(public records: Array<any>) { }
  public getSurvey(): any { return this.survey; }
  public getStoredRecords(): any { return this.records; }
  public asRecords(value: any): Array<any> { return Array.isArray(value) ? value : []; }
  public getRecordTemplateQuestion(key: string): any { return undefined; }
  public getRecordConditionalInputs(): Array<any> { return this.inputs; }
  public canRecordQuestionBeCleared(q: any, reason: string): boolean { return reason !== "onHiddenContainer" || this.clearsOnContainer; }
  public canCleanRecordsWithoutObjects(): boolean { return true; }
  public createRecordVisibilityScope(properties: any): any { return undefined; }
  public collectRecordChangesWithoutObjects(properties: any, clean: (index: number, record: any, visibility: any) => any,
    onItem?: (index: number, record: any, item: any) => void): Array<{ index: number, record: any }> {
    const changes: Array<{ index: number, record: any }> = [];
    this.records.forEach((record: any, index: number): void => {
      if (!!this.items[index]) {
        if (!!onItem) onItem(index, record, this.items[index]);
        return;
      }
      const visibility = { index: index, reset: (): void => { }, isVisible: (q: any): boolean => !this.selfHidden.has(index + ":" + q.getValueName()) };
      const cleared = clean(index, record, visibility);
      if (!!cleared) changes.push({ index: index, record: cleared });
    });
    return changes;
  }
  public isRecordInputContainerVisible(visibility: any, q: any): boolean { return !this.containerHidden.has(visibility.index); }
  public removeRecordAnswer(record: any, cleared: any, name: string): any {
    const res = Object.assign({}, cleared || record);
    delete res[name];
    return res;
  }
  public writeRecordChanges(changes: Array<{ index: number, record: any }>): void {
    changes.forEach((change: { index: number, record: any }): void => {
      this.writes.push(change);
      this.records[change.index] = change.record;
    });
  }
  public keepsHiddenAnswerStates(oldCount: number, newCount: number): boolean { return this.keeps; }
  public forEachBuiltRecordItem(func: (key: any, item: any) => void): void {
    this.items.forEach((item: FakeItem, index: number): void => { if (!!item) func(index, item); });
  }
}
function create(records: Array<any>): { owner: FakeOwner, tracker: HiddenAnswerTracker } {
  const owner = new FakeOwner(records);
  return { owner, tracker: new HiddenAnswerTracker(owner) };
}
const keys = (tracker: HiddenAnswerTracker): Array<any> => !!tracker.hiddenAnswerStates ? Array.from(tracker.hiddenAnswerStates.keys()) : undefined;

describe("HiddenAnswerTracker: clearIfInvisible over the records without an object", () => {
  test("a record seen for the first time is only noted; an input that hides itself afterwards loses its answer", () => {
    const { owner, tracker } = create([{ a: 1, b: 1 }, { a: 2 }]);
    owner.selfHidden.add("1:a");
    tracker.clearHiddenAnswersWithoutObjects({});
    expect(owner.writes, "#1: built hidden: nothing is cleared").toEqual([]);
    expect(keys(tracker), "#2: both records are noted").toEqual([0, 1]);
    owner.selfHidden.add("0:a");
    tracker.clearHiddenAnswersWithoutObjects({});
    expect(owner.writes, "#3: only the transition clears, in one write").toEqual([{ index: 0, record: { b: 1 } }]);
    owner.selfHidden.clear();
    owner.writes = [];
    tracker.clearHiddenAnswersWithoutObjects({});
    expect(owner.writes, "#4: shown again: nothing to clear").toEqual([]);
  });
  test("a panel around the input that hides clears only where the input clears under onHiddenContainer", () => {
    const kept = create([{ a: 1 }]);
    kept.owner.clearsOnContainer = false;
    kept.tracker.clearHiddenAnswersWithoutObjects({});
    kept.owner.containerHidden.add(0);
    kept.tracker.clearHiddenAnswersWithoutObjects({});
    expect(kept.owner.writes, "#1: onHidden: the answer stays").toEqual([]);
    const cleared = create([{ a: 1 }]);
    cleared.tracker.clearHiddenAnswersWithoutObjects({});
    cleared.owner.containerHidden.add(0);
    cleared.tracker.clearHiddenAnswersWithoutObjects({});
    expect(cleared.owner.writes, "#2: onHiddenContainer: the answer goes").toEqual([{ index: 0, record: {} }]);
  });
  test("a record with an object takes its flags from the object's questions, and its history goes on without the object", () => {
    const { owner, tracker } = create([{ a: 1 }]);
    owner.items[0] = new FakeItem({ a: new FakeItemQuestion(true, true) });
    tracker.clearHiddenAnswersWithoutObjects({});
    expect(tracker.hiddenAnswerStates.get(0), "#1: shown, inside a shown panel").toEqual({ a: 3 });
    owner.items[0] = undefined;
    owner.selfHidden.add("0:a");
    tracker.clearHiddenAnswersWithoutObjects({});
    expect(owner.writes, "#2: hidden once the object is gone").toEqual([{ index: 0, record: {} }]);
  });
  test("no input that clears on hiding: nothing is walked", () => {
    const { owner, tracker } = create([{ a: 1 }]);
    owner.inputs = [];
    tracker.clearHiddenAnswersWithoutObjects({});
    expect(tracker.hiddenAnswerStates, "#1").toBeUndefined();
  });
});

describe("HiddenAnswerTracker: the states follow the record indexes", () => {
  const createWithStates = (): { owner: FakeOwner, tracker: HiddenAnswerTracker } => {
    const res = create([{ a: 0 }, { a: 1 }, { a: 2 }]);
    res.tracker.clearHiddenAnswersWithoutObjects({});
    expect(keys(res.tracker), "the states of every record").toEqual([0, 1, 2]);
    return res;
  };
  test("an insert, a remove and a move renumber them; a record the remap cannot place is gone", () => {
    const { tracker } = createWithStates();
    tracker.follow({ kind: "insert", remap: (index: number): number => index >= 1 ? index + 1 : index });
    expect(keys(tracker).sort(), "#1: inserted at 1").toEqual([0, 2, 3]);
    tracker.follow({ kind: "remove", remap: (index: number): number => index === 0 ? -1 : index - 1 });
    expect(keys(tracker).sort(), "#2: record 0 removed").toEqual([1, 2]);
    tracker.follow({ kind: "move", remap: (index: number): number => index === 1 ? 2 : (index === 2 ? 1 : index) });
    expect(keys(tracker).sort(), "#3: the two swap").toEqual([1, 2]);
    tracker.follow({ kind: "move", remap: (index: number): number => index === 1 ? undefined : index });
    expect(keys(tracker), "#4: not placed").toEqual([2]);
  });
  test("a moved record keeps its own flags", () => {
    const { owner, tracker } = create([{ a: 0 }, { a: 1 }]);
    owner.selfHidden.add("1:a");
    tracker.clearHiddenAnswersWithoutObjects({});
    tracker.follow({ kind: "move", remap: (index: number): number => 1 - index });
    expect(tracker.hiddenAnswerStates.get(0), "#1: the hidden one is first now").toEqual({ a: 2 });
    expect(tracker.hiddenAnswerStates.get(1), "#2").toEqual({ a: 3 });
  });
  test("the end of an assignment from outside keeps the states of the records that stay, where the type keeps them", () => {
    const kept = createWithStates();
    kept.tracker.follow({ kind: "valueAssigned", oldRecords: [{}, {}, {}], newRecords: [{}, {}] });
    expect(keys(kept.tracker), "#1: the records past the new count go").toEqual([0, 1]);
    const dropped = createWithStates();
    dropped.owner.keeps = false;
    dropped.tracker.follow({ kind: "valueAssigned", oldRecords: [{}, {}, {}], newRecords: [{}, {}, {}] });
    expect(keys(dropped.tracker), "#2: a type that rebuilds its objects drops them").toEqual([]);
  });
  test("a key that is not an index - a keyed source's - is neither renumbered nor dropped by an assignment", () => {
    const { owner, tracker } = create([{ id: "x", a: 1 }]);
    owner.recordsSource = { getRecordStateKey: (index: number, record: any): any => "k" + record.id };
    owner.keeps = false;
    tracker.clearHiddenAnswersWithoutObjects({});
    tracker.follow({ kind: "remove", remap: (): number => -1 });
    tracker.follow({ kind: "valueAssigned", oldRecords: [{}], newRecords: [] });
    expect(keys(tracker), "#1").toEqual(["kx"]);
  });
  test("every other event leaves them as they are", () => {
    const { tracker } = createWithStates();
    const events: Array<RecordIndexEvent> = [
      { kind: "reload", oldRecords: [], newRecords: [], getRemap: () => (): number => -1 },
      { kind: "assignment", oldRecords: [], newRecords: [], getRemap: () => (): number => -1 },
      { kind: "redefined", getRemap: () => (): number => -1 },
      { kind: "source" }, { kind: "dispose" }, { kind: "pageChanged" }, { kind: "readFailed" }];
    events.forEach((event: RecordIndexEvent) => tracker.follow(event));
    expect(keys(tracker), "#1").toEqual([0, 1, 2]);
  });
});

describe("HiddenAnswerTracker: an assignment that builds objects anew", () => {
  test("a new object clears the answer its record's input hid, as the question clears it on hiding", () => {
    const { owner, tracker } = create([{ a: 0 }, { a: 1 }]);
    const kept = new FakeItem({ a: new FakeItemQuestion(true, true) });
    owner.items[0] = kept;
    tracker.clearHiddenAnswersWithoutObjects({});
    const taken = tracker.takeHiddenAnswerFlags([{ a: 0 }, { a: 1 }]);
    expect(!!taken, "#1").toBe(true);
    const selfHidden = new FakeItemQuestion(false, true);
    const containerHidden = new FakeItemQuestion(true, false);
    owner.items[0] = new FakeItem({ a: containerHidden });
    owner.items[1] = new FakeItem({ a: selfHidden });
    tracker.clearAnswersHiddenInNewObjects(taken);
    expect(selfHidden.cleared, "#2: the record's own flags, taken from the walk").toEqual(["onHidden"]);
    expect(containerHidden.cleared, "#3: the flags of the object it had").toEqual(["onHiddenContainer"]);
  });
  test("an object that existed before clears nothing here, and nothing is taken where the type does not keep the states", () => {
    const { owner, tracker } = create([{ a: 0 }]);
    const question = new FakeItemQuestion(true, true);
    owner.items[0] = new FakeItem({ a: question });
    const taken = tracker.takeHiddenAnswerFlags([{ a: 0 }]);
    question.visible = false;
    tracker.clearAnswersHiddenInNewObjects(taken);
    expect(question.cleared, "#1: it clears when it runs the assignment's conditions").toEqual([]);
    owner.keeps = false;
    expect(tracker.takeHiddenAnswerFlags([{ a: 0 }]), "#2").toBeUndefined();
    owner.keeps = true;
    owner.isRemoteData = true;
    expect(tracker.takeHiddenAnswerFlags([{ a: 0 }]), "#3: a source-owned question").toBeUndefined();
  });
});
