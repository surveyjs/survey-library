import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { DragDropMatrixRows } from "../../src/dragdrop/matrix-rows";
import { SurveyTestTargets } from "../../src/tester/test-targets";
import { ItemValue } from "../../src/itemvalue";
import { ChoicesRestful } from "../../src/choicesRestful";
import { flush, records, createPanel, createMatrix, PagedSource } from "./page-window-helpers";

/* With paging on, the panels and rows that exist are the current page, for an in-memory list as for
   a data source that pages itself. */

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
    { name: "a sort", json: { sortCriteria: [{ field: "a", direction: "desc" }] }, unpaged: { get: "r2", set: r(0, 1, "X", 3, 4, 5), question: "r2",
      move: r(0, 1, 5, 2, 3, 4), add: r(0, 1, "N", 2, 3, 4, 5), remove: r(0, 1, 3, 4, 5) } },
    { name: "a filter", json: { filterExpression: "{a} != 'r0'" }, unpaged: { get: "r4", set: r(0, 1, 2, 3, "X", 5), question: "r4",
      move: r(0, 2, 3, 4, 1, 5), add: r(0, 1, 2, 3, "N", 4, 5), remove: r(0, 1, 2, 3, 5) } },
    { name: "owner-hidden records", json: { rowsVisibleIf: "{row.a} != 'r1'" }, unpaged: { get: "r3", set: r(0, 1, 2, 3, "X", 5), question: "r4",
      move: r(1, 2, 3, 0, 4, 5), add: r(0, 1, 2, "N", 3, 4, 5), remove: r(0, 1, 2, 4, 5) } }
  ];
  setups.forEach((setup) => {
    test("matrix, " + setup.name + ": without paging every method keeps its kind, and on page 1 the same number names the same record", () => {
      expect(probeMatrix(setup.json, 3), "#1: without paging").toEqual(setup.unpaged);
      const paged = Object.assign({ pageSize: 2 }, setup.json);
      expect(probeMatrix(paged, 3, 1), "#2: page 1").toEqual(setup.unpaged);
      [0, 4].forEach((n: number): void => {
        const expected = Object.assign({}, probeMatrix(setup.json, n), { question: null });
        expect(probeMatrix(paged, n, 1), "#3: number " + n + " is on another page").toEqual(expected);
      });
    });
  });
  test("matrix: a record on another page is read and written by value, nothing is built, the page stays, nothing is reported", () => {
    const m = createNumberedMatrix({ pageSize: 2, rowsVisibleIf: "{row.a} != 'r1'" });
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
    const paged = createNumberedPanel(Object.assign({ pageSize: 2 }, hidden));
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
    const m = createNumberedMatrix({ pageSize: 2, rowsVisibleIf: "{row.a} != 'r1'" });
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
    expect(probe(Object.assign({ pageSize: 2 }, hidden), 3, 1), "#2: page 1").toEqual({ get: "v3", set: ["r4"], question: "v4" });
    expect(probe(Object.assign({ pageSize: 2 }, hidden), 0, 1), "#3: another page").toEqual({ get: "v0", set: ["r0"], question: null });
    expect(probe({ pageSize: 2 }, 3, 1), "#4: page 1, nothing hidden").toEqual({ get: "v3", set: ["r3"], question: "v3" });
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
    [{ pageSize: 2 }, { pageSize: 2, sortCriteria: [{ field: "a", direction: "desc" }] }, { pageSize: 2, filterExpression: "{a} != 'r2'" },
      { pageSize: 2, rowsVisibleIf: "{row.a} != 'r1' and {row.a} != 'r4'" }].forEach((json: any, i: number): void => {
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
    const m = createNumberedMatrix({ pageSize: 2 }, data);
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
    const f = createNumberedFixed({ pageSize: 2 }, fixedValue);
    f.pageIndex = 1;
    expect(f.getRowValue(3), "#6: fixed matrix, a row on the page").toEqual({ a: "v3", extra: "keep" });
    expect(f.getRowValue(0), "#7: fixed matrix, off the page").toEqual({ a: "v0", extra: "keep" });
    expect(f.getItemData(f.visibleRows[0]), "#8").toEqual({ a: "v2", extra: "keep" });
    f.getRowValue(0).extra = "changed";
    expect(f.value.r0.extra, "#9: unbound").toBe("keep");
  });
  test("an off-page setRowValue writes what assigning a row would: the column fields give way, the others stay", () => {
    const data = sixRecords((i: number) => ({ id: i, b: "b" + i }));
    const m = createNumberedMatrix({ pageSize: 2 }, data, [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]);
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
  [{ name: "page 1", page: 1, json: { pageSize: 3 } }, { name: "page 2 of three", page: 2, json: { pageSize: 3 } },
    { name: "page 1 with an owner-hidden record", page: 1, json: { pageSize: 3, rowsVisibleIf: "{row.a} != 'r4'" } }].forEach((setup) => {
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
    const survey = createCallerSurvey({ pageSize: 3 }, data, [{ name: "a", cellType: "text" }, { name: "c", cellType: "dropdown", choices: ["x", "y"] }]);
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.pageIndex = 1;
    m.columns[1].choices = ["x"];
    m.clearIncorrectValues();
    expect(m.value[4], "#1: the unknown key and the value the choices lost").toEqual({ a: "r4" });
    expect(m.value.filter((rec: any, i: number) => i !== 4).every((rec: any) => Object.keys(rec).length === 1), "#2: the others are as they were").toBe(true);
  });
  test("page 1: a key in the detail panel of rows that never opened it is compared by each row's own record", () => {
    const data = records(9, (i: number) => ({ a: "r" + i, u: "u" + i }));
    const survey = createCallerSurvey({ pageSize: 3, keyName: "u", detailPanelMode: "underRow",
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
    expect(move({ pageSize: 3 }, 1, 0, 3), "#1: r3 below r5").toEqual(["r0", "r1", "r2", "r4", "r5", "r3", "r6", "r7", "r8"]);
    expect(move({ pageSize: 3 }, 1, 2, 0), "#2: r5 above r3").toEqual(["r0", "r1", "r2", "r5", "r3", "r4", "r6", "r7", "r8"]);
    const hidden = { pageSize: 3, rowsVisibleIf: "{row.a} != 'r4'" };
    expect(move(hidden, 1, 0, 3), "#3: r3 below r6, r4 hidden").toEqual(["r0", "r1", "r2", "r4", "r5", "r6", "r3", "r7", "r8"]);
    expect(move(hidden, 1, 2, 1), "#4: r6 above r5").toEqual(["r0", "r1", "r2", "r3", "r4", "r6", "r5", "r7", "r8"]);
    expect(move({ pageSize: 3 }, 2, 2, 0), "#5: page 2, r8 above r6").toEqual(["r0", "r1", "r2", "r3", "r4", "r5", "r8", "r6", "r7"]);
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
    expect(transfer({ pageSize: 3 }, 1, 1, {}, 0, 2), "#1: from page 1 into an unpaged matrix")
      .toEqual({ from: without(4), to: ["t0", "t1", "r4", "t2", "t3", "t4", "t5"], page: 0 });
    expect(transfer({}, 0, 1, { pageSize: 2 }, 1, 0), "#2: into page 1, before the first row")
      .toEqual({ from: without(1), to: ["t0", "t1", "r1", "t2", "t3", "t4", "t5"], page: 1 });
    expect(transfer({}, 0, 1, { pageSize: 2 }, 1, 1), "#3: between the rows")
      .toEqual({ from: without(1), to: ["t0", "t1", "t2", "r1", "t3", "t4", "t5"], page: 1 });
    expect(transfer({}, 0, 1, { pageSize: 2 }, 1, 2), "#4: after the last row: its page is shown")
      .toEqual({ from: without(1), to: ["t0", "t1", "t2", "t3", "r1", "t4", "t5"], page: 2 });
    expect(transfer({ pageSize: 3 }, 2, 0, { pageSize: 2 }, 1, 1), "#5: page to page")
      .toEqual({ from: without(6), to: ["t0", "t1", "t2", "r6", "t3", "t4", "t5"], page: 1 });
  });
  // A matrix with a data source has no drag of its own, but a row dropped into it is a remove and an insert, not a move.
  test("a row dropped into a matrix with a data source is inserted into the source at the drop position", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", rowCount: 0, allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] },
      { type: "matrixdynamic", name: "m2", rowCount: 0, allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m1: nineRecords() };
    const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    let stored: Array<any> = records(6, (i: number) => ({ a: "t" + i }));
    m2.dataSource = new ArrayDynamicDataSource((): Array<any> => stored, (arr: Array<any>): void => { stored = arr; });
    m1.visibleRows;
    m2.visibleRows;
    expect(m1.isRowsDragAndDrop, "#1: the matrix without a source drags").toBe(true);
    expect(m2.isRowsDragAndDrop, "#2: the matrix with a source does not").toBe(false);
    drop(survey, m1, m1.visibleRows[1], m2, 2);
    expect(as(stored), "#3: the source").toEqual(["t0", "t1", "r1", "t2", "t3", "t4", "t5"]);
    expect(as(m2.value), "#4").toEqual(["t0", "t1", "r1", "t2", "t3", "t4", "t5"]);
    expect(as(m1.value), "#5").toEqual(["r0", "r2", "r3", "r4", "r5", "r6", "r7", "r8"]);
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
    expect(view({ pageSize: 3 }, 1), "#1: page 1").toEqual([3, 4, 5]);
    expect(view({ pageSize: 3 }, 2), "#2: page 2").toEqual([6, 7, 8]);
    expect(view({ pageSize: 3, rowsVisibleIf: "{row.a} != 'r1' and {row.a} != 'r4'" }, 1), "#3: hidden r1 and r4 are counted").toEqual([5, 6, 7]);
    expect(view({ rowsVisibleIf: "{row.a} != 'r1'" }, 0).slice(0, 3), "#4: without paging, the position in generatedVisibleRows").toEqual([0, 2, 3]);
    const other = createCallerSurvey({ pageSize: 3 });
    const m = <QuestionMatrixDynamicModel>other.getQuestionByName("m");
    const survey = createCallerSurvey({ pageSize: 3 });
    expect((<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).getRowViewIndex(m.visibleRows[0]), "#5: a row of another matrix").toBe(-1);
  });
  test("a tester target addresses the page collection", () => {
    const survey = createCallerSurvey({ pageSize: 3 }, undefined, undefined,
      [{ type: "paneldynamic", name: "p", pageSize: 3, templateElements: [{ type: "text", name: "a" }] }]);
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
      createMatrix({ pageSize: 5, defaultRowValue: { a: "new" }, columns: [{ name: "a", cellType: "text" }] }) :
      createPanel({ pageSize: 5, panelCount: 0, displayMode: "tab", defaultPanelValue: { a: "new" }, templateElements: [{ type: "text", name: "a" }] });
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
    const question = createMatrix({ pageSize: 5, defaultRowValue: { a: "new" }, columns: [{ name: "a", cellType: "text" }] });
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
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p", pageSize: 2,
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
      expect(removeCurrentAt({ displayMode: mode, pageSize: 3 }, 1, 6), "#2: middle").toEqual({ a: 2, index: 1, events: [1] });
    });
    test(mode + ": the only record: no current panel, no event", () => {
      expect(removeCurrentAt({ displayMode: mode }, 0, 1), "#1").toEqual({ a: undefined, index: -1, events: [] });
    });
    test(mode + ": under a sort and a filter", () => {
      const view = { displayMode: mode, sortCriteria: [{ field: "a", direction: "desc" }], filterExpression: "{a} != 1" };
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
    const { question, events } = createCurrent({ displayMode: "tab", sortCriteria: [{ field: "a" }] });
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
    expect((<any>question).dynamicAnimation.leftVisibleIndex, "#1").toBe(1);
    question.goToPrevPanel();
    expect((<any>question).dynamicAnimation.leftVisibleIndex, "#2").toBe(3);
  });
  ["carousel", "tab"].forEach((mode: string): void => {
    test(mode + " without paging: a move, Next and a removal raise one event each, as released", () => {
      const { question, events } = createCurrent({ displayMode: mode, pageSize: 0 });
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
  [{ name: "two per page", json: { pageSize: 2 } }, { name: "five per page", json: { pageSize: 5 } }].forEach((setup) => {
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
    const matrix = createAdding({ pageSize: 2 });
    const focused = addWithFocus(matrix);
    expect(matrix.pageIndex, "#1").toBe(1);
    const newRow = matrix.visibleRows[1];
    expect(newRow.isDetailPanelShowing, "#2").toBe(true);
    expect(focused.length === 1 && focused[0] === newRow.getQuestionByColumnName("a"), "#3").toBe(true);
  });
  test("two per page with a filter the new record does not pass: it is shown, opens and is focused", () => {
    const matrix = createAdding({ pageSize: 2, filterExpression: "{a} notempty" });
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
    { name: "dynamic matrix", element: (isPaged: boolean): any => ({ type: "matrixdynamic", name: "q", rowCount: 0, pageSize: isPaged ? 1 : 0,
      columns: [Object.assign({ name: "a" }, dropdown)] }), data: [{ a: 1 }, { a: 7 }], expected: [{ a: 1 }, {}] },
    { name: "dynamic panel", element: (isPaged: boolean): any => ({ type: "paneldynamic", name: "q", pageSize: isPaged ? 1 : 0,
      templateElements: [{ type: "dropdown", name: "a", choices: [1, 2] }] }), data: [{ a: 1 }, { a: 7 }], expected: [{ a: 1 }, {}] },
    { name: "fixed matrix", element: (isPaged: boolean): any => ({ type: "matrixdropdown", name: "q", pageSize: isPaged ? 1 : 0, rows: ["r1", "r2"],
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
      element.pageSize = isPaged ? 1 : 0;
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
    const run = (pageSize: number): any => {
      const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "q", pageSize: pageSize, rows: ["r1", "r2", "r3"],
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
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", pageSize: 1, templateElements: [{ type: "text", name: "k" },
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
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, pageSize: 1,
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
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", pageSize: 1, templateElements: [{ type: "text", name: "k" },
      { type: "matrixdynamic", name: "inner", rowCount: 0, columns: [{ name: "x", cellType: "dropdown", choices: ["a"] }] }] }] });
    const nested = [{ x: "a" }, { x: "zzz", unknown: 1 }];
    survey.data = { q: [{ k: 1 }, { k: 2, inner: nested }, { k: 3, inner: nested }] };
    (<QuestionPanelDynamicModel>survey.getQuestionByName("q")).panels;
    survey.clearIncorrectValues();
    expect(survey.data.q[1].inner, "#1").toEqual(nested);
    expect(survey.data.q[2].inner, "#2").toEqual(nested);
  });
  test("the clean-up downloads no file", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", pageSize: 1, templateElements: [{ type: "text", name: "k" },
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
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", pageSize: 1,
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
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", pageSize: 1,
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
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, sortCriteria: [{ field: "a", direction: "desc" }], columns: [{ name: "a", cellType: "text" }] }] });
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
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", sortCriteria: [{ field: "a", direction: "desc" }], templateElements: [{ type: "text", name: "a" }] }] });
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
      const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 1, columns: [
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
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 2, rowsVisibleIf: "{row.a} != 'hide'",
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
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", pageSize: 2, templateVisibleIf: "{panel.a} != 'hide'",
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

/* A panel built for a record the value already holds writes no static defaultValue into it, with a view
   as without one; defaultValueExpression is computed for a record when its panel is built. A record on
   a page never opened gets neither. A new record gets both. */
describe("Dynamic panel with a view: template default values of loaded and new records", () => {
  const template = [{ type: "text", name: "k" }, { type: "text", name: "t", defaultValue: "dt" },
    { type: "text", name: "x", defaultValueExpression: "'e' + {panelIndex}" }];
  const loaded = (): Array<any> => [{ k: 2 }, { k: 1 }, { k: 3 }];
  const run = (view: any, change?: (question: QuestionPanelDynamicModel) => void): Array<any> => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p", templateElements: template }, view)] });
    survey.data = { p: loaded() };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    question.panels;
    if (!!change) change(question);
    return survey.data.p;
  };
  const withoutX = (record: any): any => {
    const res = Object.assign({}, record);
    delete res.x;
    return res;
  };
  test("without a view: the expression is computed for every record, the static default is not written", () => {
    expect(run({})).toEqual([{ k: 2, x: "e0" }, { k: 1, x: "e1" }, { k: 3, x: "e2" }]);
  });
  test("paged: the records of the first page get the expression, a page never opened gets neither", () => {
    const plain = run({});
    expect(run({ pageSize: 2 })).toEqual([plain[0], plain[1], withoutX(plain[2])]);
  });
  test("paged: page 2 opened gives the records without a view", () => {
    expect(run({ pageSize: 2 }, (question: QuestionPanelDynamicModel): void => { question.pageIndex = 1; })).toEqual(run({}));
  });
  test("sorted: no record gets the static default, every record gets the expression", () => {
    const res = run({ sortCriteria: [{ field: "k" }] });
    expect(res.map((record: any): any => record.t), "#1").toEqual([undefined, undefined, undefined]);
    expect(res.map((record: any): boolean => !!record.x), "#2").toEqual([true, true, true]);
  });
  test("filtered: no record gets the static default, the shown records get the expression", () => {
    const res = run({ filterExpression: "{k} != 3" });
    expect(res.map((record: any): any => record.t), "#1").toEqual([undefined, undefined, undefined]);
    expect(res.map((record: any): boolean => !!record.x), "#2").toEqual([true, true, false]);
  });
  test("paged and sorted: no record gets the static default", () => {
    const res = run({ pageSize: 2, sortCriteria: [{ field: "k" }] }, (question: QuestionPanelDynamicModel): void => { question.pageIndex = 1; });
    expect(res.map((record: any): any => record.t)).toEqual([undefined, undefined, undefined]);
  });
  test("a new record gets both kinds of default, paged as without paging", () => {
    const addPanel = (question: QuestionPanelDynamicModel): void => { question.addPanel(); };
    const plain = run({}, addPanel);
    expect(plain[3], "#1").toEqual({ t: "dt", x: "e3" });
    expect(run({ pageSize: 2 }, addPanel)[3], "#2: paged").toEqual(plain[3]);
    expect(run({ sortCriteria: [{ field: "k" }] }, addPanel)[3].t, "#3: sorted").toBe("dt");
  });
  test("a new record from a raised panelCount gets both kinds of default, paged as without paging", () => {
    const raise = (question: QuestionPanelDynamicModel): void => { question.panelCount = 4; };
    const plain = run({}, raise);
    expect(plain[3], "#1").toEqual({ t: "dt", x: "e3" });
    const paged = run({ pageSize: 2 }, (question: QuestionPanelDynamicModel): void => {
      raise(question);
      question.pageIndex = 1;
    });
    expect(paged[3], "#2: paged").toEqual(plain[3]);
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
      json.pageSize = isPaged ? 1 : 0;
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
    const json = Object.assign(matrixJson("{row.a} = 1"), { sortCriteria: [{ field: "c" }] });
    json.columns.push({ name: "c", cellType: "text" });
    const data = [{ a: 1, b: "x", c: 3 }, { a: 1, b: "y", c: 1 }, { a: 1, b: "z", c: 2 }];
    const res = run("onHidden", json, data, {}, [(survey: SurveyModel, question: any) => { question.sort([{ field: "-c", direction: "asc" }]); }, hideRecord(2)]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[1][2], "#2").toEqual({ a: 2, c: 2 });
  });
  // The three types sorted by a column or template question c; record key: an index, or a row value of the Multi-Select Matrix.
  const sortedTypes = (): Array<[string, any, any, any]> => {
    const sorted = (json: any): any => {
      if (json.type === "paneldynamic") json.templateElements.push({ type: "text", name: "c" }); else json.columns.push({ name: "c", cellType: "text" });
      json.sortCriteria = [{ field: "c" }];
      return json;
    };
    const records = (): Array<any> => [{ a: 1, b: "x", c: 1 }, { a: 1, b: "x", c: 2 }, { a: 1, b: "x", c: 3 }];
    return [["dynamic matrix", sorted(matrixJson("{row.a} = 1")), records(), 0],
      ["multi-select matrix", sorted(fixedJson("{row.a} = 1")), { r1: records()[0], r2: records()[1], r3: records()[2] }, "r1"],
      ["dynamic panel", sorted(panelJson("{row.a} = 1")), records(), 0]];
  };
  const editRecord = (key: any, changes: any) => (survey: SurveyModel, question: any): void => {
    const value = JSON.parse(JSON.stringify(question.value));
    Object.assign(value[key], changes);
    survey.setValue("q", value);
  };
  test("under onHidden, an assignment that sorts a record off the page and hides its column clears it, as one that only hides it", () => {
    sortedTypes().forEach(([name, json, data, first]) => {
      const res = run("onHidden", json, data, {}, [editRecord(first, { a: 2, c: 9 })]);
      expect(res.paged, name + " #1").toEqual(res.unpaged);
      expect(res.paged[0][first], name + " #2: cleared").toEqual({ a: 2, c: 9 });
    });
  });
  test("under onHidden, a column shown on the page and then hidden by an assignment that sorts its record off the page is cleared", () => {
    sortedTypes().forEach(([name, json, data, first]) => {
      data[first].a = 2;
      const res = run("onHidden", json, data, {}, [editRecord(first, { a: 1 }), editRecord(first, { a: 2, c: 9 })]);
      expect(res.paged, name + " #1").toEqual(res.unpaged);
      expect(res.paged[0][first], name + " #2: shown, the answer hidden since load is kept").toEqual({ a: 1, b: "x", c: 1 });
      expect(res.paged[1][first], name + " #3: cleared").toEqual({ a: 2, c: 9 });
    });
  });
  test("under onHidden, an assignment that sorts a record onto the page and hides its column clears it", () => {
    sortedTypes().forEach(([name, json, data, first]) => {
      const last = first === "r1" ? "r3" : 2;
      const res = run("onHidden", json, data, {}, [editRecord(last, { a: 2, c: 0 })]);
      expect(res.paged, name + " #1").toEqual(res.unpaged);
      expect(res.paged[0][last], name + " #2: cleared").toEqual({ a: 2, c: 0 });
    });
  });
  test("under onHidden, a paged Dynamic Matrix keeps its rows when an assignment adds one record, and clears a column the assignment hides", () => {
    const addAndHide = (survey: SurveyModel, question: any): void => {
      const value = JSON.parse(JSON.stringify(question.value));
      value[0].a = 2;
      value.push({ a: 1 });
      survey.setValue("q", value);
    };
    const res = run("onHidden", matrixJson("{row.a} = 1"), records(), {}, [addAndHide]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual([{ a: 2 }, { a: 2, b: "x" }, { a: 3, b: "x" }, { a: 1 }]);
    const survey = new SurveyModel({ elements: [Object.assign(matrixJson("{row.a} = 1"), { pageSize: 1 })] });
    survey.data = { q: records() };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    const row = matrix.visibleRows[0];
    addAndHide(survey, matrix);
    expect(matrix.visibleRows[0] === row, "#3: the row on the page stays").toBe(true);
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
      Object.assign(matrixJson("{hasB} = 'yes'"), { pageSize: 1 }), { type: "expression", name: "count", expression: "countInArray({q}, 'b')" }] });
    survey.data = { hasB: "yes", q: records() };
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
    expect(survey.getValue("count"), "#1").toBe(3);
    survey.setValue("hasB", "no");
    expect(survey.getValue("count"), "#2").toBe(0);
  });
  // At completion each template question decides with its own clearIfInvisible, whatever the survey's setting.
  const choiceTemplate = (clearIfInvisible?: string): any => ({ type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "a" },
    Object.assign({ type: "dropdown", name: "c", choices: [1, 2] }, !!clearIfInvisible ? { clearIfInvisible: clearIfInvisible } : {})] });
  const choiceRecords = (): Array<any> => [{ a: 1, c: 7 }, { a: 2, c: 9 }, { a: 3, c: 1 }];
  test("survey none: a template question with clearIfInvisible onComplete clears an invalid choice of another page's record at complete", () => {
    const res = run("none", choiceTemplate("onComplete"), choiceRecords(), {}, ["complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual([{ a: 1 }, { a: 2 }, { a: 3, c: 1 }]);
  });
  test("survey none: a template question with the default clearIfInvisible keeps every answer at complete", () => {
    const res = run("none", choiceTemplate(), choiceRecords(), {}, ["complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual(choiceRecords());
  });
  test("survey onHidden: a template question with clearIfInvisible onComplete clears an invalid choice of another page's record at complete", () => {
    const res = run("onHidden", choiceTemplate("onComplete"), choiceRecords(), {}, ["complete"]);
    expect(res.paged, "#1").toEqual(res.unpaged);
    expect(res.paged[0], "#2").toEqual([{ a: 1 }, { a: 2 }, { a: 3, c: 1 }]);
  });
});

describe("quiet validation of other pages' records", () => {
  const createFixed = (): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "q", pageSize: 2, rows: ["r1", "r2", "r3", "r4", "r5"],
      columns: [{ name: "a", cellType: "text", isRequired: true }] }] });
    survey.data = { q: { r1: { a: 1 }, r2: { a: 2 }, r3: { a: 3 }, r5: { a: 5 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
    matrix.visibleRows;
    return { survey: survey, matrix: matrix };
  };
  test("validate(false) reports the errors of other pages' records that validate(true) reports", () => {
    const { survey, matrix } = createFixed();
    expect(survey.validate(false), "#1: quiet").toBe(false);
    expect(matrix.pageIndex, "#2: the page stays").toBe(0);
    expect(matrix.visibleRows.every(row => row.cells[0].question.errors.length === 0), "#3: no error is shown").toBe(true);
    expect(survey.validate(true), "#4: full").toBe(false);
    expect(matrix.pageIndex, "#5: the full validation shows the page with the error").toBe(1);
  });
  test("isCurrentPageHasErrors validates as a full validation does: it shows the page with the error", () => {
    const { survey, matrix } = createFixed();
    expect(survey.isCurrentPageHasErrors, "#1").toBe(true);
    expect(matrix.pageIndex, "#2").toBe(1);
  });
  test("validate(false) of a records question whose other pages are valid passes", () => {
    const { survey, matrix } = createFixed();
    survey.setValue("q", { r1: { a: 1 }, r2: { a: 2 }, r3: { a: 3 }, r4: { a: 4 }, r5: { a: 5 } });
    expect(survey.validate(false), "#1").toBe(true);
    expect(matrix.pageIndex, "#2").toBe(0);
  });
  test("a paged required matrix counts its rows for minRowCount as without paging", () => {
    const run = (pageSize: number): boolean => {
      const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, pageSize: pageSize, isRequired: true,
        minRowCount: 3, rowsVisibleIf: "{row.a} != 2", columns: [{ name: "a", cellType: "text" }] }] });
      survey.data = { q: [{ a: 1 }, { a: 2 }, { a: 3 }] };
      (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
      return survey.validate(false);
    };
    expect(run(1), "#1").toBe(run(0));
    expect(run(1), "#2").toBe(true);
  });
});

