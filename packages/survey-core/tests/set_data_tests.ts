import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { ItemValue } from "../src/itemvalue";
import { ComponentCollection } from "../src/question_custom";
import { IDataIssue } from "../src/base-interfaces";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// The consumer-visible part of an issue. question and expressionResult are asserted separately where they matter.
function shortIssues(issues: Array<IDataIssue>): Array<any> {
  return issues.map(issue => ({ type: issue.type, path: issue.path, value: issue.value }));
}
function createSurvey(json: any): SurveyModel {
  return new SurveyModel(json);
}
function createQuestionSurvey(question: any): SurveyModel {
  return createSurvey({ elements: [{ name: "q", ...question }] });
}
const dynamicMatrix = { type: "matrixdynamic", columns: [{ name: "c", cellType: "text" }] };
const dynamicPanel = { type: "paneldynamic", templateElements: [{ type: "text", name: "t" }] };
const matrixJson = { type: "matrix", rows: ["r1"], columns: ["c1"] };
const matrixDropdownJson = { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] };
const multipleTextJson = { type: "multipletext", items: [{ name: "i1" }] };

let warn: any;
beforeEach(() => {
  // Assigning a value a question cannot hold logs a warning; the checks themselves log nothing.
  warn = vi.spyOn(console, "warn").mockImplementation(() => { });
});
afterEach(() => {
  warn.mockRestore();
});

describe("setData: the list of issues", () => {
  test("Every value check is reported with its type, its location and the offending value", () => {
    const cases: Array<[string, any, any, Array<any>]> = [
      ["number text <- \"abc\"", { type: "text", inputType: "number" }, "abc",
        [{ type: "invalidValueType", path: "q", value: "abc" }]],
      ["boolean <- 'maybe'", { type: "boolean" }, "maybe",
        [{ type: "invalidValueType", path: "q", value: "maybe" }]],
      ["radiogroup <- array", { type: "radiogroup", choices: ["a", "b"] }, ["a"],
        [{ type: "invalidValueType", path: "q", value: ["a"] }]],
      ["radiogroup <- unknown choice", { type: "radiogroup", choices: ["a", "b"] }, "z",
        [{ type: "invalidChoiceValue", path: "q", value: "z" }]],
      ["checkbox <- unknown choices, one issue per item", { type: "checkbox", choices: ["a", "b"] }, ["a", "z", "zz"],
        [{ type: "invalidChoiceValue", path: "q[1]", value: "z" },
          { type: "invalidChoiceValue", path: "q[2]", value: "zz" }]],
      ["rating <- out of range", { type: "rating", rateMax: 5 }, 99,
        [{ type: "invalidChoiceValue", path: "q", value: 99 }]],
      ["file <- number", { type: "file" }, 5,
        [{ type: "invalidValueType", path: "q", value: 5 }]],
      ["matrixdynamic <- string", dynamicMatrix, "oops",
        [{ type: "invalidValueType", path: "q", value: "oops" }]],
      ["matrixdynamic <- scalar rows", dynamicMatrix, ["x"],
        [{ type: "invalidValueType", path: "q", value: ["x"] }]],
      ["paneldynamic <- scalar panels", dynamicPanel, ["x"],
        [{ type: "invalidValueType", path: "q", value: ["x"] }]],
      ["matrix <- unknown column", matrixJson, { r1: "zz" },
        [{ type: "invalidChoiceValue", path: "q.r1", value: "zz" }]],
      ["matrixdropdown <- scalar row", matrixDropdownJson, { r1: "oops" },
        [{ type: "invalidValueType", path: "q.r1", value: "oops" }]],
      ["multipletext <- string", multipleTextJson, "oops",
        [{ type: "invalidValueType", path: "q", value: "oops" }]],
      ["matrixdynamic <- unknown key", dynamicMatrix, [{ c: "x", zzz: 1 }],
        [{ type: "unknownProperty", path: "q[0].zzz", value: 1 }]],
      ["paneldynamic <- unknown key", dynamicPanel, [{ t: "x", zzz: 1 }],
        [{ type: "unknownProperty", path: "q[0].zzz", value: 1 }]],
      ["matrix <- unknown key", matrixJson, { r1: "c1", zz: "c1" },
        [{ type: "unknownProperty", path: "q.zz", value: "c1" }]],
      ["matrixdropdown <- unknown row", matrixDropdownJson, { r1: { c: 1 }, zz: { c: 2 } },
        [{ type: "unknownProperty", path: "q.zz", value: { c: 2 } }]],
      ["multipletext <- unknown item", multipleTextJson, { i1: "a", zz: "x" },
        [{ type: "unknownProperty", path: "q.zz", value: "x" }]],
    ];
    cases.forEach(([label, question, value, expected]) => {
      const survey = createQuestionSurvey(question);
      expect(shortIssues(survey.setData({ q: value })), label).toEqual(expected);
      expect(survey.data, label + ": the model keeps the data as given").toEqual({ q: value });
    });
  });
  test("question is the instance that holds the value", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"] },
        { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }
      ]
    });
    const issues = survey.setData({ q1: "z", m: [{ c: "z" }] });
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", path: "q1", value: "z" },
      { type: "invalidChoiceValue", path: "m[0].c", value: "z" }
    ]);
    expect(issues[0].question, "a root question").toBe(survey.getQuestionByName("q1"));
    const matrix: any = survey.getQuestionByName("m");
    expect(issues[1].question, "the cell question").toBe(matrix.allRows[0].cells[0].question);
  });
  test("A correct response gives an empty array", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"] },
        { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }
      ]
    });
    expect(survey.setData({ q1: "a", m: [{ c: "x" }] })).toEqual([]);
  });
  test("Every call returns a new array", () => {
    const survey = createQuestionSurvey({ type: "text" });
    const first = survey.setData({ q: "a" });
    expect(first).toEqual([]);
    expect(survey.setData({ q: "a" }), "a different instance").not.toBe(first);
  });
});

