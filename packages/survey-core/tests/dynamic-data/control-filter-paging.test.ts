import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "../../src/dynamic-data/dynamic-data-paging";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner } from "../../src/dynamic-data/dynamic-data-interfaces";

// The control filter entrance of DynamicDataPagingController, the one a Filter Control writes. It
// lives in a file of its own so that a change of the controller's own tests never conflicts with it.

/* A trimmed copy of the owner dynamic-data-paging.test.ts keeps to itself: a property hash, the two
   mode flags a question would answer from the survey, a real list over a real in-memory source,
   created lazily as a question creates it. It records the errors the list reports and the pending
   page moves the controller drops. */
class FakePagingOwner implements IDynamicDataPagingOwner, IDynamicDataOwner {
  public paging: DynamicDataPagingController;
  public hash: { [index: string]: any } = {};
  public isDesignMode: boolean = false;
  public isLoadingFromJson: boolean = false;
  public errors: Array<string> = [];
  public cancelPendingPageMoveCount: number = 0;
  private listValue: DynamicDataList;
  constructor(private records: Array<any>) {
    this.paging = new DynamicDataPagingController(this, (): DynamicDataList => this.getDataList());
  }
  public get hasList(): boolean { return !!this.listValue; }
  public getDataList(): DynamicDataList {
    if (!this.listValue) {
      this.listValue = new DynamicDataList(ArrayDynamicDataSource.fromArray(this.records), this);
      this.listValue.onError = (e: any, op: string): void => { this.errors.push(op); };
      this.listValue.load();
      this.paging.updatePageSize();
    }
    return this.listValue;
  }
  public getPropertyValue(name: string): any { return this.hash[name]; }
  public setPropertyValue(name: string, val: any): void { this.hash[name] = val; }
  public get pageSize(): number { return this.hash["pageSize"] || 0; }
  public get pageIndex(): number { return this.paging.pageIndex; }
  public get pageCount(): number { return this.paging.pageCount; }
  public get isCountKnown(): boolean { return this.paging.isCountKnown; }
  public raiseSortByChanged(): void { }
  public cancelPendingPageMove(): void {
    this.cancelPendingPageMoveCount++;
  }
  public getLocalizationFormatString(strName: string, ...args: any[]): string {
    return strName + ": " + args.join(", ");
  }
  public getFields(): Array<IDynamicDataField> { return []; }
  public onDataListChanged(change: IDynamicDataListChange): void {
    if (change.type === "reset" || change.type === "pageChanged") {
      this.paging.syncState();
    }
  }
  // What the owner shows: the records that have an object, in the list's view order.
  public get view(): Array<any> {
    const list = this.getDataList();
    return list.getCreatedIndexes().map((index: number): any => list.getRecord(index).c1);
  }
}
const abc = (): Array<any> => [{ c1: "c" }, { c1: "a" }, { c1: "b" }];

describe("DynamicDataPagingController: the control filter entrance", () => {
  test("a control filter applies next to the authored one and does not touch it", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.filterExpression = "{c1} != 'z'";
    owner.paging.setControlFilter("control", "{c1} = 'a'");
    expect(owner.view, "#1").toEqual(["a"]);
    expect(owner.paging.filterExpression, "#2: the authored expression is untouched").toBe("{c1} != 'z'");
    expect(owner.hash["filterExpression"], "#3: and so is its storage").toBe("{c1} != 'z'");
    expect(owner.getDataList().filter, "#4: two slots, not one string").toBe("{c1} != 'z'");
    expect(owner.getDataList().controlFilter, "#5").toBe("{c1} = 'a'");
  });
  test("two controls do not overwrite each other and clear with an empty string", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.setControlFilter("a", "{c1} != 'z'");
    owner.paging.setControlFilter("b", "{c1} != 'b'");
    expect(owner.view, "#1").toEqual(["c", "a"]);
    expect(owner.getDataList().controlFilter, "#2: combined, each bracketed")
      .toBe("({c1} != 'z') and ({c1} != 'b')");
    owner.paging.setControlFilter("b", "");
    expect(owner.getDataList().controlFilter, "#3: one left, unwrapped").toBe("{c1} != 'z'");
    expect(owner.paging.getControlFilterKeys(), "#4").toEqual(["a"]);
    owner.paging.setControlFilter("a", "");
    expect(owner.getDataList().controlFilter, "#5").toBe("");
    expect(owner.view, "#6").toEqual(["c", "a", "b"]);
  });
  test("a control filter written while loading reaches the list at the flush", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.filterExpression = "{c1} != 'z'";
    owner.paging.setControlFilter("control", "{c1} = 'a'");
    expect(owner.hasList, "#1: neither writer created the list").toBe(false);
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.getDataList().filter, "#2").toBe("{c1} != 'z'");
    expect(owner.getDataList().controlFilter, "#3").toBe("{c1} = 'a'");
    expect(owner.view, "#4").toEqual(["a"]);
  });
  test("design mode holds neither slot and gives both back on the way out", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.filterExpression = "{c1} != 'z'";
    owner.paging.setControlFilter("control", "{c1} = 'a'");
    expect(owner.getDataList().filter, "#1").toBe("");
    expect(owner.getDataList().controlFilter, "#2").toBe("");
    expect(owner.paging.getControlFilter("control"), "#3: the controller kept the text").toBe("{c1} = 'a'");
    owner.isDesignMode = false;
    owner.paging.syncState();
    expect(owner.getDataList().controlFilter, "#4").toBe("{c1} = 'a'");
  });
  test("a broken control filter is reported once and not re-pushed on every sync", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.setControlFilter("control", "{c1} = ");
    expect(owner.view, "#1: showing every record beats showing none").toEqual(["c", "a", "b"]);
    expect(owner.errors.length, "#2").toBe(1);
    owner.paging.syncState();
    owner.paging.syncState();
    expect(owner.errors.length, "#3: the list cleared its slot, the controller does not re-hand it")
      .toBe(1);
  });
  // A control filter replaces the page from code, as filterExpression does: a move that waits for
  // the validators of the page it leaves is dropped.
  test("a control filter that changes the view drops a pending page move", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.cancelPendingPageMoveCount = 0;
    owner.paging.setControlFilter("control", "{c1} = 'a'");
    expect(owner.cancelPendingPageMoveCount, "#1").toBe(1);
    owner.paging.setControlFilter("control", "{c1} = 'a'");
    expect(owner.cancelPendingPageMoveCount, "#2: the same filter again changes nothing").toBe(1);
    owner.paging.setControlFilter("control", "");
    expect(owner.cancelPendingPageMoveCount, "#3: clearing it is a change too").toBe(2);
  });
  test("a control filter written while loading does not drop a pending page move", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.setControlFilter("control", "{c1} = 'a'");
    expect(owner.cancelPendingPageMoveCount, "#1: nothing is on a page yet").toBe(0);
  });
});
