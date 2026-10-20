import { describe, test, expect } from "vitest";
import { IRecordCleanupRunnerOwner, RecordCleanupRunner } from "../../src/records/records-cleanup-runner";
import { IRecordCleanupObject } from "../../src/question_records";

// A template question as the completion clean-up reads it; cleanup answers getAnswerCleanupAtComplete.
class FakeTemplate {
  public survey: any = undefined;
  constructor(public name: string, public cleanup: (value: any) => "clear" | "keep" | undefined = (): "keep" => "keep") { }
  public getValueName(): string { return this.name; }
  public isDescendantOf(type: string): boolean { return false; }
  public getAnswerCleanupAtComplete(value: any): "clear" | "keep" | undefined { return this.cleanup(value); }
}
/* The records question over records[]: items[i] is the object of record i, if it has one.
   createObject builds the temporary object of a record; by default one that writes nothing. */
class FakeOwner implements IRecordCleanupRunnerOwner {
  public isPagedByList = true;
  public isRemoteData = false;
  public items: Array<any> = [];
  public writes: Array<Array<{ index: number, record: any }>> = [];
  public templates: Array<FakeTemplate> = [];
  public skipped: Array<string> = [];
  public built: Array<number> = [];
  public createObject: (index: number, record: any) => IRecordCleanupObject;
  constructor(public records: Array<any>) { }
  public getDataList(): any {
    return { getCreatedIndexes: (): Array<number> => this.records.map((r: any, i: number) => i), loadedCount: this.records.length };
  }
  public isEmpty(): boolean { return this.records.length === 0; }
  public forEachRecordItem(indexes: Array<number>, func: (index: number, item: any, position: number) => void): void {
    indexes.forEach((index: number): void => func(index, this.items[index], !!this.items[index] ? index : -1));
  }
  public getListRecordAt(index: number): any { return this.records[index]; }
  public writeRecordChanges(changes: Array<{ index: number, record: any }>): void {
    this.writes.push(changes);
    changes.forEach((change: { index: number, record: any }): void => { this.records[change.index] = change.record; });
  }
  public getRecordUnknownKeys(recordIndex: number, record: any, item: any): Array<string> {
    return Object.keys(record).filter((key: string): boolean => key.indexOf("unknown") === 0);
  }
  public getRecordTemplateQuestion(key: string): any { return this.templates.filter((t: FakeTemplate) => t.name === key)[0]; }
  public createRecordCleanupObject(index: number, record: any): IRecordCleanupObject {
    this.built.push(index);
    return !!this.createObject ? this.createObject(index, record) : createObject({});
  }
  public getDataFilteredProperties(): any { return {}; }
  public isRecordCleanupSkipped(question: any): boolean { return this.skipped.indexOf(question.name) > -1; }
}
// A temporary object: item is what it writes as; the callbacks run inside the clean-up.
function createObject(item: any, actions: { runCondition?: () => void, clean?: () => void, onDispose?: () => void } = {}): IRecordCleanupObject {
  return {
    item: item,
    runCondition: (): void => { if (!!actions.runCondition) actions.runCondition(); },
    clearIncorrectValues: (): void => { if (!!actions.clean) actions.clean(); },
    clearValueIfInvisible: (): void => { if (!!actions.clean) actions.clean(); },
    validate: (): boolean => true,
    dispose: (): void => { if (!!actions.onDispose) actions.onDispose(); }
  };
}
function create(records: Array<any>): { owner: FakeOwner, runner: RecordCleanupRunner } {
  const owner = new FakeOwner(records);
  return { owner, runner: new RecordCleanupRunner(owner) };
}