describe("one record added under in-memory paging", () => {
  test("the value events of the new record equal those of the unpaged add, for both types", () => {
    const run = (type: string, pageSize: number): Array<any> => {
      const json = type === "matrix" ?
        { type: "matrixdynamic", name: "q", rowCount: 0, pageSize: pageSize, columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", defaultValue: 7 }] } :
        { type: "paneldynamic", name: "q", pageSize: pageSize, templateElements: [{ type: "text", name: "a" }, { type: "text", name: "b", defaultValue: 7 }] };
      const survey = new SurveyModel({ elements: [json] });
      survey.data = { q: [{ a: 1, b: 1 }, { a: 2, b: 2 }, { a: 3, b: 3 }] };
      const question: any = survey.getQuestionByName("q");
      if (type === "matrix") question.visibleRows; else question.panels;
      const events = new Array<any>();
      survey.onValueChanged.add((_, options) => { events.push(options.value[3]); });
      if (type === "matrix") question.addRow(); else question.addPanel();
      return events;
    };
    ["matrix", "panel"].forEach(type => {
      expect(run(type, 2), type + " #1").toEqual(run(type, 0));
      expect(run(type, 2), type + " #2").toEqual([{ b: 7 }]);
    });
  });
});

/* The nested matrices hold no answer: a template change rebuilds the panels without their questions'
   values, as released, so only an unanswered matrix keeps its row count across it. */
describe("a rebuild of the panels keeps the page of a nested paged matrix", () => {
  const innerJson = { type: "matrixdynamic", name: "inner", rowCount: 3, pageSize: 1, columns: [{ name: "c", cellType: "text" }] };
  const createPanel = (): { survey: SurveyModel, question: QuestionPanelDynamicModel } => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 2, templateElements: [innerJson] }] });
    return { survey: survey, question: <QuestionPanelDynamicModel>survey.getQuestionByName("p") };
  };
  const inner = (question: QuestionPanelDynamicModel, index: number): QuestionMatrixDynamicModel =>
    <QuestionMatrixDynamicModel>question.panels[index].getQuestionByName("inner");
  test("a template change rebuilds the panels, and each nested matrix stays on its page", () => {
    const { question } = createPanel();
    inner(question, 0).visibleRows;
    inner(question, 0).pageIndex = 2;
    expect(inner(question, 0).pageIndex, "#1").toBe(2);
    const panelBefore = question.panels[0];
    question.template.addNewQuestion("text", "q2");
    expect(question.panels[0] !== panelBefore, "#2: the panels were rebuilt").toBe(true);
    expect(inner(question, 0).pageIndex, "#3: the page is kept").toBe(2);
    expect(inner(question, 1).pageIndex, "#4").toBe(0);
  });
  test("a nested matrix in a matrix detail panel keeps its page when the rows are rebuilt, as the panel does", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a" }],
      detailPanelMode: "underRow", detailElements: [innerJson] }] });
    survey.data = { m: [{ inner: [{ c: "1" }, { c: "2" }, { c: "3" }] }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows[0].showDetailPanel();
    const nested = (): QuestionMatrixDynamicModel => <QuestionMatrixDynamicModel>matrix.visibleRows[0].detailPanel.getQuestionByName("inner");
    nested().visibleRows;
    nested().pageIndex = 2;
    matrix.addColumn("b");
    matrix.visibleRows[0].showDetailPanel();
    expect(nested().pageIndex, "#1").toBe(2);
  });
  test("a panel whose record left before the rebuild gets nothing back", () => {
    const { question } = createPanel();
    inner(question, 1).visibleRows;
    inner(question, 1).pageIndex = 2;
    question.removePanel(1);
    question.addPanel();
    question.template.addNewQuestion("text", "q2");
    expect(inner(question, 1).pageIndex, "#1: the new record's matrix starts on its first page").toBe(0);
  });
});

