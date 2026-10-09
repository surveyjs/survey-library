import { describe, test, expect, vi } from "vitest";
import { SurveyElement } from "../../src/survey-element";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* A removal takes the record and its object together: the record and the view index it reports are
   read while the object is still among the objects, the page the list cuts is refilled once, and the
   removed event sees the page as it will be shown. */

function createMatrix(json: any, data?: Array<any>): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
    columns: [{ name: "a", cellType: "text" }] }, json)] });
  if (!!data) survey.data = { m: data };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
function createPanel(json: any, data?: Array<any>): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p",
    templateElements: [{ type: "text", name: "a" }] }, json)] });
  if (!!data) survey.data = { p: data };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
}
function records(count: number): Array<any> {
  const res = [];
  for (let i = 0; i < count; i++) res.push({ a: i });
  return res;
}
const values = (val: Array<any>): Array<any> => (val || []).map((r: any) => !!r ? r.a : undefined);
const rowValues = (matrix: QuestionMatrixDynamicModel): Array<any> => matrix.visibleRows.map(row => row.value.a);
const panelValues = (panel: QuestionPanelDynamicModel): Array<any> => panel.panels.map(p => p.getQuestionByName("a").value);
const currentValue = (panel: QuestionPanelDynamicModel): any => !!panel.currentPanel ? panel.currentPanel.getQuestionByName("a").value : null;
const runOnce = (event: any, func: (sender: any, options: any) => void): void => {
  let isDone = false;
  event.add((sender: any, options: any) => {
    if (isDone) return;
    isDone = true;
    func(sender, options);
  });
};

// A keyed in-memory source; asynchronous answers when isAsync is set.
class Source implements IDynamicDataSource {
  public keyField = "id";
  public isAsync = false;
  public removes = 0;
  public reads = 0;
  constructor(public records: Array<any>, public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: false, sorting: false }) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult | Promise<IDynamicDataReadResult> {
    this.reads++;
    const take = request.take > 0 ? request.take : this.records.length;
    const res = { records: this.records.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)), total: this.records.length };
    return this.isAsync ? new Promise(resolve => setTimeout(() => resolve(res), 0)) : res;
  }
  public update(key: any, record: any): void {
    const at = this.records.map(r => r.id).indexOf(key);
    if (at > -1)this.records[at] = Object.assign({}, record);
  }
  public insert(record: any, sourceIndex: number): any {
    const stored = Object.assign({ id: 1000 + this.records.length }, record);
    this.records.splice(sourceIndex, 0, stored);
    return Object.assign({}, stored);
  }
  public remove(key: any): void {
    this.removes++;
    const at = this.records.map(r => r.id).indexOf(key);
    if (at > -1)this.records.splice(at, 1);
  }
}
function keyedRecords(count: number): Array<any> {
  return records(count).map((r, i) => Object.assign({ id: i + 1 }, r));
}