describe("setData: locations", () => {
  test("A nested location is addressed from the survey root", () => {
    const survey = createSurvey({
      elements: [{
        type: "paneldynamic", name: "panel",
        templateElements: [{ type: "matrixdynamic", name: "matrix", columns: [{ name: "col", cellType: "dropdown", choices: ["a"] }] }]
      }]
    });
    const issues = survey.setData({ panel: [{}, { matrix: [{ col: "z", zzz: 1 }], zzz: 2 }] });
    expect(shortIssues(issues)).toEqual([
      { type: "unknownProperty", path: "panel[1].zzz", value: 2 },
      { type: "unknownProperty", path: "panel[1].matrix[0].zzz", value: 1 },
      { type: "invalidChoiceValue", path: "panel[1].matrix[0].col", value: "z" }
    ]);
    const panel: any = survey.getQuestionByName("panel");
    const matrix: any = panel.panels[1].getQuestionByName("matrix");
    expect(issues[0].question, "the dynamic panel").toBe(panel);
    expect(issues[1].question, "the nested matrix").toBe(matrix);
    expect(issues[2].question, "the cell question").toBe(matrix.allRows[0].cells[0].question);
  });
  test("A cell question, a detail panel question and a panel item question own their issues", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "matrixdynamic", name: "matrix", columns: [{ name: "col", cellType: "dropdown", choices: ["a"] }],
          detailPanelMode: "underRow", detailElements: [{ type: "dropdown", name: "detail", choices: ["a"] }]
        },
        { type: "paneldynamic", name: "panel", templateElements: [{ type: "dropdown", name: "q", choices: ["a"] }] }
      ]
    });
    const issues = survey.setData({ matrix: [{ col: "z", detail: "z" }], panel: [{ q: "a" }, { q: "z" }] });
    expect(shortIssues(issues), "the first panel item is correct").toEqual([
      { type: "invalidChoiceValue", path: "matrix[0].col", value: "z" },
      { type: "invalidChoiceValue", path: "matrix[0].detail", value: "z" },
      { type: "invalidChoiceValue", path: "panel[1].q", value: "z" }
    ]);
    const matrix: any = survey.getQuestionByName("matrix");
    const panel: any = survey.getQuestionByName("panel");
    expect(issues[0].question, "the cell question").toBe(matrix.allRows[0].cells[0].question);
    expect(issues[1].question, "the detail panel question").toBe(matrix.allRows[0].detailPanel.questions[0]);
    expect(issues[2].question, "the panel item question").toBe(panel.panels[1].getQuestionByName("q"));
  });
  test("A named row of a matrixdropdown inside a panel of a page", () => {
    const survey = createSurvey({
      pages: [{
        elements: [{
          type: "panel", name: "p",
          elements: [{ type: "matrixdropdown", name: "matrix", rows: ["r1"], columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }]
        }]
      }]
    });
    expect(shortIssues(survey.setData({ matrix: { r1: { c: "z" } } }))).toEqual([
      { type: "invalidChoiceValue", path: "matrix.r1.c", value: "z" }
    ]);
  });
  test("A detail panel question of a dynamic matrix", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdynamic", name: "matrix", columns: [{ name: "c", cellType: "text" }],
        detailPanelMode: "underRow", detailElements: [{ type: "dropdown", name: "detail", choices: ["a"] }]
      }]
    });
    expect(shortIssues(survey.setData({ matrix: [{ c: "x" }, { c: "y", detail: "z" }] }))).toEqual([
      { type: "invalidChoiceValue", path: "matrix[1].detail", value: "z" }
    ]);
  });
  test("A key that contains a dot or a bracket is written as is, so the path is ambiguous", () => {
    const survey = createSurvey({
      elements: [{ type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "t" }] }]
    });
    expect(shortIssues(survey.setData({ panel: [{ "a[0].b": 1 }], "c.d[2]": 2 }))).toEqual([
      { type: "unknownProperty", path: "c.d[2]", value: 2 },
      { type: "unknownProperty", path: "panel[0].a[0].b", value: 1 }
    ]);
  });
  test("Two locations that render the same path are two issues", () => {
    const survey = createSurvey({
      elements: [{ type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "t" }] }]
    });
    // The root key "panel[0].a" and the key "a" of the first panel item: the paths are equal, the
    // locations are not, and deduplication compares the locations.
    expect(shortIssues(survey.setData({ panel: [{ a: 1 }], "panel[0].a": 2 }))).toEqual([
      { type: "unknownProperty", path: "panel[0].a", value: 2 },
      { type: "unknownProperty", path: "panel[0].a", value: 1 }
    ]);
  });
  test("An unknown key inside a row does not hide a malformed row or an unknown row name", () => {
    const survey = createSurvey({
      elements: [{ type: "matrixdropdown", name: "q", rows: ["r1", "r2"], columns: [{ name: "c", cellType: "text" }] }]
    });
    expect(shortIssues(survey.setData({ q: { r1: { c: 1, zzz: 2 }, r2: "oops", zz: { c: 3 } } }))).toEqual([
      { type: "unknownProperty", path: "q.r1.zzz", value: 2 },
      { type: "invalidValueType", path: "q.r2", value: "oops" },
      { type: "unknownProperty", path: "q.zz", value: { c: 3 } }
    ]);
  });
  test("A multiple text item and one item of a checkbox value", () => {
    const survey = createSurvey({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "item1", inputType: "number" }] },
        { type: "checkbox", name: "cb", choices: ["a"] }
      ]
    });
    expect(shortIssues(survey.setData({ mt: { item1: "abc" }, cb: ["a", "z"] }))).toEqual([
      { type: "invalidValueType", path: "mt.item1", value: "abc" },
      { type: "invalidChoiceValue", path: "cb[1]", value: "z" }
    ]);
  });
});

