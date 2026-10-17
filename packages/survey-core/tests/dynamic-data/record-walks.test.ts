import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { IDataIssue } from "../../src/base-interfaces";

/* The walks over the records of a records question: the display value, the unknown keys of the value,
   the progress and the location a finding reports. Each record is read with the object that holds it,
   and a record without one through the question's templates. */

const choices = [{ value: 1, text: "One" }, { value: 2, text: "Two" }];
function createMatrix(json: any, data?: Array<any>): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
    columns: [{ name: "a", cellType: "dropdown", choices: choices }] }, json)] });
  if (!!data) survey.data = { m: data };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}
function createPanel(json: any, data?: Array<any>): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p",
    templateElements: [{ type: "dropdown", name: "a", choices: choices }] }, json)] });
  if (!!data) survey.data = { p: data };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
}
function getIssues(json: any, data: any): Array<IDataIssue> {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
  const survey = new SurveyModel({ elements: [json] });
  const res = survey.setData(data);
  warn.mockRestore();
  return res;
}
function getPaths(issues: Array<IDataIssue>): Array<string> {
  return issues.map((issue: IDataIssue): string => issue.path);
}

describe("displayValue: every record is formatted by its own object or by the templates", () => {
  test("matrix with rowsVisibleIf hiding a record: each record is formatted by its own row", () => {
    const matrix = createMatrix({ rowsVisibleIf: "{row.h} <> true" }, [{ a: 1, h: true }, { a: 2 }]);
    expect(matrix.visibleRows.length, "#1: one visible row").toBe(1);
    expect(matrix.displayValue, "#2").toEqual([{ a: "One", h: true }, { a: "Two" }]);
    expect(matrix.value, "#3: the answer is not changed").toEqual([{ a: 1, h: true }, { a: 2 }]);
  });
  test("matrix with rowsVisibleIf: keysAsText renames every record's keys", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, rowsVisibleIf: "{row.h} <> true",
      columns: [{ name: "a", title: "Column A", cellType: "dropdown", choices: choices }] }] });
    survey.data = { m: [{ a: 1, h: true }, { a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.getDisplayValue(true), "#1").toEqual([{ "Column A": "One", h: true }, { "Column A": "Two" }]);
  });
  test("matrix without a view: every record is formatted by its row", () => {
    const matrix = createMatrix({}, [{ a: 1 }, { a: 2 }]);
    expect(matrix.displayValue, "#1").toEqual([{ a: "One" }, { a: "Two" }]);
  });
  test("panel with a filter: a filtered-out record is formatted through the template", () => {
    const panel = createPanel({ filterExpression: "{a} = 2" }, [{ a: 1 }, { a: 2 }]);
    expect(panel.panels.length, "#1: one panel").toBe(1);
    expect(panel.displayValue, "#2").toEqual([{ a: "One" }, { a: "Two" }]);
    expect(panel.value, "#3: the answer is not changed").toEqual([{ a: 1 }, { a: 2 }]);
  });
  test("panel with paging: a record off the page is formatted through the template", () => {
    const panel = createPanel({ pageSize: 1 }, [{ a: 1 }, { a: 2 }]);
    expect(panel.panels.length, "#1: one panel").toBe(1);
    expect(panel.displayValue, "#2").toEqual([{ a: "One" }, { a: "Two" }]);
  });
  test("panel without a view: every record is formatted by its panel", () => {
    const panel = createPanel({}, [{ a: 1 }, { a: 2 }]);
    expect(panel.panels.length, "#1").toBe(2);
    expect(panel.displayValue, "#2").toEqual([{ a: "One" }, { a: "Two" }]);
  });
  test("panel whose panels were never built: the records keep their values", () => {
    const survey = new SurveyModel({ pages: [{ elements: [{ type: "text", name: "q1" }] }, { elements: [{ type: "paneldynamic", name: "p",
      templateElements: [{ type: "dropdown", name: "a", choices: choices }] }] }] });
    survey.data = { p: [{ a: 1 }, { a: 2 }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.displayValue, "#1").toEqual([{ a: 1 }, { a: 2 }]);
  });
});

