import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionRecordsModel } from "../../src/question_records";
import { FunctionFactory } from "../../src/functionsfactory";
import { surveyLocalization } from "../../src/surveyStrings";
import { settings } from "../../src/settings";
import { Action } from "../../src/actions/action";
import { ListModel } from "../../src/list";
import { ActionContainer } from "../../src/actions/container";
import { UpdateResponsivenessMode } from "../../src/actions/adaptive-container";
import { PopupModalManager } from "../../src/popup-modal-manager";
import { PopupBaseViewModel } from "../../src/popup-view-model";
import { IDialogOptions } from "../../src/popup";
import { RecordsSortBarContainer } from "../../src/records/records-sort-bar";
import { RecordsSortDialogModel } from "../../src/records/records-sort-dialog";

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
function createMatrix(json?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0, allowSort: true, showSortBar: "always", maxSortLevel: 4, columns: productColumns
  }, json)] });
  survey.data = { matrix: productRows.map((row: any): any => Object.assign({}, row)) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
function createPanel(json?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "paneldynamic", name: "panel", title: "Products", allowSort: true, maxSortLevel: 4,
    templateElements: productColumns.map((column: any): any => {
      const res: any = Object.assign({}, column, { type: column.cellType });
      delete res.cellType;
      return res;
    })
  }, json)] });
  survey.data = { panel: productRows.map((row: any): any => Object.assign({}, row)) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
}
const threeLevels: Array<any> = [{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }, { field: "price", direction: "asc" }];
const barOf = (q: QuestionRecordsModel): RecordsSortBarContainer => <RecordsSortBarContainer>q.recordsBar.sortActions;
const barAction = (q: QuestionRecordsModel, id: string): Action => barOf(q).getActionById(id);
const moreOf = (q: QuestionRecordsModel): Action => barAction(q, "sv-sort-more");
function sortOf(q: QuestionRecordsModel): Array<any> {
  return q.sortCriteria.map((item: any): any => ({ field: item.field, direction: item.direction }));
}
function columnValues(matrix: QuestionMatrixDynamicModel, name: string): Array<any> {
  return matrix.visibleRows.map((row: any): any => row.getQuestionByName(name).value);
}
// The items the bar shows, as fit() leaves them.
const shownIds = (q: QuestionRecordsModel): Array<string> => barOf(q).visibleActions.filter((item: Action): boolean => item.isVisible).map((item: Action): string => item.id);
const sizes: { [id: string]: number } = { "sv-sort-by": 50, "sv-sort-level": 200, "sv-sort-level-2": 200, "sv-sort-level-3": 200, "sv-sort-more": 32, "sv-sort-add": 32 };
// The sizes a renderer's manager would measure; own sizes replace some of them.
function measure(q: QuestionRecordsModel, own?: { [id: string]: number }): void {
  const res = Object.assign({}, sizes, own);
  barOf(q).actions.forEach((item: Action): void => {
    item.maxDimension = res[item.id];
    item.minDimension = res[item.id];
  });
}
const gap = 12;
// "Sort by", the three levels and "+", with the gaps between them.
const allLevelsWidth = 50 + 3 * 200 + 32 + 4 * gap;

let manager: PopupModalManager;
let savedShowDialog: any;
let dialogOptions: Array<IDialogOptions>;
beforeEach(() => {
  savedShowDialog = settings.showDialog;
  manager = new PopupModalManager();
  dialogOptions = [];
  settings.showDialog = (options: IDialogOptions, rootElement?: HTMLElement): any => {
    dialogOptions.push(options);
    return manager.addDialog(options, rootElement);
  };
});
afterEach(() => {
  manager.clear();
  settings.showDialog = savedShowDialog;
});
interface IOpenDialog { dialog: RecordsSortDialogModel, popup: PopupBaseViewModel }
function openDialog(q: QuestionRecordsModel): IOpenDialog {
  moreOf(q).action();
  const modals = manager.getModals();
  const popup = modals[modals.length - 1];
  return { dialog: <RecordsSortDialogModel>popup.model.contentComponentData.model, popup: popup };
}
const rowActions = (dialog: RecordsSortDialogModel, index: number): Array<Action> => <Array<Action>>dialog.rows[index].actions;
const fieldListOf = (dialog: RecordsSortDialogModel, index: number): ListModel => <ListModel>rowActions(dialog, index)[0].data;
const directionListOf = (dialog: RecordsSortDialogModel, index: number): ListModel => <ListModel>rowActions(dialog, index)[1].data;
const titlesOf = (list: ListModel): Array<string> => list.actions.map((item: Action): string => item.title);
// Each row as the respondent sees it: the field, the direction and whether it has a remove button.
const rowsOf = (dialog: RecordsSortDialogModel): Array<Array<any>> => dialog.rows.map((row: ActionContainer): Array<any> =>
  [row.actions[0].title, row.actions[1].title, row.actions.length > 2]);
