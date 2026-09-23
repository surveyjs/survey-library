import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { ItemValue } from "../src/itemvalue";
import { ComponentCollection } from "../src/question_custom";
import { IDataIssue } from "../src/base-interfaces";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// The consumer-visible part of an issue. question is asserted separately where it matters.
function shortIssues(issues: Array<IDataIssue>): Array<any> {
  return issues.map(issue => ({ type: issue.type, segments: issue.segments, path: issue.path, value: issue.value }));
}
function createSurvey(json: any, data?: any): SurveyModel {
  const survey = new SurveyModel(json);
  if (data !== undefined) {
    survey.data = JSON.parse(JSON.stringify(data));
  }
  return survey;
}
function createQuestionSurvey(question: any, value: any): SurveyModel {
  return createSurvey({ elements: [{ name: "q", ...question }] }, { q: value });
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

describe("verifyData: the list of issues", () => {
  test("Every value check is reported with its type, its location and the offending value", () => {
    const cases: Array<[string, any, any, Array<any>]> = [
      ["number text <- \"abc\"", { type: "text", inputType: "number" }, "abc",
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: "abc" }]],
      ["boolean <- 'maybe'", { type: "boolean" }, "maybe",
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: "maybe" }]],
      ["radiogroup <- array", { type: "radiogroup", choices: ["a", "b"] }, ["a"],
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: ["a"] }]],
      ["radiogroup <- unknown choice", { type: "radiogroup", choices: ["a", "b"] }, "z",
        [{ type: "invalidChoiceValue", segments: ["q"], path: "q", value: "z" }]],
      ["checkbox <- unknown choices, one issue per item", { type: "checkbox", choices: ["a", "b"] }, ["a", "z", "zz"],
        [{ type: "invalidChoiceValue", segments: ["q", 1], path: "q[1]", value: "z" },
          { type: "invalidChoiceValue", segments: ["q", 2], path: "q[2]", value: "zz" }]],
      ["rating <- out of range", { type: "rating", rateMax: 5 }, 99,
        [{ type: "invalidChoiceValue", segments: ["q"], path: "q", value: 99 }]],
      ["file <- number", { type: "file" }, 5,
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: 5 }]],
      ["matrixdynamic <- string", dynamicMatrix, "oops",
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: "oops" }]],
      ["matrixdynamic <- scalar rows", dynamicMatrix, ["x"],
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: ["x"] }]],
      ["paneldynamic <- scalar panels", dynamicPanel, ["x"],
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: ["x"] }]],
      ["matrix <- unknown column", matrixJson, { r1: "zz" },
        [{ type: "invalidChoiceValue", segments: ["q", "r1"], path: "q.r1", value: "zz" }]],
      ["matrixdropdown <- scalar row", matrixDropdownJson, { r1: "oops" },
        [{ type: "invalidValueType", segments: ["q", "r1"], path: "q.r1", value: "oops" }]],
      ["multipletext <- string", multipleTextJson, "oops",
        [{ type: "invalidValueType", segments: ["q"], path: "q", value: "oops" }]],
      ["matrixdynamic <- unknown key", dynamicMatrix, [{ c: "x", zzz: 1 }],
        [{ type: "unknownProperty", segments: ["q", 0, "zzz"], path: "q[0].zzz", value: 1 }]],
      ["paneldynamic <- unknown key", dynamicPanel, [{ t: "x", zzz: 1 }],
        [{ type: "unknownProperty", segments: ["q", 0, "zzz"], path: "q[0].zzz", value: 1 }]],
      ["matrix <- unknown key", matrixJson, { r1: "c1", zz: "c1" },
        [{ type: "unknownProperty", segments: ["q", "zz"], path: "q.zz", value: "c1" }]],
      ["matrixdropdown <- unknown row", matrixDropdownJson, { r1: { c: 1 }, zz: { c: 2 } },
        [{ type: "unknownProperty", segments: ["q", "zz"], path: "q.zz", value: { c: 2 } }]],
      ["multipletext <- unknown item", multipleTextJson, { i1: "a", zz: "x" },
        [{ type: "unknownProperty", segments: ["q", "zz"], path: "q.zz", value: "x" }]],
    ];
    cases.forEach(([label, question, value, expected]) => {
      const survey = createQuestionSurvey(question, value);
      expect(shortIssues(survey.verifyData()), label).toEqual(expected);
      expect(survey.data, label + ": the data is not modified").toEqual({ q: value });
    });
  });
  test("question is the instance that holds the value", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"] },
        { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }
      ]
    }, { q1: "z", m: [{ c: "z" }] });
    const issues = survey.verifyData();
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", segments: ["q1"], path: "q1", value: "z" },
      { type: "invalidChoiceValue", segments: ["m", 0, "c"], path: "m[0].c", value: "z" }
    ]);
    expect(issues[0].question, "a root question").toBe(survey.getQuestionByName("q1"));
    const matrix: any = survey.getQuestionByName("m");
    expect(issues[1].question, "the cell question").toBe(matrix.allRows[0].cells[0].question);
  });
  test("A correct response gives an empty array on every level", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"] },
        { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }
      ]
    }, { q1: "a", m: [{ c: "x" }] });
    expect(survey.verifyData(), "the survey").toEqual([]);
    expect(survey.pages[0].verifyData(), "the page").toEqual([]);
    expect(survey.getQuestionByName("m").verifyData(), "a question").toEqual([]);
  });
  test("Every call returns a new array", () => {
    const survey = createQuestionSurvey({ type: "text" }, "a");
    const first = survey.verifyData();
    expect(first).toEqual([]);
    expect(survey.verifyData(), "a different instance").not.toBe(first);
  });
});

