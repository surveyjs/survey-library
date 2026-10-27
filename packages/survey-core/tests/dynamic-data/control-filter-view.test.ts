import { describe, test, expect } from "vitest";
import { DynamicDataView, IDynamicDataViewReadState } from "../../src/dynamic-data/dynamic-data-view";

// The control filter slot of DynamicDataView, the one a Filter Control writes: it goes by the rules
// the authored slot goes by (dynamic-data-view.test.ts), each slot on its own. It lives in a file of
// its own so that a change of the view's own tests never conflicts with it.

function createView(errors: Array<any>, filter: string, controlFilter: string): DynamicDataView {
  const view = new DynamicDataView((error: any): void => { errors.push(error); });
  view.setView(filter, [], controlFilter);
  return view;
}
function readState(mayFilterLocally: boolean, isWholeStorageInForce: boolean = false, readsSourceOnViewChange: boolean = false): IDynamicDataViewReadState {
  return { mayFilterLocally: mayFilterLocally, isWholeStorageInForce: isWholeStorageInForce, readsSourceOnViewChange: readsSourceOnViewChange };
}

describe("DynamicDataView: the control filter slot", () => {
  test("either slot is a filter; a read carries the two combined", () => {
    const errors = [];
    expect([createView(errors, "", "").hasFilter, createView(errors, "", "{age} > 1").hasFilter], "#1").toEqual([false, true]);
    expect(createView(errors, "", "{age} > 1").hasView, "#2").toBe(true);
    expect(createView(errors, "{age} > 1", "{age} < 9").sourceFilter, "#3").toBe("({age} > 1) and ({age} < 9)");
  });
  test("setView says whether either filter changed; a control filter left out stays", () => {
    const errors = [];
    const view = createView(errors, "{age} > 1", "{age} < 9");
    expect(view.setView("{age} > 1", [{ field: "age" }]), "#1: only the sort").toBe(false);
    expect(view.controlFilter, "#2: left out, kept").toBe("{age} < 9");
    expect(view.setView("{age} > 1", [], ""), "#3: the control slot cleared").toBe(true);
  });
  test("a control filter the list cannot run and no read carries is dropped and reported, the authored one stays", () => {
    const errors = [];
    const view = createView(errors, "{age} > 1", "{age} >");
    view.updateFilterRunner(readState(true));
    expect([view.filter, view.controlFilter], "#1").toEqual(["{age} > 1", ""]);
    expect([!!view.filterRunner, view.controlFilterRunner, view.filterRunners.length], "#2").toEqual([true, undefined, 1]);
    expect(errors, "#3").toHaveLength(1);
  });
  test("a control filter the list cannot run stays when a page read carries it to the source", () => {
    const errors = [];
    const view = createView(errors, "", "{age} >");
    view.updateFilterRunner(readState(false, true, true));
    expect([view.controlFilter, view.controlFilterRunner], "#1").toEqual(["{age} >", undefined]);
    expect(errors, "#2").toHaveLength(0);
  });
  test("the read of the whole storage builds the control runner, or is refused by one the list cannot run", () => {
    const errors = [];
    const view = createView(errors, "{age} > 1", "{age} < 9");
    view.ensureWholeStorageFilterRunner(readState(false));
    expect(view.filterRunners.length, "#1: both runners").toBe(2);
    const broken = createView(errors, "{age} > 1", "{age} >");
    expect(() => broken.ensureWholeStorageFilterRunner(readState(false)), "#2").toThrow(/does not declare the "sorting" capability/);
    expect([broken.filter, broken.controlFilter], "#3: both texts stay").toEqual(["{age} > 1", "{age} >"]);
    expect(errors, "#4").toHaveLength(0);
  });
  test("clear drops both runners and keeps both filters readable", () => {
    const errors = [];
    const view = createView(errors, "{age} > 1", "{age} < 9");
    view.updateFilterRunner(readState(true));
    view.clear();
    expect([view.filterRunners.length, view.filter, view.controlFilter]).toEqual([0, "{age} > 1", "{age} < 9"]);
  });
});