function pick(list: ListModel, title: string): void {
  const item = list.actions.filter((action: Action): boolean => action.title === title)[0];
  expect(item, "no item " + title).toBeTruthy();
  list.onItemClick(item);
}
const footerAction = (popup: PopupBaseViewModel, id: string): Action => popup.footerToolbar.getActionById(id);
const addNew = (popup: PopupBaseViewModel): Action => footerAction(popup, "sv-sort-dialog-add");
const removeRow = (dialog: RecordsSortDialogModel, index: number): void => { rowActions(dialog, index)[2].action(); };
const apply = (popup: PopupBaseViewModel): void => { footerAction(popup, "apply").action(); };

describe("Sort dialog: \"...\" in the bar", () => {
  test("fit() shows every level and \"+\" while they fit; otherwise levels leave from the last one and \"...\" takes the place of \"+\"", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const bar = barOf(matrix);
    measure(matrix);
    expect(shownIds(matrix), "#0: before a fit, \"...\" is out of sight").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3", "sv-sort-add"]);
    bar.fit({ availableSpace: allLevelsWidth, gap: gap });
    expect(shownIds(matrix), "#1: every level and \"+\" fit").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3", "sv-sort-add"]);
    bar.fit({ availableSpace: allLevelsWidth - 1, gap: gap });
    expect(shownIds(matrix), "#2: the last level and \"+\" leave, \"...\" shows")
      .toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-more"]);
    expect(barAction(matrix, "sv-sort-add").mode, "#2a").toBe("removed");
    bar.fit({ availableSpace: 50 + 200 + 32 + 2 * gap, gap: gap });
    expect(shownIds(matrix), "#3: room for level 1 only").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-more"]);
    const level2 = barAction(matrix, "sv-sort-level-2");
    expect([level2.mode, level2.isVisible, level2.getActionRootCss().indexOf("sd-action-bar__item--hidden") > -1], "#4: level 2 is out whole")
      .toEqual(["removed", false, true]);
    expect((<ActionContainer>level2.data).actions.map((item: Action): string => item.id), "#5: with its field, direction and remove button")
      .toEqual(["sv-sort-field-2", "sv-sort-direction-2", "sv-sort-remove-2"]);
    bar.fit({ availableSpace: 10, gap: gap });
    expect(["sv-sort-by", "sv-sort-level"].map((id: string): string => barAction(matrix, id).mode), "#6: never out").toEqual(["large", "large"]);
    expect(shownIds(matrix), "#6a").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-more"]);
    expect([moreOf(matrix).needSeparator, barAction(matrix, "sv-sort-add").needSeparator], "#7: after a separator").toEqual([true, true]);
    expect(bar.renderedActions.indexOf(bar.dotsItem), "#8: no dots menu").toBe(-1);
    const more = moreOf(matrix);
    expect([more.title, more.ariaLabel, more.getTooltip(), more.hasTitle, more.iconName, more.getActionBarItemCss() === barAction(matrix, "sv-sort-add").getActionBarItemCss()], "#9: an icon button with the box of \"+\"")
      .toEqual(["Show all sort levels", "Show all sort levels", "Show all sort levels", false, "icon-more-16x16", true]);
    expect(bar.visibleActions.map((item: Action): string => item.id).slice(-2), "#10: the order").toEqual(["sv-sort-more", "sv-sort-add"]);
  });
  test("a single level that does not fit keeps \"+\" and no \"...\"", () => {
    const matrix = createMatrix();
    matrix.sort([threeLevels[0]]);
    const bar = barOf(matrix);
    measure(matrix);
    bar.fit({ availableSpace: 100, gap: gap });
    expect(shownIds(matrix), "#1").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-add"]);
    expect(moreOf(matrix).mode, "#2").toBe("removed");
    matrix.sort([]);
    bar.fit({ availableSpace: 100, gap: gap });
    expect(shownIds(matrix), "#3: nothing sorted").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-add"]);
  });
  test("\"...\" and \"+\" are measured each: once the bar overflows, a level leaves even when every level and \"...\" would fit", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const bar = barOf(matrix);
    measure(matrix, { "sv-sort-more": 32, "sv-sort-add": 40 });
    // Every level with "+" needs 738, every level with "..." 730.
    bar.fit({ availableSpace: 735, gap: gap });
    expect(shownIds(matrix), "#1").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-more"]);
    bar.fit({ availableSpace: 738, gap: gap });
    expect(shownIds(matrix), "#2").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3", "sv-sort-add"]);
    measure(matrix, { "sv-sort-more": 60, "sv-sort-add": 32 });
    // Levels 1 and 2 with a wider "..." need 546.
    bar.fit({ availableSpace: 545, gap: gap });
    expect(shownIds(matrix), "#3: a wider \"...\" takes one more level out").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-more"]);
  });
  test("with one level allowed, a longer sort from code that does not fit shows \"...\" and never \"+\"", () => {
    const matrix = createMatrix({ maxSortLevel: 1 });
    matrix.sort(threeLevels);
    const bar = barOf(matrix);
    measure(matrix);
    expect(barAction(matrix, "sv-sort-add").visible, "#1").toBe(false);
    // The levels alone: "Sort by" and three levels.
    bar.fit({ availableSpace: 50 + 3 * 200 + 3 * gap, gap: gap });
    expect(shownIds(matrix), "#2: every level fits").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3"]);
    bar.fit({ availableSpace: 300, gap: gap });
    expect(shownIds(matrix), "#3").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-more"]);
    moreOf(matrix).action();
    expect(dialogOptions.length, "#4: \"...\" opens the dialog").toBe(1);
  });
  test("a new title inside a level marks the level's sizes stale and fits the bar again", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const bar = barOf(matrix);
    measure(matrix);
    bar.fit({ availableSpace: allLevelsWidth - 1, gap: gap });
    const raiseUpdate = vi.spyOn(<any>bar, "raiseUpdate");
    const level2 = barAction(matrix, "sv-sort-level-2");
    matrix.sort([threeLevels[0], { field: "category", direction: "asc" }, threeLevels[2]]);
    expect([level2.needUpdateMaxDimension, level2.needUpdateMinDimension], "#1: a direction title").toEqual([true, true]);
    expect(raiseUpdate.mock.calls.map((call: any): number => call[0].updateResponsivenessMode), "#2: a light update").toEqual([UpdateResponsivenessMode.Light]);
    raiseUpdate.mockClear();
    const level3 = barAction(matrix, "sv-sort-level-3");
    matrix.sort([threeLevels[0], { field: "category", direction: "asc" }, { field: "discontinued", direction: "asc" }]);
    expect([level3.mode, level3.needUpdateMaxDimension], "#3: a field title of a level out of the bar").toEqual(["removed", true]);
    expect(raiseUpdate.mock.calls.map((call: any): number => call[0].updateResponsivenessMode), "#4: a hard update").toEqual([UpdateResponsivenessMode.Hard]);
    raiseUpdate.mockClear();
    matrix.sort([threeLevels[0], { field: "category", direction: "asc" }, { field: "discontinued", direction: "asc" }]);
    expect(raiseUpdate, "#5: nothing changed").not.toHaveBeenCalled();
    raiseUpdate.mockRestore();
  });
  test("on a phone no level is hidden, \"+\" shows and \"...\" does not; a runtime switch works both ways", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const bar = barOf(matrix);
    measure(matrix);
    bar.fit({ availableSpace: 300, gap: gap });
    expect(shownIds(matrix), "#1: desktop").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-more"]);
    matrix.survey.setIsMobile(true);
    expect([bar.isResponsivenessDisabled, bar.getRootStyle()], "#2").toEqual([true, undefined]);
    expect(shownIds(matrix), "#3: every level").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3", "sv-sort-add"]);
    bar.fit({ availableSpace: 100, gap: gap });
    expect(shownIds(matrix), "#4: whatever the width").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-level-2", "sv-sort-level-3", "sv-sort-add"]);
    expect(moreOf(matrix).visible, "#5").toBe(false);
    const raiseUpdate = vi.spyOn(<any>bar, "raiseUpdate");
    matrix.survey.setIsMobile(false);
    expect([bar.isResponsivenessDisabled, moreOf(matrix).visible], "#6").toEqual([false, true]);
    expect(raiseUpdate.mock.calls.some((call: any): boolean => call[0].updateResponsivenessMode === UpdateResponsivenessMode.Hard), "#7: measured again").toBe(true);
    raiseUpdate.mockRestore();
    bar.fit({ availableSpace: 300, gap: gap });
    expect(shownIds(matrix), "#8").toEqual(["sv-sort-by", "sv-sort-level", "sv-sort-more"]);
  });
});

