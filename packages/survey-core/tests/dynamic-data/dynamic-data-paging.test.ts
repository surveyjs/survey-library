import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { RecordsPagingController, IRecordsPagingOwner } from "../../src/records/records-paging";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import {
  IDynamicDataField, IDynamicDataListChange, IDynamicDataOwner, IDynamicDataReadRequest,
  IDynamicDataReadResult, ISortCriterion, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";

export * from "../../src/question_text";

/* The controller against a fake owner: a property hash, the two mode flags a question would answer
   from the survey, and a recorder for the writes of the sort. The list under it is a real one over
   a real in-memory source, and it is created lazily exactly as a question creates it - "the setter
   does not create the list" is one of the invariants. */
class FakePagingOwner implements IRecordsPagingOwner, IDynamicDataOwner {
  public paging: RecordsPagingController;
  public hash: { [index: string]: any } = {};
  public isDesignMode: boolean = false;
  public isLoadingFromJson: boolean = false;
  public sortChanges: Array<string> = [];
  private onPushes: { [index: string]: (item: any) => void } = {};
  public resetCount: number = 0;
  private listValue: DynamicDataList;
  private source: IDynamicDataSource;
  constructor(records: Array<any>) {
    this.source = ArrayDynamicDataSource.fromArray(records);
    this.paging = new RecordsPagingController(this, (): DynamicDataList => this.getDataList());
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
  // A live array as Base keeps one: created once, replaced in place, onPush for every item it takes.
  public getArrayPropertyValue(name: string, onPush: (item: any) => void): Array<any> {
    if (!Array.isArray(this.hash[name])) {
      this.hash[name] = [];
      this.onPushes[name] = onPush;
    }
    return this.hash[name];
  }
  public setArrayPropertyValue(name: string, val: Array<any>): void {
    const arr = this.hash[name];
    const oldText = sortText(arr);
    arr.splice(0, arr.length, ...val);
    val.forEach((item: any): void => this.onPushes[name](item));
    this.sortChanges.push(oldText + " -> " + sortText(arr));
  }
  // No survey behind the fake: the string name and the arguments are enough to tell texts apart.
  public getLocalizationFormatString(strName: string, ...args: any[]): string {
    return strName + ": " + args.join(", ");
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
const toPlain = (item: ISortCriterion): ISortCriterion => ({ field: item.field, direction: item.direction });
const getSort = (obj: { sortCriteria: Array<ISortCriterion> }): Array<ISortCriterion> => obj.sortCriteria.map(toPlain);
const sortText = (sort: Array<ISortCriterion>): string => sort.map((item: ISortCriterion): string => item.field + " " + item.direction).join(", ");
const abc = (): Array<any> => [{ c1: "c" }, { c1: "a" }, { c1: "b" }];
const asc: Array<ISortCriterion> = [{ field: "c1", direction: "asc" }];
const desc: Array<ISortCriterion> = [{ field: "c1", direction: "desc" }];

describe("RecordsPagingController: at runtime the list holds the view and the hash mirrors it", () => {
  test("the list holds the sort and the filter, the hash mirrors it, the accessors read the hash", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sort(asc);
    owner.paging.filterExpression = "{c1} != 'z'";
    expect(owner.getDataList().sort, "#1: the list has the sort").toEqual(asc);
    expect(owner.getDataList().filter, "#2: and the filter").toBe("{c1} != 'z'");
    expect(owner.hash["sortCriteria"].map(toPlain), "#3: the hash mirrors it").toEqual(asc);
    expect(owner.hash["filterExpression"], "#4").toBe("{c1} != 'z'");
    expect(getSort(owner.paging), "#5: the accessor reads the hash").toEqual([{ field: "c1", direction: "asc" }]);
    expect(owner.view, "#6").toEqual(["a", "b", "c"]);
  });
  test("sort() reaches the list and resets the view once", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.resetCount = 0;
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    expect(getSort(owner.paging), "#1").toEqual(desc);
    expect(owner.getDataList().sort, "#2").toEqual(desc);
    expect(owner.view, "#3").toEqual(["c", "b", "a"]);
    expect(owner.resetCount, "#4: one reset").toBe(1);
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    expect(owner.resetCount, "#5: the same sort again rebuilds nothing").toBe(1);
  });
  test("a change the list makes on its own reaches the hash", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sort(asc);
    owner.getDataList().sort = desc;
    expect(getSort(owner.paging), "#1").toEqual(desc);
    expect(getSort(owner.paging), "#2").toEqual([{ field: "c1", direction: "desc" }]);
  });
});

describe("RecordsPagingController: design mode stores the authored view and applies nothing", () => {
  test("the authored sort and filter are stored, read back and not applied", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sort(asc);
    owner.paging.filterExpression = "{c1} = 'a'";
    expect(owner.hasList, "#1: the setter did not create the list").toBe(false);
    expect(getSort(owner.paging), "#2: it reads back as authored").toEqual(asc);
    expect(getSort(owner.paging), "#3").toEqual([{ field: "c1", direction: "asc" }]);
    expect(owner.paging.filterExpression, "#4").toBe("{c1} = 'a'");
    expect(owner.getDataList().sort, "#5: the list has nothing").toEqual([]);
    expect(owner.getDataList().filter, "#6").toBe("");
    expect(owner.view, "#7: every record, in storage order").toEqual(["c", "a", "b"]);
  });
  test("a sync in design mode does not wipe the hash", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sort([{ field: "c1", direction: "asc" }]);
    owner.paging.filterExpression = "{c1} = 'a'";
    owner.paging.syncState();
    owner.paging.syncState();
    expect(getSort(owner.paging), "#1").toEqual([{ field: "c1", direction: "asc" }]);
    expect(owner.paging.filterExpression, "#2").toBe("{c1} = 'a'");
    expect(owner.getDataList().sort, "#3").toEqual([]);
  });
  test("a switch into design mode takes effect at the next sync, not at the next read", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sort(asc);
    expect(owner.view, "#1").toEqual(["a", "b", "c"]);
    owner.isDesignMode = true;
    expect(getSort(owner.paging), "#2: the hash is right at once").toEqual(asc);
    expect(owner.getDataList().sort, "#3: the list still sorts - nothing told it").toEqual(asc);
    owner.paging.syncState();
    expect(owner.getDataList().sort, "#4: the sync clears the list").toEqual([]);
    expect(getSort(owner.paging), "#5: and keeps the authored value").toEqual(asc);
    expect(owner.view, "#6").toEqual(["c", "a", "b"]);
  });
  test("a switch out of design mode pushes the authored sort at the next sync", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sort(desc);
    expect(owner.view, "#1").toEqual(["c", "a", "b"]);
    owner.isDesignMode = false;
    expect(getSort(owner.paging), "#2").toEqual(desc);
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

describe("RecordsPagingController: a view authored in design mode is kept by the next runtime assignment", () => {
  test("a filter assigned at runtime keeps the sort authored in design mode", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.isDesignMode = true;
    owner.paging.sort(asc);
    owner.isDesignMode = false;
    owner.paging.filterExpression = "{c1} != 'a'";
    expect(owner.getDataList().filter, "#1").toBe("{c1} != 'a'");
    expect(owner.getDataList().sort, "#2").toEqual(asc);
    expect(owner.paging.filterExpression, "#3").toBe("{c1} != 'a'");
    expect(getSort(owner.paging), "#4").toEqual(asc);
    expect(owner.view, "#5").toEqual(["b", "c"]);
  });
  test("a sort assigned at runtime keeps the filter authored in design mode", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.isDesignMode = true;
    owner.paging.filterExpression = "{c1} != 'a'";
    owner.isDesignMode = false;
    owner.paging.sort(desc);
    expect(owner.getDataList().sort, "#1").toEqual(desc);
    expect(owner.getDataList().filter, "#2").toBe("{c1} != 'a'");
    expect(getSort(owner.paging), "#3").toEqual(desc);
    expect(owner.paging.filterExpression, "#4").toBe("{c1} != 'a'");
    expect(owner.view, "#5").toEqual(["c", "b"]);
  });
  test("a list created after the switch back receives the authored view and the runtime assignment", () => {
    const owner = new FakePagingOwner(abc());
    owner.isDesignMode = true;
    owner.paging.sort(asc);
    owner.isDesignMode = false;
    owner.paging.filterExpression = "{c1} != 'a'";
    expect(owner.getDataList().filter, "#1").toBe("{c1} != 'a'");
    expect(owner.getDataList().sort, "#2").toEqual(asc);
    expect(owner.view, "#3").toEqual(["b", "c"]);
  });
  test("a dynamic matrix keeps the sort authored in design mode when a filter is assigned at runtime", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m",
      columns: [{ name: "c1", cellType: "text" }] }] });
    survey.data = { m: abc() };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cells = (): Array<any> => matrix.visibleRows.map(row => row.getValue("c1"));
    // A runtime filter creates the list before the switch into design mode.
    matrix.filterExpression = "{c1} != 'z'";
    expect(cells(), "#1").toEqual(["c", "a", "b"]);
    survey.setDesignMode(true);
    matrix.sort([{ field: "c1", direction: "asc" }]);
    survey.setDesignMode(false);
    matrix.filterExpression = "{c1} != 'a'";
    expect(getSort(matrix), "#2").toEqual([{ field: "c1", direction: "asc" }]);
    expect(matrix.filterExpression, "#3").toBe("{c1} != 'a'");
    expect(cells(), "#4").toEqual(["b", "c"]);
  });
});

