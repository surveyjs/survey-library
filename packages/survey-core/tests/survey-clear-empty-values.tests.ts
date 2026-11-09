import { SurveyModel } from "../src/survey";
import { FunctionFactory } from "../src/functionsfactory";
import { describe, expect, test, vi } from "vitest";

describe("survey.clearEmptyValues()", () => {
  test("removes keys with empty values and keeps 0, false and answers", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }, { type: "text", name: "g" }] });
    survey.data = { a: "", b: null, c: {}, d: [], e: 0, f: false, g: "x" };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ e: 0, f: false, g: "x" });
  });
  test("a question that showed an empty string shows no value", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }, { type: "checkbox", name: "b", choices: [1, 2] }] });
    survey.data = { a: "", b: [] };
    survey.clearEmptyValues();
    expect(survey.getQuestionByName("a").value).toBeUndefined();
    expect(survey.getQuestionByName("a").isEmpty()).toBe(true);
    expect(survey.getQuestionByName("b").isEmpty()).toBe(true);
    expect(survey.data).toStrictEqual({});
  });
  test("a key nested in an object is removed, and an object that becomes empty is removed", () => {
    const survey = new SurveyModel();
    survey.data = { obj: { a: "", b: { c: null }, d: 1 }, empty: { a: "", b: { c: [] } } };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ obj: { d: 1 } });
  });
  test("dynamic panel: empty keys inside items go, the panel count stays", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "q" }, { type: "text", name: "r" }] }]
    });
    survey.data = { panel: [{ q: "", r: "x" }, { q: null }] };
    const panel = survey.getQuestionByName("panel");
    expect(panel.panelCount).toBe(2);
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ panel: [{ r: "x" }, {}] });
    expect(panel.panelCount).toBe(2);
    expect(panel.panels[0].getQuestionByName("q").isEmpty()).toBe(true);
    expect(panel.panels[0].getQuestionByName("r").value).toBe("x");
  });
  test("nested dynamic panel: empty keys inside inner items go, both counts stay", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", templateElements: [
          { type: "text", name: "a" },
          { type: "paneldynamic", name: "inner", templateElements: [{ type: "text", name: "b" }] }
        ]
      }]
    });
    survey.data = { outer: [{ a: "", inner: [{ b: "" }, { b: "y" }] }] };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ outer: [{ inner: [{}, { b: "y" }] }] });
    const outer = survey.getQuestionByName("outer");
    expect(outer.panelCount).toBe(1);
    expect(outer.panels[0].getQuestionByName("inner").panelCount).toBe(2);
  });
  test("dynamic matrix: an empty cell goes, the row count stays", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text" }] }]
    });
    survey.data = { m: [{ c1: "", c2: "x" }, { c1: null }] };
    const matrix = survey.getQuestionByName("m");
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ m: [{ c2: "x" }, {}] });
    expect(matrix.rowCount).toBe(2);
    expect(matrix.visibleRows.length).toBe(2);
    expect(matrix.visibleRows[0].getQuestionByColumnName("c1").isEmpty()).toBe(true);
    expect(matrix.visibleRows[0].getQuestionByColumnName("c2").value).toBe("x");
  });
  test("dropdown matrix: an empty cell goes, a row that becomes empty goes", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "m", rows: ["r1", "r2"], columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text" }] }]
    });
    survey.data = { m: { r1: { c1: "", c2: "x" }, r2: { c1: null } } };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ m: { r1: { c2: "x" } } });
    const matrix = survey.getQuestionByName("m");
    expect(matrix.visibleRows.length).toBe(2);
    expect(matrix.visibleRows[0].getQuestionByColumnName("c1").isEmpty()).toBe(true);
    expect(matrix.visibleRows[0].getQuestionByColumnName("c2").value).toBe("x");
  });
  test("matrix detail panel: an empty key in the detail panel goes", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c1", cellType: "text" }],
        detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d1" }, { type: "text", name: "d2" }]
      }]
    });
    survey.data = { m: [{ c1: "x", d1: "", d2: "y" }] };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ m: [{ c1: "x", d2: "y" }] });
  });
  test("comments and keys with a suffix follow the same rule", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choices: [1, 2], showOtherItem: true },
        { type: "dropdown", name: "q2", choices: [1, 2], showCommentArea: true }
      ]
    });
    survey.data = { q1: 1, "q1-Comment": "", "q2-Comment": "note", "q3-Other": "" };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ q1: 1, "q2-Comment": "note" });
    expect(survey.getQuestionByName("q2").comment).toBe("note");
  });
  test("a title that pipes a question's value shows the same text", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }], title: "Name: {a}." });
    survey.data = { a: "" };
    expect(survey.locTitle.renderedHtml).toBe("Name: .");
    survey.clearEmptyValues();
    expect(survey.locTitle.renderedHtml).toBe("Name: .");
  });
  test("variables are not touched", () => {
    const survey = new SurveyModel();
    survey.setVariable("v", "");
    survey.data = { a: "" };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({});
    expect(survey.getVariable("v")).toBe("");
  });
  test("fires no onValueChanging and no onValueChanged for the removed keys, and runs no triggers", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }, { type: "text", name: "c", setValueIf: "{a} empty", setValueExpression: "'set'" }],
      triggers: [{ type: "setvalue", expression: "{a} empty", setToName: "b", setValue: "set" }]
    });
    survey.data = { a: "x" };
    survey.data = { a: "" };
    const changed = vi.fn();
    const changing = vi.fn();
    survey.onValueChanged.add(changed);
    survey.onValueChanging.add(changing);
    survey.clearEmptyValues();
    expect(changed).not.toHaveBeenCalled();
    expect(changing).not.toHaveBeenCalled();
    expect(survey.data).toStrictEqual({});
  });
  test("conditions that read a removed key keep their results", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
        { type: "text", name: "shownIfA", visibleIf: "{a} notempty" },
        { type: "text", name: "shownIfBEmpty", visibleIf: "{b} empty" }
      ]
    });
    survey.data = { a: "x", b: "" };
    expect(survey.getQuestionByName("shownIfA").isVisible).toBe(true);
    expect(survey.getQuestionByName("shownIfBEmpty").isVisible).toBe(true);
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ a: "x" });
    expect(survey.getQuestionByName("shownIfA").isVisible).toBe(true);
    expect(survey.getQuestionByName("shownIfBEmpty").isVisible).toBe(true);
  });
  test("conditions run once after a removal, and an absent key equals an empty string", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "b", visibleIf: "{a} = ''" }]
    });
    survey.data = { a: "" };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    let runCount = 0;
    survey.onExpressionRunning.add(() => { runCount++; });
    survey.clearEmptyValues();
    expect(runCount).toBe(1);
    expect(survey.data).toStrictEqual({});
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
  });
  test("an expression question recalculated by the conditions run stores and reports its new value", () => {
    const survey = new SurveyModel({
      elements: [{ type: "expression", name: "e", expression: "{d} = []" }]
    });
    survey.data = { d: [] };
    expect(survey.data).toStrictEqual({ d: [], e: true });
    const changed: Array<string> = [];
    survey.onValueChanged.add((_, options) => { changed.push(options.name + "=" + options.value); });
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ e: false });
    expect(changed).toStrictEqual(["e=false"]);
  });
  test("called from a function inside a conditions run, it asks for one more run", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "x" },
        { type: "text", name: "b", visibleIf: "{d} = []" },
        { type: "text", name: "c", visibleIf: "clearEmptyValuesForTest() and {x} notempty" }
      ]
    });
    FunctionFactory.Instance.register("clearEmptyValuesForTest", function (this: any) {
      (<SurveyModel>this.survey).clearEmptyValues();
      return true;
    });
    try {
      survey.data = { d: [] };
      survey.setValue("x", "1");
      expect(survey.data).toStrictEqual({ x: "1" });
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
    } finally {
      FunctionFactory.Instance.unregister("clearEmptyValuesForTest");
    }
  });
  test("multiple text, questions sharing a valueName, and a comment inside a panel item", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "i1" }, { name: "i2" }] },
        { type: "text", name: "s1", valueName: "shared" },
        { type: "panel", name: "p", elements: [{ type: "text", name: "s2", valueName: "shared" }] },
        { type: "paneldynamic", name: "panel", templateElements: [{ type: "dropdown", name: "q", choices: [1], showCommentArea: true }] }
      ]
    });
    survey.data = { mt: { i1: "", i2: "x" }, shared: "", panel: [{ q: 1, "q-Comment": "" }, { q: 1, "q-Comment": "note" }] };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ mt: { i2: "x" }, panel: [{ q: 1 }, { q: 1, "q-Comment": "note" }] });
    expect(survey.getQuestionByName("s1").value).toBeUndefined();
    expect(survey.getQuestionByName("s2").value).toBeUndefined();
    const panel = survey.getQuestionByName("panel");
    expect(panel.panels[0].getQuestionByName("q").comment).toBeFalsy();
    expect(panel.panels[1].getQuestionByName("q").comment).toBe("note");
  });
  test("a condition whose result depends on the removed value gets the new result", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q", visibleIf: "{d} = []" }]
    });
    survey.data = { d: [] };
    expect(survey.getQuestionByName("q").isVisible).toBe(true);
    survey.clearEmptyValues();
    expect(survey.getQuestionByName("q").isVisible).toBe(false);
  });
  test("a survey with no empty values changes nothing and runs nothing", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "b", visibleIf: "{a} notempty" },
        { type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "q" }] }]
    });
    const data = { a: "x", e: 0, f: false, panel: [{ q: "y" }, {}] };
    survey.data = data;
    const valueBefore = survey.getValue("panel");
    let runCount = 0;
    survey.onExpressionRunning.add(() => { runCount++; });
    const changed = vi.fn();
    survey.onValueChanged.add(changed);
    survey.clearEmptyValues();
    expect(runCount).toBe(0);
    expect(changed).not.toHaveBeenCalled();
    expect(survey.data).toStrictEqual({ a: "x", e: 0, f: false, panel: [{ q: "y" }, {}] });
    expect(survey.getValue("panel")).toStrictEqual(valueBefore);
  });
  test("the object assigned to survey.data is not modified", () => {
    const survey = new SurveyModel();
    const data = { a: "", obj: { b: "", c: 1 }, list: [{ d: null, e: 2 }] };
    survey.data = data;
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ obj: { c: 1 }, list: [{ e: 2 }] });
    expect(data).toStrictEqual({ a: "", obj: { b: "", c: 1 }, list: [{ d: null, e: 2 }] });
  });
  test("array items that are not objects stay as they are", () => {
    const survey = new SurveyModel();
    survey.data = { list: ["", null, 0, "x"], rows: [{}, null] };
    survey.clearEmptyValues();
    expect(survey.data).toStrictEqual({ list: ["", null, 0, "x"], rows: [{}, null] });
  });
});