describe("setData: hidden rows keep their data index", () => {
  test("A dynamic matrix with a hidden row", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdynamic", name: "matrixdyn", rowsVisibleIf: "{row.c} != 'hide'",
        columns: [{ name: "c", cellType: "dropdown", choices: ["a", "hide"] }]
      }]
    });
    const issues = survey.setData({ matrixdyn: [{ c: "hide" }, { c: "z" }] });
    expect((<any>survey.getQuestionByName("matrixdyn")).visibleRows.length, "the first row is hidden").toBe(1);
    expect(shortIssues(issues), "the data index, not the visible index").toEqual([
      { type: "invalidChoiceValue", path: "matrixdyn[1].c", value: "z" }
    ]);
  });
  test("A bad value in a hidden row is reported", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdynamic", name: "matrixdyn", rowsVisibleIf: "{row.c} != 'zz'",
        columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }]
      }]
    });
    const issues = survey.setData({ matrixdyn: [{ c: "zz" }] });
    expect((<any>survey.getQuestionByName("matrixdyn")).visibleRows.length, "no visible row").toBe(0);
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", path: "matrixdyn[0].c", value: "zz" }
    ]);
  });
  test("A dropdown matrix with a hidden named row is reported by its row name", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdropdown", name: "matrix", rows: ["r1", "r2"], rowsVisibleIf: "{row.c} != 'hide'",
        columns: [{ name: "c", cellType: "dropdown", choices: ["a", "hide"] }]
      }]
    });
    const issues = survey.setData({ matrix: { r1: { c: "hide" }, r2: { c: "z" } } });
    expect((<any>survey.getQuestionByName("matrix")).visibleRows.length, "r1 is hidden").toBe(1);
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", path: "matrix.r2.c", value: "z" }
    ]);
  });
});

describe("setData: root keys", () => {
  const rootJson = {
    calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
    elements: [{ type: "panel", name: "p", elements: [{ type: "text", name: "q1" }] }]
  };
  test("Only a key that no question, comment or calculated value owns is reported", () => {
    const survey = createSurvey(rootJson);
    const issues = survey.setData({ q1: "a", stray: 1, "q1-Comment": "x" });
    expect(shortIssues(issues)).toEqual([
      { type: "unknownProperty", path: "stray", value: 1 }
    ]);
    expect(issues[0].question, "no question owns a stray root key").toBeUndefined();
  });
  test("clearIncorrectValues(true) removes exactly the reported root keys", () => {
    const survey = createSurvey(rootJson);
    survey.setData({ q1: "a", stray: 1, "q1-Comment": "x" });
    survey.clearIncorrectValues(true);
    expect(survey.data).toEqual({ q1: "a", "q1-Comment": "x", calc: 2 });
    expect(survey.setData(survey.data)).toEqual([]);
  });
});

