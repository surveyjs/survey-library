import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionRecordsModel } from "../../src/question_records";
import { MatrixDropdownRowModelBase } from "../../src/question_matrixdropdownbase";
import { QuestionDropdownModel } from "../../src/question_dropdown";
import { FunctionFactory } from "../../src/functionsfactory";
import { surveyLocalization } from "../../src/surveyStrings";
import { settings } from "../../src/settings";
import { Action } from "../../src/actions/action";
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
// The modal's content is the dialog's survey ({ model: survey }); the dialog model itself is a private field of the bar.
interface IOpenDialog { dialog: RecordsSortDialogModel, popup: PopupBaseViewModel, survey: SurveyModel, levels: QuestionMatrixDynamicModel }
function toOpenDialog(dialog: RecordsSortDialogModel, popup: PopupBaseViewModel): IOpenDialog {
  const survey = <SurveyModel>popup.model.contentComponentData.model;
  return { dialog: dialog, popup: popup, survey: survey, levels: <QuestionMatrixDynamicModel>survey.getQuestionByName("levels") };
}
function openDialog(q: QuestionRecordsModel): IOpenDialog {
  moreOf(q).action();
  const modals = manager.getModals();
  return toOpenDialog((<any>q.recordsBar).sortActionsValue.dialog, modals[modals.length - 1]);
}
const rowAt = (open: IOpenDialog, index: number): MatrixDropdownRowModelBase => open.levels.visibleRows[index];
const fieldOf = (open: IOpenDialog, index: number): QuestionDropdownModel => <QuestionDropdownModel>rowAt(open, index).getQuestionByName("field");
const directionOf = (open: IOpenDialog, index: number): QuestionDropdownModel => <QuestionDropdownModel>rowAt(open, index).getQuestionByName("direction");
const numberOf = (open: IOpenDialog, index: number): any => rowAt(open, index).getQuestionByName("number").value;
// The accessible name of a cell's editor.
const labelOf = (question: QuestionDropdownModel): string => question.a11y_input_ariaLabel;
const titlesOf = (question: QuestionDropdownModel): Array<string> => question.visibleChoices.map((item: any): string => item.text);
const shownText = (question: QuestionDropdownModel): string => !!question.selectedItem ? question.selectedItem.text : undefined;
// A row action the table renders: "drag-drop" (the handle) or "remove-row".
const rowAction = (open: IOpenDialog, index: number, id: string): Action => open.levels.renderedTable.getRowAction(rowAt(open, index), id);
// Each row as the respondent sees it: the field, the direction and whether its remove button is enabled.
const rowsOf = (open: IOpenDialog): Array<Array<any>> => open.levels.visibleRows.map((_: any, index: number): Array<any> =>
  [shownText(fieldOf(open, index)), shownText(directionOf(open, index)), rowAction(open, index, "remove-row").enabled]);
