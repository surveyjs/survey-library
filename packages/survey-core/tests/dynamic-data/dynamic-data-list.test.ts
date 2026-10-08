import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { FunctionFactory } from "../../src/functionsfactory";
import {
  IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataReadRequest,
  IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

class Deferred {
  public promise: Promise<any>;
  public resolve: (value?: any) => void;
  public reject: (error?: any) => void;
  constructor() {
    this.promise = new Promise<any>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
// Lets the queued microtasks run; no timers are involved anywhere in the list.
async function flush(times: number = 10): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}
function createList(records: Array<any>, owner?: IDynamicDataOwner): DynamicDataList {
  const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records), owner);
  list.load();
  return list;
}
function createRecords(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: i, name: "r" + i });
  }
  return res;
}
function changeToString(change: IDynamicDataListChange): string {
  switch(change.type) {
    case "recordChanged": return "recordChanged:" + change.index + ":" + change.field;
    case "recordAdded": return "recordAdded:" + change.index;
    case "recordRemoved": return "recordRemoved:" + change.index;
    case "recordMoved": return "recordMoved:" + change.from + ">" + change.to;
    case "loading": return "loading:" + change.isLoading;
  }
  return change.type;
}
function recordChanges(list: DynamicDataList): Array<string> {
  const res: Array<string> = [];
  list.onChanged = (change: IDynamicDataListChange): void => { res.push(changeToString(change)); };
  return res;
}

/* The position of the record whose id is key. The sources below that write are keyed by "id" (a
   source without keyField is read-only) and look their records up by it; the records of
   createRecords() and tableRecords() have the id of their first position. */
function indexOfId(records: Array<any>, key: any): number {
  for (let i = 0; i < records.length; i++) {
    if (!!records[i] && records[i].id === key) return i;
  }
  return -1;
}
// A source that pages itself. It is synchronous, so the list stays synchronous with it.
class FakeRangeSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public keyField: string = "id";
  public rangeCalls: Array<{ skip: number, take: number }> = [];
  public ops: Array<string> = [];
  constructor(public records: Array<any>) { }
  public requests: Array<IDynamicDataReadRequest> = [];
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.requests.push(request);
    this.rangeCalls.push({ skip: request.skip, take: request.take });
    const count = request.take > 0 ? request.take : this.records.length;
    return { records: this.records.slice(request.skip, request.skip + count), total: this.records.length };
  }
  public update(key: any, record: any, changedFields: Array<string>): void {
    this.ops.push("update:" + key + ":" + changedFields.join(","));
    const at = indexOfId(this.records, key);
    if (at > -1)this.records[at] = record;
  }
  public insert(record: any, sourceIndex: number): any {
    this.ops.push("insert:" + sourceIndex);
    const stored = Object.assign({ id: 1000 + this.ops.length }, record);
    this.records.splice(sourceIndex, 0, stored);
    return Object.assign({}, stored);
  }
  public remove(key: any): void {
    this.ops.push("remove:" + key);
    const at = indexOfId(this.records, key);
    if (at > -1)this.records.splice(at, 1);
  }
  public move(key: any, toSourceIndex: number): void {
    this.ops.push("move:" + key + ">" + toSourceIndex);
    const at = indexOfId(this.records, key);
    if (at < 0) return;
    const record = this.records[at];
    this.records.splice(at, 1);
    this.records.splice(toSourceIndex, 0, record);
  }
}
// The same, reading on demand through deferreds.
class FakeAsyncRangeSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public keyField: string = "id";
  public pendingReads: Array<Deferred> = [];
  public rangeCalls: Array<{ skip: number, take: number }> = [];
  public ops: Array<string> = [];
  constructor(public records: Array<any>) { }
  public requests: Array<IDynamicDataReadRequest> = [];
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    this.requests.push(request);
    this.rangeCalls.push({ skip: request.skip, take: request.take });
    const deferred = new Deferred();
    this.pendingReads.push(deferred);
    return deferred.promise;
  }
  public update(key: any, record: any): void {
    this.ops.push("update:" + key);
  }
  public resolveRead(index: number): void {
    const call = this.rangeCalls[index];
    const count = call.take > 0 ? call.take : this.records.length;
    this.pendingReads[index].resolve({
      records: this.records.slice(call.skip, call.skip + count),
      total: this.records.length
    });
  }
}
// A source that reads synchronously and writes asynchronously.
class FakeAsyncWriteSource implements IDynamicDataSource {
  public keyField: string = "id";
  public readCalls: number = 0;
  public ops: Array<string> = [];
  public pendingWrites: Array<Deferred> = [];
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    this.readCalls++;
    return this.records;
  }
  public update(key: any, record: any, changedFields: Array<string>): Promise<void> {
    this.ops.push("update:" + key + ":" + changedFields.join(","));
    const deferred = new Deferred();
    this.pendingWrites.push(deferred);
    // The write reaches the storage when it is acknowledged, as a server write would.
    return deferred.promise.then((): void => {
      const at = indexOfId(this.records, key);
      if (at > -1)this.records[at] = record;
    });
  }
}
// A source that reads on demand.
class FakeAsyncSource implements IDynamicDataSource {
  public pendingReads: Array<Deferred> = [];
  public read(): Promise<Array<any>> {
    const deferred = new Deferred();
    this.pendingReads.push(deferred);
    return deferred.promise;
  }
}
/* A source that pages, and therefore filters and sorts, itself: the list must do none of the three
   locally. It answers every request from the records it holds, applying the view it was given, and
   keeps every request it was asked. */
class FakeServerViewSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public requests: Array<IDynamicDataReadRequest> = [];
  constructor(public records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.requests.push(request);
    let view = this.records.slice();
    // A toy server: it understands "{field} > number" and nothing else.
    const parts = /^\{(\w+)\}\s*>\s*(\d+)$/.exec(request.filter || "");
    if (!!parts) {
      view = view.filter((record: any): boolean => record[parts[1]] > Number(parts[2]));
    }
    (request.sort || []).slice().reverse().forEach((s: any): void => {
      const sign = s.direction === "desc" ? -1 : 1;
      view.sort((a: any, b: any): number => (a[s.field] === b[s.field] ? 0 : (a[s.field] < b[s.field] ? -1 : 1)) * sign);
    });
    const size = request.take > 0 ? request.take : view.length;
    return { records: view.slice(request.skip, request.skip + size), total: view.length };
  }
  public get rangeCalls(): number {
    return this.requests.length;
  }
}
/* A source that names its records by "id" and assigns the key of a new record, as a server does.
   Reads and writes are synchronous; with holdInserts an insert answers through a promise
   that releaseInserts() settles. Every write records its operation in ops and what it received in
   payloads. */
class FakeKeyedSource implements IDynamicDataSource {
  public keyField: string = "id";
  public ops: Array<string> = [];
  public payloads: Array<any> = [];
  // Fields the server fills in where the insert payload does not carry them.
  public insertDefaults: any = undefined;
  public holdInserts: boolean = false;
  private heldInserts: Array<() => void> = [];
  private nextKey: number = 1000;
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    return this.records.map((record: any): any => Object.assign({}, record));
  }
  public insert(record: any, sourceIndex: number): any {
    this.ops.push("insert:" + sourceIndex);
    this.payloads.push(Object.assign({}, record));
    const stored = Object.assign({}, this.insertDefaults, record);
    stored.id = this.nextKey++;
    const run = (): any => {
      this.records.splice(sourceIndex, 0, stored);
      return Object.assign({}, stored);
    };
    if (!this.holdInserts) return run();
    return new Promise((resolve: (value: any) => void): void => {
      this.heldInserts.push((): void => resolve(run()));
    });
  }
  public releaseInserts(): void {
    const held = this.heldInserts;
    this.heldInserts = [];
    held.forEach((release: () => void): void => release());
  }
  public update(key: any, record: any): void {
    this.ops.push("update:" + key);
    this.payloads.push(Object.assign({}, record));
    const at = this.indexOfKey(key);
    if (at > -1)this.records[at] = Object.assign({}, record);
  }
  public remove(key: any): void {
    this.ops.push("remove:" + key);
    this.payloads.push(key);
    const at = this.indexOfKey(key);
    if (at > -1)this.records.splice(at, 1);
  }
  public move(key: any, toSourceIndex: number): void {
    this.ops.push("move:" + key + ">" + toSourceIndex);
    this.payloads.push([key, toSourceIndex]);
    const at = this.indexOfKey(key);
    if (at < 0) return;
    const record = this.records[at];
    this.records.splice(at, 1);
    this.records.splice(toSourceIndex, 0, record);
  }
  private indexOfKey(key: any): number {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === key) return i;
    }
    return -1;
  }
}
class TestOwner implements IDynamicDataOwner {
  public changes: Array<string> = [];
  constructor(public fields: Array<IDynamicDataField> = []) { }
  public getFields(): Array<IDynamicDataField> {
    return this.fields;
  }
  public onDataListChanged(change: IDynamicDataListChange): void {
    this.changes.push(changeToString(change));
  }
}

describe("DynamicDataList: counts", () => {
  test("an array source is loaded synchronously", () => {
    const list = createList(createRecords(3));
    expect(list.isLoading).toBe(false);
    expect(list.count).toBe(3);
    expect(list.loadedCount).toBe(3);
    expect(list.getCreatedIndexes().length).toBe(3);
    expect(list.visibleCount).toBe(3);
    expect(list.windowOffset).toBe(0);
    expect(list.getRecord(1).name).toBe("r1");
  });
  test("nothing is loaded before load()", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(3)));
    expect(list.count).toBe(0);
    expect(list.getRecord(0)).toBe(undefined);
  });
  test("a filter does not change count, but changes the created and the visible count", () => {
    const list = createList(createRecords(5));
    list.filter = "{id} > 2";
    expect(list.count).toBe(5);
    expect(list.loadedCount).toBe(5);
    expect(list.getCreatedIndexes().length).toBe(2);
    expect(list.visibleCount).toBe(2);
  });
  test("visibleCount is unpaged and drops the owner-hidden records", () => {
    const list = createList(createRecords(10));
    list.pageSize = 3;
    list.setRecordVisible(0, false);
    expect(list.count).toBe(10);
    expect(list.getCreatedIndexes().length).toBe(10);
    expect(list.visibleCount).toBe(9);
    expect(list.getPageIndexes().length).toBe(3);
  });
  test("getRecord and getValue are out-of-range safe", () => {
    const list = createList(createRecords(2));
    expect(list.getRecord(-1)).toBe(undefined);
    expect(list.getRecord(2)).toBe(undefined);
    expect(list.getValue(5, "name")).toBe(undefined);
    expect(list.getValue(0, "unknown")).toBe(undefined);
  });
});

describe("DynamicDataList: values", () => {
  test("setValue writes the field and returns true", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(2));
    const list = new DynamicDataList(source);
    list.load();
    expect(list.setValue(0, "name", "changed")).toBe(true);
    expect(list.getValue(0, "name")).toBe("changed");
    expect(source.array[0].name).toBe("changed");
  });
  test("setValue returns false when the value did not change", () => {
    const list = createList(createRecords(2));
    expect(list.setValue(0, "name", "r0")).toBe(false);
    expect(list.setValue(5, "name", "x")).toBe(false);
  });
  test("setValue deletes the key when the value is empty", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1, b: 2 }]);
    const list = new DynamicDataList(source);
    list.load();
    expect(list.setValue(0, "a", "")).toBe(true);
    expect(Object.keys(source.array[0])).toEqual(["b"]);
  });
  test("setValue with an empty value over a missing key changes nothing", () => {
    const list = createList([{ a: 1 }]);
    expect(list.setValue(0, "b", "")).toBe(false);
    expect(list.setValue(0, "b", undefined)).toBe(false);
  });
  test("setValue never mutates the array or the record the source handed out", () => {
    const records = [{ a: 1 }];
    const source = ArrayDynamicDataSource.fromArray(records);
    const list = new DynamicDataList(source);
    list.load();
    const oldArray = source.array;
    const oldRecord = source.array[0];
    list.setValue(0, "a", 2);
    expect(source.array).not.toBe(oldArray);
    expect(source.array[0]).not.toBe(oldRecord);
    expect(oldRecord.a).toBe(1);
  });
  test("setRecord replaces the whole record", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1, b: 2 }]);
    const list = new DynamicDataList(source);
    list.load();
    expect(list.setRecord(0, { a: 1, c: 3 })).toBe(true);
    expect(source.array[0]).toEqual({ a: 1, c: 3 });
    expect(list.setRecord(0, { a: 1, c: 3 })).toBe(false);
    expect(list.setRecord(7, { a: 1 })).toBe(false);
  });
  test("isValueChanged is the comparison the questions use", () => {
    expect(DynamicDataList.isValueChanged("a", "A")).toBe(true);
    expect(DynamicDataList.isValueChanged("a", "a")).toBe(false);
    expect(DynamicDataList.isValueChanged(undefined, "")).toBe(false);
    expect(DynamicDataList.isValueChanged(0, undefined)).toBe(true);
  });
});

describe("DynamicDataList: add, remove, move", () => {
  test("add appends by default and returns the record index", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(2));
    const list = new DynamicDataList(source);
    list.load();
    expect(list.add({ id: 9 })).toBe(2);
    expect(list.count).toBe(3);
    expect(source.array[2].id).toBe(9);
  });
  test("add at an index inserts and clamps", () => {
    const list = createList(createRecords(2));
    expect(list.add({ id: 9 }, 0)).toBe(0);
    expect(list.add({ id: 8 }, 100)).toBe(3);
    expect(list.add({ id: 7 }, -3)).toBe(0);
    expect(list.getVisibleIndexes().map((i: number) => list.getValue(i, "id"))).toEqual([7, 9, 0, 1, 8]);
  });
  test("add without a record adds an empty one", () => {
    const list = createList([]);
    list.add();
    expect(list.getRecord(0)).toEqual({});
  });
  test("remove deletes the record and is out-of-range safe", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(3));
    const list = new DynamicDataList(source);
    list.load();
    list.remove(1);
    expect(list.count).toBe(2);
    expect(source.array.map((r: any) => r.id)).toEqual([0, 2]);
    list.remove(5);
    list.remove(-1);
    expect(list.count).toBe(2);
  });
  test("move reorders the records and is out-of-range safe", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(3));
    const list = new DynamicDataList(source);
    list.load();
    list.move(0, 2);
    expect(source.array.map((r: any) => r.id)).toEqual([1, 2, 0]);
    list.move(0, 5);
    list.move(1, 1);
    expect(source.array.map((r: any) => r.id)).toEqual([1, 2, 0]);
  });
  test("ensureCount pads the window", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(1));
    const list = new DynamicDataList(source);
    list.load();
    list.ensureCount(3);
    expect(list.count).toBe(3);
    expect(source.array.length).toBe(3);
    list.ensureCount(2);
    expect(list.count).toBe(3);
  });
  test("ensureCount uses the record factory", () => {
    const list = createList([]);
    list.ensureCount(2, (i: number) => ({ id: i * 10 }));
    expect(list.getValue(0, "id")).toBe(0);
    expect(list.getValue(1, "id")).toBe(10);
  });
  test("truncate removes the records above the count", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(4));
    const list = new DynamicDataList(source);
    list.load();
    list.truncate(2);
    expect(list.count).toBe(2);
    expect(source.array.map((r: any) => r.id)).toEqual([0, 1]);
    list.truncate(5);
    expect(list.count).toBe(2);
    list.truncate(0);
    expect(list.count).toBe(0);
  });
  test("ensureCount and truncate throw when the window is not the whole storage", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    expect(list.count).toBe(5);
    expect(list.loadedCount).toBe(2);
    expect(() => list.ensureCount(6)).toThrow();
    expect(() => list.truncate(1)).toThrow();
  });
});

describe("DynamicDataList: visibility", () => {
  test("owner visibility removes a record from the visible order", () => {
    const list = createList(createRecords(4));
    list.setRecordVisible(1, false);
    expect(list.isRecordVisible(1)).toBe(false);
    expect(list.isRecordVisible(0)).toBe(true);
    expect(list.getVisibleIndexes()).toEqual([0, 2, 3]);
    expect(list.visibleCount).toBe(3);
    expect(list.count).toBe(4);
  });
  test("setRecordVisible is out-of-range safe and idempotent", () => {
    const list = createList(createRecords(2));
    list.setRecordVisible(5, false);
    list.setRecordVisible(-1, false);
    expect(list.visibleCount).toBe(2);
    list.setRecordVisible(0, false);
    list.setRecordVisible(0, false);
    list.setRecordVisible(0, true);
    expect(list.visibleCount).toBe(2);
    expect(list.isRecordVisible(7)).toBe(false);
  });
  test("a visibility flag belongs to a record and survives add", () => {
    const list = createList(createRecords(3));
    list.setRecordVisible(2, false);
    list.add({ id: 9 }, 0);
    expect(list.isRecordVisible(3)).toBe(false);
    expect(list.isRecordVisible(0)).toBe(true);
    expect(list.visibleCount).toBe(3);
  });
  test("a visibility flag survives remove", () => {
    const list = createList(createRecords(3));
    list.setRecordVisible(2, false);
    list.remove(0);
    expect(list.isRecordVisible(1)).toBe(false);
    expect(list.visibleCount).toBe(1);
  });
  test("removing a hidden record restores the visible count", () => {
    const list = createList(createRecords(3));
    list.setRecordVisible(1, false);
    list.remove(1);
    expect(list.visibleCount).toBe(2);
    expect(list.isRecordVisible(1)).toBe(true);
  });
  test("a visibility flag travels with a moved record", () => {
    const list = createList(createRecords(3));
    list.setRecordVisible(0, false);
    list.move(0, 2);
    expect(list.isRecordVisible(2)).toBe(false);
    expect(list.getVisibleIndexes()).toEqual([0, 1]);
  });
  test("a reload clears the visibility flags", () => {
    const list = createList(createRecords(3));
    list.setRecordVisible(0, false);
    list.load();
    expect(list.visibleCount).toBe(3);
  });
});

describe("DynamicDataList: index conversions", () => {
  test("the identity arrays are cached until something changes", () => {
    const list = createList(createRecords(3));
    const visible = list.getVisibleIndexes();
    expect(list.getVisibleIndexes()).toBe(visible);
    expect(list.getPageIndexes()).toBe(visible);
    expect(visible).toEqual([0, 1, 2]);
    // A value change cannot reorder an unfiltered, unsorted view: the instance survives.
    list.setValue(0, "name", "changed");
    expect(list.getVisibleIndexes()).toBe(visible);
    list.add({ id: 9 });
    expect(list.getVisibleIndexes()).not.toBe(visible);
  });
  test("a value change invalidates the cached view when a filter is active", () => {
    const list = createList(createRecords(3));
    list.filter = "{name} notempty";
    const visible = list.getVisibleIndexes();
    expect(list.getVisibleIndexes()).toBe(visible);
    list.setValue(0, "name", "");
    expect(list.getVisibleIndexes()).not.toBe(visible);
    expect(list.getVisibleIndexes()).toEqual([1, 2]);
  });
  test("the materialized positions are cached with the page they describe", () => {
    const list = createList(createRecords(5));
    list.pageSize = 2;
    const positions = list.getMaterializedPositions();
    expect(list.getMaterializedPositions()).toBe(positions);
    expect(positions).toEqual({ 0: 0, 1: 1 });
    expect(list.indexToMaterializedIndex(1)).toBe(1);
    expect(list.indexToMaterializedIndex(2)).toBe(-1);
    list.pageIndex = 1;
    const nextPositions = list.getMaterializedPositions();
    expect(nextPositions).not.toBe(positions);
    expect(nextPositions).toEqual({ 2: 0, 3: 1 });
    expect(list.indexToMaterializedIndex(3)).toBe(1);
    expect(list.indexToMaterializedIndex(0)).toBe(-1);
  });
});

describe("DynamicDataList: local filter, sort and paging", () => {
  test("filter, sort and paging combine", () => {
    const list = createList(createRecords(10));
    list.filter = "{id} > 2";
    list.sort = [{ field: "id", direction: "desc" }];
    list.pageSize = 3;
    expect(list.getCreatedIndexes().length).toBe(7);
    expect(list.visibleCount).toBe(7);
    expect(list.pageCount).toBe(3);
    expect(list.getPageIndexes()).toEqual([9, 8, 7]);
    list.pageIndex = 2;
    expect(list.getPageIndexes()).toEqual([3]);
  });
  test("pageCount excludes the owner-hidden records", () => {
    const list = createList(createRecords(10));
    list.pageSize = 3;
    expect(list.pageCount).toBe(4);
    list.setRecordVisible(0, false);
    expect(list.pageCount).toBe(3);
    expect(list.getPageIndexes()).toEqual([1, 2, 3]);
  });
  test("pageIndex is clamped", () => {
    const list = createList(createRecords(5));
    list.pageSize = 2;
    list.pageIndex = 99;
    expect(list.pageIndex).toBe(2);
    list.pageIndex = -5;
    expect(list.pageIndex).toBe(0);
  });
  test("pageSize 0 means no paging", () => {
    const list = createList(createRecords(5));
    expect(list.pageSize).toBe(0);
    expect(list.pageCount).toBe(1);
    expect(list.getPageIndexes().length).toBe(5);
    list.pageSize = 2;
    list.pageSize = 0;
    expect(list.getPageIndexes().length).toBe(5);
  });
  test("changing the filter resets pageIndex", () => {
    const list = createList(createRecords(10));
    list.pageSize = 3;
    list.pageIndex = 2;
    expect(list.pageIndex).toBe(2);
    list.filter = "{id} > 0";
    expect(list.pageIndex).toBe(0);
  });
  test("changing the sort keeps pageIndex", () => {
    const list = createList(createRecords(10));
    list.pageSize = 3;
    list.pageIndex = 2;
    list.sort = [{ field: "id", direction: "desc" }];
    expect(list.pageIndex).toBe(2);
  });
  test("an empty filter and sort reset the view", () => {
    const list = createList(createRecords(4));
    list.filter = "{id} > 2";
    expect(list.visibleCount).toBe(1);
    list.filter = "";
    expect(list.visibleCount).toBe(4);
    list.sort = [{ field: "id", direction: "desc" }];
    expect(list.getVisibleIndexes()).toEqual([3, 2, 1, 0]);
    list.sort = [];
    expect(list.getVisibleIndexes()).toEqual([0, 1, 2, 3]);
  });
  test("the filter expression can use every operator of the expression language", () => {
    const list = createList([
      { name: "Ann", tags: ["a", "b"] },
      { name: "Bob", tags: ["b"] },
      { name: "Cid", tags: [] }
    ]);
    list.filter = "{tags} anyof ['a'] or {name} = 'Cid'";
    expect(list.getVisibleIndexes()).toEqual([0, 2]);
    list.filter = "{name} contains 'o'";
    expect(list.getVisibleIndexes()).toEqual([1]);
  });
  test("a filter expression that cannot be parsed reports onError and leaves the list unfiltered", () => {
    const list = createList(createRecords(3));
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.filter = "{id} >";
    // "read": the filter made the read of the view impossible, and "filter" is not an operation of
    // the source contract any more.
    expect(errors).toEqual(["read"]);
    expect(list.filter).toBe("");
    expect(list.visibleCount).toBe(3);
  });
  test("setting the filter twice re-parses it", () => {
    const list = createList(createRecords(4));
    list.filter = "{id} > 2";
    expect(list.visibleCount).toBe(1);
    list.filter = "{id} > 0";
    expect(list.visibleCount).toBe(3);
  });
  test("the owner fields drive the local sort", () => {
    const owner = new TestOwner([{ name: "v", dataType: "number" }]);
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray([{ v: "10" }, { v: "9" }]), owner);
    list.load();
    list.sort = [{ field: "v", direction: "asc" }];
    expect(list.getVisibleIndexes()).toEqual([1, 0]);
  });
  test("the owner receives every change", () => {
    const owner = new TestOwner();
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(2)), owner);
    list.load();
    list.add({ id: 9 });
    list.setValue(0, "name", "changed");
    expect(owner.changes).toEqual(["reset", "recordAdded:2", "recordChanged:0:name"]);
  });
});