describe("verifyData: locations", () => {
  test("A nested location is addressed from the survey root", () => {
    const survey = createSurvey({
      elements: [{
        type: "paneldynamic", name: "panel",
        templateElements: [{ type: "matrixdynamic", name: "matrix", columns: [{ name: "col", cellType: "dropdown", choices: ["a"] }] }]
      }]
    }, { panel: [{}, { matrix: [{ col: "z", zzz: 1 }], zzz: 2 }] });
    const issues = survey.verifyData();
    expect(shortIssues(issues)).toEqual([
      { type: "unknownProperty", segments: ["panel", 1, "zzz"], path: "panel[1].zzz", value: 2 },
      { type: "unknownProperty", segments: ["panel", 1, "matrix", 0, "zzz"], path: "panel[1].matrix[0].zzz", value: 1 },
      { type: "invalidChoiceValue", segments: ["panel", 1, "matrix", 0, "col"], path: "panel[1].matrix[0].col", value: "z" }
    ]);
    const panel: any = survey.getQuestionByName("panel");
    const matrix: any = panel.panels[1].getQuestionByName("matrix");
    expect(issues[0].question, "the dynamic panel").toBe(panel);
    expect(issues[1].question, "the nested matrix").toBe(matrix);
    expect(issues[2].question, "the cell question").toBe(matrix.allRows[0].cells[0].question);
  });
  test("A named row of a matrixdropdown inside a panel of a page", () => {
    const survey = createSurvey({
      pages: [{
        elements: [{
          type: "panel", name: "p",
          elements: [{ type: "matrixdropdown", name: "matrix", rows: ["r1"], columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }]
        }]
      }]
    }, { matrix: { r1: { c: "z" } } });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["matrix", "r1", "c"], path: "matrix.r1.c", value: "z" }
    ]);
  });
  test("A detail panel question of a dynamic matrix", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdynamic", name: "matrix", columns: [{ name: "c", cellType: "text" }],
        detailPanelMode: "underRow", detailElements: [{ type: "dropdown", name: "detail", choices: ["a"] }]
      }]
    }, { matrix: [{ c: "x" }, { c: "y", detail: "z" }] });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["matrix", 1, "detail"], path: "matrix[1].detail", value: "z" }
    ]);
  });
  test("A key that contains a dot or a bracket is one segment", () => {
    const survey = createSurvey({
      elements: [{ type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "t" }] }]
    }, { panel: [{ "a[0].b": 1 }], "c.d[2]": 2 });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "unknownProperty", segments: ["c.d[2]"], path: "c.d[2]", value: 2 },
      { type: "unknownProperty", segments: ["panel", 0, "a[0].b"], path: "panel[0].a[0].b", value: 1 }
    ]);
  });
  test("An unknown key inside a row does not hide a malformed row or an unknown row name", () => {
    const survey = createSurvey({
      elements: [{ type: "matrixdropdown", name: "q", rows: ["r1", "r2"], columns: [{ name: "c", cellType: "text" }] }]
    }, { q: { r1: { c: 1, zzz: 2 }, r2: "oops", zz: { c: 3 } } });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "unknownProperty", segments: ["q", "r1", "zzz"], path: "q.r1.zzz", value: 2 },
      { type: "invalidValueType", segments: ["q", "r2"], path: "q.r2", value: "oops" },
      { type: "unknownProperty", segments: ["q", "zz"], path: "q.zz", value: { c: 3 } }
    ]);
  });
  test("A multiple text item and one item of a checkbox value", () => {
    const survey = createSurvey({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "item1", inputType: "number" }] },
        { type: "checkbox", name: "cb", choices: ["a"] }
      ]
    }, { mt: { item1: "abc" }, cb: ["a", "z"] });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidValueType", segments: ["mt", "item1"], path: "mt.item1", value: "abc" },
      { type: "invalidChoiceValue", segments: ["cb", 1], path: "cb[1]", value: "z" }
    ]);
  });
});

