import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionDropdownModel } from "../../src/question_dropdown";
import { Question } from "../../src/question";
import { QuestionRecordsModel } from "../../src/question_records";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { settings } from "../../src/settings";
import { IDynamicDataPageState } from "../../src/dynamic-data/dynamic-data-page-validation";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { DragDropMatrixRows } from "../../src/dragdrop/matrix-rows";
import { SurveyTestTargets } from "../../src/tester/test-targets";
import { Helpers } from "../../src/helpers";
import { ItemValue } from "../../src/itemvalue";
import { ChoicesRestful } from "../../src/choicesRestful";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";

// The edited set and the page the page validation keeps for a records question have no public face.
const getPageState = (q: Question): IDynamicDataPageState => (<any>q).getPageState();
const setPageState = (q: Question, state: IDynamicDataPageState): void => { (<any>q).setPageState(state); };

/* With paging on, the panels and rows that exist are the current page, for an in-memory list as for
   a data source that pages itself. */

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
// The panels a dynamic panel creates, counted through onQuestionCreated: one "id" question per panel.
// A question attached again is counted once, the template's own question not at all.
function countCreatedPanels(survey: SurveyModel, name: string = "pd"): () => number {
  const created: Array<Question> = [];
  survey.onQuestionCreated.add((_, options) => {
    const owner = <QuestionPanelDynamicModel>survey.getQuestionByName(name);
    const q = options.question;
    if (q.name === "id" && q.parentQuestion === owner && q.parent !== owner.template && created.indexOf(q) < 0) created.push(q);
  });
  return () => created.length;
}
// The rows a matrix creates, counted through onMatrixCellCreated: one cell of the column per row.
function countCreatedRows(survey: SurveyModel, columnName: string = "id"): () => number {
  let count = 0;
  survey.onMatrixCellCreated.add((_, options) => { if (options.columnName === columnName) count++; });
  return () => count;
}
function range(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}

/* A source that pages itself, the shape a server has: every read is one request with the range. */
// Keyed by "id": a source without keyField is read-only. The records of records() have the id of their position.
class PagedSource implements IDynamicDataSource {
  public reads: Array<IDynamicDataReadRequest> = [];
  public updates: Array<Array<any>> = [];
  public removes: Array<any> = [];
  public capabilities = { paging: true, filtering: true, sorting: true };
  public keyField = "id";
  constructor(public data: Array<any>, public reportTotal: boolean = true) { }
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    this.reads.push(request);
    const take = request.take > 0 ? request.take : this.data.length;
    const res: IDynamicDataReadResult = { records: this.data.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)) };
    if (this.reportTotal) res.total = this.data.length;
    return Promise.resolve(res);
  }
  private indexOfKey(key: any): number {
    return this.data.map(r => r.id).indexOf(key);
  }
  public update(key: any, record: any): Promise<void> {
    this.updates.push([key, record]);
    const at = this.indexOfKey(key);
    if (at > -1)this.data[at] = Object.assign({}, record);
    return Promise.resolve();
  }
  public remove(key: any): Promise<void> {
    this.removes.push(key);
    const at = this.indexOfKey(key);
    if (at > -1)this.data.splice(at, 1);
    return Promise.resolve();
  }
}