describe("setData: options", () => {
  const json = {
    elements: [
      { type: "dropdown", name: "sel", choices: ["a"] },
      { type: "text", name: "num", inputType: "number" },
      { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }
    ],
    calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }]
  };
  const data = { sel: "z", num: "abc", m: [{ c: "x", zzz: 1 }] };
  test("Without options the three value checks run and no expressionResultMismatch is reported", () => {
    const types = createSurvey(json).setData(data).map(issue => issue.type);
    expect(types.sort(), "the calculated value is not reported").toEqual(["invalidChoiceValue", "invalidValueType", "unknownProperty"]);
  });
  test("A report* value check set to false is not run", () => {
    expect(createSurvey(json).setData(data, { reportUnknownProperties: false }).map(i => i.type).sort())
      .toEqual(["invalidChoiceValue", "invalidValueType"]);
    expect(createSurvey(json).setData(data, { reportInvalidValueTypes: false }).map(i => i.type).sort())
      .toEqual(["invalidChoiceValue", "unknownProperty"]);
    expect(createSurvey(json).setData(data, { reportInvalidChoiceValues: false }).map(i => i.type).sort())
      .toEqual(["invalidValueType", "unknownProperty"]);
    expect(createSurvey(json).setData(data, { reportUnknownProperties: true, reportInvalidValueTypes: true, reportInvalidChoiceValues: true }).length,
      "true is the default").toBe(3);
  });
  test("reportExpressionResultMismatches: true turns the diagnostic on", () => {
    const issues = createSurvey(json).setData(data, { reportExpressionResultMismatches: true });
    expect(issues.map(i => i.type).sort()).toEqual(["expressionResultMismatch", "invalidChoiceValue", "invalidValueType", "unknownProperty"]);
    const mismatch = issues.filter(issue => issue.type === "expressionResultMismatch")[0];
    expect(mismatch.path).toBe("calc");
    expect(mismatch.expressionResult).toBe(2);
    expect(createSurvey(json).setData(data, { reportExpressionResultMismatches: false }).length, "false is the default").toBe(3);
  });
  test("keepIncorrectValues changes nothing for setData() and isValueCorrect(); it governs clearing only", () => {
    const survey = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] });
    (<any>survey.getQuestionByName("q")).keepIncorrectValues = true;
    expect(shortIssues(survey.setData({ q: "z" })), "the question level").toEqual([
      { type: "invalidChoiceValue", path: "q", value: "z" }
    ]);
    expect(survey.getQuestionByName("q").isValueCorrect(), "isValueCorrect() reports it").toBe(false);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues() keeps it").toEqual({ q: "z" });
    const surveyLevel = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] });
    surveyLevel.keepIncorrectValues = true;
    expect(surveyLevel.setData({ q: "z" }).length, "the survey level").toBe(1);
    surveyLevel.clearIncorrectValues(true);
    expect(surveyLevel.data, "clearIncorrectValues() keeps it on the survey level").toEqual({ q: "z" });
  });
});

describe("setData: the state of a question does not matter", () => {
  test("An invisible and a read-only question are checked", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "hidden", choices: ["a"], visible: false },
        { type: "dropdown", name: "byExpression", choices: ["a"], visibleIf: "{hidden} = 'never'" },
        { type: "dropdown", name: "ro", choices: ["a"], readOnly: true }
      ]
    });
    expect(survey.setData({ hidden: "z", byExpression: "z", ro: "z" }).map(issue => issue.path)).toEqual(["hidden", "byExpression", "ro"]);
  });
  test("An empty value and a container with an empty value produce nothing", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "t" },
        { type: "checkbox", name: "cb", choices: ["a"] },
        { type: "multipletext", name: "mt", items: [{ name: "i1" }] },
        { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }
      ]
    });
    expect(survey.setData({ t: "", cb: [], mt: {}, m: [] })).toEqual([]);
  });
});

describe("setData: the copy of the data", () => {
  class CustomValue {
    constructor(public id: number) { }
  }
  test("A Date and a class instance a question holds are correct values", () => {
    // setData() cannot deliver them as they are, see the next test.
    const survey = createSurvey({ elements: [{ type: "text", name: "d" }, { type: "text", name: "c" }] });
    survey.getQuestionByName("d").value = new Date(2020, 0, 2);
    survey.getQuestionByName("c").value = new CustomValue(1);
    expect(survey.getQuestionByName("d").isValueCorrect(), "a Date").toBe(true);
    expect(survey.getQuestionByName("c").isValueCorrect(), "a class instance").toBe(true);
  });
  test("The data is copied through JSON: a Date arrives as its ISO string, a class instance as a plain object", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "d", inputType: "date" }, { type: "text", name: "c" }] });
    const data = { d: new Date(Date.UTC(2020, 0, 2)), c: new CustomValue(1) };
    const issues = survey.setData(data, { reportExpressionResultMismatches: true });
    expect(survey.data.d, "a string, never a Date").toBe("2020-01-02T00:00:00.000Z");
    expect(survey.data.c instanceof CustomValue, "not the class instance").toBe(false);
    expect(survey.data.c, "a plain object").toEqual({ id: 1 });
    // A date text holds an ISO string and a text question keeps an object value, so the copies are
    // correct values; the comparison runs on the copy as well, so it reports nothing either.
    expect(issues).toEqual([]);
    expect(data.d instanceof Date && data.c instanceof CustomValue, "the caller's values are untouched").toBe(true);
  });
});

