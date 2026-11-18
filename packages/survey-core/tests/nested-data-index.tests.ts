import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { panelNamed } from "./test-helpers";

// The index of data keys per data scope, through public behaviour: after a change, a write reaches the right
// question and an expression resolves.

// panel1 holds no data until it gets a valueName.
const flatAddressJson = (): any => ({
  dataNesting: "auto",
  elements: [
    { type: "panel", name: "panel1", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city" }
    ] }
  ]
});
const names = (list: Array<any>): Array<string> => (list || []).map(el => el.name);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("nested data index: upkeep", () => {
  test("a panel's valueName set and cleared at runtime", () => {
    const survey = new SurveyModel(flatAddressJson());
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const street = survey.getQuestionByName("street");
    expect(survey.getQuestionByValueName("street"), "flat: a top-level question").toBe(street);
    panel.valueName = "address";
    expect(survey.getQuestionByValueName("street"), "nested: not a top-level key (D9)").toBeNull();
    survey.setValue("address", { street: "s1" });
    expect(street.value, "a write of the container key reaches the inner question").toBe("s1");
    expect(survey.runExpression("{address.street}")).toBe("s1");
    street.value = "s2";
    expect(survey.data).toEqual({ address: { street: "s2" } });
    expect(survey.runExpression("{address.street}")).toBe("s2");

    panel.valueName = "";
    expect(survey.getQuestionByValueName("street"), "flat again").toBe(street);
    expect(street.isEmpty(), "reads the top-level key now (D8)").toBe(true);
    survey.setValue("address", { street: "s3" });
    expect(street.isEmpty(), "the old key reaches no question").toBe(true);
    survey.setValue("street", "s4");
    expect(street.value).toBe("s4");
    expect(survey.runExpression("{street}")).toBe("s4");

    panel.valueName = "addr2";
    survey.setValue("addr2", { street: "s5" });
    expect(street.value, "a new key").toBe("s5");
    expect(survey.runExpression("{ADDR2.street}")).toBe("s5");
  });
  test("dataNesting switched \"auto\" -> \"panelAndPage\" -> \"none\"", () => {
    const survey = new SurveyModel({ pages: [{ name: "page1", elements: [
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] },
      { type: "text", name: "q2" }
    ] }] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    survey.setValue("q1", "auto");
    expect(q1.value).toBe("auto");

    survey.dataNesting = "panelAndPage";
    expect(survey.getQuestionByValueName("q1")).toBeNull();
    survey.setValue("page1", { panel1: { q1: "both" }, q2: "both2" });
    expect(q1.value).toBe("both");
    expect(q2.value).toBe("both2");
    expect(survey.runExpression("{page1.panel1.q1}")).toBe("both");
    expect(survey.runExpression("{page1.q2}")).toBe("both2");
    q1.value = "w";
    expect(survey.getValue("page1")).toEqual({ panel1: { q1: "w" }, q2: "both2" });

    survey.dataNesting = "none";
    expect(survey.getQuestionByValueName("q1")).toBe(q1);
    expect(q1.value, "reads the flat key again").toBe("auto");
    survey.setValue("q1", "none");
    expect(q1.value).toBe("none");
    survey.setValue("page1", { panel1: { q1: "x" } });
    expect(q1.value, "the container key reaches nothing").toBe("none");
    expect(survey.runExpression("{q1}")).toBe("none");
  });
  test("a question moved into, out of and between nesting panels", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "qa" }] },
      { type: "panel", name: "pb", valueName: "b", elements: [{ type: "text", name: "qb" }] },
      { type: "text", name: "q" }
    ] });
    const pa = <PanelModel>survey.getPanelByName("pa");
    const pb = <PanelModel>survey.getPanelByName("pb");
    const q = survey.getQuestionByName("q");
    q.moveTo(pa);
    expect(survey.getQuestionByValueName("q"), "inside a: not a top-level key").toBeNull();
    survey.setValue("a", { q: 1 });
    expect(q.value, "into a").toBe(1);
    expect(survey.runExpression("{a.q}")).toBe(1);
    survey.setValue("b", { q: 2 });
    expect(q.value, "b does not reach it").toBe(1);

    q.moveTo(pb);
    expect(q.value, "reads b now (D8)").toBe(2);
    survey.setValue("b", { q: 3 });
    expect(q.value, "between: into b").toBe(3);
    survey.setValue("a", { q: 4 });
    expect(q.value, "a does not reach it").toBe(3);
    expect(survey.runExpression("{b.q}")).toBe(3);
    q.value = 5;
    expect(survey.getValue("b")).toEqual({ q: 5 });

    q.moveTo(survey.pages[0]);
    expect(survey.getQuestionByValueName("q"), "out: a top-level key").toBe(q);
    survey.setValue("q", 6);
    expect(q.value).toBe(6);
    survey.setValue("b", { q: 7 });
    expect(q.value, "b does not reach it").toBe(6);
    expect(survey.runExpression("{q}")).toBe(6);
  });
  test("an inner question renamed: name and valueName", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    const street = survey.getQuestionByName("panel1.street");
    street.name = "street2";
    survey.setValue("address", { street2: "a" });
    expect(street.value, "the new name").toBe("a");
    expect(survey.runExpression("{address.street2}")).toBe("a");
    expect(survey.runExpression("{address.street}"), "the old name is not a key of the object").toBeNull();
    survey.setValue("address", { street: "b" });
    expect(street.isEmpty(), "the old name reaches nothing").toBe(true);

    street.valueName = "st";
    survey.setValue("address", { st: "c" });
    expect(street.value, "the value name").toBe("c");
    expect(survey.runExpression("{address.st}")).toBe("c");
    expect(survey.runExpression("{ADDRESS.ST}")).toBe("c");
    survey.setValue("address", { st: "c", street2: "d" });
    expect(street.value, "the name is no longer the key").toBe("c");

    street.valueName = "";
    survey.setValue("address", { street2: "e" });
    expect(street.value, "the name again").toBe("e");
  });
  test("a nesting panel added and removed at runtime, with a nesting panel inside", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "text", name: "q0" }] });
    const outer = new PanelModel("outer");
    outer.valueName = "o";
    const inner = new PanelModel("inner");
    inner.valueName = "i";
    const t = new QuestionTextModel("t");
    inner.addElement(t);
    outer.addElement(inner);
    survey.pages[0].addElement(outer);
    expect(survey.getQuestionByValueName("t")).toBeNull();
    survey.setValue("o", { i: { t: 1 } });
    expect(t.value, "added").toBe(1);
    expect(survey.runExpression("{o.i.t}")).toBe(1);
    expect(survey.runExpression("{O.I.T}")).toBe(1);
    t.value = 2;
    expect(survey.data).toEqual({ o: { i: { t: 2 } } });

    survey.pages[0].removeElement(outer);
    survey.setValue("o", { i: { t: 3 } });
    expect(t.value, "removed: the key reaches nothing").toBe(2);
    expect(survey.getQuestionByName("t")).toBeNull();

    survey.pages[0].addElement(outer);
    expect(t.value, "re-added: reads the stored object").toBe(3);
    survey.setValue("o", { i: { t: 4 } });
    expect(t.value, "re-added").toBe(4);

    outer.removeElement(inner);
    survey.setValue("o", { i: { t: 5 } });
    expect(t.value, "the inner panel removed").toBe(4);
    survey.pages[0].addElement(inner);
    survey.setValue("i", { t: 6 });
    expect(t.value, "the inner panel at the root").toBe(6);
    expect(survey.runExpression("{i.t}")).toBe(6);
  });
  test("a page with valueName added and removed", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [{ name: "page1", elements: [{ type: "text", name: "q0" }] }] });
    const page = new PageModel("page2");
    page.valueName = "pv";
    page.addNewQuestion("text", "x");
    survey.addPage(page);
    const x = survey.getQuestionByName("page2.x");
    survey.setValue("pv", { x: 1 });
    expect(x.value, "added").toBe(1);
    expect(survey.runExpression("{pv.x}")).toBe(1);
    survey.removePage(page);
    survey.setValue("pv", { x: 2 });
    expect(x.value, "removed").toBe(1);
    expect(survey.getQuestionByName("x")).toBeNull();
    survey.addPage(page);
    expect(x.value, "re-added").toBe(2);
    page.valueName = "";
    survey.setValue("x", 3);
    expect(x.value, "the page no longer nests").toBe(3);
  });
  test("a comment written under an inner panel whose valueName was cleared reports the question (D1)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "outer", valueName: "address", elements: [
        { type: "panel", name: "inner", valueName: "sub", elements: [{ type: "text", name: "q1", showCommentArea: true }] }
      ] }
    ] });
    (<PanelModel>survey.getPanelByName("outer.inner")).valueName = "";
    const reported: Array<string> = [];
    survey.onValueChanged.add((_, options) => reported.push(options.name + ":" + (options.question ? options.question.name : "none")));
    const q1 = survey.getQuestionByName("outer.q1");
    q1.value = "v";
    q1.comment = "cmt";
    expect(survey.data).toEqual({ address: { q1: "v", "q1-Comment": "cmt" } });
    expect(reported).toEqual(["address:q1", "address:q1"]);
  });
  test("a survey loaded again with fromJSON", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    survey.getQuestionByName("panel1.street").value = "a";
    survey.fromJSON({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel2", valueName: "home", elements: [{ type: "text", name: "street" }] }
    ] });
    const street = survey.getQuestionByName("panel2.street");
    survey.setValue("home", { street: "b" });
    expect(street.value).toBe("b");
    expect(survey.runExpression("{home.street}")).toBe("b");
    survey.setValue("address", { street: "c" });
    expect(street.value).toBe("b");
  });
  test("questionsOnPageMode switched to \"singlePage\" and back", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }] },
      { name: "page2", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }
    ] });
    const q1 = survey.getQuestionByName("page1.q1");
    const street = survey.getQuestionByName("page2.panel1.street");
    survey.questionsOnPageMode = "singlePage";
    survey.setValue("page1", { q1: 1 });
    survey.setValue("page2", { address: { street: "s" } });
    expect(q1.value).toBe(1);
    expect(street.value).toBe("s");
    expect(survey.runExpression("{page2.address.street}")).toBe("s");
    survey.questionsOnPageMode = "standard";
    survey.setValue("page2", { address: { street: "t" } });
    expect(street.value).toBe("t");
    expect(survey.runExpression("{page2.address.street}")).toBe("t");
  });
});

