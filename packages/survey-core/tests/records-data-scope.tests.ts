import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel, QuestionPanelDynamicItem } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../src/question_matrixdropdownbase";
import { describe, test, expect } from "vitest";

// Records nesting 01: a record item keeps its questions' values through the data-scope class. These tests pin
// today's behaviour through public calls; they pass before and after the change.

const pdOf = (survey: SurveyModel, name: string = "pd"): QuestionPanelDynamicModel => <QuestionPanelDynamicModel>survey.getQuestionByName(name);
const itemOf = (panel: PanelModel): QuestionPanelDynamicItem => <QuestionPanelDynamicItem><any>panel.data;
const inPanel = (panel: PanelModel, name: string): Question => <Question>panel.getQuestionByName(name);
const names = (questions: Array<Question>): Array<string> => questions.map(q => q.name);

describe("records data scope: a dynamic panel's item", () => {
  const createSurvey = (): SurveyModel => new SurveyModel({
    elements: [{ type: "paneldynamic", name: "pd", templateElements: [
      { type: "text", name: "a" },
      { type: "panel", name: "plain", elements: [{ type: "text", name: "b" }] },
      { type: "panel", name: "keyed", valueName: "addr", elements: [{ type: "text", name: "c", valueName: "city" }] }
    ] }]
  });
  test("values reach each panel's questions, written by a panel question, question.value, survey.setValue and survey.data", () => {
    const survey = createSurvey();
    const pd = pdOf(survey);
    // Records nesting 02 lifts N5: the inner panel with valueName keeps its question's value in an object (RN3).
    survey.data = { pd: [{ a: "a1", b: "b1", addr: { city: "c1" } }, { a: "a2" }] };
    expect(pd.panels.length, "#1").toBe(2);
    expect(inPanel(pd.panels[0], "a").value, "#2").toBe("a1");
    expect(inPanel(pd.panels[0], "b").value, "#3: a plain inner panel is keyed flat").toBe("b1");
    expect(inPanel(pd.panels[0], "c").value, "#4: an inner panel with valueName nests (RN3)").toBe("c1");
    expect(inPanel(pd.panels[1], "a").value, "#5").toBe("a2");
    expect(inPanel(pd.panels[1], "b").isEmpty(), "#6").toBe(true);

    inPanel(pd.panels[0], "b").value = "b1x";
    inPanel(pd.panels[1], "c").value = "c2";
    expect(survey.data, "#7: written by a panel question").toEqual({ pd: [{ a: "a1", b: "b1x", addr: { city: "c1" } }, { a: "a2", addr: { city: "c2" } }] });

    pd.value = [{ a: "q1", addr: { city: "qc" } }, { b: "qb" }];
    expect(inPanel(pd.panels[0], "a").value, "#8: question.value").toBe("q1");
    expect(inPanel(pd.panels[0], "b").isEmpty(), "#9").toBe(true);
    expect(inPanel(pd.panels[0], "c").value, "#10").toBe("qc");
    expect(inPanel(pd.panels[1], "b").value, "#11").toBe("qb");

    survey.setValue("pd", [{ a: "s1" }, { a: "s2", b: "sb" }]);
    expect(inPanel(pd.panels[0], "a").value, "#12: survey.setValue").toBe("s1");
    expect(inPanel(pd.panels[0], "c").isEmpty(), "#13").toBe(true);
    expect(inPanel(pd.panels[1], "b").value, "#14").toBe("sb");

    survey.data = { pd: [{ a: "d1", addr: { city: "dc" } }] };
    expect(pd.panels.length, "#15: survey.data").toBe(1);
    expect(inPanel(pd.panels[0], "a").value, "#16").toBe("d1");
    expect(inPanel(pd.panels[0], "c").value, "#17").toBe("dc");
    expect(survey.data, "#18").toEqual({ pd: [{ a: "d1", addr: { city: "dc" } }] });
  });
  test("the item's reads: getValue, getAllValues and the panel's questions", () => {
    const survey = createSurvey();
    const pd = pdOf(survey);
    survey.data = { pd: [{ a: "a1", city: "c1", extra: 5 }] };
    const item = itemOf(pd.panels[0]);
    expect(item.getValue("a"), "#1").toBe("a1");
    expect(item.getValue("city"), "#2").toBe("c1");
    expect(item.getValue("extra"), "#3: a key no question owns").toBe(5);
    expect(item.getValue("c"), "#4: by value name, not by name").toBeUndefined();
    expect(item.getAllValues(), "#5").toEqual({ a: "a1", city: "c1", extra: 5 });
    expect(names(item.questions), "#6: document order, nested panels included").toEqual(["a", "b", "c"]);
  });
});

