import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { IDynamicDataField, IDynamicDataOwner, ISortCriterion } from "../../src/dynamic-data/dynamic-data-interfaces";

function createRecords(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: i, name: "r" + i });
  }
  return res;
}

describe("DynamicDataList: the page index assigned before the first load", () => {
  test("a page size assigned after the page index keeps the page index until the load clamps it", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(50)));
    list.pageIndex = 3;
    list.pageSize = 10;
    expect(list.pageIndex, "#1: before the load").toBe(3);
    list.load();
    expect(list.pageIndex, "#2").toBe(3);
    expect(list.getPageIndexes()[0], "#3: the first record of page 3").toBe(30);
  });
  test("a page index past the last page is still clamped by the load", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(50)));
    list.pageIndex = 7;
    list.pageSize = 10;
    list.load();
    expect(list.pageIndex).toBe(4);
  });
});

describe("DynamicDataList: the sort array is the list's own", () => {
  const byName: ISortCriterion = { field: "name", direction: "desc" };
  const byId: ISortCriterion = { field: "id", direction: "asc" };
  test("changing the array passed to setView does not change the sort of the list", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(3)));
    list.load();
    const sort = [byName];
    list.setView("", sort);
    sort.push(byId);
    sort[0] = byId;
    expect(list.sort, "#1").toEqual([byName]);
    expect(list.getCreatedIndexes(), "#2").toEqual([2, 1, 0]);
  });
  test("changing the array the sort getter returned does not change the sort of the list", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(createRecords(3)));
    list.load();
    list.sort = [byName];
    const sort = list.sort;
    sort.splice(0, 1, byId);
    expect(list.sort, "#1").toEqual([byName]);
    expect(list.getCreatedIndexes(), "#2").toEqual([2, 1, 0]);
  });
});

describe("DynamicDataList.assignSource: an owner callback that throws leaves the list as it was", () => {
  interface IOwnerList { list: DynamicDataList, writerChanges: Array<string> }
  function createOwnerList(): IOwnerList {
    let arr: Array<any> = createRecords(3);
    const writerChanges: Array<string> = [];
    const owner: IDynamicDataOwner = {
      getFields: (): Array<IDynamicDataField> => [],
      onDataListChanged: (): void => { },
      onSourceWriterChanged: (): void => { writerChanges.push("changed"); }
    };
    const list = DynamicDataList.createReadThrough(owner,
      () => new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; }));
    return { list: list, writerChanges: writerChanges };
  }
  const throwing = (): void => { throw new Error("owner"); };
  test("attaching another in-memory source", () => {
    const { list, writerChanges } = createOwnerList();
    const oldSource = ArrayDynamicDataSource.fromArray(createRecords(2));
    list.assignSource(oldSource);
    expect(list.hasCapability("insert"), "#1: the list writes the old source").toBe(true);
    const newSource = ArrayDynamicDataSource.fromArray(createRecords(4));
    expect(() => list.assignSource(newSource, throwing), "#2").toThrow("owner");
    expect(list.source, "#3").toBe(oldSource);
    expect(list.assignedSource, "#4").toBe(oldSource);
    expect(list.isRemote, "#5").toBe(true);
    expect(list.hasCapability("insert"), "#6: the list writes the old source again").toBe(true);
    const other = createOwnerList();
    other.list.assignSource(newSource);
    expect(other.list.hasCapability("insert"), "#7: another list writes the new source").toBe(true);
    expect(writerChanges, "#8: the list did not hold the new source").toEqual([]);
  });
  test("detaching", () => {
    const { list } = createOwnerList();
    const oldSource = ArrayDynamicDataSource.fromArray(createRecords(2));
    list.assignSource(oldSource);
    expect(() => list.assignSource(undefined, throwing), "#1").toThrow("owner");
    expect(list.source, "#2").toBe(oldSource);
    expect(list.assignedSource, "#3").toBe(oldSource);
    expect(list.isRemote, "#4").toBe(true);
    expect(list.hasCapability("insert"), "#5: the list writes the old source again").toBe(true);
  });
});