describe("DynamicDataList: a source that pages itself", () => {
  test("the list reads one page and never the whole storage", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    expect(source.rangeCalls).toEqual([{ skip: 0, take: 2 }]);
    expect(list.count).toBe(5);
    expect(list.loadedCount).toBe(2);
    expect(list.pageCount).toBe(3);
    expect(list.windowOffset).toBe(0);
  });
  test("a page change reads the next window and commits its offset", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    expect(source.rangeCalls[1]).toEqual({ skip: 2, take: 2 });
    expect(list.windowOffset).toBe(2);
    expect(list.getValue(0, "id")).toBe(2);
    expect(list.getPageIndexes()).toEqual([0, 1]);
    list.pageIndex = 2;
    expect(list.windowOffset).toBe(4);
    expect(list.loadedCount).toBe(1);
  });
  test("pageSize 0 asks the source for everything", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.load();
    expect(source.rangeCalls).toEqual([{ skip: 0, take: 0 }]);
    expect(list.loadedCount).toBe(5);
  });
  test("a sort goes into the read request: the window is not sorted locally", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.pageSize = 3;
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    // A source that pages sorts itself, so the window is taken in the order it arrived in. Sorting
    // one page locally was the old behaviour and it could only ever reorder that page.
    expect(source.requests[source.requests.length - 1].sort).toEqual([{ field: "id", direction: "desc" }]);
    expect(list.getVisibleIndexes()).toEqual([0, 1, 2]);
    expect(list.getPageIndexes()).toEqual([0, 1, 2]);
  });
  test("an edit names its record by key; an insert passes the window offset plus the record index", () => {
    const source = new FakeRangeSource(createRecords(6));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    list.setValue(0, "name", "changed");
    expect(source.ops).toEqual(["update:2:name"]);
    list.add({ id: 99 }, 1);
    expect(source.ops[1]).toBe("insert:3");
    list.remove(0);
    expect(source.ops[2]).toBe("remove:2");
    // The new record took the key the source assigned it, and a move targets a position.
    list.move(0, 1);
    expect(source.ops[3]).toBe("move:1002>3");
  });
  test("refresh re-reads the current window, load re-reads the requested page", () => {
    const source = new FakeRangeSource(createRecords(6));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 2;
    expect(list.windowOffset).toBe(4);
    list.refresh();
    expect(source.rangeCalls[source.rangeCalls.length - 1]).toEqual({ skip: 4, take: 2 });
  });
});

describe("DynamicDataList: a source that filters and sorts itself", () => {
  test("the filter travels inside the read request instead of being run locally", () => {
    const source = new FakeServerViewSource(createRecords(4));
    const list = new DynamicDataList(source);
    list.load();
    expect(source.rangeCalls).toBe(1);
    list.filter = "{id} > 2";
    // One request, with the expression text untouched: the source translates it into its dialect.
    expect(source.rangeCalls).toBe(2);
    expect(source.requests[1].filter).toBe("{id} > 2");
    // The window is taken as it came: nothing is filtered out locally.
    expect(list.loadedCount).toBe(1);
    expect(list.visibleCount).toBe(1);
    // A source that filters itself answers the storage count: it is what the filtered range says.
    expect(list.count).toBe(1);
    expect(list.getVisibleIndexes()).toEqual([0]);
  });
  test("an expression a source cannot run locally still reaches it untouched", () => {
    const source = new FakeServerViewSource(createRecords(2));
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.load();
    // The list never parses it: whether the source understands it is the source's business.
    list.filter = "{id} someServerOperator 5";
    expect(source.requests[1].filter).toBe("{id} someServerOperator 5");
    expect(errors).toEqual([]);
    expect(list.filter).toBe("{id} someServerOperator 5");
  });
  test("the same for the sort", () => {
    const source = new FakeServerViewSource(createRecords(3));
    const list = new DynamicDataList(source);
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(source.rangeCalls).toBe(2);
    expect(source.requests[1].sort).toEqual([{ field: "id", direction: "desc" }]);
    // The server sorted; the list left the window in the order it arrived in.
    expect(list.getVisibleIndexes()).toEqual([0, 1, 2]);
    expect(list.getRecord(0).id).toBe(2);
  });
  test("a source without paging gets both locally", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(4));
    const list = new DynamicDataList(source);
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(list.getVisibleIndexes()).toEqual([3, 2, 1, 0]);
    list.filter = "{id} > 1";
    expect(list.getVisibleIndexes()).toEqual([3, 2]);
    expect(list.getCreatedIndexes().length).toBe(2);
  });
});

describe("DynamicDataList: write-through and the push chain", () => {
  test("every editing method is pushed to the source", () => {
    const source = new FakeRangeSource(createRecords(3));
    const list = new DynamicDataList(source);
    list.load();
    list.setValue(0, "name", "changed");
    list.add({ id: 9 }, 1);
    list.remove(0);
    list.move(0, 1);
    expect(source.ops).toEqual(["update:0:name", "insert:1", "remove:0", "move:1002>1"]);
  });
  test("a read-only source keeps the edit in the window", () => {
    const source = new FakeAsyncSource();
    const list = new DynamicDataList(source);
    list.load();
    source.pendingReads[0].resolve([{ a: 1 }]);
    return flush().then(() => {
      expect(list.setValue(0, "a", 2)).toBe(true);
      expect(list.getValue(0, "a")).toBe(2);
      expect(list.hasPendingWrites).toBe(false);
    });
  });
  test("two writes on one record reach the source in order", async () => {
    const source = new FakeAsyncWriteSource([{ id: 0, a: 1 }]);
    const list = new DynamicDataList(source);
    list.load();
    list.setValue(0, "a", 2);
    list.setValue(0, "b", 3);
    expect(list.hasPendingWrites).toBe(true);
    // The second push only starts when the first one settles.
    expect(source.ops).toEqual(["update:0:a"]);
    source.pendingWrites[0].resolve();
    await flush();
    expect(source.ops).toEqual(["update:0:a", "update:0:b"]);
    source.pendingWrites[1].resolve();
    await flush();
    expect(list.hasPendingWrites).toBe(false);
    expect(source.records[0]).toEqual({ id: 0, a: 2, b: 3 });
  });
  test("a rejected push reports onError, keeps the local value and continues the chain", async () => {
    const source = new FakeAsyncWriteSource([{ id: 0, a: 1 }]);
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation + ":" + error); };
    list.load();
    list.setValue(0, "a", 2);
    list.setValue(0, "b", 3);
    source.pendingWrites[0].reject("failed");
    await flush();
    expect(errors).toEqual(["update:failed"]);
    expect(list.getValue(0, "a")).toBe(2);
    expect(source.ops).toEqual(["update:0:a", "update:0:b"]);
    source.pendingWrites[1].resolve();
    await flush();
    expect(list.hasPendingWrites).toBe(false);
  });
  test("a read is deferred until the pending writes settle and does not overwrite the edit", async () => {
    const source = new FakeAsyncWriteSource([{ id: 0, a: 1 }]);
    const list = new DynamicDataList(source);
    list.load();
    expect(source.readCalls).toBe(1);
    list.setValue(0, "a", 2);
    list.refresh();
    // The read has not been issued: it would read the storage the write has not reached yet.
    expect(source.readCalls).toBe(1);
    expect(list.getValue(0, "a")).toBe(2);
    source.pendingWrites[0].resolve();
    await flush();
    expect(source.readCalls).toBe(2);
    expect(list.getValue(0, "a")).toBe(2);
  });
  test("an edit during a pending page read pushes with the offset of the window it was made in", async () => {
    const source = new FakeAsyncRangeSource(createRecords(6));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    source.resolveRead(0);
    await flush();
    expect(list.windowOffset).toBe(0);
    list.pageIndex = 1;
    // The read for page 2 is in flight: the previous window and its offset are still in force.
    expect(list.windowOffset).toBe(0);
    list.setValue(0, "name", "changed");
    expect(source.ops).toEqual(["update:0"]);
    source.resolveRead(1);
    await flush();
    expect(list.windowOffset).toBe(2);
  });
  test("an edit after a rejected read pushes with the offset of the window that stayed", async () => {
    const source = new FakeAsyncRangeSource(createRecords(6));
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.pageSize = 2;
    list.load();
    source.resolveRead(0);
    await flush();
    list.pageIndex = 1;
    source.pendingReads[1].reject("no connection");
    await flush();
    expect(errors).toEqual(["read"]);
    expect(list.windowOffset).toBe(0);
    expect(list.loadedCount).toBe(2);
    list.setValue(0, "name", "changed");
    expect(source.ops).toEqual(["update:0"]);
  });
});

describe("DynamicDataList: asynchronous reading", () => {
  test("isLoading and the change sequence", async () => {
    const source = new FakeAsyncSource();
    const list = new DynamicDataList(source);
    const changes = recordChanges(list);
    list.load();
    expect(list.isLoading).toBe(true);
    expect(changes).toEqual(["loading:true"]);
    source.pendingReads[0].resolve(createRecords(2));
    await flush();
    expect(list.isLoading).toBe(false);
    expect(changes).toEqual(["loading:true", "reset", "loading:false"]);
    expect(list.count).toBe(2);
  });
  test("a superseded read is discarded when it arrives", async () => {
    const source = new FakeAsyncSource();
    const list = new DynamicDataList(source);
    list.load();
    list.load();
    expect(source.pendingReads.length).toBe(2);
    source.pendingReads[1].resolve([{ id: "second" }]);
    await flush();
    source.pendingReads[0].resolve([{ id: "first" }, { id: "first" }]);
    await flush();
    expect(list.count).toBe(1);
    expect(list.getValue(0, "id")).toBe("second");
    expect(list.isLoading).toBe(false);
  });
  test("a rejected read keeps the previous window", async () => {
    const source = new FakeAsyncSource();
    const list = new DynamicDataList(source);
    const errors: Array<any> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation + ":" + error); };
    list.load();
    source.pendingReads[0].resolve(createRecords(2));
    await flush();
    list.load();
    source.pendingReads[1].reject("network");
    await flush();
    expect(errors).toEqual(["read:network"]);
    expect(list.count).toBe(2);
    expect(list.isLoading).toBe(false);
  });
  test("a read that throws synchronously is reported", () => {
    const source: IDynamicDataSource = {
      read: (): Array<any> => { throw new Error("boom"); }
    };
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.load();
    expect(errors).toEqual(["read"]);
    expect(list.count).toBe(0);
  });
  test("the window stays readable and writable while a read is in flight", async () => {
    const source = new FakeAsyncSource();
    const list = new DynamicDataList(source);
    list.load();
    source.pendingReads[0].resolve([{ a: 1 }]);
    await flush();
    list.load();
    expect(list.isLoading).toBe(true);
    expect(list.getValue(0, "a")).toBe(1);
    expect(list.setValue(0, "a", 5)).toBe(true);
    expect(list.getValue(0, "a")).toBe(5);
  });
});

describe("DynamicDataList: change notifications, source and dispose", () => {
  test("every change type fires when it is documented to", () => {
    const list = createList(createRecords(6));
    const changes = recordChanges(list);
    list.add({ id: 9 });
    list.setValue(0, "name", "changed");
    list.setRecord(1, { id: 1, name: "replaced" });
    list.move(0, 1);
    list.remove(0);
    list.pageSize = 2;
    list.pageIndex = 1;
    list.sort = [{ field: "id", direction: "asc" }];
    list.filter = "{id} notempty";
    list.load();
    expect(changes).toEqual([
      "recordAdded:6",
      "recordChanged:0:name",
      "recordChanged:1:undefined",
      "recordMoved:0>1",
      "recordRemoved:0",
      "reset",
      "pageChanged",
      "reset",
      "reset",
      "reset"
    ]);
  });
  test("setRecordVisible does not raise a change: the owner is the one that sets it", () => {
    const list = createList(createRecords(3));
    const changes = recordChanges(list);
    list.setRecordVisible(0, false);
    expect(changes).toEqual([]);
    expect(list.visibleCount).toBe(2);
  });
  test("assigning the same source changes nothing", () => {
    const source = ArrayDynamicDataSource.fromArray(createRecords(2));
    const list = new DynamicDataList(source);
    list.load();
    const changes = recordChanges(list);
    list.source = source;
    expect(changes).toEqual([]);
    expect(list.count).toBe(2);
  });
  test("a new source resets the window and reloads when the list was loaded", () => {
    const list = createList(createRecords(2));
    const changes = recordChanges(list);
    list.source = ArrayDynamicDataSource.fromArray(createRecords(5));
    expect(changes).toEqual(["reset"]);
    expect(list.count).toBe(5);
    expect(list.source.read().length).toBe(5);
  });
  test("a new source on a list that was never loaded only resets", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(2)));
    const changes = recordChanges(list);
    list.source = ArrayDynamicDataSource.fromArray(createRecords(5));
    expect(changes).toEqual(["reset"]);
    expect(list.count).toBe(0);
    list.load();
    expect(list.count).toBe(5);
  });
  test("dispose empties the list and stops the notifications", () => {
    const list = createList(createRecords(3));
    const changes = recordChanges(list);
    list.dispose();
    expect(list.count).toBe(0);
    expect(list.visibleCount).toBe(0);
    list.load();
    expect(changes).toEqual([]);
  });
});

describe("DynamicDataList: read-through over an array source", () => {
  const createList = (): { list: DynamicDataList, get: () => Array<any>, writes: Array<Array<any>> } => {
    let stored: Array<any> = [{ a: 1 }, { a: 2 }];
    const writes = new Array<Array<any>>();
    const source = new ArrayDynamicDataSource(() => stored, (arr: Array<any>): void => {
      stored = arr;
      writes.push(arr);
    });
    const list = new DynamicDataList(source);
    list["isReadThroughValue"] = true;
    list.load();
    return { list: list, get: (): Array<any> => stored, writes: writes };
  };
  test("reads the owner array on demand, without a load", () => {
    let stored: Array<any> = [{ a: 1 }];
    const list = new DynamicDataList(new ArrayDynamicDataSource(() => stored, (arr) => { stored = arr; }));
    list["isReadThroughValue"] = true;
    expect(list.count, "No load() was called").toBe(1);
    stored = [{ a: 1 }, { a: 2 }, { a: 3 }];
    expect(list.count, "An assignment made behind the back of the list is seen at once").toBe(3);
    expect(list.getRecord(2).a).toBe(3);
  });
  test("every write replaces the owner array", () => {
    const rec = createList();
    const before = rec.get();
    rec.list.setValue(0, "a", 11);
    expect(rec.get(), "A new array").not.toBe(before);
    expect(before[0].a, "The old record was not mutated").toBe(1);
    expect(rec.get()[0].a).toBe(11);
    expect(rec.get()[1], "An untouched record keeps its identity").toBe(before[1]);
  });
  test("add, remove and move go straight to the owner array", () => {
    const rec = createList();
    rec.list.add({ a: 3 }, 0);
    expect(rec.get()).toEqual([{ a: 3 }, { a: 1 }, { a: 2 }]);
    expect(rec.list.count).toBe(3);
    rec.list.move(0, 2);
    expect(rec.get()).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
    rec.list.remove(1);
    expect(rec.get()).toEqual([{ a: 1 }, { a: 3 }]);
    expect(rec.list.count).toBe(2);
  });
  test("the owner is notified after the write, not before", () => {
    const rec = createList();
    const seen = new Array<number>();
    rec.list.onChanged = (): void => { seen.push(rec.get().length); };
    rec.list.add({ a: 3 });
    rec.list.remove(0);
    expect(seen, "Every notification sees the array the change produced").toEqual([3, 2]);
  });
  test("a source batch replaces the owner array once", () => {
    const rec = createList();
    const source = <ArrayDynamicDataSource>rec.list.source;
    source.batch((): void => {
      rec.list.ensureCount(4);
      rec.list.setValue(3, "a", 4);
      expect(rec.list.count, "The list reads the array being built").toBe(4);
      expect(rec.list.getRecord(3).a).toBe(4);
      expect(rec.writes.length, "Nothing reached the owner yet").toBe(0);
    });
    expect(rec.writes.length, "One assignment for the whole batch").toBe(1);
    expect(rec.get()).toEqual([{ a: 1 }, { a: 2 }, {}, { a: 4 }]);
  });
  test("a batch that changes nothing does not assign", () => {
    const rec = createList();
    const source = <ArrayDynamicDataSource>rec.list.source;
    source.batch((): void => {
      rec.list.setValue(0, "a", 1);
      rec.list.move(1, 1);
    });
    expect(rec.writes.length).toBe(0);
  });
  test("read-through is ignored for a source that is not an array source", () => {
    const source: IDynamicDataSource = { read: (): Array<any> => [{ a: 1 }, { a: 2 }] };
    const list = new DynamicDataList(source);
    list["isReadThroughValue"] = true;
    expect(list.count, "Nothing is loaded yet").toBe(0);
    list.load();
    expect(list.count).toBe(2);
    list.setValue(0, "a", 11);
    expect(list.getRecord(0).a, "A source without update keeps the change in the window").toBe(11);
  });
});

// A source that names itself in every write, so that a push can be attributed to the source it was
// enqueued against.
class FakeNamedAsyncWriteSource implements IDynamicDataSource {
  public keyField: string = "id";
  public ops: Array<string> = [];
  public pendingWrites: Array<Deferred> = [];
  constructor(public name: string, public records: Array<any>) { }
  public read(): Array<any> {
    return this.records;
  }
  public update(key: any, record: any): Promise<void> {
    this.ops.push(this.name + ":" + key + ":" + JSON.stringify(record));
    const deferred = new Deferred();
    this.pendingWrites.push(deferred);
    return deferred.promise.then((): void => {
      const at = indexOfId(this.records, key);
      if (at > -1)this.records[at] = record;
    });
  }
}
// A source whose read() never settles until it is switched to a synchronous or a throwing one.
class FakeSwitchableSource implements IDynamicDataSource {
  public pendingReads: Array<Deferred> = [];
  public isSync: boolean = false;
  public throwOnRead: boolean = false;
  public records: Array<any> = [];
  public read(): any {
    if (this.throwOnRead) throw new Error("boom");
    if (this.isSync) return this.records;
    const deferred = new Deferred();
    this.pendingReads.push(deferred);
    return deferred.promise;
  }
}
function createReadThrough(records: Array<any>): { list: DynamicDataList, set: (arr: Array<any>) => void } {
  let stored: Array<any> = records;
  const source = new ArrayDynamicDataSource(() => stored, (arr: Array<any>): void => { stored = arr; });
  const list = new DynamicDataList(source);
  list["isReadThroughValue"] = true;
  list.load();
  return { list: list, set: (arr: Array<any>): void => { stored = arr; } };
}

describe("DynamicDataList: a replaced source", () => {
  test("a queued write is pushed to the source it was enqueued against", async () => {
    const oldSource = new FakeNamedAsyncWriteSource("old", [{ id: 0, a: 1 }]);
    const newSource = new FakeNamedAsyncWriteSource("new", [{ id: 0, a: 1 }]);
    const list = new DynamicDataList(oldSource);
    list.load();
    list.setValue(0, "a", 2);
    list.setValue(0, "a", 3);
    expect(oldSource.ops, "#1: the second push is queued").toEqual(["old:0:{\"id\":0,\"a\":2}"]);
    list.source = newSource;
    oldSource.pendingWrites[0].resolve();
    await flush();
    expect(oldSource.ops, "#2: both edits belong to the old source")
      .toEqual(["old:0:{\"id\":0,\"a\":2}", "old:0:{\"id\":0,\"a\":3}"]);
    expect(newSource.ops, "#3: the new source got nothing").toEqual([]);
    expect(newSource.records, "#4: the new record was not overwritten").toEqual([{ id: 0, a: 1 }]);
  });
  test("the new source is read at once: the detached pushes are not waited for", async () => {
    const oldSource = new FakeNamedAsyncWriteSource("old", [{ id: 0, a: 1 }]);
    const list = new DynamicDataList(oldSource);
    list.load();
    list.setValue(0, "a", 2);
    expect(list.hasPendingWrites, "#1").toBe(true);
    list.source = new FakeNamedAsyncWriteSource("new", createRecords(3));
    expect(list.count, "#2: the new source was read, the push chain was not waited for").toBe(3);
    expect(list.hasPendingWrites, "#3: a replaced source is no longer the storage of the list").toBe(false);
    oldSource.pendingWrites[0].resolve();
    await flush();
    expect(list.count, "#4: the settled push does not touch the list").toBe(3);
    expect(list.hasPendingWrites, "#5").toBe(false);
  });
  test("a new source clears an isLoading left by a read that never settles", () => {
    const list = new DynamicDataList(new FakeSwitchableSource());
    list.load();
    expect(list.isLoading, "#1").toBe(true);
    const changes = recordChanges(list);
    list.source = ArrayDynamicDataSource.fromArray(createRecords(2));
    expect(list.isLoading, "#2").toBe(false);
    expect(changes, "#3: exactly one loading notification").toEqual(["loading:false", "reset"]);
    list.load();
    expect(list.count, "#4").toBe(2);
    expect(list.isLoading, "#5").toBe(false);
  });
});

describe("DynamicDataList: isLoading always settles", () => {
  test("a synchronous read clears the isLoading of the asynchronous read it supersedes", () => {
    const source = new FakeSwitchableSource();
    const list = new DynamicDataList(source);
    list.load();
    expect(list.isLoading, "#1").toBe(true);
    source.isSync = true;
    source.records = createRecords(2);
    list.load();
    expect(list.isLoading, "#2: the synchronous read committed").toBe(false);
    expect(list.count, "#3").toBe(2);
  });
  test("a read that throws synchronously clears isLoading", () => {
    const source = new FakeSwitchableSource();
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.load();
    expect(list.isLoading, "#1").toBe(true);
    source.throwOnRead = true;
    list.load();
    expect(errors, "#2").toEqual(["read"]);
    expect(list.isLoading, "#3").toBe(false);
  });
  test("dispose leaves isLoading false", () => {
    const list = new DynamicDataList(new FakeSwitchableSource());
    list.load();
    expect(list.isLoading, "#1").toBe(true);
    list.dispose();
    expect(list.isLoading, "#2").toBe(false);
  });
});

describe("DynamicDataList: records changed outside the list", () => {
  test("the cached views follow an array replaced outside the list", () => {
    const rec = createReadThrough([{ a: 1 }, { a: 2 }]);
    const list = rec.list;
    list.setRecordVisible(1, false);
    expect(list.visibleCount, "#1").toBe(1);
    rec.set([{ a: 1 }, { a: 2 }, { a: 3 }]);
    expect(list.count, "#2: count").toBe(3);
    expect(list.visibleCount, "#2: the hidden record stays hidden").toBe(2);
    expect(list.getVisibleIndexes(), "#2: indexes").toEqual([0, 2]);
    rec.set([{ a: 1 }]);
    expect(list.visibleCount, "#3: the hidden record is gone").toBe(1);
    rec.set([{ a: 1 }, { a: 9 }, { a: 8 }]);
    expect(list.visibleCount, "#4: the trimmed hidden flag did not come back").toBe(3);
  });
  test("the cached page indexes follow an array replaced outside the list", () => {
    const rec = createReadThrough(createRecords(4));
    const list = rec.list;
    list.pageSize = 2;
    expect(list.getPageIndexes(), "#1").toEqual([0, 1]);
    rec.set(createRecords(1));
    expect(list.getPageIndexes().length, "#2").toBe(1);
    expect(list.getPageIndexes(), "#2: indexes").toEqual([0]);
  });
  test("invalidateViews recomputes a local filter after a same-length content change", () => {
    const rec = createReadThrough([{ a: 1 }, { a: 2 }]);
    const list = rec.list;
    list.filter = "{a} = 3";
    expect(list.visibleCount, "#1").toBe(0);
    rec.set([{ a: 3 }, { a: 2 }]);
    expect(list.visibleCount, "#2: a same-length content change cannot be detected").toBe(0);
    list.invalidateViews();
    expect(list.visibleCount, "#3").toBe(1);
    expect(list.getVisibleIndexes(), "#3: indexes").toEqual([0]);
  });
});

describe("DynamicDataList: pageIndex is clamped when the visible count shrinks", () => {
  test("remove clamps the page index and reports the change after recordRemoved", () => {
    const list = createList(createRecords(2));
    list.pageSize = 1;
    list.pageIndex = 1;
    const changes = recordChanges(list);
    list.remove(1);
    expect(list.pageIndex, "#1").toBe(0);
    expect(list.pageCount, "#2").toBe(1);
    expect(list.getPageIndexes().length, "#3").toBe(1);
    expect(changes, "#4: recordRemoved first, pageChanged second").toEqual(["recordRemoved:1", "pageChanged"]);
  });
  test("truncate clamps the page index", () => {
    const list = createList(createRecords(4));
    list.pageSize = 2;
    list.pageIndex = 1;
    list.truncate(2);
    expect(list.pageIndex, "#1").toBe(0);
    expect(list.getPageIndexes().length, "#2").toBe(2);
  });
  test("setRecordVisible clamps the page index", () => {
    const list = createList(createRecords(3));
    list.pageSize = 1;
    list.pageIndex = 2;
    list.setRecordVisible(2, false);
    expect(list.pageIndex, "#1").toBe(1);
    expect(list.getPageIndexes().length, "#2").toBe(1);
  });
  test("an edit that makes a record fail the local filter clamps the page index", () => {
    const list = createList([{ a: 1 }, { a: 1 }]);
    list.filter = "{a} = 1";
    list.pageSize = 1;
    list.pageIndex = 1;
    list.setValue(1, "a", 2);
    expect(list.visibleCount, "#1").toBe(1);
    expect(list.pageIndex, "#2").toBe(0);
    expect(list.getPageIndexes().length, "#3").toBe(1);
  });
  test("a clamped page index reloads the page of a paging source", () => {
    const source = new FakeRangeSource(createRecords(3));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    expect(list.loadedCount, "#1: the last page holds one record").toBe(1);
    list.remove(0);
    expect(list.pageIndex, "#2").toBe(0);
    expect(source.rangeCalls[source.rangeCalls.length - 1], "#3: the previous page was fetched")
      .toEqual({ skip: 0, take: 2 });
    expect(list.loadedCount, "#4").toBe(2);
  });
  test("the page index is not clamped before the first read", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(4)));
    list.pageSize = 2;
    list.pageIndex = 3;
    list.invalidateViews();
    expect(list.pageIndex, "#1: the pageIndex setter rules until something is loaded").toBe(3);
    list.load();
    expect(list.pageIndex, "#2: the commit clamps it").toBe(1);
  });
});

