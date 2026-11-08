import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModel, PanelModelBase } from "../src/panel";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";

// Nested data 13: the index of data keys per data scope. Every test checks the index through public
// behaviour: a write reaches the right question, an expression resolves.

const addressJson = (extraElements?: Array<any>): any => ({
  elements: [
    { type: "panel", name: "panel1", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city" }
    ] }
  ].concat(extraElements || [])
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("nested data index: upkeep", () => {
  test("a panel's valueName set and cleared at runtime", () => {
    const survey = new SurveyModel(addressJson());
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
    const survey = new SurveyModel({ elements: [
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
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    const street = survey.getQuestionByName("street");
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
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q0" }] });
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
    const survey = new SurveyModel({ pages: [{ name: "page1", elements: [{ type: "text", name: "q0" }] }] });
    const page = new PageModel("page2");
    page.valueName = "pv";
    page.addNewQuestion("text", "x");
    survey.addPage(page);
    const x = survey.getQuestionByName("x");
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
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "outer", valueName: "address", elements: [
        { type: "panel", name: "inner", valueName: "sub", elements: [{ type: "text", name: "q1", showCommentArea: true }] }
      ] }
    ] });
    (<PanelModel>survey.getPanelByName("inner")).valueName = "";
    const reported: Array<string> = [];
    survey.onValueChanged.add((_, options) => reported.push(options.name + ":" + (options.question ? options.question.name : "none")));
    const q1 = survey.getQuestionByName("q1");
    q1.value = "v";
    q1.comment = "cmt";
    expect(survey.data).toEqual({ address: { q1: "v", "q1-Comment": "cmt" } });
    expect(reported).toEqual(["address:q1", "address:q1"]);
  });
  test("a survey loaded again with fromJSON", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    survey.getQuestionByName("street").value = "a";
    survey.fromJSON({ elements: [
      { type: "panel", name: "panel2", valueName: "home", elements: [{ type: "text", name: "street" }] }
    ] });
    const street = survey.getQuestionByName("street");
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
    const q1 = survey.getQuestionByName("q1");
    const street = survey.getQuestionByName("street");
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
    const surveyA = new SurveyModel({ pages: [{ name: "p1", elements: [
      { type: "panel", name: "panel1", valueName: "addr", elements: [{ type: "text", name: "q1" }] }
    ] }] });
    const panel = <PanelModel>surveyA.getPanelByName("panel1");
    surveyA.getQuestionByName("q1").value = "a";
    const q2 = new QuestionTextModel("q2");
    panel.addElement(q2);
    surveyA.pages[0].removeElement(panel);
    const surveyB = new SurveyModel({ pages: [{ name: "p1", elements: [{ type: "text", name: "x" }] }] });
    surveyB.pages[0].addElement(panel);
    surveyB.setValue("addr", { q1: "b", q2: "c" });
    expect(surveyB.getQuestionByName("q1").value).toBe("b");
    expect(q2.value, "a question added before the move").toBe("c");
  });
});

describe("nested data index: shared keys (D4)", () => {
  test("validation order: every container is told before the writer and the questions with errors are validated", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanged", elements: [
      { type: "panel", name: "pA", valueName: "addr", elements: [{ type: "text", name: "a1", isRequired: true }] },
      { type: "panel", name: "pB", valueName: "addr", elements: [
        { type: "text", name: "b1", isRequired: true }, { type: "text", name: "b2", isRequired: true }] }
    ] });
    survey.validate(true);
    const order: Array<string> = [];
    survey.onValidateQuestion.add((_, options) => order.push(options.name));
    survey.getQuestionByName("b1").value = "x";
    expect(order).toEqual(["b1", "a1", "b2"]);
    expect(survey.getQuestionByName("a1").errors).toHaveLength(1);
    expect(survey.getQuestionByName("b1").errors).toHaveLength(0);
    expect(survey.getQuestionByName("b2").errors).toHaveLength(1);
  });
  test("two containers with one key: a write through one updates the other's question", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "a1", valueName: "address", elements: [
        { type: "text", name: "zip1", valueName: "zip" },
        { type: "panel", name: "in1", valueName: "geo", elements: [{ type: "text", name: "lat1", valueName: "lat" }] }
      ] },
      { type: "panel", name: "a2", valueName: "address", elements: [
        { type: "text", name: "zip2", valueName: "zip" },
        { type: "panel", name: "in2", valueName: "geo", elements: [{ type: "text", name: "lat2", valueName: "lat" }] }
      ] }
    ] });
    survey.getQuestionByName("zip1").value = "z";
    expect(survey.getQuestionByName("zip2").value).toBe("z");
    survey.getQuestionByName("lat2").value = 5;
    expect(survey.getQuestionByName("lat1").value, "one level deeper").toBe(5);
    expect(survey.data).toEqual({ address: { zip: "z", geo: { lat: 5 } } });
    expect(survey.runExpression("{Address.Geo.Lat}")).toBe(5);
  });
  test("a container key equal to a question's value name at the root", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "address" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    const address = survey.getQuestionByName("address");
    const street = survey.getQuestionByName("street");
    expect(survey.getQuestionByValueName("address")).toBe(address);
    expect(survey.getQuestionsByValueName("address")).toEqual([address]);
    survey.setValue("address", { street: "x" });
    expect(address.value, "the question gets the write").toEqual({ street: "x" });
    expect(street.value, "the container gets the write").toBe("x");
  });
});

