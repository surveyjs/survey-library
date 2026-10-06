import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { FunctionFactory } from "../src/functionsfactory";
import { settings } from "../src/settings";
import { CustomError } from "../src/error";
import { ArrayDynamicDataSource } from "../src/dynamic-data/dynamic-data-sources";

/* The record list and its helpers are created on demand. A matrix whose rows are fixed creates its
   list on the first cell edit, when the list is asked for and when it pages, sorts or filters - and on no other
   path; the dynamic questions create the list at the points that need it. Every records question
   coordinates its value assignments and its disposal with the list. */

function hasNoRecordList(q: any): boolean {
  return q._dataList === undefined && q._paging === undefined && q._pageValidation === undefined;
}

describe("Records question: fixed matrix", () => {
  test("fixed matrix: the first cell edit creates the record list, nothing before it does", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "none",
      elements: [{
        type: "matrixdropdown", name: "q",
        columns: [{ name: "a", cellType: "text", isRequired: true }, { name: "b", cellType: "text", isUnique: true }],
        rows: ["r1", "r2", "r3"],
        rowsVisibleIf: "{item} != 'r3' or {showAll} = true",
        defaultValue: { r1: { a: "1" } }
      }]
    });
    const q = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
    expect(hasNoRecordList(q), "#1: after the load").toBe(true);
    expect(q.value, "#1: the default value").toEqual({ r1: { a: "1" } });

    survey.setValue("q", { r1: { a: "1" }, r3: { a: "3" } });
    expect(hasNoRecordList(q), "#2: survey.setValue").toBe(true);
    expect(q.value, "#2: a keyed answer").toEqual({ r1: { a: "1" }, r3: { a: "3" } });

    q.visibleRows[1].cells[0].question.value = "2";
    expect(!!(<any>q)._dataList, "#3: a cell edit writes through the record list it creates").toBe(true);
    expect((<any>q)._pageValidation, "#3: no page validation without paging").toBeUndefined();
    expect(q.value, "#3: the edited row joins the keyed answer").toEqual({ r1: { a: "1" }, r2: { a: "2" }, r3: { a: "3" } });

    survey.setValue("showAll", true);
    expect(q.visibleRows.length, "#4: the third row is visible").toBe(3);
    survey.setValue("showAll", false);
    expect(q.visibleRows.length, "#4: the third row is hidden again").toBe(2);

    survey.validate();
    expect((<any>q)._pageValidation, "#5: validate").toBeUndefined();

    survey.clearInvisibleValues = "onComplete";
    survey.doComplete();
    expect((<any>q)._pageValidation, "#6: complete").toBeUndefined();
    expect(q.value, "#6: the hidden row's answer is cleared, nothing is padded").toEqual({ r1: { a: "1" }, r2: { a: "2" } });
    expect(Array.isArray(q.value), "#6: never an array").toBe(false);

    q.dispose();
    expect((<any>q)._pageValidation, "#7: dispose").toBeUndefined();
  });
  // The base generates no rows of its own (generateRows returns null; visibleRows and validate()
  // throw on it), so it is driven through its value only.
  test("the concrete matrix base creates no record list", () => {
    const q = new QuestionMatrixDropdownModelBase("q");
    q.addColumn("a");
    q.rows = ["r1", "r2"];
    q.value = { r1: { a: 1 } };
    expect(hasNoRecordList(q), "#1: value").toBe(true);
    q.value = { r1: { a: 1 }, r2: { a: 2 } };
    expect(q.value, "#2: a keyed answer").toEqual({ r1: { a: 1 }, r2: { a: 2 } });
    expect(hasNoRecordList(q), "#2").toBe(true);
    q.dispose();
    expect(hasNoRecordList(q), "#3: dispose").toBe(true);
  });
  test("the concrete matrix base has an empty record list whose membership is fixed", () => {
    const q = new QuestionMatrixDropdownModelBase("q");
    q.addColumn("a");
    q.rows = ["r1", "r2"];
    const list = q["dataList"];
    expect(list.loadedCount, "#1: no records").toBe(0);
    expect(list.add({ a: 1 }), "#2: add is refused").toBe(-1);
    expect(list.loadedCount, "#3: still none").toBe(0);
    expect(q.value, "#4: nothing is written").toBeUndefined();
    q.dispose();
  });
  test("fixed matrix: building, reading, assigning, validating and completing create no record list", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown", name: "q", isRequired: true,
        columns: [{ name: "a", cellType: "text", isRequired: true, totalType: "count" }, { name: "b", cellType: "text", isUnique: true }],
        rows: ["r1", "r2", "r3"], detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }]
      }]
    });
    const q = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
    expect(hasNoRecordList(q), "#1: the load").toBe(true);
    expect(q.visibleRows.length, "#2: the rows").toBe(3);
    expect(q.renderedTable.rows.length > 0, "#2: the rendered table").toBe(true);
    expect(hasNoRecordList(q), "#2").toBe(true);
    survey.setValue("q", { r1: { a: "1", b: "x" }, r2: { a: "2", b: "y" }, r3: { a: "3", b: "z" } });
    expect(hasNoRecordList(q), "#3: survey.setValue").toBe(true);
    q.getFilteredData();
    q.getDisplayValue(true);
    q.getPlainData();
    q.getProgressInfo();
    expect(hasNoRecordList(q), "#4: the value-level reads").toBe(true);
    expect(survey.validate(), "#5: validate").toBe(true);
    expect(hasNoRecordList(q), "#5").toBe(true);
    survey.doComplete();
    expect(hasNoRecordList(q), "#6: complete").toBe(true);
  });
  test("fixed matrix: the paging seams answer as a matrix without a list", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown", name: "q",
        columns: [{ name: "a", cellType: "text", isRequired: true }, { name: "b", cellType: "text" }],
        rows: ["r1", "r2", "r3", "r4"],
        rowsVisibleIf: "{item} != 'r2'",
        defaultValue: { r1: { a: "1", b: "2" }, r3: { a: "3" } }
      }]
    });
    const q = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
    const rows = q.visibleRows;
    expect(rows.length, "#1: the second row is hidden").toBe(3);
    // Compared by identity: a failing toBe on rows makes vitest serialize them.
    expect(q.rowsOnPage === rows, "#2: the page is visibleRows itself").toBe(true);
    expect(rows.map(row => row.visibleIndex), "#3: visible indexes start at 0").toEqual([0, 1, 2]);
    expect(q.getRecordNumberOffset(), "#4: no window offset").toBe(0);
    expect(q.getProgressInfo(), "#5: three visible rows of two cells").toEqual({ questionCount: 6, answeredQuestionCount: 3, requiredQuestionCount: 3, requiredAnsweredQuestionCount: 2 });
    expect(hasNoRecordList(q), "#6").toBe(true);
  });
  test("fixed matrix: a matrix without paging answers page 0 of 1 and creates no record list", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "q", rows: ["r1", "r2", "r3"], columns: [{ name: "a", cellType: "text" }] }]
    });
    const q = <QuestionMatrixDropdownModel>survey.getQuestionByName("q");
    expect(q.visibleRows.length, "#1: every row").toBe(3);
    expect(q.pageIndex, "#2: page 0").toBe(0);
    expect(q.pageCount, "#3: of 1").toBe(1);
    expect(q.pageSize, "#4: no paging").toBe(0);
    expect(q.canGoNextPage, "#5: nothing to move to").toBe(false);
    expect(q.nextPage(), "#6: the move does not happen").toBe(false);
    expect(q.pageIndex, "#7: still page 0").toBe(0);
    expect(q.sortBy, "#8: no sort").toBe("");
    expect(q.filterExpression, "#9: no filter").toBe("");
    expect((<any>q).dataListValue, "#10: no record list").toBeUndefined();
  });
  /* The panel keeps the page states of the questions nested in its records while it rebuilds its
     panels (the matrix that pages: page-window.test.ts). The fixed matrix next to it is walked as
     well and has none. */
  test("nested page state: a fixed matrix in a rebuilt dynamic panel has none and creates no list", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", panelsPerPage: 1,
        templateElements: [{ type: "text", name: "id" }, {
          type: "matrixdynamic", name: "paged", rowCount: 0, rowsPerPage: 1,
          columns: [{ name: "a", cellType: "text" }]
        }, {
          type: "matrixdropdown", name: "fixed", rows: ["r1", "r2"],
          columns: [{ name: "a", cellType: "text" }]
        }]
      }]
    });
    survey.data = { outer: [{ id: 0, paged: [{ a: "0" }, { a: "1" }, { a: "2" }] }, { id: 1 }] };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const questionOf = (name: string): any => outer.panels[0].getQuestionByName(name);
    const getPageState = (q: any): any => q.getPageState();
    const paged = <QuestionMatrixDynamicModel>questionOf("paged");
    const fixed = <QuestionMatrixDropdownModel>questionOf("fixed");
    paged.pageIndex = 1;
    paged.visibleRows[0].cells[0].question.value = "x";
    paged.pageIndex = 0;
    expect(getPageState(paged).edited, "#1: the paged matrix keeps an edited record off its page").toEqual([1]);
    expect(getPageState(fixed), "#2: the fixed matrix has no page state").toBeUndefined();
    expect(hasNoRecordList(fixed), "#3").toBe(true);

    outer.sortOrder = [{ field: "id", direction: "desc" }];
    outer.sortOrder = [{ field: "id", direction: "asc" }];
    const newFixed = <QuestionMatrixDropdownModel>questionOf("fixed");
    expect(newFixed === fixed, "#4: the panel was rebuilt").toBe(false);
    expect(questionOf("id").value, "#5: for the same record").toBe(0);
    expect(getPageState(newFixed), "#6: the new fixed matrix has no page state").toBeUndefined();
    expect(hasNoRecordList(newFixed), "#7: and no list").toBe(true);
    expect(newFixed.value, "#8: its answer is untouched").toBeUndefined();
  });
});

