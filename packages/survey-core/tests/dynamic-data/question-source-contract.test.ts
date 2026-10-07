import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { FunctionFactory } from "../../src/functionsfactory";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* The contract both dynamic questions share over a caller-provided data source. A source comes in two
   kinds, and the list pages both:
   - not paging: the source answers with the whole storage and the LIST pages it, exactly as it
     pages question.value. Every record is in memory.
   - paging: the source pages, filters and sorts itself; the window IS the page and the records of
     the other pages are on the server.
   The scenarios both kinds share run over [matrix, panel] x [not paging, paging]; the ones whose
   expectations differ are written as two explicit blocks - the difference is the point. */

interface IContractSourceOptions {
  kind: "not paging" | "paging";
  // paging only: false -> the answer carries no total; hasMore then says whether there is more.
  total?: boolean;
  hasMore?: boolean;
  keyed?: boolean;
  // paging only: the capabilities it declares instead of paging, filtering and sorting together.
  capabilities?: IDynamicDataSourceCapabilities;
}
/* One fake source for every scenario: synchronous answers, so the list and the questions stay
   synchronous with it, and the storage is what the assertions read. The records are named by "id"
   and insert assigns one; with keyed: false the source has no keyField and is read-only. */
class ContractSource implements IDynamicDataSource {
  // Reads of the whole storage (not paging) and reads of one page (paging).
  public readCount: number = 0;
  public pagedReadCount: number = 0;
  public skips: Array<number> = [];
  public ops: Array<string> = [];
  public keyField: string;
  public capabilities: IDynamicDataSourceCapabilities;
  /* true -> insert answers with a promise the test settles through releaseInserts(): a keyed insert
     whose key is not known yet. */
  public holdInserts: boolean = false;
  // A copy of every record insert received, before the key is assigned.
  public insertPayloads: Array<any> = [];
  private heldInserts: Array<() => void> = [];
  private nextKey: number = 1000;
  constructor(public records: Array<any>, private options: IContractSourceOptions) {
    // Keyed unless stated: a source without keyField is read-only.
    this.keyField = options.keyed === false ? undefined : "id";
    if (options.kind === "paging") {
      this.capabilities = options.capabilities || { paging: true, filtering: true, sorting: true };
    }
  }
  public get callCount(): number {
    return this.readCount + this.pagedReadCount;
  }
  public read(request: IDynamicDataReadRequest): Array<any> | IDynamicDataReadResult {
    if (this.options.kind !== "paging") {
      this.readCount++;
      return this.records.map(copy);
    }
    this.pagedReadCount++;
    this.skips.push(request.skip);
    const size = request.take > 0 ? request.take : this.records.length;
    const res: IDynamicDataReadResult = { records: this.records.slice(request.skip, request.skip + size).map(copy) };
    if (this.options.total !== false) res.total = this.records.length;
    if (this.options.hasMore) res.hasMore = request.skip + size < this.records.length;
    return res;
  }
  public insert(record: any, sourceIndex: number): any {
    this.ops.push("insert@" + sourceIndex);
    this.insertPayloads.push(copy(record));
    const stored = copy(record);
    if (!!this.keyField) stored[this.keyField] = this.nextKey++;
    const run = (): any => {
      this.records.splice(sourceIndex, 0, stored);
      return copy(stored);
    };
    if (!this.holdInserts) return run();
    return new Promise((resolve: (value: any) => void): void => {
      this.heldInserts.push((): void => resolve(run()));
    });
  }
  public releaseInserts(): void {
    const held = this.heldInserts;
    this.heldInserts = [];
    held.forEach((release: () => void): void => release());
  }
  public update(key: any, record: any): void {
    this.ops.push("update@" + key);
    const at = this.indexOfKey(key);
    if (at > -1)this.records[at] = copy(record);
  }
  public remove(key: any): void {
    this.ops.push("remove@" + key);
    const at = this.indexOfKey(key);
    if (at > -1)this.records.splice(at, 1);
  }
  public get ids(): Array<any> {
    return this.records.map((record: any): any => record.id);
  }
  private indexOfKey(key: any): number {
    if (!this.keyField) return key;
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i][this.keyField] === key) return i;
    }
    return -1;
  }
}
function copy(record: any): any {
  return Object.assign({}, record);
}
// The ids are not the positions, so that a write addressed by position cannot pass for one
// addressed by key. Record 0 has no name: the name is required.
function contractRecords(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    const record: any = { id: 100 + i };
    if (i > 0) record.name = "n" + i;
    res.push(record);
  }
  return res;
}
function range(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}
async function flush(times: number = 20): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

