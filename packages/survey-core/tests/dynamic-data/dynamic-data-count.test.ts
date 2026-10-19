import { describe, test, expect } from "vitest";
import { DynamicDataCount } from "../../src/dynamic-data/dynamic-data-count";
import { IDynamicDataReadResult } from "../../src/dynamic-data/dynamic-data-interfaces";

/* The decisions DynamicDataList takes about the size of its storage, against the class alone. Each
   test is a row of the decision table: the state before, the answer, the state after. The list-level
   tests (dynamic-data-list.test.ts) check that the list acts on these answers. */

interface ICountState {
  count: number;
  isCountKnown: boolean;
  hasMore: boolean;
  knownCount: number;
  retryPageIndex: number;
}
// The window the list holds is passed in: the count object never reads it.
function stateOf(counter: DynamicDataCount, windowOffset: number, recordCount: number): ICountState {
  return {
    count: counter.getCount(windowOffset, recordCount),
    isCountKnown: counter.isCountKnown,
    hasMore: counter.hasMore,
    knownCount: counter.getKnownCount(windowOffset, recordCount),
    retryPageIndex: counter.retryPageIndex
  };
}
function page(length: number, extra?: { total?: number, hasMore?: boolean }): IDynamicDataReadResult {
  const res: IDynamicDataReadResult = { records: new Array(length).fill({}) };
  if (!!extra && extra.total !== undefined) res.total = extra.total;
  if (!!extra && extra.hasMore !== undefined) res.hasMore = extra.hasMore;
  return res;
}
// Commits a window read with take 10 and returns what commitWindow answered.
function commit(counter: DynamicDataCount, skip: number, length: number,
  extra?: { total?: number, hasMore?: boolean }, filter: string = ""): number {
  return counter.commitWindow(page(length, extra), skip, 10, length, filter);
}
// A source without a total walked to its end: 25 records, found on the third page of 10.
function createDiscovered(filter: string = ""): DynamicDataCount {
  const counter = new DynamicDataCount();
  commit(counter, 0, 10, undefined, filter);
  commit(counter, 10, 10, undefined, filter);
  commit(counter, 20, 5, undefined, filter);
  return counter;
}

describe("DynamicDataCount: a window commits", () => {
  test("a fresh count: every source that does not page has its whole storage", () => {
    expect(stateOf(new DynamicDataCount(), 0, 3)).toEqual({
      count: 3, isCountKnown: true, hasMore: false, knownCount: 3, retryPageIndex: undefined
    });
  });
  test("a reported total", () => {
    const counter = new DynamicDataCount();
    expect(commit(counter, 10, 10, { total: 25 }), "#1: no retry").toBeUndefined();
    expect(stateOf(counter, 10, 10), "#2: records behind the window").toEqual({
      count: 25, isCountKnown: true, hasMore: true, knownCount: 25, retryPageIndex: undefined
    });
    commit(counter, 20, 5, { total: 25 });
    expect(stateOf(counter, 20, 5).hasMore, "#3: the last page").toBe(false);
  });
  test("a reported total wins over hasMore", () => {
    const counter = new DynamicDataCount();
    commit(counter, 0, 10, { total: 10, hasMore: true });
    expect(stateOf(counter, 0, 10).hasMore, "#1").toBe(false);
    expect(stateOf(counter, 0, 10).count, "#2").toBe(10);
  });
  test("no total, a short window: the end, and the count with it", () => {
    const counter = new DynamicDataCount();
    commit(counter, 20, 5);
    expect(stateOf(counter, 20, 5)).toEqual({
      count: 25, isCountKnown: true, hasMore: false, knownCount: 25, retryPageIndex: undefined
    });
  });
  test("no total, a full window with hasMore: false - the end", () => {
    const counter = new DynamicDataCount();
    commit(counter, 10, 10, { hasMore: false });
    expect(stateOf(counter, 10, 10)).toEqual({
      count: 20, isCountKnown: true, hasMore: false, knownCount: 20, retryPageIndex: undefined
    });
  });
  test("no total, hasMore: true - the count is what has been seen", () => {
    const counter = new DynamicDataCount();
    commit(counter, 10, 10, { hasMore: true });
    expect(stateOf(counter, 10, 10)).toEqual({
      count: 20, isCountKnown: false, hasMore: true, knownCount: 20, retryPageIndex: undefined
    });
  });
  test("no total, a full window without hasMore is inferred to have more", () => {
    const counter = new DynamicDataCount();
    commit(counter, 0, 10);
    expect(stateOf(counter, 0, 10).isCountKnown, "#1").toBe(false);
    expect(stateOf(counter, 0, 10).hasMore, "#2").toBe(true);
  });
  test("a take of 0 asks for everything from skip: any window is the end", () => {
    const counter = new DynamicDataCount();
    counter.commitWindow(page(7), 0, 0, 7, "");
    expect(stateOf(counter, 0, 7).count, "#1").toBe(7);
    expect(stateOf(counter, 0, 7).isCountKnown, "#2").toBe(true);
  });
  test("knownCount keeps the furthest window: a walk back does not forget the pages seen", () => {
    const counter = new DynamicDataCount();
    commit(counter, 0, 10);
    commit(counter, 10, 10);
    commit(counter, 0, 10);
    expect(stateOf(counter, 0, 10).count, "#1: the lower bound of the window in force").toBe(10);
    expect(stateOf(counter, 0, 10).knownCount, "#2").toBe(20);
  });
});