describe("Records question: lazy list allocation", () => {
  test("a value assigned before the question joins a survey creates the list for a dynamic panel only", () => {
    const panel = new QuestionPanelDynamicModel("p");
    panel.template.addNewQuestion("text", "a");
    panel.value = [{ a: 1 }, { a: 2 }];
    // setPanelCountBasedOnValue reads the record count through the list.
    expect((<any>panel).dataListValue, "#1: the dynamic panel has created its list").toBeDefined();

    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("a");
    matrix.value = [{ a: 1 }, { a: 2 }];
    expect((<any>matrix).dataListValue, "#2: the dynamic matrix has not").toBeUndefined();
  });
});

describe("Records question: value assignment", () => {
  function createPagedMatrix(): QuestionMatrixDynamicModel {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    expect(q.visibleRows.length, "the page is built").toBe(2);
    expect((<any>q).dataListValue, "the list exists").toBeDefined();
    return q;
  }
  test("matrix: one list-side pair per assignment, and the rows whose record changed get it after the pair", () => {
    const q = createPagedMatrix();
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    const rowUpdates = q.visibleRows.map(row => vi.spyOn(row, "updateFromRecord"));
    q.value = [{ a: "1" }, { a: "x" }, { a: "3" }];
    expect(begin, "#1").toHaveBeenCalledTimes(1);
    expect(end, "#2").toHaveBeenCalledTimes(1);
    expect(rowUpdates.map(spy => spy.mock.calls.length), "#3: only the row whose record changed").toEqual([0, 1]);
    expect(end.mock.invocationCallOrder[0] < rowUpdates[1].mock.invocationCallOrder[0], "#4: after the pair").toBe(true);
    expect(q.visibleRows[1].getQuestionByName("a").value, "#5").toBe("x");
  });
  test("panel: one list-side pair per assignment, and the panel count follows after it", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }]
    });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    q.value = [{ a: "1" }];
    expect((<any>q).dataListValue, "the list exists").toBeDefined();
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    const setCount = vi.spyOn(<any>q, "setPanelCountBasedOnValue");
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    expect(begin, "#1").toHaveBeenCalledTimes(1);
    expect(end, "#2").toHaveBeenCalledTimes(1);
    expect(setCount, "#3").toHaveBeenCalledTimes(1);
    const order = [begin.mock.invocationCallOrder[0], end.mock.invocationCallOrder[0], setCount.mock.invocationCallOrder[0]];
    expect(order, "#4: begin, end, then the panel count").toEqual(order.slice().sort((x, y) => x - y));
    expect(q.panelCount, "#5").toBe(3);
  });
  test("an assignment made from inside another one runs a complete pair of its own", () => {
    const q = createPagedMatrix();
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    let isReassigned = false;
    q.valueChangedCallback = (): void => {
      if (isReassigned) return;
      isReassigned = true;
      q.value = [{ a: "x" }, { a: "y" }, { a: "z" }];
    };
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    expect(begin, "#1: two begins").toHaveBeenCalledTimes(2);
    expect(end, "#2: two ends").toHaveBeenCalledTimes(2);
    const outerBegin = begin.mock.invocationCallOrder[0];
    const innerBegin = begin.mock.invocationCallOrder[1];
    const innerEnd = end.mock.invocationCallOrder[0];
    const outerEnd = end.mock.invocationCallOrder[1];
    expect(outerBegin < innerBegin && innerBegin < innerEnd && innerEnd < outerEnd, "#3: the outer pair closes last").toBe(true);
    expect(q.value, "#4").toEqual([{ a: "x" }, { a: "y" }, { a: "z" }]);
  });
});

describe("Records question: dispose", () => {
  test("matrix: the list is disposed after the rows", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    expect(q.visibleRows.length, "the rows are built").toBe(2);
    const list = (<any>q).dataListValue;
    expect(list, "the list exists").toBeDefined();
    const listDispose = vi.spyOn(list, "dispose");
    const clearRows = vi.spyOn(<any>q, "clearGeneratedRows");
    q.dispose();
    expect(clearRows, "#1").toHaveBeenCalled();
    expect(listDispose, "#2").toHaveBeenCalledTimes(1);
    const lastClear = clearRows.mock.invocationCallOrder[clearRows.mock.invocationCallOrder.length - 1];
    expect(lastClear < listDispose.mock.invocationCallOrder[0], "#3: the rows go first").toBe(true);
  });
  test("panel: the list is disposed before the template", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }]
    });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    const list = (<any>q).dataListValue;
    expect(list, "the list exists").toBeDefined();
    const listDispose = vi.spyOn(list, "dispose");
    const templateDispose = vi.spyOn(q.template, "dispose");
    q.dispose();
    expect(listDispose, "#1").toHaveBeenCalledTimes(1);
    expect(templateDispose, "#2").toHaveBeenCalledTimes(1);
    expect(listDispose.mock.invocationCallOrder[0] < templateDispose.mock.invocationCallOrder[0], "#3").toBe(true);
  });
});