describe("a removed record takes its object with it, in every mode", () => {
  const cases: Array<{ name: string, json: any, view?: (q: any) => void }> = [
    { name: "no view", json: {} },
    { name: "a sort", json: {}, view: q => { q.sortOrder = [{ field: "a", direction: "desc" }]; } },
    { name: "paging", json: { rowsPerPage: 10 } }
  ];
  cases.forEach(c => {
    [0, 2, 4].forEach(pos => {
      test("matrix, " + c.name + ": removeRow(" + pos + ") removes the record of that row and reports its view index", () => {
        const matrix = createMatrix(c.json, records(5));
        if (!!c.view) c.view(matrix);
        const expected = rowValues(matrix)[pos];
        const removed: Array<any> = [];
        (<SurveyModel>matrix.survey).onMatrixRowRemoved.add((_, options) => { removed.push([options.rowIndex, options.row.value.a]); });
        matrix.removeRow(pos);
        expect(removed, "#1").toEqual([[pos, expected]]);
        expect(values(matrix.value).indexOf(expected), "#2: the record is gone").toBe(-1);
        expect(matrix.value.length, "#3").toBe(4);
      });
      test("panel, " + c.name.replace("rows", "panels") + ": removePanel(" + pos + ") removes the record of that panel and reports its view index", () => {
        const json = c.json.rowsPerPage ? { panelsPerPage: c.json.rowsPerPage } : {};
        const panel = createPanel(json, records(5));
        if (!!c.view) c.view(panel);
        const expected = panelValues(panel)[pos];
        const removed: Array<any> = [];
        (<SurveyModel>panel.survey).onDynamicPanelRemoved.add((_, options) => { removed.push([options.panelIndex, options.panel.getQuestionByName("a").value]); });
        panel.removePanel(pos);
        expect(removed, "#1").toEqual([[pos, expected]]);
        expect(values(panel.value).indexOf(expected), "#2: the record is gone").toBe(-1);
        expect(panel.value.length, "#3").toBe(4);
      });
    });
  });
  test("matrix with a data source: removeRowByIndex removes the record and its row, without events", () => {
    const source = new Source(keyedRecords(4), { paging: false, filtering: false, sorting: false });
    const matrix = createMatrix({});
    matrix.dataSource = source;
    const rows = matrix.visibleRows;
    const removed: Array<any> = [];
    (<SurveyModel>matrix.survey).onMatrixRowRemoved.add(() => { removed.push(1); });
    matrix.removeRowByIndex(1);
    expect(source.records.map(r => r.a), "#1").toEqual([0, 2, 3]);
    expect(rowValues(matrix), "#2").toEqual([0, 2, 3]);
    expect(matrix.visibleRows[0], "#3: the rows that stay are the same objects").toBe(rows[0]);
    expect(removed, "#4").toEqual([]);
    expect(source.removes, "#5").toBe(1);
  });
});

describe("the panel that takes over after a removal", () => {
  ["tab", "carousel"].forEach(mode => {
    test(mode + ", no paging: the next panel, the previous one for the last, none for the only one", () => {
      const panel = createPanel({ displayMode: mode }, records(4));
      panel.currentIndex = 0;
      panel.removePanel(0);
      expect(currentValue(panel), "#1: first -> the next").toBe(1);
      panel.currentIndex = 1;
      panel.removePanel(1);
      expect(currentValue(panel), "#2: middle -> the next").toBe(3);
      panel.currentIndex = 1;
      panel.removePanel(1);
      expect(currentValue(panel), "#3: last -> the previous").toBe(1);
      panel.removePanel(0);
      expect(currentValue(panel), "#4: the only one").toBeNull();
    });
    test(mode + ", no paging: a hidden neighbour is skipped", () => {
      const panel = createPanel({ displayMode: mode, templateVisibleIf: "{panel.a} != 2" }, records(4));
      panel.currentIndex = 1;
      expect(currentValue(panel), "#1").toBe(1);
      panel.removePanel(1);
      expect(currentValue(panel), "#2: record 2 is hidden").toBe(3);
    });
    test(mode + ", paging: the next panel, the previous one for the last of the page", () => {
      const panel = createPanel({ displayMode: mode, panelsPerPage: 2 }, records(4));
      panel.currentIndex = 0;
      panel.removePanel(0);
      expect(currentValue(panel), "#1: first -> the next").toBe(1);
      panel.currentIndex = 1;
      panel.removePanel(1);
      expect(currentValue(panel), "#2: the last of the page -> the previous one").toBe(1);
      expect(panelValues(panel), "#3: the page is refilled").toEqual([1, 3]);
    });
  });
  test("list mode, with and without paging: no panel is current", () => {
    [{}, { panelsPerPage: 2 }].forEach((json, i) => {
      const panel = createPanel(json, records(3));
      panel.removePanel(0);
      expect(panel.currentPanel, "#" + i).toBeNull();
      expect(panel["getPropertyValue"]("currentPanel", null), "#" + i + ": none stored").toBeFalsy();
    });
  });
  test("a panel hidden while it is current: the next visible one takes over", () => {
    const panel = createPanel({ displayMode: "tab", templateVisibleIf: "{panel.a} != 9" }, records(3));
    panel.currentIndex = 1;
    panel.panels[1].getQuestionByName("a").value = 9;
    expect(currentValue(panel), "#1").toBe(2);
  });
  test("a lower panelCount drops the current panel: the last one left takes over", () => {
    const panel = createPanel({ displayMode: "tab" }, records(4));
    panel.currentIndex = 3;
    panel.panelCount = 2;
    expect(currentValue(panel), "#1").toBe(1);
  });
});

