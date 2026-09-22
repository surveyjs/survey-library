import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { DynamicDataRemoteController } from "../../src/dynamic-data/dynamic-data-remote";
import {
  IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataReadResult, IDynamicDataSource
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

// A source that pages itself. It is synchronous, so the list stays synchronous with it.
class FakeRangeSource implements IDynamicDataSource {
  public readCalls: number = 0;
  public rangeCalls: Array<{ skip: number, take: number }> = [];
  public ops: Array<string> = [];
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    this.readCalls++;
    return this.records;
  }
  public readRange(skip: number, take: number): IDynamicDataReadResult {
    this.rangeCalls.push({ skip: skip, take: take });
    const count = take > 0 ? take : this.records.length;
    return { records: this.records.slice(skip, skip + count), total: this.records.length };
  }
  public update(sourceIndex: number, record: any, changedFields: Array<string>): void {
    this.ops.push("update:" + sourceIndex + ":" + changedFields.join(","));
    this.records[sourceIndex] = record;
  }
  public insert(sourceIndex: number, record: any): void {
    this.ops.push("insert:" + sourceIndex);
    this.records.splice(sourceIndex, 0, record);
  }
  public remove(sourceIndex: number): void {
    this.ops.push("remove:" + sourceIndex);
    this.records.splice(sourceIndex, 1);
  }
  public move(fromSourceIndex: number, toSourceIndex: number): void {
    this.ops.push("move:" + fromSourceIndex + ">" + toSourceIndex);
    const record = this.records[fromSourceIndex];
    this.records.splice(fromSourceIndex, 1);
    this.records.splice(toSourceIndex, 0, record);
  }
}
// The same, reading on demand through deferreds.
class FakeAsyncRangeSource implements IDynamicDataSource {
  public pendingReads: Array<Deferred> = [];
  public rangeCalls: Array<{ skip: number, take: number }> = [];
  public ops: Array<string> = [];
  constructor(public records: Array<any>) { }
  public read(): Promise<Array<any>> {
    return Promise.resolve(this.records);
  }
  public readRange(skip: number, take: number): Promise<IDynamicDataReadResult> {
    this.rangeCalls.push({ skip: skip, take: take });
    const deferred = new Deferred();
    this.pendingReads.push(deferred);
    return deferred.promise;
  }
  public update(sourceIndex: number, record: any): void {
    this.ops.push("update:" + sourceIndex);
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
  public readCalls: number = 0;
  public ops: Array<string> = [];
  public pendingWrites: Array<Deferred> = [];
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    this.readCalls++;
    return this.records;
  }
  public update(sourceIndex: number, record: any, changedFields: Array<string>): Promise<void> {
    this.ops.push("update:" + sourceIndex + ":" + changedFields.join(","));
    const deferred = new Deferred();
    this.pendingWrites.push(deferred);
    // The write reaches the storage when it is acknowledged, as a server write would.
    return deferred.promise.then((): void => { this.records[sourceIndex] = record; });
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
// A source that filters and sorts itself: the list must not do it locally.
class FakeServerViewSource implements IDynamicDataSource {
  public readCalls: number = 0;
  public filterCalls: number = 0;
  public sortCalls: number = 0;
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    this.readCalls++;
    return this.records;
  }
  public filterExpressions: Array<string> = [];
  public filter(expression: string): void {
    this.filterCalls++;
    this.filterExpressions.push(expression);
  }
  public sort(): void {
    this.sortCalls++;
  }
}
class FakeSortOnlySource implements IDynamicDataSource {
  public readCalls: number = 0;
  public sortCalls: number = 0;
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    this.readCalls++;
    return this.records;
  }
  public sort(): void {
    this.sortCalls++;
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
    expect(list.filteredCount).toBe(3);
    expect(list.visibleCount).toBe(3);
    expect(list.windowOffset).toBe(0);
    expect(list.getRecord(1).name).toBe("r1");
  });
  test("nothing is loaded before load()", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(3)));
    expect(list.count).toBe(0);
    expect(list.getRecord(0)).toBe(undefined);
  });
  test("a filter does not change count, but changes filteredCount and visibleCount", () => {
    const list = createList(createRecords(5));
    list.filter = "{id} > 2";
    expect(list.count).toBe(5);
    expect(list.loadedCount).toBe(5);
    expect(list.filteredCount).toBe(2);
    expect(list.visibleCount).toBe(2);
  });
  test("visibleCount is unpaged and drops the owner-hidden records", () => {
    const list = createList(createRecords(10));
    list.pageSize = 3;
    list.setRecordVisible(0, false);
    expect(list.count).toBe(10);
    expect(list.filteredCount).toBe(10);
    expect(list.visibleCount).toBe(9);
    expect(list.pageRecordCount).toBe(3);
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
  test("visible index conversions without a filter", () => {
    const list = createList(createRecords(3));
    expect(list.visibleIndexToIndex(1)).toBe(1);
    expect(list.indexToVisibleIndex(1)).toBe(1);
    expect(list.visibleIndexToIndex(3)).toBe(-1);
    expect(list.visibleIndexToIndex(-1)).toBe(-1);
  });
  test("visible index conversions with a hidden record", () => {
    const list = createList(createRecords(4));
    list.setRecordVisible(1, false);
    expect(list.visibleIndexToIndex(1)).toBe(2);
    expect(list.indexToVisibleIndex(2)).toBe(1);
    expect(list.indexToVisibleIndex(1)).toBe(-1);
  });
  test("visible index conversions with a sort", () => {
    const list = createList([{ id: 3 }, { id: 1 }, { id: 2 }]);
    list.sort = [{ field: "id", direction: "asc" }];
    expect(list.getVisibleIndexes()).toEqual([1, 2, 0]);
    expect(list.visibleIndexToIndex(0)).toBe(1);
    expect(list.indexToVisibleIndex(0)).toBe(2);
  });
  test("page-local index conversions", () => {
    const list = createList(createRecords(10));
    list.pageSize = 3;
    list.pageIndex = 1;
    expect(list.getPageIndexes()).toEqual([3, 4, 5]);
    expect(list.pageLocalIndexToIndex(0)).toBe(3);
    expect(list.indexToPageLocalIndex(4)).toBe(1);
    expect(list.indexToPageLocalIndex(0)).toBe(-1);
    expect(list.pageLocalIndexToIndex(3)).toBe(-1);
    expect(list.pageLocalIndexToIndex(-1)).toBe(-1);
  });
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
});