describe("Records questions: one API across the three types", () => {
  interface IKind {
    type: string;
    pageSizeName: string;
    json: any;
    data: any;
    // The record the filter below hides, read from the value.
    hiddenRecord(value: any): any;
    shown(q: any): Array<any>;
  }
  const kinds: Array<IKind> = [
    {
      type: "matrixdropdown", pageSizeName: "rowsPerPage",
      json: { rows: ["r1", "r2", "r3"], columns: [{ name: "a", cellType: "text" }] },
      data: { r1: { a: "1" }, r2: { a: "2" }, r3: { a: "3" } },
      hiddenRecord: (value: any): any => value.r2,
      shown: (q: any): Array<any> => q.visibleRows.map((row: any) => row.getQuestionByName("a").value)
    },
    {
      type: "matrixdynamic", pageSizeName: "rowsPerPage",
      json: { rowCount: 3, columns: [{ name: "a", cellType: "text" }] },
      data: [{ a: "1" }, { a: "2" }, { a: "3" }],
      hiddenRecord: (value: any): any => value[1],
      shown: (q: any): Array<any> => q.visibleRows.map((row: any) => row.getQuestionByName("a").value)
    },
    {
      type: "paneldynamic", pageSizeName: "panelsPerPage",
      json: { templateElements: [{ type: "text", name: "a" }] },
      data: [{ a: "1" }, { a: "2" }, { a: "3" }],
      hiddenRecord: (value: any): any => value[1],
      shown: (q: any): Array<any> => q.panels.map((panel: any) => panel.getQuestionByName("a").value)
    }
  ];
  const create = (kind: IKind, extra?: any): any => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: kind.type, name: "q" }, kind.json, extra)] });
    survey.data = { q: kind.data };
    return survey.getQuestionByName("q");
  };
  kinds.forEach(kind => {
    test("paging, sorting, filtering and the record list, " + kind.type, () => {
      const q = create(kind, { [kind.pageSizeName]: 2 });
      expect([q[kind.pageSizeName], q.pageSize], "#1: the type-specific name and pageSize agree").toEqual([2, 2]);
      q.pageSize = 1;
      expect(q[kind.pageSizeName], "#1: set through pageSize").toBe(1);
      expect(q["dataList"].loadedCount, "#2: the record list").toBe(3);
      expect(q.pageCount, "#3").toBe(3);
      q.pageIndex = 1;
      expect([q.pageIndex, kind.shown(q)], "#4: the page moves").toEqual([1, ["2"]]);
      const sorted = create(kind, { sortBy: "a-" });
      expect(sorted.toJSON().sortBy, "#5: sortBy round-trips through JSON").toBe("a-");
      expect(kind.shown(sorted), "#5: applied").toEqual(["3", "2", "1"]);
      const filtered = create(kind, { filterExpression: "{a} != '2'" });
      expect(kind.shown(filtered), "#6: the filter hides a record").toEqual(["1", "3"]);
      expect(kind.hiddenRecord(filtered.value), "#6: the value keeps it").toEqual({ a: "2" });
    });
  });
  test("the single-select matrix has none of these members, and its answer, rows and JSON are its own", () => {
    const json = { type: "matrix", name: "m", columns: ["c1", "c2"], rows: ["r1", "r2"] };
    const survey = new SurveyModel({ elements: [json] });
    survey.data = { m: { r1: "c2" } };
    const m: any = survey.getQuestionByName("m");
    ["pageSize", "rowsPerPage", "sortBy", "filterExpression", "getDataList", "pagerActions", "pageIndex"].forEach(name => {
      expect(name in m, "#1: " + name).toBe(false);
    });
    expect(m.value, "#2: the answer").toEqual({ r1: "c2" });
    expect(m.visibleRows.map((row: any) => row.name), "#3: the rows").toEqual(["r1", "r2"]);
    expect(m.toJSON(), "#4: the JSON").toEqual({ name: "m", columns: ["c1", "c2"], rows: ["r1", "r2"] });
  });
});

describe("Records questions: value-change notifications", () => {
  const ownerJsons: Array<any> = [
    { type: "matrixdynamic", rowCount: 1, columns: [{ name: "a", cellType: "text" }] },
    { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "a", cellType: "text" }] },
    { type: "paneldynamic", panelCount: 1, templateElements: [{ type: "text", name: "a" }] }
  ];
  ownerJsons.forEach(json => {
    // A matrix has never checked its own validators again on another question's change; the panel has.
    const isCheckedAgain = json.type === "paneldynamic";
    const name = isCheckedAgain ? "the question's own validator that reads another question is checked again when that question changes, "
      : "a matrix's own validator that reads another question is not checked again when that question changes, ";
    test(name + json.type, () => {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "t" },
          Object.assign({ name: "q", validators: [{ type: "expression", expression: "{t} = 1" }] }, json)
        ]
      });
      const q = survey.getQuestionByName("q");
      expect(q.validate(true), "#1: t is empty").toBe(false);
      expect(q.errors.length, "#1: the error is shown").toBe(1);
      survey.setValue("t", 1);
      if (isCheckedAgain) {
        expect(q.errors.length, "#2: t = 1 clears it").toBe(0);
        return;
      }
      expect(q.errors.length, "#2: the error stays until the matrix is validated").toBe(1);
      expect(q.validate(true), "#3").toBe(true);
      expect(q.errors.length, "#3: validated, it is gone").toBe(0);
    });
  });
  test("dynamic panel: a write in a panel re-checks the {panel.x} validator of that panel only", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "q", panelCount: 2,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2", validators: [{ type: "expression", expression: "{panel.q1} + {panel.q2} <= 10" }] }
        ]
      }]
    });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    const first = q.panels[0];
    const second = q.panels[1];
    first.getQuestionByName("q1").value = 5;
    first.getQuestionByName("q2").value = 8;
    const firstQ2 = first.getQuestionByName("q2");
    expect(firstQ2.validate(true), "#1").toBe(false);
    const spy = vi.spyOn(firstQ2, "onAnyValueChanged");
    second.getQuestionByName("q1").value = 1;
    expect(spy.mock.calls.filter(call => call[0] === "panel").length, "#2: another panel's write does not reach it").toBe(0);
    expect(firstQ2.errors.length, "#2: the error stays").toBe(1);
    first.getQuestionByName("q1").value = 1;
    expect(spy.mock.calls.filter(call => call[0] === "panel").length, "#3: its own panel's write does, once").toBe(1);
    expect(firstQ2.errors.length, "#3: 1 + 8 <= 10").toBe(0);
  });
  [
    { type: "matrixdynamic", rowCount: 2 },
    { type: "matrixdropdown", rows: ["r1", "r2"] }
  ].forEach(json => {
    test("a write in a row re-checks the {row.x} validators of that row only, detail panel included, " + json.type, () => {
      const survey = new SurveyModel({
        elements: [Object.assign({
          name: "q", detailPanelMode: "underRow",
          columns: [
            { name: "a", cellType: "text" },
            { name: "b", cellType: "text", validators: [{ type: "expression", expression: "{row.a} + {row.b} <= 10" }] }
          ],
          detailElements: [
            { type: "text", name: "d", validators: [{ type: "expression", expression: "{row.a} + {row.d} <= 10" }] }
          ]
        }, json)]
      });
      const q = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q");
      const first = q.visibleRows[0];
      const second = q.visibleRows[1];
      first.showDetailPanel();
      first.getQuestionByName("a").value = 5;
      first.getQuestionByName("b").value = 8;
      first.getQuestionByName("d").value = 9;
      const b = first.getQuestionByName("b");
      const d = first.getQuestionByName("d");
      expect(b.validate(true), "#1: b").toBe(false);
      expect(d.validate(true), "#1: d").toBe(false);
      const spy = vi.spyOn(d, "onAnyValueChanged");
      second.getQuestionByName("a").value = 1;
      expect(spy.mock.calls.filter(call => call[0] === "row").length, "#2: another row's write does not reach it").toBe(0);
      expect([b.errors.length, d.errors.length], "#2: the errors stay").toEqual([1, 1]);
      first.getQuestionByName("a").value = 1;
      expect(spy.mock.calls.filter(call => call[0] === "row").length, "#3: its own row's write does, once").toBe(1);
      expect([b.errors.length, d.errors.length], "#3: both are valid now").toEqual([0, 0]);
    });
  });
  [
    { type: "matrixdynamic", rowCount: 0, columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", setValueIf: "{row.a} = 1", setValueExpression: "'set'" }] },
    { type: "paneldynamic", templateElements: [{ type: "text", name: "a" }, { type: "text", name: "b", setValueIf: "{panel.a} = 1", setValueExpression: "'set'" }] }
  ].forEach(json => {
    test("a value assigned before the objects are built runs their triggers on the first build, " + json.type, () => {
      // On the second page: nothing renders the question before the value is assigned.
      const survey = new SurveyModel({ pages: [{ elements: [{ type: "text", name: "t" }] }, { elements: [Object.assign({ name: "q" }, json)] }] });
      const q: any = survey.getQuestionByName("q");
      expect(!!q.areObjectsBuilt(), "#1: nothing is built yet").toBe(false);
      survey.setValue("q", [{ a: 1 }, { a: 2 }]);
      expect(!!q.areObjectsBuilt(), "#2: the assignment builds nothing").toBe(false);
      if (json.type === "paneldynamic") {
        q.onFirstRendering();
      } else {
        q.visibleRows;
      }
      expect(q.value, "#3: the first build ran the triggers of the record whose a = 1").toEqual([{ a: 1, b: "set" }, { a: 2 }]);
    });
  });
});

