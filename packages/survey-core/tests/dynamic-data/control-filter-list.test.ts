import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { applyFilters, createFilterRunner } from "../../src/dynamic-data/dynamic-data-filter";
import {
  IDynamicDataField, IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

// The second filter slot of DynamicDataList, the one a Filter Control writes. It lives in a file of
// its own so that a change of the list's own tests never conflicts with it.

/* A copy of the source dynamic-data-list.test.ts keeps to itself: it pages, and therefore filters and
   sorts, itself - the list must do none of the three locally. It keeps every request it was asked. */
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
    const size = request.take > 0 ? request.take : view.length;
    return { records: view.slice(request.skip, request.skip + size), total: view.length };
  }
}
/* A paging source that cannot filter: it answers the range it is asked for and ignores the view, so
   what the list does with the filter shows. */
class PagingOnlySource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, sorting: true };
  public requests: Array<IDynamicDataReadRequest> = [];
  constructor(public records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.requests.push(request);
    const take = request.take > 0 ? request.take : this.records.length;
    return { records: this.records.slice(request.skip, request.skip + take), total: this.records.length };
  }
}

describe("DynamicDataList: the control filter slot", () => {
  const records = (): Array<any> => [{ c1: "a", n: 1 }, { c1: "b", n: 2 }, { c1: "c", n: 3 }];
  const values = (list: DynamicDataList): Array<any> =>
    list.getCreatedIndexes().map((i: number): any => list.getRecord(i).c1);
  const requestFilters = (source: FakeServerViewSource): Array<string> =>
    source.requests.map((request: IDynamicDataReadRequest): string => request.filter);
  const lastFilter = (source: FakeServerViewSource): string =>
    source.requests[source.requests.length - 1].filter;

  test("the two slots are independent and both apply", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.filter = "{n} > 1";
    expect(values(list), "#1: the authored slot alone").toEqual(["b", "c"]);
    list.controlFilter = "{c1} != 'c'";
    expect(values(list), "#2: a record has to pass both").toEqual(["b"]);
    expect(list.filter, "#3: neither slot sees the other").toBe("{n} > 1");
    expect(list.controlFilter, "#4").toBe("{c1} != 'c'");
    list.controlFilter = "";
    expect(values(list), "#5").toEqual(["b", "c"]);
  });
  test("an or inside one slot does not swallow the other", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.filter = "{c1} = 'a' or {c1} = 'b'";
    list.controlFilter = "{c1} != 'b'";
    expect(values(list), "no string combination, so no precedence to get wrong").toEqual(["a"]);
  });
  test("a broken control filter clears itself and leaves the authored slot alone", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    const errors: Array<string> = [];
    list.onError = (e: any, op: string): void => { errors.push(op); };
    list.load();
    list.filter = "{n} > 1";
    list.controlFilter = "{c1} = ";
    expect(list.filter, "#1: the author is not punished for it").toBe("{n} > 1");
    expect(list.controlFilter, "#2: the broken slot cleared itself").toBe("");
    expect(values(list), "#3: and the authored slot still runs").toEqual(["b", "c"]);
    expect(errors, "#4: one report, of the read the filter made impossible").toEqual(["read"]);
  });
  test("a broken authored filter clears itself and leaves the control slot alone", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.controlFilter = "{n} > 1";
    list.filter = "{c1} = ";
    expect(list.filter, "#1: today's behaviour, unchanged").toBe("");
    expect(list.controlFilter, "#2").toBe("{n} > 1");
    expect(values(list), "#3").toEqual(["b", "c"]);
  });
  test("a source that pages receives the two slots combined and bracketed", () => {
    const source = new FakeServerViewSource(records());
    const list = new DynamicDataList(source);
    list.load();
    list.filter = "{n} > 1";
    list.controlFilter = "{c1} != 'c'";
    expect(lastFilter(source)).toBe("({n} > 1) and ({c1} != 'c')");
  });
  test("one slot alone reaches a source untouched", () => {
    const source = new FakeServerViewSource(records());
    const list = new DynamicDataList(source);
    list.load();
    list.controlFilter = "{c1} != 'c'";
    expect(lastFilter(source)).toBe("{c1} != 'c'");
  });
  /* hasView is not an internal detail: both questions gate the whole view machinery on it - the
     created indexes they read and the "reset" handler that rebuilds the rows/panels - so a control
     filter the list computes but does not declare a view for would be inert in the questions. */
  test("a control filter alone is a view", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    expect(list.hasView, "#1: neither slot, no view").toBe(false);
    list.controlFilter = "{n} > 1";
    expect(list.hasView, "#2: the control slot alone declares a view").toBe(true);
    expect(list.visibleCount, "#3: and the visible count is the one the slot decided").toBe(2);
    expect(list.count, "#4: a filter never changes the storage count").toBe(3);
    list.controlFilter = "";
    expect(list.hasView, "#5").toBe(false);
    expect(list.visibleCount, "#6").toBe(3);
  });
  // The edit path asks the same question as hasView, in its own words (hasLocalViews): a bare list
  // re-evaluates its view on every write, and it must do so for a control filter too.
  test("a control filter alone re-evaluates the view when a record is edited", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.controlFilter = "{n} > 1";
    expect(values(list), "#1").toEqual(["b", "c"]);
    list.setValue(1, "n", 0);
    expect(values(list), "#2: the edited record left the filter").toEqual(["c"]);
  });
  /* And the frozen membership is decided by the same question, so a control filter alone has to
     freeze it: without that the two questions would re-sort and re-filter under the cursor, which
     is the mode a read-through list exists to avoid. */
  test("a control filter alone freezes the membership", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    // What DynamicDataList.createReadThrough sets for the questions.
    list.isViewFrozenOnEdit = true;
    list.load();
    list.controlFilter = "{n} > 1";
    expect(values(list), "#1").toEqual(["b", "c"]);
    list.add({ c1: "d", n: 0 });
    expect(values(list), "#2: an added record is in the view even when it fails the filter")
      .toEqual(["b", "c", "d"]);
    list.refreshView();
    expect(values(list), "#3: the next refresh filters it out").toEqual(["b", "c"]);
  });
  test("a source swap hands the control filter to the source that owns it", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.controlFilter = "{c1} != 'c'";
    const source = new FakeServerViewSource(records());
    list.source = source;
    expect(requestFilters(source), "a filter the list ran locally must survive the swap")
      .toEqual(["{c1} != 'c'"]);
  });
  test("a source swap hands over both slots, combined and bracketed", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.filter = "{n} > 1";
    list.controlFilter = "{c1} != 'c'";
    const source = new FakeServerViewSource(records());
    list.source = source;
    expect(requestFilters(source)).toEqual(["({n} > 1) and ({c1} != 'c')"]);
  });
  test("setting the control filter resets the page index", () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.pageSize = 1;
    list.pageIndex = 2;
    list.controlFilter = "{n} > 0";
    expect(list.pageIndex, "a new filter starts at the first page").toBe(0);
  });
});