describe("Sort dialog: the rows", () => {
  test("it opens with one row per level, through settings.showDialog", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const { dialog, popup } = openDialog(matrix);
    const options = dialogOptions[0];
    expect([options.componentName, options.title, options.showCloseButton, options.displayMode, options.isFocusedContent, options.cssClass], "#1")
      .toEqual(["sv-records-sort-dialog", "Sort by", true, "popup", true, "sv-popup--records-sort"]);
    expect([popup.isVisible, popup.model.isModal], "#2").toEqual([true, true]);
    expect(rowsOf(dialog), "#3").toEqual([["Product", "Alphabet, A - Z", false], ["Category", "Alphabet, Z - A", true], ["Price", "Low - High", true]]);
    expect(titlesOf(directionListOf(dialog, 0)), "#4: row 1 starts with Default").toEqual(["Default", "Alphabet, A - Z", "Alphabet, Z - A"]);
    expect(titlesOf(directionListOf(dialog, 1)), "#5: a later row with the dash").toEqual(["\u2014", "Alphabet, A - Z", "Alphabet, Z - A"]);
    expect([dialog.rootCss, dialog.rows.map((row: ActionContainer): string => row.containerCss)], "#6")
      .toEqual(["sd-sort-dialog", ["sd-sort-dialog__row", "sd-sort-dialog__row", "sd-sort-dialog__row"]]);
    expect([rowActions(dialog, 0)[0].iconName, rowActions(dialog, 1)[2].iconName], "#7: the 24px icons").toEqual(["icon-chevrondown-24x24", "icon-delete-24x24"]);
    expect([rowActions(dialog, 1)[0].ariaLabel, rowActions(dialog, 1)[2].title], "#8").toEqual(["Sort field 2 Category", "Remove sort level 2"]);
  });
  test("with nothing sorted it opens with one row: the shown field and no direction", () => {
    const matrix = createMatrix();
    const { dialog } = openDialog(matrix);
    expect(rowsOf(dialog), "#1").toEqual([["Product", "Default", false]]);
    expect(directionListOf(dialog, 0).selectedItem.title, "#2").toBe("Default");
  });
  test("a field list leaves out the other rows' fields; Add New adds the next unused field without a direction", () => {
    const matrix = createMatrix({ maxSortLevel: 3 });
    matrix.sort([{ field: "category", direction: "asc" }]);
    const { dialog, popup } = openDialog(matrix);
    expect(titlesOf(fieldListOf(dialog, 0)), "#1").toEqual(["Product", "Category", "Price", "Discontinued"]);
    expect([addNew(popup).visible, addNew(popup).title, addNew(popup).visibleIndex], "#2").toEqual([true, "Add New", 0]);
    addNew(popup).action();
    expect(rowsOf(dialog), "#3").toEqual([["Category", "Alphabet, A - Z", false], ["Product", "\u2014", true]]);
    expect(titlesOf(fieldListOf(dialog, 0)), "#4").toEqual(["Category", "Price", "Discontinued"]);
    expect(titlesOf(fieldListOf(dialog, 1)), "#5").toEqual(["Product", "Price", "Discontinued"]);
    addNew(popup).action();
    expect(rowsOf(dialog).map((row: Array<any>): string => row[0]), "#6").toEqual(["Category", "Product", "Price"]);
    expect([dialog.canAddRow, addNew(popup).visible], "#7: maxSortLevel rows").toEqual([false, false]);
    expect(sortOf(matrix), "#8: the draft sorts nothing").toEqual([{ field: "category", direction: "asc" }]);
  });
  test("Add New hides when no field is left", () => {
    const matrix = createMatrix({ maxSortLevel: 10 });
    matrix.sort([{ field: "product" }, { field: "category" }, { field: "price" }]);
    const { dialog, popup } = openDialog(matrix);
    expect(addNew(popup).visible, "#1").toBe(true);
    addNew(popup).action();
    expect([rowsOf(dialog)[3][0], addNew(popup).visible], "#2").toEqual(["Discontinued", false]);
    removeRow(dialog, 3);
    expect(addNew(popup).visible, "#3").toBe(true);
  });
  test("the footer: Cancel is hidden, Add New comes first and Apply stays primary", () => {
    const matrix = createMatrix();
    const { popup } = openDialog(matrix);
    expect(popup.footerToolbar.visibleActions.map((item: Action): string => item.id), "#1").toEqual(["sv-sort-dialog-add", "apply"]);
    expect([footerAction(popup, "apply").title, footerAction(popup, "apply").getActionBarItemCss().indexOf("sd-action--primary") > -1], "#2")
      .toEqual(["Apply", true]);
    expect(popup.model.focusFirstInputSelector, "#3: the first row's field takes the focus").toBe(".sd-sort-bar__dropdown");
  });
});

