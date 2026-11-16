import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import "../src/question_matrixdynamic";

// Every data scope keeps its own index, kept up on add, remove and rename. After each change: a write lands in the
// right object, an expression reads the right question, and getQuestionsByValueName answers as before.
// By its name wherever it is: in a nesting mode the survey finds an inner panel by its path (scoped names 05, O1).
const panelOf = (survey: SurveyModel, name: string): PanelModel => <PanelModel>survey.getAllPanels(false, true).filter(p => p.name === name)[0];
const names = (list: Array<any>): Array<string> => (list || []).map(el => el.name);
const scopeNames = (survey: SurveyModel, panel: string): Array<string> =>
  names(panelOf(survey, panel).getDataScope().getDataKeyIndex().elements);

describe("a data scope's index: questions added, removed and moved", () => {
  const json = (): any => ({ dataNesting: "auto", elements: [
    { type: "text", name: "top" },
    { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
    { type: "panel", name: "pb", elements: [{ type: "text", name: "q3" }] }] });
  test("a question appended and one inserted before another: document order", () => {
    const survey = new SurveyModel(json());
    const pa = panelOf(survey, "pa");
    expect(scopeNames(survey, "pa"), "#1 read once").toEqual(["q1", "q2"]);
    pa.addElement(new QuestionTextModel("q4"));
    pa.addElement(new QuestionTextModel("q0"), 0);
    expect(scopeNames(survey, "pa"), "#2").toEqual(["q0", "q1", "q2", "q4"]);
    survey.getQuestionByName("pa.q4").value = 4;
    survey.getQuestionByName("pa.q0").value = 0;
    expect(survey.data, "#3").toEqual({ a: { q4: 4, q0: 0 } });
    expect(survey.runExpression("{a.q0} + {a.q4}"), "#4").toBe(4);
    expect(survey.getQuestionsByValueName("q4"), "#5 an inner value name is no key of the survey data").toBeNull();
  });
  test("questions sharing a value name, one inserted before: the first of the key is the first in the document", () => {
    const survey = new SurveyModel(json());
    const pa = panelOf(survey, "pa");
    survey.getQuestionByName("pa.q2").valueName = "shared";
    expect(names(pa.getDataScope().getDataKeyIndex().getQuestions("shared")), "#1").toEqual(["q2"]);
    const q0 = new QuestionTextModel("q0");
    q0.valueName = "shared";
    pa.addElement(q0, 0);
    expect(names(pa.getDataScope().getDataKeyIndex().getQuestions("shared")), "#2").toEqual(["q0", "q2"]);
    survey.getQuestionByName("pa.q1").valueName = "shared";
    expect(names(pa.getDataScope().getDataKeyIndex().getQuestions("shared")), "#3 a rename keeps the document order").toEqual(["q0", "q1", "q2"]);
    q0.value = "x";
    expect(survey.getQuestionByName("pa.q2").value, "#4").toBe("x");
    expect(survey.data, "#5").toEqual({ a: { shared: "x" } });
  });
  test("a question removed: a write of the container's object no longer reaches it", () => {
    const survey = new SurveyModel(json());
    const pa = panelOf(survey, "pa");
    const q2 = survey.getQuestionByName("pa.q2");
    expect(scopeNames(survey, "pa"), "#1").toEqual(["q1", "q2"]);
    pa.removeElement(q2);
    expect(scopeNames(survey, "pa"), "#2").toEqual(["q1"]);
    survey.setValue("a", { q1: 1, q2: 2 });
    expect(q2.value, "#3").toBeUndefined();
    expect(survey.getQuestionByName("pa.q1").value, "#4").toBe(1);
  });
  test("a question moved into a nesting container and out of it", () => {
    const survey = new SurveyModel(json());
    const top = survey.getQuestionByName("top");
    const pa = panelOf(survey, "pa");
    expect(names(survey.getQuestionsByValueName("top")), "#1").toEqual(["top"]);
    expect(scopeNames(survey, "pa"), "#2").toEqual(["q1", "q2"]);
    survey.pages[0].removeElement(top);
    pa.addElement(top, 1);
    expect(scopeNames(survey, "pa"), "#3").toEqual(["q1", "top", "q2"]);
    expect(survey.getQuestionsByValueName("top"), "#4").toBeNull();
    top.value = "in";
    expect(survey.data, "#5").toEqual({ a: { top: "in" } });
    expect(survey.runExpression("{a.top}"), "#6").toBe("in");
    pa.removeElement(top);
    panelOf(survey, "pb").addElement(top);
    expect(scopeNames(survey, "pa"), "#7").toEqual(["q1", "q2"]);
    expect(names(survey.getQuestionsByValueName("top")), "#8").toEqual(["top"]);
    top.value = "out";
    expect(survey.data, "#9").toEqual({ a: { top: "in" }, top: "out" });
  });
  test("a nesting panel added inside a nesting panel, before and after its questions", () => {
    const survey = new SurveyModel(json());
    const pa = panelOf(survey, "pa");
    expect(scopeNames(survey, "pa"), "#1").toEqual(["q1", "q2"]);
    const inner = new PanelModel("inner");
    inner.valueName = "geo";
    inner.addNewQuestion("text", "lat");
    pa.addElement(inner, 1);
    expect(scopeNames(survey, "pa"), "#2").toEqual(["q1", "inner", "q2"]);
    expect(scopeNames(survey, "inner"), "#3").toEqual(["lat"]);
    survey.getQuestionByName("pa.inner.lat").value = 5;
    expect(survey.data, "#4").toEqual({ a: { geo: { lat: 5 } } });
    expect(survey.runExpression("{a.geo.lat}"), "#5").toBe(5);
    pa.removeElement(inner);
    expect(scopeNames(survey, "pa"), "#6").toEqual(["q1", "q2"]);
  });
});

describe("a data scope's index: setPage (the move sends no add or remove notification)", () => {
  test("a question moved to a nesting page, and taken off its page", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { name: "page2", elements: [{ type: "text", name: "q3" }] }] });
    const q1 = survey.getQuestionByName("page1.q1");
    const scope = (page: number): Array<string> => names(survey.pages[page].getDataScope().getDataKeyIndex().elements);
    expect([scope(0), scope(1)], "#1").toEqual([["q1", "q2"], ["q3"]]);
    q1.page = survey.pages[1];
    expect([scope(0), scope(1)], "#2").toEqual([["q2"], ["q3", "q1"]]);
    q1.value = 1;
    expect(survey.data, "#3").toEqual({ page2: { q1: 1 } });
    expect(survey.runExpression("{page2.q1}"), "#4").toBe(1);
    const q2 = survey.getQuestionByName("page1.q2");
    q2.page = null;
    expect(scope(0), "#5 off its page: out of the scope").toEqual([]);
  });
});

