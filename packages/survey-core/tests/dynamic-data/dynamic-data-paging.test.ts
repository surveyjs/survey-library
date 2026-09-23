import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { DynamicDataPagingController, IDynamicDataPagingOwner } from "../../src/dynamic-data/dynamic-data-paging";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import {
  IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataReadRequest,
  IDynamicDataReadResult, IDynamicDataSort, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* The controller against a fake owner: a property hash, the two mode flags a question would answer
   from the survey, and a recorder for the sortBy notification. The list under it is a real one over
   a real in-memory source, and it is created lazily exactly as a question creates it - "the setter
   does not create the list" is one of the invariants. */
class FakePagingOwner implements IDynamicDataPagingOwner, IDynamicDataOwner {
  public paging: DynamicDataPagingController;
  public hash: { [index: string]: any } = {};
  public isDesignMode: boolean = false;
  public isLoadingFromJson: boolean = false;
  public sortByChanges: Array<string> = [];
  public resetCount: number = 0;
  private listValue: DynamicDataList;
  private source: IDynamicDataSource;
  constructor(records: Array<any>) {
    this.source = ArrayDynamicDataSource.fromArray(records);
    this.paging = new DynamicDataPagingController(this);
  }
  public get hasList(): boolean { return !!this.listValue; }
  public getDataList(): DynamicDataList {
    if (!this.listValue) {
      this.listValue = new DynamicDataList(this.source, this);
      this.listValue.load();
      // The question pushes the authored page size from here too: the list is created on demand.
      this.paging.updatePageSize();
    }
    return this.listValue;
  }
  public setSource(source: IDynamicDataSource): void {
    this.source = source;
    if (!!this.listValue) {
      this.listValue.source = source;
    }
  }
  public getPropertyValue(name: string): any { return this.hash[name]; }
  public setPropertyValue(name: string, val: any): void { this.hash[name] = val; }
  public get pageSize(): number { return this.hash["pageSize"] || 0; }
  public set pageSize(val: number) {
    this.hash["pageSize"] = val;
    this.paging.updatePageSize();
  }
  public get pageIndex(): number { return this.paging.pageIndex; }
  public set pageIndex(val: number) { this.paging.pageIndex = val; }
  public get pageCount(): number { return this.paging.pageCount; }
  public get isCountKnown(): boolean { return this.paging.isCountKnown; }
  public raiseSortByChanged(oldValue: string, newValue: string): void {
    this.sortByChanges.push(oldValue + " -> " + newValue);
  }
  public getFields(): Array<IDynamicDataField> { return []; }
  public onDataListChanged(change: IDynamicDataListChange): void {
    if (change.type === "reset") {
      this.resetCount++;
    }
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
const asc: Array<IDynamicDataSort> = [{ field: "c1", direction: "asc" }];
const desc: Array<IDynamicDataSort> = [{ field: "c1", direction: "desc" }];

describe("DynamicDataPagingController: runtime (invariant 2)", () => {
  test("the list holds the sort and the filter, the hash mirrors it, the accessors read the hash", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sortOrder = asc;
    owner.paging.filterExpression = "{c1} != 'z'";
    expect(owner.getDataList().sort, "#1: the list has the sort").toEqual(asc);
    expect(owner.getDataList().filter, "#2: and the filter").toBe("{c1} != 'z'");
    expect(owner.hash["sortOrder"], "#3: the hash mirrors it").toEqual(asc);
    expect(owner.hash["filterExpression"], "#4").toBe("{c1} != 'z'");
    expect(owner.paging.sortBy, "#5: the text face of the same storage").toBe("c1");
    expect(owner.view, "#6").toEqual(["a", "b", "c"]);
  });
  test("sortBy assigns the parsed sortOrder and resets the view once", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.resetCount = 0;
    owner.paging.sortBy = "c1-";
    expect(owner.paging.sortOrder, "#1").toEqual(desc);
    expect(owner.getDataList().sort, "#2").toEqual(desc);
    expect(owner.view, "#3").toEqual(["c", "b", "a"]);
    expect(owner.resetCount, "#4: one reset").toBe(1);
    owner.paging.sortBy = "c1-";
    expect(owner.resetCount, "#5: the same sort again rebuilds nothing").toBe(1);
  });
  test("a change the list makes on its own reaches the hash", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sortOrder = asc;
    owner.getDataList().sort = desc;
    expect(owner.paging.sortOrder, "#1").toEqual(desc);
    expect(owner.paging.sortBy, "#2").toBe("c1-");
  });
});