describe("unknown keys: every loaded record is checked, whatever hides it", () => {
  const panelJson = { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "a" }] };
  const matrixJson = { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a", cellType: "text" }] };
  const data = (): Array<any> => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4, zzz: 1 }];

  test("paged panel: an unknown key on another page is reported with its record", () => {
    const issues = getIssues(Object.assign({ pageSize: 2 }, panelJson), { p: data() });
    expect(getPaths(issues), "#1").toEqual(["p[3].zzz"]);
    const panel = createPanel({ pageSize: 2 }, [{ a: 1 }, { a: 2 }, { a: 1 }, { a: 2, zzz: 1 }]);
    expect(panel.panels.length, "#2: the first page").toBe(2);
    expect(panel.isValueCorrect(), "#3").toBe(false);
  });
  test("unpaged panel: an unknown key is reported with its record", () => {
    expect(getPaths(getIssues(panelJson, { p: data() })), "#1").toEqual(["p[3].zzz"]);
  });
  test("panel with a filter that excludes the record with the unknown key", () => {
    const issues = getIssues(Object.assign({ filterExpression: "{a} < 3" }, panelJson), { p: data() });
    expect(getPaths(issues), "#1").toEqual(["p[3].zzz"]);
  });
  test("unpaged matrix with a filter that excludes the record with the unknown key", () => {
    const issues = getIssues(Object.assign({ filterExpression: "{a} < 3" }, matrixJson), { m: data() });
    expect(getPaths(issues), "#1").toEqual(["m[3].zzz"]);
    const matrix = createMatrix({ filterExpression: "{a} = 1" }, [{ a: 1 }, { a: 2, zzz: 1 }]);
    expect(matrix.visibleRows.length, "#2: one row").toBe(1);
    expect(matrix.isValueCorrect(), "#3").toBe(false);
  });
  test("paged matrix: an unknown key on another page is reported with its record", () => {
    const issues = getIssues(Object.assign({ pageSize: 2 }, matrixJson), { m: data() });
    expect(getPaths(issues), "#1").toEqual(["m[3].zzz"]);
  });
  test("paged matrix with a detail panel: the detail keys of a record off the page are known keys", () => {
    const json = Object.assign({ pageSize: 2, detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] }, matrixJson);
    const issues = getIssues(json, { m: [{ a: 1 }, { a: 2 }, { a: 3, d: "x" }, { a: 4, d: "y", zzz: 1 }] });
    expect(getPaths(issues), "#1").toEqual(["m[3].zzz"]);
  });
  test("unpaged matrix: an unknown key is reported with its record", () => {
    expect(getPaths(getIssues(matrixJson, { m: data() })), "#1").toEqual(["m[3].zzz"]);
  });
  test("a comment key and a totals key are known keys, per question type", () => {
    const matrix = { type: "matrixdynamic", name: "m", rowCount: 0,
      columns: [{ name: "a", cellType: "dropdown", choices: [1, 2], showOtherItem: true, storeOthersAsComment: true }] };
    expect(getPaths(getIssues(matrix, { m: [{ a: "other", "a-Comment": "x", "a-total": 3, zzz: 1 }] })), "#1: matrix").toEqual(["m[0].zzz"]);
    const panel = { type: "paneldynamic", name: "p",
      templateElements: [{ type: "dropdown", name: "a", choices: [1, 2], showOtherItem: true, storeOthersAsComment: true }] };
    expect(getPaths(getIssues(panel, { p: [{ a: "other", "a-Comment": "x", "a-total": 3, zzz: 1 }] })), "#2: panel").toEqual(["p[0].zzz"]);
    const pagedPanel = Object.assign({ pageSize: 1 }, panel);
    expect(getPaths(getIssues(pagedPanel, { p: [{ a: 1 }, { a: "other", "a-Comment": "x", "a-total": 3, zzz: 1 }] })), "#3: a panel record off the page")
      .toEqual(["p[1].zzz"]);
  });
  test("a sorted and a filtered matrix report a record by its index in the value", () => {
    const sorted = Object.assign({ sortBy: "a-" }, matrixJson);
    expect(getPaths(getIssues(sorted, { m: [{ a: 1 }, { a: 2 }, { a: 3, zzz: 1 }] })), "#1: sorted").toEqual(["m[2].zzz"]);
    const filtered = Object.assign({ filterExpression: "{a} > 1" }, matrixJson);
    expect(getPaths(getIssues(filtered, { m: [{ a: 1 }, { a: 2 }, { a: 3, zzz: 1 }] })), "#2: filtered").toEqual(["m[2].zzz"]);
  });
  test("a matrix with fixed rows reports a record by its row name", () => {
    const json = { type: "matrixdropdown", name: "d", rows: ["r1", "r2", "r3"], pageSize: 1, columns: [{ name: "a", cellType: "text" }] };
    expect(getPaths(getIssues(json, { d: { r1: { a: 1 }, r3: { a: 3, zzz: 1 } } })), "#1: paged").toEqual(["d.r3.zzz"]);
    const unpaged = { type: "matrixdropdown", name: "d", rows: ["r1", "r2", "r3"], columns: [{ name: "a", cellType: "text" }] };
    expect(getPaths(getIssues(unpaged, { d: { r1: { a: 1 }, r3: { a: 3, zzz: 1 } } })), "#2: unpaged").toEqual(["d.r3.zzz"]);
  });
});