describe("Records questions: writes through an item", () => {
  interface IWriteKind {
    type: string;
    variable: string;
    // elements: the cells or template questions, a text question by default.
    create(elements: Array<any>, extra?: any): any;
    items(q: any): Array<any>;
    question(q: any, index: number, name: string): any;
    record(q: any, index: number): any;
    value(records: Array<any>): any;
  }
  const writeKinds: Array<IWriteKind> = [
    {
      type: "matrixdynamic", variable: "row",
      create: (elements, extra) => Object.assign({ type: "matrixdynamic", rowCount: 2, columns: elements.map(e => Object.assign({ cellType: "text" }, e)) }, extra),
      items: q => q.visibleRows,
      question: (q, index, name) => q.visibleRows[index].getQuestionByName(name),
      record: (q, index) => Array.isArray(q.value) ? q.value[index] : undefined,
      value: records => records
    },
    {
      type: "matrixdropdown", variable: "row",
      create: (elements, extra) => Object.assign({ type: "matrixdropdown", rows: ["r0", "r1"], columns: elements.map(e => Object.assign({ cellType: "text" }, e)) }, extra),
      items: q => q.visibleRows,
      question: (q, index, name) => q.visibleRows[index].getQuestionByName(name),
      record: (q, index) => !!q.value ? q.value["r" + index] : undefined,
      value: records => {
        const res: any = {};
        records.forEach((record, index) => { res["r" + index] = record; });
        return res;
      }
    },
    {
      type: "paneldynamic", variable: "panel",
      create: (elements, extra) => Object.assign({ type: "paneldynamic", panelCount: 2, templateElements: elements.map(e => Object.assign({ type: "text" }, e)) }, extra),
      items: q => q.panels.map((panel: any) => panel.data),
      question: (q, index, name) => q.panels[index].getQuestionByName(name),
      record: (q, index) => Array.isArray(q.value) ? q.value[index] : undefined,
      value: records => records
    }
  ];
  const createSurvey = (kind: IWriteKind, elements: Array<any>, surveyJson?: any, extra?: any): SurveyModel =>
    new SurveyModel(Object.assign({ elements: [Object.assign({ name: "q" }, kind.create(elements, extra))] }, surveyJson));
  // The trigger of b logs the value of a it ran with.
  const withTrigger = (kind: IWriteKind): Array<any> => [{ name: "a" },
    { name: "b", setValueIf: "{" + kind.variable + ".a} notempty", setValueExpression: "logRecordTrigger({" + kind.variable + ".a})" }];
  function logEvents(survey: SurveyModel, transform?: (value: any) => any): Array<string> {
    const log: Array<string> = [];
    FunctionFactory.Instance.register("logRecordTrigger", (params: Array<any>): any => {
      log.push("trigger:" + params[0]);
      return "t:" + params[0];
    });
    survey.onValueChanging.add((_, options) => { log.push("changing:" + options.name); });
    survey.onValueChanged.add((_, options) => { log.push("changed:" + options.name); });
    survey.onMatrixCellValueChanging.add((_, options) => {
      log.push("cellChanging:" + options.columnName + "=" + options.value);
      if (!!transform) options.value = transform(options.value);
    });
    survey.onMatrixCellValueChanged.add((_, options) => { log.push("cellChanged:" + options.columnName + "=" + options.value); });
    survey.onDynamicPanelValueChanged.add((_, options) => { log.push("panelChanged:" + options.name + "=" + options.value); });
    return log;
  }
  const matrixEditLog = ["cellChanging:a=x", "changing:q", "changed:q", "cellChanged:a=x", "trigger:x",
    "cellChanging:b=t:x", "changing:q", "changed:q", "cellChanged:b=t:x"];
  const editLogs: { [type: string]: Array<string> } = {
    matrixdynamic: matrixEditLog,
    matrixdropdown: matrixEditLog,
    paneldynamic: ["changing:q", "changed:q", "trigger:x", "changing:q", "changed:q", "panelChanged:b=t:x", "panelChanged:a=x"]
  };
  writeKinds.forEach(kind => {
    test("a child edit stores the record and runs the callbacks and the trigger in their order, " + kind.type, () => {
      const survey = createSurvey(kind, withTrigger(kind));
      const q = survey.getQuestionByName("q");
      const log = logEvents(survey);
      try {
        kind.question(q, 0, "a").value = "x";
        expect(log, "#1").toEqual(editLogs[kind.type]);
        expect(kind.record(q, 0), "#2").toEqual({ a: "x", b: "t:x" });
        expect(kind.question(q, 0, "b").value, "#3").toBe("t:x");
      } finally {
        FunctionFactory.Instance.unregister("logRecordTrigger");
      }
    });
    test("a write that does not change the stored field fires no value change and no trigger, " + kind.type, () => {
      const survey = createSurvey(kind, withTrigger(kind));
      const q = survey.getQuestionByName("q");
      const log = logEvents(survey);
      try {
        kind.question(q, 0, "a").value = "x";
        log.length = 0;
        kind.items(q)[0].setValue("a", "x");
        expect(log.filter(entry => entry.indexOf("cellChanging") !== 0), "#1").toEqual([]);
        expect(kind.record(q, 0), "#2").toEqual({ a: "x", b: "t:x" });
      } finally {
        FunctionFactory.Instance.unregister("logRecordTrigger");
      }
    });
    test("comments: a custom comment suffix, a value name, and record fields no question owns, " + kind.type, () => {
      const prevSuffix = settings.commentSuffix;
      settings.commentSuffix = "_note";
      try {
        // A template question stores under its value name; a matrix column under its name.
        const element = kind.type === "paneldynamic" ? { name: "a", valueName: "va" } : { name: "va" };
        const survey = createSurvey(kind, [Object.assign({ showCommentArea: true }, element), { name: "b" }]);
        const q = survey.getQuestionByName("q");
        survey.setValue("q", kind.value([{ va: "1", extra: "kept" }, { b: "2" }]));
        const a = kind.question(q, 0, element.name);
        a.comment = "c1";
        expect(kind.record(q, 0), "#1: the comment field").toEqual({ va: "1", va_note: "c1", extra: "kept" });
        a.value = "x";
        expect(kind.record(q, 0), "#2: the value name").toEqual({ va: "x", va_note: "c1", extra: "kept" });
        a.comment = "";
        expect(kind.record(q, 0), "#3: an empty comment is removed").toEqual({ va: "x", extra: "kept" });
        expect(kind.record(q, 1), "#4: the other record").toEqual({ b: "2" });
      } finally {
        settings.commentSuffix = prevSuffix;
      }
    });
    test("survey.setValue on the question refreshes exactly the items whose record changed, " + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a" }]);
      const q = survey.getQuestionByName("q");
      survey.setValue("q", kind.value([{ a: "1" }, { a: "2" }]));
      const spies = kind.items(q).map(item => vi.spyOn(item, "updateFromRecord"));
      survey.setValue("q", kind.value([{ a: "1" }, { a: "y" }]));
      expect(spies.map(spy => spy.mock.calls.length), "#1").toEqual([0, 1]);
      expect([kind.question(q, 0, "a").value, kind.question(q, 1, "a").value], "#2").toEqual(["1", "y"]);
    });
    test("a callback that throws during a child write leaves later assignments refreshing the items, " + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a" }]);
      const q = survey.getQuestionByName("q");
      let isThrowing = true;
      survey.onValueChanged.add(() => {
        if (isThrowing) throw new Error("callback");
      });
      // A matrix cell write does not pass the exception on to the cell (as before); the panel's does.
      try {
        kind.question(q, 0, "a").value = "x";
      } catch(e) {
        expect((<any>e).message, "#1").toBe("callback");
      }
      isThrowing = false;
      survey.setValue("q", kind.value([{ a: "1" }, { a: "2" }]));
      expect([kind.question(q, 0, "a").value, kind.question(q, 1, "a").value], "#2").toEqual(["1", "2"]);
    });
  });
  [writeKinds[0], writeKinds[1]].forEach(kind => {
    test("an edit the cell-changing callback transforms is stored, triggered and reported transformed, " + kind.type, () => {
      const survey = createSurvey(kind, withTrigger(kind));
      const q = survey.getQuestionByName("q");
      const log = logEvents(survey, (value: any): any => String(value).toUpperCase());
      try {
        kind.question(q, 0, "a").value = "x";
        expect(log, "#1").toEqual(["cellChanging:a=x", "changing:q", "changed:q", "cellChanged:a=X", "trigger:X",
          "cellChanging:b=t:X", "changing:q", "changed:q", "cellChanged:b=T:X"]);
        expect(kind.record(q, 0), "#2").toEqual({ a: "X", b: "T:X" });
        expect(kind.question(q, 0, "a").value, "#3").toBe("X");
      } finally {
        FunctionFactory.Instance.unregister("logRecordTrigger");
      }
    });
    test("an edit the cell rejects when the survey validates on value changing is not stored, " + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a", validators: [{ type: "regex", regex: "^x" }] }], { checkErrorsMode: "onValueChanging" });
      const q = survey.getQuestionByName("q");
      const log = logEvents(survey);
      const a = kind.question(q, 0, "a");
      a.value = "bad";
      expect(log, "#1: only the cell-changing callback").toEqual(["cellChanging:a=bad"]);
      expect(q.value, "#2: nothing is stored").toBeUndefined();
      expect([a.value, a.errors.length], "#3: the cell keeps the value and shows the error").toEqual(["bad", 1]);
      a.value = "x1";
      expect(kind.record(q, 0), "#4: a valid edit is stored").toEqual({ a: "x1" });
    });
    test("two questions on one value name in a row: either one writes the record and the other follows, " + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a" }], undefined, {
        detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d", valueName: "a" }]
      });
      const q = survey.getQuestionByName("q");
      q.visibleRows[0].showDetailPanel();
      const a = kind.question(q, 0, "a");
      const d = kind.question(q, 0, "d");
      a.value = "1";
      expect([d.value, kind.record(q, 0)], "#1").toEqual(["1", { a: "1" }]);
      d.value = "2";
      expect([a.value, kind.record(q, 0)], "#2").toEqual(["2", { a: "2" }]);
    });
  });
  test("two questions on one value name in a panel: either one writes the record and the other follows", () => {
    const kind = writeKinds[2];
    const survey = createSurvey(kind, [{ name: "a" }, { name: "a2", valueName: "a" }]);
    const q = survey.getQuestionByName("q");
    kind.question(q, 0, "a").value = "1";
    expect([kind.question(q, 0, "a2").value, kind.record(q, 0)], "#1").toEqual(["1", { a: "1" }]);
    kind.question(q, 0, "a2").value = "2";
    expect([kind.question(q, 0, "a").value, kind.record(q, 0)], "#2").toEqual(["2", { a: "2" }]);
  });
  test("a write from a bound sibling refreshes the item of the same record under another sort and page, and runs its trigger once", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "pd", valueName: "rec", templateElements: [{ type: "text", name: "a" }] },
        {
          type: "matrixdynamic", name: "md", valueName: "rec", sortBy: "s-",
          columns: [{ name: "a", cellType: "text" }, { name: "s", cellType: "text", inputType: "number" },
            { name: "b", cellType: "text", setValueIf: "{row.a} = 'z'", setValueExpression: "logRecordTrigger({row.a})" }]
        },
        { type: "paneldynamic", name: "paged", valueName: "rec", panelsPerPage: 1, templateElements: [{ type: "text", name: "a" }] }
      ]
    });
    const log: Array<string> = [];
    FunctionFactory.Instance.register("logRecordTrigger", (params: Array<any>): any => {
      log.push("trigger:" + params[0]);
      return "t:" + params[0];
    });
    try {
      survey.data = { rec: [{ a: "1", s: 1 }, { a: "2", s: 2 }, { a: "3", s: 3 }] };
      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      const md = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
      const paged = <QuestionPanelDynamicModel>survey.getQuestionByName("paged");
      paged.pageIndex = 1;
      expect(md.visibleRows.map(row => row.getQuestionByName("a").value), "#1: sorted").toEqual(["3", "2", "1"]);
      expect(paged.panels.map(panel => panel.getQuestionByName("a").value), "#1: the second page").toEqual(["2"]);
      const mdSpies = md.visibleRows.map(row => vi.spyOn(row, "updateFromRecord"));
      const pagedSpy = vi.spyOn(<any>paged.panels[0].data, "updateFromRecord");
      pd.panels[0].getQuestionByName("a").value = "z";
      expect(mdSpies.map(spy => spy.mock.calls.length > 0), "#2: the row of record 0 only").toEqual([false, false, true]);
      expect(pagedSpy.mock.calls.length, "#3: the page shows another record").toBe(0);
      expect(md.visibleRows[2].getQuestionByName("a").value, "#4").toBe("z");
      expect(log, "#5: the trigger of the row of record 0, once").toEqual(["trigger:z"]);
      expect(survey.data.rec, "#6").toEqual([{ a: "z", s: 1, b: "t:z" }, { a: "2", s: 2 }, { a: "3", s: 3 }]);
    } finally {
      FunctionFactory.Instance.unregister("logRecordTrigger");
    }
  });
  writeKinds.forEach(kind => {
    test("assigning a value of N records refreshes each item once, " + kind.type, () => {
      const measure = (count: number): number => {
        const records: Array<any> = [];
        const rows: Array<string> = [];
        for (let i = 0; i < count; i++) {
          records.push({ a: "v" + i });
          rows.push("r" + i);
        }
        const survey = createSurvey(kind, [{ name: "a" }], undefined, kind.type === "matrixdropdown" ? { rows: rows } : { rowCount: count, panelCount: count });
        const q = survey.getQuestionByName("q");
        const items = kind.items(q);
        expect(items.length, "built: " + count).toBe(count);
        const spy = vi.spyOn(Object.getPrototypeOf(items[0]), "updateFromRecord");
        try {
          survey.setValue("q", kind.value(records));
          return spy.mock.calls.length;
        } finally {
          spy.mockRestore();
        }
      };
      expect(measure(20), "#1").toBe(20);
      expect(measure(40), "#2").toBe(40);
    });
  });
});