/* A paging source that does not declare filtering is read whole while a filter is set, and the list
   runs the filter itself. The control slot is a filter like the authored one: either slot alone
   switches the source to the whole read, and only both cleared page it again. */
describe("DynamicDataList: the control filter slot over a paging source that cannot filter", () => {
  const createRecords = (): Array<any> => [0, 1, 2, 3, 4].map((n: number): any => ({ c1: "r" + n, n: n }));
  const values = (list: DynamicDataList): Array<any> =>
    list.getPageIndexes().map((i: number): any => list.getRecord(i).c1);
  const createList = (): { list: DynamicDataList, source: PagingOnlySource, errors: Array<string> } => {
    const source = new PagingOnlySource(createRecords());
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (e: any, op: string): void => { errors.push(op); };
    list.pageSize = 2;
    list.load();
    source.requests.length = 0;
    return { list: list, source: source, errors: errors };
  };

  test("a control filter alone reads the whole storage and runs locally", () => {
    const { list, source, errors } = createList();
    list.controlFilter = "{n} > 1";
    expect(source.requests, "#1: the read of a source that does not page").toEqual([{ skip: 0, take: 0, filter: "", sort: [] }]);
    expect(errors, "#2: no refusal").toEqual([]);
    expect(values(list), "#3: filtered and paged here").toEqual(["r2", "r3"]);
    expect(list.visibleCount, "#4").toBe(3);
    expect(list.pageCount, "#5").toBe(2);
  });
  test("clearing the control filter pages the source again", () => {
    const { list, source } = createList();
    list.controlFilter = "{n} > 1";
    source.requests.length = 0;
    list.controlFilter = "";
    expect(source.requests, "the page is read again").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }]);
    expect(values(list)).toEqual(["r0", "r1"]);
  });
  test("both slots run locally over the whole storage, and the source is paged only once both are cleared", () => {
    const { list, source } = createList();
    list.filter = "{n} > 0";
    list.controlFilter = "{n} < 4";
    expect(values(list), "#1: both slots apply").toEqual(["r1", "r2"]);
    expect(list.visibleCount, "#2").toBe(3);
    source.requests.length = 0;
    list.filter = "";
    expect(source.requests, "#3: the control slot still needs the whole storage").toEqual([]);
    expect(list.visibleCount, "#4").toBe(4);
    list.controlFilter = "";
    expect(source.requests, "#5: nothing filters any more: the page is read").toEqual([{ skip: 0, take: 2, filter: "", sort: [] }]);
  });
});

describe("applyFilters", () => {
  test("puts a field that is read and never stored over the record, as applyFilter does", () => {
    const records = [{ n: 1 }, { n: 2 }, { n: 3 }];
    const fields: Array<IDynamicDataField> = [{ name: "position", getValue: (record: any, index: number): any => index }];
    const runners = [createFilterRunner("{position} > 0"), createFilterRunner("{n} < 3")];
    expect(applyFilters(records, runners, fields), "#1: both runners, the first one on the virtual field").toEqual([1]);
    expect(records[1], "#2: the record itself is not modified").toEqual({ n: 2 });
  });
});
