import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { ChoicesRestful } from "../../src/choicesRestful";
import { settings } from "../../src/settings";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* Step 15 (prompts/dynamic-data-list/15-page-window.md): with paging on, the panels and rows that
   exist are the current page, for an in-memory list as for a data source that pages itself. The
   letters in the test names are the ones the prompt gives its tests. */

async function flush(times: number = 30): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}
function records(count: number, create?: (i: number) => any): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push(!!create ? create(i) : { id: i, name: "n" + i });
  }
  return res;
}
const panelTemplate = [{ type: "text", name: "id" }, { type: "text", name: "name" }];
function createPanelSurvey(json: any, data?: Array<any>, extra?: Array<any>): SurveyModel {
  const survey = new SurveyModel({
    elements: [Object.assign({ type: "paneldynamic", name: "pd", templateElements: panelTemplate }, json)].concat(extra || [])
  });
  if (!!data) {
    survey.data = { pd: data };
  }
  return survey;
}
function createPanel(json: any, data?: Array<any>, extra?: Array<any>): QuestionPanelDynamicModel {
  return <QuestionPanelDynamicModel>createPanelSurvey(json, data, extra).getQuestionByName("pd");
}
const matrixColumns = [{ name: "id", cellType: "text" }, { name: "name", cellType: "text" }];
function createMatrixSurvey(json: any, data?: Array<any>, extra?: Array<any>): SurveyModel {
  const survey = new SurveyModel({
    elements: [Object.assign({ type: "matrixdynamic", name: "md", rowCount: 0, columns: matrixColumns }, json)].concat(extra || [])
  });
  if (!!data) {
    survey.data = { md: data };
  }
  return survey;
}
function createMatrix(json: any, data?: Array<any>, extra?: Array<any>): QuestionMatrixDynamicModel {
  return <QuestionMatrixDynamicModel>createMatrixSurvey(json, data, extra).getQuestionByName("md");
}
function panelIds(question: QuestionPanelDynamicModel): Array<any> {
  return question.panels.map((panel: PanelModel) => panel.getQuestionByName("id").value);
}
function rowIds(question: QuestionMatrixDynamicModel): Array<any> {
  return question.visibleRows.map(row => row.getQuestionByName("id").value);
}
function range(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}

/* A source that pages itself, the shape a server has: every read is one request with the range. */
class PagedSource implements IDynamicDataSource {
  public reads: Array<IDynamicDataReadRequest> = [];
  public updates: Array<Array<any>> = [];
  public removes: Array<any> = [];
  constructor(public data: Array<any>, public reportTotal: boolean = true) { }
  public read(): Array<any> { return this.data; }
  public readRange(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    this.reads.push(request);
    const take = request.take > 0 ? request.take : this.data.length;
    const res: IDynamicDataReadResult = { records: this.data.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)) };
    if (this.reportTotal) res.total = this.data.length;
    return Promise.resolve(res);
  }
  public update(key: any, record: any): Promise<void> {
    this.updates.push([key, record]);
    this.data[key] = Object.assign({}, record);
    return Promise.resolve();
  }
  public remove(key: any): Promise<void> {
    this.removes.push(key);
    this.data.splice(key, 1);
    return Promise.resolve();
  }
}

describe("Page window: the objects that exist are the page", () => {
  test("(a) paneldynamic: 100 records, 20 per page - 20 panels are created, a page change holds the next 20 records", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "html", name: "intro", html: "start" }] },
        { elements: [{ type: "paneldynamic", name: "pd", panelsPerPage: 20, templateElements: panelTemplate }] }
      ]
    });
    survey.data = { pd: records(100) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const spy = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createNewPanel");
    survey.currentPageNo = 1;
    expect(question.panels.length, "#1: the first page").toBe(20);
    expect(spy.mock.calls.length, "#2: panels created for the page only").toBe(20);
    question.pageIndex = 3;
    expect(panelIds(question), "#3: records 60-79").toEqual(range(60, 79));
    expect(question.panelCount, "#4: the record count").toBe(100);
    expect(question.value.length, "#5: the value keeps every record").toBe(100);
    expect(question.visiblePanels === question.panelsOnPage, "#6: the page is visiblePanels itself").toBe(true);
    spy.mockRestore();
  });
  test("(b) matrixdynamic: 100 records, 20 per page - 20 rows are created, a page change holds the next 20 records", () => {
    const matrix = createMatrix({ rowsPerPage: 20 }, records(100));
    const spy = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "createMatrixRow");
    expect(matrix.visibleRows.length, "#1").toBe(20);
    expect(spy.mock.calls.length, "#2: rows created for the page only").toBe(20);
    matrix.pageIndex = 3;
    expect(rowIds(matrix), "#3: records 60-79").toEqual(range(60, 79));
    expect(matrix.rowCount, "#4").toBe(100);
    expect(matrix.value.length, "#5").toBe(100);
    expect(matrix.visibleRows === matrix.rowsOnPage, "#6: the page is visibleRows itself").toBe(true);
    spy.mockRestore();
  });
  test("(c) siblings on one valueName: a write through A's page reaches B's panel only when B shows that record", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", panelsPerPage: 20, templateElements: panelTemplate },
        { type: "paneldynamic", name: "B", valueName: "rec", panelsPerPage: 20, templateElements: panelTemplate }
      ]
    });
    survey.data = { rec: records(100) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    a.pageIndex = 3;
    expect(panelIds(b), "#1: B is on page 0").toEqual(range(0, 19));
    a.panels[5].getQuestionByName("name").value = "written";
    expect(b.value[65].name, "#2: B's value has the write").toBe("written");
    expect(b.panels.map(p => p.getQuestionByName("name").value).indexOf("written"), "#3: no panel of B's page shows it").toBe(-1);
    b.pageIndex = 3;
    expect(b.panels[5].getQuestionByName("name").value, "#4: B's page 3 shows it").toBe("written");
  });
  test("(d) totals: a sum over 100 records with 20 rows per page totals all 100", () => {
    const matrix = createMatrix({
      rowsPerPage: 20,
      columns: [{ name: "id", cellType: "text" }, { name: "amount", cellType: "text", inputType: "number", totalType: "sum" }]
    }, records(100, (i: number) => ({ id: i, amount: i })));
    expect(matrix.visibleRows.length, "#1").toBe(20);
    expect(matrix.totalValue.amount, "#2: 0 + 1 + ... + 99").toBe(4950);
    matrix.pageIndex = 2;
    expect(matrix.totalValue.amount, "#3: a page change does not change it").toBe(4950);
  });
  test("(e) neighbours come from the view: the first panel and row of page 2 read record 19", () => {
    const question = createPanel({
      panelsPerPage: 20,
      templateElements: [{ type: "text", name: "id" }, { type: "expression", name: "prev", expression: "{prevPanel.id}" },
        { type: "expression", name: "vis", expression: "{visiblePanelIndex}" }]
    }, records(100));
    question.pageIndex = 1;
    const first = question.panels[0];
    expect(first.getQuestionByName("id").value, "#1").toBe(20);
    expect(first.getQuestionByName("prev").value, "#2: record 19 has no panel and is read as a value").toBe(19);
    expect(first.getQuestionByName("vis").value, "#3: {visiblePanelIndex} is the position in the whole list").toBe(20);
    const matrix = createMatrix({
      rowsPerPage: 20,
      columns: [{ name: "id", cellType: "text" }, { name: "prev", cellType: "expression", expression: "{prevRow.id}" },
        { name: "vis", cellType: "expression", expression: "{visibleRowIndex}" }]
    }, records(100));
    matrix.pageIndex = 1;
    const row = matrix.visibleRows[0];
    expect(row.getQuestionByName("prev").value, "#4: the previous row is record 19").toBe(19);
    expect(row.getQuestionByName("vis").value, "#5: {visibleRowIndex} is 1-based in the whole list").toBe(21);
    expect(row.visibleIndex, "#6: the row's visibleIndex").toBe(20);
    expect(row.pageVisibleIndex, "#7: and its pageVisibleIndex").toBe(0);
  });
  test("(f) a key typed on page 0 that repeats an off-page record is reported on value change and on validation", () => {
    const survey = createPanelSurvey({ panelsPerPage: 20, keyName: "name" }, records(100));
    survey.checkErrorsMode = "onValueChanged";
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const keyQuestion = <Question>question.panels[3].getQuestionByName("name");
    keyQuestion.value = "n70";
    expect(keyQuestion.errors.length, "#1: on value change").toBe(1);
    keyQuestion.clearErrors();
    expect(question.validate(true), "#2: on validation").toBe(false);
    expect(keyQuestion.errors.length, "#3").toBe(1);
  });
});