describe("RecordsPagingController: while loading the view is stored and reaches the list once", () => {
  test("a setter stores into the hash only and creates no list", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    owner.paging.filterExpression = "{c1} != 'z'";
    expect(owner.hasList, "#1").toBe(false);
    expect(getSort(owner.paging), "#2").toEqual([{ field: "c1", direction: "desc" }]);
    expect(owner.paging.filterExpression, "#3").toBe("{c1} != 'z'");
  });
  test("a sync during the load does not mirror the list over the authored value", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    // What the pageSize setter does: it creates the list and syncs, in the middle
    // of the load and with the authored sort not pushed yet.
    owner.pageSize = 2;
    expect(getSort(owner.paging), "#1: the authored sort survived it").toEqual([{ field: "c1", direction: "desc" }]);
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
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
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
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
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
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    owner.resetCount = 0;
    owner.isLoadingFromJson = true;
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.resetCount, "#1").toBe(0);
    expect(owner.getDataList().sort, "#2").toEqual(desc);
  });
  test("a reload into a question that already runs a different sort replaces it", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sort([{ field: "c1", direction: "asc" }]);
    owner.isLoadingFromJson = true;
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    expect(owner.getDataList().sort, "#1: not while it loads").toEqual(asc);
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(owner.getDataList().sort, "#2").toEqual(desc);
    expect(getSort(owner.paging), "#3: and the old sort was not mirrored back").toEqual([{ field: "c1", direction: "desc" }]);
  });
});