describe("verifyData: hidden rows keep their data index", () => {
  test("A dynamic matrix with a hidden row", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdynamic", name: "matrixdyn", rowsVisibleIf: "{row.c} != 'hide'",
        columns: [{ name: "c", cellType: "dropdown", choices: ["a", "hide"] }]
      }]
    }, { matrixdyn: [{ c: "hide" }, { c: "z" }] });
    const matrix: any = survey.getQuestionByName("matrixdyn");
    expect(matrix.visibleRows.length, "the first row is hidden").toBe(1);
    expect(shortIssues(survey.verifyData()), "the data index, not the visible index").toEqual([
      { type: "invalidChoiceValue", segments: ["matrixdyn", 1, "c"], path: "matrixdyn[1].c", value: "z" }
    ]);
  });
  test("A bad value in a hidden row is reported", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdynamic", name: "matrixdyn", rowsVisibleIf: "{row.c} != 'zz'",
        columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }]
      }]
    }, { matrixdyn: [{ c: "zz" }] });
    expect((<any>survey.getQuestionByName("matrixdyn")).visibleRows.length, "no visible row").toBe(0);
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["matrixdyn", 0, "c"], path: "matrixdyn[0].c", value: "zz" }
    ]);
  });
  test("A dropdown matrix with a hidden named row is reported by its row name", () => {
    const survey = createSurvey({
      elements: [{
        type: "matrixdropdown", name: "matrix", rows: ["r1", "r2"], rowsVisibleIf: "{row.c} != 'hide'",
        columns: [{ name: "c", cellType: "dropdown", choices: ["a", "hide"] }]
      }]
    }, { matrix: { r1: { c: "hide" }, r2: { c: "z" } } });
    expect((<any>survey.getQuestionByName("matrix")).visibleRows.length, "r1 is hidden").toBe(1);
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["matrix", "r2", "c"], path: "matrix.r2.c", value: "z" }
    ]);
  });
});

describe("verifyData: root keys", () => {
  const rootJson = {
    calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
    elements: [{ type: "panel", name: "p", elements: [{ type: "text", name: "q1" }] }]
  };
  test("Only a key that no question, comment or calculated value owns is reported", () => {
    const survey = createSurvey(rootJson, { q1: "a", stray: 1, "q1-Comment": "x" });
    const issues = survey.verifyData();
    expect(shortIssues(issues)).toEqual([
      { type: "unknownProperty", segments: ["stray"], path: "stray", value: 1 }
    ]);
    expect(issues[0].question, "no question owns a stray root key").toBeUndefined();
  });
  test("A page and a panel do not report root keys", () => {
    const survey = createSurvey(rootJson, { q1: "a", stray: 1 });
    expect(survey.pages[0].verifyData(), "the page").toEqual([]);
    expect((<PanelModel>survey.getPanelByName("p")).verifyData(), "the panel").toEqual([]);
  });
  test("clearIncorrectValues(true) removes exactly the reported root keys", () => {
    const survey = createSurvey(rootJson, { q1: "a", stray: 1, "q1-Comment": "x" });
    survey.clearIncorrectValues(true);
    expect(survey.data).toEqual({ q1: "a", "q1-Comment": "x", calc: 2 });
    expect(survey.verifyData()).toEqual([]);
  });
});

describe("verifyData: options", () => {
  const json = {
    elements: [
      { type: "dropdown", name: "sel", choices: ["a"] },
      { type: "text", name: "num", inputType: "number" },
      { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }
    ]
  };
  const data = { sel: "z", num: "abc", m: [{ c: "x", zzz: 1 }] };
  test("Without options the three value checks run and no changedValue is reported", () => {
    const survey = createSurvey(json, data);
    const types = survey.verifyData().map(issue => issue.type);
    expect(types.sort()).toEqual(["invalidChoiceValue", "invalidValueType", "unknownProperty"]);
    const withData = createSurvey(json);
    expect(withData.verifyData({ data: data }).some(issue => issue.type === "changedValue"),
      "changedValues is off unless asked for").toBe(false);
  });
  test("A check set to false is not run", () => {
    expect(createSurvey(json, data).verifyData({ unknownProperties: false }).map(i => i.type).sort())
      .toEqual(["invalidChoiceValue", "invalidValueType"]);
    expect(createSurvey(json, data).verifyData({ valueTypes: false }).map(i => i.type).sort())
      .toEqual(["invalidChoiceValue", "unknownProperty"]);
    expect(createSurvey(json, data).verifyData({ choiceValues: false }).map(i => i.type).sort())
      .toEqual(["invalidValueType", "unknownProperty"]);
  });
  test("keepIncorrectValues changes nothing for verifyData() and isValueCorrect(); it governs clearing only", () => {
    const survey = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] }, { q: "z" });
    (<any>survey.getQuestionByName("q")).keepIncorrectValues = true;
    expect(shortIssues(survey.verifyData()), "the question level").toEqual([
      { type: "invalidChoiceValue", segments: ["q"], path: "q", value: "z" }
    ]);
    expect(survey.getQuestionByName("q").isValueCorrect(), "isValueCorrect() reports it").toBe(false);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues() keeps it").toEqual({ q: "z" });
    const surveyLevel = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] }, { q: "z" });
    surveyLevel.keepIncorrectValues = true;
    expect(surveyLevel.verifyData().length, "the survey level").toBe(1);
    surveyLevel.clearIncorrectValues(true);
    expect(surveyLevel.data, "clearIncorrectValues() keeps it on the survey level").toEqual({ q: "z" });
  });
});

