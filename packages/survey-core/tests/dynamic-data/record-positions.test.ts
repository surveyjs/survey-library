import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicItem, QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* Positions and numbers: the visible index of an object, the record a number names, the page an add
   or a Next lands on, and the reads that must not create the record list. */

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

// A keyed in-memory source that answers at once: read whole, or a page at a time when it pages.
class SyncSource implements IDynamicDataSource {
  public keyField = "id";
  public reads: number = 0;
  constructor(public records: Array<any>, public capabilities: IDynamicDataSourceCapabilities = { paging: false, filtering: false, sorting: false }) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.reads++;
    let res = this.records;
    if (this.capabilities.filtering && !!request.filter) {
      res = res.filter(r => r.a % 2 === 0);
    }
    const take = request.take > 0 ? request.take : res.length;
    return { records: res.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)), total: res.length };
  }
  private indexOfKey(key: any): number {
    return this.records.map(r => r.id).indexOf(key);
  }
  public update(key: any, record: any): void {
    const at = this.indexOfKey(key);
    if (at > -1)this.records[at] = Object.assign({}, record);
  }
  public insert(record: any, sourceIndex: number): any {
    const stored = Object.assign({ id: 1000 + this.records.length }, record);
    this.records.splice(sourceIndex, 0, stored);
    return Object.assign({}, stored);
  }
  public remove(key: any): void {
    const at = this.indexOfKey(key);
    if (at > -1)this.records.splice(at, 1);
  }
  public move(key: any, toIndex: number): void {
    const at = this.indexOfKey(key);
    if (at < 0) return;
    const rec = this.records[at];
    this.records.splice(at, 1);
    this.records.splice(toIndex, 0, rec);
  }
}
function keyedRecords(count: number): Array<any> {
  return records(count).map((r, i) => Object.assign({ id: i + 1 }, r));
}

describe("a reorderable matrix builds its table without creating a record list", () => {
  test("the drag answer and the rendered table of a plain reorderable matrix", () => {
    const matrix = createMatrix({ allowRowReorder: true, rowCount: 2 });
    expect(matrix.isRowsDragAndDrop, "#1").toBe(true);
    expect(matrix.renderedTable.rows.length > 0, "#2: the table is built").toBe(true);
    expect(matrix["dataListValue"], "#3: no record list").toBeUndefined();
  });
});