describe("setData: the same assignment as survey.data =", () => {
  const json = {
    pages: [
      { name: "page1", visibleIf: "{hidePage1} != true", elements: [{ type: "dropdown", name: "q1", choices: ["a"] }] },
      {
        name: "page2",
        elements: [
          { type: "boolean", name: "hidePage1" },
          { type: "panel", name: "p", state: "collapsed", elements: [{ type: "text", name: "inPanel" }] },
          {
            type: "matrixdynamic", name: "m",
            columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }, { name: "c2", cellType: "text", defaultValue: "cv" }]
          },
          { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "t" }, { type: "text", name: "t2", defaultValueExpression: "'ex'" }] }
        ]
      }
    ]
  };
  function createCountedSurvey(): { survey: SurveyModel, counters: any } {
    const survey = createSurvey(json);
    const counters: any = { valueChanged: 0, validateQuestion: 0, validatePanel: 0, settingErrors: 0, cellCreated: 0, panelAdded: 0 };
    survey.onValueChanged.add(() => counters.valueChanged++);
    survey.onValidateQuestion.add(() => counters.validateQuestion++);
    survey.onValidatePanel.add(() => counters.validatePanel++);
    survey.onSettingQuestionErrors.add(() => counters.settingErrors++);
    survey.onMatrixCellCreated.add(() => counters.cellCreated++);
    survey.onDynamicPanelAdded.add(() => counters.panelAdded++);
    return { survey, counters };
  }
  function render(survey: SurveyModel): void {
    (<any>survey.getQuestionByName("m")).allRows;
    (<any>survey.getQuestionByName("dp")).panels;
  }
  function getState(survey: SurveyModel, counters: any): any {
    return {
      counters: counters,
      data: survey.data,
      currentPage: survey.currentPage.name,
      wasShown: survey.pages.map(page => page.wasShown),
      passed: survey.pages.map(page => page.passed)
    };
  }
  function assignBoth(data: any): { assigned: any, set: any, issues: Array<IDataIssue>, survey: SurveyModel } {
    const byAssignment = createCountedSurvey();
    byAssignment.survey.data = JSON.parse(JSON.stringify(data));
    render(byAssignment.survey);
    const bySetData = createCountedSurvey();
    const issues = bySetData.survey.setData(data);
    render(bySetData.survey);
    return {
      assigned: getState(byAssignment.survey, byAssignment.counters),
      set: getState(bySetData.survey, bySetData.counters),
      issues: issues,
      survey: bySetData.survey
    };
  }
  test("Both models end in the same state, and setData() adds no validation", () => {
    const res = assignBoth({ q1: "z", m: [{ c: "z" }], dp: [{ t: "x" }] });
    expect(res.set, "events, data, current page, passed pages").toEqual(res.assigned);
    expect(res.set.currentPage, "the first page").toBe("page1");
    expect(res.set.counters.valueChanged > 0, "the assignment is counted").toBe(true);
    expect(shortIssues(res.issues), "the issues are found").toEqual([
      { type: "invalidChoiceValue", path: "q1", value: "z" },
      { type: "invalidChoiceValue", path: "m[0].c", value: "z" }
    ]);
    ["validateQuestion", "validatePanel", "settingErrors"].forEach(key => expect(res.set.counters[key], key).toBe(0));
    res.issues.forEach(issue => expect(issue.question.errors.length, issue.path + ": no error is set").toBe(0));
    expect((<PanelModel>res.survey.getPanelByName("p")).state, "a collapsed panel stays collapsed").toBe("collapsed");
  });
  test("When the data hides the current page, both models move to the same page", () => {
    const res = assignBoth({ hidePage1: true, q1: "a", m: [{ c: "a" }] });
    expect(res.set, "events, data, current page, passed pages").toEqual(res.assigned);
    expect(res.set.currentPage, "page1 is hidden").toBe("page2");
    expect(res.issues).toEqual([]);
  });
  test("The caller's data object is never modified", () => {
    const survey = createSurvey(json);
    const data = { q1: "z", m: [{ c: "a" }], dp: [{ t: "x" }] };
    const copy = JSON.parse(JSON.stringify(data));
    survey.setData(data, { reportExpressionResultMismatches: true });
    expect(survey.data.m, "the model applied the default").toEqual([{ c: "a", c2: "cv" }]);
    expect(data, "nested objects included").toEqual(copy);
  });
});