describe("RecordCleanupRunner: a temporary object writes a copy of its record", () => {
  test("the writes of the object go into the copy, an empty value removes the key, and the record is not touched", () => {
    const { owner, runner } = create([]);
    const item: any = {};
    const other: any = {};
    const results: Array<any> = [];
    owner.createObject = (): IRecordCleanupObject => createObject(item, {
      clean: (): void => {
        results.push(runner.writeRecordCleanupCopy(item, false, "a", 5), runner.writeRecordCleanupCopy(item, false, "b", undefined),
          runner.writeRecordCleanupCopy(other, false, "a", 6), runner.getRecordCleanupIndex(item, false), runner.getRecordCleanupIndex(other, false));
      }
    });
    const record = { a: 1, b: 2, c: 3, unknownKey: 4 };
    const res = runner.cleanRecordWithObject(7, record, (cleanupObject: IRecordCleanupObject): void => cleanupObject.clearIncorrectValues());
    expect(res, "#1: the copy, without the keys no question stores").toEqual({ a: 5, c: 3 });
    expect(record, "#2").toEqual({ a: 1, b: 2, c: 3, unknownKey: 4 });
    expect(results, "#3: another object writes elsewhere and has no record index here").toEqual([true, true, false, 7, -1]);
    expect(runner.getRecordCleanupCopy(item, false), "#4: no copy once the object is gone").toBeUndefined();
    expect(runner.writeRecordCleanupCopy(item, false, "a", 1), "#5").toBe(false);
  });
  test("the writes made while the object is built are dropped; until it is built an unknown item is the object", () => {
    const { owner, runner } = create([]);
    const states: Array<any> = [];
    owner.createObject = (): IRecordCleanupObject => {
      states.push(runner.isRecordCleanupBuilding, runner.writeRecordCleanupCopy(<any>{}, true, "a", 9), runner.writeRecordCleanupCopy(<any>{}, false, "a", 9),
        runner.getRecordCleanupCopy(<any>{}, true));
      return createObject({}, { runCondition: (): void => { states.push(runner.isRecordCleanupBuilding); } });
    };
    const res = runner.cleanRecordWithObject(0, { a: 1 }, (): void => { });
    expect(states, "#1: building, a write of an unknown item is taken and dropped, a known one is not the object's")
      .toEqual([true, true, false, { a: 1 }, false]);
    expect(res, "#2").toEqual({ a: 1 });
    expect(runner.isRecordCleanupBuilding, "#3").toBe(false);
  });
  test("no object: the record is kept; the object is disposed also when the clean-up throws; a skipped answer is copied back", () => {
    const { owner, runner } = create([]);
    const record = { a: 1 };
    owner.createObject = (): IRecordCleanupObject => undefined;
    expect(runner.cleanRecordWithObject(0, record, (): void => { }), "#1: the same record").toBe(record);
    let disposed = 0;
    owner.createObject = (): IRecordCleanupObject => createObject({}, { onDispose: (): void => { disposed++; } });
    expect(() => runner.cleanRecordWithObject(0, record, (): void => { throw new Error("clean"); }), "#2").toThrow("clean");
    expect(disposed, "#3").toBe(1);
    expect(runner.isRecordCleanupBuilding || runner.getRecordCleanupCopy(<any>{}, true) !== undefined, "#4: the scope ended").toBe(false);
    const item: any = {};
    owner.templates = [new FakeTemplate("file")];
    owner.skipped = ["file"];
    owner.createObject = (): IRecordCleanupObject => createObject(item, { clean: (): void => { runner.writeRecordCleanupCopy(item, false, "file", undefined); } });
    expect(runner.cleanRecordWithObject(0, { file: "f", a: 1 }, (o: IRecordCleanupObject): void => o.clearIncorrectValues()), "#5")
      .toEqual({ file: "f", a: 1 });
  });
});