describe("RecordsPagingController: a filter the list cannot run is not handed back", () => {
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

describe("RecordsPagingController: a source swap keeps the view", () => {
  // A source that pages, and so owns the view: it comes inside every request it is asked.
  class SortingSource implements IDynamicDataSource {
    public requests: Array<IDynamicDataReadRequest> = [];
    public capabilities = { paging: true, filtering: true, sorting: true };
    constructor(private records: Array<any>) { }
    public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
      this.requests.push(request);
      return { records: this.records.slice(), total: this.records.length };
    }
  }
  test("a source attached after the load receives the authored descriptors", () => {
    const owner = new FakePagingOwner(abc());
    owner.isLoadingFromJson = true;
    owner.paging.sort([{ field: "c1", direction: "desc" }]);
    owner.paging.filterExpression = "{c1} != 'z'";
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    const source = new SortingSource(abc());
    owner.setSource(source);
    expect(source.requests.length, "#0: one request").toBe(1);
    expect(source.requests[0].sort, "#1: the descriptors").toEqual(desc);
    expect(source.requests[0].filter, "#2: and the expression, untouched").toBe("{c1} != 'z'");
    expect(getSort(owner.paging), "#3: the question still reports them").toEqual([{ field: "c1", direction: "desc" }]);
    expect(owner.paging.filterExpression, "#4").toBe("{c1} != 'z'");
  });
});

describe("RecordsPagingController: the writes of the sort", () => {
  test("it writes once per real change when sort() runs", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.sortChanges = [];
    owner.paging.sort(asc);
    expect(owner.sortChanges, "#1").toEqual([" -> c1 asc"]);
    owner.paging.sort(asc);
    expect(owner.sortChanges, "#2: the same sort again writes nothing").toEqual([" -> c1 asc"]);
    owner.paging.sort(desc);
    expect(owner.sortChanges, "#3").toEqual([" -> c1 asc", "c1 asc -> c1 desc"]);
  });
  test("it writes when toggleSort runs", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList();
    owner.sortChanges = [];
    owner.paging.toggleSort("c1");
    owner.paging.toggleSort("c1");
    owner.paging.toggleSort("c1");
    expect(owner.sortChanges, "#1: ascending, descending, none")
      .toEqual([" -> c1 asc", "c1 asc -> c1 desc", "c1 desc -> "]);
  });
  test("it writes when the list changes the sort on its own", () => {
    const owner = new FakePagingOwner(abc());
    owner.getDataList().sort = desc;
    expect(owner.sortChanges, "#1").toEqual([" -> c1 desc"]);
  });
  test("it writes a sort authored in design mode and one that loads", () => {
    const design = new FakePagingOwner(abc());
    design.isDesignMode = true;
    design.paging.sort([{ field: "c1", direction: "asc" }]);
    expect(design.sortChanges, "#1").toEqual([" -> c1 asc"]);
    const loading = new FakePagingOwner(abc());
    loading.isLoadingFromJson = true;
    loading.paging.sort(desc);
    expect(loading.sortChanges, "#2").toEqual([" -> c1 desc"]);
  });
  test("toggleSort ignores an empty field", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.toggleSort("");
    expect(owner.sortChanges, "#1").toEqual([]);
    expect(owner.hasList, "#2").toBe(false);
  });
});

