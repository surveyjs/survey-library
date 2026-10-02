import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { Question } from "../../src/question";
import { QuestionMatrixDropdownRenderedTable } from "../../src/question_matrixdropdownrendered";
import { SurveyElement } from "../../src/survey-element";
import { settings } from "../../src/settings";
import { IDynamicDataPageState } from "../../src/dynamic-data/dynamic-data-page-validation";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import { Operand } from "../../src/expressions/expressions";
import { FunctionFactory } from "../../src/functionsfactory";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSort, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";
import { ArrayDynamicDataSource, SurveyDataDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";

// The edited set and the page the page validation keeps for a records question have no public face.
const getPageState = (q: Question): IDynamicDataPageState => (<any>q).dynamicData.getPageState();

class Deferred {
  public promise: Promise<any>;
  public resolve: (value?: any) => void;
  public reject: (error?: any) => void;
  constructor() {
    this.promise = new Promise<any>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
// Lets the queued microtasks run; no timers are involved anywhere in the list or the questions.
async function flush(times: number = 20): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

/* The translation recipe a real remote source follows, demonstrated for one operator. The list hands
   over the filter as the expression text it was given - it never parses it - so the source parses it
   with the library's own parser and re-renders the operand tree in its own dialect through
   Operand.toString(callback): the callback answers for the nodes the source knows and returns
   undefined for the rest, which then keep the library rendering. The dialect here is a toy one,
   `field eq "value"`, and only "=" is translated. */
function renderNode(op: any): string {
  const type = op.getType();
  if (type === "variable") return op.variable;
  if (type === "const") return JSON.stringify(op.correctValue);
  if (type === "binary" && op.operator === "equal") {
    return op.leftOperand.toString(renderNode) + " eq " + op.rightOperand.toString(renderNode);
  }
  return undefined;
}
export function translateFilterToDialect(expression: string): string {
  const operand: Operand = new ConditionsParser().parseExpression(expression);
  return !!operand ? operand.toString(renderNode) : "";
}
// The other half of the recipe: the dialect the source produced is what it runs. `field eq "value"`.
function dialectToPredicate(dialect: string): (record: any) => boolean {
  const parts = /^\(?\s*([\w-]+)\s+eq\s+(.+?)\s*\)?$/.exec(dialect);
  if (!parts) return (): boolean => true;
  const field = parts[1];
  const value = JSON.parse(parts[2]);
  return (record: any): boolean => record[field] === value;
}

interface IServerCall {
  op: string;
  args: Array<any>;
  settle: () => void;
  fail: (error: any) => void;
  isSettled: boolean;
}

/* An in-memory table behind promises, with every capability switchable by leaving its method off the
   instance - which is how IDynamicDataSource declares capabilities. Every call is recorded with its
   arguments, and with auto = false a call stays pending until the test settles it by hand. */
class FakeServerSource implements IDynamicDataSource {
  public calls: Array<IServerCall> = [];
  public auto: boolean = true;
  // false -> the server cannot count the matching records cheaply and answers without a total.
  public reportTotal: boolean = true;
  public readRange?: (request: IDynamicDataReadRequest) => Promise<IDynamicDataReadResult>;
  /* Set -> the server names its records by this field instead of by their position, which is what a
     server whose table changes under the grid has to do. Every write below then looks the record up
     by its key, and insert assigns one. */
  public keyField?: string;
  // false -> insert answers with nothing, which is what a source that ignores the return contract
  // does: the list then never learns the key of the new record.
  public insertAnswersRecord: boolean = true;
  // Fields the server fills in on insert where the payload does not carry them.
  public insertDefaults: any = undefined;
  private nextKey: number = 1000;
  public insert?: (record: any, sourceIndex: number) => Promise<any>;
  public update?: (key: any, record: any, changedFields: Array<string>) => Promise<void>;
  public remove?: (key: any) => Promise<void>;
  public move?: (key: any, toSourceIndex: number) => Promise<void>;

  constructor(public records: Array<any>, capabilities?: Array<string>, keyField?: string) {
    this.keyField = keyField;
    const caps = capabilities || ["readRange", "insert", "update", "remove", "move"];
    const has = (name: string): boolean => caps.indexOf(name) > -1;
    if (has("readRange")) {
      // One request per read: the range and the view are inside it and the source keeps nothing
      // between the calls.
      this.readRange = (request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> =>
        this.call("readRange", [request], (): IDynamicDataReadResult => {
          const view = this.getView(request);
          const size = request.take > 0 ? request.take : view.length;
          const res: IDynamicDataReadResult = {
            records: view.slice(request.skip, request.skip + size).map(this.copy)
          };
          if (this.reportTotal) {
            res.total = view.length;
          }
          return res;
        });
    }
    if (has("insert")) {
      // The answer is the stored record: with a keyField it is what carries the key the server
      // assigned back to the list.
      this.insert = (record: any, sourceIndex: number): Promise<any> =>
        this.call("insert", [this.copy(record), sourceIndex], (): any => {
          const stored = Object.assign({}, this.insertDefaults, record);
          if (!!this.keyField) {
            stored[this.keyField] = this.nextKey++;
          }
          this.records.splice(sourceIndex, 0, stored);
          return this.insertAnswersRecord ? this.copy(stored) : undefined;
        });
    }
    if (has("update")) {
      this.update = (key: any, record: any, changedFields: Array<string>): Promise<void> =>
        this.call("update", [key, this.copy(record), (changedFields || []).slice()], (): void => {
          const at = this.indexOfKey(key);
          if (at > -1)this.records[at] = this.copy(record);
        });
    }
    if (has("remove")) {
      this.remove = (key: any): Promise<void> => this.call("remove", [key], (): void => {
        const at = this.indexOfKey(key);
        if (at > -1)this.records.splice(at, 1);
      });
    }
    if (has("move")) {
      this.move = (key: any, to: number): Promise<void> => this.call("move", [key, to], (): void => {
        const from = this.indexOfKey(key);
        if (from < 0) return;
        const record = this.records[from];
        this.records.splice(from, 1);
        this.records.splice(to, 0, record);
      });
    }
  }
  // Without a keyField the key IS the position, which is what the list passes for such a source.
  private indexOfKey(key: any): number {
    if (!this.keyField) return key;
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i][this.keyField] === key) return i;
    }
    return -1;
  }
  // The table changes behind the list's back: a second user, a background job, another tab.
  public moveRecordBehindTheGrid(from: number, to: number): void {
    const record = this.records[from];
    this.records.splice(from, 1);
    this.records.splice(to, 0, record);
  }
  public read(): Promise<Array<any>> {
    return this.call("read", [], (): Array<any> => this.records.map(this.copy));
  }
  private copy = (record: any): any => Object.assign({}, record);
  // The server applies the filter and the sort of the request before it pages: that is what "the
  // source decides the membership" means for the list.
  private getView(request: IDynamicDataReadRequest): Array<any> {
    let res = this.records.slice();
    if (!!request.filter) {
      res = res.filter(dialectToPredicate(translateFilterToDialect(request.filter)));
    }
    // Applied back to front, so that the first descriptor wins.
    (request.sort || []).slice().reverse().forEach((s: IDynamicDataSort): void => {
      const sign = s.direction === "desc" ? -1 : 1;
      res.sort((a: any, b: any): number => {
        const x = a[s.field];
        const y = b[s.field];
        return (x === y ? 0 : (x < y ? -1 : 1)) * sign;
      });
    });
    return res;
  }
  private call<T>(op: string, args: Array<any>, run: () => T): Promise<T> {
    const deferred = new Deferred();
    const entry: IServerCall = {
      op: op, args: args, isSettled: false,
      settle: (): void => {
        if (entry.isSettled) return;
        entry.isSettled = true;
        deferred.resolve(run());
      },
      fail: (error: any): void => {
        if (entry.isSettled) return;
        entry.isSettled = true;
        deferred.reject(error);
      }
    };
    this.calls.push(entry);
    if (this.auto) {
      entry.settle();
    }
    return deferred.promise;
  }
  public callsOf(op: string): Array<IServerCall> {
    return this.calls.filter((call: IServerCall): boolean => call.op === op);
  }
  public argsOf(op: string): Array<Array<any>> {
    return this.callsOf(op).map((call: IServerCall): Array<any> => call.args);
  }
  // The read requests, and the ranges alone for the tests that only care where the window was.
  public get requests(): Array<IDynamicDataReadRequest> {
    return this.argsOf("readRange").map((args: Array<any>): IDynamicDataReadRequest => args[0]);
  }
  public get ranges(): Array<Array<number>> {
    return this.requests.map((request: IDynamicDataReadRequest): Array<number> => [request.skip, request.take]);
  }
  public get pending(): Array<IServerCall> {
    return this.calls.filter((call: IServerCall): boolean => !call.isSettled);
  }
  public settleAll(): void {
    this.pending.forEach((call: IServerCall): void => call.settle());
  }
  public reset(): void {
    this.calls = [];
  }
}

function serverRecords(count: number, offset: number = 0): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: offset + i, col1: "v" + (offset + i), col2: offset + i });
  }
  return res;
}

async function createMatrix(source: FakeServerSource, json?: any, extra?: Array<any>):
  Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel }> {
  const survey = new SurveyModel({
    elements: [Object.assign({
      type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5,
      columns: [{ name: "col1" }, { name: "col2" }]
    }, json)].concat(extra || [])
  });
  const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  question.dataSource = source;
  await flush();
  return { survey: survey, question: question };
}
async function createPanel(source: FakeServerSource, json?: any, extra?: Array<any>):
  Promise<{ survey: SurveyModel, question: QuestionPanelDynamicModel }> {
  const survey = new SurveyModel({
    elements: [Object.assign({
      type: "paneldynamic", name: "panel", panelCount: 0, panelsPerPage: 5,
      templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }]
    }, json)].concat(extra || [])
  });
  const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
  question.dataSource = source;
  await flush();
  return { survey: survey, question: question };
}
function rowValues(question: QuestionMatrixDynamicModel, column: string = "col1"): Array<any> {
  return question.visibleRows.map(row => row.getQuestionByName(column).value);
}
function panelValues(question: QuestionPanelDynamicModel, name: string = "col1"): Array<any> {
  return question.panels.map(panel => panel.getQuestionByName(name).value);
}

describe("Remote data source: first load", () => {
  test("matrix: the window is one page and rowCount is the server total", async () => {
    const source = new FakeServerSource(serverRecords(23));
    const { question } = await createMatrix(source);
    expect(question.rowCount, "#1: the server total").toBe(23);
    expect(question.value.length, "#2: the window is one page").toBe(5);
    expect(question.visibleRows.length, "#3: one row per window record, not per total").toBe(5);
    expect(question.pageCount, "#4").toBe(5);
    expect(rowValues(question), "#5").toEqual(["v0", "v1", "v2", "v3", "v4"]);
    expect(source.ranges[0], "#6: skip/take").toEqual([0, 5]);
  });
  test("panel: the window is one page and panelCount is the server total", async () => {
    const source = new FakeServerSource(serverRecords(23));
    const { question } = await createPanel(source);
    expect(question.panelCount, "#1: the server total").toBe(23);
    expect(question.value.length, "#2: the window is one page").toBe(5);
    expect(question.panels.length, "#3: one panel per window record").toBe(5);
    expect(question.pageCount, "#4").toBe(5);
    expect(panelValues(question), "#5").toEqual(["v0", "v1", "v2", "v3", "v4"]);
  });
  test("matrix: isDataLoading and isReady follow the read", async () => {
    const source = new FakeServerSource(serverRecords(10));
    source.auto = false;
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(question.isDataLoading, "#1: nothing is loading yet").toBe(false);
    question.dataSource = source;
    expect(question.isDataLoading, "#2: the read is in flight").toBe(true);
    expect(question.isReady, "#3: a loading question is not ready").toBe(false);
    source.settleAll();
    await flush();
    expect(question.isDataLoading, "#4").toBe(false);
    expect(question.isReady, "#5").toBe(true);
  });
  test("panel: isDataLoading and isReady follow the read", async () => {
    const source = new FakeServerSource(serverRecords(10));
    source.auto = false;
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, panelsPerPage: 5, templateElements: [{ type: "text", name: "col1" }] }]
    });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.dataSource = source;
    expect(question.isDataLoading, "#1").toBe(true);
    expect(question.isReady, "#2").toBe(false);
    source.settleAll();
    await flush();
    expect(question.isDataLoading, "#3").toBe(false);
    expect(question.isReady, "#4").toBe(true);
  });
  test("getRunningAsyncOperations reports the question while a page is read", async () => {
    const source = new FakeServerSource(serverRecords(10));
    source.auto = false;
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = source;
    const running = survey.getRunningAsyncOperations();
    expect(running.length, "#1: one operation").toBe(1);
    expect(running[0].type, "#2").toBe("dynamicData");
    expect(running[0].owner === question, "#3: the question owns it").toBe(true);
    source.settleAll();
    await flush();
    expect(survey.getRunningAsyncOperations().length, "#4: settled").toBe(0);
  });
  test("getRunningAsyncOperations reports a pending write", async () => {
    const source = new FakeServerSource(serverRecords(10));
    const { survey, question } = await createMatrix(source);
    expect(survey.getRunningAsyncOperations().length, "#1: settled after the load").toBe(0);
    source.auto = false;
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    const running = survey.getRunningAsyncOperations();
    expect(running.length, "#2: the update has not been acknowledged").toBe(1);
    expect(running[0].type, "#3").toBe("dynamicData");
    source.settleAll();
    await flush();
    expect(survey.getRunningAsyncOperations().length, "#4").toBe(0);
  });
  test("a source that returns everything in one read is still a source", async () => {
    const source = new FakeServerSource(serverRecords(4), ["update"]);
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    expect(source.callsOf("read").length, "#1: read, not readRange").toBe(1);
    expect(question.rowCount, "#2").toBe(4);
    expect(question.visibleRows.length, "#3").toBe(4);
  });
});

describe("Remote data source: paging", () => {
  test("matrix: a page change rebuilds the rows with no filter and no sort set", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    const firstRow = question.visibleRows[0];
    question.nextPage();
    await flush();
    expect(source.ranges, "#1: the second page was read").toEqual([[0, 5], [5, 5]]);
    expect(rowValues(question), "#2: the rows hold the new window").toEqual(["v5", "v6", "v7", "v8", "v9"]);
    expect(question.visibleRows[0] === firstRow, "#3: the rows were rebuilt").toBe(false);
    expect(question.rowCount, "#4: the total does not change").toBe(12);
    expect(question.value.length, "#5").toBe(5);
  });
  test("panel: a page change rebuilds the panels with no filter and no sort set", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source);
    question.nextPage();
    await flush();
    expect(panelValues(question), "#1").toEqual(["v5", "v6", "v7", "v8", "v9"]);
    expect(question.panelCount, "#2").toBe(12);
    expect(question.panels.length, "#3: one panel per window record").toBe(5);
  });
  test("the last page holds what is left", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    question.goToPage(2);
    await flush();
    expect(rowValues(question), "#1").toEqual(["v10", "v11"]);
    expect(question.visibleRows.length, "#2").toBe(2);
  });
  test("a rejected read keeps the previous page", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.nextPage();
    source.pending[0].fail(new Error("boom"));
    await flush();
    expect(rowValues(question), "#1: the first page is still shown").toEqual(["v0", "v1", "v2", "v3", "v4"]);
    expect(question.isDataLoading, "#2").toBe(false);
  });
  test("an edit made while the next page is loading carries the source index of the page it was made on", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.nextPage();
    question.visibleRows[1].getQuestionByName("col1").value = "edited";
    expect(source.argsOf("update")[0][0], "#1: index 1 of page 1, not of page 2").toBe(1);
    source.settleAll();
    await flush();
    expect(rowValues(question), "#2: the second page arrived").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("an edit made after a rejected page read carries the source index of the page in force", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.nextPage();
    source.pending[0].fail(new Error("boom"));
    await flush();
    source.auto = true;
    question.visibleRows[2].getQuestionByName("col1").value = "edited";
    expect(source.argsOf("update")[0][0], "#1: still the first page").toBe(2);
  });
  test("a read is deferred until a pending write has settled and the write is not lost", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    question.nextPage();
    expect(source.callsOf("readRange").length, "#1: the read waits for the write").toBe(1);
    source.settleAll();
    await flush();
    source.settleAll();
    await flush();
    expect(source.callsOf("readRange").length, "#2: the read ran afterwards").toBe(2);
    expect(source.records[0].col1, "#3: the write was not lost").toBe("edited");
    expect(rowValues(question), "#4: the new page is shown").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("two edits of one cell reach the source in order", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { question } = await createMatrix(source);
    source.auto = false;
    const cell = question.visibleRows[0].getQuestionByName("col1");
    cell.value = "first";
    cell.value = "second";
    source.settleAll();
    await flush();
    source.settleAll();
    await flush();
    const updates = source.argsOf("update");
    expect(updates.length, "#1: two pushes").toBe(2);
    expect(updates[0][1].col1, "#2").toBe("first");
    expect(updates[1][1].col1, "#3").toBe("second");
    expect(source.records[0].col1, "#4: the server ends with the last one").toBe("second");
  });
});