describe("Page window: validation", () => {
  const requiredTemplate = [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }];
  test("(f2) a key pair whose records are both off the page is found by Complete, on the later record's page", () => {
    const data = records(100);
    data[70].name = "n40";
    const survey = createPanelSurvey({ panelsPerPage: 20, keyName: "name" }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.pageIndex, "#1").toBe(0);
    expect(survey.tryComplete(), "#2: the pair blocks Complete").toBe(false);
    expect(question.pageIndex, "#3: the page of record 70").toBe(3);
    expect(question.panels[10].getQuestionByName("id").value, "#4").toBe(70);
    expect(question.panels[10].getQuestionByName("name").errors.length, "#5: the error is on record 70's key").toBe(1);
    const matrixData = records(100);
    matrixData[70].name = "n40";
    const msurvey = createMatrixSurvey({ rowsPerPage: 20, keyName: "name" }, matrixData);
    const matrix = <QuestionMatrixDynamicModel>msurvey.getQuestionByName("md");
    matrix.visibleRows;
    expect(msurvey.tryComplete(), "#6: the matrix has the same gap and the same fix").toBe(false);
    expect(matrix.pageIndex, "#7").toBe(3);
    expect(matrix.visibleRows[10].getQuestionByName("name").errors.length, "#8").toBe(1);
  });
  test("(f2) key pair membership: hidden records do not take part, filtered-out records do but get no error", () => {
    const data = records(100, (i: number) => ({ id: i, name: "n" + i, group: i === 70 ? "b" : "a" }));
    data[70].name = "n40";
    const hidden = createPanelSurvey({ panelsPerPage: 20, keyName: "name", templateVisibleIf: "{panel.group} = 'a'" }, data);
    expect(hidden.tryComplete(), "#1: record 70 is hidden - the pair reports nothing").toBe(true);
    const filtered = createPanelSurvey({ panelsPerPage: 20, keyName: "name", filterExpression: "{group} = 'a'" }, data);
    const question = <QuestionPanelDynamicModel>filtered.getQuestionByName("pd");
    expect(filtered.tryComplete(), "#2: record 70 is filtered out - the error goes on record 40").toBe(false);
    expect(question.pageIndex, "#3: record 40 is the visible one").toBe(2);
    expect(question.panels[0].getQuestionByName("id").value, "#4").toBe(40);
    expect(question.panels[0].getQuestionByName("name").errors.length, "#5").toBe(1);
    const both = createPanelSurvey({ panelsPerPage: 20, keyName: "name", filterExpression: "{id} != 40 and {id} != 70" }, data);
    expect(both.tryComplete(), "#6: both filtered out - nothing").toBe(true);
  });
  test("(f2) remote: a key pair outside the loaded window does not block (the stated limit)", async () => {
    const data = records(100);
    data[70].name = "n40";
    const survey = createPanelSurvey({ panelsPerPage: 20, keyName: "name", panelCount: 0 });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.dataSource = new PagedSource(data);
    await flush();
    expect(question.panels.length, "#1").toBe(20);
    expect(survey.tryComplete(), "#2").toBe(true);
  });
  test("(g) layer 1: a forward move validates the page it leaves, a move back and a move from code do not", () => {
    const data = records(100);
    delete data[2].name;
    const question = createPanel({ panelsPerPage: 20, templateElements: requiredTemplate }, data);
    expect(question.nextPage(), "#1: an error found at once").toBe(false);
    expect(question.pageIndex, "#2: no move").toBe(0);
    expect(question.panels[2].getQuestionByName("name").errors.length, "#3: the error is shown").toBe(1);
    expect(question.goToPage(3), "#4: goToPage forward validates too").toBe(false);
    expect(question.toggleSort("id"), "#5: a header click validates too").toBe(false);
    expect(question.sortOrder, "#6: and does not sort").toEqual([]);
    expect(question.addPanelUI(), "#7: add lands on the last page and validates").toBeNull();
    expect(question.panelCount, "#8").toBe(100);
    question.panels[2].getQuestionByName("name").value = "filled";
    expect(question.nextPage(), "#9").toBe(true);
    expect(question.pageIndex, "#10: moved").toBe(1);
    question.panels[0].getQuestionByName("name").value = "";
    expect(question.prevPage(), "#11: back does not validate").toBe(true);
    expect(question.pageIndex, "#12").toBe(0);
    question.pageIndex = 1;
    question.pageIndex = 3;
    expect(question.pageIndex, "#13: a page from code does not validate").toBe(3);
  });
  test("(g) layer 1: the matrix pager, sort and add-row validate the page they leave", () => {
    const data = records(100);
    delete data[2].name;
    const matrix = createMatrix({ rowsPerPage: 20, columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text", isRequired: true }] }, data);
    matrix.visibleRows;
    expect(matrix.nextPage(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(0);
    expect(matrix.visibleRows[2].getQuestionByName("name").errors.length, "#3").toBe(1);
    expect(matrix.toggleSort("id"), "#4").toBe(false);
    matrix.addRowUI();
    expect(matrix.rowCount, "#5: the add did not happen").toBe(100);
    matrix.visibleRows[2].getQuestionByName("name").value = "filled";
    expect(matrix.nextPage(), "#6").toBe(true);
    expect(matrix.pageIndex, "#7").toBe(1);
    matrix.visibleRows[0].getQuestionByName("name").value = "";
    expect(matrix.prevPage(), "#8: back does not validate").toBe(true);
    matrix.pageIndex = 2;
    expect(matrix.pageIndex, "#9: a page from code does not validate").toBe(2);
  });
  const editRecordFive = (question: QuestionPanelDynamicModel): void => {
    const panel = question.panels.filter(p => p.getQuestionByName("id").value === 5)[0];
    panel.getQuestionByName("note").value = "edited";
  };
  const expectRecordFiveShown = (survey: SurveyModel, question: QuestionPanelDynamicModel, message: string): void => {
    expect(survey.tryComplete(), message + ": Complete fails").toBe(false);
    const panel = question.panels.filter(p => p.getQuestionByName("id").value === 5)[0];
    expect(!!panel, message + ": the page shows record 5").toBe(true);
    expect(panel.getQuestionByName("name").errors.length, message + ": with its error").toBe(1);
  };
  const invalidData = (): Array<any> => records(20, (i: number) => i === 5 ? { id: 5 } : { id: i, name: "n" + i });
  test("(g2) layer 2: an invalid edit moved off the page by a sort from code is caught by Complete", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.sortOrder = [{ field: "id", direction: "desc" }];
    expect(panelIds(question).indexOf(5), "#1: record 5 left the page").toBe(-1);
    expectRecordFiveShown(survey, question, "#2");
  });
  test("(g2) layer 2: a filter", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.filterExpression = "{id} != 100";
    expect(question.pageIndex, "#1: a filter goes back to page 0").toBe(0);
    expectRecordFiveShown(survey, question, "#2");
  });
  test("(g2) layer 2: a pageIndex from code", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.pageIndex = 0;
    expectRecordFiveShown(survey, question, "#1");
  });
  test("(g2) layer 2: a record that becomes visible ahead of the page pushes record 5 onto the next one", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate, templateVisibleIf: "{panel.id} != {hideId}" },
      invalidData(), [{ type: "text", name: "hideId" }]);
    survey.setValue("hideId", 2);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(panelIds(question), "#1: record 2 hidden, record 5 is on page 0").toEqual([0, 1, 3, 4, 5]);
    editRecordFive(question);
    survey.setValue("hideId", 99);
    expect(panelIds(question), "#2: record 2 is back and record 5 moved to page 1").toEqual([0, 1, 2, 3, 4]);
    expectRecordFiveShown(survey, question, "#3");
  });
  test("(g3) a record the filter excludes or templateVisibleIf hides is exempt until it comes back", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.filterExpression = "{id} != 5";
    expect(survey.tryComplete(), "#1: filtered out - exempt").toBe(true);
    // Back to running, with the data and the question state as they are.
    survey.clear(false, false);
    question.filterExpression = "";
    expectRecordFiveShown(survey, question, "#2: the filter cleared");
    const survey3 = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate, templateVisibleIf: "{panel.id} != {hideId}" },
      invalidData(), [{ type: "text", name: "hideId" }]);
    const question3 = <QuestionPanelDynamicModel>survey3.getQuestionByName("pd");
    question3.pageIndex = 1;
    editRecordFive(question3);
    survey3.setValue("hideId", 5);
    question3.pageIndex = 0;
    expect(survey3.tryComplete(), "#3: hidden - exempt").toBe(true);
    survey3.clear(false, false);
    survey3.setValue("hideId", 99);
    expectRecordFiveShown(survey3, question3, "#4: shown again");
  });
  test("(g3) remote: an invalid edit left on page 0 does not block Complete from page 2 (layer 1 only)", async () => {
    const data = records(20, (i: number) => i === 3 ? { id: 3 } : { id: i, name: "n" + i });
    const survey = createPanelSurvey({ panelsPerPage: 5, panelCount: 0, templateElements: requiredTemplate });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.dataSource = <any>new PagedSource(data);
    await flush();
    question.panels[3].getQuestionByName("note").value = "edited";
    question.pageIndex = 2;
    await flush();
    expect(panelIds(question), "#1").toEqual([10, 11, 12, 13, 14]);
    expect(survey.tryComplete(), "#2").toBe(true);
  });
  test("(g4) nested paging: the inner edited set is checked by the outer page leave and survives the outer rebuild", () => {
    const inner = (): Array<any> => records(30, (i: number) => ({ a: "a" + i }));
    const outerData = records(10, (i: number) => ({ id: i, items: inner() }));
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", panelsPerPage: 5,
        templateElements: [{ type: "text", name: "id" }, {
          type: "paneldynamic", name: "items", panelsPerPage: 5,
          templateElements: [{ type: "text", name: "a", isRequired: true }, { type: "text", name: "b" }]
        }]
      }]
    });
    survey.data = { outer: outerData };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const innerOf = (id: number): QuestionPanelDynamicModel => {
      const panel = outer.panels.filter(p => p.getQuestionByName("id").value === id)[0];
      return <QuestionPanelDynamicModel>panel.getQuestionByName("items");
    };
    let items = innerOf(2);
    items.pageIndex = 5;
    items.panels[0].getQuestionByName("a").value = "";
    items.panels[0].getQuestionByName("b").value = "x";
    items.pageIndex = 0;
    expect(outer.nextPage(), "#1: leaving the outer page is blocked").toBe(false);
    items = innerOf(2);
    expect(items.pageIndex, "#2: the inner question shows record 25").toBe(5);
    expect(items.panels[0].getQuestionByName("a").errors.length, "#3").toBe(1);
    items.pageIndex = 0;
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(innerOf(2).pageIndex, "#4: the rebuilt inner question keeps its page").toBe(0);
    expect(survey.tryComplete(), "#5: the handed-back set is checked").toBe(false);
    expect(innerOf(2).pageIndex, "#6").toBe(5);
    innerOf(2).pageIndex = 0;
    outer.addPanel(0);
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(outer.value[3].id, "#7: the edited outer record is record 3 now").toBe(2);
    expect(survey.tryComplete(), "#8: the set moved with its outer record").toBe(false);
    expect(innerOf(2).pageIndex, "#9: and the inner question of that record shows inner record 25").toBe(5);
    expect(innerOf(3).pageIndex, "#10").toBe(0);
  });
  test("(h) a required field empty on a page never opened and never edited does not block Complete", () => {
    const data = records(100);
    delete data[85].name;
    const survey = createPanelSurvey({ panelsPerPage: 20, templateElements: requiredTemplate }, data);
    expect(survey.tryComplete(), "#1: the documented limit").toBe(true);
  });
});

