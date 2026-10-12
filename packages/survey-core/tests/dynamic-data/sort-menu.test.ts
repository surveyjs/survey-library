import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionTextModel } from "../../src/question_text";
import { FunctionFactory } from "../../src/functionsfactory";
import { Action, IAction } from "../../src/actions/action";
import { ListModel } from "../../src/list";
import { surveyLocalization } from "../../src/surveyStrings";
import "../../src/question_html";
import "../../src/question_checkbox";
import "../../src/question_expression";
import "../../src/question_imagepicker";

const people = [{ name: "c", age: 30 }, { name: "a", age: 10 }, { name: "d", age: 40 }, { name: "b", age: 20 }];
function createPanel(json?: any, data?: Array<any>, isDesignMode?: boolean): QuestionPanelDynamicModel {
  const survey = new SurveyModel();
  if (isDesignMode) survey.setDesignMode(true);
  survey.fromJSON({
    elements: [Object.assign({
      type: "paneldynamic", name: "panel", allowSortPanels: true, panelsPerPage: 2,
      templateElements: [{ type: "text", name: "name", title: "Name" }, { type: "text", name: "age", inputType: "number" }]
    }, json)]
  });
  if (data !== null) {
    survey.data = { panel: (data || people).map(item => Object.assign({}, item)) };
  }
  return <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
}
function createMatrix(json?: any, isMobile: boolean = true): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({
    elements: [Object.assign({
      type: "matrixdynamic", name: "matrix", rowCount: 0, allowSortRows: true, rowsPerPage: 2,
      columns: [{ name: "name", title: "Name", cellType: "text" }, { name: "age", cellType: "text" }]
    }, json)]
  });
  survey.data = { matrix: people.map(item => Object.assign({}, item)) };
  if (isMobile) survey.setIsMobile(true);
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
const getSortItem = (q: QuestionPanelDynamicModel | QuestionMatrixDynamicModel): Action => <Action>q.viewActions.getActionById("sv-sort-by");
const getList = (q: QuestionPanelDynamicModel | QuestionMatrixDynamicModel): ListModel => <ListModel>getSortItem(q).data;
const listTitles = (q: QuestionPanelDynamicModel | QuestionMatrixDynamicModel): Array<string> => getList(q).actions.map(item => item.title);
const selectedTitle = (q: QuestionPanelDynamicModel | QuestionMatrixDynamicModel): string => getList(q).selectedItem?.title;
// A pick the way a click makes it: the list selects the item and calls the selection callback.
function pick(q: QuestionPanelDynamicModel | QuestionMatrixDynamicModel, title: string): void {
  const list = getList(q);
  list.onItemClick(<Action>list.actions.filter((item: IAction) => item.title === title)[0]);
}
// What the menu button shows: its title, its icon and its accessible name.
const menuState = (q: QuestionPanelDynamicModel | QuestionMatrixDynamicModel): Array<string> => {
  const item = getSortItem(q);
  return [item.title, item.iconName, item.ariaLabel];
};
const panelNames = (q: QuestionPanelDynamicModel): Array<string> => q.panels.map(p => p.getQuestionByName("name").value);

describe("Sort menu: the matrix columns follow isValueSortable", () => {
  test("a checkbox and a file column are not sortable, a text column is", () => {
    const matrix = createMatrix({ columns: [
      { name: "t", cellType: "text" }, { name: "ch", cellType: "checkbox", choices: [1, 2] }, { name: "f", cellType: "file" }
    ] });
    expect(matrix.columns.map(column => column.isSortable)).toEqual([true, false, false]);
  });
});