describe("nested data index: a panel moved to another survey", () => {
  test("the panel's index is built again in the second survey", () => {
    const surveyA = new SurveyModel({ dataNesting: "auto", pages: [{ name: "p1", elements: [
      { type: "panel", name: "panel1", valueName: "addr", elements: [{ type: "text", name: "q1" }] }
    ] }] });
    const panel = <PanelModel>surveyA.getPanelByName("panel1");
    surveyA.getQuestionByName("panel1.q1").value = "a";
    const q2 = new QuestionTextModel("q2");
    panel.addElement(q2);
    surveyA.pages[0].removeElement(panel);
    const surveyB = new SurveyModel({ dataNesting: "auto", pages: [{ name: "p1", elements: [{ type: "text", name: "x" }] }] });
    surveyB.pages[0].addElement(panel);
    surveyB.setValue("addr", { q1: "b", q2: "c" });
    expect(surveyB.getQuestionByName("panel1.q1").value).toBe("b");
    expect(q2.value, "a question added before the move").toBe("c");
  });
});

// A change below the root: a write still lands in the right object, an expression reads the right question, and
// getQuestionsByValueName answers as before. An add to another container gives the element its new data before
// the old container removes it.
describe("nested data index: questions and containers moved, added, removed and renamed", () => {
  const json = (): any => ({ dataNesting: "auto", elements: [
    { type: "text", name: "top" },
    { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
    { type: "panel", name: "pb", elements: [{ type: "text", name: "q3" }] }] });
  test("questions sharing a value name, one inserted before and one renamed onto it: one value", () => {
    const survey = new SurveyModel(json());
    const pa = panelNamed(survey, "pa");
    survey.getQuestionByName("pa.q2").valueName = "shared";
    // A read by path builds pa's index: the insert before its last question must drop it.
    expect(survey.getQuestionByName("pa.q2").getValueName(), "#0").toBe("shared");
    const q0 = new QuestionTextModel("q0");
    q0.valueName = "shared";
    pa.addElement(q0, 0);
    survey.setValue("a", { shared: "s" });
    expect(q0.value, "#0 the inserted question is a key of the object").toBe("s");
    survey.getQuestionByName("pa.q1").valueName = "shared";
    q0.value = "x";
    expect(survey.getQuestionByName("pa.q2").value, "#1").toBe("x");
    expect(survey.data, "#2").toEqual({ a: { shared: "x" } });
  });
  test("a question removed: a write of the container's object no longer reaches it", () => {
    const survey = new SurveyModel(json());
    const pa = panelNamed(survey, "pa");
    const q2 = survey.getQuestionByName("pa.q2");
    pa.removeElement(q2);
    survey.setValue("a", { q1: 1, q2: 2 });
    expect(q2.value, "#1").toBeUndefined();
    expect(survey.getQuestionByName("pa.q1").value, "#2").toBe(1);
  });
  test("a nesting panel added inside a nesting panel, between its questions", () => {
    const survey = new SurveyModel(json());
    const pa = panelNamed(survey, "pa");
    const inner = new PanelModel("inner");
    inner.valueName = "geo";
    inner.addNewQuestion("text", "lat");
    pa.addElement(inner, 1);
    survey.getQuestionByName("pa.inner.lat").value = 5;
    expect(survey.data, "#1").toEqual({ a: { geo: { lat: 5 } } });
    expect(survey.runExpression("{a.geo.lat}"), "#2").toBe(5);
  });
  test("a panel that holds no data inside one that does, and the other way round", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "outer", valueName: "a", elements: [
        { type: "panel", name: "group", elements: [{ type: "text", name: "q1" }] },
        { type: "text", name: "q2" }] },
      { type: "panel", name: "plain", elements: [
        { type: "panel", name: "inner", valueName: "b", elements: [{ type: "text", name: "q3" }] }] }] });
    panelNamed(survey, "group").valueName = "g";
    survey.getQuestionByName("outer.group.q1").value = 1;
    expect(survey.data, "#1").toEqual({ a: { g: { q1: 1 } } });
    panelNamed(survey, "plain").valueName = "p";
    survey.getQuestionByName("plain.inner.q3").value = 3;
    expect(survey.data, "#2").toEqual({ a: { g: { q1: 1 } }, p: { b: { q3: 3 } } });
    expect(survey.runExpression("{p.b.q3}"), "#3").toBe(3);
  });
  test("a question added to another nesting panel, without removing it first", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { type: "panel", name: "pb", valueName: "b", elements: [{ type: "text", name: "q3" }] },
      { type: "text", name: "top" }] });
    const q1 = survey.getQuestionByName("pa.q1");
    const top = survey.getQuestionByName("top");
    expect(names(survey.getQuestionsByValueName("top")), "#1").toEqual(["top"]);
    panelNamed(survey, "pb").addElement(q1);
    q1.value = 1;
    expect(survey.data, "#2").toEqual({ b: { q1: 1 } });
    expect(survey.runExpression("{b.q1}"), "#3").toBe(1);
    survey.setValue("a", { q1: "old" });
    expect(q1.value, "#4 a write of the object it left does not reach it").toBe(1);
    panelNamed(survey, "pa").addElement(top);
    expect(survey.getQuestionsByValueName("top"), "#5 no longer the root's").toBeNull();
    top.value = "t";
    expect(survey.data, "#6").toEqual({ a: { q1: "old", top: "t" }, b: { q1: 1 } });
    panelNamed(survey, "pb").addElement(top);
    survey.pages[0].addElement(top);
    expect(names(survey.getQuestionsByValueName("top")), "#7 the root's again").toEqual(["top"]);
  });
  test("a question moved between nesting pages with q.page", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { name: "page2", elements: [{ type: "text", name: "q3" }] }] });
    const q1 = survey.getQuestionByName("page1.q1");
    // A read by path builds page2's index: the move must drop it.
    expect(survey.getQuestionByName("page2.q3"), "#0").toBeTruthy();
    q1.page = survey.pages[1];
    survey.setValue("page2", { q1: "b", q3: "c" });
    expect(q1.value, "#1").toBe("b");
    expect(survey.runExpression("{page2.q1}"), "#2").toBe("b");
    survey.setValue("page1", { q1: "a" });
    expect(q1.value, "#3 a write of the page it left does not reach it").toBe("b");
    q1.page = survey.pages[0];
    q1.value = "back";
    expect(survey.data, "#4").toEqual({ page1: { q1: "back" }, page2: { q1: "b", q3: "c" } });
    expect(survey.getQuestionsByValueName("q1"), "#5").toBeNull();
  });
  test("a question in a nesting panel moved to another page with q.page: the root's", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "page1", elements: [{ type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }] },
      { name: "page2", elements: [{ type: "text", name: "q3" }] }] });
    const q1 = survey.getQuestionByName("pa.q1");
    expect(survey.getQuestionsByValueName("q1"), "#1").toBeNull();
    q1.page = survey.pages[1];
    expect(names(survey.getQuestionsByValueName("q1")), "#2").toEqual(["q1"]);
    q1.value = 1;
    expect(survey.data, "#3").toEqual({ q1: 1 });
  });
  test("a panel renamed while it nests by its name", () => {
    const survey = new SurveyModel({ dataNesting: "panel", elements: [
      { type: "panel", name: "outer", elements: [
        { type: "panel", name: "inner", elements: [{ type: "text", name: "q1" }] }, { type: "text", name: "q2" }] }] });
    const q1 = survey.getQuestionByName("outer.inner.q1");
    q1.value = 1;
    expect(survey.data, "#1").toEqual({ outer: { inner: { q1: 1 } } });
    panelNamed(survey, "inner").name = "geo";
    expect(survey.getQuestionByName("outer.geo.q1"), "#2").toBe(q1);
    expect(survey.getQuestionByName("outer.inner.q1"), "#3").toBeNull();
    survey.setValue("outer", { geo: { q1: 2 } });
    expect(q1.value, "#4").toBe(2);
    panelNamed(survey, "outer").name = "box";
    expect(survey.getQuestionByName("box.geo.q1"), "#5").toBe(q1);
    survey.setValue("box", { geo: { q1: 3 } });
    expect(q1.value, "#6").toBe(3);
    q1.value = 4;
    expect(survey.data, "#7").toEqual({ outer: { geo: { q1: 2 } }, box: { geo: { q1: 4 } } });
    expect(survey.getQuestionsByValueName("box"), "#8 a container key").toBeNull();
  });
  test("a question renamed inside a nesting panel, next to a root question of its old name", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { type: "text", name: "q1" }] });
    const q1 = survey.getQuestionByName("pa.q1");
    q1.name = "street";
    expect(survey.getQuestionByName("pa.street"), "#1").toBe(q1);
    expect(survey.getQuestionByName("pa.q1"), "#2").toBeNull();
    survey.setValue("a", { street: "s" });
    expect(q1.value, "#3").toBe("s");
    q1.value = "t";
    expect(survey.data, "#4").toEqual({ a: { street: "t" } });
    expect(survey.getQuestionsByValueName("street"), "#5").toBeNull();
    expect(names(survey.getQuestionsByValueName("q1")), "#6 the root's question").toEqual(["q1"]);
  });
});