describe("DynamicDataList: created indexes", () => {
  test("with no filter and no sort the created indexes are the record indexes", () => {
    const list = createList(createRecords(3));
    expect(list.hasView, "#1: no view").toBe(false);
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 1, 2]);
    expect(list.createdIndexToIndex(2), "#3").toBe(2);
    expect(list.indexToCreatedIndex(2), "#4").toBe(2);
    expect(list.createdIndexToIndex(3), "#5: out of range").toBe(-1);
    expect(list.indexToCreatedIndex(3), "#6: out of range").toBe(-1);
  });
  test("a filter drops the records it excludes from the created indexes", () => {
    const list = createList([{ a: 1 }, { a: 2 }, { a: 1 }]);
    list.filter = "{a} = 1";
    expect(list.hasView, "#1").toBe(true);
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 2]);
    expect(list.createdIndexToIndex(1), "#3").toBe(2);
    expect(list.indexToCreatedIndex(2), "#4").toBe(1);
    expect(list.indexToCreatedIndex(1), "#5: the record has no object").toBe(-1);
    expect(list.count, "#6: the storage count does not change").toBe(3);
  });
  test("a sort reorders the created indexes and never the records", () => {
    const records = [{ a: 3 }, { a: 1 }, { a: 2 }];
    const list = createList(records);
    list.sort = [{ field: "a", direction: "asc" }];
    expect(list.getCreatedIndexes(), "#1").toEqual([1, 2, 0]);
    expect(list.createdIndexToIndex(0), "#2").toBe(1);
    expect(list.indexToCreatedIndex(0), "#3").toBe(2);
    expect(records.map(r => r.a), "#4: the records kept their order").toEqual([3, 1, 2]);
  });
  test("the created indexes keep the owner-hidden records, the visible indexes do not", () => {
    const list = createList([{ a: 1 }, { a: 2 }, { a: 1 }]);
    list.filter = "{a} = 1";
    list.setRecordVisible(0, false);
    expect(list.getCreatedIndexes(), "#1: the hidden record still has an object").toEqual([0, 2]);
    expect(list.getVisibleIndexes(), "#2").toEqual([2]);
    expect(list.visibleCount, "#3").toBe(1);
  });
  test("the owner-hidden records do not change the sorted order of the rest", () => {
    const list = createList([{ a: 3 }, { a: 1 }, { a: 2 }]);
    list.sort = [{ field: "a", direction: "asc" }];
    list.setRecordVisible(1, false);
    expect(list.getCreatedIndexes(), "#1").toEqual([1, 2, 0]);
    expect(list.getVisibleIndexes(), "#2").toEqual([2, 0]);
  });
});

describe("DynamicDataList: frozen membership", () => {
  const createFrozen = (records: Array<any>, filter?: string, sort?: Array<any>): DynamicDataList => {
    const list = createList(records);
    list.isViewFrozenOnEdit = true;
    if (!!filter) list.filter = filter;
    if (!!sort) list.sort = <any>sort;
    return list;
  };
  test("an edit that makes a record fail the filter keeps its place", () => {
    const list = createFrozen([{ a: 1 }, { a: 1 }], "{a} = 1");
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 1]);
    list.setValue(1, "a", 2);
    expect(list.getCreatedIndexes(), "#2: the record keeps its object").toEqual([0, 1]);
    expect(list.visibleCount, "#3").toBe(2);
  });
  test("an edit does not re-sort the records under the cursor", () => {
    const list = createFrozen([{ a: 1 }, { a: 2 }], undefined, [{ field: "a", direction: "asc" }]);
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 1]);
    list.setValue(0, "a", 9);
    expect(list.getCreatedIndexes(), "#2: nothing moved").toEqual([0, 1]);
  });
  test("refreshView re-evaluates the membership and raises a reset", () => {
    const list = createFrozen([{ a: 1 }, { a: 1 }], "{a} = 1");
    const changes: Array<string> = [];
    list.onChanged = (change) => changes.push(change.type);
    list.setValue(1, "a", 2);
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 1]);
    list.refreshView();
    expect(list.getCreatedIndexes(), "#2: the record left the view").toEqual([0]);
    expect(changes.indexOf("reset") > -1, "#3: a reset was raised").toBe(true);
  });
  test("refreshView re-sorts", () => {
    const list = createFrozen([{ a: 1 }, { a: 2 }], undefined, [{ field: "a", direction: "asc" }]);
    list.setValue(0, "a", 9);
    list.refreshView();
    expect(list.getCreatedIndexes(), "#1").toEqual([1, 0]);
  });
  test("an added record is always in the view, even when it fails the filter", () => {
    const list = createFrozen([{ a: 1 }], "{a} = 1");
    list.add({ a: 5 });
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 1]);
    list.refreshView();
    expect(list.getCreatedIndexes(), "#2: the next refresh filters it out").toEqual([0]);
  });
  test("an added record is appended to the view under a sort", () => {
    const list = createFrozen([{ a: 2 }, { a: 4 }], undefined, [{ field: "a", direction: "asc" }]);
    list.add({ a: 1 });
    expect(list.getCreatedIndexes(), "#1: the new object is last").toEqual([0, 1, 2]);
    list.refreshView();
    expect(list.getCreatedIndexes(), "#2").toEqual([2, 0, 1]);
  });
  test("a removed record leaves the view and the rest shift", () => {
    const list = createFrozen([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 1 }], "{a} = 1");
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 2, 3]);
    list.remove(0);
    expect(list.getCreatedIndexes(), "#2").toEqual([1, 2]);
    expect(list.count, "#3").toBe(3);
  });
  test("removing a record that has no object only shifts the rest", () => {
    const list = createFrozen([{ a: 1 }, { a: 2 }, { a: 1 }], "{a} = 1");
    list.remove(1);
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 1]);
  });
  test("a move reorders the objects and renumbers the records", () => {
    const list = createFrozen([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 2 }, { a: 1 }], "{a} = 1");
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 2, 4]);
    // The first object moves behind the last one: record 0 goes to record index 4.
    list.move(0, 4);
    expect(list.getCreatedIndexes(), "#2").toEqual([1, 3, 4]);
    expect(list.getRecord(4), "#3: the moved record is the one that was first").toEqual({ a: 1 });
  });
  test("an external change re-evaluates the membership", () => {
    const records = [{ a: 1 }, { a: 1 }];
    const list = createFrozen(records, "{a} = 1");
    list.setValue(1, "a", 2);
    expect(list.getCreatedIndexes(), "#1: the edit kept it").toEqual([0, 1]);
    list.invalidateViews();
    expect(list.getCreatedIndexes(), "#2: the assignment re-evaluated it").toEqual([0]);
  });
  test("invalidateViews reported by the storage the write assigns is ignored", () => {
    let records: Array<any> = [{ a: 1 }, { a: 1 }];
    let writing = false;
    const list = new DynamicDataList(new ArrayDynamicDataSource(
      () => records,
      (arr: Array<any>) => {
        records = arr;
        // The owner reports every assignment of its storage, this one included.
        writing = list.isWriting;
        list.invalidateViews();
      }));
    list["isReadThroughValue"] = true;
    list.isViewFrozenOnEdit = true;
    list.load();
    list.filter = "{a} = 1";
    list.setValue(1, "a", 2);
    expect(writing, "#1: the assignment came from the list itself").toBe(true);
    expect(list.getCreatedIndexes(), "#2: the membership survived the edit").toEqual([0, 1]);
    list.invalidateViews();
    expect(list.getCreatedIndexes(), "#3: an assignment from outside re-evaluates it").toEqual([0]);
  });
  test("syncMembershipWithRecordCount appends what appeared and drops what is gone", () => {
    const records = [{ a: 1 }, { a: 2 }, { a: 1 }];
    const list = createFrozen(records, "{a} = 1");
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 2]);
    records.push({ a: 5 });
    list.syncMembershipWithRecordCount();
    expect(list.getCreatedIndexes(), "#2: the new record is in the view").toEqual([0, 2, 3]);
    records.splice(2, 2);
    list.syncMembershipWithRecordCount();
    expect(list.getCreatedIndexes(), "#3: what is gone left it").toEqual([0]);
  });
  test("a bare list re-evaluates on every write, as it always has", () => {
    const list = createList([{ a: 1 }, { a: 1 }]);
    list.filter = "{a} = 1";
    list.setValue(1, "a", 2);
    expect(list.getCreatedIndexes(), "#1").toEqual([0]);
    expect(list.isViewFrozenOnEdit, "#2: off by default").toBe(false);
  });
  test("the membership is not frozen while neither a filter nor a sort is set", () => {
    const list = createFrozen(createRecords(3));
    list.add({ id: 9 });
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 1, 2, 3]);
    list.remove(1);
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 1, 2]);
  });
  test("clearing the filter re-evaluates the membership", () => {
    const list = createFrozen([{ a: 1 }, { a: 2 }], "{a} = 1");
    expect(list.getCreatedIndexes(), "#1").toEqual([0]);
    list.filter = "";
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 1]);
    expect(list.hasView, "#3").toBe(false);
  });
});

interface ITableCall {
  op: string;
  args: Array<any>;
  settle: () => void;
  fail: (error: any) => void;
  isSettled: boolean;
}
/* A table behind promises that pages itself. Every call is recorded and, unless auto is on, stays
   pending until the test settles it. A read answers from the table as it was when the request
   arrived; a write reaches the table when it is acknowledged, as it would on a server. The ids the
   table removed are kept, so that a test can tell WHICH record went, not only how many. */
class FakeTableSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public keyField: string = "id";
  public calls: Array<ITableCall> = [];
  public removedIds: Array<any> = [];
  public auto: boolean = false;
  constructor(public records: Array<any>) { }
  // The call log keeps the range alone: every assertion here is about where the window was read.
  public requests: Array<IDynamicDataReadRequest> = [];
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    this.requests.push(request);
    const size = request.take > 0 ? request.take : this.records.length;
    const snapshot = {
      records: this.records.slice(request.skip, request.skip + size).map(this.copy),
      total: this.records.length
    };
    return this.call("read", [request.skip, request.take], (): IDynamicDataReadResult => snapshot);
  }
  private nextId: number = 1000;
  public update(key: any, record: any): Promise<void> {
    return this.call("update", [key], (): void => {
      const at = indexOfId(this.records, key);
      if (at > -1)this.records[at] = this.copy(record);
    });
  }
  public insert(record: any, sourceIndex: number): Promise<any> {
    return this.call("insert", [sourceIndex], (): any => {
      const stored = Object.assign({ id: this.nextId++ }, this.copy(record));
      this.records.splice(sourceIndex, 0, stored);
      return this.copy(stored);
    });
  }
  public remove(key: any): Promise<void> {
    return this.call("remove", [key], (): void => {
      const at = indexOfId(this.records, key);
      if (at < 0) return;
      this.removedIds.push(this.records[at].id);
      this.records.splice(at, 1);
    });
  }
  private copy = (record: any): any => Object.assign({}, record);
  private call<T>(op: string, args: Array<any>, run: () => T): Promise<T> {
    const deferred = new Deferred();
    const entry: ITableCall = {
      op: op, args: args, isSettled: false,
      settle: (): void => {
        if (entry.isSettled) return;
        entry.isSettled = true;
        deferred.resolve(run());
      },
      fail: (error: any): void => {
        if (entry.isSettled) return;
        entry.isSettled = true;
        deferred.reject(error);
      }
    };
    this.calls.push(entry);
    if (this.auto) {
      entry.settle();
    }
    return deferred.promise;
  }
  public argsOf(op: string): Array<Array<any>> {
    return this.calls.filter((call: ITableCall): boolean => call.op === op).map((call: ITableCall): Array<any> => call.args);
  }
  public pendingOf(op?: string): Array<ITableCall> {
    return this.calls.filter((call: ITableCall): boolean => !call.isSettled && (!op || call.op === op));
  }
  // Settles the oldest pending call (of the given operation) and reports whether there was one.
  public settleFirst(op?: string): boolean {
    const call = this.pendingOf(op)[0];
    if (!call) return false;
    call.settle();
    return true;
  }
}
// A chain of pushes needs many more microtask turns than a single read.
const SETTLE_TURNS = 300;
async function settleEverything(source: FakeTableSource): Promise<void> {
  for (let i = 0; i < 100; i++) {
    await flush(SETTLE_TURNS);
    if (!source.settleFirst()) break;
  }
  await flush(SETTLE_TURNS);
}
function tableRecords(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: i, name: "r" + i });
  }
  return res;
}
function windowIds(list: DynamicDataList): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < list.loadedCount; i++) {
    res.push(list.getRecord(i).id);
  }
  return res;
}
function idRange(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}
async function createTableList(source: FakeTableSource, pageSize: number = 10): Promise<DynamicDataList> {
  const list = new DynamicDataList(source);
  list.pageSize = pageSize;
  const auto = source.auto;
  source.auto = true;
  list.load();
  await flush(SETTLE_TURNS);
  source.auto = auto;
  return list;
}
/* Watches the list the way the owner does: every notification together with the state it was
   raised in, so that a test can prove a window was never committed while a write was pending. */
function watchList(list: DynamicDataList): { changes: Array<string>, resetsWhilePushPending: number } {
  const res = { changes: new Array<string>(), resetsWhilePushPending: 0 };
  list.onChanged = (change: IDynamicDataListChange): void => {
    res.changes.push(changeToString(change));
    if (change.type === "reset" && list.hasPendingWrites) res.resetsWhilePushPending++;
  };
  return res;
}

describe("DynamicDataList: a removed record refills the page of a source that pages itself", () => {
  test("a remove on the first page of three reads the page again", async () => {
    const source = new FakeTableSource(tableRecords(30));
    source.auto = true;
    const list = await createTableList(source);
    list.remove(0);
    await flush(SETTLE_TURNS);
    expect(source.argsOf("read"), "#1: one extra read of the same page").toEqual([[0, 10], [0, 10]]);
    expect(list.loadedCount, "#2: the page is full again").toBe(10);
    expect(list.count, "#3").toBe(29);
    expect(windowIds(list), "#4: the first record of the old second page moved up").toEqual(idRange(1, 10));
    expect(list.isLoading, "#5").toBe(false);
  });
  test("removing every record of the first page one by one keeps it full", async () => {
    const source = new FakeTableSource(tableRecords(30));
    source.auto = true;
    const list = await createTableList(source);
    for (let i = 0; i < 10; i++) {
      list.remove(0);
      await flush(SETTLE_TURNS);
      expect(list.loadedCount, "#1: full after remove " + i).toBe(10);
      expect(list.count, "#2: count after remove " + i).toBe(29 - i);
      expect(list.pageCount, "#3: pageCount after remove " + i).toBe(Math.ceil((29 - i) / 10));
      expect(list.pageIndex, "#4: pageIndex after remove " + i).toBe(0);
    }
    expect(windowIds(list), "#5").toEqual(idRange(10, 19));
    expect(source.records.length, "#6: the server did its part").toBe(20);
  });
  test("ten removes without settling end in one committed window", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const watch = watchList(list);
    for (let i = 0; i < 10; i++) {
      list.remove(0);
    }
    const changesAfterRemoves = watch.changes.length;
    await settleEverything(source);
    expect(windowIds(list), "#1").toEqual(idRange(10, 19));
    expect(list.count, "#2").toBe(20);
    expect(list.isLoading, "#3").toBe(false);
    const resets = watch.changes.slice(changesAfterRemoves).filter((c: string): boolean => c === "reset");
    expect(resets.length, "#4: exactly one reset after the removes").toBe(1);
    expect(watch.resetsWhilePushPending, "#5: no reset while a push was pending").toBe(0);
    expect(source.removedIds, "#6").toEqual(idRange(0, 9));
  });
  test("a remove on the last page reads nothing", async () => {
    const shortSource = new FakeTableSource(tableRecords(25));
    shortSource.auto = true;
    const shortList = await createTableList(shortSource);
    shortList.pageIndex = 2;
    await flush(SETTLE_TURNS);
    const shortReads = shortSource.argsOf("read").length;
    shortList.remove(0);
    await flush(SETTLE_TURNS);
    expect(shortSource.argsOf("read").length, "#1: short last page - no read").toBe(shortReads);
    expect(windowIds(shortList), "#2").toEqual([21, 22, 23, 24]);

    const fullSource = new FakeTableSource(tableRecords(30));
    fullSource.auto = true;
    const fullList = await createTableList(fullSource);
    fullList.pageIndex = 2;
    await flush(SETTLE_TURNS);
    const fullReads = fullSource.argsOf("read").length;
    fullList.remove(0);
    await flush(SETTLE_TURNS);
    expect(fullSource.argsOf("read").length, "#3: full last page - no read").toBe(fullReads);
    expect(fullList.loadedCount, "#4: one shorter").toBe(9);
    expect(fullList.count, "#5").toBe(29);
  });
  test("removing the only record of the last page reads the previous page once", async () => {
    const source = new FakeTableSource(tableRecords(21));
    source.auto = true;
    const list = await createTableList(source);
    list.pageIndex = 2;
    await flush(SETTLE_TURNS);
    expect(windowIds(list), "#1").toEqual([20]);
    const reads = source.argsOf("read").length;
    const changes = recordChanges(list);
    list.remove(0);
    await flush(SETTLE_TURNS);
    expect(source.argsOf("read").slice(reads), "#2: exactly one read, for the previous page").toEqual([[10, 10]]);
    expect(changes, "#3").toEqual(["recordRemoved:0", "pageChanged", "loading:true", "reset", "loading:false"]);
    expect(list.pageIndex, "#4").toBe(1);
    expect(windowIds(list), "#5").toEqual(idRange(10, 19));
  });
  test("pageSize 0 with a paging source: no refill read", async () => {
    const source = new FakeTableSource(tableRecords(5));
    source.auto = true;
    const list = await createTableList(source, 0);
    expect(source.argsOf("read"), "#1").toEqual([[0, 0]]);
    list.remove(0);
    await flush(SETTLE_TURNS);
    expect(source.argsOf("read").length, "#2").toBe(1);
    expect(list.loadedCount, "#3").toBe(4);
  });
  test("a rejected refill read keeps the short window", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.remove(0);
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    expect(source.pendingOf("read").length, "#1: the refill is in flight").toBe(1);
    source.pendingOf("read")[0].fail(new Error("boom"));
    await flush(SETTLE_TURNS);
    expect(windowIds(list), "#2: the short window stays").toEqual(idRange(1, 9));
    expect(errors, "#3").toEqual(["read"]);
    expect(list.isLoading, "#4").toBe(false);
    expect(list.hasPendingRead, "#5").toBe(false);
  });
  test("a rejected remove: the refill brings the record back", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.remove(0);
    expect(windowIds(list), "#1: the local change").toEqual(idRange(1, 9));
    source.pendingOf("remove")[0].fail(new Error("denied"));
    await settleEverything(source);
    expect(errors, "#2: reported once").toEqual(["remove"]);
    expect(windowIds(list), "#3: the server still has it, so it comes back").toEqual(idRange(0, 9));
    expect(list.count, "#4").toBe(30);
  });
});

describe("DynamicDataList: a read never commits over a pending write", () => {
  test("two deferred removes: the refill waits for both", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const watch = watchList(list);
    let maxCount = list.count;
    const checkNoRemovedRecord = (step: string): void => {
      expect(windowIds(list).indexOf(0), step + ": record 0 is not shown").toBe(-1);
      expect(windowIds(list).indexOf(1), step + ": record 1 is not shown").toBe(-1);
      expect(list.count <= maxCount, step + ": count does not go back up").toBe(true);
      maxCount = list.count;
    };
    list.remove(0);
    list.remove(0);
    checkNoRemovedRecord("#1");
    expect(windowIds(list), "#2").toEqual(idRange(2, 9));
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    checkNoRemovedRecord("#3");
    expect(source.argsOf("read").length, "#4: no read while delete 2 is pending").toBe(1);
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    checkNoRemovedRecord("#5");
    expect(source.argsOf("read").length, "#6: exactly one read after delete 2").toBe(2);
    source.settleFirst("read");
    await flush(SETTLE_TURNS);
    checkNoRemovedRecord("#7");
    expect(windowIds(list), "#8").toEqual(idRange(2, 11));
    expect(list.count, "#9").toBe(28);
    expect(watch.resetsWhilePushPending, "#10: no reset while a push was pending").toBe(0);
  });
  test("a remove made after a re-read deletes the record that was asked for", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    // refresh() by hand stands in for the refill, as in the probe; with the refill in place the two
    // requests coalesce.
    list.remove(0);
    list.refresh();
    list.remove(0);
    list.refresh();
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    // Whatever read is in flight now answers while delete 2 may still be pending.
    source.settleFirst("read");
    await flush(SETTLE_TURNS);
    expect(windowIds(list).indexOf(1), "#1: the removed record is not back").toBe(-1);
    const index = windowIds(list).indexOf(3);
    expect(index > -1, "#2: record 3 is in the window").toBe(true);
    list.remove(index);
    await settleEverything(source);
    expect(source.removedIds.slice().sort((a, b) => a - b), "#3: by identity").toEqual([0, 1, 3]);
    expect(windowIds(list), "#4").toEqual([2].concat(idRange(4, 12)));
  });
  test("an edit enqueued while a read is in flight: the stale answer is not committed", async () => {
    const editSource = new FakeTableSource(tableRecords(30));
    const editList = await createTableList(editSource);
    const editWatch = watchList(editList);
    // The in-flight read is a refresh of the page - what the refill itself is - and the edit lands
    // on a record of that page.
    editList.refresh();
    editList.setValue(0, "name", "edited");
    editSource.settleFirst("read");
    await flush(SETTLE_TURNS);
    expect(editList.getValue(0, "name"), "#1: the stale answer did not paint over the edit").toBe("edited");
    await settleEverything(editSource);
    expect(editSource.argsOf("read").length, "#2: the page was read again after the push").toBe(3);
    expect(editList.getValue(0, "name"), "#3").toBe("edited");
    expect(editSource.records[0].name, "#4").toBe("edited");
    expect(editWatch.resetsWhilePushPending, "#5").toBe(0);
    expect(editList.isLoading, "#6").toBe(false);
  });
  test("a remove enqueued while a page read is in flight: the stale page is not committed", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const watch = watchList(list);
    list.pageIndex = 1;
    // The page read was issued against a server that still has record 0.
    list.remove(0);
    source.settleFirst("read");
    await flush(SETTLE_TURNS);
    await settleEverything(source);
    expect(source.removedIds, "#1").toEqual([0]);
    expect(windowIds(list), "#2: page 1 after the removal").toEqual(idRange(11, 20));
    expect(list.count, "#3").toBe(29);
    expect(list.windowOffset, "#4").toBe(10);
    expect(list.isLoading, "#5").toBe(false);
    expect(watch.resetsWhilePushPending, "#6").toBe(0);
  });
  test("hasPendingRead spans the wait for the chain and the read itself", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = new DynamicDataList(new FakeTableSource([]));
    list.pageSize = 10;
    list.assignSource(source);
    list.load();
    source.settleFirst("read");
    await flush(SETTLE_TURNS);
    expect(list.loadedCount, "#1: loaded").toBe(10);
    expect(list.hasPendingRead, "#2: nothing pending").toBe(false);
    list.remove(0);
    expect(list.hasPendingRead, "#4: requested").toBe(true);
    expect(list.isLoading, "#5: not started yet").toBe(false);
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    expect(list.hasPendingRead, "#7: in flight").toBe(true);
    expect(list.isLoading, "#8").toBe(true);
    source.settleFirst("read");
    await flush(SETTLE_TURNS);
    expect(list.hasPendingRead, "#10: committed").toBe(false);
    expect(list.isLoading, "#11").toBe(false);
  });
  test("a source change while a refill is queued: the queued read dies with the chain", async () => {
    const oldSource = new FakeTableSource(tableRecords(30));
    const list = await createTableList(oldSource);
    list.remove(0);
    const newSource = new FakeTableSource(tableRecords(5));
    newSource.auto = true;
    list.source = newSource;
    await flush(SETTLE_TURNS);
    expect(newSource.argsOf("read"), "#1: the new source is read once").toEqual([[0, 10]]);
    await settleEverything(oldSource);
    expect(oldSource.argsOf("read").length, "#2: the old source is not read again").toBe(1);
    expect(newSource.argsOf("read").length, "#3: nor the new one").toBe(1);
    expect(windowIds(list), "#4").toEqual(idRange(0, 4));
    expect(list.isLoading, "#5").toBe(false);
    expect(list.hasPendingRead, "#6").toBeFalsy();
  });
});

