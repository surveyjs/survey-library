import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { QuestionFilterModel } from "../../src/question_filter";
import { filterModalCountDelay } from "../../src/filter/filter-modal";
import "../../src/question_matrixdynamic";
import "../../src/question_paneldynamic";

// The count a Filter Control's "Show N items" shows: a source that pages and filters and has
// count(filter) is asked by that method, with no read; one without it is read for the total of a
// one-record window, as before.

/* A toy server that pages, filters and sorts: it understands "{field} > number" (several joined by
   "and", each one bracketed, as the list combines them) and keeps every request it was asked. */
class RecordingSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public requests: Array<IDynamicDataReadRequest> = [];
  public isAsync: boolean = false;
  constructor(public records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult | Promise<IDynamicDataReadResult> {
    this.requests.push(request);
    const res = { records: [], total: 0 };
    const view = this.filterRecords(request.filter);
    (request.sort || []).slice().reverse().forEach((criterion: any): void => {
      const sign = criterion.direction === "desc" ? -1 : 1;
      view.sort((a: any, b: any): number => (a[criterion.field] > b[criterion.field] ? 1 : a[criterion.field] < b[criterion.field] ? -1 : 0) * sign);
    });
    const size = request.take > 0 ? request.take : view.length;
    res.records = view.slice(request.skip, request.skip + size);
    res.total = view.length;
    return this.isAsync ? Promise.resolve().then((): IDynamicDataReadResult => res) : res;
  }
  protected filterRecords(filter: string): Array<any> {
    let view = this.records.slice();
    (filter || "").split(" and ").forEach((part: string): void => {
      const parts = /^\(?\{(\w+)\}\s*>\s*(\d+)\)?$/.exec(part.trim());
      if (!!parts) view = view.filter((record: any): boolean => record[parts[1]] > Number(parts[2]));
    });
    return view;
  }
}
/* The same server with a count method: it answers countAnswer when that is set (7, a number no read
   gives, or undefined), else the real count; "throw" and "reject" fail. Its own `this` is used, as a
   class source's would be. */
class CountingSource extends RecordingSource {
  public counts: Array<string> = [];
  public countAnswer: number | undefined | "real" | "throw" | "reject" = "real";
  public count(filter: string): number | undefined | Promise<number | undefined> {
    this.counts.push(filter);
    if (this.countAnswer === "throw") throw new Error("offline");
    if (this.countAnswer === "reject") return Promise.reject(new Error("offline"));
    const res = this.countAnswer === "real" ? this.filterRecords(filter).length : this.countAnswer;
    return this.isAsync ? Promise.resolve(res) : res;
  }
}
const records = (): Array<any> => [{ c1: "a", n: 1 }, { c1: "b", n: 2 }, { c1: "c", n: 3 }];
async function flush(times: number = 20): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

interface IKind {
  name: string;
  element: any;
  values(q: any): Array<any>;
  recordCount(q: any): number;
}
const kinds: Array<IKind> = [
  {
    name: "matrix",
    element: { type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "c1" }, { name: "n", cellType: "text", inputType: "number" }] },
    values: (q: any): Array<any> => q.visibleRows.map((row: any): any => row.getQuestionByName("c1").value),
    recordCount: (q: any): number => q.rowCount
  },
  {
    name: "panel",
    element: { type: "paneldynamic", name: "q", panelCount: 0,
      templateElements: [{ type: "text", name: "c1" }, { type: "text", name: "n", inputType: "number" }] },
    values: (q: any): Array<any> => q.panels.map((panel: any): any => panel.getQuestionByName("c1").value),
    recordCount: (q: any): number => q.panelCount
  }
];
const preset = { presets: [{ name: "more", expression: "{n} > 1" }] };
async function create(kind: IKind, source: IDynamicDataSource, json: any, withControl?: boolean):
  Promise<{ survey: SurveyModel, question: any, control: QuestionFilterModel }> {
  const elements: Array<any> = [Object.assign({}, kind.element, json)];
  if (withControl) elements.push(Object.assign({ type: "filter", name: "f1", targetQuestion: "q" }, preset));
  const survey = new SurveyModel({ elements: elements });
  const question = <any>survey.getQuestionByName("q");
  question.dataSource = source;
  await flush();
  return { survey: survey, question: question, control: <QuestionFilterModel>survey.getQuestionByName("f1") };
}

afterEach(() => { vi.useRealTimers(); });