describe("DynamicDataList: local filter, sort and paging", () => {
  test("filter, sort and paging combine", () => {
    const list = createList(createRecords(10));
    list.filter = "{id} > 2";
    list.sort = [{ field: "id", direction: "desc" }];
    list.pageSize = 3;
    expect(list.filteredCount).toBe(7);
    expect(list.visibleCount).toBe(7);
    expect(list.pageCount).toBe(3);
    expect(list.getPageIndexes()).toEqual([9, 8, 7]);
    list.pageIndex = 2;
    expect(list.getPageIndexes()).toEqual([3]);
    expect(list.pageRecordCount).toBe(1);
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
    expect(list.pageRecordCount).toBe(5);
    list.pageSize = 2;
    list.pageSize = 0;
    expect(list.pageRecordCount).toBe(5);
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
    expect(errors).toEqual(["filter"]);
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
  test("the list reads one page and never calls read()", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.pageSize = 2;
    list.load();
    expect(source.readCalls).toBe(0);
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
  test("a local sort is applied to the window the source returned", () => {
    const source = new FakeRangeSource(createRecords(5));
    const list = new DynamicDataList(source);
    list.pageSize = 3;
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    // Only meaningful because the window happens to be a page: the sort cannot see the other pages.
    expect(list.getVisibleIndexes()).toEqual([2, 1, 0]);
    expect(list.getPageIndexes()).toEqual([2, 1, 0]);
  });
  test("the source index of an edit is the window offset plus the record index", () => {
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
    list.move(0, 1);
    expect(source.ops[3]).toBe("move:2>3");
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
  test("the list calls the source and re-reads instead of filtering locally", () => {
    const source = new FakeServerViewSource(createRecords(4));
    const list = new DynamicDataList(source);
    list.load();
    expect(source.readCalls).toBe(1);
    list.filter = "{id} > 100";
    expect(source.filterCalls).toBe(1);
    expect(source.readCalls).toBe(2);
    // The source receives the expression text and translates it into its own dialect.
    expect(source.filterExpressions).toEqual(["{id} > 100"]);
    // The window is taken as it came: nothing is filtered out locally.
    expect(list.visibleCount).toBe(4);
    expect(list.filteredCount).toBe(4);
    expect(list.getVisibleIndexes()).toEqual([0, 1, 2, 3]);
  });
  test("an expression a source cannot run locally still reaches it untouched", () => {
    const source = new FakeServerViewSource(createRecords(2));
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.load();
    // The list never parses it: whether the source understands it is the source's business.
    list.filter = "{id} someServerOperator 5";
    expect(source.filterExpressions).toEqual(["{id} someServerOperator 5"]);
    expect(errors).toEqual([]);
    expect(list.filter).toBe("{id} someServerOperator 5");
  });
  test("the same for the sort", () => {
    const source = new FakeServerViewSource(createRecords(3));
    const list = new DynamicDataList(source);
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(source.sortCalls).toBe(1);
    expect(source.readCalls).toBe(2);
    expect(list.getVisibleIndexes()).toEqual([0, 1, 2]);
  });
  test("a source that only sorts still gets a local filter", () => {
    const source = new FakeSortOnlySource(createRecords(4));
    const list = new DynamicDataList(source);
    list.load();
    list.sort = [{ field: "id", direction: "desc" }];
    expect(source.sortCalls).toBe(1);
    expect(source.readCalls).toBe(2);
    expect(list.getVisibleIndexes()).toEqual([0, 1, 2, 3]);
    list.filter = "{id} > 1";
    expect(source.readCalls).toBe(2);
    expect(list.getVisibleIndexes()).toEqual([2, 3]);
    expect(list.filteredCount).toBe(2);
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
    expect(source.ops).toEqual(["update:0:name", "insert:1", "remove:0", "move:0>1"]);
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
    const source = new FakeAsyncWriteSource([{ a: 1 }]);
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
    expect(source.records[0]).toEqual({ a: 2, b: 3 });
  });
  test("a rejected push reports onError, keeps the local value and continues the chain", async () => {
    const source = new FakeAsyncWriteSource([{ a: 1 }]);
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
    const source = new FakeAsyncWriteSource([{ a: 1 }]);
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
    list.isReadThrough = true;
    list.load();
    return { list: list, get: (): Array<any> => stored, writes: writes };
  };
  test("reads the owner array on demand, without a load", () => {
    let stored: Array<any> = [{ a: 1 }];
    const list = new DynamicDataList(new ArrayDynamicDataSource(() => stored, (arr) => { stored = arr; }));
    list.isReadThrough = true;
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
    list.isReadThrough = true;
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
  public ops: Array<string> = [];
  public pendingWrites: Array<Deferred> = [];
  constructor(public name: string, public records: Array<any>) { }
  public read(): Array<any> {
    return this.records;
  }
  public update(sourceIndex: number, record: any): Promise<void> {
    this.ops.push(this.name + ":" + sourceIndex + ":" + JSON.stringify(record));
    const deferred = new Deferred();
    this.pendingWrites.push(deferred);
    return deferred.promise.then((): void => { this.records[sourceIndex] = record; });
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
  list.isReadThrough = true;
  list.load();
  return { list: list, set: (arr: Array<any>): void => { stored = arr; } };
}

describe("DynamicDataList: a replaced source", () => {
  test("a queued write is pushed to the source it was enqueued against", async () => {
    const oldSource = new FakeNamedAsyncWriteSource("old", [{ a: 1 }]);
    const newSource = new FakeNamedAsyncWriteSource("new", [{ a: 1 }]);
    const list = new DynamicDataList(oldSource);
    list.load();
    list.setValue(0, "a", 2);
    list.setValue(0, "a", 3);
    expect(oldSource.ops, "#1: the second push is queued").toEqual(["old:0:{\"a\":2}"]);
    list.source = newSource;
    oldSource.pendingWrites[0].resolve();
    await flush();
    expect(oldSource.ops, "#2: both edits belong to the old source")
      .toEqual(["old:0:{\"a\":2}", "old:0:{\"a\":3}"]);
    expect(newSource.ops, "#3: the new source got nothing").toEqual([]);
    expect(newSource.records, "#4: the new record was not overwritten").toEqual([{ a: 1 }]);
  });
  test("the new source is read at once: the detached pushes are not waited for", async () => {
    const oldSource = new FakeNamedAsyncWriteSource("old", [{ a: 1 }]);
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
    expect(list.pageRecordCount, "#2").toBe(1);
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
    expect(list.pageRecordCount, "#3").toBe(1);
    expect(changes, "#4: recordRemoved first, pageChanged second").toEqual(["recordRemoved:1", "pageChanged"]);
  });
  test("truncate clamps the page index", () => {
    const list = createList(createRecords(4));
    list.pageSize = 2;
    list.pageIndex = 1;
    list.truncate(2);
    expect(list.pageIndex, "#1").toBe(0);
    expect(list.pageRecordCount, "#2").toBe(2);
  });
  test("setRecordVisible clamps the page index", () => {
    const list = createList(createRecords(3));
    list.pageSize = 1;
    list.pageIndex = 2;
    list.setRecordVisible(2, false);
    expect(list.pageIndex, "#1").toBe(1);
    expect(list.pageRecordCount, "#2").toBe(1);
  });
  test("an edit that makes a record fail the local filter clamps the page index", () => {
    const list = createList([{ a: 1 }, { a: 1 }]);
    list.filter = "{a} = 1";
    list.pageSize = 1;
    list.pageIndex = 1;
    list.setValue(1, "a", 2);
    expect(list.visibleCount, "#1").toBe(1);
    expect(list.pageIndex, "#2").toBe(0);
    expect(list.pageRecordCount, "#3").toBe(1);
  });
  test("a clamped page index reloads the page of a readRange source", () => {
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
    expect(list.filteredCount, "#4").toBe(2);
  });
  test("the owner-hidden records do not change the sorted order of the rest", () => {
    const list = createList([{ a: 3 }, { a: 1 }, { a: 2 }]);
    list.sort = [{ field: "a", direction: "asc" }];
    list.setRecordVisible(1, false);
    expect(list.getCreatedIndexes(), "#1").toEqual([1, 2, 0]);
    expect(list.getVisibleIndexes(), "#2").toEqual([2, 0]);
  });
  test("addAtCreatedIndex puts the object where it is asked for and the record with it", () => {
    const list = createList([{ a: 1 }, { a: 2 }, { a: 1 }]);
    list.isViewFrozenOnEdit = true;
    list.filter = "{a} = 1";
    expect(list.getCreatedIndexes(), "#1").toEqual([0, 2]);
    const index = list.addAtCreatedIndex({ a: 9 }, 1);
    expect(index, "#2: the record took the place of the object it pushed aside").toBe(2);
    expect(list.getCreatedIndexes(), "#3: the new object is at created position 1").toEqual([0, 2, 3]);
    expect(list.getRecord(2), "#4").toEqual({ a: 9 });
    expect(list.count, "#5").toBe(4);
  });
  test("addAtCreatedIndex at the end appends the record", () => {
    const list = createList([{ a: 1 }, { a: 2 }]);
    list.isViewFrozenOnEdit = true;
    list.filter = "{a} = 1";
    const index = list.addAtCreatedIndex({ a: 7 }, 5);
    expect(index, "#1").toBe(2);
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 2]);
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
    list.isReadThrough = true;
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
  public calls: Array<ITableCall> = [];
  public removedIds: Array<any> = [];
  public auto: boolean = false;
  constructor(public records: Array<any>) { }
  public read(): Promise<Array<any>> {
    const snapshot = this.records.slice();
    return this.call("read", [], (): Array<any> => snapshot);
  }
  public readRange(skip: number, take: number): Promise<IDynamicDataReadResult> {
    const size = take > 0 ? take : this.records.length;
    const snapshot = { records: this.records.slice(skip, skip + size).map(this.copy), total: this.records.length };
    return this.call("readRange", [skip, take], (): IDynamicDataReadResult => snapshot);
  }
  public update(sourceIndex: number, record: any): Promise<void> {
    return this.call("update", [sourceIndex], (): void => { this.records[sourceIndex] = this.copy(record); });
  }
  public insert(sourceIndex: number, record: any): Promise<void> {
    return this.call("insert", [sourceIndex], (): void => { this.records.splice(sourceIndex, 0, this.copy(record)); });
  }
  public remove(sourceIndex: number): Promise<void> {
    return this.call("remove", [sourceIndex], (): void => {
      this.removedIds.push(this.records[sourceIndex].id);
      this.records.splice(sourceIndex, 1);
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
  test("[R] a remove on the first page of three reads the page again", async () => {
    const source = new FakeTableSource(tableRecords(30));
    source.auto = true;
    const list = await createTableList(source);
    list.remove(0);
    await flush(SETTLE_TURNS);
    expect(source.argsOf("readRange"), "#1: one extra read of the same page").toEqual([[0, 10], [0, 10]]);
    expect(list.loadedCount, "#2: the page is full again").toBe(10);
    expect(list.count, "#3").toBe(29);
    expect(windowIds(list), "#4: the first record of the old second page moved up").toEqual(idRange(1, 10));
    expect(list.isLoading, "#5").toBe(false);
  });
  test("[R] removing every record of the first page one by one keeps it full", async () => {
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
  test("[R] ten removes without settling end in one committed window", async () => {
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
  test("[P] a remove on the last page reads nothing", async () => {
    const shortSource = new FakeTableSource(tableRecords(25));
    shortSource.auto = true;
    const shortList = await createTableList(shortSource);
    shortList.pageIndex = 2;
    await flush(SETTLE_TURNS);
    const shortReads = shortSource.argsOf("readRange").length;
    shortList.remove(0);
    await flush(SETTLE_TURNS);
    expect(shortSource.argsOf("readRange").length, "#1: short last page - no read").toBe(shortReads);
    expect(windowIds(shortList), "#2").toEqual([21, 22, 23, 24]);

    const fullSource = new FakeTableSource(tableRecords(30));
    fullSource.auto = true;
    const fullList = await createTableList(fullSource);
    fullList.pageIndex = 2;
    await flush(SETTLE_TURNS);
    const fullReads = fullSource.argsOf("readRange").length;
    fullList.remove(0);
    await flush(SETTLE_TURNS);
    expect(fullSource.argsOf("readRange").length, "#3: full last page - no read").toBe(fullReads);
    expect(fullList.loadedCount, "#4: one shorter").toBe(9);
    expect(fullList.count, "#5").toBe(29);
  });
  test("[P] removing the only record of the last page reads the previous page once", async () => {
    const source = new FakeTableSource(tableRecords(21));
    source.auto = true;
    const list = await createTableList(source);
    list.pageIndex = 2;
    await flush(SETTLE_TURNS);
    expect(windowIds(list), "#1").toEqual([20]);
    const reads = source.argsOf("readRange").length;
    const changes = recordChanges(list);
    list.remove(0);
    await flush(SETTLE_TURNS);
    expect(source.argsOf("readRange").slice(reads), "#2: exactly one read, for the previous page").toEqual([[10, 10]]);
    expect(changes, "#3").toEqual(["recordRemoved:0", "pageChanged", "loading:true", "reset", "loading:false"]);
    expect(list.pageIndex, "#4").toBe(1);
    expect(windowIds(list), "#5").toEqual(idRange(10, 19));
  });
  test("[P] pageSize 0 with readRange: no refill read", async () => {
    const source = new FakeTableSource(tableRecords(5));
    source.auto = true;
    const list = await createTableList(source, 0);
    expect(source.argsOf("readRange"), "#1").toEqual([[0, 0]]);
    list.remove(0);
    await flush(SETTLE_TURNS);
    expect(source.argsOf("readRange").length, "#2").toBe(1);
    expect(list.loadedCount, "#3").toBe(4);
  });
  test("[R] a rejected refill read keeps the short window", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const errors: Array<string> = [];
    list.onError = (error: any, operation: string): void => { errors.push(operation); };
    list.remove(0);
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    expect(source.pendingOf("readRange").length, "#1: the refill is in flight").toBe(1);
    source.pendingOf("readRange")[0].fail(new Error("boom"));
    await flush(SETTLE_TURNS);
    expect(windowIds(list), "#2: the short window stays").toEqual(idRange(1, 9));
    expect(errors, "#3").toEqual(["read"]);
    expect(list.isLoading, "#4").toBe(false);
    expect(list.hasPendingRead, "#5").toBe(false);
  });
  test("[R] a rejected remove: the refill brings the record back", async () => {
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
  test("[R] two deferred removes: the refill waits for both", async () => {
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
    expect(source.argsOf("readRange").length, "#4: no read while delete 2 is pending").toBe(1);
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    checkNoRemovedRecord("#5");
    expect(source.argsOf("readRange").length, "#6: exactly one read after delete 2").toBe(2);
    source.settleFirst("readRange");
    await flush(SETTLE_TURNS);
    checkNoRemovedRecord("#7");
    expect(windowIds(list), "#8").toEqual(idRange(2, 11));
    expect(list.count, "#9").toBe(28);
    expect(watch.resetsWhilePushPending, "#10: no reset while a push was pending").toBe(0);
  });
  test("[R] a remove made after a re-read deletes the record that was asked for", async () => {
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
    source.settleFirst("readRange");
    await flush(SETTLE_TURNS);
    expect(windowIds(list).indexOf(1), "#1: the removed record is not back").toBe(-1);
    const index = windowIds(list).indexOf(3);
    expect(index > -1, "#2: record 3 is in the window").toBe(true);
    list.remove(index);
    await settleEverything(source);
    expect(source.removedIds.slice().sort((a, b) => a - b), "#3: by identity").toEqual([0, 1, 3]);
    expect(windowIds(list), "#4").toEqual([2].concat(idRange(4, 12)));
  });
  test("[R] an edit enqueued while a read is in flight: the stale answer is not committed", async () => {
    const editSource = new FakeTableSource(tableRecords(30));
    const editList = await createTableList(editSource);
    const editWatch = watchList(editList);
    // The in-flight read is a refresh of the page - what the refill itself is - and the edit lands
    // on a record of that page.
    editList.refresh();
    editList.setValue(0, "name", "edited");
    editSource.settleFirst("readRange");
    await flush(SETTLE_TURNS);
    expect(editList.getValue(0, "name"), "#1: the stale answer did not paint over the edit").toBe("edited");
    await settleEverything(editSource);
    expect(editSource.argsOf("readRange").length, "#2: the page was read again after the push").toBe(3);
    expect(editList.getValue(0, "name"), "#3").toBe("edited");
    expect(editSource.records[0].name, "#4").toBe("edited");
    expect(editWatch.resetsWhilePushPending, "#5").toBe(0);
    expect(editList.isLoading, "#6").toBe(false);
  });
  test("[R] a remove enqueued while a page read is in flight: the stale page is not committed", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = await createTableList(source);
    const watch = watchList(list);
    list.pageIndex = 1;
    // The page read was issued against a server that still has record 0.
    list.remove(0);
    source.settleFirst("readRange");
    await flush(SETTLE_TURNS);
    await settleEverything(source);
    expect(source.removedIds, "#1").toEqual([0]);
    expect(windowIds(list), "#2: page 1 after the removal").toEqual(idRange(11, 20));
    expect(list.count, "#3").toBe(29);
    expect(list.windowOffset, "#4").toBe(10);
    expect(list.isLoading, "#5").toBe(false);
    expect(watch.resetsWhilePushPending, "#6").toBe(0);
  });
  test("[R] hasPendingRead spans the wait for the chain and the read itself", async () => {
    const source = new FakeTableSource(tableRecords(30));
    const list = new DynamicDataList(new FakeTableSource([]));
    list.pageSize = 10;
    const remote = new DynamicDataRemoteController({
      getDataList: (): DynamicDataList => list,
      createValueDataSource: (): IDynamicDataSource => undefined,
      clearValueInSurveyData: (): void => { },
      restoreValueFromSurveyData: (): void => { },
      onDataLoadingChanged: (): void => { },
      onDataSourceError: (): void => { }
    });
    remote.dataSource = source;
    list.load();
    source.settleFirst("readRange");
    await flush(SETTLE_TURNS);
    expect(list.loadedCount, "#1: loaded").toBe(10);
    expect(list.hasPendingRead, "#2: nothing pending").toBe(false);
    expect(remote.isRunning, "#3").toBe(false);
    list.remove(0);
    expect(list.hasPendingRead, "#4: requested").toBe(true);
    expect(list.isLoading, "#5: not started yet").toBe(false);
    expect(remote.isRunning, "#6").toBe(true);
    source.settleFirst("remove");
    await flush(SETTLE_TURNS);
    expect(list.hasPendingRead, "#7: in flight").toBe(true);
    expect(list.isLoading, "#8").toBe(true);
    expect(remote.isRunning, "#9").toBe(true);
    source.settleFirst("readRange");
    await flush(SETTLE_TURNS);
    expect(list.hasPendingRead, "#10: committed").toBe(false);
    expect(list.isLoading, "#11").toBe(false);
    expect(remote.isRunning, "#12").toBe(false);
  });
  test("[P] a source change while a refill is queued: the queued read dies with the chain", async () => {
    const oldSource = new FakeTableSource(tableRecords(30));
    const list = await createTableList(oldSource);
    list.remove(0);
    const newSource = new FakeTableSource(tableRecords(5));
    newSource.auto = true;
    list.source = newSource;
    await flush(SETTLE_TURNS);
    expect(newSource.argsOf("readRange"), "#1: the new source is read once").toEqual([[0, 10]]);
    await settleEverything(oldSource);
    expect(oldSource.argsOf("readRange").length, "#2: the old source is not read again").toBe(1);
    expect(newSource.argsOf("readRange").length, "#3: nor the new one").toBe(1);
    expect(windowIds(list), "#4").toEqual(idRange(0, 4));
    expect(list.isLoading, "#5").toBe(false);
    expect(list.hasPendingRead, "#6").toBeFalsy();
  });
});

describe("DynamicDataList: the read-through count comes from the source", () => {
  // Built the way createReadThroughDataList builds one, over a getter that counts its calls.
  function createCountingList(recordCount: number, withCount: boolean = true): { list: DynamicDataList, source: ArrayDynamicDataSource, reads: () => number } {
    let local: Array<any> = [];
    for (let i = 0; i < recordCount; i++) local.push({ a: i });
    let readCount = 0;
    const source = new ArrayDynamicDataSource((): Array<any> => { readCount++; return local; },
      (arr: Array<any>): void => { local = arr; },
      withCount ? (): number => local.length : undefined);
    const list = new DynamicDataList(source);
    list.isReadThrough = true;
    list.isViewFrozenOnEdit = true;
    list.load();
    return { list: list, source: source, reads: (): number => readCount };
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
    expect(reads() - start, "#4: the guard is answered by count()").toBe(0);
    start = reads();
    expect(list.getValue(5, "a"), "#5").toBe(5);
    expect(reads() - start, "#6: one read").toBe(1);
  });
  test("an array source without count(): the list falls back to the length of the records", () => {
    // Unreachable in production: every ArrayDynamicDataSource implements count(), and the list reads
    // through only an ArrayDynamicDataSource. The branch exists because the capability is optional.
    let local: Array<any> = [{ a: 1 }, { a: 2 }, { a: 3 }];
    let readCount = 0;
    const source = new ArrayDynamicDataSource((): Array<any> => { readCount++; return local; },
      (arr: Array<any>): void => { local = arr; });
    (<any>source).count = undefined;
    const list = new DynamicDataList(source);
    list.isReadThrough = true;
    list.load();
    let start = readCount;
    expect(list.count, "#1").toBe(3);
    expect(readCount - start, "#2: one read per access").toBe(1);
    start = readCount;
    expect(list.count, "#3").toBe(3);
    expect(readCount - start, "#4").toBe(1);
  });
  test("inside a batch count() follows the array being built", () => {
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
