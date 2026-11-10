import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { Question } from "../../src/question";
import { settings } from "../../src/settings";
import { FunctionFactory } from "../../src/functionsfactory";
import { ConsoleWarnings } from "../../src/console-warnings";
import { IDynamicDataReadRequest, IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";
import { ArrayDynamicDataSource, SurveyDataDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { ActionContainer } from "../../src/actions/container";
import { ListModel } from "../../src/list";
import { Action } from "../../src/actions/action";
import { PopupModalManager } from "../../src/popup-modal-manager";
import { IDialogOptions } from "../../src/popup";
import {
  flush, IServerCall, FakeServerSource, serverRecords, createMatrix, createPanel, rowValues, panelValues,
  REFILL_TURNS, keyedSource, recordWithKey, CapabilitySource
} from "./remote-source-integration-helpers";

/* The refill after a remove keeps the records the respondent touched on the page - edited or added -
   at their places, once each: the server's answer decides the rest of the window, and every other
   read is the server's alone. The source filters on "flag"; page size 4. */
describe("Remote data source: the refill after a remove keeps the touched records", () => {
  interface IRefillKind {
    name: string;
    create(source: FakeServerSource, json?: any): Promise<{ survey: SurveyModel, question: any }>;
    values(q: any, name?: string): Array<any>;
    set(q: any, position: number, name: string, value: any): void;
    add(q: any, front: boolean): void;
    remove(q: any, position: number): void;
  }
  const refillKinds: Array<IRefillKind> = [
    {
      name: "panel",
      create: (source, json) => createPanel(source, Object.assign({ pageSize: 4,
        templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "flag" }, { type: "text", name: "col2", inputType: "number" }] }, json)),
      values: (q, name) => panelValues(q, name),
      set: (q, position, name, value) => { q.panels[position].getQuestionByName(name).value = value; },
      add: (q, front) => {
        const panel = front ? q.addPanel(0) : q.addPanel();
        panel.getQuestionByName("col1").value = "new";
        panel.getQuestionByName("flag").value = "n";
      },
      remove: (q, position) => { q.removePanel(q.panels[position]); }
    },
    {
      name: "matrix",
      create: (source, json) => createMatrix(source, Object.assign({ pageSize: 4,
        columns: [{ name: "col1" }, { name: "flag" }, { name: "col2", cellType: "text", inputType: "number" }] }, json)),
      values: (q, name) => rowValues(q, name),
      set: (q, position, name, value) => { q.visibleRows[position].getQuestionByName(name).value = value; },
      add: (q, front) => {
        if (front) {
          q.addRowByIndex({ col1: "new", flag: "n" }, 0);
        } else {
          q.addRow();
          const rows = q.visibleRows;
          rows[rows.length - 1].getQuestionByName("col1").value = "new";
          rows[rows.length - 1].getQuestionByName("flag").value = "n";
        }
      },
      remove: (q, position) => { q.removeRow(position); }
    }
  ];
  const flagSource = (count: number): FakeServerSource =>
    new FakeServerSource(serverRecords(count).map((r: any) => Object.assign(r, { flag: "y" })));
  const filter = { filterExpression: "{flag} = 'y'" };
  refillKinds.forEach(kind => {
    test(kind.name + ": an edited and an added record the server's filter rejects survive the refill, at their places", async () => {
      const source = flagSource(12);
      const { question } = await kind.create(source, filter);
      expect(kind.values(question), "#1").toEqual(["v0", "v1", "v2", "v3"]);
      kind.set(question, 1, "flag", "n");
      kind.add(question, false);
      await flush(REFILL_TURNS);
      expect(kind.values(question), "#2: both are shown, the window outgrows the page").toEqual(["v0", "v1", "v2", "v3", "new"]);
      source.reset();
      kind.remove(question, 0);
      await flush(REFILL_TURNS);
      expect(source.requests.length, "#3: the page is full, no read").toBe(0);
      expect(kind.values(question), "#4").toEqual(["v1", "v2", "v3", "new"]);
      kind.remove(question, 1);
      await flush(REFILL_TURNS);
      expect(source.requests.length, "#5: one refill").toBe(1);
      expect(kind.values(question), "#6: the server's records, and the touched ones where they were").toEqual(["v1", "v3", "new", "v4", "v5", "v6"]);
      const list = (<any>question).dataListValue;
      expect([list.count, list.hasMore], "#7: the total and hasMore are the server's").toEqual([9, true]);
      question.refreshView();
      await flush(REFILL_TURNS);
      expect(kind.values(question), "#8: the next read is the server's alone").toEqual(["v3", "v4", "v5", "v6"]);
    });
    test(kind.name + ": a touched record the answer also holds is shown once, at its old index, as the answer has it", async () => {
      const source = flagSource(12);
      const { question } = await kind.create(source, filter);
      kind.set(question, 0, "col1", "x0");
      await flush(REFILL_TURNS);
      kind.remove(question, 1);
      // The server computes a field while the refill is in flight.
      source.records.forEach((r: any) => { r.computed = "c"; });
      await flush(REFILL_TURNS);
      expect(kind.values(question), "#1: at the same index").toEqual(["x0", "v2", "v3", "v4"]);
      expect(question.value[0].computed, "#2: the answer's record is shown").toBe("c");
      const other = flagSource(12);
      const created = await kind.create(other, filter);
      const q = created.question;
      kind.add(q, true);
      await flush(REFILL_TURNS);
      kind.set(q, 2, "col1", "x1");
      await flush(REFILL_TURNS);
      expect(kind.values(q), "#3").toEqual(["new", "v0", "x1", "v2", "v3"]);
      kind.remove(q, 1);
      await flush(REFILL_TURNS);
      kind.remove(q, 2);
      await flush(REFILL_TURNS);
      expect(kind.values(q), "#4: the server has x1 first, it stays at its index").toEqual(["new", "x1", "v3", "v4", "v5"]);
      expect(q.value.filter((r: any) => r.col1 === "x1").length, "#5: once").toBe(1);
    });
    test(kind.name + ": under a server sort an edited record stays at its place through the refill", async () => {
      const source = flagSource(12);
      const { question } = await kind.create(source, { sortCriteria: [{ field: "col2" }] });
      kind.set(question, 1, "col2", 100);
      await flush(REFILL_TURNS);
      kind.remove(question, 0);
      await flush(REFILL_TURNS);
      expect(kind.values(question), "#1: the sort would put it last").toEqual(["v1", "v2", "v3", "v4", "v5"]);
      expect(question.value[0].col2, "#2").toBe(100);
    });
    [{ name: "a page move away and back", read: async (q: any) => { q.nextPage(); await flush(REFILL_TURNS); q.prevPage(); } },
      { name: "refreshView()", read: (q: any) => { q.refreshView(); } },
      { name: "refreshDataSource()", read: (q: any) => { q.refreshDataSource(); } },
      { name: "a filter change", read: (q: any) => { q.filterExpression = "{flag} = 'y' "; } },
      { name: "a sort change", read: (q: any) => { q.sort([{ field: "col1", direction: "asc" }]); } }].forEach(way => {
      test(kind.name + ": " + way.name + " is the server's alone", async () => {
        const source = flagSource(12);
        const { question } = await kind.create(source, filter);
        kind.set(question, 1, "flag", "n");
        await flush(REFILL_TURNS);
        await way.read(question);
        await flush(REFILL_TURNS);
        expect(kind.values(question).indexOf("v1"), "#1").toBe(-1);
      });
    });
    test(kind.name + ": a read asked for while the refill waits, or in flight, makes it an ordinary read", async () => {
      const source = flagSource(12);
      const { question } = await kind.create(source, filter);
      kind.set(question, 1, "flag", "n");
      await flush(REFILL_TURNS);
      source.auto = false;
      kind.remove(question, 0);
      expect(source.pending.map(call => call.op), "#1: the remove; the refill waits for it").toEqual(["remove"]);
      question.refreshDataSource();
      source.auto = true;
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(kind.values(question).indexOf("v1"), "#2: merged into the refill").toBe(-1);
      kind.set(question, 0, "flag", "n");
      await flush(REFILL_TURNS);
      source.auto = false;
      kind.remove(question, 1);
      source.pending.forEach(call => { if (call.op === "remove") call.settle(); });
      await flush(REFILL_TURNS);
      expect(source.pending.map(call => call.op), "#3: the refill is in flight").toEqual(["pagedRead"]);
      question.refreshDataSource();
      source.auto = true;
      source.settleAll();
      await flush(REFILL_TURNS);
      expect(kind.values(question).indexOf("v2"), "#4: superseded in flight").toBe(-1);
    });
    test(kind.name + ": a record whose insert the source refused is kept through the refill", async () => {
      const source = flagSource(12);
      const { question } = await kind.create(source, filter);
      source.insert = (): Promise<any> => Promise.reject(new Error("refused"));
      kind.add(question, false);
      await flush(REFILL_TURNS);
      expect(kind.values(question), "#1").toEqual(["v0", "v1", "v2", "v3", "new"]);
      kind.remove(question, 0);
      await flush(REFILL_TURNS);
      kind.remove(question, 0);
      await flush(REFILL_TURNS);
      expect(kind.values(question), "#2").toEqual(["v2", "v3", "new", "v4", "v5"]);
    });
  });
  // Every committed read rebuilds the panels; the current panel is the kept record's again.
  test("panel: the current panel stays on a kept record through the refill", async () => {
    const source = flagSource(12);
    const { question } = await createPanel(source, Object.assign({ pageSize: 4, displayMode: "carousel",
      templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "flag" }] }, filter));
    question.currentIndex = 2;
    question.currentPanel.getQuestionByName("flag").value = "n";
    await flush(REFILL_TURNS);
    question.removePanel(0);
    await flush(REFILL_TURNS);
    expect(panelValues(question), "#1: the refill keeps v2 at its index").toEqual(["v1", "v2", "v3", "v4", "v5"]);
    expect(question.currentPanel.getQuestionByName("col1").value, "#2").toBe("v2");
    expect(question.currentIndex, "#3").toBe(1);
  });
});

