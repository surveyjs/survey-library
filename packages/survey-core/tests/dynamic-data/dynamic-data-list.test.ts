import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
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
