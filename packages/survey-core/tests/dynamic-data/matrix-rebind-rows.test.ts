import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { MatrixDropdownRowModelBase } from "../../src/question_matrixdropdownbase";
import { QuestionTextModel } from "../../src/question_text";
import { QuestionDropdownModel } from "../../src/question_dropdown";
import { settings } from "../../src/settings";
import { FunctionFactory } from "../../src/functionsfactory";
import { CustomWidgetCollection } from "../../src/questionCustomWidgets";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { Action } from "../../src/actions/action";
import { getMatrixState, getQuestionFieldDiffs } from "./rebind-conformance";

/* A sort, a cleared sort and a page move the list cuts keep the rows of a Dynamic Matrix: each row takes
   the record its position holds now (QuestionMatrixDynamicModel.rebuildFromDataList). A rebound row has
   to look exactly like a row built for its record, so every case compares the matrix that rebinds with
   one built fresh from the same data in the same view (getMatrixState). */

interface ICellCase {
  name: string;
  column: any;
  values: Array<any>;
  comments?: Array<string>;
  // A value an edit writes into the first row.
  edit: any;
}
const keys = [3, 1, 5, 2, 4];
const cellCases: Array<ICellCase> = [
  { name: "text", column: { cellType: "text" }, values: ["a", undefined, "c", "", "e"], edit: "z" },
  { name: "text, number", column: { cellType: "text", inputType: "number" }, values: [3, undefined, 1, 0, 2], edit: 7 },
  { name: "text, date", column: { cellType: "text", inputType: "date" },
    values: ["2024-01-02", undefined, "2023-05-06", undefined, "2025-01-01"], edit: "2020-02-02" },
  { name: "text, numeric mask", column: { cellType: "text", maskType: "numeric", maskSettings: { thousandsSeparator: "," } },
    values: [1234.5, undefined, 12, 99999, undefined], edit: 5678 },
  { name: "text, pattern mask", column: { cellType: "text", maskType: "pattern", maskSettings: { pattern: "999-99" } },
    values: ["12345", undefined, "54321", undefined, "11111"], edit: "22222" },
  { name: "comment", column: { cellType: "comment" }, values: ["x\ny", undefined, "z", undefined, "w"], edit: "q" },
  { name: "dropdown", column: { cellType: "dropdown", choices: [1, 2, 3], showOtherItem: true },
    values: [1, undefined, "other", 3, 2], comments: [undefined, undefined, "my other", undefined, undefined], edit: 2 },
  { name: "checkbox", column: { cellType: "checkbox", choices: [1, 2, 3], showOtherItem: true },
    values: [[1, 2], undefined, ["other"], [3], undefined], comments: [undefined, undefined, "other text", undefined, undefined], edit: [3] },
  { name: "radiogroup", column: { cellType: "radiogroup", choices: [1, 2, 3], showOtherItem: true },
    values: [2, "other", undefined, 1, 3], comments: [undefined, "it is other", undefined, undefined, undefined], edit: 1 },
  { name: "tagbox", column: { cellType: "tagbox", choices: [1, 2, 3] }, values: [[1], undefined, [2, 3], undefined, [3]], edit: [1, 2] },
  { name: "boolean", column: { cellType: "boolean" }, values: [true, undefined, false, true, undefined], edit: false },
  { name: "rating", column: { cellType: "rating", rateCount: 5 }, values: [1, undefined, 5, 3, undefined], edit: 4 },
  { name: "expression", column: { cellType: "expression", expression: "{row.key} * 2" }, values: [undefined, undefined, undefined, undefined, undefined], edit: undefined }
];
const sortDesc = [{ field: "key", direction: "desc" }];

/* The column under test twice: "v" as it is, and "w" hidden by a condition for some records and read-only
   for one - the conditions are decided per record. */