describe("what a removed-event handler sees under paging", () => {
  test("panel: the refilled page", () => {
    const panel = createPanel({ panelsPerPage: 2 }, records(5));
    let seen: any;
    runOnce((<SurveyModel>panel.survey).onDynamicPanelRemoved, () => { seen = { count: panel.panels.length, values: panelValues(panel) }; });
    panel.removePanel(0);
    expect(seen, "#1").toEqual({ count: 2, values: [1, 2] });
    expect(panelValues(panel), "#2").toEqual([1, 2]);
  });
  test("matrix: the refilled page", () => {
    const matrix = createMatrix({ rowsPerPage: 2 }, records(5));
    let seen: any;
    runOnce((<SurveyModel>matrix.survey).onMatrixRowRemoved, () => { seen = rowValues(matrix); });
    matrix.removeRow(0);
    expect(seen, "#1").toEqual([1, 2]);
  });
  test("panel with a source that answers at once: one event, after the refill", () => {
    const source = new Source(keyedRecords(5));
    const panel = createPanel({ panelsPerPage: 2 });
    panel.dataSource = source;
    const seen: Array<any> = [];
    (<SurveyModel>panel.survey).onDynamicPanelRemoved.add(() => { seen.push(panelValues(panel)); });
    panel.removePanel(0);
    expect(seen, "#1").toEqual([[1, 2]]);
    expect(source.removes, "#2").toBe(1);
  });
  test("panel with an asynchronous source: the event does not wait for the read", async () => {
    const source = new Source(keyedRecords(5));
    source.isAsync = true;
    const panel = createPanel({ panelsPerPage: 2 });
    panel.dataSource = source;
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(panelValues(panel), "#1").toEqual([0, 1]);
    const seen: Array<any> = [];
    (<SurveyModel>panel.survey).onDynamicPanelRemoved.add(() => { seen.push(panelValues(panel)); });
    panel.removePanel(0);
    expect(seen, "#2: the page one short").toEqual([[1]]);
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(panelValues(panel), "#3: refilled when the read commits").toEqual([1, 2]);
    expect(seen.length, "#4").toBe(1);
  });
});

describe("a handler that assigns the value inside the removed event, under paging", () => {
  const createSurvey = (): { survey: SurveyModel, question: QuestionPanelDynamicModel } => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    return { survey: survey, question: question };
  };
  const getPanelValues = (question: QuestionPanelDynamicModel): Array<any> => question.panels.map(panel => panel.getValue());
  test("a value assigned on panel removed replaces the panels", () => {
    const { survey, question } = createSurvey();
    runOnce(survey.onDynamicPanelRemoved, () => survey.setValue("q", [{ a: "x" }]));
    question.removePanel(0);
    expect(question.value, "#1").toEqual([{ a: "x" }]);
    expect(getPanelValues(question), "#2").toEqual([{ a: "x" }]);
    expect(question.panelCount, "#3").toBe(1);
  });
  test("a handler that assigns the value and throws leaves the panels following the value", () => {
    const { survey, question } = createSurvey();
    runOnce(survey.onDynamicPanelRemoved, () => {
      survey.setValue("q", [{ a: "x" }]);
      throw new Error("handler error");
    });
    expect(() => question.removePanel(0), "#1: the error reaches the caller").toThrow("handler error");
    expect(question.value, "#2").toEqual([{ a: "x" }]);
    expect(getPanelValues(question), "#3").toEqual([{ a: "x" }]);
    expect(question.panelCount, "#4").toBe(1);
    const assigned = [{ a: "y1" }, { a: "y2" }, { a: "y3" }, { a: "y4" }];
    survey.setValue("q", assigned);
    expect(getPanelValues(question), "#5: a later assignment is followed").toEqual([{ a: "y1" }, { a: "y2" }]);
    expect(question.panelCount, "#6").toBe(4);
  });
});