describe("Remote data source: an operation the source cannot take is refused and reported", () => {
  const sixRecords = (): Array<any> => [0, 1, 2, 3, 4, 5].map((i: number): any => ({ id: i, a: "a" + i }));
  const elementOf = (kind: string, json?: any): any => kind === "matrix" ?
    Object.assign({ type: "matrixdynamic", name: "q", rowCount: 0, pageSize: 2,
      columns: [{ name: "a", cellType: "text" }, { name: "sel", cellType: "dropdown", choices: ["x", "y"] }] }, json) :
    Object.assign({ type: "paneldynamic", name: "q", panelCount: 0, pageSize: 2,
      templateElements: [{ type: "text", name: "a" }, { type: "dropdown", name: "sel", choices: ["x", "y"], showCommentArea: true }] }, json);
  function create(kind: string, source: IDynamicDataSource, json?: any, surveyJson?: any): { survey: SurveyModel, question: any, errors: Array<string> } {
    const survey = new SurveyModel(Object.assign({ elements: [elementOf(kind, json)] }, surveyJson));
    const question = <any>survey.getQuestionByName("q");
    question.dataSource = source;
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    return { survey: survey, question: question, errors: errors };
  }
  const objectsOf = (question: any): Array<any> => question instanceof QuestionMatrixDynamicModel ? question.visibleRows : question.panels;
  const shownA = (question: any): Array<any> => objectsOf(question).map((o: any) => o.getQuestionByName("a").value);
  const stateOf = (question: any): any => ({
    value: JSON.stringify(question.value), shown: shownA(question), page: question.pageIndex,
    count: question instanceof QuestionMatrixDynamicModel ? question.rowCount : question.panelCount
  });
  const roundTrip = (question: any): void => {
    question.pageIndex = 1;
    question.pageIndex = 0;
  };
  interface IPath { name: string, operation: string, run: (question: any) => void }
  const panelPaths: Array<IPath> = [
    { name: "addPanel()", operation: "insert", run: (q: any) => { q.addPanel(); } },
    { name: "addPanel(0)", operation: "insert", run: (q: any) => { q.addPanel(0); } },
    { name: "addPanelUI()", operation: "insert", run: (q: any) => { q.addPanelUI(); } },
    { name: "removePanel(0)", operation: "remove", run: (q: any) => { q.removePanel(0); } },
    { name: "removePanelUI(panel)", operation: "remove", run: (q: any) => { q.removePanelUI(q.panels[0]); } },
    { name: "a panel question's value", operation: "update", run: (q: any) => { q.panels[0].getQuestionByName("a").value = "edited"; } },
    { name: "a panel question's comment", operation: "update", run: (q: any) => { q.panels[0].getQuestionByName("sel").comment = "note"; } }
  ];
  const matrixPaths: Array<IPath> = [
    { name: "addRow()", operation: "insert", run: (q: any) => { q.addRow(); } },
    { name: "addRowByIndex()", operation: "insert", run: (q: any) => { q.addRowByIndex({ a: "new" }, 0); } },
    { name: "addRowUI()", operation: "insert", run: (q: any) => { q.addRowUI(); } },
    { name: "removeRow(0)", operation: "remove", run: (q: any) => { q.removeRow(0); } },
    { name: "removeRowUI(row)", operation: "remove", run: (q: any) => { q.removeRowUI(q.visibleRows[0]); } },
    { name: "a cell's value", operation: "update", run: (q: any) => { q.visibleRows[0].cells[0].question.value = "edited"; } },
    { name: "setRowValue(0, ...)", operation: "update", run: (q: any) => { q.setRowValue(0, { a: "edited", sel: "y" }); } }
  ];
  const pathsOf = (kind: string): Array<IPath> => kind === "matrix" ? matrixPaths : panelPaths;
  let confirmations = 0;
  const oldConfirm = settings.confirmActionAsync;
  beforeEach(() => {
    confirmations = 0;
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { confirmations++; callback(true); return true; };
  });
  afterEach(() => {
    settings.confirmActionAsync = oldConfirm;
  });

  ["matrix", "panel"].forEach((kind: string): void => {
    test(kind + ": a source without keyField refuses every add, remove and edit, reports it and keeps nothing locally", () => {
      pathsOf(kind).forEach((path: IPath): void => {
        const source = new CapabilitySource(sixRecords(), undefined, false);
        const { question, errors } = create(kind, source, { confirmDelete: true });
        const before = stateOf(question);
        path.run(question);
        expect(stateOf(question), path.name + ": nothing changed").toEqual(before);
        expect(source.calls, path.name + ": no source call").toEqual([]);
        expect(errors, path.name + ": one report").toEqual([path.operation]);
        expect(confirmations, path.name + ": no confirmation is asked").toBe(0);
        roundTrip(question);
        expect(stateOf(question), path.name + ": a page round trip shows the same records").toEqual(before);
      });
    });
    if (kind === "panel") {
      test("panel: a refused addPanel returns null", () => {
        const { question } = create(kind, new CapabilitySource(sixRecords(), ["update", "remove"]));
        expect(question.addPanel() === null, "#1: from code").toBe(true);
        expect(question.addPanelUI() === null, "#2: from the UI").toBe(true);
      });
    }
    test(kind + ": an edit the source cannot take shows the stored value again", () => {
      const { question } = create(kind, new CapabilitySource(sixRecords(), ["insert", "remove"]));
      const first = objectsOf(question)[0];
      first.getQuestionByName("a").value = "edited";
      expect(first.getQuestionByName("a").value, "#1").toBe("a0");
      first.getQuestionByName("sel").value = "x";
      expect(first.getQuestionByName("sel").value, "#2").toBeUndefined();
      expect(question.value[0], "#3: the window keeps the record").toEqual({ id: 0, a: "a0" });
    });
  });
  test("matrix: onMatrixRowAdding cannot allow an add the source refuses, and is not raised", () => {
    const source = new CapabilitySource(sixRecords(), undefined, false);
    const { survey, question, errors } = create("matrix", source);
    let raised = 0;
    survey.onMatrixRowAdding.add((_, options) => { raised++; options.allow = true; });
    question.addRow();
    expect(raised, "#1: the handler is not called").toBe(0);
    expect(question.rowCount, "#2").toBe(6);
    expect(source.calls, "#3").toEqual([]);
    expect(errors, "#4").toEqual(["insert"]);
  });

  ["matrix", "panel"].forEach((kind: string): void => {
    test(kind + ": a keyed source without insert refuses the adds; its removes and edits still reach it", () => {
      pathsOf(kind).forEach((path: IPath): void => {
        const source = new CapabilitySource(sixRecords(), ["update", "remove"]);
        const { question, errors } = create(kind, source);
        const before = stateOf(question);
        path.run(question);
        if (path.operation === "insert") {
          expect(stateOf(question), path.name + ": nothing changed").toEqual(before);
          expect(source.calls, path.name + ": no call").toEqual([]);
          expect(errors, path.name + ": reported").toEqual(["insert"]);
          return;
        }
        expect(errors, path.name + ": nothing reported").toEqual([]);
        expect(source.calls.length, path.name + ": one call").toBe(1);
        expect(source.calls[0].indexOf(path.operation), path.name + ": " + source.calls[0]).toBe(0);
      });
      const source = new CapabilitySource(sixRecords(), ["update", "remove"]);
      const { question } = create(kind, source);
      objectsOf(question)[0].getQuestionByName("a").value = "edited";
      expect(source.calls, "#1: the record and the changed field").toEqual(["update:0:a"]);
      if (kind === "matrix") question.removeRow(1); else question.removePanel(1);
      expect(source.calls[1], "#2: by its key").toBe("remove:1");
      expect(shownA(question), "#3: the edit and the remove are shown").toEqual(["edited", "a2"]);
    });
    test(kind + ": a keyed source without update refuses the edits and puts them back; insert and remove still reach it", () => {
      pathsOf(kind).forEach((path: IPath): void => {
        const source = new CapabilitySource(sixRecords(), ["insert", "remove"]);
        const { question, errors } = create(kind, source);
        const before = stateOf(question);
        path.run(question);
        if (path.operation === "update") {
          expect(stateOf(question), path.name + ": put back").toEqual(before);
          expect(source.calls, path.name + ": no call").toEqual([]);
          expect(errors, path.name + ": reported").toEqual(["update"]);
          return;
        }
        expect(errors, path.name + ": nothing reported").toEqual([]);
        expect(source.calls.length, path.name + ": one call").toBe(1);
        expect(source.calls[0].indexOf(path.operation), path.name + ": " + source.calls[0]).toBe(0);
      });
    });
    test(kind + ": a keyed source without remove refuses the removes; insert and update still reach it", () => {
      pathsOf(kind).forEach((path: IPath): void => {
        const source = new CapabilitySource(sixRecords(), ["insert", "update"]);
        const { question, errors } = create(kind, source, { confirmDelete: true });
        const before = stateOf(question);
        path.run(question);
        if (path.operation === "remove") {
          expect(stateOf(question), path.name + ": nothing changed").toEqual(before);
          expect(source.calls, path.name + ": no call").toEqual([]);
          expect(errors, path.name + ": reported").toEqual(["remove"]);
          expect(confirmations, path.name + ": no confirmation").toBe(0);
          return;
        }
        expect(errors, path.name + ": nothing reported").toEqual([]);
        expect(source.calls.length, path.name + ": one call").toBe(1);
      });
    });
  });

  test("computed values on a source without update reach the window and the objects, never the source, and are not reported", () => {
    const run = (kind: string, json: any, read: (question: any) => any, expected: any, extra?: (question: any) => void): void => {
      const source = new CapabilitySource([0, 1, 2, 3].map((i: number): any => ({ id: i, a: i + 1 })), ["insert", "remove"]);
      const { survey, question, errors } = create(kind, source, json);
      if (!!extra) extra(question);
      // setValueExpression runs when what it reads changes: here a survey variable, for the objects that exist.
      read(question);
      survey.setVariable("top", 100);
      const check = (step: string, index: number): void => {
        expect(read(question), kind + " " + step + ": the objects show the computed values").toEqual(expected[index]);
        expect(errors, kind + " " + step + ": nothing reported").toEqual([]);
        expect(source.calls, kind + " " + step + ": no source call").toEqual([]);
      };
      check("page 0", 0);
      if (expected[0][0].y !== undefined) {
        expect(question.value[0].y, kind + ": the window holds the chain").toBe(expected[0][0].y);
      }
      question.pageIndex = 1;
      if (!!extra) extra(question);
      check("page 1", 1);
      question.pageIndex = 0;
      if (!!extra) extra(question);
      check("back on page 0", 2);
    };
    const fields = ["x", "y", "d", "e", "s"];
    const computed = (a: number, s?: number): any => ({ x: a + 1, y: (a + 1) * 2, d: "def", e: a * 10, s: s });
    /* Page 1 was not shown when the variable changed: its records have no s. An expression question
       does not run in a read-only object (runIfReadOnly), and every object of this source is read-only:
       only the panels built when the source is assigned compute them. */
    const onPage1 = (a: number): any => ({ x: undefined, y: undefined, d: "def", e: a * 10, s: undefined });
    // Back on page 0 the source pages: the page is read again, and the source never got the computed values.
    const expected = [[computed(1, 101), computed(2, 102)], [onPage1(3), onPage1(4)], [onPage1(1), onPage1(2)]];
    // The expression cells of a matrix run in a read-only row, on every page.
    const expectedInMatrix = [[computed(1, 101), computed(2, 102)], [computed(3), computed(4)], [computed(1), computed(2)]];
    // A detail panel is created read-only, on every page: its defaults are computed, its expressions do not run.
    const expectedInDetail = [[onPage1(1), onPage1(2)], [onPage1(3), onPage1(4)], [onPage1(1), onPage1(2)]];
    const readFields = (objects: Array<any>): Array<any> => objects.map((o: any) => {
      const res: any = {};
      fields.forEach((name: string) => { res[name] = o.getQuestionByName(name).value; });
      return res;
    });
    run("panel", { templateElements: [{ type: "text", name: "a", inputType: "number" },
      { type: "expression", name: "x", expression: "{panel.a} + 1" },
      { type: "expression", name: "y", expression: "{panel.x} * 2" },
      { type: "text", name: "d", defaultValue: "def" },
      { type: "text", name: "e", defaultValueExpression: "{panel.a} * 10" },
      { type: "text", name: "s", setValueExpression: "{top} + {panel.a}" }] },
    (q: any) => readFields(q.panels), expected);
    run("panel", { displayMode: "tab", templateElements: [{ type: "text", name: "a", inputType: "number" },
      { type: "expression", name: "x", expression: "{panel.a} + 1" },
      { type: "expression", name: "y", expression: "{panel.x} * 2" },
      { type: "text", name: "d", defaultValue: "def" },
      { type: "text", name: "e", defaultValueExpression: "{panel.a} * 10" },
      { type: "text", name: "s", setValueExpression: "{top} + {panel.a}" }] },
    (q: any) => readFields(q.panels), expected);
    run("matrix", { columns: [{ name: "a", cellType: "text", inputType: "number" },
      { name: "x", cellType: "expression", expression: "{row.a} + 1" },
      { name: "y", cellType: "expression", expression: "{row.x} * 2" },
      { name: "d", cellType: "text", defaultValue: "def" },
      { name: "e", cellType: "text", defaultValueExpression: "{row.a} * 10" },
      { name: "s", cellType: "text", setValueExpression: "{top} + {row.a}" }] },
    (q: any) => readFields(q.visibleRows), expectedInMatrix);
    run("matrix", { detailPanelMode: "underRow", columns: [{ name: "a", cellType: "text", inputType: "number" }],
      detailElements: [{ type: "expression", name: "x", expression: "{row.a} + 1" },
        { type: "expression", name: "y", expression: "{row.x} * 2" },
        { type: "text", name: "d", defaultValue: "def" },
        { type: "text", name: "e", defaultValueExpression: "{row.a} * 10" },
        { type: "text", name: "s", setValueExpression: "{top} + {row.a}" }] },
    (q: any) => readFields(q.visibleRows.map((row: any) => row.detailPanel)), expectedInDetail,
    (q: any) => { q.visibleRows.forEach((row: any) => row.showDetailPanel()); });
  });

  test("the in-memory sources refuse nothing: every path is applied and stored, with no report", () => {
    ["matrix", "panel"].forEach((kind: string): void => {
      pathsOf(kind).forEach((path: IPath): void => {
        [false, true].forEach((isSurveyData: boolean): void => {
          const name = kind + " " + path.name + (isSurveyData ? " over survey data" : " over an array");
          const survey = new SurveyModel({ elements: [elementOf(kind, { name: "q" })] });
          const question = <any>survey.getQuestionByName("q");
          let stored: Array<any> = sixRecords();
          const source = isSurveyData ? new SurveyDataDynamicDataSource(survey, "store") :
            new ArrayDynamicDataSource((): Array<any> => stored, (records: Array<any>): void => { stored = records; });
          if (isSurveyData) survey.setValue("store", sixRecords());
          question.dataSource = source;
          const errors: Array<string> = [];
          survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
          const before = JSON.stringify(isSurveyData ? survey.getValue("store") : stored);
          path.run(question);
          const after = JSON.stringify(isSurveyData ? survey.getValue("store") : stored);
          expect(errors, name + ": nothing reported").toEqual([]);
          expect(after !== before, name + ": stored").toBe(true);
        });
      });
    });
  });

  test("a refusal for another reason stays silent", () => {
    const checks: Array<{ name: string, kind: string, json: any, run: (q: any) => void }> = [
      { name: "allowAddPanel false", kind: "panel", json: { allowAddPanel: false }, run: (q: any) => { q.addPanelUI(); } },
      { name: "allowRemoveRows false", kind: "matrix", json: { allowRemoveRows: false }, run: (q: any) => { q.removeRow(0); } },
      { name: "maxRowCount reached", kind: "matrix", json: { maxRowCount: 6 }, run: (q: any) => { q.addRow(); } }
    ];
    checks.forEach((check) => {
      const source = new CapabilitySource(sixRecords());
      const { question, errors } = create(check.kind, source, check.json);
      const before = stateOf(question);
      check.run(question);
      expect(stateOf(question), check.name + ": nothing changed").toEqual(before);
      expect(errors, check.name + ": silent").toEqual([]);
      expect(source.calls, check.name).toEqual([]);
    });
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "fixed", rows: ["r1", "r2"], columns: [{ name: "a", cellType: "text" }] }] });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    expect((<any>survey.getQuestionByName("fixed")).refuseOperationOfSource("insert"), "a fixed matrix: the membership rule is not the source's").toBe(false);
    expect(errors, "silent").toEqual([]);
  });

  test("an outside assignment of the value gives the console warning only, no refusal report", () => {
    ["matrix", "panel"].forEach((kind: string): void => {
      const warnings: Array<string> = [];
      const oldWarn = ConsoleWarnings.warn;
      ConsoleWarnings.warn = (text: string): void => { warnings.push(text); };
      try {
        const { question, errors } = create(kind, new CapabilitySource(sixRecords(), undefined, false));
        question.value = [{ a: "outside" }];
        expect(warnings.length, kind + ": the console warning").toBe(1);
        expect(errors, kind + ": no report").toEqual([]);
      } finally {
        ConsoleWarnings.warn = oldWarn;
      }
    });
  });
});

/* A source that pages itself holds one window: a number of the whole view inside it acts on its
   record, a number outside it reads null and a write to it is refused and reported - it never acts on
   the record the window holds at that position. */
describe("Remote data source: a number names the same record in every method", () => {
  const setUp = async (keyField?: string | null): Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel, source: FakeServerSource, errors: Array<string> }> => {
    const source = new FakeServerSource(serverRecords(12), undefined, keyField);
    const { survey, question } = await createMatrix(source);
    question.goToPage(1);
    await flush();
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    source.reset();
    return { survey: survey, question: question, source: source, errors: errors };
  };
  test("matrix, page 1: a number inside the window names its record", async () => {
    const { question, source, errors } = await setUp();
    expect(question.getRowValue(6), "#1: the stored record, id included").toEqual({ id: 6, col1: "v6", col2: 6 });
    expect(question.getItemData(question.visibleRows[1]), "#2").toEqual({ id: 6, col1: "v6", col2: 6 });
    expect(question.getQuestionFromArray("col1", 6).value, "#3").toBe("v6");
    question.setRowValue(7, { col1: "X", col2: 7 });
    await flush();
    expect(source.argsOf("update").map(args => args[0]), "#4: the record of number 7").toEqual([7]);
    question.removeRowByIndex(8);
    await flush();
    expect(source.argsOf("remove"), "#5").toEqual([[8]]);
    expect(errors, "#6").toEqual([]);
  });
  test("matrix, page 1: a number outside the window reads null and refuses a write once, with nothing sent", async () => {
    const { question, source, errors } = await setUp();
    expect(question.getRowValue(0), "#1").toBeNull();
    expect(question.getQuestionFromArray("col1", 0), "#2").toBeNull();
    expect(errors, "#3: a read is not reported").toEqual([]);
    question.setRowValue(0, { col1: "X" });
    question.moveRowByIndex(0, 6);
    question.moveRowByIndex(6, 11);
    question.addRowByIndex({ col1: "N" }, 0);
    question.removeRowByIndex(0);
    await flush();
    expect(errors, "#4").toEqual(["update", "move", "move", "insert", "remove"]);
    expect(source.calls.length, "#5: no source call").toBe(0);
    expect(rowValues(question), "#6: the window is as it was").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("matrix, page 1: a source without keyField refuses every write first, once", async () => {
    const { question, source, errors } = await setUp(null);
    question.setRowValue(0, { col1: "X" });
    question.setRowValue(6, { col1: "X" });
    question.moveRowByIndex(5, 6);
    question.addRowByIndex({ col1: "N" }, 6);
    question.removeRowByIndex(6);
    await flush();
    expect(errors, "#1").toEqual(["update", "update", "move", "insert", "remove"]);
    expect(source.calls.length, "#2").toBe(0);
    expect(rowValues(question), "#3").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("panel, page 1: getQuestionFromArray takes a created position of the whole view", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source);
    question.goToPage(1);
    await flush();
    expect(question.getQuestionFromArray("col1", 6).value, "#1").toBe("v6");
    expect(question.getQuestionFromArray("col1", 1), "#2").toBeNull();
  });
});

/* A refresh or the refill after a remove that starts while the read of another page is pending reads
   that page, and the page commits with its index: the newest navigation wins. The source answers by
   hand (auto = false), in the order each test chooses. */
describe("Remote data source: a refresh during a page move reads the page of the move", () => {
  const groupedRecords = (count: number): Array<any> => serverRecords(count).map((r: any): any => Object.assign(r, { group: r.id % 2 === 0 ? "even" : "odd" }));
  const setUp = async (count: number = 12, page: number = 0): Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel, source: FakeServerSource, errors: Array<string> }> => {
    const source = new FakeServerSource(groupedRecords(count));
    const { survey, question } = await createMatrix(source);
    if (page > 0) {
      question.goToPage(page);
      await flush();
    }
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    source.reset();
    source.auto = false;
    return { survey: survey, question: question, source: source, errors: errors };
  };
  const settleInOrder = async (source: FakeServerSource, order: Array<number>): Promise<void> => {
    const calls = source.pending.slice();
    for (let i = 0; i < order.length; i++) {
      calls[order[i]].settle();
      await flush();
    }
  };
  test("nextPage, then a refresh: the answers in order and in reverse order commit page 1 with its rows", async () => {
    for (const order of [[0, 1], [1, 0]]) {
      const { question, source, errors } = await setUp();
      question.nextPage();
      question.refreshDataSource();
      expect(source.ranges, "#1: " + order + ": both read page 1").toEqual([[5, 5], [5, 5]]);
      await settleInOrder(source, order);
      expect(question.pageIndex, "#2: " + order).toBe(1);
      expect(rowValues(question), "#3: " + order).toEqual(["v5", "v6", "v7", "v8", "v9"]);
      expect(question.isDataLoading, "#4: " + order).toBe(false);
      expect(errors, "#5: " + order).toEqual([]);
    }
  });
  test("nextPage, then a refresh that fails: the committed page stays, one error, and the next Next asks for page 1 again", async () => {
    const { question, source, errors } = await setUp();
    question.nextPage();
    question.refreshDataSource();
    const calls = source.pending.slice();
    calls[1].fail(new Error("boom"));
    await flush();
    calls[0].settle();
    await flush();
    expect(question.pageIndex, "#1").toBe(0);
    expect(rowValues(question), "#2").toEqual(["v0", "v1", "v2", "v3", "v4"]);
    expect(errors, "#3").toEqual(["read"]);
    expect(question.isDataLoading, "#4").toBe(false);
    source.auto = true;
    question.nextPage();
    await flush();
    expect(source.ranges[source.ranges.length - 1], "#5").toEqual([5, 5]);
    expect(rowValues(question), "#6").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("nextPage, then a refresh: a superseded page read that fails late changes nothing", async () => {
    const { question, source, errors } = await setUp();
    question.nextPage();
    question.refreshDataSource();
    const calls = source.pending.slice();
    calls[1].settle();
    await flush();
    calls[0].fail(new Error("late"));
    await flush();
    expect(question.pageIndex, "#1").toBe(1);
    expect(rowValues(question), "#2").toEqual(["v5", "v6", "v7", "v8", "v9"]);
    expect(errors, "#3").toEqual([]);
    expect(question.isDataLoading, "#4").toBe(false);
  });
  test("a move back to the committed page while another is pending: a refresh reads the committed window", async () => {
    const { question, source } = await setUp(20, 1);
    question.nextPage();
    question.prevPage();
    question.refreshDataSource();
    expect(source.ranges, "#1").toEqual([[10, 5], [5, 5], [5, 5]]);
    source.settleAll();
    await flush();
    expect(question.pageIndex, "#2").toBe(1);
    expect(rowValues(question), "#3").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  test("nextPage, then a remove: the refill reads page 1 and page 1 commits", async () => {
    const { question, source } = await setUp();
    question.nextPage();
    question.removeRow(0, false);
    // The remove answers first: the refill then starts while the read of page 1 is in flight.
    source.callsOf("remove")[0].settle();
    await flush();
    for (let i = 0; i < 5 && source.pending.length > 0; i++) {
      source.settleAll();
      await flush();
    }
    expect(source.ranges.some(range => range[0] === 0), "#1: page 0 is not read").toBe(false);
    expect(question.pageIndex, "#2").toBe(1);
    expect(rowValues(question), "#3: page 1 of the records left").toEqual(["v6", "v7", "v8", "v9", "v10"]);
    expect(question.isDataLoading, "#4").toBe(false);
  });
  test("a remove, then nextPage: page 1 commits", async () => {
    const { question, source } = await setUp();
    question.removeRow(0, false);
    question.nextPage();
    for (let i = 0; i < 5 && source.pending.length > 0; i++) {
      source.settleAll();
      await flush();
    }
    expect(question.pageIndex, "#1").toBe(1);
    expect(rowValues(question), "#2").toEqual(["v6", "v7", "v8", "v9", "v10"]);
  });
  test("a new filter on page 3, then a refresh: page 0 of the filtered view, index 0", async () => {
    const { question, source } = await setUp(40, 3);
    question.filterExpression = "{group} = 'even'";
    question.refreshDataSource();
    expect(source.ranges, "#1").toEqual([[0, 5], [0, 5]]);
    await settleInOrder(source, [1, 0]);
    expect(question.pageIndex, "#2").toBe(0);
    expect(rowValues(question), "#3").toEqual(["v0", "v2", "v4", "v6", "v8"]);
  });
  test("a new sort on page 3, then a refresh: page 3 in the new order, one read each, none of page 0", async () => {
    const { question, source } = await setUp(40, 3);
    question.sort([{ field: "col2", direction: "desc" }]);
    question.refreshDataSource();
    expect(source.ranges, "#1").toEqual([[15, 5], [15, 5]]);
    source.settleAll();
    await flush();
    expect(question.pageIndex, "#2").toBe(3);
    expect(rowValues(question), "#3").toEqual(["v24", "v23", "v22", "v21", "v20"]);
  });
  test("a pending update, then nextPage and a refresh: one read of page 1 once the write settles", async () => {
    const { question, source } = await setUp();
    question.visibleRows[0].getQuestionByName("col1").value = "edited";
    question.nextPage();
    question.refreshDataSource();
    expect(source.pending.map(call => call.op), "#1: the reads wait for the write").toEqual(["update"]);
    source.settleAll();
    await flush();
    source.settleAll();
    await flush();
    expect(source.ranges, "#2").toEqual([[5, 5]]);
    expect(question.pageIndex, "#3").toBe(1);
    expect(rowValues(question), "#4").toEqual(["v5", "v6", "v7", "v8", "v9"]);
  });
  const keepNewAtEnd = (source: FakeServerSource): void => {
    source.insert = (record: any): Promise<any> => {
      const stored = Object.assign({ id: 500 }, record);
      source.records.push(stored);
      return Promise.resolve(Object.assign({}, stored));
    };
  };
  test("an added record stays through refills in a row, and a refresh drops it", async () => {
    const run = async (last: (question: QuestionMatrixDynamicModel) => void): Promise<Array<any>> => {
      const source = new FakeServerSource(serverRecords(12));
      keepNewAtEnd(source);
      const { question } = await createMatrix(source, { defaultRowValue: { col1: "new" } });
      question.addRow();
      await flush();
      question.removeRow(0, false);
      await flush();
      source.auto = false;
      question.removeRow(0, false);
      last(question);
      for (let i = 0; i < 5 && source.pending.length > 0; i++) {
        source.settleAll();
        await flush();
      }
      return rowValues(question);
    };
    expect((await run(q => q.removeRow(0, false))).indexOf("new") > -1, "#1: a refill behind a refill keeps it").toBe(true);
    expect((await run(q => q.refreshDataSource())).indexOf("new"), "#2: a refresh is a reload").toBe(-1);
  });
  test("panel, tab: a move to a panel on the next page, then a refresh, selects that panel once the page commits", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { displayMode: "tab" });
    source.auto = false;
    question.currentIndex = 7;
    question.refreshDataSource();
    source.settleAll();
    await flush();
    expect(question.pageIndex, "#1").toBe(1);
    expect(question.currentIndex, "#2").toBe(7);
    expect(question.currentPanel.getQuestionByName("col1").value, "#3").toBe("v7");
  });
  test("panel, carousel: Next from the last panel of a page, then a refresh, selects the first panel of the next page", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { displayMode: "carousel" });
    question.currentIndex = 4;
    source.auto = false;
    question.goToNextPanel();
    question.refreshDataSource();
    source.settleAll();
    await flush();
    expect(question.pageIndex, "#1").toBe(1);
    expect(question.currentIndex, "#2").toBe(5);
    expect(question.currentPanel.getQuestionByName("col1").value, "#3").toBe("v5");
  });
});