describe("Sort dialog: Apply", () => {
  test("the rows that have a direction become the sort, in order", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }]);
    const { dialog, popup } = openDialog(matrix);
    pick(directionListOf(dialog, 0), "Alphabet, Z - A");
    addNew(popup).action();
    expect(rowsOf(dialog)[2], "#1").toEqual(["Price", "\u2014", true]);
    apply(popup);
    expect(sortOf(matrix), "#2: the dash row is left out").toEqual([{ field: "product", direction: "desc" }, { field: "category", direction: "asc" }]);
    expect(popup.isVisible, "#3: closed").toBe(false);
    expect(columnValues(matrix, "product"), "#4").toEqual(["c", "b", "a"]);
  });
  test("row 1 with Default and row 2 with a direction sort by row 2 only", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }]);
    const { dialog, popup } = openDialog(matrix);
    pick(directionListOf(dialog, 0), "Default");
    pick(directionListOf(dialog, 1), "Alphabet, A - Z");
    apply(popup);
    expect(sortOf(matrix), "#1").toEqual([{ field: "category", direction: "asc" }]);
  });
  test("a removed row leaves the sort; a draft equal to the sort calls nothing", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const sortByUser = vi.spyOn(matrix.paging, "sortByUser");
    let open = openDialog(matrix);
    removeRow(open.dialog, 1);
    expect(rowsOf(open.dialog).map((row: Array<any>): string => row[0]), "#1").toEqual(["Product", "Price"]);
    expect(rowsOf(open.dialog)[1][1], "#2: the row keeps its direction").toBe("Low - High");
    apply(open.popup);
    expect(sortOf(matrix), "#3").toEqual([threeLevels[0], threeLevels[2]]);
    sortByUser.mockClear();
    open = openDialog(matrix);
    apply(open.popup);
    expect(sortByUser, "#4: unchanged").not.toHaveBeenCalled();
    expect(open.popup.isVisible, "#5: closed").toBe(false);
    sortByUser.mockRestore();
  });
  test("an omitted direction opens as ascending, and an unchanged Apply keeps every level", () => {
    const matrix = createMatrix();
    matrix.sortCriteria = <any>[{ field: "product" }, { field: "category", direction: "desc" }];
    const sortByUser = vi.spyOn(matrix.paging, "sortByUser");
    const { dialog, popup } = openDialog(matrix);
    expect(rowsOf(dialog), "#1").toEqual([["Product", "Alphabet, A - Z", false], ["Category", "Alphabet, Z - A", true]]);
    expect(dialog.getCriteria(), "#2").toEqual([{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }]);
    apply(popup);
    expect(sortByUser, "#3").not.toHaveBeenCalled();
    expect(matrix.sortCriteria.length, "#4").toBe(2);
    sortByUser.mockRestore();
  });
  test("a field pick in a row: a sorting row takes the field's first direction, a dash row stays without one", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }]);
    const { dialog, popup } = openDialog(matrix);
    pick(fieldListOf(dialog, 0), "Price");
    expect(rowsOf(dialog)[0], "#1").toEqual(["Price", "High - Low", false]);
    addNew(popup).action();
    pick(fieldListOf(dialog, 1), "Discontinued");
    expect(rowsOf(dialog)[1], "#2").toEqual(["Discontinued", "\u2014", true]);
    expect(sortOf(matrix), "#3: still a draft").toEqual([{ field: "product", direction: "asc" }]);
  });
  test("the dynamic panel: the dialog sorts its panels", () => {
    const panel = createPanel();
    const { dialog, popup } = openDialog(panel);
    pick(fieldListOf(dialog, 0), "Price");
    pick(directionListOf(dialog, 0), "Low - High");
    apply(popup);
    expect(sortOf(panel), "#1").toEqual([{ field: "price", direction: "asc" }]);
    expect(panel.visiblePanels.map((item: any): any => item.getQuestionByName("price").value), "#2").toEqual([10, 20, 30]);
  });
});