describe("verifyData: the state of a question does not matter", () => {
  test("An invisible and a read-only question are checked", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "hidden", choices: ["a"], visible: false },
        { type: "dropdown", name: "byExpression", choices: ["a"], visibleIf: "{hidden} = 'never'" },
        { type: "dropdown", name: "ro", choices: ["a"], readOnly: true }
      ]
    });
    survey.data = { hidden: "z", byExpression: "z", ro: "z" };
    expect(survey.verifyData().map(issue => issue.path)).toEqual(["hidden", "byExpression", "ro"]);
  });
  test("An empty value and a container with an empty value produce nothing", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "t" },
        { type: "checkbox", name: "cb", choices: ["a"] },
        { type: "multipletext", name: "mt", items: [{ name: "i1" }] },
        { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }
      ]
    }, { t: "", cb: [], mt: {}, m: [] });
    expect(survey.verifyData()).toEqual([]);
  });
  test("A Date and a class instance are not reported", () => {
    class CustomValue {
      constructor(public id: number) { }
    }
    const survey = createSurvey({ elements: [{ type: "text", name: "d" }, { type: "text", name: "c" }] });
    survey.getQuestionByName("d").value = new Date(2020, 0, 2);
    survey.getQuestionByName("c").value = new CustomValue(1);
    expect(survey.verifyData()).toEqual([]);
  });
});

describe("verifyData: verification writes nothing itself", () => {
  test("No event fires, no value changes, no error is set on a rendered model", () => {
    const survey = createSurvey({
      pages: [
        { elements: [{ type: "dropdown", name: "q1", choices: ["a"] }] },
        {
          elements: [
            { type: "panel", name: "p", state: "collapsed", elements: [{ type: "text", name: "inPanel" }] },
            { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] },
            { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "t" }] }
          ]
        }
      ]
    }, { q1: "z", m: [{ c: "z" }], dp: [{ t: "x" }] });
    // Render: the rows and the panel items exist before the counting starts.
    (<any>survey.getQuestionByName("m")).allRows;
    (<any>survey.getQuestionByName("dp")).panels;
    const counters: any = { valueChanged: 0, validateQuestion: 0, validatePanel: 0, settingErrors: 0, cellCreated: 0, panelAdded: 0 };
    survey.onValueChanged.add(() => counters.valueChanged++);
    survey.onValidateQuestion.add(() => counters.validateQuestion++);
    survey.onValidatePanel.add(() => counters.validatePanel++);
    survey.onSettingQuestionErrors.add(() => counters.settingErrors++);
    survey.onMatrixCellCreated.add(() => counters.cellCreated++);
    survey.onDynamicPanelAdded.add(() => counters.panelAdded++);
    const dataBefore = JSON.parse(JSON.stringify(survey.data));
    const pageBefore = survey.currentPageNo;
    const issues = survey.verifyData();
    expect(issues.length, "the issues are found").toBe(2);
    Object.keys(counters).forEach(key => expect(counters[key], key).toBe(0));
    expect(survey.data, "the data is untouched").toEqual(dataBefore);
    expect(survey.currentPageNo, "the current page is untouched").toBe(pageBefore);
    expect((<PanelModel>survey.getPanelByName("p")).state, "a collapsed panel stays collapsed").toBe("collapsed");
    issues.forEach(issue => expect(issue.question.errors.length, issue.path + ": no error is set").toBe(0));
  });
});

