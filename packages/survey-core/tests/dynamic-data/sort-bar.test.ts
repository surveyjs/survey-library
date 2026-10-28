import { describe, test, expect, afterEach, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionRecordsModel } from "../../src/question_records";
import { QuestionMatrixDropdownRenderedCell } from "../../src/question_matrixdropdownrendered";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { surveyLocalization } from "../../src/surveyStrings";
import { Action } from "../../src/actions/action";
import { ListModel } from "../../src/list";
import { ActionContainer } from "../../src/actions/container";
import { Serializer } from "../../src/jsonobject";

const productColumns = [
  { name: "product", title: "Product", cellType: "text" },
  { name: "category", title: "Category", cellType: "dropdown", choices: ["tools", "toys"] },
  { name: "price", title: "Price", cellType: "text", inputType: "number" },
  { name: "discontinued", title: "Discontinued", cellType: "boolean" }
];
const productRows = [
  { product: "b", category: "toys", price: 20, discontinued: false },
  { product: "a", category: "tools", price: 30, discontinued: true },
  { product: "c", category: "toys", price: 10, discontinued: false }
];
const productTemplate = productColumns.map((column: any): any => {
  const res: any = Object.assign({}, column, { type: column.cellType });
  delete res.cellType;
  return res;
});
function copyRows(): Array<any> {
  return productRows.map((row: any): any => Object.assign({}, row));
}
function createMatrix(json?: any, surveyJson?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel(Object.assign({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0, allowSort: true, showSortBar: "always", columns: productColumns
  }, json)] }, surveyJson));
  survey.data = { matrix: copyRows() };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
function createPanel(json?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "paneldynamic", name: "panel", title: "Products", allowSort: true, templateElements: productTemplate
  }, json)] });
  survey.data = { panel: copyRows() };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
}
// The containers of the levels, in the bar's order.
function levelsOf(q: QuestionRecordsModel): Array<ActionContainer> {
  return q.recordsBar.sortActions.actions.filter((item: Action): boolean => item.component === "sv-sort-bar-level")
    .map((item: Action): ActionContainer => <ActionContainer>item.data);
}
// An item of the bar ("Sort by", a level, "+"), or a dropdown or a remove button inside a level.
function getAction(q: QuestionRecordsModel, id: string): Action {
  const own = <Action>q.recordsBar.sortActions.getActionById(id);
  if (!!own) return own;
  return levelsOf(q).map((level: ActionContainer): Action => level.getActionById(id)).filter((item: Action): boolean => !!item)[0];
}
function getList(q: QuestionRecordsModel, id: string): ListModel {
  return <ListModel>getAction(q, id).data;
}
const fieldList = (q: QuestionRecordsModel): ListModel => getList(q, "sv-sort-field");
const directionList = (q: QuestionRecordsModel): ListModel => getList(q, "sv-sort-direction");
const titlesOf = (list: ListModel): Array<string> => list.actions.map((item: Action): string => item.title);
// What the respondent sees: both buttons and the item each list selects.
function shown(q: QuestionRecordsModel): Array<string> {
  const field = fieldList(q).selectedItem;
  const direction = directionList(q).selectedItem;
  return [getAction(q, "sv-sort-field").title, getAction(q, "sv-sort-direction").title,
    !!field ? field.title : undefined, !!direction ? direction.title : undefined];
}
// A pick as the list makes it: the item is selected, the dropdown copies its title, then the bar runs.
function pick(list: ListModel, title: string): void {
  const item = list.actions.filter((action: Action): boolean => action.title === title)[0];
  expect(item, "no item " + title).toBeTruthy();
  list.onItemClick(item);
}
const pickField = (q: QuestionRecordsModel, title: string): void => pick(fieldList(q), title);
const pickDirection = (q: QuestionRecordsModel, title: string): void => pick(directionList(q), title);
function sortOf(q: QuestionRecordsModel): Array<any> {
  return q.sortCriteria.map((item: any): any => ({ field: item.field, direction: item.direction }));
}
function columnValues(matrix: QuestionMatrixDynamicModel, name: string): Array<any> {
  return matrix.visibleRows.map((row: any): any => row.getQuestionByName(name).value);
}
function header(matrix: QuestionMatrixDynamicModel, name: string): QuestionMatrixDropdownRenderedCell {
  return matrix.renderedTable.headerRow.cells.filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !!cell.column && cell.column.name === name)[0];
}
const itemIds = ["sv-sort-field", "sv-sort-by", "sv-sort-direction"];
const visibleOf = (q: QuestionRecordsModel): Array<boolean> => itemIds.map((id: string): boolean => getAction(q, id).visible);
const enabledOf = (q: QuestionRecordsModel): Array<boolean> => itemIds.map((id: string): boolean => getAction(q, id).enabled);
// Everything that follows the one visibility rule.
const placement = (q: QuestionRecordsModel): Array<any> => [q.recordsBar.showSort, q.hasAdditionalTitleToolbar, q.sortBarLocation];
// Reads a private field on purpose: the sort bar container is built on its first read only.
const isSortBarBuilt = (q: QuestionRecordsModel): boolean => !!(<any>q.recordsBar).sortActionsValue;