describe("a data scope's index: keys", () => {
  test("a question's valueName changed inside a nesting container", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }] });
    const pa = panelOf(survey, "pa");
    expect(names(pa.getDataScope().getDataKeyIndex().getQuestions("q1")), "#1").toEqual(["q1"]);
    survey.getQuestionByName("pa.q1").valueName = "street";
    expect(pa.getDataScope().getDataKeyIndex().getQuestions("q1"), "#2").toEqual([]);
    survey.setValue("a", { street: "s" });
    expect(survey.getQuestionByName("pa.q1").value, "#3").toBe("s");
    expect(survey.runExpression("{a.street}"), "#4").toBe("s");
  });
  test("a container's valueName set, changed and cleared", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "top" },
      { type: "panel", name: "pa", elements: [{ type: "text", name: "q1" }] }] });
    const pa = panelOf(survey, "pa");
    const q1 = survey.getQuestionByName("q1");
    expect(names(survey.getQuestionsByValueName("q1")), "#1").toEqual(["q1"]);
    pa.valueName = "a";
    expect(survey.getQuestionsByValueName("q1"), "#2").toBeNull();
    expect(survey.getDataKeyIndex().getScopes("a"), "#3").toHaveLength(1);
    q1.value = 1;
    expect(survey.data, "#4").toEqual({ a: { q1: 1 } });
    pa.valueName = "b";
    expect(survey.getDataKeyIndex().getScopes("a"), "#5").toHaveLength(0);
    expect(survey.getDataKeyIndex().getScopes("b"), "#6").toHaveLength(1);
    survey.setValue("b", { q1: 2 });
    expect(q1.value, "#7").toBe(2);
    expect(survey.runExpression("{b.q1}"), "#8").toBe(2);
    pa.valueName = "";
    expect(names(survey.getQuestionsByValueName("q1")), "#9").toEqual(["q1"]);
    expect(survey.getDataKeyIndex().getScopes("b"), "#10").toHaveLength(0);
    survey.setValue("q1", 3);
    expect(q1.value, "#11").toBe(3);
  });
  test("dataNesting changed: the scopes follow, and the root's questions keep the order added", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1", valueName: "v" }] },
      { type: "text", name: "q2", valueName: "v" }] });
    expect(names(survey.getQuestionsByValueName("v")), "#1").toEqual(["q2"]);
    survey.dataNesting = "none";
    expect(names(survey.getQuestionsByValueName("v")), "#2 the order added").toEqual(["q1", "q2"]);
    survey.getQuestionByName("q2").value = 1;
    expect(survey.data, "#3").toEqual({ v: 1 });
    expect(survey.getQuestionByName("q1").value, "#4").toBe(1);
    survey.dataNesting = "auto";
    expect(names(survey.getQuestionsByValueName("v")), "#5").toEqual(["q2"]);
    expect(scopeNames(survey, "pa"), "#6").toEqual(["q1"]);
  });
  test("a panel that holds no data inside one that does, and the other way round", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "outer", valueName: "a", elements: [
        { type: "panel", name: "group", elements: [{ type: "text", name: "q1" }] },
        { type: "text", name: "q2" }] },
      { type: "panel", name: "plain", elements: [
        { type: "panel", name: "inner", valueName: "b", elements: [{ type: "text", name: "q3" }] }] }] });
    expect(scopeNames(survey, "outer"), "#1 the group's question belongs to outer").toEqual(["q1", "q2"]);
    expect(names(survey.getDataKeyIndex().getElements("b")), "#2 inner is a root container").toEqual(["inner"]);
    panelOf(survey, "group").valueName = "g";
    expect(scopeNames(survey, "outer"), "#3").toEqual(["group", "q2"]);
    survey.getQuestionByName("outer.group.q1").value = 1;
    expect(survey.data, "#4").toEqual({ a: { g: { q1: 1 } } });
    panelOf(survey, "plain").valueName = "p";
    expect(survey.getDataKeyIndex().getElements("b"), "#5").toEqual([]);
    expect(scopeNames(survey, "plain"), "#6").toEqual(["inner"]);
    survey.getQuestionByName("plain.inner.q3").value = 3;
    expect(survey.data, "#7").toEqual({ a: { g: { q1: 1 } }, p: { b: { q3: 3 } } });
    expect(survey.runExpression("{p.b.q3}"), "#8").toBe(3);
  });
});

