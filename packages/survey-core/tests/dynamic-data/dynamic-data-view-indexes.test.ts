import { describe, test, expect } from "vitest";
import {
  DynamicDataViewIndexes, IDynamicDataViewIndexesHost, IDynamicDataViewPositions
} from "../../src/dynamic-data/dynamic-data-view-indexes";

/* The index arithmetic of DynamicDataList, against the class alone. Each test is a row of the decision
   table: the state of the list, then what the arithmetic answers. The fake host builds its views from
   the state and its position maps afresh on every call, so the caches of a real list are not
   exercised here (view-positions.test.ts covers them). */

interface IViewState {
  created: Array<number>;
  hidden?: Array<number>;
  hasView?: boolean;
  windowOffset?: number;
  loadedCount?: number;
  knownCount?: number;
  pageSize?: number;
  pageIndex?: number;
  isPagedBySource?: boolean;
}
function positionsOf(indexes: Array<number>): { [index: number]: number } {
  const res: { [index: number]: number } = {};
  indexes.forEach((index: number, pos: number): void => { res[index] = pos; });
  return res;
}
function createIndexes(state: IViewState): DynamicDataViewIndexes {
  const hidden = state.hidden || [];
  const pageSize = state.pageSize || 0;
  const pageIndex = state.pageIndex || 0;
  const isPagedBySource = !!state.isPagedBySource;
  const visible = state.created.filter((index: number): boolean => hidden.indexOf(index) < 0);
  // As DynamicDataMembership.getPageIndexes cuts it: a source that pages itself returns the page.
  const page = pageSize <= 0 || isPagedBySource ? visible : visible.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  const loadedCount = state.loadedCount !== undefined ? state.loadedCount : state.created.length;
  const host: IDynamicDataViewIndexesHost = {
    getCreatedIndexes: (): Array<number> => state.created,
    getVisibleIndexes: (): Array<number> => visible,
    getPageIndexes: (): Array<number> => page,
    hasView: !!state.hasView,
    windowOffset: state.windowOffset || 0,
    loadedCount: loadedCount,
    knownCount: state.knownCount !== undefined ? state.knownCount : (state.windowOffset || 0) + loadedCount,
    pageSize: pageSize,
    pageIndex: pageIndex,
    isPagedBySource: isPagedBySource
  };
  const positions: IDynamicDataViewPositions = {
    getCreatedPositions: () => positionsOf(state.created),
    getVisiblePositions: () => positionsOf(visible),
    getMaterializedPositions: (indexes: Array<number>) => positionsOf(indexes)
  };
  return new DynamicDataViewIndexes(host, positions);
}
function range(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}
// What the arithmetic answers for every record index, and one past each end.
function recordAnswers(indexes: DynamicDataViewIndexes, loadedCount: number): any {
  const records = range(-1, loadedCount);
  return {
    toCreated: records.map((i: number): number => indexes.indexToCreatedIndex(i)),
    toGlobalVisible: records.map((i: number): number => indexes.getGlobalVisibleIndex(i)),
    toMaterialized: records.map((i: number): number => indexes.indexToMaterializedIndex(i))
  };
}
function counts(indexes: DynamicDataViewIndexes): any {
  return {
    pageStart: indexes.getPageStartGlobalVisibleIndex(),
    offset: indexes.getRecordNumberOffset(),
    globalVisibleCount: indexes.globalVisibleCount,
    globalVisibleExtent: indexes.globalVisibleExtent,
    globalCreatedExtent: indexes.globalCreatedExtent,
    materialized: indexes.getMaterializedIndexes()
  };
}