function pick(question: QuestionDropdownModel, title: string): void {
  const item = question.visibleChoices.filter((choice: any): boolean => choice.text === title)[0];
  expect(item, "no item " + title).toBeTruthy();
  question.value = item.value;
}
const footerAction = (popup: PopupBaseViewModel, id: string): Action => popup.footerToolbar.getActionById(id);
const addNew = (popup: PopupBaseViewModel): Action => footerAction(popup, "sv-sort-dialog-add");
const removeRow = (open: IOpenDialog, index: number): void => { rowAction(open, index, "remove-row").action(); };
const apply = (popup: PopupBaseViewModel): void => { footerAction(popup, "apply").action(); };
// The handle's ArrowUp / ArrowDown (prompt 10a's model method); returns whether the key was taken.
function pressOnHandle(open: IOpenDialog, index: number, key: string): boolean {
  let isPrevented = false;
  open.levels.onDragHandleKeyDown(<any>{ key: key, preventDefault: (): void => { isPrevented = true; } }, rowAt(open, index));
  return isPrevented;
}
// Moves the row at a position to another one, a step at a time.
function moveRow(open: IOpenDialog, from: number, to: number): void {
  const step = from > to ? -1 : 1;
  for (let i = from; i !== to; i += step) {
    pressOnHandle(open, i, step < 0 ? "ArrowUp" : "ArrowDown");
  }
}

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
  test("it opens with one matrix row per level, through settings.showDialog and the survey component", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    const options = dialogOptions[0];
    expect([options.componentName, options.title, options.showCloseButton, options.displayMode, options.isFocusedContent, options.cssClass], "#1")
      .toEqual(["survey", "Sort by", true, "popup", true, "sv-popup--records-sort"]);
    expect([options.data.model === open.dialog.survey, options.data.survey === open.dialog.survey], "#1a: the dialog's survey").toEqual([true, true]);
    expect([open.popup.isVisible, open.popup.model.isModal], "#2").toEqual([true, true]);
    expect(rowsOf(open), "#3").toEqual([["Product", "Alphabet, A - Z", true], ["Category", "Alphabet, Z - A", true], ["Price", "Low - High", true]]);
    expect(titlesOf(directionOf(open, 0)), "#4: row 1 starts with Default").toEqual(["Default", "Alphabet, A - Z", "Alphabet, Z - A"]);
    expect(titlesOf(directionOf(open, 1)), "#5: a later row with the dash").toEqual(["\u2014", "Alphabet, A - Z", "Alphabet, Z - A"]);
    const levels = open.levels;
    expect([levels.showHeader, levels.hasTitle, levels.allowRowReorder, levels.canAddRow, levels.minRowCount, open.survey.showNavigationButtons, open.survey.showQuestionNumbers],
      "#6: no header, title, own add button or navigation").toEqual([false, false, true, false, 0, false, "off"]);
    expect([rowAction(open, 1, "remove-row").iconName, rowAction(open, 1, "drag-drop").iconName], "#7: the 24px icons").toEqual(["icon-delete-24x24", "icon-drag-24x24"]);
    expect([labelOf(fieldOf(open, 1)), labelOf(directionOf(open, 1)), rowAction(open, 1, "remove-row").ariaLabel, rowAction(open, 1, "remove-row").tooltip, rowAction(open, 1, "drag-drop").ariaLabel], "#8")
      .toEqual(["Sort field 2", "Sort order 2", "Remove sort level 2", "Remove sort level 2", "Move sort level 2"]);
    expect([labelOf(fieldOf(open, 0)), labelOf(directionOf(open, 0)), [0, 1, 2].map((index: number): any => numberOf(open, index))], "#9: the first row's labels; the numbers")
      .toEqual(["Sort field", "Sort order", [1, 2, 3]]);
    expect([fieldOf(open, 0).allowClear, fieldOf(open, 0).searchEnabled, directionOf(open, 0).allowClear], "#10").toEqual([false, false, false]);
  });
  test("with nothing sorted it opens with one row: the shown field and no direction", () => {
    const matrix = createMatrix();
    const open = openDialog(matrix);
    expect(rowsOf(open), "#1: the single row's remove button is disabled").toEqual([["Product", "Default", false]]);
    expect(directionOf(open, 0).value, "#2").toBe("none");
  });
  test("a field list leaves out the other rows' fields; Add New adds the next unused field without a direction", () => {
    const matrix = createMatrix({ maxSortLevel: 3 });
    matrix.sort([{ field: "category", direction: "asc" }]);
    const open = openDialog(matrix);
    const { popup } = open;
    expect(titlesOf(fieldOf(open, 0)), "#1").toEqual(["Product", "Category", "Price", "Discontinued"]);
    expect([addNew(popup).visible, addNew(popup).enabled, addNew(popup).title, addNew(popup).visibleIndex], "#2").toEqual([true, true, "Add New", 0]);
    addNew(popup).action();
    expect(rowsOf(open), "#3").toEqual([["Category", "Alphabet, A - Z", true], ["Product", "\u2014", true]]);
    expect(titlesOf(fieldOf(open, 0)), "#4").toEqual(["Category", "Price", "Discontinued"]);
    expect(titlesOf(fieldOf(open, 1)), "#5").toEqual(["Product", "Price", "Discontinued"]);
    addNew(popup).action();
    expect(rowsOf(open).map((row: Array<any>): string => row[0]), "#6").toEqual(["Category", "Product", "Price"]);
    expect([open.dialog.canAddRow, addNew(popup).visible, addNew(popup).enabled], "#7: maxSortLevel rows: disabled, not hidden").toEqual([false, true, false]);
    expect(sortOf(matrix), "#8: the draft sorts nothing").toEqual([{ field: "category", direction: "asc" }]);
  });
  test("Add New is disabled when no field is left", () => {
    const matrix = createMatrix({ maxSortLevel: 10 });
    matrix.sort([{ field: "product" }, { field: "category" }, { field: "price" }]);
    const open = openDialog(matrix);
    expect(addNew(open.popup).enabled, "#1").toBe(true);
    addNew(open.popup).action();
    expect([rowsOf(open)[3][0], addNew(open.popup).enabled], "#2").toEqual(["Discontinued", false]);
    removeRow(open, 3);
    expect(addNew(open.popup).enabled, "#3").toBe(true);
  });
  test("the footer: Cancel is hidden, Add New comes first and Apply stays primary", () => {
    const matrix = createMatrix();
    const open = openDialog(matrix);
    const { popup } = open;
    expect(popup.footerToolbar.visibleActions.map((item: Action): string => item.id), "#1").toEqual(["sv-sort-dialog-add", "apply"]);
    expect([footerAction(popup, "apply").title, footerAction(popup, "apply").getActionBarItemCss().indexOf("sd-action--primary") > -1], "#2")
      .toEqual(["Apply", true]);
    expect(popup.model.focusFirstInputSelector, "#3: the first row's field takes the focus, not the handle before it").toBe("#" + fieldOf(open, 0).inputId);
  });
});