describe("records data scope: a matrix row", () => {
  const detailJson = {
    detailPanelMode: "underRow",
    detailElements: [
      { type: "text", name: "d1" },
      { type: "panel", name: "dp", elements: [{ type: "text", name: "d2" }] },
      { type: "text", name: "dShared", valueName: "col1" }
    ]
  };
  const createDynamic = (extra?: any): SurveyModel => new SurveyModel({
    elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }] }, detailJson, extra || {})]
  });
  const createDropdown = (): SurveyModel => new SurveyModel({
    elements: [Object.assign({ type: "matrixdropdown", name: "m", rows: ["r1", "r2"],
      columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }] }, detailJson)]
  });
  const kinds: Array<{ name: string, create: () => SurveyModel, data: (rows: Array<any>) => any }> = [
    { name: "matrixdynamic", create: () => createDynamic(), data: (rows: Array<any>) => rows },
    { name: "matrixdropdown", create: createDropdown, data: (rows: Array<any>) => ({ r1: rows[0], r2: rows[1] }) }
  ];
  kinds.forEach(kind => {
    test(kind.name + ": the row value from cells and detail questions", () => {
      const survey = kind.create();
      const matrix = <any>survey.getQuestionByName("m");
      survey.data = { m: kind.data([{ col1: "x1", col2: "y1", d1: "z1", d2: "w1" }, { col2: "y2" }]) };
      const row = <MatrixDropdownRowModelBase>matrix.visibleRows[0];
      expect(row.value, "#1: the cells only, before the detail panel exists").toEqual({ col1: "x1", col2: "y1" });
      expect(row.getAllValues(), "#2: the stored keys under the cells").toEqual({ col1: "x1", col2: "y1", d1: "z1", d2: "w1" });
      expect(row.getValue("d1"), "#3").toBe("z1");
      row.showDetailPanel();
      expect(names(row.questions), "#4: cells, then the detail questions").toEqual(["col1", "col2", "d1", "d2", "dShared"]);
      expect(Object.keys(row.value), "#5: the key order of the row value").toEqual(["col1", "col2", "d1", "d2"]);
      expect(row.value, "#6").toEqual({ col1: "x1", col2: "y1", d1: "z1", d2: "w1" });
      inPanel(row.detailPanel, "d2").value = "w1x";
      expect(survey.data.m, "#7: a detail question writes into the row").toEqual(kind.data([{ col1: "x1", col2: "y1", d1: "z1", d2: "w1x" }, { col2: "y2" }]));
      expect(row.filteredValue, "#8").toEqual({ col1: "x1", col2: "y1", d1: "z1", d2: "w1x" });
    });
    test(kind.name + ": a detail question that shares a cell's value name", () => {
      const survey = kind.create();
      const matrix = <any>survey.getQuestionByName("m");
      survey.data = { m: kind.data([{ col1: "x1" }, {}]) };
      const row = <MatrixDropdownRowModelBase>matrix.visibleRows[0];
      row.showDetailPanel();
      const shared = inPanel(row.detailPanel, "dShared");
      expect(shared.value, "#1: the detail question reads the cell's key").toBe("x1");
      expect(names(row.getQuestionsByValueName("col1")), "#2: the cell first").toEqual(["col1", "dShared"]);
      row.getQuestionByColumnName("col1").value = "x2";
      expect(shared.value, "#3: a cell write updates the detail question").toBe("x2");
      shared.value = "x3";
      expect(row.getQuestionByColumnName("col1").value, "#4: a detail write updates the cell").toBe("x3");
      expect(survey.data.m, "#5").toEqual(kind.data([{ col1: "x3" }, {}]));
      expect(row.value, "#6: the cell gives the key").toEqual({ col1: "x3" });
    });
    test(kind.name + ": a detail panel created after the record is set reads it", () => {
      const survey = kind.create();
      const matrix = <any>survey.getQuestionByName("m");
      survey.data = { m: kind.data([{ col1: "x1", d1: "z1", d2: "w1" }, { d1: "z2" }]) };
      const row = <MatrixDropdownRowModelBase>matrix.visibleRows[0];
      expect(row.detailPanel, "#1").toBeFalsy();
      row.showDetailPanel();
      expect(inPanel(row.detailPanel, "d1").value, "#3").toBe("z1");
      expect(inPanel(row.detailPanel, "d2").value, "#4").toBe("w1");
      expect(inPanel(row.detailPanel, "dShared").value, "#5").toBe("x1");
      expect(survey.data.m, "#6: creating the panel writes nothing").toEqual(kind.data([{ col1: "x1", d1: "z1", d2: "w1" }, { d1: "z2" }]));
      matrix.value = kind.data([{ col1: "n1", d1: "nz" }, {}]);
      const rowAfter = <MatrixDropdownRowModelBase>matrix.visibleRows[0];
      rowAfter.showDetailPanel();
      expect(inPanel(rowAfter.detailPanel, "d1").value, "#7").toBe("nz");
      expect(inPanel(rowAfter.detailPanel, "d2").isEmpty(), "#8").toBe(true);
      expect(inPanel(rowAfter.detailPanel, "dShared").value, "#9").toBe("n1");
    });
  });
  test("the row's loops: defaults, errors, clearValue and hasValueAnyQuestion keep the order cells, then detail questions", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text", isRequired: true }, { name: "c2", cellType: "text", defaultValue: "dc" }],
        detailElements: [{ type: "text", name: "d1", isRequired: true }, { type: "panel", name: "p", elements: [{ type: "text", name: "d2", defaultValue: "dd" }] }] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    expect(row.getNamesWithDefaultValues(), "#1").toEqual(["c2", "d2"]);
    expect(row.hasValueAnyQuestion(), "#2").toBe(true);
    matrix.validate(true);
    expect(row.getAllErrors().map(e => e.errorOwner.name), "#3: cells, then detail questions").toEqual(["c1", "d1"]);
    row.clearErrors();
    expect(row.getAllErrors().length, "#4").toBe(0);
    row.clearValue();
    expect(row.questions.every(q => q.isEmpty()), "#5").toBe(true);
    expect(row.hasValueAnyQuestion(), "#6").toBe(false);
    inPanel(row.detailPanel, "d2").value = "x";
    expect(row.hasValueAnyQuestion(), "#7: a detail question").toBe(true);
    expect(row.hasValueAnyQuestion(true), "#8: visible only").toBe(true);
  });
  test("a comment the question derives from its value is kept while the record has none; a typed one is cleared", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [
        { name: "col1", cellType: "dropdown", choices: [1, 2], showOtherItem: true },
        { name: "col2", cellType: "text" }
      ] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    const cell = row.getQuestionByColumnName("col1");
    row.value = { col1: "custom", col2: "b" };
    expect(cell.value, "#1: an unknown choice is the other item").toBe("other");
    expect(cell.comment, "#2: the record has no comment: the one the question set from its value is kept").toBe("custom");
    expect(row.value, "#3").toEqual({ col1: "other", "col1-Comment": "custom", col2: "b" });
    cell.value = "other";
    cell.comment = "typed";
    expect(survey.data, "#4").toEqual({ m: [{ col1: "other", "col1-Comment": "typed", col2: "b" }] });
    row.value = { col1: "other", col2: "b" };
    expect(cell.value, "#5").toBe("other");
    expect(cell.comment, "#6: the record has no comment: an unchanged comment goes").toBe("");
    row.value = { col1: "other", "col1-Comment": "stored" };
    expect(cell.comment, "#7: the record's comment").toBe("stored");
    expect(row.getQuestionByColumnName("col2").isEmpty(), "#8").toBe(true);
    row.value = { col1: 1 };
    expect(cell.value, "#9").toBe(1);
    expect(cell.comment, "#10").toBe("");
  });
});