describe("DynamicDataPagingController: design mode (invariants 1 and 4)", () => {
  test("the authored sort and filter are stored, read back and not applied", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sortOrder = asc;
    owner.paging.filterExpression = "{c1} = 'a'";
    expect(owner.hasList, "#1: the setter did not create the list").toBe(false);
    expect(owner.paging.sortOrder, "#2: it reads back as authored").toEqual(asc);
    expect(owner.paging.sortBy, "#3").toBe("c1");
    expect(owner.paging.filterExpression, "#4").toBe("{c1} = 'a'");
    expect(owner.getDataList().sort, "#5: the list has nothing").toEqual([]);
    expect(owner.getDataList().filter, "#6").toBe("");
    expect(owner.view, "#7: every record, in storage order").toEqual(["c", "a", "b"]);
  });
  test("a sync in design mode does not wipe the hash", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sortBy = "c1";
    owner.paging.filterExpression = "{c1} = 'a'";
    owner.paging.syncState();
    owner.paging.syncState();
    expect(owner.paging.sortBy, "#1").toBe("c1");
    expect(owner.paging.filterExpression, "#2").toBe("{c1} = 'a'");
    expect(owner.getDataList().sort, "#3").toEqual([]);
  });
  test("a switch into design mode takes effect at the next sync, not at the next read", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sortOrder = asc;
    expect(owner.view, "#1").toEqual(["a", "b", "c"]);
    owner.isDesignMode = true;
    expect(owner.paging.sortOrder, "#2: the hash is right at once").toEqual(asc);
    expect(owner.getDataList().sort, "#3: the list still sorts - nothing told it").toEqual(asc);
    owner.paging.syncState();
    expect(owner.getDataList().sort, "#4: the sync clears the list").toEqual([]);
    expect(owner.paging.sortOrder, "#5: and keeps the authored value").toEqual(asc);
    expect(owner.view, "#6").toEqual(["c", "a", "b"]);
  });
  test("a switch out of design mode pushes the authored sort at the next sync", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sortOrder = desc;
    expect(owner.view, "#1").toEqual(["c", "a", "b"]);
    owner.isDesignMode = false;
    expect(owner.paging.sortOrder, "#2").toEqual(desc);
    owner.paging.syncState();
    expect(owner.getDataList().sort, "#3").toEqual(desc);
    expect(owner.view, "#4").toEqual(["c", "b", "a"]);
  });
  test("the filter is never parsed in design mode, so one that does not run is kept", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.filterExpression = "{c1} = ";
    owner.paging.syncState();
    expect(owner.paging.filterExpression, "#1: the Creator keeps what was typed").toBe("{c1} = ");
    expect(owner.getDataList().filter, "#2: and the list never saw it").toBe("");
  });
});

describe("DynamicDataPagingController: loading (invariant 3)", () => {
  test("a setter stores into the hash only and creates no list", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    owner.paging.filterExpression = "{c1} != 'z'";
    expect(owner.hasList, "#1").toBe(false);
    expect(owner.paging.sortBy, "#2").toBe("c1-");
    expect(owner.paging.filterExpression, "#3").toBe("{c1} != 'z'");
  });
  test("a sync during the load does not mirror the list over the authored value", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    // What the rowsPerPage/panelsPerPage setter does: it creates the list and syncs, in the middle
    // of the load and with the authored sort not pushed yet.
    owner.pageSize = 2;
    expect(owner.paging.sortBy, "#1: the authored sort survived it").toBe("c1-");
    expect(owner.getDataList().sort, "#2: and has not been pushed yet").toEqual([]);
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.getDataList().sort, "#3: the flush pushes it").toEqual(desc);
    expect(owner.view, "#4").toEqual(["c", "b", "a"]);
  });
  test("the list receives the authored sort once per load", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    owner.paging.filterExpression = "{c1} != 'z'";
    owner.pageSize = 2;
    owner.paging.syncState();
    owner.resetCount = 0;
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.getDataList().sort, "#1").toEqual(desc);
    expect(owner.getDataList().filter, "#2").toBe("{c1} != 'z'");
    // One setView for both: with a source that pages, two assignments would be two requests.
    expect(owner.resetCount, "#3: one reset for the whole authored view").toBe(1);
    owner.paging.flushAuthoredView();
    expect(owner.resetCount, "#4: nothing is pending any more").toBe(1);
  });
  test("a flush while the owner is still loading does nothing", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    owner.paging.flushAuthoredView();
    expect(owner.hasList, "#1: not even the list").toBe(false);
  });
  test("a flush with nothing pending creates no list", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.flushAuthoredView();
    expect(owner.hasList, "#1").toBe(false);
  });
  test("a reload that assigns the same sort does not push it a second time", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sortBy = "c1-";
    owner.resetCount = 0;
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.resetCount, "#1").toBe(0);
    expect(owner.getDataList().sort, "#2").toEqual(desc);
  });
  test("a reload into a question that already runs a different sort replaces it", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sortBy = "c1";
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    expect(owner.getDataList().sort, "#1: not while it loads").toEqual(asc);
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.getDataList().sort, "#2").toEqual(desc);
    expect(owner.paging.sortBy, "#3: and the old sort was not mirrored back").toBe("c1-");
  });
});