describe("nested data index: a record's questions after a change", () => {
  test("a dynamic panel's record: a question added, an inner panel's valueName cleared and set", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
      { type: "text", name: "t1" },
      { type: "panel", name: "inner", valueName: "addr", elements: [{ type: "text", name: "street" }] }] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const panel = dp.panels[0];
    const item: any = panel.data;
    panel.addElement(new QuestionTextModel("t2"));
    panel.getQuestionByName("t2").value = 2;
    panel.getQuestionByName("street").value = "s";
    expect(dp.value, "#1").toEqual([{ t2: 2, addr: { street: "s" } }]);
    const inner = <PanelModel>panel.getElementByName("inner");
    inner.valueName = "";
    expect(names(item.getQuestionsByValueName("street")), "#2").toEqual(["street"]);
    inner.valueName = "home";
    panel.getQuestionByName("street").value = "h";
    expect(dp.value[0].home, "#3").toEqual({ street: "h" });
  });
  test("a matrix's detail panel built, then an inner panel's valueName cleared", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "c1", cellType: "text" }],
      detailElements: [{ type: "text", name: "d1" }, { type: "panel", name: "geo", valueName: "geo", elements: [{ type: "text", name: "lat" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row: any = matrix.visibleRows[0];
    row.showDetailPanel();
    row.detailPanel.getQuestionByName("lat").value = 1;
    expect(matrix.value, "#1").toEqual([{ geo: { lat: 1 } }]);
    (<PanelModel>row.detailPanel.getElementByName("geo")).valueName = "";
    expect(names(row.getQuestionsByValueName("lat")), "#2").toEqual(["lat"]);
  });
  test("a nesting panel taken out of a record's panel and added back, then its page moved", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "page1", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "text", name: "t1" }, { type: "panel", name: "tp", valueName: "addr", elements: [{ type: "text", name: "street" }] }] }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }] });
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0];
    const item: any = panel.data;
    const tp = panel.getElementByName("tp");
    panel.removeElement(tp);
    panel.addElement(tp);
    expect(names(item.getQuestionsByValueName("street")), "#1 added back before its parent is set: it does not nest (as on master)").toEqual(["street"]);
    const page1 = survey.pages[0];
    survey.pages.splice(0, 1);
    survey.pages.push(page1);
    expect(names(item.getQuestionsByValueName("street")), "#2 attached again: it nests").toEqual([]);
    panel.getQuestionByName("street").value = "s";
    expect(survey.data, "#3").toEqual({ dp: [{ addr: { street: "s" } }] });
  });
});