/* Multi-field sorting: the same asc -> desc -> off cycle applied to one entry of the sort instead
   of to the whole of it. It is what a modified header click does, and the renderer only passes the
   modifier on. */
describe("RecordsPagingController: toggleSort(field, addToSort)", () => {
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
    expect(getSort(owner.paging), "#1: the first field").toEqual([{ field: "c1", direction: "asc" }]);
    owner.paging.toggleSort("c2", true);
    expect(getSort(owner.paging), "#2: the second one is the tie-breaker").toEqual([{ field: "c1", direction: "asc" }, { field: "c2", direction: "asc" }]);
    expect(records(owner), "#3: and the list sorts by both").toEqual(["a1", "b1", "b2"]);
  });
  test("an existing field cycles in place: ascending, then descending, then out of the sort", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sort([{ field: "c1", direction: "asc" }, { field: "c2", direction: "asc" }]);
    owner.paging.toggleSort("c1", true);
    expect(getSort(owner.paging), "#1: descending, still first").toEqual([{ field: "c1", direction: "desc" }, { field: "c2", direction: "asc" }]);
    expect(records(owner), "#2").toEqual(["b1", "b2", "a1"]);
    owner.paging.toggleSort("c1", true);
    expect(getSort(owner.paging), "#3: out, and c2 keeps its direction").toEqual([{ field: "c2", direction: "asc" }]);
    expect(records(owner), "#4").toEqual(["a1", "b1", "b2"]);
  });
  test("the field that leaves the sort takes nothing with it", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sort([
      { field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }, { field: "c3", direction: "asc" }
    ]);
    owner.paging.toggleSort("c2", true);
    expect(getSort(owner.paging), "#1: c2 cycles from desc to nothing").toEqual([{ field: "c1", direction: "asc" }, { field: "c3", direction: "asc" }]);
  });
  /* The unmodified click is untouched by the parameter: it replaces the whole sort and its cycle
     reads the direction the field has now, whether or not other fields are sorted with it. */
  test("a plain toggle over a multi-field sort keeps the single-field cycle", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sort([{ field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }]);
    owner.paging.toggleSort("c3");
    expect(getSort(owner.paging), "#1: an unsorted field starts over with itself").toEqual([{ field: "c3", direction: "asc" }]);
    owner.paging.sort([{ field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }]);
    owner.paging.toggleSort("c1", false);
    expect(getSort(owner.paging), "#2: an explicit false is the same click").toEqual([{ field: "c1", direction: "desc" }]);
    owner.paging.sort([{ field: "c1", direction: "asc" }, { field: "c2", direction: "desc" }]);
    owner.paging.toggleSort("c2");
    expect(getSort(owner.paging), "#3: the third click of the cycle clears the sort").toEqual([]);
  });
  test("every cycle reaches the list and writes the sort", () => {
    const owner = new FakePagingOwner(pairs());
    owner.getDataList();
    owner.sortChanges = [];
    owner.paging.toggleSort("c1", true);
    owner.paging.toggleSort("c2", true);
    owner.paging.toggleSort("c2", true);
    owner.paging.toggleSort("c2", true);
    expect(owner.sortChanges, "#1").toEqual([" -> c1 asc", "c1 asc -> c1 asc, c2 asc", "c1 asc, c2 asc -> c1 asc, c2 desc",
      "c1 asc, c2 desc -> c1 asc"]);
    expect(owner.getDataList().sort, "#2: the list holds the descriptors")
      .toEqual([{ field: "c1", direction: "asc" }]);
  });
  test("an empty field is ignored here too", () => {
    const owner = new FakePagingOwner(pairs());
    owner.paging.sort([{ field: "c1", direction: "asc" }]);
    owner.sortChanges = [];
    owner.paging.toggleSort("", true);
    expect(getSort(owner.paging), "#1: the sort is untouched").toEqual([{ field: "c1", direction: "asc" }]);
    expect(owner.sortChanges, "#2").toEqual([]);
  });
});