describe("Page window: asynchronous validators and the survey's settings", () => {
  const results: Array<(res: any) => void> = [];
  function asyncPageFunc(params: any): any {
    results.push(this.returnResult);
    return false;
  }
  const asyncTemplate = [{ type: "text", name: "id" },
    { type: "text", name: "name", validators: [{ type: "expression", expression: "asyncPageFunc({panel.id}) = 1" }] }];
  const register = (): void => {
    results.length = 0;
    FunctionFactory.Instance.register("asyncPageFunc", asyncPageFunc, true);
  };
  afterEach(() => {
    FunctionFactory.Instance.unregister("asyncPageFunc");
  });
  test("(i) the move waits for the validators, the pager is not usable meanwhile, an error stops it", () => {
    register();
    const question = createPanel({ panelsPerPage: 5, templateElements: asyncTemplate }, records(20));
    expect(question.nextPage(), "#1: pending is true, the survey's contract").toBe(true);
    expect(question.pageIndex, "#2: not moved yet").toBe(0);
    expect(question.isPageMovePending, "#3").toBe(true);
    expect(question.canGoNextPage, "#4: the pager is not usable").toBe(false);
    expect(question.pagerActions.getActionById("sv-pager-next").enabled, "#5: nor are its actions").toBe(false);
    expect(results.length, "#6: one validator per panel of the page").toBe(5);
    results.forEach(setResult => setResult(1));
    expect(question.pageIndex, "#7: moved once every validator settled clean").toBe(1);
    expect(question.isPageMovePending, "#8").toBe(false);
    results.length = 0;
    question.nextPage();
    results.forEach((setResult, index) => setResult(index === 2 ? 0 : 1));
    expect(question.pageIndex, "#9: an error stops it").toBe(1);
    expect(question.panels[2].getQuestionByName("name").errors.length, "#10: and is shown").toBe(1);
  });
  test("(i) carousel Next and addPanelUI wait too; the add is observed through onDynamicPanelAdded", () => {
    register();
    const survey = createPanelSurvey({ displayMode: "carousel", templateElements: asyncTemplate }, records(5));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    let added = 0;
    survey.onDynamicPanelAdded.add(() => added++);
    expect(question.goToNextPanel(), "#1").toBe(true);
    expect(question.currentIndex, "#2: not moved yet").toBe(0);
    results.forEach(setResult => setResult(1));
    expect(question.currentIndex, "#3").toBe(1);
    results.length = 0;
    question.currentIndex = 4;
    expect(question.addPanelUI(), "#4: null while pending").toBeNull();
    expect(added, "#5").toBe(0);
    results.forEach(setResult => setResult(1));
    expect(added, "#6: added once the validator settled clean").toBe(1);
    expect(question.currentIndex, "#7: and shown").toBe(5);
    expect(question.panelCount, "#8").toBe(6);
  });
  test("(i) cancellation: a page from code, a sort or dispose drops the pending move, a late error neither shows nor throws", () => {
    register();
    const question = createPanel({ panelsPerPage: 5, templateElements: asyncTemplate }, records(20));
    question.nextPage();
    question.pageIndex = 3;
    expect(question.isPageMovePending, "#1: a page from code drops it").toBe(false);
    expect(() => results.forEach(setResult => setResult(0)), "#2").not.toThrow();
    expect(question.pageIndex, "#3: the late result moved nothing").toBe(3);
    expect(question.panels.every(p => p.getQuestionByName("name").errors.length === 0), "#4: nor showed on this page").toBe(true);
    results.length = 0;
    question.nextPage();
    question.sortOrder = [{ field: "id", direction: "desc" }];
    expect(question.isPageMovePending, "#5: a sort drops it").toBe(false);
    results.forEach(setResult => setResult(1));
    expect(question.pageIndex, "#6: a sort keeps the page, the dropped move did not happen").toBe(3);
    results.length = 0;
    question.nextPage();
    question.dispose();
    expect(() => results.forEach(setResult => setResult(0)), "#7: dispose").not.toThrow();
  });
  const requiredTemplate = [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }];
  const setupInvalid = (checkErrorsMode: string, allowSwitchPages: boolean, json: any): { survey: SurveyModel, question: QuestionPanelDynamicModel } => {
    const data = records(20);
    delete data[2].name;
    const survey = new SurveyModel({
      elements: [Object.assign({ type: "paneldynamic", name: "pd", templateElements: requiredTemplate }, json)]
    });
    if (!!checkErrorsMode) survey.checkErrorsMode = <any>checkErrorsMode;
    survey.validationAllowSwitchPages = allowSwitchPages;
    survey.data = { pd: data };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    // Record 2 is edited and left invalid: a carousel shows it as its current panel.
    if (question.displayMode === "carousel") {
      question.currentIndex = 2;
      question.currentPanel.getQuestionByName("note").value = "edited";
    } else {
      question.panels[2].getQuestionByName("note").value = "edited";
    }
    return { survey: survey, question: question };
  };
  test("checkErrorsMode onComplete and validationAllowSwitchPages: the pager moves with errors, Complete finds the edited record", () => {
    const onComplete = setupInvalid("onComplete", false, { panelsPerPage: 5 });
    expect(onComplete.question.nextPage(), "#1").toBe(true);
    expect(onComplete.question.pageIndex, "#2: moved").toBe(1);
    expect(onComplete.survey.tryComplete(), "#3").toBe(false);
    expect(onComplete.question.pageIndex, "#4: back on the record").toBe(0);
    const allowSwitch = setupInvalid("", true, { panelsPerPage: 5 });
    expect(allowSwitch.question.nextPage(), "#5").toBe(true);
    expect(allowSwitch.question.pageIndex, "#6").toBe(1);
    expect(allowSwitch.survey.tryComplete(), "#7").toBe(false);
    expect(allowSwitch.question.pageIndex, "#8").toBe(0);
    const byDefault = setupInvalid("", false, { panelsPerPage: 5 });
    expect(byDefault.question.nextPage(), "#9: the default blocks").toBe(false);
    expect(byDefault.question.pageIndex, "#10").toBe(0);
  });
  test("carousel Next follows checkErrorsMode too (a behaviour change)", () => {
    const onComplete = setupInvalid("onComplete", false, { displayMode: "carousel" });
    expect(onComplete.question.goToNextPanel(), "#1").toBe(true);
    expect(onComplete.question.currentIndex, "#2: moved with the error").toBe(3);
    expect(onComplete.survey.tryComplete(), "#3").toBe(false);
    expect(onComplete.question.currentIndex, "#4").toBe(2);
    const byDefault = setupInvalid("", false, { displayMode: "carousel" });
    expect(byDefault.question.goToNextPanel(), "#5").toBe(false);
    expect(byDefault.question.currentIndex, "#6").toBe(2);
  });
});