describe("setData: null", () => {
  const json = {
    calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
    elements: [
      { type: "text", name: "q1" },
      { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c", cellType: "text", defaultValue: "cv" }] }
    ]
  };
  test("null and undefined clear the data, as survey.data = null does", () => {
    // Rendered after each assignment, as setData() initializes the model after each one.
    const expected = createSurvey(json);
    [{ q1: "a" }, null].forEach(data => {
      expected.data = data;
      (<any>expected.getQuestionByName("m")).allRows;
    });
    [null, undefined].forEach(value => {
      const survey = createSurvey(json);
      survey.setData({ q1: "a" });
      expect(survey.setData(value), String(value) + ": nothing to report").toEqual([]);
      expect(survey.data, String(value) + ": the data is cleared").toEqual(expected.data);
      expect(survey.data.q1, String(value) + ": the answer is gone").toBeUndefined();
    });
  });
  test("With reportExpressionResultMismatches the data is compared with {}, so every default is reported", () => {
    const survey = createSurvey(json);
    const issues = survey.setData(null, { reportExpressionResultMismatches: true });
    expect(survey.data).toEqual({ m: [{ c: "cv" }], calc: 2 });
    expect(shortIssues(issues)).toEqual([
      { type: "expressionResultMismatch", path: "m", value: undefined },
      { type: "expressionResultMismatch", path: "calc", value: undefined }
    ]);
    expect(issues.map(issue => issue.expressionResult)).toEqual([[{ c: "cv" }], 2]);
    expect(issues[0].question).toBe(survey.getQuestionByName("m"));
  });
});

describe("setData: initialization", () => {
  const nestedJson = {
    elements: [
      {
        type: "matrixdynamic", name: "matrix",
        columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "dropdown", choices: ["a"], defaultValue: "a" }]
      },
      {
        type: "paneldynamic", name: "panel",
        templateElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", defaultValueExpression: "'ex'" }]
      }
    ]
  };
  const nestedData = { matrix: [{ c1: "x", zzz: 1 }], panel: [{ q1: "y" }] };
  test("A model rendered before the call reports the same issues and holds the same data as a fresh one", () => {
    const rendered = createSurvey(nestedJson);
    (<any>rendered.getQuestionByName("matrix")).allRows;
    (<any>rendered.getQuestionByName("panel")).panels;
    const renderedIssues = shortIssues(rendered.setData(nestedData));
    const fresh = createSurvey(nestedJson);
    expect(shortIssues(fresh.setData(nestedData)), "the same locations").toEqual(renderedIssues);
    expect(renderedIssues).toEqual([
      { type: "unknownProperty", path: "matrix[0].zzz", value: 1 }
    ]);
    expect(fresh.data, "the model has completed its initialization").toEqual(rendered.data);
    expect(fresh.data.panel, "the defaults of a panel item").toEqual([{ q1: "y", q2: "ex" }]);
  });
  test("The same data twice reports the same list", () => {
    const survey = createSurvey(nestedJson);
    const first = survey.setData(nestedData);
    expect(shortIssues(first), "something is reported").toEqual([
      { type: "unknownProperty", path: "matrix[0].zzz", value: 1 }
    ]);
    expect(survey.setData(nestedData), "the same issues").toEqual(first);
    // Without question: it is a different instance in each model.
    const withResult = (issues: Array<IDataIssue>) => shortIssues(issues).map((issue, index) => ({ ...issue, expressionResult: issues[index].expressionResult }));
    const options = { reportExpressionResultMismatches: true };
    expect(withResult(createSurvey(nestedJson).setData(nestedData, options)), "two fresh models, the same list")
      .toEqual(withResult(createSurvey(nestedJson).setData(nestedData, options)));
  });
  test("A second assignment on the same model does what survey.data = does, the cell default included", () => {
    // The data setter applies a cell defaultValue when the row is created only: a second assignment
    // on a model that already holds the row does not add it again. setData() is that assignment, so
    // its data and its mismatches follow.
    const byAssignment = createSurvey(nestedJson);
    [1, 2].forEach(() => {
      byAssignment.data = JSON.parse(JSON.stringify(nestedData));
      (<any>byAssignment.getQuestionByName("matrix")).allRows;
      (<any>byAssignment.getQuestionByName("panel")).panels;
    });
    const survey = createSurvey(nestedJson);
    const options = { reportExpressionResultMismatches: true };
    expect(survey.setData(nestedData, options).map(issue => issue.path), "the first call")
      .toEqual(["matrix[0].zzz", "matrix[0].c2", "panel[0].q2"]);
    expect(survey.setData(nestedData, options).map(issue => issue.path), "the second call")
      .toEqual(["matrix[0].zzz", "panel[0].q2"]);
    expect(survey.data, "the same data as the setter").toEqual(byAssignment.data);
  });
  test("Initialization finishes before any finding is collected", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "first", choices: ["a", "b"] },
        { type: "matrixdynamic", name: "matrix", columns: [{ name: "c", cellType: "text" }] }
      ]
    };
    // The handler of a later container breaks the answer of an earlier question.
    const breaking = createSurvey(json);
    breaking.onMatrixCellCreated.add(() => { breaking.setValue("first", "z"); });
    expect(shortIssues(breaking.setData({ first: "a", matrix: [{ c: "x" }] })), "the state after initialization is reported").toEqual([
      { type: "invalidChoiceValue", path: "first", value: "z" }
    ]);
    // ... and the other way round: the handler fixes an invalid value.
    const fixing = createSurvey(json);
    fixing.onMatrixCellCreated.add(() => { fixing.setValue("first", "a"); });
    expect(fixing.setData({ first: "z", matrix: [{ c: "x" }] }), "a value fixed during initialization is not reported").toEqual([]);
  });
});