describe("the view index a removal reports", () => {
  test("matrix under a filter: the position in the view, not the record index", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    matrix.filterExpression = "{a} != 2";
    const reported: Array<any> = [];
    (<SurveyModel>matrix.survey).onMatrixRowRemoved.add((_, options) => { reported.push(options.rowIndex); });
    matrix.removeRow(2);
    expect(reported, "#1: the third shown row").toEqual([2]);
    expect(values(matrix.value), "#2").toEqual([1, 2, 3]);
  });
  test("panel on the second page: the position in the whole view", () => {
    const panel = createPanel({ panelsPerPage: 2 }, records(5));
    panel.pageIndex = 1;
    const reported: Array<any> = [];
    (<SurveyModel>panel.survey).onDynamicPanelRemoving.add((_, options) => { reported.push(["removing", options.panelIndex]); });
    (<SurveyModel>panel.survey).onDynamicPanelRemoved.add((_, options) => { reported.push(["removed", options.panelIndex]); });
    panel.removePanel(panel.panels[1]);
    expect(reported, "#1").toEqual([["removing", 3], ["removed", 3]]);
    expect(values(panel.value), "#2").toEqual([0, 1, 2, 4]);
  });
});

describe("a removing handler that adds a record in front of the removed one", () => {
  test("panel: the panel asked for is removed", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "a" }] }] });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    q.value = [{ a: 1 }, { a: 2 }, { a: 3 }];
    let removed: PanelModel = undefined;
    let isAdded = false;
    survey.onDynamicPanelRemoving.add(() => {
      if (isAdded) return;
      isAdded = true;
      q.addPanel(0);
      q.panels[0].getQuestionByName("a").value = 0;
      // The panels keep their places and take the reordered records: the record asked for is on panel 2 now.
      removed = q.panels[2];
    });
    q.removePanel(q.panels[1]);
    expect(q.value.map((r: any) => r.a), "#1").toEqual([0, 1, 3]);
    expect(q.panels.indexOf(removed), "#2: its own panel left").toBe(-1);
    expect(q.panels.map(panel => panel.getQuestionByName("a").value), "#3: the others show their records").toEqual([0, 1, 3]);
  });
  test("matrix: the row asked for is removed", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }] });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    q.value = [{ a: 1 }, { a: 2 }, { a: 3 }];
    let removedCell: Question = undefined;
    let isAdded = false;
    survey.onMatrixRowRemoving.add(() => {
      if (isAdded) return;
      isAdded = true;
      q.addRowByIndex({}, 0);
      q.visibleRows[0].getQuestionByColumnName("a").value = 0;
      // The rows keep their places and take the reordered records: the record asked for is on row 2 now.
      removedCell = q.visibleRows[2].getQuestionByColumnName("a");
    });
    q.removeRow(1);
    expect(q.value.map((r: any) => r.a), "#1").toEqual([0, 1, 3]);
    expect(q.visibleRows.map(row => row.getQuestionByColumnName("a")).indexOf(removedCell), "#2: the row that showed it left").toBe(-1);
    expect(q.visibleRows.map(row => row.getQuestionByColumnName("a").value), "#3: the others show their records").toEqual([0, 1, 3]);
  });
});

