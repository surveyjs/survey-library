import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Question } from "../../src/question";
import { QuestionTextModel } from "../../src/question_text";
import { QuestionCheckboxModel } from "../../src/question_checkbox";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMultipleTextModel } from "../../src/question_multipletext";
import { PageModel } from "../../src/page";
import { PanelModel } from "../../src/panel";
import "../../src/question_checkbox";

// The root data scope walks its pages in document order, as every scope below it does: its questions are the
// ones a walk of its pages reaches, in that order. Each row holds in "none" and in "auto", where a container nests
// (nest()).

const modes = ["none", "auto"];
const names = (list: Array<Question>): Array<string> => (list || []).map(q => q.name);
const sharing = (survey: SurveyModel, valueName: string): Array<string> => names(survey.getQuestionsByValueName(valueName));
const first = (survey: SurveyModel, valueName: string): string => survey.getQuestionByValueName(valueName)?.name || null;
// A panel that nests in "auto": the survey has used a data scope there.
const nest = (): any => ({ type: "panel", name: "nest", valueName: "obj", elements: [{ type: "text", name: "inside" }] });

// A write of the key: the question onValueChanging reports, the order the questions on the key take the value in,
// and the question validated first (checkErrorsMode "onValueChanging").
const write = (survey: SurveyModel, valueName: string): { changing: string, notified: Array<string>, validated: string } => {
  const notified: Array<string> = [];
  const validated: Array<string> = [];
  survey.getAllQuestions().forEach((q: Question) => q.registerFunctionOnPropertyValueChanged("value", () => notified.push(q.name), "write"));
  survey.onValidateQuestion.add((_, options) => { validated.push(options.name); });
  let changing: string = null;
  survey.onValueChanging.add((_, options) => { changing = options.question?.name || null; });
  survey.setValue(valueName, "x");
  return { changing: changing, notified: notified, validated: validated[0] || null };
};