describe("Remote data source: editing", () => {
  test("matrix: a cell edit pushes update with the absolute index", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(2);
    await flush();
    source.reset();
    question.visibleRows[1].getQuestionByName("col1").value = "edited";
    const args = source.argsOf("update")[0];
    expect(args[0], "#1: windowOffset 10 + record index 1").toBe(11);
    expect(args[1].col1, "#2: the whole record").toBe("edited");
    expect(args[2], "#3: the changed fields").toEqual(["col1"]);
    expect(source.records[11].col1, "#4: the server holds it").toBe("edited");
  });
  test("panel: a field edit on a partial window pushes update with the absolute index", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.panels[2].getQuestionByName("col1").value = "edited";
    const args = source.argsOf("update")[0];
    expect(args[0], "#1: windowOffset 5 + record index 2").toBe(7);
    expect(args[1].col1, "#2").toBe("edited");
    expect(source.records[7].col1, "#3").toBe("edited");
  });
  test("panel: a field edit on a partial window does not throw", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    expect(() => { question.panels[0].getQuestionByName("col2").value = 99; }).not.toThrow();
    expect(question.value.length, "#1: the window is still one page").toBe(5);
  });
  test("question.value follows a remote write and the row object survives it", async () => {
    const source = new FakeServerSource(serverRecords(8));
    const { question } = await createMatrix(source);
    const row = question.visibleRows[1];
    const before = question.value[1];
    row.getQuestionByName("col1").value = "edited";
    const after = question.value;
    expect(after[1] === before, "#1: the record was replaced, never mutated").toBe(false);
    expect(after[1].col1, "#2: the value holds the new record").toBe("edited");
    expect(after[1] === question.getDataList().getRecord(1), "#3: it IS the list record").toBe(true);
    expect(question.visibleRows[1] === row, "#4: the edited row was not disposed").toBe(true);
  });
  test("panel: question.value follows a remote write and the panel survives it", async () => {
    const source = new FakeServerSource(serverRecords(8));
    const { question } = await createPanel(source);
    const panel = question.panels[1];
    const before = question.value[1];
    panel.getQuestionByName("col1").value = "edited";
    expect(question.value[1] === before, "#1: the record was replaced, never mutated").toBe(false);
    expect(question.value[1].col1, "#2").toBe("edited");
    expect(question.value[1] === question.getDataList().getRecord(1), "#3: it IS the list record").toBe(true);
    expect(question.panels[1] === panel, "#4: the edited panel was not disposed").toBe(true);
  });
  test("a respondent edit does not reach survey.data but does reach the source", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { survey, question } = await createMatrix(source);
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(survey.data.matrix, "#1: the survey hash is untouched").toBe(undefined);
    expect(source.callsOf("update").length, "#2: the source got it").toBe(1);
    expect(question.value[0].col1, "#3: the question shows it").toBe("edited");
  });
  test("onCellValueChanged is raised for a remote edit", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { survey, question } = await createMatrix(source);
    const changes: Array<any> = [];
    survey.onMatrixCellValueChanged.add((sender, options) => { changes.push(options.columnName + "=" + options.value); });
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(changes, "#1").toEqual(["col1=edited"]);
  });
  test("onDynamicPanelValueChanged is raised for a remote edit", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { survey, question } = await createPanel(source);
    const changes: Array<any> = [];
    survey.onDynamicPanelValueChanged.add((sender, options) => { changes.push(options.name + "=" + options.value); });
    question.panels[0].getQuestionByName("col1").value = "edited";
    expect(changes, "#1").toEqual(["col1=edited"]);
  });
  test("a nested {row.x} expression runs on a remote page", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source, {
      columns: [{ name: "col1" }, { name: "col2" }, { name: "calc", cellType: "expression", expression: "{row.col1} + '!'" }]
    });
    question.goToPage(2);
    await flush();
    expect(question.visibleRows[0].getQuestionByName("calc").value, "#1").toBe("v10!");
    question.visibleRows[0].getQuestionByName("col1").value = "x";
    expect(question.visibleRows[0].getQuestionByName("calc").value, "#2: it re-runs on an edit").toBe("x!");
  });
});

describe("Remote data source: adding and removing", () => {
  test("matrix: addRow is one insert carrying the complete record", async () => {
    const source = new FakeServerSource(serverRecords(3));
    const { question } = await createMatrix(source, { rowsPerPage: 0, defaultRowValue: { col2: 7 } });
    source.reset();
    question.addRow();
    expect(source.callsOf("insert").length, "#1: exactly one insert").toBe(1);
    expect(source.callsOf("move").length, "#2: no move").toBe(0);
    expect(source.callsOf("update").length, "#3: no follow-up update").toBe(0);
    const args = source.argsOf("insert")[0];
    expect(args[0], "#4: the complete record").toEqual({ col2: 7 });
    expect(args[1], "#5: appended").toBe(3);
    expect(question.rowCount, "#6: the total grew").toBe(4);
    expect(question.visibleRows.length, "#7: one row more").toBe(4);
  });
  test("matrix: addRow copies from the last entry in the window", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source, { copyDefaultValueFromLastEntry: true });
    question.goToPage(1);
    await flush();
    source.reset();
    question.addRow();
    const args = source.argsOf("insert")[0];
    expect(args[0].col1, "#1: copied from the last record of the WINDOW, not of the table").toBe("v9");
    expect(args[1], "#2: windowOffset 5 + 5 records in the window").toBe(10);
    expect(source.callsOf("move").length, "#3").toBe(0);
    expect(source.callsOf("update").length, "#4").toBe(0);
  });
  test("panel: addPanel is one insert carrying the complete record", async () => {
    const source = new FakeServerSource(serverRecords(3));
    const { question } = await createPanel(source, { rowsPerPage: 0, panelsPerPage: 0, defaultPanelValue: { col2: 7 } });
    source.reset();
    question.addPanel();
    expect(source.callsOf("insert").length, "#1: exactly one insert").toBe(1);
    expect(source.callsOf("move").length, "#2: no move").toBe(0);
    expect(source.callsOf("update").length, "#3: no follow-up update").toBe(0);
    const args = source.argsOf("insert")[0];
    expect(args[0], "#4").toEqual({ col2: 7 });
    expect(args[1], "#5: appended").toBe(3);
    expect(question.panelCount, "#6").toBe(4);
    expect(question.panels.length, "#7").toBe(4);
  });
  test("panel: addPanel copies from the last entry in the window", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { copyDefaultValueFromLastEntry: true });
    question.goToPage(1);
    await flush();
    source.reset();
    question.addPanel();
    const args = source.argsOf("insert")[0];
    expect(args[0].col1, "#1").toBe("v9");
    expect(args[1], "#2").toBe(10);
    expect(source.callsOf("update").length, "#3").toBe(0);
  });
  test("matrix: the added row is in the window at once and the value follows", async () => {
    const source = new FakeServerSource(serverRecords(3));
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    question.addRow();
    expect(question.value.length, "#1: optimistic - the record is in the window").toBe(4);
    expect(question.rowCount, "#2").toBe(4);
    expect(question.visibleRows.length, "#3").toBe(4);
  });
  test("matrix: removeRow pushes remove with the absolute index", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.removeRow(2);
    expect(source.argsOf("remove")[0], "#1: windowOffset 5 + 2").toEqual([7]);
    expect(question.rowCount, "#2: the total shrank").toBe(19);
    expect(question.value.length, "#3: the window shrank").toBe(4);
    expect(rowValues(question), "#4").toEqual(["v5", "v6", "v8", "v9"]);
  });
  test("panel: removePanel pushes remove with the absolute index", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.removePanel(2);
    expect(source.argsOf("remove")[0], "#1").toEqual([7]);
    expect(question.panelCount, "#2").toBe(19);
    expect(panelValues(question), "#3").toEqual(["v5", "v6", "v8", "v9"]);
  });
  test("matrix: addRowByIndex inserts inside the window with one insert", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.addRowByIndex({ col1: "inserted" }, 2);
    expect(source.argsOf("insert")[0], "#1").toEqual([{ col1: "inserted" }, 7]);
    expect(source.callsOf("move").length, "#2: no move").toBe(0);
    expect(rowValues(question), "#3").toEqual(["v5", "v6", "inserted", "v7", "v8", "v9"]);
  });
  test("matrix: moveRowByIndex pushes move with absolute indexes", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.moveRowByIndex(0, 2);
    expect(source.argsOf("move")[0], "#1").toEqual([5, 7]);
    expect(rowValues(question), "#2").toEqual(["v6", "v7", "v5", "v8", "v9"]);
  });
  /* The rows that exist stay where they are across a move and take the reordered records. With the
     array source over question.value the value assignment of the push does that; a data source has
     no such assignment. A row left with the record it showed before would write that record over
     the one at its position with the next edit. */
  test("matrix: moveRowByIndex with the rows built: the rows take the reordered records", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    const rows = question.visibleRows.slice();
    expect(rowValues(question), "#1").toEqual(["v5", "v6", "v7", "v8", "v9"]);
    source.reset();
    question.moveRowByIndex(0, 2);
    expect(rowValues(question), "#2: at once, before the source answers").toEqual(["v6", "v7", "v5", "v8", "v9"]);
    expect(rowValues(question, "col2"), "#3: every cell of the row").toEqual([6, 7, 5, 8, 9]);
    expect(question.visibleRows.every((row, i) => row === rows[i]), "#4: the same row objects").toBe(true);
    expect(rows.map(row => (<any>row).builtRecordIndex), "#5: each names the record of its position")
      .toEqual(question.getDataList().getMaterializedIndexes());
    await flush();
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    await flush();
    expect(source.argsOf("update")[0].slice(0, 2), "#6: the edit goes to the record the row shows").toEqual([5, { id: 6, col1: "edited", col2: 6 }]);
    expect(source.records.slice(5, 8).map((r: any): any => r.id), "#7: no record was overwritten").toEqual([6, 7, 5]);
  });
  test("matrix: moveRowByIndex with the rows built, a read() source the list pages", async () => {
    const source = new FakeServerSource(serverRecords(8), ["insert", "update", "remove", "move"]);
    const { question } = await createMatrix(source, { rowsPerPage: 3 });
    question.goToPage(1);
    await flush();
    const rows = question.visibleRows.slice();
    expect(rowValues(question), "#1").toEqual(["v3", "v4", "v5"]);
    source.reset();
    question.moveRowByIndex(0, 2);
    await flush();
    expect(source.argsOf("move"), "#2").toEqual([[3, 5]]);
    expect(rowValues(question), "#3").toEqual(["v4", "v5", "v3"]);
    expect(question.visibleRows.every((row, i) => row === rows[i]), "#4: the same row objects").toBe(true);
    expect(rows.map(row => (<any>row).builtRecordIndex), "#5").toEqual([3, 4, 5]);
    expect(question.value.map((r: any): any => r.id), "#6").toEqual([0, 1, 2, 4, 5, 3, 6, 7]);
  });
});

describe("Remote data source: sorting and filtering", () => {
  test("sortOrder is pushed to the source and keeps the page", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.sortOrder = [{ field: "col2", direction: "desc" }];
    await flush();
    expect(source.requests[0].sort, "#1: the descriptors reach the source").toEqual([{ field: "col2", direction: "desc" }]);
    expect(question.pageIndex, "#2: a sort keeps the page").toBe(1);
    expect(source.ranges[0], "#3: the same page was re-read").toEqual([5, 5]);
    expect(rowValues(question), "#4: the server sorted, the list did not").toEqual(["v14", "v13", "v12", "v11", "v10"]);
  });
  test("a filter is pushed to the source as the expression text and returns to page 0", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.goToPage(2);
    await flush();
    source.reset();
    question.filterExpression = "{col1} = 'v7'";
    await flush();
    expect(source.requests[0].filter, "#1: the text, untouched").toBe("{col1} = 'v7'");
    expect(question.pageIndex, "#2: back to the first page").toBe(0);
    expect(question.rowCount, "#3: the server total of the filtered view").toBe(1);
    expect(rowValues(question), "#4").toEqual(["v7"]);
  });
  test("the source translates the filter expression through the operand tree", () => {
    expect(translateFilterToDialect("{col1} = 'v7'"), "#1").toBe("col1 eq \"v7\"");
    expect(translateFilterToDialect("{country} = 'de'"), "#2").toBe("country eq \"de\"");
    // A node the source does not know keeps the library rendering, which is what lets a source
    // translate what it can and reject the rest.
    expect(translateFilterToDialect("{age} > 18").indexOf("18") > -1, "#3").toBe(true);
  });
  test("the list does not filter the window when the source filters", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const { question } = await createMatrix(source);
    question.filterExpression = "{col1} = 'v3'";
    await flush();
    const list = question.getDataList();
    expect(list.loadedCount, "#1: the window is what the server returned").toBe(1);
    expect(list.getCreatedIndexes(), "#2: no local filter ran over it").toEqual([0]);
  });
  /* Paging is one capability with filtering and sorting, so this is the only combination there is:
     a source that pages sorts itself and the list leaves the window as it came. The local sort of
     a window is gone with the "pages but does not sort" source it belonged to. */
  test("a source that pages sorts itself: the request carries the sort and the list does not sort the window", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "update"]);
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    source.reset();
    question.sortOrder = [{ field: "col2", direction: "desc" }];
    await flush();
    expect(source.requests.length, "#1: exactly one read").toBe(1);
    expect(source.requests[0].sort, "#2: with the sort inside it").toEqual([{ field: "col2", direction: "desc" }]);
    expect(rowValues(question), "#3: the server sorted, the list did not").toEqual(["v5", "v4", "v3", "v2", "v1", "v0"]);
    const list = question.getDataList();
    expect(list.getCreatedIndexes(), "#4: the window is taken as it came").toEqual([0, 1, 2, 3, 4, 5]);
  });
  test("refreshView re-reads the window when the source decides the membership", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.reset();
    question.refreshView();
    await flush();
    expect(source.callsOf("readRange").length, "#1: the server decides, so the window is read again").toBe(1);
    expect(source.ranges[0], "#2: the same page").toEqual([0, 5]);
  });
});

describe("Remote data source: capabilities", () => {
  test("no insert: the matrix cannot add rows", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "update", "remove"]);
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    expect(question.canAddRow, "#1").toBe(false);
    expect(question.canRemoveRows, "#2: remove is there").toBe(true);
  });
  test("no remove: the matrix cannot delete rows", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "update", "insert"]);
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    expect(question.canRemoveRows, "#1").toBe(false);
    expect(question.canAddRow, "#2: insert is there").toBe(true);
  });
  test("no update: the matrix is read-only for cells", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "insert", "remove"]);
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    expect(question.isMatrixReadOnly(), "#1").toBe(true);
    expect(question.visibleRows[0].getQuestionByName("col1").isReadOnly, "#2: the cells follow").toBe(true);
    expect(question.canAddRow, "#3: adding is a different capability").toBe(true);
  });
  test("no move: the matrix cannot be reordered by dragging", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "update"]);
    const { question } = await createMatrix(source, { rowsPerPage: 0, allowRowReorder: true });
    expect(question.isRowsDragAndDrop, "#1").toBe(false);
  });
  test("with move the matrix can be reordered by dragging", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { question } = await createMatrix(source, { rowsPerPage: 0, allowRowReorder: true });
    expect(question.isRowsDragAndDrop, "#1").toBe(true);
  });
  test("no insert / no remove: the panel cannot add or delete panels", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "update"]);
    const { question } = await createPanel(source, { panelsPerPage: 0 });
    expect(question.canAddPanel, "#1").toBe(false);
    expect(question.canRemovePanel, "#2").toBe(false);
  });
  test("no update: the panels are read-only", async () => {
    const source = new FakeServerSource(serverRecords(6), ["readRange", "insert", "remove"]);
    const { question } = await createPanel(source, { panelsPerPage: 0 });
    expect(question.panels[0].getQuestionByName("col1").isReadOnly, "#1").toBe(true);
    expect(question.canAddPanel, "#2: adding is a different capability").toBe(true);
  });
});

describe("Remote data source: survey data", () => {
  test("attaching a source clears the answer from the survey hash", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 2, columns: [{ name: "col1" }] }]
    });
    survey.data = { matrix: [{ col1: "local1" }, { col1: "local2" }] };
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    question.dataSource = new FakeServerSource(serverRecords(6));
    await flush();
    expect(changes, "#1: exactly one value change - attaching is a developer action").toEqual(["matrix"]);
    expect(survey.data.matrix, "#2: the stale answer is gone").toBe(undefined);
    expect(question.value.length, "#3: the window is shown").toBe(6);
    expect(rowValues(question), "#4").toEqual(["v0", "v1", "v2", "v3", "v4", "v5"]);
  });
  test("an incoming assignment is ignored while a source is attached", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    survey.data = { matrix: [{ col1: "outside" }] };
    expect(question.value.length, "#1: the window is unchanged").toBe(6);
    expect(rowValues(question)[0], "#2").toBe("v0");
    survey.setValue("matrix", [{ col1: "again" }]);
    expect(rowValues(question)[0], "#3").toBe("v0");
  });
  test("detaching the source restores the value from the survey hash", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = new FakeServerSource(serverRecords(6));
    await flush();
    expect(question.value.length, "#1").toBe(6);
    survey.setValue("matrix", [{ col1: "hash1" }, { col1: "hash2" }]);
    question.dataSource = undefined;
    await flush();
    expect(question.dataSource, "#2").toBe(undefined);
    expect(rowValues(question), "#3: the hash is read again").toEqual(["hash1", "hash2"]);
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(survey.data.matrix[0].col1, "#4: the question writes to the survey again").toBe("edited");
  });
  test("detaching with an empty hash leaves an empty question", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    question.dataSource = undefined;
    await flush();
    expect(question.rowCount, "#1").toBe(0);
    expect(question.visibleRows.length, "#2").toBe(0);
  });
  test("panel: attach, ignore, detach", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel", panelCount: 2, templateElements: [{ type: "text", name: "col1" }] }]
    });
    survey.data = { panel: [{ col1: "local1" }, { col1: "local2" }] };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.dataSource = new FakeServerSource(serverRecords(4));
    await flush();
    expect(survey.data.panel, "#1: the hash was cleared").toBe(undefined);
    expect(panelValues(question), "#2").toEqual(["v0", "v1", "v2", "v3"]);
    survey.data = { panel: [{ col1: "outside" }] };
    expect(panelValues(question), "#3: ignored").toEqual(["v0", "v1", "v2", "v3"]);
    survey.setValue("panel", [{ col1: "hash1" }]);
    question.dataSource = undefined;
    await flush();
    expect(panelValues(question), "#4: the hash is read again").toEqual(["hash1"]);
  });
});