kinds.forEach((kind: IKind) => {
  describe("A source's count(filter): " + kind.name, () => {
    test("the count goes to count(filter), with the authored and the control filter, and no read goes out", async () => {
      const source = new CountingSource(records());
      const { question } = await create(kind, source, { pageSize: 2, filterExpression: "{n} > 0" });
      const reads = source.requests.length;
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#1").toBe(2);
      expect(source.counts, "#2").toEqual(["({n} > 0) and ({n} > 1)"]);
      expect(source.requests.length - reads, "#3: no read").toBe(0);
    });
    test("its answer is the count, sync and async, the window is untouched", async () => {
      const source = new CountingSource(records());
      source.countAnswer = 7;
      const { question } = await create(kind, source, { pageSize: 2 });
      const before = [kind.values(question), question.pageCount, kind.recordCount(question)];
      expect(before, "#1").toEqual([["a", "b"], 2, 3]);
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#2: sync").toBe(7);
      source.isAsync = true;
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#3: async").toBe(7);
      await flush();
      expect([kind.values(question), question.pageCount, kind.recordCount(question)], "#4").toEqual(before);
      expect(source.requests.length, "#5: the first load only").toBe(1);
    });
    ["undefined", "throw", "reject"].forEach((answer: string) => {
      test("a count(filter) that answers " + answer + " gives no count, reports nothing and sends no read", async () => {
        const source = new CountingSource(records());
        source.countAnswer = answer === "undefined" ? undefined : <any>answer;
        const { survey, question } = await create(kind, source, { pageSize: 2 });
        const errors: Array<string> = [];
        survey.onDynamicDataError.add((_, options: any): void => { errors.push(options.operation); });
        const reads = source.requests.length;
        expect(await question.getControlFilterCount("f1", "{n} > 1"), "#1").toBe(undefined);
        expect([errors, source.requests.length - reads], "#2").toEqual([[], 0]);
      });
    });
    test("the Filters dialog: opening it and a counted edit call count(filter), resultCount is its answer", async () => {
      vi.useFakeTimers();
      const source = new CountingSource(records());
      source.countAnswer = 7;
      const { control } = await create(kind, source, { pageSize: 2 }, true);
      source.requests = [];
      const modal = control.createFilterModal();
      await flush();
      expect([source.counts, modal.resultCount], "#1: on open").toEqual([[""], 7]);
      source.countAnswer = "real";
      modal.togglePreset(control.getPresetByName("more"));
      await vi.advanceTimersByTimeAsync(filterModalCountDelay);
      expect([source.counts, modal.resultCount], "#2: after the edit").toEqual([["", "{n} > 1"], 2]);
      expect(source.requests, "#3: no read while counting").toEqual([]);
      modal.apply();
      await flush();
      expect(source.requests, "#4: Apply reads the window").toEqual([{ skip: 0, take: 2, filter: "{n} > 1", sort: [] }]);
      modal.dispose();
    });
    // Pins existing behaviour: without count(filter) the list reads a one-record window for its total.
    test("a source without count(filter) is read for the total of one record, sync and async (pinning)", async () => {
      const source = new RecordingSource(records());
      const { question } = await create(kind, source, { pageSize: 2 });
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#1: sync").toBe(2);
      expect(source.requests[source.requests.length - 1], "#2").toEqual({ skip: 0, take: 1, filter: "{n} > 1", sort: [] });
      source.isAsync = true;
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#3: async").toBe(2);
    });
    // Pins existing behaviour: a source the list reads whole is counted from the records it holds.
    test("a source without paging and filtering is counted here: count(filter) is not called (pinning)", async () => {
      const source = new CountingSource(records());
      source.capabilities = {};
      source.countAnswer = 7;
      const { question } = await create(kind, source, {});
      const reads = source.requests.length;
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#1").toBe(2);
      expect([source.counts, source.requests.length - reads], "#2").toEqual([[], 0]);
    });
  });
});

// LocalDynamicDataSource's own record count is recordCount: "count" is the source contract's method.
describe("The local sources and count", () => {
  test("an array source has recordCount and no count member", () => {
    let arr: Array<any> = [{ a: 1 }, { a: 2 }];
    const source = new ArrayDynamicDataSource((): Array<any> => arr, (val: Array<any>): void => { arr = val; });
    expect([source.recordCount, "count" in source], "#1").toEqual([2, false]);
  });
});