/* A source that pages itself rebuilds the panels when a read commits: the current panel follows the
   removal rule once the page is read, and one event reports a change once, when it is complete. */
describe("Remote data source: the current panel of a paged dynamic panel", () => {
  const setUp = async (count: number, json: any): Promise<{ question: QuestionPanelDynamicModel, source: FakeServerSource, events: Array<number> }> => {
    const source = new FakeServerSource(serverRecords(count));
    const { survey, question } = await createPanel(source, Object.assign({ displayMode: "tab" }, json));
    question.currentPanel;
    const events: Array<number> = [];
    survey.onDynamicPanelCurrentIndexChanged.add((_, options) => { events.push(options.visiblePanelIndex); });
    return { question: question, source: source, events: events };
  };
  const currentCol1 = (question: QuestionPanelDynamicModel): any => question.currentPanel.getQuestionByName("col1").value;
  test("a refresh of the same page raises nothing; a move on the page one event", async () => {
    const { question, events } = await setUp(7, { pageSize: 2 });
    question.currentIndex = 1;
    events.splice(0);
    question.refreshDataSource();
    await flush();
    expect(events, "#1").toEqual([]);
    expect(question.currentIndex, "#2").toBe(1);
    question.currentIndex = 3;
    await flush();
    expect(events, "#3").toEqual([3]);
    expect(currentCol1(question), "#4").toBe("v3");
  });
  test("a move to another page raises one event once its read commits, and none when the read fails", async () => {
    const { question, source, events } = await setUp(12, {});
    source.auto = false;
    question.currentIndex = 7;
    expect(events, "#1: the read is pending").toEqual([]);
    source.settleAll();
    await flush();
    expect(events, "#2").toEqual([7]);
    events.splice(0);
    question.currentIndex = 2;
    source.pending[0].fail(new Error("boom"));
    await flush();
    expect(events, "#3: a failed read").toEqual([]);
    expect(question.currentIndex, "#4: the current panel stays").toBe(7);
  });
  test("the current panel removed with a refill pending: the next record once the read commits, one event", async () => {
    const { question, source, events } = await setUp(12, {});
    question.currentIndex = 2;
    events.splice(0);
    question.removePanel(question.currentPanel);
    for (let i = 0; i < 5 && source.pending.length > 0; i++) {
      source.settleAll();
      await flush();
    }
    await flush();
    expect(currentCol1(question), "#1").toBe("v3");
    expect(question.currentIndex, "#2").toBe(2);
    expect(events, "#3").toEqual([2]);
  });
  test("the current panel alone on the last page: the previous record once the previous page is read, one event", async () => {
    const { question, events } = await setUp(11, {});
    question.currentIndex = 10;
    await flush();
    events.splice(0);
    question.removePanel(question.currentPanel);
    await flush();
    expect(question.pageIndex, "#1").toBe(1);
    expect(currentCol1(question), "#2").toBe("v9");
    expect(question.currentIndex, "#3").toBe(9);
    expect(events, "#4").toEqual([9]);
  });
  test("a refill that no longer holds the next record: the first panel of the page", async () => {
    const { question, source } = await setUp(12, {});
    question.currentIndex = 2;
    source.auto = false;
    question.removePanel(question.currentPanel);
    // Another user moves record 3 to the end before the refill reads the page.
    source.callsOf("remove")[0].settle();
    source.moveRecordBehindTheGrid(2, 10);
    await flush();
    source.settleAll();
    await flush();
    expect(question.panels.map(panel => panel.getQuestionByName("col1").value), "#1").toEqual(["v0", "v1", "v4", "v5", "v6"]);
    expect(currentCol1(question), "#2").toBe("v0");
  });
});

describe("Remote data source: an add opens and focuses the row of the record it added", () => {
  [false, true].forEach((isBuilt: boolean): void => {
    test("matrix, a source that pages itself" + (isBuilt ? ", the rows built" : ", the rows not built yet") + ": the new record's row opens and is focused", async () => {
      await checkAddOpensNewRow(isBuilt);
    });
  });
  const checkAddOpensNewRow = async (isBuilt: boolean): Promise<void> => {
    const source = new FakeServerSource(serverRecords(3));
    const { question } = await createMatrix(source, { detailPanelMode: "underRow", detailPanelShowOnAdding: true,
      detailElements: [{ type: "text", name: "d" }] });
    if (isBuilt) question.visibleRows;
    const focus = vi.spyOn(Question.prototype, "focus").mockImplementation(() => { });
    try {
      question.addRow(true);
      await flush();
      const newRow = question.visibleRows[3];
      expect(newRow.isDetailPanelShowing, "#1").toBe(true);
      expect(focus.mock.instances.length === 1 && focus.mock.instances[0] === newRow.getQuestionByName("col1"), "#2").toBe(true);
      expect(question.visibleRows.slice(0, 3).some(row => row.isDetailPanelShowing), "#3").toBe(false);
    } finally {
      focus.mockRestore();
    }
  };
});

describe("Remote data source: addRowByIndex with a negative number counts from the end of the whole view", () => {
  const setUp = async (page: number): Promise<{ question: QuestionMatrixDynamicModel, source: FakeServerSource, errors: Array<string> }> => {
    const source = new FakeServerSource(serverRecords(15));
    const { survey, question } = await createMatrix(source);
    question.goToPage(page);
    await flush();
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    source.reset();
    return { question: question, source: source, errors: errors };
  };
  test("the page that holds the last record: -1 inserts in front of it with one insert", async () => {
    const { question, source, errors } = await setUp(2);
    question.addRowByIndex({ col1: "N" }, -1);
    await flush();
    expect(source.argsOf("insert").map(args => args[1]), "#1: in front of record 14").toEqual([14]);
    expect(errors, "#2").toEqual([]);
  });
  test("another page: -1 is refused and reported once, nothing is inserted", async () => {
    const { question, source, errors } = await setUp(0);
    question.addRowByIndex({ col1: "N" }, -1);
    await flush();
    expect(source.argsOf("insert"), "#1").toEqual([]);
    expect(errors, "#2").toEqual(["insert"]);
    expect(rowValues(question), "#3: the window is as it was").toEqual(["v0", "v1", "v2", "v3", "v4"]);
  });
});

describe("Remote data source: an update lists every field the record changed", () => {
  const editCell = (kind: string, question: Question, value: any): void => {
    if (kind === "matrix") {
      (<QuestionMatrixDynamicModel>question).visibleRows[0].getQuestionByName("col1").value = value;
    } else {
      (<QuestionPanelDynamicModel>question).panels[0].getQuestionByName("col1").value = value;
    }
  };
  ["matrix", "panel"].forEach((kind: string): void => {
    test(kind + ": a case-only and a whitespace-only edit list the edited field", async () => {
      const source = keyedSource(3);
      const { question } = kind === "matrix" ? await createMatrix(source) : await createPanel(source);
      source.reset();
      editCell(kind, question, "V100");
      await flush();
      editCell(kind, question, "V100 ");
      await flush();
      expect(source.argsOf("update").map(args => args[2]), "#1").toEqual([["col1"], ["col1"]]);
      expect(recordWithKey(source, 100).col1, "#2").toBe("V100 ");
    });
  });
  test("matrix: a case-only edit of a record whose insert is pending is sent with its field and kept", async () => {
    const source = keyedSource(3);
    const { question } = await createMatrix(source);
    source.auto = false;
    question.addRow();
    const rows = question.visibleRows;
    const cell = rows[rows.length - 1].getQuestionByName("col1");
    cell.value = "n";
    cell.value = "N";
    for (let i = 0; i < 4; i++) {
      source.settleAll();
      await flush();
    }
    const updates = source.argsOf("update");
    expect(updates[updates.length - 1][2], "#1").toEqual(["col1"]);
    expect(rowValues(question)[rows.length - 1], "#2: the answer does not overwrite it").toBe("N");
    expect(source.records[source.records.length - 1].col1, "#3").toBe("N");
  });
});