describe("the root keeps document order", () => {
  test.each(modes)("a question inserted before another that shares its value name (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, checkErrorsMode: "onValueChanging", elements: [{ type: "text", name: "q1", valueName: "v" }, nest()] });
    expect(survey.isDataScopeUsed(), "a container nests in \"auto\" only").toBe(mode === "auto");
    expect(sharing(survey, "v")).toEqual(["q1"]);
    const q0 = new QuestionTextModel("q0");
    q0.valueName = "v";
    survey.pages[0].addElement(q0, 0);
    expect(sharing(survey, "v")).toEqual(["q0", "q1"]);
    expect(first(survey, "v")).toBe("q0");
    expect(write(survey, "v")).toEqual({ changing: "q0", notified: ["q0", "q1"], validated: "q0" });
  });
  test.each(modes)("a question renamed keeps its place (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, checkErrorsMode: "onValueChanging", elements: [
      { type: "text", name: "q1", valueName: "v" }, { type: "text", name: "q2", valueName: "v" }, nest()] });
    expect(sharing(survey, "v")).toEqual(["q1", "q2"]);
    survey.getQuestionByName("q1").name = "q1x";
    expect(sharing(survey, "v")).toEqual(["q1x", "q2"]);
    expect(first(survey, "v")).toBe("q1x");
    expect(write(survey, "v")).toEqual({ changing: "q1x", notified: ["q1x", "q2"], validated: "q1x" });
  });
  test.each(modes)("a question given a shared value name takes its place in document order (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", valueName: "v" }, nest()] });
    expect(sharing(survey, "v"), "the root is built before the change: re-keyed in place").toEqual(["q2"]);
    survey.getQuestionByName("q1").valueName = "v";
    expect(sharing(survey, "v")).toEqual(["q1", "q2"]);
  });
  test.each(modes)("questions moved, renamed and the mode switched: document order (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, checkErrorsMode: "onValueChanging", pages: [
      { name: "p1", elements: [{ type: "text", name: "q1", valueName: "v" }] },
      { name: "p2", elements: [{ type: "text", name: "q2", valueName: "v" },
        { type: "panel", name: "nest", valueName: "obj", elements: [{ type: "text", name: "inside", valueName: "v" }] },
        { type: "text", name: "q3", valueName: "v" }] }] });
    // A question inside the nesting panel shares the root's key only while the panel does not nest.
    const atRoot = (order: Array<string>): Array<string> => survey.dataNesting === "none" ? order : order.filter(name => name !== "inside");
    expect(sharing(survey, "v"), "#1").toEqual(atRoot(["q1", "q2", "inside", "q3"]));
    const q2 = survey.getQuestionByName("q2");
    q2.parent.removeElement(q2);
    survey.pages[0].addElement(q2, 0);
    expect(sharing(survey, "v"), "#2 moved to an earlier page").toEqual(atRoot(["q2", "q1", "inside", "q3"]));
    expect(first(survey, "v"), "#3").toBe("q2");
    expect(write(survey, "v"), "#4").toEqual({ changing: "q2", notified: atRoot(["q2", "q1", "inside", "q3"]), validated: "q2" });
    survey.getQuestionByName("q1").page = survey.pages[1];
    expect(sharing(survey, "v"), "#5 moved last onto a later page").toEqual(atRoot(["q2", "inside", "q3", "q1"]));
    survey.getQuestionByName("q3").name = "q3a";
    expect(sharing(survey, "v"), "#6 a rename keeps the place").toEqual(atRoot(["q2", "inside", "q3a", "q1"]));
    const other = mode === "none" ? "auto" : "none";
    survey.dataNesting = other;
    expect(sharing(survey, "v"), "#7 dataNesting " + other).toEqual(atRoot(["q2", "inside", "q3a", "q1"]));
    survey.dataNesting = mode;
    expect(sharing(survey, "v"), "#8 dataNesting " + mode + " again").toEqual(atRoot(["q2", "inside", "q3a", "q1"]));
  });
  test.each(modes)("a page inserted before another (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, pages: [{ name: "p1", elements: [{ type: "text", name: "q1", valueName: "v" }, nest()] }] });
    expect(sharing(survey, "v")).toEqual(["q1"]);
    const page = new PageModel("p0");
    const q0 = new QuestionTextModel("q0");
    q0.valueName = "v";
    page.addElement(q0);
    survey.addPage(page, 0);
    expect(sharing(survey, "v")).toEqual(["q0", "q1"]);
  });
  test.each(modes)("questionOrder \"random\": the order of the page's elements at the root's first build (%s)", (mode: string) => {
    const elements: Array<any> = [];
    for (let i = 0; i < 8; i++) elements.push({ type: "text", name: "q" + i, valueName: "v" });
    elements.push(nest());
    const survey = new SurveyModel({ dataNesting: mode, questionOrder: "random", elements: elements });
    const shown = survey.pages[0].elements.filter(el => el.isQuestion).map(el => el.name);
    expect(sharing(survey, "v")).toEqual(shown);
  });
  test.each(modes)("questions appended keep the list live; the list a caller holds is the stored one (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [nest(), { type: "text", name: "q1", valueName: "v" }] });
    const list = survey.getQuestionsByValueName("v");
    const q2 = new QuestionTextModel("q2");
    q2.valueName = "v";
    survey.pages[0].addElement(q2);
    expect(names(survey.getQuestionsByValueName("v"))).toEqual(["q1", "q2"]);
    // "none" gives the list as stored, as on master; an append changes it in place.
    if (mode === "none") expect(names(list), "appended in place").toEqual(["q1", "q2"]);
  });
});