describe("progress: one count per record", () => {
  const progress = (q: any): Array<number> => {
    const res = q.getProgressInfo();
    return [res.questionCount, res.answeredQuestionCount, res.requiredQuestionCount, res.requiredAnsweredQuestionCount];
  };
  const matrixColumns = [{ name: "a", cellType: "text", isRequired: true }, { name: "b", cellType: "text" },
    { name: "c", cellType: "text", visibleIf: "{row.a} = 1" }, { name: "e", cellType: "expression", expression: "1" }];
  const templateElements = [{ type: "text", name: "a", isRequired: true }, { type: "text", name: "b" },
    { type: "text", name: "c", visibleIf: "{panel.a} = 1" }, { type: "expression", name: "e", expression: "1" }];
  const data = (): Array<any> => [{ a: 1, c: 2 }, { b: 2 }, { a: 3, b: 3 }];

  test("dynamic matrix", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: matrixColumns }] });
    survey.data = { m: data() };
    expect(progress(survey.getQuestionByName("m")), "#1: rows not built").toEqual([7, 5, 3, 2]);
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows;
    expect(progress(survey.getQuestionByName("m")), "#2: rows built").toEqual([7, 5, 3, 2]);
  });
  test("paged dynamic matrix", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 2, columns: matrixColumns }] });
    survey.data = { m: data() };
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows;
    expect(progress(survey.getQuestionByName("m")), "#1").toEqual([7, 5, 3, 2]);
  });
  test("dynamic panel", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: templateElements }] });
    survey.data = { p: data() };
    expect(progress(survey.getQuestionByName("p")), "#1").toEqual([7, 5, 3, 2]);
  });
  test("paged dynamic panel", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", pageSize: 2, templateElements: templateElements }] });
    survey.data = { p: data() };
    (<QuestionPanelDynamicModel>survey.getQuestionByName("p")).panels;
    expect(progress(survey.getQuestionByName("p")), "#1").toEqual([7, 5, 3, 2]);
  });
  test("a required dynamic panel without required questions counts itself, paged as unpaged", () => {
    const json = { type: "paneldynamic", name: "p", isRequired: true, templateElements: [{ type: "text", name: "a" }] };
    const unpaged = new SurveyModel({ elements: [json] });
    unpaged.data = { p: [{ a: 1 }, { a: 2 }, { a: 3 }] };
    expect(progress(unpaged.getQuestionByName("p")), "#1: unpaged").toEqual([3, 3, 1, 1]);
    const paged = new SurveyModel({ elements: [Object.assign({ pageSize: 2 }, json)] });
    paged.data = { p: [{ a: 1 }, { a: 2 }, { a: 3 }] };
    (<QuestionPanelDynamicModel>paged.getQuestionByName("p")).panels;
    expect(progress(paged.getQuestionByName("p")), "#2: paged").toEqual([3, 3, 1, 1]);
  });
  test("matrix with fixed rows", () => {
    const json = { type: "matrixdropdown", name: "d", rows: ["r1", "r2", "r3"], columns: matrixColumns };
    const survey = new SurveyModel({ elements: [json] });
    survey.data = { d: { r1: { a: 1, c: 2 }, r2: { b: 2 }, r3: { a: 3, b: 3 } } };
    expect(progress(survey.getQuestionByName("d")), "#1: rows not built").toEqual([7, 5, 3, 2]);
    const paged = new SurveyModel({ elements: [Object.assign({ pageSize: 2 }, json)] });
    paged.data = { d: { r1: { a: 1, c: 2 }, r2: { b: 2 }, r3: { a: 3, b: 3 } } };
    (<QuestionMatrixDropdownModel>paged.getQuestionByName("d")).visibleRows;
    expect(progress(paged.getQuestionByName("d")), "#2: paged").toEqual([7, 5, 3, 2]);
  });
  const twoColumns = [{ name: "a", cellType: "text", isRequired: true }, { name: "b", cellType: "text" }];
  test("matrix with fixed rows: a row without a value is no record, and it is not counted before the rows exist", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "d", columns: twoColumns,
      rows: ["r1", { value: " ", text: "No value" }, "r2"] }] });
    survey.data = { d: { r1: { a: 1 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("d");
    expect(progress(matrix), "#1: rows not built, r1 and r2").toEqual([4, 1, 2, 1]);
    expect(matrix.visibleRows.length, "#2: the row without a value is never built").toBe(2);
    expect(progress(matrix), "#3: rows built, the same count").toEqual([4, 1, 2, 1]);
  });
  test("dynamic matrix: a padded row counts as unanswered until its row shows the default row value", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3, defaultRowValue: { b: "x" }, columns: twoColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ a: 1 }];
    expect(matrix.rowCount, "#1: rowCount stays above the value's length").toBe(3);
    expect(progress(matrix), "#2: rows not built").toEqual([6, 1, 3, 1]);
    matrix.visibleRows;
    expect(progress(matrix), "#3: rows built").toEqual([6, 3, 3, 1]);
  });
  test("dynamic matrix with a data source: the loaded window counts", async () => {
    let resolve: (records: Array<any>) => void = undefined;
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: twoColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.dataSource = { read: () => new Promise<Array<any>>(res => { resolve = res; }) };
    expect(progress(matrix), "#1: nothing read yet").toEqual([0, 0, 0, 0]);
    resolve([{ a: 1 }, { b: 2 }, {}]);
    for (let i = 0; i < 30; i++) await Promise.resolve();
    expect(matrix.value.length, "#2: the window is the value").toBe(3);
    expect(progress(matrix), "#3: three records, rows not built").toEqual([6, 2, 3, 1]);
  });
});

