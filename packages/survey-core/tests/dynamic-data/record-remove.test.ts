import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { PanelModel } from "../../src/panel";
import { settings } from "../../src/settings";

/* Removing a record by number or by object, the confirmation asked for it and the target found again
   when the confirmation answers later; the order a question disposes its objects in; the page size the
   list gets. */

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
// A confirmation that answers when the test says so.
function useAsyncConfirmation(): { answer: (res: boolean) => void } {
  const prev = settings.confirmActionAsync;
  const res = { answer: (val: boolean): void => { } };
  beforeEach(() => {
    settings.confirmActionAsync = (message: string, resFunc: (val: boolean) => void): boolean => {
      res.answer = resFunc;
      return true;
    };
  });
  afterEach(() => { settings.confirmActionAsync = prev; });
  return res;
}

describe("the removal confirmation asks about the record it removes", () => {
  test("matrix with rowsVisibleIf: the record of the row removeRow(n) removes", () => {
    const hidden = { confirmDelete: true, rowsVisibleIf: "{rowIndex} > 1" };
    const matrix = createMatrix(hidden, [{ a: 1 }, {}]);
    expect(matrix.visibleRows.length, "#1: record 0 is hidden").toBe(1);
    expect(matrix.isRequireConfirmOnRowDelete(0), "#2: the first visible row is empty").toBe(false);
    const matrix2 = createMatrix(hidden, [{}, { a: 1 }]);
    expect(matrix2.visibleRows.length, "#3").toBe(1);
    expect(matrix2.isRequireConfirmOnRowDelete(0), "#4: the first visible row has a value").toBe(true);
  });
  test("matrix without hidden rows: a row with a value asks, an empty one does not", () => {
    const matrix = createMatrix({ confirmDelete: true }, [{ a: 1 }, {}]);
    expect(matrix.isRequireConfirmOnRowDelete(0), "#1").toBe(true);
    expect(matrix.isRequireConfirmOnRowDelete(1), "#2").toBe(false);
    expect(matrix.isRequireConfirmOnRowDelete(2), "#3: no row").toBe(false);
  });
  test("panel: a record equal to defaultPanelValue is removed without asking, paged and unpaged", () => {
    const json = { confirmDelete: true, defaultPanelValue: { a: "d" } };
    const panel = createPanel(json, [{ a: "d" }, { a: 1 }]);
    expect(panel.isRequireConfirmOnDelete(0), "#1: the default").toBe(false);
    expect(panel.isRequireConfirmOnDelete(1), "#2").toBe(true);
    const paged = createPanel(Object.assign({ panelsPerPage: 1 }, json), [{ a: 1 }, { a: "d" }]);
    paged.panels;
    expect(paged.isRequireConfirmOnDelete(1), "#3: the default on another page").toBe(false);
    expect(paged.isRequireConfirmOnDelete(0), "#4").toBe(true);
  });
  test("matrix: a record equal to defaultRowValue asks", () => {
    const matrix = createMatrix({ confirmDelete: true, defaultRowValue: { a: "d" } }, [{ a: "d" }]);
    expect(matrix.isRequireConfirmOnRowDelete(0), "#1").toBe(true);
  });
});