describe("DynamicDataList: the read-through count comes from the read-through callback", () => {
  // Built the way the questions build one, over a getter that counts its calls.
  function createCountingList(recordCount: number, withCount: boolean = true): { list: DynamicDataList, source: ArrayDynamicDataSource, reads: () => number } {
    let local: Array<any> = [];
    for (let i = 0; i < recordCount; i++) local.push({ a: i });
    let readCount = 0;
    const list = DynamicDataList.createReadThrough(undefined, (): Array<any> => { readCount++; return local; },
      (arr: Array<any>): void => { local = arr; },
      withCount ? (): number => local.length : undefined);
    return { list: list, source: <ArrayDynamicDataSource>list.source, reads: (): number => readCount };
  }
  test("count, loadedCount, the identity conversions and visibleCount do not read the records", () => {
    const { list, reads } = createCountingList(10);
    list.getVisibleIndexes();
    const start = reads();
    expect(list.count, "#1").toBe(10);
    expect(list.loadedCount, "#2").toBe(10);
    expect(list.createdIndexToIndex(3), "#3").toBe(3);
    expect(list.indexToCreatedIndex(3), "#4").toBe(3);
    expect(list.visibleCount, "#5").toBe(10);
    expect(reads() - start, "#6: no read").toBe(0);
  });
  test("getRecord and getValue read the records once, an out-of-range index not at all", () => {
    const { list, reads } = createCountingList(10);
    list.getVisibleIndexes();
    let start = reads();
    expect(list.getRecord(5), "#1").toEqual({ a: 5 });
    expect(reads() - start, "#2: one read").toBe(1);
    start = reads();
    expect(list.getRecord(10), "#3").toBeUndefined();
    expect(reads() - start, "#4: the guard reads nothing").toBe(0);
    start = reads();
    expect(list.getValue(5, "a"), "#5").toBe(5);
    expect(reads() - start, "#6: one read").toBe(1);
  });
  test("a read-through list without a count callback falls back to the length of the records", () => {
    const { list, reads } = createCountingList(3, false);
    let start = reads();
    expect(list.count, "#1").toBe(3);
    expect(reads() - start, "#2: one read per access").toBe(1);
    start = reads();
    expect(list.count, "#3").toBe(3);
    expect(reads() - start, "#4").toBe(1);
  });
  test("inside a batch the count follows the array being built", () => {
    const { list } = createCountingList(2);
    const counts: Array<number> = [];
    list.batch((): void => {
      list.add({ a: 10 });
      counts.push(list.count);
      list.add({ a: 11 });
      counts.push(list.count);
    });
    expect(counts, "#1").toEqual([3, 4]);
    expect(list.count, "#2").toBe(4);
  });
  test("setRecordVisible reports whether the flag changed", () => {
    const list = createList([{ a: 1 }, { a: 2 }]);
    expect(list.setRecordVisible(0, false), "#1: a change").toBe(true);
    expect(list.setRecordVisible(0, false), "#2: a repeat").toBe(false);
    expect(list.setRecordVisible(0, true), "#3: back").toBe(true);
    expect(list.setRecordVisible(5, false), "#4: out of range").toBe(false);
  });
});

describe("DynamicDataList: one request per read", () => {
  function createViewList(recordCount: number, pageSize: number):
    { list: DynamicDataList, source: FakeServerViewSource } {
    const source = new FakeServerViewSource(createRecords(recordCount));
    const list = new DynamicDataList(source);
    list.pageSize = pageSize;
    list.load();
    return { list: list, source: source };
  }
  test("a load asks for the page and carries the view, empty as it is", () => {
    const { source } = createViewList(30, 10);
    expect(source.requests.length, "#1: one request").toBe(1);
    expect(source.requests[0], "#2").toEqual({ skip: 0, take: 10, filter: "", sort: [] });
  });
  test("a filter is one request, at the first page", () => {
    const { list, source } = createViewList(30, 10);
    list.pageIndex = 2;
    source.requests = [];
    list.filter = "{id} > 1";
    expect(source.requests.length, "#1: one request, not a push and a read").toBe(1);
    expect(source.requests[0], "#2").toEqual({ skip: 0, take: 10, filter: "{id} > 1", sort: [] });
    expect(list.pageIndex, "#3: a filter returns to the first page").toBe(0);
  });
  test("a sort is one request, for the page the list is on", () => {
    const { list, source } = createViewList(30, 10);
    list.pageIndex = 2;
    source.requests = [];
    const sort: Array<IDynamicDataSort> = [{ field: "id", direction: "desc" }];
    list.sort = sort;
    expect(source.requests.length, "#1").toBe(1);
    expect(source.requests[0], "#2").toEqual({ skip: 20, take: 10, filter: "", sort: sort });
    expect(list.pageIndex, "#3: a sort keeps the page").toBe(2);
  });
  test("setView assigns both and reads exactly once", () => {
    const { list, source } = createViewList(30, 10);
    list.pageIndex = 2;
    source.requests = [];
    const sort: Array<IDynamicDataSort> = [{ field: "id", direction: "desc" }];
    list.setView("{id} > 1", sort);
    expect(source.requests.length, "#1: one request for both").toBe(1);
    expect(source.requests[0], "#2").toEqual({ skip: 0, take: 10, filter: "{id} > 1", sort: sort });
    expect(list.filter, "#3").toBe("{id} > 1");
    expect(list.sort, "#4").toEqual(sort);
  });
  test("a source swap reads the new source once, with the view the list holds", () => {
    const { list } = createViewList(30, 10);
    list.setView("{id} > 1", [{ field: "id", direction: "desc" }]);
    const newSource = new FakeServerViewSource(createRecords(30));
    list.source = newSource;
    expect(newSource.requests.length, "#1: one read, nothing applied first").toBe(1);
    expect(newSource.requests[0].filter, "#2: with the filter inside it").toBe("{id} > 1");
    expect(newSource.requests[0].sort, "#3: and the sort").toEqual([{ field: "id", direction: "desc" }]);
  });
  test("the request carries a copy of the sort: a source that keeps it cannot change the list", () => {
    const { list, source } = createViewList(4, 0);
    list.sort = [{ field: "id", direction: "desc" }];
    source.requests[source.requests.length - 1].sort.push({ field: "name", direction: "asc" });
    expect(list.sort.length, "#1").toBe(1);
  });
});

/* A source that pages but cannot count what it pages: it answers without a total. hasMoreAnswer
   overrides the flag the list would otherwise infer from the length of the window. */
class NoTotalSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public keyField: string = "id";
  public requests: Array<IDynamicDataReadRequest> = [];
  public hasMoreAnswer: boolean = undefined;
  public failOnFilter: boolean = false;
  public ops: Array<string> = [];
  constructor(public records: Array<any>) { }
  /* >= 0: the answer arrives on a timer. A promise that is already resolved settles the read a
     commit starts of its own inside the same microtask drain, which hides whether the caller was
     given it to await. */
  public delay: number = -1;
  public read(request: IDynamicDataReadRequest): any {
    this.requests.push(request);
    if (this.failOnFilter && !!request.filter) throw new Error("the server cannot filter on that");
    const size = request.take > 0 ? request.take : this.records.length;
    const res: IDynamicDataReadResult = { records: this.records.slice(request.skip, request.skip + size) };
    if (this.hasMoreAnswer !== undefined) {
      res.hasMore = this.hasMoreAnswer;
    }
    if (this.delay < 0) return res;
    return new Promise((resolve: (value: any) => void): void => { setTimeout(() => resolve(res), this.delay); });
  }
  public remove(key: any): void {
    this.ops.push("remove:" + key);
    const at = indexOfId(this.records, key);
    if (at > -1)this.records.splice(at, 1);
  }
  public get skips(): Array<number> {
    return this.requests.map((request: IDynamicDataReadRequest): number => request.skip);
  }
}
// Lets every pending timer, and the microtasks behind it, run.
function settleTimers(times: number = 5): Promise<void> {
  let res = Promise.resolve();
  for (let i = 0; i < times; i++) {
    res = res.then((): Promise<void> => new Promise((resolve: () => void): void => { setTimeout(resolve, 0); }));
  }
  return res;
}

describe("DynamicDataList: a total the source may not know", () => {
  function createNoTotalList(recordCount: number, pageSize: number):
    { list: DynamicDataList, source: NoTotalSource } {
    const source = new NoTotalSource(createRecords(recordCount));
    const list = new DynamicDataList(source);
    list.pageSize = pageSize;
    list.load();
    return { list: list, source: source };
  }
  test("a full window: the count is a lower bound and one more page is known to exist", () => {
    const { list } = createNoTotalList(25, 10);
    expect(list.isCountKnown, "#1").toBe(false);
    expect(list.hasMore, "#2: a full window may have more behind it").toBe(true);
    expect(list.count, "#3: the records seen so far").toBe(10);
    expect(list.loadedCount, "#4").toBe(10);
    expect(list.pageCount, "#5: this page and the one that is known to follow").toBe(2);
  });
  test("the next page moves the lower bound", () => {
    const { list } = createNoTotalList(25, 10);
    list.pageIndex = 1;
    expect(list.count, "#1").toBe(20);
    expect(list.hasMore, "#2").toBe(true);
    expect(list.pageCount, "#3").toBe(3);
  });
  test("a short window is the end: the count is exact and there is no page behind it", () => {
    const { list } = createNoTotalList(25, 10);
    list.pageIndex = 1;
    list.pageIndex = 2;
    expect(list.loadedCount, "#1").toBe(5);
    expect(list.hasMore, "#2").toBe(false);
    expect(list.count, "#3").toBe(25);
    expect(list.pageCount, "#4: no page behind the last one").toBe(3);
    // The end IS the count: there is nothing behind the last record, so a source that cannot count
    // in advance has been counted by walking to its end.
    expect(list.isCountKnown, "#5").toBe(true);
    list.pageIndex = 0;
    expect(list.count, "#6: and the count it found survives a walk back").toBe(25);
    expect(list.isCountKnown, "#7").toBe(true);
    expect(list.pageCount, "#8").toBe(3);
  });
  test("hasMore false on a full window is the end although the window is full", () => {
    const { list, source } = createNoTotalList(25, 10);
    source.hasMoreAnswer = false;
    list.refresh();
    expect(list.loadedCount, "#1: a full window").toBe(10);
    expect(list.hasMore, "#2: and the source says it is the last one").toBe(false);
    expect(list.pageCount, "#3").toBe(1);
  });
  test("hasMore true on a short window keeps the pager going", () => {
    const { list, source } = createNoTotalList(25, 10);
    source.hasMoreAnswer = true;
    list.pageIndex = 1;
    list.pageIndex = 2;
    expect(list.loadedCount, "#1: a short window").toBe(5);
    expect(list.hasMore, "#2: which the source says is not the end").toBe(true);
    expect(list.pageCount, "#3").toBe(4);
  });
  test("a total wins over hasMore", () => {
    const records = createRecords(25);
    const source: IDynamicDataSource = {
      capabilities: { paging: true, filtering: true, sorting: true },
      read: (request: IDynamicDataReadRequest): IDynamicDataReadResult => ({
        records: records.slice(request.skip, request.skip + request.take), total: 25, hasMore: false
      })
    };
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    expect(list.isCountKnown, "#1").toBe(true);
    expect(list.count, "#2").toBe(25);
    expect(list.hasMore, "#3: computed from the total, not read from hasMore").toBe(true);
    expect(list.pageCount, "#4").toBe(3);
  });
  test("a source without paging always knows its count", () => {
    const list = createList(createRecords(7));
    expect(list.isCountKnown, "#1").toBe(true);
    expect(list.hasMore, "#2").toBe(false);
    expect(list.count, "#3").toBe(7);
  });
  test("take 0 asks for everything, so the window that comes back is the count", () => {
    const { list } = createNoTotalList(25, 0);
    expect(list.isCountKnown, "#1: the request asked for the whole storage").toBe(true);
    expect(list.hasMore, "#2").toBe(false);
    expect(list.count, "#3").toBe(25);
  });
});

describe("DynamicDataList: a page past the end", () => {
  test("an empty page steps back to the last page that has records, announcing only that one", () => {
    const source = new NoTotalSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    const changes = recordChanges(list);
    // Not clamped: nothing has been read yet, so there is no page count to clamp against. The
    // setter reads the page it was given.
    list.pageIndex = 5;
    expect(list.pageIndex, "#1: the last page that exists").toBe(2);
    expect(list.loadedCount, "#2").toBe(5);
    expect(list.count, "#3").toBe(25);
    expect(list.hasMore, "#4").toBe(false);
    expect(changes.filter((c: string): boolean => c === "reset").length, "#5: one reset").toBe(1);
    expect(source.requests.map((r: IDynamicDataReadRequest): number => r.skip),
      "#6: one page back per empty answer").toEqual([50, 40, 30, 20]);
  });
  test("an empty first page is committed as it is", () => {
    const source = new NoTotalSource([]);
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    expect(list.pageIndex, "#1").toBe(0);
    expect(list.count, "#2").toBe(0);
    expect(list.pageCount, "#3").toBe(1);
    expect(source.requests.length, "#4: nothing to step back to").toBe(1);
  });
  test("a page past a reported total reads the last page", () => {
    const source = new FakeRangeSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.pageIndex = 5;
    // The total came with the empty answer: it says where the end is, so the list goes straight to
    // the last page of it and reads that one - an empty window is never committed.
    expect(list.pageIndex, "#1: the last page of the total").toBe(2);
    expect(source.rangeCalls.map((c: any): number => c.skip), "#2: the page past the end, then the last one").toEqual([50, 20]);
    expect(list.getRecord(0).id, "#3: the window holds records 20-24").toBe(20);
    expect(list.loadedCount, "#3a").toBe(5);
    expect(list.windowOffset, "#4").toBe(20);
  });
});

describe("DynamicDataList: an unknown total and the window checks", () => {
  test("a remove on a full page with more behind it refills the page", () => {
    const source = new NoTotalSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    source.requests = [];
    list.remove(0);
    expect(source.ops, "#1: the record was removed").toEqual(["remove:0"]);
    expect(source.requests.length, "#2: one refill read").toBe(1);
    expect(list.loadedCount, "#3: the page is full again").toBe(10);
  });
  test("a remove on the last page reads nothing", () => {
    const source = new NoTotalSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 1;
    list.pageIndex = 2;
    source.requests = [];
    list.remove(0);
    expect(list.hasMore, "#1: nothing behind this page").toBe(false);
    expect(source.requests.length, "#2: no refill").toBe(0);
    expect(list.loadedCount, "#3").toBe(4);
  });
  test("ensureCount throws while the source has more, and does not once everything is loaded", () => {
    const source = new NoTotalSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    expect(list.windowOffset, "#1: the first page").toBe(0);
    expect(() => list.ensureCount(30), "#2: a window with more behind it is not the storage").toThrow();
    list.pageSize = 0;
    expect(list.hasMore, "#3: everything was read").toBe(false);
    expect(() => list.ensureCount(26), "#4").not.toThrow();
    expect(list.count, "#5").toBe(26);
  });
});

describe("DynamicDataList: the operation of a failed read", () => {
  test("a read that fails because of its filter is a failed read", () => {
    const source = new NoTotalSource(createRecords(4));
    source.failOnFilter = true;
    const list = new DynamicDataList(source);
    const operations: Array<string> = [];
    list.onError = (error: any, operation: string): void => { operations.push(operation); };
    list.load();
    list.filter = "{id} > 1";
    expect(operations, "#1").toEqual(["read"]);
  });
  /* The request is built inside the read's error handling: a sort array whose copy throws (a proxy,
     an accessor) is a failed read, and the read it superseded leaves no loading state behind. A
     source without paging is sent an empty view, so the sort is never copied for it at all. */
  function createThrowingSort(): { sort: Array<any>, arm: () => void } {
    let isArmed = false;
    const sort = new Proxy([{ field: "id", direction: "asc" }], {
      get: (target: any, prop: any): any => {
        if (isArmed && prop === "slice") throw new Error("the sort cannot be copied");
        return target[prop];
      }
    });
    return { sort: sort, arm: (): void => { isArmed = true; } };
  }
  test("a request that cannot be built is a failed read", () => {
    const source = new FakeAsyncRangeSource(createRecords(4));
    const list = new DynamicDataList(source);
    const operations: Array<string> = [];
    list.onError = (error: any, operation: string): void => { operations.push(operation); };
    const { sort, arm } = createThrowingSort();
    list.sort = sort;
    expect(list.isLoading, "#1: the read of the view is in flight").toBe(true);
    arm();
    expect(() => list.refresh(), "#2").not.toThrow();
    expect(operations, "#3").toEqual(["read"]);
    expect(list.isLoading, "#4: the superseded read left no loading state").toBe(false);
    expect(list.hasPendingRead, "#5").toBe(false);
  });
  test("a source without paging is not sent the sort", () => {
    const list = createList(createRecords(4));
    const operations: Array<string> = [];
    list.onError = (error: any, operation: string): void => { operations.push(operation); };
    const { sort, arm } = createThrowingSort();
    list.sort = sort;
    arm();
    expect(() => list.load(), "#1").not.toThrow();
    expect(operations, "#2").toEqual([]);
    expect(list.loadedCount, "#3").toBe(4);
  });
  test("a filter the list cannot run locally is a failed read too", () => {
    const list = createList(createRecords(4));
    const operations: Array<string> = [];
    list.onError = (error: any, operation: string): void => { operations.push(operation); };
    list.filter = "{id} >";
    expect(operations, "#1").toEqual(["read"]);
    expect(list.filter, "#2: showing every record beats showing none").toBe("");
  });
});

/* A source that cannot count its records: what the list does with an end it has already been
   shown. */
describe("DynamicDataList: the end of a source that cannot count", () => {
  test("removing the only record of the last page leaves the page that no longer exists", () => {
    const source = new NoTotalSource(createRecords(11));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 1;
    expect(list.loadedCount, "#1: the last page holds the one record").toBe(1);
    expect(list.count, "#2: a short window settled the count").toBe(11);
    source.requests = [];
    list.remove(0);
    expect(list.pageIndex, "#3: the page is gone, so it is left").toBe(0);
    expect(list.loadedCount, "#4: and the one before it is loaded").toBe(10);
    expect(list.count, "#5").toBe(10);
    expect(list.pageCount, "#6").toBe(1);
    expect(source.skips, "#7: one read, for the page that is shown now").toEqual([0]);
  });
  test("the end an empty page proved survives the read that steps back to it", () => {
    const source = new NoTotalSource(createRecords(20));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 1;
    expect(list.hasMore, "#1: a full window may have more behind it").toBe(true);
    source.requests = [];
    list.pageIndex = 2;
    expect(list.pageIndex, "#2: the page does not exist, so the list stepped back").toBe(1);
    expect(source.skips, "#3: the empty page and the step back").toEqual([20, 10]);
    expect(list.hasMore, "#4: nothing is behind this page - the empty answer said so").toBe(false);
    expect(list.count, "#5: which settles the count").toBe(20);
    expect(list.pageCount, "#6").toBe(2);
    source.requests = [];
    list.pageIndex = 2;
    expect(source.skips, "#7: the page is clamped away, nothing is read again").toEqual([]);
    expect(list.pageIndex, "#8").toBe(1);
  });
  test("the count found by walking to the end is not forgotten on the way back", () => {
    const source = new NoTotalSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 1;
    list.pageIndex = 2;
    expect(list.count, "#1: the last page settled it").toBe(25);
    list.pageIndex = 0;
    expect(list.count, "#2: a page in front of a known end keeps it").toBe(25);
    expect(list.isCountKnown, "#3").toBe(true);
    expect(list.hasMore, "#4").toBe(true);
    expect(list.pageCount, "#5").toBe(3);
  });
  test("a filter of its own: the end found for another set of records is dropped", () => {
    const source = new NoTotalSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 1;
    list.pageIndex = 2;
    expect(list.isCountKnown, "#1: the end of the unfiltered records was found").toBe(true);
    // The fake source ignores the filter, so its answer is a full first window: with the count of
    // the other view still in force the list would claim to know a count it has not seen.
    list.filter = "{id} > 1";
    expect(list.isCountKnown, "#2: another set of records, another end").toBe(false);
    expect(list.count, "#3: the records seen so far").toBe(10);
  });
  test("a read that steps back to another page is the one load() resolves with", async () => {
    const source = new NoTotalSource(createRecords(20));
    source.delay = 0;
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    await list.load();
    list.pageIndex = 1;
    await settleTimers();
    expect(list.getRecord(0).id, "#1: the second page is loaded").toBe(10);
    // The records behind the first page are gone: the refresh of this window answers empty.
    source.records = source.records.slice(0, 10);
    await list.refresh();
    expect(list.isLoading, "#2: the promise waited for the read that replaced the empty one").toBe(false);
    expect(list.pageIndex, "#3: it stepped back").toBe(0);
    expect(list.loadedCount, "#4: and the window it committed is the one that is readable").toBe(10);
    expect(list.getRecord(0).id, "#5").toBe(0);
  });
});