describe("Page window: the objects that exist are the page", () => {
  test("paneldynamic: 100 records, 20 per page - 20 panels are created, a page change holds the next 20 records", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "html", name: "intro", html: "start" }] },
        { elements: [{ type: "paneldynamic", name: "pd", panelsPerPage: 20, templateElements: panelTemplate }] }
      ]
    });
    survey.data = { pd: records(100) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const created = countCreatedPanels(survey);
    survey.currentPageNo = 1;
    expect(question.panels.length, "#1: the first page").toBe(20);
    expect(created(), "#2: panels created for the page only").toBe(20);
    question.pageIndex = 3;
    expect(panelIds(question), "#3: records 60-79").toEqual(range(60, 79));
    expect(question.panelCount, "#4: the record count").toBe(100);
    expect(question.value.length, "#5: the value keeps every record").toBe(100);
    expect(question.visiblePanels === question.panelsOnPage, "#6: the page is visiblePanels itself").toBe(true);
  });
  test("matrixdynamic: 100 records, 20 per page - 20 rows are created, a page change holds the next 20 records", () => {
    const matrix = createMatrix({ rowsPerPage: 20 }, records(100));
    const created = countCreatedRows(<SurveyModel>matrix.survey);
    expect(matrix.visibleRows.length, "#1").toBe(20);
    expect(created(), "#2: rows created for the page only").toBe(20);
    matrix.pageIndex = 3;
    expect(rowIds(matrix), "#3: records 60-79").toEqual(range(60, 79));
    expect(matrix.rowCount, "#4").toBe(100);
    expect(matrix.value.length, "#5").toBe(100);
    expect(matrix.visibleRows === matrix.rowsOnPage, "#6: the page is visibleRows itself").toBe(true);
  });
  test("siblings on one valueName: a write through A's page reaches B's panel only when B shows that record", () => {
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
  test("totals: a sum over 100 records with 20 rows per page totals all 100", () => {
    const matrix = createMatrix({
      rowsPerPage: 20,
      columns: [{ name: "id", cellType: "text" }, { name: "amount", cellType: "text", inputType: "number", totalType: "sum" }]
    }, records(100, (i: number) => ({ id: i, amount: i })));
    expect(matrix.visibleRows.length, "#1").toBe(20);
    expect(matrix.totalValue.amount, "#2: 0 + 1 + ... + 99").toBe(4950);
    matrix.pageIndex = 2;
    expect(matrix.totalValue.amount, "#3: a page change does not change it").toBe(4950);
  });
  test("neighbours come from the view: the first panel and row of page 2 read record 19", () => {
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
  test("a key typed on page 0 that repeats an off-page record is reported on value change and on validation", () => {
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
  test("a template change at runtime rebuilds the page only", () => {
    const survey = createPanelSurvey({ panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }, records(5, (i: number) => ({ a: i })));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels;
    question.pageIndex = 1;
    // The template announces its own new question before it holds it.
    const created: Array<Question> = [];
    survey.onQuestionCreated.add((_, options) => {
      const parent = options.question.parent;
      if (options.question.name === "b" && !!parent && parent !== question.template && created.indexOf(options.question) < 0) created.push(options.question);
    });
    question.template.addNewQuestion("text", "b");
    expect(question.pageIndex, "#1").toBe(1);
    expect(question.panels.map(panel => panel.getQuestionByName("a").value), "#2").toEqual([2, 3]);
    expect(question.panels.every(panel => !!panel.getQuestionByName("b")), "#3: every panel of the page has the new question").toBe(true);
    expect(created.length, "#4: one new question per panel of the page").toBe(2);
  });
});

describe("Page window: validation", () => {
  const requiredTemplate = [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }];
  test("a key pair whose records are both off the page is found by Complete, on the later record's page", () => {
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
  test("key pair membership: hidden records do not take part, filtered-out records do but get no error", () => {
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
  test("remote: a key pair outside the loaded window does not block Complete", async () => {
    const data = records(100);
    data[70].name = "n40";
    const survey = createPanelSurvey({ panelsPerPage: 20, keyName: "name", panelCount: 0 });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.dataSource = new PagedSource(data);
    await flush();
    expect(question.panels.length, "#1").toBe(20);
    expect(survey.tryComplete(), "#2").toBe(true);
  });
  test("layer 1: a forward move validates the page it leaves, a move back and a move from code do not", () => {
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
  test("layer 1: the matrix pager, sort and add-row validate the page they leave", () => {
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
  test("layer 2: an invalid edit moved off the page by a sort from code is caught by Complete", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.sortOrder = [{ field: "id", direction: "desc" }];
    expect(panelIds(question).indexOf(5), "#1: record 5 left the page").toBe(-1);
    expectRecordFiveShown(survey, question, "#2");
  });
  test("layer 2: an invalid edit moved off the page by a filter is caught by Complete", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.filterExpression = "{id} != 100";
    expect(question.pageIndex, "#1: a filter goes back to page 0").toBe(0);
    expectRecordFiveShown(survey, question, "#2");
  });
  test("layer 2: an invalid edit left on a page that a pageIndex from code leaves is caught by Complete", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: requiredTemplate }, invalidData());
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    editRecordFive(question);
    question.pageIndex = 0;
    expectRecordFiveShown(survey, question, "#1");
  });
  test("layer 2: a record that becomes visible ahead of the page pushes record 5 onto the next one", () => {
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
  test("a record the filter excludes or templateVisibleIf hides is exempt until it comes back", () => {
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
  test("remote: an invalid edit left on page 0 does not block Complete from page 2 (layer 1 only)", async () => {
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
  test("nested paging: the inner edited set is checked by the outer page leave and survives the outer rebuild", () => {
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
  test("a required field empty on a page never opened and never edited does not block Complete", () => {
    const data = records(100);
    delete data[85].name;
    const survey = createPanelSurvey({ panelsPerPage: 20, templateElements: requiredTemplate }, data);
    expect(survey.tryComplete(), "#1: the documented limit").toBe(true);
  });
});

/* A paged question in a dynamic matrix detail panel keeps its page and the records it edited when the
   matrix rebuilds its rows, as one in a paged dynamic panel does: completion validates what the
   respondent edited there, wherever the outer row and the inner page are. */
describe("Paged question in a matrix detail panel keeps its page state across row rebuilds", () => {
  type InnerKind = "panel" | "matrix";
  const innerElement = (kind: InnerKind): any => kind === "panel" ?
    { type: "paneldynamic", name: "items", panelsPerPage: 1, templateElements: [{ type: "text", name: "r", isRequired: true }] } :
    { type: "matrixdynamic", name: "items", rowCount: 0, rowsPerPage: 1, columns: [{ name: "r", cellType: "text", isRequired: true }] };
  const createOuter = (detailElements: Array<any>, rowsPerPage: number = 2): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
    const survey = new SurveyModel({ checkErrorsMode: "onComplete", elements: [{ type: "matrixdynamic", name: "outer", rowCount: 0, rowsPerPage: rowsPerPage,
      columns: [{ name: "id", cellType: "text" }], detailPanelMode: "underRow", detailElements: detailElements }] });
    survey.data = { outer: records(4, (i: number) => ({ id: i, items: [{ r: "x0" }, { r: "x1" }, { r: "x2" }] })) };
    return { survey: survey, matrix: <QuestionMatrixDynamicModel>survey.getQuestionByName("outer") };
  };
  const rowOf = (matrix: QuestionMatrixDynamicModel, id: number): any => matrix.visibleRows.filter(row => row.getQuestionByName("id").value === id)[0];
  const innerOf = (matrix: QuestionMatrixDynamicModel, id: number): any => {
    const row = rowOf(matrix, id);
    row.showDetailPanel();
    return row.detailPanel.getQuestionByName("items");
  };
  const innerObjects = (inner: any): Array<any> => inner instanceof QuestionMatrixDynamicModel ? inner.visibleRows : inner.panels;
  // The respondent opens row 0's detail panel, sets the inner page to 1 and empties the required field there.
  const emptyOnInnerPage1 = (matrix: QuestionMatrixDynamicModel): void => {
    const inner = innerOf(matrix, 0);
    inner.pageIndex = 1;
    innerObjects(inner)[0].getQuestionByName("r").value = "";
  };
  const expectErrorShown = (matrix: QuestionMatrixDynamicModel, step: string): void => {
    expect(matrix.pageIndex, step + ": the outer page that holds the record").toBe(0);
    const row = rowOf(matrix, 0);
    expect(row.isDetailPanelShowing, step + ": its detail panel is open").toBe(true);
    const inner = row.detailPanel.getQuestionByName("items");
    expect(inner.pageIndex, step + ": the inner page of the edited record").toBe(1);
    expect(innerObjects(inner)[0].getQuestionByName("r").errors.length, step + ": the error is on the emptied question").toBe(1);
  };
  (<Array<InnerKind>>["panel", "matrix"]).forEach((kind: InnerKind): void => {
    test(kind + " inside: an outer round trip brings the inner page back, and completion fails", () => {
      const { survey, matrix } = createOuter([innerElement(kind)]);
      emptyOnInnerPage1(matrix);
      matrix.pageIndex = 1;
      matrix.pageIndex = 0;
      expect(innerOf(matrix, 0).pageIndex, "#1: the inner page").toBe(1);
      expect(survey.tryComplete(), "#2").toBe(false);
      expectErrorShown(matrix, "#3");
    });
    test(kind + " inside: an outer round trip, then the inner page to 0: the edited record is off the inner page, and completion fails", () => {
      const { survey, matrix } = createOuter([innerElement(kind)]);
      emptyOnInnerPage1(matrix);
      matrix.pageIndex = 1;
      matrix.pageIndex = 0;
      innerOf(matrix, 0).pageIndex = 0;
      expect(survey.tryComplete(), "#1").toBe(false);
      expectErrorShown(matrix, "#2");
    });
    test(kind + " inside: the outer matrix left on its next page: the outer row is off the page, and completion fails", () => {
      const { survey, matrix } = createOuter([innerElement(kind)]);
      emptyOnInnerPage1(matrix);
      matrix.pageIndex = 1;
      expect(survey.tryComplete(), "#1").toBe(false);
      expectErrorShown(matrix, "#2: completion shows the page with the error");
    });
    test(kind + " inside: the inner page to 0, then the outer matrix left on its next page: both levels off the page, and completion fails", () => {
      const { survey, matrix } = createOuter([innerElement(kind)]);
      emptyOnInnerPage1(matrix);
      innerOf(matrix, 0).pageIndex = 0;
      matrix.pageIndex = 1;
      expect(survey.tryComplete(), "#1").toBe(false);
      expectErrorShown(matrix, "#2");
    });
  });
  test("the detail panel closed and reopened keeps the inner page and the edited records", () => {
    const { survey, matrix } = createOuter([innerElement("panel")]);
    emptyOnInnerPage1(matrix);
    rowOf(matrix, 0).hideDetailPanel(true);
    expect(rowOf(matrix, 0).detailPanel, "#1: the panel is dropped").toBeFalsy();
    const inner = innerOf(matrix, 0);
    expect(inner.pageIndex, "#2: the inner page").toBe(1);
    inner.pageIndex = 0;
    expect(survey.tryComplete(), "#3: the edited record is checked").toBe(false);
    expectErrorShown(matrix, "#4");
  });
  test("the kept state follows its outer record when a row is moved, and goes with a removed one", () => {
    const moved = createOuter([innerElement("panel")]);
    emptyOnInnerPage1(moved.matrix);
    moved.matrix.pageIndex = 1;
    moved.matrix.pageIndex = 0;
    moved.matrix.moveRowByIndex(0, 1);
    expect(moved.matrix.value.map((r: any) => r.id), "#1").toEqual([1, 0, 2, 3]);
    expect(innerOf(moved.matrix, 0).pageIndex, "#2: the state moved with record 0").toBe(1);
    expect(innerOf(moved.matrix, 1).pageIndex, "#3").toBe(0);
    expect(moved.survey.tryComplete(), "#4").toBe(false);
    const removed = createOuter([innerElement("panel")]);
    emptyOnInnerPage1(removed.matrix);
    removed.matrix.pageIndex = 1;
    removed.matrix.pageIndex = 0;
    removed.matrix.removeRow(0);
    expect(removed.matrix.value.map((r: any) => r.id), "#5").toEqual([1, 2, 3]);
    expect(innerOf(removed.matrix, 1).pageIndex, "#6: the record now first does not take the removed record's state").toBe(0);
    expect(removed.survey.tryComplete(), "#7: nothing edited is left").toBe(true);
  });
  test("a rebuild keeps no page state without a nested paged question", () => {
    const unpaged = createOuter([{ type: "text", name: "note" }], 0);
    unpaged.matrix.visibleRows.forEach(row => row.showDetailPanel());
    unpaged.matrix.sortOrder = [{ field: "id", direction: "desc" }];
    expect(unpaged.matrix.visibleRows.map(row => row.getQuestionByName("id").value), "#1: the rows were rebuilt").toEqual([3, 2, 1, 0]);
    expect((<any>unpaged.matrix)._pageValidation, "#2: no page validation was created").toBeUndefined();
    const plain = createOuter([{ type: "text", name: "note" }]);
    plain.matrix.visibleRows.forEach(row => row.showDetailPanel());
    plain.matrix.pageIndex = 1;
    const validation = (<any>plain.matrix)._pageValidation;
    expect([0, 1, 2, 3].map((i: number) => validation.getNestedStates(i)), "#3: nothing is kept").toEqual([undefined, undefined, undefined, undefined]);
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
  test("the move waits for the validators, the pager is not usable meanwhile, an error stops it", () => {
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
  test("a paged carousel's Next and addPanelUI wait too; the add is observed through onDynamicPanelAdded", () => {
    register();
    const survey = createPanelSurvey({ displayMode: "carousel", panelsPerPage: 1, templateElements: asyncTemplate }, records(5));
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
  test("cancellation: a page from code, a sort or dispose drops the pending move, a late error neither shows nor throws", () => {
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
  test("a paged carousel's Next follows checkErrorsMode", () => {
    const onComplete = setupInvalid("onComplete", false, { displayMode: "carousel", panelsPerPage: 1 });
    expect(onComplete.question.goToNextPanel(), "#1").toBe(true);
    expect(onComplete.question.currentIndex, "#2: moved with the error").toBe(3);
    expect(onComplete.survey.tryComplete(), "#3").toBe(false);
    expect(onComplete.question.currentIndex, "#4").toBe(2);
    const byDefault = setupInvalid("", false, { displayMode: "carousel", panelsPerPage: 1 });
    expect(byDefault.question.goToNextPanel(), "#5").toBe(false);
    expect(byDefault.question.currentIndex, "#6").toBe(2);
  });
  test("without paging, carousel and tab Next and Add validate the current panel whatever checkErrorsMode says", () => {
    ["carousel", "tab"].forEach(mode => {
      const onComplete = setupInvalid("onComplete", false, { displayMode: mode });
      onComplete.question.currentIndex = 2;
      expect(onComplete.question.goToNextPanel(), mode + " #1: Next is refused").toBe(false);
      expect(onComplete.question.currentIndex, mode + " #2: stays on the invalid panel").toBe(2);
      onComplete.question.newPanelPosition = "next";
      expect(onComplete.question.addPanelUI(), mode + " #3: Add is refused").toBeNull();
      expect(onComplete.question.panelCount, mode + " #4: nothing added").toBe(20);
      onComplete.question.currentPanel.getQuestionByName("name").value = "fixed";
      expect(onComplete.question.goToNextPanel(), mode + " #5: valid now").toBe(true);
      expect(onComplete.question.currentIndex, mode + " #6").toBe(3);
    });
  });
});

describe("Page window: records without an object", () => {
  test("templateVisibleIf is evaluated over the records: the page holds visible records only", () => {
    const survey = createPanelSurvey({ panelsPerPage: 20, templateVisibleIf: "{panel.id} % 3 != 0 or {showAll} = true" },
      undefined, [{ type: "boolean", name: "showAll" }]);
    const created = countCreatedPanels(survey);
    survey.data = { pd: records(90) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const visibleIds = range(0, 89).filter(i => i % 3 !== 0);
    expect(panelIds(question), "#1: 20 visible records").toEqual(visibleIds.slice(0, 20));
    expect(question.pageCount, "#2: 60 visible records of 20").toBe(3);
    expect(created() <= 20, "#3: no more than a page of panels, was " + created()).toBe(true);
    const list = question["dataList"];
    question.panels.forEach((panel, i) => {
      expect(panel.isVisible && list.isRecordVisible(visibleIds[i]), "#4: a built panel and its record agree").toBe(true);
    });
    survey.setValue("showAll", true);
    expect(question.pageCount, "#5: the condition is re-evaluated").toBe(5);
    expect(panelIds(question), "#6").toEqual(range(0, 19));
    const matrix = createMatrix({ rowsPerPage: 20, rowsVisibleIf: "{row.id} % 3 != 0" }, records(90));
    expect(rowIds(matrix), "#7: rowsVisibleIf the same way").toEqual(visibleIds.slice(0, 20));
    expect(matrix.pageCount, "#8").toBe(3);
  });
  test("a record changed on a sibling's page updates the hidden flag", () => {
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
    expect(a["dataList"].isRecordVisible(11), "#2: record 11 is hidden in A").toBe(false);
    expect(a.visiblePanelCount, "#3").toBe(19);
  });
  test("getDisplayValue: the created question for a record on the page, the template question for the others", () => {
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
  const titledChoices = [{ value: 1, text: "red" }, { value: 2, text: "blue" }];
  const titledRecords = (): Array<any> => records(4, (i: number) => ({ id: i, color: i % 2 + 1, note: "n" + i }));
  test("paged matrix: a record without a row shows its column titles as keys", () => {
    const matrix = createMatrix({ rowsPerPage: 2, columns: [{ name: "id", cellType: "text" },
      { name: "color", title: "Color", cellType: "dropdown", choices: titledChoices }] }, titledRecords());
    matrix.visibleRows;
    const display = matrix.getDisplayValue(true);
    expect(display[0], "#1: a record on the page, through its row").toEqual({ id: 0, Color: "red", note: "n0" });
    expect(display[3], "#2: a record without a row, through the column").toEqual({ id: 3, Color: "blue", note: "n3" });
    expect(Object.keys(display[3]), "#3: the renamed key goes last, a key without a column keeps its place").toEqual(["id", "note", "Color"]);
    expect(matrix.getDisplayValue(false)[3], "#4: without keysAsText the keys stay").toEqual({ id: 3, color: "blue", note: "n3" });
  });
  test("paged panel: a record without a panel shows its question titles as keys", () => {
    const question = createPanel({ panelsPerPage: 2, templateElements: [{ type: "text", name: "id" },
      { type: "dropdown", name: "color", title: "Color", choices: titledChoices }] }, titledRecords());
    question.panels;
    const display = question.getDisplayValue(true);
    expect(display[0], "#1: a record on the page, through its panel").toEqual({ id: 0, Color: "red", note: "n0" });
    expect(display[3], "#2: a record without a panel, through the template").toEqual({ id: 3, Color: "blue", note: "n3" });
    expect(Object.keys(display[3]), "#3: the renamed key goes last, a key without a question keeps its place").toEqual(["id", "note", "Color"]);
    expect(question.getDisplayValue(false)[3], "#4: without keysAsText the keys stay").toEqual({ id: 3, color: "blue", note: "n3" });
  });
  test("paged panel: a record without a panel reads a key the template lacks through the question that shares its value", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", panelsPerPage: 2, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec",
          templateElements: [{ type: "text", name: "id" }, { type: "dropdown", name: "color", choices: titledChoices }] }
      ]
    });
    survey.data = { rec: records(4, (i: number) => ({ id: i, color: i % 2 + 1 })) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    a.panels;
    expect(b.panels.length, "#1: B does not page").toBe(4);
    const display = a.getDisplayValue(false);
    expect(display[0], "#2: a record on A's page").toEqual({ id: 0, color: "red" });
    expect(display[3], "#3: a record without a panel in A, through B's question for that record").toEqual({ id: 3, color: "blue" });
  });
  test("getPlainData: a paged dynamic panel covers the current page, a paged matrix every visible record", () => {
    const question = createPanel({ panelsPerPage: 20 }, records(100));
    expect(question.getPlainData().data.length, "#1: the page, not the 100 records").toBe(20);
    const matrix = createMatrix({ rowsPerPage: 20 }, records(100));
    expect(matrix.getPlainData().data.length, "#2: the 100 records").toBe(100);
  });
  test("display values on the live path build no panel per keystroke", () => {
    const survey = createPanelSurvey({ panelsPerPage: 20 }, records(100),
      [{ type: "html", name: "echo", html: "{pd}" }, { type: "expression", name: "shown", expression: "displayValue('pd')" }]);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const html = survey.getQuestionByName("echo");
    question.panels;
    const created = countCreatedPanels(survey);
    const name = question.panels[0].getQuestionByName("name");
    ["a", "ab", "abc"].forEach(text => {
      name.value = text;
      html.locHtml.renderedHtml;
    });
    expect(created(), "#1: no panel for an off-page record").toBe(0);
    expect(survey.getValue("shown").length, "#2: the expression saw every record").toBe(100);
  });
  test("a page visit disposes the panels it replaces: no dropdown stays registered with its array source", () => {
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
  });
});

describe("Page window: events, adding and removing", () => {
  test("onDynamicPanelAdded/Removed: the first build notifies the page, a page change nothing, add and remove one each", () => {
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
    question.removePanel(20);
    expect(removed, "#4: remove").toBe(1);
  });
  test("onMatrixRowAdded and onMatrixCellCreated: a page change creates the cells of its rows", () => {
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
  test("remote: a read and a page change fire no panel event, an add and a remove fire one each, a page read creates the cells of its rows", async () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, panelCount: 0 });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    let added = 0;
    let removed = 0;
    survey.onDynamicPanelAdded.add(() => added++);
    survey.onDynamicPanelRemoved.add(() => removed++);
    question.panels;
    // A source that inserts: the add of a source without insert is refused.
    const source = new PagedSource(records(20));
    (<any>source).insert = (record: any): any => Object.assign({ id: 100 }, record);
    question.dataSource = source;
    await flush();
    expect(added, "#1: a read fires nothing").toBe(0);
    question.goToPage(1);
    await flush();
    expect(added, "#2").toBe(0);
    question.addPanel();
    await flush();
    expect(added, "#3: add").toBe(1);
    question.removePanel(5);
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
  test("removePanel(n) and removeRow(n) take a position in the whole view: on page 3, 62 is record 62; the page is refilled", () => {
    const question = createPanel({ panelsPerPage: 20 }, records(100));
    question.pageIndex = 3;
    question.removePanel(62);
    expect(question.value.map(r => r.id).indexOf(62), "#1: record 62 is gone").toBe(-1);
    expect(panelIds(question), "#2: the page is refilled from the next one").toEqual([60, 61].concat(range(63, 80)));
    const matrix = createMatrix({ rowsPerPage: 20 }, records(100));
    matrix.pageIndex = 3;
    matrix.removeRow(62);
    expect(matrix.value.map(r => r.id).indexOf(62), "#3").toBe(-1);
    expect(rowIds(matrix), "#4").toEqual([60, 61].concat(range(63, 80)));
    const unpaged = createPanel({}, records(100));
    unpaged.removePanel(62);
    expect(unpaged.value.map(r => r.id).indexOf(62), "#5: page size 0, the same record").toBe(-1);
  });
  test("addPanelUI on page 0 appends, moves to the last page and returns the panel that is shown", () => {
    const question = createPanel({ panelsPerPage: 20 }, records(90));
    question.panels;
    const panel = question.addPanelUI();
    expect(question.pageIndex, "#1: the last page").toBe(4);
    expect(question.panelCount, "#2").toBe(91);
    expect(question.renderedPanels.indexOf(panel) > -1, "#3: the returned panel is shown").toBe(true);
    expect(question.panels.indexOf(panel), "#4: the last panel of the last page").toBe(10);
  });
  test("tab mode, 5 per page, newPanelPosition next: the insert lands on the page of its record", () => {
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
    const third = question.addPanel(7);
    expect(question.value[7].id, "#10: inserted before the record at position 7, the third panel of page 1").toBeUndefined();
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
  test("the record index, the visibleIndex and the pageVisibleIndex of the first panel and row of page 2", () => {
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
  test("currentIndex is a visibleIndex: 45 moves to page 2 and selects pageVisibleIndex 5", () => {
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
  test("without paging the created and the visible positions keep their meaning, hidden record 0 included", () => {
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
  /* moveRowByIndex leaves the row objects where they are and hands them the reordered records, so a
     row names the record of its position after the move. Rows that named the record they held before
     look stale to the next add, which then rebuilds the whole page. */
  test("matrix: after a move each row names the record of its position, and the next add keeps the rows", () => {
    const matrix = createMatrix({ rowsPerPage: 3 }, records(7));
    matrix.pageIndex = 1;
    const rows = matrix.visibleRows.slice();
    expect(rowIds(matrix), "#1").toEqual([3, 4, 5]);
    matrix.moveRowByIndex(3, 5);
    expect(matrix.value.map(r => r.id), "#2").toEqual([0, 1, 2, 4, 5, 3, 6]);
    expect(rowIds(matrix), "#3: the rows take the reordered records").toEqual([4, 5, 3]);
    expect(matrix.visibleRows.every((row, i) => row === rows[i]), "#4: the same row objects").toBe(true);
    expect(rows.map(row => row.getIndex()), "#5: the record each row names").toEqual([3, 4, 5]);
    const short = createMatrix({ rowsPerPage: 5 }, records(3));
    const shortRows = short.visibleRows.slice();
    short.moveRowByIndex(0, 2);
    short.addRow();
    expect(short.visibleRows.length, "#6: the new row is on the page").toBe(4);
    expect(shortRows.every((row, i) => row === short.visibleRows[i]), "#7: the rows of the page are not rebuilt").toBe(true);
    expect(rowIds(short), "#8").toEqual([1, 2, 0, undefined]);
  });
  test("under paging the created position equals the pageVisibleIndex on every page, hidden records present", () => {
    const question = createPanel({ panelsPerPage: 5, templateVisibleIf: "{panel.id} % 3 != 0" }, records(30));
    for (let page = 0; page < question.pageCount; page++) {
      question.pageIndex = page;
      expect(question.panels.length, "#1: page " + page).toBe(question.visiblePanels.length);
      question.panels.forEach((p, i) => expect(p === question.visiblePanels[i], "#2: page " + page).toBe(true));
    }
  });
});

describe("Page window: carousel, tab and design mode", () => {
  const requiredNameTemplate = [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }];
  test("a carousel without panelsPerPage builds and validates every panel", () => {
    const data = records(6);
    delete data[4].name;
    const survey = createPanelSurvey({ displayMode: "carousel", templateElements: requiredNameTemplate });
    const created = countCreatedPanels(survey);
    survey.data = { pd: data };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.panels.length, "#1: every panel").toBe(6);
    expect(created(), "#2: every panel created").toBe(6);
    expect(question.pageCount, "#3: it does not page").toBe(1);
    expect(question.goToNextPanel(), "#4").toBe(true);
    expect(question.currentPanel === question.panels[1], "#5: Next selects the next panel").toBe(true);
    expect(survey.tryComplete(), "#6: a panel never opened is validated").toBe(false);
    expect(question.currentIndex, "#7: it shows the first invalid panel").toBe(4);
  });
  test("a carousel with panelsPerPage builds only the page and shows one panel of it", () => {
    const survey = createPanelSurvey({ displayMode: "carousel", panelsPerPage: 3, templateElements: requiredNameTemplate });
    const created = countCreatedPanels(survey);
    survey.data = { pd: records(60) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.panels.length, "#1: the page").toBe(3);
    expect(created(), "#2: three created").toBe(3);
    expect(question.renderedPanels.length, "#3: one shown").toBe(1);
    expect(question.progressText, "#4: counted over every record").toBe("1 of 60");
    question.currentIndex = 50;
    expect(question.pageIndex, "#5: the page that holds it").toBe(16);
    expect(question.currentPanel.getQuestionByName("id").value, "#6: record 50").toBe(50);
    expect(question.currentIndex, "#7: the view position").toBe(50);
    expect(question.panels.length, "#8").toBe(3);
    // A carousel adds after its last panel unless newPanelPosition is "next".
    question.currentIndex = 59;
    const added = question.addPanelUI();
    expect(added === question.currentPanel, "#9: add shows and returns the new panel").toBe(true);
    expect(question.currentIndex, "#10").toBe(60);
  });
  test("paged carousel Next and Prev across a page boundary select the right record", () => {
    const question = createPanel({ displayMode: "carousel", panelsPerPage: 3 }, records(9));
    question.currentIndex = 2;
    const first = question.currentPanel;
    expect(question.goToNextPanel(), "#1").toBe(true);
    expect(question.pageIndex, "#2: the next page").toBe(1);
    expect(question.currentIndex, "#3").toBe(3);
    expect(question.currentPanel.getQuestionByName("id").value, "#4: the first record of the page").toBe(3);
    expect(first.isDisposed, "#5: the panel it replaced is disposed").toBe(true);
    question.goToPrevPanel();
    expect(question.pageIndex, "#6: the previous page").toBe(0);
    expect(question.currentIndex, "#7").toBe(2);
    expect(question.currentPanel.getQuestionByName("id").value, "#8: the last record of the page").toBe(2);
  });
  test("paged carousel Next and Prev read the adjacent page from a paging source", async () => {
    const stored = records(9);
    const requests: Array<IDynamicDataReadRequest> = [];
    const answers: Array<(res: IDynamicDataReadResult) => void> = [];
    const source: IDynamicDataSource = {
      capabilities: { paging: true }, keyField: "id",
      read: (request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> => {
        requests.push(request);
        return new Promise<IDynamicDataReadResult>(resolve => answers.push(resolve));
      }
    };
    const answer = (): void => {
      const request = requests[requests.length - 1];
      answers[answers.length - 1]({ records: stored.slice(request.skip, request.skip + request.take), total: stored.length });
    };
    const question = createPanel({ displayMode: "carousel", panelsPerPage: 3 });
    question.dataSource = source;
    answer();
    await flush();
    expect(panelIds(question), "#1").toEqual([0, 1, 2]);
    question.currentIndex = 2;
    expect(question.goToNextPanel(), "#2").toBe(true);
    expect(requests[requests.length - 1].skip, "#3: the next page is read").toBe(3);
    answer();
    await flush();
    expect(question.currentIndex, "#4").toBe(3);
    expect(question.currentPanel.getQuestionByName("id").value, "#5: the first record of the page").toBe(3);
    question.goToPrevPanel();
    expect(requests[requests.length - 1].skip, "#6: the previous page is read").toBe(0);
    answer();
    await flush();
    expect(question.currentIndex, "#7").toBe(2);
    expect(question.currentPanel.getQuestionByName("id").value, "#8: the last record of the page").toBe(2);
  });
  test("completion and page-leave validation of a paged carousel match paged tab mode", () => {
    const run = (mode: string): Array<any> => {
      const data = records(9);
      delete data[1].name;
      delete data[7].name;
      const survey = createPanelSurvey({ displayMode: mode, panelsPerPage: 3, templateElements: requiredNameTemplate }, data);
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      const res: Array<any> = [];
      question.currentIndex = 2;
      res.push(question.goToNextPanel(), question.pageIndex, question.currentIndex);
      question.panels[1].getQuestionByName("name").value = "fixed";
      question.currentIndex = 2;
      res.push(question.goToNextPanel(), question.pageIndex, question.currentIndex);
      res.push(survey.tryComplete());
      return res;
    };
    const tab = run("tab");
    expect(tab, "#1: page 1 is invalid, then valid; page 3 was never opened").toEqual([false, 0, 1, true, 1, 3, true]);
    expect(run("carousel"), "#2: the carousel does the same").toEqual(tab);
  });
  test("while a UI renders the question, the panel Next replaced is disposed after the next rerender", () => {
    const survey = createPanelSurvey({ displayMode: "carousel", panelsPerPage: 1,
      templateElements: [{ type: "text", name: "id" }, { type: "dropdown", name: "kind", choices: ["a", "b"] }] }, records(5));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    // What a UI does when it renders the question: an asynchronous one (Angular) checks the old
    // panel's components once more before it drops them.
    question.enableOnElementRerenderedEvent();
    const first = question.currentPanel;
    const dropdown = <QuestionDropdownModel>first.getQuestionByName("kind");
    expect(question.goToNextPanel(), "#1").toBe(true);
    expect(question.renderedPanels.indexOf(first), "#2: not rendered any more").toBe(-1);
    expect(first.isDisposed, "#3: not disposed before the UI rerendered").toBe(false);
    expect(!!dropdown.dropdownListModel, "#4: a component check still finds its model").toBe(true);
    question.afterRerender();
    expect(first.isDisposed, "#5: disposed after the rerender").toBe(true);
    const second = question.currentPanel;
    question.goToNextPanel();
    expect(second.isDisposed, "#6: waits for the UI again").toBe(false);
    question.disableOnElementRerenderedEvent();
    expect(second.isDisposed, "#7: the UI that stops rendering the question releases it").toBe(true);
  });
  test("while a UI renders the matrix, the rows a page move replaced are disposed after the next rerender", () => {
    const matrix = createMatrix({ rowsPerPage: 3,
      columns: [{ name: "id", cellType: "text" }, { name: "kind", cellType: "dropdown", choices: ["a", "b"] }] }, records(10));
    const oldCell = <QuestionDropdownModel>matrix.visibleRows[0].getQuestionByName("kind");
    matrix.enableOnElementRerenderedEvent();
    matrix.nextPage();
    expect(rowIds(matrix), "#1").toEqual([3, 4, 5]);
    expect(oldCell.isDisposed, "#2: not disposed before the UI rerendered").toBe(false);
    expect(!!oldCell.dropdownListModel, "#3: a component check still finds its model").toBe(true);
    matrix.afterRerender();
    expect(oldCell.isDisposed, "#4: disposed after the rerender").toBe(true);
    const cell = matrix.visibleRows[0].getQuestionByName("kind");
    matrix.nextPage();
    matrix.dispose();
    expect(cell.isDisposed, "#5: disposing the matrix releases the rows that wait").toBe(true);
  });
  test("tab mode: an error Complete finds in the 4th panel of page 3 makes currentIndex 18", () => {
    const data = records(20);
    delete data[18].name;
    const survey = createPanelSurvey({ displayMode: "tab", panelsPerPage: 5,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 3;
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(question.currentIndex, "#2").toBe(18);
  });
  test("tab mode, 5 per page: five panels and tabs; Next and Prev cross the page one record at a time", () => {
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
  test("the tab bar is derived from the page and exactly one tab is active", async () => {
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
  test("a tab title from the event's visiblePanelIndex is right after an insert in the middle", () => {
    const survey = createPanelSurvey({ displayMode: "tab" }, records(5));
    survey.onGetDynamicPanelTabTitle.add((sender, options) => { options.title = "T" + (options.visiblePanelIndex + 1); });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.addPanel(2);
    expect(question.tabbedMenu.actions.map(a => a.locTitle.renderedHtml), "#1").toEqual(["T1", "T2", "T3", "T4", "T5", "T6"]);
  });
  test("design mode with panelsPerPage builds the template only and shows no pager", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "paneldynamic", name: "pd", panelCount: 10, panelsPerPage: 5, templateElements: panelTemplate }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.panels.length, "#1").toBe(1);
    expect(question.panels[0] === question.template, "#2").toBe(true);
    expect(question.pageCount, "#3: no pager").toBe(1);
  });
});

/* Carousel and tab mode keep showing one record across rebuilds of the page: an insert, a remove or
   a move in front of it renumbers it, and the panel of that record stays current. */
describe("Page window: the current panel stays on its record", () => {
  const currentId = (question: QuestionPanelDynamicModel): any => question.currentPanel.getQuestionByName("id").value;
  ["tab", "carousel"].forEach((mode: string): void => {
    test(mode + ": a panel removed in front of the current one", () => {
      const question = createPanel({ displayMode: mode, panelsPerPage: 3 }, records(6));
      question.currentIndex = 2;
      expect(currentId(question), "#1").toBe(2);
      question.removePanel(0);
      expect(currentId(question), "#2: the same record").toBe(2);
      expect(question.currentIndex, "#3: one position earlier").toBe(1);
      expect(panelIds(question), "#4: the page was refilled").toEqual([1, 2, 3]);
    });
  });
  test("tab: removing the current panel in the middle of a page selects the next one", () => {
    const question = createPanel({ displayMode: "tab", panelsPerPage: 3 }, records(6));
    question.currentIndex = 1;
    question.removePanel(1);
    expect(currentId(question), "#1: the next record").toBe(2);
    expect(question.currentIndex, "#2").toBe(1);
    expect(panelIds(question), "#3").toEqual([0, 2, 3]);
  });
  test("tab: removing the current panel at the end of a page selects the previous one", () => {
    const question = createPanel({ displayMode: "tab", panelsPerPage: 3 }, records(6));
    question.currentIndex = 2;
    question.removePanel(2);
    expect(currentId(question), "#1: the previous record").toBe(1);
    expect(question.currentIndex, "#2").toBe(1);
    expect(panelIds(question), "#3").toEqual([0, 1, 3]);
  });
  test("tab without paging: a sort assigned after a remove keeps the current record", () => {
    const removeAndSort = (current: number, removed: number): QuestionPanelDynamicModel => {
      const question = createPanel({ displayMode: "tab" }, records(5));
      question.currentIndex = current;
      question.removePanel(removed);
      question.sortOrder = [{ field: "id", direction: "desc" }];
      return question;
    };
    let question = removeAndSort(2, 2);
    expect(currentId(question), "#1: the current panel removed, the next one took over").toBe(3);
    expect(question.currentIndex, "#2").toBe(1);
    question = removeAndSort(3, 0);
    expect(currentId(question), "#3: a panel removed in front of the current one").toBe(3);
    expect(question.currentIndex, "#4").toBe(1);
  });
  test("tab: a value assigned from outside keeps the current position, as without paging", () => {
    const survey = createPanelSurvey({ displayMode: "tab", panelsPerPage: 3 }, records(6));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.currentIndex = 2;
    const value = records(6);
    value.splice(1, 0, { id: 99, name: "new" });
    survey.setValue("pd", value);
    expect(panelIds(question), "#1").toEqual([0, 99, 1]);
    expect(question.currentIndex, "#2: the position").toBe(2);
    expect(currentId(question), "#3: and the record now at it").toBe(1);
    const unpaged = createPanelSurvey({ displayMode: "tab" }, records(6));
    const unpagedQuestion = <QuestionPanelDynamicModel>unpaged.getQuestionByName("pd");
    unpagedQuestion.currentIndex = 2;
    unpaged.setValue("pd", value);
    expect(unpagedQuestion.currentIndex, "#4: without paging").toBe(2);
    expect(unpagedQuestion.currentPanel.getQuestionByName("id").value, "#5").toBe(1);
  });
});

describe("Page window: a data source that pages itself", () => {
  test("navigation counts the visible records: the server total", async () => {
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
  test("without a total: Next crosses the loaded boundary, the count is the most known, the end stops it", async () => {
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
  test("record numbers are the whole list's, in-memory and remote, with and without a total", async () => {
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
      matrix.removeRow(10);
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
  test("the matrix's edited set survives the rebuild of the outer panel that holds it", () => {
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

describe("Page window: the edited records under siblings, tabs and asynchronous pages", () => {
  const results: Array<(res: any) => void> = [];
  function asyncEditedPageFunc(params: any): any {
    results.push(this.returnResult);
    return false;
  }
  afterEach(() => {
    FunctionFactory.Instance.unregister("asyncEditedPageFunc");
  });
  const settle = (): void => {
    // A continuation may start validators of its own: settle until nothing is left.
    for (let i = 0; i < 10 && results.length > 0; i++) {
      results.splice(0, results.length).forEach(setResult => setResult(1));
    }
  };
  test("layer 2 goes on to the remaining edited pages once an asynchronous page settles", () => {
    results.length = 0;
    FunctionFactory.Instance.register("asyncEditedPageFunc", asyncEditedPageFunc, true);
    const data = records(15);
    delete data[10].name;
    const survey = createPanelSurvey({ panelsPerPage: 5, templateElements: [{ type: "text", name: "id" },
      { type: "text", name: "name", isRequired: true, validators: [{ type: "expression", expression: "asyncEditedPageFunc({panel.id}) = 1" }] },
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

/* An assignment from outside - survey.setValue, a sibling on the same valueName - has the edited set
   follow its records. valueChangedCallback fires inside the assignment, and a write through the list
   made there is an assignment of its own: the outer one still follows its records afterwards. */
describe("Page window: an assignment made while another one is running", () => {
  test("panel: the outer assignment still moves the edited set along", () => {
    const survey = createPanelSurvey({ panelsPerPage: 2, templateElements: [{ type: "text", name: "id" }, { type: "text", name: "a" }] },
      records(6, (i: number) => ({ id: "r" + i })));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    question.panels[1].getQuestionByName("a").value = "x";
    question.pageIndex = 0;
    expect(getPageState(question).edited, "#1: record 3 is edited and off the page").toEqual([3]);
    let calls = 0;
    // Fired inside Question.setQuestionValue: the write through the list is an assignment of its own.
    question.valueChangedCallback = (): void => {
      calls++;
      if (calls === 1) question["dataList"].setValue(0, "a", "zz");
    };
    const data = [].concat(survey.getValue("pd"));
    data.splice(1, 1);
    survey.setValue("pd", data);
    expect(calls, "#2: the outer assignment and the nested one").toBe(2);
    expect(getPageState(question).edited, "#3: the edited record is record 2 now; record 0 was written").toEqual([0, 2]);
  });
  test("matrix: the outer assignment still moves the edited set along", () => {
    const survey = createMatrixSurvey({ rowsPerPage: 2, columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text" }] },
      records(6, (i: number) => ({ id: "r" + i })));
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    question.pageIndex = 1;
    question.visibleRows[1].getQuestionByName("a").value = "x";
    question.pageIndex = 0;
    expect(getPageState(question).edited, "#1: record 3 is edited and off the page").toEqual([3]);
    let calls = 0;
    question.valueChangedCallback = (): void => {
      calls++;
      if (calls === 1) question["dataList"].setValue(5, "a", "zz");
    };
    // Records 2 and 3 change places; the count stays.
    const data = [].concat(survey.getValue("md"));
    data.splice(2, 2, data[3], data[2]);
    survey.setValue("md", data);
    expect(calls, "#2: the outer assignment and the nested one").toBe(2);
    /* Wider than the panel's: the nested write changed a record of the part the content remap
       compares, so the change cannot be placed and the whole changed part is marked. */
    expect(getPageState(question).edited, "#3").toEqual([2, 3, 4, 5]);
    expect(getPageState(question).edited.indexOf(2) > -1, "#4: the index the edited record has now").toBe(true);
  });
});

// A question without a data source has every capability, and asking it does not create its list.
describe("Page window: the capabilities of a question without a list", () => {
  test("matrix: canAddRow, canRemoveRows and isMatrixReadOnly create no list", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 2, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(question.canAddRow, "#1").toBe(true);
    expect(question.canRemoveRows, "#2").toBe(true);
    expect(question.isMatrixReadOnly(), "#3").toBe(false);
    expect(!!(<any>question).dataListValue, "#4: the reads created nothing").toBe(false);
  });
  test("panel: canAddPanel and canRemovePanel create no list", () => {
    const question = new QuestionPanelDynamicModel("panel");
    question.template.addNewQuestion("text", "col1");
    expect(question.canAddPanel, "#1").toBe(true);
    expect(question.canRemovePanel, "#2: there is no panel to remove").toBe(false);
    expect(!!(<any>question).dataListValue, "#3: the reads created nothing").toBe(false);
  });
});

/* Only a full validation that fires its callbacks visits the pages that hold edited records (layer
   2); a validation on a value change and a quiet one stay on the page. */
describe("Page window: which validation visits the pages of the edited records", () => {
  [false, true].forEach((isMatrix: boolean): void => {
    const kind = isMatrix ? "matrix" : "panel";
    const setup = (checkErrorsMode?: string): { survey: SurveyModel, question: any, editOnPage: () => void } => {
      const data = records(12);
      const json = { templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }],
        columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text", isRequired: true }, { name: "note", cellType: "text" }] };
      const survey = isMatrix ? createMatrixSurvey(Object.assign({ rowsPerPage: 5 }, { columns: json.columns }), data)
        : createPanelSurvey(Object.assign({ panelsPerPage: 5 }, { templateElements: json.templateElements }), data);
      if (!!checkErrorsMode) survey.checkErrorsMode = <any>checkErrorsMode;
      const question: any = survey.getQuestionByName(isMatrix ? "md" : "pd");
      const objects = (): Array<any> => isMatrix ? question.visibleRows : question.panels;
      question.pageIndex = 1;
      objects()[1].getQuestionByName("name").value = "";
      question.pageIndex = 0;
      expect(getPageState(question).edited, "an invalid edited record off the page").toEqual([6]);
      return { survey: survey, question: question, editOnPage: (): void => { objects()[0].getQuestionByName("note").value = "typed"; } };
    };
    test(kind + ": a validation on a value change stays on the page", () => {
      const { question, editOnPage } = setup("onValueChanged");
      editOnPage();
      expect(question.pageIndex, "#1: an edit on the page, the page stays").toBe(0);
      expect(getPageState(question).edited, "#2").toEqual([0, 6]);
      const value = question.value.map((record: any): any => Object.assign({}, record));
      value[1].note = "assigned";
      question.value = value;
      expect(question.pageIndex, "#3: an assignment of the value, the page stays").toBe(0);
      expect(getPageState(question).edited, "#4").toEqual([0, 6]);
    });
    test(kind + ": a validation that fires no callback stays on the page", () => {
      const { question } = setup();
      expect(question.validate(false), "#1: the page has no error").toBe(true);
      expect(question.pageIndex, "#2: the page stays").toBe(0);
      expect(question.validate(true), "#3: a full validation finds the edited record").toBe(false);
      expect(question.pageIndex, "#4: on its page").toBe(1);
    });
  });
});

/* A paged matrix nested in a paged dynamic panel hands its page and its edited set to the outer
   question when the outer panel is rebuilt, and gets them back in the new panel. */
describe("Page window: the page state of a nested paged matrix", () => {
  const nestedJson = {
    elements: [{
      type: "paneldynamic", name: "outer", panelsPerPage: 2,
      templateElements: [{ type: "text", name: "id" }, {
        type: "matrixdynamic", name: "items", rowCount: 0, rowsPerPage: 4,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]
      }]
    }]
  };
  test("the matrix comes back on its page with its edited set, and one on page 0 stays there", () => {
    const survey = new SurveyModel(nestedJson);
    survey.data = { outer: records(6, (i: number) => ({ id: i, items: records(12, (j: number) => ({ a: "a" + j })) })) };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrixOf = (id: number): QuestionMatrixDynamicModel => {
      const panel = outer.panels.filter(p => p.getQuestionByName("id").value === id)[0];
      return <QuestionMatrixDynamicModel>panel.getQuestionByName("items");
    };
    const matrix = matrixOf(1);
    const other = matrixOf(0);
    matrix.pageIndex = 2;
    matrix.visibleRows[1].getQuestionByName("b").value = "x";
    expect(getPageState(matrix), "#1").toEqual({ pageIndex: 2, edited: [9], nested: {} });
    expect(getPageState(other), "#2").toEqual({ pageIndex: 0, edited: [], nested: {} });
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1) === matrix, "#3: the matrix was rebuilt").toBe(false);
    expect(matrixOf(1).pageIndex, "#4: on its page again").toBe(2);
    expect(getPageState(matrixOf(1)), "#5: with its edited set").toEqual({ pageIndex: 2, edited: [9], nested: {} });
    expect(matrixOf(1).visibleRows[1].getQuestionByName("b").value, "#6").toBe("x");
    expect(matrixOf(0) === other, "#7").toBe(false);
    expect(matrixOf(0).pageIndex, "#8: page 0 stays page 0").toBe(0);
    expect(getPageState(matrixOf(0)), "#9").toEqual({ pageIndex: 0, edited: [], nested: {} });
  });
  test("an outside assignment that inserts a record in front of the page keeps the matrix of each record on its page", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "p", panelsPerPage: 1,
        templateElements: [{ type: "text", name: "id" }, { type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 1, columns: [{ name: "a", cellType: "text" }] }]
      }]
    });
    const r0 = { id: "r0", m: [{ a: "r0-0" }, { a: "r0-1" }, { a: "r0-2" }] };
    const r1 = { id: "r1", m: [{ a: "r1-0" }, { a: "r1-1" }] };
    survey.data = { p: [r0, r1] };
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const shown = (): Array<any> => {
      const panel = p.panels[0];
      const m = <QuestionMatrixDynamicModel>panel.getQuestionByName("m");
      return [panel.getQuestionByName("id").value, m.pageIndex];
    };
    (<QuestionMatrixDynamicModel>p.panels[0].getQuestionByName("m")).pageIndex = 2;
    p.pageIndex = 1;
    expect(shown(), "#1").toEqual(["r1", 0]);
    survey.setValue("p", [{ id: "x", m: [{ a: "x-0" }] }, r0, r1]);
    expect(shown(), "#2: page 1 holds r0 now, with its matrix on its page").toEqual(["r0", 2]);
    p.pageIndex = 2;
    expect(shown(), "#3").toEqual(["r1", 0]);
    p.pageIndex = 1;
    expect(shown(), "#4: r0's matrix is still on its page").toEqual(["r0", 2]);
    p.pageIndex = 0;
    expect(shown(), "#5: the inserted record starts on page 0").toEqual(["x", 0]);
  });
  test("a state with page 0 leaves the page alone and does not drop a move that waits for its validators", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("asyncPageStateFunc", function (): any {
      results.push(this.returnResult);
      return false;
    }, true);
    try {
      const question = createMatrix({
        rowsPerPage: 2,
        columns: [{ name: "id", cellType: "text", validators: [{ type: "expression", expression: "asyncPageStateFunc() = 1" }] },
          { name: "name", cellType: "text" }]
      }, records(6));
      expect(question.visibleRows.length, "#1: the page is built").toBe(2);
      expect(question.nextPage(), "#2").toBe(true);
      expect(question.isPageMovePending, "#3: the move waits for its validators").toBe(true);
      setPageState(question, { pageIndex: 0, edited: [4], nested: {} });
      expect(question.isPageMovePending, "#4: still pending").toBe(true);
      expect(getPageState(question).edited, "#5: the edited set was taken").toEqual([4]);
      results.splice(0, results.length).forEach(setResult => setResult(1));
      expect(question.isPageMovePending, "#6").toBe(false);
      expect(question.pageIndex, "#7: the late result moves the page").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("asyncPageStateFunc");
    }
  });
});

/* The matrix scans every unique column for a pair both of whose records have no row: owner-hidden
   records take part, strings compare as the matrix's useCaseSensitiveComparison says, and a padded
   record is read as the default row value it will get. */
describe("Page window: matrix duplicates off the page", () => {
  test("every unique column is scanned: the pages of both pairs are visited in page order", () => {
    const data = records(20, (i: number) => ({ id: "k" + i, name: "n" + i }));
    data[13].name = "n8";
    data[17].id = "k16";
    const survey = createMatrixSurvey({ rowsPerPage: 5, keyName: "name",
      columns: [{ name: "id", cellType: "text", isUnique: true }, { name: "name", cellType: "text" }] }, data);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2: the keyName pair goes on page 2").toBe(2);
    expect(matrix.visibleRows[3].getQuestionByName("name").errors.length, "#3: on record 13").toBe(1);
    matrix.visibleRows[3].getQuestionByName("name").value = "n13";
    matrix.pageIndex = 0;
    expect(survey.tryComplete(), "#4").toBe(false);
    expect(matrix.pageIndex, "#5: the isUnique pair is on page 3").toBe(3);
    expect(matrix.visibleRows[2].getQuestionByName("id").errors.length, "#6: on record 17").toBe(1);
  });
  test("strings compare as useCaseSensitiveComparison says", () => {
    const create = (caseSensitive: boolean): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
      const data = records(20);
      data[17].name = "N12";
      const survey = createMatrixSurvey({ rowsPerPage: 5, keyName: "name" }, data);
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
      matrix.useCaseSensitiveComparison = caseSensitive;
      matrix.visibleRows;
      return { survey: survey, matrix: matrix };
    };
    const insensitive = create(false);
    expect(insensitive.survey.tryComplete(), "#1: n12 and N12 are a pair").toBe(false);
    expect(insensitive.matrix.pageIndex, "#2").toBe(3);
    const sensitive = create(true);
    expect(sensitive.survey.tryComplete(), "#3: they differ").toBe(true);
  });
  test("an owner-hidden record does not take part, as a hidden row does not without paging", () => {
    const data = records(20, (i: number) => ({ id: i, name: "n" + i, hide: i === 17 }));
    data[17].name = "n12";
    const survey = createMatrixSurvey({ rowsPerPage: 5, keyName: "name", rowsVisibleIf: "{row.hide} != true" }, data);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    expect(matrix["dataList"].visibleCount, "#1: record 17 is hidden").toBe(19);
    expect(survey.tryComplete(), "#2: no pair").toBe(true);
    const unpaged = createMatrixSurvey({ keyName: "name", rowsVisibleIf: "{row.hide} != true" }, data);
    expect(unpaged.tryComplete(), "#3: the same without paging").toBe(true);
  });
  test("padded records are read as the default row value", () => {
    const survey = createMatrixSurvey({ rowsPerPage: 5, keyName: "name", defaultRowValue: { name: "same" } }, records(10));
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    matrix.rowCount = 12;
    expect(matrix.getPropertyValueWithoutDefault("value").length, "#1: records 10 and 11 are padded, not stored").toBe(10);
    expect(matrix.pageIndex, "#2").toBe(0);
    expect(survey.tryComplete(), "#3: the two padded records are a pair").toBe(false);
    expect(matrix.pageIndex, "#4").toBe(2);
    expect(matrix.visibleRows[1].getQuestionByName("name").errors.length, "#5: on record 11").toBe(1);
  });
});

/* A dynamic panel that pages keeps the page states of the paged questions nested in its panels
   under their records while the panels are rebuilt. */
describe("Page window: the nested page states a rebuilt panel keeps", () => {
  // A list that pages creates the page validation with its first change; a sort rebuilds the panels
  // of one that does not.
  test("a rebuild without a nested paged question keeps no state at all", () => {
    const question = createPanel({}, records(5));
    expect(panelIds(question), "#1").toEqual(range(0, 4));
    question.sortOrder = [{ field: "id", direction: "desc" }];
    expect(panelIds(question), "#2: the panels were rebuilt").toEqual([4, 3, 2, 1, 0]);
    expect((<any>question)._pageValidation, "#3: no page validation was created").toBeUndefined();
  });
  test("a record whose nested question stopped paging drops the state it had", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", panelsPerPage: 2,
        templateElements: [{ type: "text", name: "id" }, {
          type: "matrixdynamic", name: "items", rowCount: 0, rowsPerPage: 4,
          columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]
        }]
      }]
    });
    survey.data = { outer: records(6, (i: number) => ({ id: i, items: records(12, (j: number) => ({ a: "a" + j })) })) };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrixOf = (id: number): QuestionMatrixDynamicModel => {
      const panel = outer.panels.filter(p => p.getQuestionByName("id").value === id)[0];
      return <QuestionMatrixDynamicModel>panel.getQuestionByName("items");
    };
    matrixOf(1).pageIndex = 2;
    matrixOf(1).visibleRows[1].getQuestionByName("b").value = "x";
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1).pageIndex, "#1: the state came back").toBe(2);
    matrixOf(1).rowsPerPage = 0;
    expect(getPageState(matrixOf(1)), "#2: a matrix that does not page has no state").toBeUndefined();
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1).rowsPerPage, "#3: the new matrix pages again").toBe(4);
    expect(matrixOf(1).pageIndex, "#4: the old state is not handed back").toBe(0);
    expect(getPageState(matrixOf(1)), "#5").toEqual({ pageIndex: 0, edited: [], nested: {} });
  });
});

/* A record added under paging that the view does not show - rowsVisibleIf or templateVisibleIf
   hides it. The two questions differ here, and both are kept as they are: the matrix stays on its
   page, the panel goes to page 0 (the visible index -1 is on page 0). */
describe("Page window: an added record the view does not show", () => {
  test("matrix: the page stays, the record is tracked as edited", () => {
    const matrix = createMatrix({ rowsPerPage: 2, rowsVisibleIf: "{row.name} notempty" }, records(6));
    matrix.visibleRows;
    matrix.pageIndex = 1;
    matrix.addRow();
    expect(matrix.rowCount, "#1").toBe(7);
    expect(matrix["dataList"].visibleCount, "#2: the new record is hidden").toBe(6);
    expect(matrix.pageIndex, "#3: the page stays").toBe(1);
    expect(rowIds(matrix), "#4").toEqual([2, 3]);
    expect(getPageState(matrix).edited, "#5").toEqual([6]);
  });
  test("panel: the question stays on its page, as the matrix does, and returns no panel", () => {
    const question = createPanel({ panelsPerPage: 2, templateVisibleIf: "{panel.name} notempty" }, records(6));
    question.pageIndex = 1;
    const added: Array<any> = [];
    question.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const res = question.addPanel();
    expect(question.panelCount, "#1").toBe(7);
    expect(question["dataList"].visibleCount, "#2: the new record is hidden").toBe(6);
    expect(question.pageIndex, "#3: the page stays").toBe(1);
    expect(panelIds(question), "#4").toEqual([2, 3]);
    expect(res, "#5: no panel").toBeNull();
    expect(added, "#6: and onDynamicPanelAdded is not raised").toEqual([]);
    expect(getPageState(question).edited, "#7").toEqual([6]);
  });
  test("panel in tab mode: the page and the current panel stay", () => {
    const question = createPanel({ panelsPerPage: 2, displayMode: "tab", templateVisibleIf: "{panel.name} notempty" }, records(6));
    question.currentIndex = 3;
    expect(question.pageIndex, "#1").toBe(1);
    question.addPanel();
    expect(question.pageIndex, "#2").toBe(1);
    expect(question.currentIndex, "#3").toBe(3);
    expect(question.currentPanel.getQuestionByName("id").value, "#4").toBe(3);
  });
});

/* What an added record does to the objects that exist: the objects in front of an appended one are
   kept; an insert in front of objects moves them onto other records, and they are rebuilt. */
describe("Page window: the objects an added record keeps", () => {
  test("matrix: an added record rowsVisibleIf hides gets no row and raises no onMatrixRowAdded", () => {
    const survey = createMatrixSurvey({ rowsPerPage: 2, rowsVisibleIf: "{row.name} notempty" }, records(6));
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    matrix.pageIndex = 1;
    const added: Array<any> = [];
    survey.onMatrixRowAdded.add((_, options) => { added.push(options.row); });
    matrix.addRow();
    expect(matrix.rowCount, "#1").toBe(7);
    expect(rowIds(matrix), "#2: the page stays").toEqual([2, 3]);
    expect(added.length, "#3: no row, no event").toBe(0);
  });
  test("panel: an append on the page in force keeps the panels, their state and their questions", () => {
    const survey = createPanelSurvey({ panelsPerPage: 5, templateTitle: "Item {panelIndex}", defaultPanelValue: { name: "new" },
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] },
    [{ id: 0, name: "n0" }, { id: 1 }]);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const before = question.panels.slice();
    before[0].collapse();
    before[1].validate(true);
    expect(before[1].getQuestionByName("name").errors.length, "#0").toBe(1);
    const created: Array<string> = [];
    survey.onQuestionCreated.add((_, options) => { created.push(options.question.name); });
    const added: Array<any> = [];
    survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const res = question.addPanel();
    expect(question.panels.length, "#1").toBe(3);
    expect(before.every((panel, i) => question.panels[i] === panel), "#2: the panels in front are kept").toBe(true);
    expect(before[0].isCollapsed, "#3: the collapsed panel stays collapsed").toBe(true);
    expect(before[1].getQuestionByName("name").errors.length, "#4: the error stays shown").toBe(1);
    expect(before.every(panel => !panel.isDisposed), "#5: no panel is disposed").toBe(true);
    expect(created, "#6: only the new panel's questions are created").toEqual(["id", "name"]);
    expect(added.length === 1 && added[0] === res, "#7: one onDynamicPanelAdded with the new panel").toBe(true);
    expect(res.getQuestionByName("name").value, "#8: the returned panel holds the new record").toBe("new");
    expect(question.panels[2] === res, "#9").toBe(true);
    expect(question.renderedPanels.indexOf(res) > -1, "#10: it is rendered").toBe(true);
  });
  ["tab", "carousel"].forEach((mode: string): void => {
    test(mode + ": an append on the page in force keeps the panels and selects the new one", () => {
      const question = createPanel({ displayMode: mode, panelsPerPage: 5, defaultPanelValue: { name: "new" } }, records(2));
      question.currentIndex = 1;
      const before = question.panels.slice();
      const res = question.addPanel();
      expect(before.every((panel, i) => question.panels[i] === panel), "#1: the panels are kept").toBe(true);
      expect(question.currentPanel === res, "#2: the new panel is current").toBe(true);
      expect(question.currentIndex, "#3").toBe(2);
      expect(res.getQuestionByName("name").value, "#4").toBe("new");
      expect(question.renderedPanels.length === 1 && question.renderedPanels[0] === res, "#5: and rendered").toBe(true);
    });
  });
});

describe("Page window: record visibility from an expression needs paging", () => {
  [false, true].forEach((isMatrix: boolean): void => {
    test((isMatrix ? "matrix" : "panel") + ": a record the expression hides leaves the visible count, without paging and with it", () => {
      const question: any = isMatrix ? createMatrix({ rowsVisibleIf: "{row.id} != {hideId}" }, records(4), [{ type: "text", name: "hideId" }])
        : createPanel({ templateVisibleIf: "{panel.id} != {hideId}" }, records(4), [{ type: "text", name: "hideId" }]);
      if (isMatrix) question.visibleRows;
      const list = question["dataList"];
      question.survey.setValue("hideId", 2);
      expect(list.visibleCount, "#2: the objects decide the flags").toBe(3);
      question.pageSize = 2;
      question.survey.setValue("hideId", 1);
      expect(list.visibleCount, "#4").toBe(3);
    });
  });
});

describe("Fixed matrix pages its rows", () => {
  const sevenRows = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];
  const createFixed = (json?: any, data?: any, surveyJson?: any): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel(Object.assign({
      elements: [Object.assign({
        type: "matrixdropdown", name: "matrix", rowsPerPage: 3, rows: sevenRows,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]
      }, json)]
    }, surveyJson));
    if (!!data) {
      survey.data = { matrix: data };
    }
    return { survey: survey, matrix: <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix") };
  };
  const names = (rows: Array<any>): Array<string> => rows.map(row => row.rowName);
  const allAnswered = (): any => {
    const res: any = {};
    sevenRows.forEach((name, i) => { res[name] = { a: "a" + (i + 1), b: i + 1 }; });
    return res;
  };
  test("rowsPerPage loads from JSON, is written back, and the default is not written", () => {
    const { matrix } = createFixed();
    expect(matrix.rowsPerPage, "#1").toBe(3);
    expect(matrix.toJSON().rowsPerPage, "#2").toBe(3);
    const { matrix: unpaged } = createFixed({ rowsPerPage: 0 });
    expect(unpaged.toJSON().rowsPerPage, "#3: the default is not written").toBeUndefined();
    expect(unpaged.visibleRows.length, "#4: without paging every row is built").toBe(7);
  });
  test("the rows are the page, and the visible index is global", () => {
    const { matrix } = createFixed();
    expect(names(matrix.visibleRows), "#1: page 0").toEqual(["r1", "r2", "r3"]);
    expect(matrix.rowsOnPage === matrix.visibleRows, "#1: the page is visibleRows itself").toBe(true);
    expect(matrix.pageCount, "#2").toBe(3);
    expect(matrix.nextPage(), "#3").toBe(true);
    expect(names(matrix.visibleRows), "#3: page 1").toEqual(["r4", "r5", "r6"]);
    expect(matrix.visibleRows.map(row => row.visibleIndex), "#4: global positions").toEqual([3, 4, 5]);
    expect(matrix.renderedTable.rows.filter(row => row.row && !row.isDetailRow).map(row => row.row.rowName), "#5: the rendered page").toEqual(["r4", "r5", "r6"]);
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#6: the one-row last page").toEqual(["r7"]);
    expect(matrix.visibleRows.map(row => row.getIndex()), "#7: it names its record").toEqual([6]);
  });
  test("a cell edit on another page writes the row's own key", () => {
    const { survey, matrix } = createFixed(undefined, { r1: { a: "1" } });
    let changes = 0;
    survey.onValueChanged.add(() => changes++);
    matrix.nextPage();
    expect(changes, "#1: a page move writes nothing").toBe(0);
    matrix.visibleRows[1].cells[0].question.value = "five";
    expect(matrix.value, "#2").toEqual({ r1: { a: "1" }, r5: { a: "five" } });
    matrix.prevPage();
    expect(matrix.visibleRows[0].cells[0].question.value, "#3: page 0").toBe("1");
    matrix.nextPage();
    expect(matrix.visibleRows[1].cells[0].question.value, "#4: back on page 1").toBe("five");
    expect(changes, "#5: one write for the one edit").toBe(1);
  });
  test("rowsVisibleIf and a row's visibleIf cut the page from the visible records, and hidden records keep their answers", () => {
    const { survey, matrix } = createFixed({
      rows: ["r1", { value: "r2", visibleIf: "{show2} = true" }, "r3", "r4", "r5", "r6", "r7"],
      rowsVisibleIf: "{item} != 'r4'"
    }, { r2: { a: "2" }, r4: { a: "4" }, r6: { a: "6" } });
    expect(names(matrix.visibleRows), "#1: r2 and r4 are hidden").toEqual(["r1", "r3", "r5"]);
    expect(matrix.pageCount, "#2: five visible records").toBe(2);
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#3").toEqual(["r6", "r7"]);
    survey.setValue("show2", true);
    expect(matrix.pageCount, "#4: r2 is visible").toBe(2);
    matrix.prevPage();
    expect(names(matrix.visibleRows), "#5").toEqual(["r1", "r2", "r3"]);
    expect(matrix.value, "#6: the hidden record keeps its answer").toEqual({ r2: { a: "2" }, r4: { a: "4" }, r6: { a: "6" } });
  });
  test("a row whose visible flag is off has no page slot", () => {
    const { matrix } = createFixed();
    matrix.rows[1].setIsVisible(false);
    matrix.rows[2].setIsVisible(false);
    matrix.runCondition({});
    expect(names(matrix.visibleRows), "#1").toEqual(["r1", "r4", "r5"]);
    expect(matrix.pageCount, "#2").toBe(2);
  });
  test("hideIfRowsEmpty counts the visible records, not the rows of the page", () => {
    const { survey, matrix } = createFixed({ hideIfRowsEmpty: true, rowsVisibleIf: "{hide} notcontains {item}" });
    expect(matrix.isVisible, "#1").toBe(true);
    survey.setValue("hide", ["r1", "r2", "r3"]);
    expect(names(matrix.visibleRows), "#2: page 0 is the next visible records").toEqual(["r4", "r5", "r6"]);
    expect(matrix.isVisible, "#2: some records are visible").toBe(true);
    survey.setValue("hide", sevenRows);
    expect(matrix.isVisible, "#3: none is").toBe(false);
    survey.setValue("hide", ["r1"]);
    expect(matrix.isVisible, "#4").toBe(true);
  });
  test("clearIncorrectValues keeps the answers of the rows off the page", () => {
    const { matrix } = createFixed(undefined, { r1: { a: "1" }, r5: { a: "5" }, r7: { a: "7" }, zz: { a: "z" } });
    matrix.clearIncorrectValues();
    expect(matrix.value, "#1: the unknown key goes, the off-page rows stay").toEqual({ r1: { a: "1" }, r5: { a: "5" }, r7: { a: "7" } });
  });
  test("clearIncorrectValues keeps the answers of numeric row values", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "matrix", rows: [0, 1], columns: [{ name: "a", cellType: "text" }] }]
    });
    survey.data = { matrix: { 0: { a: "zero" }, 1: { a: "one" } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    matrix.clearIncorrectValues();
    expect(matrix.value, "#1: the keys are strings, the row values numbers").toEqual({ 0: { a: "zero" }, 1: { a: "one" } });
  });
  test("the value-level results cover every visible record, not the page", () => {
    const { survey, matrix } = createFixed({ rowsVisibleIf: "{item} != 'r2'" }, allAnswered());
    const expected: any = allAnswered();
    delete expected.r2;
    expect(matrix.visibleRows.length, "#0: one page").toBe(3);
    expect(matrix.getFilteredData(), "#1: getFilteredData").toEqual(expected);
    // A matrix contributes its stored answer to the survey's filtered values, as it does without paging.
    expect(survey.getFilteredValues().matrix, "#2: the survey's filtered values").toEqual(allAnswered());
    const display = matrix.getDisplayValue(true);
    expect(Object.keys(display), "#3: getDisplayValue").toEqual(["r1", "r3", "r4", "r5", "r6", "r7"]);
    expect(display.r7, "#3").toEqual({ a: "a7", b: 7 });
    const plain = matrix.getPlainData().data;
    expect(plain.map((item: any) => item.name), "#4: getPlainData").toEqual(["r1", "r3", "r4", "r5", "r6", "r7"]);
    expect(plain[5].title, "#4: the row title").toBe("r7");
    expect(plain[5].data.map((cell: any) => cell.value), "#4: the cells of a row off the page").toEqual(["a7", 7]);
    expect(plain[5].data[0].title, "#4: the cell title is the cell's").toBe(plain[0].data[0].title.replace("r1", "r7"));
    expect(matrix.getProgressInfo(), "#5: getProgressInfo").toEqual({ questionCount: 12, answeredQuestionCount: 12, requiredQuestionCount: 0, requiredAnsweredQuestionCount: 0 });
  });
  test("a paged dynamic matrix: the same results cover every visible record", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 7, rowsPerPage: 3, rowsVisibleIf: "{row.b} != 2", columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] }]
    });
    const data = sevenRows.map((name, i) => ({ a: "a" + (i + 1), b: i + 1 }));
    survey.data = { matrix: data };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const expected = data.filter(record => record.b !== 2);
    expect(matrix.visibleRows.length, "#0").toBe(3);
    expect(matrix.getFilteredData(), "#1").toEqual(expected);
    expect(survey.getFilteredValues().matrix, "#2: the stored answer").toEqual(data);
    expect(matrix.getDisplayValue(true).length, "#3: the display value keeps every record").toBe(7);
    expect(matrix.getPlainData().data.map((item: any) => item.name), "#4").toEqual(["row1", "row3", "row4", "row5", "row6", "row7"]);
    expect(matrix.getProgressInfo().questionCount, "#5").toBe(12);
  });
  test("a total covers every visible row on any page", () => {
    const { matrix } = createFixed({ columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", inputType: "number", totalType: "sum" }] }, allAnswered());
    expect(matrix.visibleRows.length, "#0").toBe(3);
    expect(matrix.totalValue.b, "#1: page 0").toBe(28);
    matrix.nextPage();
    expect(matrix.totalValue.b, "#2: page 1").toBe(28);
  });
  test("rowOrder random: the pages are the randomized order cut in threes", () => {
    const { survey, matrix } = createFixed({ rowOrder: "random" });
    survey.randomSeed = 12345;
    const order = names(matrix.rows.map(item => ({ rowName: item.value })));
    expect(names(matrix.visibleRows), "#1: page 0").toEqual(order.slice(0, 3));
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#2: page 1").toEqual(order.slice(3, 6));
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#3: page 2").toEqual(order.slice(6));
    expect(order.join(), "#4: the order is randomized").not.toBe(sevenRows.join());
  });
  test("a detail panel closes with its page, and its event passes the row's position in the whole view", () => {
    const { survey, matrix } = createFixed({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    const events: Array<any> = [];
    survey.onMatrixDetailPanelVisibleChanged.add((_, options) => { events.push({ rowIndex: options.rowIndex, name: options.row.rowName, visible: options.visible }); });
    matrix.visibleRows[1].showDetailPanel();
    expect(events, "#1").toEqual([{ rowIndex: 1, name: "r2", visible: true }]);
    matrix.nextPage();
    matrix.visibleRows[2].showDetailPanel();
    expect(events[1], "#2: the position in the whole view").toEqual({ rowIndex: 5, name: "r6", visible: true });
    matrix.prevPage();
    expect(matrix.visibleRows[1].isDetailPanelShowing, "#3: the row was built again, its panel is closed").toBe(false);
  });
  test("transposeData: a page renders as a set of columns", () => {
    const { matrix } = createFixed({ transposeData: true });
    matrix.nextPage();
    const table = matrix.renderedTable;
    expect(table.headerRow.cells.filter(cell => cell.hasTitle).map(cell => cell.locTitle.renderedHtml), "#1: the page's rows are the columns").toEqual(["r4", "r5", "r6"]);
    expect(table.rows.filter(row => !row.isDetailRow && !row.isErrorsRow).length, "#2: one rendered row per matrix column").toBe(2);
  });
  test("single-input mode walks every row and does not page", () => {
    const { survey, matrix } = createFixed({ columns: [{ name: "a", cellType: "text" }] }, undefined, { questionsOnPageMode: "inputPerPage" });
    const titles: Array<string> = [];
    for (let i = 0; i < 7; i++) {
      titles.push(matrix.singleInputLocTitle.textOrHtml);
      survey.performNext();
    }
    expect(titles, "#1: every row").toEqual(sevenRows);
    expect(matrix.pageCount, "#2: no paging while single input is active").toBe(1);
    expect(matrix.rowsOnPage.length, "#3").toBe(7);
  });
  test("design mode builds every row", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdropdown", name: "matrix", rowsPerPage: 3, rows: sevenRows, columns: [{ name: "a" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "#1").toBe(7);
    expect(matrix.pageCount, "#2").toBe(1);
    expect(matrix.rowsPerPage, "#3: the authored value is kept").toBe(3);
  });
  describe("clearing invisible values", () => {
    (<Array<"onHidden" | "onComplete">>["onHidden", "onComplete"]).forEach(mode => {
      test("a hidden row loses its answer on the page and off it, a visible one keeps it, " + mode, () => {
        const { survey, matrix } = createFixed({ rowsVisibleIf: "{hide} notcontains {item}" }, allAnswered(), { clearInvisibleValues: mode });
        survey.setValue("hide", ["r2", "r6"]);
        if (mode === "onComplete") survey.doComplete();
        const expected: any = allAnswered();
        delete expected.r2;
        delete expected.r6;
        expect(matrix.value, "#1: r2 was on the page, r6 off it").toEqual(expected);
      });
    });
  });
  describe("unique columns: only the visible records take part", () => {
    const uniqueColumns = [{ name: "a", cellType: "text", isUnique: true }];
    test("a hidden row with the same value is no duplicate, without paging and off the page", () => {
      [0, 3].forEach(rowsPerPage => {
        [{ rowsVisibleIf: "{item} != 'r6'" }, { rows: ["r1", "r2", "r3", "r4", "r5", { value: "r6", visibleIf: "false" }, "r7"] }].forEach((hide, i) => {
          const { survey, matrix } = createFixed(Object.assign({ rowsPerPage: rowsPerPage, columns: uniqueColumns }, hide), { r2: { a: "x" }, r6: { a: "x" } });
          expect(survey.validate(), "#" + rowsPerPage + "/" + i + ": no duplicate").toBe(true);
          expect(matrix.value, "#" + rowsPerPage + "/" + i + ": the answer is kept").toEqual({ r2: { a: "x" }, r6: { a: "x" } });
        });
      });
    });
    test("a visible duplicate off the page is reported", () => {
      const { survey, matrix } = createFixed({ columns: uniqueColumns }, { r2: { a: "x" }, r6: { a: "x" } });
      expect(survey.validate(), "#1").toBe(false);
      expect(matrix.pageIndex, "#2: the page stays").toBe(0);
      expect(matrix.visibleRows[1].cells[0].question.errors.length, "#3: the error is on the row that exists").toBe(1);
    });
  });
});

describe("Fixed matrix validates every page", () => {
  const sevenRows = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];
  const requiredA = [{ name: "a", cellType: "text", isRequired: true }];
  const answered = (except?: Array<string>, extra?: any): any => {
    const res: any = {};
    sevenRows.forEach((name, i) => {
      if (!except || except.indexOf(name) < 0) res[name] = Object.assign({ a: "a" + (i + 1) }, extra && extra[name]);
    });
    return res;
  };
  const createFixed = (json: any, data: any, surveyJson?: any): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel(Object.assign({
      elements: [Object.assign({ type: "matrixdropdown", name: "matrix", rowsPerPage: 3, rows: sevenRows, columns: requiredA }, json)]
    }, surveyJson));
    survey.data = { matrix: data };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "the first page is shown").toBe(3);
    return { survey: survey, matrix: matrix };
  };
  const rowNames = (matrix: QuestionMatrixDropdownModel): Array<string> => matrix.visibleRows.map(row => row.rowName);
  const errorRows = (matrix: QuestionMatrixDropdownModel, column: string = "a"): Array<string> =>
    matrix.visibleRows.filter(row => row.getQuestionByName(column).errors.length > 0).map(row => row.rowName);
  test("an empty required cell in a row on a page never opened blocks completion and shows its page", () => {
    const data = answered(["r7"]);
    const { survey, matrix } = createFixed({}, data);
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2: the page of r7").toBe(2);
    expect(errorRows(matrix), "#3: the error is on r7").toEqual(["r7"]);
    expect(matrix.value, "#4: the answer is unchanged").toEqual(data);
  });
  test("a hidden row with an empty required cell does not block completion", () => {
    [{ rows: ["r1", "r2", "r3", "r4", "r5", "r6", { value: "r7", visibleIf: "false" }] }, { rowsVisibleIf: "{item} != 'r7'" }].forEach((hide, i) => {
      const data = answered(["r7"]);
      const { survey, matrix } = createFixed(hide, data);
      expect(survey.tryComplete(), "#" + i + ": completes").toBe(true);
      expect(matrix.value, "#" + i + ": the answer is unchanged").toEqual(data);
    });
  });
  test("every row answered: the survey completes, and the page the respondent was on comes back", () => {
    const data = answered();
    const { survey, matrix } = createFixed({}, data);
    matrix.pageIndex = 1;
    expect(survey.validate(), "#1").toBe(true);
    expect(matrix.pageIndex, "#2: back on page 1").toBe(1);
    expect(survey.tryComplete(), "#3").toBe(true);
    expect(matrix.value, "#4").toEqual(data);
  });
  test("a cell validator that fails for a row off the page", () => {
    const data = answered(undefined, { r5: { a: "bad" } });
    const { survey, matrix } = createFixed({ columns: [{ name: "a", cellType: "text", isRequired: true, validators: [{ type: "expression", expression: "{row.a} != 'bad'" }] }] }, data);
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(errorRows(matrix), "#3").toEqual(["r5"]);
  });
  test("onMatrixCellValidate returns an error for a row off the page", () => {
    const { survey, matrix } = createFixed({}, answered());
    survey.onMatrixCellValidate.add((_, options) => {
      if (options.row.rowName === "r6") options.error = "not r6";
    });
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(errorRows(matrix), "#3").toEqual(["r6"]);
  });
  test("a required question in the detail panel of a row off the page", () => {
    const { survey, matrix } = createFixed({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d", isRequired: true }] },
      answered(undefined, { r1: { d: "1" }, r2: { d: "2" }, r3: { d: "3" }, r5: { d: "5" }, r6: { d: "6" }, r7: { d: "7" } }));
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(matrix.visibleRows[0].rowName, "#3").toBe("r4");
    expect(matrix.visibleRows[0].isDetailPanelShowing, "#4: the panel with the error is open").toBe(true);
    expect(matrix.visibleRows[0].detailPanel.getQuestionByName("d").errors.length, "#5").toBe(1);
  });
  describe("unique columns", () => {
    const uniqueColumns = [{ name: "a", cellType: "text", isUnique: true }];
    test("equal values on pages 0 and 1, validated from page 2", () => {
      const { survey, matrix } = createFixed({ columns: uniqueColumns }, { r2: { a: "x" }, r6: { a: "x" } });
      matrix.pageIndex = 2;
      expect(survey.tryComplete(), "#1").toBe(false);
      expect(matrix.pageIndex, "#2: the first page with an error").toBe(0);
      expect(errorRows(matrix), "#3: the error is on the row that exists").toEqual(["r2"]);
    });
    test("the same values with r6 hidden: no duplicate", () => {
      [{ rowsVisibleIf: "{item} != 'r6'" }, { rows: ["r1", "r2", "r3", "r4", "r5", { value: "r6", visibleIf: "false" }, "r7"] }].forEach((hide, i) => {
        const { survey, matrix } = createFixed(Object.assign({ columns: uniqueColumns }, hide), { r2: { a: "x" }, r6: { a: "x" } });
        matrix.pageIndex = 1;
        expect(survey.tryComplete(), "#" + i).toBe(true);
      });
    });
    test("the same values with r2 hidden and r6 on the current page: no error on r6", () => {
      const { survey, matrix } = createFixed({ columns: uniqueColumns, rowsVisibleIf: "{item} != 'r2'" }, { r2: { a: "x" }, r6: { a: "x" } });
      matrix.pageIndex = 1;
      expect(rowNames(matrix), "#1: r6 is on the page").toEqual(["r5", "r6", "r7"]);
      expect(survey.tryComplete(), "#2").toBe(true);
    });
  });
  describe("asynchronous validators", () => {
    const results: Array<{ name: string, setResult: (res: any) => void }> = [];
    const register = (): void => {
      results.length = 0;
      FunctionFactory.Instance.register("fixedAsyncFunc", function (this: any, params: Array<any>): any {
        results.push({ name: params[0], setResult: this.returnResult });
        return false;
      }, true);
    };
    afterEach(() => {
      FunctionFactory.Instance.unregister("fixedAsyncFunc");
    });
    const asyncColumns = [{ name: "a", cellType: "text", validators: [{ type: "expression", expression: "fixedAsyncFunc({row.a}) = 1" }] }];
    const settle = (fail?: string): void => {
      while(results.length > 0) {
        const item = results.shift();
        item.setResult(item.name === fail ? 0 : 1);
      }
    };
    test("a validator that fails for r5: the survey stays and the matrix shows page 1 once it settles", () => {
      register();
      const { survey, matrix } = createFixed({ columns: asyncColumns }, answered());
      survey.tryComplete();
      settle("a5");
      expect(survey.state, "#1: not completed").toBe("running");
      expect(matrix.pageIndex, "#2: the page of r5").toBe(1);
      expect(errorRows(matrix), "#3").toEqual(["r5"]);
    });
    test("the same validator passing: the survey completes after the walk", () => {
      register();
      const { survey } = createFixed({ columns: asyncColumns }, answered());
      survey.tryComplete();
      settle();
      expect(survey.state, "#1").toBe("completed");
    });
  });
  test("a validation on a value change does not walk the pages", () => {
    const { matrix } = createFixed({}, answered(["r7"]), { checkErrorsMode: "onValueChanged" });
    const builds = countCreatedRows(<SurveyModel>matrix.survey, "a");
    matrix.visibleRows[0].cells[0].question.value = "changed";
    expect(builds(), "#1: no other page is built").toBe(0);
    expect(matrix.pageIndex, "#2").toBe(0);
  });
  test("the question's isRequired is checked on the keyed answer", () => {
    const { survey, matrix } = createFixed({ isRequired: true, columns: [{ name: "a", cellType: "text" }] }, undefined);
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.errors.length, "#2: the question's own error").toBe(1);
    expect(matrix.pageIndex, "#3").toBe(0);
  });
  test("a row the filter excludes, with an empty required cell, does not block completion", () => {
    const { survey, matrix } = createFixed({ filterExpression: "{rowName} != 'r7'" }, answered(["r7"]));
    expect(matrix.pageCount, "#1: six rows in the view").toBe(2);
    expect(survey.tryComplete(), "#2").toBe(true);
  });
  test("equal unique values with r6 filtered out: no duplicate", () => {
    const { survey } = createFixed({ columns: [{ name: "a", cellType: "text", isUnique: true }], filterExpression: "{rowName} != 'r6'" }, { r2: { a: "x" }, r6: { a: "x" } });
    expect(survey.tryComplete(), "#1").toBe(true);
  });
});

describe("Fixed matrix pages its rows under a sort and a filter", () => {
  const rows = [{ value: "r1", text: "Golf" }, { value: "r2", text: "Echo" }, { value: "r3", text: "Alpha" }, { value: "r4", text: "Foxtrot" },
    { value: "r5", text: "Bravo" }, { value: "r6", text: "Delta" }, { value: "r7", text: "Charlie" }];
  const createFixed = (json: any, data: any, surveyJson?: any): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel(Object.assign({
      elements: [Object.assign({ type: "matrixdropdown", name: "matrix", rowsPerPage: 2, rows: rows, columns: [{ name: "a", cellType: "text" }] }, json)]
    }, surveyJson));
    survey.data = { matrix: data };
    return { survey: survey, matrix: <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix") };
  };
  test("an edit writes the row's own key: record index, visible position and page-local position all differ", () => {
    const { matrix } = createFixed({ sortBy: "rowTitle", filterExpression: "{rowName} != 'r3'" }, {});
    // In the view: Bravo r5, Charlie r7, Delta r6, Echo r2, Foxtrot r4, Golf r1.
    matrix.nextPage();
    const row = matrix.visibleRows[1];
    expect(row.rowName, "#1: page 1 holds Delta and Echo").toBe("r2");
    expect([row.getIndex(), row.visibleIndex, row.pageVisibleIndex], "#2: record 1, visible 3, page-local 1").toEqual([1, 3, 1]);
    row.cells[0].question.value = "echo";
    expect(matrix.value, "#3: the row's own key").toEqual({ r2: { a: "echo" } });
  });
  test("a filtered-out row keeps its answer when invisible values are cleared", () => {
    const { survey, matrix } = createFixed({ rowsVisibleIf: "{hide} notcontains {item}", filterExpression: "{rowName} != 'r6'" },
      { r1: { a: "1" }, r5: { a: "5" }, r6: { a: "6" } }, { clearInvisibleValues: "onHidden" });
    expect(matrix.visibleRows.length, "#0").toBe(2);
    survey.setValue("hide", ["r5"]);
    expect(matrix.value, "#1: the hidden r5 goes, the filtered-out r6 stays").toEqual({ r1: { a: "1" }, r6: { a: "6" } });
  });
});
/* A number a caller passes - removePanel(n), addPanel(n), removeRow(n) - and an index an event
   reports keep their meaning under paging: a position in the whole view, never a position on the
   current page. A view change between a request and its answer never makes it act on another record. */
describe("Page window: numbers, confirmations and new records name records across pages", () => {
  const ids = (arr: Array<any>): Array<any> => arr.map(r => !r ? r : r.id);
  test("panel: removePanel(n) of a record on another page removes it, keeps the page and fires no panel event", () => {
    const question = createPanel({ panelsPerPage: 5 }, records(20));
    const removed: Array<number> = [];
    question.survey.onDynamicPanelRemoved.add((_, options) => { removed.push(options.panelIndex); });
    question.removePanel(12);
    expect(ids(question.value).indexOf(12), "#1: record 12 is gone").toBe(-1);
    expect(question.value.length, "#2").toBe(19);
    expect(panelIds(question), "#3: page 0 is as it was").toEqual([0, 1, 2, 3, 4]);
    expect(removed, "#4: the record had no panel").toEqual([]);
    question.pageIndex = 2;
    question.removePanelUI(question.panels[1]);
    expect(removed, "#5: a panel's index is its position in the whole view").toEqual([11]);
    expect(ids(question.value).indexOf(11), "#6: record 11 was that panel's - record 12 is gone").toBe(-1);
  });
  test("panel: addPanel(n) inserts before the record at position n, on whatever page it is", () => {
    const question = createPanel({ panelsPerPage: 5 }, records(20));
    const added: Array<number> = [];
    question.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panelIndex); });
    const panel = question.addPanel(12);
    expect(ids(question.value)[12], "#1: the new record is at 12").toBeUndefined();
    expect(ids(question.value)[13], "#2").toBe(12);
    expect(question.pageIndex, "#3: its page is shown").toBe(2);
    expect(panel === question.panels[2], "#4: the returned panel is the new record's").toBe(true);
    expect(added, "#5: its position in the whole view").toEqual([12]);
  });
  test("matrix: removeRow(n) of a record on another page removes it and keeps the page; the row events report the whole view", () => {
    const survey = createMatrixSurvey({ rowsPerPage: 5 }, records(20));
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    const removed: Array<number> = [];
    survey.onMatrixRowRemoved.add((_, options) => { removed.push(options.rowIndex); });
    matrix.removeRow(12);
    expect(ids(matrix.value).indexOf(12), "#1: record 12 is gone").toBe(-1);
    expect(rowIds(matrix), "#2: page 0 is as it was").toEqual([0, 1, 2, 3, 4]);
    expect(removed, "#3: the record had no row").toEqual([]);
    matrix.pageIndex = 2;
    matrix.removeRowUI(matrix.visibleRows[1]);
    expect(removed, "#4: the row's position in the whole view").toEqual([11]);
    expect(ids(matrix.value).indexOf(11), "#5: record 11 was that row's - record 12 is gone").toBe(-1);
  });
  test("a sorted, paged question: the numbers and the event indexes are positions in the sorted view", () => {
    const question = createPanel({ panelsPerPage: 5, sortBy: "id-" }, records(20));
    const removed: Array<number> = [];
    question.survey.onDynamicPanelRemoved.add((_, options) => { removed.push(options.panelIndex); });
    expect(panelIds(question), "#1").toEqual([19, 18, 17, 16, 15]);
    question.removePanelUI(question.panels[1]);
    expect(removed, "#2").toEqual([1]);
    expect(ids(question.value).indexOf(18), "#3: the record that panel showed").toBe(-1);
    question.removePanel(10);
    expect(ids(question.value).indexOf(8), "#4: position 10 of the sorted view").toBe(-1);
    expect(question.value.length, "#5").toBe(18);
  });
  test("a source that pages itself refuses a number its window does not hold, and reports it", async () => {
    const source = new PagedSource(records(20));
    const question = createPanel({ panelsPerPage: 5, panelCount: 0 });
    question.panels;
    question.dataSource = source;
    await flush();
    const errors: Array<string> = [];
    question.survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    question.removePanel(12);
    question.addPanel(12);
    await flush();
    expect(source.removes, "#1: nothing was removed").toEqual([]);
    expect(errors, "#2: both refusals are reported").toEqual(["remove", "insert"]);
    expect(panelIds(question), "#3: the window is as it was").toEqual([0, 1, 2, 3, 4]);
    question.removePanel(3);
    await flush();
    expect(source.removes, "#4: a number the window holds is removed, by key").toEqual([3]);
    const matrixSource = new PagedSource(records(20));
    const matrix = createMatrix({ rowsPerPage: 5 });
    matrix.dataSource = matrixSource;
    await flush();
    matrix.removeRow(12);
    await flush();
    expect(matrixSource.removes, "#5: the matrix refuses it too").toEqual([]);
  });
  test("matrix: a row added under paging and a filter is the new record, and stays shown until the view changes", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowsPerPage: 2, filterExpression: "{a} > 0",
      columns: [{ name: "a", cellType: "text", inputType: "number" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }];
    let addedRow: any = undefined;
    survey.onMatrixRowAdded.add((_, options) => { addedRow = options.row; });
    matrix.addRow();
    expect(addedRow.value, "#1: the event gets the new, empty row").toEqual({});
    expect(matrix.pageIndex, "#2: the page of the new record").toBe(1);
    expect(matrix.visibleRows.length, "#3: the record before it and the new one").toBe(2);
    expect(matrix.visibleRows[1] === addedRow, "#4: shown although the filter does not accept it").toBe(true);
    addedRow.getQuestionByColumnName("a").value = -5;
    expect(matrix.value, "#5: the edit reached the new record").toEqual([{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: -5 }]);
    expect(matrix.visibleRows.length, "#6: it stays shown").toBe(2);
    matrix.refreshView();
    expect(matrix.visibleRows.map(row => row.value.a), "#7: the next view change applies the filter to it").toEqual([3]);
  });
  test("panel: a panel added under paging and a filter is the new record, and stays shown until the view changes", () => {
    const question = createPanel({ panelsPerPage: 2, filterExpression: "{id} > 0" }, records(4));
    const added: Array<any> = [];
    question.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const panel = question.addPanel();
    expect(question.pageIndex, "#1: the page of the new record, not page 0").toBe(1);
    expect(panel === question.panels[1], "#2: the returned panel is the new record's").toBe(true);
    expect(added.length === 1 && added[0] === panel, "#3").toBe(true);
    panel.getQuestionByName("id").value = -1;
    expect(question.value[4], "#4: the edit reached the new record").toEqual({ id: -1 });
    expect(panelIds(question), "#5: it stays shown").toEqual([3, -1]);
    question.refreshView();
    expect(panelIds(question), "#6: the next view change applies the filter to it").toEqual([3]);
  });
  const holdConfirmations = (): { answer: (index: number, value: boolean) => void, restore: () => void, count: () => number } => {
    const old = settings.confirmActionAsync;
    const callbacks: Array<(res: boolean) => void> = [];
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { callbacks.push(callback); return true; };
    return {
      answer: (index: number, value: boolean): void => { callbacks[index](value); },
      restore: (): void => { settings.confirmActionAsync = old; },
      count: (): number => callbacks.length
    };
  };
  test("matrix: confirmDelete on a later page asks about the record of the row, and a page change drops the answer", () => {
    const confirmations = holdConfirmations();
    try {
      const matrix = createMatrix({ rowsPerPage: 2, confirmDelete: true }, [{ id: 0 }, { id: 1 }, {}, { id: 3 }]);
      matrix.nextPage();
      expect(matrix.isRequireConfirmOnRowDelete(2), "#1: record 2 is empty").toBe(false);
      expect(matrix.isRequireConfirmOnRowDelete(0), "#2: record 0 is not").toBe(true);
      matrix.removeRowUI(matrix.visibleRows[1]);
      expect(confirmations.count(), "#3: record 3 asks").toBe(1);
      confirmations.answer(0, true);
      expect(ids(matrix.value), "#4: record 3 is removed").toEqual([0, 1, undefined]);
      matrix.value = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
      matrix.removeRowUI(matrix.visibleRows[1]);
      expect(confirmations.count(), "#5").toBe(2);
      matrix.prevPage();
      confirmations.answer(1, true);
      expect(ids(matrix.value), "#6: the row it asked about is gone from the page: nothing is removed").toEqual([0, 1, 2, 3]);
    } finally {
      confirmations.restore();
    }
  });
  test("panel: confirmDelete on a later page asks about the record of the panel, and a sort drops the answer", () => {
    const confirmations = holdConfirmations();
    try {
      const question = createPanel({ panelsPerPage: 2, confirmDelete: true }, records(4));
      question.nextPage();
      question.removePanelUI(question.panels[1]);
      expect(confirmations.count(), "#1").toBe(1);
      confirmations.answer(0, true);
      expect(ids(question.value), "#2: record 3 is removed").toEqual([0, 1, 2]);
      question.removePanelUI(question.panels[0]);
      question.sortBy = "id-";
      confirmations.answer(1, true);
      expect(ids(question.value), "#3: the panel it asked about was replaced: nothing is removed").toEqual([0, 1, 2]);
    } finally {
      confirmations.restore();
    }
  });
  test("paged carousel: Add after the last panel of a page and Remove of the first panel of a page act on their records", () => {
    const question = createPanel({ displayMode: "carousel", panelsPerPage: 3, newPanelPosition: "next" }, records(9));
    question.currentIndex = 2;
    const added = question.addPanelUI();
    expect(question.pageIndex, "#1: the new record is the first of page 1").toBe(1);
    expect(added === question.currentPanel, "#2").toBe(true);
    expect(ids(question.value)[3], "#3").toBeUndefined();
    question.removePanelUI(question.currentPanel);
    expect(ids(question.value), "#4: the new record is removed").toEqual(range(0, 8));
    expect(question.currentPanel.getQuestionByName("id").value, "#5: the record after it is current").toBe(3);
    question.currentIndex = 0;
    question.removePanelUI(question.currentPanel);
    expect(ids(question.value), "#6: record 0 is removed").toEqual(range(1, 8));
    expect(question.currentPanel.getQuestionByName("id").value, "#7").toBe(1);
  });
  test("a sorted and filtered local array is edited and removed by storage index", () => {
    const matrix = createMatrix({ sortBy: "id-", filterExpression: "{id} > 1", rowsPerPage: 2 }, [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }]);
    expect(rowIds(matrix), "#1: the sorted, filtered page").toEqual([4, 3]);
    matrix.visibleRows[1].getQuestionByName("name").value = "edited";
    expect(matrix.value, "#2: the record of the row").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 2 }, { id: 4 }]);
    matrix.nextPage();
    matrix.removeRowUI(matrix.visibleRows[0]);
    expect(matrix.value, "#3").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 4 }]);
    const stored = [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }];
    const question = createPanel({ sortBy: "id-", filterExpression: "{id} > 1", panelsPerPage: 2, panelCount: 0 });
    question.panels;
    question.dataSource = ArrayDynamicDataSource.fromArray(stored);
    const source = <ArrayDynamicDataSource>question.dataSource;
    question.panels[1].getQuestionByName("name").value = "edited";
    expect(source.array, "#4: an assigned array source").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 2 }, { id: 4 }]);
    question.removePanelUI(question.panels[0]);
    expect(source.array, "#5").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 2 }]);
  });
  test("a row dragged into another matrix carries its own record under a sort, a filter and a page", () => {
    const transfer = (json: any, pageIndex: number, position: number): { from: any, to: any } => {
      const survey = new SurveyModel({ elements: [
        Object.assign({ type: "matrixdynamic", name: "m1", rowCount: 0, columns: matrixColumns }, json),
        { type: "matrixdynamic", name: "m2", rowCount: 0, columns: matrixColumns }] });
      survey.setValue("m1", records(6));
      const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
      const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
      m1.pageIndex = pageIndex;
      const dd: any = new DragDropMatrixRows(survey, null, true);
      dd.parentElement = m1;
      dd.draggedElement = m1.visibleRows[position];
      dd.fromIndex = position;
      dd.toIndex = 0;
      dd.toMatrix = m2;
      dd.doDrop();
      return { from: ids(survey.data.m1), to: survey.data.m2 };
    };
    expect(transfer({ sortBy: "id-" }, 0, 0), "#1: a sort").toEqual({ from: [0, 1, 2, 3, 4], to: [{ id: 5, name: "n5" }] });
    expect(transfer({ filterExpression: "{id} > 2" }, 0, 0), "#2: a filter").toEqual({ from: [0, 1, 2, 4, 5], to: [{ id: 3, name: "n3" }] });
    expect(transfer({ rowsPerPage: 2 }, 1, 1), "#3: a page").toEqual({ from: [0, 1, 2, 4, 5], to: [{ id: 3, name: "n3" }] });
  });
});
/* Records { a: i } in a dynamic panel "p" and a dynamic matrix "m". "e" is an expression - a template
   question or a column - whose result the new objects write back into their records. */