describe("Sort dialog: closing without Apply", () => {
  test("the close button and Esc drop the draft; the bar, headers and rows keep the old sort", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }]);
    let open = openDialog(matrix);
    pick(directionListOf(open.dialog, 0), "Alphabet, Z - A");
    addNew(open.popup).action();
    pick(directionListOf(open.dialog, 1), "Alphabet, A - Z");
    expect(sortOf(matrix), "#1: a draft change writes nothing").toEqual([{ field: "product", direction: "asc" }]);
    open.popup.clickClose();
    expect([open.popup.isVisible, sortOf(matrix)], "#2: the close button").toEqual([false, [{ field: "product", direction: "asc" }]]);
    expect(columnValues(matrix, "product"), "#3").toEqual(["a", "b", "c"]);
    const header = matrix.renderedTable.headerRow.cells.filter((cell: any): boolean => !!cell.column && cell.column.name === "product")[0];
    expect(header.sortDirection, "#4").toBe("asc");
    expect(barAction(matrix, "sv-sort-level").data.getActionById("sv-sort-direction").title, "#5").toBe("Alphabet, A - Z");
    open = openDialog(matrix);
    expect(rowsOf(open.dialog), "#6: the next open starts from the sort").toEqual([["Product", "Alphabet, A - Z", false]]);
    pick(directionListOf(open.dialog, 0), "Default");
    open.popup.onKeyDown({ key: "Escape", preventDefault: () => { }, stopPropagation: () => { } });
    expect([open.popup.isVisible, sortOf(matrix)], "#7: Esc").toEqual([false, [{ field: "product", direction: "asc" }]]);
  });
});