/* A total that changes under the pager. */
describe("DynamicDataList: a reported total that shrinks", () => {
  test("the page past the new total is not committed empty: the last page of it is read", () => {
    const source = new FakeRangeSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 2;
    expect(list.windowOffset, "#1: the third page").toBe(20);
    source.records = createRecords(15);
    source.rangeCalls = [];
    const changes = recordChanges(list);
    list.refresh();
    expect(list.pageIndex, "#2: the last page of 15 records").toBe(1);
    expect(list.windowOffset, "#3").toBe(10);
    expect(list.loadedCount, "#4: records 10-14").toBe(5);
    expect(list.getRecord(0).id, "#5").toBe(10);
    expect(list.getRecord(4).id, "#6").toBe(14);
    expect(list.count, "#7").toBe(15);
    expect(list.pageCount, "#8").toBe(2);
    expect(source.rangeCalls.map((c: any): number => c.skip), "#9: the empty page, then the last one").toEqual([20, 10]);
    expect(changes, "#10: one reset, for the window that was committed").toEqual(["reset"]);
  });
  test("a total that shrinks to 0 reads the first page once and commits it empty", () => {
    const source = new FakeRangeSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 2;
    source.records = [];
    source.rangeCalls = [];
    list.refresh();
    expect(list.pageIndex, "#1").toBe(0);
    expect(list.windowOffset, "#2").toBe(0);
    expect(list.loadedCount, "#3").toBe(0);
    expect(list.count, "#4").toBe(0);
    expect(source.rangeCalls.map((c: any): number => c.skip), "#5: one retry at skip 0, no third read").toEqual([20, 0]);
  });
  test("an asynchronous retry: the window in force stays until the last page commits, and refresh() waits for it", async () => {
    const records = createRecords(25);
    const skips: Array<number> = [];
    const source: IDynamicDataSource = {
      capabilities: { paging: true, filtering: true, sorting: true },
      read: (request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> => {
        skips.push(request.skip);
        const current = records.slice();
        return Promise.resolve({ records: current.slice(request.skip, request.skip + request.take), total: current.length });
      }
    };
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    await list.load();
    list.pageIndex = 2;
    await flush();
    records.splice(15);
    await list.refresh();
    expect(list.isLoading, "#1: the promise waited for the retry").toBe(false);
    expect(list.pageIndex, "#2").toBe(1);
    expect(list.getRecord(0).id, "#3").toBe(10);
    expect(skips.slice(-2), "#4").toEqual([20, 10]);
  });
});

/* A source without a total that always says whether there is something behind the window. */
class ExplicitHasMoreSource extends NoTotalSource {
  public read(request: IDynamicDataReadRequest): any {
    this.requests.push(request);
    const size = request.take > 0 ? request.take : this.records.length;
    return {
      records: this.records.slice(request.skip, request.skip + size),
      hasMore: request.skip + size < this.records.length
    };
  }
}
describe("DynamicDataList: a discovered total and a source that grew", () => {
  function createDiscoveredList(): { list: DynamicDataList, source: ExplicitHasMoreSource } {
    const source = new ExplicitHasMoreSource(createRecords(20));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    list.pageIndex = 1;
    expect(list.isCountKnown, "the second page answered hasMore false: the end is found").toBe(true);
    expect(list.count, "the discovered total").toBe(20);
    source.records = createRecords(30);
    return { list: list, source: source };
  }
  test("hasMore true at the discovered end drops the end: the pages behind it can be reached", () => {
    const { list, source } = createDiscoveredList();
    list.refresh();
    expect(list.hasMore, "#1: the source says there is more").toBe(true);
    expect(list.isCountKnown, "#2").toBe(false);
    expect(list.pageCount, "#3: one more page is known to exist").toBe(3);
    source.requests = [];
    list.pageIndex = 2;
    expect(source.skips, "#4").toEqual([20]);
    expect(list.pageIndex, "#5").toBe(2);
    expect(list.hasMore, "#6").toBe(false);
    expect(list.count, "#7: the new end").toBe(30);
    expect(list.isCountKnown, "#8").toBe(true);
  });
  test("hasMore true on a page in front of the discovered end keeps it: no contradiction", () => {
    const { list } = createDiscoveredList();
    list.pageIndex = 0;
    list.refresh();
    expect(list.isCountKnown, "#1").toBe(true);
    expect(list.count, "#2").toBe(20);
    expect(list.hasMore, "#3").toBe(true);
    expect(list.pageCount, "#4").toBe(2);
  });
});

/* The page a retry reads is not committed before its window is. */
describe("DynamicDataList: a retry that fails changes nothing", () => {
  function createFailingSource(count: number): { source: IDynamicDataSource, records: Array<any>, skips: Array<number>, failAt: Array<number> } {
    const records = createRecords(count);
    const skips: Array<number> = [];
    const failAt: Array<number> = [];
    const source: IDynamicDataSource = {
      capabilities: { paging: true, filtering: true, sorting: true },
      read: (request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> => {
        skips.push(request.skip);
        if (failAt.indexOf(request.skip) > -1) return Promise.reject(new Error("the retry failed"));
        const current = records.slice();
        return Promise.resolve({ records: current.slice(request.skip, request.skip + request.take), total: current.length });
      }
    };
    return { source: source, records: records, skips: skips, failAt: failAt };
  }
  test("a reported total: the window in force keeps its page, total and count, and the previous page is read", async () => {
    const { source, records, skips, failAt } = createFailingSource(25);
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.pageSize = 10;
    await list.load();
    list.pageIndex = 2;
    await flush();
    records.splice(15);
    failAt.push(10);
    skips.length = 0;
    await list.refresh();
    await flush();
    expect(skips, "#1: the empty page and the retry").toEqual([20, 10]);
    expect(errors, "#2").toEqual(["read"]);
    expect(list.isLoading, "#3").toBe(false);
    expect(list.pageIndex, "#4: the page of the window in force").toBe(2);
    expect(list.windowOffset, "#5").toBe(20);
    expect(list.getRecord(0).id, "#6").toBe(20);
    expect(list.count, "#7: the total of the window in force").toBe(25);
    expect(list.pageCount, "#8").toBe(3);
    failAt.length = 0;
    skips.length = 0;
    list.pageIndex = 1;
    await flush();
    expect(skips, "#9: the previous page is a real page change").toEqual([10]);
    expect(list.pageIndex, "#10").toBe(1);
    expect(list.getRecord(0).id, "#11").toBe(10);
    expect(list.count, "#12").toBe(15);
  });
  test("an unknown total: the step back that fails keeps the page and the end unproven", async () => {
    const source = new NoTotalSource(createRecords(20));
    source.delay = 0;
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.pageSize = 10;
    await list.load();
    list.pageIndex = 1;
    await settleTimers();
    source.records = source.records.slice(0, 10);
    const read = source.read.bind(source);
    let failed = 0;
    source.read = (request: IDynamicDataReadRequest): any => {
      if (request.skip !== 0) return read(request);
      failed++;
      return Promise.reject(new Error("failed"));
    };
    await list.refresh();
    await settleTimers();
    expect(source.skips.slice(-1), "#1: the empty page").toEqual([10]);
    expect(failed, "#1a: and the step back").toBe(1);
    expect(errors, "#2").toEqual(["read"]);
    expect(list.pageIndex, "#3: the page of the window in force").toBe(1);
    expect(list.windowOffset, "#4").toBe(10);
    expect(list.isCountKnown, "#5: the end the empty answer proved went with the retry").toBe(false);
    expect(list.hasMore, "#6").toBe(true);
  });
});

/* The pending retry is dropped by a read asked for from outside, and survives the reissue
   of a retry that a write overtook. Each read answers when the test says so, with the server as it
   is by then. */
describe("DynamicDataList: the pending retry", () => {
  class HeldRangeSource implements IDynamicDataSource {
    public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
    public keyField: string = "id";
    public skips: Array<number> = [];
    public held: Array<() => void> = [];
    constructor(public records: Array<any>) { }
    public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
      this.skips.push(request.skip);
      const deferred = new Deferred();
      this.held.push((): void => deferred.resolve());
      return deferred.promise.then((): IDynamicDataReadResult =>
        ({ records: this.records.slice(request.skip, request.skip + request.take), total: this.records.length }));
    }
    public insert(record: any, sourceIndex: number): any {
      const stored = Object.assign({ id: 1000 + this.records.length }, record);
      this.records.splice(sourceIndex, 0, stored);
      return Object.assign({}, stored);
    }
    public async answerNext(): Promise<void> {
      this.held.shift()();
      await flush();
    }
  }
  async function createOnLastPage(): Promise<{ list: DynamicDataList, source: HeldRangeSource }> {
    const source = new HeldRangeSource(createRecords(25));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    await source.answerNext();
    list.pageIndex = 2;
    await source.answerNext();
    expect(list.windowOffset, "the third page is loaded").toBe(20);
    source.skips = [];
    // The storage shrinks: the refresh of the third page answers empty, and the retry of the last
    // page of 15 records is left in flight.
    source.records.splice(15);
    list.refresh();
    await source.answerNext();
    expect(source.skips, "the empty page and the retry in flight").toEqual([20, 10]);
    expect(list.pageIndex, "the retry is not committed yet").toBe(2);
    return { list: list, source: source };
  }
  test("a page change while a retry is pending drops the retry: its page is not applied to the page read instead", async () => {
    const { list, source } = await createOnLastPage();
    list.pageIndex = 0;
    expect(source.skips, "#1: the first page is read, superseding the retry").toEqual([20, 10, 0]);
    await source.answerNext();
    await source.answerNext();
    expect(list.pageIndex, "#2: the page that was asked for, not the retry's").toBe(0);
    expect(list.windowOffset, "#3").toBe(0);
    expect(list.getRecord(0).id, "#4").toBe(0);
    expect(list.count, "#5").toBe(15);
    expect(list.isLoading, "#6").toBe(false);
  });
  test("a retry that a write overtook is issued again for the same page", async () => {
    const { list, source } = await createOnLastPage();
    // An insert overtakes every read in flight.
    list.add({ id: 100, name: "new" });
    await source.answerNext();
    expect(source.skips, "#1: the retry is read again, not the page past the end").toEqual([20, 10, 10]);
    await source.answerNext();
    expect(list.pageIndex, "#2: the retry's page").toBe(1);
    expect(list.windowOffset, "#3").toBe(10);
    expect(list.count, "#4: 15 records and the one inserted").toBe(16);
    expect(list.isLoading, "#5").toBe(false);
  });
});

describe("DynamicDataList: a new record's identity", () => {
  function createKeyedList(): { list: DynamicDataList, source: FakeKeyedSource, errors: Array<string> } {
    const source = new FakeKeyedSource([{ id: 1, name: "a" }]);
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation + ":" + error.message); };
    list.load();
    return { list: list, source: source, errors: errors };
  }
  test("add takes the key out of the record, on a copy", () => {
    const { list, source } = createKeyedList();
    const record = { id: 5, name: "x" };
    list.add(record);
    expect(source.payloads[0], "#1: the payload has no key").toEqual({ name: "x" });
    expect(record, "#2: the caller's object is not mutated").toEqual({ id: 5, name: "x" });
    expect(list.getRecord(1), "#3: the assigned key").toEqual({ id: 1000, name: "x" });
    source.holdInserts = true;
    const plain = { name: "y" };
    list.add(plain);
    expect(list.getRecord(2), "#4: a record without the key field keeps its identity").toBe(plain);
  });
  test("the answer's key wins over a key the window record carries", async () => {
    const { list, source, errors } = createKeyedList();
    source.holdInserts = true;
    list.add({ name: "x" });
    list.setRecord(1, { id: 1, name: "x" });
    expect(list.getRecord(1).id, "#1: the injected key is in the window").toBe(1);
    source.releaseInserts();
    await flush();
    expect(list.getRecord(1).id, "#2: the answer's key").toBe(1000);
    expect(errors, "#3").toEqual([]);
    expect(source.ops, "#4: the setRecord waited for the key").toEqual(["insert:1", "update:1000"]);
    expect(source.payloads[1].id, "#5: its payload names the assigned key, not the injected one").toBe(1000);
    expect(source.records[0], "#6: the record that owns the injected key is unchanged").toEqual({ id: 1, name: "a" });
  });
  test("a field the client wrote and cleared while the insert was held stays cleared", async () => {
    const { list, source } = createKeyedList();
    source.insertDefaults = { col3: "default", createdBy: "server" };
    source.holdInserts = true;
    list.add({ name: "x" });
    list.setValue(1, "col3", "mine");
    list.setValue(1, "col3", undefined);
    source.releaseInserts();
    await flush();
    const record = list.getRecord(1);
    expect("col3" in record, "#1: not the server default of a field the client cleared").toBe(false);
    expect(record.createdBy, "#2: a field the client never touched arrives").toBe("server");
    expect(record.id, "#3").toBe(1000);
    expect(record.name, "#4").toBe("x");
  });
  test("a later edit does not change what an earlier queued update sends", async () => {
    const { list, source } = createKeyedList();
    source.insertDefaults = { status: "server-default" };
    source.holdInserts = true;
    list.add({});
    list.setValue(1, "name", "first");
    list.setValue(1, "status", "edited");
    source.releaseInserts();
    await flush();
    expect(source.ops, "#1").toEqual(["insert:1", "update:1000", "update:1000"]);
    expect(source.payloads[1], "#2: the first update owns name only - the server's status stays")
      .toEqual({ id: 1000, name: "first", status: "server-default" });
    expect(source.payloads[2], "#3: the second one owns status").toEqual({ id: 1000, name: "first", status: "edited" });
    expect(list.getRecord(1), "#4: the window merge takes every field the client owns")
      .toEqual({ id: 1000, name: "first", status: "edited" });
  });
});

describe("a throwing callback does not leave a guard behind", () => {
  // Throws the first time only: the calls after it are the ones the tests look at.
  function throwOnce(): () => void {
    let isThrown = false;
    return (): void => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("user code");
    };
  }
  test("setValue: a page clamp that throws inside the write", () => {
    // A bare list: its membership is not frozen on edit, so an edit that leaves the filter clamps.
    const list = createList(createRecords(3));
    list.filter = "{name} notempty";
    list.pageSize = 1;
    list.pageIndex = 2;
    const throwIt = throwOnce();
    list.onChanged = (change: IDynamicDataListChange): void => {
      if (change.type === "pageChanged") throwIt();
    };
    expect(() => list.setValue(2, "name", ""), "#1: the clamp raised pageChanged inside the write").toThrow();
    expect(list.pageIndex, "#2").toBe(1);
    expect(list.isWriting, "#3").toBe(false);
    // A same-length content change the list cannot see: invalidateViews is how it learns about it.
    list.getRecord(0).name = "";
    list.invalidateViews();
    expect(list.getVisibleIndexes(), "#4: the view was re-decided").toEqual([1]);
    expect(list.pageIndex, "#5").toBe(0);
  });
  test("add: onError throws for a push the source rejected synchronously", () => {
    // Not an array source: that one re-reads its storage after a synchronous push.
    const source: IDynamicDataSource = {
      keyField: "id",
      read: (): Array<any> => createRecords(1),
      insert: (): any => { throw new Error("rejected"); }
    };
    const list = new DynamicDataList(source);
    list.load();
    list.onError = throwOnce();
    expect(() => list.add({ id: 1 }), "#1").toThrow();
    expect(list.isWriting, "#2").toBe(false);
    expect(list.loadedCount, "#3: the local change is kept").toBe(2);
    expect(list.add({ id: 2 }), "#4: the next add works").toBe(2);
    expect(list.isWriting, "#5").toBe(false);
    expect(list.loadedCount, "#6").toBe(3);
  });
  test("ensureCount: createRecord throws on the second record", () => {
    const list = createList([]);
    const throwIt = throwOnce();
    expect(() => list.ensureCount(3, (i: number): any => {
      if (i === 1) throwIt();
      return { id: i };
    }), "#1").toThrow();
    expect(list.isWriting, "#2").toBe(false);
    expect(list.loadedCount, "#3: the first record was added").toBe(1);
  });
});

describe("DynamicDataList: the owner's globalVisibleIndex", () => {
  test("an array source: the page starts at pageIndex * pageSize while the list pages, the offset is 0", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(6)));
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    list.setRecordVisible(1, false);
    expect(list.isPagedBySource, "#0").toBe(false);
    expect(list.getPageStartGlobalVisibleIndex(), "#1").toBe(2);
    expect(list.getRecordNumberOffset(), "#2: the window of an array source starts at 0").toBe(0);
    expect(list.getGlobalVisibleIndex(2), "#3: record 1 is hidden").toBe(1);
    expect(list.getGlobalVisibleIndex(1), "#4: a hidden record").toBe(-1);
    expect(list.getIndexAtGlobalVisibleIndex(1), "#5").toBe(2);
    expect(list.getIndexAtGlobalVisibleIndex(4), "#6: the last visible record").toBe(5);
    expect(list.getIndexAtGlobalVisibleIndex(5), "#7: past the last").toBe(-1);
    expect(list.getIndexAtGlobalVisibleIndex(-1), "#8: before the first").toBe(-1);
    list.pageSize = 0;
    expect(list.getPageStartGlobalVisibleIndex(), "#9: the list does not page").toBe(0);
  });
  test("a source that pages itself: the page and the record numbers start at the window offset", () => {
    const list = new DynamicDataList(new FakeRangeSource(createRecords(10)));
    list.pageSize = 3;
    list.load();
    list.pageIndex = 1;
    expect(list.isPagedBySource, "#0").toBe(true);
    expect(list.windowOffset, "#1").toBe(3);
    expect(list.getPageStartGlobalVisibleIndex(), "#2").toBe(3);
    expect(list.getRecordNumberOffset(), "#3").toBe(3);
    expect(list.getGlobalVisibleIndex(1), "#4: window record 1 is record 4 of the whole list").toBe(4);
    expect(list.getIndexAtGlobalVisibleIndex(4), "#5").toBe(1);
    expect(list.getIndexAtGlobalVisibleIndex(2), "#6: before the window").toBe(-1);
    expect(list.getIndexAtGlobalVisibleIndex(1), "#7: before the window").toBe(-1);
    expect(list.getIndexAtGlobalVisibleIndex(6), "#8: past the window").toBe(-1);
  });
});

/* An insertion names the record it goes in front of, as a record index of the loaded window, or
   loadedCount for the end. A position of the whole view counts the visible records; a position
   among the objects counts the materialized records (the page under paging). */
describe("DynamicDataList: insert positions and record lookup over a view", () => {
  // Records 0..7, record 3 filtered out, sorted descending, record 5 hidden by the owner:
  // the visible records are 7, 6, 4, 2, 1, 0.
  const createViewList = (): DynamicDataList => {
    const list = createList(createRecords(8));
    list.filter = "{id} <> 3";
    list.sort = [{ field: "id", direction: "desc" }];
    list.setRecordVisible(5, false);
    return list;
  };
  test("a position of the whole view: the record at it, the end past the last visible record", () => {
    const list = createViewList();
    expect(list.getVisibleIndexes(), "#0").toEqual([7, 6, 4, 2, 1, 0]);
    expect(list.getInsertIndexAtVisibleIndex(0), "#1: the first").toBe(7);
    expect(list.getInsertIndexAtVisibleIndex(2), "#2: past the hidden record").toBe(4);
    expect(list.getInsertIndexAtVisibleIndex(5), "#3: the last").toBe(0);
    expect(list.getInsertIndexAtVisibleIndex(6), "#4: right after the last").toBe(8);
    expect(list.getInsertIndexAtVisibleIndex(20), "#5: far past the last").toBe(8);
    expect(list.getInsertIndexAtVisibleIndex(-1), "#6: a negative position appends").toBe(8);
  });
  test("an empty view appends", () => {
    const list = createList(createRecords(3));
    list.filter = "{id} > 10";
    expect(list.getVisibleIndexes(), "#0").toEqual([]);
    expect(list.getInsertIndexAtVisibleIndex(0), "#1").toBe(3);
    expect(list.getInsertIndexAtVisibleIndex(2), "#2").toBe(3);
    expect(list.getInsertIndexAtMaterializedPosition(0), "#3").toBe(3);
  });
  test("in-memory paging: a position of the whole view does not depend on the page", () => {
    const list = createViewList();
    list.pageSize = 2;
    list.pageIndex = 1;
    expect(list.getPageIndexes(), "#0").toEqual([4, 2]);
    expect(list.getInsertIndexAtVisibleIndex(1), "#1: the last record of page 0").toBe(6);
    expect(list.getInsertIndexAtVisibleIndex(2), "#2: the first record of page 1").toBe(4);
    expect(list.getInsertIndexAtVisibleIndex(4), "#3: the first record of page 2").toBe(1);
    expect(list.getInsertIndexAtVisibleIndex(6), "#4: the end").toBe(8);
  });
  test("a position among the objects: the record at it, the end at or past the last one", () => {
    const list = createViewList();
    list.pageSize = 2;
    list.pageIndex = 1;
    expect(list.getInsertIndexAtMaterializedPosition(0), "#1").toBe(4);
    expect(list.getInsertIndexAtMaterializedPosition(1), "#2").toBe(2);
    expect(list.getInsertIndexAtMaterializedPosition(2), "#3: at the end of the page").toBe(8);
    expect(list.getInsertIndexAtMaterializedPosition(5), "#4: past it").toBe(8);
    expect(list.getInsertIndexAtMaterializedPosition(-1), "#5: before the first is the first").toBe(4);
    list.pageSize = 0;
    expect(list.getInsertIndexAtMaterializedPosition(1), "#6: without paging the objects are the created records").toBe(6);
    expect(list.getInsertIndexAtMaterializedPosition(2), "#7: a hidden record has an object").toBe(5);
    expect(list.getInsertIndexAtMaterializedPosition(7), "#8").toBe(8);
  });
  test("a source that pages itself: inside the window, at its end, outside it and past the whole view", () => {
    const list = new DynamicDataList(new FakeRangeSource(createRecords(10)));
    list.pageSize = 3;
    list.load();
    list.pageIndex = 1;
    list.setRecordVisible(1, false);
    expect(list.windowOffset, "#0").toBe(3);
    expect(list.getVisibleIndexes(), "#0a: the window holds ids 3, 4, 5; id 4 is hidden").toEqual([0, 2]);
    expect(list.getInsertIndexAtVisibleIndex(2), "#1: before the window").toBe(-1);
    expect(list.getInsertIndexAtVisibleIndex(3), "#2: the first visible record of the window").toBe(0);
    expect(list.getInsertIndexAtVisibleIndex(4), "#3: past the hidden record").toBe(2);
    expect(list.getInsertIndexAtVisibleIndex(5), "#4: the end of the window").toBe(3);
    expect(list.getInsertIndexAtVisibleIndex(6), "#5: past the window, inside the whole view").toBe(-1);
    expect(list.getInsertIndexAtVisibleIndex(10), "#6: past the whole view appends to the window").toBe(3);
    expect(list.getInsertIndexAtVisibleIndex(-1), "#7").toBe(3);
    expect(list.getInsertIndexAtMaterializedPosition(1), "#8: the objects are the visible records of the window").toBe(2);
    expect(list.getInsertIndexAtMaterializedPosition(2), "#9").toBe(3);
  });
  test("the visible records of the whole view, and whether there are records beyond the known ones", () => {
    const list = createViewList();
    expect(list.globalVisibleCount, "#1: the visible records the list holds").toBe(6);
    expect(list.hasRecordBeyondKnown, "#2: a local list knows its count").toBe(false);
    const paged = new DynamicDataList(new FakeRangeSource(createRecords(10)));
    paged.pageSize = 3;
    paged.load();
    paged.setRecordVisible(1, false);
    expect(paged.visibleCount, "#3: the window").toBe(2);
    expect(paged.globalVisibleCount, "#4: a source that pages itself: its total").toBe(10);
    expect(paged.hasRecordBeyondKnown, "#5: the total is known").toBe(false);
    const source = new FakeRangeSource(createRecords(10));
    source.read = (request: IDynamicDataReadRequest): IDynamicDataReadResult =>
      ({ records: source.records.slice(request.skip, request.skip + request.take) });
    const unknown = new DynamicDataList(source);
    unknown.pageSize = 3;
    unknown.load();
    expect(unknown.globalVisibleCount, "#6: the records known so far").toBe(3);
    expect(unknown.hasRecordBeyondKnown, "#7: a full window without a total").toBe(true);
    for (let i = 1; i <= 3; i++) unknown.pageIndex = i;
    expect(unknown.globalVisibleCount, "#8: the end was read").toBe(10);
    expect(unknown.hasRecordBeyondKnown, "#9").toBe(false);
  });
  test("indexOfRecord: a record of the window, one a write replaced, one outside the window", () => {
    const list = createList(createRecords(4));
    const record = list.getRecord(2);
    expect(list.indexOfRecord(record), "#1").toBe(2);
    list.setValue(2, "name", "changed");
    expect(list.indexOfRecord(record), "#2: the write made a copy").toBe(-1);
    expect(list.indexOfRecord(list.getRecord(2)), "#3: the copy is found").toBe(2);
    expect(list.indexOfRecord({ id: 2, name: "changed" }), "#4: an equal object is not the record").toBe(-1);
    const paged = new DynamicDataList(new FakeRangeSource(createRecords(10)));
    paged.pageSize = 3;
    paged.load();
    const first = paged.getRecord(0);
    paged.pageIndex = 1;
    expect(paged.indexOfRecord(first), "#5: a record of another window").toBe(-1);
    expect(paged.indexOfRecord(paged.getRecord(1)), "#6").toBe(1);
  });
});