describe("DynamicDataPagingController: the rejected filter (invariant 5)", () => {
  test("a filter the list cannot run is not handed back on the next sync", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.filterExpression = "{c1} = ";
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.paging.filterExpression, "#1: the mirror takes what the list ended up with").toBe("");
    expect(owner.getDataList().filter, "#2").toBe("");
    expect(owner.view, "#3: showing every record beats showing none").toEqual(["c", "a", "b"]);
    owner.paging.syncState();
    expect(owner.paging.filterExpression, "#4: and it is not re-pushed").toBe("");
  });
});

describe("DynamicDataPagingController: a source swap (invariant 6)", () => {
  // A source that pages, and so owns the view: it comes inside every request it is asked.
  class SortingSource implements IDynamicDataSource {
    public requests: Array<IDynamicDataReadRequest> = [];
    constructor(private records: Array<any>) { }
    public read(): Array<any> { return this.records; }
    public readRange(request: IDynamicDataReadRequest): IDynamicDataReadResult {
      this.requests.push(request);
      return { records: this.records.slice(), total: this.records.length };
    }
  }
  test("a source attached after the load receives the parsed descriptors", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sortBy = "c1-";
    owner.paging.filterExpression = "{c1} != 'z'";
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    const source = new SortingSource(abc());
    owner.setSource(source);
    expect(source.requests.length, "#0: one request").toBe(1);
    expect(source.requests[0].sort, "#1: the descriptors, not the text").toEqual(desc);
    expect(source.requests[0].filter, "#2: and the expression, untouched").toBe("{c1} != 'z'");
    expect(owner.paging.sortBy, "#3: the question still reports them").toBe("c1-");
    expect(owner.paging.filterExpression, "#4").toBe("{c1} != 'z'");
  });
});

describe("DynamicDataPagingController: the sortBy notification (section 4)", () => {
  test("it fires once per real change when sortOrder is assigned", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.sortByChanges = [];
    owner.paging.sortOrder = asc;
    expect(owner.sortByChanges, "#1").toEqual([" -> c1"]);
    owner.paging.sortOrder = asc;
    expect(owner.sortByChanges, "#2: the same sort again says nothing").toEqual([" -> c1"]);
    owner.paging.sortOrder = desc;
    expect(owner.sortByChanges, "#3").toEqual([" -> c1", "c1 -> c1-"]);
  });
  test("it fires when toggleSort runs", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.sortByChanges = [];
    owner.paging.toggleSort("c1");
    owner.paging.toggleSort("c1");
    owner.paging.toggleSort("c1");
    expect(owner.sortByChanges, "#1: ascending, descending, none")
      .toEqual([" -> c1", "c1 -> c1-", "c1- -> "]);
  });
  test("it fires when the list changes the sort on its own", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList().sort = desc;
    expect(owner.sortByChanges, "#1").toEqual([" -> c1-"]);
  });
  test("it fires for a sort authored in design mode and for one that loads", () => {
    const design = new FakePagingOwner(abc());
    design.isDesignMode = true;
    design.paging.sortBy = "c1";
    expect(design.sortByChanges, "#1").toEqual([" -> c1"]);
    const loading = new FakePagingOwner(abc());
    loading.isLoadingFromJson = true;
    loading.paging.sortOrder = desc;
    expect(loading.sortByChanges, "#2").toEqual([" -> c1-"]);
  });
  test("toggleSort ignores an empty field", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.toggleSort("");
    expect(owner.sortByChanges, "#1").toEqual([]);
    expect(owner.hasList, "#2").toBe(false);
  });
});

