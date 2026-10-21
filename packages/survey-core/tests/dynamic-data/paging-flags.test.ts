import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionRecordsModel } from "../../src/question_records";
import { settings } from "../../src/settings";
import { IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities } from "../../src/dynamic-data/dynamic-data-interfaces";
import "../../src/question_text";

// A source that answers from memory inside the call; paging says whether it hands over one window per page.
class MemorySource implements IDynamicDataSource {
  public capabilities: IDynamicDataSourceCapabilities;
  public keyField = "id";
  constructor(private records: Array<any>, paging: boolean) {
    this.capabilities = { paging: paging, filtering: paging, sorting: paging };
  }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    const size = request.take > 0 ? request.take : this.records.length;
    return { records: this.records.slice(request.skip, request.skip + size).map(r => Object.assign({}, r)), total: this.records.length };
  }
}
function createRecords(count: number): Array<any> {
  const res = [];
  for (let i = 0; i < count; i++) res.push({ id: i, a: "v" + i });
  return res;
}
function createMatrix(json: any, surveyJson?: any, isDesign?: boolean): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } {
  const survey = new SurveyModel();
  if (isDesign) survey.setDesignMode(true);
  survey.fromJSON(Object.assign({ elements: [Object.assign({ type: "matrixdynamic", name: "m", columns: [{ name: "a", cellType: "text" }] }, json)] }, surveyJson));
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
  return { survey, matrix };
}
function readFlags(q: QuestionRecordsModel): any {
  const list = q["dataListValue"];
  return {
    pageSize: q.pageSize > 0, listPageSize: q["listPageSize"] > 0, isPagingActive: q["isPagingActive"], isPagedByList: q["isPagedByList"],
    hasDataListView: q["hasDataListView"], isRemoteData: q["isRemoteData"], isPagedBySource: !!list && list.isPagedBySource
  };
}
function flags(values: Array<boolean>): any {
  const names = ["pageSize", "listPageSize", "isPagingActive", "isPagedByList", "hasDataListView", "isRemoteData", "isPagedBySource"];
  const res: any = {};
  names.forEach((name, i) => { res[name] = values[i]; });
  return res;
}

describe("The paging facts of a records question in each mode", () => {
  test("no paging", () => {
    const { matrix } = createMatrix({ rowCount: 3 });
    matrix.visibleRows;
    matrix["dataList"];
    expect(readFlags(matrix)).toEqual(flags([false, false, false, false, false, false, false]));
  });
  test("paging over the question's own records", () => {
    const { matrix } = createMatrix({ rowCount: 5, pageSize: 2 });
    matrix.visibleRows;
    expect(readFlags(matrix)).toEqual(flags([true, true, true, true, true, false, false]));
  });
  test("a source that pages itself", () => {
    const { matrix } = createMatrix({ pageSize: 2 });
    matrix.dataSource = new MemorySource(createRecords(5), true);
    matrix.visibleRows;
    expect(readFlags(matrix)).toEqual(flags([true, true, true, false, true, true, true]));
  });
  test("a source without paging, paged by the list", () => {
    const { matrix } = createMatrix({ pageSize: 2 });
    matrix.dataSource = new MemorySource(createRecords(5), false);
    matrix.visibleRows;
    expect(readFlags(matrix)).toEqual(flags([true, true, true, true, true, true, false]));
  });
  test("design mode with a page size", () => {
    const { matrix } = createMatrix({ rowCount: 5, pageSize: 2 }, undefined, true);
    matrix.visibleRows;
    matrix["dataList"];
    expect(readFlags(matrix)).toEqual(flags([true, true, false, false, false, false, false]));
  });
  test("single-input mode with a page size", () => {
    const { matrix } = createMatrix({ rowCount: 5, pageSize: 2 }, { questionsOnPageMode: "inputPerPage" });
    matrix.visibleRows;
    matrix["dataList"];
    expect(readFlags(matrix)).toEqual(flags([true, false, false, false, false, false, false]));
  });
  test("a filter without paging", () => {
    const { matrix } = createMatrix({ rowCount: 5, filterExpression: "{a} notempty" });
    matrix.visibleRows;
    expect(readFlags(matrix)).toEqual(flags([false, false, false, false, true, false, false]));
  });
});

/* maxRowCount / maxPanelCount report the stored maximum whenever pageSize is set, while the limit the
   record count is checked against is capped by the page maximum in design mode and in single-input
   mode, where the list does not page. */
describe("The maximum record count and the limit the count is checked against", () => {
  const matrixMax = settings.matrix.maxRowCount;
  const panelMax = settings.panel.maxPanelCount;
  test("dynamic matrix with pageSize and a maxRowCount above the page maximum", () => {
    const json = { rowCount: 3, pageSize: 2, maxRowCount: matrixMax * 2 };
    const runtime = createMatrix(json).matrix;
    runtime.visibleRows;
    expect(runtime.maxRowCount, "runtime: maxRowCount").toBe(matrixMax * 2);
    expect(runtime["getRecordCountLimitOf"]("maxRowCount"), "runtime: limit").toBe(matrixMax * 2);
    const singleInput = createMatrix(json, { questionsOnPageMode: "inputPerPage" }).matrix;
    singleInput.visibleRows;
    expect(singleInput.maxRowCount, "single input: maxRowCount").toBe(matrixMax * 2);
    expect(singleInput["getRecordCountLimitOf"]("maxRowCount"), "single input: limit").toBe(matrixMax);
    const design = createMatrix(json, undefined, true).matrix;
    design.visibleRows;
    expect(design.maxRowCount, "design: maxRowCount").toBe(matrixMax * 2);
    expect(design["getRecordCountLimitOf"]("maxRowCount"), "design: limit").toBe(matrixMax);
  });
  test("dynamic panel with pageSize and a maxPanelCount above the page maximum", () => {
    const create = (surveyJson: any, isDesign?: boolean): QuestionPanelDynamicModel => {
      const survey = new SurveyModel();
      if (isDesign) survey.setDesignMode(true);
      survey.fromJSON(Object.assign({ elements: [{ type: "paneldynamic", name: "p", panelCount: 3, pageSize: 2, maxPanelCount: panelMax * 2,
        templateElements: [{ type: "text", name: "q" }] }] }, surveyJson));
      const q = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
      q.panels;
      return q;
    };
    const runtime = create(undefined);
    expect(runtime.maxPanelCount, "runtime: maxPanelCount").toBe(panelMax * 2);
    expect(runtime["getRecordCountLimitOf"]("maxPanelCount"), "runtime: limit").toBe(panelMax * 2);
    const singleInput = create({ questionsOnPageMode: "inputPerPage" });
    expect(singleInput.maxPanelCount, "single input: maxPanelCount").toBe(panelMax * 2);
    expect(singleInput["getRecordCountLimitOf"]("maxPanelCount"), "single input: limit").toBe(panelMax);
    const design = create(undefined, true);
    expect(design.maxPanelCount, "design: maxPanelCount").toBe(panelMax * 2);
    expect(design["getRecordCountLimitOf"]("maxPanelCount"), "design: limit").toBe(panelMax);
  });
});