describe("the root's questions are those a walk of its pages reaches", () => {
  test.each(modes)("a dynamic panel's template question with a value name is not the root's (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1", valueName: "shared" }, nest(),
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1", valueName: "shared" }] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const t1 = dp.template.getQuestionByName("t1");
    expect(sharing(survey, "shared")).toEqual(["q1"]);
    survey.setValue("shared", "x");
    expect(t1.value, "a root write does not reach the template").toBeUndefined();
    t1.name = "t9";
    expect(survey.getQuestionsByValueName("t9"), "renamed").toBeNull();
    const p = new PanelModel("tp");
    p.addNewQuestion("text", "t2");
    dp.template.addElement(p);
    expect(survey.getQuestionsByValueName("t2"), "a panel added to the template").toBeNull();
  });
  test.each(modes)("a question inside a question, renamed, is not the root's (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [nest(),
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1" }] },
      { type: "matrixdynamic", name: "mx", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] },
      { type: "multipletext", name: "mt", items: [{ name: "a1" }] }] });
    (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0].getQuestionByName("t1").name = "t9";
    expect(survey.getQuestionsByValueName("t9"), "a record's question").toBeNull();
    const mx = <QuestionMatrixDynamicModel>survey.getQuestionByName("mx");
    const cell = mx.visibleRows[0].cells[0].question;
    mx.columns[0].name = "c9";
    expect(survey.getQuestionsByValueName("c9"), "a matrix column").toBeNull();
    survey.setValue("c9", "x");
    expect(cell.value, "a root write does not reach the cell").toBeUndefined();
    (<QuestionMultipleTextModel>survey.getQuestionByName("mt")).items[0].name = "a9";
    expect(survey.getQuestionsByValueName("a9"), "a multiple text item").toBeNull();
  });
  test.each(modes)("a question taken off its page is not the root's (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [
      { type: "text", name: "q1" }, { type: "panel", name: "p1", elements: [{ type: "text", name: "q2" }] }, { type: "text", name: "q3" }, nest()] });
    expect(sharing(survey, "q1")).toEqual(["q1"]);
    survey.getQuestionByName("q1").page = null;
    survey.getPanelByName("p1").page = null;
    expect(survey.getQuestionsByValueName("q1")).toBeNull();
    expect(survey.getQuestionsByValueName("q2"), "inside a panel taken off").toBeNull();
    expect(sharing(survey, "q3")).toEqual(["q3"]);
  });
  test.each(modes)("a template question moved onto a page is the root's (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, nest(),
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1" }, { type: "text", name: "t2" }] }] });
    const t1 = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).template.getQuestionByName("t1");
    expect(survey.getQuestionsByValueName("t1")).toBeNull();
    t1.page = survey.pages[0];
    expect(sharing(survey, "t1")).toEqual(["t1"]);
    survey.setValue("t1", "x");
    expect(t1.value).toBe("x");
  });
  test.each(modes)("survey.fromJSON without pages: the pages kept are walked (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, nest()] });
    expect(sharing(survey, "q1")).toEqual(["q1"]);
    survey.fromJSON({ title: "t" });
    expect(sharing(survey, "q1")).toEqual(["q1"]);
  });
  test.each(modes)("a name loaded in place is the key from the next build (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, nest()] });
    survey.getQuestionByName("q1").fromJSON({ name: "z" });
    survey.pages[0].addNewQuestion("text", "q3", 0);
    expect(survey.getQuestionsByValueName("q1")).toBeNull();
    expect(sharing(survey, "z")).toEqual(["z"]);
  });
  test.each(modes)("setPage to the element's own page: its later removal notifies the survey (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, nest()] });
    const removed: Array<string> = [];
    survey.onQuestionRemoved.add((_, options) => removed.push(options.name));
    const q1 = survey.getQuestionByName("q1");
    expect(sharing(survey, "q1")).toEqual(["q1"]);
    q1.page = survey.pages[0];
    expect(q1.parent, "nothing moves").toBe(survey.pages[0]);
    q1.parent.removeElement(q1);
    expect(removed).toEqual(["q1"]);
    expect(survey.getQuestionByName("q1"), "found by its name no more").toBeNull();
    expect(survey.getQuestionsByValueName("q1"), "the root lets it go at once").toBeNull();
  });
});

describe("the root read while an element attaches", () => {
  const dynamicPanel = (): QuestionPanelDynamicModel => {
    const dp = new QuestionPanelDynamicModel("dp");
    dp.template.addNewQuestion("text", "d1");
    dp.panelCount = 1;
    return dp;
  };
  test.each(modes)("a panel added last, holding a question taken off a page: document order (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q0" }, { type: "text", name: "old", valueName: "v" }, nest()] });
    const old = survey.getQuestionByName("old");
    survey.pages[0].removeElement(old);
    survey.pages[0].addNewQuestion("text", "q00", 0);
    const panel = new PanelModel("pn");
    panel.addElement(dynamicPanel());
    const t = new QuestionTextModel("t");
    t.valueName = "v";
    panel.addElement(t);
    panel.addElement(old);
    survey.pages[0].addElement(panel);
    expect(sharing(survey, "v")).toEqual(["t", "old"]);
  });
  test.each(modes)("a page removed and added back, a dynamic panel before a question and a choice panel sharing its key (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, pages: [{ name: "p1", elements: [{ type: "text", name: "q0" }] }, { name: "p2", elements: [
      { type: "panel", name: "pn", valueName: "o", elements: [{ type: "text", name: "x" }] },
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "d1" }] },
      { type: "text", name: "t", valueName: "v" },
      { type: "checkbox", name: "cb", choices: [{ value: "a", elements: [{ type: "text", name: "inner", valueName: "v" }] }] }] }] });
    survey.setValue("dp", [{ d1: "x" }]);
    const p2 = survey.pages[1];
    survey.removePage(p2);
    survey.pages[0].addNewQuestion("text", "q00", 0);
    survey.addPage(p2);
    expect(sharing(survey, "v")).toEqual(["t", "inner"]);
    expect(first(survey, "v")).toBe("t");
  });
});

