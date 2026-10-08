import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* What follows a change of the view or of the records: a stale page is rebuilt, a record flag reaches
   the pager, the counts that navigation, progress and the filtered data use come from one place. */

function createMatrix(json: any, data?: Array<any>): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
    columns: [{ name: "a", cellType: "text" }] }, json)] });
  if (!!data) survey.data = { m: data };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
function records(count: number): Array<any> {
  const res = [];
  for (let i = 0; i < count; i++) res.push({ a: i });
  return res;
}
const rowValues = (matrix: QuestionMatrixDynamicModel): Array<any> => matrix.visibleRows.map(row => row.value.a);

// A keyed source that pages and answers at once, with or without a total.
class Source implements IDynamicDataSource {
  public keyField = "id";
  public capabilities: IDynamicDataSourceCapabilities = { paging: true, filtering: false, sorting: false };
  constructor(public records: Array<any>, public hasTotal: boolean = true) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    const take = request.take > 0 ? request.take : this.records.length;
    const page = this.records.slice(request.skip, request.skip + take).map(r => Object.assign({}, r));
    if (this.hasTotal) return { records: page, total: this.records.length };
    return { records: page, hasMore: request.skip + page.length < this.records.length };
  }
}

describe("a stale page is rebuilt once", () => {
  test("matrix: a record a condition hides leaves the page and the next one takes its slot", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "hide" },
      { type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2, rowsVisibleIf: "{row.a} != {hide}", columns: [{ name: "a", cellType: "text" }] }
    ] });
    survey.data = { m: records(4) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(rowValues(matrix), "#1").toEqual([0, 1]);
    survey.setValue("hide", 0);
    expect(rowValues(matrix), "#2").toEqual([1, 2]);
    expect(matrix.pageCount, "#4").toBe(2);
  });
  test("matrix: a grown rowCount appends rows to the page while the page has room", () => {
    const matrix = createMatrix({ rowsPerPage: 3 }, records(1));
    const rows = matrix.visibleRows;
    matrix.rowCount = 3;
    expect(matrix.visibleRows[0], "#1: the row that was there stays").toBe(rows[0]);
    expect(matrix.visibleRows.length, "#2").toBe(3);
  });
});

describe("a row's visibility reaches its record and syncs the pager only on a change", () => {
  test("a hidden row leaves the page count", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "hide" },
      { type: "matrixdynamic", name: "m", rowCount: 0, rowsVisibleIf: "{row.a} != {hide}", columns: [{ name: "a", cellType: "text" }] }
    ] });
    survey.data = { m: records(3) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    const list = matrix["dataList"];
    survey.setValue("hide", 1);
    expect(matrix.visibleRows.length, "#1").toBe(2);
    expect(list.visibleCount, "#2: the record follows its row").toBe(2);
  });
  test("panel: a hidden panel leaves the record count", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", displayMode: "tab",
      templateVisibleIf: "{panel.a} != 9", templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { p: records(3) };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.visiblePanelCount, "#1").toBe(3);
    panel.panels[1].getQuestionByName("a").value = 9;
    expect(panel.visiblePanelCount, "#2").toBe(2);
    expect(panel["dataList"].visibleCount, "#3").toBe(2);
  });
});

describe("a fixed matrix re-decides its view when the row titles change", () => {
  test("a sort by the row title follows a title edit", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rows: [{ value: "r1", text: "b" }, { value: "r2", text: "a" }],
      columns: [{ name: "c1", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.sortOrder = [{ field: "rowTitle", direction: "asc" }];
    expect(matrix.visibleRows.map(r => r.rowName), "#1").toEqual(["r2", "r1"]);
    matrix.rows[1].text = "c";
    matrix.localeChanged();
    expect(matrix.visibleRows.map(r => r.rowName), "#2").toEqual(["r1", "r2"]);
  });
  test("a rows change keeps the view and the pager in step", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rows: ["r1", "r2", "r3"], rowsPerPage: 2,
      columns: [{ name: "c1", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    expect(matrix.pageCount, "#1").toBe(2);
    matrix.rows = ["r1"];
    expect(matrix.pageCount, "#2").toBe(1);
    expect(matrix.visibleRows.map(r => r.rowName), "#3").toEqual(["r1"]);
  });
});

describe("filtered data and progress of a matrix with a filter, before and after its rows are built", () => {
  const json = { filterExpression: "{a} != 2", columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", isRequired: true }] };
  const data = [{ a: 1, b: "x" }, { a: 2, b: "y" }, { a: 3 }];
  test("getFilteredData", () => {
    const matrix = createMatrix(json, data);
    expect(matrix.getFilteredData(), "#1: rows not built").toEqual([{ a: 1, b: "x" }, { a: 3 }]);
    matrix.visibleRows;
    expect(matrix.getFilteredData(), "#2: rows built").toEqual([{ a: 1, b: "x" }, { a: 3 }]);
  });
  test("survey.getProgressInfo", () => {
    const matrix = createMatrix(json, data);
    const survey = <SurveyModel>matrix.survey;
    const before = survey.getProgressInfo();
    matrix.visibleRows;
    const after = survey.getProgressInfo();
    expect(before, "#1: rows not built, the records of the view").toEqual(after);
    expect([after.questionCount, after.answeredQuestionCount, after.requiredQuestionCount], "#2").toEqual([4, 3, 2]);
  });
  test("rows built under a sort: an answered hidden cell is not counted", () => {
    const matrix = createMatrix({ sortBy: "a-", columns: [{ name: "a", cellType: "text" },
      { name: "b", cellType: "text", visibleIf: "{row.a} != 1" }] }, [{ a: 1, b: "x" }, { a: 2 }]);
    matrix.visibleRows;
    const res = (<SurveyModel>matrix.survey).getProgressInfo();
    expect([res.questionCount, res.answeredQuestionCount], "#1: the hidden cell b of record 0 does not count").toEqual([3, 2]);
  });
  test("without a filter or a sort nothing changes: the value", () => {
    const matrix = createMatrix({ columns: [{ name: "a", cellType: "text" }] }, [{ a: 1 }, {}]);
    expect(matrix.getFilteredData(), "#1").toEqual([{ a: 1 }, {}]);
  });
});

describe("the Next button on the last known record of a source without a total", () => {
  test("the footer shows Next where goToNextPanel goes on", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", displayMode: "carousel", panelsPerPage: 2,
      templateElements: [{ type: "text", name: "a" }] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.dataSource = new Source(records(4).map((r, i) => Object.assign({ id: i + 1 }, r)), false);
    panel.panels;
    panel.currentIndex = 1;
    expect(panel.isNextButtonVisible, "#1").toBe(true);
    const next = panel.footerToolbar.getActionById("sv-pd-next-btn");
    panel["updateFooterActions"]();
    expect(next.visible, "#2: the footer agrees").toBe(true);
  });
});

describe("a dynamic panel with an authored filter and a value builds its panels", () => {
  test("filterExpression, no paging, the value set before the first render", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", filterExpression: "{a} != 2",
      templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { p: [{ a: 1 }, { a: 2 }, { a: 3 }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.panels.map(p => p.getQuestionByName("a").value), "#1").toEqual([1, 3]);
  });
  test("sortBy, no paging, the value set before the first render", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", sortBy: "a-",
      templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { p: [{ a: 1 }, { a: 2 }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.panels.map(p => p.getQuestionByName("a").value), "#1").toEqual([2, 1]);
  });
});
