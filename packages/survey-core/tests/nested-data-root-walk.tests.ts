import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";
import "../src/question_checkbox";

// Scoped names 06, Part C: the root data scope walks its pages in document order, as every scope below it does
// (differences-06.md, W1 and W2). Each row holds in "none" and in "auto", where a container nests (nest()).

const modes = ["none", "auto"];
const names = (list: Array<Question>): Array<string> => (list || []).map(q => q.name);
const sharing = (survey: SurveyModel, valueName: string): Array<string> => names(survey.getQuestionsByValueName(valueName));
const first = (survey: SurveyModel, valueName: string): string => survey.getQuestionByValueName(valueName)?.name || null;
// A panel that nests in "auto": the survey has used a data scope there.
const nest = (): any => ({ type: "panel", name: "nest", valueName: "obj", elements: [{ type: "text", name: "inside" }] });

// A write of the key: the question onValueChanging reports, the order the questions on the key are told in, and the
// question validated first (checkErrorsMode "onValueChanging").
const write = (survey: SurveyModel, valueName: string): { changing: string, notified: Array<string>, validated: string } => {
  const notified: Array<string> = [];
  const validated: Array<string> = [];
  survey.getAllQuestions().forEach((q: Question) => {
    const notify = q.onSurveyValueChanged.bind(q);
    vi.spyOn(q, "onSurveyValueChanged").mockImplementation((val: any) => { notified.push(q.name); notify(val); });
    const validate = q.validate.bind(q);
    vi.spyOn(q, "validate").mockImplementation((...args: Array<any>) => { validated.push(q.name); return validate(...args); });
  });
  let changing: string = null;
  survey.onValueChanging.add((_, options) => { changing = options.question?.name || null; });
  survey.setValue(valueName, "x");
  return { changing: changing, notified: notified, validated: validated[0] || null };
};

describe("scoped names 06, W1: the root keeps document order", () => {
  afterEach(() => { vi.restoreAllMocks(); });
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
  test.each(modes)("a question moved to an earlier page (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, checkErrorsMode: "onValueChanging", pages: [
      { name: "p1", elements: [{ type: "text", name: "q1", valueName: "v" }] },
      { name: "p2", elements: [{ type: "text", name: "q2", valueName: "v" }, nest()] }] });
    expect(sharing(survey, "v")).toEqual(["q1", "q2"]);
    const q2 = survey.getQuestionByName("q2");
    q2.parent.removeElement(q2);
    survey.pages[0].addElement(q2, 0);
    expect(sharing(survey, "v")).toEqual(["q2", "q1"]);
    expect(first(survey, "v")).toBe("q2");
    expect(write(survey, "v")).toEqual({ changing: "q2", notified: ["q2", "q1"], validated: "q2" });
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

describe("scoped names 06, W2: the root's questions are those a walk of its pages reaches", () => {
  test.each(modes)("a dynamic panel's template question with a value name is not the root's (M1) (%s)", (mode: string) => {
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
    expect(survey.getQuestionsByValueName("t2"), "a panel added to the template (M2)").toBeNull();
  });
  test.each(modes)("a question inside a question, renamed, is not the root's (M3) (%s)", (mode: string) => {
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
  test.each(modes)("a question taken off its page is not the root's (M4) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [
      { type: "text", name: "q1" }, { type: "panel", name: "p1", elements: [{ type: "text", name: "q2" }] }, { type: "text", name: "q3" }, nest()] });
    expect(sharing(survey, "q1")).toEqual(["q1"]);
    survey.getQuestionByName("q1").page = null;
    survey.getPanelByName("p1").page = null;
    expect(survey.getQuestionsByValueName("q1")).toBeNull();
    expect(survey.getQuestionsByValueName("q2"), "inside a panel taken off").toBeNull();
    expect(sharing(survey, "q3")).toEqual(["q3"]);
  });
  test.each(modes)("a template question moved onto a page is the root's (M5) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, nest(),
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t1" }, { type: "text", name: "t2" }] }] });
    const t1 = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).template.getQuestionByName("t1");
    expect(survey.getQuestionsByValueName("t1")).toBeNull();
    t1.page = survey.pages[0];
    expect(sharing(survey, "t1")).toEqual(["t1"]);
    survey.setValue("t1", "x");
    expect(t1.value).toBe("x");
  });
  test.each(modes)("survey.fromJSON without pages: the pages kept are walked (M6) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, nest()] });
    expect(sharing(survey, "q1")).toEqual(["q1"]);
    survey.fromJSON({ title: "t" });
    expect(sharing(survey, "q1")).toEqual(["q1"]);
  });
  test.each(modes)("a name loaded in place is the key from the next build (M7) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, nest()] });
    survey.getQuestionByName("q1").fromJSON({ name: "z" });
    survey.pages[0].addNewQuestion("text", "q3", 0);
    expect(survey.getQuestionsByValueName("q1")).toBeNull();
    expect(sharing(survey, "z")).toEqual(["z"]);
  });
  test.each(modes)("setPage to the element's own page: its later removal notifies the survey (M8) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, nest()] });
    const removed: Array<string> = [];
    survey.onQuestionRemoved.add((_, options) => removed.push(options.name));
    const q1 = survey.getQuestionByName("q1");
    expect(sharing(survey, "q1")).toEqual(["q1"]);
    q1.page = survey.pages[0];
    expect(q1.parent, "nothing moves").toBe(survey.pages[0]);
    expect((<any>q1).prevSurvey, "no survey left behind").toBeUndefined();
    q1.parent.removeElement(q1);
    expect(removed).toEqual(["q1"]);
    expect(survey.getQuestionByName("q1"), "found by its name no more").toBeNull();
    expect(survey.getQuestionsByValueName("q1"), "the root lets it go at once").toBeNull();
  });
});

