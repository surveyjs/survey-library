import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

/* The record list and its helpers are created on demand. A matrix whose rows are fixed never pages,
   sorts or filters, so nothing on its paths may create them; the dynamic questions create the list
   at the points that need it and coordinate every value assignment and their disposal with it. */

function hasNoRecordList(q: any): boolean {
  const controller = q.dynamicData;
  return controller === undefined || controller.listValue === undefined;
}

describe("Records question: fixed matrix", () => {
  test("fixed matrix: no record list is created", () => {
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
    expect(hasNoRecordList(q), "#3: a cell edit").toBe(true);
    expect(q.value, "#3: the edited row joins the keyed answer").toEqual({ r1: { a: "1" }, r2: { a: "2" }, r3: { a: "3" } });

    survey.setValue("showAll", true);
    expect(hasNoRecordList(q), "#4: a variable rowsVisibleIf reads").toBe(true);
    expect(q.visibleRows.length, "#4: the third row is visible").toBe(3);
    survey.setValue("showAll", false);
    expect(q.visibleRows.length, "#4: the third row is hidden again").toBe(2);

    survey.validate();
    expect(hasNoRecordList(q), "#5: validate").toBe(true);

    survey.clearInvisibleValues = "onComplete";
    survey.doComplete();
    expect(hasNoRecordList(q), "#6: complete").toBe(true);
    expect(q.value, "#6: the hidden row's answer is cleared, nothing is padded").toEqual({ r1: { a: "1" }, r2: { a: "2" } });
    expect(Array.isArray(q.value), "#6: never an array").toBe(false);

    q.dispose();
    expect(hasNoRecordList(q), "#7: dispose").toBe(true);
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
    const getPageState = (q: any): any => q.dynamicData.getPageState();
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
    expect((<any>panel).dynamicData.listValue, "#1: the dynamic panel has created its list").toBeDefined();

    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("a");
    matrix.value = [{ a: 1 }, { a: 2 }];
    expect((<any>matrix).dynamicData.listValue, "#2: the dynamic matrix has not").toBeUndefined();
  });
});

describe("Records question: value assignment", () => {
  function createPagedMatrix(): QuestionMatrixDynamicModel {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    expect(q.visibleRows.length, "the page is built").toBe(2);
    expect((<any>q).dynamicData.listValue, "the list exists").toBeDefined();
    return q;
  }
  test("matrix: one list-side pair per assignment, and the rows get their values inside it", () => {
    const q = createPagedMatrix();
    const controller = (<any>q).dynamicData;
    const begin = vi.spyOn(controller, "beginValueAssignment");
    const end = vi.spyOn(controller, "endValueAssignment");
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
    expect((<any>q).dynamicData.listValue, "the list exists").toBeDefined();
    const controller = (<any>q).dynamicData;
    const begin = vi.spyOn(controller, "beginValueAssignment");
    const end = vi.spyOn(controller, "endValueAssignment");
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
    const controller = (<any>q).dynamicData;
    const begin = vi.spyOn(controller, "beginValueAssignment");
    const end = vi.spyOn(controller, "endValueAssignment");
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
    const list = (<any>q).dynamicData.listValue;
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
    const list = (<any>q).dynamicData.listValue;
    expect(list, "the list exists").toBeDefined();
    const listDispose = vi.spyOn(list, "dispose");
    const templateDispose = vi.spyOn(q.template, "dispose");
    q.dispose();
    expect(listDispose, "#1").toHaveBeenCalledTimes(1);
    expect(templateDispose, "#2").toHaveBeenCalledTimes(1);
    expect(listDispose.mock.invocationCallOrder[0] < templateDispose.mock.invocationCallOrder[0], "#3").toBe(true);
  });
});
