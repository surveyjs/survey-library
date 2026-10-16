import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { FunctionFactory } from "../../src/functionsfactory";
import { ActionContainer } from "../../src/actions/container";
import { Action } from "../../src/actions/action";
import { ListModel } from "../../src/list";
import { surveyLocalization } from "../../src/surveyStrings";
import { PopupDropdownViewModel } from "../../src/popup-dropdown-view-model";

function rows(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push({ id: "r" + (i + 1) });
  }
  return res;
}
// One row per page unless the json says otherwise: rowCount pages.
function createMatrix(rowCount: number, json?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({
    elements: [Object.assign({ type: "matrixdynamic", name: "matrix", rowCount: 0, pageSize: 1, columns: [{ name: "id", cellType: "text" }] }, json)]
  });
  survey.data = { matrix: rows(rowCount) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
const getAction = (actions: ActionContainer, id: string): Action => <Action>actions.getActionById(id);
const ids = (actions: ActionContainer): Array<string> => actions.actions.map(action => action.id);
const visibleIds = (actions: ActionContainer): Array<string> => actions.actions.filter(action => action.visible).map(action => action.id);
const moveIds = ["sv-pager-first", "sv-pager-prev", "sv-pager-next", "sv-pager-last"];
const enabledOf = (actions: ActionContainer, idList: Array<string>): Array<boolean> =>
  idList.map(id => getAction(actions, id).enabled);
// The page list as the respondent sees it once the dropdown opens.
function openPageList(actions: ActionContainer): ListModel {
  const page = getAction(actions, "sv-pager-page");
  page.popupModel.onShow();
  return <ListModel>page.data;
}
function pickPage(actions: ActionContainer, title: string): void {
  const list = openPageList(actions);
  list.onItemClick(list.actions.filter(item => item.title === title)[0]);
}

describe("Pager: the items and the range", () => {
  test("3 pages: prev, the page dropdown, the total and next; no first and last", () => {
    const actions = createMatrix(3).recordsBar.pagerActions;
    expect(ids(actions), "#1: every item, in order").toEqual(["sv-pager-first", "sv-pager-prev", "sv-pager-page", "sv-pager-total", "sv-pager-next", "sv-pager-last"]);
    expect(visibleIds(actions), "#2").toEqual(["sv-pager-prev", "sv-pager-page", "sv-pager-total", "sv-pager-next"]);
    expect(getAction(actions, "sv-pager-page").title, "#3: one-based").toBe("1");
    expect(getAction(actions, "sv-pager-total").title, "#4").toBe("of 3");
    expect(getAction(actions, "sv-pager-prev").enabled, "#5: the first page").toBe(false);
    expect(getAction(actions, "sv-pager-next").enabled, "#6").toBe(true);
  });
  test("the move buttons are icons with localized titles; the total is text without a tab stop", () => {
    const actions = createMatrix(12).recordsBar.pagerActions;
    const moves = moveIds.map(id => getAction(actions, id));
    expect(moves.map(action => action.title), "#1").toEqual(["First", "Previous", "Next", "Last"]);
    expect(moves.map(action => action.iconName), "#2").toEqual(["icon-chevrondoubleleft-16x16", "icon-chevronleft-16x16",
      "icon-chevronright-16x16", "icon-chevrondoubleright-16x16"]);
    expect(moves.map(action => action.hasTitle), "#3: the title is the tooltip and the accessible name").toEqual([false, false, false, false]);
    expect(moves.map(action => action.getTooltip()), "#4").toEqual(["First", "Previous", "Next", "Last"]);
    const total = getAction(actions, "sv-pager-total");
    expect([total.enabled, total.disableTabStop, total.hasTitle], "#5: the total is not a button").toEqual([false, true, true]);
    expect(total.getActionBarItemCss().indexOf("sd-pager__total") > -1, "#6: its own class restores the label colour").toBe(true);
  });
  test("the three groups: the page dropdown and next push the groups apart; the dropdown is secondary", () => {
    const actions = createMatrix(12).recordsBar.pagerActions;
    expect(actions.actions.filter(action => action.needSpace).map(action => action.id), "#1").toEqual(["sv-pager-page", "sv-pager-next"]);
    const css = getAction(actions, "sv-pager-page").getActionBarItemCss();
    expect(css.indexOf("sd-pager__page") > -1, "#2: the chevron after the label").toBe(true);
    expect(css.indexOf("sd-action--secondary") > -1, "#3").toBe(true);
    expect(css.indexOf("sd-action--x-small") > -1, "#4").toBe(true);
    expect(getAction(actions, "sv-pager-next").getActionBarItemCss().indexOf("sd-action--tertiary") > -1, "#5").toBe(true);
    expect(getAction(actions, "sv-pager-page").iconName, "#6").toBe("icon-chevrondown-16x16");
  });
  test("the range boundary: 9 pages have no first and last, 10 pages have both", () => {
    expect(visibleIds(createMatrix(9).recordsBar.pagerActions).filter(id => moveIds.indexOf(id) > -1), "#1: 9 pages").toEqual(["sv-pager-prev", "sv-pager-next"]);
    expect(visibleIds(createMatrix(10).recordsBar.pagerActions).filter(id => moveIds.indexOf(id) > -1), "#2: 10 pages").toEqual(moveIds);
  });
  test("the range follows a page size change: first and last show and hide together", () => {
    const matrix = createMatrix(12);
    const actions = matrix.recordsBar.pagerActions;
    const edges = (): Array<boolean> => [getAction(actions, "sv-pager-first").visible, getAction(actions, "sv-pager-last").visible];
    expect(edges(), "#1: 12 pages").toEqual([true, true]);
    matrix.pageSize = 2;
    expect(edges(), "#2: 6 pages").toEqual([false, false]);
    expect(getAction(actions, "sv-pager-total").title, "#3").toBe("of 6");
    matrix.pageSize = 1;
    expect(edges(), "#4: 12 pages again").toEqual([true, true]);
  });
  test("12 pages: the moves are disabled on the edges, enabled between them; first and last move to the edges", () => {
    const matrix = createMatrix(12);
    const actions = matrix.recordsBar.pagerActions;
    expect(enabledOf(actions, moveIds), "#1: page 1").toEqual([false, false, true, true]);
    getAction(actions, "sv-pager-last").action();
    expect(matrix.pageIndex, "#2: last").toBe(11);
    expect(getAction(actions, "sv-pager-page").title, "#3").toBe("12");
    expect(enabledOf(actions, moveIds), "#4: page 12").toEqual([true, true, false, false]);
    matrix.pageIndex = 4;
    expect(enabledOf(actions, moveIds), "#5: page 5").toEqual([true, true, true, true]);
    getAction(actions, "sv-pager-first").action();
    expect(matrix.pageIndex, "#6: first").toBe(0);
    getAction(actions, "sv-pager-next").action();
    expect(matrix.pageIndex, "#7: next").toBe(1);
    getAction(actions, "sv-pager-prev").action();
    expect(matrix.pageIndex, "#8: prev").toBe(0);
  });
});

describe("Pager: the page dropdown", () => {
  test("its list is built on open: every page, the current one selected; a pick moves there", () => {
    const matrix = createMatrix(12);
    const actions = matrix.recordsBar.pagerActions;
    const page = getAction(actions, "sv-pager-page");
    const list = <ListModel>page.data;
    expect(list.actions.length, "#1: nothing is built before the list opens").toBe(0);
    matrix.pageIndex = 2;
    openPageList(actions);
    expect(list.actions.map(item => item.title), "#2").toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);
    expect(list.selectedItem.title, "#3: the current page").toBe("3");
    expect(list.showFilter, "#4: from pagerEdgeMinPageCount pages the page number can be typed").toBe(true);
    pickPage(actions, "7");
    expect(matrix.pageIndex, "#5").toBe(6);
    expect(page.title, "#6").toBe("7");
    expect(page.ariaLabel, "#7: the accessible name says the total").toBe("Page 7 of 12");
    openPageList(actions);
    expect(list.selectedItem.title, "#8: the list opens on the current page").toBe("7");
  });
  test("the page title follows every move", () => {
    const matrix = createMatrix(12);
    const page = getAction(matrix.recordsBar.pagerActions, "sv-pager-page");
    matrix.nextPage();
    expect([page.title, page.ariaLabel], "#1").toEqual(["2", "Page 2 of 12"]);
    matrix.pageIndex = 11;
    expect([page.title, page.ariaLabel], "#2").toEqual(["12", "Page 12 of 12"]);
  });
  test("a forward pick blocked by a required cell leaves the page and the title; a later move still updates the title", () => {
    const matrix = createMatrix(12, { columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text", isRequired: true }] });
    // The page validates the rows a renderer has built.
    expect(matrix.visibleRows.length, "#0: the page is shown").toBe(1);
    const actions = matrix.recordsBar.pagerActions;
    const page = getAction(actions, "sv-pager-page");
    pickPage(actions, "7");
    expect(matrix.pageIndex, "#1: the required cell is empty").toBe(0);
    expect(page.title, "#2: the button shows the page the question is on").toBe("1");
    expect((<ListModel>page.data).selectedItem.title, "#3: the list was picked from").toBe("7");
    matrix.visibleRows[0].getQuestionByName("a").value = "x";
    getAction(actions, "sv-pager-next").action();
    expect(matrix.pageIndex, "#4").toBe(1);
    expect(page.title, "#5: the title is still owned by the pager state").toBe("2");
  });
});

describe("Pager: a move forward validates the page it leaves", () => {
  test("next, last and a pick do not leave a page with an error; a move back does", () => {
    const matrix = createMatrix(12, { columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text", isRequired: true }] });
    expect(matrix.visibleRows.length, "#0: the page is shown").toBe(1);
    const actions = matrix.recordsBar.pagerActions;
    getAction(actions, "sv-pager-next").action();
    expect(matrix.pageIndex, "#1: next").toBe(0);
    getAction(actions, "sv-pager-last").action();
    expect(matrix.pageIndex, "#2: last").toBe(0);
    pickPage(actions, "3");
    expect(matrix.pageIndex, "#3: a pick").toBe(0);
    matrix.pageIndex = 5;
    expect(matrix.visibleRows.length, "#4: the page is shown").toBe(1);
    getAction(actions, "sv-pager-first").action();
    expect(matrix.pageIndex, "#5: a move back does not validate").toBe(0);
  });
  test("every move item and the dropdown are disabled while a page waits for an asynchronous validator", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("pagerAsyncValidatorFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const matrix = createMatrix(12, {
        columns: [{ name: "id", cellType: "text", validators: [{ type: "expression", expression: "pagerAsyncValidatorFunc({row.id}) = 1" }] }]
      });
      expect(matrix.visibleRows.length, "#0: the page is shown").toBe(1);
      const actions = matrix.recordsBar.pagerActions;
      matrix.pageIndex = 4;
      expect(matrix.visibleRows.length, "#0: the page is shown").toBe(1);
      expect(enabledOf(actions, moveIds.concat(["sv-pager-page"])), "#1: page 5").toEqual([true, true, true, true, true]);
      pickPage(actions, "9");
      expect(matrix.isPageMovePending, "#2: the pick waits").toBe(true);
      expect(enabledOf(actions, moveIds.concat(["sv-pager-page"])), "#3: nothing can be moved meanwhile").toEqual([false, false, false, false, false]);
      expect(getAction(actions, "sv-pager-page").title, "#4: not moved yet").toBe("5");
      results.forEach(setResult => setResult(1));
      expect(matrix.pageIndex, "#5: moved").toBe(8);
      expect(getAction(actions, "sv-pager-page").title, "#6").toBe("9");
      expect(enabledOf(actions, moveIds.concat(["sv-pager-page"])), "#7").toEqual([true, true, true, true, true]);
    } finally {
      FunctionFactory.Instance.unregister("pagerAsyncValidatorFunc");
    }
  });
});

describe("Pager: the locale", () => {
  test("a locale change updates the move titles, the total text and the accessible name of the dropdown", () => {
    surveyLocalization.locales["pagerxx"] = {
      pageFirstText: "Erst", pagePrevText: "Zurueck", pageNextText: "Weiter", pageLastText: "Letzt",
      pagerTotalText: "von {0}", progressText: "Seite {0} von {1}"
    };
    try {
      const matrix = createMatrix(12);
      const actions = matrix.recordsBar.pagerActions;
      const texts = (): Array<string> => moveIds.map(id => getAction(actions, id).title)
        .concat([getAction(actions, "sv-pager-total").title, getAction(actions, "sv-pager-page").ariaLabel]);
      expect(texts(), "#1").toEqual(["First", "Previous", "Next", "Last", "of 12", "Page 1 of 12"]);
      (<SurveyModel>matrix.survey).locale = "pagerxx";
      expect(texts(), "#2").toEqual(["Erst", "Zurueck", "Weiter", "Letzt", "von 12", "Seite 1 von 12"]);
      (<SurveyModel>matrix.survey).locale = "";
      expect(texts(), "#3").toEqual(["First", "Previous", "Next", "Last", "of 12", "Page 1 of 12"]);
    } finally {
      delete surveyLocalization.locales["pagerxx"];
    }
  });
});

describe("Pager: the page list on a phone is a sheet", () => {
  // Taps the dropdown as the renderer does: the popup takes its mode, then shows.
  function openSheet(actions: ActionContainer): ListModel {
    const page = getAction(actions, "sv-pager-page");
    page.action(page, true);
    return openPageList(actions);
  }
  const pick = (list: ListModel, title: string): void => list.onItemClick(list.actions.filter(item => item.title === title)[0]);
  test("the sheet: a title, a close button and Apply instead of Cancel; a pick waits for Apply", () => {
    const matrix = createMatrix(12);
    matrix.survey.setIsMobile(true);
    const actions = matrix.recordsBar.pagerActions;
    const popup = getAction(actions, "sv-pager-page").popupModel;
    const list = openSheet(actions);
    expect([popup.isVisible, popup.getDisplayMode(), popup.title, popup.showCloseButton, popup.cssClass, popup.isFocusedContent], "#1: no keyboard until the filter is tapped")
      .toEqual([true, "menu-overlay", "Select Page", true, "sv-popup--sheet", false]);
    const viewModel = new PopupDropdownViewModel(popup);
    expect([viewModel.showHeader, viewModel.popupHeaderTemplate, viewModel.showFooter], "#2: the close button, the footer")
      .toEqual([true, "popup-close-button", true]);
    expect(viewModel.footerToolbar.actions.map(item => [item.id, item.title]), "#3").toEqual([["sv-pager-apply", "Apply"]]);
    pick(list, "7");
    expect([matrix.pageIndex, list.selectedItem.title, popup.isVisible], "#4: the pick is marked, the sheet stays").toEqual([0, "7", true]);
    viewModel.footerToolbar.actions[0].action();
    expect([matrix.pageIndex, popup.isVisible], "#5: Apply moves and closes the sheet").toEqual([6, false]);
    viewModel.dispose();
  });
  test("closing the sheet drops the pick; the desktop list moves on a pick again", () => {
    const matrix = createMatrix(12);
    matrix.survey.setIsMobile(true);
    const actions = matrix.recordsBar.pagerActions;
    const popup = getAction(actions, "sv-pager-page").popupModel;
    let list = openSheet(actions);
    pick(list, "7");
    popup.hide();
    list = openSheet(actions);
    expect([matrix.pageIndex, list.selectedItem.title], "#1: the sheet opens on the current page").toEqual([0, "1"]);
    popup.hide();
    matrix.survey.setIsMobile(false);
    list = openSheet(actions);
    expect([popup.getDisplayMode(), popup.title, popup.showCloseButton, popup.cssClass, popup.isFocusedContent], "#2").toEqual(["menu-popup", "", false, "", true]);
    pick(list, "7");
    expect([matrix.pageIndex, popup.isVisible], "#3").toEqual([6, false]);
  });
  test("the list shows its filter from pagerEdgeMinPageCount pages", () => {
    expect(openPageList(createMatrix(9).recordsBar.pagerActions).showFilter, "#1").toBe(false);
    expect(openPageList(createMatrix(10).recordsBar.pagerActions).showFilter, "#2").toBe(true);
  });
});
