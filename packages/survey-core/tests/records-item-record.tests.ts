import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionRecordItem, QuestionRecordsModel, addRecordGetter } from "../src/question_records";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { PanelModel } from "../src/panel";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource
} from "../src/dynamic-data/dynamic-data-interfaces";
import { ConsoleWarnings } from "../src/console-warnings";

/* A row (or a dynamic panel) gives its whole record through getRecord(), on any page: row.value holds
   only the fields with a cell, and getRowValue takes a created position that no public member maps a
   row to (prompt 05). Seven records { a: "r<i>", id: 100 + i, flag }, three per page: page 2 (index 1)
   shows r3-r5, page 3 (index 2) the short page r6. Only "a" has a column or a question. */

const records = (): Array<any> => [0, 1, 2, 3, 4, 5, 6].map(i => ({ a: "r" + i, id: 100 + i, flag: i % 2 === 0 }));
async function flush(times: number = 30): Promise<void> {
  for (let i = 0; i < times; i++) await Promise.resolve();
}
/* A source that pages itself and applies the view on its side, as a server does. It knows the two
   filters and the one sort these tests send. */
class ServerSource implements IDynamicDataSource {
  public capabilities = { paging: true, filtering: true, sorting: true };
  public keyField = "id";
  constructor(public data: Array<any>) { }
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    let res = this.data.slice();
    if (request.filter === "{id} > 101") res = res.filter(r => r.id > 101);
    else if (request.filter !== "") throw new Error("unexpected filter: " + request.filter);
    if (request.sort.length > 0) {
      const desc = request.sort[0].direction === "desc";
      const field = request.sort[0].field;
      res.sort((x, y) => (x[field] < y[field] ? -1 : x[field] > y[field] ? 1 : 0) * (desc ? -1 : 1));
    }
    const take = request.take > 0 ? request.take : res.length;
    return Promise.resolve({ records: res.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)), total: res.length });
  }
  public remove(key: any): Promise<void> {
    const at = this.data.map(r => r.id).indexOf(key);
    if (at > -1)this.data.splice(at, 1);
    return Promise.resolve();
  }
}
// A source that does not page: it answers with every record, and the question pages, filters and sorts.
const plainSource = (data: Array<any>): IDynamicDataSource => ({ read: (): Array<any> => data.map(r => Object.assign({}, r)) });

type Storage = "value" | "source" | "server";
const storages: Array<Storage> = ["value", "source", "server"];

function createMatrix(json: any = {}): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 3,
    columns: [{ name: "a", cellType: "text" }] }, json)] });
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
function createPanel(json: any = {}): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p", pageSize: 3,
    templateElements: [{ type: "text", name: "a" }] }, json)] });
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
}
async function load(q: QuestionMatrixDynamicModel | QuestionPanelDynamicModel, storage: Storage, view?: { filter?: string, sort?: any }): Promise<void> {
  if (storage === "value") q.value = records();
  if (storage === "source") q.dataSource = plainSource(records());
  if (storage === "server") q.dataSource = new ServerSource(records());
  if (!!view && !!view.filter) q.filterExpression = view.filter;
  if (!!view && !!view.sort) q.sortCriteria = [view.sort];
  await flush();
}
async function goTo(q: QuestionMatrixDynamicModel | QuestionPanelDynamicModel, pageIndex: number): Promise<void> {
  q.pageIndex = pageIndex;
  await flush();
}
const surveyOf = (q: QuestionMatrixDynamicModel | QuestionPanelDynamicModel): SurveyModel => <SurveyModel>q.survey;
const rowRecords = (q: QuestionMatrixDynamicModel): Array<any> => q.visibleRows.map(row => row.getRecord());
const panelRecords = (q: QuestionPanelDynamicModel): Array<any> => q.panels.map(panel => (<QuestionRecordItem>panel.data).getRecord());
const ids = (recs: Array<any>): Array<any> => recs.map(r => !!r ? r.id : r);