describe("Remote data source: attaching and detaching a source", () => {
  // The question's own value changes, which a survey event does not show: an incoming assignment
  // reaches the question through updateValueFromSurvey, not through survey.onValueChanged.
  function recordValues(question: Question): Array<any> {
    const res: Array<any> = [];
    question.registerPropertyChangedHandlers(["value"], (newValue: any): void => {
      res.push(Array.isArray(newValue) ? newValue.map((r: any): any => !!r ? r.col1 : r) : newValue);
    }, "step24");
    return res;
  }
  function createLocalMatrix(json?: any): { survey: SurveyModel, question: QuestionMatrixDynamicModel } {
    const survey = new SurveyModel({
      elements: [Object.assign({ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }, json)]
    });
    return { survey: survey, question: <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix") };
  }
  function createLocalPanel(json?: any): { survey: SurveyModel, question: QuestionPanelDynamicModel } {
    const survey = new SurveyModel({
      elements: [Object.assign({ type: "paneldynamic", name: "panel", panelCount: 0, templateElements: [{ type: "text", name: "col1" }] }, json)]
    });
    return { survey: survey, question: <QuestionPanelDynamicModel>survey.getQuestionByName("panel") };
  }
  test("P1 matrix: an attach clears the hash once and the value never goes through an empty one", async () => {
    const { survey, question } = createLocalMatrix({ rowCount: 2 });
    survey.data = { matrix: [{ col1: "local1" }, { col1: "local2" }] };
    expect(question.visibleRows.length, "#1: the rows and the list exist").toBe(2);
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    const values = recordValues(question);
    question.dataSource = new FakeServerSource(serverRecords(3));
    await flush();
    expect(changes, "#2: one survey change").toEqual(["matrix"]);
    expect(survey.data.matrix, "#3: the hash is cleared").toBe(undefined);
    expect(values, "#4: the question's own value changes: the answer goes straight to the window").toEqual([["v0", "v1", "v2"]]);
    expect(rowValues(question), "#5: the window is shown").toEqual(["v0", "v1", "v2"]);
  });
  test("P1 panel: an attach clears the hash once and the value never goes through an empty one", async () => {
    const { survey, question } = createLocalPanel({ panelCount: 2 });
    survey.data = { panel: [{ col1: "local1" }, { col1: "local2" }] };
    expect(question.panels.length, "#1: the panels and the list exist").toBe(2);
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    const values = recordValues(question);
    question.dataSource = new FakeServerSource(serverRecords(3));
    await flush();
    expect(changes, "#2: one survey change").toEqual(["panel"]);
    expect(survey.data.panel, "#3: the hash is cleared").toBe(undefined);
    expect(values, "#4: the question's own value changes: the answer goes straight to the window").toEqual([["v0", "v1", "v2"]]);
    expect(panelValues(question), "#5: the window is shown").toEqual(["v0", "v1", "v2"]);
  });
  test("P3 matrix: attach, detach, attach another source, detach: question.value is read through after each detach", async () => {
    const { survey, question } = createLocalMatrix();
    const checkLocal = (no: string, first: string): void => {
      survey.setValue("matrix", [{ col1: first }, { col1: "x" }]);
      expect(rowValues(question), no + ": survey.setValue is seen at once").toEqual([first, "x"]);
      expect(question.getDataList().getRecord(0).col1, no + ": the list reads it").toBe(first);
      question.visibleRows[1].getQuestionByName("col1").value = "edited";
      expect(survey.data.matrix[1].col1, no + ": an edit writes to the hash").toBe("edited");
      expect(question.getDataList().getRecord(1).col1, no + ": and the list reads the edit").toBe("edited");
    };
    question.dataSource = new FakeServerSource(serverRecords(3));
    await flush();
    expect(rowValues(question), "#1").toEqual(["v0", "v1", "v2"]);
    question.dataSource = undefined;
    await flush();
    checkLocal("#2", "a");
    question.dataSource = new FakeServerSource(serverRecords(2, 10));
    await flush();
    expect(rowValues(question), "#3").toEqual(["v10", "v11"]);
    expect(survey.data.matrix, "#4: the hash is cleared again").toBe(undefined);
    question.dataSource = undefined;
    await flush();
    checkLocal("#5", "b");
  });
  test("P3 panel: attach, detach, attach another source, detach: question.value is read through after each detach", async () => {
    const { survey, question } = createLocalPanel();
    const checkLocal = (no: string, first: string): void => {
      survey.setValue("panel", [{ col1: first }, { col1: "x" }]);
      expect(panelValues(question), no + ": survey.setValue is seen at once").toEqual([first, "x"]);
      expect(question.getDataList().getRecord(0).col1, no + ": the list reads it").toBe(first);
      question.panels[1].getQuestionByName("col1").value = "edited";
      expect(survey.data.panel[1].col1, no + ": an edit writes to the hash").toBe("edited");
      expect(question.getDataList().getRecord(1).col1, no + ": and the list reads the edit").toBe("edited");
    };
    question.dataSource = new FakeServerSource(serverRecords(3));
    await flush();
    expect(panelValues(question), "#1").toEqual(["v0", "v1", "v2"]);
    question.dataSource = undefined;
    await flush();
    checkLocal("#2", "a");
    question.dataSource = new FakeServerSource(serverRecords(2, 10));
    await flush();
    expect(panelValues(question), "#3").toEqual(["v10", "v11"]);
    expect(survey.data.panel, "#4: the hash is cleared again").toBe(undefined);
    question.dataSource = undefined;
    await flush();
    checkLocal("#5", "b");
  });
  test("P4 matrix: the padded records after a detach", async () => {
    const { survey, question } = createLocalMatrix({ rowCount: 3 });
    question.value = [{ col1: "a" }];
    expect(question.rowCount, "#1").toBe(3);
    expect(question.getDataList().loadedCount, "#2: padded up to rowCount").toBe(3);
    question.dataSource = new FakeServerSource(serverRecords(2));
    await flush();
    expect(question.rowCount, "#3: the window").toBe(2);
    question.dataSource = undefined;
    await flush();
    // The hash was cleared by the attach, so the detach restores an empty value.
    expect(question.rowCount, "#4").toBe(0);
    expect(question.getDataList().loadedCount, "#5").toBe(0);
    expect(question.value, "#6").toEqual([]);
    question.rowCount = 3;
    expect(question.getDataList().loadedCount, "#7: padded up to rowCount again").toBe(3);
    expect(question.getDataList().getRecord(2), "#8: a padded record").toEqual({});
    expect(question.visibleRows.length, "#9").toBe(3);
    question.visibleRows[2].getQuestionByName("col1").value = "x";
    expect(question.value, "#10: the padded records are stored with the edit").toEqual([{}, {}, { col1: "x" }]);
    expect(survey.data.matrix, "#11").toEqual([{}, {}, { col1: "x" }]);
    question.getDataList().setValue(1, "col1", "y");
    expect(survey.data.matrix, "#12: a list write goes through normalizeRecords to the hash").toEqual([{}, { col1: "y" }, { col1: "x" }]);
  });
  test("P5 matrix: an assigned ArrayDynamicDataSource", async () => {
    let arr: Array<any> = [{ col1: "a0" }, { col1: "a1" }];
    const { survey, question } = createLocalMatrix();
    survey.setValue("matrix", [{ col1: "hash" }]);
    question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    await flush();
    expect(rowValues(question), "#1: the rows show the array").toEqual(["a0", "a1"]);
    expect(survey.data.matrix, "#2: the hash is cleared").toBe(undefined);
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(arr[0].col1, "#3: an edit reaches the array").toBe("edited");
    expect(question.value[0].col1, "#4: and question.value").toBe("edited");
    expect(survey.data.matrix, "#5: not the hash").toBe(undefined);
    question.addRow();
    expect(arr.length, "#6: add").toBe(3);
    expect(question.visibleRows.length, "#7").toBe(3);
    question.removeRow(0);
    expect(arr.map((r: any): any => r.col1), "#8: remove").toEqual(["a1", undefined]);
    expect(rowValues(question), "#9").toEqual(["a1", undefined]);
    // The step-25 baseline: the array is replaced outside the list.
    arr = [{ col1: "outside0" }, { col1: "outside1" }];
    expect(question.getDataList().getRecord(0).col1, "#10: the list record").toBe("a1");
    expect(question.value[0].col1, "#11: question.value").toBe("a1");
    expect(question.visibleRows[0].getQuestionByName("col1").value, "#12: the row").toBe("a1");
    question.getDataList().refresh();
    await flush();
    expect(question.getDataList().getRecord(0).col1, "#13: the list record after refresh").toBe("outside0");
    expect(question.value[0].col1, "#14: question.value after refresh").toBe("outside0");
    expect(question.visibleRows[0].getQuestionByName("col1").value, "#15: the row after refresh").toBe("outside0");
    survey.setValue("matrix", [{ col1: "hash2" }]);
    question.dataSource = undefined;
    await flush();
    expect(rowValues(question), "#16: the hash is read again").toEqual(["hash2"]);
  });
  test("P5 panel: an assigned ArrayDynamicDataSource", async () => {
    let arr: Array<any> = [{ col1: "a0" }, { col1: "a1" }];
    const { survey, question } = createLocalPanel();
    survey.setValue("panel", [{ col1: "hash" }]);
    question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    await flush();
    expect(panelValues(question), "#1: the panels show the array").toEqual(["a0", "a1"]);
    expect(survey.data.panel, "#2: the hash is cleared").toBe(undefined);
    question.panels[0].getQuestionByName("col1").value = "edited";
    expect(arr[0].col1, "#3: an edit reaches the array").toBe("edited");
    expect(question.value[0].col1, "#4: and question.value").toBe("edited");
    expect(survey.data.panel, "#5: not the hash").toBe(undefined);
    question.addPanel();
    expect(arr.length, "#6: add").toBe(3);
    expect(question.panels.length, "#7").toBe(3);
    question.removePanel(0);
    expect(arr.map((r: any): any => r.col1), "#8: remove").toEqual(["a1", undefined]);
    expect(panelValues(question), "#9").toEqual(["a1", undefined]);
    // The step-25 baseline: the array is replaced outside the list.
    arr = [{ col1: "outside0" }, { col1: "outside1" }];
    expect(question.getDataList().getRecord(0).col1, "#10: the list record").toBe("a1");
    expect(question.value[0].col1, "#11: question.value").toBe("a1");
    expect(question.panels[0].getQuestionByName("col1").value, "#12: the panel").toBe("a1");
    question.getDataList().refresh();
    await flush();
    expect(question.getDataList().getRecord(0).col1, "#13: the list record after refresh").toBe("outside0");
    expect(question.value[0].col1, "#14: question.value after refresh").toBe("outside0");
    expect(question.panels[0].getQuestionByName("col1").value, "#15: the panel after refresh").toBe("outside0");
    survey.setValue("panel", [{ col1: "hash2" }]);
    question.dataSource = undefined;
    await flush();
    expect(panelValues(question), "#16: the hash is read again").toEqual(["hash2"]);
  });
  test("P6 matrix: an assigned SurveyDataDynamicDataSource", async () => {
    const { survey, question } = createLocalMatrix();
    survey.setValue("other", [{ col1: "a0" }, { col1: "a1" }]);
    survey.setValue("matrix", [{ col1: "hash" }]);
    question.dataSource = new SurveyDataDynamicDataSource(survey, "other");
    await flush();
    expect(rowValues(question), "#1: the rows show the other value").toEqual(["a0", "a1"]);
    expect(survey.data.matrix, "#2: the hash is cleared").toBe(undefined);
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(survey.data.other[0].col1, "#3: an edit reaches survey.data.other").toBe("edited");
    expect(question.value[0].col1, "#4: and question.value").toBe("edited");
    expect(survey.data.matrix, "#5: not the hash").toBe(undefined);
    question.addRow();
    expect(survey.data.other.length, "#6: add").toBe(3);
    question.removeRow(0);
    expect(survey.data.other.map((r: any): any => r.col1), "#7: remove").toEqual(["a1", undefined]);
    // The step-25 baseline: the value is replaced outside the list.
    survey.setValue("other", [{ col1: "outside0" }, { col1: "outside1" }]);
    expect(question.getDataList().getRecord(0).col1, "#8: the list record").toBe("a1");
    expect(question.value[0].col1, "#9: question.value").toBe("a1");
    expect(question.visibleRows[0].getQuestionByName("col1").value, "#10: the row").toBe("a1");
    question.getDataList().refresh();
    await flush();
    expect(question.getDataList().getRecord(0).col1, "#11: the list record after refresh").toBe("outside0");
    expect(question.value[0].col1, "#12: question.value after refresh").toBe("outside0");
    expect(question.visibleRows[0].getQuestionByName("col1").value, "#13: the row after refresh").toBe("outside0");
    survey.setValue("matrix", [{ col1: "hash2" }]);
    question.dataSource = undefined;
    await flush();
    expect(rowValues(question), "#14: the hash is read again").toEqual(["hash2"]);
  });
  test("P6 panel: an assigned SurveyDataDynamicDataSource", async () => {
    const { survey, question } = createLocalPanel();
    survey.setValue("other", [{ col1: "a0" }, { col1: "a1" }]);
    survey.setValue("panel", [{ col1: "hash" }]);
    question.dataSource = new SurveyDataDynamicDataSource(survey, "other");
    await flush();
    expect(panelValues(question), "#1: the panels show the other value").toEqual(["a0", "a1"]);
    expect(survey.data.panel, "#2: the hash is cleared").toBe(undefined);
    question.panels[0].getQuestionByName("col1").value = "edited";
    expect(survey.data.other[0].col1, "#3: an edit reaches survey.data.other").toBe("edited");
    expect(question.value[0].col1, "#4: and question.value").toBe("edited");
    expect(survey.data.panel, "#5: not the hash").toBe(undefined);
    question.addPanel();
    expect(survey.data.other.length, "#6: add").toBe(3);
    question.removePanel(0);
    expect(survey.data.other.map((r: any): any => r.col1), "#7: remove").toEqual(["a1", undefined]);
    // The step-25 baseline: the value is replaced outside the list.
    survey.setValue("other", [{ col1: "outside0" }, { col1: "outside1" }]);
    expect(question.getDataList().getRecord(0).col1, "#8: the list record").toBe("a1");
    expect(question.value[0].col1, "#9: question.value").toBe("a1");
    expect(question.panels[0].getQuestionByName("col1").value, "#10: the panel").toBe("a1");
    question.getDataList().refresh();
    await flush();
    expect(question.getDataList().getRecord(0).col1, "#11: the list record after refresh").toBe("outside0");
    expect(question.value[0].col1, "#12: question.value after refresh").toBe("outside0");
    expect(question.panels[0].getQuestionByName("col1").value, "#13: the panel after refresh").toBe("outside0");
    survey.setValue("panel", [{ col1: "hash2" }]);
    question.dataSource = undefined;
    await flush();
    expect(panelValues(question), "#14: the hash is read again").toEqual(["hash2"]);
  });
  test("P7 a detach while a read of the old source is in flight", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.nextPage();
    expect(question.isDynamicDataRunning, "#1: the read is in flight").toBe(true);
    question.dataSource = undefined;
    expect(question.isDynamicDataRunning, "#2: nothing is running after the detach").toBe(false);
    expect(question.isDataLoading, "#3").toBe(false);
    const rows = rowValues(question);
    const list = question.getDataList();
    const count = list.count;
    source.settleAll();
    await flush();
    expect(rowValues(question), "#4: the late answer is discarded").toEqual(rows);
    expect(question.isDynamicDataRunning, "#5").toBe(false);
    // The rows would not show a late commit: the list reads through question.value again.
    expect(list.windowOffset, "#6: the late page is not committed").toBe(0);
    expect(list.count, "#7").toBe(count);
  });
  test("P8 a dispose with a read in flight writes nothing into the question", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.nextPage();
    const value = question.value;
    const list = question.getDataList();
    question.dispose();
    source.settleAll();
    await flush();
    expect(question.value === value, "#1: the value is the one it had").toBe(true);
    expect(list.loadedCount, "#2: the list went with the question and committed nothing").toBe(0);
    expect(list.isLoading, "#3").toBe(false);
  });
  /* The trap: an attach that creates the list. A page size from JSON is not a way there -
     rowsPerPage/panelsPerPage create the list when they are set, and a panel creates it when the
     survey loads - so the attach that creates it creates a list that does not page. */
  test("P9 matrix: an attach to a question whose list does not exist yet", async () => {
    const paged = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5, columns: [{ name: "col1" }] }]
    });
    expect(!!(<any>paged.getQuestionByName("matrix")).dataListValue, "#0: rowsPerPage from JSON creates the list").toBe(true);
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }]
    });
    survey.data = { matrix: [{ col1: "local" }] };
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(!!(<any>question).dataListValue, "#1: no list yet").toBe(false);
    let added = 0;
    survey.onMatrixRowAdded.add(() => { added++; });
    const values = recordValues(question);
    const source = new FakeServerSource(serverRecords(12));
    source.auto = false;
    question.dataSource = source;
    expect(!!(<any>question).dataListValue, "#2: the attach created the list").toBe(true);
    expect(added, "#3: rows added during the attach").toBe(0);
    expect(!!(<any>question).generatedVisibleRows, "#4: rows built before the first read answers").toBe(false);
    expect(values, "#5: value changes during the attach").toEqual([]);
    expect(survey.data.matrix, "#6").toBe(undefined);
    expect(question.isDataLoading, "#7").toBe(true);
    source.settleAll();
    await flush();
    expect(added, "#8").toBe(0);
    expect(values, "#9: value changes after the read: the window").toEqual([["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11"]]);
    expect(rowValues(question), "#10").toEqual(["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11"]);
  });
  test("P9 panel: an attach to a question whose list does not exist yet", async () => {
    const loaded = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, templateElements: [{ type: "text", name: "col1" }] }]
    });
    expect(!!(<any>loaded.getQuestionByName("panel")).dataListValue, "#0: a panel in a survey has its list after the load").toBe(true);
    const question = new QuestionPanelDynamicModel("panel");
    question.template.addNewQuestion("text", "col1");
    expect(!!(<any>question).dataListValue, "#1: no list yet").toBe(false);
    const values = recordValues(question);
    const source = new FakeServerSource(serverRecords(12));
    source.auto = false;
    question.dataSource = source;
    expect(!!(<any>question).dataListValue, "#2: the attach created the list").toBe(true);
    expect((<any>question).panelsCore.length, "#3: panels built before the first read answers").toBe(0);
    expect(values, "#4: value changes during the attach").toEqual([]);
    expect(question.isDataLoading, "#5").toBe(true);
    source.settleAll();
    await flush();
    expect(values, "#6: value changes after the read: the window").toEqual([["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11"]]);
    expect(question.value.map((r: any): any => r.col1), "#7: the window is the value").toEqual(["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11"]);
  });
});