describe("Sort dialog: validation", () => {
  test("Apply that would leave an empty required cell is refused, and the dialog closes", () => {
    const matrix = createMatrix({ pageSize: 2, columns: productColumns.map((column: any): any =>
      column.name === "product" ? Object.assign({ isRequired: true }, column) : column) });
    matrix.value = [{ price: 1 }, { product: "x", price: 2 }, { product: "y", price: 3 }];
    matrix.visibleRows;
    const { dialog, popup } = openDialog(matrix);
    pick(fieldListOf(dialog, 0), "Price");
    pick(directionListOf(dialog, 0), "Low - High");
    apply(popup);
    expect([sortOf(matrix), popup.isVisible], "#1").toEqual([[], false]);
    expect(barAction(matrix, "sv-sort-level").data.getActionById("sv-sort-direction").title, "#2: the bar keeps the old sort").toBe("Default");
  });
  test("an asynchronous validator: the sort applies when it passes; Apply is disabled while it runs", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("sortDialogAsyncFunc", function (this: any) { results.push(this.returnResult); return false; }, true);
    try {
      const matrix = createMatrix({ pageSize: 2, columns: productColumns.map((column: any): any =>
        column.name === "product" ? Object.assign({ validators: [{ type: "expression", expression: "sortDialogAsyncFunc({row.product}) = 1" }] }, column) : column) });
      matrix.visibleRows;
      let open = openDialog(matrix);
      pick(fieldListOf(open.dialog, 0), "Price");
      pick(directionListOf(open.dialog, 0), "High - Low");
      apply(open.popup);
      expect([matrix.isPageMovePending, open.popup.isVisible, sortOf(matrix)], "#1: waits, closed").toEqual([true, false, []]);
      open = openDialog(matrix);
      expect([open.dialog.canApply, footerAction(open.popup, "apply").enabled], "#2: Apply is disabled").toEqual([false, false]);
      results.forEach(setResult => setResult(1));
      expect(sortOf(matrix), "#3").toEqual([{ field: "price", direction: "desc" }]);
      expect(footerAction(open.popup, "apply").enabled, "#4").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("sortDialogAsyncFunc");
    }
  });
});

describe("Sort dialog: the object", () => {
  test("closing the dialog disposes its model and its rows", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const { dialog, popup } = openDialog(matrix);
    const rows = dialog.rows.slice();
    const field = rowActions(dialog, 1)[0];
    popup.clickClose();
    expect([dialog.isDisposed, rows.every((row: ActionContainer): boolean => row.isDisposed), field.isDisposed, field.popupModel.isDisposed], "#1")
      .toEqual([true, true, true, true]);
    expect(openDialog(matrix).dialog === dialog, "#2: a new draft on the next open").toBe(false);
  });
  test("a removed row is disposed", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const { dialog } = openDialog(matrix);
    const row = dialog.rows[1];
    removeRow(dialog, 1);
    expect([row.isDisposed, dialog.rows.length], "#1").toEqual([true, 2]);
  });
  test("disposing the question while the dialog is open closes it and does not throw", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const { dialog, popup } = openDialog(matrix);
    expect(() => matrix.dispose(), "#1").not.toThrow();
    expect([dialog.isDisposed, popup.isVisible], "#2").toEqual([true, false]);
  });
  test("\"...\" with no renderer to show a dialog does nothing", () => {
    const matrix = createMatrix();
    settings.showDialog = undefined;
    expect(() => moreOf(matrix).action(), "#1").not.toThrow();
  });
});

describe("Sort dialog: the locale", () => {
  const testLocale = "sort-dialog-test";
  afterEach(() => { delete surveyLocalization.locales[testLocale]; });
  test("the dialog's texts follow a locale change while it is open", () => {
    surveyLocalization.locales[testLocale] = { sortByText: "Order", sortDefaultText: "Stored", sortNoDirectionText: "None", sortAddNewText: "New level",
      modalApplyButtonText: "Use", sortAZText: "A first", sortMoreAriaLabel: "All levels" };
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }]);
    const { dialog, popup } = openDialog(matrix);
    addNew(popup).action();
    matrix.survey.locale = testLocale;
    expect([popup.title, addNew(popup).title, footerAction(popup, "apply").title, moreOf(matrix).title, moreOf(matrix).ariaLabel], "#1")
      .toEqual(["Order", "New level", "Use", "All levels", "All levels"]);
    expect(rowsOf(dialog), "#2").toEqual([["Product", "A first", false], ["Category", "None", true]]);
    expect(titlesOf(directionListOf(dialog, 0))[0], "#3").toBe("Stored");
    matrix.survey.locale = "";
    expect(popup.title, "#4").toBe("Sort by");
  });
});