describe("RecordCleanupRunner: the walk over the records without an object", () => {
  test("clearIncorrectValues cleans each record without an object, builds the JSON once per walk, and writes in one batch", () => {
    const { owner, runner } = create([{ a: 1 }, { a: 2 }, { a: 3 }]);
    owner.items[1] = {};
    let builds = 0;
    const jsons: Array<any> = [];
    owner.createObject = (index: number): IRecordCleanupObject => {
      const json = runner.getRecordCleanupJson((): any => { builds++; return { elements: [] }; });
      jsons.push(json);
      const item: any = {};
      return createObject(item, { clean: (): void => { runner.writeRecordCleanupCopy(item, false, "a", index * 10); } });
    };
    runner.clearIncorrectValuesWithoutObjects();
    expect(owner.built, "#1: the record with an object is not built").toEqual([0, 2]);
    expect(builds, "#2: one JSON per walk").toBe(1);
    expect(jsons[0] === jsons[1], "#3: parsed for each object").toBe(false);
    expect(jsons[1], "#4").toEqual({ elements: [] });
    expect(owner.writes, "#5").toEqual([[{ index: 0, record: { a: 0 } }, { index: 2, record: { a: 20 } }]]);
    runner.getRecordCleanupJson((): any => { builds++; return {}; });
    runner.getRecordCleanupJson((): any => { builds++; return {}; });
    expect(builds, "#6: outside a walk it is made each time").toBe(3);
  });
  test("a record a handler replaced during the walk is not written; nothing runs without in-memory paging or for a source", () => {
    const { owner, runner } = create([{ a: 1 }, { a: 2 }]);
    owner.createObject = (index: number): IRecordCleanupObject => {
      if (index === 1) owner.records[0] = { a: "replaced" };
      const item: any = {};
      return createObject(item, { clean: (): void => { runner.writeRecordCleanupCopy(item, false, "a", "cleaned"); } });
    };
    runner.clearIncorrectValuesWithoutObjects();
    expect(owner.records, "#1").toEqual([{ a: "replaced" }, { a: "cleaned" }]);
    owner.built = [];
    owner.isPagedByList = false;
    runner.clearIncorrectValuesWithoutObjects();
    owner.isPagedByList = true;
    owner.isRemoteData = true;
    runner.clearIncorrectValuesWithoutObjects();
    expect(owner.built, "#2").toEqual([]);
  });
  test("the completion clean-up covers every record without an object and builds an object only for an answer it cannot judge", () => {
    const records: Array<any> = [];
    for (let i = 0; i < 6; i++) records.push({ q1: i % 2 === 0 ? "bad" : "good", q2: "x" + i, "q2-Comment": "c" + i, skipped: "s" });
    const { owner, runner } = create(records);
    owner.items[0] = {};
    owner.skipped = ["skipped"];
    const container: any = { questions: [new FakeTemplate("q1", (value: any): "clear" | "keep" => value === "bad" ? "clear" : "keep"),
      new FakeTemplate("q2", (value: any): undefined => value === "x3" ? undefined : <any>"keep"), new FakeTemplate("skipped", (): "clear" => "clear")] };
    owner.createObject = (index: number): IRecordCleanupObject => {
      const item: any = {};
      return createObject(item, { clean: (): void => {
        runner.writeRecordCleanupCopy(item, false, "q2", undefined);
        runner.writeRecordCleanupCopy(item, false, "q1", "from the object");
      } });
    };
    runner.cleanRecordsWithoutObjectsAtComplete(container, (o: IRecordCleanupObject): void => o.clearValueIfInvisible("onComplete"));
    expect(owner.built, "#1: an object only for the answer only a built question can tell").toEqual([3]);
    expect(owner.records[0], "#2: the record with an object is left to it").toEqual(records[0]);
    expect(owner.records[2], "#3: judged over its stored answer; a skipped question keeps its answer")
      .toEqual({ q2: "x2", "q2-Comment": "c2", skipped: "s" });
    expect(owner.records[3], "#4: only the keys of the question the object judged are taken from it")
      .toEqual({ q1: "good", "q2-Comment": "c3", skipped: "s" });
    expect(owner.records[5], "#5: the last record, as every other").toEqual({ q1: "good", q2: "x5", "q2-Comment": "c5", skipped: "s" });
    expect(owner.records[4], "#6").toEqual({ q2: "x4", "q2-Comment": "c4", skipped: "s" });
  });
});