describe("getRecord: the row's own record on any page", () => {
  storages.forEach((storage: Storage) => {
    test(`matrixdynamic, ${storage}: pages 2 and 3 give their own records, with the fields that have no column`, async () => {
      const q = createMatrix();
      await load(q, storage);
      await goTo(q, 1);
      expect(rowRecords(q), "#1: page 2, every field").toEqual(records().slice(3, 6));
      expect(q.visibleRows[0].value, "#2: row.value keeps only the column").toEqual({ a: "r3" });
      await goTo(q, 2);
      expect(rowRecords(q), "#3: page 3, the short page").toEqual(records().slice(6));
    });
    test(`paneldynamic, ${storage}: pages 2 and 3 give their own records, with the fields that have no question`, async () => {
      const q = createPanel();
      await load(q, storage);
      await goTo(q, 1);
      expect(panelRecords(q), "#1: page 2").toEqual(records().slice(3, 6));
      await goTo(q, 2);
      expect(panelRecords(q), "#2: page 3").toEqual(records().slice(6));
    });
  });
  // Without paging the index guesses agree with the rows: the record is still the whole record.
  test("matrixdynamic and paneldynamic without paging: every record", () => {
    const m = createMatrix({ pageSize: 0 });
    m.value = records();
    expect(rowRecords(m), "#1").toEqual(records());
    const p = createPanel({ pageSize: 0 });
    p.value = records();
    expect(panelRecords(p), "#2").toEqual(records());
  });
});

describe("getRecord: with a filter, a sort and owner-hidden records", () => {
  // "{id} > 101" leaves r2-r6: page 2 shows r5, r6.
  (<Array<Storage>>["value", "server"]).forEach((storage: Storage) => {
    test(`matrixdynamic, ${storage}: a filter`, async () => {
      const q = createMatrix();
      await load(q, storage, { filter: "{id} > 101" });
      await goTo(q, 1);
      expect(ids(rowRecords(q))).toEqual([105, 106]);
    });
    test(`paneldynamic, ${storage}: a filter`, async () => {
      const q = createPanel();
      await load(q, storage, { filter: "{id} > 101" });
      await goTo(q, 1);
      expect(ids(panelRecords(q))).toEqual([105, 106]);
    });
    // id descending: page 2 shows r3, r2, r1.
    test(`matrixdynamic, ${storage}: a sort`, async () => {
      const q = createMatrix();
      await load(q, storage, { sort: { field: "id", direction: "desc" } });
      await goTo(q, 1);
      expect(ids(rowRecords(q))).toEqual([103, 102, 101]);
    });
    test(`paneldynamic, ${storage}: a sort`, async () => {
      const q = createPanel();
      await load(q, storage, { sort: { field: "id", direction: "desc" } });
      await goTo(q, 1);
      expect(ids(panelRecords(q))).toEqual([103, 102, 101]);
    });
  });
  /* r1 hidden: the pages are r0 r2 r3 / r4 r5 r6. row.visibleIndex skips r1, getRowValue's created
     position counts it, so getRowValue(row.visibleIndex) gave the record before each row's own. */
  test("matrixdynamic: rowsVisibleIf hides a record before the page", () => {
    const q = createMatrix({ rowsVisibleIf: "{row.id} != 101" });
    q.value = records();
    q.pageIndex = 1;
    expect(ids(rowRecords(q)), "#1").toEqual([104, 105, 106]);
    expect(q.visibleRows.map(row => q.getRowValue(row.visibleIndex).id), "#2: the index guess is one record off").toEqual([103, 104, 105]);
  });
  test("paneldynamic: templateVisibleIf hides a record before the page", () => {
    const q = createPanel({ templateVisibleIf: "{panel.id} != 101" });
    q.value = records();
    q.pageIndex = 1;
    expect(ids(panelRecords(q))).toEqual([104, 105, 106]);
  });
});