describe("Remote data source: showing records sends nothing", () => {
  function pagingSource(): FakeServerSource {
    return new FakeServerSource(serverRecords(6, 100), undefined, "id");
  }
  const panelTemplate = (extra?: Array<any>): any => ({ templateElements: [{ type: "text", name: "col1" },
    { type: "text", name: "st", defaultValue: "new" }].concat(extra || []) });
  const matrixColumns = (extra?: Array<any>): any => ({ columns: [{ name: "col1", cellType: "text" },
    { name: "st", cellType: "text", defaultValue: "new" }].concat(extra || []) });
  test("panel: moving between pages sends no update for the template default", async () => {
    const source = pagingSource();
    const { question } = await createPanel(source, Object.assign({ pageSize: 2 }, panelTemplate()));
    question.nextPage();
    await flush();
    question.prevPage();
    await flush();
    expect(source.argsOf("update"), "#1").toEqual([]);
    expect(question.panels[0].getQuestionByName("st").value, "#2: the panel shows the default").toBe("new");
  });
  test("matrix: moving between pages sends no update for the column default", async () => {
    const source = pagingSource();
    const { question } = await createMatrix(source, Object.assign({ pageSize: 2 }, matrixColumns()));
    question.visibleRows;
    question.nextPage();
    await flush();
    question.visibleRows;
    question.prevPage();
    await flush();
    question.visibleRows;
    expect(source.argsOf("update"), "#1").toEqual([]);
  });
  test("panel: building the panels of a source without paging sends no update", async () => {
    const source = new FakeServerSource(serverRecords(3, 100), ["insert", "update", "remove", "move"], "id");
    const { question } = await createPanel(source, Object.assign({ pageSize: 0 }, panelTemplate()));
    expect(question.panels.length, "#1").toBe(3);
    expect(source.argsOf("update"), "#2").toEqual([]);
  });
  test("panel: an expression question sends nothing on a page view, and an edit sends the edit and the recomputed expression", async () => {
    const source = pagingSource();
    const { question } = await createPanel(source, Object.assign({ pageSize: 2 },
      panelTemplate([{ type: "expression", name: "ex", expression: "{panel.col1} + '!'" }])));
    question.nextPage();
    await flush();
    question.prevPage();
    await flush();
    expect(source.argsOf("update"), "#1").toEqual([]);
    question.panels[0].getQuestionByName("col1").value = "e";
    await flush();
    const updates = source.argsOf("update");
    const last = updates[updates.length - 1];
    expect(last[0], "#2").toBe(100);
    expect(last[1], "#3: the record holds the edit, the default and the expression").toEqual({ id: 100, col1: "e", col2: 100, st: "new", ex: "e!" });
    expect(recordWithKey(source, 100), "#4").toEqual({ id: 100, col1: "e", col2: 100, st: "new", ex: "e!" });
  });
  test("matrix: an expression column sends nothing on a page view, and an edit sends the edit and the recomputed expression", async () => {
    const source = pagingSource();
    const { question } = await createMatrix(source, Object.assign({ pageSize: 2 },
      matrixColumns([{ name: "ex", cellType: "expression", expression: "{row.col1} + '!'" }])));
    question.visibleRows;
    question.nextPage();
    await flush();
    question.visibleRows;
    question.prevPage();
    await flush();
    question.visibleRows;
    expect(source.argsOf("update"), "#1").toEqual([]);
    question.visibleRows[0].getQuestionByName("col1").value = "e";
    await flush();
    const updates = source.argsOf("update");
    const last = updates[updates.length - 1];
    expect(last[0], "#2").toBe(100);
    expect(last[1], "#3: the record holds the edit, the default and the expression").toEqual({ id: 100, col1: "e", col2: 100, st: "new", ex: "e!" });
  });
  test("matrix: a sorted page with an expression column on the row index sends nothing when it is shown", async () => {
    const records = [1, 2, 3, 4, 5].map(i => ({ id: i, n: i }));
    const updates: Array<any> = [];
    const source: IDynamicDataSource = {
      keyField: "id",
      read: () => Promise.resolve(records.map(record => Object.assign({}, record))),
      update: (key: any, record: any, fields: Array<string>) => { updates.push([key, fields]); return Promise.resolve(); }
    };
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", pageSize: 2, sortCriteria: [{ field: "n", direction: "desc" }], rowCount: 0,
      columns: [{ name: "n", cellType: "text" }, { name: "e", cellType: "expression", expression: "{rowIndex}" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    question.dataSource = source;
    await flush();
    question.visibleRows;
    question.pageIndex = 1;
    question.visibleRows;
    await flush();
    expect(updates, "#1: showing the pages sends nothing").toEqual([]);
    expect(question.visibleRows.map(row => row.getQuestionByColumnName("e").value), "#2: the page shows the computed values").toEqual([3, 2]);
    question.visibleRows[0].getQuestionByColumnName("n").value = "x";
    await flush();
    expect(updates, "#3: the next edit carries the computed field").toEqual([[3, ["n", "e"]]]);
  });
  test("the first edit of a record shown with a default lists the edited field and the default's field", async () => {
    const panelSource = pagingSource();
    const panel = (await createPanel(panelSource, Object.assign({ pageSize: 2 }, panelTemplate()))).question;
    panel.panels[0].getQuestionByName("col1").value = "e";
    await flush();
    expect(panelSource.argsOf("update"), "#1: panel").toEqual([[100, { id: 100, col1: "e", col2: 100, st: "new" }, ["col1", "st"]]]);
    const matrixSource = pagingSource();
    const matrix = (await createMatrix(matrixSource, Object.assign({ pageSize: 2 },
      matrixColumns([{ name: "ex", cellType: "expression", expression: "{row.st} + '!'" }])))).question;
    matrix.visibleRows[0].getQuestionByName("col1").value = "e";
    await flush();
    expect(matrixSource.argsOf("update").map(args => args[2]), "#2: matrix").toEqual([["col1", "st", "ex"]]);
  });
  test("panel: another expression reads the default while nothing was sent", async () => {
    const source = pagingSource();
    const { question } = await createPanel(source, Object.assign({ pageSize: 2 },
      panelTemplate([{ type: "expression", name: "copy", expression: "{panel.st}" }])));
    expect(question.panels[0].getQuestionByName("copy").value, "#1").toBe("new");
    expect(source.argsOf("update"), "#2").toEqual([]);
  });
  test("panel: addPanel sends the default in the insert", async () => {
    const source = pagingSource();
    const { question } = await createPanel(source, Object.assign({ pageSize: 2 }, panelTemplate()));
    question.addPanel();
    await flush();
    expect(source.argsOf("insert").map(args => args[0]), "#1").toEqual([{ st: "new" }]);
    expect(source.argsOf("update"), "#2").toEqual([]);
  });
});

describe("Remote data source: a validated navigation waits for the question's pending data operations", () => {
  const requiredMatrix = (extra?: any): any => Object.assign({ type: "matrixdynamic", name: "matrix", rowCount: 0, pageSize: 5,
    columns: [{ name: "col1", isRequired: true }, { name: "col2" }] }, extra);
  async function createSurvey(records: Array<any>, json?: any):
    Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel, source: FakeServerSource, completed: Array<boolean> }> {
    const survey = new SurveyModel(Object.assign({ elements: [requiredMatrix()] }, json));
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const source = new FakeServerSource(records, undefined, "id");
    source.auto = false;
    question.dataSource = source;
    await flush();
    const completed = new Array<boolean>();
    survey.onComplete.add(() => { completed.push(true); });
    return { survey: survey, question: question, source: source, completed: completed };
  }
  test("tryComplete during the first read waits, then the survey stays on an empty required cell", async () => {
    const { survey, question, source, completed } = await createSurvey([{ id: 1, col1: "", col2: 1 }]);
    expect(source.pending.length, "#1: the read is pending").toBe(1);
    expect(survey.tryComplete(), "#2").toBe(false);
    source.settleAll();
    await flush();
    expect(completed, "#3").toEqual([]);
    expect(survey.state, "#4").toBe("running");
    expect(question.visibleRows[0].getQuestionByName("col1").errors.length, "#5: the error is shown").toBe(1);
  });
  test("tryComplete during the first read completes once the read brings valid records", async () => {
    const { survey, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    expect(survey.tryComplete(), "#1").toBe(false);
    source.settleAll();
    await flush();
    expect(completed, "#2: onComplete once").toEqual([true]);
    expect(survey.state, "#3").toBe("completed");
  });
  test("tryComplete during a pending update waits for the write, then validates", async () => {
    const { survey, question, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    source.settleAll();
    await flush();
    question.visibleRows[0].getQuestionByName("col2").value = 5;
    expect(source.pending.map(call => call.op), "#1").toEqual(["update"]);
    expect(survey.tryComplete(), "#2").toBe(false);
    expect(completed, "#3").toEqual([]);
    source.settleAll();
    await flush();
    expect(completed, "#4").toEqual([true]);
  });
  test("nextPage waits as well, and isCurrentPageValid answers at once", async () => {
    const { survey, source } = await createSurvey([{ id: 1, col1: "a", col2: 1 }],
      { elements: undefined, pages: [{ elements: [requiredMatrix()] }, { elements: [{ type: "text", name: "q2" }] }] });
    expect(survey.isCurrentPageValid, "#1: no callback, an answer at once").toBe(true);
    survey.nextPage();
    expect(survey.currentPageNo, "#2: waits for the read").toBe(0);
    source.settleAll();
    await flush();
    expect(survey.currentPageNo, "#3").toBe(1);
  });
  test("a question disposed during the wait releases it", async () => {
    const { survey, question, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    expect(survey.tryComplete(), "#1").toBe(false);
    question.dispose();
    await flush();
    expect(completed, "#2: the survey is not held by a question that is gone").toEqual([true]);
  });
  test("a write that never settles keeps the survey from completing", async () => {
    const { survey, question, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    source.settleAll();
    await flush();
    question.visibleRows[0].getQuestionByName("col2").value = 5;
    expect(survey.tryComplete(), "#1").toBe(false);
    await flush();
    expect(completed, "#2").toEqual([]);
    expect(survey.state, "#3").toBe("running");
  });
  test("with validation disabled the survey completes at once", async () => {
    const { survey, completed } = await createSurvey([{ id: 1, col1: "", col2: 1 }]);
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(true);
    expect(completed, "#2").toEqual([true]);
  });
  async function createEdited(json?: any): Promise<{ survey: SurveyModel, question: QuestionMatrixDynamicModel, source: FakeServerSource, completed: Array<boolean> }> {
    const res = await createSurvey([{ id: 1, col1: "a", col2: 1 }], json);
    res.source.settleAll();
    await flush();
    res.question.visibleRows[0].getQuestionByName("col2").value = 5;
    expect(res.source.pending.map(call => call.op), "the update is pending").toEqual(["update"]);
    return res;
  }
  test("survey.clear() while a completion waits for a source write does not complete the cleared survey", async () => {
    const { survey, source, completed } = await createEdited();
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.clear();
    source.settleAll();
    await flush();
    expect(completed, "#2").toEqual([]);
    expect(survey.state, "#3").toBe("running");
  });
  test("assigning survey.data while a completion waits drops it", async () => {
    const { survey, source, completed } = await createEdited();
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.data = { q: 1 };
    source.settleAll();
    await flush();
    expect(completed, "#2").toEqual([]);
    expect(survey.state, "#3").toBe("running");
  });
  test("merging data while a completion waits with validation disabled drops it", async () => {
    const { survey, source, completed } = await createEdited();
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.mergeData({ q: 1 });
    source.settleAll();
    await flush();
    expect(completed, "#2").toEqual([]);
  });
  test("completing from the preview while a source write is pending completes when the write settles", async () => {
    const { survey, source, completed } = await createEdited();
    survey.showPreviewBeforeComplete = true;
    survey.validationEnabled = false;
    expect(survey.showPreview(), "#1").toBe(true);
    expect(survey.tryComplete(), "#2").toBe(false);
    expect(survey.state, "#3").toBe("preview");
    source.settleAll();
    await flush();
    expect(completed, "#4").toEqual([true]);
    expect(survey.state, "#5").toBe("completed");
  });
  test("leaving the preview while a completion waits drops it", async () => {
    const { survey, source, completed } = await createEdited();
    survey.showPreviewBeforeComplete = true;
    survey.validationEnabled = false;
    survey.showPreview();
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.cancelPreview();
    source.settleAll();
    await flush();
    expect(completed, "#2").toEqual([]);
    expect(survey.state, "#3").toBe("running");
  });
  test("doComplete() while a completion waits completes once and drops the held one", async () => {
    const { survey, source, completed } = await createEdited();
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.doComplete();
    expect(completed, "#2").toEqual([true]);
    source.settleAll();
    await flush();
    expect(completed, "#3: once").toEqual([true]);
  });
  test("a held completion is released without completing when its write is rejected", async () => {
    const { survey, source, completed } = await createEdited();
    survey.validationEnabled = false;
    const errors = new Array<string>();
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    expect(survey.tryComplete(), "#1").toBe(false);
    source.pending[0].fail(new Error("rejected"));
    await flush();
    expect(errors, "#2").toEqual(["update"]);
    expect(completed, "#3").toEqual([]);
    expect(survey.state, "#4").toBe("running");
    expect(survey.tryComplete(), "#5: the respondent completes again").toBe(true);
    expect(completed, "#6").toEqual([true]);
  });
  test("a records question disposed while a completion waits for its write lets the completion finish", async () => {
    const { survey, question, completed } = await createEdited();
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(false);
    question.dispose();
    await flush();
    expect(completed, "#2").toEqual([true]);
  });
  test("a records question removed from its page while a completion waits lets the completion finish", async () => {
    const { survey, question, completed } = await createEdited();
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.pages[0].removeElement(question);
    await flush();
    expect(completed, "#2").toEqual([true]);
  });
  test("removing another question while a completion waits keeps it waiting", async () => {
    const { survey, source, completed } = await createEdited({ elements: [requiredMatrix(), { type: "text", name: "other" }] });
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.pages[0].removeElement(survey.getQuestionByName("other"));
    await flush();
    expect(completed, "#2").toEqual([]);
    source.settleAll();
    await flush();
    expect(completed, "#3").toEqual([true]);
  });
  test("the writes of a source the question no longer has are not waited for", async () => {
    const { survey, question, source, completed } = await createEdited();
    survey.validationEnabled = false;
    question.dataSource = undefined;
    expect(source.pending.map(call => call.op), "#1: the write of the old source is still pending").toEqual(["update"]);
    expect(survey.tryComplete(), "#2").toBe(true);
    expect(completed, "#3").toEqual([true]);
  });
  test("a complete trigger that completes on a value change is not held by a pending write", async () => {
    const { survey, completed } = await createEdited({ elements: [requiredMatrix(), { type: "text", name: "q" }],
      triggers: [{ type: "complete", expression: "{q} = 1" }] });
    const prev = settings.triggers.executeCompleteOnValueChanged;
    settings.triggers.executeCompleteOnValueChanged = true;
    try {
      survey.setValue("q", 1);
    } finally {
      settings.triggers.executeCompleteOnValueChanged = prev;
    }
    expect(completed, "#1").toEqual([true]);
  });
  test("a validation waiting for a write is answered over the new records when the source is replaced by an in-memory one", async () => {
    const { survey, question, source, completed } = await createEdited();
    expect(survey.tryComplete(), "#1").toBe(false);
    question.dataSource = ArrayDynamicDataSource.fromArray([{ col1: "", col2: 2 }]);
    // The new source is read once the write of the replaced one settled.
    source.settleAll();
    await flush();
    expect(completed, "#2: validated over the new records").toEqual([]);
    expect(question.visibleRows[0].getQuestionByName("col1").errors.length, "#3: the new record's error is shown").toBe(1);
    question.visibleRows[0].getQuestionByName("col1").value = "b";
    expect(survey.tryComplete(), "#4").toBe(true);
    expect(completed, "#5").toEqual([true]);
  });
  test("a validation waiting for a write is answered over the survey value when the source is set to undefined", async () => {
    const { survey, question } = await createEdited();
    let answer = "not called";
    survey.validate(false, false, (hasErrors: boolean) => { answer = "called " + hasErrors; });
    expect(answer, "#1: waits for the write").toBe("not called");
    question.dataSource = undefined;
    expect(answer, "#2: answered at once, as a validation of the survey value answers").toBe("called " + !survey.validate(false, false));
  });
  test("a validation waiting for a write is answered when the new source answers asynchronously, once its first read commits", async () => {
    const { survey, question, source, completed } = await createEdited();
    expect(survey.tryComplete(), "#1").toBe(false);
    const newSource = new FakeServerSource([{ id: 7, col1: "n", col2: 1 }], undefined, "id");
    newSource.auto = false;
    question.dataSource = newSource;
    source.settleAll();
    await flush();
    expect(completed, "#2: the read is pending").toEqual([]);
    newSource.settleAll();
    await flush();
    expect(completed, "#3").toEqual([true]);
  });
  test("a failed read whose error handler throws still releases the waiting completion", async () => {
    const { survey, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    survey.onDynamicDataError.add(() => { throw new Error("handler"); });
    expect(survey.tryComplete(), "#1").toBe(false);
    const rejections: Array<any> = [];
    const onRejection = (reason: any): void => { rejections.push(reason); };
    process.on("unhandledRejection", onRejection);
    try {
      source.pending[0].fail(new Error("read"));
      await flush();
      await new Promise(resolve => setTimeout(resolve, 0));
    } finally {
      process.off("unhandledRejection", onRejection);
    }
    expect(completed, "#2: released").toEqual([true]);
    expect(rejections.map(error => error.message), "#3: the handler's exception reaches no caller, as before").toEqual(["handler"]);
  });
  test("every waiting validation is released when the first one's validation throws", async () => {
    const { survey, question } = await createEdited();
    const answers: Array<string> = [];
    survey.validate(false, false, (hasErrors: boolean) => { answers.push("first " + hasErrors); });
    survey.validate(false, false, (hasErrors: boolean) => { answers.push("second " + hasErrors); });
    expect(answers, "#1: both wait").toEqual([]);
    let throwOnce = true;
    survey.onValidateQuestion.add((_, options) => {
      if (options.name === "matrix" && throwOnce) {
        throwOnce = false;
        throw new Error("validator");
      }
    });
    expect(() => { question.dataSource = undefined; }, "#2: the first error is rethrown").toThrow("validator");
    expect(answers.filter(answer => answer.indexOf("second") === 0), "#3: the second one is answered").toEqual(["second false"]);
    expect(answers.filter(answer => answer.indexOf("first") === 0).length, "#4: the first one is released too").toBe(1);
  });
  test("completing from another page waits for a pending write of a remote question, then completes", async () => {
    const { survey, question, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }],
      { elements: undefined, pages: [{ elements: [requiredMatrix()] }, { elements: [{ type: "text", name: "q2" }] }] });
    source.settleAll();
    await flush();
    question.visibleRows[0].getQuestionByName("col2").value = 5;
    survey.currentPageNo = 1;
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(survey.state, "#2").toBe("running");
    source.settleAll();
    await flush();
    expect(completed, "#3").toEqual([true]);
    expect(survey.state, "#4").toBe("completed");
  });
  test("a page change while the completion waits cancels it", async () => {
    const { survey, question, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }],
      { elements: undefined, pages: [{ elements: [requiredMatrix()] }, { elements: [{ type: "text", name: "q2" }] }] });
    source.settleAll();
    await flush();
    question.visibleRows[0].getQuestionByName("col2").value = 5;
    survey.currentPageNo = 1;
    expect(survey.tryComplete(), "#1").toBe(false);
    survey.currentPageNo = 0;
    source.settleAll();
    await flush();
    expect(completed, "#2").toEqual([]);
    expect(survey.state, "#3").toBe("running");
    expect(survey.currentPageNo, "#4").toBe(0);
  });
  test("with validation disabled the completion still waits for a pending write", async () => {
    const { survey, source, completed } = await createEdited();
    survey.validationEnabled = false;
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(completed, "#2").toEqual([]);
    source.settleAll();
    await flush();
    expect(completed, "#3").toEqual([true]);
  });
  test("a write that starts while server validation is pending holds the completion until it settles", async () => {
    const { survey, question, source, completed } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    source.settleAll();
    await flush();
    let serverComplete: () => void = undefined;
    let serverCalls = 0;
    survey.onServerValidateQuestions.add((_, options) => {
      serverCalls++;
      serverComplete = options.complete;
    });
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(serverCalls, "#2").toBe(1);
    question.visibleRows[0].getQuestionByName("col2").value = 5;
    expect(source.pending.map(call => call.op), "#3").toEqual(["update"]);
    serverComplete();
    expect(survey.state, "#4: the write holds the completion").toBe("running");
    source.settleAll();
    await flush();
    // The held completion runs again, and so does the server validation.
    expect(serverCalls, "#5").toBe(2);
    serverComplete();
    expect(completed, "#6").toEqual([true]);
    expect(survey.state, "#7").toBe("completed");
  });
  test("a read started by the validation that a settled read runs again keeps the validation waiting until it settles", async () => {
    const { survey, question, source } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    let validateCount = 0;
    survey.onValidateQuestion.add((_, options) => {
      // The first call is the validation itself, the second one runs again once the first read settled.
      if (options.name === "matrix" && ++validateCount === 2) question.refreshDataSource();
    });
    const answers: Array<boolean> = [];
    survey.validate(false, false, (hasErrors: boolean) => { answers.push(hasErrors); });
    expect(answers, "#1: waits for the first read").toEqual([]);
    source.settleAll();
    await flush();
    expect(validateCount, "#2: validated again").toBe(2);
    expect(source.pending.length, "#3: the second read is pending").toBe(1);
    expect(answers, "#4: waits for the second read").toEqual([]);
    source.settleAll();
    await flush();
    expect(answers, "#5: answered once").toEqual([false]);
  });
  test("a source assigned by the error handler of a source being assigned answers a waiting validation once the outer assignment ends", async () => {
    const { survey, question } = await createSurvey([{ id: 1, col1: "a", col2: 1 }]);
    const answers: Array<boolean> = [];
    survey.validate(false, false, (hasErrors: boolean) => { answers.push(hasErrors); });
    expect(answers, "#1: waits for the first read").toEqual([]);
    const failing = ArrayDynamicDataSource.fromArray([{ id: 2, col1: "b" }]);
    vi.spyOn(failing, "read").mockImplementation((): Array<any> => { throw new Error("read"); });
    const second = ArrayDynamicDataSource.fromArray([{ id: 3, col1: "c" }, { id: 4, col1: "d" }]);
    const answersInHandler: Array<Array<boolean>> = [];
    survey.onDynamicDataError.add(() => {
      if (question.dataSource === second) return;
      question.dataSource = second;
      answersInHandler.push(answers.slice());
    });
    question.dataSource = failing;
    expect(answersInHandler, "#2: the outer assignment was still running").toEqual([[]]);
    expect(question.dataSource, "#3").toBe(second);
    expect(question.visibleRows.map(row => row.getValue("col1")), "#4").toEqual(["c", "d"]);
    expect(answers, "#5: answered once").toEqual([false]);
  });
});

describe("Remote data source: the survey learns of pending writes from the records questions", () => {
  test("a records question nested in a dynamic panel holds the completion while its write is pending", async () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 1, templateElements: [
      { type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }] }] });
    survey.validationEnabled = false;
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("p")).panels[0];
    const question = <QuestionMatrixDynamicModel>panel.getQuestionByName("matrix");
    const source = new FakeServerSource([{ id: 1, col1: "a" }]);
    source.auto = false;
    question.dataSource = source;
    source.settleAll();
    await flush();
    const completed = new Array<boolean>();
    survey.onComplete.add(() => { completed.push(true); });
    question.visibleRows[0].getQuestionByName("col1").value = "b";
    expect(source.pending.map(call => call.op), "#1").toEqual(["update"]);
    expect(survey.tryComplete(), "#2").toBe(false);
    expect(survey.state, "#3").toBe("running");
    source.settleAll();
    await flush();
    expect(completed, "#4").toEqual([true]);
  });
  test("a survey without the pending-writes member: a records question reads, writes and settles, and the completion is not held", async () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }] });
    (<any>survey).dynamicDataWritesChanged = undefined;
    survey.validationEnabled = false;
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const source = new FakeServerSource([{ id: 1, col1: "a" }]);
    source.auto = false;
    question.dataSource = source;
    source.settleAll();
    await flush();
    question.visibleRows[0].getQuestionByName("col1").value = "b";
    expect(source.pending.map(call => call.op), "#1").toEqual(["update"]);
    expect(survey.tryComplete(), "#2").toBe(true);
    source.settleAll();
    await flush();
    expect(source.records, "#3").toEqual([{ id: 1, col1: "b" }]);
  });
  test("a refusal while a write is pending keeps the completion waiting, and it completes when the write succeeds", async () => {
    const run = async (name: string, source: FakeServerSource, json: any, prepare: (question: QuestionMatrixDynamicModel) => void,
      refuse: (question: QuestionMatrixDynamicModel) => void): Promise<void> => {
      const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }, json)] });
      survey.validationEnabled = false;
      const errors: Array<string> = [];
      survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
      const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
      source.auto = false;
      question.dataSource = source;
      source.settleAll();
      await flush();
      prepare(question);
      source.settleAll();
      await flush();
      question.visibleRows[0].getQuestionByName("col1").value = "z";
      expect(source.pending.map(call => call.op), name + " #1: an update is pending").toEqual(["update"]);
      expect(survey.tryComplete(), name + " #2: the completion is held").toBe(false);
      refuse(question);
      expect(errors, name + " #3: the refusal is reported").toEqual(["remove"]);
      await flush();
      expect(survey.state, name + " #4: the update is still pending, the completion keeps waiting").toBe("running");
      for (let i = 0; i < 3; i++) {
        source.settleAll();
        await flush();
      }
      expect(survey.state, name + " #5: the update succeeded, the held completion runs").toBe("completed");
    };
    await run("a source that cannot remove", new FakeServerSource([{ id: 1, col1: "x" }, { id: 2, col1: "y" }], ["update"]), {},
      () => { }, question => question.removeRowByIndex(1));
    await run("a record a paging source has not loaded", new FakeServerSource(serverRecords(12)), { pageSize: 5 },
      question => question.goToPage(1), question => question.removeRowByIndex(0));
  });
});