describe("the drag answer under a sort, a filtered source page and design mode", () => {
  test("a sort turns the drag off and clearing it turns it on again", () => {
    const matrix = createMatrix({ allowRowReorder: true }, records(3));
    expect(matrix.isRowsDragAndDrop, "#1").toBe(true);
    matrix.sortOrder = [{ field: "a", direction: "desc" }];
    expect(matrix.isRowsDragAndDrop, "#2: sorted").toBe(false);
    matrix.clearSort();
    expect(matrix.isRowsDragAndDrop, "#3").toBe(true);
  });
  test("an authored sort in design mode: the matrix shows the authored order, the drag is on", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 2, allowRowReorder: true,
      sortBy: "a-", columns: [{ name: "a", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.isRowsDragAndDrop, "#1").toBe(true);
  });
  test("a page the source filtered: the drag is off and moveRowByIndex is refused with its reason", () => {
    const source = new SyncSource(keyedRecords(6), { paging: true, filtering: true, sorting: false });
    const matrix = createMatrix({ allowRowReorder: true, rowsPerPage: 2 });
    matrix.dataSource = source;
    expect(matrix.isRowsDragAndDrop, "#1: a page read without a view").toBe(true);
    const errors: Array<string> = [];
    (<SurveyModel>matrix.survey).onDynamicDataError.add((_, options) => { errors.push(options.operation + ": " + options.error.message); });
    matrix.filterExpression = "{a} > 0";
    expect(matrix.isRowsDragAndDrop, "#2: a filtered page").toBe(false);
    matrix.moveRowByIndex(0, 1);
    expect(errors, "#3").toEqual(["move: The data source filtered or sorted the loaded page, so the position in the whole source is not known; the move was not made."]);
    expect(source.records.map(r => r.a), "#4: nothing moved").toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe("a record is read without creating a record list", () => {
  test("panel: question.value answers what the list answers", () => {
    const panel = createPanel({ panelCount: 0 }, records(3));
    const read = (i: number): any => panel["getListRecordAt"](i);
    const list = panel["dataList"];
    expect([read(-1), read(0), read(2), read(3)], "#1").toEqual([undefined, panel.value[0], panel.value[2], undefined]);
    expect([list.getRecord(-1), list.getRecord(0), list.getRecord(2), list.getRecord(3)], "#2").toEqual([read(-1), read(0), read(2), read(3)]);
    expect(read(0), "#3: the stored record itself").toBe(list.getRecord(0));
  });
  test("matrix: a padded record reads the default row value", () => {
    const matrix = createMatrix({ rowCount: 3, defaultRowValue: { a: 9 } });
    const read = (i: number): any => matrix["getListRecordAt"](i);
    expect([read(0), read(2), read(3)], "#1").toEqual([{ a: 9 }, { a: 9 }, undefined]);
    expect(matrix["dataListValue"], "#2: no record list").toBeUndefined();
  });
});

describe("a panel names its record after a removal, an assignment and a count change", () => {
  test("an assignment from outside builds the new panels while the old ones are still there", () => {
    const panel = createPanel({ panelCount: 3, displayMode: "tab" });
    panel.survey.data = { p: [{ a: "c" }, { a: "a" }, { a: "b" }] };
    expect(panel.panels.map(p => p.getQuestionByName("a").value), "#1: the panels show the assigned records").toEqual(["c", "a", "b"]);
    panel.currentIndex = 2;
    expect(panel["getCurrentRecordIndex"](), "#2: the position names the record").toBe(2);
  });
  test("a count change and a removal", () => {
    const panel = createPanel({ panelCount: 0, displayMode: "tab" }, [{ a: "x" }, { a: "y" }, { a: "z" }]);
    panel.panelCount = 4;
    panel.currentIndex = 3;
    expect(panel["getCurrentRecordIndex"](), "#1: the new panel").toBe(3);
    panel.currentIndex = 2;
    panel.removePanel(0);
    expect(panel.currentPanel.getQuestionByName("a").value, "#2: the current panel keeps its record").toBe("z");
    expect(panel["getCurrentRecordIndex"](), "#3").toBe(1);
  });
  test("a rebuild for the view gives every panel the record of its position", () => {
    const panel = createPanel({ panelCount: 0, panelsPerPage: 2 }, records(5));
    panel.pageIndex = 1;
    expect(panel.panels.map(p => (<QuestionPanelDynamicItem>p.data).getIndex()), "#1: the record each panel names").toEqual([2, 3]);
    expect(panelValues(panel), "#2").toEqual([2, 3]);
  });
});

describe("the page check for an add and for Next", () => {
  test("matrix: an add on the last page stays, an add on a full page moves to the next one", () => {
    const matrix = createMatrix({ rowsPerPage: 2 }, records(3));
    matrix.pageIndex = 1;
    expect(matrix["isAddLeavingPage"](), "#1: page 1 has room").toBe(false);
    matrix.pageIndex = 0;
    expect(matrix["isAddLeavingPage"](), "#2").toBe(true);
    matrix.addRowUI();
    expect(matrix.pageIndex, "#3").toBe(1);
    expect(rowValues(matrix), "#4").toEqual([2, undefined]);
  });
  test("panel: an add in front of a record on another page, and Next at the end of a page", () => {
    const panel = createPanel({ panelCount: 0, panelsPerPage: 2, displayMode: "carousel" }, records(5));
    expect(panel["isAddLeavingPage"](3), "#1: in front of record 3, page 1").toBe(true);
    expect(panel["isAddLeavingPage"](1), "#2: in front of record 1, page 0").toBe(false);
    panel.currentIndex = 1;
    panel.goToNextPanel();
    expect(panel.pageIndex, "#3").toBe(1);
    expect(panel.currentIndex, "#4").toBe(2);
  });
  test("panel: Next with a hidden record skips it", () => {
    const panel = createPanel({ panelCount: 0, panelsPerPage: 2, displayMode: "carousel", templateVisibleIf: "{panel.a} != 2" }, records(5));
    panel.currentIndex = 1;
    panel.goToNextPanel();
    expect(panel.pageIndex, "#1").toBe(1);
    expect(panel.currentPanel.getQuestionByName("a").value, "#2").toBe(3);
  });
});

describe("Next on a source page that holds a record added past the page size", () => {
  test("Next stays on the page: the page holds the next record", () => {
    const panel = createPanel({ panelsPerPage: 2, displayMode: "carousel" });
    panel.dataSource = new SyncSource(keyedRecords(4), { paging: true, filtering: false, sorting: false });
    panel.panels;
    panel.currentIndex = 0;
    panel.addPanel();
    expect(panelValues(panel), "#1: the page holds three records").toEqual([0, undefined, 1]);
    panel.currentIndex = 1;
    panel.goToNextPanel();
    expect(panel.pageIndex, "#2").toBe(0);
    expect(panel.currentIndex, "#3").toBe(2);
  });
});

describe("the copy source of an add on a source page", () => {
  test("the last record the page shows, not a hidden one behind it", () => {
    const matrix = createMatrix({ rowsPerPage: 2, copyDefaultValueFromLastEntry: true, rowsVisibleIf: "{row.a} != 1" });
    const source = new SyncSource(keyedRecords(4), { paging: true, filtering: false, sorting: false });
    matrix.dataSource = source;
    expect(rowValues(matrix), "#1: record 1 is hidden").toEqual([0]);
    matrix.addRow();
    expect(source.records.map(r => r.a), "#2: copied from record 0").toEqual([0, 1, 0, 2, 3]);
  });
});

describe("numbers name the same record with and without paging", () => {
  const ops: Array<{ name: string, run: (m: QuestionMatrixDynamicModel) => void }> = [
    { name: "removeRowByIndex(1)", run: m => m.removeRowByIndex(1) },
    { name: "moveRowByIndex(0, 2)", run: m => m.moveRowByIndex(0, 2) },
    { name: "addRowByIndex({a: 9}, 1)", run: m => m.addRowByIndex({ a: 9 }, 1) },
    { name: "addRowByIndex({a: 9}, -1)", run: m => m.addRowByIndex({ a: 9 }, -1) }
  ];
  ops.forEach(op => {
    test(op.name, () => {
      const unpaged = createMatrix({}, records(4));
      const paged = createMatrix({ rowsPerPage: 2 }, records(4));
      unpaged.visibleRows;
      paged.visibleRows;
      op.run(unpaged);
      op.run(paged);
      expect(values(paged.value), "#1").toEqual(values(unpaged.value));
    });
  });
  test("getRowValue and setRowValue name the record a removal names", () => {
    const unpaged = createMatrix({}, records(4));
    const paged = createMatrix({ rowsPerPage: 2 }, records(4));
    expect(paged.getRowValue(3), "#1").toEqual(unpaged.getRowValue(3));
    unpaged.setRowValue(3, { a: 7 });
    paged.setRowValue(3, { a: 7 });
    expect(values(paged.value), "#2").toEqual(values(unpaged.value));
    expect(values(paged.value), "#3").toEqual([0, 1, 2, 7]);
  });
  test("the removal of a row by the UI names the record of its row", () => {
    const matrix = createMatrix({ rowsPerPage: 2 }, records(4));
    matrix.pageIndex = 1;
    matrix.removeRowUI(matrix.visibleRows[1]);
    expect(values(matrix.value), "#1").toEqual([0, 1, 2]);
  });
  test("a row's visible index on the second page", () => {
    const matrix = createMatrix({ rowsPerPage: 2 }, records(4));
    matrix.pageIndex = 1;
    expect(matrix.visibleRows.map(row => row.visibleIndex), "#1").toEqual([2, 3]);
  });
});

describe("addRowByIndex with a negative number under a filter", () => {
  test("-1 goes in front of the last record the view shows", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    matrix.filterExpression = "{a} != 3";
    expect(rowValues(matrix), "#1").toEqual([1, 2, 4]);
    matrix.addRowByIndex({ a: 9 }, -1);
    expect(values(matrix.value), "#2").toEqual([1, 2, 3, 9, 4]);
    expect(rowValues(matrix), "#3").toEqual([1, 2, 9, 4]);
  });
  test("without a filter -1 still goes in front of the last record", () => {
    const matrix = createMatrix({}, records(3));
    matrix.addRowByIndex({ a: 9 }, -1);
    expect(values(matrix.value), "#1").toEqual([0, 1, 9, 2]);
  });
});

describe("addPanel with a filter and no paging returns the new panel and announces it", () => {
  test("list mode", () => {
    const panel = createPanel({ panelCount: 0 }, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    panel.filterExpression = "{a} != 2";
    expect(panelValues(panel), "#1").toEqual([1, 3]);
    const added: Array<any> = [];
    panel.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const newPanel = panel.addPanel();
    expect(!!newPanel, "#2: the new panel").toBe(true);
    expect(added, "#3: announced").toEqual([newPanel]);
    expect(panel.panels.indexOf(newPanel), "#4: last").toBe(2);
    expect(panel.value.length, "#5").toBe(4);
  });
  test("without a view a number names the position in the panels", () => {
    const panel = createPanel({ panelCount: 0 }, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    const newPanel = panel.addPanel(1);
    expect(panel.panels.indexOf(newPanel), "#1").toBe(1);
    expect(panelValues(panel), "#2").toEqual([1, undefined, 2, 3]);
    expect(panel.addPanel(99), "#3: past the end appends").toBe(panel.panels[4]);
  });
});

describe("removeRowByIndex with a source and no paging refuses an out-of-range number", () => {
  test("a number past the records and a negative one remove nothing", () => {
    const source = new SyncSource(keyedRecords(3));
    const matrix = createMatrix({});
    matrix.dataSource = source;
    matrix.removeRowByIndex(99);
    matrix.removeRowByIndex(-1);
    expect(source.records.map(r => r.a), "#1").toEqual([0, 1, 2]);
    matrix.removeRowByIndex(2);
    expect(source.records.map(r => r.a), "#2").toEqual([0, 1]);
  });
  test("a local matrix under a filter refuses a number past the rows the view shows", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    matrix.filterExpression = "{a} != 2";
    matrix.removeRowByIndex(3);
    expect(values(matrix.value), "#1: past the record count").toEqual([1, 2, 3]);
    matrix.removeRowByIndex(2);
    expect(values(matrix.value), "#2: past the rows shown, below the record count").toEqual([1, 2, 3]);
    matrix.removeRowByIndex(1);
    expect(values(matrix.value), "#3: the last row shown").toEqual([1, 2]);
  });
});

describe("addRow under paging writes the new record and shows its page", () => {
  test("the default row value goes to the appended record", () => {
    const matrix = createMatrix({ rowsPerPage: 2, defaultRowValue: { a: 9 } }, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    matrix.addRow();
    expect(values(matrix.value), "#1").toEqual([1, 2, 3, 9]);
    expect(matrix.pageIndex, "#2").toBe(1);
  });
});

describe("the fixed matrix keeps the answers of the rows it shows when it clears incorrect values", () => {
  const run = (json: any, prepare?: (m: QuestionMatrixDropdownModel) => void): any => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdropdown", name: "m",
      columns: [{ name: "c1", cellType: "text" }] }, json)] });
    survey.data = { m: { r1: { c1: 1 }, r2: { c1: 2 }, r3: { c1: 3 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    if (!!prepare) prepare(matrix);
    matrix.clearIncorrectValues();
    return matrix.value;
  };
  const kept = { r1: { c1: 1 }, r3: { c1: 3 } };
  test("a row hidden by visibleIf, with and without a record list", () => {
    const rows = ["r1", { value: "r2", visibleIf: "false" }, "r3"];
    expect(run({ rows: rows }), "#1").toEqual(kept);
    expect(run({ rows: rows }, m => { m.rowsPerPage = 0; m.visibleRows; }), "#2: a list, no view").toEqual(kept);
    expect(run({ rows: rows, rowsPerPage: 2 }), "#3: paged").toEqual(kept);
    expect(run({ rows: rows, filterExpression: "{c1} > 0" }, m => { m.visibleRows; }), "#4: a view").toEqual(kept);
    expect(run({ rows: rows, filterExpression: "{c1} > 0" }, m => { m.visibleRows; m.filterExpression = ""; m.visibleRows; }), "#5: a view cleared").toEqual(kept);
  });
  test("rowsVisibleIf, and a filter that keeps the answers it excludes", () => {
    expect(run({ rows: ["r1", "r2", "r3"], rowsVisibleIf: "{item} != 'r2'" }, m => { m.rowsPerPage = 0; m.visibleRows; }), "#1").toEqual(kept);
    expect(run({ rows: ["r1", "r2", "r3"], filterExpression: "{c1} > 1" }, m => { m.visibleRows; }), "#2")
      .toEqual({ r1: { c1: 1 }, r2: { c1: 2 }, r3: { c1: 3 } });
  });
});
