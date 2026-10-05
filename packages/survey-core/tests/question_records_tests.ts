import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

/* The record list and its helpers are created on demand. A matrix whose rows are fixed creates its
   list on the first cell edit, on getDataList() and when it pages, sorts or filters - and on no other
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
    const list = q.getDataList();
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
  test("matrix: one list-side pair per assignment, and the rows get their values inside it", () => {
    const q = createPagedMatrix();
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    const onSet = vi.spyOn(<any>q, "onSetQuestionValue");
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    expect(begin, "#1").toHaveBeenCalledTimes(1);
    expect(onSet, "#2").toHaveBeenCalledTimes(1);
    expect(end, "#3").toHaveBeenCalledTimes(1);
    const order = [begin.mock.invocationCallOrder[0], onSet.mock.invocationCallOrder[0], end.mock.invocationCallOrder[0]];
    expect(order, "#4: begin, then the rows' values, then end").toEqual(order.slice().sort((x, y) => x - y));
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
      expect(q.getDataList().loadedCount, "#2: the record list").toBe(3);
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
    test("the question's own validator that reads another question is checked again when that question changes, " + json.type, () => {
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
      expect(q.errors.length, "#2: t = 1 clears it").toBe(0);
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
