import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionRecordsBar } from "../../src/question_records_bar";
import { QuestionRecordsModel } from "../../src/question_records";

function records(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ name: "n" + (i + 1) });
  }
  return res;
}
function createPanel(panelCount: number, json?: any, isDesignMode?: boolean): QuestionPanelDynamicModel {
  const survey = new SurveyModel();
  if (isDesignMode) survey.setDesignMode(true);
  survey.fromJSON({ elements: [Object.assign({
    type: "paneldynamic", name: "panel", pageSize: 2, templateElements: [{ type: "text", name: "name" }]
  }, json)] });
  survey.data = { panel: records(panelCount) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
}
function createMatrix(rowCount: number, json?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", rowCount: 0, pageSize: 2, columns: [{ name: "name", cellType: "text" }]
  }, json)] });
  survey.data = { matrix: records(rowCount) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
function createFixedMatrix(json?: any): QuestionMatrixDropdownModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdropdown", name: "matrix", pageSize: 2, rows: ["r1", "r2", "r3", "r4", "r5"], columns: [{ name: "a", cellType: "text" }]
  }, json)] });
  return <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
}
const barState = (bar: QuestionRecordsBar): Array<boolean> => [bar.showPager, bar.isVisible];
// Reads a private field on purpose: the pager container is built on its first read only.
const isPagerBuilt = (bar: QuestionRecordsBar): boolean => !!(<any>bar).pagerActionsValue;
// Reads a private field on purpose: the records bar is created on its first read only.
const isRecordsBarBuilt = (question: QuestionRecordsModel): boolean => !!(<any>question).recordsBarValue;

describe("Records bar: the object", () => {
  test("created once, on the first read, and disposed with the question together with the pager", () => {
    const panel = createPanel(5);
    expect(isRecordsBarBuilt(panel), "#1: nothing before the first read").toBe(false);
    const bar = panel.recordsBar;
    expect(panel.recordsBar, "#2").toBe(bar);
    panel.nextPage();
    panel.pageSize = 3;
    expect(panel.recordsBar, "#3: the same bar after a page move and a page size change").toBe(bar);
    const pagerActions = bar.pagerActions;
    expect(bar.pagerActions, "#4: the same container").toBe(pagerActions);
    panel.dispose();
    expect([bar.isDisposed, pagerActions.isDisposed], "#5").toEqual([true, true]);
  });
  test("a page move or a page size change before the bar exists creates no bar", () => {
    const matrix = createMatrix(5);
    matrix.nextPage();
    matrix.pageSize = 3;
    expect(isRecordsBarBuilt(matrix), "#1").toBe(false);
  });
  test("its first read already shows the current state, and builds no pager", () => {
    const bar = createPanel(5).recordsBar;
    expect(barState(bar), "#1").toEqual([true, true]);
    expect(isPagerBuilt(bar), "#2").toBe(false);
    expect(barState(createPanel(2).recordsBar), "#3: one page").toEqual([false, false]);
    expect(barState(createMatrix(5).recordsBar), "#4: the matrix").toEqual([true, true]);
  });
  test("cssClasses gives each question's class names", () => {
    const pagerClasses = { pagerPage: "sd-pager__page", pagerTotal: "sd-pager__total" };
    expect(createPanel(5).recordsBar.cssClasses, "#1").toEqual(Object.assign({
      root: "sd-paneldynamic__records-bar", pager: "sd-paneldynamic__pager" }, pagerClasses));
    expect(createMatrix(5).recordsBar.cssClasses, "#2").toEqual(Object.assign({
      root: "sd-matrixdynamic__records-bar", pager: "sd-matrixdynamic__pager" }, pagerClasses));
    expect(createFixedMatrix().recordsBar.cssClasses, "#3").toEqual(Object.assign({
      root: "sd-matrixdropdown__records-bar", pager: "sd-matrixdropdown__pager" }, pagerClasses));
  });
});