describe("verifyData: initialization", () => {
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
  test("A model that was never rendered reports the same issues as a rendered one", () => {
    const rendered = createSurvey(nestedJson, nestedData);
    (<any>rendered.getQuestionByName("matrix")).allRows;
    (<any>rendered.getQuestionByName("panel")).panels;
    const renderedIssues = shortIssues(rendered.verifyData());
    const fresh = createSurvey(nestedJson, nestedData);
    expect(shortIssues(fresh.verifyData()), "the same locations").toEqual(renderedIssues);
    expect(renderedIssues).toEqual([
      { type: "unknownProperty", segments: ["matrix", 0, "zzz"], path: "matrix[0].zzz", value: 1 }
    ]);
    expect(fresh.data, "the model has completed its initialization").toEqual(rendered.data);
  });
  test("A second call changes nothing", () => {
    const survey = createSurvey(nestedJson, nestedData);
    const first = shortIssues(survey.verifyData());
    const dataAfterFirst = JSON.parse(JSON.stringify(survey.data));
    expect(shortIssues(survey.verifyData()), "the same issues").toEqual(first);
    expect(survey.data, "the same data").toEqual(dataAfterFirst);
  });
  test("Initialization finishes before any finding is collected", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "first", choices: ["a", "b"] },
        { type: "matrixdynamic", name: "matrix", columns: [{ name: "c", cellType: "text" }] }
      ]
    };
    // The handler of a later container breaks the answer of an earlier question.
    const breaking = createSurvey(json, { first: "a", matrix: [{ c: "x" }] });
    breaking.onMatrixCellCreated.add(() => { breaking.setValue("first", "z"); });
    expect(shortIssues(breaking.verifyData()), "the state after initialization is reported").toEqual([
      { type: "invalidChoiceValue", segments: ["first"], path: "first", value: "z" }
    ]);
    // ... and the other way round: the handler fixes an invalid value.
    const fixing = createSurvey(json, { first: "z", matrix: [{ c: "x" }] });
    fixing.onMatrixCellCreated.add(() => { fixing.setValue("first", "a"); });
    expect(fixing.verifyData(), "a value fixed during initialization is not reported").toEqual([]);
    // The same on the page and the question level.
    const onPage = createSurvey(json, { first: "a", matrix: [{ c: "x" }] });
    onPage.onMatrixCellCreated.add(() => { onPage.setValue("first", "z"); });
    expect(onPage.pages[0].verifyData().map(issue => issue.path), "the page level").toEqual(["first"]);
    const onQuestion = createSurvey(json, { first: "a", matrix: [{ c: "x" }] });
    onQuestion.onMatrixCellCreated.add(() => { onQuestion.setValue("first", "z"); });
    expect(onQuestion.getQuestionByName("matrix").verifyData(), "a question checks its own subtree").toEqual([]);
  });
});

describe("verifyData: the changed-values diagnostic", () => {
  test("A calculated value with includeIntoResult is reported as added", () => {
    const survey = createSurvey({
      calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
      elements: [{ type: "text", name: "q1" }]
    });
    const issues = survey.verifyData({ data: { q1: "a" }, changedValues: true });
    expect(shortIssues(issues)).toEqual([
      { type: "changedValue", segments: ["calc"], path: "calc", value: undefined }
    ]);
    expect(issues[0].newValue, "the model's value").toBe(2);
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
    const issues = survey.verifyData({ data: { matrix: [{ c1: "a" }], panel: [{ q1: "a" }] }, changedValues: true });
    expect(shortIssues(issues)).toEqual([
      { type: "changedValue", segments: ["matrix", 0, "c2"], path: "matrix[0].c2", value: undefined },
      { type: "changedValue", segments: ["panel", 0, "q2"], path: "panel[0].q2", value: undefined }
    ]);
    expect(issues[0].newValue).toBe("cv");
    expect(issues[1].newValue).toBe("ex");
    expect(issues[0].question, "the root owner, not the cell question").toBe(survey.getQuestionByName("matrix"));
    expect(issues[1].question, "the root owner, not the item question").toBe(survey.getQuestionByName("panel"));
  });
  test("The comparison is strict: \"5\" and 5 are a difference", () => {
    const survey = createSurvey({
      calculatedValues: [{ name: "calc", expression: "1+4", includeIntoResult: true }],
      elements: [{ type: "text", name: "q1" }]
    });
    const issues = survey.verifyData({ data: { calc: "5" }, changedValues: true });
    expect(shortIssues(issues)).toEqual([
      { type: "changedValue", segments: ["calc"], path: "calc", value: "5" }
    ]);
    expect(issues[0].newValue).toBe(5);
  });
  test("A key with surrounding spaces is a dropped key and an added one", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q1" }] });
    const issues = survey.verifyData({ data: { " q1": "x" }, changedValues: true });
    expect(shortIssues(issues)).toEqual([
      { type: "changedValue", segments: [" q1"], path: " q1", value: "x" },
      { type: "changedValue", segments: ["q1"], path: "q1", value: undefined }
    ]);
    expect(issues[0].newValue, "the model dropped the key").toBeUndefined();
    expect(issues[1].newValue, "and added the trimmed one").toBe("x");
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
    const issues = survey.verifyData({ data: { num: "5", bool: "true", str: "A" }, changedValues: true });
    expect(issues.filter(issue => issue.type === "changedValue"), "the model stores the input as given").toEqual([]);
    expect(survey.data).toEqual({ num: "5", bool: "true", str: "A" });
  });
  test("A value the question refuses is an invalidValueType and not a changedValue", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "num", inputType: "number" }] });
    expect(shortIssues(survey.verifyData({ data: { num: "abc" }, changedValues: true }))).toEqual([
      { type: "invalidValueType", segments: ["num"], path: "num", value: "abc" }
    ]);
  });
  test("An unknown root key the model keeps is an unknownProperty and not a changedValue", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "q1" }] });
    expect(shortIssues(survey.verifyData({ data: { q1: "a", stray: 1 }, changedValues: true }))).toEqual([
      { type: "unknownProperty", segments: ["stray"], path: "stray", value: 1 }
    ]);
  });
  test("A Date in data reaches the model as its ISO string", () => {
    const survey = createSurvey({ elements: [{ type: "text", name: "d", inputType: "date" }] });
    const issues = survey.verifyData({ data: { d: new Date(Date.UTC(2020, 0, 2)) }, changedValues: true });
    expect(issues, "the ISO string is a value the question can hold").toEqual([]);
    expect(survey.data.d, "a string, never a Date").toBe("2020-01-02T00:00:00.000Z");
  });
  test("The round trip of a model's own output reports nothing", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "matrix", columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", defaultValue: "cv" }] },
        { type: "text", name: "q1", defaultValue: "d1" }
      ]
    };
    const first = createSurvey(json, { matrix: [{ c1: "a" }] });
    (<any>first.getQuestionByName("matrix")).allRows;
    const output = first.data;
    const second = createSurvey(json);
    expect(second.verifyData({ data: output, changedValues: true })).toEqual([]);
  });
  test("The same data twice reports the same list", () => {
    const survey = createSurvey({
      calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
      elements: [{ type: "text", name: "q1" }]
    });
    const options = { data: { q1: "a" }, changedValues: true };
    expect(shortIssues(survey.verifyData(options))).toEqual(shortIssues(survey.verifyData(options)));
  });
  test("changedValues without data, and on a page, a panel and a question, reports nothing", () => {
    const survey = createSurvey({
      calculatedValues: [{ name: "calc", expression: "1+1", includeIntoResult: true }],
      elements: [{ type: "panel", name: "p", elements: [{ type: "text", name: "q1" }] }]
    }, { q1: "a" });
    expect(survey.verifyData({ changedValues: true }), "no data").toEqual([]);
    const options: any = { data: {}, changedValues: true };
    expect(survey.pages[0].verifyData(options), "a page").toEqual([]);
    expect((<PanelModel>survey.getPanelByName("p")).verifyData(options), "a panel").toEqual([]);
    expect(survey.getQuestionByName("q1").verifyData(options), "a question").toEqual([]);
  });
  test("The caller's data object is never modified", () => {
    const survey = createSurvey({
      elements: [{ type: "matrixdynamic", name: "matrix", columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", defaultValue: "cv" }] }]
    });
    const data = { matrix: [{ c1: "a" }] };
    survey.verifyData({ data: data, changedValues: true });
    expect(data, "nested objects included").toEqual({ matrix: [{ c1: "a" }] });
  });
});