// Probes of the changes a walk on every read saw live: each expectation is the walk's answer.
describe("nested data index: changes with a scope read on the way", () => {
  // A question at the root, and whether the survey itself is its value scope.
  const rootInfo = (survey: SurveyModel, key: string): Array<string> =>
    (survey.getQuestionsByValueName(key) || []).map(q => q.name + (q.getValueScope() === <any>survey ? "@root" : "@other"));
  test("a key cleared in place (panel.fromJSON) on a panel that a page scope held", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }] }] }] });
    // A write of the page's key reads the page's scope.
    survey.setValue("page1", { a: { q1: 1 } });
    survey.dataNesting = "auto";
    panelNamed(survey, "pa").fromJSON({ valueName: "" });
    expect(names(survey.getQuestionsByValueName("q1")), "#1").toEqual(["q1"]);
    survey.setValue("q1", 5);
    expect(survey.getQuestionByName("q1").value, "#2").toBe(5);
  });
  test("a valueName loaded in place (panel.fromJSON) sends no notification: the next write follows it", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] }] });
    survey.setValue("a", { q1: 0 });
    panelNamed(survey, "p1").fromJSON({ valueName: "b" });
    survey.getQuestionByName("p1.q1").value = 1;
    expect(survey.data).toEqual({ a: { q1: 0 }, b: { q1: 1 } });
  });
  test("a page removed with a dynamic panel: no template question at the root, before or after", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "page1", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "panel", name: "tp", valueName: "addr", elements: [{ type: "text", name: "t2", valueName: "shared" }] }] }] },
      { name: "page2", elements: [{ type: "text", name: "q3", valueName: "shared" }] }] });
    expect(names(survey.getQuestionsByValueName("shared")), "#1").toEqual(["q3"]);
    survey.removePage(survey.getPageByName("page1"));
    expect(names(survey.getQuestionsByValueName("shared")), "#2").toEqual(["q3"]);
  });
  test("a dynamic panel dragged in design mode, and pages reordered in design mode: no template question at the root", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1", valueName: "shared" }] },
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }] },
      { type: "text", name: "q3", valueName: "shared" }] });
    survey.setDesignMode(true);
    expect(rootInfo(survey, "shared"), "#1").toEqual(["q3@root"]);
    const dp = survey.getQuestionByName("dp");
    survey.startMovingQuestion();
    dp.parent.removeElement(dp);
    panelNamed(survey, "pa").addElement(dp);
    survey.stopMovingQuestion();
    expect(rootInfo(survey, "shared"), "#2").toEqual(["q3@root"]);
    const paged = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1", valueName: "shared" }] }] },
      { name: "page2", elements: [{ type: "text", name: "q3", valueName: "shared" }] }] });
    paged.setDesignMode(true);
    expect(rootInfo(paged, "shared"), "#3").toEqual([]);
    const first = paged.pages[0];
    paged.pages.splice(0, 1);
    paged.pages.push(first);
    expect(rootInfo(paged, "shared"), "#4").toEqual([]);
  });
  test("a question taken off its page is not the root's, whatever its old scope", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }] });
    const q2 = survey.getQuestionByName("page1.q2");
    expect(survey.getQuestionsByValueName("q2"), "#1").toBeNull();
    q2.page = null;
    expect(survey.getQuestionsByValueName("q2"), "#2").toBeNull();
    survey.dataNesting = "auto";
    expect(survey.getQuestionsByValueName("q2"), "#3 page1 no longer nests").toBeNull();
    expect(names(survey.getQuestionsByValueName("q1")), "#4 its page's question is").toEqual(["q1"]);
  });
  test("setPage with a read of the moved scope while the element is added", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [{ name: "page1", elements: [{ type: "text", name: "q0" }] },
      { name: "page3", elements: [{ type: "panel", name: "p25", elements: [
        { type: "panel", name: "p26", valueName: "a", elements: [{ type: "text", name: "q27" }, { type: "text", name: "q28" }] }] }] }] });
    const page1 = survey.getPageByName("page1");
    const addElement = page1.addElement.bind(page1);
    // A write of the moved container's key reads its scope.
    page1.addElement = (el: any, index?: number): boolean => {
      const res = addElement(el, index);
      survey.setValue("a", { q27: 1, q28: 1 });
      return res;
    };
    panelNamed(survey, "p25").page = page1;
    survey.setValue("a", { q27: 2, q28: 3 });
    expect(survey.getQuestionByName("p26.q27").value, "#1").toBe(2);
  });
});

