import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { IDynamicDataListChange } from "../../src/dynamic-data/dynamic-data-interfaces";

function records(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: i });
  }
  return res;
}
const getDataListValue = (q: QuestionMatrixDynamicModel): DynamicDataList => q["dataListValue"];
const getDataList = (q: QuestionMatrixDynamicModel): DynamicDataList => q["dataList"];

describe("The index an event reports counts the owner-hidden records", () => {
  // Sorted by id descending: the records are 3, 2, 1, 0 in the view, and record 2 is hidden by the
  // owner. Record 1 is the second visible record and the third created one.
  test("paneldynamic: panelIndex of a panel behind a hidden one", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", pageSize: 2, sortCriteria: [{ field: "id", direction: "desc" }],
      templateVisibleIf: "{panel.id} != 2", templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name" }] }] });
    survey.data = { pd: records(4) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.panels.map(panel => panel.getQuestionByName("id").value), "#1").toEqual([3, 1]);
    const indexes: Array<number> = [];
    survey.onDynamicPanelValueChanged.add((_, options) => { indexes.push(options.panelIndex); });
    question.panels[1].getQuestionByName("name").value = "n1";
    question.panels[0].getQuestionByName("name").value = "n3";
    expect(indexes, "#2: record 1 is reported at its created position").toEqual([2, 0]);
  });
  test("matrixdynamic: rowIndex of a row behind a hidden one", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "md", rowCount: 0, pageSize: 2, sortCriteria: [{ field: "id", direction: "desc" }],
      rowsVisibleIf: "{row.id} != 2", detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note" }],
      columns: [{ name: "id", cellType: "text" }] }] });
    survey.data = { md: records(4) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    const rows = matrix.visibleRows;
    expect(rows.map(row => row.getQuestionByName("id").value), "#1").toEqual([3, 1]);
    const indexes: Array<number> = [];
    survey.onMatrixDetailPanelVisibleChanged.add((_, options) => { indexes.push(options.rowIndex); });
    rows[1].showDetailPanel();
    rows[0].showDetailPanel();
    expect(indexes, "#2: record 1 is reported at its created position").toEqual([2, 0]);
  });
});

describe("A list created after the rows starts with their visibility", () => {
  test("matrixdynamic with rowsVisibleIf over 50 rows: the hidden rows and what the matrix is told", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "md", rowCount: 0,
      rowsVisibleIf: "{row.id} % 3 != 0", columns: [{ name: "id", cellType: "text" }] }] });
    survey.data = { md: records(50) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    expect(matrix.visibleRows.length, "#1").toBe(33);
    expect(getDataListValue(matrix), "#2: the rows were built without a list").toBeUndefined();
    const onListChanged = vi.spyOn(<any>matrix, "onDataListChanged");
    const properties: Array<string> = [];
    matrix.onPropertyChanged.add((_, options) => { properties.push(options.name); });
    const list = getDataList(matrix);
    const changes = onListChanged.mock.calls.map((args: Array<any>): string => (<IDynamicDataListChange>args[0]).type);
    onListChanged.mockRestore();
    expect(changes, "#3: the list notifications").toEqual(["reset"]);
    expect(properties, "#4: the property changes: the paging state the list is created with").toEqual(["pageIndex", "pageCount", "isCountKnown"]);
    expect(list.getVisibleIndexes(), "#5").toEqual(records(50).map(r => r.id).filter(id => id % 3 !== 0));
    expect(list.isRecordVisible(0), "#6").toBe(false);
    expect(list.isRecordVisible(1), "#7").toBe(true);
    expect(list.pageIndex, "#8").toBe(0);
  });
});

describe("A paged matrix with a visibility expression over many rows", () => {
  // A timing guard: the duration of this test is what is compared; nothing asserts on it.
  test("2,000 rows, 20 per page, walked page by page", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "md", rowCount: 0, pageSize: 20,
      rowsVisibleIf: "{row.id} % 5 != 0", columns: [{ name: "id", cellType: "text" }] }] });
    survey.data = { md: records(2000) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    const pageCount = matrix.pageCount;
    expect(pageCount, "#1").toBe(80);
    let checked = 0;
    for (let page = 0; page < pageCount; page++) {
      matrix.pageIndex = page;
      matrix.visibleRows.forEach((row, i) => {
        if (row.visibleIndex !== page * 20 + i) throw new Error("page " + page + ", row " + i + ": " + row.visibleIndex);
        checked++;
      });
    }
    expect(checked, "#2: every visible row was on a page").toBe(1600);
  });
});