describe("Remote data source: what a developer assigns through the survey is stored as assigned", () => {
  test("survey.setValue and mergeData reach survey.data, the rows keep showing the source and nothing is sent", async () => {
    const source = keyedSource(2);
    const { survey, question } = await createMatrix(source, { pageSize: 0 });
    source.reset();
    survey.setValue("matrix", [{ col1: "assigned" }]);
    expect(survey.data.matrix, "#1").toEqual([{ col1: "assigned" }]);
    expect(rowValues(question), "#2: the rows show the source").toEqual(["v100", "v101"]);
    survey.mergeData({ matrix: [{ col1: "merged" }] });
    expect(survey.data.matrix, "#3").toEqual([{ col1: "merged" }]);
    expect(rowValues(question), "#4").toEqual(["v100", "v101"]);
    await flush();
    expect(source.calls.map(call => call.op), "#5: nothing is sent").toEqual([]);
  });
  test("question.value is ignored with a warning", async () => {
    const source = keyedSource(2);
    const { question } = await createMatrix(source, { pageSize: 0 });
    const warn = vi.spyOn(ConsoleWarnings, "warn").mockImplementation(() => { });
    try {
      question.value = [{ col1: "x" }];
      expect(warn, "#1").toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
    expect(rowValues(question), "#2").toEqual(["v100", "v101"]);
  });
});

describe("Remote data source: a source replaced while a write is pending", () => {
  test("a new object over the same storage does not bring a removed record back, and the next removal works", async () => {
    const source = new FakeServerSource([{ id: 1, a: "r0" }, { id: 2, a: "r1" }, { id: 3, a: "r2" }], undefined, "id");
    source.auto = false;
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 5, columns: [{ name: "a" }] }] });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    question.dataSource = source;
    source.settleAll();
    await flush();
    question.removeRowUI(question.visibleRows[0]);
    question.dataSource = <any>Object.assign({}, source, { read: (request: IDynamicDataReadRequest): any => source.read(request) });
    const reads = source.callsOf("pagedRead").filter(call => !call.isSettled);
    if (reads.length > 0) reads[reads.length - 1].settle();
    await flush();
    source.callsOf("remove").forEach(call => call.settle());
    await flush();
    while(source.pending.length > 0) {
      source.pending[0].settle();
      await flush();
    }
    source.auto = true;
    expect(rowValues(question, "a"), "#1: the removed record stays removed").toEqual(["r1", "r2"]);
    question.removeRowUI(question.visibleRows[0]);
    await flush();
    expect(errors, "#2").toEqual([]);
    expect(source.records.map(r => r.a), "#3").toEqual(["r2"]);
    expect(rowValues(question, "a"), "#4").toEqual(["r2"]);
  });
});

describe("Remote data source: Next with an unknown total", () => {
  test("Next does not move past the pages the source reported while a page read is pending", async () => {
    const source = new FakeServerSource([0, 1, 2, 3, 4].map(i => ({ id: i, a: "r" + i })), undefined, "id");
    source.reportTotal = false;
    source.auto = false;
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 2, columns: [{ name: "a" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    question.dataSource = source;
    source.settleAll();
    await flush();
    const moved: Array<boolean> = [];
    const canNext: Array<boolean> = [];
    for (let i = 0; i < 5; i++) {
      moved.push(question.nextPage());
      canNext.push(question.canGoNextPage);
    }
    expect(moved, "#1: one move is accepted").toEqual([true, false, false, false, false]);
    expect(canNext, "#2: no Next while the read is pending").toEqual([false, false, false, false, false]);
    source.auto = true;
    while(source.pending.length > 0) {
      source.pending[0].settle();
      await flush();
    }
    const skips = (): Array<number> => source.ranges.slice(1).map(range => range[0]);
    expect(skips(), "#3: one read").toEqual([2]);
    expect(question.pageIndex, "#4").toBe(1);
    expect(rowValues(question, "a"), "#5").toEqual(["r2", "r3"]);
    expect(question.canGoNextPage, "#6: the page was full, more may follow").toBe(true);
    expect(question.nextPage(), "#7").toBe(true);
    await flush();
    expect(question.pageIndex, "#8").toBe(2);
    expect(rowValues(question, "a"), "#9").toEqual(["r4"]);
    expect(skips(), "#10").toEqual([2, 4]);
    expect(question.canGoNextPage, "#11").toBe(false);
  });
});

describe("Remote data source: the page of a nested paged question follows its record", () => {
  test("another record of a remote outer panel starts its nested question on the first page, its own record keeps the page", async () => {
    const items = (name: string): Array<any> => [0, 1, 2, 3, 4, 5].map(i => ({ x: name + "-" + i }));
    const source = new FakeServerSource([{ id: 1, a: "A", items: items("A") }, { id: 2, a: "B", items: items("B") },
      { id: 3, a: "C", items: items("C") }], undefined, "id");
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", pageSize: 1,
      templateElements: [{ type: "text", name: "a" },
        { type: "paneldynamic", name: "items", pageSize: 2, templateElements: [{ type: "text", name: "x" }] }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    question.dataSource = source;
    await flush();
    const inner = (): QuestionPanelDynamicModel => <QuestionPanelDynamicModel>question.panels[0].getQuestionByName("items");
    const shownInner = (): any => ({ page: inner().pageIndex, shown: inner().panels.map(panel => panel.getQuestionByName("x").value) });
    inner().pageIndex = 2;
    question.pageIndex = 1;
    await flush();
    expect(shownInner(), "#1: record B").toEqual({ page: 0, shown: ["B-0", "B-1"] });
    question.pageIndex = 0;
    await flush();
    expect(shownInner(), "#2: back on record A").toEqual({ page: 2, shown: ["A-4", "A-5"] });
  });
});

describe("Remote data source: two questions share one source object", () => {
  const createShared = async (): Promise<{ m1: QuestionMatrixDynamicModel, m2: QuestionMatrixDynamicModel, source: FakeServerSource }> => {
    const source = keyedSource(3);
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", rowCount: 0, pageSize: 5, columns: [{ name: "col1" }] },
      { type: "matrixdynamic", name: "m2", rowCount: 0, pageSize: 5, columns: [{ name: "col1" }] }] });
    const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    m1.dataSource = source;
    m2.dataSource = source;
    await flush();
    return { m1: m1, m2: m2, source: source };
  };
  test("each question reads and writes the source", async () => {
    const { m1, m2, source } = await createShared();
    m2.visibleRows[0].getQuestionByName("col1").value = "edited";
    await flush();
    expect(recordWithKey(source, 100).col1, "#1").toBe("edited");
    m1.refreshDataSource();
    await flush();
    expect(rowValues(m1), "#2: the other question reads the write after a refresh").toEqual(["edited", "v101", "v102"]);
  });
  test("a refresh of one question while the other's write is pending reads after the write", async () => {
    const { m1, m2, source } = await createShared();
    source.auto = false;
    m1.removeRowUI(m1.visibleRows[0]);
    m2.refreshDataSource();
    source.callsOf("pagedRead").filter(call => !call.isSettled).forEach(call => call.settle());
    await flush();
    source.callsOf("remove").forEach(call => call.settle());
    await flush();
    while(source.pending.length > 0) {
      source.pending[0].settle();
      await flush();
    }
    expect(rowValues(m2), "#1").toEqual(["v101", "v102"]);
    expect(rowValues(m1), "#2").toEqual(["v101", "v102"]);
  });
  const settleAll = async (source: FakeServerSource): Promise<void> => {
    while(source.pending.length > 0) {
      source.pending[0].settle();
      await flush();
    }
  };
  test("two dynamic panels: a refresh of one while the other's write is pending reads after the write", async () => {
    const source = keyedSource(3);
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p1", panelCount: 0, pageSize: 5, templateElements: [{ type: "text", name: "col1" }] },
      { type: "paneldynamic", name: "p2", panelCount: 0, pageSize: 5, templateElements: [{ type: "text", name: "col1" }] }] });
    const p1 = <QuestionPanelDynamicModel>survey.getQuestionByName("p1");
    const p2 = <QuestionPanelDynamicModel>survey.getQuestionByName("p2");
    p1.dataSource = source;
    p2.dataSource = source;
    await flush();
    source.auto = false;
    p1.removePanelUI(p1.panels[0]);
    p2.refreshDataSource();
    source.callsOf("pagedRead").filter(call => !call.isSettled).forEach(call => call.settle());
    await flush();
    source.callsOf("remove").forEach(call => call.settle());
    await flush();
    await settleAll(source);
    expect(panelValues(p2), "#1").toEqual(["v101", "v102"]);
    expect(panelValues(p1), "#2").toEqual(["v101", "v102"]);
  });
  test("a matrix and a dynamic panel: a refresh of the panel while the matrix's write is pending reads after the write", async () => {
    const source = keyedSource(3);
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 5, columns: [{ name: "col1" }] },
      { type: "paneldynamic", name: "p", panelCount: 0, pageSize: 5, templateElements: [{ type: "text", name: "col1" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    matrix.dataSource = source;
    panel.dataSource = source;
    await flush();
    source.auto = false;
    matrix.removeRowUI(matrix.visibleRows[0]);
    panel.refreshDataSource();
    source.callsOf("pagedRead").filter(call => !call.isSettled).forEach(call => call.settle());
    await flush();
    source.callsOf("remove").forEach(call => call.settle());
    await flush();
    await settleAll(source);
    expect(panelValues(panel), "#1").toEqual(["v101", "v102"]);
    expect(rowValues(matrix), "#2").toEqual(["v101", "v102"]);
  });
  test("two surveys: a refresh in one does not wait for the other survey's write, and both settle", async () => {
    const source = keyedSource(3);
    const createMatrixOnSource = async (): Promise<QuestionMatrixDynamicModel> => {
      const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 5, columns: [{ name: "col1" }] }] });
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      matrix.dataSource = source;
      await flush();
      return matrix;
    };
    const m1 = await createMatrixOnSource();
    const m2 = await createMatrixOnSource();
    source.auto = false;
    m1.removeRowUI(m1.visibleRows[0]);
    m2.refreshDataSource();
    const reads = source.callsOf("pagedRead").filter(call => !call.isSettled);
    expect(reads.length, "#1: the read is sent while the other survey's write is pending").toBe(1);
    reads.forEach(call => call.settle());
    await flush();
    expect(rowValues(m2), "#2: it reads the records before the write").toEqual(["v100", "v101", "v102"]);
    source.callsOf("remove").forEach(call => call.settle());
    await flush();
    await settleAll(source);
    expect(rowValues(m1), "#3").toEqual(["v101", "v102"]);
    expect(m1.isDataLoading, "#4").toBe(false);
    expect(m2.isDataLoading, "#5").toBe(false);
    m2.refreshDataSource();
    await settleAll(source);
    expect(rowValues(m2), "#6: the next read shows the write").toEqual(["v101", "v102"]);
  });
  // The source answers its read with the array it stores and splices that array on a remove.
  const createSplicingSource = (isAsync: boolean): { items: Array<any>, calls: Array<any>, source: any } => {
    const items: Array<any> = [{ id: 1, a: "one" }, { id: 2, a: "two" }, { id: 3, a: "three" }];
    const calls: Array<any> = [];
    const indexOfKey = (key: any): number => items.findIndex(item => item.id === key);
    const source: any = {
      keyField: "id",
      read: () => isAsync ? Promise.resolve(items) : items,
      update: (key: any, record: any, fields: Array<string>) => {
        calls.push(["update", key]);
        const index = indexOfKey(key);
        if (index > -1) fields.forEach(field => { items[index][field] = record[field]; });
      },
      remove: (key: any) => {
        calls.push(["remove", key]);
        const index = indexOfKey(key);
        if (index > -1) items.splice(index, 1);
      }
    };
    return { items: items, calls: calls, source: source };
  };
  const checkSplicedSourceKeepsRowsOnTheirRecords = async (isAsync: boolean): Promise<void> => {
    const { items, calls, source } = createSplicingSource(isAsync);
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "A", columns: [{ name: "a", cellType: "text" }] },
      { type: "matrixdynamic", name: "B", columns: [{ name: "a", cellType: "text" }] }] });
    const matrixA = <QuestionMatrixDynamicModel>survey.getQuestionByName("A");
    const matrixB = <QuestionMatrixDynamicModel>survey.getQuestionByName("B");
    matrixA.dataSource = source;
    matrixB.dataSource = source;
    await flush();
    expect(rowValues(matrixB, "a"), "#1").toEqual(["one", "two", "three"]);
    matrixA.removeRow(0);
    await flush();
    expect(rowValues(matrixB, "a"), "#2: the other question keeps the records it read").toEqual(["one", "two", "three"]);
    matrixB.visibleRows[1].getQuestionByName("a").value = "edited";
    await flush();
    expect(calls.filter(call => call[0] === "update"), "#3: the edit goes to the record the row shows").toEqual([["update", 2]]);
    expect(items.map(item => item.a), "#4: record 3 is not overwritten").toEqual(["edited", "three"]);
  };
  test("a source that splices the array it answered with: the other question's rows stay on their records", async () => {
    await checkSplicedSourceKeepsRowsOnTheirRecords(false);
  });
  test("an asynchronous source that splices the array it answered with: the other question's rows stay on their records", async () => {
    await checkSplicedSourceKeepsRowsOnTheirRecords(true);
  });
  test("an application that changes the array a source answered with does not move the rows", () => {
    const { items, calls, source } = createSplicingSource(false);
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "A", columns: [{ name: "a", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("A");
    matrix.dataSource = source;
    expect(rowValues(matrix, "a"), "#1").toEqual(["one", "two", "three"]);
    items.splice(0, 1);
    expect(rowValues(matrix, "a"), "#2: the rows show the records of the read").toEqual(["one", "two", "three"]);
    matrix.visibleRows[1].getQuestionByName("a").value = "edited";
    expect(calls, "#3: the edit goes to the record the row shows").toEqual([["update", 2]]);
    expect(items.map(item => item.a), "#4").toEqual(["edited", "three"]);
  });
});