// A change that sends no notification (a name loaded in place, a shuffle of random order) is followed from the next
// change that does: a removal, a rename or an insert.
describe("nested data index: a change with no notification, followed from the next one", () => {
  test("a question's name loaded in place, then a question removed at the root", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }] });
    const q1 = survey.getQuestionByName("q1");
    expect(names(survey.getQuestionsByValueName("q1")), "#1").toEqual(["q1"]);
    q1.fromJSON({ name: "z" });
    expect(names(survey.getQuestionsByValueName("q1")), "#2 not followed yet").toEqual(["z"]);
    survey.pages[0].removeElement(survey.getQuestionByName("q3"));
    expect(survey.getQuestionsByValueName("q1"), "#3").toBeNull();
    expect(names(survey.getQuestionsByValueName("z")), "#4").toEqual(["z"]);
  });
  test("a question's name loaded in place inside a nesting panel, then another question removed", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { type: "text", name: "top" }] });
    const q1 = survey.getQuestionByName("pa.q1");
    q1.fromJSON({ name: "z" });
    expect(survey.getQuestionByName("pa.z"), "#1 not followed yet").toBeNull();
    panelNamed(survey, "pa").removeElement(survey.getQuestionByName("pa.q2"));
    expect(survey.getQuestionByName("pa.z"), "#2").toBe(q1);
    expect(survey.getQuestionByName("pa.q1"), "#3").toBeNull();
    survey.setValue("a", { z: "v" });
    expect(q1.value, "#4").toBe("v");
  });
  test("random order shuffled on a page's first show, then a question removed: the shown order", () => {
    const elements: Array<any> = [];
    for (let i = 0; i < 8; i++) elements.push({ type: "text", name: "q" + i, valueName: "v" });
    const survey = new SurveyModel({ pages: [
      { name: "page1", elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }] },
      { name: "page2", questionOrder: "random", elements: elements }] });
    survey.setValue("a", 1);
    expect(names(survey.getQuestionsByValueName("v")), "#1 the order loaded").toEqual(["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"]);
    survey.nextPage();
    const shown = names(survey.pages[1].elements);
    expect(names(survey.getQuestionsByValueName("v")), "#2 not followed yet").toEqual(["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"]);
    survey.pages[0].removeElement(survey.getQuestionByName("b"));
    expect(names(survey.getQuestionsByValueName("v")), "#3").toEqual(shown);
  });
});