describe("Sort bar: the fields and the directions", () => {
  test("the matrix offers its columns in column order; with no sort the first one and Default show", () => {
    const matrix = createMatrix();
    expect(titlesOf(fieldList(matrix)), "#1").toEqual(["Product", "Category", "Price", "Discontinued"]);
    expect(shown(matrix), "#2").toEqual(["Product", "Default", "Product", "Default"]);
    expect(titlesOf(directionList(matrix)), "#3").toEqual(["Default", "Alphabet, A - Z", "Alphabet, Z - A"]);
    expect(getAction(matrix, "sv-sort-by").title, "#4").toBe("Sort by");
    expect([getAction(matrix, "sv-sort-field").ariaLabel, getAction(matrix, "sv-sort-direction").ariaLabel], "#5")
      .toEqual(["Sort field Product", "Sort order Default"]);
    expect([getAction(matrix, "sv-sort-by").enabled, getAction(matrix, "sv-sort-by").disableTabStop], "#6: a label").toEqual([false, true]);
  });
  test("a field pick sorts at once in the type's first direction; a direction pick flips it; Default clears it", () => {
    const matrix = createMatrix();
    pickField(matrix, "Price");
    expect(sortOf(matrix), "#1").toEqual([{ field: "price", direction: "desc" }]);
    expect(shown(matrix), "#2").toEqual(["Price", "High - Low", "Price", "High - Low"]);
    expect(titlesOf(directionList(matrix)), "#3").toEqual(["Default", "High - Low", "Low - High"]);
    expect(columnValues(matrix, "price"), "#4").toEqual([30, 20, 10]);
    pickDirection(matrix, "Low - High");
    expect(sortOf(matrix), "#5").toEqual([{ field: "price", direction: "asc" }]);
    expect(columnValues(matrix, "price"), "#6").toEqual([10, 20, 30]);
    pickDirection(matrix, "Default");
    expect(sortOf(matrix), "#7").toEqual([]);
    expect(shown(matrix), "#8: the field the respondent last sorted by stays").toEqual(["Price", "Default", "Price", "Default"]);
    expect(columnValues(matrix, "price"), "#9: the stored order").toEqual([20, 30, 10]);
  });
  test("a date column starts with Newest first", () => {
    const matrix = createMatrix({ columns: productColumns.concat([{ name: "added", title: "Added", cellType: "text", inputType: "date" }]) });
    pickField(matrix, "Added");
    expect(sortOf(matrix), "#1").toEqual([{ field: "added", direction: "desc" }]);
    expect(shown(matrix), "#2").toEqual(["Added", "Newest first", "Added", "Newest first"]);
    expect(titlesOf(directionList(matrix)), "#3").toEqual(["Default", "Newest first", "Oldest first"]);
  });
  test("a boolean and a dropdown column sort alphabetically", () => {
    const matrix = createMatrix();
    pickField(matrix, "Discontinued");
    expect(sortOf(matrix), "#1").toEqual([{ field: "discontinued", direction: "asc" }]);
    expect(titlesOf(directionList(matrix)), "#2").toEqual(["Default", "Alphabet, A - Z", "Alphabet, Z - A"]);
    pickField(matrix, "Category");
    expect(shown(matrix), "#3").toEqual(["Category", "Alphabet, A - Z", "Category", "Alphabet, A - Z"]);
  });
  test("the dynamic panel offers its value-sortable template questions, nested panels included", () => {
    const panel = createPanel({ templateElements: productTemplate.concat([
      { type: "panel", name: "details", elements: [{ type: "text", name: "code", title: "Code" }] },
      { type: "text", name: "hiddenText", title: "Hidden", visible: false },
      { type: "panel", name: "hiddenPanel", visible: false, elements: [{ type: "text", name: "inHidden" }] },
      { type: "checkbox", name: "tags", choices: [1, 2] },
      { type: "file", name: "photo" },
      { type: "signaturepad", name: "signature" },
      { type: "html", name: "note", html: "x" }
    ]) });
    expect(titlesOf(fieldList(panel)), "#1").toEqual(["Product", "Category", "Price", "Discontinued", "Code"]);
    expect(shown(panel), "#2").toEqual(["Product", "Default", "Product", "Default"]);
    pickField(panel, "Price");
    expect(sortOf(panel), "#3").toEqual([{ field: "price", direction: "desc" }]);
    expect(panel.visiblePanels.map((p: PanelModel): any => p.getQuestionByName("price").value), "#4").toEqual([30, 20, 10]);
    pickDirection(panel, "Low - High");
    expect(sortOf(panel), "#5").toEqual([{ field: "price", direction: "asc" }]);
    pickDirection(panel, "Default");
    expect([sortOf(panel), shown(panel)], "#6").toEqual([[], ["Price", "Default", "Price", "Default"]]);
  });
  test("a template question title is shown without its record placeholders", () => {
    const panel = createPanel({ templateElements: [{ type: "text", name: "price", title: "Price of {panel.product}" }] });
    expect(titlesOf(fieldList(panel)), "#1").toEqual(["Price of"]);
  });
});

describe("Sort bar: the column rules", () => {
  test("a column with allowSort false, a hidden column and a checkbox column are not offered", () => {
    const matrix = createMatrix({ columns: productColumns.concat([
      { name: "noSort", cellType: "text", allowSort: false },
      { name: "hidden", cellType: "text", visible: false },
      { name: "tags", cellType: "checkbox", choices: [1, 2] }
    ]) });
    expect(titlesOf(fieldList(matrix)), "#1").toEqual(["Product", "Category", "Price", "Discontinued"]);
  });
  test("a runtime change of visible, allowSort or title updates the list, also before the rows are built", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, allowSort: true, columns: productColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const list = fieldList(matrix);
    expect((<any>matrix).generatedVisibleRows, "#0: no rows yet").toBeFalsy();
    matrix.getColumnByName("category").visible = false;
    expect(titlesOf(list), "#1: hidden").toEqual(["Product", "Price", "Discontinued"]);
    matrix.getColumnByName("price").allowSort = false;
    expect(titlesOf(list), "#2: opted out").toEqual(["Product", "Discontinued"]);
    matrix.getColumnByName("product").title = "Item";
    expect([titlesOf(list), getAction(matrix, "sv-sort-field").title], "#3: retitled").toEqual([["Item", "Discontinued"], "Item"]);
    matrix.getColumnByName("category").visible = true;
    matrix.getColumnByName("price").allowSort = true;
    expect(titlesOf(list), "#4: undone").toEqual(["Item", "Category", "Price", "Discontinued"]);
    matrix.addColumn("extra", "Extra");
    expect(titlesOf(list), "#5: a new column").toEqual(["Item", "Category", "Price", "Discontinued", "Extra"]);
    matrix.columns.splice(0, 1);
    expect(titlesOf(list), "#6: a removed column").toEqual(["Category", "Price", "Discontinued", "Extra"]);
    matrix.getColumnByName("category").cellType = "checkbox";
    expect(titlesOf(list), "#7: a cell type that is not sortable").toEqual(["Price", "Discontinued", "Extra"]);
  });
  test("an input type change updates the direction list of the shown field", () => {
    const matrix = createMatrix();
    pickField(matrix, "Product");
    expect(titlesOf(directionList(matrix)), "#1").toEqual(["Default", "Alphabet, A - Z", "Alphabet, Z - A"]);
    matrix.getColumnByName("product").inputType = "number";
    expect(titlesOf(directionList(matrix)), "#2").toEqual(["Default", "High - Low", "Low - High"]);
  });
  test("a template question added, hidden, retitled and removed at runtime", () => {
    const panel = createPanel();
    const list = fieldList(panel);
    panel.template.addNewQuestion("text", "code");
    expect(titlesOf(list), "#1: added").toEqual(["Product", "Category", "Price", "Discontinued", "code"]);
    const code = panel.template.getQuestionByName("code");
    code.title = "Code";
    expect(titlesOf(list), "#2: retitled").toEqual(["Product", "Category", "Price", "Discontinued", "Code"]);
    code.visible = false;
    expect(titlesOf(list), "#3: hidden").toEqual(["Product", "Category", "Price", "Discontinued"]);
    code.visible = true;
    panel.template.removeElement(code);
    expect(titlesOf(list), "#4: removed").toEqual(["Product", "Category", "Price", "Discontinued"]);
    const nested = <PanelModel>panel.template.addNewPanel("nested");
    nested.addNewQuestion("text", "inner");
    expect(titlesOf(list), "#5: a question added to a nested panel").toEqual(["Product", "Category", "Price", "Discontinued", "inner"]);
  });
  test("a template change is followed with no panel at all", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", allowSort: true, panelCount: 0, templateElements: productTemplate }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const list = fieldList(panel);
    panel.template.getQuestionByName("category").visible = false;
    expect(titlesOf(list), "#1").toEqual(["Product", "Price", "Discontinued"]);
  });
});