describe("Records questions: error walks", () => {
  interface IErrorKind {
    type: string;
    variable: string;
    create(elements: Array<any>, extra?: any): any;
    items(q: any): Array<any>;
    question(q: any, index: number, name: string): any;
    value(records: Array<any>): any;
  }
  const errorKinds: Array<IErrorKind> = [
    {
      type: "matrixdynamic", variable: "row",
      create: (elements, extra) => Object.assign({ type: "matrixdynamic", rowCount: 3, columns: elements.map(e => Object.assign({ cellType: "text" }, e)) }, extra),
      items: q => q.allRows,
      question: (q, index, name) => q.allRows[index].getQuestionByName(name),
      value: records => records
    },
    {
      type: "matrixdropdown", variable: "row",
      create: (elements, extra) => Object.assign({ type: "matrixdropdown", rows: ["r0", "r1", "r2"], columns: elements.map(e => Object.assign({ cellType: "text" }, e)) }, extra),
      items: q => q.allRows,
      question: (q, index, name) => q.allRows[index].getQuestionByName(name),
      value: records => {
        const res: any = {};
        records.forEach((record, index) => { res["r" + index] = record; });
        return res;
      }
    },
    {
      type: "paneldynamic", variable: "panel",
      create: (elements, extra) => Object.assign({ type: "paneldynamic", panelCount: 3, templateElements: elements.map(e => Object.assign({ type: "text" }, e)) }, extra),
      items: q => q.panels.map((panel: any) => panel.data),
      question: (q, index, name) => q.panels[index].getQuestionByName(name),
      value: records => records
    }
  ];
  const createSurvey = (kind: IErrorKind, elements: Array<any>, extra?: any): SurveyModel =>
    new SurveyModel({ elements: [Object.assign({ name: "q" }, kind.create(elements, extra))] });
  const hiddenIf = (kind: IErrorKind): any => kind.type === "paneldynamic" ? { templateVisibleIf: "{panel.h} empty" } : { rowsVisibleIf: "{row.h} empty" };
  errorKinds.forEach(kind => {
    /* Without paging a matrix reports the errors of every row's cells, a hidden row's included, as it
       always has; the panel reports its visible panels. */
    const isHiddenReported = kind.type !== "paneldynamic";
    const name = isHiddenReported ? "getAllErrors still reports an item that was hidden after it showed an error, "
      : "getAllErrors does not report an item that was hidden after it showed an error, ";
    test(name + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a", isRequired: true }, { name: "h" }], hiddenIf(kind));
      const q = survey.getQuestionByName("q");
      kind.question(q, 2, "a").value = "valid";
      expect(q.validate(true), "#1").toBe(false);
      expect(q.getAllErrors().length, "#1: two items show an error").toBe(2);
      kind.question(q, 1, "h").value = "hide";
      expect(kind.question(q, 1, "a").errors.length, "#2: the hidden item keeps its error").toBe(1);
      expect(q.getAllErrors().length, "#2: reported or not").toBe(isHiddenReported ? 2 : 1);
      expect(q.validate(true), "#3: the question is still invalid").toBe(false);
    });
  });
  [errorKinds[0], errorKinds[1]].forEach(kind => {
    const detail = {
      detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "q2", validators: [{ type: "expression", expression: "{row.q1} + {row.q2} <= 10" }] }]
    };
    [false, true].forEach(isPaged => {
      /* Without paging getAllErrors reports the errors of the row cells only, as it always has; with
         paging it walks the row objects of the page, detail panels included. */
      const name = isPaged ? "with paging, a detail-panel error is reported and goes away when survey.setValue makes the row valid, "
        : "without paging, a detail-panel error is not reported and stays until the matrix is validated, ";
      test(name + kind.type, () => {
        const survey = createSurvey(kind, [{ name: "q1", cellType: "text", inputType: "number" }],
          Object.assign({ rowsPerPage: isPaged ? 3 : 0 }, detail));
        const q = survey.getQuestionByName("q");
        const row = q.visibleRows[0];
        row.showDetailPanel();
        row.getQuestionByName("q1").value = 5;
        row.getQuestionByName("q2").value = 8;
        expect(q.validate(true), "#1").toBe(false);
        expect(row.getQuestionByName("q2").errors.length, "#1: the detail question shows it").toBe(1);
        expect(q.getAllErrors().length, "#2: reported with paging only").toBe(isPaged ? 1 : 0);
        survey.setValue("q", kind.value([{ q1: 1, q2: 8 }, {}, {}]));
        expect(row.getQuestionByName("q2").errors.length, "#3: re-validated with paging, kept without it").toBe(isPaged ? 0 : 1);
        expect(q.getAllErrors().length, "#4").toBe(0);
        if (!isPaged) {
          q.validate(true);
          expect(row.getQuestionByName("q2").errors.length, "#5: validated, it is gone").toBe(0);
        }
      });
    });
    test("without paging, clearErrors clears the cells of the visible rows only, " + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a", isRequired: true }, { name: "h" }], Object.assign({
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "d", isRequired: true }]
      }, hiddenIf(kind)));
      const q = survey.getQuestionByName("q");
      kind.question(q, 2, "h").value = "hidden from the start";
      q.visibleRows[0].showDetailPanel();
      const detailPanel = q.allRows[0].detailPanel;
      expect(q.validate(true), "#1").toBe(false);
      expect(kind.question(q, 0, "a").errors.length, "#1: row 0").toBe(1);
      expect(kind.question(q, 1, "a").errors.length, "#1: row 1").toBe(1);
      expect(detailPanel.getQuestionByName("d").errors.length, "#1: the detail question").toBe(1);
      kind.question(q, 1, "h").value = "hide";
      detailPanel.getQuestionByName("d").errors = [new CustomError("the detail question")];
      q.clearErrors();
      expect(kind.question(q, 0, "a").errors.length, "#2: a visible row").toBe(0);
      expect(kind.question(q, 1, "a").errors.length, "#3: the hidden row keeps its error").toBe(1);
      expect(detailPanel.getQuestionByName("d").errors.length, "#4: so does the detail question: detail panels take no part").toBe(1);
      expect(q.allRows[2].detailPanel === null, "#5: no detail panel is created").toBe(true);
    });
    test("with paging, clearErrors clears the rows of the page and their detail panels, the panel's own error included, and creates no detail panel, " + kind.type, () => {
      const survey = createSurvey(kind, [{ name: "a", isRequired: true }], {
        rowsPerPage: 3,
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "d", isRequired: true }]
      });
      const q = survey.getQuestionByName("q");
      q.visibleRows[0].showDetailPanel();
      const detailPanel = q.allRows[0].detailPanel;
      expect(q.validate(true), "#1").toBe(false);
      expect(kind.question(q, 1, "a").errors.length, "#1: row 1").toBe(1);
      expect(detailPanel.getQuestionByName("d").errors.length, "#1: the detail question").toBe(1);
      detailPanel.errors = [new CustomError("the detail panel")];
      const detailPanels = (): Array<boolean> => q.allRows.map((row: any): boolean => row.detailPanel !== null);
      const createdBefore = detailPanels();
      q.clearErrors();
      expect(kind.question(q, 1, "a").errors.length, "#2: row 1").toBe(0);
      expect(detailPanel.getQuestionByName("d").errors.length, "#3: the detail question").toBe(0);
      expect(detailPanel.errors.length, "#4: the detail panel").toBe(0);
      expect(detailPanels(), "#5: clearErrors creates no detail panel").toEqual(createdBefore);
    });

    test("an asynchronous validator of a detail question keeps the question running validators until it answers, " + kind.type, () => {
      const results: Array<(res: any) => void> = [];
      FunctionFactory.Instance.register("recordsAsyncFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
      try {
        const survey = createSurvey(kind, [{ name: "a" }], {
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "d", validators: [{ type: "expression", expression: "recordsAsyncFunc({row.d}) = 1" }] }]
        });
        const q = survey.getQuestionByName("q");
        q.visibleRows[0].showDetailPanel();
        q.visibleRows[0].getQuestionByName("d").value = "v";
        q.validate(true);
        expect(results.length > 0, "#1: the validator is waiting").toBe(true);
        expect(q.isRunningValidators, "#1").toBe(true);
        results.forEach(res => res(1));
        expect(q.isRunningValidators, "#2: answered").toBe(false);
      } finally {
        FunctionFactory.Instance.unregister("recordsAsyncFunc");
      }
    });
  });
  test("clearErrors clears the own error of a panel nested in a dynamic panel", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "q", panelCount: 1, templateElements: [
        { type: "panel", name: "nested", isRequired: true, elements: [{ type: "text", name: "t" }] }
      ] }]
    });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    const nested = <any>q.panels[0].getElementByName("nested");
    expect(q.validate(true), "#1").toBe(false);
    expect(nested.errors.length, "#1").toBe(1);
    q.clearErrors();
    expect(nested.errors.length, "#2").toBe(0);
  });
  [true, false].forEach(isMatrix => {
    test("paging: the walks create no object for an edited record off the page, and leaving the page still finds its error, " + (isMatrix ? "matrix" : "panel"), () => {
      const records: Array<any> = [];
      for (let i = 0; i < 12; i++) records.push({ id: "id" + i, name: "n" + i });
      const elements = [{ name: "id" }, { name: "name", isRequired: true }];
      const survey = new SurveyModel({
        elements: [isMatrix
          ? { type: "matrixdynamic", name: "q", rowsPerPage: 5, columns: elements.map(e => Object.assign({ cellType: "text" }, e)) }
          : { type: "paneldynamic", name: "q", panelsPerPage: 5, templateElements: elements.map(e => Object.assign({ type: "text" }, e)) }]
      });
      survey.data = { q: records };
      const q: any = survey.getQuestionByName("q");
      const objects = (): Array<any> => isMatrix ? q.visibleRows : q.panels;
      q.pageIndex = 1;
      objects()[1].getQuestionByName("name").value = "";
      q.pageIndex = 0;
      q.clearErrors();
      expect(q.getAllErrors().length, "#1").toBe(0);
      expect(q.isRunningValidators, "#1").toBe(false);
      expect(objects().length, "#2: the page only").toBe(5);
      expect(q.getItemByRecordIndex(6), "#2: no object for the edited record").toBeUndefined();
      expect(q.validate(true), "#3: a full validation finds the edited record").toBe(false);
      expect(q.pageIndex, "#3: on its page").toBe(1);
    });
  });
});