describe("Page window: records without an object", () => {
  test("(j) templateVisibleIf is evaluated over the records: the page holds visible records only", () => {
    const spy = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createNewPanel");
    const survey = createPanelSurvey({ panelsPerPage: 20, templateVisibleIf: "{panel.id} % 3 != 0 or {showAll} = true" },
      records(90), [{ type: "boolean", name: "showAll" }]);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const visibleIds = range(0, 89).filter(i => i % 3 !== 0);
    expect(panelIds(question), "#1: 20 visible records").toEqual(visibleIds.slice(0, 20));
    expect(question.pageCount, "#2: 60 visible records of 20").toBe(3);
    expect(spy.mock.calls.length <= 20, "#3: no more than a page of panels, was " + spy.mock.calls.length).toBe(true);
    const list = question.getDataList();
    question.panels.forEach((panel, i) => {
      expect(panel.isVisible && list.isRecordVisible(visibleIds[i]), "#4: a built panel and its record agree").toBe(true);
    });
    survey.setValue("showAll", true);
    expect(question.pageCount, "#5: the condition is re-evaluated").toBe(5);
    expect(panelIds(question), "#6").toEqual(range(0, 19));
    spy.mockRestore();
    const matrix = createMatrix({ rowsPerPage: 20, rowsVisibleIf: "{row.id} % 3 != 0" }, records(90));
    expect(rowIds(matrix), "#7: rowsVisibleIf the same way").toEqual(visibleIds.slice(0, 20));
    expect(matrix.pageCount, "#8").toBe(3);
  });
  test("(j) a record changed on a sibling's page updates the hidden flag", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", panelsPerPage: 5, templateVisibleIf: "{panel.hide} != true",
          templateElements: [{ type: "text", name: "id" }, { type: "boolean", name: "hide" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", panelsPerPage: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "boolean", name: "hide" }] }
      ]
    });
    survey.data = { rec: records(20, (i: number) => ({ id: i })) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    expect(a.visiblePanelCount, "#1").toBe(20);
    b.pageIndex = 2;
    b.panels[1].getQuestionByName("hide").value = true;
    expect(a.getDataList().isRecordVisible(11), "#2: record 11 is hidden in A").toBe(false);
    expect(a.visiblePanelCount, "#3").toBe(19);
  });
  test("(k) getDisplayValue: the created question for a record on the page, the template question for the others", () => {
    const choices = [{ value: 1, text: "red" }, { value: 2, text: "blue" }];
    const question = createPanel({ panelsPerPage: 20, templateElements: [{ type: "text", name: "id" }, { type: "dropdown", name: "color", choices: choices }] },
      records(100, (i: number) => ({ id: i, color: i % 2 + 1 })));
    question.panels;
    const display = question.getDisplayValue(true);
    expect(display[3].color, "#1: page 0, its own question").toBe("blue");
    expect(display[73].color, "#2: an unopened page, the template question").toBe("blue");
    expect(display[2].color, "#3").toBe(display[72].color);
    const matrix = createMatrix({ rowsPerPage: 20, columns: [{ name: "id", cellType: "text" }, { name: "color", cellType: "dropdown", choices: choices }] },
      records(100, (i: number) => ({ id: i, color: i % 2 + 1 })));
    matrix.visibleRows;
    const mdisplay = matrix.getDisplayValue(true);
    expect(mdisplay[3].color, "#4: the matrix, a row").toBe("blue");
    expect(mdisplay[73].color, "#5: the column's templateQuestion").toBe("blue");
  });
  test("(k) the recorded gap: getPlainData covers the current page only", () => {
    const question = createPanel({ panelsPerPage: 20 }, records(100));
    expect(question.getPlainData().data.length, "#1: the page, not the 100 records").toBe(20);
    const matrix = createMatrix({ rowsPerPage: 20 }, records(100));
    expect(matrix.getPlainData().data.length, "#2").toBe(20);
  });
  test("(k2) display values on the live path build no panel per keystroke", () => {
    const survey = createPanelSurvey({ panelsPerPage: 20 }, records(100),
      [{ type: "html", name: "echo", html: "{pd}" }, { type: "expression", name: "shown", expression: "displayValue('pd')" }]);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const html = survey.getQuestionByName("echo");
    question.panels;
    const spy = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createNewPanel");
    const name = question.panels[0].getQuestionByName("name");
    ["a", "ab", "abc"].forEach(text => {
      name.value = text;
      html.locHtml.renderedHtml;
    });
    expect(spy.mock.calls.length, "#1: no panel for an off-page record").toBe(0);
    expect(survey.getValue("shown").length, "#2: the expression saw every record").toBe(100);
    spy.mockRestore();
  });
  test("(k3) a choicesByUrl label: the raw value before the answer, the cached label after, and no read starts a request", () => {
    const pending: Array<() => void> = [];
    const proto: any = ChoicesRestful.prototype;
    const sendRequest = proto.sendRequest;
    proto.sendRequest = function (): void {
      this.beforeSendRequest();
      const hash = this.objHash;
      pending.push(() => {
        this.beforeLoadRequest();
        this.onLoad([{ value: 1, text: "red" }, { value: 2, text: "blue" }], hash);
      });
    };
    ChoicesRestful.clearCache();
    const cache = settings.web.cacheLoadedChoices;
    settings.web.cacheLoadedChoices = true;
    try {
      const question = createPanel({ panelsPerPage: 20, templateElements: [{ type: "text", name: "id" },
        { type: "dropdown", name: "color", choicesByUrl: { url: "http://test/colors", valueName: "value", titleName: "text" } }] },
      records(100, (i: number) => ({ id: i, color: 2 })));
      question.panels;
      const requests = pending.length;
      expect(question.getDisplayValue(true)[70].color, "#1: raw before the answer").toBe(2);
      expect(pending.length, "#2: the read started no request").toBe(requests);
      pending.splice(0, pending.length).forEach(answer => answer());
      expect(question.getDisplayValue(true)[70].color, "#3: the cached label after").toBe("blue");
      expect(pending.length, "#4: nor did this one").toBe(0);
    } finally {
      proto.sendRequest = sendRequest;
      settings.web.cacheLoadedChoices = cache;
      ChoicesRestful.clearCache();
    }
  });
  test("(n) a page visit disposes the panels it replaces: no dropdown stays registered with its array source", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panParticipant", templateElements: [{ type: "text", name: "pname" }] },
        { type: "paneldynamic", name: "pd", panelsPerPage: 20, templateElements: [{ type: "text", name: "id" },
          { type: "dropdown", name: "who", choicesFromQuestion: "panParticipant", choiceValuesFromQuestion: "pname" }] }
      ]
    });
    survey.data = { panParticipant: [{ pname: "a" }, { pname: "b" }], pd: records(100) };
    const source = <QuestionPanelDynamicModel>survey.getQuestionByName("panParticipant");
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const touch = (): void => { question.panels.forEach(p => (<any>p.getQuestionByName("who")).visibleChoices); };
    touch();
    for (let i = 0; i < 10; i++) {
      question.pageIndex = 4;
      touch();
      question.pageIndex = 0;
      touch();
    }
    question.pageIndex = 4;
    touch();
    // The template's own dropdown is registered as well; it lives as long as the question does.
    const templateWho = question.template.getQuestionByName("who");
    const dependents = (<any>source).dependedQuestions.filter((q: Question) => q !== templateWho);
    expect(dependents.length, "#1: the dropdowns of the current page").toBe(20);
    const spy = vi.spyOn(<any>Object.getPrototypeOf(templateWho), "updateDependedQuestion");
    survey.setValue("panParticipant", [{ pname: "z" }, { pname: "y" }]);
    const calls = spy.mock.contexts.filter((q: any) => q !== templateWho).length;
    expect(calls, "#2: a write reaches each of them once").toBe(20);
    spy.mockRestore();
  });
});