describe("Sort bar: a sort the bar did not make", () => {
  test("a sort from code shows its field and direction", () => {
    const matrix = createMatrix();
    matrix.sort("price", "asc");
    expect(shown(matrix), "#1").toEqual(["Price", "Low - High", "Price", "Low - High"]);
    matrix.sortCriteria[0].direction = "desc";
    expect(shown(matrix), "#2: an item edit").toEqual(["Price", "High - Low", "Price", "High - Low"]);
    matrix.clearSort();
    expect(shown(matrix), "#3: not sorted through the bar: the first field").toEqual(["Product", "Default", "Product", "Default"]);
  });
  test("a field the bar does not offer gets a selected fallback item; its pick changes nothing", () => {
    const matrix = createMatrix({ columns: productColumns.concat([{ name: "secret", cellType: "text", inputType: "number", allowSort: false }]) });
    matrix.sort("secret", "desc");
    expect(titlesOf(fieldList(matrix)), "#1").toEqual(["Product", "Category", "Price", "Discontinued", "secret"]);
    expect(shown(matrix), "#2: its type's labels").toEqual(["secret", "High - Low", "secret", "High - Low"]);
    expect(titlesOf(directionList(matrix)), "#3").toEqual(["Default", "High - Low", "Low - High"]);
    pickField(matrix, "secret");
    expect(sortOf(matrix), "#4").toEqual([{ field: "secret", direction: "desc" }]);
    pickDirection(matrix, "Low - High");
    expect(sortOf(matrix), "#5: a direction pick sorts it").toEqual([{ field: "secret", direction: "asc" }]);
    matrix.sort("unknown");
    expect([shown(matrix), titlesOf(directionList(matrix))], "#6: a field the list does not know").toEqual(
      [["unknown", "Alphabet, A - Z", "unknown", "Alphabet, A - Z"], ["Default", "Alphabet, A - Z", "Alphabet, Z - A"]]);
    matrix.clearSort();
    expect(titlesOf(fieldList(matrix)), "#7: the fallback goes").toEqual(["Product", "Category", "Price", "Discontinued"]);
  });
  test("a sort of several levels shows every level; a pick in the first level keeps the others", () => {
    const twoLevels = [{ field: "price", direction: "desc" }, { field: "product", direction: "asc" }];
    const matrix = createMatrix();
    let validations = 0;
    matrix.survey.onValidateQuestion.add(() => { validations++; });
    matrix.sort(<any>twoLevels);
    expect(shown(matrix), "#1").toEqual(["Price", "High - Low", "Price", "High - Low"]);
    pickField(matrix, "Price");
    expect(sortOf(matrix), "#2: the field").toEqual(twoLevels);
    pickDirection(matrix, "High - Low");
    expect(sortOf(matrix), "#3: the direction").toEqual(twoLevels);
    expect(validations, "#4: nothing validated").toBe(0);
    pickDirection(matrix, "Low - High");
    expect(sortOf(matrix), "#5: the second level stays").toEqual([{ field: "price", direction: "asc" }, { field: "product", direction: "asc" }]);
    matrix.sort(<any>twoLevels);
    pickField(matrix, "Category");
    expect(sortOf(matrix), "#6: the second level stays").toEqual([{ field: "category", direction: "asc" }, { field: "product", direction: "asc" }]);
    matrix.sort(<any>twoLevels);
    pickDirection(matrix, "Default");
    expect(sortOf(matrix), "#7").toEqual([]);
    pickDirection(matrix, "Default");
    expect(sortOf(matrix), "#8: Default with no sort").toEqual([]);
    pickField(matrix, "Price");
    pickDirection(matrix, "Default");
    pickField(matrix, "Price");
    expect(sortOf(matrix), "#9: with no sort the shown field sorts in its first direction").toEqual([{ field: "price", direction: "desc" }]);
  });
});

describe("Sort bar: the bar and the headers agree", () => {
  test("a header click updates the bar, a bar pick updates the header cells", () => {
    const matrix = createMatrix();
    expect(header(matrix, "price").toggleSort(), "#1").toBe(true);
    expect(shown(matrix), "#2").toEqual(["Price", "High - Low", "Price", "High - Low"]);
    header(matrix, "price").toggleSort();
    expect(shown(matrix), "#3").toEqual(["Price", "Low - High", "Price", "Low - High"]);
    pickField(matrix, "Product");
    expect([header(matrix, "product").sortDirection, header(matrix, "price").sortDirection], "#4").toEqual(["asc", undefined]);
    pickDirection(matrix, "Alphabet, Z - A");
    expect(header(matrix, "product").sortDirection, "#5").toBe("desc");
    pickDirection(matrix, "Default");
    expect(header(matrix, "product").sortDirection, "#6").toBeUndefined();
  });
});

describe("Sort bar: when it shows", () => {
  test("hidden without allowSort, with showSortBar \"auto\" next to sortable headers, in design mode, while collapsed and with no field; each undone", () => {
    const matrix = createMatrix();
    const shows = [true, "header"];
    expect([visibleOf(matrix), placement(matrix).slice(1)], "#1").toEqual([[true, true, true], shows]);
    const check = (change: () => void, undo: () => void, name: string): void => {
      change();
      expect([visibleOf(matrix), placement(matrix)], name).toEqual([[false, false, false], [false, false, "none"]]);
      undo();
      expect([visibleOf(matrix), placement(matrix)], name + ", undone").toEqual([[true, true, true], [true, true, "header"]]);
    };
    check(() => { matrix.allowSort = false; }, () => { matrix.allowSort = true; }, "#2: allowSort");
    check(() => { matrix.showSortBar = "auto"; }, () => { matrix.showSortBar = "always"; }, "#3: showSortBar");
    check(() => { matrix.survey.setDesignMode(true); }, () => { matrix.survey.setDesignMode(false); }, "#4: design mode");
    check(() => { matrix.state = "collapsed"; }, () => { matrix.state = "expanded"; }, "#5: collapsed");
    check(() => { matrix.columns.forEach(column => { column.allowSort = false; }); },
      () => { matrix.columns.forEach(column => { column.allowSort = true; }); }, "#6: no field");
  });
  test("shown in read-only and display mode", () => {
    const matrix = createMatrix({ readOnly: true });
    expect(placement(matrix), "#1").toEqual([true, true, "header"]);
    const display = createMatrix(undefined, { mode: "display" });
    expect(placement(display), "#2").toEqual([true, true, "header"]);
  });
  test("a survey in design mode from the start shows no bar", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdynamic", name: "matrix", allowSort: true, columns: productColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(placement(matrix), "#1").toEqual([false, false, "none"]);
  });
  test("the fixed matrix shows the bar too", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "matrix", allowSort: true, showSortBar: "always", rows: ["r1", "r2"], columns: productColumns }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(placement(matrix), "#1").toEqual([true, true, "header"]);
    expect(titlesOf(fieldList(matrix)), "#2").toEqual(["Product", "Category", "Price", "Discontinued"]);
  });
  test("a question without allowSort creates no bar to place it", () => {
    const matrix = createMatrix({ allowSort: false });
    expect([(<any>matrix).recordsBarValue, matrix.sortBarLocation, matrix.hasAdditionalTitleToolbar], "#1").toEqual([undefined, "none", false]);
  });
});