describe("Remote data source: a throwing error handler", () => {
  test("a synchronous failed write: the exception reaches the caller, and the cell and question.value agree", () => {
    const records = [{ id: 1, a: "r0" }];
    const source: any = { keyField: "id", read: (): Array<any> => records.map(r => Object.assign({}, r)),
      update: (): void => { throw new Error("server down"); } };
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }] });
    survey.onDynamicDataError.add(() => { throw new Error("handler"); });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    question.dataSource = source;
    let thrown: any = undefined;
    try {
      question.visibleRows[0].getQuestionByColumnName("a").value = "edited";
    } catch(e) {
      thrown = e;
    }
    expect(!!thrown ? thrown.message : undefined, "#1").toBe("handler");
    expect(question.visibleRows[0].getValue("a"), "#2: the cell").toBe("edited");
    expect(question.value[0].a, "#3: question.value").toBe("edited");
  });
  test("an asynchronous failure: later writes still go out, and the exception is a rejection of that answer's continuation", async () => {
    const listeners = process.listeners("unhandledRejection");
    process.removeAllListeners("unhandledRejection");
    const unhandled: Array<any> = [];
    const onRejection = (reason: any): void => { unhandled.push(reason); };
    process.on("unhandledRejection", onRejection);
    try {
      const source = keyedSource(2);
      const { survey, question } = await createMatrix(source, { pageSize: 0 });
      survey.onDynamicDataError.add(() => { throw new Error("handler"); });
      source.auto = false;
      question.visibleRows[0].getQuestionByName("col1").value = "e0";
      question.visibleRows[1].getQuestionByName("col1").value = "e1";
      source.callsOf("update")[0].fail(new Error("down"));
      await flush();
      source.auto = true;
      source.settleAll();
      await flush();
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      await flush();
      expect(recordWithKey(source, 101).col1, "#1: the later write went out").toBe("e1");
      expect(rowValues(question), "#2: the window has both edits").toEqual(["e0", "e1"]);
      expect(unhandled.map((e: any) => e.message), "#3").toEqual(["handler"]);
    } finally {
      process.removeListener("unhandledRejection", onRejection);
      listeners.forEach((listener: any) => process.on("unhandledRejection", listener));
    }
  });
});

describe("Remote data source: the source owns the record count", () => {
  const source = (): FakeServerSource => new FakeServerSource(serverRecords(3), ["insert", "update", "remove", "move"]);
  test("panel: before its first render panelCount reports the source's count, and toJSON leaves it out", async () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", panelCount: 1, templateElements: [{ type: "text", name: "col1" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.dataSource = source();
    await flush();
    expect(question.panelCount, "#1").toBe(3);
    expect(question.toJSON().panelCount, "#2").toBe(undefined);
  });
  test("matrix: rowCount reports the source's count, and toJSON leaves it out", async () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 1, columns: [{ name: "col1" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.dataSource = source();
    await flush();
    expect(question.rowCount, "#1").toBe(3);
    expect(question.toJSON().rowCount, "#2").toBe(undefined);
  });
});

/* While a data source is assigned, the source owns the number of records: rowCount and panelCount read
   its count, a write from code changes nothing and is reported under "count", the silent writes (the
   limits, the count expression, a binding, a JSON load) change nothing either, and the survey JSON
   leaves the count out. The authored count stays in the count property, and a detach shows it again.
   Each case runs for both types, over an assigned in-memory source and over a keyed source whose read
   is held until the test settles it. */