describe("Page window: events, adding and removing", () => {
  test("(o) onDynamicPanelAdded/Removed: the first build notifies the page, a page change nothing, add and remove one each", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "html", name: "intro", html: "start" }] },
        { elements: [{ type: "paneldynamic", name: "pd", panelsPerPage: 5, templateElements: panelTemplate }] }
      ]
    });
    survey.data = { pd: records(20) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    let added = 0;
    let removed = 0;
    survey.onDynamicPanelAdded.add(() => added++);
    survey.onDynamicPanelRemoved.add(() => removed++);
    survey.currentPageNo = 1;
    expect(added, "#1: the first build, the page's panels").toBe(5);
    question.pageIndex = 1;
    expect(added, "#2: a page change adds no record").toBe(5);
    question.addPanel();
    expect(added, "#3: add").toBe(6);
    question.removePanel(0);
    expect(removed, "#4: remove").toBe(1);
  });
  test("(o) onMatrixRowAdded and onMatrixCellCreated: a page change creates the cells of its rows", () => {
    const survey = createMatrixSurvey({ rowsPerPage: 5 }, records(20));
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    let rowsAdded = 0;
    let cells = 0;
    survey.onMatrixRowAdded.add(() => rowsAdded++);
    survey.onMatrixCellCreated.add(() => cells++);
    matrix.visibleRows;
    expect(cells, "#1: the first page, 5 rows of 2 cells").toBe(10);
    matrix.pageIndex = 1;
    expect(cells, "#2: a page change creates the cells of its rows").toBe(20);
    expect(rowsAdded, "#3: and adds no row").toBe(0);
    matrix.addRow();
    expect(rowsAdded, "#4").toBe(1);
    expect(matrix.pageIndex, "#5: the page of the added record").toBe(4);
  });
  test("(o) remote: the event counts are the ones they were before the page window", async () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, panelCount: 0 });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    let added = 0;
    let removed = 0;
    survey.onDynamicPanelAdded.add(() => added++);
    survey.onDynamicPanelRemoved.add(() => removed++);
    question.panels;
    question.dataSource = new PagedSource(records(20));
    await flush();
    expect(added, "#1: a read fires nothing").toBe(0);
    question.goToPage(1);
    await flush();
    expect(added, "#2").toBe(0);
    question.addPanel();
    await flush();
    expect(added, "#3: add").toBe(1);
    question.removePanel(0);
    await flush();
    expect(removed, "#4: remove").toBe(1);
    const msurvey = createMatrixSurvey({ rowsPerPage: 5 });
    const matrix = <QuestionMatrixDynamicModel>msurvey.getQuestionByName("md");
    let cells = 0;
    msurvey.onMatrixCellCreated.add(() => cells++);
    matrix.dataSource = new PagedSource(records(20));
    await flush();
    matrix.visibleRows;
    expect(cells, "#5: the window, 5 rows of 2 cells").toBe(10);
    matrix.goToPage(1);
    await flush();
    matrix.visibleRows;
    expect(cells, "#6: a read creates the cells of the window").toBe(20);
  });
  test("(l) removePanel(n) and removeRow(n) take a pageVisibleIndex: on page 3, 2 is record 62; the page is refilled", () => {
    const question = createPanel({ panelsPerPage: 20 }, records(100));
    question.pageIndex = 3;
    question.removePanel(2);
    expect(question.value.map(r => r.id).indexOf(62), "#1: record 62 is gone").toBe(-1);
    expect(panelIds(question), "#2: the page is refilled from the next one").toEqual([60, 61].concat(range(63, 80)));
    const matrix = createMatrix({ rowsPerPage: 20 }, records(100));
    matrix.pageIndex = 3;
    matrix.removeRow(2);
    expect(matrix.value.map(r => r.id).indexOf(62), "#3").toBe(-1);
    expect(rowIds(matrix), "#4").toEqual([60, 61].concat(range(63, 80)));
    const unpaged = createPanel({}, records(100));
    unpaged.removePanel(62);
    expect(unpaged.value.map(r => r.id).indexOf(62), "#5: page size 0, the same record").toBe(-1);
  });
  test("(l) addPanelUI on page 0 appends, moves to the last page and returns the panel that is shown", () => {
    const question = createPanel({ panelsPerPage: 20 }, records(90));
    question.panels;
    const panel = question.addPanelUI();
    expect(question.pageIndex, "#1: the last page").toBe(4);
    expect(question.panelCount, "#2").toBe(91);
    expect(question.renderedPanels.indexOf(panel) > -1, "#3: the returned panel is shown").toBe(true);
    expect(question.panels.indexOf(panel), "#4: the last panel of the last page").toBe(10);
  });
  test("(l2) tab mode, 5 per page, newPanelPosition next: the insert lands on the page of its record", () => {
    const question = createPanel({ displayMode: "tab", panelsPerPage: 5, newPanelPosition: "next" }, records(20));
    question.currentIndex = 7;
    expect(question.pageIndex, "#1: currentIndex moved to page 1").toBe(1);
    const first = question.addPanelUI();
    expect(question.value[8].id, "#2: record 8 is the new one").toBeUndefined();
    expect(question.pageIndex, "#3: it stays on page 1").toBe(1);
    expect(first === question.currentPanel, "#4: the new panel is returned and current").toBe(true);
    expect(question.currentIndex, "#5: its visibleIndex").toBe(8);
    question.currentIndex = 9;
    const second = question.addPanelUI();
    expect(question.value[10].id, "#6: record 10 is the new one").toBeUndefined();
    expect(question.pageIndex, "#7: it landed on page 2").toBe(2);
    expect(second === question.currentPanel, "#8").toBe(true);
    expect(question.currentIndex, "#9").toBe(10);
    question.pageIndex = 1;
    const third = question.addPanel(2);
    expect(question.value[7].id, "#10: inserted before the third panel of page 1").toBeUndefined();
    expect(question.panels[2] === third, "#11").toBe(true);
    const carousel = createPanel({ displayMode: "carousel", newPanelPosition: "next" }, records(20));
    carousel.currentIndex = 7;
    const panel = carousel.addPanelUI();
    expect(carousel.currentIndex, "#12: the carousel shows record 8").toBe(8);
    expect(carousel.value[8].id, "#13").toBeUndefined();
    expect(panel === carousel.currentPanel, "#14").toBe(true);
  });
});