describe("Sort bar: showSortBar", () => {
  const hasHeaderClass = (q: QuestionRecordsModel): boolean => q.cssHeader.indexOf("sd-question__header--sort-bar") > -1;
  function loadMatrix(json: any): QuestionMatrixDynamicModel {
    const survey = new SurveyModel();
    survey.fromJSON({ elements: [Object.assign({ type: "matrixdynamic", name: "matrix", allowSort: true, columns: productColumns }, json)] },
      { validatePropertyValues: true });
    expect(survey.jsonErrors, "no JSON error for " + JSON.stringify(json)).toBeNull();
    return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  }
  test("\"auto\" leaves a sortable header row without the bar; \"always\" shows the bar next to it", () => {
    const matrix = createMatrix({ showSortBar: "auto" });
    matrix.onFirstRendering();
    expect([matrix.canSortByHeaders, matrix.isSortBarVisible, placement(matrix), hasHeaderClass(matrix)], "#1: no bar")
      .toEqual([true, false, [false, false, "none"], false]);
    expect(header(matrix, "price").toggleSort(), "#2: the headers sort").toBe(true);
    expect(sortOf(matrix), "#3").toEqual([{ field: "price", direction: "desc" }]);
    matrix.showSortBar = "always";
    expect([matrix.isSortBarVisible, placement(matrix), hasHeaderClass(matrix)], "#4: always").toEqual([true, [true, true, "header"], true]);
    expect(header(matrix, "price").isSortable, "#5: the headers still sort").toBe(true);
    matrix.showSortBar = "auto";
    expect([matrix.isSortBarVisible, placement(matrix), hasHeaderClass(matrix)], "#6: back to auto").toEqual([false, [false, false, "none"], false]);
  });
  test("\"auto\" shows the bar where the headers do not sort: no header row, the vertical layout, a phone; each switched both ways", () => {
    const matrix = createMatrix({ showSortBar: "auto" });
    matrix.onFirstRendering();
    const check = (change: () => void, undo: () => void, name: string): void => {
      change();
      expect([matrix.canSortByHeaders, placement(matrix), hasHeaderClass(matrix)], name).toEqual([false, [true, true, "header"], true]);
      undo();
      expect([matrix.canSortByHeaders, placement(matrix), hasHeaderClass(matrix)], name + ", undone").toEqual([true, [false, false, "none"], false]);
    };
    check(() => { matrix.showHeader = false; }, () => { matrix.showHeader = true; }, "#1: no header row");
    check(() => { matrix.transposeData = true; }, () => { matrix.transposeData = false; }, "#2: the vertical layout on a desktop");
    check(() => { matrix.survey.setIsMobile(true); }, () => { matrix.survey.setIsMobile(false); }, "#3: a phone");
    expect(placement(createMatrix({ showSortBar: "auto", showHeader: false })), "#4: no header row from JSON").toEqual([true, true, "header"]);
    expect(placement(createMatrix({ showSortBar: "auto", transposeData: true })), "#5: the vertical layout from JSON").toEqual([true, true, "header"]);
  });
  test("\"always\" without allowSort shows no bar and no sortable header", () => {
    const matrix = createMatrix({ allowSort: false, showSortBar: "always" });
    expect([matrix.isSortBarVisible, placement(matrix), header(matrix, "price").isSortable], "#1").toEqual([false, [false, false, "none"], false]);
  });
  test("the dynamic panel has no showSortBar: allowSort alone shows its bar, and a JSON showSortMenu changes nothing", () => {
    const panel = createPanel();
    expect([panel.isSortBarVisible, placement(panel)], "#1").toEqual([true, [true, true, "header"]]);
    panel.allowSort = false;
    expect([panel.isSortBarVisible, placement(panel)], "#2").toEqual([false, [false, false, "none"]]);
    expect([!!Serializer.findProperty("paneldynamic", "showSortBar"), !!Serializer.findProperty("paneldynamic", "showSortMenu"), "showSortBar" in panel],
      "#3: no such property").toEqual([false, false, false]);
    const legacy = createPanel({ showSortMenu: false });
    expect([placement(legacy), "showSortMenu" in legacy.toJSON(), "showSortBar" in legacy.toJSON()], "#4").toEqual([[true, true, "header"], false, false]);
  });
  test("JSON: \"auto\" is not written, \"always\" round-trips, true loads as \"always\", false and an unknown value as \"auto\"; the setter maps the same", () => {
    const loaded = (json: any): Array<any> => {
      const matrix = loadMatrix(json);
      const saved = matrix.toJSON();
      return [matrix.showSortBar, saved.showSortBar, "showSortMenu" in saved];
    };
    expect(loaded({}), "#1: the default").toEqual(["auto", undefined, false]);
    expect(loaded({ showSortBar: "auto" }), "#2").toEqual(["auto", undefined, false]);
    expect(loaded({ showSortBar: "always" }), "#3").toEqual(["always", "always", false]);
    expect(loaded({ showSortBar: true }), "#4").toEqual(["always", "always", false]);
    expect(loaded({ showSortBar: false }), "#5").toEqual(["auto", undefined, false]);
    const unknown = createMatrix({ showSortBar: "never" });
    expect([unknown.showSortBar, unknown.toJSON().showSortBar], "#6: an unknown value").toEqual(["auto", undefined]);
    const matrix = createMatrix();
    const set = (val: any): string => { matrix.showSortBar = val; return matrix.showSortBar; };
    expect([set(true), set(false), set("always"), set("never"), set("always"), set(undefined)], "#7: from code").toEqual(["always", "auto", "always", "auto", "always", "auto"]);
  });
  test("JSON: the released showSortMenu loads into showSortBar with the same mapping and is saved as showSortBar", () => {
    const loaded = (value: any): Array<any> => {
      const matrix = loadMatrix({ showSortMenu: value });
      const saved = matrix.toJSON();
      return [matrix.showSortBar, saved.showSortBar, "showSortMenu" in saved];
    };
    expect(loaded("auto"), "#1").toEqual(["auto", undefined, false]);
    expect(loaded(true), "#2: it showed the bar next to the headers").toEqual(["always", "always", false]);
    expect(loaded(false), "#3").toEqual(["auto", undefined, false]);
    expect(placement(loadMatrix({ showSortMenu: true })), "#4").toEqual([true, true, "header"]);
  });
  test("the property grid: the sort properties show on the dynamic types and not on the Multi-Select Matrix", () => {
    const visible = (type: string, name: string): boolean => {
      const prop = Serializer.findProperty(type, name);
      return !!prop && prop.visible;
    };
    const names = ["allowSort", "maxSortLevel", "sortCriteria", "showSortBar", "filterExpression"];
    expect(names.map((name: string): Array<boolean> => [visible("matrixdynamic", name), visible("paneldynamic", name), visible("matrixdropdown", name)]), "#1")
      .toEqual([[true, true, false], [true, true, false], [true, true, false], [true, false, false], [false, false, false]]);
    expect(["maxSortLevel", "showSortBar"].map((name: string): Array<string> => Serializer.findProperty("matrixdynamic", name).dependsOn), "#2")
      .toEqual([["allowSort"], ["allowSort"]]);
    expect(Serializer.findProperty("paneldynamic", "maxSortLevel").dependsOn, "#3").toEqual(["allowSort"]);
  });
  test("the property grid: maxSortLevel and showSortBar follow allowSort, sortCriteria does not", () => {
    const isVisible = (obj: any, name: string): boolean => Serializer.findProperty(obj.getType(), name).isVisible("", obj);
    const matrix = createMatrix({ allowSort: false });
    const panel = createPanel({ allowSort: false });
    const read = (): Array<boolean> => [isVisible(matrix, "maxSortLevel"), isVisible(matrix, "showSortBar"), isVisible(matrix, "sortCriteria"),
      isVisible(panel, "maxSortLevel"), isVisible(panel, "sortCriteria")];
    expect(read(), "#1: allowSort false").toEqual([false, false, true, false, true]);
    matrix.allowSort = true;
    panel.allowSort = true;
    expect(read(), "#2: allowSort true").toEqual([true, true, true, true, true]);
  });
  test("the property grid: a column's allowSort shows on a column of a Dynamic Matrix that allows sorting", () => {
    const prop = Serializer.findProperty("matrixdropdowncolumn", "allowSort");
    const matrix = createMatrix({ allowSort: false });
    const column = matrix.getColumnByName("price");
    expect([prop.visible, prop.isVisible("", column)], "#1: the matrix does not sort").toEqual([true, false]);
    matrix.allowSort = true;
    expect(prop.isVisible("", column), "#2").toBe(true);
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "fixed", allowSort: true, rows: ["r1"], columns: productColumns }] });
    const fixed = <QuestionMatrixDropdownModel>survey.getQuestionByName("fixed");
    expect(prop.isVisible("", fixed.getColumnByName("price")), "#3: the Multi-Select Matrix").toBe(false);
  });
  test("the Multi-Select Matrix redeclares the sort properties hidden and changes nothing else", () => {
    const names = ["allowSort", "maxSortLevel", "sortCriteria", "showSortBar"];
    const describeProp = (type: string, name: string): Array<any> => {
      const prop = Serializer.findProperty(type, name);
      return [prop.type, prop.defaultValue, prop.className, prop.isArray, prop.alternativeName, prop.choices];
    };
    names.forEach((name: string): void => {
      expect(describeProp("matrixdropdown", name), name).toEqual(describeProp("matrixdynamic", name));
    });
    const json = { type: "matrixdropdown", name: "fixed", rows: ["r1"], columns: [{ name: "price" }],
      allowSort: true, maxSortLevel: 2, showSortBar: "always", sortCriteria: [{ field: "price", direction: "desc" }] };
    const survey = new SurveyModel({ elements: [json] });
    const saved = survey.getQuestionByName("fixed").toJSON();
    expect([saved.allowSort, saved.maxSortLevel, saved.showSortBar, saved.sortCriteria], "#1: a JSON round trip")
      .toEqual([true, 2, "always", [{ field: "price", direction: "desc" }]]);
    const defaults = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "fixed", rows: ["r1"], columns: [{ name: "price" }] }] });
    const savedDefaults = defaults.getQuestionByName("fixed").toJSON();
    expect(names.map((name: string): boolean => name in savedDefaults), "#2: the defaults are not written").toEqual([false, false, false, false]);
  });
});