describe("getFilteredData: the visible rows that hold an answer, in the answer's shape", () => {
  test("matrix with fixed rows: keyed by the row value, a hidden and an empty row left out", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "d", columns: [{ name: "a", cellType: "text" }],
      rows: ["r1", { value: "r2", visibleIf: "{x} = 1" }, "r3", { value: 4, text: "Four" }] }] });
    survey.data = { d: { r1: { a: 1 }, r2: { a: 2 }, 4: { a: 4 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("d");
    expect(matrix.visibleRows.length, "#1: r2 is hidden").toBe(3);
    expect(matrix.getFilteredData(), "#2: r2 hidden, r3 empty").toEqual({ r1: { a: 1 }, 4: { a: 4 } });
  });
  test("matrix with fixed rows: two rows on one value give its key while either of them is visible", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "d", columns: [{ name: "a", cellType: "text" }],
      rows: [{ value: "r1", visibleIf: "{y} <> 1" }, { value: "r1", text: "Again", visibleIf: "{x} <> 1" }] }] });
    survey.data = { d: { r1: { a: 1 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("d");
    expect(matrix.getFilteredData(), "#1: both rows visible").toEqual({ r1: { a: 1 } });
    survey.setValue("x", 1);
    expect(matrix.visibleRows.length, "#2: the second row is hidden").toBe(1);
    expect(matrix.getFilteredData(), "#3: the first row gives it").toEqual({ r1: { a: 1 } });
    survey.setValue("x", 0);
    survey.setValue("y", 1);
    expect(matrix.getFilteredData(), "#4: the second row gives it").toEqual({ r1: { a: 1 } });
    survey.setValue("x", 1);
    expect(matrix.visibleRows.length, "#5: both rows are hidden").toBe(0);
    expect(matrix.getFilteredData(), "#6").toEqual({});
  });
  test("dynamic matrix: in row order under a sort, a hidden and an empty row left out", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, sortBy: "a-", rowsVisibleIf: "{row.h} <> true",
      columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "h", cellType: "boolean" }] }] });
    survey.data = { m: [{ a: 1 }, { a: 3, h: true }, {}, { a: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.map(row => row.getQuestionByName("a").value), "#1: sorted").toEqual([2, 1, undefined]);
    expect(matrix.getFilteredData(), "#2").toEqual([{ a: 2 }, { a: 1 }]);
  });
});