describe("Sort dialog: Apply", () => {
  test("the rows that have a direction become the sort, in order", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }]);
    const open = openDialog(matrix);
    pick(directionOf(open, 0), "Alphabet, Z - A");
    addNew(open.popup).action();
    expect(rowsOf(open)[2], "#1").toEqual(["Price", "\u2014", true]);
    apply(open.popup);
    expect(sortOf(matrix), "#2: the dash row is left out").toEqual([{ field: "product", direction: "desc" }, { field: "category", direction: "asc" }]);
    expect(open.popup.isVisible, "#3: closed").toBe(false);
    expect(columnValues(matrix, "product"), "#4").toEqual(["c", "b", "a"]);
  });
  test("row 1 with Default and row 2 with a direction sort by row 2 only", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }]);
    const open = openDialog(matrix);
    pick(directionOf(open, 0), "Default");
    pick(directionOf(open, 1), "Alphabet, A - Z");
    apply(open.popup);
    expect(sortOf(matrix), "#1").toEqual([{ field: "category", direction: "asc" }]);
  });
  test("a removed row leaves the sort; a draft equal to the sort calls nothing", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const sortByUser = vi.spyOn(matrix.paging, "sortByUser");
    let open = openDialog(matrix);
    removeRow(open, 1);
    expect(rowsOf(open).map((row: Array<any>): string => row[0]), "#1").toEqual(["Product", "Price"]);
    expect(rowsOf(open)[1][1], "#2: the row keeps its direction").toBe("Low - High");
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
    const open = openDialog(matrix);
    expect(rowsOf(open), "#1").toEqual([["Product", "Alphabet, A - Z", true], ["Category", "Alphabet, Z - A", true]]);
    expect(open.dialog.getCriteria(), "#2").toEqual([{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }]);
    apply(open.popup);
    expect(sortByUser, "#3").not.toHaveBeenCalled();
    expect(matrix.sortCriteria.length, "#4").toBe(2);
    sortByUser.mockRestore();
  });
  test("a field pick in a row: a sorting row takes the field's first direction, a dash row stays without one", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }]);
    const open = openDialog(matrix);
    pick(fieldOf(open, 0), "Price");
    expect(rowsOf(open)[0], "#1").toEqual(["Price", "High - Low", false]);
    addNew(open.popup).action();
    pick(fieldOf(open, 1), "Discontinued");
    expect(rowsOf(open)[1], "#2").toEqual(["Discontinued", "\u2014", true]);
    expect(titlesOf(fieldOf(open, 0)), "#3: the other row's new field leaves the list").toEqual(["Product", "Category", "Price"]);
    expect(sortOf(matrix), "#4: still a draft").toEqual([{ field: "product", direction: "asc" }]);
  });
  test("the dynamic panel: the dialog sorts its panels", () => {
    const panel = createPanel();
    const open = openDialog(panel);
    pick(fieldOf(open, 0), "Price");
    pick(directionOf(open, 0), "Low - High");
    apply(open.popup);
    expect(sortOf(panel), "#1").toEqual([{ field: "price", direction: "asc" }]);
    expect(panel.visiblePanels.map((item: any): any => item.getQuestionByName("price").value), "#2").toEqual([10, 20, 30]);
  });
});