describe("getRecord: what it returns", () => {
  test("matrixdynamic: a copy - changing it changes neither the matrix nor the next read", () => {
    const q = createMatrix();
    q.value = records();
    q.pageIndex = 1;
    const record = q.visibleRows[0].getRecord();
    record.id = 999;
    record.a = "changed";
    expect(q.value[3], "#1").toEqual(records()[3]);
    expect(q.visibleRows[0].getRecord(), "#2").toEqual(records()[3]);
  });
  test("paneldynamic: a copy (getAllValues gives the stored record itself)", () => {
    const q = createPanel();
    q.value = records();
    q.pageIndex = 1;
    const item = <QuestionRecordItem>q.panels[0].data;
    const record = item.getRecord();
    record.id = 999;
    expect(q.value[3], "#1").toEqual(records()[3]);
    expect(item.getAllValues() === item.getRecord(), "#2: a new copy each time").toBe(false);
  });
  test("a cell edit is in the record that follows", () => {
    const q = createMatrix();
    q.value = records();
    q.pageIndex = 1;
    q.visibleRows[1].getQuestionByColumnName("a").value = "edited";
    expect(q.visibleRows[1].getRecord(), "#1").toEqual(Object.assign(records()[4], { a: "edited" }));
  });
  test("matrixdropdown: what getRowValue returns for the row - the stored object, null without a value", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "md", rows: ["x", "y"],
      columns: [{ name: "a", cellType: "text", totalType: "count" }] }] });
    survey.data = { md: { x: { a: "1", extra: 5 } } };
    const q = <QuestionMatrixDropdownModel>survey.getQuestionByName("md");
    expect(q.visibleRows.map(row => row.getRecord()), "#1").toEqual([{ a: "1", extra: 5 }, null]);
    expect(q.visibleRows.map((row, i) => q.getRowValue(i)), "#2: the same as getRowValue").toEqual([{ a: "1", extra: 5 }, null]);
    expect(q.visibleTotalRow.getRecord(), "#3: the total row has no record").toBeNull();
  });
  test("an empty record reads {}: a padded dynamic matrix row, a dynamic panel without a value", () => {
    const m = createMatrix({ pageSize: 0, rowCount: 2 });
    expect(rowRecords(m), "#1").toEqual([{}, {}]);
    const p = createPanel({ pageSize: 0, panelCount: 2 });
    expect(panelRecords(p), "#2").toEqual([{}, {}]);
  });
  // The event options take getRecord from addRecordGetter: a panel without a record item reads null.
  test("an event about the template or another panel without a record reads null", () => {
    const q = createPanel();
    q.value = records();
    expect(addRecordGetter({}, q.template).getRecord(), "#1: the template").toBeNull();
    expect(addRecordGetter({}, new PanelModel("plain")).getRecord(), "#2: a panel of no dynamic panel").toBeNull();
    expect(addRecordGetter({}, undefined).getRecord(), "#3: nothing").toBeNull();
    expect(addRecordGetter({}, q.panels[2]).getRecord(), "#4: a panel of the question").toEqual(records()[2]);
  });
  // A built row of a server source always has its loaded record: a row is built from one.
  test("a server source: every built row of every page has its record", async () => {
    const q = createMatrix();
    await load(q, "server");
    for (let page = 0; page < 3; page++) {
      await goTo(q, page);
      q.visibleRows.forEach(row => expect(row.getRecord(), "page " + page).not.toBeNull());
    }
  });
});