describe("a throwing callback does not leave a guard behind", () => {
  test("an exception out of the authored-view push does not stop the next one", () => {
    const owner = new FakePagingOwner(abc());
    const list = owner.getDataList();
    let isThrown = false;
    // The filter cannot be parsed: the list reports it through onError, and this onError throws.
    list.onError = (): void => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("user code");
    };
    owner.isLoadingFromJson = true;
    owner.paging.filterExpression = "{c1} = ";
    owner.isLoadingFromJson = false;
    expect(() => owner.paging.flushAuthoredView(), "#1").toThrow();
    expect(list.filter, "#2: the list refused the filter").toBe("");
    owner.isLoadingFromJson = true;
    owner.paging.filterExpression = "{c1} != 'a'";
    owner.isLoadingFromJson = false;
    owner.paging.flushAuthoredView();
    expect(list.filter, "#3: the second authored flush reached the list").toBe("{c1} != 'a'");
    expect(owner.view, "#4").toEqual(["c", "b"]);
    expect(owner.paging.filterExpression, "#5: the hash mirrors the list").toBe("{c1} != 'a'");
  });
  test("an exception out of the design-mode clear does not stop the next push", () => {
    const owner = new FakePagingOwner(abc());
    owner.paging.sort(asc);
    const list = owner.getDataList();
    let isThrown = false;
    list.onChanged = (change: IDynamicDataListChange): void => {
      if (change.type !== "reset" || isThrown) return;
      isThrown = true;
      throw new Error("user code");
    };
    owner.isDesignMode = true;
    expect(() => owner.paging.syncState(), "#1: the clear raised reset").toThrow();
    expect(list.sort, "#2: the list was cleared").toEqual([]);
    // The design-mode sync the throw cut short, then the switch back.
    owner.paging.syncState();
    owner.isDesignMode = false;
    owner.paging.syncState();
    expect(list.sort, "#3: the authored sort reached the list").toEqual(asc);
    expect(owner.view, "#4").toEqual(["a", "b", "c"]);
  });
});