// What the scenarios do to a question, whatever its type.
interface IQuestionAdapter {
  name: string;
  create(source: ContractSource, pageSize: number, json?: any): { survey: SurveyModel, question: any };
  // The rows or the panels of the page: the instances the respondent sees.
  items(question: any): Array<any>;
  ids(question: any): Array<any>;
  add(question: any): void;
  remove(question: any, position: number): void;
  edit(question: any, position: number, field: string, value: any): void;
  visibleIndex(question: any, position: number): number;
  // The object creations a page change is allowed to make: one per record on the page.
  createSpy(): { calls: Array<any> };
}
const matrixAdapter: IQuestionAdapter = {
  name: "matrix",
  create: (source: ContractSource, pageSize: number, json?: any) => {
    const survey = new SurveyModel({ elements: [Object.assign({
      type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: pageSize,
      columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text", isRequired: true }]
    }, json)] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    question.dataSource = source;
    return { survey: survey, question: question };
  },
  items: (question: QuestionMatrixDynamicModel) => question.visibleRows,
  ids: (question: QuestionMatrixDynamicModel) => question.visibleRows.map(row => row.getQuestionByName("id").value),
  add: (question: QuestionMatrixDynamicModel) => { question.addRow(); },
  // position: on the page; removeRow takes a position in the whole view.
  remove: (question: QuestionMatrixDynamicModel, position: number) => { question.removeRow(question.pageIndex * question.pageSize + position, false); },
  edit: (question: QuestionMatrixDynamicModel, position: number, field: string, value: any) => {
    question.visibleRows[position].getQuestionByName(field).value = value;
  },
  visibleIndex: (question: QuestionMatrixDynamicModel, position: number) => question.getItemVisibleIndex(<any>question.visibleRows[position]),
  createSpy: () => vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "createMatrixRow").mock
};
const panelAdapter: IQuestionAdapter = {
  name: "panel",
  create: (source: ContractSource, pageSize: number, json?: any) => {
    const survey = new SurveyModel({ elements: [Object.assign({
      type: "paneldynamic", name: "q", panelCount: 0, panelsPerPage: pageSize,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }]
    }, json)] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.dataSource = source;
    return { survey: survey, question: question };
  },
  items: (question: QuestionPanelDynamicModel) => question.panels,
  ids: (question: QuestionPanelDynamicModel) => question.panels.map(panel => panel.getQuestionByName("id").value),
  add: (question: QuestionPanelDynamicModel) => { question.addPanel(); },
  // position: on the page; removePanel takes a position in the whole view.
  remove: (question: QuestionPanelDynamicModel, position: number) => { question.removePanel(question.pageIndex * question.pageSize + position); },
  edit: (question: QuestionPanelDynamicModel, position: number, field: string, value: any) => {
    question.panels[position].getQuestionByName(field).value = value;
  },
  visibleIndex: (question: QuestionPanelDynamicModel, position: number) => question.getItemVisibleIndex(<any>question.panels[position].data),
  createSpy: () => vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createNewPanel").mock
};
const adapters = [matrixAdapter, panelAdapter];
const namedAdapters: Array<[string, IQuestionAdapter]> = adapters.map((adapter: IQuestionAdapter): [string, IQuestionAdapter] => [adapter.name, adapter]);
const kinds: Array<"not paging" | "paging"> = ["not paging", "paging"];
const cases: Array<[string, "not paging" | "paging", IQuestionAdapter]> = [];
adapters.forEach((adapter: IQuestionAdapter): void => {
  kinds.forEach((kind: "not paging" | "paging"): void => { cases.push([adapter.name, kind, adapter]); });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each(cases)("Question source contract, shared: %s over a %s source", (_name: string, kind: "not paging" | "paging", adapter: IQuestionAdapter) => {
  // 5 records, 2 per page, the question on page 1: records 2 and 3.
  function createOnPage1(keyed: boolean = true): { survey: SurveyModel, question: any, source: ContractSource } {
    const source = new ContractSource(contractRecords(5), { kind: kind, keyed: keyed });
    const { survey, question } = adapter.create(source, 2);
    question.pageIndex = 1;
    return { survey: survey, question: question, source: source };
  }
  test("the page shows its records", () => {
    const { question } = createOnPage1();
    expect(adapter.ids(question), "#1").toEqual([102, 103]);
    question.pageIndex = 2;
    expect(adapter.ids(question), "#2: the last page").toEqual([104]);
    question.pageIndex = 0;
    expect(adapter.ids(question), "#3").toEqual([100, 101]);
  });
  test("a page change: the objects of the destination page and nothing else", () => {
    const { question, source } = createOnPage1();
    const created = adapter.createSpy();
    const readsBefore = source.readCount;
    const pagedReadsBefore = source.pagedReadCount;
    question.pageIndex = 0;
    expect(adapter.ids(question), "#1").toEqual([100, 101]);
    expect(created.calls.length, "#2: one object per record on the page").toBe(2);
    expect(source.readCount, "#3: the whole storage is never read again").toBe(readsBefore);
    expect(source.pagedReadCount - pagedReadsBefore, kind === "not paging"
      ? "#4: the list pages what it holds - no source call" : "#4: the source is asked for the page").toBe(kind === "not paging" ? 0 : 1);
  });
  test("remove on page 1 removes the record the respondent sees", () => {
    const { question, source } = createOnPage1();
    adapter.remove(question, 0);
    expect(source.ids, "#1: record 102 left the storage").toEqual([100, 101, 103, 104]);
    expect(source.ops, "#2: by its key").toEqual(["remove@102"]);
    expect(adapter.ids(question), "#3: the page is refilled").toEqual([103, 104]);
  });
  test("a source without keyField is read-only: an add, a remove and an edit are refused, reported and change nothing locally", () => {
    const { survey, question, source } = createOnPage1(false);
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    const ids = adapter.ids(question);
    const value = JSON.stringify(question.value);
    adapter.remove(question, 0);
    adapter.add(question);
    adapter.edit(question, 0, "name", "edited");
    expect(source.ops, "#1: the source got no write").toEqual([]);
    expect(source.ids, "#2: the storage is as it was").toEqual([100, 101, 102, 103, 104]);
    expect(errors, "#3: one report per refused call").toEqual(["remove", "insert", "update"]);
    expect(adapter.ids(question), "#4: the page is as it was").toEqual(ids);
    expect(adapter.items(question)[0].getQuestionByName("name").value, "#5: the object shows the stored value").toBe("n2");
    expect(JSON.stringify(question.value), "#6: the value is as it was").toBe(value);
  });
  test("add on page 1 shows the new record", () => {
    const { question, source } = createOnPage1();
    adapter.add(question);
    expect(source.records.length, "#1: one insert").toBe(6);
    expect(source.ops.filter(op => op.indexOf("insert") === 0).length, "#2").toBe(1);
    const ids = adapter.ids(question);
    expect(ids[ids.length - 1], "#3: the new record, with the key the source assigned, is the last object of the page shown").toBe(1000);
    expect(ids.filter(id => id >= 1000).length, "#4: and the only new one").toBe(1);
  });
  test("getItemVisibleIndex counts the whole list, not the page", () => {
    const { question } = createOnPage1();
    expect(adapter.visibleIndex(question, 0), "#1").toBe(2);
    expect(adapter.visibleIndex(question, 1), "#2").toBe(3);
  });
  test("a single edit keeps every object on the page", () => {
    const { question, source } = createOnPage1();
    const before = [].concat(adapter.items(question));
    const callsBefore = source.callCount;
    adapter.edit(question, 0, "name", "edited");
    const after = adapter.items(question);
    expect(after.length, "#1").toBe(before.length);
    before.forEach((item: any, i: number) => {
      expect(after[i] === item, "#2: the object at " + i + " is the same instance").toBe(true);
    });
    expect(source.records[2].name, "#3: the edit reached the storage").toBe("edited");
    expect(source.callCount, "#4: no read").toBe(callsBefore);
  });
});

describe.each(namedAdapters)("Question source contract, not paging: the list pages - %s", (_name: string, adapter: IQuestionAdapter) => {
  function create(json?: any): { survey: SurveyModel, question: any, source: ContractSource } {
    const source = new ContractSource(contractRecords(5), { kind: "not paging" });
    const { survey, question } = adapter.create(source, 2, json);
    return { survey: survey, question: question, source: source };
  }
  test("layer 2: an edited page is validated after a page change from code", () => {
    const { survey, question, source } = create();
    adapter.edit(question, 1, "name", "edited");
    question.pageIndex = 1;
    expect(adapter.ids(question), "#1").toEqual([102, 103]);
    const callsBefore = source.callCount;
    expect(survey.tryComplete(), "#2: record 0 on the edited page is empty").toBe(false);
    expect(question.pageIndex, "#3: the question shows the page with the error").toBe(0);
    expect(adapter.ids(question), "#4").toEqual([100, 101]);
    expect(source.callCount, "#5: every record is in memory, nothing is read").toBe(callsBefore);
  });
  test("layer 2, the negative case: an untouched page is not validated", () => {
    const { survey, question } = create();
    question.pageIndex = 1;
    // Record 0 is empty and its page was never edited: layer 2 visits edited pages only,
    // so it is not walked - validating every page is a design decision, not this contract.
    expect(survey.tryComplete(), "#1").toBe(true);
  });
  test("progress counts every visible record", () => {
    const { question } = create();
    question.pageIndex = 1;
    const info = question.getProgressInfo();
    expect(info.questionCount, "#1: 5 records x 2 inputs").toBe(10);
    expect(info.answeredQuestionCount, "#2: record 0 has no name").toBe(9);
  });
  test("add on page 1 is appended to the storage and the question shows its page", () => {
    const { question, source } = create();
    question.pageIndex = 1;
    adapter.add(question);
    expect(source.ops, "#1: at the end of the storage").toEqual(["insert@5"]);
    expect(question.pageIndex, "#2: the page of the new record").toBe(2);
    expect(adapter.ids(question), "#3: the new record has the key the source assigned").toEqual([104, 1000]);
  });
});

describe("Question source contract: the last entry and the visible panel count", () => {
  test("matrix copyDefaultValueFromLastEntry: the last record of a storage that is not paged, the last of a paged window", () => {
    const readSource = new ContractSource(contractRecords(5), { kind: "not paging" });
    const read = matrixAdapter.create(readSource, 2, { copyDefaultValueFromLastEntry: true }).question;
    read.addRow();
    expect(readSource.records[5], "#1: copied from record 4, on another page; the source assigned the key").toEqual({ id: 1000, name: "n4" });
    const rangeSource = new ContractSource(contractRecords(5), { kind: "paging" });
    const ranged = matrixAdapter.create(rangeSource, 2, { copyDefaultValueFromLastEntry: true }).question;
    ranged.addRow();
    expect(rangeSource.records[2], "#2: record 2 is on the server - the window's last record is copied").toEqual({ id: 1000, name: "n1" });
  });
  test("panel visiblePanelCount of a source without paging leaves out the filtered records", () => {
    const source = new ContractSource(contractRecords(5), { kind: "not paging" });
    const question = <QuestionPanelDynamicModel>panelAdapter.create(source, 2, { displayMode: "carousel" }).question;
    question.filterExpression = "{id} > 102";
    expect(question.visiblePanelCount, "#1: records 103 and 104").toBe(2);
    expect(question["dataList"].visibleCount, "#2").toBe(2);
  });
});

describe("Question source contract, not paging: the matrix answers for every record", () => {
  test("display value and getFilteredData cover every record, not the page", () => {
    const source = new ContractSource(contractRecords(5), { kind: "not paging" });
    const { question } = matrixAdapter.create(source, 2);
    question.pageIndex = 1;
    const callsBefore = source.callCount;
    expect(question.displayValue.length, "#1").toBe(5);
    expect(question.displayValue[4], "#2: a record of another page").toEqual({ id: 104, name: "n4" });
    expect(question.getFilteredData().length, "#3").toBe(5);
    expect(source.callCount, "#4").toBe(callsBefore);
  });
});

describe.each(namedAdapters)("Question source contract, paging: the source pages - %s", (_name: string, adapter: IQuestionAdapter) => {
  function create(): { survey: SurveyModel, question: any, source: ContractSource } {
    const source = new ContractSource(contractRecords(5), { kind: "paging" });
    const { survey, question } = adapter.create(source, 2);
    return { survey: survey, question: question, source: source };
  }
  test("layer 2 is off: tryComplete reads nothing", () => {
    const { survey, question, source } = create();
    adapter.edit(question, 1, "name", "edited");
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    // Record 0 is on the server: validating it would mean reading its page, which is never done.
    expect(survey.tryComplete(), "#1: only the window is validated").toBe(true);
    expect(source.pagedReadCount, "#2: no read").toBe(readsBefore);
  });
  test("progress counts the window", () => {
    const { question, source } = create();
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    const info = question.getProgressInfo();
    expect(info.questionCount, "#1: 2 records x 2 inputs").toBe(4);
    expect(info.answeredQuestionCount, "#2").toBe(4);
    expect(source.pagedReadCount, "#3").toBe(readsBefore);
  });
  test("add on page 1 is inserted in the window", () => {
    const { question, source } = create();
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    adapter.add(question);
    expect(source.ops, "#1: behind the window").toEqual(["insert@4"]);
    expect(question.pageIndex, "#2: the page in force").toBe(1);
    expect(adapter.ids(question), "#3: the new record has the key the source assigned").toEqual([102, 103, 1000]);
    expect(source.pagedReadCount, "#4").toBe(readsBefore);
  });
});

describe("Question source contract, paging: the matrix answers for its window", () => {
  test("display value and getFilteredData cover the window", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging" });
    const { question } = matrixAdapter.create(source, 2);
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    expect(question.displayValue.length, "#1").toBe(2);
    expect(question.getFilteredData().length, "#2").toBe(2);
    expect(source.pagedReadCount, "#3").toBe(readsBefore);
  });
});

describe.each(namedAdapters)("Question source contract, paging: a total that changes - %s", (_name: string, adapter: IQuestionAdapter) => {
  test("a reported total that shrinks: the last page of it is shown, not an empty one", () => {
    const source = new ContractSource(contractRecords(25), { kind: "paging" });
    const { question } = adapter.create(source, 10);
    question.pageIndex = 2;
    expect(adapter.ids(question), "#1").toEqual(range(120, 124));
    source.records = contractRecords(15);
    source.skips = [];
    question.refreshView();
    expect(question.pageIndex, "#2").toBe(1);
    expect(question.pageCount, "#3").toBe(2);
    expect(adapter.ids(question), "#4: records 10-14").toEqual(range(110, 114));
    expect(source.skips, "#5").toEqual([20, 10]);
  });
  test("a discovered total and a source that grew: hasMore true reaches the new pages", () => {
    const source = new ContractSource(contractRecords(20), { kind: "paging", total: false, hasMore: true });
    const { question } = adapter.create(source, 10);
    question.pageIndex = 1;
    expect(question.pageCount, "#1: the end was found").toBe(2);
    source.records = contractRecords(30);
    question.refreshView();
    expect(question.pageCount, "#2: one more page is known to exist").toBe(3);
    question.pageIndex = 2;
    expect(question.pageIndex, "#3").toBe(2);
    expect(adapter.ids(question), "#4").toEqual(range(120, 129));
  });
});

describe("Question source contract, paging: the page between the two reads of a shrink", () => {
  test("the pager shows the window in force until the retry commits", async () => {
    const records = contractRecords(25);
    const held: Array<() => void> = [];
    let holdReads = false;
    const source: IDynamicDataSource = {
      capabilities: { paging: true, filtering: true, sorting: true },
      read: (request: IDynamicDataReadRequest): any => {
        const res = { records: records.slice(request.skip, request.skip + request.take).map(copy), total: records.length };
        if (!holdReads) return res;
        return new Promise((resolve: (value: any) => void): void => { held.push((): void => resolve(res)); });
      }
    };
    const { question } = matrixAdapter.create(<any>source, 10);
    question.pageIndex = 2;
    records.splice(15);
    holdReads = true;
    question.refreshView();
    held.shift()();
    await flush();
    // The empty answer was not committed: the retry is in flight, the rows are the window in force
    // and the pager still describes it - no pageChanged was raised for the clamp.
    expect(held.length, "#1: the retry was issued").toBe(1);
    expect(question.isDataLoading, "#2").toBe(true);
    expect(question.pageIndex, "#3").toBe(2);
    expect(question.pageCount, "#4").toBe(3);
    expect(matrixAdapter.ids(question), "#5").toEqual(range(120, 124));
    held.shift()();
    await flush();
    expect(question.isDataLoading, "#6").toBe(false);
    expect(question.pageIndex, "#7").toBe(1);
    expect(question.pageCount, "#8").toBe(2);
    expect(matrixAdapter.ids(question), "#9").toEqual(range(110, 114));
  });
});

describe.each(namedAdapters)("Question source contract, paging: a shrink whose retry fails - %s", (_name: string, adapter: IQuestionAdapter) => {
  test("the rows and the pager stay on the window in force, and Previous reads the page before it", async () => {
    const records = contractRecords(25);
    const skips: Array<number> = [];
    const failAt: Array<number> = [];
    const source: IDynamicDataSource = {
      capabilities: { paging: true, filtering: true, sorting: true },
      read: (request: IDynamicDataReadRequest): any => {
        skips.push(request.skip);
        if (failAt.indexOf(request.skip) > -1) return Promise.reject(new Error("the retry failed"));
        return Promise.resolve({ records: records.slice(request.skip, request.skip + request.take).map(copy), total: records.length });
      }
    };
    const { survey, question } = adapter.create(<any>source, 10);
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    await flush();
    question.pageIndex = 2;
    await flush();
    records.splice(15);
    failAt.push(10);
    skips.length = 0;
    question.refreshView();
    await flush();
    expect(skips, "#1: the empty page and the retry").toEqual([20, 10]);
    expect(errors, "#2").toEqual(["read"]);
    expect(question.pageIndex, "#3").toBe(2);
    expect(question["dataList"].pageIndex, "#4: the list agrees with the pager").toBe(2);
    expect(adapter.ids(question), "#5: the window in force").toEqual(range(120, 124));
    failAt.length = 0;
    skips.length = 0;
    expect(question.prevPage(), "#6").toBe(true);
    await flush();
    expect(skips, "#7: Previous is read").toEqual([10]);
    expect(question.pageIndex, "#8").toBe(1);
    expect(adapter.ids(question), "#9").toEqual(range(110, 114));
  });
});

/* A source without paging that is read again may bring the edited records back
   at other indexes. Layer 2 follows them - by key when the source names its records, by content
   otherwise - and replacing the source starts over. */
describe.each(namedAdapters)("Question source contract, not paging: a read that commits again - %s", (_name: string, adapter: IQuestionAdapter) => {
  function namedRecords(count: number): Array<any> {
    const res = contractRecords(count);
    res[0].name = "n0";
    return res;
  }
  function createEdited(keyed: boolean): { survey: SurveyModel, question: any, source: ContractSource } {
    const source = new ContractSource(namedRecords(6), { kind: "not paging", keyed: keyed });
    const { survey, question } = adapter.create(source, 2);
    // The required field of record 0 is cleared, and its page is left from code: layer 2 holds it.
    adapter.edit(question, 0, "name", "");
    question.pageIndex = 1;
    expect(adapter.ids(question), "page 1").toEqual([102, 103]);
    return { survey: survey, question: question, source: source };
  }
  test("a record moved by another writer: the edited record is validated where it is now", () => {
    const { survey, question, source } = createEdited(true);
    const record = source.records.splice(0, 1)[0];
    source.records.splice(5, 0, record);
    question.refreshDataSource();
    expect(adapter.ids(question), "#1: the refreshed page").toEqual([103, 104]);
    expect(survey.tryComplete(), "#2: record 100 is invalid wherever it is").toBe(false);
    expect(question.pageIndex, "#3: its page is shown").toBe(2);
    expect(adapter.ids(question), "#4").toEqual([105, 100]);
  });
  test("a keyed source reordered at will: the edited record is found by its key", () => {
    const { survey, question, source } = createEdited(true);
    // Reversed and one record added in front: the content comparison could not place record 100,
    // the key does.
    source.records.reverse();
    source.records.unshift({ id: 200, name: "new" });
    question.refreshDataSource();
    expect(source.ids, "#1").toEqual([200, 105, 104, 103, 102, 101, 100]);
    expect(survey.tryComplete(), "#2").toBe(false);
    expect(question.pageIndex, "#3: the last page holds record 100").toBe(3);
    expect(adapter.ids(question), "#4").toEqual([100]);
  });
  test("a keyed source that deleted the edited record: nothing is left to validate", () => {
    const { survey, question, source } = createEdited(true);
    source.records.splice(0, 1);
    question.refreshDataSource();
    expect(survey.tryComplete(), "#1: the record is gone").toBe(true);
  });
  test("a refresh that changed nothing keeps the edited record where it was", () => {
    const { survey, question } = createEdited(true);
    question.refreshDataSource();
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(question.pageIndex, "#2").toBe(0);
  });
  test("another source: the edited records of the old one are dropped", () => {
    const { survey, question } = createEdited(true);
    question.dataSource = new ContractSource(namedRecords(6), { kind: "not paging" });
    expect(adapter.ids(question), "#1: the page index is kept, the records are the new source's").toEqual([102, 103]);
    expect(survey.tryComplete(), "#2: record 0 of the new source was never edited").toBe(true);
  });
});

/* A new record's identity. The source assigns the key: a key the new record carries - copied
   from the last entry, or put on a default value - never reaches insert, never survives the answer,
   and never addresses a write while the insert is in flight. Records 100, 101 ("n1") and 102 ("n2"),
   one page; the new item is at position 3. */
describe.each(namedAdapters)("Question source contract, keyed insert: %s", (_name: string, adapter: IQuestionAdapter) => {
  function create(json?: any): { survey: SurveyModel, question: any, source: ContractSource, errors: Array<string> } {
    const source = new ContractSource(contractRecords(3), { kind: "paging", keyed: true });
    const { survey, question } = adapter.create(source, 5, json);
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation + ":" + options.error.message); });
    return { survey: survey, question: question, source: source, errors: errors };
  }
  const noKeyYet = (operation: string): string => operation + ":DynamicDataList: the record has no key yet";
  test("copyDefaultValueFromLastEntry does not copy the key", () => {
    const { question, source } = create({ copyDefaultValueFromLastEntry: true });
    adapter.add(question);
    expect(source.insertPayloads.length, "#1").toBe(1);
    expect("id" in source.insertPayloads[0], "#2: the payload has no key").toBe(false);
    expect(source.insertPayloads[0].name, "#3: the rest is copied").toBe("n2");
    expect(source.records[3].id, "#4: the stored record has the assigned key").toBe(1000);
    expect(question["dataList"].getRecord(3).id, "#5: and so has the window").toBe(1000);
    adapter.edit(question, 3, "name", "edited");
    expect(source.ops, "#6: the edit addresses the new record").toEqual(["insert@3", "update@1000"]);
    expect(source.records[2], "#7: the record whose key was copied is unchanged").toEqual({ id: 102, name: "n2" });
    expect(source.records[3].name, "#8").toBe("edited");
  });
  test("an edit before the answer does not address the copied record", async () => {
    const { question, source, errors } = create({ copyDefaultValueFromLastEntry: true });
    source.holdInserts = true;
    adapter.add(question);
    adapter.edit(question, 3, "name", "typed");
    source.releaseInserts();
    await flush();
    expect(source.ops.indexOf("update@102"), "#1: never the copied key").toBe(-1);
    expect(source.ops, "#2: the edit waited for the key").toEqual(["insert@3", "update@1000"]);
    expect(errors, "#3").toEqual([]);
    expect(source.records[2], "#4").toEqual({ id: 102, name: "n2" });
    expect(source.records[3], "#5: the typed value under the assigned key").toEqual({ id: 1000, name: "typed" });
  });
  test("a key in the default value does not reach insert", () => {
    const json = adapter.name === "matrix"
      ? { defaultRowValue: { id: 5, name: "x" } } : { defaultPanelValue: { id: 5, name: "x" } };
    const { question, source } = create(json);
    adapter.add(question);
    expect("id" in source.insertPayloads[0], "#1").toBe(false);
    expect(source.records[3], "#2: the assigned key, not 5").toEqual({ id: 1000, name: "x" });
  });
  test("a field cleared before the insert answers stays cleared", async () => {
    const { question, source } = create({ copyDefaultValueFromLastEntry: true });
    source.holdInserts = true;
    adapter.add(question);
    expect(question["dataList"].getRecord(3).name, "#1: copied").toBe("n2");
    adapter.edit(question, 3, "name", "");
    source.releaseInserts();
    await flush();
    const record = question["dataList"].getRecord(3);
    expect(record.id, "#2: the key landed").toBe(1000);
    expect("name" in record, "#3: the cleared field did not come back").toBe(false);
    expect("name" in source.records[3], "#4: nor in the record the queued update stored").toBe(false);
  });
  test("a key written into a pending item is not used as its key", async () => {
    const { question, source, errors } = create();
    source.holdInserts = true;
    adapter.add(question);
    adapter.edit(question, 3, "id", 101);
    adapter.edit(question, 3, "name", "typed");
    adapter.remove(question, 3);
    source.releaseInserts();
    await flush();
    expect(source.ops.filter(op => op.indexOf("@101") > -1), "#1: nothing addressed the injected key").toEqual([]);
    expect(source.records[1], "#2: the record that owns it is unchanged").toEqual({ id: 101, name: "n1" });
    expect(errors, "#3").toEqual([]);
    expect(source.ops, "#4: every write waited for the assigned key")
      .toEqual(["insert@3", "update@1000", "update@1000", "remove@1000"]);
    expect(source.ids, "#5: the new record is gone").toEqual([100, 101, 102]);
  });
  test("two edits before the answer are both sent, in order", async () => {
    const { question, source, errors } = create();
    source.holdInserts = true;
    adapter.add(question);
    adapter.edit(question, 3, "name", "a");
    adapter.edit(question, 3, "name", "b");
    source.releaseInserts();
    await flush();
    expect(source.ops, "#1").toEqual(["insert@3", "update@1000", "update@1000"]);
    expect(source.records[3], "#2").toEqual({ id: 1000, name: "b" });
    expect(errors, "#3").toEqual([]);
  });
});