describe("DynamicDataViewIndexes: no paging", () => {
  test("no view: every index is the record index", () => {
    const indexes = createIndexes({ created: range(0, 3) });
    expect(recordAnswers(indexes, 4), "#1").toEqual({
      toCreated: [-1, 0, 1, 2, 3, -1], toGlobalVisible: [-1, 0, 1, 2, 3, -1], toMaterialized: [-1, 0, 1, 2, 3, -1]
    });
    expect(counts(indexes), "#2").toEqual({
      pageStart: 0, offset: 0, globalVisibleCount: 4, globalVisibleExtent: 4, globalCreatedExtent: 4, materialized: [0, 1, 2, 3]
    });
    expect(range(-1, 4).map(i => indexes.createdIndexToIndex(i)), "#3").toEqual([-1, 0, 1, 2, 3, -1]);
    expect(range(-1, 4).map(i => indexes.materializedIndexToIndex(i)), "#4").toEqual([-1, 0, 1, 2, 3, -1]);
    expect(indexes.getPageOfVisibleIndex(3), "#5: one page").toBe(0);
    expect(indexes.getVisibleIndexesOfPage(0), "#6").toEqual([0, 1, 2, 3]);
    expect(indexes.getVisibleIndexesOfPage(1), "#7").toEqual([]);
  });
  test("no view, a record past the loaded ones: the created positions stop at loadedCount", () => {
    const indexes = createIndexes({ created: range(0, 3), loadedCount: 3 });
    expect(indexes.indexToCreatedIndex(3), "#1").toBe(-1);
    expect(indexes.createdIndexToIndex(3), "#2").toBe(-1);
  });
  test("a sort and an owner-hidden record", () => {
    // Sorted: records 3, 1, 0, 2; record 1 is hidden.
    const indexes = createIndexes({ created: [3, 1, 0, 2], hidden: [1], hasView: true });
    expect(recordAnswers(indexes, 4), "#1").toEqual({
      toCreated: [-1, 2, 1, 3, 0, -1], toGlobalVisible: [-1, 1, -1, 2, 0, -1], toMaterialized: [-1, 2, 1, 3, 0, -1]
    });
    expect(counts(indexes), "#2").toEqual({
      pageStart: 0, offset: 0, globalVisibleCount: 3, globalVisibleExtent: 3, globalCreatedExtent: 4, materialized: [3, 1, 0, 2]
    });
    expect(range(-1, 4).map(i => indexes.createdIndexToIndex(i)), "#3").toEqual([-1, 3, 1, 0, 2, -1]);
    expect(range(-1, 3).map(i => indexes.getIndexAtGlobalVisibleIndex(i)), "#4").toEqual([-1, 3, 0, 2, -1]);
    expect(range(-1, 4).map(i => indexes.getIndexAtGlobalCreatedIndex(i)), "#5: the hidden record has a created position").toEqual([-1, 3, 1, 0, 2, -1]);
  });
  test("a filter: a filtered record has no position", () => {
    const indexes = createIndexes({ created: [0, 2, 3], hasView: true, loadedCount: 4 });
    expect(recordAnswers(indexes, 4), "#1").toEqual({
      toCreated: [-1, 0, -1, 1, 2, -1], toGlobalVisible: [-1, 0, -1, 1, 2, -1], toMaterialized: [-1, 0, -1, 1, 2, -1]
    });
    expect(indexes.createdIndexToIndex(3), "#2").toBe(-1);
  });
  test("insert positions", () => {
    const indexes = createIndexes({ created: [3, 1, 0, 2], hidden: [1], hasView: true });
    expect(indexes.getInsertIndexAtVisibleIndex(0), "#1: the first visible record").toBe(3);
    expect(indexes.getInsertIndexAtVisibleIndex(2), "#2: the last visible record").toBe(2);
    expect(indexes.getInsertIndexAtVisibleIndex(3), "#3: past the last record: an append").toBe(4);
    expect(indexes.getInsertIndexAtVisibleIndex(9), "#4: far past it").toBe(4);
    expect(indexes.getInsertIndexAtVisibleIndex(-1), "#5: a negative position appends").toBe(4);
    expect(indexes.getInsertIndexAtCreatedIndex(1), "#6: over the created records the hidden one counts").toBe(1);
    expect(indexes.getInsertIndexAtCreatedIndex(-5), "#7: a negative position is the first one").toBe(3);
    expect(indexes.getInsertIndexAtCreatedIndex(4), "#8").toBe(4);
    expect(indexes.getInsertIndexAtMaterializedPosition(-1), "#9").toBe(3);
    expect(indexes.getInsertIndexAtMaterializedPosition(1), "#10").toBe(1);
    expect(indexes.getInsertIndexAtMaterializedPosition(4), "#11: past the last object").toBe(4);
  });
});

describe("DynamicDataViewIndexes: local paging", () => {
  // Ten records, three per page, the second page; record 4 is hidden: visible 0 1 2 | 3 5 6 | 7 8 9.
  const state: IViewState = { created: range(0, 9), hidden: [4], pageSize: 3, pageIndex: 1 };
  test("the page is the materialized records", () => {
    const indexes = createIndexes(state);
    expect(recordAnswers(indexes, 10), "#1").toEqual({
      toCreated: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1],
      toGlobalVisible: [-1, 0, 1, 2, 3, -1, 4, 5, 6, 7, 8, -1],
      toMaterialized: [-1, -1, -1, -1, 0, -1, 1, 2, -1, -1, -1, -1]
    });
    expect(counts(indexes), "#2").toEqual({
      pageStart: 3, offset: 0, globalVisibleCount: 9, globalVisibleExtent: 9, globalCreatedExtent: 10, materialized: [3, 5, 6]
    });
    expect(range(-1, 3).map(i => indexes.materializedIndexToIndex(i)), "#3").toEqual([-1, 3, 5, 6, -1]);
  });
  test("the page of a visibleIndex and the visible indexes of a page", () => {
    const indexes = createIndexes(state);
    expect(range(-1, 9).map(i => indexes.getPageOfVisibleIndex(i)), "#1").toEqual([0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]);
    expect(indexes.getVisibleIndexesOfPage(0), "#2").toEqual([0, 1, 2]);
    expect(indexes.getVisibleIndexesOfPage(1), "#3").toEqual([3, 5, 6]);
    expect(indexes.getVisibleIndexesOfPage(2), "#4").toEqual([7, 8, 9]);
    expect(indexes.getVisibleIndexesOfPage(3), "#5").toEqual([]);
  });
  test("insert positions at the page start, at the page end and past the last record", () => {
    const indexes = createIndexes(state);
    expect(indexes.getInsertIndexAtVisibleIndex(3), "#1: the page start").toBe(3);
    expect(indexes.getInsertIndexAtVisibleIndex(5), "#2: the last record of the page").toBe(6);
    expect(indexes.getInsertIndexAtVisibleIndex(6), "#3: the page end is the first record of the next page").toBe(7);
    expect(indexes.getInsertIndexAtVisibleIndex(9), "#4: past the last record").toBe(10);
    expect(indexes.getInsertIndexAtVisibleIndex(15), "#5").toBe(10);
    expect(indexes.getInsertIndexAtMaterializedPosition(0), "#6: the first object of the page").toBe(3);
    expect(indexes.getInsertIndexAtMaterializedPosition(2), "#7: the last object of the page").toBe(6);
    expect(indexes.getInsertIndexAtMaterializedPosition(3), "#8: past the page: an append").toBe(10);
  });
});