describe("Sort bar: where it goes", () => {
  test("in the header with the title on top or on the left, above the records otherwise", () => {
    expect(createMatrix().sortBarLocation, "#1: top").toBe("header");
    expect(createPanel({ titleLocation: "left" }).sortBarLocation, "#2: left").toBe("header");
    expect(createMatrix({ titleLocation: "hidden" }).sortBarLocation, "#3: hidden").toBe("top");
    expect(createMatrix({ titleLocation: "bottom" }).sortBarLocation, "#4: bottom").toBe("top");
    expect(createMatrix({ title: "" }).sortBarLocation, "#5: an empty title falls back to the name and renders").toBe("header");
  });
  test("it follows a runtime allowSort change with nothing else reading it", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", showSortBar: "always", columns: productColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.allowSort = true;
    expect([matrix.sortBarLocation, matrix.hasAdditionalTitleToolbar], "#1").toEqual(["header", true]);
    matrix.allowSort = false;
    expect([matrix.sortBarLocation, matrix.hasAdditionalTitleToolbar], "#2").toEqual(["none", false]);
  });
  test("the question's own title location, both ways", () => {
    const matrix = createMatrix();
    matrix.titleLocation = "hidden";
    expect(matrix.sortBarLocation, "#1: top -> hidden").toBe("top");
    matrix.titleLocation = "top";
    expect(matrix.sortBarLocation, "#2: hidden -> top").toBe("header");
    matrix.titleLocation = "bottom";
    expect(matrix.sortBarLocation, "#3: top -> bottom").toBe("top");
    matrix.titleLocation = "default";
    expect(matrix.sortBarLocation, "#4").toBe("header");
  });
  test("the survey's and a parent panel's questionTitleLocation", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "box", elements: [
      { type: "matrixdynamic", name: "matrix", allowSort: true, showSortBar: "always", columns: productColumns }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const box = <PanelModel>survey.getPanelByName("box");
    survey.questionTitleLocation = "bottom";
    expect(matrix.sortBarLocation, "#1: the survey").toBe("top");
    survey.questionTitleLocation = "top";
    expect(matrix.sortBarLocation, "#2").toBe("header");
    box.questionTitleLocation = "hidden";
    expect(matrix.sortBarLocation, "#3: the panel").toBe("top");
    box.questionTitleLocation = "default";
    expect(matrix.sortBarLocation, "#4").toBe("header");
  });
  test("a move into a panel whose question titles are hidden, and back", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "box", questionTitleLocation: "hidden" },
      { type: "matrixdynamic", name: "matrix", allowSort: true, showSortBar: "always", columns: productColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const box = <PanelModel>survey.getPanelByName("box");
    expect(matrix.sortBarLocation, "#1").toBe("header");
    box.addElement(matrix);
    expect(matrix.sortBarLocation, "#2: moved in").toBe("top");
    survey.pages[0].addElement(matrix);
    expect(matrix.sortBarLocation, "#3: moved out").toBe("header");
  });
  test("a question on a hidden page catches up with a title location change when it renders", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "text", name: "q1" }] },
      { name: "p2", visible: false, elements: [{ type: "matrixdynamic", name: "matrix", allowSort: true, showSortBar: "always", columns: productColumns }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.sortBarLocation, "#1").toBe("header");
    survey.questionTitleLocation = "bottom";
    survey.getPageByName("p2").visible = true;
    expect(matrix.sortBarLocation, "#2: the survey's css walk skipped the hidden page").toBe("header");
    matrix.onFirstRendering();
    expect(matrix.sortBarLocation, "#3").toBe("top");
  });
  test("the header takes a modifier class while it holds the bar", () => {
    const matrix = createMatrix();
    matrix.onFirstRendering();
    expect(matrix.cssHeader.indexOf("sd-question__header--sort-bar") > -1, "#1").toBe(true);
    matrix.allowSort = false;
    expect(matrix.cssHeader.indexOf("sd-question__header--sort-bar") > -1, "#2").toBe(false);
    matrix.allowSort = true;
    matrix.titleLocation = "hidden";
    expect(matrix.cssHeader.indexOf("sd-question__header--sort-bar") > -1, "#3").toBe(false);
  });
  test("the header holds the bar's container: additionalTitleToolbar is recordsBar.sortActions", () => {
    const matrix = createMatrix();
    expect(matrix.additionalTitleToolbar, "#1").toBe(matrix.recordsBar.sortActions);
    expect(matrix.recordsBar.sortActions.containerCss, "#2").toBe("sd-matrixdynamic__sort-bar");
    expect(createPanel().recordsBar.sortActions.containerCss, "#3").toBe("sd-paneldynamic__sort-bar");
  });
});

