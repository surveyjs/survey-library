import { describe, test, expect } from "vitest";
import { DynamicDataView, IDynamicDataViewReadState } from "../../src/dynamic-data/dynamic-data-view";

function createView(errors: Array<any>, filter: string = "", sort: Array<any> = []): DynamicDataView {
  const view = new DynamicDataView((error: any): void => { errors.push(error); });
  view.setView(filter, sort);
  return view;
}
function readState(mayFilterLocally: boolean, isWholeStorageInForce: boolean = false, readsSourceOnViewChange: boolean = false): IDynamicDataViewReadState {
  return { mayFilterLocally: mayFilterLocally, isWholeStorageInForce: isWholeStorageInForce, readsSourceOnViewChange: readsSourceOnViewChange };
}

describe("DynamicDataView: the filter, the sort and the filter runner of the list", () => {
  test("has a view while a filter or a sort is set", () => {
    const errors = [];
    expect(createView(errors).hasView).toBe(false);
    expect(createView(errors, "{age} > 15").hasView).toBe(true);
    expect(createView(errors, "", [{ field: "age", direction: "asc" }]).hasView).toBe(true);
  });
  test("setView keeps a copy of the sort and says whether the filter changed", () => {
    const view = new DynamicDataView((): void => { });
    const sort: Array<any> = [{ field: "age", direction: "asc" }];
    expect(view.setView("{age} > 15", sort)).toBe(true);
    sort.push({ field: "name", direction: "desc" });
    expect(view.sort).toHaveLength(1);
    expect(view.setView("{age} > 15", [])).toBe(false);
    expect(view.sort).toHaveLength(0);
    expect(view.setView("{age} > 15", undefined)).toBe(false);
    expect(view.sort).toEqual([]);
  });
  test("setView normalizes the sort: plain criteria, no empty field, the first occurrence of a field", () => {
    const view = new DynamicDataView((): void => { });
    const item = { field: "age", direction: "desc", extra: true };
    view.setView("", [null, { field: "" }, <any>item, { field: "name", direction: "up" }, { field: "age", direction: "asc" }]);
    expect(view.sort, "#1").toEqual([{ field: "age", direction: "desc" }, { field: "name", direction: "asc" }]);
    expect(view.sort[0] === <any>item, "#2: a copy, never the caller's object").toBe(false);
    item.direction = "asc";
    expect(view.sort[0].direction, "#3: an edit of the caller's object changes nothing").toBe("desc");
  });
  test("clear drops the runner and keeps the filter and the sort", () => {
    const view = createView([], "{age} > 15", [{ field: "age", direction: "asc" }]);
    view.updateFilterRunner(readState(true));
    expect(view.filterRunner).toBeTruthy();
    view.clear();
    expect(view.filterRunner).toBe(undefined);
    expect(view.filter).toBe("{age} > 15");
    expect(view.sort).toHaveLength(1);
  });
  test("builds the runner when the list may filter, and none for an empty filter", () => {
    const errors = [];
    const view = createView(errors, "{age} > 15");
    view.updateFilterRunner(readState(true));
    expect(view.filterRunner.runValues({ age: 20 })).toBe(true);
    view.setView("", []);
    view.updateFilterRunner(readState(true));
    expect(view.filterRunner).toBe(undefined);
    expect(errors).toHaveLength(0);
  });
  test("keeps no runner for a source that pages and filters, unless its whole storage is in force", () => {
    const errors = [];
    const view = createView(errors, "{age} > 15");
    view.updateFilterRunner(readState(false));
    expect(view.filterRunner).toBe(undefined);
    view.updateFilterRunner(readState(false, true));
    expect(view.filterRunner.runValues({ age: 10 })).toBe(false);
    expect(errors).toHaveLength(0);
  });
  test("a filter the list cannot run and no read carries is dropped and reported", () => {
    const errors = [];
    const view = createView(errors, "{age} > 1");
    view.updateFilterRunner(readState(true));
    expect(view.filterRunner).toBeTruthy();
    view.setView("{age} >", []);
    view.updateFilterRunner(readState(true));
    expect(view.filter).toBe("");
    expect(view.filterRunner).toBe(undefined);
    expect(errors).toHaveLength(1);
  });
  test("a filter the list cannot run stays when a page read carries it to the source", () => {
    const errors = [];
    const view = createView(errors, "{age} >");
    view.updateFilterRunner(readState(false, true, true));
    expect(view.filter).toBe("{age} >");
    expect(view.filterRunner).toBe(undefined);
    expect(errors).toHaveLength(0);
  });
  test("the read of the whole storage builds the runner a source that pages and filters never needed", () => {
    const errors = [];
    const view = createView(errors, "{age} > 15");
    view.ensureWholeStorageFilterRunner(readState(true));
    expect(view.filterRunner).toBe(undefined);
    view.ensureWholeStorageFilterRunner(readState(false));
    const runner = view.filterRunner;
    expect(runner.runValues({ age: 20 })).toBe(true);
    view.ensureWholeStorageFilterRunner(readState(false));
    expect(view.filterRunner).toBe(runner);
  });
  test("the read of the whole storage is refused by a filter the list cannot run, which stays", () => {
    const errors = [];
    const view = createView(errors, "{age} >");
    expect(() => view.ensureWholeStorageFilterRunner(readState(false))).toThrow(/does not declare the "sorting" capability/);
    expect(view.filter).toBe("{age} >");
    expect(errors).toHaveLength(0);
  });
});