const createStablePanel = (json: any, count: number, expression?: string, surveyJson?: any): QuestionPanelDynamicModel => {
  const elements: Array<any> = [{ type: "text", name: "a", inputType: "number" }];
  if (!!expression) elements.push({ type: "expression", name: "e", expression: expression });
  const extra = !!surveyJson && !!surveyJson.elements ? surveyJson.elements : [];
  const survey = new SurveyModel(Object.assign({}, surveyJson, {
    elements: [Object.assign({ type: "paneldynamic", name: "p", templateElements: elements }, json)].concat(extra) }));
  survey.data = { p: records(count, (i: number) => ({ a: i })) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
};
const createStableMatrix = (json: any, count: number, expression?: string, surveyJson?: any): QuestionMatrixDynamicModel => {
  const columns: Array<any> = [{ name: "a", cellType: "text", inputType: "number" }];
  if (!!expression) columns.push({ name: "e", cellType: "expression", expression: expression });
  const extra = !!surveyJson && !!surveyJson.elements ? surveyJson.elements : [];
  const survey = new SurveyModel(Object.assign({}, surveyJson, {
    elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0, columns: columns }, json)].concat(extra) }));
  survey.data = { m: records(count, (i: number) => ({ a: i })) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
};
const panelAs = (q: QuestionPanelDynamicModel): Array<any> => q.panels.map((panel: PanelModel) => panel.getQuestionByName("a").value);
const rowAs = (q: QuestionMatrixDynamicModel): Array<any> => q.visibleRows.map(row => row.getQuestionByColumnName("a").value);
const copyRecords = (val: any): Array<any> => JSON.parse(JSON.stringify(val));
/* The view - which records have an object, and in what order - is decided by a filter or a sort
   change, refreshView() or a read, and by an assignment of the value from outside the question. The
   question's own writes - the values its new objects write back, an add, an edit, a page build -
   never decide it: a record the respondent added or edited stays where it is. */