describe("Remote data source: design mode gives unpaged positions", () => {
  function readVariable(item: any, name: string): any {
    const res = item.getValueGetterContext().getValue({ path: [{ name: name }], index: 0, isRoot: false });
    return !!res ? res.value : undefined;
  }
  const matrixJson = { type: "matrixdynamic", name: "matrix", rowCount: 6, rowsPerPage: 2, columns: [{ name: "col1" }] };
  const panelJson = { type: "paneldynamic", name: "panel", panelCount: 6, panelsPerPage: 2, templateElements: [{ type: "text", name: "col1" }] };
  test("P10 matrix: design mode set before the JSON", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [matrixJson] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = question.visibleRows;
    expect(question.getDataList().pageSize, "#1: the list does not page").toBe(0);
    expect(rows.map(row => question.getItemVisibleIndex(<any>row)), "#2").toEqual([0, 1, 2, 3, 4, 5]);
    expect(rows.map(row => readVariable(row, "visibleRowIndex")), "#3").toEqual([1, 2, 3, 4, 5, 6]);
  });
  /* setDesignMode notifies no question, so the list keeps the page size and the page it had until the
     next paging sync; the question stops paging because isPagingActive reads the mode. The positions
     come from the list alone, so they stay the ones the page had. */
  test("P10 matrix: design mode set on a question that pages, on its second page", () => {
    const survey = new SurveyModel({ elements: [matrixJson] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.visibleRows;
    question.pageIndex = 1;
    expect(question.getItemVisibleIndex(<any>question.visibleRows[0]), "#1: paged").toBe(2);
    survey.setDesignMode(true);
    const rows = question.visibleRows;
    expect(question.getDataList().pageSize, "#2: the list still pages").toBe(2);
    expect(question.getDataList().pageIndex, "#3: on the page it was on").toBe(1);
    expect(rows.map(row => question.getItemVisibleIndex(<any>row)), "#4: the rows of that page, numbered as on that page").toEqual([2, 3]);
    expect(rows.map(row => readVariable(row, "visibleRowIndex")), "#5").toEqual([3, 4]);
  });
  test("P10 panel: design mode set before the JSON", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [panelJson] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panels = question.panels;
    expect(question.getDataList().pageSize, "#1: the list does not page").toBe(0);
    expect(panels.map(panel => question.getItemVisibleIndex(<any>panel.data)), "#2: the template").toEqual([0]);
    expect(panels.map(panel => readVariable(panel.data, "visiblePanelIndex")), "#3").toEqual([0]);
  });
  test("P10 panel: design mode set on a question that pages, on its second page", () => {
    const survey = new SurveyModel({ elements: [panelJson] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.panels;
    question.goToPage(1);
    expect(question.getItemVisibleIndex(<any>question.panels[0].data), "#1: paged").toBe(2);
    survey.setDesignMode(true);
    const panels = question.panels;
    expect(question.getDataList().pageSize, "#2: the list still pages").toBe(2);
    expect(question.getDataList().pageIndex, "#3: on the page it was on").toBe(1);
    expect(panels.map(panel => question.getItemVisibleIndex(<any>panel.data)), "#4: the panels of that page, numbered as on that page").toEqual([2, 3]);
    expect(panels.map(panel => readVariable(panel.data, "visiblePanelIndex")), "#5").toEqual([2, 3]);
  });
});

/* A source assigned to a question gets a window, whatever its class. The
   question is not told when the developer's storage changes, so the list does not follow it either:
   the list, question.value and the rows/panels hold the same records until the list reads again. */
describe("Remote data source: an assigned source is read, not read through", () => {
  interface IAssigned {
    survey: SurveyModel;
    question: any;
    // The developer's storage, read and replaced outside the list.
    getStorage: () => Array<any>;
    setStorage: (arr: Array<any>) => void;
    // How often the source's count() callback ran; an ArrayDynamicDataSource only.
    countCalls: () => number;
  }
  const questionTypes = ["matrix", "panel"];
  const sourceKinds = ["ArrayDynamicDataSource", "SurveyDataDynamicDataSource"];
  function records(...values: Array<string>): Array<any> {
    return values.map((value: string): any => ({ col1: value }));
  }
  function col1(arr: Array<any>): Array<any> {
    return (arr || []).map((record: any): any => !!record ? record.col1 : record);
  }
  function createQuestion(type: string): { survey: SurveyModel, question: any } {
    const json: any = type === "matrix"
      ? { type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "col1" }] }
      : { type: "paneldynamic", name: "q", panelCount: 0, templateElements: [{ type: "text", name: "col1" }] };
    const survey = new SurveyModel({ elements: [json] });
    return { survey: survey, question: survey.getQuestionByName("q") };
  }
  async function createAssigned(type: string, kind: string): Promise<IAssigned> {
    const { survey, question } = createQuestion(type);
    let res: IAssigned;
    if (kind === "ArrayDynamicDataSource") {
      let arr: Array<any> = records("a0", "a1", "a2");
      let calls = 0;
      question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; },
        (): number => { calls++; return arr.length; });
      res = {
        survey: survey, question: question, getStorage: (): Array<any> => arr,
        setStorage: (a: Array<any>): void => { arr = a; }, countCalls: (): number => calls
      };
    } else {
      survey.setValue("other", records("a0", "a1", "a2"));
      question.dataSource = new SurveyDataDynamicDataSource(survey, "other");
      res = {
        survey: survey, question: question, getStorage: (): Array<any> => survey.getValue("other"),
        setStorage: (a: Array<any>): void => { survey.setValue("other", a); }, countCalls: (): number => 0
      };
    }
    await flush();
    return res;
  }
  function listValues(question: any): Array<any> {
    return col1(question.getDataList().getLoadedRecords());
  }
  function objectValues(question: any): Array<any> {
    return question instanceof QuestionMatrixDynamicModel ? rowValues(question) : panelValues(question);
  }
  function getCell(question: any, index: number): Question {
    return question instanceof QuestionMatrixDynamicModel
      ? question.visibleRows[index].getQuestionByName("col1") : question.panels[index].getQuestionByName("col1");
  }
  // The list, question.value and the rows/panels: the three reads that have to agree.
  function expectAll(question: any, expected: Array<any>, no: string): void {
    expect(listValues(question), no + ": the list").toEqual(expected);
    expect(col1(question.value), no + ": question.value").toEqual(expected);
    expect(objectValues(question), no + ": the rows/panels").toEqual(expected);
  }
  questionTypes.forEach((type: string): void => {
    sourceKinds.forEach((kind: string): void => {
      const name = type + ", " + kind + ": ";
      test(name + "an outside change is seen after refresh(), not before", async () => {
        const { question, getStorage, setStorage } = await createAssigned(type, kind);
        expectAll(question, ["a0", "a1", "a2"], "#1");
        setStorage(records("outside0", "outside1", "outside2"));
        expect(col1(getStorage()), "#2: the storage has the change").toEqual(["outside0", "outside1", "outside2"]);
        expectAll(question, ["a0", "a1", "a2"], "#3: nothing has moved");
        setStorage(records("outside0"));
        expect(question.getDataList().count, "#4: nor the count").toBe(3);
        expectAll(question, ["a0", "a1", "a2"], "#5: a shorter array");
        question.getDataList().refresh();
        await flush();
        expectAll(question, ["outside0"], "#6: after refresh()");
        expect(question.getDataList().count, "#7").toBe(1);
      });
      test(name + "an outside change does not re-decide a filter until refresh()", async () => {
        const { question, setStorage } = await createAssigned(type, kind);
        const list = question.getDataList();
        question.filterExpression = "{col1} <> 'a1'";
        expect(objectValues(question), "#1: the view").toEqual(["a0", "a2"]);
        // The same length: a1 moves to the first record, which the view holds.
        setStorage(records("a1", "b1", "b2"));
        expect(list.getCreatedIndexes(), "#2: the membership").toEqual([0, 2]);
        expect(list.getCreatedIndexes().map((index: number): any => list.getRecord(index).col1), "#3: the records of the view").toEqual(["a0", "a2"]);
        expect(objectValues(question), "#4").toEqual(["a0", "a2"]);
        // Another length: a record count that changed is what makes a read-through list re-decide.
        setStorage(records("a1", "b1"));
        expect(list.getCreatedIndexes(), "#5: the membership").toEqual([0, 2]);
        expect(list.visibleCount, "#6").toBe(2);
        expect(objectValues(question), "#7").toEqual(["a0", "a2"]);
        expect(col1(question.value), "#8: question.value holds every record").toEqual(["a0", "a1", "a2"]);
        list.refresh();
        await flush();
        expect(list.getCreatedIndexes(), "#9: re-decided by the read").toEqual([1]);
        expect(objectValues(question), "#10").toEqual(["b1"]);
        expect(col1(question.value), "#11").toEqual(["a1", "b1"]);
        expect(listValues(question), "#12").toEqual(["a1", "b1"]);
      });
      test(name + "a filter assigned after an outside change is decided over the records the question holds", async () => {
        const { question, setStorage } = await createAssigned(type, kind);
        setStorage(records("a1", "b1", "b2"));
        question.filterExpression = "{col1} <> 'a1'";
        expect(objectValues(question), "#1: the view over the window").toEqual(["a0", "a2"]);
        expect(col1(question.value), "#2").toEqual(["a0", "a1", "a2"]);
        expect(listValues(question), "#3").toEqual(["a0", "a1", "a2"]);
        question.getDataList().refresh();
        await flush();
        expect(objectValues(question), "#4: after refresh()").toEqual(["b1", "b2"]);
        expect(col1(question.value), "#5").toEqual(["a1", "b1", "b2"]);
      });
      // A regression guard: it passes with and without the step. The window follows every write.
      test(name + "an edit, an add, a remove and a move reach the storage, the list and question.value", async () => {
        const { question, getStorage } = await createAssigned(type, kind);
        const isMatrix = type === "matrix";
        const expectStored = (expected: Array<any>, no: string): void => {
          expect(col1(getStorage()), no + ": the storage").toEqual(expected);
          expect(listValues(question), no + ": the list").toEqual(expected);
          expect(col1(question.value), no + ": question.value").toEqual(expected);
        };
        getCell(question, 1).value = "edited";
        expectStored(["a0", "edited", "a2"], "#1 edit");
        expect(objectValues(question), "#2").toEqual(["a0", "edited", "a2"]);
        if (isMatrix) question.addRow(); else question.addPanel();
        expectStored(["a0", "edited", "a2", undefined], "#3 add");
        expect(objectValues(question), "#4").toEqual(["a0", "edited", "a2", undefined]);
        if (isMatrix) question.removeRow(0); else question.removePanel(0);
        expectStored(["edited", "a2", undefined], "#5 remove");
        expect(objectValues(question), "#6").toEqual(["edited", "a2", undefined]);
        // A panel has no move of its own: the list's move is the one a drag would make.
        if (isMatrix) question.moveRowByIndex(0, 1); else question.getDataList().move(0, 1);
        expectStored(["a2", "edited", undefined], "#7 move");
        if (isMatrix) {
          expect(objectValues(question), "#8: the rows take the reordered records").toEqual(["a2", "edited", undefined]);
        }
        expect(question.survey.data.q, "#9: nothing reached the hash").toBe(undefined);
      });
    });
    test(type + ": count() is not asked of an assigned ArrayDynamicDataSource", async () => {
      const { question, countCalls } = await createAssigned(type, "ArrayDynamicDataSource");
      const list = question.getDataList();
      expectAll(question, ["a0", "a1", "a2"], "#1");
      expect(list.count, "#2").toBe(3);
      expect(list.loadedCount, "#3").toBe(3);
      expect(list.visibleCount, "#4").toBe(3);
      getCell(question, 0).value = "edited";
      if (type === "matrix") question.addRow(); else question.addPanel();
      expect(list.count, "#5").toBe(4);
      expect(countCalls(), "#6: the window answers the count").toBe(0);
    });
    /* assignSource sets isRemote before it swaps the source, and the hash is cleared in between: a
       handler that runs there still gets the question's own records from the list, not the window
       the list last committed. */
    test(type + ": inside the attach the list still reads through the question's own value", async () => {
      const { survey, question } = createQuestion(type);
      const list = question.getDataList();
      survey.setValue("q", records("h0", "h1"));
      expect(listValues(question), "#1: read through").toEqual(["h0", "h1"]);
      const seen: Array<any> = [];
      survey.onValueChanged.add((): void => { seen.push({ isRemote: list.isRemote, list: listValues(question), count: list.count }); });
      let arr: Array<any> = records("a0", "a1", "a2");
      question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
      await flush();
      expect(seen, "#2: the hash is cleared with the default source still in place").toEqual([{ isRemote: true, list: ["h0", "h1"], count: 2 }]);
      expectAll(question, ["a0", "a1", "a2"], "#3: then the assigned source is read");
      arr = records("outside");
      expectAll(question, ["a0", "a1", "a2"], "#4: and not read through");
    });
  });
  /* The window of an assigned array source keeps the list's own writes only. The push
     reaches the developer's array, but that array is not taken as the window, so an outside change
     does not slip into the list and question.value with the next edit while the rows/panels that
     were not edited still show the old records. */
  questionTypes.forEach((type: string): void => {
    sourceKinds.forEach((kind: string): void => {
      test(type + ", " + kind + ": an outside change does not enter the window with the next edit", async () => {
        const { question, getStorage, setStorage } = await createAssigned(type, kind);
        setStorage(records("outside0", "outside1", "outside2"));
        getCell(question, 2).value = "edited";
        expect(col1(getStorage()), "#1: the edit reaches the storage as it is now").toEqual(["outside0", "outside1", "edited"]);
        expectAll(question, ["a0", "a1", "edited"], "#2: the window has the edit and nothing else");
        if (type === "matrix") question.addRow(); else question.addPanel();
        expect(col1(getStorage()), "#3: an add").toEqual(["outside0", "outside1", "edited", undefined]);
        expectAll(question, ["a0", "a1", "edited", undefined], "#4");
        question.getDataList().refresh();
        await flush();
        expectAll(question, ["outside0", "outside1", "edited", undefined], "#5: after refresh()");
      });
    });
  });
  /* A storage that does not keep what it is handed - here it trims the strings. The list answers
     with what was stored, and so does question.value: the window takes the array a write has stored
     while nothing replaced that array outside the list. The panel writes every edit inside a list
     batch, where the array is stored when the batch ends; the matrix writes outside one. */
  const trimRecord = (record: any): any => !!record && typeof record.col1 === "string" && record.col1 !== record.col1.trim()
    ? Object.assign({}, record, { col1: record.col1.trim() }) : record;
  questionTypes.forEach((type: string): void => {
    test(type + ": an ArrayDynamicDataSource whose setter normalizes: the list and question.value hold what was stored", async () => {
      const { question } = createQuestion(type);
      let arr: Array<any> = records("a0", "a1", "a2");
      question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a.map(trimRecord); });
      await flush();
      getCell(question, 1).value = " edited ";
      expect(col1(arr), "#1: stored trimmed").toEqual(["a0", "edited", "a2"]);
      expect(listValues(question), "#2: the list").toEqual(["a0", "edited", "a2"]);
      expect(col1(question.value), "#3: question.value").toEqual(["a0", "edited", "a2"]);
      getCell(question, 0).value = "next";
      expect(col1(arr), "#4: the next edit").toEqual(["next", "edited", "a2"]);
      expect(listValues(question), "#5").toEqual(["next", "edited", "a2"]);
      expect(col1(question.value), "#6").toEqual(["next", "edited", "a2"]);
    });
    test(type + ": a SurveyDataDynamicDataSource whose survey normalizes the value: the list and question.value hold what was stored", async () => {
      const { survey, question } = createQuestion(type);
      survey.setValue("other", records("a0", "a1", "a2"));
      survey.onValueChanging.add((sender, options) => {
        if (options.name === "other" && Array.isArray(options.value)) options.value = options.value.map(trimRecord);
      });
      question.dataSource = new SurveyDataDynamicDataSource(survey, "other");
      await flush();
      getCell(question, 1).value = " edited ";
      expect(col1(survey.getValue("other")), "#1: stored trimmed").toEqual(["a0", "edited", "a2"]);
      expect(listValues(question), "#2: the list").toEqual(["a0", "edited", "a2"]);
      expect(col1(question.value), "#3: question.value").toEqual(["a0", "edited", "a2"]);
    });
  });
  /* The stored array can differ from the written one by more than a value, and a batch can fail. In
     both cases the window goes back to the storage and the list announces a reset, which the
     question follows as it follows a read: value and rows/panels are rebuilt for the records that
     are stored. */
  questionTypes.forEach((type: string): void => {
    test(type + ": a setter that drops the record of the last page: the question shows a page that exists", async () => {
      const { question } = createQuestion(type);
      if (type === "matrix") question.rowsPerPage = 2; else question.panelsPerPage = 2;
      let arr: Array<any> = records("a0", "a1", "a2");
      question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr,
        (a: Array<any>): void => { arr = a.filter((r: any): boolean => r.col1 !== "drop"); });
      await flush();
      question.goToPage(1);
      expect(objectValues(question), "#1: the last page").toEqual(["a2"]);
      getCell(question, 0).value = "drop";
      expect(col1(arr), "#2: the storage dropped the record").toEqual(["a0", "a1"]);
      expect(question.pageCount, "#3").toBe(1);
      expect(question.pageIndex, "#4: not left on a page that is gone").toBe(0);
      expect(objectValues(question), "#5: the rows/panels of that page").toEqual(["a0", "a1"]);
      expect(col1(question.value), "#6").toEqual(["a0", "a1"]);
      expect(listValues(question), "#7").toEqual(["a0", "a1"]);
    });
    test(type + ": a list batch that throws: the question goes back to the stored records", async () => {
      const { question, getStorage } = await createAssigned(type, "ArrayDynamicDataSource");
      const list = question.getDataList();
      expect((): void => {
        list.batch((): void => {
          list.setValue(0, "col1", "edited");
          list.remove(2);
          throw new Error("inside the batch");
        });
      }, "#1").toThrow("inside the batch");
      expect(col1(getStorage()), "#2: nothing was stored").toEqual(["a0", "a1", "a2"]);
      expectAll(question, ["a0", "a1", "a2"], "#3");
      getCell(question, 1).value = "next";
      expect(col1(getStorage()), "#4: the next edit").toEqual(["a0", "next", "a2"]);
      expectAll(question, ["a0", "next", "a2"], "#5");
    });
  });
  questionTypes.forEach((type: string): void => {
    test(type + ": after a detach the list reads through the question's value again", async () => {
      const { survey, question, setStorage } = await createAssigned(type, "ArrayDynamicDataSource");
      survey.setValue("q", records("h0", "h1"));
      question.dataSource = undefined;
      await flush();
      expectAll(question, ["h0", "h1"], "#1");
      setStorage(records("outside"));
      survey.setValue("q", records("h2", "h3", "h4"));
      expectAll(question, ["h2", "h3", "h4"], "#2: survey.setValue is seen at once");
    });
  });
});