describe("Sort menu: sortFields", () => {
  test("a panel: the sortable questions of the template, nested panels included", () => {
    const panel = createPanel({ templateElements: [
      { type: "text", name: "name", title: "Name of {panel.kind}" },
      { type: "html", name: "note", html: "<b>x</b>" },
      { type: "checkbox", name: "tags", choices: [1, 2] },
      { type: "expression", name: "total", expression: "1 + 1", title: "{panelIndex}" },
      { type: "text", name: "secret", visible: false },
      { type: "panel", name: "inner", elements: [{ type: "text", name: "city", title: "City" }, { type: "text", name: "town", valueName: "city" }] },
      { type: "panel", name: "hiddenInner", visible: false, elements: [{ type: "text", name: "zip" }] },
      { type: "text", name: "maybe", visibleIf: "{panel.name} = 'a'" }
    ] });
    expect(panel.sortFields).toEqual([
      { field: "name", title: "Name of" },
      { field: "total", title: "total" },
      { field: "city", title: "City" },
      { field: "maybe", title: "maybe" }
    ]);
  });
  test("a matrix: the sortable visible columns in column order, with their header text", () => {
    const matrix = createMatrix({ columns: [
      { name: "a", title: "Alpha", cellType: "text" },
      { name: "tags", cellType: "checkbox", choices: [1] },
      { name: "b", cellType: "dropdown", choices: [1] },
      { name: "hid", cellType: "text", visible: false },
      { name: "c", cellType: "text", allowSort: false },
      { name: "d", title: "Delta", cellType: "text", valueName: "dd" }
    ] });
    expect(matrix.sortFields).toEqual([
      { field: "a", title: "Alpha" }, { field: "b", title: "b" }, { field: "dd", title: "Delta" }
    ]);
  });
});

describe("Sort menu: setSortByUser", () => {
  test("a direction sorts, an undefined one clears, and the whole sort is replaced", () => {
    const panel = createPanel({ panelsPerPage: 0 });
    panel.sortBy = "age-;name";
    expect(panel.setSortByUser("name", "asc"), "#1").toBe(true);
    expect(panel.sortBy, "#2: the tie-breaker is dropped").toBe("name");
    expect(panelNames(panel), "#3").toEqual(["a", "b", "c", "d"]);
    panel.setSortByUser("name", "desc");
    expect(panelNames(panel), "#4").toEqual(["d", "c", "b", "a"]);
    panel.setSortByUser("name");
    expect([panel.sortBy, panelNames(panel)], "#5").toEqual(["", ["c", "a", "d", "b"]]);
  });
  test("a re-pick of the active sort reorders a view an edit froze", () => {
    const panel = createPanel({ panelsPerPage: 0 });
    panel.setSortByUser("name", "asc");
    panel.panels[0].getQuestionByName("name").value = "z";
    expect(panelNames(panel), "#1: the edit does not move the panel").toEqual(["z", "b", "c", "d"]);
    panel.setSortByUser("name", "asc");
    expect(panelNames(panel), "#2: the same sort is applied again").toEqual(["b", "c", "d", "z"]);
  });
  test("a sort change keeps the page index: the page shows the records the new order puts there", () => {
    const panel = createPanel();
    panel.pageIndex = 1;
    panel.setSortByUser("name", "asc");
    expect([panel.pageIndex, panelNames(panel)], "#1").toEqual([1, ["c", "d"]]);
    panel.toggleSort("name");
    expect([panel.pageIndex, panelNames(panel)], "#2: as a header click does").toEqual([1, ["b", "a"]]);
  });
  test("a page with an error blocks the pick", () => {
    const panel = createPanel({ templateElements: [{ type: "text", name: "name" }, { type: "text", name: "req", isRequired: true }] });
    expect(panel.panels.length, "#0: the page is shown").toBe(2);
    expect(panel.setSortByUser("name", "asc"), "#1").toBe(false);
    expect([panel.sortBy, panelNames(panel)], "#2").toEqual(["", ["c", "a"]]);
  });
  test("a pending asynchronous validator holds the pick until it settles", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("sortMenuAsyncFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const panel = createPanel({ templateElements: [
        { type: "text", name: "name", validators: [{ type: "expression", expression: "sortMenuAsyncFunc({panel.name}) = 1" }] }
      ] });
      expect(panel.panels.length, "#0: the page is shown").toBe(2);
      expect(panel.setSortByUser("name", "asc"), "#1: waiting is not an error").toBe(true);
      expect([panel.isPageMovePending, panel.sortBy], "#2").toEqual([true, ""]);
      results.forEach(setResult => setResult(1));
      expect([panel.isPageMovePending, panel.sortBy, panelNames(panel)], "#3").toEqual([false, "name", ["a", "b"]]);
    } finally {
      FunctionFactory.Instance.unregister("sortMenuAsyncFunc");
    }
  });
});