describe("Sort dialog: numbers and moves", () => {
  const fiveLevels: Array<any> = [{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }, { field: "price", direction: "asc" },
    { field: "discontinued", direction: "desc" }, { field: "code", direction: "asc" }];
  const fiveColumns = productColumns.concat([{ name: "code", title: "Code", cellType: "text" }]);
  test("five rows are numbered 1-5; a row moved to position 1 gets number 1 and Default, the old row 1 the dash, and the labels follow", () => {
    const matrix = createMatrix({ maxSortLevel: 5, columns: fiveColumns });
    matrix.sort(fiveLevels);
    const open = openDialog(matrix);
    expect([0, 1, 2, 3, 4].map((index: number): any => numberOf(open, index)), "#1").toEqual([1, 2, 3, 4, 5]);
    pick(directionOf(open, 3), "\u2014");
    moveRow(open, 3, 0);
    expect(rowsOf(open).map((row: Array<any>): Array<string> => [row[0], row[1]]), "#2").toEqual([["Discontinued", "Default"], ["Product", "Alphabet, A - Z"],
      ["Category", "Alphabet, Z - A"], ["Price", "Low - High"], ["Code", "Alphabet, A - Z"]]);
    expect([0, 1, 2, 3, 4].map((index: number): any => numberOf(open, index)), "#3: the numbers by position").toEqual([1, 2, 3, 4, 5]);
    expect(titlesOf(directionOf(open, 0))[0], "#4").toBe("Default");
    pick(directionOf(open, 1), "\u2014");
    expect([shownText(directionOf(open, 1)), titlesOf(directionOf(open, 1))[0]], "#5: the old row 1 shows the dash").toEqual(["\u2014", "\u2014"]);
    expect([labelOf(fieldOf(open, 0)), labelOf(fieldOf(open, 1)), labelOf(directionOf(open, 1))], "#6: the labels by position").toEqual(["Sort field", "Sort field 2", "Sort order 2"]);
    expect([0, 1, 4].map((index: number): string => rowAction(open, index, "drag-drop").ariaLabel), "#7").toEqual(["Move sort level 1", "Move sort level 2", "Move sort level 5"]);
    expect([0, 1, 4].map((index: number): string => rowAction(open, index, "remove-row").ariaLabel), "#8").toEqual(["Remove sort level 1", "Remove sort level 2", "Remove sort level 5"]);
    expect(open.dialog.getCriteria().map((item: any): string => item.field), "#9: neither row without a direction sorts").toEqual(["category", "price", "code"]);
  });
  test("a move, then Apply, sorts in the new order; a move and a move back applies nothing", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "desc" }, { field: "category", direction: "asc" }]);
    const sortByUser = vi.spyOn(matrix.paging, "sortByUser");
    let open = openDialog(matrix);
    moveRow(open, 0, 1);
    expect(open.levels.value.map((item: any): string => item.field), "#0").toEqual(["category", "product"]);
    pressOnHandle(open, 1, "ArrowUp");
    apply(open.popup);
    expect(sortByUser, "#1: a move and a move back").not.toHaveBeenCalled();
    open = openDialog(matrix);
    moveRow(open, 1, 0);
    expect(open.levels.value.map((item: any): any => [item.number, item.field, item.direction]), "#2: the matrix value holds the draft").toEqual([[1, "category", "asc"], [2, "product", "desc"]]);
    apply(open.popup);
    expect(sortOf(matrix), "#3").toEqual([{ field: "category", direction: "asc" }, { field: "product", direction: "desc" }]);
    expect(columnValues(matrix, "product"), "#4").toEqual(["a", "c", "b"]);
    sortByUser.mockRestore();
  });
  test("the field lists leave out the other rows' fields after a move, an add and a removal", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }]);
    const open = openDialog(matrix);
    moveRow(open, 1, 0);
    expect([titlesOf(fieldOf(open, 0)), titlesOf(fieldOf(open, 1))], "#1: a move").toEqual([["Category", "Price", "Discontinued"], ["Product", "Price", "Discontinued"]]);
    addNew(open.popup).action();
    expect([titlesOf(fieldOf(open, 0)), titlesOf(fieldOf(open, 1)), titlesOf(fieldOf(open, 2))], "#2: an add")
      .toEqual([["Category", "Discontinued"], ["Product", "Discontinued"], ["Price", "Discontinued"]]);
    removeRow(open, 0);
    expect([titlesOf(fieldOf(open, 0)), titlesOf(fieldOf(open, 1))], "#3: a removal").toEqual([["Product", "Category", "Discontinued"], ["Category", "Price", "Discontinued"]]);
    expect(titlesOf(directionOf(open, 0))[0], "#4: the new first row offers Default").toBe("Default");
  });
  test("the remove button on row 1 removes it and renumbers; on a single row it is disabled and the remove column stays", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    pick(directionOf(open, 1), "\u2014");
    removeRow(open, 0);
    expect(rowsOf(open), "#1: row 2 is row 1 and shows Default").toEqual([["Category", "Default", true], ["Price", "Low - High", true]]);
    expect([numberOf(open, 0), numberOf(open, 1), rowAction(open, 0, "drag-drop").ariaLabel, labelOf(fieldOf(open, 0))], "#2").toEqual([1, 2, "Move sort level 1", "Sort field"]);
    const table = open.levels.renderedTable;
    removeRow(open, 1);
    const remove = rowAction(open, 0, "remove-row");
    expect([open.levels.rowCount, !!remove, remove.enabled, open.dialog.canRemoveRow], "#3: one row: the remove button stays, disabled").toEqual([1, true, false, false]);
    expect(open.levels.renderedTable === table, "#4: the table and its remove column are kept").toBe(true);
    remove.action();
    expect(open.levels.rowCount, "#5: a disabled remove button removes nothing").toBe(1);
    addNew(open.popup).action();
    expect([rowAction(open, 0, "remove-row").enabled, rowAction(open, 1, "remove-row").enabled], "#6: enabled again after an add").toEqual([true, true]);
  });
  test("Add New is disabled at maxSortLevel rows and with no free field, and enabled again after a removal", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    matrix.sort([{ field: "product", direction: "asc" }]);
    let open = openDialog(matrix);
    addNew(open.popup).action();
    expect([open.levels.rowCount, addNew(open.popup).enabled], "#1: maxSortLevel rows").toEqual([2, false]);
    addNew(open.popup).action();
    expect(open.levels.rowCount, "#2: a disabled Add New adds nothing").toBe(2);
    removeRow(open, 1);
    expect(addNew(open.popup).enabled, "#3: enabled after a removal").toBe(true);
    open.popup.clickClose();
    matrix.maxSortLevel = 10;
    matrix.sort([{ field: "product" }, { field: "category" }, { field: "price" }, { field: "discontinued" }]);
    open = openDialog(matrix);
    expect(addNew(open.popup).enabled, "#4: no free field").toBe(false);
    removeRow(open, 0);
    expect(addNew(open.popup).enabled, "#5").toBe(true);
  });
  test("ArrowUp and ArrowDown on a handle move the level, not past the first or the last row", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    const fields = (): Array<string> => open.levels.value.map((item: any): string => item.field);
    expect(pressOnHandle(open, 0, "ArrowUp"), "#1: the first row").toBe(false);
    expect(pressOnHandle(open, 2, "ArrowDown"), "#2: the last row").toBe(false);
    expect(fields(), "#3").toEqual(["product", "category", "price"]);
    expect(pressOnHandle(open, 1, "ArrowDown"), "#4").toBe(true);
    expect(fields(), "#5").toEqual(["product", "price", "category"]);
    expect(pressOnHandle(open, 1, "ArrowUp"), "#6").toBe(true);
    expect([fields(), rowsOf(open).map((row: Array<any>): string => row[1])], "#7: Default on row 1, the dash is not shown for a sorting row")
      .toEqual([["price", "product", "category"], ["Low - High", "Alphabet, A - Z", "Alphabet, Z - A"]]);
    expect(titlesOf(directionOf(open, 0)), "#8").toEqual(["Default", "High - Low", "Low - High"]);
    expect(sortOf(matrix), "#9: a move is a draft change").toEqual(threeLevels);
  });
});