describe("Remote data source: a page load is not an answer", () => {
  const loadWithExtra = async (extra: Array<any>, json?: any): Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel, source: FakeServerSource }> => {
    const source = new FakeServerSource(serverRecords(12));
    source.auto = false;
    const survey = new SurveyModel({
      elements: [Object.assign({ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5, columns: [{ name: "col1" }] }, json)].concat(extra)
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = source;
    return { survey: survey, question: question, source: source };
  };
  test("a page load fires no survey.onValueChanged", async () => {
    const { survey, question, source } = await loadWithExtra([]);
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    source.settleAll();
    await flush();
    expect(question.value.length, "#1: the window arrived").toBe(5);
    expect(changes, "#2: no value change").toEqual([]);
    question.nextPage();
    source.settleAll();
    await flush();
    expect(changes, "#3: still none").toEqual([]);
  });
  test("a page load runs no setvalue trigger", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] },
        { type: "text", name: "flag" }
      ],
      triggers: [{ type: "setvalue", expression: "{matrix} notempty", setToName: "flag", setValue: "fired" }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = new FakeServerSource(serverRecords(4));
    await flush();
    expect(question.value.length, "#1: loaded").toBe(4);
    expect(survey.getValue("flag"), "#2: the trigger never saw a value change").toBe(undefined);
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(survey.getValue("flag"), "#3: nor did a remote edit").toBe(undefined);
  });
  test("a page load does not auto-advance", async () => {
    const source = new FakeServerSource(serverRecords(4));
    const survey = new SurveyModel({
      autoAdvanceEnabled: true,
      pages: [
        { elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }] },
        { elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = source;
    await flush();
    expect(question.value.length, "#1: loaded").toBe(4);
    expect(survey.currentPageNo, "#2: still on the first page").toBe(0);
  });
  test("a page load does not re-run another question's visibleIf", async () => {
    const source = new FakeServerSource(serverRecords(4));
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] },
        { type: "text", name: "q2", visibleIf: "{matrix} notempty" }
      ]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const q2 = <Question>survey.getQuestionByName("q2");
    expect(q2.isVisible, "#1: hidden to start with").toBe(false);
    question.dataSource = source;
    await flush();
    expect(question.value.length, "#2: loaded").toBe(4);
    expect(q2.isVisible, "#3: the load is not a value change").toBe(false);
  });
  test("a remote edit does not make the question answered in the survey", async () => {
    const source = new FakeServerSource(serverRecords(4));
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    expect(survey.data, "#1: nothing in the hash").toEqual({});
  });
});

describe("Remote data source: limits, expressions and errors", () => {
  test("a total above settings.matrix.maxRowCount is accepted", async () => {
    const source = new FakeServerSource(serverRecords(3));
    source.readRange = (skip: number, take: number): Promise<IDynamicDataReadResult> =>
      Promise.resolve({ records: serverRecords(5), total: settings.matrix.maxRowCount + 500 });
    const { question } = await createMatrix(source);
    expect(question.rowCount, "#1: the server total, above the clamp").toBe(settings.matrix.maxRowCount + 500);
    expect(question.visibleRows.length, "#2: still one row per window record").toBe(5);
    expect(question.canAddRow, "#3: paging is on, the setting limits the page only").toBe(true);
    question.maxRowCount = settings.matrix.maxRowCount + 100;
    expect(question.canAddRow, "#4: the add path honours maxRowCount set on the question").toBe(false);
  });
  test("rowCountExpression is ignored while a source is attached", async () => {
    const source = new FakeServerSource(serverRecords(7));
    const { question } = await createMatrix(source, { rowsPerPage: 0, rowCountExpression: "3" });
    expect(question.rowCount, "#1: the server decides").toBe(7);
    expect(question.visibleRows.length, "#2").toBe(7);
    expect(question.canAddRow, "#3: the expression does not lock the add button either").toBe(true);
  });
  test("panelCountExpression is ignored while a source is attached", async () => {
    const source = new FakeServerSource(serverRecords(7));
    const { question } = await createPanel(source, { panelsPerPage: 0, panelCountExpression: "3" });
    expect(question.panelCount, "#1").toBe(7);
    expect(question.panels.length, "#2").toBe(7);
    expect(question.canAddPanel, "#3").toBe(true);
  });
  test("the rowCount setter is a no-op while a source is attached", async () => {
    const source = new FakeServerSource(serverRecords(7));
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    question.rowCount = 2;
    expect(question.rowCount, "#1: unchanged").toBe(7);
    expect(question.value.length, "#2: the window was not truncated").toBe(7);
    expect(source.callsOf("remove").length, "#3: nothing was deleted on the server").toBe(0);
  });
  test("the panelCount setter is a no-op while a source is attached", async () => {
    const source = new FakeServerSource(serverRecords(7));
    const { question } = await createPanel(source, { panelsPerPage: 0 });
    question.panelCount = 2;
    expect(question.panelCount, "#1").toBe(7);
    expect(question.panels.length, "#2").toBe(7);
    expect(source.callsOf("remove").length, "#3").toBe(0);
  });
  test("a rejected update raises onDynamicDataError and keeps the local value", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<any> = [];
    survey.onDynamicDataError.add((sender, options) => {
      errors.push({ name: options.question.name, operation: options.operation, message: options.error.message });
    });
    source.auto = false;
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    source.pending[0].fail(new Error("server said no"));
    await flush();
    expect(errors.length, "#1: one error").toBe(1);
    expect(errors[0], "#2").toEqual({ name: "matrix", operation: "update", message: "server said no" });
    expect(question.value[0].col1, "#3: the local change is kept").toBe("edited");
  });
  test("a rejected read raises onDynamicDataError with the read operation", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { survey, question } = await createMatrix(source);
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
    source.auto = false;
    question.nextPage();
    source.pending[0].fail(new Error("boom"));
    await flush();
    expect(errors, "#1").toEqual(["read"]);
  });
  test("panel: a rejected update raises onDynamicDataError", async () => {
    const source = new FakeServerSource(serverRecords(6));
    const { survey, question } = await createPanel(source, { panelsPerPage: 0 });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { errors.push(options.question.name + ":" + options.operation); });
    source.auto = false;
    question.panels[0].getQuestionByName("col1").value = "edited";
    source.pending[0].fail(new Error("no"));
    await flush();
    expect(errors, "#1").toEqual(["panel:update"]);
  });
});

describe("Remote data source: currentPanel and dispose", () => {
  test("currentPanel is the first panel of the new page after a page change", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { displayMode: "tab" });
    expect(question.panels.length, "#1").toBe(5);
    question.currentIndex = 2;
    expect(question.currentPanel.getQuestionByName("col1").value, "#2").toBe("v2");
    question.goToPage(1);
    await flush();
    expect(question.currentPanel.getQuestionByName("col1").value,
      "#3: the remembered index named another record on the new page").toBe("v5");
  });
  test("currentPanel keeps its position after a refresh of the same page", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { displayMode: "tab" });
    question.goToPage(1);
    await flush();
    // currentIndex is the position in the whole list, on every page.
    question.currentIndex = 7;
    expect(question.currentPanel.getQuestionByName("col1").value, "#1").toBe("v7");
    question.refreshView();
    await flush();
    expect(question.currentPanel.getQuestionByName("col1").value, "#2: the same position").toBe("v7");
  });
  test("dispose during a pending read does not throw and writes nothing", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.nextPage();
    question.dispose();
    expect(() => { source.settleAll(); }).not.toThrow();
    await flush();
    expect(source.callsOf("update").length, "#1: nothing was written").toBe(0);
  });
  test("dispose during a pending write does not throw", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    source.auto = false;
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    question.dispose();
    expect(() => { source.settleAll(); }).not.toThrow();
    await flush();
  });
});

describe("Remote data source: the window is the page", () => {
  test("matrix: the rows of a source-paged page are the page, not a slice of it", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    expect(question.rowsOnPage.length, "#1: the first page").toBe(5);
    question.nextPage();
    await flush();
    expect(question.visibleRows.length, "#2: the rows exist for the window").toBe(5);
    expect(question.rowsOnPage.length, "#3: and they ARE the page - no second slice by pageIndex").toBe(5);
    expect(question.rowsOnPage === question.visibleRows, "#4: the same instance").toBe(true);
    expect(question.renderedTable.rows.length > 0, "#5: the table renders them").toBe(true);
  });
  test("panel: the panels of a source-paged page are the page", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source);
    question.nextPage();
    await flush();
    expect(question.panelsOnPage.length, "#1").toBe(5);
    expect(question.renderedPanels.length, "#2: the renderers see them").toBe(5);
    expect(panelValues(question), "#3").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("matrix: addRow keeps the page the row was added to", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.addRow();
    await flush();
    expect(question.pageIndex, "#1: the record went into this window, so the page does not move").toBe(1);
    expect(question.rowsOnPage.length, "#2: the new row is on it").toBe(6);
    expect(source.callsOf("readRange").length, "#3: no page was re-read").toBe(0);
  });
  test("panel: addPanel keeps the page the panel was added to", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.addPanel();
    await flush();
    expect(question.pageIndex, "#1").toBe(1);
    expect(question.panelsOnPage.length, "#2").toBe(6);
    expect(source.callsOf("readRange").length, "#3: no page was re-read").toBe(0);
  });
});

describe("Remote data source: replacing a source", () => {
  test("a source replaced while its first read is pending is read", async () => {
    const first = new FakeServerSource(serverRecords(4));
    first.auto = false;
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = first;
    expect(question.isDataLoading, "#1: the first read is in flight").toBe(true);
    const second = new FakeServerSource(serverRecords(7));
    question.dataSource = second;
    await flush();
    expect(second.calls.length > 0, "#2: the replacement was read").toBe(true);
    expect(question.rowCount, "#3: its window is what the question shows").toBe(7);
    expect(question.isDataLoading, "#4").toBe(false);
    first.settleAll();
    await flush();
    expect(question.rowCount, "#5: the abandoned read cannot write back").toBe(7);
  });
  test("a filter set before the source is attached is handed to the source", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.filterExpression = "{col1} = 'v3'";
    const source = new FakeServerSource(serverRecords(12));
    question.dataSource = source;
    await flush();
    expect(source.requests[0].filter, "#1: the source owns it now and was told").toBe("{col1} = 'v3'");
    expect(source.callsOf("readRange").length, "#2: one read, with the filter already in force").toBe(1);
    expect(question.rowCount, "#3").toBe(1);
    expect(rowValues(question), "#4").toEqual(["v3"]);
  });
  test("a sort set before the source is attached is handed to the source", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }, { name: "col2" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.sortOrder = [{ field: "col2", direction: "desc" }];
    const source = new FakeServerSource(serverRecords(4));
    question.dataSource = source;
    await flush();
    expect(source.requests[0].sort, "#1").toEqual([{ field: "col2", direction: "desc" }]);
    expect(rowValues(question), "#2: the server sorted before it answered").toEqual(["v3", "v2", "v1", "v0"]);
  });
  test("detaching to a source that does not filter restores the local filter", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = new FakeServerSource(serverRecords(12));
    await flush();
    question.filterExpression = "{col1} = 'v3'";
    await flush();
    expect(question.rowCount, "#1: the server filtered").toBe(1);
    question.dataSource = undefined;
    await flush();
    survey.setValue("matrix", [{ col1: "v3" }, { col1: "v9" }]);
    expect(question.filterExpression, "#2: the filter survived the detach").toBe("{col1} = 'v3'");
    expect(question.visibleRows.length, "#3: and the list runs it locally again").toBe(1);
    expect(rowValues(question), "#4").toEqual(["v3"]);
  });
});

// A source that pages itself and answers from memory: every read and every write completes inside
// the call, so a refill happens inside the remove that caused it.
class SyncPagingSource implements IDynamicDataSource {
  public readRanges: Array<Array<number>> = [];
  constructor(public records: Array<any>) { }
  public read(): Array<any> {
    return this.records.slice();
  }
  public readRange(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.readRanges.push([request.skip, request.take]);
    const size = request.take > 0 ? request.take : this.records.length;
    return {
      records: this.records.slice(request.skip, request.skip + size).map(r => Object.assign({}, r)),
      total: this.records.length
    };
  }
  public update(sourceIndex: number, record: any): void {
    this.records[sourceIndex] = Object.assign({}, record);
  }
  public insert(record: any, sourceIndex: number): void {
    this.records.splice(sourceIndex, 0, Object.assign({}, record));
  }
  public remove(sourceIndex: number): void {
    this.records.splice(sourceIndex, 1);
  }
}
const REFILL_TURNS = 300;
// A row object is not a Base: it is disposed through the questions of its cells.
function isRowDisposed(row: any): boolean {
  return row.cells.some((cell: any): boolean => cell.question.isDisposed);
}

describe("Remote data source: a removed record refills the page", () => {
  test("[R] matrix: removeRow on page one of three leaves ten rows and fires no value change", async () => {
    const source = new FakeServerSource(serverRecords(30));
    const { survey, question } = await createMatrix(source, { rowsPerPage: 10 });
    question.removeRow(0);
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    await flush(REFILL_TURNS);
    expect(question.visibleRows.length, "#1").toBe(10);
    expect(question.value.length, "#2").toBe(10);
    expect(question.rowCount, "#3").toBe(29);
    expect(rowValues(question)[9], "#4: the first record of the old second page").toBe("v10");
    expect(changes, "#5: the refill is a page load, not an answer").toEqual([]);
  });
  test("[R] panel: removePanel on page one of three leaves ten panels and fires no value change", async () => {
    const source = new FakeServerSource(serverRecords(30));
    const { survey, question } = await createPanel(source, { panelsPerPage: 10 });
    question.removePanel(0);
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    await flush(REFILL_TURNS);
    expect(question.panels.length, "#1").toBe(10);
    expect(question.value.length, "#2").toBe(10);
    expect(question.panelCount, "#3").toBe(29);
    expect(panelValues(question)[9], "#4").toBe("v10");
    expect(changes, "#5").toEqual([]);
  });
});

describe("Remote data source: the focus after a row is removed from a refilled page", () => {
  let focusSpy: any;
  let addButtonSpy: any;
  beforeEach(() => {
    vi.useFakeTimers();
    focusSpy = vi.spyOn(QuestionMatrixDropdownRenderedTable.prototype, "focusActionCell").mockImplementation(() => { });
    addButtonSpy = vi.spyOn(QuestionMatrixDynamicModel.prototype, "focusAddBUtton").mockImplementation(() => { });
  });
  afterEach(() => {
    focusSpy.mockRestore();
    addButtonSpy.mockRestore();
    vi.useRealTimers();
  });
  const createPagedMatrix = async (source: IDynamicDataSource): Promise<QuestionMatrixDynamicModel> => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 10, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = source;
    await flush(REFILL_TURNS);
    return question;
  };
  const focusedRow = (callIndex: number): any => focusSpy.mock.calls[callIndex][0];
  const createDeferred = async (): Promise<{ question: QuestionMatrixDynamicModel, source: FakeServerSource }> => {
    const source = new FakeServerSource(serverRecords(30));
    const question = await createPagedMatrix(source);
    source.auto = false;
    return { question: question, source: source };
  };
  test("[P] a synchronous source: the row now at that position is focused", async () => {
    const source = new SyncPagingSource(serverRecords(30));
    const question = await createPagedMatrix(source);
    question.removeRowUI(question.visibleRows[0]);
    vi.advanceTimersByTime(10);
    expect(focusSpy.mock.calls.length, "#1").toBe(1);
    const row = focusedRow(0);
    expect(row === question.visibleRows[0], "#2: the row at that position").toBe(true);
    expect(isRowDisposed(row), "#3").toBe(false);
    expect(row.getQuestionByName("col1").value, "#4").toBe("v1");
    vi.advanceTimersByTime(100);
    expect(focusSpy.mock.calls.length, "#5: once").toBe(1);
  });
  test("[P] a deferred source: a row of the short window is focused while the refill is pending", async () => {
    const { question, source } = await createDeferred();
    question.removeRowUI(question.visibleRows[0]);
    vi.advanceTimersByTime(10);
    expect(focusSpy.mock.calls.length, "#1").toBe(1);
    const row = focusedRow(0);
    expect(row === question.visibleRows[0], "#2").toBe(true);
    expect(row.getQuestionByName("col1").value, "#3").toBe("v1");
    expect(question.visibleRows.length, "#4: the short window").toBe(9);
    source.settleAll();
  });
  test("[R] a deferred source: the rebuilt row at that position is focused after the refill", async () => {
    const { question, source } = await createDeferred();
    question.removeRowUI(question.visibleRows[0]);
    vi.advanceTimersByTime(10);
    const shortRow = focusedRow(0);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(source.pending.length, "#1: the refill is in flight").toBe(1);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(question.visibleRows.length, "#2: the page is full again").toBe(10);
    expect(focusSpy.mock.calls.length, "#3: not before the rows are rendered").toBe(1);
    vi.advanceTimersByTime(10);
    expect(focusSpy.mock.calls.length, "#4: focused again").toBe(2);
    const row = focusedRow(1);
    expect(row === question.visibleRows[0], "#5: the rebuilt row").toBe(true);
    expect(row !== shortRow, "#6: not the row of the short window").toBe(true);
    expect(isRowDisposed(row), "#7: not a disposed row").toBe(false);
    expect(row.getQuestionByName("col1").value, "#8").toBe("v1");
  });
  test("[R] the last row of a page: the clamped position after the refill", async () => {
    const { question, source } = await createDeferred();
    question.removeRowUI(question.visibleRows[9]);
    vi.advanceTimersByTime(10);
    expect(focusedRow(0).getQuestionByName("col1").value, "#1: the new last row of the short window").toBe("v8");
    source.settleAll();
    await flush(REFILL_TURNS);
    source.settleAll();
    await flush(REFILL_TURNS);
    vi.advanceTimersByTime(10);
    expect(focusSpy.mock.calls.length, "#2").toBe(2);
    expect(focusedRow(1).getQuestionByName("col1").value, "#3: position 9 is filled again").toBe("v10");
  });
  test("[R] the stored position is dropped when the refill is rejected", async () => {
    const { question, source } = await createDeferred();
    question.removeRowUI(question.visibleRows[0]);
    vi.advanceTimersByTime(10);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(source.pending.length, "#1: the refill is in flight").toBe(1);
    source.pending[0].fail(new Error("boom"));
    await flush(REFILL_TURNS);
    vi.advanceTimersByTime(100);
    expect(focusSpy.mock.calls.length, "#2: focused once").toBe(1);
    expect(question.visibleRows.length, "#3: the short window stays").toBe(9);
    // A later read of the same page is not a refill of that removal.
    source.auto = true;
    question.refreshView();
    await flush(REFILL_TURNS);
    vi.advanceTimersByTime(100);
    expect(focusSpy.mock.calls.length, "#4").toBe(1);
  });
  test("[R] the stored position is dropped when the page changes in between", async () => {
    const { question, source } = await createDeferred();
    question.removeRowUI(question.visibleRows[0]);
    vi.advanceTimersByTime(10);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(source.pending.length, "#1: the refill is in flight").toBe(1);
    question.nextPage();
    source.settleAll();
    await flush(REFILL_TURNS);
    vi.advanceTimersByTime(100);
    expect(question.pageIndex, "#2").toBe(1);
    expect(focusSpy.mock.calls.length, "#3: focused once").toBe(1);
  });
  test("[R] the stored position is dropped when the focus has left the question", async () => {
    const { question, source } = await createDeferred();
    question.removeRowUI(question.visibleRows[0]);
    vi.advanceTimersByTime(10);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(source.pending.length, "#1: the refill is in flight").toBe(1);
    const outside = document.createElement("input");
    document.body.appendChild(outside);
    outside.focus();
    expect(document.activeElement === outside, "#2").toBe(true);
    source.settleAll();
    await flush(REFILL_TURNS);
    vi.advanceTimersByTime(100);
    expect(focusSpy.mock.calls.length, "#3: focused once").toBe(1);
    expect(document.activeElement === outside, "#4").toBe(true);
    outside.remove();
  });
  test("[R] panel: the remove button at that position is focused again after the refill", async () => {
    const focusElementSpy = vi.spyOn(SurveyElement, "FocusElement").mockImplementation(() => true);
    try {
      const source = new FakeServerSource(serverRecords(30));
      const { question } = await createPanel(source, { panelsPerPage: 10 });
      source.auto = false;
      question.removePanelUI(question.panels[0]);
      expect(focusElementSpy.mock.calls.length, "#1: focused at once, as before").toBe(1);
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(source.pending.length, "#2: the refill is in flight").toBe(1);
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(question.panels.length, "#3").toBe(10);
      expect(focusElementSpy.mock.calls.length, "#4: focused again after the rebuild").toBe(2);
      const target: any = focusElementSpy.mock.calls[1][0];
      expect(typeof target, "#5: resolved when the focus runs").toBe("function");
      expect(focusElementSpy.mock.calls[1][1], "#6: after the render timeout").toBe(true);
    } finally {
      focusElementSpy.mockRestore();
    }
  });
});