describe("plain-data row names follow the record under paging", () => {
  const names = (pageSize: number): Array<string> => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3, pageSize: pageSize,
      columns: [{ name: "a", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.removeRow(0);
    matrix.addRow();
    return matrix.getPlainData().data.map((entry: any): string => entry.name);
  };
  test("without paging a row is named by its creation, under paging by its record", () => {
    expect(names(0), "#1: unpaged").toEqual(["row2", "row3", "row4"]);
    expect(names(10), "#2: paged, the rows are rebuilt on every page move").toEqual(["row1", "row2", "row3"]);
  });
});

describe("a paged row's shortcut text numbers the whole view, as unpaged", () => {
  const texts = (json: any, pageIndex: number, from: number): Array<Array<string>> => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 4, columns: [{ name: "a" }] }, json)] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    if (pageIndex > 0) matrix.pageIndex = pageIndex;
    return matrix.visibleRows.slice(from).map((row: any): Array<string> => [row.text, row.getAccessbilityText(), row.shortcutText]);
  };
  test("page 2 of 2 rows a page equals rows 3 and 4 without paging", () => {
    const unpaged = texts({}, 0, 2);
    expect(unpaged, "#1").toEqual([["row 3", "3", "3"], ["row 4", "4", "4"]]);
    expect(texts({ pageSize: 2 }, 1, 0), "#2").toEqual(unpaged);
  });
  test("without paging a hidden row is skipped by every number", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3, rowsVisibleIf: "{rowIndex} > 1", columns: [{ name: "a" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.map((row: any): Array<string> => [row.text, row.getAccessbilityText(), row.shortcutText]), "#1").toEqual([["row 1", "1", "1"], ["row 2", "2", "2"]]);
  });
});