describe("verifyData: a direct call on a nested instance", () => {
  const json = {
    elements: [
      {
        type: "matrixdynamic", name: "matrix", columns: [{ name: "col", cellType: "dropdown", choices: ["a"] }],
        detailPanelMode: "underRow", detailElements: [{ type: "dropdown", name: "detail", choices: ["a"] }]
      },
      { type: "paneldynamic", name: "panel", templateElements: [{ type: "dropdown", name: "q", choices: ["a"] }] }
    ]
  };
  const data = { matrix: [{ col: "z", detail: "z" }], panel: [{ q: "a" }, { q: "z" }] };
  function render(survey: SurveyModel): void {
    (<any>survey.getQuestionByName("matrix")).allRows.forEach((row: any) => row.ensureDetailPanel());
    (<any>survey.getQuestionByName("panel")).panels;
  }
  test("A cell question, a detail panel question and a panel item question", () => {
    const survey = createSurvey(json, data);
    render(survey);
    const matrix: any = survey.getQuestionByName("matrix");
    const cell = matrix.allRows[0].cells[0].question;
    expect(shortIssues(cell.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["matrix", 0, "col"], path: "matrix[0].col", value: "z" }
    ]);
    const detail = matrix.allRows[0].detailPanel.questions[0];
    expect(shortIssues(detail.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["matrix", 0, "detail"], path: "matrix[0].detail", value: "z" }
    ]);
    const panel: any = survey.getQuestionByName("panel");
    expect(shortIssues(panel.panels[1].getQuestionByName("q").verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["panel", 1, "q"], path: "panel[1].q", value: "z" }
    ]);
  });
  test("A dynamic panel item reports the issues of that item only", () => {
    const survey = createSurvey(json, data);
    render(survey);
    const panel: any = survey.getQuestionByName("panel");
    expect(shortIssues(panel.panels[0].verifyData()), "the first item is correct").toEqual([]);
    expect(shortIssues(panel.panels[1].verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["panel", 1, "q"], path: "panel[1].q", value: "z" }
    ]);
  });
  test("getParentDataSegments()", () => {
    const survey = createSurvey(json, data);
    render(survey);
    const matrix: any = survey.getQuestionByName("matrix");
    const panel: any = survey.getQuestionByName("panel");
    expect(matrix.allRows[0].cells[0].question.getParentDataSegments(), "a cell question").toEqual(["matrix", 0]);
    expect(matrix.allRows[0].detailPanel.questions[0].getParentDataSegments(), "a detail panel question").toEqual(["matrix", 0]);
    expect(panel.panels[1].getQuestionByName("q").getParentDataSegments(), "a panel item question").toEqual(["panel", 1]);
    expect(panel.panels[1].getParentDataSegments(), "the panel item itself").toEqual(["panel", 1]);
    expect(matrix.getParentDataSegments(), "a root question").toEqual([]);
    expect(survey.pages[0].getParentDataSegments(), "a page").toEqual([]);
  });
  test("A root panel returns no parent segments", () => {
    const survey = createSurvey({ elements: [{ type: "panel", name: "p", elements: [{ type: "text", name: "q1" }] }] });
    expect((<PanelModel>survey.getPanelByName("p")).getParentDataSegments()).toEqual([]);
  });
  test("A detached question is addressed by its own value name", () => {
    const question = new QuestionDropdownModel("q");
    question.choices = ["a", "b"];
    question.value = "z";
    expect(question.getParentDataSegments(), "no parent").toEqual([]);
    expect(shortIssues(question.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["q"], path: "q", value: "z" }
    ]);
  });
});