describe("a data scope's index inside a record", () => {
  test("a dynamic panel's record: a question added, an inner panel's valueName cleared and set", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
      { type: "text", name: "t1" },
      { type: "panel", name: "inner", valueName: "addr", elements: [{ type: "text", name: "street" }] }] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const panel = dp.panels[0];
    const item: any = panel.data;
    expect(names(item.getDataKeyIndex().elements), "#1").toEqual(["t1", "inner"]);
    panel.addElement(new QuestionTextModel("t2"));
    expect(names(item.getDataKeyIndex().elements), "#2").toEqual(["t1", "inner", "t2"]);
    panel.getQuestionByName("t2").value = 2;
    panel.getQuestionByName("street").value = "s";
    expect(dp.value, "#3").toEqual([{ t2: 2, addr: { street: "s" } }]);
    const inner = <PanelModel>panel.getElementByName("inner");
    inner.valueName = "";
    expect(names(item.getDataKeyIndex().elements), "#4").toEqual(["t1", "street", "t2"]);
    expect(names(item.getQuestionsByValueName("street")), "#5").toEqual(["street"]);
    inner.valueName = "home";
    expect(names(item.getDataKeyIndex().getElements("home")), "#6").toEqual(["inner"]);
    panel.getQuestionByName("street").value = "h";
    expect(dp.value[0].home, "#7").toEqual({ street: "h" });
  });
  test("a dynamic panel's record follows a dataNesting change", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
      { type: "panel", name: "inner", valueName: "addr", elements: [{ type: "text", name: "street" }] }] }] });
    const item: any = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0].data;
    expect(names(item.getDataKeyIndex().elements), "#1").toEqual(["inner"]);
    survey.dataNesting = "none";
    expect(names(item.getDataKeyIndex().elements), "#2").toEqual(["street"]);
    survey.dataNesting = "auto";
    expect(names(item.getDataKeyIndex().elements), "#3").toEqual(["inner"]);
  });
  test("a matrix's detail panel: built, an inner panel's valueName cleared", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "c1", cellType: "text" }],
      detailElements: [{ type: "text", name: "d1" }, { type: "panel", name: "geo", valueName: "geo", elements: [{ type: "text", name: "lat" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row: any = matrix.visibleRows[0];
    expect(names(row.getDataKeyIndex().elements), "#1 the cells, before the detail panel").toEqual(["c1"]);
    row.showDetailPanel();
    expect(names(row.getDataKeyIndex().elements), "#2").toEqual(["c1", "d1", "geo"]);
    row.detailPanel.getQuestionByName("lat").value = 1;
    expect(matrix.value, "#3").toEqual([{ geo: { lat: 1 } }]);
    (<PanelModel>row.detailPanel.getElementByName("geo")).valueName = "";
    expect(names(row.getDataKeyIndex().elements), "#4").toEqual(["c1", "d1", "lat"]);
    expect(names(row.getQuestionsByValueName("lat")), "#5").toEqual(["lat"]);
  });
});