describe("the Multi-Select Matrix display value: each record is keyed by its own row", () => {
  [{ name: "without paging", json: {} }, { name: "with paging", json: { pageSize: 1 } }].forEach(mode => {
    function create(rows: Array<any>, data: any): QuestionMatrixDropdownModel {
      const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdropdown", name: "d",
        columns: [{ name: "a", cellType: "dropdown", choices: choices }], rows: rows }, mode.json)] });
      survey.data = { d: data };
      return <QuestionMatrixDropdownModel>survey.getQuestionByName("d");
    }
    test(`${mode.name}: keys and their texts, a hidden row left out`, () => {
      const matrix = create([{ value: "r1", text: "Row 1" }, { value: "r2", text: "Row 2", visibleIf: "{x} = 1" }, { value: "r3", text: "Row 3" }],
        { r1: { a: 1 }, r2: { a: 2 }, r3: { a: 2 } });
      expect(matrix.getDisplayValue(false), "#1").toEqual({ r1: { a: "One" }, r3: { a: "Two" } });
      expect(matrix.getDisplayValue(true), "#2").toEqual({ "Row 1": { a: "One" }, "Row 3": { a: "Two" } });
    });
    test(`${mode.name}: two rows on one value each show their own text`, () => {
      const matrix = create([{ value: "r1", text: "First" }, { value: "r1", text: "Second" }], { r1: { a: 1 } });
      expect(matrix.getDisplayValue(false), "#1").toEqual({ r1: { a: "One" } });
      expect(matrix.getDisplayValue(true), "#2").toEqual({ "First": { a: "One" }, "Second": { a: "One" } });
    });
  });
  test("without paging no list is created", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "d", columns: [{ name: "a", cellType: "dropdown", choices: choices }],
      rows: ["r1", { value: "r2", visibleIf: "{x} = 1" }] }] });
    survey.data = { d: { r1: { a: 1 }, r2: { a: 2 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("d");
    expect(matrix.getDisplayValue(true), "#1").toEqual({ r1: { a: "One" } });
    expect(matrix["dataListValue"], "#2: no list").toBeUndefined();
  });
});