describe("verifyData: validate() is unchanged, clearIncorrectValues() removes what verifyData() reports", () => {
  const cases: Array<[string, any, any]> = [
    ["number text <- \"abc\"", { type: "text", inputType: "number" }, "abc"],
    ["dropdown <- unknown choice", { type: "dropdown", choices: ["a"] }, "z"],
    ["matrix <- unknown column", matrixJson, { r1: "zz" }],
    ["matrixdynamic <- unknown key", dynamicMatrix, [{ c: "x", zzz: 1 }]],
    ["multipletext <- unknown item", multipleTextJson, { i1: "a", zz: "x" }],
  ];
  test("validate() never reports a data issue", () => {
    cases.forEach(([label, question, value]) => {
      const survey = createQuestionSurvey(question, value);
      expect(survey.verifyData().length > 0, label + ": reported by verifyData()").toBe(true);
      expect(survey.validate(true, false), label + ": validate() passes").toBe(true);
      expect(survey.getQuestionByName("q").errors, label + ": no error is set").toEqual([]);
    });
  });
  test("What verifyData() reports, clearIncorrectValues(true) removes", () => {
    cases.forEach(([label, question, value]) => {
      const survey = createQuestionSurvey(question, value);
      survey.clearIncorrectValues(true);
      expect(survey.verifyData(), label + ": nothing left after clearing").toEqual([]);
    });
  });
  test("validate() on a select question still clears an unknown choice, as it always did", () => {
    const survey = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] }, { q: "z" });
    expect(survey.validate(false, false), "validate(false) passes").toBe(true);
    expect(survey.data, "and has removed the value").toEqual({});
    const kept = createSurvey({ elements: [{ type: "dropdown", name: "q", choices: ["a"] }] }, { q: "z" });
    kept.keepIncorrectValues = true;
    expect(kept.validate(false, false), "with keepIncorrectValues validate(false) passes").toBe(true);
    expect(kept.data, "and keeps the value").toEqual({ q: "z" });
    kept.clearIncorrectValues(true);
    expect(kept.data, "clearIncorrectValues() keeps it too").toEqual({ q: "z" });
    expect(kept.verifyData().length, "verifyData() still reports it").toBe(1);
  });
});

describe("verifyData: a shared valueName", () => {
  const sharedJson = {
    elements: [
      { type: "matrix", name: "q1", valueName: "shared", rows: ["r1"], columns: ["a", "b"] },
      { type: "matrix", name: "q2", valueName: "shared", rows: ["r2"], columns: ["b", "c"] }
    ]
  };
  test("A key owned by the sibling is not reported and a key nobody owns is reported once", () => {
    const known = createSurvey(sharedJson, { shared: { r1: "a", r2: "c" } });
    expect(known.verifyData(), "every key is owned").toEqual([]);
    const survey = createSurvey(sharedJson, { shared: { r1: "a", r2: "c", zz: "a" } });
    const issues = survey.verifyData();
    expect(shortIssues(issues)).toEqual([
      { type: "unknownProperty", segments: ["shared", "zz"], path: "shared.zz", value: "a" }
    ]);
    expect(issues[0].question, "the first question in walk order").toBe(survey.getQuestionByName("q1"));
  });
  test("A row of the wrong shape shared by two matrixdropdowns is reported once", () => {
    const survey = createSurvey({
      elements: [
        { type: "matrixdropdown", name: "q1", valueName: "shared", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] },
        { type: "matrixdropdown", name: "q2", valueName: "shared", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] }
      ]
    }, { shared: { r1: "oops" } });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidValueType", segments: ["shared", "r1"], path: "shared.r1", value: "oops" }
    ]);
  });
  test("A select question that shares a valueName reports no choice issue", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", valueName: "shared", choices: ["a"] },
        { type: "dropdown", name: "q2", valueName: "shared", choices: ["b"] }
      ]
    }, { shared: "z" });
    expect(survey.verifyData()).toEqual([]);
  });
  test("Two different findings at one location are both kept", () => {
    const survey = createSurvey({
      elements: [{ type: "matrix", name: "q", rows: ["r1"], columns: ["c1"] }]
    }, { q: { r1: "zz", other: 1 } });
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["q", "r1"], path: "q.r1", value: "zz" },
      { type: "unknownProperty", segments: ["q", "other"], path: "q.other", value: 1 }
    ]);
  });
});