// A choice panel's questions are keys of the scope that holds the select question (CH1): the root at the top level,
// the container's object inside a nesting panel. A choice panel never nests (CH2).
describe("a choice panel's questions are keys of the select question's scope", () => {
  const choice = (name: string, inner: string): any => ({ type: "checkbox", name: name, choices: [{ value: "a", elements: [{ type: "text", name: inner }] }, "b"] });
  const choiceQuestion = (survey: SurveyModel, name: string): Question =>
    <Question>(<any>survey.getAllQuestions(false, false, true)).filter((q: Question) => q.name === name)[0];
  test.each(modes)("held, written and kept, also inside a nesting panel (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [choice("q", "inner"),
      { type: "panel", name: "pn", valueName: "obj", elements: [choice("q2", "inner2"), { type: "text", name: "t" }] }] });
    const inner = choiceQuestion(survey, "inner");
    const inner2 = choiceQuestion(survey, "inner2");
    expect(sharing(survey, "inner")).toEqual(["inner"]);
    survey.setValue("inner", "x");
    inner2.value = "y";
    expect(inner.value).toBe("x");
    if (mode === "none") {
      expect(sharing(survey, "inner2"), "the panel does not nest: a root key").toEqual(["inner2"]);
      expect(survey.data).toEqual({ inner: "x", inner2: "y" });
    } else {
      expect(survey.getQuestionsByValueName("inner2"), "a key of the panel's object, not of the root").toBeNull();
      expect(inner2.getDataPath()).toEqual(["obj", "inner2"]);
      expect(survey.data).toEqual({ inner: "x", obj: { inner2: "y" } });
    }
    const data = survey.data;
    survey.clearIncorrectValues(true);
    expect(survey.data, "the keys are known in their scopes").toEqual(data);
  });
  test.each(modes)("a select built apart and added: its choice panel is the root's once linked (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q0" }, nest()] });
    const q = new QuestionCheckboxModel("q");
    q.fromJSON(choice("q", "inner"));
    survey.pages[0].addElement(q, 0);
    const panel = q.choices[0].panel;
    expect(sharing(survey, "inner"), "linked by the read of item.panel").toEqual(["inner"]);
    survey.setValue("inner", "x");
    expect(panel.getQuestionByName("inner").value).toBe("x");
  });
  test.each(modes)("a select built apart, added last to a built root: the add links its choice panel and builds the root again (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [nest(), { type: "text", name: "q0" }] });
    expect(sharing(survey, "q0")).toEqual(["q0"]);
    const q = new QuestionCheckboxModel("q");
    q.fromJSON(choice("q", "inner"));
    survey.pages[0].addElement(q);
    expect(sharing(survey, "inner"), "linked by the add: the select question got its survey impl").toEqual(["inner"]);
    const panel = q.choices[0].panel;
    survey.setValue("inner", "x");
    expect(panel.getQuestionByName("inner").value).toBe("x");
  });
  test.each(modes)("a choice panel's question added in code is the root's (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "checkbox", name: "q", choices: ["a", "b"] }, nest()] });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
    q.choices[0].panel.addNewQuestion("text", "inner");
    expect(sharing(survey, "inner")).toEqual(["inner"]);
  });
  test("a select with a linked choice panel moved into a nesting panel, the root built: its questions follow it", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [choice("cb", "inner"),
      { type: "panel", name: "pp", valueName: "obj", elements: [{ type: "text", name: "t" }] }] });
    expect(sharing(survey, "inner")).toEqual(["inner"]);
    const cb = survey.getQuestionByName("cb");
    cb.parent.removeElement(cb);
    expect(survey.getQuestionsByValueName("inner"), "the select removed").toBeNull();
    const pp = survey.getPanelByName("pp");
    pp.addElement(cb);
    expect(survey.getQuestionsByValueName("inner"), "added below a container: no longer the root's").toBeNull();
    const inner = (<QuestionCheckboxModel>cb).choices[0].panel.getQuestionByName("inner");
    expect(pp.getDataScope().getDataKeyIndex().getQuestions("inner"), "the container's").toEqual([inner]);
    inner.value = "w";
    expect(survey.data).toEqual({ obj: { inner: "w" } });
    survey.setValue("obj", { inner: "v" });
    expect(inner.value, "it reads the container's object").toBe("v");
    pp.removeElement(cb);
    survey.pages[0].addElement(cb);
    expect(sharing(survey, "inner"), "moved back to the page: the root's again").toEqual(["inner"]);
    expect(inner.getDataPath()).toEqual(["inner"]);
  });
  test.each(modes)("choices replaced, or the select removed: the old choice panel's question leaves the root (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [choice("q", "inner"), choice("r", "inner2"), nest()] });
    expect(sharing(survey, "inner")).toEqual(["inner"]);
    (<QuestionCheckboxModel>survey.getQuestionByName("q")).choices = ["a", "b"];
    expect(survey.getQuestionsByValueName("inner"), "choices replaced").toBeNull();
    const r = survey.getQuestionByName("r");
    expect(sharing(survey, "inner2")).toEqual(["inner2"]);
    r.parent.removeElement(r);
    expect(survey.getQuestionsByValueName("inner2"), "the select removed").toBeNull();
  });
  test("a panel with a value name inside a choice panel nests in the select question's scope", () => {
    const select = (name: string): any => ({ type: "checkbox", name: name,
      choices: [{ value: "a", elements: [{ type: "panel", name: "pn", valueName: "obj", elements: [{ type: "text", name: "x" }] }] }] });
    const json = { dataNesting: "auto", elements: [select("q"), { type: "panel", name: "outer", valueName: "out", elements: [select("q2")] }] };
    const xs = (survey: SurveyModel): Array<Question> => (<Array<Question>>(<any>survey.getAllQuestions(false, false, true))).filter(q => q.name === "x");
    const survey = new SurveyModel(json);
    const [x, x2] = xs(survey);
    survey.setValue("obj", { x: "1" });
    expect(x.value, "at the top level: a root container").toBe("1");
    expect(x2.getDataPath(), "inside a nesting panel: in the panel's object").toEqual(["out", "obj", "x"]);
    x2.value = "2";
    expect(survey.data).toEqual({ obj: { x: "1" }, out: { obj: { x: "2" } } });
    survey.clearIncorrectValues(true);
    expect(survey.data).toEqual({ obj: { x: "1" }, out: { obj: { x: "2" } } });
    const loaded = new SurveyModel(json);
    loaded.data = survey.data;
    expect(xs(loaded).map(q => q.value), "loaded back").toEqual(["1", "2"]);
  });
});

describe("what builds the root again", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  // Private: how often the root builds its index has no public effect; these pin that the root's append is kept.
  const countBuilds = (survey: SurveyModel): { count: number } => {
    const root: any = survey.getRootDataScope();
    const res = { count: 0 };
    const build = root.buildDataKeyIndex.bind(root);
    vi.spyOn(root, "buildDataKeyIndex").mockImplementation((walked: any) => { res.count++; return build(walked); });
    return res;
  };
  test("questions added to a dynamic panel's template leave the root alone", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" },
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t0" }] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    survey.getQuestionByValueName("a");
    const builds = countBuilds(survey);
    for (let i = 1; i <= 5; i++) {
      dp.template.addNewQuestion("text", "t" + i);
      survey.getQuestionByValueName("a");
    }
    expect(builds.count).toBe(0);
  });
  test("questions appended to the last page are taken in place", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }] });
    survey.getQuestionByValueName("a");
    const builds = countBuilds(survey);
    for (let i = 1; i <= 5; i++) {
      survey.pages[0].addNewQuestion("text", "q" + i);
      survey.getQuestionByValueName("a");
    }
    expect(builds.count).toBe(0);
    expect(sharing(survey, "q5")).toEqual(["q5"]);
  });
});