describe("Page window: three indexes", () => {
  const visibleIds = range(0, 99).reverse().filter(i => i % 5 !== 0);
  test("(q) the record index, the visibleIndex and the pageVisibleIndex of the first panel and row of page 2", () => {
    const question = createPanel({
      panelsPerPage: 20, sortBy: "id-", templateVisibleIf: "{panel.id} % 5 != 0",
      templateElements: [{ type: "text", name: "id" }, { type: "expression", name: "rec", expression: "{panelIndex}" },
        { type: "expression", name: "vis", expression: "{visiblePanelIndex}" }]
    }, records(100));
    question.pageIndex = 1;
    const panel = question.panels[0];
    expect(panel.getQuestionByName("id").value, "#1").toBe(visibleIds[20]);
    expect(panel.getQuestionByName("rec").value, "#2: the record index").toBe(visibleIds[20]);
    expect(panel.getQuestionByName("vis").value, "#3: the visibleIndex").toBe(20);
    expect((<any>panel.data).visibleIndex, "#4").toBe(20);
    expect((<any>panel.data).pageVisibleIndex, "#5: the pageVisibleIndex").toBe(0);
    const matrix = createMatrix({
      rowsPerPage: 20, sortBy: "id-", rowsVisibleIf: "{row.id} % 5 != 0",
      columns: [{ name: "id", cellType: "text" }, { name: "rec", cellType: "expression", expression: "{rowIndex}" }]
    }, records(100));
    matrix.pageIndex = 1;
    const row = matrix.visibleRows[0];
    expect(row.getQuestionByName("id").value, "#6").toBe(visibleIds[20]);
    expect(row.getQuestionByName("rec").value, "#7: {rowIndex} is 1-based").toBe(visibleIds[20] + 1);
    expect(row.visibleIndex, "#8").toBe(20);
    expect(row.pageVisibleIndex, "#9").toBe(0);
  });
  test("(q) currentIndex is a visibleIndex: 45 moves to page 2 and selects pageVisibleIndex 5", () => {
    const question = createPanel({ displayMode: "tab", panelsPerPage: 20, sortBy: "id-", templateVisibleIf: "{panel.id} % 5 != 0" }, records(100));
    question.currentIndex = 45;
    expect(question.pageIndex, "#1").toBe(2);
    expect((<any>question.currentPanel.data).pageVisibleIndex, "#2").toBe(5);
    expect(question.currentPanel.getQuestionByName("id").value, "#3").toBe(visibleIds[45]);
    expect(question.currentIndex, "#4").toBe(45);
    const unpaged = createPanel({ templateVisibleIf: "{panel.id} % 5 != 0" }, records(20));
    unpaged.visiblePanels.forEach(p => {
      expect((<any>p.data).visibleIndex, "#5: without paging the two are one").toBe((<any>p.data).pageVisibleIndex);
    });
  });
  test("(q2) without paging the created and the visible positions keep their meaning, hidden record 0 included", () => {
    const question = createPanel({ templateVisibleIf: "{panel.id} != 0" }, records(5));
    expect(question.getItem(0).getAllValues().id, "#1: getItem takes a created position").toBe(0);
    question.addPanel(1);
    expect(question.value.map(r => r.id), "#2: addPanel(1) inserts before created position 1").toEqual([0, undefined, 1, 2, 3, 4]);
    question.removePanel(0);
    expect(question.value.map(r => r.id), "#3: removePanel(0) takes a visible position").toEqual([0, 1, 2, 3, 4]);
    const matrix = createMatrix({ rowsVisibleIf: "{row.id} != 0" }, records(5));
    matrix.visibleRows;
    expect(matrix.getRowValue(0).id, "#4: getRowValue takes a created position").toBe(0);
    matrix.setRowValue(0, { id: 1, name: "x" });
    expect(matrix.value[1].name, "#5: setRowValue takes a visible position").toBe("x");
    matrix.moveRowByIndex(0, 1);
    expect(matrix.value.map(r => r.id), "#6: moveRowByIndex takes created positions").toEqual([1, 0, 2, 3, 4]);
  });
  test("(q2) under paging the created position equals the pageVisibleIndex on every page, hidden records present", () => {
    const question = createPanel({ panelsPerPage: 5, templateVisibleIf: "{panel.id} % 3 != 0" }, records(30));
    for (let page = 0; page < question.pageCount; page++) {
      question.pageIndex = page;
      expect(question.panels.length, "#1: page " + page).toBe(question.visiblePanels.length);
      question.panels.forEach((p, i) => expect(p === question.visiblePanels[i], "#2: page " + page).toBe(true));
    }
  });
});