describe("Page window: the question's own writes keep the view", () => {
  test("panel: an add under a filter shows the new record while its expression writes back", () => {
    const q = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
    const panel = q.addPanel();
    expect(q.pageIndex, "#1").toBe(2);
    expect(panelAs(q), "#2: the record before it and the new one").toEqual([4, undefined]);
    expect(!!panel && panel === q.panels[1], "#3: the new panel is returned").toBe(true);
    expect(q.value.length, "#4").toBe(6);
    expect(q.value[5], "#5: the expression's result").toEqual({ e: 1 });
    q.refreshView();
    expect(panelAs(q), "#6: refreshView applies the filter to it").toEqual([4]);
  });
  test("matrix: an add under a filter shows the new record while its expression writes back", () => {
    const q = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
    q.visibleRows;
    q.addRow();
    expect(q.pageIndex, "#1").toBe(2);
    expect(rowAs(q), "#2: the record before it and the new one").toEqual([4, undefined]);
    expect(q.value.length, "#3").toBe(6);
    expect(q.value[5], "#4: the expression's result").toEqual({ e: 1 });
    q.refreshView();
    expect(rowAs(q), "#5: refreshView applies the filter to it").toEqual([4]);
  });
  test("panel: an add under a sort shows the new record on the page that holds it", () => {
    const q = createStablePanel({ panelsPerPage: 2, sortBy: "a-" }, 5, "1");
    q.nextPage();
    expect(panelAs(q), "#1").toEqual([2, 1]);
    q.addPanel(1);
    expect(q.pageIndex, "#2: the page of the new record").toBe(0);
    expect(panelAs(q), "#3: not sorted away").toEqual([4, undefined]);
    q.filterExpression = "{a} >= 0";
    expect(panelAs(q), "#4: a filter change applies the view to it").toEqual([4, 3]);
  });
  test("matrix: an add under a sort shows the new record where it was added", () => {
    const q = createStableMatrix({ rowsPerPage: 2, sortBy: "a-" }, 5, "1");
    q.visibleRows;
    q.nextPage();
    expect(rowAs(q), "#1").toEqual([2, 1]);
    // In front of the record at position 3 of the sorted view, the second row of page 1.
    q.addRowByIndex({ a: 7 }, 3);
    expect(q.pageIndex, "#2").toBe(1);
    expect(rowAs(q), "#3: not sorted away").toEqual([2, 7]);
    q.refreshView();
    expect(rowAs(q), "#4: refreshView sorts it").toEqual([3, 2]);
    const appended = createStableMatrix({ rowsPerPage: 2, sortBy: "a-" }, 5, "1");
    appended.visibleRows;
    appended.nextPage();
    appended.addRow();
    expect(appended.pageIndex, "#5").toBe(2);
    expect(rowAs(appended), "#6: an appended row is shown at the end").toEqual([0, undefined]);
  });
  test("panel: a page move after an edit the filter rejects keeps the membership", () => {
    const q = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 6, "{panel.a} * 2");
    q.panels[0].getQuestionByName("a").value = -5;
    expect(panelAs(q), "#1").toEqual([-5, 1]);
    q.nextPage();
    expect(panelAs(q), "#2: no record is skipped").toEqual([2, 3]);
    q.prevPage();
    expect(panelAs(q), "#3: the edited record is still shown").toEqual([-5, 1]);
    q.refreshView();
    expect(panelAs(q), "#4: refreshView applies the filter to it").toEqual([1, 2]);
  });
  test("matrix: a page move after an edit the filter rejects keeps the membership", () => {
    const q = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 6, "{row.a} * 2");
    q.visibleRows[0].getQuestionByColumnName("a").value = -5;
    expect(rowAs(q), "#1").toEqual([-5, 1]);
    q.pageIndex = 1;
    expect(rowAs(q), "#2: no record is skipped").toEqual([2, 3]);
    q.pageIndex = 0;
    expect(rowAs(q), "#3: the edited record is still shown").toEqual([-5, 1]);
    q.refreshView();
    expect(rowAs(q), "#4: refreshView applies the filter to it").toEqual([1, 2]);
  });
  [undefined, "{panel.a} * 2"].forEach((expression: string) => {
    test("panel: an edit the filter rejects or the sort would move keeps its place on the page, expression: " + expression, () => {
      const filtered = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 6, expression);
      filtered.nextPage();
      filtered.panels[0].getQuestionByName("a").value = -5;
      expect(panelAs(filtered), "#1").toEqual([-5, 3]);
      filtered.filterExpression = "{a} >= 1";
      expect(panelAs(filtered), "#2: a filter change applies the view to it").toEqual([1, 3]);
      const sorted = createStablePanel({ panelsPerPage: 2, sortBy: "a" }, 6, expression);
      sorted.nextPage();
      sorted.panels[0].getQuestionByName("a").value = 100;
      expect(panelAs(sorted), "#3").toEqual([100, 3]);
      sorted.sortBy = "a-";
      expect(panelAs(sorted), "#4: a sort change applies the view to it").toEqual([4, 3]);
    });
  });
  [undefined, "{row.a} * 2"].forEach((expression: string) => {
    test("matrix: an edit the filter rejects or the sort would move keeps its place on the page, expression: " + expression, () => {
      const filtered = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 6, expression);
      filtered.visibleRows;
      filtered.nextPage();
      filtered.visibleRows[0].getQuestionByColumnName("a").value = -5;
      expect(rowAs(filtered), "#1").toEqual([-5, 3]);
      filtered.filterExpression = "{a} >= 1";
      expect(rowAs(filtered), "#2: a filter change applies the view to it").toEqual([1, 3]);
      const sorted = createStableMatrix({ rowsPerPage: 2, sortBy: "a" }, 6, expression);
      sorted.visibleRows;
      sorted.nextPage();
      sorted.visibleRows[0].getQuestionByColumnName("a").value = 100;
      expect(rowAs(sorted), "#3").toEqual([100, 3]);
      sorted.sortBy = "a-";
      expect(rowAs(sorted), "#4: a sort change applies the view to it").toEqual([4, 3]);
    });
  });
  test("an added record is still shown after a page move away and back, with an expression", () => {
    const panel = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 4, "1");
    panel.addPanel().getQuestionByName("a").value = -1;
    panel.pageIndex = 0;
    panel.pageIndex = 2;
    expect(panelAs(panel), "#1: panel").toEqual([-1]);
    panel.refreshView();
    expect(panelAs(panel), "#2: refreshView applies the filter to it").toEqual([2, 3]);
    const matrix = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 4, "1");
    matrix.visibleRows;
    matrix.addRow();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = -1;
    matrix.pageIndex = 0;
    matrix.pageIndex = 2;
    expect(rowAs(matrix), "#3: matrix").toEqual([-1]);
    matrix.refreshView();
    expect(rowAs(matrix), "#4: refreshView applies the filter to it").toEqual([2, 3]);
  });
});
/* An assignment from outside the question - survey.setValue, question.value, a handler's - made while
   one of the question's own writes is open is followed once that write has ended, also when the write
   ends with an exception: the view is decided again over the assigned value then. */