describe("setData: the expressionResultMismatch diagnostic", () => {
  const mismatches = { reportExpressionResultMismatches: true };
  test("A calculated value with includeIntoResult is reported as added", () => {
    const survey = createSurvey({
      calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
      elements: [{ type: "text", name: "q1" }]
    });
    const issues = survey.setData({ q1: "a" }, mismatches);
    expect(shortIssues(issues)).toEqual([
      { type: "expressionResultMismatch", path: "calc", value: undefined }
    ]);
    expect(issues[0].expressionResult, "the model's value").toBe(2);
    expect(issues[0].question, "no question owns a calculated value").toBeUndefined();
  });
  test("A default the model applies inside a dynamic row and a dynamic panel item", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", defaultValue: "cv" }]
        },
        {
          type: "paneldynamic", name: "panel",
          templateElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", defaultValueExpression: "'ex'" }]
        }
      ]
    });
    const issues = survey.setData({ matrix: [{ c1: "a" }], panel: [{ q1: "a" }] }, mismatches);
    expect(shortIssues(issues)).toEqual([
      { type: "expressionResultMismatch", path: "matrix[0].c2", value: undefined },
      { type: "expressionResultMismatch", path: "panel[0].q2", value: undefined }
    ]);
    expect(issues[0].expressionResult).toBe("cv");
    expect(issues[1].expressionResult).toBe("ex");
    expect(issues[0].question, "the root owner, not the cell question").toBe(survey.getQuestionByName("matrix"));
    expect(issues[1].question, "the root owner, not the item question").toBe(survey.getQuestionByName("panel"));
  });
  test("The comparison is strict: \"5\" and 5 are a difference", () => {
    const survey = createSurvey({
      calculatedValues: [{ name: "calc", expression: "1+4", includeIntoResult: true }],
      elements: [{ type: "text", name: "q1" }]
    });
    const issues = survey.setData({ calc: "5" }, mismatches);
    expect(shortIssues(issues)).toEqual([
      { type: "expressionResultMismatch", path: "calc", value: "5" }
    ]);
    expect(issues[0].expressionResult).toBe(5);
  });
  test("A key with surrounding spaces is a dropped key and an added one", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q1" }] });
    const issues = survey.setData({ " q1": "x" }, mismatches);
    expect(shortIssues(issues)).toEqual([
      { type: "expressionResultMismatch", path: " q1", value: "x" },
      { type: "expressionResultMismatch", path: "q1", value: undefined }
    ]);
    expect(issues[0].expressionResult, "the model dropped the key").toBeUndefined();
    expect("expressionResult" in issues[0], "no member for a dropped value").toBe(false);
    expect(issues[1].expressionResult, "and added the trimmed one").toBe("x");
    expect(issues[1].question).toBe(survey.getQuestionByName("q1"));
  });
  test("A value the model keeps as it is, a number text given a string included, is not a difference", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "num", inputType: "number" },
        { type: "boolean", name: "bool" },
        { type: "text", name: "str" }
      ]
    });
    const issues = survey.setData({ num: "5", bool: "true", str: "A" }, mismatches);
    expect(issues.filter(issue => issue.type === "expressionResultMismatch"), "the model stores the input as given").toEqual([]);
    expect(survey.data).toEqual({ num: "5", bool: "true", str: "A" });
  });
  test("A value the question refuses is an invalidValueType and not a mismatch", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "num", inputType: "number" }] });
    expect(shortIssues(survey.setData({ num: "abc" }, mismatches))).toEqual([
      { type: "invalidValueType", path: "num", value: "abc" }
    ]);
  });
  test("An unknown root key the model keeps is an unknownProperty and not a mismatch", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q1" }] });
    expect(shortIssues(survey.setData({ q1: "a", stray: 1 }, mismatches))).toEqual([
      { type: "unknownProperty", path: "stray", value: 1 }
    ]);
  });
  test("The round trip of a model's own output reports nothing", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "matrix", columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", defaultValue: "cv" }] },
        { type: "text", name: "q1", defaultValue: "d1" }
      ]
    };
    const first = createSurvey(json);
    first.data = { matrix: [{ c1: "a" }] };
    (<any>first.getQuestionByName("matrix")).allRows;
    const output = first.data;
    expect(createSurvey(json).setData(output, mismatches)).toEqual([]);
  });
});

describe("setData: validate() is unchanged, clearIncorrectValues() removes what setData() reports", () => {
  const cases: Array<[string, any, any]> = [
    ["number text <- \"abc\"", { type: "text", inputType: "number" }, "abc"],
    ["dropdown <- unknown choice", { type: "dropdown", choices: ["a"] }, "z"],
    ["matrix <- unknown column", matrixJson, { r1: "zz" }],
    ["matrixdynamic <- unknown key", dynamicMatrix, [{ c: "x", zzz: 1 }]],
    ["multipletext <- unknown item", multipleTextJson, { i1: "a", zz: "x" }],
  ];
  test("validate() never reports a data issue", () => {
    cases.forEach(([label, question, value]) => {
      const survey = createQuestionSurvey(question);
      expect(survey.setData({ q: value }).length > 0, label + ": reported by setData()").toBe(true);
      expect(survey.validate(true, false), label + ": validate() passes").toBe(true);
      expect(survey.getQuestionByName("q").errors, label + ": no error is set").toEqual([]);
    });
  });
  test("What setData() reports, clearIncorrectValues(true) removes", () => {
    cases.forEach(([label, question, value]) => {
      const survey = createQuestionSurvey(question);
      survey.setData({ q: value });
      survey.clearIncorrectValues(true);
      expect(survey.setData(survey.data), label + ": nothing left after clearing").toEqual([]);
    });
  });
  test("validate() on a select question still clears an unknown choice, as it always did", () => {
    const survey = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] });
    survey.setData({ q: "z" });
    expect(survey.validate(false, false), "validate(false) passes").toBe(true);
    expect(survey.data, "and has removed the value").toEqual({});
    const kept = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] });
    kept.setData({ q: "z" });
    kept.keepIncorrectValues = true;
    expect(kept.validate(false, false), "with keepIncorrectValues validate(false) passes").toBe(true);
    expect(kept.data, "and keeps the value").toEqual({ q: "z" });
    kept.clearIncorrectValues(true);
    expect(kept.data, "clearIncorrectValues() keeps it too").toEqual({ q: "z" });
    expect(kept.setData(kept.data).length, "setData() still reports it").toBe(1);
  });
});