describe("Records questions: the object of a record", () => {
  function createDynamic(isMatrix: boolean, records: Array<any>, props: any = {}): any {
    const survey = new SurveyModel({
      elements: [isMatrix
        ? Object.assign({ type: "matrixdynamic", name: "q", columns: [{ name: "a", cellType: "text" }] }, props)
        : Object.assign({ type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "a" }] }, props)]
    });
    survey.data = { q: records };
    return survey.getQuestionByName("q");
  }
  // The object a lookup by record answers: a row, or a panel's item.
  function getObjects(q: any, isMatrix: boolean): Array<any> {
    return isMatrix ? q.visibleRows : q.panels.map((p: any) => p.data);
  }
  test("fixed matrix without a list: a record's row is found, a missing one is not, and no list is created", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "q", rows: ["r1", "r2"], columns: [{ name: "a" }] }] });
    const q: any = survey.getQuestionByName("q");
    const rows = q.visibleRows;
    expect(q.getItemByRecordIndex(1) === rows[1], "#1: the row of the second record").toBe(true);
    expect(q.getItemByRecordIndex(2), "#2: past the rows").toBeFalsy();
    expect(q.getItemByRecordIndex(-1), "#3: a negative index").toBeUndefined();
    expect(hasNoRecordList(q), "#4: no list").toBe(true);
  });
  [true, false].forEach((isMatrix: boolean) => {
    const name = isMatrix ? "dynamic matrix" : "dynamic panel";
    test(name + ": with a list but no view, the record index is the object position", () => {
      const q = createDynamic(isMatrix, [{ a: "1" }, { a: "2" }, { a: "3" }]);
      q["dataList"];
      const objects = getObjects(q, isMatrix);
      expect(q.getItemByRecordIndex(2) === objects[2], "#1: the object of the last record").toBe(true);
      expect(q.getItemByRecordIndex(3), "#2: past the records").toBeFalsy();
      expect(q.getItemByRecordIndex(-1), "#3: a negative index").toBeUndefined();
    });
    test(name + ": under a sort, a record is found at the position the sort gave it", () => {
      const q = createDynamic(isMatrix, [{ a: "1" }, { a: "3" }, { a: "2" }]);
      q.sortBy = "a-";
      const objects = getObjects(q, isMatrix);
      expect(q.getItemByRecordIndex(1) === objects[0], "#1: the largest value is first").toBe(true);
      expect(q.getItemByRecordIndex(2) === objects[1], "#2: then the middle one").toBe(true);
      expect(q.getItemByRecordIndex(0) === objects[2], "#3: the smallest value is last").toBe(true);
    });
    test(name + ": under paging, a record off the page has no object and the lookup builds none", () => {
      const records: Array<any> = [];
      for (let i = 0; i < 12; i++) records.push({ a: "v" + i });
      const q = createDynamic(isMatrix, records, isMatrix ? { rowsPerPage: 5 } : { panelsPerPage: 5 });
      q.pageIndex = 1;
      const objects = getObjects(q, isMatrix);
      expect(objects.length, "#1: the page only").toBe(5);
      expect(q.getItemByRecordIndex(7) === objects[2], "#2: a record on the page").toBe(true);
      expect(q.getItemByRecordIndex(2), "#3: a record on another page").toBeUndefined();
      expect(q.getItemByRecordIndex(12), "#4: past the records").toBeUndefined();
      const after = getObjects(q, isMatrix);
      expect(after.length === objects.length && after.every((o: any, i: number) => o === objects[i]), "#5: no object was built").toBe(true);
    });
  });
});
/* A survey handler is not a data source: what it throws reaches the caller, as it does without a
   record list, and the question is left able to go on - the next edit and removal work. */