// The review's probes: each expectation is what the start commit (the walk on every read) answers.
describe("a data scope's index: changes the walk saw live", () => {
  const rootInfo = (survey: SurveyModel, key: string): Array<string> =>
    (survey.getQuestionsByValueName(key) || []).map(q => q.name + (q.getValueScope() === <any>survey ? "@root" : "@other"));
  test("a key cleared in place (panel.fromJSON) on a panel that was held by a page scope", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }] }] }] });
    survey.pages[0].getDataScope().getDataKeyIndex();
    survey.dataNesting = "auto";
    expect(names(survey.getDataKeyIndex().getElements("a")), "#1").toEqual(["pa"]);
    panelOf(survey, "pa").fromJSON({ valueName: "" });
    expect(survey.getDataKeyIndex().getElements("a"), "#2").toEqual([]);
    expect(names(survey.getQuestionsByValueName("q1")), "#3").toEqual(["q1"]);
    survey.setValue("q1", 5);
    expect(survey.getQuestionByName("q1").value, "#4").toBe(5);
  });
  test("a nesting panel taken out of a record's panel and added back, then its page moved", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "page1", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "text", name: "t1" }, { type: "panel", name: "tp", valueName: "addr", elements: [{ type: "text", name: "street" }] }] }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }] });
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0];
    const tp = panel.getElementByName("tp");
    panel.removeElement(tp);
    panel.addElement(tp);
    const item: any = panel.data;
    expect(names(item.getDataKeyIndex().elements), "#1 added back before its parent is set: it does not nest (master too)").toEqual(["t1", "street"]);
    const page1 = survey.pages[0];
    survey.pages.splice(0, 1);
    survey.pages.push(page1);
    expect(names(item.getDataKeyIndex().elements), "#2 attached again: it nests").toEqual(["t1", "tp"]);
    panel.getQuestionByName("street").value = "s";
    expect(survey.data, "#3").toEqual({ dp: [{ addr: { street: "s" } }] });
  });
  test("a dynamic panel dragged in design mode, and pages reordered in design mode: the template's questions", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1", valueName: "shared" }] },
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }] },
      { type: "text", name: "q3", valueName: "shared" }] });
    survey.setDesignMode(true);
    expect(rootInfo(survey, "shared"), "#1").toEqual(["t1@root", "q3@root"]);
    const dp = survey.getQuestionByName("dp");
    survey.startMovingQuestion();
    dp.parent.removeElement(dp);
    panelOf(survey, "pa").addElement(dp);
    survey.stopMovingQuestion();
    expect(rootInfo(survey, "shared"), "#2").toEqual(["q3@root"]);
    const paged = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1", valueName: "shared" }] }] },
      { name: "page2", elements: [{ type: "text", name: "q3", valueName: "shared" }] }] });
    paged.setDesignMode(true);
    expect(rootInfo(paged, "shared"), "#3").toEqual(["t1@root"]);
    const first = paged.pages[0];
    paged.pages.splice(0, 1);
    paged.pages.push(first);
    expect(rootInfo(paged, "shared"), "#4").toEqual([]);
  });
  test("a page removed with a dynamic panel: its template's question leaves the root", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "page1", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "panel", name: "tp", valueName: "addr", elements: [{ type: "text", name: "t2", valueName: "shared" }] }] }] },
      { name: "page2", elements: [{ type: "text", name: "q3", valueName: "shared" }] }] });
    expect(names(survey.getQuestionsByValueName("shared")), "#1").toEqual(["t2", "q3"]);
    survey.removePage(survey.getPageByName("page1"));
    expect(names(survey.getQuestionsByValueName("shared")), "#2").toEqual(["q3"]);
  });
  test("setPage with a read of the moved scope while the element is added", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [{ name: "page1", elements: [{ type: "text", name: "q0" }] },
      { name: "page3", elements: [{ type: "panel", name: "p25", elements: [
        { type: "panel", name: "p26", valueName: "a", elements: [{ type: "text", name: "q27" }, { type: "text", name: "q28" }] }] }] }] });
    const scope = (): Array<string> => scopeNames(survey, "p26");
    expect(scope(), "#1").toEqual(["q27", "q28"]);
    const page1 = survey.getPageByName("page1");
    const addElement = page1.addElement.bind(page1);
    page1.addElement = (el: any, index?: number): boolean => {
      const res = addElement(el, index);
      scope();
      return res;
    };
    panelOf(survey, "p25").page = page1;
    expect(scope(), "#2").toEqual(["q27", "q28"]);
    survey.setValue("a", { q27: 2, q28: 3 });
    expect(survey.getQuestionByName("p26.q27").value, "#3").toBe(2);
  });
  test("a question taken off its page keeps its data: the root follows its old scope", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }] });
    const q2 = survey.getQuestionByName("page1.q2");
    expect(survey.getQuestionsByValueName("q2"), "#1").toBeNull();
    q2.page = null;
    expect(survey.getQuestionsByValueName("q2"), "#2 its value scope is still page1").toBeNull();
    survey.dataNesting = "auto";
    expect(names(survey.getQuestionsByValueName("q2")), "#3 page1 no longer nests").toEqual(["q2"]);
  });
});