describe("DynamicDataList: the assigned source", () => {
  function createOwnerList(): { list: DynamicDataList, setArray: (arr: Array<any>) => void } {
    let arr: Array<any> = createRecords(3);
    const list = DynamicDataList.createReadThrough(undefined, (): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    return { list: list, setArray: (a: Array<any>): void => { arr = a; } };
  }
  test("createReadThrough: the default source reads through the owner's storage and nothing is assigned", () => {
    const { list, setArray } = createOwnerList();
    expect(list.isRemote, "#1").toBe(false);
    expect(list.assignedSource === undefined, "#2").toBe(true);
    expect(list.source instanceof ArrayDynamicDataSource, "#3").toBe(true);
    expect(list.isReadThrough, "#4").toBe(true);
    expect(list.isViewFrozenOnEdit, "#5").toBe(true);
    expect(list.loadedCount, "#6").toBe(3);
    setArray(createRecords(5));
    expect(list.loadedCount, "#7: read through, no load()").toBe(5);
  });
  test("assignSource: the flag is set first, then onAssigning runs with the old source in place, then the swap", () => {
    const { list } = createOwnerList();
    const defaultSource = list.source;
    const fake = new FakeRangeSource(createRecords(10));
    const seen: Array<Array<boolean>> = [];
    list.assignSource(fake, (): void => { seen.push([list.isRemote, list.assignedSource === fake, list.source === defaultSource]); });
    expect(seen, "#1: isRemote, assignedSource, the old source").toEqual([[true, true, true]]);
    expect(list.isRemote, "#2").toBe(true);
    expect(list.assignedSource === fake, "#3").toBe(true);
    expect(list.source === fake, "#4").toBe(true);
    expect(fake.rangeCalls.length, "#5: the new source is read").toBe(1);
  });
  test("assignSource(undefined): a new default source over the owner's storage on every detach", () => {
    const { list, setArray } = createOwnerList();
    const firstDefault = list.source;
    const fake = new FakeRangeSource(createRecords(10));
    list.assignSource(fake);
    const seen: Array<Array<boolean>> = [];
    list.assignSource(undefined, (): void => { seen.push([list.isRemote, list.source === fake]); });
    expect(seen, "#1: isRemote, the old source").toEqual([[false, true]]);
    expect(list.isRemote, "#2").toBe(false);
    expect(list.assignedSource === undefined, "#3").toBe(true);
    const secondDefault = list.source;
    expect(secondDefault instanceof ArrayDynamicDataSource, "#4").toBe(true);
    expect(secondDefault !== firstDefault, "#5: a new instance").toBe(true);
    setArray([{ id: 7, name: "outside" }]);
    expect(list.getRecord(0), "#6: read through, no load()").toEqual({ id: 7, name: "outside" });
    list.assignSource(new FakeRangeSource(createRecords(2)));
    list.assignSource(null);
    expect(list.source instanceof ArrayDynamicDataSource, "#7: null detaches too").toBe(true);
    expect(list.source !== secondDefault, "#8: another new instance").toBe(true);
    expect(list.loadedCount, "#9").toBe(1);
  });
  test("assignSource with the source that is already assigned does nothing", () => {
    const { list } = createOwnerList();
    const fake = new FakeRangeSource(createRecords(10));
    list.assignSource(fake);
    let calls = 0;
    list.assignSource(fake, (): void => { calls++; });
    expect(calls, "#1").toBe(0);
    expect(fake.rangeCalls.length, "#2: not read again").toBe(1);
    list.assignSource(undefined);
    const defaultSource = list.source;
    list.assignSource(undefined, (): void => { calls++; });
    expect(calls, "#3").toBe(0);
    expect(list.source === defaultSource, "#4").toBe(true);
  });
  test("a standalone list keeps its source on a detach, and the source setter does not assign", () => {
    const own = ArrayDynamicDataSource.fromArray(createRecords(2));
    const list = new DynamicDataList(own);
    list.load();
    list.source = new FakeRangeSource(createRecords(4));
    expect(list.isRemote, "#1: the setter is the low-level swap").toBe(false);
    list.source = own;
    const fake = new FakeRangeSource(createRecords(4));
    list.assignSource(fake);
    expect(list.source === fake, "#2").toBe(true);
    expect(list.isRemote, "#3").toBe(true);
    list.assignSource(undefined);
    expect(list.isRemote, "#4").toBe(false);
    expect(list.source === fake, "#5: there is no default source to go back to").toBe(true);
  });
  test("dispose drops the default-source factory", () => {
    const { list } = createOwnerList();
    list.dispose();
    expect((<any>list).createDefaultSource === undefined, "#1").toBe(true);
  });
  // Ownership decides, not the class of the source.
  function createAssignedArray(count: number): { source: ArrayDynamicDataSource, get: () => Array<any>, set: (arr: Array<any>) => void } {
    let arr: Array<any> = createRecords(count);
    const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    return { source: source, get: (): Array<any> => arr, set: (a: Array<any>): void => { arr = a; } };
  }
  test("an assigned ArrayDynamicDataSource gets a window and is read again by refresh()", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(2);
    list.assignSource(assigned.source);
    expect(list.isReadThrough, "#1: the flag stays, it is about the owner's storage").toBe(true);
    expect(list.loadedCount, "#2: read by the swap").toBe(2);
    assigned.set([{ id: 7, name: "outside" }, { id: 8, name: "outside" }, { id: 9, name: "outside" }]);
    expect(list.loadedCount, "#3: not read through").toBe(2);
    expect(list.count, "#4").toBe(2);
    expect(list.getRecord(0), "#5").toEqual({ id: 0, name: "r0" });
    list.refresh();
    expect(list.loadedCount, "#7: read again").toBe(3);
    expect(list.getRecord(0), "#8").toEqual({ id: 7, name: "outside" });
  });
  test("an assigned ArrayDynamicDataSource: inside onAssigning the default source is still read through", () => {
    const { list, setArray } = createOwnerList();
    const assigned = createAssignedArray(2);
    setArray(createRecords(5));
    const seen: Array<number> = [];
    list.assignSource(assigned.source, (): void => { seen.push(list.loadedCount); });
    expect(seen, "#1: the owner's storage as it is now, not the window of the first load").toEqual([5]);
    expect(list.loadedCount, "#2").toBe(2);
  });
  test("an assigned ArrayDynamicDataSource: the writes reach the array and the window follows them", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    const names = (arr: Array<any>): Array<any> => arr.map((r: any): any => r.name);
    list.setValue(1, "name", "edited");
    expect(names(assigned.get()), "#1 edit").toEqual(["r0", "edited", "r2"]);
    expect(names(list.getLoadedRecords()), "#2").toEqual(["r0", "edited", "r2"]);
    list.add({ name: "added" });
    expect(names(assigned.get()), "#3 add").toEqual(["r0", "edited", "r2", "added"]);
    expect(names(list.getLoadedRecords()), "#4").toEqual(["r0", "edited", "r2", "added"]);
    list.remove(0);
    expect(names(assigned.get()), "#5 remove").toEqual(["edited", "r2", "added"]);
    expect(names(list.getLoadedRecords()), "#6").toEqual(["edited", "r2", "added"]);
    list.move(0, 2);
    expect(names(assigned.get()), "#7 move").toEqual(["r2", "added", "edited"]);
    expect(names(list.getLoadedRecords()), "#8").toEqual(["r2", "added", "edited"]);
    list.batch((): void => {
      list.add({ name: "b1" });
      list.setValue(0, "name", "b0");
    });
    expect(names(assigned.get()), "#9 batch").toEqual(["b0", "added", "edited", "b1"]);
    expect(names(list.getLoadedRecords()), "#10").toEqual(["b0", "added", "edited", "b1"]);
    expect(list.count, "#11").toBe(4);
  });
  test("a detach from an assigned ArrayDynamicDataSource reads through the owner's storage again", () => {
    const { list, setArray } = createOwnerList();
    const assigned = createAssignedArray(2);
    list.assignSource(assigned.source);
    list.assignSource(undefined);
    expect(list.loadedCount, "#1").toBe(3);
    setArray(createRecords(5));
    expect(list.loadedCount, "#2: read through, no load()").toBe(5);
  });
  test("a standalone list that reads through keeps doing so; one that was assigned a source does not", () => {
    const own = createAssignedArray(2);
    const list = new DynamicDataList(own.source);
    list["isReadThroughValue"] = true;
    list.load();
    own.set(createRecords(4));
    expect(list.loadedCount, "#1: the source it was constructed with is its own").toBe(4);
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    assigned.set(createRecords(6));
    expect(list.loadedCount, "#2: an assigned one is not read through").toBe(3);
  });
  /* A synchronous push to an ArrayDynamicDataSource ends in syncWindowAfterSyncPush, which
     takes the array the push has written. For an assigned source that array is the developer's, and
     taking it would bring a change made outside the list into the window with the next write and
     without a reset - so the window of an assigned source keeps the list's own writes only. */
  test("a write to an assigned ArrayDynamicDataSource does not take an outside change into the window", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    const changes = recordChanges(list);
    assigned.set([{ id: 7, name: "outside0" }, { id: 8, name: "outside1" }, { id: 9, name: "outside2" }]);
    list.setValue(2, "name", "edited");
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#1: the window").toEqual(["r0", "r1", "edited"]);
    expect(assigned.get().map((r: any): any => r.name), "#2: the array").toEqual(["outside0", "outside1", "edited"]);
    expect(assigned.get()[2].id, "#3: the edit was made on the record the window held").toBe(2);
    expect(changes, "#4: no reset").toEqual(["recordChanged:2:name"]);
    list.refresh();
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#5: the outside change arrives with the read").toEqual(["outside0", "outside1", "edited"]);
    expect(changes, "#6").toEqual(["recordChanged:2:name", "reset"]);
  });
  test("an outside change does not enter the window of an assigned ArrayDynamicDataSource with a batch either", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    assigned.set([{ id: 7, name: "outside0" }, { id: 8, name: "outside1" }, { id: 9, name: "outside2" }]);
    const changes = recordChanges(list);
    list.batch((): void => { list.setValue(2, "name", "edited"); });
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#1: the window").toEqual(["r0", "r1", "edited"]);
    expect(assigned.get().map((r: any): any => r.name), "#2: the array").toEqual(["outside0", "outside1", "edited"]);
    expect(changes, "#3").toEqual(["recordChanged:2:name"]);
  });
  // A developer's setter that does not store what it is given: the names are stored trimmed.
  function createTrimmingArray(count: number): { source: ArrayDynamicDataSource, get: () => Array<any> } {
    let arr: Array<any> = createRecords(count);
    const trim = (record: any): any => typeof record.name === "string" && record.name !== record.name.trim()
      ? Object.assign({}, record, { name: record.name.trim() }) : record;
    const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a.map(trim); });
    return { source: source, get: (): Array<any> => arr };
  }
  test("an assigned ArrayDynamicDataSource whose setter normalizes: the window takes what a write stored", () => {
    const { list } = createOwnerList();
    const assigned = createTrimmingArray(3);
    list.assignSource(assigned.source);
    const changes = recordChanges(list);
    list.setValue(0, "name", " edited ");
    expect(assigned.get()[0].name, "#1: stored trimmed").toBe("edited");
    expect(list.getRecord(0).name, "#2: the list has what was stored").toBe("edited");
    expect((<any>list).windowRecords === assigned.get(), "#3: the window is the stored array").toBe(true);
    expect(changes, "#4: the write notifies once, after the window took the stored record").toEqual(["recordChanged:0:name"]);
    list.add({ name: " added " });
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#5: an add").toEqual(["edited", "r1", "r2", "added"]);
  });
  test("an assigned ArrayDynamicDataSource whose setter normalizes: the window is reconciled when a batch commits", () => {
    const { list } = createOwnerList();
    const assigned = createTrimmingArray(3);
    list.assignSource(assigned.source);
    const changes = recordChanges(list);
    const inside: Array<any> = [];
    list.batch((): void => {
      list.setValue(0, "name", " edited ");
      inside.push(list.getRecord(0).name);
      list.setValue(2, "name", "plain");
    });
    expect(inside, "#1: inside the batch the record is the one that was written").toEqual([" edited "]);
    expect(assigned.get().map((r: any): any => r.name), "#2: stored trimmed").toEqual(["edited", "r1", "plain"]);
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#3: the list has what was stored").toEqual(["edited", "r1", "plain"]);
    expect((<any>list).windowRecords === assigned.get(), "#4: the window is the stored array").toBe(true);
    expect(changes, "#5: the record the setter changed is announced after the commit")
      .toEqual(["recordChanged:0:name", "recordChanged:2:name", "recordChanged:0:undefined"]);
  });
  test("a batch whose setter stores what it is given announces nothing of its own", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    const changes = recordChanges(list);
    list.batch((): void => {
      list.setValue(0, "name", "edited");
      list.add({ name: "added" });
    });
    expect(changes, "#1").toEqual(["recordChanged:0:name", "recordAdded:3"]);
    expect((<any>list).windowRecords === assigned.get(), "#2: the window is the stored array").toBe(true);
    list.batch((): void => { });
    expect(changes, "#3: an empty batch").toEqual(["recordChanged:0:name", "recordAdded:3"]);
  });
  test("a standalone list over its own ArrayDynamicDataSource whose setter normalizes is reconciled when a batch commits", () => {
    const own = createTrimmingArray(3);
    const list = new DynamicDataList(own.source);
    list.load();
    const changes = recordChanges(list);
    list.batch((): void => { list.setValue(0, "name", " edited "); });
    expect(list.getRecord(0).name, "#1").toBe("edited");
    expect((<any>list).windowRecords === own.get(), "#2: the window is the owner's array").toBe(true);
    expect(changes, "#3").toEqual(["recordChanged:0:name", "recordChanged:0:undefined"]);
  });
  test("a setter that drops a record when a batch commits: the list announces a reset", () => {
    let arr: Array<any> = createRecords(3);
    const source = new ArrayDynamicDataSource((): Array<any> => arr,
      (a: Array<any>): void => { arr = a.filter((r: any): boolean => r.name !== "drop"); });
    const { list } = createOwnerList();
    list.assignSource(source);
    const changes = recordChanges(list);
    list.batch((): void => { list.setValue(1, "name", "drop"); });
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#1").toEqual(["r0", "r2"]);
    expect(list.count, "#2").toBe(2);
    expect(changes, "#3").toEqual(["recordChanged:1:name", "reset"]);
  });
  /* The stored array is not always the array the list wrote. Taking it is a change of the records
     like any other: the cached views and the page index follow it, and another record count is
     announced as a reset after the write has notified. */
  function createDroppingArray(count: number): { source: ArrayDynamicDataSource, get: () => Array<any> } {
    let arr: Array<any> = createRecords(count);
    const source = new ArrayDynamicDataSource((): Array<any> => arr,
      (a: Array<any>): void => { arr = a.filter((r: any): boolean => r.name !== "drop"); });
    return { source: source, get: (): Array<any> => arr };
  }
  [false, true].forEach((inBatch: boolean): void => {
    const how = inBatch ? "inside a batch" : "outside a batch";
    test("a setter that drops the record of the last page, " + how + ": the page index is clamped and a reset follows the write", () => {
      const { list } = createOwnerList();
      list.assignSource(createDroppingArray(3).source);
      list.pageSize = 2;
      list.pageIndex = 1;
      expect(list.getPageIndexes(), "#1").toEqual([2]);
      const changes = recordChanges(list);
      const write = (): void => { list.setValue(2, "name", "drop"); };
      if (inBatch) list.batch(write); else write();
      expect(list.count, "#2").toBe(2);
      expect(list.pageCount, "#3").toBe(1);
      expect(list.pageIndex, "#4: not left past the last page").toBe(0);
      expect(list.getPageIndexes(), "#5").toEqual([0, 1]);
      expect(changes, "#6: the reset comes after the write's own notification").toEqual(["recordChanged:2:name", "reset"]);
    });
    test("a setter that normalizes, " + how + ": a list that re-decides its view on every write re-decides it over the stored records", () => {
      let arr: Array<any> = [{ n: 1 }, { n: 3 }, { n: 5 }];
      const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => {
        arr = a.map((r: any): any => r.n < 0 ? { n: -r.n } : r);
      });
      const list = new DynamicDataList(source);
      list.load();
      list.filter = "{n} > 0";
      // Paging makes the write compute the views before the push: they hold the record as written.
      list.pageSize = 10;
      const write = (): void => { list.setValue(1, "n", -2); };
      if (inBatch) list.batch(write); else write();
      expect(list.getRecord(1), "#1: stored").toEqual({ n: 2 });
      expect(list.getCreatedIndexes(), "#2: the filter sees the stored record").toEqual([0, 1, 2]);
      expect(list.visibleCount, "#3").toBe(3);
      list.filter = "";
      list.sort = [{ field: "n", direction: "asc" }];
      const writeSorted = (): void => { list.setValue(0, "n", -9); };
      if (inBatch) list.batch(writeSorted); else writeSorted();
      expect(list.getCreatedIndexes(), "#4: the sort sees the stored record").toEqual([1, 2, 0]);
    });
    test("a setter that normalizes, " + how + ": a frozen membership keeps the edited record in its place", () => {
      let arr: Array<any> = [{ n: 1 }, { n: 3 }, { n: 5 }];
      const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => {
        arr = a.map((r: any): any => r.n < 0 ? { n: -r.n } : r);
      });
      const { list } = createOwnerList();
      list.assignSource(source);
      list.sort = [{ field: "n", direction: "asc" }];
      list.pageSize = 10;
      const write = (): void => { list.setValue(0, "n", -9); };
      if (inBatch) list.batch(write); else write();
      expect(list.getRecord(0), "#1: stored").toEqual({ n: 9 });
      expect(list.getCreatedIndexes(), "#2: as for any edit").toEqual([0, 1, 2]);
      list.refreshView();
      expect(list.getCreatedIndexes(), "#3: re-decided on request").toEqual([1, 2, 0]);
    });
  });
  test("a batch that reads the view between its write and its commit re-decides it when it commits", () => {
    let arr: Array<any> = [{ n: 1 }, { n: 3 }, { n: 5 }];
    const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => {
      arr = a.map((r: any): any => r.n < 0 ? { n: -r.n } : r);
    });
    const list = new DynamicDataList(source);
    list.load();
    list.filter = "{n} > 0";
    const seen: Array<number> = [];
    list.batch((): void => {
      list.setValue(1, "n", -2);
      seen.push(list.visibleCount);
    });
    expect(seen, "#1: inside the batch the record is the one that was written").toEqual([2]);
    expect(list.visibleCount, "#2").toBe(3);
  });
  /* A batch that throws: the array source drops the writes it collected, so the window must not keep
     them. The owner was notified of every write inside the batch and is told to start over. */
  test("a batch that throws: the window of an assigned ArrayDynamicDataSource goes back to the storage", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    list.filter = "{id} < 100";
    const stored = assigned.get();
    const changes = recordChanges(list);
    expect((): void => {
      list.batch((): void => {
        list.setValue(0, "name", "edited");
        list.add({ id: 200, name: "added" });
        throw new Error("inside the batch");
      });
    }, "#1: the error reaches the caller").toThrow("inside the batch");
    expect(assigned.get() === stored, "#2: nothing was stored").toBe(true);
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#3: the window").toEqual(["r0", "r1", "r2"]);
    expect(list.count, "#4").toBe(3);
    expect(list.getCreatedIndexes(), "#5: the membership is decided over the storage").toEqual([0, 1, 2]);
    expect(changes, "#6").toEqual(["recordChanged:0:name", "recordAdded:3", "reset"]);
    expect(list.isWriting, "#7").toBe(false);
    list.setValue(1, "name", "next");
    expect(assigned.get().map((r: any): any => r.name), "#8: the next write is made on the storage").toEqual(["r0", "next", "r2"]);
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#9").toEqual(["r0", "next", "r2"]);
  });
  test("a batch that throws: a standalone list over its own ArrayDynamicDataSource goes back to the storage", () => {
    const own = createAssignedArray(3);
    const list = new DynamicDataList(own.source);
    list.load();
    const changes = recordChanges(list);
    expect((): void => {
      list.batch((): void => { list.remove(0); throw new Error("inside the batch"); });
    }, "#1").toThrow("inside the batch");
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#2").toEqual(["r0", "r1", "r2"]);
    expect((<any>list).windowRecords === own.get(), "#3: the window is the owner's array").toBe(true);
    expect(changes, "#4").toEqual(["recordRemoved:0", "reset"]);
  });
  test("a batch that throws after the array was replaced outside the list: the window goes back to what it was before the batch", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    assigned.set([{ id: 7, name: "outside0" }, { id: 8, name: "outside1" }, { id: 9, name: "outside2" }]);
    list.setValue(2, "name", "kept");
    expect((): void => {
      list.batch((): void => { list.setValue(0, "name", "edited"); throw new Error("inside the batch"); });
    }, "#1").toThrow("inside the batch");
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#2: the list's own earlier write stays, the outside change is not taken").toEqual(["r0", "r1", "kept"]);
    expect(assigned.get().map((r: any): any => r.name), "#3").toEqual(["outside0", "outside1", "kept"]);
  });
  test("an assigned source whose setter throws after it stored a batch of updates: reported once, the window keeps the writes", () => {
    let arr: Array<any> = createRecords(3);
    const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => {
      arr = a;
      throw new Error("after the assignment");
    });
    const { list } = createOwnerList();
    list.assignSource(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation + ":" + error.message); };
    expect((): void => {
      list.batch((): void => { list.setValue(0, "name", "edited"); list.setValue(1, "name", "edited1"); });
    }, "#1: not thrown").not.toThrow();
    expect(errors, "#2: reported once, under the first operation").toEqual(["update:after the assignment"]);
    expect(arr[0].name, "#3: stored").toBe("edited");
    expect(list.getRecord(0).name, "#4: the list has it").toBe("edited");
    expect(list.getRecord(1).name, "#5").toBe("edited1");
  });
  test("an inner batch that throws inside an outer one that goes on: nothing is restored, the outer batch stores every write", () => {
    const { list } = createOwnerList();
    const assigned = createAssignedArray(3);
    list.assignSource(assigned.source);
    const changes = recordChanges(list);
    list.batch((): void => {
      list.setValue(0, "name", "outer");
      try {
        list.batch((): void => { list.setValue(1, "name", "inner"); throw new Error("inner"); });
      } catch(e) {
        changes.push("caught");
      }
    });
    expect(assigned.get().map((r: any): any => r.name), "#1: the source batch is one batch").toEqual(["outer", "inner", "r2"]);
    expect(list.getLoadedRecords().map((r: any): any => r.name), "#2").toEqual(["outer", "inner", "r2"]);
    expect(changes, "#3: no reset").toEqual(["recordChanged:0:name", "recordChanged:1:name", "caught"]);
  });
  test("a standalone list over its own ArrayDynamicDataSource still takes the array a write has written", () => {
    const own = createAssignedArray(3);
    const list = new DynamicDataList(own.source);
    list.load();
    list.setValue(2, "name", "edited");
    expect(list.getLoadedRecords() !== own.get(), "#1: getLoadedRecords is a copy").toBe(true);
    expect((<any>list).windowRecords === own.get(), "#2: the window is the owner's array").toBe(true);
  });
});

describe("DynamicDataList: the source's shape and the loaded window", () => {
  test("keyField is the source's, undefined for a source without one", () => {
    const list = createList(createRecords(2));
    expect(list.keyField, "#1: an array source").toBeUndefined();
    list.source = new FakeKeyedSource(createRecords(2));
    expect(list.keyField, "#2").toBe("id");
  });
  test("hasCapability: the presence of the matching method on the source in use", () => {
    const list = createList(createRecords(2));
    expect(["insert", "update", "remove", "move"].map(op => list.hasCapability(<any>op)), "#1: an array source has all four").toEqual([true, true, true, true]);
    const source = new FakeRangeSource(createRecords(4));
    (<any>source).move = undefined;
    list.source = source;
    expect(["insert", "update", "remove", "move"].map(op => list.hasCapability(<any>op)), "#2").toEqual([true, true, true, false]);
    list.source = { read: (): Array<any> => [] };
    expect(list.hasCapability("insert"), "#3: a read-only source").toBe(false);
  });
  test("getLoadedRecords: a new array of the records the list holds, on every call", () => {
    const records = createRecords(3);
    const list = createList(records);
    const first = list.getLoadedRecords();
    expect(first, "#1").toEqual(records);
    expect(first !== records, "#2: not the storage array").toBe(true);
    expect(first[1] === list.getRecord(1), "#3: the records themselves").toBe(true);
    expect(list.getLoadedRecords() !== first, "#4: a new instance every call").toBe(true);
  });
  test("getLoadedRecords: the window of a source that pages itself", () => {
    const list = new DynamicDataList(new FakeRangeSource(createRecords(10)));
    list.pageSize = 3;
    list.load();
    list.pageIndex = 2;
    expect(list.getLoadedRecords().map(r => r.id), "#1").toEqual([6, 7, 8]);
  });
});

describe("DynamicDataList: the page of a visible position", () => {
  test("getPageOfVisibleIndex: the page that holds an unpaged visibleIndex, 0 without paging", () => {
    const list = createList(createRecords(7));
    expect(list.getPageOfVisibleIndex(5), "#1: no paging").toBe(0);
    list.pageSize = 3;
    expect([0, 2, 3, 6, 9].map(i => list.getPageOfVisibleIndex(i)), "#2").toEqual([0, 0, 1, 2, 3]);
    expect(list.getPageOfVisibleIndex(-1), "#3: no position").toBe(0);
    list.pageIndex = 2;
    expect(list.getPageOfVisibleIndex(4), "#4: whatever page is shown").toBe(1);
  });
});

describe("DynamicDataList: a list whose membership is fixed", () => {
  const createFixedList = (view: "none" | "sort" | "filter"): { list: DynamicDataList, changes: Array<string>, writes: () => number } => {
    let stored: Array<any> = createRecords(7);
    let writes = 0;
    const changes: Array<string> = [];
    const owner: IDynamicDataOwner = {
      getFields: (): Array<IDynamicDataField> => [{ name: "id", dataType: "number" }],
      onDataListChanged: (change: IDynamicDataListChange): void => { changes.push(changeToString(change)); }
    };
    const list = DynamicDataList.createReadThrough(owner, (): Array<any> => stored,
      (arr: Array<any>): void => { writes++; stored = arr; }, undefined, true);
    list.pageSize = 2;
    list.setRecordVisible(3, false);
    if (view === "sort") list.sort = [{ field: "id", direction: "desc" }];
    if (view === "filter") list.filter = "{id} != 1";
    list.pageIndex = 1;
    changes.length = 0;
    return { list: list, changes: changes, writes: (): number => writes };
  };
  const getState = (list: DynamicDataList): string => JSON.stringify({
    records: list.getLoadedRecords(), count: list.count, loadedCount: list.loadedCount,
    hidden: list.getLoadedRecords().map((_: any, i: number): boolean => list.isRecordVisible(i)),
    created: list.getCreatedIndexes(), visible: list.getVisibleIndexes(), pageIndex: list.pageIndex, pageCount: list.pageCount
  });
  (<Array<"none" | "sort" | "filter">>["none", "sort", "filter"]).forEach((view) => {
    test("add, remove, move, ensureCount and truncate leave no trace, view: " + view, () => {
      const { list, changes, writes } = createFixedList(view);
      const before = getState(list);
      expect(list.add({ id: 100 }), "#1: add is refused").toBe(-1);
      expect(list.add({ id: 101 }, 0), "#1: an insert as well").toBe(-1);
      list.remove(0);
      list.move(0, 2);
      list.ensureCount(10);
      list.truncate(1);
      list.batch((): void => {
        list.add({ id: 102 });
        list.remove(1);
      });
      expect(getState(list), "#2: records, counts, flags, views and the page are unchanged").toBe(before);
      expect(changes, "#3: nothing is announced").toEqual([]);
      expect(writes(), "#4: nothing is written").toBe(0);
    });
  });
  test("its default source is no back door, and an update still goes through", () => {
    const { list, changes, writes } = createFixedList("none");
    const before = getState(list);
    list.source.insert({ id: 100 }, 0);
    list.source.remove(0);
    list.source.move(0, 2);
    expect(getState(list), "#1: unchanged").toBe(before);
    expect(writes(), "#1: nothing is written").toBe(0);
    expect(list.setValue(2, "name", "x"), "#2: an update is written").toBe(true);
    expect(writes(), "#2").toBe(1);
    expect(list.getRecord(2).name, "#2").toBe("x");
    expect(changes, "#2: announced").toEqual(["recordChanged:2:name"]);
  });
  test("hasCapability answers false for the membership operations only", () => {
    const { list } = createFixedList("none");
    expect(["insert", "remove", "move", "update", "read"].map((op: any) => list.hasCapability(op)), "#1").toEqual([false, false, false, true, true]);
    const free = createList(createRecords(2));
    expect(["insert", "remove", "move"].map((op: any) => free.hasCapability(op)), "#2: a list without the flag").toEqual([true, true, true]);
  });
});

/* One read request for every source: the shape of the request a source is sent, the shapes of the
   answer the list takes, and the view a paging source has not declared. */