describe("Records questions: a survey handler's exception reaches the caller", () => {
  const createSurvey = (): SurveyModel => new SurveyModel({
    elements: [
      { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "a", cellType: "text" }] },
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "t" }] }
    ]
  });
  const throwOnce = (survey: SurveyModel): void => {
    let isThrowing = true;
    survey.onValueChanged.add(() => {
      if (!isThrowing) return;
      isThrowing = false;
      throw new Error("handler");
    });
  };
  test("matrix: a cell edit and removeRow", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    throwOnce(survey);
    expect(() => matrix.visibleRows[0].getQuestionByName("a").value = "x", "#1: a cell edit").toThrow("handler");
    expect(matrix["dataList"].isWriting, "#2: no write scope is left open").toBe(false);
    matrix.visibleRows[1].getQuestionByName("a").value = "y";
    expect(survey.data.m, "#3: the next edit works").toEqual([{ a: "x" }, { a: "y" }]);
    throwOnce(survey);
    expect(() => matrix.removeRow(0), "#4: removeRow").toThrow("handler");
    expect(survey.data.m, "#5: the record is removed").toEqual([{ a: "y" }]);
    matrix.addRow();
    matrix.visibleRows[1].getQuestionByName("a").value = "z";
    expect(survey.data.m, "#6: the next add and edit work").toEqual([{ a: "y" }, { a: "z" }]);
  });
  test("panel: a field edit and removePanel", () => {
    const survey = createSurvey();
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    throwOnce(survey);
    expect(() => panel.panels[0].getQuestionByName("t").value = "x", "#1: a field edit").toThrow("handler");
    panel.panels[1].getQuestionByName("t").value = "y";
    expect(survey.data.p, "#2: the next edit works").toEqual([{ t: "x" }, { t: "y" }]);
    throwOnce(survey);
    expect(() => panel.removePanel(0), "#3: removePanel").toThrow("handler");
    expect(survey.data.p, "#4: the record is removed").toEqual([{ t: "y" }]);
    expect(panel.panels.length, "#5").toBe(1);
    panel.addPanel();
    panel.panels[1].getQuestionByName("t").value = "z";
    expect(survey.data.p, "#6: the next add and edit work").toEqual([{ t: "y" }, { t: "z" }]);
  });
});
/* The public face of the records questions: a compatible rows property on the dynamic matrix, one
   method that reads a data source again, a record list nobody outside can repoint, and JSON property
   names that round-trip - a sort made at runtime included. */