describe("Sort dialog: the dialog's survey", () => {
  test("it is not mobile at the dialog's width while the outer survey is not, and follows the outer survey's isMobile", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    expect([matrix.survey.isMobile, open.survey.isMobile, open.levels.isMobile], "#1").toEqual([false, false, false]);
    expect(open.survey.themeVariables["--sd-mobile-width"], "#2: its own width never makes it mobile").toBe("0px");
    expect(!!rowAction(open, 0, "drag-drop"), "#3: the handle shows").toBe(true);
    (<SurveyModel>matrix.survey).setIsMobile(true);
    expect([open.survey.isMobile, open.levels.isMobile], "#4").toEqual([true, true]);
    (<SurveyModel>matrix.survey).setIsMobile(false);
    expect(open.survey.isMobile, "#5").toBe(false);
  });
  test("it takes the outer survey's theme: its root has no theme root class and its box-shadow resets inherit", () => {
    const matrix = createMatrix();
    matrix.survey.applyTheme({ cssVariables: { "--sjs2-border-effect-component-formbox-default": "inset 0 0 0 2px red" } });
    const open = openDialog(matrix);
    const rootCss = open.survey.getRootCss();
    expect([rootCss.indexOf("sd-root-modern") > -1, rootCss.indexOf("sd-theme-root") > -1, rootCss.indexOf("sjs-theme-overrides") > -1], "#1").toEqual([true, false, false]);
    const variables = open.survey.themeVariables;
    const resets = Object.keys(variables).filter((name: string): boolean => name.slice(-6) === "-reset");
    expect([resets.length, resets.every((name: string): boolean => variables[name] === "inherit")], "#2").toEqual([4, true]);
    expect(Object.keys(variables).length, "#3: nothing else is set on its root").toBe(5);
    expect(open.survey.css.matrixdynamic.row, "#4: the rows have the dialog's class, its drag shortcut too").toBe("sd-table__row sd-sort-dialog__row");
    expect(matrix.survey.getRootCss().indexOf("sd-theme-root") > -1, "#5: the outer survey keeps its theme root").toBe(true);
  });
});