/* A paging source declares what it does with the view. A filter or a sort it has not declared is run
   by the list over the whole storage, which the source is read for while that part is set. */
describe.each(namedAdapters)("Question source contract, paging without a declared view - %s", (_name: string, adapter: IQuestionAdapter) => {
  function createPagingOnly(): { survey: SurveyModel, question: any, source: ContractSource, errors: Array<string> } {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true } });
    const { survey, question } = adapter.create(source, 2);
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    return { survey: survey, question: question, source: source, errors: errors };
  }
  test("it reads normally while no view is set", () => {
    const { question, source, errors } = createPagingOnly();
    question.pageIndex = 1;
    expect(adapter.ids(question), "#1").toEqual([102, 103]);
    expect(source.skips, "#2").toEqual([0, 2]);
    expect(errors, "#3").toEqual([]);
  });
  test("a sort set from code reads the whole storage once and the question pages the sorted records; clearing it shows the server page again", () => {
    const { question, source, errors } = createPagingOnly();
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    question.sortBy = "id-";
    expect(source.pagedReadCount, "#1: one read").toBe(readsBefore + 1);
    expect(question["dataList"].isPagedBySource, "#2: of the whole storage").toBe(false);
    expect(question["dataList"].loadedCount, "#3").toBe(5);
    expect(errors, "#4").toEqual([]);
    expect(question.pageIndex, "#5: a sort keeps the page").toBe(1);
    expect(adapter.ids(question), "#6: sorted, paged by the question").toEqual([102, 101]);
    question.pageIndex = 2;
    expect(source.pagedReadCount, "#7: the page is cut from the whole storage").toBe(readsBefore + 1);
    expect(adapter.ids(question), "#8").toEqual([100]);
    question.sortBy = "";
    expect(source.pagedReadCount, "#9: the source pages again").toBe(readsBefore + 2);
    expect(source.skips[source.skips.length - 1], "#10: the page the sort kept").toBe(4);
    expect(question["dataList"].isPagedBySource, "#11").toBe(true);
    expect(adapter.ids(question), "#12: the server page").toEqual([104]);
    expect(errors, "#13").toEqual([]);
  });
  test("the records edited in the whole storage of a sort are not carried onto the page that replaces it", () => {
    const { question, errors } = createPagingOnly();
    const editedRecords = (): Array<number> => question._pageValidation.editedRecords;
    question.sortBy = "id-";
    question.pageIndex = 1;
    adapter.edit(question, 0, "name", "");
    question.pageIndex = 0;
    expect(editedRecords(), "#1: record 102, off the page and not validated").toEqual([2]);
    question.sortBy = "";
    expect(adapter.ids(question), "#2: the server page").toEqual([100, 101]);
    expect(editedRecords(), "#3: an index of the whole storage names nothing on a page").toEqual([]);
    question.sortBy = "id-";
    expect(editedRecords(), "#4: nothing is remapped into the next whole storage").toEqual([]);
    expect(errors, "#5").toEqual([]);
  });
  test("a sort in the JSON: the first read is the whole storage", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true } });
    const { survey, question } = adapter.create(source, 2, { sortBy: "id-" });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    expect(source.pagedReadCount, "#1").toBe(1);
    expect(question["dataList"].isPagedBySource, "#2").toBe(false);
    expect(adapter.ids(question), "#3").toEqual([104, 103]);
    expect(errors, "#4").toEqual([]);
  });
  test("a filter set from code reads the whole storage once and the question pages the matches; clearing it shows the server page again", () => {
    const { question, source, errors } = createPagingOnly();
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    question.filterExpression = "{id} > 100";
    expect(source.pagedReadCount, "#1: one read").toBe(readsBefore + 1);
    expect(question["dataList"].isPagedBySource, "#2: of the whole storage").toBe(false);
    expect(question["dataList"].loadedCount, "#3").toBe(5);
    expect(errors, "#4").toEqual([]);
    expect(question.pageIndex, "#5: the filter resets the page").toBe(0);
    expect(adapter.ids(question), "#6: the matches, paged by the question").toEqual([101, 102]);
    question.pageIndex = 1;
    expect(source.pagedReadCount, "#7: the page is cut from the whole storage").toBe(readsBefore + 1);
    expect(adapter.ids(question), "#8").toEqual([103, 104]);
    question.filterExpression = "";
    expect(source.pagedReadCount, "#9: the source pages again").toBe(readsBefore + 2);
    expect(source.skips[source.skips.length - 1], "#10").toBe(0);
    expect(question["dataList"].isPagedBySource, "#11").toBe(true);
    expect(adapter.ids(question), "#12: the server page").toEqual([100, 101]);
    expect(errors, "#13").toEqual([]);
  });
  test("the records edited in the whole storage are not carried onto the page that replaces it", () => {
    const { question, errors } = createPagingOnly();
    const editedRecords = (): Array<number> => question._pageValidation.editedRecords;
    question.filterExpression = "{id} > 100";
    question.pageIndex = 1;
    adapter.edit(question, 0, "name", "");
    question.pageIndex = 0;
    expect(editedRecords(), "#1: record 103, off the page and not validated").toEqual([3]);
    question.filterExpression = "";
    expect(adapter.ids(question), "#2: the server page").toEqual([100, 101]);
    expect(editedRecords(), "#3: an index of the whole storage names nothing on a page").toEqual([]);
    question.filterExpression = "{id} > 100";
    expect(editedRecords(), "#4: nothing is remapped into the next whole storage").toEqual([]);
    expect(errors, "#5").toEqual([]);
  });
  test("a source assigned while a sort it cannot run is set is read whole; a source that sorts gets the sort", () => {
    const { survey, question } = adapter.create(undefined, 2, { sortBy: "id-" });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    const pagingOnly = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true } });
    question.dataSource = pagingOnly;
    expect(pagingOnly.pagedReadCount, "#1: one read").toBe(1);
    expect(adapter.ids(question), "#2: sorted here").toEqual([104, 103]);
    const sorting = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true, sorting: true } });
    question.dataSource = sorting;
    expect(sorting.pagedReadCount, "#3").toBe(1);
    expect(adapter.ids(question), "#4: the source sorts on its side").toEqual([100, 101]);
    expect(errors, "#5").toEqual([]);
  });
});