describe("DynamicDataList: the read request and the read capabilities", () => {
  // A paging source with the capabilities the test gives it: it answers the page it is asked for and
  // ignores the view, so that what the list does with an undeclared part shows.
  function createCapabilitySource(count: number, capabilities: IDynamicDataSourceCapabilities):
    { source: IDynamicDataSource, requests: Array<IDynamicDataReadRequest> } {
    const records = createRecords(count);
    const requests: Array<IDynamicDataReadRequest> = [];
    const source: IDynamicDataSource = {
      capabilities: capabilities,
      read: (request: IDynamicDataReadRequest): IDynamicDataReadResult => {
        requests.push(request);
        const take = request.take > 0 ? request.take : records.length;
        return { records: records.slice(request.skip, request.skip + take), total: records.length };
      }
    };
    return { source: source, requests: requests };
  }
  function collectErrors(list: DynamicDataList): Array<{ operation: string, message: string }> {
    const res: Array<{ operation: string, message: string }> = [];
    list.onError = (error: any, operation: string): void => { res.push({ operation: operation, message: String(error && error.message) }); };
    return res;
  }
  test("a source without paging may answer with a bare array, synchronously or asynchronously", async () => {
    const records = createRecords(3);
    const syncList = new DynamicDataList({ read: (): Array<any> => records });
    syncList.load();
    expect(syncList.loadedCount, "#1").toBe(3);
    expect(syncList.getRecord(0) === records[0], "#2: the records themselves").toBe(true);
    const asyncList = new DynamicDataList({ read: (): Promise<Array<any>> => Promise.resolve(records) });
    await asyncList.load();
    expect(asyncList.loadedCount, "#3").toBe(3);
    expect(asyncList.isCountKnown, "#4").toBe(true);
    expect(asyncList.count, "#5").toBe(3);
  });
  test("a source without paging may answer with a result object: it is the whole storage, total and hasMore are ignored", async () => {
    const records = createRecords(3);
    const list = new DynamicDataList({ read: (): any => Promise.resolve({ records: records, total: 99, hasMore: true }) });
    list.pageSize = 2;
    await list.load();
    expect(list.loadedCount, "#1: every record").toBe(3);
    expect(list.count, "#2: the length, not the total").toBe(3);
    expect(list.isCountKnown, "#3").toBe(true);
    expect(list.hasMore, "#4").toBe(false);
    expect(list.pageCount, "#5: the list pages the answer").toBe(2);
  });
  test("a paging source may answer with a bare array: its end is inferred from a short window", () => {
    const records = createRecords(25);
    const list = new DynamicDataList({
      capabilities: { paging: true },
      read: (request: IDynamicDataReadRequest): Array<any> => records.slice(request.skip, request.skip + request.take)
    });
    list.pageSize = 10;
    list.load();
    expect(list.loadedCount, "#1").toBe(10);
    expect(list.isCountKnown, "#2: a full window may have more").toBe(false);
    expect(list.hasMore, "#3").toBe(true);
    list.pageIndex = 1;
    list.pageIndex = 2;
    expect(list.windowOffset, "#4").toBe(20);
    expect(list.loadedCount, "#5").toBe(5);
    expect(list.isCountKnown, "#6: the short window is the end").toBe(true);
    expect(list.count, "#7").toBe(25);
    expect(list.hasMore, "#8").toBe(false);
  });
  test("a source without paging is sent an empty request whatever the page size, the filter and the sort", () => {
    const records = createRecords(6);
    const requests: Array<IDynamicDataReadRequest> = [];
    const list = new DynamicDataList({
      read: (request: IDynamicDataReadRequest): Array<any> => { requests.push(request); return records; }
    });
    list.pageSize = 2;
    list.load();
    list.setView("{id} > 0", [{ field: "id", direction: "desc" }]);
    list.pageIndex = 1;
    list.refresh();
    list.load();
    expect(requests.length, "#1: the view and the page change are local").toBe(3);
    requests.forEach((request: IDynamicDataReadRequest, i: number): void => {
      expect(request, "#2: request " + i).toEqual({ skip: 0, take: 0, filter: "", sort: [] });
    });
    expect(list.getPageIndexes().map((index: number): number => list.getRecord(index).id), "#3: filtered, sorted and paged here").toEqual([3, 2]);
  });
  test("a paging source that declares only paging reads normally while no view is set", () => {
    const { source, requests } = createCapabilitySource(5, { paging: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    expect(requests, "#1").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }, { skip: 2, take: 2, filter: "", sort: [] }]);
    expect(errors, "#2").toEqual([]);
  });
  test("a sort a paging source cannot run is run locally over the whole storage, which the source is read for", () => {
    const { source, requests } = createCapabilitySource(5, { paging: true, filtering: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    requests.length = 0;
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests, "#1: one read of the whole storage").toEqual([{ skip: 0, take: 0, filter: "", sort: [] }]);
    expect(errors, "#2").toEqual([]);
    expect(list.isPagedBySource, "#3: the window is the whole storage").toBe(false);
    expect(list.loadedCount, "#4").toBe(5);
    expect(list.windowOffset, "#5").toBe(0);
    expect(list.pageIndex, "#6: a sort keeps the page").toBe(1);
    expect(list.getPageIndexes().map(i => list.getRecord(i).id), "#7: sorted and paged by the list").toEqual([2, 1]);
    expect(list.pageCount, "#8").toBe(3);
    list.sort = [];
    expect(requests.slice(1), "#9: without the sort the source pages again, on the same page").toEqual([{ skip: 2, take: 2, filter: "", sort: [] }]);
    expect(list.isPagedBySource, "#10").toBe(true);
    expect(list.getPageIndexes().map(i => list.getRecord(i).id), "#11").toEqual([2, 3]);
    expect(errors, "#12").toEqual([]);
  });
  test("a filter a paging source cannot run is run locally over the whole storage, which the source is read for", () => {
    const { source, requests } = createCapabilitySource(5, { paging: true, sorting: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    requests.length = 0;
    list.filter = "{id} > 0";
    expect(requests, "#1: one read of the whole storage").toEqual([{ skip: 0, take: 0, filter: "", sort: [] }]);
    expect(errors, "#2").toEqual([]);
    expect(list.isPagedBySource, "#3: the window is the whole storage").toBe(false);
    expect(list.loadedCount, "#4").toBe(5);
    expect(list.windowOffset, "#5").toBe(0);
    expect(list.pageIndex, "#6: the filter resets the page").toBe(0);
    expect(list.getPageIndexes().map(i => list.getRecord(i).id), "#7: filtered and paged by the list").toEqual([1, 2]);
    expect(list.pageCount, "#8: from the visible count").toBe(2);
    expect(list.isCountKnown, "#9").toBe(true);
    expect(list.count, "#10: the storage count").toBe(5);
    list.filter = "";
    expect(requests.slice(1), "#11: without the filter the source pages again").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }]);
    expect(list.isPagedBySource, "#12").toBe(true);
    expect(list.loadedCount, "#13").toBe(2);
    expect(errors, "#14").toEqual([]);
  });
  test("under a sort the paging source cannot run, a refresh reads the whole storage again and a page change is local", () => {
    const { source, requests } = createCapabilitySource(5, { paging: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    list.sort = [{ field: "id", direction: "asc" }];
    requests.length = 0;
    list.refresh();
    list.pageIndex = 1;
    expect(requests, "#1").toEqual([{ skip: 0, take: 0, filter: "", sort: [] }]);
    expect(errors, "#2").toEqual([]);
    expect(list.getPageIndexes().map(i => list.getRecord(i).id), "#3: paged by the list").toEqual([2, 3]);
  });
  test("a paging source that sorts but does not filter is sent the sort and an empty filter", () => {
    const { source, requests } = createCapabilitySource(5, { paging: true, sorting: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests[requests.length - 1], "#1").toEqual({ skip: 0, take: 2, filter: "", sort: [{ field: "id", direction: "desc" }] });
  });
  test("the capabilities are taken when the source is assigned", () => {
    const { source, requests } = createCapabilitySource(5, { paging: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    source.capabilities = { paging: true, sorting: true };
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests[1], "#1: the change is not seen, the source is read whole").toEqual({ skip: 0, take: 0, filter: "", sort: [] });
    source.capabilities = {};
    list.sort = [];
    expect(requests.length, "#2: still a paging source").toBe(3);
    expect(requests[2].take, "#3").toBe(2);
    list.source = ArrayDynamicDataSource.fromArray([]);
    source.capabilities = { paging: true, sorting: true };
    list.source = source;
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests[requests.length - 1], "#4: assigned again, the new capabilities count")
      .toEqual({ skip: 0, take: 2, filter: "", sort: [{ field: "id", direction: "desc" }] });
    expect(errors, "#5").toEqual([]);
  });
  test("a paging source assigned while a sort it cannot run is set is read whole; a source that sorts gets the sort", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(3)));
    const errors = collectErrors(list);
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    const pagingOnly = createCapabilitySource(5, { paging: true });
    list.pageSize = 2;
    list.source = pagingOnly.source;
    expect(pagingOnly.requests, "#1").toEqual([{ skip: 0, take: 0, filter: "", sort: [] }]);
    expect(list.loadedCount, "#2").toBe(5);
    expect(list.getPageIndexes().map(i => list.getRecord(i).id), "#3: sorted here").toEqual([4, 3]);
    const sorting = createCapabilitySource(5, { paging: true, sorting: true });
    list.source = sorting.source;
    expect(sorting.requests, "#4: the list was asked to fill itself, so the new source is read")
      .toEqual([{ skip: 0, take: 2, filter: "", sort: [{ field: "id", direction: "desc" }] }]);
    expect(list.loadedCount, "#5").toBe(2);
    expect(errors, "#6").toEqual([]);
  });
});
/* A paging source is read whole while the list has a filter or a sort it cannot run: the list
   filters, sorts and pages that answer itself, and the source pages again once no such part is set.
   The window keeps the mode it was read in until the next read commits, so a read that is pending or
   failed never has a page taken for the whole storage, or the whole storage for a page. */