describe("Page window: an assignment from outside made during the question's own write", () => {
  // The own store of the add that no list write covers: the values the new objects write back.
  const isOwnWriteBack = (q: any, value: any): boolean => !q.dataListValue.isWriting && Array.isArray(value) && value.length === 6;
  [{ name: "question.value", assign: (q: any, v: any) => { q.value = v; } },
    { name: "survey.setValue", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); } }].forEach(way => {
    test("an onValueChanging handler that assigns an unchanged value through " + way.name + " leaves the add the question's own", () => {
      const panel = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
      const matrix = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
      matrix.visibleRows;
      const calls = { p: 0, m: 0 };
      [panel, matrix].forEach((q: any) => {
        q.survey.onValueChanging.add((_, options) => {
          if (options.name !== q.name || calls[q.name] > 0 || !isOwnWriteBack(q, options.value)) return;
          calls[q.name]++;
          way.assign(q, copyRecords(q.value));
        });
      });
      panel.addPanel();
      matrix.addRow();
      expect(calls, "#1: both handlers ran during the write-back").toEqual({ p: 1, m: 1 });
      expect(panelAs(panel), "#2: panel").toEqual([4, undefined]);
      expect(rowAs(matrix), "#3: matrix").toEqual([4, undefined]);
    });
  });
  test("an onValueChanging handler that assigns a changed value makes an outside assignment: the view is decided again", () => {
    const panel = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
    const matrix = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
    matrix.visibleRows;
    const calls = { p: 0, m: 0 };
    [panel, matrix].forEach((q: any) => {
      q.survey.onValueChanging.add((_, options) => {
        if (options.name !== q.name || calls[q.name] > 0 || !isOwnWriteBack(q, options.value)) return;
        calls[q.name]++;
        const v = copyRecords(q.value);
        v[2] = { a: -1 };
        q.survey.setValue(q.name, v);
      });
    });
    panel.addPanel();
    matrix.addRow();
    expect(calls, "#1").toEqual({ p: 1, m: 1 });
    // The question's own store comes after the handler and is the last write; the view is decided
    // again once the add has ended, and the new record, which the add touched, keeps its place.
    expect(panelAs(panel), "#2: panel").toEqual([4, undefined]);
    expect(rowAs(matrix), "#3: matrix").toEqual([4, undefined]);
    panel.refreshView();
    matrix.refreshView();
    expect([panelAs(panel), rowAs(matrix)], "#4: the new record has no {a}").toEqual([[4], [4]]);
  });
  /* survey.onValueChanging runs after the question has stored the value and before the survey has: a
     nested assignment that throws there was stored already, and it is an assignment from outside. */
  test("an onValueChanging handler whose nested assignment throws: the error reaches the caller, and later writes keep their kind", () => {
    const q = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 5, "1");
    let isArmed = true;
    let depth = 0;
    q.survey.onValueChanging.add((_, options) => {
      if (!isArmed || options.name !== "p") return;
      if (depth > 0) throw new Error("handler");
      if (!isOwnWriteBack(q, options.value)) return;
      depth++;
      try {
        const v = copyRecords(q.value);
        v[0] = { a: 10 };
        q.value = v;
      } finally {
        depth--;
      }
    });
    expect(() => q.addPanel(), "#1").toThrow("handler");
    expect(q.value[0], "#2: the nested assignment was stored").toEqual({ a: 10 });
    isArmed = false;
    const panel = q.addPanel();
    expect(!!panel && panel === q.panels[q.panels.length - 1], "#3: a following add keeps its new record").toBe(true);
    expect(panel.getQuestionByName("a").value, "#4").toBeUndefined();
    const v = copyRecords(q.value);
    v[1] = { a: -9 };
    q.survey.setValue("p", v);
    q.pageIndex = 0;
    expect(panelAs(q), "#5: an assignment from outside is still one").toEqual([10, 2]);
  });
  /* onDynamicPanelValueChanging runs before the question stores the value: for a records question in a
     dynamic panel it is a handler that runs between the entry of an own assignment and its store. */
  test("matrix in a dynamic panel: an onDynamicPanelValueChanging handler that assigns an unchanged value leaves the add the question's own", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "outer", panelCount: 1, templateElements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2, filterExpression: "{a} >= 0",
        columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "e", cellType: "expression", expression: "1" }] }] }] });
    survey.data = { outer: [{ m: records(5, (i: number) => ({ a: i })) }] };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrix = <QuestionMatrixDynamicModel>outer.panels[0].getQuestionByName("m");
    matrix.visibleRows;
    let calls = 0;
    survey.onDynamicPanelValueChanging.add((_, options) => {
      if (options.name !== "m" || !isOwnWriteBack(matrix, options.value)) return;
      calls++;
      matrix.value = copyRecords(matrix.value);
    });
    matrix.addRow();
    expect(calls > 0, "#1: the handler ran before an own store").toBe(true);
    expect(rowAs(matrix), "#2").toEqual([4, undefined]);
  });
  [{ sortBy: undefined, page1: [3, 4] }, { sortBy: "a-", page1: [3, 1] }].forEach(view => {
    [{ name: "survey.setValue", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); } },
      { name: "question.value", assign: (q: any, v: any) => { q.value = v; } }].forEach(way => {
      test("an assignment through " + way.name + " inside an edit's list write is followed after it, sortBy: " + view.sortBy, () => {
        const json = { filterExpression: "{a} >= 0", sortBy: view.sortBy };
        const panel = createStablePanel(Object.assign({ panelsPerPage: 2 }, json), 6);
        const matrix = createStableMatrix(Object.assign({ rowsPerPage: 2 }, json), 6);
        [panel, matrix].forEach((q: any) => {
          let isDone = false;
          q.survey.onValueChanged.add((_, options) => {
            if (options.name !== q.name || isDone) return;
            isDone = true;
            const v = copyRecords(q.value);
            v[2] = { a: -1 };
            way.assign(q, v);
          });
        });
        panel.panels[0].getQuestionByName("a").value = 10;
        matrix.visibleRows[0].getQuestionByColumnName("a").value = 10;
        panel.pageIndex = 1;
        matrix.pageIndex = 1;
        expect(panelAs(panel), "#1: panel: the record is filtered out and the page refilled").toEqual(view.page1);
        expect(rowAs(matrix), "#2: matrix").toEqual(view.page1);
        expect(panel.value[2], "#3").toEqual({ a: -1 });
      });
    });
  });
  test("matrix: an assignment inside a list write that runs outside any change of the question's own is followed when the write ends", () => {
    const q = createStableMatrix({ filterExpression: "{a} >= 0", defaultRowValue: { a: 9 } }, 4);
    q.visibleRows;
    let calls = 0;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "m" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[1] = { a: -1 };
      q.survey.setValue("m", v);
    });
    q.addRow();
    expect(calls, "#1").toBe(1);
    expect(q.value, "#2").toEqual([{ a: 0 }, { a: -1 }, { a: 2 }, { a: 3 }, { a: 9 }]);
    expect(rowAs(q), "#3: the assigned record is filtered out").toEqual([0, 2, 3, 9]);
  });
  test("matrix: a list write whose handler assigns and throws: the error reaches the caller and the view follows at once", () => {
    const q = createStableMatrix({ filterExpression: "{a} >= 0", defaultRowValue: { a: 9 } }, 4);
    q.visibleRows;
    let isArmed = true;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "m" || !isArmed) return;
      isArmed = false;
      const v = copyRecords(q.value);
      v[1] = { a: -1 };
      q.survey.setValue("m", v);
      throw new Error("handler");
    });
    expect(() => q.addRow(), "#1").toThrow("handler");
    expect((<any>q).dataListValue.isWriting, "#2: the write is closed").toBe(false);
    expect(rowAs(q), "#3: decided again over the assigned value").toEqual([0, 2, 3, 9]);
    q.visibleRows[0].getQuestionByColumnName("a").value = -7;
    expect(rowAs(q), "#4: the next edit keeps its record").toEqual([-7, 2, 3, 9]);
    q.addRow();
    expect(rowAs(q), "#6: and so does the next add").toEqual([-7, 2, 3, 9, 9]);
  });
  test("panel: an assignment inside the count change's batch is followed when the batch ends", () => {
    const q = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 6);
    let calls = 0;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "p" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[2] = { a: -1 };
      q.survey.setValue("p", v);
    });
    q.panelCount = 8;
    expect(calls, "#1").toBe(1);
    q.pageIndex = 1;
    expect(panelAs(q), "#2").toEqual([3, 4]);
  });
  [{ name: "survey.setValue", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); }, isThrowing: false },
    { name: "question.value", assign: (q: any, v: any) => { q.value = v; }, isThrowing: false },
    { name: "survey.setValue, then throws", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); }, isThrowing: true }].forEach(way => {
    test("panel: an onDynamicPanelAdded handler that assigns through " + way.name + ": the assigned value wins and the new record stays", () => {
      const q = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 4);
      q.survey.onDynamicPanelAdded.add(() => {
        const v = copyRecords(q.value);
        v[4] = { a: -1 };
        way.assign(q, v);
        if (way.isThrowing) throw new Error("handler");
      });
      if (way.isThrowing) {
        expect(() => q.addPanel(), "#0").toThrow("handler");
      } else {
        q.addPanel();
      }
      expect(q.value[4], "#1").toEqual({ a: -1 });
      expect(q.pageIndex, "#2").toBe(2);
      expect(panelAs(q), "#3: the filter does not accept the new record, the add touched it").toEqual([-1]);
      q.refreshView();
      expect([q.pageIndex, panelAs(q)], "#4: refreshView applies the filter to it").toEqual([1, [2, 3]]);
    });
  });
  test("two assignments made inside one write: the page shows the records the last one left", () => {
    const q = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 6);
    let calls = 0;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "p" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[2] = { a: -1 };
      q.survey.setValue("p", v);
      const w = copyRecords(q.value);
      w[3] = { a: -1 };
      q.survey.setValue("p", w);
    });
    q.panels[0].getQuestionByName("a").value = 10;
    q.pageIndex = 1;
    expect(panelAs(q), "#2").toEqual([4, 5]);
  });
  test("an assignment from outside with no write open decides the view at once, the edited record keeps its place", () => {
    const panel = createStablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 6);
    panel.panels[0].getQuestionByName("a").value = -5;
    const v = copyRecords(panel.value);
    v[2] = { a: -1 };
    panel.survey.setValue("p", v);
    expect(panelAs(panel), "#1: panel").toEqual([-5, 1]);
    panel.nextPage();
    expect(panelAs(panel), "#2: the untouched record is filtered out").toEqual([3, 4]);
    const matrix = createStableMatrix({ rowsPerPage: 2, filterExpression: "{a} >= 0" }, 6);
    matrix.visibleRows[0].getQuestionByColumnName("a").value = -5;
    const w = copyRecords(matrix.value);
    w[2] = { a: -1 };
    matrix.survey.setValue("m", w);
    expect(rowAs(matrix), "#3: matrix").toEqual([-5, 1]);
    matrix.nextPage();
    expect(rowAs(matrix), "#4").toEqual([3, 4]);
  });
});
/* The records the respondent touched since the view was last decided - added by the question's add,
   or edited through a question that takes input - keep their places when an assignment from outside
   decides the view again: the other records are filtered and sorted. A reload, clearValue(), a filter
   or sort change and refreshView() drop them. */
describe("Page window: the records the respondent touched stay shown", () => {
  interface IStableKind {
    name: string;
    valueName: string;
    create(json: any, count: number, expression?: string, surveyJson?: any): any;
    shown(q: any): Array<any>;
    edit(q: any, position: number, value: any): void;
    sibling: any;
    editSibling(survey: SurveyModel, index: number, value: any): void;
  }
  const kinds: Array<IStableKind> = [
    {
      name: "panel", valueName: "p", create: createStablePanel, shown: panelAs,
      edit: (q, position, value) => { q.panels[position].getQuestionByName("a").value = value; },
      sibling: { type: "paneldynamic", name: "sibling", valueName: "p", templateElements: [{ type: "text", name: "a", inputType: "number" }] },
      editSibling: (survey, index, value) => { (<QuestionPanelDynamicModel>survey.getQuestionByName("sibling")).panels[index].getQuestionByName("a").value = value; }
    },
    {
      name: "matrix", valueName: "m", create: createStableMatrix, shown: rowAs,
      edit: (q, position, value) => { q.visibleRows[position].getQuestionByColumnName("a").value = value; },
      sibling: { type: "matrixdynamic", name: "sibling", valueName: "m", rowCount: 0, columns: [{ name: "a", cellType: "text", inputType: "number" }] },
      editSibling: (survey, index, value) => { (<QuestionMatrixDynamicModel>survey.getQuestionByName("sibling")).visibleRows[index].getQuestionByColumnName("a").value = value; }
    }
  ];
  const assignRecord = (q: any, index: number, record: any): void => {
    const v = copyRecords(q.value);
    v[index] = record;
    q.survey.setValue(q.getValueName(), v);
  };
  kinds.forEach(kind => {
    [{ name: "survey.setValue", setRecordTwo: (q: any) => { assignRecord(q, 2, { a: -1 }); } },
      { name: "a setvalue trigger", setRecordTwo: (q: any) => { q.survey.setValue("go", 1); } },
      { name: "a sibling on the same valueName", setRecordTwo: (q: any) => { kind.editSibling(q.survey, 2, -1); } }].forEach(way => {
      test(kind.name + ": an assignment through " + way.name + " filters the other records and keeps the edited one", () => {
        const value = [{ a: -5 }, { a: 1 }, { a: -1 }, { a: 3 }, { a: 4 }, { a: 5 }];
        const q = kind.create({ filterExpression: "{a} >= 0" }, 6, undefined, {
          elements: [kind.sibling, { type: "text", name: "go" }],
          triggers: [{ type: "setvalue", expression: "{go} = 1", setToName: kind.valueName, setValue: value }]
        });
        if (kind.name === "matrix") (<any>q.survey.getQuestionByName("sibling")).visibleRows;
        kind.edit(q, 0, -5);
        expect(kind.shown(q), "#1").toEqual([-5, 1, 2, 3, 4, 5]);
        way.setRecordTwo(q);
        expect(q.value.map((r: any) => r.a), "#2").toEqual([-5, 1, -1, 3, 4, 5]);
        expect(kind.shown(q), "#3: record 2 is filtered out, the edited record stays").toEqual([-5, 1, 3, 4, 5]);
      });
    });
    [0, 2].forEach(pageSize => {
      const paging = pageSize > 0 ? (kind.name === "panel" ? { panelsPerPage: pageSize } : { rowsPerPage: pageSize }) : {};
      test(kind.name + ": an assignment from outside sorts the other records and keeps the edited one, page size " + pageSize, () => {
        const q = kind.create(Object.assign({ sortBy: "a" }, paging), 6);
        kind.edit(q, 0, 100);
        assignRecord(q, 5, { a: -1 });
        expect(kind.shown(q), "#1").toEqual(pageSize > 0 ? [100, -1] : [100, -1, 1, 2, 3, 4]);
        q.refreshView();
        expect(kind.shown(q), "#2: refreshView sorts it").toEqual(pageSize > 0 ? [-1, 1] : [-1, 1, 2, 3, 4, 100]);
      });
      test(kind.name + ": an added record stays through an assignment from outside, page size " + pageSize, () => {
        const q = kind.create(Object.assign({ filterExpression: "{a} >= 0" }, paging), 4);
        if (kind.name === "panel") q.addPanel(); else { q.visibleRows; q.addRow(); }
        q.pageIndex = 0;
        kind.edit(q, 0, 10);
        const all = (): Array<any> => {
          if (pageSize === 0) return kind.shown(q);
          const res: Array<any> = [];
          for (let i = 0; i < q.pageCount; i++) {
            q.pageIndex = i;
            res.push(...kind.shown(q));
          }
          return res;
        };
        assignRecord(q, 4, { a: -3 });
        expect(all(), "#1: the new record has -3 and stays").toEqual([10, 1, 2, 3, -3]);
        assignRecord(q, 1, { a: -1 });
        expect(all(), "#2: an untouched record is filtered out").toEqual([10, 2, 3, -3]);
      });
    });
    test(kind.name + ": a touched record follows an assignment that inserts or removes a record in front of it", () => {
      const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
      kind.edit(q, 2, -5);
      const inserted = [{ a: -9 }].concat(copyRecords(q.value));
      q.survey.setValue(kind.valueName, inserted);
      expect(kind.shown(q), "#1: the inserted record is filtered out, the edited one stays").toEqual([0, 1, -5, 3, 4, 5]);
      assignRecord(q, 2, { a: -1 });
      // The touched record goes back to its position in the view: the record in front of it left.
      expect(kind.shown(q), "#2: the record that took index 2 is not the touched one").toEqual([0, 3, -5, 4, 5]);
      const removed = copyRecords(q.value);
      removed.splice(3, 1);
      q.survey.setValue(kind.valueName, removed);
      expect(kind.shown(q), "#3: an assignment that removes the touched record drops it").toEqual([0, 3, 4, 5]);
      assignRecord(q, 3, { a: -2 });
      expect(kind.shown(q), "#4: the record now at its index is not touched").toEqual([0, 4, 5]);
    });
    test(kind.name + ": an assignment that changes only the touched record keeps it touched", () => {
      const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
      kind.edit(q, 0, -5);
      assignRecord(q, 0, { a: -7 });
      expect(kind.shown(q), "#1").toEqual([-7, 1, 2, 3, 4, 5]);
      assignRecord(q, 3, { a: -1 });
      expect(kind.shown(q), "#2").toEqual([-7, 1, 2, 4, 5]);
    });
    test(kind.name + ": a computed value is not a touch", () => {
      const expression = kind.name === "panel" ? "{k} - {panel.a}" : "{k} - {row.a}";
      const q = kind.create({ filterExpression: "{e} >= 0" }, 0, expression, { elements: [{ type: "text", name: "k" }] });
      q.survey.setValue("k", 10);
      q.survey.setValue(kind.valueName, [0, 1, 2, 3, 4, 5].map((i: number) => ({ a: i, e: 10 - i })));
      expect(kind.shown(q), "#1").toEqual([0, 1, 2, 3, 4, 5]);
      q.survey.setValue("k", 2);
      expect(kind.shown(q), "#2: the recalculation is the question's own write").toEqual([0, 1, 2, 3, 4, 5]);
      const v = copyRecords(q.value);
      v[0].a = 1;
      q.survey.setValue(kind.valueName, v);
      expect(kind.shown(q), "#3: the next assignment from outside filters the recalculated records").toEqual([1, 1, 2]);
    });
    test(kind.name + ": the records a count grows by are not touched", () => {
      const q = kind.create({ filterExpression: "{a} >= 0" }, 3);
      if (kind.name === "panel") q.panelCount = 5; else q.rowCount = 5;
      expect(kind.shown(q), "#1: the padded records join the view").toEqual([0, 1, 2, undefined, undefined]);
      kind.edit(q, 3, 7);
      assignRecord(q, 0, { a: 10 });
      expect(kind.shown(q), "#2: the edited one stays, the padding is filtered out").toEqual([10, 1, 2, 7]);
    });
    [{ name: "survey.data =", reload: (q: any, v: any) => { q.survey.data = { [q.getValueName()]: v }; } },
      { name: "survey.mergeData", reload: (q: any, v: any) => { q.survey.mergeData({ [q.getValueName()]: v }); } },
      { name: "survey.setDataCore with the records it holds", reload: (q: any) => { q.survey.setDataCore({ [q.getValueName()]: copyRecords(q.value) }); } },
      { name: "survey.clear", reload: (q: any, v: any) => { q.survey.clear(); q.survey.setValue(q.getValueName(), v); } },
      { name: "clearValue", reload: (q: any, v: any) => { q.clearValue(); q.survey.setValue(q.getValueName(), v); } }].forEach(way => {
      test(kind.name + ": " + way.name + " decides the view again for the touched records too", () => {
        const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
        kind.edit(q, 0, -5);
        expect(kind.shown(q), "#1").toEqual([-5, 1, 2, 3, 4, 5]);
        way.reload(q, copyRecords(q.value));
        expect(kind.shown(q), "#2").toEqual([1, 2, 3, 4, 5]);
      });
    });
    [{ name: "refreshView()", change: (q: any) => { q.refreshView(); } },
      { name: "a filter change", change: (q: any) => { q.filterExpression = "{a} >= -100"; } },
      { name: "a sort change", change: (q: any) => { q.sortBy = "a"; } }].forEach(way => {
      test(kind.name + ": " + way.name + " drops the touched records", () => {
        const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
        kind.edit(q, 0, 7);
        way.change(q);
        assignRecord(q, 0, { a: -500 });
        expect(kind.shown(q).indexOf(-500), "#1: the formerly touched record is filtered out").toBe(-1);
      });
    });
    test(kind.name + ": an add is touched before the handlers of its own write run", () => {
      const isPanel = kind.name === "panel";
      const q = kind.create(isPanel ? { filterExpression: "{a} >= 0" } : { filterExpression: "{a} >= 0", defaultRowValue: { a: -3 } }, 4);
      if (!isPanel) q.visibleRows;
      let calls = 0;
      q.survey.onValueChanged.add((_, options) => {
        if (options.name !== kind.valueName || calls > 0 || !Array.isArray(options.value) || options.value.length !== 5) return;
        calls++;
        const v = copyRecords(q.value);
        v[1] = { a: -1 };
        q.survey.setValue(kind.valueName, v);
      });
      if (isPanel) q.addPanel(); else q.addRow();
      expect(calls, "#1").toBe(1);
      expect(kind.shown(q), "#2: the new record stays, the untouched one is filtered out").toEqual([0, 2, 3, isPanel ? undefined : -3]);
    });
    test(kind.name + ": an add at a position is touched before the handlers of its own write run", () => {
      const isPanel = kind.name === "panel";
      const q = kind.create({ filterExpression: "{a} >= 0" }, 4);
      if (!isPanel) q.visibleRows;
      let calls = 0;
      q.survey.onValueChanged.add((_, options) => {
        if (options.name !== kind.valueName || calls > 0 || !Array.isArray(options.value) || options.value.length !== 5) return;
        calls++;
        const v = copyRecords(q.value);
        const at = v.map((r: any) => r.a).indexOf(2);
        v[at] = { a: -1 };
        q.survey.setValue(kind.valueName, v);
      });
      if (isPanel) q.addPanel(1); else q.addRowByIndex({ a: -3 }, 1);
      expect(calls, "#1").toBe(1);
      const shown = kind.shown(q);
      expect(shown.indexOf(-1), "#2: the untouched record is filtered out").toBe(-1);
      expect(shown.indexOf(isPanel ? undefined : -3) > -1, "#3: the new record stays").toBe(true);
    });
  });
  test("panels follow the view after an assignment from outside when nothing is touched", () => {
    const q = createStablePanel({ filterExpression: "{a} >= 0" }, 6);
    const v = copyRecords(q.value);
    v[2] = { a: -1 };
    q.survey.setValue("p", v);
    expect(panelAs(q), "#1").toEqual([0, 1, 3, 4, 5]);
  });
  test("a touched record that an assignment moves from one end of the records to the other keeps its place", () => {
    const first = createStableMatrix({ sortBy: "a" }, 6);
    first.visibleRows[0].getQuestionByColumnName("a").value = 100;
    expect(rowAs(first), "#1: the edit keeps its place").toEqual([100, 1, 2, 3, 4, 5]);
    first.survey.setValue("m", [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 100 }]);
    expect(rowAs(first), "#2: moved from the first record to the last, it stays first").toEqual([100, 1, 2, 3, 4, 5]);
    const last = createStableMatrix({ sortBy: "a" }, 6);
    last.visibleRows[5].getQuestionByColumnName("a").value = -100;
    expect(rowAs(last), "#3").toEqual([0, 1, 2, 3, 4, -100]);
    last.survey.setValue("m", [{ a: -100 }, { a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    expect(rowAs(last), "#4: moved from the last record to the first, it stays last").toEqual([0, 1, 2, 3, 4, -100]);
  });
});
/* A row of the fixed matrix the respondent edited keeps its place through an answer assignment - its
   own answer may change or go: the row is the record. A rows change keeps it by row name, and a
   removed row leaves the set. */
describe("Page window: an edit through a question with a valueName touches its record", () => {
  const value = (): Array<any> => [{ a: 1, b: "x" }, { a: 2, b: "x" }, { a: 3, b: "z" }];
  const assignKeepingEveryRecord = (q: any): void => {
    const val = copyRecords(q.value);
    val[1].a = 22;
    q.value = val;
  };
  const runMatrix = (detailQuestion: any): Array<Array<any>> => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, filterExpression: "{b} = 'x'",
      columns: [{ name: "a", cellType: "text" }], detailPanelMode: "underRow", detailElements: [detailQuestion] }] });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    q.value = value();
    const rows = q.visibleRows;
    rows[0].showDetailPanel();
    rows[0].detailPanel.getQuestionByName(detailQuestion.name).value = "y";
    const afterEdit = q.visibleRows.map(r => r.getValue("a"));
    assignKeepingEveryRecord(q);
    return [afterEdit, q.visibleRows.map(r => r.getValue("a"))];
  };
  test("matrix: a detail question named after its field keeps the edited record shown after an outside assignment", () => {
    expect(runMatrix({ type: "text", name: "b" }), "#1").toEqual([[1, 2], [1, 22]]);
  });
  test("matrix: a detail question with a valueName keeps the edited record shown after an outside assignment", () => {
    expect(runMatrix({ type: "text", name: "bq", valueName: "b" }), "#1").toEqual([[1, 2], [1, 22]]);
  });
  test("panel: a template question with a valueName keeps the edited record shown after an outside assignment", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", filterExpression: "{b} = 'x'",
      templateElements: [{ type: "text", name: "a" }, { type: "text", name: "bq", valueName: "b" }] }] });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    q.value = value();
    q.panels[0].getQuestionByName("bq").value = "y";
    expect(q.panels.map(p => p.getQuestionByName("a").value), "#1").toEqual([1, 2]);
    assignKeepingEveryRecord(q);
    expect(q.panels.map(p => p.getQuestionByName("a").value), "#2").toEqual([1, 22]);
  });
});

describe("Fixed matrix: the rows the respondent edited stay shown", () => {
  const createSorted = (): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", sortBy: "a-",
      rows: ["r1", "r2", "r3", "r4"], columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: { r1: { a: "b" }, r2: { a: "c" }, r3: { a: "d" }, r4: { a: "e" } } };
    return { survey: survey, matrix: <QuestionMatrixDropdownModel>survey.getQuestionByName("m") };
  };
  const rowNames = (matrix: QuestionMatrixDropdownModel): Array<string> => matrix.visibleRows.map(row => row.rowName);
  test("an edited row keeps its place through answer assignments that change other rows, its own answer, or drop it", () => {
    const { survey, matrix } = createSorted();
    expect(rowNames(matrix), "#1").toEqual(["r4", "r3", "r2", "r1"]);
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "a";
    expect(rowNames(matrix), "#2: the edit keeps its place").toEqual(["r4", "r3", "r2", "r1"]);
    survey.setValue("m", { r1: { a: "f" }, r2: { a: "c" }, r3: { a: "d" }, r4: { a: "a" } });
    expect(rowNames(matrix), "#3: the others are sorted").toEqual(["r4", "r1", "r3", "r2"]);
    survey.setValue("m", { r1: { a: "f" }, r2: { a: "g" }, r3: { a: "d" }, r4: { a: "0" } });
    expect(rowNames(matrix), "#4: its own answer changed").toEqual(["r4", "r2", "r1", "r3"]);
    survey.setValue("m", { r1: { a: "f" }, r2: { a: "g" }, r3: { a: "h" } });
    expect(rowNames(matrix), "#5: its answer is gone").toEqual(["r4", "r3", "r2", "r1"]);
    matrix.refreshView();
    expect(rowNames(matrix)[0] === "r4", "#6: refreshView sorts it").toBe(false);
  });
  test("a rows change keeps an edited row by its name, and a removed row leaves the set", () => {
    const { survey, matrix } = createSorted();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "a";
    matrix.rows.splice(0, 0, new ItemValue("r0"));
    survey.setValue("m", Object.assign({}, survey.getValue("m"), { r0: { a: "z" } }));
    expect(rowNames(matrix), "#1: r4 keeps its place").toEqual(["r4", "r0", "r3", "r2", "r1"]);
    matrix.rows.splice(matrix.rows.map(row => row.value).indexOf("r4"), 1);
    matrix.rows.push(new ItemValue("r4"));
    survey.setValue("m", Object.assign({}, survey.getValue("m"), { r1: { a: "y" } }));
    expect(rowNames(matrix), "#2: the row that came back is not touched").toEqual(["r0", "r1", "r3", "r2", "r4"]);
  });
  test("clearValue() drops the edited rows", () => {
    const { survey, matrix } = createSorted();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "a";
    matrix.clearValue();
    survey.setValue("m", { r1: { a: "b" }, r2: { a: "c" }, r3: { a: "d" }, r4: { a: "a" } });
    expect(rowNames(matrix), "#1").toEqual(["r3", "r2", "r1", "r4"]);
  });
  test("paged: a rows change keeps an edited row of another page by its name, and the validation goes to its page", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rowsPerPage: 2,
      rows: ["r1", "r2", "r3", "r4"], columns: [{ name: "a", cellType: "text", validators: [{ type: "numeric" }] }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.nextPage();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "abc";
    matrix.prevPage();
    expect(matrix.pageIndex, "#1: a move back does not validate").toBe(0);
    matrix.rows.splice(0, 0, new ItemValue("x1"), new ItemValue("x2"));
    expect(survey.validate(), "#2: the edited row is still validated").toBe(false);
    expect(matrix.pageIndex, "#3: on the page of r3").toBe(2);
    expect(rowNames(matrix), "#4").toEqual(["r3", "r4"]);
  });
});
/* What a record contributes without an object. Page size 0 keeps every released result. With paging:
   invisible values are cleared on every page of a local question, value-only; expressions, defaults
   and totals cover the current page and the pages visited (a known limitation); plain data covers the
   current page of a dynamic panel; validation covers the current page and the edited records. */