describe("Records bar: showPager follows the question with nothing else reading it", () => {
  test("a page size change and a record count change, the panel", () => {
    const panel = createPanel(5);
    const bar = panel.recordsBar;
    expect(bar.showPager, "#1: three pages").toBe(true);
    panel.pageSize = 0;
    expect(bar.showPager, "#2: no paging").toBe(false);
    panel.pageSize = 3;
    expect(bar.showPager, "#3: two pages").toBe(true);
    panel.removePanel(panel.panels[0]);
    panel.removePanel(panel.panels[0]);
    expect(bar.showPager, "#4: one page left").toBe(false);
    panel.addPanel();
    panel.addPanel();
    expect(bar.showPager, "#5: two pages again").toBe(true);
  });
  test("a page size change and a record count change, the matrix", () => {
    const matrix = createMatrix(4);
    const bar = matrix.recordsBar;
    expect(bar.showPager, "#1").toBe(true);
    matrix.pageSize = 4;
    expect(bar.showPager, "#2: one page").toBe(false);
    matrix.addRow();
    expect(bar.showPager, "#3: a row added").toBe(true);
  });
  test("the panel's display mode: carousel and tab mode lose the pager, list mode gets it back", () => {
    const panel = createPanel(5);
    const bar = panel.recordsBar;
    panel.displayMode = "tab";
    expect(barState(bar), "#1: tab").toEqual([false, false]);
    panel.displayMode = "carousel";
    expect(barState(bar), "#2: carousel").toEqual([false, false]);
    panel.displayMode = "list";
    expect(barState(bar), "#3: list").toEqual([true, true]);
  });
});

describe("Records bar: the dynamic panel's showPager", () => {
  test("true only in list mode with more than one page", () => {
    expect(createPanel(5).showPager, "#1: list mode, three pages").toBe(true);
    expect(createPanel(2).showPager, "#2: one page").toBe(false);
    expect(createPanel(5, { pageSize: 0 }).showPager, "#3: no paging").toBe(false);
    expect(createPanel(5, { displayMode: "carousel" }).showPager, "#4: carousel").toBe(false);
    expect(createPanel(5, { displayMode: "tab" }).showPager, "#5: tab").toBe(false);
    expect(createPanel(5, undefined, true).showPager, "#6: design mode").toBe(false);
  });
});

describe("Records bar: the matrix with fixed rows pages through the same bar", () => {
  test("the bar shows the pager and the moves work", () => {
    const matrix = createFixedMatrix();
    const bar = matrix.recordsBar;
    expect(barState(bar), "#1: five rows, two per page").toEqual([true, true]);
    const actions = bar.pagerActions;
    expect(actions.getActionById("sv-pager-total").title, "#2").toBe("of 3");
    actions.getActionById("sv-pager-next").action();
    expect(matrix.pageIndex, "#3").toBe(1);
    expect(matrix.visibleRows.map(row => row.rowName), "#4").toEqual(["r3", "r4"]);
    expect(actions.getActionById("sv-pager-page").title, "#5").toBe("2");
    actions.getActionById("sv-pager-prev").action();
    expect(matrix.pageIndex, "#6").toBe(0);
  });
});