describe("nested data index: shared keys (D4)", () => {
  test("validation order: every container is told before the writer and the questions with errors are validated", () => {
    const survey = new SurveyModel({ dataNesting: "auto", checkErrorsMode: "onValueChanged", elements: [
      { type: "panel", name: "pA", valueName: "addr", elements: [{ type: "text", name: "a1", isRequired: true }] },
      { type: "panel", name: "pB", valueName: "addr", elements: [
        { type: "text", name: "b1", isRequired: true }, { type: "text", name: "b2", isRequired: true }] }
    ] });
    survey.validate(true);
    const order: Array<string> = [];
    survey.onValidateQuestion.add((_, options) => order.push(options.name));
    survey.getQuestionByName("pB.b1").value = "x";
    expect(order).toEqual(["b1", "a1", "b2"]);
    expect(survey.getQuestionByName("pA.a1").errors).toHaveLength(1);
    expect(survey.getQuestionByName("pB.b1").errors).toHaveLength(0);
    expect(survey.getQuestionByName("pB.b2").errors).toHaveLength(1);
  });
  const sharedKeyJson = (checkErrorsMode?: string): any => ({ dataNesting: "auto", checkErrorsMode: checkErrorsMode, elements: [
    { type: "text", name: "top" },
    { type: "panel", name: "p1", valueName: "address", elements: [
      { type: "text", name: "street", isRequired: true },
      { type: "text", name: "city", isRequired: true }] },
    { type: "panel", name: "p2", valueName: "address", elements: [
      { type: "text", name: "street2", valueName: "street", isRequired: true },
      { type: "text", name: "zip", isRequired: true }] }
  ] });
  const countValidated = (survey: SurveyModel): { [name: string]: number } => {
    const counts: { [name: string]: number } = {};
    survey.getAllQuestions().forEach(q => counts[q.name] = 0);
    survey.onValidateQuestion.add((_, options) => counts[options.name]++);
    return counts;
  };
  test("validation on value changed: a write through containers sharing a key validates each question once", () => {
    const survey = new SurveyModel(sharedKeyJson("onValueChanged"));
    survey.validate();
    const counts = countValidated(survey);
    survey.getQuestionByName("p1.street").value = "a";
    expect(counts, "#1").toEqual({ top: 0, street: 1, city: 1, street2: 1, zip: 1 });
    survey.getQuestionByName("p2.zip").value = "z";
    expect(counts, "#2").toEqual({ top: 0, street: 1, city: 2, street2: 1, zip: 2 });
  });
  test("validation on value changing: a write through containers sharing a key validates each question once", () => {
    const survey = new SurveyModel(sharedKeyJson("onValueChanging"));
    survey.validate();
    const counts = countValidated(survey);
    survey.getQuestionByName("p1.street").value = "a";
    expect(counts).toEqual({ top: 0, street: 1, city: 1, street2: 1, zip: 1 });
  });
  test("validation on next page: a write through containers sharing a key validates only the questions with errors", () => {
    const survey = new SurveyModel(sharedKeyJson());
    survey.getQuestionByName("p1.city").validate();
    const counts = countValidated(survey);
    survey.getQuestionByName("p1.street").value = "a";
    expect(counts, "#1").toEqual({ top: 0, street: 0, city: 1, street2: 0, zip: 0 });
    survey.getQuestionByName("top").value = "t";
    expect(counts, "#2: a top-level write").toEqual({ top: 0, street: 0, city: 1, street2: 0, zip: 0 });
  });
  test("two containers with one key: a write through one updates the other's question", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "a1", valueName: "address", elements: [
        { type: "text", name: "zip1", valueName: "zip" },
        { type: "panel", name: "in1", valueName: "geo", elements: [{ type: "text", name: "lat1", valueName: "lat" }] }
      ] },
      { type: "panel", name: "a2", valueName: "address", elements: [
        { type: "text", name: "zip2", valueName: "zip" },
        { type: "panel", name: "in2", valueName: "geo", elements: [{ type: "text", name: "lat2", valueName: "lat" }] }
      ] }
    ] });
    survey.getQuestionByName("a1.zip1").value = "z";
    expect(survey.getQuestionByName("a2.zip2").value).toBe("z");
    survey.getQuestionByName("a2.in2.lat2").value = 5;
    expect(survey.getQuestionByName("a1.in1.lat1").value, "one level deeper").toBe(5);
    expect(survey.data).toEqual({ address: { zip: "z", geo: { lat: 5 } } });
    expect(survey.runExpression("{Address.Geo.Lat}")).toBe(5);
  });
  test("a container key equal to a question's value name at the root", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "address" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    const address = survey.getQuestionByName("address");
    const street = survey.getQuestionByName("panel1.street");
    expect(survey.getQuestionByValueName("address")).toBe(address);
    expect(survey.getQuestionsByValueName("address")).toEqual([address]);
    survey.setValue("address", { street: "x" });
    expect(address.value, "the question gets the write").toEqual({ street: "x" });
    expect(street.value, "the container gets the write").toBe("x");
  });
});

