import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionTextModel } from "../../src/question_text";
import { FunctionFactory } from "../../src/functionsfactory";
import { Action, IAction } from "../../src/actions/action";
import { ListModel } from "../../src/list";
import { surveyLocalization } from "../../src/surveyStrings";
import { Serializer } from "../../src/jsonobject";
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
type RecordsQuestion = QuestionPanelDynamicModel | QuestionMatrixDynamicModel;
// The dropdown of a sort level: "Sort by" at level 0, "Then by" after it.
const getSortItem = (q: RecordsQuestion, level: number = 0): Action =>
  <Action>q.viewActions.getActionById(level === 0 ? "sv-sort-by" : "sv-sort-then-by-" + level);
const getList = (q: RecordsQuestion, level: number = 0): ListModel => <ListModel>getSortItem(q, level).data;
const listTitles = (q: RecordsQuestion, level: number = 0): Array<string> => getList(q, level).actions.map(item => item.title);
const selectedTitle = (q: RecordsQuestion, level: number = 0): string => getList(q, level).selectedItem?.title;
const visibleLevels = (q: RecordsQuestion): Array<string> => q.viewActions.actions.filter(item => item.visible).map(item => item.id);
// A pick the way a click makes it: the list selects the item and calls the selection callback.
function pick(q: RecordsQuestion, title: string, level: number = 0): void {
  const list = getList(q, level);
  list.onItemClick(<Action>list.actions.filter((item: IAction) => item.title === title)[0]);
}
// What the menu button of a level shows: its title, its icon and its accessible name.
const menuState = (q: RecordsQuestion, level: number = 0): Array<string> => {
  const item = getSortItem(q, level);
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

describe("Sort menu: setSortOrderByUser", () => {
  test("a sort replaces the whole sort and an empty array clears it", () => {
    const panel = createPanel({ panelsPerPage: 0 });
    panel.sortBy = "age-;name";
    expect(panel.setSortOrderByUser([{ field: "name", direction: "asc" }]), "#1").toBe(true);
    expect(panel.sortBy, "#2: the tie-breaker is dropped").toBe("name");
    expect(panelNames(panel), "#3").toEqual(["a", "b", "c", "d"]);
    panel.setSortOrderByUser([{ field: "name", direction: "desc" }]);
    expect(panelNames(panel), "#4").toEqual(["d", "c", "b", "a"]);
    panel.setSortOrderByUser([]);
    expect([panel.sortBy, panelNames(panel)], "#5").toEqual(["", ["c", "a", "d", "b"]]);
  });
  test("a two-field sort", () => {
    const panel = createPanel({ panelsPerPage: 0 }, [{ name: "b", age: 2 }, { name: "a", age: 3 }, { name: "b", age: 1 }]);
    const sort: Array<any> = [{ field: "name", direction: "desc" }, { field: "age", direction: "asc" }];
    expect(panel.setSortOrderByUser(sort), "#1").toBe(true);
    expect([panel.sortBy, panel.panels.map(p => p.getQuestionByName("age").value)], "#2").toEqual(["name-;age", [1, 2, 3]]);
    sort.length = 0;
    expect(panel.sortBy, "#3: the array the caller passed is not kept").toBe("name-;age");
  });
  test("a re-pick of the active sort reorders a view an edit froze", () => {
    const panel = createPanel({ panelsPerPage: 0 });
    panel.setSortOrderByUser([{ field: "name", direction: "asc" }]);
    panel.panels[0].getQuestionByName("name").value = "z";
    expect(panelNames(panel), "#1: the edit does not move the panel").toEqual(["z", "b", "c", "d"]);
    panel.setSortOrderByUser([{ field: "name", direction: "asc" }]);
    expect(panelNames(panel), "#2: the same sort is applied again").toEqual(["b", "c", "d", "z"]);
  });
  test("a sort change keeps the page index: the page shows the records the new order puts there", () => {
    const panel = createPanel();
    panel.pageIndex = 1;
    panel.setSortOrderByUser([{ field: "name", direction: "asc" }]);
    expect([panel.pageIndex, panelNames(panel)], "#1").toEqual([1, ["c", "d"]]);
    panel.toggleSort("name");
    expect([panel.pageIndex, panelNames(panel)], "#2: as a header click does").toEqual([1, ["b", "a"]]);
  });
  test("a page with an error blocks the pick", () => {
    const panel = createPanel({ templateElements: [{ type: "text", name: "name" }, { type: "text", name: "req", isRequired: true }] });
    expect(panel.panels.length, "#0: the page is shown").toBe(2);
    expect(panel.setSortOrderByUser([{ field: "name", direction: "asc" }]), "#1").toBe(false);
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
      expect(panel.setSortOrderByUser([{ field: "name", direction: "asc" }]), "#1: waiting is not an error").toBe(true);
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
  test("a matrix without a detail panel: only on a phone, where the header is hidden", () => {
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
  test("a sort by a field the menu does not offer shows the field name; a multi-field sort its first field at level 0", () => {
    const panel = createPanel();
    panel.sortBy = "unknown";
    expect(menuState(panel), "#1").toEqual(["Sort by: unknown", "icon-chevronup-16x16", "Sort by unknown, ascending"]);
    expect(selectedTitle(panel), "#2: the fallback item of the field is active").toBe("unknown");
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

describe("Sort menu: maxSortLevels", () => {
  test("default 2, clamped to 1..5, serialized only when it is not 2", () => {
    const panel = createPanel();
    expect(panel.maxSortLevels, "#1").toBe(2);
    expect(panel.toJSON().maxSortLevels, "#2: the default is not serialized").toBeUndefined();
    panel.maxSortLevels = 0;
    expect(panel.maxSortLevels, "#3").toBe(1);
    panel.maxSortLevels = 9;
    expect(panel.maxSortLevels, "#4").toBe(5);
    expect(panel.toJSON().maxSortLevels, "#5").toBe(5);
    const matrix = createMatrix({ maxSortLevels: 3 });
    expect([matrix.maxSortLevels, matrix.toJSON().maxSortLevels], "#6: the matrix").toEqual([3, 3]);
  });
  test("1 is the single menu: a pick shows no second level", () => {
    const panel = createPanel({ maxSortLevels: 1 });
    pick(panel, "Name");
    expect(visibleLevels(panel)).toEqual(["sv-sort-by"]);
  });
  test("lowering it hides the levels above it and keeps the sort", () => {
    const panel = createPanel({ maxSortLevels: 3, templateElements: [{ type: "text", name: "name" }, { type: "text", name: "age" }, { type: "text", name: "city" }] });
    panel.sortBy = "name;age";
    expect(visibleLevels(panel), "#1").toEqual(["sv-sort-by", "sv-sort-then-by-1", "sv-sort-then-by-2"]);
    panel.maxSortLevels = 2;
    expect([visibleLevels(panel), panel.sortBy], "#2").toEqual([["sv-sort-by", "sv-sort-then-by-1"], "name;age"]);
  });
});

describe("Sort menu: which levels show", () => {
  const fourFields = { panelsPerPage: 0, maxSortLevels: 3, templateElements: [
    { type: "text", name: "name", title: "Name" }, { type: "text", name: "age" },
    { type: "text", name: "city" }, { type: "text", name: "score" }
  ] };
  test("a level shows once the level before it has a sort; it lists the fields the earlier levels left", () => {
    const panel = createPanel(fourFields);
    expect(visibleLevels(panel), "#1: no sort").toEqual(["sv-sort-by"]);
    pick(panel, "age");
    expect(visibleLevels(panel), "#2").toEqual(["sv-sort-by", "sv-sort-then-by-1"]);
    expect(listTitles(panel, 1), "#3").toEqual(["None", "Name", "city", "score"]);
    pick(panel, "city", 1);
    expect(visibleLevels(panel), "#4").toEqual(["sv-sort-by", "sv-sort-then-by-1", "sv-sort-then-by-2"]);
    expect(listTitles(panel, 2), "#5").toEqual(["None", "Name", "score"]);
    pick(panel, "score", 2);
    expect([visibleLevels(panel).length, panel.sortBy], "#6: maxSortLevels").toEqual([3, "age;city;score"]);
    expect(listTitles(panel, 0), "#7: level 0 lists every field").toEqual(["Default order", "Name", "age", "city", "score"]);
    expect(listTitles(panel, 1), "#8: a field of a later level stays listed").toEqual(["None", "Name", "city", "score"]);
  });
  test("no level shows once the fields run out", () => {
    const panel = createPanel({ panelsPerPage: 0, maxSortLevels: 5 });
    pick(panel, "Name");
    expect(listTitles(panel, 1), "#1").toEqual(["None", "age"]);
    pick(panel, "age", 1);
    expect([visibleLevels(panel), panel.sortBy], "#2").toEqual([["sv-sort-by", "sv-sort-then-by-1"], "name;age"]);
  });
  test("five level actions, created once and hidden as needed; disposed with the question", () => {
    const panel = createPanel();
    const actions = panel.viewActions;
    expect(panel.viewActions, "#1").toBe(actions);
    expect(actions.actions.map(a => a.id), "#2").toEqual(["sv-sort-by", "sv-sort-then-by-1", "sv-sort-then-by-2", "sv-sort-then-by-3", "sv-sort-then-by-4"]);
    const items = actions.actions.slice();
    pick(panel, "Name");
    pick(panel, "Default order");
    expect(actions.actions, "#3: the container is not rebuilt").toEqual(items);
    panel.dispose();
    expect(actions.isDisposed, "#4").toBe(true);
  });
  test("the opt-in hides every level", () => {
    const panel = createPanel();
    panel.sortBy = "name;age";
    expect(visibleLevels(panel), "#1").toEqual(["sv-sort-by", "sv-sort-then-by-1"]);
    panel.allowSortPanels = false;
    expect([visibleLevels(panel), panel.showViewActions], "#2").toEqual([[], false]);
  });
});

describe("Sort menu: a pick at a level", () => {
  const tied = [{ name: "b", age: 2 }, { name: "a", age: 3 }, { name: "b", age: 1 }, { name: "a", age: 1 }];
  const records = (q: QuestionPanelDynamicModel): Array<string> => q.panels.map(p => p.getQuestionByName("name").value + p.getQuestionByName("age").value);
  test("another field resets the later levels; the active field flips and keeps them", () => {
    const panel = createPanel({ panelsPerPage: 0 }, tied);
    pick(panel, "Name");
    pick(panel, "age", 1);
    expect([panel.sortBy, records(panel)], "#1").toEqual(["name;age", ["a1", "a3", "b1", "b2"]]);
    pick(panel, "Name");
    expect([panel.sortBy, records(panel)], "#2: flipped, level 1 kept").toEqual(["name-;age", ["b1", "b2", "a1", "a3"]]);
    expect(visibleLevels(panel).length, "#3").toBe(2);
    pick(panel, "age", 1);
    expect([panel.sortBy, records(panel)], "#4: level 1 flipped").toEqual(["name-;age-", ["b2", "b1", "a3", "a1"]]);
    pick(panel, "age");
    expect([panel.sortBy, records(panel)], "#5: the level-1 field picked at level 0 resets level 1").toEqual(["age", ["b1", "a1", "b2", "a3"]]);
    expect(menuState(panel, 1), "#6").toEqual(["Then by", undefined, "Then by"]);
    expect(listTitles(panel, 1), "#7").toEqual(["None", "Name"]);
  });
  test("None at level 1 keeps level 0; Default order clears everything and hides level 1", () => {
    const panel = createPanel({ panelsPerPage: 0 }, tied);
    panel.sortBy = "name;age-";
    pick(panel, "None", 1);
    expect([panel.sortBy, records(panel)], "#1").toEqual(["name", ["a3", "a1", "b2", "b1"]]);
    expect(visibleLevels(panel).length, "#2: an empty level 1 with a field to offer").toBe(2);
    panel.sortBy = "name;age-";
    pick(panel, "Default order");
    expect([panel.sortBy, records(panel)], "#3").toEqual(["", ["b2", "a3", "b1", "a1"]]);
    expect(visibleLevels(panel), "#4").toEqual(["sv-sort-by"]);
  });
});

describe("Sort menu: what the levels show", () => {
  test("titles, icons, accessible names and selected items of levels 0 and 1", () => {
    const panel = createPanel();
    pick(panel, "age");
    expect(menuState(panel, 1), "#1").toEqual(["Then by", undefined, "Then by"]);
    expect(selectedTitle(panel, 1), "#2").toBe("None");
    pick(panel, "Name", 1);
    expect(menuState(panel, 0), "#3").toEqual(["Sort by: age", "icon-chevronup-16x16", "Sort by age, ascending"]);
    expect(menuState(panel, 1), "#4").toEqual(["Then by: Name", "icon-chevronup-16x16", "Then by Name, ascending"]);
    expect(getSortItem(panel, 1).tooltip, "#5").toBe("Then by Name, ascending");
    expect([selectedTitle(panel, 0), selectedTitle(panel, 1)], "#6").toEqual(["age", "Name"]);
    pick(panel, "Name", 1);
    expect(menuState(panel, 1), "#7").toEqual(["Then by: Name", "icon-chevrondown-16x16", "Then by Name, descending"]);
  });
  test("after a locale change", () => {
    surveyLocalization.locales["sortyy"] = {
      sortByText: "Order by", sortByFieldText: "Order by: {0}", sortDefaultOrderText: "As entered",
      sortThenByText: "Next", sortThenByFieldText: "Next: {0}", sortNoneText: "Nothing",
      sortAscendingText: "up", sortDescendingText: "down"
    };
    try {
      const panel = createPanel({ templateElements: [{ type: "text", name: "name", title: { default: "Name", sortyy: "Label" } }, { type: "text", name: "age" }] });
      panel.sortBy = "age;name-";
      panel.survey.locale = "sortyy";
      expect(menuState(panel, 1), "#1").toEqual(["Next: Label", "icon-chevrondown-16x16", "Next Label, down"]);
      expect([listTitles(panel, 1), selectedTitle(panel, 1)], "#2").toEqual([["Nothing", "Label"], "Label"]);
      panel.survey.locale = "";
      expect([getSortItem(panel, 1).title, listTitles(panel, 1)], "#3").toEqual(["Then by: Name", ["None", "Name"]]);
    } finally {
      delete surveyLocalization.locales["sortyy"];
    }
  });
});

describe("Sort menu: a sort from code", () => {
  const threeFields = { panelsPerPage: 0, templateElements: [{ type: "text", name: "name", title: "Name" }, { type: "text", name: "age" }, { type: "text", name: "city" }] };
  test("longer than maxSortLevels: the first levels show, the rest stays in force", () => {
    const panel = createPanel(threeFields);
    panel.sortBy = "name;age;city";
    expect(visibleLevels(panel), "#1").toEqual(["sv-sort-by", "sv-sort-then-by-1"]);
    pick(panel, "Name");
    expect(panel.sortBy, "#2: a flip keeps the hidden tail").toBe("name-;age;city");
    pick(panel, "city", 1);
    expect(panel.sortBy, "#3: a new field drops it").toBe("name-;city");
  });
  test("a field the menu does not offer at level 0 is shown by its name and missing from level 1", () => {
    const panel = createPanel(threeFields);
    panel.sortBy = "unknown-";
    expect(menuState(panel, 0), "#1").toEqual(["Sort by: unknown", "icon-chevrondown-16x16", "Sort by unknown, descending"]);
    expect([listTitles(panel, 0), selectedTitle(panel, 0)], "#2").toEqual([["Default order", "unknown", "Name", "age", "city"], "unknown"]);
    expect(listTitles(panel, 1), "#3: level 1 does not list it").toEqual(["None", "Name", "age", "city"]);
  });
});

describe("Sort menu: a level occupied by a field the menu does not offer", () => {
  test("level 1: shown with a selected fallback item, flipped by a pick, gone with None", () => {
    const panel = createPanel({ panelsPerPage: 0, templateElements: [{ type: "text", name: "name", title: "Name" }] });
    panel.sortBy = "name;legacy";
    expect(visibleLevels(panel), "#1: no field is left, the level is occupied").toEqual(["sv-sort-by", "sv-sort-then-by-1"]);
    expect(menuState(panel, 1), "#2").toEqual(["Then by: legacy", "icon-chevronup-16x16", "Then by legacy, ascending"]);
    expect([listTitles(panel, 1), selectedTitle(panel, 1)], "#3").toEqual([["None", "legacy"], "legacy"]);
    pick(panel, "legacy", 1);
    expect([panel.sortBy, getSortItem(panel, 1).ariaLabel], "#4: flipped").toEqual(["name;legacy-", "Then by legacy, descending"]);
    pick(panel, "None", 1);
    expect([panel.sortBy, visibleLevels(panel)], "#5").toEqual(["name", ["sv-sort-by"]]);
    expect(listTitles(panel, 1), "#6: the fallback item is gone").toEqual(["None"]);
  });
  test("level 0: the fallback item is selected and a pick of another field removes it", () => {
    const panel = createPanel({ panelsPerPage: 0, templateElements: [{ type: "text", name: "name", title: "Name" }] });
    panel.sortBy = "legacy";
    expect([listTitles(panel), selectedTitle(panel)], "#1").toEqual([["Default order", "legacy", "Name"], "legacy"]);
    pick(panel, "legacy");
    expect(panel.sortBy, "#2: flipped").toBe("legacy-");
    pick(panel, "Name");
    expect([panel.sortBy, listTitles(panel), selectedTitle(panel)], "#3").toEqual(["name", ["Default order", "Name"], "Name"]);
  });
});

describe("Sort menu: a rejected pick at level 1 leaves every level on the committed sort", () => {
  test("an error found at once", () => {
    const panel = createPanel({ templateElements: [{ type: "text", name: "name", title: "Name" }, { type: "text", name: "age" }, { type: "text", name: "req", isRequired: true }] });
    panel.sortBy = "name;age";
    expect(panel.panels.length, "#0: the page is shown").toBe(2);
    pick(panel, "req", 1);
    expect(panel.sortBy, "#1").toBe("name;age");
    expect([menuState(panel, 0), menuState(panel, 1)], "#2").toEqual([
      ["Sort by: Name", "icon-chevronup-16x16", "Sort by Name, ascending"], ["Then by: age", "icon-chevronup-16x16", "Then by age, ascending"]]);
    expect([selectedTitle(panel, 0), selectedTitle(panel, 1)], "#3").toEqual(["Name", "age"]);
  });
  test("an asynchronous validator: held, then rejected, then accepted", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("sortLevelPickFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const panel = createPanel({ templateElements: [
        { type: "text", name: "name", title: "Name", validators: [{ type: "expression", expression: "sortLevelPickFunc({panel.name}) = 1" }] },
        { type: "text", name: "age" }
      ] });
      panel.sortBy = "name";
      expect(panel.panels.length, "#0: the page is shown").toBe(2);
      results.splice(0);
      pick(panel, "age", 1);
      expect(panel.sortBy, "#1: held").toBe("name");
      expect([menuState(panel, 1), selectedTitle(panel, 1)], "#2").toEqual([["Then by", undefined, "Then by"], "None"]);
      expect([getSortItem(panel, 0).enabled, getSortItem(panel, 1).enabled], "#3: disabled while it waits").toEqual([false, false]);
      results.splice(0).forEach(setResult => setResult(0));
      expect([panel.sortBy, getSortItem(panel, 0).title, getSortItem(panel, 1).title, selectedTitle(panel, 1), getSortItem(panel, 1).enabled], "#4: rejected").toEqual(
        ["name", "Sort by: Name", "Then by", "None", true]);
      panel.panels[0].getQuestionByName("name").value = "x";
      panel.panels[1].getQuestionByName("name").value = "y";
      results.splice(0);
      pick(panel, "age", 1);
      results.splice(0).forEach(setResult => setResult(1));
      expect([panel.sortBy, getSortItem(panel, 1).title, selectedTitle(panel, 1)], "#5: accepted").toEqual(["name;age", "Then by: age", "age"]);
    } finally {
      FunctionFactory.Instance.unregister("sortLevelPickFunc");
    }
  });
});

describe("Sort menu: the matrix", () => {
  const detail = { detailPanelMode: "underRow", detailElements: [{ type: "text", name: "score", inputType: "number" }] };
  test("when the menu shows: the opt-in, a phone, a detail panel field, sortMenuVisibility", () => {
    expect(getSortItem(createMatrix(undefined, false)).visible, "#1: auto on a desktop without a detail panel").toBe(false);
    expect(getSortItem(createMatrix(detail, false)).visible, "#2: a sortable detail field").toBe(true);
    expect(getSortItem(createMatrix({ detailPanelMode: "underRow", detailElements: [{ type: "html", name: "h" }] }, false)).visible,
      "#3: a detail panel of html only").toBe(false);
    expect(getSortItem(createMatrix({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "name" }] }, false)).visible,
      "#4: a detail field that is a column's").toBe(false);
    expect(getSortItem(createMatrix({ sortMenuVisibility: "always" }, false)).visible, "#5: always").toBe(true);
    expect(getSortItem(createMatrix()).visible, "#6: a phone").toBe(true);
    expect(getSortItem(createMatrix(Object.assign({ allowSortRows: false, sortMenuVisibility: "always" }, detail))).visible, "#7: the opt-in is off").toBe(false);
  });
  test("sortMenuVisibility switched on a built desktop matrix", () => {
    const matrix = createMatrix(undefined, false);
    expect([getSortItem(matrix).visible, matrix.showViewActions], "#1").toEqual([false, false]);
    matrix.sortMenuVisibility = "always";
    expect([getSortItem(matrix).visible, matrix.showViewActions], "#2").toEqual([true, true]);
    matrix.sortMenuVisibility = "auto";
    expect([getSortItem(matrix).visible, matrix.showViewActions], "#3").toEqual([false, false]);
    expect(matrix.toJSON().sortMenuVisibility, "#4: the default is not serialized").toBeUndefined();
  });
  test("the fields: columns first, then the detail questions", () => {
    const matrix = createMatrix({ detailPanelMode: "underRow", detailElements: [
      { type: "text", name: "score", title: "Score of {row.name}" },
      { type: "text", name: "dup", valueName: "name", title: "Duplicate" },
      { type: "html", name: "h" },
      { type: "panel", name: "inner", elements: [{ type: "text", name: "city", title: "{rowIndex}" }] }
    ] }, false);
    expect(matrix.sortFields, "#1").toEqual([
      { field: "name", title: "Name" }, { field: "age", title: "age" }, { field: "score", title: "Score of" }, { field: "city", title: "city" }
    ]);
    matrix.detailPanelMode = "none";
    expect(matrix.sortFields, "#2").toEqual([{ field: "name", title: "Name" }, { field: "age", title: "age" }]);
  });
  test("the list knows the detail questions by their type; a value name shared with a column is the column's", () => {
    const matrix = createMatrix({ columns: [{ name: "name", cellType: "text" }], detailPanelMode: "underRow", detailElements: [
      { type: "text", name: "score", inputType: "number" }, { type: "text", name: "dup", valueName: "name", inputType: "number" }
    ] }, false);
    const fields = (): Array<any> => (<any>matrix).getFields().map((f: any) => [f.name, f.dataType]);
    expect(fields(), "#1").toEqual([["name", "any"], ["score", "number"]]);
    matrix.detailPanelMode = "none";
    expect(fields(), "#2").toEqual([["name", "any"]]);
  });
  test("a sort by a number detail question orders numerically", () => {
    const survey = new SurveyModel({ elements: [{
      type: "matrixdynamic", name: "matrix", rowCount: 0, allowSortRows: true,
      columns: [{ name: "name", cellType: "text" }], detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "score", inputType: "number" }]
    }] });
    survey.data = { matrix: [{ name: "x", score: "10" }, { name: "y", score: "2" }, { name: "z", score: "9" }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    pick(matrix, "score");
    expect(matrix.visibleRows.map(row => row.getValue("name"))).toEqual(["y", "z", "x"]);
  });
  test("the candidates change: a detail element added, removed, made html, and detailPanelMode switched", () => {
    const matrix = createMatrix({ detailPanelMode: "underRow", detailElements: [{ type: "html", name: "h" }, { type: "panel", name: "inner" }] }, false);
    const item = getSortItem(matrix);
    expect([item.visible, matrix.showViewActions], "#1").toEqual([false, false]);
    const q = new QuestionTextModel("score");
    matrix.detailPanel.addElement(q);
    expect([item.visible, matrix.showViewActions, listTitles(matrix)], "#2: no popup was opened").toEqual([true, true, ["Default order", "Name", "age", "score"]]);
    q.title = "Score";
    expect(listTitles(matrix), "#3: a title change").toEqual(["Default order", "Name", "age", "Score"]);
    matrix.detailPanel.removeElement(q);
    expect(item.visible, "#4: removed").toBe(false);
    const inner = <any>matrix.detailPanel.getElementByName("inner");
    const city = new QuestionTextModel("city");
    inner.addElement(city);
    expect(item.visible, "#5: a nested panel").toBe(true);
    city.visible = false;
    expect(item.visible, "#6: hidden in the template").toBe(false);
    city.visible = true;
    matrix.detailPanelMode = "none";
    expect(item.visible, "#7: no detail panel").toBe(false);
    matrix.detailPanelMode = "underRowSingle";
    expect(item.visible, "#8").toBe(true);
  });
  test("a detail question retyped to html", () => {
    const survey = new SurveyModel({ elements: [{
      type: "matrixdynamic", name: "matrix", rowCount: 0, allowSortRows: true,
      columns: [{ name: "name", cellType: "text" }], detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "score" }]
    }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const item = getSortItem(matrix);
    expect(item.visible, "#1").toBe(true);
    // A type change replaces the question in its panel, as the Creator does it.
    const old = matrix.detailPanel.getQuestionByName("score");
    const html = Serializer.createClass("html", { name: "score" });
    const index = matrix.detailPanel.elements.indexOf(old);
    matrix.detailPanel.removeElement(old);
    matrix.detailPanel.addElement(html, index);
    expect([item.visible, matrix.showViewActions], "#2").toEqual([false, false]);
  });
  test("a header click replaces the whole sort and the menu follows", () => {
    const matrix = createMatrix(detail, false);
    matrix.sortBy = "score;name";
    expect(visibleLevels(matrix).length, "#1").toBe(2);
    matrix.toggleSort("age");
    expect([matrix.sortBy, visibleLevels(matrix).length, getSortItem(matrix).title], "#2").toEqual(["age", 2, "Sort by: age"]);
    expect(menuState(matrix, 1), "#3").toEqual(["Then by", undefined, "Then by"]);
  });
});