describe("Remote data source: the record count is read-only", () => {
  const countNameOf = (kind: string): string => kind === "matrix" ? "rowCount" : "panelCount";
  const COUNT_REASON = "The data source owns the record count; add or remove records instead";
  interface ICountCase {
    survey: SurveyModel;
    question: any;
    source: IDynamicDataSource;
    server: FakeServerSource;
    countName: string;
    // "operation: message" for every onDynamicDataError.
    errors: Array<string>;
    count: () => number;
    setCount: (val: number) => void;
    // The rows or the panels.
    objects: () => number;
    sourceRecords: () => Array<any>;
    // The writes the source was sent.
    sent: () => number;
    attach: () => Promise<void>;
  }
  function createCountCase(kind: string, sourceKind: string, json?: any, extra?: Array<any>, isDesignMode: boolean = false): ICountCase {
    const survey = new SurveyModel();
    if (isDesignMode) survey.setDesignMode(true);
    const element = kind === "matrix" ?
      { type: "matrixdynamic", name: "q", rowCount: 7, columns: [{ name: "id" }, { name: "col1" }] } :
      { type: "paneldynamic", name: "q", panelCount: 7, templateElements: [{ type: "text", name: "id" }, { type: "text", name: "col1" }] };
    survey.fromJSON({ elements: [Object.assign(element, json)].concat(extra || []) });
    const question: any = survey.getQuestionByName("q");
    const countName = countNameOf(kind);
    let arr: Array<any> = [{ id: 1, col1: "a" }, { id: 2, col1: "b" }, { id: 3, col1: "c" }];
    let arrWrites = 0;
    const server = keyedSource(3, ["insert", "update", "remove"]);
    const source: IDynamicDataSource = sourceKind === "array" ?
      new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; arrWrites++; }) : server;
    const res: ICountCase = {
      survey: survey, question: question, source: source, server: server, countName: countName, errors: [],
      count: (): number => question[countName],
      setCount: (val: number): void => { question[countName] = val; },
      objects: (): number => kind === "matrix" ? question.visibleRows.length : question.panels.length,
      sourceRecords: (): Array<any> => sourceKind === "array" ? arr : server.records,
      sent: (): number => sourceKind === "array" ? arrWrites : server.calls.filter((call: IServerCall): boolean => call.op !== "read").length,
      attach: async (): Promise<void> => {
        question.dataSource = source;
        await flush();
      }
    };
    survey.onDynamicDataError.add((sender: SurveyModel, options: any): void => {
      res.errors.push(options.operation + ": " + options.error.message);
    });
    return res;
  }
  const refused = (times: number): Array<string> => {
    const res: Array<string> = [];
    for (let i = 0; i < times; i++) res.push("count: " + COUNT_REASON);
    return res;
  };
  ["matrix", "panel"].forEach((kind: string): void => {
    ["array", "keyed"].forEach((sourceKind: string): void => {
      test(kind + ", " + sourceKind + " source: the setter from code changes nothing and reports each refused write once", async () => {
        const c = createCountCase(kind, sourceKind);
        await c.attach();
        let valueChanged = 0;
        c.survey.onValueChanged.add((): void => { valueChanged++; });
        const value = JSON.stringify(c.question.value);
        const records = JSON.stringify(c.sourceRecords());
        const check = (label: string, errors: number): void => {
          expect(c.count(), label + ": the count").toBe(3);
          expect(c.objects(), label + ": the objects").toBe(3);
          expect(JSON.stringify(c.sourceRecords()), label + ": the source").toBe(records);
          expect(JSON.stringify(c.question.value), label + ": the value").toBe(value);
          expect(c.sent(), label + ": nothing is sent").toBe(0);
          expect(c.errors, label + ": the refusals").toEqual(refused(errors));
        };
        check("#1", 0);
        c.setCount(5);
        check("#2: larger", 1);
        c.setCount(1);
        check("#3: smaller", 2);
        c.setCount(3);
        check("#4: the current count is no refusal", 2);
        expect(valueChanged, "#5: onValueChanged").toBe(0);
      });
      test(kind + ", " + sourceKind + " source: the limits, the count expression, a binding and a JSON load change the count silently", async () => {
        const min = kind === "matrix" ? "minRowCount" : "minPanelCount";
        const max = kind === "matrix" ? "maxRowCount" : "maxPanelCount";
        const c = createCountCase(kind, sourceKind, { bindings: { [countNameOf(kind)]: "n" } }, [{ type: "text", name: "n" }, { type: "text", name: "e" }]);
        await c.attach();
        const check = (label: string): void => {
          expect(c.count(), label + ": the count").toBe(3);
          expect(c.objects(), label + ": the objects").toBe(3);
          expect(c.sent(), label + ": nothing is sent").toBe(0);
          expect(c.errors, label + ": nothing is reported").toEqual([]);
        };
        c.question[min] = 5;
        check("#1: the minimum above the count");
        c.question[min] = 0;
        c.question[max] = 2;
        check("#2: the maximum below the count");
        c.question[max] = 10;
        c.question[c.countName + "Expression"] = "{e}";
        c.survey.setValue("e", 6);
        check("#3: the count expression");
        c.survey.setValue("n", 5);
        check("#4: a binding");
        c.question.fromJSON({ [c.countName]: 4 });
        check("#5: a JSON load");
      });
      test(kind + ", " + sourceKind + " source: design mode reads the source's count and refuses a write", async () => {
        const c = createCountCase(kind, sourceKind, undefined, undefined, true);
        const panels = kind === "panel" ? [].concat(c.question.panels) : undefined;
        await c.attach();
        expect(c.count(), "#1").toBe(3);
        c.setCount(5);
        expect(c.count(), "#2: unchanged").toBe(3);
        expect(c.sent(), "#3: nothing is sent").toBe(0);
        expect(c.errors, "#4").toEqual(refused(1));
        if (kind === "panel") {
          expect(c.question.panels.length, "#5: the design surface").toBe(panels.length);
          expect(c.question.panels.every((panel: any, index: number): boolean => panel === panels[index]), "#6: the same panels").toBe(true);
          expect(c.question.panels[0] === c.question.template, "#7: the template").toBe(true);
        }
      });
      test(kind + ", " + sourceKind + " source: the survey JSON leaves the count out, and the detach shows the authored count", async () => {
        const c = createCountCase(kind, sourceKind);
        expect(c.question.toJSON()[c.countName], "#1: without a source").toBe(7);
        await c.attach();
        expect(c.count(), "#2: the source's count").toBe(3);
        expect(c.question.toJSON()[c.countName], "#3: left out").toBe(undefined);
        c.question.dataSource = undefined;
        await flush();
        expect(c.count(), "#4: the authored count").toBe(7);
        expect(c.objects(), "#5").toBe(7);
        expect(c.question.toJSON()[c.countName], "#6").toBe(7);
      });
      test(kind + ", " + sourceKind + " source: a binding or a JSON load while the source is assigned is shown after the detach", async () => {
        const c = createCountCase(kind, sourceKind, { bindings: { [countNameOf(kind)]: "n" } }, [{ type: "text", name: "n" }]);
        await c.attach();
        c.survey.setValue("n", 5);
        expect(c.question.toJSON()[c.countName], "#1: a binding, left out").toBe(undefined);
        c.question.dataSource = undefined;
        await flush();
        expect(c.count(), "#2: the bound count").toBe(5);
        expect(c.objects(), "#3").toBe(5);
        c.question.dataSource = createCountCase(kind, sourceKind).source;
        await flush();
        c.question.fromJSON({ [c.countName]: 4 });
        expect(c.count(), "#4: the source's count").toBe(3);
        expect(c.question.toJSON()[c.countName], "#5: a JSON load, left out").toBe(undefined);
        c.question.dataSource = undefined;
        await flush();
        expect(c.count(), "#6: the loaded count").toBe(4);
        expect(c.objects(), "#7").toBe(4);
      });
      test(kind + ", " + sourceKind + " source: a detach with an answer in the survey shows its records", async () => {
        const c = createCountCase(kind, sourceKind);
        await c.attach();
        c.survey.setValue("q", [{ col1: "x" }, { col1: "y" }]);
        expect(c.count(), "#1: the hash does not reach the question").toBe(3);
        c.question.dataSource = undefined;
        await flush();
        expect(c.count(), "#2").toBe(2);
        expect(c.objects(), "#3").toBe(2);
      });
      test(kind + ", " + sourceKind + " source: an add and a remove go to the source and leave the authored count alone", async () => {
        const c = createCountCase(kind, sourceKind);
        await c.attach();
        if (kind === "matrix") {
          c.question.addRow();
        } else {
          c.question.addPanel();
        }
        await flush();
        expect(c.sourceRecords().length, "#1: the source holds the new record").toBe(4);
        expect(c.count(), "#2").toBe(4);
        expect(c.question.toJSON()[c.countName], "#3: left out").toBe(undefined);
        if (kind === "matrix") {
          c.question.removeRow(0);
        } else {
          c.question.removePanel(0);
        }
        await flush();
        expect(c.sourceRecords().length, "#4: the source lost one").toBe(3);
        expect(c.count(), "#5").toBe(3);
        expect(c.question.toJSON()[c.countName], "#6: left out").toBe(undefined);
        expect(c.errors, "#7: nothing is refused").toEqual([]);
        c.question.dataSource = undefined;
        await flush();
        expect(c.count(), "#8: the authored count").toBe(7);
        expect(c.objects(), "#9").toBe(7);
        expect(c.question.toJSON()[c.countName], "#10").toBe(7);
      });
    });
    test(kind + ": while the first read is pending the count is 0, a write is refused, and the read brings the count", async () => {
      const c = createCountCase(kind, "keyed");
      c.server.auto = false;
      await c.attach();
      expect(c.server.pending.length, "#1: the read is held").toBe(1);
      expect(c.count(), "#2").toBe(0);
      c.setCount(5);
      expect(c.count(), "#3: unchanged").toBe(0);
      expect(c.errors, "#4").toEqual(refused(1));
      c.server.settleAll();
      await flush();
      expect(c.count(), "#5: the read committed").toBe(3);
      expect(c.objects(), "#6").toBe(3);
      expect(c.sent(), "#7: nothing is sent").toBe(0);
    });
    /* The minimum changed while the source owned the count: the authored count is shown as it was
       authored, below the new minimum. */
    test(kind + ": a detach after the minimum was raised above the authored count shows the authored count", async () => {
      const c = createCountCase(kind, "array");
      await c.attach();
      c.question[kind === "matrix" ? "minRowCount" : "minPanelCount"] = 9;
      c.question.dataSource = undefined;
      await flush();
      expect(c.count(), "#1").toBe(7);
      expect(c.objects(), "#2").toBe(7);
    });
  });
  test("matrix: the rendered table follows the source's count after a read that changes it", async () => {
    let arr: Array<any> = [{ col1: "a" }, { col1: "b" }, { col1: "c" }];
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 7, columns: [{ name: "col1" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    await flush();
    const dataRows = (): number => question.renderedTable.rows.filter((row: any): boolean => !!row.row).length;
    expect(dataRows(), "#1").toBe(3);
    arr = arr.concat([{ col1: "d" }]);
    await question.refreshDataSource();
    await flush();
    expect(question.rowCount, "#2").toBe(4);
    expect(dataRows(), "#3: the table was rebuilt").toBe(4);
  });
  test("panel: panelCountChangedCallback fires after a read that changes the count", async () => {
    let arr: Array<any> = [{ col1: "a" }, { col1: "b" }, { col1: "c" }];
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelCount: 7, templateElements: [{ type: "text", name: "col1" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    await flush();
    let fired = 0;
    question.panelCountChangedCallback = (): void => { fired++; };
    arr = arr.concat([{ col1: "d" }]);
    await question.refreshDataSource();
    await flush();
    expect(question.panelCount, "#1").toBe(4);
    expect(question.panels.length, "#2").toBe(4);
    expect(fired > 0, "#3: the renderer is told").toBe(true);
  });
});

/* Without a source the count serializes as it always has: through the accessor, which the panel's
   property lags behind once its panels are built. */
describe("the record count without a data source serializes the accessor", () => {
  test("panel: a set count, an add and a remove", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelCount: 2, templateElements: [{ type: "text", name: "col1" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.onFirstRendering();
    question.panelCount = 7;
    expect(question.toJSON().panelCount, "#1").toBe(7);
    question.addPanel();
    expect(question.toJSON().panelCount, "#2").toBe(8);
    question.removePanel(0);
    expect(question.toJSON().panelCount, "#3").toBe(7);
  });
  test("matrix: a set count and an add", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 2, columns: [{ name: "col1" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    question.rowCount = 7;
    question.addRow();
    expect(question.toJSON().rowCount, "#1").toBe(8);
  });
});

describe("Remote data source: a source without insert shows the read-only empty text", () => {
  test("panel: assigning the source refreshes the no-entries text", async () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, templateElements: [{ type: "text", name: "col1" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const editable = question.noEntriesText;
    question.dataSource = new FakeServerSource([], ["update"]);
    await flush();
    expect(question.noEntriesText, "#1: the read-only text").not.toBe(editable);
    expect(question.noEntriesText, "#2").toBe(question.getLocalizationString("noEntriesReadonlyText"));
  });
});

describe("a data source and the record count limits", () => {
  function createSourceMatrix(json: any, records: Array<any>): { question: QuestionMatrixDynamicModel, getArray: () => Array<any> } {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m",
      columns: [{ name: "id", cellType: "text" }, { name: "b", cellType: "text", defaultValue: 5 }] }, json)] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    let arr = records;
    question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    return { question: question, getArray: () => arr };
  }
  function createSourcePanel(json: any, records: Array<any>): { question: QuestionPanelDynamicModel, getArray: () => Array<any> } {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p",
      templateElements: [{ type: "text", name: "id" }] }, json)] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    let arr = records;
    question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { arr = a; });
    return { question: question, getArray: () => arr };
  }
  test("with a data source minRowCount never pads the value when the rows are built", () => {
    const { question, getArray } = createSourceMatrix({ minRowCount: 3 }, [{ id: 1 }]);
    question.visibleRows;
    expect(question.value.length, "#1: one record").toBe(1);
    expect(getArray().length, "#2: the source keeps one record").toBe(1);
    question.minRowCount = 4;
    expect(question.value.length, "#3: a later minRowCount does not pad either").toBe(1);
  });
  test("with a data source maxRowCount and minRowCount gate the add and remove buttons", () => {
    const { question, getArray } = createSourceMatrix({ minRowCount: 1, maxRowCount: 2 }, [{ id: 1 }, { id: 2 }]);
    question.visibleRows;
    expect(question.canAddRow, "#1: at maxRowCount").toBe(false);
    question.addRow();
    expect(getArray().length, "#2: addRow is refused").toBe(2);
    question.removeRow(0);
    expect(getArray().length, "#3: above minRowCount a row is removed").toBe(1);
    expect(question.canRemoveRows, "#4: at minRowCount").toBe(false);
    question.removeRow(0);
    expect(getArray().length, "#5: removeRow is refused").toBe(1);
    expect(question.canAddRow, "#6: below maxRowCount").toBe(true);
  });
  test("with a data source maxPanelCount and minPanelCount gate the add and remove buttons", () => {
    const { question, getArray } = createSourcePanel({ minPanelCount: 1, maxPanelCount: 2 }, [{ id: 1 }, { id: 2 }]);
    question.panels;
    expect(question.canAddPanel, "#1: at maxPanelCount").toBe(false);
    question.addPanelUI();
    expect(getArray().length, "#2: addPanelUI is refused").toBe(2);
    question.removePanelUI(question.panels[0]);
    expect(getArray().length, "#3: above minPanelCount a panel is removed").toBe(1);
    expect(question.canRemovePanel, "#4: at minPanelCount").toBe(false);
    question.removePanelUI(question.panels[0]);
    expect(getArray().length, "#5: removePanelUI is refused").toBe(1);
  });
  test("with a data source the record count above maxRowCount is shown", () => {
    const { question, getArray } = createSourceMatrix({ maxRowCount: 2 }, [{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(question.visibleRows.length, "#1").toBe(3);
    expect(question.rowCount, "#2").toBe(3);
    expect(getArray().length, "#3: nothing is truncated").toBe(3);
    expect(question.canAddRow, "#4").toBe(false);
  });
  test("with a data source the record count below minPanelCount is shown", () => {
    const { question, getArray } = createSourcePanel({ minPanelCount: 3 }, [{ id: 1 }]);
    expect(question.panels.length, "#1").toBe(1);
    expect(getArray().length, "#2: nothing is padded").toBe(1);
  });
  test("addRowByIndex is not limited by maxRowCount, as without a data source", () => {
    const { question, getArray } = createSourceMatrix({ maxRowCount: 2 }, [{ id: 1 }, { id: 2 }]);
    question.visibleRows;
    question.addRowByIndex({ id: 3 }, 0);
    expect(getArray().length, "#1").toBe(3);
  });
  test("removeRowByIndex is not limited by minRowCount, as without a data source", () => {
    const { question, getArray } = createSourceMatrix({ minRowCount: 2 }, [{ id: 1 }, { id: 2 }]);
    question.visibleRows;
    question.removeRowByIndex(0);
    expect(getArray().length, "#1").toBe(1);
  });
  test("addPanel with an index is not limited by maxPanelCount, as without a data source", () => {
    const { question, getArray } = createSourcePanel({ maxPanelCount: 2 }, [{ id: 1 }, { id: 2 }]);
    question.panels;
    question.addPanel(0);
    expect(getArray().length, "#1").toBe(3);
  });
  test("removePanel with an index is not limited by minPanelCount, as without a data source", () => {
    const { question, getArray } = createSourcePanel({ minPanelCount: 2 }, [{ id: 1 }, { id: 2 }]);
    question.panels;
    question.removePanel(0);
    expect(getArray().length, "#1").toBe(1);
  });
});

describe("one in-memory source assigned to two questions", () => {
  async function createTwo(): Promise<{ survey: SurveyModel, matrix: QuestionMatrixDynamicModel, panel: QuestionPanelDynamicModel,
    source: ArrayDynamicDataSource, errors: Array<string>, }> {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "name", cellType: "text" }, { name: "qty", cellType: "text" }] },
      { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "name" }, { type: "text", name: "qty" }] }] });
    const source = ArrayDynamicDataSource.fromArray([{ name: "A", qty: 1 }, { name: "B", qty: 2 }, { name: "C", qty: 3 }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.question.name + ":" + options.operation + ":" + options.error.message); });
    matrix.dataSource = source;
    await flush();
    return { survey: survey, matrix: matrix, panel: panel, source: source, errors: errors };
  }
  const hasRemoveButtons = (matrix: QuestionMatrixDynamicModel): boolean => matrix.renderedTable.rows.some(row =>
    row.cells.some(cell => cell.isActionsCell && (cell.item.value.actions || []).some(action => action.id === "remove-row")));
  test("the question assigned the source last writes it; the earlier one becomes read-only, and its add and remove buttons update", async () => {
    const { matrix, panel, source, errors } = await createTwo();
    expect(matrix.canAddRow, "#1: the matrix writes").toBe(true);
    expect(hasRemoveButtons(matrix), "#2").toBe(true);
    panel.dataSource = source;
    await flush();
    expect(matrix.canAddRow, "#3: no add button").toBe(false);
    expect(matrix.canRemoveRows, "#4: no remove button").toBe(false);
    expect(hasRemoveButtons(matrix), "#5: the table dropped its remove buttons").toBe(false);
    expect(panel.canAddPanel, "#6: the panel writes").toBe(true);
    panel.removePanel(0);
    await flush();
    expect(source.array, "#7").toEqual([{ name: "B", qty: 2 }, { name: "C", qty: 3 }]);
    matrix.visibleRows[1].getQuestionByName("qty").value = 20;
    await flush();
    expect(source.array, "#8: nothing is written").toEqual([{ name: "B", qty: 2 }, { name: "C", qty: 3 }]);
    expect(errors.length, "#9: one report").toBe(1);
    expect(errors[0].indexOf("m:update:The data source is written by position by another question"), "#10: " + errors[0]).toBe(0);
  });
  test("the earlier question shows the writer's writes after refreshDataSource", async () => {
    const { matrix, panel, source } = await createTwo();
    panel.dataSource = source;
    await flush();
    panel.panels[1].getQuestionByName("qty").value = 20;
    panel.removePanel(0);
    await flush();
    matrix.refreshDataSource();
    await flush();
    expect(matrix.visibleRows.map(row => row.getQuestionByName("qty").value), "#1").toEqual([20, 3]);
  });
  test("a writer that leaves the source keeps the other question read-only until the source is assigned to it again", async () => {
    const { matrix, panel, source, errors } = await createTwo();
    panel.dataSource = source;
    await flush();
    panel.dataSource = undefined;
    expect(matrix.canAddRow, "#1: still read-only").toBe(false);
    matrix.dataSource = source;
    await flush();
    expect(matrix.canAddRow, "#2: assigned again, it writes").toBe(true);
    matrix.visibleRows[1].getQuestionByName("qty").value = 20;
    await flush();
    expect(source.array[1], "#3").toEqual({ name: "B", qty: 20 });
    expect(errors, "#4").toEqual([]);
  });
  test("a survey re-created without dispose writes the source it is given", async () => {
    const source = ArrayDynamicDataSource.fromArray([{ qty: 1 }, { qty: 2 }]);
    const create = (): QuestionMatrixDynamicModel => {
      const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "qty", cellType: "text" }] }] });
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      matrix.dataSource = source;
      return matrix;
    };
    const first = create();
    await flush();
    const second = create();
    await flush();
    second.visibleRows[0].getQuestionByName("qty").value = 10;
    await flush();
    expect(source.array, "#1").toEqual([{ qty: 10 }, { qty: 2 }]);
    expect(first.canAddRow, "#2: the earlier survey only reads").toBe(false);
    expect(second.canAddRow, "#3").toBe(true);
  });
  test("a nested matrix copied by each panel: the copy assigned last writes", async () => {
    const source = ArrayDynamicDataSource.fromArray([{ qty: 1 }, { qty: 2 }]);
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 2, templateElements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "qty", cellType: "text" }] }] }] });
    const panels = (<QuestionPanelDynamicModel>survey.getQuestionByName("p")).panels;
    const copies = panels.map(item => <QuestionMatrixDynamicModel>item.getQuestionByName("m"));
    copies.forEach(copy => { copy.dataSource = source; });
    await flush();
    expect(copies.map(copy => copy.canAddRow), "#1").toEqual([false, true]);
    copies[1].visibleRows[1].getQuestionByName("qty").value = 20;
    await flush();
    expect(source.array, "#2").toEqual([{ qty: 1 }, { qty: 20 }]);
  });
  test("the source holds only its current writer: not an earlier one, not one that left or was disposed", async () => {
    const { matrix, panel, source } = await createTwo();
    const matrixList = matrix["dataList"];
    const panelList = panel["dataList"];
    expect(source["positionWriter"], "#1: the matrix writes").toBe(matrixList);
    panel.dataSource = source;
    await flush();
    expect(source["positionWriter"], "#2: the panel took its place").toBe(panelList);
    expect(source["positionWriterChanged"], "#3: the panel's callback, not the matrix's").toBe(panelList["onWriterChanged"]);
    panel.dataSource = undefined;
    expect(source["positionWriter"], "#4: the panel left").toBeUndefined();
    expect(source["positionWriterChanged"], "#5").toBeUndefined();
    expect(matrix.canAddRow, "#6: the matrix still only reads").toBe(false);
    matrix.dataSource = source;
    await flush();
    expect(source["positionWriter"], "#7: assigned again, the matrix writes").toBe(matrixList);
    matrix.dispose();
    expect(source["positionWriter"], "#8: the disposed matrix is not referenced").toBeUndefined();
    expect(source["positionWriterChanged"], "#9").toBeUndefined();
  });
});

describe("a data source owns the record count", () => {
  test("the count of both types equals the records shown on every transition of an asynchronous source", async () => {
    const kinds: Array<any> = [
      { name: "matrix", json: { type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "col1" }] },
        count: (q: any): number => q.rowCount, shown: (q: any): number => q.visibleRows.length,
        add: (q: any): void => q.addRow(), remove: (q: any): void => q.removeRow(0) },
      { name: "panel", json: { type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "col1" }] },
        count: (q: any): number => q.panelCount, shown: (q: any): number => q.panels.length,
        add: (q: any): void => { q.addPanel(); }, remove: (q: any): void => q.removePanel(0) }
    ];
    for (const kind of kinds) {
      const survey = new SurveyModel({ elements: [kind.json] });
      const question: any = survey.getQuestionByName("q");
      const source = new FakeServerSource(serverRecords(3), ["insert", "update", "remove", "move"], "id");
      source.auto = false;
      question.dataSource = source;
      const check = (label: string): void => {
        expect(kind.count(question), kind.name + " " + label).toBe(kind.shown(question));
      };
      check("#1: attached, the first read pending");
      source.settleAll();
      await flush();
      check("#2: after the first read");
      expect(kind.count(question), kind.name + " #2b").toBe(3);
      kind.add(question);
      check("#3: right after the add, before the source answers");
      source.settleAll();
      await flush();
      check("#4: after the insert answered");
      kind.remove(question);
      check("#5: right after the remove, before the source answers");
      source.settleAll();
      await flush();
      check("#6: after the remove answered");
      kind.add(question);
      source.pending[0].fail(new Error("refused"));
      await flush();
      check("#7: after a rejected insert");
      kind.remove(question);
      source.pending[0].fail(new Error("refused"));
      await flush();
      check("#8: after a rejected remove");
    }
  });
  test("with a data source the row count and the panel count follow the source's count after a read and after an add", async () => {
    const matrixSource = new FakeServerSource(serverRecords(3));
    const { question: matrix } = await createMatrix(matrixSource, { pageSize: 0 });
    expect(matrix.rowCount, "#1: after the read").toBe(3);
    matrix.addRow();
    expect(matrix.rowCount, "#2: right after the add").toBe(4);
    await flush();
    expect(matrix.rowCount, "#3: after the insert answered").toBe(4);
    matrix.removeRow(0);
    await flush();
    expect(matrix.rowCount, "#4: after a remove").toBe(3);
    const panelSource = new FakeServerSource(serverRecords(3));
    const { question: panel } = await createPanel(panelSource, { pageSize: 0 });
    expect(panel.panelCount, "#5: after the read").toBe(3);
    panel.addPanel();
    expect(panel.panelCount, "#6: right after the add").toBe(4);
    await flush();
    expect(panel.panelCount, "#7: after the insert answered").toBe(4);
  });
});