describe("Page window: carousel, tab and design mode", () => {
  test("(m) a carousel pages one panel at a time, whatever panelsPerPage says", () => {
    const spy = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createNewPanel");
    const question = createPanel({ displayMode: "carousel",
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }, records(60));
    expect(question.panels.length, "#1: one panel").toBe(1);
    expect(spy.mock.calls.length, "#2: one created").toBe(1);
    const first = question.currentPanel;
    expect(question.goToNextPanel(), "#3").toBe(true);
    expect(question.currentPanel.getQuestionByName("id").value, "#4: record 1").toBe(1);
    expect(first.isDisposed, "#5: the panel it replaced is disposed").toBe(true);
    expect(question.progressText, "#6").toBe("2 of 60");
    question.currentPanel.getQuestionByName("name").value = "";
    expect(question.goToNextPanel(), "#7: an error blocks Next").toBe(false);
    expect(question.currentIndex, "#8").toBe(1);
    question.currentIndex = 50;
    expect(question.currentPanel.getQuestionByName("id").value, "#9: record 50").toBe(50);
    expect(question.currentIndex, "#10: the view position").toBe(50);
    // A carousel adds after its last panel unless newPanelPosition is "next".
    question.currentIndex = 59;
    const added = question.addPanelUI();
    expect(added === question.currentPanel, "#11: add shows and returns the new panel").toBe(true);
    question.panelsPerPage = 20;
    expect(question.panels.length, "#12: panelsPerPage is ignored").toBe(1);
    spy.mockRestore();
  });
  test("(m) Next animates as a move, not as a removal, and the leaving panel is disposed when its animation ends", () => {
    const survey = createPanelSurvey({ displayMode: "carousel" }, records(5));
    survey.css = { paneldynamic: { panelWrapperEnter: "enter", panelWrapperLeave: "leave" } };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const first = question.currentPanel;
    const animation: any = question.panelsAnimation;
    const sync = animation.sync.bind(animation);
    let running: any;
    animation.sync = (val: any): void => { running = val; };
    question["_renderedPanels"] = [first];
    question.goToNextPanel();
    const next = question.currentPanel;
    question["_renderedPanels"] = [first, next];
    const options = question["getPanelsAnimationOptions"]();
    const enterCss = options.getEnterOptions(next).cssClass;
    expect(enterCss.indexOf("sv-pd-animation-removing"), "#1: not a removal: " + enterCss).toBe(-1);
    expect(enterCss.indexOf("sv-pd-animation-left") > -1, "#2: a move forward: " + enterCss).toBe(true);
    expect(first.isDisposed, "#3: still animating").toBe(false);
    animation.sync = sync;
    question["_renderedPanels"] = [first];
    animation.sync(running);
    expect(first.isDisposed, "#4: disposed when the animation ended").toBe(true);
  });
  test("(m) tab mode: an error Complete finds in the 4th panel of page 3 makes currentIndex 18", () => {
    const data = records(20);
    delete data[18].name;
    const survey = createPanelSurvey({ displayMode: "tab", panelsPerPage: 5,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 3;
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(question.currentIndex, "#2").toBe(18);
  });
  test("(m2) tab mode, 5 per page: five panels and tabs; Next and Prev cross the page one record at a time", () => {
    const question = createPanel({ displayMode: "tab", panelsPerPage: 5 }, records(100));
    expect(question.panels.length, "#1").toBe(5);
    expect(question.tabbedMenu.actions.length, "#2").toBe(5);
    question.currentIndex = 4;
    question.goToNextPanel();
    expect(question.pageIndex, "#3").toBe(1);
    expect(question.currentIndex, "#4: the first tab of page 1").toBe(5);
    expect(question.currentPanel === question.panels[0], "#5").toBe(true);
    question.goToPrevPanel();
    expect(question.pageIndex, "#6").toBe(0);
    expect(question.currentPanel === question.panels[4], "#7: the 5th tab of page 0").toBe(true);
    const unpaged = createPanel({ displayMode: "tab" }, records(100));
    expect(unpaged.panels.length, "#8: panelsPerPage 0 builds every panel").toBe(100);
    expect(unpaged.tabbedMenu.actions.length, "#9: and every tab").toBe(100);
  });
  test("(m3) the tab bar is derived from the page and exactly one tab is active", async () => {
    const survey = createPanelSurvey({ displayMode: "tab", panelsPerPage: 5, templateVisibleIf: "{panel.hide} != true",
      templateElements: [{ type: "text", name: "id" }, { type: "boolean", name: "hide" }] }, records(20, (i: number) => ({ id: i })));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const check = (message: string): void => {
      const actions = question.tabbedMenu.actions;
      expect(actions.map(a => a.panelId), message + ": the tabs are the page").toEqual(question.visiblePanels.map(p => p.id));
      const active = actions.filter(a => a.active);
      expect(active.length, message + ": one active tab").toBe(1);
      expect(active[0].panelId, message + ": the current panel's").toBe(question.currentPanel.id);
    };
    check("#1 first build");
    question.addPanel(1);
    check("#2 add");
    question.removePanel(0);
    check("#3 remove");
    question.panels[1].getQuestionByName("hide").value = true;
    check("#4 hide");
    question.sortOrder = [{ field: "id", direction: "desc" }];
    check("#5 sort");
    // The current record - the one added without an id - sorts last, and the tabs follow it there.
    expect(question.tabbedMenu.actions.length, "#6: one tab per panel, not the square of the page").toBe(question.visiblePanels.length);
    question.filterExpression = "{id} > 3";
    check("#7 filter");
    question.pageIndex = 1;
    check("#8 page change");
    question.tabbedMenu.actions[2].action();
    expect(question.currentIndex, "#9: the third tab of page 1").toBe(7);
    const remote = createPanel({ displayMode: "tab", panelsPerPage: 5, panelCount: 0 });
    remote.panels;
    remote.dataSource = new PagedSource(records(20));
    await flush();
    remote.goToPage(1);
    await flush();
    expect(remote.tabbedMenu.actions.map(a => a.panelId), "#10: a remote read").toEqual(remote.visiblePanels.map(p => p.id));
  });
  test("(m3) a tab title from the event's visiblePanelIndex is right after an insert in the middle", () => {
    const survey = createPanelSurvey({ displayMode: "tab" }, records(5));
    survey.onGetDynamicPanelTabTitle.add((sender, options) => { options.title = "T" + (options.visiblePanelIndex + 1); });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.addPanel(2);
    expect(question.tabbedMenu.actions.map(a => a.locTitle.renderedHtml), "#1").toEqual(["T1", "T2", "T3", "T4", "T5", "T6"]);
  });
  test("(m4) design mode with panelsPerPage builds the template only and shows no pager", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "paneldynamic", name: "pd", panelCount: 10, panelsPerPage: 5, templateElements: panelTemplate }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.panels.length, "#1").toBe(1);
    expect(question.panels[0] === question.template, "#2").toBe(true);
    expect(question.pageCount, "#3: no pager").toBe(1);
  });
});

describe("Page window: a data source that pages itself", () => {
  test("(r) navigation counts the visible records: the server total", async () => {
    const question = createPanel({ displayMode: "tab", panelsPerPage: 5, panelCount: 0 });
    question.panels;
    question.dataSource = new PagedSource(records(20));
    await flush();
    question.goToPage(1);
    await flush();
    expect(question.currentIndex, "#1").toBe(5);
    expect(question.visiblePanelCount, "#2: the server total").toBe(20);
    expect(question.isNextButtonVisible, "#3").toBe(true);
    expect(question.progressText, "#4").toBe("6 of 20");
  });
  test("(r) without a total: Next crosses the loaded boundary, the count is the most known, the end stops it", async () => {
    const source = new PagedSource(records(20), false);
    const question = createPanel({ displayMode: "tab", panelsPerPage: 5, panelCount: 0 });
    question.panels;
    question.dataSource = source;
    await flush();
    expect(question.visiblePanelCount, "#1: the records known so far").toBe(5);
    const reads = source.reads.length;
    question.currentIndex = 99;
    expect(question.currentIndex, "#2: clamped to the last known record").toBe(4);
    expect(source.reads.length, "#3: and no read started").toBe(reads);
    expect(question.isNextButtonVisible, "#4: the source has more").toBe(true);
    expect(question.goToNextPanel(), "#5").toBe(true);
    await flush();
    expect(question.currentIndex, "#6").toBe(5);
    expect(question.currentPanel.getQuestionByName("id").value, "#7: record 5 is shown").toBe(5);
    while(question.currentIndex < 19) {
      question.goToNextPanel();
      await flush();
    }
    expect(question.currentPanel.getQuestionByName("id").value, "#8: the last record").toBe(19);
    question.goToNextPanel();
    await flush();
    expect(question.currentIndex, "#9: the end was found and nothing moved").toBe(19);
    expect(question.visiblePanelCount, "#10").toBe(20);
    const carousel = createPanel({ displayMode: "carousel", panelCount: 0 });
    carousel.panels;
    carousel.dataSource = new PagedSource(records(20), false);
    await flush();
    carousel.goToNextPanel();
    await flush();
    expect(carousel.currentIndex, "#11: a remote carousel reads one record per move").toBe(1);
    expect(carousel.currentPanel.getQuestionByName("id").value, "#12").toBe(1);
  });
  test("(p) record numbers are the whole list's, in-memory and remote, with and without a total", async () => {
    const title = { templateTitle: "Participant {panelIndex}", panelsPerPage: 5 };
    const inMemory = createPanel(title, records(20));
    inMemory.pageIndex = 2;
    expect(inMemory.panels[0].locTitle.renderedHtml, "#1: in-memory").toBe("Participant 11");
    for (const reportTotal of [true, false]) {
      const source = new PagedSource(records(20), reportTotal);
      const question = createPanel(Object.assign({ panelCount: 0 }, title));
      question.panels;
      question.dataSource = source;
      await flush();
      question.nextPage();
      await flush();
      question.nextPage();
      await flush();
      expect(question.panels[0].locTitle.renderedHtml, "#2: remote, total " + reportTotal).toBe("Participant 11");
      question.panels[0].getQuestionByName("name").value = "written";
      await flush();
      expect(source.updates[source.updates.length - 1][0], "#3: the write reaches record 10").toBe(10);
      const matrixSource = new PagedSource(records(20), reportTotal);
      const matrix = createMatrix({ rowsPerPage: 5, columns: [{ name: "id", cellType: "text" },
        { name: "no", cellType: "expression", expression: "{rowIndex}" }] });
      matrix.dataSource = matrixSource;
      await flush();
      matrix.nextPage();
      await flush();
      matrix.nextPage();
      await flush();
      expect(matrix.visibleRows[0].getQuestionByName("no").value, "#4: the expression cell, total " + reportTotal).toBe(11);
      expect(matrix.visibleRows[0].rowIndex, "#5").toBe(11);
      matrix.removeRow(0);
      await flush();
      expect(matrixSource.removes, "#6: the remove reaches record 10").toEqual([10]);
    }
    const inMemoryMatrix = createMatrix({ rowsPerPage: 5, columns: [{ name: "id", cellType: "text" },
      { name: "no", cellType: "expression", expression: "{rowIndex}" }] }, records(20));
    inMemoryMatrix.pageIndex = 2;
    expect(inMemoryMatrix.visibleRows[0].getQuestionByName("no").value, "#7").toBe(11);
  });
});