describe("nested data index: performance", () => {
  const nestingJson = (count: number): any => {
    const elements: Array<any> = [];
    for (let i = 0; i < count; i++) {
      elements.push({ type: "panel", name: "panel" + i, valueName: "key" + i, elements: [
        { type: "text", name: "q" + i },
        { type: "panel", name: "inner" + i, elements: [{ type: "text", name: "r" + i }] }
      ] });
    }
    return { elements: elements };
  };
  const countWrites = (count: number): number => {
    const survey = new SurveyModel(nestingJson(count));
    const q = survey.getQuestionByName("q" + (count - 1));
    // The first write after loading builds the index: one walk.
    q.value = "first";
    const spy = vi.spyOn(PanelModelBase.prototype, "getDataScope");
    for (let i = 0; i < 100; i++) {
      q.value = "v" + i;
    }
    const res = spy.mock.calls.length;
    spy.mockRestore();
    expect(survey.getValue("key" + (count - 1))).toEqual({ ["q" + (count - 1)]: "v99" });
    return res;
  };
  test("writes to an inner question walk no panels", () => {
    const calls10 = countWrites(10);
    const calls50 = countWrites(50);
    expect(calls50, "independent of the number of panels").toBe(calls10);
    expect(calls50, "a fixed number per write").toBeLessThanOrEqual(100 * 5);
  });
  test("a survey with no nesting container reads no data scope", () => {
    const elements: Array<any> = [];
    for (let i = 0; i < 50; i++) {
      elements.push({ type: "panel", name: "panel" + i, elements: [{ type: "text", name: "q" + i }] });
    }
    const survey = new SurveyModel({ elements: elements });
    const q = survey.getQuestionByName("q49");
    const spy = vi.spyOn(PanelModelBase.prototype, "getDataScope");
    for (let i = 0; i < 100; i++) {
      q.value = "v" + i;
      survey.setValue("q0", "w" + i);
    }
    expect(spy.mock.calls.length).toBe(0);
    expect(survey.runExpression("{q49}")).toBe("v99");
    expect(spy.mock.calls.length).toBe(0);
  });
});

describe("nested data index: expressions", () => {
  test("letter case is ignored through two levels", () => {
    const survey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "text", name: "out", visibleIf: "{PAGE1.Address.STREET} = 'x'" }
    ] }] });
    const out = survey.getQuestionByName("out");
    expect(out.isVisible).toBe(false);
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ page1: { address: { street: "x" } } });
    expect(out.isVisible).toBe(true);
    expect(survey.runExpression("{page1.address.street}")).toBe("x");
    expect(survey.runExpression("{page1.ADDRESS.Street}")).toBe("x");
    expect(survey.runExpression("{Page1.Address}")).toEqual({ street: "x" });
    const inner = survey.getQuestionByName("street");
    inner.visibleIf = "{ADDRESS.Street} = 'x'";
    expect(inner.isVisible, "inside page1: {address} is a key of its object").toBe(true);
    expect(survey.runExpression("{STREET}"), "an inner question by its name").toBe("x");
  });
});