describe("Sort bar: a pick validates the page it replaces", () => {
  test("a pick that would leave an empty required cell is refused, and the bar keeps the old sort", () => {
    const matrix = createMatrix({ pageSize: 2, columns: productColumns.map((column: any): any =>
      column.name === "product" ? Object.assign({ isRequired: true }, column) : column) });
    matrix.value = [{ price: 1 }, { product: "x", price: 2 }, { product: "y", price: 3 }];
    matrix.visibleRows;
    pickField(matrix, "Price");
    expect(sortOf(matrix), "#1").toEqual([]);
    expect(shown(matrix), "#2").toEqual(["Product", "Default", "Product", "Default"]);
    matrix.sort("price", "asc");
    matrix.visibleRows;
    pickDirection(matrix, "High - Low");
    expect([sortOf(matrix), shown(matrix)], "#3").toEqual([[{ field: "price", direction: "asc" }], ["Price", "Low - High", "Price", "Low - High"]]);
  });
  test("an asynchronous validator: the bar is disabled while it runs, and the sort applies when it passes", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("sortBarAsyncFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const matrix = createMatrix({ pageSize: 2, columns: productColumns.map((column: any): any =>
        column.name === "product" ? Object.assign({ validators: [{ type: "expression", expression: "sortBarAsyncFunc({row.product}) = 1" }] }, column) : column) });
      matrix.visibleRows;
      expect(enabledOf(matrix), "#1").toEqual([true, false, true]);
      pickField(matrix, "Price");
      expect(matrix.isPageMovePending, "#2: the pick waits").toBe(true);
      expect(enabledOf(matrix), "#3").toEqual([false, false, false]);
      expect([sortOf(matrix), shown(matrix)], "#4: not sorted yet").toEqual([[], ["Product", "Default", "Product", "Default"]]);
      results.forEach(setResult => setResult(1));
      expect(sortOf(matrix), "#5").toEqual([{ field: "price", direction: "desc" }]);
      expect(shown(matrix), "#6").toEqual(["Price", "High - Low", "Price", "High - Low"]);
      expect(enabledOf(matrix), "#7").toEqual([true, false, true]);
    } finally {
      FunctionFactory.Instance.unregister("sortBarAsyncFunc");
    }
  });
});

describe("Sort bar: the locale", () => {
  const testLocale = "sort-bar-test";
  afterEach(() => { delete surveyLocalization.locales[testLocale]; });
  test("a locale change updates Sort by, the direction titles and the field titles", () => {
    surveyLocalization.locales[testLocale] = { sortByText: "Order", sortHighLowText: "Big first", sortDefaultText: "Stored", sortLowHighText: "Small first" };
    const matrix = createMatrix({ columns: productColumns.map((column: any): any =>
      column.name === "price" ? Object.assign({}, column, { title: { default: "Price", [testLocale]: "Cost" } }) : column) });
    pickField(matrix, "Price");
    expect([getAction(matrix, "sv-sort-by").title, shown(matrix)], "#1").toEqual(["Sort by", ["Price", "High - Low", "Price", "High - Low"]]);
    matrix.survey.locale = testLocale;
    expect([getAction(matrix, "sv-sort-by").title, shown(matrix)], "#2").toEqual(["Order", ["Cost", "Big first", "Cost", "Big first"]]);
    expect(titlesOf(directionList(matrix)), "#3").toEqual(["Stored", "Big first", "Small first"]);
    matrix.survey.locale = "";
    expect(getAction(matrix, "sv-sort-by").title, "#4").toBe("Sort by");
  });
});

describe("Sort bar: the object", () => {
  test("created once and disposed with the question, together with its container", () => {
    const matrix = createMatrix();
    const bar = matrix.recordsBar;
    expect(isSortBarBuilt(matrix), "#1: built on its first read").toBe(false);
    const actions = bar.sortActions;
    expect(bar.sortActions, "#2").toBe(actions);
    pickField(matrix, "Price");
    expect([matrix.recordsBar, bar.sortActions], "#3").toEqual([bar, actions]);
    matrix.dispose();
    expect([bar.isDisposed, actions.isDisposed], "#4").toEqual([true, true]);
  });
  test("an open list keeps its items while what they show does not change", () => {
    const matrix = createMatrix();
    const field = fieldList(matrix).actions[0];
    matrix.sort("price", "asc");
    expect(fieldList(matrix).actions[0], "#1: a sort").toBe(field);
    const direction = directionList(matrix).actions[1];
    matrix.sort("price", "desc");
    expect(directionList(matrix).actions[1], "#2: the same type").toBe(direction);
    matrix.sort("product", "asc");
    expect(directionList(matrix).actions[1] === direction, "#3: another type").toBe(false);
  });
});
// The suffix of a level's item ids: the first level keeps the ids of a bar with one level.
const levelId = (name: string, level: number): string => level === 1 ? name : name + "-" + level;
const levelFieldList = (q: QuestionRecordsModel, level: number): ListModel => getList(q, levelId("sv-sort-field", level));
const levelDirectionList = (q: QuestionRecordsModel, level: number): ListModel => getList(q, levelId("sv-sort-direction", level));
// What a level shows: the titles of its two buttons and whether it has a remove button.
function levelShown(q: QuestionRecordsModel, level: number): Array<any> {
  return [getAction(q, levelId("sv-sort-field", level)).title, getAction(q, levelId("sv-sort-direction", level)).title,
    !!getAction(q, "sv-sort-remove-" + level)];
}
// The items the bar shows: "More..." is in the bar out of sight (mode "removed") until the bar is fitted.
const barIds = (q: QuestionRecordsModel): Array<string> => q.recordsBar.sortActions.visibleActions.filter((item: Action): boolean => item.isVisible).map((item: Action): string => item.id);
const addAction = (q: QuestionRecordsModel): Action => getAction(q, "sv-sort-add");
const addLevel = (q: QuestionRecordsModel): void => { addAction(q).action(); };
const removeLevel = (q: QuestionRecordsModel, level: number): void => { getAction(q, "sv-sort-remove-" + level).action(); };