describe("nested data index: expressions", () => {
  test("letter case is ignored through two levels", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "text", name: "out", visibleIf: "{PAGE1.Address.STREET} = 'x'" }
    ] }] });
    const out = survey.getQuestionByName("page1.out");
    expect(out.isVisible).toBe(false);
    survey.getQuestionByName("page1.panel1.street").value = "x";
    expect(survey.data).toEqual({ page1: { address: { street: "x" } } });
    expect(out.isVisible).toBe(true);
    expect(survey.runExpression("{page1.address.street}")).toBe("x");
    expect(survey.runExpression("{page1.ADDRESS.Street}")).toBe("x");
    expect(survey.runExpression("{Page1.Address}")).toEqual({ street: "x" });
    const inner = survey.getQuestionByName("page1.panel1.street");
    inner.visibleIf = "{ADDRESS.Street} = 'x'";
    expect(inner.isVisible, "inside page1: {address} is a key of its object").toBe(true);
    expect(survey.runExpression("{STREET}"), "an inner question is not found by its name from the root (O3)").toBeNull();
  });
});

describe("the root's keys after an element moves", () => {
  // The page "p1" nests its elements under "obj"; "p2" does not nest.
  const movingJson = (p1Elements: Array<any>, p2Elements: Array<any>): any => ({ dataNesting: "auto", pages: [
    { name: "p1", valueName: "obj", elements: p1Elements },
    { name: "p2", elements: p2Elements }
  ] });
  test("a question moved out of a nesting page is a top-level key", () => {
    const survey = new SurveyModel(movingJson([{ type: "text", name: "q1" }], [{ type: "text", name: "q2" }]));
    const q1 = survey.getQuestionByName("p1.q1");
    q1.value = "a";
    expect(survey.getQuestionByValueName("q1"), "before the move: inside obj (D9)").toBeNull();
    q1.page = survey.pages[1];
    expect(q1.getDataPath()).toEqual(["q1"]);
    expect(survey.getQuestionByValueName("q1")).toBe(q1);
    expect(survey.getQuestionsByValueName("q1")).toEqual([q1]);
    expect(survey.data, "the data does not move (D8)").toEqual({ obj: { q1: "a" } });
    survey.setValue("q1", "b");
    expect(q1.value).toBe("b");
    expect(survey.data).toEqual({ obj: { q1: "a" }, q1: "b" });
  });
  test("a question moved into a nesting page is not a top-level key", () => {
    const survey = new SurveyModel(movingJson([{ type: "text", name: "q1" }], [{ type: "text", name: "q2" }]));
    const q2 = survey.getQuestionByName("q2");
    q2.value = "z";
    expect(survey.getQuestionByValueName("q2"), "before the move: top-level").toBe(q2);
    q2.page = survey.pages[0];
    expect(q2.getDataPath()).toEqual(["obj", "q2"]);
    expect(survey.getQuestionByValueName("q2"), "inside obj (D9)").toBeNull();
    expect(survey.data, "the data does not move (D8)").toEqual({ q2: "z" });
    const valueBefore = q2.value;
    survey.setValue("q2", "zzz");
    expect(q2.value, "a top-level write does not reach it").toBe(valueBefore);
    survey.setValue("obj", { q2: "y" });
    expect(q2.value, "a write of its container reaches it").toBe("y");
  });
  test("a plain panel moved out of a nesting page: its question is a top-level key", () => {
    const survey = new SurveyModel(movingJson(
      [{ type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] }],
      [{ type: "text", name: "q2" }]));
    const panel = <PanelModel>survey.getPanelByName("p1.panel1");
    const q1 = survey.getQuestionByName("p1.q1");
    q1.value = "a";
    panel.page = survey.pages[1];
    expect(q1.getDataPath()).toEqual(["q1"]);
    expect(survey.getQuestionByValueName("q1")).toBe(q1);
    expect(survey.data, "the data does not move (D8)").toEqual({ obj: { q1: "a" } });
    survey.setValue("q1", "b");
    expect(q1.value).toBe("b");
    expect(survey.data).toEqual({ obj: { q1: "a" }, q1: "b" });
  });
  test("a plain panel moved into a nesting page: its question is not a top-level key", () => {
    const survey = new SurveyModel(movingJson(
      [{ type: "text", name: "q1" }],
      [{ type: "panel", name: "panel2", elements: [{ type: "text", name: "q2" }] }]));
    const panel = <PanelModel>survey.getPanelByName("panel2");
    const q2 = survey.getQuestionByName("q2");
    q2.value = "z";
    panel.page = survey.pages[0];
    expect(q2.getDataPath()).toEqual(["obj", "q2"]);
    expect(survey.getQuestionByValueName("q2"), "inside obj (D9)").toBeNull();
    expect(survey.data, "the data does not move (D8)").toEqual({ q2: "z" });
    const valueBefore = q2.value;
    survey.setValue("q2", "zzz");
    expect(q2.value, "a top-level write does not reach it").toBe(valueBefore);
  });
  test("questions sharing a value name: a question moved out is found, one moved in is not", () => {
    const survey = new SurveyModel(movingJson(
      [{ type: "text", name: "q1", valueName: "shared" }],
      [{ type: "text", name: "q2", valueName: "shared" }, { type: "text", name: "q3", valueName: "shared" }]));
    const names = (): Array<string> => (survey.getQuestionsByValueName("shared") || []).map(q => q.name).sort();
    expect(names()).toEqual(["q2", "q3"]);
    survey.getQuestionByName("p1.q1").page = survey.pages[1];
    expect(names()).toEqual(["q1", "q2", "q3"]);
    survey.getQuestionByName("q2").page = survey.pages[0];
    expect(names()).toEqual(["q1", "q3"]);
  });
  test("a nesting panel moved between a nesting page and a plain page", () => {
    const survey = new SurveyModel(movingJson(
      [{ type: "panel", name: "panel1", valueName: "addr", elements: [{ type: "text", name: "street" }] }],
      [{ type: "text", name: "q2" }]));
    const panel = <PanelModel>survey.getPanelByName("p1.panel1");
    const street = survey.getQuestionByName("p1.panel1.street");
    street.value = "a";
    expect(street.getDataPath()).toEqual(["obj", "addr", "street"]);
    expect(survey.getDataKeyIndex().getScopes("addr")).toHaveLength(0);
    panel.page = survey.pages[1];
    expect(street.getDataPath(), "out of the nesting page").toEqual(["addr", "street"]);
    expect(survey.getDataKeyIndex().getScopes("addr"), "a root container").toHaveLength(1);
    expect(survey.getQuestionByValueName("street"), "inside addr (D9)").toBeNull();
    expect(survey.data, "the data does not move (D8)").toEqual({ obj: { addr: { street: "a" } } });
    survey.setValue("addr", { street: "b" });
    expect(street.value).toBe("b");
    panel.page = survey.pages[0];
    expect(street.getDataPath(), "back into the nesting page").toEqual(["obj", "addr", "street"]);
    expect(survey.getDataKeyIndex().getScopes("addr"), "not a root container").toHaveLength(0);
    expect(survey.data, "the data does not move (D8)").toEqual({ obj: { addr: { street: "a" } }, addr: { street: "b" } });
    survey.setValue("addr", { street: "c" });
    expect(street.value, "a top-level write does not reach it").toBe("a");
  });
});