describe("a removing handler that assigns the value from outside", () => {
  function createPanelSurvey(displayMode?: string): { survey: SurveyModel, q: QuestionPanelDynamicModel, removed: Array<any> } {
    const json: any = { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "a" }] };
    if (!!displayMode) json.displayMode = displayMode;
    const survey = new SurveyModel({ elements: [json] });
    survey.data = { p: [{ a: 1 }, { a: 2 }, { a: 3 }] };
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    q.panels;
    const removed: Array<any> = [];
    survey.onDynamicPanelRemoved.add((_, options) => removed.push([options.panelIndex, options.panel.getValue()]));
    return { survey: survey, q: q, removed: removed };
  }
  function createMatrixSurvey(): { survey: SurveyModel, q: QuestionMatrixDynamicModel, removed: Array<any> } {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }] };
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    q.visibleRows;
    const removed: Array<any> = [];
    survey.onMatrixRowRemoved.add((_, options) => removed.push([options.rowIndex, options.row.value]));
    return { survey: survey, q: q, removed: removed };
  }
  test("a removing handler that assigns a shorter value removes nothing and raises no removed event: panel", () => {
    ["list", "carousel"].forEach(displayMode => {
      const { survey, q, removed } = createPanelSurvey(displayMode);
      let isAssigned = false;
      survey.onDynamicPanelRemoving.add(() => { if (!isAssigned) { isAssigned = true; survey.setValue("p", [{ a: 9 }]); } });
      q.removePanel(1);
      expect(q.value, displayMode + " #1").toEqual([{ a: 9 }]);
      expect(q.panelCount, displayMode + " #2").toBe(1);
      expect(removed, displayMode + " #3").toEqual([]);
    });
  });
  test("a removing handler that assigns a shorter value removes nothing and raises no removed event: matrix", () => {
    [[{ a: 9 }], []].forEach(assigned => {
      const { survey, q, removed } = createMatrixSurvey();
      let isAssigned = false;
      survey.onMatrixRowRemoving.add(() => { if (!isAssigned) { isAssigned = true; survey.setValue("m", assigned); } });
      q.removeRow(1);
      if (assigned.length > 0) expect(q.value, "#1").toEqual(assigned);
      else expect(q.isEmpty(), "#1: empty").toBe(true);
      expect(q.rowCount, assigned.length + " #2: the row count matches the rows").toBe(q.visibleRows.length);
      expect(removed, assigned.length + " #3").toEqual([]);
    });
  });
  test("a removing handler that assigns a value with the index still in range removes the record now at that index, as the released rule: matrix", () => {
    const { survey, q, removed } = createMatrixSurvey();
    let isAssigned = false;
    survey.onMatrixRowRemoving.add(() => { if (!isAssigned) { isAssigned = true; survey.setValue("m", [{ a: 7 }, { a: 8 }]); } });
    q.removeRow(1);
    expect(q.value, "#1").toEqual([{ a: 7 }]);
    expect(q.rowCount, "#2").toBe(1);
    expect(removed, "#3: the row now at that index").toEqual([[1, { a: 8 }]]);
  });
  test("a removing handler that assigns a value with the index still in range removes the record now at that index, as the released rule: panel", () => {
    const { survey, q, removed } = createPanelSurvey();
    let isAssigned = false;
    survey.onDynamicPanelRemoving.add(() => { if (!isAssigned) { isAssigned = true; survey.setValue("p", [{ a: 7 }, { a: 8 }]); } });
    q.removePanel(1);
    expect(q.value, "#1").toEqual([{ a: 7 }]);
    expect(q.panelCount, "#2").toBe(1);
    expect(removed, "#3: the panel now at that index").toEqual([[1, { a: 8 }]]);
  });
});