interface IOpenDesignDialog extends IOpenDialog { applied: Array<Array<any>> }
function openDesignDialog(q: QuestionRecordsModel, options?: any): IOpenDesignDialog {
  const applied: Array<Array<any>> = [];
  const popup = q.showSortDialog(Object.assign({ onApply: (criteria: Array<any>): void => { applied.push(criteria); } }, options));
  return { dialog: <RecordsSortDialogModel>popup.model.contentComponentData.model, popup: popup, applied: applied };
}
const designColumns = productColumns.map((column: any): any => column.name === "category" ? Object.assign({ allowSort: false }, column) : column)
  .concat([{ name: "tags", title: "Tags", cellType: "checkbox", choices: ["a", "b"] }, { name: "code", title: "Code", cellType: "text", visible: false }]);

describe("Sort dialog: the designer's dialog (showSortDialog)", () => {
  test("opens in design mode without allowSort and offers every value-sortable column, a row per field; Apply hands the rows to onApply", () => {
    const matrix = createMatrix({ allowSort: false, maxSortLevel: 1, columns: designColumns });
    matrix.survey.setDesignMode(true);
    expect(matrix.recordsBar.showSort, "#1: no bar in design mode").toBe(false);
    const { dialog, popup, applied } = openDesignDialog(matrix);
    expect([popup.isVisible, dialogOptions.length], "#2: open").toEqual([true, 1]);
    expect(rowsOf(dialog), "#3: the first offered field, not sorted").toEqual([["Product", "Default", false]]);
    expect(titlesOf(fieldListOf(dialog, 0)), "#4: a column with allowSort false and an invisible one are offered, a checkbox column is not")
      .toEqual(["Product", "Category", "Price", "Discontinued", "Code"]);
    for (let i = 0; i < 4; i++) addNew(popup).action();
    expect([dialog.rows.length, dialog.canAddRow, addNew(popup).visible], "#5: a row per field, whatever maxSortLevel").toEqual([5, false, false]);
    pick(directionListOf(dialog, 0), "Alphabet, Z - A");
    pick(directionListOf(dialog, 2), "Low - High");
    apply(popup);
    expect(applied, "#6").toEqual([[{ field: "product", direction: "desc" }, { field: "price", direction: "asc" }]]);
    expect([sortOf(matrix), popup.isVisible, dialog.isDisposed], "#7: sortCriteria is the caller's to write; closed and disposed").toEqual([[], false, true]);
  });
  test("the current sort fills the rows; an unchanged Apply calls nothing", () => {
    const matrix = createMatrix({ allowSort: false });
    matrix.sortCriteria = [{ field: "price", direction: "desc" }];
    const { dialog, popup, applied } = openDesignDialog(matrix);
    expect(rowsOf(dialog), "#1").toEqual([["Price", "High - Low", false]]);
    apply(popup);
    expect([applied, popup.isVisible], "#2").toEqual([[], false]);
  });
  test("Apply validates nothing: an empty required cell does not stop it", () => {
    const matrix = createMatrix({ pageSize: 2, columns: productColumns.map((column: any): any =>
      column.name === "product" ? Object.assign({ isRequired: true }, column) : column) });
    matrix.value = [{ price: 1 }, { product: "x", price: 2 }, { product: "y", price: 3 }];
    const emptyCell = matrix.visibleRows[0].getQuestionByName("product");
    const { dialog, popup, applied } = openDesignDialog(matrix);
    pick(fieldListOf(dialog, 0), "Price");
    pick(directionListOf(dialog, 0), "Low - High");
    apply(popup);
    expect([applied, sortOf(matrix), emptyCell.errors.length], "#1").toEqual([[[{ field: "price", direction: "asc" }]], [], 0]);
  });
  test("the dynamic panel offers its bar's fields, a row per field, and hands the rows to onApply", () => {
    const panel = createPanel({ allowSort: false, maxSortLevel: 1 });
    panel.survey.setDesignMode(true);
    const { dialog, popup, applied } = openDesignDialog(panel);
    expect(titlesOf(fieldListOf(dialog, 0)), "#1").toEqual(["Product", "Category", "Price", "Discontinued"]);
    for (let i = 0; i < 3; i++) addNew(popup).action();
    expect([dialog.rows.length, dialog.canAddRow], "#2").toEqual([4, false]);
    pick(directionListOf(dialog, 0), "Alphabet, A - Z");
    apply(popup);
    expect([applied, sortOf(panel)], "#3").toEqual([[[{ field: "product", direction: "asc" }]], []]);
  });
  test("the modal goes under options.rootElement, or the survey's root element without it", () => {
    const roots: Array<HTMLElement> = [];
    const show = settings.showDialog;
    settings.showDialog = (options: IDialogOptions, rootElement?: HTMLElement): any => {
      roots.push(rootElement);
      return show(options, rootElement);
    };
    const matrix = createMatrix();
    const root = document.createElement("div");
    openDesignDialog(matrix, { rootElement: root });
    openDesignDialog(matrix);
    expect([roots[0] === root, roots[1] === matrix.survey.rootElement], "#1").toEqual([true, true]);
  });
  test("with no renderer to show a dialog it returns undefined and keeps nothing", () => {
    const matrix = createMatrix();
    settings.showDialog = undefined;
    expect(matrix.showSortDialog({ onApply: (): void => { } }), "#1").toBeUndefined();
    expect((<any>matrix).designSortDialog, "#2").toBeUndefined();
  });
  test("disposing the question closes the open dialog and disposes it; onHide runs once", () => {
    const matrix = createMatrix();
    const { dialog, popup } = openDesignDialog(matrix);
    let hides = 0;
    const onHide = popup.model.onHide;
    popup.model.onHide = (): void => { hides++; onHide(); };
    matrix.dispose();
    expect([dialog.isDisposed, popup.isVisible, hides], "#1").toEqual([true, false, 1]);
  });
  test("a second call closes and disposes the first dialog", () => {
    const matrix = createMatrix();
    const first = openDesignDialog(matrix);
    const second = openDesignDialog(matrix);
    expect([first.dialog.isDisposed, first.popup.isVisible, second.dialog.isDisposed, second.popup.isVisible], "#1").toEqual([true, false, false, true]);
    second.popup.clickClose();
    expect([second.dialog.isDisposed, (<any>matrix).designSortDialog], "#2: closed by the designer").toEqual([true, undefined]);
  });
});