describe("Remote data source: the authored view costs one read", () => {
  /* W4: a sort and a filter authored in the JSON, handed to a source that pages. The two setters
     used to reach the source one after the other - a push and a read each - and the request carries
     both, so the whole authored view is one round trip. */
  const matrixJson = {
    type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5,
    sortBy: "col2-", filterExpression: "{col1} = 'v7'", columns: [{ name: "col1" }, { name: "col2" }]
  };
  const panelJson = {
    type: "paneldynamic", name: "panel", panelCount: 0, panelsPerPage: 5,
    sortBy: "col2-", filterExpression: "{col1} = 'v7'",
    templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }]
  };
  const authoredSort = [{ field: "col2", direction: "desc" }];
  test("matrix: a source attached after the load reads once, with both inside the request", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const survey = new SurveyModel({ elements: [matrixJson] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = source;
    await flush();
    expect(source.requests.length, "#1: exactly one read").toBe(1);
    expect(source.calls.length, "#2: and exactly one call - nothing is pushed first").toBe(1);
    expect(source.requests[0].filter, "#3").toBe("{col1} = 'v7'");
    expect(source.requests[0].sort, "#4").toEqual(authoredSort);
    expect(question.rowCount, "#5: the server filtered").toBe(1);
    expect(rowValues(question), "#6").toEqual(["v7"]);
  });
  test("panel: a source attached after the load reads once, with both inside the request", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const survey = new SurveyModel({ elements: [panelJson] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.dataSource = source;
    await flush();
    expect(source.requests.length, "#1: exactly one read").toBe(1);
    expect(source.calls.length, "#2").toBe(1);
    expect(source.requests[0].filter, "#3").toBe("{col1} = 'v7'");
    expect(source.requests[0].sort, "#4").toEqual(authoredSort);
    expect(panelValues(question), "#5").toEqual(["v7"]);
  });
  /* Attached from onQuestionAdded, i.e. before the question has finished loading: the attach reads
     by itself, with nothing authored yet, and the authored view then costs ONE read on top of it -
     it used to cost two. The attach read is a separate matter (it is also unpaged: the page size
     has not reached the list at that point) and this step does not change it. */
  test("matrix: a source attached while the question loads adds one read for the whole view", async () => {
    const source = new FakeServerSource(serverRecords(20));
    const survey = new SurveyModel();
    survey.onQuestionAdded.add((sender: SurveyModel, options: any): void => {
      (<any>options.question).dataSource = source;
    });
    survey.fromJSON({ elements: [matrixJson] });
    await flush();
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(source.requests.length, "#1: the attach, then the authored view").toBe(2);
    expect(source.requests[0].filter, "#2: nothing was authored yet at the attach").toBe("");
    expect(source.requests[1].filter, "#3: one read for both").toBe("{col1} = 'v7'");
    expect(source.requests[1].sort, "#4").toEqual(authoredSort);
    expect(rowValues(question), "#5").toEqual(["v7"]);
  });
});

describe("Remote data source: a total the source does not know", () => {
  const createNoTotalSource = (count: number): FakeServerSource => {
    const source = new FakeServerSource(serverRecords(count));
    source.reportTotal = false;
    return source;
  };
  test("matrix: the row count is a lower bound and the pager walks to the end", async () => {
    const source = createNoTotalSource(25);
    const { question } = await createMatrix(source, { rowsPerPage: 10 });
    expect(question.isRowCountKnown, "#1").toBe(false);
    expect(question.rowCount, "#2: the rows known to exist").toBe(10);
    expect(question.pageCount, "#3").toBe(2);
    expect(question.canGoNextPage, "#4").toBe(true);
    question.nextPage();
    await flush();
    expect(question.rowCount, "#5").toBe(20);
    expect(question.pageCount, "#6").toBe(3);
    question.nextPage();
    await flush();
    expect(question.visibleRows.length, "#7: the last page is short").toBe(5);
    expect(question.rowCount, "#8: and the count is exact now").toBe(25);
    expect(question.pageCount, "#9").toBe(3);
    expect(question.canGoNextPage, "#10: nothing behind it").toBe(false);
  });
  test("matrix: the pager shows the page number alone while the count is unknown", async () => {
    const source = createNoTotalSource(25);
    const { question } = await createMatrix(source, { rowsPerPage: 10 });
    const info = question.pagerActions.getActionById("sv-pager-info");
    expect(info.title, "#1: no total to show").toBe("1");
    question.nextPage();
    await flush();
    expect(info.title, "#2: still walking").toBe("2");
    question.nextPage();
    await flush();
    // The last page settles the count, so the total can be shown from here on.
    expect(info.title, "#3: the end was reached").toBe("3 of 3");
    question.prevPage();
    await flush();
    expect(info.title, "#4: and it is not forgotten on the way back").toBe("2 of 3");
  });
  test("matrix: the pager follows the locale once an unknown count becomes known", async () => {
    const source = createNoTotalSource(25);
    const { question } = await createMatrix(source, { rowsPerPage: 10 });
    const info = question.pagerActions.getActionById("sv-pager-info");
    expect(info.title, "#1: no total to show").toBe("1");
    question.nextPage();
    await flush();
    question.nextPage();
    await flush();
    expect(info.title, "#2: the end was reached").toBe("3 of 3");
    (<SurveyModel>question.survey).locale = "de";
    expect(info.title, "#3: the locale is observed").toBe("3 von 3");
  });
  test("panel: the panel count is a lower bound and isPanelCountKnown says so", async () => {
    const source = createNoTotalSource(25);
    const { question } = await createPanel(source, { panelsPerPage: 10 });
    expect(question.isPanelCountKnown, "#1").toBe(false);
    expect(question.panelCount, "#2: the records known to exist").toBe(10);
    expect(question.pageCount, "#3").toBe(2);
    question.nextPage();
    await flush();
    question.nextPage();
    await flush();
    expect(question.panels.length, "#4").toBe(5);
    expect(question.panelCount, "#5").toBe(25);
    // Reaching the end settles the count: there is nothing behind the last record.
    expect(question.isPanelCountKnown, "#6").toBe(true);
    expect(question.pageCount, "#7").toBe(3);
  });
  test("a source that reports its total leaves both questions knowing it", async () => {
    const { question } = await createMatrix(new FakeServerSource(serverRecords(25)), { rowsPerPage: 10 });
    expect(question.isRowCountKnown, "#1").toBe(true);
    expect(question.rowCount, "#2").toBe(25);
    expect(question.pageCount, "#3").toBe(3);
  });
});

describe("Remote data source: the operation of a failed read", () => {
  test("a readRange that rejects a filter reports read, not filter", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { survey, question } = await createMatrix(source);
    const operations: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { operations.push(options.operation); });
    source.auto = false;
    question.filterExpression = "{col1} = 'v3'";
    source.pending.forEach((call: IServerCall): void => call.fail(new Error("no such column")));
    await flush();
    expect(operations, "#1").toEqual(["read"]);
  });
});

/* A keyed source: keyField is set, and serverRecords(n, 100) gives every record an id that is NOT
   its position (100, 101, ... at positions 0, 1, ...), so an assertion on the key cannot pass by
   coincidence. */
function keyedSource(count: number, capabilities?: Array<string>): FakeServerSource {
  return new FakeServerSource(serverRecords(count, 100), capabilities, "id");
}
function recordWithKey(source: FakeServerSource, key: any): any {
  return source.records.filter((record: any): boolean => record.id === key)[0];
}

describe("Remote data source: a keyed source addresses records by key", () => {
  test("matrix: a cell edit on the second page carries the key, not the position", async () => {
    const source = keyedSource(20);
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    await flush();
    const args = source.argsOf("update")[0];
    expect(args[0], "#1: the id of the record at position 5, not 5").toBe(105);
    expect(args[1].col1, "#2: the complete record").toBe("edited");
    expect(args[2], "#3: the changed fields").toEqual(["col1"]);
    expect(recordWithKey(source, 105).col1, "#4: the server record").toBe("edited");
  });
  test("panel: a field edit on the second page carries the key", async () => {
    const source = keyedSource(20);
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.panels[0].getQuestionByName("col1").value = "edited";
    await flush();
    expect(source.argsOf("update")[0][0], "#1").toBe(105);
    expect(recordWithKey(source, 105).col1, "#2").toBe("edited");
  });
  test("matrix: removeRow carries the key", async () => {
    const source = keyedSource(20);
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.removeRow(2);
    await flush();
    expect(source.argsOf("remove")[0], "#1: the id at position 7").toEqual([107]);
    expect(recordWithKey(source, 107), "#2: it is gone from the server").toBe(undefined);
    expect(source.records.length, "#3").toBe(19);
  });
  test("panel: removePanel carries the key", async () => {
    const source = keyedSource(20);
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.removePanel(2);
    await flush();
    expect(source.argsOf("remove")[0], "#1").toEqual([107]);
    expect(recordWithKey(source, 107), "#2").toBe(undefined);
  });
  test("matrix: a drag reorder carries the key and a target position", async () => {
    const source = keyedSource(20);
    const { question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    source.reset();
    question.moveRowByIndex(0, 2);
    await flush();
    expect(source.argsOf("move")[0], "#1: the id that moved, and where to").toEqual([105, 7]);
    expect(source.records.slice(5, 10).map((r: any): any => r.id), "#2").toEqual([106, 107, 105, 108, 109]);
    expect(rowValues(question), "#3").toEqual(["v106", "v107", "v105", "v108", "v109"]);
  });
  test("[R] the server reorders its records behind the grid: the edit still reaches the right record",
    async () => {
      const source = keyedSource(20);
      const { question } = await createMatrix(source);
      source.reset();
      /* Another user moves a record from the far end to the front. The window the respondent is
         looking at is the one that was read, so "the row at position 0" is no longer record 100. */
      source.moveRecordBehindTheGrid(10, 0);
      question.visibleRows[0].getQuestionByName("col1").value = "edited";
      await flush();
      expect(source.argsOf("update")[0][0], "#1: the key of the edited record").toBe(100);
      expect(recordWithKey(source, 100).col1, "#2: the record the respondent edited").toBe("edited");
      expect(recordWithKey(source, 110).col1, "#3: the record that moved in front is untouched")
        .toBe("v110");
    });
  test("keyName is not the key: a source without keyField still gets positions", async () => {
    const source = new FakeServerSource(serverRecords(20, 100));
    const { question } = await createMatrix(source, { keyName: "col1" });
    question.goToPage(1);
    await flush();
    source.reset();
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    await flush();
    expect(question.keyName, "#1: the uniqueness validator is set").toBe("col1");
    expect(source.argsOf("update")[0][0], "#2: the source index, not the record field").toBe(5);
  });
});

describe("Remote data source: a keyed source and a read in flight", () => {
  test("[R] a record moved between the pages does not commit a stale page", async () => {
    const source = keyedSource(20);
    const { question } = await createMatrix(source);
    source.auto = false;
    source.reset();
    question.goToPage(1);
    /* While the page-2 read is in flight another writer moves record 102 - which the respondent can
       still see on the committed page 1 - into the range that read asked for. The answer will carry
       it with the value it had before the edit below. */
    source.moveRecordBehindTheGrid(2, 7);
    question.visibleRows[2].getQuestionByName("col1").value = "edited";
    source.settleAll();
    await flush();
    source.settleAll();
    await flush();
    expect(source.ranges, "#1: the stale answer was discarded and the page read again")
      .toEqual([[5, 5], [5, 5]]);
    expect(rowValues(question), "#2: the committed page shows the edit")
      .toEqual(["v106", "v107", "edited", "v108", "v109"]);
    expect(source.argsOf("update")[0][0], "#3: the edit named the record, not its position").toBe(102);
    expect(recordWithKey(source, 102).col1, "#4: and so does the server").toBe("edited");
  });
  test("an edit of a record the answer does not contain commits it as it is", async () => {
    const source = keyedSource(20);
    const { question } = await createMatrix(source);
    source.auto = false;
    source.reset();
    question.goToPage(1);
    question.visibleRows[2].getQuestionByName("col1").value = "edited";
    source.settleAll();
    await flush();
    source.settleAll();
    await flush();
    expect(source.ranges, "#1: one read, the answer was not stale").toEqual([[5, 5]]);
    expect(rowValues(question), "#2").toEqual(["v105", "v106", "v107", "v108", "v109"]);
  });
});

describe("Remote data source: a record without a key", () => {
  test("the insert answer brings the key and later edits use it", async () => {
    const source = keyedSource(3);
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    source.reset();
    question.addRow();
    const row = question.visibleRows[3];
    await flush();
    expect(source.argsOf("insert")[0][1], "#1: appended").toBe(3);
    expect(question.value[3].id, "#2: the key the server assigned").toBe(1000);
    expect(question.visibleRows[3], "#3: the row object survived the merge").toBe(row);
    row.getQuestionByName("col1").value = "typed";
    await flush();
    expect(source.argsOf("update")[0][0], "#4: the edit names the new record").toBe(1000);
    expect(recordWithKey(source, 1000).col1, "#5").toBe("typed");
  });
  test("a field edited between the insert and its answer keeps the client value", async () => {
    const source = keyedSource(3);
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<any> = [];
    survey.onDynamicDataError.add((sender, options) => {
      errors.push({ operation: options.operation, message: options.error.message });
    });
    source.auto = false;
    source.reset();
    question.addRow();
    question.visibleRows[3].getQuestionByName("col1").value = "typed";
    expect(source.callsOf("update").length, "#1: no update before the answer").toBe(0);
    expect(question.value[3].col1, "#2: the respondent sees it").toBe("typed");
    source.auto = true;
    source.settleAll();
    await flush();
    expect(source.argsOf("update").length, "#3: queued behind the insert, sent once").toBe(1);
    expect(source.argsOf("update")[0][0], "#3a: with the assigned key").toBe(1000);
    expect(source.argsOf("update")[0][1].col1, "#3b").toBe("typed");
    expect(errors, "#3c: no error").toEqual([]);
    expect(recordWithKey(source, 1000).col1, "#3d: the server has it").toBe("typed");
    expect(question.value[3], "#4: the key landed, the client value won")
      .toEqual({ id: 1000, col1: "typed" });
    question.visibleRows[3].getQuestionByName("col2").value = 42;
    await flush();
    expect(source.argsOf("update")[1][0], "#5: an edit made now is delivered").toBe(1000);
    expect(errors.length, "#6: no error").toBe(0);
  });
  test("an insert that answers with nothing leaves the record keyless", async () => {
    const source = keyedSource(3);
    source.insertAnswersRecord = false;
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
    source.reset();
    question.addRow();
    await flush();
    expect(question.value[3].id, "#1: no key").toBe(undefined);
    question.visibleRows[3].getQuestionByName("col1").value = "typed";
    await flush();
    expect(source.callsOf("update").length, "#2: nothing was pushed").toBe(0);
    expect(errors, "#3: reported, not thrown").toEqual(["update"]);
    expect(question.value[3].col1, "#4").toBe("typed");
  });
  test("the next read reconciles a record whose edits were not delivered", async () => {
    const source = keyedSource(3);
    source.insertAnswersRecord = false;
    const { question } = await createMatrix(source, { rowsPerPage: 0 });
    question.addRow();
    await flush();
    question.visibleRows[3].getQuestionByName("col1").value = "typed";
    await flush();
    question.refreshView();
    await flush();
    expect(rowValues(question), "#1: the server value, not the undelivered edit")
      .toEqual(["v100", "v101", "v102", undefined]);
  });
  test("a remove before the insert answers is sent after it", async () => {
    const source = keyedSource(3);
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<any> = [];
    survey.onDynamicDataError.add((sender, options) => {
      errors.push(options.operation + ":" + options.error.message);
    });
    source.auto = false;
    source.reset();
    question.addRow();
    question.removeRow(3);
    expect(source.callsOf("remove").length, "#1: not before the answer").toBe(0);
    expect(question.rowCount, "#2: the row is gone locally").toBe(3);
    source.auto = true;
    source.settleAll();
    await flush();
    expect(source.argsOf("remove"), "#3: sent with the assigned key").toEqual([[1000]]);
    expect(errors, "#4: no error").toEqual([]);
    expect(recordWithKey(source, 1000), "#5: the server no longer has the record").toBe(undefined);
    expect(source.records.length, "#6").toBe(3);
  });
  /* A write made before the insert answers waits for the key behind it. Drained this way: auto
     from now on, settle the held insert, and let the chain run the rest. */
  async function drain(source: FakeServerSource): Promise<void> {
    source.auto = true;
    source.settleAll();
    await flush();
  }
  test("a move before the insert answers is sent after it", async () => {
    const source = keyedSource(3);
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
    source.auto = false;
    source.reset();
    question.addRow();
    question.moveRowByIndex(3, 0);
    expect(source.callsOf("move").length, "#1: not before the answer").toBe(0);
    await drain(source);
    expect(source.argsOf("move"), "#2: the assigned key and the target").toEqual([[1000, 0]]);
    expect(source.records.map((r: any): any => r.id), "#3: the server order matches the window")
      .toEqual(question.value.map((r: any): any => r.id));
    expect(question.value.map((r: any): any => r.id), "#4").toEqual([1000, 100, 101, 102]);
    expect(errors, "#5").toEqual([]);
  });
  ["matrix", "panel"].forEach((type: string): void => {
    test(type + ": a queued update carries the server-filled fields", async () => {
      const source = keyedSource(3);
      source.insertDefaults = { createdBy: "server" };
      source.auto = false;
      if (type === "matrix") {
        const { question } = await createMatrix(source, { rowsPerPage: 0 });
        source.settleAll();
        await flush();
        source.reset();
        question.addRow();
        question.visibleRows[3].getQuestionByName("col1").value = "typed";
      } else {
        const { question } = await createPanel(source, { panelsPerPage: 0 });
        source.settleAll();
        await flush();
        source.reset();
        question.addPanel();
        question.panels[3].getQuestionByName("col1").value = "typed";
      }
      await drain(source);
      const updates = source.argsOf("update");
      expect(updates.length, "#1").toBe(1);
      expect(updates[0][0], "#2: the assigned key").toBe(1000);
      expect(updates[0][1], "#3: the answer's fields, the client's, and the key")
        .toEqual({ id: 1000, createdBy: "server", col1: "typed" });
      expect(recordWithKey(source, 1000).createdBy, "#4: not blanked by the whole-record update").toBe("server");
    });
  });
  test("a later queued update that fails leaves the server-filled field of the earlier one in place", async () => {
    const source = keyedSource(3);
    source.insertDefaults = { col2: 7 };
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
    source.auto = false;
    source.reset();
    question.addRow();
    question.visibleRows[3].getQuestionByName("col1").value = "typed";
    question.visibleRows[3].getQuestionByName("col2").value = 42;
    // One link of the chain at a time: the insert, the first update, then the second one fails.
    source.settleAll();
    await flush();
    expect(source.argsOf("update")[0][1], "#1: the first update owns col1 only")
      .toEqual({ id: 1000, col1: "typed", col2: 7 });
    source.settleAll();
    await flush();
    source.pending[0].fail(new Error("boom"));
    await flush();
    expect(errors, "#2").toEqual(["update"]);
    expect(recordWithKey(source, 1000), "#3: the server default survived the failed update")
      .toEqual({ id: 1000, col1: "typed", col2: 7 });
  });
  test("the writes behind a rejected insert are reported one by one", async () => {
    const source = keyedSource(3);
    const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation + ":" + options.error.message); });
    source.auto = false;
    source.reset();
    question.addRow();
    question.visibleRows[3].getQuestionByName("col1").value = "typed";
    expect(question.value[3].col1, "#1: the local value stays").toBe("typed");
    question.removeRow(3);
    expect(source.pending.map((call: any): string => call.op), "#2: only the insert was called").toEqual(["insert"]);
    source.pending[0].fail(new Error("boom"));
    await flush();
    expect(errors, "#3: the insert's own error, then each write that could not be delivered").toEqual([
      "insert:boom",
      "update:DynamicDataList: the record has no key yet",
      "remove:DynamicDataList: the record has no key yet"
    ]);
    expect(source.callsOf("update").length, "#4").toBe(0);
    expect(source.callsOf("remove").length, "#5").toBe(0);
    expect(question.rowCount, "#6: removed locally").toBe(3);
  });
  const swapTargets: Array<[string, () => FakeServerSource]> = [
    ["a keyed source", () => keyedSource(3)],
    ["a source keyed by another field", () => new FakeServerSource(serverRecords(3, 200).map((r: any): any => Object.assign({ uuid: "u" + r.id }, r)), undefined, "uuid")],
    ["a positional source", () => new FakeServerSource(serverRecords(3, 300))]
  ];
  swapTargets.forEach(([name, createTarget]: [string, () => FakeServerSource]): void => {
    test("a source swap while the insert is pending delivers the queued write to the old source: " + name, async () => {
      const source = keyedSource(3);
      const { survey, question } = await createMatrix(source, { rowsPerPage: 0 });
      const errors: Array<string> = [];
      survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
      source.auto = false;
      source.reset();
      question.addRow();
      question.visibleRows[3].getQuestionByName("col1").value = "typed";
      const target = createTarget();
      question.dataSource = target;
      await flush();
      const window = question.value.map((r: any): any => Object.assign({}, r));
      await drain(source);
      expect(source.argsOf("update").map((args: Array<any>): Array<any> => [args[0], args[1]]), "#1: the old source, the assigned key")
        .toEqual([[1000, { id: 1000, col1: "typed" }]]);
      expect(recordWithKey(source, 1000).col1, "#2").toBe("typed");
      ["insert", "update", "remove", "move"].forEach((op: string): void => {
        expect(target.callsOf(op).length, "#3: no " + op + " reached the new source").toBe(0);
      });
      expect(question.value, "#4: the answer did not touch the new window").toEqual(window);
      expect(question.value.length, "#5: the new source's records").toBe(3);
      expect(errors, "#6").toEqual([]);
    });
  });
});