describe("the focus after a removal from the UI that a handler cancels", () => {
  test("panel: the focus moves as when the panel is removed", () => {
    vi.useFakeTimers();
    try {
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "a" }] }] });
      const q = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
      q.value = [{ a: 1 }, { a: 2 }];
      survey.onDynamicPanelRemoving.add((_, options) => { options.allow = false; });
      const focus = vi.spyOn(SurveyElement, "FocusElement").mockImplementation(() => true);
      q.removePanel(q.panels[0], false);
      expect(q.panels.length, "#1: the panel stays").toBe(2);
      expect(focus, "#2: as released").toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("a removal under a view after a removing handler assigned the value", () => {
  test("a removing handler that assigns the value and refreshes a sorted view: the clicked record is removed", () => {
    const data = [{ a: 3 }, { a: 2 }, { a: 1 }];
    const assigned = [{ a: 3 }, { a: 2 }, { a: 2.5 }];
    // Sorted by a: [1, 2, 3]; position 1 is the record { a: 2 }. After the assignment the view is [2, 2.5, 3].
    const matrixSurvey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, sortBy: "a",
      columns: [{ name: "a", cellType: "text", inputType: "number" }] }] });
    matrixSurvey.data = { m: JSON.parse(JSON.stringify(data)) };
    const matrix = <QuestionMatrixDynamicModel>matrixSurvey.getQuestionByName("m");
    matrix.visibleRows;
    let isMatrixAssigned = false;
    matrixSurvey.onMatrixRowRemoving.add(() => {
      if (isMatrixAssigned) return;
      isMatrixAssigned = true;
      matrixSurvey.setValue("m", JSON.parse(JSON.stringify(assigned)));
      matrix.refreshView();
    });
    matrix.removeRow(1);
    expect(matrixSurvey.data.m, "matrix").toEqual([{ a: 3 }, { a: 2.5 }]);
    const panelSurvey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", sortBy: "a",
      templateElements: [{ type: "text", name: "a", inputType: "number" }] }] });
    panelSurvey.data = { p: JSON.parse(JSON.stringify(data)) };
    const panel = <QuestionPanelDynamicModel>panelSurvey.getQuestionByName("p");
    panel.panels;
    let isPanelAssigned = false;
    panelSurvey.onDynamicPanelRemoving.add(() => {
      if (isPanelAssigned) return;
      isPanelAssigned = true;
      panelSurvey.setValue("p", JSON.parse(JSON.stringify(assigned)));
      panel.refreshView();
    });
    panel.removePanel(1);
    expect(panelSurvey.data.p, "panel").toEqual([{ a: 3 }, { a: 2.5 }]);
  });
});