describe("Page window: record semantics without an object", () => {
  /* The clear decides the visibility of every record over its stored values (one run of the condition
     each) and writes the value; the write re-decides it like any value change of a paged question. The
     cost grows with the record count, linearly, and only when the survey clears invisible values. */
  test("matrix with paging: clearInvisibleValues removes the records rowsVisibleIf hides on every page, value-only", () => {
    FunctionFactory.Instance.register("isShownRecord", function (params: Array<any>): boolean { return params[0] !== "hide"; });
    try {
      const run = (copies: number): any => {
        const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
          { type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2, rowsVisibleIf: "isShownRecord({row.a})",
            filterExpression: "{a} != 'out'",
            columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] }] });
        const data: Array<any> = [];
        for (let i = 0; i < copies; i++) {
          data.push({ a: "x", b: 1 }, { a: "hide", b: 2 }, { a: "y", b: 3 }, { a: "out", b: 4 }, { a: "z", b: 5 }, { a: "hide", b: 6 });
        }
        survey.data = { m: data };
        const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
        matrix.visibleRows[0].getQuestionByName("b").value = 10;
        expect(survey.data.m.length, "an ordinary edit clears nothing").toBe(6 * copies);
        survey.completeLastPage();
        return survey.data.m;
      };
      expect(run(1), "#1: the hidden records are gone, the filtered-out one stays")
        .toEqual([{ a: "x", b: 10 }, { a: "y", b: 3 }, { a: "out", b: 4 }, { a: "z", b: 5 }]);
      expect(run(10).length, "#2").toBe(40);
    } finally {
      FunctionFactory.Instance.unregister("isShownRecord");
    }
  });
  test("matrix over a source that pages itself: clearing invisible values on complete sends nothing to the source", async () => {
    const source = new PagedSource(records(6, i => ({ id: i, name: i % 2 === 0 ? "hide" : "n" + i })));
    const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
      { type: "matrixdynamic", name: "md", rowCount: 0, rowsPerPage: 3, rowsVisibleIf: "{row.name} != 'hide'", columns: matrixColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.dataSource = source;
    await flush();
    const reads = source.reads.length;
    survey.completeLastPage();
    await flush();
    expect(source.removes, "#1: nothing is removed from the source").toEqual([]);
    expect(source.updates, "#2: nothing is updated").toEqual([]);
    expect(source.reads.length, "#3: nothing is read").toBe(reads);
    expect(source.data.length, "#4").toBe(6);
  });
  test("matrix with a filter: displayValue formats every record, the ones the filter excludes included", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", filterExpression: "{c} = 2",
      columns: [{ name: "c", cellType: "dropdown", choices: [{ value: 1, text: "One" }, { value: 2, text: "Two" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ c: 1 }, { c: 2 }];
    expect(matrix.displayValue, "#1").toEqual([{ c: "One" }, { c: "Two" }]);
    expect(matrix.value, "#2: the answer is not changed").toEqual([{ c: 1 }, { c: 2 }]);
    matrix.sortBy = "c-";
    expect(matrix.displayValue, "#3: in record order under a sort").toEqual([{ c: "One" }, { c: "Two" }]);
  });
  test("with paging, expressions and totals cover the current page and the pages visited, and a visited record keeps its values", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2,
        columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "b", cellType: "expression", expression: "{row.a} * 2" }] },
      { type: "expression", name: "s", expression: "sumInArray({m}, 'b')" }] });
    survey.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    expect(survey.getValue("s"), "#1: the page shown").toBe(6);
    matrix.pageIndex = 2;
    expect(survey.getValue("s"), "#2: and the page visited now").toBe(16);
    matrix.pageIndex = 0;
    expect(survey.data.m.map((r: any) => r.b), "#3: the visited records keep what was computed, page 1 was never opened")
      .toEqual([2, 4, undefined, undefined, 10]);
    const unpaged = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0,
        columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "b", cellType: "expression", expression: "{row.a} * 2" }] },
      { type: "expression", name: "s", expression: "sumInArray({m}, 'b')" }] });
    unpaged.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }] };
    (<QuestionMatrixDynamicModel>unpaged.getQuestionByName("m")).visibleRows;
    expect(unpaged.getValue("s"), "#4: page size 0 covers every record").toBe(30);
  });
  test("with paging, a default value is written once per record, not again on a later visit", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", panelsPerPage: 2, panelCount: 0,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "d", defaultValueExpression: "'def' + {panelIndex}" }] }] });
    survey.data = { pd: records(6, i => ({ id: i })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels;
    expect(survey.data.pd.map((r: any) => r.d), "#1: the first page").toEqual(["def0", "def1", undefined, undefined, undefined, undefined]);
    question.panels[0].getQuestionByName("d").value = "changed";
    question.pageIndex = 1;
    question.pageIndex = 0;
    expect(question.panels[0].getQuestionByName("d").value, "#2: a visit does not write the default again").toBe("changed");
    expect(survey.data.pd.map((r: any) => r.d), "#3").toEqual(["changed", "def1", "def2", "def3", undefined, undefined]);
  });
  test("plain data: every record without paging, the current page of a dynamic panel with it", () => {
    const unpaged = createPanel({ panelCount: 0 }, records(5));
    expect(unpaged.getPlainData().data.length, "#1: page size 0").toBe(5);
    const paged = createPanel({ panelCount: 0, panelsPerPage: 2 }, records(5));
    paged.pageIndex = 1;
    expect(paged.getPlainData().data.map((item: any) => item.value.id), "#2: the current page (a known limitation)").toEqual([2, 3]);
  });
  test("without paging, the answers do not depend on the order the panels were visited in, in every display mode", () => {
    const run = (mode: string, order: Array<number>): any => {
      const survey = new SurveyModel({ elements: [
        { type: "paneldynamic", name: "pd", displayMode: mode, templateElements: [
          { type: "text", name: "a", inputType: "number" },
          { type: "text", name: "d", defaultValueExpression: "{panelIndex} * 10" },
          { type: "expression", name: "e", expression: "{panel.a} + {panel.d}" }] },
        { type: "expression", name: "total", expression: "sumInArray({pd}, 'e')" }] });
      survey.data = { pd: [{ a: 1 }, { a: 2 }, { a: 3 }] };
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      question.panels;
      order.forEach(i => { if (mode !== "list") question.currentIndex = i; });
      return survey.data;
    };
    ["list", "tab", "carousel"].forEach(mode => {
      const forward = run(mode, [0, 1, 2]);
      expect(run(mode, [2, 0, 1]), mode + ": the visit order does not matter").toEqual(forward);
      expect(forward.total, mode + ": every record is computed").toBe(36);
    });
  });
});
/* A dynamic panel that pages in memory builds panels for one page. Clearing invisible values gives
   the answer the same panel gives without paging: the records without a panel are cleared over their
   stored values, without building one. */
describe("Paged dynamic panel: clearing invisible values gives the unpaged answer", () => {
  const sixRecords = (create: (i: number) => any): Array<any> => records(6, create);
  const secretIfYes = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "{panel.show} = 'yes'" }];
  const showOnThree = (i: number): any => ({ show: i === 3 ? "yes" : "no", secret: "s" + i });
  const onlyThreeKeepsSecret = sixRecords((i: number): any => i === 3 ? { show: "yes", secret: "s3" } : { show: "no" });
  const complete = (panelJson: any, data: Array<any>, surveyJson?: any, extra?: Array<any>,
    before?: (survey: SurveyModel, question: QuestionPanelDynamicModel) => void): SurveyModel => {
    const survey = new SurveyModel(Object.assign({ clearInvisibleValues: "onComplete", elements:
      [Object.assign({ type: "paneldynamic", name: "pd" }, panelJson)].concat(extra || []) }, surveyJson));
    survey.mergeData({ pd: data });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels;
    if (!!before) before(survey, question);
    survey.completeLastPage();
    return survey;
  };
  // The same JSON and data with panelsPerPage 2 and without paging; returns the unpaged answer.
  const expectSameAsUnpaged = (panelJson: any, data: Array<any>, surveyJson?: any, extra?: Array<any>,
    before?: (survey: SurveyModel, question: QuestionPanelDynamicModel) => void): any => {
    const unpaged = complete(panelJson, Helpers.getUnbindValue(data), surveyJson, extra, before).data;
    const paged = complete(Object.assign({ panelsPerPage: 2 }, panelJson), Helpers.getUnbindValue(data), surveyJson, extra, before).data;
    expect(paged, "paged equals unpaged").toEqual(unpaged);
    return unpaged;
  };
  test("a template question hidden by its visibleIf loses its answer in every record", () => {
    expect(expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree)).pd).toEqual(onlyThreeKeepsSecret);
  });
  test("a question in a template panel hidden by the panel's visibleIf loses its answer in every record", () => {
    const template = [{ type: "text", name: "show" },
      { type: "panel", name: "box", visibleIf: "{panel.show} = 'yes'", elements: [{ type: "text", name: "secret" }] }];
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree)).pd).toEqual(onlyThreeKeepsSecret);
  });
  test("a record templateVisibleIf hides keeps its visible answers and loses the invisible ones", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "a" }, { type: "text", name: "secret", visibleIf: "{panel.a} = 'x'" }];
    const data = sixRecords((i: number): any => ({ show: i % 2 === 1 ? "hide" : "no", a: "y", secret: "s" + i }));
    expect(expectSameAsUnpaged({ templateVisibleIf: "{panel.show} != 'hide'", templateElements: template }, data).pd)
      .toEqual(sixRecords((i: number): any => ({ show: i % 2 === 1 ? "hide" : "no", a: "y" })));
  });
  test("clearIfInvisible none keeps every answer", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "{panel.show} = 'yes'", clearIfInvisible: "none" }];
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree)).pd).toEqual(sixRecords(showOnThree));
  });
  test("a hidden dropdown with an other answer loses the value and the comment", () => {
    const template = [{ type: "text", name: "show" },
      { type: "dropdown", name: "sel", choices: [1, 2], showOtherItem: true, visibleIf: "{panel.show} = 'yes'" }];
    const data = sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no", sel: "other", "sel-Comment": "text" + i }));
    expect(expectSameAsUnpaged({ templateElements: template }, data).pd)
      .toEqual(sixRecords((i: number): any => i === 3 ? { show: "yes", sel: "other", "sel-Comment": "text3" } : { show: "no" }));
  });
  test("a template question hidden by a survey value loses its answer in every record", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "{top} = 'yes'" }];
    const res = expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree), undefined, [{ type: "text", name: "top" }],
      (survey: SurveyModel): void => { survey.setValue("top", "no"); });
    expect(res.pd).toEqual(sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no" })));
  });
  test("a template question with visible false loses its answer in every record", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visible: false }];
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree)).pd)
      .toEqual(sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no" })));
  });
  test("a page visited and left is cleared as a page never opened", () => {
    const visit = (survey: SurveyModel, question: QuestionPanelDynamicModel): void => {
      question.pageIndex = 1;
      question.pageIndex = 0;
    };
    expect(expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree), undefined, undefined, visit).pd).toEqual(onlyThreeKeepsSecret);
  });
  test("clearInvisibleValues onHidden clears every record at completion", () => {
    expect(expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree), { clearInvisibleValues: "onHidden" }).pd)
      .toEqual(onlyThreeKeepsSecret);
  });
  test("onHiddenContainer: the dynamic panel hidden clears its value", () => {
    const res = expectSameAsUnpaged({ templateElements: secretIfYes, visibleIf: "{top} != 'hide'" }, sixRecords(showOnThree),
      { clearInvisibleValues: "onHiddenContainer" }, [{ type: "text", name: "top" }],
      (survey: SurveyModel): void => { survey.setValue("top", "hide"); });
    expect(res.pd).toBeUndefined();
  });
  test("onHiddenContainer: a template panel hidden by its visibleIf loses its questions' answers at completion and when the dynamic panel is hidden", () => {
    const template = [{ type: "text", name: "show" },
      { type: "panel", name: "box", visibleIf: "{panel.show} = 'yes'", elements: [{ type: "text", name: "secret" }] }];
    const surveyJson = { clearInvisibleValues: "onHiddenContainer" };
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree), surveyJson).pd, "#1: at completion").toEqual(onlyThreeKeepsSecret);
    // The dynamic panel keeps its value (clearIfInvisible none): only its records are cleaned up when it is hidden.
    const hideQuestion = (survey: SurveyModel): void => { survey.setValue("top", "hide"); };
    const res = expectSameAsUnpaged({ templateElements: template, visibleIf: "{top} != 'hide'", clearIfInvisible: "none" }, sixRecords(showOnThree),
      { clearInvisibleValues: "onHiddenContainer" }, [{ type: "text", name: "top" }], hideQuestion);
    expect(res.pd, "#2: the dynamic panel is the hidden container of every template question").toEqual(sixRecords((): any => ({})));
  });
  test("a record the filter excludes keeps its hidden answer, paged and unpaged", () => {
    const data = sixRecords(showOnThree);
    data[4].show = "out";
    const res = expectSameAsUnpaged({ templateElements: secretIfYes, filterExpression: "{show} != 'out'" }, data);
    expect(res.pd[4], "#1: excluded, kept").toEqual({ show: "out", secret: "s4" });
    expect(res.pd[5], "#2: shown and hidden, cleared").toEqual({ show: "no" });
  });
  test("known limitation: a records question nested in a record without a panel keeps the hidden values its own clean-up would clear", () => {
    const nestedPanel = { type: "paneldynamic", name: "inner", templateElements: [{ type: "text", name: "h", visibleIf: "false" }] };
    const nestedMatrix = { type: "matrixdynamic", name: "inner", rowCount: 0, rowsVisibleIf: "{row.c} != 'hide'", columns: [{ name: "c", cellType: "text" }] };
    [{ template: nestedPanel, record: (i: number): any => ({ inner: [{ h: "h" + i }] }), cleared: { inner: [{}] } },
      { template: nestedMatrix, record: (i: number): any => ({ inner: [{ c: "hide" }, { c: "c" + i }] }), cleared: (i: number): any => ({ inner: [{ c: "c" + i }] }) }]
      .forEach((nested: any, k: number) => {
        const res = complete({ panelsPerPage: 2, templateElements: [nested.template] }, sixRecords(nested.record)).data.pd;
        const cleared = (i: number): any => typeof nested.cleared === "function" ? nested.cleared(i) : nested.cleared;
        expect(res.slice(0, 2), "#" + k + ": the records with a panel are cleared").toEqual([cleared(0), cleared(1)]);
        expect(res.slice(2), "#" + k + ": the records without one keep the nested values").toEqual(sixRecords(nested.record).slice(2));
      });
  });
  test("an edit, a page move and a hide under onHidden leave the records without a panel as they are", () => {
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [
      { type: "paneldynamic", name: "pd", panelsPerPage: 2, templateElements: secretIfYes }] });
    survey.data = { pd: sixRecords(showOnThree) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels[0].getQuestionByName("show").value = "yes";
    question.panels[0].getQuestionByName("show").value = "no";
    question.pageIndex = 1;
    question.pageIndex = 0;
    expect(survey.data.pd[4], "#2: a record that never had a panel is not touched").toEqual({ show: "no", secret: "s4" });
    expect(survey.data.pd[0], "#3: the object hidden by the edit reacts, as released").toEqual({ show: "no" });
  });
  test("the pass clears the records without a panel and writes the value once", () => {
    FunctionFactory.Instance.register("isShownWhenYes", function (params: Array<any>): boolean { return params[0] === "yes"; });
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "isShownWhenYes({panel.show})" },
      { type: "text", name: "other", visibleIf: "isShownWhenYes({panel.show})" }];
    try {
      const run = (count: number): { writes: number, data: Array<any> } => {
        const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
          { type: "paneldynamic", name: "pd", panelsPerPage: 2, templateElements: template }] });
        // The page shown holds nothing to clear: the writes counted are the pass's.
        survey.data = { pd: records(count, (i: number): any => ({ show: i < 2 ? "yes" : "no", secret: "s" + i, other: "o" + i })) };
        const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
        question.panels;
        let writes = 0;
        survey.onValueChanged.add((_: SurveyModel, options: any): void => { if (options.name === "pd") writes++; });
        survey.completeLastPage();
        return { writes: writes, data: survey.data.pd };
      };
      const large = run(50);
      expect(large.data.slice(0, 3), "#1").toEqual([{ show: "yes", secret: "s0", other: "o0" }, { show: "yes", secret: "s1", other: "o1" }, { show: "no" }]);
      expect(large.writes, "#3: one value write").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("isShownWhenYes");
    }
  });
  test("page size 0: the unpaged answer is the released one", () => {
    expect(complete({ templateElements: secretIfYes }, sixRecords(showOnThree)).data.pd).toEqual(onlyThreeKeepsSecret);
  });
});
// A confirmation asked about a record on another page names it by its record object.
describe("Page window: a confirmed removal of a record on another page", () => {
  const holdConfirmations = (): { answer: (index: number, value: boolean) => void, restore: () => void } => {
    const old = settings.confirmActionAsync;
    const callbacks: Array<(res: boolean) => void> = [];
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { callbacks.push(callback); return true; };
    return { answer: (index: number, value: boolean): void => { callbacks[index](value); }, restore: (): void => { settings.confirmActionAsync = old; } };
  };
  test("matrix and panel: the record is removed when it is still there, and the answer is dropped when a write replaced it", () => {
    const confirmations = holdConfirmations();
    try {
      const matrix = createMatrix({ rowsPerPage: 5 }, records(20));
      matrix.removeRow(12, true);
      matrix.removeRow(13, true);
      matrix.value = matrix.value.map((r: any) => r.id === 13 ? Object.assign({}, r, { name: "edited" }) : r);
      confirmations.answer(0, true);
      confirmations.answer(1, true);
      expect(matrix.value.map((r: any) => r.id).indexOf(12), "#1: record 12 is removed").toBe(-1);
      expect(matrix.value.map((r: any) => r.id).indexOf(13) > -1, "#2: record 13 was replaced meanwhile: kept").toBe(true);
      const panel = createPanel({ panelsPerPage: 5 }, records(20));
      panel.removePanel(12, true);
      confirmations.answer(2, true);
      expect(panel.value.map((r: any) => r.id).indexOf(12), "#3: the panel's record 12 is removed").toBe(-1);
      expect(panelIds(panel), "#4: the page is as it was").toEqual([0, 1, 2, 3, 4]);
    } finally {
      confirmations.restore();
    }
  });
  test("matrix: the removal survives the question's own write of the record, and follows an insert in front of it", () => {
    const confirmations = holdConfirmations();
    try {
      const matrix = createMatrix({ rowsPerPage: 2 }, records(4));
      matrix.removeRow(3, true);
      matrix.setRowValue(3, { id: 3, name: "edited" });
      confirmations.answer(0, true);
      expect(matrix.value.map((r: any) => r.id), "#1: the record written by the question is removed").toEqual([0, 1, 2]);
      matrix.removeRow(2, true);
      matrix.addRowByIndex({ id: 9, name: "n9" }, 0);
      confirmations.answer(1, true);
      expect(matrix.value.map((r: any) => r.id), "#2: the record moved by the insert is removed").toEqual([9, 0, 1]);
    } finally {
      confirmations.restore();
    }
  });
  test("panel: the removal follows an insert in front of the record", () => {
    const confirmations = holdConfirmations();
    try {
      const panel = createPanel({ panelsPerPage: 2 }, records(4));
      panel.removePanel(3, true);
      panel.addPanel(0);
      confirmations.answer(0, true);
      expect(panel.value.map((r: any) => r.id), "#1").toEqual([undefined, 0, 1, 2]);
    } finally {
      confirmations.restore();
    }
  });
});

/* Records { a: "r0" } ... { a: "r5" }, two per page: page 1 shows the records at whole-view positions
   2 and 3 unless owner-hidden records shift them. Under paging a number names a record of the whole
   view, with the kind it has without paging: a created position counts the owner-hidden records, a
   visible position does not. */
describe("Paging: a number names the same record in every method", () => {
  const sixRecords = (extra?: (i: number) => any): Array<any> => records(6, (i: number) => Object.assign({ a: "r" + i }, !!extra ? extra(i) : {}));
  const createNumberedMatrix = (json: any, data?: Array<any>, columns?: Array<any>): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      columns: columns || [{ name: "a", cellType: "text" }] }, json)] });
    survey.data = { m: data || sixRecords() };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    return matrix;
  };
  const createNumberedPanel = (json: any, data?: Array<any>): QuestionPanelDynamicModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p",
      templateElements: [{ type: "text", name: "a" }] }, json)] });
    survey.data = { p: data || sixRecords() };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    question.panels;
    return question;
  };
  const fixedRows = ["r0", "r1", "r2", "r3", "r4", "r5"];
  const createNumberedFixed = (json: any, data?: any): QuestionMatrixDropdownModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdropdown", name: "f", rows: fixedRows,
      columns: [{ name: "a", cellType: "text" }] }, json)] });
    const value: any = {};
    fixedRows.forEach((name: string, i: number): void => { value[name] = { a: "v" + i }; });
    survey.data = { f: data || value };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("f");
    matrix.visibleRows;
    return matrix;
  };
  const as = (val: Array<any>): Array<any> => val.map((r: any): any => !!r ? r.a : r);
  const rowA = (m: QuestionMatrixDynamicModel): Array<any> => m.visibleRows.map(row => row.getQuestionByColumnName("a").value);
  const panelA = (q: QuestionPanelDynamicModel): Array<any> => q.panels.map((panel: PanelModel) => panel.getQuestionByName("a").value);
  // What each method acts on for the number n, each on a new matrix that shows page `page` first.
  const probeMatrix = (json: any, n: number, page: number = 0): any => {
    const create = (): QuestionMatrixDynamicModel => {
      const m = createNumberedMatrix(json);
      if (page > 0) m.pageIndex = page;
      return m;
    };
    const res: any = {};
    let m = create();
    const rowValue = m.getRowValue(n);
    res.get = !!rowValue ? rowValue.a : rowValue;
    m = create();
    m.setRowValue(n, { a: "X" });
    res.set = as(m.value);
    m = create();
    const question = m.getQuestionFromArray("a", n);
    res.question = !!question ? question.value : question;
    m = create();
    m.moveRowByIndex(0, n);
    res.move = as(m.value);
    m = create();
    m.addRowByIndex({ a: "N" }, n);
    res.add = as(m.value);
    m = create();
    m.removeRowByIndex(n);
    res.remove = as(m.value);
    return res;
  };
  const r = (...items: Array<number | string>): Array<string> => items.map((i: any): string => typeof i === "number" ? "r" + i : i);
  const setups: Array<{ name: string, json: any, unpaged: any }> = [
    { name: "plain", json: {}, unpaged: { get: "r3", set: r(0, 1, 2, "X", 4, 5), question: "r3",
      move: r(1, 2, 3, 0, 4, 5), add: r(0, 1, 2, "N", 3, 4, 5), remove: r(0, 1, 2, 4, 5) } },
    { name: "a sort", json: { sortBy: "a-" }, unpaged: { get: "r2", set: r(0, 1, "X", 3, 4, 5), question: "r2",
      move: r(0, 1, 5, 2, 3, 4), add: r(0, 1, "N", 2, 3, 4, 5), remove: r(0, 1, 3, 4, 5) } },
    { name: "a filter", json: { filterExpression: "{a} != 'r0'" }, unpaged: { get: "r4", set: r(0, 1, 2, 3, "X", 5), question: "r4",
      move: r(0, 2, 3, 4, 1, 5), add: r(0, 1, 2, 3, "N", 4, 5), remove: r(0, 1, 2, 3, 5) } },
    { name: "owner-hidden records", json: { rowsVisibleIf: "{row.a} != 'r1'" }, unpaged: { get: "r3", set: r(0, 1, 2, 3, "X", 5), question: "r4",
      move: r(1, 2, 3, 0, 4, 5), add: r(0, 1, 2, "N", 3, 4, 5), remove: r(0, 1, 2, 4, 5) } }
  ];
  setups.forEach((setup) => {
    test("matrix, " + setup.name + ": without paging every method keeps its kind, and on page 1 the same number names the same record", () => {
      expect(probeMatrix(setup.json, 3), "#1: without paging").toEqual(setup.unpaged);
      const paged = Object.assign({ rowsPerPage: 2 }, setup.json);
      expect(probeMatrix(paged, 3, 1), "#2: page 1").toEqual(setup.unpaged);
      [0, 4].forEach((n: number): void => {
        const expected = Object.assign({}, probeMatrix(setup.json, n), { question: null });
        expect(probeMatrix(paged, n, 1), "#3: number " + n + " is on another page").toEqual(expected);
      });
    });
  });
  test("matrix: a record on another page is read and written by value, nothing is built, the page stays, nothing is reported", () => {
    const m = createNumberedMatrix({ rowsPerPage: 2, rowsVisibleIf: "{row.a} != 'r1'" });
    m.pageIndex = 1;
    const survey = <SurveyModel>m.survey;
    let cells = 0;
    const errors: Array<string> = [];
    survey.onMatrixCellCreated.add(() => { cells++; });
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    const rows = m.visibleRows.slice();
    expect(m.getRowValue(1), "#1: a created position, the hidden record").toEqual({ a: "r1" });
    expect(m.getQuestionFromArray("a", 1), "#2: a visible position, off the page").toBeNull();
    m.setRowValue(4, { a: "X" });
    expect(as(m.value), "#3: visible position 4 is r5").toEqual(r(0, 1, 2, 3, 4, "X"));
    expect(m.pageIndex, "#4").toBe(1);
    expect(cells, "#5: no row was built").toBe(0);
    expect(m.visibleRows.every((row, i) => row === rows[i]), "#6: the rows of the page stay").toBe(true);
    expect(rowA(m), "#7").toEqual(["r3", "r4"]);
    expect(errors, "#8").toEqual([]);
  });
  test("panel: getQuestionFromArray takes a created position of the whole view, null off the page", () => {
    const hidden = { templateVisibleIf: "{panel.a} != 'r1'" };
    const unpaged = createNumberedPanel(hidden);
    expect([0, 1, 3, 5].map(n => unpaged.getQuestionFromArray("a", n).value), "#1: without paging, created positions").toEqual(r(0, 1, 3, 5));
    const paged = createNumberedPanel(Object.assign({ panelsPerPage: 2 }, hidden));
    paged.pageIndex = 1;
    expect(panelA(paged), "#2").toEqual(["r3", "r4"]);
    let built = 0;
    paged.survey.onDynamicPanelAdded.add(() => { built++; });
    expect([3, 4].map(n => paged.getQuestionFromArray("a", n).value), "#3: on page 1").toEqual(r(3, 4));
    expect([0, 1, 2, 5, 6].map(n => paged.getQuestionFromArray("a", n)), "#4: off the page").toEqual([null, null, null, null, null]);
    expect(paged.pageIndex, "#5").toBe(1);
    expect(built, "#6").toBe(0);
    expect(paged.survey.getQuestionByValueNameFromArray("p", "a", 3).value, "#7: the survey lookup follows").toBe("r3");
    expect(paged.survey.getQuestionByValueNameFromArray("p", "a", 0), "#8").toBeNull();
  });
  test("survey.getQuestionByValueNameFromArray follows the matrix's visible positions", () => {
    const m = createNumberedMatrix({ rowsPerPage: 2, rowsVisibleIf: "{row.a} != 'r1'" });
    m.pageIndex = 1;
    expect(m.survey.getQuestionByValueNameFromArray("m", "a", 3).value, "#1").toBe("r4");
    expect(m.survey.getQuestionByValueNameFromArray("m", "a", 1), "#2").toBeNull();
  });
  test("fixed matrix: getRowValue, setRowValue and getQuestionFromArray name the same rows as without paging", () => {
    const probe = (json: any, n: number, page: number): any => {
      const create = (): QuestionMatrixDropdownModel => {
        const f = createNumberedFixed(json);
        if (page > 0) f.pageIndex = page;
        return f;
      };
      let f = create();
      const get = f.getRowValue(n);
      f = create();
      f.setRowValue(n, { a: "X" });
      const set = Object.keys(f.value).filter(key => f.value[key].a === "X");
      f = create();
      const question = f.getQuestionFromArray("a", n);
      return { get: !!get ? get.a : get, set: set, question: !!question ? question.value : question };
    };
    const hidden = { rowsVisibleIf: "{item} != 'r1'" };
    expect(probe(hidden, 3, 0), "#1: without paging").toEqual({ get: "v3", set: ["r4"], question: "v4" });
    expect(probe(Object.assign({ rowsPerPage: 2 }, hidden), 3, 1), "#2: page 1").toEqual({ get: "v3", set: ["r4"], question: "v4" });
    expect(probe(Object.assign({ rowsPerPage: 2 }, hidden), 0, 1), "#3: another page").toEqual({ get: "v0", set: ["r0"], question: null });
    expect(probe({ rowsPerPage: 2 }, 3, 1), "#4: page 1, nothing hidden").toEqual({ get: "v3", set: ["r3"], question: "v3" });
  });
  test("one number, one record: getRowValue names what removeRowByIndex removes, getQuestionFromArray what removeRow removes", () => {
    const removedBy = (json: any, remove: (m: QuestionMatrixDynamicModel) => void): string => {
      const m = createNumberedMatrix(json);
      m.pageIndex = 1;
      const before = as(m.value);
      remove(m);
      const after = as(m.value);
      return before.filter(a => after.indexOf(a) < 0)[0];
    };
    [{ rowsPerPage: 2 }, { rowsPerPage: 2, sortBy: "a-" }, { rowsPerPage: 2, filterExpression: "{a} != 'r2'" },
      { rowsPerPage: 2, rowsVisibleIf: "{row.a} != 'r1' and {row.a} != 'r4'" }].forEach((json: any, i: number): void => {
      for (let n = 0; n < 6; n++) {
        const read = createNumberedMatrix(json);
        read.pageIndex = 1;
        const value = read.getRowValue(n);
        expect(removedBy(json, m => m.removeRowByIndex(n)), "#1: setup " + i + ", created position " + n).toBe(!!value ? value.a : undefined);
        const question = read.getQuestionFromArray("a", n);
        if (!!question) {
          expect(removedBy(json, m => m.removeRow(n)), "#2: setup " + i + ", visible position " + n).toBe(question.value);
        }
      }
    });
  });
  test("the stored record is read whole, on the page and off it, and unbound", () => {
    const data = sixRecords((i: number) => ({ id: i, extra: "keep" }));
    const m = createNumberedMatrix({ rowsPerPage: 2 }, data);
    m.pageIndex = 1;
    expect(m.getRowValue(2), "#1: a record with a row").toEqual({ a: "r2", id: 2, extra: "keep" });
    expect(m.getItemData(m.visibleRows[1]), "#2: getItemData").toEqual({ a: "r3", id: 3, extra: "keep" });
    const off = m.getRowValue(5);
    expect(off, "#3: a record off the page").toEqual({ a: "r5", id: 5, extra: "keep" });
    off.extra = "changed";
    m.getRowValue(2).extra = "changed";
    expect(m.value[5].extra, "#4: unbound").toBe("keep");
    expect(m.value[2].extra, "#5").toBe("keep");
    const fixedValue: any = {};
    fixedRows.forEach((name: string, i: number): void => { fixedValue[name] = { a: "v" + i, extra: "keep" }; });
    const f = createNumberedFixed({ rowsPerPage: 2 }, fixedValue);
    f.pageIndex = 1;
    expect(f.getRowValue(3), "#6: fixed matrix, a row on the page").toEqual({ a: "v3", extra: "keep" });
    expect(f.getRowValue(0), "#7: fixed matrix, off the page").toEqual({ a: "v0", extra: "keep" });
    expect(f.getItemData(f.visibleRows[0]), "#8").toEqual({ a: "v2", extra: "keep" });
    f.getRowValue(0).extra = "changed";
    expect(f.value.r0.extra, "#9: unbound").toBe("keep");
  });
  test("an off-page setRowValue writes what assigning a row would: the column fields give way, the others stay", () => {
    const data = sixRecords((i: number) => ({ id: i, b: "b" + i }));
    const m = createNumberedMatrix({ rowsPerPage: 2 }, data, [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]);
    const unpaged = createNumberedMatrix({}, sixRecords((i: number) => ({ id: i, b: "b" + i })), [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]);
    m.pageIndex = 1;
    m.setRowValue(0, { a: "X", c: "new" });
    unpaged.setRowValue(0, { a: "X", c: "new" });
    expect(m.value[0], "#1").toEqual({ a: "X", id: 0, c: "new" });
    expect(m.value[0], "#2: as without paging").toEqual(unpaged.value[0]);
  });
});