/* The coordination between a question and its list: a source assigned again or replaced while a
   page move is pending, the order of the changes a page move, a remote edit and a filter make, a
   refill that fails, and the page validation. */
describe("Remote data source: the coordination between a question and its list", () => {
  const results: Array<(res: any) => void> = [];
  function asyncPageValidatorFunc(params: any): any {
    results.push(this.returnResult);
    return false;
  }
  beforeEach(() => {
    results.length = 0;
    FunctionFactory.Instance.register("asyncPageValidatorFunc", asyncPageValidatorFunc, true);
  });
  afterEach(() => {
    FunctionFactory.Instance.unregister("asyncPageValidatorFunc");
  });
  const asyncValidators = [{ type: "expression", expression: "asyncPageValidatorFunc() = 1" }];
  const asyncColumns = [{ name: "col1", cellType: "text", validators: asyncValidators }, { name: "col2", cellType: "text" }];
  const asyncTemplate = [{ type: "text", name: "col1", validators: asyncValidators }, { type: "text", name: "col2" }];
  // A read() source: it hands over every record and the list cuts the page.
  const readSource = (count: number, offset: number = 0): FakeServerSource =>
    new FakeServerSource(serverRecords(count, offset), ["insert", "update", "remove", "move"]);
  function recordValues(question: Question): Array<any> {
    const res: Array<any> = [];
    question.registerPropertyChangedHandlers(["value"], (newValue: any): void => {
      res.push(Array.isArray(newValue) ? newValue.map((r: any): any => !!r ? r.col1 : r) : newValue);
    }, "recordValues");
    return res;
  }

  test("T1 matrix: the same source assigned again keeps the pending page move and reads nothing", async () => {
    const source = readSource(12);
    const { survey, question } = await createMatrix(source, { columns: asyncColumns });
    expect(rowValues(question), "#1: the page").toEqual(["v0", "v1", "v2", "v3", "v4"]);
    const table = question.renderedTable;
    expect(question.nextPage(), "#2").toBe(true);
    expect(question.isPageMovePending, "#3: the move waits for its validators").toBe(true);
    source.reset();
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    const values = recordValues(question);
    question.dataSource = source;
    await flush();
    expect(source.calls.length, "#4: no read").toBe(0);
    expect(changes, "#5: no survey change").toEqual([]);
    expect(values, "#6: no value change").toEqual([]);
    expect(question.isPageMovePending, "#7: the move is still pending").toBe(true);
    expect(question.renderedTable !== table, "#8: the question's own refresh ran").toBe(true);
    results.forEach(setResult => setResult(1));
    expect(question.isPageMovePending, "#9").toBe(false);
    expect(question.pageIndex, "#10: the late result moves the page").toBe(1);
    expect(rowValues(question), "#11").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("T1 panel: the same source assigned again keeps the pending page move and reads nothing", async () => {
    const source = readSource(12);
    const { survey, question } = await createPanel(source, { templateElements: asyncTemplate });
    expect(panelValues(question), "#1: the page").toEqual(["v0", "v1", "v2", "v3", "v4"]);
    expect(question.nextPage(), "#2").toBe(true);
    expect(question.isPageMovePending, "#3: the move waits for its validators").toBe(true);
    source.reset();
    const changes: Array<string> = [];
    survey.onValueChanged.add((sender, options) => { changes.push(options.name); });
    const values = recordValues(question);
    question.dataSource = source;
    await flush();
    expect(source.calls.length, "#4: no read").toBe(0);
    expect(changes, "#5: no survey change").toEqual([]);
    expect(values, "#6: no value change").toEqual([]);
    expect(question.isPageMovePending, "#7: the move is still pending").toBe(true);
    results.forEach(setResult => setResult(1));
    expect(question.isPageMovePending, "#8").toBe(false);
    expect(question.pageIndex, "#9: the late result moves the page").toBe(1);
    expect(panelValues(question), "#10").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("T2 matrix: another source drops the pending page move and the edited records", async () => {
    const { question } = await createMatrix(readSource(12), { columns: asyncColumns });
    question.visibleRows[0].getQuestionByName("col2").value = "edited";
    question.pageIndex = 1;
    expect(getPageState(question).edited, "#1: an edited record on a page that is not shown").toEqual([0]);
    expect(question.nextPage(), "#2").toBe(true);
    expect(question.isPageMovePending, "#3").toBe(true);
    question.dataSource = readSource(12, 100);
    expect(question.isPageMovePending, "#4: dropped by the assignment, before the first read answers").toBe(false);
    expect(getPageState(question).edited, "#5: the edited set named records of the old source").toEqual([]);
    await flush();
    const pageIndex = question.pageIndex;
    const rows = rowValues(question);
    results.forEach(setResult => setResult(1));
    expect(question.pageIndex, "#6: the late result moves nothing").toBe(pageIndex);
    expect(rowValues(question), "#7").toEqual(rows);
    expect(getPageState(question).edited, "#8").toEqual([]);
  });
  test("T2 panel: another source drops the pending page move and the edited records", async () => {
    const { question } = await createPanel(readSource(12), { templateElements: asyncTemplate });
    question.panels[0].getQuestionByName("col2").value = "edited";
    question.pageIndex = 1;
    expect(getPageState(question).edited, "#1: an edited record on a page that is not shown").toEqual([0]);
    expect(question.nextPage(), "#2").toBe(true);
    expect(question.isPageMovePending, "#3").toBe(true);
    question.dataSource = readSource(12, 100);
    expect(question.isPageMovePending, "#4: dropped by the assignment, before the first read answers").toBe(false);
    expect(getPageState(question).edited, "#5: the edited set named records of the old source").toEqual([]);
    await flush();
    const pageIndex = question.pageIndex;
    const panels = panelValues(question);
    results.forEach(setResult => setResult(1));
    expect(question.pageIndex, "#6: the late result moves nothing").toBe(pageIndex);
    expect(panelValues(question), "#7").toEqual(panels);
    expect(getPageState(question).edited, "#8").toEqual([]);
  });
  test("T3 matrix: reading the source members and disposing creates no list", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 2, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(question.dataSource, "#1").toBe(undefined);
    expect(question.isDynamicDataRunning, "#2").toBe(false);
    expect(question.isReady, "#3").toBe(true);
    expect(!!(<any>question).dataListValue, "#4: the reads created nothing").toBe(false);
    question.dispose();
    expect(!!(<any>question).dataListValue, "#5: nor did dispose").toBe(false);
  });
  test("T3 panel: reading the source members and disposing creates no list", () => {
    const question = new QuestionPanelDynamicModel("panel");
    question.template.addNewQuestion("text", "col1");
    expect(question.dataSource, "#1").toBe(undefined);
    expect(question.isDynamicDataRunning, "#2").toBe(false);
    expect(question.isReady, "#3").toBe(true);
    expect(!!(<any>question).dataListValue, "#4: the reads created nothing").toBe(false);
    question.dispose();
    expect(!!(<any>question).dataListValue, "#5: nor did dispose").toBe(false);
  });

  /* The order of what a list change does to the question, as it can be seen from outside: every
     change of isDataLoading, pageIndex, pageCount and value, and whether the first object was already
     replaced when the change was raised ("old" / "new"). */
  function trace(question: Question, firstObject: () => any): () => Array<string> {
    const res: Array<string> = [];
    const first = firstObject();
    const names = ["isDataLoading", "pageIndex", "pageCount", "value"];
    const format = (name: string, val: any): string => {
      if (name !== "value") return String(val);
      if (!Array.isArray(val)) return String(val);
      return val.length + (val.length > 0 ? ":" + val[0].col1 + "," + val[0].col2 + "," + val[0].col3 : "");
    };
    question.onPropertyChanged.add((sender: any, options: any): void => {
      if (names.indexOf(options.name) < 0) return;
      res.push(options.name + "=" + format(options.name, options.newValue) + " " + (firstObject() === first ? "old" : "new"));
    });
    return (): Array<string> => res.concat(["done " + (firstObject() === first ? "old" : "new")]);
  }
  const expressionColumns = [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" },
    { name: "col3", cellType: "expression", expression: "{row.col2} + 1" }];
  const expressionTemplate = [{ type: "text", name: "col1" }, { type: "text", name: "col2" },
    { type: "expression", name: "col3", expression: "{panel.col2} + 1" }];
  test("T4 matrix: the order of a page change, of a remote edit and of a filter", async () => {
    // (a) a page change of a readRange source: the rows are rebuilt when the read commits.
    const ranged = await createMatrix(new FakeServerSource(serverRecords(12)));
    expect(ranged.question.visibleRows.length, "#a0").toBe(5);
    const rangedTrace = trace(ranged.question, (): any => ranged.question.visibleRows[0]);
    ranged.question.nextPage();
    await flush();
    expect(rangedTrace(), "#a").toEqual(["pageIndex=1 old", "isDataLoading=true old", "value=5:v5,5,undefined old", "isDataLoading=false new", "done new"]);
    // (b) a page change of a read() source the list pages: the paging state, then the rebuild.
    const paged = await createMatrix(readSource(12));
    expect(paged.question.visibleRows.length, "#b0").toBe(5);
    const pagedTrace = trace(paged.question, (): any => paged.question.visibleRows[0]);
    paged.question.nextPage();
    await flush();
    expect(pagedTrace(), "#b").toEqual(["pageIndex=1 old", "done new"]);
    // (c) a cell edit on a readRange source: the window is stored before the conditions run.
    const edited = await createMatrix(new FakeServerSource(serverRecords(12)), { columns: expressionColumns });
    expect(edited.question.visibleRows.length, "#c0").toBe(5);
    const editedTrace = trace(edited.question, (): any => edited.question.visibleRows[0]);
    edited.question.visibleRows[0].getQuestionByName("col2").value = 10;
    await flush();
    expect(editedTrace(), "#c").toEqual(["value=5:v0,10,1 old", "value=5:v0,10,11 old", "done old"]);
    // (d) a filter assigned on the default source.
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5, columns: [{ name: "col1" }, { name: "col2" }] }]
    });
    survey.data = { matrix: serverRecords(12) };
    const local = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(local.visibleRows.length, "#d0").toBe(5);
    const localTrace = trace(local, (): any => local.visibleRows[0]);
    local.filterExpression = "{col2} > 8";
    expect(localTrace(), "#d").toEqual(["pageCount=1 old", "done new"]);
    expect(rowValues(local), "#d1").toEqual(["v9", "v10", "v11"]);
  });
  test("T4 panel: the order of a page change, of a remote edit and of a filter", async () => {
    const ranged = await createPanel(new FakeServerSource(serverRecords(12)));
    expect(ranged.question.panels.length, "#a0").toBe(5);
    const rangedTrace = trace(ranged.question, (): any => ranged.question.panels[0]);
    ranged.question.nextPage();
    await flush();
    expect(rangedTrace(), "#a").toEqual(["pageIndex=1 old", "isDataLoading=true old", "value=5:v5,5,undefined old", "isDataLoading=false new", "done new"]);
    const paged = await createPanel(readSource(12));
    expect(paged.question.panels.length, "#b0").toBe(5);
    const pagedTrace = trace(paged.question, (): any => paged.question.panels[0]);
    paged.question.nextPage();
    await flush();
    expect(pagedTrace(), "#b").toEqual(["pageIndex=1 old", "done new"]);
    const edited = await createPanel(new FakeServerSource(serverRecords(12)), { templateElements: expressionTemplate });
    expect(edited.question.panels.length, "#c0").toBe(5);
    const editedTrace = trace(edited.question, (): any => edited.question.panels[0]);
    edited.question.panels[0].getQuestionByName("col2").value = 10;
    await flush();
    expect(editedTrace(), "#c").toEqual(["value=5:v0,10,1 old", "value=5:v0,10,11 old", "done old"]);
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, panelsPerPage: 5,
        templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }] }]
    });
    survey.data = { panel: serverRecords(12) };
    const local = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(local.panels.length, "#d0").toBe(5);
    const localTrace = trace(local, (): any => local.panels[0]);
    local.filterExpression = "{col2} > 8";
    expect(localTrace(), "#d").toEqual(["pageCount=1 old", "done new"]);
    expect(panelValues(local), "#d1").toEqual(["v9", "v10", "v11"]);
  });

  describe("T6: a rejected refill drops the focus position it kept", () => {
    let focusSpy: any;
    let addButtonSpy: any;
    beforeEach(() => {
      vi.useFakeTimers();
      focusSpy = vi.spyOn(QuestionMatrixDropdownRenderedTable.prototype, "focusActionCell").mockImplementation(() => { });
      addButtonSpy = vi.spyOn(QuestionMatrixDynamicModel.prototype, "focusAddBUtton").mockImplementation(() => { });
    });
    afterEach(() => {
      focusSpy.mockRestore();
      addButtonSpy.mockRestore();
      vi.useRealTimers();
    });
    test("matrix: one read error, and the next committed read does not focus the position", async () => {
      const source = new FakeServerSource(serverRecords(30));
      const { survey, question } = await createMatrix(source, { rowsPerPage: 10 });
      const errors: Array<string> = [];
      survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
      source.auto = false;
      question.removeRowUI(question.visibleRows[0]);
      vi.advanceTimersByTime(10);
      expect(focusSpy.mock.calls.length, "#1: focused at once").toBe(1);
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(source.pending.length, "#2: the refill is in flight").toBe(1);
      source.pending[0].fail(new Error("boom"));
      await flush(REFILL_TURNS);
      expect(errors, "#3").toEqual(["read"]);
      source.auto = true;
      question.refreshView();
      await flush(REFILL_TURNS);
      vi.advanceTimersByTime(100);
      expect(question.visibleRows.length, "#4: the later read committed").toBe(10);
      expect(focusSpy.mock.calls.length, "#5: and focused nothing").toBe(1);
      expect(errors, "#6").toEqual(["read"]);
    });
    test("panel: one read error, and the next committed read does not focus the position", async () => {
      const focusElementSpy = vi.spyOn(SurveyElement, "FocusElement").mockImplementation(() => true);
      try {
        const source = new FakeServerSource(serverRecords(30));
        const { survey, question } = await createPanel(source, { panelsPerPage: 10 });
        const errors: Array<string> = [];
        survey.onDynamicDataError.add((sender, options) => { errors.push(options.operation); });
        source.auto = false;
        question.removePanelUI(question.panels[0]);
        expect(focusElementSpy.mock.calls.length, "#1: focused at once").toBe(1);
        source.settleAll();
        await flush(REFILL_TURNS);
        expect(source.pending.length, "#2: the refill is in flight").toBe(1);
        source.pending[0].fail(new Error("boom"));
        await flush(REFILL_TURNS);
        expect(errors, "#3").toEqual(["read"]);
        source.auto = true;
        question.refreshView();
        await flush(REFILL_TURNS);
        expect(question.panels.length, "#4: the later read committed").toBe(10);
        expect(focusElementSpy.mock.calls.length, "#5: and focused nothing").toBe(1);
        expect(errors, "#6").toEqual(["read"]);
      } finally {
        focusElementSpy.mockRestore();
      }
    });
  });

  test("T7 matrix: isDynamicDataRunning spans the refill of a page, from the request to the commit", async () => {
    const source = new FakeServerSource(serverRecords(30));
    const { question } = await createMatrix(source, { rowsPerPage: 10 });
    const list = question.getDataList();
    expect(question.isDynamicDataRunning, "#1: nothing is running").toBe(false);
    source.auto = false;
    question.removeRow(0);
    expect(list.hasPendingRead, "#2: the refill is requested").toBe(true);
    expect(list.isLoading, "#3: and waits for the remove").toBe(false);
    expect(question.isDynamicDataRunning, "#4").toBe(true);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(source.pending.map(call => call.op), "#5: the refill is in flight").toEqual(["readRange"]);
    expect(question.isDynamicDataRunning, "#6").toBe(true);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(question.visibleRows.length, "#7: committed").toBe(10);
    expect(question.isDynamicDataRunning, "#8").toBe(false);
  });
  test("T7 panel: isDynamicDataRunning spans the refill of a page, from the request to the commit", async () => {
    const source = new FakeServerSource(serverRecords(30));
    const { question } = await createPanel(source, { panelsPerPage: 10 });
    const list = question.getDataList();
    expect(question.isDynamicDataRunning, "#1: nothing is running").toBe(false);
    source.auto = false;
    question.removePanel(0);
    expect(list.hasPendingRead, "#2: the refill is requested").toBe(true);
    expect(list.isLoading, "#3: and waits for the remove").toBe(false);
    expect(question.isDynamicDataRunning, "#4").toBe(true);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(source.pending.map(call => call.op), "#5: the refill is in flight").toEqual(["readRange"]);
    expect(question.isDynamicDataRunning, "#6").toBe(true);
    source.settleAll();
    await flush(REFILL_TURNS);
    expect(question.panels.length, "#7: committed").toBe(10);
    expect(question.isDynamicDataRunning, "#8").toBe(false);
  });

  // Step D4: the two rules of the page validation that both questions answered the same way.
  test("D4 matrix: a forward page move is validated unless the survey lets a page be left with errors", () => {
    const setupInvalid = (checkErrorsMode: string, allowSwitchPages: boolean): QuestionMatrixDynamicModel => {
      const data = serverRecords(12);
      delete data[2].col1;
      const survey = new SurveyModel({
        elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 5,
          columns: [{ name: "col1", cellType: "text", isRequired: true }, { name: "col2", cellType: "text" }] }]
      });
      if (!!checkErrorsMode) survey.checkErrorsMode = <any>checkErrorsMode;
      survey.validationAllowSwitchPages = allowSwitchPages;
      survey.data = { matrix: data };
      const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
      expect(question.visibleRows.length, "the page is built").toBe(5);
      return question;
    };
    const onComplete = setupInvalid("onComplete", false);
    expect(onComplete.nextPage(), "#1").toBe(true);
    expect(onComplete.pageIndex, "#2: moved with the error").toBe(1);
    const allowSwitch = setupInvalid("", true);
    expect(allowSwitch.nextPage(), "#3").toBe(true);
    expect(allowSwitch.pageIndex, "#4").toBe(1);
    const byDefault = setupInvalid("", false);
    expect(byDefault.nextPage(), "#5: the default blocks").toBe(false);
    expect(byDefault.pageIndex, "#6").toBe(0);
  });
  // In design mode a carousel shows its template: there is nothing to move to, and nothing to
  // validate either. The answer is the one a move that was let through gives.
  test("D4 panel: a carousel Next in design mode is not validated", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "paneldynamic", name: "panel", panelCount: 3, displayMode: "carousel",
        templateElements: [{ type: "text", name: "col1", isRequired: true }] }]
    });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(question.currentIndex, "#1").toBe(0);
    expect(question.goToNextPanel(), "#2: not stopped by the empty required question of the template").toBe(true);
    expect(question.template.getQuestionByName("col1").errors.length, "#3: and no error is shown").toBe(0);
  });
  test("D4 matrix: an edit made while the list does not page is not tracked", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0,
        columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }] }]
    });
    survey.data = { matrix: serverRecords(12) };
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(getPageState(question), "#1: it does not page").toBe(undefined);
    // A sort the respondent makes is a page leave: the page-validation helper exists from here on.
    expect(question.toggleSort("col2"), "#2").toBe(true);
    question.visibleRows[3].getQuestionByName("col1").value = "edited";
    question.clearSort();
    question.rowsPerPage = 5;
    expect(getPageState(question).edited, "#3: layer 2 tracks the edits of a list that pages in memory").toEqual([]);
  });
  test("D4 panel: an edit made while the list does not page is not tracked", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel", panelCount: 0,
        templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }] }]
    });
    survey.data = { panel: serverRecords(12) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(getPageState(question), "#1: it does not page").toBe(undefined);
    expect(question.toggleSort("col2"), "#2").toBe(true);
    question.panels[3].getQuestionByName("col1").value = "edited";
    question.clearSort();
    question.panelsPerPage = 5;
    expect(getPageState(question).edited, "#3: layer 2 tracks the edits of a list that pages in memory").toEqual([]);
  });
});