describe("getRecord in the events about a row", () => {
  test("onGetMatrixRowActions on page 2: options.getRecord() and options.row.getRecord()", () => {
    const q = createMatrix();
    const got: Array<any> = [];
    surveyOf(q).onGetMatrixRowActions.add((_, options) => {
      got.push([options.getRecord().id, options.row.getRecord().id]);
    });
    q.value = records();
    q.pageIndex = 1;
    q.renderedTable;
    expect(got.slice(-3)).toEqual([[103, 103], [104, 104], [105, 105]]);
  });
  test("onMatrixDetailPanelVisibleChanged on page 2", () => {
    const q = createMatrix({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    const got: Array<any> = [];
    surveyOf(q).onMatrixDetailPanelVisibleChanged.add((_, options) => {
      got.push([options.getRecord(), options.row.getRecord().id]);
    });
    q.value = records();
    q.pageIndex = 1;
    q.visibleRows[1].showDetailPanel();
    expect(got).toEqual([[records()[4], 104]]);
  });
  test("the cell events on page 2: creating, created, value changing, changed, validate", () => {
    const q = createMatrix({ pageSize: 3 });
    const got: Array<string> = [];
    const survey = surveyOf(q);
    survey.onMatrixCellCreating.add((_, options) => { got.push("creating " + options.getRecord().id); });
    survey.onMatrixCellCreated.add((_, options) => { got.push("created " + options.getRecord().id); });
    survey.onMatrixCellValueChanging.add((_, options) => { got.push("changing " + options.getRecord().id); });
    survey.onMatrixCellValueChanged.add((_, options) => { got.push("changed " + options.getRecord().id); });
    survey.onMatrixCellValidate.add((_, options) => { got.push("validate " + options.getRecord().id); });
    q.value = records();
    q.pageIndex = 1;
    q.visibleRows;
    // onMatrixCellCreating runs in the row's constructor, before the row has a position: the record it is built for.
    expect(got.filter(s => s.indexOf("creating") === 0), "#1").toEqual(["creating 103", "creating 104", "creating 105"]);
    expect(got.filter(s => s.indexOf("created") === 0), "#1a").toEqual(["created 103", "created 104", "created 105"]);
    got.length = 0;
    q.visibleRows[2].getQuestionByColumnName("a").value = "x";
    expect(got, "#2").toEqual(["changing 105", "changed 105"]);
    got.length = 0;
    q.validate();
    expect(got, "#3: the page's cells").toEqual(["validate 103", "validate 104", "validate 105"]);
  });
  // options.rowValue is {} in onMatrixCellCreating: the cells give the row its value, and none exists yet.
  test("onMatrixCellCreating: a cell type chosen by a field without a column, on page 2 of a server source", async () => {
    const q = createMatrix();
    const rowValues: Array<any> = [];
    surveyOf(q).onMatrixCellCreating.add((_, options) => {
      rowValues.push(options.rowValue);
      if (options.getRecord().flag) options.cellType = "comment";
    });
    await load(q, "server");
    await goTo(q, 1);
    expect(q.visibleRows.map(row => row.cells[0].question.getType()), "#1: r4 has the flag").toEqual(["text", "comment", "text"]);
    expect(rowValues.slice(-3), "#2: rowValue has nothing to give").toEqual([{}, {}, {}]);
  });
  test("a server source: onMatrixRowRemoving / onMatrixRowRemoved on page 2", async () => {
    const q = createMatrix();
    const got: Array<any> = [];
    surveyOf(q).onMatrixRowRemoving.add((_, options) => { got.push(["removing", options.getRecord().id]); });
    surveyOf(q).onMatrixRowRemoved.add((_, options) => { got.push(["removed", options.getRecord().id]); });
    await load(q, "server");
    await goTo(q, 1);
    q.removeRowUI(q.visibleRows[1]);
    await flush();
    expect(got).toEqual([["removing", 104], ["removed", 104]]);
  });
  test("a server source: onDynamicPanelRemoving / onDynamicPanelRemoved on page 2", async () => {
    const q = createPanel();
    const got: Array<any> = [];
    surveyOf(q).onDynamicPanelRemoving.add((_, options) => { got.push(["removing", options.getRecord().id]); });
    surveyOf(q).onDynamicPanelRemoved.add((_, options) => { got.push(["removed", options.getRecord().id]); });
    await load(q, "server");
    await goTo(q, 1);
    q.removePanel(q.panels[1]);
    await flush();
    expect(got).toEqual([["removing", 104], ["removed", 104]]);
  });
  test("onAfterRenderMatrixCell", () => {
    const q = createMatrix();
    let record: any;
    surveyOf(q).onAfterRenderMatrixCell.add((_, options) => { record = options.getRecord(); });
    q.value = records();
    q.pageIndex = 1;
    const row = q.visibleRows[2];
    surveyOf(q).matrixAfterCellRender({ cellQuestion: row.cells[0].question, cell: row.cells[0], row: row, column: row.cells[0].column, htmlElement: undefined });
    expect(record).toEqual(records()[5]);
  });
  test("onMatrixRowRemoving / onMatrixRowRemoved / onMatrixAllowRemoveRow: the removed record", () => {
    const q = createMatrix();
    const got: Array<any> = [];
    surveyOf(q).onMatrixRenderRemoveButton.add((_, options) => { if (options.row === q.visibleRows[1]) got.push(["allow", options.getRecord().id]); });
    surveyOf(q).onMatrixRowRemoving.add((_, options) => { got.push(["removing", options.getRecord()]); });
    surveyOf(q).onMatrixRowRemoved.add((_, options) => { got.push(["removed", options.getRecord()]); });
    q.value = records();
    q.pageIndex = 1;
    q.renderedTable;
    expect(got.filter(g => g[0] === "allow").length > 0, "#1").toBe(true);
    expect(got.every(g => g[0] !== "allow" || g[1] === 104), "#2").toBe(true);
    got.length = 0;
    q.removeRowUI(q.visibleRows[1]);
    expect(got, "#3").toEqual([["removing", records()[4]], ["removed", records()[4]]]);
    expect(q.value.map((r: any) => r.id), "#4").toEqual([100, 101, 102, 103, 105, 106]);
  });
  test("onMatrixRowAdded: the new record", () => {
    const q = createMatrix({ pageSize: 0 });
    let record: any;
    surveyOf(q).onMatrixRowAdded.add((_, options) => { record = options.getRecord(); });
    q.value = records();
    q.addRow();
    expect(record).toEqual({});
  });
  // The keyboard move of the drag handle raises the drag's event; the handler refuses the move.
  test("onMatrixRowDragOver on page 2: the target row's record", () => {
    const q = createMatrix({ allowRowReorder: true });
    let record: any;
    surveyOf(q).onMatrixRowDragOver.add((_, options) => { record = options.getRecord(); options.allow = false; });
    q.value = records();
    q.pageIndex = 1;
    q.onDragHandleKeyDown(<any>{ key: "ArrowDown", preventDefault: () => { } }, q.visibleRows[0]);
    expect(record, "#1: the row below r3").toEqual(records()[4]);
    expect(q.value.map((r: any) => r.id), "#2: nothing moved").toEqual(records().map(r => r.id));
  });
  /* The cell events fire once per cell: the record is read and copied only when a handler asks for it.
     A removal keeps the removed record uncopied for its removed event. */
  test("the record is not read or copied for handlers that do not ask", () => {
    const read = vi.spyOn(<any>QuestionMatrixDropdownModelBase.prototype, "getItemRecord");
    const copy = vi.spyOn(<any>QuestionRecordsModel.prototype, "copyItemRecord");
    const q = createMatrix();
    const survey = surveyOf(q);
    survey.onMatrixCellCreating.add(() => { });
    survey.onMatrixCellCreated.add(() => { });
    survey.onGetMatrixRowActions.add(() => { });
    survey.onMatrixRowRemoving.add(() => { });
    survey.onMatrixRowRemoved.add(() => { });
    q.value = records();
    q.pageIndex = 1;
    q.renderedTable;
    q.removeRowUI(q.visibleRows[1]);
    expect(read, "#1").not.toHaveBeenCalled();
    expect(copy, "#2").not.toHaveBeenCalled();
  });
  test("paneldynamic: a removal does not copy the record for handlers that do not ask", () => {
    const copy = vi.spyOn(<any>QuestionRecordsModel.prototype, "copyItemRecord");
    const q = createPanel();
    surveyOf(q).onDynamicPanelRemoved.add(() => { });
    q.value = records();
    q.removePanel(q.panels[1]);
    expect(copy).not.toHaveBeenCalled();
  });
  // Only the row under construction reads the record it is built for.
  test("onMatrixCellCreating: another row and the total row read their own records while a row is built", () => {
    const q = createMatrix({ columns: [{ name: "a", cellType: "text", totalType: "count" }] });
    const got: Array<any> = [];
    let first: any;
    surveyOf(q).onMatrixCellCreating.add((_, options) => {
      if (!first) first = options.row;
      got.push([options.getRecord().id, first.getRecord()?.id, q.visibleTotalRow?.getRecord()]);
    });
    q.value = records();
    q.pageIndex = 1;
    q.visibleRows;
    const creating = got.filter(g => g[0] >= 103);
    expect(creating.map(g => g[0]), "#1: the row being built").toEqual([103, 104, 105]);
    // The first row is placed with its batch: until then it reads nothing - never the record of the row being built.
    expect(creating.map(g => g[1]), "#2: " + JSON.stringify(got)).toEqual([103, undefined, undefined]);
    expect(got.every(g => g[2] === null || g[2] === undefined), "#3: the total row has no record").toBe(true);
  });
  // Spec Do 3: a built row of a source that pages itself always has a loaded record; anything else is reported.
  test("a server source: a built row whose record is outside the loaded window is reported, not read as null silently", async () => {
    const q = createMatrix();
    await load(q, "server");
    await goTo(q, 1);
    const error = vi.spyOn(ConsoleWarnings, "error").mockImplementation(() => { });
    q.visibleRows[0].getRecord();
    expect(error, "#1: a loaded record").not.toHaveBeenCalled();
    vi.spyOn((<any>q).dataList, "loadedCount", "get").mockReturnValue(0);
    q.visibleRows[0].getRecord();
    expect(error, "#2").toHaveBeenCalledTimes(1);
  });
  afterEach(() => { vi.restoreAllMocks(); });
});

describe("getRecord in the events about a dynamic panel", () => {
  test("onDynamicPanelValueChanged / onDynamicPanelValueChanging on page 2", () => {
    const q = createPanel();
    const got: Array<any> = [];
    surveyOf(q).onDynamicPanelValueChanging.add((_, options) => { got.push(["changing", options.getRecord()]); });
    surveyOf(q).onDynamicPanelValueChanged.add((_, options) => { got.push(["changed", options.getRecord()]); });
    q.value = records();
    q.pageIndex = 1;
    q.panels[1].getQuestionByName("a").value = "edited";
    expect(got).toEqual([["changing", records()[4]], ["changed", Object.assign(records()[4], { a: "edited" })]]);
  });
  test("onDynamicPanelCurrentIndexChanged and onGetDynamicPanelTabTitle on page 2", () => {
    const q = createPanel({ displayMode: "tab" });
    const changed: Array<any> = [];
    const titles: Array<any> = [];
    surveyOf(q).onDynamicPanelCurrentIndexChanged.add((_, options) => { changed.push(options.getRecord().id); });
    surveyOf(q).onGetDynamicPanelTabTitle.add((_, options) => { titles.push(options.getRecord().id); });
    q.value = records();
    q.pageIndex = 1;
    q.currentIndex = 4;
    expect(q.currentPanel.getQuestionByName("a").value, "#1").toBe("r4");
    expect(changed[changed.length - 1], "#2").toBe(104);
    titles.length = 0;
    q.panels.forEach((panel: PanelModel) => panel.locTitle.renderedHtml);
    (<any>q).tabbedMenu?.actions.forEach((action: any) => action.locTitle?.renderedHtml);
    expect(titles.every(id => id >= 103 && id <= 105), "#3: the tabs of page 2: " + titles).toBe(true);
  });
  test("onDynamicPanelRemoving / onDynamicPanelRemoved: the removed record", () => {
    const q = createPanel();
    const got: Array<any> = [];
    surveyOf(q).onDynamicPanelRemoving.add((_, options) => { got.push(["removing", options.getRecord()]); });
    surveyOf(q).onDynamicPanelRemoved.add((_, options) => { got.push(["removed", options.getRecord()]); });
    q.value = records();
    q.pageIndex = 1;
    q.removePanel(q.panels[1]);
    expect(got, "#1").toEqual([["removing", records()[4]], ["removed", records()[4]]]);
    expect(q.value.map((r: any) => r.id), "#2").toEqual([100, 101, 102, 103, 105, 106]);
  });
  test("onDynamicPanelAdded: the new record", () => {
    const q = createPanel({ pageSize: 0 });
    let record: any;
    surveyOf(q).onDynamicPanelAdded.add((_, options) => { record = options.getRecord(); });
    q.value = records();
    q.addPanel();
    expect(record).toEqual({});
  });
});

// CV05-2, pinned: the offset of the record number the respondent sees ({rowIndex}, {panelIndex}).
describe("getRecordNumberOffset: pinned", () => {
  test("local paging: 0 on every page - the record index is already the index of the whole list", async () => {
    const q = createMatrix();
    q.value = records();
    q.pageIndex = 1;
    expect(q.getRecordNumberOffset(), "#1").toBe(0);
    q.pageIndex = 2;
    expect(q.getRecordNumberOffset(), "#2").toBe(0);
  });
  test("a server source: the position of the loaded window", async () => {
    const q = createMatrix();
    await load(q, "server");
    await goTo(q, 1);
    expect(q.getRecordNumberOffset(), "#1").toBe(3);
    await goTo(q, 2);
    expect(q.getRecordNumberOffset(), "#2").toBe(6);
  });
});