describe("records data scope: comments", () => {
  test("a dynamic panel question with showOtherItem", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
        { type: "dropdown", name: "q", choices: [1, 2], showOtherItem: true }
      ] }]
    });
    const pd = pdOf(survey);
    const q = inPanel(pd.panels[0], "q");
    const item = itemOf(pd.panels[0]);
    q.value = "other";
    q.comment = "mine";
    expect(survey.data, "#1").toEqual({ pd: [{ q: "other", "q-Comment": "mine" }] });
    expect(item.getComment("q"), "#2").toBe("mine");
    survey.data = { pd: [{ q: "other", "q-Comment": "loaded" }] };
    const q2 = inPanel(pd.panels[0], "q");
    expect(q2.comment, "#3").toBe("loaded");
    expect(itemOf(pd.panels[0]).getComment("q"), "#4").toBe("loaded");
    q2.comment = "";
    expect(itemOf(pd.panels[0]).getComment("q"), "#5: cleared").toBe("");
    expect(survey.data, "#6").toEqual({ pd: [{ q: "other" }] });
    q2.value = 1;
    expect(survey.data, "#7").toEqual({ pd: [{ q: 1 }] });
  });
  test("a matrix cell and a detail question with showOtherItem", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c", cellType: "dropdown", choices: [1, 2], showOtherItem: true }],
        detailElements: [{ type: "dropdown", name: "d", choices: [1, 2], showOtherItem: true }] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    const cell = row.getQuestionByColumnName("c");
    const detail = inPanel(row.detailPanel, "d");
    cell.value = "other";
    cell.comment = "cellText";
    detail.value = "other";
    detail.comment = "detailText";
    expect(survey.data, "#1").toEqual({ m: [{ c: "other", "c-Comment": "cellText", d: "other", "d-Comment": "detailText" }] });
    expect(row.getComment("c"), "#2").toBe("cellText");
    expect(row.getComment("d"), "#3").toBe("detailText");
    survey.data = { m: [{ c: "other", "c-Comment": "c2", d: "other", "d-Comment": "d2" }] };
    const row2 = matrix.visibleRows[0];
    row2.showDetailPanel();
    expect(row2.getQuestionByColumnName("c").comment, "#4").toBe("c2");
    expect(inPanel(row2.detailPanel, "d").value, "#5").toBe("other");
    expect(row2.getComment("c"), "#6").toBe("c2");
    row2.getQuestionByColumnName("c").comment = "";
    inPanel(row2.detailPanel, "d").comment = "";
    expect(row2.getComment("c"), "#7: cleared: the question's comment").toBeUndefined();
    expect(row2.getComment("d"), "#8: cleared").toBeUndefined();
    expect(survey.data, "#9").toEqual({ m: [{ c: "other", d: "other" }] });
  });
});