describe("Sort menu: when the item shows", () => {
  test("a panel: the opt-in, design mode, sortable fields; read-only shows it", () => {
    expect(getSortItem(createPanel()).visible, "#1").toBe(true);
    expect(createPanel().showViewActions, "#2").toBe(true);
    const off = createPanel({ allowSortPanels: false });
    expect([getSortItem(off).visible, off.showViewActions], "#3: the opt-in is off").toEqual([false, false]);
    off.allowSortPanels = true;
    expect([getSortItem(off).visible, off.showViewActions], "#4: switched on").toEqual([true, true]);
    expect(getSortItem(createPanel(undefined, undefined, true)).visible, "#5: design mode").toBe(false);
    const noFields = createPanel({ templateElements: [{ type: "html", name: "h" }, { type: "checkbox", name: "c", choices: [1] }] });
    expect(getSortItem(noFields).visible, "#6: nothing to sort by").toBe(false);
    expect(getSortItem(createPanel({ readOnly: true })).visible, "#7: read-only").toBe(true);
  });
  test("a matrix: only on a phone, where the header is hidden", () => {
    const matrix = createMatrix(undefined, false);
    expect([getSortItem(matrix).visible, matrix.showViewActions], "#1: the header sorts on a desktop").toEqual([false, false]);
    matrix.isMobile = true;
    expect([getSortItem(matrix).visible, matrix.showViewActions], "#2").toEqual([true, true]);
    matrix.isMobile = false;
    expect(getSortItem(matrix).visible, "#3").toBe(false);
    matrix.displayMode = "list";
    expect(getSortItem(matrix).visible, "#4: the list display mode is the mobile one").toBe(true);
    matrix.allowSortRows = false;
    expect(getSortItem(matrix).visible, "#5: the opt-in is off").toBe(false);
  });
  test("disabled while a page move waits", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("sortMenuMoveFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const panel = createPanel({ templateElements: [
        { type: "text", name: "name", validators: [{ type: "expression", expression: "sortMenuMoveFunc({panel.name}) = 1" }] }
      ] });
      expect(panel.panels.length, "#0: the page is shown").toBe(2);
      expect(getSortItem(panel).enabled, "#1").toBe(true);
      panel.nextPage();
      expect([panel.isPageMovePending, getSortItem(panel).enabled], "#2").toEqual([true, false]);
      results.forEach(setResult => setResult(1));
      expect([panel.pageIndex, getSortItem(panel).enabled], "#3").toEqual([1, true]);
    } finally {
      FunctionFactory.Instance.unregister("sortMenuMoveFunc");
    }
  });
});

describe("Sort menu: what the item shows", () => {
  test("after a pick, from JSON, from code and after clearSort", () => {
    const panel = createPanel();
    expect(menuState(panel), "#1: no sort").toEqual(["Sort by", undefined, "Sort by"]);
    expect(selectedTitle(panel), "#2").toBe("Default order");
    pick(panel, "Name");
    expect(menuState(panel), "#3").toEqual(["Sort by: Name", "icon-chevronup-16x16", "Sort by Name, ascending"]);
    expect(getSortItem(panel).tooltip, "#4: the tooltip carries the same text").toBe("Sort by Name, ascending");
    expect(selectedTitle(panel), "#5").toBe("Name");
    panel.sortOrder = [{ field: "age", direction: "desc" }];
    expect(menuState(panel), "#6: from code").toEqual(["Sort by: age", "icon-chevrondown-16x16", "Sort by age, descending"]);
    expect(selectedTitle(panel), "#7").toBe("age");
    panel.clearSort();
    expect(menuState(panel), "#8").toEqual(["Sort by", undefined, "Sort by"]);
    expect(selectedTitle(panel), "#9").toBe("Default order");
    const fromJson = createPanel({ sortBy: "name-" });
    expect(menuState(fromJson), "#10: from JSON").toEqual(["Sort by: Name", "icon-chevrondown-16x16", "Sort by Name, descending"]);
    expect(selectedTitle(fromJson), "#11").toBe("Name");
  });
  test("a sort by a field the menu does not offer shows the field name; a multi-field sort its first field", () => {
    const panel = createPanel();
    panel.sortBy = "unknown";
    expect(menuState(panel), "#1").toEqual(["Sort by: unknown", "icon-chevronup-16x16", "Sort by unknown, ascending"]);
    expect(selectedTitle(panel), "#2: nothing in the list is active").toBeUndefined();
    panel.sortBy = "age-;name";
    expect([getSortItem(panel).title, selectedTitle(panel)], "#3").toEqual(["Sort by: age", "age"]);
    pick(panel, "Name");
    expect(panel.sortBy, "#4: a pick replaces the whole sort").toBe("name");
  });
  test("a locale change without a sort change", () => {
    surveyLocalization.locales["sortxx"] = {
      sortByText: "Order by", sortByFieldText: "Order by: {0}", sortDefaultOrderText: "As entered",
      sortAscendingText: "up", sortDescendingText: "down"
    };
    try {
      const panel = createPanel({ templateElements: [{ type: "text", name: "name", title: { default: "Name", sortxx: "Label" } }] });
      panel.sortBy = "name-";
      expect(listTitles(panel), "#1").toEqual(["Default order", "Name"]);
      panel.survey.locale = "sortxx";
      expect([getSortItem(panel).title, getSortItem(panel).ariaLabel], "#2").toEqual(["Order by: Label", "Order by Label, down"]);
      expect(listTitles(panel), "#3").toEqual(["As entered", "Label"]);
      expect(selectedTitle(panel), "#4").toBe("Label");
      panel.survey.locale = "";
      expect(getSortItem(panel).title, "#5").toBe("Sort by: Name");
    } finally {
      delete surveyLocalization.locales["sortxx"];
    }
  });
});