describe("scoped names 06: the root read while an element attaches", () => {
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

describe("scoped names 06: a choice panel's questions are the root's (M9 to M12)", () => {
  const choice = (name: string, inner: string): any => ({ type: "checkbox", name: name, choices: [{ value: "a", elements: [{ type: "text", name: inner }] }, "b"] });
  const choiceQuestion = (survey: SurveyModel, name: string): Question =>
    <Question>(<any>survey.getAllQuestions(false, false, true)).filter((q: Question) => q.name === name)[0];
  test.each(modes)("held, written and kept, also inside a nesting panel (M9) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [choice("q", "inner"),
      { type: "panel", name: "pn", valueName: "obj", elements: [choice("q2", "inner2"), { type: "text", name: "t" }] }] });
    const inner = choiceQuestion(survey, "inner");
    const inner2 = choiceQuestion(survey, "inner2");
    expect(sharing(survey, "inner")).toEqual(["inner"]);
    expect(sharing(survey, "inner2"), "the select question is inside a panel").toEqual(["inner2"]);
    survey.setValue("inner", "x");
    survey.setValue("inner2", "y");
    expect(inner.value).toBe("x");
    expect(inner2.value).toBe("y");
    survey.clearIncorrectValues(true);
    expect(survey.data.inner).toBe("x");
    expect(survey.data.inner2).toBe("y");
  });
  test.each(modes)("a select built apart and added: its choice panel is the root's once linked (M10) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "text", name: "q0" }, nest()] });
    const q = new QuestionCheckboxModel("q");
    q.fromJSON(choice("q", "inner"));
    survey.pages[0].addElement(q, 0);
    const panel = q.choices[0].panel;
    expect(sharing(survey, "inner"), "linked by the read of item.panel").toEqual(["inner"]);
    survey.setValue("inner", "x");
    expect(panel.getQuestionByName("inner").value).toBe("x");
  });
  test.each(modes)("a select built apart, added last to a built root, then linked: the link builds the root again (M10) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [nest(), { type: "text", name: "q0" }] });
    expect(sharing(survey, "q0")).toEqual(["q0"]);
    const q = new QuestionCheckboxModel("q");
    q.fromJSON(choice("q", "inner"));
    survey.pages[0].addElement(q);
    expect(survey.getQuestionsByValueName("inner"), "not linked yet").toBeNull();
    const panel = q.choices[0].panel;
    expect(sharing(survey, "inner"), "linked by the read of item.panel").toEqual(["inner"]);
    survey.setValue("inner", "x");
    expect(panel.getQuestionByName("inner").value).toBe("x");
  });
  test.each(modes)("a choice panel's question added in code is the root's (M10) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [{ type: "checkbox", name: "q", choices: ["a", "b"] }, nest()] });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
    q.choices[0].panel.addNewQuestion("text", "inner");
    expect(sharing(survey, "inner")).toEqual(["inner"]);
  });
  test("a select with a linked choice panel moved into a nesting panel, the root built: still the root's (M10)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [choice("cb", "inner"),
      { type: "panel", name: "pp", valueName: "obj", elements: [{ type: "text", name: "t" }] }] });
    expect(sharing(survey, "inner")).toEqual(["inner"]);
    const cb = survey.getQuestionByName("cb");
    cb.parent.removeElement(cb);
    expect(survey.getQuestionsByValueName("inner"), "the select removed").toBeNull();
    survey.getPanelByName("pp").addElement(cb);
    expect(sharing(survey, "inner"), "added below a container: the root is built again").toEqual(["inner"]);
    survey.setValue("inner", "w");
    expect((<QuestionCheckboxModel>cb).choices[0].panel.getQuestionByName("inner").value).toBe("w");
  });
  test.each(modes)("choices replaced, or the select removed: the old choice panel's question leaves the root (M11) (%s)", (mode: string) => {
    const survey = new SurveyModel({ dataNesting: mode, elements: [choice("q", "inner"), choice("r", "inner2"), nest()] });
    expect(sharing(survey, "inner")).toEqual(["inner"]);
    (<QuestionCheckboxModel>survey.getQuestionByName("q")).choices = ["a", "b"];
    expect(survey.getQuestionsByValueName("inner"), "choices replaced").toBeNull();
    const r = survey.getQuestionByName("r");
    expect(sharing(survey, "inner2")).toEqual(["inner2"]);
    r.parent.removeElement(r);
    expect(survey.getQuestionsByValueName("inner2"), "the select removed").toBeNull();
  });
  test("a panel with a value name inside a choice panel is a root container (M12)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "checkbox", name: "q",
      choices: [{ value: "a", elements: [{ type: "panel", name: "pn", valueName: "obj", elements: [{ type: "text", name: "x" }] }] }] }] });
    const x = choiceQuestion(survey, "x");
    survey.setValue("obj", { x: "1" });
    expect(x.value).toBe("1");
    survey.clearIncorrectValues(true);
    expect(survey.data.obj).toEqual({ x: "1" });
  });
});

describe("scoped names 06: what builds the root again", () => {
  afterEach(() => { vi.restoreAllMocks(); });
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