describe("DynamicDataList: a paging source is read whole while a filter or a sort it cannot run is set", () => {
  interface IHeldRead { request: IDynamicDataReadRequest, answer: Deferred }
  // Answers the range it is asked for and ignores the view. held: every read answers with a promise
  // the test settles. total: false -> the answer of a page carries hasMore instead of a total.
  function createSource(count: number, capabilities: IDynamicDataSourceCapabilities, options: { held?: boolean, total?: boolean } = {}):
    { source: IDynamicDataSource, requests: Array<IDynamicDataReadRequest>, held: Array<IHeldRead>, removed: Array<any> } {
    const records = createRecords(count);
    const requests: Array<IDynamicDataReadRequest> = [];
    const held: Array<IHeldRead> = [];
    const removed: Array<any> = [];
    const answer = (request: IDynamicDataReadRequest): IDynamicDataReadResult => {
      const take = request.take > 0 ? request.take : records.length;
      const res: IDynamicDataReadResult = { records: records.slice(request.skip, request.skip + take) };
      if (options.total === false) {
        res.hasMore = request.skip + take < records.length;
      } else {
        res.total = records.length;
      }
      return res;
    };
    const source: IDynamicDataSource = {
      capabilities: capabilities,
      keyField: "id",
      read: (request: IDynamicDataReadRequest): any => {
        requests.push(request);
        if (!options.held) return answer(request);
        const deferred = new Deferred();
        held.push({ request: request, answer: deferred });
        return deferred.promise.then((): any => answer(request));
      },
      update: (): void => {},
      remove: (key: any): void => { removed.push(key); }
    };
    return { source: source, requests: requests, held: held, removed: removed };
  }
  function collectErrors(list: DynamicDataList): Array<{ operation: string, message: string }> {
    const res: Array<{ operation: string, message: string }> = [];
    list.onError = (error: any, operation: string): void => { res.push({ operation: operation, message: String(error && error.message) }); };
    return res;
  }
  function pageIds(list: DynamicDataList): Array<number> {
    return list.getPageIndexes().map((i: number): number => list.getRecord(i).id);
  }
  const wholeRequest = { skip: 0, take: 0, filter: "", sort: [] };

  test("in the whole storage, a page change, a sort change and another filter send no request", () => {
    const { source, requests } = createSource(6, { paging: true, sorting: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.filter = "{id} > 0";
    requests.length = 0;
    list.pageIndex = 1;
    expect(pageIds(list), "#1: the list pages").toEqual([3, 4]);
    list.sort = [{ field: "id", direction: "desc" }];
    expect(pageIds(list), "#2: the list sorts").toEqual([3, 2]);
    list.filter = "{id} < 3";
    expect(list.pageIndex, "#3: another filter resets the page").toBe(0);
    expect(pageIds(list), "#4: the list filters").toEqual([2, 1]);
    expect(requests, "#5").toEqual([]);
  });
  test("clearing the filter reads the current page, and the count facts are the page's", () => {
    const { source, requests } = createSource(5, { paging: true }, { total: false });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    expect(list.isCountKnown, "#1: a page without a total").toBe(false);
    list.filter = "{id} > 0";
    expect(list.isCountKnown, "#2: the whole storage").toBe(true);
    expect(list.hasMore, "#3").toBe(false);
    expect(list.pageCount, "#4").toBe(2);
    list.pageIndex = 1;
    requests.length = 0;
    list.filter = "";
    expect(requests, "#5: page 0, the filter reset the page").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }]);
    expect(list.isCountKnown, "#6").toBe(false);
    expect(list.hasMore, "#7").toBe(true);
    expect(list.count, "#8: the records seen so far").toBe(2);
    expect(list.pageCount, "#9: the pages known to exist").toBe(2);
  });
  test("while the whole storage is read, the page in force stays, unfiltered", async () => {
    const { source, requests, held } = createSource(5, { paging: true }, { held: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    const loaded = list.load();
    held[0].answer.resolve();
    await loaded;
    list.pageIndex = 1;
    held[1].answer.resolve();
    await flush();
    list.filter = "{id} > 2";
    expect(requests[2], "#1").toEqual(wholeRequest);
    expect(list.isLoading, "#2").toBe(true);
    expect(list.isPagedBySource, "#3: the window in force is a page").toBe(true);
    expect(list.windowOffset, "#4").toBe(2);
    expect(pageIds(list), "#5: not filtered locally").toEqual([2, 3]);
    held[2].answer.resolve();
    await flush();
    expect(list.isPagedBySource, "#6").toBe(false);
    expect(list.loadedCount, "#7").toBe(5);
    expect(pageIds(list), "#8").toEqual([3, 4]);
  });
  test("a failed read of the whole storage keeps the page, and the next change reads it again", async () => {
    const { source, requests, held } = createSource(5, { paging: true }, { held: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    const loaded = list.load();
    held[0].answer.resolve();
    await loaded;
    list.filter = "{id} > 2";
    held[1].answer.reject(new Error("offline"));
    await flush();
    expect(errors.map(e => e.operation), "#1").toEqual(["read"]);
    expect(list.isPagedBySource, "#2: still the page").toBe(true);
    expect(pageIds(list), "#3: not filtered locally").toEqual([0, 1]);
    list.filter = "{id} > 1";
    expect(requests.length, "#4: the whole storage is read again").toBe(3);
    expect(requests[2], "#5").toEqual(wholeRequest);
    held[2].answer.resolve();
    await flush();
    expect(pageIds(list), "#6").toEqual([2, 3]);
    list.pageIndex = 1;
    expect(requests.length, "#7: once it is in force, a page change reads nothing").toBe(3);
  });
  test("a failed page read after the filter is cleared keeps the whole storage in force", async () => {
    const { source, held } = createSource(5, { paging: true }, { held: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.filter = "{id} > 2";
    const loaded = list.load();
    expect(held[0].request, "#1").toEqual(wholeRequest);
    held[0].answer.resolve();
    await loaded;
    list.filter = "";
    expect(held[1].request, "#2").toEqual({ skip: 0, take: 2, filter: "", sort: [] });
    held[1].answer.reject(new Error("offline"));
    await flush();
    expect(errors.map(e => e.operation), "#3").toEqual(["read"]);
    expect(list.isPagedBySource, "#4: the whole storage").toBe(false);
    expect(list.loadedCount, "#5").toBe(5);
    expect(pageIds(list), "#6: paged by the list").toEqual([0, 1]);
    expect(list.pageCount, "#7").toBe(3);
  });
  test("only the last answer commits: a filter changed again, and a filter cleared before the whole storage answered", async () => {
    const { source, requests, held } = createSource(5, { paging: true }, { held: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    const loaded = list.load();
    held[0].answer.resolve();
    await loaded;
    list.filter = "{id} > 2";
    list.filter = "{id} > 3";
    expect(requests.slice(1), "#1: the window in force is still a page, so the whole storage is read again").toEqual([wholeRequest, wholeRequest]);
    const changes = recordChanges(list);
    held[2].answer.resolve();
    await flush();
    held[1].answer.resolve();
    await flush();
    expect(changes.filter(c => c === "reset"), "#2: one commit").toEqual(["reset"]);
    expect(pageIds(list), "#3: the last filter").toEqual([4]);
    list.filter = "{id} > 0";
    expect(requests.length, "#4: the whole storage is in force").toBe(3);
    const second = createSource(5, { paging: true }, { held: true });
    const other = new DynamicDataList(second.source);
    other.pageSize = 2;
    const otherLoaded = other.load();
    second.held[0].answer.resolve();
    await otherLoaded;
    other.filter = "{id} > 2";
    other.filter = "";
    second.held[2].answer.resolve();
    await flush();
    second.held[1].answer.resolve();
    await flush();
    expect(other.isPagedBySource, "#5: the whole storage answered after the page is discarded").toBe(true);
    expect(other.loadedCount, "#6").toBe(2);
  });
  test("a write in the whole storage addresses its record by key and overtakes a whole-storage read", async () => {
    const sync = createSource(5, { paging: true });
    const list = new DynamicDataList(sync.source);
    list.pageSize = 2;
    list.load();
    list.filter = "{id} > 2";
    expect(list.getPageIndexes(), "#1").toEqual([3, 4]);
    list.remove(3);
    expect(sync.removed, "#2: the record at position 3 of the whole source").toEqual([3]);
    const held = createSource(5, { paging: true }, { held: true });
    const other = new DynamicDataList(held.source);
    other.pageSize = 2;
    other.filter = "{id} > 2";
    const loaded = other.load();
    held.held[0].answer.resolve();
    await loaded;
    other.refresh();
    other.setValue(0, "name", "x");
    held.held[1].answer.resolve();
    await flush();
    expect(held.requests, "#3: the overtaken read is read again").toEqual([wholeRequest, wholeRequest, wholeRequest]);
    held.held[2].answer.resolve();
    await flush();
    expect(other.isLoading, "#4").toBe(false);
  });
  test("a source that can run neither: the filter and the sort each keep the whole storage, and clearing both pages again", () => {
    const { source, requests } = createSource(5, { paging: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    list.filter = "{id} > 0";
    list.sort = [{ field: "id", direction: "desc" }];
    expect(pageIds(list), "#1").toEqual([4, 3]);
    requests.length = 0;
    list.filter = "";
    expect(requests, "#2: the sort keeps the whole storage, nothing is sent").toEqual([]);
    expect(list.isPagedBySource, "#3").toBe(false);
    expect(pageIds(list), "#4: sorted, no longer filtered").toEqual([4, 3]);
    list.sort = [];
    expect(requests, "#5: one page read").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }]);
    expect(list.isPagedBySource, "#6").toBe(true);
    list.sort = [{ field: "id", direction: "desc" }];
    list.filter = "{id} > 0";
    requests.length = 0;
    list.sort = [];
    expect(requests, "#7: the filter keeps the whole storage, nothing is sent").toEqual([]);
    expect(pageIds(list), "#8").toEqual([1, 2]);
    expect(errors, "#9").toEqual([]);
  });
  test("a source that filters but cannot sort: in the whole storage a page change, another sort and a filter send no request", () => {
    const { source, requests } = createSource(6, { paging: true, filtering: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests[1], "#1").toEqual(wholeRequest);
    requests.length = 0;
    list.pageIndex = 1;
    expect(pageIds(list), "#2: the list pages").toEqual([3, 2]);
    list.sort = [{ field: "id", direction: "asc" }];
    expect(pageIds(list), "#3: the list sorts").toEqual([2, 3]);
    list.filter = "{id} > 2";
    expect(list.pageIndex, "#4: the filter resets the page").toBe(0);
    expect(pageIds(list), "#5: the list filters").toEqual([3, 4]);
    expect(requests, "#6").toEqual([]);
    list.sort = [];
    expect(requests, "#7: the source filters, so the page read carries the filter")
      .toEqual([{ skip: 0, take: 2, filter: "{id} > 2", sort: [] }]);
    expect(list.isPagedBySource, "#8").toBe(true);
    expect(errors, "#9").toEqual([]);
  });
  test("a source that sorts but cannot filter: a sort alone stays a sorted page read", () => {
    const { source, requests } = createSource(5, { paging: true, sorting: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests[1], "#1").toEqual({ skip: 0, take: 2, filter: "", sort: [{ field: "id", direction: "desc" }] });
    expect(list.isPagedBySource, "#2").toBe(true);
  });
  test("clearing the sort reads the current page, and the count facts are the page's", () => {
    const { source, requests } = createSource(5, { paging: true, filtering: true }, { total: false });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.pageIndex = 1;
    expect(list.isCountKnown, "#1: a page without a total").toBe(false);
    list.sort = [{ field: "id", direction: "desc" }];
    expect(list.isCountKnown, "#2: the whole storage").toBe(true);
    expect(list.pageCount, "#3").toBe(3);
    requests.length = 0;
    list.sort = [];
    expect(requests, "#4: the page the sort kept").toEqual([{ skip: 2, take: 2, filter: "", sort: [] }]);
    expect(list.isCountKnown, "#5").toBe(false);
    expect(list.hasMore, "#6").toBe(true);
    expect(list.pageCount, "#7: the pages known to exist").toBe(3);
  });
  test("while the whole storage is read for a sort, the page in force stays, unsorted; a failed read keeps it", async () => {
    const { source, requests, held } = createSource(5, { paging: true, filtering: true }, { held: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    const loaded = list.load();
    held[0].answer.resolve();
    await loaded;
    list.sort = [{ field: "id", direction: "desc" }];
    expect(requests[1], "#1").toEqual(wholeRequest);
    expect(list.isPagedBySource, "#2: the window in force is a page").toBe(true);
    expect(pageIds(list), "#3: not sorted locally").toEqual([0, 1]);
    held[1].answer.reject(new Error("offline"));
    await flush();
    expect(errors.map(e => e.operation), "#4").toEqual(["read"]);
    expect(list.isPagedBySource, "#5: still the page").toBe(true);
    expect(pageIds(list), "#6").toEqual([0, 1]);
    list.sort = [{ field: "id", direction: "asc" }];
    expect(requests[2], "#7: the whole storage is read again").toEqual(wholeRequest);
    held[2].answer.resolve();
    await flush();
    expect(list.isPagedBySource, "#8").toBe(false);
    expect(pageIds(list), "#9").toEqual([0, 1]);
  });
  test("a failed page read after the sort is cleared keeps the whole storage in force", async () => {
    const { source, held } = createSource(5, { paging: true, filtering: true }, { held: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.sort = [{ field: "id", direction: "desc" }];
    const loaded = list.load();
    expect(held[0].request, "#1").toEqual(wholeRequest);
    held[0].answer.resolve();
    await loaded;
    list.sort = [];
    expect(held[1].request, "#2").toEqual({ skip: 0, take: 2, filter: "", sort: [] });
    held[1].answer.reject(new Error("offline"));
    await flush();
    expect(errors.map(e => e.operation), "#3").toEqual(["read"]);
    expect(list.isPagedBySource, "#4: the whole storage").toBe(false);
    expect(list.loadedCount, "#5").toBe(5);
    expect(pageIds(list), "#6: paged by the list, in source order").toEqual([0, 1]);
  });
  describe("a source that filters but cannot sort, with a filter the list cannot run", () => {
    const asyncFilter = "dynamicDataSortFallbackAsync({id}) = true";
    beforeEach(() => {
      FunctionFactory.Instance.register("dynamicDataSortFallbackAsync", (): any => true, true);
    });
    afterEach(() => {
      FunctionFactory.Instance.unregister("dynamicDataSortFallbackAsync");
    });
    test("without a sort the filter is the source's: it goes into the page read and nothing is reported", () => {
      const { source, requests } = createSource(5, { paging: true, filtering: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      list.load();
      list.filter = asyncFilter;
      expect(requests[1], "#1").toEqual({ skip: 0, take: 2, filter: asyncFilter, sort: [] });
      expect(errors, "#2").toEqual([]);
      expect(list.filter, "#3").toBe(asyncFilter);
    });
    test("a sort refuses the read: no request, the page and the filter stay; clearing the sort reads the filtered page", () => {
      const { source, requests } = createSource(5, { paging: true, filtering: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      list.load();
      list.filter = asyncFilter;
      requests.length = 0;
      list.sort = [{ field: "id", direction: "desc" }];
      expect(requests, "#1: nothing was sent").toEqual([]);
      expect(errors.map(e => e.operation), "#2").toEqual(["read"]);
      expect(errors[0].message.indexOf("\"sorting\"") > -1, "#3: the message names the capability: " + errors[0].message).toBe(true);
      expect(list.filter, "#4: the filter is kept").toBe(asyncFilter);
      expect(list.isPagedBySource, "#5: the page stays in force").toBe(true);
      expect(pageIds(list), "#6").toEqual([0, 1]);
      list.sort = [];
      expect(requests, "#7").toEqual([{ skip: 0, take: 2, filter: asyncFilter, sort: [] }]);
      expect(errors.length, "#8").toBe(1);
    });
    test("an unparsable filter takes the same path: the sort is refused and the filter is kept", () => {
      const { source, requests } = createSource(5, { paging: true, filtering: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      list.load();
      list.filter = "{id} >";
      expect(errors, "#1: the source filters, the list never parsed it").toEqual([]);
      requests.length = 0;
      list.sort = [{ field: "id", direction: "desc" }];
      expect(requests, "#2").toEqual([]);
      expect(errors.map(e => e.operation), "#3").toEqual(["read"]);
      expect(list.filter, "#4").toBe("{id} >");
    });
    test("set while the whole storage of a sort is in force, it is reported and dropped, as any filter the list has to run", () => {
      const { source, requests } = createSource(5, { paging: true, filtering: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      list.load();
      list.sort = [{ field: "id", direction: "desc" }];
      requests.length = 0;
      list.filter = asyncFilter;
      expect(requests, "#1: the whole storage is in force, nothing is read").toEqual([]);
      expect(errors.map(e => e.operation), "#2").toEqual(["read"]);
      expect(list.filter, "#3").toBe("");
      expect(pageIds(list), "#4: sorted, unfiltered").toEqual([4, 3]);
    });
    test("set together with clearing the sort, it is the source's again: one page read carries it, nothing is reported", () => {
      const { source, requests } = createSource(5, { paging: true, filtering: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      list.load();
      list.sort = [{ field: "id", direction: "desc" }];
      requests.length = 0;
      list.setView(asyncFilter, []);
      expect(requests, "#1").toEqual([{ skip: 0, take: 2, filter: asyncFilter, sort: [] }]);
      expect(errors, "#2").toEqual([]);
      expect(list.filter, "#3: kept").toBe(asyncFilter);
      expect(list.isPagedBySource, "#4").toBe(true);
    });
    test("set while the whole storage of a sort is still being read, it refuses that read and is kept", async () => {
      const { source, requests, held } = createSource(5, { paging: true, filtering: true }, { held: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      const loaded = list.load();
      held[0].answer.resolve();
      await loaded;
      list.sort = [{ field: "id", direction: "desc" }];
      expect(requests[1], "#1: the whole storage is asked for").toEqual(wholeRequest);
      list.filter = asyncFilter;
      expect(requests.length, "#2: no second request").toBe(2);
      expect(errors.map(e => e.operation), "#3").toEqual(["read"]);
      expect(list.filter, "#4: kept").toBe(asyncFilter);
      expect(list.isLoading, "#5: the refused read owns the loading state").toBe(false);
      held[1].answer.resolve();
      await flush();
      expect(list.isPagedBySource, "#6: the superseded answer is discarded, the page stays").toBe(true);
      expect(pageIds(list), "#7").toEqual([0, 1]);
      list.sort = [];
      expect(requests[2], "#8").toEqual({ skip: 0, take: 2, filter: asyncFilter, sort: [] });
    });
  });
  describe("a source that filters but cannot sort, with a filter the list can run", () => {
    test("set while the whole storage of a sort is still being read, the read that follows filters it", async () => {
      const { source, requests, held } = createSource(5, { paging: true, filtering: true }, { held: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      const loaded = list.load();
      held[0].answer.resolve();
      await loaded;
      list.sort = [{ field: "id", direction: "desc" }];
      list.filter = "{id} < 3";
      expect(requests.slice(1), "#1: the whole storage is read again").toEqual([wholeRequest, wholeRequest]);
      held[2].answer.resolve();
      await flush();
      expect(list.isPagedBySource, "#2").toBe(false);
      expect(pageIds(list), "#3: filtered and sorted here").toEqual([2, 1]);
      expect(errors, "#4").toEqual([]);
    });
    test("set while a page read that clears the sort is pending, the whole storage in force shows it filtered", async () => {
      const { source, requests, held } = createSource(5, { paging: true, filtering: true }, { held: true });
      const list = new DynamicDataList(source);
      const errors = collectErrors(list);
      list.pageSize = 2;
      list.sort = [{ field: "id", direction: "desc" }];
      const loaded = list.load();
      held[0].answer.resolve();
      await loaded;
      list.sort = [];
      list.filter = "{id} > 2";
      expect(requests.slice(1), "#1: page reads, the second carries the filter")
        .toEqual([{ skip: 0, take: 2, filter: "", sort: [] }, { skip: 0, take: 2, filter: "{id} > 2", sort: [] }]);
      expect(list.isPagedBySource, "#2: the whole storage is still in force").toBe(false);
      expect(pageIds(list), "#3: the view in force is run over it").toEqual([3, 4]);
      held[2].answer.reject(new Error("offline"));
      await flush();
      expect(errors.map(e => e.operation), "#4").toEqual(["read"]);
      expect(list.isPagedBySource, "#5: a failed page read keeps the whole storage").toBe(false);
      expect(pageIds(list), "#6: still filtered").toEqual([3, 4]);
      expect(list.filter, "#7").toBe("{id} > 2");
    });
  });
  test("a filter the list cannot parse is reported and dropped, and the page is read", () => {
    const { source, requests } = createSource(5, { paging: true });
    const list = new DynamicDataList(source);
    const errors = collectErrors(list);
    list.pageSize = 2;
    list.load();
    requests.length = 0;
    list.filter = "{id} >";
    expect(errors.map(e => e.operation), "#1").toEqual(["read"]);
    expect(list.filter, "#2").toBe("");
    expect(requests, "#3").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }]);
    expect(list.isPagedBySource, "#4").toBe(true);
  });
  test("a source that pages and filters still gets the filter in a page read", () => {
    const { source, requests } = createSource(5, { paging: true, filtering: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    list.filter = "{id} > 2";
    expect(requests[1], "#1").toEqual({ skip: 0, take: 2, filter: "{id} > 2", sort: [] });
    expect(list.isPagedBySource, "#2").toBe(true);
  });
  test("a list never asked to load reads nothing when a filter is set, and its first read is the whole storage", () => {
    const { source, requests } = createSource(5, { paging: true });
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.filter = "{id} > 2";
    expect(requests, "#1").toEqual([]);
    expect(list.isPagedBySource, "#2: nothing committed, the next read decides").toBe(false);
    list.load();
    expect(requests, "#3").toEqual([wholeRequest]);
    expect(list.getPageIndexes(), "#4").toEqual([3, 4]);
  });
});
/* A write names its record by key. Only an in-memory array is written by position: the list is its
   only writer and writes it synchronously. Any other source without keyField is read-only, whatever
   methods it has, so that no write ever names a record by a position the source resolves another way. */
describe("DynamicDataList: a source without keyField is read-only", () => {
  const createUnkeyed = (calls: Array<string>, records: Array<any>): IDynamicDataSource => ({
    capabilities: { paging: true, sorting: true },
    read: (request: IDynamicDataReadRequest): IDynamicDataReadResult => {
      // The source sorts on its side: a position in its answer is not a position in its storage.
      const sorted = records.slice().sort((a: any, b: any): number => b.id - a.id);
      return { records: sorted.slice(request.skip, request.skip + (request.take || sorted.length)), total: sorted.length };
    },
    insert: (): void => { calls.push("insert"); },
    update: (key: any): void => { calls.push("update:" + key); },
    remove: (key: any): void => { calls.push("remove:" + key); },
    move: (key: any): void => { calls.push("move:" + key); }
  });
  test("a custom source without keyField gets no insert, update, remove or move, whatever methods it has", () => {
    const calls: Array<string> = [];
    const list = new DynamicDataList(createUnkeyed(calls, createRecords(4)));
    list.pageSize = 2;
    list.load();
    ["insert", "update", "remove", "move"].forEach((op: any): void => {
      expect(list.hasCapability(op), "#1: " + op).toBe(false);
    });
    expect(list.hasCapability("read"), "#2").toBe(true);
    list.setValue(0, "name", "edited");
    list.move(0, 1);
    list.add({ id: 9 });
    list.remove(0);
    expect(calls, "#3: nothing is sent").toEqual([]);
  });
  test("the same source with keyField receives every write by the key of the record it was made to", () => {
    const calls: Array<string> = [];
    const source = createUnkeyed(calls, createRecords(4));
    source.keyField = "id";
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    expect(list.getRecord(0).id, "#1: the source sorts on its side").toBe(3);
    list.setValue(0, "name", "edited");
    expect(calls, "#2: the record the edit was made to, not position 0 of the storage").toEqual(["update:3"]);
  });
  test("an in-memory array is written by storage index without keyField", () => {
    const list = createList(createRecords(3));
    ["insert", "update", "remove", "move"].forEach((op: any): void => {
      expect(list.hasCapability(op), "#1: " + op).toBe(true);
    });
    list.setValue(1, "name", "edited");
    list.remove(0);
    expect((<ArrayDynamicDataSource>list.source).array, "#2").toEqual([{ id: 1, name: "edited" }, { id: 2, name: "r2" }]);
  });
});
/* User code the list calls from an answer of its source - the owner's follow-up of a committed read,
   an error listener - may throw. The read is over and the chain goes on: the exception surfaces as
   the rejection of that answer's continuation. */
describe("DynamicDataList: user code that throws in an answer of the source", () => {
  const catchUnhandled = (): { errors: Array<any>, restore: () => void } => {
    const listeners = process.listeners("unhandledRejection");
    process.removeAllListeners("unhandledRejection");
    const errors: Array<any> = [];
    const onRejection = (reason: any): void => { errors.push(reason); };
    process.on("unhandledRejection", onRejection);
    return {
      errors: errors,
      restore: (): void => {
        process.removeListener("unhandledRejection", onRejection);
        listeners.forEach((listener: any) => process.on("unhandledRejection", listener));
      }
    };
  };
  test("a commit whose notification throws ends the read: the caller awaiting it gets the exception, the list is not loading", async () => {
    const source = new FakeAsyncRangeSource(createRecords(10));
    const list = new DynamicDataList(source);
    list.pageSize = 5;
    let isThrowing = true;
    list.onChanged = (change: IDynamicDataListChange): void => {
      if (isThrowing && change.type === "reset") {
        isThrowing = false;
        throw new Error("owner");
      }
    };
    const loaded = list.load();
    expect(list.isLoading, "#1").toBe(true);
    source.resolveRead(0);
    let error: any = undefined;
    await (<Promise<void>>loaded).catch((e: any): void => { error = e; });
    expect(error && error.message, "#2: the exception reaches the caller").toBe("owner");
    expect(list.isLoading, "#3: the read is over").toBe(false);
    expect(list.loadedCount, "#4: and committed").toBe(5);
  });
  test("a queued write that fails synchronously while the error listener throws: a later write still runs", async () => {
    const calls: Array<string> = [];
    const first = new Deferred();
    let updates = 0;
    const source: IDynamicDataSource = {
      keyField: "id",
      read: (): Array<any> => createRecords(3),
      update: (key: any): any => {
        calls.push("update:" + key);
        updates++;
        if (updates === 1) return first.promise;
        if (updates === 2) throw new Error("server");
        return undefined;
      }
    };
    const list = new DynamicDataList(source);
    list.load();
    list.onError = (): void => { throw new Error("listener"); };
    const unhandled = catchUnhandled();
    try {
      list.setValue(0, "name", "a");
      list.setValue(1, "name", "b");
      list.setValue(2, "name", "c");
      expect(calls, "#1: the second and third wait for the first").toEqual(["update:0"]);
      first.resolve();
      await flush();
      // The rejection is reported once the microtasks drain.
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      await flush();
    } finally {
      unhandled.restore();
    }
    expect(calls, "#2: the third ran after the second failed").toEqual(["update:0", "update:1", "update:2"]);
    expect(unhandled.errors.map(e => e.message), "#3: the listener's exception is not swallowed").toEqual(["listener"]);
    expect(list.hasPendingWrites, "#4").toBe(false);
  });
});

/* A failed write to a source the owner assigned is that source's failure, whatever its class: it is
   reported (onError) and does not throw. The window keeps the local change, except after a refused
   insert, remove or move of an in-memory source, which is addressed by storage index: that window goes
   back to what the source stores, so that no later write lands on another record. A failed write to
   the owner's own storage is still the caller's exception. */
describe("DynamicDataList: a failed write to an assigned source is reported", () => {
  interface IFailingArray { source: ArrayDynamicDataSource, get: () => Array<any>, failures: { count: number } }
  // The setter throws before it stores, as often as failures.count says.
  function createFailingArray(names: Array<string>): IFailingArray {
    let arr: Array<any> = names.map((name: string): any => ({ name: name }));
    const failures = { count: 0 };
    const source = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => {
      if (failures.count > 0) {
        failures.count--;
        throw new Error("setter");
      }
      arr = a;
    });
    return { source: source, get: (): Array<any> => arr, failures: failures };
  }
  function createOwnList(): { list: DynamicDataList, failures: { count: number }, get: () => Array<any> } {
    let own: Array<any> = createRecords(2);
    const failures = { count: 0 };
    const list = DynamicDataList.createReadThrough(undefined, (): Array<any> => own, (a: Array<any>): void => {
      if (failures.count > 0) {
        failures.count--;
        throw new Error("own setter");
      }
      own = a;
    });
    return { list: list, failures: failures, get: (): Array<any> => own };
  }
  function attachFailing(names: Array<string> = ["A", "B", "C"]): { list: DynamicDataList, assigned: IFailingArray, errors: Array<string>, changes: Array<string> } {
    const { list } = createOwnList();
    const assigned = createFailingArray(names);
    list.assignSource(assigned.source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation + ":" + error.message); };
    return { list: list, assigned: assigned, errors: errors, changes: recordChanges(list) };
  }
  const names = (records: Array<any>): Array<string> => records.map((r: any): string => r.name);

  test("a failed update is reported and kept: the window has the edit, the array does not", () => {
    const { list, assigned, errors, changes } = attachFailing();
    assigned.failures.count = 1;
    expect((): void => { list.setValue(0, "name", "edited"); }, "#1").not.toThrow();
    expect(errors, "#2").toEqual(["update:setter"]);
    expect(names(list.getLoadedRecords()), "#3: kept").toEqual(["edited", "B", "C"]);
    expect(names(assigned.get()), "#4").toEqual(["A", "B", "C"]);
    expect(changes, "#5: no reset").toEqual(["recordChanged:0:name"]);
  });
  const structuralWrites: Array<{ operation: string, run: (list: DynamicDataList) => void, notification: string }> = [
    { operation: "insert", run: (list: DynamicDataList): void => { list.add({ name: "X" }, 0); }, notification: "recordAdded:0" },
    { operation: "remove", run: (list: DynamicDataList): void => { list.remove(0); }, notification: "recordRemoved:0" },
    { operation: "move", run: (list: DynamicDataList): void => { list.move(0, 2); }, notification: "recordMoved:0>2" }
  ];
  structuralWrites.forEach((write): void => {
    test("a failed " + write.operation + " is reported and the window goes back to what the source stores", () => {
      const { list, assigned, errors, changes } = attachFailing();
      assigned.failures.count = 1;
      expect((): void => { write.run(list); }, "#1").not.toThrow();
      expect(errors, "#2").toEqual([write.operation + ":setter"]);
      expect(names(list.getLoadedRecords()), "#3: the window is the storage").toEqual(["A", "B", "C"]);
      expect(names(assigned.get()), "#4").toEqual(["A", "B", "C"]);
      expect(changes, "#5: one reset, after the write's own notification").toEqual([write.notification, "reset"]);
    });
    test("an edit after a failed " + write.operation + " lands on the record it was made in", () => {
      for (const failureCount of [1, 2]) {
        const { list, assigned } = attachFailing();
        assigned.failures.count = failureCount;
        for (let i = 0; i < failureCount; i++) {
          write.run(list);
        }
        list.setValue(1, "name", "B-edited");
        expect(names(assigned.get()), "#1: " + failureCount + " failures").toEqual(["A", "B-edited", "C"]);
        expect(names(list.getLoadedRecords()), "#2: " + failureCount + " failures").toEqual(["A", "B-edited", "C"]);
      }
    });
  });
  /* A source without keyField that answers asynchronously: a remove that fails in the queue behind a
     pending update is reported, and the window is read again from the array - the local removal would
     have every later write address the record after the one it was made in. The writes queued before
     the failure carry those positions too: they are dropped and reported. */
  function attachAsyncArray(): { list: DynamicDataList, settle: () => void, stored: () => Array<any>, errors: Array<string>, changes: Array<string> } {
    let settleUpdate: () => void;
    class AsyncArraySource extends ArrayDynamicDataSource {
      public update(sourceIndex: number, record: any): Promise<void> {
        return new Promise<void>((resolve: () => void): void => {
          settleUpdate = (): void => { super.update(sourceIndex, record); resolve(); };
        });
      }
      public remove(): void { throw new Error("remove"); }
    }
    let stored: Array<any> = [{ name: "A" }, { name: "B" }, { name: "C" }];
    const { list } = createOwnList();
    list.assignSource(new AsyncArraySource((): Array<any> => stored, (arr: Array<any>): void => { stored = arr; }));
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation + ":" + error.message); };
    return { list: list, settle: (): void => settleUpdate(), stored: (): Array<any> => stored, errors: errors, changes: recordChanges(list) };
  }
  test("a failed remove queued behind an asynchronous update is reported, and the window is read again from the array", async () => {
    const { list, settle, stored, errors, changes } = attachAsyncArray();
    list.setValue(1, "name", "b");
    list.remove(0);
    changes.length = 0;
    settle();
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(errors, "#1: reported once").toEqual(["remove:remove"]);
    expect([names(list.getLoadedRecords()), names(stored())], "#2: the window and the array").toEqual([["A", "b", "C"], ["A", "b", "C"]]);
    expect(changes, "#3: the owner starts over").toEqual(["reset"]);
    list.setValue(0, "name", "A-edited");
    settle();
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(names(stored()), "#4: the next edit lands on its record").toEqual(["A-edited", "b", "C"]);
  });
  test("an update queued after a failing remove is dropped and reported, and the array keeps every record", async () => {
    const { list, settle, stored, errors } = attachAsyncArray();
    list.setValue(1, "name", "b");
    list.remove(0);
    list.setValue(0, "name", "b-edited");
    settle();
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(errors.length, "#1: the remove and the dropped update").toBe(2);
    expect(errors[0], "#2").toBe("remove:remove");
    expect(errors[1].indexOf("update:"), "#3").toBe(0);
    expect(names(stored()), "#4: no record is overwritten").toEqual(["A", "b", "C"]);
    expect(names(list.getLoadedRecords()), "#5").toEqual(["A", "b", "C"]);
  });
  test("a batch with a remove and an update that fails at commit: reported once, the window goes back, the next edit lands right", () => {
    const { list, assigned, errors, changes } = attachFailing();
    assigned.failures.count = 1;
    expect((): void => {
      list.batch((): void => {
        list.remove(0);
        list.setValue(0, "name", "B-batch");
      });
    }, "#1").not.toThrow();
    expect(errors, "#2: the first operation").toEqual(["remove:setter"]);
    expect(names(list.getLoadedRecords()), "#3").toEqual(["A", "B", "C"]);
    expect(changes, "#4").toEqual(["recordRemoved:0", "recordChanged:0:name", "reset"]);
    list.setValue(1, "name", "B-edited");
    expect(names(assigned.get()), "#5").toEqual(["A", "B-edited", "C"]);
  });
  test("the own storage: a setter that throws on a single write or at a batch commit still throws at the caller", () => {
    const { list, failures, get } = createOwnList();
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    failures.count = 1;
    expect((): void => { list.setValue(0, "name", "edited"); }, "#1").toThrow("own setter");
    expect(list.getRecord(0).name, "#2: the window follows the storage").toBe("r0");
    failures.count = 1;
    expect((): void => { list.batch((): void => { list.setValue(0, "name", "edited"); }); }, "#3").toThrow("own setter");
    expect(names(get()), "#4").toEqual(["r0", "r1"]);
    expect(list.getRecord(0).name, "#5").toBe("r0");
    expect(errors, "#6: nothing reported").toEqual([]);
  });
  test("after a detach the next write goes to a fresh own storage, and its failure throws again", () => {
    let own: Array<any> = createRecords(2);
    let ownFailures = 0;
    const list = DynamicDataList.createReadThrough(undefined, (): Array<any> => own, (a: Array<any>): void => {
      if (ownFailures > 0) {
        ownFailures--;
        throw new Error("own setter");
      }
      own = a;
    });
    const assigned = createFailingArray(["A", "B"]);
    list.assignSource(assigned.source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    assigned.failures.count = 1;
    list.setValue(0, "name", "edited");
    expect(errors, "#1: reported").toEqual(["update"]);
    list.assignSource(undefined);
    list.setValue(0, "name", "own-edited");
    expect(own[0].name, "#2: the own storage got it").toBe("own-edited");
    ownFailures = 1;
    expect((): void => { list.setValue(1, "name", "x"); }, "#3").toThrow("own setter");
    expect(errors, "#4").toEqual(["update"]);
  });
});

/* The window offset is the destination of a refresh only while no page move is pending; otherwise the
   refresh reads the page the move asked for, and that page commits with its index. */
describe("DynamicDataList: a refresh during a page move reads the page of the move", () => {
  // A source that pages, filters ("{field} > n") and sorts, and answers each read when the test says so.
  class DeferredViewSource implements IDynamicDataSource {
    public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
    public requests: Array<IDynamicDataReadRequest> = [];
    public reads: Array<Deferred> = [];
    constructor(public records: Array<any>) { }
    public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
      this.requests.push(request);
      const deferred = new Deferred();
      this.reads.push(deferred);
      return deferred.promise;
    }
    public answer(index: number): void {
      const request = this.requests[index];
      let view = this.records.slice();
      const parts = /^\{(\w+)\}\s*>\s*(\d+)$/.exec(request.filter || "");
      if (!!parts) {
        view = view.filter((record: any): boolean => record[parts[1]] > Number(parts[2]));
      }
      (request.sort || []).slice().reverse().forEach((s: any): void => {
        const sign = s.direction === "desc" ? -1 : 1;
        view.sort((a: any, b: any): number => (a[s.field] === b[s.field] ? 0 : (a[s.field] < b[s.field] ? -1 : 1)) * sign);
      });
      this.reads[index].resolve({ records: view.slice(request.skip, request.skip + request.take), total: view.length });
    }
    public get skips(): Array<number> {
      return this.requests.map((request: IDynamicDataReadRequest): number => request.skip);
    }
  }
  const setUp = async (page: number): Promise<{ list: DynamicDataList, source: DeferredViewSource }> => {
    const source = new DeferredViewSource(createRecords(40));
    const list = new DynamicDataList(source);
    list.pageSize = 10;
    list.load();
    source.answer(0);
    await flush();
    if (page > 0) {
      list.pageIndex = page;
      source.answer(1);
      await flush();
    }
    source.requests = [];
    source.reads = [];
    return { list: list, source: source };
  };
  const ids = (list: DynamicDataList): Array<any> => list.getLoadedRecords().map((record: any): any => record.id);
  test("pageIndex = 1, then refresh(): both read page 1, which commits with index 1 in either order", async () => {
    for (const order of [[0, 1], [1, 0]]) {
      const { list, source } = await setUp(0);
      list.pageIndex = 1;
      list.refresh();
      expect(source.skips, "#1: " + order).toEqual([10, 10]);
      order.forEach((i: number): void => { source.answer(i); });
      await flush();
      expect(list.pageIndex, "#2: " + order).toBe(1);
      expect(list.windowOffset, "#3: " + order).toBe(10);
      expect(ids(list)[0], "#4: " + order).toBe(10);
      expect(list.isLoading, "#5: " + order).toBe(false);
    }
  });
  test("no page move pending: a refresh reads the window in force at its own offset", async () => {
    const { list, source } = await setUp(2);
    list.refresh();
    expect(source.skips, "#1").toEqual([20]);
  });
  test("a new filter, then refresh(): page 0 of the new view, index 0", async () => {
    const { list, source } = await setUp(2);
    list.setView("{id} > 5", []);
    list.refresh();
    expect(source.skips, "#1").toEqual([0, 0]);
    source.answer(1);
    source.answer(0);
    await flush();
    expect(list.pageIndex, "#2").toBe(0);
    expect(list.windowOffset, "#3").toBe(0);
    expect(ids(list)[0], "#4").toBe(6);
  });
  test("a new sort, then refresh(): the page in force in the new order, its index kept", async () => {
    const { list, source } = await setUp(2);
    list.setView("", [{ field: "id", direction: "desc" }]);
    list.refresh();
    expect(source.skips, "#1").toEqual([20, 20]);
    source.answer(0);
    source.answer(1);
    await flush();
    expect(list.pageIndex, "#2").toBe(2);
    expect(list.windowOffset, "#3").toBe(20);
    expect(ids(list)[0], "#4").toBe(19);
  });
});
