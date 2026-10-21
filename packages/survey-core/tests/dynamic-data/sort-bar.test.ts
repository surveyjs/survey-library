import { describe, test, expect, afterEach } from "vitest";
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
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0, allowSort: true, columns: productColumns
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
function getAction(q: QuestionRecordsModel, id: string): Action {
  return <Action>q.recordsBar.sortActions.getActionById(id);
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
  test("a sort of several levels shows its first one; a pick of what shows keeps every level", () => {
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
    expect(sortOf(matrix), "#5").toEqual([{ field: "price", direction: "asc" }]);
    matrix.sort(<any>twoLevels);
    pickField(matrix, "Product");
    expect(sortOf(matrix), "#6").toEqual([{ field: "product", direction: "asc" }]);
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
  test("hidden without allowSort, with showSortMenu false, in design mode, while collapsed and with no field; each undone", () => {
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
    check(() => { matrix.showSortMenu = false; }, () => { matrix.showSortMenu = true; }, "#3: showSortMenu");
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
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "matrix", allowSort: true, rows: ["r1", "r2"], columns: productColumns }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(placement(matrix), "#1").toEqual([true, true, "header"]);
    expect(titlesOf(fieldList(matrix)), "#2").toEqual(["Product", "Category", "Price", "Discontinued"]);
  });
  test("a released JSON \"showSortMenu\": \"auto\" loads as true", () => {
    const matrix = createMatrix({ showSortMenu: "auto" });
    expect([matrix.showSortMenu, matrix.isSortMenuVisible, placement(matrix)], "#1").toEqual([true, true, [true, true, "header"]]);
  });
  test("a question without allowSort creates no bar to place it", () => {
    const matrix = createMatrix({ allowSort: false });
    expect([(<any>matrix).recordsBarValue, matrix.sortBarLocation, matrix.hasAdditionalTitleToolbar], "#1").toEqual([undefined, "none", false]);
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
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", columns: productColumns }] });
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
      { type: "matrixdynamic", name: "matrix", allowSort: true, columns: productColumns }] }] });
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
      { type: "matrixdynamic", name: "matrix", allowSort: true, columns: productColumns }] });
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
      { name: "p2", visible: false, elements: [{ type: "matrixdynamic", name: "matrix", allowSort: true, columns: productColumns }] }] });
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