describe("DynamicDataCount: a discovered total", () => {
  test("a window in front of it keeps it", () => {
    const counter = createDiscovered();
    commit(counter, 0, 10);
    expect(stateOf(counter, 0, 10)).toEqual({
      count: 25, isCountKnown: true, hasMore: true, knownCount: 25, retryPageIndex: undefined
    });
  });
  test("hasMore: true in front of it keeps it: no contradiction", () => {
    const counter = createDiscovered();
    commit(counter, 10, 10, { hasMore: true });
    expect(stateOf(counter, 10, 10).isCountKnown, "#1").toBe(true);
    expect(stateOf(counter, 10, 10).count, "#2").toBe(25);
  });
  test("a window past it drops it: the storage has grown", () => {
    const counter = createDiscovered();
    commit(counter, 20, 10);
    expect(stateOf(counter, 20, 10)).toEqual({
      count: 30, isCountKnown: false, hasMore: true, knownCount: 30, retryPageIndex: undefined
    });
  });
  test("hasMore: true at the known end drops it", () => {
    const counter = new DynamicDataCount();
    commit(counter, 10, 10, { hasMore: false });
    expect(stateOf(counter, 10, 10).count, "#1: the end is at 20").toBe(20);
    commit(counter, 10, 10, { hasMore: true });
    expect(stateOf(counter, 10, 10).isCountKnown, "#2: the source says there is more").toBe(false);
    expect(stateOf(counter, 10, 10).hasMore, "#3").toBe(true);
  });
  test("a full window without hasMore at the known end keeps it: it is only inferred to have more", () => {
    const counter = new DynamicDataCount();
    commit(counter, 10, 10, { hasMore: false });
    commit(counter, 10, 10);
    expect(stateOf(counter, 10, 10).isCountKnown, "#1").toBe(true);
    expect(stateOf(counter, 10, 10).hasMore, "#2").toBe(false);
  });
  test("a reported total replaces it", () => {
    const counter = createDiscovered();
    commit(counter, 0, 10, { total: 40 });
    expect(stateOf(counter, 0, 10).count, "#1").toBe(40);
    // The reported total belongs to no filter: a window of another one with no total drops it.
    commit(counter, 0, 10, undefined, "{a} = 1");
    expect(stateOf(counter, 0, 10).isCountKnown, "#2").toBe(false);
  });
});

