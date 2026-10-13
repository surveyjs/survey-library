import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionRecordsBar } from "../../src/question_records_bar";
import { QuestionTextModel } from "../../src/question_text";
import { ListModel } from "../../src/list";
import { surveyLocalization } from "../../src/surveyStrings";

const people = [{ name: "c" }, { name: "a" }, { name: "d" }, { name: "b" }];
function createPanel(json?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "paneldynamic", name: "panel", allowSortPanels: true, panelsPerPage: 2,
    templateElements: [{ type: "text", name: "name", title: "Name" }]
  }, json)] });
  survey.data = { panel: people.map(item => Object.assign({}, item)) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
}
function createMatrix(json?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", rowCount: 0, allowSortRows: true, sortMenuVisibility: "always", rowsPerPage: 2,
    columns: [{ name: "name", cellType: "text" }]
  }, json)] });
  survey.data = { matrix: people.map(item => Object.assign({}, item)) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
// The bar's containers before their first read; private, read here to show they were never built.
const builtContainers = (bar: QuestionRecordsBar): Array<boolean> => [!!(<any>bar).viewActionsValue, !!(<any>bar).pagerActionsValue];
const barState = (bar: QuestionRecordsBar): Array<boolean> => [bar.showViewActions, bar.showPager, bar.isVisible];

describe("Records bar: the object", () => {
  test("created once, on first read, and disposed with the question with both containers", () => {
    const panel = createPanel();
    const bar = panel.recordsBar;
    expect(panel.recordsBar, "#1").toBe(bar);
    const viewActions = bar.viewActions;
    const pagerActions = bar.pagerActions;
    panel.dispose();
    expect([bar.isDisposed, viewActions.isDisposed, pagerActions.isDisposed], "#2").toEqual([true, true, true]);
  });
  test("reading the sort fields or changing the template before the bar exists creates no bar", () => {
    const panel = createPanel();
    expect(panel.sortFields.length, "#1").toBe(1);
    panel.template.addElement(new QuestionTextModel("city"));
    panel.sortBy = "city";
    panel.allowSortPanels = false;
    expect((<any>panel).recordsBarValue, "#2").toBeUndefined();
  });
  test("cssClasses gives each question's class names", () => {
    expect(createPanel().recordsBar.cssClasses, "#1").toEqual({
      root: "sd-paneldynamic__records-bar", viewActions: "sd-paneldynamic__view-actions", pager: "sd-paneldynamic__pager" });
    expect(createMatrix().recordsBar.cssClasses, "#2").toEqual({
      root: "sd-matrixdynamic__records-bar", viewActions: "sd-matrixdynamic__view-actions", pager: "sd-matrixdynamic__pager" });
  });
});

describe("Records bar: what shows on the first read", () => {
  test("a panel that pages and does not sort: the pager, and no sort container built", () => {
    const bar = createPanel({ allowSortPanels: false }).recordsBar;
    expect(barState(bar), "#1").toEqual([false, true, true]);
    expect(builtContainers(bar), "#2").toEqual([false, false]);
  });
  test("a panel that sorts and does not page: the sort menu, and no container built", () => {
    const bar = createPanel({ panelsPerPage: 0 }).recordsBar;
    expect(barState(bar), "#1").toEqual([true, false, true]);
    expect(builtContainers(bar), "#2").toEqual([false, false]);
  });
  test("the containers built later show the current state", () => {
    const panel = createPanel();
    panel.sortBy = "name-";
    const bar = panel.recordsBar;
    expect(bar.viewActions.getActionById("sv-sort-by").title, "#1").toBe("Sort by: Name");
    expect(bar.pagerActions.getActionById("sv-pager-page-1").title, "#2").toBe("2");
  });
});

describe("Records bar: isVisible follows the sort menu and the pager", () => {
  test("a panel: neither, sort only, pager only, both; tab mode keeps the sort and loses the pager", () => {
    expect(barState(createPanel({ allowSortPanels: false, panelsPerPage: 0 }).recordsBar), "#1: neither").toEqual([false, false, false]);
    expect(barState(createPanel({ panelsPerPage: 0 }).recordsBar), "#2: sort only").toEqual([true, false, true]);
    expect(barState(createPanel({ allowSortPanels: false }).recordsBar), "#3: pager only").toEqual([false, true, true]);
    const panel = createPanel();
    const bar = panel.recordsBar;
    expect(barState(bar), "#4: both").toEqual([true, true, true]);
    panel.displayMode = "tab";
    expect(barState(bar), "#5: tab mode").toEqual([true, false, true]);
    panel.displayMode = "list";
    expect(barState(bar), "#6").toEqual([true, true, true]);
  });
  test("a matrix: neither, sort only, pager only, both", () => {
    expect(barState(createMatrix({ allowSortRows: false, rowsPerPage: 0 }).recordsBar), "#1: neither").toEqual([false, false, false]);
    expect(barState(createMatrix({ rowsPerPage: 0 }).recordsBar), "#2: sort only").toEqual([true, false, true]);
    expect(barState(createMatrix({ allowSortRows: false }).recordsBar), "#3: pager only").toEqual([false, true, true]);
    expect(barState(createMatrix().recordsBar), "#4: both").toEqual([true, true, true]);
  });
  test("showPager follows a page size change and a record count change", () => {
    const panel = createPanel({ allowSortPanels: false });
    const bar = panel.recordsBar;
    expect(bar.showPager, "#1").toBe(true);
    panel.panelsPerPage = 0;
    expect(bar.showPager, "#2: no paging").toBe(false);
    panel.panelsPerPage = 3;
    expect(bar.showPager, "#3: two pages").toBe(true);
    panel.removePanel(panel.panels[0]);
    expect(bar.showPager, "#4: one page left").toBe(false);
    const matrix = createMatrix({ allowSortRows: false });
    const matrixBar = matrix.recordsBar;
    matrix.rowsPerPage = 4;
    expect(matrixBar.showPager, "#5: the matrix, one page").toBe(false);
    matrix.addRow();
    expect(matrixBar.showPager, "#6: a row added").toBe(true);
  });
});

describe("Records bar: the sort lists' localization owner", () => {
  test("a sort level's list keeps the question as its owner; an item title follows a locale change", () => {
    surveyLocalization.locales["barxx"] = { sortDefaultOrderText: "As entered", sortNoneText: "Nothing" };
    try {
      const panel = createPanel();
      panel.sortBy = "name";
      const lists = [0, 1].map(level => <ListModel>panel.recordsBar.viewActions.actions[level].data);
      expect(lists.map(list => list.locOwner === panel), "#1").toEqual([true, true]);
      panel.survey.locale = "barxx";
      expect(lists.map(list => list.actions[0].title), "#2").toEqual(["As entered", "Nothing"]);
    } finally {
      delete surveyLocalization.locales["barxx"];
    }
  });
});