function caseColumns(cellCase: ICellCase): Array<any> {
  return [{ name: "key", cellType: "text", inputType: "number" },
    Object.assign({ name: "v" }, cellCase.column),
    Object.assign({ name: "w", visibleIf: "{row.key} > 2", enableIf: "{row.key} != 4" }, cellCase.column)];
}
function caseData(cellCase: ICellCase): Array<any> {
  return keys.map((key: number, i: number): any => {
    const res: any = { key: key };
    const v = cellCase.values[i];
    const w = cellCase.values[(i + 1) % keys.length];
    if (v !== undefined) res.v = v;
    if (w !== undefined) res.w = w;
    const comments = cellCase.comments || [];
    if (!!comments[i]) res["v-Comment"] = comments[i];
    if (!!comments[(i + 1) % keys.length]) res["w-Comment"] = comments[(i + 1) % keys.length];
    return res;
  });
}
function createMatrix(columns: Array<any>, data: Array<any>, json?: any, surveyJson?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel(Object.assign({
    elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0, allowSort: true, columns: columns }, json)]
  }, surveyJson));
  survey.data = { m: JSON.parse(JSON.stringify(data)) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
// A matrix that renders: its rows and its table are built, as a UI shows them.
function render(matrix: QuestionMatrixDynamicModel): QuestionMatrixDynamicModel {
  matrix.renderedTable;
  return matrix;
}
function surveyOf(matrix: QuestionMatrixDynamicModel): SurveyModel {
  return <SurveyModel>matrix.survey;
}
function rowsOf(matrix: QuestionMatrixDynamicModel): Array<MatrixDropdownRowModelBase> {
  return matrix.visibleRows.slice();
}
function storedRecords(matrix: QuestionMatrixDynamicModel): Array<any> {
  return surveyOf(matrix).data.m;
}
function isSameRows(matrix: QuestionMatrixDynamicModel, rows: Array<MatrixDropdownRowModelBase>): boolean {
  const current = matrix.visibleRows;
  return current.length === rows.length && current.every((row: MatrixDropdownRowModelBase, i: number): boolean => row === rows[i]);
}
/* The matrix a fresh build gives for the view the matrix shows now: the same columns and data, the sort
   in the JSON, and the page and lockedRowCount (not serialized) assigned before the rows are built. */
function createFresh(matrix: QuestionMatrixDynamicModel, columns: Array<any>, json?: any, surveyJson?: any): QuestionMatrixDynamicModel {
  const sort = matrix.sortCriteria.map((item: any): any => ({ field: item.field, direction: item.direction }));
  const res = createMatrix(columns, surveyOf(matrix).data.m, Object.assign({}, json, sort.length > 0 ? { sortCriteria: sort } : {}), surveyJson);
  res.lockedRowCount = matrix.lockedRowCount;
  res.pageIndex = matrix.pageIndex;
  return render(res);
}
function expectSameAsFresh(matrix: QuestionMatrixDynamicModel, columns: Array<any>, json?: any, surveyJson?: any, message: string = ""): void {
  const fresh = createFresh(matrix, columns, json, surveyJson);
  // A UI reads the table again after a change: a rebuild drops the old one.
  expect(getMatrixState(render(matrix)), message).toEqual(getMatrixState(fresh));
  // The private fields too: what the public state does not show (getQuestionFieldDiffs).
  matrix.visibleRows.forEach((row: MatrixDropdownRowModelBase, i: number): void => {
    row.cells.forEach((cell: any, j: number): void => {
      const freshQuestion = fresh.visibleRows[i].cells[j].question;
      expect(getQuestionFieldDiffs(cell.question, freshQuestion), message + ": the fields of row " + i + ", " + cell.question.name).toEqual({});
    });
  });
}

describe("Matrix rebind: a rebound row looks like a row built for its record", () => {
  cellCases.forEach((cellCase: ICellCase): void => {
    const columns = caseColumns(cellCase);
    test(cellCase.name + ": a sort and a cleared sort", () => {
      const matrix = render(createMatrix(columns, caseData(cellCase)));
      const rows = rowsOf(matrix);
      const data = surveyOf(matrix).data;
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#1: the rows are rebound").toBe(true);
      expectSameAsFresh(matrix, columns, undefined, undefined, "#2: sorted");
      expect(surveyOf(matrix).data, "#3: the data").toEqual(data);
      matrix.sort([]);
      expect(isSameRows(matrix, rows), "#4: the rows are rebound").toBe(true);
      expectSameAsFresh(matrix, columns, undefined, undefined, "#5: the sort is cleared");
      expect(surveyOf(matrix).data, "#6: the data").toEqual(data);
    });
    test(cellCase.name + ": a page move", () => {
      const json = { pageSize: 2 };
      const matrix = render(createMatrix(columns, caseData(cellCase), json));
      const rows = rowsOf(matrix);
      const data = surveyOf(matrix).data;
      matrix.nextPage();
      expect(isSameRows(matrix, rows), "#1: the rows are rebound").toBe(true);
      expectSameAsFresh(matrix, columns, json, undefined, "#2: page 2");
      matrix.sort(sortDesc);
      expectSameAsFresh(matrix, columns, json, undefined, "#3: sorted on page 2");
      matrix.nextPage();
      expect(isSameRows(matrix, rows.slice(0, 1)), "#4: the last page has one row: rebuilt").toBe(false);
      expectSameAsFresh(matrix, columns, json, undefined, "#5: page 3");
      expect(surveyOf(matrix).data, "#6: the data").toEqual(data);
    });
    test(cellCase.name + ": an edit, then a sort", () => {
      const matrix = render(createMatrix(columns, caseData(cellCase)));
      const rows = rowsOf(matrix);
      if (cellCase.edit !== undefined) {
        rows[0].getQuestionByColumnName("v").value = cellCase.edit;
        rows[1].getQuestionByColumnName("v").value = cellCase.edit;
      }
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#1: the rows are rebound").toBe(true);
      expectSameAsFresh(matrix, columns, undefined, undefined, "#2: sorted after the edit");
      if (cellCase.edit !== undefined) {
        expect(surveyOf(matrix).data.m[0].v, "#3: the edit reached its record").toEqual(cellCase.edit);
      }
    });
  });
  [{ name: "without paging", json: { rowsVisibleIf: "{row.key} != 2" } }, { name: "pageSize: 2", json: { rowsVisibleIf: "{row.key} != 2", pageSize: 2 } }]
    .forEach((item: { name: string, json: any }): void => {
      test("rowsVisibleIf, " + item.name + ": a row that becomes hidden or shown", () => {
        const columns = caseColumns(cellCases[6]);
        const matrix = render(createMatrix(columns, caseData(cellCases[6]), item.json));
        matrix.sort(sortDesc);
        expectSameAsFresh(matrix, columns, item.json, undefined, "#1: sorted");
        if (matrix.pageCount > 1) {
          matrix.nextPage();
          expectSameAsFresh(matrix, columns, item.json, undefined, "#2: page 2");
        }
        matrix.sort([]);
        expectSameAsFresh(matrix, columns, item.json, undefined, "#3: the sort is cleared");
      });
    });
});

describe("Matrix rebind: what an input holds for its record goes", () => {
  const textColumns = [{ name: "key", cellType: "text", inputType: "number" },
    { name: "v", cellType: "text", isRequired: true },
    { name: "p", cellType: "text", maskType: "pattern", maskSettings: { pattern: "999-99" } },
    { name: "d", cellType: "dropdown", choices: [1, 2, 3] },
    { name: "t", cellType: "tagbox", choices: [1, 2, 3] }];
  const textData = [{ key: 2, v: "b", d: 1 }, { key: 1, d: 2, t: [1] }, { key: 3, v: "c", p: "12345" }];
  test("a row with errors loses them on a sort from code, as a rebuilt one does", () => {
    const matrix = render(createMatrix(textColumns, textData));
    const rows = rowsOf(matrix);
    expect(matrix.validate(true), "#1").toBe(false);
    expect(rows[1].getQuestionByColumnName("v").errors.length, "#2: the empty cell shows an error").toBe(1);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#3: rebound").toBe(true);
    expect(rows.map((row: MatrixDropdownRowModelBase): number => row.getQuestionByColumnName("v").errors.length), "#4: no errors").toEqual([0, 0, 0]);
    expectSameAsFresh(matrix, textColumns, undefined, undefined, "#5");
  });
  test("an incomplete masked entry and an open, filtered dropdown are dropped", () => {
    const matrix = render(createMatrix(textColumns, textData));
    const rows = rowsOf(matrix);
    const masked = <QuestionTextModel>rows[1].getQuestionByColumnName("p");
    masked.inputValue = "12";
    expect(masked.isEmpty(), "#1: an incomplete entry is no value").toBe(true);
    const dropdown = <QuestionDropdownModel>rows[0].getQuestionByColumnName("d");
    const listModel = dropdown.dropdownListModel;
    listModel.inputStringRendered = "3";
    listModel.popupModel.isVisible = true;
    const tagbox = <any>rows[2].getQuestionByColumnName("t");
    tagbox.dropdownListModel.inputStringRendered = "2";
    tagbox.dropdownListModel.popupModel.isVisible = true;
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2: rebound").toBe(true);
    expect(listModel.popupModel.isVisible, "#3: the list is closed").toBe(false);
    expectSameAsFresh(matrix, textColumns, undefined, undefined, "#4");
  });
  test("a checkbox does not restore a value a hidden choice took from the old record into the new one", () => {
    const columns = [{ name: "key", cellType: "text", inputType: "number" }, { name: "flag", cellType: "boolean" },
      { name: "c", cellType: "checkbox", choices: [1, 2, 3], choicesVisibleIf: "{item} < 3 or {row.flag} = true" }];
    const matrix = render(createMatrix(columns, [{ key: 1, flag: true, c: [3] }, { key: 2 }]));
    const rows = rowsOf(matrix);
    rows[0].getQuestionByColumnName("flag").value = false;
    expect(storedRecords(matrix), "#1: the hidden choice clears the answer").toEqual([{ key: 1, flag: false }, { key: 2 }]);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2: rebound").toBe(true);
    expectSameAsFresh(matrix, columns, undefined, undefined, "#3");
    rows[0].getQuestionByColumnName("flag").value = true;
    expect(storedRecords(matrix), "#4: nothing is restored into the record of key 2").toEqual([{ key: 1, flag: false }, { key: 2, flag: true }]);
  });
  test("the \"other\" text typed for the old record does not show the empty \"other\" error for the new one", () => {
    const columns = [{ name: "key", cellType: "text", inputType: "number" },
      { name: "d", cellType: "dropdown", choices: [1, 2], showOtherItem: true }];
    const surveyJson = { checkErrorsMode: "onValueChanged" };
    const matrix = render(createMatrix(columns, [{ key: 1 }, { key: 2 }], undefined, surveyJson));
    const rows = rowsOf(matrix);
    const question = <QuestionDropdownModel>rows[0].getQuestionByColumnName("d");
    question.value = "other";
    question.otherValue = "x";
    question.otherValue = "xy";
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#1: rebound").toBe(true);
    expectSameAsFresh(matrix, columns, undefined, surveyJson, "#2");
    question.value = "other";
    const fresh = createFresh(matrix, columns, undefined, surveyJson);
    const freshQuestion = fresh.visibleRows[0].getQuestionByColumnName("d");
    freshQuestion.value = "other";
    expect(freshQuestion.errors.length, "#3: a built row shows no error").toBe(0);
    expect(question.errors.length, "#4: nor does the rebound row").toBe(0);
  });
  ["dropdown", "radiogroup", "checkbox"].forEach((cellType: string): void => {
    test(cellType + ", showCommentArea: the \"other\" text of the old record is not written into the new one", () => {
      const isCheckbox = cellType === "checkbox";
      const columns = [{ name: "key", cellType: "text", inputType: "number" },
        { name: "d", cellType: cellType, choices: [1, 2], showOtherItem: true, showCommentArea: true }];
      const matrix = render(createMatrix(columns, [{ key: 1, d: isCheckbox ? ["custom"] : "custom" }, { key: 2 }]));
      const rows = rowsOf(matrix);
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#1: rebound").toBe(true);
      expectSameAsFresh(matrix, columns, undefined, undefined, "#2");
      (<QuestionSelectBase>rows[0].getQuestionByColumnName("d")).renderedValue = isCheckbox ? ["other"] : "other";
      expect(storedRecords(matrix)[1], "#3: the record of key 2").toEqual({ key: 2, d: isCheckbox ? ["other"] : "other" });
    });
  });
  test("choicesFromQuestion: the comment typed for a copied choice goes with the old record", () => {
    const json = (sort?: Array<any>): any => ({ elements: [
      { type: "radiogroup", name: "src", choices: [{ value: "a", showCommentArea: true }, "b"] },
      Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0, allowSort: true,
        columns: [{ name: "key", cellType: "text", inputType: "number" }, { name: "d", cellType: "radiogroup", choicesFromQuestion: "src" }] },
      !!sort ? { sortCriteria: sort } : {})] });
    const data = { m: [{ key: 1, d: { value: "a", comment: "typed" } }, { key: 2, d: "a" }] };
    const survey = new SurveyModel(json());
    survey.data = JSON.parse(JSON.stringify(data));
    const matrix = render(<QuestionMatrixDynamicModel>survey.getQuestionByName("m"));
    const rows = rowsOf(matrix);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#1: rebound").toBe(true);
    const freshSurvey = new SurveyModel(json(sortDesc));
    freshSurvey.data = JSON.parse(JSON.stringify(data));
    const fresh = render(<QuestionMatrixDynamicModel>freshSurvey.getQuestionByName("m"));
    const comments = (m: QuestionMatrixDynamicModel): Array<string> => m.visibleRows.map((row: MatrixDropdownRowModelBase): string => {
      const q = <QuestionSelectBase>row.getQuestionByColumnName("d");
      return q.getCommentValue(q.visibleChoices.filter((item: any): boolean => item.value === "a")[0]);
    });
    expect(comments(fresh), "#2: built").toEqual(["", "typed"]);
    expect(comments(matrix), "#3: rebound").toEqual(["", "typed"]);
    matrix.visibleRows.forEach((row: MatrixDropdownRowModelBase, i: number): void => {
      const freshQuestion = fresh.visibleRows[i].getQuestionByColumnName("d");
      expect(getQuestionFieldDiffs(row.getQuestionByColumnName("d"), freshQuestion), "#4: the fields of row " + i).toEqual({});
    });
  });
  test("the value-changed class an input got for the old record is removed from the kept element", () => {
    const columns = [{ name: "key", cellType: "text", inputType: "number" }, { name: "v", cellType: "text", inputType: "date" }];
    const matrix = render(createMatrix(columns, [{ key: 1 }, { key: 2 }]));
    const rows = rowsOf(matrix);
    const question = <QuestionTextModel>rows[0].getQuestionByColumnName("v");
    const input = document.createElement("input");
    question.afterRenderQuestionElement(input);
    question["setIsValueChanged"]();
    const className = question.cssClasses.isValueChanged;
    expect(input.classList.contains(className), "#1: the element got the class").toBe(true);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2: rebound").toBe(true);
    expect(input.classList.contains(className), "#3: the record of key 2 is empty").toBe(false);
  });
  /* The rebind works on the record level (QuestionRecordItem.rebindToRecord): every question of the row, the
     questions of its detail panel too. A matrix with a detail panel rebuilds on a sort, so the row is rebound
     directly here. */
  test("a rebound row resets the questions of its open detail panel as well as its cells", () => {
    const matrix = render(createMatrix([{ name: "key", cellType: "text" }],
      [{ key: 1, note: "n1" }, { key: 2 }],
      { detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note", isRequired: true }] }));
    const rows = rowsOf(matrix);
    rows[0].showDetailPanel();
    rows[1].showDetailPanel();
    expect(rows[0].getQuestionByName("note").value, "#1").toBe("n1");
    expect(matrix.validate(true), "#2").toBe(false);
    expect(rows[1].getQuestionByName("note").errors.length, "#3: the empty note shows an error").toBe(1);
    const data = JSON.parse(JSON.stringify(surveyOf(matrix).data));
    rows[0].rebindToRecord({ key: 2 });
    rows[1].rebindToRecord({ key: 1, note: "n1" });
    expect(rows.map((row: MatrixDropdownRowModelBase): any => row.getQuestionByColumnName("key").value), "#4").toEqual([2, 1]);
    expect(rows[0].getQuestionByName("note").value, "#5: the old note goes").toBeUndefined();
    expect(rows[1].getQuestionByName("note").value, "#6: the new note comes").toBe("n1");
    expect(rows[1].getQuestionByName("note").errors.length, "#7: the error goes").toBe(0);
    expect(surveyOf(matrix).data, "#8: nothing is written back").toEqual(data);
  });
});

const plainColumns = [{ name: "key", cellType: "text", inputType: "number" }, { name: "name", cellType: "text" }];
const plainData = [{ key: 3, name: "c" }, { key: 1, name: "a" }, { key: 5, name: "e" }, { key: 2, name: "b" }, { key: 4, name: "d" }];
function names(matrix: QuestionMatrixDynamicModel): Array<any> {
  return matrix.visibleRows.map((row: MatrixDropdownRowModelBase): any => row.getQuestionByColumnName("name").value);
}
function storedNames(matrix: QuestionMatrixDynamicModel): Array<any> {
  return (surveyOf(matrix).data.m || []).map((record: any): any => record.name);
}

describe("Matrix rebind: the rows are kept for a sort and a page move, and rebuilt otherwise", () => {
  test("a sort, a cleared sort and a page move keep the row objects", () => {
    const matrix = render(createMatrix(plainColumns, plainData, { pageSize: 2 }));
    const rows = rowsOf(matrix);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#1: a sort").toBe(true);
    expect(names(matrix), "#2").toEqual(["e", "d"]);
    matrix.nextPage();
    expect(isSameRows(matrix, rows), "#3: a page move").toBe(true);
    expect(names(matrix), "#4").toEqual(["c", "b"]);
    matrix.sort([]);
    expect(isSameRows(matrix, rows), "#5: a cleared sort keeps the page and the rows").toBe(true);
    expect(names(matrix), "#6").toEqual(["e", "b"]);
  });
  test("a filter and refreshView() rebuild them", () => {
    const matrix = render(createMatrix(plainColumns, plainData));
    let rows = rowsOf(matrix);
    matrix.sort(sortDesc);
    matrix.filterExpression = "{key} != 9";
    expect(isSameRows(matrix, rows), "#1: a filter").toBe(false);
    rows = rowsOf(matrix);
    matrix.refreshView();
    expect(isSameRows(matrix, rows), "#2: refreshView()").toBe(false);
  });
  interface IFallback { name: string, json?: any, surveyJson?: any, columns?: Array<any>, setup?: (matrix: QuestionMatrixDynamicModel) => void }
  const fallbacks: Array<IFallback> = [
    { name: "a detail panel", json: { detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note" }] } },
    { name: "onQuestionCreated", setup: (m) => { surveyOf(m).onQuestionCreated.add(() => { }); } },
    { name: "onMatrixCellCreating", setup: (m) => { surveyOf(m).onMatrixCellCreating.add(() => { }); } },
    { name: "onMatrixCellCreated", setup: (m) => { surveyOf(m).onMatrixCellCreated.add(() => { }); } },
    { name: "onMatrixRowAdded", setup: (m) => { surveyOf(m).onMatrixRowAdded.add(() => { }); } },
    { name: "onAfterRenderMatrixCell", setup: (m) => { surveyOf(m).onAfterRenderMatrixCell.add(() => { }); } },
    { name: "onAfterRenderQuestionInput", setup: (m) => { surveyOf(m).onAfterRenderQuestionInput.add(() => { }); } },
    { name: "onCellCreatedCallback", setup: (m) => { m.onCellCreatedCallback = () => { }; } },
    { name: "clearInvisibleValues: onHidden", surveyJson: { clearInvisibleValues: "onHidden" } },
    { name: "a column defaultValue", columns: [plainColumns[0], { name: "name", cellType: "text", defaultValue: "x" }] },
    { name: "a column defaultValueExpression", columns: [plainColumns[0], { name: "name", cellType: "text", defaultValueExpression: "{row.key}" }] },
    { name: "defaultRowValue", json: { defaultRowValue: { name: "x" } } },
    { name: "copyDefaultValueFromLastEntry", json: { copyDefaultValueFromLastEntry: true } },
    { name: "showInMultipleColumns", columns: [plainColumns[0], { name: "name", cellType: "checkbox", choices: [1, 2], showInMultipleColumns: true }] },
    { name: "a file cell", columns: [plainColumns[0], { name: "name", cellType: "file" }] },
    { name: "a signature cell", columns: [plainColumns[0], { name: "name", cellType: "signaturepad" }] },
    { name: "the vertical column layout", json: { transposeData: true } },
    { name: "single-input mode", surveyJson: { questionsOnPageMode: "inputPerPage" } },
    { name: "onUpdateQuestionCssClasses", setup: (m) => { surveyOf(m).onUpdateQuestionCssClasses.add(() => { }); } },
    { name: "choices loaded on demand", columns: [plainColumns[0], { name: "name", cellType: "dropdown", choicesLazyLoadEnabled: true }] },
    { name: "a choice with elements", columns: [plainColumns[0],
      { name: "name", cellType: "checkbox", choices: [{ value: 1, elements: [{ type: "text", name: "t" }] }, 2] }] }
  ];
  fallbacks.forEach((fallback: IFallback): void => {
    test("rebuilt: " + fallback.name, () => {
      const columns = fallback.columns || plainColumns;
      const matrix = createMatrix(columns, plainData, Object.assign({ pageSize: 2 }, fallback.json), fallback.surveyJson);
      if (!!fallback.setup) fallback.setup(matrix);
      const isSingleInput = surveyOf(matrix).isSingleVisibleInput;
      if (!isSingleInput) render(matrix);
      let rows = rowsOf(matrix);
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#1: a sort").toBe(false);
      // Single-input mode does not page.
      if (isSingleInput) return;
      rows = rowsOf(matrix);
      matrix.pageIndex = 1;
      expect(matrix.pageIndex, "#2").toBe(1);
      expect(isSameRows(matrix, rows), "#3: a page move").toBe(false);
    });
  });
  test("rebuilt: a remote source", () => {
    const matrix = render(createMatrix(plainColumns, [], { pageSize: 2 }));
    matrix.dataSource = { read: (): Array<any> => plainData.map((record: any): any => Object.assign({}, record)) };
    let rows = rowsOf(matrix);
    expect(rows.length, "#1").toBe(2);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2: a sort").toBe(false);
    rows = rowsOf(matrix);
    matrix.pageIndex = 1;
    expect(isSameRows(matrix, rows), "#3: a page move").toBe(false);
  });
  test("rebuilt: the page move of an add", () => {
    const matrix = render(createMatrix(plainColumns, plainData.slice(0, 4), { pageSize: 2 }));
    const rows = rowsOf(matrix);
    matrix.addRow();
    expect(matrix.pageIndex, "#1: the new record's page").toBe(2);
    expect(matrix.visibleRows.some((row: MatrixDropdownRowModelBase): boolean => rows.indexOf(row) > -1), "#2: new rows").toBe(false);
  });
  test("rebuilt: choices loaded from a URL - a load the old record started would write into the new one", () => {
    const globalAny: any = globalThis;
    const savedXhr = globalAny.XMLHttpRequest;
    globalAny.XMLHttpRequest = class { open(): void { } setRequestHeader(): void { } send(): void { } };
    try {
      const columns = [plainColumns[0], { name: "name", cellType: "dropdown", choicesByUrl: { url: "http://localhost/choices/{row.key}" } }];
      const matrix = render(createMatrix(columns, plainData));
      const rows = rowsOf(matrix);
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#1").toBe(false);
    } finally {
      globalAny.XMLHttpRequest = savedXhr;
    }
  });
  test("under beginUpdate() a sort and a page move rebuild, and the rows are right after endUpdate()", () => {
    const matrix = render(createMatrix(plainColumns, plainData, { pageSize: 2 }));
    matrix.beginUpdate();
    matrix.sort(sortDesc);
    matrix.nextPage();
    matrix.endUpdate();
    expect(names(matrix), "#1").toEqual(["c", "b"]);
    expectSameAsFresh(matrix, plainColumns, { pageSize: 2 }, undefined, "#2");
  });
  test("rebuilt: a cell whose validator is still running", () => {
    const callbacks: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("rebindAsyncCheck", function (): any { callbacks.push(this.returnResult); return false; }, true);
    try {
      const columns = [plainColumns[0], { name: "name", cellType: "text", validators: [{ type: "expression", expression: "rebindAsyncCheck({row.name}) = 1" }] }];
      const matrix = render(createMatrix(columns, plainData));
      const rows = rowsOf(matrix);
      matrix.validate(true);
      expect(callbacks.length > 0, "#1: a validator is running").toBe(true);
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#2").toBe(false);
      callbacks.forEach((callback: (res: any) => void): void => callback(1));
    } finally {
      FunctionFactory.Instance.unregister("rebindAsyncCheck");
    }
  });
  test("rebuilt: a cell whose async expression is still running - its result would land in another record", () => {
    const calls: Array<{ key: any, done: (res: any) => void }> = [];
    FunctionFactory.Instance.register("rebindAsyncExpr", function (params: Array<any>): any {
      calls.push({ key: params[0], done: this.returnResult }); return false;
    }, true);
    try {
      const columns = [plainColumns[0], { name: "e", cellType: "expression", expression: "rebindAsyncExpr({row.key})" }];
      const matrix = render(createMatrix(columns, [{ key: 1 }, { key: 2 }]));
      const rows = rowsOf(matrix);
      expect(calls.length > 0, "#1: a run is pending").toBe(true);
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#2").toBe(false);
      calls.forEach((call): void => call.done("r-" + call.key));
      expect(storedRecords(matrix), "#3: each record gets its own result").toEqual([{ key: 1, e: "r-1" }, { key: 2, e: "r-2" }]);
    } finally {
      FunctionFactory.Instance.unregister("rebindAsyncExpr");
    }
  });
  test("rebuilt: a column with a custom widget - it is set up for the record its element is mounted for", () => {
    const widgets = CustomWidgetCollection.Instance.widgets;
    CustomWidgetCollection.Instance.addCustomWidget({ name: "rebindWidget", isFit: (question: any): boolean => question.name === "rebindWidgetCol" });
    try {
      const matrix = render(createMatrix([plainColumns[0], { name: "rebindWidgetCol", cellType: "text" }], plainData));
      const rows = rowsOf(matrix);
      matrix.sort(sortDesc);
      expect(isSameRows(matrix, rows), "#1").toBe(false);
    } finally {
      widgets.splice(widgets.indexOf(CustomWidgetCollection.Instance.getCustomWidgetByName("rebindWidget")), 1);
    }
  });
});

describe("Matrix rebind: the records follow the rows", () => {
  ["none", "onComplete", "onHidden", "onHiddenContainer"].forEach((mode: string): void => {
    test("survey.data does not change on a sort and a page move, clearInvisibleValues: " + mode, () => {
      const columns = [plainColumns[0], plainColumns[1], { name: "extra", cellType: "text", visibleIf: "{row.key} > 2" }];
      const data = plainData.map((record: any): any => Object.assign({ extra: "x" + record.key }, record));
      const matrix = render(createMatrix(columns, data, { pageSize: 2 }, { clearInvisibleValues: mode }));
      const before = JSON.parse(JSON.stringify(surveyOf(matrix).data));
      matrix.sort(sortDesc);
      expect(surveyOf(matrix).data, "#1: a sort").toEqual(before);
      matrix.nextPage();
      expect(surveyOf(matrix).data, "#2: a page move").toEqual(before);
      matrix.sort([{ field: "name", direction: "asc" }]);
      matrix.prevPage();
      expect(surveyOf(matrix).data, "#3").toEqual(before);
    });
  });
  test("an edit made after a rebind reaches the record its row shows, and only that record", () => {
    const matrix = render(createMatrix(plainColumns, plainData, { pageSize: 2 }));
    const rows = rowsOf(matrix);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#1").toBe(true);
    rows[0].getQuestionByColumnName("name").value = "E";
    expect(storedNames(matrix), "#2: record 2 (key 5)").toEqual(["c", "a", "E", "b", "d"]);
    matrix.nextPage();
    rows[1].getQuestionByColumnName("name").value = "B";
    expect(storedNames(matrix), "#3: record 3 (key 2)").toEqual(["c", "a", "E", "B", "d"]);
    expect(rows[1].getQuestionByColumnName("name").value, "#4").toBe("B");
    expect(rows[0].getQuestionByColumnName("name").value, "#5: the other row shows its own record").toBe("c");
  });
  test("removing a row after a rebind removes the record it shows", () => {
    const matrix = render(createMatrix(plainColumns, plainData, { pageSize: 2 }));
    const rows = rowsOf(matrix);
    matrix.sort(sortDesc);
    matrix.nextPage();
    expect(isSameRows(matrix, rows), "#1").toBe(true);
    matrix.removeRowUI(rows[1]);
    expect(storedNames(matrix), "#2: key 2 is gone").toEqual(["c", "a", "e", "d"]);
  });
  test("confirmDelete asks about the record the row shows, and a sort or a page move while it is open drops the answer", () => {
    const old = settings.confirmActionAsync;
    const callbacks: Array<(res: boolean) => void> = [];
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { callbacks.push(callback); return true; };
    try {
      const matrix = render(createMatrix(plainColumns, plainData, { pageSize: 2, confirmDelete: true }));
      const rows = rowsOf(matrix);
      matrix.sort(sortDesc);
      matrix.removeRowUI(rows[0]);
      expect(callbacks.length, "#1: asks").toBe(1);
      callbacks[0](true);
      expect(storedNames(matrix), "#2: key 5, the record the row shows, is removed").toEqual(["c", "a", "b", "d"]);
      matrix.removeRowUI(matrix.visibleRows[0]);
      expect(callbacks.length, "#3").toBe(2);
      matrix.sort([{ field: "key", direction: "asc" }]);
      callbacks[1](true);
      expect(storedNames(matrix), "#4: a sort while it was open: nothing is removed").toEqual(["c", "a", "b", "d"]);
      matrix.removeRowUI(matrix.visibleRows[0]);
      expect(callbacks.length, "#5").toBe(3);
      matrix.nextPage();
      callbacks[2](true);
      expect(storedNames(matrix), "#6: a page move while it was open: nothing is removed").toEqual(["c", "a", "b", "d"]);
      matrix.removeRowUI(matrix.visibleRows[0]);
      callbacks[3](true);
      expect(storedNames(matrix), "#7: an answer with nothing in between removes the record").toEqual(["a", "b", "d"]);
    } finally {
      settings.confirmActionAsync = old;
    }
  });
  test("lockedRowCount follows the records: the remove button of each row", () => {
    const json = { pageSize: 2 };
    const matrix = createMatrix(plainColumns, plainData, json);
    matrix.lockedRowCount = 1;
    render(matrix);
    const removable = (): Array<boolean> => matrix.visibleRows.map((row: MatrixDropdownRowModelBase): boolean => !!matrix.renderedTable.getRowAction(row, "remove-row"));
    expect(removable(), "#1: record 0 is locked").toEqual([false, true]);
    matrix.sort(sortDesc);
    expect(removable(), "#2: keys 5 and 4 - records 2 and 4").toEqual([true, true]);
    matrix.sort([{ field: "key", direction: "asc" }]);
    matrix.nextPage();
    expect(removable(), "#3: keys 3 and 4 - records 0 and 4").toEqual([false, true]);
    expectSameAsFresh(matrix, plainColumns, json, undefined, "#4");
  });
  test("totals follow a rebind: they count every record, and an edit through a rebound row reaches them", () => {
    const columns = [plainColumns[0], { name: "amount", cellType: "text", inputType: "number", totalType: "sum" },
      { name: "top", cellType: "text", inputType: "number", totalType: "max" }];
    const data = plainData.map((record: any): any => ({ key: record.key, amount: record.key * 10, top: record.key }));
    const matrix = render(createMatrix(columns, data, { pageSize: 2 }));
    const rows = rowsOf(matrix);
    const totals = (): Array<any> => [matrix.visibleTotalRow.cells[1].question.value, matrix.visibleTotalRow.cells[2].question.value];
    expect(totals(), "#1").toEqual([150, 5]);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2").toBe(true);
    expect(totals(), "#3").toEqual([150, 5]);
    matrix.nextPage();
    expect(totals(), "#4").toEqual([150, 5]);
    rows[0].getQuestionByColumnName("amount").value = 100;
    rows[0].getQuestionByColumnName("top").value = 9;
    expect(totals(), "#5: key 3 had 30").toEqual([220, 9]);
    expectSameAsFresh(matrix, columns, { pageSize: 2 }, undefined, "#6");
  });
});

describe("Matrix rebind: the rendered table and its callbacks", () => {
  test("nothing is reset: the table keeps its rendered rows; visibleRowsChangedCallback fires once", () => {
    const matrix = render(createMatrix(plainColumns, plainData, { pageSize: 2 }));
    const table = matrix.renderedTable;
    const renderedRows = table.rows.slice();
    let resets = 0;
    let changes = 0;
    matrix.onRenderedTableResetCallback = () => { resets++; };
    matrix.visibleRowsChangedCallback = () => { changes++; };
    matrix.sort(sortDesc);
    expect([resets, changes], "#1: a sort").toEqual([0, 1]);
    matrix.nextPage();
    expect([resets, changes], "#2: a page move").toEqual([0, 2]);
    expect(matrix.renderedTable === table, "#3: the same table").toBe(true);
    expect(table.rows.every((row: any, i: number): boolean => row === renderedRows[i]), "#4: the same rendered rows").toBe(true);
  });
  test("the header row is built again in the kept table: an edit of a sort item changes the direction it shows", () => {
    const matrix = render(createMatrix(plainColumns, plainData));
    const table = matrix.renderedTable;
    const keyHeader = (): any => table.headerRow.cells.filter((cell: any): boolean => !!cell.column && cell.column.name === "key")[0];
    const header = keyHeader();
    const id = header.id;
    matrix.sort([{ field: "key", direction: "asc" }]);
    expect(matrix.renderedTable === table, "#1: the same table").toBe(true);
    expect(keyHeader() !== header, "#2: a new header row").toBe(true);
    expect([keyHeader().id, keyHeader().ariaSort], "#3: the column header keeps its id").toEqual([id, "ascending"]);
    const headerRow = table.headerRow;
    matrix.sortCriteria[0].direction = "desc";
    expect(names(matrix), "#4: re-sorted").toEqual(["e", "d", "c", "b", "a"]);
    expect(table.headerRow !== headerRow, "#5: the header row is replaced, so a renderer shows it").toBe(true);
    expect(keyHeader().ariaSort, "#6").toBe("descending");
  });
  test("a page move renumbers the drag handles the rows keep", () => {
    const json = { pageSize: 2, allowRowReorder: true };
    const matrix = render(createMatrix(plainColumns, plainData, json));
    const label = (): Array<string> => matrix.visibleRows.map((row: MatrixDropdownRowModelBase): string =>
      matrix.renderedTable.getRowAction(row, "drag-drop").ariaLabel);
    const before = label();
    const rows = rowsOf(matrix);
    matrix.nextPage();
    expect(isSameRows(matrix, rows), "#1: rebound").toBe(true);
    expect(label() !== before && label()[0] !== before[0], "#2: the labels follow the new positions").toBe(true);
    expectSameAsFresh(matrix, plainColumns, json, undefined, "#3: as a table built for page 2");
  });
  test("the comment typed for a choice goes with the old record", () => {
    const columns = [plainColumns[0], { name: "name", cellType: "radiogroup", choices: [{ value: "a", showCommentArea: true }, "b"] }];
    const matrix = render(createMatrix(columns, [{ key: 1, name: "a" }, { key: 2, name: "a" }]));
    const rows = rowsOf(matrix);
    const question: any = rows[0].getQuestionByColumnName("name");
    const item = question.choices[0];
    question.setCommentValue(item, "typed");
    expect(surveyOf(matrix).data.m[0].name, "#1: stored with the record of key 1").toEqual({ value: "a", comment: "typed" });
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2: rebound").toBe(true);
    expect(rows[0].getValue("key"), "#3: row 0 shows key 2").toBe(2);
    expect(question.getCommentValue(item), "#4: whose record has no comment").toBe("");
    expect(rows[1].getQuestionByColumnName("name").getCommentValue(item), "#5: row 1 shows key 1's").toBe("typed");
    expectSameAsFresh(matrix, columns, undefined, undefined, "#4");
  });
  test("under a reset lock a sort that changes the action columns resets the table once the lock is released", () => {
    const json = { allowRowReorder: true };
    const matrix = render(createMatrix(plainColumns, plainData, json));
    matrix["lockResetRenderedTable"] = true;
    matrix.sort(sortDesc);
    matrix["lockResetRenderedTable"] = false;
    expect(matrix.visibleRows.some((row: MatrixDropdownRowModelBase): boolean => !!matrix.renderedTable.getRowAction(row, "drag-drop")),
      "#1: no drag handle is left").toBe(false);
    expectSameAsFresh(matrix, plainColumns, json, undefined, "#2");
  });
  test("the Action instances an onGetMatrixRowActions handler supplies are listed once, however often the rows are sorted", () => {
    const matrix = createMatrix(plainColumns, plainData);
    const cached: Array<Action> = [];
    surveyOf(matrix).onGetMatrixRowActions.add((_, options: any) => {
      const index = matrix.visibleRows.indexOf(options.row);
      if (!cached[index]) cached[index] = new Action({ id: "info" + index, action: () => { } });
      options.actions.push(cached[index]);
    });
    render(matrix);
    for (let i = 0; i < 10; i++) {
      matrix.sort([{ field: "key", direction: i % 2 === 0 ? "desc" : "asc" }]);
    }
    expect(matrix.renderedTable["suppliedRowActions"].length, "#1").toBe(plainData.length);
    expect(cached.every((action: Action): boolean => !action.isDisposed), "#2: none is disposed").toBe(true);
  });
  test("a sort that adds or removes the drag column resets the table", () => {
    const json = { allowRowReorder: true };
    const matrix = render(createMatrix(plainColumns, plainData, json));
    const rows = rowsOf(matrix);
    let resets = 0;
    matrix.onRenderedTableResetCallback = () => { resets++; };
    expect(matrix.renderedTable.isRowsDragAndDrop, "#1: the rows can be dragged").toBe(true);
    matrix.sort(sortDesc);
    expect(isSameRows(matrix, rows), "#2: the rows are rebound").toBe(true);
    expect(resets, "#3: the drag column goes: reset").toBe(1);
    expect(matrix.renderedTable.isRowsDragAndDrop, "#4").toBe(false);
    expectSameAsFresh(matrix, plainColumns, json, undefined, "#5: sorted");
    matrix.sort([]);
    expect(resets, "#6: the drag column comes back: reset").toBe(2);
    expectSameAsFresh(matrix, plainColumns, json, undefined, "#7: the sort is cleared");
  });
  test("onGetMatrixRowActions is asked again for each rebound row, and its actions follow the record", () => {
    const matrix = createMatrix(plainColumns, plainData);
    const asked: Array<any> = [];
    surveyOf(matrix).onGetMatrixRowActions.add((_, options: any) => {
      const name = options.row.getQuestionByColumnName("name").value;
      asked.push(name);
      options.actions.push({ id: "info", title: "About " + name, action: () => { } });
    });
    render(matrix);
    asked.length = 0;
    matrix.sort(sortDesc);
    expect(asked, "#1").toEqual(["e", "d", "c", "b", "a"]);
    const titles = matrix.visibleRows.map((row: MatrixDropdownRowModelBase): string => matrix.renderedTable.getRowAction(row, "info").title);
    expect(titles, "#2").toEqual(["About e", "About d", "About c", "About b", "About a"]);
  });
  test("sorting 60 times adds no handlers to the survey and keeps the rows", () => {
    const matrix = render(createMatrix(caseColumns(cellCases[6]), caseData(cellCases[6])));
    const rows = rowsOf(matrix);
    const survey: any = surveyOf(matrix);
    const countHandlers = (): number => Object.keys(survey)
      .filter((key: string): boolean => !!survey[key] && typeof survey[key].length === "number" && typeof survey[key].add === "function")
      .reduce((sum: number, key: string): number => sum + survey[key].length, 0);
    const handlers = countHandlers();
    for (let i = 0; i < 60; i++) {
      matrix.sort([{ field: "key", direction: i % 2 === 0 ? "desc" : "asc" }]);
    }
    expect(isSameRows(matrix, rows), "#1").toBe(true);
    expect(countHandlers(), "#2").toBe(handlers);
  });
});