describe("records data scope: getQuestionsByValueName and expressions", () => {
  test("a dynamic panel's item: exact and case-insensitive, two questions on one value name", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
        { type: "text", name: "q1", valueName: "Shared" },
        { type: "panel", name: "p", elements: [{ type: "text", name: "q2", valueName: "Shared" }] },
        { type: "text", name: "q3" },
        { type: "expression", name: "e", expression: "{panel.Shared} + '-' + {panel.q3}" }
      ] }]
    });
    const pd = pdOf(survey);
    const item = itemOf(pd.panels[0]);
    expect(names(item.getQuestionsByValueName("Shared")), "#1").toEqual(["q1", "q2"]);
    expect(names(item.getQuestionsByValueName("shared")), "#2: exact").toEqual([]);
    expect(names(item.getQuestionsByValueName("SHARED", true)), "#3: case-insensitive").toEqual(["q1", "q2"]);
    expect(names(item.getQuestionsByValueName("q3", true)), "#4").toEqual(["q3"]);
    expect(names(item.getQuestionsByValueName("none")), "#5").toEqual([]);
    inPanel(pd.panels[0], "q1").value = "v";
    expect(inPanel(pd.panels[0], "q2").value, "#6: both update").toBe("v");
    inPanel(pd.panels[0], "q3").value = "w";
    expect(inPanel(pd.panels[0], "e").value, "#7: {panel.Shared}").toBe("v-w");
    inPanel(pd.panels[0], "q2").value = "u";
    expect(inPanel(pd.panels[0], "q1").value, "#8").toBe("u");
    expect(inPanel(pd.panels[0], "e").value, "#9").toBe("u-w");
    expect(survey.data, "#10").toEqual({ pd: [{ Shared: "u", q3: "w", e: "u-w" }] });
  });
  test("a matrix row: exact and case-insensitive, two questions on one value name, {row.q}", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "Col1", cellType: "text" }, { name: "e", cellType: "expression", expression: "{row.col1} + '-' + {row.D}" }],
        detailElements: [{ type: "text", name: "d", valueName: "D" }, { type: "text", name: "d2", valueName: "Col1" }] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    expect(names(row.getQuestionsByValueName("Col1")), "#1: no detail panel yet").toEqual(["Col1"]);
    row.showDetailPanel();
    expect(names(row.getQuestionsByValueName("Col1")), "#2").toEqual(["Col1", "d2"]);
    expect(names(row.getQuestionsByValueName("col1")), "#3: exact").toEqual([]);
    expect(names(row.getQuestionsByValueName("COL1", true)), "#4: case-insensitive").toEqual(["Col1", "d2"]);
    expect(names(row.getQuestionsByValueName("d", true)), "#5").toEqual(["d"]);
    expect(names(row.getQuestionsByValueName("d")), "#6: by value name").toEqual([]);
    row.getQuestionByColumnName("Col1").value = "a";
    expect(inPanel(row.detailPanel, "d2").value, "#7: both update").toBe("a");
    inPanel(row.detailPanel, "d").value = "b";
    expect(row.getQuestionByColumnName("e").value, "#8: {row.col1} and {row.D}").toBe("a-b");
    inPanel(row.detailPanel, "d2").value = "c";
    expect(row.getQuestionByColumnName("Col1").value, "#9").toBe("c");
    expect(row.getQuestionByColumnName("e").value, "#10").toBe("c-b");
  });
  test("getQuestionsByValueName: prototype names find nothing, the result is a new array", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "text", name: "q1" }] },
        { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c", cellType: "text" }] }]
    });
    const item = itemOf(pdOf(survey).panels[0]);
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    [item, row].forEach((owner: any, i: number) => {
      ["constructor", "toString", "__proto__", ""].forEach(name => {
        expect(owner.getQuestionsByValueName(name), "#" + i + " " + name).toEqual([]);
        expect(owner.getQuestionsByValueName(name, true), "#" + i + " " + name + ", case-insensitive").toEqual([]);
      });
      const missed = owner.getQuestionsByValueName("none");
      missed.push(1);
      expect(owner.getQuestionsByValueName("none"), "#" + i + ": a caller may change the result").toEqual([]);
    });
  });
  test("a matrix dropdown row: getQuestionsByValueName before and after the detail panel", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "m", rows: ["r1"], detailPanelMode: "underRow",
        columns: [{ name: "c", cellType: "text" }],
        detailElements: [{ type: "text", name: "d", valueName: "c" }] }]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    expect(names(row.getQuestionsByValueName("c")), "#1").toEqual(["c"]);
    row.showDetailPanel();
    expect(names(row.getQuestionsByValueName("C", true)), "#2").toEqual(["c", "d"]);
    row.hideDetailPanel(true);
    expect(names(row.getQuestionsByValueName("c")), "#3: the panel is destroyed").toEqual(["c"]);
  });
});

