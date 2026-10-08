import { describe, test, expect, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { settings } from "../../src/settings";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";

/* Adding a record: the number an add takes, the record it composes and copies from, the page it
   shows, the grow of the count and the row a record gets. */

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

describe("addRowByIndex at the row limit without paging", () => {
  const maxRowCount = settings.matrix.maxRowCount;
  afterEach(() => { settings.matrix.maxRowCount = maxRowCount; });
  test("the record is inserted and the count follows the value, rows built", () => {
    settings.matrix.maxRowCount = 3;
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    expect(matrix.visibleRows.length, "#1").toBe(3);
    matrix.addRowByIndex({ a: 9 }, 0);
    expect(matrix.value, "#2").toEqual([{ a: 9 }, { a: 1 }, { a: 2 }, { a: 3 }]);
    expect(matrix.rowCount, "#3").toBe(4);
    expect(matrix.visibleRows.map(r => r.getQuestionByName("a").value), "#4").toEqual([9, 1, 2, 3]);
  });
  test("the record is inserted and the count follows the value, rows not built", () => {
    settings.matrix.maxRowCount = 3;
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    matrix.addRowByIndex({ a: 9 }, 1);
    expect(matrix.value, "#1").toEqual([{ a: 1 }, { a: 9 }, { a: 2 }, { a: 3 }]);
    expect(matrix.rowCount, "#2").toBe(4);
  });
});

describe("an assignment while a row is added", () => {
  test("a value assigned while the row is created stays, and no record is overwritten", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    let assign = true;
    survey.onMatrixRowAdded.add(() => { });
    survey.onMatrixCellCreated.add((_, options) => {
      if (!assign || options.question !== matrix) return;
      assign = false;
      survey.setValue("m", [{ a: 7 }, { a: 8 }, { a: 9 }]);
    });
    matrix.addRowByIndex({ a: 5 }, 0);
    expect(survey.data.m, "#1: the assigned records").toEqual([{ a: 7 }, { a: 8 }, { a: 9 }]);
    expect(matrix.visibleRows.map(r => r.getQuestionByName("a").value), "#2: the rows").toEqual([7, 8, 9]);
  });
  test("a value assigned on value changed while a row is added stays", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    let assign = true;
    survey.onValueChanged.add(() => {
      if (!assign) return;
      assign = false;
      survey.setValue("m", [{ a: 7 }, { a: 8 }, { a: 9 }]);
    });
    matrix.addRowByIndex({ a: 5 }, 0);
    expect(survey.data.m, "#1: the assigned records").toEqual([{ a: 7 }, { a: 8 }, { a: 9 }]);
  });
});

describe("addRowByIndex with a negative number counts from the end", () => {
  test("-1 inserts in front of the last record", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }]);
    matrix.addRowByIndex({ a: 9 }, -1);
    expect(matrix.value, "#1").toEqual([{ a: 1 }, { a: 9 }, { a: 2 }]);
  });
  test("-1 inserts in front of the last record under paging", () => {
    const matrix = createMatrix({ rowsPerPage: 1 }, [{ a: 1 }, { a: 2 }]);
    matrix.visibleRows;
    matrix.addRowByIndex({ a: 9 }, -1);
    expect(matrix.value, "#1").toEqual([{ a: 1 }, { a: 9 }, { a: 2 }]);
    expect(matrix.pageIndex, "#2: the page of the new record").toBe(1);
  });
  test("a number further back than the first record inserts first", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }]);
    matrix.addRowByIndex({ a: 9 }, -5);
    expect(matrix.value, "#1").toEqual([{ a: 9 }, { a: 1 }, { a: 2 }]);
  });
  test("a live-object value takes the same position", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }]);
    matrix.addRowByIndex({ a: 9 }, 5);
    expect(matrix.value, "#1: past the end appends").toEqual([{ a: 1 }, { a: 2 }, { a: 9 }]);
  });
});