describe("Records questions: public surface", () => {
  test("matrixdynamic.rows is the empty array it has always been, and is not serialized", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "a" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(Array.isArray(matrix.rows), "#1").toBe(true);
    expect(matrix.rows.length, "#2").toBe(0);
    expect(matrix.toJSON().rows, "#3").toBeUndefined();
  });
  test("refreshDataSource reads an assigned source again with the request in force, and does nothing without one", async () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ a: 1 }, { a: 2 }];
    expect(matrix.refreshDataSource(), "#1: question.value is read through: nothing to read").toBeUndefined();
    const stored = [{ a: 1 }, { a: 2 }, { a: 3 }];
    const source = ArrayDynamicDataSource.fromArray(stored);
    matrix.dataSource = source;
    stored.push({ a: 4 });
    expect(matrix.rowCount, "#2: an assigned array is read, not watched").toBe(3);
    matrix.refreshDataSource();
    expect(matrix.rowCount, "#3: read again").toBe(4);
    const requests: Array<any> = [];
    const paged = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 0, panelsPerPage: 2, templateElements: [{ type: "text", name: "id" }] }] });
    const panel = <QuestionPanelDynamicModel>paged.getQuestionByName("p");
    panel.dataSource = {
      capabilities: { paging: true, sorting: true, filtering: true },
      read: (request: any): any => { requests.push(request); return { records: [{ id: request.skip }, { id: request.skip + 1 }], total: 10 }; }
    };
    panel.sortBy = "id-";
    panel.pageIndex = 2;
    const before = requests.length;
    await panel.refreshDataSource();
    expect(requests.length - before, "#4: one read").toBe(1);
    expect(requests[requests.length - 1], "#5: the page, the filter and the sort in force").toEqual({ skip: 4, take: 2, filter: "", sort: [{ field: "id", direction: "desc" }] });
  });
  test("the read-through switch of a question's list cannot be set from outside", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "a" }] }] });
    const list = survey.getQuestionByName("m")["dataList"];
    expect(list.isReadThrough, "#1").toBe(true);
    expect(() => { (<any>list).isReadThrough = false; }, "#2: it has no setter").toThrow();
    expect(list.isReadThrough, "#3").toBe(true);
  });
  test("the records of the Multi-Select Matrix cannot be replaced through its list, and a refused swap changes nothing", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rows: ["r1", "r2"], columns: [{ name: "a", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.value = { r1: { a: "x" } };
    const list = matrix["dataList"];
    const source = list.source;
    const other = ArrayDynamicDataSource.fromArray([{ a: "y" }]);
    expect(() => { list.source = other; }, "#1: the source setter").toThrow();
    expect(() => list.assignSource(other), "#2: assignSource").toThrow();
    expect(list.source === source, "#3: the source is the matrix's own").toBe(true);
    expect(list.isRemote, "#4").toBe(false);
    expect(matrix.value, "#5: the answer is as it was").toEqual({ r1: { a: "x" } });
    expect(matrix.visibleRows[0].getQuestionByName("a").value, "#6").toBe("x");
  });
  test("the property names round-trip on every records question, a sort made at runtime included", () => {
    const json = { elements: [
      { type: "matrixdynamic", name: "md", rowsPerPage: 5, sortBy: "a-", filterExpression: "{a} > 1", allowSortRows: true,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", allowSort: false }] },
      { type: "matrixdropdown", name: "dd", rowsPerPage: 2, sortBy: "a", filterExpression: "{a} > 1",
        rows: ["r1", "r2"], columns: [{ name: "a", cellType: "text" }] },
      { type: "paneldynamic", name: "pd", panelsPerPage: 3, sortBy: "q;a-", filterExpression: "{q} notempty",
        templateElements: [{ type: "text", name: "q" }, { type: "text", name: "a" }] }] };
    const survey = new SurveyModel(json);
    expect(survey.toJSON().pages[0].elements, "#1: as authored").toEqual(json.elements);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.toggleSort("b");
    expect(matrix.toJSON().sortBy, "#2: the sort made at runtime is saved").toBe("b");
    const loaded = new SurveyModel(survey.toJSON());
    expect((<QuestionMatrixDynamicModel>loaded.getQuestionByName("md")).sortOrder, "#3: and loads back").toEqual([{ field: "b", direction: "asc" }]);
  });
});