describe("page validation: objects that were never built are valid", () => {
  test("design mode: the template's questions are not validated on a page leave", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", pageSize: 1,
      templateElements: [{ type: "text", name: "a", isRequired: true }] }] });
    survey.setDesignMode(true);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect((<any>panel).validatePageObjects(undefined), "#1").toBe(true);
    expect(panel.template.questions[0].errors.length, "#2: no error on the template").toBe(0);
  });
});

describe("displayValue: a record without a row is formatted as its row would be", () => {
  test("matrix with a filter: a field a shared question stores is formatted by that question", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", valueName: "shared", rowCount: 0, filterExpression: "{a} != 'x'", columns: [{ name: "a", cellType: "text" }] },
      { type: "paneldynamic", name: "p", valueName: "shared", templateElements: [{ type: "dropdown", name: "b", choices: choices }] }] });
    survey.data = { shared: [{ a: "x", b: 1 }, { a: "y", b: 2 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.length, "#1: one row").toBe(1);
    expect(matrix.displayValue, "#2").toEqual([{ a: "x", b: "One" }, { a: "y", b: "Two" }]);
  });
});

describe("the keys of a record no question stores", () => {
  const run = (json: any, data: Array<any>, isPaged: boolean): any => {
    const element = Object.assign({}, json);
    element.pageSize = isPaged ? 1 : 0;
    const survey = new SurveyModel({ elements: [element] });
    survey.data = { q: JSON.parse(JSON.stringify(data)) };
    const question: any = survey.getQuestionByName("q");
    if (element.type === "paneldynamic") question.panels; else question.visibleRows;
    survey.clearIncorrectValues();
    return survey.data.q;
  };
  test("matrix: a comment key of a column and a key with the totals suffix anywhere are kept, as released", () => {
    const json = { type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "c", cellType: "text" }] };
    const record = { "c": 1, "x-total-y": 5, "zz-Comment": "a", "c-Comment": "b", "zz": 2 };
    const expected = { "c": 1, "x-total-y": 5, "c-Comment": "b" };
    [false, true].forEach(isPaged => {
      expect(run(json, [Object.assign({}, record), Object.assign({}, record)], isPaged), "paged " + isPaged).toEqual([expected, expected]);
    });
  });
  test("panel: a comment or totals suffix is kept at the end of a question's name only, as released", () => {
    const json = { type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "q1" }] };
    const record = { "q1": 1, "q1-total": 2, "x-total-y": 3, "q1-Comment": "b", "zz-Comment": "c" };
    const expected = { "q1": 1, "q1-total": 2, "q1-Comment": "b" };
    [false, true].forEach(isPaged => {
      expect(run(json, [Object.assign({}, record), Object.assign({}, record)], isPaged), "paged " + isPaged).toEqual([expected, expected]);
    });
  });
});

describe("the question that formats a field of a record without a row", () => {
  test("the display value of a record without a row formats a detail-panel field by value name", () => {
    const displayValue = (pageSize: number): any => {
      const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, pageSize: pageSize, detailPanelMode: "underRow",
        columns: [{ name: "c", cellType: "dropdown", choices: [{ value: 1, text: "One" }] }],
        detailElements: [{ type: "dropdown", name: "d", choices: [{ value: 2, text: "Two" }] }] }] });
      survey.data = { m: [{ c: 1, d: 2 }, { c: 1, d: 2 }] };
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      matrix.visibleRows;
      return matrix.displayValue;
    };
    const paged = displayValue(1);
    expect(paged[1], "#1: the record on the other page, formatted by the column and the detail panel question").toEqual({ c: "One", d: "Two" });
    // A row formats a detail panel field once its detail panel exists, as released.
    expect(displayValue(0)[1], "#2: a row whose detail panel was never shown").toEqual({ c: "One", d: 2 });
  });
});