describe("removing a record of another page by number keeps the other records", () => {
  const letters = ["a", "b", "c", "d", "e", "f"];
  const numbers = [1, 5, 3, 4, 2, 6];
  const getData = (): Array<any> => numbers.map((n, i) => ({ n: n, t: letters[i] }));
  const strip = (value: Array<any>): Array<string> => (value || []).map(record => "" + record.n + record.t);
  // throwOnce: a value-changed handler throws once during the removal; the caller gets its error.
  function throwOnceOnValueChanged(survey: SurveyModel): void {
    let isThrown = false;
    survey.onValueChanged.add(() => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("handler");
    });
  }
  function removeRow(perPage: number, json: any, expression: string, throwOnce: boolean = false): any {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowsPerPage: perPage,
      columns: [{ name: "n", cellType: "text" }, { name: "t", cellType: "text" }, { name: "e", cellType: "expression", expression: expression }] }, json)] });
    survey.setValue("m", getData());
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    if (perPage > 0) matrix.pageIndex = 1;
    if (throwOnce) {
      throwOnceOnValueChanged(survey);
      expect(() => matrix.removeRow(0, false), "the handler's error reaches the caller").toThrow("handler");
    } else {
      matrix.removeRow(0, false);
    }
    return { values: strip(survey.getValue("m")), count: matrix.rowCount };
  }
  function removePanel(perPage: number, json: any, expression: string, throwOnce: boolean = false): any {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p", panelsPerPage: perPage,
      templateElements: [{ type: "text", name: "n" }, { type: "text", name: "t" }, { type: "expression", name: "e", expression: expression }] }, json)] });
    survey.setValue("p", getData());
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.panels;
    if (perPage > 0) {
      if (panel.displayMode === "carousel") panel.currentIndex = 4; else panel.pageIndex = 2;
    }
    if (throwOnce) {
      throwOnceOnValueChanged(survey);
      expect(() => panel.removePanel(0), "the handler's error reaches the caller").toThrow("handler");
    } else {
      panel.removePanel(0);
    }
    return { values: strip(survey.getValue("p")), count: panel.panelCount };
  }
  test("the matrix, with an expression column on the record count", () => {
    const paged = removeRow(2, {}, "{m.length}");
    expect(paged.values, "#1").toEqual(["5b", "3c", "4d", "2e", "6f"]);
    expect(paged, "#2: as without paging").toEqual(removeRow(0, {}, "{m.length}"));
  });
  test("the sorted matrix, with an expression column on the row index", () => {
    const paged = removeRow(2, { sortBy: "n" }, "{rowIndex}");
    expect(paged.values, "#1: the first record of the sorted view goes").toEqual(["5b", "3c", "4d", "2e", "6f"]);
    expect(paged, "#2: as without paging").toEqual(removeRow(0, { sortBy: "n" }, "{rowIndex}"));
  });
  test("the dynamic panel in list mode, with an expression on the record count", () => {
    const paged = removePanel(2, { displayMode: "list" }, "{p.length}");
    expect(paged, "#1").toEqual({ values: ["5b", "3c", "4d", "2e", "6f"], count: 5 });
    expect(paged, "#2: as without paging").toEqual(removePanel(0, { displayMode: "list" }, "{p.length}"));
  });
  test("the dynamic panel in carousel mode, with an expression on the record count", () => {
    const paged = removePanel(2, { displayMode: "carousel" }, "{p.length}");
    expect(paged, "#1").toEqual({ values: ["5b", "3c", "4d", "2e", "6f"], count: 5 });
    expect(paged, "#2: as without paging").toEqual(removePanel(0, { displayMode: "carousel" }, "{p.length}"));
  });
  test("the sorted dynamic panel, with an expression on the panel index", () => {
    const paged = removePanel(2, { displayMode: "list", sortBy: "n" }, "{panelIndex}");
    expect(paged, "#1: the first record of the sorted view goes").toEqual({ values: ["5b", "3c", "4d", "2e", "6f"], count: 5 });
    expect(paged, "#2: as without paging").toEqual(removePanel(0, { displayMode: "list", sortBy: "n" }, "{panelIndex}"));
  });
  test("the matrix, when a value-changed handler throws during the removal", () => {
    const paged = removeRow(2, {}, "{m.length}", true);
    expect(paged.values, "#1: no record is written by a stale position").toEqual(["5b", "3c", "4d", "2e", "6f"]);
    expect(paged.values, "#2: as without paging").toEqual(removeRow(0, {}, "{m.length}", true).values);
  });
  test("the dynamic panel in list mode, when a value-changed handler throws during the removal", () => {
    const paged = removePanel(2, { displayMode: "list" }, "{p.length}", true);
    expect(paged.values, "#1: no record is written by a stale position").toEqual(["5b", "3c", "4d", "2e", "6f"]);
    expect(paged.values, "#2: as without paging").toEqual(removePanel(0, { displayMode: "list" }, "{p.length}", true).values);
  });
});