describe("Sort menu: a rejected pick leaves the committed sort", () => {
  test("an error found at once", () => {
    const panel = createPanel({ templateElements: [{ type: "text", name: "name", title: "Name" }, { type: "text", name: "req", isRequired: true }] });
    panel.sortBy = "name";
    expect(panel.panels.length, "#0: the page is shown").toBe(2);
    pick(panel, "req");
    expect(panel.sortBy, "#1").toBe("name");
    expect(menuState(panel), "#2").toEqual(["Sort by: Name", "icon-chevronup-16x16", "Sort by Name, ascending"]);
    expect(selectedTitle(panel), "#3").toBe("Name");
  });
  test("an asynchronous validator: held, then rejected, then accepted", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("sortMenuPickFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const panel = createPanel({ templateElements: [
        { type: "text", name: "name", title: "Name", validators: [{ type: "expression", expression: "sortMenuPickFunc({panel.name}) = 1" }] },
        { type: "text", name: "age" }
      ] });
      expect(panel.panels.length, "#0: the page is shown").toBe(2);
      pick(panel, "age");
      expect(panel.sortBy, "#1: held").toBe("");
      expect(menuState(panel), "#2").toEqual(["Sort by", undefined, "Sort by"]);
      expect(selectedTitle(panel), "#3").toBe("Default order");
      expect(getSortItem(panel).enabled, "#4: disabled while it waits").toBe(false);
      results.splice(0).forEach(setResult => setResult(0));
      expect([panel.sortBy, getSortItem(panel).title, selectedTitle(panel), getSortItem(panel).enabled], "#5: rejected").toEqual(
        ["", "Sort by", "Default order", true]);
      // The rejected answers are kept for the values they were given: the respondent fixes them.
      panel.panels[0].getQuestionByName("name").value = "x";
      panel.panels[1].getQuestionByName("name").value = "y";
      results.splice(0);
      pick(panel, "age");
      expect(getSortItem(panel).enabled, "#6: waits again").toBe(false);
      results.splice(0).forEach(setResult => setResult(1));
      expect([panel.sortBy, getSortItem(panel).title, selectedTitle(panel)], "#7: accepted").toEqual(["age", "Sort by: age", "age"]);
      expect(getSortItem(panel).enabled, "#8").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("sortMenuPickFunc");
    }
  });
});