/* Multi-field sorting: the same asc -> desc -> off cycle applied to one entry of the sort instead
   of to the whole of it. It is what a modified header click does, and the renderer only passes the
   modifier on. */
describe("DynamicDataPagingController: toggleSort(field, addToSort)", () => {
  const pairs = (): Array<any> => [{ c1: "b", c2: 2 }, { c1: "a", c2: 1 }, { c1: "b", c2: 1 }];
  const records = (owner: FakePagingOwner): Array<string> => {
    const list = owner.getDataList();
    return list.getCreatedIndexes().map((index: number): string => {
      const rec = list.getRecord(index);
      return rec.c1 + rec.c2;
    });
  };
  test("a field joins the sort at the end and the fields before it keep their place", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.toggleSort("c1", true);
    expect(owner.paging.sortBy, "#1: the first field").toBe("c1");
    owner.paging.toggleSort("c2", true);
    expect(owner.paging.sortBy, "#2: the second one is the tie-breaker").toBe("c1;c2");
    expect(records(owner), "#3: and the list sorts by both").toEqual(["a1", "b1", "b2"]);
  });
  test("an existing field cycles in place: ascending, then descending, then out of the sort", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sortOrder = [{ field: "c1", direction: "asc" }, { field: "c2", direction: "asc" }];
    owner.paging.toggleSort("c1", true);
    expect(owner.paging.sortBy, "#1: descending, still first").toBe("c1-;c2");
    expect(records(owner), "#2").toEqual(["b1", "b2", "a1"]);
    owner.paging.toggleSort("c1", true);
    expect(owner.paging.sortBy, "#3: out, and c2 keeps its direction").toBe("c2");
    expect(records(owner), "#4").toEqual(["a1", "b1", "b2"]);
  });
  test("the field that leaves the sort takes nothing with it", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sortOrder = [
      { field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }, { field: "c3", direction: "asc" }
    ];
    owner.paging.toggleSort("c2", true);
    expect(owner.paging.sortBy, "#1: c2 cycles from desc to nothing").toBe("c1;c3");
  });
  /* The unmodified click is untouched by the parameter: it replaces the whole sort and its cycle
     reads the direction the field has now, whether or not other fields are sorted with it. */
  test("a plain toggle over a multi-field sort keeps the single-field cycle", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sortOrder = [{ field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }];
    owner.paging.toggleSort("c3");
    expect(owner.paging.sortBy, "#1: an unsorted field starts over with itself").toBe("c3");
    owner.paging.sortOrder = [{ field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }];
    owner.paging.toggleSort("c1", false);
    expect(owner.paging.sortBy, "#2: an explicit false is the same click").toBe("c1-");
    owner.paging.sortOrder = [{ field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }];
    owner.paging.toggleSort("c2");
    expect(owner.paging.sortBy, "#3: the third click of the cycle clears the sort").toBe("");
  });
  test("every cycle reaches the list and raises the sortBy change", () => {
    const owner = new FakePagingOwner(pairs());
    owner.getDataList();
    owner.sortByChanges = [];
    owner.paging.toggleSort("c1", true);
    owner.paging.toggleSort("c2", true);
    owner.paging.toggleSort("c2", true);
    owner.paging.toggleSort("c2", true);
    expect(owner.sortByChanges, "#1").toEqual([" -> c1", "c1 -> c1;c2", "c1;c2 -> c1;c2-", "c1;c2- -> c1"]);
    expect(owner.getDataList().sort, "#2: the list holds the descriptors")
      .toEqual([{ field: "c1", direction: "asc" }]);
  });
  test("an empty field is ignored here too", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sortOrder = [{ field: "c1", direction: "asc" }];
    owner.sortByChanges = [];
    owner.paging.toggleSort("", true);
    expect(owner.paging.sortBy, "#1: the sort is untouched").toBe("c1");
    expect(owner.sortByChanges, "#2").toEqual([]);
  });
});