describe("Page window: a paged matrix nested in a paged dynamic panel", () => {
  test("(g4) the matrix's edited set survives the rebuild of the outer panel that holds it", () => {
    const rows = (): Array<any> => records(12, (i: number) => ({ a: "a" + i }));
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", panelsPerPage: 2,
        templateElements: [{ type: "text", name: "id" }, {
          type: "matrixdynamic", name: "items", rowCount: 0, rowsPerPage: 4,
          columns: [{ name: "a", cellType: "text", isRequired: true }, { name: "b", cellType: "text" }]
        }]
      }]
    });
    survey.data = { outer: records(6, (i: number) => ({ id: i, items: rows() })) };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrixOf = (id: number): QuestionMatrixDynamicModel => {
      const panel = outer.panels.filter(p => p.getQuestionByName("id").value === id)[0];
      return <QuestionMatrixDynamicModel>panel.getQuestionByName("items");
    };
    const matrix = matrixOf(1);
    matrix.pageIndex = 2;
    matrix.visibleRows[1].getQuestionByName("a").value = "";
    matrix.visibleRows[1].getQuestionByName("b").value = "x";
    matrix.pageIndex = 0;
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1) === matrix, "#1: the matrix was rebuilt").toBe(false);
    expect(survey.tryComplete(), "#2: its handed-back set is checked").toBe(false);
    expect(matrixOf(1).pageIndex, "#3: the page of row 9").toBe(2);
    expect(matrixOf(1).visibleRows[1].getQuestionByName("a").errors.length, "#4").toBe(1);
  });
});

describe("Page window: review round 1", () => {
  const results: Array<(res: any) => void> = [];
  function asyncReviewFunc(params: any): any {
    results.push(this.returnResult);
    return false;
  }
  afterEach(() => {
    FunctionFactory.Instance.unregister("asyncReviewFunc");
  });
  const settle = (): void => {
    // A continuation may start validators of its own: settle until nothing is left.
    for (let i = 0; i < 10 && results.length > 0; i++) {
      results.splice(0, results.length).forEach(setResult => setResult(1));
    }
  };
  test("layer 2 goes on to the remaining edited pages once an asynchronous page settles", () => {
    results.length = 0;
    FunctionFactory.Instance.register("asyncReviewFunc", asyncReviewFunc, true);
    const data = records(15);
    delete data[10].name;
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: [{ type: "text", name: "id" },
      { type: "text", name: "name", isRequired: true, validators: [{ type: "expression", expression: "asyncReviewFunc({panel.id}) = 1" }] },
      { type: "text", name: "note" }] }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    question.panels[0].getQuestionByName("note").value = "edited";
    question.pageIndex = 2;
    question.panels[0].getQuestionByName("note").value = "edited";
    question.pageIndex = 0;
    results.length = 0;
    survey.tryComplete();
    settle();
    expect(survey.state, "#1: page 2 was checked after the asynchronous page 1").toBe("running");
    expect(question.pageIndex, "#2: and shown").toBe(2);
    expect(question.panels[0].getQuestionByName("name").errors.length, "#3").toBe(1);
  });
  test("a tab Next validates the panel it leaves only: the other edited records of the page stay tracked", () => {
    const data = records(20);
    delete data[3].name;
    const survey = createPanelSurvey({ displayMode: "tab", panelsPerPage: 5,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }] }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.currentIndex = 3;
    question.currentPanel.getQuestionByName("note").value = "edited";
    question.currentIndex = 0;
    expect(question.goToNextPanel(), "#1").toBe(true);
    question.pageIndex = 1;
    expect(survey.tryComplete(), "#2: record 3 is still checked").toBe(false);
    expect(question.currentIndex, "#3").toBe(3);
  });
  test("a sibling's append keeps the edited records of the other question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", panelsPerPage: 5, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", panelsPerPage: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    b.panels[2].getQuestionByName("name").value = "";
    b.pageIndex = 1;
    a.addPanel();
    expect(b.panelCount, "#1").toBe(21);
    expect(survey.tryComplete(), "#2: B still checks record 2").toBe(false);
    expect(b.pageIndex, "#3").toBe(0);
  });
  test("a sibling's insert in front of an edited record moves it along", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", panelsPerPage: 5, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", panelsPerPage: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    b.panels[4].getQuestionByName("name").value = "";
    b.pageIndex = 2;
    a.addPanel(0);
    expect(survey.tryComplete(), "#1: the edited record is record 5 now").toBe(false);
    expect(b.pageIndex, "#2: its page").toBe(1);
    expect(b.panels[0].getQuestionByName("id").value, "#3").toBe(4);
  });
  test("a key named like an Object.prototype member is compared too", () => {
    const data = records(100);
    data[40].name = "__proto__";
    data[70].name = "__proto__";
    const survey = createPanelSurvey({ panelsPerPage: 20, keyName: "name" }, data);
    expect(survey.tryComplete(), "#1: the panel").toBe(false);
    const msurvey = createMatrixSurvey({ rowsPerPage: 20, keyName: "name" }, data);
    (<QuestionMatrixDynamicModel>msurvey.getQuestionByName("md")).visibleRows;
    expect(msurvey.tryComplete(), "#2: the matrix").toBe(false);
  });
  test("a sibling's remove in front of an edited record moves it back", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", panelsPerPage: 5, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", panelsPerPage: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    b.pageIndex = 1;
    b.panels[0].getQuestionByName("name").value = "";
    b.pageIndex = 3;
    a.removePanel(0);
    expect(b.panelCount, "#1").toBe(19);
    expect(survey.tryComplete(), "#2: the edited record is record 4 now").toBe(false);
    expect(b.pageIndex, "#3: its page").toBe(0);
    expect(b.panels[4].getQuestionByName("id").value, "#4").toBe(5);
  });
  test("a sibling's append keeps the edited rows of the other matrix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "A", valueName: "rec", rowCount: 0, rowsPerPage: 5, columns: [{ name: "id", cellType: "text" }] },
        { type: "matrixdynamic", name: "B", valueName: "rec", rowCount: 0, rowsPerPage: 5,
          columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text", isRequired: true }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionMatrixDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionMatrixDynamicModel>survey.getQuestionByName("B");
    b.visibleRows[2].getQuestionByColumnName("name").value = "";
    b.pageIndex = 1;
    a.addRow();
    // A matrix value holds no empty row: the append reaches B with the first cell value.
    a.visibleRows[a.visibleRows.length - 1].getQuestionByColumnName("id").value = 20;
    expect(b.rowCount, "#1").toBe(21);
    expect(survey.tryComplete(), "#2: B still checks record 2").toBe(false);
    expect(b.pageIndex, "#3").toBe(0);
  });
  test("a matrix key named like an Object.prototype member on one page is compared, not thrown on", () => {
    const data = records(10);
    data[2].name = "__proto__";
    data[5].name = "__proto__";
    const survey = createMatrixSurvey({ keyName: "name" }, data);
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("md")).visibleRows;
    expect(survey.tryComplete(), "#1").toBe(false);
  });
});