describe("DynamicDataCount: a page past the end", () => {
  test("an unknown total steps one page back, and nothing committed changes", () => {
    const counter = new DynamicDataCount();
    commit(counter, 10, 10);
    const before = stateOf(counter, 10, 10);
    expect(counter.stepBackPastEnd(page(0), 20, 10, 0, 2, 10, ""), "#1: not committed").toBe(true);
    expect(counter.retryPageIndex, "#2: one page back").toBe(1);
    expect(stateOf(counter, 10, 10), "#3: the window in force keeps its count")
      .toEqual(Object.assign({}, before, { retryPageIndex: 1 }));
  });
  test("a reported total goes straight to its last page", () => {
    const counter = new DynamicDataCount();
    commit(counter, 40, 10, { total: 60 });
    expect(counter.stepBackPastEnd(page(0, { total: 15 }), 50, 10, 0, 5, 10, ""), "#1").toBe(true);
    expect(counter.retryPageIndex, "#2: the last page of 15 records").toBe(1);
    expect(stateOf(counter, 40, 10).count, "#3: the total of the window in force").toBe(60);
  });
  test("a reported total of 0 retries the first page", () => {
    const counter = new DynamicDataCount();
    expect(counter.stepBackPastEnd(page(0, { total: 0 }), 20, 10, 0, 2, 10, ""), "#1").toBe(true);
    expect(counter.retryPageIndex, "#2").toBe(0);
  });
  test("an empty answer that is not past the end is committed as it is", () => {
    const counter = new DynamicDataCount();
    expect(counter.stepBackPastEnd(page(0), 0, 10, 0, 0, 10, ""), "#1: skip 0").toBe(false);
    expect(counter.stepBackPastEnd(page(0), 20, 10, 0, 0, 10, ""), "#2: nothing to step back to").toBe(false);
    expect(counter.stepBackPastEnd(page(0, { total: 25 }), 20, 10, 0, 2, 10, ""), "#3: in front of the total").toBe(false);
    expect(counter.stepBackPastEnd(page(3), 20, 10, 3, 2, 10, ""), "#4: records").toBe(false);
    expect(counter.retryPageIndex, "#5: no retry").toBeUndefined();
    expect(commit(counter, 0, 0), "#6").toBeUndefined();
    expect(stateOf(counter, 0, 0).count, "#7").toBe(0);
    expect(stateOf(counter, 0, 0).isCountKnown, "#8").toBe(true);
  });
});

describe("DynamicDataCount: the retry transaction", () => {
  function createPendingRetry(): DynamicDataCount {
    const counter = new DynamicDataCount();
    commit(counter, 10, 10);
    counter.stepBackPastEnd(page(0), 20, 10, 0, 2, 10, "");
    return counter;
  }
  test("the retry's window commits: its page is returned, and the proven end is confirmed", () => {
    const counter = createPendingRetry();
    expect(commit(counter, 10, 10), "#1: the page for the list to apply").toBe(1);
    expect(stateOf(counter, 10, 10), "#2: nothing behind the page the empty answer followed").toEqual({
      count: 20, isCountKnown: true, hasMore: false, knownCount: 20, retryPageIndex: undefined
    });
  });
  test("the retry's window commits: a window short of the proven end lowers it", () => {
    const counter = createPendingRetry();
    expect(commit(counter, 10, 5), "#1").toBe(1);
    expect(stateOf(counter, 10, 5).count, "#2").toBe(15);
    expect(stateOf(counter, 10, 5).hasMore, "#3").toBe(false);
  });
  test("a retry of a retry starts from the retry's page, not the committed one", () => {
    const counter = createPendingRetry();
    expect(counter.stepBackPastEnd(page(0), 10, 10, 0, 2, 10, ""), "#1").toBe(true);
    expect(counter.retryPageIndex, "#2: page 1 answered empty too").toBe(0);
    expect(commit(counter, 0, 4), "#3").toBe(0);
    expect(stateOf(counter, 0, 4).count, "#4").toBe(4);
  });
  test("cancelRetry leaves the committed state as it was", () => {
    const counter = createPendingRetry();
    const before = stateOf(counter, 10, 10);
    counter.cancelRetry();
    expect(stateOf(counter, 10, 10), "#1").toEqual(Object.assign({}, before, { retryPageIndex: undefined }));
    expect(commit(counter, 10, 10), "#2: no page to apply").toBeUndefined();
    expect(stateOf(counter, 10, 10).isCountKnown, "#3: the end the empty answer proved went with the retry").toBe(false);
  });
  test("the read() path drops the retry: the whole storage is loaded", () => {
    const counter = createPendingRetry();
    counter.commitWholeStorage();
    expect(stateOf(counter, 0, 7)).toEqual({
      count: 7, isCountKnown: true, hasMore: false, knownCount: 20, retryPageIndex: undefined
    });
  });
  test("reset drops the retry and everything known", () => {
    const counter = createPendingRetry();
    counter.reset();
    expect(stateOf(counter, 0, 0)).toEqual({
      count: 0, isCountKnown: true, hasMore: false, knownCount: 0, retryPageIndex: undefined
    });
  });
});