describe("a sorted or filtered view keeps the records of a count change and a removal", () => {
  function lowerPanelCount(json: any, data: Array<any>, count: number): any {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p",
      templateElements: [{ type: "text", name: "name" }, { type: "expression", name: "no", expression: "{panelIndex} + 1" }] }, json)] });
    survey.data = { p: data };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.panels;
    panel.panelCount = count;
    return { names: (survey.getValue("p") || []).map((record: any) => record.name), count: panel.panelCount };
  }
  const names = [{ name: "Zoe" }, { name: "Adam" }, { name: "Mia" }];
  test("the sorted dynamic panel: panelCount 0 empties the value", () => {
    expect(lowerPanelCount({ sortBy: "name" }, names, 0)).toEqual({ names: [], count: 0 });
  });
  test("the sorted dynamic panel: a lower panelCount keeps the first records, as without a sort", () => {
    expect(lowerPanelCount({ sortBy: "name" }, names, 1), "#1").toEqual({ names: ["Zoe"], count: 1 });
    expect(lowerPanelCount({ sortBy: "name" }, names, 1), "#2").toEqual(lowerPanelCount({}, names, 1));
  });
  test("the filtered dynamic panel: a lower panelCount keeps the first records", () => {
    expect(lowerPanelCount({ filterExpression: "{name} <> 'Adam'" }, names, 1)).toEqual({ names: ["Zoe"], count: 1 });
  });
  function removeAfterCountGrows(json: any): any {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text", inputType: "number" }, { name: "i", cellType: "expression", expression: "{rowIndex}" }] }, json)] });
    survey.data = { m: [{ id: "C", a: 3 }, { id: "A", a: 1 }, { id: "B", a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const getRow = (id: string) => matrix.visibleRows.filter(row => row.getQuestionByColumnName("id").value === id)[0];
    getRow("B").getQuestionByColumnName("a").value = 9;
    matrix.rowCount = 4;
    matrix.removeRowUI(getRow("A"));
    return { value: survey.getValue("m"), rowCount: matrix.rowCount, rows: matrix.visibleRows.map(row => row.getQuestionByColumnName("id").value) };
  }
  test("the sorted matrix: a removal after an edited sort key and a grown rowCount keeps the other records", () => {
    const sorted = removeAfterCountGrows({ sortBy: "a" });
    expect(sorted.value, "#1").toEqual([{ id: "C", a: 3, i: 1 }, { id: "B", a: 9, i: 2 }, { i: 3 }]);
    expect(sorted.rowCount, "#2").toBe(3);
    expect(sorted.rows, "#3: the edited record keeps its place").toEqual(["B", "C", undefined]);
    expect(sorted.value, "#4: as without a sort").toEqual(removeAfterCountGrows({}).value);
  });
  function removeWithRecordCount(json: any, id: string): any {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m",
      columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text", inputType: "number" }, { name: "len", cellType: "expression", expression: "{m.length}" }] }, json)] });
    survey.data = { m: [{ id: "C", a: 3 }, { id: "A", a: 1 }, { id: "B", a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.rowCount = 5;
    matrix.removeRowUI(matrix.visibleRows.filter(row => row.getQuestionByColumnName("id").value === id)[0]);
    return { value: survey.getValue("m"), rowCount: matrix.rowCount };
  }
  function removeWithHandlerAssignment(json: any, action: string): any {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text", inputType: "number" }, { name: "len", cellType: "expression", expression: "{m.length}" }] }, json)] });
    survey.data = { m: [{ id: "C", a: 3 }, { id: "A", a: 1 }, { id: "B", a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    let isDone = false;
    survey.onMatrixCellValueChanged.add((_, options) => {
      if (isDone || options.columnName !== "len") return;
      isDone = true;
      if (action === "assign") survey.setValue("m", survey.getValue("m").map((record: any) => Object.assign({}, record, { z: 1 })));
      if (action === "addRow") matrix.addRow();
      if (action === "clear") survey.clearValue("m");
    });
    matrix.visibleRows;
    matrix.removeRowUI(matrix.visibleRows.filter(row => row.getQuestionByColumnName("id").value === "A")[0]);
    return { value: survey.getValue("m"), rowCount: matrix.rowCount };
  }
  test("a sorted or filtered matrix: a value a handler assigns while the expressions follow a removal is kept, as without a view", () => {
    ["assign", "addRow", "clear"].forEach(action => {
      const unsorted = removeWithHandlerAssignment({}, action);
      expect(removeWithHandlerAssignment({ sortBy: "a" }, action), "#1 sorted, " + action).toEqual(unsorted);
      expect(removeWithHandlerAssignment({ filterExpression: "{a} <> 99" }, action), "#2 filtered, " + action).toEqual(unsorted);
    });
  });
  test("a sorted or filtered matrix with padded rows: an expression on the record count is computed after the removal, as without a view", () => {
    ["A", "B", "C"].forEach(id => {
      const unsorted = removeWithRecordCount({}, id);
      expect(unsorted.value.map((record: any) => record.len), "#1 " + id).toEqual([4, 4, 4, 4]);
      expect(removeWithRecordCount({ sortBy: "a" }, id), "#2 sorted, " + id).toEqual(unsorted);
      expect(removeWithRecordCount({ filterExpression: "{a} <> 9" }, id), "#3 filtered, " + id).toEqual(unsorted);
    });
  });
});