describe("Sort dialog: the designer's locale", () => {
  const testLocale = "sort-design-dialog-test";
  beforeEach(() => {
    surveyLocalization.locales[testLocale] = { sortByText: "Order", sortDefaultText: "Stored", sortNoDirectionText: "None", sortAddNewText: "New level",
      modalApplyButtonText: "Use", sortAZText: "A first", sortZAText: "Z first", sortLowHighText: "Small first", sortHighLowText: "Big first",
      sortRemoveLevelText: "Drop {0}", sortLevelFieldAriaLabel: "Key {0}" };
  });
  afterEach(() => { delete surveyLocalization.locales[testLocale]; });
  test("options.locale holds for the dialog's whole life: at opening, after Add New, a removed row and each pick", () => {
    const matrix = createMatrix();
    matrix.survey.setDesignMode(true);
    const { dialog, popup } = openDesignDialog(matrix, { locale: testLocale });
    const texts = (): Array<string> => [popup.title, addNew(popup).title, footerAction(popup, "apply").title];
    expect(texts(), "#1: opening").toEqual(["Order", "New level", "Use"]);
    expect(rowsOf(dialog), "#2").toEqual([["Product", "Stored", false]]);
    expect(titlesOf(directionListOf(dialog, 0)), "#3").toEqual(["Stored", "A first", "Z first"]);
    addNew(popup).action();
    expect([texts(), rowsOf(dialog), rowActions(dialog, 1)[2].title, rowActions(dialog, 1)[0].ariaLabel], "#4: Add New")
      .toEqual([["Order", "New level", "Use"], [["Product", "Stored", false], ["Category", "None", true]], "Drop 2", "Key 2 Category"]);
    addNew(popup).action();
    removeRow(dialog, 1);
    expect([texts(), rowsOf(dialog)], "#5: a removed row").toEqual([["Order", "New level", "Use"], [["Product", "Stored", false], ["Price", "None", true]]]);
    pick(fieldListOf(dialog, 0), "Category");
    expect([texts(), rowsOf(dialog)[0]], "#6: a field pick").toEqual([["Order", "New level", "Use"], ["Category", "Stored", false]]);
    pick(directionListOf(dialog, 0), "Z first");
    pick(directionListOf(dialog, 1), "Small first");
    expect([texts(), rowsOf(dialog)], "#7: the direction picks").toEqual([["Order", "New level", "Use"], [["Category", "Z first", false], ["Price", "Small first", true]]]);
    expect(matrix.survey.locale, "#8: the survey's locale is not touched").toBe("");
  });
  test("without options.locale the dialog follows the survey's locale", () => {
    const matrix = createMatrix();
    matrix.survey.locale = testLocale;
    const { popup } = openDesignDialog(matrix);
    expect(popup.title, "#1").toBe("Order");
    matrix.survey.locale = "";
  });
});
