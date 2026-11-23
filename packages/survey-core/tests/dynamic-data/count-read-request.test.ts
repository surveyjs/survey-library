import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";
import { QuestionFilterModel } from "../../src/question_filter";
import { filterModalCountDelay } from "../../src/filter/filter-modal";
import "../../src/question_matrixdynamic";
import "../../src/question_paneldynamic";

// The count read - a Filter Control's "Show N items" - carries isCount: true, so that a source can tell
// it from page 0 of a pageSize: 1 grid, the same range, filter and sort. Window reads leave the key out.

/* A toy server that pages, filters and sorts: it understands "{field} > number" (several joined by
   "and", each one bracketed, as the list combines them) and keeps every request it was asked.
   countAnswer says how it answers a read with isCount: not at all (undefined, a source that ignores
   the field), { records: [], total: 7 } or { total: 7 }. */
class RecordingSource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: true, sorting: true };
  public requests: Array<IDynamicDataReadRequest> = [];
  public countAnswer: "records" | "total" | undefined;
  public isAsync: boolean = false;
  constructor(public records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult | Promise<IDynamicDataReadResult> {
    this.requests.push(request);
    const res = this.answer(request);
    return this.isAsync ? Promise.resolve().then((): IDynamicDataReadResult => res) : res;
  }
  private answer(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    if (request.isCount && this.countAnswer === "records") return { records: [], total: 7 };
    if (request.isCount && this.countAnswer === "total") return <any>{ total: 7 };
    let view = this.records.slice();
    (request.filter || "").split(" and ").forEach((part: string): void => {
      const parts = /^\(?\{(\w+)\}\s*>\s*(\d+)\)?$/.exec(part.trim());
      if (!!parts) view = view.filter((record: any): boolean => record[parts[1]] > Number(parts[2]));
    });
    (request.sort || []).slice().reverse().forEach((criterion: any): void => {
      const sign = criterion.direction === "desc" ? -1 : 1;
      view.sort((a: any, b: any): number => (a[criterion.field] > b[criterion.field] ? 1 : a[criterion.field] < b[criterion.field] ? -1 : 0) * sign);
    });
    const size = request.take > 0 ? request.take : view.length;
    return { records: view.slice(request.skip, request.skip + size), total: view.length };
  }
}
const records = (): Array<any> => [{ c1: "a", n: 1 }, { c1: "b", n: 2 }, { c1: "c", n: 3 }];
async function flush(times: number = 20): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}
const hasKey = (request: IDynamicDataReadRequest): boolean => "isCount" in request;

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
const preset = { items: [{ name: "more", expression: "{n} > 1" }], defaultItem: undefined };
async function create(kind: IKind, source: IDynamicDataSource, json: any, withControl?: boolean):
  Promise<{ question: any, control: QuestionFilterModel }> {
  const elements: Array<any> = [Object.assign({}, kind.element, json)];
  if (withControl) elements.push(Object.assign({ type: "filter", name: "f1", source: "q" }, preset));
  const survey = new SurveyModel({ elements: elements });
  const question = <any>survey.getQuestionByName("q");
  question.dataSource = source;
  await flush();
  return { question: question, control: <QuestionFilterModel>survey.getQuestionByName("f1") };
}

afterEach(() => { vi.useRealTimers(); });