/* A header sort runs whatever the source declares: the list sorts the records it holds, a paging
   source that sorts gets the sort in its page reads, and one that cannot sort is read whole while the
   sort is set. A header click is a move the respondent makes, so the page is validated first. */
describe("Question source contract: header sort", () => {
  function createSortableMatrix(source: ContractSource): { survey: SurveyModel, question: QuestionMatrixDynamicModel, errors: Array<string> } {
    const { survey, question } = matrixAdapter.create(source, 2, { allowSortRows: true });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    return { survey: survey, question: question, errors: errors };
  }
  function sortableColumns(question: QuestionMatrixDynamicModel): Array<boolean> {
    return question.columns.map(column => column.isSortable);
  }
  test("matrix, a paging source without sorting: every column is sortable and a header click sorts the whole storage", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true, filtering: true } });
    const { question, errors } = createSortableMatrix(source);
    expect(sortableColumns(question), "#1").toEqual([true, true]);
    // The page is shown: the click validates the rows on display.
    expect(matrixAdapter.ids(question), "#2").toEqual([100, 101]);
    let readsBefore = source.pagedReadCount;
    // Record 100 has no name, and the name is required: the click validates the page and stops.
    expect(question.toggleSort("id"), "#3: the page is validated first").toBe(false);
    expect(source.pagedReadCount, "#4: no request").toBe(readsBefore);
    expect(question.visibleRows[0].getQuestionByName("name").errors.length, "#5").toBe(1);
    question.pageIndex = 1;
    readsBefore = source.pagedReadCount;
    expect(question.toggleSort("id"), "#6").toBe(true);
    expect(source.pagedReadCount, "#7: the whole storage is read").toBe(readsBefore + 1);
    expect(question["dataList"].isPagedBySource, "#8").toBe(false);
    expect(question.sortBy, "#9").toBe("id");
    expect(matrixAdapter.ids(question), "#10").toEqual([102, 103]);
    expect(question.toggleSort("id"), "#11").toBe(true);
    expect(source.pagedReadCount, "#12: descending is sorted here").toBe(readsBefore + 1);
    expect(matrixAdapter.ids(question), "#13").toEqual([102, 101]);
    expect(question.toggleSort("id"), "#14").toBe(true);
    expect(question.sortBy, "#15").toBe("");
    expect(source.pagedReadCount, "#16: not sorted, the server page is read").toBe(readsBefore + 2);
    expect(question["dataList"].isPagedBySource, "#17").toBe(true);
    expect(matrixAdapter.ids(question), "#18").toEqual([102, 103]);
    expect(errors, "#19").toEqual([]);
  });
  test("matrix, a paging source with sorting: the columns are sortable and a header click reads the sorted page", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true, sorting: true } });
    const { question, errors } = createSortableMatrix(source);
    question.pageIndex = 1;
    expect(sortableColumns(question), "#1").toEqual([true, true]);
    const readsBefore = source.pagedReadCount;
    expect(question.toggleSort("id"), "#2").toBe(true);
    expect(source.pagedReadCount, "#3: the sorted page is read").toBe(readsBefore + 1);
    expect(question.sortBy, "#4").toBe("id");
    expect(errors, "#5").toEqual([]);
  });
  test("matrix, a source without paging and without sorting: the list sorts, so the columns are sortable", () => {
    const source = new ContractSource(contractRecords(5), { kind: "not paging" });
    const { question } = createSortableMatrix(source);
    question.pageIndex = 1;
    expect(sortableColumns(question), "#1").toEqual([true, true]);
    expect(question.toggleSort("id"), "#2").toBe(true);
    expect(question.toggleSort("id"), "#3").toBe(true);
    expect(question.sortBy, "#4").toBe("id-");
    expect(matrixAdapter.ids(question), "#5: sorted here, descending").toEqual([102, 101]);
  });
  test("matrix, a paging source that can neither filter nor sort: under a filter a header click sorts the whole storage in force", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true } });
    const { question, errors } = createSortableMatrix(source);
    question.filterExpression = "{id} > 100";
    expect(question["dataList"].isPagedBySource, "#1: the whole storage is in force").toBe(false);
    const readsBefore = source.pagedReadCount;
    expect(question.toggleSort("id"), "#2").toBe(true);
    expect(question.toggleSort("id"), "#3").toBe(true);
    expect(source.pagedReadCount, "#4: nothing is read").toBe(readsBefore);
    expect(matrixAdapter.ids(question), "#5").toEqual([104, 103]);
    question.filterExpression = "";
    expect(source.pagedReadCount, "#6: the sort keeps the whole storage").toBe(readsBefore);
    expect(matrixAdapter.ids(question), "#7").toEqual([104, 103]);
    expect(errors, "#8").toEqual([]);
  });
  test("matrix, a source that filters but cannot sort, with a filter only the source can run", () => {
    FunctionFactory.Instance.register("contractSortFallbackAsync", (): any => true, true);
    try {
      const asyncFilter = "contractSortFallbackAsync({id}) = true";
      const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true, filtering: true } });
      const { question, errors } = createSortableMatrix(source);
      question.filterExpression = asyncFilter;
      expect(question.filterExpression, "#1: the source runs it").toBe(asyncFilter);
      expect(errors, "#2").toEqual([]);
      // Page 1 holds no record with an empty required name, so the click passes the page validation.
      question.pageIndex = 1;
      const readsBefore = source.pagedReadCount;
      expect(question.toggleSort("id"), "#3: the click passes the page validation").toBe(true);
      expect(source.pagedReadCount, "#4: the sorted read is refused, nothing is sent").toBe(readsBefore);
      expect(errors, "#5").toEqual(["read"]);
      expect(question.filterExpression, "#6: the filter is kept").toBe(asyncFilter);
      expect(matrixAdapter.ids(question), "#7: the page in force").toEqual([102, 103]);
      question.sortBy = "";
      expect(source.pagedReadCount, "#8: clearing the sort reads the filtered page").toBe(readsBefore + 1);
      question.filterExpression = "";
      question.sortBy = "id-";
      expect(question["dataList"].isPagedBySource, "#9: the whole storage is in force").toBe(false);
      question.filterExpression = asyncFilter;
      expect(question.filterExpression, "#10: the list has to run it and cannot, so it is dropped").toBe("");
      expect(errors, "#11").toEqual(["read", "read"]);
      expect(matrixAdapter.ids(question), "#12: sorted, unfiltered").toEqual([104, 103]);
    } finally {
      FunctionFactory.Instance.unregister("contractSortFallbackAsync");
    }
  });
  test("matrix in design mode, or without a list, keeps the header click", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true } });
    const { survey, question } = createSortableMatrix(source);
    survey.setDesignMode(true);
    expect(question.toggleSort("id"), "#1: design mode stores the sort").toBe(true);
    expect(question.sortBy, "#2").toBe("id");
    const standalone = new QuestionMatrixDynamicModel("m");
    standalone.allowSortRows = true;
    standalone.addColumn("col1");
    expect((<any>standalone)._dataList, "#3: no list yet").toBeUndefined();
    expect(standalone.columns[0].isSortable, "#4").toBe(true);
    expect(standalone.toggleSort("col1"), "#5").toBe(true);
    expect(standalone.sortBy, "#6").toBe("col1");
  });
  test("panel, a paging source without sorting: toggleSort sorts the whole storage", () => {
    const source = new ContractSource(contractRecords(5), { kind: "paging", capabilities: { paging: true } });
    const { survey, question } = panelAdapter.create(source, 2);
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_: any, options: any) => { errors.push(options.operation); });
    question.pageIndex = 1;
    const readsBefore = source.pagedReadCount;
    expect(question.toggleSort("id"), "#1").toBe(true);
    expect(question.toggleSort("id"), "#2").toBe(true);
    expect(source.pagedReadCount, "#3: one read of the whole storage").toBe(readsBefore + 1);
    expect(question.sortBy, "#4").toBe("id-");
    expect(panelAdapter.ids(question), "#5").toEqual([102, 101]);
    expect(errors, "#6").toEqual([]);
  });
});
