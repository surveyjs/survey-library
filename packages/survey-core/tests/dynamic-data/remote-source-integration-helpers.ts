import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { Question } from "../../src/question";
import { IRecordsPageState } from "../../src/records/records-paging";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import { Operand } from "../../src/expressions/expressions";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, ISortCriterion, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

// The edited set and the page the page validation keeps for a records question have no public face.
export const getPageState = (q: Question): IRecordsPageState => (<any>q).getPageState();

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
export async function flush(times: number = 20): Promise<void> {
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

export interface IServerCall {
  op: string;
  args: Array<any>;
  settle: () => void;
  fail: (error: any) => void;
  isSettled: boolean;
}

/* An in-memory table behind promises, with every capability switchable: "paging" declares the read
   capabilities (paging, filtering and sorting together), a write capability is declared by leaving its
   method off the instance - which is how IDynamicDataSource declares them. Every call is recorded with
   its arguments - a read of the whole table as "read", a read of one page as "pagedRead" - and with
   auto = false a call stays pending until the test settles it by hand. */
export class FakeServerSource implements IDynamicDataSource {
  public calls: Array<IServerCall> = [];
  public auto: boolean = true;
  // false -> the server cannot count the matching records cheaply and answers without a total.
  public reportTotal: boolean = true;
  public capabilities: IDynamicDataSourceCapabilities = undefined;
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

  /* keyField: "id" unless stated - a source that writes is keyed, one without keyField is read-only.
     The records of serverRecords() have the id of their first position. null: no keyField. */
  constructor(public records: Array<any>, capabilities?: Array<string>, keyField?: string | null) {
    this.keyField = keyField === undefined ? "id" : keyField || undefined;
    const caps = capabilities || ["paging", "insert", "update", "remove", "move"];
    const has = (name: string): boolean => caps.indexOf(name) > -1;
    if (has("paging")) {
      this.capabilities = { paging: true, filtering: true, sorting: true };
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
  // One request per read: the range and the view are inside it and the source keeps nothing between
  // the calls.
  public read(request: IDynamicDataReadRequest): Promise<Array<any> | IDynamicDataReadResult> {
    if (!this.capabilities) return this.call("read", [], (): Array<any> => this.records.map(this.copy));
    return this.call("pagedRead", [request], (): IDynamicDataReadResult => {
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
  private copy = (record: any): any => Object.assign({}, record);
  // The server applies the filter and the sort of the request before it pages: that is what "the
  // source decides the membership" means for the list.
  private getView(request: IDynamicDataReadRequest): Array<any> {
    let res = this.records.slice();
    if (!!request.filter) {
      res = res.filter(dialectToPredicate(translateFilterToDialect(request.filter)));
    }
    // Applied back to front, so that the first descriptor wins.
    (request.sort || []).slice().reverse().forEach((s: ISortCriterion): void => {
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
    return this.argsOf("pagedRead").map((args: Array<any>): IDynamicDataReadRequest => args[0]);
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

export function serverRecords(count: number, offset: number = 0): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: offset + i, col1: "v" + (offset + i), col2: offset + i });
  }
  return res;
}

export async function createMatrix(source: FakeServerSource, json?: any, extra?: Array<any>):
  Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel }> {
  const survey = new SurveyModel({
    elements: [Object.assign({
      type: "matrixdynamic", name: "matrix", rowCount: 0, pageSize: 5,
      columns: [{ name: "col1" }, { name: "col2" }]
    }, json)].concat(extra || [])
  });
  const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  question.dataSource = source;
  await flush();
  return { survey: survey, question: question };
}
export async function createPanel(source: FakeServerSource, json?: any, extra?: Array<any>):
  Promise<{ survey: SurveyModel, question: QuestionPanelDynamicModel }> {
  const survey = new SurveyModel({
    elements: [Object.assign({
      type: "paneldynamic", name: "panel", panelCount: 0, pageSize: 5,
      templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }]
    }, json)].concat(extra || [])
  });
  const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
  question.dataSource = source;
  await flush();
  return { survey: survey, question: question };
}
export function rowValues(question: QuestionMatrixDynamicModel, column: string = "col1"): Array<any> {
  return question.visibleRows.map(row => row.getQuestionByName(column).value);
}
export function panelValues(question: QuestionPanelDynamicModel, name: string = "col1"): Array<any> {
  return question.panels.map(panel => panel.getQuestionByName(name).value);
}
export const REFILL_TURNS = 300;

/* A keyed source: keyField is set, and serverRecords(n, 100) gives every record an id that is NOT
   its position (100, 101, ... at positions 0, 1, ...), so an assertion on the key cannot pass by
   coincidence. */
export function keyedSource(count: number, capabilities?: Array<string>): FakeServerSource {
  return new FakeServerSource(serverRecords(count, 100), capabilities, "id");
}
export function recordWithKey(source: FakeServerSource, key: any): any {
  return source.records.filter((record: any): boolean => record.id === key)[0];
}

/* A question with an assigned data source asks the source for each operation it makes: an add needs
   insert, a remove needs remove, a move needs move and an edit needs update. A source without one
   refuses the operation before anything changes, on every path, from code and from the UI, and the
   refusal is reported once. The sources below answer synchronously. */
export class CapabilitySource implements IDynamicDataSource {
  public calls: Array<string> = [];
  public keyField: string;
  public capabilities = { paging: true, filtering: true, sorting: true };
  public insert?: (record: any, sourceIndex: number) => any;
  public update?: (key: any, record: any, changedFields: Array<string>) => void;
  public remove?: (key: any) => void;
  private nextKey: number = 1000;
  // keyed false: no keyField, read-only whatever the methods say.
  constructor(public records: Array<any>, methods: Array<string> = ["insert", "update", "remove"], keyed: boolean = true) {
    this.keyField = keyed ? "id" : undefined;
    const has = (name: string): boolean => methods.indexOf(name) > -1;
    const indexOfKey = (key: any): number => this.records.map((r: any) => r.id).indexOf(key);
    if (has("insert")) {
      this.insert = (record: any, sourceIndex: number): any => {
        this.calls.push("insert@" + sourceIndex);
        const stored = Object.assign({}, record, { id: this.nextKey++ });
        this.records.splice(sourceIndex, 0, stored);
        return Object.assign({}, stored);
      };
    }
    if (has("update")) {
      this.update = (key: any, record: any, changedFields: Array<string>): void => {
        this.calls.push("update:" + key + ":" + changedFields.join(","));
        const at = indexOfKey(key);
        if (at > -1)this.records[at] = Object.assign({}, record);
      };
    }
    if (has("remove")) {
      this.remove = (key: any): void => {
        this.calls.push("remove:" + key);
        const at = indexOfKey(key);
        if (at > -1)this.records.splice(at, 1);
      };
    }
  }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    const take = request.take > 0 ? request.take : this.records.length;
    return { records: this.records.slice(request.skip, request.skip + take).map((r: any) => Object.assign({}, r)), total: this.records.length };
  }
}
