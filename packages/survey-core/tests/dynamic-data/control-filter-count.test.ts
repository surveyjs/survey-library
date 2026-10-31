import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";
import { SurveyModel } from "../../src/survey";
import "../../src/question_matrixdynamic";

// How many records a control filter would leave before it is applied: what a Filter Control's
// "Show N items" button reads. It lives in a file of its own, next to the control filter slot tests.

/* A toy server that pages and filters: it understands "{field} > number" and nothing else, and keeps
   every request it was asked. */
class FakeServerViewSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public requests: Array<IDynamicDataReadRequest> = [];
  public sendTotal: boolean = true;
  constructor(public records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.requests.push(request);
    let view = this.records.slice();
    const parts = /^\{(\w+)\}\s*>\s*(\d+)$/.exec(request.filter || "");
    if (!!parts) {
      view = view.filter((record: any): boolean => record[parts[1]] > Number(parts[2]));
    }
    const size = request.take > 0 ? request.take : view.length;
    const res: IDynamicDataReadResult = { records: view.slice(request.skip, request.skip + size) };
    if (this.sendTotal) res.total = view.length;
    return res;
  }
}
// The same server answering later: every read waits until the test resolves it.
class AsyncServerSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public pending: Array<{ request: IDynamicDataReadRequest, resolve: (res: IDynamicDataReadResult) => void }> = [];
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    return new Promise((resolve) => { this.pending.push({ request: request, resolve: resolve }); });
  }
}
// A paging source that cannot filter: the list reads it whole while a filter is set.
class PagingOnlySource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, sorting: true };
  constructor(public records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    const take = request.take > 0 ? request.take : this.records.length;
    return { records: this.records.slice(request.skip, request.skip + take), total: this.records.length };
  }
}
const records = (): Array<any> => [{ c1: "a", n: 1 }, { c1: "b", n: 2 }, { c1: "c", n: 3 }];
const values = (list: DynamicDataList): Array<any> => list.getCreatedIndexes().map((i: number): any => list.getRecord(i).c1);

describe("DynamicDataList.countControlFilter", () => {
  test("records held here: the authored filter and the given control filter are run over them", async () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    list.load();
    list.filter = "{n} > 1";
    list.controlFilter = "{c1} = 'b'";
    expect(await list.countControlFilter("{c1} != 'c'"), "#1").toBe(1);
    expect(await list.countControlFilter(""), "#2: the authored filter alone").toBe(2);
    expect([list.controlFilter, values(list)], "#3: the view is not touched").toEqual(["{c1} = 'b'", ["b"]]);
  });
  test("a control filter that cannot be run counts nothing and reports nothing", async () => {
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray(records()));
    const errors: Array<string> = [];
    list.onError = (e: any, op: string): void => { errors.push(op); };
    list.load();
    expect(await list.countControlFilter("{c1} = "), "#1").toBe(undefined);
    expect(errors, "#2").toEqual([]);
  });
  test("a source that filters is asked for the total of one record, with the authored filter", async () => {
    const source = new FakeServerViewSource(records());
    const list = new DynamicDataList(source);
    list.load();
    const reads = source.requests.length;
    expect(await list.countControlFilter("{n} > 1"), "#1").toBe(2);
    expect(source.requests[reads], "#2").toEqual({ skip: 0, take: 1, filter: "{n} > 1", sort: [] });
    list.filter = "{n} > 2";
    await list.countControlFilter("{n} > 1");
    expect(source.requests[source.requests.length - 1].filter, "#3").toBe("({n} > 2) and ({n} > 1)");
    expect(list.controlFilter, "#4").toBe("");
  });
  test("a count read that fails counts nothing and reports nothing", async () => {
    const source = new FakeServerViewSource(records());
    const list = new DynamicDataList(source);
    const errors: Array<string> = [];
    list.onError = (e: any, op: string): void => { errors.push(op); };
    list.load();
    source.read = (): any => Promise.reject(new Error("offline"));
    expect(await list.countControlFilter("{n} > 1"), "#1").toBe(undefined);
    expect(errors, "#2").toEqual([]);
  });
  test("a source that does not send a total counts nothing", async () => {
    const source = new FakeServerViewSource(records());
    source.sendTotal = false;
    const list = new DynamicDataList(source);
    list.load();
    expect(await list.countControlFilter("{n} > 1")).toBe(undefined);
  });
  test("the count read does not take the place of the list's own read", async () => {
    const source = new AsyncServerSource();
    const list = new DynamicDataList(source);
    list.load();
    const count = list.countControlFilter("{n} > 1");
    expect(source.pending.length, "#1: the window read and the count read").toBe(2);
    source.pending[1].resolve({ records: [{ c1: "b", n: 2 }], total: 2 });
    expect(await count, "#2").toBe(2);
    source.pending[0].resolve({ records: records(), total: 3 });
    await Promise.resolve();
    await Promise.resolve();
    expect(values(list), "#3: the window read still lands").toEqual(["a", "b", "c"]);
  });
  test("a paging source that cannot filter: counted here while it is read whole, unknown while paged", async () => {
    const list = new DynamicDataList(new PagingOnlySource(records()));
    list.load();
    expect(await list.countControlFilter("{n} > 1"), "#1: only a page is held").toBe(undefined);
    list.filter = "{n} > 0";
    expect(await list.countControlFilter("{n} > 1"), "#2: the whole storage is held").toBe(2);
  });
});

describe("Records question: getControlFilterCount", () => {
  function createMatrix(): any {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c1" }, { name: "n" }] }] });
    const matrix = <any>survey.getQuestionByName("m");
    matrix.dataSource = ArrayDynamicDataSource.fromArray(records());
    return matrix;
  }
  test("the control's own filter is replaced by the expression, the other controls' filters stay", async () => {
    const matrix = createMatrix();
    matrix.setControlFilter("first", "{n} > 1");
    matrix.setControlFilter("second", "{c1} != 'c'");
    expect(await matrix.getControlFilterCount("second", ""), "#1: without its own filter").toBe(2);
    expect(await matrix.getControlFilterCount("second", "{c1} = 'b'"), "#2").toBe(1);
    expect(await matrix.getControlFilterCount("third", "{c1} = 'a'"), "#3: a control with no filter yet").toBe(0);
    expect(matrix.getControlFilter("second"), "#4: nothing is applied").toBe("{c1} != 'c'");
  });
});