describe("Sort dialog: closing without Apply", () => {
  test("the close button and Esc drop the draft; the bar, headers and rows keep the old sort", () => {
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }]);
    let open = openDialog(matrix);
    pick(directionOf(open, 0), "Alphabet, Z - A");
    addNew(open.popup).action();
    pick(directionOf(open, 1), "Alphabet, A - Z");
    expect(sortOf(matrix), "#1: a draft change writes nothing").toEqual([{ field: "product", direction: "asc" }]);
    open.popup.clickClose();
    expect([open.popup.isVisible, sortOf(matrix)], "#2: the close button").toEqual([false, [{ field: "product", direction: "asc" }]]);
    expect(columnValues(matrix, "product"), "#3").toEqual(["a", "b", "c"]);
    const header = matrix.renderedTable.headerRow.cells.filter((cell: any): boolean => !!cell.column && cell.column.name === "product")[0];
    expect(header.sortDirection, "#4").toBe("asc");
    expect(barAction(matrix, "sv-sort-level").data.getActionById("sv-sort-direction").title, "#5").toBe("Alphabet, A - Z");
    open = openDialog(matrix);
    expect(rowsOf(open), "#6: the next open starts from the sort").toEqual([["Product", "Alphabet, A - Z", false]]);
    pick(directionOf(open, 0), "Default");
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
    const open = openDialog(matrix);
    pick(fieldOf(open, 0), "Price");
    pick(directionOf(open, 0), "Low - High");
    apply(open.popup);
    expect([sortOf(matrix), open.popup.isVisible], "#1").toEqual([[], false]);
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
      pick(fieldOf(open, 0), "Price");
      pick(directionOf(open, 0), "High - Low");
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
  test("closing the dialog disposes its model and its survey", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    const field = fieldOf(open, 1);
    open.popup.clickClose();
    expect([open.dialog.isDisposed, open.survey.isDisposed, open.levels.isDisposed, field.isDisposed], "#1").toEqual([true, true, true, true]);
    expect(openDialog(matrix).dialog === open.dialog, "#2: a new draft on the next open").toBe(false);
  });
  test("a removed row leaves the matrix: its cells are disposed", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    const field = fieldOf(open, 1);
    removeRow(open, 1);
    expect([field.isDisposed, open.levels.visibleRows.length, open.levels.value.length], "#1").toEqual([true, 2, 2]);
  });
  test("disposing the question while the dialog is open closes it and does not throw", () => {
    const matrix = createMatrix();
    matrix.sort(threeLevels);
    const open = openDialog(matrix);
    expect(() => matrix.dispose(), "#1").not.toThrow();
    expect([open.dialog.isDisposed, open.survey.isDisposed, open.popup.isVisible], "#2").toEqual([true, true, false]);
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
      modalApplyButtonText: "Use", sortAZText: "A first", sortMoreAriaLabel: "All levels", sortMoveLevelAriaLabel: "Drag {0}", sortLevelFieldAriaLabel: "Key {0}" };
    const matrix = createMatrix();
    matrix.sort([{ field: "product", direction: "asc" }]);
    const open = openDialog(matrix);
    const { popup } = open;
    addNew(popup).action();
    matrix.survey.locale = testLocale;
    expect([popup.title, addNew(popup).title, footerAction(popup, "apply").title, moreOf(matrix).title, moreOf(matrix).ariaLabel], "#1")
      .toEqual(["Order", "New level", "Use", "All levels", "All levels"]);
    expect(rowsOf(open), "#2").toEqual([["Product", "A first", true], ["Category", "None", true]]);
    expect(titlesOf(directionOf(open, 0))[0], "#3").toBe("Stored");
    expect([open.survey.locale, rowAction(open, 1, "drag-drop").ariaLabel, labelOf(fieldOf(open, 1))], "#4: the matrix's texts").toEqual([testLocale, "Drag 2", "Key 2"]);
    matrix.survey.locale = "";
    expect([popup.title, open.survey.locale, rowAction(open, 1, "drag-drop").ariaLabel], "#5").toEqual(["Sort by", "", "Move sort level 2"]);
  });
});
describe("Sort dialog: the fields of the detail panel", () => {
  test("the dialog offers the detail fields after the columns, and Apply sorts by them", () => {
    const matrix = createMatrix({ maxSortLevel: 2, columns: [{ name: "product", title: "Product", cellType: "text" }], detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "qty", title: "Quantity", inputType: "number" }] });
    (<SurveyModel>matrix.survey).data = { matrix: [{ product: "b", qty: 5 }, { product: "a", qty: 30 }, { product: "c", qty: 10 }] };
    matrix.sort([{ field: "product", direction: "asc" }, { field: "qty", direction: "asc" }]);
    const open = openDialog(matrix);
    expect(titlesOf(fieldOf(open, 1)), "#1: the second row").toEqual(["Quantity"]);
    expect(titlesOf(directionOf(open, 1)), "#2: its type's directions").toEqual(["\u2014", "High - Low", "Low - High"]);
    pick(directionOf(open, 1), "High - Low");
    removeRow(open, 0);
    apply(open.popup);
    expect(sortOf(matrix), "#3").toEqual([{ field: "qty", direction: "desc" }]);
    expect(columnValues(matrix, "product"), "#4").toEqual(["a", "c", "b"]);
  });
});
