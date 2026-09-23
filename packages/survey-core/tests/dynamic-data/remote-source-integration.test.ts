import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { Question } from "../../src/question";
import { QuestionMatrixDropdownRenderedTable } from "../../src/question_matrixdropdownrendered";
import { SurveyElement } from "../../src/survey-element";
import { settings } from "../../src/settings";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import { Operand } from "../../src/expressions/expressions";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSort, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";

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
  public insert?: (sourceIndex: number, record: any) => Promise<void>;
  public update?: (sourceIndex: number, record: any, changedFields: Array<string>) => Promise<void>;
  public remove?: (sourceIndex: number) => Promise<void>;
  public move?: (fromSourceIndex: number, toSourceIndex: number) => Promise<void>;

  constructor(public records: Array<any>, capabilities?: Array<string>) {
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
      this.insert = (sourceIndex: number, record: any): Promise<void> =>
        this.call("insert", [sourceIndex, this.copy(record)], (): void => {
          this.records.splice(sourceIndex, 0, this.copy(record));
        });
    }
    if (has("update")) {
      this.update = (sourceIndex: number, record: any, changedFields: Array<string>): Promise<void> =>
        this.call("update", [sourceIndex, this.copy(record), (changedFields || []).slice()], (): void => {
          this.records[sourceIndex] = this.copy(record);
        });
    }
    if (has("remove")) {
      this.remove = (sourceIndex: number): Promise<void> => this.call("remove", [sourceIndex], (): void => {
        this.records.splice(sourceIndex, 1);
      });
    }
    if (has("move")) {
      this.move = (from: number, to: number): Promise<void> => this.call("move", [from, to], (): void => {
        const record = this.records[from];
        this.records.splice(from, 1);
        this.records.splice(to, 0, record);
      });
    }
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
    expect(args[0], "#4: appended").toBe(3);
    expect(args[1], "#5: the complete record").toEqual({ col2: 7 });
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
    expect(args[0], "#1: windowOffset 5 + 5 records in the window").toBe(10);
    expect(args[1].col1, "#2: copied from the last record of the WINDOW, not of the table").toBe("v9");
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
    expect(args[0], "#4: appended").toBe(3);
    expect(args[1], "#5").toEqual({ col2: 7 });
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
    expect(args[0], "#1").toBe(10);
    expect(args[1].col1, "#2").toBe("v9");
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
    expect(source.argsOf("insert")[0], "#1").toEqual([7, { col1: "inserted" }]);
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
    expect(question.canAddRow, "#3: the add path still honours maxRowCount").toBe(false);
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
    question.currentIndex = 2;
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
  public insert(sourceIndex: number, record: any): void {
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
    expect(info.title, "#3: the end was reached").toBe("3 / 3");
    question.prevPage();
    await flush();
    expect(info.title, "#4: and it is not forgotten on the way back").toBe("2 / 3");
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