describe("Paging: the core callers act on the record of their row", () => {
  const nineRecords = (): Array<any> => records(9, (i: number) => ({ a: "r" + i }));
  const as = (val: Array<any>): Array<any> => val.map((r: any): any => !!r ? r.a : r);
  const createCallerSurvey = (json: any, data?: Array<any>, columns?: Array<any>, extra?: Array<any>): SurveyModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      columns: columns || [{ name: "a", cellType: "text" }] }, json)].concat(extra || []) });
    survey.data = { m: data || nineRecords() };
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows;
    return survey;
  };
  const drop = (survey: SurveyModel, from: QuestionMatrixDynamicModel, row: any, to: QuestionMatrixDynamicModel, toIndex: number): void => {
    const dd: any = new DragDropMatrixRows(survey, null, true);
    dd.parentElement = from;
    dd.draggedElement = row;
    dd.fromIndex = from.visibleRows.indexOf(row);
    dd.toIndex = toIndex;
    dd.toMatrix = to;
    dd.doDrop();
  };
  [{ name: "page 1", page: 1, json: { rowsPerPage: 3 } }, { name: "page 2 of three", page: 2, json: { rowsPerPage: 3 } },
    { name: "page 1 with an owner-hidden record", page: 1, json: { rowsPerPage: 3, rowsVisibleIf: "{row.a} != 'r4'" } }].forEach((setup) => {
    test(setup.name + ": a cell edit and getItemData", () => {
      const survey = createCallerSurvey(setup.json);
      const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      m.pageIndex = setup.page;
      const row = m.visibleRows[1];
      const own = row.getQuestionByColumnName("a").value;
      expect(m.getItemData(row), "#1").toEqual({ a: own });
      row.getQuestionByColumnName("a").value = "E";
      expect(as(m.value).filter(a => a === "E" || a === own), "#2: the row's own record").toEqual(["E"]);
      expect(as(m.value).indexOf("E"), "#3").toBe(Number(own.substring(1)));
    });
  });
  test("page 1: clearIncorrectValues clears the keys of each row's own record", () => {
    const data = nineRecords();
    data[4].junk = 1;
    data[4].c = "y";
    const survey = createCallerSurvey({ rowsPerPage: 3 }, data, [{ name: "a", cellType: "text" }, { name: "c", cellType: "dropdown", choices: ["x", "y"] }]);
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.pageIndex = 1;
    m.columns[1].choices = ["x"];
    m.clearIncorrectValues();
    expect(m.value[4], "#1: the unknown key and the value the choices lost").toEqual({ a: "r4" });
    expect(m.value.filter((rec: any, i: number) => i !== 4).every((rec: any) => Object.keys(rec).length === 1), "#2: the others are as they were").toBe(true);
  });
  test("page 1: a key in the detail panel of rows that never opened it is compared by each row's own record", () => {
    const data = records(9, (i: number) => ({ a: "r" + i, u: "u" + i }));
    const survey = createCallerSurvey({ rowsPerPage: 3, keyName: "u", detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "u" }] }, data);
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.pageIndex = 1;
    const row = m.visibleRows[0];
    row.showDetailPanel();
    const key = <Question>row.detailPanel.getQuestionByName("u");
    const isDuplicated = (value: string): boolean => {
      key.value = value;
      return m.checkIfValueInRowDuplicated(row, key);
    };
    expect(isDuplicated("u4"), "#1: the key of r4, a row on the page without its detail panel").toBe(true);
    expect(isDuplicated("u5"), "#2").toBe(true);
    expect(isDuplicated("u7"), "#3: a record on another page").toBe(true);
    expect(isDuplicated("zz"), "#4").toBe(false);
  });
  test("page 1: a drag inside the matrix moves the dragged record, forward and backward", () => {
    const move = (json: any, page: number, from: number, to: number): Array<any> => {
      const survey = createCallerSurvey(json);
      const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      m.pageIndex = page;
      drop(survey, m, m.visibleRows[from], m, to);
      return as(m.value);
    };
    expect(move({ rowsPerPage: 3 }, 1, 0, 3), "#1: r3 below r5").toEqual(["r0", "r1", "r2", "r4", "r5", "r3", "r6", "r7", "r8"]);
    expect(move({ rowsPerPage: 3 }, 1, 2, 0), "#2: r5 above r3").toEqual(["r0", "r1", "r2", "r5", "r3", "r4", "r6", "r7", "r8"]);
    const hidden = { rowsPerPage: 3, rowsVisibleIf: "{row.a} != 'r4'" };
    expect(move(hidden, 1, 0, 3), "#3: r3 below r6, r4 hidden").toEqual(["r0", "r1", "r2", "r4", "r5", "r6", "r3", "r7", "r8"]);
    expect(move(hidden, 1, 2, 1), "#4: r6 above r5").toEqual(["r0", "r1", "r2", "r3", "r4", "r6", "r5", "r7", "r8"]);
    expect(move({ rowsPerPage: 3 }, 2, 2, 0), "#5: page 2, r8 above r6").toEqual(["r0", "r1", "r2", "r3", "r4", "r5", "r8", "r6", "r7"]);
  });
  test("a drag between matrices carries the dragged record into the place it is dropped at", () => {
    const transfer = (json1: any, page1: number, row: number, json2: any, page2: number, toIndex: number): { from: Array<any>, to: Array<any>, page: number } => {
      const survey = new SurveyModel({ elements: [
        Object.assign({ type: "matrixdynamic", name: "m1", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }, json1),
        Object.assign({ type: "matrixdynamic", name: "m2", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }, json2)] });
      survey.data = { m1: nineRecords(), m2: records(6, (i: number) => ({ a: "t" + i })) };
      const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
      const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
      m1.visibleRows;
      m2.visibleRows;
      m1.pageIndex = page1;
      m2.pageIndex = page2;
      drop(survey, m1, m1.visibleRows[row], m2, toIndex);
      return { from: as(m1.value), to: as(m2.value), page: m2.pageIndex };
    };
    const without = (n: number): Array<string> => nineRecords().map((rec: any) => rec.a).filter((a: string) => a !== "r" + n);
    expect(transfer({ rowsPerPage: 3 }, 1, 1, {}, 0, 2), "#1: from page 1 into an unpaged matrix")
      .toEqual({ from: without(4), to: ["t0", "t1", "r4", "t2", "t3", "t4", "t5"], page: 0 });
    expect(transfer({}, 0, 1, { rowsPerPage: 2 }, 1, 0), "#2: into page 1, before the first row")
      .toEqual({ from: without(1), to: ["t0", "t1", "r1", "t2", "t3", "t4", "t5"], page: 1 });
    expect(transfer({}, 0, 1, { rowsPerPage: 2 }, 1, 1), "#3: between the rows")
      .toEqual({ from: without(1), to: ["t0", "t1", "t2", "r1", "t3", "t4", "t5"], page: 1 });
    expect(transfer({}, 0, 1, { rowsPerPage: 2 }, 1, 2), "#4: after the last row: its page is shown")
      .toEqual({ from: without(1), to: ["t0", "t1", "t2", "t3", "r1", "t4", "t5"], page: 2 });
    expect(transfer({ rowsPerPage: 3 }, 2, 0, { rowsPerPage: 2 }, 1, 1), "#5: page to page")
      .toEqual({ from: without(6), to: ["t0", "t1", "t2", "r6", "t3", "t4", "t5"], page: 1 });
  });
  test("without paging the drag passes the numbers it always has, the rowsVisibleIf quirk included", () => {
    const survey = createCallerSurvey({ rowsVisibleIf: "{row.a} != 'r1'" });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    // r0 dragged below r2: visible positions are passed where created ones are taken, so r1 is the one passed.
    drop(survey, m, m.visibleRows[0], m, 2);
    expect(as(m.value).slice(0, 3), "#1").toEqual(["r1", "r0", "r2"]);
    const plain = createCallerSurvey({});
    const pm = <QuestionMatrixDynamicModel>plain.getQuestionByName("m");
    drop(plain, pm, pm.visibleRows[0], pm, 3);
    expect(as(pm.value).slice(0, 4), "#2").toEqual(["r1", "r2", "r0", "r3"]);
  });
  test("getRowViewIndex: a row's created position in the whole view, its position among the rows without paging", () => {
    const view = (json: any, page: number): Array<number> => {
      const survey = createCallerSurvey(json);
      const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      m.pageIndex = page;
      return m.visibleRows.map(row => m.getRowViewIndex(row));
    };
    expect(view({ rowsPerPage: 3 }, 1), "#1: page 1").toEqual([3, 4, 5]);
    expect(view({ rowsPerPage: 3 }, 2), "#2: page 2").toEqual([6, 7, 8]);
    expect(view({ rowsPerPage: 3, rowsVisibleIf: "{row.a} != 'r1' and {row.a} != 'r4'" }, 1), "#3: hidden r1 and r4 are counted").toEqual([5, 6, 7]);
    expect(view({ rowsVisibleIf: "{row.a} != 'r1'" }, 0).slice(0, 3), "#4: without paging, the position in generatedVisibleRows").toEqual([0, 2, 3]);
    const other = createCallerSurvey({ rowsPerPage: 3 });
    const m = <QuestionMatrixDynamicModel>other.getQuestionByName("m");
    const survey = createCallerSurvey({ rowsPerPage: 3 });
    expect((<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).getRowViewIndex(m.visibleRows[0]), "#5: a row of another matrix").toBe(-1);
  });
  test("a tester target addresses the page collection", () => {
    const survey = createCallerSurvey({ rowsPerPage: 3 }, undefined, undefined,
      [{ type: "paneldynamic", name: "p", panelsPerPage: 3, templateElements: [{ type: "text", name: "a" }] }]);
    survey.setValue("p", nineRecords());
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    m.pageIndex = 1;
    p.pageIndex = 1;
    expect(SurveyTestTargets.resolve(survey, "m[0].a").obj === m.visibleRows[0].getQuestionByColumnName("a"), "#1").toBe(true);
    expect(SurveyTestTargets.resolve(survey, "p[1].a").obj === p.panels[1].getQuestionByName("a"), "#2").toBe(true);
    expect(SurveyTestTargets.resolve(survey, "p[1].a").obj.value, "#3").toBe("r4");
  });
});

/* The window of a source that pages itself may hold more records than the source counts: a record
   added on the page stays shown where it was added, wherever the source put it. */
describe("Paging: every record shown is reachable by its number", () => {
  // Stores a new record at the front, an earlier page than the one it was added on.
  const frontSource = (count: number): PagedSource => {
    const source: any = new PagedSource(records(count, (i: number) => ({ id: i, a: "r" + i })));
    source.insert = (record: any): Promise<any> => {
      const stored = Object.assign({ id: 100 + source.data.length }, record);
      source.data.unshift(stored);
      return Promise.resolve(Object.assign({}, stored));
    };
    return source;
  };
  const setUp = async (kind: string): Promise<{ question: any, source: PagedSource }> => {
    const source = frontSource(11);
    const question: any = kind === "matrix" ?
      createMatrix({ rowsPerPage: 5, defaultRowValue: { a: "new" }, columns: [{ name: "a", cellType: "text" }] }) :
      createPanel({ panelsPerPage: 5, panelCount: 0, displayMode: "tab", defaultPanelValue: { a: "new" }, templateElements: [{ type: "text", name: "a" }] });
    if (kind === "matrix") question.visibleRows; else question.panels;
    question.dataSource = source;
    await flush();
    question.pageIndex = 1;
    await flush();
    if (kind === "matrix") question.addRow(); else {
      question.currentIndex = 9;
      question.addPanel();
    }
    await flush();
    // Two removes, and the refill of the second: the window ends past the total.
    if (kind === "matrix") question.removeRow(5, false); else question.removePanel(5);
    await flush();
    if (kind === "matrix") question.removeRow(5, false); else question.removePanel(5);
    await flush();
    return { question: question, source: source };
  };
  const shownA = (question: any): Array<any> => (question.visibleRows || question.panels).map((obj: any) => obj.getQuestionByName("a").value);
  test("matrix: getRowValue, getQuestionFromArray, removeRow and removeRowByIndex reach the last record shown", async () => {
    const { question, source } = await setUp("matrix");
    expect(question.rowCount, "#1: the count is the total").toBe(10);
    expect(question.pageCount, "#2").toBe(2);
    const shown = shownA(question);
    const last = shown.length - 1;
    expect(5 + last >= question.rowCount, "#3: the window ends past the total").toBe(true);
    expect(question.getRowValue(5 + last).a, "#4").toBe(shown[last]);
    expect(question.getQuestionFromArray("a", 5 + last).value, "#5").toBe(shown[last]);
    expect(question.getRowValue(6 + last), "#6: past the window").toBeNull();
    const removes = (source.removes || []).length;
    question.removeRowByIndex(6 + last);
    await flush();
    expect(source.removes.length, "#7: a number past the shown extent is rejected").toBe(removes);
    question.removeRow(5 + last, false);
    await flush();
    expect(source.removes.length, "#8: removeRow reaches it").toBe(removes + 1);
  });
  test("matrix: removeRowByIndex reaches the last record shown", async () => {
    const { question, source } = await setUp("matrix");
    const last = shownA(question).length - 1;
    const removes = source.removes.length;
    question.removeRowByIndex(5 + last);
    await flush();
    expect(source.removes.length, "#1").toBe(removes + 1);
  });
  test("panel: getQuestionFromArray, currentIndex and removePanel reach the last record shown", async () => {
    const { question, source } = await setUp("panel");
    expect(question.panelCount, "#1: the count is the total").toBe(10);
    expect(question.visiblePanelCount, "#2").toBe(10);
    const shown = shownA(question);
    const last = shown.length - 1;
    expect(5 + last >= question.panelCount, "#3").toBe(true);
    expect(question.getQuestionFromArray("a", 5 + last).value, "#4").toBe(shown[last]);
    question.currentIndex = 5 + last;
    expect(question.currentIndex, "#5").toBe(5 + last);
    expect(question.currentPanel.getQuestionByName("a").value, "#6").toBe(shown[last]);
    question.currentIndex = 99;
    expect(question.currentIndex, "#7: clamped to the last record shown").toBe(5 + last);
    const removes = source.removes.length;
    question.removePanel(6 + last);
    await flush();
    expect(source.removes.length, "#8: past the shown extent").toBe(removes);
    question.removePanel(5 + last);
    await flush();
    expect(source.removes.length, "#9").toBe(removes + 1);
  });
  test("matrix: a page of five that keeps an added record shows six rows, and the numbers name them where they are shown", async () => {
    const source: any = new PagedSource(records(12, (i: number) => ({ id: i, a: "r" + i })));
    // Stores a new record at the end, a later page than the one it was added on.
    source.insert = (record: any): Promise<any> => {
      const stored = Object.assign({ id: 500 }, record);
      source.data.push(stored);
      return Promise.resolve(Object.assign({}, stored));
    };
    const question = createMatrix({ rowsPerPage: 5, defaultRowValue: { a: "new" }, columns: [{ name: "a", cellType: "text" }] });
    question.visibleRows;
    question.dataSource = source;
    await flush();
    question.addRow();
    await flush();
    question.removeRow(0, false);
    await flush();
    question.removeRow(0, false);
    await flush();
    expect(shownA(question), "#1: six rows, the kept record where it was").toEqual(["r2", "r3", "r4", "new", "r5", "r6"]);
    expect(question.getRowValue(3).a, "#2").toBe("new");
    expect(question.getQuestionFromArray("a", 3).value, "#3").toBe("new");
    expect(question.getRowValue(5).a, "#4").toBe("r6");
    question.removeRowByIndex(3);
    await flush();
    expect(source.removes[source.removes.length - 1], "#5: the kept record is removed by its number").toBe(500);
  });
});

/* Records { a: 0 } ... { a: n - 1 }, two panels per page unless a test says otherwise. events holds
   every visiblePanelIndex onDynamicPanelCurrentIndexChanged reported since the last clear. */
describe("Paged dynamic panel: the record the removal rule names becomes current, one event per change", () => {
  const createCurrent = (json: any, count: number = 5): { question: QuestionPanelDynamicModel, events: Array<number> } => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p", panelsPerPage: 2,
      templateElements: [{ type: "text", name: "a" }] }, json)] });
    survey.data = { p: records(count, (i: number) => ({ a: i })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    question.panels;
    question.currentPanel;
    const events: Array<number> = [];
    survey.onDynamicPanelCurrentIndexChanged.add((_, options) => { events.push(options.visiblePanelIndex); });
    return { question: question, events: events };
  };
  const currentA = (question: QuestionPanelDynamicModel): any => !!question.currentPanel ? question.currentPanel.getQuestionByName("a").value : undefined;
  const removeCurrentAt = (json: any, index: number, count?: number): { a: any, index: number, events: Array<number> } => {
    const { question, events } = createCurrent(json, count);
    question.currentIndex = index;
    events.splice(0);
    question.removePanel(question.currentPanel);
    return { a: currentA(question), index: question.currentIndex, events: events };
  };
  ["carousel", "tab"].forEach((mode: string): void => {
    test(mode + ": the current panel alone on the last page: the previous record, on the previous page", () => {
      expect(removeCurrentAt({ displayMode: mode }, 4), "#1").toEqual({ a: 3, index: 3, events: [3] });
    });
    test(mode + ": the current panel last on a full page that is not the last: the previous record on the same page", () => {
      expect(removeCurrentAt({ displayMode: mode }, 1), "#1").toEqual({ a: 0, index: 0, events: [0] });
    });
    test(mode + ": first or middle of a page: the next record on the page", () => {
      expect(removeCurrentAt({ displayMode: mode }, 2), "#1: first").toEqual({ a: 3, index: 2, events: [2] });
      expect(removeCurrentAt({ displayMode: mode, panelsPerPage: 3 }, 1, 6), "#2: middle").toEqual({ a: 2, index: 1, events: [1] });
    });
    test(mode + ": the only record: no current panel, no event", () => {
      expect(removeCurrentAt({ displayMode: mode }, 0, 1), "#1").toEqual({ a: undefined, index: -1, events: [] });
    });
    test(mode + ": under a sort and a filter", () => {
      const view = { displayMode: mode, sortBy: "a-", filterExpression: "{a} != 1" };
      expect(removeCurrentAt(view, 3), "#1: a = 0, last of the last page").toEqual({ a: 2, index: 2, events: [2] });
      expect(removeCurrentAt(view, 2), "#2: a = 2, first of page 1").toEqual({ a: 0, index: 2, events: [2] });
    });
    test(mode + ": currentIndex to another page, Next and Prev across a page and nextPage raise one event each", () => {
      const { question, events } = createCurrent({ displayMode: mode });
      question.currentIndex = 3;
      expect(events, "#1: currentIndex = 3 from 0").toEqual([3]);
      events.splice(0);
      question.currentIndex = 1;
      expect(events, "#2: back across the page").toEqual([1]);
      events.splice(0);
      question.goToNextPanel();
      expect(events, "#3: Next across the page").toEqual([2]);
      events.splice(0);
      question.goToPrevPanel();
      expect(events, "#4: Prev across the page").toEqual([1]);
      events.splice(0);
      question.currentIndex = 0;
      expect(events, "#5: on the same page").toEqual([0]);
      events.splice(0);
      question.nextPage();
      expect(events, "#6: nextPage").toEqual([2]);
      expect(currentA(question), "#7").toBe(2);
    });
  });
  test("tab, sorted: a rebuild of the same record at the same index raises nothing; a remove in front of it and of it one each", () => {
    const { question, events } = createCurrent({ displayMode: "tab", sortBy: "a" });
    question.currentIndex = 3;
    events.splice(0);
    question.refreshView();
    expect(events, "#1: refreshView").toEqual([]);
    expect(currentA(question), "#2").toBe(3);
    question.removePanel(1);
    expect(events, "#3: the current record is at index 2 now").toEqual([2]);
    expect(currentA(question), "#4").toBe(3);
    events.splice(0);
    question.removePanel(question.currentPanel);
    expect(events, "#5: the next record takes over at index 2").toEqual([2]);
    expect(currentA(question), "#6").toBe(4);
  });
  test("leftVisibleIndex after a move across a page is the index the move started from", () => {
    const { question } = createCurrent({ displayMode: "carousel" });
    question.currentIndex = 1;
    question.currentIndex = 3;
    expect((<any>question).leftVisibleIndex, "#1").toBe(1);
    question.goToPrevPanel();
    expect((<any>question).leftVisibleIndex, "#2").toBe(3);
  });
  ["carousel", "tab"].forEach((mode: string): void => {
    test(mode + " without paging: a move, Next and a removal raise one event each, as released", () => {
      const { question, events } = createCurrent({ displayMode: mode, panelsPerPage: 0 });
      question.currentIndex = 3;
      expect(events, "#1").toEqual([3]);
      events.splice(0);
      question.currentIndex = 1;
      question.goToNextPanel();
      expect(events, "#2").toEqual([1, 2]);
      events.splice(0);
      question.removePanel(question.currentPanel);
      expect(events, "#3").toEqual([2]);
      expect(currentA(question), "#4").toBe(3);
    });
  });
});

/* Three records, a detail panel that opens on add. A record rowsVisibleIf hides has no row under
   paging, and an add of one opens and focuses nothing. */
describe("Paged matrix: an add opens and focuses the row of the record it added, or nothing", () => {
  const createAdding = (json: any): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      detailPanelMode: "underRow", detailPanelShowOnAdding: true, detailElements: [{ type: "text", name: "d" }],
      columns: [{ name: "a", cellType: "text" }] }, json)] });
    survey.data = { m: records(3, (i: number) => ({ a: "r" + i })) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    return matrix;
  };
  const addWithFocus = (matrix: QuestionMatrixDynamicModel): Array<any> => {
    const focus = vi.spyOn(Question.prototype, "focus").mockImplementation(() => { });
    try {
      matrix.addRow(true);
      return focus.mock.instances.slice();
    } finally {
      focus.mockRestore();
    }
  };
  const openRows = (matrix: QuestionMatrixDynamicModel): Array<any> => matrix.visibleRows.filter(row => row.isDetailPanelShowing).map(row => row.getQuestionByColumnName("a").value);
  [{ name: "two per page", json: { rowsPerPage: 2 } }, { name: "five per page", json: { rowsPerPage: 5 } }].forEach((setup) => {
    test(setup.name + ": a record rowsVisibleIf hides opens no detail panel and focuses nothing", () => {
      const matrix = createAdding(Object.assign({ rowsVisibleIf: "{row.a} notempty" }, setup.json));
      const rows = matrix.visibleRows.slice();
      const focused = addWithFocus(matrix);
      expect(matrix.rowCount, "#1: the record is added").toBe(4);
      expect(matrix.pageIndex, "#2: the page stays").toBe(0);
      expect(openRows(matrix), "#3: no detail panel").toEqual([]);
      expect(focused, "#4: nothing focused").toEqual([]);
      expect(matrix.visibleRows.map(row => row.getQuestionByColumnName("a").value), "#5: the rows of the page stay").toEqual(rows.map(row => row.getQuestionByColumnName("a").value));
    });
  });
  test("two per page: the new record's row on the next page opens and is focused", () => {
    const matrix = createAdding({ rowsPerPage: 2 });
    const focused = addWithFocus(matrix);
    expect(matrix.pageIndex, "#1").toBe(1);
    const newRow = matrix.visibleRows[1];
    expect(newRow.isDetailPanelShowing, "#2").toBe(true);
    expect(focused.length === 1 && focused[0] === newRow.getQuestionByColumnName("a"), "#3").toBe(true);
  });
  test("two per page with a filter the new record does not pass: it is shown, opens and is focused", () => {
    const matrix = createAdding({ rowsPerPage: 2, filterExpression: "{a} notempty" });
    const focused = addWithFocus(matrix);
    const newRow = matrix.visibleRows[matrix.visibleRows.length - 1];
    expect(newRow.getQuestionByColumnName("a").value, "#1: the new row").toBeUndefined();
    expect(newRow.isDetailPanelShowing, "#2").toBe(true);
    expect(focused.length === 1 && focused[0] === newRow.getQuestionByColumnName("a"), "#3").toBe(true);
  });
  test("without paging: the hidden new row's detail panel opens, as released", () => {
    const matrix = createAdding({ rowsVisibleIf: "{row.a} notempty" });
    addWithFocus(matrix);
    const rows = matrix.allRows;
    expect(rows.length, "#1").toBe(4);
    expect(rows[3].isDetailPanelShowing, "#2").toBe(true);
    expect(rows.slice(0, 3).some(row => row.isDetailPanelShowing), "#3").toBe(false);
  });
});