describe("Sort menu: the candidates change", () => {
  test("a panel: a question added, removed, retyped and retitled", () => {
    const panel = createPanel({ templateElements: [{ type: "html", name: "h" }, { type: "imagepicker", name: "pic", multiSelect: true, choices: [{ value: "a", imageLink: "a.png" }] }] });
    const item = getSortItem(panel);
    expect([item.visible, panel.showViewActions], "#1: nothing to sort by").toEqual([false, false]);
    const text = new QuestionTextModel("added");
    panel.template.addElement(text);
    expect([item.visible, panel.showViewActions], "#2: no popup was opened").toEqual([true, true]);
    expect(listTitles(panel), "#3").toEqual(["Default order", "added"]);
    text.title = "Added";
    expect(listTitles(panel), "#4: a title change").toEqual(["Default order", "Added"]);
    panel.template.removeElement(text);
    expect([item.visible, panel.showViewActions], "#5").toEqual([false, false]);
    (<any>panel.template.getQuestionByName("pic")).multiSelect = false;
    expect([item.visible, listTitles(panel)], "#6: one image is a value").toEqual([true, ["Default order", "pic"]]);
  });
  test("a panel without panels yet", () => {
    const panel = createPanel({ panelCount: 0, templateElements: [{ type: "html", name: "h" }] }, null);
    expect(panel.panelCount, "#0").toBe(0);
    const item = getSortItem(panel);
    expect(item.visible, "#1").toBe(false);
    const html = panel.template.getQuestionByName("h");
    panel.template.addElement(new QuestionTextModel("q1"));
    expect(item.visible, "#2").toBe(true);
    panel.template.getQuestionByName("q1").title = "First";
    expect(listTitles(panel), "#3").toEqual(["Default order", "First"]);
    panel.template.getQuestionByName("q1").visible = false;
    expect(item.visible, "#4: hidden in the template").toBe(false);
    expect(html.isValueSortable, "#5").toBe(false);
  });
  test("a nested template panel", () => {
    const panel = createPanel({ templateElements: [{ type: "html", name: "h" }, { type: "panel", name: "inner" }] });
    const inner = <any>panel.template.getElementByName("inner");
    expect(getSortItem(panel).visible, "#1").toBe(false);
    const q = new QuestionTextModel("city");
    inner.addElement(q);
    expect([getSortItem(panel).visible, listTitles(panel)], "#2").toEqual([true, ["Default order", "city"]]);
    inner.removeElement(q);
    expect(getSortItem(panel).visible, "#3").toBe(false);
  });
  test("a matrix: a column added, hidden and made a checkbox", () => {
    const matrix = createMatrix({ columns: [{ name: "f", cellType: "file" }] });
    const item = getSortItem(matrix);
    expect([item.visible, matrix.showViewActions], "#1").toEqual([false, false]);
    const column = matrix.addColumn("name", "Name");
    column.cellType = "text";
    expect([item.visible, listTitles(matrix)], "#2").toEqual([true, ["Default order", "Name"]]);
    column.title = "Full name";
    expect(listTitles(matrix), "#3: a title change").toEqual(["Default order", "Full name"]);
    column.visible = false;
    expect(item.visible, "#4: hidden").toBe(false);
    column.visible = true;
    expect(item.visible, "#5").toBe(true);
    column.cellType = "checkbox";
    expect([item.visible, matrix.showViewActions], "#6: a checkbox column").toEqual([false, false]);
  });
});

describe("Sort menu: the list", () => {
  test("Default order first; a new field ascending, the active field flips, Default order clears", () => {
    const panel = createPanel({ panelsPerPage: 0 });
    expect(listTitles(panel), "#1").toEqual(["Default order", "Name", "age"]);
    pick(panel, "age");
    expect(panel.sortBy, "#2").toBe("age");
    pick(panel, "age");
    expect(panel.sortBy, "#3: flipped").toBe("age-");
    pick(panel, "age");
    expect(panel.sortBy, "#4: flipped back, never cleared by a field").toBe("age");
    pick(panel, "Name");
    expect([panel.sortBy, panelNames(panel)], "#5: a new field").toEqual(["name", ["a", "b", "c", "d"]]);
    pick(panel, "Default order");
    expect([panel.sortBy, panelNames(panel)], "#6").toEqual(["", ["c", "a", "d", "b"]]);
  });
  test("a pick closes the popup", () => {
    const panel = createPanel();
    const item = getSortItem(panel);
    item.popupModel.isVisible = true;
    pick(panel, "Name");
    expect(item.popupModel.isVisible).toBe(false);
  });
});

describe("Sort menu: viewActions", () => {
  test("created once and disposed with the question", () => {
    const panel = createPanel();
    const actions = panel.viewActions;
    expect(panel.viewActions, "#1").toBe(actions);
    expect(actions.actions.map(a => a.id), "#2").toEqual(["sv-sort-by"]);
    panel.dispose();
    expect(actions.isDisposed, "#3").toBe(true);
  });
});