describe("DynamicDataViewIndexes: source paging", () => {
  // The fifth page of five records, out of 50 the source reported.
  const state: IViewState = { created: range(0, 4), windowOffset: 20, knownCount: 50, pageSize: 5, pageIndex: 4, isPagedBySource: true };
  test("the window offset is the start of the page and of every record number", () => {
    const indexes = createIndexes(state);
    expect(recordAnswers(indexes, 5), "#1").toEqual({
      toCreated: [-1, 0, 1, 2, 3, 4, -1], toGlobalVisible: [-1, 20, 21, 22, 23, 24, -1], toMaterialized: [-1, 0, 1, 2, 3, 4, -1]
    });
    expect(counts(indexes), "#2").toEqual({
      pageStart: 20, offset: 20, globalVisibleCount: 50, globalVisibleExtent: 50, globalCreatedExtent: 50, materialized: [0, 1, 2, 3, 4]
    });
    expect([19, 20, 24, 25].map(i => indexes.getIndexAtGlobalVisibleIndex(i)), "#3: nothing outside the window").toEqual([-1, 0, 4, -1]);
    expect([19, 22, 25].map(i => indexes.getIndexAtGlobalCreatedIndex(i)), "#4").toEqual([-1, 2, -1]);
    expect(indexes.getPageOfVisibleIndex(22), "#5").toBe(4);
  });
  test("a hidden record in the window", () => {
    const indexes = createIndexes(Object.assign({}, state, { hidden: [1] }));
    expect(recordAnswers(indexes, 5), "#1").toEqual({
      toCreated: [-1, 0, 1, 2, 3, 4, -1], toGlobalVisible: [-1, 20, -1, 21, 22, 23, -1], toMaterialized: [-1, 0, -1, 1, 2, 3, -1]
    });
    expect(indexes.globalVisibleExtent, "#2: the total the source reported").toBe(50);
  });
  test("a window that holds more than the total: the extents reach past it", () => {
    const indexes = createIndexes({ created: range(0, 6), windowOffset: 20, knownCount: 25, pageSize: 5, pageIndex: 4, isPagedBySource: true });
    expect(indexes.globalVisibleCount, "#1: the count stays the source's").toBe(25);
    expect(indexes.globalVisibleExtent, "#2").toBe(27);
    expect(indexes.globalCreatedExtent, "#3").toBe(27);
  });
  test("insert positions at the page start, at the page end and past the last record", () => {
    const indexes = createIndexes(state);
    expect(indexes.getInsertIndexAtVisibleIndex(20), "#1: the page start").toBe(0);
    expect(indexes.getInsertIndexAtVisibleIndex(24), "#2: the last record of the page").toBe(4);
    expect(indexes.getInsertIndexAtVisibleIndex(25), "#3: the page end: an append to the window").toBe(5);
    expect(indexes.getInsertIndexAtVisibleIndex(10), "#4: a record of another page is not loaded").toBe(-1);
    expect(indexes.getInsertIndexAtVisibleIndex(30), "#5").toBe(-1);
    expect(indexes.getInsertIndexAtVisibleIndex(50), "#6: past the last record: an append").toBe(5);
    expect(indexes.getInsertIndexAtCreatedIndex(10), "#7: the same over the created records").toBe(-1);
    expect(indexes.getInsertIndexAtCreatedIndex(23), "#8").toBe(3);
    expect(indexes.getInsertIndexAtCreatedIndex(60), "#9").toBe(5);
  });
  test("the first page of a source without a total", () => {
    const indexes = createIndexes({ created: range(0, 4), knownCount: 6, pageSize: 5, isPagedBySource: true });
    expect(counts(indexes), "#1").toEqual({
      pageStart: 0, offset: 0, globalVisibleCount: 6, globalVisibleExtent: 6, globalCreatedExtent: 6, materialized: [0, 1, 2, 3, 4]
    });
    expect(indexes.getInsertIndexAtVisibleIndex(5), "#2: the end of the window").toBe(5);
    expect(indexes.getInsertIndexAtVisibleIndex(6), "#3: past the known records").toBe(5);
  });
});