describe("Page window: clearIncorrectValues clears incorrect answers on every page", () => {
  const dropdown = { cellType: "dropdown", choices: [1, 2] };
  const kinds: Array<{ name: string, element: (isPaged: boolean) => any, data: any, expected: any }> = [
    { name: "dynamic matrix", element: (isPaged: boolean): any => ({ type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: isPaged ? 1 : 0,
      columns: [Object.assign({ name: "a" }, dropdown)] }), data: [{ a: 1 }, { a: 7 }], expected: [{ a: 1 }, {}] },
    { name: "dynamic panel", element: (isPaged: boolean): any => ({ type: "paneldynamic", name: "q", panelsPerPage: isPaged ? 1 : 0,
      templateElements: [{ type: "dropdown", name: "a", choices: [1, 2] }] }), data: [{ a: 1 }, { a: 7 }], expected: [{ a: 1 }, {}] },
    { name: "fixed matrix", element: (isPaged: boolean): any => ({ type: "matrixdropdown", name: "q", rowsPerPage: isPaged ? 1 : 0, rows: ["r1", "r2"],
      columns: [Object.assign({ name: "a" }, dropdown)] }), data: { r1: { a: 1 }, r2: { a: 7 } }, expected: { r1: { a: 1 } } }
  ];
  kinds.forEach(kind => {
    test(kind.name + ": an incorrect answer on another page is cleared, as without paging", () => {
      [false, true].forEach((isPaged: boolean): void => {
        const survey = new SurveyModel({ elements: [kind.element(isPaged)] });
        survey.data = { q: JSON.parse(JSON.stringify(kind.data)) };
        const question: any = survey.getQuestionByName("q");
        if (!!question.visibleRows) question.visibleRows;
        survey.clearIncorrectValues();
        expect(survey.data.q, "#1: " + (isPaged ? "paged" : "unpaged")).toEqual(kind.expected);
      });
    });
  });
  // The paged result, with the first record on the page and the others without an object, equals the unpaged one.
  function clearPagedAndUnpaged(json: any, data: any, change?: (question: any) => void, prepare?: (survey: SurveyModel) => void): { paged: any, unpaged: any } {
    const run = (isPaged: boolean): any => {
      const surveyJson = JSON.parse(JSON.stringify(json));
      const element = surveyJson.elements[0];
      element[element.type === "paneldynamic" ? "panelsPerPage" : "rowsPerPage"] = isPaged ? 1 : 0;
      const survey = new SurveyModel(surveyJson);
      if (!!prepare) prepare(survey);
      survey.data = { q: JSON.parse(JSON.stringify(data)) };
      const question: any = survey.getQuestionByName("q");
      if (element.type === "paneldynamic") question.panels; else question.visibleRows;
      if (!!change) change(question);
      survey.clearIncorrectValues();
      return survey.data.q;
    };
    return { paged: run(true), unpaged: run(false) };
  }
  const withOther = (cellType: string): any => ({ cellType: cellType, choices: ["a", "b"], showOtherItem: true });
  const otherKinds: Array<{ name: string, json: (cellType: string) => any, data: (cellType: string) => any }> = [
    { name: "dynamic panel", json: (cellType: string): any => ({ type: "paneldynamic", name: "q",
      templateElements: [Object.assign({ type: cellType, name: "c" }, withOther(cellType), { cellType: undefined })] }),
    data: (cellType: string): any => cellType === "checkbox" ? [{ c: ["a"] }, { c: ["a", "zzz"] }, { c: ["q"] }] : [{ c: "a" }, { c: "zzz" }, { c: "b" }] },
    { name: "dynamic matrix", json: (cellType: string): any => ({ type: "matrixdynamic", name: "q", rowCount: 0,
      columns: [Object.assign({ name: "c" }, withOther(cellType))] }),
    data: (cellType: string): any => cellType === "checkbox" ? [{ c: ["a"] }, { c: ["a", "zzz"] }, { c: ["q"] }] : [{ c: "a" }, { c: "zzz" }, { c: "b" }] },
    { name: "multi-select matrix", json: (cellType: string): any => ({ type: "matrixdropdown", name: "q", rows: ["r1", "r2", "r3"],
      columns: [Object.assign({ name: "c" }, withOther(cellType))] }),
    data: (cellType: string): any => cellType === "checkbox" ? { r1: { c: ["a"] }, r2: { c: ["a", "zzz"] }, r3: { c: ["q"] } } : { r1: { c: "a" }, r2: { c: "zzz" }, r3: { c: "b" } } }
  ];
  otherKinds.forEach(kind => {
    test(kind.name + ": an other-item answer on another page is kept as without paging", () => {
      ["dropdown", "checkbox"].forEach(cellType => {
        [undefined, false].forEach(storeOthersAsComment => {
          const json: any = { elements: [kind.json(cellType)] };
          if (storeOthersAsComment === false) json.storeOthersAsComment = false;
          const res = clearPagedAndUnpaged(json, kind.data(cellType));
          expect(res.paged, cellType + ", storeOthersAsComment " + storeOthersAsComment).toEqual(res.unpaged);
        });
      });
    });
  });
  test("a choice a record hides by choicesVisibleIf is cleared on another page as without paging", () => {
    const choices = [{ value: "a", visibleIf: "{row.t} = 'x'" }, "b"];
    const cases: Array<{ name: string, json: any, data: any }> = [
      { name: "dynamic matrix", json: { type: "matrixdynamic", name: "q", rowCount: 0,
        columns: [{ name: "t", cellType: "text" }, { name: "c", cellType: "dropdown", choices: choices }] },
      data: [{ t: "y", c: "a" }, { t: "y", c: "a" }, { t: "x", c: "a" }] },
      { name: "multi-select matrix", json: { type: "matrixdropdown", name: "q", rows: ["r1", "r2", "r3"],
        columns: [{ name: "t", cellType: "text" }, { name: "c", cellType: "dropdown", choices: choices }] },
      data: { r1: { t: "y", c: "a" }, r2: { t: "y", c: "a" }, r3: { t: "x", c: "a" } } },
      { name: "dynamic panel", json: { type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "t" },
        { type: "dropdown", name: "c", choices: [{ value: "a", visibleIf: "{panel.t} = 'x'" }, "b"] }] },
      data: [{ t: "y", c: "a" }, { t: "y", c: "a" }, { t: "x", c: "a" }] }
    ];
    cases.forEach(item => {
      const res = clearPagedAndUnpaged({ elements: [item.json] }, item.data);
      expect(res.paged, item.name).toEqual(res.unpaged);
      expect(JSON.stringify(res.paged).indexOf("\"t\":\"x\",\"c\":\"a\"") > -1, item.name + ": the record that shows the choice keeps it").toBe(true);
    });
  });
  test("choices set in onMatrixCellCreated", () => {
    const json = { elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "k", cellType: "text" }, { name: "c", cellType: "dropdown" }] }] };
    const res = clearPagedAndUnpaged(json, [{ k: 1, c: "x" }, { k: 2, c: "y" }, { k: 3, c: "q" }], undefined, (survey: SurveyModel): void => {
      survey.onMatrixCellCreated.add((_, options) => { options.cellQuestion.choices = ["x", "y", "z"]; });
    });
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged, "#2").toEqual([{ k: 1, c: "x" }, { k: 2, c: "y" }, { k: 3 }]);
  });
  test("the cell type set in onMatrixCellCreating", () => {
    const json = { elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }] };
    const res = clearPagedAndUnpaged(json, [{ c: "a" }, { c: "free" }, { c: "text" }], undefined, (survey: SurveyModel): void => {
      survey.onMatrixCellCreating.add((_, options) => { options.cellType = "text"; });
    });
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged, "#2: a text cell keeps any answer").toEqual([{ c: "a" }, { c: "free" }, { c: "text" }]);
  });
  test("a rows change of a paged Multi-Select Matrix keeps other pages' answers", () => {
    const run = (rowsPerPage: number): any => {
      const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "q", rowsPerPage: rowsPerPage, rows: ["r1", "r2", "r3"],
        columns: [{ name: "a", cellType: "dropdown", choices: ["base"] }] }] });
      survey.onMatrixCellCreated.add((_, options) => { options.cellQuestion.choices = ["x", "y"]; });
      survey.data = { q: { r1: { a: "x" }, r2: { a: "y" }, r3: { a: "x" } } };
      const question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
      question.visibleRows;
      question.rows.push(new ItemValue("r4"));
      return survey.data.q;
    };
    expect(run(1), "#1").toEqual(run(0));
    expect(run(1), "#2").toEqual({ r1: { a: "x" }, r2: { a: "y" }, r3: { a: "x" } });
  });
  test("choicesFromQuestion with panel.a in a Dynamic Panel", () => {
    const json = { elements: [{ type: "paneldynamic", name: "q", templateElements: [
      { type: "checkbox", name: "a", choices: ["p", "q", "r"] },
      { type: "dropdown", name: "b", choicesFromQuestion: "panel.a", choicesFromQuestionMode: "selected" },
      { type: "ranking", name: "rk", choicesFromQuestion: "panel.a", choicesFromQuestionMode: "selected" }] }] };
    const data = [{ a: ["p", "q"], b: "q", rk: ["q", "p"] }, { a: ["p", "q"], b: "q", rk: ["q", "p"] }];
    const res = clearPagedAndUnpaged(json, data);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged, "#2").toEqual(data);
  });
  test("a detail-panel dropdown with showOtherItem", () => {
    const json = { elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, detailPanelMode: "underRow",
      columns: [{ name: "k", cellType: "text" }], detailElements: [{ type: "dropdown", name: "d", choices: ["a", "b"], showOtherItem: true }] }] };
    const res = clearPagedAndUnpaged(json, [{ k: 1, d: "a" }, { k: 2, d: "zzz" }, { k: 3, d: "b" }]);
    expect(res.paged, "#1").toEqual(res.unpaged);
  });
  test("an incorrect value of a choicesByUrl question on another page is kept, and no request is sent", () => {
    const proto: any = ChoicesRestful.prototype;
    const sendRequest = proto.sendRequest;
    let requests = 0;
    proto.sendRequest = function (): void { requests++; };
    ChoicesRestful.clearCache();
    try {
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 1, templateElements: [{ type: "text", name: "k" },
        { type: "dropdown", name: "c", choicesByUrl: { url: "http://test/colors" } }] }] });
      survey.data = { q: [{ k: 1, c: "zzz" }, { k: 2, c: "zzz" }, { k: 3, c: "zzz" }] };
      (<QuestionPanelDynamicModel>survey.getQuestionByName("q")).panels;
      const before = requests;
      survey.clearIncorrectValues();
      expect(requests - before, "#1: no request").toBe(0);
      expect(survey.data.q.slice(1), "#2").toEqual([{ k: 2, c: "zzz" }, { k: 3, c: "zzz" }]);
    } finally {
      proto.sendRequest = sendRequest;
      ChoicesRestful.clearCache();
    }
  });
  test("an incorrect value of a lazily loaded question on another page is kept, and onChoicesLazyLoad is not raised", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 1,
      columns: [{ name: "c", cellType: "dropdown", choicesLazyLoadEnabled: true }] }] });
    let loads = 0;
    survey.onChoicesLazyLoad.add(() => { loads++; });
    survey.data = { q: [{ c: "zzz" }, { c: "zzz" }, { c: "zzz" }] };
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
    const before = loads;
    survey.clearIncorrectValues();
    expect(loads - before, "#1").toBe(0);
    expect(survey.data.q, "#2").toEqual([{ c: "zzz" }, { c: "zzz" }, { c: "zzz" }]);
  });
  test("a records question nested in another page's record keeps its value, and its own clean-up does not run", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 1, templateElements: [{ type: "text", name: "k" },
      { type: "matrixdynamic", name: "inner", rowCount: 0, columns: [{ name: "x", cellType: "dropdown", choices: ["a"] }] }] }] });
    const nested = [{ x: "a" }, { x: "zzz", unknown: 1 }];
    survey.data = { q: [{ k: 1 }, { k: 2, inner: nested }, { k: 3, inner: nested }] };
    (<QuestionPanelDynamicModel>survey.getQuestionByName("q")).panels;
    survey.clearIncorrectValues();
    expect(survey.data.q[1].inner, "#1").toEqual(nested);
    expect(survey.data.q[2].inner, "#2").toEqual(nested);
  });
  test("the clean-up downloads no file", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 1, templateElements: [{ type: "text", name: "k" },
      { type: "file", name: "f", storeDataAsText: false }] }] });
    let downloads = 0;
    survey.onDownloadFile.add((_, options) => { downloads++; options.callback("success", "data:,x"); });
    const file = [{ name: "a.txt", type: "text/plain", content: "http://test/a.txt" }];
    survey.data = { q: [{ k: 1 }, { k: 2, f: file }, { k: 3, f: file }] };
    (<QuestionPanelDynamicModel>survey.getQuestionByName("q")).panels;
    const before = downloads;
    survey.clearIncorrectValues();
    expect(downloads - before, "#1").toBe(0);
    expect(survey.data.q[2].f, "#2").toEqual(file);
  });
  test("an onQuestionCreated handler that assigns the value during the clean-up keeps its assignment", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 1,
      templateElements: [{ type: "dropdown", name: "c", choices: ["a", "new"] }] }] });
    survey.data = { q: [{ c: "a" }, { c: "zzz" }, { c: "zzz" }] };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.panels;
    let isAssigned = false;
    survey.onQuestionCreated.add(() => { if (!isAssigned) { isAssigned = true; survey.setValue("q", [{ c: "a" }, { c: "new" }, { c: "new" }]); } });
    survey.clearIncorrectValues();
    expect(isAssigned, "#1").toBe(true);
    expect(survey.data.q.slice(1), "#2: the cleaned copies of the old records are not written over it").toEqual([{ c: "new" }, { c: "new" }]);
  });
  test("a handler that removes a panel during the clean-up overwrites no record", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 1,
      templateElements: [{ type: "dropdown", name: "c", choices: ["a"] }, { type: "text", name: "k" }] }] });
    survey.data = { q: [{ c: "a", k: 0 }, { c: "zzz", k: 1 }, { c: "zzz", k: 2 }, { c: "a", k: 3 }] };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.panels;
    let isRemoved = false;
    survey.onQuestionCreated.add(() => { if (!isRemoved) { isRemoved = true; question.removePanel(1); } });
    survey.clearIncorrectValues();
    expect(isRemoved, "#1").toBe(true);
    expect(survey.data.q.map((record: any) => record.k), "#2: every record is its own").toEqual([0, 2, 3]);
  });
  test("a column choice list changed after load: the records of other pages lose the value the cell would lose", () => {
    const json = { elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "c", cellType: "dropdown", choices: ["a", "b", "c"] }] }] };
    const res = clearPagedAndUnpaged(json, [{ c: "a" }, { c: "c" }, { c: "b" }], (question: QuestionMatrixDynamicModel): void => {
      question.getColumnByName("c").choices = ["a", "b"];
    });
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged, "#2").toEqual([{ c: "a" }, {}, { c: "b" }]);
  });
});

describe("Page window: the remove events under a sort", () => {
  test("matrix: the events report the removed row's view position and name the removed row", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, sortBy: "a-", columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 3 }, { a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.map(row => row.getQuestionByColumnName("a").value), "#1").toEqual([3, 2, 1]);
    const log: Array<any> = [];
    survey.onMatrixRowRemoving.add((_, options) => { log.push(["removing", options.rowIndex, options.row.getQuestionByColumnName("a").value]); });
    survey.onMatrixRowRemoved.add((_, options) => { log.push(["removed", options.rowIndex, options.row.getQuestionByColumnName("a").value]); });
    matrix.removeRow(2);
    expect(log, "#2").toEqual([["removing", 2, 1], ["removed", 2, 1]]);
    expect(matrix.value, "#3").toEqual([{ a: 3 }, { a: 2 }]);
  });
  test("panel: the events report the removed panel's view position and name the removed panel", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", sortBy: "a-", templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { p: [{ a: 1 }, { a: 3 }, { a: 2 }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.panels.map(p => p.getQuestionByName("a").value), "#1").toEqual([3, 2, 1]);
    const log: Array<any> = [];
    survey.onDynamicPanelRemoving.add((_, options) => { log.push(["removing", options.panelIndex, options.panel.getQuestionByName("a").value]); });
    survey.onDynamicPanelRemoved.add((_, options) => { log.push(["removed", options.panelIndex, options.panel.getQuestionByName("a").value]); });
    panel.removePanel(2);
    expect(log, "#2").toEqual([["removing", 2, 1], ["removed", 2, 1]]);
    expect(panel.value, "#3").toEqual([{ a: 3 }, { a: 2 }]);
  });
});

describe("Page window: a late asynchronous result of a page the respondent left", () => {
  test("it does not move the respondent back, and the survey does not complete while the record they edited is invalid", () => {
    let isSlow = true;
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("lateAsyncCheck", function (params: Array<any>): any {
      if (isSlow && params[0] === "x") {
        isSlow = false;
        results.push(this.returnResult);
        return false;
      }
      this.returnResult(1);
      return false;
    }, true);
    try {
      const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 1, columns: [
        { name: "a", cellType: "text", validators: [{ type: "expression", expression: "lateAsyncCheck({row.a}) = 1" }] },
        { name: "b", cellType: "text", validators: [{ type: "expression", expression: "{row.b} != 'bad'" }] }] }] });
      survey.data = { m: [{ a: "x" }, { a: "y" }, { a: "z" }] };
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      matrix.visibleRows[0].getQuestionByColumnName("b").value = "ok";
      matrix.pageIndex = 1;
      survey.tryComplete();
      expect(matrix.pageIndex, "#1: the walk waits on page 0").toBe(0);
      matrix.pageIndex = 2;
      matrix.visibleRows[0].getQuestionByColumnName("b").value = "bad";
      results[0](1);
      expect(matrix.pageIndex, "#2: the respondent's page stays").toBe(2);
      expect(survey.state, "#3: not completed").toBe("running");
      expect(survey.tryComplete(), "#4: the record edited on that page is validated").toBe(false);
      expect(matrix.pageIndex, "#5").toBe(2);
      expect(matrix.visibleRows[0].getQuestionByColumnName("b").errors.length, "#6").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("lateAsyncCheck");
    }
  });
});

describe("Page window: an object whose question is writing is not disposed by the rebuild the write causes", () => {
  test("matrix: the row of a cell that hides its record is disposed when the write ends", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2, rowsVisibleIf: "{row.a} != 'hide'",
      columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: "r0" }, { a: "r1" }, { a: "r2" }, { a: "r3" }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cell = matrix.visibleRows[0].getQuestionByColumnName("a");
    let isDisposedInWrite: boolean = undefined;
    survey.onValueChanged.add(() => { isDisposedInWrite = cell.isDisposed; });
    cell.value = "hide";
    expect(isDisposedInWrite, "#1: not while its value is being set").toBe(false);
    expect(matrix.visibleRows.map(row => row.getValue("a")), "#2: the page is rebuilt").toEqual(["r1", "r2"]);
    expect(cell.isDisposed, "#3: when the write ends").toBe(true);
  });
  test("panel: the panel of a question that hides its record is disposed after the write, with the next page", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelsPerPage: 2, templateVisibleIf: "{panel.a} != 'hide'",
      templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { p: [{ a: "r0" }, { a: "r1" }, { a: "r2" }, { a: "r3" }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const question = panel.panels[0].getQuestionByName("a");
    let isDisposedInWrite: boolean = undefined;
    survey.onValueChanged.add(() => { isDisposedInWrite = question.isDisposed; });
    question.value = "hide";
    expect(isDisposedInWrite, "#1: not while its value is being set").toBe(false);
    panel.pageIndex = 1;
    expect(question.isDisposed, "#2: with the next replacement").toBe(true);
  });
});

describe("clearInvisibleValues and a column or template question hidden on other pages", () => {
  const records = (): Array<any> => [{ a: 1, b: "x" }, { a: 2, b: "x" }, { a: 3, b: "x" }];
  const matrixJson = (visibleIf: string): any => ({ type: "matrixdynamic", name: "q", rowCount: 0,
    columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", visibleIf: visibleIf }] });
  const fixedJson = (visibleIf: string): any => ({ type: "matrixdropdown", name: "q", rows: ["r1", "r2", "r3"],
    columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", visibleIf: visibleIf }] });
  const panelJson = (visibleIf: string): any => ({ type: "paneldynamic", name: "q",
    templateElements: [{ type: "text", name: "a" }, { type: "text", name: "b", visibleIf: visibleIf.replace("{row.", "{panel.") }] });
  const fixedData = (): any => ({ r1: { a: 1, b: "x" }, r2: { a: 2, b: "x" }, r3: { a: 3, b: "x" } });
  /* The stored value after each step, paged (the first record on the page, the others without an
     object) and unpaged. */
  function run(mode: string, element: any, data: any, values: any, steps: Array<any>): { paged: Array<any>, unpaged: Array<any> } {
    const runOne = (isPaged: boolean): Array<any> => {
      const json = JSON.parse(JSON.stringify(element));
      json[json.type === "paneldynamic" ? "panelsPerPage" : "rowsPerPage"] = isPaged ? 1 : 0;
      const survey = new SurveyModel({ clearInvisibleValues: mode, elements: [{ type: "text", name: "hasB" }, { type: "text", name: "limit" }, json] });
      survey.data = Object.assign({ q: JSON.parse(JSON.stringify(data)) }, values);
      const question: any = survey.getQuestionByName("q");
      if (json.type === "paneldynamic") question.panels; else question.visibleRows;
      const res: Array<any> = [];
      steps.forEach(step => {
        if (step === "complete") {
          survey.doComplete();
        } else if (typeof step === "function") {
          step(survey, question);
        } else {
          survey.setValue(step.name, step.value);
        }
        res.push(JSON.parse(JSON.stringify(survey.data.q || null)));
      });
      return res;
    };
    return { paged: runOne(true), unpaged: runOne(false) };
  }
  const hideAndComplete = [{ name: "hasB", value: "no" }, "complete"];
  test("a paged Dynamic Panel clears an invalid choice value of another page's record at complete", () => {
    const json = { type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "a" }, { type: "dropdown", name: "c", choices: [1, 2] }] };
    const res = run("onComplete", json, [{ a: 1, c: 5 }, { a: 2, c: 9 }, { a: 3, c: 1 }], {}, ["complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual([{ a: 1 }, { a: 2 }, { a: 3, c: 1 }]);
  });
  test("a paged Multi-Select Matrix drops unknown keys of other pages' records at complete", () => {
    const json = { type: "matrixdropdown", name: "q", rows: ["r1", { value: "r2", visibleIf: "{hasB} = 'yes'" }, "r3"],
      columns: [{ name: "a", cellType: "text" }, { name: "c", cellType: "text" }] };
    const data = { r1: { a: 1, c: "C", b: 1 }, r2: { a: 2, c: "C", b: 2 }, r3: { a: 3, c: "C", b: 3, dq: "x" } };
    const res = run("onComplete", json, data, { hasB: "no" }, ["complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0].r3, "#2").toEqual({ a: 3, c: "C" });
  });
  const innerPanelJson = (): any => ({ type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "a" },
    { type: "panel", name: "inner", visibleIf: "{hasB} = 'yes'", elements: [{ type: "text", name: "b" }] }] });
  test("a hidden inner panel keeps the answers of its questions under onHidden", () => {
    const res = run("onHidden", innerPanelJson(), records(), { hasB: "yes" }, [{ name: "hasB", value: "no" }]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual(records());
  });
  test("a hidden inner panel clears them under onHiddenContainer", () => {
    const res = run("onHiddenContainer", innerPanelJson(), records(), { hasB: "yes" }, [{ name: "hasB", value: "no" }]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("a records question hidden by templateVisibleIf keeps its answers", () => {
    const json = Object.assign(panelJson("true"), { templateVisibleIf: "{hasB} = 'yes'" });
    const res = run("onHidden", json, records(), { hasB: "yes" }, [{ name: "hasB", value: "no" }]);
    expect(res.paged, "#1").toEqual(res.unpaged);
  });
  test("a column with clearIfInvisible onHidden is cleared on every page when the survey clears on complete", () => {
    const json = matrixJson("{hasB} = 'yes'");
    json.columns[1].clearIfInvisible = "onHidden";
    const res = run("onComplete", json, records(), { hasB: "yes" }, [{ name: "hasB", value: "no" }, "complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[1], "#2").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("an outside assignment of the value keeps the hidden state of other pages' records", () => {
    [["dynamic matrix", matrixJson("{row.a} = 1")], ["dynamic panel", panelJson("{row.a} = 1")]].forEach(([name, json]) => {
      const same = [{ a: 1, b: "x" }, { a: 1, b: "x" }, { a: 1, b: "x" }];
      const hidden = [{ a: 1, b: "x" }, { a: 2, b: "x" }, { a: 2, b: "x" }];
      const res = run("onHidden", json, same, {}, [{ name: "q", value: same.map(r => Object.assign({}, r)) }, { name: "q", value: hidden }]);
      expect(res.paged, name + " #1").toEqual(res.unpaged);
      expect(res.paged[1], name + " #2").toEqual([{ a: 1, b: "x" }, { a: 2 }, { a: 2 }]);
    });
  });
  const hideRecord = (index: number) => (survey: SurveyModel, question: any): void => {
    const value = JSON.parse(JSON.stringify(question.value));
    value[index].a = 2;
    survey.setValue("q", value);
  };
  test("inserting a record before other pages' records keeps their hidden state", () => {
    [["dynamic matrix", matrixJson("{row.a} = 1"), (q: any) => q.addRowByIndex({ a: 1 }, 0)],
      ["dynamic panel", panelJson("{row.a} = 1"), (q: any) => q.addPanel(0)]].forEach(([name, json, insert]: Array<any>) => {
      const data = [{ a: 1, b: "x" }, { a: 1, b: "x" }, { a: 1, b: "x" }];
      const res = run("onHidden", json, data, {}, [(survey: SurveyModel, question: any) => insert(question), hideRecord(3)]);
      expect(res.paged, name + " #1").toEqual(res.unpaged);
      expect(res.paged[1][3], name + " #2").toEqual({ a: 2 });
    });
  });
  test("removing a record before other pages' records keeps their hidden state", () => {
    [["dynamic matrix", matrixJson("{row.a} = 1"), (q: any) => q.removeRowByIndex(0)],
      ["dynamic panel", panelJson("{row.a} = 1"), (q: any) => q.removePanel(0)]].forEach(([name, json, remove]: Array<any>) => {
      const data = [{ a: 1, b: "x" }, { a: 1, b: "x" }, { a: 1, b: "x" }];
      const res = run("onHidden", json, data, {}, [(survey: SurveyModel, question: any) => remove(question), hideRecord(1)]);
      expect(res.paged, name + " #1").toEqual(res.unpaged);
      expect(res.paged[1][1], name + " #2").toEqual({ a: 2 });
    });
  });
  test("moving a record keeps its hidden state with it", () => {
    const json = matrixJson("{row.a} = 1");
    const data = [{ a: 1, b: "x" }, { a: 1, b: "y" }, { a: 1, b: "z" }];
    const res = run("onHidden", json, data, {}, [(survey: SurveyModel, question: any) => question.moveRowByIndex(2, 1), hideRecord(1)]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[1], "#2").toEqual([{ a: 1, b: "x" }, { a: 2 }, { a: 1, b: "y" }]);
  });
  test("a sort or a filter keeps the hidden state of every record", () => {
    const json = Object.assign(matrixJson("{row.a} = 1"), { sortBy: "c" });
    json.columns.push({ name: "c", cellType: "text" });
    const data = [{ a: 1, b: "x", c: 3 }, { a: 1, b: "y", c: 1 }, { a: 1, b: "z", c: 2 }];
    const res = run("onHidden", json, data, {}, [(survey: SurveyModel, question: any) => { question.sortBy = "-c"; }, hideRecord(2)]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[1][2], "#2").toEqual({ a: 2, c: 2 });
  });
  test("under onHidden, hiding a column clears it in the records of every page", () => {
    [["dynamic matrix", matrixJson("{hasB} = 'yes'"), records()], ["multi-select matrix", fixedJson("{hasB} = 'yes'"), fixedData()]]
      .forEach(([name, json, data]) => {
        const res = run("onHidden", json, data, { hasB: "yes" }, hideAndComplete);
        expect(res.paged, name + ": after the hide and after complete").toEqual(res.unpaged);
        expect(JSON.stringify(res.paged[0]).indexOf("\"b\""), name + ": cleared at the hide").toBe(-1);
      });
  });
  test("under onHidden, a condition over the record hides a column in some records of other pages", () => {
    const res = run("onHidden", matrixJson("{row.a} > {limit}"), records(), { limit: 0 }, [{ name: "limit", value: 1 }, { name: "limit", value: 0 }, { name: "limit", value: 2 }, "complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2: the first record lost b").toEqual([{ a: 1 }, { a: 2, b: "x" }, { a: 3, b: "x" }]);
    expect(res.paged[2], "#3: the second record too").toEqual([{ a: 1 }, { a: 2 }, { a: 3, b: "x" }]);
  });
  test("under onHidden, hiding a template question clears it in the panels of every page at the hide", () => {
    const res = run("onHidden", panelJson("{hasB} = 'yes'"), records(), { hasB: "yes" }, hideAndComplete);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2: at the hide").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("under onHidden, answers hidden since load are kept, as without paging", () => {
    const steps = [{ name: "limit", value: 5 }, "complete"];
    const matrix = run("onHidden", matrixJson("{hasB} = 'yes'"), records(), { hasB: "no" }, steps);
    expect(matrix.paged, "matrix").toEqual(matrix.unpaged);
    expect(matrix.paged[1], "matrix: kept after complete").toEqual(records());
    const panel = run("onHidden", panelJson("{hasB} = 'yes'"), records(), { hasB: "no" }, steps);
    expect(panel.paged, "panel").toEqual(panel.unpaged);
    expect(panel.paged[0], "panel: kept until complete").toEqual(records());
  });
  test("under onComplete, a matrix keeps hidden-column answers, as without paging", () => {
    const res = run("onComplete", matrixJson("{hasB} = 'yes'"), records(), { hasB: "yes" }, hideAndComplete);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[1], "#2").toEqual(records());
  });
  test("under onComplete, a panel clears them at complete", () => {
    const res = run("onComplete", panelJson("{hasB} = 'yes'"), records(), { hasB: "yes" }, hideAndComplete);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2: kept at the hide").toEqual(records());
    expect(res.paged[1], "#3: cleared at complete").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("an expression over the records reads the cleared value at once", () => {
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [{ type: "text", name: "hasB" },
      Object.assign(matrixJson("{hasB} = 'yes'"), { rowsPerPage: 1 }), { type: "expression", name: "count", expression: "countInArray({q}, 'b')" }] });
    survey.data = { hasB: "yes", q: records() };
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
    expect(survey.getValue("count"), "#1").toBe(3);
    survey.setValue("hasB", "no");
    expect(survey.getValue("count"), "#2").toBe(0);
  });
});

describe("the validation of a paged records question: its objects, the question, then the records off the page", () => {
  test("the records off the page are checked only when the question and its objects pass", () => {
    const kinds: Array<any> = [
      { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 1, columns: [{ name: "a", cellType: "text" }] },
      { type: "paneldynamic", name: "q", panelsPerPage: 1, templateElements: [{ type: "text", name: "a" }] }
    ];
    kinds.forEach(json => {
      const offPage = vi.spyOn(<any>QuestionRecordsModel.prototype, "validateOffPage");
      const survey = new SurveyModel({ elements: [Object.assign({ validators: [{ type: "expression", expression: "{flag} != 1" }] }, json)] });
      survey.data = { q: [{ a: 1 }, { a: 2 }] };
      const question: any = survey.getQuestionByName("q");
      if (json.type === "paneldynamic") question.panels; else question.visibleRows;
      survey.setValue("flag", 1);
      survey.validate(true);
      expect(offPage.mock.calls.length, json.type + ": the question has an error").toBe(0);
      survey.setValue("flag", 2);
      survey.validate(true);
      expect(offPage.mock.calls.length > 0, json.type + ": everything passes").toBe(true);
      offPage.mockRestore();
    });
  });
});