describe("verifyData: boundaries", () => {
  test("A question whose choicesByUrl has not loaded is not reported", () => {
    const survey = createSurvey({
      elements: [{ type: "dropdown", name: "q", choicesByUrl: { url: "https://surveyjs.io/choices" } }]
    }, { q: "z" });
    expect(survey.verifyData(), "the choices are not known yet").toEqual([]);
    // Once the choices are there, the value is checked against them.
    const question: any = survey.getQuestionByName("q");
    question.onLoadChoicesFromUrl([new ItemValue("a"), new ItemValue("b")]);
    // The tests do not send a request, so the state a completed one leaves is set here.
    (<any>question.choicesByUrl).processedUrl = "https://surveyjs.io/choices";
    (<any>question.choicesByUrl).isRunningValue = false;
    expect(shortIssues(survey.verifyData())).toEqual([
      { type: "invalidChoiceValue", segments: ["q"], path: "q", value: "z" }
    ]);
  });
  // A known boundary of this branch, listed in the verifyData() comment: promts/misc/nested-walk.md
  // adds the walk into the panels of choice items and replaces this line with the real test.
  test.todo("A numeric question inside the panel of a selected choice item reports \"bad\" as an invalidValueType");
  test("A question that allows custom choices is not reported", () => {
    const survey = createSurvey({
      elements: [{ type: "dropdown", name: "q", choices: ["a"], allowCustomChoices: true }]
    }, { q: "z" });
    expect(survey.verifyData()).toEqual([]);
  });
});

describe("verifyData: custom and composite questions", () => {
  afterEach(() => {
    ComponentCollection.Instance.clear();
  });
  test("A custom question reports through its content question, at the same location", () => {
    ComponentCollection.Instance.add({
      name: "customdd",
      questionJSON: { type: "dropdown", choices: ["a", "b"] }
    });
    const survey = createSurvey({ elements: [{ type: "customdd", name: "cq" }] }, { cq: "z" });
    const issues = survey.verifyData();
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", segments: ["cq"], path: "cq", value: "z" }
    ]);
    expect(issues[0].question, "the content question holds the value")
      .toBe((<any>survey.getQuestionByName("cq")).contentQuestion);
  });
  test("A direct call on or under the content question is addressed by the wrapper's key", () => {
    ComponentCollection.Instance.add({
      name: "custommatrix",
      questionJSON: { type: "matrixdynamic", columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }
    });
    const survey = createSurvey({ elements: [{ type: "custommatrix", name: "q" }] }, { q: [{ c: "z" }] });
    const content: any = (<any>survey.getQuestionByName("q")).contentQuestion;
    const expected = [{ type: "invalidChoiceValue", segments: ["q", 0, "c"], path: "q[0].c", value: "z" }];
    expect(shortIssues(survey.verifyData()), "the survey level").toEqual(expected);
    expect(shortIssues(content.verifyData()), "the content question, not its internal name").toEqual(expected);
    const cell = content.allRows[0].cells[0].question;
    expect(shortIssues(cell.verifyData()), "a cell under the content question").toEqual(expected);
    expect(content.getParentDataSegments(), "the content question sits at the wrapper's location").toEqual(["q"]);
    expect(cell.getParentDataSegments()).toEqual(["q", 0]);
  });
  test("A composite question reports through the questions of its content panel, one segment deeper", () => {
    ComponentCollection.Instance.add({
      name: "compositedd",
      elementsJSON: [{ type: "dropdown", name: "inner", choices: ["a"] }]
    });
    const survey = createSurvey({ elements: [{ type: "compositedd", name: "cq" }] }, { cq: { inner: "z", zzz: 1 } });
    const issues = survey.verifyData();
    // The unknown key of a composite value is not reported: the composite question does not know
    // its keys at HEAD and clearing one would drop the whole value.
    expect(shortIssues(issues)).toEqual([
      { type: "invalidChoiceValue", segments: ["cq", "inner"], path: "cq.inner", value: "z" }
    ]);
    expect(issues[0].question, "the inner question")
      .toBe((<any>survey.getQuestionByName("cq")).contentPanel.questions[0]);
  });
});