describe("Sort bar: several levels", () => {
  test("\"Sort by\" comes first, then the group of the first level with its field and its direction", () => {
    const matrix = createMatrix();
    expect(barIds(matrix), "#1").toEqual(["sv-sort-by", "sv-sort-level"]);
    expect(levelsOf(matrix)[0].visibleActions.map((item: Action): string => item.id), "#2").toEqual(["sv-sort-field", "sv-sort-direction"]);
    expect(getAction(matrix, "sv-sort-level").component, "#3").toBe("sv-sort-bar-level");
    expect(levelsOf(matrix)[0].containerCss, "#4").toBe("sd-sort-bar__level");
  });
  test("\"+\" shows while more than one level is allowed, and is disabled while nothing is sorted", () => {
    const matrix = createMatrix();
    expect([addAction(matrix).visible, getAction(matrix, "sv-sort-remove")], "#1: one level allowed").toEqual([false, undefined]);
    const multi = createMatrix({ maxSortLevel: 2 });
    expect(barIds(multi), "#2").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-add"]);
    expect([addAction(multi).visible, addAction(multi).enabled], "#3: nothing sorted").toEqual([true, false]);
    expect([addAction(multi).needSeparator, addAction(multi).title, addAction(multi).ariaLabel, addAction(multi).iconName], "#4")
      .toEqual([true, "Add sort level", "Add sort level", "icon-plus-16x16"]);
    pickField(multi, "Price");
    expect([addAction(multi).visible, addAction(multi).enabled], "#5").toEqual([true, true]);
  });
  test("\"+\" appends the first field no level has, in its type's first direction, and is disabled at the limit or when the fields run out", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    pickField(matrix, "Product");
    addLevel(matrix);
    expect(sortOf(matrix), "#1").toEqual([{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }]);
    expect([levelShown(matrix, 1), levelShown(matrix, 2)], "#2").toEqual([["Product", "Alphabet, A - Z", false], ["Category", "Alphabet, A - Z", true]]);
    expect([barIds(matrix), addAction(matrix).enabled], "#3: the limit is reached").toEqual([["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-add"], false]);
    expect([getAction(matrix, "sv-sort-level-2").needSeparator, getAction(matrix, "sv-sort-level").needSeparator], "#4").toEqual([true, false]);
    const three = createMatrix({ maxSortLevel: 3 });
    pickField(three, "Product");
    addLevel(three);
    expect([addAction(three).visible, addAction(three).enabled], "#5").toEqual([true, true]);
    addLevel(three);
    expect(sortOf(three), "#6").toEqual([{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }, { field: "price", direction: "desc" }]);
    expect([levelShown(three, 3), addAction(three).visible, addAction(three).enabled], "#7").toEqual([["Price", "High - Low", true], true, false]);
    const twoFields = createMatrix({ maxSortLevel: 3, columns: productColumns.map((column: any): any =>
      column.name === "product" || column.name === "category" ? column : Object.assign({ allowSort: false }, column)) });
    pickField(twoFields, "Product");
    addLevel(twoFields);
    expect([sortOf(twoFields).length, addAction(twoFields).visible, addAction(twoFields).enabled], "#8: no field is left").toEqual([2, true, false]);
    const sorted = sortOf(twoFields);
    addLevel(twoFields);
    expect(sortOf(twoFields), "#9: a disabled \"+\" adds nothing").toEqual(sorted);
  });
  test("\"+\" stays visible while more than one level is allowed and is enabled only while a level can be added", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    const addState = (): Array<boolean> => [addAction(matrix).visible, addAction(matrix).enabled];
    expect(addState(), "#1: nothing sorted").toEqual([true, false]);
    matrix.sort(<any>[{ field: "product", direction: "asc" }]);
    expect(addState(), "#2: one level").toEqual([true, true]);
    matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }]);
    expect(addState(), "#3: maxSortLevel levels").toEqual([true, false]);
    matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }, { field: "price", direction: "asc" }]);
    expect(addState(), "#4: more levels than maxSortLevel, from code").toEqual([true, false]);
    matrix.sort(<any>[{ field: "product", direction: "asc" }]);
    expect(addState(), "#5: back under the limit").toEqual([true, true]);
    matrix.maxSortLevel = 1;
    expect(addAction(matrix).visible, "#6: one level allowed").toBe(false);
  });
  test("a field pick in a later level replaces only that level; a level's list leaves out the fields of the other levels", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    matrix.sort(<any>[{ field: "product", direction: "desc" }, { field: "category", direction: "asc" }]);
    expect(titlesOf(levelFieldList(matrix, 1)), "#1").toEqual(["Product", "Price", "Discontinued"]);
    expect(titlesOf(levelFieldList(matrix, 2)), "#2").toEqual(["Category", "Price", "Discontinued"]);
    pick(levelFieldList(matrix, 2), "Price");
    expect(sortOf(matrix), "#3").toEqual([{ field: "product", direction: "desc" }, { field: "price", direction: "desc" }]);
    expect(levelShown(matrix, 2), "#4").toEqual(["Price", "High - Low", true]);
    expect(titlesOf(levelFieldList(matrix, 1)), "#5").toEqual(["Product", "Category", "Discontinued"]);
    expect(levelFieldList(matrix, 2).selectedItem.title, "#6").toBe("Price");
    let validations = 0;
    matrix.survey.onValidateQuestion.add(() => { validations++; });
    pick(levelFieldList(matrix, 2), "Price");
    expect([sortOf(matrix)[1], validations], "#7: the field it has changes nothing").toEqual([{ field: "price", direction: "desc" }, 0]);
  });
  test("a direction pick in a later level changes only that level; Default in the first level clears the whole sort", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    matrix.sort(<any>[{ field: "product", direction: "desc" }, { field: "price", direction: "desc" }]);
    expect(titlesOf(levelDirectionList(matrix, 2)), "#1: no Default").toEqual(["High - Low", "Low - High"]);
    pick(levelDirectionList(matrix, 2), "Low - High");
    expect(sortOf(matrix), "#2").toEqual([{ field: "product", direction: "desc" }, { field: "price", direction: "asc" }]);
    expect([levelShown(matrix, 2), levelDirectionList(matrix, 2).selectedItem.title], "#3").toEqual([["Price", "Low - High", true], "Low - High"]);
    pick(levelDirectionList(matrix, 1), "Alphabet, A - Z");
    expect(sortOf(matrix), "#4: the first level").toEqual([{ field: "product", direction: "asc" }, { field: "price", direction: "asc" }]);
    pick(levelDirectionList(matrix, 1), "Default");
    expect(sortOf(matrix), "#5").toEqual([]);
    expect([barIds(matrix), levelShown(matrix, 1)], "#6: one group again").toEqual([["sv-sort-by", "sv-sort-level", "sv-sort-add"], ["Product", "Default", false]]);
  });
  test("the remove button takes its level out; the other levels keep their order", () => {
    const matrix = createMatrix({ maxSortLevel: 3 });
    matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }, { field: "price", direction: "asc" }]);
    expect([getAction(matrix, "sv-sort-remove-2").title, getAction(matrix, "sv-sort-remove-2").ariaLabel, getAction(matrix, "sv-sort-remove-3").title], "#1")
      .toEqual(["Remove sort level 2", "Remove sort level 2", "Remove sort level 3"]);
    removeLevel(matrix, 2);
    expect(sortOf(matrix), "#2").toEqual([{ field: "product", direction: "asc" }, { field: "price", direction: "asc" }]);
    expect(barIds(matrix), "#3").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-add"]);
    expect([levelShown(matrix, 1), levelShown(matrix, 2)], "#4").toEqual([["Product", "Alphabet, A - Z", false], ["Price", "Low - High", true]]);
    expect(getAction(matrix, "sv-sort-remove-3"), "#5").toBeUndefined();
  });
  test("a sort of three levels from code shows three groups while one level is allowed, with no \"+\"", () => {
    const matrix = createMatrix();
    matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }, { field: "price", direction: "asc" }]);
    expect(barIds(matrix), "#1").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3"]);
    expect([levelShown(matrix, 1), levelShown(matrix, 2), levelShown(matrix, 3)], "#2").toEqual(
      [["Product", "Alphabet, A - Z", false], ["Category", "Alphabet, Z - A", true], ["Price", "Low - High", true]]);
    expect(addAction(matrix).visible, "#3").toBe(false);
    removeLevel(matrix, 3);
    expect(barIds(matrix), "#4: still no \"+\" at the limit of one level").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2"]);
  });
  test("a modified header click adds a group, and a remove button clears that header's arrow", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    header(matrix, "product").toggleSort(false);
    header(matrix, "price").toggleSort(true);
    expect([barIds(matrix), addAction(matrix).enabled], "#1").toEqual([["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-add"], false]);
    expect(levelShown(matrix, 2), "#2").toEqual(["Price", "High - Low", true]);
    expect(header(matrix, "price").sortDirection, "#3").toBe("desc");
    removeLevel(matrix, 2);
    expect([header(matrix, "price").sortDirection, header(matrix, "product").sortDirection], "#4").toEqual([undefined, "asc"]);
    expect(barIds(matrix), "#5").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-add"]);
  });
  test("a level pick, \"+\" and a remove button that would leave an empty required cell are refused, and every group keeps the old sort", () => {
    const matrix = createMatrix({ pageSize: 2, maxSortLevel: 3, columns: productColumns.map((column: any): any =>
      column.name === "product" ? Object.assign({ isRequired: true }, column) : column) });
    matrix.value = [{ price: 1, category: "toys" }, { product: "x", price: 2, category: "tools" }, { product: "y", price: 3, category: "toys" }];
    const twoLevels = [{ field: "price", direction: "asc" }, { field: "category", direction: "asc" }];
    matrix.sort(<any>twoLevels);
    matrix.visibleRows;
    const old = [levelShown(matrix, 1), levelShown(matrix, 2)];
    pick(levelFieldList(matrix, 2), "Discontinued");
    expect([sortOf(matrix), levelShown(matrix, 1), levelShown(matrix, 2)], "#1: a field pick").toEqual([twoLevels].concat(old));
    pick(levelDirectionList(matrix, 2), "Alphabet, Z - A");
    expect([sortOf(matrix), levelShown(matrix, 2), levelDirectionList(matrix, 2).selectedItem.title], "#2: a direction pick")
      .toEqual([twoLevels, old[1], "Alphabet, A - Z"]);
    addLevel(matrix);
    expect([sortOf(matrix), barIds(matrix)], "#3: \"+\"").toEqual([twoLevels, ["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-add"]]);
    removeLevel(matrix, 2);
    expect([sortOf(matrix), barIds(matrix), levelShown(matrix, 2)], "#4: remove").toEqual([twoLevels,
      ["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-add"], old[1]]);
  });
  const testLocale = "sort-levels-test";
  test("a locale change updates the titles of every group and the accessible names with level numbers", () => {
    surveyLocalization.locales[testLocale] = { sortHighLowText: "Big first", sortAZText: "A first", sortFieldAriaLabel: "Field",
      sortLevelFieldAriaLabel: "Field {0}", sortLevelDirectionAriaLabel: "Order {0}", sortRemoveLevelText: "Drop level {0}", sortAddLevelText: "More levels" };
    try {
      const matrix = createMatrix({ maxSortLevel: 3 });
      matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "price", direction: "desc" }]);
      const labels = (): Array<string> => [getAction(matrix, "sv-sort-field").ariaLabel, getAction(matrix, "sv-sort-field-2").ariaLabel,
        getAction(matrix, "sv-sort-direction-2").ariaLabel, getAction(matrix, "sv-sort-remove-2").title, addAction(matrix).title];
      expect(labels(), "#1").toEqual(["Sort field Product", "Sort field 2 Price", "Sort order 2 High - Low", "Remove sort level 2", "Add sort level"]);
      matrix.survey.locale = testLocale;
      expect([levelShown(matrix, 1), levelShown(matrix, 2)], "#2").toEqual([["Product", "A first", false], ["Price", "Big first", true]]);
      expect(labels(), "#3").toEqual(["Field Product", "Field 2 Price", "Order 2 Big first", "Drop level 2", "More levels"]);
      matrix.survey.locale = "";
      expect(labels(), "#4").toEqual(["Sort field Product", "Sort field 2 Price", "Sort order 2 High - Low", "Remove sort level 2", "Add sort level"]);
    } finally {
      delete surveyLocalization.locales[testLocale];
    }
  });
  test("a change in the number of levels keeps every surviving item and disposes only the removed group", () => {
    const matrix = createMatrix({ maxSortLevel: 3 });
    const bar = matrix.recordsBar.sortActions;
    matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }, { field: "price", direction: "asc" }]);
    const before = bar.actions.slice();
    expect(before.map((item: Action): string => item.id), "#1").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3", "sv-sort-more", "sv-sort-add"]);
    const levels = levelsOf(matrix);
    const field3 = getAction(matrix, "sv-sort-field-3");
    const list3 = <ListModel>field3.data;
    const kept: Array<any> = [before[0], before[1], before[2], before[4], before[5], levels[0], levels[1], getAction(matrix, "sv-sort-field-2"),
      getList(matrix, "sv-sort-field-2"), getAction(matrix, "sv-sort-field").popupModel];
    const setItems = vi.spyOn(bar, "setItems");
    removeLevel(matrix, 2);
    expect(setItems, "#2: one new items array").toHaveBeenCalledTimes(1);
    const items = setItems.mock.calls[0][0];
    expect([items[0] === before[0], items[1] === before[1], items[2] === before[2], items[3] === before[4], items[4] === before[5], items.length], "#3")
      .toEqual([true, true, true, true, true, 5]);
    expect(bar.actions.every((item: Action, index: number): boolean => item === items[index]), "#4").toBe(true);
    expect([before[3].isDisposed, levels[2].isDisposed, field3.isDisposed, field3.popupModel.isDisposed, list3.isDisposed], "#5: the third group").toEqual([true, true, true, true, true]);
    expect(kept.map((item: any): boolean => item.isDisposed), "#6: nothing else").toEqual(kept.map((): boolean => false));
    expect(levelShown(matrix, 2), "#7: re-synced").toEqual(["Price", "Low - High", true]);
    setItems.mockClear();
    const levelItems = levelsOf(matrix).map((level: ActionContainer): Array<Action> => level.actions.slice());
    pick(levelDirectionList(matrix, 2), "High - Low");
    pick(levelFieldList(matrix, 1), "Discontinued");
    expect(setItems, "#8: a pick inside a level").not.toHaveBeenCalled();
    expect(levelsOf(matrix).map((level: ActionContainer): Array<Action> => level.actions.slice()), "#9").toEqual(levelItems);
    expect(levelsOf(matrix)[1].actions[0], "#10").toBe(levelItems[1][0]);
    addLevel(matrix);
    const added = setItems.mock.calls[0][0];
    expect([added.length, added[3] === before[4], added[2] === before[2], kept.indexOf(added[3]) > -1], "#11: a new group, then the same \"More...\" and \"+\"")
      .toEqual([6, false, true, false]);
    expect([added[4] === before[4], added[5] === before[5]], "#12").toEqual([true, true]);
    setItems.mockRestore();
  });
  test("a runtime maxSortLevel change shows \"+\" with nothing else reading it", () => {
    const matrix = createMatrix();
    expect(addAction(matrix).visible, "#1").toBe(false);
    matrix.maxSortLevel = 2;
    expect(addAction(matrix).visible, "#2").toBe(true);
    matrix.maxSortLevel = 1;
    expect(addAction(matrix).visible, "#3").toBe(false);
  });
  test("the remove button and \"+\" are icon buttons in the design's appearance", () => {
    const matrix = createMatrix({ maxSortLevel: 3 });
    matrix.sort(<any>[{ field: "product", direction: "asc" }, { field: "price", direction: "asc" }]);
    const remove = getAction(matrix, "sv-sort-remove-2");
    expect([remove.iconName, remove.hasTitle, remove.getActionBarItemCss().split(" ").filter((name: string): boolean => name.indexOf("sd-action--") === 0)], "#1")
      .toEqual(["icon-delete-16x16", false, ["sd-action--neutral", "sd-action--quaternary", "sd-action--x-small", "sd-action--border"]]);
    expect([addAction(matrix).hasTitle, addAction(matrix).getActionBarItemCss().split(" ").filter((name: string): boolean => name.indexOf("sd-action--") === 0)], "#2")
      .toEqual([false, ["sd-action--neutral", "sd-action--tertiary", "sd-action--x-small", "sd-action--border"]]);
  });
});