describe("DynamicDataCount: a filter change", () => {
  test("right after it only the reach is forgotten: the total stays with the window in force", () => {
    const counter = createDiscovered();
    commit(counter, 0, 10);
    counter.forgetReach();
    expect(stateOf(counter, 0, 10), "#1").toEqual({
      count: 25, isCountKnown: true, hasMore: true, knownCount: 25, retryPageIndex: undefined
    });
    const unknown = new DynamicDataCount();
    commit(unknown, 0, 10);
    commit(unknown, 10, 10);
    commit(unknown, 0, 10);
    expect(stateOf(unknown, 0, 10).knownCount, "#2: before").toBe(20);
    unknown.forgetReach();
    expect(stateOf(unknown, 0, 10).knownCount, "#3: the window in force only").toBe(10);
  });
  test("the next window under the new filter drops a discovered total", () => {
    const counter = createDiscovered();
    counter.forgetReach();
    commit(counter, 0, 10, undefined, "{a} = 1");
    expect(stateOf(counter, 0, 10)).toEqual({
      count: 10, isCountKnown: false, hasMore: true, knownCount: 10, retryPageIndex: undefined
    });
  });
  test("the next window under the new filter that reaches the end finds it again", () => {
    const counter = createDiscovered();
    counter.forgetReach();
    commit(counter, 0, 4, undefined, "{a} = 1");
    expect(stateOf(counter, 0, 4)).toEqual({
      count: 4, isCountKnown: true, hasMore: false, knownCount: 4, retryPageIndex: undefined
    });
  });
});

describe("DynamicDataCount: the list's own inserts and removes", () => {
  test("with a total: it follows, and so does hasMore", () => {
    const counter = new DynamicDataCount();
    commit(counter, 0, 10, { total: 11 });
    expect(stateOf(counter, 0, 10).hasMore, "#1").toBe(true);
    counter.onRecordRemoved(0, 9);
    expect(stateOf(counter, 0, 9).count, "#2").toBe(10);
    expect(stateOf(counter, 0, 9).hasMore, "#3: one record behind the window").toBe(true);
    counter.onRecordRemoved(0, 8);
    counter.onRecordInserted(0, 9);
    expect(stateOf(counter, 0, 9).count, "#4").toBe(10);
    expect(stateOf(counter, 0, 9).hasMore, "#5").toBe(true);
    counter.onRecordInserted(0, 10);
    counter.onRecordRemoved(0, 9);
    counter.onRecordRemoved(0, 8);
    expect(stateOf(counter, 0, 8).count, "#6").toBe(9);
    expect(stateOf(counter, 0, 8).hasMore, "#7").toBe(true);
  });
  test("with a total: a remove on the last page leaves nothing behind it", () => {
    const counter = new DynamicDataCount();
    commit(counter, 20, 5, { total: 25 });
    counter.onRecordInserted(20, 6);
    expect(stateOf(counter, 20, 6).count, "#1").toBe(26);
    expect(stateOf(counter, 20, 6).hasMore, "#2").toBe(false);
    counter.onRecordRemoved(20, 5);
    expect(stateOf(counter, 20, 5).count, "#3").toBe(25);
    expect(stateOf(counter, 20, 5).hasMore, "#4").toBe(false);
  });
  test("without a total: hasMore stays as the source left it, and the reach follows", () => {
    const counter = new DynamicDataCount();
    commit(counter, 0, 10);
    commit(counter, 10, 10);
    commit(counter, 0, 10);
    counter.onRecordInserted(0, 11);
    expect(stateOf(counter, 0, 11), "#1").toEqual({
      count: 11, isCountKnown: false, hasMore: true, knownCount: 21, retryPageIndex: undefined
    });
    counter.onRecordRemoved(0, 10);
    counter.onRecordRemoved(0, 9);
    expect(stateOf(counter, 0, 9), "#2").toEqual({
      count: 9, isCountKnown: false, hasMore: true, knownCount: 19, retryPageIndex: undefined
    });
  });
  test("without a total and no reach: nothing to follow but the window", () => {
    const counter = new DynamicDataCount();
    commit(counter, 0, 10);
    counter.forgetReach();
    counter.onRecordInserted(0, 11);
    expect(stateOf(counter, 0, 11).knownCount, "#1").toBe(11);
    counter.onRecordRemoved(0, 10);
    expect(stateOf(counter, 0, 10).knownCount, "#2").toBe(10);
  });
});