describe("the page of a nested paged question follows its record through a re-read", () => {
  test("a nested paged question in a detail panel keeps its page after a re-read that moves its record", async () => {
    const records = [0, 1, 2].map((i: number): any => ({ id: i, col1: "r" + i, inner: [{ a: 1 }, { a: 2 }, { a: 3 }] }));
    const source = new FakeServerSource(records, ["insert", "update", "remove", "move"]);
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, pageSize: 5, detailPanelMode: "underRow",
      columns: [{ name: "col1" }], detailElements: [{ type: "matrixdynamic", name: "inner", rowCount: 0, pageSize: 1, columns: [{ name: "a" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.dataSource = source;
    await flush();
    matrix.visibleRows[1].showDetailPanel();
    const inner = <QuestionMatrixDynamicModel>matrix.visibleRows[1].detailPanel.getQuestionByName("inner");
    inner.visibleRows;
    inner.pageIndex = 2;
    source.moveRecordBehindTheGrid(1, 2);
    matrix.refreshDataSource();
    await flush();
    const row = matrix.visibleRows.filter(r => r.getQuestionByColumnName("col1").value === "r1")[0];
    expect(matrix.visibleRows.indexOf(row), "#1: the record moved").toBe(2);
    row.showDetailPanel();
    expect((<QuestionMatrixDynamicModel>row.detailPanel.getQuestionByName("inner")).pageIndex, "#2").toBe(2);
    const other = matrix.visibleRows[1];
    other.showDetailPanel();
    expect((<QuestionMatrixDynamicModel>other.detailPanel.getQuestionByName("inner")).pageIndex, "#3: the record now at its old place").toBe(0);
  });
});

describe("a negative row number with a data source", () => {
  test("the last record is in the loaded window: removeRowByIndex(-1) removes it and addRowByIndex(data, -1) inserts before it", async () => {
    const source = keyedSource(3);
    const { question } = await createMatrix(source);
    question.removeRowByIndex(-1);
    await flush();
    expect(source.records.map((r: any) => r.id), "#1").toEqual([100, 101]);
    question.addRowByIndex({ col1: "new" }, -1);
    await flush();
    expect(source.records.map((r: any) => r.col1), "#2").toEqual(["v100", "new", "v101"]);
  });
  test("the last record is outside the loaded window: removeRowByIndex(-1) is refused and reported once", async () => {
    const source = keyedSource(20);
    const { survey, question } = await createMatrix(source);
    const errors = new Array<string>();
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    question.removeRowByIndex(-1);
    await flush();
    expect(source.records.length, "#1: nothing changes").toBe(20);
    expect(errors, "#2: one report, as for its positive number").toEqual(["remove"]);
    errors.length = 0;
    question.removeRowByIndex(19);
    await flush();
    expect(errors, "#3: the positive number is reported the same way").toEqual(["remove"]);
  });
  test("a source without a total: a negative number does nothing", async () => {
    const source = keyedSource(20);
    source.reportTotal = false;
    const { survey, question } = await createMatrix(source);
    const errors = new Array<string>();
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    question.removeRowByIndex(-1);
    question.addRowByIndex({ col1: "new" }, -1);
    await flush();
    expect(source.records.length, "#1").toBe(20);
    expect(errors, "#2").toEqual([]);
  });
  test("without a source a negative number counts from the end, as released", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.removeRowByIndex(-1);
    expect(survey.data.m, "#1").toEqual([{ a: 1 }, { a: 2 }]);
    matrix.addRowByIndex({ a: 9 }, -1);
    expect(survey.data.m, "#2").toEqual([{ a: 1 }, { a: 9 }, { a: 2 }]);
  });
});

describe("a record written with no change", () => {
  test("with a source, writing a cell's own value sends no update", async () => {
    const source = keyedSource(3);
    const { question } = await createMatrix(source);
    source.reset();
    question.visibleRows[1].getQuestionByName("col1").value = "v101";
    await flush();
    expect(source.calls.map(call => call.op), "#1").toEqual([]);
  });
});

/* A matrix whose records come from a data source does not reorder its rows: no source is asked to
   move a record, whatever methods it has - a keyed server source that still has a move, and the
   in-memory sources the application assigns. allowRowReorder is ignored while the source is set. */
describe("Remote data source: rows are not reordered while a data source is assigned", () => {
  interface IReorderable { survey: SurveyModel, question: QuestionMatrixDynamicModel, stored: () => Array<any>, sourceWrites: () => number }
  const kinds = ["a keyed server source with a move method", "an assigned ArrayDynamicDataSource", "a SurveyDataDynamicDataSource"];
  async function createReorderable(kind: string): Promise<IReorderable> {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, allowRowReorder: true,
      columns: [{ name: "col1" }, { name: "col2" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let res: IReorderable;
    if (kind === kinds[0]) {
      const source = new FakeServerSource(serverRecords(3), ["insert", "update", "remove", "move"]);
      question.dataSource = source;
      res = { survey: survey, question: question, stored: () => source.records, sourceWrites: () => source.calls.filter((c: IServerCall) => c.op !== "read").length };
    } else if (kind === kinds[1]) {
      let arr: Array<any> = serverRecords(3);
      let writes = 0;
      question.dataSource = new ArrayDynamicDataSource((): Array<any> => arr, (a: Array<any>): void => { writes++; arr = a; });
      res = { survey: survey, question: question, stored: () => arr, sourceWrites: () => writes };
    } else {
      survey.setValue("store", serverRecords(3));
      let writes = 0;
      survey.onValueChanged.add((_, options) => { if (options.name === "store") writes++; });
      question.dataSource = new SurveyDataDynamicDataSource(survey, "store");
      res = { survey: survey, question: question, stored: () => survey.getValue("store"), sourceWrites: () => writes };
    }
    await flush();
    return res;
  }
  const ids = (records: Array<any>): Array<any> => records.map((r: any): any => r.id);
  kinds.forEach((kind: string): void => {
    test(kind + ": allowRowReorder gives no drag", async () => {
      const { question } = await createReorderable(kind);
      expect(question.allowRowReorder, "#1").toBe(true);
      expect(question.isRowsDragAndDrop, "#2").toBe(false);
      expect(question.renderedTable.isRowsDragAndDrop, "#3: the rendered rows have no drag handle").toBe(false);
    });
    test(kind + ": moveRowByIndex changes nothing, sends nothing and is reported once", async () => {
      const { survey, question, stored, sourceWrites } = await createReorderable(kind);
      const errors: Array<string> = [];
      survey.onDynamicDataError.add((_, options) => { errors.push(options.operation + ": " + options.error.message); });
      const changed: Array<string> = [];
      survey.onValueChanged.add((_, options) => { changed.push(options.name); });
      const writesBefore = sourceWrites();
      question.moveRowByIndex(0, 1);
      await flush();
      expect(rowValues(question), "#1: the rows").toEqual(["v0", "v1", "v2"]);
      expect(ids(question.value), "#2: question.value").toEqual([0, 1, 2]);
      expect(ids(stored()), "#3: the storage").toEqual([0, 1, 2]);
      expect(sourceWrites(), "#4: nothing sent").toBe(writesBefore);
      expect(errors, "#5").toEqual(["move: Rows cannot be reordered while a data source is assigned; the move was not made."]);
      expect(changed, "#6: no value change").toEqual([]);
    });
    test(kind + ": a move of the list changes nothing and notifies nothing", async () => {
      const { question, stored, sourceWrites } = await createReorderable(kind);
      const list = question["dataList"];
      const writesBefore = sourceWrites();
      const changes: Array<string> = [];
      const onChanged = list.onChanged;
      list.onChanged = (change: any): void => { changes.push(change.type); onChanged(change); };
      expect(list.hasCapability("move"), "#1").toBe(false);
      list.move(0, 1);
      await flush();
      expect(ids(list.getLoadedRecords()), "#2: the list").toEqual([0, 1, 2]);
      expect(ids(stored()), "#3: the storage").toEqual([0, 1, 2]);
      expect(sourceWrites(), "#4: nothing sent").toBe(writesBefore);
      expect(changes, "#5").toEqual([]);
    });
    test(kind + ": without the data source the rows are reordered again", async () => {
      const { question } = await createReorderable(kind);
      question.dataSource = undefined;
      question.value = [{ col1: "x" }, { col1: "y" }];
      expect(question.isRowsDragAndDrop, "#1").toBe(true);
      question.moveRowByIndex(0, 1);
      expect(question.value, "#2").toEqual([{ col1: "y" }, { col1: "x" }]);
    });
  });
});

describe("Remote data source: the pager while a page is read or a move waits", () => {
  const pagerItemIds = ["sv-pager-first", "sv-pager-prev", "sv-pager-page", "sv-pager-next", "sv-pager-last"];
  const enabledItems = (question: QuestionMatrixDynamicModel): Array<boolean> =>
    pagerItemIds.map(id => question.recordsBar.pagerActions.getActionById(id).enabled);
  const allEnabled = [true, true, true, true, true];
  const noneEnabled = [false, false, false, false, false];
  const asyncColumns = [{ name: "col1", validators: [{ type: "expression", expression: "pagerRemoteAsyncFunc({row.col1}) = 1" }] }, { name: "col2" }];
  let validatorResults: Array<(res: any) => void> = [];
  beforeEach(() => {
    validatorResults = [];
    FunctionFactory.Instance.register("pagerRemoteAsyncFunc", function (this: any) { validatorResults.push(this.returnResult); return false; }, true);
  });
  afterEach(() => {
    FunctionFactory.Instance.unregister("pagerRemoteAsyncFunc");
  });
  const settleValidators = (): void => {
    const results = validatorResults;
    validatorResults = [];
    results.forEach(setResult => setResult(1));
  };
  test("every move item and the dropdown are disabled while a page is read, and enabled after the read", async () => {
    const source = new FakeServerSource(serverRecords(120));
    const { question } = await createMatrix(source, { pageSize: 10 });
    question.pageIndex = 4;
    await flush();
    expect(enabledItems(question), "#1: page 5 of 12").toEqual(allEnabled);
    source.auto = false;
    question.recordsBar.pagerActions.getActionById("sv-pager-next").action();
    expect(question.isDataLoading, "#2: the read is in flight").toBe(true);
    expect(enabledItems(question), "#3").toEqual(noneEnabled);
    source.settleAll();
    await flush();
    expect(question.pageIndex, "#4").toBe(5);
    expect(enabledItems(question), "#5").toEqual(allEnabled);
  });
  test("a pager created while a move waits for a validator still follows a later page read", async () => {
    const source = new FakeServerSource(serverRecords(120));
    const { question } = await createMatrix(source, { pageSize: 10, columns: asyncColumns });
    question.pageIndex = 4;
    await flush();
    expect(question.visibleRows.length, "#0: the page is shown").toBe(10);
    question.nextPage();
    expect(question.isPageMovePending, "#1: the move waits").toBe(true);
    // The first run of every updater sees isPageMovePending true.
    expect(enabledItems(question), "#2").toEqual(noneEnabled);
    settleValidators();
    await flush();
    expect(question.pageIndex, "#3: moved").toBe(5);
    expect(enabledItems(question), "#4").toEqual(allEnabled);
    source.auto = false;
    question.prevPage();
    expect(question.isDataLoading, "#5: a move back reads without validating").toBe(true);
    expect(enabledItems(question), "#6: the read is observed").toEqual(noneEnabled);
    source.settleAll();
    await flush();
    expect(enabledItems(question), "#7").toEqual(allEnabled);
  });
  test("a pager created while a page is read still follows a later pending validation", async () => {
    const source = new FakeServerSource(serverRecords(120));
    const { question } = await createMatrix(source, { pageSize: 10, columns: asyncColumns });
    source.auto = false;
    question.pageIndex = 4;
    expect(question.isDataLoading, "#1: the read is in flight").toBe(true);
    // The first run of every updater sees isDataLoading true.
    expect(enabledItems(question), "#2").toEqual(noneEnabled);
    source.settleAll();
    await flush();
    expect(enabledItems(question), "#3").toEqual(allEnabled);
    source.auto = true;
    expect(question.visibleRows.length, "#4: the page is shown").toBe(10);
    question.nextPage();
    expect(question.isPageMovePending, "#5: the move waits").toBe(true);
    expect(enabledItems(question), "#6: the pending validation is observed").toEqual(noneEnabled);
    settleValidators();
    await flush();
    expect(question.pageIndex, "#7").toBe(5);
    expect(enabledItems(question), "#8").toEqual(allEnabled);
  });
});

describe("Remote data source: the sort bar while a page is read or a move waits", () => {
  // An item of the sort bar: "Sort by", a level or "+", or a dropdown or a remove button inside a level.
  const getSortItem = (question: QuestionMatrixDynamicModel, id: string): Action => {
    const bar = question.recordsBar.sortActions;
    const levels = bar.actions.filter(item => item.component === "sv-sort-bar-level").map(item => <ActionContainer>item.data);
    return bar.getActionById(id) || levels.map(level => level.getActionById(id)).filter(item => !!item)[0];
  };
  const sortItemIds = ["sv-sort-field", "sv-sort-direction"];
  const enabledItems = (question: QuestionMatrixDynamicModel): Array<boolean> =>
    sortItemIds.map(id => getSortItem(question, id).enabled);
  const asyncColumns = [{ name: "col1", validators: [{ type: "expression", expression: "sortBarRemoteAsyncFunc({row.col1}) = 1" }] }, { name: "col2" }];
  let validatorResults: Array<(res: any) => void> = [];
  beforeEach(() => {
    validatorResults = [];
    FunctionFactory.Instance.register("sortBarRemoteAsyncFunc", function (this: any) { validatorResults.push(this.returnResult); return false; }, true);
  });
  afterEach(() => {
    FunctionFactory.Instance.unregister("sortBarRemoteAsyncFunc");
  });
  const settleValidators = (): void => {
    const results = validatorResults;
    validatorResults = [];
    results.forEach(setResult => setResult(1));
  };
  test("both dropdowns are disabled while a page is read, and enabled after the read", async () => {
    const source = new FakeServerSource(serverRecords(120));
    const { question } = await createMatrix(source, { pageSize: 10, allowSort: true });
    expect(enabledItems(question), "#1").toEqual([true, true]);
    source.auto = false;
    question.nextPage();
    expect(question.isDataLoading, "#2: the read is in flight").toBe(true);
    expect(enabledItems(question), "#3").toEqual([false, false]);
    source.settleAll();
    await flush();
    expect(enabledItems(question), "#4").toEqual([true, true]);
  });
  test("with two levels, every dropdown, the remove button and \"+\" are disabled while a page is read", async () => {
    const source = new FakeServerSource(serverRecords(120));
    const { question } = await createMatrix(source, { pageSize: 10, allowSort: true, maxSortLevel: 3,
      columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }] });
    question.sort(<any>[{ field: "col1", direction: "asc" }, { field: "col2", direction: "desc" }]);
    await flush();
    const ids = ["sv-sort-field", "sv-sort-direction", "sv-sort-field-2", "sv-sort-direction-2", "sv-sort-remove-2", "sv-sort-add"];
    const enabled = (): Array<boolean> => ids.map(id => getSortItem(question, id).enabled);
    expect(enabled(), "#1").toEqual(ids.map(() => true));
    source.auto = false;
    question.nextPage();
    expect(question.isDataLoading, "#2: the read is in flight").toBe(true);
    expect(enabled(), "#3").toEqual(ids.map(() => false));
    source.settleAll();
    await flush();
    expect(enabled(), "#4").toEqual(ids.map(() => true));
  });
  test("the sort dialog's Apply is disabled while a page is read", async () => {
    const savedShowDialog = settings.showDialog;
    const manager = new PopupModalManager();
    settings.showDialog = (options: IDialogOptions, rootElement?: HTMLElement): any => manager.addDialog(options, rootElement);
    try {
      const source = new FakeServerSource(serverRecords(120));
      const { question } = await createMatrix(source, { pageSize: 10, allowSort: true, maxSortLevel: 3,
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }] });
      question.sort(<any>[{ field: "col1", direction: "asc" }, { field: "col2", direction: "desc" }]);
      await flush();
      getSortItem(question, "sv-sort-more").action();
      const popup = manager.getModals()[0];
      const applyAction = popup.footerToolbar.getActionById("apply");
      expect(applyAction.enabled, "#1").toBe(true);
      source.auto = false;
      question.nextPage();
      expect(question.isDataLoading, "#2: the read is in flight").toBe(true);
      expect(applyAction.enabled, "#3").toBe(false);
      source.settleAll();
      await flush();
      expect(applyAction.enabled, "#4").toBe(true);
    } finally {
      manager.clear();
      settings.showDialog = savedShowDialog;
    }
  });
  test("a sort bar created while a move waits for a validator still follows a later page read", async () => {
    const source = new FakeServerSource(serverRecords(120));
    const { question } = await createMatrix(source, { pageSize: 10, allowSort: true, columns: asyncColumns });
    question.pageIndex = 4;
    await flush();
    expect(question.visibleRows.length, "#0: the page is shown").toBe(10);
    question.nextPage();
    expect(question.isPageMovePending, "#1: the move waits").toBe(true);
    // The first run of every updater sees isPageMovePending true.
    expect(enabledItems(question), "#2").toEqual([false, false]);
    settleValidators();
    await flush();
    expect(question.pageIndex, "#3: moved").toBe(5);
    expect(enabledItems(question), "#4").toEqual([true, true]);
    source.auto = false;
    question.prevPage();
    expect(question.isDataLoading, "#5: a move back reads without validating").toBe(true);
    expect(enabledItems(question), "#6: the read is observed").toEqual([false, false]);
    source.settleAll();
    await flush();
    expect(enabledItems(question), "#7").toEqual([true, true]);
  });
  test("a pick sorts through the source and the bar shows the sort once the page is read", async () => {
    const source = new FakeServerSource(serverRecords(30));
    const { question } = await createMatrix(source, { pageSize: 10, allowSort: true });
    const field = getSortItem(question, "sv-sort-field");
    const list = <ListModel>field.data;
    list.onItemClick(list.actions.filter(item => item.title === "col2")[0]);
    await flush();
    expect(question.sortCriteria.map(item => ({ field: item.field, direction: item.direction })), "#1").toEqual([{ field: "col2", direction: "asc" }]);
    expect([field.title, getSortItem(question, "sv-sort-direction").title], "#2").toEqual(["col2", "Alphabet, A - Z"]);
  });
});