describe("Records bar: the footer it shares with the buttons", () => {
  test("the dynamic panel: the footer shows for the pager alone and is marked while the pager shows", () => {
    const panel = createPanel(5);
    expect([panel.showFooter, panel.getFooterCss()], "#1: Add and the pager")
      .toEqual([true, "sd-paneldynamic__footer sd-paneldynamic__footer--pager"]);
    expect([createPanel(2).showFooter, createPanel(2).getFooterCss()], "#2: Add alone")
      .toEqual([true, "sd-paneldynamic__footer"]);
    expect(createPanel(5, { allowAddPanel: false }).showFooter, "#3: the pager alone").toBe(true);
    expect(createPanel(2, { allowAddPanel: false }).showFooter, "#4: nothing").toBe(false);
    // A read-only panel with one panel on its page has no navigation, but keeps its pager.
    expect(createPanel(3, { readOnly: true, pageSize: 1 }).showFooter, "#5").toBe(true);
    panel.pageSize = 0;
    expect([panel.showFooter, panel.getFooterCss()], "#6: no paging").toEqual([true, "sd-paneldynamic__footer"]);
    const onePage = createPanel(2, { pageSize: 10 });
    expect([onePage.showPager, onePage.showFooter, onePage.getFooterCss()], "#7: one page, Add shows")
      .toEqual([false, true, "sd-paneldynamic__footer"]);
  });
  test("the dynamic panel: showFooter is the bottom progress, the buttons or the pager", () => {
    const footerState = (q: QuestionPanelDynamicModel): Array<boolean> =>
      [q.showFooterProgress, q.showFooterButtons, q.showPager, q.showFooter];
    const panel = createPanel(3, { pageSize: 0, displayMode: "carousel", progressBarLocation: "bottom" });
    expect(footerState(panel), "#1: the navigation, the bottom progress and the buttons").toEqual([true, true, false, true]);
    panel.progressBarLocation = "top";
    expect(footerState(panel), "#2: the progress on top").toEqual([false, true, false, true]);
    panel.progressBarLocation = "bottom";
    const actions = panel.footerToolbar.actions;
    actions.forEach(action => action.visible = false);
    expect(footerState(panel), "#3: no visible button").toEqual([true, false, false, true]);
    actions[0].visible = true;
    expect(panel.showFooterButtons, "#4: the toolbar's first visible action is observed").toBe(true);
    panel.survey.onUpdateQuestionCssClasses.add((_, options) => { options.cssClasses.footer = ""; });
    panel.updateElementCss();
    expect(footerState(panel), "#5: no navigation").toEqual([false, false, false, false]);
    const list = createPanel(5, { allowAddPanel: false });
    expect(footerState(list), "#6: the pager alone").toEqual([false, false, true, true]);
  });
  test("the matrix: the footer is the pager row and is marked while the pager shows", () => {
    const matrix = createMatrix(5);
    expect([matrix.showPager, matrix.getFooterCss()], "#1: Add and the pager")
      .toEqual([true, "sd-matrixdynamic__footer sd-matrixdynamic__footer--pager"]);
    expect([createMatrix(2).showPager, createMatrix(2).getFooterCss()], "#2: Add alone")
      .toEqual([false, "sd-matrixdynamic__footer"]);
    const readOnly = createMatrix(5, { readOnly: true });
    expect([readOnly.showPager, readOnly.getShowToolbar("bottom")], "#3: the pager alone").toEqual([true, false]);
    const readOnlyOnePage = createMatrix(2, { readOnly: true });
    expect([readOnlyOnePage.showPager, readOnlyOnePage.getShowToolbar("bottom")], "#4: nothing").toEqual([false, false]);
    const addTop = createMatrix(5, { addRowLocation: "top" });
    expect([addTop.showPager, addTop.getShowToolbar("bottom")], "#5: Add above the table, the pager below it").toEqual([true, false]);
    const addTopOnePage = createMatrix(2, { addRowLocation: "top" });
    expect([addTopOnePage.showPager, addTopOnePage.getShowToolbar("bottom")], "#6: Add above the table only").toEqual([false, false]);
    expect(createMatrix(2, { pageSize: 10 }).showPager, "#7: one page").toBe(false);
  });
  // The markup tests "... with pageSize and one page" share the etalons of the questions without paging.
  test("the markup tests' questions with pageSize: 10 show no pager", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", pageSize: 10, columns: [{ name: "Column 1" }, { name: "Column 2" }, { name: "Column 3" }] },
      { type: "matrixdynamic", name: "m2", pageSize: 10, rowCount: 2, columns: [{ name: "q1", html: "test", cellType: "html" }],
        detailElements: [{ type: "html", html: "test", name: "detail-question" }], detailPanelMode: "underRowSingle" },
      { type: "paneldynamic", name: "p1", pageSize: 10, displayMode: "carousel", progressBarLocation: "bottom", panelCount: 2 },
      { type: "paneldynamic", name: "p2", pageSize: 10, allowAddPanel: false, panelCount: 1,
        templateElements: [{ type: "text", titleLocation: "hidden", name: "question2" }] }
    ] });
    const showPager = (name: string): boolean => (<any>survey.getQuestionByName(name)).showPager;
    expect(["m1", "m2", "p1", "p2"].map(showPager)).toEqual([false, false, false, false]);
  });
});
