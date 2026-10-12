import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { FunctionFactory } from "../../src/functionsfactory";
import { ActionContainer } from "../../src/actions/container";
import { Action } from "../../src/actions/action";

function rows(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: "r" + i });
  }
  return res;
}
function createMatrix(rowCount: number, json?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({
    elements: [Object.assign({ type: "matrixdynamic", name: "matrix", rowCount: 0, rowsPerPage: 1, columns: [{ name: "id", cellType: "text" }] }, json)]
  });
  survey.data = { matrix: rows(rowCount) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
function createPanel(panelCount: number, json?: any, isDesignMode?: boolean): QuestionPanelDynamicModel {
  const survey = new SurveyModel();
  if (isDesignMode) survey.setDesignMode(true);
  survey.fromJSON({
    elements: [Object.assign({ type: "paneldynamic", name: "panel", panelsPerPage: 1, templateElements: [{ type: "text", name: "id" }] }, json)]
  });
  survey.data = { panel: rows(panelCount) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
}
const getAction = (actions: ActionContainer, id: string): Action => <Action>actions.getActionById(id);
const getSlots = (actions: ActionContainer): Array<Action> =>
  <Array<Action>>actions.actions.filter(action => action.id.indexOf("sv-pager-page-") === 0);
// The titles of the visible page number slots; "\u2026" is a gap.
const slotTitles = (actions: ActionContainer): Array<string> =>
  getSlots(actions).filter(action => action.visible).map(action => action.title);
const activeTitles = (actions: ActionContainer): Array<string> =>
  getSlots(actions).filter(action => action.visible && action.active).map(action => action.title);
const enabledOf = (actions: ActionContainer, ids: Array<string>): Array<boolean> =>
  ids.map(id => getAction(actions, id).enabled);
const moveIds = ["sv-pager-first", "sv-pager-prev", "sv-pager-next", "sv-pager-last"];

describe("Pager actions: page number slots", () => {
  test("a few pages: one slot per page, the current one active, no info or loading text", () => {
    const matrix = createMatrix(3);
    const actions = matrix.pagerActions;
    expect(slotTitles(actions), "#1").toEqual(["1", "2", "3"]);
    expect(activeTitles(actions), "#2").toEqual(["1"]);
    expect(getAction(actions, "sv-pager-info").visible, "#3: the slots show the total").toBe(false);
    expect(getAction(actions, "sv-pager-loading").visible, "#4").toBe(false);
    expect(enabledOf(actions, moveIds), "#5: the first page").toEqual([false, false, true, true]);
    expect(getAction(actions, "sv-pager-page-0").enabled, "#6: the current page stays enabled").toBe(true);
    matrix.pageIndex = 2;
    expect(activeTitles(actions), "#7").toEqual(["3"]);
    expect(enabledOf(actions, moveIds), "#8: the last page").toEqual([true, true, false, false]);
  });
  test("many pages: seven slots with gaps around the current page", () => {
    const matrix = createMatrix(20);
    const actions = matrix.pagerActions;
    const layoutAt = (pageIndex: number): Array<string> => {
      matrix.pageIndex = pageIndex;
      return slotTitles(actions);
    };
    expect(layoutAt(0), "#1: the start").toEqual(["1", "2", "3", "4", "5", "\u2026", "20"]);
    expect(layoutAt(3), "#2: still the start").toEqual(["1", "2", "3", "4", "5", "\u2026", "20"]);
    expect(layoutAt(4), "#3: two gaps").toEqual(["1", "\u2026", "4", "5", "6", "\u2026", "20"]);
    expect(layoutAt(9), "#4").toEqual(["1", "\u2026", "9", "10", "11", "\u2026", "20"]);
    expect(layoutAt(15), "#5: the last page with two gaps").toEqual(["1", "\u2026", "15", "16", "17", "\u2026", "20"]);
    expect(layoutAt(16), "#6: the end").toEqual(["1", "\u2026", "16", "17", "18", "19", "20"]);
    expect(layoutAt(19), "#7").toEqual(["1", "\u2026", "16", "17", "18", "19", "20"]);
    expect(activeTitles(actions), "#8").toEqual(["20"]);
  });
  test("a slot click moves to its page and the slots follow; a gap is not a button", () => {
    const matrix = createMatrix(20);
    const actions = matrix.pagerActions;
    getAction(actions, "sv-pager-page-4").action();
    expect(matrix.pageIndex, "#1: the slot that showed 5").toBe(4);
    expect(slotTitles(actions), "#2").toEqual(["1", "\u2026", "4", "5", "6", "\u2026", "20"]);
    expect(activeTitles(actions), "#3").toEqual(["5"]);
    const gap = getAction(actions, "sv-pager-page-1");
    expect([gap.enabled, gap.disableTabStop], "#4: the gap").toEqual([false, true]);
    expect(getAction(actions, "sv-pager-page-2").disableTabStop, "#5: a page slot keeps its tab stop").toBe(false);
    getAction(actions, "sv-pager-page-6").action();
    expect(matrix.pageIndex, "#6: the last page").toBe(19);
    expect(getAction(actions, "sv-pager-page-1").title, "#7").toBe("\u2026");
    getAction(actions, "sv-pager-page-1").action();
    expect(matrix.pageIndex, "#8: a gap does nothing").toBe(19);
  });
  test("a page count that drops hides the slots it no longer needs", () => {
    const matrix = createMatrix(9);
    const actions = matrix.pagerActions;
    expect(slotTitles(actions).length, "#1").toBe(7);
    matrix.rowsPerPage = 3;
    expect(slotTitles(actions), "#2").toEqual(["1", "2", "3"]);
  });
});

describe("Pager actions: first and last", () => {
  test("first and last move to the edges and are disabled there", () => {
    const matrix = createMatrix(10);
    const actions = matrix.pagerActions;
    const first = getAction(actions, "sv-pager-first");
    const last = getAction(actions, "sv-pager-last");
    expect([first.title, last.title], "#1: localized titles").toEqual(["First", "Last"]);
    expect([first.iconName, last.iconName], "#2").toEqual(["icon-arrowfirst-16x16", "icon-arrowlast-16x16"]);
    expect([first.hasTitle, last.hasTitle], "#3: icons, the title is the tooltip").toEqual([false, false]);
    last.action();
    expect(matrix.pageIndex, "#4").toBe(9);
    expect([first.enabled, last.enabled], "#5").toEqual([true, false]);
    first.action();
    expect(matrix.pageIndex, "#6").toBe(0);
    expect([first.enabled, last.enabled], "#7").toEqual([false, true]);
  });
});

describe("Pager actions: a move forward validates the page it leaves", () => {
  test("a slot click does not leave a page with an error", () => {
    const matrix = createMatrix(5, { columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text", isRequired: true }] });
    // The page validates the rows a renderer has built.
    expect(matrix.visibleRows.length, "#0: the page is shown").toBe(1);
    const actions = matrix.pagerActions;
    getAction(actions, "sv-pager-page-2").action();
    expect(matrix.pageIndex, "#1: the required cell is empty").toBe(0);
    getAction(actions, "sv-pager-last").action();
    expect(matrix.pageIndex, "#2: nor does last").toBe(0);
  });
  test("every move item is disabled while a page waits for an asynchronous validator", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("pagerSlotAsyncFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const matrix = createMatrix(5, {
        columns: [{ name: "id", cellType: "text", validators: [{ type: "expression", expression: "pagerSlotAsyncFunc({row.id}) = 1" }] }]
      });
      expect(matrix.visibleRows.length, "#0: the page is shown").toBe(1);
      const actions = matrix.pagerActions;
      getAction(actions, "sv-pager-page-2").action();
      expect(matrix.isPageMovePending, "#1: the move waits").toBe(true);
      expect(enabledOf(actions, moveIds), "#2").toEqual([false, false, false, false]);
      expect(getSlots(actions).filter(action => action.visible).map(action => action.enabled), "#3: no slot either").toEqual([false, false, false, false, false]);
      results.forEach(setResult => setResult(1));
      expect(matrix.pageIndex, "#4: moved").toBe(2);
      expect(enabledOf(actions, moveIds), "#5").toEqual([true, true, true, true]);
    } finally {
      FunctionFactory.Instance.unregister("pagerSlotAsyncFunc");
    }
  });
});

describe("Pager actions: the panel dynamic", () => {
  test("showPager: list mode with more than one page only", () => {
    expect(createPanel(3).showPager, "#1: list mode").toBe(true);
    expect(createPanel(1).showPager, "#2: one page").toBe(false);
    expect(createPanel(3, { panelsPerPage: 0 }).showPager, "#3: no paging").toBe(false);
    expect(createPanel(3, { displayMode: "carousel" }).showPager, "#4: carousel").toBe(false);
    expect(createPanel(3, { displayMode: "tab" }).showPager, "#5: tab").toBe(false);
    expect(createPanel(3, undefined, true).showPager, "#6: design mode").toBe(false);
  });
  test("the slots move the panel pages", () => {
    const panel = createPanel(4);
    const actions = panel.pagerActions;
    expect(slotTitles(actions), "#1").toEqual(["1", "2", "3", "4"]);
    getAction(actions, "sv-pager-page-2").action();
    expect(panel.pageIndex, "#2").toBe(2);
    expect(activeTitles(actions), "#3").toEqual(["3"]);
    getAction(actions, "sv-pager-first").action();
    expect(panel.pageIndex, "#4").toBe(0);
  });
});