describe("setData: a shared valueName", () => {
  const sharedJson = {
    elements: [
      { type: "matrix", name: "q1", valueName: "shared", rows: ["r1"], columns: ["a", "b"] },
      { type: "matrix", name: "q2", valueName: "shared", rows: ["r2"], columns: ["b", "c"] }
    ]
  };
  test("A key owned by the sibling is not reported and a key nobody owns is reported once", () => {
    expect(createSurvey(sharedJson).setData({ shared: { r1: "a", r2: "c" } }), "every key is owned").toEqual([]);
    const survey = createSurvey(sharedJson);
    const issues = survey.setData({ shared: { r1: "a", r2: "c", zz: "a" } });
    expect(shortIssues(issues)).toEqual([
      { type: "unknownProperty", path: "shared.zz", value: "a" }
    ]);
    expect(issues[0].question, "the first question in walk order").toBe(survey.getQuestionByName("q1"));
  });
  test("A row of the wrong shape shared by two matrixdropdowns is reported once", () => {
    const survey = createSurvey({
      elements: [
        { type: "matrixdropdown", name: "q1", valueName: "shared", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] },
        { type: "matrixdropdown", name: "q2", valueName: "shared", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] }
      ]
    });
    expect(shortIssues(survey.setData({ shared: { r1: "oops" } }))).toEqual([
      { type: "invalidValueType", path: "shared.r1", value: "oops" }
    ]);
  });
  test("A select question that shares a valueName reports no choice issue", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", valueName: "shared", choices: ["a"] },
        { type: "dropdown", name: "q2", valueName: "shared", choices: ["b"] }
      ]
    });
    expect(survey.setData({ shared: "z" })).toEqual([]);
  });
  test("Two different findings at one location are both kept", () => {
    const survey = createSurvey({
      elements: [{ type: "matrix", name: "q", rows: ["r1"], columns: ["c1"] }]
    });
    expect(shortIssues(survey.setData({ q: { r1: "zz", other: 1 } }))).toEqual([
      { type: "invalidChoiceValue", path: "q.r1", value: "zz" },
      { type: "unknownProperty", path: "q.other", value: 1 }
    ]);
  });
});

describe("setData: boundaries", () => {
  test("A question whose choicesByUrl has not loaded is not reported", () => {
    const survey = createSurvey({
      elements: [{ type: "dropdown", name: "q", choicesByUrl: { url: "https://surveyjs.io/choices" } }]
    });
    expect(survey.setData({ q: "z" }), "the choices are not known yet").toEqual([]);
    // Once the choices are there, the value is checked against them.
    const question: any = survey.getQuestionByName("q");
    question.onLoadChoicesFromUrl([new ItemValue("a"), new ItemValue("b")]);
    // The tests do not send a request, so the state a completed one leaves is set here.
    (<any>question.choicesByUrl).processedUrl = "https://surveyjs.io/choices";
    (<any>question.choicesByUrl).isRunningValue = false;
    expect(shortIssues(survey.setData(survey.data))).toEqual([
      { type: "invalidChoiceValue", path: "q", value: "z" }
    ]);
  });
  // A known boundary of this branch, listed in the setData() comment: promts/misc/nested-walk.md
  // adds the walk into the panels of choice items and replaces this line with the real test.
  test.todo("A numeric question inside the panel of a selected choice item reports \"bad\" as an invalidValueType");
  test("A question that allows custom choices is not reported", () => {
    const survey = createSurvey({
      elements: [{ type: "dropdown", name: "q", choices: ["a"], allowCustomChoices: true }]
    });
    expect(survey.setData({ q: "z" })).toEqual([]);
  });
});

describe("setData: custom and composite questions", () => {
  afterEach(() => {
    ComponentCollection.Instance.clear();
  });
  test("A custom question reports through its content question, at the same location", () => {
    ComponentCollection.Instance.add({
      name: "customdd",
      questionJSON: { type: "dropdown", choices: ["a", "b"] }
    });
    const survey = createSurvey({ elements: [{ type: "customdd", name: "cq" }] });
    const issues = survey.setData({ cq: "z" });
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", path: "cq", value: "z" }
    ]);
    expect(issues[0].question, "the content question holds the value")
      .toBe((<any>survey.getQuestionByName("cq")).contentQuestion);
  });
  test("A cell under the content question is addressed by the wrapper's key", () => {
    ComponentCollection.Instance.add({
      name: "custommatrix",
      questionJSON: { type: "matrixdynamic", columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }
    });
    const survey = createSurvey({ elements: [{ type: "custommatrix", name: "q" }] });
    const issues = survey.setData({ q: [{ c: "z" }] });
    expect(shortIssues(issues), "the wrapper's key, not the content question's internal name").toEqual([
      { type: "invalidChoiceValue", path: "q[0].c", value: "z" }
    ]);
    const content: any = (<any>survey.getQuestionByName("q")).contentQuestion;
    expect(issues[0].question, "the cell under the content question").toBe(content.allRows[0].cells[0].question);
  });
  test("A composite question reports through the questions of its content panel, one segment deeper", () => {
    ComponentCollection.Instance.add({
      name: "compositedd",
      elementsJSON: [{ type: "dropdown", name: "inner", choices: ["a"] }]
    });
    const survey = createSurvey({ elements: [{ type: "compositedd", name: "cq" }] });
    const issues = survey.setData({ cq: { inner: "z", zzz: 1 } });
    // The unknown key of a composite value is not reported: the composite question does not know
    // its keys at HEAD and clearing one would drop the whole value.
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", path: "cq.inner", value: "z" }
    ]);
    expect(issues[0].question, "the inner question")
      .toBe((<any>survey.getQuestionByName("cq")).contentPanel.questions[0]);
  });
});