describe("a confirmation whose object is gone removes nothing", () => {
  const confirmation = useAsyncConfirmation();
  const data = (): Array<any> => [{ a: 1 }, undefined, { a: 3 }];
  test("matrix", () => {
    const matrix = createMatrix({ confirmDelete: true }, data());
    matrix.visibleRows;
    matrix.removeRow(0, true);
    matrix.removeRow(0, false);
    expect(matrix.value, "#1: removed another way").toEqual([undefined, { a: 3 }]);
    confirmation.answer(true);
    expect(matrix.value, "#2: nothing more is removed").toEqual([undefined, { a: 3 }]);
  });
  test("paged matrix", () => {
    const matrix = createMatrix({ confirmDelete: true, rowsPerPage: 2 }, data());
    matrix.visibleRows;
    matrix.removeRow(0, true);
    matrix.removeRow(0, false);
    expect(matrix.value, "#1: removed another way").toEqual([undefined, { a: 3 }]);
    confirmation.answer(true);
    expect(matrix.value, "#2: nothing more is removed").toEqual([undefined, { a: 3 }]);
  });
  test("panel", () => {
    const panel = createPanel({ confirmDelete: true }, data());
    const first = panel.panels[0];
    panel.removePanel(first, true);
    panel.removePanel(0);
    expect(panel.value, "#1: removed another way").toEqual([undefined, { a: 3 }]);
    confirmation.answer(true);
    expect(panel.value, "#2: nothing more is removed").toEqual([undefined, { a: 3 }]);
  });
  test("paged panel", () => {
    const panel = createPanel({ confirmDelete: true, panelsPerPage: 2 }, data());
    const first = panel.panels[0];
    panel.removePanel(first, true);
    panel.removePanel(0);
    expect(panel.value, "#1: removed another way").toEqual([undefined, { a: 3 }]);
    confirmation.answer(true);
    expect(panel.value, "#2: nothing more is removed").toEqual([undefined, { a: 3 }]);
  });
  test("paged panel: a record on another page is found again by its record", () => {
    const panel = createPanel({ confirmDelete: true, panelsPerPage: 1 }, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    panel.panels;
    panel.removePanel(2, true);
    panel.removePanel(0);
    confirmation.answer(true);
    expect(panel.value, "#1: the record the number named").toEqual([{ a: 2 }]);
  });
});

describe("dispose: the objects go before the list", () => {
  test("panel: a panel kept for a later dispose is disposed before the list", () => {
    const panel = createPanel({ panelsPerPage: 1, displayMode: "carousel" }, [{ a: 1 }, { a: 2 }]);
    const first = panel.currentPanel;
    // The carousel animates the panel out: it stays rendered while Next replaces it.
    const animation: any = panel.panelsAnimation;
    animation.sync = (): void => { };
    panel["_renderedPanels"] = [first];
    panel.goToNextPanel();
    const kept: Array<PanelModel> = (<any>panel).panelsToDispose;
    expect(kept.indexOf(first) > -1, "#1: the replaced panel waits for its animation").toBe(true);
    const list = (<any>panel).dataListValue;
    const listDispose = vi.spyOn(list, "dispose");
    const panelDispose = vi.spyOn(first, "dispose");
    const templateDispose = vi.spyOn(panel.template, "dispose");
    panel.dispose();
    expect(panelDispose, "#2").toHaveBeenCalledTimes(1);
    expect(listDispose, "#3").toHaveBeenCalledTimes(1);
    expect(panelDispose.mock.invocationCallOrder[0] < listDispose.mock.invocationCallOrder[0], "#4: the panel goes first").toBe(true);
    expect(listDispose.mock.invocationCallOrder[0] < templateDispose.mock.invocationCallOrder[0], "#5: the template goes last").toBe(true);
  });
});

describe("the page size the list gets", () => {
  const maxRowCount = settings.matrix.maxRowCount;
  const maxPanelCount = settings.panel.maxPanelCount;
  afterEach(() => {
    settings.matrix.maxRowCount = maxRowCount;
    settings.panel.maxPanelCount = maxPanelCount;
  });
  test("single-input mode does not page", () => {
    const survey = new SurveyModel({ questionsOnPageMode: "inputPerPage", elements: [
      { type: "matrixdynamic", name: "m", rowCount: 3, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }] });
    expect((<any>survey.getQuestionByName("m")).listPageSize, "#1: matrix").toBe(0);
    const survey2 = new SurveyModel({ questionsOnPageMode: "inputPerPage", elements: [
      { type: "paneldynamic", name: "p", panelCount: 3, panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }] });
    expect((<any>survey2.getQuestionByName("p")).listPageSize, "#2: panel").toBe(0);
  });
  test("a page size above the setting pages by the setting", () => {
    settings.matrix.maxRowCount = 3;
    settings.panel.maxPanelCount = 2;
    const matrix = createMatrix({ rowsPerPage: 5 }, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    expect((<any>matrix).listPageSize, "#1: matrix").toBe(3);
    expect(matrix.visibleRows.length, "#2").toBe(3);
    const panel = createPanel({ panelsPerPage: 5 }, [{ a: 1 }, { a: 2 }, { a: 3 }]);
    expect((<any>panel).listPageSize, "#3: panel").toBe(2);
    expect(panel.panels.length, "#4").toBe(2);
  });
});