kinds.forEach((kind: IKind) => {
  describe("The count read request: " + kind.name, () => {
    test("pageSize: 1, no sort: the page 0 read and the count read differ only by isCount: true", async () => {
      const source = new RecordingSource(records());
      const { question } = await create(kind, source, { pageSize: 1 });
      const window = source.requests[source.requests.length - 1];
      expect(window, "#1: page 0").toEqual({ skip: 0, take: 1, filter: "", sort: [] });
      expect(hasKey(window), "#2: the window read has no isCount key").toBe(false);
      expect(await question.getControlFilterCount("f1", ""), "#3").toBe(3);
      const count = source.requests[source.requests.length - 1];
      expect(count, "#4").toEqual({ skip: 0, take: 1, filter: "", sort: [], isCount: true });
    });
    // Pins existing behaviour: window reads never carried the key, and the change keeps it so.
    test("no window read carries the key (pinning)", async () => {
      const source = new RecordingSource(records());
      const { question } = await create(kind, source, { pageSize: 2 });
      expect(source.requests.length, "#1: the first load").toBe(1);
      question.pageIndex = 1;
      await flush();
      expect(source.requests.length, "#2: a page move").toBe(2);
      question.filterExpression = "{n} > 0";
      await flush();
      expect(source.requests.length, "#3: a filter change").toBe(3);
      question.sortCriteria = [{ field: "n", direction: "desc" }];
      await flush();
      expect(source.requests.length, "#4: a sort change").toBe(4);
      question.refreshDataSource();
      await flush();
      expect(source.requests.length, "#5: refreshDataSource()").toBe(5);
      expect(source.requests.filter(hasKey), "#6").toEqual([]);
    });
    // Pins existing behaviour: the read Apply sends after a counted edit is a window read with the
    // count's filter and no key.
    test("the read Apply sends after a counted edit has no key (pinning)", async () => {
      vi.useFakeTimers();
      const source = new RecordingSource(records());
      const { control } = await create(kind, source, { pageSize: 2 }, true);
      const modal = control.createFilterModal();
      await flush();
      modal.togglePreset(control.getItemByName("more"));
      await vi.advanceTimersByTimeAsync(filterModalCountDelay);
      expect(source.requests[source.requests.length - 1].filter, "#1: the edit was counted").toBe("{n} > 1");
      source.requests = [];
      modal.apply();
      await flush();
      expect(source.requests, "#2: one window read").toEqual([{ skip: 0, take: 2, filter: "{n} > 1", sort: [] }]);
      expect(hasKey(source.requests[0]), "#3").toBe(false);
      modal.dispose();
    });
    // Pins existing behaviour: a source that does not know the field answers the count as a window
    // read, and the list keeps its total.
    test("a source that ignores the field still gets counted, sync and async (pinning)", async () => {
      const source = new RecordingSource(records());
      const { question } = await create(kind, source, { pageSize: 2 });
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#1: sync").toBe(2);
      source.isAsync = true;
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#2: async").toBe(2);
    });
    ["records", "total"].forEach((answer: "records" | "total") => {
      test("a source that answers a count read by " + (answer === "records" ? "{ records: [], total: 7 }" : "{ total: 7 }") + " gives 7", async () => {
        const source = new RecordingSource(records());
        source.countAnswer = answer;
        const { question } = await create(kind, source, { pageSize: 2 });
        // Pinning part: the window is the source's real records and total, before and after.
        const before = [kind.values(question), question.pageCount, kind.recordCount(question)];
        expect(before, "#1").toEqual([["a", "b"], 2, 3]);
        const reads = source.requests.length;
        expect(await question.getControlFilterCount("f1", "{n} > 1"), "#2: the count read's total").toBe(7);
        await flush();
        expect(source.requests.length - reads, "#3: one read, no window read follows").toBe(1);
        expect([kind.values(question), question.pageCount, kind.recordCount(question)], "#4: the window is untouched").toEqual(before);
      });
    });
    test("the Filters dialog: opening it sends one read with isCount: true, its resultCount is the source's total", async () => {
      const source = new RecordingSource(records());
      source.countAnswer = "records";
      const { control } = await create(kind, source, { pageSize: 2 }, true);
      source.requests = [];
      const modal = control.createFilterModal();
      await flush();
      expect(source.requests, "#1").toEqual([{ skip: 0, take: 1, filter: "", sort: [], isCount: true }]);
      expect(modal.resultCount, "#2").toBe(7);
      modal.dispose();
    });
    // Pins existing behaviour: a source the list reads whole is counted here, with no read at all.
    test("a source without paging and filtering is counted locally: no read with isCount (pinning)", async () => {
      const source = new RecordingSource(records());
      source.capabilities = {};
      const { question } = await create(kind, source, {});
      const reads = source.requests.length;
      expect(await question.getControlFilterCount("f1", "{n} > 1"), "#1").toBe(2);
      expect(source.requests.length - reads, "#2: no read").toBe(0);
      expect(source.requests.filter(hasKey), "#3").toEqual([]);
    });
  });
});