// A read() source: it hands over every record and the list cuts the page.
function readAllSource(count: number, keyField?: string): FakeServerSource {
  return new FakeServerSource(serverRecords(count), ["insert", "update", "remove", "move"], keyField);
}
// Another writer inserts a record into the table the question has read.
function insertBehindTheGrid(source: FakeServerSource, at: number, id: number): void {
  source.records.splice(at, 0, { id: id, col1: "v" + id, col2: id });
}

/* refresh() reads a read() source again, and another writer may have inserted or moved records
   meanwhile. What the question keeps by record index follows its records into the new window; the
   rows the read replaces keep the records they were built for until the rebuild disposes them. */
describe("Remote data source: a read that commits again", () => {
  [undefined, "id"].forEach((keyField: string): void => {
    const kind = !!keyField ? "a keyed source" : "a source without keys";
    test("panel, " + kind + ": the current tab follows its record", async () => {
      const source = readAllSource(12, keyField);
      const { question } = await createPanel(source, { displayMode: "tab" });
      question.currentIndex = 6;
      expect(question.pageIndex, "#1: the record is on page 1").toBe(1);
      expect(question.currentPanel.getQuestionByName("col1").value, "#2").toBe("v6");
      insertBehindTheGrid(source, 0, 100);
      question.getDataList().refresh();
      await flush();
      expect(question.panelCount, "#3: the read committed").toBe(13);
      expect(question.currentPanel.getQuestionByName("col1").value, "#4: the same record").toBe("v6");
      expect(question.currentIndex, "#5: one position further").toBe(7);
    });
    test("panel, " + kind + ": the state of a nested paged matrix follows its outer record", async () => {
      const outerRecords: Array<any> = [0, 1, 2, 3].map((i: number): any =>
        ({ id: i, items: [0, 1, 2, 3, 4, 5].map((j: number): any => ({ a: "a" + i + j })) }));
      const source = new FakeServerSource(outerRecords, ["insert", "update", "remove", "move"], keyField);
      const { question } = await createPanel(source, {
        panelsPerPage: 2,
        templateElements: [{ type: "text", name: "id" }, {
          type: "matrixdynamic", name: "items", rowCount: 0, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }]
        }]
      });
      const matrixOf = (id: number): QuestionMatrixDynamicModel => {
        const panel = question.panels.filter(p => p.getQuestionByName("id").value === id)[0];
        return <QuestionMatrixDynamicModel>panel.getQuestionByName("items");
      };
      const matrix = matrixOf(0);
      matrix.pageIndex = 1;
      matrix.visibleRows[0].getQuestionByName("a").value = "edited";
      matrix.pageIndex = 0;
      await flush();
      expect(getPageState(matrix).edited, "#1: an edited inner record off the inner page").toEqual([2]);
      expect(getPageState(matrixOf(1)).edited, "#2").toEqual([]);
      source.moveRecordBehindTheGrid(0, 1);
      question.getDataList().refresh();
      await flush();
      expect(panelValues(question, "id"), "#3: the outer records changed places").toEqual([1, 0]);
      expect(matrixOf(0) === matrix, "#4: the panels were rebuilt").toBe(false);
      expect(getPageState(matrixOf(0)).edited, "#5: the state is in the panel that holds the outer record now").toEqual([2]);
      expect(getPageState(matrixOf(1)).edited, "#6").toEqual([]);
    });
  });

  test("matrix: the rows the read replaces keep the record they were built for", async () => {
    const source = readAllSource(12, "id");
    const { survey, question } = await createMatrix(source, { rowsVisibleIf: "{row.col2} >= 0" });
    const row: any = question.visibleRows[0];
    row.getQuestionByName("col1").value = "edited";
    await flush();
    expect(getPageState(question).edited, "#1: the reload has an edited set to follow").toEqual([0]);
    expect(row.builtRecordIndex, "#2").toBe(0);
    const seen: Array<number> = [];
    // The rebuild decides the visibility of the records before it clears the rows it replaces.
    survey.onExpressionRunning.add((_: SurveyModel, options: any): void => {
      if (options.propertyName === "rowsVisibleIf") seen.push(row.builtRecordIndex);
    });
    insertBehindTheGrid(source, 0, 100);
    question.getDataList().refresh();
    await flush();
    expect(question.rowCount, "#3: the read committed").toBe(13);
    expect(getPageState(question).edited, "#4: the edited set followed its record").toEqual([1]);
    expect(seen.length > 0, "#5: the handler ran").toBe(true);
    expect(seen[0], "#6: while the old rows still exist, row 0 names the record it was built for").toBe(0);
    expect(row.builtRecordIndex, "#7: and after the read committed").toBe(0);
    expect(question.visibleRows[0] === row, "#8: the rebuilt row 0 is another object").toBe(false);
    expect((<any>question.visibleRows[1]).builtRecordIndex, "#9: which names the record that moved").toBe(1);
    expect(rowValues(question)[1], "#10").toBe("edited");
  });
});

/* A remote write never reaches the survey, so the question runs the conditions a survey write would
   have run: the expressions and the totals. An expression writes its result back, and that write is
   a remote write again. */
describe("Remote data source: the conditions a remote edit runs", () => {
  const expressionColumns = [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text", totalType: "sum" },
    { name: "col3", cellType: "expression", expression: "{row.col2} + 1" }];
  const expressionTemplate = [{ type: "text", name: "col1" }, { type: "text", name: "col2" },
    { type: "expression", name: "col3", expression: "{panel.col2} + 1" }];
  /* The evaluations are counted through a function: a nested run would change no value, so the
     number of updates cannot tell whether it ran. */
  describe("once for one edit", () => {
    let evaluations = 0;
    beforeEach(() => {
      evaluations = 0;
      FunctionFactory.Instance.register("remoteEditPlus", (params: Array<any>): any => {
        evaluations++;
        return params[0] + 1;
      });
    });
    afterEach(() => {
      FunctionFactory.Instance.unregister("remoteEditPlus");
    });
    test("matrix: the expression cell and the total follow the edit", async () => {
      const source = new FakeServerSource(serverRecords(12));
      const { question } = await createMatrix(source, {
        columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text", totalType: "sum" },
          { name: "col3", cellType: "expression", expression: "remoteEditPlus({row.col2})" }]
      });
      await flush();
      expect(rowValues(question, "col3"), "#1: the page was calculated").toEqual([1, 2, 3, 4, 5]);
      source.reset();
      evaluations = 0;
      question.visibleRows[0].getQuestionByName("col2").value = 10;
      await flush();
      expect(question.visibleRows[0].getQuestionByName("col3").value, "#2: the expression cell").toBe(11);
      expect(question.visibleTotalRow.cells[1].question.value, "#3: the total of the window").toBe(20);
      expect(source.callsOf("update").length, "#4: the edit, then the expression result").toBe(2);
      expect(evaluations, "#5: one evaluation for each row of the page").toBe(5);
    });
    test("panel: the expression question follows the edit", async () => {
      const source = new FakeServerSource(serverRecords(12));
      const { question } = await createPanel(source, {
        templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" },
          { type: "expression", name: "col3", expression: "remoteEditPlus({panel.col2})" }]
      });
      await flush();
      expect(panelValues(question, "col3"), "#1: the page was calculated").toEqual([1, 2, 3, 4, 5]);
      source.reset();
      evaluations = 0;
      question.panels[0].getQuestionByName("col2").value = 10;
      await flush();
      expect(question.panels[0].getQuestionByName("col3").value, "#2: the expression question").toBe(11);
      expect(source.callsOf("update").length, "#3: the edit, then the expression result").toBe(2);
      expect(evaluations, "#4: one evaluation for each panel of the page").toBe(5);
    });
  });
  test("matrix: a throw from the conditions reaches the caller, and the next edit runs them again", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { survey, question } = await createMatrix(source, { columns: expressionColumns });
    await flush();
    let isThrown = false;
    // Raised for the expression cell before it is evaluated, from inside the run of the conditions.
    survey.onExpressionRunning.add((_: SurveyModel, options: any): void => {
      if (options.propertyName !== "expression" || isThrown) return;
      isThrown = true;
      throw new Error("user code");
    });
    expect(() => { question.visibleRows[0].getQuestionByName("col2").value = 10; }, "#1").toThrow("user code");
    await flush();
    question.visibleRows[0].getQuestionByName("col2").value = 20;
    await flush();
    expect(question.visibleRows[0].getQuestionByName("col3").value, "#2: the expression cell follows the second edit").toBe(21);
    expect(question.visibleTotalRow.cells[1].question.value, "#3: and so does the total").toBe(30);
  });
  test("panel: a throw from the conditions reaches the caller, and the next edit runs them again", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { survey, question } = await createPanel(source, { templateElements: expressionTemplate });
    await flush();
    let isThrown = false;
    survey.onExpressionRunning.add((_: SurveyModel, options: any): void => {
      if (options.propertyName !== "expression" || isThrown) return;
      isThrown = true;
      throw new Error("user code");
    });
    expect(() => { question.panels[0].getQuestionByName("col2").value = 10; }, "#1").toThrow("user code");
    await flush();
    question.panels[0].getQuestionByName("col2").value = 20;
    await flush();
    expect(question.panels[0].getQuestionByName("col3").value, "#2: the expression question follows the second edit").toBe(21);
  });
});

describe("Remote data source: removeRowByIndex on a page the list cuts", () => {
  test("matrix: the page is refilled, and rebuilt once when it moves back", async () => {
    const refilled = await createMatrix(readAllSource(11));
    expect(rowValues(refilled.question), "#1: page 0 of 3").toEqual(["v0", "v1", "v2", "v3", "v4"]);
    expect(refilled.question.pageCount, "#2").toBe(3);
    refilled.question.removeRowByIndex(1);
    await flush();
    expect(rowValues(refilled.question), "#3: the first record of the old page 1 is the last row").toEqual(["v0", "v2", "v3", "v4", "v5"]);
    expect(refilled.question.pageIndex, "#4").toBe(0);

    const moved = await createMatrix(readAllSource(11));
    moved.question.pageIndex = 2;
    expect(rowValues(moved.question), "#5: one row on the last page").toEqual(["v10"]);
    let cells = 0;
    moved.survey.onMatrixCellCreated.add((): void => { cells++; });
    moved.question.removeRowByIndex(0);
    await flush();
    expect(moved.question.pageIndex, "#6: the page moved back").toBe(1);
    expect(rowValues(moved.question), "#7").toEqual(["v5", "v6", "v7", "v8", "v9"]);
    expect(cells, "#8: five rows of two cells, built once").toBe(10);
  });
});

/* The panel counts its panels when it asks for the focus, not when the focus runs: the last position
   of a page shows whether they were counted after the rebuild. */
describe("Remote data source: the focus after the last panel of a refilled page is removed", () => {
  test("panel: the remove button of the panel the rebuild created at that position", async () => {
    const focusElementSpy = vi.spyOn(SurveyElement, "FocusElement").mockImplementation(() => true);
    const removeActionSpy = vi.spyOn(QuestionPanelDynamicModel.prototype, "getRemovePanelAction");
    try {
      const source = new FakeServerSource(serverRecords(30));
      const { question } = await createPanel(source, { panelsPerPage: 10 });
      source.auto = false;
      question.removePanelUI(question.panels[9]);
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(source.pending.length, "#1: the refill is in flight").toBe(1);
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(question.panels.length, "#2").toBe(10);
      expect(focusElementSpy.mock.calls.length, "#3: focused again after the rebuild").toBe(2);
      removeActionSpy.mockClear();
      (<any>focusElementSpy.mock.calls[1][0])();
      expect(removeActionSpy.mock.calls.length, "#4").toBe(1);
      const panel = removeActionSpy.mock.calls[0][0];
      expect(panel === question.visiblePanels[9], "#5: position 9 is filled again").toBe(true);
      expect(panel.getQuestionByName("col1").value, "#6").toBe("v10");
    } finally {
      removeActionSpy.mockRestore();
      focusElementSpy.mockRestore();
    }
  });
});

describe("a throwing callback does not leave a guard behind", () => {
  test("a throwing onDynamicPanelRemoved inside removePanel leaves the value flag clear", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "q" }] }]
    });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    question.value = [{ q: "a" }, { q: "b" }, { q: "c" }];
    expect(question.panels.length, "#1").toBe(3);
    let isThrown = false;
    survey.onDynamicPanelRemoved.add(() => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("user code");
    });
    expect(() => question.removePanel(1), "#2").toThrow();
    expect(question.value, "#3: the record was removed").toEqual([{ q: "a" }, { q: "c" }]);
    question.value = [{ q: "x" }, { q: "y" }, { q: "z" }, { q: "w" }];
    expect(question.panelCount, "#4: an assignment from outside rebuilds the panels").toBe(4);
    expect(question.panels.map((panel) => panel.getQuestionByName("q").value), "#5")
      .toEqual(["x", "y", "z", "w"]);
  });
});