describe("addPanel(n) takes a created position in every mode", () => {
  const hidden = { templateVisibleIf: "{panel.a} <> 1" };
  test("paged panel: a record templateVisibleIf hides is counted", () => {
    const panel = createPanel(Object.assign({ panelsPerPage: 2 }, hidden), [{ a: 1 }, { a: 2 }, { a: 3 }]);
    panel.panels;
    panel.addPanel(1);
    expect(panel.value, "#1").toEqual([{ a: 1 }, {}, { a: 2 }, { a: 3 }]);
  });
  test("unpaged panel: a record templateVisibleIf hides is counted", () => {
    const panel = createPanel(hidden, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    panel.panels;
    panel.addPanel(1);
    expect(panel.value, "#1").toEqual([{ a: 1 }, {}, { a: 2 }, { a: 3 }]);
  });
  test("paged panel: a number past the last record and a negative one append", () => {
    const panel = createPanel({ panelsPerPage: 2 }, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    panel.panels;
    panel.addPanel(10);
    panel.addPanel(-1);
    expect(panel.value, "#1").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, {}, {}]);
  });
});

describe("copyDefaultValueFromLastEntry: the record a panel copies", () => {
  const data = (): Array<any> => [{ a: 1 }, { a: 2 }, { a: 3 }];
  const copy = { copyDefaultValueFromLastEntry: true };
  test("under a filter, addPanel() copies the last record, as the matrix does", () => {
    const json = Object.assign({ filterExpression: "{a} < 3" }, copy);
    const panel = createPanel(json, [{ a: 1 }, { a: 5 }, { a: 2 }]);
    panel.panels;
    panel.addPanel();
    expect(panel.value[3], "#1: the last record").toEqual({ a: 2 });
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, filterExpression: "{a} < 3", copyDefaultValueFromLastEntry: true,
      columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 5 }, { a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.addRow();
    expect(matrix.value[3], "#2: the matrix copies the same record").toEqual({ a: 2 });
  });
  test("under a sort, addPanel() copies the last stored record", () => {
    const panel = createPanel(Object.assign({ sortBy: "a" }, copy), [{ a: 1 }, { a: 5 }, { a: 2 }]);
    panel.panels;
    panel.addPanel();
    expect(panel.value[3], "#1").toEqual({ a: 2 });
  });
  test("paged list mode with records on later pages copies the last record, not the page's last panel", () => {
    const panel = createPanel(Object.assign({ panelsPerPage: 2 }, copy), [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    panel.panels;
    expect(panel.panels.length, "#1: the first page").toBe(2);
    panel.addPanel();
    expect(panel.value[4], "#2").toEqual({ a: 4 });
  });
  test("paged carousel mode keeps copying the current panel", () => {
    const panel = createPanel(Object.assign({ panelsPerPage: 2, displayMode: "carousel" }, copy), [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    panel.panels;
    panel.currentIndex = 1;
    panel.addPanel();
    expect(panel.value, "#1: inserted after the current panel, with its record").toEqual([{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }, { a: 4 }]);
  });
  test("paged list mode: addPanel(0) copies the last record", () => {
    const panel = createPanel(Object.assign({ panelsPerPage: 10 }, copy), data());
    panel.panels;
    panel.addPanel(0);
    expect(panel.value, "#1").toEqual([{ a: 3 }, { a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("paged tab mode: addPanel(0) copies the current panel", () => {
    const panel = createPanel(Object.assign({ panelsPerPage: 10, displayMode: "tab" }, copy), data());
    panel.panels;
    panel.currentIndex = 1;
    panel.addPanel(0);
    expect(panel.value, "#1").toEqual([{ a: 2 }, { a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("unpaged list mode: addPanel(0) copies the record at the last position after the insert", () => {
    const panel = createPanel(copy, data());
    panel.panels;
    panel.addPanel(0);
    expect(panel.value, "#1").toEqual([{ a: 2 }, { a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("unpaged tab mode: addPanel(0) copies the record at the current position after the insert", () => {
    const panel = createPanel(Object.assign({ displayMode: "tab" }, copy), data());
    panel.panels;
    panel.currentIndex = 1;
    panel.addPanel(0);
    expect(panel.value, "#1").toEqual([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }]);
  });
  test("addPanel() copies the current panel in tab mode and the last one in list mode, in every head", () => {
    const list = createPanel(copy, data());
    list.panels;
    list.addPanel();
    expect(list.value, "#1: unpaged list").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }]);
    const pagedList = createPanel(Object.assign({ panelsPerPage: 10 }, copy), data());
    pagedList.panels;
    pagedList.addPanel();
    expect(pagedList.value, "#2: paged list").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }]);
    const tab = createPanel(Object.assign({ displayMode: "tab" }, copy), data());
    tab.panels;
    tab.currentIndex = 1;
    tab.addPanel();
    expect(tab.value, "#3: unpaged tab").toEqual([{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }]);
    const pagedTab = createPanel(Object.assign({ panelsPerPage: 10, displayMode: "tab" }, copy), data());
    pagedTab.panels;
    pagedTab.currentIndex = 1;
    pagedTab.addPanel();
    expect(pagedTab.value, "#4: paged tab").toEqual([{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }]);
  });
});

describe("a row added without a view knows its record", () => {
  const json = { type: "matrixdynamic", name: "m", rowCount: 0, detailPanelMode: "underRow",
    columns: [{ name: "a", cellType: "text" }],
    detailElements: [{ type: "paneldynamic", name: "inner", panelsPerPage: 1, templateElements: [{ type: "text", name: "x" }] }] };
  const innerOf = (matrix: QuestionMatrixDynamicModel, index: number): QuestionPanelDynamicModel =>
    <QuestionPanelDynamicModel>matrix.visibleRows[index].detailPanel.getQuestionByName("inner");
  const checkPageKept = (matrix: QuestionMatrixDynamicModel, index: number): void => {
    const row = matrix.visibleRows[index];
    row.showDetailPanel();
    const inner = innerOf(matrix, index);
    inner.value = [{ x: 1 }, { x: 2 }];
    inner.pageIndex = 1;
    expect(inner.pageIndex, "#1").toBe(1);
    row.hideDetailPanel();
    row.showDetailPanel();
    expect(innerOf(matrix, index).pageIndex, "#2: the inner page after a collapse and re-open").toBe(1);
  };
  test("a row addRow adds", () => {
    const survey = new SurveyModel({ elements: [json] });
    survey.data = { m: [{ a: 1 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.addRow();
    checkPageKept(matrix, 1);
  });
  test("a row for a value that grew by one", () => {
    const survey = new SurveyModel({ elements: [json] });
    survey.data = { m: [{ a: 1 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    survey.setValue("m", [{ a: 1 }, { a: 2 }]);
    expect(matrix.visibleRows.length, "#0").toBe(2);
    checkPageKept(matrix, 1);
  });
  test("a row rowCount adds", () => {
    const survey = new SurveyModel({ elements: [json] });
    survey.data = { m: [{ a: 1 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.rowCount = 2;
    checkPageKept(matrix, 1);
  });
});

describe("a new record shares no object with the defaults", () => {
  test("matrix: defaultRowValue", () => {
    const matrix = createMatrix({ defaultRowValue: { a: "x", o: { k: 1 } } }, [{ a: 1 }]);
    matrix.visibleRows;
    matrix.addRow();
    expect(matrix.value[1], "#1").toEqual({ a: "x", o: { k: 1 } });
    expect(matrix.value[1].o === matrix.defaultRowValue.o, "#2: not shared").toBe(false);
  });
  test("matrix with a data source: defaultRowValue", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, defaultRowValue: { a: "x", o: { k: 1 } },
      columns: [{ name: "a", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    let records: Array<any> = [{ a: 1 }];
    matrix.dataSource = new ArrayDynamicDataSource(() => records, (arr: Array<any>): void => { records = arr; });
    matrix.visibleRows;
    matrix.addRow();
    expect(records[1], "#1").toEqual({ a: "x", o: { k: 1 } });
    expect(records[1].o === matrix.defaultRowValue.o, "#2: not shared").toBe(false);
  });
  test("panel: defaultPanelValue", () => {
    const panel = createPanel({ defaultPanelValue: { a: "x", o: { k: 1 } } }, [{ a: 1 }]);
    panel.panels;
    panel.addPanel();
    expect(panel.value[1].o === panel.defaultPanelValue.o, "#1: not shared").toBe(false);
  });
});
