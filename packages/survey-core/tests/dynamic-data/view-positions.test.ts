import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";

/* The positions a list answers for its records - getGlobalVisibleIndex over the visible records and
   indexToCreatedIndex over the created ones - follow every change of the views. Each test asks for
   every record's positions first, so that whatever the list keeps for them is in place, then makes
   one change and compares every record with a fresh lookup in getVisibleIndexes() /
   getCreatedIndexes(). */

function createRecords(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: i, v: i % 3 });
  }
  return res;
}
// The list both questions use: it reads through the storage, so the storage can change outside it.
function createReadThrough(records: Array<any>): { list: DynamicDataList, get: () => Array<any>, set: (arr: Array<any>) => void } {
  let stored = records;
  const list = DynamicDataList.createReadThrough(undefined, () => new ArrayDynamicDataSource(() => stored, (arr: Array<any>): void => { stored = arr; }));
  return { list: list, get: () => stored, set: (arr: Array<any>): void => { stored = arr; } };
}
// One record past each end too: neither map answers a record the list does not hold.
function recordRange(list: DynamicDataList): Array<number> {
  const res: Array<number> = [];
  for (let i = -1; i <= list.loadedCount; i++) res.push(i);
  return res;
}
function primePositions(list: DynamicDataList): void {
  recordRange(list).forEach((i: number): void => {
    list.getGlobalVisibleIndex(i);
    list.indexToCreatedIndex(i);
  });
}
function checkPositions(list: DynamicDataList, label: string): void {
  const visible = list.getVisibleIndexes();
  const created = list.getCreatedIndexes();
  const offset = list.getRecordNumberOffset();
  const range = recordRange(list);
  const expectedVisible = range.map((i: number): number => visible.indexOf(i) < 0 ? -1 : visible.indexOf(i) + offset);
  expect(range.map((i: number): number => list.getGlobalVisibleIndex(i)), label + ": the visible positions").toEqual(expectedVisible);
  expect(range.map((i: number): number => list.indexToCreatedIndex(i)), label + ": the created positions").toEqual(range.map((i: number): number => created.indexOf(i)));
}

describe("DynamicDataList: the record positions follow every change of the views", () => {
  test("a record hidden, then shown again", () => {
    const { list } = createReadThrough(createRecords(8));
    primePositions(list);
    list.setRecordVisible(3, false);
    checkPositions(list, "#1: hidden");
    expect(list.getGlobalVisibleIndex(4), "#2").toBe(3);
    primePositions(list);
    list.setRecordVisible(3, true);
    checkPositions(list, "#3: shown");
    expect(list.getGlobalVisibleIndex(4), "#4").toBe(4);
  });
  test("a batch of visibility flags", () => {
    const { list } = createReadThrough(createRecords(10));
    primePositions(list);
    list.setRecordsVisible((index: number): boolean => index % 3 !== 0);
    checkPositions(list, "#1: hidden");
    expect(list.getVisibleIndexes(), "#2").toEqual([1, 2, 4, 5, 7, 8]);
    primePositions(list);
    list.setRecordsVisible((): boolean => true);
    checkPositions(list, "#3: shown");
  });
  test("a sort set, then changed", () => {
    const { list } = createReadThrough(createRecords(9));
    list.setRecordVisible(4, false);
    primePositions(list);
    list.sort = [{ field: "v", direction: "asc" }];
    checkPositions(list, "#1: set");
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 3, 6, 1, 4, 7, 2, 5, 8]);
    primePositions(list);
    list.sort = [{ field: "id", direction: "desc" }];
    checkPositions(list, "#3: changed");
    expect(list.getCreatedIndexes(), "#4").toEqual([8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });
  test("a filter set, then cleared", () => {
    const { list } = createReadThrough(createRecords(9));
    primePositions(list);
    list.filter = "{v} != 1";
    checkPositions(list, "#1: set");
    expect(list.getCreatedIndexes(), "#2").toEqual([0, 2, 3, 5, 6, 8]);
    expect(list.indexToCreatedIndex(4), "#3: a filtered record has no position").toBe(-1);
    primePositions(list);
    list.filter = "";
    checkPositions(list, "#4: cleared");
    expect(list.indexToCreatedIndex(4), "#5").toBe(4);
  });
  test("a record inserted, removed and moved through the list", () => {
    const { list } = createReadThrough(createRecords(6));
    list.sort = [{ field: "id", direction: "desc" }];
    list.setRecordVisible(2, false);
    primePositions(list);
    list.add({ id: 10, v: 0 }, 1);
    checkPositions(list, "#1: inserted");
    primePositions(list);
    list.remove(4);
    checkPositions(list, "#2: removed");
    primePositions(list);
    list.move(0, 3);
    checkPositions(list, "#3: moved");
    expect(list.loadedCount, "#4").toBe(6);
  });
  test("the record count changed outside the list: the storage grows and shrinks with no list call", () => {
    const store = createReadThrough(createRecords(5));
    const list = store.list;
    list.setRecordVisible(1, false);
    primePositions(list);
    store.set(store.get().concat(createRecords(3)));
    expect(list.loadedCount, "#1").toBe(8);
    checkPositions(list, "#2: grown");
    expect(list.getGlobalVisibleIndex(7), "#3: a new record has a position").toBe(6);
    primePositions(list);
    store.set(store.get().slice(0, 3));
    expect(list.loadedCount, "#4").toBe(3);
    checkPositions(list, "#5: shrunk");
    expect(list.getGlobalVisibleIndex(4), "#6: a record that is gone has none").toBe(-1);
    expect(list.indexToCreatedIndex(4), "#7").toBe(-1);
  });
  test("the record count changed outside the list under a sort", () => {
    const store = createReadThrough(createRecords(5));
    const list = store.list;
    list.sort = [{ field: "id", direction: "desc" }];
    primePositions(list);
    store.set(store.get().concat(createRecords(2).map((r: any): any => ({ id: r.id + 5, v: r.v }))));
    checkPositions(list, "#1: grown");
    primePositions(list);
    store.set(store.get().slice(0, 4));
    checkPositions(list, "#2: shrunk");
  });
  test("an owner-hidden record before the target: the visible and the created position differ by one", () => {
    const { list } = createReadThrough(createRecords(6));
    list.sort = [{ field: "id", direction: "desc" }];
    primePositions(list);
    list.setRecordVisible(4, false);
    checkPositions(list, "#1");
    expect(list.indexToCreatedIndex(2), "#2: the created position counts the hidden record").toBe(3);
    expect(list.getGlobalVisibleIndex(2), "#3: the visible position does not").toBe(2);
    expect(list.indexToCreatedIndex(4), "#4: the hidden record has a created position").toBe(1);
    expect(list.getGlobalVisibleIndex(4), "#5: and no visible one").toBe(-1);
  });
});