describe("records data scope: rebinding", () => {
  const panelData = [
    { key: 3, q: "other", "q-Comment": "o3", t: "t3" },
    { key: 1, q: 1, t: "t1" },
    { key: 5, q: "other", "q-Comment": "o5" },
    { key: 2, q: 2, t: "t2" },
    { key: 4, q: "other", "q-Comment": "o4", t: "t4" }
  ];
  const recordOf = (key: number): any => panelData.filter(r => r.key === key)[0];
  const expectPanelsMatch = (pd: QuestionPanelDynamicModel, keys: Array<number>, msg: string): void => {
    expect(pd.panels.map(p => inPanel(p, "key").value), msg + ": keys").toEqual(keys);
    pd.panels.forEach((p, i) => {
      const rec = recordOf(keys[i]);
      expect(inPanel(p, "q").value, msg + ": q of " + keys[i]).toEqual(rec.q);
      expect(inPanel(p, "q").comment || "", msg + ": comment of " + keys[i]).toBe(rec["q-Comment"] || "");
      expect(inPanel(p, "t").value, msg + ": t of " + keys[i]).toEqual(rec.t);
      expect(itemOf(p).getComment("q"), msg + ": item comment of " + keys[i]).toBe(rec["q-Comment"] || "");
    });
  };
  const templateElements = [
    { type: "text", name: "key", inputType: "number" },
    { type: "dropdown", name: "q", choices: [1, 2], showOtherItem: true },
    { type: "panel", name: "p", elements: [{ type: "text", name: "t" }] },
    { type: "expression", name: "prev", expression: "{prevPanel.key}" }
  ];
  test("a sorted dynamic panel keeps each object's values and comments", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", templateElements: templateElements, sortCriteria: [{ field: "key", direction: "asc" }] }]
    });
    survey.data = { pd: JSON.parse(JSON.stringify(panelData)) };
    const pd = pdOf(survey);
    expectPanelsMatch(pd, [1, 2, 3, 4, 5], "#1");
    pd.sortCriteria[0].direction = "desc";
    expectPanelsMatch(pd, [5, 4, 3, 2, 1], "#2");
    inPanel(pd.panels[0], "q").comment = "o5x";
    expect(survey.data.pd[2]["q-Comment"], "#4: a rebound panel writes into its record").toBe("o5x");
    expect(inPanel(pd.panels[1], "prev").value, "#5").toBe(5);
  });
  test("a paged dynamic panel keeps each object's values; {prevPanel.q} on the first object of a page reads a record without an object", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", templateElements: templateElements, pageSize: 2 }]
    });
    survey.data = { pd: JSON.parse(JSON.stringify(panelData)) };
    const pd = pdOf(survey);
    expectPanelsMatch(pd, [3, 1], "#1");
    pd.pageIndex = 1;
    expectPanelsMatch(pd, [5, 2], "#2");
    expect(inPanel(pd.panels[0], "prev").value, "#3: {prevPanel.key} of page 2's first object").toBe(1);
    expect(inPanel(pd.panels[1], "prev").value, "#4").toBe(5);
    pd.pageIndex = 2;
    expectPanelsMatch(pd, [4], "#5");
    expect(inPanel(pd.panels[0], "prev").value, "#6").toBe(2);
    pd.pageIndex = 0;
    expectPanelsMatch(pd, [3, 1], "#7");
  });
  const matrixColumns = [
    { name: "key", cellType: "text", inputType: "number" },
    { name: "q", cellType: "dropdown", choices: [1, 2], showOtherItem: true },
    { name: "t", cellType: "text" },
    { name: "prev", cellType: "expression", expression: "{prevRow.key}" }
  ];
  const expectRowsMatch = (matrix: QuestionMatrixDynamicModel, keys: Array<number>, msg: string): void => {
    const rows = matrix.visibleRows;
    expect(rows.map(r => r.getQuestionByColumnName("key").value), msg + ": keys").toEqual(keys);
    rows.forEach((row, i) => {
      const rec = recordOf(keys[i]);
      expect(row.getQuestionByColumnName("q").value, msg + ": q of " + keys[i]).toEqual(rec.q);
      expect(row.getQuestionByColumnName("q").comment || "", msg + ": comment of " + keys[i]).toBe(rec["q-Comment"] || "");
      expect(row.getComment("q") || "", msg + ": row comment of " + keys[i]).toBe(rec["q-Comment"] || "");
      expect(row.getQuestionByColumnName("t").value, msg + ": t of " + keys[i]).toEqual(rec.t);
    });
  };
  // A detail panel makes the matrix rebuild its rows (canRebindOwnItems): these matrices have none.
  test("a sorted and a paged matrix keep each row's values and comments", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, allowSort: true, columns: matrixColumns,
        sortCriteria: [{ field: "key", direction: "asc" }] }]
    });
    survey.data = { m: JSON.parse(JSON.stringify(panelData)) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.renderedTable;
    expectRowsMatch(matrix, [1, 2, 3, 4, 5], "#1");
    const firstRow = matrix.visibleRows[0];
    matrix.sortCriteria[0].direction = "desc";
    expect(matrix.visibleRows.indexOf(firstRow) > -1, "#2a: the rows are rebound, not rebuilt").toBe(true);
    expectRowsMatch(matrix, [5, 4, 3, 2, 1], "#2");
    expect(matrix.visibleRows[1].getQuestionByColumnName("prev").value, "#3").toBe(5);

    const survey2 = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: matrixColumns, pageSize: 2 }]
    });
    survey2.data = { m: JSON.parse(JSON.stringify(panelData)) };
    const matrix2 = <QuestionMatrixDynamicModel>survey2.getQuestionByName("m");
    matrix2.renderedTable;
    expectRowsMatch(matrix2, [3, 1], "#4");
    const pageRow = matrix2.visibleRows[0];
    matrix2.pageIndex = 1;
    expect(matrix2.visibleRows[0], "#4a: the rows are rebound on a page move").toBe(pageRow);
    expectRowsMatch(matrix2, [5, 2], "#5");
    matrix2.visibleRows[0].getQuestionByColumnName("q").comment = "o5x";
    expect(survey2.data.m[2]["q-Comment"], "#5a: a rebound row writes into its record").toBe("o5x");
    matrix2.visibleRows[0].getQuestionByColumnName("q").comment = "o5";
    expect(matrix2.visibleRows[0].getQuestionByColumnName("prev").value, "#6: {prevRow.key} reads a record without a row").toBe(1);
    matrix2.pageIndex = 0;
    expectRowsMatch(matrix2, [3, 1], "#7");
  });
});
